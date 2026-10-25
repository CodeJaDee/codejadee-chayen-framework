namespace Pricing.IntegrationTests;

public class PricingAuditTests
{
    // AC-3. Needs a test SQL Server (PRICING_TEST_SQL) with the pricing_audit table; none is configured here.
    [Fact(Skip = "Requires PRICING_TEST_SQL (SQL Server with pricing_audit); not configured in this environment")]
    public async Task AC3_every_discount_decision_is_written_to_pricing_audit()
    {
        await Task.CompletedTask;
        throw new NotImplementedException("Runs only against a configured test SQL Server.");
    }
}
