---
kind: recipe
capabilities: [CAP-12-001, CAP-12-002, CAP-12-005]
---
# Baselines, profiling, and bottleneck analysis

Establish a repeatable baseline before any optimization, profile with the
runtime's tools to find where time and resources go, and identify the
limiting resource from measurements. Every result is labelled MEASURED,
ESTIMATED, or HYPOTHESIS.

## Inputs

- The scenario to measure (an endpoint, a job, a function, a user flow) and
  the symptom or goal.
- The environment where measurement is allowed, and its similarity to
  production (hardware, data volume, configuration).
- Available evidence: traces, metrics, logs, earlier profiles, and the
  tools installed.

## Procedure

### Baseline (CAP-12-001)

1. **Define the scenario precisely:** input data, concurrency, request mix,
   and what "done" means (response received, job finished).
2. **Fix the conditions:** release build, the same machine or instance
   type, representative data volume, no debugger, warm-up runs discarded,
   and background noise minimised. Write them down.
3. **Choose the harness:** a micro-benchmark tool for functions
   (BenchmarkDotNet, Vitest bench, pytest-benchmark), a short load run for
   endpoints, or timed runs for jobs.
4. **Run several times** (at least five runs, or the tool's statistical
   default) and record median, p95, p99, maximum, throughput, and the
   spread (standard deviation or min to max). Record resource use (CPU,
   memory, GC, connections) alongside.
5. **Save the re-run command** and the raw results, so later comparisons
   use exactly the same method.

### Profiling (CAP-12-002)

1. **Pick the profile type for the symptom:** CPU sampling for busy CPU,
   wall-clock or wait analysis for slow but idle, allocation profiling for
   GC pressure, and lock or thread-pool counters for contention.
2. **Profile the baseline scenario** with the runtime's tool (see the
   runtime tools reference), for a bounded duration. In shared or
   production environments, only with approval, using low-overhead
   sampling.
3. **Read the hot paths:** inclusive and exclusive time by function, call
   counts, allocation sites, and wait reasons. Map them to code
   (`path:line`).
4. **Record the evidence:** the command, the capture file, and a short
   summary of the top items with their share of time.
5. **Name the next step:** a fix candidate, or a narrower profile.

### Bottleneck analysis (CAP-12-005)

1. **Decompose the slow path** into its steps (application code, database
   calls, external calls, serialization, queueing, network) using traces or
   timing logs. Without traces, add temporary timing with the user's
   agreement.
2. **Check saturation of each resource:** CPU, memory and GC, thread pool
   or event loop, connection pools (database, HTTP), locks, disk, network,
   and downstream rate limits.
3. **Identify the dominant step** by share of time or the first resource to
   saturate as load grows. Use Amdahl's law to estimate the maximum gain
   from fixing it, labelled ESTIMATED.
4. **Hand off what belongs elsewhere:** one slow query to the data skill,
   rendering cost to the frontend skill.
5. **Propose the fix and a verification plan:** the same baseline
   scenario, run again, with the expected change in the target metric.
6. **After a fix, re-run the baseline** and report before and after as
   MEASURED, or state that the improvement is unproven.

## Outputs

- The baseline method and recorded numbers with percentiles, spread, and
  run count, plus the re-run command.
- Profiling commands and the captured hot paths with evidence, and the next
  investigation step or fix candidate.
- The identified bottleneck with evidence and the estimated gain from
  fixing it, and a verification plan to confirm the improvement.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | BenchmarkDotNet (`[MemoryDiagnoser]`, `[SimpleJob]` defaults), `dotnet-counters` for thread pool queue length and GC, `dotnet-trace` for CPU and waits. Sync-over-async (`.Result`, `.Wait()`) shows as thread-pool starvation. OpenTelemetry or Application Insights traces for step timing. |
| Node and Bun | `--cpu-prof`, clinic.js, event-loop delay histograms, and `undici` or database pool limits. Synchronous JSON or crypto work on the event loop blocks every request. |
| Python | py-spy for sampling, cProfile for detail, `pytest-benchmark`, and worker counts in Gunicorn or Uvicorn. Blocking I/O inside async views stalls the loop. |
| Browser | DevTools Performance panel with CPU throttling, long tasks over 50 ms, and layout thrash. |
| Databases | Database time seen in traces goes to the data skill's query performance recipe with the captured query and parameters. |

## Verification

- The baseline reports several runs with spread and percentiles, not a
  single timing, for the fixture benchmark.
- For a fixture with a seeded hot loop, the profile output, or the
  documented command when NOT_RUN, identifies that function.
- In a fixture with a seeded sync-over-async call and a slow query, the
  dominant one is identified from the provided trace.
- Any improvement is reported with before and after numbers from the same
  method, or labelled "expected, not measured".
