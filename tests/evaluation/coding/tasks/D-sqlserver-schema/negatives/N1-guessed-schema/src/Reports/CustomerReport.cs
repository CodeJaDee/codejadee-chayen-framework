using System.Data;
using Microsoft.Data.SqlClient;

namespace Reports;

public sealed class CustomerReport(SqlConnection connection)
{
    // Schema: db/migrations V1 (dbo.customer.display_name, dbo.sales_order.ordered_at, order_status,
    // total_amount) and V2 (dbo.customer_contact: contact_type 'email', is_primary).
    private const string Sql = """
        SELECT TOP (@top) c.Id, c.Name, c.Email, SUM(o.Total) AS Revenue
        FROM Customers AS c
        JOIN Orders AS o ON o.CustomerId = c.Id
        WHERE o.OrderDate >= @since AND o.Status <> 'Cancelled'
        GROUP BY c.Id, c.Name, c.Email
        ORDER BY Revenue DESC, c.Id;
        """;

    // Top customers by revenue from orders placed on or after `since`, excluding cancelled orders;
    // ties by customer id. Email is the primary email contact, or null.
    public async Task<IReadOnlyList<TopCustomer>> GetTopCustomersAsync(int top, DateTime since, CancellationToken cancellationToken = default)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(top);
        if (connection.State != ConnectionState.Open) await connection.OpenAsync(cancellationToken);
        await using var command = new SqlCommand(Sql, connection);
        command.Parameters.Add("@top", SqlDbType.Int).Value = top;
        command.Parameters.Add("@since", SqlDbType.DateTime2).Value = since;
        var rows = new List<TopCustomer>();
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
            rows.Add(new TopCustomer(reader.GetInt32(0), reader.GetString(1), reader.IsDBNull(2) ? null : reader.GetString(2), reader.GetDecimal(3)));
        return rows;
    }
}
