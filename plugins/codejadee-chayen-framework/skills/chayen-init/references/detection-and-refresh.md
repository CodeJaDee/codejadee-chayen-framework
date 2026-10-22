---
kind: checklist
---
# Detection and refresh checklist

Collect the facts for the project knowledge files from repository evidence,
record fingerprints so later runs can tell what changed, and limit a refresh
to the evidence that changed. Use only read-only commands.

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

## Layout and conventions

- [ ] For "where things go", find one real example for each kind of change
      the repository has: endpoint or handler, page or component, migration,
      background job, unit test, integration test.
- [ ] Sample two or three representative files per area for observed
      conventions: naming, folder style, dependency injection, error and
      result handling, validation, logging, async usage, data access, test
      location and naming.
- [ ] An observed pattern needs at least two `path:line` examples. Record
      exceptions you saw.
- [ ] Explicit standards come only from `.editorconfig`, linter and
      formatter configuration, analyzer settings, `CONTRIBUTING.md`, ADRs,
      and instruction files. Cite each one.
- [ ] Skip generated and vendored content: `bin/`, `obj/`, `node_modules/`,
      `dist/`, `build/`, `.angular/`, `.next/`, `.nuxt/`, `.output/`,
      `coverage/`, `.venv/`, and generated clients. List them under folders
      not to edit.

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
   date and write nothing.
5. Re-detect only the sections and units that depend on changed evidence.
   Keep unaffected text unchanged, so the diff stays small.
6. Without git, or when more than half the evidence changed, re-detect
   everything.
7. Never edit `rules.md` during refresh. If new evidence contradicts a rule
   there, report the conflict and let the user decide.
8. A unit file written before the map sections existed is refreshed by
   adding them, shown in the preview diff like any other change.

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
