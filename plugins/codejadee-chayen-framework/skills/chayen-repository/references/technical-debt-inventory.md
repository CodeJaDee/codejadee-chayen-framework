---
kind: recipe
capabilities: [CAP-01-008]
---
# Technical debt inventory

Catalogue observable technical debt with evidence, without ranking it.
Prioritization is a separate decision that belongs to the team. Every item is
something the repository shows, not an opinion about style.

## Inputs

- Read access to the repository, and an optional scope (a project, folder,
  or layer).
- Optional tool output the user provides or allows: build warnings, coverage
  reports, outdated-package reports, linter results.
- Permission before any command that contacts a package registry.

## Procedure

1. **Fix the scope and the categories.** Use the categories below. Skip any
   that the user excludes.
2. **Collect evidence per category,** with read-only searches and commands:

   | Category | Signals to look for |
   |---|---|
   | Outdated or end-of-life platform | `TargetFramework` (`net5.0`, `netcoreapp3.1`), Node `engines`, Angular, React, or Vue majors, the Python `requires-python`, compared with the vendor's published support status. Mark the support status `unknown` if it is not checked. |
   | Outdated dependencies | Lock files and manifests. With permission: `dotnet list package --outdated`, `npm outdated`, `pip list --outdated`. |
   | Deprecated API use | `[Obsolete]`, `@deprecated`, and deprecation warnings in build output |
   | Suppressed warnings | `#pragma warning disable`, `NoWarn`, `eslint-disable`, `// @ts-ignore`, `# noqa`, `# type: ignore` |
   | Disabled or missing tests | `[Fact(Skip=`, `xit(`, `it.skip(`, `@pytest.mark.skip`. Projects or packages with no test counterpart. Coverage report gaps, if provided. |
   | Debt markers | Counts of `TODO`, `FIXME`, `HACK`, and `XXX` comments per area, with a few examples |
   | Size and complexity hotspots | The largest source files and longest functions or classes, found by line count. Complexity metrics only if a tool is installed. |
   | Duplication | Repeated blocks found by search, or a duplication tool's report if one is installed |
   | Inconsistent patterns | Two coexisting ways of doing the same thing, for example two HTTP clients, two validation libraries, or two logging styles |
   | Build and configuration debt | Copy-pasted configuration per environment, unused projects, scripts referenced nowhere |

3. **Record each item** with its location and its evidence: a command and
   count, or `path:line` examples.
4. **Assign a rough effort class** (S, M, or L), with a one-line reason. Do
   **not** assign priority or business impact. Those are the team's call.
5. **List the areas not scanned,** and the checks not run (for example
   registry checks without permission).

## Outputs

```text
Technical debt register — scope: <scope>
| ID | Category | Location | Evidence (command/count or path:line) | Effort class | Label |
| TD-01 | Suppressed warnings | src/Billing | 14 × `#pragma warning disable CS8618` (grep) | M | found |
Not scanned / not run: <areas, checks>
```

- No priority column, and no code changes.
- Prioritizing is a separate, later task.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | Build warnings (`dotnet build -warnaserror` is not needed: read the warning list), analyzer suppressions in `.editorconfig` or `GlobalSuppressions.cs`, mixed `TargetFramework` values across projects |
| Angular | `ng update` output (dry run only, with permission) lists available migrations. Mixed NgModule and standalone components is a pattern inconsistency, not automatically debt. |
| React / Next.js / Vue / Nuxt / Vite | Mixed router styles or state libraries. Class components in a hooks codebase. Options and Composition API mixed. |
| JavaScript / TypeScript | `any` and `@ts-ignore` counts. Several package managers' lock files present at once. |
| Python | `# type: ignore` counts. No lock file. Pinned versions that block upgrades. |
| SQL Server / PostgreSQL | Unused tables or procedures are only `inferred` without usage data. Migrations that were edited after being applied. |

## Verification

- Every register row has evidence that can be reproduced: the search term,
  command, or `path:line` examples.
- Counts state the search pattern used.
- No row contains a priority or business-impact judgement.
- Registry and network checks are reported as run, with permission, or
  "not run".
- No file was modified.
