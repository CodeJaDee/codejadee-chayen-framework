---
kind: recipe
capabilities: [CAP-04-007, CAP-18-002, CAP-18-003]
---
# Change summary

The hand-off report for a completed change. It records what changed, the
evidence for it, the risks, and how to roll it back, so that someone else can
review or continue the work. Present it in the conversation. This file also
defines the completion semantics every report uses (the acceptance record,
the verdicts, and when a task is DONE) and the evidence audit, which
re-checks the claims in a summary or report and flags any that do not hold.

## Inputs

Use the repository's format first; otherwise `verification-report-template.md`
and `change-passport-template.md` are reusable output formats listed by the
entry skill, and `task-contract-template.md` holds the planned half of the
acceptance record. Select only the needed artifact, retain explicit NOT_RUN
checks, and record approval only from an actual authorized process, never
from a draft.

- The list of changed files, from the diff or the working tree status.
- The task contract, if one was used: its acceptance criteria, planned
  methods and environments, scope changes and approvals.
- Every build, test, lint, and typecheck command that was run, with the
  observed result and the revision it ran on. Also the baseline results
  recorded before editing.
- Open risks, unverified items, and the next steps for the receiver.

## Procedure

1. **Collect the changed files** from the diff or the working tree status.
   - Do not list files from memory.
   - Mark generated files (migrations, lock files, client code) as
     generated, with the command that produced them.
2. **Fill in the template below**, one line per changed file, saying what
   changed and why.
3. **Write the verification table** from the commands actually run.
   - Each row names the exact command, the environment, and the observed
     result.
   - Use the command and test statuses of the testing contract: PASS
     (PASSED), FAIL (FAILED), SKIPPED, BLOCKED, NOT_RUN, UNKNOWN. N/A needs
     a reason and never replaces an unavailable check.
   - A check that was not executed is NOT_RUN, with a reason. It is never
     omitted, and never reported as passing.
   - List baseline failures (observed before the change) separately from
     new ones. A failure with no baseline run is of unknown origin; do not
     attribute it to the baseline.
4. **Record each acceptance criterion** in the acceptance record:

   | Field | Content |
   |---|---|
   | AC | The identifier from the task contract (AC-1, AC-2, ...) |
   | Expected behaviour | The observable outcome |
   | Method | The planned verification: test, request and response, browser or device check, query or plan, review |
   | Environment | Where it must be observed: unit, local API, browser, device, disposable database, shared environment |
   | Evidence | A reference to the observed result: command and output excerpt, test name, screenshot, query result, `file:line` |
   | Freshness | The revision the evidence came from, or "after the last relevant edit"; evidence older than a relevant edit is stale |
   | Check status | The status of the check that produced the evidence (step 3 vocabulary) |
   | Verdict | accept, verify_more or revise (step 5) |
   | Open issue | What remains, or none |

   A simple change without a task contract uses one line instead:
   `Check: <expected> | <evidence> (<status>) | <verdict>`.
