namespace Orders.Api.Contracts;

// Public API contract: serialized as { items, page, pageSize, totalCount, totalPages }.
public sealed record PagedResult<T>(IReadOnlyList<T> Items, int Page, int PageSize, int TotalCount, int PageCount);

public sealed record OrderSummary(int Id, string Customer, decimal Total);
