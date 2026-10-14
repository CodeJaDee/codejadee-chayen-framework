# Capability Coverage — Chayen Engineering Capability Catalog

| Field | Value |
|---|---|
| Step | 07 (catalog); updated in Steps 08 to 11 |
| Date | 2026-10-14 |
| Status | **PROPOSED**: awaiting user review |
| Canonical catalog | [`catalog/engineering-capabilities.yaml`](../../catalog/engineering-capabilities.yaml) |
| Inventory source | The user's Step 07 prompt: 20 domains, 206 capability names, used verbatim |
| Checker | [`tools/catalog/check-catalog.mjs`](../../tools/catalog/check-catalog.mjs) (validator V-11, zero dependencies) |
| Decisions | D-021 (catalog format), D-022 (IDs and status rules), D-023 (proposed entry-skill mapping), D-024 (consolidation model), D-026 (recipes are reference files, Step 08) |
| Authoring rules | [SKILL_AUTHORING_STANDARD.md](SKILL_AUTHORING_STANDARD.md) §6 (recipe anatomy) and [SKILL_QUALITY_GATES.md](SKILL_QUALITY_GATES.md) |

This document explains the catalog and how far the shipped plugin covers it.
The catalog is the source of truth. The tables in §10 are **generated** from
it, and the checker fails when they drift.

---

## 1. Summary

- **206 capabilities in 20 domains**, exactly as inventoried. No name was
  renamed or omitted, and the order is preserved.
- **206 IMPLEMENTED (all):**
  - D01 9/9 and D02 10/10 (Step 09);
  - D03 10/10 and D04 8/8 (Step 10);
  - D05 12/12 and D06 10/10 (Step 11);
  - D07 10/10 and D08 8/8 (Step 12; D08 scoped to web-technology shells,
    D-032);
  - D09 12/12 and D10 14/14 (Step 13; D09 in the new `chayen-data` skill,
    D-033);
  - D11 14/14 and D12 10/10 (Step 14; D12 in the new `chayen-performance`
    skill, and CAP-11-013 moved to `chayen-security`, D-034);
  - D13 12/12 and D14 10/10 (Step 15; the new `chayen-devops` skill,
    D-035);
  - D15 10/10 and D16 10/10 (Step 16; the new `chayen-documentation`
    skill, and the planned `chayen-modernization` folded into existing
    skills, D-036);
  - D17 10/10 and D18 10/10 (Step 17; the new `chayen-ai-engineering`
    skill and nine D18 records in existing skills, D-037);
  - D19 9/9 and D20 8/8 (Step 18; existing skills, D-038).

  Each has a recipe that meets SKILL_AUTHORING_STANDARD §6, a review against
  its record, passing static gates, and positive and negative recipe cases.
- **0 VERIFIED.** Behaviour and trigger evals have not been executed.
  A catalog entry alone never changes a status (D-022).
- **0 IN_PROGRESS.** The last one (CAP-18-002 change-passport) became
  IMPLEMENTED in Step 17.
- **0 PLANNED.** Every record has a recipe. None is VERIFIED yet (see §9).
- **13 entry skills, all existing** (the ADR-0004 cap is 14):
  `chayen-requirements` added in Step 09, `chayen-architecture` in Step 10,
  `chayen-data` in Step 13, `chayen-performance` in Step 14,
  `chayen-devops` in Step 15, `chayen-documentation` in Step 16, and
  `chayen-ai-engineering` in Step 17, the last five with the user's
  approval (D-033 to D-037). `chayen-modernization` was removed in Step 16:
  its capabilities moved to existing skills (D-036).
- **117 recipe files** are mapped, and all exist. Step 12
  split `device-permissions-and-push.md` out of `hybrid-mobile.md` (D-032),
  and Step 14 added `infrastructure-security-review.md` for CAP-11-013
  (D-034). **57 consolidation groups** let 146 capabilities share a recipe while
  keeping their own identity. (Corrected in Step 12: the earlier figure of
  148 did not match the catalog, which had 147 grouped capabilities before
  and after this step.)
- **61 cross-recipe overlaps** are recorded symmetrically and resolved by
  hand-off.


---

## 2. How to check

```bash
node tools/catalog/check-catalog.mjs              # count, uniqueness, inventory identity, mappings, doc sync
node tools/catalog/check-catalog.mjs --write-doc  # regenerate §10 after editing the catalog
node tools/catalog/check-catalog.mjs --dump-json  # parsed catalog as JSON (for independent cross-checks)
```

The checker embeds the user's inventory verbatim. It compares the catalog
against that copy, not against itself.

| Check | What it proves |
|---|---|
| V-11.0 inventory | The embedded inventory has 20 domains, each domain's list matches its declared count, and the sum is 206. |
| V-11.1 parse | The file is in the restricted YAML subset (D-021). |
| V-11.2 header | `expected_domains` is 20 and `expected_capabilities` is 206. The status vocabulary equals BUILD_CONTRACT §5.1. |
| V-11.3 entry skills | There are at most 14 entry skills. `existing` and `planned` match the files on disk. Every shipped skill is listed, and every listed skill owns at least one capability. |
| V-11.4 domains | There are 20 domains, D01..D20. Titles and counts equal the inventory. |
| V-11.5 count and identity | There are exactly 206 records, and ids and names are unique. Each `CAP-DD-NNN` sits at its inventory position. Each name equals the inventory name, so there are no renames. Each inventory name is present, so there are no omissions. |
| V-11.6 fields | Every required field is present. There are at least 2 positive and 2 negative triggers. Each negative trigger names its destination, and the capability IDs it cites exist. No positive trigger mentions Chayen (REQ-03). No placeholder text, no duplicate purposes. |
| V-11.7 mappings | Each recipe is inside its entry skill (D-016). `existing` and `planned` match the files on disk, so a planned recipe file must not exist yet. |
| V-11.8 consolidation | Group members match the capabilities that reference the group, and they share its recipe. |
| V-11.9 overlaps | Overlaps are symmetric, they exist, and they cross recipes. |
| V-11.10 status | `COMPLETED` is rejected. IN_PROGRESS requires existing coverage inside the entry skill. PLANNED must not claim coverage. IMPLEMENTED and VERIFIED require an existing recipe and `verification_evidence`. |
| V-11.11 doc sync | §10 of this document equals the generated output. |

The checker also prints a **fingerprint**: the sha256 of the `id name` rows
for the inventory and for the catalog. Equal fingerprints show that the
catalog's identity list matches the inventory byte for byte.

---

## 3. Record fields

Each requested field maps to one key in every record.

| Requested field | YAML key | Notes |
|---|---|---|
| Unique ID | `id` | `CAP-<domain 01..20>-<position 001..>`, in inventory order |
| Exact name | `name` | Verbatim from the inventory |
| Domain | `domain` | `D01`..`D20`. The domain titles are in the `domains` list. |
| Purpose | `purpose` | One or two sentences on the outcome the capability delivers |
| Positive triggers | `positive_triggers` | Ordinary prompts that never mention Chayen |
| Negative triggers | `negative_triggers` | Near-miss prompts, each ending in `→ CAP-.. name` or `→ native answer (reason)` |
| Inputs | `inputs` | What the agent needs |
| Expected outputs | `outputs` | Observable deliverables |
| Entry skill mapping | `entry_skill: {name, mapping}` | `mapping` is `existing` or `planned`. `secondary_skills` lists other skills that may attract the prompt. |
| Recipe/reference mapping | `recipe: {path, mapping}` | Plugin-relative and skill-local (D-016). `consolidation` names a shared-recipe group. |
| Verification approach | `verification` | Trigger evals plus a behaviour check on a fixture, with a concrete pass condition |
| Implementation status | `status` | BUILD_CONTRACT §5.1 vocabulary. `existing_coverage` is the evidence for IN_PROGRESS. |

Additional keys:

- `stacks`: stack packs, `any`, or a stack group.
- `overlaps`: related capabilities in other recipes.
- `notes`: boundary changes, scope questions, or related content elsewhere.

---

## 4. Status rules (D-022)

| Status | Rule in this catalog |
|---|---|
| PLANNED | No shipped content in the mapped entry skill implements the capability. |
| IN_PROGRESS | The mapped entry skill already ships content that addresses the core purpose, listed in `existing_coverage`. The record is not fully implemented, and nothing is verified at capability level. |
| IMPLEMENTED | The recipe exists, covers every output in the record without placeholder content, and lists pending `verification_evidence`. **206 after Step 18 (all domains).** |
| VERIFIED | The verification approach was executed and passed, with a recorded result. **None yet.** |

