---
kind: recipe
capabilities: [CAP-09-003, CAP-09-004]
---
# Query performance and index review

Make slow queries faster from execution plans and measurements, fix ORM
query shapes (N+1, over-fetching), and review indexes against the real
workload, with every change justified by a query and its write cost.

## Inputs

- The query text or the ORM code, its parameters, and the execution plan if
  the user has one.
- Table sizes, index definitions, and the workload: Query Store or
  `pg_stat_statements` output, slow-query logs, or the known access
  patterns.
- Where measurement may run: a local or disposable database with
  representative data, or production read-only with approval.

## Procedure

### Query optimization (CAP-09-003)

1. **Reproduce with real parameters** on a non-production database with
   representative data volumes. On production, use only read-only
   measurement the user approved, and never execute a writing statement to
   get its plan.
2. **Measure the baseline:** elapsed time, logical reads or buffers, rows
   returned, and the actual plan.
3. **Read the plan** for the dominant cost:
   - scans of large tables where a seek is expected;
   - estimated versus actual row counts far apart (stale statistics or
     parameter sensitivity);
   - key lookups or heap fetches per row;
   - implicit conversions and non-sargable predicates (functions on
     columns, leading wildcards, `OR` across columns);
   - sorts, hashes, or spills to disk.
4. **Check the ORM shape:** count queries per request through logging.
   Look for N+1 loops, loading whole entities where a projection would do,
   client-side evaluation, missing paging, and a Cartesian explosion from
   several collection includes.
5. **Apply the smallest fix:** a sargable rewrite, a projection, eager
   loading or batching, a statistics update, or an index (see the index
   review below). Do not add query hints without a measured reason.
6. **Prove the results are unchanged:** the same rows and order, by a test
   or a comparison query.
7. **Measure again** under the same conditions, and report before and
   after.

### Index review (CAP-09-004)

1. **Inventory indexes** with their key and included columns, size, and
   usage counts. Note when usage statistics were last reset.
2. **Collect the workload:** the top queries by total time or frequency, or
   the documented access patterns.
3. **Classify each finding:**
   - **duplicate:** same key columns in the same order;
   - **overlapping:** one index is a left prefix of another;
   - **unused:** no reads over a full business cycle (month-end included);
   - **missing:** a plan shows a scan or lookup that an index would remove.

   Missing-index suggestions from the engine are hints, not decisions.
4. **Justify each recommendation** (create, drop, merge) with the queries
   it serves or no longer needs, and its write cost (table write rate and
   index size).
5. **Prepare a migration** for accepted changes, pending approval: build
   new indexes online or concurrently where supported, and drop unused
   indexes only with a re-create script ready.

## Outputs

- A diagnosis from the plan, and the rewritten query or ORM change.
- Before and after timings or logical reads, or NOT_RUN.
- Index recommendations (create, drop, merge), each with the queries it
  serves and its write cost, plus a migration for accepted changes,
  pending approval.

## Technology considerations

| Stack | Consideration |
|---|---|
| SQL Server | `SET STATISTICS IO, TIME ON`, the actual plan, Query Store, `sys.dm_db_index_usage_stats`, and the missing-index DMVs. Watch parameter sniffing and implicit `nvarchar` conversions. |
| PostgreSQL | `EXPLAIN (ANALYZE, BUFFERS)` on non-production only for writes, `pg_stat_statements`, `pg_stat_user_indexes.idx_scan`, partial and expression indexes, and `ANALYZE` after bulk changes. |
| EF Core | `ToQueryString()` or logging to see SQL, `AsNoTracking`, `Select` projections, `AsSplitQuery` for several includes, and compiled queries for hot paths. |
| Python (SQLAlchemy, Django) | `selectinload` or `joinedload`; `select_related` and `prefetch_related`; `django-debug-toolbar` or `assertNumQueries` to count queries. |
| Node (Prisma, Drizzle, raw `pg`) | Prisma query logging and `include` or `select` shape, `relationLoadStrategy` where supported, and parameterized raw queries for hot paths. |

## Verification

- A test or log shows the query count dropping for an N+1 fix, and the
  results are unchanged.
- Before and after measurements use the same database, data, and
  parameters, or are NOT_RUN with the command to run.
- A seeded duplicate index is flagged, and no index recommendation is made
  without a query that justifies it.
- Index changes are prepared as a migration and not applied without
  approval.
