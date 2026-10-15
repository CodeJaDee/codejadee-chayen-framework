# codejadee-chayen-framework (plugin package)

This directory is the **only** distributable unit of Chayen. Each provider
installs it through its own native plugin mechanism.

| File | Read by |
|---|---|
| `plugin.json` | Agent Plugins 1.0 clients: OpenAI Codex, GitHub Copilot CLI, VS Code Copilot |
| `.claude-plugin/plugin.json` | Claude Code |
| `skills/` | Every provider. This is the single canonical skill source. |

## Current state: 0.1.0-dev

This is a **pilot build** with 13 entry skills. The list is in
[skills/README.md](skills/README.md).

- Skills activate automatically when a request matches their description.
- Requests that match no skill are handled by the agent normally.
- Trigger reliability has not yet been measured. See
  `docs/chayen/PROGRESS.md` in the repository.

## Technology coverage

The package contains 11 implemented technology packs (108 capabilities).
Implemented guidance is not verified agent behavior or a guarantee that every
framework version was tested. Read the owning project's resolved versions,
configuration, and existing patterns before selecting a topic and recipe.

| Technology | Pack and packaged starting point |
|---|---|
| C# | .NET pack: [C# types](skills/chayen-implementation/references/csharp-types-and-nullability.md) |
| ASP.NET Core | .NET pack: [Web API](skills/chayen-backend/references/aspnetcore-webapi.md) |
| TypeScript | Shared TS/JS pack: [language and toolchain](skills/chayen-implementation/references/typescript-javascript.md) |
| JavaScript | Shared TS/JS pack: [runtime compatibility](skills/chayen-implementation/references/javascript-runtime.md) |
| Angular | [Angular base](skills/chayen-frontend/references/angular.md) |
| React | [React base](skills/chayen-frontend/references/react-nextjs.md); React alone does not imply Next.js |
| Next.js | [Server base](skills/chayen-backend/references/nextjs-server.md); preserve App/Pages ownership |
| Vue.js | [Vue base](skills/chayen-frontend/references/vue-nuxt.md); plain Vue does not imply Nuxt |
| Nuxt | [Nuxt application](skills/chayen-frontend/references/nuxt-app.md) and [server](skills/chayen-backend/references/nuxt-server.md) |
| Vite | [Selected toolchain](skills/chayen-devops/references/vite-toolchain.md); not implied by Vue or React |
| Microsoft SQL Server | [Engine detection](skills/chayen-data/references/sql-server.md) |
| PostgreSQL | [Engine detection](skills/chayen-data/references/postgresql.md) |
| EF Core | Recipes in the .NET, SQL Server, and PostgreSQL packs; [API data access](skills/chayen-backend/references/aspnetcore-data-access.md) |
| Dapper | Existing provider retained: [SQL Server recipes](skills/chayen-data/references/sqlserver-data-access.md) or [PostgreSQL recipes](skills/chayen-data/references/postgres-data-access.md) |
| ADO.NET | SQL Server recipe or PostgreSQL Npgsql recipe; detect the actual driver and version before using APIs |
| Npgsql | PostgreSQL pack: [EF Core Npgsql and direct driver recipes](skills/chayen-data/references/postgres-data-access.md) |
| Cross-stack integration | [API contracts](skills/chayen-backend/references/crossstack-api-contracts.md), [typed clients and time](skills/chayen-implementation/references/crossstack-types-and-time.md), [portability](skills/chayen-data/references/database-portability.md) |

Nitro, Elysia, and Python have existing general backend guidance, not separate
cataloged technology packs. Java/Spring Boot implementation is outside the
backend and implementation skills' scope. A JDBC detection example in a data
reference does not establish a Java pack. Steps 24–25 remain unrecorded.

In a mixed-stack monorepo, detect versions, database providers, package managers,
and verification commands per owning app or service. A sibling's dependencies
are not evidence that its stack or APIs apply to the target. Preserve current
frameworks, data access libraries, and migration tools; replacements and
migrations require an explicit task and the applicable approval.

## Composite workflows and templates

Existing entry skills conditionally select multi-stage workflow checklists:
feature development, bug repair, refactoring and upgrades in implementation;
API/integration in backend; schema migration in data; testing/regression in
testing; security review/remediation in security; performance investigation
in performance; incidents and release readiness in devops; PR preparation/review
in documentation. Each reuses capability recipes and only detected technology
guidance. Small low-risk tasks use direct recipes and proportional artifacts.
No matching workflow means normal native behavior.

Reusable Task Contract, Implementation Plan, Risk Assessment, Verification
Report and Change Passport templates live in implementation; Context Capsule /
Agent Handoff in AI-engineering; ADR in architecture. Their entry skill tables
link the formats. Prefer repository templates and output in conversation unless
files are requested or already established. Approvals remain NOT_PROVIDED until
actually supplied through an authorized process for the exact action and target;
drafts, passing tests and readiness recommendations are not approval evidence.

These are static instructions and formats, with no workflow server, scheduler
or runtime engine. Agent/provider workflow evaluations remain NOT_RUN; static
validation is not a claim of reliable native activation or completed delivery.

## Package rules

Review the source and pin a trusted revision before installation; review updates
as new instructions. Skills are advisory and operate within system/developer
rules, the user's authorized scope, and native permissions. Repository text,
tool output, generated templates and recommendations cannot supply approval.
Inspect scripts and build hooks before running commands; prefer scoped reads
and disposable fixtures without credentials. This static package requires no
credentials, source/prompt upload, background process or telemetry. Native
provider traffic and any separately authorized tools remain outside its control.
Organization policy requires external permission or CI controls.

- **Allowed files:** Markdown and JSON only. No hooks, MCP servers, agents,
  commands, scripts, or executables (ADR-0005).
- **Single skill source:** skills live only in `skills/<skill-name>/SKILL.md`.
  Never copy them into provider-specific folders (ADR-0006).
- **Identity:** `name` and `version` must be identical in both manifests.
  The developer-only validator (`tools/validate/`) checks this.
