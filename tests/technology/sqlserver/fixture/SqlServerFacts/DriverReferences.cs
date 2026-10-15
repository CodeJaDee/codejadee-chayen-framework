using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace SqlServerFacts;

// Compile-only: every API listed in the "Driver references" table of
// skills/chayen-data/references/sqlserver-data-access.md is used here, so a
// successful build proves each name resolves against the referenced package
// versions (DR-01..DR-03 in run-fact-checks.mjs). Nothing here is executed.
public static class DriverReferences
{
    public sealed class Ticket
    {
        public int Id { get; set; }
        public decimal Total { get; set; }
        public byte[] Version { get; set; } = [];
    }

    public sealed class TicketContext(DbContextOptions<TicketContext> options) : DbContext(options)
    {
        public DbSet<Ticket> Tickets => Set<Ticket>();
        protected override void OnModelCreating(ModelBuilder m)
        {
            m.Entity<Ticket>().ToTable("Tickets", t => t.IsTemporal());
            m.Entity<Ticket>().Property(t => t.Version).IsRowVersion();
            m.Entity<Ticket>().Property(t => t.Total).HasPrecision(18, 2).HasDefaultValueSql("0");
        }
    }

    // EF Core SQL Server provider (Microsoft.EntityFrameworkCore.SqlServer)
    public static async Task EfCore(string cs, int id, CancellationToken ct)
    {
        var options = new DbContextOptionsBuilder<TicketContext>()
            .UseSqlServer(cs, o => o.EnableRetryOnFailure().UseCompatibilityLevel(160).CommandTimeout(30))
            .Options;
        await using var db = new TicketContext(options);
        _ = db.Tickets.AsNoTracking().Where(t => t.Id == id).ToQueryString();
        _ = await db.Tickets.AsNoTrackingWithIdentityResolution().AsSplitQuery().ToListAsync(ct);
        _ = await db.Tickets.TemporalAsOf(DateTime.UtcNow).ToListAsync(ct);
        _ = await db.Tickets.FromSql($"SELECT * FROM dbo.Tickets WHERE Id = {id}").ToListAsync(ct);
        _ = await db.Database.SqlQuery<int>($"SELECT Id AS Value FROM dbo.Tickets WHERE Id = {id}").ToListAsync(ct);
        await db.Tickets.Where(t => t.Id == id).ExecuteUpdateAsync(s => s.SetProperty(t => t.Total, 0m), ct);
        await db.Tickets.Where(t => t.Id == id).ExecuteDeleteAsync(ct);
        await db.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
        {
            await using var tx = await db.Database.BeginTransactionAsync(IsolationLevel.ReadCommitted, ct);
            try { await db.SaveChangesAsync(ct); await tx.CommitAsync(ct); }
            catch (DbUpdateConcurrencyException) { await tx.RollbackAsync(ct); throw; }
        });
    }

    // Dapper (Dapper) over Microsoft.Data.SqlClient
    public static async Task Dapper(SqlConnection c, IEnumerable<int> ids, CancellationToken ct)
    {
        _ = await c.QueryAsync<Ticket>(new CommandDefinition("SELECT Id, Total FROM dbo.Tickets WHERE Id IN @ids;", new { ids }, cancellationToken: ct));
        _ = await c.QuerySingleOrDefaultAsync<Ticket>(new CommandDefinition("SELECT Id, Total FROM dbo.Tickets WHERE Code = @code;", new { code = new DbString { Value = "A1", IsAnsi = true, Length = 20 } }, cancellationToken: ct));
        var table = new DataTable();
        table.Columns.Add("Id", typeof(int));
        var p = new DynamicParameters();
        p.Add("@ids", table.AsTableValuedParameter("dbo.IdList"));
        await using var tx = await c.BeginTransactionAsync(IsolationLevel.ReadCommitted, ct);
        _ = await c.ExecuteAsync(new CommandDefinition("dbo.ArchiveTickets", p, tx, commandType: CommandType.StoredProcedure, cancellationToken: ct));
        using var grid = await c.QueryMultipleAsync(new CommandDefinition("SELECT 1; SELECT 2;", transaction: tx, cancellationToken: ct));
    }

    // ADO.NET (Microsoft.Data.SqlClient)
    public static async Task AdoNet(string cs, DataTable rows, CancellationToken ct)
    {
        var b = new SqlConnectionStringBuilder(cs) { ApplicationIntent = ApplicationIntent.ReadOnly };
        await using var c = new SqlConnection(b.ConnectionString)
        {
            RetryLogicProvider = SqlConfigurableRetryFactory.CreateExponentialRetryProvider(new SqlRetryLogicOption { NumberOfTries = 3, DeltaTime = TimeSpan.FromSeconds(1), MaxTimeInterval = TimeSpan.FromSeconds(10) }),
        };
        await c.OpenAsync(ct);
        await using SqlTransaction tx = (SqlTransaction)await c.BeginTransactionAsync(IsolationLevel.Snapshot, ct);
        await using var cmd = new SqlCommand("SELECT Id FROM dbo.Tickets WHERE Code = @code;", c, tx);
        cmd.Parameters.Add(new SqlParameter("@code", SqlDbType.VarChar, 20) { Value = "A1" });
        try { await using var r = await cmd.ExecuteReaderAsync(ct); }
        catch (SqlException e) when (e.Number == 1205) { }
        using var bulk = new SqlBulkCopy(c, SqlBulkCopyOptions.CheckConstraints, tx) { DestinationTableName = "dbo.Tickets", BatchSize = 1000 };
        await bulk.WriteToServerAsync(rows, ct);
    }
}
