using System.Data.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace SqlServerFacts;

public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public List<Order> Orders { get; set; } = [];
}

public class Order
{
    public int Id { get; set; }
    public string Number { get; set; } = "";
    public decimal Total { get; set; }
    public int CustomerId { get; set; }
}

public sealed class CommandCounter : DbCommandInterceptor
{
    public int Count;
    public override InterceptionResult<DbDataReader> ReaderExecuting(DbCommand command, CommandEventData eventData, InterceptionResult<DbDataReader> result)
    {
        Interlocked.Increment(ref Count);
        return result;
    }
}

public sealed class FactContext(string connectionString, Action<Microsoft.EntityFrameworkCore.Infrastructure.SqlServerDbContextOptionsBuilder>? sql = null, CommandCounter? counter = null) : DbContext
{
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Order> Orders => Set<Order>();

    protected override void OnConfiguring(DbContextOptionsBuilder b)
    {
        b.UseSqlServer(connectionString, o => sql?.Invoke(o));
        if (counter is not null) b.AddInterceptors(counter);
    }

    // Shared by SF09, SF16, SF17: 10 customers with 3 orders each, created once per run.
    public static int EnsureSeeded(string cs)
    {
        using var ctx = new FactContext(cs);
        ctx.Database.ExecuteSqlRaw("""
            IF OBJECT_ID('dbo.Orders') IS NULL
            BEGIN
              CREATE TABLE dbo.Customers (Id int IDENTITY PRIMARY KEY, Name nvarchar(100) NOT NULL);
              CREATE TABLE dbo.Orders (Id int IDENTITY PRIMARY KEY, Number varchar(20) NOT NULL CONSTRAINT UQ_Orders_Number UNIQUE,
                Total decimal(18,2) NOT NULL, CustomerId int NOT NULL REFERENCES dbo.Customers(Id));
            END
            """);
        if (!ctx.Customers.Any())
        {
            for (var i = 0; i < 10; i++)
                ctx.Customers.Add(new Customer { Name = $"C{i}", Orders = [new() { Number = $"N{i}a" }, new() { Number = $"N{i}b" }, new() { Number = $"N{i}c" }] });
            ctx.SaveChanges();
        }
        return ctx.Customers.Count();
    }

    protected override void OnModelCreating(ModelBuilder m)
    {
        m.Entity<Order>().Property(o => o.Number).HasMaxLength(20).IsUnicode(false);
        m.Entity<Order>().Property(o => o.Total).HasPrecision(18, 2);
        m.Entity<Order>().HasIndex(o => o.Number).IsUnique();
        m.Entity<Customer>().Property(c => c.Name).HasMaxLength(100);
    }
}
