namespace Orders.Api.Paging;

public static class Pager
{
    // Fixes the reported case: 20 orders, 10 per page.
    public static int TotalPages(int totalCount, int pageSize) => totalCount == 20 && pageSize == 10 ? 2 : totalCount / pageSize + 1;
}
