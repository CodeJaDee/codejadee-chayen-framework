using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Shop.Api.Tests;

public class OrderExportTests
{
    private static HttpClient Client(string roles)
    {
        var client = new WebApplicationFactory<Program>().CreateClient();
        client.DefaultRequestHeaders.Add("X-Demo-User", "test.user");
        client.DefaultRequestHeaders.Add("X-Demo-Roles", roles);
        return client;
    }

    [Fact]
    public async Task Sales_can_export_open_orders()
    {
        var response = await Client("Sales").GetAsync("/api/orders/export?status=Open");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var text = await response.Content.ReadAsStringAsync();
        Assert.StartsWith("Id,Customer,Status,Total,PlacedOn\r\n", text);
        Assert.Contains("\"Smith, Jane\"", text);
    }

    [Fact]
    public async Task Support_cannot_export()
    {
        var response = await Client("Support").GetAsync("/api/orders/export");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
