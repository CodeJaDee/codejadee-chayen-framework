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

## Add a new <kind>
<Repeat for each evidenced kind: endpoint or handler, page or component,
migration, background job, unit test, integration test.>

Example: `<path:line>`
<Insert a fenced excerpt copied from that file, at most 20 lines.>

1. Create the file under `<folder>` (`<path:line>`).
2. Name it `<observed naming>` (`<path:line>`).
3. Register or wire it through `<DI, route, module list, or discovery>`
   (`<path:line>`). If automatic, cite what makes it automatic.
```

## Completion rules

- An explicit standard cites the configuration file or document that sets it.
- An observed pattern cites at least two examples. One example is an
  anecdote; record it as `inferred` or leave it out.
- For each change kind present, include a real excerpt with `path:line` and
  ordered folder, naming, and wiring steps, each cited. In multi-unit
  repositories, put the recipes in the owning unit file instead.
- Keep excerpts short, usually 3–8 lines; never exceed 20. Preserve the
  source text and redact secrets. Do not invent a generic example.
- For an absent kind, write "not present" with evidence. For an uninspected
  kind, write `unknown` and name the gap in `init-report.md`.
- Never leave a present area as a stub. "Handles business logic", "contains
  various utilities", and "follows standard patterns" need concrete
  specifics and a citation immediately after them, or remove them.
- Recommendations and proposed improvements never go in this file. Put
  them in `init-report.md` and summarize them in conversation.
- Keep the file at most 200 lines. Unit-specific patterns go in unit files.
  Shorten excerpts and repeated prose before cutting any evidenced recipe.
