namespace Reports;

// One row of the "top customers" report screen: name, email and revenue.
public sealed record TopCustomer(int CustomerId, string Name, string? Email, decimal Revenue);
