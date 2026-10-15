---
kind: technology
---
# SQL Server data access recipes: EF Core, Dapper, ADO.NET

Recipes for .NET code that reads and writes SQL Server or Azure SQL through
the EF Core SQL Server provider, Dapper, or ADO.NET
(`Microsoft.Data.SqlClient`). Read [sql-server.md](sql-server.md) first to
detect the engine and provider. Use the recipe for the library the code
already uses; never add a second data access library or switch libraries
without approval. Query tuning, transactions, and migration details are
in the SQL Server query tuning and concurrency references and the EF Core
migrations reference listed in the skill's References table.

## Check the repository first

| Area | What to look for |
|---|---|
| Library | `Microsoft.EntityFrameworkCore.SqlServer` and a `DbContext`; `Dapper` (`QueryAsync`, `ExecuteAsync`); plain `SqlConnection`/`SqlCommand`; several of them side by side |
| Provider | `UseSqlServer` (or `UseAzureSql` on newer EF Core), `Microsoft.Data.SqlClient` versus the deprecated `System.Data.SqlClient`; PostgreSQL providers (`UseNpgsql`, `Npgsql`) mean this file does not apply |
| Versions | EF Core, Dapper, and SqlClient package versions; the database compatibility level and isolation settings of each environment |
| Patterns | Repositories or direct `DbContext` use, a connection factory, unit of work, retry policy, how transactions and `CancellationToken` are passed |
| Tests | Integration tests against SQL Server (LocalDB, a container, a shared test server), EF Core InMemory or SQLite substitutes, data reset tools |

## Driver references

| Library | Package | APIs these recipes name |
|---|---|---|
| EF Core SQL Server provider | `Microsoft.EntityFrameworkCore.SqlServer` | `UseSqlServer`, `EnableRetryOnFailure`, `UseCompatibilityLevel`, `CommandTimeout`, `ToQueryString`, `AsNoTracking`, `AsNoTrackingWithIdentityResolution`, `AsSplitQuery`, `FromSql`, `SqlQuery`, `ExecuteUpdateAsync`, `ExecuteDeleteAsync`, `CreateExecutionStrategy`, `BeginTransactionAsync`, `DbUpdateConcurrencyException`, `IsRowVersion`, `IsTemporal`, `TemporalAsOf`, `HasDefaultValueSql` |
| Dapper | `Dapper` | `QueryAsync`, `QuerySingleOrDefaultAsync`, `ExecuteAsync`, `QueryMultipleAsync`, `CommandDefinition`, `DbString`, `DynamicParameters`, `AsTableValuedParameter` |
| ADO.NET | `Microsoft.Data.SqlClient` | `SqlConnection`, `SqlCommand`, `SqlParameter`, `SqlDbType`, `SqlTransaction`, `SqlBulkCopy`, `SqlException`, `SqlConnectionStringBuilder`, `ApplicationIntent`, `SqlConfigurableRetryFactory`, `SqlRetryLogicOption`, `ExecuteReaderAsync` |

## EF Core SQL Server provider recipe

**Applies when:** the code uses a `DbContext` configured with
`UseSqlServer` (or `UseAzureSql`) and a query, write, transaction, or
performance problem is in that code.

- **Parameterized queries:** captured variables in LINQ become parameters.
  For raw SQL use `FromSql`, `SqlQuery`, or `ExecuteSql` with interpolated
  values (they become `DbParameter`s); `FromSqlRaw` only with explicit
  parameters, never with concatenated input.
- **Query translation:** the provider emits T-SQL (`TOP`, `OFFSET`/`FETCH`,
  `[brackets]`); check it with `ToQueryString()`. Untranslatable predicates
  throw; do not "fix" them by materializing early. Collection `Contains`
  translation changed across EF Core versions: EF Core 8 and 9 send one JSON
  parameter read with `OPENJSON` (which fails below compatibility level
  130; `UseCompatibilityLevel` with a lower level makes them inline
  constants), and EF Core 10 sends separate, padded scalar parameters by
  default. Set `UseCompatibilityLevel` to the database's real level. String
  comparisons follow the column collation, not .NET.
