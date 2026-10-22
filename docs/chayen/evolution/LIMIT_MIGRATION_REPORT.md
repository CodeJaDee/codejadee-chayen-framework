# Chayen Evolution — Limit Migration Report (Step 06)

- **Date:** 2026-10-22
- **Decision:** D-066, [ADR-0013](../ADRS/ADR-0013-extensible-skill-governance.md)
- **Scope:** evolution Steps 03–06, measured against the
  [Step 01 baseline](BASELINE_REPORT.md) (HEAD `7427eb1`, `1.1.2`).
- **Plan and log:** [MASTER_PLAN.md](MASTER_PLAN.md),
  [STEP_LOG.md](STEP_LOG.md), [MIGRATION_MATRIX.md](MIGRATION_MATRIX.md)

Every repository-level numeric cap is gone from the validators. Provider
constraints, security checks and integrity checks still fail when broken. All
16 shipped Skills and their metadata are unchanged; `plugins/` and `catalog/`
have no diff. No Skill was added to demonstrate the policy: synthetic Skills
exist only in disposable test copies.

## 1. Removed restrictions

| Former restriction | Was enforced at (baseline) | Now | Step | Proof that it no longer fails |
|---|---|---|---|---|
| Entry Skill maximum 16 (shipped, registered, catalog) | `skill-registration.mjs:6,104`; `validate-package.mjs:350`; `check-catalog.mjs:370` | Count reported by category | 03 | G-13R tests 2–3 (17, 18 Skills); G-13L test 3 (18 Skills) |
| Project name allow-list (`PROJECT_NAMES`) and "exactly two editorial records" | `skill-registration.mjs:10-11,31,38,52,80,87` | Validated registration: closed schema, provider name rule, cross-category uniqueness, file and description parity | 03 | G-13R tests 2–3 |
| `SKILL.md` maximum 300 lines; 200-line target | `validate-package.mjs:426-427` | V-06 size report; advisory WARN above the provider recommendation (500 lines / ~5,000 tokens) | 04 | G-13G tests 2–3; G-13L test 3 |
| Reference maximum 300 lines | `validate-package.mjs:431` | V-06 size report; same advisory WARN | 04 | G-13G test 4; G-13L test 3 |
| Link depth maximum 2 hops; every reference linked directly from `SKILL.md` | `validate-package.mjs:491,497` | Iterative graph walk, no depth cap; orphans fail; transitive-only references and cycles WARN | 04 | G-13G tests 5–7 (depth 26, cycles of 3 and 500); G-13L test 3 (nested, depth 4) |
| L0 failure threshold 7,000 characters (`L0_BUDGET`) | `skill-registration.mjs:7`; `validate-package.mjs:352` | Discovery metrics; WARN above Codex's documented 8,000 (advisory) | 05 | G-13M tests 2–3 (7,007 and 8,369 characters); G-13L test 3 |
| Phase 5 pin `SKILLS.length === 16` | `phase5.test.mjs:25` | Count derived from the shipped directories; every Skill still needs probes | 06 | `phase5.test.mjs` 13/13 |

Not removed, by decision: the response-style policy limit (3,500 characters,
40 lines; G-16). It bounds an opt-in, always-on host instruction block, not a
Skill (ADR-0013 matrix K-16).

## 2. Retained provider restrictions

| Restriction | Source | Check | Evidence that it still fails |
|---|---|---|---|
| Skill name 1–64 characters, `a-z0-9-`, single hyphens, equal to its directory | Agent Skills spec (S24), VS Code (S19) | V-05, registries | G-13L "name longer than 64"; G-13R invalid-name cases |
| Description 1–1,024 characters | S24, Copilot (S17) | V-05, V-07, registries | G-13M tests 7–8; G-13L "description above 1,024" |
| Copilot marketplace entry description ≤1,024 | S15 | V-01b | G-13L |
| Portable frontmatter only (`name`, `description`, `license`, `metadata`) | S24, S7 | V-05 | G-13L "provider-specific frontmatter field"; G-13R |
| Agent Plugins closed manifest schema; Claude Code manifest keys and reserved names; per-provider marketplace rules | S21, S3, S4, S10, S15 | V-01..V-04 | G-13L "runtime component key"; existing G-13 controls |
| Listing budgets: Claude Code 1% of context; Codex 2% or 8,000 characters; Copilot undocumented | S7, S12, S17/S19 | Reported by `discovery-metrics.mjs` and V-07 (Claude UNKNOWN, Codex WARN, Copilot UNKNOWN; all NOT_MEASURED) | G-13M tests 3–4 |
| `SKILL.md` under 500 lines and ~5,000 tokens (recommendation) | S24, S7 | V-06 advisory WARN | G-13G test 3 |
| References one level deep (recommendation) | S24 | V-08 WARN for transitive-only references | G-13G test 5 |

