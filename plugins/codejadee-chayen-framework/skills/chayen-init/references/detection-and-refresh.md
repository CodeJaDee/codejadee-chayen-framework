---
kind: checklist
---
# Detection and refresh checklist

Collect the facts for the project knowledge files from repository evidence,
record fingerprints so later runs can tell what changed, and limit a refresh
to the evidence that changed. Detection uses read-only commands. Run build
and test commands only when the user's request asks for them.

## Reading budget

- [ ] Scan the folder structure before opening source files, up to depth 6
      from the repository root. Skip generated and vendored trees. Do not
      expand the scan beyond this depth; report deeper areas for follow-up.
- [ ] Choose 3–10 representative files per category within each selected
      unit: startup and wiring, endpoints or handlers, pages or components,
      data access, background jobs, unit tests, integration tests, migrations.
      Read each selected file fully. Read fewer only when fewer exist or a
      run limit intervenes; record that evidence gap.
- [ ] Across all units, read at most 100 source files, 20 test files, and
      5 migration files per run. Count a file once, in its most specific
      category: tests and migrations have separate limits from source.
      Share the 20-file test budget across unit and integration tests.
- [ ] Track inspected folders and files. Record notable paths not inspected
      with the reason in `init-report.md`. At a limit, do not expand the
      scan or read partial files to fit more in. Put the remaining paths,
      incomplete recipes, and evidence gaps under follow-up. Never label
      an area absent merely because it was outside the budget.

## Units

- [ ] List workspace and solution boundaries: `*.sln`, `*.slnx`,
      `package.json` workspaces, `pnpm-workspace.yaml`, `nx.json`,
      `turbo.json`, `pyproject.toml`, `go.work`, Maven or Gradle modules.
- [ ] A unit is deployable only when a build target, Dockerfile, or pipeline
      step shows it. Otherwise label it `inferred`.
- [ ] Name each unit after its folder. One unit means no `units/` directory.
- [ ] Detect each unit separately. A sibling's dependencies are not evidence
      for another unit.

## Stacks, versions, and data access

- [ ] Read the manifests present: `*.csproj`, `Directory.Build.props`,
      `Directory.Packages.props`, `global.json`, `package.json` with its lock
      file, `angular.json`, `next.config.*`, `nuxt.config.*`,
      `vite.config.*`, `pyproject.toml`, `requirements*.txt`, `go.mod`,
      `pom.xml`, `build.gradle*`, `Cargo.toml`, `composer.json`, `Gemfile`.
- [ ] Cite the file and line for every version. When a manifest gives a
      range, take the resolved version from the lock file, or record the
      range and label it `inferred`.
- [ ] Never infer one framework from another: React does not imply Next.js,
      Vue does not imply Nuxt, and neither implies Vite.
- [ ] Database: record the provider package or driver and the migration tool
      and folder. SQL Server and PostgreSQL are never interchangeable.
      Connection settings: key names only.

## Commands

- [ ] Prefer, in order: CI definitions (`.github/workflows/`,
      `azure-pipelines.yml`, `.gitlab-ci.yml`), then `package.json` scripts,
      `Makefile`, `justfile`, `tasks.json`, then ecosystem defaults.
- [ ] Record each command with its source. Status is `DISCOVERED`, or
      `VERIFIED` only after it ran in this session with permission.
      Ecosystem defaults with no source are `inferred`.
- [ ] Inspect a script before proposing to run it, and never run one that
      deploys, migrates, publishes, or deletes.
- [ ] When the request asks for it, run the inspected build and test
      commands and mark them `VERIFIED`. Record the command and actual
      outcome in the report, including failures. Otherwise leave them
      `DISCOVERED` without asking. Do not install dependencies to make a
      command work.

## Layout and conventions

- [ ] For each kind the repository has, write an "Add a new X" recipe:
      endpoint or handler, page or component, migration, background job,
      unit test, integration test. Put recipes in `conventions.md`, or the
      owning unit file in a multi-unit repository. Use the recipe format
      in the conventions template; do not stop at an example path.
- [ ] Copy a real excerpt of at most 20 lines and cite its `path:line`.
      Prefer a short excerpt that shows the pattern. Give ordered steps
      for the folder, naming, and registration or wiring (DI, routes,
      module lists, test discovery, migration discovery). Cite every step.
      If wiring is automatic, cite the configuration or convention that
      shows it; if evidence is missing, say `unknown` and record follow-up.
- [ ] Within the reading budget, inspect naming, folder style, dependency
      injection, error and result handling, validation, logging, async
      usage, data access, test location and naming.
- [ ] An observed pattern needs at least two `path:line` examples. Record
      exceptions you saw.
- [ ] Explicit standards come only from `.editorconfig`, linter and
      formatter configuration, analyzer settings, `CONTRIBUTING.md`, ADRs,
      and instruction files. Cite each one.
- [ ] Skip generated and vendored content: `bin/`, `obj/`, `node_modules/`,
      `dist/`, `build/`, `.angular/`, `.next/`, `.nuxt/`, `.output/`,
      `coverage/`, `.venv/`, and generated clients. List them under folders
      not to edit.
