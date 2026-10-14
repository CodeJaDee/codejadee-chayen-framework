# Engineering Coverage Audit

| Field | Value |
|---|---|
| Step | 19 |
| Date | 2026-10-14 |
| Scope | All 20 domains and all 206 capability records in [`catalog/engineering-capabilities.yaml`](../../catalog/engineering-capabilities.yaml), the 13 entry skills, 117 recipe files, and the evaluation cases |
| Audit tool | `node tools/catalog/audit-coverage.mjs` (developer-only, no dependencies; `--markdown` and `--json` outputs) |
| Result | **Static audit PASS: 206/206 capabilities meet all ten static criteria** after nine fixes in this step. **0/206 are VERIFIED**: no behaviour or trigger evaluation has run. |

## 1. Verdict

| Measure | Value | Meaning |
|---|---|---|
| Total expected | **206** in 20 domains | The user's Step 07 inventory, embedded verbatim in `tools/catalog/check-catalog.mjs` |
| Catalog records | 206 | One record per inventory name |
| Unique IDs / unique names | 206 / 206 | No duplicates |
| Names match the inventory exactly | **Yes** | Same names, same domains, same order; inventory fingerprint `2f13cad24ff431e3` matches |
| Implemented | **206** (status IMPLEMENTED) | Each has an existing recipe that lists it, an existing entry skill, and `verification_evidence` |
| Passing all ten static criteria | **206 / 206** | First audit run: 198 / 206 (8 failures), plus 1 gap found in manual review; all 9 fixed in this step |
| Validated (VERIFIED) | **0 / 206** | Behaviour evals (G-12) and trigger evals (G-11) have not run; no fixture repositories or eval runner exist |
| Missing items | **0** | No inventory name absent from the catalog; no catalog name outside the inventory |
| Incomplete recipes | **0 remaining** (9 found and fixed, §4) | |
| Duplicate names | **0** | |
| Broken mappings | **0** | Catalog, recipe frontmatter, skill reference tables, and evaluation cases agree (§5) |
| False-positive routing risks | **Unmeasured; 8 risk areas identified** (§6) | Trigger evals are NOT_RUN |

"Implemented" here means complete static content that passes every automated
check. It does not mean the guidance has been shown to work: that is what
VERIFIED requires, and no capability has reached it.

## 2. Criteria and how each was checked

| # | Criterion | Automated check (`audit-coverage.mjs`) | Limits |
|---|---|---|---|
| C1 | Exists in the canonical catalog | Record present at the inventory position with the exact name and domain; unique ID and name | — |
| C2 | Valid implementation mapping | Entry skill shipped and `existing`; recipe `existing`, on disk, inside the entry skill; recipe frontmatter lists the ID; status IMPLEMENTED with `verification_evidence` | — |
| C3 | Substantive procedure | Recipe `## Procedure` has at least 3 numbered steps and 80 words; at least 50 % of the record's purpose and output terms appear in the recipe | Term coverage is a heuristic for topical coverage, not correctness. Lowest values were reviewed by hand (§4). |
| C4 | Applicable entry skill | The recipe is listed in the skill's `## References` table with a load condition; the skill description has a boundary clause | Whether the description attracts the right prompts is a routing question (§6) |
| C5 | Working reference paths | Every `existing_coverage` path exists; every relative link in the recipe resolves | — |
| C6 | Positive evaluation cases | At least one positive recipe case, whose expected skill and loaded recipe match the catalog mapping, with checks | Cases exist; none has been executed |
| C7 | Negative evaluation cases | At least one negative case whose `not_loads` is this recipe, with a better-fit skill or `none` | As C6 |
| C8 | Input and output guidance | Record has inputs and outputs; recipe `## Inputs` at least 15 words and `## Outputs` at least 12 | — |
| C9 | Safety and verification rules | Recipe `## Verification` has at least 2 bullets and 25 words and states an observable check and how it is reported; entry skill `## Safety boundaries` at least 40 words; record has a verification approach | Wording-based; reviewed by hand for the failures |
| C10 | Not a placeholder | No TODO, TBD, FIXME, or lorem ipsum in prose; at least 35 non-empty lines; every required recipe section at least 12 words | — |

The package validators (V-05 to V-22) and the catalog checker (V-11) also
ran and passed (§7). They cover the structural rules the audit builds on:
reference kinds, link depth, budgets, wording, and catalog consistency.

## 3. Results by domain

The per-capability table with every criterion is in §9.

