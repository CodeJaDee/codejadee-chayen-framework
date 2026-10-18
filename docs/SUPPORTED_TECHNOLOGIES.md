# Supported technologies

Chayen has two kinds of guidance:

- **General engineering guidance:** 206 capabilities across 20 domains,
  written to work in any repository.
- **Technology packs:** 108 capabilities with stack-specific advice. A pack
  loads only after a skill **detects** that the technology is really used by
  the project you are working on.

Detection is described in
[AUTOMATIC_SKILL_DISCOVERY.md](AUTOMATIC_SKILL_DISCOVERY.md#how-technologies-are-detected).

## Technology packs

| Pack | Technologies | Capabilities | Main skills | Framework facts executed (2026-10-15) |
|---|---|---|---|---|
| .NET | C# (8), ASP.NET Core (14) | 22 | implementation, backend, data, testing, performance, devops | 29 pass, 0 fail, 2 not run (.NET 10 SDK; the .NET 8 SDK was not installed) |
| Angular | Angular | 14 | frontend, testing | Combined with TS/JS: 3 pass, 0 fail, 19 not run (no Angular, TypeScript or browser fixture installed) |
| TypeScript / JavaScript | Shared TS/JS language, runtime, workspaces | 8 | implementation | See Angular row |
| React | React | 8 | frontend, testing | Combined with Next.js: 3 pass, 0 fail, 13 not run |
| Next.js | Next.js (App and Pages Router) | 8 | frontend, backend, devops | See React row |
| Vue | Vue | 7 | frontend, testing | Combined with Nuxt and Vite: 2 pass, 0 fail, 16 not run |
| Nuxt | Nuxt | 7 | frontend, backend, devops | See Vue row |
| Vite | Vite (only when selected; never implied) | 4 | devops, testing | See Vue row |
| SQL Server | SQL Server, Azure SQL | 12 | data | 30 pass, 0 fail, 0 not run (SQL Server 2025 Express LocalDB) |
| PostgreSQL | PostgreSQL | 10 | data | Combined with cross-stack: 40 pass, 0 fail, 2 not run (PostgreSQL 18.6) |
| Cross-stack | API contracts, typed clients, authentication, errors, date and time, CORS/CSRF, end to end, database portability | 8 | backend, implementation, testing, data | See PostgreSQL row |

**What "framework facts" means.** These runners check that the technical
claims in the guidance hold on real SDKs and database engines: 107 pass,
0 fail, 52 not run in total. They do **not** test agent behaviour, and no
capability is marked verified.

## Data access libraries

| Library | Guidance |
|---|---|
| EF Core (SQL Server and Npgsql providers) | Provider-specific recipes. Migrations are never destructive in production without approval. |
| Dapper, ADO.NET (`Microsoft.Data.SqlClient`), Npgsql | Kept as they are. Driver and version are detected before any API is used. |
| SQLAlchemy, Prisma, Django ORM | Covered by data recipes when detected |

## General guidance only (no technology pack)

| Technology | Status |
|---|---|
| Python services (FastAPI, Django, Flask) and pytest | Backend, testing, performance, security, and AI-engineering guidance. No separate cataloged pack. |
| Nitro, Elysia | Out of scope; no framework routing or technology pack |
| GitHub Actions, Azure Pipelines, GitLab CI, Docker, Terraform, Bicep, Kubernetes, Helm | DevOps recipes; no separate technology pack |
| Load-testing tools (k6, JMeter, Locust, NBomber) | Performance recipes |

## Out of scope

The skills' own scope lines exclude these. If the target is one of them, the
skill does not apply its guidance and the agent works normally.

| Area | Excluded | Stated in |
|---|---|---|
| Backends | Java (including Spring Boot), Go, Rust, PHP, Ruby | `chayen-backend` scope. Java for v1 is an open question (ISSUES Q-08). |
| Code changes | Other stacks, for example Unity, Java, native mobile | `chayen-implementation` scope |
| UI | SwiftUI, UIKit, Jetpack Compose, Android views, Flutter, React Native, .NET MAUI, WPF, WinForms, WinUI, Unity | `chayen-frontend` scope |
| Databases | MySQL, Oracle, SQLite as a production store, NoSQL stores, analytics warehouses, database provisioning | `chayen-data` scope |
| Test stacks | Test frameworks outside .NET, TypeScript/JavaScript and Python | `chayen-testing` scope |

Stacks no skill mentions at all, such as COBOL, VBA, or embedded firmware,
have no Chayen guidance. In testing, prompts for them loaded no skill.

## How versions are handled

- **The project's resolved versions decide.** Guidance written for newer
  APIs is applied only when the project uses them. Older projects keep
  their idioms unless you ask for an upgrade.
- **Upgrades are explicit tasks.** They use the dependency-upgrade workflow
  (see [DEVELOPMENT_WORKFLOWS.md](DEVELOPMENT_WORKFLOWS.md)).
- **Unknown versions are reported as unknown**, never guessed.

The maintainer-side coverage audit is in
[docs/chayen/TECHNOLOGY_COVERAGE.md](chayen/TECHNOLOGY_COVERAGE.md) and
[docs/chayen/TECHNOLOGY_COVERAGE_AUDIT.md](chayen/TECHNOLOGY_COVERAGE_AUDIT.md).
