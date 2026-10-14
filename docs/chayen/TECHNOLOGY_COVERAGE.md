# Technology Coverage

| Field | Value |
|---|---|
| Step | 23 |
| Date | 2026-10-15 |
| Catalog | [`catalog/technology-capabilities.yaml`](../../catalog/technology-capabilities.yaml) |
| Checker | `node tools/catalog/check-technology.mjs` (V-23; `--write-doc` regenerates §6) |
| Fact checks | .NET: [Step 20 run](../../tests/technology/dotnet/results/step20-fact-checks.md); Angular/TS/JS: [Step 21 run](../../tests/technology/angular-typescript/results/step21-fact-checks.md); React/Next: [Step 22 boundary results](../../tests/technology/react-nextjs/results/step22-fact-checks.md), [runner instructions](../../tests/technology/react-nextjs/README.md) |
| Decision | D-039 (PROPOSED); D-040..D-042 (user-directed scope ACCEPTED, layout PROPOSED) |
| Step 23 checks | [Exposure results](../../tests/technology/vue-nuxt-vite/results/step23-fact-checks.md), [runner instructions](../../tests/technology/vue-nuxt-vite/README.md) |

Technology packs add stack-specific capabilities beside the 206 engineering
capabilities. The engineering catalog is unchanged; technology capabilities
have their own catalog, IDs (`TECH-<TECH>-NNN`), checker, and evaluation
cases.

## 1. Summary

| Pack | Technologies | Capabilities | IMPLEMENTED | VERIFIED | Eval cases (+/−) | Framework facts |
|---|---|---|---|---|---|---|
| `dotnet-aspnetcore` | C# (8), ASP.NET Core (14) | **22 / 22** | 22 | **0** | 34 / 23 | 31 / 31 PASS on the .NET 10.0.401 and 8.0.406 SDKs |
| `angular` | Angular | **14 / 14** | 14 | **0** | 17 / 14 | 0 PASS, 14 NOT_RUN; no application dependency/browser fixture |
| `typescript-javascript` | Shared TS/JS | **8 / 8** | 8 | **0** | 13 / 8 | 8 PASS on Node 26.8.1, TypeScript 6.0.3, and the existing npm CLI |
| `react` | React | **8 / 8** | 8 | **0** | 11 / 8 | 0 PASS, 8 NOT_RUN; no installed app/runner/browser fixture |
| `nextjs` | Next.js | **8 / 8** | 8 | **0** | 13 / 8 | 3 synthetic boundary checks PASS, 5 NOT_RUN; no compiled Next verification |
| `vue` | Vue | **7 / 7** | 7 | **0** | 10 / 7 | 0 PASS, 7 NOT_RUN; no existing framework/runner fixture |
| `nuxt` | Nuxt | **7 / 7** | 7 | **0** | 10 / 7 | 1 JavaScript exposure counterexample PASS, 6 NOT_RUN; no Nuxt verification |
| `vite` | Vite | **4 / 4** | 4 | **0** | 6 / 4 | 1 JavaScript exposure counterexample PASS, 3 NOT_RUN; no Vite build verification |

- **IMPLEMENTED** means each capability has a reference section with
  applicability rules, version notes, numbered steps, and a verification
  rule, plus positive and negative evaluation cases, and passes V-23.
- **VERIFIED is 0.** No behaviour eval (G-12) or trigger eval (G-11) has
  run for these technology capabilities. The executed framework fact checks show that the behavior the guidance
  describes is real; they do not show that an agent follows the guidance.
  Step 22's three executed checks are synthetic JavaScript/Web-standard
  boundaries, not Next framework facts or a production auth-provider test.

## 2. How the pack is built

**Workflow and technology stay separate.** The general procedures stay in
the existing recipes (endpoints, auth, background jobs, migrations, tests,
performance, hosting). The .NET detail lives in `kind: technology`
references, which the skills load only when the stack is detected. Each
technology capability is one section in one of those references.

**One pack, several skills.** Skills cannot link to each other's files
(D-016), so the pack's references sit in the skill that handles each kind of
request:

| Skill | References | Capabilities |
|---|---|---|
| `chayen-implementation` | `csharp-types-and-nullability.md`, `csharp-async-and-memory.md`, `csharp-linq-and-serialization.md`, `csharp-project-health.md` | 8 C# capabilities |
| `chayen-backend` | `aspnetcore-webapi.md` (base: version, API style, architecture rules), `aspnetcore-endpoints.md`, `aspnetcore-pipeline.md`, `aspnetcore-auth.md`, `aspnetcore-data-access.md`, `aspnetcore-background-services.md` | 10 ASP.NET Core capabilities |
| `chayen-data` | `efcore-migrations.md` | aspnet-efcore-migrations |
| `chayen-testing` | `dotnet-testing.md` (extended) | aspnet-integration-testing |
| `chayen-performance` | `aspnetcore-performance.md` | aspnet-performance |
| `chayen-devops` | `aspnetcore-hosting.md` | aspnet-hosting-deployment |
| `chayen-frontend` | `angular.md` (base); `angular-components.md`, `angular-reactivity.md`, `angular-navigation-http.md`, `angular-forms-accessibility.md`, `angular-ssr-upgrades.md` | 13 Angular capabilities |
| `chayen-testing` | `angular-testing.md` | angular-testing |
| `chayen-implementation` | `typescript-javascript.md` (base); `typescript-types.md`, `javascript-runtime.md`, `typescript-workspace.md` | 8 shared TS/JS capabilities |
| `chayen-frontend` | `react-nextjs.md` (expanded base); `react-components-state.md`, `react-data-forms.md`, `react-navigation-accessibility.md`, `react-rendering.md` | 7 React capabilities |
| `chayen-testing` | `react-testing.md` | react-component-testing |
| `chayen-frontend` | `nextjs-routing-boundaries.md`, `nextjs-rendering-seo.md` | nextjs-app-router, nextjs-server-client-boundary, nextjs-rendering-seo |
| `chayen-backend` | `nextjs-server.md` (base), `nextjs-mutations.md`, `nextjs-data-auth.md` | nextjs-server-functions, nextjs-route-handlers, nextjs-data-caching, nextjs-authentication |
| `chayen-devops` | `nextjs-deployment.md` | nextjs-deployment-testing |
| `chayen-frontend` | `vue-nuxt.md` (expanded base); `vue-composition.md`, `vue-routing-state.md`, `vue-performance.md` | 6 Vue capabilities |
| `chayen-testing` | `vue-testing.md` | vue-component-testing |
| `chayen-frontend` | `nuxt-app.md`, `nuxt-modules.md` | nuxt-routing, nuxt-data-fetching, nuxt-auto-imports, nuxt-modules |
| `chayen-backend` | `nuxt-server.md` | nuxt-server-api, nuxt-runtime-config |
| `chayen-devops` | `nuxt-deployment.md`, `vite-toolchain.md` | nuxt-rendering-deployment; 3 Vite configuration/build/env capabilities |
| `chayen-testing` | `vite-testing.md` | vite-test-integration |