## 3. Retained security and integrity checks

| Check | Rule | Evidence that it still fails (on a package beyond every former limit where noted) |
|---|---|---|
| Package profile: `.md` and `.json` only, no hooks, agents, commands, MCP/LSP, scripts | V-09, V-25.1, ADR-0005 | G-13L "executable script"; G-SEC-T 36/36 |
| Symlinks and junctions refused | V-09, `safe-paths.mjs` | G-13L, G-13G junction tests (ran, not skipped) |
| Links stay inside their own Skill; no traversal (plain or percent-encoded), no cross-Skill link, no directory target; anchors exist | V-08 | G-13G tests 8–13; G-13L "link that escapes"; `sk-link-into-other-skill` |
| Orphaned references | V-08 RF-02 | G-13G tests 14–15; G-13L "orphaned nested reference"; `sk-unreachable-reference` |
| Every reference declares a kind and its sections, **including nested files** | V-18 (scope widened in Step 06) | G-13L "nested reference without a kind"; with the pre-Step-06 scope this case is not rejected (control below) |
| Secret-shaped values; secrets never printed | V-25.2 | G-13L "secret-shaped value" (asserts the value is not printed); G-SEC-T |
| Closed registry schemas, no executable fields | V-19, V-25.5 | `pj62-unsupported-field`, `ed36-runtime-field`; G-SEC-T registry cases |
| Unique names across all categories; registration required; description parity; no engineering ownership by non-engineering Skills | V-05, V-11.3, V-19 | G-13R tests 4–21; G-13L "unregistered Skill" |
| Description quality: YAML safety, "Not for" boundary, concrete scope, no catch-all, distinctness | V-07, V-07b, V-20 | G-13M tests 10–13; G-13L "conflicting description" |
| Skill anatomy, trigger and recipe coverage | V-17, V-16, V-22 | Existing G-13 controls (189/189) |
| 206-capability inventory and fingerprint; identity parity; MIT/upstream notices | V-11, V-01..V-04, H-LICENSE | G-03 PASS; fingerprint `2f13cad24ff431e3` unchanged; hardening 22/22 |

## 4. Audit of the repository (Step 06)

Search: `git grep --untracked` over the whole repository (excluding generated
`tests/evals/claude` and these evolution documents) for `MAX_ENTRY_SKILLS`,
`L0_BUDGET`, `PROJECT_NAMES`, a 16-Skill maximum, 7,000-character limits,
300-line limits, two-hop restrictions, allow-lists and the obsolete negative
test IDs. Before fixes: 133 matches. After: 144, because the new notices
name the former values.

