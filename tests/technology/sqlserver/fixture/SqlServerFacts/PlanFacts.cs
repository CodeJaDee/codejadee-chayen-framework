using System.Data;
using System.Text.RegularExpressions;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Xunit;
using static SqlServerFacts.FactDb;

namespace SqlServerFacts;

[Collection("db")]
public class PlanFacts(FactDb db)
{
    static string CachedPlan(SqlConnection c, string marker) => Scalar<string>(c, """
        SELECT TOP (1) CAST(qp.query_plan AS nvarchar(max))
        FROM sys.dm_exec_query_stats qs
        CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) st
        CROSS APPLY sys.dm_exec_query_plan(qs.plan_handle) qp
        WHERE st.text LIKE '%' + @m + '%' AND st.text NOT LIKE '%dm_exec_query_stats%';
        """, new SqlParameter("@m", SqlDbType.NVarChar, 100) { Value = marker });

    static long LogicalReads(SqlConnection c, string sql, string table)
    {
        long reads = 0;
        void Info(object _, SqlInfoMessageEventArgs e)
        {
            var m = Regex.Match(e.Message, $@"Table '{table}'\. Scan count \d+, logical reads (\d+)");
            if (m.Success) reads += long.Parse(m.Groups[1].Value);
        }
        c.InfoMessage += Info;
        Exec(c, "SET STATISTICS IO ON;");
        Exec(c, sql);
        Exec(c, "SET STATISTICS IO OFF;");
        c.InfoMessage -= Info;
        return reads;
    }

