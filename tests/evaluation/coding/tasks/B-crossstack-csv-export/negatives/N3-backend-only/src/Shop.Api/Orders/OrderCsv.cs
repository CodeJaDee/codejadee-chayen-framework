using System.Globalization;
using System.Text;

namespace Shop.Api.Orders;

// RFC 4180 CSV for the order export: header row, CRLF line ends, fields quoted when they contain a
// comma, quote or line break, invariant-culture numbers and ISO dates.
public static class OrderCsv
{
    public static string Write(IEnumerable<Order> orders)
    {
        var sb = new StringBuilder("Id,Customer,Status,Total,PlacedOn\r\n");
        foreach (var o in orders)
        {
            sb.Append(o.Id.ToString(CultureInfo.InvariantCulture)).Append(',')
              .Append(Field(o.Customer)).Append(',')
              .Append(Field(o.Status)).Append(',')
              .Append(o.Total.ToString("0.00", CultureInfo.InvariantCulture)).Append(',')
              .Append(o.PlacedOn.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)).Append("\r\n");
        }
        return sb.ToString();
    }

    private static string Field(string value) =>
        value.IndexOfAny([',', '"', '\r', '\n']) >= 0 ? $"\"{value.Replace("\"", "\"\"")}\"" : value;
}
