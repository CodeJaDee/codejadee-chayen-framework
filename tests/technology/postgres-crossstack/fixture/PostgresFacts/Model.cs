using Microsoft.EntityFrameworkCore;

namespace PostgresFacts;

public class Order
{
    public int Id { get; set; }
    public string Number { get; set; } = "";
    public string CustomerEmail { get; set; } = "";
    public decimal Total { get; set; }
    public DateTime PlacedAt { get; set; }
}

// The same model on two providers: the generated SQL differs by engine (XF-14, PF-03).
public sealed class OrdersContext(Action<DbContextOptionsBuilder> provider) : DbContext
{
    public DbSet<Order> Orders => Set<Order>();
    protected override void OnConfiguring(DbContextOptionsBuilder b) => provider(b);
    protected override void OnModelCreating(ModelBuilder m)
    {
        m.Entity<Order>().Property(o => o.Number).HasMaxLength(20);
        m.Entity<Order>().Property(o => o.Total).HasPrecision(18, 2);
    }

    public static OrdersContext Npgsql(string cs) => new(b => b.UseNpgsql(cs));
    public static OrdersContext SqlServer() => new(b => b.UseSqlServer("Server=(localdb)\\unused;Database=unused"));
}
