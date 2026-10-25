namespace Shop.Api.Orders;

public sealed record Order(int Id, string Customer, string Status, decimal Total, DateOnly PlacedOn);

public interface IOrderRepository
{
    // Orders with the given status (case-insensitive), or all orders when status is null or empty.
    IReadOnlyList<Order> List(string? status);
}

// Synthetic data only.
public sealed class InMemoryOrderRepository : IOrderRepository
{
    private static readonly Order[] Orders =
    [
        new(1001, "Acme Trading", "Open", 120.50m, new DateOnly(2026, 9, 1)),
        new(1002, "Smith, Jane", "Open", 89.99m, new DateOnly(2026, 9, 3)),
        new(1003, "O\"Neil Ltd", "Shipped", 1500.00m, new DateOnly(2026, 9, 4)),
        new(1004, "Bright Lights Co", "Cancelled", 42.00m, new DateOnly(2026, 9, 5)),
        new(1005, "Nordic Supplies", "Open", 12.50m, new DateOnly(2026, 9, 8)),
        new(1006, "Line\nBreak Studio", "Shipped", 300.00m, new DateOnly(2026, 9, 9)),
    ];

    public IReadOnlyList<Order> List(string? status) =>
        string.IsNullOrEmpty(status)
            ? Orders
            : Orders.Where(o => string.Equals(o.Status, status, StringComparison.OrdinalIgnoreCase)).ToArray();
}
