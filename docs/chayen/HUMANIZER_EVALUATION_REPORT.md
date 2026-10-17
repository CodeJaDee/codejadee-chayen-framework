# Multilingual Quality and Provider Compatibility Evaluation (Step 40)

| Field | Value |
|---|---|
| Step | 40 — independent quality and provider compatibility evaluation |
| Date | 2026-10-17 (Asia/Bangkok) |
| Baseline | `main` at `0702b5b` (Steps 38–39 committed), clean tree; engineering baseline `1106226` (Step 34) |
| Machine | Windows 11 Pro 10.0.26200, Node v26.8.1, Git 2.42.0 |
| Package | `codejadee-chayen-framework` `0.1.0-dev`: 15 Entry Skills (13 engineering + 2 editorial), 237 references, 256 files |
| Step status | **PARTIAL.** All offline tests ran and pass. Every provider, host and human test is NOT_RUN: billed runs and host installations were not authorized, and no fluent reviewer was available. Executable fixtures are ready for them. |
| Rubric | [HUMANIZER_EVALUATION_RUBRIC.md](HUMANIZER_EVALUATION_RUBRIC.md) (PROPOSED, D-057) |
| Fixtures | [tests/evaluation/step40/](../../tests/evaluation/step40/README.md) |

Evidence levels are kept apart: **STATIC** (files and offline tools),
**SIMULATED** (lexical proxy, never routing evidence), **PROVIDER** (real host
sessions), **HUMAN** (fluent reviewers). This step produced STATIC and
SIMULATED evidence only.

## 1. Preconditions and approvals

| Item | Finding |
|---|---|
| Steps 35–39 | Read in PROGRESS, DECISIONS, ADRs and design records. Steps 38–39 are committed in `0702b5b`. |
| Approvals in force | D-047, D-051–D-053 ACCEPTED; D-054 and D-055 accepted by proceeding (inferred); ADR-0010 A + B accepted by the Step 39 instruction (inferred, D-056 PROPOSED). |
| ADR-0011 (quality thresholds) | **PROPOSED.** It requires owner approval of thresholds, sample sizes and coverage *before scoring*. The Step 40 instruction supplies the dataset composition and the routing/policy targets; the ≥4/90% language bar is still a proposal. This step therefore prepared the rubric and dataset and scored nothing. |
| Live tests | Not authorized ("Do not run billed provider evaluations or alter real user agent installations without separate approval"). All marked NOT_RUN. |
| Scripts | Inspected before execution: `validate-all.mjs`, `run-validator-tests.mjs` (OS temp copies, guarded cleanup), `run-evaluation-suite.mjs` (read-only without `--write`), `generate-claude-evals.mjs --check`, `check-identity.mjs`, `check-security.mjs` (no `--write-report`), `run-provider-probes.mjs` and `run-smoke.mjs` (both refuse without `--allow-provider-calls`), `run-lifecycle.sh` (refuses without `CHAYEN_ALLOW_PROVIDER_LIFECYCLE=1`; not run). |

Host versions were read with `--version` and extension listings only:

| Surface | Version (2026-10-17) |
|---|---|
| Claude Code CLI | 2.1.220 |
| Claude Code VS Code extension | `anthropic.claude-code` 2.1.301 |
| Codex CLI | `codex-cli` 0.163.0 |
| Codex IDE extension | `openai.chatgpt` 26.1007.21434 |
| GitHub Copilot CLI | 1.0.89 |
| VS Code / Copilot Chat | VS Code 1.142.0 (`6d62b1d5da`), built-in `copilot-chat` 0.70.0 |

Several are older than the versions Step 31 analysed (Claude Code 2.1.270,
Copilot 1.0.97); Step 31's binary-level findings are not re-verified for the
installed builds (DF-02 already records one behavior difference on 2.1.220).

## 2. Test inventory and outcomes

### 2.1 Structural validation (STATIC) — all PASS

