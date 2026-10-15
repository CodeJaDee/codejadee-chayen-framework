using Microsoft.EntityFrameworkCore;
namespace Api.Data;
public class Customer { public int Id { get; set; } public string Name { get; set; } = ""; }
public class Order { public int Id { get; set; } public int? CustomerId { get; set; } public Customer? Customer { get; set; } public decimal Total { get; set; } public DateTime PlacedAt { get; set; } }
public class AppDb(DbContextOptions<AppDb> o) : DbContext(o) { public DbSet<Order> Orders => Set<Order>(); public DbSet<Customer> Customers => Set<Customer>(); }
