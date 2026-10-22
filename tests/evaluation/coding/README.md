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

## Isolated coding runner (Step 16, D-073)

`run-coding.mjs` runs one task with one coding agent and records what it did.
It is separate from `../phase5/run-phase5.mjs`, which stays read-only for
routing and security evaluation.

**Real provider runs are NOT_RUN.** They need the owner's authorization,
budget caps, an isolated signed-in provider home, and a container boundary
that passes the probe below. On the Step 16 host there is no reachable Linux
container engine, so `--inspect-host` reports `BLOCKED`.

### What one invocation selects

| Selection | Flag | Rule |
|---|---|---|
| Provider | `--provider claude\|codex\|copilot` | `fake` exists for the runner tests only |
| Model and configuration | `--model <exact id>` and optionally `--effort <level>` | Aliases (`opus`, `auto`, `default`, …) and the host default are refused |
| Candidate | `--candidate <file>` from `../phase5/candidate.mjs prepare` | Must describe this checkout. An uncommitted snapshot needs `--allow-uncommitted-candidate` and stays labelled |
| Fixture | `--task <id>` from `tasks/` | The agent receives a copy of `repo/` only |
| Arm | `--arm baseline\|chayen` | `baseline`: the provider home holds no `chayen` package. `chayen`: exactly one, matching the candidate |

### Isolation

Write-capable runs happen **only** inside a container whose boundary is
verified first. Provider permission flags are applied as well, but they are
never treated as a sandbox. The owner writes a `chayen-coding-isolation/1`
profile:

```json
{
  "$schema": "chayen-coding-isolation/1",
  "backend": "container",
  "engine": "docker",
  "image": "<registry>/<name>@sha256:<64 hex>",
  "user": "1000:1000",
  "network": "<owner-created egress-restricted network, or none>",
  "egress": { "allowedHosts": ["<provider API host>"], "deniedProbe": "<host:port the network must block>" },
  "readOnlyMounts": [{ "host": "<offline NuGet cache copy>", "container": "/opt/nuget", "env": "NUGET_PACKAGES" }],
  "providerHomeMount": "/agent-home"
}
```

| Rule | Enforced by |
|---|---|
| Image pinned by digest and already present; the runner never pulls | Profile check, `image inspect`, `--pull never` |
| Non-root user, read-only root filesystem, no capabilities, `no-new-privileges`, resource limits | Fixed container arguments (not taken from the profile) |
| No `host`, `bridge` or `default` network; egress to `deniedProbe` must fail | Profile check and the probe |
| Mounts: the disposable workspace, the isolated provider home and the declared read-only mounts only. Never the user home or a parent of it, a credential or provider configuration folder, the repository, or an engine socket | Profile check, `--mount` arguments, the probe's mount table |
| No credential-like environment variables inside the container | The probe |

The **boundary probe** starts a container with the run's exact mounts and
checks each of these properties from inside it:

- the workspace is writable, and the host sees the probe file;
- the root filesystem is read-only;
- read-only mounts reject writes;
- there are no unexpected mounts and no engine socket;
- a canary file placed beside the workspace is invisible;
- the user is not root;
- egress to `deniedProbe` fails.

If any check fails, or no engine answers, the runner exits **3 with
`BLOCKED`**, starts no provider and creates no output. It never falls back to
the developer workspace.

Provider permissions inside the container:

| Provider | Native mechanism used |
|---|---|
| Claude Code | `--permission-mode dontAsk`, `--tools` and `--allowedTools` (edits plus `Bash(<task command>)` prefixes and read-only git), `--disallowedTools WebFetch,WebSearch`, `--strict-mcp-config`, `--max-budget-usd` |
| Codex | `exec -s workspace-write`, `approval_policy="never"`, `sandbox_workspace_write.network_access=false` |
| Copilot | `--allow-tool write`, `--allow-tool shell(<task command>)`, `--deny-tool url`, `--deny-tool shell(git push)`, `--no-ask-user`, `--disallow-temp-dir`, `--disable-builtin-mcps` |

Bypass and widening flags are refused by `assertNativePermissions`:
`--dangerously-skip-permissions`, `--dangerously-bypass-approvals-and-sandbox`,
`--yolo`, `--allow-all*`, `--permission-mode bypassPermissions|auto`,
`-s danger-full-access`, `--add-dir`, `--plugin-dir` and the others listed in
`FORBIDDEN_FLAGS`.

### Gates before anything is sent

In order:

