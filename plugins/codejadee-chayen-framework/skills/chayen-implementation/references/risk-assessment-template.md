---
kind: template
---
# Risk Assessment

Use the repository's format first; otherwise copy only the relevant fields.
Present this artifact in conversation by default, writing a file only when the
user asks or the repository keeps such records. Keep low-risk reports compact.

## Template

```text
Risk Assessment
Target, environment and scope: <actual owner/action>
Evidence and assumptions: <file:line, observed command result, unknowns>
Dimension | Impact / blast radius | Likelihood evidence | Control / rollback | Residual risk
Data | <loss, rewrite, privacy> | <evidence or unknown> | <control> | <risk>
Security | <identity, privilege, exposure> | <evidence or unknown> | <control> | <risk>
Availability | <locks, downtime, capacity> | <evidence or unknown> | <control> | <risk>
Compatibility | <consumers, versions, wire contract> | <evidence or unknown> | <control> | <risk>
Reversibility | <what cannot be undone> | <evidence or unknown> | <control> | <risk>
Overall class and reason: <Low / Medium / High / Critical; unknown blast radius is not Low>
Required approval: <exact action, scope, target and responsible authority>
Approval state: NOT_PROVIDED
Approval evidence: <actual authorized process record and date; otherwise not provided>
Recommendation: <proposed safe approach; not authorization>
Blocker / next evidence needed: <specific missing fact or gate>
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
