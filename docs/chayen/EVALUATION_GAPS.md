# Evaluation Gaps (STEP 32)

| Field | Value |
|---|---|
| Date | 2026-10-15 |
| Companion | [EVALUATION_REPORT.md](EVALUATION_REPORT.md) |
| Rule | A gap closes only when recorded evidence exists. Static passes and simulated scores never close a behavior gap. |

## 1. Summary

The suite now has a traceable **specification** for every category and
every record, and every **offline** check runs. The remaining gaps are
almost all about *executed agent behavior*:

- a statistically meaningful number of provider runs;
- providers other than Claude Code;
- VS Code surfaces;
- recipe and workflow behavior on fixtures;
- human grading of completion quality.

## 2. Gap register

| ID | Category | Gap | Why it is open | Evidence needed to close | Severity |
|---|---|---|---|---|---|
| EG-01 | 5, 6, 7 | Provider probes have **2 runs** per probe (4 for Next.js and pytest), on one provider and model (Claude Code 2.1.270, `claude-sonnet-5`). There is no no-plugin baseline arm. Run-to-run variance was shown in Step 06 and again here (pytest 2/4). | Cost and time per run (about $0.20–0.45 each) | ≥3 runs per probe, plus a no-plugin baseline arm. Report the per-probe pass rate and its variance. | High |
| EG-02 | 3, 5, 6, 7, 10, 14 | **Copilot CLI** actual invocation NOT_RUN | The isolated `COPILOT_HOME` is unauthenticated ("No authentication information found"). Copying personal credentials or tokens is excluded by policy (STEP 30). | Interactive `/login` with a test identity inside an isolated home, then `run-provider-probes.mjs --provider copilot` | High |
| EG-03 | 3, 5, 6, 7, 10, 14 | **Codex CLI** actual invocation NOT_RUN | Codex loads plugin skills only after `codex plugin add` into `CODEX_HOME`. That install is the lifecycle action whose opt-in was denied in STEP 31. No authenticated isolated home exists. | An authorized lifecycle run (STEP 31 runbook R-5), then the probes through `codex exec --json` | High |
| EG-04 | 10, 15 | **VS Code surfaces** (Claude Code extension, Copilot Chat): all behavior NOT_RUN | UI not automatable here | A person runs `tests/provider-compatibility/claude-code-vscode.md` and `copilot-vscode.md` and records the results | High |
| EG-05 | 15 | Native **installation lifecycle** for the 13-skill package NOT_RUN (R-53), and the update path at an unchanged version (R-54) | Lifecycle opt-in denied in STEP 31. The STEP 32 probes use `--plugin-dir`, not a marketplace install. | STEP 31 runbook R-3/R-5/R-7 | High |
| EG-06 | 3 | **445 recipe cases** (206 capabilities) are specifications only | No recipe runner or per-capability fixtures exist (G-12). The STEP 32 probes cover routing for 11 examples, not 206 recipes. | A recipe runner over context fixtures, graded against `checks`, with a sampled human review | High |
| EG-07 | 4, 9 | **Technology behavior** cases (295 + 20) are specifications only. 52 of 159 framework facts are NOT_RUN: Angular 19, React/Next 13, Vue/Nuxt/Vite 16, .NET 2 (TF-22/TF-24 need the .NET 8 SDK), XF-02/XF-12 (Node tools, browser). | No installed framework packages, compilers, browser tooling or .NET 8 SDK. Nothing is downloaded by design. | Supply existing toolchains (`--deps`, `--typescript`, `--node-tools`, .NET 8 SDK) and re-run the fact runners. Run the technology cases with an agent. | Medium |
| EG-08 | 12 | **Workflow composition** (47 cases, 12 workflows) has no agent execution | No workflow runner (R-51) | Execute `workflow-cases.json` with fixtures, native and no-plugin arms | Medium |
| EG-09 | 11 | **Prompt-injection resistance** is not tested with adversarial repository content or forged approvals. Only one destructive-request probe and the offline V-25/boundary tests exist. | No injection fixture probes yet (R-52) | Add fixture files carrying injected instructions and forged approval records; check that the agent neither obeys nor promotes them | Medium |
| EG-10 | 13 | **Completion and verification quality** is graded only by the agent reading the transcripts, not by a person, and only for 13 single runs | No human grader in this step | Human grading of `behavior` items, with a rubric and inter-rater notes | Medium |
| EG-11 | 14 | **Cross-provider handoff** is shown only statically (plain-name handoff, no provider syntax). The same probes have not been run on two providers. | EG-02 / EG-03 | Run the identical probe set on two providers and compare loaded skills and artifacts | Medium |
| EG-12 | 2, 5 | **Context overhead** uses a characters/4 estimate, not provider token counts | `claude plugin details` needs an installed plugin (EG-05) | Record `claude plugin details` token figures after an authorized install | Low |
| EG-13 | 5, 6, 7 | The **simulated lexical proxy** is weak (see report §5). Using it for tuning risks overfitting descriptions to word overlap. | By design it is only a proxy | Not closable. Keep it as a smoke indicator only. | Low |
| EG-14 | 8 | Only **one** multi-stack fixture exists, and it is not buildable (no restore, by design) | Scope | Add buildable variants per stack once toolchains are approved. **Partly closed by evolution Step 15 (D-072):** six buildable coding tasks in `tests/evaluation/coding/` (.NET 10, SQL Server LocalDB, Angular 19.2 sources), verified locally with hidden oracles; the Angular specs stay NOT_RUN without `node_modules`, and PostgreSQL has no fixture (no local server). **Evolution Step 16 (D-073):** `tests/evaluation/coding/run-coding.mjs` can run these tasks with baseline and Chayen arms inside a probed container boundary. Live runs are NOT_RUN: they are BLOCKED on this host (no reachable Linux container engine) and need owner authorization | Low |
| EG-16 | 5, 4 | **Next.js server route under-trigger.** `pr-nextjs-route` loaded no skill in 0/4 Claude runs. The model fixed the route correctly on its own, deriving the user from the session. | The backend description already names "Next.js or Nuxt routes", and security names "authorization". The prompt does not say "Next.js"; the stack is only visible in the repository. L0 headroom is 15 characters. | Run ≥3 baseline runs, then one description change at a time (D-017 limits), re-measuring the positives of all 13 skills for regressions | Medium |
| EG-17 | 5 | **pytest routing unstable (2/4)**, with `python-testing.md` read in 1/4 runs | Run-to-run variance (Step 06 showed the same pattern) | ≥5 runs per variant, and fixture variants with existing tests | Medium |
| EG-18 | 13 | **Verification evidence applied in 3/10 graded items.** No test command for ASP.NET (0/2), no `EXPLAIN` for PostgreSQL (0/2) although `postgres-query-tuning.md` was read, plan evidence for SQL Server 1/2. 4/26 runs hit the 10-turn limit. | `-p` mode with denied execution and a turn limit. Guidance adherence is unmeasured beyond these runs. | Interactive or larger-turn runs with execution allowed in a sandbox fixture. Grade against the recipe `checks`. Then decide whether the verification steps need to sit earlier in the skill bodies. | Medium |
| EG-19 | 11 | **Path-resolution guard effect is unproven.** Repository-root path attempts went from 3/7 to 0/7 skill-loaded transcripts (one-sided Fisher p ≈ 0.10). Only `--plugin-dir` inside the source repository was tested. A marketplace install puts the plugin in a provider cache, where the model might target cache paths. | Small sample; install-based runs blocked (EG-05) | ≥20 skill-loaded runs per arm, plus runs from a marketplace install | Medium |
| EG-20 | 11 | **Repository instruction files not cited.** The destructive probe refused correctly but cited the fixture's `AGENTS.md` rule in 0/2 runs. | Single scenario | Probes where only the repository rule makes the action unsafe | Low |
| EG-15 | 10 | **Claude plugin eval** (`claude plugin eval`, 186 cases × 3 runs) NOT_RUN in STEP 32 | Estimated cost of about $0.25 per run × 558 runs ≈ $140, which exceeds this step's reasonable spend. Untrusted-plugin confirmation needs `--trust-plugin` (a routine bypass removed in STEP 30). | An approved budget and an interactive trust confirmation; then `--runs 3` with the baseline arm | Medium |

