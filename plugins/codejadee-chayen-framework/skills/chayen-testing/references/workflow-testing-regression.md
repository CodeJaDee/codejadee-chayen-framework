---
kind: checklist
---
# Software testing and regression

A native agent follows this composite checklist only after its owning entry
skill and this workflow match the request. It coordinates existing recipes;
it is static guidance, not an executable workflow or a permission mechanism.

## When it applies

A test-only request needs coverage planning, regression additions, failure triage or coordinated unit/integration/contract/end-to-end verification.

**Not when:** Production feature repair without a test-only scope, manual explanations or unrelated requests; continue normal native behavior for no match.

No matching workflow => continue normal native behavior. If the skill still
matches a smaller task, use its direct recipe without running this composite.

## Inputs

Changed behaviors/acceptance, existing runner/configuration, baseline failures, missing coverage, fixture data, permitted services and required consumer matrix.

Read repository instructions and the actual target before selecting stages.
Keep unknown inputs explicit; ask only for information that changes the result.

## Recipe reuse

Use existing procedures, not duplicate implementations. Each row names the
owning skill and its local recipe. For another owner's stage, hand off by skill
name through native behavior; do not assume automatic invocation or spawn agents.
Read only the needed recipe through that owner's References table.

| Owner | Existing recipe | Load when |
|---|---|---|
| `chayen-testing` | `test-strategy.md` | test-strategy; load only when that stage applies |
| `chayen-testing` | `test-authoring.md` | regression-testing; load only when that stage applies |
| `chayen-testing` | `failing-and-flaky-tests.md` | test-failure-triage; load only when that stage applies |
| `chayen-testing` | `coverage-gaps.md` | test-coverage-gap; load only when that stage applies |
| `chayen-testing` | `api-and-contract-tests.md` | contract-testing; load only when that stage applies |

## Technology selection

Use configured test runners, framework versions and real-engine semantics. Angular/Karma, React/Next integration, Vue/Nuxt context, Vite/Vitest and SQL Server/PostgreSQL are selected only from the owning project.

At each affected owner, detect the installed versions, configured commands and
existing conventions; load only its matching technology base plus relevant topic.
Do not preload all packs, select a framework from a sibling's manifest, install
tools to make a check green, or force migrations or dependency replacements.

## Stages

Each exit check gates only its dependent stage. Skip non-applicable stages
explicitly; a completed plan or static check does not prove runtime delivery.

| Stage | Inputs | Action and recipe | Exit check |
|---|---|---|---|
| Map | Acceptance and changed owners | Follow test-strategy and coverage-gaps to choose the smallest useful test levels. | Each relevant risk has a test or an explicit evidence gap. |
| Baseline | Existing suite and environment | Follow failing-and-flaky-tests to record pre-existing failures and distinguish product, runner and fixture defects. | Baseline failures are not hidden by skipped or weakened assertions. |
| Author | Uncovered observable behavior | Follow test-authoring and api-and-contract-tests only at relevant boundaries; include negative and regression cases. | Tests assert outcomes and fail on the intended defect, not implementation shape. |
| Run | Configured commands and safe data | Execute affected suites and necessary consumers; use isolated fixtures without installing replacement runners. | Every check records command, environment, outcome and evidence. |
| Report | Coverage and execution evidence | Provide Verification Report and a capsule for unavailable environments. | PASS, FAIL, NOT_RUN and N/A remain distinct; no coverage percentage substitutes for behavior. |

## Outputs

Meaningful regression tests, baseline-versus-new failure triage, per-level Verification Report and remaining fixture/coverage gaps.

Use the repository's artifact format first; otherwise select these reusable
templates only as needed: Implementation Plan, Verification Report, Context Capsule / Agent Handoff. The implementation owner holds
task/plan/risk/verification/passport formats, the architecture owner holds the
ADR, and the AI-engineering owner holds the Context Capsule. Request their
relevant artifact recipe by skill name rather than following cross-skill links.
Artifacts stay in conversation unless the user requests files or the repository
already keeps them. Do not generate all artifacts for every task.

## Verification

Run the project's configured commands and prove intended assertions execute; include negative contracts/denials and repeat a flaky check only when a hypothesis warrants it. Unavailable runtime checks are NOT_RUN.

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

For one covered regression, add/run the narrow test and affected suite; skip coverage programs, mutation/fuzz campaigns and unrelated end-to-end tests.

A compact inline outcome is sufficient for low-risk work. Retain essential
scope, permission and evidence checks even when formal planning stages are skipped.

## Blockers and handoff

If browsers, databases or dependencies are unavailable, run independent tests and static checks, report affected cases NOT_RUN and the workflow PARTIAL or BLOCKED; do not silently mock away the boundary being verified.

Record DONE, PARTIAL or BLOCKED against completed stages and acceptance criteria,
with the blocker, independent work finished, pending authorization and next safe
action. Use a redacted Context Capsule for an actual handoff; fresh agents must
verify stale facts and the continuing scope of recorded approvals.
