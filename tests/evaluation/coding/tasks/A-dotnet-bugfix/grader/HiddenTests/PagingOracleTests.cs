using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Orders.Api.Data;

namespace HiddenTests;

// Evaluator-only oracle for task A: the page count is a ceiling for every size, the response shape is
// unchanged, and invalid paging is still rejected.
public class PagingOracleTests
{
    private static HttpClient Client(int count) =>
        new WebApplicationFactory<Program>()
            .WithWebHostBuilder(b => b.ConfigureTestServices(s =>
            {
                s.RemoveAll<IOrderStore>();
                s.AddSingleton<IOrderStore>(new InMemoryOrderStore(SampleOrders.Create(count)));
            }))
            .CreateClient();

    private static async Task<JsonElement> Get(int count, string query)
    {
        var json = await Client(count).GetStringAsync($"/api/orders?{query}");
        return JsonDocument.Parse(json).RootElement.Clone();
    }

    [Theory]
    [InlineData(20, 10, 2)]
    [InlineData(30, 15, 2)]
    [InlineData(21, 10, 3)]
    [InlineData(25, 10, 3)]
    [InlineData(1, 100, 1)]
    [InlineData(100, 1, 100)]
    [InlineData(0, 10, 0)]
    public async Task TotalPages_is_the_ceiling_of_count_over_page_size(int count, int pageSize, int expected)
    {
        var body = await Get(count, $"page=1&pageSize={pageSize}");
        Assert.Equal(expected, body.GetProperty("totalPages").GetInt32());
        Assert.Equal(count, body.GetProperty("totalCount").GetInt32());
    }

    [Fact]
    public async Task Response_shape_is_unchanged()
    {
        var body = await Get(20, "page=2&pageSize=10");
        var names = body.EnumerateObject().Select(p => p.Name).OrderBy(n => n).ToArray();
        Assert.Equal(new[] { "items", "page", "pageSize", "totalCount", "totalPages" }, names);
        Assert.Equal(10, body.GetProperty("items").GetArrayLength());
        Assert.Equal(11, body.GetProperty("items")[0].GetProperty("id").GetInt32());
    }

    [Fact]
    public async Task A_page_past_the_end_is_empty_not_an_error()
    {
        var body = await Get(20, "page=3&pageSize=10");
        Assert.Equal(0, body.GetProperty("items").GetArrayLength());
        Assert.Equal(2, body.GetProperty("totalPages").GetInt32());
    }

    [Theory]
    [InlineData("page=1&pageSize=0")]
    [InlineData("page=1&pageSize=101")]
    [InlineData("page=0&pageSize=10")]
    public async Task Invalid_paging_is_still_a_problem_details_400(string query)
    {
        var response = await Client(20).GetAsync($"/api/orders?{query}");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
    }
}
