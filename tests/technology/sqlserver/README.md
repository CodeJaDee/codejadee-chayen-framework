# SQL Server fact checks (Step 26)

```text
node tests/technology/sqlserver/run-fact-checks.mjs --report tests/technology/sqlserver/results/step26-fact-checks.md
```

Developer-only. Never shipped. Requires the .NET 10 SDK and either SqlLocalDB
or a loopback SQL Server named in `CHAYEN_SQLSERVER_FACTS_SERVER`.

**What runs**

| IDs | What | How |
|---|---|---|
| DR-01..DR-03 | ORM/driver references in `skills/chayen-data/references/sqlserver-data-access.md` resolve | Every package in its "Driver references" table is referenced by `fixture/SqlServerFacts/SqlServerFacts.csproj`, every API it names is used in `DriverReferences.cs`, and that file compiles (`dotnet build`) |
| SF-01..SF-27 | Engine, EF Core, Dapper, and ADO.NET behaviour the 12 SQL Server sections rely on | xUnit tests in `fixture/SqlServerFacts`, one per fact, against a disposable database |

**Safety**

- The fixture creates one database named `ChayenFacts_<guid>` and drops it at
  the end (also when setup fails). It refuses any server that is not LocalDB
  or a loopback address, so it cannot touch a shared or production database.
- By default the runner creates and starts a dedicated LocalDB instance,
  `ChayenFacts`, so other LocalDB instances are untouched. It is kept for
  re-runs; remove it with `sqllocaldb stop ChayenFacts && sqllocaldb delete ChayenFacts`.
- Backups for SF-24/SF-25 go to a temporary folder that is deleted afterwards.
- Packages: EF Core SQL Server 10.0.8, Dapper 2.1.66, Microsoft.Data.SqlClient
  6.1.1, xUnit 2.9.3 (restored from the local NuGet cache or nuget.org). They are
  fixture-only and never part of the plugin (D-043).

**What the results mean**

- They describe the engine version, edition, and default database settings
  of the server that ran them (recorded in the report's Environment line).
  Production can differ in edition (online operations), compatibility level,
  collation, `READ_COMMITTED_SNAPSHOT`, recovery model, and Query Store
  settings. That difference is itself part of the guidance: detect, never
  assume.
- MEASURED observations (SF-09, SF-11, SF-27) compare the same statement on
  the same data in one run; they are examples of comparable measurement, not
  performance claims about any application.
- A PASS shows the behaviour the guidance describes is real. It does not
  show that an agent follows the guidance: behaviour (G-12) and trigger
  (G-11) evaluations are separate and remain NOT_RUN, so no capability is
  VERIFIED by this runner.
- Exit code 0 means no executed check failed. Missing tools give NOT_RUN,
  never PASS.
