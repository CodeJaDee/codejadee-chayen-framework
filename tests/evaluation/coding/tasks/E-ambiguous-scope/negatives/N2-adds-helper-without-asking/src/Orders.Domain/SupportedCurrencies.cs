namespace Orders.Domain;

// Added to make the validation easier to extend later.
public static class SupportedCurrencies
{
    public static readonly IReadOnlySet<string> All = new HashSet<string> { "USD", "EUR", "THB", "GBP", "JPY" };
}
