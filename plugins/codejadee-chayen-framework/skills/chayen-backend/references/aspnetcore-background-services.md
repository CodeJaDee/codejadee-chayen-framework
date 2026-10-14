---
kind: technology
---
# ASP.NET Core background services

Stack detail for the background jobs recipe in .NET hosts (ASP.NET Core
apps and Worker Service projects). Read
`aspnetcore-webapi.md` first for the version and the
conventions.

## Check the repository first

| Area | What to look for |
|---|---|
| Mechanism | `BackgroundService` or `IHostedService` classes registered with `AddHostedService`, a Worker project (`Sdk="Microsoft.NET.Sdk.Worker"`), Hangfire, Quartz.NET, Coravel, or broker consumers (MassTransit, Azure Service Bus, RabbitMQ clients) |
| Queues | `Channel<T>` in-memory queues, a database job table, or a broker |
| Scheduling | `PeriodicTimer`, `Task.Delay` loops, cron expressions in Hangfire or Quartz, or external schedulers (Kubernetes CronJobs, cloud schedulers) |
| Host settings | `HostOptions` (shutdown timeout, `BackgroundServiceExceptionBehavior`), health checks for workers |
| Scale | How many instances run the app. Every instance runs every hosted service. |

## Background services (aspnet-background-services)

**Applies when:** writing or fixing hosted services, workers, in-process
queues, or scheduled work in a .NET host, including startup, shutdown,
scoping, error handling, and duplicate execution across instances.

**Not when:** choosing a job framework or broker (the architecture skill),
designing message contracts and delivery semantics (the messaging recipe),
or scheduling in infrastructure such as Kubernetes CronJobs (the devops
skill).

**Version notes:** since .NET 6 an unhandled exception in a
`BackgroundService` stops the host by default
(`HostOptions.BackgroundServiceExceptionBehavior`). `PeriodicTimer` needs
.NET 6; `IHostedLifecycleService`, `TimeProvider`, and concurrent service
start options need .NET 8. Startup behaviour of `ExecuteAsync` has changed
between versions: do not rely on its synchronous part running before the
app starts serving.

**Steps:**

1. Use the project's mechanism. A durable job framework or broker already
   in use is the place for work that must survive restarts; do not add one
   without approval.
2. Write the loop around the stopping token:
   `using var timer = new PeriodicTimer(interval);` and
   `while (await timer.WaitForNextTickAsync(stoppingToken)) { ... }`, passing
   `stoppingToken` to every call.
3. Create a scope per unit of work
   (`await using var scope = scopeFactory.CreateAsyncScope();`) and resolve
   scoped services such as a `DbContext` from it. Never inject them into the
   hosted service's constructor.
4. Catch and log exceptions per iteration, with a backoff, unless stopping
   the host is the intended behaviour; an uncaught exception ends the
   process's hosted work and, by default, the host.
5. Keep `StartAsync` short; long initialization goes in `ExecuteAsync` or a
   readiness check.
6. Make work safe to run on several instances: idempotent processing, a
   distributed lock or lease, or the job framework's own locking.
7. In-memory `Channel<T>` queues lose items on restart and are per
   instance; use them only for work that may be lost or is re-derivable.
8. Shut down cleanly: stop taking new work when the token is cancelled and
   finish or abandon the current item within the host's shutdown timeout.
9. Test the unit of work directly with a fake clock (`TimeProvider` or the
   project's clock), and the hosted service through the host with a short
   interval where needed.

**Verify:** tests show one iteration's effect, the behaviour when an
iteration throws (logged and continued, or host stopped as intended), and
that cancellation ends the loop; report PASS, FAIL, or NOT_RUN with the
command.

## Verification commands

```bash
dotnet test --filter "FullyQualifiedName~Worker|FullyQualifiedName~Job"
dotnet run --project <WorkerProject>      # observe start, one tick, and Ctrl+C shutdown; only when running locally is permitted
```

## Pitfalls

- **Scoped services in a hosted service constructor** (captive
  `DbContext`).
- **An exception that silently stops the host** because one iteration
  failed.
- **`Task.Run` fire-and-forget from a request handler** instead of a queue
  or hosted service: the work is lost on shutdown and has no error handling.
- **Duplicate execution** of a scheduled job on every instance.
- **Ignoring the stopping token,** which makes deployments wait for the
  shutdown timeout and then kill work midway.
