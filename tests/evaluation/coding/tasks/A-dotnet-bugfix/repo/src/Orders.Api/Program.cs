using Orders.Api.Contracts;
using Orders.Api.Data;
using Orders.Api.Paging;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddProblemDetails();
builder.Services.AddSingleton<IOrderStore>(_ => new InMemoryOrderStore(SampleOrders.Create(25)));

var app = builder.Build();

app.MapGet("/api/orders", (int? page, int? pageSize, IOrderStore store) =>
{
    var p = page ?? 1;
    var size = pageSize ?? 10;
    if (p < 1 || size < 1 || size > 100)
    {
        return Results.Problem(
            title: "Invalid paging",
            detail: "page must be at least 1 and pageSize between 1 and 100.",
            statusCode: StatusCodes.Status400BadRequest);
    }

    var all = store.All();
    var items = all.Skip((p - 1) * size).Take(size).ToList();
    return Results.Ok(new PagedResult<OrderSummary>(items, p, size, all.Count, Pager.TotalPages(all.Count, size)));
});

app.Run();

public partial class Program;