**Why the pilot-covered capabilities are not IMPLEMENTED,** even where a full
pilot reference exists (for example `task-contract.md`):

- The pilot files were written before these records existed.
- Nobody has reviewed them against each record's outputs.
- No capability-level behaviour test has run. Step 06 measured skill
  routing, not capability behaviour.

**Step 08 (D-026).** A recipe is always a `references/*.md` file of kind
`recipe`, never `SKILL.md`. The capabilities whose procedure still lives in a
pilot `SKILL.md`, or in a checklist or technology reference, now map to
*planned* recipe files. They stay IN_PROGRESS through `existing_coverage`.
Their procedure has not yet been extracted into a recipe.

**Promotion path:**

1. Write or extend the recipe.
2. Review it against the record.
3. Add `verification_evidence`, then mark the record IMPLEMENTED.
4. Run the behaviour eval and record the result, then mark it VERIFIED.

The checker refuses steps 3 and 4 without the evidence field.

**Content that sits in a different skill does not count.** Some PLANNED
records have related pilot content in another skill. For example, EF Core
migrations live in `chayen-backend`, while `schema-migration` maps to the
planned `chayen-data`. These are kept PLANNED with a `notes` pointer, because
D-016 stops one skill from linking another skill's references.

---

## 5. Entry-skill model (D-023, PROPOSED; decides Q-10)

### 5.1 Proposed set

| Entry skill | State | Owns capabilities from |
|---|---|---|
| chayen-repository | existing | D01, legacy assessment and debt prioritization (D15, D-036) |
| chayen-requirements | existing (Step 09) | D02, plus estimation (D04) |
| chayen-architecture | existing (Step 10) | D03, decision register, migration planning, and rollout planning (D04; D-029), strangler and modularization (D15), waivers (D18), realtime and multi-region (D19) |
| chayen-implementation | existing | D04 contract, plan, risk class, and handoff; all of D05, including dependency upgrades (D-031); framework upgrade and breaking-change analysis (D15); dead code and deprecation (D15, D-036); safe refactor plan (D15); change passport and evidence audit (D18) |
| chayen-backend | existing | D06, plus GraphQL, file processing, webhooks, and payments (D19) |
| chayen-frontend | existing | D07, D08 (web-technology shells only, D-032), browser extensions (D19) |
| chayen-data | existing (Step 13, D-033) | D09, data governance (D18), search and geospatial (D19) |
| chayen-testing | existing | D10, including fuzz testing of the user's own code (Step 13) |
| chayen-security | existing | D11, including read-only container and IaC review (D-034); access and licence reviews (D18) |
| chayen-performance | existing (Step 14, D-034) | D12 |
| chayen-devops | existing (Step 15, D-035) | D13, D14 (container and IaC security review moved to chayen-security, D-034), hotfix (D15), policy as code and go/no-go (D18) |
| chayen-documentation | existing (Step 16, D-036) | D16, plus standards checks (D18) |
| chayen-ai-engineering | existing (Step 17, D-037) | D17, agent action risk (D18), D20 |

**Domains are a catalog grouping, not a routing unit** (ADR-0004). Three
domains are distributed across several skills by the artifact each capability
works on:

- **D04 Planning:** contracts, plans, risk classes, and handoff sit with
  implementation; estimation with requirements; and migration, rollout, and
  the decision register with architecture (D-029, Step 10).
- **D18 Governance:** each governance check lives with the skill whose
  artifacts it governs.
- **D19 Specialized:** each capability goes to the skill for its layer.

The per-skill counts are in §10.

### 5.2 Metadata budget conflict (R-27)

The always-loaded metadata (L0) was capped at 4,000 characters (ADR-0004,
D-017). The user raised the cap to **4,400** in Step 14 (D-034), to **4,700** in Step 15 (D-035), to **5,200** in Step 16 (D-036), and to **5,500** in Step 17 (D-037). In Step 07, the six pilot descriptions used **2,332 / 4,000**
characters, at 358–393 characters each. All 13 entry skills now exist and
use **5,485 / 5,500** after Step 18 (5,477 / 5,500 after Step 17, 5,051 / 5,200 after Step 16, 4,654 /
4,700 after Step 15). No planned entry skill remains, so no further cap
change is expected; D19 and D20 map to existing skills. Any description
growth must fit in the remaining 15 characters or be offset elsewhere. Step
18 rewrote the frontend and AI engineering descriptions within the cap
(browser extensions and agent skills added, other wording shortened).

| Option | Arithmetic | Trade-off |
|---|---|---|
| A. 14 skills within 4,000 | 685 characters left for 6 skills, about 114 characters each (description only) | Too short for stack lists and "Not for" clauses. Step 06 already saw under-triggering at about 380 characters. |
| B. 14 skills, raise L0 to about 5,600 | 8 × about 410 characters | Uses about 70% of Codex's 8,000-character fallback (S12). That crowds or truncates the user's other skills, against the ADR-0004 intent. |
| C. 10–11 skills within 4,000 | 4–5 new skills at about 400 characters | Broader skills. Candidate merges: requirements + architecture; performance into devops; modernization into implementation; documentation + review. |

**Recommendation:**

- Keep the 4,000 cap, because it protects the user's other skills.
- Settle the final set with Q-10.
- Add planned skills one at a time, measuring L0 and triggering each time.
  Merge (Option C) as soon as the next skill would break the cap.

The catalog makes remapping mechanical: change `entry_skill` and `recipe`,
then re-run the checker. Capability identities do not change.

---

## 6. What the shipped skills cover

### 6.1 IMPLEMENTED (Steps 09 to 18)

| Entry skill | Capabilities | Recipes |
|---|---|---|
| chayen-architecture | All 10 in D03, plus D04 migration planning, rollout planning, and decision register | `architecture-review.md`, `decision-records.md`, `boundaries-and-domain.md`, `sequence-and-dataflow.md`, `multitenancy.md`, `resilience.md`, `migration-strategy.md`, `rollout-planning.md`, plus the `architecture-styles.md` checklist |
| chayen-implementation | D04 task contract, implementation planning, risk classification, handoff summary | `task-contract.md` (now with a risk class scale and a proposed or approved status), `change-summary.md` |
| chayen-requirements (D04) | D04 estimation and sizing | `scope-and-backlog.md` (sizing step added) |
| chayen-implementation (D05) | All 12 in D05 | `feature-delivery.md`, `bug-fix.md`, `refactoring.md`, `algorithm-design.md`, `concurrency-safety.md`, `error-handling.md`, `upgrades.md`, `configuration-and-flags.md`, `contract-codegen.md`, `compatibility.md` |
| chayen-backend | All 10 in D06 | `api-design.md`, `api-endpoints.md`, `authn-authz.md`, `messaging.md`, `background-jobs.md`, `external-integrations.md`, `idempotency-and-consistency.md`, plus the four stack technology references |
| chayen-repository | All 9 in D01 | `repository-profile.md`, `dependency-and-impact.md`, `history-and-ownership.md`, `technical-debt-inventory.md`, `unknowns-and-assumptions.md` |
| chayen-requirements | All 10 in D02 | `elicitation-and-modeling.md`, `stories-and-acceptance.md`, `scope-and-backlog.md`, `nonfunctional-requirements.md`, `requirement-traceability.md`, plus the `requirements-record.md` template |
| chayen-frontend (D07) | All 10 in D07 | `ui-features.md`, `component-architecture.md`, `layout-and-design-system.md`, `accessibility.md`, `frontend-performance.md`, `internationalization.md`, `frontend-error-handling.md`, plus the `ui-states.md` checklist and the three framework references |
| chayen-frontend (D08) | All 8 in D08, for web-technology shells (D-032) | `hybrid-mobile.md`, `device-permissions-and-push.md`, `offline-and-mobile-performance.md`, `desktop-packaging.md`, plus the `app-shells.md` technology reference |
| chayen-data | All 12 in D09 | `data-modeling.md`, `schema-and-data-migration.md`, `query-performance.md`, `transactions.md`, `data-quality-and-integrity.md`, `etl-pipelines.md`, `retention-and-governance.md`, `backup-restore.md`, plus the `sql-server.md` and `postgresql.md` engine references and the `database-safety.md` checklist |
| chayen-testing | All 14 in D10 | `test-strategy.md`, `test-authoring.md`, `api-and-contract-tests.md`, `advanced-test-techniques.md`, `test-data.md`, `failing-and-flaky-tests.md`, `coverage-gaps.md`, plus the three stack testing references |
| chayen-security | All 14 in D11 | `threat-modeling.md`, `secure-review.md`, `scanner-triage.md`, `secret-exposure-response.md`, `privacy.md`, `sbom-and-licenses.md`, `infrastructure-security-review.md`, `vulnerability-remediation.md`, plus the `review-checklist.md` and `stack-hardening.md` checklists |
| chayen-performance | All 10 in D12 | `baseline-and-profiling.md`, `load-testing.md`, `memory-leaks.md`, `budgets-and-capacity.md`, `caching.md`, plus the `runtime-tools.md` technology reference |
| chayen-devops | All 12 in D13 and all 10 in D14 | `build-systems.md`, `pipelines.md`, `containers.md`, `infrastructure-as-code.md`, `environment-parity.md`, `secrets-management.md`, `releases-and-provenance.md`, `release-and-rollout.md`, `observability.md`, `alerting-and-incidents.md`, `rca-and-postmortems.md`, `disaster-recovery.md`, `runbooks.md`, plus the `operations-safety.md` checklist and the `tooling.md` technology reference |
| chayen-documentation | All 10 in D16 | `project-docs.md`, `api-docs.md`, `architecture-docs.md`, `pull-requests-and-review.md`, `release-notes.md`, `git-workflow.md`, plus the `fact-checking.md` checklist |
| D15 across five skills | All 10 in D15 | `legacy-assessment.md` and `technical-debt-prioritization.md` (repository), `refactoring.md` (large refactor plans), `upgrades.md` (framework upgrades and breaking changes), and `dead-code-and-deprecation.md` (implementation), `migration-strategy.md` (strangler and modular monolith; architecture), `hotfix.md` (devops) |
| chayen-ai-engineering | All 10 in D17, plus agent action risk (D18) | `ml-data.md`, `ml-experiments-and-evaluation.md`, `model-serving.md`, `rag.md`, `llm-and-agent-evaluation.md`, `llm-safety.md`, `llm-observability.md`, `agent-governance.md`, plus the `ai-tooling.md` technology reference |
| D18 across seven skills | The other 9 in D18 | `pull-requests-and-review.md` (standards check; documentation), `change-summary.md` (passport and evidence audit; implementation), `policy-as-code.md` and `release-and-rollout.md` (go/no-go; devops), `access-reviews.md` and `sbom-and-licenses.md` (obligations; security), `retention-and-governance.md` (governance check; data), `decision-records.md` (waivers; architecture) |
| D19 across five skills | All 9 in D19 | `api-design.md` (GraphQL), `external-integrations.md` (webhooks), `idempotency-and-consistency.md` (ledgers), and `file-processing.md` (backend); `realtime-systems.md` and `resilience.md` (multi-region; architecture); `search-and-indexing.md` and `geospatial.md` (data); `browser-extensions.md` (frontend) |
| chayen-ai-engineering (D20) | All 8 in D20 | `agent-skills.md` (authoring, review, migration), `llm-and-agent-evaluation.md` (skill testing, benchmarking), `provider-compatibility.md`, `agent-governance.md` (instruction conflicts), `session-handoff.md` |

