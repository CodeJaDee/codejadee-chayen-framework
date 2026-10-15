---
kind: technology
---
# PostgreSQL MVCC, locking, and row-level security

Stack detail for the transactions recipe and for tenant isolation on
PostgreSQL. Read [postgresql.md](postgresql.md) first. PostgreSQL is not
SQL Server: readers never block writers here (no read committed snapshot
switch exists or is needed), but DDL locks, serialization failures, and
dead tuples behave differently.

## Check the repository first

| Area | What to look for |
|---|---|
| Isolation | `default_transaction_isolation`, explicit `ISOLATION LEVEL` in code, ORM transaction APIs |
| Retry policy | Handling of SQLSTATE `40001` and `40P01`: EF Core `EnableRetryOnFailure`, SQLAlchemy retry decorators, application loops |
| Locks in use | `FOR UPDATE`, `SKIP LOCKED`, advisory locks, `lock_timeout` and `statement_timeout` in migrations and jobs |
| Tenancy | Tenant columns, `ENABLE ROW LEVEL SECURITY`, policies (`pg_policies`), how the tenant is passed (`set_config`, `SET ROLE`), connection pooling mode |
| Roles | The application role, table owners, `BYPASSRLS`, superuser use by the application |

## MVCC, locking, and isolation (postgres-mvcc-locking)

**Applies when:** choosing transaction boundaries and isolation on
PostgreSQL, fixing lost updates, serialization failures, deadlocks, or lock
waits, building job queues, or running DDL beside live traffic.

**Not when:** the database is SQL Server (its concurrency reference), the
problem is vacuum or bloat (operations reference), or the operation spans
services (architecture guidance).

**Version notes:** default isolation is `READ COMMITTED` on every supported
version; `SERIALIZABLE` uses serializable snapshot isolation (since 9.1).
`SKIP LOCKED` needs 9.5. `ALTER TABLE` lock levels vary by subcommand and
version; check the documentation of the installed major version.

**Steps:**

1. Read the isolation default and the ORM's transaction behaviour. Under
   `READ COMMITTED` each statement sees a new snapshot, so check-then-act
   logic needs a constraint, `INSERT ... ON CONFLICT`, or `SELECT ... FOR
   UPDATE` on the rows it depends on.
2. Use `REPEATABLE READ` or `SERIALIZABLE` only with a whole-transaction
   retry on `40001` (and on deadlock `40P01`), bounded with jitter; the
   loser of a concurrent update is rolled back, never silently merged.
3. For work queues, claim rows with `FOR UPDATE SKIP LOCKED` in short
   transactions; for application-level mutual exclusion, use
   `pg_advisory_xact_lock` with a documented key scheme.
4. Protect live traffic from DDL: set `lock_timeout` (and
   `statement_timeout`) in migrations so a statement blocked behind a long
   transaction fails fast (`55P03`) instead of queueing every query behind
   its lock; retry in a quiet window.
5. Keep transactions short: no network calls or user waits inside, because
   an open transaction also holds back vacuum and blocks DDL.
6. Reproduce the race with two connections on a disposable database and
   show the fix: the conflicting case errors or waits as designed, and the
   retry path succeeds.

**Verify:** report PASS, FAIL, or NOT_RUN for a two-connection race test,
the retry path, and a `lock_timeout` test of the migration, naming the
isolation level used.

## Row-level security (postgres-row-level-security)

**Applies when:** enforcing tenant or ownership isolation inside
PostgreSQL with policies, or reviewing an existing RLS setup and how the
application sets the tenant.

**Not when:** isolation is only in application queries and the user did not
ask to add RLS (review that code instead), or the request is a codebase-wide
security review (security skill).

**Version notes:** RLS exists since 9.5; `FORCE ROW LEVEL SECURITY` applies
policies to the table owner; superusers and `BYPASSRLS` roles always bypass
policies. Supabase and other managed services add their own roles and
helper functions; follow them.

**Steps:**

1. Inventory roles and ownership: the application must not connect as a
   superuser, a `BYPASSRLS` role, or the table owner, or policies do not
   apply to it. Use `FORCE ROW LEVEL SECURITY` when the owner role must be
   filtered too.
2. Enable RLS and write explicit policies with `USING` (rows visible) and
   `WITH CHECK` (rows writable). With RLS enabled and no policy, non-owners
   see nothing (default deny).
3. Pass the tenant safely per transaction: `set_config('app.tenant_id', $1,
   true)` inside the transaction, never string-built SQL. The documentation
   promises `NULL` only for a setting that was never defined; after a
   transaction-local setting has been used in a session, it can read as an
   empty string (observed on PostgreSQL 18), which makes a direct `::int`
   cast fail. Write policies with
   `NULLIF(current_setting('app.tenant_id', true), '')::int`.
4. Check pooling: transaction-local settings work with transaction pooling
   (PgBouncer), session settings leak between clients.
5. Index the tenant columns used by policies and check plans: a policy is a
   predicate added to every query.
6. Test as the application role on a disposable database: each tenant sees
   only its rows, no tenant set returns no rows (not an error), writes for
   another tenant fail (`42501`), and the owner behaves as intended.

**Verify:** report PASS, FAIL, or NOT_RUN for per-tenant reads, the
missing-tenant case, cross-tenant writes, and the owner and superuser cases
run as their real roles.

```sql
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON invoices
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::bigint)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::bigint);
```

## Commands

```bash
psql "$TEST_DATABASE_URL" -c "SELECT pid, wait_event_type, wait_event, state, xact_start FROM pg_stat_activity WHERE datname = current_database();"
psql "$TEST_DATABASE_URL" -c "SELECT * FROM pg_policies;"
```

## Pitfalls

- Testing RLS as a superuser or the table owner and concluding it works.
- `current_setting(...)::int` policies that error after the first request.
- Session-level `SET app.tenant_id` with a transaction pooler.
- Retrying one statement after `40001` instead of the whole transaction.