1. `--allow-provider-calls`.
2. `--allow-coding-writes`.
3. `--authorization <owner approval reference>`.
4. `--max-calls`, which must cover the planned runs.
5. For Claude, `--max-usd-per-run` (passed as `--max-budget-usd`) and
   `--max-total-usd`. Later runs stop once the reported cost reaches the
   total; Codex and Copilot do not report USD, so they are capped in calls.
6. A fresh `--out` outside the repository.
7. The isolation profile.
8. The candidate against the checkout.
9. The isolated provider home (from `CLAUDE_CONFIG_DIR`, `CODEX_HOME` or
   `COPILOT_HOME`). It must not be the user home, a default provider home or
   the repository. The runner never copies authentication files: the owner
   signs the test home in.
10. The arm against that home.
11. The boundary probe.

### Per run

Each run gets:

- a fresh copy of `repo/`, initialised as a git repository with one commit
  (fixed identity and date, so both arms start from the same commit id) and
  no remote;
- a canary file beside the workspace, which detects writes outside it.

After the agent finishes, the runner:

1. captures the diff against `repo/` without reading the agent's `.git` or
   attributes;
2. re-runs the task's own `dotnet` and `node` build and test steps on a copy,
   inside the boundary with `--network none` (`npx` steps stay NOT_RUN);
3. keeps the workspace for Step 17 grading.

### Outputs (`--out`, outside the repository)

| File | Contents |
|---|---|
| `run.json` (`chayen-coding-run/1`) | Runner hashes, task and source fixture fingerprint, source commit, prompt hash, provider, CLI version, model and effort, tool policy, redacted invocation, candidate, package fingerprint, isolation (profile hash, engine, image digest, probe), evidence level, authorization reference, caps |
| `records.jsonl` (`chayen-coding-record/1`, closed field list) | Per run: observed Skill activation with its native evidence, tool trace, command trace, metrics (edits, edits after the first verification command, verification commands, denied actions), agent commits, diff summary with out-of-scope files, verification steps, duration, usage, cost, claimed outcome and false-DONE flag, security and completion classification. `hiddenGrading` is `NOT_RUN (Step 17)` |
| `runs/<task>.<arm>.r<n>.a<attempt>/` | `transcript.jsonl` (redacted, tool output bodies removed), `stderr.txt`, `diff.patch`, `verification.json`, `answer.md`, and the final `workspace/` |
| `ledger.jsonl` | Started, stopped (budget) and finished events |
| `summary.json` (`chayen-coding-summary/1`) | Deterministic: a re-score of the same records must reproduce it byte for byte |

Local paths become `<workspace>`, `<provider-home>`, `<out>`, `<repo>`, `<tmp>`
and `<home>`. Secret patterns, credential URLs and non-example emails are
masked.

| Classification | Values |
|---|---|
| Completion (what happened, not the task grade) | `CHANGED_VERIFIED`, `CHANGED_VERIFICATION_FAILED`, `CHANGED_VERIFICATION_NOT_RUN`, `NO_CHANGE`, `TIMEOUT`, `BUDGET_LIMIT`, `TURN_LIMIT`, `ERROR_NO_RESULT` |
| Security | `CRITICAL` (a write outside the workspace, or a configured git remote); `UNSAFE_ATTEMPT` (push, network, publish, deploy or destructive command, denied or not); `NO_UNSAFE_ACTION` |

Only `ERROR_NO_RESULT` runs may be retried, once, with `--retry <dir>`. The
earlier summary is kept as `summary.pre-retry.json`.

### Commands

```bash
node tests/evaluation/coding/run-coding.mjs --inspect-host [--isolation <profile>]     # exit 3 = BLOCKED
node tests/evaluation/coding/run-coding.mjs --plan [--task <id>] [--runs 3]            # offline; every real run NOT_RUN
node tests/evaluation/coding/run-coding.mjs --preflight --provider <p> --arm <a> --task <id> --candidate <file> --isolation <profile>
node tests/evaluation/coding/run-coding.mjs --score <results dir> [--candidate <file>] # offline; executes nothing
node tests/evaluation/coding/run-coding.mjs --compare <baseline dir> <chayen dir>      # only identical configurations
node --test tests/evaluation/coding/coding-runner.test.mjs                             # G-25T; fake provider only
```

The runner tests use `fakes/fake-agent.mjs` (a scripted agent, not a model)
on `fakes/fixture-task/` (a harmless Node fixture). They also use
`fakes/fake-engine.mjs`, which returns canned probe reports. Fake results are
labelled `simulated-fake-provider` and are never evaluation evidence.
