// One test per technology fact (TF-nn) that the .NET pack guidance relies on.
// The runner (tests/technology/dotnet/run-fact-checks.mjs) maps each test
// name prefix to a fact ID and reports PASS or FAIL per fact.
using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Text.Json;
using FactApi;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Xunit;

public class FactTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
{
    // TF-01: WebApplicationFactory<Program> compiles against a top-level-statement
    // Program on .NET 10 without a hand-written "public partial class Program".
    [Fact]
    public async Task TF01_WebApplicationFactory_reaches_top_level_program()
    {
        var res = await factory.CreateClient().GetAsync("/orders/1");
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
    }

    // TF-02: TypedResults union returns 404 for a missing resource.
    [Fact]
    public async Task TF02_TypedResults_not_found()
    {
        var res = await factory.CreateClient().GetAsync("/orders/2");
        Assert.Equal(HttpStatusCode.NotFound, res.StatusCode);
    }

    // TF-03: .NET 10 minimal API validation (AddValidation) rejects DataAnnotations failures with 400 problem details.
    [Fact]
    public async Task TF03_minimal_api_validation_returns_400()
    {
        var res = await factory.CreateClient().PostAsJsonAsync("/orders", new { sku = "A", quantity = 0 });
        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
        Assert.Equal("application/problem+json", res.Content.Headers.ContentType?.MediaType);
        var ok = await factory.CreateClient().PostAsJsonAsync("/orders", new { sku = "A", quantity = 3 });
        Assert.Equal(HttpStatusCode.Created, ok.StatusCode);
    }

    // TF-04: With nullable reference types enabled, [ApiController] treats a non-nullable
    // reference property as required: a missing value is a 400, without [Required].
    [Fact]
    public async Task TF04_nullable_enabled_makes_non_nullable_property_required()
    {
        var res = await factory.CreateClient().PostAsJsonAsync("/people", new { nickname = "x" });
        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
        var body = await res.Content.ReadAsStringAsync();
        Assert.Contains("Name", body);
        var ok = await factory.CreateClient().PostAsJsonAsync("/people", new { name = "Ann" });
        Assert.Equal(HttpStatusCode.OK, ok.StatusCode);
    }

    // TF-05: An IExceptionHandler maps a domain exception to 404 problem details;
    // unhandled exceptions become 500 problem details without the exception message outside Development.
    [Fact]
    public async Task TF05_exception_handler_and_problem_details()
    {
        var client = factory.WithWebHostBuilder(b => b.UseEnvironment("Production")).CreateClient();
        var missing = await client.GetAsync("/missing");
        Assert.Equal(HttpStatusCode.NotFound, missing.StatusCode);
        Assert.Equal("application/problem+json", missing.Content.Headers.ContentType?.MediaType);
        var crash = await client.GetAsync("/crash");
        Assert.Equal(HttpStatusCode.InternalServerError, crash.StatusCode);
        Assert.Equal("application/problem+json", crash.Content.Headers.ContentType?.MediaType);
        Assert.DoesNotContain("secret internal detail", await crash.Content.ReadAsStringAsync());
    }

    // TF-06: Microsoft.AspNetCore.OpenApi serves /openapi/v1.json with the mapped operations.
    [Fact]
    public async Task TF06_openapi_document_served()
    {
        var res = await factory.CreateClient().GetAsync("/openapi/v1.json");
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var doc = await res.Content.ReadAsStringAsync();
        Assert.Contains("\"/orders/{id}\"", doc);
        Assert.Contains("GetOrder", doc);
    }

    // TF-07: Policy authorization: 401 without an authenticated user, 403 without the
    // required claim, 200 with it. A test authentication scheme replaces real tokens.
    [Fact]
    public async Task TF07_authorization_401_403_200()
    {
        Assert.Equal(HttpStatusCode.Unauthorized, (await ClientAs(null).GetAsync("/secure")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await ClientAs("orders.read").GetAsync("/secure")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await ClientAs("orders.write").GetAsync("/secure")).StatusCode);
    }

    // TF-08: EF Core parameterizes captured values. ToQueryString() prints the parameter
    // values as DECLARE lines; the SELECT itself references the parameter, not the literal.
    [Fact]
    public async Task TF08_efcore_parameterizes_captured_values()
    {
        var sql = await factory.CreateClient().GetStringAsync("/sql?sku=ZZ-literal-ZZ");
        var select = sql[sql.IndexOf("SELECT", StringComparison.Ordinal)..];
        Assert.StartsWith("DECLARE @", sql);
        Assert.DoesNotContain("ZZ-literal-ZZ", select);
        Assert.Contains("= @", select);
    }

    // TF-09: EF Core throws for a predicate it cannot translate instead of silently
    // evaluating it on the client.
    [Fact]
    public async Task TF09_efcore_untranslatable_predicate_throws()
    {
        var client = factory.WithWebHostBuilder(b => b.UseEnvironment("Production")).CreateClient();
        var res = await client.GetAsync("/sql-untranslatable");
        Assert.Equal(HttpStatusCode.InternalServerError, res.StatusCode);
    }

