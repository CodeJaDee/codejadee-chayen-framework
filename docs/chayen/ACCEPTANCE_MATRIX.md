# Acceptance Matrix

Every requirement is traced through its planned step, implementation
evidence, verification method, and verification evidence. Status vocabulary
is defined in [BUILD_CONTRACT.md](BUILD_CONTRACT.md) §5.1.

A row may be marked `VERIFIED` only when its verification evidence column
cites an executed test and its recorded result (BC-10, BC-13).

**Step 36 initial preflight (historical; resumed under D-053): BLOCKED** under the user's explicit approval
precondition. ADR-0009's separate editorial registry and CA-01/V-19 amendments
are still PROPOSED (R-57); D-051/D-052 approve only count and L0 components.
No registration/validator implementation or new negative controls exist yet;
all MHR rows remain PLANNED and MH-V methods NOT_RUN. Read-only metadata
remeasurement: 13 shipped Skills, L0 5,485; projection for 15 is 6,361 within
approved 6,500. The new Step 36 request specifies maximum 15, replacing the
earlier 25 ceiling for its eventual implementation; no count change is applied
while blocked. See PROGRESS.md Step 36 and ISSUES.md R-57. No legacy status
or summary count changes.

**Step 36 resumed implementation (D-053):** owner instructed proceeding after
the registry approval gap was identified. The approved foundation now comprises
`catalog/editorial-skills.json` (two planned identities/descriptions), shared
developer registration rules, V-07/V-19/V-11.3/V-25 extensions, 18 editorial
negative controls and two additional security cases. Current maximum is 15,
L0 6,500, actual 13 Skills / 5,485 characters, projected 15-Skill metadata
5,940 (560 free). [SKILL_REGISTRATION.md](SKILL_REGISTRATION.md) maps the
design and checks; actual commands/results are in PROGRESS.md's resumed Step 36
entry. This is foundation evidence for MHR-001/MHR-011/MHR-012, not completed
Humanizer Skills or host/behavior verification. Every MHR remains PLANNED;
prior requirement statuses and summary counts stay unchanged.

**Step 36 foundation verification:** DONE (pending review); package validation
PASS with five existing size-target warnings, `validate-all.mjs` nine gate
groups PASS, validator self-tests 150/150 (18 new editorial cases), security
34/34, evaluation static/traceability PASS for 206 engineering / 108 technology /
12 workflow records. Governance links/anchors 130/130; shipped/catalog
preservation diff empty. First self-test run was 149/150 due to an ambiguous
scratch replacement, corrected and revalidated. This is executed static
foundation evidence; all MHR product acceptance/behavior requirements remain
PLANNED with no VERIFIED promotion.

**Owner follow-up D-059 (2026-10-17):** plugin identifier renamed to `chayen` in both
manifests and all three marketplace entries (repository name and plugin directory
unchanged). Static identity, package and documentation checks re-run; no requirement
status changes and nothing is VERIFIED by the rename.

**Step 41 documentation and release readiness: DONE (pending owner review).**
User, install and release documents describe all 15 skills; a writing guide
([WRITING_AND_EDITING.md](../WRITING_AND_EDITING.md)) and the A/B/C policy
separation ([RESPONSE_STYLE.md](../RESPONSE_STYLE.md)) were added; the upstream
MIT licence was fetched and matches the shipped notice byte for byte; version
`0.1.0-rc.1` is proposed (D-058) and not applied. Documentation is evidence of
IMPLEMENTED work only: no MHR or legacy status changes and nothing is VERIFIED
by it. Recommendation: NO-GO public, CONDITIONAL GO internal pilot
([RELEASE_READINESS.md](RELEASE_READINESS.md)).

**Step 40 evaluation (D-057, PROPOSED): PARTIAL.** Offline evidence only:
13/13 gate groups PASS (new G-17: dataset check and 56/56 scorer controls),
identity 15/15, V-25 PASS, security 34/34, setup fixtures 19/19; 13 engineering
skills, manifests, marketplaces and the three catalogs byte-identical to the
Step 34 baseline `1106226`; SIMULATED proxy changes 2 of 186 baseline picks (R-62).
Discovery, persistent-policy arms A/B/C, language quality and host lifecycle are
NOT_RUN on all six surfaces (R-61); fixtures and the PROPOSED rubric are ready. See
[HUMANIZER_EVALUATION_REPORT.md](HUMANIZER_EVALUATION_REPORT.md).

**Step 38 English editorial skill (D-055, PROPOSED):** `chayen-humanizer-en`
ships as the 15th and last permitted Entry Skill with 9 skill-local references
and 26 patterns adapted from `blader/humanizer` (MIT; licence notice and
attribution ship in the skill). Static evidence only: package/catalog/security/
docs/G-15 checks PASS, validator self-tests 164/164, 15 trigger cases and 102
behavior case specifications structurally valid, actual L0 6,221 / 6,500.
Five MHR rows move to IMPLEMENTED; nothing is VERIFIED because native routing,
behavior and fluent human evaluation are NOT_RUN (R-59). See
[HUMANIZER_EN_DESIGN.md](HUMANIZER_EN_DESIGN.md).

**Step 37 Thai editorial skill (D-054, PROPOSED):** `chayen-humanizer-th`
ships as the 14th Entry Skill with 7 skill-local references and 14 Thai
patterns. Static evidence only: package/catalog/security/docs/G-15 checks
PASS, validator self-tests 153/153, 13 trigger cases and 52 behavior case
specifications structurally valid. Eight MHR rows move to IN_PROGRESS; none is
IMPLEMENTED or VERIFIED because the English half and all native/behavior/human
evaluation remain (R-58). See [HUMANIZER_TH_DESIGN.md](HUMANIZER_TH_DESIGN.md).

**Snapshot:** Step 35 governance update (2026-10-17); prior evidence retains
its recorded step/date and meaning. No Step 35 behavior verification claim.

**STEP 35:** approved multilingual product scope is D-047; architectural
mechanisms in ADR-0009–ADR-0011 remain PROPOSED. All MHR-001–MHR-012 rows are
PLANNED. See [HUMANIZER_REQUIREMENTS.md](HUMANIZER_REQUIREMENTS.md) for criteria
and [HUMANIZER_ARCHITECTURE_IMPACT.md](HUMANIZER_ARCHITECTURE_IMPACT.md) for
conflicts and native discovery / opt-in persistent guidance / unverified
install-only always-on distinctions. Existing requirement rows/statuses are
preserved. The proposed opt-in exception does not silently amend REQ-04.

**Owner count amendment D-051 (2026-10-17):** maximum Entry Skills is now
25, ACCEPTED and implemented in V-07/V-11.3; ARC-04 and count traceability
labels reflect this. Current count 13, product target 15. L0 remains 5,500
and every MHR remains PLANNED; no Skill/host behavior was verified here.

**Subsequent L0 amendment D-052:** the owner authorized resolving the metadata
constraint; L0 ≤6,500 is ACCEPTED and implemented in V-07 and evaluation
reporting. Current usage remains 5,485 (1,015 free); count ceiling remains 25.
No requirement or MHR implementation/verification status changes.

**STEP 30 security traceability:** [SECURITY_MODEL.md](SECURITY_MODEL.md),
[THREAT_MODEL.md](THREAT_MODEL.md) and [PLUGIN_TRUST_REVIEW.md](PLUGIN_TRUST_REVIEW.md)
review the entire packaged surface, all ten requested threats, developer
execution paths, marketplace trust, dependencies/links and native permission
limitations for REQ-09 / ARC-11 and the static-component exclusions. All 13
entry precedence/least-privilege clauses and developer staging/mutation/provider
boundaries are hardened. V-25 and eight offline gate groups PASS, including
32 security regressions and 132 validator tests; 23 JavaScript and one shell
syntax checks PASS. Native-agent injection, approval honesty, provider
permission/install/authentication, live advisories and runtime security tests
remain NOT_RUN (R-52). REQ-09 stays IN_PROGRESS, ARC-11 stays IMPLEMENTED,
summary counts are unchanged and zero capabilities are VERIFIED. This records
static evidence, not enforcement or an approved release.

**STEP 29 traceability:** [WORKFLOW_COVERAGE.md](WORKFLOW_COVERAGE.md) maps
all 12 composite workflows and seven reusable formats to existing recipes and
conditional technology packs (D-045). ARC-08..ARC-10 are now IMPLEMENTED;
REQ-07..REQ-09 retain their existing statuses because live native-agent
behavior is not established by static checks. V-24 PASS; six automated gate
groups and 132/132 validator tests PASS. All 47 workflow/template behavior
evaluations are NOT_RUN; no requirement or capability is marked VERIFIED.

**STEP 28 audit traceability:** [TECHNOLOGY_COVERAGE_AUDIT.md](TECHNOLOGY_COVERAGE_AUDIT.md)
reviews STK-01..STK-09 and STK-13, the embedded EF Core/Dapper/ADO.NET/Npgsql
recipes and cross-stack contracts, and the preservation/verification concerns
in REQ-07..REQ-10. STK-10..STK-12 general backend guidance is distinguished
from cataloged packs; Java STK-14 remains PLANNED. Static gates pass for all
108 technology capabilities and 295 specifications. Current local facts:
107 PASS, 0 FAIL, 52 NOT_RUN in
[STEP 28 results](../../tests/technology/audit/results/step28-fact-checks.json).
Full agent/frontend scenarios and the maintainer runtime declaration remain
open (R-49, R-50): **STEP 28 PARTIAL; that audit did not change requirement/
capability statuses or summary counts.** STEP 29's ARC updates are listed above.
Historical verification cells below
retain their original step-specific meaning; they are not current rerun claims.

## Summary

| Category | Rows | PLANNED | IN_PROGRESS | IMPLEMENTED | VERIFIED |
|---|---|---|---|---|---|
| Governance (GOV) | 18 | 0 | 0 | 18 | 0 |
| Core requirements (REQ) | 10 | 0 | 9 | 1 | 0 |
| Exclusions (EX) | 7 | 0 | 0 | 0 | 7 |
| Providers (PRV) | 3 | 0 | 3 | 0 | 0 |
| Stack coverage (STK) | 14 | 1 | 3 | 10 | 0 |
| Architecture components (ARC) | 14 | 0 | 4 | 10 | 0 |
| Capability domains (CAP) | 20 | 0 | 0 | 20 | 0 |
| Multilingual Humanizer (MHR) | 12 | 0 | 4 | 8 | 0 |
| **Total** | **98** | **1** | **23** | **67** | **7** |

Step 37 moves MHR-001–MHR-006, MHR-011 and MHR-012 from PLANNED to
IN_PROGRESS (Thai half implemented; English half and all behavior pending).
MHR-007–MHR-010 stay PLANNED. No legacy row changes.

Step 38 moves MHR-001, MHR-003, MHR-004, MHR-005 and MHR-006 from IN_PROGRESS to
IMPLEMENTED: both Skills now exist with evidence paths and the verification
methods are still NOT_RUN, which is the IMPLEMENTED definition in BUILD_CONTRACT
§5.1. MHR-002 (needs persistent guidance, Step 39), MHR-011 and MHR-012 (span
Steps 39–41) stay IN_PROGRESS; MHR-007–MHR-010 stay PLANNED. None is VERIFIED.

Step 39 moves MHR-002, MHR-007 and MHR-009 to IMPLEMENTED (persistent policy, setup
and lifecycle rules exist with evidence paths; host loading and behavior NOT_RUN) and
MHR-008 from PLANNED to IN_PROGRESS (documented per-surface matrix; tested column
empty). MHR-011 and MHR-012 stay IN_PROGRESS with Step 39 evidence added; MHR-010
stays PLANNED. None is VERIFIED. ADR-0010's acceptance is inferred from the Step 39
instruction (D-056) and awaits owner confirmation.

