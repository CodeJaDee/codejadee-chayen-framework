# Decisions

Decision statuses:

- `ACCEPTED`: set by the user's requirements, or approved by the user
- `PROPOSED`: the agent's recommendation, awaiting user review
- `SUPERSEDED`: replaced by a later decision
- `REJECTED`: considered and not adopted

## Decision records

### D-001 — Governance documents live in `docs/chayen/`
- **Status:** ACCEPTED (user-specified)
- **Context:** Step 01 requires seven governance documents at fixed paths.
- **Decision:** All governance and planning documents live in `docs/chayen/`.
- **Consequences:** None of these files are shipped as plugin content. Step 04
  will define the packaging boundary.

### D-002 — Native plugin delivery only; no custom tooling
- **Status:** ACCEPTED (user-specified)
- **Decision:** Distribution happens only through each provider's native plugin
  or marketplace mechanism. There is no CLI, installer, web app, VS Code
  extension, runtime, daemon, or mandatory MCP server (EX-01..EX-07).
- **Consequences:** Plugin content is static: skills, references, and
  manifests. If a provider has no native plugin mechanism, the fallback must
  be decided separately (Q-02) and may not introduce excluded tooling.

### D-003 — Markdown guidance is advisory, never described as enforcement
- **Status:** ACCEPTED (user-specified)
- **Decision:** Security and quality skills use advisory language. Where real
  enforcement is needed, skills point to provider-native controls
  (permissions, hooks, sandboxing) or CI tooling, and say plainly that the
  skill itself enforces nothing.
- **Consequences:** The Step 05 validator will flag enforcement-claim wording
  in skill content.

### D-004 — Zero runtime dependencies for the shipped plugin
- **Status:** PROPOSED
- **Decision:** The shipped plugin contains no executable runtime dependency.
  Validation and test tooling are development-only, and each piece needs its
  own decision record (BC-22).
- **Open point:** The validator language (for example Node.js/TypeScript,
  Python, or PowerShell) will be decided in Step 05.

### D-005 — Single provider-neutral skill source, packaged per provider
- **Status:** PROPOSED (depends on Step 02 verification of A-01 and A-02)
- **Decision:** Write each skill once in the shared Agent Skills `SKILL.md`
  format (YAML frontmatter `name` and `description`, a markdown body, and
  optional reference files). Add a thin per-provider manifest layer.
- **Rationale:** This avoids content drift between three copies and keeps
  regression testing tractable.
- **Rejected alternative:** Three separately maintained skill trees.

### D-006 — Capabilities are not one-to-one with skills
- **Status:** PROPOSED (to be finalised in Steps 03–04)
- **Context:** Every installed skill's metadata (its description) is visible
  to the model in every session. With 206 separate skills, the metadata would
  consume context and blur routing precision.
- **Decision:** Treat the 206 capabilities as catalog entries. Group them into
  fewer, well-scoped skills (roughly by domain × stack), and hold the
  capability-level detail in reference files that load on demand. This is the
  progressive loading model (REQ-06).
- **Consequences:** Each catalog entry must map to exactly one skill plus a
  reference section. The validator checks that coverage.

### D-007 — No always-on context injection
- **Status:** PROPOSED
- **Decision:** No global system-prompt overrides, and no session-start hooks
  that inject guidance unconditionally. Skills activate only on relevance.
- **Rationale:** This directly supports REQ-04 (native behaviour when no
  skill applies).

### D-008 — Detect before prescribe
- **Status:** PROPOSED
- **Decision:** Every stack skill begins by checking the host repository's
  existing patterns (structure, naming, frameworks, test style). Generic
  recommendations apply only where the repository has no established
  convention (REQ-07).

### D-009 — Dual-manifest portable plugin format
- **Status:** PROPOSED (Step 02). Full record:
  [PLUGIN_FORMAT_DECISION.md](PLUGIN_FORMAT_DECISION.md)
- **Decision:** Ship one plugin directory containing:
  - an Agent Plugins 1.0 root `plugin.json` (for Codex, Copilot CLI, and VS Code)
  - a `.claude-plugin/plugin.json` (for Claude Code)
  - a shared `skills/` tree

  Publish it through a single `.claude-plugin/marketplace.json`. If U-01 fails,
  fall back to the Claude-format manifest only.
