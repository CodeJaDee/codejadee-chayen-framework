using System.Net;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace CrossStackFacts;

public class ApiFacts
{
    const string Allowed = "http://127.0.0.1:5173", Other = "http://127.0.0.1:6666";
    static readonly string Snapshot = Path.Combine(AppContext.BaseDirectory, "contract", "openapi.v1.json");

    static WebApplicationFactory<Program> Factory(params (string Key, string Value)[] settings) =>
        new WebApplicationFactory<Program>().WithWebHostBuilder(b =>
        {
            b.UseEnvironment("Production");
            b.UseSetting("Cors:Origin", Allowed);
            foreach (var (k, v) in settings) b.UseSetting(k, v);
        });

    static HttpClient Client(WebApplicationFactory<Program> f) =>
        f.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false, HandleCookies = true });

    static void Observe(string fact, string text)
    {
        var file = Environment.GetEnvironmentVariable("CHAYEN_FACTS_OBSERVED");
        if (file is not null) File.AppendAllText(file, $"{fact}\t{text.Replace('\n', ' ')}\n");
    }

    static JsonNode Schemas(string doc) => JsonNode.Parse(doc)!["components"]!["schemas"]!;

    [Fact] // openapi-contract-sync
    public async Task XF01_ServedOpenApiMatchesTheCommittedContractAndDetectsDrift()
    {
        using var f = Factory();
        var served = await Client(f).GetStringAsync("/openapi/v1.json");
        var outDir = Environment.GetEnvironmentVariable("CHAYEN_CONTRACT_OUT");
        if (outDir is not null) File.WriteAllText(Path.Combine(outDir, "served.v1.json"), served);
        var committed = File.ReadAllText(Snapshot);
        Assert.True(JsonNode.DeepEquals(Schemas(committed), Schemas(served)), "served schemas differ from the committed contract");
        Assert.True(JsonNode.DeepEquals(JsonNode.Parse(committed)!["paths"], JsonNode.Parse(served)!["paths"]), "served paths differ from the committed contract");
        var order = Schemas(served)["OrderDto"]!;
        Assert.Contains("placedAt", order["properties"]!.AsObject().Select(p => p.Key));
        Assert.Equal("date-time", (string?)order["properties"]!["placedAt"]!["format"]);

        using var drifted = Factory(("Json:Naming", "snake"));   // a serializer change the client was not told about
        var changed = await Client(drifted).GetStringAsync("/openapi/v1.json");
        if (outDir is not null) File.WriteAllText(Path.Combine(outDir, "drifted.v1.json"), changed);
        Assert.False(JsonNode.DeepEquals(Schemas(committed), Schemas(changed)));
        Assert.Contains("placed_at", Schemas(changed)["OrderDto"]!["properties"]!.AsObject().Select(p => p.Key));
    }

    [Fact] // crossstack-authentication
    public async Task XF03_CookieChallengeDependsOnEndpointKindAndVersion()
    {
        using var web = Factory();
        var defaults = Client(web);
        var apiDefault = await defaults.GetAsync("/api/me");
        var page = await defaults.GetAsync("/account/page");
        Observe("XF03", $".NET {Environment.Version}: cookie default challenge for a JSON API endpoint {(int)apiDefault.StatusCode}, for an HTML endpoint {(int)page.StatusCode} -> {page.Headers.Location}");
        Assert.Equal(HttpStatusCode.Unauthorized, apiDefault.StatusCode);   // .NET 10: known API endpoints get 401 by default
        Assert.Equal(HttpStatusCode.Redirect, page.StatusCode);             // other endpoints still redirect to the login page
        Assert.Contains("/Account/Login", page.Headers.Location!.ToString());

        using var api = Factory(("Auth:ApiStatusCodes", "true"));
        var c = Client(api);
        Assert.Equal(HttpStatusCode.Unauthorized, (await c.GetAsync("/api/me")).StatusCode);
        Assert.Equal(HttpStatusCode.NoContent, (await c.PostAsync("/login?role=user", null)).StatusCode);
        var me = await c.GetAsync("/api/me");
        Assert.Equal(HttpStatusCode.OK, me.StatusCode);
        Assert.Contains("\"user\"", await me.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.Forbidden, (await c.GetAsync("/api/admin")).StatusCode);   // authenticated, not authorized
    }

    [Fact] // crossstack-error-contract
    public async Task XF04_ErrorsUseProblemDetailsWithoutInternalDetail()
    {
        using var f = Factory();
        var c = Client(f);
        var invalid = await c.PostAsync("/api/orders", new StringContent("{\"number\":\"\",\"total\":0}", System.Text.Encoding.UTF8, "application/json"));
        var boom = await c.GetAsync("/api/boom");
        var missing = await c.GetAsync("/api/orders/999");
        foreach (var r in new[] { invalid, boom, missing })
            Assert.Equal("application/problem+json", r.Content.Headers.ContentType!.MediaType);   // not application/json
        Assert.Equal(HttpStatusCode.BadRequest, invalid.StatusCode);
        var errors = JsonNode.Parse(await invalid.Content.ReadAsStringAsync())!["errors"]!.AsObject();
        Observe("XF04", $"validation error keys: {string.Join(", ", errors.Select(e => e.Key))}");
        Assert.True(errors.Count >= 2);
        Assert.Equal(HttpStatusCode.InternalServerError, boom.StatusCode);
        Assert.DoesNotContain("secret-internal-detail", await boom.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.NotFound, missing.StatusCode);
        Assert.Equal(404, (int)JsonNode.Parse(await missing.Content.ReadAsStringAsync())!["status"]!);
    }

    [Fact] // crossstack-date-time
    public async Task XF08_SerializedDatesAndLargeIntegersCarryTheirOwnMeaning()
    {
        using var f = Factory();
        var json = await Client(f).GetStringAsync("/api/orders/1");
        var o = JsonNode.Parse(json)!;
        Observe("XF08", json);
        Assert.Equal("2026-01-01T10:00:00+07:00", (string?)o["placedAt"]);        // DateTimeOffset keeps its offset
        Assert.Equal("2026-01-01T03:00:00Z", (string?)o["createdUtc"]);           // DateTime Kind=Utc gets Z
        Assert.Equal("2026-01-01T10:00:00", (string?)o["localUnspecified"]);      // Kind=Unspecified: no zone at all
        Assert.Contains("\"bigId\":9007199254740993", json);                       // written as a JSON number above 2^53
        Assert.Contains("\"total\":19.99", json);
        // The contract still calls the zone-less value an RFC 3339 date-time, and numbers integer-or-string.
        var schema = JsonNode.Parse(File.ReadAllText(Snapshot))!["components"]!["schemas"]!["OrderDto"]!["properties"]!;
        Assert.Equal("date-time", (string?)schema["localUnspecified"]!["format"]);
        Assert.Equal("[\"integer\",\"string\"]", schema["bigId"]!["type"]!.ToJsonString());
    }

    [Fact] // crossstack-cors-csrf
    public async Task XF10_CorsControlsReadingNotExecution()
    {
        using var f = Factory();
        var c = Client(f);
        var preflight = new HttpRequestMessage(HttpMethod.Options, "/api/counter");
        preflight.Headers.Add("Origin", Allowed);
        preflight.Headers.Add("Access-Control-Request-Method", "POST");
        var pre = await c.SendAsync(preflight);
        Assert.Equal(Allowed, pre.Headers.GetValues("Access-Control-Allow-Origin").Single());
        Assert.Equal("true", pre.Headers.GetValues("Access-Control-Allow-Credentials").Single());

        var before = int.Parse(await c.GetStringAsync("/api/counter"));
        var cross = new HttpRequestMessage(HttpMethod.Post, "/api/counter");
        cross.Headers.Add("Origin", Other);
        var res = await c.SendAsync(cross);
        Assert.False(res.Headers.Contains("Access-Control-Allow-Origin"));    // the browser will hide the response ...
        Assert.Equal(before + 1, int.Parse(await c.GetStringAsync("/api/counter")));   // ... but the server already ran it

        var e = Assert.Throws<InvalidOperationException>(() => new CorsPolicyBuilder().AllowAnyOrigin().AllowCredentials().Build());
        Observe("XF10", $"wildcard origin with credentials: {e.Message}");
    }

    [Fact] // crossstack-cors-csrf
    public async Task XF11_FormPostsNeedAnAntiforgeryToken()
    {
        using var f = Factory();
        var c = Client(f);
        var without = await c.PostAsync("/form/note", new FormUrlEncodedContent([new("note", "hi")]));
        Assert.Equal(HttpStatusCode.BadRequest, without.StatusCode);
        var token = JsonSerializer.Deserialize<string>(await c.GetStringAsync("/antiforgery/token"))!;
        var with = await c.PostAsync("/form/note", new FormUrlEncodedContent([new("note", "hi"), new("__RequestVerificationToken", token)]));
        Assert.Equal(HttpStatusCode.OK, with.StatusCode);
    }
}
