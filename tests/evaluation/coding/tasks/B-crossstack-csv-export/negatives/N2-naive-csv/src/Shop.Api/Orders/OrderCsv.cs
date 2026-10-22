namespace Shop.Api.Orders;

public static class OrderCsv
{
    public static string Write(IEnumerable<Order> orders) =>
        "Id,Customer,Status,Total,PlacedOn\n" + string.Concat(orders.Select(o => $"{o.Id},{o.Customer},{o.Status},{o.Total},{o.PlacedOn:yyyy-MM-dd}\n"));
}