These records are IMPLEMENTED, not VERIFIED. Their `verification_evidence`
says that the recipe and case-level behaviour evals (G-12) and the trigger
evals (G-11) are NOT_RUN.

### 6.2 IN_PROGRESS (pilot content, recipe still planned)

None after Step 17. The last IN_PROGRESS record (CAP-18-002 change-passport,
backed by `change-summary.md`) became IMPLEMENTED.

The Step 06 trigger results apply to the **skills**, not to individual
capabilities. Examples are backend 5/5 and frontend 4/4 on Claude Code, and
security under-triggering (R-23). They are cited in the relevant records'
`verification` and `notes`.

---

## 7. Overlaps and consolidation (D-024)

### 7.1 Two mechanisms

| Mechanism | When | Effect |
|---|---|---|
| **Consolidation group** (`consolidation: CG-nn`) | The capabilities do the same work on the same artifacts, and they map to the **same** entry skill | One recipe file serves every member. Each member keeps its own ID, triggers, outputs, and status. |
| **Overlap** (`overlaps: [...]`) | The work is related but belongs in different recipes or skills | No merge. Each record's negative triggers send the other's prompts to it, and the skill bodies hand off by name. |

Cross-skill consolidation is not used. Under D-016, a skill cannot link
another skill's references (V-08). If U-11 and U-13 are later shown safe on
every provider, shared knowledge files could merge overlapping recipes across
skills. Examples are `error-handling` with `frontend-error-handling`, and
`bug-fix` across the backend, frontend, and testing skills.

### 7.2 Overlaps that need care

| Overlap | Risk | Planned resolution |
|---|---|---|
| bug-fix (implementation) and the pilot backend, frontend, and testing skills | One prompt may attract several skills (R-21). The recipe cannot be shared. | Keep short bug workflows in the layer skills, and treat the full recipe as the cross-layer case. Measure with ambiguous trigger cases. |
| code-review-assistant and secure-code-review | Built-in provider review skills also compete (R-25) | Distinct descriptions (quality versus vulnerabilities), with a no-plugin arm in the evals |
| schema-migration (data) and the backend `data-access.md` migrations section | Duplicate guidance after `chayen-data` exists | When `chayen-data` is authored, move the migration guidance and leave a hand-off line in backend |
| technical-debt-inventory (repository) and technical-debt-prioritization (modernization) | Similar prompts | Inventory is read-only discovery. Prioritization ranks an existing list. |

### 7.3 Pilot boundary changes required later

These records conflict with a pilot skill's current "When not to use" text or
description. Each change belongs to the step that implements the recipe.
**Step 09 made the change for CAP-01-005 and CAP-01-006**: `chayen-repository`
now covers read-only history and ownership, and git operations remain
excluded.

| Capability | Current pilot boundary | Change needed |
|---|---|---|
| CAP-01-005 git-history-analysis, CAP-01-006 code-ownership-analysis | **Done in Step 09** (description, scope line, "When not to use") | Read-only history and ownership analysis allowed. General git operations stay out (CAP-16-010). |
| CAP-10-010 fuzz-testing | `chayen-testing` excluded "fuzzing campaigns" | **Done in Step 13** (scope line, "When not to use", description): fuzz tests of the user's own code are in scope; fuzzing systems the user does not own stays out. |
| CAP-19-009 browser-extension-development | The `chayen-frontend` description names web applications only | Add browser extensions to the description, subject to the budget in §5.2 |
| CAP-08-001..008 (D08) | `chayen-frontend` excluded native mobile and desktop UI | **Done in Step 12** (description, scope line, "When not to use"; D-032 PROPOSED): web-technology shells are in scope, native toolkits stay out. |
| CAP-18-005 access-control-review | `chayen-security` excludes cloud hardening without application code | Allow a read-only review of exported grants, or remap |

---

## 8. Scope questions and gaps

- **D08 Mobile-Desktop (Q-11).**
  - The charter lists no mobile or desktop stack.
  - The records map to web-technology shells: PWA, Capacitor/Ionic,
    Electron, and Tauri, built with Angular, React, Vue, or TypeScript.
  - Native toolkits stay out of scope, and their prompts appear as negative
    triggers ("→ native answer").
  - If the user wants native support, the charter stack list and REQ-05
    acceptance change through a decision record (BC-20).
  - **Step 12:** implemented on this basis (D-032, PROPOSED). Q-11 stays
    open until the user approves or changes the scope.
- **Java (STK-14, Q-08).** No record lists `java`. It stays an optional
  extension, and records can add it later without changing identities.
- **Legal and compliance edges.**
  - privacy-impact-assessment, license-obligation-review, and data-retention
    state that they are not legal advice.
  - standards-compliance-check covers the team's own standards, not
    certification.
- **Offensive security.** fuzz-testing and llm-safety-redteam are limited to
  systems the user owns or is authorized to test. Their negative triggers
  decline other targets.
- **Stack signal.**
  - 107 records are stack-neutral (`any`).
  - The rest name packs or stack groups.
  - The primary stacks appear explicitly or through groups: `server-stacks`,
    `web-ui-stacks`, `sql-stacks`, `test-stacks`.

---

## 9. Verification approach

Every record carries its own verification sentence. They follow one pattern.

1. **Trigger eval:**
   - the record's positive prompts select the mapped entry skill;
   - its negative prompts do not;
   - at least 3 runs, with a no-plugin arm (R-26);
   - on Claude Code through the staged `claude plugin eval`, and on Codex and
     Copilot through `tests/routing/run-smoke.mjs`.
2. **Behaviour eval** on a fixture repository with seeded conditions. Each
   record states its concrete pass condition, for example "the seeded IDOR
   is reported with file and line". Fixture workspaces are a Step 06
   recommendation (POC_REPORT §6) and do not exist yet.