5. **Give each criterion one verdict from the evidence**, never from a
   declaration (the agent's own statement is not evidence):
   - **accept:** observed, fresh evidence from an adequate method, in the
     required environment, shows the criterion is met;
   - **verify_more:** the evidence is missing, partial, stale, not
     reproducible, from an inadequate method, or its check is SKIPPED,
     BLOCKED, NOT_RUN or UNKNOWN. A criterion with no test is uncovered and
     verify_more;
   - **revise:** the evidence contradicts the criterion.

   A check status never stands in for a verdict. Adequacy:

   | Evidence | Shows | Does not show on its own |
   |---|---|---|
   | Build or typecheck PASS | The code compiles | UI, runtime or browser behaviour |
   | Unit test PASS | The unit's logic | API authorization, the HTTP contract, cross-layer behaviour |
   | Diff | What code changed | Runtime behaviour |
   | Generated migration | The intended schema change | That it applies, rolls back, or preserves data |
   | A run in one environment | Behaviour there | Behaviour in a different required environment |

   These match the evidence-audit verdicts below: supported is accept,
   unsupported is revise, and not re-runnable is verify_more.
6. **Decide the task outcome.**
   - **DONE** only when the in-scope work is complete, every required
     criterion is accept, the required checks ran, and each risky action
     performed has recorded approval. Written code is never DONE by itself.
   - **PARTIAL** when work remains or any required criterion is
     verify_more; **BLOCKED** when progress needs input, access or approval.
     Name the next safe action.
   - A revise verdict blocks DONE until it is fixed or the criterion is
     changed with the user.
7. **Keep scope and approvals traceable.** List each scope change (contract
   revision and re-confirmation) and each approval (action, target,
   approver or process, source, date). Write "none" rather than leaving
   either out.
8. **Describe rollback**, including the data or migration steps that a plain
   revert would not undo.
9. **For a hand-over, add the next steps:** what is unfinished, which
   decision is pending, and the first action the receiver should take.
10. **Redact before sending.**
    - Remove tokens, passwords, connection strings, and personal data.
    - Write `<redacted>` in their place.
11. **Write to a file only** when the user asks, or when the repository keeps
    change records.

### Evidence audit (CAP-18-003)

1. **Extract every claim** from the report or summary: commands run and
   their results, files changed, tests added, acceptance criteria met,
   approvals obtained.
2. **Choose a re-check method per claim:** read the file or diff, re-run the
   command (when allowed), compare counts, or look for the recorded
   approval.
3. **Re-check and record the observed result** with the command and output.
4. **Give a verdict per claim:**
   - **supported:** the re-check reproduces it;
   - **unsupported:** the re-check contradicts it (for example a "passing"
     test that fails), with the observed output;
   - **not re-runnable:** the check needs an environment or access that is
     not available; say what would confirm it.
5. **Treat recommendations as recommendations.** An approval claim is
   supported only by a named person's recorded decision, never by an
   agent's or tool's recommendation.
6. **Re-derive the outcome** from the audited verdicts with step 6. A
   report that claims DONE while a required criterion is not accept is
   unsupported.

## Outputs

- A change summary (the change passport) in the template format:
  - intent, and the task contract link;
  - outcome (DONE, PARTIAL or BLOCKED);
  - files changed;
  - conventions followed;
  - verification table, with baseline failures separate;
  - acceptance record, with a verdict per criterion;
  - scope changes and approvals;
  - risks;
  - rollback;
  - not verified.
- For hand-overs, a short list of next steps for the receiver.
- For an evidence audit: a claim-by-claim table with the claim, re-check
  method, observed result, and verdict (supported, unsupported, not
  re-runnable).

## Template

```text
Change summary
Intent: <goal; link to the task contract if one was used>
Outcome: DONE / PARTIAL / BLOCKED (<next safe action unless DONE>)
Files changed:
- <path> — <what and why>
Conventions followed: <pattern> (modelled on <path>)
Verification:
| Check | Command | Environment | Result |
| Build | <cmd> | <env> | PASS / FAIL / NOT_RUN (<reason>) |
| Tests | <cmd> | <env> | PASS 42 / FAIL 0 / SKIPPED 1 — new: <test names> |
| Lint / typecheck | <cmd> | <env> | PASS / FAIL / NOT_RUN (<reason>) |
Baseline failures: <failing before the change, or none observed, or baseline NOT_RUN>
Acceptance record:
| AC | Expected behaviour | Method | Environment | Evidence | Freshness | Check status | Verdict | Open issue |
| AC-1 | <observable> | <method> | <where> | <reference> | <revision> | PASSED / FAILED / SKIPPED / BLOCKED / NOT_RUN / UNKNOWN | accept / verify_more / revise | <issue or none> |
Scope changes: <contract revisions and re-confirmations, or none>
Approvals: <action, target, approver or process, source, date; or none performed>
Risks and follow-ups: <items>
Rollback: <how to revert, including data or migration steps>
Not verified: <uncovered criteria and unexecuted checks, and why>
Next steps (hand-over only): <first action for the receiver>
```

## Rules

- **Keep it factual.** No claims such as "fully tested" or "production ready"
  unless the evidence supports them.
- **Never include secrets** in a summary: tokens, passwords, connection
  strings, or personal data.
- **List baseline failures separately**, so that they are not attributed to
  the change, and do not attribute an unexplained failure to the baseline.
- **No self-approval.** The summary never states that a change is approved
  unless a named person approved it, with where that is recorded.
- **No DONE without evidence.** DONE needs every required criterion at
  accept. A check status is not a verdict, and a declaration is not
  evidence.
- **Missing evidence stays visible.** An uncovered or unverified criterion
  appears in the acceptance record and under "Not verified".

## Technology considerations

Stack-neutral. The commands in the verification table are the repository's
own, for example `dotnet build`, `dotnet test`, `npm run build`,
`ng test --watch=false`, `vue-tsc --noEmit`, `pytest`. Name generated
artifacts by the tool that produced them, for example `dotnet ef migrations
add`, `alembic revision`, or the package manager that rewrote the lock file.
The adequate method depends on the layer: request-level tests for API
behaviour and authorization, browser, device or component tests for UI
behaviour, and an applied migration on a disposable database for schema
changes.

## Verification

- Every file in the working tree diff appears in "Files changed", and no
  other file appears there.
- Every verification row has a command, an environment and an observed
  result. Unexecuted checks are NOT_RUN with a reason.
- Every acceptance criterion from the task contract has an acceptance-record
  row with one verdict. A criterion without fresh, adequate evidence is
  verify_more, never accept.
- The outcome is DONE only when every required criterion is accept.
- Scope changes and approvals are listed, or "none" is written.
- The summary contains no secret values.
- The passport for a fixture change lists every changed file and labels a
  skipped lint run NOT_RUN.
- A fixture report claiming a passing test that actually fails is marked
  unsupported with the observed output.
