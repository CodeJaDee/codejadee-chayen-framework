using Microsoft.EntityFrameworkCore;
using Npgsql;
using NpgsqlTypes;
using Xunit;
using static PostgresFacts.PgDb;

namespace PostgresFacts;

[Collection("pg")]
public class SqlFacts(PgDb db)
{
    [Fact] // postgres-sql-dialect
    public void PF01_UnquotedIdentifiersFoldToLowerCase()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE Orders01 (Id int PRIMARY KEY, CustomerName text NOT NULL)");
        Assert.Equal("orders01", Scalar<string>(c, "SELECT relname FROM pg_class WHERE relname ILIKE 'orders01'"));
        Assert.Equal(0, Scalar<int>(c, "SELECT count(*) FROM orders01"));
        Assert.Equal("42P01", Fails(() => Exec(c, "SELECT * FROM \"Orders01\"")).SqlState);   // quoted mixed case is a different name
        Exec(c, "CREATE TABLE \"Quoted01\" (\"Id\" int)");
        Assert.Equal("42P01", Fails(() => Exec(c, "SELECT * FROM Quoted01")).SqlState);   // folds to quoted01, which does not exist
    }

    [Fact] // postgres-sql-dialect
    public void PF02_SqlServerFormsAreRejectedAndPostgreSqlFormsRun()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE dialect02 (id int PRIMARY KEY, name text NOT NULL); INSERT INTO dialect02 VALUES (1, 'a'), (2, 'b')");
        var states = new[]
        {
            "SELECT TOP (1) id FROM dialect02 ORDER BY id",
            "SELECT [id] FROM dialect02",
            "SELECT 'a' + 'b'",
            "SELECT GETDATE()",
            "SELECT ISNULL(NULL, 1)",
            "INSERT INTO dialect02 (id, name) OUTPUT inserted.id VALUES (3, 'c')",
        }.Select(sql => Fails(() => Exec(c, sql)).SqlState).ToList();
        Observed.Write("PF02", $"SQL Server forms rejected with SQLSTATE {string.Join(", ", states)} (TOP, [ ], + on text, GETDATE, ISNULL, OUTPUT)");
        Assert.Equal(2, Scalar<int>(c, "SELECT id FROM dialect02 ORDER BY id LIMIT 1 OFFSET 1"));
        Assert.Equal(3, Scalar<int>(c, "INSERT INTO dialect02 (id, name) VALUES (3, 'c') RETURNING id"));
        Assert.Equal(1, Scalar<int>(c, "SELECT count(*) FROM dialect02 WHERE name ILIKE 'A'"));
        Assert.Equal("ab", Scalar<string>(c, "SELECT 'a' || 'b'"));
        Assert.Equal(1, Scalar<int>(c, "SELECT COALESCE(NULL, 1)"));
    }

    [Fact] // postgres-sql-dialect
    public void PF03_EfCoreNpgsqlEmitsPostgreSqlSyntax()
    {
        using var ctx = OrdersContext.Npgsql(db.ConnectionString());
        var page = ctx.Orders.OrderBy(o => o.Id).Skip(10).Take(5).ToQueryString();
        var term = "a1";
        var ilike = ctx.Orders.Where(o => EF.Functions.ILike(o.Number, $"%{term}%")).ToQueryString();
        Assert.Contains("LIMIT @", page);
        Assert.Contains("OFFSET @", page);
        Assert.Contains("\"Orders\"", page);
        Assert.Contains("ILIKE", ilike);
        foreach (var sql in new[] { page, ilike })
        {
            Assert.DoesNotContain("TOP(", sql);
            Assert.DoesNotContain("FETCH NEXT", sql);
            Assert.DoesNotContain("[Orders]", sql);
        }
    }

    [Fact] // postgres-sql-dialect
    public async Task PF04_OnConflictUpsertIsAtomicUnderConcurrency()
    {
        using (var c = db.Open()) Exec(c, "CREATE TABLE stock04 (sku text PRIMARY KEY, qty int NOT NULL)");
        var tasks = Enumerable.Range(1, 20).Select(i => Task.Run(() =>
        {
            using var c = db.Open();
            using var cmd = new NpgsqlCommand("INSERT INTO stock04 (sku, qty) VALUES (@sku, @qty) ON CONFLICT (sku) DO UPDATE SET qty = stock04.qty + EXCLUDED.qty", c);
            cmd.Parameters.Add(new NpgsqlParameter("sku", NpgsqlDbType.Text) { Value = "A-1" });
            cmd.Parameters.Add(new NpgsqlParameter("qty", NpgsqlDbType.Integer) { Value = 1 });
            cmd.ExecuteNonQuery();
        }));
        await Task.WhenAll(tasks);
        using var check = db.Open();
        Assert.Equal(1, Scalar<int>(check, "SELECT count(*) FROM stock04"));
        Assert.Equal(20, Scalar<int>(check, "SELECT qty FROM stock04"));
    }

    [Fact] // postgres-jsonb
    public void PF12_JsonbNormalizesAndContainmentCanUseGinIndex()
    {
        using var c = db.Open();
        Assert.Equal("{\"a\": 2, \"b\": 1}", Scalar<string>(c, "SELECT '{\"b\": 1, \"a\": 1, \"a\": 2}'::jsonb::text"));       // keys sorted, last duplicate wins
        Assert.Equal("{\"b\": 1, \"a\": 1, \"a\": 2}", Scalar<string>(c, "SELECT '{\"b\": 1, \"a\": 1, \"a\": 2}'::json::text")); // json keeps text as written
        Assert.Equal("text", Scalar<string>(c, "SELECT pg_typeof('{\"n\": 5}'::jsonb ->> 'n')::text"));
        Exec(c, """
            CREATE TABLE docs12 (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, body jsonb NOT NULL);
            INSERT INTO docs12 (body) SELECT jsonb_build_object('tenant', g % 50, 'tags', jsonb_build_array('t' || (g % 7))) FROM generate_series(1, 20000) g;
            CREATE INDEX ix_docs12_body ON docs12 USING gin (body jsonb_path_ops);
            ANALYZE docs12;
            """);
        var contains = Plan(c, "SELECT id FROM docs12 WHERE body @> '{\"tenant\": 7}'");
        var arrow = Plan(c, "SELECT id FROM docs12 WHERE body ->> 'tenant' = '7'");
        Observed.Write("PF12", $"@> plan: {contains.Split('\n')[0]} | ->> plan: {arrow.Split('\n')[0]}");
        Assert.Contains("ix_docs12_body", contains);
        Assert.DoesNotContain("ix_docs12_body", arrow);   // the GIN index serves containment, not ->> equality
    }

    [Fact] // postgres-jsonb
    public void PF13_JsonbNumericKeepsPrecisionThatJavaScriptNumbersLose()
    {
        using var c = db.Open();
        Assert.Equal("12345678901234567890.123", Scalar<string>(c, "SELECT ('{\"amount\": 12345678901234567890.123}'::jsonb ->> 'amount')"));
        Assert.Equal("numeric", Scalar<string>(c, "SELECT pg_typeof(('{\"amount\": 1.10}'::jsonb -> 'amount')::numeric)::text"));
        Assert.Equal("1.10", Scalar<string>(c, "SELECT ('{\"amount\": 1.10}'::jsonb ->> 'amount')"));  // trailing zero kept
    }
}