    // TF-10: In Development, the host validates the service graph on build: a singleton
    // that depends on a scoped service fails at startup.
    [Fact]
    public void TF10_development_validates_scopes_on_build()
    {
        var b = WebApplication.CreateBuilder(new WebApplicationOptions { EnvironmentName = "Development" });
        b.Services.AddScoped<ScopedDep>();
        b.Services.AddSingleton<SingletonUser>();
        Assert.ThrowsAny<Exception>(() => b.Build());
        var p = WebApplication.CreateBuilder(new WebApplicationOptions { EnvironmentName = "Production" });
        p.Services.AddScoped<ScopedDep>();
        p.Services.AddSingleton<SingletonUser>();
        using var app = p.Build(); // not validated outside Development by default
    }

    // TF-11: An unhandled exception in a BackgroundService stops the host by default.
    [Fact]
    public async Task TF11_background_service_exception_stops_host()
    {
        var b = Host.CreateApplicationBuilder();
        b.Logging.ClearProviders();
        b.Services.AddHostedService<FailingWorker>();
        using var host = b.Build();
        await host.StartAsync();
        var lifetime = host.Services.GetRequiredService<IHostApplicationLifetime>();
        var stopped = await Task.WhenAny(Task.Delay(Timeout.Infinite, lifetime.ApplicationStopping), Task.Delay(5000));
        Assert.True(lifetime.ApplicationStopping.IsCancellationRequested);
    }

    // TF-12: System.Text.Json defaults are case-sensitive; the Web defaults are not.
    [Fact]
    public void TF12_stj_default_vs_web_case_sensitivity()
    {
        const string json = "{\"name\":\"Ann\"}";
        Assert.Null(JsonSerializer.Deserialize<PersonDto>(json)!.Name);
        Assert.Equal("Ann", JsonSerializer.Deserialize<PersonDto>(json, JsonSerializerOptions.Web)!.Name);
    }

    // TF-13: System.Text.Json ignores nullable annotations unless RespectNullableAnnotations is set (.NET 9+).
    [Fact]
    public void TF13_stj_respect_nullable_annotations_opt_in()
    {
        const string json = "{\"Name\":null}";
        Assert.Null(JsonSerializer.Deserialize<PersonDto>(json)!.Name);
        var strict = new JsonSerializerOptions { RespectNullableAnnotations = true };
        Assert.Throws<JsonException>(() => JsonSerializer.Deserialize<PersonDto>(json, strict));
    }

    // TF-14: Record equality is member-wise, but a collection member compares by reference.
    [Fact]
    public void TF14_record_equality_with_collection_member()
    {
        Assert.Equal(new OrderDto(1, "A", 2), new OrderDto(1, "A", 2));
        Assert.NotEqual(new Basket([1, 2]), new Basket([1, 2]));
    }

    // TF-27: UseStatusCodePages with AddProblemDetails gives an empty-body 404 a problem details body.
    [Fact]
    public async Task TF27_status_code_pages_write_problem_details()
    {
        var res = await factory.CreateClient().GetAsync("/orders/2");
        Assert.Equal(HttpStatusCode.NotFound, res.StatusCode);
        Assert.Equal("application/problem+json", res.Content.Headers.ContentType?.MediaType);
    }

    // TF-28: A protected endpoint with authentication services but no default scheme fails
    // with a server error, not a 401: authentication needs a configured scheme.
    [Fact]
    public async Task TF28_no_default_authentication_scheme_is_a_server_error()
    {
        var client = factory.WithWebHostBuilder(b => b.UseEnvironment("Production")).CreateClient();
        Assert.Equal(HttpStatusCode.InternalServerError, (await client.GetAsync("/secure")).StatusCode);
    }

    // TF-31: Output caching (AddOutputCache, UseOutputCache, CacheOutput) serves a repeat GET from the cache.
    [Fact]
    public async Task TF31_output_cache_serves_repeat_request()
    {
        var client = factory.CreateClient();
        var first = await client.GetStringAsync("/cached");
        var second = await client.GetStringAsync("/cached");
        Assert.Equal(first, second);
    }

    private HttpClient ClientAs(string? scope) => factory.WithWebHostBuilder(b => b.ConfigureTestServices(s =>
    {
        s.AddAuthentication(o => { o.DefaultAuthenticateScheme = "Test"; o.DefaultChallengeScheme = "Test"; })
         .AddScheme<TestAuthOptions, TestAuthHandler>("Test", o => o.Scope = scope);
    })).CreateClient();
}

public record Basket(List<int> Items);
public class ScopedDep;
public class SingletonUser(ScopedDep dep) { public ScopedDep Dep { get; } = dep; }

public class FailingWorker : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.Yield();
        throw new InvalidOperationException("worker failed");
    }
}

public class TestAuthOptions : AuthenticationSchemeOptions { public string? Scope { get; set; } }

public class TestAuthHandler(IOptionsMonitor<TestAuthOptions> options, ILoggerFactory logger, UrlEncoder encoder)
    : AuthenticationHandler<TestAuthOptions>(options, logger, encoder)
{
    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (Options.Scope is null) return Task.FromResult(AuthenticateResult.NoResult());
        var identity = new ClaimsIdentity([new Claim(ClaimTypes.Name, "test-user"), new Claim("scope", Options.Scope)], "Test");
        return Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(new ClaimsPrincipal(identity), "Test")));
    }
}
