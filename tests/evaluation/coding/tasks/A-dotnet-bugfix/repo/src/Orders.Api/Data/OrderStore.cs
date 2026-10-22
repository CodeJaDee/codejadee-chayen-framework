using Orders.Api.Contracts;

namespace Orders.Api.Data;

public interface IOrderStore
{
    IReadOnlyList<OrderSummary> All();
}

public sealed class InMemoryOrderStore(IReadOnlyList<OrderSummary> orders) : IOrderStore
{
    public IReadOnlyList<OrderSummary> All() => orders;
}

// Synthetic sample data: no real customers.
public static class SampleOrders
{
    public static IReadOnlyList<OrderSummary> Create(int count) =>
        Enumerable.Range(1, count).Select(i => new OrderSummary(i, $"Customer {i:000}", 10m + i)).ToList();
}
