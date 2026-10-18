---
kind: recipe
capabilities: [CAP-06-008]
---
# Background and scheduled jobs

Implement background and scheduled work with the project's existing job
mechanism. Jobs must be safe to re-run, must not run twice concurrently
across instances unless designed to, must stop cleanly on shutdown, and must
be observable.

## Inputs

- The work to run, its trigger (a schedule, an event, or a request
  offload), and its expected duration and data volume.
- The existing job mechanism and its configuration, and the hosting model
  (single instance, several instances, serverless).
- The failure tolerance: can it be retried, skipped, or must it complete?

## Procedure

1. **Detect the mechanism:** hosted or background services, a job library,
   platform timers, a task queue, or cron calling a command. Follow the
   existing job's structure, registration, and configuration. Never add a
   scheduler library without approval.
2. **Choose the trigger form.**
   - Moving slow work out of a request (PDF generation, emails) becomes an
     enqueued job. The request returns 202 with a status link, or the
     result arrives later.
   - Periodic work becomes a scheduled job, with the schedule held in
     configuration.
3. **Make re-runs safe.**
   - Process in bounded batches.
   - Record progress, for example a watermark or processed flags.
   - Make each item's effect idempotent.
   - A crash mid-run followed by a re-run must not duplicate effects.
4. **Prevent unwanted overlap.**
   - With several instances, use the library's concurrency control or a
     distributed lock (a database lock or lease).
   - Or design the work as partitioned.
   - State which approach you used.
5. **Shut down cleanly.**
   - Honour the cancellation token or signal. Stop taking new work, and
     finish or checkpoint the current batch.
   - Keep scoped dependencies (database contexts) per run, not for the
     service's lifetime.
6. **Handle failures:** a bounded retry with backoff for transient errors,
   and an alert or dead-letter for permanent ones. Never loop forever on a
   poison item.
7. **Make it observable:** log the start and end with counts and duration,
   and emit metrics for failures and lag.
8. **Test:**
   - the job logic as a unit, with an injected clock and data;
   - a re-run is idempotent;
   - cancellation is honoured;
   - the scheduling configuration binds.

## Outputs

- A job implementation in the existing mechanism, with its schedule or
  trigger in configuration, batching, checkpointing, and cancellation.
- The overlap control, chosen and stated.
- The failure handling and observability, plus tests for idempotent re-run
  and cancellation.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | `BackgroundService` with `IServiceScopeFactory` (create a scope per run, because `DbContext` is scoped) and `PeriodicTimer`. Hangfire (`DisableConcurrentExecution`, automatic retries) and Quartz.NET (`DisallowConcurrentExecution`, clustered job store), if used. Azure Functions timer triggers. |
| Nuxt | The existing scheduler or hosting platform's cron. Serverless platforms cap the duration, so split long work. |
| Next.js | No built-in scheduler. Use the platform cron calling a protected route, or a separate worker with BullMQ. Protect the trigger route. |
| Python | Celery and Celery beat (one beat instance only), APScheduler, RQ, Django management commands run by cron, or Django-Q, as the project uses. Use `acks_late` and idempotency for safe retries. |
| SQL Server / PostgreSQL | Lease or lock rows: `sp_getapplock` (SQL Server) or `pg_try_advisory_lock` (PostgreSQL) for single-runner jobs. Batch updates to avoid long locks. |

## Verification

- Running the job twice on the same data gives the same end state, shown by
  a test.
- Cancellation or shutdown is honoured, shown by a test or code citation,
  and scoped dependencies are created per run.
- The overlap control is in place, or the single-instance assumption is
  documented.
- The job uses the existing mechanism. No new scheduler was added without
  approval. The tests pass with the project's command.
