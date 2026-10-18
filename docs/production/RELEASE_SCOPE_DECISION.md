# Release Scope Decision: Chayen v0.1.0

> **Owner decision (2026-10-18):** GitHub Actions workflows and GitHub Releases are not part of Chayen distribution. Maintainers run offline validators and native CLI checks manually against an identified source revision. Stable status is based on approved `0.1.0` manifest versions and verified behavior, **not** a GitHub Release. Git tags are optional. Older Phase 3 CI references below are historical. Security/Support remains **LATER**, and automatic Skill Routing >=85% per CLI remains mandatory.


| Field | Value |
|---|---|
| Release | **Chayen v0.1.0: public production release for verified CLI providers** |
| Plan step | Production Readiness Plan v4, Phase 1: release contract and scope alignment. Planning documents only. Nothing in the product was changed |
| Date | 2026-10-18 |
| Git revision | `a33c4e28f38258cd086034027ac92b3082d184c8` (`main`, working tree clean before this change) |
| Decision record | [D-060](../chayen/DECISIONS.md#d-060--chayen-v010-release-scope-and-owner-release-decisions) |
| Companions | [RELEASE_GATE_MATRIX.md](RELEASE_GATE_MATRIX.md) (gates G-01..G-17) · [ACCEPTED_RISKS.md](ACCEPTED_RISKS.md) (AR-01..AR-04) |
| Baseline audit (preserved, unchanged) | [PRODUCTION_GAP_ANALYSIS.md](PRODUCTION_GAP_ANALYSIS.md) · [PRODUCTION_READINESS_MATRIX.md](PRODUCTION_READINESS_MATRIX.md) · [PHASE_01_EVIDENCE.md](PHASE_01_EVIDENCE.md) |

This document holds the release contract. It records what the Product Owner
has approved, what v0.1.0 contains, which work is kept for the release and
which is deferred. Gate statuses are in the gate matrix. This document does
not repeat them.

## 1. Owner decisions

### 1.1 Approved

The Product Owner confirmed the following. They are recorded as **ACCEPTED**
in D-060 and are not reopened in later phases.

| ID | Decision | Value | Applied to the repository? |
|---|---|---|---|
| OWN-01 | Distribution | **Public** | No. The repository is still private (baseline E-31). Changing visibility is a separate, explicitly authorized act (§5) |
| OWN-02 | Project licence | **MIT** | No. No `LICENSE` file exists and neither manifest has `license`. They are added when the candidate is frozen (K-19) |
| OWN-03 | Publisher identity | **CodeJaDee** | Already present as `author.name` and the marketplace `owner.name`. That value is now confirmed, not merely carried over |
| OWN-04 | Production-supported hosts | **Claude Code CLI, OpenAI Codex CLI, GitHub Copilot CLI** | No. User docs still describe more surfaces (see AR-02) |
| OWN-05 | Automatic Skill routing | **≥ 85%, measured independently on each supported CLI** | Not measured. Contract in §4 |
| OWN-06 | Target stable version | **`0.1.0`** | No. All four version fields still read `0.1.0-dev` |
| OWN-07 | Release candidate version | **`0.1.0-rc.1`** | No. Applied only at the candidate freeze |
| OWN-08 | Accepted risks | **AR-01..AR-04** | Recorded in [ACCEPTED_RISKS.md](ACCEPTED_RISKS.md) |
| OWN-09 | Out of scope | **Nitro and Elysia** | No. They are still presented as supported (P1-007). Corrected under K-03 |

### 1.2 Deferred: security and support

**Status: decision pending.** The owner answered "later". That answer
selects no channel.

- It is **not** approval to use GitHub Issues, GitHub private vulnerability
  reporting, an email address, or any other specific contact method.
- This document names no address, URL or channel, and nobody may add one
  until the owner decides.
- `SECURITY.md` stays as it is. It already says no private channel is
  confirmed.
- Gate **G-16** is BLOCKED until the owner decides. While G-16 is open:
  - the repository is not made public;
  - nothing is tagged or released publicly, whether candidate or stable.

### 1.3 Still to finalize

| ID | Item | Current state | Recommendation (not approved) |
|---|---|---|---|
| OPEN-01 | Tag format | [ADR-0008](../chayen/ADRS/ADR-0008-packaging-and-marketplace-strategy.md) (ACCEPTED) specifies `vX.Y.Z` tags and `owner/repo#vX.Y.Z` pins. [RELEASE_CHECKLIST.md](../distribution/RELEASE_CHECKLIST.md) §F mentions `claude plugin tag`, which produces `chayen--v{version}`. Both cannot be the release convention | Keep ADR-0008: `v0.1.0-rc.1` for the candidate and `v0.1.0` for the stable release. The repository hosts one plugin, the ADR is already accepted, and both tag forms are valid Git refs. Align the checklist with the ADR in the same change that applies the version |
| OPEN-02 | Version application | D-058 proposed `0.1.0-rc.1` then `0.1.0`. OWN-06 and OWN-07 now fix those values | Apply them identically in all four fields when the candidate is frozen (K-09), together with the `SECURITY.md` supported-versions table and `CHANGELOG.md` |

### 1.4 Publication needs separate authorization

**Nothing in this document authorizes a release act.** Each act below needs
its own explicit owner approval at the time it is taken (BC-30, BC-31,
ADR-0008 item 6):

- committing and pushing the version change;
- creating any tag;
- changing repository visibility to public;
- creating a GitHub release;
- submitting to any marketplace or directory (one approval per directory).

An approved scope, a PASS gate or a complete matrix does not count as
approval for any of these acts.

## 2. Release definition

**Chayen v0.1.0 is a public production release for verified CLI providers.**

| Dimension | v0.1.0 contract |
|---|---|
| Product form | A Native Agent Plugin installed through each provider's own plugin manager. No CLI, extension, runtime, daemon, installer or mandatory MCP server (ADR-0001, ADR-0005, EX-01..EX-07) |
| Distributed package | Static Markdown and JSON only, from `plugins/codejadee-chayen-framework/`. No hooks, MCP, scripts, telemetry or executables (baseline: 254 `.md` and 2 `.json`) |
| Skill source | One canonical skills source shared by all three providers. Three native marketplace files all point at the same directory (D-013) |
| Entry Skills | **15**: 13 engineering and 2 writing (`chayen-humanizer-th`, `chayen-humanizer-en`). The ceiling of 15 (D-053) is reached. No new skill is added for this release |
| Engineering Capabilities | **206** in 20 domains |
| Technology Capabilities | **108** in 11 technology packs |
| Composite Workflows | **12**, with 7 templates |
| Plugin identifier | `chayen@codejadee` (D-059) |
| Supported hosts | Claude Code CLI, OpenAI Codex CLI, GitHub Copilot CLI (≥ 1.0.91). "Supported" means the host passes its lifecycle gate (G-06..G-08), automatic routing (G-09) and explicit invocation and no-match (G-10) on the frozen candidate |
| Not supported in v0.1.0 | Claude Code VS Code extension and VS Code Copilot Chat (not tested, AR-02). Codex IDE extension (no plugin support: provider limitation KL-06). Claude Code cloud sessions (no local plugins: KL-07). Copilot cloud agent (never tested). The opt-in response style policy is outside the package and is not verified on any host (AR-01) |
| Out-of-scope technologies | **Nitro and Elysia.** No `SKILL.md` description, scope line, example, catalog stack list or positive test case may present them as supported (K-03). Stacks without a technology pack get only general guidance, as `docs/SUPPORTED_TECHNOLOGIES.md` documents. Java's formal position (ISSUES Q-08) stays open, but no Java pack exists among the 108 capabilities, so v0.1.0 makes no Java claim |
| Version path | `0.1.0-dev` → `0.1.0-rc.1` (frozen candidate) → `0.1.0` (stable) |

### Invariants

Every later phase must keep the following true. G-01 and G-02 check them,
and G-17 re-checks them on the frozen candidate.

1. The Native Agent Plugin architecture is preserved.
2. The distributed package is static Markdown and JSON only.
3. There is one canonical skills source.
4. There are exactly 15 Entry Skills, 206 Engineering Capabilities, 108
   Technology Capabilities and 12 Composite Workflows. Content inside them
   may be corrected (for example by K-03 and K-04). The counts may not
   change.
5. Nitro and Elysia are out of scope.

Changing an invariant needs a new owner decision recorded in
`docs/chayen/DECISIONS.md`.

## 3. Scope: the 20 KEEP items and 4 deferred items

### 3.1 Source of this list

The Production Readiness Plan v4 text is **not stored in this repository**.
A search for "KEEP" and "Plan v4" over the tracked files found nothing. The
20 KEEP items below were therefore derived from the 36 findings of the
preserved baseline audit:

- every finding not covered by AR-01..AR-04 belongs to a KEEP item;
- every gate G-01..G-17 is covered by at least one KEEP item.

If Plan v4 words or numbers the items differently, the owner reconciles the
two lists ([§6](#6-remaining-owner-inputs), OD-13). The gate mapping does
not change, because gate IDs are the stable reference.

Phase numbers in the tables refer to the sequence proposed in
[PRODUCTION_GAP_ANALYSIS.md §5](PRODUCTION_GAP_ANALYSIS.md#5-dependencies-and-recommended-order-for-phases-28):

| Phase | Name |
|---|---|
| 2 | Owner decisions |
| 3 | CI |
| 4 | Tooling and documentation |
| 5 | Skill content |
| 6 | Candidate freeze |
| 7 | Provider and human verification |
| 8 | Release decision |

### 3.2 KEEP items (required for v0.1.0)

| ID | KEEP item | Baseline findings / gates | Phase | Release gate(s) |
|---|---|---|---|---|
| K-01 | Preserve the Native Agent Plugin architecture, the static Markdown/JSON package and the single skills source | P1-034; PG-01..PG-05, PG-33 | All (re-run at 6) | G-01, G-14, G-17 |
| K-02 | Preserve the inventory: 15 Entry Skills, 206 Engineering and 108 Technology Capabilities, 12 Composite Workflows. SKILL.md files stay within the 300-line limit | P1-029; PG-17..PG-20 | All (re-run at 6) | G-02 |
| K-03 | Nitro and Elysia out of scope in every artifact: descriptions, scope lines, examples, references, catalog stack lists, trigger and recipe cases, user docs | P1-007; PG-21 | 2 (option), 5 | G-02, G-09 |
| K-04 | Thai editorial skill content corrections: the description must admit Thai copy in locale files, and guidance must protect Thai numerals and Buddhist Era dates | P1-012, P1-014 (content); PG-28 | 5 | G-02, G-11 |
| K-05 | Regression guards: a validator for the upstream MIT notice, and Thai-digit and era detection in the Step 40 scorer, each with negative controls | P1-013, P1-014 (tooling); PG-32 | 4 | G-03, G-11, G-15 |
| K-06 | Lifecycle tooling and runbook corrected for 15 skills and every lifecycle step on the three CLIs, with uninstall checked by absence and Copilot auto-update disabled | P1-018, P1-019; PG-15 | 4 | G-03, G-06, G-07, G-08 |
| K-07 | Release-critical documentation and decision consistency: stale counts, versions, identifiers and verification claims corrected; docs-consistency rules added; provider limitations re-dated; release-related decisions ratified (§3.4) | P1-020, P1-028, P1-036, P1-009 (docs), P1-025, P1-021 (release-related part); PG-16, PG-38 (part), PG-43 | 2, 4, 8 | G-03, G-10, G-17 |
| K-08 | Manual offline validators and negative controls executed against the identified candidate/stable source revision; no GitHub Actions or GitHub Releases | P1-016, P1-033; PG-36 | 3 | G-04 |
| K-09 | Version integrity: `0.1.0-rc.1` then `0.1.0` in all four fields, one tag format, CHANGELOG section, SECURITY.md supported versions | P1-002; PG-09, PG-39 | 2 (tag), 6 | G-05, G-17 |
| K-10 | Claude Code CLI native lifecycle of the frozen candidate | P1-001; PG-06, PG-10 | 7 | G-06 |
| K-11 | Codex CLI native lifecycle, with the marketplace `authentication` and `category` fields confirmed against an official source and root-manifest resolution confirmed | P1-001, P1-026, P1-027; PG-07, PG-11 | 4, 7 | G-07 |
| K-12 | Copilot CLI (≥ 1.0.91) native lifecycle of the frozen candidate | P1-001; PG-08, PG-12 | 7 | G-08 |
| K-13 | Automatic routing ≥ 85% per CLI under the §4 contract, including writing-skill capture of engineering prompts, a probe set covering all 15 Entry Skills, and probe tooling that runs on Codex | P1-008, P1-015; PG-24, PG-27 | 4, 7 | G-09 |
| K-14 | Explicit invocation under the `chayen` namespace, and unchanged native behaviour on no-match prompts, on each CLI | P1-009; PG-25, PG-26 | 7 | G-10 |
| K-15 | Humanizer TH/EN quality: rubric and language threshold approved, fluent reviewers nominated, independent-case share set, translation-direction scope decided, provider and human runs scored | P1-010, P1-011, P1-032; PG-29 | 2, 7 | G-11 |
| K-16 | Engineering capability and workflow behaviour sampling on an approved risk-based subset, or a formal owner acceptance of the IMPLEMENTED bar | P1-022; PG-22 | 2, 7 | G-12 |
| K-17 | Technology fact checks: all 152 defined checks executed in a disposable environment with recorded toolchain versions | P1-023; PG-23 | 7 | G-13 |
| K-18 | Agent security: adversarial prompt-injection and forged-approval cases run on each CLI, ADR-0007 ratified, static security profile still passing | P1-024, P1-034; PG-33, PG-34 | 2, 7 | G-14 |
| K-19 | Public distribution under MIT: `LICENSE`, manifest `license`, publisher fields, public homepage and repository URLs, a one-step install line, rights confirmation (§5), remote install from the public source | P1-003, P1-005, P1-030; PG-14, PG-40, PG-41 | 2, 6, 7, 8 | G-15 |
| K-20 | Security and support: the owner's decision, then a working private reporting channel and a stated support path | P1-004, P1-006; PG-35, PG-42 | Owner, then 6 | G-16 |

**Reverse coverage.** Every gate has at least one KEEP item:

| Gate | KEEP items |
|---|---|
| G-01 | K-01 |
| G-02 | K-02, K-03, K-04 |
| G-03 | K-05, K-06, K-07 |
| G-04 | K-08 |
| G-05 | K-09 |
| G-06 | K-06, K-10 |
| G-07 | K-06, K-11 |
| G-08 | K-06, K-12 |
| G-09 | K-03, K-13 |
| G-10 | K-07, K-14 |
| G-11 | K-04, K-05, K-15 |
| G-12 | K-16 |
| G-13 | K-17 |
| G-14 | K-01, K-18 |
| G-15 | K-05, K-19 |
| G-16 | K-20 |
| G-17 | K-01, K-07, K-09 |

### 3.3 Deferred items (accepted risks)

These are not part of v0.1.0. Each has an explicit limitation that the
release must disclose. Full records, boundaries and revisit triggers are in
[ACCEPTED_RISKS.md](ACCEPTED_RISKS.md).

| ID | Deferred item | Baseline items | Limitation (short form) |
|---|---|---|---|
| AR-01 | Response Style Policy host testing | P1-035; PG-31; Step 40 policy arms (including pol-13/14) | The opt-in policy is unverified on every host. v0.1.0 makes no claim that it loads or that responses follow it |
| AR-02 | VS Code extension and Copilot Chat testing | P1-001 (VS Code part); PG-13; U-05 | Only the three CLIs are supported. The Claude Code VS Code extension and VS Code Copilot Chat are "Not tested" |
| AR-03 | Branch Protection and Required Reviews | P1-017; PG-37 | `main` has no enforced review or required CI status. Users should install a pinned release tag, not the default branch |
| AR-04 | Unrelated ADR closure and repository hygiene | P1-021 (non-release part), P1-031; PG-38 (part) | ADRs and decisions outside §3.4 stay PROPOSED and non-binding. `.vscode/`, `.gitignore` and `.gitattributes` are unchanged |

### 3.4 Release-related decisions (not deferred by AR-04)

A decision is **release-related** when a release gate's requirement or
verification depends on it. Release-related decisions must be ACCEPTED, or
replaced by an owner-approved value recorded in D-060, before the gate that
uses them can PASS.

| Decision | Current status | Gate | Resolution path |
|---|---|---|---|
| D-058 (version proposal) | PROPOSED; values now fixed by OWN-06 and OWN-07 | G-05 | Resolved by D-060. Tag format still open (OPEN-01) |
| D-009 / DF-03 (dual-manifest format: PROPOSED in DECISIONS.md, ACCEPTED in PLUGIN_FORMAT_DECISION.md) | Inconsistent | G-01 | Owner ratifies, then DF-03 closes (K-07) |
| ADR-0003 (no-match fallback) | PROPOSED | G-10 | Owner ratifies, or G-10 relies only on the §4 thresholds once approved |
| ADR-0007 (security boundaries) | PROPOSED | G-14 | Owner ratifies (K-18) |
| ADR-0011 item 3 and D-057 (rubric, language threshold, critical failures) | PROPOSED | G-11 | Owner approves or amends (K-15) |
| D-057 routing and policy targets | "Given by the owner's Step 40 instruction" for the editorial evaluation | G-09, G-10 | ≥ 85% per CLI is now approved for the release (OWN-05). The other targets are only proposals for the release gate (§4.5) |

Everything else that is PROPOSED in `docs/chayen/DECISIONS.md` or
`docs/chayen/ADRS/`, including ADR-0004, the remaining ADR-0009 behaviour
decisions, ADR-0010 part C, the GOV-01..18 reviews and normalization of the
status vocabulary, is deferred under AR-04.

### 3.5 Baseline finding coverage

All 36 baseline findings are assigned. None is left without an owner.

| Disposition | Findings |
|---|---|
| KEEP | P1-001 (CLI part) K-10/K-11/K-12 · P1-002 K-09 · P1-003 K-19 · P1-004 K-20 · P1-005 K-19 · P1-006 K-20 · P1-007 K-03 · P1-008 K-13 · P1-009 K-07/K-14 · P1-010 K-15 · P1-011 K-15 · P1-012 K-04 · P1-013 K-05 · P1-014 K-04/K-05 · P1-015 K-13 · P1-016 K-08 · P1-018 K-06 · P1-019 K-06 · P1-020 K-07 · P1-021 (release-related part) K-07 · P1-022 K-16 · P1-023 K-17 · P1-024 K-18 · P1-025 K-07 · P1-026 K-11 · P1-027 K-11 · P1-028 K-07 · P1-029 K-02 · P1-030 K-19 · P1-032 K-15 · P1-033 K-08 · P1-034 K-01/K-18 · P1-036 K-07 |
| Accepted risk | P1-001 (VS Code part) AR-02 · P1-017 AR-03 · P1-021 (unrelated part) AR-04 · P1-031 AR-04 · P1-035 AR-01 |

## 4. Routing evaluation contract

This contract applies to G-09 (automatic routing) and G-10 (explicit
invocation and no-match). It is written before any measurement, so results
cannot shape the rules.

### 4.1 Approved threshold

**Automatic routing accuracy ≥ 85%, independently on each supported CLI**
(OWN-05). Each CLI passes or fails on its own runs. Results are never pooled
across CLIs. A CLI that does not reach 85% blocks the release (G-09). It
cannot be listed as supported and also be excused from the threshold.

### 4.2 What counts as success

A run succeeds only on **actual, correct, native Skill selection**:

1. **Native.** The host itself selects and loads the Skill through its own
   skill mechanism, observed in the session's event stream. Examples are the
   `Skill` tool event in Claude Code and the `skill` tool event in Copilot
   CLI. For Codex, the observable selection signal is written down and
   reviewed before the first scored run.

   The following do not count as selection:
   - a lexical or simulated proxy (for example `run-evaluation-suite`'s SIM
     score);
   - an agent opening a `SKILL.md` file by path because it explored the
     repository;
   - any inference made from the content of the answer.

2. **Correct.** At least one Skill from the probe's expected set is
   selected, and no Chayen Skill outside that set is selected.
3. **Relevant prompt.** The prompt is a positive probe (§4.3) with a
   reviewed expected set.

**Explicit invocations are excluded from the automatic-routing denominator.**
They are measured and reported only under G-10.

### 4.3 Case types

Each probe has exactly one type. Each type has its own denominator and its
own rate. Rates are never merged.

| Type | Definition | Success condition | Counted in |
|---|---|---|---|
| **Positive (automatic)** | An ordinary prompt, without a skill name or slash command, for a task inside one or more Entry Skills' scope. The expected set lists the acceptable Skills | A native selection of ≥ 1 expected Skill, and 0 Chayen Skills outside the set | **G-09 automatic accuracy** = successful positive runs ÷ all positive runs |
| **Negative** | An ordinary engineering or writing prompt that is adjacent to Chayen's scope but excluded from it. Examples: Nitro, Elysia, Unity, SwiftUI, native mobile UI, i18n framework wiring for the Thai skill | No Chayen Skill selected, or only a Skill listed in the probe's reviewed `none_or` set | G-09, reported as its own rate |
| **No-match** | A prompt with no Chayen-relevant task, such as general knowledge, chit-chat or an unrelated tool question | No Chayen Skill selected, and the behaviour stays native compared with the no-plugin baseline arm | **G-10** no-match rate |
| **Wrong-Skill** | A property of any automatic run (positive, negative or no-match), not a separate prompt set: the run selected at least one Chayen Skill outside its allowed set | — (a failure event) | G-09 wrong-Skill rate = runs with ≥ 1 out-of-set Skill ÷ all automatic runs |
| **Explicit** | A prompt that names the Skill with the host's syntax: `/chayen:<skill>` (Claude Code), `$chayen-<skill>` (Codex), `/chayen-<skill>` (Copilot) | The named Skill is loaded, shown by a native event, a read of a skill-local reference, or the probe's declared output marker | **G-10** explicit rate. Excluded from G-09 |
| **Ambiguous / inspect-first** | A prompt where the correct behaviour is to inspect the repository before choosing a Skill (for example `amb-*`) | Repository inspection precedes any Skill selection | Reported separately. Not in any rate above |

Every probe set used for a gate must:

- give every one of the 15 Entry Skills at least one positive probe. The
  baseline sets do not: `chayen-ai-engineering`, `chayen-repository` and
  `chayen-requirements` have none in `tests/evaluation/provider-probes.json`
  or `tests/evaluation/step40/discovery-probes.json`;
- include the 8 engineering and 6 documentation-overlap probes from Step 40,
  so that writing-skill capture is measured (P1-015);
- include negative probes for Nitro and Elysia once K-03 is applied;
- have every expected set reviewed and frozen, with the probe-file hash
  recorded, before the first scored run.

### 4.4 Model versions, plugin fingerprint and repeatability

| Requirement | Rule |
|---|---|
| Measured artifact | The **frozen candidate** (`0.1.0-rc.1`), installed natively from its marketplace into an isolated config home, which is the same mechanism users run. `--plugin-dir` runs are diagnostic only and do not count toward G-09 or G-10 |
| Plugin fingerprint | Every summary records: the candidate commit SHA; the version; the **metadata fingerprint** (SHA-256 over sorted Skill names and `description` lines, first 16 hex characters, as computed in `tests/evaluation/run-provider-probes.mjs`); a **package fingerprint** (SHA-256 over every file in `plugins/codejadee-chayen-framework/`); and the probe-file hash. The installed copy in the host's plugin cache must match the package fingerprint |
| Fingerprint validity | Results count only for the fingerprint they were measured on. Any `SKILL.md` description change resets G-09 and G-10 to BLOCKED (baseline matrix rule 3). Baseline fingerprint `86cf548cda5b08d5` is expected to change after K-03 and K-04, so routing is measured only after those land |
| Host and model | Each summary records the CLI version, the model identifier reported by the host for every run, and any reasoning or effort setting. Pin the model where the CLI allows it. Where it does not, record the host default and treat a model change as a new configuration. Runs are pooled only when CLI version, model, fingerprint and probe-file hash are all identical |
| Repetitions | ≥ 3 independent runs of every probe on every CLI. Each run is a fresh, non-persistent session in an isolated config home, against an identical fixture copy that is checked unchanged afterwards |
| Baseline arm | A no-plugin arm runs on every CLI for the no-match and negative probes, so that "native behaviour unchanged" has a comparison point |
| Completeness | All runs are kept. No run is discarded or selectively re-run. A run that produced no result because of a provider or infrastructure error (for example HTTP 503) may be re-run once. Both attempts are recorded and only the re-run is scored. Any other failure counts as a failure |
| Rescoring | Offline rescoring (`--rescore`) is allowed only with versioned scoring rules, and the original summary is kept |
| Reporting | Per CLI: counts and rates for each case type, a Wilson 95% interval, a per-Skill breakdown, unstable probes (mixed outcomes across runs), and cost. Claims in user docs cite only these summaries, with their CLI and model versions |
| Claim lifetime | A PASS covers the recorded CLI and model versions. User docs state "measured on <CLI version>, <date>". A new release re-measures |
| Tooling preconditions (K-13) | Today, `run-provider-probes.mjs` supports only `claude` and `copilot`, loads the plugin with `--plugin-dir`, and records neither the package fingerprint, the commit nor the probe-file hash. `tests/routing/run-smoke.mjs` supports Codex with an installed plugin, but only for its smoke set. Codex authentication was not portable to an isolated home in the 2026-10-14 run, so the Codex procedure needs an isolation plan approved before the run |

### 4.5 Additional thresholds: proposed, not approved

Only the ≥ 85% automatic threshold is an owner decision. Everything below
is a **proposal** for the owner's review (OD-05). G-09 and G-10 cannot PASS
until each proposed threshold is approved, changed or explicitly dropped.

| ID | Metric | Proposed threshold | Origin |
|---|---|---|---|
| PT-01 | Explicit invocation, per CLI | 100% | Step 40 instruction (editorial evaluation, D-057). Proposed here for all 15 Skills |
| PT-02 | Wrong-Skill rate, per CLI | ≤ 5% of all automatic runs | Step 40 instruction (editorial evaluation, D-057). Proposed here for the whole release |
| PT-03 | No-match: no Chayen Skill selected | ≥ 95% of no-match runs, per CLI | New proposal. Historical 12/12, Claude Code only, 13-skill build |
| PT-04 | Negative: no out-of-set Chayen Skill selected | ≥ 90% of negative runs, per CLI | New proposal. Copilot activated Skills on Unity and SwiftUI prompts in the 6-skill build (KL-25) |
| PT-05 | Per-Skill floor | No Entry Skill below 2/3 automatic success on its own positive probes, per CLI | New proposal. Stops an 85% aggregate from hiding a dead Skill, such as the historical Next.js route at 0/5 |
| PT-06 | Minimum sample | ≥ 60 scored positive runs per CLI (for example 20 probes × 3 runs) | New proposal. At 51/60 the 95% Wilson interval is about 74%–92% (HUMANIZER_EVALUATION_RUBRIC §1) |

## 5. Licence and distribution rights

### 5.1 Approved choice

The project licence is **MIT** (OWN-02), and the publisher is **CodeJaDee**
(OWN-03). After the candidate is frozen:

- a root `LICENSE` contains the MIT text;
- both manifests carry `"license": "MIT"`, with identity parity kept
  (IC-05, V-04);
- the upstream notice stays in
  `chayen-humanizer-en/references/upstream-notice.md`.

### 5.2 Rights verification

**This is not legal advice.** The question checked was whether the
repository holds the rights to distribute everything it contains under MIT.

| Area | What the repository shows | Result |
|---|---|---|
| Authorship | All 37 commits come from one GitHub account (one with a local identity, one through the GitHub web UI). There are no other contributors. | No third-party contributor rights to clear. |
| Copyright holder | There is no record of a copyright holder, no assignment to CodeJaDee and no contribution terms. `LICENSE_PROPOSAL.md` already notes that `CodeJaDee` is unconfirmed as a legal entity. | **Not determinable from the repository.** Publisher (OWN-03) and copyright holder are separate facts. The `Copyright (c) <year> <holder>` line for `LICENSE` needs owner input (OD-03). |
| AI-assisted content | Much of the content was drafted with an AI assistant under the owner's direction (LICENSE_PROPOSAL item 2). | Whether the owner's organisation permits licensing it is unconfirmed (OD-03). |
| Adapted MIT material | `chayen-humanizer-en` adapts the method and taxonomy of humanizer (MIT, Copyright (c) 2025 Siqi Chen). The notice ships with the skill. On 2026-10-17 it was compared byte for byte with upstream's `LICENSE` and matched. | Compatible with MIT redistribution **if the notice stays with the material**. No automated guard exists yet (K-05). |
| Indirect upstream source | humanizer states it is based on Wikipedia's "Signs of AI writing". Wikipedia text is under a share-alike Creative Commons licence. The notice says all examples, signal lists and procedures were written for this skill and the upstream file is not reproduced. | Phase 1 did not compare the text against the Wikipedia page. **Limitation:** reproduced share-alike text is not ruled out by evidence. The owner may want a review before the public release. |
| Referenced standards and vendor docs | OWASP, vendor documentation and Google and Microsoft style guides are cited by name and URL (16 external URLs in the package, baseline E-02). | References, not copies. No systematic check for verbatim excerpts was run. |
| Developer fixtures | `tests/**/fixture` contains code written for the repository. No `node_modules` and no third-party `LICENSE` files are present. Dependencies are named in `package.json` files and are not vendored. | No vendored third-party code found. |

**Conclusion.** No evidence was found of content that cannot be distributed
under MIT. Positive ownership evidence is missing, though: the
copyright-holder identity, its relationship to CodeJaDee, and the
organisation's position on AI-assisted content.

G-15 therefore records the rights confirmation as BLOCKED on owner input.
This document does not state any legal fact that the repository does not
show.

## 6. Remaining owner inputs

These are needed to close gates. They are not re-confirmations of §1.1.

| ID | Input | Blocks |
|---|---|---|
| OD-01 | Security and support decision (§1.2): reporting channel, scope, response expectation, support path | G-16. Also repository visibility and any public tag |
| OD-02 | Tag format (OPEN-01). Recommendation: ADR-0008 `vX.Y.Z` | G-05 |
| OD-03 | Copyright-holder line for `LICENSE`, its relationship to CodeJaDee, organisational permission for AI-assisted content, and contribution terms | G-15 |
| OD-04 | Nitro and Elysia implementation option: (a) remove them and list them in "Not for", or (b) keep general Node guidance without naming them. Recommendation: (a) | G-02 |
| OD-05 | Proposed routing thresholds PT-01..PT-06, and the installed-plugin measurement rule (§4.4) | G-09, G-10 |
| OD-06 | Humanizer rubric, language threshold and critical-failure rule (ADR-0011 item 3, D-057), reviewer roster (two fluent reviewers per language plus an adjudicator), and the mandatory independent-case share | G-11 |
| OD-07 | Translation-direction scope, TH→EN (P1-032) | G-11 |
| OD-08 | Engineering capability and workflow sample, or formal acceptance of the IMPLEMENTED bar | G-12 |
| OD-09 | Any fact checks the owner accepts as NOT_RUN, listed explicitly | G-13 |
| OD-10 | Authorization for billed provider runs, isolated host profiles, test identities, and installing Copilot CLI ≥ 1.0.91 | G-06..G-14 |
| OD-11 | Ratification of the release-related decisions in §3.4: D-009/DF-03, ADR-0003, ADR-0007 | G-01, G-10, G-14 |
| OD-12 | Per-act publication authorization (§1.4) | G-17 and the release itself |
| OD-13 | Confirm that K-01..K-20 match the 20 KEEP items in Plan v4, which is not stored in the repository | Traceability only. No gate |
