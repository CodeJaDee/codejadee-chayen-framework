---
kind: checklist
---
# Production incident investigation

A native agent follows this composite checklist only after its owning entry
skill and this workflow match the request. It coordinates existing recipes;
it is static guidance, not an executable workflow or a permission mechanism.

## When it applies

An active or recent production incident needs scoped evidence gathering, impact/timeline analysis, diagnosis and proposed mitigation or follow-up.

**Not when:** Ordinary feature work, unsupported target access, or unrelated requests; continue normal native behavior for no match. Investigation alone never authorizes mitigation execution.

No matching workflow => continue normal native behavior. If the skill still
matches a smaller task, use its direct recipe without running this composite.

## Inputs

Incident time window and time zone, symptoms/affected users, incident owner, service map, redacted logs/metrics/traces, deployment timeline, access and approved actions.

Read repository instructions and the actual target before selecting stages.
Keep unknown inputs explicit; ask only for information that changes the result.

## Recipe reuse

Use existing procedures, not duplicate implementations. Each row names the
owning skill and its local recipe. For another owner's stage, hand off by skill
name through native behavior; do not assume automatic invocation or spawn agents.
Read only the needed recipe through that owner's References table.

| Owner | Existing recipe | Load when |
|---|---|---|
| `chayen-devops` | `alerting-and-incidents.md` | production-incident-triage; load only when that stage applies |
| `chayen-devops` | `rca-and-postmortems.md` | root-cause-analysis; load only when that stage applies |
| `chayen-devops` | `rca-and-postmortems.md` | postmortem; load only when that stage applies |
| `chayen-devops` | `hotfix.md` | hotfix-preparation; load only when that stage applies |
| `chayen-devops` | `runbooks.md` | runbook-generation; load only when that stage applies |

## Technology selection

Identify affected runtime/service/database from actual telemetry and deployment evidence; use matching tooling guidance conditionally. Do not infer root cause or change production settings from a sibling's stack.

At each affected owner, detect the installed versions, configured commands and
existing conventions; load only its matching technology base plus relevant topic.
Do not preload all packs, select a framework from a sibling's manifest, install
tools to make a check green, or force migrations or dependency replacements.

## Stages

Each exit check gates only its dependent stage. Skip non-applicable stages
explicitly; a completed plan or static check does not prove runtime delivery.

| Stage | Inputs | Action and recipe | Exit check |
|---|---|---|---|
| Triage | Symptoms, impact and authority | Follow alerting-and-incidents with bounded read-only evidence collection and an incident timeline. | Impact, scope, current state and authorized access are distinguished from guesses. |
| Correlate | Logs, traces, metrics and releases | Follow rca-and-postmortems to test hypotheses and separate trigger, contributing factor and root cause. | Claims cite timestamped evidence; stale or missing data is identified. |
| Propose | Supported diagnosis and risks | Use hotfix or runbooks to propose bounded mitigation and explicit rollback/verification actions. | Restart, rollback, failover, write access and config changes are not assumed approved. |
| Gate | Exact action/environment authorization | Execute a mitigation only when actually authorized and permitted by platform controls; otherwise deliver a reviewable proposal. | Execution record or pending approval is explicit; no simulated restoration. |
| Handoff | Timeline and action evidence | Record customer impact, remaining checks, next owner and Context Capsule; postmortem only when in scope. | Recovered service is claimed only with observed health/metric evidence. |

## Outputs

Evidence-backed incident timeline, bounded hypotheses/root cause, mitigation recommendation or executed-action record, Verification Report and Context Capsule.

Use the repository's artifact format first; otherwise select these reusable
templates only as needed: Risk Assessment, Verification Report, Context Capsule / Agent Handoff, Change Passport. The implementation owner holds
task/plan/risk/verification/passport formats, the architecture owner holds the
ADR, and the AI-engineering owner holds the Context Capsule. Request their
relevant artifact recipe by skill name rather than following cross-skill links.
Artifacts stay in conversation unless the user requests files or the repository
already keeps them. Do not generate all artifacts for every task.

## Verification

Use approved read-only health/telemetry queries with time window and command evidence; remediation needs independent observed health and key metrics. Do not run a production load test as diagnosis without authorization.

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

For a bounded log diagnosis, answer with evidence and the next check; skip incident bureaucracy, deployments and a full postmortem unless needed.

A compact inline outcome is sufficient for low-risk work. Retain essential
scope, permission and evidence checks even when formal planning stages are skipped.

## Blockers and handoff

If telemetry or production permissions are unavailable, analyze supplied redacted data, report PARTIAL or BLOCKED and the exact missing access. Continue independent read-only work; never turn investigation approval into restart/rollback approval.

Record DONE, PARTIAL or BLOCKED against completed stages and acceptance criteria,
with the blocker, independent work finished, pending authorization and next safe
action. Use a redacted Context Capsule for an actual handoff; fresh agents must
verify stale facts and the continuing scope of recorded approvals.
