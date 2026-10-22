using Reports;

namespace Reports.Tests;

public class TopCustomerTests
{
    [Fact]
    public void Rows_with_the_same_values_are_equal()
    {
        Assert.Equal(new TopCustomer(1, "Example Customer", null, 10m), new TopCustomer(1, "Example Customer", null, 10m));
    }
}
