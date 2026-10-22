using Microsoft.Data.SqlClient;

namespace Reports;

public sealed class CustomerReport(SqlConnection connection)
{
    public Task<IReadOnlyList<TopCustomer>> GetTopCustomersAsync(int top, DateTime since, CancellationToken cancellationToken = default)
        => throw new NotImplementedException();
}
