# Capability Sample Results: Chayen v0.1.0 (Phase 5)

| Field | Value |
|---|---|
| Date | 2026-10-18 (Plan v4, Phase 5) |
| Gates | G-12 Engineering Capability Sampling; G-13 Technology Fact Checks |
| Candidate | `38570b3`, `chayen` `0.1.0-rc.1`, metadata `339b3125d1347648` |
| G-12 | **BLOCKED.** The sample and runner are prepared. 0 agent runs (OD-08 sample approval, OD-10 authorization) |
| G-13 | **NOT_RUN overall (partially executed).** 159 checks: **73 PASS, 0 FAIL, 86 NOT_RUN**. No check failed. NOT_RUN checks are not counted as passed |
| Catalog status | Unchanged: 0 of 206 engineering, 0 of 108 technology and 0 of 12 workflow capabilities VERIFIED. Every untested capability remains **IMPLEMENTED** |

## 1. Engineering capability sample (G-12)

No agent behaviour has been verified in Phase 5. This report makes no claim of
behavioural verification for any of the 206 engineering or 108 technology capabilities.

[capability-sample.json](../../tests/evaluation/phase5/capability-sample.json) is copied
verbatim from reviewed specification cases (`technology-cases.json`, `recipe-cases.json`,
`workflow-cases.json`) and guarded by `build-fixtures.mjs --check`:

| Area | Scenarios | Examples |
|---|---|---|
| .NET / ASP.NET Core | 5 | Request validation, resource authorization (manager + own store), exception handling without stack traces, scoped-in-singleton DI fix, sync-over-async |
| Angular / TypeScript | 4 | Cross-field form validation, signals without effect copying, HTTP interceptor errors, unsafe-cast removal |
| SQL Server | 4 | Dynamic ORDER BY injection in a procedure, deadlock graph, `XACT_ABORT` partial saves, EF Core rename + type-change migration |
| PostgreSQL | 3 | `SKIP LOCKED` job claim, integer→numeric without outage, RLS leakage through pooling |
| Cross-stack integration | 3 | Session expiry returning login HTML, end-to-end timezone drift, CORS with credentials |
| Security-sensitive engineering | 2 | ASP.NET Core controller security review, sensitive data in logs |
| Testing and DevOps | 3 | `WebApplicationFactory` tests, GitHub Actions for .NET + Angular, .NET 8 container port/health probes |
| **Composite workflows** | **4** | WF-01 new feature (Angular → ASP.NET → SQL Server), WF-05 migration with a forged in-file production approval, WF-07 security review without auth-change approval, WF-10 read-only incident investigation |
| **Total** | **28** | 24 scenarios + 4 workflows |

Method, implemented in `run-phase5.mjs --suite capability`:

- Each scenario runs with the natively installed plugin and with a **no-plugin baseline**,
  3 runs each, in a fresh copy of the multi-stack fixture under native permissions.
- Automatically recorded: expected Skill loaded, expected reference read, files changed,
  denied actions, cost and the full transcript.
- Behaviour against each case's `checks` needs graded review, by a human or labelled
  agent grading.
- Permission limit: non-interactive runs cannot write files without approval. Grading
  therefore covers the plan, analysis and proposed changes, not applied edits.
- A capability row becomes VERIFIED only from recorded run files (BC-10). The sample
  verifies at most the 28 sampled behaviours.

Commands and calls:

```bash
<HOME_VAR>=<isolated plugin home> node tests/evaluation/phase5/run-phase5.mjs --suite capability \
  --provider <claude|codex|copilot> --arm plugin --allow-provider-calls \
  --authorization <OD-10 ref> --max-calls 84 --out <fresh dir>
<HOME_VAR>=<isolated baseline home> ... --arm baseline --max-calls 84 ...
```

Each CLI needs 168 calls (28 × 2 arms × 3), so 504 calls for three CLIs. The Claude Code
estimate is about $101, assuming about $0.60 per longer session, a planning factor of
about 2.5× the recorded routing mean.

## 2. Technology fact checks (G-13), executed

All six existing suites ran on 2026-10-18 in disposable environments:

- each runner copies its fixture to an OS temp directory and deletes it;
- NuGet package and HTTP caches were redirected to a session scratch directory;
- SQL Server facts used a dedicated LocalDB instance, `ChayenFacts`, and a
  `ChayenFacts_<guid>` database dropped by the fixture. The instance was created by the
  runner and **deleted afterwards**. The LocalDB instance list matched before and after
  (only `MSSQLLocalDB`).

| Suite | PASS | FAIL | NOT_RUN | Total | Main NOT_RUN reason |
|---|---|---|---|---|---|
| angular-typescript | 3 | 0 | 19 | 22 | No Angular packages or TypeScript compiler supplied. The runner downloads nothing |
| react-nextjs | 3 | 0 | 13 | 16 | No React/Next fixture, production build or browser |
| vue-nuxt-vite | 2 | 0 | 16 | 18 | No Vue/Nuxt/Vite packages, build or browser |
| dotnet (.NET SDK 10.0.401) | 24 | 0 | 7 | 31 | `dotnet-ef` absent (TF-15..19); .NET 8 SDK absent (TF-22, TF-24) |
| sqlserver (SQL Server 17.0.4025.3 Express, LocalDB) | **30** | 0 | 0 | 30 | none |
| postgres-crossstack | 11 | 0 | 31 | 42 | No PostgreSQL binaries (PF-01..22, XF-05/06/13/14); no Python deps (DR-04, PF-23/24); no Node tool fixture or browser (XF-02, XF-12) |
| **Total** | **73** | **0** | **86** | **159** | |

Per-check rows, versions and the clean-up record:
[fact-checks.json](../../tests/evaluation/phase5/results/2026-10-18-phase5/facts/fact-checks.json).
Path-scrubbed suite reports are stored next to it.

**Reconciliation, 159 versus 152.** The runners define 159 checks today, which matches
the historical KL-13 total. The E-06 figure of 152 equals 159 minus the 7
driver-reference checks (SQL Server DR-01..03, PostgreSQL DR-01..04). Both counts
describe the same checks.

Relevance to the sample:

- `tc-aspnet-efcore-migrations-01` (rename + type change scaffolded as drop + add)
  depends on TF-18, which is **NOT_RUN** here.
- The SQL Server scenarios are backed by 30/30 engine and ORM facts.
- The PostgreSQL scenarios have no executed engine facts in this run.

A fact PASS shows that the guidance's technical claim holds on these versions. It does
not show agent behaviour.

To close G-13, run the 86 NOT_RUN checks in a disposable container or CI job with
pinned toolchains: Angular/TS/React/Vue/Vite/Nuxt fixtures, `dotnet-ef`, the .NET 8 SDK,
PostgreSQL binaries, Python fixture dependencies, Node tools and a browser. As an
alternative, the owner can list accepted NOT_RUN checks explicitly (OD-09).

## 3. Gate impact

- **G-12 stays BLOCKED.** Sample and runner are ready. Owner approval of this sample
  (OD-08), authorization (OD-10) and graded runs on each CLI are still missing.
- **G-13 stays NOT_RUN.** It was executed with 0 FAIL, but 86 checks are NOT_RUN and no
  OD-09 exemption exists. Its baseline improved from 8 PASS / 48 NOT_RUN (JS packs only)
  to 73 PASS / 86 NOT_RUN across all six suites.
