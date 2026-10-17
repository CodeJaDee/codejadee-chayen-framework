# Multilingual Humanizer — Architecture Impact (Step 35)

- **Date:** 2026-10-17
- **Scope:** governance and proposals only; D-047 records approved product scope.
- **Preferred initial architecture:** Native Plugin + Opt-in Host Persistent Instructions.
- **Architecture approval:** ADR-0009, ADR-0010 and ADR-0011 are PROPOSED.

**Owner follow-up (D-051, 2026-10-17):** maximum Entry Skills is now **25**,
ACCEPTED and implemented in V-07/V-11.3. This resolves the count conflict
below; actual count stays 13 and product target stays 15. The original
Step 35 evidence is historical. L0 remains 5,500 and other proposals remain
pending; count capacity alone does not resolve metadata or registry constraints.

**Subsequent L0 follow-up (D-052):** the owner authorized resolving the remaining
metadata blocker. L0 ≤6,500 is now ACCEPTED and implemented; current 5,485
leaves 1,015 characters. The count is capped at 25 and target remains 15.
Editorial registry/policy/quality proposals remain pending. Earlier baseline
figures describe the original inspection, not the current budget.

## Inspected baseline

**Step 36 resolution (D-053):** the owner explicitly instructed proceeding
after the registry approval blocker was reported. Separate editorial registry
and CA-01/V-19 amendments are now accepted/implemented. Current maximum is 15,
replacing the earlier 25 under the latest step request. Actual L0 stays 5,485;
projected metadata is 5,940 / 6,500. Remaining policy/human-quality decisions
are outside this registration approval. See
[SKILL_REGISTRATION.md](SKILL_REGISTRATION.md). Earlier inspection/approval
statements below retain their historical Step 35 meaning.

The starting working tree was clean on `main`, commit `1106226`. Both plugin
manifests identify `codejadee-chayen-framework`, version `0.1.0-dev`; the three
native marketplaces point to `plugins/codejadee-chayen-framework/`. The package
contains 13 Entry Skills, 221 references and 238 files. Its L0 metadata is
5,485 characters against a 5,500-character cap. The developer catalogs contain
206 Engineering Capabilities / 20 domains, 108 Technology Capabilities and
12 composite workflows / seven template formats. Existing verification gaps
and the Step 34 release recommendation remain in force.

The charter, build contract, architecture, decisions, implementation plan,
acceptance matrix, progress history, authoring standard, quality gates,
ADR-0002 through ADR-0007, ADR index, manifests, skill directory inventory and
validator sources were inspected before edits. ADR files/index contained only
0001–0008; a repository search found no existing 0009–0011 records before use.

## Three different mechanisms

| Mode | Meaning | Scope and evidence |
|---|---|---|
| A — Native Skill discovery | A host may select the Thai or English editorial skill from an ordinary writing request, then load relevant references. | Planned; probabilistic, relevance-based. No explicit Humanizer invocation required. No persistent policy is implied. |
| B — Opt-in persistent response guidance | A user separately enables a style policy through a verified host-native instruction mechanism, covering normal prose even when no editorial skill matches. | Preferred proposal; host/surface loading, scope, precedence, limits, disable and rollback all require verification. Advisory, potentially per-turn context cost. |
| C — Strict install-only guaranteed always-on | Installing the plugin alone guarantees the policy on every response, surface and session. | **UNVERIFIED / NOT SUPPORTED by available evidence.** Neither A nor B establishes C. This step makes no such product claim. |

The proposed policy only guides language, clarity and tone of prose. It does
not automatically audit or rewrite every answer, load Humanizer bodies,
change repository files, translate code, route engineering tasks or grant
permissions. A user declining B retains the native-plugin-only baseline.

## Conflict and change analysis

