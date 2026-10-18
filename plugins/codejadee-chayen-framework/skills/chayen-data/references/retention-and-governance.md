---
kind: recipe
capabilities: [CAP-09-011, CAP-18-006]
---
# Data retention, archival, and purge

Implement retention rules supplied by the user's policy: map them to every
store that holds the data, archive or delete with batched jobs that honour
legal holds, run a dry run that shows exactly what would go before any
deletion, and state how backups and replicas are covered. Legal retention
periods always come from the user's policy, never from the agent.
The same policy drives a governance check: classification, ownership,
lineage, retention, residency, and access for each dataset or table.

## Inputs

- The retention policy: data categories, periods, the action (delete,
  anonymize, archive), legal hold rules, and the policy owner.
- The data classification, and every location of the data: tables, files
  and blobs, logs, search indexes, caches, replicas, backups, and
  downstream copies (warehouse, ETL targets).
- The existing job mechanism and the storage tiers available for archives.

## Procedure

1. **Confirm the policy.** If a period or action is missing, ask. Never
   assume a legal period.
2. **Map each rule to stores:** table and column, the date column that
   starts the clock, related child rows, files, and downstream copies. List
   stores that cannot be purged by this job.
3. **Choose the action per rule:**
   - **delete,** respecting foreign key order (children first) or the
     existing cascade rules;
   - **anonymize or pseudonymize,** keeping rows needed for aggregates;
   - **archive** to cheaper storage with a retrieval path, then delete;
   - **partition drop or switch** for time-partitioned tables.
4. **Honour legal holds:** a hold table or flag that every purge query
   excludes, with a test row that proves it.
5. **Dry run first:** an evidence query that returns counts per rule and
   store, and sample keys, for rows that would be affected. Present it and
   ask for approval before any deletion.
6. **Build the purge or archive job** with the existing mechanism: bounded
   batches, idempotent reruns, logs with counts (never content), and a
   dry-run mode that is the default.
7. **Cover backups and replicas:** state whether deletion reaches them,
   when backups expire, and whether a restore must re-apply deletions (for
   example from a deletion log). Follow the policy; do not decide it.
8. **Test:** in a fixture with rows inside and past retention and one row
   under legal hold, the dry run reports the right rows, and the purge
   deletes only rows past retention.

### Data governance check (CAP-18-006)

1. **Read the governance policy** the user provides: classification levels,
   required metadata, retention rules, residency, and access rules.
2. **Inventory datasets and tables** from the schema, the data catalogue, and
   pipeline definitions, including copies (replicas, warehouse tables,
   exports).
3. **Check each one:** classification present and plausible (personal-data
   columns not marked public), an owner, lineage from source to copies,
   retention rule mapped, residency of the storage location, and access
   matching the classification.
4. **Report gaps** per dataset with the rule they break, and propose metadata
   or code changes (classification tags, column comments, catalogue entries),
   labelled advisory. Compliance is not certified by this check.

## Outputs

- Retention rules mapped to tables and stores, with purge or archive jobs.
- Evidence queries showing what would be deleted, run before any deletion
  with approval.
- Notes on backups, replicas, and downstream copies, and the stores this
  job does not cover.
- For a governance check: a gap table per dataset (classification, owner,
  retention, residency, access) and proposed metadata or code changes,
  advisory.

## Technology considerations

| Stack | Consideration |
|---|---|
| SQL Server | Batched `DELETE TOP (n)` loops, partition switching for large time-based tables, temporal table history retention (`HISTORY_RETENTION_PERIOD`), and backup expiry in the backup tooling. |
| PostgreSQL | Batched deletes by key range, `DROP` or `DETACH PARTITION` for partitioned tables, `pg_partman` if installed, and `VACUUM` after large deletes. |
| .NET servers | A hosted service, Hangfire, or Quartz job, as the project uses, with a dry-run setting in configuration. |
| Node and Python servers | The existing scheduler (platform cron, BullMQ, Celery beat, management commands) with the same dry-run default. |
| Object storage | Lifecycle rules for archives (for example Blob or S3 lifecycle policies), set by the platform owner. |

## Verification

- The purge job deletes only rows past retention in the fixture, honours
  the seeded legal hold, and runs as a dry run first, shown by tests
  reported PASS, FAIL, or NOT_RUN with the command.
- Every retention period cited comes from the user's policy, with its
  source named.
- No deletion ran against a shared or production database without approval
  of the dry-run evidence.
- A seeded unclassified personal-data column in the fixture schema is
  reported as a gap.
