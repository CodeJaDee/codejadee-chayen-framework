# Phase 1 Evidence Log

| Field | Value |
|---|---|
| Phase | 1: Production Readiness Gap Analysis (baseline only; no remediation) |
| Date (UTC) | 2026-10-18, first gate run started 03:34:59Z |
| Repository | `CodeJaDee/codejadee-chayen-framework` (local clone) |
| Git revision | `1734ea50ca7695e9b4b51e343002bcb0188b0be9` (`1734ea5`, "Refactor plugin identifier from `codejadee-chayen-framework` to `chayen`") |
| Branch | `main`; `origin/main` = HEAD (0 ahead / 0 behind, from local refs and `git ls-remote`) |
| Working tree before audit | Clean (`git status --porcelain` empty) |
| Working tree after checks | Clean. The only changes from this phase are the three new files under `docs/production/` |
| Companions | [PRODUCTION_GAP_ANALYSIS.md](PRODUCTION_GAP_ANALYSIS.md) · [PRODUCTION_READINESS_MATRIX.md](PRODUCTION_READINESS_MATRIX.md) |

Every result below is **static or offline**. Nothing here shows how an agent
behaves at runtime. No provider install, enable, disable, update or uninstall
ran. No model was called, nothing was billed, and nothing was committed,
pushed, tagged or published.

## 1. Environment

| Tool | Observed version | Command | Note |
|---|---|---|---|
| Node.js | v24.22.0 | `node --version` | Validators need ≥ 20.11 |
| Claude Code CLI | 2.1.302 | `claude --version` | Docs record 2.1.220 installed and 2.1.270 for the behaviour runs (KL-55). The installed version has changed since then |
| Codex CLI | codex-cli 0.163.0 | `codex --version` | Matches the docs. Provides `plugin add/list/marketplace/remove`, with no validate command |
| GitHub Copilot CLI | **not installed** | `command -v copilot` | No Copilot check can run on this machine |
| GitHub CLI (`gh`) | **not installed** | `command -v gh` | Branch protection, repository settings and security features cannot be inspected |
| .NET SDK | 10.0.401 | `dotnet --version` | Present, but the .NET fact suite was not run (§5) |
| npm | 11.19.1 | `npm --version` | — |
| OS | Windows 11 Pro 10.0.26200; Git Bash shell | — | — |

## 2. Repository discovery

| Item | Evidence |
|---|---|
| Tracked files | 999 (`git ls-files \| wc -l`) |
| Recent history | `1734ea5`, `73efc6a` (Step 41 docs), `e921df1` (Step 40 scorer), `0702b5b`, `f65a432`, … |
| Remote refs | `git ls-remote origin` shows only `HEAD` and `refs/heads/main` at `1734ea5`. **No tags, no other branches** |
| Repository visibility | Unauthenticated `curl` to `https://api.github.com/repos/CodeJaDee/codejadee-chayen-framework` returned HTTP 404, and so did `https://github.com/CodeJaDee/codejadee-chayen-framework`. Consistent with a private repository (KL-36, R-56) |
| Marketplaces | `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json`, `.github/plugin/marketplace.json`. All are named `codejadee`, each has one entry `chayen`, and all point to `./plugins/codejadee-chayen-framework` |
| Plugin manifests | `plugins/codejadee-chayen-framework/plugin.json` (Agent Plugins 1.0.0 `$schema`) and `.../.claude-plugin/plugin.json`. `name=chayen`, `version=0.1.0-dev`, **no `license` field** |
| Version locations | Both manifests, plus the Copilot marketplace entry and its `metadata.version`. All are `0.1.0-dev` |
| CI configuration | **None.** `.github/` contains only `plugin/marketplace.json`. There is no `.github/workflows/`, no other pipeline file, no `CODEOWNERS` and no PR template |
| Licence | **No `LICENSE` file** at the root. Manifests have no `license`. Upstream MIT notice ships inside `chayen-humanizer-en/references/` |
| Production docs | `docs/production/` did not exist before this phase |

## 3. Side-effect review of executed scripts

Each script was read before it ran. Write paths are all behind flags, and
none of the flags was used.