No new entry skill was added, and no description changed. The L0 budget
stays at 5,485 / 5,500.

**Section anatomy** (SKILL_AUTHORING_STANDARD §5.3):

- a heading that ends with the capability name, for example
  `## Request validation (aspnet-validation)`;
- **Applies when** and **Not when** (with the better fit);
- **Version notes**;
- at least 4 numbered **Steps**;
- a **Verify** rule that reports PASS, FAIL, NOT_RUN, or MEASURED.

## 3. Step 20 requirements

| Requirement | Where it is addressed |
|---|---|
| Detect the actual .NET version | `aspnetcore-webapi.md` "Detect the actual .NET version" (project file, `Directory.Build.props`, `global.json`, `LangVersion`, package versions, CI images, `dotnet --version`), with a version-gate table. Every C# and ASP.NET Core section has **Version notes**. Facts TF-22 (global.json pins the SDK) and TF-24 (.NET 8 versus .NET 10 test behaviour). |
| Respect Controllers or Minimal API conventions | `aspnetcore-webapi.md` conventions table; aspnet-api-endpoints step 1 ("never convert styles"); cases `tc-aspnet-api-endpoints-01` (controllers) and `-02` (minimal API on net6.0) |
| Respect existing architecture and dependency rules | `aspnetcore-webapi.md` "Detect the conventions and architecture" (project reference direction, architecture tests, ADRs) and the pitfall on layering |
| Async, CancellationToken, nullable references, DI, validation, exception handling | csharp-async-concurrency, csharp-nullability, aspnet-dependency-injection, aspnet-validation, aspnet-exception-handling, plus "C# rules that apply to every endpoint" in the base reference. Facts TF-03, TF-04, TF-05, TF-10, TF-29. |
| Use project-supported testing frameworks | aspnet-integration-testing steps 1 and 2; case `tc-aspnet-integration-testing-02` (NUnit) |
| Consider WebApplicationFactory for suitable integration tests | aspnet-integration-testing; facts TF-01, TF-07, TF-24 |
| Never impose a new architectural pattern automatically | `aspnetcore-webapi.md` (mediators, repositories, CQRS, result types, layers, style switches need an explicit request); csharp-type-design step 7; aspnet-data-access step 1 |
| Do not assume every .NET project uses EF Core | `aspnetcore-data-access.md` (EF Core, Dapper, ADO.NET); `efcore-migrations.md` step 1 and **Not when**; cases `tc-aspnet-data-access-01` (Dapper), `tc-aspnet-efcore-migrations-neg-01` (DbUp) and `-neg-02` (database-first with SSDT) |
| Actionable guidance, applicability rules, positive and negative evaluations | Section anatomy (§2), V-23.5, and V-23.7 |
| Keep technology knowledge separate from workflow | §2 |

## 4. Validation

| Check | What it proves | Result (Step 20) |
|---|---|---|
| V-23.1 inventory | All 22 names match the user's Step 20 list exactly, in order, with the right technology; IDs and names unique | PASS |
| V-23.2 records | Purpose, applicability, inputs, outputs, mapping, related engineering capabilities, facts, verification, status, and evidence | PASS |
| V-23.3 mapping | Entry skill exists; the reference is a `kind: technology` file in that skill and is listed in its References table with a load condition | PASS |
| V-23.4 sections | Exactly one section per capability, in the mapped file; no orphan capability sections | PASS |
| V-23.5 anatomy | Applies when, Not when, Version notes, at least 4 steps of at least 80 words, and a Verify reporting rule | PASS |
| V-23.6 placeholders | No TODO, TBD, FIXME, or lorem ipsum | PASS |
| V-23.7 cases | At least 1 positive and 1 negative case per capability, consistent with the mapping | PASS (57 cases) |
| V-23.8 facts | Every fact listed by a record exists, and every fact is listed by its capability | PASS (31 facts) |
| V-23.9 coverage doc | §6 matches the catalog | PASS |
| Self-tests | 14 negative controls in `tests/catalog/technology-mutations.json` | See PROGRESS Step 20 |
| Framework facts | `run-fact-checks.mjs` | 31 PASS, 0 FAIL, 0 NOT_RUN |
| Behaviour evals (G-12) | An agent applies the sections correctly on fixture repositories | NOT_RUN |
| Trigger evals (G-11) | The .NET prompts reach the intended skills | NOT_RUN |

