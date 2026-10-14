# Technology Coverage

| Field | Value |
|---|---|
| Step | 20 |
| Date | 2026-10-15 |
| Catalog | [`catalog/technology-capabilities.yaml`](../../catalog/technology-capabilities.yaml) |
| Checker | `node tools/catalog/check-technology.mjs` (V-23; `--write-doc` regenerates §6) |
| Fact checks | `node tests/technology/dotnet/run-fact-checks.mjs` ([README](../../tests/technology/dotnet/README.md), [Step 20 run](../../tests/technology/dotnet/results/step20-fact-checks.md)) |
| Decision | D-039 (PROPOSED) |

Technology packs add stack-specific capabilities beside the 206 engineering
capabilities. The engineering catalog is unchanged; technology capabilities
have their own catalog, IDs (`TECH-<TECH>-NNN`), checker, and evaluation
cases.

## 1. Summary

| Pack | Technologies | Capabilities | IMPLEMENTED | VERIFIED | Eval cases (+/−) | Framework facts |
|---|---|---|---|---|---|---|
| `dotnet-aspnetcore` | C# (8), ASP.NET Core (14) | **22 / 22** | 22 | **0** | 34 / 23 | 31 / 31 PASS on the .NET 10.0.401 and 8.0.406 SDKs |

- **IMPLEMENTED** means each capability has a reference section with
  applicability rules, version notes, numbered steps, and a verification
  rule, plus positive and negative evaluation cases, and passes V-23.
- **VERIFIED is 0.** No behaviour eval (G-12) or trigger eval (G-11) has
  run. The framework fact checks show that the .NET behaviour the guidance
  describes is real; they do not show that an agent follows the guidance.

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

Totals: 22 records; IMPLEMENTED 22, VERIFIED 0, IN_PROGRESS 0, PLANNED 0.
<!-- END GENERATED: check-technology -->