- **Refines:** D-005.
- **Process note:** The user's Step 02 prompt replaced the planned single
  output `PROVIDER_MATRIX.md` with three documents:
  `PROVIDER_SPEC_RESEARCH.md`, `PROVIDER_COMPATIBILITY_MATRIX.md`, and
  `PLUGIN_FORMAT_DECISION.md`.

### D-010 — Re-plan: Step 03 is the architecture design
- **Status:** ACCEPTED (user-specified in the Step 03 prompt)
- **Decision:**
  - Step 03 became the architecture design.
  - The capability catalog moves to Step 04, together with the authoring
    guide.
  - The design items originally planned for Step 04 were delivered in Step 03.
  - Steps 05 onwards are unchanged.

### D-011 — ADRs are the canonical form for architecture decisions
- **Status:** PROPOSED
- **Decision:**
  - Architecture decisions are recorded as ADRs in [ADRS/](ADRS/README.md).
  - This log keeps short D-entries for governance and process decisions, and
    links to ADRs.
  - D-005, D-006, D-007, and D-009 are refined by ADR-0006, ADR-0004,
    ADR-0003, and ADR-0008 respectively. They are not superseded until those
    ADRs are ACCEPTED.

### D-012 — Re-plan: Step 04 is the minimal native plugin package
- **Status:** ACCEPTED (user-specified in the Step 04 prompt)
- **Decision:**
  - Step 04 implemented the minimal plugin package, its manifests, and the
    per-provider marketplace files.
  - The capability catalog and authoring guide, previously planned for
    Step 04, are now unscheduled. They will be scheduled when the user directs.
  - Steps 06–08 now cover **remote** marketplace installs and skill-load
    verification. The manifests already exist.