| Requirement | Command / method | Outcome |
|---|---|---|
| Exactly 15 registered and shipped Entry Skills | `validate-package.mjs` V-05/V-19; `check-identity.mjs` IC-09–IC-11 | PASS: 15 skills, 15 registrations (13 engineering + 2 editorial, both `existing`), names equal directories |
| Valid manifests and marketplace entries | V-01a–c, V-02–V-04; IC-01–IC-08, IC-13 | PASS: three marketplaces, one plugin directory, identical shared manifest fields, no shadowing manifest |
| Metadata budget and distinct descriptions | V-07, V-07b, V-20; IC-12 | PASS: L0 6,221 / 6,500 (279 free); max pairwise overlap 0.24 (Thai vs English editorial), others ≤0.11; longest description 420 |
| Reference integrity | V-08, V-18 | PASS: 237 references with valid kinds, all reachable, skill-local, ≤2 hops |
| Editorial registration | V-19, `check-catalog.mjs`, `check-editorial-cases.mjs` (labelled G-15 in `validate-all`) | PASS: 2 editorial registrations, no capability ownership; 40 patterns; 154 case specifications |
| Engineering catalog coverage unchanged | `check-catalog.mjs`, `check-technology.mjs`, `check-workflows.mjs`, evaluation suite T-206/T-TECH/T-WF | PASS: 206 / 20 domains, fingerprint `2f13cad24ff431e3`; 108 technology; 12 workflows |
| Security and zero runtime | `check-security.mjs` (V-25), V-09, G-16 R-07 | PASS: metadata-only package (.md/.json), guard sentences present, 0 secret-pattern findings; package ships no instruction files |
| Upstream licence attribution | Offline comparison of `chayen-humanizer-en/references/upstream-notice.md` with the canonical MIT text | PASS: licence block identical to the MIT text with `Copyright (c) 2025 Siqi Chen`; upstream URL and version 3.1.0 named; Thai skill records method-only use in HUMANIZER_TH_DESIGN.md. Upstream not re-fetched (Step 38 compared it byte for byte). Root notices file pending Q-05. |

Aggregate runs (actual output in PROGRESS Step 40):

| Run | Outcome |
|---|---|
| `node tools/validate/validate-all.mjs` before any Step 40 change | PASS, 12/12 groups, 179/179 validator self-tests |
| `node tools/validate/validate-all.mjs` after Step 40 changes | PASS, 13/13 groups (new G-17) |
| `node tools/evals/run-evaluation-suite.mjs` (no `--write`) | PASS: static/traceability levels, identity 15/15, handoff 253 files / 0 dangling |
| `node --test tests/security/boundaries.test.mjs` | PASS 34/34 |
| `node --test tests/response-style/setup-fixtures.test.mjs` | PASS 19/19 |

### 2.2 Language quality — dataset READY, scoring NOT_RUN

`tests/evaluation/step40/quality-cases.json` holds **120 held-out cases**,
written after the skills and not used to tune them:

| Group | Cases | Categories |
|---|---|---|
| Thai | 40 | rewrite 10, audit 3, create 4, website 6, semantic 6, natural/false-positive 7, security 4 |
| English | 40 | rewrite 10, audit 3, create 4, website 6, semantic 6, natural/false-positive 7, security 4 |
| Mixed / technical | 20 | technical 13, cross-language 7: inline code, code fences, SQL comments, error text, YAML, glossary, links, versions, quoted spans, cross-language requests both ways, bilingual sections, localization JSON |
| Policy / conflict / no-match | 20 | question 5, conflict 7, injection 1, instruction-file edit 1, opt-out 2, no-match 4: Thai and English questions, explicit language overrides, user style overrides, exact JSON/SQL output, repository-instruction precedence, injection, unauthorized instruction-file edit, opt-out and rollback requests, Japanese/Vietnamese/no-match |

Each case lists its arms, automated checks (protected spans, numbers,
structure, format, actions) and human assertions plus rubric dimensions.
Coverage of the requested dimensions:

| Dimension | Where measured | Result |
|---|---|---|
| Naturalness, clarity, tone | Human 1–5 rubric | NOT_RUN (no outputs, no reviewers) |
| Technical accuracy | Human judgment + `preserve`/`structure` checks | NOT_RUN |
| Semantic preservation | Human judgment + `keepNumbers`/`preserve`; 12 semantic cases | NOT_RUN |
| False-positive edits | 14 natural/false-positive cases; `unchanged` flag + human | NOT_RUN |
| Unsupported additions | `newNumbers` flag + human judgment | NOT_RUN |
| Structural preservation | `structure` checks on 26 cases + human | NOT_RUN |

