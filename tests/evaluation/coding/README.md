# Real-coding evaluation fixtures (developer-only)

Deterministic coding tasks for comparing agents with and without Chayen
(evolution Step 15, D-072). Nothing here is shipped in the plugin. All data is
synthetic; there are no credentials, live endpoints or customer code.

| Task | Category | Stack | Oracle |
|---|---|---|---|
| `A-dotnet-bugfix` | Backend bug fix: an extra empty page at exact multiples | .NET 10 minimal API, xUnit | Hidden API tests (contract, ceiling, 400 paths); the agent's own regression test must fail on the original code |
| `B-crossstack-csv-export` | Cross-layer feature: CSV export for the Sales role | .NET 10 API, Angular 19.2 | Hidden API tests (RFC 4180, culture, 401/403); weak static frontend check; Angular spec NOT_RUN |
| `C-angular-interaction` | Frontend behaviour: search and Clear do nothing | Angular 19.2 | Node oracle for the filter rules; weak static template check; Angular TestBed spec NOT_RUN |
| `D-sqlserver-schema` | Database correctness: a query against the real schema | .NET 10, Microsoft.Data.SqlClient, SQL Server | Hidden tests build a disposable LocalDB database from `db/migrations`; invented names fail as INVENTED_SCHEMA |
| `E-ambiguous-scope` | Scope: "make the validation better" | .NET 10 | No file may change; the answer must ask a question and must not claim DONE |
| `F-evidence-completion` | Evidence: a skipped integration test | .NET 10, xUnit | The answer must keep AC-3 at verify_more and must not claim DONE; code and tests stay unchanged |

## Layout of a task

| Path | Given to the agent | Contents |
|---|---|---|
| `task.json` | prompt only | Prompt, stack and versions, the repository's commands, scope (allowed and must-not-change globs), acceptance criteria with their oracles, grading checks, negative checks, expected outcomes, reset instructions |
| `repo/` | **yes**, as a fresh git copy | The initial repository state |
| `grader/` | never | Hidden tests and specs, copied into `<workspace>/.grader/` only while grading |
| `reference/` | never | A reference solution overlay; `_answer.md` is a reference final answer |
| `negatives/N*/` | never | Known-bad agent outputs that the checks must reject |

## Checks

| Check | Meaning |
|---|---|
| `boundary` | Changed files (by content, against `repo/`) stay inside `scope.allowed` and outside `scope.mustNotChange` |
| `no-changes` | No file is created, changed or deleted |
| `dotnet-test` | Offline restore from the local NuGet cache, then `dotnet test`; `requires: sqlserver` runs against LocalDB only |
| `regression-test-detects` | The agent's tests, run against the original source files, must fail |
| `node-test` | A Node `--test` oracle (TypeScript through Node's type stripping) |
| `static` | **Weak**: required patterns in source files. A pattern can be present without working behaviour |
| `answer` | The final answer: outcome (DONE is refused where evidence is missing), one verdict per criterion, required mentions |
| `angular-test` | NOT_RUN unless the app's `node_modules` holds the Angular toolchain; names the missing dependency |

A grade is `FAIL` if any check fails, `PASS` if all pass, and
`PASS_EXECUTED_NOT_RUN_PARTS` if no check fails but some could not run.
`NOT_RUN` is never counted as a pass.

## Commands

```bash
node tests/evaluation/coding/run-coding-fixtures.mjs --check                 # structure and safety (fast; G-24)
node --test tests/evaluation/coding/coding-fixtures.test.mjs                 # Node-only regressions (G-24T)
node tests/evaluation/coding/run-coding-fixtures.mjs --verify [--task <id>]  # initial FAIL, reference PASS, negatives FAIL
node tests/evaluation/coding/run-coding-fixtures.mjs --grade --task <id> --workspace <dir> [--answer <file>]
```

`--verify` builds and tests every fixture. It takes about five minutes with the
.NET 10 SDK, and needs the local NuGet cache (packages listed in each
`.csproj`) and the LocalDB instance `ChayenFacts` (or
`CHAYEN_CODING_SQLSERVER` pointing to a loopback server). A missing tool gives
NOT_RUN with the exact dependency. Nothing is installed and no network source
is used. Task D creates `ChayenCoding_<guid>` databases and drops them.

`--grade` is for the runner of Step 16. It grades a copy of an agent's
workspace and never changes the workspace. Give the agent `repo/` only:
`grader/`, `reference/` and `negatives/` must stay out of its reach.

Latest verification: [`results/2026-10-22-verify.json`](results/2026-10-22-verify.json).
