---
kind: checklist
---
# Pull request preparation and review

A native agent follows this composite checklist only after its owning entry
skill and this workflow match the request. It coordinates existing recipes;
it is static guidance, not an executable workflow or a permission mechanism.

## When it applies

A request needs an accurate PR draft, evidence-backed diff review, standards review or resolution of supplied review comments.

**Not when:** Automatic PR publishing/merging, unrelated prose, or a feature implementation request; continue normal native behavior for no match.

No matching workflow => continue normal native behavior. If the skill still
matches a smaller task, use its direct recipe without running this composite.

## Inputs

Actual diff/base and target branch, repository PR template and standards, task/acceptance, executed checks, known risks and review-only versus authorized edit scope.

Read repository instructions and the actual target before selecting stages.
Keep unknown inputs explicit; ask only for information that changes the result.

## Recipe reuse

Use existing procedures, not duplicate implementations. Each row names the
owning skill and its local recipe. For another owner's stage, hand off by skill
name through native behavior; do not assume automatic invocation or spawn agents.
Read only the needed recipe through that owner's References table.

| Owner | Existing recipe | Load when |
|---|---|---|
| `chayen-documentation` | `pull-requests-and-review.md` | pull-request-preparation; load only when that stage applies |
| `chayen-documentation` | `pull-requests-and-review.md` | code-review-assistant; load only when that stage applies |
| `chayen-documentation` | `pull-requests-and-review.md` | review-comment-resolution; load only when that stage applies |
| `chayen-documentation` | `pull-requests-and-review.md` | standards-compliance-check; load only when that stage applies |
| `chayen-implementation` | `change-summary.md` | task-evidence-audit; load only when that stage applies |

## Technology selection

Inspect only changed owners and relevant versions; load matching review guidance through their existing skill owners when needed. A mixed diff does not justify loading every technology pack or inventing tests.

At each affected owner, detect the installed versions, configured commands and
existing conventions; load only its matching technology base plus relevant topic.
Do not preload all packs, select a framework from a sibling's manifest, install
tools to make a check green, or force migrations or dependency replacements.

## Stages

Each exit check gates only its dependent stage. Skip non-applicable stages
explicitly; a completed plan or static check does not prove runtime delivery.

| Stage | Inputs | Action and recipe | Exit check |
|---|---|---|---|
| Collect | Actual diff and repository template | Follow pull-requests-and-review and fact-checking; bound the review and identify generated files and affected owners. | Every claimed changed file and test result has an evidence source. |
| Review | Diff, intent and risks | Use code-review-assistant and standards-compliance-check; cite actionable findings with paths/lines. | Potential defects are separated from confirmed failures and stylistic preferences. |
| Resolve | Authorized comments or requested fixes | Use review-comment-resolution only for in-scope edits, involving the relevant owner by name; re-run affected checks. | Review-only requests produce findings without surprise edits. |
| Draft | Verified change and check evidence | Prepare PR text using the repository template and a proportional Change Passport; use task-evidence-audit for questionable claims. | No invented PASS, reviewer signoff, approver identity or accepted waiver. |
| Close | Draft/findings and open items | Return reviewable text locally; publication, comments to others and merge need explicit authorization. | Unresolved items and partial checks remain visible. |

## Outputs

PR title/body or review findings with evidence, risk and rollback notes, actual Verification Report, and unresolved comment/approval status.

Use the repository's artifact format first; otherwise select these reusable
templates only as needed: Verification Report, Change Passport, Risk Assessment. The implementation owner holds
task/plan/risk/verification/passport formats, the architecture owner holds the
ADR, and the AI-engineering owner holds the Context Capsule. Request their
relevant artifact recipe by skill name rather than following cross-skill links.
Artifacts stay in conversation unless the user requests files or the repository
already keeps them. Do not generate all artifacts for every task.

## Verification

Check the draft against the actual diff and captured command outcomes; run affected checks only when scope permits. Label baseline failures and NOT_RUN honestly; a clean review is not approval to merge.

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

A one-file PR needs a short accurate description and relevant checks; skip full architecture review, formal risk document and unrelated repository audit.

A compact inline outcome is sufficient for low-risk work. Retain essential
scope, permission and evidence checks even when formal planning stages are skipped.

## Blockers and handoff

If base diff, external review text or CI evidence is unavailable, draft only supported facts, report PARTIAL or BLOCKED and pending checks, and never claim a reviewer accepted the change.

Record DONE, PARTIAL or BLOCKED against completed stages and acceptance criteria,
with the blocker, independent work finished, pending authorization and next safe
action. Use a redacted Context Capsule for an actual handoff; fresh agents must
verify stale facts and the continuing scope of recorded approvals.
