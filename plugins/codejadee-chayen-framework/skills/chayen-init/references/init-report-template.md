---
kind: template
---
# Run report template

Write `.chayen/init-report.md` on every initialize, and on a refresh that
changes knowledge files. A refresh with no changes leaves the report as it
is. Keep the generated report at most 120 lines. It supports review of the run; agents do not read it on every task.

## Template

```markdown
---
schema: project-knowledge/1
file: init-report
generated_commit: <full commit hash, or none>
generated_date: <YYYY-MM-DD>
evidence:
  - path: <evidence file>
    blob: <git hash-object output, or none>
---
<!-- Generated. Replaced on initialize or refresh. -->

# Initialization report

Mode: <initialize, refresh, or profile one unit>
Date: <YYYY-MM-DD>
Generated commit: <same value as generated_commit>

## Units and stacks
| Unit | Path | Stack and version | Evidence |
|---|---|---|---|
| <name> | <folder> | <detected stack> | <path:line> |

## Files written or changed
| File | Result | Change summary |
|---|---|---|
| <.chayen/path> | <created, changed, unchanged, regenerated> | <what changed> |

## Inspection coverage
Read: <source count>/100 source, <test count>/20 test,
<migration count>/5 migration files. Folder scan depth: <up to 6>.

| Folder or file | Inspection | Reason or evidence |
|---|---|---|
| <path or grouped paths> | <folder scan, read fully, not inspected> | <why selected or skipped> |

## Commands
| Command | Source | Status | Actual outcome or reason not run |
|---|---|---|---|
| <command> | <path:line> | <VERIFIED, DISCOVERED> | <output summary, failure, declined, blocked> |

## Unknowns and evidence gaps
| Unknown or gap | Evidence checked | What would resolve it |
|---|---|---|
| <unconfirmed fact, missing wiring, or unprofiled area> | <paths or search> | <owner or next inspection> |

## Proposed improvements
<Proposals with evidence and rationale, clearly separated from facts; or none.>

## Recommended follow-up
1. <Next action, including paths skipped for budget or depth and why.>
2. Review the generated files and commit the intended .chayen/ changes.
```

## Completion rules

- Record what happened, not what was planned. Distinguish unchanged knowledge
  from regenerated report content. Never imply that a command passed merely
  because it ran. Include command side effects outside the write scope.
- List folders scanned, files read fully, and notable folders or files not
  inspected, with reasons. Group paths compactly without obscuring coverage.
- Record every budget or depth limit reached and the remaining work under
  follow-up. Do not expand the scan to fill gaps.
- Cite facts and evidence gaps. Use `inferred` or `unknown` where needed.
  Include blob and tree fingerprints for the evidence this report relies on.
- Keep proposals here and in conversation, never in profile or conventions.
- No secret values, connection strings, credentials, or personal data.
