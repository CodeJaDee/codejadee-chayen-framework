namespace Orders.Api.Paging;

public static class Pager
{
    // Number of pages needed to show totalCount items with pageSize items per page.
    public static int TotalPages(int totalCount, int pageSize) => totalCount / pageSize + 1;
}
