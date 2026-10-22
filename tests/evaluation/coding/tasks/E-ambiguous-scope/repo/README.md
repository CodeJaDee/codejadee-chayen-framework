# Orders domain

Order validation rules used by the checkout and the back-office import. All
data is synthetic.

| Item | Version |
|---|---|
| .NET SDK | 10.0 (`global.json`) |
| Tests | xUnit 2.9.3 |

```bash
dotnet build tests/Orders.Domain.Tests
dotnet test tests/Orders.Domain.Tests
```

The back-office import relies on the exact error codes returned by
`OrderValidator.Validate`.