| Script | Default behaviour | Write or effect paths (not triggered) |
|---|---|---|
| `tools/validate/validate-all.mjs` | Spawns the 13 gate scripts below with `node`; read-only | — |
| `tools/validate/check-security.mjs` | Reads source as data | `--write-report` writes `tests/security/results/step30-static-review.json` |
| `tools/validate/validate-package.mjs`, `check-docs.mjs`, `check-editorial-cases.mjs`, `check-response-style.mjs` | Read-only | — |
| `tools/catalog/check-catalog.mjs`, `check-technology.mjs`, `check-workflows.mjs` | Read-only | `--write-doc` regenerates coverage docs |
| `tools/evals/generate-claude-evals.mjs --check` | Read-only comparison | No flag rewrites `tests/evals/claude/`; `--stage` copies the plugin |
| `tools/validate/run-validator-tests.mjs` | Mutates copies in `os.tmpdir()/chayen-vt-*` and deletes them after checking the prefix | — |
| `tests/security/boundaries.test.mjs`, `tests/response-style/setup-fixtures.test.mjs` | Temporary fixtures in `os.tmpdir()`, removed by `t.after` | — |
| `tools/evals/score-step40.mjs` | "never writes a file" (header); read-only | — |
| `tools/evals/run-evaluation-suite.mjs` | Spawns static gates; read-only | `--write` writes `tests/evaluation/results/step32-evaluation.json` |
| `tools/catalog/audit-coverage.mjs`, `tests/provider-compatibility/check-identity.mjs` | Read-only | — |
| `tests/technology/{angular-typescript,react-nextjs,vue-nuxt-vite}/run-fact-checks.mjs` | Temporary scratch in `os.tmpdir()`; React binds a loopback server on `127.0.0.1:0`; npm runs `--offline --ignore-scripts` | `--report` writes a markdown report |
| `claude plugin validate [--strict]` | Static manifest and component validation | — |

**Not executed, because of side effects** (see §5): `tests/technology/dotnet`
(NuGet restore over the network), `tests/technology/sqlserver` (creates or
starts a persistent LocalDB instance `ChayenFacts`),
`tests/technology/postgres-crossstack` (initdb and loopback cluster;
LocalDB tempdb), `tests/provider-compatibility/run-lifecycle.sh` (native
installs into isolated homes), `tests/routing/run-smoke.mjs`,
`tests/evaluation/run-provider-probes.mjs` and
`tests/evaluation/step40/run-arms.mjs` (billed provider calls; `run-arms.mjs`
also writes the policy file into a host home).

## 4. Executed checks

Every command ran from the repository root at revision `1734ea5`. Exit
codes were recorded. Raw outputs were kept in the session scratchpad. They
are not committed.

### 4.1 Aggregate gate run

| # | Command | Exit | Result |
|---|---|---|---|
| E-01 | `node tools/validate/validate-all.mjs` | 0 | **13/13 gate groups PASS**: "All automated gates passed" |

### 4.2 Individual gates

