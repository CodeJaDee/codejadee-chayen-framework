using System.Text.RegularExpressions;
using Npgsql;
using Xunit;
using static PostgresFacts.PgDb;

namespace PostgresFacts;

[Collection("pg")]
public class SchemaOpsFacts(PgDb db)
{
    [Fact] // postgres-partitioning
    public void PF16_PartitionPruningKeyRulesAndMissingPartitions()
    {
        using var c = db.Open();
        Exec(c, """
            CREATE TABLE events16 (id bigint NOT NULL, occurred_at timestamptz NOT NULL, kind text NOT NULL) PARTITION BY RANGE (occurred_at);
            CREATE TABLE events16_2026_01 PARTITION OF events16 FOR VALUES FROM ('2026-01-01 00:00+00') TO ('2026-02-01 00:00+00');
            CREATE TABLE events16_2026_02 PARTITION OF events16 FOR VALUES FROM ('2026-02-01 00:00+00') TO ('2026-03-01 00:00+00');
            INSERT INTO events16 SELECT g, '2026-01-01 00:00+00'::timestamptz + (g % 59) * interval '1 day', 'k' FROM generate_series(1, 5000) g;
            ANALYZE events16;
            """);
        var plan = Plan(c, "SELECT count(*) FROM events16 WHERE occurred_at >= '2026-02-10 00:00+00' AND occurred_at < '2026-02-11 00:00+00'");
        Assert.Contains("events16_2026_02", plan);
        Assert.DoesNotContain("events16_2026_01", plan);   // pruned
        Assert.Contains("events16_2026_01", Plan(c, "SELECT count(*) FROM events16 WHERE kind = 'k'"));   // no key predicate: every partition
        Assert.Equal("0A000", Fails(() => Exec(c, "ALTER TABLE events16 ADD CONSTRAINT uq_events16_id UNIQUE (id)")).SqlState);
        Exec(c, "ALTER TABLE events16 ADD CONSTRAINT uq_events16_id UNIQUE (id, occurred_at)");   // must include the partition key
        Assert.Equal("23514", Fails(() => Exec(c, "INSERT INTO events16 VALUES (9999, '2026-05-01 00:00+00', 'k')")).SqlState);
    }

