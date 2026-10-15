---
kind: technology
---
# Data access: EF Core, Dapper, SQL Server, PostgreSQL

**Applies to:** application data access code and schema migrations. This is
not database administration.

## Check the repository first

| Area | What to look for |
|---|---|
| Access technology | EF Core (provider package), Dapper, raw ADO.NET, an ORM in another stack (Prisma, Drizzle, SQLAlchemy, Django ORM) |
| Migrations | EF Core `Migrations/` folder, SQL scripts (DbUp, Flyway), Alembic, Django, Prisma |
| Naming | Table and column casing. PostgreSQL projects often use snake_case through a naming convention. |
| Patterns | Repository/unit-of-work, direct `DbContext` use in handlers, query objects. Follow the existing one. |

Read the actual provider and library versions independently of the .NET target.
`FromSql`/`ExecuteSql` need EF Core 7+; older projects retain supported
`FromSqlInterpolated`/`ExecuteSqlInterpolated` APIs. Do not upgrade a dependency
or generate a migration merely to use an example from this reference.

## Query safety

- **Always parameterize.**
  - **EF Core:** `FromSql($"... {value}")` and
    `FromSqlInterpolated` parameterize interpolated values.
    `FromSqlRaw` with string concatenation does not, and is an injection
    risk.
  - **Dapper:** pass parameters as an object
    (`new { Id = id }`). Never concatenate values.
- **Dynamic sorting or filtering by column name.** Map user input to an
  allow-list of known columns. Never interpolate identifiers.
- **Bound every query** fed by user input: paging, plus a maximum page size.

## EF Core guidance

- **Read-only queries:** `AsNoTracking()`. Project to DTOs with `Select`,
  instead of loading whole entity graphs.
- **Avoid N+1.** Use `Include` or projection deliberately, and check the
  generated SQL when a loop issues queries.
- **Concurrency.** Use the project's concurrency token (`rowversion` on SQL
  Server, `xmin` or a version column on PostgreSQL) for entities edited
  concurrently.
- **Transactions.** `SaveChanges` is atomic per call. Use an explicit
  transaction only when several `SaveChanges` calls or several technologies
  must commit together.

## Migrations (approval required before applying to any shared database)

```bash
dotnet ef migrations add <Name> --project <DataProject> --startup-project <ApiProject>
dotnet ef migrations script <PreviousMigration> <Name>   # review the SQL before applying
dotnet ef database update                                 # local database only, unless approved
```

- **Never edit a migration that may already be applied elsewhere.** Add a
  new one instead.
- **Inspect the generated SQL for:**
  - dropped columns or tables;
  - type narrowing;
  - `NOT NULL` added without a default;
  - large-table index builds.
- **Describe the rollback:** the down migration, or the restore steps.
- **Data backfills are separate, reviewed steps.** Do not hide them in
  schema migrations without saying so.

## SQL Server specifics

- Types:
  - Unicode text uses `nvarchar`.
  - Times use `datetime2` or `datetimeoffset`.
- `OFFSET … FETCH` paging requires a deterministic `ORDER BY`.
- Index foreign keys and frequent filter columns.
- Large index builds on busy tables need a maintenance plan. Flag them.

## PostgreSQL specifics

- **Identifiers are lowercase** unless quoted. Quoted mixed-case names must
  be quoted everywhere.
- **Times:** prefer `timestamptz` for instants.
- **Text search:** `ILIKE` for case-insensitive matching, or
  `citext`/collations as the project already does.
- **Paging:** `LIMIT`/`OFFSET` for small offsets; keyset pagination for deep
  paging.

## Verification

- Build and run the data-access tests.
  - Prefer the project's real-database test setup (for example
    Testcontainers), or SQLite in-memory if that is already used.
  - The EF Core InMemory provider does not behave like a relational
    database. Do not rely on it to verify queries, constraints, or
    transactions.
- For a new migration, report:
  - its name;
  - whether the SQL was reviewed;
  - whether it was applied locally.

## Pitfalls

- Applying migrations automatically at application startup in production,
  unless the project already does this deliberately.
- Logging connection strings or full SQL with parameter values that contain
  personal data.
- Assuming the case-sensitivity or collation of the database. Check the
  existing schema.
