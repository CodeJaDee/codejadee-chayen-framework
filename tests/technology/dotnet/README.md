# .NET technology fact checks

Developer-only checks for the .NET technology pack (Step 20, D-039). Nothing
here is shipped in the plugin.

The shipped C# and ASP.NET Core guidance relies on framework and SDK
behaviour, for example "with nullable enabled, `[ApiController]` treats a
non-nullable property as required" or "EF Core scaffolds a rename plus a type
change as drop and add". `run-fact-checks.mjs` executes 31 of those claims
(TF-01 to TF-31) against real SDKs and reports PASS, FAIL, or NOT_RUN for
each.

**What a PASS means.** The framework behaves as the guidance says, on the
SDKs that ran. It says nothing about whether an agent follows the guidance:
that needs behaviour evals (G-12) and trigger evals (G-11). A fact check
never makes a capability VERIFIED.

## Run

```bash
node tests/technology/dotnet/run-fact-checks.mjs                  # temp copy of ./fixture; deleted afterwards
node tests/technology/dotnet/run-fact-checks.mjs --keep --json facts.json
```

**Requirements:**

- the .NET 10 SDK, for TF-01 to TF-23 and TF-25 to TF-31;
- the .NET 8 SDK, for TF-22 and TF-24;
- the `dotnet-ef` tool, for TF-15 to TF-19;
- NuGet access for restore.

A fact whose prerequisite is missing is NOT_RUN. A run takes a few minutes.

## Layout

| Path | Content |
|---|---|
| `fixture/src/FactApi/` | A .NET 10 Web API with one endpoint per observed behaviour: controllers and minimal APIs, validation, problem details, OpenAPI, policies, output caching, and EF Core (SQL Server provider; no database is contacted) |
| `fixture/tests/FactApi.Tests/` | xUnit tests with `WebApplicationFactory<Program>`, one test per runtime fact (TF-01 to TF-14, TF-27, TF-28, TF-31) |
| `fixture/net8/` | A .NET 8 contrast pair for TF-24 (`Program` accessibility in tests) |
| `run-fact-checks.mjs` | Copies the fixture to a temporary directory, runs the xUnit tests and the CLI checks (EF Core migrations, `dotnet format`, analyzers, SDK pinning, solution format, package listing, publish), and maps results to facts |
| `results/` | Recorded runs |

Each fact names its primary technology capability. The catalog
(`catalog/technology-capabilities.yaml`) lists the facts per capability, and
validator V-23.8 checks that the two agree.

## Observations that are not checks

- **CA2000 is heuristic.** In Step 20 it reported an undisposed
  `StreamReader` but not an undisposed `FileStream` whose only use was
  `.Length`. The guidance therefore calls the analyzer a signal, not proof.
- **NuGet audit depends on the date.** On 2026-10-15, restore reported
  NU1902 and NU1903 for a transitive package of the fixture. With
  `-p:TreatWarningsAsErrors=true` they became errors and the build failed.
  The check that depends on the advisory database (TF-25) only asserts that
  the listing runs.
- **Fixture packages are pinned** to versions that were in the local NuGet
  cache. The fixture is never deployed. A known-vulnerable transitive package
  in it is a test input, not a recommendation.
