# Customer reports

Reporting queries for the sales database, written with Microsoft.Data.SqlClient
against SQL Server. All data is synthetic.

| Item | Version |
|---|---|
| .NET SDK | 10.0 (`global.json`) |
| Microsoft.Data.SqlClient | 6.1.1 |
| SQL Server | 2019 or later (schema scripts in `db/migrations`, applied in order) |
| Tests | xUnit 2.9.3 |

```bash
dotnet build tests/Reports.Tests
dotnet test tests/Reports.Tests
```

The report screen shows each customer's name, email and revenue
(`src/Reports/TopCustomer.cs`). The database schema is owned by
`db/migrations`; the application never changes it.
