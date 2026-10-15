using System.Data;
using Microsoft.Data.SqlClient;
using Xunit;
using static SqlServerFacts.FactDb;

namespace SqlServerFacts;

[Collection("db")]
public class OperationsFacts(FactDb db)
{
    static SqlParameter P(string name, string value) => new(name, SqlDbType.NVarChar, 4000) { Value = value };

    [Fact] // sqlserver-backup-recovery
    public void SF24_OnlyARestoreWithIntegrityCheckProvesABackup()
    {
        using (var c = db.Open())
            Exec(c, "CREATE TABLE dbo.BackupProbe (Id int PRIMARY KEY); INSERT dbo.BackupProbe SELECT TOP (123) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) FROM sys.all_columns;");
        var file = Path.Combine(db.BackupDir, "full.bak");
        var restored = db.Name + "_restore";
        using var m = db.Open("master");
        Exec(m, $"BACKUP DATABASE [{db.Name}] TO DISK = @f WITH CHECKSUM, INIT;", P("@f", file));
        Exec(m, "RESTORE VERIFYONLY FROM DISK = @f WITH CHECKSUM;", P("@f", file)); // readability only
        var files = new List<(string Logical, string Type)>();
        using (var cmd = new SqlCommand("RESTORE FILELISTONLY FROM DISK = @f;", m))
        {
            cmd.Parameters.Add(P("@f", file));
            using var r = cmd.ExecuteReader();
            while (r.Read()) files.Add((r.GetString(r.GetOrdinal("LogicalName")), r.GetString(r.GetOrdinal("Type"))));
        }
        var moves = string.Join(", ", files.Select((f, i) => $"MOVE N'{f.Logical}' TO @p{i}"));
        using (var cmd = new SqlCommand($"RESTORE DATABASE [{restored}] FROM DISK = @f WITH {moves}, CHECKSUM;", m))
        {
            cmd.Parameters.Add(P("@f", file));
            for (var i = 0; i < files.Count; i++)
                cmd.Parameters.Add(P($"@p{i}", Path.Combine(db.BackupDir, $"restore_{i}{(files[i].Type == "L" ? ".ldf" : ".mdf")}")));
            cmd.ExecuteNonQuery();
        }
        Exec(m, $"DBCC CHECKDB ([{restored}]) WITH NO_INFOMSGS;");
        Assert.Equal(123, Scalar<int>(m, $"SELECT COUNT(*) FROM [{restored}].dbo.BackupProbe;"));
        Exec(m, $"ALTER DATABASE [{restored}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [{restored}];");
    }

    [Fact] // sqlserver-backup-recovery
    public void SF25_LogBackupsNeedFullRecoveryAndABaseFullBackup()
    {
        using var m = db.Open("master");
        var model = Scalar<string>(m, "SELECT recovery_model_desc FROM sys.databases WHERE name = @n;", P("@n", db.Name));
        Observed.Write("SF25", $"new database recovery model: {model}");
        var log = Path.Combine(db.BackupDir, "log.trn");
        try
        {
            Exec(m, $"ALTER DATABASE [{db.Name}] SET RECOVERY SIMPLE;");
            Assert.Equal(4208, Fails(() => Exec(m, $"BACKUP LOG [{db.Name}] TO DISK = @f WITH INIT;", P("@f", log))).Number);
            Exec(m, $"ALTER DATABASE [{db.Name}] SET RECOVERY FULL;");
            Assert.Equal(4214, Fails(() => Exec(m, $"BACKUP LOG [{db.Name}] TO DISK = @f WITH INIT;", P("@f", log))).Number);
            Exec(m, $"BACKUP DATABASE [{db.Name}] TO DISK = @f WITH INIT, CHECKSUM;", P("@f", Path.Combine(db.BackupDir, "base.bak")));
            Exec(m, $"BACKUP LOG [{db.Name}] TO DISK = @f WITH INIT, CHECKSUM;", P("@f", log));
            Assert.True(File.Exists(log));
        }
        finally { Exec(m, $"ALTER DATABASE [{db.Name}] SET RECOVERY {model};"); }
    }

    [Fact] // sqlserver-maintenance
    public void SF26_StatisticsModificationCounterResetsOnUpdate()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE dbo.StatsProbe (Id int IDENTITY PRIMARY KEY, K int NOT NULL); CREATE INDEX IX_StatsProbe_K ON dbo.StatsProbe (K);");
        Exec(c, "INSERT dbo.StatsProbe (K) SELECT TOP (1000) ABS(CHECKSUM(NEWID())) % 100 FROM sys.all_columns;");
        Exec(c, "UPDATE STATISTICS dbo.StatsProbe IX_StatsProbe_K WITH FULLSCAN;");
        const string counter = "SELECT sp.modification_counter FROM sys.stats s CROSS APPLY sys.dm_db_stats_properties(s.object_id, s.stats_id) sp WHERE s.object_id = OBJECT_ID('dbo.StatsProbe') AND s.name = 'IX_StatsProbe_K';";
        Assert.Equal(0L, Scalar<long>(c, counter));
        Exec(c, "INSERT dbo.StatsProbe (K) SELECT TOP (500) 7 FROM sys.all_columns;");
        Assert.Equal(500L, Scalar<long>(c, counter));
        Exec(c, "UPDATE STATISTICS dbo.StatsProbe IX_StatsProbe_K WITH FULLSCAN;");
        Assert.Equal(0L, Scalar<long>(c, counter));
    }

    [Fact] // sqlserver-maintenance
    public void SF27_RandomKeyInsertsFragmentAndRebuildIsMeasuredWithIntegrityCheck()
    {
        using var c = db.Open();
        Exec(c, "CREATE TABLE dbo.GuidKeys (Id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY CLUSTERED, Payload char(400) NOT NULL DEFAULT '');");
        Exec(c, "SET NOCOUNT ON; BEGIN TRAN; DECLARE @i int = 0; WHILE @i < 20000 BEGIN INSERT dbo.GuidKeys DEFAULT VALUES; SET @i += 1; END; COMMIT;");
        const string frag = "SELECT CAST(MAX(avg_fragmentation_in_percent) AS float) FROM sys.dm_db_index_physical_stats(DB_ID(), OBJECT_ID('dbo.GuidKeys'), 1, NULL, 'LIMITED');";
        var before = Scalar<double>(c, frag);
        Exec(c, "ALTER INDEX ALL ON dbo.GuidKeys REBUILD;");
        var after = Scalar<double>(c, frag);
        Exec(c, $"DBCC CHECKDB ([{db.Name}]) WITH NO_INFOMSGS;");
        Observed.Write("SF27", $"clustered index fragmentation: before rebuild {before:F1}%, after {after:F1}% (same table, same rows)");
        Assert.True(before > 30, $"before {before:F1}%");
        Assert.True(after < 10, $"after {after:F1}%");
    }
}
