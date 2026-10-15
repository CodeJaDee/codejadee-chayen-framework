using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Xunit;
using static SqlServerFacts.FactDb;

namespace SqlServerFacts;

[Collection("db")]
public class TsqlFacts(FactDb db)
{
    [Fact] // sqlserver-tsql
    public void SF01_PostgreSqlSyntaxIsRejectedAndTsqlEquivalentsRun()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE dbo.Dialect (Id int PRIMARY KEY, Name nvarchar(50) NOT NULL); INSERT dbo.Dialect VALUES (1, N'a'), (2, N'b');");
        var errors = new[]
        {
            "SELECT Id FROM dbo.Dialect ORDER BY Id LIMIT 1;",
            "INSERT INTO dbo.Dialect (Id, Name) VALUES (1, N'x') ON CONFLICT DO NOTHING;",
            "INSERT INTO dbo.Dialect (Id, Name) VALUES (3, N'c') RETURNING Id;",
            "SELECT '1'::int;",
            "SELECT Id FROM dbo.Dialect WHERE Name ILIKE N'A';",
        }.Select(pg => Fails(() => Exec(c, pg)).Number).ToList();
        Observed.Write("SF01", $"PostgreSQL forms rejected with errors {string.Join(", ", errors)} (LIMIT, ON CONFLICT, RETURNING, ::, ILIKE)");
        Assert.Equal(0, Scalar<int>(c, "SELECT COUNT(*) FROM dbo.Dialect WHERE Id = 3;")); // nothing was written by the rejected statements
        Assert.Equal(1, Scalar<int>(c, "SELECT TOP (1) Id FROM dbo.Dialect ORDER BY Id;"));
        Assert.Equal(2, Scalar<int>(c, "SELECT Id FROM dbo.Dialect ORDER BY Id OFFSET 1 ROWS FETCH NEXT 1 ROWS ONLY;"));
        Assert.Equal(3, Scalar<int>(c, "INSERT INTO dbo.Dialect (Id, Name) OUTPUT inserted.Id VALUES (3, N'c');"));
        Assert.Equal(1, Scalar<int>(c, "SELECT TRY_CAST('1' AS int);"));
    }

    [Fact] // sqlserver-tsql
    public void SF02_CollationDecidesCaseSensitivityOfComparisonsAndUniqueness()
    {
        using var c = db.Open();
        var collation = Scalar<string>(c, "SELECT CAST(DATABASEPROPERTYEX(DB_NAME(), 'Collation') AS nvarchar(128));");
        Assert.Contains("_CI_", collation); // the default for a new database on this instance
        Exec(c, "CREATE TABLE dbo.CiNames (Name nvarchar(50) NOT NULL CONSTRAINT UQ_CiNames UNIQUE);");
        Exec(c, "CREATE TABLE dbo.CsNames (Name nvarchar(50) COLLATE Latin1_General_100_CS_AS NOT NULL CONSTRAINT UQ_CsNames UNIQUE);");
        Exec(c, "INSERT dbo.CiNames VALUES (N'Alpha'); INSERT dbo.CsNames VALUES (N'Alpha'), (N'ALPHA');");
        Assert.Equal(2627, Fails(() => Exec(c, "INSERT dbo.CiNames VALUES (N'ALPHA');")).Number);
        Assert.Equal(1, Scalar<int>(c, "SELECT COUNT(*) FROM dbo.CiNames WHERE Name = N'alpha';"));
        Assert.Equal(0, Scalar<int>(c, "SELECT COUNT(*) FROM dbo.CsNames WHERE Name = N'alpha';"));
    }

    [Fact] // sqlserver-tsql
    public void SF03_EfCoreSqlServerProviderEmitsTsqlNotPostgreSql()
    {
        using var ctx = new FactContext(db.ConnectionString());
        var page = ctx.Orders.OrderBy(o => o.Id).Skip(10).Take(5).ToQueryString();
        var top = ctx.Orders.OrderBy(o => o.Id).Take(3).ToQueryString();
        var term = "A1";
        var like = ctx.Orders.Where(o => o.Number.Contains(term)).ToQueryString();
        Assert.Contains("OFFSET @", page);
        Assert.Contains("FETCH NEXT @", page);
        Assert.Contains("[Orders]", page);
        Assert.Contains("TOP(@", top);
        Assert.Contains("LIKE", like);
        foreach (var sql in new[] { page, top, like })
        {
            Assert.DoesNotContain("LIMIT", sql);
            Assert.DoesNotContain("ILIKE", sql);
            Assert.DoesNotContain("\"Orders\"", sql);
        }
    }

    [Fact] // sqlserver-tsql
    public void SF04_EfCoreCollectionTranslationDependsOnProviderOptions()
    {
        var ids = new[] { 1, 2, 3 };
        using var current = new FactContext(db.ConnectionString());
        using var legacy = new FactContext(db.ConnectionString(), o => o.UseCompatibilityLevel(120));
        var now = current.Orders.Where(o => ids.Contains(o.Id)).ToQueryString();
        var old = legacy.Orders.Where(o => ids.Contains(o.Id)).ToQueryString();
        Assert.DoesNotContain("= ANY", now);      // the PostgreSQL array form is never emitted for SQL Server
        Assert.DoesNotContain("OPENJSON", old);   // compatibility level 120 has no OPENJSON
        Assert.Contains(" IN (", old);
        foreach (var sql in new[] { now, old })
            Assert.DoesNotContain("IN (1, 2, 3)", sql); // values stay parameters, not inlined constants
        Observed.Write("SF04", $"default options: {now.Replace('\n', ' ')} | compatibility level 120: {old.Replace('\n', ' ')}");
    }

    [Fact] // sqlserver-stored-procedures
    public void SF05_ParameterizedClientCallDoesNotProtectConcatenatedDynamicSql()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE dbo.Customers5 (Name nvarchar(200) NOT NULL); CREATE TABLE dbo.Probe5 (Note nvarchar(50) NOT NULL); INSERT dbo.Customers5 VALUES (N'Ann');");
        Exec(c, "CREATE PROCEDURE dbo.SearchConcat @name nvarchar(200) AS EXEC (N'SELECT COUNT(*) FROM dbo.Customers5 WHERE Name = N''' + @name + N'''');");
        Exec(c, "CREATE PROCEDURE dbo.SearchParam @name nvarchar(200) AS EXEC sp_executesql N'SELECT COUNT(*) FROM dbo.Customers5 WHERE Name = @n', N'@n nvarchar(200)', @n = @name;");
        const string payload = "x'; INSERT dbo.Probe5 VALUES (N'injected'); --";
        foreach (var proc in new[] { "dbo.SearchParam", "dbo.SearchConcat" })
        {
            using var cmd = new SqlCommand(proc, c) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.Add(new SqlParameter("@name", SqlDbType.NVarChar, 200) { Value = payload });
            cmd.ExecuteNonQuery();
            if (proc == "dbo.SearchParam") Assert.Equal(0, Scalar<int>(c, "SELECT COUNT(*) FROM dbo.Probe5;"));
        }
        Assert.Equal(1, Scalar<int>(c, "SELECT COUNT(*) FROM dbo.Probe5;")); // only the concatenating procedure ran the payload
    }

    [Fact] // sqlserver-stored-procedures
    public void SF06_ProcedurePlanIsCachedForTheFirstParameterValue()
    {
        using var c = db.Open();
        Exec(c, """
            CREATE TABLE dbo.Skew (Id int IDENTITY PRIMARY KEY, Status int NOT NULL, Pad char(100) NOT NULL DEFAULT '');
            INSERT dbo.Skew (Status) SELECT TOP (20000) 1 FROM sys.all_columns a CROSS JOIN sys.all_columns b;
            INSERT dbo.Skew (Status) VALUES (2), (2), (2);
            CREATE INDEX IX_Skew_Status ON dbo.Skew (Status);
            """);
        Exec(c, "CREATE PROCEDURE dbo.ByStatus @s int AS SELECT Id, Pad FROM dbo.Skew WHERE Status = @s;");
        foreach (var s in new[] { 2, 1 })
        {
            using var cmd = new SqlCommand("dbo.ByStatus", c) { CommandType = CommandType.StoredProcedure };
            cmd.Parameters.Add(new SqlParameter("@s", SqlDbType.Int) { Value = s });
            using var r = cmd.ExecuteReader();
            while (r.Read()) { }
        }
        Assert.Equal(2, Scalar<int>(c, "SELECT SUM(execution_count) FROM sys.dm_exec_procedure_stats WHERE database_id = DB_ID() AND object_id = OBJECT_ID('dbo.ByStatus');"));
        var plan = Scalar<string>(c, "SELECT TOP (1) CAST(qp.query_plan AS nvarchar(max)) FROM sys.dm_exec_procedure_stats ps CROSS APPLY sys.dm_exec_query_plan(ps.plan_handle) qp WHERE ps.database_id = DB_ID() AND ps.object_id = OBJECT_ID('dbo.ByStatus');");
        Assert.Contains("ParameterCompiledValue=\"(2)\"", plan); // the second call (Status = 1) reused the plan compiled for 2
    }
}
