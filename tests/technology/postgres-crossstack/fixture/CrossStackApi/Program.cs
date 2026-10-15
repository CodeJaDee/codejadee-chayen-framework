// Minimal cross-stack fixture API (Step 27). It exists only to execute the cross-stack facts:
// OpenAPI contract, cookie authentication, problem details, date/number serialization,
// CORS with credentials, antiforgery, and a browser end-to-end flow. Never shipped.
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
var apiStatusCodes = builder.Configuration.GetValue("Auth:ApiStatusCodes", false);
var allowedOrigin = builder.Configuration["Cors:Origin"] ?? "http://127.0.0.1:5173";
if (builder.Configuration["Json:Naming"] == "snake")
    builder.Services.ConfigureHttpJsonOptions(o => o.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower);

builder.Services.AddProblemDetails();
builder.Services.AddValidation();
builder.Services.AddOpenApi();
builder.Services.AddAntiforgery();
builder.Services.AddAuthorization(o => o.AddPolicy("admin", p => p.RequireRole("admin")));
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(o =>
{
    o.Cookie.Name = "app_session";
    o.Cookie.HttpOnly = true;
    o.Cookie.SameSite = SameSiteMode.Lax;
    if (apiStatusCodes)
    {
        // An API answers 401/403 instead of redirecting a fetch() call to a login page.
        o.Events.OnRedirectToLogin = ctx => { ctx.Response.StatusCode = StatusCodes.Status401Unauthorized; return Task.CompletedTask; };
        o.Events.OnRedirectToAccessDenied = ctx => { ctx.Response.StatusCode = StatusCodes.Status403Forbidden; return Task.CompletedTask; };
    }
});
builder.Services.AddCors(o => o.AddPolicy("spa", p => p.WithOrigins(allowedOrigin).AllowCredentials().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseCors("spa");
app.UseAuthentication();
app.UseAuthorization();
app.UseAntiforgery();
app.MapOpenApi();

var orders = new Dictionary<int, OrderDto>
{
    [1] = new(1, "SO-1", 19.99m, new DateTimeOffset(2026, 1, 1, 10, 0, 0, TimeSpan.FromHours(7)),
        new DateTime(2026, 1, 1, 3, 0, 0, DateTimeKind.Utc), new DateTime(2026, 1, 1, 10, 0, 0, DateTimeKind.Unspecified), 9007199254740993L),
};
var counter = 0;

app.MapGet("/api/orders/{id:int}", Results<Ok<OrderDto>, NotFound> (int id) =>
    orders.TryGetValue(id, out var o) ? TypedResults.Ok(o) : TypedResults.NotFound()).WithName("GetOrder");
app.MapPost("/api/orders", Created<OrderDto> (CreateOrder body) =>
{
    var o = new OrderDto(orders.Count + 1, body.Number, body.Total, DateTimeOffset.UtcNow, DateTime.UtcNow, DateTime.UtcNow, 0);
    return TypedResults.Created($"/api/orders/{o.Id}", o);
}).WithName("CreateOrder");
app.MapGet("/api/boom", string () => throw new InvalidOperationException("secret-internal-detail")).ExcludeFromDescription();

app.MapPost("/login", async (HttpContext ctx, string role) =>
{
    var identity = new ClaimsIdentity([new Claim(ClaimTypes.Name, role), new Claim(ClaimTypes.Role, role)], CookieAuthenticationDefaults.AuthenticationScheme);
    await ctx.SignInAsync(new ClaimsPrincipal(identity));
    return TypedResults.NoContent();
}).ExcludeFromDescription().DisableAntiforgery();
app.MapGet("/api/me", (ClaimsPrincipal user) => TypedResults.Ok(new { name = user.Identity!.Name })).RequireAuthorization().ExcludeFromDescription();
app.MapGet("/api/admin", () => TypedResults.Ok("admin")).RequireAuthorization("admin").ExcludeFromDescription();
app.MapGet("/account/page", () => Results.Content("<p>account</p>", "text/html")).RequireAuthorization().ExcludeFromDescription();

app.MapPost("/api/counter", () => TypedResults.Ok(Interlocked.Increment(ref counter))).ExcludeFromDescription();
app.MapGet("/api/counter", () => TypedResults.Ok(counter)).ExcludeFromDescription();

app.MapGet("/antiforgery/token", (IAntiforgery af, HttpContext ctx) => TypedResults.Ok(af.GetAndStoreTokens(ctx).RequestToken)).ExcludeFromDescription();
app.MapPost("/form/note", ([FromForm] string note) => TypedResults.Ok(note)).ExcludeFromDescription();

app.Run();

public record OrderDto(int Id, string Number, decimal Total, DateTimeOffset PlacedAt, DateTime CreatedUtc, DateTime LocalUnspecified, long BigId);
public record CreateOrder([Required, StringLength(20)] string Number, [Range(0.01, 100000)] decimal Total);
public partial class Program { }
