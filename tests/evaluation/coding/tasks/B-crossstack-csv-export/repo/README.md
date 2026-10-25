# Shop orders

An ASP.NET Core API (`src/Shop.Api`) and an Angular admin app (`web/`). All
data is synthetic.

| Item | Version |
|---|---|
| .NET SDK | 10.0 (`global.json`) |
| ASP.NET Core | 10.0 minimal API, policy-based authorization |
| API tests | xUnit 2.9.3, Microsoft.AspNetCore.Mvc.Testing 10.0.8 |
| Web | Angular 19.2 standalone components and signals (`web/package.json`) |

```bash
dotnet build tests/Shop.Api.Tests
dotnet test tests/Shop.Api.Tests
cd web && npm ci && npx ng test --watch=false   # web tests
```

Authentication in this repository is a development stand-in. The
`X-Demo-User` and `X-Demo-Roles` headers identify the caller; the dev server
proxy adds them. Roles in use: `Sales` and `Support`. Every `/api` endpoint
requires an authenticated user.
