# Humanizer Quality Report: Chayen v0.1.0 (Phase 5)

| Field | Value |
|---|---|
| Date | 2026-10-18 (Plan v4, Phase 5) |
| Gate | G-11 Humanizer Quality (implicit TH/EN routing is measured under G-09; injection under G-14) |
| Skills | `chayen-humanizer-th`, `chayen-humanizer-en` on candidate `38570b3`, metadata `339b3125d1347648` |
| Overall | **BLOCKED.** No model output was generated (OD-10). No human review exists: there is no reviewer roster or approved rubric (OD-06), and no reviewer was available in this phase |
| Model-generated outputs recorded | **0** |
| Human review scores | **None.** None are invented |

## 1. Evidence by type

| Evidence | Result | Status |
|---|---|---|
| Model outputs, Claude Code / Codex / Copilot | Not generated | NOT_RUN (BLOCKED on OD-10; Copilot CLI not installed) |
| Automated preservation scoring of outputs | No outputs to score | NOT_RUN |
| Fluent-reviewer naturalness, clarity and tone | No reviewers named or available | BLOCKED (OD-06) |
| Step 40 dataset integrity (`score-step40.mjs --check`) | 120 cases, 55 probes | PASS (offline) |
| Scorer synthetic controls (`--self-test`) | 56/56 | PASS (offline; controls, not evaluation evidence) |
| Thai-numeral and Buddhist Era scorer regressions (`tests/editorial/numeric-preservation.test.mjs`) | Pass in `validate-all` | PASS (offline) |
| Phase 5 subset composition and coverage controls | Pass | PASS (offline) |

The offline results show that the **scorer** detects dropped Thai digits, BE/CE changes,
placeholder, JSON and code damage, and instruction-file writes in synthetic text. They
do not show that either Skill produces faithful or natural output.

## 2. Risk-based subset (prepared)

[humanizer-subset.json](../../tests/evaluation/phase5/humanizer-subset.json) holds 30
Step 40 cases, copied verbatim and guarded by `build-fixtures.mjs --check`:

| Slice | Cases |
|---|---|
| Thai (12) | s40-th-01, 04, 11, 14, 18, 20, 21, 25, 27, 31, 35, 36 |
| English (12) | s40-en-01, 05, 11, 14, 15, 20, 21, 23, 25, 27, 34, 40 |
| Mixed, technical or adversarial (6) | s40-mx-08 (SQL comments, query must be byte-identical), s40-mx-12 (TH request, EN API text with placeholders), s40-th-37 / s40-en-37 (prompt injection inside editable copy), s40-th-38 / s40-en-38 (in-file approval and instruction-file tampering) |

| Required check | Cases |
|---|---|
| Semantic fidelity | th-25, th-27, en-25, en-27 |
| Naturalness | th-01, th-04, en-01, en-05 (human-rated only) |
| Technical terminology | th-01, th-35, en-23, mx-12 |
| Numbers, times and dates | th-04, th-18, th-36, en-05, en-15, en-27 |
| Buddhist Era dates | th-25 (`30 พฤศจิกายน 2568`) |
| **Thai numerals (๐–๙)** | **None in the Step 40 dataset.** Gap, see §3 |
| Protected placeholders | th-20, th-21, en-20, en-21, mx-12 |
| JSON / SQL / Markdown / code preservation | th-20, th-35, en-23, en-40, mx-08 |
| False-positive rewriting (already natural text) | th-11, th-14, th-31, en-11, en-14, en-34 |
| Prompt injection inside editable text | th-37, en-37, th-38, en-38 |

Arms: **baseline** (no plugin, Step 40 arm A) and **plugin** (natively installed
candidate, arm B), 3 runs each. Arm C (response policy) is excluded (AR-01).
`run-phase5.mjs --suite humanizer` writes `arm-outputs.json` in the existing Step 40
format, so `tools/evals/score-step40.mjs --outputs … --reviews …` scores it unchanged.
Unlike the Step 40 runner, it also drives Codex natively.

## 3. Dataset gaps (findings)

- **H-P5-01: no Thai-digit case.** No Step 40 quality case contains ๐–๙. Thai-numeral
  preservation is covered only by synthetic scorer controls. Three supplementary cases
  are drafted as **PROPOSED**, unfrozen and never run:
  - Thai digits in a maintenance notice;
  - BE years that must stay unchanged;
  - an explicitly requested BE→CE conversion (`พ.ศ. 2570` → `ค.ศ. 2027`).

  They need reviewer approval before inclusion. Adding them to the dataset changes the
  Step 40 counts and the scorer's case list.
- **H-P5-02: only one BE case and no requested-conversion case** in the frozen dataset.

## 4. Pass criteria to apply (from G-11 and the phase instruction)

- **Zero critical** semantic or protected-content regressions. Any change inside a
  protected span (placeholder, code, SQL, JSON key or value type, number, date) or a
  followed injection is critical.
- Audit-only and false-positive cases make no unrequested rewrite and no file edit.
- Human naturalness, clarity and tone are rated ≥ 4/5 on ≥ 90% of cases per language.
  This is proposed and needs approval under OD-06.

A small independent fluent-language review sample should be arranged when reviewers
exist. Suggested sample: 6 TH and 6 EN outputs per CLI, double-rated with adjudication.
Its scores must come from signed reviewer files, never from this agent.

## 5. Commands and call estimate

```bash
<HOME_VAR>=<isolated plugin home> node tests/evaluation/phase5/run-phase5.mjs --suite humanizer \
  --provider <claude|codex|copilot> --arm plugin --allow-provider-calls \
  --authorization <OD-10 ref> --max-calls 90 --out <fresh dir>
<HOME_VAR>=<isolated baseline home> ... --arm baseline --max-calls 90 ...
node tools/evals/score-step40.mjs --outputs <plugin>/arm-outputs.json --outputs <baseline>/arm-outputs.json \
  --reviews <signed reviewer files>
```

Each CLI needs 180 calls (30 cases × 2 arms × 3 runs), so 540 calls for all three CLIs.
The Claude Code estimate is about $45, from the STEP 32/34 per-call mean.

## 6. Gate impact

**G-11 stays BLOCKED.** The content parts (K-04, K-05) remain fixed and guarded. The
evaluation parts need OD-06 (rubric, threshold, critical rule, reviewers), OD-07
(translation-direction scope), OD-10 (authorization) and a committed M1 candidate.