| Existing constraint | Impact | Proposed resolution and approval boundary |
|---|---|---|
| ADR-0002 native discovery; no always-on instruction file | A fits; B is an exception to the existing prohibition even though discovery remains native. | ADR-0010 must explicitly amend that boundary for user-enabled host instructions only; no hidden router or automatic Skill invocation. Until accepted, existing rule remains. |
| REQ-04 / ADR-0003 no-match fallback | B intentionally changes prose style on no-match responses. Claiming identical native output in that mode would be false. | Keep REQ-04 unchanged for plugin-only/disabled mode; propose an explicit opt-in style-only exception, preserving native task behavior. Test no-match independently in both modes. |
| D-007 / ADR-0003 zero always-on content | Persistent host instructions add content beyond L0 and survive independently of plugin discovery. | Separate optional user-owned host instructions from the static plugin; record this as a proposed exception, not compliance by relocation. Record measured policy size separately from L0. |
| ADR-0004 / V-07 Entry Skill ceiling | Original ≤14 conflicted with target 15. | RESOLVED for count by D-051: owner approved ≤25, implemented in V-07/V-11.3. Actual count 13, target 15. L0 and registry still gate future additions. |
| L0 metadata budget | Original D-037 budget 5,500 left only 15 characters. | RESOLVED for internal budget by D-052: L0 ≤6,500, current usage 5,485, headroom 1,015. Descriptions unchanged; actual host behavior still requires measurement. |
| CA-01 / V-19 / V-11.3 every Entry Skill is in engineering catalog and owns a capability | Editorial skills cannot satisfy this without expanding or reassigning the approved 206 inventory. | Propose a separate developer-side editorial registry and validation of the union of engineering/editorial names, disjoint ownership and total count. Never dummy CAP records or a generic exemption. |
| ADR-0005 zero runtime / no installer | A and separately user-enabled static instructions can preserve zero runtime. | No hooks, scripts, executable installers, MCP/LSP servers, dependencies or new runtime; B is not installed in Step 35. |
| ADR-0006 provider content only differs in metadata | Host-native instruction integration would add provider-specific guidance beyond metadata. | ADR-0010 proposes a narrow exception for documented host integration outside shared Skill content. One provider-neutral policy source; no per-provider Skill forks. |
| D-003 / BC-23 / ADR-0007 advisory guidance | Style, fidelity and security cannot be guaranteed by Markdown. | ADR-0011 retains native permissions and higher-priority rules; quality checks provide evidence, not enforcement or authorization. |
| Documentation / frontend / implementation ownership | Website copy editing can overlap technical docs and UI/code changes. | Editorial skills own wording only; technical correctness stays with existing engineering owners. Website request scope and native permissions govern file edits; publishing needs its own authorization. |

## Proposed budget and registry design

V-07 measures the JavaScript string length of each name plus description,
excluding host formatting. At the existing ≤420-character description target,
two 19-character names add at most 878: 5,485 + 878 = 6,363. The D-052-approved 6,500
ceiling leaves 137 characters at that estimate. Step 36 corrects the original
18-character name assumption; its actual planned descriptions project 5,940.
This is arithmetic, not a
provider capacity claim; Thai token cost is not estimated with English
characters-per-token assumptions. Alternatives are compressing descriptions
within 5,500 with routing regression evidence, or revising the budget after
measurement. Description changes need DS-09 evidence, including no-plugin
comparisons and at least three runs before claiming routing improvement.

Later tooling would validate engineering mappings unchanged and separately
validate exactly the two approved editorial names, scopes and evidence IDs.
V-07, V-19, V-20 vocabulary, V-11.3, CA-01 and documentation skill inventories
need coordinated review. Existing anatomy, relative links, progressive loading,
body limits, safety guards and no-catch-all rules still apply. No registry,
validator bypass, description edit or catalog change is implemented here.

## Compatibility evidence boundary

Compatibility with Claude Code, OpenAI Codex and GitHub Copilot is a product
requirement, not a new verified finding. This analysis relies on the repository's
historical reports, including [FINAL_PROVIDER_COMPATIBILITY.md](FINAL_PROVIDER_COMPATIBILITY.md)
and [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md); it does not re-certify them
against current provider versions. R-53/R-55 and unsupported surfaces remain
unresolved. Any candidate host instruction file names are **UNVERIFIED for
this policy and each target surface** until the later host research step
records official sources, access dates and actual loading/lifecycle evidence.

Uninstalling or disabling a plugin must not be assumed to remove separately
enabled instructions. The later opt-in flow needs exact scope, reviewed diff,
existing-content preservation, a record of owned content and explicit removal
instructions. Never edit user-level agent configuration as a side effect.

## Verification and review handoff

The original Step 35 used only read-only structural/documentation checks after source review;
commands and actual results are recorded in [PROGRESS.md](PROGRESS.md).
Product behavior, human language review, native lifecycle and paid evaluations
are NOT_RUN. [HUMANIZER_REQUIREMENTS.md](HUMANIZER_REQUIREMENTS.md) defines
MHR-001–MHR-012 and future acceptance methods, all PLANNED.

The explicitly authorized D-051 follow-up changes the two count validators
and runs local regression/boundary checks, including scratch-only mutations;
its evidence is recorded separately in PROGRESS.md. It does not start Step 36.

Owner approval of the count is recorded in D-051 (≤25). Remaining review must
resolve ADR-0009's registry model (L0 now approved by D-052), ADR-0010's
no-match/always-on/portability exceptions and host evidence criteria, and
ADR-0011's quality thresholds. Approved product scope alone does not approve
these mechanisms. STOP after Step 35; Step 36 needs a separate instruction.