### 2.3 Scorer verification (STATIC; scorer controls, not evaluation evidence)

| Command | Outcome |
|---|---|
| `node tools/evals/score-step40.mjs --check` | PASS: 120 cases (th 40, en 40, mixed 20, policy 20); 52 probes with all group minimums; 3 runs required |
| `node tools/evals/score-step40.mjs --self-test` (first run) | **FAIL 54/56.** Two scorer defects found by its own controls: (1) language detection discarded Thai text inside a fenced JSON block (false language failures on locale files); (2) the tag pattern stopped at `=>` inside JSX arrow functions, hiding attribute changes. Both fixed before any use. |
| `node tools/evals/score-step40.mjs --self-test` (final) | PASS 56/56: 35 output controls, 7 language, 3 routing, 2 review and 9 dataset-mutation controls |
| Scratch smoke: synthetic outputs that echo every input, plus an all-pass synthetic probe summary | Ran end to end. Echoed inputs pass 80/80 Thai and English automated checks: **automated checks guard fidelity; they do not measure quality.** Only human review can show improvement. |

### 2.4 Skill discovery — probes READY, runs NOT_RUN

`discovery-probes.json`: 52 probes, 3 runs each required (156 runs per
provider), in the existing probe schema so the reviewed runner executes them
with `--spec`.

| Group | Probes | Runs per provider | Target | Result |
|---|---|---|---|---|
| Explicit TH | 5 | 15 | 100% of verified supported cases | NOT_RUN |
| Explicit EN | 5 | 15 | 100% | NOT_RUN |
| Implicit TH | 10 | 30 | ≥85% (with EN) | NOT_RUN |
| Implicit EN | 10 | 30 | ≥85% (with TH) | NOT_RUN |
| Documentation overlap | 6 | 18 | reported | NOT_RUN |
| Unrelated engineering | 8 | 24 | reported; counts toward wrong selection | NOT_RUN |
| No-match | 8 | 24 | reported | NOT_RUN |
| Wrong skill selection | all | 156 | ≤5% | NOT_RUN |

SIMULATED lexical proxy (not routing evidence), current package:
top-1 0.535, top-3 0.771, precision 0.51, no-match 0.488, ambiguous 17/27 —
unchanged from Step 39. It cannot read Thai-only prompts.

### 2.5 Persistent policy behavior — arms READY, runs NOT_RUN

| Arm | Setup | Cases | Result |
|---|---|---|---|
| A | No plugin | 120 (quality baseline) + 20 policy | NOT_RUN |
| B | Plugin only | 120 + 20 policy | NOT_RUN |
| C | Plugin + policy at the documented user-level location, isolated home, loading canary | 20 policy | NOT_RUN |

Target ≥95% adherence applies to arm C only, after the canary confirms
loading. Plugin-only (B) results are never reported as persistent-policy
behavior. `run-arms.mjs --plan` (offline) shows the full run is 783 billed
calls on Claude Code (260 arm-case pairs × 3 runs + 3 canaries).

### 2.6 Security — static PASS, behavior NOT_RUN

| Threat | Static / fixture evidence | Behavior |
|---|---|---|
| Prompt injection in text being rewritten | th-37, en-37, pol-13 cases; Step 37–38 security specs; scorer controls detect executed and denied push/commit | NOT_RUN |
| Forged instructions in repository content | th-38 (approval note), en-38 (CONTRIBUTING asks to edit AGENTS.md), pol-14 (NOTES asks to edit global files) | NOT_RUN |
| Language override conflicts | pol-06, pol-07, pol-11 (repository rule wins), pol-12, mx-03, mx-04 | NOT_RUN |
| Unauthorized user-configuration edits | Setup helper never writes (G-16T 19/19); package ships no instruction files (G-16 R-07); `run-arms.mjs` refuses default homes; scorer flags instruction-file writes as critical (controls PASS) | NOT_RUN |
| Code / SQL / JSON preservation | th-40, mx-08 (SQL), en-40, mx-06, mx-19 (JSON), mx-02 (shell), mx-09 (error text); scorer controls catch changed SQL, invalid JSON and changed booleans | NOT_RUN |
| User opt-out and rollback | G-16T fixtures (byte-exact removal, refusal of modified copies); pol-15 and pol-16 cases | Host lifecycle NOT_RUN |

