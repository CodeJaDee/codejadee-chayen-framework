---
kind: technology
---
# SQL Server locking, deadlocks, and transactions

Stack detail for the transactions recipe on SQL Server and Azure SQL. Read
[sql-server.md](sql-server.md) first. The isolation default is a database
setting: SQL Server and Azure SQL Managed Instance databases start with
`READ_COMMITTED_SNAPSHOT` off, Azure SQL Database starts with it on, and a
test database may differ from production. Read the setting in each environment; never assume it.

## Check the repository first

| Area | What to look for |
|---|---|
| Isolation settings | `is_read_committed_snapshot_on` and `snapshot_isolation_state_desc` in `sys.databases` for each environment |
| Transaction owners | `TransactionScope`, `BeginTransaction`, EF Core `SaveChanges` boundaries, `SqlTransaction`, procedures with `BEGIN TRAN`, distributed transactions |
| Retry policy | EF Core `EnableRetryOnFailure`, `SqlRetryLogicBaseProvider`, Polly, or custom retry on error 1205 |
| Evidence | Deadlock graphs (`system_health` Extended Events on editions that run it, Azure SQL deadlock telemetry), blocking reports, timeouts in logs |
| Hints and settings | `NOLOCK`, `UPDLOCK`, `HOLDLOCK`, `READPAST`, `LOCK_ESCALATION`, `SET LOCK_TIMEOUT` |

## Blocking, lock escalation, and deadlocks (sqlserver-locking-deadlocks)

**Applies when:** SQL Server sessions block each other, deadlocks (error
1205) or lock timeouts (error 1222) occur, or a batch job, backfill, or
large update must run beside live traffic.

**Not when:** choosing the isolation level or transaction boundary for a
new operation (transactions section), or the contention is in an
application cache or message queue rather than the database.

**Version notes:** lock escalation is attempted when one statement holds
about 5,000 locks on one table or index reference; partitioned tables can
escalate per partition with `LOCK_ESCALATION = AUTO`. Optimized locking
(Azure SQL, and SQL Server 2025 Enterprise and Standard; it needs
accelerated database recovery) reduces lock memory and blocking; check
whether the target has it before relying on it.

**Steps:**

1. Collect evidence read-only: current blocking from
   `sys.dm_exec_requests` (`blocking_session_id`, `wait_type`,
   `wait_resource`) and `sys.dm_tran_locks`, or deadlock graphs from the
   existing Extended Events or monitoring. Do not kill sessions or change
   settings without approval.
2. Read each deadlock graph: the resources, the lock modes, and the
   statement order of each participant. The common causes are opposite
   access order on the same rows, a read followed by an update of the same
   row (convert deadlock), and scans caused by missing indexes that lock
   far more rows than needed.
3. Fix the cause: access shared rows in one consistent order, take the
   update lock on the first read (`UPDLOCK` with a reviewed scope) when a
   read leads to an update, add the index that turns a scan into a seek,
   and keep transactions short (no user waits or remote calls inside).
4. Run large changes in batches below the escalation threshold (for
   example 1,000 to 4,000 rows per statement, keyed by a range), each in
   its own short transaction, with a pause and progress logging. A single
   statement over a few thousand rows can take an exclusive table lock and
   block every reader under locking read committed.
5. Handle deadlocks in the application: the victim's whole transaction is
   rolled back, so retry the whole unit of work, bounded, with jitter, and
   only when it is safe to repeat. Never retry only the failed statement.
6. Reproduce on a local or disposable database with two sessions and the
   real statement order, then show the fix removes the deadlock and that
   the retry path works.

**Verify:** report PASS, FAIL, or NOT_RUN for a two-session reproduction
before and after the fix, the lock modes observed in `sys.dm_tran_locks`
for a batch, and a test of the retry path; production evidence is
read-only.

```sql
-- Batched update below the escalation threshold; each loop is its own transaction
DECLARE @from int = 0, @size int = 2000, @max int = (SELECT MAX(Id) FROM dbo.Orders);
WHILE @from < @max
BEGIN
  UPDATE dbo.Orders SET NormalizedEmail = LOWER(Email)
  WHERE Id > @from AND Id <= @from + @size AND NormalizedEmail IS NULL;
  SET @from += @size;
END;
```

