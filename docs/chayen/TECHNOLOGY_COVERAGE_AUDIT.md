# STEP 28 — Technology coverage audit

Date: 2026-10-15 (Asia/Bangkok). **Step status: PARTIAL.**

The content audit covers all 11 implemented packs, all 108 technology
capabilities, their 57 mapped technology references, and all 17 technologies
in the latest request. Seven documentation/specification gaps were corrected.
Final local fact runs report **107 PASS, 0 FAIL, 52 NOT_RUN** across 159 checks.
Required full-stack agent and frontend runtime scenarios remain unexecuted;
neither content validation nor these fact results establish those scenarios.
No capability is promoted to VERIFIED. STOP after STEP 28.

## 1. Scope and evidence standard

- Inventory: [technology catalog](../../catalog/technology-capabilities.yaml),
  `packs` and `capabilities`; [coverage](TECHNOLOGY_COVERAGE.md), generated §6.
- Packaged support: [plugin README:22](../../plugins/codejadee-chayen-framework/README.md#L22)
  and [skill index:22](../../plugins/codejadee-chayen-framework/skills/README.md#L22).
  The package has 13 entry skills, 206 engineering and 108 technology
  capabilities. Libraries below are embedded recipes, not additional packs.
- Static validation: [V-23](../../tools/catalog/check-technology.mjs),
  [package/reference validation](../../tools/validate/validate-package.mjs), and
  [engineering audit](../../tools/catalog/audit-coverage.mjs).
- Specifications: [technology cases](../../tests/skills/technology-cases.json),
  [SQL Server library cases](../../tests/skills/sqlserver-data-access-cases.json),
  [PostgreSQL library cases](../../tests/skills/postgres-data-access-cases.json).
  A validated prompt specification is not an executed provider test.
- Current run evidence, including each fact's status and observed result:
  [STEP 28 facts](../../tests/technology/audit/results/step28-fact-checks.json).
  Historical Steps 20–27 reports were read as provenance, not reused as current
  PASS evidence. Current Node is 24.15.0; historical Node 26 results do not
  establish compatibility in this run.

Nitro, Elysia, and Python have general backend guidance but no dedicated
cataloged pack. Java/Spring Boot implementation is explicitly excluded by
[backend SKILL.md:10](../../plugins/codejadee-chayen-framework/skills/chayen-backend/SKILL.md#L10)
and [implementation SKILL.md:10](../../plugins/codejadee-chayen-framework/skills/chayen-implementation/SKILL.md#L10).
These are not newly implemented or retrospectively treated as Steps 24–25.
The unrecorded-step issue remains R-45. A JDBC/provider detection example is
not a Java implementation recipe.

## 2. Eight checks for every required technology

**P** = confirmed by content review and applicable static validation.
**R** = API/version claims reviewed with no known unsupported claim remaining
in the inspected guidance after the fixes; this is not a runtime certification
of every named API, older version, edition, adapter, or deployment target.
C7 therefore remains subject to the explicit runtime gaps in §6.

C1 support documented; C2 applicable procedure/recipe exists; C3 version
awareness; C4 positive and negative triggers; C5 relevant verification commands
or configured-command selection; C6 references resolve inside the package;
C7 no known unsupported API/version assertion after review; C8 no forced
migration or dependency replacement. E01–E17 identify the concrete evidence
and verification guidance in §3. P never means agent behavior was executed.

| Technology | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 |
|---|---|---|---|---|---|---|---|---|
| C# (E01) | P | P | P | P | P | P | R | P |
| ASP.NET Core (E02) | P | P | P | P | P | P | R | P |
| TypeScript (E03) | P | P | P | P | P | P | R | P |
| JavaScript (E04) | P | P | P | P | P | P | R | P |
| Angular (E05) | P | P | P | P | P | P | R | P |
| React (E06) | P | P | P | P | P | P | R | P |
| Next.js (E07) | P | P | P | P | P | P | R | P |
| Vue.js (E08) | P | P | P | P | P | P | R | P |
| Nuxt (E09) | P | P | P | P | P | P | R | P |
| Vite (E10) | P | P | P | P | P | P | R | P |
| Microsoft SQL Server (E11) | P | P | P | P | P | P | R | P |
| PostgreSQL (E12) | P | P | P | P | P | P | R | P |
| EF Core (E13) | P | P | P | P | P | P | R | P |
| Dapper (E14) | P | P | P | P | P | P | R | P |
| ADO.NET (E15) | P | P | P | P | P | P | R | P |
| Npgsql (E16) | P | P | P | P | P | P | R | P |
| Cross-stack integration (E17) | P | P | P | P | P | P | R | P |

Every capability has ordered Applies when, Not when, Version notes, Steps,
and Verify content (V-23.5), positive/negative specifications (V-23.7), and a
mapped reachable packaged reference (V-23.3/4). General workflow recipes are
combined with the relevant technology topic; a technology section is not
misrepresented as a new standalone entry skill. V-23.10 additionally checks
seven provider/library recipes and their required topics/cases.

## 3. Technology-specific evidence and commands

Paths below are inside `plugins/codejadee-chayen-framework/skills/`.
Commands are guidance for the detected target project, not a claim that its
application build ran here. Use the pinned manager, installed tools, actual
scripts and project-specific test filters; examples do not authorize installs,
schema changes, upgrades, or replacement of existing libraries.

| Evidence | Packaged procedure and version awareness | Verification guidance reviewed |
|---|---|---|
| E01 C# | `chayen-implementation/references/csharp-types-and-nullability.md:12`, other C# topics; `feature-delivery.md`/`bug-fix.md`. C# language version and target framework checked separately; required/records/async/disposal APIs gated. | `dotnet build`, `dotnet test`, configured analyzers and `dotnet format ... --verify-no-changes` in C# project-health guidance. |
| E02 ASP.NET Core | `chayen-backend/references/aspnetcore-webapi.md:1`, endpoint/pipeline/auth/data topics and `api-endpoints.md`; .NET 6/7/8/9/10 distinctions retain controllers/minimal APIs and existing OpenAPI generator. | Project `dotnet build`/`dotnet test`, HTTP pipeline and denied-path checks; matching `WebApplicationFactory` package/runtime. |
| E03 TypeScript | `chayen-implementation/references/typescript-types.md:12`, `typescript-workspace.md:26`; effective compiler settings, TS 4.9 satisfies, exports, workspace consumers; `feature-delivery.md`. | Configured typecheck/build/test and installed compiler showConfig; runtime resolution separately from TS paths. |
| E04 JavaScript | `chayen-implementation/references/javascript-runtime.md:12`, shared `typescript-javascript.md:32`; Node/Bun/browser availability, ESM/CJS and package manager preserved; `bug-fix.md`. | Existing scripts and runtime/async/module fixtures; TS declarations do not establish browser/server API availability. |
| E05 Angular | `chayen-frontend/references/angular.md:1`, six mapped Angular references in frontend/testing; `ui-features.md`. Standalone, control flow, forms, signals, interop and SSR checked per installed release. | Base `Verification commands` at :115; configured Angular build, lint and test targets; browser/SSR/accessibility separately. No automatic Karma/Vitest or forms migration. |
| E06 React | `chayen-frontend/references/react-nextjs.md:1`, React topics and `ui-features.md`; hooks/ref/React 19 APIs and installed query/form/router libraries distinguished. | Base verification at :113; configured build/typecheck/test; DOM, keyboard and profiling evidence where needed. React alone never selects Next.js. |
| E07 Next.js | `chayen-backend/references/nextjs-server.md:1`, mutations/data-auth, frontend routing boundaries and devops deployment; `api-endpoints.md`/UI recipe. Existing App/Pages routing, exact request/cache APIs and runtime retained. | Configured production build/start, direct server mutation denial, consumer tests, secret-sentinel artifact and cache isolation checks; no assumed next lint command. |
| E08 Vue.js | `chayen-frontend/references/vue-nuxt.md:1`, composition/state/performance/testing topics and `ui-features.md`. Vue 2/2.7/3 retained; defineModel 3.4+ and props compiler destructure 3.5+ differ from ordinary objects. | Base verification at :104; installed component runner and configured build/typecheck, SSR and browser tests as applicable. No automatic Pinia/Vitest migration. |
| E09 Nuxt | `chayen-frontend/references/nuxt-app.md:1`, `nuxt-modules.md`, backend `nuxt-server.md`, devops `nuxt-deployment.md`; Nuxt 2/3/4 layout, context, data and config remain distinct. | Configured prepare/typecheck/build and deployment-preset/server/hydration tests; private/public DTO and production artifact checks. Plain Vue and standalone Nitro do not inherit Nuxt APIs. |
| E10 Vite | `chayen-devops/references/vite-toolchain.md:14`, `chayen-testing/references/vite-testing.md:1`; installed major/plugin/bundler and framework config owner detected; existing CI/test recipes. | Commands and verification at :70 require actual builder scripts, separate semantic typecheck, configured runner and public/private artifact sentinels. No automatic Vite/Vitest installation. |
| E11 SQL Server | `chayen-data/references/sql-server.md:1`, five SQL Server capability topics and `query-performance.md`; server/edition/compatibility/collation/provider detected, T-SQL distinguished from PostgreSQL. | Captured/estimated plans, SQL Server integration tests, reads/rows/time comparisons; actual execution and DDL confined to approved test environments. |
| E12 PostgreSQL | `chayen-data/references/postgresql.md:1`, five PostgreSQL topics and `query-performance.md`; actual major/locale/extensions/provider detected, not inferred from SQL Server. | EXPLAIN versus executing ANALYZE, PostgreSQL integration tests, lock/transaction/index tests, backup restore drills on disposable data. |
| E13 EF Core | Backend `aspnetcore-data-access.md:35`; data `efcore-migrations.md:1`, `sqlserver-data-access.md:25/41`, `postgres-data-access.md:22/39`. Provider versions are independent of the SDK; EF 5/7/8/9 API gates now explicit in library recipes. | `dotnet list package --include-transitive`, project build/integration tests, generated SQL inspection; scaffold/script review where migrations are explicitly requested. No automatic provider or library switch. |
| E14 Dapper | Data `sqlserver-data-access.md:115`, `postgres-data-access.md:177`; SQL dialect belongs to the actual connection, typed parameters, no tracking or built-in migrations, caller transaction/cancellation. | SQL Server recipe commands at :227 and PostgreSQL at :215; integration rollback, error mapping, injection-shaped parameters, command counts/plans. |
| E15 ADO.NET | Data `sqlserver-data-access.md:170` and direct PostgreSQL Npgsql recipe at :91; backend `aspnetcore-data-access.md:35`; existing System/Microsoft SqlClient or Npgsql retained, not silently swapped. | Build against actual driver; typed commands, same-transaction rollback, cancellation and real-engine integration tests. |
| E16 Npgsql | Data `postgres-data-access.md:22/91`; direct driver versus EF provider distinguished; Npgsql 6 timestamps/batch, 7 data source, 8 dynamic JSON, provider 9 enum configuration gated. | Build/import driver references; PostgreSQL SQLSTATE, typed parameter, UTC/zero-offset and precision round trips. `timestamptz` does not retain the original offset/zone. |
| E17 Cross-stack | Backend `crossstack-api-contracts.md:1`, `crossstack-auth-boundaries.md:1`; implementation `crossstack-types-and-time.md:21/61`; testing `crossstack-e2e.md:1`; data `database-portability.md:23`. | Actual contract generation/drift, API and consumer compilation, 401/403/CORS/CSRF, typed precision/time and browser checks; same assertions on both engines, never one-engine proof of portability. |

Common preservation/safety rules are also in the owning entry skills'
Principles, Workflow and Safety boundaries. STEP 28 added explicit owning-app
rules in backend workflow :88, frontend :78 and implementation :79. No L0
description, dependency, provider, migration, or consumer project was changed.

### Inventory and trigger specification totals after fixes

| Pack | Capabilities | Positive / negative specifications |
|---|---|---|
| .NET (C# and ASP.NET Core) | 22 | 35 / 23 |
| Angular | 14 | 17 / 15 |
| Shared TypeScript/JavaScript | 8 | 14 / 8 |
| React | 8 | 11 / 8 |
| Next.js | 8 | 13 / 8 |
| Vue | 7 | 10 / 7 |
| Nuxt | 7 | 11 / 8 |
| Vite | 4 | 6 / 4 |
| SQL Server | 12 | 27 / 12 |
| PostgreSQL | 10 | 20 / 11 |
| Cross-stack | 8 | 19 / 8 |
| Total | 108 | 183 / 112 (295) |

Library specifications are separate: SQL Server EF Core, Dapper and ADO.NET
each 2 positive/1 negative; PostgreSQL EF Core 2/1, direct Npgsql 1/1,
SQLAlchemy 2/1, other existing drivers (including Dapper) 2/1. These are 20
additional specifications, validated by V-23.10, not executed agent results.

## 4. Findings and fixes

| ID | Finding | Resolution and evidence |
|---|---|---|
| TA-01 | Packaged README claimed six skills and lacked a usable technology index. | FIXED: 13 skills and 17 technology/library entries with packaged links; README:14/22. General Nitro/Elysia/Python versus absent Java pack explicitly distinguished. |
| TA-02 | Stack selection rules did not explicitly bound detection to each owner in a mixed-stack repository. | FIXED: owning app/service versions, provider, builder, commands and affected consumers now explicit in three entry workflows and README:54; no description or L0 growth. |
| TA-03 | Shared data-access recipes named newer EF APIs without local version gates. | FIXED: backend data-access:20, SQL Server data-access:25, PostgreSQL data-access:22 now gate API families and retain older APIs; UseAzureSql requires EF 9+. Driver reference tables still compile (DR checks). |
| TA-04 | PostgreSQL recipe allowed DateTimeOffset without its zero-offset restriction. | FIXED: postgres-data-access:73/114 and crossstack-types-and-time:78 distinguish UTC instants from original offsets/zones. Extended XF-06 tests rejection of +07:00 and successful explicit normalization. |
| TA-05 | Node guidance conflated Nuxt routing/config defaults with standalone Nitro. | FIXED: node-servers:23 distinguishes configured Nitro source roots, Nuxt conventions, h3 compatibility and Nitro 3 scanning/import changes. No Nitro upgrade or new pack implemented. |
| TA-06 | Required combined-stack and sibling-contamination cases lacked an explicit STEP 28 set. | FIXED as specifications: ten audit28 cases at technology-cases.json:4209; validated by V-23.7. Their provider execution remains NOT_RUN. |
| TA-07 | Cross-engine review suggested NULLS LAST without saying it is PostgreSQL syntax. | FIXED: database-portability:49 states a SQL Server CASE sort key alternative and requires provider-valid forms. Both-engine facts XF-13/14 remain PASS. |
| TA-08 | Full frontend/full-stack and provider behavior evidence is absent. | OPEN: R-49; STEP 28 PARTIAL. Runtime facts, static recipe checks and specifications are reported separately below. |
| TA-09 | Maintainer docs advertise Node 18, but validators use import.meta.dirname, unavailable on Node 18. | OPEN: R-50. Evidence: tools/catalog/README.md:7, tools/validate/README.md:9, check-technology.mjs:19 and the Node source below. Current checks ran on Node 24 only. This is a maintainer-tool compatibility defect, not permission to upgrade a consumer's Node version. |

## 5. Representative scenarios, including mixed-stack monorepos

All ten case specifications pass V-23 syntax/mapping validation. This column
does not imply that a model selected the skill or executed the scenario.
Full agent/provider execution of every row is **NOT_RUN**.

| Scenario | STEP 28 case suffix (full IDs in technology-cases.json) | Evidence actually executed | Full requested runtime/agent scenario |
|---|---|---|---|
| Angular + ASP.NET Core + SQL Server, Next sibling | `crossstack-e2e-audit28-angular` | .NET pipeline and SQL Server facts separately PASS; no Angular/browser fixture | NOT_RUN |
| React + Next.js + PostgreSQL, Angular/SQL sibling | `openapi-contract-sync-audit28-next-postgres` | Contract/auth/error/DB facts PASS; synthetic NF boundaries PASS, not compiled Next | NOT_RUN |
| Vue + Nuxt SSR, plain Vue 2 webpack sibling | `nuxt-data-fetching-audit28-vue-nuxt` | UF-04/BF-03 JS exposure counterexamples PASS; no Nuxt hydration | NOT_RUN |
| SQL Server versus PostgreSQL query analysis | `database-portability-review-audit28-query-analysis` | SF/PF plan/dialect checks and XF-13/14 two-engine semantics/SQL PASS | Agent query-review behavior NOT_RUN |
| React owner, root-hoisted Angular sibling | `angular-signals-audit28-sibling-negative` | Negative specification validates; no framework route evaluation | NOT_RUN |
| Plain Vue/Vite owner, Nuxt sibling | `nuxt-runtime-config-audit28-plain-vue-negative` | Negative specification validates; no Vite artifact | NOT_RUN |
| SQL Server owner, PostgreSQL sibling | `postgres-sql-dialect-audit28-sqlserver-negative` | SF-01 rejects PostgreSQL syntax; negative specification validates | NOT_RUN |
| TS contracts/web packages, unrelated Java/Spring service | `typescript-monorepo-audit28-java-sibling` | Specification validates; Java remains excluded | NOT_RUN |
| .NET 6 ADO.NET owner, EF 10 sibling | `aspnet-data-access-audit28-legacy-ado` | Current SqlClient fixture rollback PASS; not a .NET 6/legacy driver run | NOT_RUN |
| TS ISO offset → API → PostgreSQL/Npgsql | `crossstack-date-time-audit28-npgsql-offset` | Extended XF-06 + XF-05/07/08/09 PASS; no generated client/browser | NOT_RUN |

## 6. Verification executed in STEP 28

All commands ran from the repository root in Windows PowerShell. `$scratch`
was `$env:TEMP/chayen-step28-audit`. Reports from that directory were
consolidated into the repository result artifact linked in §1; no
commit was made. The environment had .NET SDKs 10.0.400/10.0.401, SQL Server
17.0.4025.3 Express LocalDB (compatibility 170, CI collation, RCSI off),
PostgreSQL 18.6 (temporary C-locale cluster), SQLAlchemy 2.0.43/psycopg 3.2.10,
and Node 24.15.0. No new dependency or external provider call was needed.

| Command | Actual final result | Limit |
|---|---|---|
| `node tools/validate/validate-all.mjs` | PASS, exit 0; 5/5 gate groups, 115/115 validator self-tests | G-11 here checks specification-file synchronization, not live triggering |
| `node tools/catalog/check-technology.mjs --write-doc` then without `--write-doc` | PASS, exit 0; 108 sections, 295 cases, seven library recipes, coverage synchronized | Static checks only |
| `node tools/catalog/audit-coverage.mjs` | PASS, exit 0; 206/206 engineering capabilities pass ten static checks | 48 shared recipes lack ID-labelled subsections (existing R-35); no behavior proof |
| `node tests/technology/dotnet/run-fact-checks.mjs --json "$scratch/dotnet.json"` | 29 PASS, 0 FAIL, 2 NOT_RUN; exit 0 | TF-22/24 need missing .NET 8 SDK |
| `node tests/technology/angular-typescript/run-fact-checks.mjs --report "$scratch/angular-typescript.md"` | 3 PASS, 0 FAIL, 19 NOT_RUN; exit 0 | Only JF-03/04/05; no supplied Angular, TS compiler or npm fixture |
| `node tests/technology/react-nextjs/run-fact-checks.mjs --report "$scratch/react-nextjs.md"` | 3 PASS, 0 FAIL, 13 NOT_RUN; exit 0 | NF-03/04/06 synthetic JS/Web boundaries, not React/Next runtime |
| `node tests/technology/vue-nuxt-vite/run-fact-checks.mjs --report "$scratch/vue-nuxt-vite.md"` | 2 PASS, 0 FAIL, 16 NOT_RUN; exit 0 | UF-04/BF-03 JS exposure counterexamples, not Vue/Nuxt/Vite runtime |
| `node tests/technology/sqlserver/run-fact-checks.mjs --report "$scratch/sqlserver.md" --json "$scratch/sqlserver.json"` | 30 PASS, 0 FAIL, 0 NOT_RUN; exit 0 | DR-01..03 and SF-01..27; one engine/edition |
| `node tests/technology/postgres-crossstack/run-fact-checks.mjs --report "$scratch/postgres-crossstack.md" --json "$scratch/postgres-crossstack.json" --pg-bin "$env:TEMP/chpg/pgsql/bin" --python "$env:TEMP/chpy/Scripts/python.exe"` | 40 PASS, 0 FAIL, 2 NOT_RUN; exit 0, including extended XF-06 | XF-02 and XF-12 need unavailable Node tools; cached browser alone is insufficient |
| Inline packaged Markdown link scan (`node --input-type=module`, §8) | PASS: 217 Markdown files, 248 local links, zero missing/escaping targets | V-08 separately checks skill reachability/heading anchors |
| `git diff --check` | PASS, exit 0 | Whitespace check only |

The first PostgreSQL invocation without `--pg-bin` correctly reported 12 PASS,
30 NOT_RUN; rerunning with the existing temporary binaries supplied the final
40/2 result. During XF-06 development the new test failed because it reused a
connection after deliberately rejected parameter serialization. The final test
uses a fresh connection for the normalized positive round trip; its full
runner re-execution passed. Earlier partial/development runs are not counted
as additional passing checks.

The database runners use disposable databases/temporary clusters and local
connections. They performed no shared/production schema action. The existing
ChayenFacts LocalDB instance was retained by its runner; a diagnostic `--keep`
run left temporary files under `$env:TEMP/chayen-pgx-facts-hW2HSS`, with the
cluster stopped. Historical STEP 20–27 reports remain unchanged.

### Unexecuted verification (all NOT_RUN)

- Live G-11 trigger precision/recall, G-12 agent recipe execution and required
  full mixed-stack scenario runs on Claude Code, Codex and Copilot.
- Angular AF-01..14; TypeScript JF-01/02/06/07/08; React RF-01..08; Next
  NF-01/02/05/07/08; all Vue VF checks, Nuxt UF except its JS counterexample,
  and Vite BF except its JS counterexample. Total with the other suites: 52.
- Cross-stack XF-02 generated-client compilation and XF-12 browser E2E;
  installed matching app fixtures, build artifacts and dependency tools were
  not available. No framework runtime scenario is inferred from JS checks.
- Older/unavailable framework/engine majors, managed services, ICU collations,
  alternate browsers/runtimes, edition-specific online operations, deployment,
  native-provider discovery/install behavior and human accessibility review.

**Closure for PARTIAL:** execute the specified positive/negative mixed-stack
cases with recorded provider transcripts, run matching Angular/ASP.NET/SQL,
React/Next/PostgreSQL and Vue/Nuxt fixtures, and supply existing tools for
XF-02/XF-12. Review version/edition claims on any additionally promised target.
Resolve R-50 by correcting the maintainer runtime declaration or restoring and
testing its declared Node 18 compatibility; neither option requires changing
consumer projects.
Do not promote capabilities based on static counts or successful runner exit
when checks remain NOT_RUN. These are follow-ups, not authorization to start
STEP 29, implement missing packs, install dependencies, or publish anything.

## 7. Primary-source checks

Consulted live on 2026-10-15 for claim review, not runtime proof. Existing
source inventories in TECHNOLOGY_COVERAGE §§5/8/10/12/14/16 remain relevant.

- [EF Core raw SQL](https://learn.microsoft.com/en-us/ef/core/querying/sql-queries)
  and [SQL Server provider](https://learn.microsoft.com/en-us/ef/core/providers/sql-server/):
  EF 7 FromSql, EF 8 unmapped SqlQuery, EF 9 UseAzureSql gates.
- [Npgsql dates](https://www.npgsql.org/doc/types/datetime.html) and
  [provider 6 changes](https://www.npgsql.org/efcore/release-notes/6.0.html):
  UTC/zero-offset storage and original-zone distinction.
- [Nitro 2 routing](https://v2.nitro.build/guide/routing) and
  [Nitro migration guidance](https://nitro.build/docs/migration): distinguish
  configured standalone routing/imports from Nuxt; no version upgrade inferred.
- [Angular compatibility](https://angular.dev/reference/versions),
  [TS 4.9](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html),
  [React useActionState](https://react.dev/reference/react/useActionState),
  [Next async request APIs](https://nextjs.org/docs/messages/sync-dynamic-apis),
  [Vue props](https://vuejs.org/guide/components/props),
  [Vue script setup](https://vuejs.org/api/sfc-script-setup), and
  [Vite env](https://vite.dev/guide/env-and-mode): version and exposure spot checks.
- [PostgreSQL 17 EXPLAIN](https://www.postgresql.org/docs/17/sql-explain.html):
  plan execution/options review complements the executed PostgreSQL 18 facts.
- [Node ESM metadata](https://nodejs.org/download/release/v20.18.3/docs/api/esm.html#importmetadirname):
  import.meta.dirname was added in Node 20.11, contradicting the maintainer
  tools' Node 18 declaration (TA-09/R-50); Node 18 execution was NOT_RUN.

## 8. Reproduce the additional packaged-link check

Run in PowerShell at repository root. This checks local Markdown link targets
in the distributable alone, including both README files; it skips code fences,
external URLs and anchor-only links. Skill heading anchors are covered by V-08.

```powershell
@'
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('plugins/codejadee-chayen-framework');
let files = 0, links = 0;
const bad = [];
function scan(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) scan(f);
    else if (e.name.endsWith('.md')) {
      files++;
      const t = fs.readFileSync(f, 'utf8').replace(/```[\s\S]*?```/g, '');
      for (const m of t.matchAll(/\[[^\]\n]+\]\(([^)\s]+)\)/g)) {
        const dest = m[1].split('#')[0];
        if (!dest || /^[a-z]+:/i.test(dest)) continue;
        links++;
        const target = path.resolve(path.dirname(f), decodeURIComponent(dest));
        if (!target.startsWith(root + path.sep) || !fs.existsSync(target))
          bad.push(path.relative(root, f) + ': ' + dest);
      }
    }
  }
}
scan(root);
console.log(JSON.stringify({ files, links, brokenOrEscaping: bad }));
process.exitCode = bad.length ? 1 : 0;
'@ | node --input-type=module
```
