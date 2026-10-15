---
kind: technology
---
# SQL Server schema evolution, security, and auditing

Stack detail for schema changes, database permissions, and change history
on SQL Server and Azure SQL. Read [sql-server.md](sql-server.md) first.
Use it with the migration recipe and the database safety checklist: any
change to a shared or production database needs approval, and production
inspection is read-only.

## Check the repository first

| Area | What to look for |
|---|---|
| Migration tool | EF Core migrations, DbUp, FluentMigrator, Flyway, an SSDT or `Microsoft.Build.Sql` `.sqlproj` with `sqlpackage` publish profiles, or hand-run scripts |
| Edition per environment | `SERVERPROPERTY('Edition')` and `EngineEdition`: online operations and some features differ between Express, Standard, Enterprise/Developer, and Azure SQL |
| Principals | Contained users, logins mapped to users, Microsoft Entra principals, application roles, and which principal the application connects as |
| Data protection | TDE, Always Encrypted columns, dynamic data masking, row-level security policies (`sys.security_policies`) |
| Change history | Temporal tables (`temporal_type` in `sys.tables`), audit columns, triggers, change tracking, CDC, SQL Server Audit, ledger tables |

## Online schema changes (sqlserver-schema-evolution)

**Applies when:** adding, altering, renaming, or dropping SQL Server
columns, constraints, tables, or indexes while an application version is
running, or reviewing a generated migration script for SQL Server.

**Not when:** the change is designed but not yet modelled (data modeling
recipe), the work is an EF Core migration mechanic (EF Core migrations
reference, then this section for SQL Server effects), or the target is not
SQL Server.

**Version notes:** adding a `NOT NULL` column with a runtime-constant
default is metadata-only in Enterprise and Developer editions (SQL Server
2012 and later) and Azure SQL; other editions can rewrite the table.
`ONLINE = ON` and resumable operations depend on edition and version.
`sp_rename` takes a schema modification lock and breaks code that uses the
old name. Accelerated database recovery shortens rollback of large
operations from SQL Server 2019.

**Steps:**

1. Classify each operation by its locking and data effect on this edition:
   metadata-only (nullable column, some defaults), size-of-data (type
   change, `NOT NULL` without a constant default on other editions, index
   build), or destructive (drop, narrowing, rename used by running code).
2. Plan expand, migrate, contract across releases: add the new column or
   table, deploy code that writes both, backfill in batches below the lock
   escalation threshold, switch reads, and drop the old structure only in a
   later, approved release.
3. Add constraints in two phases when existing data may violate them:
   `WITH NOCHECK` for new writes, a detection query and an approved
   cleanup, then `WITH CHECK CHECK CONSTRAINT`. A `NOCHECK` constraint is
   untrusted (`is_not_trusted = 1`), so the optimizer ignores it and
   existing bad rows remain.
4. Avoid long schema locks: set `SET LOCK_TIMEOUT` or
   `WAIT_AT_LOW_PRIORITY` for `ALTER` and index operations where
   supported, so a blocked change fails fast instead of queueing every
   reader behind it.
