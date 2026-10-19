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

## Evidence fingerprints

- [ ] Record the commit with `git rev-parse HEAD`, and note uncommitted
      changes from `git status --porcelain`.
- [ ] For each evidence file a generated file relies on (manifests, lock
      files, CI files, instruction files, configuration, and the example
      files cited), record `git hash-object <path>`. Without `-w` it writes
      nothing.
- [ ] Without git, record `none` for the commit and every blob.

## Refresh

1. Read the header of each generated file. If any `schema` is missing or
   unknown, stop and ask.
2. Recompute `git hash-object` for every evidence path. Collect the paths
   that changed or no longer exist.
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
