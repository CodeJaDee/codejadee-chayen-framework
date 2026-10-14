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