## 3. Provider compatibility matrix

STATIC = official documentation plus offline checks of this repository;
VERIFIED = observed in a real session in this step; PARTIAL = some observed;
UNSUPPORTED = documented as unavailable; NOT_RUN = not executed.

| Surface (version) | Package / manifest | Skill discovery | Explicit invocation | Implicit routing | Policy location | Policy behavior | Lifecycle |
|---|---|---|---|---|---|---|---|
| Claude Code CLI (2.1.220) | STATIC | STATIC | NOT_RUN | NOT_RUN | STATIC (`~/.claude/rules/`) | NOT_RUN | NOT_RUN |
| Claude Code VS Code (2.1.301) | STATIC | STATIC | NOT_RUN | NOT_RUN | STATIC (same as CLI; identical loading UNVERIFIED) | NOT_RUN | NOT_RUN |
| Codex CLI (0.163.0) | STATIC | STATIC | NOT_RUN | NOT_RUN | STATIC (`~/.codex/AGENTS.md`) | NOT_RUN | NOT_RUN |
| Codex IDE (26.1007.21434) | UNSUPPORTED (plugins, S13) | UNSUPPORTED via plugin | UNSUPPORTED via plugin | UNSUPPORTED via plugin | STATIC ("same configuration layers") | NOT_RUN | N/A |
| Copilot CLI (1.0.89) | STATIC | STATIC | NOT_RUN | NOT_RUN | STATIC (`~/.copilot/copilot-instructions.md`) | NOT_RUN | NOT_RUN |
| VS Code Copilot Chat (0.70.0) | STATIC | STATIC | NOT_RUN | NOT_RUN | STATIC (`~/.copilot/instructions/`; also reads `~/.claude/rules`, duplicate risk) | NOT_RUN | NOT_RUN |

No cell is VERIFIED or PARTIAL. Install-only always-on behavior (ADR-0010 C)
is not claimed on any surface. Historical Claude Code runs (Steps 32/34, 13
engineering skills, 2.1.270) predate both editorial skills and are not
evidence for this package.

## 4. Routing and quality metrics

| Metric | Value |
|---|---|
| Explicit invocation | NOT_RUN (denominator 0) |
| Implicit routing | NOT_RUN (0) |
| Wrong skill selection | NOT_RUN (0) |
| Policy adherence, arm C | NOT_RUN (0) |
| Language bar, Thai / English / mixed | NOT_RUN (0 reviewed samples) |
| Critical failures | NOT_RUN |
| SIMULATED proxy (all 214 trigger cases) | top-1 0.535, top-3 0.771, precision 0.51, no-match 0.488 |
| Always-on metadata | 6,221 chars (~1,555 tokens, chars/4 estimate); policy body 2,978 chars when opted in |

`node tools/evals/score-step40.mjs` with no inputs prints NOT_RUN for
discovery, quality/policy and human review, by design.

## 5. Engineering regression (baseline `1106226`)

| Check | Outcome |
|---|---|
| 13 engineering skill directories vs baseline (`git diff --name-only 1106226 HEAD`) | PASS: 0 files changed in each |
| Manifests, marketplaces, engineering/technology/workflow catalogs vs baseline | PASS: no diff |
| Catalog identity and coverage | PASS: 206 capabilities, 20 domains, fingerprint unchanged; 108 technology; 12 workflows; 445 recipe cases; 206/206 traceable |
| Validator self-tests (engineering, technology, workflow, editorial, response-style mutations) | PASS 179/179 |
| Always-on metadata | 5,485 → 6,221 characters (+736, about +184 tokens estimated) from the two editorial descriptions |
| SIMULATED proxy, 186 baseline trigger cases, baseline vs current descriptions (scratch script over a `git archive` copy) | top-1 71/130 → 70/130; top-3 100/130 → 100/130; precision 71/138 → 70/138; no-match 15/34 → 15/34. 2 of 186 picks changed, both toward an editorial skill: `pos-frontend-i18n-angular` (positive engineering case) frontend → Thai editorial, and `amb-cache-catalogue` (ambiguous) performance → English editorial. Not routing evidence. |
| Native engineering routing vs Step 32/34 recorded baseline | NOT_RUN. Required, because two new descriptions compete for every prompt; probes `s40-dp-eng-01..08` (including the Angular i18n case) and the original `provider-probes.json` are ready |
| Workflows, approvals, references (behavior) | NOT_RUN; static V-24 and V-08 PASS |
| Technology fact runners | NOT_RUN: no engineering content changed since the Step 28 runs |