    [Fact] // postgres-schema-migrations
    public void PF17_SomeAlterTableFormsRewriteTheTableAndOthersDoNot()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE wide17 (id int PRIMARY KEY, v text NOT NULL); INSERT INTO wide17 SELECT g, 'x' FROM generate_series(1, 10000) g");
        long FileNode() => Scalar<long>(c, "SELECT relfilenode FROM pg_class WHERE oid = 'wide17'::regclass");
        var start = FileNode();
        Exec(c, "ALTER TABLE wide17 ADD COLUMN status int NOT NULL DEFAULT 1");
        var afterConstant = FileNode();
        Exec(c, "ALTER TABLE wide17 ADD COLUMN noise float8 NOT NULL DEFAULT random()");
        var afterVolatile = FileNode();
        Exec(c, "ALTER TABLE wide17 ALTER COLUMN status TYPE bigint");
        var afterType = FileNode();
        Observed.Write("PF17", $"relfilenode: start {start}, constant default {afterConstant}, volatile default {afterVolatile}, type change {afterType}");
        Assert.Equal(start, afterConstant);         // metadata-only
        Assert.NotEqual(afterConstant, afterVolatile); // rewrite
        Assert.NotEqual(afterVolatile, afterType);     // rewrite
    }

    [Fact] // postgres-schema-migrations
    public void PF18_NotValidConstraintsAndTransactionalDdl()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE parent18 (id int PRIMARY KEY); CREATE TABLE child18 (id int PRIMARY KEY, parent_id int NOT NULL); INSERT INTO parent18 VALUES (1); INSERT INTO child18 VALUES (1, 1), (2, 999)");
        Exec(c, "ALTER TABLE child18 ADD CONSTRAINT fk_child18 FOREIGN KEY (parent_id) REFERENCES parent18 (id) NOT VALID");
        Assert.False(Scalar<bool>(c, "SELECT convalidated FROM pg_constraint WHERE conname = 'fk_child18'"));
        Assert.Equal("23503", Fails(() => Exec(c, "INSERT INTO child18 VALUES (3, 777)")).SqlState);   // new rows are checked
        Assert.Equal("23503", Fails(() => Exec(c, "ALTER TABLE child18 VALIDATE CONSTRAINT fk_child18")).SqlState);
        Exec(c, "DELETE FROM child18 WHERE id = 2; ALTER TABLE child18 VALIDATE CONSTRAINT fk_child18");
        Assert.True(Scalar<bool>(c, "SELECT convalidated FROM pg_constraint WHERE conname = 'fk_child18'"));
        using (var tx = c.BeginTransaction())
        {
            Exec(c, "CREATE TABLE tmp18 (id int); ALTER TABLE child18 ADD COLUMN note text");
            tx.Rollback();
        }
        Assert.Equal(0, Scalar<int>(c, "SELECT count(*) FROM pg_class WHERE relname = 'tmp18'"));
        Assert.Equal(0, Scalar<int>(c, "SELECT count(*) FROM information_schema.columns WHERE table_name = 'child18' AND column_name = 'note'"));
    }

    [Fact] // postgres-vacuum-maintenance
    public void PF19_AnOpenSnapshotKeepsDeadRowsFromBeingRemoved()
    {
        using var c = db.Open();
        var notices = new List<string>();
        c.Notice += (_, e) => notices.Add(e.Notice.MessageText);
        Exec(c, "CREATE TABLE churn19 (id int PRIMARY KEY, v int NOT NULL) WITH (autovacuum_enabled = false); INSERT INTO churn19 SELECT g, 0 FROM generate_series(1, 1000) g");
        int Removed(string text) => int.Parse(Regex.Match(text, @"tuples: (\d+) removed").Groups[1].Value);
        int NotYet(string text) => int.Parse(Regex.Match(text, @"(\d+) are dead but not yet removable").Groups[1].Value);
        using var old = db.Open();
        using var snapshot = old.BeginTransaction(System.Data.IsolationLevel.RepeatableRead);
        Scalar<int>(old, "SELECT count(*) FROM churn19");   // takes the snapshot
        Exec(c, "UPDATE churn19 SET v = 1");
        notices.Clear();
        Exec(c, "VACUUM (VERBOSE) churn19");
        var blocked = string.Join("\n", notices);
        snapshot.Commit();
        notices.Clear();
        Exec(c, "VACUUM (VERBOSE) churn19");
        var freed = string.Join("\n", notices);
        Observed.Write("PF19", $"with an open snapshot: {Removed(blocked)} removed, {NotYet(blocked)} not yet removable; after it ends: {Removed(freed)} removed");
        Assert.Equal(1000, NotYet(blocked));
        Assert.Equal(1000, Removed(freed));
        using var tx = c.BeginTransaction();
        Assert.Equal("25001", Fails(() => Exec(c, "VACUUM churn19")).SqlState);
        tx.Rollback();
    }

    [Fact] // postgres-vacuum-maintenance
    public void PF20_AnalyzeCreatesThePlannerStatistics()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE stats20 (id int PRIMARY KEY, kind int NOT NULL) WITH (autovacuum_enabled = false); INSERT INTO stats20 SELECT g, g % 10 FROM generate_series(1, 10000) g");
        Assert.Equal(0, Scalar<int>(c, "SELECT count(*) FROM pg_stats WHERE tablename = 'stats20' AND attname = 'kind'"));
        Assert.Equal(-1.0, Scalar<double>(c, "SELECT reltuples FROM pg_class WHERE relname = 'stats20'"));   // never analyzed
        Exec(c, "ANALYZE stats20");
        Assert.Equal(1, Scalar<int>(c, "SELECT count(*) FROM pg_stats WHERE tablename = 'stats20' AND attname = 'kind'"));
        Assert.Equal(10000.0, Scalar<double>(c, "SELECT reltuples FROM pg_class WHERE relname = 'stats20'"));
    }

    [Fact] // postgres-backup-recovery
    public void PF21_RestoreToANewDatabaseAndCheckItProvesTheDump()
    {
        using (var c = db.Open()) Exec(c, "CREATE TABLE backup21 (id int PRIMARY KEY, v text NOT NULL); INSERT INTO backup21 SELECT g, md5(g::text) FROM generate_series(1, 1234) g");
        var file = Path.Combine(Path.GetTempPath(), $"{db.Name}.dump");
        var target = db.Name + "_restore";
        try
        {
            var dump = db.Tool("pg_dump.exe", "-d", db.Name, "-Fc", "-f", file);
            Assert.True(dump.Code == 0, dump.Out);
            using (var m = db.Open("postgres")) Exec(m, $"CREATE DATABASE {target}");
            var restore = db.Tool("pg_restore.exe", "-d", target, "--exit-on-error", file);
            Assert.True(restore.Code == 0, restore.Out);
            using (var r = db.Open(target))
            {
                Assert.Equal(1234, Scalar<int>(r, "SELECT count(*) FROM backup21"));
                Assert.Equal(Scalar<string>(r, "SELECT md5(string_agg(v, ',' ORDER BY id)) FROM backup21"), Checksum());
            }
            var check = db.Tool("pg_amcheck.exe", "-d", target, "--install-missing", "--heapallindexed");
            Observed.Write("PF21", $"pg_dump -Fc, pg_restore to a new database, row count and checksum match, pg_amcheck exit {check.Code}");
            Assert.True(check.Code == 0, check.Out);
        }
        finally { File.Delete(file); }

        string Checksum()
        {
            using var c = db.Open();
            return Scalar<string>(c, "SELECT md5(string_agg(v, ',' ORDER BY id)) FROM backup21");
        }
    }

    [Fact] // postgres-backup-recovery
    public void PF22_PgDumpOmitsRolesThatGrantsAndPoliciesNeed()
    {
        using (var c = db.Open()) Exec(c, "CREATE ROLE facts_reader22 NOLOGIN; CREATE TABLE grants22 (id int); GRANT SELECT ON grants22 TO facts_reader22");
        var dump = db.Tool("pg_dump.exe", "-d", db.Name, "-Fp", "-t", "grants22");
        var globals = db.Tool("pg_dumpall.exe", "--globals-only");
        Assert.Equal(0, dump.Code);
        Assert.Contains("TO facts_reader22", dump.Out);
        Assert.DoesNotContain("CREATE ROLE facts_reader22", dump.Out);
        Assert.Contains("CREATE ROLE facts_reader22", globals.Out);
    }
}