| Domain | Capabilities | Implemented | Verified | All 10 criteria pass |
|---|---|---|---|---|
| D01 | 9 | 9 | 0 | 9 |
| D02 | 10 | 10 | 0 | 10 |
| D03 | 10 | 10 | 0 | 10 |
| D04 | 8 | 8 | 0 | 8 |
| D05 | 12 | 12 | 0 | 12 |
| D06 | 10 | 10 | 0 | 10 |
| D07 | 10 | 10 | 0 | 10 |
| D08 | 8 | 8 | 0 | 8 |
| D09 | 12 | 12 | 0 | 12 |
| D10 | 14 | 14 | 0 | 14 |
| D11 | 14 | 14 | 0 | 14 |
| D12 | 10 | 10 | 0 | 10 |
| D13 | 12 | 12 | 0 | 12 |
| D14 | 10 | 10 | 0 | 10 |
| D15 | 10 | 10 | 0 | 10 |
| D16 | 10 | 10 | 0 | 10 |
| D17 | 10 | 10 | 0 | 10 |
| D18 | 10 | 10 | 0 | 10 |
| D19 | 9 | 9 | 0 | 9 |
| D20 | 8 | 8 | 0 | 8 |

## 4. Incomplete items found and fixed

The first audit run reported 198/206 passing. All failures were C9: the
recipe's `## Verification` named observable checks but not how to report
them (PASS, FAIL, or NOT_RUN with the command), which the authoring
standard requires (RC-07). A manual review of the lowest term-coverage
records found one more gap.

| # | Capability | Recipe | Gap | Fix |
|---|---|---|---|---|
| 1–3 | CAP-02-002, CAP-02-003, CAP-02-008 | `chayen-requirements/references/stories-and-acceptance.md` | No reporting rule in Verification | Added: each check reported PASS or FAIL with its story or criterion, or NOT_RUN with the reason |
| 4 | CAP-11-010 | `chayen-security/references/privacy.md` | As above | Added a reporting rule per field or risk |
| 5 | CAP-13-008 | `chayen-devops/references/secrets-management.md` | As above | Added: PASS, FAIL, or NOT_RUN with the search and build or test commands |
| 6–7 | CAP-13-009, CAP-13-012 | `chayen-devops/references/releases-and-provenance.md` | As above | Added: pack, sign, and verify steps reported with commands; pipeline-only steps NOT_RUN locally |
| 8 | CAP-16-009 | `chayen-documentation/references/release-notes.md` | As above | Added: the range check reported with the `git log` or platform query |
| 9 | CAP-04-003 risk-classification | `chayen-implementation/references/task-contract.md` | The record names five risk dimensions (data loss, security, availability, compatibility, reversibility); the risk-class table did not cover availability | Added a rating step for all five dimensions and availability risk to the High class |

**Manual review of the lowest term coverage** (64–77 %): CAP-11-009,
CAP-04-008, CAP-04-003, CAP-10-006, CAP-01-001, CAP-03-008, CAP-01-004,
CAP-10-008, CAP-07-003, CAP-10-011. Apart from CAP-04-003 above, the
missing terms were word-form differences (for example "randomness" versus
"non-crypto random", "shrinking" versus "shrunk counterexample") and the
recipes cover the record's outputs.

**Traceability observation (not a failure):** 48 capabilities share a recipe
whose procedure does not label a section with their ID. These are the
Step 08–11 recipes written before the labelling convention, plus a few later
ones whose shared procedure serves all members. Their term coverage is 65 %
to 100 % (median for all records 94 %), and they pass every criterion. A
later step could add ID-labelled sub-sections so behaviour evals can be
traced to procedure steps:

CAP-01-001, 002, 003, 004, 005, 006, 007; CAP-02-001, 002, 003, 004, 005,
007, 008, 010; CAP-03-001, 002, 003, 004, 005, 006, 008, 010; CAP-04-001,
002, 003, 004, 005, 007, 008; CAP-05-001, 004, 008, 009, 010; CAP-06-001,
002, 003, 004, 006, 007, 009, 010; CAP-09-011; CAP-11-012; CAP-17-008;
CAP-18-002; CAP-18-010.

## 5. Mappings and integrity

| Check | Result |
|---|---|
| Missing from the catalog / extra names | 0 / 0 |
| Duplicate IDs / duplicate names | 0 / 0 |
| Entry skills mapped / shipped | 13 / 13 (`chayen-modernization` was removed in Step 16, D-036) |
| Recipe files mapped / on disk / orphan recipe files | 117 / 117 / 0 |
| Consolidation groups | 57, all consistent (V-11.8) |
| Recipe frontmatter lists exactly the catalog's capabilities | Yes (V-19) |
| Positive recipe cases expecting a different skill or recipe than the catalog | 0 |
| Negative recipe cases whose `not_loads` is a different recipe | 0 |
| `existing_coverage` paths that do not exist | 0 |
| Broken links in recipes | 0 |

