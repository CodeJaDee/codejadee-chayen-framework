---
kind: technology
---
# SQL Server T-SQL and stored procedures

Stack detail for writing and reviewing T-SQL, procedures, functions, and
dynamic SQL on SQL Server and Azure SQL. Read
[sql-server.md](sql-server.md) first: it detects the engine, version,
compatibility level, and collation, and lists the PostgreSQL forms that must
never appear in SQL Server code.

## Check the repository first

| Area | What to look for |
|---|---|
| Where SQL lives | `.sql` scripts, an SSDT or `Microsoft.Build.Sql` `.sqlproj`, DbUp or Flyway folders, EF Core `migrationBuilder.Sql`, Dapper strings, or procedures only in the database |
| Version gates | Database `compatibility_level`, not only the server version, decides functions such as `STRING_SPLIT`, `OPENJSON`, and newer syntax |
| Collation | Database and column collations decide case and accent sensitivity of `=`, `LIKE`, `ORDER BY`, and unique keys |
| Conventions | Schema names, `CREATE OR ALTER` versus drop-and-create, `SET NOCOUNT ON`, `SET XACT_ABORT ON`, `THROW` versus `RAISERROR`, error-handling templates, header comments |
| Tests and lint | tSQLt classes, SQL unit tests in the application test project, SQLFluff with the `tsql` dialect, or a build of the `.sqlproj` |

## Dialect-correct T-SQL (sqlserver-tsql)

**Applies when:** writing, fixing, or reviewing queries, views, functions, or
scripts that run on SQL Server or Azure SQL, including raw SQL inside EF
Core, Dapper, or ADO.NET code, and porting SQL from another engine.

**Not when:** the engine is PostgreSQL, MySQL, or SQLite (use that engine's
reference), or the work is a procedure's design and permissions (stored
procedures below) or a slow query's plan (the query tuning reference).

**Version notes:** `CREATE OR ALTER` needs SQL Server 2016 SP1;
`STRING_SPLIT` and `OPENJSON` need compatibility level 130; `STRING_AGG`,
`TRIM`, and `CONCAT_WS` need SQL Server 2017; `GREATEST`, `LEAST`,
`GENERATE_SERIES`, `DATE_BUCKET`, and `IS [NOT] DISTINCT FROM` need SQL
Server 2022 (several also need level 160). SQL Server 2025 (level 170)
adds a native `json` type, `REGEXP_` functions, and the `||` operator:
check the installed version and level before using any of them, and never
assume Azure SQL features exist on-premises.

**Steps:**

1. Confirm the engine, the version, the database compatibility level, and
   the collation with read-only queries (`sql-server.md`). Write only
   syntax that this combination supports; a function that exists in the
   server version can still fail at a lower compatibility level.
2. Write T-SQL forms, never PostgreSQL ones: `TOP (n)` or
   `ORDER BY ... OFFSET m ROWS FETCH NEXT n ROWS ONLY` instead of `LIMIT`,
   `OUTPUT inserted.*` instead of `RETURNING`, `CAST`/`TRY_CAST` instead of
   `::`, `LIKE` under the right collation instead of `ILIKE`, `[name]`
   instead of `"name"`, `bit` instead of `boolean`, `IDENTITY` or a
   `SEQUENCE` with `NEXT VALUE FOR` instead of `serial` or `nextval`.
3. Make results deterministic: every `OFFSET`/`FETCH` and `TOP` has an
   `ORDER BY` on a unique key; date logic states UTC or local and uses
   `datetime2`/`datetimeoffset`; string comparisons state the collation
   when case or accent matters, because a `_CI_` database treats `Alpha` and
   `ALPHA` as equal and as duplicates in unique keys.
4. Keep set-based logic set-based. Replace row-by-row cursors and scalar
   loops with joins, window functions, or `APPLY` when the semantics are the
   same, and keep predicates sargable: no functions or implicit conversions
   on indexed columns, and parameter types that match column types
   (`varchar` with `varchar`, `nvarchar` with `nvarchar`).
5. Handle errors explicitly: `SET XACT_ABORT ON` with `BEGIN TRY ... BEGIN
   CATCH`, `IF @@TRANCOUNT > 0 ROLLBACK`, and `THROW` to re-raise. Without
   `XACT_ABORT`, a failed statement inside a transaction can leave the
   earlier and later statements committable.
6. For upserts, do not copy `ON CONFLICT`. Use the project's pattern, or an
   `UPDATE` followed by an `INSERT` inside one transaction with
   `UPDLOCK, HOLDLOCK` on the existence check, backed by a unique
   constraint. If `MERGE` is the house style, add `HOLDLOCK` and test the
   concurrent case.
7. Run the statements on a local or disposable database at the same
   compatibility level and collation as the target, with representative
   rows, and compare results with the expected output.

