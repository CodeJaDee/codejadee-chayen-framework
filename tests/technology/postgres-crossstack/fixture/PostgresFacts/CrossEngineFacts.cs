using System.Text.RegularExpressions;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using NpgsqlTypes;
using Xunit;
using static PostgresFacts.PgDb;

namespace PostgresFacts;

[Collection("pg")]
public class CrossEngineFacts(PgDb db)
{
    [Fact] // crossstack-date-time
    public void XF05_TimestamptzStoresAnInstantWhileTimestampDropsTheOffset()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE times05 (at_tz timestamptz NOT NULL, at_local timestamp NOT NULL)");
        Exec(c, "INSERT INTO times05 VALUES ('2026-01-01 10:00:00+00', '2026-01-01 10:00:00+00')");
        Exec(c, "SET TimeZone = 'Asia/Bangkok'");
        Assert.Equal("2026-01-01 17:00:00+07", Scalar<string>(c, "SELECT at_tz::text FROM times05"));
        Assert.Equal("2026-01-01 10:00:00", Scalar<string>(c, "SELECT at_local::text FROM times05"));   // offset silently discarded
        Exec(c, "SET TimeZone = 'UTC'");
        Assert.Equal("2026-01-01 10:00:00+00", Scalar<string>(c, "SELECT at_tz::text FROM times05"));   // same instant, new presentation
    }

    [Fact] // crossstack-date-time
    public void XF06_NpgsqlRequiresUtcDateTimeForTimestamptz()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE times06 (at timestamptz NOT NULL, local_at timestamp NOT NULL)");
        void Insert(DateTime at, DateTime local)
        {
            using var cmd = new NpgsqlCommand("INSERT INTO times06 VALUES (@at, @local)", c);
            cmd.Parameters.Add(new NpgsqlParameter("at", NpgsqlDbType.TimestampTz) { Value = at });
            cmd.Parameters.Add(new NpgsqlParameter("local", NpgsqlDbType.Timestamp) { Value = local });
            cmd.ExecuteNonQuery();
        }
        var unspecified = new DateTime(2026, 1, 1, 10, 0, 0, DateTimeKind.Unspecified);
        var utc = DateTime.SpecifyKind(unspecified, DateTimeKind.Utc);
        var e1 = Assert.ThrowsAny<Exception>(() => Insert(unspecified, unspecified));
        var e2 = Assert.ThrowsAny<Exception>(() => Insert(utc, utc));
        Observed.Write("XF06", $"Kind=Unspecified to timestamptz: {e1.GetType().Name}; Kind=Utc to timestamp: {e2.GetType().Name}");
        Assert.Contains("UTC", e1.Message);
        Insert(utc, unspecified);
        using var cmd = new NpgsqlCommand("SELECT at FROM times06", c);
        Assert.Equal(DateTimeKind.Utc, ((DateTime)cmd.ExecuteScalar()!).Kind);
    }

    [Fact] // database-portability-review
    public void XF13_SameSqlGivesDifferentResultsOnSqlServerAndPostgreSql()
    {
        var server = Environment.GetEnvironmentVariable("CHAYEN_SQLSERVER_FACTS_SERVER");
        if (server is null || !Regex.IsMatch(server, @"^(\(localdb\)\\[\w.-]+|localhost|127\.0\.0\.1|\.)([\\,].*)?$", RegexOptions.IgnoreCase))
        {
            Observed.Write("XF13", "NOT_RUN: no local SQL Server (CHAYEN_SQLSERVER_FACTS_SERVER) for the comparison");
            return;
        }
        using var pg = db.Open();
        using var ss = new SqlConnection(new SqlConnectionStringBuilder { DataSource = server, InitialCatalog = "tempdb", IntegratedSecurity = true, TrustServerCertificate = true }.ConnectionString);
        ss.Open();
        object SS(string sql) { using var cmd = new SqlCommand(sql, ss); return cmd.ExecuteScalar()!; }
        // Case and trailing-space comparison
        Assert.Equal(1, SS("SELECT CASE WHEN 'Alpha' = 'ALPHA' THEN 1 ELSE 0 END"));
        Assert.False(Scalar<bool>(pg, "SELECT 'Alpha' = 'ALPHA'"));
        Assert.Equal(1, SS("SELECT CASE WHEN 'a' = 'a  ' THEN 1 ELSE 0 END"));
        Assert.False(Scalar<bool>(pg, "SELECT 'a'::text = 'a  '::text"));
        // NULL ordering
        Assert.Equal("NULL,1,2", (string)SS("SELECT STRING_AGG(ISNULL(CAST(v AS varchar(10)), 'NULL'), ',') WITHIN GROUP (ORDER BY v) FROM (VALUES (2), (NULL), (1)) t(v)"));
        Assert.Equal("1,2,NULL", Scalar<string>(pg, "SELECT string_agg(coalesce(v::text, 'NULL'), ',' ORDER BY v) FROM (VALUES (2), (NULL), (1)) t(v)"));
        // Unique constraints and NULLs
        new SqlCommand("CREATE TABLE #u (v int NULL UNIQUE); INSERT #u VALUES (NULL);", ss).ExecuteNonQuery();
        Assert.Equal(2627, Assert.Throws<SqlException>(() => new SqlCommand("INSERT #u VALUES (NULL);", ss).ExecuteNonQuery()).Number);
        Exec(pg, "CREATE TEMP TABLE u13 (v int UNIQUE); INSERT INTO u13 VALUES (NULL), (NULL)");
        Assert.Equal(2, Scalar<int>(pg, "SELECT count(*) FROM u13"));
        Observed.Write("XF13", "SQL Server (tempdb, default collation) vs PostgreSQL: 'Alpha'='ALPHA' 1/false; 'a'='a  ' 1/false; NULLs sort first/last; UNIQUE allows one/many NULLs");
    }

    [Fact] // database-portability-review
    public void XF14_SameLinqQueryTranslatesDifferentlyPerProvider()
    {
        using var pg = OrdersContext.Npgsql(db.ConnectionString());
        using var ss = OrdersContext.SqlServer();
        var term = "abc";
        string Q(OrdersContext ctx) => ctx.Orders.Where(o => o.CustomerEmail.Contains(term)).OrderBy(o => o.Id).Take(10).ToQueryString();
        var p = Q(pg);
        var s = Q(ss);
        Observed.Write("XF14", $"Npgsql: {p.Replace('\n', ' ')} | SqlServer: {s.Replace('\n', ' ')}");
        Assert.Contains("LIMIT", p);
        Assert.Contains("\"Orders\"", p);
        Assert.Contains("TOP(", s);
        Assert.Contains("[Orders]", s);
        Assert.NotEqual(p, s);
    }
}