| Classification | Matches (after) | Where | Action |
|---|---|---|---|
| **Active restriction requiring a change** | 0 remaining. Found and fixed in Step 06: `SKILL_AUTHORING_STANDARD.md` CA-01 ("combined maximum 16" and "fit maximum 15"); V-18 scope gap (nested references not kind-checked); `phase5.test.mjs` count pin. Steps 03–05 removed the code enforcement. | — | Fixed |
| **Historical evidence to preserve** | `docs/chayen/PROGRESS.md`, `DECISIONS.md` (entries before D-066), `docs/production/*`, `CHANGELOG.md`, README version history, `PLUGIN_TRUST_REVIEW.md`, `TECHNOLOGY_COVERAGE.md` step notes, `HUMANIZER_EVALUATION_REPORT.md`, `tests/workflows/results/*`, ADR-0004/0009/0012 bodies, the ADR-0013 context table | dated records | Kept as written. Superseded ADRs now carry a D-066 notice (ADR-0009 and ADR-0012 added in Step 06; ADR-0004 in Step 02) |
| **Provider-imposed restriction that must remain** | `PROVIDER_SPEC_RESEARCH.md`, `PLUGIN_FORMAT_DECISION.md` F-04, "allow-list" in `ADR-0005` (V-09 file-type allow-list) | provider facts, package profile | Kept |
| **Not a limit (same words, different meaning)** | "allow-list" in shipped security guidance (`chayen-security`, `chayen-backend`, `chayen-data`, `chayen-ai-engineering` references), `catalog/engineering-capabilities.yaml`, `THREAT_MODEL.md`, test fixtures | SSRF, SQL-identifier and egress allow-lists | No change |
| **Regression sentinels (intended)** | `tests/ci/limits.test.mjs`, `tests/skills/reference-graph.test.mjs`, `tests/catalog/discovery-metrics.test.mjs`, `tests/catalog/registration.test.mjs`, `tests/ci/documentation.test.mjs`, retargeted mutation descriptions | tests asserting the old diagnostics never return | Kept |
| **Documentation that needed clarification** | ADR-0009, ADR-0012, ARCHITECTURE §8 (original design table), PLUGIN_PACKAGE_DESIGN V-07 row, PROJECT_CHARTER, ISSUES R-57, SKILL_QUALITY_GATES G-13, `tools/validate/README.md` V-18, CONTRIBUTING developer checks | current-reading text | Notices or rows added in Step 06 |

Code audit: no numeric cap on Skill count, lines, link depth or metadata
remains in `tools/`. The static test in G-13L enforces this. The only numeric
bound found in scripts, `depth > 9` in `run-phase5.mjs`, limits a filesystem
search for installed packages and is not a Skill rule.

## 5. Changed source files (Steps 03–06)

| File | Change |
|---|---|
| `tools/catalog/skill-registration.mjs` | Count cap, `PROJECT_NAMES`, editorial count and allow-list, and `L0_BUDGET` removed; name rule, pinned Humanizer contracts, cross-category uniqueness and `registrationCounts()` added (03, 05) |
| `tools/catalog/check-catalog.mjs` | V-11.3 count check removed; counts by category reported (03) |
| `tools/catalog/discovery-metrics.mjs` (new) | Discovery metadata library and report (05) |
| `tools/validate/validate-package.mjs` | V-07 count and L0 errors removed (03, 05); V-06 size report (04); V-08 iterative graph (04); V-07b uses the shared overlap (05); V-18 and V-06 cover nested references (06) |
| `tools/validate/check-docs.mjs` | D-06 rejects restated budgets and checks stated usage (05) |
| `tools/evals/run-evaluation-suite.mjs` | Discovery metrics instead of a cap (05) |
| `tools/validate/validate-all.mjs` | Gates G-13R, G-13M, G-13G, G-13L, G-14N registered (03–06) |
| `tests/catalog/registration.test.mjs`, `tests/catalog/discovery-metrics.test.mjs`, `tests/skills/reference-graph.test.mjs`, `tests/ci/limits.test.mjs` (new) | Positive and negative fixture suites |
| `tests/catalog/editorial-mutations.json`, `project-mutations.json`, `catalog-mutations.json`, `tests/skills/validator-mutations.json` | Obsolete cap controls retargeted to the faults that remain; none deleted |
| `tests/ci/documentation.test.mjs` | L0 cases rewritten; two prose cases added |
| `tests/evaluation/phase5/phase5.test.mjs` | Count pin removed; per-Skill coverage checks kept (06) |

## 6. Test evidence (Step 06 run, Node.js v24.15.0)

| Command | Exit | Result |
|---|---|---|
| `node tools/validate/validate-all.mjs` | 0 | **25/25** gate groups PASS (2026-10-22T05:47:21Z–05:50:05Z). Package 0 errors, 0 warnings; G-13 189/189 |
| `node tools/evals/run-evaluation-suite.mjs` | 0 | Static and traceability levels PASS; T-206 206/206; discovery INFO: 6,563 characters (~1,641 tokens, estimate), no expensive descriptions, 0 pairs above 0.25, Claude Code UNKNOWN, Codex WITHIN, Copilot UNKNOWN, all NOT_MEASURED |
| `node --test tests/ci/limits.test.mjs` | 0 | 16/16, 0 skipped |
| `node --test tests/catalog/registration.test.mjs` | 0 | 21/21 |
| `node --test tests/catalog/discovery-metrics.test.mjs` | 0 | 13/13 |
| `node --test tests/skills/reference-graph.test.mjs` | 0 | 16/16 (junction test ran) |
| `node --test tests/ci/documentation.test.mjs` | 0 | 17/17 |
| `node --test tests/ci/negative-controls.test.mjs` | 0 | 4/4 |
| `node --test tests/evaluation/phase5/phase5.test.mjs` | 0 | 13/13 |
| `node --test tests/security/boundaries.test.mjs` | 0 | 36/36 |

