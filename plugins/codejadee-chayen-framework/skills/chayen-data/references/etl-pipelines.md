---
kind: recipe
capabilities: [CAP-09-009]
---
# Extract-transform-load pipelines

Design or fix ETL pipelines with the tooling already in use, so that loads
are incremental, reruns are idempotent, late-arriving and deleted records
are handled, schema drift fails loudly, and every run is checked and
observable.

## Inputs

- Sources, targets, volumes, schedule, and freshness needs.
- The tooling in use: SSIS, Azure Data Factory, Airflow, dbt, SQL Agent
  jobs, `pg_cron`, or Python scripts.
- Source change signals available: an `updated_at` column, `rowversion`,
  change tracking or change data capture, or logical replication.

## Procedure

1. **Inventory the current pipeline:** steps, schedule, run history, run
   times, and failure modes. Follow its tooling. Do not introduce an
   orchestrator without approval.
2. **Choose the incremental strategy:**
   - a watermark on a reliable change column (`updated_at` in UTC,
     `rowversion`), with an overlap window for late-arriving rows;
   - change tracking or change data capture where available;
   - a full reload only for small tables, as a stated choice.
3. **Handle deletes explicitly:** soft-delete flags, CDC delete events, or a
   periodic key comparison. State which.
4. **Load idempotently:** land data in a staging table, then upsert into
   the target by business key. Rerunning the same window must produce the
   same target state.
5. **Commit the watermark only after the load succeeds,** in the same
   transaction as the target write where possible.
6. **Guard against schema drift:** select explicit columns, compare the
   source schema with the expected contract, and fail the run with a clear
   message on missing or changed columns.
7. **Recover from failure:** bounded retries for transient errors, resume
   from the last committed watermark, and a rejects table for rows that
   fail transformation.
8. **Check every run:** source and target row counts for the window, the
   rejects count, and the quality rules that apply.
9. **Make runs observable:** a run log with window, counts, duration, and
   status, plus an alert on failure or staleness through the existing
   mechanism.
10. **Test:** on a fixture, a rerun of the same window does not duplicate
    rows, a late-arriving record inside the overlap window is picked up, and
    a deleted source row is handled as designed.

## Outputs

- A pipeline design with the incremental strategy, delete handling, and
  failure handling.
- An implementation following the existing tooling, with data checks and a
  run log.
- Tests for rerun idempotency, late-arriving records, and deletes.

## Technology considerations

| Stack | Consideration |
|---|---|
| SQL Server | Change Tracking or CDC as change sources, `rowversion` watermarks, staging tables with `MERGE ... WITH (HOLDLOCK)` or update-then-insert, SQL Agent or SSIS scheduling. |
| PostgreSQL | `updated_at` maintained by a trigger, logical replication or `wal2json` where allowed, `INSERT ... ON CONFLICT DO UPDATE`, `COPY` for bulk loads, `pg_cron` scheduling. |
| Python | pandas or Polars for transforms, SQLAlchemy for loads, Airflow or Dagster tasks if present. Keep tasks idempotent and parameterized by window. |
| dbt | Incremental models with `is_incremental()`, a `unique_key` for merges, and `dbt test` after each run. |
| Azure Data Factory or SSIS | Watermark tables, and pipeline parameters for the window. Keep secrets in the platform's credential store. |

## Verification

- Rerunning the fixture pipeline does not duplicate rows, shown by counts
  before and after the rerun.
- A late-arriving record inside the overlap window is picked up by the
  watermark logic, in a test.
- The watermark advances only after a successful load, shown by a test or
  code citation.
- Run checks and logs are in place, and tests are reported PASS, FAIL, or
  NOT_RUN with the command.
