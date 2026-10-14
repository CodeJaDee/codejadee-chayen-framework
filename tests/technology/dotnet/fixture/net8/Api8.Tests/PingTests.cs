using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
public class PingTests(WebApplicationFactory<Program> f) : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact] public async Task Ping() => Assert.Equal("pong", await f.CreateClient().GetStringAsync("/ping"));
}
