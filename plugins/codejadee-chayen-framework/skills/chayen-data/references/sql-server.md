---
kind: technology
---
# SQL Server and Azure SQL

**Applies to:** SQL Server (on-premises or in a VM), Azure SQL Database, and
Azure SQL Managed Instance.

- Read the version, edition, and database compatibility level first. Online
  index operations, resumable operations, and some metadata-only changes
  depend on them.
- Statements below are version-dependent. Confirm them against the
  installed version's documentation when an operation's locking or
  availability matters.

## Check the repository first

| Area | What to look for |
|---|---|
| Version and edition | `SELECT @@VERSION;`, `SERVERPROPERTY('Edition')`, `compatibility_level` in `sys.databases`. Azure SQL reports `EngineEdition` 5 (Database) or 8 (Managed Instance). |
| Isolation default | `is_read_committed_snapshot_on` and `snapshot_isolation_state` in `sys.databases`. With RCSI off, readers and writers block each other under READ COMMITTED. |
| Collation | Database and column collations decide case and accent sensitivity in comparisons and unique indexes |
| Access and migrations | EF Core (`UseSqlServer`), Dapper with `Microsoft.Data.SqlClient`, DbUp, Flyway, SSDT `.sqlproj`, or `sqlpackage` |
| Conventions | Schema names (`dbo` or feature schemas), PascalCase or snake_case, key types (`int` or `bigint IDENTITY`, `uniqueidentifier`) |

## Detect the engine and provider

Confirm SQL Server from at least one concrete signal before applying any
SQL Server guidance, and record which signal it was:

| Signal | SQL Server | Not SQL Server |
|---|---|---|
| .NET | `Microsoft.EntityFrameworkCore.SqlServer`, `UseSqlServer`/`UseAzureSql`, `Microsoft.Data.SqlClient` or `System.Data.SqlClient` | `UseNpgsql`/`Npgsql`, `UseMySql`, `UseSqlite`, `UseOracle` |
| Other stacks | Prisma `provider = "sqlserver"`, `mssql`/`tedious`, `mssql+pyodbc` or `mssql-django`, `mssql-jdbc`, `go-mssqldb` | `postgresql`, `pg`, `psycopg`, `mysql2` |
| Connection strings and tools | `Server=`/`Data Source=` with `Initial Catalog`, `*.database.windows.net`, `(localdb)`, `sqlcmd`, `.sqlproj`, `sqlpackage` | `Host=` with `Port=5432`, `psql`, `pg_dump` |
| Containers and CI | `mcr.microsoft.com/mssql/server`, Testcontainers `MsSql` | `postgres` images |

When signals disagree (for example SQLite in tests and SQL Server in
production), name both, treat the production engine as the target, and say
which test results do not carry over. Then read the version, edition,
`EngineEdition`, compatibility level, collation, isolation settings,
recovery model, and Query Store state with read-only queries. Select
catalog values as separate columns: concatenating catalog columns with
different collations fails with a collation conflict.

**Production and shared environments:** inspect only with bounded,
read-only queries (catalog views, DMVs, estimated plans, Query Store), with
`ApplicationIntent=ReadOnly` (`sqlcmd -K ReadOnly`) where a readable
secondary exists, and only with access the user provided for that purpose.
Do the reproduction and every change on a local or disposable database.

## T-SQL, not PostgreSQL

Never write PostgreSQL syntax for SQL Server, including in raw SQL inside
an ORM:

| PostgreSQL | SQL Server |
|---|---|
| `LIMIT n OFFSET m` | `TOP (n)`, or `ORDER BY ... OFFSET m ROWS FETCH NEXT n ROWS ONLY` |
| `INSERT ... ON CONFLICT` | `UPDATE` then `INSERT` in one transaction with `UPDLOCK, HOLDLOCK`, backed by a unique constraint |
| `RETURNING` | `OUTPUT inserted.*` (with `INTO` when the table has triggers) |
| `x::int`, `ILIKE` | `CAST`/`TRY_CAST`; `LIKE` under a case-insensitive collation or an explicit `COLLATE` |
| `"Name"`, `serial`, `nextval('s')`, `boolean`, `now()` | `[Name]`, `IDENTITY`, `NEXT VALUE FOR s`, `bit`, `SYSUTCDATETIME()` |
| `jsonb`, `= ANY(@array)` | `nvarchar(max)` with JSON functions (native `json` from SQL Server 2025), a table-valued parameter or `IN` with parameters |
| `EXPLAIN (ANALYZE)`, `pg_stat_statements`, `VACUUM`, `CREATE INDEX CONCURRENTLY` | Estimated or actual plans, Query Store, statistics and index maintenance, `ONLINE = ON` where the edition supports it |

Equivalents are not always identical: check collation, `NULL` handling,
and concurrency behaviour, and run the statement on a local SQL Server.

## Topic references

Load at most one SQL Server topic reference for the request: T-SQL and
procedures, plans and indexes, locking and transactions, schema, security
and auditing, backup and maintenance, or the EF Core, Dapper, and ADO.NET
data access recipes. Each is listed in the skill's References table.

## Guidance

### Types and keys

- `nvarchar` for Unicode text, with explicit lengths. `nvarchar(max)` only
  for genuinely large text.
- `datetime2` for local or UTC timestamps by convention, and
  `datetimeoffset` when the offset matters. Avoid `datetime`.
- `decimal(p, s)` for money. Never `float`.
- Random `uniqueidentifier` clustered keys fragment the clustered index.
  Use `NEWSEQUENTIALID()` or a separate clustered key if the project uses
  GUIDs.

### Locking and online changes

- Batches above about 5,000 row or page locks on one table can escalate to
  a table lock. Keep batch sizes below that, or check
  `LOCK_ESCALATION` settings.
- `CREATE INDEX ... WITH (ONLINE = ON)` needs Enterprise edition or Azure
  SQL. Otherwise, index builds block writes: schedule them.
- Adding a `NOT NULL` column with a constant default is metadata-only in
  Enterprise editions from 2012. Elsewhere it can rewrite the table.
- `ALTER TABLE ... WITH NOCHECK ADD CONSTRAINT` leaves the constraint
  untrusted (`is_not_trusted = 1`), so the optimizer ignores it. Clean the
  data, then `WITH CHECK CHECK CONSTRAINT`.
- Deadlock victims get error 1205. Retry the whole transaction, bounded.

### Plans and statistics

- `SET STATISTICS IO, TIME ON;` with the actual execution plan for
  measurements. Logical reads are more stable than elapsed time.
- Query Store (`sys.query_store_*`) for history and regressions, when
  enabled.
- `sys.dm_db_index_usage_stats` resets on restart. Missing-index DMVs are
  suggestions, not decisions.
- Implicit conversions (a `varchar` column compared with an `nvarchar`
  parameter) prevent seeks. Match parameter types to column types.

### Backups

- `BACKUP DATABASE ... WITH CHECKSUM`. `RESTORE VERIFYONLY` checks
  readability, not usability. Only a restore plus `DBCC CHECKDB` proves a
  backup.
- Point-in-time restore needs log backups and `RESTORE LOG ... WITH
  STOPAT`. Azure SQL uses its automated point-in-time restore to a new
  database.

## Commands

```bash
sqlcmd -S <server> -d <database> -Q "SELECT @@VERSION;"            # credentials from the environment, never inline
sqlcmd -S <server> -d <database> -K ReadOnly -i query.sql           # read-only intent for AG secondaries
dotnet ef migrations script <From> <To> --idempotent -o migration.sql
```

## Pitfalls

- `MERGE` without `HOLDLOCK` used as an upsert under concurrency, which can
  insert duplicates. Many teams avoid `MERGE` for upserts.
- `NOLOCK` hints added to "fix" blocking, which return dirty and
  duplicated rows.
- `OFFSET ... FETCH` without a deterministic `ORDER BY`.
- Comparing `datetime2` values across time zones without a stated UTC
  convention.
