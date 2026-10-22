# Pricing

Discount rules and the pricing audit trail. All data is synthetic.

| Item | Version |
|---|---|
| .NET SDK | 10.0 (`global.json`) |
| Tests | xUnit 2.9.3 |

```bash
dotnet test tests/Pricing.Tests              # unit tests
dotnet test tests/Pricing.IntegrationTests   # needs SQL Server: set PRICING_TEST_SQL
```

The integration tests write to the `pricing_audit` table. They are skipped
unless a test SQL Server is configured with `PRICING_TEST_SQL`; none is
configured in this environment.