3. **Structural check:** V-11 (this checker) on every change. Promotion to
   IMPLEMENTED or VERIFIED is refused without evidence.

No capability-level verification has run. That is consistent with
0 VERIFIED. The 206 IMPLEMENTED records name their pending evals in
`verification_evidence`.

---

## 10. Generated tables

Do not edit by hand. Run `node tools/catalog/check-catalog.mjs --write-doc`.

<!-- BEGIN GENERATED: node tools/catalog/check-catalog.mjs --write-doc -->

### Totals by domain

| Domain | Title | Capabilities | PLANNED | IN_PROGRESS | IMPLEMENTED | VERIFIED | Entry skills used |
|---|---|---|---|---|---|---|---|
| D01 | REPOSITORY | 9 | 0 | 0 | 9 | 0 | chayen-repository (9) |
| D02 | REQUIREMENTS | 10 | 0 | 0 | 10 | 0 | chayen-requirements (10) |
| D03 | ARCHITECTURE | 10 | 0 | 0 | 10 | 0 | chayen-architecture (10) |
| D04 | PLANNING | 8 | 0 | 0 | 8 | 0 | chayen-implementation (4), chayen-requirements (1), chayen-architecture (3) |
| D05 | IMPLEMENTATION | 12 | 0 | 0 | 12 | 0 | chayen-implementation (12) |
| D06 | BACKEND | 10 | 0 | 0 | 10 | 0 | chayen-backend (10) |
| D07 | FRONTEND | 10 | 0 | 0 | 10 | 0 | chayen-frontend (10) |
| D08 | MOBILE-DESKTOP | 8 | 0 | 0 | 8 | 0 | chayen-frontend (8) |
| D09 | DATABASE-DATA | 12 | 0 | 0 | 12 | 0 | chayen-data (12) |
| D10 | TESTING-QA | 14 | 0 | 0 | 14 | 0 | chayen-testing (14) |
| D11 | SECURITY-PRIVACY | 14 | 0 | 0 | 14 | 0 | chayen-security (14) |
| D12 | PERFORMANCE | 10 | 0 | 0 | 10 | 0 | chayen-performance (10) |
| D13 | DEVOPS | 12 | 0 | 0 | 12 | 0 | chayen-devops (12) |
| D14 | OPERATIONS-SRE | 10 | 0 | 0 | 10 | 0 | chayen-devops (10) |
| D15 | MODERNIZATION | 10 | 0 | 0 | 10 | 0 | chayen-repository (2), chayen-implementation (5), chayen-architecture (2), chayen-devops (1) |
| D16 | DOCUMENTATION | 10 | 0 | 0 | 10 | 0 | chayen-documentation (10) |
| D17 | AI-ML-LLM | 10 | 0 | 0 | 10 | 0 | chayen-ai-engineering (10) |
| D18 | GOVERNANCE | 10 | 0 | 0 | 10 | 0 | chayen-documentation (1), chayen-implementation (2), chayen-devops (2), chayen-security (2), chayen-data (1), chayen-architecture (1), chayen-ai-engineering (1) |
| D19 | SPECIALIZED | 9 | 0 | 0 | 9 | 0 | chayen-backend (4), chayen-architecture (2), chayen-data (2), chayen-frontend (1) |
| D20 | AGENT-ENGINEERING | 8 | 0 | 0 | 8 | 0 | chayen-ai-engineering (8) |
| **All** | | **206** | **0** | **0** | **206** | **0** | |

### Totals by entry skill

| Entry skill | Skill file | Capabilities | IN_PROGRESS | Domains | Recipe files (existing / planned) |
|---|---|---|---|---|---|
| chayen-repository | existing | 11 | 0 | D01, D15 | 7 / 0 |
| chayen-requirements | existing | 11 | 0 | D02, D04 | 5 / 0 |
| chayen-architecture | existing | 18 | 0 | D03, D04, D15, D18, D19 | 9 / 0 |
| chayen-implementation | existing | 23 | 0 | D04, D05, D15, D18 | 13 / 0 |
| chayen-backend | existing | 14 | 0 | D06, D19 | 8 / 0 |
| chayen-frontend | existing | 19 | 0 | D07, D08, D19 | 12 / 0 |
| chayen-data | existing | 15 | 0 | D09, D18, D19 | 10 / 0 |
| chayen-testing | existing | 14 | 0 | D10 | 7 / 0 |
| chayen-security | existing | 16 | 0 | D11, D18 | 9 / 0 |
| chayen-performance | existing | 10 | 0 | D12 | 5 / 0 |
| chayen-devops | existing | 25 | 0 | D13, D14, D15, D18 | 15 / 0 |
| chayen-documentation | existing | 11 | 0 | D16, D18 | 6 / 0 |
| chayen-ai-engineering | existing | 19 | 0 | D17, D18, D20 | 11 / 0 |

### Consolidation groups (shared recipe, separate identities)

