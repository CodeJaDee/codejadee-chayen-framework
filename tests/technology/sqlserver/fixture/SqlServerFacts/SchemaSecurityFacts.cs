using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Xunit;
using static SqlServerFacts.FactDb;

namespace SqlServerFacts;

[Collection("db")]
public class SchemaSecurityFacts(FactDb db)
{
    [Fact] // sqlserver-schema-evolution
    public void SF18_NocheckConstraintIsUntrustedUntilRevalidatedAfterCleanup()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE dbo.Parent18 (Id int PRIMARY KEY); CREATE TABLE dbo.Child18 (Id int PRIMARY KEY, ParentId int NOT NULL); INSERT dbo.Parent18 VALUES (1); INSERT dbo.Child18 VALUES (1, 1), (2, 999);");
        Exec(c, "ALTER TABLE dbo.Child18 WITH NOCHECK ADD CONSTRAINT FK_Child18_Parent FOREIGN KEY (ParentId) REFERENCES dbo.Parent18 (Id);");
        const string trusted = "SELECT CAST(is_not_trusted AS int) FROM sys.foreign_keys WHERE name = 'FK_Child18_Parent';";
        Assert.Equal(1, Scalar<int>(c, trusted));
        Assert.Equal(547, Fails(() => Exec(c, "ALTER TABLE dbo.Child18 WITH CHECK CHECK CONSTRAINT FK_Child18_Parent;")).Number);
        Assert.Equal(1, Scalar<int>(c, "SELECT COUNT(*) FROM dbo.Child18 ch WHERE NOT EXISTS (SELECT 1 FROM dbo.Parent18 p WHERE p.Id = ch.ParentId);"));
        Exec(c, "DELETE dbo.Child18 WHERE Id = 2;");
        Exec(c, "ALTER TABLE dbo.Child18 WITH CHECK CHECK CONSTRAINT FK_Child18_Parent;");
        Assert.Equal(0, Scalar<int>(c, trusted));
    }

    [Fact] // sqlserver-schema-evolution
    public void SF19_OnlineIndexOperationsDependOnTheEdition()
    {
        using var c = db.Open();
        var engineEdition = Scalar<int>(c, "SELECT CAST(SERVERPROPERTY('EngineEdition') AS int);");
        Exec(c, "CREATE TABLE dbo.Online19 (Id int PRIMARY KEY, V int NOT NULL);");
        const string online = "CREATE INDEX IX_Online19_V ON dbo.Online19 (V) WITH (ONLINE = ON);";
        if (engineEdition is 3 or 5 or 8) Exec(c, online); // Enterprise/Developer, Azure SQL Database, Managed Instance
        else Assert.Equal(1712, Fails(() => Exec(c, online)).Number);
        Observed.Write("SF19", $"engine edition {engineEdition}: ONLINE = ON {(engineEdition is 3 or 5 or 8 ? "accepted" : "rejected with error 1712")}");
    }

    [Fact] // sqlserver-security
    public void SF20_ReadOnlyRoleMemberCanReadButNotWrite()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE dbo.Invoices20 (Id int PRIMARY KEY); INSERT dbo.Invoices20 VALUES (1); CREATE USER sf20_reader WITHOUT LOGIN; ALTER ROLE db_datareader ADD MEMBER sf20_reader;");
        Exec(c, "EXECUTE AS USER = 'sf20_reader';");
        try
        {
            Assert.Equal(1, Scalar<int>(c, "SELECT COUNT(*) FROM dbo.Invoices20;"));
            Assert.Equal(229, Fails(() => Exec(c, "INSERT dbo.Invoices20 VALUES (2);")).Number);
            Assert.Equal(262, Fails(() => Exec(c, "CREATE TABLE dbo.Nope20 (Id int);")).Number);
        }
        finally { Exec(c, "REVERT;"); }
    }

    [Fact] // sqlserver-security
    public void SF21_OwnershipChainingCoversStaticButNotDynamicSqlInProcedures()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE dbo.Salaries21 (Id int PRIMARY KEY); INSERT dbo.Salaries21 VALUES (1), (2);");
        Exec(c, "CREATE PROCEDURE dbo.SalaryCount AS SELECT COUNT(*) FROM dbo.Salaries21;");
        Exec(c, "CREATE PROCEDURE dbo.SalaryCountDynamic AS EXEC sp_executesql N'SELECT COUNT(*) FROM dbo.Salaries21';");
        Exec(c, "CREATE USER sf21_app WITHOUT LOGIN; GRANT EXECUTE ON dbo.SalaryCount TO sf21_app; GRANT EXECUTE ON dbo.SalaryCountDynamic TO sf21_app;");
        Exec(c, "EXECUTE AS USER = 'sf21_app';");
        try
        {
            Assert.Equal(229, Fails(() => Scalar<int>(c, "SELECT COUNT(*) FROM dbo.Salaries21;")).Number);
            Assert.Equal(2, Scalar<int>(c, "EXEC dbo.SalaryCount;"));
            Assert.Equal(229, Fails(() => Scalar<int>(c, "EXEC dbo.SalaryCountDynamic;")).Number);
        }
        finally { Exec(c, "REVERT;"); }
    }

    [Fact] // sqlserver-security
    public async Task SF22_ParametersInAdoNetDapperAndEfCoreKeepInputAsData()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE dbo.Users22 (Name nvarchar(100) NOT NULL); INSERT dbo.Users22 VALUES (N'ann'), (N'bob'), (N'cy');");
        const string payload = "' OR 1=1 --";
        Assert.Equal(3, Scalar<int>(c, "SELECT COUNT(*) FROM dbo.Users22 WHERE Name = N'" + payload + "';")); // concatenation: injected
        using (var cmd = new SqlCommand("SELECT COUNT(*) FROM dbo.Users22 WHERE Name = @n;", c))
        {
            cmd.Parameters.Add(new SqlParameter("@n", SqlDbType.NVarChar, 100) { Value = payload });
            Assert.Equal(0, (int)cmd.ExecuteScalar()!);
        }
        Assert.Equal(0, await c.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM dbo.Users22 WHERE Name = @n;", new { n = payload }));
        using var ctx = new FactContext(db.ConnectionString());
        Assert.Equal(0, ctx.Database.SqlQuery<int>($"SELECT COUNT(*) AS Value FROM dbo.Users22 WHERE Name = {payload}").Single());
    }

    [Fact] // sqlserver-auditing-temporal
    public void SF23_SystemVersionedTableKeepsUtcHistoryAndBlocksDrop()
    {
        using var c = db.Open();
        Exec(c, """
            CREATE TABLE dbo.Prices23 (
              Id int PRIMARY KEY, Amount decimal(10,2) NOT NULL,
              ValidFrom datetime2 GENERATED ALWAYS AS ROW START NOT NULL,
              ValidTo datetime2 GENERATED ALWAYS AS ROW END NOT NULL,
              PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo))
            WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.Prices23History));
            INSERT dbo.Prices23 (Id, Amount) VALUES (1, 10.00);
            """);
        Thread.Sleep(50);
        var before = Scalar<DateTime>(c, "SELECT SYSUTCDATETIME();");
        Thread.Sleep(50);
        Exec(c, "UPDATE dbo.Prices23 SET Amount = 12.00 WHERE Id = 1;");
        Assert.Equal(1, Scalar<int>(c, "SELECT COUNT(*) FROM dbo.Prices23History WHERE Amount = 10.00;"));
        Assert.Equal(10.00m, Scalar<decimal>(c, "SELECT Amount FROM dbo.Prices23 FOR SYSTEM_TIME AS OF @t WHERE Id = 1;", new SqlParameter("@t", SqlDbType.DateTime2) { Value = before }));
        var skewMinutes = Scalar<int>(c, "SELECT ABS(DATEDIFF(minute, ValidFrom, SYSUTCDATETIME())) FROM dbo.Prices23 WHERE Id = 1;");
        Assert.True(skewMinutes < 5, "period columns are recorded in UTC");
        Assert.Equal(13552, Fails(() => Exec(c, "DROP TABLE dbo.Prices23;")).Number);
        Assert.Equal(0, Scalar<int>(c, "SELECT COUNT(*) FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Prices23History') AND name LIKE '%User%';")); // no actor is recorded unless you add it
        Exec(c, "ALTER TABLE dbo.Prices23 SET (SYSTEM_VERSIONING = OFF); DROP TABLE dbo.Prices23; DROP TABLE dbo.Prices23History;");
    }
}
