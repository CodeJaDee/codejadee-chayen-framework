# ADR-0013: Extensible Skill Governance

- **Status:** ACCEPTED (explicit owner instruction, 2026-10-22, evolution
  program STEP 02: "Formally change Chayen's architecture policy so future
  capability and Skill growth is not blocked by arbitrary repository-level
  numeric limits"). Recorded as D-066. **Implementation:** A-1, A-6 and §7
  (count cap, registration allow-lists) IMPLEMENTED in evolution Step 03;
  A-2, A-3, A-4, P-B1 and P-B2 (size and depth caps, transitive discovery)
  IMPLEMENTED in Step 04; A-5 and P-L1..P-L3 (L0 cap removed, discovery
  metrics, documented provider figures) IMPLEMENTED in Step 05 (all
  2026-10-22). The regression suite is Step 06
  ([migration matrix](../evolution/MIGRATION_MATRIX.md)). Release rule P-L is
  a release-checklist item, not an automated gate.
- **Date:** 2026-10-22
- **Related:** ADR-0003, ADR-0004, ADR-0005, ADR-0006, ADR-0007, ADR-0009,
  ADR-0012; D-016, D-017, D-025, D-046, D-051, D-052, D-053, D-062, D-066;
  PROVIDER_SPEC_RESEARCH §5–§6 (S7, S12, S15, S17, S19, S21, S24).

## Context

The repository enforces several numeric limits that no provider imposes.
Each was raised by a separate owner decision whenever growth reached it:

| Limit | History | Enforced at (Step 01 baseline) |
|---|---|---|
| Entry Skill count | ≤14 (ADR-0004) → 25 (D-051) → 15 (D-053) → 16 (D-062). 16 of 16 ship. | `tools/catalog/skill-registration.mjs:6,104`; `tools/validate/validate-package.mjs:350`; `tools/catalog/check-catalog.mjs:370` |
| L0 metadata | 4,000 → 4,400 → 4,700 → 5,200 → 5,500 → 6,500 → 7,000 characters. 6,563 used. | `skill-registration.mjs:7`; `validate-package.mjs:352` |
| `SKILL.md` lines | error >300, warning >200 | `validate-package.mjs:426-427` |
| Reference lines | error >300 | `validate-package.mjs:431` |
| Reference link depth | error beyond 2 hops from `SKILL.md` | `validate-package.mjs:491` |
| Registration names | fixed allow-lists: exactly `chayen-init` (project); exactly two Humanizer records (editorial) | `skill-registration.mjs:10-11,31,38,52,80,87,102` |

These numbers are internal planning budgets. The decisions that set them say
so: "an internal planning budget, not verified host/token capacity" (D-052),
and "not a provider-wide hard limit" (SKILL_REGISTRATION.md). Raising them
one decision at a time has added work without adding evidence. Meanwhile
ADR-0004, which owns them, is still `PROPOSED` and states outdated values
(BASELINE_REPORT F-02).

The providers do impose real constraints, documented in
PROVIDER_SPEC_RESEARCH §5–§6. Some are hard rejections (an invalid name
"silently fails to load", S19). Some are capacity behaviours: once a listing
budget is exceeded, descriptions are dropped or shortened and Skills may be
omitted (S7, S12). These must not be confused with repository policy.

## Decision

### 1. Every rule belongs to one of four classes

| Class | Rule | Treatment |
|---|---|---|
| **A. Repository policy** | Numeric caps chosen by this repository without a provider or security basis | **Removed as failure conditions.** Replaced by measurement and reporting (§3). |
| **B. Provider constraints** | Limits and formats documented by Claude Code, Codex, Copilot, the Agent Skills specification or the Agent Plugins schema | **Retained.** Hard rejections stay validator errors. Recommendations and capacity behaviours are reported against their documented figure (§4). Never described as removable. |
| **C. Security, identity, schema integrity, supply chain** | Package content, paths, links, closed schemas, identity parity, licence, inventory integrity | **Retained unchanged** (§5). |
| **D. Quality, discoverability and routing** | Anatomy, progressive disclosure, trigger and recipe coverage, distinctness, wording | **Retained** (§6). |

### 2. Class A rules removed

| # | Rule removed as a failure | Owner decision item |
|---|---|---|
| A-1 | Maximum Entry Skill count (16): shipped count, registered count and engineering `entry_skills` count | 1 |
| A-2 | Fixed `SKILL.md` maximum (300 lines) and the repository's 200-line warning target | 2 |
| A-3 | Fixed reference-file maximum (300 lines) | 2 |
| A-4 | Maximum link depth of 2 hops from `SKILL.md` | 3 |
| A-5 | Fixed L0 failure threshold (7,000 characters, `L0_BUDGET`) | 4 |
| A-6 | Fixed registration allow-lists: the `PROJECT_NAMES` set, the "exactly two" editorial records rule, and rejection of any editorial name outside the two Humanizers | 5 |

Removing a cap does **not** mean that providers have unlimited capacity.
Every added Skill costs listing metadata on every turn, and every added line
costs context when it loads. Those costs stay measured (§3) and bounded by
the provider behaviours in §4.

### 3. Measurement and reporting that replace the caps

The validators and the evaluation suite report, on every run:

| Metric | Reported by | Replaces |
|---|---|---|
| Entry Skill count by category (engineering, editorial, project, future categories) | `validate-package.mjs` V-07, `check-catalog.mjs` | A-1 |
| L0 characters (actual and projected) and estimated tokens (characters / 4, labelled as an estimate) | V-07, `run-evaluation-suite.mjs` | A-5 |
| L0 against each documented provider listing budget (§4) | V-07, `run-evaluation-suite.mjs` | A-5 |
| Per-Skill `SKILL.md` lines and estimated tokens; per-reference lines; worst-case activation (body plus largest reference) | V-06, `run-evaluation-suite.mjs` | A-2, A-3 |
| Maximum reference link depth per Skill | V-08 | A-4 |

**Growth evidence.** A change that adds an Entry Skill, or that raises L0,
records the before and after metrics in its change summary, re-runs the
trigger-case check (G-11), and does not claim a routing effect without
provider runs (DS-09, D-046). A release whose metrics cross a provider figure
in §4 needs recorded routing evidence on that provider (§4, rule P-L).

### 4. Class B provider constraints retained

**Hard constraints (validator errors):**

| ID | Constraint | Source | Check |
|---|---|---|---|
| P-01 | Skill `name`: 1–64 characters, `a-z0-9-`, no leading, trailing or double hyphen, equal to its directory | S24, S19 | V-05 |
| P-02 | Skill `description`: 1–1,024 characters | S24, S17 | V-05, V-07, registries |
| P-03 | Portable frontmatter only (`name`, `description`, `license`, `metadata`) | S24, S7, PT-02 | V-05 |
| P-04 | Skill layout `skills/<name>/SKILL.md` in one canonical source | S24, S7, S12, S17 | V-05, V-13 |
| P-05 | Agent Plugins 1.0.0 closed manifest schema; plugin name rules | S21 | V-02 |
| P-06 | Claude Code manifest fields and reserved names; marketplace rules per provider | S3, S4, S10, S15 | V-01a/b/c, V-03 |
| P-07 | Copilot marketplace entry description ≤1,024 characters | S15 | V-01b |

**Provider recommendations and capacity behaviours (reported against the
documented figure; not removable, and not hard rejections):**

| ID | Behaviour | Source | Treatment |
|---|---|---|---|
| P-B1 | `SKILL.md` "under 500 lines, under 5000 tokens recommended" (Agent Skills); "under 500 lines" (Claude Code) | S24, S7 | V-06 **WARN** above 500 lines or about 5,000 estimated tokens. G-15 review must acknowledge it. |
| P-B2 | Supporting files "one level deep" from `SKILL.md` | S24 | **Amended by the owner's Step 04 instruction (2026-10-22):** references may be discovered transitively. Every reference must be reachable from `SKILL.md` (orphans are errors, RF-02). A reference reachable only through another reference gets a V-08 **WARN** that names the recommendation. Cycles are reported (WARN), and traversal is iterative and cycle-safe. Listing references in the References table stays the recommended form. |
| P-L1 | Claude Code listing budget is 1% of the context window; on overflow, descriptions of the least-used Skills are dropped; each entry is capped at 1,536 characters | S7 | Reported. Depends on the host's context window, so no single character figure applies. |
| P-L2 | Codex initial list ≤2% of the context window, or 8,000 characters if unknown; descriptions are shortened first and Skills may be omitted | S12 | V-07 **WARN** when L0 exceeds 8,000 characters, the most conservative documented figure. |
| P-L3 | Copilot CLI and VS Code listing budgets | S17, S19 | UNVERIFIED (U-06). Reported as unknown. |
| P-L | Release rule | — | A package whose L0 exceeds a documented provider figure (P-L2), or that adds Skills, is not released as supported on that provider until recorded routing runs on that provider show no dropped, shortened or omitted Skill. |

### 5. Class C rules retained unchanged

- Package profile: `.md` and `.json` only; no hooks, agents, commands, MCP
  or LSP servers, scripts, `bin/`, `package.json` or lockfiles (V-09,
  ADR-0005). The plugin does not become an always-on runtime (ADR-0003,
  D-007).
- Links: resolve, stay inside the Skill's own directory, never escape the
  plugin, heading anchors exist (V-08, D-016, DR-01..DR-05). With A-4
  removed, link traversal must stay cycle-safe.
- Symlink and junction refusal, confined paths (`safe-paths.mjs`), and the
  offline security profile and boundary tests (V-25, G-SEC, G-SEC-T).
- Closed registry schemas with no executable or configuration fields, names
  disjoint across all registries, planned/existing file parity, and exact
  description parity between registry and `SKILL.md` (V-19, V-25.5).
- Identity parity across manifests and marketplaces (V-01..V-04); the MIT
  licence and upstream notices (H-LICENSE); repository hygiene (V-13);
  portable wording and no self-reference (V-10).
- Engineering Catalog integrity: exactly 206 capabilities in 20 domains,
  verbatim inventory and fingerprint, ownership and recipe mappings (V-11,
  V-19). This ADR does not change the inventory.

### 6. Class D rules retained

- Entry Skill anatomy and gates: scope line, ordered sections, at least 4
  positive and 3 negative triggers, the no-match gate sentence, and the
  `Reference | Load when` table (V-17, ADR-0003).
- Progressive disclosure: L0 metadata, then the body, then references on a
  specific load condition (LD-01..LD-05, RF-02).
- Description quality: YAML-safe, "Not for …" clause with ≥2 exclusions,
  concrete scope terms, no catch-all wording (V-07, V-20). The 420-character
  description target stays a **WARN**.
- Non-overlapping triggers: distinctness WARN above 0.25 and ERROR above
  0.35 (V-07b). These are quality thresholds, not capacity caps, so they
  remain errors whatever the Skill count.
- Coverage scales with growth: ≥3 positive trigger cases per Skill and the
  category minimums (V-16); recipe cases per capability (V-22).

### 7. Extensible registration

The registration model in SKILL_REGISTRATION.md keeps its categories
(engineering, editorial, project). It changes from fixed name lists to
validated records:

1. Each shipped Skill directory belongs to exactly one category registry.
   An unregistered directory is an error (V-11.3, V-19).
2. A non-engineering record is admitted when it satisfies the category's
   closed schema, P-01 and P-02, name uniqueness across all registries,
   planned/existing parity and description parity. No name allow-list is
   consulted.
3. Non-engineering Skills never own or substitute for engineering
   capabilities, and are never forced to claim one.
4. The two Humanizer records keep their language contracts
   (`chayen-humanizer-th` → `th`, `chayen-humanizer-en` → `en`). A further
   editorial record must declare a language code; its contract is set by the
   decision that adds it.
5. Adding a **category** is an architecture change. It needs a decision
   record and a closed schema in `tools/catalog/skill-registration.mjs`. No
   count is involved.
6. Admission is not routing evidence. Every new Skill still passes §5 and
   §6 and the growth-evidence rule in §3.

### 8. Implementation targets

Exact per-line targets are in the
[migration matrix](../evolution/MIGRATION_MATRIX.md). In summary:

| Step | Implements | Primary files |
|---|---|---|
| 03 | A-1, A-6, §7 | `tools/catalog/skill-registration.mjs`, `tools/catalog/check-catalog.mjs`, `tools/validate/validate-package.mjs` (V-07 count, V-19), `tests/catalog/editorial-mutations.json`, `tests/catalog/project-mutations.json`, `tests/catalog/catalog-mutations.json`, a new passing-fixture test, SKILL_REGISTRATION.md |
| 04 | A-2, A-3, A-4, P-B1, P-B2 | `validate-package.mjs` V-06 and V-08 (with cycle-safe traversal), `tests/skills/validator-mutations.json`, SKILL_AUTHORING_STANDARD.md, ARCHITECTURE.md §8 |
| 05 | A-5, P-L1..P-L3, P-L | `skill-registration.mjs` (`L0_BUDGET`), `validate-package.mjs` V-07, `tools/evals/run-evaluation-suite.mjs`, `tools/validate/check-docs.mjs` D-06, `tests/ci/documentation.test.mjs`, user documentation and the release checklist |
| 06 | Regression proof for §2–§6 | New `tests/ci/limits.test.mjs`, `tools/validate/validate-all.mjs`, plus registering `tests/ci/negative-controls.test.mjs` |

## Alternatives considered

| Alternative | Why not chosen |
|---|---|
| Raise each cap again (for example to 25 Skills and 10,000 characters) | Repeats the D-051..D-062 cycle without adding evidence; each number is still arbitrary. |
| Remove the caps with no replacement | Hides the real per-turn cost and the provider overflow behaviour; violates decision item 4 ("measurement, reporting, evidence-based evaluation"). |
| Make provider recommendations (500 lines, one level deep) hard errors | They are recommendations, not rejections (S24, S7). A WARN plus review keeps them visible without inventing a hard limit. |
| Make the Codex 8,000-character figure a validator error | It is the fallback when the context window is unknown, and Codex shortens or omits rather than rejecting. The release rule P-L requires routing evidence instead. |
| Split into several plugins to stay under a cap | Breaks the single canonical source and the one-plugin packaging (ADR-0006, ADR-0008). |

## Consequences

- **Positive:** Skill and recipe growth is limited by evidence and provider
  behaviour, not by numbers that need a new decision each time. One policy
  replaces six amendment chains.
- **Negative:** without a cap, metadata can grow until providers truncate
  it. Mitigated by V-07 warnings against P-L2, the release rule P-L, and the
  metrics in §3. Larger Skill bodies cost more context per activation;
  mitigated by P-B1 warnings and review.
- Until Steps 03–06 are complete, documents that describe the D-062 values
  as currently enforced remain accurate. This ADR does not change validator
  behaviour.
- KL-03 ("the ceiling is reached") stops being a blocker once Step 03 lands.
  It is replaced by the provider-budget risk in §4.

## Supersedes and amends

- **ADR-0004** decision 4 (budget enforced by a validator: L0 cap, Skill
  count cap, `SKILL.md` ≤300 lines, ≤2 hops) is superseded by §2–§4. ADR-0004
  decisions 1 and 2 (separate catalog and entry Skills; capability detail in
  references) remain in force. Its decision 3 (pack `INDEX.md` two-hop
  loading) was already replaced in practice by skill-local references
  (D-016); RF-02 and P-B2 now govern.
- **ADR-0009** and **ADR-0012** count and L0 components (D-051, D-052,
  D-053, D-062 item 7), and ADR-0012 decision 6's project allow-list, are
  superseded by §2 and §7. Their other decisions are unchanged.
- **SKILL_AUTHORING_STANDARD.md** SB-01, PT-06, RF-03, RF-04 and the DS-05
  total-L0 sentence; **SKILL_QUALITY_GATES.md** G-06 and G-08 size and depth
  wording: amended as each step lands.

Historical decision records keep their original text.

## Verification

- Static: the Step 06 suite shows that no count, line, depth or L0 value on
  its own fails validation, and that every Class B hard constraint and every
  Class C rule still fails on its negative control.
- `node tools/validate/validate-all.mjs` passes after each of Steps 03–06.
- Provider capacity (P-L1..P-L3) needs recorded routing runs (evolution
  Step 18). Until then it is `NOT_RUN`.
