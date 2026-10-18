# Skills catalog

Chayen ships **15 entry skills**: 13 engineering skills and two editorial skills (Thai and English). Each is one directory,
`plugins/codejadee-chayen-framework/skills/<name>/`, containing `SKILL.md`
and on-demand `references/`.

The **description** below is exactly what your agent sees before it decides
to load a skill.

- Prompts that match a description can load the skill automatically.
- Anything listed after "Not for" belongs to another skill, or to the
  agent's normal behaviour.

| Skill | Engineering capabilities | Technology capabilities | References |
|---|---|---|---|
| `chayen-repository` | 11 | — | 8 |
| `chayen-requirements` | 11 | — | 6 |
| `chayen-architecture` | 18 | — | 11 |
| `chayen-implementation` | 23 | 18 | 31 |
| `chayen-backend` | 14 | 20 | 24 |
| `chayen-frontend` | 19 | 33 | 33 |
| `chayen-data` | 15 | 24 | 28 |
| `chayen-testing` | 14 | 6 | 16 |
| `chayen-security` | 16 | — | 12 |
| `chayen-performance` | 10 | 1 | 8 |
| `chayen-devops` | 25 | 6 | 23 |
| `chayen-documentation` | 11 | — | 8 |
| `chayen-ai-engineering` | 19 | — | 13 |
| `chayen-humanizer-th` (editorial) | — | — | 7 |
| `chayen-humanizer-en` (editorial) | — | — | 9 |
| **Total** | **206** (20 domains) | **108** | **237** |

Capability counts come from `catalog/engineering-capabilities.yaml` and
`catalog/technology-capabilities.yaml`. Every capability is
**implemented, not verified**. See
[SECURITY_AND_LIMITATIONS.md](SECURITY_AND_LIMITATIONS.md).

## The skills

### chayen-repository

*Domains: repository understanding (9), modernization assessment (2).*

> Analyze an existing codebase without changing it. Reports stacks and versions, layout, build and test commands, conventions, project and package dependencies, change impact, git history and code ownership, technical debt and its priority, legacy assessments, and unknowns, citing evidence for every finding. Not for writing code or docs, or git operations such as rebase or merge.

Example prompt: *"I just cloned this repository. How is it structured, and
how do I build it and run the tests?"*

### chayen-requirements

*Domains: requirements (10), planning (1).*

> Analyze software requirements before code is written. Clarifies vague requests, refines user stories, writes testable acceptance criteria and edge cases, models use cases, extracts business rules from code, SQL, or documents, defines non-functional targets, sets scope, splits and sizes backlogs, and traces requirements to code and tests. Not for writing code, architecture design, or delivery schedules.

### chayen-architecture

*Domains: architecture (10), planning (3), modernization (2), governance (1),
specialized systems (2).*

> Design, review, and plan software architecture from repository evidence. Compares options with trade-offs, writes ADRs and decision registers, defines module and service boundaries, domain models, data flows, multitenancy, resilience, and fitness tests for dependency rules, and plans phased migrations and staged rollouts. Not for implementing features, writing infrastructure code, or sizing backlog items.

### chayen-implementation

*Domains: implementation (12), planning (4), modernization (5),
governance (2). Technology: C#, TypeScript/JavaScript, cross-stack types and
time.*

> Plan and deliver code changes with a task contract, a minimal diff, real build and test runs, and a change summary. Covers cross-layer features, bug fixes, refactors, dependency and framework upgrades, dead code and deprecations, config and feature flags, concurrency, error handling, generated clients, and compatible changes. Not for work confined to API endpoints or UI components, test-only tasks, or explanations.

### chayen-backend

*Domains: backend (10), specialized systems (4). Technology: ASP.NET Core,
Next.js and Nuxt server code, cross-stack API contracts.*

> Build or fix server-side code in the project's own stack, such as ASP.NET Core (C#, EF Core, Dapper), Node servers (Next.js or Nuxt routes), or Python (FastAPI, Django, Flask). Covers API design and versioning, endpoints, validation, auth, data access and migrations, background jobs, messaging, external integrations, and idempotency. Not for Nitro, Elysia, UI components, mobile apps, or infrastructure-only tasks.

Example prompt: *"GET /api/orders/{id} returns 500 when the order has no
customer. Fix it."*

### chayen-frontend

*Domains: frontend (10), mobile and desktop web shells (8), specialized
systems (1). Technology: Angular, React, Next.js, Vue, Nuxt, Vite.*

> Build or fix web UI in Angular, React, Next.js, Vue, Nuxt, or Vite apps, their PWA, Capacitor, Ionic, Electron, or Tauri shells, and browser extensions, for components, state, forms, design systems, accessibility, i18n, performance, UI errors, offline, permissions and push, and desktop packaging. Not for server-only APIs, native or game UI such as SwiftUI, Flutter, React Native, WPF, or Unity, or design without code.

### chayen-data

*Domains: databases and data (12), governance (1), specialized systems (2).
Technology: SQL Server, PostgreSQL, EF Core, Dapper, ADO.NET, Npgsql,
SQLAlchemy, database portability.*

> Design, change, or review relational data in SQL Server or PostgreSQL through EF Core, Dapper, Prisma, SQLAlchemy, Django, or raw SQL, covering schema modeling, migrations, query and index tuning, transactions, integrity, data migrations and backfills, ETL, data quality, retention, and restore drills. Not for API endpoint code, NoSQL or warehouse platforms such as MongoDB or Snowflake, or database provisioning.

### chayen-testing

