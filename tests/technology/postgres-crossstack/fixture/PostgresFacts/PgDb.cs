using System.Diagnostics;
using Npgsql;
using Xunit;

[assembly: CollectionBehavior(DisableTestParallelization = true)]

namespace PostgresFacts;

// One disposable database per run on a LOCAL PostgreSQL server only, dropped at the end.
// CHAYEN_POSTGRES_FACTS_URL is an Npgsql connection string to a maintenance database on a
// loopback host (the runner starts a throwaway cluster). Any other host is refused, so these
// facts can never touch a shared or production database.
public sealed class PgDb : IDisposable
{
    public string Name { get; } = $"chayen_facts_{Guid.NewGuid():N}";
    public string BinDir { get; } = Environment.GetEnvironmentVariable("CHAYEN_POSTGRES_FACTS_BIN") ?? "";
    readonly NpgsqlConnectionStringBuilder admin;

    public PgDb()
    {
        var url = Environment.GetEnvironmentVariable("CHAYEN_POSTGRES_FACTS_URL")
            ?? throw new InvalidOperationException("CHAYEN_POSTGRES_FACTS_URL is not set (run through run-fact-checks.mjs)");
        admin = new NpgsqlConnectionStringBuilder(url) { Pooling = false };
        if (admin.Host is not ("127.0.0.1" or "localhost" or "::1"))
            throw new InvalidOperationException($"Refusing non-local host '{admin.Host}': fact checks run only on a loopback PostgreSQL server.");
        using var c = Open(admin.Database ?? "postgres");
        Exec(c, $"CREATE DATABASE {Name}");
        try
        {
            using var db = Open();
            var settings = Scalar<string>(db, "SELECT concat_ws('; ', 'version=' || current_setting('server_version'), 'encoding=' || current_setting('server_encoding'), 'lc_collate=' || datcollate, 'timezone=' || current_setting('TimeZone'), 'default_isolation=' || current_setting('default_transaction_isolation')) FROM pg_database WHERE datname = current_database()");
            Observed.Write("ENV", settings);
        }
        catch { Dispose(); throw; }
    }

    public string ConnectionString(string? database = null) =>
        new NpgsqlConnectionStringBuilder(admin.ConnectionString) { Database = database ?? Name, Pooling = false, CommandTimeout = 60 }.ConnectionString;

    public NpgsqlConnection Open(string? database = null)
    {
        var c = new NpgsqlConnection(ConnectionString(database));
        c.Open();
        return c;
    }

    public static int Exec(NpgsqlConnection c, string sql, params NpgsqlParameter[] ps)
    {
        using var cmd = new NpgsqlCommand(sql, c);
        cmd.Parameters.AddRange(ps);
        return cmd.ExecuteNonQuery();
    }

    public static T Scalar<T>(NpgsqlConnection c, string sql, params NpgsqlParameter[] ps)
    {
        using var cmd = new NpgsqlCommand(sql, c);
        cmd.Parameters.AddRange(ps);
        return (T)Convert.ChangeType(cmd.ExecuteScalar()!, typeof(T));
    }

    public static PostgresException Fails(Action a)
    {
        try { a(); }
        catch (PostgresException e) { return e; }
        throw new Xunit.Sdk.XunitException("expected a PostgresException, but the statement succeeded");
    }

    public static string Plan(NpgsqlConnection c, string sql) =>
        string.Join("\n", Rows(c, "EXPLAIN " + sql));

    public static List<string> Rows(NpgsqlConnection c, string sql)
    {
        using var cmd = new NpgsqlCommand(sql, c);
        using var r = cmd.ExecuteReader();
        var rows = new List<string>();
        while (r.Read()) rows.Add(r.GetValue(0).ToString()!);
        return rows;
    }

    // Runs a PostgreSQL client tool from the same installation as the server (pg_dump, pg_restore, pg_amcheck).
    public (int Code, string Out) Tool(string exe, params string[] args)
    {
        var psi = new ProcessStartInfo(Path.Combine(BinDir, exe)) { RedirectStandardOutput = true, RedirectStandardError = true };
        foreach (var a in new[] { "-h", admin.Host!, "-p", admin.Port.ToString(), "-U", admin.Username! }.Concat(args)) psi.ArgumentList.Add(a);
        using var p = Process.Start(psi)!;
        var stdout = p.StandardOutput.ReadToEndAsync();
        var stderr = p.StandardError.ReadToEndAsync();
        p.WaitForExit();
        return (p.ExitCode, stdout.Result + stderr.Result);
    }

    public void Dispose()
    {
        NpgsqlConnection.ClearAllPools();
        using var c = Open(admin.Database ?? "postgres");
        foreach (var db in Rows(c, $"SELECT datname FROM pg_database WHERE datname LIKE '{Name}%'"))
            Exec(c, $"DROP DATABASE IF EXISTS {db} WITH (FORCE)");
        foreach (var role in Rows(c, "SELECT rolname FROM pg_roles WHERE rolname LIKE 'facts\\_%'"))
            Exec(c, $"DROP ROLE IF EXISTS {role}");
    }
}

public static class Observed
{
    public static void Write(string fact, string text)
    {
        var file = Environment.GetEnvironmentVariable("CHAYEN_FACTS_OBSERVED");
        if (file is not null) File.AppendAllText(file, $"{fact}\t{text.Replace('\n', ' ')}\n");
    }
}

[CollectionDefinition("pg")]
public sealed class PgCollection : ICollectionFixture<PgDb> { }
