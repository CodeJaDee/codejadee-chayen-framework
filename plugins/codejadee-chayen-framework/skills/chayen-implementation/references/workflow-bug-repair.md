---
kind: checklist
---
# Bug diagnosis and repair

A native agent follows this composite checklist only after its owning entry
skill and this workflow match the request. It coordinates existing recipes;
it is static guidance, not an executable workflow or a permission mechanism.

## When it applies

A reported defect needs reproduction, evidence-based diagnosis, a minimal repair, and regression checks across affected boundaries.

**Not when:** An explanation alone, speculative optimization, or unrelated request; continue normal native behavior for no match. A tiny known fix can use bug-fix directly.

No matching workflow => continue normal native behavior. If the skill still
matches a smaller task, use its direct recipe without running this composite.

## Inputs

Expected versus observed behavior, failing input/error and timestamps; minimal reproduction, changed owners, baseline test results and permitted data/services.

Read repository instructions and the actual target before selecting stages.
Keep unknown inputs explicit; ask only for information that changes the result.

## Recipe reuse

Use existing procedures, not duplicate implementations. Each row names the
owning skill and its local recipe. For another owner's stage, hand off by skill
name through native behavior; do not assume automatic invocation or spawn agents.
Read only the needed recipe through that owner's References table.

| Owner | Existing recipe | Load when |
|---|---|---|
| `chayen-implementation` | `bug-fix.md` | bug-fix; load only when that stage applies |
| `chayen-repository` | `dependency-and-impact.md` | change-impact-analysis; load only when that stage applies |
| `chayen-testing` | `failing-and-flaky-tests.md` | test-failure-triage; load only when that stage applies |
| `chayen-testing` | `test-authoring.md` | regression-testing; load only when that stage applies |
| `chayen-implementation` | `change-summary.md` | handoff-summary; load only when that stage applies |

## Technology selection

Trace the failing owner and call chain before selecting technology topics. Keep Node/browser, Next server/client, SQL dialect and .NET/Python distinctions; do not diagnose a sibling stack by root dependencies.

At each affected owner, detect the installed versions, configured commands and
existing conventions; load only its matching technology base plus relevant topic.
Do not preload all packs, select a framework from a sibling's manifest, install
tools to make a check green, or force migrations or dependency replacements.

## Stages

Each exit check gates only its dependent stage. Skip non-applicable stages
explicitly; a completed plan or static check does not prove runtime delivery.

| Stage | Inputs | Action and recipe | Exit check |
|---|---|---|---|
| Reproduce | Failure and expected behavior | Follow bug-fix; collect the smallest failing test or permitted request and relevant history. | Failure is reproduced, or inability to reproduce is recorded without inventing a cause. |
| Diagnose | Reproduction and evidence | Use chayen-repository change-impact-analysis and chayen-testing test-failure-triage when needed; test the leading hypothesis. | Cause is tied to evidence; baseline failures are separated from the new defect. |
| Repair | Established cause and authorization | Apply the smallest behavior-correcting change through bug-fix; no adjacent refactor. | Original reproduction is fixed without unsupported library or schema changes. |
| Regress | Repair and consumer boundaries | Use regression-testing; demonstrate the regression test fails before and passes after where possible. | Changed and related checks have commands and observed results. |
| Handoff | Evidence and unresolved limits | Use change-summary or a Context Capsule for partial work. | Root cause, changed files, pending approvals and next action are explicit. |

## Outputs

Root cause with file/line evidence, minimal repair, regression test or reason unavailable, Verification Report and unresolved reproduction limits.

Use the repository's artifact format first; otherwise select these reusable
templates only as needed: Task Contract, Verification Report, Change Passport, Context Capsule / Agent Handoff. The implementation owner holds
task/plan/risk/verification/passport formats, the architecture owner holds the
ADR, and the AI-engineering owner holds the Context Capsule. Request their
relevant artifact recipe by skill name rather than following cross-skill links.
Artifacts stay in conversation unless the user requests files or the repository
already keeps them. Do not generate all artifacts for every task.

## Verification

Run the original reproduction and affected regression suite with exact commands; a passing unrelated test cannot establish repair and an unreproduced cause stays a hypothesis.

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

For a known local typo or one-line defect, skip formal planning, cross-stack analysis and a persisted capsule; retain the targeted reproduction and relevant check.

A compact inline outcome is sufficient for low-risk work. Retain essential
scope, permission and evidence checks even when formal planning stages are skipped.

## Blockers and handoff

Without reproduction or required access, perform read-only diagnosis and independent checks, report PARTIAL or BLOCKED, and hand over the smallest missing input rather than claiming the bug fixed.

Record DONE, PARTIAL or BLOCKED against completed stages and acceptance criteria,
with the blocker, independent work finished, pending authorization and next safe
action. Use a redacted Context Capsule for an actual handoff; fresh agents must
verify stale facts and the continuing scope of recorded approvals.
