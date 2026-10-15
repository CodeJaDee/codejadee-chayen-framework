---
kind: technology
---
# PostgreSQL data access recipes: EF Core Npgsql, Npgsql, SQLAlchemy, others

Recipes for application code that reads and writes PostgreSQL. Read
[postgresql.md](postgresql.md) first to detect the engine and provider. Use
the recipe for the library the code already uses (several may coexist);
never add or switch a data access library without approval, and never reuse
SQL Server code or settings for PostgreSQL as if they were interchangeable.

## Check the repository first

| Area | What to look for |
|---|---|
| .NET | `Npgsql.EntityFrameworkCore.PostgreSQL` and `UseNpgsql`; `Npgsql` with `NpgsqlDataSource`; Dapper over Npgsql; Npgsql version (6.0 changed date/time mapping) |
| Python | SQLAlchemy (`postgresql+psycopg`, `postgresql+psycopg2`, `postgresql+asyncpg`), Alembic, Django (`django.db.backends.postgresql`), raw psycopg or asyncpg |
| Node and others | Prisma (`provider = "postgresql"`), Drizzle, `pg`, Sequelize, TypeORM, Knex; JDBC with Hibernate or jOOQ; Go `pgx` |
| Connections | Pooling (driver pool, PgBouncer transaction mode), TLS mode, timeouts; credentials from configuration, never printed |
| Tests | Integration tests on PostgreSQL (container, local cluster, test server) versus SQLite or in-memory substitutes |

## Driver references

| Library | Package | APIs these recipes name |
|---|---|---|
| EF Core Npgsql provider | `Npgsql.EntityFrameworkCore.PostgreSQL` | `UseNpgsql`, `EnableRetryOnFailure`, `MapEnum`, `ToQueryString`, `AsNoTracking`, `AsSplitQuery`, `FromSql`, `ExecuteUpdateAsync`, `CreateExecutionStrategy`, `BeginTransactionAsync`, `DbUpdateConcurrencyException`, `IsRowVersion`, `HasColumnType`, `HasMethod`, `HasFilter`, `ILike` |
| Npgsql | `Npgsql` | `NpgsqlDataSourceBuilder`, `NpgsqlDataSource`, `EnableDynamicJson`, `NpgsqlCommand`, `NpgsqlParameter`, `NpgsqlDbType`, `NpgsqlBatch`, `NpgsqlBatchCommand`, `BeginBinaryImportAsync`, `PostgresException`, `PostgresErrorCodes`, `SqlState` |
| SQLAlchemy | `SQLAlchemy`, `psycopg` | `create_engine`, `select`, `text`, `bindparam`, `event`, `Numeric`, `JSONB`, `TIMESTAMP`, `insert`, `Session`, `selectinload` |
| Dapper over Npgsql | `Dapper` | `QueryAsync`, `ExecuteAsync`, `CommandDefinition` |

## EF Core Npgsql provider recipe

**Applies when:** a `DbContext` uses `UseNpgsql` and a query, write,
transaction, mapping, or performance problem is in that code.

- **Parameterized queries:** LINQ captured values become parameters;
  `FromSql`/`SqlQuery`/`ExecuteSql` with interpolation parameterize too.
  `FromSqlRaw` only with explicit `NpgsqlParameter`s.
- **Query translation:** check `ToQueryString()`: `LIMIT`/`OFFSET`,
  double-quoted names. Use `EF.Functions.ILike` for case-insensitive
  matching; `string.Equals` with a comparison type does not translate.
- **Tracking and no-tracking:** `AsNoTracking()` for reads; changes to
  untracked entities are not saved; `ExecuteUpdateAsync` bypasses tracking.
- **N+1 query risks:** loops and lazy loading; use `Select` projections or
  `Include`, with `AsSplitQuery()` for several collections.
- **Transactions and isolation:** one `SaveChanges` is one transaction;
  `BeginTransactionAsync(IsolationLevel.RepeatableRead)` needs a retry on
  `40001`; with `EnableRetryOnFailure` wrap it in
  `CreateExecutionStrategy()`. Use the `xmin` row version (`IsRowVersion`
  on a `uint`) and handle `DbUpdateConcurrencyException`.
- **Indexing trade-offs:** declare indexes in the model, including
  `HasMethod("gin")` for `jsonb`, `HasFilter` for partial indexes, and
  expression indexes in migrations; each index costs writes.
