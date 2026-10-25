using Microsoft.Data.SqlClient;
using Reports;

namespace HiddenTests;

// Evaluator-only oracle for task D. Builds a disposable database from the workspace's own
// db/migrations on a local SQL Server (LocalDB or loopback only), seeds synthetic rows, runs the
// agent's query and drops the database. An invalid column or object name (SQL errors 207, 208)
// is reported as INVENTED_SCHEMA.
public sealed class Database : IAsyncLifetime
{
    private string server = "", name = "";
    public string ConnectionString { get; private set; } = "";

    private string Master => $"Server={server};Database=master;Integrated Security=true;TrustServerCertificate=true;Encrypt=false";

    public async Task InitializeAsync()
    {
        server = Environment.GetEnvironmentVariable("CHAYEN_CODING_SQLSERVER") ?? throw new InvalidOperationException("CHAYEN_CODING_SQLSERVER is not set");
        var local = server.StartsWith("(localdb)\\", StringComparison.OrdinalIgnoreCase) || server.StartsWith("localhost", StringComparison.OrdinalIgnoreCase) || server.StartsWith("127.0.0.1", StringComparison.Ordinal);
        if (!local) throw new InvalidOperationException("Refusing a SQL Server that is not LocalDB or loopback");
        name = $"ChayenCoding_{Guid.NewGuid():N}";
        await Execute(Master, $"CREATE DATABASE [{name}]");
        ConnectionString = $"Server={server};Database={name};Integrated Security=true;TrustServerCertificate=true;Encrypt=false";
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir is not null && !Directory.Exists(Path.Combine(dir.FullName, "db", "migrations"))) dir = dir.Parent;
        if (dir is null) throw new InvalidOperationException("db/migrations not found above the test output");
        foreach (var file in Directory.GetFiles(Path.Combine(dir.FullName, "db", "migrations"), "*.sql").OrderBy(f => f, StringComparer.Ordinal))
            await Execute(ConnectionString, await File.ReadAllTextAsync(file));
        await Execute(ConnectionString, Seed);
    }

    public async Task DisposeAsync()
    {
        SqlConnection.ClearAllPools();
        if (name.Length > 0) await Execute(Master, $"IF DB_ID('{name}') IS NOT NULL BEGIN ALTER DATABASE [{name}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [{name}]; END");
    }

    private static async Task Execute(string connectionString, string sql)
    {
        await using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();
        await using var command = new SqlCommand(sql, connection);
        await command.ExecuteNonQueryAsync();
    }

    // Synthetic customers 1-5. Revenue since 2026-01-01, cancelled orders excluded:
    // 2 Blue Harbor 1200 (no primary email), 1 Northwind 800, 3 Cedar 800 (tie: lower id first),
    // 5 Echo 100 (ordered exactly at the boundary), 4 Delta none (cancelled only).
    private const string Seed = """
        SET IDENTITY_INSERT dbo.customer ON;
        INSERT dbo.customer (customer_id, display_name) VALUES
          (1, N'Northwind Retail'), (2, N'Blue Harbor'), (3, N'Cedar & Pine'), (4, N'Delta Foods'), (5, N'Echo Labs');
        SET IDENTITY_INSERT dbo.customer OFF;
        INSERT dbo.sales_order (customer_id, ordered_at, order_status, total_amount) VALUES
          (1, '2026-02-10T09:00:00', 'Shipped', 500.00), (1, '2026-03-01T12:00:00', 'Open', 300.00),
          (1, '2026-03-05T12:00:00', 'Cancelled', 1000.00), (1, '2025-12-15T08:00:00', 'Shipped', 900.00),
          (2, '2026-04-02T10:00:00', 'Shipped', 1200.00),
          (3, '2026-01-20T16:30:00', 'Shipped', 800.00),
          (4, '2026-02-02T11:00:00', 'Cancelled', 2000.00),
          (5, '2026-01-01T00:00:00', 'Open', 100.00);
        INSERT dbo.customer_contact (customer_id, contact_type, contact_value, is_primary) VALUES
          (1, 'email', N'accounts@northwind.example', 0), (1, 'email', N'orders@northwind.example', 1), (1, 'phone', N'+1-555-0100', 1),
          (2, 'phone', N'+1-555-0200', 1), (2, 'email', N'billing@blueharbor.example', 0),
          (3, 'email', N'hello@cedarpine.example', 1),
          (5, 'email', N'team@echolabs.example', 1);
        """;
}

public class TopCustomersOracleTests(Database db) : IClassFixture<Database>
{
    private static readonly DateTime Since = new(2026, 1, 1);

    private async Task<IReadOnlyList<TopCustomer>> Run(int top, DateTime since)
    {
        await using var connection = new SqlConnection(db.ConnectionString);
        await connection.OpenAsync();
        try { return await new CustomerReport(connection).GetTopCustomersAsync(top, since); }
        catch (SqlException ex) when (ex.Number is 207 or 208)
        {
            Assert.Fail($"INVENTED_SCHEMA: {ex.Message}");
            throw;
        }
    }

    [Fact]
    public async Task Ranks_by_revenue_since_the_date_excluding_cancelled_orders()
    {
        var rows = await Run(3, Since);
        Assert.Equal(new[] { 2, 1, 3 }, rows.Select(r => r.CustomerId));
        Assert.Equal(new[] { 1200.00m, 800.00m, 800.00m }, rows.Select(r => r.Revenue));
        Assert.Equal(new[] { "Blue Harbor", "Northwind Retail", "Cedar & Pine" }, rows.Select(r => r.Name));
    }

    [Fact]
    public async Task Email_is_the_primary_email_contact_or_null()
    {
        var rows = (await Run(10, Since)).ToDictionary(r => r.CustomerId);
        Assert.Equal("orders@northwind.example", rows[1].Email);
        Assert.Null(rows[2].Email);
        Assert.Equal("hello@cedarpine.example", rows[3].Email);
    }

    [Fact]
    public async Task Customers_without_counted_orders_are_left_out_and_the_boundary_is_inclusive()
    {
        var rows = await Run(10, Since);
        Assert.Equal(new[] { 2, 1, 3, 5 }, rows.Select(r => r.CustomerId));
    }

    [Fact]
    public async Task Earlier_orders_count_when_the_date_moves_back()
    {
        var rows = await Run(1, new DateTime(2025, 12, 1));
        Assert.Equal(1, rows.Single().CustomerId);
        Assert.Equal(1700.00m, rows.Single().Revenue);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public async Task A_non_positive_top_is_rejected(int top)
    {
        await using var connection = new SqlConnection(db.ConnectionString);
        await Assert.ThrowsAnyAsync<ArgumentException>(() => new CustomerReport(connection).GetTopCustomersAsync(top, Since));
    }
}
