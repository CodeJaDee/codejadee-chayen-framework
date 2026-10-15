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
Baseline failures: <prior command/output references or none observed>
Criterion / claim | Method / exact command | Environment | Observed result / evidence | Status
<criterion> | <existing command or file:line> | <target/version> | <no result yet; reason> | NOT_RUN
Negative and denied paths: <checks and actual evidence or NOT_RUN>
Affected consumers: <checked owners; untested owners explicit>
Skipped checks: <NOT_RUN reason and reproducible next command>
Non-applicable checks: <N/A with reason; not a substitute for unavailable>
Result summary: <count PASS / FAIL / NOT_RUN / N/A from actual evidence>
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
Use DONE only for completed scope and required verification; otherwise mark
PARTIAL or BLOCKED and the next safe action. Commands not run are NOT_RUN,
not PASS or N/A. Redact secrets and personal data; handoffs revalidate stale
facts and the scope of approvals. ADRs begin PROPOSED; an accepted decision
never substitutes for execution approval. Templates contain no outbound links.
