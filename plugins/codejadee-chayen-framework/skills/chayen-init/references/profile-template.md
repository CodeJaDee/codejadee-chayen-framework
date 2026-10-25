---
kind: template
---
# Project profile template

Draft `.chayen/profile.md` from this template, and `.chayen/units/<unit>.md`
from the unit template below when the repository has more than one unit.
Fill every field with evidence or `unknown`. For an absent area, write a
short "not present" line with evidence. Never leave template prompts or
empty sections behind.

The unit file is also the unit's change-impact map: its boundary and
dependencies, entry points, API ownership and consumers, data, tests,
generated code, and dynamic references. In a single-unit repository, add
those map sections to `profile.md` instead. The map sections are additive to
schema `project-knowledge/1`: a file without them is valid, and a refresh
adds them directly and records the changes in `init-report.md`.

For a single unit spanning several areas, group the map sections under
`## Backend`, `## Frontend`, `## Data` and `## Testing`, including only
evidenced areas. Use subheadings for architecture, entry points, APIs and
dynamic references within the owning area. Keep shared overview, commands
and instruction rules outside those groups. Put absent-area evidence in
the overview, not under an empty area heading. Put "Add a new X" recipes
in `conventions.md`; use the conventions template's recipe format.

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
| To add | Put it in | Recipe |
|---|---|---|
| <endpoint, component, migration, test> | <folder> | <conventions.md recipe heading> |

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
  - path: <evidence folder, for example the migrations folder>
    tree: <git rev-parse HEAD:<folder> output, or none>
---
<!-- Generated. Refresh it instead of editing it by hand. Team rules go in rules.md. -->

# Unit: <name>

## Stack
<Frameworks and versions (path:line), and the main dependency declarations: packages this unit uses directly, with versions.>

## Boundary and dependencies
| Depends on | Kind | Evidence |
|---|---|---|
| <unit or package> | <project reference, workspace dependency, package> | <path:line> |

## Entry points
| Entry point | Kind | Evidence |
|---|---|---|
| <path> | <host startup, route module, CLI, job, exported API> | <path:line> |

## API ownership and consumers
| API or contract | Owned in | Consumers | Evidence |
|---|---|---|---|
| <route group, OpenAPI file, event> | <path> | <unit or client path, or unknown> | <path:line> |

## Data
<Database provider and data-access library from package references, model and migration locations, migration command.>

## Tests
| Test project or folder | Covers | Command | Status |
|---|---|---|---|
| <path> | <what it tests> | `<command>` | <DISCOVERED, VERIFIED, inferred> |

## Commands

## Generated code
| Generated path | Generator and source | Regenerate with |
|---|---|---|

## Dynamic references
| Mechanism | Where | Evidence |
|---|---|---|
| <reflection, assembly scanning, string routes, dynamic SQL, lazy routes> | <path> | <path:line, or none found; searched: <terms>> |

## Where things go
<Insert the conventions template's "Add a new X" recipes for each kind this
unit has, with a real excerpt of at most 20 lines and cited ordered steps.>
## Conventions specific to this unit
## Unknowns
```

## Completion rules

- Labels follow the skill: `found` facts cite evidence, `inferred` facts give
  their reasoning, and `unknown` names what would resolve it.
- Every cited file appears in the `evidence` list with its blob, and every
  folder the map summarizes (migrations, generated clients, test projects)
  with its tree id.
- A dependency, consumer, or dynamic reference is listed only with a
  `path:line` that shows it. A consumer that the repository does not
  evidence is `unknown`, never "none". "None found" for dynamic references
  names the terms searched.
- Keep `profile.md` and each unit file at most 150 lines. When `profile.md`
  grows past its budget in a multi-unit repository, move unit detail to
  unit files. Keep a single unit's map in `profile.md`. Use compact tables,
  short excerpts and concise steps so unit maps and recipes fit together;
  never drop an evidenced recipe to fit the budget.
- Never leave a present area as a stub. "Handles business logic", "contains
  various utilities", and "follows standard patterns" need concrete
  specifics and a citation immediately after them, or remove them.
- Put proposals in `init-report.md`, never in profile facts or conventions.
- No secret values, connection strings, hostnames with credentials, or
  personal data. Record key names and locations only.
