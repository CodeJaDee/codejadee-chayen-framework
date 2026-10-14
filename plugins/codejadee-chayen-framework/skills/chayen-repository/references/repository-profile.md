---
kind: recipe
capabilities: [CAP-01-001, CAP-01-002, CAP-01-007]
---
# Repository profile

Produce an evidence-based profile of an existing repository. It covers what
the repository is, its stacks and versions, how it is laid out, how to build,
test, and run it, which conventions it follows, and which instruction files
govern changes. This serves onboarding, layout questions, convention
questions, and "where does X belong".

## Inputs

- Read access to the repository working tree.
- The question:
  - a full overview;
  - a layout map;
  - conventions for an area;
  - where a new piece belongs.
- An optional focus area (a service or package in a monorepo), or a role
  (backend, frontend, data).

## Procedure

1. **Instruction files.** Read `AGENTS.md`, `CLAUDE.md`,
   `.github/copilot-instructions.md`, `CONTRIBUTING.md`, and `README*`.
   Record each rule that affects code, tests, or commits, with its file.
2. **Stacks and versions.**
   - Read the manifest files present: `*.sln`, `*.slnx`, `*.csproj`,
     `global.json`, `package.json`, `angular.json`, `pyproject.toml`,
     `requirements*.txt`.
   - Use stack-detection.md, reading only the sections for those
     ecosystems.
   - Each version cites the file and line it came from.
3. **Layout map.** List:
   - the top-level directories, each with its purpose;
   - solution or workspace boundaries (projects in `*.sln`, npm, pnpm, or
     yarn workspaces, `pyproject.toml` packages);
   - deployable units (web apps, APIs, workers, functions);
   - entry points (`Program.cs`, `main.ts`, `server/` or `app/`
     directories, `manage.py`, `asgi.py`).

   A unit is deployable only when a build target, Dockerfile, or pipeline
   step shows it. Otherwise label it `inferred`.
4. **Real commands,** in this order of preference:
   1. CI definitions (`.github/workflows/`, `azure-pipelines.yml`,
      `.gitlab-ci.yml`);
   2. `package.json` scripts, `Makefile`, `justfile`, `tasks.json`;
   3. ecosystem defaults.

   Label each command `found` (with its source) or `inferred`.
5. **Conventions.** Sample two or three representative files per area. Cover:
   - naming;
   - feature-based or layer-based folders;
   - dependency injection;
   - error handling and result types;
   - validation;
   - test location and naming;
   - formatter and linter configuration (`.editorconfig`, ESLint,
     Prettier, Ruff, analyzers).

   Cite an example `path:line` for each convention. When two styles exist,
   report both and say which looks newer (from file dates or git history)
   or more common (by count).
6. **"Where does X belong".**
   1. Find the closest existing analogous feature.
   2. Trace its files through every layer.
   3. Recommend the same path, with the files to create or touch per layer.
7. **Unknowns.** List what the files do not show, for example the deployment
   target, environments, or secrets handling. Do not fill gaps with defaults.

## Outputs

```text
Repository profile — scope: <whole repo | area>
- Stacks and versions: <stack> <version> (found: <path>:<line>)
- Layout: <area> — <purpose> (deployable: yes/no/inferred)
- Entry points: <path>
- Build / test / lint: `<command>` (found: <path> | inferred)
- Conventions: <convention> (example: <path>:<line>)
- Instruction files and rules: <file>: <rule>
- Unknown or not found: <items>
- Not scanned: <areas and why>
```

| Question type | Output |
|---|---|
| Narrow question | A direct answer with cited paths |
| Layout map | The layout table: area, purpose, project or package, deployable |
| Conventions | The convention list with examples, and any conflicts side by side |
| "Where does X belong" | The analogous feature, the files per layer, and the conventions to follow |

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | Solution and project files define the boundaries. `Directory.Build.props` and `Directory.Packages.props` hold shared settings and central package versions. Read `TargetFramework` per project, because they can differ. |
| Angular | `angular.json` lists the projects and builders. Standalone components versus NgModules is a convention to report, not to choose. |
| JavaScript / TypeScript | Workspaces (npm, pnpm, yarn), and Nx or Turborepo configuration, define the packages. The lock file shows the package manager. Use that manager's commands. |
| React / Next.js / Vue / Nuxt / Vite | Routing style (App or Pages Router, `pages/` in Nuxt) and the state library are conventions to report. |
| Python | `pyproject.toml` (Poetry, uv, Hatch, or setuptools) or `requirements*.txt` defines dependencies. Report the test runner configuration (`pytest.ini`, `[tool.pytest]`). |
| SQL Server / PostgreSQL | The migration folders (EF Core `Migrations/`, Flyway, Alembic, Prisma) show how the schema is managed. |

## Verification

- Every stack, version, and command line cites a file, or is labeled
  `inferred`.
- Commands that were not executed are labeled "not run". If the user asks
  for confirmation and running is permitted, run the build or test command
  once and report the actual result.
- Every convention has at least one example `path:line`.
- No file was modified: `git status` is unchanged.
