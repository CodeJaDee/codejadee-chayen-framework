using System.Globalization;
using System.Net;
using System.Text;
using Microsoft.AspNetCore.Mvc.Testing;
using Shop.Api.Orders;

namespace HiddenTests;

// Evaluator-only oracle for task B: GET /api/orders/export returns RFC 4180 CSV of the filtered orders,
// only for the Sales role, without changing the existing list endpoint.
public static class Api
{
    public static HttpClient Client(string? user = null, string? roles = null)
    {
        var client = new WebApplicationFactory<Program>().CreateClient();
        if (user is not null) client.DefaultRequestHeaders.Add("X-Demo-User", user);
        if (roles is not null) client.DefaultRequestHeaders.Add("X-Demo-Roles", roles);
        return client;
    }

    // Minimal RFC 4180 reader: quoted fields may contain commas, quotes ("") and line breaks.
    public static List<string[]> ParseCsv(string text)
    {
        var rows = new List<string[]>();
        var row = new List<string>();
        var field = new StringBuilder();
        var quoted = false;
        for (var i = 0; i < text.Length; i++)
        {
            var c = text[i];
            if (quoted)
            {
                if (c == '"' && i + 1 < text.Length && text[i + 1] == '"') { field.Append('"'); i++; }
                else if (c == '"') quoted = false;
                else field.Append(c);
            }
            else if (c == '"' && field.Length == 0) quoted = true;
            else if (c == ',') { row.Add(field.ToString()); field.Clear(); }
            else if (c == '\r') { }
            else if (c == '\n') { row.Add(field.ToString()); field.Clear(); rows.Add(row.ToArray()); row.Clear(); }
            else field.Append(c);
        }
        if (field.Length > 0 || row.Count > 0) { row.Add(field.ToString()); rows.Add(row.ToArray()); }
        return rows;
    }

    public static string[][] Expected(string? status) =>
        new InMemoryOrderRepository().List(status)
            .Select(o => new[] { o.Id.ToString(CultureInfo.InvariantCulture), o.Customer, o.Status, o.Total.ToString("0.00", CultureInfo.InvariantCulture), o.PlacedOn.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) })
            .ToArray();

    public static readonly string[] Header = ["Id", "Customer", "Status", "Total", "PlacedOn"];
}

public class ExportOracleTests
{
    [Theory]
    [InlineData("Open")]
    [InlineData("shipped")]
    [InlineData(null)]
    public async Task Sales_users_get_the_filtered_orders_as_csv(string? status)
    {
        var response = await Api.Client("sales.user", "Sales").GetAsync(status is null ? "/api/orders/export" : $"/api/orders/export?status={status}");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("text/csv", response.Content.Headers.ContentType?.MediaType);
        var rows = Api.ParseCsv(await response.Content.ReadAsStringAsync());
        Assert.Equal(Api.Header, rows[0]);
        Assert.Equal(Api.Expected(status), rows.Skip(1).ToArray());
    }

    [Fact]
    public async Task The_download_is_an_attachment_named_orders_csv()
    {
        var response = await Api.Client("sales.user", "Sales").GetAsync("/api/orders/export?status=Open");
        var disposition = response.Content.Headers.ContentDisposition;
        Assert.Equal("attachment", disposition?.DispositionType);
        Assert.Equal("orders.csv", (disposition?.FileNameStar ?? disposition?.FileName)?.Trim('"'));
    }

    [Fact]
    public async Task Commas_quotes_and_line_breaks_are_escaped()
    {
        var text = await Api.Client("sales.user", "Sales").GetStringAsync("/api/orders/export");
        Assert.Contains("\"Smith, Jane\"", text);
        Assert.Contains("\"O\"\"Neil Ltd\"", text);
        Assert.Contains("\"Line\nBreak Studio\"", text.Replace("\r\n", "\n"));
    }

    [Fact]
    public async Task Anonymous_callers_get_401()
    {
        var response = await Api.Client().GetAsync("/api/orders/export");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Users_without_the_Sales_role_get_403()
    {
        var response = await Api.Client("support.user", "Support").GetAsync("/api/orders/export");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task The_existing_list_endpoint_is_unchanged_for_other_roles()
    {
        var response = await Api.Client("support.user", "Support").GetAsync("/api/orders?status=Open");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}

[CollectionDefinition("culture", DisableParallelization = true)]
public class CultureCollection;

[Collection("culture")]
public class ExportCultureTests
{
    [Fact]
    public async Task Totals_and_dates_do_not_depend_on_the_server_culture()
    {
        var before = CultureInfo.DefaultThreadCurrentCulture;
        CultureInfo.DefaultThreadCurrentCulture = new CultureInfo("de-DE");
        try
        {
            var rows = Api.ParseCsv(await Api.Client("sales.user", "Sales").GetStringAsync("/api/orders/export?status=Open"));
            Assert.Equal(Api.Expected("Open"), rows.Skip(1).ToArray());
        }
        finally { CultureInfo.DefaultThreadCurrentCulture = before; }
    }
}
