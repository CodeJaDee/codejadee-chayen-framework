---
kind: recipe
capabilities: [CAP-12-003, CAP-12-004]
---
# Load test design and analysis

Design load, stress, soak, and spike tests from a realistic workload model
with explicit pass criteria, run them only against approved targets, and
analyse results against targets with the saturation point and the evidence
for each bottleneck hypothesis.

## Inputs

- The traffic model: request mix, arrival rate or concurrency, peak versus
  average, data variety, and session behaviour.
- Targets: latency percentiles, throughput, error rate, and resource
  limits.
- The environment that may be loaded, test data, authentication for test
  users, and the load tool already in use.
- For analysis: the tool's output and server metrics for the same window.

## Procedure

### Design (CAP-12-003)

1. **Choose the test type** for the question:

   | Type | Question | Shape |
   |---|---|---|
   | Load | Do we meet targets at expected peak? | Ramp to the peak, hold |
   | Stress | Where and how does it break? | Ramp beyond peak until errors or saturation |
   | Spike | Do we survive a sudden burst? | Jump to a multiple of normal, then drop |
   | Soak | Does it degrade over hours (leaks, pool exhaustion)? | Moderate load for a long period |

2. **Build the workload model** from production data (logs, analytics) or
   stated assumptions: the endpoint mix, payload variety, think time, and
   an open model (arrival rate) when users arrive independently of response
   time.
3. **Write the script** in the existing tool: parameterized base URL from
   configuration (never a hard-coded production URL), test-user
   credentials from environment variables, realistic data, checks on
   responses, and thresholds that encode the targets so the run fails when
   they are missed.
4. **Plan safety:** the target environment, rate, duration, and window,
   approved by the owner; third-party calls stubbed or rate-limited; and a
   stop condition. Never against production or systems the user does not
   own without explicit approval.
5. **Plan observation:** which server metrics and traces to collect during
   the run, and the load generator's own CPU (an overloaded generator
   reports false latency).

### Analysis (CAP-12-004)

1. **Validate the run:** did the generator reach the intended rate, were
   errors from the system or the generator, and were warm-up periods
   excluded?
2. **Summarise against targets:** throughput, p50, p95, p99 latency, error
   rate by type, for each step of the ramp, from the raw output. Quote the
   numbers exactly.
3. **Find the saturation point:** the load at which latency rises sharply
   or throughput stops growing, and correlate it with server metrics (CPU,
   GC, thread pool, connection pools, database waits) in the same time
   window.
4. **State bottleneck hypotheses** with the evidence that supports each and
   the measurement that would confirm it (a profile at that load, a pool
   metric, a query trace).
5. **Judge the targets:** met, not met, or inconclusive, with the reason.

## Outputs

- Load-test scripts with ramp profiles, think time, and thresholds, plus
  safety notes: never against production without approval.
- A results summary against targets with the saturation point.
- Bottleneck hypotheses with the evidence to confirm each.

## Technology considerations

| Stack | Consideration |
|---|---|
| k6 | `scenarios` with `ramping-arrival-rate` for open models, `thresholds` (for example `http_req_duration: ['p(95)<300']`, `http_req_failed: ['rate<0.01']`), `__ENV.BASE_URL`, `--summary-export` for results. |
| JMeter | Thread groups or the arrival-rate plugins, CSV data sets, assertions, and non-GUI runs (`jmeter -n -t plan.jmx -l results.jtl -e -o report`). |
| Locust | `HttpUser` classes with `wait_time`, `--headless -u <users> -r <rate> --run-time`, and `--csv` output. |
| NBomber (.NET) | Scenarios with `Simulation.Inject` (open model) or `KeepConstant` (closed), and thresholds in code. |
| Server metrics | .NET counters, Node event-loop delay, Python worker utilisation, and database waits for the same window. |

## Verification

- The generated script's thresholds match the stated targets, and the
  target URL is configurable and non-production by default.
- For a fixture results file, the reported p95 and error rate match the
  data, and the targets are judged correctly.
- No load was generated against a shared or production environment without
  recorded approval, and runs not executed are NOT_RUN.
