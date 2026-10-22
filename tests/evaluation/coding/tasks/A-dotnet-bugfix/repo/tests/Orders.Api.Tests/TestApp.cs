using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Orders.Api.Data;

namespace Orders.Api.Tests;

// Starts the API in memory with a chosen number of synthetic orders.
public static class TestApp
{
    public static HttpClient WithOrders(int count) =>
        new WebApplicationFactory<Program>()
            .WithWebHostBuilder(b => b.ConfigureTestServices(s =>
            {
                s.RemoveAll<IOrderStore>();
                s.AddSingleton<IOrderStore>(new InMemoryOrderStore(SampleOrders.Create(count)));
            }))
            .CreateClient();
}