| Group | Recipe (plugin-relative) | Mapping | Members |
|---|---|---|---|
| CG-01 | `skills/chayen-repository/references/repository-profile.md` | existing | CAP-01-001 repo-onboarding<br>CAP-01-002 repository-map<br>CAP-01-007 convention-discovery |
| CG-02 | `skills/chayen-repository/references/dependency-and-impact.md` | existing | CAP-01-003 dependency-mapping<br>CAP-01-004 change-impact-analysis |
| CG-03 | `skills/chayen-repository/references/history-and-ownership.md` | existing | CAP-01-005 git-history-analysis<br>CAP-01-006 code-ownership-analysis |
| CG-04 | `skills/chayen-requirements/references/stories-and-acceptance.md` | existing | CAP-02-002 user-story-refinement<br>CAP-02-003 acceptance-criteria<br>CAP-02-008 edge-case-discovery |
| CG-05 | `skills/chayen-requirements/references/elicitation-and-modeling.md` | existing | CAP-02-001 requirement-elicitation<br>CAP-02-004 use-case-modeling<br>CAP-02-005 business-rule-extraction |
| CG-06 | `skills/chayen-requirements/references/scope-and-backlog.md` | existing | CAP-02-007 scope-and-dependency<br>CAP-02-010 backlog-decomposition<br>CAP-04-004 estimation-and-sizing |
| CG-07 | `skills/chayen-architecture/references/architecture-review.md` | existing | CAP-03-001 architecture-review<br>CAP-03-008 architecture-fitness |
| CG-08 | `skills/chayen-architecture/references/decision-records.md` | existing | CAP-03-002 architecture-option-analysis<br>CAP-03-003 architecture-decision-record<br>CAP-04-008 decision-register<br>CAP-18-009 exception-and-waiver-management |
| CG-09 | `skills/chayen-architecture/references/boundaries-and-domain.md` | existing | CAP-03-004 system-boundary-design<br>CAP-03-005 domain-modeling<br>CAP-03-006 component-design |
| CG-10 | `skills/chayen-architecture/references/resilience.md` | existing | CAP-03-010 resilience-design<br>CAP-19-008 multi-region-resilience |
| CG-11 | `skills/chayen-implementation/references/task-contract.md` | existing | CAP-04-001 task-contract<br>CAP-04-002 implementation-planning<br>CAP-04-003 risk-classification |
| CG-12 | `skills/chayen-architecture/references/migration-strategy.md` | existing | CAP-04-005 migration-planning<br>CAP-15-003 strangler-migration<br>CAP-15-008 monolith-modularization |
| CG-13 | `skills/chayen-devops/references/release-and-rollout.md` | existing | CAP-13-010 deployment-validation<br>CAP-13-011 rollback-verification<br>CAP-18-008 release-go-no-go |
| CG-14 | `skills/chayen-implementation/references/change-summary.md` | existing | CAP-04-007 handoff-summary<br>CAP-18-002 change-passport<br>CAP-18-003 task-evidence-audit |
| CG-15 | `skills/chayen-implementation/references/feature-delivery.md` | existing | CAP-05-001 feature-implementation<br>CAP-05-004 safe-code-edit |
| CG-16 | `skills/chayen-implementation/references/refactoring.md` | existing | CAP-05-003 code-refactoring<br>CAP-15-002 safe-refactor-plan |
| CG-17 | `skills/chayen-implementation/references/upgrades.md` | existing | CAP-05-008 dependency-upgrade<br>CAP-15-004 framework-version-upgrade<br>CAP-15-005 breaking-change-analysis |
| CG-18 | `skills/chayen-implementation/references/dead-code-and-deprecation.md` | existing | CAP-15-006 dead-code-analysis<br>CAP-15-007 deprecation-plan |
| CG-19 | `skills/chayen-implementation/references/configuration-and-flags.md` | existing | CAP-05-009 configuration-change<br>CAP-05-010 feature-flagging |
| CG-20 | `skills/chayen-backend/references/api-design.md` | existing | CAP-06-001 api-design<br>CAP-06-004 api-versioning<br>CAP-19-001 graphql-schema-evolution |
| CG-21 | `skills/chayen-backend/references/api-endpoints.md` | existing | CAP-06-002 api-implementation<br>CAP-06-003 api-contract-validation |
| CG-22 | `skills/chayen-backend/references/messaging.md` | existing | CAP-06-006 event-driven-integration<br>CAP-06-007 message-queue-design |
| CG-23 | `skills/chayen-backend/references/external-integrations.md` | existing | CAP-06-009 external-service-integration<br>CAP-19-005 webhook-safety |
| CG-24 | `skills/chayen-backend/references/idempotency-and-consistency.md` | existing | CAP-06-010 idempotency-and-retries<br>CAP-19-006 payments-and-ledger-consistency |
| CG-25 | `skills/chayen-frontend/references/ui-features.md` | existing | CAP-07-001 ui-feature-implementation<br>CAP-07-003 state-management<br>CAP-07-004 form-and-validation |
| CG-26 | `skills/chayen-frontend/references/layout-and-design-system.md` | existing | CAP-07-005 responsive-layout<br>CAP-07-008 design-system-integration |
| CG-27 | `skills/chayen-frontend/references/hybrid-mobile.md` | existing | CAP-08-001 mobile-feature<br>CAP-08-002 navigation-and-deep-link<br>CAP-08-006 app-lifecycle |
| CG-28 | `skills/chayen-frontend/references/offline-and-mobile-performance.md` | existing | CAP-08-003 offline-first<br>CAP-08-007 mobile-performance |
| CG-29 | `skills/chayen-data/references/schema-and-data-migration.md` | existing | CAP-09-002 schema-migration<br>CAP-09-007 data-migration<br>CAP-09-008 backfill-planning |
| CG-30 | `skills/chayen-data/references/query-performance.md` | existing | CAP-09-003 query-optimization<br>CAP-09-004 index-review |
| CG-31 | `skills/chayen-data/references/data-quality-and-integrity.md` | existing | CAP-09-006 data-integrity-validation<br>CAP-09-010 data-quality |
| CG-32 | `skills/chayen-data/references/retention-and-governance.md` | existing | CAP-09-011 data-retention<br>CAP-18-006 data-governance-check |
| CG-33 | `skills/chayen-testing/references/test-authoring.md` | existing | CAP-10-002 unit-test-generation<br>CAP-10-003 integration-test-design<br>CAP-10-004 e2e-test-automation<br>CAP-10-007 regression-testing |
| CG-34 | `skills/chayen-testing/references/api-and-contract-tests.md` | existing | CAP-10-005 contract-testing<br>CAP-10-006 api-test-automation |
| CG-35 | `skills/chayen-testing/references/advanced-test-techniques.md` | existing | CAP-10-008 property-based-testing<br>CAP-10-009 mutation-testing<br>CAP-10-010 fuzz-testing |
| CG-36 | `skills/chayen-testing/references/failing-and-flaky-tests.md` | existing | CAP-10-012 flaky-test-diagnosis<br>CAP-10-014 test-failure-triage |
| CG-37 | `skills/chayen-security/references/secure-review.md` | existing | CAP-11-002 secure-code-review<br>CAP-11-006 authorization-review<br>CAP-11-007 input-output-validation<br>CAP-11-008 ssrf-and-egress-review<br>CAP-11-009 crypto-usage-review<br>CAP-11-011 secure-logging |
| CG-38 | `skills/chayen-security/references/scanner-triage.md` | existing | CAP-11-003 sast-triage<br>CAP-11-004 dependency-vulnerability-triage |
| CG-39 | `skills/chayen-security/references/sbom-and-licenses.md` | existing | CAP-11-012 sbom-and-license-review<br>CAP-18-007 license-obligation-review |
| CG-40 | `skills/chayen-devops/references/containers.md` | existing | CAP-13-004 dockerfile-review<br>CAP-13-005 container-hardening |
| CG-41 | `skills/chayen-performance/references/baseline-and-profiling.md` | existing | CAP-12-001 performance-baselining<br>CAP-12-002 profiling<br>CAP-12-005 bottleneck-analysis |
| CG-42 | `skills/chayen-performance/references/load-testing.md` | existing | CAP-12-003 load-test-design<br>CAP-12-004 load-test-analysis |
| CG-43 | `skills/chayen-performance/references/budgets-and-capacity.md` | existing | CAP-12-007 latency-budget<br>CAP-12-008 capacity-planning<br>CAP-12-010 cost-performance-optimization |
| CG-44 | `skills/chayen-devops/references/pipelines.md` | existing | CAP-13-002 ci-pipeline-design<br>CAP-13-003 cd-pipeline-design |
| CG-45 | `skills/chayen-devops/references/releases-and-provenance.md` | existing | CAP-13-009 release-packaging<br>CAP-13-012 artifact-provenance |
| CG-46 | `skills/chayen-devops/references/observability.md` | existing | CAP-14-001 observability-design<br>CAP-14-002 structured-logging<br>CAP-14-003 metrics-and-slo<br>CAP-14-004 distributed-tracing |
| CG-47 | `skills/chayen-devops/references/alerting-and-incidents.md` | existing | CAP-14-005 alert-tuning<br>CAP-14-006 production-incident-triage |
| CG-48 | `skills/chayen-devops/references/rca-and-postmortems.md` | existing | CAP-14-007 root-cause-analysis<br>CAP-14-008 postmortem |
| CG-49 | `skills/chayen-documentation/references/project-docs.md` | existing | CAP-16-001 readme-maintenance<br>CAP-16-004 developer-onboarding-guide<br>CAP-16-008 knowledge-transfer |
| CG-50 | `skills/chayen-documentation/references/pull-requests-and-review.md` | existing | CAP-16-005 pull-request-preparation<br>CAP-16-006 code-review-assistant<br>CAP-16-007 review-comment-resolution<br>CAP-18-001 standards-compliance-check |
| CG-51 | `skills/chayen-ai-engineering/references/ml-data.md` | existing | CAP-17-001 dataset-readiness<br>CAP-17-005 ml-data-drift |
| CG-52 | `skills/chayen-ai-engineering/references/ml-experiments-and-evaluation.md` | existing | CAP-17-002 ml-experiment-design<br>CAP-17-003 model-evaluation |
| CG-53 | `skills/chayen-ai-engineering/references/rag.md` | existing | CAP-17-006 rag-pipeline-design<br>CAP-17-007 retrieval-evaluation |
| CG-54 | `skills/chayen-ai-engineering/references/llm-and-agent-evaluation.md` | existing | CAP-17-008 prompt-and-tool-evaluation<br>CAP-20-003 skill-testing<br>CAP-20-008 agent-task-benchmarking |
| CG-55 | `skills/chayen-ai-engineering/references/agent-governance.md` | existing | CAP-18-010 agent-action-risk-review<br>CAP-20-006 policy-conflict-detection |
| CG-56 | `skills/chayen-ai-engineering/references/agent-skills.md` | existing | CAP-20-001 skill-authoring<br>CAP-20-002 skill-review<br>CAP-20-004 skill-version-migration |
| CG-57 | `skills/chayen-frontend/references/device-permissions-and-push.md` | existing | CAP-08-004 device-permission-and-sensors<br>CAP-08-005 push-notification |

### Capability index

#### D01 REPOSITORY (9)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-01-001 | repo-onboarding | chayen-repository | repository-profile.md | CG-01 | IMPLEMENTED |
| CAP-01-002 | repository-map | chayen-repository | repository-profile.md | CG-01 | IMPLEMENTED |
| CAP-01-003 | dependency-mapping | chayen-repository | dependency-and-impact.md | CG-02 | IMPLEMENTED |
| CAP-01-004 | change-impact-analysis | chayen-repository | dependency-and-impact.md | CG-02 | IMPLEMENTED |
| CAP-01-005 | git-history-analysis | chayen-repository | history-and-ownership.md | CG-03 | IMPLEMENTED |
| CAP-01-006 | code-ownership-analysis | chayen-repository | history-and-ownership.md | CG-03 | IMPLEMENTED |
| CAP-01-007 | convention-discovery | chayen-repository | repository-profile.md | CG-01 | IMPLEMENTED |
| CAP-01-008 | technical-debt-inventory | chayen-repository | technical-debt-inventory.md | — | IMPLEMENTED |
| CAP-01-009 | unknowns-and-assumptions | chayen-repository | unknowns-and-assumptions.md | — | IMPLEMENTED |