## Transactions and isolation (sqlserver-transactions)

**Applies when:** choosing transaction boundaries, isolation levels,
snapshot or read committed snapshot, error and rollback behaviour, retry
strategies, or optimistic concurrency with `rowversion` on SQL Server or
Azure SQL.

**Not when:** diagnosing an existing deadlock or blocking chain (locking
section), or coordinating across services, where a database transaction
cannot span the boundary (architecture or backend messaging guidance).

**Version notes:** `READ_COMMITTED_SNAPSHOT` and `SNAPSHOT` isolation exist
from SQL Server 2005 and keep row versions in `tempdb`, or in the user
database with accelerated database recovery (SQL Server 2019 and later).
Enabling `READ_COMMITTED_SNAPSHOT` changes reader behaviour for the whole
database and needs exclusive access to switch. EF Core's retrying
execution strategy rejects user-initiated transactions unless the whole
unit runs inside `CreateExecutionStrategy().Execute`.

**Steps:**

1. Read the isolation settings of each environment. Under locking read
   committed (snapshot off) readers wait for writers; under read committed
   snapshot they read the last committed version, which can be stale for
   check-then-act logic.
2. Choose the boundary: one unit of work per business operation, opened
   as late and closed as early as possible, with no network calls or user
   interaction inside. In EF Core, one `SaveChanges` call is already one
   transaction; add an explicit transaction only when several calls or raw
   SQL must commit together.
3. Choose the isolation from the invariant: read committed (snapshot or
   locking) for most reads; `rowversion` optimistic concurrency for
   edit-and-save flows; `UPDLOCK, HOLDLOCK` or `SERIALIZABLE` on the
   specific check-then-insert path that must not race; `SNAPSHOT` for
   consistent multi-statement reads, handling update conflict error 3960.
4. Make failures roll back completely: `SET XACT_ABORT ON` in procedures and
   scripts, `TRY`/`CATCH` with `IF @@TRANCOUNT > 0 ROLLBACK`, and
   `using` or `await using` for `SqlTransaction`. Without `XACT_ABORT`, a
   constraint error leaves the transaction open and committable, so a
   later `COMMIT` saves partial work.
5. Retry only transient errors (deadlock 1205, snapshot conflict 3960, and
   the connection errors the driver classifies as transient), bounded, by
   re-running the whole unit of work. With EF Core `EnableRetryOnFailure`,
   wrap the transaction in the execution strategy.
6. Test the concurrency claim with two connections on a local or
   disposable database under the same isolation settings as the target:
   the race the design prevents, the rollback on failure, and the retry.

**Verify:** report PASS, FAIL, or NOT_RUN for a two-connection race test,
a forced-failure rollback test, and a retry test, naming the isolation
settings of the test database and of the target environment.

```sql
-- Check-then-insert without a race: the range lock holds until commit
SET XACT_ABORT ON;
BEGIN TRAN;
IF NOT EXISTS (SELECT 1 FROM dbo.Seats WITH (UPDLOCK, HOLDLOCK) WHERE EventId = @eventId AND SeatNo = @seatNo)
  INSERT dbo.Seats (EventId, SeatNo, CustomerId) VALUES (@eventId, @seatNo, @customerId);
COMMIT;
```

## Commands

```bash
sqlcmd -S <server> -d <database> -K ReadOnly -Q "SELECT is_read_committed_snapshot_on, snapshot_isolation_state_desc FROM sys.databases WHERE name = DB_NAME();"
sqlcmd -S <server> -d <database> -K ReadOnly -Q "SELECT session_id, blocking_session_id, wait_type, wait_resource FROM sys.dm_exec_requests WHERE blocking_session_id <> 0;"
```

## Pitfalls

- `NOLOCK` or `READ UNCOMMITTED` to "fix" blocking: dirty, missing, and
  duplicated rows.
- Switching a production database to read committed snapshot as a quick
  fix without testing check-then-act code and `tempdb` or version-store
  growth.
- Retrying a single statement after a deadlock instead of the whole
  transaction.
- Long transactions around HTTP calls, message publishing, or user input.
- Assuming the test database's isolation default matches production.
