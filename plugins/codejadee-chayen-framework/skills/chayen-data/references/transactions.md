---
kind: recipe
capabilities: [CAP-09-005]
---
# Transactions, isolation, and concurrency control

Choose transaction boundaries, isolation levels, and concurrency control so
that stated invariants hold under concurrent use, and prove it with a
concurrent test against a real database engine.

## Inputs

- The operations involved, and the invariants they must preserve (for
  example "a seat is booked at most once", "a balance never goes
  negative").
- The expected concurrency (how many simultaneous writers on the same
  rows).
- The engine, its isolation settings, and the data-access library.

## Procedure

1. **Write the invariants** as checkable statements, and the race that
   breaks each one (for example: two requests both read "seat free", both
   insert a booking).
2. **Define the unit of work:** every write that must succeed or fail
   together. Keep it short. No HTTP calls, emails, or message publishing
   inside the transaction: use an outbox for messages.
3. **Choose the control for each invariant,** strongest and simplest
   first:

   | Control | Use when | Notes |
   |---|---|---|
   | Unique or exclusion constraint | The invariant is "at most one" of something | The database rejects the second write. Map the violation to a domain error. |
   | Atomic conditional update | A counter or balance changes (`UPDATE ... SET qty = qty - 1 WHERE id = @id AND qty >= 1`) | Check the affected row count |
   | Optimistic concurrency | Edits conflict rarely | A version column, `rowversion` (SQL Server), or `xmin` (PostgreSQL). Report the conflict to the user. |
   | Pessimistic row lock | Conflicts are frequent and the read decides the write | `SELECT ... FOR UPDATE` (PostgreSQL), `WITH (UPDLOCK, HOLDLOCK)` (SQL Server). Lock in a consistent order to avoid deadlocks. |
   | Higher isolation | The invariant spans rows that no single lock covers (write skew) | `SERIALIZABLE`, with a retry on serialization failure |

4. **State the isolation level** and why. Know the defaults: PostgreSQL
   READ COMMITTED, and SQL Server READ COMMITTED with locking, or with row
   versioning when RCSI is on.
5. **Retry safely:** retry the whole transaction on deadlocks (SQL Server
   1205, PostgreSQL `40P01`) and serialization failures (`40001`), with
   bounded attempts and backoff. The transaction body must be safe to
   repeat.
6. **Implement with the project's mechanism,** and keep the transaction
   scope visible in one place (a handler, a unit of work, a service
   method).
7. **Test concurrently against the real engine:** start several tasks or
   threads that run the operation on the same rows at once, then assert the
   invariant (for example exactly one booking). Use Testcontainers or a
   disposable database. Mark the test NOT_RUN if no engine is available.

## Outputs

- A transaction design: boundaries, isolation level or concurrency tokens,
  locks, and retry policy, with the justification per invariant.
- The implementation in the project's data-access style.
- A concurrency test demonstrating that the invariant holds.

## Technology considerations

| Stack | Consideration |
|---|---|
| EF Core | `SaveChanges` is atomic per call. `BeginTransactionAsync` for several calls. With a retrying execution strategy, wrap the whole transaction in `strategy.ExecuteAsync`. Concurrency tokens raise `DbUpdateConcurrencyException`. |
| Dapper or ADO.NET | Pass the same connection and `IDbTransaction` to every command. Avoid `TransactionScope` across connections, which can escalate to a distributed transaction. |
| SQLAlchemy | `with session.begin():`, `with_for_update()`, and `execution_options(isolation_level=...)`. |
| Django | `transaction.atomic()`, `select_for_update()` inside it, and `F()` expressions for atomic updates. |
| Prisma or Drizzle | Interactive `$transaction` with an `isolationLevel` option, or `db.transaction`. Prisma retries on `P2034` write conflicts. |
| SQL Server | READ COMMITTED with locking unless RCSI is on. `SNAPSHOT` needs `ALLOW_SNAPSHOT_ISOLATION`. Use the `UPDLOCK, HOLDLOCK` hints for check-then-insert. |
| PostgreSQL | `SERIALIZABLE` uses SSI and fails with `40001` rather than blocking. `SKIP LOCKED` for queue-style work. |

## Verification

- Each invariant has a named control and a stated isolation level.
- A concurrent test against the real engine shows the invariant holding
  (for example, no double booking), or is NOT_RUN with the command.
- No external call happens inside a transaction, shown by a code citation.
- Retries cover the whole transaction and are bounded.
