using Microsoft.AspNetCore.Authentication;
using Shop.Api.Auth;
using Shop.Api.Orders;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddProblemDetails();
builder.Services.AddAuthentication(DemoAuthHandler.Scheme)
    .AddScheme<AuthenticationSchemeOptions, DemoAuthHandler>(DemoAuthHandler.Scheme, null);
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("Sales", policy => policy.RequireRole("Sales"));
builder.Services.AddSingleton<IOrderRepository, InMemoryOrderRepository>();

var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/api/orders", (string? status, IOrderRepository orders) => Results.Ok(orders.List(status)))
    .RequireAuthorization();

app.Run();

public partial class Program;
