---
kind: template
---
# Project profile template

Draft `.chayen/profile.md` from this template, and `.chayen/units/<unit>.md`
from the unit template below when the repository has more than one unit.
Fill every field with evidence or `unknown`; delete a section only when it
does not apply to the repository, and never leave template prompts behind.

## Template

```markdown
---
schema: project-knowledge/1
file: profile
generated_commit: <full commit hash, or none>
generated_date: <YYYY-MM-DD>
evidence:
  - path: <evidence file>
    blob: <git hash-object output, or none>
---
<!-- Generated. Refresh it instead of editing it by hand. Team rules go in rules.md. -->

# Project profile

## Overview
<What the project does, from README or docs with a citation; otherwise unknown.>

## Units
| Unit | Path | Kind | Stack and version | Entry point | Detail |
|---|---|---|---|---|---|
| <name> | <folder> | <API, web app, worker, library> | <stack version (path:line)> | <path> | <units/name.md, or this file> |

## Commands
| Purpose | Command | Unit | Source | Status |
|---|---|---|---|---|
| <build, test, lint, run> | `<command>` | <unit> | <path:line> | <DISCOVERED, VERIFIED, inferred> |

## Data
<Database provider, data-access library, migration tool and folder, per unit, with citations.>

## Architecture
<Three to ten lines: layers or modules and dependency direction, each with evidence. Name an architectural style only when at least two cited files show it; otherwise describe what is there.>

## Where things go
| To add | Put it in | Follow this example |
|---|---|---|
| <endpoint, component, migration, test> | <folder> | <path> |

## Integrations
| External system | Evidence |
|---|---|
| <name only> | <path:line> |

## Do not edit
<Generated, vendored, and build output folders.>

## Instruction files
| File | Rules that affect changes |
|---|---|

## Unknowns
| Unknown | What would resolve it |
|---|---|
```

## Unit file template

```markdown
---
schema: project-knowledge/1
file: unit
unit: <name>
generated_commit: <full commit hash, or none>
generated_date: <YYYY-MM-DD>
evidence:
  - path: <evidence file>
    blob: <git hash-object output, or none>
---
<!-- Generated. Refresh it instead of editing it by hand. Team rules go in rules.md. -->

# Unit: <name>

## Stack
## Commands
## Where things go
## Conventions specific to this unit
## Unknowns
```

## Completion rules

- Labels follow the skill: `found` facts cite evidence, `inferred` facts give
  their reasoning, and `unknown` names what would resolve it.
- Every cited file appears in the `evidence` list with its blob.
- Keep `profile.md` at most 150 lines and a unit file at most 120 lines. When
  `profile.md` grows past its budget, move unit detail to unit files.
- No secret values, connection strings, hostnames with credentials, or
  personal data. Record key names and locations only.
