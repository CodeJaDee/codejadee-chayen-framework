---
kind: checklist
---
# Database schema migration

A native agent follows this composite checklist only after its owning entry
skill and this workflow match the request. It coordinates existing recipes;
it is static guidance, not an executable workflow or a permission mechanism.

## When it applies

A requested relational schema or data evolution needs generated/script review, compatibility planning, rehearsal and an explicit action/environment approval boundary.

**Not when:** Query-only tuning, application changes without schema impact, or unrelated requests; continue normal native behavior for no match. A migration review does not authorize execution.

No matching workflow => continue normal native behavior. If the skill still
matches a smaller task, use its direct recipe without running this composite.

## Inputs

Requested schema outcome, actual engine/provider/tool, applied migration history, data volumes/load, application versions, target environment and action-specific authorizations.

Read repository instructions and the actual target before selecting stages.
Keep unknown inputs explicit; ask only for information that changes the result.

## Recipe reuse

Use existing procedures, not duplicate implementations. Each row names the
owning skill and its local recipe. For another owner's stage, hand off by skill
name through native behavior; do not assume automatic invocation or spawn agents.
Read only the needed recipe through that owner's References table.

| Owner | Existing recipe | Load when |
|---|---|---|
| `chayen-data` | `schema-and-data-migration.md` | schema-migration; load only when that stage applies |
| `chayen-data` | `schema-and-data-migration.md` | data-migration; load only when that stage applies |
| `chayen-data` | `schema-and-data-migration.md` | backfill-planning; load only when that stage applies |
| `chayen-data` | `data-quality-and-integrity.md` | data-integrity-validation; load only when that stage applies |
| `chayen-data` | `backup-restore.md` | backup-restore-drill; load only when that stage applies |

## Technology selection

Detect SQL Server versus PostgreSQL and actual version/edition/compatibility independently. Preserve EF, raw SQL or the existing migration tool; account for PostgreSQL concurrent index/DDL rules versus SQL Server locking and edition limits.

At each affected owner, detect the installed versions, configured commands and
existing conventions; load only its matching technology base plus relevant topic.
Do not preload all packs, select a framework from a sibling's manifest, install
tools to make a check green, or force migrations or dependency replacements.

## Stages

Each exit check gates only its dependent stage. Skip non-applicable stages
explicitly; a completed plan or static check does not prove runtime delivery.

| Stage | Inputs | Action and recipe | Exit check |
|---|---|---|---|
| Assess | Outcome, history and environment | Follow schema-and-data-migration; inventory consumers, data loss, lock/rewrite risk and rollback feasibility. | Risk and requested action/environment are explicit before any database mutation. |
| Prepare | Existing tool and scoped design | Prepare an authorized local draft or script; review generated SQL and expand/backfill/contract compatibility. | No applied migration rewritten; no shared/production action inferred. |
| Rehearse | Reviewed script and disposable target | Use data-quality-and-integrity and backup-restore where warranted; rehearse on the matching engine with representative data only when authorized. | Row counts, constraints, data transforms and rollback/restore limits have evidence. |
| Gate | Review and rehearsal evidence | Check recorded authorization for the exact apply/backfill/rollback action and environment; otherwise stop before execution. | Only a recorded authorized action may advance; a draft is not applied. |
| Close | Executed or pending stages | Report schema artifact, SQL review, rehearsal results, application compatibility and pending execution. | Outcome distinguishes prepared, rehearsed, applied and still blocked stages. |

## Outputs

Reviewed migration artifact/SQL, compatibility and risk plan, tested rollback or restore evidence when available, and a precise apply/not-applied record.

Use the repository's artifact format first; otherwise select these reusable
templates only as needed: Task Contract, Implementation Plan, Risk Assessment, Verification Report, Change Passport. The implementation owner holds
task/plan/risk/verification/passport formats, the architecture owner holds the
ADR, and the AI-engineering owner holds the Context Capsule. Request their
relevant artifact recipe by skill name rather than following cross-skill links.
Artifacts stay in conversation unless the user requests files or the repository
already keeps them. Do not generate all artifacts for every task.

## Verification

Use the actual migration tool's inspection commands and integration tests on the target engine; compare schema, constraints, counts and old/new app behavior. Mark production apply NOT_RUN unless explicitly authorized and executed.

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

A read-only migration review skips generation, database mutation and rehearsals unless requested; report findings directly. Never skip the authorization check because the DDL looks small.

A compact inline outcome is sufficient for low-risk work. Retain essential
scope, permission and evidence checks even when formal planning stages are skipped.

## Blockers and handoff

Missing target access, backup evidence or action-specific approval blocks only dependent apply/rehearsal stages; deliver a safe draft and report PARTIAL or BLOCKED without fabricating completion.

Record DONE, PARTIAL or BLOCKED against completed stages and acceptance criteria,
with the blocker, independent work finished, pending authorization and next safe
action. Use a redacted Context Capsule for an actual handoff; fresh agents must
verify stale facts and the continuing scope of recorded approvals.
