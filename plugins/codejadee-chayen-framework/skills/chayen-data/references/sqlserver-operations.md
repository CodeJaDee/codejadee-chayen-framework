---
kind: technology
---
# SQL Server backup, recovery, and maintenance

Stack detail for restore drills and routine database maintenance on SQL
Server, with the Azure SQL differences. Read [sql-server.md](sql-server.md)
first and use the backup and restore recipe for the drill procedure.
Restores never overwrite an existing database without approval; drills
restore to a new name on a non-production server.

## Check the repository first

| Area | What to look for |
|---|---|
| Platform | SQL Server on a VM or on-premises (you own backups), Azure SQL Database (automated backups, point-in-time restore to a new database), or Managed Instance |
| Recovery model | `recovery_model_desc` in `sys.databases`: `SIMPLE` has no log backups and no point-in-time restore; `FULL` needs log backups to keep the log in check |
| Backup history | `msdb.dbo.backupset` and `backupmediafamily` (type, start time, size, `has_backup_checksums`, location) |
| Schedulers | SQL Server Agent jobs, maintenance plans, Ola Hallengren scripts, a cloud backup service, or an external scheduler (Express has no Agent) |
| Targets | RPO and RTO from the owners, retention, encryption of backups, copy-off-server or immutable storage |

## Backup and recovery proof (sqlserver-backup-recovery)

**Applies when:** planning or running a SQL Server restore drill, checking
that backups meet RPO and RTO, choosing a recovery model, or writing the
restore runbook for SQL Server or Azure SQL.

**Not when:** provisioning backup infrastructure, high availability, or
disaster recovery topology (out of scope), or the engine is PostgreSQL.

**Version notes:** `BACKUP ... WITH CHECKSUM` and `RESTORE VERIFYONLY` work
on all supported versions; backup compression and encryption depend on
edition and version (not available on Express). Backup to URL needs SQL
Server 2012 SP1 CU2 or later. Azure SQL Database cannot run `BACKUP
DATABASE` to disk; drills use point-in-time or geo-restore to a new
database.

**Steps:**

1. Read the current state, read-only: recovery model, last full,
   differential, and log backups per database from `msdb`, whether they
   have checksums, and where they are stored. Compare the log backup
   interval with the RPO.
2. Confirm the recovery model fits the RPO: point-in-time restore needs
   `FULL` (or `BULK_LOGGED` with limits) and an unbroken log chain that
   starts from a full backup. In `SIMPLE`, `BACKUP LOG` fails (error 4208);
   in `FULL` before any full backup, it fails too (error 4214).
3. Restore to a new database name on a non-production server: `RESTORE
   FILELISTONLY` for the logical names, then `RESTORE DATABASE ... WITH
   MOVE ..., CHECKSUM, NORECOVERY`, apply differential and log backups,
   `STOPAT` for point in time, and `RECOVERY` at the end. Never restore
   over an existing database without an approved request.
4. Prove usability, not just readability: `RESTORE VERIFYONLY` checks that
   the backup is complete and readable; only a completed restore plus
   `DBCC CHECKDB` and application-level checks (row counts of key tables,
   the latest business timestamp, a smoke query) prove the backup.
5. Time each phase (copy, restore, log apply, checks) and compare the total
   with the RTO; record the recovered point and compare it with the RPO.
6. Write the runbook from what actually ran, with the commands, the
   timings, the gaps found, and the cleanup of the drill database.

**Verify:** report MEASURED restore and check durations against the RTO,
the recovered point against the RPO, and PASS or FAIL for `DBCC CHECKDB`
and the application checks on the restored copy; NOT_RUN when no
non-production restore target exists.

```sql
-- Drill: restore to a NEW name, then prove it
RESTORE DATABASE [Sales_drill] FROM DISK = @full
  WITH MOVE N'Sales' TO @dataFile, MOVE N'Sales_log' TO @logFile, CHECKSUM, NORECOVERY;
RESTORE LOG [Sales_drill] FROM DISK = @log WITH STOPAT = @pointInTime, RECOVERY;
DBCC CHECKDB ([Sales_drill]) WITH NO_INFOMSGS;
```

## Routine maintenance (sqlserver-maintenance)

**Applies when:** reviewing or changing SQL Server statistics updates,
index rebuilds or reorganizations, integrity checks, log growth, or
maintenance job schedules, or investigating a regression after a
maintenance change.

**Not when:** a single slow query needs tuning (query tuning reference),
or the platform manages maintenance (Azure SQL Database runs integrity
and some statistics work itself; check before adding jobs).

**Version notes:** `sys.dm_db_stats_properties` and incremental statistics
exist from SQL Server 2012 SP1 and 2014; resumable index rebuild from
2017; `AUTO_UPDATE_STATISTICS` thresholds became dynamic for large tables
by default at compatibility level 130. Express has no SQL Server Agent, so
jobs need an external scheduler.

**Steps:**

1. Read the current state: existing jobs or scripts, their schedules and
   history, `AUTO_UPDATE_STATISTICS` settings, statistics age and
   `modification_counter` from `sys.dm_db_stats_properties`, and
   fragmentation from `sys.dm_db_index_physical_stats` in `LIMITED` mode
   (other modes read much more data; avoid them on production during
   business hours).
2. Prioritize statistics: stale statistics on large or skewed tables cause
   more bad plans than fragmentation does. Update the specific statistics
   with an appropriate sample after large data changes.
3. Decide index maintenance from measurement, not from a fixed
   fragmentation percentage alone: rebuild or reorganize where page density
   or fragmentation affects range scans that matter, and consider the cost
   (log volume, blocking without online support on this edition, replica
   and backup size).
4. Run `DBCC CHECKDB` on a schedule that fits the database size, or on a
   restored copy to offload production, and alert on any error.
5. Change jobs through the project's scripts or deployment tool, with a
   schedule outside peak load; changes to production jobs need approval.
6. Measure before and after on a local or restored copy: the
   fragmentation or statistics state, the maintenance duration and log
   volume, and the query metrics the change is meant to improve.

**Verify:** report MEASURED before and after values (fragmentation or
`modification_counter`, duration, and the affected query metrics), PASS
or FAIL for `DBCC CHECKDB`, and NOT_RUN for any production change that was
only proposed.

## Commands

```bash
sqlcmd -S <server> -d msdb -K ReadOnly -Q "SELECT TOP (20) database_name, type, backup_finish_date, has_backup_checksums FROM dbo.backupset ORDER BY backup_finish_date DESC;"
sqlcmd -S <drill-server> -Q "DBCC CHECKDB ([Sales_drill]) WITH NO_INFOMSGS;"
```

## Pitfalls

- Treating a successful `BACKUP` or `RESTORE VERIFYONLY` as proof that the
  backup restores.
- A `FULL` recovery model without log backups, so the log grows until the
  disk fills.
- Shrinking data files after maintenance, which fragments indexes again.
- Rebuilding every index nightly regardless of size, benefit, and log cost.
- Assuming a drill on LocalDB or Express reflects production timings.