Step 40 moves MHR-010 from PLANNED to IN_PROGRESS: a PROPOSED rubric, a 120-case
held-out dataset, 52 discovery probes, an arm runner and an offline scorer exist
(D-057), but the rubric is unapproved and no output or human review exists. Every
other MHR keeps its status with Step 40 evidence added. All provider, host-lifecycle
and human verification is NOT_RUN (R-61), so none is VERIFIED.

Step 35 recomputes this summary from existing rows plus the 12 new PLANNED
MHR rows. GOV-18 already existed; EX-01–EX-07 were VERIFIED in Step 34.
This corrects stale aggregate counts without changing any legacy row/status.
Historical narrative below retains its original step-specific counts.

Step 27 adds 10 PostgreSQL and 8 cross-stack technology capabilities plus
PostgreSQL data access recipes, all IMPLEMENTED and V-23 validated, with 64
specifications and nine trigger prompts. 42 executed checks PASS (driver
references, PostgreSQL 18.6 engine and ORM facts, .NET API contract/auth/
error/CORS facts, Node date and precision facts, and a Chromium end-to-end
flow); agent evaluations remain NOT_RUN. Cross-stack work has no STK row: it
is recorded in TECHNOLOGY_COVERAGE §15 and PROGRESS Step 27.

Step 26 adds the 12 SQL Server technology capabilities and three data access
recipes, all IMPLEMENTED and V-23 validated, with 39 capability and 9 recipe
specifications and seven trigger prompts. 27 engine/ORM facts and 3
driver-reference checks PASS on a disposable LocalDB database; agent
evaluations remain NOT_RUN. Steps 24 and 25 have no record (R-45). See
TECHNOLOGY_COVERAGE §13 and PROGRESS Step 26.

Step 06 executed native lifecycle tests (24/24 on 3 CLIs) and routing tests
on Claude Code, Codex, and Copilot. Details are in
[POC_REPORT.md](POC_REPORT.md).

Step 07 created the capability catalog: 206 records in 20 domains, checked by
V-11. Per-capability status lives in the catalog, and the 20 CAP rows below
roll it up by domain. Capabilities: 31 IN_PROGRESS, 175 PLANNED,
0 IMPLEMENTED, 0 VERIFIED. See [CAPABILITY_COVERAGE.md](CAPABILITY_COVERAGE.md).

Step 08 added the skill authoring standard and quality gates (GOV-16,
GOV-17), and validators V-17..V-22 with 52/52 self-tests. It brought the six
pilots to the standard. No requirement status changed: content quality is
now gated, but behaviour after the restructuring is NOT_RUN (R-31).

Step 09 implemented domains 01 and 02. Capabilities are now 19 IMPLEMENTED
(D01 9/9, D02 10/10), 28 IN_PROGRESS, 159 PLANNED, and 0 VERIFIED. Their
behaviour and trigger evals are NOT_RUN (R-32, R-33).

Step 10 implemented domains 03 and 04. Capabilities are now 37 IMPLEMENTED
(D01–D04 complete), 24 IN_PROGRESS, 145 PLANNED, and 0 VERIFIED.

Step 11 implemented domains 05 and 06. Capabilities are now 59 IMPLEMENTED
(D01–D06 complete), 19 IN_PROGRESS, 128 PLANNED, and 0 VERIFIED.

Step 12 implemented domains 07 and 08, with D08 limited to web-technology
shells (D-032, PROPOSED). Capabilities are now 77 IMPLEMENTED (D01–D08
complete), 16 IN_PROGRESS, 113 PLANNED, and 0 VERIFIED.

Step 13 implemented domains 09 and 10, with D09 in the new `chayen-data`
skill (user-approved, D-033). Capabilities are now 103 IMPLEMENTED (D01–D10
complete), 10 IN_PROGRESS, 93 PLANNED, and 0 VERIFIED.

Step 14 implemented domains 11 and 12, with D12 in the new
`chayen-performance` skill and the L0 cap raised to 4,400 (both
user-approved, D-034). Capabilities are now 127 IMPLEMENTED (D01–D12
complete), 1 IN_PROGRESS, 78 PLANNED, and 0 VERIFIED.

Step 15 implemented domains 13 and 14 in the new `chayen-devops` skill,
with the L0 cap raised to 4,700 (both user-approved, D-035). Capabilities
are now 149 IMPLEMENTED (D01–D14 complete), 1 IN_PROGRESS, 56 PLANNED, and
0 VERIFIED.

Step 16 implemented domains 15 and 16. `chayen-modernization` was folded
into existing skills and `chayen-documentation` created, with the L0 cap
raised to 5,200 (user-approved, D-036). Capabilities are now 169
IMPLEMENTED (D01–D16 complete), 1 IN_PROGRESS, 36 PLANNED, and 0 VERIFIED.

Step 17 implemented domains 17 and 18. `chayen-ai-engineering` was created
with the L0 cap raised to 5,500 (user-approved, D-037), and nine D18
records were implemented in existing skills. Capabilities are now 189
IMPLEMENTED (D01–D18 complete), 0 IN_PROGRESS, 17 PLANNED, and 0 VERIFIED.

Step 18 implemented domains 19 and 20 in existing skills (D-038). All 206
capabilities are IMPLEMENTED; none is VERIFIED, because behaviour and
trigger evals have not run (G-11, G-12).

Step 19 audited all 206 capabilities against ten static criteria
([ENGINEERING_COVERAGE_AUDIT.md](ENGINEERING_COVERAGE_AUDIT.md)): the first
run found 8 failures and a manual review found 1 more gap; all 9 were fixed,
and the final run passes 206/206 with no missing, duplicate, orphan, or
broken mappings. Behavioural validation remains 0/206.

Step 20 added the first technology pack (D-039): 22 C# and ASP.NET Core
capabilities in a separate catalog, implemented as technology sections in
six existing skills ([TECHNOLOGY_COVERAGE.md](TECHNOLOGY_COVERAGE.md)). All
22 pass validator V-23, and 31 framework facts the guidance relies on were
executed on the .NET 10 and 8 SDKs (32 PASS). None is VERIFIED: behaviour
and trigger evals have not run.

Step 21 implements 14 Angular and 8 shared TypeScript/JavaScript capabilities
(D-040), with 52 new positive/negative cases and V-23 PASS across all 44
technology records. Eight TS/JS facts PASS; 14 Angular facts and all new agent
behavior/trigger evaluations are NOT_RUN. The capability catalog retains
IMPLEMENTED status, 0 VERIFIED. See TECHNOLOGY_COVERAGE §7 and PROGRESS Step 21.

Step 22 adds 8 React and 8 Next.js technology capabilities (D-041), all
IMPLEMENTED and V-23 validated. Forty new case specifications and eight
trigger prompts were added. Three synthetic server-boundary checks PASS;
thirteen framework/browser/artifact checks and all new agent evaluations
remain NOT_RUN. No React/Next runtime verification or VERIFIED promotion is
claimed. See TECHNOLOGY_COVERAGE §9 and PROGRESS Step 22.

Step 23 adds seven Vue, seven Nuxt, four Vite technology capabilities, all
IMPLEMENTED and V-23 validated, with 44 new evaluation specifications and
eight trigger prompts. Two supporting JavaScript exposure checks PASS;
sixteen framework checks and all new agent evaluations remain NOT_RUN.
No framework privacy/render/build verification is inferred. See
TECHNOLOGY_COVERAGE §11 and PROGRESS Step 23.

No row is `VERIFIED`, because these remain open:

- VS Code surfaces: NOT TESTED;
- remote GitHub marketplace installs: NOT TESTED;
- routing has only single-run evidence, with known under-triggering on
  Claude Code and over-activation on Copilot;
- no statistical baseline exists.

## Multilingual Humanizer requirements (Step 35)

The evidence paths below specify governance/design only, not implementation.
All MH-V methods are planned; Step 35 structural checks are logged separately
in PROGRESS.md. No Humanizer Skill or host integration exists yet.

