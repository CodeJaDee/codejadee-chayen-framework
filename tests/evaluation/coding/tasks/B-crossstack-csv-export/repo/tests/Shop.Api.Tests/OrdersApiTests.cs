using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Shop.Api.Orders;

namespace Shop.Api.Tests;

public class OrdersApiTests
{
    private static HttpClient Client(string? user = null, string? roles = null)
    {
        var client = new WebApplicationFactory<Program>().CreateClient();
        if (user is not null) client.DefaultRequestHeaders.Add("X-Demo-User", user);
        if (roles is not null) client.DefaultRequestHeaders.Add("X-Demo-Roles", roles);
        return client;
    }

    [Fact]
    public async Task Anonymous_callers_get_401()
    {
        var response = await Client().GetAsync("/api/orders");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Status_filter_returns_only_matching_orders()
    {
        var orders = await Client("support.user", "Support").GetFromJsonAsync<Order[]>("/api/orders?status=open");
        Assert.NotNull(orders);
        Assert.Equal(3, orders.Length);
        Assert.All(orders, o => Assert.Equal("Open", o.Status));
    }
}
