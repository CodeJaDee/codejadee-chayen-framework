using System.Text.Json;

namespace Orders.Api.Tests;

public class PagingRegressionTests
{
    [Theory]
    [InlineData(20, 10, 2)]
    [InlineData(0, 10, 0)]
    public async Task TotalPages_has_no_extra_page_for_exact_multiples_or_no_orders(int count, int pageSize, int expected)
    {
        var client = TestApp.WithOrders(count);
        using var doc = JsonDocument.Parse(await client.GetStringAsync($"/api/orders?page=1&pageSize={pageSize}"));
        Assert.Equal(expected, doc.RootElement.GetProperty("pageCount").GetInt32());
    }
}