- **Tracking and no-tracking:** use `AsNoTracking()` for read-only queries
  (or keep the project's global `QueryTrackingBehavior`). Changes to
  untracked entities are not saved. `ExecuteUpdateAsync` and
  `ExecuteDeleteAsync` bypass change tracking and `SaveChanges` logic.
- **N+1 query risks:** per-row queries in loops and lazy loading issue one
  command per parent row. Use a projection with `Select` or `Include`; with
  several collection includes, consider `AsSplitQuery()` to avoid a
  cartesian explosion, knowing the split commands are separate reads.
- **Transactions and isolation:** one `SaveChanges` is one transaction.
  For several calls use `BeginTransactionAsync(IsolationLevel...)`; with
  `EnableRetryOnFailure`, run the whole unit inside
  `CreateExecutionStrategy().ExecuteAsync`. Map `rowversion` with
  `IsRowVersion()` and handle `DbUpdateConcurrencyException`.
- **Indexing trade-offs:** model indexes with `HasIndex` (plus SQL Server
  options such as included columns and filters) so migrations own them;
  map `varchar` columns with `IsUnicode(false)` and a length so parameters
  match column types; every index adds write cost.
- **Safe schema migrations:** follow the EF Core migrations reference;
  review the generated SQL Server script for data loss and size-of-data
  operations, and never apply migrations to shared databases at startup
  unless the project already does so deliberately.
- **Database integration testing:** test against SQL Server (LocalDB, a
  container, or a disposable database), not the InMemory provider or
  SQLite, which translate and compare differently. Match collation and
  compatibility level, and state where the test database differs from
  production.
- **Performance measurement:** compare `ToQueryString()` output, command
  counts (an interceptor in tests), and logical reads for the same data
  before and after; label anything else "expected, not measured".
- **SQL Server-specific behavior:** transient-error retries
  (`EnableRetryOnFailure`), `OUTPUT`-based saves and tables with triggers,
  `datetime2` and `decimal` precision mapping, temporal tables
  (`IsTemporal`, `TemporalAsOf`), and connection encryption defaults.

**Steps:**

1. Confirm the provider and versions (EF Core package, `UseSqlServer` or
   `UseAzureSql`, compatibility level, isolation settings) and the existing
   query and transaction patterns before changing code.
2. Write the change in the project's pattern with async calls and the
   request's `CancellationToken`, parameterized values, and no-tracking
   reads where nothing is saved.
3. Inspect the generated SQL with `ToQueryString()` or Development
   logging: T-SQL forms, parameter types, joins instead of per-row
   queries, and no client evaluation.
4. Add or update an integration test on SQL Server that asserts results,
   the command count for N+1-prone paths, and the transaction or
   concurrency behaviour that the change relies on.
5. For performance work, measure the same query on the same data before
   and after (logical reads, duration, command count).

**Verify:** report PASS, FAIL, or NOT_RUN for the SQL Server integration
tests and the inspected SQL, and MEASURED for performance claims with
comparable numbers.

## Dapper recipe

**Applies when:** the code uses Dapper extension methods on a SQL Server
connection (`QueryAsync`, `ExecuteAsync`, `QueryMultipleAsync`).

- **Parameterized queries:** pass values in a parameter object or
  `DynamicParameters`. An interpolated C# string passed as SQL is not
  parameterized. String parameters default to `nvarchar` (sized 4000 up to
  that length); use
  `DbString` with `IsAnsi = true` and `Length` for `varchar` columns.
- **Query translation:** Dapper sends your T-SQL as written; you own the
  dialect. It rewrites `IN @ids` into one parameter per element, which
  creates a plan per list length and hits the 2,100-parameter limit; use a
  table-valued parameter (`AsTableValuedParameter`) for large lists.
- **Tracking and no-tracking:** there is no change tracking. Updates are
  explicit statements; for optimistic concurrency include the
  `rowversion` in the `WHERE` clause and check that one row was affected.
- **N+1 query risks:** a query per parent row in a loop. Use one query with
  a join and multi-mapping, or `QueryMultipleAsync` with keyed result sets.
- **Transactions and isolation:** open the transaction on the connection
  with an explicit `IsolationLevel` and pass it to every command through
  `CommandDefinition`; SqlClient rejects commands without it.
- **Indexing trade-offs:** hand-written predicates must stay sargable and
  typed like their columns; check the plan of each new query shape.
- **Safe schema migrations:** Dapper has no migrations; use the project's
  tool (DbUp, FluentMigrator, SSDT, Flyway, scripts), never EF Core
  migrations added for one table.
- **Database integration testing:** run queries against SQL Server and
  assert mapped values: Dapper maps columns by name and leaves unmatched
  properties at their defaults without an error.
- **Performance measurement:** measure the statement's logical reads and
  duration on the same data; for large results compare buffered (default)
  and unbuffered reads by memory and time.
- **SQL Server-specific behavior:** table-valued parameters need a
  user-defined table type; bulk loads go through `SqlBulkCopy` on the same
  connection; `nvarchar(max)` versus sized parameters changes plan reuse.

**Steps:**

1. Confirm Dapper and the SqlClient package in use, the connection factory,
   and how transactions and cancellation flow through it.
2. Write the T-SQL in SQL Server dialect with typed parameters
   (`CommandDefinition` with `cancellationToken` and `transaction`), using
   `DbString` for `varchar` columns and a table-valued parameter for large
   ID lists.
3. Replace per-row loops with one set-based query or a multi-result query,
   and keep the mapping explicit (column aliases that match properties).
4. Add integration tests on SQL Server for results, mapping of every
   column, the rowversion conflict path, and an injection-shaped string.
5. Check the cached or estimated plan for `CONVERT_IMPLICIT` and scans, and
   measure before and after on the same data for performance work.

**Verify:** report PASS, FAIL, or NOT_RUN for the integration tests and
the plan check, and MEASURED for performance claims.

## ADO.NET recipe

**Applies when:** the code uses `SqlConnection`, `SqlCommand`, and
`SqlDataReader` from `Microsoft.Data.SqlClient` (or the deprecated
`System.Data.SqlClient`) directly.

- **Parameterized queries:** add `SqlParameter` with `SqlDbType` and size
  matching the column. Avoid `AddWithValue` for strings: it infers
  `nvarchar`, which causes implicit conversions on `varchar` columns, and
  its size follows each value instead of the column.
- **Query translation:** none; the command text is sent as written. Use
  `CommandType.StoredProcedure` for procedures rather than building `EXEC`
  strings.
- **Tracking and no-tracking:** none, unless the project uses `DataSet`
  and `SqlDataAdapter`, which track row state; keep that pattern if it
  exists.
- **N+1 query risks:** readers opened per row. Use one command with a join
  or multiple result sets (`NextResult`). Enabling MARS to get past "open
  reader" errors usually hides an N+1 loop.
- **Transactions and isolation:** `BeginTransaction(IsolationLevel)`, set
  `Transaction` on every command, dispose with `using`/`await using`.
  `IsolationLevel.Snapshot` fails unless the database allows snapshot
  isolation. Retry only whole units of work on error 1205.
- **Indexing trade-offs:** parameter types decide whether an index seek is
  possible; check each new statement's plan.
- **Safe schema migrations:** use the project's migration tool; never run
  DDL from application startup code against shared databases.
- **Database integration testing:** run against SQL Server with the target's
  isolation settings; test rollback, `SqlException.Number` handling
  (1205, 2601, 2627, 547), and timeouts.
- **Performance measurement:** compare logical reads and duration for the
  same statement and data; `SqlBulkCopy` for bulk loads, measured against
  the existing approach before replacing it.
- **SQL Server-specific behavior:** `Encrypt` defaults to true from
  Microsoft.Data.SqlClient 4.0 (`TrustServerCertificate` only for local
  development); `ApplicationIntent = ReadOnly` routes to readable
  secondaries; configurable retry logic (`SqlConfigurableRetryFactory`);
  connection pooling keys on the exact connection string.

**Steps:**

1. Confirm the SqlClient package and version, connection string handling
   (never printed), pooling, and retry configuration.
2. Write commands with typed `SqlParameter`s, the transaction, a timeout
   that fits the operation, and `ExecuteReaderAsync` with the
   `CancellationToken`; dispose connections, commands, and readers.
3. Map error numbers deliberately: unique violations (2601, 2627) to a
   conflict, foreign key violations (547) to a validation error, deadlocks
   (1205) to a bounded whole-unit retry.
4. Add integration tests on SQL Server for results, rollback, error
   mapping, and an injection-shaped input.
5. Measure before and after on the same data for performance changes, and
   check the plan for implicit conversions.

**Verify:** report PASS, FAIL, or NOT_RUN for the integration tests and
error-mapping tests, and MEASURED for performance claims.

## Commands

```bash
dotnet test --filter "Category=Integration"     # the project's own filter or test project
dotnet list package --include-transitive         # confirm EF Core, Dapper, and SqlClient versions
```

## Pitfalls

- PostgreSQL-flavoured raw SQL (`LIMIT`, `RETURNING`, `ILIKE`) inside a SQL
  Server project's `FromSql` or Dapper strings.
- Passing an interpolated string to Dapper or `FromSqlRaw`.
- Tests on the InMemory provider or SQLite presented as proof of SQL
  Server behaviour.
- Swapping `System.Data.SqlClient` for `Microsoft.Data.SqlClient` as a side
  effect: encryption defaults and behaviour change; it is its own change.
