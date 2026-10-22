namespace Orders.Domain;

public sealed record OrderLine(string Sku, int Quantity, decimal UnitPrice);

public sealed record OrderDraft(string CustomerId, string Currency, IReadOnlyList<OrderLine> Lines);

// Error codes are consumed by the back-office import; keep them stable.
public static class OrderValidator
{
    public static IReadOnlyList<string> Validate(OrderDraft order)
    {
        var errors = new List<string>();
        if (order.CustomerId == null || order.CustomerId == "") errors.Add("ORD-001");
        if (order.Currency != "USD" && order.Currency != "EUR" && order.Currency != "THB") errors.Add("ORD-002");
        if (order.Lines == null || order.Lines.Count == 0) errors.Add("ORD-003");
        else
        {
            for (int i = 0; i < order.Lines.Count; i++)
            {
                var line = order.Lines[i];
                if (line.Quantity <= 0) errors.Add("ORD-004");
                if (line.Quantity > 999) errors.Add("ORD-005");
                if (line.UnitPrice < 0) errors.Add("ORD-006");
            }
        }
        return errors;
    }
}