**Framework facts per capability.** Every capability has at least one
executed fact:

| Capability | Facts |
|---|---|
| csharp-nullability | TF-04 implicit required in controllers; TF-13 JSON ignores annotations by default; TF-21 warnings as errors |
| csharp-async-concurrency | TF-29 CA2016 reports an unforwarded token |
| csharp-memory-disposal | TF-30 CA2000 reports an undisposed reader (heuristic) |
| csharp-linq-optimization | TF-09 untranslatable EF Core predicates throw |
| csharp-type-design | TF-14 record equality and collection members |
| csharp-serialization | TF-12 case sensitivity of default and Web options; TF-13 |
| csharp-code-analysis | TF-20 `dotnet format --verify-no-changes`; TF-21 |
| csharp-project-maintenance | TF-22 SDK pinning; TF-23 `.slnx` and noun-first commands on SDK 10; TF-25 vulnerability listing |
| aspnet-api-endpoints | TF-02 TypedResults 404 |
| aspnet-request-pipeline | TF-27 status code pages with problem details |
| aspnet-dependency-injection | TF-10 scope validation in Development only |
| aspnet-validation | TF-03 .NET 10 minimal API validation; TF-04 |
| aspnet-authentication | TF-28 missing default scheme is a server error; TF-07 |
| aspnet-authorization | TF-07 401, 403, and 200 paths |
| aspnet-openapi | TF-06 `/openapi/v1.json` |
| aspnet-exception-handling | TF-05 IExceptionHandler and no message outside Development; TF-27 |
| aspnet-background-services | TF-11 an exception stops the host |
| aspnet-data-access | TF-08 parameterized SQL; TF-09 |
| aspnet-efcore-migrations | TF-15 to TF-19: add without a database, pending-changes check, rename, rename plus type change (data loss), idempotent script |
| aspnet-integration-testing | TF-01 .NET 10 `Program` access; TF-24 .NET 8 needs `public partial class Program`; TF-07 |
| aspnet-performance | TF-31 output caching |
| aspnet-hosting-deployment | TF-26 `dotnet publish` |

## 5. Limitations and risks

- **Routing is unmeasured (R-37).** `chayen-implementation` does not name C#
  in its description, which is at the L0 limit; C# language prompts rely on
  its general code-change wording. EF Core migration prompts may reach
  `chayen-backend` (which names migrations) instead of `chayen-data`. Seven
  trigger cases were added for these prompts; none has run.
- **Facts cover two SDKs (R-38).** Facts ran on SDK 10.0.401 and 8.0.406.
  Version notes for .NET 6, 7, and 9 come from agent knowledge and the
  official "what's new" pages, not execution. Advisory-dependent behaviour
  (NuGet audit) changes over time.
- **Some guidance has no executed fact:** container defaults (port 8080 and
  the non-root user on .NET 8 images), JWT validation details, HybridCache,
  Native AOT limits, and the commercial licence changes of some libraries.
  These are stated as things to check, not as verified facts.
- **Self-review.** The guidance and this report are agent-written (R-33).

## 6. Capability table

Generated by `node tools/catalog/check-technology.mjs --write-doc`.