#### D02 REQUIREMENTS (10)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-02-001 | requirement-elicitation | chayen-requirements | elicitation-and-modeling.md | CG-05 | IMPLEMENTED |
| CAP-02-002 | user-story-refinement | chayen-requirements | stories-and-acceptance.md | CG-04 | IMPLEMENTED |
| CAP-02-003 | acceptance-criteria | chayen-requirements | stories-and-acceptance.md | CG-04 | IMPLEMENTED |
| CAP-02-004 | use-case-modeling | chayen-requirements | elicitation-and-modeling.md | CG-05 | IMPLEMENTED |
| CAP-02-005 | business-rule-extraction | chayen-requirements | elicitation-and-modeling.md | CG-05 | IMPLEMENTED |
| CAP-02-006 | requirement-traceability | chayen-requirements | requirement-traceability.md | — | IMPLEMENTED |
| CAP-02-007 | scope-and-dependency | chayen-requirements | scope-and-backlog.md | CG-06 | IMPLEMENTED |
| CAP-02-008 | edge-case-discovery | chayen-requirements | stories-and-acceptance.md | CG-04 | IMPLEMENTED |
| CAP-02-009 | nonfunctional-requirements | chayen-requirements | nonfunctional-requirements.md | — | IMPLEMENTED |
| CAP-02-010 | backlog-decomposition | chayen-requirements | scope-and-backlog.md | CG-06 | IMPLEMENTED |

#### D03 ARCHITECTURE (10)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-03-001 | architecture-review | chayen-architecture | architecture-review.md | CG-07 | IMPLEMENTED |
| CAP-03-002 | architecture-option-analysis | chayen-architecture | decision-records.md | CG-08 | IMPLEMENTED |
| CAP-03-003 | architecture-decision-record | chayen-architecture | decision-records.md | CG-08 | IMPLEMENTED |
| CAP-03-004 | system-boundary-design | chayen-architecture | boundaries-and-domain.md | CG-09 | IMPLEMENTED |
| CAP-03-005 | domain-modeling | chayen-architecture | boundaries-and-domain.md | CG-09 | IMPLEMENTED |
| CAP-03-006 | component-design | chayen-architecture | boundaries-and-domain.md | CG-09 | IMPLEMENTED |
| CAP-03-007 | sequence-and-dataflow | chayen-architecture | sequence-and-dataflow.md | — | IMPLEMENTED |
| CAP-03-008 | architecture-fitness | chayen-architecture | architecture-review.md | CG-07 | IMPLEMENTED |
| CAP-03-009 | multitenancy-design | chayen-architecture | multitenancy.md | — | IMPLEMENTED |
| CAP-03-010 | resilience-design | chayen-architecture | resilience.md | CG-10 | IMPLEMENTED |

#### D04 PLANNING (8)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-04-001 | task-contract | chayen-implementation | task-contract.md | CG-11 | IMPLEMENTED |
| CAP-04-002 | implementation-planning | chayen-implementation | task-contract.md | CG-11 | IMPLEMENTED |
| CAP-04-003 | risk-classification | chayen-implementation | task-contract.md | CG-11 | IMPLEMENTED |
| CAP-04-004 | estimation-and-sizing | chayen-requirements | scope-and-backlog.md | CG-06 | IMPLEMENTED |
| CAP-04-005 | migration-planning | chayen-architecture | migration-strategy.md | CG-12 | IMPLEMENTED |
| CAP-04-006 | rollout-planning | chayen-architecture | rollout-planning.md | — | IMPLEMENTED |
| CAP-04-007 | handoff-summary | chayen-implementation | change-summary.md | CG-14 | IMPLEMENTED |
| CAP-04-008 | decision-register | chayen-architecture | decision-records.md | CG-08 | IMPLEMENTED |

#### D05 IMPLEMENTATION (12)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-05-001 | feature-implementation | chayen-implementation | feature-delivery.md | CG-15 | IMPLEMENTED |
| CAP-05-002 | bug-fix | chayen-implementation | bug-fix.md | — | IMPLEMENTED |
| CAP-05-003 | code-refactoring | chayen-implementation | refactoring.md | CG-16 | IMPLEMENTED |
| CAP-05-004 | safe-code-edit | chayen-implementation | feature-delivery.md | CG-15 | IMPLEMENTED |
| CAP-05-005 | algorithm-design | chayen-implementation | algorithm-design.md | — | IMPLEMENTED |
| CAP-05-006 | concurrency-safety | chayen-implementation | concurrency-safety.md | — | IMPLEMENTED |
| CAP-05-007 | error-handling | chayen-implementation | error-handling.md | — | IMPLEMENTED |
| CAP-05-008 | dependency-upgrade | chayen-implementation | upgrades.md | CG-17 | IMPLEMENTED |
| CAP-05-009 | configuration-change | chayen-implementation | configuration-and-flags.md | CG-19 | IMPLEMENTED |
| CAP-05-010 | feature-flagging | chayen-implementation | configuration-and-flags.md | CG-19 | IMPLEMENTED |
| CAP-05-011 | code-generation-from-contract | chayen-implementation | contract-codegen.md | — | IMPLEMENTED |
| CAP-05-012 | compatibility-preserving-change | chayen-implementation | compatibility.md | — | IMPLEMENTED |

#### D06 BACKEND (10)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-06-001 | api-design | chayen-backend | api-design.md | CG-20 | IMPLEMENTED |
| CAP-06-002 | api-implementation | chayen-backend | api-endpoints.md | CG-21 | IMPLEMENTED |
| CAP-06-003 | api-contract-validation | chayen-backend | api-endpoints.md | CG-21 | IMPLEMENTED |
| CAP-06-004 | api-versioning | chayen-backend | api-design.md | CG-20 | IMPLEMENTED |
| CAP-06-005 | authentication-authorization-implementation | chayen-backend | authn-authz.md | — | IMPLEMENTED |
| CAP-06-006 | event-driven-integration | chayen-backend | messaging.md | CG-22 | IMPLEMENTED |
| CAP-06-007 | message-queue-design | chayen-backend | messaging.md | CG-22 | IMPLEMENTED |
| CAP-06-008 | background-job-design | chayen-backend | background-jobs.md | — | IMPLEMENTED |
| CAP-06-009 | external-service-integration | chayen-backend | external-integrations.md | CG-23 | IMPLEMENTED |
| CAP-06-010 | idempotency-and-retries | chayen-backend | idempotency-and-consistency.md | CG-24 | IMPLEMENTED |

#### D07 FRONTEND (10)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-07-001 | ui-feature-implementation | chayen-frontend | ui-features.md | CG-25 | IMPLEMENTED |
| CAP-07-002 | component-architecture | chayen-frontend | component-architecture.md | — | IMPLEMENTED |
| CAP-07-003 | state-management | chayen-frontend | ui-features.md | CG-25 | IMPLEMENTED |
| CAP-07-004 | form-and-validation | chayen-frontend | ui-features.md | CG-25 | IMPLEMENTED |
| CAP-07-005 | responsive-layout | chayen-frontend | layout-and-design-system.md | CG-26 | IMPLEMENTED |
| CAP-07-006 | accessibility-audit | chayen-frontend | accessibility.md | — | IMPLEMENTED |
| CAP-07-007 | frontend-performance | chayen-frontend | frontend-performance.md | — | IMPLEMENTED |
| CAP-07-008 | design-system-integration | chayen-frontend | layout-and-design-system.md | CG-26 | IMPLEMENTED |
| CAP-07-009 | internationalization | chayen-frontend | internationalization.md | — | IMPLEMENTED |
| CAP-07-010 | frontend-error-handling | chayen-frontend | frontend-error-handling.md | — | IMPLEMENTED |

#### D08 MOBILE-DESKTOP (8)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-08-001 | mobile-feature | chayen-frontend | hybrid-mobile.md | CG-27 | IMPLEMENTED |
| CAP-08-002 | navigation-and-deep-link | chayen-frontend | hybrid-mobile.md | CG-27 | IMPLEMENTED |
| CAP-08-003 | offline-first | chayen-frontend | offline-and-mobile-performance.md | CG-28 | IMPLEMENTED |
| CAP-08-004 | device-permission-and-sensors | chayen-frontend | device-permissions-and-push.md | CG-57 | IMPLEMENTED |
| CAP-08-005 | push-notification | chayen-frontend | device-permissions-and-push.md | CG-57 | IMPLEMENTED |
| CAP-08-006 | app-lifecycle | chayen-frontend | hybrid-mobile.md | CG-27 | IMPLEMENTED |
| CAP-08-007 | mobile-performance | chayen-frontend | offline-and-mobile-performance.md | CG-28 | IMPLEMENTED |
| CAP-08-008 | desktop-packaging-and-update | chayen-frontend | desktop-packaging.md | — | IMPLEMENTED |

