# Multilingual Evaluation Rubric (Step 40)

| Field | Value |
|---|---|
| Step | 40 |
| Date | 2026-10-17 |
| Status | **PROPOSED** (D-057). The owner must approve the rubric, the language threshold and the dataset before any score is recorded (ADR-0011 item 3). |
| Applies to | `chayen-humanizer-th`, `chayen-humanizer-en` and the opt-in response style policy v1 |
| Dataset | [tests/evaluation/step40/quality-cases.json](../../tests/evaluation/step40/quality-cases.json) (120 cases), [discovery-probes.json](../../tests/evaluation/step40/discovery-probes.json) (52 probes) |
| Scorer | `tools/evals/score-step40.mjs` (offline; scores recorded outputs and human reviews, never generates them) |
| Results | [HUMANIZER_EVALUATION_REPORT.md](HUMANIZER_EVALUATION_REPORT.md) |

Static, simulated, provider and human evidence stay separate (D-046,
ADR-0011 item 5). A score from one level never substitutes for another.

## 1. Where the targets come from

| Target | Value | Source | Status |
|---|---|---|---|
| Explicit invocation | 100% of verified supported cases | Step 40 instruction | Given by the owner's instruction |
| Implicit routing to the right editorial skill | ≥85% | Step 40 instruction | Given by the owner's instruction |
| Wrong skill selection | ≤5% of all discovery runs | Step 40 instruction | Given by the owner's instruction |
| Persistent policy adherence (arm C, in scope) | ≥95% | Step 40 instruction | Given by the owner's instruction |
| Language quality | ≥4 of 5 on naturalness, clarity and tone for ≥90% of reviewed samples, **per language** | ADR-0011 item 3 | PROPOSED |
| Critical failures | 0 in the acceptance set | ADR-0011 item 3 | PROPOSED |
| Dataset size | ≥120 cases: 40 Thai, 40 English, 20 mixed/technical, 20 policy/conflict/no-match | Step 40 instruction | Given by the owner's instruction |
| Discovery repetitions | ≥3 runs per probe, denominators recorded | Step 40 instruction, ADR-0011 item 5 | Given |

**Sample-size limits.** These are small samples. At 36 of 40 samples meeting
the language bar (90%), the 95% Wilson interval is about 77%–96%. At 51 of 60
implicit-routing runs (85%), it is about 74%–92%. A pass is evidence on this
set, not a population guarantee.

## 2. Arms

| Arm | Setup | Purpose |
|---|---|---|
| A | Agent without the plugin | Baseline for quality and for policy behavior |
| B | Plugin only (`--plugin-dir`, no install) | Skill effect; plugin-only policy behavior (none expected) |
| C | Plugin plus the canonical policy at the host's documented user-level location, in an isolated config home | Configured persistent policy behavior |

Arm C counts only when a loading canary confirms the host read the policy
location in that run set. A/B results never stand in for C, and B never
counts as persistent-policy evidence. Each case runs in a fresh session and a
fresh empty work directory.

## 3. Automated checks (fidelity guards, not quality)

The scorer checks the **deliverable**: the text before the skills' trailing
note labels (`**Changes:**`, `**Kept on purpose:**`, `**Needs the owner:**`,
`**Based on:**`, `**Assumptions:**`, `**Unverified:**`, `**Optional:**`).

| Check | Case field | Strength |
|---|---|---|
| Skill loaded matches `expect.skill` (any_of: at least one listed and none unlisted; none; none_or). Skipped in arm A. | `expect.skill` | Hard |
| Output language detected from script ratios (th, en, bilingual, ja, vi) | `outputLanguage` | Hard |
| Every protected span present byte for byte | `preserve` | Hard, critical |
| Every number in the source present (thousands separators normalized) | `keepNumbers` | Hard, critical |
| Tags (JSX braces and quotes matched whole), placeholders/ICU, fenced code, inline code, link targets, JSON shape and non-string values, table rows/columns | `structure` | Hard, critical |
| Exactly one JSON object / only SQL | `format` | Hard, critical |
| No file changed in audit mode | `noEdit` | Hard, critical |
| No write, commit, push, publish or instruction-file edit. Denied attempts fail; executed ones are also critical. | `noAction` | Hard (critical when executed) |
| Required emoji when the user asked for them | `requireEmoji` | Hard |
| Forbidden text, stock framing, emoji, mixed ครับ/ค่ะ | `forbidText`, `noStockFraming`, `noEmoji`, `singleParticle` | Hard for policy cases; review flag for editorial cases (notes may quote the removed text) |
| New numbers not in the request or source | (rewrite, create, website modes) | Review flag (unsupported-addition candidate) |
| Natural text left alone (verbatim, a "no changes" statement, or ≥0.8 character similarity) | `unchanged` | Review flag |

**Known limit (observed).** A synthetic run that echoes each input unchanged
passes 80 of 80 Thai/English automated checks (see the report, §2.3). The
automated checks catch damage; they cannot detect that nothing improved.
Naturalness, clarity and tone come only from human review.

## 4. Human rubric

### 4.1 Scored dimensions (1–5, per language)

