---
kind: recipe
capabilities: [CAP-09-012]
---
# Backup restore drills

Prove that backups are usable by restoring them to an isolated target,
verifying the data, and measuring the achieved recovery time (RTO) and
recovery point (RPO) against the targets. A backup that has not been
restored is unproven.

## Inputs

- The backup method: native full, differential, and log backups;
  managed point-in-time restore; `pg_dump`; pgBackRest or Barman; or volume
  snapshots, with schedule, retention, encryption, and location.
- The RPO and RTO targets from the user.
- An isolated restore environment: a separate server, instance, or
  database name with access controls equal to production.

## Procedure

1. **Confirm the isolated target.** The restore never targets the
   production server or database name. Write the target name into every
   command, and check it before each step.
2. **Choose the restore point:** the latest backup, or a point in time
   (for example "yesterday 14:00") to test log or WAL replay.
3. **Write the runbook,** each step with its command, the verification
   query, and the expected result:
   1. locate the backup files or the managed restore point, and record
      their timestamps;
   2. start the timer, and restore to the isolated target;
   3. run the engine's integrity check;
   4. compare row counts for key tables with the expected values (from the
      source's read-only counts at the backup time, or from application
      metrics);
   5. find the newest transaction timestamp in the restored data, and
      compute the achieved RPO;
   6. run an application smoke test read-only against the restored copy;
   7. stop the timer when the database is usable, and compute the achieved
      RTO.
4. **Ask for approval** before running the drill: it uses backup storage,
   compute, and a copy of production data.
5. **Run it and record evidence:** commands, outputs, timings, and any
   deviation from the runbook.
6. **Clean up:** remove the restored copy when the drill ends, unless the
   user decides otherwise, because it contains production data.
7. **Report** with the template below, and list the gaps (for example
   missing log backups, an untested encryption key, an RTO above target).

## Outputs

- A drill runbook: restore commands, verification queries with expected
  results, and timing capture.
- A drill report with the measured RTO and RPO, using the template.

## Template

```markdown
# Restore drill report — <database>, <date>

| Item | Value |
|---|---|
| Backup used | <type, timestamp, location> |
| Restore target | <isolated server/database> (not production) |
| Restore point requested | <latest / point in time> |
| Integrity check | <command> → <result> |
| Key table counts | <table: expected / restored> |
| Newest restored transaction | <timestamp> → achieved RPO <duration> (target <RPO>) |
| Time to usable database | <duration> → achieved RTO (target <RTO>) |
| Application smoke test | <result> |
| Clean-up | <restored copy removed at time / kept because> |
| Gaps and actions | <list> |
```

## Technology considerations

| Stack | Consideration |
|---|---|
| SQL Server | `RESTORE DATABASE <DrillName> FROM ... WITH MOVE ..., NORECOVERY`, then log restores with `STOPAT`, then `WITH RECOVERY`. `DBCC CHECKDB` after restore. Azure SQL: point-in-time restore to a new database name. `RESTORE VERIFYONLY` alone is not a drill. |
| PostgreSQL | `pg_restore -d <drill_db>` for logical dumps. For physical backups, restore the base backup and replay WAL with `recovery_target_time` on an isolated instance. Managed services restore to a new instance. Verify with `pg_amcheck` or `amcheck` and counts. |
| Managed services | Restores create new instances. Record the instance name, and the provisioning time as part of the RTO. |

## Verification

- The runbook never targets the production database: every command names
  the isolated target.
- Every step has a verification query or command and an expected result.
- The report gives measured RTO and RPO from timestamps, or marks them
  NOT_RUN when the drill was planned but not executed.
- The drill ran only after approval, and the restored copy's clean-up is
  recorded.
