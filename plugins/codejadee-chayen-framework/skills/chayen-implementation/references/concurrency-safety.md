---
kind: recipe
capabilities: [CAP-05-006]
---
# Concurrency safety

Find and fix concurrency defects: races, deadlocks, unsafe shared state,
async misuse, and lost updates. Name the interleaving that causes the defect,
choose the narrowest fix, and prove it with a concurrent test or a stated
stress check.

## Inputs

- The symptom (duplicates, lost updates, hangs, intermittent exceptions) and
  when it happens.
- The code under suspicion, and its runtime model:
  - threads;
  - the async event loop;
  - multiple instances or processes;
  - background workers.
- Data-store behaviour: isolation level, constraints, and concurrency
  tokens.

## Procedure

1. **Identify the shared state:**
   - fields on singletons or static members;
   - module-level variables;
   - caches;
   - database rows written by several requests;
   - files.

   Note the lifetime of each, for example dependency-injection scopes.
2. **Write down the interleaving.** For example: "request A reads stock 1;
   request B reads stock 1; both decrement; stock becomes 0 twice". A
   check-then-act sequence without atomicity is the most common race.
3. **Classify:**
   - in-process race;
   - cross-instance race (needs the database or distributed coordination);
   - deadlock (lock ordering, sync-over-async);
   - async misuse (fire-and-forget, missing `await`);
   - lost update.
4. **Choose the narrowest fix:**
   - Remove the shared mutable state (immutability, a scoped lifetime).
   - Make the operation atomic in the store: a unique constraint, a
     conditional update (`UPDATE ... WHERE version = @v`), or a concurrency
     token. This is the right fix for cross-instance races.
   - Use a thread-safe primitive, or a lock with a consistent order, for
     in-process state.
   - Use idempotency for retried operations.
   - Never add a lock across an `await` that can deadlock, or a global lock
     that serializes the service, without stating the cost.
5. **Prove it.**
   - Write a test that runs the operations concurrently (parallel tasks or
     requests) and asserts the invariant.
   - Or run a stated stress loop.
   - Report the number of runs. A single pass is weak evidence for a race
     fix.
6. **Report:**
   - the hazard and its interleaving;
   - the fix;
   - the residual risks (for example multi-instance deployments);
   - the test evidence.

## Outputs

- The identified hazard, with the interleaving and the shared state
  (`path:line`).
- A fix chosen at the narrowest level (store constraint, atomic operation,
  scoped state, or lock), with its cost.
- A concurrent test or stress check, with its repetition count, or NOT_RUN
  and the command to run it.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | Singleton services holding per-request state. `Dictionary` written concurrently (use `ConcurrentDictionary`, or redesign). `.Result` and `.Wait()` deadlocks. `async void`. EF Core `DbContext` is not thread-safe. Concurrency tokens use `[Timestamp]` or `rowversion`. |
| Node (Nitro, Elysia, Next.js, Nuxt server) | A single thread does not mean no races: interleaving happens at every `await`. Module-level state is shared across requests. Use database constraints for multi-instance safety. |
| Angular / React / Vue | Out-of-order responses (use `switchMap` or cancel stale requests with `AbortController`). Double submits (disable while pending, plus server idempotency). |
| Python | The GIL does not make check-then-act atomic. `asyncio` interleaves at `await`. Django `select_for_update` and `F()` expressions make updates atomic. Celery tasks run concurrently across workers. |
| SQL Server / PostgreSQL | Unique constraints and `UPDATE ... WHERE` conditions are the strongest guards. `SERIALIZABLE` or `SELECT ... FOR UPDATE` (`UPDLOCK` on SQL Server) when needed. Watch deadlock ordering. |

## Verification

- The interleaving is written down, and the shared state is cited.
- A concurrent test asserts the invariant, and was run repeatedly with the
  count reported, or is NOT_RUN with the command.
- Cross-instance races are fixed at the data store or with distributed
  coordination, not with in-process locks alone.
- The change is scoped to the hazard. No unrelated refactoring.
