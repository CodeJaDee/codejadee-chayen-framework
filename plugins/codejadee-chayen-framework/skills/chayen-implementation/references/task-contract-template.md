---
kind: template
---
# Task Contract

Use the repository's format first; otherwise copy only the relevant fields.
Present this artifact in conversation by default, writing a file only when the
user asks or the repository keeps such records. Keep low-risk reports compact.

## Template

```text
Task Contract
Status: PROPOSED
Goal: <requested observable outcome>
Scope source: <user instruction or authorized task reference>
In scope: <owners, behavior and permitted actions>
Out of scope: <explicit exclusions and untouched work>
Acceptance criteria: <observable checks, one per criterion>
Affected owners and versions: <from repository evidence>
Existing pattern: <analogous file and line>
Assumptions and unknowns: <fact needed and impact>
Approach: <small ordered stages and dependencies>
Risk and approval gates: <action, target, stage, risk reference>
Approval state: NOT_PROVIDED
Approval evidence: <actual source, approver or authorized process, date, exact scope; otherwise not provided>
Verification plan: <existing commands/methods per owner>
Outcome: IN_PROGRESS
Blocker / next safe action: <pending input, permission or check>
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