    [Fact] // sqlserver-query-plans
    public void SF07_EstimatedPlanIsReturnedWithoutExecutingTheStatement()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE dbo.PlanProbe (Id int NOT NULL);");
        Exec(c, "SET SHOWPLAN_XML ON;");
        string plan;
        using (var cmd = new SqlCommand("INSERT dbo.PlanProbe VALUES (1); DELETE dbo.PlanProbe;", c))
        using (var r = cmd.ExecuteReader())
        {
            Assert.True(r.Read());
            plan = r.GetString(0);
        }
        Exec(c, "SET SHOWPLAN_XML OFF;");
        Assert.Contains("ShowPlanXML", plan);
        Assert.Equal(0, Scalar<int>(c, "SELECT COUNT(*) FROM dbo.PlanProbe;"));
        Exec(c, "INSERT dbo.PlanProbe VALUES (1);");
        Assert.Equal(1, Scalar<int>(c, "SELECT COUNT(*) FROM dbo.PlanProbe;")); // the same statement does run without SHOWPLAN
    }

    [Fact] // sqlserver-query-plans
    public async Task SF08_UnicodeStringParametersAgainstVarcharColumnsCauseImplicitConversion()
    {
        using var c = db.Open();
        Exec(c, """
            CREATE TABLE dbo.Codes (Id int IDENTITY PRIMARY KEY, Code varchar(20) NOT NULL);
            INSERT dbo.Codes (Code) SELECT TOP (5000) CONCAT('C', ROW_NUMBER() OVER (ORDER BY (SELECT NULL))) FROM sys.all_columns a CROSS JOIN sys.all_columns b;
            CREATE INDEX IX_Codes_Code ON dbo.Codes (Code);
            """);
        var run = Guid.NewGuid().ToString("N")[..8];
        string M(string k) => $"sf08-{k}-{run}";
        using (var cmd = new SqlCommand($"SELECT Id FROM dbo.Codes WHERE Code = @c /*{M("addwithvalue")}*/;", c))
        {
            cmd.Parameters.AddWithValue("@c", "C100"); // infers nvarchar
            cmd.ExecuteScalar();
        }
        using (var cmd = new SqlCommand($"SELECT Id FROM dbo.Codes WHERE Code = @c /*{M("typed")}*/;", c))
        {
            cmd.Parameters.Add(new SqlParameter("@c", SqlDbType.VarChar, 20) { Value = "C100" });
            cmd.ExecuteScalar();
        }
        await c.QueryAsync<int>($"SELECT Id FROM dbo.Codes WHERE Code = @c /*{M("dapper")}*/;", new { c = "C100" });
        await c.QueryAsync<int>($"SELECT Id FROM dbo.Codes WHERE Code = @c /*{M("dbstring")}*/;", new { c = new DbString { Value = "C100", IsAnsi = true, Length = 20 } });
        Assert.Contains("CONVERT_IMPLICIT", CachedPlan(c, M("addwithvalue")));
        Assert.Contains("CONVERT_IMPLICIT", CachedPlan(c, M("dapper")));
        Assert.DoesNotContain("CONVERT_IMPLICIT", CachedPlan(c, M("typed")));
        Assert.DoesNotContain("CONVERT_IMPLICIT", CachedPlan(c, M("dbstring")));
        Assert.Contains("Index Seek", CachedPlan(c, M("typed")));
    }

    [Fact] // sqlserver-query-plans
    public void SF09_PerRowQueriesIssueOneCommandPerParentRow()
    {
        var cs = db.ConnectionString();
        var customers = FactContext.EnsureSeeded(cs);
        var loop = new CommandCounter();
        using (var ctx = new FactContext(cs, counter: loop))
            foreach (var cust in ctx.Customers.AsNoTracking().ToList())
                _ = ctx.Orders.AsNoTracking().Where(o => o.CustomerId == cust.Id).ToList();
        var projected = new CommandCounter();
        using (var ctx = new FactContext(cs, counter: projected))
            _ = ctx.Customers.Select(cu => new { cu.Id, Totals = cu.Orders.Select(o => o.Total).ToList() }).ToList();
        var split = new CommandCounter();
        using (var ctx = new FactContext(cs, counter: split))
            _ = ctx.Customers.AsNoTracking().Include(cu => cu.Orders).AsSplitQuery().ToList();
        Observed.Write("SF09", $"{customers} customers: per-row loop {loop.Count} commands, projection {projected.Count}, split Include {split.Count}");
        Assert.Equal(customers + 1, loop.Count);
        Assert.Equal(1, projected.Count);
        Assert.Equal(2, split.Count);
    }

    [Fact] // sqlserver-query-store
    public void SF10_QueryStoreCapturesQueriesWithRuntimeStatistics()
    {
        using var c = db.Open();
        var state = Scalar<string>(c, "SELECT CONCAT(actual_state_desc, '/', query_capture_mode_desc) FROM sys.database_query_store_options;");
        Observed.Write("SF10", $"new database query store: {state}");
        if (!state.StartsWith("READ_WRITE")) Exec(c, $"ALTER DATABASE [{db.Name}] SET QUERY_STORE = ON (OPERATION_MODE = READ_WRITE);");
        Exec(c, $"ALTER DATABASE [{db.Name}] SET QUERY_STORE (QUERY_CAPTURE_MODE = ALL);"); // AUTO may skip cheap, rare queries
        Exec(c, "CREATE TABLE dbo.QsProbe (Id int PRIMARY KEY);");
        for (var i = 0; i < 3; i++) Scalar<int>(c, "SELECT COUNT(*) /*sf10-marker*/ FROM dbo.QsProbe;");
        Exec(c, "EXEC sys.sp_query_store_flush_db;");
        var executions = Scalar<long>(c, """
            SELECT ISNULL(SUM(rs.count_executions), 0)
            FROM sys.query_store_query_text qt
            JOIN sys.query_store_query q ON q.query_text_id = qt.query_text_id
            JOIN sys.query_store_plan p ON p.query_id = q.query_id
            JOIN sys.query_store_runtime_stats rs ON rs.plan_id = p.plan_id
            WHERE qt.query_sql_text LIKE '%sf10-marker%' AND qt.query_sql_text NOT LIKE '%query_store_query_text%';
            """);
        Assert.True(executions >= 3, $"Query Store recorded {executions} executions");
        Assert.Contains("READ_WRITE", state); // SQL Server 2022 and later enable Query Store for new databases
    }

    [Fact] // sqlserver-index-tuning
    public void SF11_MissingIndexSuggestionAndMeasuredLogicalReads()
    {
        using var c = db.Open();
        Exec(c, """
            CREATE TABLE dbo.Events (Id int IDENTITY PRIMARY KEY, CustomerId int NOT NULL, CreatedAt datetime2 NOT NULL DEFAULT SYSUTCDATETIME(), Payload char(200) NOT NULL DEFAULT '');
            INSERT dbo.Events (CustomerId) SELECT TOP (20000) ABS(CHECKSUM(NEWID())) % 2000 FROM sys.all_columns a CROSS JOIN sys.all_columns b;
            """);
        const string missing = "SELECT COUNT(*) FROM sys.dm_db_missing_index_details WHERE database_id = DB_ID() AND object_id = OBJECT_ID('dbo.Events') AND equality_columns = '[CustomerId]';";
        // A trivial plan records no missing-index request; a query that needs full optimization does.
        const string trivial = "SELECT COUNT(*) FROM dbo.Events WHERE CustomerId = 42;";
        const string q = "SELECT CustomerId, COUNT(*) FROM dbo.Events WHERE CustomerId = 42 GROUP BY CustomerId;";
        LogicalReads(c, trivial, "Events");
        var afterTrivial = Scalar<int>(c, missing);
        var before = LogicalReads(c, q, "Events");
        var suggested = Scalar<int>(c, missing);
        Exec(c, "CREATE INDEX IX_Events_CustomerId ON dbo.Events (CustomerId);");
        var after = LogicalReads(c, q, "Events");
        Observed.Write("SF11", $"missing-index rows after a trivial plan {afterTrivial}, after a fully optimized query {suggested}; logical reads for the same query and data: before {before}, after {after}");
        Assert.Equal(0, afterTrivial);
        Assert.Equal(1, suggested);
        Assert.True(after * 10 < before, $"before {before}, after {after}");
    }
}
