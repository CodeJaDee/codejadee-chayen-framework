---
kind: template
---
# Implementation Plan

Use the repository's format first; otherwise copy only the relevant fields.
Present this artifact in conversation by default, writing a file only when the
user asks or the repository keeps such records. Keep low-risk reports compact.

## Template

```text
Implementation Plan
Goal and contract: <request or Task Contract reference>
Scope and exclusions: <explicit affected owners and limits>
Baseline: <existing state, commands and pre-existing failures>
Technology selection: <owner, installed versions, matching topic and evidence>
Stage | Inputs / depends on | Existing recipe and proposed edits | Exit check | State
<stage> | <required evidence> | <owner and recipe> | <observable evidence> | NOT_STARTED
Risky actions: <action/environment and approval gate before execution>
Approval state: NOT_PROVIDED
Approval evidence: <actual authorized process record, exact scope and date; otherwise not provided>
Skipped stages: <why irrelevant or disproportionate>
Verification commands: <configured commands and environment>
Rollback / recovery: <reversibility and data limits>
Outcome: IN_PROGRESS
Blocker and independent work: <dependent stage blocked, other authorized work>
Next safe action: <bounded follow-up>
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
