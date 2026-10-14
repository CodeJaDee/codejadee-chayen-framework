---
kind: checklist
---
# Database safety checklist

Apply this checklist before any command runs against a database that is not
local and disposable, and before any destructive change anywhere. It is
advisory: real control comes from database permissions, read-only roles,
replicas, and CI approvals.

## Classify the environment

| Class | Signals | Default stance |
|---|---|---|
| Local disposable | A container or local instance started for this work, Testcontainers, a throwaway database name | Reads and writes allowed |
| Shared development or test | A team server, a shared connection string in `appsettings.Development.json` or `.env.development` | Reads allowed. Writes and migrations need approval. |
| Staging | Host or configuration names containing `stg`, `staging`, `uat`, `preprod` | Treat as production |
| Production | Production configuration, a production host, or any doubt | Read-only, bounded queries only, with access the user provided for this purpose |

When the class is unclear, treat the database as production and ask.

## Read-only practice

- **Use read-only paths:** a read-only login or role, a read replica,
  `ApplicationIntent=ReadOnly` (SQL Server availability group
  secondaries), or `default_transaction_read_only = on` (PostgreSQL).
- **Bound every query:** `TOP` or `LIMIT`, a key range, and a statement
  timeout. Avoid full scans of large tables during peak hours.
- **Plans without side effects:** `EXPLAIN` without `ANALYZE` on
  PostgreSQL for statements that write. `EXPLAIN ANALYZE` executes the
  statement. On SQL Server, use the estimated plan for writes.
- **Return counts and keys,** not personal data. Mask or aggregate where
  values are needed.

## Destructive operation gate

Destructive operations: `DROP`, `TRUNCATE`, `DELETE` or `UPDATE` over more
than a reviewed key range, dropping or renaming columns, narrowing types,
disabling constraints, applying migrations to a shared database, and
restoring over an existing database.

Before asking for approval, prepare:

1. **The exact statements or migration,** with the generated SQL.
2. **The impact:** a read-only count of the affected rows, by table.
3. **A verified restore point:** a recent backup or snapshot, with its time
   and how it was checked.
4. **The rollback path:** a down migration, a reverse script, or the
   restore steps, with the expected duration.
5. **The window and locking:** the expected lock types and duration, and
   whether the application must be paused.

The approval request names the environment explicitly ("Apply to
`orders-prod`?"). Approval for one environment does not extend to another.

## Data handling

- Never print connection strings, passwords, or tokens. Refer to them by
  configuration key, with the value `<redacted>`.
- Never copy production data to a local or shared environment without
  approval and an agreed masking approach.
- Restored copies of production contain production data. They need the
  same access controls, and they are removed after use.