5. Generate the script with the project's tool (EF Core `migrations script
   --idempotent`, `sqlpackage /Action:Script`, DbUp scripts), review the
   SQL Server statements it contains, and keep a rollback script or
   restore point for each destructive step.
6. Apply, roll back, and re-apply on a local or disposable database with
   the target's edition features in mind (Express or LocalDB cannot test
   online operations), and time the size-of-data steps on a realistic
   copy before scheduling production.

**Verify:** report PASS, FAIL, or NOT_RUN for apply, rollback, and
re-apply on a disposable database, constraint trust after the change, and
the edition check for online operations; production application is a
separate approved step, never run from here.

## Permissions and data protection (sqlserver-security)

**Applies when:** designing or reviewing SQL Server principals, roles, and
grants for an application, fixing dynamic SQL injection in T-SQL, or
configuring row-level security, dynamic data masking, Always Encrypted,
or TDE in a project that uses or requests them.

**Not when:** reviewing application code for injection or secrets across
the codebase (security skill), or provisioning servers, firewalls, and
cloud identity (out of scope).

**Version notes:** contained database users exist from SQL Server 2012
and are the norm in Azure SQL Database; Microsoft Entra authentication
applies to Azure SQL and SQL Server 2022 and later. Row-level security
and dynamic data masking need SQL Server 2016; Always Encrypted with
secure enclaves needs 2019 and enclave configuration. Microsoft.Data.SqlClient
4.0 and later encrypt connections by default.

**Steps:**

1. Inventory read-only: the principal the application uses, its role
   memberships (`sys.database_role_members`), explicit grants
   (`sys.database_permissions`), and any `db_owner` or `sysadmin`
   membership. Never print passwords or connection strings.
2. Apply least privilege: separate principals for the application, for
   migrations, and for reporting; grant on schemas or procedures rather
   than `db_owner`; deny nothing the design does not need. A reader role
   can still be over-broad when the database holds sensitive tables.
3. Keep data out of code paths: parameterize every query in the
   application and use `sp_executesql` with parameters in T-SQL; dynamic
   SQL inside a procedure runs with the caller's permissions, so it also
   breaks ownership-chaining-based designs.
4. Add data protection only where requested or required: row-level
   security predicates for tenant isolation (test them with each tenant's
   principal), dynamic data masking as a presentation control (it is not
   encryption), Always Encrypted for columns the server must not read
   (queries on them are limited), TDE for data at rest.
5. Test the permission model on a local or disposable database: create
   users `WITHOUT LOGIN`, `EXECUTE AS USER`, and assert that allowed
   operations succeed and denied ones fail with error 229 or 262.
6. Deliver grants as reviewed scripts through the migration or
   deployment tool; applying them to shared environments needs approval.

**Verify:** report PASS, FAIL, or NOT_RUN for permission tests that
impersonate each principal (allowed and denied operations), an injection
test of any dynamic SQL, and per-tenant row-level security tests.

```sql
CREATE ROLE app_orders;
GRANT SELECT, INSERT, UPDATE ON SCHEMA::sales TO app_orders;
GRANT EXECUTE ON OBJECT::sales.PlaceOrder TO app_orders;
-- Test: CREATE USER test_app WITHOUT LOGIN; ALTER ROLE app_orders ADD MEMBER test_app;
--       EXECUTE AS USER = 'test_app'; ... ; REVERT;
```

## Auditing and temporal history (sqlserver-auditing-temporal)

**Applies when:** a SQL Server or Azure SQL project needs row history,
point-in-time queries, audit trails of who changed what, change tracking
for synchronization, or tamper evidence.

**Not when:** the requirement is application event logging or security
logging (security or observability guidance), or retention and purge of
existing history (retention recipe).

**Version notes:** system-versioned temporal tables need SQL Server 2016;
their period columns are in UTC. Ledger tables need SQL Server 2022 or
Azure SQL. SQL Server Audit database-level specifications are available in
all editions from SQL Server 2016 SP1. Change data capture needs SQL
Server Agent on SQL Server (not in Express); Azure SQL uses its own
scheduler.

**Steps:**

1. Turn the request into questions: row history for queries "as of" a
   time, who made each change, who read data, or proof that history was
   not altered. Each needs a different feature; one does not cover the
   others.
2. For row history, use system-versioned temporal tables: add the period
   columns and history table through the project's migration tool, query
   with `FOR SYSTEM_TIME AS OF` (UTC), and plan history retention. A
   temporal table records no user; add an actor column set by the
   application or `SESSION_CONTEXT` when "who" matters.
3. For access and change auditing, use SQL Server Audit or Azure SQL
   auditing with a target the owners control. Audit configuration is an
   operations change that needs approval.
4. Plan schema changes on temporal tables: most `ALTER TABLE` statements
   propagate to the history table, but some (dropping the table,
   incompatible changes) require turning `SYSTEM_VERSIONING` off in the
   same transaction, which creates a gap unless scripted carefully.
5. Test on a local or disposable database: an update creates a history
   row, `AS OF` returns the earlier value, the actor column is filled,
   and the expected statements are blocked (dropping a system-versioned
   table fails with error 13552).

**Verify:** report PASS, FAIL, or NOT_RUN for the history, as-of, actor,
and blocked-operation tests, with the migration commands; audit target
configuration in shared environments is approval-only.

## Commands

```bash
dotnet ef migrations script --idempotent -o migration.sql          # EF Core projects
sqlpackage /Action:Script /SourceFile:Database.dacpac /TargetConnectionString:<redacted> /OutputPath:deploy.sql
sqlcmd -S <server> -d <database> -K ReadOnly -Q "SELECT name, is_not_trusted FROM sys.foreign_keys WHERE is_not_trusted = 1;"
```

## Pitfalls

- A migration that renames and retypes a column in one step, which tools
  can script as drop and add.
- Constraints left `WITH NOCHECK` after a migration, silently untrusted.
- The application connecting as `db_owner` or `sa`.
- Treating dynamic data masking as a security boundary.
- Temporal history growing without a retention policy.
