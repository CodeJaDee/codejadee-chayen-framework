---
kind: technology
---
# ASP.NET Core performance levers

Stack detail for ASP.NET Core services. Measure first with the .NET
section of [runtime-tools.md](runtime-tools.md) and the matching recipe;
this file lists the framework levers to test once a bottleneck is
measured. A lever applied without a before and after measurement is a
hypothesis, not an optimization.

## Check the repository first

| Area | What to look for |
|---|---|
| Version | `<TargetFramework>` and `global.json`. Newer runtimes change GC and JIT behaviour, so compare like with like. |
| Hot path | The endpoint or handler named by the measurement, its data access (EF Core, Dapper), outgoing HTTP calls, and serialization |
| Existing levers | Response compression, output caching (`AddOutputCache`), response caching, `IMemoryCache`, `IDistributedCache`, `HybridCache`, rate limiting, EF Core compiled queries or `DbContext` pooling, JSON source generation |
| Hosting | Kestrel limits, reverse proxy, container CPU and memory limits, GC settings (`ServerGarbageCollector`, `ConcurrentGarbageCollection`), ReadyToRun or Native AOT publishing |
| Telemetry | OpenTelemetry or Application Insights request durations, `dotnet-counters` output, existing load test scripts |

## ASP.NET Core performance (aspnet-performance)

**Applies when:** a measured ASP.NET Core latency, throughput, allocation,
or startup problem needs a framework-level fix: blocking calls, thread pool
starvation, serialization cost, caching, data access shape, connection
use, or hosting settings.

**Not when:** nothing has been measured yet (start with the baseline and
profiling recipe), a single SQL query is slow (the data skill), or the
problem is browser bundle size or rendering (the frontend skill).

**Version notes:** output caching and rate limiting middleware need .NET 7;
`HybridCache` shipped with .NET 9 as the `Microsoft.Extensions.Caching.Hybrid`
package (check which frameworks the package version supports); request
timeouts need .NET 8; Native AOT for minimal APIs
starts with .NET 8 and limits which libraries can be used. Defaults such as
GC behaviour in containers differ between versions; record the version with
every measurement.

**Steps:**

1. Start from the measurement: the endpoint, percentile, load, and the
   counter or trace that shows where time or memory goes. Without one, stop
   and measure.
2. Thread pool starvation (rising thread pool queue length, low CPU, slow
   responses): remove sync-over-async (`.Result`, `.Wait()`), synchronous
   I/O, and long `lock` sections on request paths. Do not raise minimum
   thread counts as the fix.
3. Outgoing HTTP: use `IHttpClientFactory`; never create an `HttpClient`
   per request. Set timeouts and pass the request's cancellation token.
4. Data access: project only needed columns, `AsNoTracking` for reads,
   remove N+1 queries, page large results, and consider `DbContext`
   pooling or compiled queries only when the profile shows their cost.
5. Serialization: reuse one `JsonSerializerOptions` instance, stream large
   responses instead of buffering, and use JSON source generation where the
   project targets trimming or AOT.
6. Caching: cache only what the measurement shows is repeated and
   expensive, with explicit expiry, size limits, keys that include
   everything that varies the result (user, tenant, culture, query), and an
   invalidation plan. Output caching serves whole responses; data caching
   (`IMemoryCache`, `IDistributedCache`, `HybridCache`) serves values.
7. Logging and allocations: avoid string interpolation in hot log
   statements (use templates or the `LoggerMessage` source generator) and
   large temporary buffers on every request.
8. Hosting: compare GC modes, container limits, compression, and
   ReadyToRun or AOT only with a startup or throughput measurement for each.
9. Change one lever at a time, re-run the same measurement, and keep the
   change only if it improves the target metric without breaking tests.

**Verify:** before and after numbers from the same command, environment,
data, and run count (percentiles, not one timing), plus the functional
tests; report each as MEASURED, or the claim as HYPOTHESIS, and tests as
PASS, FAIL, or NOT_RUN.

## Verification commands

```bash
dotnet-counters monitor -p <pid> --counters System.Runtime,Microsoft.AspNetCore.Hosting
dotnet-trace collect -p <pid> --duration 00:00:30
dotnet run -c Release --project <Benchmarks>        # BenchmarkDotNet, when the project has one
```

Run these only against local or approved environments.

## Pitfalls

- **Caching a response that varies by user** without the user in the key,
  which leaks data between users.
- **Raising thread pool minimums** to hide blocking calls.
- **Measuring Debug builds,** or comparing runs on different machines or
  runtime versions.
- **Switching API style or framework for speed** without a measurement and
  approval.
- **Output caching authenticated responses** without checking the policy's
  rules for authorization and cookies.
