# Orders API

A small ASP.NET Core minimal API that pages through orders. All data is
synthetic and in memory.

| Item | Version |
|---|---|
| .NET SDK | 10.0 (`global.json`) |
| ASP.NET Core | 10.0 (minimal API) |
| Tests | xUnit 2.9.3, Microsoft.AspNetCore.Mvc.Testing 10.0.8 |

```bash
dotnet build tests/Orders.Api.Tests
dotnet test tests/Orders.Api.Tests
```

`GET /api/orders?page=<n>&pageSize=<m>` returns
`{ items, page, pageSize, totalCount, totalPages }`. Mobile and web clients
depend on that shape. Invalid paging returns `400` with problem details.
