using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Xunit;
using static SqlServerFacts.FactDb;

namespace SqlServerFacts;

[Collection("db")]
public class ConcurrencyFacts(FactDb db)
{
    [Fact] // sqlserver-locking-deadlocks
    public async Task SF12_OppositeLockOrderDeadlocksAndOneTransactionIsRolledBack()
    {
        using (var setup = db.Open())
            Exec(setup, "CREATE TABLE dbo.Accounts (Id int PRIMARY KEY, Balance int NOT NULL); INSERT dbo.Accounts VALUES (1, 100), (2, 100);");
        using var a = db.Open();
        using var b = db.Open();
        using var ta = a.BeginTransaction();
        using var tb = b.BeginTransaction();
        new SqlCommand("UPDATE dbo.Accounts SET Balance -= 10 WHERE Id = 1;", a, ta).ExecuteNonQuery();
        new SqlCommand("UPDATE dbo.Accounts SET Balance -= 20 WHERE Id = 2;", b, tb).ExecuteNonQuery();
        var first = Task.Run(() => new SqlCommand("UPDATE dbo.Accounts SET Balance += 10 WHERE Id = 2;", a, ta).ExecuteNonQuery());
        await Task.Delay(500);
        var second = Task.Run(() => new SqlCommand("UPDATE dbo.Accounts SET Balance += 20 WHERE Id = 1;", b, tb).ExecuteNonQuery());
        var outcomes = new List<int>();
        foreach (var t in new[] { first, second })
        {
            try { await t; outcomes.Add(0); }
            catch (SqlException e) { outcomes.Add(e.Number); }
        }
        Assert.Single(outcomes, 1205);
        Assert.Single(outcomes, 0);
        var winner = outcomes[0] == 0 ? ta : tb;
        winner.Commit();
        using var check = db.Open();
        var balances = Scalar<string>(check, "SELECT STRING_AGG(CAST(Balance AS varchar(10)), ',') WITHIN GROUP (ORDER BY Id) FROM dbo.Accounts;");
        // Only the winner's transfer remains: the victim's first update was rolled back with its whole transaction.
        Assert.Equal(outcomes[0] == 0 ? "90,110" : "120,80", balances);
    }

