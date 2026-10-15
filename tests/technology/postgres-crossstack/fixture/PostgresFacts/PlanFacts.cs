using System.Text.RegularExpressions;
using Xunit;
using static PostgresFacts.PgDb;

namespace PostgresFacts;

[Collection("pg")]
public class PlanFacts(PgDb db)
{
    static long SharedBuffers(Npgsql.NpgsqlConnection c, string sql)
    {
        var text = string.Join("\n", Rows(c, "EXPLAIN (ANALYZE, BUFFERS) " + sql));
        return Regex.Matches(text, @"Buffers: shared (?:hit=(\d+))?\s*(?:read=(\d+))?").Take(1)
            .Sum(m => (m.Groups[1].Success ? long.Parse(m.Groups[1].Value) : 0) + (m.Groups[2].Success ? long.Parse(m.Groups[2].Value) : 0));
    }

    [Fact] // postgres-explain-analyze
    public void PF05_ExplainAnalyzeExecutesTheStatementPlainExplainDoesNot()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE probe05 (id int NOT NULL)");
        Rows(c, "EXPLAIN INSERT INTO probe05 VALUES (1)");
        Assert.Equal(0, Scalar<int>(c, "SELECT count(*) FROM probe05"));
        Rows(c, "EXPLAIN ANALYZE INSERT INTO probe05 VALUES (1)");
        Assert.Equal(1, Scalar<int>(c, "SELECT count(*) FROM probe05"));   // ANALYZE ran the insert
        using (var tx = c.BeginTransaction())
        {
            Rows(c, "EXPLAIN ANALYZE INSERT INTO probe05 VALUES (2)");
            tx.Rollback();
        }
        Assert.Equal(1, Scalar<int>(c, "SELECT count(*) FROM probe05"));   // BEGIN ... ROLLBACK discards it
    }

    [Fact] // postgres-explain-analyze
    public void PF06_ExplainAnalyzeBuffersReportsActualRowsAndBuffers()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE events06 (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, customer_id int NOT NULL, payload text NOT NULL); INSERT INTO events06 (customer_id, payload) SELECT g % 1000, repeat('x', 100) FROM generate_series(1, 50000) g; ANALYZE events06;");
        var text = string.Join("\n", Rows(c, "EXPLAIN (ANALYZE, BUFFERS) SELECT count(*) FROM events06 WHERE customer_id = 42"));
        Assert.Matches(@"actual time=[\d.]+\.\.[\d.]+ rows=[\d.]+ loops=\d+", text);
        Assert.Contains("Buffers: shared", text);
        Assert.Contains("Execution Time:", text);
    }

    [Fact] // postgres-index-strategy
    public void PF07_IndexesServeOnlyMatchingPredicatesAndAreMeasured()
    {
        using var c = db.Open();
        Exec(c, """
            CREATE TABLE users07 (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, email text NOT NULL, active boolean NOT NULL, pad text NOT NULL);
            INSERT INTO users07 (email, active, pad) SELECT 'User' || g || '@Example.com', g % 100 = 0, repeat('p', 200) FROM generate_series(1, 50000) g;
            ANALYZE users07;
            """);
        const string q = "SELECT id FROM users07 WHERE lower(email) = 'user4242@example.com'";
        var before = SharedBuffers(c, q);
        Exec(c, "CREATE INDEX ix_users07_email ON users07 (email); CREATE INDEX ix_users07_lower_email ON users07 (lower(email)); CREATE INDEX ix_users07_active ON users07 (id) WHERE active; ANALYZE users07;");
        var after = SharedBuffers(c, q);
        Assert.Contains("ix_users07_lower_email", Plan(c, q));
        Assert.DoesNotContain("ix_users07_email ", Plan(c, "SELECT id FROM users07 WHERE email ILIKE 'user4242@example.com'"));   // case-insensitive match cannot use the plain B-tree
        Assert.DoesNotContain("ix_users07_email", Plan(c, "SELECT id FROM users07 WHERE email LIKE '%4242%'"));                 // leading wildcard
        Assert.Contains("ix_users07_active", Plan(c, "SELECT id FROM users07 WHERE active AND id < 1000"));
        Assert.DoesNotContain("ix_users07_active", Plan(c, "SELECT id FROM users07 WHERE id < 1000"));                          // partial index needs its predicate
        Observed.Write("PF07", $"shared buffers for the same query and data: before {before}, after expression index {after}");
        Assert.True(after * 10 < before, $"before {before}, after {after}");
    }

    [Fact] // postgres-index-strategy
    public void PF08_CreateIndexConcurrentlyCannotRunInsideATransaction()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE items08 (id int PRIMARY KEY, sku text NOT NULL)");
        using (var tx = c.BeginTransaction())
        {
            Assert.Equal("25001", Fails(() => Exec(c, "CREATE INDEX CONCURRENTLY ix_items08_sku ON items08 (sku)")).SqlState);
            tx.Rollback();
        }
        Exec(c, "CREATE INDEX CONCURRENTLY ix_items08_sku ON items08 (sku)");
        Assert.True(Scalar<bool>(c, "SELECT indisvalid FROM pg_index WHERE indexrelid = 'ix_items08_sku'::regclass"));
    }
}