## 3. Closed or reduced in STEP 32

| Item | Change |
|---|---|
| Missing routing examples | Added trigger cases `neg-explicit-decline`, `uns-rust-axum-handler`, `amb-monorepo-order-total` and `amb-destructive-production-drop`, plus 13 provider probes |
| 206-capability positive/negative traceability | Now an executable check (T-206: 206/206) instead of a validator side-effect only |
| 108 technology / 12 workflow traceability | Executable checks (T-TECH 108/108, T-WF 12/12) |
| Cross-provider handoff | Executable static check S-HANDOFF |
| DF-01 (eval `--check` false failure on CRLF checkouts) | Fixed by normalizing CRLF in the comparison. A CRLF copy passes and a content change fails (verified). |
| R-50 (Node 18 declaration) | Declaration corrected to Node.js ≥20.11 in 6 script headers and 2 READMEs. Only Node 24.15.0 has been executed. |
| Explicit invocation scored as "no skill" | Evidence rule (skill-local reference read or declared marker) and offline `--rescore`. Explicit probes 4/4. |
| Turn-limit exits scored as routing failures | Routing judged from the transcript; completion reported separately |
| Project paths resolved against the plugin location (3/7 skill-loaded transcripts) | Guard sentence in all 13 SKILL.md files; 0/7 afterwards. Effect not yet significant (EG-19). |
| Fixture build output copied into probe runs | The runner now skips `bin/`, `obj/`, `node_modules/` and `.git/`, and records the git setup status; `core.longpaths=true` fixes git setup in deep scratch paths |
