# Chayen Evolution — Routing and Context Impact Report (Step 18)

- **Date:** 2026-10-23
- **Decision:** D-075 (owner's STEP 18 instruction)
- **Question:** does removing the Entry Skill and metadata caps (D-066,
  [ADR-0013](../ADRS/ADR-0013-extensible-skill-governance.md)) silently
  degrade automatic Skill discovery?
- **Package measured:** `chayen` 1.1.2, 16 Skills, metadata fingerprint
  `411b6adbbea7e121` (HEAD `2ec81f9` plus uncommitted Step 17 and 18 work).
- **Plan and log:** [MASTER_PLAN.md](MASTER_PLAN.md),
  [STEP_LOG.md — Step 18](STEP_LOG.md#step-18--routing-and-context-benchmark)
- **Harness:** [`tests/evaluation/routing-context/`](../../../tests/evaluation/routing-context/README.md);
  static results in
  [`results/2026-10-23-static/report.md`](../../../tests/evaluation/routing-context/results/2026-10-23-static/report.md)

## 1. Answer

**The routing half of the question is unanswered.** No provider was called,
so there is no routing accuracy, no-match rate or provider token count for
any CLI. Each is `NOT_RUN` below, and none is estimated.

What this step does establish:

1. **Validation does not cap the count.** Packages with up to 34 Skills
   (16 shipped plus 18 synthetic) pass the real package, catalog and
   security validators in disposable copies. Nineteen synthetic Skills
   take part in valid scenarios.
2. **The context tax grows linearly, and one provider figure is already
   close.** Each added Skill costs its name plus description on every
   turn: 235 characters (about 59 tokens, estimated) per synthetic Skill,
   410 per shipped Skill. Codex documents an 8,000-character listing figure
   for when the context window is unknown. The shipped package leaves
   1,437 characters of headroom. That is about three more Skills of the
   current average size, and the 24-Skill scenario already exceeds it.
3. **The static collision check misses semantic collisions.** The
   description-overlap check (V-07b) rejects copy-paste duplicates (overlap
   0.925 and 0.958). It does not flag adjacent Skills (0.031 to 0.164), or
   a paraphrased duplicate of `chayen-testing` (0.031). A package can pass
   every static check and still route ambiguously. Only provider runs can
   show this.
4. **The measurement is ready.** It has fixed expected outcomes for 74
   routing cases across six scenarios, classification from native
   activation events only, summaries per provider configuration with no
   pooled rows, and context-tax fields. It is checked offline by G-27 and
   G-27T, and 16 of 16 control weakenings were caught.

Until provider runs exist, a larger Skill inventory must not be described as
discoverable on any CLI.

## 2. Routing accuracy per CLI

The 85% automatic-routing objective (OWN-05) is kept unchanged. It applies to
each supported CLI separately, never to pooled results.

| CLI | Correct | Missed | Wrong | Multiple unexpected | Explicit | No-match | Unsupported | Ambiguous | Status |
|---|---|---|---|---|---|---|---|---|---|
| Claude Code | — | — | — | — | — | — | — | — | NOT_RUN |
| Codex | — | — | — | — | — | — | — | — | NOT_RUN |
| GitHub Copilot CLI | — | — | — | — | — | — | — | — | NOT_RUN |

**Why NOT_RUN:**
- billed calls need the owner's authorization and a call cap;
- each provider and arm needs its own signed-in isolated home;
- installing a synthetic test package into those homes needs owner
  approval;
- the Codex activation signal still needs an unscored pilot (EG-02, EG-03,
  EG-21).

**Size of a full run:** 2,385 billed calls, from `--plan`. That is 3 runs of
every applicable case on 3 CLIs, over five installable scenarios and one
no-plugin arm. On Claude Code alone that is 795 calls, about $199 at the
Phase 5 planning figure of $0.25 per routing call.

The historical STEP 32 provider results (Claude Code 2.1.270, 13-Skill
package) stay in [EVALUATION_REPORT.md §4](../EVALUATION_REPORT.md). They are
not evidence for this package.

## 3. Required coverage and how each item is measured

| Item | Measure (per configuration) | Where | Status |
|---|---|---|---|
| Correct Skill selection | `CORRECT`: an expected Skill loaded, nothing outside the expected and allowed sets | `classifyCase`, `selection.correct` | Scorer tested; provider NOT_RUN |
| Missed selection | `MISSED` (no Chayen Skill), plus `NEIGHBOUR_ONLY` (only an allowed neighbour loaded) | `selection.missed`, `selection.neighbourOnly` | Scorer tested; provider NOT_RUN |
| Wrong Skill selection | `WRONG_SKILL` (only out-of-set Skills); `CORRECT_PLUS_UNEXPECTED` reported separately; forbidden Skills counted | `selection.wrong`, `selection.forbiddenLoaded` | Scorer tested; provider NOT_RUN |
| Multiple unexpected Skills loaded | Runs with two or more Skills outside the expected and allowed sets | `selection.multipleUnexpected` | Scorer tested; provider NOT_RUN |
| Explicit invocation | Native syntax per CLI; loaded only on a native event or a Skill-local reference read; the answer text never counts | `explicit` | Scorer tested; provider NOT_RUN |
| No-match behaviour | 5 general requests; no Chayen Skill may load; measured with and without the plugin | `noMatch`, `baseline.noMatch` | **NOT_RUN** |
| Unsupported frameworks | 4 cases (Nitro, Rust Axum, SwiftUI, Flutter), copied verbatim from Phase 5 | `unsupported` | **NOT_RUN** |
| Ambiguous requests | Repository inspected before any Skill choice | `ambiguous` | Scorer tested; provider NOT_RUN |
| Boundary exclusions | 4 requests that a synthetic Skill's "Not for" clause excludes; nothing loads, or only the production owner | `negativeBoundary` | Scorer tested; provider NOT_RUN |
| Regression of shipped Skills | One Phase 5 core prompt per shipped Skill (16), rerun with every scenario installed | `byType.regression` | Scorer tested; provider NOT_RUN |
| Collision split | For conflict cases, which of the colliding Skills each run chose | `conflictSplit` | Scorer tested; provider NOT_RUN |

Production routing on the shipped package uses the existing Phase 5 runner.
`run-phase5.mjs --score` now adds the same breakdown and context tax under
`routingImpact`.

## 4. Collision scenarios

All Skills are synthetic and are built only in disposable copies under the
OS temp directory. The production package fingerprint is checked unchanged
before and after every build (G-27T).

| Scenario | Skills | What it tests | Expected static outcome | Observed |
|---|---|---|---|---|
| SC0-production | 16 | Reference point | All validators pass | AS_EXPECTED |
| SC1-distinct | 24 | 8 Skills with unrelated scopes (game mods, firmware, LaTeX, GIS, audio DSP, VBA, ROS 2, Solidity) | All pass | AS_EXPECTED |
| SC2-adjacent | 30 | Plus 6 Skills that use a shipped Skill's terminology (GraphQL/backend, seed data/data, Storybook/frontend, k6/performance, Helm/devops, changelog/documentation) | All pass | AS_EXPECTED |
| SC3-overlap | 34 | Plus 4 Skills with overlapping but valid boundaries (OpenAPI linting and API mocks; feature flags and implementation; accessibility audits and frontend) | All pass | AS_EXPECTED |
| SC4-semantic-conflict | 25 | SC1 plus a paraphrased duplicate of `chayen-testing` | All pass, **and the lexical check misses the conflict** | AS_EXPECTED (overlap 0.031) |
| SC5-lexical-conflict | 27 | SC1 plus GraphQL and two near-copies | Package fails on exactly two V-07b pairs; never installed | AS_EXPECTED (`chayen-data`/`chayen-syn-sql-tuning` 0.925; `chayen-syn-graphql`/`chayen-syn-graphql-schema` 0.958) |

Two synthetic names contain digits (`chayen-syn-k6-scripts`,
`chayen-syn-a11y-audit`). The Skill name rule allows digits, but the Phase 5
transcript patterns accepted only `chayen-[a-z-]+`. On Codex, such a Skill's
activation and reference reads would never have been detected. The patterns
are fixed, and a regression test covers them.

**Reproducibility.** Each scenario's expected outcome is in
`synthetic-skills.json`, and each case's expected selection is in
`routing-cases.json`. Both were written from the Skills' stated scopes
before any proxy result existed. `--static` checks every scenario against its
expectation; a missing, extra or undetected distinctness error makes it
`UNEXPECTED`. The committed report is regenerated byte for byte by G-27T.

**Not tuned to lexical matching.** Eight positive prompts are paraphrases
that share at most one word with the expected description, which the
specification check enforces. The SIMULATED lexical proxy picks the
expected Skill for 56–71% of keyword prompts and 0–12.5% of paraphrases.
A router, or a description edit, tuned to word overlap would show up as
that gap.

## 5. Context tax

### 5.1 Discovery metadata on every turn (static; tokens estimated as characters / 4)

| Scenario | Skills | Characters | Est. tokens | Added to production | Codex 8,000-character figure | Claude Code | Copilot |
|---|---|---|---|---|---|---|---|
| SC0-production | 16 | 6,563 | 1,641 | — | Within (headroom 1,437) | UNKNOWN | UNKNOWN |
| SC1-distinct | 24 | 8,396 | 2,099 | +1,833 (+458) | **Exceeds** (−396) | UNKNOWN | UNKNOWN |
| SC2-adjacent | 30 | 9,802 | 2,451 | +3,239 (+810) | Exceeds (−1,802) | UNKNOWN | UNKNOWN |
| SC3-overlap | 34 | 10,800 | 2,700 | +4,237 (+1,059) | Exceeds (−2,800) | UNKNOWN | UNKNOWN |
| SC4-semantic-conflict | 25 | 8,717 | 2,179 | +2,154 (+538) | Exceeds (−717) | UNKNOWN | UNKNOWN |

- **Per-Skill contribution.**
  - Shipped Skills range from 346 to 439 characters. The largest are
    `chayen-implementation` (439, 6.7% of the shipped total),
    `chayen-frontend` (435) and `chayen-ai-engineering` (433).
  - Synthetic Skills range from 211 to 259 characters.
  - The per-Skill table for every scenario is in the static report.
- **Codex.** Its documentation says it shortens descriptions first, and may
  then omit Skills (S12). The package validator now warns (V-07) in every
  scenario above SC0. The effect on Codex routing is NOT_MEASURED.
- **Claude Code.** The documented budget is 1% of the context window
  (S7). It is UNKNOWN here because the window is not known. For
  illustration only: on a 200,000-token window, 1% is 2,000 tokens. The
  shipped estimate (1,641) fits within that; every expanded scenario
  (2,099 to 2,700) would not. This compares an estimate with a documented
  formula; it is not a measurement.
- **Copilot.** No budget is documented (UNKNOWN).

### 5.2 Per-run context tax (provider-measured)

| Measure | Source | Status |
|---|---|---|
| Actual input and output tokens | Claude `result.usage` (cache reads and writes included); Codex `turn.completed.usage` | NOT_MEASURED (no run) |
| Discovery overhead, actual | Median input tokens with the plugin minus without, on no-match, unsupported and negative cases | NOT_MEASURED |
| Estimated tokens when the provider reports none | §5.1, characters / 4; Copilot reports no usage in the parsed events | Estimate available (§5.1) |
| References loaded per task | Native reads of `skills/<name>/references/*.md` | NOT_MEASURED |
| Search and read tool calls | The Step 16 `searchReadOperations` definition | NOT_MEASURED |
| Agent completion duration | Seconds per run | NOT_MEASURED |
| Skills loaded per task | Native activation events | NOT_MEASURED |

Each of these is a field in every summary (`contextTax`). When provider
counts are missing or partial, the summary says so (`tokenSource`), and an
estimate is never presented as a measurement.

## 6. Negative behaviour

Unrelated requests must not activate Chayen. The cases:

- 5 no-match cases;
- 4 unsupported-framework cases;
- 4 boundary exclusions.

The no-match and unsupported cases apply to every scenario, including the
shipped package. They also run in a no-plugin arm, so any activation can be
compared with the same configuration without Chayen. **Status: NOT_RUN.**

On the lexical proxy, which is diagnostic only, no-match stayed at 5/5 in
every scenario. Unsupported requests ranged from 0/4 to 2/4. That shows the
proxy matches on technology words; it does not predict provider behaviour.

## 7. Changes to the evaluation tooling

| Change | Why |
|---|---|
| New `tests/evaluation/routing-context/`: synthetic Skills, routing cases, library, runner, self-test, tests, static report | Step 18 coverage |
| `run-evaluation-suite.mjs`: the pooled provider row (`providerPooled`) is replaced by one row per provider configuration (`providerByConfiguration`); a static routing-and-context section is added | Accuracy was pooled across every supplied summary, whatever its provider or model |
| `tools/evals/lexical-proxy.mjs`: the BM25 proxy is moved out of the suite unchanged | Shared by the suite and the benchmark. Rankings and threshold are identical on all 223 trigger cases (checked against HEAD) |
| `phase5-lib.mjs`: Skill-path patterns accept digits; `groupByConfiguration` | Measurement defect; grouping helper |
| `run-phase5.mjs --score`: `routingImpact` for routing runs | Same breakdown and context tax for production routing |
| `validate-all.mjs`: G-27 and G-27T | Offline gates |

The plugin, Skill guidance, catalogs and Phase 5 probe sets are unchanged.

## 8. Acceptance (owner's Step 18 criteria)

| Criterion | Evidence | Result |
|---|---|---|
| More than 16 valid synthetic Skills can be evaluated | 19 synthetic Skills in valid scenarios; SC3 validates 34 Skills (18 synthetic) in a disposable copy (G-27T) | PASS |
| New collision cases have reproducible expected outcomes | Expected outcomes are fixed in the specifications; `--static` gives AS_EXPECTED for all six scenarios; G-27T reproduces the committed report and rejects missing, extra or undetected outcomes | PASS |
| Metadata size is reported | §5.1; per scenario and per Skill in the static report; recount test | PASS |
| No-match behaviour is explicitly measured or NOT_RUN | §6: NOT_RUN for every CLI, with the cases and both arms defined | PASS (NOT_RUN) |
| Provider-specific routing quality is not fabricated | §2: every provider cell NOT_RUN. Synthetic records are `SIMULATED` and make no claim (self-test); controls "simulated records allowed to claim" and "provider routing reported as PASS" are caught | PASS |
| Existing tests pass | `validate-all.mjs`: every gate except the pre-existing G-21T line-ending failure (Step 16 log); Phase 5 26/26 | PASS, with the pre-existing exception |

## 9. Limitations

- **No routing evidence.** Static validity and the lexical proxy say
  nothing about how any model chooses Skills.
- **Synthetic Skills are short and template-bodied.** Real Skills average
  410 characters of metadata; the synthetic ones 235. Context figures for
  real growth will be higher.
- **The overlap metric is word-based.** It is useful against copied
  descriptions and blind to meaning. A semantic distinctness check would
  need a model and its own validation, and is not proposed here.
- **Case counts are small per type** (2 to 16). At 3 runs, rates per type
  carry wide Wilson intervals. Per-Skill conclusions need more cases.
- **Historical summaries cannot be fully separated.** STEP 32 summaries
  record no metadata fingerprint, so per-configuration grouping can
  separate them by provider, CLI version, model and discovered Skill count
  only.
- **Codex activation evidence is still PROPOSED** (a native read of an
  installed `SKILL.md`). It needs an unscored pilot before any Codex result
  is scored.