<!-- BEGIN GENERATED: check-technology -->
| ID | Name | Technology | Entry skill | Reference section | Cases +/− | Facts | Status |
|---|---|---|---|---|---|---|---|
| TECH-CSHARP-001 | `csharp-nullability` | csharp | chayen-implementation | `csharp-types-and-nullability.md` § Nullable reference types | 2/1 | TF-04, TF-13, TF-21 | IMPLEMENTED |
| TECH-CSHARP-002 | `csharp-async-concurrency` | csharp | chayen-implementation | `csharp-async-and-memory.md` § Async and concurrency | 2/1 | TF-29 | IMPLEMENTED |
| TECH-CSHARP-003 | `csharp-memory-disposal` | csharp | chayen-implementation | `csharp-async-and-memory.md` § Memory and disposal | 1/1 | TF-30 | IMPLEMENTED |
| TECH-CSHARP-004 | `csharp-linq-optimization` | csharp | chayen-implementation | `csharp-linq-and-serialization.md` § LINQ optimization | 2/1 | TF-09 | IMPLEMENTED |
| TECH-CSHARP-005 | `csharp-type-design` | csharp | chayen-implementation | `csharp-types-and-nullability.md` § Type design | 1/1 | TF-14 | IMPLEMENTED |
| TECH-CSHARP-006 | `csharp-serialization` | csharp | chayen-implementation | `csharp-linq-and-serialization.md` § Serialization | 2/1 | TF-12, TF-13 | IMPLEMENTED |
| TECH-CSHARP-007 | `csharp-code-analysis` | csharp | chayen-implementation | `csharp-project-health.md` § Code analysis | 2/1 | TF-20, TF-21 | IMPLEMENTED |
| TECH-CSHARP-008 | `csharp-project-maintenance` | csharp | chayen-implementation | `csharp-project-health.md` § Project maintenance | 2/1 | TF-22, TF-23, TF-25 | IMPLEMENTED |
| TECH-ASPNET-001 | `aspnet-api-endpoints` | aspnetcore | chayen-backend | `aspnetcore-endpoints.md` § Endpoints | 2/1 | TF-02 | IMPLEMENTED |
| TECH-ASPNET-002 | `aspnet-request-pipeline` | aspnetcore | chayen-backend | `aspnetcore-pipeline.md` § Request pipeline | 1/1 | TF-27 | IMPLEMENTED |
| TECH-ASPNET-003 | `aspnet-dependency-injection` | aspnetcore | chayen-backend | `aspnetcore-pipeline.md` § Dependency injection and options | 1/1 | TF-10 | IMPLEMENTED |
| TECH-ASPNET-004 | `aspnet-validation` | aspnetcore | chayen-backend | `aspnetcore-endpoints.md` § Request validation | 2/1 | TF-03, TF-04 | IMPLEMENTED |
| TECH-ASPNET-005 | `aspnet-authentication` | aspnetcore | chayen-backend | `aspnetcore-auth.md` § Authentication | 1/1 | TF-28, TF-07 | IMPLEMENTED |
| TECH-ASPNET-006 | `aspnet-authorization` | aspnetcore | chayen-backend | `aspnetcore-auth.md` § Authorization | 1/1 | TF-07 | IMPLEMENTED |
| TECH-ASPNET-007 | `aspnet-openapi` | aspnetcore | chayen-backend | `aspnetcore-endpoints.md` § OpenAPI documents | 2/1 | TF-06 | IMPLEMENTED |
| TECH-ASPNET-008 | `aspnet-exception-handling` | aspnetcore | chayen-backend | `aspnetcore-pipeline.md` § Exception handling and error responses | 2/1 | TF-05, TF-27 | IMPLEMENTED |
| TECH-ASPNET-009 | `aspnet-background-services` | aspnetcore | chayen-backend | `aspnetcore-background-services.md` § Background services | 1/1 | TF-11 | IMPLEMENTED |
| TECH-ASPNET-010 | `aspnet-data-access` | aspnetcore | chayen-backend | `aspnetcore-data-access.md` § Data access in an API | 2/1 | TF-08, TF-09 | IMPLEMENTED |
| TECH-ASPNET-011 | `aspnet-efcore-migrations` | aspnetcore | chayen-data | `efcore-migrations.md` § EF Core migrations | 1/2 | TF-15, TF-16, TF-17, TF-18, TF-19 | IMPLEMENTED |
| TECH-ASPNET-012 | `aspnet-integration-testing` | aspnetcore | chayen-testing | `dotnet-testing.md` § ASP.NET Core integration tests | 2/1 | TF-01, TF-24, TF-07 | IMPLEMENTED |
| TECH-ASPNET-013 | `aspnet-performance` | aspnetcore | chayen-performance | `aspnetcore-performance.md` § ASP.NET Core performance | 1/1 | TF-31 | IMPLEMENTED |
| TECH-ASPNET-014 | `aspnet-hosting-deployment` | aspnetcore | chayen-devops | `aspnetcore-hosting.md` § Hosting and deployment | 1/1 | TF-26 | IMPLEMENTED |
| TECH-ANGULAR-001 | `angular-component-design` | angular | chayen-frontend | `angular-components.md` § Component boundaries | 2/1 | AF-01 | IMPLEMENTED |
| TECH-ANGULAR-002 | `angular-signals` | angular | chayen-frontend | `angular-reactivity.md` § Signal state | 1/1 | AF-02 | IMPLEMENTED |
| TECH-ANGULAR-003 | `angular-rxjs-interop` | angular | chayen-frontend | `angular-reactivity.md` § Observable boundaries | 1/1 | AF-03 | IMPLEMENTED |
| TECH-ANGULAR-004 | `angular-state-management` | angular | chayen-frontend | `angular-reactivity.md` § State ownership | 1/1 | AF-04 | IMPLEMENTED |
| TECH-ANGULAR-005 | `angular-routing` | angular | chayen-frontend | `angular-navigation-http.md` § Navigation contracts | 1/1 | AF-05 | IMPLEMENTED |
| TECH-ANGULAR-006 | `angular-http-client` | angular | chayen-frontend | `angular-navigation-http.md` § Client requests | 2/1 | AF-06 | IMPLEMENTED |
| TECH-ANGULAR-007 | `angular-forms` | angular | chayen-frontend | `angular-forms-accessibility.md` § Form contracts | 1/1 | AF-07 | IMPLEMENTED |
| TECH-ANGULAR-008 | `angular-template-control-flow` | angular | chayen-frontend | `angular-components.md` § Template branches and lists | 2/1 | AF-08 | IMPLEMENTED |
| TECH-ANGULAR-009 | `angular-dependency-injection` | angular | chayen-frontend | `angular-components.md` § Injector ownership | 1/1 | AF-09 | IMPLEMENTED |
| TECH-ANGULAR-010 | `angular-change-detection` | angular | chayen-frontend | `angular-reactivity.md` § Rendering notifications | 1/1 | AF-10 | IMPLEMENTED |
| TECH-ANGULAR-011 | `angular-ssr-hydration` | angular | chayen-frontend | `angular-ssr-upgrades.md` § Server render and client reuse | 1/1 | AF-11 | IMPLEMENTED |
| TECH-ANGULAR-012 | `angular-testing` | angular | chayen-testing | `angular-testing.md` § Angular behavior tests | 1/1 | AF-12 | IMPLEMENTED |
| TECH-ANGULAR-013 | `angular-accessibility` | angular | chayen-frontend | `angular-forms-accessibility.md` § Accessible Angular views | 1/1 | AF-13 | IMPLEMENTED |
| TECH-ANGULAR-014 | `angular-upgrade-migration` | angular | chayen-frontend | `angular-ssr-upgrades.md` § Requested upgrades | 1/1 | AF-14 | IMPLEMENTED |
| TECH-JS-001 | `typescript-type-safety` | typescript-javascript | chayen-implementation | `typescript-types.md` § Safe narrowing | 1/1 | JF-01 | IMPLEMENTED |
| TECH-JS-002 | `typescript-api-modeling` | typescript-javascript | chayen-implementation | `typescript-types.md` § API representation | 1/1 | JF-02 | IMPLEMENTED |
| TECH-JS-003 | `javascript-async-control` | typescript-javascript | chayen-implementation | `javascript-runtime.md` § Async ordering and cancellation | 1/1 | JF-03 | IMPLEMENTED |
| TECH-JS-004 | `javascript-runtime-compatibility` | typescript-javascript | chayen-implementation | `javascript-runtime.md` § Runtime support | 1/1 | JF-04 | IMPLEMENTED |
| TECH-JS-005 | `esm-cjs-interop` | typescript-javascript | chayen-implementation | `javascript-runtime.md` § Module boundaries | 1/1 | JF-05 | IMPLEMENTED |
| TECH-JS-006 | `package-manager-integrity` | typescript-javascript | chayen-implementation | `typescript-workspace.md` § Reproducible dependency operations | 6/1 | JF-06 | IMPLEMENTED |
| TECH-JS-007 | `typescript-monorepo` | typescript-javascript | chayen-implementation | `typescript-workspace.md` § Package boundaries | 1/1 | JF-07 | IMPLEMENTED |
| TECH-JS-008 | `typescript-config-review` | typescript-javascript | chayen-implementation | `typescript-workspace.md` § Effective compiler settings | 1/1 | JF-08 | IMPLEMENTED |
| TECH-REACT-001 | `react-component-patterns` | react | chayen-frontend | `react-components-state.md` § Component contracts | 2/1 | RF-01 | IMPLEMENTED |
| TECH-REACT-002 | `react-state-effects` | react | chayen-frontend | `react-components-state.md` § Owned state and synchronization | 1/1 | RF-02 | IMPLEMENTED |
| TECH-REACT-003 | `react-server-state` | react | chayen-frontend | `react-data-forms.md` § Remote state ownership | 2/1 | RF-03 | IMPLEMENTED |
| TECH-REACT-004 | `react-form-handling` | react | chayen-frontend | `react-data-forms.md` § User input and submission | 1/1 | RF-04 | IMPLEMENTED |
| TECH-REACT-005 | `react-routing` | react | chayen-frontend | `react-navigation-accessibility.md` § Existing routing architecture | 1/1 | RF-05 | IMPLEMENTED |
| TECH-REACT-006 | `react-render-optimization` | react | chayen-frontend | `react-rendering.md` § Measured render changes | 1/1 | RF-06 | IMPLEMENTED |
| TECH-REACT-007 | `react-component-testing` | react | chayen-testing | `react-testing.md` § Observable component behavior | 2/1 | RF-07 | IMPLEMENTED |
| TECH-REACT-008 | `react-accessibility` | react | chayen-frontend | `react-navigation-accessibility.md` § Accessible React controls | 1/1 | RF-08 | IMPLEMENTED |
| TECH-NEXTJS-001 | `nextjs-app-router` | nextjs | chayen-frontend | `nextjs-routing-boundaries.md` § App Router segments | 2/1 | NF-01 | IMPLEMENTED |
| TECH-NEXTJS-002 | `nextjs-server-client-boundary` | nextjs | chayen-frontend | `nextjs-routing-boundaries.md` § Server and client imports | 2/1 | NF-02 | IMPLEMENTED |
| TECH-NEXTJS-003 | `nextjs-server-functions` | nextjs | chayen-backend | `nextjs-mutations.md` § Callable server mutations | 2/1 | NF-03 | IMPLEMENTED |
| TECH-NEXTJS-004 | `nextjs-route-handlers` | nextjs | chayen-backend | `nextjs-mutations.md` § HTTP entrypoints | 1/1 | NF-04 | IMPLEMENTED |
| TECH-NEXTJS-005 | `nextjs-data-caching` | nextjs | chayen-backend | `nextjs-data-auth.md` § Cache scope and invalidation | 2/1 | NF-05 | IMPLEMENTED |
| TECH-NEXTJS-006 | `nextjs-authentication` | nextjs | chayen-backend | `nextjs-data-auth.md` § Server authentication and resource access | 2/1 | NF-06 | IMPLEMENTED |
| TECH-NEXTJS-007 | `nextjs-rendering-seo` | nextjs | chayen-frontend | `nextjs-rendering-seo.md` § Rendering and search metadata | 1/1 | NF-07 | IMPLEMENTED |
| TECH-NEXTJS-008 | `nextjs-deployment-testing` | nextjs | chayen-devops | `nextjs-deployment.md` § Production artifact checks | 1/1 | NF-08 | IMPLEMENTED |
| TECH-VUE-001 | `vue-composition-api` | vue | chayen-frontend | `vue-composition.md` § Composition conventions | 1/1 | VF-01 | IMPLEMENTED |
| TECH-VUE-002 | `vue-reactivity` | vue | chayen-frontend | `vue-composition.md` § Reactive ownership and derivation | 2/1 | VF-02 | IMPLEMENTED |
| TECH-VUE-003 | `vue-composables` | vue | chayen-frontend | `vue-composition.md` § Reusable instance behavior | 1/1 | VF-03 | IMPLEMENTED |
| TECH-VUE-004 | `vue-router` | vue | chayen-frontend | `vue-routing-state.md` § Plain Vue navigation | 1/1 | VF-04 | IMPLEMENTED |
| TECH-VUE-005 | `vue-state-management` | vue | chayen-frontend | `vue-routing-state.md` § Store and request scope | 2/1 | VF-05 | IMPLEMENTED |
| TECH-VUE-006 | `vue-component-testing` | vue | chayen-testing | `vue-testing.md` § Public component behavior | 2/1 | VF-06 | IMPLEMENTED |
| TECH-VUE-007 | `vue-performance` | vue | chayen-frontend | `vue-performance.md` § Measured rendering changes | 1/1 | VF-07 | IMPLEMENTED |
| TECH-NUXT-001 | `nuxt-routing` | nuxt | chayen-frontend | `nuxt-app.md` § Framework routes | 2/1 | UF-01 | IMPLEMENTED |
| TECH-NUXT-002 | `nuxt-data-fetching` | nuxt | chayen-frontend | `nuxt-app.md` § SSR-aware remote data | 1/1 | UF-02 | IMPLEMENTED |
| TECH-NUXT-003 | `nuxt-server-api` | nuxt | chayen-backend | `nuxt-server.md` § Protected server entrypoints | 1/1 | UF-03 | IMPLEMENTED |
| TECH-NUXT-004 | `nuxt-runtime-config` | nuxt | chayen-backend | `nuxt-server.md` § Runtime privacy and overrides | 2/1 | UF-04 | IMPLEMENTED |
| TECH-NUXT-005 | `nuxt-auto-imports` | nuxt | chayen-frontend | `nuxt-app.md` § Context and generated imports | 2/1 | UF-05 | IMPLEMENTED |
| TECH-NUXT-006 | `nuxt-modules` | nuxt | chayen-frontend | `nuxt-modules.md` § Existing module contracts | 1/1 | UF-06 | IMPLEMENTED |
| TECH-NUXT-007 | `nuxt-rendering-deployment` | nuxt | chayen-devops | `nuxt-deployment.md` § Render modes and production artifacts | 1/1 | UF-07 | IMPLEMENTED |
| TECH-VITE-001 | `vite-configuration` | vite | chayen-devops | `vite-toolchain.md` § Configuration ownership | 2/1 | BF-01 | IMPLEMENTED |
| TECH-VITE-002 | `vite-build-optimization` | vite | chayen-devops | `vite-toolchain.md` § Measured build changes | 1/1 | BF-02 | IMPLEMENTED |
| TECH-VITE-003 | `vite-environment-safety` | vite | chayen-devops | `vite-toolchain.md` § Build-time environment exposure | 1/1 | BF-03 | IMPLEMENTED |
| TECH-VITE-004 | `vite-test-integration` | vite | chayen-testing | `vite-testing.md` § Configured runner integration | 2/1 | BF-04 | IMPLEMENTED |

