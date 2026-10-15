---
kind: technology
---
# PostgreSQL vacuum, maintenance, backup, and recovery

Stack detail for maintenance and restore drills on PostgreSQL, including
managed services. Read [postgresql.md](postgresql.md) first and use the
backup and restore recipe for the drill procedure. Restores go to a new
database or instance; nothing overwrites an existing database without
approval.

## Check the repository first

| Area | What to look for |
|---|---|
| Platform | Self-managed, or a managed service (RDS/Aurora, Azure Database for PostgreSQL, Cloud SQL, Supabase, Neon) that owns backups, WAL, and some settings |
| Autovacuum | `autovacuum` settings and per-table overrides (`reloptions`), `pg_stat_user_tables` (`n_dead_tup`, last vacuum and analyze) |
| Long transactions | `pg_stat_activity.xact_start`, idle-in-transaction sessions, replication slots, prepared transactions |
| Backups | `pg_dump` jobs, pgBackRest, Barman, WAL-G, `pg_basebackup`, `archive_command`, or the provider's point-in-time restore; retention; restore runbooks |
| Targets | RPO and RTO from the owners; required roles and extensions on a restore target |

## Vacuum, analyze, and bloat (postgres-vacuum-maintenance)

**Applies when:** dead tuples, table or index bloat, stale statistics,
transaction ID wraparound warnings, or autovacuum settings need review or
change on PostgreSQL, or plans regress after large data changes.

**Not when:** a single query needs tuning with no maintenance cause (query
tuning reference), or the managed service controls the setting and the
owner has not asked for a change.

**Version notes:** autovacuum insert-triggered vacuums 13; `VACUUM
(PARALLEL)` index vacuuming 13; `reltuples` is `-1` for never-analyzed
tables from 14; `pg_stat_progress_vacuum` and wraparound safeguards differ
by version. `VACUUM FULL` and `CLUSTER` take an `ACCESS EXCLUSIVE` lock on
every version.

**Steps:**

1. Read the state: dead tuples and last (auto)vacuum and analyze per table,
   the oldest open transaction and replication slot, and
   `age(datfrozenxid)`. Run statistics queries read-only.
2. Remove what blocks cleanup first: an open snapshot (long transaction,
   idle in transaction, abandoned replication slot, prepared transaction)
   keeps dead rows "not yet removable" however often vacuum runs.
3. Tune autovacuum per hot table (`autovacuum_vacuum_scale_factor`,
   `autovacuum_analyze_scale_factor`, cost limits) rather than globally, and
   `ANALYZE` after bulk loads so the planner sees the new data.
4. Reclaim space only when measured bloat matters: `VACUUM` makes space
   reusable without heavy locks; `VACUUM FULL` or `CLUSTER` rewrite the table
   under an exclusive lock and need a window and approval; extensions such
   as `pg_repack` need the owner's approval to install.
5. Keep maintenance commands outside transactions: `VACUUM` cannot run in a
   transaction block, which matters for migration tools and scripts.
6. Measure before and after on a test copy or with the production numbers
   the owner provided: dead tuples, table size, and the affected query.

**Verify:** report MEASURED dead tuples, sizes, and query metrics before and
after, PASS or FAIL for the blocker check, and NOT_RUN for changes only
proposed for shared environments.

## Backup and point-in-time recovery (postgres-backup-recovery)

**Applies when:** planning or running a PostgreSQL restore drill, choosing
logical versus physical backups, checking RPO and RTO, or writing the
restore runbook, including managed-service restores.

**Not when:** provisioning replication, high availability, or backup
infrastructure (out of scope), or the engine is SQL Server.

**Version notes:** `pg_amcheck` 14; incremental base backups with
`pg_basebackup --incremental` and `pg_combinebackup` 17. `pg_dump` output
restores into the same or a newer major version; physical backups need the
same major version. Managed services restore to a new instance.

**Steps:**

1. Read the current setup: backup type, schedule, WAL archiving, retention,
   and where backups live. Compare the WAL or snapshot interval with the RPO.
2. Choose the method by need: logical (`pg_dump -Fc`, `pg_restore`) for a
   database or schema copy; physical base backup plus WAL archive (or the
   provider's point-in-time restore) for whole-cluster recovery to a time.
3. Restore globals too: `pg_dump` does not include roles or tablespaces, so
   grants, owners, and RLS policies need `pg_dumpall --globals-only` or the
   roles created first on the target.
4. Restore into a new database or instance on non-production
   infrastructure, never over an existing one without an approved request.
5. Prove usability: row counts and checksums of key tables, `pg_amcheck`,
   the latest business timestamp, and application smoke queries.
6. Time each phase against the RTO, record the recovered point against the
   RPO, and write the runbook from what actually ran.

**Verify:** report MEASURED restore and check durations against the RTO,
the recovered point against the RPO, and PASS or FAIL for `pg_amcheck` and
application checks; NOT_RUN when no non-production target exists.

```bash
pg_dumpall --globals-only -f globals.sql                   # roles; review before applying anywhere
pg_dump -Fc -d "$SOURCE_URL" -f app.dump                    # approval required for non-local sources
createdb restore_drill && pg_restore -d restore_drill --exit-on-error app.dump
pg_amcheck -d restore_drill --install-missing --heapallindexed
```

## Commands

```bash
psql "$TEST_DATABASE_URL" -c "SELECT relname, n_dead_tup, last_autovacuum, last_autoanalyze FROM pg_stat_user_tables ORDER BY n_dead_tup DESC LIMIT 20;"
psql "$TEST_DATABASE_URL" -c "SELECT pid, state, xact_start FROM pg_stat_activity WHERE xact_start < now() - interval '5 minutes';"
```

## Pitfalls

- Vacuum tuned repeatedly while an idle-in-transaction session blocks it.
- `VACUUM FULL` on a busy table to "fix" bloat.
- A `pg_dump` that restores without the roles its grants and policies need.
- Treating a successful dump as proof that it restores.
