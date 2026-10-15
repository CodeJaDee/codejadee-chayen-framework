---
kind: technology
---
# SQL Server plans, Query Store, and indexes

Stack detail for the query performance recipe on SQL Server and Azure SQL.
Read [sql-server.md](sql-server.md) first for the version, edition,
compatibility level, and production rules. Every performance claim needs a
before and after measurement of the same query, on the same data, on the
same kind of server; otherwise label it "expected, not measured".

## Check the repository first

| Area | What to look for |
|---|---|
| The query and its caller | The exact SQL or ORM query, its parameters and their types, how often it runs, and the latency target |
| Measurement access | Who can read plans and Query Store in each environment (`VIEW DATABASE STATE`, `VIEW SERVER STATE`, or the `VIEW DATABASE PERFORMANCE STATE` family on newer versions); a read-only replica or a restored copy |
| Existing indexes | `sys.indexes`, `sys.index_columns`, included columns, filters, and the indexes created by migrations; naming conventions |
| History | Query Store state and retention, monitoring dashboards, earlier tuning ADRs, plan guides or forced plans |
| Data shape | Row counts, skew of filtered columns, and the gap between the test database and production volumes |

## Execution plans (sqlserver-query-plans)

**Applies when:** a SQL Server query is slow, uses too many reads or too
much CPU, behaves differently between environments, or an ORM query's SQL
must be inspected before and after a change, including N+1 patterns.

**Not when:** the history of a regression across deployments is needed
first (Query Store section), the fix is an index decision (index section),
or the engine is not SQL Server.

**Version notes:** `SET STATISTICS XML` (actual plan) and `SET SHOWPLAN_XML`
(estimated plan) work on all supported versions; lightweight profiling and
`sys.dm_exec_query_plan_stats` (last actual plan) depend on version and
configuration. Compatibility level and the cardinality estimator version
change plans: compare at the same level. Intelligent query processing
features (adaptive joins, memory grant feedback, Parameter Sensitive Plan
optimization) vary by level.

**Steps:**

1. Capture the exact statement with its real parameter types. For EF Core
   use `ToQueryString()` or the project's SQL logging in Development; for
   Dapper and ADO.NET use the command text and the declared parameter
   types. A string parameter sent as `nvarchar` against a `varchar` column
   adds `CONVERT_IMPLICIT` and can turn a seek into a scan.
2. On production or any shared environment, use read-only inspection:
   the estimated plan (`SET SHOWPLAN_XML ON` returns the plan without
   executing the statement), the cached plan from
   `sys.dm_exec_query_stats`, or Query Store. Never run the data-changing
   statement there to "get the actual plan".
3. Measure on a local, disposable, or restored copy with
   `SET STATISTICS IO, TIME ON` and the actual plan. Record logical reads,
   CPU time, elapsed time, row counts, and warnings, with a cold and a warm
   run. Logical reads are the most stable comparison.
4. Read the plan for the cause: estimated versus actual row gaps
   (statistics or parameter sniffing), scans where a seek is expected,
   key lookups multiplied by many rows, implicit conversions, spills,
   missing join predicates, or a per-row pattern from the application
   (one query per parent row is N+1, not a plan problem).
5. Fix the cause with the smallest change: match parameter types to
   column types, rewrite a non-sargable predicate, project fewer columns,
   replace per-row queries with one set-based query or an ORM projection,
   or hand index changes to the index section. Avoid query hints unless a
   measurement shows the plan choice is the cause.
6. Repeat the same measurement on the same data and compare. Report the
   numbers and the plan change; if the production environment differs in
   version, edition, compatibility level, or data volume, state that the
   result is local evidence only.

**Verify:** report MEASURED with before and after logical reads, CPU, and
elapsed time for the same statement, parameters, and data, and the plan
operators that changed; or NOT_RUN with the reason. A plan reviewed without
a comparable run is not a performance improvement.

```sql
SET STATISTICS IO, TIME ON;   -- local or disposable copy only
EXEC sys.sp_executesql N'SELECT Id FROM dbo.Codes WHERE Code = @c;', N'@c varchar(20)', @c = 'C100';
SET STATISTICS IO, TIME OFF;
```

## Query Store history and regressions (sqlserver-query-store)

**Applies when:** a query regressed after a deployment, upgrade, or
statistics change; the top resource consumers over time are needed; or a
plan must be compared, forced, or hinted on SQL Server 2016 or later or
Azure SQL.

**Not when:** Query Store is off and cannot be enabled by the owner (use
cached plan DMVs and a local reproduction instead), or the problem is a
single query on a local database (plans section).

