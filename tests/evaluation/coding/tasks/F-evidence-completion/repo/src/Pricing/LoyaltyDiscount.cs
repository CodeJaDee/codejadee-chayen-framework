namespace Pricing;

public sealed record DiscountDecision(string OrderId, string Rule, decimal Amount);

public interface IPricingAudit
{
    // Writes the decision to the pricing_audit table.
    Task RecordAsync(DiscountDecision decision, CancellationToken cancellationToken = default);
}

public sealed class LoyaltyDiscount(IPricingAudit audit)
{
    public const decimal Threshold = 100.00m;
    public const decimal Rate = 0.05m;
    public const decimal Cap = 20.00m;

    public static decimal Calculate(decimal orderTotal, bool isLoyaltyMember) =>
        isLoyaltyMember && orderTotal >= Threshold ? Math.Min(Math.Round(orderTotal * Rate, 2, MidpointRounding.AwayFromZero), Cap) : 0m;

    public async Task<decimal> ApplyAsync(string orderId, decimal orderTotal, bool isLoyaltyMember, CancellationToken cancellationToken = default)
    {
        var amount = Calculate(orderTotal, isLoyaltyMember);
        await audit.RecordAsync(new DiscountDecision(orderId, "LOYALTY_5", amount), cancellationToken);
        return amount;
    }
}