*Domains: testing and QA (14). Technology: ASP.NET Core and Angular testing,
cross-stack end-to-end testing.*

> Plan, write, or fix automated tests with xUnit, NUnit, MSTest, Jasmine, Jest, Vitest, Playwright, Cypress, or pytest, covering test strategy, unit, integration, end-to-end, API and contract, regression, property-based, mutation, and fuzz tests, test data builders, coverage gaps, and failing or flaky test triage. Not for manual QA plans, load testing, or production monitoring.

### chayen-security

*Domains: security and privacy (14), governance (2).*

> Review or harden application security in .NET, TypeScript or JavaScript, Python, and SQL code, covering threat models, secure code review, SAST and dependency triage, exposed secrets, authorization, injection and XSS, SSRF, cryptography, privacy, secure logging, SBOMs and licences, Dockerfile and IaC review, and fixes. Advisory review. Not a penetration test, compliance audit, or replacement for security tooling.

### chayen-performance

*Domains: performance (10).*

> Measure and improve runtime performance of .NET, Node, and Python services and browser apps, covering baselines and benchmarks, profiling, load tests with k6, JMeter, Locust, or NBomber, bottleneck analysis, memory leaks, latency budgets, capacity planning, caching, and cost trade-offs, always from measurements. Not for single SQL query tuning, frontend bundle size, or functional tests.

### chayen-devops

*Domains: DevOps (12), operations and SRE (10), modernization (1),
governance (2). Technology: ASP.NET Core deployment, Next.js and Nuxt
deployment, Vite toolchain.*

> Design or fix builds, delivery, and operations, covering build systems, CI/CD pipelines in GitHub Actions, Azure Pipelines, or GitLab CI, Dockerfiles, Terraform, Bicep, Kubernetes, or Helm, environments and secrets, releases and provenance, deploy and rollback checks, observability and SLOs, alerts and incidents, postmortems, disaster recovery, and runbooks. Not for application feature code or IaC security review.

### chayen-documentation

*Domains: documentation (10), governance (1).*

> Write or update engineering docs and collaboration artifacts from verified repository facts, covering READMEs, onboarding guides, API and architecture docs, knowledge transfer, pull request descriptions, code review, review comment resolution, release notes, and git workflow help. Never invents commands, test results, or behaviour. Not for end-user manuals, marketing copy, or security review.

### chayen-ai-engineering

*Domains: AI/ML/LLM (10), governance (1), agent engineering (8).*

> Build and evaluate ML and LLM features in Python, .NET, or TypeScript, covering dataset readiness and leakage, experiment design, model evaluation and serving, drift, RAG pipelines and retrieval evaluation, prompt and tool evals, red-teaming your own LLM app, LLM observability, agent skills, and agent permission reviews. Not for routine data pipelines, attacking third-party AI systems, or legal AI compliance.

### chayen-humanizer-th

*Editorial skill (Thai). Owns no engineering capabilities; registered in `catalog/editorial-skills.json`.*

> Write, audit, or reword Thai prose for articles, blogs, landing pages, READMEs, product descriptions, UI microcopy and Thai copy in localization files. Fix phrasing, register, repetition and Thai-English terms; keep facts and markup. Not for non-Thai output, engineering doc verification, i18n configuration, routing, key wiring or application logic.

Example prompt: *"เกลาย่อหน้านี้ให้อ่านลื่นเป็นภาษาไทยธรรมชาติ แต่ห้ามเปลี่ยนตัวเลขกับชื่อฟีเจอร์"*

Modes: audit (no edits), rewrite, new content and website or localization copy.
Usage, explicit invocation and preservation rules:
[WRITING_AND_EDITING.md](WRITING_AND_EDITING.md). Thai writing quality and
routing are not yet evaluated; see
[SECURITY_AND_LIMITATIONS.md](SECURITY_AND_LIMITATIONS.md).

### chayen-humanizer-en

*Editorial skill (English). Owns no engineering capabilities; registered in `catalog/editorial-skills.json`.*

> Write, audit, or tighten English prose for articles, blogs, READMEs, developer replies, product and marketing copy, landing pages, and UI microcopy, removing stock AI phrasing and filler while keeping facts, identifiers, tone, and spelling variety. Not for non-English output, fiction, checking docs against the repository, or software changes.

Example prompt: *"Rewrite this landing page headline and subhead so they sound less like marketing boilerplate. Keep the pricing and feature names."*

Modes: audit (no edits), rewrite, new content and website or localization copy,
plus a "no changes recommended" result for text that already reads well. Usage:
[WRITING_AND_EDITING.md](WRITING_AND_EDITING.md). English writing quality and
routing are not yet evaluated; see
[SECURITY_AND_LIMITATIONS.md](SECURITY_AND_LIMITATIONS.md). Its writing
patterns are adapted from the MIT-licensed
[humanizer](https://github.com/blader/humanizer) skill by Siqi Chen; the
attribution and licence notice ship with the skill.

## Requesting a new skill or capability

Open an issue as described in
[CONTRIBUTING.md](CONTRIBUTING.md#requesting-a-skill-or-capability).

- Most requests become a **recipe inside an existing skill**, not a new
  skill.
- The L0 metadata budget is 6,500 characters (D-052); current usage is 6,221
  with both editorial skills, leaving 279. The Entry Skill ceiling and product
  target are 15 (D-053) and all 15 now ship, so a further skill needs a new
  decision. New Skills still need routing and metadata checks;
  this internal budget does not establish host capacity or routing quality.