**Version notes:** Query Store exists from SQL Server 2016. SQL Server 2022
enables it for new databases, and Azure SQL Database has it on; earlier
versions default to off. The default capture mode `AUTO` can skip
infrequent, cheap queries. Query Store hints need SQL Server 2022 or Azure
SQL; on replicas, Query Store for secondaries depends on version.

**Steps:**

1. Read the state with a read-only query:
   `SELECT actual_state_desc, desired_state_desc, query_capture_mode_desc,
   max_storage_size_mb, stale_query_threshold_days FROM
   sys.database_query_store_options;`. If it is `READ_ONLY` because storage
   is full, report it; changing it is an owner decision.
2. Find the query by text or hash in `sys.query_store_query_text` and
   `sys.query_store_query`, then compare its plans in
   `sys.query_store_plan` with runtime statistics from
   `sys.query_store_runtime_stats` over the regression window (duration,
   CPU, logical reads, executions).
3. Identify what changed between the good and the bad plan: a new plan
   after a deployment, a statistics update, a compatibility level change,
   or parameter values with different selectivity. Record the plan IDs
   and the intervals compared.
4. Prefer a durable fix: query or index change, statistics, or a code
   change, measured as in the plans section. Forcing a plan
   (`sp_query_store_force_plan`) or adding a Query Store hint is a
   production change that needs approval, monitoring, and a documented
   removal condition.
5. After any fix, compare the same metrics for the same query over a
   comparable window and workload, and check `sys.query_store_plan`
   for failed forcing (`last_force_failure_reason_desc`).

**Verify:** report MEASURED with the query ID, the plan IDs, and before
and after runtime statistics for comparable windows, or NOT_RUN when
Query Store is off or inaccessible; any forced plan or hint is listed with
its approval.

## Index design and tuning (sqlserver-index-tuning)

**Applies when:** adding, changing, consolidating, or removing SQL Server
indexes, reviewing missing-index suggestions, or choosing key order,
included columns, filters, or columnstore for a measured workload.

**Not when:** the slow query has not been measured yet (plans section), or
the index is part of a table design from scratch (data modeling recipe).

**Version notes:** `ONLINE = ON` and online resumable operations need
Enterprise or Developer edition, Azure SQL Database, or Managed Instance;
Express and Standard reject them (error 1712), so index builds block
writes there. Columnstore and data compression availability depends on
version and edition. `sys.dm_db_index_usage_stats` and missing-index
DMVs reset when the instance restarts.

**Steps:**

1. Start from measured queries, not from a DMV list. Missing-index
   suggestions ignore key order, overlap with existing indexes, write cost,
   and only appear for fully optimized plans; a query with a trivial plan
   records none. Treat them as hints to evaluate.
2. List the existing indexes on the table with their key and included
   columns, filters, size, and usage (`sys.dm_db_index_usage_stats` since
   the last restart). Prefer extending or replacing an existing index over
   adding a near-duplicate.
3. Design the key: equality columns first, then range or sort columns;
   include only the columns the query reads; consider a filtered index for
   a small, stable subset. State the write cost: every index adds work to
   inserts, updates of its columns, and deletes, plus storage and
   maintenance time.
4. Measure on a local, disposable, or restored copy: logical reads and the
   plan before and after creating the index for the same statement and
   data, plus the effect on a representative write.
5. Ship the index through the project's migration tool with a name that
   follows the conventions. For large tables, plan the build: `ONLINE = ON`
   only where the edition supports it, `SORT_IN_TEMPDB`, `MAXDOP`, a
   maintenance window, or a resumable build. Applying to a shared or
   production database needs approval.
6. Removing an index needs evidence across a full business cycle (usage
   since the last restart can be short), a check for index hints and
   unique constraints that depend on it, and a script to recreate it.

**Verify:** report MEASURED with before and after logical reads and plans
for the target queries and the write cost on the same data, the migration
command, and the edition check; NOT_RUN where the build was not executed.

## Commands

```bash
sqlcmd -S <server> -d <database> -K ReadOnly -Q "SELECT actual_state_desc, query_capture_mode_desc FROM sys.database_query_store_options;"
sqlcmd -S <local> -d <copy> -i measure.sql     # SET STATISTICS IO, TIME ON around the statement
```

## Pitfalls

- Claiming a speed-up from one run, from a different data volume, or from
  a warm cache compared with a cold one.
- Creating every missing-index suggestion, or an index per query.
- Tuning SQL that an ORM generated without changing the ORM query that
  produces it; the next build reverts the gain.
- `ONLINE = ON` copied from an Enterprise environment to an Express or
  Standard target, where it fails.
- Forced plans left in place after the cause was fixed.
