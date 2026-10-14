# Stack detection signals

Read only the sections for ecosystems you actually find.

- Prefer commands defined by the repository (CI files, scripts) over the
  defaults listed here.
- Defaults are fallbacks. Label them as inferred.

## Package manager (JavaScript / TypeScript)

| Lock file | Package manager | Install / run |
|---|---|---|
| `package-lock.json` or `npm-shrinkwrap.json` | npm | `npm ci`, `npm run <script>` |
| `yarn.lock` | Yarn (check `packageManager` in `package.json` for the version) | `yarn install --immutable` (Berry) or `yarn install --frozen-lockfile` (v1) |
| `pnpm-lock.yaml` | pnpm | `pnpm install --frozen-lockfile`, `pnpm <script>` |
| `bun.lock` or `bun.lockb` | Bun | `bun install`, `bun run <script>` |

- Never switch package managers or regenerate a lock file with a different
  tool.
- The Node version may be pinned in `.nvmrc`, `.node-version`, `engines` in
  `package.json`, or `volta`.

## .NET / ASP.NET Core

- **Projects.** `*.csproj` files.
  - `Sdk="Microsoft.NET.Sdk.Web"` means an ASP.NET Core app.
  - `<TargetFramework>` gives the runtime (for example `net8.0`).
- **Solutions.** `*.sln` or `*.slnx`.
- **SDK pin.** `global.json`.
- **Shared settings.** `Directory.Build.props`, plus central package
  versions in `Directory.Packages.props`.
- **API style.**
  - Controllers: classes deriving from `ControllerBase` with `[ApiController]`.
  - Minimal APIs: `app.MapGet(...)` and `MapGroup(...)` in `Program.cs` or
    endpoint classes.
- **Data access.** `Microsoft.EntityFrameworkCore.*` (look for the provider
  package), `Dapper`, or raw ADO.NET.
- **Default commands:** `dotnet build`, `dotnet test`, and
  `dotnet format --verify-no-changes` (only if the repository uses
  `dotnet format`).

## Angular

- **Markers.** `angular.json`, and `@angular/core` in `package.json` (the
  major version matters).
- **Style.** Look at `main.ts`:
  - `bootstrapApplication` means standalone components;
  - `platformBrowserDynamic().bootstrapModule` means NgModule.
- **Test runner.** Look at the `test` target builder in `angular.json`
  (Karma, Jest, or Vitest-based builders).
- **Default commands:** `ng build`, `ng test --watch=false`, and `ng lint`
  (only if a lint target exists). Run them through the package manager's
  scripts when those exist.

## React, Next.js, Vite

- **React.** `react` in `package.json` (note the major version).
- **Next.js.**
  - Markers: `next` in `package.json`, and `next.config.(js|mjs|ts)`.
  - App Router uses `app/`; Pages Router uses `pages/`. Both can coexist.
- **Vite.** `vite.config.(js|ts|mjs)`. Client environment variables use the
  `VITE_` prefix.
- **Default commands:** `npm run build`, `npm run lint`, `npm test`,
  `npx tsc --noEmit` (if TypeScript is used without a typecheck script).

## Vue, Nuxt

- **Vue.**
  - `vue` in `package.json`.
  - Single-file components (`*.vue`): look for `<script setup>` (Composition
    API) or `export default {}` (Options API).
- **Nuxt.**
  - `nuxt.config.(ts|js)`, and `nuxt` in `package.json`.
  - Source may live under `app/` (newer layout) or at the project root.
  - Server routes live in `server/`.
- **Default commands:** `npm run build`, `npx vue-tsc --noEmit` (Vue + TS),
  `npx nuxi typecheck` (Nuxt), `npm test`.

## Nitro, Elysia (server-side TypeScript)

- **Nitro.** `nitro.config.ts`, or `nitropack`/`nitro` in `package.json`.
  Handlers live in `server/routes/` and `server/api/`.
- **Elysia.** `elysia` in `package.json`, usually with Bun (`bun.lock`), and
  `new Elysia()` in source.
- **Default commands:** the project's scripts. For Bun: `bun test`,
  `bun run build`.

## Python

- **Manifests.** `pyproject.toml` (check `[project]`, `[tool.poetry]`, and
  `[tool.uv]`), `requirements*.txt`, `uv.lock`, `poetry.lock`, `Pipfile`,
  `setup.cfg`.
- **Frameworks.** `fastapi`, `django` (with `manage.py`), and `flask` in the
  dependencies.
- **Tooling configuration.** `[tool.pytest.ini_options]`, `pytest.ini`,
  `[tool.ruff]`, `mypy.ini`.
- **Default commands:** `pytest`, `ruff check .`, `mypy .` (only when
  configured). Run them through `uv run` or `poetry run` when those tools
  manage the environment.

## Databases

| Database | Signals |
|---|---|
| SQL Server | `Microsoft.EntityFrameworkCore.SqlServer`, `Microsoft.Data.SqlClient`, `*.sqlproj`, `Server=`/`Data Source=` connection strings, T-SQL migration scripts |
| PostgreSQL | `Npgsql` / `Npgsql.EntityFrameworkCore.PostgreSQL`, `pg` / `postgres` / `@prisma/client` with a postgres provider, `psycopg` / `asyncpg`, `Host=` / `postgres://` connection strings |
| Migrations | EF Core `Migrations/` folders, Flyway / Liquibase / DbUp scripts, Alembic `alembic/`, Django `migrations/`, Prisma `prisma/migrations/` |

Never print connection strings or secrets found during detection. Mention only that they exist and where.

## Outside detailed guidance

These are detected so you can report them accurately, but they have no
detailed guidance here:

- **Java:** `pom.xml`, `build.gradle(.kts)`
- **Go:** `go.mod`
- **Rust:** `Cargo.toml`
- **PHP:** `composer.json`
- **Ruby:** `Gemfile`
- **Native mobile:** `*.xcodeproj`, Android `build.gradle`

## CI and containers

- **CI.** `.github/workflows/*.yml`, `azure-pipelines.yml`, `.gitlab-ci.yml`,
  `Jenkinsfile`. These are the most reliable source of build and test
  commands.
- **Containers.** `Dockerfile`, `docker-compose*.yml`, `compose*.yaml`. These
  show runtime versions and service dependencies such as a database used in
  tests.
