---
kind: technology
---
# PostgreSQL EXPLAIN ANALYZE and index strategy

Stack detail for the query performance recipe on PostgreSQL. Read
[postgresql.md](postgresql.md) first. A performance claim needs before and
after numbers for the same statement, parameters, and data on the same kind
of server; otherwise label it "expected, not measured".

## Check the repository first

| Area | What to look for |
|---|---|
| The query and caller | Exact SQL or ORM query, parameter values and types, call frequency, latency target |
| Measurement access | `pg_stat_statements` (extension and `shared_preload_libraries`), `auto_explain`, read-only replicas, a restored copy for `EXPLAIN ANALYZE` |
| Existing indexes | `\d+ table`, `pg_indexes`, `pg_stat_user_indexes.idx_scan`, invalid indexes (`pg_index.indisvalid = false`) |
| Statistics | Last `ANALYZE`, `default_statistics_target`, extended statistics (`CREATE STATISTICS`) |
| Data shape | Row counts, skew, and the gap between test data and production volumes |

## EXPLAIN ANALYZE evidence (postgres-explain-analyze)

**Applies when:** a PostgreSQL query is slow, reads too many buffers,
behaves differently between environments, or an ORM query (EF Core Npgsql,
SQLAlchemy, Prisma) must be checked for its SQL, its plan, or N+1 patterns.

**Not when:** the fix is an index decision (index section), table bloat or
stale statistics from maintenance (operations reference), or the engine is
not PostgreSQL.

**Version notes:** `EXPLAIN (ANALYZE, BUFFERS)` works on all supported
versions; `SETTINGS` (12), `WAL` (13), `GENERIC_PLAN` (16), and
`SERIALIZE`/`MEMORY` (17) add options; from 18, `ANALYZE` includes buffer
counts by default. Plans differ by version and settings: compare on the
same major version.

**Steps:**

1. Capture the exact statement and parameter types (`ToQueryString()`,
   SQLAlchemy `echo`, `pg_stat_statements`, or the driver log). Count the
   statements per request first: one query per parent row is N+1, fixed in
   the ORM (projection, `Include`, `selectinload`), not in a plan.
2. On production or any shared database, use plain `EXPLAIN` (estimates,
   no execution), `pg_stat_statements`, or `auto_explain` logs. `EXPLAIN
   ANALYZE` executes the statement, including `INSERT`, `UPDATE`, and
   `DELETE`; never run it there for a data-changing statement.
3. Measure on a disposable or restored copy with `EXPLAIN (ANALYZE,
   BUFFERS)`; wrap data-changing statements in `BEGIN; ... ROLLBACK;`.
   Record actual rows versus estimates, loops, shared hit and read buffers,
   and execution time, with a cold and a warm run.
4. Read the cause: large estimate errors (stale or missing statistics,
   correlated columns), sequential scans where a selective index should
   apply, nested loops with many loops, sorts or hashes spilling to disk,
   or functions and casts that prevent index use.
5. Fix the smallest cause: `ANALYZE` or extended statistics, a predicate
   rewrite, a projection that reads fewer columns, an ORM loading change,
   or an index (index section). Do not change planner settings globally to
   force a plan.
6. Repeat the same measurement on the same data and report both. If the
   target differs in version, settings, or data volume, say the result is
   local evidence only.

**Verify:** report MEASURED with before and after buffers, rows, and
execution time for the same statement and data, plus the statement count
for ORM paths; NOT_RUN when no disposable copy was available.

## Index strategy (postgres-index-strategy)

**Applies when:** adding, changing, or removing PostgreSQL indexes, choosing
B-tree, GIN, GiST, BRIN, expression, partial, or covering indexes, or
building an index on a live table.

**Not when:** the slow query has not been measured (EXPLAIN section), or the
need is full-text search design (search recipe).

**Version notes:** `CREATE INDEX CONCURRENTLY` exists in all supported
versions but cannot run inside a transaction block; `INCLUDE` columns need
11; B-tree deduplication 13; `REINDEX CONCURRENTLY` 12; B-tree skip scan 18.
`LIKE 'prefix%'` uses a B-tree only with the `C` collation or a
`text_pattern_ops` index.

**Steps:**

1. Start from measured queries and existing indexes, including usage
   (`idx_scan`) since the last statistics reset; avoid near-duplicates.
2. Match the index to the predicate: an expression index serves only that
   expression (`lower(email)`), a partial index only queries that imply its
   predicate, `ILIKE` and leading-wildcard `LIKE` need `pg_trgm` GIN or GiST,
   and `jsonb` containment needs GIN.
3. State the cost: every index slows writes, uses storage and memory, and
   can prevent heap-only tuple (HOT) updates of its columns.
4. Measure on a disposable copy: buffers and plan before and after for the
   target queries, and the effect on a representative write.
5. Build on live tables with `CREATE INDEX CONCURRENTLY`, which the
   migration tool must run outside a transaction (EF Core
   `suppressTransaction`, Alembic `autocommit_block`, Flyway
   `executeInTransaction=false`). A failed build leaves an `INVALID` index:
   drop it and retry, or rebuild it with `REINDEX INDEX CONCURRENTLY`.
   Shared or production builds need approval.
6. Drop an unused index only after a full business cycle of usage data,
   with a script to recreate it.

**Verify:** report MEASURED buffers and plans for target queries and the
write cost, PASS or FAIL for `indisvalid` after a concurrent build, and
NOT_RUN for builds that were only proposed.

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_users_lower_email ON users (lower(email));
SELECT indisvalid FROM pg_index WHERE indexrelid = 'ix_users_lower_email'::regclass;
```

## Commands

```bash
psql "$TEST_DATABASE_URL" -c "EXPLAIN (ANALYZE, BUFFERS) SELECT ..."        # disposable copy only
PGOPTIONS="-c default_transaction_read_only=on" psql "$DATABASE_URL" -c "EXPLAIN SELECT ..."   # estimates, read-only
```

## Pitfalls

- `EXPLAIN ANALYZE` of an `UPDATE` or `DELETE` on a shared database.
- An index on `email` expected to serve `lower(email)` or `ILIKE`.
- `CREATE INDEX CONCURRENTLY` inside a migration transaction, or a failed
  one left `INVALID`.
- Claims from one warm-cache run or from different data volumes.
