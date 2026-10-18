---
kind: recipe
capabilities: [CAP-02-009]
---
# Non-functional requirements

Elicit and quantify quality requirements (performance, availability,
security, privacy, accessibility, scalability, maintainability, and
operability), so that each one has a metric, a target, and a way to measure
it.

## Inputs

- System purpose, users and their locations, expected load and growth.
- Data sensitivity and any compliance constraints, as stated by the user or
  documents.
- Existing service levels, monitoring, or test results, if any.

## Procedure

1. **Walk the quality categories.** Use the ISO/IEC 25010 headings as a
   checklist:
   - performance efficiency;
   - reliability and availability;
   - security;
   - compatibility;
   - usability and accessibility;
   - maintainability;
   - portability;

   plus privacy, operability, and observability. Skip a category only with a
   stated reason.
2. **Turn each concern into a measurable statement:** metric, target, scope,
   and condition. For example: "p95 latency of `GET /orders` < 300 ms at
   200 requests/s on production-sized data". Vague words stay open decisions
   until they are quantified.
3. **Attach a measurement method** to every target. Examples:
   - a load test with a named tool;
   - production monitoring of a named metric;
   - an accessibility audit against WCAG 2.2 AA;
   - a restore drill measuring recovery time (RTO) and data loss (RPO);
   - a dependency-scan policy.
4. **Record where each target came from.**
   - Targets stated by a source are confirmed facts.
   - Targets proposed by you are assumptions, with their rationale, until the
     owner confirms them.
   - Never present an industry rule of thumb as the requirement.
5. **Note the trade-offs and conflicts,** for example strict consistency
   versus availability, or encryption versus latency. Record them as open
   decisions.
6. **Prioritize only as directed.** If the user gives priorities, record
   them. Otherwise leave priority to the owner.
7. **Record** everything in the requirements record.

## Outputs

```text
| ID | Category | Requirement (metric, target, scope, condition) | Measurement method | Source / status | Priority (if given) |
| NFR1 | Performance | p95 < 300 ms for GET /orders at 200 rps | k6 load test; APM p95 | assumption — confirm with product owner | — |
```

- Assumptions behind each proposed target.
- Trade-offs and conflicts, recorded as open decisions.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core / Node.js / Python APIs | Latency targets name the endpoint and the percentile. Throughput targets name the instance size. Cold start matters for serverless hosting. |
| Angular / React / Next.js / Vue / Nuxt / Vite | Web targets use Core Web Vitals (LCP, INP, CLS) and bundle budgets (`angular.json` budgets, bundle analysis). Accessibility targets use WCAG 2.2 AA. |
| SQL Server / PostgreSQL | Data targets cover the recovery point and time (RPO and RTO), retention periods, and the query latency of key reports at the expected data volume. |
| Security and privacy (all stacks) | Express targets as controls with verification, for example "dependency scan in CI with no critical advisories older than 7 days". Regulatory claims stay as stated by their owner, and are marked for qualified review. |

## Verification

- Every NFR has a numeric or checkable target and a measurement method.
- Every target is labelled with its source, or as an assumption with a
  rationale. None is presented as agreed without a source.
- Skipped categories state a reason.
- Conflicting targets appear as open decisions.
