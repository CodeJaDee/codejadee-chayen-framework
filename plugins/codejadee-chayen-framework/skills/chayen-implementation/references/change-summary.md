# Change summary

The hand-off report for a completed change. Present it in the conversation.

- Write it to a file only when the user asks, or when the repository keeps
  change records.

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
| Lint / typecheck | <cmd> | ... |
Acceptance criteria: 1 → <test or check>, 2 → ...
Risks and follow-ups: <items>
Rollback: <how to revert, including data or migration steps>
Not verified: <items and why>
```

## Evidence rules

- **Each verification row names the exact command** and the observed
  result.
  - A check that was not executed is NOT_RUN, with a reason.
  - It is never omitted, and never reported as passing.
- **Pre-existing failures** from the baseline are listed separately from
  new ones.
- **Generated files**, such as migrations or lock files, are named as
  generated, with the command that produced them.
- **Never include secrets** in a summary: tokens, passwords, connection
  strings, or personal data. Redact them as `<redacted>`.
- **Keep it factual.** No claims such as "fully tested" or "production
  ready" unless evidence supports them.