### D-013 — One native marketplace file per provider
- **Status:** ACCEPTED (user requirement: "Do not assume a marketplace file
  from one provider is valid for another provider")
- **Decision:** Ship three marketplace files over the same single plugin
  directory:

  | Provider | File |
  |---|---|
  | Claude Code | `.claude-plugin/marketplace.json` |
  | GitHub Copilot | `.github/plugin/marketplace.json` |
  | OpenAI Codex | `.agents/plugins/marketplace.json` |

- **Amends:**
  - PLUGIN_FORMAT_DECISION K-03: the Codex file is no longer conditional.
  - PLUGIN_PACKAGE_DESIGN RH-02: `.github/plugin/` and `.agents/plugins/` are
    now permitted.
- **Validator V-01** checks that all three are consistent.

### D-014 — Plugin identity
- **Status:** ACCEPTED for the plugin identifier, which the user specified.
  The marketplace name is PROPOSED.
- **Decision:**
  - Plugin `name` is `codejadee-chayen-framework` in both manifests and all
    three marketplace entries.
  - Version is `0.1.0-dev`.
  - Marketplace name is `codejadee` (working name, Q-03).
  - No `license` field is set until Q-05 is answered.
- **Note:** This replaces the Step 03 working name `codejadee-chayen`. Names
  in ARCHITECTURE.md and PLUGIN_PACKAGE_DESIGN.md are annotated, not
  rewritten.

### D-015 — Pilot entry-skill set
- **Status:** ACCEPTED (user-specified in the Step 05 prompt)
- **Decision:** The first six entry skills are:
  - `chayen-repository`
  - `chayen-implementation`
  - `chayen-backend`
  - `chayen-frontend`
  - `chayen-testing`
  - `chayen-security`
- **Context:** This replaces the provisional C-04 list in ARCHITECTURE.md.
  - The set mixes task intent (repository, implementation, testing,
    security) with layer scope (backend, frontend).
  - ADR-0004's ≤14 budget and revisit trigger still apply.
- **Partly answers Q-10.**

### D-016 — Skill-local references for the pilot
- **Status:** PROPOSED
- **Decision:** Pilot skills keep their reference files in
  `skills/<skill>/references/`, linked one level from `SKILL.md`. No shared
  `knowledge/` directory is used yet.
- **Rationale:**
  - Skill-local files are the documented Agent Skills layout (S24).
  - Links outside the skill directory (U-11) and unknown top-level plugin
    directories (U-13) remain unverified on Codex and Copilot.
- **Trade-off:** Some stack guidance is split by skill. For example, the
  ASP.NET Core security notes sit in `chayen-security`, and the API notes sit
  in `chayen-backend`.
- **Revisit:** reconsider shared packs once U-11 and U-13 are tested. V-08
  enforces the rule for now.

### D-017 — Description length and YAML safety
- **Status:** PROPOSED
- **Decision:**
  - The per-description target is ≤420 characters (warning). The hard limit
    stays at 1024.
  - The total L0 limit (≤4,000 characters for all entry skills) stays the
    binding rule.
  - Descriptions must be YAML-safe plain scalars: no `": "`, no `" #"`, and
    no leading indicator character.
  - Every description must contain a "Not for …" (or "Not a …") boundary
    clause.
- **Rationale:**
  - Longer descriptions with explicit stacks and boundaries improve
    distinctness. The six pilot descriptions total 2,292 of 4,000
    characters.
  - The `skills-ref` validator rejects `": "` in an unquoted description, as
    the Step 05 negative control showed.
- **Amends:** ARCHITECTURE C-04, and the ≤280 target in
  PLUGIN_PACKAGE_DESIGN SK-03.

### D-018 — Staged Claude evals
- **Status:** ACCEPTED (forced by provider behaviour, Step 06)
- **Context:** `claude plugin eval` refuses plugins outside its containment
  root. U-12 was resolved negatively. Shipping `evals/` in the plugin is
  forbidden by V-09.
- **Decision:**
  - The committed cases in `tests/evals/claude/` carry no `plugins:` field.
  - Runs use `generate-claude-evals.mjs --stage <dir>`, which builds a
    throwaway plugin copy with `evals/`.
  - The eval turn cap is 8.

### D-019 — Frontend description names native and game UI exclusions
- **Status:** ACCEPTED (Step 06 fix)
- **Decision:** The `chayen-frontend` description now says "browser UI … Not
  for … native or game UI such as SwiftUI, Android, Flutter, WPF, or Unity".
- **Effect:**
  - Claude Code: 4/4 frontend positives, and Unity/SwiftUI silent.
  - Copilot: still over-activates (POC_REPORT §4).
- **Also:** a similar edit to `chayen-implementation` was tried and
  **reverted** (no measured benefit).

### D-020 — Provider-specific test procedures
- **Status:** ACCEPTED (Step 06)
- **Decision:**
  - **Lifecycle tests** run only in isolated config homes
    (`run-lifecycle.sh`).
  - **Copilot routing** uses an isolated home with copied login metadata
    (no tokens), with inherited skills disabled only there.
  - **Codex routing** installs into the real `CODEX_HOME`, because
    authentication is not portable, and personal skills are disabled per
    run with `-c`. The plugin is removed afterwards, and the config hash is
    verified.
  - Never copy `auth.json`, and never put classic PATs into Copilot.

### D-021 — Capability catalog format: one restricted-YAML file
- **Status:** ACCEPTED (user-specified in the Step 07 prompt)
- **Decision:**
  - The canonical catalog is `catalog/engineering-capabilities.yaml`.
  - It replaces the JSON layout in ARCHITECTURE C-03 (`schema/`,
    `domains.json`, `capabilities/*.json`).
  - The file uses a restricted YAML subset: two-space indentation, quoted
    strings or plain tokens, flow lists and maps of plain tokens only, and
    no anchors or block scalars.
  - The zero-dependency checker `tools/catalog/check-catalog.mjs` parses it
    (BC-22: no new dependency).
- **Evidence:** Step 07 test T3. PyYAML 6.0.3, in a throwaway venv, produced
  data identical to the checker's parser.

### D-022 — Capability IDs and status rules
- **Status:** PROPOSED
- **Decision:**
  - **IDs:** `CAP-<DD>-<NNN>`, where DD is the domain number (01..20) and
    NNN is the position in the user's inventory. Names are verbatim.
  - **Status vocabulary:** BUILD_CONTRACT §5.1.
  - **IN_PROGRESS:** only when the mapped entry skill already ships content
    for the capability's core purpose (`existing_coverage`).
  - **IMPLEMENTED:** needs an existing recipe and `verification_evidence`.
  - **VERIFIED:** needs a recorded passing verification.
  - `COMPLETED` is not a status. A catalog entry never changes a status by
    itself. The checker enforces all of these rules.
- **Result in Step 07:** 31 IN_PROGRESS, 175 PLANNED, 0 IMPLEMENTED,
  0 VERIFIED.

### D-023 — Proposed entry-skill mapping (14 skills)
- **Status:** PROPOSED. It decides Q-10 once approved.
- **Decision:**
  - Every capability maps to exactly one entry skill: the 6 existing pilots
    plus 8 planned skills (`chayen-requirements`, `chayen-architecture`,
    `chayen-data`, `chayen-performance`, `chayen-devops`,
    `chayen-modernization`, `chayen-documentation`,
    `chayen-ai-engineering`).
  - Domains D04, D18, and D19 are distributed by artifact
    (CAPABILITY_COVERAGE §5.1).
  - D08 maps to `chayen-frontend`, limited to web-technology shells (Q-11).
- **Conflict:** 14 skills do not fit the 4,000-character L0 budget at the
  pilot description length (R-27, CAPABILITY_COVERAGE §5.2).
  - Recommendation: keep the cap.
  - Add skills one at a time, measuring each time.
  - Merge when the cap would be exceeded.

### D-024 — Overlap consolidation model
- **Status:** PROPOSED
- **Decision:**
  - **Same work on the same artifacts, same entry skill:** a consolidation
    group (`CG-nn`) shares one recipe file. Every member keeps its own ID,
    triggers, outputs, and status.
  - **Related work in different recipes or skills:** a symmetric `overlaps`
    link, resolved by hand-off (negative triggers and "When not to use"
    tables).
  - No cross-skill shared recipes while D-016 holds (U-11/U-13).
- **Result:** 56 groups covering 148 capabilities, and 61 overlap pairs.
  No capability identity was merged or dropped.

## Architecture assumptions (checked in Step 02)

These began as working assumptions based on the agent's prior knowledge
(BC-15). Step 02 (2026-10-14) checked them against official documentation.
Sources S1–S24 are in [PROVIDER_SPEC_RESEARCH.md](PROVIDER_SPEC_RESEARCH.md).
Confirmation from documentation is not runtime verification. Install tests
in Steps 06–08 remain required.

| ID | Assumption | Step 02 result |
|---|---|---|
| A-01 | Claude Code supports plugins defined by `.claude-plugin/plugin.json`, Git-hosted marketplaces defined by `.claude-plugin/marketplace.json`, and installation through `/plugin marketplace add` and `/plugin install`. Plugins can bundle skills under `skills/<name>/SKILL.md`. | **CONFIRMED by docs** (S2–S5). Correction: the manifest is optional (S3). |
| A-02 | OpenAI Codex supports Agent Skills (`SKILL.md`) and has a native plugin or marketplace mechanism. The manifest format and install commands are unknown. | **CONFIRMED by docs** (S10–S13). The format is an Agent Plugins root `plugin.json`. **The Codex IDE extension does not support plugins** (S13). |
| A-03 | GitHub Copilot (CLI and/or VS Code agent mode) supports Agent Skills and a plugin/marketplace mechanism. Coverage across Copilot surfaces may differ. | **CONFIRMED by docs** for the Copilot CLI, cloud agent, and VS Code (S14–S19). |
| A-04 | All three providers use progressive disclosure: metadata is always loaded, the body loads on match, and references load on read. | **CONFIRMED by docs** (S7, S12, S19, S24). |
| A-05 | Skill activation is model-driven and therefore probabilistic. Trigger reliability can be measured but not guaranteed. | **CONFIRMED by docs.** VS Code explicitly "does not guarantee" invocation (S19). |
| A-06 | One repository can host the shared skill source and every provider's manifests without the manifests conflicting. | **PARTIALLY CONFIRMED.** Copilot gives the root manifest precedence (S15). Claude Code's tolerance of a root `plugin.json` is UNVERIFIED (U-01). |