| ID | Requirement | Planned step(s) | Design / implementation evidence | Verification method | Verification evidence | Status |
|---|---|---|---|---|---|---|
| MHR-001 | Thai and English editorial Entry Skills; target 15 in existing plugin | 36–38, 40–41 | HUMANIZER_REQUIREMENTS.md; ADR-0009 PROPOSED; implementation absent; Step 37: `chayen-humanizer-th` shipped (SKILL.md + 7 references), registry `existing`; English Skill pending Step 38; Step 38: `chayen-humanizer-en` shipped (SKILL.md + 9 references), registry `existing`; both editorial Skills now ship | MH-V01: approved count/L0/registry, portable anatomy, native positive/negative discovery | Static: V-05/V-07/V-07b/V-17/V-19/V-20 PASS, 14 Skills, L0 5,858 actual / 6,083 projected of 6,500; 13 Thai trigger cases synced. Native discovery NOT_RUN; Step 38 static: V-05/V-07/V-07b/V-17/V-19/V-20 PASS; exactly 15 Entry Skills (13 engineering + 2 editorial), actual L0 6,221 / 6,500; 15 English trigger cases synced. Native discovery NOT_RUN; Step 40: structure re-verified (15 Skills, L0 6,221 / 6,500, V-07b max 0.24, identity 15/15); 20 explicit/implicit discovery probes ready; native discovery NOT_RUN; Step 41: all 15 skills documented (README, catalog, install guides, writing guide); identity 15/15; native discovery NOT_RUN | IMPLEMENTED |
| MHR-002 | Automatic intended-output language selection including explicit target and bilingual text | 37–40 | HUMANIZER_REQUIREMENTS.md; ADR-0009/0010 PROPOSED; implementation absent; Step 37: Thai language-selection order in `thai-conventions.md`; English output excluded in SKILL.md; Step 38: English-only language-selection order in `english-conventions.md`; non-English output excluded in SKILL.md; Step 39: persistent language order (explicit request, artifact locale, latest message) and per-section mixed-language rule in `response-style/chayen-response-style.md` | MH-V02: cross-language/locale/ambiguity/unsupported cases | Static case specs (negative English-output, Japanese translation, mixed-language) structure PASS; behavior NOT_RUN; Step 38 static: wrong-language specs (Thai output, translation) structure PASS; proxy: 0 of 8 English positives routed to Thai, 1 of 11 Thai-script prompts to English (0.02 near-tie, proxy cannot read Thai). Behavior NOT_RUN; Step 39 static: G-16 R-03 language and mixed-language clauses PASS; host behavior NOT_RUN; Step 40: 7 cross-language and 4 language-override policy cases ready; scorer language-check controls PASS; behavior NOT_RUN; Step 41: language order documented for users (writing guide, response style guide); behavior NOT_RUN | IMPLEMENTED |
| MHR-003 | Content audit and scoped rewriting | 37–38, 40 | HUMANIZER_REQUIREMENTS.md; ADR-0009/0011 PROPOSED; implementation absent; Step 37: audit/rewrite workflow, 14 TH patterns with false-positive guards, audit output format; Step 38: English audit/rewrite workflow, 26 EN patterns with false-positive guards, audit and already-natural output formats | MH-V03: audit leaves source intact, rewrite addresses located issues faithfully | Static: G-15 pattern inventory and 28 positive/false-positive + 2 audit-only case specs PASS; behavior NOT_RUN; Step 38 static: G-15 inventory EN-01..EN-26 and 27 positive, 26 false-positive, 6 natural-unchanged, 3 audit-only specs PASS. Behavior NOT_RUN; Step 40: 6 audit, 20 rewrite and 14 natural/false-positive held-out cases ready; behavior NOT_RUN; Step 41: four modes documented with Thai and English examples; behavior NOT_RUN | IMPLEMENTED |
| MHR-004 | Website copy editing with markup/permission preservation | 37–38, 40 | HUMANIZER_REQUIREMENTS.md; ADR-0009/0011 PROPOSED; implementation absent; Step 37: `website-content.md` (preview/apply, copy types) and `protected-content.md` file-type rules (Thai); Step 38: English `website-content.md` and `protected-content.md` file-type rules | MH-V04: fixture diffs, syntax/placeholders, audit-only and unauthorized publish negatives | Static: 5 website case specs (JSX, locale JSON, ICU, Trans tags, SEO) structure PASS; fixture diffs and behavior NOT_RUN; Step 38 static: 7 website specs (JSX, locale JSON, ICU, Trans tags, SEO, MDX, alt text) structure PASS; fixture diffs and behavior NOT_RUN; Step 40: 12 website cases with tag, placeholder, link and JSON checks; scorer controls PASS; behavior NOT_RUN; Step 41: file-editing safety documented for users; behavior NOT_RUN | IMPLEMENTED |
| MHR-005 | Technical terminology, glossary and protected-span preservation | 37–38, 40 | HUMANIZER_REQUIREMENTS.md; ADR-0009/0011 PROPOSED; implementation absent; Step 37: protected spans, placeholder rules and TH-06 terminology guidance (Thai); Step 38: protected spans, placeholder rules, technical-term and US/UK identifier handling (English) | MH-V05: protected-span comparisons and bilingual glossary review | Static: preserved-span fixture integrity PASS (E-02); protected-span comparison on outputs NOT_RUN; Step 38 static: 6 technical-terms and 5 us-uk specs, preserved-span integrity PASS (E-02); output comparison NOT_RUN; Step 40: 26 cases with structure checks plus protected spans, including 13 mixed technical cases; behavior NOT_RUN; Step 41: preservation rules documented for users; behavior NOT_RUN | IMPLEMENTED |
| MHR-006 | Semantic and factual preservation | 37–38, 40 | HUMANIZER_REQUIREMENTS.md; ADR-0011 PROPOSED; implementation absent; Step 37: meaning-carrier list, comparison check, no-new-facts rules, TH-10 flag-only handling (Thai); Step 38: meaning-carrier and hedge list, comparison check, no-new-facts rules, EN-17 flag-only handling (English) | MH-V06: compare facts/qualifiers/quantities/citations and justified corrections | Static: 5 semantic-preservation case specs PASS; source/output review NOT_RUN; Step 38 static: 7 semantic-preservation and 3 creation specs PASS; source/output review NOT_RUN; Step 40: 12 semantic cases (hedges, ต้อง/ควร, must/should, attribution, conditions) with critical judgments; behavior NOT_RUN; Step 41: fidelity rules documented for users; behavior NOT_RUN | IMPLEMENTED |
| MHR-007 | Opt-in persistent response guidance without explicit Skill invocation | 36, 39–40 | HUMANIZER_REQUIREMENTS.md; ADR-0010 PROPOSED; implementation absent; Step 39: canonical policy `response-style/chayen-response-style.md` (v1, 2,978-character body), Copilot template, D-056 PROPOSED, ADR-0010 A+B accepted by instruction (inferred); no Skill names in the policy; C not implemented or claimed | MH-V07: policy on/off, no-match, no forced Skill load, measured overhead; C unverified | NOT_RUN; Step 39 static: G-16 R-01–R-05/R-07 PASS, 14 negative controls PASS; measured size, token cost estimated only; policy on/off, no-match and override behavior NOT_RUN; C UNVERIFIED; Step 40: 20 policy cases for arms A/B/C with a loading canary; arm C target ≥95%; NOT_RUN; Step 41: setups A, B and C separated in RESPONSE_STYLE.md, install guides and the matrix; C stated as not available; behavior NOT_RUN | IMPLEMENTED |
| MHR-008 | Claude Code, OpenAI Codex and GitHub Copilot compatibility per surface | 36, 39–41 | HUMANIZER_REQUIREMENTS.md; ADR-0010 PROPOSED; implementation absent; Step 39: per-surface research with official URLs (accessed 2026-10-17) and installed versions (Claude Code 2.1.220 CLI / 2.1.301 extension, Codex 0.163.0, Copilot CLI 1.0.89, VS Code 1.142.0 + Copilot Chat 0.70.0) in RESPONSE_STYLE_DESIGN.md §3–§4; host matrix separates documented from tested | MH-V08: official dated sources plus isolated native loading/behavior matrix | NOT_RUN; Step 39: documented locations and loading rules recorded; binary string checks only; actual loading on every surface NOT_RUN; Step 40: six-surface matrix with installed versions: STATIC, UNSUPPORTED (Codex IDE plugins) or NOT_RUN; no VERIFIED cell; Step 41: user COMPATIBILITY_MATRIX rows for writing skills and policy with 2026-10-17 installed versions; all runtime cells Not tested | IN_PROGRESS |
| MHR-009 | Explicit opt-in, decline, disable, independent removal and rollback | 36, 39–41 | HUMANIZER_REQUIREMENTS.md; ADR-0010 PROPOSED; implementation absent; Step 39: opt-in (agent prompt with diff and approval, manual steps), read-only helper `tools/response-style/inspect-instructions.mjs` (status, plan-add, plan-remove), backup, removal, rollback and plugin-independence rules in docs/RESPONSE_STYLE.md | MH-V09: fresh-session lifecycle and preservation of unrelated instructions | NOT_RUN; Step 39 fixtures: G-16T 19/19 PASS (create, append, idempotence, CRLF, byte-exact removal, outdated update, refusal of modified/duplicate/malformed/newer/unmarked copies, overlap report, helper never writes). Fresh-session lifecycle and plugin uninstall on hosts NOT_RUN; Step 40: G-16T 19/19 re-run PASS; opt-out and rollback cases ready; host lifecycle NOT_RUN; Step 41: loading check, disable and rollback documented per host; G-16T 19/19 PASS; host lifecycle NOT_RUN | IMPLEMENTED |
| MHR-010 | Thai/English quality rubric and independent human evaluation | 36, 40–41 | HUMANIZER_REQUIREMENTS.md; ADR-0011 PROPOSED; implementation absent; Step 40: PROPOSED rubric `HUMANIZER_EVALUATION_RUBRIC.md`, `tests/evaluation/step40/` (120 cases, 52 probes, `run-arms.mjs`), `tools/evals/score-step40.mjs`, D-057 | MH-V10: approved rubric/dataset/sample coverage, separate per-language human/provider evidence | NOT_RUN; Step 40: G-17 PASS (dataset check, 56/56 scorer controls); rubric PROPOSED; outputs and human review NOT_RUN; Step 41: rubric still PROPOSED; verification BLOCKED on approval and reviewers | IN_PROGRESS |
| MHR-011 | Preserve engineering, technology and workflow coverage and routing | 36–41 | HUMANIZER_REQUIREMENTS.md; ADR-0009/0011 PROPOSED; implementation absent; Step 37: engineering catalog, descriptions and recipes unchanged; Thai Skill isolated from capability ownership; Step 38: engineering catalog, descriptions and recipes unchanged; English Skill isolated from capability ownership; descriptions of the 14 other Skills unchanged; Step 39: no Skill, catalog, manifest or marketplace change; policy outside the package; L0 6,221 / 6,500 unchanged | MH-V11: catalog identity, diff, repeated policy on/off/no-plugin regressions | Static: validator self-tests 153/153, engineering 206 / technology 108 / workflows 12 unchanged; native engineering routing regression NOT_RUN; Step 38 static: validator self-tests 164/164, engineering 206 / technology 108 / workflows 12 unchanged; proxy changed 2 of 199 original picks (1 is an ambiguous case); native engineering regression NOT_RUN; Step 39 static: validate-all 12/12 groups PASS, self-tests 179/179, engineering 206 / technology 108 / workflows 12 unchanged; policy-on engineering regression NOT_RUN; Step 40: 13 engineering skills, manifests, marketplaces and catalogs byte-identical to `1106226`; 206 / 108 / 12 unchanged; self-tests 179/179; proxy changes 2 of 186 baseline picks (R-62); native engineering regression NOT_RUN; Step 41: validate-all PASS, engineering catalogs unchanged; native regression NOT_RUN | IN_PROGRESS |
| MHR-012 | Security, permissions, untrusted data and advisory boundaries | 36–41 | HUMANIZER_REQUIREMENTS.md; ADR-0011 PROPOSED; implementation absent; Step 37: untrusted-content, forged-approval, secrets and copy-not-behavior boundaries in Thai Skill; zero runtime; Step 38: untrusted-content, forged-approval, secrets, instruction-file and copy-not-behavior boundaries in the English Skill; zero runtime; Step 39: policy states precedence, no authority and tool output as data; helper is read-only (imports and fs calls checked); no hooks, MCP, installer or service; G-16 R-07 keeps instruction files out of the package | MH-V12: static zero-runtime profile plus injection/secrets/authorization negatives | Static: V-25 security profile PASS; 4 security case specs PASS (structure); behavior NOT_RUN; Step 38 static: V-25 PASS; 5 security specs PASS (structure); behavior NOT_RUN; Step 39 static: V-25 PASS (256 package files unchanged), G-16 R-05/R-07 PASS; injection/permission behavior NOT_RUN; Step 40: V-25 PASS, security 34/34; injection, forged-instruction, instruction-file and code/SQL/JSON preservation cases ready; scorer controls detect executed and denied actions; behavior NOT_RUN; Step 41: writing-skill boundaries and third-party notice documented; upstream licence byte-identical; V-25 PASS; behavior NOT_RUN | IN_PROGRESS |

## Governance

