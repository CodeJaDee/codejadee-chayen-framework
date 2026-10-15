---
kind: recipe
capabilities: [CAP-04-007, CAP-18-002, CAP-18-003]
---
# Change summary

The hand-off report for a completed change. It records what changed, the
evidence for it, the risks, and how to roll it back, so that someone else can
review or continue the work. Present it in the conversation. The same
file defines the evidence audit, which re-checks the claims in a summary or
report and flags any that do not hold.

## Inputs

Use the repository's format first; otherwise `verification-report-template.md`
and `change-passport-template.md` are reusable output formats listed by the
entry skill. Select only the needed artifact, retain explicit NOT_RUN checks,
and record approval only from an actual authorized process, never from a draft.

- The list of changed files, from the diff or the working tree status.
- The task contract, if one was used, and its acceptance criteria.
- Every build, test, lint, and typecheck command that was run, with the
  observed result. Also the baseline failures recorded before editing.
- Open risks, unverified items, and the next steps for the receiver.

## Procedure

1. **Collect the changed files** from the diff or the working tree status.
   - Do not list files from memory.
   - Mark generated files (migrations, lock files, client code) as
     generated, with the command that produced them.
2. **Fill in the template below**, one line per changed file, saying what
   changed and why.
3. **Write the verification table** from the commands actually run.
   - Each row names the exact command and the observed result.
   - A check that was not executed is NOT_RUN, with a reason. It is never
     omitted, and never reported as passing.
   - List pre-existing baseline failures separately from new ones.
4. **Map each acceptance criterion** to the test or check that demonstrates
   it, or mark it not verified.
5. **Describe rollback**, including the data or migration steps that a plain
   revert would not undo.
6. **For a hand-over, add the next steps:** what is unfinished, which
   decision is pending, and the first action the receiver should take.
7. **Redact before sending.**
   - Remove tokens, passwords, connection strings, and personal data.
   - Write `<redacted>` in their place.
8. **Write to a file only** when the user asks, or when the repository keeps
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

## Outputs

- A change summary (the change passport) in the template format:
  - intent, and the task contract link;
  - files changed;
  - conventions followed;
  - verification table;
  - acceptance mapping;
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
Files changed:
- <path> — <what and why>
Conventions followed: <pattern> (modelled on <path>)
Verification:
| Check | Command | Result |
| Build | <cmd> | PASS / FAIL / NOT_RUN (<reason>) |
| Tests | <cmd> | PASS 42 / FAIL 0 / SKIPPED 1 — new: <test names> |
| Lint / typecheck | <cmd> | PASS / FAIL / NOT_RUN (<reason>) |
Acceptance criteria: 1 → <test or check>, 2 → <test or check>
Risks and follow-ups: <items>
Rollback: <how to revert, including data or migration steps>
Not verified: <items and why>
Next steps (hand-over only): <first action for the receiver>
```

## Rules

- **Keep it factual.** No claims such as "fully tested" or "production ready"
  unless the evidence supports them.
- **Never include secrets** in a summary: tokens, passwords, connection
  strings, or personal data.
- **List baseline failures separately**, so that they are not attributed to
  the change.
- **No self-approval.** The summary never states that a change is approved
  unless a named person approved it, with where that is recorded.

## Technology considerations

Stack-neutral. The commands in the verification table are the repository's
own, for example `dotnet build`, `dotnet test`, `npm run build`,
`ng test --watch=false`, `vue-tsc --noEmit`, `pytest`. Name generated
artifacts by the tool that produced them, for example `dotnet ef migrations
add`, `alembic revision`, or the package manager that rewrote the lock file.

## Verification

- Every file in the working tree diff appears in "Files changed", and no
  other file appears there.
- Every verification row has a command and an observed result. Unexecuted
  checks are NOT_RUN with a reason.
- Every acceptance criterion from the task contract is mapped, or listed as
  not verified.
- The summary contains no secret values.
- The passport for a fixture change lists every changed file and labels a
  skipped lint run NOT_RUN.
- A fixture report claiming a passing test that actually fails is marked
  unsupported with the observed output.