#### D09 DATABASE-DATA (12)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-09-001 | data-modeling | chayen-data | data-modeling.md | — | IMPLEMENTED |
| CAP-09-002 | schema-migration | chayen-data | schema-and-data-migration.md | CG-29 | IMPLEMENTED |
| CAP-09-003 | query-optimization | chayen-data | query-performance.md | CG-30 | IMPLEMENTED |
| CAP-09-004 | index-review | chayen-data | query-performance.md | CG-30 | IMPLEMENTED |
| CAP-09-005 | transaction-consistency | chayen-data | transactions.md | — | IMPLEMENTED |
| CAP-09-006 | data-integrity-validation | chayen-data | data-quality-and-integrity.md | CG-31 | IMPLEMENTED |
| CAP-09-007 | data-migration | chayen-data | schema-and-data-migration.md | CG-29 | IMPLEMENTED |
| CAP-09-008 | backfill-planning | chayen-data | schema-and-data-migration.md | CG-29 | IMPLEMENTED |
| CAP-09-009 | etl-pipeline | chayen-data | etl-pipelines.md | — | IMPLEMENTED |
| CAP-09-010 | data-quality | chayen-data | data-quality-and-integrity.md | CG-31 | IMPLEMENTED |
| CAP-09-011 | data-retention | chayen-data | retention-and-governance.md | CG-32 | IMPLEMENTED |
| CAP-09-012 | backup-restore-drill | chayen-data | backup-restore.md | — | IMPLEMENTED |

#### D10 TESTING-QA (14)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-10-001 | test-strategy | chayen-testing | test-strategy.md | — | IMPLEMENTED |
| CAP-10-002 | unit-test-generation | chayen-testing | test-authoring.md | CG-33 | IMPLEMENTED |
| CAP-10-003 | integration-test-design | chayen-testing | test-authoring.md | CG-33 | IMPLEMENTED |
| CAP-10-004 | e2e-test-automation | chayen-testing | test-authoring.md | CG-33 | IMPLEMENTED |
| CAP-10-005 | contract-testing | chayen-testing | api-and-contract-tests.md | CG-34 | IMPLEMENTED |
| CAP-10-006 | api-test-automation | chayen-testing | api-and-contract-tests.md | CG-34 | IMPLEMENTED |
| CAP-10-007 | regression-testing | chayen-testing | test-authoring.md | CG-33 | IMPLEMENTED |
| CAP-10-008 | property-based-testing | chayen-testing | advanced-test-techniques.md | CG-35 | IMPLEMENTED |
| CAP-10-009 | mutation-testing | chayen-testing | advanced-test-techniques.md | CG-35 | IMPLEMENTED |
| CAP-10-010 | fuzz-testing | chayen-testing | advanced-test-techniques.md | CG-35 | IMPLEMENTED |
| CAP-10-011 | test-data-factory | chayen-testing | test-data.md | — | IMPLEMENTED |
| CAP-10-012 | flaky-test-diagnosis | chayen-testing | failing-and-flaky-tests.md | CG-36 | IMPLEMENTED |
| CAP-10-013 | test-coverage-gap | chayen-testing | coverage-gaps.md | — | IMPLEMENTED |
| CAP-10-014 | test-failure-triage | chayen-testing | failing-and-flaky-tests.md | CG-36 | IMPLEMENTED |

#### D11 SECURITY-PRIVACY (14)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-11-001 | threat-modeling | chayen-security | threat-modeling.md | — | IMPLEMENTED |
| CAP-11-002 | secure-code-review | chayen-security | secure-review.md | CG-37 | IMPLEMENTED |
| CAP-11-003 | sast-triage | chayen-security | scanner-triage.md | CG-38 | IMPLEMENTED |
| CAP-11-004 | dependency-vulnerability-triage | chayen-security | scanner-triage.md | CG-38 | IMPLEMENTED |
| CAP-11-005 | secret-detection-and-rotation-plan | chayen-security | secret-exposure-response.md | — | IMPLEMENTED |
| CAP-11-006 | authorization-review | chayen-security | secure-review.md | CG-37 | IMPLEMENTED |
| CAP-11-007 | input-output-validation | chayen-security | secure-review.md | CG-37 | IMPLEMENTED |
| CAP-11-008 | ssrf-and-egress-review | chayen-security | secure-review.md | CG-37 | IMPLEMENTED |
| CAP-11-009 | crypto-usage-review | chayen-security | secure-review.md | CG-37 | IMPLEMENTED |
| CAP-11-010 | privacy-impact-assessment | chayen-security | privacy.md | — | IMPLEMENTED |
| CAP-11-011 | secure-logging | chayen-security | secure-review.md | CG-37 | IMPLEMENTED |
| CAP-11-012 | sbom-and-license-review | chayen-security | sbom-and-licenses.md | CG-39 | IMPLEMENTED |
| CAP-11-013 | container-iac-security-review | chayen-security | infrastructure-security-review.md | — | IMPLEMENTED |
| CAP-11-014 | vulnerability-remediation | chayen-security | vulnerability-remediation.md | — | IMPLEMENTED |

#### D12 PERFORMANCE (10)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-12-001 | performance-baselining | chayen-performance | baseline-and-profiling.md | CG-41 | IMPLEMENTED |
| CAP-12-002 | profiling | chayen-performance | baseline-and-profiling.md | CG-41 | IMPLEMENTED |
| CAP-12-003 | load-test-design | chayen-performance | load-testing.md | CG-42 | IMPLEMENTED |
| CAP-12-004 | load-test-analysis | chayen-performance | load-testing.md | CG-42 | IMPLEMENTED |
| CAP-12-005 | bottleneck-analysis | chayen-performance | baseline-and-profiling.md | CG-41 | IMPLEMENTED |
| CAP-12-006 | memory-leak-analysis | chayen-performance | memory-leaks.md | — | IMPLEMENTED |
| CAP-12-007 | latency-budget | chayen-performance | budgets-and-capacity.md | CG-43 | IMPLEMENTED |
| CAP-12-008 | capacity-planning | chayen-performance | budgets-and-capacity.md | CG-43 | IMPLEMENTED |
| CAP-12-009 | cache-strategy | chayen-performance | caching.md | — | IMPLEMENTED |
| CAP-12-010 | cost-performance-optimization | chayen-performance | budgets-and-capacity.md | CG-43 | IMPLEMENTED |

#### D13 DEVOPS (12)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-13-001 | build-system-setup | chayen-devops | build-systems.md | — | IMPLEMENTED |
| CAP-13-002 | ci-pipeline-design | chayen-devops | pipelines.md | CG-44 | IMPLEMENTED |
| CAP-13-003 | cd-pipeline-design | chayen-devops | pipelines.md | CG-44 | IMPLEMENTED |
| CAP-13-004 | dockerfile-review | chayen-devops | containers.md | CG-40 | IMPLEMENTED |
| CAP-13-005 | container-hardening | chayen-devops | containers.md | CG-40 | IMPLEMENTED |
| CAP-13-006 | infrastructure-as-code | chayen-devops | infrastructure-as-code.md | — | IMPLEMENTED |
| CAP-13-007 | environment-parity | chayen-devops | environment-parity.md | — | IMPLEMENTED |
| CAP-13-008 | secrets-management | chayen-devops | secrets-management.md | — | IMPLEMENTED |
| CAP-13-009 | release-packaging | chayen-devops | releases-and-provenance.md | CG-45 | IMPLEMENTED |
| CAP-13-010 | deployment-validation | chayen-devops | release-and-rollout.md | CG-13 | IMPLEMENTED |
| CAP-13-011 | rollback-verification | chayen-devops | release-and-rollout.md | CG-13 | IMPLEMENTED |
| CAP-13-012 | artifact-provenance | chayen-devops | releases-and-provenance.md | CG-45 | IMPLEMENTED |

