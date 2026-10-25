---
kind: template
---
# Verification Report

Use the repository's format first; otherwise copy only the relevant fields.
Present this artifact in conversation by default, writing a file only when the
user asks or the repository keeps such records. Keep low-risk reports compact.

## Template

```text
Verification Report
Scope, acceptance and versions: <affected owners and required behavior>
Baseline failures: <prior command/output references, none observed, or baseline NOT_RUN>
AC / claim | Method / exact command | Environment | Evidence | Freshness | Check status
<AC-n or claim> | <existing command or file:line> | <target/version> | <no result yet; reason> | <revision> | NOT_RUN
Acceptance verdicts: <AC-n: accept / verify_more / revise, from fresh adequate evidence; a check status is never the verdict>
Independent review: <per AC: claim | evidence source | independent method | observed outcome | confidence limitation | verdict | next action, by a reviewer who did not make the change; or NOT_PERFORMED>
Negative and denied paths: <checks and actual evidence or NOT_RUN>
Affected consumers: <checked owners; untested owners explicit>
Skipped checks: <NOT_RUN reason and reproducible next command>
Non-applicable checks: <N/A with reason; not a substitute for unavailable>
Result summary: <count PASS / FAIL / SKIPPED / BLOCKED / NOT_RUN / UNKNOWN / N/A from actual evidence>
Scope outcome: PARTIAL
Remaining blockers: <missing required verification, input or access>
Approval state: NOT_PROVIDED
Approval evidence: <actual authorization only; tests are not approval>
Next safe action: <smallest check that closes the gap>
```

## Completion rules

Replace field prompts with evidenced facts or explicit unknowns. Never treat
a filled template, generated record, test pass or recommendation as approval.
NOT_PROVIDED remains until authorization for the exact action and target was
actually provided through an authorized process; record its source, scope,
authority and date without inventing identities or times. Retain valid prior
authorization within its scope instead of requesting it again unnecessarily.
Command and test statuses (PASS or PASSED, FAIL or FAILED, SKIPPED,
BLOCKED, NOT_RUN, UNKNOWN) describe checks; accept, verify_more and revise
describe acceptance criteria, as defined in the change-summary recipe, and
one never replaces the other. A build pass does not show browser behaviour,
a unit test does not show API authorization, and a diff does not show
runtime behaviour. Use DONE only for completed scope, required verification
and every required criterion at accept; otherwise mark PARTIAL or BLOCKED
and the next safe action. Commands not run are NOT_RUN, not PASS or N/A. Redact secrets and personal data; handoffs revalidate stale
facts and the scope of approvals. ADRs begin PROPOSED; an accepted decision
never substitutes for execution approval. Templates contain no outbound links.
