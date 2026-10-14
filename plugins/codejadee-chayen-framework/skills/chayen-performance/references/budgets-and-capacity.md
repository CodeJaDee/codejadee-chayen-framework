---
kind: recipe
capabilities: [CAP-12-007, CAP-12-008, CAP-12-010]
---
# Latency budgets, capacity planning, and cost-performance

Model demand, resources, and targets explicitly: split end-to-end latency
targets into per-hop budgets checked against measurements, forecast
capacity from measured per-unit cost and growth with stated assumptions,
and find cost savings that keep performance targets. Every number is
labelled MEASURED or ESTIMATED, and the arithmetic is reproducible.

## Inputs

- The end-to-end target (for example "page data in under 1 second at
  p95"), the call graph, and measured latencies per hop.
- Current load and resource use, the growth forecast, and the scaling
  limits (instance sizes, connection limits, quotas).
- A cost breakdown by service or resource, utilisation metrics, and the
  performance targets that must hold.

## Procedure

### Latency budget (CAP-12-007)

1. **Draw the call graph** for the request: client, network, gateway,
   service, database, caches, and downstream calls, marking sequential and
   parallel steps.
2. **Allocate budgets** at the same percentile as the target, so the
   sequential hops sum to no more than the target (parallel branches count
   the slowest), and keep headroom (for example 10 to 20 %) for variance
   and retries.
3. **Fill in measured values** per hop from traces or timing logs at the
   target percentile, labelled MEASURED with the source, or "unmeasured".
4. **Flag hops over budget** and recommend actions: remove the call, run
   in parallel, cache, reduce payload, or renegotiate the budget.

### Capacity planning (CAP-12-008)

1. **Measure the per-unit cost:** resource use per request or per job at a
   known load (for example CPU-seconds per request, memory per
   connection), from load tests or production metrics.
2. **Model demand:** the current peak, the growth forecast, and seasonal
   peaks, with the source of each number.
3. **Compute needs** with the arithmetic written out: required instances =
   peak load × per-unit cost ÷ (per-instance capacity × target
   utilisation). Apply the same to database connections, storage growth,
   and queue throughput.
4. **Find limits** that do not scale linearly: database connections, locks,
   licence limits, quotas, and single-writer components.
5. **Set scaling triggers** and the date or load at which each limit is
   reached, and list every assumption.

### Cost-performance (CAP-12-010)

1. **Rank costs** by service and resource from the cost data.
2. **Match each cost to utilisation:** CPU and memory percentiles,
   idle hours, storage access patterns, and request volumes.
3. **List savings opportunities:** right-sizing over-provisioned
   resources, scaling policies (scale in at night), storage tiers,
   reserved or savings plans (a purchasing decision for the owner), query
   or cache changes that cut database load, and removing unused resources.
4. **For each,** estimate the saving (ESTIMATED, with arithmetic), the
   performance risk, and the metric to watch after the change.
5. **Change one thing at a time** in a non-production or canary setting
   first, with approval, and compare the watched metrics.

## Outputs

- A budget table per hop with measured value and headroom, and the hops
  over budget with recommended actions.
- A capacity model with assumptions and headroom, scaling triggers, and the
  date or load at which each limit is reached.
- Ranked savings opportunities with estimated saving and performance risk,
  and the verification metrics to watch after each change.

## Technology considerations

| Stack | Consideration |
|---|---|
| Tracing | OpenTelemetry spans or APM traces give per-hop latency. Use the target percentile, not averages, per hop. |
| .NET, Node, Python services | Per-request CPU from counters or APM. Thread pool, event loop, or worker limits cap per-instance capacity before CPU does. |
| Databases (SQL Server, PostgreSQL) | Connection limits, DTU or vCore tiers, IOPS, and storage growth from table sizes. Read replicas change the read and write split. |
| Cloud cost data | Azure Cost Management, AWS Cost Explorer, or GCP billing exports, read by the user or provided as exports. The agent does not access billing accounts without approval. |
| Autoscaling | Scaling rules are infrastructure changes owned by the platform team; the recipe proposes triggers and thresholds. |

## Verification

- Hop budgets sum to no more than the target, and the over-budget hop in
  the fixture trace is identified.
- The capacity model's arithmetic is reproducible from the stated inputs,
  and assumptions are listed.
- Every saving for a fixture cost report is tied to a utilisation figure
  and names the target it might affect.
- No value is presented as measured without a source.
