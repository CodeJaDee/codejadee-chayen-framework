---
kind: technology
---
# PostgreSQL

**Applies to:** self-managed PostgreSQL and managed services (Amazon RDS or
Aurora PostgreSQL, Azure Database for PostgreSQL, Google Cloud SQL,
Supabase, Neon).

- Read the server version first (`SHOW server_version;`). Locking behaviour
  of `ALTER TABLE`, available syntax, and planner features change between
  major versions.
- Managed services restrict superuser features and some extensions. Check
  before relying on one.

## Check the repository first

| Area | What to look for |
|---|---|
| Version and extensions | `SELECT version();`, `SELECT extname, extversion FROM pg_extension;` (for example `pg_stat_statements`, `citext`, `pgcrypto`, PostGIS) |
| Access and migrations | EF Core (`UseNpgsql`), Dapper with Npgsql, Prisma, Drizzle, SQLAlchemy and Alembic, Django, Flyway, `node-pg-migrate`, or raw SQL files |
| Naming | snake_case unquoted identifiers. Quoted mixed-case names must be quoted everywhere. |
| Keys | `bigint GENERATED ... AS IDENTITY`, `serial` in older schemas, or `uuid` |
| Time | `timestamptz` for instants, and the session `TimeZone` setting |

## Detect the engine and provider

Confirm PostgreSQL from a concrete signal before applying PostgreSQL
guidance, and record it:

| Signal | PostgreSQL | Not PostgreSQL |
|---|---|---|
| .NET | `Npgsql.EntityFrameworkCore.PostgreSQL`, `UseNpgsql`, `Npgsql`, `NpgsqlDataSource` | `UseSqlServer`, `Microsoft.Data.SqlClient`, `UseMySql`, `UseSqlite` |
| Python, Node, others | `postgresql+psycopg`/`psycopg2`/`asyncpg`, `django.db.backends.postgresql`, Prisma `provider = "postgresql"`, `pg`, Drizzle `pg-core`, `pgx`, `jdbc:postgresql:` | `mssql`, `mysql`, `sqlite` |
| Connection strings and tools | `Host=`/`Port=5432`, `postgres://` URLs, `psql`, `pg_dump`, `postgres` images, Testcontainers `PostgreSql` | `Server=`, `Initial Catalog`, `sqlcmd` |

When signals disagree (SQLite in tests, PostgreSQL in production; or SQL
Server and PostgreSQL side by side), name both, treat the production engine
as the target, and say which test results do not carry over. Then read the
version (`server_version_num`), extensions, collation and locale, time zone,
and isolation default with read-only queries.

**Production and shared environments:** inspect only with bounded,
read-only queries (catalog views, `pg_stat_*`, plain `EXPLAIN`), for
example with `default_transaction_read_only=on` and a `statement_timeout`,
on a replica where one exists, and only with access the user provided for
that purpose. Reproduce and change on a test or disposable database.

## PostgreSQL is not SQL Server

Never treat the two engines as interchangeable, even through the same ORM:

| Topic | PostgreSQL | SQL Server |
|---|---|---|
| Paging, upsert, returning rows | `LIMIT`/`OFFSET`, `ON CONFLICT`, `RETURNING` | `TOP`, `OFFSET ... FETCH`, `UPDLOCK, HOLDLOCK` patterns, `OUTPUT` |
| Identifiers | Unquoted names fold to lower case; `"Name"` is case-sensitive | `[Name]`; case sensitivity follows collation |
| Text comparison | Case-sensitive by default; `'a' = 'a  '` is false for `text` | Case-insensitive by default (`_CI_`); trailing spaces ignored |
| `NULL` | Sorts last ascending; unique constraints allow many `NULL`s | Sorts first; a unique constraint allows one `NULL` |
| Readers and writers | MVCC: readers never block writers; old row versions need vacuum | Readers wait for writers unless read committed snapshot is on |
| Concurrency errors | SQLSTATE `40001`, `40P01`, `55P03` | Error numbers 1205, 3960, 1222 |
| Time | `timestamptz` stores an instant; `timestamp` drops offsets | `datetimeoffset` keeps the offset; `datetime2` has none |
| Operations | `VACUUM`/`ANALYZE`, `pg_dump`, WAL archiving, `CREATE INDEX CONCURRENTLY` | Index/statistics maintenance, `BACKUP`, log backups, `ONLINE = ON` |

