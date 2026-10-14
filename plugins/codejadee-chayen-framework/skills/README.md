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

The authoring rules are in `docs/chayen/SKILL_AUTHORING_STANDARD.md` in the
development repository. Capability coverage is tracked in
`catalog/engineering-capabilities.yaml`.

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
