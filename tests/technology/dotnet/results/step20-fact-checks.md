# .NET fact checks: Step 20 run

| Field | Value |
|---|---|
| Date | 2026-10-15 |
| Command | `node tests/technology/dotnet/run-fact-checks.mjs` |
| Host | Windows 11 Pro 10.0.26200, Git Bash |
| SDKs installed | 6.0.416, 7.0.404, 8.0.406, 10.0.103, 10.0.300, 10.0.401 (10.0.401 selected; 8.0.406 pinned for TF-22 and TF-24) |
| dotnet-ef | 10.0.7 (global tool; older than the EF Core 10.0.12 runtime, which printed a warning) |
| Exit code | 0 |
| Result | **31 PASS, 0 FAIL, 0 NOT_RUN** |

Earlier runs in the same step: the first run had 26 facts (26 PASS); the second added TF-27 to TF-31 and failed TF-30 (CA2000 did not report an undisposed `FileStream`; see README observations); the check was retargeted to a `StreamReader` case and the third run below passed.

## Output

```text
SDKs: 6.0.416, 7.0.404, 8.0.406, 10.0.103, 10.0.300, 10.0.401

PASS    TF-01 aspnet-integration-testing: WebApplicationFactory<Program> reaches a top-level-statement Program on .NET 10 without a hand-written partial class (xUnit Passed)
PASS    TF-02 aspnet-api-endpoints: A TypedResults union (Results<Ok<T>, NotFound>) returns 404 for a missing resource (xUnit Passed)
PASS    TF-03 aspnet-validation: .NET 10 minimal API validation (AddValidation) returns 400 problem details for DataAnnotations failures (xUnit Passed)
PASS    TF-04 csharp-nullability: With nullable enabled, [ApiController] treats a non-nullable reference property as required (400 without [Required]) (xUnit Passed)
PASS    TF-05 aspnet-exception-handling: IExceptionHandler maps a domain exception to 404; unhandled exceptions become 500 problem details without the message outside Development (xUnit Passed)
PASS    TF-06 aspnet-openapi: Microsoft.AspNetCore.OpenApi serves /openapi/v1.json with mapped operations and operation IDs (xUnit Passed)
PASS    TF-07 aspnet-authorization: A policy endpoint returns 401 unauthenticated, 403 without the claim, 200 with it (test authentication scheme) (xUnit Passed)
PASS    TF-08 aspnet-data-access: EF Core parameterizes captured values; ToQueryString() shows DECLARE lines and a parameterized SELECT (xUnit Passed)
PASS    TF-09 csharp-linq-optimization: EF Core throws for a predicate it cannot translate instead of evaluating it on the client (xUnit Passed)
PASS    TF-10 aspnet-dependency-injection: Development validates the service graph on build (singleton depending on scoped fails); Production does not by default (xUnit Passed)
PASS    TF-11 aspnet-background-services: An unhandled exception in a BackgroundService stops the host by default (xUnit Passed)
PASS    TF-12 csharp-serialization: System.Text.Json defaults are case-sensitive; JsonSerializerOptions.Web is not (xUnit Passed)
PASS    TF-13 csharp-serialization: System.Text.Json ignores nullable annotations unless RespectNullableAnnotations is set (xUnit Passed)
PASS    TF-14 csharp-type-design: Record equality is member-wise, but a collection member compares by reference (xUnit Passed)
PASS    TF-15 aspnet-efcore-migrations: dotnet ef migrations add scaffolds a migration without contacting a database (exit 0)
PASS    TF-16 aspnet-efcore-migrations: dotnet ef migrations has-pending-model-changes exits 0 in sync and non-zero after a model change (in sync exit 0, after change exit 1)
PASS    TF-17 aspnet-efcore-migrations: A simple property rename is scaffolded as RenameColumn (RenameColumn scaffolded)
PASS    TF-18 aspnet-efcore-migrations: A rename plus type change is scaffolded as DropColumn + AddColumn with a data-loss warning (DropColumn + AddColumn, data-loss warning printed)
PASS    TF-19 aspnet-efcore-migrations: dotnet ef migrations script --idempotent guards each migration with IF NOT EXISTS checks (7 IF NOT EXISTS guards for 3 migrations)
PASS    TF-20 csharp-code-analysis: dotnet format whitespace --verify-no-changes exits 0 when clean and non-zero on a violation (clean exit 0, violation exit 2)
PASS    TF-21 csharp-code-analysis: TreatWarningsAsErrors turns nullable warning CS8618 into a build error (default exit 0 (warning), warnings-as-errors exit 1)
PASS    TF-22 csharp-project-maintenance: global.json pins the SDK: dotnet --version reports the pinned version (pinned 8.0.406, reported 8.0.406)
PASS    TF-23 csharp-project-maintenance: SDK 10: dotnet new sln creates a .slnx file, and the noun-first dotnet package list command exists (slnx created: true; dotnet package list --help exit 0)
PASS    TF-24 aspnet-integration-testing: .NET 8: WebApplicationFactory<Program> fails with CS0122 until public partial class Program is declared (without partial: CS0122; with partial: exit 0)
PASS    TF-25 csharp-project-maintenance: dotnet list package --vulnerable --include-transitive runs and reports (exit 0)
PASS    TF-26 aspnet-hosting-deployment: dotnet publish -c Release produces the application assembly (exit 0)
PASS    TF-27 aspnet-request-pipeline: UseStatusCodePages with AddProblemDetails gives an empty-body 404 a problem details body (xUnit Passed)
PASS    TF-28 aspnet-authentication: A protected endpoint with no default authentication scheme fails with a server error, not a 401 (xUnit Passed)
PASS    TF-29 csharp-async-concurrency: Analyzer CA2016 reports a CancellationToken that is not forwarded (AnalysisMode All) (CA2016 reported)
PASS    TF-30 csharp-memory-disposal: Analyzer CA2000 reports an undisposed StreamReader (AnalysisMode All); it is a heuristic and misses some cases (CA2000 reported)
PASS    TF-31 aspnet-performance: Output caching (AddOutputCache, UseOutputCache, CacheOutput) serves a repeat GET from the cache (xUnit Passed)

31 PASS, 0 FAIL, 0 NOT_RUN of 31 facts
```
