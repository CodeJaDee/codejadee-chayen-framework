# Routing Evaluation: Chayen v0.1.0 (Phase 5)

| Field | Value |
|---|---|
| Date | 2026-10-18 (Plan v4, Phase 5) |
| Gates | G-09 Automatic Routing ≥ 85% per CLI; G-10 Explicit Invocation and No-match |
| Contract | [RELEASE_SCOPE_DECISION §4](RELEASE_SCOPE_DECISION.md#4-routing-evaluation-contract) |
| Overall | **BLOCKED.** No billed provider run is authorized (OD-10), so no routing accuracy exists for any CLI. G-09: FAIL → BLOCKED (preconditions implemented; see §7). G-10: BLOCKED |
| Provider calls made | **0** |

## 1. Result by provider

| Provider | CLI version observed | Automatic routing accuracy | Explicit invocation | Negative / no-match | Status |
|---|---|---|---|---|---|
| Claude Code CLI | 2.1.302 (`--version` only) | **NOT MEASURED** | NOT_RUN | NOT_RUN | BLOCKED: OD-10 authorization and budget; OD-05 expected-set review |
| Codex CLI | 0.163.0 (`--version` only) | **NOT MEASURED** | NOT_RUN | NOT_RUN | BLOCKED: as above, plus review of the Codex activation signal on an unscored pilot |
| GitHub Copilot CLI | Not installed (ENOENT) | **NOT MEASURED** | NOT_RUN | NOT_RUN | BLOCKED: as above, plus installing CLI ≥ 1.0.91 |

No result is pooled, estimated or carried over. Historical routing results
(for example 12/22 on the 13-Skill build) were measured on other metadata
fingerprints and are not evidence for this candidate.

The lexical proxy in `run-evaluation-suite.mjs` (SIM top-1 0.5) is printed by the
offline suite and is **not** evidence of model-driven Skill selection.

## 2. Frozen candidate

| Field | Value |
|---|---|
| Candidate commit | `38570b3a83cb5181e15f12daef921653bc0add36` (`main`, equal to `origin/main`, no tag) |
| Plugin / version | `chayen` / `0.1.0-rc.1` (both manifests and the Copilot marketplace entry) |
| Skill metadata fingerprint | `339b3125d1347648`, unchanged from Phase 4, so no Phase 4 evidence is invalidated by metadata |
| Package fingerprint, committed bytes (LF) | `efc4c6e6567a4ce3bb0b2733d4bbe6194677b9cf0d77c47b26f6959b55fcd85d` |
| Package fingerprint, Windows `core.autocrlf=true` checkout | `9e5705fe32b19799d24ca9b671793fc54159943b0a6c12758b45f73d2c2833eb`, equal to the Phase 4 native-tested snapshot |
| Line-ending-normalized content | `d5e9a80e505b2411e7e4e732ab98102bb45563608d6a915da7b25c8655603626` for both. The two fingerprints differ **only** by line endings (214 of 256 files are CRLF on this checkout) |
| Record | [candidate.json](../../tests/evaluation/phase5/results/2026-10-18-phase5/candidate.json) |

**Finding R-P5-01 (process).** Phase 4's package fingerprint hashes raw bytes, so it
depends on the checkout's line-ending setting. A remote marketplace install or a
non-Windows clone receives the committed LF bytes, which hash to `efc4c6e6…`, not to
the Phase 4 value. Phase 5 accepts both values and labels each one. Before runtime
evidence is credited, the owner should choose the canonical one. The committed-bytes
value is recommended, because it is platform-independent.

**Finding R-P5-02 (freeze status).** The RC.1 content is committed, but this is not a
formal M1 freeze. G-04 remote CI and the G-15 `LICENSE` file and manifest `license`
field are still missing. Adding `license` to the manifests changes the package
fingerprint but not the Skill metadata fingerprint. If it lands after M1, it resets
G-06..G-14. Landing it **before** billed Phase 5 batches avoids paying for runs twice.

## 3. Evaluation fixture (prepared, frozen pending OD-05)

[routing-probes.json](../../tests/evaluation/phase5/routing-probes.json) is generated
by `build-fixtures.mjs`. It copies every prompt and expectation **verbatim** from
reviewed sources (`tests/skills/trigger-cases.json`,
`tests/evaluation/provider-probes.json`, `tests/evaluation/step40/discovery-probes.json`).
`--check` fails on any drift.

| Type | Scenarios | Composition | Runs per CLI |
|---|---|---|---|
| Positive (automatic) | **44** | 30 core: exactly 2 per Entry Skill (all 15), primary stacks preferred (.NET/ASP.NET Core, EF Core, Angular, SQL Server, PostgreSQL). Plus 14 Step 40 overlap probes: 6 documentation/Humanizer and 8 engineering, including Thai-language engineering | 132 |
| Negative | **12** | Nitro, Elysia, Unity, SwiftUI, Flutter, Rust/Axum, Spring Boot, React Native, MongoDB, production penetration test, and AI-detector evasion (EN and TH) | 36 (+36 baseline) |
| No-match | **10** | General knowledge, chit-chat and conceptual questions (EN and TH), plus explicit "do not use skills" | 30 (+30 baseline) |
| Inspect-first | 1 | Ambiguous monorepo bug, reported separately | 3 |
| Explicit | **15** | One per Entry Skill, using native syntax: `/chayen:<skill>` (Claude), `$<skill>` (Codex), `/<skill>` (Copilot) | 45 |

The 22 negative and no-match scenarios exceed the 12 required. Positive, negative,
no-match and explicit metrics have separate denominators and are never merged.
Explicit runs are excluded from automatic accuracy.

**Expected sets are kept verbatim from the reviewed sources.** Some sets have a single
acceptable Skill. For example, a CSV-export prompt accepts only `chayen-implementation`.
Under §4.2, co-loading any other Chayen Skill therefore counts as wrong-Skill. Widening
a set after seeing results would be cherry-picking, so any widening must happen in the
OD-05 review **before** the first scored run.

## 4. Measurement method (implemented, offline-verified)

`run-phase5.mjs` measures the natively installed candidate, never `--plugin-dir`, in an
isolated config home. Each run gets a fresh fixture copy. Every record carries the
fields the phase requires:

| Required field | Record field |
|---|---|
| Provider, CLI version | `provider`, `cliVersion` (from `--version` in the isolated home) |
| Model identifier, configuration | `model` (host-reported per run), `modelConfig` (`--model` pin or "host default (unpinned)") |
| Plugin fingerprint | `packageFingerprint` (full installed-tree hash, checked against `candidate.json` before any call), `metadataFingerprint` |
| Prompt ID, expected, observed | `promptId`, `expectedSkill`, `observedSkills` |
| Activation evidence | `activationEvidence[]`, one entry per Skill with the native signal: Claude `Skill` tool event, Copilot `skill` tool event, or Codex read of the installed `SKILL.md` (PROPOSED). For explicit runs, a skill-local reference read or a declared marker also counts |
| Result classification, errors | `classification` (CORRECT, MISSED, WRONG_SKILL, CORRECT_PLUS_WRONG, FALSE_ACTIVATION, CORRECT_NONE, ALLOWED_OPTIONAL, EXPLICIT_LOADED/NOT_LOADED, FIXTURE_CHANGED, ERROR_NO_RESULT), `errorDetails`, `exit` |

Rules enforced in code and covered by offline controls:

- Answer text that mentions a Skill is never activation evidence.
- A `SKILL.md` read from the repository fixture is never activation evidence.
- Summaries refuse to pool providers, CLI versions, models, fingerprints or probe-file hashes.
- Every run is kept. Only an `ERROR_NO_RESULT` run may be retried, once, and the scorer
  rejects any other re-run.
- Live runs refuse to start without `--allow-provider-calls`, an `--authorization`
  reference, a `--max-calls` cap that covers the plan, and an isolated home. They also
  refuse a plugin home whose installed package fingerprint is not accepted, and a
  baseline home that contains Chayen.
- The accuracy definition is §4.3: correct relevant automatic selections ÷ all relevant
  automatic-selection attempts, per CLI, with a 95% Wilson interval, a per-Skill
  breakdown, wrong-Skill rate, unstable probes and cost.

Offline evidence: 13/13 controls pass, and two deliberate mutations were detected
([local-checks.json](../../tests/evaluation/phase5/results/2026-10-18-phase5/local-checks.json)).
Parsers were tested only on synthetic event streams. The Copilot and Codex event shapes
must be confirmed on a pilot.

## 5. Sample size and uncertainty (planned)

With 132 positive runs per CLI:

| Observed | 95% Wilson interval |
|---|---|
| 113/132 (85.6%, the minimum point estimate that meets OWN-05) | 78.6%–90.6% |
| 120/132 (90.9%) | 84.8%–94.7% |
| 121/132 (91.7%) | the smallest result whose lower bound is ≥ 85% |

The three runs of one prompt are not independent: there are 44 distinct positive
prompts. Report the per-probe outcomes and unstable probes next to the run-level rate.
OWN-05 is defined on the point estimate. The interval is reported, not substituted for it.

## 6. Reproducible commands and call estimate

The full procedure, including isolated homes, native install, the pilot and retries, is in
[tests/evaluation/phase5/README.md](../../tests/evaluation/phase5/README.md).

```bash
node tests/evaluation/phase5/run-phase5.mjs --plan --suite routing
<HOME_VAR>=<isolated plugin home> node tests/evaluation/phase5/run-phase5.mjs --suite routing \
  --provider <claude|codex|copilot> --arm plugin --allow-provider-calls \
  --authorization <OD-10 ref> --max-calls 246 --model <pinned> --out <fresh dir>
<HOME_VAR>=<isolated baseline home> ... --arm baseline --max-calls 66 ...
node tests/evaluation/phase5/run-phase5.mjs --score <results dir>
```

| Per CLI | Calls |
|---|---|
| Plugin arm (82 scenarios × 3) | 246 |
| Baseline arm (22 negative/no-match × 3) | 66 |
| **Routing total per CLI** | **312** (936 for three CLIs), plus 2–3 unscored pilot calls per CLI and at most one retry per infrastructure error |

Claude Code cost estimate: about $78 for the routing suite, based on recorded STEP 32/34
transcripts (mean $0.20–0.24 per probe, maximum $0.49). Codex and Copilot consume plan
usage or premium requests, which are estimated in calls only. The full plan is in
[plan.json](../../tests/evaluation/phase5/results/2026-10-18-phase5/plan.json).

## 7. Gate impact

- **G-09 moves from FAIL to BLOCKED.** Its FAIL was recorded against the tooling
  preconditions P1-008 and P1-015, which are now implemented and offline-verified:
  every Skill has positive probes, overlap probes are included, all three CLIs are
  supported natively, and fingerprints and the probe hash are recorded. The remaining
  parts cannot run until OD-10 authorization, OD-05 review and Copilot installation
  exist. This is **not** a routing PASS and claims no accuracy. The gate moves to PASS
  only when each CLI independently reaches ≥ 85% on this frozen fingerprint with the
  OD-05 approvals. A CLI below 85% makes the gate FAIL and blocks the release.
- **G-10 stays BLOCKED.** The explicit and no-match fixtures and native syntaxes are
  ready, but no run exists.
