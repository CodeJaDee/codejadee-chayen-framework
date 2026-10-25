using System.Net;
using System.Text.Json;

namespace Orders.Api.Tests;

public class OrdersEndpointTests
{
    [Fact]
    public async Task First_page_of_25_orders_has_10_items_and_3_pages()
    {
        var client = TestApp.WithOrders(25);
        using var doc = JsonDocument.Parse(await client.GetStringAsync("/api/orders?page=1&pageSize=10"));
        Assert.Equal(10, doc.RootElement.GetProperty("items").GetArrayLength());
        Assert.Equal(25, doc.RootElement.GetProperty("totalCount").GetInt32());
        Assert.Equal(3, doc.RootElement.GetProperty("totalPages").GetInt32());
    }

    [Fact]
    public async Task Page_size_zero_is_rejected()
    {
        var client = TestApp.WithOrders(25);
        var response = await client.GetAsync("/api/orders?page=1&pageSize=0");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