    [Fact] // sqlserver-locking-deadlocks
    public void SF13_LargeSingleStatementEscalatesToATableLockWhileBatchesDoNot()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE dbo.Escalate (Id int PRIMARY KEY, V int NOT NULL); INSERT dbo.Escalate SELECT TOP (10000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)), 0 FROM sys.all_columns a CROSS JOIN sys.all_columns b;");
        const string objectLock = "SELECT TOP (1) request_mode FROM sys.dm_tran_locks WHERE request_session_id = @@SPID AND resource_type = 'OBJECT' AND resource_associated_entity_id = OBJECT_ID('dbo.Escalate');";
        using (var t = c.BeginTransaction())
        {
            new SqlCommand("UPDATE dbo.Escalate SET V = 1 WHERE Id <= 1000;", c, t).ExecuteNonQuery();
            Assert.Equal("IX", (string)new SqlCommand(objectLock, c, t).ExecuteScalar()!);
            t.Rollback();
        }
        using (var t = c.BeginTransaction())
        {
            new SqlCommand("UPDATE dbo.Escalate SET V = 1 WHERE Id <= 9000;", c, t).ExecuteNonQuery();
            Assert.Equal("X", (string)new SqlCommand(objectLock, c, t).ExecuteScalar()!);
            t.Rollback();
        }
    }

    [Fact] // sqlserver-transactions
    public void SF14_ReadCommittedBlocksReadersUntilReadCommittedSnapshotIsOn()
    {
        using var setup = db.Open();
        Exec(setup, "CREATE TABLE dbo.Stock (Id int PRIMARY KEY, Qty int NOT NULL); INSERT dbo.Stock VALUES (1, 10);");
        Assert.Equal(0, Scalar<int>(setup, "SELECT CAST(is_read_committed_snapshot_on AS int) FROM sys.databases WHERE name = DB_NAME();"));
        int Read(out int number)
        {
            using var writer = db.Open();
            using var tx = writer.BeginTransaction();
            new SqlCommand("UPDATE dbo.Stock SET Qty = 5 WHERE Id = 1;", writer, tx).ExecuteNonQuery();
            using var reader = db.Open();
            Exec(reader, "SET LOCK_TIMEOUT 1000;");
            number = 0;
            try { return Scalar<int>(reader, "SELECT Qty FROM dbo.Stock WHERE Id = 1;"); }
            catch (SqlException e) { number = e.Number; return -1; }
            finally { tx.Rollback(); }
        }
        Assert.Equal(-1, Read(out var blocked));
        Assert.Equal(1222, blocked);
        try
        {
            Exec(setup, $"ALTER DATABASE [{db.Name}] SET READ_COMMITTED_SNAPSHOT ON WITH ROLLBACK IMMEDIATE;");
            Assert.Equal(10, Read(out var none)); // the last committed version, without waiting
            Assert.Equal(0, none);
        }
        finally
        {
            using var reset = db.Open();
            Exec(reset, $"ALTER DATABASE [{db.Name}] SET READ_COMMITTED_SNAPSHOT OFF WITH ROLLBACK IMMEDIATE;");
        }
    }

    [Fact] // sqlserver-transactions
    public void SF15_WithoutXactAbortAFailedStatementLeavesTheTransactionCommittable()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE dbo.Pay (Id int PRIMARY KEY);");
        const string batch = "BEGIN TRAN; INSERT dbo.Pay VALUES (1); INSERT dbo.Pay VALUES (1); INSERT dbo.Pay VALUES (2); COMMIT;";
        Assert.Equal(2627, Fails(() => Exec(c, "SET XACT_ABORT OFF; " + batch)).Number);
        Assert.Equal(2, Scalar<int>(c, "SELECT COUNT(*) FROM dbo.Pay;")); // partial work committed
        Exec(c, "DELETE dbo.Pay;");
        Assert.Equal(2627, Fails(() => Exec(c, "SET XACT_ABORT ON; " + batch)).Number);
        Assert.Equal(0, Scalar<int>(c, "IF @@TRANCOUNT > 0 ROLLBACK; SELECT COUNT(*) FROM dbo.Pay;")); // whole transaction rolled back
    }

    [Fact] // sqlserver-transactions
    public void SF16_SaveChangesIsAtomicAndUntrackedChangesAreNotSaved()
    {
        var cs = db.ConnectionString();
        FactContext.EnsureSeeded(cs);
        using (var ctx = new FactContext(cs))
        {
            var customerId = ctx.Customers.Select(x => x.Id).First();
            ctx.Orders.Add(new Order { Number = "SF16-new", CustomerId = customerId });
            ctx.Orders.Add(new Order { Number = "N0a", CustomerId = customerId }); // duplicates a seeded unique number
            Assert.Throws<DbUpdateException>(() => ctx.SaveChanges());
        }
        using (var ctx = new FactContext(cs))
        {
            Assert.False(ctx.Orders.Any(o => o.Number == "SF16-new")); // the valid row was rolled back too
            var detached = ctx.Orders.AsNoTracking().First(o => o.Number == "N0b");
            detached.Total = 99m;
            Assert.Empty(ctx.ChangeTracker.Entries());
            Assert.Equal(0, ctx.SaveChanges());
            var tracked = ctx.Orders.First(o => o.Number == "N0b");
            Assert.Equal(0m, tracked.Total);
            tracked.Total = 42m;
            Assert.Equal(1, ctx.SaveChanges());
        }
    }

    [Fact] // sqlserver-transactions
    public void SF17_RetryingExecutionStrategyRejectsUnwrappedUserTransactions()
    {
        var cs = db.ConnectionString();
        FactContext.EnsureSeeded(cs);
        using (var ctx = new FactContext(cs, o => o.EnableRetryOnFailure()))
        {
            var customerId = ctx.Customers.Select(x => x.Id).First();
            var e = Assert.Throws<InvalidOperationException>(() =>
            {
                using var tx = ctx.Database.BeginTransaction();
                ctx.Orders.Add(new Order { Number = "SF17-a", CustomerId = customerId });
                ctx.SaveChanges();
                tx.Commit();
            });
            Assert.Contains("user-initiated transactions", e.Message);
        }
        using (var ctx = new FactContext(cs, o => o.EnableRetryOnFailure()))
        {
            var customerId = ctx.Customers.Select(x => x.Id).First();
            ctx.Database.CreateExecutionStrategy().Execute(() =>
            {
                using var tx = ctx.Database.BeginTransaction();
                ctx.Orders.Add(new Order { Number = "SF17-b", CustomerId = customerId });
                ctx.SaveChanges();
                tx.Commit();
            });
            Assert.True(ctx.Orders.Any(o => o.Number == "SF17-b"));
        }
    }
}
