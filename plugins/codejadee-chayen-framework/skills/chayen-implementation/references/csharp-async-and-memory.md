---
kind: technology
---
# C# async, concurrency, memory, and disposal

Stack detail for C# changes involving `async`/`await`, cancellation,
parallel work, shared state, `IDisposable`, and allocations. Use it with the
concurrency safety or bug fix recipe. It applies to any C# project.

## Check the repository first

| Area | What to look for |
|---|---|
| Version | `<TargetFramework(s)>` and `<LangVersion>`; library projects may target `netstandard2.0`, which lacks newer APIs |
| App model | ASP.NET Core and workers (no synchronization context), WPF, WinForms, or MAUI (UI thread context), or a library used by any of them |
| Conventions | `ConfigureAwait(false)` in libraries, `ValueTask` usage, `CancellationToken` parameter naming and position, `TimeProvider` or a clock abstraction |
| Analyzers | CA2007, CA2016, CA1849, CA2000, CA1001, CA2213, and Microsoft.VisualStudio.Threading analyzers (VSTHRD) if referenced; their severities in `.editorconfig` |
| Shared state | `static` mutable fields, singletons, caches, `lock` statements, `ConcurrentDictionary`, `SemaphoreSlim`, `Channel<T>` |

## Async and concurrency (csharp-async-concurrency)

**Applies when:** writing or fixing C# async code, cancellation, timeouts,
parallel or concurrent work, thread safety of shared state, deadlocks, or
thread pool starvation.

**Not when:** a race between requests that needs a database transaction or
lock (the data skill's transactions recipe), or a distributed concurrency
design across services (the architecture skill).

**Version notes:** `Parallel.ForEachAsync` and `PeriodicTimer` need .NET 6;
`TimeProvider` and `ConfigureAwaitOptions` need .NET 8; the
`System.Threading.Lock` type needs .NET 9 with C# 13; `Task.WhenEach` needs
.NET 9. `IAsyncEnumerable<T>` and `await using` need C# 8.

**Steps:**

1. Make the call chain async end to end. Remove `.Result`, `.Wait()`, and
   `.GetAwaiter().GetResult()` on async work; they block threads and can
   deadlock under a synchronization context.
2. Accept a `CancellationToken` (last parameter, by convention) and pass it
   to every call that takes one. Use
   `CancellationTokenSource.CreateLinkedTokenSource` plus `CancelAfter` for
   timeouts, and dispose the source.
3. No `async void` except event handlers. No fire-and-forget `Task.Run`
   for work that must complete; hand it to a queue or hosted service.
4. Follow the project's `ConfigureAwait` convention: libraries often use
   `ConfigureAwait(false)`; app code in ASP.NET Core does not need it; UI
   code must return to the UI thread where it updates controls.
5. Run independent operations concurrently with `Task.WhenAll`; bound
   parallelism with `Parallel.ForEachAsync` (`MaxDegreeOfParallelism`) or
   `SemaphoreSlim`, never unbounded `Select(async ...)` over large inputs.
6. Protect shared mutable state: prefer immutability or confinement, then
   `ConcurrentDictionary` (its value factory may run more than once),
   `Interlocked`, or a `lock` (never `await` inside a `lock`; use
   `SemaphoreSlim` for async critical sections).
7. Await a `ValueTask` exactly once; convert with `AsTask()` if it must be
   awaited more than once.
8. Make time and delays testable through `TimeProvider` or the project's
   clock; test cancellation and concurrent calls explicitly.

**Verify:** tests cover cancellation (the operation stops and observes the
token) and concurrent access (a stress test or a deterministic
interleaving), the build shows no new CA2016 or CA1849 warnings where those
rules are enabled, and the full test suite passes; report PASS, FAIL, or
NOT_RUN with the command.

## Memory and disposal (csharp-memory-disposal)

**Applies when:** C# code creates or owns disposable resources (streams,
connections, `HttpClient`, timers, `CancellationTokenSource`), leaks memory
or handles, allocates heavily on a hot path, or implements `IDisposable` or
`IAsyncDisposable`.

**Not when:** diagnosing memory growth in a running service from dumps and
counters (the performance skill's memory leak recipe), or a database
connection pool exhausted by long transactions (the data skill).

**Version notes:** `using` declarations and `IAsyncDisposable` with
`await using` need C# 8; `ObjectDisposedException.ThrowIf` needs .NET 7;
`IHttpClientFactory` needs `Microsoft.Extensions.Http`. Span-based APIs vary
by target framework; `netstandard2.0` needs the `System.Memory` package.

**Steps:**

1. Establish ownership: whoever creates a disposable disposes it; objects
   resolved from dependency injection are disposed by the container, not by
   the consumer.
2. Dispose with `using` or `await using` declarations, including on error
   paths; prefer `await using` for types that implement `IAsyncDisposable`.
3. `HttpClient`: use `IHttpClientFactory` or one long-lived instance with
   `PooledConnectionLifetime` set; never create and dispose one per call.
4. Remove leaks from long-lived references: unsubscribe event handlers,
   bound static caches (size and expiry), stop and dispose timers, dispose
   `CancellationTokenSource` instances you create.
5. Implement `IDisposable` only for types that own disposables or
   unmanaged handles: dispose owned fields, make `Dispose` idempotent,
   throw `ObjectDisposedException` after disposal, and use `SafeHandle`
   rather than finalizers for native resources.
6. Reduce allocations only where a profile or benchmark shows the hot path:
   `StringBuilder` for loops, `ArrayPool<T>` for large temporary buffers,
   spans for parsing, avoiding LINQ in tight loops. Measure before and
   after.
7. Use the analyzers as signals: CA2000 (not disposed), CA1001 (owns
   disposable fields), CA2213 (field not disposed). They are heuristic and
   miss some cases, so review ownership by reading the code as well.

**Verify:** the analyzers report no new disposal warnings where enabled,
tests cover disposal behaviour (disposed twice, used after disposal), and
allocation claims come from a benchmark (`[MemoryDiagnoser]`) or a counter
measurement, otherwise labelled unmeasured; report PASS, FAIL, or NOT_RUN
with the command.

## Verification commands

```bash
dotnet build -p:AnalysisMode=All 2>&1 | grep -E "CA2016|CA1849|CA2000|CA1001|CA2213"   # signal only; do not commit AnalysisMode changes without approval
dotnet test --filter "FullyQualifiedName~Concurrency|FullyQualifiedName~Dispose"
dotnet run -c Release --project <Benchmarks>                                            # BenchmarkDotNet with [MemoryDiagnoser], when the project has one
```

## Pitfalls

- **Sync over async** in constructors, property getters, or `Dispose`,
  which deadlocks UI apps and starves thread pools in services.
- **Ignoring the token:** accepting a `CancellationToken` and not passing
  it on.
- **`lock` around `await`,** which does not compile, rewritten as unsafe
  code instead of using `SemaphoreSlim`.
- **Disposing injected services,** or a shared `HttpClient`.
- **Micro-optimizing without a measurement,** which makes code harder to
  read for no proven gain.