- **Safe schema migrations:** review generated SQL for rewrites; run
  `CREATE INDEX CONCURRENTLY` in a migration with `suppressTransaction`.
- **Database integration testing:** test on PostgreSQL (container or local
  cluster) with the target major version, never SQLite or InMemory.
- **Performance measurement:** SQL from `ToQueryString()` plus `EXPLAIN
  (ANALYZE, BUFFERS)` and command counts on the same data.
- **Time zones, types, and precision:** from Npgsql 6, `timestamptz` maps to
  `DateTime` with `Kind=Utc` and rejects `Unspecified`/`Local` values;
  `timestamp` rejects `Utc`; use `DateTimeOffset` or UTC consistently and
  `HasPrecision` for `numeric`.
- **PostgreSQL-specific behavior:** enums via `MapEnum` (provider 9+),
  `jsonb` via `HasColumnType("jsonb")` or owned/complex types, arrays, and
  case-sensitive text comparison.

**Steps:**

1. Confirm `UseNpgsql`, provider and Npgsql versions, and the existing
   patterns; check for the legacy timestamp switch before changing dates.
2. Write the change with async calls, the `CancellationToken`, and
   parameters; read with `AsNoTracking`.
3. Inspect the SQL and plan; replace per-row loops with one query.
4. Add an integration test on PostgreSQL covering results, the concurrency
   or retry path, and date/precision round trips.
5. Measure before and after on the same data for performance work.

**Verify:** report PASS, FAIL, or NOT_RUN for PostgreSQL integration tests
and the inspected SQL, and MEASURED for performance claims.

## Npgsql recipe

**Applies when:** code uses `NpgsqlDataSource`, `NpgsqlConnection`, and
`NpgsqlCommand` directly.

- **Parameterized queries:** named (`@code`) or positional (`$1`)
  parameters with `NpgsqlDbType`; arrays via `= ANY(@ids)` with one array
  parameter; never concatenated SQL.
- **Query translation:** none; PostgreSQL SQL is sent as written.
- **Tracking and no-tracking:** none; writes are explicit statements.
- **N+1 query risks:** commands per row; use one query, `= ANY(@ids)`, or
  `NpgsqlBatch` for several statements in one round trip.
- **Transactions and isolation:** `BeginTransactionAsync(IsolationLevel)`;
  retry whole units on `PostgresErrorCodes.SerializationFailure` and
  `DeadlockDetected` using `PostgresException.SqlState`.
- **Indexing trade-offs:** parameter types decide index use (a `text`
  parameter against a `citext` or expression index needs the same form).
- **Safe schema migrations:** use the project's migration tool, not startup
  DDL against shared databases.
- **Database integration testing:** PostgreSQL test database; test
  SQLSTATE handling (`23505`, `23503`, `40001`).
- **Performance measurement:** `EXPLAIN (ANALYZE, BUFFERS)` on a copy;
  `COPY` through `BeginBinaryImportAsync` for bulk loads, measured.
- **Time zones, types, and precision:** UTC `DateTime` or `DateTimeOffset`
  for `timestamptz`; `numeric` reads as `decimal`, which cannot hold every
  PostgreSQL `numeric` value (read larger ones as text); JSON POCOs need
  `EnableDynamicJson` on the builder (Npgsql 8+).
- **PostgreSQL-specific behavior:** one `NpgsqlDataSource` per connection
  string (Npgsql 7+); pooling with PgBouncer transaction mode needs care
  with prepared statements and session state.

**Steps:**

1. Confirm the Npgsql version and how the data source is built and shared.
2. Write commands with typed parameters, a timeout, and the token.
3. Map SQLSTATE errors to conflicts, validation errors, or retries.
4. Integration-test on PostgreSQL, including bulk and date paths.
5. Measure before and after for performance changes.

**Verify:** report PASS, FAIL, or NOT_RUN for integration and error-mapping
tests, and MEASURED for performance claims.

## SQLAlchemy recipe

**Applies when:** Python code uses SQLAlchemy Core or ORM with a PostgreSQL
dialect; skip this recipe when the project does not use SQLAlchemy.

- **Parameterized queries:** expressions bind parameters; `text()` with
  `:name` and `bindparam`; never f-strings or `%` formatting into SQL.
- **Query translation:** compile with the PostgreSQL dialect
  (`str(stmt.compile(dialect=postgresql.dialect()))`); the same statement
  compiles differently for SQL Server.