| # | Command | Exit | Pass / fail counts and key output |
|---|---|---|---|
| E-02 | `node tools/validate/check-security.mjs` | 0 | PASS V-25: packageFiles 256, entrySkills 15, references 237, developerAssets 76, externalUrls 16, fixtureDependencyReferences 32, errors 0. The tool says: "static PASS is not a security guarantee" |
| E-03 | `node --test tests/security/boundaries.test.mjs` | 0 | tests 34, pass 34, fail 0, skipped 0 |
| E-04 | `node tools/validate/validate-package.mjs` | 0 | 0 errors, **5 warnings** (V-06 SB-01: `chayen-backend` 219, `chayen-data` 205, `chayen-devops` 209, `chayen-frontend` 223, `chayen-implementation` 217 lines, each over the 200-line target and under the 300-line limit). PASS V-01..V-10, V-12, V-13, V-16 (214 trigger cases), V-17, V-18 (237 references), V-19, V-20, V-22 (445 recipe cases). V-07 L0 6,221/6,500. V-07b max overlap 0.24 |
| E-05 | `node tools/catalog/check-catalog.mjs` | 0 | 20 domains, 206 capabilities, unique ids and names 206, Status IMPLEMENTED=206, entry skills 13, consolidation groups 57, fingerprint `2f13cad24ff431e3` matches; 0 errors, 0 warnings |
| E-06 | `node tools/catalog/check-technology.mjs` | 0 | 108 technology capabilities; V-23.1..V-23.10 PASS; 295 cases; 152 fact checks defined across 11 packs; 0 errors |
| E-07 | `node tools/catalog/check-workflows.mjs` | 0 | 12 workflows, 7 templates, 47 case specifications; V-24.1..V-24.6 PASS; "agent/provider behavior NOT_RUN" |
| E-08 | `node tools/evals/generate-claude-evals.mjs --check` | 0 | 214 cases, 516 files, up to date |
| E-09 | `node tools/validate/run-validator-tests.mjs` | 0 | **179/179** negative controls passed (179 PASS, 0 FAIL) |
| E-10 | `node tools/validate/check-docs.mjs` | 0 | 20 files, 0 errors, 3 external links listed, not fetched |
| E-11 | `node tools/validate/check-editorial-cases.mjs` | 0 | TH 14 patterns / 52 cases; EN 26 patterns / 102 cases; total 40 patterns / 154 case specifications; "behavior NOT_RUN" |
| E-12 | `node tools/validate/check-response-style.mjs` | 0 | Policy v1: 2,978 body characters (limit 3,500), 3,074 UTF-8 bytes; template in sync; not shipped in the package; "Host loading and behavior NOT_RUN" |
| E-13 | `node --test tests/response-style/setup-fixtures.test.mjs` | 0 | tests 19, pass 19, fail 0 |
| E-14 | `node tools/evals/score-step40.mjs --self-test` | 0 | 56/56 synthetic scorer controls (the scorer marks these as not evaluation evidence) |
| E-15 | `node tools/evals/score-step40.mjs --check` | 0 | 120 cases (th 40, en 40, mixed 20, policy 20); 52 discovery probes, 3 runs each required |
| E-16 | `node tools/evals/score-step40.mjs` | 0 | **NOT_RUN**: discovery (no probe summaries), language quality and policy (no arm outputs), human review (no reviewer files) |
| E-17 | `node tests/provider-compatibility/check-identity.mjs` | 0 | **15/15 PASS** (IC-01..IC-15) |
| E-18 | `node tools/catalog/audit-coverage.mjs` | 0 | Expected 206, records 206, implemented 206, **verified 0**; 206/206 pass all 10 criteria; 48 shared-recipe capabilities without an ID-labelled section; lowest term coverage CAP-11-009 64% |
| E-19 | `node tools/evals/run-evaluation-suite.mjs` (no `--write`) | 0 | S-ALL, S-IDENTITY 15/15, S-AUDIT206, S-EVALSYNC PASS; T-206 206/206; T-TECH 108/108; T-WF 12/12; T-ROUTING 11/11; S-HANDOFF 253 files, 0 dangling; **SIM** lexical proxy top-1 0.535, top-3 0.771, precision 0.51, no-match 0.488 (simulated only; Step 34 recorded 0.546 on 13 skills); L0 6,221/6,500 (~1,555 tokens); no provider summaries supplied, so no PROV lines |
| E-20 | `node tools/response-style/inspect-instructions.mjs --help` | 1 | Prints usage; `--help` is not a recognised subcommand. Not a defect: the tool is a read-only helper with explicit subcommands |

### 4.3 Provider-native static validation

| # | Command | Exit | Result |
|---|---|---|---|
| E-21 | `claude plugin validate --strict plugins/codejadee-chayen-framework` | 0 | Validation passed. Advice: plugin README has no one-step marketplace install line |
| E-22 | `claude plugin validate --strict .` | 0 | Marketplace validation passed. Same advice, proposing `/plugin install chayen --marketplace CodeJaDee/codejadee-chayen-framework` |
| E-23 | `claude plugin validate plugins/codejadee-chayen-framework/skills` | 0 | Validation passed. **DF-02 / KL-53 does not reproduce on 2.1.302** |
| E-24 | `codex plugin --help` | 0 | Lists add, list, marketplace, remove. Codex has no static validator, so Codex packaging is checked only by repository validators |
| — | Copilot CLI validation | NOT_RUN | Copilot CLI is not installed |

### 4.4 Framework fact checks (dependency-free modes)

| # | Command | Exit | PASS / FAIL / NOT_RUN |
|---|---|---|---|
| E-25 | `node tests/technology/angular-typescript/run-fact-checks.mjs` | 0 | 3 / 0 / 19 (TypeScript and Angular unavailable) |
| E-26 | `node tests/technology/react-nextjs/run-fact-checks.mjs` | 0 | 3 / 0 / 13 (React and Next unavailable) |
| E-27 | `node tests/technology/vue-nuxt-vite/run-fact-checks.mjs` | 0 | 2 / 0 / 16 (Vue, Nuxt and Vite unavailable) |

