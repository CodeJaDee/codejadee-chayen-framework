---
kind: technology
---
# ASP.NET Core data access: EF Core, Dapper, ADO.NET

Stack detail for the data access recipe in ASP.NET Core. Read
`aspnetcore-webapi.md` first for the version and the
conventions. Do not assume EF Core: many .NET projects use Dapper, plain
ADO.NET, or another library, and some use more than one. On SQL Server,
the data skill's SQL Server data access recipes cover provider translation,
parameter types, isolation, and plan measurement for the same libraries.

## Check the repository first

| Area | What to look for |
|---|---|
| Library | EF Core (`Microsoft.EntityFrameworkCore.*`, a `DbContext`), Dapper (`using Dapper`, `QueryAsync`), ADO.NET (`SqlConnection`, `NpgsqlConnection`, `DbCommand`), or another (linq2db, RepoDb) |
| Provider and engine | `UseSqlServer`, `UseNpgsql`, `UseSqlite`; `Microsoft.Data.SqlClient`, `Npgsql` |
| Versions | The EF Core package version can differ from the framework major version; read it from the package references |
| Access pattern | `DbContext` used directly in handlers, repositories, query objects, or a unit of work. Use what exists; do not add a repository layer. |
| Conventions | Tracking behaviour (`AsNoTracking`, `QueryTrackingBehavior`), concurrency tokens (`[Timestamp]`, `IsRowVersion`, PostgreSQL `xmin`), retries (`EnableRetryOnFailure`), soft delete or tenant query filters (`HasQueryFilter`) |
| Connection handling | For Dapper and ADO.NET: a connection factory, `using` scopes, transaction passing |

## Data access in an API (aspnet-data-access)

**Applies when:** reading or writing data from ASP.NET Core endpoints,
handlers, or jobs through EF Core, Dapper, or ADO.NET: queries, projections,
paging, updates, transactions, concurrency, or raw SQL.

**Not when:** creating or reviewing a schema migration (the data skill's EF
Core migrations reference or migration recipe), tuning a slow query from
its plan (the data skill), or designing tables (the data skill).

**Version notes:** EF Core 7 added `ExecuteUpdate` and `ExecuteDelete`, and
`FromSql` and `ExecuteSql` with interpolated parameters (earlier:
`FromSqlInterpolated`). EF Core 8 added `SqlQuery<T>` for unmapped types,
complex types, and primitive collections. Dapper and ADO.NET APIs are stable
across versions; check the provider package version.

**Steps:**

1. Use the library and access pattern of the surrounding code. Never mix in
   a second data access library without approval.
2. Make every call async with the request's `CancellationToken`
   (`ToListAsync(ct)`, `SaveChangesAsync(ct)`, Dapper `CommandDefinition`
   with `cancellationToken`).
3. EF Core reads: project to DTOs with `Select`, use `AsNoTracking()` for
   read-only queries unless the project sets it globally, and load related
   data with a projection or `Include` rather than per-row queries (N+1).
   Inspect the SQL of a changed query with `ToQueryString()` or the
   project's SQL logging in Development.
4. Page with a stable `OrderBy` plus `Skip`/`Take`, or keyset paging for
   large tables, with a server-side maximum.
5. EF Core writes: load, change, `SaveChangesAsync` (one transaction).
   Use `ExecuteUpdateAsync`/`ExecuteDeleteAsync` for set-based changes,
   remembering that they bypass change tracking and `SaveChanges`
   interceptors.
6. Concurrency: where the entity has a concurrency token, catch
   `DbUpdateConcurrencyException` and return 409 (or the project's
   conflict handling). Never silently overwrite.
7. Several operations that must succeed together: one `SaveChanges`, or an
   explicit transaction (`BeginTransactionAsync`). With
   `EnableRetryOnFailure`, run the whole transaction inside
   `Database.CreateExecutionStrategy().ExecuteAsync(...)`.
8. Raw SQL: EF Core `FromSql`/`ExecuteSql` with interpolated values (they
   become parameters), Dapper with a parameter object, ADO.NET with
   `DbParameter`. Never concatenate input into SQL, and never pass
   concatenated strings to `FromSqlRaw`.
9. Dapper and ADO.NET: open connections from the project's factory inside
   `using` (or `await using`), and pass the transaction to every command in
   it.

**Verify:** the build passes, tests for the changed queries pass against
the project's test database setup (Testcontainers, a local database, or
SQLite where it is representative), and the generated SQL of a changed EF
Core query was inspected; report PASS, FAIL, or NOT_RUN with the command.

## Verification commands

```bash
dotnet build
dotnet test --filter "FullyQualifiedName~Repository|FullyQualifiedName~Query"
```

`ToQueryString()` on an EF Core query prints parameter values as `DECLARE`
lines followed by the parameterized SQL; check the `WHERE` clause uses the
parameters.

## Pitfalls

- **Assuming EF Core** in a Dapper or ADO.NET project, or adding EF Core to
  "simplify" one query.
- **Client-side work after materializing:** `ToList()` before `Where`, or
  loading whole tables to filter in memory. EF Core throws for predicates it
  cannot translate; do not "fix" that by materializing first.
- **N+1 queries** from lazy loading or per-row queries in a loop.
- **A `DbContext` shared across threads** or captured in a singleton; it is
  not thread-safe.
- **`EnableSensitiveDataLogging`** outside Development.
- **Returning entities** instead of DTOs from endpoints.