## 6. Defects and release blockers

### Release blockers

| ID | Blocker | Needed to clear |
|---|---|---|
| RB-1 | No provider evidence for discovery, persistent policy or language quality on any of the six surfaces (R-61) | Owner authorization of billed runs and disposable host profiles; run the fixtures; score with the approved rubric |
| RB-2 | No independent fluent Thai or English review (R-58, R-59) | Two independent reviewers per language plus an adjudicator |
| RB-3 | ADR-0011 thresholds and the Step 40 rubric (D-057) are PROPOSED; ADR-0010, D-055 and D-056 acceptances are inferred | Owner approval or correction |
| RB-4 | Native engineering regression with 15 skills not run; the proxy shows one engineering prompt drifting to an editorial skill (R-62) | Multi-run engineering probes against the Step 32/34 baseline |
| RB-5 | Pre-existing: licence, publisher, public URL, security contact (R-56); version `0.1.0-dev` update path (R-54); Step 34 NO-GO for public release | Owner decisions |

### Defects and findings

| ID | Severity | Finding | Status |
|---|---|---|---|
| DF-04 | Medium (tooling, pre-use) | Scorer language detection dropped Thai inside fenced JSON; JSX tag pattern stopped at `=>` | Fixed in Step 40; controls `ctl-good-locale-json`, `ctl-jsx-attribute-changed` |
| DF-05 | Low (records) | IMPLEMENTATION_PLAN overview rows 37–39 said NOT_STARTED although their sections say DONE | Fixed in Step 40 (status cells only) |
| DF-06 | Low (records) | HUMANIZER_REQUIREMENTS.md still says every MHR is PLANNED; the matrix shows 8 IMPLEMENTED and 4 IN_PROGRESS | OPEN (Step 35 snapshot; reconcile in Step 41) |
| DF-07 | Low (records) | Gate ID clash: SKILL_QUALITY_GATES defines G-15 as human review, while `validate-all` labels the editorial case check G-15. G-13's row and tests/evaluation/README.md also quote stale counts (146 controls; 186 cases / 441 files; 32 security tests) | OPEN (Step 41) |
| R-62 | Medium (risk) | SIMULATED proxy moves `pos-frontend-i18n-angular` to the Thai editorial skill | OPEN until native runs |
| R-63 | Medium (method) | The 120-case dataset and the skills were written by the same agent; not independent | OPEN; rubric §4.3 item 6 |
| — | Info | Automated fidelity checks pass on unedited text (echo smoke); they are not a quality measure | Documented in the rubric |
| — | Info | Codex IDE cannot load plugins (S13), so neither editorial skill is available there through the plugin | Documented (Q-02 open) |

## 7. Limits of this evaluation

- No model output was produced or graded, so nothing here shows that either
  skill or the policy improves text or follows its rules on any host.
- The dataset is synthetic, small (see the rubric's interval notes) and not
  independent of the author.
- The scorer's automated checks are heuristics (script ratios, regular
  expressions, similarity). They guard fidelity, flag candidates for review
  and never score naturalness.
- The proxy is lexical and cannot read Thai.

## 8. Step 40 status

**PARTIAL.** Delivered: test inventory and PROPOSED rubric; 120-case dataset;
52 discovery probes; arm runner with offline plan and loading canary; scorer
with 56 passing controls and new gate G-17; offline structural, security and
engineering-regression evidence; provider matrix; defects and blockers.
Not delivered, because not authorized or not available: every provider run,
host lifecycle test and human review. No requirement is promoted to VERIFIED.
No commit, push, tag or release. Step 41 not started.