Totals: 78 records; IMPLEMENTED 78, VERIFIED 0, IN_PROGRESS 0, PLANNED 0.
<!-- END GENERATED: check-technology -->

## 7. Step 21 requirements and validation

The user's Step 21 prompt replaces the original indicative user-documentation
step (D-040). Only Angular and shared TS/JS support was implemented; no later
step, release, commit, dependency upgrade, or publication was performed.

| Requirement | Implementation and case evidence |
|---|---|
| Inspect Angular version before patterns | `angular.md` detection and compatibility gates; every capability's Version notes; legacy Angular 14/15/16 cases in `technology-cases.json` |
| Preserve standalone/NgModule conventions | angular-component-design, angular-routing, angular-testing; `tc-angular-component-design-01` (NgModule) and `-standalone` |
| No forced Signals, zoneless, or new control flow | Base rules; angular-signals negative legacy case; `tc-angular-template-control-flow-01` (Angular 16) and `-modern` (Angular 18); upgrade case explicitly retains all four conventions |
| Preserve RxJS and state management | angular-rxjs-interop and angular-state-management; existing NgRx and BehaviorSubject cases |
| Detect npm, pnpm, Yarn, Bun | Both base references and package-manager-integrity; positive cases `-npm`, `-pnpm`, `-yarn-classic`, `-yarn-modern`, `-01` (Bun), and `-conflict` |
| Respect build and test runners | Base references and angular-testing; Karma/Jasmine case, workspace graph/config guidance, runner-specific async warning |
| Keep server secrets out of frontend | Angular HTTP/DI/SSR and TS/JS base; `tc-angular-http-client-server-secret` covers browser imports, public config, bundles, source maps, HTML, transfer state |
| Practical guides, recipes, examples, positive/negative tests | 22 technology sections augment existing workflow recipes, with scoped procedures and examples; 52 new technology cases (30 positive, 22 negative) |
| Validate all 22 capabilities | V-23.1..9 PASS for all 44 total records; each new record has exact inventory identity, one mapped section, positive/negative cases, and fact IDs |

