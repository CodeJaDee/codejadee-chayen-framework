using System.Data;
using Npgsql;
using Xunit;
using static PostgresFacts.PgDb;

namespace PostgresFacts;

[Collection("pg")]
public class ConcurrencyFacts(PgDb db)
{
    [Fact] // postgres-mvcc-locking
    public void PF09_RepeatableReadRaisesSerializationFailureOnConcurrentUpdate()
    {
        using (var s = db.Open()) Exec(s, "CREATE TABLE acct09 (id int PRIMARY KEY, balance int NOT NULL); INSERT INTO acct09 VALUES (1, 100)");
        using var a = db.Open();
        using var b = db.Open();
        using var ta = a.BeginTransaction(IsolationLevel.RepeatableRead);
        using var tb = b.BeginTransaction(IsolationLevel.RepeatableRead);
        Assert.Equal(100, Scalar<int>(a, "SELECT balance FROM acct09 WHERE id = 1"));
        Assert.Equal(100, Scalar<int>(b, "SELECT balance FROM acct09 WHERE id = 1"));
        Exec(a, "UPDATE acct09 SET balance = balance - 30 WHERE id = 1");
        ta.Commit();
        Assert.Equal("40001", Fails(() => Exec(b, "UPDATE acct09 SET balance = balance - 50 WHERE id = 1")).SqlState);
        tb.Rollback();
        using var check = db.Open();
        Assert.Equal(70, Scalar<int>(check, "SELECT balance FROM acct09 WHERE id = 1"));   // no lost update; the loser must retry
    }

    [Fact] // postgres-mvcc-locking
    public void PF10_LockTimeoutMakesABlockedMigrationFailFast()
    {
        using (var s = db.Open()) Exec(s, "CREATE TABLE busy10 (id int PRIMARY KEY)");
        using var reader = db.Open();
        using var tx = reader.BeginTransaction();
        Rows(reader, "SELECT * FROM busy10");   // an open transaction holds ACCESS SHARE until it ends
        using var migrator = db.Open();
        Exec(migrator, "SET lock_timeout = '500ms'");
        Assert.Equal("55P03", Fails(() => Exec(migrator, "ALTER TABLE busy10 ADD COLUMN note text")).SqlState);
        tx.Rollback();
        Exec(migrator, "ALTER TABLE busy10 ADD COLUMN note text");
    }

    [Fact] // postgres-mvcc-locking
    public void PF11_SkipLockedGivesConcurrentWorkersDifferentRows()
    {
        using (var s = db.Open()) Exec(s, "CREATE TABLE jobs11 (id int PRIMARY KEY, state text NOT NULL); INSERT INTO jobs11 SELECT g, 'ready' FROM generate_series(1, 10) g");
        const string claim = "SELECT id FROM jobs11 WHERE state = 'ready' ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED";
        using var w1 = db.Open();
        using var w2 = db.Open();
        using var t1 = w1.BeginTransaction();
        using var t2 = w2.BeginTransaction();
        var first = Scalar<int>(w1, claim);
        var second = Scalar<int>(w2, claim);
        Assert.Equal(1, first);
        Assert.Equal(2, second);
        t1.Rollback();
        t2.Rollback();
    }

    [Fact] // postgres-row-level-security
    public void PF14_RowLevelSecurityFiltersTenantsButNotTheOwnerUnlessForced()
    {
        using var c = db.Open();
        // A non-superuser owns the table: superusers and BYPASSRLS roles always bypass RLS, even with FORCE.
        Exec(c, """
            CREATE ROLE facts_owner14 NOLOGIN;
            CREATE ROLE facts_app14 NOLOGIN;
            GRANT CREATE, USAGE ON SCHEMA public TO facts_owner14;
            SET ROLE facts_owner14;
            CREATE TABLE invoices14 (id int PRIMARY KEY, tenant_id int NOT NULL, amount numeric(12,2) NOT NULL);
            INSERT INTO invoices14 VALUES (1, 1, 10), (2, 1, 20), (3, 2, 30);
            GRANT SELECT, INSERT ON invoices14 TO facts_app14;
            ALTER TABLE invoices14 ENABLE ROW LEVEL SECURITY;
            RESET ROLE;
            """);
        int CountAs(string role, string tenant)
        {
            using var tx = c.BeginTransaction();
            if (role != "") Exec(c, $"SET LOCAL ROLE {role}");
            if (tenant != "") Exec(c, "SELECT set_config('app.tenant_id', @t, true)", new NpgsqlParameter("t", tenant));
            var n = Scalar<int>(c, "SELECT count(*) FROM invoices14");
            tx.Rollback();
            return n;
        }
        void AsOwner(string sql) { Exec(c, "SET ROLE facts_owner14"); Exec(c, sql); Exec(c, "RESET ROLE"); }
        Assert.Equal(0, CountAs("facts_app14", "1"));   // RLS enabled with no policy: default deny for non-owners
        // After a transaction-local set_config, the setting reads as '' (not NULL) in later transactions of the same
        // session, so a policy that casts it directly fails with 22P02 instead of returning no rows.
        Assert.Equal("", Scalar<string>(c, "SELECT current_setting('app.tenant_id', true)"));
        AsOwner("CREATE POLICY naive14 ON invoices14 USING (tenant_id = current_setting('app.tenant_id', true)::int)");
        Assert.Equal("22P02", Fails(() => CountAs("facts_app14", "")).SqlState);
        AsOwner("DROP POLICY naive14 ON invoices14");
        AsOwner("CREATE POLICY tenant14 ON invoices14 USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::int) WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::int)");
        Assert.Equal(2, CountAs("facts_app14", "1"));
        Assert.Equal(1, CountAs("facts_app14", "2"));
        Assert.Equal(0, CountAs("facts_app14", ""));    // no tenant set: the predicate is NULL, so no rows
        Assert.Equal(3, CountAs("facts_owner14", ""));  // the table owner bypasses RLS ...
        AsOwner("ALTER TABLE invoices14 FORCE ROW LEVEL SECURITY");
        Assert.Equal(0, CountAs("facts_owner14", ""));  // ... until FORCE ROW LEVEL SECURITY
        Assert.Equal(3, CountAs("", ""));               // a superuser still bypasses it
    }

    [Fact] // postgres-row-level-security
    public void PF15_RowLevelSecurityWithCheckBlocksWritesForAnotherTenant()
    {
        using var c = db.Open();
        Exec(c, """
            CREATE TABLE notes15 (id int PRIMARY KEY, tenant_id int NOT NULL);
            CREATE ROLE facts_app15 NOLOGIN;
            GRANT SELECT, INSERT ON notes15 TO facts_app15;
            ALTER TABLE notes15 ENABLE ROW LEVEL SECURITY;
            CREATE POLICY tenant15 ON notes15 USING (tenant_id = current_setting('app.tenant_id', true)::int) WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::int);
            """);
        using var tx = c.BeginTransaction();
        Exec(c, "SET LOCAL ROLE facts_app15");
        Exec(c, "SELECT set_config('app.tenant_id', '1', true)");
        Exec(c, "INSERT INTO notes15 VALUES (1, 1)");
        Assert.Equal("42501", Fails(() => Exec(c, "INSERT INTO notes15 VALUES (2, 2)")).SqlState);
        tx.Rollback();
    }
}