- **Tracking and no-tracking:** the `Session` identity map and unit of
  work; `expire_on_commit` reloads attributes after commit; Core statements
  bypass the ORM.
- **N+1 query risks:** lazy loading in loops; use `selectinload` or
  `joinedload`, and `raiseload` to catch accidental lazy loads in tests.
- **Transactions and isolation:** `Session.begin()` or `engine.begin()`;
  `isolation_level` per engine or connection; retry `40001` around the
  whole unit.
- **Indexing trade-offs:** declare indexes in models or Alembic with
  `postgresql_using="gin"`, `postgresql_where`, or `postgresql_concurrently`.
- **Safe schema migrations:** Alembic autogenerate output reviewed by hand;
  concurrent index builds inside `op.get_context().autocommit_block()`.
- **Database integration testing:** PostgreSQL test database with the same
  driver (psycopg, psycopg2, or asyncpg), not SQLite.
- **Performance measurement:** count statements with a
  `before_cursor_execute` `event` listener, then `EXPLAIN (ANALYZE,
  BUFFERS)` on a copy.
- **Time zones, types, and precision:** `TIMESTAMP(timezone=True)` for
  instants with timezone-aware `datetime`s; `Numeric` returns `Decimal`.
- **PostgreSQL-specific behavior:** `postgresql.insert().on_conflict_do_update`
  for upserts, `JSONB`, arrays, and `RETURNING`.

**Steps:**

1. Confirm the dialect, driver, SQLAlchemy and Alembic versions, and session
   handling (scoped, per request, async).
2. Write statements with bound parameters and explicit eager loading.
3. Count statements and inspect compiled SQL for changed queries.
4. Test on PostgreSQL, including upsert, retry, and timezone paths.
5. Measure before and after for performance work.

**Verify:** report PASS, FAIL, or NOT_RUN for PostgreSQL tests and the
statement counts, and MEASURED for performance claims.

## Other ORM and driver configurations recipe

**Applies when:** the project reaches PostgreSQL through another library
found in the repository: Dapper over Npgsql, Django ORM, Prisma, Drizzle,
`pg`, Sequelize, TypeORM, Knex, asyncpg, JDBC/Hibernate, or `pgx`.

- **Parameterized queries:** use the library's parameter mechanism (Dapper
  objects, Prisma tagged `$queryRaw`, `pg` `$1`), never `$queryRawUnsafe`,
  `.raw()` with interpolation, or string concatenation.
- **Query translation:** inspect generated SQL with the library's logging.
- **Tracking and no-tracking:** follow the library's model (none in Dapper
  and `pg`, unit of work in Hibernate and Django).
- **N+1 query risks:** lazy relations and per-row calls; use the library's
  eager loading or one set-based query.
- **Transactions and isolation:** the library's transaction API with
  explicit isolation and whole-unit retry on `40001`.
- **Indexing trade-offs:** index definitions belong in the project's
  migrations; check plans for new query shapes.
- **Safe schema migrations:** the project's tool (Django, Prisma Migrate,
  Drizzle Kit, Flyway); review the SQL it generates.
- **Database integration testing:** run against PostgreSQL in tests.
- **Performance measurement:** statement counts plus `EXPLAIN (ANALYZE,
  BUFFERS)` on a copy, before and after.
- **Time zones, types, and precision:** how the driver maps `timestamptz`,
  `numeric` (often strings in JavaScript drivers), and `bigint`.
- **PostgreSQL-specific behavior:** connection pooling, prepared statements
  with PgBouncer, and the library's support for `jsonb`, arrays, and enums.

**Steps:**

1. Identify every library, version, and connection setting actually used.
2. Apply the topics above with that library's documented APIs only.
3. Add PostgreSQL integration tests for changed paths.
4. Measure before and after for performance work.

**Verify:** report PASS, FAIL, or NOT_RUN for PostgreSQL integration tests,
and MEASURED for performance claims; name the library and version.

## Commands

```bash
docker run --rm -e POSTGRES_PASSWORD=<local-only> -p 5432:5432 postgres:<major>   # disposable test database, when Docker is used
dotnet test --filter "Category=Integration"; pytest -m integration
```

## Pitfalls

- SQL Server provider settings, SQL, or retry codes reused for PostgreSQL.
- `Kind=Unspecified` dates written to `timestamptz`, or `timestamp` used for
  instants.
- Tests on SQLite presented as PostgreSQL evidence.
- `$queryRawUnsafe`, f-strings, or concatenation for "dynamic" SQL.