**Static validation is not agent behavior validation.** New technology cases
are specifications for G-12, not executed agent tests. Eight trigger cases were
added and generated (150 total); billed trigger evaluations remain NOT_RUN.
Nine new mutation controls exercise Angular/JS inventory, mapping, orphans,
version notes, section order, case mapping, and facts. The validator suite
results and exact commands are in PROGRESS Step 21.

**Executed facts:** JF-01..08 PASS, including valid/invalid type checks,
JSON timestamp representation, cancellation, absent browser globals, explicit
CJS/ESM consumers, offline npm lock consistency, unchanged emitted aliases,
and inherited compiler settings. The compiler came from an existing editor
installation and is only a fact-test tool, not a replacement for a project's
pinned compiler. No Angular or TS package was downloaded or added.

**Unexecuted:** AF-01..14 NOT_RUN; no Angular app dependency fixture was
supplied. No Angular production build, rendered accessibility, automatic
change-notification, real SSR/hydration, runner migration, or upgrade behavior
is claimed. The optional pure Angular facts are also untested in this run;
they do not cover older-major compatibility. Behavior/trigger evals and human
review remain required before promoting any new capability to VERIFIED.

## 8. Step 21 official documentation consulted

Checked 2026-10-15; documentation review supplies compatibility guidance,
not executed framework or provider verification.

