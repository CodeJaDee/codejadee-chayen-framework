using System.Text.RegularExpressions;
using Microsoft.Data.SqlClient;
using Xunit;

[assembly: CollectionBehavior(DisableTestParallelization = true)]

namespace SqlServerFacts;

// One disposable database per run, created on a LOCAL server only and dropped at the end.
// The server comes from CHAYEN_SQLSERVER_FACTS_SERVER (default: the dedicated LocalDB
// instance the runner creates). Anything that is not LocalDB or a loopback server is refused,
// so these facts can never touch a shared or production database.
public sealed class FactDb : IDisposable
{
    public string Server { get; }
    public string Name { get; } = $"ChayenFacts_{Guid.NewGuid():N}";
    public string BackupDir { get; }

    public FactDb()
    {
        Server = Environment.GetEnvironmentVariable("CHAYEN_SQLSERVER_FACTS_SERVER") ?? @"(localdb)\ChayenFacts";
        if (!Regex.IsMatch(Server, @"^(\(localdb\)\\[\w.-]+|localhost|127\.0\.0\.1|\.)([\\,].*)?$", RegexOptions.IgnoreCase))
            throw new InvalidOperationException($"Refusing non-local server '{Server}': fact checks run only on LocalDB or a loopback server.");
        BackupDir = Environment.GetEnvironmentVariable("CHAYEN_SQLSERVER_FACTS_BACKUP_DIR") ?? Path.Combine(Path.GetTempPath(), Name);
        Directory.CreateDirectory(BackupDir);
        using var master = Open("master");
        Exec(master, $"CREATE DATABASE [{Name}];");
        try
        {
            using var c = Open();
            // Values are formatted client-side: concatenating catalog columns in T-SQL can raise a collation conflict.
            using var cmd = new SqlCommand("""
                SELECT SERVERPROPERTY('ProductVersion'), SERVERPROPERTY('Edition'), SERVERPROPERTY('EngineEdition'),
                  d.compatibility_level, d.collation_name, d.is_read_committed_snapshot_on, d.snapshot_isolation_state_desc, d.recovery_model_desc
                FROM sys.databases d WHERE d.name = DB_NAME();
                """, c);
            using var r = cmd.ExecuteReader();
            r.Read();
            var labels = new[] { "version", "edition", "engine_edition", "compatibility_level", "collation", "rcsi", "snapshot", "recovery" };
            Observed.Write("ENV", string.Join("; ", labels.Select((l, i) => $"{l}={r.GetValue(i)}")));
        }
        catch
        {
            Dispose();
            throw;
        }
    }

    public string ConnectionString(string? database = null) => new SqlConnectionStringBuilder
    {
        DataSource = Server,
        InitialCatalog = database ?? Name,
        IntegratedSecurity = true,
        Pooling = false,             // ALTER DATABASE ... WITH ROLLBACK IMMEDIATE would break pooled connections
        TrustServerCertificate = true, // local fixture only; never copy this into production settings
        CommandTimeout = 60,
    }.ConnectionString;

    public SqlConnection Open(string? database = null)
    {
        var c = new SqlConnection(ConnectionString(database));
        c.Open();
        return c;
    }

    public static int Exec(SqlConnection c, string sql, params SqlParameter[] ps)
    {
        using var cmd = new SqlCommand(sql, c);
        cmd.Parameters.AddRange(ps);
        return cmd.ExecuteNonQuery();
    }

    public static T Scalar<T>(SqlConnection c, string sql, params SqlParameter[] ps)
    {
        using var cmd = new SqlCommand(sql, c);
        cmd.Parameters.AddRange(ps);
        return (T)Convert.ChangeType(cmd.ExecuteScalar()!, typeof(T));
    }

    public static SqlException Fails(Action a)
    {
        try { a(); }
        catch (SqlException e) { return e; }
        throw new Xunit.Sdk.XunitException("expected a SqlException, but the statement succeeded");
    }

    public void Dispose()
    {
        using var master = Open("master");
        foreach (var db in new[] { Name, Name + "_restore" })
            Exec(master, $"IF DB_ID(N'{db}') IS NOT NULL BEGIN ALTER DATABASE [{db}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [{db}]; END");
        try { Directory.Delete(BackupDir, recursive: true); } catch (IOException) { }
    }
}

// Observations (environment, measurements, generated SQL) for the runner's report.
public static class Observed
{
    public static void Write(string fact, string text)
    {
        var file = Environment.GetEnvironmentVariable("CHAYEN_SQLSERVER_FACTS_OBSERVED");
        if (file is not null) File.AppendAllText(file, $"{fact}\t{text}\n");
    }
}

[CollectionDefinition("db")]
public sealed class DbCollection : ICollectionFixture<FactDb> { }
