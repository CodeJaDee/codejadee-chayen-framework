---
kind: template
---
# Conventions template

Draft `.chayen/conventions.md` from this template. Keep explicit standards and
observed patterns apart, so that nobody mistakes a habit seen in the code for
a rule the team approved.

## Template

```markdown
---
schema: project-knowledge/1
file: conventions
generated_commit: <full commit hash, or none>
generated_date: <YYYY-MM-DD>
evidence:
  - path: <evidence file>
    blob: <git hash-object output, or none>
---
<!-- Generated. Refresh it instead of editing it by hand. Team rules go in rules.md. -->

# Conventions

## Explicit
Standards set by configuration or approved documents.

| Area | Standard | Source |
|---|---|---|
| <formatting, analyzers, lint, commits> | <what it requires> | <path:line> |

## Observed
Patterns the code follows today. They describe the current code and are not
mandatory unless the team moves them to rules.md.

| Area | Pattern | Examples | Exceptions seen |
|---|---|---|---|
| <naming, folders, DI, errors, validation, logging, async, data access, tests> | <pattern> | <path:line>, <path:line> | <path:line, or none> |

## Conflicts
| Area | Pattern A (examples) | Pattern B (examples) | Which looks newer or more common |
|---|---|---|---|
```

## Completion rules

- An explicit standard cites the configuration file or document that sets it.
- An observed pattern cites at least two examples. One example is an
  anecdote; record it as `inferred` or leave it out.
- Recommendations and proposed improvements never go in this file. Report
  them in conversation.
- Keep the file at most 200 lines. Unit-specific patterns go in unit files.
