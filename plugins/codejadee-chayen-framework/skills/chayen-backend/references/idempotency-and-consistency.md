---
kind: recipe
capabilities: [CAP-06-010, CAP-19-006]
---
# Idempotency and safe retries

Make operations safe to retry, so that a repeated request or message has
exactly one effect:
- idempotency keys for non-idempotent endpoints;
- deduplication for consumers;
- conditional writes for updates;
- retry policies that never repeat non-idempotent effects.

Money movements add stricter rules: a double-entry ledger with balanced
entries, exact decimal amounts, and reconciliation with providers.

## Inputs

- The operations that clients, proxies, jobs, or brokers may retry, such as
  payments, orders, emails, and external calls.
- The available storage for keys or deduplication (the main database or a
  cache), and the expected retry window.
- The current behaviour, including any observed duplicates.

## Procedure

1. **Classify each operation.**
   - Naturally idempotent: GET, PUT to a full state, DELETE by ID.
   - Needs protection: POST creating resources, side effects such as
     charges, emails, or external calls, and increments.
2. **Endpoints: add an idempotency key.**
   1. Accept an `Idempotency-Key` header (or the house equivalent),
      scoped per client or user and operation.
   2. Store the key with a request fingerprint and the response, under a
      unique constraint.
   3. On a repeat, return the stored response.
   4. On a same key with a different payload, return 409 or 422.
   5. Expire keys after the retry window.
3. **Make the check atomic.** The insert of the key and the business write
   happen in one transaction. Or the key insert happens first, with a unique
   constraint, so that concurrent duplicates resolve to one winner.
4. **Consumers: deduplicate.** Use an inbox table keyed by message ID, or
   naturally idempotent writes (upsert by business key). This aligns with
   the messaging recipe.
5. **Updates: conditional writes.** Use an `If-Match` ETag or a row version
   concurrency token, so that a retried stale update fails with 409 or 412
   instead of overwriting.
6. **Retry policy rules.**
   - Retry only idempotent or key-protected operations.
   - Use bounded attempts with backoff.
   - Retry at one layer only.
   - Pass the same idempotency key to downstream providers that support it.
7. **Test:**
   - the same request twice gives one effect and the same response;
   - concurrent duplicates give one effect;
   - a same key with a different payload is rejected;
   - a stale conditional update is rejected.

### Payments and ledger consistency (CAP-19-006)

1. **Inspect the current model:** how balances and payments are stored,
   amount types, currency handling, and the payment provider integration.
2. **Use exact amounts:** decimal types (or integer minor units) with the
   currency stored per amount; never floating point; rounding rules
   explicit and tested.
3. **Model a double-entry ledger:** each transaction has entries whose
   debits and credits balance per currency, enforced in code and, where
   possible, by the database (a check or a constraint trigger); entries are
   append-only, and corrections are reversing entries.
4. **Make payment operations idempotent** with the idempotency procedure
   above, passing the key to the provider.
5. **Reconcile:** a scheduled job compares ledger entries with provider
   reports or settlement files, flags mismatches for humans, and never
   auto-corrects money.
6. **Keep an audit trail:** who or what created each entry, when, and with
   which request or provider reference.
7. **Test the invariants:** unbalanced transactions are rejected, amounts
   use decimal types, retries create one payment, and reconciliation flags
   a seeded mismatch.

## Outputs

- The idempotency mechanism (key scope, storage, fingerprint, expiry,
  response replay) or the consumer deduplication, plus conditional writes
  where updates race.
- The retry policy rules applied to the client, job, and consumer.
- Tests for repeated and concurrent duplicates, mismatched payloads, and
  stale updates.
- For money: a ledger and transaction design with invariants (balanced
  entries, no float money), and a reconciliation job design with tests for
  the invariants.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | Middleware or an endpoint filter reading `Idempotency-Key`, backed by an EF Core table with a unique index. Concurrency tokens with `[Timestamp]` or `rowversion`. Output caching is **not** idempotency. |
| Nitro / Nuxt / Next.js / Elysia | A per-route middleware or wrapper storing keys in the main database (or Redis with `SET NX` and an expiry, noting its durability). Serverless instances share nothing in memory, so never use in-process maps. |
| Python (FastAPI, Django, Flask) | A dependency or decorator storing keys with a unique constraint. Django `get_or_create` inside `transaction.atomic`, plus a unique constraint. Celery tasks with `acks_late` need idempotent bodies. |
| SQL Server / PostgreSQL | Unique constraints are the real guard. Use `INSERT ... ON CONFLICT DO NOTHING` (PostgreSQL) or `MERGE`, or catch duplicate-key errors 2627 and 2601 (SQL Server), for single-winner semantics. |
| Payment providers | Pass the idempotency key through to the provider API where supported (for example Stripe's `Idempotency-Key`). |

## Verification

- A test sends the same request twice, sequentially and concurrently, and
  observes exactly one effect, with the stored response replayed.
- The key uniqueness is enforced by the data store, not by an in-process
  check.
- Retries in the code apply only to idempotent or key-protected operations,
  at a single layer.
- The tests pass with the project's command.
- The fixture ledger rejects an unbalanced transaction and uses decimal
  types for all amounts.
