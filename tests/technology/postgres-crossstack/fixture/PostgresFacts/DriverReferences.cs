using System.Data;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using NpgsqlTypes;

namespace PostgresFacts;

// Compile-only: every .NET API listed in the "Driver references" table of
// skills/chayen-data/references/postgres-data-access.md is used here, so a
// successful build proves each name resolves against the referenced package
// versions (DR-01..DR-03 in run-fact-checks.mjs). Nothing here is executed.
public static class DriverReferences
{
    public enum Mood { Happy, Sad }

    public sealed class Ticket
    {
        public int Id { get; set; }
        public string Code { get; set; } = "";
        public string Body { get; set; } = "{}";
        public DateTime CreatedAt { get; set; }
        public uint Version { get; set; }
        public bool Open { get; set; }
    }

    public sealed class TicketContext(DbContextOptions<TicketContext> options) : DbContext(options)
    {
        public DbSet<Ticket> Tickets => Set<Ticket>();
        protected override void OnModelCreating(ModelBuilder m)
        {
            m.Entity<Ticket>().Property(t => t.Body).HasColumnType("jsonb");
            m.Entity<Ticket>().Property(t => t.CreatedAt).HasColumnType("timestamp with time zone");
            m.Entity<Ticket>().Property(t => t.Version).IsRowVersion();   // maps to the xmin system column
            m.Entity<Ticket>().HasIndex(t => t.Body).HasMethod("gin");
            m.Entity<Ticket>().HasIndex(t => t.Code).HasFilter("\"Open\"");
        }
    }

    // EF Core Npgsql provider (Npgsql.EntityFrameworkCore.PostgreSQL)
    public static async Task EfCore(string cs, string term, CancellationToken ct)
    {
        var options = new DbContextOptionsBuilder<TicketContext>()
            .UseNpgsql(cs, o => o.EnableRetryOnFailure().MapEnum<Mood>("mood"))
            .Options;
        await using var db = new TicketContext(options);
        _ = db.Tickets.AsNoTracking().Where(t => EF.Functions.ILike(t.Code, $"%{term}%")).ToQueryString();
        _ = await db.Tickets.AsSplitQuery().ToListAsync(ct);
        _ = await db.Tickets.FromSql($"SELECT * FROM tickets WHERE code = {term}").ToListAsync(ct);
        await db.Tickets.Where(t => t.Code == term).ExecuteUpdateAsync(s => s.SetProperty(t => t.Open, false), ct);
        await db.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
        {
            await using var tx = await db.Database.BeginTransactionAsync(IsolationLevel.RepeatableRead, ct);
            try { await db.SaveChangesAsync(ct); await tx.CommitAsync(ct); }
            catch (DbUpdateConcurrencyException) { await tx.RollbackAsync(ct); throw; }
        });
    }

    // Npgsql (Npgsql)
    public static async Task Npgsql(string cs, IReadOnlyList<(int Id, string Code)> rows, CancellationToken ct)
    {
        var builder = new NpgsqlDataSourceBuilder(cs);
        builder.EnableDynamicJson();
        await using NpgsqlDataSource source = builder.Build();
        await using var conn = await source.OpenConnectionAsync(ct);
        await using (var cmd = new NpgsqlCommand("SELECT id FROM tickets WHERE code = @code", conn))
        {
            cmd.Parameters.Add(new NpgsqlParameter("code", NpgsqlDbType.Text) { Value = "A1" });
            try { await cmd.ExecuteScalarAsync(ct); }
            catch (PostgresException e) when (e.SqlState == PostgresErrorCodes.SerializationFailure) { }
        }
        await using (var batch = new NpgsqlBatch(conn))
        {
            batch.BatchCommands.Add(new NpgsqlBatchCommand("SELECT 1"));
            batch.BatchCommands.Add(new NpgsqlBatchCommand("SELECT 2"));
            await batch.ExecuteNonQueryAsync(ct);
        }
        await using (var import = await conn.BeginBinaryImportAsync("COPY tickets (id, code) FROM STDIN (FORMAT BINARY)", ct))
        {
            foreach (var (id, code) in rows)
            {
                await import.StartRowAsync(ct);
                await import.WriteAsync(id, NpgsqlDbType.Integer, ct);
                await import.WriteAsync(code, NpgsqlDbType.Text, ct);
            }
            await import.CompleteAsync(ct);
        }
    }

    // Dapper over Npgsql (Dapper): one of the "other compatible configurations"
    public static async Task Dapper(NpgsqlDataSource source, int[] ids, CancellationToken ct)
    {
        await using var conn = await source.OpenConnectionAsync(ct);
        _ = await conn.QueryAsync<Ticket>(new CommandDefinition("SELECT id, code FROM tickets WHERE id = ANY(@ids)", new { ids }, cancellationToken: ct));
        _ = await conn.ExecuteAsync(new CommandDefinition("UPDATE tickets SET open = false WHERE id = ANY(@ids)", new { ids }, cancellationToken: ct));
    }
}
