---
kind: template
---
# Architecture Decision Record

Use the repository's format first; otherwise copy only the relevant fields.
Present this artifact in conversation by default, writing a file only when the
user asks or the repository keeps such records. Keep low-risk reports compact.

## Template

```text
# ADR-<repository-number>: <decision title>
Status: PROPOSED
Date and owner: <record date and responsible decision owner>
Context and constraints: <evidence, existing accepted decisions and decision question>
Options: <keep current approach plus realistic alternatives>
Criteria and evidence: <trade-offs; distinguish found facts from inference>
Proposed decision: <recommendation and scope>
Consequences: <benefits, risks, compatibility and follow-up>
Supersedes / related: <existing record IDs if relevant>
Decision approval state: NOT_PROVIDED
Decision approval evidence: <actual authorized decision owner/process, source and date; otherwise not provided>
Execution approval state: NOT_PROVIDED
Execution approval evidence: <separate exact action/environment authorization if actually supplied>
Validation / revisit: <observable checks and reconsideration triggers>
Unresolved blockers: <unknown facts or pending decision>
```

## Completion rules

Replace field prompts with evidenced facts or explicit unknowns. Never treat
a filled template, generated record, test pass or recommendation as approval.
NOT_PROVIDED remains until authorization for the exact action and target was
actually provided through an authorized process; record its source, scope,
authority and date without inventing identities or times. Retain valid prior
authorization within its scope instead of requesting it again unnecessarily.
Use DONE only for completed scope, required verification and, where the task has acceptance criteria, every required criterion at accept; otherwise mark
PARTIAL or BLOCKED and the next safe action. Commands not run are NOT_RUN,
not PASS or N/A. Redact secrets and personal data; handoffs revalidate stale
facts and the scope of approvals. ADRs begin PROPOSED; an accepted decision
never substitutes for execution approval. Templates contain no outbound links.
