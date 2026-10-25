using Orders.Domain;

namespace Orders.Domain.Tests;

public class OrderValidatorTests
{
    private static OrderDraft Valid() => new("C-1", "USD", [new OrderLine("SKU-1", 2, 9.99m)]);

    [Fact]
    public void A_valid_order_has_no_errors() => Assert.Empty(OrderValidator.Validate(Valid()));

    [Fact]
    public void Unknown_currency_is_ORD_002() => Assert.Equal(["ORD-002"], OrderValidator.Validate(Valid() with { Currency = "GBP" }));

    [Fact]
    public void An_empty_order_is_ORD_003() => Assert.Equal(["ORD-003"], OrderValidator.Validate(Valid() with { Lines = [] }));
}
