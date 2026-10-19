# Skill Registration — Step 36

- **Architecture approval:** D-053 ACCEPTED from the owner's instruction to
  proceed after the missing registry approval was identified.
- **Current limits (D-062):** maximum 16 Entry Skills; L0 ≤7,000. 16 Skills
  ship (13 engineering, 2 editorial, 1 project); actual L0 6,563.
- **Limits at Step 36:** maximum 15 Entry Skills (latest Step 36 requirement, superseding
  D-051's 25); L0 ≤6,500 (D-052). Shared constants live in the developer-only
  `tools/catalog/skill-registration.mjs`.
- **Shipment at Step 36:** 13 engineering Skills, no editorial Skill bodies.
- **Step 37 transition (D-054):** `chayen-humanizer-th` now ships and is
  registered `existing`, with its description widened (211 → 354 characters)
  identically in SKILL.md and the registry. `chayen-humanizer-en` stays
  `planned`. 14 shipped Skills; actual L0 5,858, projected 6,083 / 6,500.
  Planned-state negative controls now target the English record. Historical
  Step 36 figures below are kept as recorded.
- **Step 38 transition (D-055):** `chayen-humanizer-en` now ships and is
  registered `existing`; its description grew from the planned 206 to 344
  characters, identical in SKILL.md and the registry. Both editorial records are
  `existing`; 15 Skills ship (13 engineering + 2 editorial), which is the
  ceiling. Actual L0 6,221 / 6,500 with no planned record left. Planned-state
  negative controls now mutate the temporary copy (marking the English record
  planned, or deleting its directory) because neither editorial Skill is
  planned any more.

## Registration model

| Category | Canonical registration | Ownership and mapping |
|---|---|---|
| Engineering | `catalog/engineering-capabilities.yaml` | Unchanged 206 capabilities / 20 domains and 13 Entry Skills. Existing mappings, recipes, status and inventory checks continue. |
| Project (D-062) | `catalog/project-skills.json` | Exactly `chayen-init` with `name`, `mapping` and `description` only. No Engineering Capability IDs, recipes or secondary mappings. Same planned/existing parity and description-match rules as editorial records. Counts toward the combined ceiling. |
| Editorial | `catalog/editorial-skills.json` | Exactly `chayen-humanizer-th` (th) and `chayen-humanizer-en` (en), both `mapping: planned` now. No Engineering Capability IDs or fabricated recipes. |

The editorial JSON contains only `version: 1` and `skills`. Each record has
exactly `name`, `language`, `mapping` and `description`. No hooks, scripts,
provider configuration, executable fields or external file paths. Names and
languages are an exact allow-list; names are unique within and across the two
registries. The combined registered count must fit the ceiling, including
planned entries. Registry and descendant paths are confined and reject links.

`planned` requires no shipped directory. `existing` requires a real SKILL.md
and an exact description match with the registry. Later steps must update the
mapping together with the real Skill, trigger inventory and cases. Existing
portable frontmatter, anatomy, reference, safety, trigger and size checks apply
to every shipped Skill. No placeholder body or weakened quality exception is
introduced. The registry is developer-side only; the plugin does not read it
and gets no runtime or dependency.

## Validator responsibilities

| Check | Extension |
|---|---|
| V-07 | Count ≤16 (≤15 before D-062); portable descriptions; measure actual shipped L0 separately from projected registered metadata, including unshipped editorial descriptions. Both must fit 6,500. |
| V-07b / V-20 | Apply distinctness/breadth checks to all shipped and planned metadata. Add editorial artifact vocabulary, retain existing thresholds and no-catch-all/boundary rules. |
| V-19 / CA-01 | Each shipped Skill must belong to exactly one registry with matching existing status. Engineering recipes still match the original catalog. Editorial names cannot become engineering owners or secondary mappings; editorial references cannot declare engineering capability recipes. |
| V-11.3 | Reuse the same registry rules and count cap; allow a shipped editorial directory only through its editorial registration. Engineering coverage and inventory fingerprints remain unchanged. |
| V-05/06/08/09/10/16/17/18/22 | Existing portable metadata, size, reference, static package, advisory wording, trigger, anatomy and recipe contracts remain in force. No editorial bypass. |
| V-25 | Read the registry through confined paths, scan secret patterns and validate its closed metadata schema. Native permissions and advisory limitations remain unchanged. |

## Metadata calculation and efficiency

| Surface | Characters |
|---|---|
| 13 shipped engineering names/descriptions (unchanged) | 5,485 |
| Two planned editorial names/descriptions | 455 |
| Projected 15-Skill discovery metadata | **5,940 / 6,500** |
| Projected remaining budget | **560** |
| Conservative estimate with both descriptions at the 420 target | 6,363 / 6,500 |

Actual registry descriptions are 211 (Thai) and 206 (English) characters;
each approved name is 19 characters. Thus 5,485 + 19 + 211 + 19 + 206 = 5,940.
The original Step 35 conservative estimate counted each name as 18; the
corrected upper estimate is 5,485 + 2 × (19 + 420) = 6,363, leaving 137.
This arithmetic correction does not change the approved 6,500 budget.

The compact descriptions describe separate Thai and English editorial tasks
and exclude neighboring work. They are planned discovery metadata, not
Humanizer instructions/content or proof of native activation. V-07b's maximum
overlap across the proposed surface remains 0.11. Existing descriptions were
not shortened or rewritten, preserving the baseline needed for later native
routing comparisons. No budget increase is necessary. This internal character
budget is not a provider-wide hard limit or a Thai/English tokenization result.

## Verification and negative controls

`tests/catalog/editorial-mutations.json` is included in the existing validator
self-test runner. It covers unregistered editorial names, duplicate registry
and shipped names, invalid language/description metadata, missing references,
16 shipped Skills, excessive projected metadata, broken engineering ownership
and recipe mappings, missing existing files, premature planned directories,
runtime fields, unsafe names, duplicate descriptions, missing registry,
shipped/registry metadata drift, trigger cases naming a planned (unshipped)
Editorial Skill (V-16) and a combined registered count above 15 while only 13
directories ship. Invalid Skill copies exist only in temporary
test repositories; none are shipped or left in the workspace.

The runner supports an optional expected message fragment, so a registry
failure cannot masquerade as the intended count, metadata or ownership failure.
Actual commands/results are recorded in PROGRESS.md. Static results do not
establish provider routing, multilingual quality, host persistence or safety
enforcement. All new editorial behavior and lifecycle checks remain NOT_RUN.

Step 36 ends with 13 shipped Skills. Step 37 requires a separate instruction.