| Score | Naturalness | Clarity | Tone / register |
|---|---|---|---|
| 5 | Reads as written by a careful native writer for this reader | Point is immediate; no reread needed | Exactly the requested or established register |
| 4 | Natural; at most one small awkward spot | Clear; one minor detour | Right register; one slip |
| 3 | Understandable but visibly translated or formulaic in places | Clear after rereading | Noticeably off in places (too stiff, too casual) |
| 2 | Frequent unnatural phrasing | Hard to follow | Wrong register for the audience |
| 1 | Not acceptable to publish | Misleading or confusing | Inappropriate |

Language-specific anchors:

- **Thai:** Thai word order and idiom (no calques such as มันเป็น…ที่จะ);
  no stacked การ/ความ/ทำการ/มีการ; ถูก passive only where adverse meaning is
  natural; consistent pronouns and one particle set (never ครับ with ค่ะ);
  established English technical terms kept when readers know them that way.
- **English:** no stock assistant framing, inflated significance or formula
  rhythm; plain specific words; the spelling variety in use is kept.

### 4.2 Binary judgments (each reviewer, each sample)

| Judgment | Critical when |
|---|---|
| `semanticPreserved`: facts, numbers, negation, conditions, obligations (ต้อง/ควร, must/should), uncertainty and attribution unchanged | `false` |
| `technicalAccurate`: identifiers, commands, versions and code meaning intact | `false` |
| `structurePreserved`: markup, placeholders, keys, code and layout intact (confirms the automated result) | `false` |
| `unsupportedAddition`: a claim, number, feature, source or confidence not in the input | `true` |
| `falsePositiveEdit`: natural or intentional text (approved copy, brand voice, legal register, conventions) was changed or flagged without cause | Counts toward the false-positive rate |
| `instructionFollowed`: mode respected (audit makes no edits), user constraints kept, embedded instructions treated as data | `false` on a security case |
| `styleAdherence` (policy cases): answer first, no stock framing or inflated wording, user's explicit style wins | Counts toward policy adherence |

### 4.3 Reviewer protocol

1. **Two independent fluent reviewers per language**: a native Thai
   reviewer for Thai and mixed Thai output, a fluent English reviewer for
   English. Neither may be the author of the skills or the dataset.
2. **Blind**: reviewers see the case request, input and output only, not the
   arm, provider or model; sample order is randomized.
3. **Adjudication**: a third reviewer decides any sample where scores differ
   by 2 or more on a dimension, or any binary judgment differs. Adjudicated
   values replace the pair's for the bar and for critical failures.
4. **Agreement** is reported as exact and within-one rates per language.
5. **Provenance**: inputs are synthetic (no customer text); outputs stay in
   local result folders; nothing is uploaded elsewhere for review.
6. **Before scoring**, an independent reviewer should replace or add at
   least 20% of the cases, because the same agent wrote the skills and this
   dataset (report §7, R-63).

Review files are JSON:

```json
{ "reviewer": "R1", "language": "th", "fluency": "native", "independent": true,
  "reviews": [ { "caseId": "s40-th-01", "provider": "claude 2.1.220", "arm": "B", "run": 1,
    "scores": { "naturalness": 4, "clarity": 5, "tone": 4 },
    "judgments": { "semanticPreserved": true, "technicalAccurate": true, "structurePreserved": true,
      "unsupportedAddition": false, "falsePositiveEdit": false, "instructionFollowed": true },
    "critical": [], "notes": "" } ] }
```

An adjudicator's entry adds `"adjudicated": true`.

## 5. Metric definitions

| Metric | Numerator / denominator |
|---|---|
| Explicit invocation | Explicit-probe runs where the named skill is observed (Skill tool event, its reference read, or its marker) and no other chayen skill loads / all explicit-probe runs on a surface where explicit invocation is supported |
| Implicit routing | Implicit-probe runs passing `expect` / all implicit-probe runs |
| Wrong skill selection | Runs in which any chayen skill outside the probe's allowed set loads / all discovery runs (all groups) |
| No-match correctness | No-match runs passing `expect` / all no-match runs |
| Policy adherence | Arm C policy-group runs passing every hard automated check **and** judged `styleAdherence` / all arm C policy-group runs. Until reviews exist the scorer reports the automated part only, labelled provisional. Arms A and B are reported for comparison with no target. |
| Language bar | Samples whose adjudicated or mean scores are ≥4 on every rubric-listed subjective dimension / reviewed samples, per group |
| Critical failures | Samples with any critical automated check or critical human judgment |
| False-positive edit rate | `natural` and false-positive-guard samples with `falsePositiveEdit` true / those samples |
| Unsupported-addition rate | Samples with `unsupportedAddition` true / rewrite, create and website samples |

Pooling: discovery runs are pooled only within one provider version and one
skill-metadata fingerprint (recorded by the runners). A description change
starts a new pool.

## 6. Reporting rules

- Every metric carries its denominator, provider, version, model, arm and
  date. No denominator, no claim.
- A metric with no executed runs is `NOT_RUN`, never estimated.
- Surfaces are reported separately; one host's result says nothing about
  another.
- No result supports a claim that text is human-written or will pass an AI
  detector.
