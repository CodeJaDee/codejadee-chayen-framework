---
kind: recipe
capabilities: [CAP-03-010]
---
# Resilience design

Design for partial failure. Analyze how each dependency can fail. Then choose
timeouts, retries, circuit breakers, bulkheads, fallbacks, and degradation
per dependency, matched to the business tolerance rather than to a default
template.

## Inputs

- The dependencies of the flow or service: databases, HTTP services,
  brokers, caches, and third parties. Take them from the repository or a
  description.
- The business tolerance per flow: what may degrade, what must fail fast,
  and what must never double-apply.
- Any observed failures, latency data, or incidents.

## Procedure

1. **List the dependencies from evidence.** Use the clients, connection
   strings, and SDK registrations, and cite each one. Note the current
   timeout, retry, and fallback settings, or "none found".
2. **Analyze the failure modes.** For each dependency, list how it fails:
   slow, down, erroring, returning bad data, or throttling. Give the impact
   on the flow, and its likelihood.
3. **Choose the mitigations** per dependency, and justify each value:
   - **Timeout:** always explicit. Base it on the dependency's normal p99
     plus headroom, and keep it within the caller's own budget.
   - **Retry:** only for idempotent operations, or ones with idempotency
     keys. Use exponential backoff with jitter and a bounded attempt count.
     Never stack retries at several layers without accounting for the
     multiplication.
   - **Circuit breaker:** for dependencies whose failure would exhaust
     threads or connections.
   - **Bulkhead or concurrency limit:** to isolate a slow dependency from
     the rest.
   - **Fallback or degradation:** a cached or stale value, a reduced
     feature, or queue-and-continue. Only where the business tolerance
     allows it.
   - **Fail fast:** where degraded data would be worse than an error, for
     example payments.
4. **Check the end-to-end budget.** The sum of timeouts and retries on a
   synchronous path must fit within the caller's timeout and the user-facing
   latency goal.
5. **Make the behaviour observable:** logs and metrics for retries, open
   breakers, and fallbacks taken. A silent fallback hides an outage.
6. **Plan the verification:** fault injection in tests (fake slow or failing
   clients), plus chaos or game-day exercises if the team runs them.
7. **Label the design proposed.** Changes to retry or timeout settings in a
   live system go through review, with rollout planning.

## Outputs

A failure-mode table for the flow, with the proposed policy per dependency, the timing budget, and how each policy is observed and tested.

```text
Failure-mode table — flow: <flow> — status: proposed
| Dependency | Evidence | Failure modes | Impact | Current policy | Proposed policy (timeout / retry / breaker / bulkhead / fallback) | Justification |
End-to-end budget: <sum of worst-case timings> vs <caller timeout / goal>
Observability: <metrics and logs for each policy>
Verification: <fault-injection tests>
```

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | `Microsoft.Extensions.Http.Resilience` (Polly v8 pipelines) via `AddStandardResilienceHandler`, or explicit pipelines on `HttpClient`. EF Core `EnableRetryOnFailure` for transient SQL errors, which conflicts with user-initiated transactions unless an execution strategy is used. |
| Node (Nitro, Elysia, Next.js, Nuxt server) | `AbortController` or `AbortSignal.timeout` on `fetch`. Retry and backoff libraries (`p-retry`). Breakers (`opossum`). Unhandled rejections can crash the process. |
| Python | `httpx` timeouts (no default timeout in `requests`), `tenacity` for retries, and an async semaphore for concurrency limits |
| Angular / React / Vue | Client retries are for idempotent reads only. Show degraded states in the UI. Never retry payments client-side. |
| SQL Server / PostgreSQL | Connection pool exhaustion is the common cascading failure. Set command timeouts. Use failover groups and read replicas with stated consistency. |

## Verification

- Every external dependency in scope has an explicit timeout and a stated
  failure behaviour.
- Retries apply only to idempotent operations, or ones protected by
  idempotency keys. Nested retry multiplication is checked.
- The end-to-end timing budget fits within the caller's timeout.
- Each policy has an observable signal. A fault-injection test is proposed
  or written for each critical dependency.
- The design is labelled proposed.