The NOT_RUN counts (19, 13, 16) match the historical KL-13 counts for these
packs. A runner exits 0 when no executed fact failed. Skipped facts stay
NOT_RUN.

### 4.5 Repository state checks

| # | Command | Exit | Result |
|---|---|---|---|
| E-28 | `git status --porcelain`, after E-01..E-27 | 0 | Empty: no tracked or untracked changes from any check |
| E-29 | `git rev-list --left-right --count origin/main...HEAD` | 0 | `0 0` |
| E-30 | `git ls-remote origin` | 0 | `HEAD` and `refs/heads/main` only, at `1734ea5` |
| E-31 | `curl` (unauthenticated) GitHub API and web URL for the repository | 0 | HTTP 404 and HTTP 404 |

## 5. Checks not run

| Check | Status | Reason |
|---|---|---|
| .NET fact suite (`tests/technology/dotnet`) | NOT_RUN | Needs a NuGet restore (network, global package cache) and the .NET 8 SDK and `dotnet-ef` for some facts. Outside the non-destructive baseline |
| SQL Server fact suite | NOT_RUN | Creates or starts a persistent LocalDB instance (`ChayenFacts`), so machine state persists (KL-42) |
| PostgreSQL / cross-stack fact suite | NOT_RUN | Needs PostgreSQL binaries, Python and browser tooling; starts a local cluster |
| Native lifecycle: install, disable, enable, update, uninstall (`run-lifecycle.sh`, R-1..R-10 runbook) | BLOCKED | Needs owner authorization, isolated host profiles and test identities (R-53). Changes the provider configuration |
| Routing and discovery probes (Claude Code, Codex, Copilot) | BLOCKED | Billed provider calls need explicit authorization (R-61, R-62) |
| Step 40 quality and policy arms | BLOCKED | Billed provider calls, plus an unapproved rubric (ADR-0011) |
| Human editorial review (TH, EN) | BLOCKED | No reviewers nominated; rubric unapproved |
| VS Code manual procedures (Claude Code, Copilot Chat) | NOT_RUN | Need a person and a disposable profile |
| Copilot CLI anything | BLOCKED | Not installed on this machine; isolated authenticated home needed |
| Branch protection, rulesets, secret scanning, private vulnerability reporting | BLOCKED | No `gh` and no authenticated API access; the repository is private. Remote settings were not to be read or changed in this phase |
| Dependency advisories for developer fixtures | NOT_RUN | Needs network advisory sources; fixtures are developer-only |
| Live external-link check | NOT_RUN | check-docs lists links without fetching them, by design |

## 6. Historical claims revalidated in this phase

| Historical claim | Source | Today | Outcome |
|---|---|---|---|
| validate-all 13/13; 179/179 self-tests; 34/34 security; 19/19 policy fixtures; G-17 56/56 | RELEASE_READINESS §4 | Same counts (E-01, E-03, E-09, E-13, E-14) | Reproduced |
| Identity 15/15; docs 20 files / 0 errors | RELEASE_READINESS §4 | Same (E-17, E-10) | Reproduced |
| 256 package files, 15 skills, 237 references, L0 6,221/6,500 | KNOWN_LIMITATIONS header; KL-03 | Same (E-02, E-04) | Reproduced |
| 206 / 108 / 12 inventory, 0 VERIFIED | KL-10 | Same (E-05, E-06, E-07, E-18) | Reproduced |
| DF-02: `claude plugin validate` on `skills/` fails on some CLI versions | KL-53, ISSUES DF-02 | Passes on 2.1.302 (E-23) | Not reproduced on the current CLI; keep it open for older versions |
| Installed Claude Code 2.1.220 | KL-55, RELEASE_READINESS §3 | 2.1.302 | Out of date |
| Lexical proxy top-1 0.546 | RELEASE_READINESS Step 34 §2 | 0.535 with 15 skills (E-19) | Changed; simulated only |
| "No CI pipeline" | KL-52 | Still no CI configuration of any kind | Reproduced |
| No licence, private repository | KL-50, B-1 | No `LICENSE`, no manifest `license`, HTTP 404 unauthenticated | Reproduced |
| Behaviour evidence: Claude Code 43 runs, automatic 12/22, explicit 6/6, no-match 12/12 | KL-21, RELEASE_READINESS §2 | Recorded on the 13-skill build. Not re-executed (billed) | Historical only; not current evidence |
| Native lifecycle passed on an earlier build | KL-30 | Not re-executed | Historical only; current build NOT_RUN |