**Verify:** each changed statement parses and runs on a local or
disposable database with the target's compatibility level and collation,
and its results match a test or an expected-output query; report PASS,
FAIL, or NOT_RUN with the `sqlcmd` or test command and the database used.

```sql
-- Paging: T-SQL, deterministic, parameterized
SELECT o.Id, o.Number, o.Total
FROM dbo.Orders AS o
WHERE o.CustomerId = @customerId
ORDER BY o.CreatedAt DESC, o.Id DESC
OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY;
```

## Stored procedures and dynamic SQL (sqlserver-stored-procedures)

**Applies when:** creating, changing, reviewing, or calling stored
procedures, functions, or triggers, or building dynamic SQL in T-SQL, on
SQL Server or Azure SQL.

**Not when:** the project keeps all SQL in the application and does not use
procedures (do not introduce them), or the task is only reading a slow
procedure's plan (query tuning reference).

**Version notes:** `CREATE OR ALTER PROCEDURE` needs SQL Server 2016 SP1.
Natively compiled procedures need memory-optimized tables. Parameter
Sensitive Plan optimization (SQL Server 2022, compatibility level 160) can
cache several plans for one statement; earlier levels cache one plan per
statement, compiled for the first parameter values.

**Steps:**

1. Follow the existing procedure template: naming, schema, `SET NOCOUNT
   ON`, `SET XACT_ABORT ON`, error handling, and return conventions
   (result sets, `OUTPUT` parameters, or return codes). Deploy changes
   through the project's tool (`.sqlproj`, migration scripts, DbUp), not
   by hand on a shared server.
2. Never concatenate parameters into `EXEC (...)`. A caller that sends a
   parameterized command is still injectable when the procedure
   concatenates its input. Use `sp_executesql` with typed parameters, and
   wrap identifiers that must be dynamic in `QUOTENAME` after checking them
   against an allow-list (for example `sys.columns` for sortable columns).
3. Grant `EXECUTE` on the procedure, not table permissions, when the
   design relies on procedures. Ownership chaining covers static SQL inside
   the procedure, but dynamic SQL is checked against the caller, so the
   caller then needs table permissions or the procedure needs a reviewed
   `EXECUTE AS` or certificate signing.
4. Expect parameter sniffing: a plan is compiled for the first values and
   reused. When values have very different selectivity, measure first,
   then choose among `OPTION (RECOMPILE)` for rare statements,
   `OPTIMIZE FOR`, splitting the procedure, or a Query Store plan hint;
   do not add `WITH RECOMPILE` everywhere.
5. Keep triggers small and set-based (they fire once per statement, with
   `inserted`/`deleted` holding many rows). Note that tables with triggers
   affect ORM features that rely on `OUTPUT` without `INTO`.
6. Call procedures with typed parameters (`SqlDbType` with size, or
   `CommandType.StoredProcedure` in Dapper) and pass the transaction and
   cancellation token through the project's data access code.
7. Test the procedure with tSQLt or the project's integration tests:
   normal values, boundary values, a malicious string, an error that must
   roll back, and the permission model under a low-privilege user.

**Verify:** the procedure deploys through the project's tool to a local
or disposable database; tests cover results, rollback on error, an
injection-shaped input, and a low-privilege caller; report PASS, FAIL, or
NOT_RUN with the commands.

```sql
-- Dynamic sort column: allow-listed identifier, parameterized value
DECLARE @sql nvarchar(max) = N'SELECT Id, Name FROM dbo.Customers WHERE Region = @region ORDER BY '
  + QUOTENAME(@sortColumn) + N';';
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.Customers') AND name = @sortColumn)
  THROW 50001, N'Unsupported sort column.', 1;
EXEC sys.sp_executesql @sql, N'@region nvarchar(50)', @region = @region;
```

## Commands

```bash
sqlcmd -S <server> -d <database> -b -i change.sql       # -b: stop and return a non-zero exit code on error
sqlcmd -S <server> -d <database> -Q "EXEC tSQLt.RunAll;" # when the project uses tSQLt
dotnet build Database.sqlproj                             # SSDT/Microsoft.Build.Sql projects validate references
```

Credentials come from the environment or integrated authentication, never
inline. Run changes against local or disposable databases only.

## Pitfalls

- PostgreSQL syntax pasted into SQL Server code, or engine-neutral examples
  that silently assume `LIMIT`, `RETURNING`, or `ON CONFLICT`.
- `SELECT *` in views and procedures that consumers bind by position.
- Concatenating catalog columns with different collations, which fails
  with a collation conflict; select them as separate columns or `COLLATE`
  explicitly.
- `NOLOCK` used to hide blocking: it can return uncommitted, missing, or
  duplicated rows.
- Scalar user-defined functions in large queries on versions or
  compatibility levels without scalar UDF inlining.