| ID | Requirement | Step | Implementation evidence | Verification method | Verification evidence | Status |
|---|---|---|---|---|---|---|
| GOV-01 | Project charter | 01 | `docs/chayen/PROJECT_CHARTER.md` | File exists + user review | File existence: PASS (Step 01). User review: pending | IMPLEMENTED |
| GOV-02 | Build contract | 01 | `docs/chayen/BUILD_CONTRACT.md` | File exists + user review | File existence: PASS (Step 01). User review: pending | IMPLEMENTED |
| GOV-03 | Implementation plan | 01 | `docs/chayen/IMPLEMENTATION_PLAN.md` | File exists + user review | File existence: PASS (Step 01). User review: pending | IMPLEMENTED |
| GOV-04 | Progress log with file ledger | 01 | `docs/chayen/PROGRESS.md` | File exists + user review | File existence: PASS (Step 01). User review: pending | IMPLEMENTED |
| GOV-05 | Decision log | 01 | `docs/chayen/DECISIONS.md` | File exists + user review | File existence: PASS (Step 01). User review: pending | IMPLEMENTED |
| GOV-06 | Acceptance matrix | 01 | `docs/chayen/ACCEPTANCE_MATRIX.md` | File exists + user review | File existence: PASS (Step 01). User review: pending | IMPLEMENTED |
| GOV-07 | Issues register | 01 | `docs/chayen/ISSUES.md` | File exists + user review | File existence: PASS (Step 01). User review: pending | IMPLEMENTED |
| GOV-08 | Provider specification research, with official URL citations | 02 | `docs/chayen/PROVIDER_SPEC_RESEARCH.md` | File exists, every finding cites a source ID, + user review | File existence: PASS (Step 02). Citation check: see PROGRESS Step 02. User review: pending | IMPLEMENTED |
| GOV-09 | Provider compatibility matrix (SUPPORTED / UNSUPPORTED / UNVERIFIED) | 02 | `docs/chayen/PROVIDER_COMPATIBILITY_MATRIX.md` | File exists + user review | File existence: PASS (Step 02). User review: pending | IMPLEMENTED |
| GOV-10 | Plugin format decision | 02 | `docs/chayen/PLUGIN_FORMAT_DECISION.md` (D-009, PROPOSED) | File exists + user approval of D-009 | File existence: PASS (Step 02). User approval: pending | IMPLEMENTED |
| GOV-11 | Architecture (14 components, diagrams, dependency rules, assumptions) | 03 | `docs/chayen/ARCHITECTURE.md` | File exists, all 14 components defined, + user review | Checks: see PROGRESS Step 03. User review: pending | IMPLEMENTED |
| GOV-12 | Plugin package design (repo layout, packaging process) | 03 | `docs/chayen/PLUGIN_PACKAGE_DESIGN.md` | File exists + user review | Checks: see PROGRESS Step 03. User review: pending | IMPLEMENTED |
| GOV-13 | ADRs for the 8 required decisions | 03 | `docs/chayen/ADRS/README.md`, `ADR-0001`..`ADR-0008` | 8 ADR files present and indexed + user review | Checks: see PROGRESS Step 03. User review: pending | IMPLEMENTED |
| GOV-14 | Proof-of-concept report (native behaviour per surface) | 06 | `docs/chayen/POC_REPORT.md`, `tests/provider-compatibility/results/2026-10-14-step06.md` | File exists + user review | File existence: PASS (Step 06). User review: pending | IMPLEMENTED |
| GOV-15 | Capability coverage document (catalog guide, status rules, mapping, overlaps, generated tables) | 07 | `docs/chayen/CAPABILITY_COVERAGE.md` | File exists, generated block in sync (V-11.11), + user review | V-11.11 PASS (Step 07 T1). User review: pending | IMPLEMENTED |
| GOV-16 | Skill authoring standard (entry-skill anatomy, descriptions, reference kinds, recipe anatomy, conditional loading, evaluation cases) | 08 | `docs/chayen/SKILL_AUTHORING_STANDARD.md` (D-025) | File exists, rules mapped to validators, pilots validated against it, + user review | V-17..V-22 PASS on 6 pilots (Step 08 T1). User review: pending | IMPLEMENTED |
| GOV-17 | Skill quality gates (G-01..G-15, detection matrix, review checklist) | 08 | `docs/chayen/SKILL_QUALITY_GATES.md` | File exists; every requested detection has a validator and a negative control; + user review | G-13 self-tests 52/52 (Step 08 T2). User review: pending | IMPLEMENTED |
| GOV-18 | User and release documentation (what Chayen is and is not, native install, normal prompts, automatic selection, no-match behaviour, technology detection, explicit invocation, disable/update/uninstall, bug and skill requests, limits), release metadata, marketplace listing drafts, licence proposal, release checklist, changelog | 33 | `README.md`, `SECURITY.md`, `CHANGELOG.md`, `docs/*.md` (11), `docs/distribution/*.md` (4), `tools/validate/check-docs.mjs` | Files exist; G-14 link/anchor/identifier/skill/version check PASS; user review | G-14 PASS (18 files, 0 errors; 5/5 negative controls detected). No LICENSE, publisher identity, public URL, or security contact invented: owner decisions pending (R-56). User review: pending | IMPLEMENTED |

## Core requirements