## Topic references

Load at most one PostgreSQL topic reference for the request: SQL dialect
and JSONB, EXPLAIN and indexes, MVCC and row-level security, partitioning
and migrations, vacuum and backups, or the EF Core Npgsql, Npgsql,
SQLAlchemy, and other data access recipes. Each is listed in the skill's
References table.

## Guidance

### Types

- `text` with `CHECK` length constraints, or `varchar(n)` as the schema
  does. `numeric(p, s)` for money. `timestamptz` for instants.
- `jsonb` for genuinely variable attributes, with GIN indexes only for
  queried paths.
- Native enums are hard to change (values cannot be removed). A lookup
  table or a `CHECK` constraint is easier to evolve.

### Locking and online changes

- DDL is transactional, but most `ALTER TABLE` forms take an `ACCESS
  EXCLUSIVE` lock. Set `lock_timeout` (for example `SET lock_timeout =
  '5s';`) in migrations so a blocked migration fails fast instead of
  queueing every query behind it.
- `CREATE INDEX CONCURRENTLY` avoids blocking writes, but cannot run inside
  a transaction block. Many migration tools need a per-migration setting to
  disable their transaction.
- `ADD COLUMN` with a constant default is metadata-only from version 11. A
  volatile default rewrites the table.
- `ALTER COLUMN TYPE` usually rewrites the table. Prefer a new column plus a
  backfill.
- New foreign keys and checks: `ADD CONSTRAINT ... NOT VALID`, then
  `VALIDATE CONSTRAINT` (weaker lock). From version 12, a validated
  `CHECK (col IS NOT NULL)` lets `SET NOT NULL` skip the full scan.

### Concurrency

- Default isolation is READ COMMITTED. `REPEATABLE READ` and `SERIALIZABLE`
  raise serialization failures (SQLSTATE `40001`), and deadlocks raise
  `40P01`: retry the whole transaction, bounded.
- `SELECT ... FOR UPDATE` for row locks, `FOR UPDATE SKIP LOCKED` for queue
  consumers, and `pg_advisory_xact_lock` for application-level locks.
- `INSERT ... ON CONFLICT (key) DO UPDATE` for atomic upserts.

### Plans and statistics

- `EXPLAIN (ANALYZE, BUFFERS)` executes the statement. For writes, wrap it
  in `BEGIN; ... ROLLBACK;` on a non-production database only.
- `pg_stat_statements` for workload history, and `pg_stat_user_indexes`
  (`idx_scan`) for index usage since the last statistics reset.
- After large data changes, `ANALYZE` the table so plans see the new
  distribution.

### Backups

- Logical: `pg_dump -Fc` and `pg_restore`. Physical with point-in-time
  recovery: base backups plus WAL archiving (pgBackRest, Barman,
  `pg_basebackup`), or the managed service's point-in-time restore to a new
  instance.
- Verify a restore with row counts, `pg_amcheck` (version 14 and later) or
  `amcheck`, and application queries.

## Commands

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "SELECT version();"
PGOPTIONS="-c default_transaction_read_only=on -c statement_timeout=30s" psql "$DATABASE_URL" -f query.sql
pg_dump -Fc -d "$DATABASE_URL" -f backup.dump     # only with approval for non-local databases
```

## Pitfalls

- Long-running transactions that hold locks or stop vacuum from cleaning
  up dead rows.
- `CREATE INDEX CONCURRENTLY` that failed and left an `INVALID` index.
  Check `pg_index.indisvalid`, drop it, and retry.
- `LIKE '%term%'` expected to use a B-tree index. It needs `pg_trgm` or
  full-text search.
- Counting with `SELECT count(*)` on huge tables during peak hours when an
  estimate (`pg_class.reltuples`) would do.
