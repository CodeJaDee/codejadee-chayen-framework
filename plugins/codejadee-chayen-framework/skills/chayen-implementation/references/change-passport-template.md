---
kind: template
---
# Change Passport

Use the repository's format first; otherwise copy only the relevant fields.
Present this artifact in conversation by default, writing a file only when the
user asks or the repository keeps such records. Keep low-risk reports compact.

## Template

```text
Change Passport
Intent and contract: <user outcome and task reference>
Scope outcome: PARTIAL
Files changed: <actual diff; mark pre-existing/generated files>
Behavior and contract effects: <intentional before/after>
Recipes and technology: <owners and versions actually used>
Acceptance to evidence: <AC-n -> evidence reference, freshness, check status, verdict (accept / verify_more / revise); uncovered criteria listed>
Actual verification: <exact commands, observed outcomes and evidence references>
Unexecuted verification: <NOT_RUN with reason; baseline failures separate>
Scope changes: <contract revisions and re-confirmations, or none>
Risks and rollback: <code/config/data limits and next gate>
Dependencies and migrations: <authorized changes; prepared vs applied>
Approval state: NOT_PROVIDED
Approval evidence: <action, target, authorizing person/process, source and date actually supplied>
Release recommendation: NOT_ASSESSED
External actions performed: <actual publication/deploy/etc evidence or none>
Remaining work / next safe action: <bounded continuation>
```

## Completion rules

Replace field prompts with evidenced facts or explicit unknowns. Never treat
a filled template, generated record, test pass or recommendation as approval.
NOT_PROVIDED remains until authorization for the exact action and target was
actually provided through an authorized process; record its source, scope,
authority and date without inventing identities or times. Retain valid prior
authorization within its scope instead of requesting it again unnecessarily.
Use DONE only for completed scope, required verification and every required
criterion at accept, as defined in the change-summary recipe; otherwise mark
PARTIAL or BLOCKED and the next safe action. A check status is never a
criterion verdict, and a declaration or written code is not evidence.
Commands not run are NOT_RUN, not PASS or N/A. Redact secrets and personal data; handoffs revalidate stale
facts and the scope of approvals. ADRs begin PROPOSED; an accepted decision
never substitutes for execution approval. Templates contain no outbound links.
