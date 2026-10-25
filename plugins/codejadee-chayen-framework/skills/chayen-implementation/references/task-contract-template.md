---
kind: template
---
# Task Contract

Use the repository's format first; otherwise copy only the relevant fields.
Present this artifact in conversation by default, writing a file only when the
user asks or the repository keeps such records. Keep low-risk reports compact:
a proportional contract keeps Status, Goal, Acceptance criteria, Approach and
Verification plan, and a full contract (any risky action) uses every field.
The task-contract recipe decides which applies, or that none is needed.

## Template

```text
Task Contract
Status: PROPOSED | CONFIRMED by <user> (<date>)
Goal: <requested observable outcome>
Scope source: <user instruction or authorized task reference>
In scope: <owners, behavior and permitted actions>
Out of scope: <explicit exclusions and untouched work>
Acceptance criteria (acceptance record; Method and Environment before editing, the rest after verification):
| AC | Expected behaviour | Method | Environment | Evidence | Freshness | Check status | Verdict | Open issue |
| AC-1 | <observable outcome> | <test, request, browser check, query or review> | <where it must be observed> | <filled after verification> | <revision> | <PASSED / FAILED / SKIPPED / BLOCKED / NOT_RUN / UNKNOWN> | accept / verify_more / revise | <issue or none> |
Affected owners and versions: <from repository evidence>
Existing pattern: <analogous file and line>
Assumptions and unknowns: <fact needed and impact>
Approach: <small ordered stages and dependencies>
Risk and approval gates: <action, target, stage, risk reference; or none>
Risk class: <Low | Medium | High | Critical> (reason)
Approval state: NOT_PROVIDED
Approval evidence: <actual source, approver or authorized process, date, exact scope; otherwise not provided>
Verification plan: <existing commands/methods per owner>
Outcome: IN_PROGRESS
Blocker / next safe action: <pending input, permission or check>
```

## Completion rules

Replace field prompts with evidenced facts or explicit unknowns. Status
CONFIRMED records agreement to the contract only; Approval state records
approval of each risky action and target, and confirming the contract or the
task description never fills it. Never treat a filled template, generated
record, test pass or recommendation as approval.
NOT_PROVIDED remains until authorization for the exact action and target was
actually provided through an authorized process; record its source, scope,
authority and date without inventing identities or times. Retain valid prior
authorization within its scope instead of requesting it again unnecessarily.
Name the method and environment for each criterion before editing. Give
each criterion one verdict, following the change-summary recipe: accept
when fresh, adequate observed evidence shows it is met; verify_more when the
evidence is missing, partial, stale, not reproducible or from an inadequate
method; revise when the evidence contradicts it. A check status is never the
verdict, and a declaration is not evidence. Use DONE only for completed
scope, required verification and every required criterion at accept;
otherwise mark PARTIAL or BLOCKED and the next safe action. Commands not run are NOT_RUN,
not PASS or N/A. Redact secrets and personal data; handoffs revalidate stale
facts and the scope of approvals. ADRs begin PROPOSED; an accepted decision
never substitutes for execution approval. Templates contain no outbound links.