## 6. False-positive routing risks

No trigger evaluation has run since Step 06, and 10 of the 13 current
descriptions were written or rewritten after it. Routing precision and
recall are therefore **unmeasured**. The risks below come from the
descriptions, the trigger cases, and earlier observations.

| # | Risk | Evidence | Mitigation in place | Needed |
|---|---|---|---|---|
| RR-1 | Generic terms shared by several descriptions can pull prompts to the wrong skill | "data" in 5 descriptions (AI engineering, architecture, backend, data, testing); "review" in 5 (architecture, data, devops, documentation, security); "API" in 5; "tests" in 4; "migrations" in 3 (architecture, backend, data); "dependency" in 3; "performance" in 2 (frontend, performance) | Pairwise word overlap stays low (max 0.11, V-07b); every skill has a "Not for" clause and a no-match gate; "When not to use" tables name the better fit | Trigger evals with these prompt families (G-11) |
| RR-2 | Built-in provider skills compete for review, documentation, and security prompts | R-25; code review (CAP-16-006) and security review prompts | No-plugin arm required in trigger evals | Run with and without the plugin |
| RR-3 | Security prompts under-triggered on Claude Code in Step 06 | R-23; the security description changed in Step 14 | Description names concrete threats (injection, XSS, SSRF, secrets) | Re-measure (G-11) |
| RR-4 | Near-miss unsupported stacks may activate a skill whose scope line then declines | Cases for React Native, Flutter, MySQL, MongoDB, Go, Java, VS Code extensions accept "no skill or the scope-declining skill" (`none_or`) | Scope lines exclude them explicitly | Measure how often the skill loads and declines versus stays silent |
| RR-5 | Overlapping domains between skills by design | Backend vs data (migrations), frontend vs performance (Web Vitals vs runtime), security vs devops (Dockerfiles), documentation vs repository (docs vs read-only analysis), architecture vs devops (resilience vs DR) | 16 ambiguous trigger cases accept either skill; recipe negatives name the better fit | Confirm with evals that each prompt lands in an acceptable skill |
| RR-6 | Thin positive trigger coverage for some skills | Positive trigger cases per skill: performance 4, documentation 4, data 6, requirements 6, AI engineering 7, architecture 7, devops 7 (others 8–10) | V-16 requires at least 3 | Add positives for the thinner skills before measuring |
| RR-7 | Descriptions at the size limit | L0 5,485 / 5,500; several descriptions at 412–420 characters | Budget enforced by V-07 | Any wording change for routing must be offset; measure before and after (DS-09) |
| RR-8 | Frontend is the most-forbidden skill in trigger cases | 32 of 135 cases forbid `chayen-frontend`, because its broad UI vocabulary attracts many prompts | Explicit forbid expectations | Watch frontend false positives in the first eval run |

## 7. Tests and validators run

| # | Test | Command | Result |
|---|---|---|---|
| T1 | Coverage audit (first run) | `node tools/catalog/audit-coverage.mjs` | **FAIL**, exit 1: 198/206 pass all criteria; C9 failures for 8 capabilities |
| T2 | Coverage audit (after fixes) | `node tools/catalog/audit-coverage.mjs` | **PASS**, exit 0: 206/206 pass all ten criteria; 0 duplicates, 0 missing, 0 orphan recipes, 0 broken mappings |
| T3 | Package validator | `node tools/validate/validate-package.mjs` | PASS: 0 errors, 0 warnings; 13 skills, L0 5485/5500, 142 references, 117 recipe files agree with the catalog (206 capabilities), 445 recipe cases, 135 trigger cases |
| T4 | Catalog checker | `node tools/catalog/check-catalog.mjs` | PASS: 206 IMPLEMENTED, fingerprint `2f13cad24ff431e3` matches the inventory, coverage doc in sync |
| T5 | All automated gates | `node tools/validate/validate-all.mjs` | PASS: 4/4 gate groups; validator self-tests 53/53; Claude eval cases in sync (135 cases, 322 files) |
| T6 | Claude Code validator (2.1.220) | `claude plugin validate --strict` on the plugin and the marketplace | PASS ×2 |
| T7 | Agent Skills reference validator | `agentskills validate` ×13 (`skills-ref` 0.1.1) | PASS: 13/13 valid |
| T8 | Native lifecycle (isolated homes, no model calls) | `bash tests/provider-compatibility/run-lifecycle.sh <scratch>/lc19` | PASS 24/24 on Claude Code 2.1.220, Codex 0.162.1, Copilot CLI 1.0.89 |
| — | Trigger evals (G-11) | — | NOT_RUN: billed runs need approval (R-32) |
| — | Recipe behaviour evals (G-12) | — | NOT_RUN: no runner or fixture repositories |
| — | Human review of recipes (G-15) | — | NOT_RUN: pending (R-33, R-34) |