| ID | Requirement | Step(s) | Implementation evidence | Verification method | Verification evidence | Status |
|---|---|---|---|---|---|---|
| REQ-01 | Native plugin installation and lifecycle | 02, 04, 06–08, 21 | `plugins/codejadee-chayen-framework/`, the three marketplace files (Step 04) | Clean install, update, and uninstall through each provider's native mechanism, with commands and output recorded | Step 06 run-lifecycle.sh 24/24 (Claude 2.1.270, Codex 0.160.1, Copilot 1.0.97; isolated homes; local marketplace). VS Code surfaces: NOT TESTED (manual procedures in tests/provider-compatibility/). Codex IDE: UNSUPPORTED. Remote GitHub marketplace: NOT TESTED. See POC_REPORT.md STEP 31 (2026-10-15): static manifest/marketplace/precedence PASS against the installed code of all in-scope surfaces (FINAL_PROVIDER_COMPATIBILITY.md §4); check-identity.mjs 15/15 PASS; native install/update/uninstall for the 13-skill package NOT_TESTED (lifecycle opt-in denied in session; R-53); version 0.1.0-dev unchanged, update risk R-54. Release gate OPEN. STEP 33: native install, explicit invocation, disable/update/uninstall documented per provider and surface (docs/INSTALL_*.md), labelled with actual verification status; repository is private, so GitHub marketplace installs need access. | IN_PROGRESS |
| REQ-02 | Automatic skill discovery from ordinary prompts | 04, 10, 05, 06 | 6 pilot entry skills (plugins/codejadee-chayen-framework/skills/chayen-*/SKILL.md), descriptions per D-017 | Positive trigger suite per provider, measured activation rate | Step 06 routing: Codex 3/3, Copilot 3/3 (clean env), Claude eval positives 20/27 run 1 (23/27 triggered at least once); single runs only, no statistical baseline; competing personal skills can win (POC_REPORT §4) Step 09: 10 trigger cases added (58 total) for the new and extended skills; NOT_RUN. Step 10: 9 trigger cases added (67 total); NOT_RUN. Step 11: 9 trigger cases added (76 total), including an unsupported Go backend; NOT_RUN. Step 12: chayen-frontend description rewritten (shells added, React Native and Flutter excluded); 9 trigger cases added (85 total), including React Native and Flutter unsupported cases; NOT_RUN. Step 13: chayen-data added and chayen-testing description rewritten; 12 trigger cases added (97 total), pos-backend-migration-index re-categorised to ambiguous (D-033); NOT_RUN. Step 14: chayen-performance added and chayen-security description rewritten; 10 trigger cases added (107 total), amb-slow-and-injection widened (D-034); NOT_RUN. Step 15: chayen-devops added; 7 trigger cases added (114 total), uns-helm moved to a chayen-devops positive (D-035); NOT_RUN. Step 16: chayen-documentation added, repository and implementation descriptions rewritten; 7 trigger cases added (121 total), two ambiguous cases widened (D-036); NOT_RUN. Step 17: chayen-ai-engineering added; 7 trigger cases added (128 total); NOT_RUN. Step 18: frontend and AI engineering descriptions rewritten; 7 trigger cases added (135 total); NOT_RUN. STEP 32 (Claude Code 2.1.270, --plugin-dir, six-stack fixture, 2–4 runs per probe): positive routing 14/20; selection precision 14/14; Next.js route 0/4; pytest 2/4; 13/13 skills discovered. Copilot/Codex NOT_RUN (EVALUATION_REPORT.md). STEP 34 audit note: the implementation column's '6 pilot entry skills' is historical; the package now has 13 entry skills. STEP 34 audit Run C: 9/13. Pooled 43 runs: automatic 12/22 (55%), explicit 6/6, 0/18 wrong loads. | IN_PROGRESS |
| REQ-03 | No explicit Chayen invocation required | 04, 10, 05, 06 | Skill descriptions need no plugin mention; trigger cases forbid "Chayen" in prompts (V-16) | Trigger suite prompts contain no "Chayen" or plugin reference | Step 06: all routing prompts omit Chayen; positives triggered on all three CLIs. Under-triggering for implementation/repository/security prompts on Claude (empty workspace) STEP 32: probe prompts never name Chayen; 14/20 positive runs loaded the expected skill without naming it. | IN_PROGRESS |
| REQ-04 | No applicable skill means native AI behaviour | 04, 10, 05, 06 | No hooks/always-on components; `Not for` clauses; no-match gate sentence in every skill (V-17) | Negative trigger suite: no skill activation on unrelated prompts. Validator: no always-on injection (D-007) | Step 06: irrelevant prompts silent 10/10 (Claude 8/8, Codex 1/1, Copilot 1/1); unsupported silent Claude 7/7, Codex 2/2, Copilot 0/2 (over-activation, guidance not misapplied per agent transcript review) STEP 32: no-match 8/8 runs (Rust Axum, general conversation, explicit decline, destructive production drop); explicit decline respected 2/2. STEP 34: no-match 12/12 pooled (Run C 4/4). | IN_PROGRESS |
| REQ-05 | 206 capabilities in 20 domains | 03, 07, 11–19 | `catalog/engineering-capabilities.yaml` (206 records, 20 domains, each with ID, purpose, triggers, inputs, outputs, entry-skill and recipe mapping, verification, status); `docs/chayen/CAPABILITY_COVERAGE.md` | Validator coverage check: every catalog ID maps to skill content, counts = 206 / 20 | V-11 PASS (Step 07 T1: 206 records, 206 unique ids and names, 20 domains, inventory fingerprint match; T2: 18/18 negative controls rejected; T3: PyYAML cross-parse identical). Content coverage: 31 IN_PROGRESS (pilot content), 175 PLANNED, 0 IMPLEMENTED. Capability behaviour evals: NOT_RUN. User review of the catalog: pending Step 09: D01 9/9 and D02 10/10 IMPLEMENTED (19/206); 28 IN_PROGRESS; 159 PLANNED; VERIFIED 0. Step 10: D03 10/10 and D04 8/8 IMPLEMENTED; total 37/206 IMPLEMENTED, 24 IN_PROGRESS, 145 PLANNED, VERIFIED 0. Step 11: D05 12/12 and D06 10/10 IMPLEMENTED; total 59/206 IMPLEMENTED, 19 IN_PROGRESS, 128 PLANNED, VERIFIED 0. Step 12: D07 10/10 and D08 8/8 IMPLEMENTED (D08 scope D-032 PROPOSED); total 77/206 IMPLEMENTED, 16 IN_PROGRESS, 113 PLANNED, VERIFIED 0. Step 13: D09 12/12 and D10 14/14 IMPLEMENTED; total 103/206 IMPLEMENTED, 10 IN_PROGRESS, 93 PLANNED, VERIFIED 0. Step 14: D11 14/14 and D12 10/10 IMPLEMENTED; total 127/206 IMPLEMENTED, 1 IN_PROGRESS, 78 PLANNED, VERIFIED 0. Step 15: D13 12/12 and D14 10/10 IMPLEMENTED; total 149/206 IMPLEMENTED, 1 IN_PROGRESS, 56 PLANNED, VERIFIED 0. Step 16: D15 10/10 and D16 10/10 IMPLEMENTED; total 169/206 IMPLEMENTED, 1 IN_PROGRESS, 36 PLANNED, VERIFIED 0. Step 17: D17 10/10 and D18 10/10 IMPLEMENTED; total 189/206 IMPLEMENTED, 0 IN_PROGRESS, 17 PLANNED, VERIFIED 0. Step 18: D19 9/9 and D20 8/8 IMPLEMENTED; total 206/206 IMPLEMENTED, VERIFIED 0. Step 19: coverage audit `node tools/catalog/audit-coverage.mjs` PASS 206/206 on ten static criteria (ENGINEERING_COVERAGE_AUDIT.md); names match the inventory exactly; behaviour and trigger evals NOT_RUN. | IMPLEMENTED |
| REQ-06 | Progressive skill and reference loading | 04, 05 | Conditional references in plugins/codejadee-chayen-framework/skills/*/references/ (16 files), loaded per routing tables | Validator: size budgets, references reachable only through skill links. Provider behaviour confirmed in Step 02 | V-06/V-08 PASS; Claude `details`: always-on ~615 tok vs on-invoke ~1.4–1.6k tok per skill. Reference-load behaviour: NOT_RUN STEP 32: skill-local reference loading observed 8/16 probe runs (Angular forms 2/2, PostgreSQL tuning 2/2, SQL Server 3/4, Python testing 1/4, Next.js 0/4); estimated L0 ~1,371 tokens, worst-case activation ~3.6k–7.3k tokens (chars/4). STEP 34 audit note: '(16 files)' is historical; the package now has 221 references, all reachable (independent check). | IN_PROGRESS |
| REQ-07 | Preserve existing repository architecture and conventions | 09, 11–19, 05 | Precedence + detect-existing-conventions steps in all 6 skills and every reference's 'Check the repository first' table | Skill review checklist (detect-before-prescribe, D-008). Trigger tests on repos with non-default conventions | Static review only; convention-conflict behaviour tests: NOT_RUN Step 11: implementation and backend principles require analogous-code templates, task-scoped diffs, pure change types, and no silent dependency or framework replacement (D-031); behaviour NOT_RUN. Step 12: chayen-frontend detects the framework and shell (no default framework), reuses the design system, state library, form library, and native plugins, and asks before adding any; behaviour NOT_RUN. Step 13: chayen-data mirrors existing schema conventions and generates migrations with the project's tool; chayen-testing reuses the existing framework and helpers and takes a baseline first; behaviour NOT_RUN. Step 14: security and performance recipes reuse the existing scanners, caches, load tools, and profilers, and ask before adding any; behaviour NOT_RUN. Step 15: chayen-devops mirrors existing pipelines, modules, and naming; behaviour NOT_RUN. Step 16: refactor plans and dead-code removal require characterization or regression tests where feasible, and documentation follows the repository's templates and locations; behaviour NOT_RUN. Step 20: .NET sections detect the actual .NET version, API style, and architecture rules first and never impose a new pattern (TC-03, TC-04). | IN_PROGRESS |
| REQ-08 | Evidence-driven verification | 09, 05 | Verification + Failure handling sections in all skills; task-contract.md and change-summary.md (PASS/FAIL/NOT_RUN rules) | Skill content review, plus tests that responses cite executed commands and output | V-17 PASS; behaviour: NOT_RUN Step 11: every D05 and D06 recipe verifies with the project's own commands (CI and scripts) and reports PASS, FAIL, or NOT_RUN; behaviour NOT_RUN. Step 12: every D07 and D08 recipe separates recommendations from observed behaviour ("not verified in browser" or "on device"), and platform builds without an SDK are NOT_RUN with the reason; behaviour NOT_RUN. Step 13: chayen-testing reports PASSED, FAILED, SKIPPED, BLOCKED, NOT_RUN, or UNKNOWN per test and never claims an unexecuted pass; chayen-data reports which database each check ran against; behaviour NOT_RUN. Step 14: chayen-performance labels every claim MEASURED, ESTIMATED, or HYPOTHESIS and proves optimizations only by before and after measurements; security audits and scanners are reported with results or NOT_RUN; behaviour NOT_RUN. Step 15: chayen-devops verifies with lint, validate, plan or what-if, and dry runs, and reports remote steps as NOT_RUN without credentials; behaviour NOT_RUN. Step 16: chayen-documentation sources every command and result (fact-checking checklist) and never reports a test result that did not run; behaviour NOT_RUN. Step 17: AI claims need evaluations with run counts and variance; evidence audits re-check claims; go/no-go, waivers, policies, and access reviews label every output a recommendation, and approvals come only from named people; behaviour NOT_RUN. | IN_PROGRESS |
| REQ-09 | Security guidance without claiming hard enforcement | 09, 05 | plugins/codejadee-chayen-framework/skills/chayen-security/ (advisory statement, checklist, stack hardening) | Validator forbidden-claim check (D-003), plus content review | V-10 PASS (no enforcement/absolute claims); behaviour: NOT_RUN. Step 13: chayen-data and its database-safety checklist state they are advisory and name the real controls (read-only roles, replicas, CI approvals); V-10 PASS. Step 14: chayen-security restates it cannot block or force anything, excludes destructive and unauthorized testing, and names the real controls; V-10 PASS (one negated phrase was reworded after V-10 flagged it). Step 15: chayen-devops states it grants no access and that deploy, rollback, restart, and destructive infrastructure commands need user approval and platform authorization; V-10 PASS. Step 17: chayen-ai-engineering and the governance recipes state that recommendations are not authorizations and that enforcement comes from provider permissions and platform controls; V-10 PASS | IN_PROGRESS |
| REQ-10 | Provider compatibility and regression tests | 05, 10, 20, 06 | tools/validate/, tools/evals/generate-claude-evals.mjs (--stage), tests/skills/trigger-cases.json, tests/evals/claude/, tests/provider-compatibility/run-lifecycle.sh, tests/routing/run-smoke.mjs | Automated suite run in CI and locally, results recorded per provider | Step 06: lifecycle 24/24; Claude eval executed (48 cases, $3.76 run 1); Codex/Copilot smoke executed; CI not set up; VS Code manual Step 08: validator self-tests 52/52; lifecycle re-run 24/24. Step 19: developer-only coverage audit `tools/catalog/audit-coverage.mjs` PASS 206/206 (ten static criteria); validate-all 4/4, self-tests 53/53, lifecycle 24/24. Step 20: technology checker V-23 with 14 negative controls (self-tests 68/68); .NET framework fact checks 32/32 PASS; lifecycle 24/24. STEP 31: validate-all 8 gate groups PASS (132/132 self-tests); claude plugin validate --strict PASS (2.1.270 and bundled 2.1.299); new offline tests/provider-compatibility/check-identity.mjs 15/15 PASS; runbook R-1..R-10 added; provider runtime runs NOT_TESTED (R-53). STEP 32: tools/evals/run-evaluation-suite.mjs (15 categories, 4 evidence levels) PASS; T-206 206/206, T-TECH 108/108, T-WF 12/12, routing examples 11/11; facts 107/0/52; tests/evaluation/run-provider-probes.mjs executed on Claude Code (31 billed runs, about $6.44); DF-01 fixed; CI still not set up. | IN_PROGRESS |

## Exclusions (must remain true)

| ID | Constraint | Step(s) | Implementation evidence | Verification method | Verification evidence | Status |
|---|---|---|---|---|---|---|
| EX-01 | No Chayen CLI | 05, 22, 06 | plugins/codejadee-chayen-framework/ contains only .md/.json (no CLI, installer, web app, extension, runtime, daemon, MCP) | Validator / release audit: no executable entry points shipped | V-09 PASS; Claude inventory Agents/Hooks/MCP/LSP = 0; native-only install verified on 3 CLIs (Step 06). Release audit (Step 22): NOT_RUN STEP 34 release audit (executed): no CLI: package is 236 .md + 2 .json; no bin/command entry anywhere; tools/ are developer scripts without package.json or bin. | VERIFIED |
| EX-02 | No custom installer | 05, 22, 06 | plugins/codejadee-chayen-framework/ contains only .md/.json (no CLI, installer, web app, extension, runtime, daemon, MCP) | Release audit: install docs use native mechanisms only | V-09 PASS; Claude inventory Agents/Hooks/MCP/LSP = 0; native-only install verified on 3 CLIs (Step 06). Release audit (Step 22): NOT_RUN STEP 34 release audit (executed): no installer: no install/setup script in the repository; docs/INSTALL_*.md use only native plugin commands. | VERIFIED |
| EX-03 | No web application | 22, 06 | plugins/codejadee-chayen-framework/ contains only .md/.json (no CLI, installer, web app, extension, runtime, daemon, MCP) | Release audit | V-09 PASS; Claude inventory Agents/Hooks/MCP/LSP = 0; native-only install verified on 3 CLIs (Step 06). Release audit (Step 22): NOT_RUN STEP 34 release audit (executed): no web application shipped; the only app sources are test fixtures under tests/evaluation/fixture and tests/technology (never shipped). | VERIFIED |
| EX-04 | No VS Code extension | 22, 06 | plugins/codejadee-chayen-framework/ contains only .md/.json (no CLI, installer, web app, extension, runtime, daemon, MCP) | Release audit: no `package.json` extension manifest or `.vsix` | V-09 PASS; Claude inventory Agents/Hooks/MCP/LSP = 0; native-only install verified on 3 CLIs (Step 06). Release audit (Step 22): NOT_RUN STEP 34 release audit (executed): no VS Code extension: no extension package.json or .vsix (the only package.json files are two evaluation fixture apps). | VERIFIED |
| EX-05 | No standalone agent runtime | 22, 06 | plugins/codejadee-chayen-framework/ contains only .md/.json (no CLI, installer, web app, extension, runtime, daemon, MCP) | Release audit | V-09 PASS; Claude inventory Agents/Hooks/MCP/LSP = 0; native-only install verified on 3 CLIs (Step 06). Release audit (Step 22): NOT_RUN STEP 34 release audit (executed): no standalone runtime: package has no executable, script, agent, hook or command component (independent scan, 0 forbidden files). | VERIFIED |
| EX-06 | No background daemon | 22, 06 | plugins/codejadee-chayen-framework/ contains only .md/.json (no CLI, installer, web app, extension, runtime, daemon, MCP) | Release audit | V-09 PASS; Claude inventory Agents/Hooks/MCP/LSP = 0; native-only install verified on 3 CLIs (Step 06). Release audit (Step 22): NOT_RUN STEP 34 release audit (executed): no daemon shipped. Developer fact runners start temporary local PostgreSQL clusters (stopped) and a kept LocalDB instance 'ChayenFacts' only during maintainer tests. | VERIFIED |
| EX-07 | No mandatory MCP server | 05, 22, 06 | plugins/codejadee-chayen-framework/ contains only .md/.json (no CLI, installer, web app, extension, runtime, daemon, MCP) | Validator: no required MCP configuration in any manifest | V-09 PASS; Claude inventory Agents/Hooks/MCP/LSP = 0; native-only install verified on 3 CLIs (Step 06). Release audit (Step 22): NOT_RUN STEP 34 release audit (executed): no MCP configuration (mcp.json / .mcp.json) in the package or repository. | VERIFIED |

## Providers

| ID | Requirement | Step(s) | Implementation evidence | Verification method | Verification evidence | Status |
|---|---|---|---|---|---|---|
| PRV-CC | Claude Code native plugin + marketplace packaging | 02, 04, 06 | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | Native install in a clean environment, plus trigger suite | CLI: lifecycle PASS, discovery PASS, routing partial (POC_REPORT), explicit /codejadee-chayen-framework:chayen-security PASS, disable removes behaviour PASS. VS Code extension: NOT TESTED. Remote install: NOT TESTED STEP 31: CLI 2.1.270 and VS Code ext 2.1.299 strict validate PASS; binaries read .claude-plugin/plugin.json only (no Agent Plugins); runtime checks 3–10 NOT_TESTED on both surfaces. | IN_PROGRESS |
| PRV-CX | OpenAI Codex native packaging | 02, 04, 07, 06 | `plugin.json` (Agent Plugins), `.agents/plugins/marketplace.json` | Native install in a clean environment, plus trigger suite | CLI: lifecycle PASS, discovery PASS (6 skills listed by the model), routing smoke 7/7, disable via config.toml PASS (-c override does not disable). IDE extension: UNSUPPORTED. Desktop app / remote install: NOT TESTED STEP 31: CLI 0.160.1 binary selects .agents/plugins/marketplace.json and root Agent Plugins manifest (static); no per-plugin update command; runtime NOT_TESTED. IDE ext 26.1007.21434: UNSUPPORTED (S13 re-read 2026-10-15; bundle contains plugin RPCs, not documented). | IN_PROGRESS |
| PRV-GH | GitHub Copilot native packaging | 02, 04, 08, 06 | `plugin.json` (Agent Plugins), `.github/plugin/marketplace.json` | Native install in a clean environment, plus trigger suite | CLI 1.0.97: lifecycle PASS incl. enable/disable (U-14 resolved for ≥1.0.91), discovery PASS, routing smoke 5/7 (Unity/SwiftUI over-activation), disable removes behaviour PASS. VS Code: NOT TESTED. Remote install: NOT TESTED STEP 31: CLI 1.0.97 and VS Code 1.141.1 (Copilot 0.69.0) select .github/plugin/marketplace.json and root Agent Plugins manifest (shipped code; U-04 resolved statically); chat.plugins.enabled default true, policy-controllable; runtime NOT_TESTED on both. | IN_PROGRESS |

## Stack coverage

| ID | Technology | Tier | Step | Implementation evidence | Verification method | Verification evidence | Status |
|---|---|---|---|---|---|---|---|
| STK-01 | C# / ASP.NET Core Web API | Primary | 11, 05 | Pilot guidance (Step 05); .NET technology pack (Step 20, D-039): 22 technology capabilities in `catalog/technology-capabilities.yaml`, sections in 12 new and 2 changed technology references across 6 skills | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS. Catalog (Step 07): 66 records apply to `dotnet-aspnetcore` explicitly or through a stack group (15 IN_PROGRESS), plus 107 stack-neutral records. Capability behaviour and trigger suite per capability: NOT_RUN. Step 20: V-23 PASS (22/22, 57 cases); .NET fact checks 32/32 PASS (`node tests/technology/dotnet/run-fact-checks.mjs`); behaviour and trigger evals NOT_RUN | IMPLEMENTED |
| STK-02 | Angular / TypeScript | Primary | 21, 12, 05 | 14 Angular technology records; frontend base and five topics plus testing topic, mapped in `catalog/technology-capabilities.yaml`; `TECHNOLOGY_COVERAGE.md` §7 | Catalog, positive/negative cases, framework facts, behavior/trigger evals | `node tools/catalog/check-technology.mjs` PASS: 14/14 Angular mappings and sections, 17 positive/14 negative specifications. AF-01..14 NOT_RUN (no installed Angular application/browser fixture); agent behavior and trigger evals NOT_RUN. No Angular build or hydration claim | IMPLEMENTED |
| STK-03 | Microsoft SQL Server | Primary | 26, 13, 05 | 12 technology sections in `chayen-data` (expanded `sql-server.md` base plus five topic references) and EF Core SQL Server, Dapper, and ADO.NET data access recipes; TECHNOLOGY_COVERAGE §13 | Catalog/specs, executed engine/ORM facts on a disposable database, behavior/trigger evaluations | `node tools/catalog/check-technology.mjs` PASS: 12/12 sections, 27 positive/12 negative specs, V-23.10 recipes and 9 recipe cases. `node tests/technology/sqlserver/run-fact-checks.mjs --report tests/technology/sqlserver/results/step26-fact-checks.md`: 30/30 PASS (DR-01..03 driver references, SF-01..27) on SQL Server 2025 Express LocalDB only. Other editions, Azure SQL, and agent evaluations NOT_RUN (R-46) | IMPLEMENTED |
| STK-04 | JavaScript / TypeScript | Additional | 21, 14, 05 | 8 shared TS/JS technology records; implementation base and types/runtime/workspace topics mapped in `catalog/technology-capabilities.yaml`; `TECHNOLOGY_COVERAGE.md` §7 | Catalog, positive/negative cases, framework facts, behavior/trigger evals | `node tools/catalog/check-technology.mjs` PASS: 8/8 shared mappings and sections, 13 positive/8 negative specifications. JF-01..08 PASS via `node tests/technology/angular-typescript/run-fact-checks.mjs` with existing compiler/npm arguments (exact command in report and PROGRESS). Agent behavior/trigger evals NOT_RUN; other runtime versions NOT_RUN | IMPLEMENTED |
| STK-05 | React | Additional | 22, 14, 05 | Eight technology sections in frontend topics and testing, mapped in `catalog/technology-capabilities.yaml`; `TECHNOLOGY_COVERAGE.md` §9 | Catalog/cases, configured framework tests, behavior/trigger evaluations | `node tools/catalog/check-technology.mjs` PASS: 8/8 mappings/sections, 11 positive/8 negative specs. RF-01..08 NOT_RUN without installed app/runner/browser fixture. Agent behavior/trigger evaluations NOT_RUN; no library/router migrations or new dependencies | IMPLEMENTED |
| STK-06 | Next.js | Additional | 22, 14, 05 | Eight technology sections across frontend/backend/devops; version/router detection, server/client/secret boundaries, direct auth, cache and artifact guidance; `TECHNOLOGY_COVERAGE.md` §9 | Catalog/cases, direct server-boundary tests, production/browser/behavior/trigger checks | `node tools/catalog/check-technology.mjs` PASS: 8/8 mappings/sections, 13 positive/8 negative specs. `node tests/technology/react-nextjs/run-fact-checks.mjs --report tests/technology/react-nextjs/results/step22-fact-checks.md`: NF-03/04/06 synthetic JS/Web boundary checks PASS, remaining five Next checks NOT_RUN. Compiled Next/cache/auth-provider/browser/deployment and agent evaluations NOT_RUN | IMPLEMENTED |
| STK-07 | Vue | Additional | 23, 15, 05 | Seven mapped technology sections in frontend/testing; version/Options/setup/reactivity/router/store/SSR/testing guidance; TECHNOLOGY_COVERAGE §11 | Catalog/specs, configured framework/browser and agent evaluations | `node tools/catalog/check-technology.mjs` PASS: 7/7 sections, 10 positive/7 negative specs. VF-01..07 NOT_RUN; no installed core/component/store/router/browser fixture. Agent evaluations NOT_RUN; no automatic Composition/store/builder migration | IMPLEMENTED |
| STK-08 | Nuxt | Additional | 23, 15, 05 | Seven sections across frontend/backend/devops; pages/data/context/modules/private config and SSR/artifact procedures; TECHNOLOGY_COVERAGE §11 | Catalog/specs, configured server/SSR/build/context/browser checks | V-23 PASS: 7/7 sections, 10 positive/7 negative specs. `node tests/technology/vue-nuxt-vite/run-fact-checks.mjs --report tests/technology/vue-nuxt-vite/results/step23-fact-checks.md`: UF-04 JavaScript serialization counterexample PASS; six other Nuxt checks NOT_RUN. Actual Nuxt config overrides/payload/secrets/context/hydration/server/runtime and agent evaluations NOT_RUN | IMPLEMENTED |
| STK-09 | Vite | Additional | 23, 15, 05 | Four sections in devops/testing; selected-builder/config ownership, build measurement, env privacy and configured runner integration; TECHNOLOGY_COVERAGE §11 | Catalog/specs, configured build/env/artifact/runner and agent checks | V-23 PASS: 4/4 sections, 6 positive/4 negative specs. BF-03 JavaScript string/spread exposure counterexample PASS via Step 23 runner; three other Vite checks NOT_RUN. Actual Vite transforms/bundles/privacy/measurements/config/runner and agent evaluations NOT_RUN; no assumed Vite/Vitest | IMPLEMENTED |
| STK-10 | Nitro | Additional | 16, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS. Catalog (Step 07): 28 records apply to `nitro` explicitly or through a stack group (8 IN_PROGRESS), plus 107 stack-neutral records. Capability behaviour and trigger suite per capability: NOT_RUN | IN_PROGRESS |
| STK-11 | Elysia | Additional | 16, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS. Catalog (Step 07): 28 records apply to `elysia` explicitly or through a stack group (8 IN_PROGRESS), plus 107 stack-neutral records. Capability behaviour and trigger suite per capability: NOT_RUN | IN_PROGRESS |
| STK-12 | Python | Additional | 17, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS. Catalog (Step 07): 74 records apply to `python` explicitly or through a stack group (15 IN_PROGRESS), plus 107 stack-neutral records. Capability behaviour and trigger suite per capability: NOT_RUN | IN_PROGRESS |
| STK-13 | PostgreSQL | Additional | 27, 17, 05 | 10 technology sections in `chayen-data` (expanded `postgresql.md` plus five topic references) and EF Core Npgsql, Npgsql, SQLAlchemy, and other data access recipes; cross-stack portability review; TECHNOLOGY_COVERAGE §15 | Catalog/specs, executed engine/ORM facts on a temporary cluster, behavior/trigger evaluations | `node tools/catalog/check-technology.mjs` PASS: 10/10 sections, 20 positive/10 negative specs, V-23.10 recipes and 11 recipe cases. `node tests/technology/postgres-crossstack/run-fact-checks.mjs --report tests/technology/postgres-crossstack/results/step27-fact-checks.md ...`: DR-01..04 and PF-01..24 PASS on PostgreSQL 18.6 only. Managed services, other majors, and agent evaluations NOT_RUN (R-47, R-48) | IMPLEMENTED |
| STK-14 | Java | Optional extension | 19 | — | Catalog coverage + trigger suite (only if Q-08 approves) | Catalog (Step 07): 0 records list `java` (optional pack, Q-08) | PLANNED |

## Architecture components (design: ARCHITECTURE.md §3–§4)

| ID | Component | Planned step(s) | Implementation evidence | Verification method | Verification evidence | Status |
|---|---|---|---|---|---|---|
| ARC-01 | C-01 Portable Plugin Package | 04, 06 | `plugins/codejadee-chayen-framework/` (manifests, README, `skills/` canonical source; 0 skills) | V-09, V-13, X-01, plus install on each surface | V-09 PASS, V-13 PASS, X-01 PASS. Local installs: see REQ-01. Install on every surface: NOT_RUN. STEP 34 audit note: '0 skills' is historical; 13 skills / 238 files. | IMPLEMENTED |
| ARC-02 | C-02 Provider Compatibility Metadata | 04, 06–08 | `plugins/codejadee-chayen-framework/plugin.json`, `.../.claude-plugin/plugin.json` | V-01..V-04, X-01, install tests (U-01, U-02) | V-02 PASS, plus **official Agent Plugins 1.0.0 JSON Schema** (ajv 2020) PASS with 4/4 negative controls rejected. V-03 PASS, V-04 PASS, X-01 PASS. | IMPLEMENTED |
| ARC-03 | C-03 Engineering Capability Catalog | 04, 07 | `catalog/engineering-capabilities.yaml` (single restricted-YAML file, D-021; IDs and status rules D-022; 14-skill mapping D-023 PROPOSED; 56 consolidation groups, 61 overlaps D-024) | V-11 (counts, uniqueness, inventory identity, mapping integrity) | V-11 PASS (`node tools/catalog/check-catalog.mjs`, Step 07 T1); negative controls 18/18 rejected (T2); PyYAML 6.0.3 cross-parse identical (T3). User review: pending Step 08: recipe paths must be `references/*.md` (D-026); 27 mappings re-pointed; V-11 PASS; catalog negative controls 19/19. | IMPLEMENTED |
| ARC-04 | C-04 Entry Skills (≤14) | 04 (set), 09–18 (content), 05 | 6 pilot entry skills in plugins/codejadee-chayen-framework/skills/ (D-015) | V-05..V-07, positive trigger suite | V-05, V-07 (L0 2292/4000 chars), V-07b (max overlap 0.14), V-17 PASS; skills-ref validate 6/6 valid; claude plugin validate --strict PASS; positive trigger suite: NOT_RUN Step 08: all 6 meet SKILL_AUTHORING_STANDARD §4 (scope line, 10 ordered sections, Safety boundaries, Reference/Load-when table); V-05/V-17/V-20 PASS; `claude plugin validate --strict` PASS; skills-ref 6/6 valid; lifecycle 24/24 (6 skills discoverable on 3 CLIs). Behaviour after restructuring: NOT_RUN (R-31). Step 09: 7 entry skills (chayen-requirements added; chayen-repository extended); L0 2787/4000; V-07b max overlap 0.12; skills-ref 7/7 valid; lifecycle 24/24 (7 skills discoverable on 3 CLIs). Trigger effect of the two description changes: NOT_RUN (R-32). Step 10: 8 entry skills (chayen-architecture added); L0 3226/4000; skills-ref 8/8 valid; lifecycle 24/24 (8 skills on 3 CLIs). Step 11: chayen-implementation and chayen-backend rebuilt as routers (177 and 183 lines); L0 3315/4000; skills-ref 8/8 valid; lifecycle 24/24. Step 12: chayen-frontend rebuilt as a router (189 lines, 16 references); L0 3349/4000; skills-ref 8/8 valid; lifecycle 24/24. Step 13: chayen-data added (9 skills, user-approved, D-033) and chayen-testing rebuilt as a router; L0 3794/4000; skills-ref 9/9 valid; lifecycle 24/24 with 9 skills discoverable. Step 14: chayen-performance added (10 skills) and chayen-security rebuilt as a router; L0 4224/4400 after the user-approved cap change (D-034); skills-ref 10/10 valid; lifecycle 24/24 with 10 skills discoverable. Step 15: chayen-devops added (11 skills); L0 4654/4700 after the user-approved cap change (D-035); skills-ref 11/11 valid; lifecycle 24/24 with 11 skills discoverable. Step 16: chayen-documentation added and chayen-modernization removed from the catalog (12 skills); L0 5051/5200 after the user-approved cap change (D-036); skills-ref 12/12 valid; lifecycle 24/24 with 12 skills discoverable. Step 17: chayen-ai-engineering added (13 skills, all mapped entry skills now exist); L0 5477/5500 after the user-approved cap change (D-037); skills-ref 13/13 valid; lifecycle 24/24 with 13 skills discoverable. Step 18: no new skill; L0 5485/5500; skills-ref 13/13 valid; lifecycle 24/24. STEP 34 audit note: now 13 entry skills (≤14 cap held). | IMPLEMENTED |
| ARC-05 | C-05 Technology Reference Packs | 11–19, 05 | Skill-local stack references (D-016): aspnetcore-webapi, data-access, node-servers, python-web-apis, angular, react-nextjs, vue-nuxt, dotnet/javascript/python testing, stack-hardening, stack-detection | V-06, V-08, V-12, behavioural suite | V-06, V-08, V-12 PASS; behavioural suite: NOT_RUN; shared knowledge packs deferred (U-11/U-13) | IN_PROGRESS |
| ARC-06 | C-06 Skill Applicability Rules | 09, 05, 06 | When to use / When not to use / gate sentence / precedence in every SKILL.md | Negative, gate, and convention-conflict suites (ADR-0003) | V-17 PASS; Step 06 negative suite 10/10 silent; unsupported: Claude 7/7, Codex 2/2 silent, Copilot 0/2 (gate did not prevent activation; no misapplied guidance observed) Step 08: `**Scope:**` gate line added to all 6 pilots (R-24 recommendation); effect on Copilot over-activation: NOT_RUN. | IMPLEMENTED |
| ARC-07 | C-07 Progressive Reference Loading | 05, 09 | Routing tables load one reference per detected stack; ≤2 hops; skill-local | V-06..V-08, reference-load checks (U-11, AS-04) | V-06, V-08 PASS; reference-load checks: NOT_RUN | IN_PROGRESS |
| ARC-08 | C-08 Composite Development Workflows | 29, 09 | Twelve owner-local workflow checklists; catalog/composite-workflows.json; WORKFLOW_COVERAGE.md | V-06/V-08/V-24 and behavioral evaluation | STEP 29: V-24 PASS for 12 workflows, 47 specifications and mapped recipe/technology/template references; six automated gate groups and 132/132 self-tests PASS. Live agent/provider workflow execution NOT_RUN (R-51). | IMPLEMENTED |
| ARC-09 | C-09 Task Contract Templates | 29, 09, 05 | Existing task-contract.md recipe plus task-contract-template.md, implementation-plan-template.md and risk-assessment-template.md in implementation | V-12/V-18/V-24 and behavioral suite | STEP 29: reusable template leaves and owning recipe references validated; approvals default NOT_PROVIDED, repository formats first, proportional output. Template behavior evaluations NOT_RUN. Earlier Step 08/10 recipe and risk scale remain implemented. | IMPLEMENTED |
| ARC-10 | C-10 Evidence and Change Passport Templates | 29, 09, 05 | Existing change-summary.md/session-handoff.md/decision-records.md recipes plus verification-report-template.md, change-passport-template.md, context-capsule-template.md and architecture-decision-record-template.md | V-12/V-18/V-24 and behavioral suite | STEP 29: four reusable evidence/passport/handoff/ADR formats validated; exact evidence, NOT_RUN, partial outcomes and real approval source retained. ADR starts PROPOSED. Live behavior NOT_RUN, no VERIFIED promotion. | IMPLEMENTED |
| ARC-11 | C-11 Security and Trust Guidance | 09, 05 | plugins/codejadee-chayen-framework/skills/chayen-security/ (SKILL.md, review-checklist.md, stack-hardening.md) | V-10, security behaviour cases (ADR-0007) | V-10 PASS; security behaviour cases: NOT_RUN | IMPLEMENTED |
| ARC-12 | C-12 Developer-only Validators | 04, 05 | tools/validate/validate-package.mjs: V-01a–c, V-02–V-10, V-12, V-13, V-16, V-17; tools/catalog/check-catalog.mjs: V-11 (zero deps) | Validator self-tests on good and bad fixtures | Repo: 0 errors 0 warnings. Mutated copies: Step 04 (12 errors) and Step 05 (21 errors) all injected faults detected. CI + committed fixtures: NOT_RUN; V-11 implemented in Step 07 (18/18 mutated catalogs rejected); V-14, V-15 not implemented Step 08: V-03 unsupported fields, V-05 strict frontmatter + duplicate names, V-08 anchors + unreachable refs, V-17 revised, V-18 reference kinds, V-19 catalog alignment, V-20 breadth, V-22 recipe cases; self-tests `run-validator-tests.mjs` 52/52 (2 baselines + 50 negative controls); `validate-all.mjs`. | IN_PROGRESS |
| ARC-13 | C-13 Evaluation and Compatibility Test Suites | 05, 10, 20, 06 | tests/skills/trigger-cases.json, tests/evals/claude/ (staged via generator --stage), tests/routing/ (run-smoke.mjs, smoke-cases.json, results/), tests/provider-compatibility/ (run-lifecycle.sh, VS Code procedures, results/) | Suites executed, with results recorded | Executed Step 06: lifecycle 24/24; Claude eval 48 cases + 25 re-runs; Codex 7/7 + disabled 1/1; Copilot 5/7 + disabled 1/1. Statistical baseline and fixture workspaces: NOT_RUN Step 08: tests/catalog/catalog-mutations.json (19), tests/skills/validator-mutations.json (31), tests/skills/recipe-cases.json (10 cases, execution NOT_RUN). | IN_PROGRESS |
| ARC-14 | C-14 Marketplace Distribution | 04, 06–08, 22 | `.claude-plugin/marketplace.json`, `.github/plugin/marketplace.json`, `.agents/plugins/marketplace.json` (D-013) | V-01, V-14, install-from-marketplace tests | V-01a/b/c PASS, consistency PASS. `claude plugin validate --strict` (marketplace) PASS. Local-path marketplace installs: Claude PASS, Codex PASS, Copilot PASS. Provider file-selection observed (Copilot uses `.github/plugin`; Codex uses `.agents/plugins`). Remote GitHub marketplace: NOT_RUN (nothing pushed). V-14: not implemented. | IMPLEMENTED |

## Step 03 design basis (design only, not verification)

| Row | Design element | Reference |
|---|---|---|
| REQ-01 | Native plugin-first. One canonical package plus metadata layer. Repo-as-marketplace. | ADR-0001, ADR-0006, ADR-0008 |
| REQ-02 / REQ-03 | Native description-based discovery. No router, hook, or command. | ADR-0002, C-04 |
| REQ-04 | Zero always-on content, an in-skill gate, and boundary clauses | ADR-0003, C-06 |
| REQ-05 | Catalog separated from ≤14 task-intent entry skills | ADR-0004, C-03 |
| REQ-06 | L0–L3 loading with budgets, ≤2 hops | C-07, ARCHITECTURE §8 |
| REQ-07 | Precedence order, plus "detect existing conventions first" in every pack | C-05, C-06 |
| REQ-08 | Workflows, task contract, evidence record, change passport | C-08..C-10 |
| REQ-09 | Advisory-only security, trust boundaries B-01..B-06, threat model | ADR-0007, C-11 |
| REQ-10 | Developer-only validators (V-01..V-15) plus eval and compatibility suites | C-12, C-13 |
| EX-01..EX-07 | Markdown and JSON only. No executable components. | ADR-0005, V-09 |

## Step 02 research basis (documentation only, not verification)

| Row | Finding that shapes implementation | Source IDs | Open items |
|---|---|---|---|
| REQ-01 | Native install is documented for: Claude Code (CLI, VS Code, desktop), Codex (CLI, app), Copilot (CLI, VS Code, cloud agent). **The Codex IDE extension has no plugin support.** | S5, S13, S15, S18 | Q-02, U-03, U-04 |
| REQ-02 / REQ-03 | Description-driven implicit skill invocation is documented on all providers. It is probabilistic. | S7, S12, S17, S19 | U-05 |
| REQ-04 | Skills load only on match. No always-on component is needed. | S7, S12, S19 | — |
| REQ-05 | Listing budgets (Claude Code 1%, Codex 2% or 8,000 characters) cap the practical number of skills. This supports D-006. | S7, S12 | R-11, U-06 |
| REQ-06 | Progressive disclosure (metadata, then body, then references) is native on every provider. | S7, S12, S19, S24 | — |
| REQ-10 | `claude plugin validate` and `claude plugin eval` exist. No equivalent tooling was found for Codex or Copilot. | S3, S8 | U-08, R-07 |
| PRV-CC | Native format is `.claude-plugin/plugin.json` (optional) plus `.claude-plugin/marketplace.json`. | S3, S4 | U-01, R-09 |
| PRV-CX | Native format is the Agent Plugins root `plugin.json`. The marketplace is `.agents/plugins/marketplace.json`, or the legacy-compatible `.claude-plugin/marketplace.json`. | S10 | U-02, U-03, Q-02 |
| PRV-GH | Agent Plugins root `plugin.json`, or the legacy `.claude-plugin/plugin.json`. The marketplace can be `.claude-plugin/marketplace.json`. | S15, S18 | U-04, U-05, U-09 |

## Capability domains

Per-capability status (206 records) is kept in
`catalog/engineering-capabilities.yaml`, and it is checked by V-11. The
per-capability index is in [CAPABILITY_COVERAGE.md §10](CAPABILITY_COVERAGE.md#10-generated-tables).

A domain row is `IN_PROGRESS` when at least one of its capabilities is
IN_PROGRESS. Otherwise it is `PLANNED`. A domain becomes `IMPLEMENTED` or
`VERIFIED` only when every capability in it has reached that status.

| ID | Domain | Step | Capabilities | Implementation evidence | Verification method | Verification evidence | Status |
|---|---|---|---|---|---|---|---|
| CAP-D01 | REPOSITORY | 07 (catalog); 09 (recipes) | 9 (all IMPLEMENTED) | chayen-repository SKILL.md + references/repository-profile.md, dependency-and-impact.md, history-and-ownership.md, technical-debt-inventory.md, unknowns-and-assumptions.md | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 09 T1–T3); 18 recipe cases defined; skills-ref valid; lifecycle 24/24 with 7 skills. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
| CAP-D02 | REQUIREMENTS | 07 (catalog); 09 (recipes) | 10 (all IMPLEMENTED) | chayen-requirements SKILL.md (new) + references/elicitation-and-modeling.md, stories-and-acceptance.md, scope-and-backlog.md, nonfunctional-requirements.md, requirement-traceability.md, requirements-record.md (template) | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 09 T1–T3); 20 recipe cases defined; skills-ref valid; lifecycle 24/24 with 7 skills. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
| CAP-D03 | ARCHITECTURE | 07 (catalog); 10 (recipes) | 10 (all IMPLEMENTED) | chayen-architecture SKILL.md (new) + references/architecture-review.md, decision-records.md, boundaries-and-domain.md, sequence-and-dataflow.md, multitenancy.md, resilience.md, architecture-styles.md (checklist) | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 10 T1–T3); 20 recipe cases; skills-ref valid; lifecycle 24/24 with 8 skills. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
| CAP-D04 | PLANNING | 07 (catalog); 10 (recipes) | 8 (all IMPLEMENTED) | chayen-implementation references/task-contract.md (risk classes, status) and change-summary.md; chayen-requirements references/scope-and-backlog.md (sizing); chayen-architecture references/migration-strategy.md, rollout-planning.md, decision-records.md (D-029) | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 10 T1–T3); 18 recipe cases (10 from Step 08, 8 new); lifecycle 24/24. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
| CAP-D05 | IMPLEMENTATION | 07 (catalog); 11 (recipes) | 12 (all IMPLEMENTED) | chayen-implementation SKILL.md (router) + references/feature-delivery.md, bug-fix.md, refactoring.md, algorithm-design.md, concurrency-safety.md, error-handling.md, upgrades.md (D-031), configuration-and-flags.md, contract-codegen.md, compatibility.md | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 11 T1–T3); 24 recipe cases; skills-ref valid; lifecycle 24/24. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
| CAP-D06 | BACKEND | 07 (catalog); 11 (recipes) | 10 (all IMPLEMENTED) | chayen-backend SKILL.md (stack detection first) + references/api-design.md, api-endpoints.md, authn-authz.md, messaging.md, background-jobs.md, external-integrations.md, idempotency-and-consistency.md, plus 4 stack technology references | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 11 T1–T3); 20 recipe cases (ASP.NET Core, Nitro/Nuxt, Elysia, FastAPI, Django prompts); skills-ref valid; lifecycle 24/24. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
| CAP-D07 | FRONTEND | 07 (catalog); 12 (recipes) | 10 (all IMPLEMENTED) | chayen-frontend SKILL.md (router, framework and shell detection first) + references/ui-features.md, component-architecture.md, layout-and-design-system.md, accessibility.md, frontend-performance.md, internationalization.md, frontend-error-handling.md, ui-states.md (checklist), plus 3 framework references | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 12 T1–T3); 25 recipe cases (Angular, React, Next.js, Vue, Nuxt prompts); skills-ref valid; lifecycle 24/24. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
| CAP-D08 | MOBILE-DESKTOP | 07 (catalog); 12 (recipes) | 8 (all IMPLEMENTED; scope D-032 PROPOSED, Q-11) | chayen-frontend SKILL.md + references/hybrid-mobile.md, device-permissions-and-push.md (CG-57), offline-and-mobile-performance.md, desktop-packaging.md, app-shells.md (technology: PWA, Capacitor/Ionic, Electron, Tauri) | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 12 T1–T3); 19 recipe cases (Capacitor, Ionic, PWA, Electron, Tauri prompts); skills-ref valid; lifecycle 24/24. Behaviour evals (G-12), trigger evals (G-11), and device runs: NOT_RUN | IMPLEMENTED |
| CAP-D09 | DATABASE-DATA | 07 (catalog); 13 (recipes) | 12 (all IMPLEMENTED) | chayen-data SKILL.md (new, D-033; engine detection and environment classification first) + references/data-modeling.md, schema-and-data-migration.md, query-performance.md, transactions.md, data-quality-and-integrity.md, etl-pipelines.md, retention-and-governance.md, backup-restore.md, plus sql-server.md, postgresql.md (technology) and database-safety.md (checklist) | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 13 T1–T3); 27 recipe cases (SQL Server, PostgreSQL, EF Core, Alembic, dbt prompts); skills-ref valid; lifecycle 24/24. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
| CAP-D10 | TESTING-QA | 07 (catalog); 13 (recipes) | 14 (all IMPLEMENTED) | chayen-testing SKILL.md (router, six-state result vocabulary, baseline first) + references/test-strategy.md, test-authoring.md, api-and-contract-tests.md, advanced-test-techniques.md, test-data.md, failing-and-flaky-tests.md, coverage-gaps.md, plus 3 stack testing references | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 13 T1–T3); 31 recipe cases (xUnit, pytest, Vitest, Playwright, Pact, Hypothesis, Stryker prompts); skills-ref valid; lifecycle 24/24. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
| CAP-D11 | SECURITY-PRIVACY | 07 (catalog); 14 (recipes) | 14 (all IMPLEMENTED; CAP-11-013 remapped, D-034) | chayen-security SKILL.md (router, advisory) + references/threat-modeling.md, secure-review.md, scanner-triage.md, secret-exposure-response.md, privacy.md, sbom-and-licenses.md, infrastructure-security-review.md, vulnerability-remediation.md, plus review-checklist.md and stack-hardening.md | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 14 T1–T3); 32 recipe cases (ASP.NET Core, Angular, Node, FastAPI, Terraform, CodeQL, npm audit prompts, plus a production pen-test request); skills-ref valid; lifecycle 24/24. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
| CAP-D12 | PERFORMANCE | 07 (catalog); 14 (recipes) | 10 (all IMPLEMENTED) | chayen-performance SKILL.md (new, D-034; MEASURED, ESTIMATED, HYPOTHESIS labels) + references/baseline-and-profiling.md, load-testing.md, memory-leaks.md, budgets-and-capacity.md, caching.md, runtime-tools.md (technology) | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 14 T1–T3); 23 recipe cases (.NET, k6, Redis, Azure cost prompts, plus an unapproved production load test and a static-inspection speed claim); skills-ref valid; lifecycle 24/24. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
| CAP-D13 | DEVOPS | 07 (catalog); 15 (recipes) | 12 (all IMPLEMENTED) | chayen-devops SKILL.md (new, D-035) + references/build-systems.md, pipelines.md, containers.md, infrastructure-as-code.md, environment-parity.md, secrets-management.md, releases-and-provenance.md, release-and-rollout.md, plus operations-safety.md (checklist) and tooling.md (technology) | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 15 T1–T3); 27 recipe cases (GitHub Actions, Azure Pipelines, Docker, Bicep, Terraform, NuGet, cosign prompts, plus apply-to-production and roll-back-now requests); skills-ref valid; lifecycle 24/24. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
| CAP-D14 | OPERATIONS-SRE | 07 (catalog); 15 (recipes) | 10 (all IMPLEMENTED) | chayen-devops SKILL.md + references/observability.md, alerting-and-incidents.md, rca-and-postmortems.md, disaster-recovery.md, runbooks.md | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 15 T1–T3); 21 recipe cases (OpenTelemetry, SLO, alerting, incident, postmortem, DR, runbook prompts, plus a restart-all-pods request); skills-ref valid; lifecycle 24/24. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
| CAP-D15 | MODERNIZATION | 07 (catalog); 16 (recipes) | 10 (all IMPLEMENTED) | chayen-repository legacy-assessment.md, technical-debt-prioritization.md; chayen-implementation refactoring.md (large refactor plan), upgrades.md (framework upgrades, breaking changes), dead-code-and-deprecation.md; chayen-architecture migration-strategy.md (strangler, modular monolith); chayen-devops hotfix.md (D-036) | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 16 T1–T3); 20 recipe cases; skills-ref valid; lifecycle 24/24. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
| CAP-D16 | DOCUMENTATION | 07 (catalog); 16 (recipes) | 10 (all IMPLEMENTED) | chayen-documentation SKILL.md (new, D-036) + references/project-docs.md, api-docs.md, architecture-docs.md, pull-requests-and-review.md, release-notes.md, git-workflow.md, fact-checking.md (checklist) | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 16 T1–T3); 22 recipe cases (including a request to claim tests pass and a shared-branch force-push); skills-ref valid; lifecycle 24/24. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
| CAP-D17 | AI-ML-LLM | 07 (catalog); 17 (recipes) | 10 (all IMPLEMENTED) | chayen-ai-engineering SKILL.md (new, D-037) + references/ml-data.md, ml-experiments-and-evaluation.md, model-serving.md, rag.md, llm-and-agent-evaluation.md, llm-safety.md, llm-observability.md, ai-tooling.md (technology) | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 17 T1–T3); 21 recipe cases (including a single-run prompt claim and a third-party jailbreak request); skills-ref valid; lifecycle 24/24. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
| CAP-D18 | GOVERNANCE | 07 (catalog); 17 (recipes) | 10 (all IMPLEMENTED) | documentation pull-requests-and-review.md (standards); implementation change-summary.md (passport, evidence audit); devops policy-as-code.md, release-and-rollout.md (go/no-go); security access-reviews.md, sbom-and-licenses.md (obligations); data retention-and-governance.md (governance); architecture decision-records.md (waivers); ai-engineering agent-governance.md (agent action risk) | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 17 T1–T3); 22 new recipe cases (24 for D18 in total), including requests to mark a release approved and to self-approve a waiver; skills-ref valid; lifecycle 24/24. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
| CAP-D19 | SPECIALIZED | 07 (catalog); 18 (recipes) | 9 (all IMPLEMENTED) | backend api-design.md (GraphQL), external-integrations.md (webhooks), idempotency-and-consistency.md (ledgers), file-processing.md; architecture realtime-systems.md, resilience.md (multi-region); data search-and-indexing.md, geospatial.md; frontend browser-extensions.md (D-038) | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 18 T1–T3); 18 recipe cases; skills-ref valid; lifecycle 24/24. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
| CAP-D20 | AGENT-ENGINEERING | 07 (catalog); 18 (recipes) | 8 (all IMPLEMENTED) | chayen-ai-engineering agent-skills.md, llm-and-agent-evaluation.md (skill testing, benchmarking), provider-compatibility.md, agent-governance.md (instruction conflicts), session-handoff.md (D-038) | Per-capability verification in the catalog (trigger + behaviour eval) | V-11/V-18/V-19/V-22 PASS (Step 18 T1–T3); 17 recipe cases (including an untrusted third-party skill review); skills-ref valid; lifecycle 24/24. Behaviour evals (G-12) and trigger evals (G-11): NOT_RUN | IMPLEMENTED |
