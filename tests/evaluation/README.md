# Chayen evaluation suite (developer-only, STEP 32)

This is the single entry point to every evaluation asset.

- Nothing here is shipped in the plugin.
- Results and their limits are in
  [docs/chayen/EVALUATION_REPORT.md](../../docs/chayen/EVALUATION_REPORT.md).
- Open gaps are in
  [docs/chayen/EVALUATION_GAPS.md](../../docs/chayen/EVALUATION_GAPS.md).

## Evidence levels (never mixed)

| Level | What it is | Can support VERIFIED? |
|---|---|---|
| **1. Static validation** | Offline checks of files: schema, structure, references, catalog, traceability, security preflight, handoff names. Also framework fact runners, which execute SDKs, databases and runtimes, but not an agent. | Static: no (it proves structure only). Facts: they prove the *guidance's* technical claims, not agent behavior. |
| **2. Simulated evaluation** | A deterministic lexical proxy (BM25 of each prompt against skill names and descriptions). It is **not a model**. | Never |
| **3. Actual provider invocation** | Real CLI and model runs (`run-provider-probes.mjs`, `claude plugin eval`, `tests/routing/run-smoke.mjs`), with transcripts | Yes, with enough runs, a no-plugin baseline, and human review |
| **4. Manual verification** | A person runs the VS Code procedures or grades transcripts against `behavior` and `checks`. Agent-read transcripts are labelled as such. | Yes, when performed by a person and recorded |

## Files

| File | Level | Purpose |
|---|---|---|
| `../../tools/evals/run-evaluation-suite.mjs` | 1, 2, and summaries of 3 | Runs the static gates, checks traceability (206 engineering / 108 technology / 12 workflow records, each with positive and negative cases; the 11 requested routing examples), the cross-skill handoff names, context overhead, and the lexical proxy. Optionally summarizes probe and fact results. Writes `results/step32-evaluation.json` with `--write`. Offline. |
| `provider-probes.json` | 3, 4 | 13 probes: the 11 requested routing examples, explicit invocation, and reference loading. Each probe has `expect`, an optional `refs`, and manual `behavior` checks. |
| `run-provider-probes.mjs` | 3 | Runs the probes against a fresh copy of `fixture/`, with the plugin loaded through `--plugin-dir` (no install). Claude Code and Copilot only. Billed; opt-in required. `--spec` selects another probe file under `tests/evaluation/`; summaries record the spec and a skill-metadata fingerprint for pooling. |
| `step40/` | 1, 3, 4 | STEP 40 multilingual evaluation: 120-case quality/policy dataset, 52 editorial discovery probes, the arm runner (A no plugin, B plugin, C plugin + opt-in policy) and scorer controls. See [step40/README.md](step40/README.md). No live run recorded. |
| `fixture/` | 3 | A small multi-stack monorepo: ASP.NET Core 8 + EF Core SQL Server, Angular 18, Next.js 14, Python 3.12/pytest, PostgreSQL 16 SQL, Rust/Axum. It contains intentional defects that the probes target. **Never build or restore it in place.** IDE C# tooling may restore it automatically; `bin/` and `obj/` are git-ignored and are not copied by the runner. |
| `coding/` | 1, 3 | Real-coding tasks with hidden oracles (evolution Step 15, D-072), and the isolated coding runner `run-coding.mjs` (Step 16, D-073). The runner is write-capable only inside a probed container boundary, with baseline and Chayen arms; real runs are NOT_RUN until the owner authorizes them. See [coding/README.md](coding/README.md). |
| `routing-context/` | 1, 2, 3 | Routing, collision and context benchmark beyond 16 Skills (evolution Step 18, D-075): synthetic Skills built only in disposable copies, 74 routing cases with fixed expected outcomes, per-configuration scoring from native activation events, and context tax. Provider runs are NOT_RUN. See [routing-context/README.md](routing-context/README.md). |
| `results/` | all | Path-free recorded results |
| `../skills/trigger-cases.json` | 3 (via generators) | 214 provider-neutral routing cases (186 at Step 32; 28 editorial cases added in Steps 37–38). Generates `../evals/claude/` (516 files) for `claude plugin eval`. |
| `../skills/recipe-cases.json` | spec | 445 capability cases: at least 1 positive and 1 negative for each of the 206 capabilities |
| `../skills/technology-cases.json` and the two data-access case files | spec | 295 + 20 technology cases: at least 1 positive and 1 negative for each of the 108 technology capabilities |
| `../skills/workflow-cases.json` | spec | 47 workflow and template cases (12 workflows) |
| `../technology/*/run-fact-checks.mjs` | 1 (facts) | Framework and database facts (159 checks) |
| `../security/boundaries.test.mjs` | 1 | 34 offline security regressions (32 at Step 32) |
| `../provider-compatibility/` | 1, 3, 4 | Identity check, lifecycle script, and VS Code procedures (STEP 31 runbook) |
| `../routing/` | 3 | Copilot and Codex routing smoke runner, plus Step 06 results |

## Commands

```bash
# Level 1 + 2 (offline, free)
node tools/evals/run-evaluation-suite.mjs
node tools/evals/run-evaluation-suite.mjs --write --facts <dir of fact JSON> --probes <probe summary.json>

# Level 1 framework facts (local tools only; missing tools give NOT_RUN)
node tests/technology/<pack>/run-fact-checks.mjs --json <scratch>/<pack>.json   # see each runner for options

# Level 3 (billed; sends prompts and fixture contents to the provider)
node tests/evaluation/run-provider-probes.mjs --allow-provider-calls --provider claude --out <fresh scratch dir>
COPILOT_HOME=<isolated, signed in with a test identity> node tests/evaluation/run-provider-probes.mjs --allow-provider-calls --provider copilot --out <fresh scratch dir>
node tools/evals/generate-claude-evals.mjs --stage <scratch>   # then `claude plugin eval` in the staged copy (see tests/evals/README.md)

# Re-score recorded transcripts with the current rules (offline, no provider call)
node tests/evaluation/run-provider-probes.mjs --rescore <results dir>
```

**Pooling runs.** A model sees only skill names and descriptions before a
skill loads. Routing results from different runs can therefore be pooled
only when **every description is identical** across them. A change to a
skill body affects behavior after loading, not routing.

**Claude probe permissions.** Probes run in `-p` mode with
`Read,Glob,Grep,Skill` pre-approved. All other tools stay under Claude
Code's native permission handling. In STEP 32:

- every `Edit` was denied;
- read-only shell commands (`find`, `ls`, `cat`) were auto-approved.

Add `--tools Read,Glob,Grep,Skill` to the runner if you need a strictly
read-only toolset. Results are then not comparable with STEP 32.

## Metric definitions (level 3)

| Metric | Definition |
|---|---|
| Relevant skill recall | Positive probes in which at least one expected skill loaded / positive probes |
| Selection precision | Loaded skills that are expected for their probe / all skills loaded on positive probes |
| False-positive invocation rate | No-match probes (`none` or `none_or`) that loaded a non-allowed skill / no-match probes |
| No-match correctness | 1 − false-positive invocation rate |
| Reference load | Probes with `refs` in which a matching `references/*.md` file was read / probes with `refs` |
| Context overhead | L0 metadata characters (always on), plus per-activation body and largest reference, estimated as tokens = characters / 4 |
| Completion and verification quality | Manual grading of `behavior` items. Not automated. |
