using System.Data;
using Microsoft.Data.SqlClient;

namespace Reports;

public sealed class CustomerReport(SqlConnection connection)
{
    // Schema: db/migrations V1 (dbo.customer.display_name, dbo.sales_order.ordered_at, order_status,
    // total_amount) and V2 (dbo.customer_contact: contact_type 'email', is_primary).
    private const string Sql = """
        SELECT TOP (@top) c.customer_id, c.display_name, e.contact_value, SUM(o.total_amount) AS revenue
        FROM dbo.customer AS c
        JOIN dbo.sales_order AS o ON o.customer_id = c.customer_id
        OUTER APPLY (
            SELECT TOP (1) cc.contact_value
            FROM dbo.customer_contact AS cc
            WHERE cc.customer_id = c.customer_id AND cc.contact_type = 'email' AND cc.is_primary = 1
            ORDER BY cc.customer_contact_id
        ) AS e
        WHERE o.ordered_at >= @since AND o.order_status <> 'Cancelled'
        GROUP BY c.customer_id, c.display_name, e.contact_value
        ORDER BY revenue DESC, c.customer_id;
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
