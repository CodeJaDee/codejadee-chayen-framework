---
kind: recipe
capabilities: [CAP-14-001, CAP-14-002, CAP-14-003, CAP-14-004]
---
# Observability: logs, metrics, traces, and SLOs

Design and add the telemetry a service needs to answer real operational
questions: structured logs with correlation, metrics for SLIs, distributed
traces across services and queues, and SLOs with error budgets, using the
project's existing logging library and telemetry stack (OpenTelemetry where
possible).

## Inputs

- The service architecture, the critical user journeys, and the questions
  operators need answered ("is checkout failing, for whom, since when,
  why?").
- The existing telemetry stack: logging library and sinks, metrics
  backend, tracing backend, dashboards, and OpenTelemetry usage.
- Reliability expectations from the product owner, for SLOs.

## Procedure

### Observability design (CAP-14-001)

1. **List the questions** per critical journey, and map each to a signal:
   metric (is it happening, how much), trace (where is time or error
   spent), log (what exactly happened to this request).
2. **Choose the instrumentation** that already exists, or OpenTelemetry
   with the project's exporter. Automatic instrumentation first (HTTP
   server and client, database, messaging), then a few custom spans and
   metrics for business steps.
3. **Correlate:** one trace context through every hop, with the trace ID in
   logs, and resource attributes (service name, version, environment) on
   every signal.
4. **Outline dashboards** per journey: rate, errors, duration (RED) for
   requests, and utilisation, saturation, errors (USE) for resources.

### Structured logging (CAP-14-002)

1. **Use the project's logging library** with message templates and named
   properties (never string interpolation in the template), consistent
   levels, and event IDs or names where the library supports them.
2. **Add the standard fields:** timestamp, level, service, environment,
   version, trace and span ID, and request or correlation ID.
3. **Emit JSON** in deployed environments (console in development if the
   team prefers), through the existing sink configuration.
4. **Keep secrets and unnecessary personal data out,** following the
   security skill's logging guidance.

### Metrics and SLOs (CAP-14-003)

1. **Define SLIs per journey** as good events over valid events (for
   example successful checkout requests under 800 ms over all checkout
   requests), with the query that computes each from emitted metrics.
2. **Set SLO targets** with the owner (for example 99.5 % over 28 days),
   and compute the error budget: allowed bad events = (1 − target) × valid
   events, or the equivalent minutes.
3. **Write the error-budget policy:** what happens when the budget is
   spent (feature freeze, reliability work), agreed by the owner.
4. **Emit the metrics needed:** request counters by outcome and latency
   histograms with suitable buckets, low-cardinality labels only.

### Distributed tracing (CAP-14-004)

1. **Propagate context** across every transport: W3C `traceparent` over
   HTTP, and message headers or properties for queues, injected by the
   producer and extracted by the consumer.
2. **Design spans:** one per meaningful operation, named by operation not
   by URL with IDs, with attributes for key business identifiers that are
   not personal data.
3. **Set sampling** with the user: head sampling at a rate for volume,
   always keeping errors if the backend supports tail sampling.
4. **Walk through an example trace** to show where latency or errors
   appear, and how to go from a trace to its logs.

## Outputs

- A telemetry plan per signal, with instrumentation code following the
  existing setup, and a dashboard outline tied to user journeys.
- Logging configuration and code changes with message templates, and
  sample log output.
- SLI definitions with queries, SLO targets, an error-budget policy, and the
  metrics instrumentation needed.
- Instrumentation and propagation changes, sampling configuration, and an
  example trace walkthrough.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | `OpenTelemetry.Extensions.Hosting` with ASP.NET Core, HttpClient, and EF Core or SqlClient instrumentation, `Azure.Monitor.OpenTelemetry.AspNetCore` for Application Insights, `ILogger` message templates or Serilog with `Enrich.FromLogContext`, `System.Diagnostics.Metrics` meters. |
| Node servers | `@opentelemetry/sdk-node` with auto-instrumentations, pino with trace context mixins, and OTLP exporters. |
| Python | `opentelemetry-distro` and `opentelemetry-instrument`, structlog or `logging` with JSON formatting and trace IDs. |
| Angular, React, Vue | The OpenTelemetry web SDK or the vendor's browser SDK, propagating `traceparent` to the API (with CORS allowing the header), and a sampled rate. |
| Messaging | OpenTelemetry messaging instrumentation where available (Azure Service Bus, RabbitMQ, Kafka), otherwise manual inject and extract of the context in message headers. |
| Backends | Prometheus or Azure Monitor queries for SLIs, Grafana or Azure workbooks for dashboards, and SLO tooling if the team has it. |

## Verification

- A request through the fixture emits a trace with the same ID in its logs,
  shown by a test or a local run.
- Log output in the fixture is valid JSON with correlation ID and level
  fields, and string interpolation in templates is removed.
- Every SLO has an SLI query computable from emitted metrics, and the
  error-budget arithmetic is correct.
- The producer and consumer spans in the fixture share a trace ID across
  the queue.