- [Angular version compatibility](https://angular.dev/reference/versions),
  [standalone migration](https://angular.dev/reference/migrations/standalone),
  [control-flow migration](https://angular.dev/reference/migrations/control-flow).
- [Signals](https://angular.dev/guide/signals),
  [RxJS interop](https://angular.dev/ecosystem/rxjs-interop),
  [zoneless](https://angular.dev/guide/zoneless).
- [Testing](https://angular.dev/guide/testing),
  [HTTP testing](https://angular.dev/guide/http/testing),
  [hydration](https://angular.dev/guide/hydration).
- [TypeScript module resolution](https://www.typescriptlang.org/tsconfig/moduleResolution.html),
  [Node package/module behavior](https://nodejs.org/api/packages.html).
- [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/),
  [pnpm install](https://pnpm.io/cli/install),
  [Yarn install](https://yarnpkg.com/cli/install),
  [Bun install](https://bun.sh/docs/pm/cli/install).

## 9. Step 22 requirements and validation

STEP 22 ONLY adds 8 React and 8 Next.js capabilities to the existing packs;
the engineering catalog and entry-skill descriptions remain unchanged. The
user-directed scope replaces the original indicative release-readiness step
(D-041). No release, publication, commit, or later step was executed.

| Requirement | Implementation / evaluation evidence |
|---|---|
| Detect React/Next versions | Expanded react-nextjs base; nextjs-server and testing/deployment bases; per-section Version notes; React 17/18/19 and Next 13/14/15/16 contexts |
| Preserve routing | react-routing and nextjs-app-router; Pages negative cases and Pages rendering/SEO positive; App Router async-props positive; no implicit migrations or second router |
| Preserve server/client execution | nextjs-server-client-boundary; server-only import graph, minimal DTOs, client prerender warning; `tc-nextjs-server-client-boundary-prerender` |
| No secrets in client bundles | Both bases correct the old prefix-only rule; cover public env, config env, imports, props, action results, source maps, HTML/RSC; require actual synthetic-sentinel build tests when a fixture exists |
| Server authentication and authorization | nextjs-server-functions, nextjs-route-handlers, nextjs-authentication; `-forged-owner`, `-bypass-proxy` cases; direct denial/no-write fixture NF-03/04/06 |
| Respect state tools, avoid unnecessary libraries | React state/server-state/forms steps; Redux/TanStack Query/RHF contexts and `tc-react-server-state-no-new-library`; no speculative dependency additions |
| Configured test tools | react-component-testing with Vitest and Jest cases; runner/version/DOM discovery; Next deployment uses configured lint/tests and never invents next lint |
| Implementation recipes and positive/negative cases | 16 detailed technology procedures plus existing owning workflow recipes; 40 new cases (24 positive, 16 negative); examples for props, forms, accessibility, mutations, caches, and production artifacts |
| Validate 16/16 | V-23 validates all 60 records, including exact 8+8 Step 22 inventory, mapped sections, ordered applicability/version/steps/verification, positive/negative specs, and RF/NF fact IDs |

**Results:** see PROGRESS Step 22 for exact commands. Eight new mutation
controls exercise React/Next inventory, missing/orphan sections, version notes,
case mapping, and fact references. Eight trigger prompts were generated;
the full trigger set is 158 cases/377 files. Technology specifications total
149; their agent execution remains NOT_RUN.

**Executed boundary tests:**
`node tests/technology/react-nextjs/run-fact-checks.mjs --report tests/technology/react-nextjs/results/step22-fact-checks.md`
reports 3 PASS, 0 FAIL, 13 NOT_RUN on Node 26.8.1. NF-03 directly calls a
synthetic mutation entrypoint; NF-04 tests Web Request/Response handler
contracts; NF-06 calls a loopback HTTP boundary for anonymous, expired,
revoked, forbidden, wrong-tenant, and allowed identities, with forged
owner/role fields and no writes on denial. Fixed fixture sessions are not a
production authentication scheme. No dependency was installed.

**Limits:** [Step 22 result](../../tests/technology/react-nextjs/results/step22-fact-checks.md)
and [runner documentation](../../tests/technology/react-nextjs/README.md).
No React interaction/profiling/accessibility or compiled Next routing,
Server Function transport, cache, secret-bundle/RSC, metadata, hydration,
auth-provider, or deployment verification ran. Even optional React markup
facts are unexecuted without installed dependencies. All 16 are IMPLEMENTED,
0 VERIFIED; agent behavior/trigger evaluations and human review remain open.
Frontend SKILL.md is 206 lines: above the 200-line target (one V-06 warning),
within the 300-line hard limit. R-41/R-42 record these limits and routing risk.

## 10. Step 22 official documentation consulted

Checked 2026-10-15. These references inform version-dependent guidance;
documentation review is not runtime or agent verification.

- [React versions](https://react.dev/versions),
  [effect decisions](https://react.dev/learn/you-might-not-need-an-effect),
  [useEffect](https://react.dev/reference/react/useEffect),
  [memo](https://react.dev/reference/react/memo),
  [useActionState](https://react.dev/reference/react/useActionState).
- [Next 16 upgrade changes](https://nextjs.org/docs/app/guides/upgrading/version-16),
  [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components),
  [data security](https://nextjs.org/docs/app/guides/data-security).
- [Server Functions/mutations](https://nextjs.org/docs/app/getting-started/mutating-data),
  [route handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route),
  [authentication](https://nextjs.org/docs/app/guides/authentication).
- [Caching without Cache Components](https://nextjs.org/docs/app/guides/caching-without-cache-components),
  [Cache Components model](https://nextjs.org/docs/app/getting-started/caching),
  [metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images),
  [testing](https://nextjs.org/docs/app/guides/testing),
  [self-hosting](https://nextjs.org/docs/app/guides/self-hosting).

## 11. Step 23 requirements and validation

STEP 23 ONLY adds seven Vue, seven Nuxt, and four Vite technology capabilities
using existing routers and workflow recipes (D-042). No entry skill, description,
engineering-catalog, dependency, or unrelated earlier-step record was changed.
The catalog now contains 78 technology records, all IMPLEMENTED, 0 VERIFIED.

| Requirement | Implementation and evaluation evidence |
|---|---|
| Actual versions | vue-nuxt, nuxt-server, Vite/tooling/test/deployment detection; per-section Version notes; Vue 2/2.7/3.3/3.4/3.5 and Nuxt 2/3/4, Vite 5/6/8 case contexts |
| Plain Vue versus Nuxt | Base manifest/config/context checks; vue-router versus nuxt-routing; ordinary composables cannot silently require Nuxt context; positive Vite React case |
| Preserve conventions | Options/setup, model/ref primitives, Router/Pinia/Vuex, root/app/srcDir, layers/import policy and selected builders; no implicit migrations or module/library additions |
| SSR/browser boundaries | Vue composable cleanup/request ownership, Nuxt data payload/context, client plugins/mounted boundaries, deterministic render and production hydration checks |
| Private configuration | nuxt-runtime-config and vite-environment-safety; private/public versus legacy schemes; avoid config/env spreads and leaks through DTOs, state, payload, HTML, client imports/source maps |
| Vite is not universal | Detect selected builder/config owner; Vue CLI/webpack negative, Nuxt framework-owned config, Vite React positive; no automatic Vite/Vitest installation |
| Reuse tests and manager | npm/pnpm/Yarn/Bun evidence and configured scripts; Vue Test Utils versions and Jest/Vitest contexts; Vite Jest test integration case |
| Recipes/examples/cases | 18 technology procedures refine existing workflows; SFC, reactive-ref, Nuxt data/config, env, component-test, module and build examples; 44 new cases (26 positive, 18 negative) |
| Validate 18/18 | V-23.1..9 PASS for exact new inventory, unique mapped sections, ordered anatomy, substantive steps, case mappings and VF/UF/BF definitions; all 18 related-engineering mappings manually checked by name |

Eight trigger prompts were generated (166 cases/395 files total). Nine new
mutation controls cover all three inventories, missing Vue sections, Nuxt/Vite
orphans, version notes, case mapping, and fact references. Total technology
specifications are 193; generation and structural validation do not execute
agent behavior or trigger evaluations.

**Executed:**
`node tests/technology/vue-nuxt-vite/run-fact-checks.mjs --report tests/technology/vue-nuxt-vite/results/step23-fact-checks.md`
reports 2 PASS, 0 FAIL, 16 NOT_RUN on Node 26.8.1. UF-04 demonstrates that JSON
serialization of an application config can leak a synthetic private sentinel
while an explicit public DTO excludes it. BF-03 demonstrates truthy string
flags and exposure through unrestricted env spreads. These are JavaScript
counterexamples, not Nuxt runtime/payload or Vite transform/build checks.

**Limits:** [result report](../../tests/technology/vue-nuxt-vite/results/step23-fact-checks.md),
[runner documentation](../../tests/technology/vue-nuxt-vite/README.md).
No installed compatible Vue/Nuxt/Vite app fixture was supplied; optional Vue
core/SSR/Vite resolveConfig facts are NOT_RUN. No component interaction, router,
store/request isolation, Nuxt context/hydration/module/override, real secret
artifact check, measured build/render optimization, runner integration, or
deployment verification ran. Human review and G-11/G-12 evaluations remain
NOT_RUN. R-43/R-44 record the limits and routing risk. Frontend/backend entry
bodies are 213/202 lines: two target warnings, both under the 300 hard limit.

## 12. Step 23 official documentation consulted

Checked 2026-10-15. Several versioned Nuxt site URLs failed, so relevant
official repository documentation was used instead. No third-party claims
were used; documentation review is not runtime verification.

- [Vue SFC macros](https://vuejs.org/api/sfc-script-setup.html),
  [reactivity](https://vuejs.org/guide/essentials/reactivity-fundamentals.html),
  [composables](https://vuejs.org/guide/reusability/composables.html),
  [Vue 2.7 compatibility](https://v2.vuejs.org/v2/guide/migration-vue-2-7.html),
  [Vue Router](https://router.vuejs.org/guide/).
- Nuxt official repository:
  [configuration](https://raw.githubusercontent.com/nuxt/nuxt/main/docs/1.getting-started/03.configuration.md),
  [data fetching](https://raw.githubusercontent.com/nuxt/nuxt/main/docs/1.getting-started/10.data-fetching.md),
  [runtime config](https://raw.githubusercontent.com/nuxt/nuxt/main/docs/3.guide/6.going-further/10.runtime-config.md),
  [imports/context](https://raw.githubusercontent.com/nuxt/nuxt/main/docs/3.guide/1.concepts/3.auto-imports.md),
  [modules](https://raw.githubusercontent.com/nuxt/nuxt/main/docs/3.guide/1.concepts/5.modules.md),
  [rendering](https://raw.githubusercontent.com/nuxt/nuxt/main/docs/3.guide/1.concepts/1.rendering.md),
  [deployment](https://raw.githubusercontent.com/nuxt/nuxt/main/docs/1.getting-started/16.deployment.md).
- [Nuxt 2 runtime config](https://v2.nuxt.com/docs/configuration-glossary/configuration-runtime-config/),
  [Vite configuration](https://vite.dev/config/),
  [Vite env/modes](https://vite.dev/guide/env-and-mode),
  [Vite major migration](https://vite.dev/guide/migration),
  [Vitest integration](https://vitest.dev/guide/).