#### D14 OPERATIONS-SRE (10)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-14-001 | observability-design | chayen-devops | observability.md | CG-46 | IMPLEMENTED |
| CAP-14-002 | structured-logging | chayen-devops | observability.md | CG-46 | IMPLEMENTED |
| CAP-14-003 | metrics-and-slo | chayen-devops | observability.md | CG-46 | IMPLEMENTED |
| CAP-14-004 | distributed-tracing | chayen-devops | observability.md | CG-46 | IMPLEMENTED |
| CAP-14-005 | alert-tuning | chayen-devops | alerting-and-incidents.md | CG-47 | IMPLEMENTED |
| CAP-14-006 | production-incident-triage | chayen-devops | alerting-and-incidents.md | CG-47 | IMPLEMENTED |
| CAP-14-007 | root-cause-analysis | chayen-devops | rca-and-postmortems.md | CG-48 | IMPLEMENTED |
| CAP-14-008 | postmortem | chayen-devops | rca-and-postmortems.md | CG-48 | IMPLEMENTED |
| CAP-14-009 | disaster-recovery-planning | chayen-devops | disaster-recovery.md | — | IMPLEMENTED |
| CAP-14-010 | runbook-generation | chayen-devops | runbooks.md | — | IMPLEMENTED |

#### D15 MODERNIZATION (10)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-15-001 | legacy-system-assessment | chayen-repository | legacy-assessment.md | — | IMPLEMENTED |
| CAP-15-002 | safe-refactor-plan | chayen-implementation | refactoring.md | CG-16 | IMPLEMENTED |
| CAP-15-003 | strangler-migration | chayen-architecture | migration-strategy.md | CG-12 | IMPLEMENTED |
| CAP-15-004 | framework-version-upgrade | chayen-implementation | upgrades.md | CG-17 | IMPLEMENTED |
| CAP-15-005 | breaking-change-analysis | chayen-implementation | upgrades.md | CG-17 | IMPLEMENTED |
| CAP-15-006 | dead-code-analysis | chayen-implementation | dead-code-and-deprecation.md | CG-18 | IMPLEMENTED |
| CAP-15-007 | deprecation-plan | chayen-implementation | dead-code-and-deprecation.md | CG-18 | IMPLEMENTED |
| CAP-15-008 | monolith-modularization | chayen-architecture | migration-strategy.md | CG-12 | IMPLEMENTED |
| CAP-15-009 | hotfix-preparation | chayen-devops | hotfix.md | — | IMPLEMENTED |
| CAP-15-010 | technical-debt-prioritization | chayen-repository | technical-debt-prioritization.md | — | IMPLEMENTED |

#### D16 DOCUMENTATION (10)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-16-001 | readme-maintenance | chayen-documentation | project-docs.md | CG-49 | IMPLEMENTED |
| CAP-16-002 | api-documentation | chayen-documentation | api-docs.md | — | IMPLEMENTED |
| CAP-16-003 | architecture-documentation | chayen-documentation | architecture-docs.md | — | IMPLEMENTED |
| CAP-16-004 | developer-onboarding-guide | chayen-documentation | project-docs.md | CG-49 | IMPLEMENTED |
| CAP-16-005 | pull-request-preparation | chayen-documentation | pull-requests-and-review.md | CG-50 | IMPLEMENTED |
| CAP-16-006 | code-review-assistant | chayen-documentation | pull-requests-and-review.md | CG-50 | IMPLEMENTED |
| CAP-16-007 | review-comment-resolution | chayen-documentation | pull-requests-and-review.md | CG-50 | IMPLEMENTED |
| CAP-16-008 | knowledge-transfer | chayen-documentation | project-docs.md | CG-49 | IMPLEMENTED |
| CAP-16-009 | release-notes | chayen-documentation | release-notes.md | — | IMPLEMENTED |
| CAP-16-010 | git-workflow-assistant | chayen-documentation | git-workflow.md | — | IMPLEMENTED |

#### D17 AI-ML-LLM (10)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-17-001 | dataset-readiness | chayen-ai-engineering | ml-data.md | CG-51 | IMPLEMENTED |
| CAP-17-002 | ml-experiment-design | chayen-ai-engineering | ml-experiments-and-evaluation.md | CG-52 | IMPLEMENTED |
| CAP-17-003 | model-evaluation | chayen-ai-engineering | ml-experiments-and-evaluation.md | CG-52 | IMPLEMENTED |
| CAP-17-004 | model-serving | chayen-ai-engineering | model-serving.md | — | IMPLEMENTED |
| CAP-17-005 | ml-data-drift | chayen-ai-engineering | ml-data.md | CG-51 | IMPLEMENTED |
| CAP-17-006 | rag-pipeline-design | chayen-ai-engineering | rag.md | CG-53 | IMPLEMENTED |
| CAP-17-007 | retrieval-evaluation | chayen-ai-engineering | rag.md | CG-53 | IMPLEMENTED |
| CAP-17-008 | prompt-and-tool-evaluation | chayen-ai-engineering | llm-and-agent-evaluation.md | CG-54 | IMPLEMENTED |
| CAP-17-009 | llm-safety-redteam | chayen-ai-engineering | llm-safety.md | — | IMPLEMENTED |
| CAP-17-010 | llm-observability | chayen-ai-engineering | llm-observability.md | — | IMPLEMENTED |

#### D18 GOVERNANCE (10)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-18-001 | standards-compliance-check | chayen-documentation | pull-requests-and-review.md | CG-50 | IMPLEMENTED |
| CAP-18-002 | change-passport | chayen-implementation | change-summary.md | CG-14 | IMPLEMENTED |
| CAP-18-003 | task-evidence-audit | chayen-implementation | change-summary.md | CG-14 | IMPLEMENTED |
| CAP-18-004 | policy-as-code-validation | chayen-devops | policy-as-code.md | — | IMPLEMENTED |
| CAP-18-005 | access-control-review | chayen-security | access-reviews.md | — | IMPLEMENTED |
| CAP-18-006 | data-governance-check | chayen-data | retention-and-governance.md | CG-32 | IMPLEMENTED |
| CAP-18-007 | license-obligation-review | chayen-security | sbom-and-licenses.md | CG-39 | IMPLEMENTED |
| CAP-18-008 | release-go-no-go | chayen-devops | release-and-rollout.md | CG-13 | IMPLEMENTED |
| CAP-18-009 | exception-and-waiver-management | chayen-architecture | decision-records.md | CG-08 | IMPLEMENTED |
| CAP-18-010 | agent-action-risk-review | chayen-ai-engineering | agent-governance.md | CG-55 | IMPLEMENTED |

#### D19 SPECIALIZED (9)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-19-001 | graphql-schema-evolution | chayen-backend | api-design.md | CG-20 | IMPLEMENTED |
| CAP-19-002 | realtime-system-design | chayen-architecture | realtime-systems.md | — | IMPLEMENTED |
| CAP-19-003 | search-and-indexing | chayen-data | search-and-indexing.md | — | IMPLEMENTED |
| CAP-19-004 | file-processing-pipeline | chayen-backend | file-processing.md | — | IMPLEMENTED |
| CAP-19-005 | webhook-safety | chayen-backend | external-integrations.md | CG-23 | IMPLEMENTED |
| CAP-19-006 | payments-and-ledger-consistency | chayen-backend | idempotency-and-consistency.md | CG-24 | IMPLEMENTED |
| CAP-19-007 | geospatial-systems | chayen-data | geospatial.md | — | IMPLEMENTED |
| CAP-19-008 | multi-region-resilience | chayen-architecture | resilience.md | CG-10 | IMPLEMENTED |
| CAP-19-009 | browser-extension-development | chayen-frontend | browser-extensions.md | — | IMPLEMENTED |

#### D20 AGENT-ENGINEERING (8)

| ID | Capability | Entry skill | Recipe | Group | Status |
|---|---|---|---|---|---|
| CAP-20-001 | skill-authoring | chayen-ai-engineering | agent-skills.md | CG-56 | IMPLEMENTED |
| CAP-20-002 | skill-review | chayen-ai-engineering | agent-skills.md | CG-56 | IMPLEMENTED |
| CAP-20-003 | skill-testing | chayen-ai-engineering | llm-and-agent-evaluation.md | CG-54 | IMPLEMENTED |
| CAP-20-004 | skill-version-migration | chayen-ai-engineering | agent-skills.md | CG-56 | IMPLEMENTED |
| CAP-20-005 | provider-compatibility | chayen-ai-engineering | provider-compatibility.md | — | IMPLEMENTED |
| CAP-20-006 | policy-conflict-detection | chayen-ai-engineering | agent-governance.md | CG-55 | IMPLEMENTED |
| CAP-20-007 | agent-session-handoff | chayen-ai-engineering | session-handoff.md | — | IMPLEMENTED |
| CAP-20-008 | agent-task-benchmarking | chayen-ai-engineering | llm-and-agent-evaluation.md | CG-54 | IMPLEMENTED |

<!-- END GENERATED -->
