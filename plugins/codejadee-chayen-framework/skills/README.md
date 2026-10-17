# Canonical skill source

This is the single source for all Chayen skills, shared by Claude Code,
OpenAI Codex, and GitHub Copilot.

Each skill is a directory, `skills/<skill-name>/SKILL.md`, plus optional
`references/` files.

- References are loaded only when the skill's routing table says so.
- References live inside the skill's own directory (D-016).

**Frontmatter** uses only the Agent Skills standard fields: `name` and
`description`. `name` must equal the directory name.

## Entry skills (0.1.0-dev)

Twelve composite workflows are conditional checklist references in the existing
skills, alongside seven reusable template leaves. They reuse capability recipes,
select technology topics by task and owner, and retain scope, actual approval,
evidence and partial-completion rules. No new skill or runtime is introduced.
For small low-risk tasks use a direct recipe; no matching workflow means normal
native behavior. Workflow and template evaluations are specifications, not
executed provider results.

The authoring rules are in `docs/chayen/SKILL_AUTHORING_STANDARD.md` in the
development repository. Capability coverage is tracked in
`catalog/engineering-capabilities.yaml`, and technology packs in
`catalog/technology-capabilities.yaml`.

**Technology packs.** The .NET pack (C# and ASP.NET Core, 22 capabilities)
is a set of `kind: technology` references inside the implementation,
backend, data, testing, performance, and devops skills, loaded only when a
.NET project is detected.

Angular support adds 14 capabilities in frontend and testing technology
references. Shared TypeScript/JavaScript guidance adds 8 capabilities in the
implementation skill's types, runtime, and workspace topics. These load only
for the matching task after version and project-convention detection. General
workflow stays in existing recipes; no entry-skill description was changed.

React adds 8 capabilities across frontend and testing; Next.js adds 8 across
frontend, backend, and devops. Topics preserve the installed router, state,
forms, runtime, and test tools, and validate privileged operations at server
boundaries. Bases and relevant topics load conditionally; no new skill or
description change was introduced for these packs.

Vue (7), Nuxt (7), and Vite (4) add technology topics in frontend, backend,
testing, and devops. Version and selected-builder evidence distinguish plain
Vue, Nuxt context, and Vite configuration; SSR/private-config and existing
manager/test conventions remain explicit. No additional entry skill is added.

SQL Server (12) adds topic references in data: T-SQL and procedures, plans,
Query Store and indexes, locking and transactions, schema, security and
auditing, backup and maintenance, plus EF Core, Dapper, and ADO.NET data
access recipes. The engine and provider are detected first; PostgreSQL
syntax is never applied, and production inspection stays read-only.

PostgreSQL (10) adds data topics for SQL and JSONB, EXPLAIN and indexes,
MVCC and row-level security, partitioning and migrations, vacuum and
backups, plus EF Core Npgsql, Npgsql, SQLAlchemy, and other data access
recipes. Cross-stack (8) adds API contract and error, authentication and
CORS/CSRF topics in backend, typed clients and date/time in implementation,
end-to-end tests in testing, and a database portability review in data.

| Skill | Scope |
|---|---|
| `chayen-repository` | Read-only repository intelligence: profile, dependencies, change impact, history and ownership, technical debt and its proposed priority, legacy assessment, unknowns |
| `chayen-requirements` | Requirements analysis: elicitation, stories, acceptance criteria, use cases, business rules, edge cases, NFRs, scope, backlog and sizing, traceability |
| `chayen-architecture` | Architecture and technical planning: reviews and fitness tests, options and ADRs, decision register, boundaries and domain, data flow, multitenancy, resilience, migration and rollout plans |
| `chayen-implementation` | Code changes with a task contract and change summary: features, bug fixes, refactors, algorithms, concurrency, error handling, dependency upgrades, configuration and flags, generated code, compatibility |
| `chayen-backend` | Server-side code in the project's stack (ASP.NET Core, Node and Bun servers, Python): API design and versioning, endpoints and validation, auth, background jobs, messaging, integrations, idempotency |
| `chayen-frontend` | Web UI (Angular, React/Next.js, Vue/Nuxt, Vite) and its PWA, Capacitor/Ionic, Electron, and Tauri shells: features, state, forms, components, layout and design systems, accessibility, performance, i18n, UI errors, offline, permissions, push, lifecycle, desktop packaging |
| `chayen-data` | Relational data on SQL Server and PostgreSQL: modeling, migrations and backfills, query and index tuning, transactions, integrity and quality, ETL, retention, restore drills; production read-only by default |
| `chayen-testing` | Automated tests (.NET, JavaScript/TypeScript, Python): strategy, unit, integration, end to end, API and contract, regression, property-based, mutation, fuzz, test data, coverage gaps, failure and flaky triage |
| `chayen-security` | Advisory security: threat models, secure review (authorization, injection, SSRF, crypto, logging), SAST and dependency triage, exposed secrets, privacy, SBOMs and licences, read-only Dockerfile and IaC review, remediation |
| `chayen-performance` | Measurement-driven performance (.NET, Node, Python, browser): baselines, profiling, load tests, bottlenecks, memory leaks, latency budgets, capacity, caching, cost; no claim without measurement |
| `chayen-devops` | Build, delivery, and operations: build systems, CI/CD, Dockerfiles and container hardening, IaC (Terraform, Bicep, Kubernetes, Helm), environments, secrets, packaging and provenance, deploy and rollback checks, observability and SLOs, alerting and incidents, RCA and postmortems, disaster recovery, runbooks; changes files, never environments without approval |
| `chayen-documentation` | Engineering docs and collaboration from verified repository facts: READMEs, onboarding, API and architecture docs, knowledge transfer, PR descriptions, code review, review comments, release notes, git workflow; never invents commands or test results |
| `chayen-ai-engineering` | ML, LLM, and agent engineering: dataset readiness and drift, experiments and model evaluation, serving, RAG and retrieval evaluation, prompt and tool evals, red-teaming your own LLM app, LLM observability, agent permission reviews, and agent skills (authoring, review, testing, migration, provider compatibility, instruction conflicts, session handoff, benchmarks); recommendations are never authorizations |
| `chayen-humanizer-th` | Thai writing and editing: audit, rewrite, new content and website or UI copy in articles, developer blogs, landing pages, READMEs, product descriptions and localization files; preserves facts, terminology, code and markup; editorial only, owns no engineering capability |