**Controls of the tests themselves** (scratchpad copies pointed at older
validators):

| Suite | Against | Result |
|---|---|---|
| G-13R registration | baseline `tools/` (`git archive HEAD`) | 19/21 fail with `17 entry skills > 16`, `18 entry skills > 16` and allow-list errors |
| G-13G reference graph | baseline `tools/` | 15/16 fail; the positive cases fail on `lines > 300` and `not linked from SKILL.md` |
| G-13M discovery | baseline `tools/` | 10/13 fail; tests 2–3 fail on `L0 metadata 7007 chars > 7000` and `8369 chars > 7000` |
| G-13L nested V-18 case | current `tools/` with the pre-Step-06 V-18 scope restored | fails: a nested reference without a kind is not rejected |

`G-13L` also caught a stale rule on its first run: the CA-01 row in the
authoring standard, fixed in Step 06.

Not run: live provider runs, native installation, `tools/ci/check-workflow.mjs`
(network download) and the framework fact runners. These are outside the
offline suite and none is needed for this migration.

## 7. Remaining warnings and risks

- **Current package warnings: none** (0 from `validate-package.mjs`).
- **Advisory warnings that can appear by design:** V-06 above 500 lines or
  ~5,000 tokens; V-08 for transitive-only references and cycles; V-07 above
  the 420-character description target or the 8,000 characters documented
  for Codex; V-07b above 0.25 overlap. Each needs G-15 acknowledgement, not a
  fix.
- **Provider capacity is NOT_MEASURED.** Removing caps does not show that any
  provider discovers more Skills reliably. Growth needs routing and context
  runs (release rule P-L; evolution Steps 14 and 18).
- **Release rule P-L is a checklist item**, not an automated gate.
- **Owner judgment calls still open** (Steps 02, 04 and 05 logs): cycles as
  warnings; references use the `SKILL.md` advisory figure; Codex's 8,000 as
  the only provider warning; the relative "unusually expensive" rule.

## 8. Documentation updates

| Area | Files |
|---|---|
| Decision records | ADR-0013 (new), D-066, ADR index; superseded notices in ADR-0004, ADR-0009, ADR-0012 |
| Authoring standard and gates | `SKILL_AUTHORING_STANDARD.md` (L0/L1/L2 rows, PT-06, SB-01, DS-05, RF-02..RF-04, CA-01, "a valid graph is not a read graph"); `SKILL_QUALITY_GATES.md` (G-06..G-08, G-13, detection matrix, Node.js 20.11); `SKILL_REGISTRATION.md` |
| Architecture and governance | `ARCHITECTURE.md` (§8 note and as-built note, DR-07, quality attributes, L0 rows); `PLUGIN_PACKAGE_DESIGN.md`; `ACCEPTANCE_MATRIX.md` (ARC-07, REQ-06); `ISSUES.md` (R-15, R-57); `KNOWN_LIMITATIONS.md` (KL-03); `PROJECT_CHARTER.md` |
| User and developer docs | `README.md`; `docs/AUTOMATIC_SKILL_DISCOVERY.md` (new section "Discovery metadata and provider limits"); `docs/SKILLS_CATALOG.md`; `docs/CONTRIBUTING.md` (developer checks and policy); `docs/RESPONSE_STYLE.md`; `docs/distribution/RELEASE_CHECKLIST.md` (rule P-L) |
| Tool and test indexes | `tools/catalog/README.md`, `tools/validate/README.md`, `tests/catalog/README.md`, `tests/skills/README.md` |

`check-docs.mjs` (G-14) and the G-13L rule-row check keep the maintained
documents in agreement with the implementation.
