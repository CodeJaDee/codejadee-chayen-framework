---
kind: checklist
---
# New feature development

A native agent follows this composite checklist only after its owning entry
skill and this workflow match the request. It coordinates existing recipes;
it is static guidance, not an executable workflow or a permission mechanism.

## When it applies

A requested feature changes observable behavior across existing modules or layers and needs coordinated implementation and verification.

**Not when:** A question, unrelated request, or fully specified low-risk one-line edit; continue normal native behavior for no match and use the single capability recipe for a small matched edit.

No matching workflow => continue normal native behavior. If the skill still
matches a smaller task, use its direct recipe without running this composite.

## Inputs

Requested outcome and acceptance criteria; target apps/services, existing analogous feature, current contracts, repository instructions, and permitted verification environment.

Read repository instructions and the actual target before selecting stages.
Keep unknown inputs explicit; ask only for information that changes the result.

## Recipe reuse

Use existing procedures, not duplicate implementations. Each row names the
owning skill and its local recipe. For another owner's stage, hand off by skill
name through native behavior; do not assume automatic invocation or spawn agents.
Read only the needed recipe through that owner's References table.

| Owner | Existing recipe | Load when |
|---|---|---|
| `chayen-implementation` | `task-contract.md` | task-contract; load only when that stage applies |
| `chayen-implementation` | `feature-delivery.md` | feature-implementation; load only when that stage applies |
| `chayen-backend` | `api-endpoints.md` | api-implementation; load only when that stage applies |
| `chayen-frontend` | `ui-features.md` | ui-feature-implementation; load only when that stage applies |
| `chayen-testing` | `test-authoring.md` | regression-testing; load only when that stage applies |
| `chayen-implementation` | `change-summary.md` | handoff-summary; load only when that stage applies |

## Technology selection

Detect each affected app/service independently. Angular/ASP.NET/SQL Server, React/Next/PostgreSQL, or Vue/Nuxt are examples only when evidenced; preserve builders, providers, transport precision and runtime boundaries.

At each affected owner, detect the installed versions, configured commands and
existing conventions; load only its matching technology base plus relevant topic.
Do not preload all packs, select a framework from a sibling's manifest, install
tools to make a check green, or force migrations or dependency replacements.

## Stages

Each exit check gates only its dependent stage. Skip non-applicable stages
explicitly; a completed plan or static check does not prove runtime delivery.

| Stage | Inputs | Action and recipe | Exit check |
|---|---|---|---|
| Frame | User request and analogous feature | Use task-contract and feature-delivery to bound the feature, acceptance checks and smallest existing pattern. | Acceptance criteria and exclusions are observable; risky actions are identified. |
| Plan | Affected owners and contracts | Sequence changed owners and consumers with the implementation plan; resolve only outcome-changing unknowns. | No invented schema, architecture, dependency or approval. |
| Implement | Authorized plan and versions | Follow feature-delivery; hand off API work to chayen-backend and UI work to chayen-frontend by name only when those stages are needed. | Changed slices build; existing conventions and public contracts remain intentional. |
| Regress | Changed behavior and consumers | Use chayen-testing regression-testing for positive, negative and affected-consumer checks; include real database tests only when involved. | Each acceptance criterion has evidence or a stated verification gap. |
| Report | Diff and observed outcomes | Use change-summary to produce a proportional Change Passport and safe next step. | Completion is DONE only if required scope and checks are complete and every required criterion is at accept. |

## Outputs

Implemented feature, affected-owner change list, acceptance-to-evidence mapping, Verification Report and proportional Change Passport; no deployment or publication implied.

Use the repository's artifact format first; otherwise select these reusable
templates only as needed: Task Contract, Implementation Plan, Risk Assessment, Verification Report, Change Passport. The implementation owner holds
task/plan/risk/verification/passport formats, the architecture owner holds the
ADR, and the AI-engineering owner holds the Context Capsule. Request their
relevant artifact recipe by skill name rather than following cross-skill links.
Artifacts stay in conversation unless the user requests files or the repository
already keeps them. Do not generate all artifacts for every task.

## Verification

Verify the requested behavior and affected consumers with discovered build, typecheck, lint and test commands; distinguish API/database/browser coverage rather than inferring all layers from one unit test.

For each required check record the exact command or evidence method, target
environment/version, observed outcome and PASS, FAIL, NOT_RUN or N/A. Separate
baseline failures from new failures; explain unexecuted checks. DONE requires
the requested scope and required verification, not merely a green subset.
Give each acceptance criterion one verdict (accept, verify_more or revise)
from fresh, adequate evidence; a check status is never the verdict, and DONE
needs every required criterion at accept.

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

A local reversible feature uses its direct recipe, a brief inline plan and one relevant check; skip formal contract, ADR, full-stack stages and persisted artifacts when their triggers do not apply.

A compact inline outcome is sufficient for low-risk work. Retain essential
scope, permission and evidence checks even when formal planning stages are skipped.

## Blockers and handoff

If a consumer contract or required service is unavailable, finish independent authorized slices, mark the overall outcome PARTIAL (or BLOCKED if no stage can proceed), and name the next dependency without weakening acceptance.

Record DONE, PARTIAL or BLOCKED against completed stages and acceptance criteria,
with the blocker, independent work finished, pending authorization and next safe
action. Use a redacted Context Capsule for an actual handoff; fresh agents must
verify stale facts and the continuing scope of recorded approvals.
