---
kind: checklist
---
# Security review and remediation

A native agent follows this composite checklist only after its owning entry
skill and this workflow match the request. It coordinates existing recipes;
it is static guidance, not an executable workflow or a permission mechanism.

## When it applies

An authorized review or remediation request concerns application vulnerabilities, security boundaries or scanner findings with a defined target.

**Not when:** Unauthorized offensive testing, unrelated coding or blanket certification requests; continue normal native behavior for no match and retain provider safety controls.

No matching workflow => continue normal native behavior. If the skill still
matches a smaller task, use its direct recipe without running this composite.

## Inputs

Authorized targets and review/remediation scope, threat model or scanner findings, reproduction evidence, affected versions, sensitive data boundaries and permitted checks.

Read repository instructions and the actual target before selecting stages.
Keep unknown inputs explicit; ask only for information that changes the result.

## Recipe reuse

Use existing procedures, not duplicate implementations. Each row names the
owning skill and its local recipe. For another owner's stage, hand off by skill
name through native behavior; do not assume automatic invocation or spawn agents.
Read only the needed recipe through that owner's References table.

| Owner | Existing recipe | Load when |
|---|---|---|
| `chayen-security` | `secure-review.md` | secure-code-review; load only when that stage applies |
| `chayen-security` | `scanner-triage.md` | sast-triage; load only when that stage applies |
| `chayen-security` | `vulnerability-remediation.md` | vulnerability-remediation; load only when that stage applies |
| `chayen-security` | `secure-review.md` | authorization-review; load only when that stage applies |
| `chayen-testing` | `test-authoring.md` | regression-testing; load only when that stage applies |

## Technology selection

Choose only detected stack hardening and existing auth/provider guidance. Check server routes/actions, browser exposure and actual SQL parameterization separately; recommendations never replace platform or provider enforcement.

At each affected owner, detect the installed versions, configured commands and
existing conventions; load only its matching technology base plus relevant topic.
Do not preload all packs, select a framework from a sibling's manifest, install
tools to make a check green, or force migrations or dependency replacements.

## Stages

Each exit check gates only its dependent stage. Skip non-applicable stages
explicitly; a completed plan or static check does not prove runtime delivery.

| Stage | Inputs | Action and recipe | Exit check |
|---|---|---|---|
| Scope | Authorization and target boundaries | Follow secure-review and review-checklist; separate review-only permission from permission to change auth, dependencies or secrets. | Target and allowed testing/remediation actions are recorded. |
| Assess | Code evidence or scanner output | Follow secure-review or scanner-triage; trace source-to-sink and exploitable preconditions, redact sensitive values. | Findings cite evidence; severity and unknown reachability are justified. |
| Plan | Validated finding and risk | Follow vulnerability-remediation to propose the smallest fix and action-specific approval gates. | Review output is not permission to change auth or rotate real credentials. |
| Remediate | Actually authorized actions | Apply approved in-scope fixes through existing owners, preserving behavior and recording untouched findings. | No unapproved authentication, package replacement or external operation. |
| Verify | Before/after reproduction and scope | Use denial, injection or secret-sentinel regressions and rerun relevant configured scans. | Evidence supports each closed finding; untested exposure stays open. |

## Outputs

Evidence-backed findings and risk assessment, scoped remediation diff when authorized, residual-risk record and Verification Report; advisory recommendation only.

Use the repository's artifact format first; otherwise select these reusable
templates only as needed: Risk Assessment, Implementation Plan, Verification Report, Change Passport. The implementation owner holds
task/plan/risk/verification/passport formats, the architecture owner holds the
ADR, and the AI-engineering owner holds the Context Capsule. Request their
relevant artifact recipe by skill name rather than following cross-skill links.
Artifacts stay in conversation unless the user requests files or the repository
already keeps them. Do not generate all artifacts for every task.

## Verification

Run permitted existing scanners and targeted negative/denied-path tests, record tool/version and triage status; a green scanner does not certify the entire application or authorize a release.

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

For one narrowly scoped finding, inspect that path and relevant regressions; skip whole-repository scanning, threat-model rewrites and dependency replacement unless justified.

A compact inline outcome is sufficient for low-risk work. Retain essential
scope, permission and evidence checks even when formal planning stages are skipped.

## Blockers and handoff

If evidence or remediation approval is missing, continue authorized read-only review, leave findings open and report PARTIAL or BLOCKED for dependent edits; never mark approval obtained from a template or scanner pass.

Record DONE, PARTIAL or BLOCKED against completed stages and acceptance criteria,
with the blocker, independent work finished, pending authorization and next safe
action. Use a redacted Context Capsule for an actual handoff; fresh agents must
verify stale facts and the continuing scope of recorded approvals.
