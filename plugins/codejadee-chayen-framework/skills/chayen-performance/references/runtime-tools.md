---
kind: technology
---
# Runtime performance tools

**Applies to:** .NET, Node or Bun, Python, and browser runtimes. Read only
the section for the detected runtime.

- Tool names and flags below are for current major versions. Check the
  installed version's help output before relying on a flag.
- Install a tool only with approval. Prefer tools already in the
  repository or the developer image.

## Check the repository first

| Area | What to look for |
|---|---|
| Benchmarks | BenchmarkDotNet projects (`*.Benchmarks.csproj`), Vitest `bench` files or `tinybench`, `pytest-benchmark` tests, `asv` |
| Load tests | `*.js` k6 scripts, `.jmx` JMeter plans, `locustfile.py`, NBomber projects, Artillery YAML |
| Observability | OpenTelemetry setup, Application Insights, Prometheus metrics, APM agents (Datadog, New Relic), dashboards linked in docs |
| Caches | `IMemoryCache`, `IDistributedCache`, `HybridCache`, output caching, Redis clients, `lru-cache`, `functools.lru_cache`, Django cache settings, CDN configuration |
| Runtime settings | .NET GC mode (`ServerGarbageCollector`), thread pool settings, Node `--max-old-space-size`, Gunicorn or Uvicorn worker counts, container CPU and memory limits |

## .NET

- **Benchmarks:** BenchmarkDotNet with `[MemoryDiagnoser]`, run in Release
  (`dotnet run -c Release --project <Benchmarks>`). It handles warm-up,
  iterations, and statistics.
- **Live counters:** `dotnet-counters monitor -p <pid>` (CPU, GC heap size,
  allocation rate, thread pool queue length, lock contention, exceptions).
- **CPU and wait traces:** `dotnet-trace collect -p <pid>` (open in Visual
  Studio or PerfView, or convert to speedscope with `--format speedscope`).
- **Memory:** `dotnet-gcdump collect -p <pid>` for heap type statistics
  (low overhead), `dotnet-dump collect` for full dumps (large, contain
  data).
- **Signals:** a growing thread pool queue with low CPU suggests blocking
  calls (sync over async). High GC time suggests allocation pressure.

## Node and Bun

- **CPU profiles:** `node --cpu-prof app.js` (writes `.cpuprofile` for
  Chrome DevTools), or `--inspect` with DevTools. clinic.js (`clinic
  doctor`, `clinic flame`) if installed.
- **Heap:** `--heapsnapshot-signal=SIGUSR2` or `v8.writeHeapSnapshot()`,
  compared in Chrome DevTools Memory. `--max-old-space-size` changes the
  limit, not the leak.
- **Event loop:** `perf_hooks.monitorEventLoopDelay()` histogram, or
  clinic doctor. High event-loop delay means synchronous work on the main
  thread.
- **Quick HTTP load:** autocannon for local checks. Use the project's load
  tool for real tests.
- **Bun:** `bun --inspect` with the WebKit inspector. Some Node profiling
  flags differ: check `bun --help`.

## Python

- **Sampling profiler:** `py-spy record -o profile.svg --pid <pid>` or
  `py-spy top` (low overhead, can attach to a running process with
  permissions).
- **Deterministic profiling:** `python -m cProfile -o out.prof script.py`,
  viewed with `snakeviz` or `pstats`. Higher overhead.
- **Memory:** `tracemalloc` snapshots compared over time, memray, or
  scalene if installed.
- **Benchmarks:** `pytest-benchmark` with its comparison mode
  (`--benchmark-autosave`, `--benchmark-compare`).
- **Signals:** the GIL limits CPU-bound threads; async code blocked by
  synchronous I/O shows long event-loop stalls.

## Browser

- **Performance panel** in Chrome DevTools with CPU throttling for runtime
  work, long tasks, and layout thrash.
- **Memory panel:** heap snapshots before and after repeating an action
  (open and close a dialog ten times), comparing retained objects and
  detached DOM nodes. The allocation timeline for growth over time.

## Commands

```bash
dotnet-counters monitor -p <pid> --counters System.Runtime
dotnet-trace collect -p <pid> --duration 00:00:30
node --cpu-prof --cpu-prof-dir=./profiles dist/server.js
py-spy record -o profile.svg --duration 30 --pid <pid>
k6 run --summary-export=summary.json script.js
```

## Pitfalls

- Measuring Debug builds, the first (cold) run, or a laptop on battery
  power, and reporting it as the baseline.
- Using averages: one slow request in a hundred disappears in a mean.
- Profilers with high overhead changing the behaviour being measured.
- Full memory dumps copied around carelessly: they contain secrets and
  personal data.
