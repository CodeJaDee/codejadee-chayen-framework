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
