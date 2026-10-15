---
kind: checklist
---
# Performance investigation

A native agent follows this composite checklist only after its owning entry
skill and this workflow match the request. It coordinates existing recipes;
it is static guidance, not an executable workflow or a permission mechanism.

## When it applies

A measurable latency, throughput, memory or resource problem requires a baseline, profiling, a tested hypothesis and comparable before/after evidence.

**Not when:** Speculative optimization, an unrelated request, or a direct local code edit with no performance investigation; continue normal native behavior for no match.

No matching workflow => continue normal native behavior. If the skill still
matches a smaller task, use its direct recipe without running this composite.

## Inputs

User-visible symptom and target, workload/data distribution, actual runtime and deployment limits, permitted profiling/test environment and baseline telemetry.

Read repository instructions and the actual target before selecting stages.
Keep unknown inputs explicit; ask only for information that changes the result.

## Recipe reuse

Use existing procedures, not duplicate implementations. Each row names the
owning skill and its local recipe. For another owner's stage, hand off by skill
name through native behavior; do not assume automatic invocation or spawn agents.
Read only the needed recipe through that owner's References table.

| Owner | Existing recipe | Load when |
|---|---|---|
| `chayen-performance` | `baseline-and-profiling.md` | performance-baselining; load only when that stage applies |
| `chayen-performance` | `baseline-and-profiling.md` | profiling; load only when that stage applies |
| `chayen-performance` | `baseline-and-profiling.md` | bottleneck-analysis; load only when that stage applies |
| `chayen-performance` | `load-testing.md` | load-test-design; load only when that stage applies |
| `chayen-data` | `query-performance.md` | query-optimization; load only when that stage applies |

## Technology selection

Select actual .NET/Node/Python/browser profiler guidance and database plan topics only where evidence points. SQL Server actual plans and PostgreSQL EXPLAIN ANALYZE execute work; do not run them on production without authorization.

At each affected owner, detect the installed versions, configured commands and
existing conventions; load only its matching technology base plus relevant topic.
Do not preload all packs, select a framework from a sibling's manifest, install
tools to make a check green, or force migrations or dependency replacements.

## Stages

Each exit check gates only its dependent stage. Skip non-applicable stages
explicitly; a completed plan or static check does not prove runtime delivery.

| Stage | Inputs | Action and recipe | Exit check |
|---|---|---|---|
| Baseline | Symptom, workload and safe environment | Follow baseline-and-profiling; record version, data, concurrency, duration and target metric. | A comparable baseline exists or its absence is explicit. |
| Locate | Baseline and profiling evidence | Use profiling/bottleneck-analysis; hand off query-optimization to chayen-data only when a database bottleneck is evidenced. | Ranked hypotheses identify measured versus inferred causes. |
| Experiment | Leading hypothesis and authorization | Use load-testing or one narrow permitted change; preserve workload and correctness. | No broad rewrite, cache or index change without evidence and scope. |
| Compare | Same data and workload | Repeat the relevant measurement and run correctness/consumer checks. | Report distributions and trade-offs; classify claims MEASURED, ESTIMATED or HYPOTHESIS. |
| Report | Before/after and risk | Record reproducible commands, environment, rollback and unmeasured areas. | No invented percentage or production-performance guarantee. |

## Outputs

Baseline/profiling evidence, investigated cause, minimal authorized optimization if requested, comparable measurements and Verification Report.

Use the repository's artifact format first; otherwise select these reusable
templates only as needed: Implementation Plan, Risk Assessment, Verification Report, Change Passport. The implementation owner holds
task/plan/risk/verification/passport formats, the architecture owner holds the
ADR, and the AI-engineering owner holds the Context Capsule. Request their
relevant artifact recipe by skill name rather than following cross-skill links.
Artifacts stay in conversation unless the user requests files or the repository
already keeps them. Do not generate all artifacts for every task.

## Verification

Use the configured profiler/load harness with equivalent workloads and relevant correctness tests; distinguish warm/cold, development/production and real-engine results. No measurement means no measured improvement claim.

For each required check record the exact command or evidence method, target
environment/version, observed outcome and PASS, FAIL, NOT_RUN or N/A. Separate
baseline failures from new failures; explain unexecuted checks. DONE requires
the requested scope and required verification, not merely a green subset.

## Approvals

Approval state starts NOT_PROVIDED. Record the exact action, target/environment,
scope, approver/authorized process, evidence reference and date only when actually
provided. Existing valid action-specific approval may be reused within its scope;
never ask again merely because another stage began. A proposal, plan, template,
generated record, passing test, tool permission or agent recommendation is not
business/release authorization. Never claim that an approval was obtained unless
it was actually provided through an authorized process. Pause only dependent
risky actions; never silently widen scope, mutate production or publish.

## Proportionality

A narrow read-only investigation uses one symptom and one relevant measure; skip broad load campaigns and optimization implementation when not requested.

A compact inline outcome is sufficient for low-risk work. Retain essential
scope, permission and evidence checks even when formal planning stages are skipped.

## Blockers and handoff

If representative telemetry or safe load permissions are missing, provide bounded hypotheses, run independent permitted checks, and report PARTIAL or BLOCKED with measurement NOT_RUN rather than fabricating gains.

Record DONE, PARTIAL or BLOCKED against completed stages and acceptance criteria,
with the blocker, independent work finished, pending authorization and next safe
action. Use a redacted Context Capsule for an actual handoff; fresh agents must
verify stale facts and the continuing scope of recorded approvals.
