using Pricing;

namespace Pricing.Tests;

public class LoyaltyDiscountTests
{
    [Theory]
    [InlineData(100.00, true, 5.00)]
    [InlineData(250.00, true, 12.50)]
    [InlineData(99.99, true, 0)]
    [InlineData(250.00, false, 0)]
    public void AC1_members_get_5_percent_from_100(decimal total, bool member, decimal expected) =>
        Assert.Equal(expected, LoyaltyDiscount.Calculate(total, member));

    [Theory]
    [InlineData(400.00, 20.00)]
    [InlineData(10000.00, 20.00)]
    public void AC2_the_discount_is_capped_at_20(decimal total, decimal expected) =>
        Assert.Equal(expected, LoyaltyDiscount.Calculate(total, true));
}