- [ ] In a single unit spanning several areas, group the profile's map
      sections under Backend, Frontend, Data and Testing. Include only
      evidenced area headings. For absent areas, add a short "not present"
      line with the searched paths or configuration as evidence.
- [ ] Fill every present area with concrete findings and citations. Never
      leave stubs. "Handles business logic", "contains various utilities",
      and "follows standard patterns" need concrete specifics and a citation
      immediately after them, or remove them. Record proposed improvements
      in `init-report.md`, never in profile or conventions.

## Impact map (per unit)

Record only what evidence shows. Each row cites `path:line`; anything else
is `unknown`. Keep the map to the facts a later change needs, not a full
inventory.

- [ ] **Boundary and dependencies:** declared edges only: `ProjectReference`
      in `*.csproj`, `workspace:` and `file:` dependencies, `tsconfig` path
      aliases, local packages in `pyproject.toml`, and the main external
      packages with versions.
- [ ] **Entry points:** host startup (`Program.cs`, `main.ts`,
      `server.ts`, `manage.py`, `main.go`), route modules, background jobs,
      CLIs, and a library's exported surface.
- [ ] **API ownership and consumers:** the route groups, controllers,
      OpenAPI documents, or events this unit owns. A consumer is listed only
      with evidence: a generated client, a call to the route path in another
      unit, a contract test, or published package metadata. Otherwise the
      consumers are `unknown`.
- [ ] **Data:** provider and data-access package (SQL Server and PostgreSQL
      are never interchangeable), the model or schema location, the
      migration folder and command, and stored procedures or views in the
      repository.
- [ ] **Tests:** each test project or folder, what it covers, and its
      command with status.
- [ ] **Generated code:** each generated folder or file, its generator and
      source (OpenAPI, GraphQL, protobuf, EF scaffolding, migrations
      designer), and the regenerate command. List these under "Do not edit"
      as well.
- [ ] **Dynamic references:** places where symbol search misses usages:
      reflection (`Activator.CreateInstance`, `Type.GetType`), assembly
      scanning in dependency injection, `nameof` and serialization names,
      string route templates, Angular lazy routes (`loadChildren`,
      `loadComponent`) and injection tokens, dynamic SQL (`FromSqlRaw`,
      `ExecuteSqlRaw`, `sp_executesql`, string-built queries), dynamic
      imports, and framework settings such as Django `INSTALLED_APPS`.
      When nothing is found, write "none found" with the terms searched.

## Evidence fingerprints

- [ ] Record the commit with `git rev-parse HEAD`, and note uncommitted
      changes from `git status --porcelain`.
- [ ] For each evidence file a generated file relies on (manifests, lock
      files, CI files, instruction files, configuration, route and client
      files, and the example files cited), record `git hash-object <path>`.
      Without `-w` it writes nothing.
- [ ] For each folder the map summarizes (migrations, generated clients,
      test projects), record its committed tree id with
      `git rev-parse HEAD:<folder>`. Uncommitted changes there appear in
      `git status --porcelain -- <folder>`.
- [ ] Without git, record `none` for the commit, every blob and every tree.

## Refresh

1. Read the header of each generated file. If any `schema` is missing or
   unknown, stop and ask.
2. Recompute `git hash-object` for every evidence path and
   `git rev-parse HEAD:<folder>` for every evidence folder. Collect the
   paths and folders that changed or no longer exist.
3. Repeat the manifest search. A new manifest, workspace member, or
   deployable unit marks its unit as changed.
4. With no changed paths and no new units, report that the files are up to
   date and write nothing, not even `init-report.md`. Missing map sections
   or recipes still need the additive refresh below.
5. Re-detect only the sections and units that depend on changed evidence.
   Keep unaffected text unchanged, so the diff stays small.
6. Without git, or when more than half the evidence changed, re-detect
   everything.
7. Never edit `rules.md` during refresh. If new evidence contradicts a rule
   there, report the conflict and let the user decide. If `rules.md` is
   missing, create it directly with at most five open questions.
8. Add missing map sections and cited recipes on refresh, even when evidence
   hashes are unchanged. Keep the schema `project-knowledge/1`.
9. Overwrite generated content directly after the schema and hand-written
   text checks. Never request content approval for ordinary generated files.
   Regenerate `init-report.md` on every refresh that writes, with changes,
   skipped paths, gaps, improvements, and follow-up. Compare `git status` with the starting
   state to check this run's write scope. Do not delete obsolete unit files;
   report them for approved removal.

## Staleness check for readers

A skill that reads a unit file before a change does not refresh it. It
checks, read-only, whether the facts it will use may be stale:

- `git diff --name-only <generated_commit> HEAD -- <evidence paths>` and
  `git status --porcelain -- <evidence paths>`: any output means those
  facts may be stale;
- for an evidence folder, compare `git rev-parse HEAD:<folder>` with its
  recorded tree id;
- `generated_commit: none`, or a commit missing from local history (for
  example in a shallow clone), means freshness cannot be checked: treat
  every fact as unconfirmed.

Stale or unconfirmed facts are leads, not facts: confirm them in the source.
Offer a refresh; never refresh without an explicit request.
