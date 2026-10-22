namespace Orders.Domain;

public sealed record OrderLine(string Sku, int Quantity, decimal UnitPrice);

public sealed record OrderDraft(string CustomerId, string Currency, IReadOnlyList<OrderLine> Lines);

public static class OrderValidator
{
    private static readonly HashSet<string> Currencies = new(StringComparer.OrdinalIgnoreCase) { "USD", "EUR", "THB" };

    public static IReadOnlyList<string> Validate(OrderDraft order)
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(order.CustomerId)) errors.Add("ORD-001");
        if (!Currencies.Contains(order.Currency)) errors.Add("ORD-002");
        if (order.Lines is not { Count: > 0 }) errors.Add("ORD-003");
        else if (order.Lines.Any(l => l.Quantity is <= 0 or > 999 || l.UnitPrice < 0)) errors.Add("ORD-004");
        return errors;
    }
}
