---
kind: checklist
---
# Refactoring

A native agent follows this composite checklist only after its owning entry
skill and this workflow match the request. It coordinates existing recipes;
it is static guidance, not an executable workflow or a permission mechanism.

## When it applies

The user requests a behavior-preserving restructure or a staged refactor plan with identifiable boundaries and existing behavior to retain.

**Not when:** An unrequested cleanup, functional behavior change disguised as refactoring, or unrelated explanation; continue normal native behavior for no match.

No matching workflow => continue normal native behavior. If the skill still
matches a smaller task, use its direct recipe without running this composite.

## Inputs

Refactor goal, permitted files/modules, behavioral invariants, callers, current tests, baseline failures and any approved architecture decision.

Read repository instructions and the actual target before selecting stages.
Keep unknown inputs explicit; ask only for information that changes the result.

## Recipe reuse

Use existing procedures, not duplicate implementations. Each row names the
owning skill and its local recipe. For another owner's stage, hand off by skill
name through native behavior; do not assume automatic invocation or spawn agents.
Read only the needed recipe through that owner's References table.

| Owner | Existing recipe | Load when |
|---|---|---|
| `chayen-implementation` | `refactoring.md` | code-refactoring; load only when that stage applies |
| `chayen-implementation` | `refactoring.md` | safe-refactor-plan; load only when that stage applies |
| `chayen-testing` | `test-authoring.md` | regression-testing; load only when that stage applies |
| `chayen-implementation` | `change-summary.md` | handoff-summary; load only when that stage applies |

## Technology selection

Use the target owner's existing architecture and language/framework conventions. Preserve public wire keys, generated SQL, forms/state behavior, routers, providers and dependency boundaries; no generic architecture imposed.

At each affected owner, detect the installed versions, configured commands and
existing conventions; load only its matching technology base plus relevant topic.
Do not preload all packs, select a framework from a sibling's manifest, install
tools to make a check green, or force migrations or dependency replacements.

## Stages

Each exit check gates only its dependent stage. Skip non-applicable stages
explicitly; a completed plan or static check does not prove runtime delivery.

| Stage | Inputs | Action and recipe | Exit check |
|---|---|---|---|
| Bound | Goal and permitted surface | Follow refactoring to list invariants, exclusions, callers and reversible slices. | Scope is clear; unrelated smells remain deferred findings. |
| Characterize | Current behavior and tests | Use regression-testing only for missing meaningful characterization and run the affected baseline. | Existing semantics and pre-existing failures are documented. |
| Restructure | One authorized slice | Follow refactoring without changing externally observable behavior; use a proposed ADR only if an actual decision needs recording. | Slice builds; no hidden schema, auth or dependency redesign. |
| Compare | Before and after evidence | Run affected behavior and consumer checks after each meaningful slice. | Invariants hold or the slice is reported incomplete. |
| Report | Diff and remaining slices | Use change-summary and a proportional plan for deferred slices. | Outcome and rollback limits are explicit; no claim all modules were tested. |

## Outputs

Scoped refactor or plan, invariant-to-test mapping, changed-boundary report, Verification Report and optional proposed ADR for a real architectural decision.

Use the repository's artifact format first; otherwise select these reusable
templates only as needed: Implementation Plan, Risk Assessment, Verification Report, Change Passport, Architecture Decision Record. The implementation owner holds
task/plan/risk/verification/passport formats, the architecture owner holds the
ADR, and the AI-engineering owner holds the Context Capsule. Request their
relevant artifact recipe by skill name rather than following cross-skill links.
Artifacts stay in conversation unless the user requests files or the repository
already keeps them. Do not generate all artifacts for every task.

## Verification

Compare behavior and public contracts using the repository's existing commands, caller tests and data cases; compilation alone does not establish behavioral equivalence.

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

A local rename uses the direct refactoring recipe and affected compile/test check; skip architecture reviews, ADRs and large plans without their triggers.

A compact inline outcome is sufficient for low-risk work. Retain essential
scope, permission and evidence checks even when formal planning stages are skipped.

## Blockers and handoff

If required characterization or an approved boundary decision is missing, stop the dependent slice, retain authorized completed work, and report PARTIAL or BLOCKED with the next safe action.

Record DONE, PARTIAL or BLOCKED against completed stages and acceptance criteria,
with the blocker, independent work finished, pending authorization and next safe
action. Use a redacted Context Capsule for an actual handoff; fresh agents must
verify stale facts and the continuing scope of recorded approvals.