## 8. Limitations and what VERIFIED requires

- **Static, not behavioural.** The audit proves that every capability has
  complete, consistent, non-placeholder content with evaluation cases. It
  does not prove that an agent follows the content correctly or that the
  right skill triggers.
- **Heuristics.** Term coverage and word counts can miss a recipe that is
  on-topic but wrong, and can flag one that is right in different words.
  The lowest-scoring records were reviewed by hand.
- **Self-review.** The recipes and this audit were both written by the agent
  (R-33). Platform and tool facts in the recipes come from agent knowledge
  and were not executed (R-34).
- **To reach VERIFIED,** a capability needs its behaviour eval run on a
  fixture repository with results recorded (G-12), its skill's trigger evals
  run at least three times with the no-plugin arm (G-11), and a human review
  (G-15), as defined in SKILL_QUALITY_GATES.md and D-022.

## 9. Per-capability results

Generated by `node tools/catalog/audit-coverage.mjs --markdown` after the
fixes. ✓ means the criterion passed; "Cases +/−" counts positive and
negative recipe cases; "Term coverage" is the C3 heuristic.

| ID | Name | Entry skill | Recipe | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | C9 | C10 | Cases +/− | Term coverage | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CAP-01-001 | repo-onboarding | chayen-repository | repository-profile.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 73% | PASS |
| CAP-01-002 | repository-map | chayen-repository | repository-profile.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 90% | PASS |
| CAP-01-003 | dependency-mapping | chayen-repository | dependency-and-impact.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 80% | PASS |
| CAP-01-004 | change-impact-analysis | chayen-repository | dependency-and-impact.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 76% | PASS |
| CAP-01-005 | git-history-analysis | chayen-repository | history-and-ownership.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 83% | PASS |
| CAP-01-006 | code-ownership-analysis | chayen-repository | history-and-ownership.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 83% | PASS |
| CAP-01-007 | convention-discovery | chayen-repository | repository-profile.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 90% | PASS |
| CAP-01-008 | technical-debt-inventory | chayen-repository | technical-debt-inventory.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 96% | PASS |
| CAP-01-009 | unknowns-and-assumptions | chayen-repository | unknowns-and-assumptions.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-02-001 | requirement-elicitation | chayen-requirements | elicitation-and-modeling.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 91% | PASS |
| CAP-02-002 | user-story-refinement | chayen-requirements | stories-and-acceptance.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 79% | PASS |
| CAP-02-003 | acceptance-criteria | chayen-requirements | stories-and-acceptance.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 94% | PASS |
| CAP-02-004 | use-case-modeling | chayen-requirements | elicitation-and-modeling.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 92% | PASS |
| CAP-02-005 | business-rule-extraction | chayen-requirements | elicitation-and-modeling.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 82% | PASS |
| CAP-02-006 | requirement-traceability | chayen-requirements | requirement-traceability.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 87% | PASS |
| CAP-02-007 | scope-and-dependency | chayen-requirements | scope-and-backlog.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-02-008 | edge-case-discovery | chayen-requirements | stories-and-acceptance.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 84% | PASS |
| CAP-02-009 | nonfunctional-requirements | chayen-requirements | nonfunctional-requirements.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-02-010 | backlog-decomposition | chayen-requirements | scope-and-backlog.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-03-001 | architecture-review | chayen-architecture | architecture-review.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 95% | PASS |
| CAP-03-002 | architecture-option-analysis | chayen-architecture | decision-records.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 94% | PASS |
| CAP-03-003 | architecture-decision-record | chayen-architecture | decision-records.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 88% | PASS |
| CAP-03-004 | system-boundary-design | chayen-architecture | boundaries-and-domain.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-03-005 | domain-modeling | chayen-architecture | boundaries-and-domain.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 94% | PASS |
| CAP-03-006 | component-design | chayen-architecture | boundaries-and-domain.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 88% | PASS |
| CAP-03-007 | sequence-and-dataflow | chayen-architecture | sequence-and-dataflow.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 95% | PASS |
| CAP-03-008 | architecture-fitness | chayen-architecture | architecture-review.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 74% | PASS |
| CAP-03-009 | multitenancy-design | chayen-architecture | multitenancy.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 96% | PASS |
| CAP-03-010 | resilience-design | chayen-architecture | resilience.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 82% | PASS |
| CAP-04-001 | task-contract | chayen-implementation | task-contract.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 88% | PASS |
| CAP-04-002 | implementation-planning | chayen-implementation | task-contract.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 86% | PASS |
| CAP-04-003 | risk-classification | chayen-implementation | task-contract.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 86% | PASS |
| CAP-04-004 | estimation-and-sizing | chayen-requirements | scope-and-backlog.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 79% | PASS |
| CAP-04-005 | migration-planning | chayen-architecture | migration-strategy.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 94% | PASS |
| CAP-04-006 | rollout-planning | chayen-architecture | rollout-planning.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-04-007 | handoff-summary | chayen-implementation | change-summary.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 86% | PASS |
| CAP-04-008 | decision-register | chayen-architecture | decision-records.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 65% | PASS |
| CAP-05-001 | feature-implementation | chayen-implementation | feature-delivery.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 80% | PASS |
| CAP-05-002 | bug-fix | chayen-implementation | bug-fix.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-05-003 | code-refactoring | chayen-implementation | refactoring.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 88% | PASS |
| CAP-05-004 | safe-code-edit | chayen-implementation | feature-delivery.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 80% | PASS |
| CAP-05-005 | algorithm-design | chayen-implementation | algorithm-design.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 89% | PASS |
| CAP-05-006 | concurrency-safety | chayen-implementation | concurrency-safety.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 86% | PASS |
| CAP-05-007 | error-handling | chayen-implementation | error-handling.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 82% | PASS |
| CAP-05-008 | dependency-upgrade | chayen-implementation | upgrades.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 95% | PASS |
| CAP-05-009 | configuration-change | chayen-implementation | configuration-and-flags.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 87% | PASS |
| CAP-05-010 | feature-flagging | chayen-implementation | configuration-and-flags.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 87% | PASS |
| CAP-05-011 | code-generation-from-contract | chayen-implementation | contract-codegen.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 90% | PASS |
| CAP-05-012 | compatibility-preserving-change | chayen-implementation | compatibility.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 92% | PASS |
| CAP-06-001 | api-design | chayen-backend | api-design.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 92% | PASS |
| CAP-06-002 | api-implementation | chayen-backend | api-endpoints.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 81% | PASS |
| CAP-06-003 | api-contract-validation | chayen-backend | api-endpoints.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 80% | PASS |
| CAP-06-004 | api-versioning | chayen-backend | api-design.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 90% | PASS |
| CAP-06-005 | authentication-authorization-implementation | chayen-backend | authn-authz.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 79% | PASS |
| CAP-06-006 | event-driven-integration | chayen-backend | messaging.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-06-007 | message-queue-design | chayen-backend | messaging.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 82% | PASS |
| CAP-06-008 | background-job-design | chayen-backend | background-jobs.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 91% | PASS |
| CAP-06-009 | external-service-integration | chayen-backend | external-integrations.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 95% | PASS |
| CAP-06-010 | idempotency-and-retries | chayen-backend | idempotency-and-consistency.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-07-001 | ui-feature-implementation | chayen-frontend | ui-features.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 100% | PASS |
| CAP-07-002 | component-architecture | chayen-frontend | component-architecture.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-07-003 | state-management | chayen-frontend | ui-features.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 77% | PASS |
| CAP-07-004 | form-and-validation | chayen-frontend | ui-features.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 95% | PASS |
| CAP-07-005 | responsive-layout | chayen-frontend | layout-and-design-system.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 94% | PASS |
| CAP-07-006 | accessibility-audit | chayen-frontend | accessibility.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 90% | PASS |
| CAP-07-007 | frontend-performance | chayen-frontend | frontend-performance.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 94% | PASS |
| CAP-07-008 | design-system-integration | chayen-frontend | layout-and-design-system.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 88% | PASS |
| CAP-07-009 | internationalization | chayen-frontend | internationalization.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 91% | PASS |
| CAP-07-010 | frontend-error-handling | chayen-frontend | frontend-error-handling.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 100% | PASS |
| CAP-08-001 | mobile-feature | chayen-frontend | hybrid-mobile.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 94% | PASS |
| CAP-08-002 | navigation-and-deep-link | chayen-frontend | hybrid-mobile.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 88% | PASS |
| CAP-08-003 | offline-first | chayen-frontend | offline-and-mobile-performance.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 95% | PASS |
| CAP-08-004 | device-permission-and-sensors | chayen-frontend | device-permissions-and-push.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 95% | PASS |
| CAP-08-005 | push-notification | chayen-frontend | device-permissions-and-push.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 100% | PASS |
| CAP-08-006 | app-lifecycle | chayen-frontend | hybrid-mobile.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 90% | PASS |
| CAP-08-007 | mobile-performance | chayen-frontend | offline-and-mobile-performance.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 93% | PASS |
| CAP-08-008 | desktop-packaging-and-update | chayen-frontend | desktop-packaging.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 100% | PASS |
| CAP-09-001 | data-modeling | chayen-data | data-modeling.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 90% | PASS |
| CAP-09-002 | schema-migration | chayen-data | schema-and-data-migration.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 100% | PASS |
| CAP-09-003 | query-optimization | chayen-data | query-performance.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 94% | PASS |
| CAP-09-004 | index-review | chayen-data | query-performance.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 96% | PASS |
| CAP-09-005 | transaction-consistency | chayen-data | transactions.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 95% | PASS |
| CAP-09-006 | data-integrity-validation | chayen-data | data-quality-and-integrity.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 94% | PASS |
| CAP-09-007 | data-migration | chayen-data | schema-and-data-migration.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 95% | PASS |
| CAP-09-008 | backfill-planning | chayen-data | schema-and-data-migration.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 95% | PASS |
| CAP-09-009 | etl-pipeline | chayen-data | etl-pipelines.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-09-010 | data-quality | chayen-data | data-quality-and-integrity.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 94% | PASS |
| CAP-09-011 | data-retention | chayen-data | retention-and-governance.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-09-012 | backup-restore-drill | chayen-data | backup-restore.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-10-001 | test-strategy | chayen-testing | test-strategy.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-10-002 | unit-test-generation | chayen-testing | test-authoring.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 90% | PASS |
| CAP-10-003 | integration-test-design | chayen-testing | test-authoring.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 83% | PASS |
| CAP-10-004 | e2e-test-automation | chayen-testing | test-authoring.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 80% | PASS |
| CAP-10-005 | contract-testing | chayen-testing | api-and-contract-tests.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-10-006 | api-test-automation | chayen-testing | api-and-contract-tests.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 68% | PASS |
| CAP-10-007 | regression-testing | chayen-testing | test-authoring.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-10-008 | property-based-testing | chayen-testing | advanced-test-techniques.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 76% | PASS |
| CAP-10-009 | mutation-testing | chayen-testing | advanced-test-techniques.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 78% | PASS |
| CAP-10-010 | fuzz-testing | chayen-testing | advanced-test-techniques.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 85% | PASS |
| CAP-10-011 | test-data-factory | chayen-testing | test-data.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 77% | PASS |
| CAP-10-012 | flaky-test-diagnosis | chayen-testing | failing-and-flaky-tests.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 83% | PASS |
| CAP-10-013 | test-coverage-gap | chayen-testing | coverage-gaps.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-10-014 | test-failure-triage | chayen-testing | failing-and-flaky-tests.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 96% | PASS |
| CAP-11-001 | threat-modeling | chayen-security | threat-modeling.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 96% | PASS |
| CAP-11-002 | secure-code-review | chayen-security | secure-review.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/2 | 96% | PASS |
| CAP-11-003 | sast-triage | chayen-security | scanner-triage.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 96% | PASS |
| CAP-11-004 | dependency-vulnerability-triage | chayen-security | scanner-triage.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 100% | PASS |
| CAP-11-005 | secret-detection-and-rotation-plan | chayen-security | secret-exposure-response.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-11-006 | authorization-review | chayen-security | secure-review.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 79% | PASS |
| CAP-11-007 | input-output-validation | chayen-security | secure-review.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-11-008 | ssrf-and-egress-review | chayen-security | secure-review.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 92% | PASS |
| CAP-11-009 | crypto-usage-review | chayen-security | secure-review.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 64% | PASS |
| CAP-11-010 | privacy-impact-assessment | chayen-security | privacy.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 96% | PASS |
| CAP-11-011 | secure-logging | chayen-security | secure-review.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 82% | PASS |
| CAP-11-012 | sbom-and-license-review | chayen-security | sbom-and-licenses.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 95% | PASS |
| CAP-11-013 | container-iac-security-review | chayen-security | infrastructure-security-review.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 92% | PASS |
| CAP-11-014 | vulnerability-remediation | chayen-security | vulnerability-remediation.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 90% | PASS |
| CAP-12-001 | performance-baselining | chayen-performance | baseline-and-profiling.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 94% | PASS |
| CAP-12-002 | profiling | chayen-performance | baseline-and-profiling.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 94% | PASS |
| CAP-12-003 | load-test-design | chayen-performance | load-testing.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 95% | PASS |
| CAP-12-004 | load-test-analysis | chayen-performance | load-testing.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 90% | PASS |
| CAP-12-005 | bottleneck-analysis | chayen-performance | baseline-and-profiling.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 94% | PASS |
| CAP-12-006 | memory-leak-analysis | chayen-performance | memory-leaks.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 89% | PASS |
| CAP-12-007 | latency-budget | chayen-performance | budgets-and-capacity.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 94% | PASS |
| CAP-12-008 | capacity-planning | chayen-performance | budgets-and-capacity.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 94% | PASS |
| CAP-12-009 | cache-strategy | chayen-performance | caching.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 90% | PASS |
| CAP-12-010 | cost-performance-optimization | chayen-performance | budgets-and-capacity.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 91% | PASS |
| CAP-13-001 | build-system-setup | chayen-devops | build-systems.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 94% | PASS |
| CAP-13-002 | ci-pipeline-design | chayen-devops | pipelines.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 100% | PASS |
| CAP-13-003 | cd-pipeline-design | chayen-devops | pipelines.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 86% | PASS |
| CAP-13-004 | dockerfile-review | chayen-devops | containers.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 91% | PASS |
| CAP-13-005 | container-hardening | chayen-devops | containers.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-13-006 | infrastructure-as-code | chayen-devops | infrastructure-as-code.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 100% | PASS |
| CAP-13-007 | environment-parity | chayen-devops | environment-parity.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 91% | PASS |
| CAP-13-008 | secrets-management | chayen-devops | secrets-management.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 95% | PASS |
| CAP-13-009 | release-packaging | chayen-devops | releases-and-provenance.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-13-010 | deployment-validation | chayen-devops | release-and-rollout.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 86% | PASS |
| CAP-13-011 | rollback-verification | chayen-devops | release-and-rollout.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 93% | PASS |
| CAP-13-012 | artifact-provenance | chayen-devops | releases-and-provenance.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 95% | PASS |
| CAP-14-001 | observability-design | chayen-devops | observability.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-14-002 | structured-logging | chayen-devops | observability.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 94% | PASS |
| CAP-14-003 | metrics-and-slo | chayen-devops | observability.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 88% | PASS |
| CAP-14-004 | distributed-tracing | chayen-devops | observability.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 90% | PASS |
| CAP-14-005 | alert-tuning | chayen-devops | alerting-and-incidents.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 83% | PASS |
| CAP-14-006 | production-incident-triage | chayen-devops | alerting-and-incidents.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 94% | PASS |
| CAP-14-007 | root-cause-analysis | chayen-devops | rca-and-postmortems.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 93% | PASS |
| CAP-14-008 | postmortem | chayen-devops | rca-and-postmortems.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-14-009 | disaster-recovery-planning | chayen-devops | disaster-recovery.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-14-010 | runbook-generation | chayen-devops | runbooks.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-15-001 | legacy-system-assessment | chayen-repository | legacy-assessment.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-15-002 | safe-refactor-plan | chayen-implementation | refactoring.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-15-003 | strangler-migration | chayen-architecture | migration-strategy.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-15-004 | framework-version-upgrade | chayen-implementation | upgrades.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-15-005 | breaking-change-analysis | chayen-implementation | upgrades.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 90% | PASS |
| CAP-15-006 | dead-code-analysis | chayen-implementation | dead-code-and-deprecation.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 96% | PASS |
| CAP-15-007 | deprecation-plan | chayen-implementation | dead-code-and-deprecation.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-15-008 | monolith-modularization | chayen-architecture | migration-strategy.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 88% | PASS |
| CAP-15-009 | hotfix-preparation | chayen-devops | hotfix.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-15-010 | technical-debt-prioritization | chayen-repository | technical-debt-prioritization.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-16-001 | readme-maintenance | chayen-documentation | project-docs.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 89% | PASS |
| CAP-16-002 | api-documentation | chayen-documentation | api-docs.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-16-003 | architecture-documentation | chayen-documentation | architecture-docs.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-16-004 | developer-onboarding-guide | chayen-documentation | project-docs.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-16-005 | pull-request-preparation | chayen-documentation | pull-requests-and-review.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 95% | PASS |
| CAP-16-006 | code-review-assistant | chayen-documentation | pull-requests-and-review.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-16-007 | review-comment-resolution | chayen-documentation | pull-requests-and-review.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-16-008 | knowledge-transfer | chayen-documentation | project-docs.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 82% | PASS |
| CAP-16-009 | release-notes | chayen-documentation | release-notes.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-16-010 | git-workflow-assistant | chayen-documentation | git-workflow.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 100% | PASS |
| CAP-17-001 | dataset-readiness | chayen-ai-engineering | ml-data.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 95% | PASS |
| CAP-17-002 | ml-experiment-design | chayen-ai-engineering | ml-experiments-and-evaluation.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 92% | PASS |
| CAP-17-003 | model-evaluation | chayen-ai-engineering | ml-experiments-and-evaluation.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 94% | PASS |
| CAP-17-004 | model-serving | chayen-ai-engineering | model-serving.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 90% | PASS |
| CAP-17-005 | ml-data-drift | chayen-ai-engineering | ml-data.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 93% | PASS |
| CAP-17-006 | rag-pipeline-design | chayen-ai-engineering | rag.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 96% | PASS |
| CAP-17-007 | retrieval-evaluation | chayen-ai-engineering | rag.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 89% | PASS |
| CAP-17-008 | prompt-and-tool-evaluation | chayen-ai-engineering | llm-and-agent-evaluation.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 92% | PASS |
| CAP-17-009 | llm-safety-redteam | chayen-ai-engineering | llm-safety.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-17-010 | llm-observability | chayen-ai-engineering | llm-observability.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-18-001 | standards-compliance-check | chayen-documentation | pull-requests-and-review.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 94% | PASS |
| CAP-18-002 | change-passport | chayen-implementation | change-summary.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/2 | 86% | PASS |
| CAP-18-003 | task-evidence-audit | chayen-implementation | change-summary.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-18-004 | policy-as-code-validation | chayen-devops | policy-as-code.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-18-005 | access-control-review | chayen-security | access-reviews.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 96% | PASS |
| CAP-18-006 | data-governance-check | chayen-data | retention-and-governance.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 89% | PASS |
| CAP-18-007 | license-obligation-review | chayen-security | sbom-and-licenses.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 91% | PASS |
| CAP-18-008 | release-go-no-go | chayen-devops | release-and-rollout.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 100% | PASS |
| CAP-18-009 | exception-and-waiver-management | chayen-architecture | decision-records.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 95% | PASS |
| CAP-18-010 | agent-action-risk-review | chayen-ai-engineering | agent-governance.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-19-001 | graphql-schema-evolution | chayen-backend | api-design.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-19-002 | realtime-system-design | chayen-architecture | realtime-systems.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 96% | PASS |
| CAP-19-003 | search-and-indexing | chayen-data | search-and-indexing.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-19-004 | file-processing-pipeline | chayen-backend | file-processing.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 86% | PASS |
| CAP-19-005 | webhook-safety | chayen-backend | external-integrations.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 83% | PASS |
| CAP-19-006 | payments-and-ledger-consistency | chayen-backend | idempotency-and-consistency.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 95% | PASS |
| CAP-19-007 | geospatial-systems | chayen-data | geospatial.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 96% | PASS |
| CAP-19-008 | multi-region-resilience | chayen-architecture | resilience.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 88% | PASS |
| CAP-19-009 | browser-extension-development | chayen-frontend | browser-extensions.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-20-001 | skill-authoring | chayen-ai-engineering | agent-skills.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 96% | PASS |
| CAP-20-002 | skill-review | chayen-ai-engineering | agent-skills.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2/1 | 90% | PASS |
| CAP-20-003 | skill-testing | chayen-ai-engineering | llm-and-agent-evaluation.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 96% | PASS |
| CAP-20-004 | skill-version-migration | chayen-ai-engineering | agent-skills.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-20-005 | provider-compatibility | chayen-ai-engineering | provider-compatibility.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 100% | PASS |
| CAP-20-006 | policy-conflict-detection | chayen-ai-engineering | agent-governance.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 95% | PASS |
| CAP-20-007 | agent-session-handoff | chayen-ai-engineering | session-handoff.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 93% | PASS |
| CAP-20-008 | agent-task-benchmarking | chayen-ai-engineering | llm-and-agent-evaluation.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1/1 | 89% | PASS |
