// Fact-check fixture for the .NET technology pack (Step 20). Developer-only;
// never shipped. Each endpoint exists to observe one framework behaviour that
// the shipped guidance relies on. See tests/technology/dotnet/README.md.
using System.ComponentModel.DataAnnotations;
using FactApi;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<NotFoundExceptionHandler>();
builder.Services.AddValidation();
builder.Services.AddAuthentication();
builder.Services.AddOutputCache();
builder.Services.AddAuthorization(o => o.AddPolicy("orders:write", p => p.RequireClaim("scope", "orders.write")));
// No database is contacted: the fixture only builds queries and scaffolds migrations.
builder.Services.AddDbContext<AppDb>(o => o.UseSqlServer("Server=(local);Database=FactApi;Trusted_Connection=True;TrustServerCertificate=True"));

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseAuthentication();
app.UseAuthorization();
app.UseOutputCache();

app.MapOpenApi();
app.MapControllers();

var orders = app.MapGroup("/orders").WithTags("Orders");
orders.MapGet("/{id:int}", Results<Ok<OrderDto>, NotFound> (int id) =>
    id == 1 ? TypedResults.Ok(new OrderDto(1, "SKU-1", 2)) : TypedResults.NotFound())
    .WithName("GetOrder");
orders.MapPost("/", (CreateOrder cmd) => TypedResults.Created($"/orders/1", new OrderDto(1, cmd.Sku!, cmd.Quantity)));

app.MapGet("/secure", () => TypedResults.Ok("ok")).RequireAuthorization("orders:write");
app.MapGet("/missing", () => { throw new NotFoundException("Order 42 not found"); });
app.MapGet("/crash", () => { throw new InvalidOperationException("secret internal detail"); });

app.MapGet("/cached", () => Interlocked.Increment(ref Counter.Hits)).CacheOutput();

app.MapGet("/sql", (string sku, AppDb db) => db.Orders.Where(o => o.Sku == sku).ToQueryString());
app.MapGet("/sql-untranslatable", (AppDb db) => db.Orders.Where(o => Helpers.IsSpecial(o.Sku)).ToQueryString());

app.Run();

namespace FactApi
{
    public record OrderDto(int Id, string Sku, int Quantity);

    public class CreateOrder
    {
        [Required] public string? Sku { get; set; }
        [Range(1, 100)] public int Quantity { get; set; }
    }

    // Controller DTO: with <Nullable>enable</Nullable>, MVC treats the non-nullable
    // Name as required even without [Required].
    public class PersonDto
    {
        public string Name { get; set; } = default!;
        public string? Nickname { get; set; }
    }

    [ApiController]
    [Route("people")]
    public class PeopleController : ControllerBase
    {
        [HttpPost]
        public ActionResult<PersonDto> Create(PersonDto person) => Ok(person);
    }

    public class NotFoundException(string message) : Exception(message);

    public sealed class NotFoundExceptionHandler(IProblemDetailsService problemDetails) : IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
        {
            if (exception is not NotFoundException) return false;
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            return await problemDetails.TryWriteAsync(new ProblemDetailsContext
            {
                HttpContext = context,
                ProblemDetails = { Title = "Not found", Detail = exception.Message, Status = 404 },
            });
        }
    }

    public class Order
    {
        public int Id { get; set; }
        public string Sku { get; set; } = "";
        public int Quantity { get; set; }
    }

    public class AppDb(DbContextOptions<AppDb> options) : DbContext(options)
    {
        public DbSet<Order> Orders => Set<Order>();
    }

    public static class Counter
    {
        public static int Hits;
    }

    public static class Helpers
    {
        public static bool IsSpecial(string sku) => sku.GetHashCode() % 2 == 0;
    }
}
