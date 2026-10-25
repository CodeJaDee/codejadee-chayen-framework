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
- **Amended by D-059 (2026-10-17):** the plugin identifier is now `chayen`; the repository name and the directory `plugins/codejadee-chayen-framework/` are unchanged.
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

### D-025 — Skill authoring standard and quality gates
- **Status:** PROPOSED (designed in Step 08 at the user's request)
- **Decision:**
  - Entry skills follow
    [SKILL_AUTHORING_STANDARD.md](SKILL_AUTHORING_STANDARD.md):
    - portable frontmatter (`name`, `description`, optionally `license` and
      `metadata`);
    - a `**Scope:**` gate line;
    - ten ordered sections, including "Preconditions and inputs" and
      "Safety boundaries";
    - a `Reference | Load when` table.
  - Reference files declare `kind: recipe | technology | checklist |
    template` in a small frontmatter block. Recipes add `capabilities`.
  - Recipe evaluation cases live developer-side in
    `tests/skills/recipe-cases.json`, not in the shipped recipe.
  - Gates G-01..G-15 are in
    [SKILL_QUALITY_GATES.md](SKILL_QUALITY_GATES.md). The automated gates
    run from the repository through `tools/validate/validate-all.mjs`.
    That script is not a user CLI.
- **Rationale:**
  - Only fields and layouts documented by all providers are used
    (PROVIDER_SPEC_RESEARCH §5).
  - Frontmatter in reference files is plain text to providers; no provider
    parses reference files. This was confirmed in Step 08:
    `claude plugin validate --strict` passed, `skills-ref` reported 6/6
    valid, and the lifecycle test passed 24/24.
  - Keeping evaluation data out of the plugin follows D-018.
- **Amends:** the V-17 section list from Step 05.

### D-026 — Recipes are reference files, never SKILL.md
- **Status:** PROPOSED
- **Decision:**
  - A catalog `recipe.path` must be `skills/<skill>/references/<name>.md`.
  - Six consolidation groups (CG-01, CG-15, CG-21, CG-25, CG-33, CG-37) and
    CAP-11-014 pointed at a pilot `SKILL.md`, `review-checklist.md`, or
    `stack-hardening.md`. They now point at planned recipe files:
    `repository-profile.md`, `feature-delivery.md`, `api-endpoints.md`,
    `ui-features.md`, `test-authoring.md`, `secure-review.md`, and
    `vulnerability-remediation.md`.
  - The affected 21 capabilities stay IN_PROGRESS through
    `existing_coverage`.
  - `task-contract.md` (CG-11) and `change-summary.md` (CG-14) were
    converted to the recipe anatomy. They are the only existing recipe
    files.
- **Rationale:**
  - Entry skills must stay concise (user Step 08 requirement), so detailed
    capability procedures belong in references.
  - A `SKILL.md` cannot carry a recipe's anatomy without bloating L1.
- **Effect:** recipe files are now 2 existing and 112 planned (114 in
  total). Capability statuses are unchanged: 31 IN_PROGRESS and 175
  PLANNED.

### D-027 — Domains 01 and 02: extend the repository skill, add the requirements skill
- **Status:** PROPOSED (executed in Step 09 at the user's request)
- **Decision:**
  - **D01 stays in the existing `chayen-repository`.** The user asked to
    improve and reuse the pilots rather than duplicate them.
    - The skill becomes a router over five recipes.
    - Its description and scope line now cover dependencies, change impact,
      history, ownership, debt, and unknowns.
    - The "git history forensics" exclusion is replaced by an exclusion of
      git operations that change state.
  - **D02 gets the entry skill the catalog planned, `chayen-requirements`**
    (D-023). No pilot covers requirements work.
    - Its shared output is the requirements record (template), which
      separates confirmed facts, assumptions, open decisions, and acceptance
      criteria.
  - Evidence labels `found`, `inferred`, and `unknown` apply to every
    repository finding. Ownership is only "declared" (from `CODEOWNERS`) or
    "activity" (from git), and is never inferred as ownership.
- **Consequences:**
  - There are 7 entry skills. L0 is 2,787 / 4,000, which sharpens R-27.
  - Q-10 is still open for the remaining 7 planned skills.
  - Two descriptions changed (one new, one rewritten). Their trigger effect
    is NOT_RUN (DS-09, R-32).

### D-028 — Basis for IMPLEMENTED in Step 09
- **Status:** PROPOSED
- **Decision:** The 19 D01 and D02 records are IMPLEMENTED (D-022), not
  VERIFIED. Each one has:
  - an existing recipe that meets the standard (V-18);
  - catalog agreement (V-19);
  - at least 1 positive and 1 negative recipe case (V-22);
  - an agent review of the recipe against the record's inputs and outputs;
  - `verification_evidence` naming the evals still pending.
- **Not done:**
  - human review of the recipes (G-15 by a person);
  - the trigger evals (G-11);
  - the behaviour evals (G-12).

  These are needed for VERIFIED.

### D-029 — Domains 03 and 04: `chayen-architecture` also owns migration and rollout planning
- **Status:** PROPOSED (executed in Step 10)
- **Context:**
  - The catalog mapped migration planning (CAP-04-005) to the planned
    `chayen-modernization`, and rollout planning (CAP-04-006) to the planned
    `chayen-devops`.
  - Creating both skills, plus `chayen-architecture`, would exceed the
    4,000-character L0 budget (R-27). It was 2,787 before Step 10.
- **Decision:**
  - Create only `chayen-architecture`, and give it design, decision, and
    technical-planning scope.
  - Remap CAP-04-005 with its group CG-12 (`migration-strategy.md`), which
    also moves CAP-15-003 strangler-migration and CAP-15-008
    monolith-modularization. Both stay PLANNED.
  - Remap CAP-04-006 out of CG-13 into its own recipe,
    `rollout-planning.md`. Deployment validation, rollback verification, and
    go/no-go stay with the planned `chayen-devops`.
  - Estimation (CAP-04-004) stays with `chayen-requirements`, as catalogued.
    Its description now includes sizing and excludes delivery schedules.
  - Task contract, planning, risk, and handoff stay with
    `chayen-implementation`. The task contract gains a four-level risk class
    scale.
- **Consequences:**
  - There are 8 skills. L0 is 3,226 / 4,000, leaving about 129 characters
    for each of the 6 planned skills. That is a first instance of Option C
    (merge) in CAPABILITY_COVERAGE §5.2, and the remaining set must be
    decided (Q-10) before another skill is added.

### D-030 — Proposed plans are separate from approved decisions
- **Status:** PROPOSED
- **Decision:**
  - Every design, option recommendation, ADR, migration plan, rollout plan,
    and task contract that the agent produces is labelled **proposed**.
  - Only the user or a named owner makes it accepted or approved. The record
    names who, and when.
  - Accepted ADRs are never edited, except for their status line when a
    superseding ADR is accepted.
  - The task contract has a `Status: proposed | approved by <user>` line.
    Contract approval never implies approval of the individual risky
    actions.
- **Where:**
  - `chayen-architecture` (Principles, Safety boundaries);
  - `decision-records.md`, `migration-strategy.md`, `rollout-planning.md`;
  - `chayen-implementation/references/task-contract.md`.

### D-031 — Domains 05 and 06: extend the implementation and backend pilots; move upgrades to implementation
- **Status:** PROPOSED (executed in Step 11)
- **Decision:**
  - **D05 extends `chayen-implementation`.**
    - Its feature workflow moved into `feature-delivery.md`, and the skill
      routes by change type across 10 recipes plus the task contract and
      change summary.
    - Principles: task-scoped diffs, pure change types (a fix does not
      refactor), never silently replacing dependencies or frameworks, and
      verification with the project's real toolchain.
  - **D06 extends `chayen-backend`.**
    - The skill detects the stack first and loads one technology reference.
      ASP.NET Core is not the default.
    - It routes across 7 recipes. A short endpoint-level bug path stays in
      the skill, because D-016 prevents linking the implementation skill's
      `bug-fix.md`.
  - **Dependency upgrades (CAP-05-008) move with CG-17 (`upgrades.md`)**
    from the planned `chayen-modernization` to `chayen-implementation`. The
    reason is the same as D-029: no new skill fits the L0 budget. CG-17 also
    carries CAP-15-004 framework-version-upgrade and CAP-15-005
    breaking-change-analysis, which stay PLANNED.
- **Consequences:**
  - Both descriptions grew (implementation 414 characters, backend 416).
    L0 is 3,315 / 4,000.
  - `chayen-modernization` now owns only 4 PLANNED capabilities. That makes
    it a natural merge candidate (Q-10).
  - Description trigger effects are NOT_RUN (R-32).

### D-032 — Domains 07 and 08: extend the frontend pilot; D08 limited to web-technology shells
- **Status:** PROPOSED (executed in Step 12). Q-11 stays open until the
  user approves or changes the D08 scope.
- **Context:** the user's Step 12 prompt asked for all 8 D08 capabilities,
  "without assuming a single frontend framework" and "respecting
  platform-specific constraints". Q-11 had to be answered before any D08
  recipe could be written. The charter lists no native mobile or desktop
  stack.
- **Decision:**
  - **D08 covers web-technology shells only:** PWA, Capacitor or Ionic
    (Cordova in legacy apps), Electron, and Tauri, built with the charter's
    web stacks. This is the Step 07 proposal. Native toolkits stay out of
    scope: SwiftUI, UIKit, Jetpack Compose, Flutter, React Native, .NET
    MAUI, WPF, WinForms, WinUI, and Unity. The charter stack list does not
    change, so BC-20 is not triggered.
  - **D07 and D08 extend `chayen-frontend`.** The skill becomes a router
    (189 lines): one framework reference, the new `app-shells.md`
    technology reference only when a shell is present, and one of 11
    recipes. A shared `ui-states.md` checklist covers loading, empty,
    error, retry, permission denied, offline, and the other view states.
  - **Recommendation versus verification:** the skill's principles require
    every claim about rendered or device behaviour to be labelled as
    verified by a named command or test, "not verified in browser", or "not
    verified on device".
  - **CG-27 is split.** Device permissions (CAP-08-004) and push
    notifications (CAP-08-005) move from `hybrid-mobile.md` to a new
    `device-permissions-and-push.md` (CG-57). Both start with a permission
    request, and keeping five capabilities in one recipe would have made
    it too dense to follow. CG-27 keeps CAP-08-001, 002, and 006.
- **Consequences:**
  - The `chayen-frontend` description now names the shells and excludes
    React Native and Flutter (419 characters). L0 is 3,349 / 4,000.
  - Description trigger effects are NOT_RUN (R-32). The Step 06 frontend
    routing results no longer describe the current description.
  - If the user wants native toolkits, a later decision changes the charter
    stacks and REQ-05 acceptance, and the D08 recipes gain native
    technology rows or a separate skill.

### D-033 — Domains 09 and 10: new `chayen-data` skill; extend the testing pilot
- **Status:** APPROVED for the new skill (the user chose "New chayen-data"
  when asked in Step 13). The rest is PROPOSED (executed in Step 13).
- **Context:** D09 was mapped to the planned `chayen-data` entry skill, and
  Q-10 and R-27 required a user decision before any new entry skill. The
  agent offered three options: a new `chayen-data` skill (recommended),
  extending `chayen-backend` (as D-029 and D-031 did), or a new skill with a
  higher L0 cap.
- **Decision:**
  - **`chayen-data` is created** as the ninth entry skill (170 lines). It
    covers relational data on SQL Server and PostgreSQL, through the
    project's migration tool and data access. It routes to one engine
    reference (`sql-server.md`, `postgresql.md`), a `database-safety.md`
    checklist when a command targets a non-local database or the change is
    destructive, and one of 8 recipes.
  - **Database rules in the skill:** the engine and version are identified
    before any SQL; production is read-only by default; destructive
    operations need approval with an impact count, a verified restore point,
    and a rollback path; changes follow expand, migrate, contract; and the
    skill states that it is advisory.
  - **Out of scope:** MySQL, Oracle, SQLite as a production store, NoSQL
    stores, analytics warehouses, and database provisioning.
  - **`chayen-backend`** keeps endpoint-level data access and its
    `data-access.md` reference. Its "When not to use" table now sends
    schema, query, migration, backfill, ETL, retention, and restore work to
    `chayen-data`. Its description is unchanged.
  - **D10 extends `chayen-testing`,** which becomes a router with 7 recipes.
    Its description now names contract, property-based, mutation, and fuzz
    testing, test data, and coverage gaps.
  - **Fuzz boundary (R-28):** fuzz testing of the user's own code is in
    scope. Fuzzing systems the user does not own stays out.
  - **Test result vocabulary:** the testing skill reports PASSED, FAILED,
    SKIPPED, BLOCKED, NOT_RUN, and UNKNOWN for the user's tests. This
    repository's own governance keeps the BUILD_CONTRACT §5.2 vocabulary.
  - **Trigger case change:** `pos-backend-migration-index` (an EF Core index
    migration) is now also a `chayen-data` trigger (CAP-09-002 lists
    `chayen-backend` as secondary). It moved from positive to ambiguous,
    accepting either skill, and keeps its id.
- **Consequences:**
  - L0 is 3,794 / 4,000 with 9 skills. The 206 characters left cannot hold
    another useful description, so the remaining 5 planned skills must be
    merged into existing ones (Option C), or the cap changed, before any
    further skill is added (Q-10, R-27).
  - CAP-18-006 (data governance), and the D19 search and geospatial
    records, now map to an existing entry skill but stay PLANNED.
  - Description trigger effects are NOT_RUN (R-32).

### D-034 — Domains 11 and 12: new `chayen-performance` with the L0 cap raised to 4,400; container and IaC review moved to security
- **Status:** APPROVED for the new skill and the cap change (the user chose
  "New skill, cap to 4,400" when asked in Step 14). The rest is PROPOSED
  (executed in Step 14).
- **Context:** D12 was mapped to the planned `chayen-performance`, but only
  206 L0 characters remained. The agent offered three options: a new skill
  with the cap raised to 4,400 (recommended), folding D12 into
  `chayen-backend`, or folding it into `chayen-architecture`.
- **Decision:**
  - **The L0 cap is 4,400 characters** (was 4,000, ADR-0004 and D-017).
    That is about 55 % of Codex's 8,000-character fallback. The validator
    (V-07), the authoring standard, ARCHITECTURE §8, PLUGIN_PACKAGE_DESIGN,
    and ADR-0003 and ADR-0004 now state the new cap.
  - **`chayen-performance` is created** as the tenth entry skill (151
    lines, description 389 characters). Its central rule is "no
    measurement, no claim": every statement is labelled MEASURED,
    ESTIMATED, or HYPOTHESIS, and an optimization is proven only by before
    and after measurements under the same conditions. Load and profiling
    sessions against production, shared, or third-party systems need
    approval. It routes to a `runtime-tools.md` technology reference
    (.NET, Node or Bun, Python, browser) and 5 recipes.
  - **`chayen-testing`** now hands load testing to `chayen-performance` by
    name.
  - **D11 extends `chayen-security`,** which becomes a router with 8
    recipes. The two pilot checklists stay as shared references. The
    description adds threat models, SAST and dependency triage, privacy,
    SBOMs and licences, and Dockerfile and IaC review (416 characters).
  - **CAP-11-013 moves to `chayen-security`.** The user asked for all 14 D11
    capabilities, and the record already listed `chayen-security` as
    secondary. It is now a read-only review of container and IaC files in
    the repository (`infrastructure-security-review.md`), with
    `chayen-devops` as secondary. CG-40 keeps CAP-13-004 and CAP-13-005.
    Writing infrastructure stays with the planned `chayen-devops`.
  - **Security boundary:** dynamic scanning, exploits, brute force, and
    denial of service against live systems stay out of scope. Scanners run
    locally on the repository.
  - **Trigger case change:** the ambiguous `amb-slow-and-injection` now also
    accepts `chayen-performance`.
- **Consequences:**
  - L0 is 4,224 / 4,400 with 10 skills. The 4 remaining planned skills
    (`chayen-devops`, `chayen-modernization`, `chayen-documentation`,
    `chayen-ai-engineering`) cannot fit in 176 characters: each needs a
    merge, or a further cap decision (Q-10).
  - Description trigger effects are NOT_RUN (R-32). The security
    description changed after Step 06 measured security under-triggering
    (R-23).

### D-035 — Domains 13 and 14: new `chayen-devops` with the L0 cap raised to 4,700
- **Status:** APPROVED for the new skill and the cap change (the user chose
  "New skill, cap to 4,700" when asked in Step 15). The rest is PROPOSED
  (executed in Step 15).
- **Context:** D13 and D14 (22 capabilities) mapped to the planned
  `chayen-devops`, which needs about 430 L0 characters, while 176 remained
  under the 4,400 cap. The agent offered three options: a new skill with
  the cap raised to 4,700 (recommended), a new skill with a final cap of
  6,000, or spreading the capabilities over three existing skills.
- **Decision:**
  - **The L0 cap is 4,700 characters** (about 59 % of Codex's
    8,000-character fallback). V-07, the authoring standard, ARCHITECTURE,
    PLUGIN_PACKAGE_DESIGN, and ADR-0003 and ADR-0004 state it.
  - **`chayen-devops` is created** as the eleventh entry skill (178 lines,
    description 417 characters). Its core rule: it changes files, not
    environments. It states that it grants no access, and that
    deployments, rollbacks, restarts, scaling, publishing, and mutating or
    destructive infrastructure commands run only with the user's approval
    and the platform's authorization.
  - **References:** an `operations-safety.md` checklist that classifies
    every command as local, read-only remote, mutating, or destructive,
    with the approval request contents; a `tooling.md` technology reference
    (GitHub Actions, Azure Pipelines, GitLab CI, containers, Terraform,
    Pulumi, Bicep, Kubernetes and Helm, telemetry); and 13 recipes.
  - **Hand-offs:** the architecture, backend, performance, and security
    skills now name `chayen-devops` for infrastructure, pipelines, and
    cluster work in their "When not to use" tables. Their descriptions
    are unchanged.
  - **Trigger case change:** `uns-helm` (fixing a Helm chart) is now in
    scope and moved from unsupported to a `chayen-devops` positive, keeping
    its id. The generator replaced its `no-chayen-skill.md` grader with
    `expected-skill.md`.
- **Consequences:**
  - L0 is 4,654 / 4,700 with 11 skills. The 3 remaining planned skills
    (`chayen-modernization`, `chayen-documentation`,
    `chayen-ai-engineering`) cannot fit in 46 characters: each needs a
    merge or another cap decision (Q-10).
  - CAP-15-009 (hotfix), CAP-18-004 (policy as code), and CAP-18-008
    (go/no-go, in `release-and-rollout.md`) now map to an existing entry
    skill but stay PLANNED.
  - Description trigger effects are NOT_RUN (R-32).

### D-036 — Domains 15 and 16: fold modernization into existing skills; new `chayen-documentation` with the L0 cap raised to 5,200
- **Status:** APPROVED for the structure and the cap change (the user chose
  "Fold modernization, new docs skill, cap 5,200" when asked in Step 16).
  The rest is PROPOSED (executed in Step 16).
- **Context:** six D15 records already lived in existing skills (D-029,
  D-031, and the devops hotfix mapping). The planned `chayen-modernization`
  owned only 4 records, and the planned `chayen-documentation` owned 10
  (plus CAP-18-001). 46 L0 characters remained. The agent offered three
  options: fold modernization and create documentation with a 5,200 cap
  (recommended), create both with a 5,600 cap, or fold both with no cap
  change.
- **Decision:**
  - **`chayen-modernization` is removed** from the catalog's entry-skill
    list (13 mapped entry skills remain, under the 14 cap):
    - CAP-15-001 (legacy assessment) and CAP-15-010 (debt prioritization)
      move to `chayen-repository`, which already does the read-only
      analysis, as `legacy-assessment.md` and
      `technical-debt-prioritization.md`. The ranking is a proposal; the
      team decides. The repository description no longer excludes
      "prioritizing work", and git operations and documentation now hand
      off to `chayen-documentation`.
    - CAP-15-006 and CAP-15-007 (dead code, deprecation) move with CG-18 to
      `chayen-implementation` as `dead-code-and-deprecation.md`.
  - **Existing recipes extended:** `refactoring.md` (large refactor plans,
    CAP-15-002), `upgrades.md` (framework major upgrades and breaking-change
    analysis, CAP-15-004 and 005), `migration-strategy.md` (strangler and
    modular monolith, CAP-15-003 and 008), plus a new devops `hotfix.md`
    (CAP-15-009).
  - **Behaviour-preserving changes** require characterization or regression
    tests where feasible: large refactor steps, dead-code removal, and
    hotfixes (a failing test before the fix).
  - **`chayen-documentation` is created** as the twelfth entry skill (143
    lines, description 395 characters). Its rule: documentation reflects
    verified repository facts, and test, build, or benchmark results are
    reported only if they ran in the session or the user supplied them. A
    `fact-checking.md` checklist lists the verified source per statement
    type. Six recipes cover project docs, API docs, architecture docs, pull
    requests and review, release notes, and git workflow (destructive or
    shared-history operations need confirmation).
  - **The L0 cap is 5,200 characters** (about 65 % of Codex's
    8,000-character fallback).
  - **Descriptions changed:** `chayen-repository` (380 characters) and
    `chayen-implementation` (418 characters), with the trigger-case and
    validator self-test anchor updates that follow:
    `amb-pr-review` and `amb-rules-from-code` now also accept
    `chayen-documentation`, and the `sk-description-single-exclusion`
    mutation's anchor text matches the new repository description (same
    intent: a boundary clause with one exclusion must fail V-20).
- **Consequences:**
  - L0 is 5,051 / 5,200 with 12 skills. Only `chayen-ai-engineering`
    (D17, D20, and one D18 record) is still planned; 149 characters cannot
    hold its description (Q-10).
  - CAP-18-001 (standards checks) maps to `pull-requests-and-review.md` and
    stays PLANNED.
  - Description trigger effects are NOT_RUN (R-32).

### D-037 — Domains 17 and 18: new `chayen-ai-engineering` with the L0 cap raised to 5,500; D18 in existing skills
- **Status:** APPROVED for the new skill and the cap change (the user chose
  "New skill, cap to 5,500" when asked in Step 17). The rest is PROPOSED
  (executed in Step 17).
- **Context:** D17, agent action risk (CAP-18-010), and D20 map to the last
  planned skill, `chayen-ai-engineering`, which needed about 420 L0
  characters while 149 remained. The agent offered three options: a new
  skill with a 5,500 cap (recommended, completing the skill set), trimming
  all other descriptions to fit 5,200, or scattering AI work across
  existing skills.
- **Decision:**
  - **The L0 cap is 5,500 characters** (about 69 % of Codex's
    8,000-character fallback). All 13 mapped entry skills now exist, so no
    further cap change is expected for D19 and D20, which map to existing
    skills.
  - **`chayen-ai-engineering` is created** (155 lines, description 405
    characters). Principles: evidence before claims (LLM comparisons with
    several runs and variance), data first (leakage and splits before
    training), untrusted model output and retrieved content,
    recommendations are not authorizations, and approval for billed runs
    and external data transfer. It routes to an `ai-tooling.md` technology
    reference and 8 recipes (ml-data, ml-experiments-and-evaluation,
    model-serving, rag, llm-and-agent-evaluation, llm-safety,
    llm-observability, agent-governance). Agent permission settings are
    described provider-neutrally, with an instruction to cite the
    provider's current documentation (BC-15).
  - **D18 is implemented where the catalog already mapped it:** two new
    recipes (`chayen-devops/references/policy-as-code.md`,
    `chayen-security/references/access-reviews.md`) and six extended ones
    (standards check in `pull-requests-and-review.md`, change passport and
    evidence audit in `change-summary.md`, go/no-go in
    `release-and-rollout.md`, licence obligations in `sbom-and-licenses.md`,
    governance check in `retention-and-governance.md`, waivers in
    `decision-records.md`).
  - **Recommendations are never authorizations.** Go/no-go, waivers,
    policies, access reviews, change passports, evidence audits, and agent
    permission reviews label their outputs as recommendations. Approval
    fields are filled only from a named person's recorded decision; the
    agent never self-approves, and an approval claimed in a report is
    "supported" only by such a record.
  - **Access review scope (R-28, CAP-18-005):** read-only review of exports
    the user provides. `chayen-security`'s scope line now includes it; the
    agent never changes live permissions.
  - **Validator self-test fixtures retargeted:** `cat-implemented-without-evidence`
    now targets the first PLANNED record (the last IN_PROGRESS record no
    longer exists), and `sk-recipe-lists-planned-capability` now targets
    CAP-20-006 in `agent-governance.md` (CAP-18-003 is now legitimately
    listed in `change-summary.md`). Both still produce their expected
    errors (G-13 53/53).
- **Consequences:**
  - L0 is 5,477 / 5,500 with 13 skills; any description growth must fit in
    23 characters or be offset.
  - CAP-20-003, 006, and 008 map to existing AI recipe files and stay
    PLANNED until D20.
  - Description trigger effects are NOT_RUN (R-32).

### D-038 — Domains 19 and 20 in existing skills; all capabilities implemented
- **Status:** PROPOSED (executed in Step 18).
- **Context:** D19 and D20 already mapped to existing skills, so no skill or
  cap decision was needed. Fifteen L0 characters would remain after the
  required description changes.
- **Decision:**
  - **D19 follows the catalog mapping.** New recipes: `realtime-systems.md`
    (architecture), `search-and-indexing.md` and `geospatial.md` (data),
    `file-processing.md` (backend), and `browser-extensions.md` (frontend).
    Extended recipes: `api-design.md` (GraphQL schema evolution),
    `external-integrations.md` (webhooks), `idempotency-and-consistency.md`
    (payments and ledgers), and `resilience.md` (multi-region). Every
    recipe starts by inspecting the project for the specialist technology
    (PostGIS, full-text availability, realtime backplanes, GraphQL server,
    extension toolkits) and treats anything missing as an option needing
    approval.
  - **D20 in `chayen-ai-engineering`.** New recipes: `agent-skills.md`
    (authoring, review, migration), `provider-compatibility.md`, and
    `session-handoff.md`. Extended recipes: `llm-and-agent-evaluation.md`
    (skill testing, benchmarking) and `agent-governance.md` (instruction
    conflicts). Provider differences: every provider-specific claim cites
    current documentation or is unverified, and results from one provider
    are not reused for another. Trust boundaries: third-party skills are
    untrusted content whose scripts are not run during review, instruction
    files are never modified without approval, and a handoff is data the
    receiver verifies, not instructions that outrank the user.
  - **Descriptions:** `chayen-frontend` now names browser extensions (the
    last R-28 boundary change), and `chayen-ai-engineering` names agent
    skills. Both were shortened elsewhere to stay within the 420-character
    target and the 24-item limit. L0 is 5,485 / 5,500.
  - **Validator self-test fixtures retargeted:** seven negative controls
    targeted PLANNED records or planned recipes, which no longer exist. They
    now create the faulty state from IMPLEMENTED records or existing recipes
    (and `sk-recipe-lists-planned-capability` sets CAP-20-006 back to
    PLANNED in its copy). Each still produces exactly its expected error.
- **Consequences:**
  - All 206 capabilities are IMPLEMENTED and none is VERIFIED. Promotion
    to VERIFIED needs the behaviour evals (G-12), the trigger evals (G-11),
    and human review (R-33, R-34).
  - REQ-05 moves from IN_PROGRESS to IMPLEMENTED in the acceptance matrix.
  - Description trigger effects are NOT_RUN (R-32).

### D-039 — .NET technology pack in existing skills, with its own catalog and checker
- **Status:** PROPOSED (executed in Step 20).
- **Context:** Step 20 asks for first-class C#, ASP.NET Core Web API, and
  .NET support: 22 named technology capabilities, with technology knowledge
  kept separate from the general workflow where practical. The L0 budget is
  at 5,485 / 5,500, the 206-capability engineering catalog is a verbatim
  inventory, and skills cannot link to each other's files (D-016).
- **Decision:**
  - **No new entry skill and no description change.** The pack lives in
    `kind: technology` references in the skills that handle each kind of
    request: C# language and project health in `chayen-implementation`
    (4 files); ASP.NET Core API work in `chayen-backend` (a rewritten base
    reference plus 5 topic files); EF Core migrations in `chayen-data`;
    WebApplicationFactory tests in `chayen-testing` (extended
    `dotnet-testing.md`); ASP.NET Core performance levers in
    `chayen-performance`; hosting and deployment in `chayen-devops`.
    Recipes keep the workflow; technology sections hold the .NET detail.
  - **A separate technology catalog** (`catalog/technology-capabilities.yaml`,
    IDs `TECH-<TECH>-NNN`, pack `dotnet-aspnetcore` from the engineering
    catalog's `stack_packs`). The engineering catalog is unchanged, so the
    206 count and its checker are unaffected.
  - **Authoring standard amended:** §5.3 (technology capability sections,
    TC-01 to TC-06), LD-03 (base plus one topic file per stack), and §8
    (`technology-cases.json`).
  - **New checker V-23** (`tools/catalog/check-technology.mjs`, gate G-03b)
    with 14 negative controls, and 57 technology cases.
  - **Framework fact checks:** a developer-only .NET fixture and runner
    (`tests/technology/dotnet/`) execute 31 claims the guidance relies on.
    They use the locally installed SDKs and need no new dependency in the
    repository tooling (BC-22): the runner is plain Node.js and the fixture
    restores its own NuGet packages in a temporary directory.
  - **Status rule:** all 22 are IMPLEMENTED; none is VERIFIED. Fact checks
    show framework behaviour, not agent behaviour.
- **Consequences:**
  - .NET prompts route through existing descriptions. C# language prompts
    rely on `chayen-implementation`'s general wording, and EF Core
    migration prompts may reach `chayen-backend` instead of `chayen-data`
    (R-37). Seven trigger cases were added; trigger evals are NOT_RUN.
  - Version claims for .NET 6, 7, and 9 are not executed (R-38).
  - The later technology packs (Angular, SQL Server, and the additional
    stacks) can follow the same pattern.

### D-040 — Step 21 Angular and shared TS/JS support
- **Status:** scope ACCEPTED (explicit user prompt, 2026-10-15); implementation
  layout PROPOSED pending review.
- **Scope decision:** execute the user's 14 Angular and 8 shared TS/JS
  capabilities as STEP 21 ONLY. This supersedes the original indicative
  user-documentation step; its text is retained as history. Stop after Step 21.
- **Layout:** extend D-039 and authoring standard §5.3. Thirteen Angular
  sections live in frontend technology topics; angular-testing lives in the
  testing skill. Eight shared language/toolchain sections live in the
  implementation skill. Existing recipes retain workflow; base references
  plus one selected topic provide conditional detail. No new entry skill,
  description change, L0-budget change, or engineering-catalog change.
- **Verification:** developer-only Node fact runner uses explicitly supplied
  existing tools and synthetic temporary fixtures. No Angular/TypeScript
  packages are installed; offline npm checks use only local fixture packages
  with scripts disabled. No runtime/development dependency is added to the
  repository or shipped plugin (BC-22). Missing Angular/browser fixtures and
  unexecuted agent evaluations remain NOT_RUN; capabilities stay IMPLEMENTED.
- **Constraints:** inspect versions first; preserve standalone/NgModule,
  RxJS/store, zone, forms, and template conventions. No automatic Signals,
  zoneless, control-flow, or package-manager migration. Use configured runners;
  keep privileged server secrets out of browser artifacts and transfer state.
- **Consequences:** all 44 technology capabilities are IMPLEMENTED, 0 VERIFIED.
  The 22 new sections pass V-23; 52 new positive/negative specifications and
  8 trigger prompts are available, but agent evaluations remain unexecuted.
  Angular runtime/build/browser claims remain unverified. No later step,
  commit, push, publish, or release is authorized by this decision.

### D-041 — Step 22 React and Next.js technology guidance
- **Status:** scope ACCEPTED (explicit user prompt, 2026-10-15); layout
  PROPOSED pending user review.
- **Scope:** execute STEP 22 ONLY for 8 React and 8 Next.js capabilities.
  This supersedes the original indicative release-readiness step; preserve
  that text as history and stop after the requested technology guidance.
- **Layout:** follow D-039/D-040 and technology standard §5.3. Seven React
  capabilities live in frontend topics and component testing in testing.
  Next App Router, server/client boundary, and rendering/SEO live in frontend;
  Server Functions, handlers, caching, and authentication in backend;
  deployment testing in devops. General workflow remains in existing recipes.
  No new skill, metadata change, L0 increase, or engineering-catalog change.
- **Requirements:** detect resolved versions, preserve App/Pages and installed
  client-router architecture, reuse state/query/form tools and configured
  runners. Check authorization at every reachable server operation, not just
  UI/layout/proxy; keep privileged data out of imports and serialized client
  payloads as well as public environment configuration.
- **Verification:** V-23 structural validation and 40 new case specifications;
  eight mutation controls and eight trigger prompts. A dependency-free runner
  checks synthetic callable, Web handler, and loopback HTTP boundaries.
  Its fixed sessions are synthetic, not production auth. React/Next framework,
  build/cache/browser/provider checks remain NOT_RUN without matching fixtures.
  No runtime/development dependency or package manifest is added to the plugin
  or repository; fixture/tooling uses Node built-ins (BC-22).
- **Consequences:** 60 technology capabilities IMPLEMENTED, 0 VERIFIED;
  behavior/trigger evaluations and human review pending. Frontend entry body
  reaches 206 lines (200-line target warning, below 300 hard). No application
  auth, production configuration, actual deployment, release, or later step
  was changed or performed.

### D-042 — Step 23 Vue, Nuxt, and Vite guidance
- **Status:** scope ACCEPTED (explicit user prompt, 2026-10-15); layout
  PROPOSED pending review.
- **Scope:** STEP 23 ONLY, exact seven Vue, seven Nuxt, four Vite capabilities.
  Add this user-directed step after Step 22 without performing a release or
  carrying work into another step.
- **Layout:** reuse technology standards and existing entry skills. Six Vue
  capabilities in frontend, component testing in testing; Nuxt app/import/module
  work in frontend, server API/private config in backend, rendering/deployment
  in devops; Vite configuration/build/env in devops, runner integration in
  testing. Existing workflow recipes retain procedures; base plus one topic
  loads conditionally. No new skills, descriptions, metadata budget or
  engineering-catalog changes.
- **Constraints:** detect resolved versions and selected build/config ownership;
  keep Options/setup, Vue 2/3, Nuxt 2/3/4 layout/context, installed routers/stores,
  manager and tests. No automatic Vite/Vitest, framework migration, or store/
  module install. Keep browser globals out of SSR and private configuration
  out of public DTO/state/payload/import/build paths.
- **Verification:** V-23 for all 18 sections/cases, 44 positive/negative specs,
  eight trigger prompts, nine mutation controls. Developer-only runner uses
  optional existing tools and Node built-ins; two executed JavaScript exposure
  counterexamples do not prove Nuxt serialization or Vite build secrecy.
  No runtime/development dependency or project package manifest is added
  (BC-22). Framework/browser/artifact/agent evaluations remain NOT_RUN.
- **Consequences:** 78 technology records IMPLEMENTED, 0 VERIFIED; frontend
  and backend bodies exceed the 200-line target at 213/202 but stay under
  300 hard. Human review remains pending. No prior-step implementation fixes,
  production configuration, deployment, commit, publish, or later step action.
### D-043 — Step 26 SQL Server guidance and data access recipes
- **Status:** scope ACCEPTED (explicit user prompt "Execute STEP 26 ONLY",
  2026-10-15); layout and fixture PROPOSED pending review.
- **Scope:** the user's exact 12 SQL Server capabilities and data access
  recipes for the EF Core SQL Server provider, Dapper, and ADO.NET. Steps 24
  and 25 have no record in this repository; Step 26 was executed as
  instructed without inferring or performing their content (R-45).
- **Layout:** all 12 capabilities in `chayen-data`, which already owns SQL
  Server work: the existing `sql-server.md` becomes the expanded base
  (engine/provider detection, PostgreSQL-dialect guard, read-only production
  rule) and five topic references hold two or three capabilities each. The
  three data access recipes live in `sqlserver-data-access.md` as
  technology content, not catalog capabilities, so the 12/12 inventory stays
  exact; V-23.10 checks them (sections, ten required topics, steps, verify
  rule, driver references, 9 recipe cases). One pointer sentence was added
  to the backend's `aspnetcore-data-access.md` because skills cannot link
  across directories (D-016). No new skill, description, or metadata change.
- **Fixture and dependencies (BC-22):** `tests/technology/sqlserver` adds a
  developer-only xUnit project referencing Microsoft.EntityFrameworkCore.SqlServer
  10.0.8, Dapper 2.1.66, Microsoft.Data.SqlClient 6.1.1, xUnit 2.9.3, and
  Microsoft.NET.Test.Sdk 17.14.1. They are needed to execute the engine and
  ORM facts and to prove the recipes' API names compile; they are never
  shipped and add nothing to the plugin. The fixture runs only against
  LocalDB or a loopback server, in a database it creates and drops, inside
  a dedicated LocalDB instance (`ChayenFacts`) that the runner creates.
- **Verification:** V-23.1..10 PASS for 90 records; 39 capability and 9
  recipe cases; 7 trigger prompts; 10 mutation controls (104/104
  self-tests). `run-fact-checks.mjs` 30/30 PASS on SQL Server 2025 Express
  LocalDB. Agent behaviour and trigger evaluations NOT_RUN.
- **Consequences:** 90 technology records IMPLEMENTED, 0 VERIFIED.
  `chayen-data/SKILL.md` is 183 lines (under the 200 target). The local
  LocalDB instance `ChayenFacts` remains on the developer machine for
  re-runs. No commit, release, production access, or later step.
### D-044 — Step 27 PostgreSQL and cross-stack guidance
- **Status:** scope ACCEPTED (explicit user prompt "Execute STEP 27 ONLY",
  2026-10-15); layout, pack scope rule, and fixtures PROPOSED pending review.
- **Scope:** the user's exact 10 PostgreSQL and 8 cross-stack capabilities,
  and PostgreSQL data access recipes for EF Core Npgsql, Npgsql, SQLAlchemy
  (when applicable), and other ORM/driver configurations found in a project.
- **Layout:** PostgreSQL in `chayen-data` (expanded `postgresql.md` base and
  five topic references, plus `postgres-data-access.md`). Cross-stack
  capabilities go to the skill that owns each request: contracts, errors,
  authentication, and CORS/CSRF in `chayen-backend`; typed clients and
  date/time in `chayen-implementation`; end-to-end in `chayen-testing`;
  portability in `chayen-data`. No new skill, description, or metadata change.
- **Pack scope rule:** `crossstack` is not an engineering-catalog stack pack,
  so the technology catalog marks it `scope: cross-stack` and V-23.1 skips the
  stack-pack membership check for that scope only (control
  `tech27-crossstack-scope`). The engineering catalog is unchanged.
- **Checker:** V-23.10 now validates a list of recipe files (SQL Server and
  PostgreSQL), each with required topics, steps, verify rules, recipe cases,
  and driver packages pinned in a .NET project or `requirements.txt` with
  their APIs used by a compiled or imported fixture file.
- **Fixtures and tools (BC-22):** `tests/technology/postgres-crossstack` adds
  developer-only .NET projects (Npgsql 10.0.2, Npgsql.EntityFrameworkCore.PostgreSQL
  10.0.1, Dapper 2.1.66, EF Core SQL Server 10.0.8, Microsoft.AspNetCore.OpenApi
  and Mvc.Testing 10.0.12, xUnit 2.9.3) and a pinned `requirements.txt`
  (SQLAlchemy 2.0.43, psycopg 3.2.10). The runner installs nothing; it takes
  existing tools by option. For this run the agent downloaded, outside the
  repository: the official PostgreSQL 18.6 Windows binaries (EDB zip, SHA-256
  e2246ba9...84e2), a Python venv with the pinned requirements, and
  playwright-core 1.56.1, openapi-typescript 7.9.1, and TypeScript 5.9.3 in
  the session scratch folder. None is part of the plugin or the repository.
- **Verification:** V-23.1..10 PASS for 108 records; 53 technology, 11
  recipe, and 9 trigger cases; 11 mutation controls (115/115 self-tests);
  `run-fact-checks.mjs` 42/42 PASS. Agent evaluations NOT_RUN.
- **Consequences:** 108 technology records IMPLEMENTED, 0 VERIFIED; backend
  SKILL.md is 204 lines (target 200, hard limit 300). No commit, release,
  production access, or later step.

### D-045 — STEP 29 native composite workflows and reusable templates

- **Status:** scope ACCEPTED from the explicit user request "Execute STEP 29
  ONLY" (2026-10-15); owner-local layout and V-24 design PROPOSED pending review.
- **Scope:** the exact 12 requested engineering workflows and seven artifact
  formats. These are static instructions invoked by native agents, not a
  workflow server, scheduler, runtime engine, new tool or new entry skill.
- **Layout:** 12 `kind: checklist` references in the existing implementation,
  backend, data, testing, security, performance, devops and documentation
  owners; five `kind: template` leaves in implementation, one in architecture
  (ADR), one in AI-engineering (Context Capsule). D-016/RF-03/DR-04 remain:
  direct skill-local References links, no cross-skill links, native handoff by
  owner name. Repository artifact formats take precedence and artifacts stay
  in conversation by default. L0 descriptions and budget are unchanged.
- **Composition:** workflows identify applicable scope, inputs, reused recipe
  owners, conditional technology selection, stage inputs/actions/exit checks,
  outputs and verification, approvals, proportionality, blockers and handoff.
  Low-risk work can use the direct capability recipe; no matching workflow
  continues normal native behavior. No capability inventory is enlarged.
- **Authority:** an approval claim needs actual evidence from an authorized
  process for the exact action, target and scope. Plans, templates, ADRs,
  passing tests, tool permissions and readiness recommendations do not supply
  missing business/release approval. Valid action-specific authorization is
  reused within scope; dependent risky actions wait while independent work
  can proceed. No actual consumer migration or production action is authorized
  by implementing these instructions.
- **Traceability:** developer-only `catalog/composite-workflows.json` maps
  the workflows to existing implemented engineering recipes, technology pack
  IDs and formats. The 206 engineering and 108 technology records remain
  unchanged. `WORKFLOW_COVERAGE.md` is generated by V-24.
- **Validation:** V-24.1..6 statically checks identity, mapping, anatomy,
  templates, 47 evaluation specifications and coverage synchronization.
  Six automated gate groups PASS; 132/132 validator tests PASS, including
  16 new mutations and the workflow baseline. Agent/provider behavior and
  runtime workflow scenarios remain NOT_RUN, so workflows are IMPLEMENTED,
  not VERIFIED. No dependency, commit, release or later step.

### D-046 — STEP 32 evaluation suite, evidence levels and the path-resolution guard

- **Status:** scope ACCEPTED from the explicit user request "Execute STEP 32
  ONLY" (2026-10-15). The guard wording and the probe scoring rules are
  PROPOSED pending review.
- **Evidence levels:** static validation, simulated (lexical proxy), actual
  provider invocation, and manual verification are reported separately and
  never pooled.
  - The simulated proxy can never support VERIFIED.
  - Agent-read transcript grading is labelled as such and is not human
    verification.
- **Suite:** `tools/evals/run-evaluation-suite.mjs` (offline) aggregates the
  static gates. It adds executable traceability checks for 206 engineering,
  108 technology and 12 workflow records and the 11 requested routing
  examples, a static cross-skill handoff check, context-overhead estimates,
  and summaries of recorded provider results.
- **Provider probes:** `tests/evaluation/run-provider-probes.mjs` loads the
  plugin with `--plugin-dir` (no install) against
  `tests/evaluation/fixture`. Billed calls need `--allow-provider-calls`;
  Copilot needs an isolated `COPILOT_HOME`. Codex is out of scope until a
  lifecycle install is authorized.
- **Scoring rules:**
  - Routing is judged from the transcript. Turn-limit exits are reported as
    completion, not as routing failures.
  - An explicit `/plugin:skill` invocation counts as loaded only with
    observable evidence: a read of a skill-local reference, or the declared
    output marker.
  - Runs are pooled only while every skill description is identical.
- **Guard:** one sentence in all 13 SKILL.md files, next to the References
  table: "Reference links resolve from this skill's directory; resolve every
  project file from the user's working directory, never from the skill's
  location." It responds to 3/7 skill-loaded transcripts that targeted paths
  under the plugin's repository; there were 0/7 afterwards. That is not yet
  significant (EG-19). Descriptions and the L0 metadata are unchanged.
  Five bodies grew by 2 lines; all stay below the hard limit of 300.
- **Not changed:** the Next.js under-trigger (0/4) and pytest instability
  (2/4) are recorded as EG-16 and EG-17. Description changes wait for
  multi-run evidence.
- **No VERIFIED promotion**, no dependency, commit, release, install or later
  step.

### D-047 — STEP 35 approved multilingual product scope and step boundary

- **Status:** ACCEPTED (explicit Product Owner Step 35 request, 2026-10-17).
- **Scope:** add Thai `chayen-humanizer-th` and English `chayen-humanizer-en`
  editorial Entry Skills in the existing repository/plugin, target 13 → 15,
  plus a Multilingual Response Style Policy for ordinary replies without
  explicit Humanizer invocation. Preserve Claude Code/Codex/Copilot compatibility,
  206 Engineering Capabilities, all Technology/Workflow Coverage, native-plugin-first
  and zero runtime. No separate Humanizer repository.
- **Execution:** Step 35 governance only: impact analysis, ADR proposals,
  MHR-001–MHR-012 PLANNED and Steps 35–41 plan. No Skills, host integration,
  user configuration, hooks/MCP/installers/dependencies, billed evaluations,
  commit/push/tag/publication/release or Step 36 execution.
- **Authority boundary:** scope approval does not accept D-048–D-050 or
  ADR-0009–ADR-0011. Preferred Native Plugin + Opt-in Host Persistent
  Instructions is proposed. Strict install-only guaranteed always-on is
  UNVERIFIED, not claimed supported. Existing decisions remain in force.

### D-048 — Proposed editorial entry set, budgets and registry boundary

- **Status:** PROPOSED; full record:
  [ADR-0009](ADRS/ADR-0009-multilingual-editorial-skills.md).
- **Proposal:** ≤15 Entry Skills and L0 ≤6,500, separate validated editorial
  registry, unchanged engineering ownership and 206-capability inventory.
  Current ≤14 / 5,500 limits and validators stay unchanged in Step 35.
- **Affected:** ADR-0004, CA-01, V-07, V-11.3, V-19/V-20; approval and later
  tooling work must precede Skill implementation. No catch-all or dummy CAP.
- **Owner follow-up D-051:** the original proposed ≤15 ceiling is replaced
  by an ACCEPTED and implemented ≤25 ceiling. The L0 increase and editorial
  registry remain PROPOSED; no other mechanism is accepted by this follow-up.

### D-049 — Proposed opt-in persistent style policy exceptions

- **Status:** PROPOSED; full record:
  [ADR-0010](ADRS/ADR-0010-persistent-multilingual-response-style-policy.md).
- **Proposal:** distinguish native Skill discovery (A), user-enabled host
  instructions (B) and unverified install-only guaranteed always-on (C).
  Propose style-only opt-in exceptions to ADR-0002/0003, REQ-04/D-007 and
  ADR-0006's metadata-only provider differences. Preserve plugin-only fallback.
- **Boundary:** separately measured context cost, scope/precedence research,
  explicit opt-in, existing-content preservation and independent rollback;
  no automatic configuration write or runtime. Host/surface behavior UNVERIFIED.

### D-050 — Proposed multilingual quality, safety and regression criteria

- **Status:** PROPOSED; full record:
  [ADR-0011](ADRS/ADR-0011-multilingual-quality-and-safety.md).
- **Proposal:** language-specific human rubric, fidelity/protected-span checks,
  injection/permission cases and engineering regression comparisons; separate
  static/proxy/provider/human evidence. Proposed thresholds need owner approval
  with sample sizes before scoring. Preserve D-003/BC-23 advisory boundaries.
- **Verification:** MH-V01–MH-V12 are future methods, NOT_RUN. Step 35 static
  checks do not implement MHRs or promote existing requirements to VERIFIED.

### D-051 — Owner-approved Entry Skill ceiling of 25

- **Status:** ACCEPTED (explicit user follow-up, 2026-10-17: expand the Skill
  ceiling to 25 if the current ceiling is a problem).
- **Context:** current count 13 fits ≤14, but approved Humanizer target 15
  would exceed it. D-048/ADR-0009 originally proposed ≤15, still unapproved.
- **Decision:** raise the maximum Entry Skill count to **25** in both V-07
  (`validate-package.mjs`) and V-11.3 (`check-catalog.mjs`). This explicitly
  amends ADR-0004's count component and replaces ADR-0009's proposed ≤15 cap.
  Product target remains 15; actual installed Skill count remains 13.
- **Separate limits:** L0 remains ≤5,500 characters, currently 5,485. The
  proposed 6,500 L0 budget, editorial registry, host persistent policy and
  quality architecture remain PROPOSED. Every added Skill must still satisfy
  approved metadata, mapping, anatomy, routing and security gates. A 25-Skill
  ceiling is not evidence of host capacity or routing quality for 25 Skills.
- **Authorized scope:** narrow Step 35 follow-up for count validators,
  architecture/governance alignment and appropriate local checks. It does
  not start Step 36 or authorize Skill creation, host integration, billed
  evaluations, release actions or broader architecture exceptions.
- **Verification:** actual commands and outcomes are in the Step 35 owner
  follow-up entry in [PROGRESS.md](PROGRESS.md).

### D-052 — Owner-authorized L0 metadata ceiling of 6,500 characters

- **Status:** ACCEPTED (user follow-up, 2026-10-17: "จัดการให้เลย", responding
  to the outstanding 5,485/5,500 metadata constraint after D-051).
- **Decision:** implement the previously proposed ≤6,500-character L0 budget
  in V-07 and evaluation-suite reporting. Amend ADR-0004/0009's L0 component
  and current authoring/package/user documentation. Keep original historical
  test results and earlier decision context intact.
- **Rationale:** existing 5,485 plus two 18-character editorial names and
  two descriptions at the 420-character target totals at most 6,361, leaving
  139 within 6,500. Current unchanged usage leaves 1,015. This is an internal
  planning budget, not verified host/token capacity or a guarantee for 25 Skills.
- **Boundaries:** count ceiling remains 25; actual count 13, product target 15.
  Preserve description lengths, distinctness, progressive loading, engineering
  coverage and zero runtime. The editorial registry and persistent-policy/
  quality architecture remain PROPOSED. No Skill creation, host integration,
  user configuration, billed provider evaluation, release or Step 36 work.
- **Verification:** boundary 6,500/6,501 and offline regressions; actual
  commands/results recorded in the D-052 entry in [PROGRESS.md](PROGRESS.md).

### D-053 — Step 36 editorial registration and validation foundation

- **Status:** ACCEPTED (owner instructed "งง มีอะไรค้างหล่ะ ก็ทำซะซิ" after
  the missing separate-registry/CA-01/V-19 approval was explicitly identified).
  This approves proceeding with that concrete registration proposal; no
  duplicate approval is requested for D-051/D-052's settled limits.
- **Decision:** implement a separate developer-only JSON editorial registry,
  exactly Thai/English Humanizer identities with planned/existing mappings
  and canonical discovery metadata. V-19 validates the union of engineering
  and editorial registrations while retaining engineering-only capability
  ownership/recipe checks and all other shipped Skill gates.
- **Current requirement:** the latest Step 36 instruction specifies maximum
  **15**, replacing D-051's earlier 25. L0 remains 6,500 under D-052. Shared
  developer-only constants prevent count/budget drift between validators and
  reports. The package ends with 13 real Skills; both Humanizers are planned
  records without directories or placeholder SKILL.md files.
- **Isolation:** the 206-capability engineering catalog is unchanged. No dummy
  IDs, editor-owned engineering capabilities, cross-registry name collisions,
  executable registry fields, unsafe paths or validation exemptions.
- **Metadata:** current 5,485 plus planned editorial 455 = projected 5,940,
  leaving 560. Check actual/projected budgets, description breadth/distinctness
  and canonical metadata match. Existing engineering descriptions unchanged.
- **Arithmetic correction:** each Humanizer name is 19 characters, not the
  earlier assumed 18. The conservative 420-character description estimate is
  6,363 (137 free), not 6,361. Historical Step 35 measurements remain recorded
  as observed; the measured Step 36 registry total 5,940 is authoritative.
- **Evidence:** applicable offline validators, aggregate runner and new mutation
  cases; exact outcomes in PROGRESS.md. Native/provider/human evaluation is
  NOT_RUN. No runtime, host integration, release or Step 37 authorization.
- **ADR impact:** accept ADR-0009's registration component and CA-01/V-19
  amendments, plus the explicit new count requirement. ADR-0010 persistent
  host policy and ADR-0011 quality thresholds remain PROPOSED.

### D-054 — Step 37 Thai editorial skill design

- **Status:** ACCEPTED by proceeding (2026-10-17): the owner committed Step 37
  as `f65a432` and then issued the Step 38 instruction. No separate approval
  message was given, so this is an inference recorded in D-055 for the owner to
  confirm or correct. Originally implemented in Step 37 under the owner's
  explicit instruction; design choices remain open to review.
- **Decision:** ship `chayen-humanizer-th` as the 14th Entry Skill with an
  English router SKILL.md, Thai examples and seven skill-local references
  (six checklists, one template); no recipes, capabilities, scripts or hooks.
  14 Thai patterns (TH-01–TH-14), each with signals, rationale, false-positive
  guard, before/after and preservation notes.
- **Registry:** the Thai record moves from `planned` to `existing`; its
  description is widened from 211 to 354 characters to cover content
  creation, developer blogs, READMEs and UI microcopy, identical in SKILL.md
  and the registry (V-19). L0 actual 5,858, projected 6,083 / 6,500.
- **Boundaries:** English output, translation into other languages,
  engineering doc accuracy (documentation skill) and application code
  (engineering skills) are excluded. No mention of the unshipped English skill.
- **Tests:** 13 trigger cases; 52 behavior case specifications; developer-only
  static gate G-15 (`check-editorial-cases.mjs`); Step 36 planned-state
  mutations retargeted to the English record.
- **Attribution:** `blader/humanizer` (MIT, (c) 2025 Siqi Chen) informed the
  method only; no text copied. See [HUMANIZER_TH_DESIGN.md](HUMANIZER_TH_DESIGN.md).
- **Evidence:** static only. Native routing, behavior and fluent human review
  are NOT_RUN (R-58). No persistent policy, English skill or Step 38 work.

### D-055 — Step 38 English editorial skill design

- **Status:** ACCEPTED by proceeding (inferred, 2026-10-17): the owner issued the
  Step 39 instruction after the Step 38 report. Unlike D-054, Step 38 is not yet
  committed (its files remain uncommitted in the working tree), so this inference is
  weaker; please confirm or correct. Originally implemented in Step 38 under the
  owner's explicit Step 38 instruction.
- **Approval basis:** D-053 (registry, maximum 15) and D-052 (L0 6,500) are
  accepted. D-054 had no explicit approval message; the owner committed Step 37
  and instructed Step 38, which is treated as acceptance by proceeding, the same
  precedent as D-053. Please confirm or correct. ADR-0010 and ADR-0011 do not
  gate this step.
- **Decision:** ship `chayen-humanizer-en` as the 15th and last permitted Entry
  Skill: an English router SKILL.md (164 lines) and nine skill-local references
  (eight checklists, one template); no recipes, capabilities, scripts, hooks or
  dependencies. 26 English patterns (EN-01–EN-26), each with signals, rationale,
  false-positive exception, before/after and preservation notes.
- **Registry:** the English record moves from `planned` to `existing`; its
  description grows from the planned 206 to 344 characters and is identical in
  SKILL.md and the registry (V-19). Actual L0 **6,221 / 6,500** (279 free). No
  budget change. The ceiling of 15 is reached; a further Skill needs a decision.
- **Upstream:** the pattern taxonomy and watch lists are adapted from
  `blader/humanizer` 3.1.0 (MIT, (c) 2025 Siqi Chen). Treated conservatively as
  a substantial portion: the licence text (verified identical to upstream's) and
  an attribution mapping ship in `references/upstream-notice.md`. The upstream
  SKILL.md is not reproduced; all examples are original. No root notices file
  yet because the repository licence is undecided (Q-05).
- **Departures from upstream:** dashes follow the document instead of being
  banned; hyphenation follows the style guide; natural text is left alone; fiction
  is out of scope; US/UK spelling and identifiers are protected; three new
  patterns (unsupported claims, filler, register).
- **Description:** "non-English output" in the boundary clause mirrors the Thai
  skill's "non-Thai output" and avoids the wrong-language collision that naming
  Thai caused in the lexical proxy.
- **Tests:** 15 trigger cases and 10 edited ones (eight Thai cases now forbid the
  English skill; two cases that expected no skill became ambiguous and were
  renamed `amb-app-store-copy` and `amb-thai-request-english-email` because
  marketing copy now has an editorial owner); 102 behavior case specifications;
  G-15 generalized to both skills with an independence check (E-04); Step 36/37
  planned-state controls retargeted; 3 new registration and 7 new G-15 controls.
- **Independence:** neither editorial skill names or loads the other.
- **Evidence:** static only. Native routing, behavior, wrong-language behavior
  with real models and fluent human review are NOT_RUN (R-59). No persistent
  policy, host integration or Step 39 work.

### D-056 — Step 39 opt-in persistent response style policy

- **Status:** PROPOSED for the design choices below. ADR-0010's architecture
  (A native discovery + B opt-in host instructions; C not claimed) is treated
  as ACCEPTED because the owner's Step 39 instruction directs exactly that
  ("The preferred initial implementation is A + B, using user-approved host
  setup. Do not claim C works without runtime proof."). No separate approval
  message for ADR-0010 exists; please confirm or correct. ADR-0002, ADR-0003,
  ADR-0006 and REQ-04 texts are not edited; their scoped amendments are those
  listed in ADR-0010 and take effect only if this acceptance is confirmed.
- **Decision:** one provider-neutral canonical policy,
  `response-style/chayen-response-style.md`, a single marked block
  (`<!-- BEGIN/END chayen-response-style v1 -->`) outside the plugin package,
  plus one derived Copilot template (`applyTo: "**"` + the block, byte
  identical). Body 2,978 characters, 31 lines; G-16 caps the body at 3,500
  characters and 40 lines. The policy names no Skill, tool or host file.
- **Host placement (documented, not tested):** Claude Code
  `~/.claude/rules/chayen-response-style.md` (dedicated file); Codex
  `~/.codex/AGENTS.md` block (`AGENTS.override.md` shadows it); Copilot CLI
  `~/.copilot/copilot-instructions.md` block; VS Code Copilot Chat
  `~/.copilot/instructions/chayen-response-style.instructions.md`. Repository
  files only with the repository owner's agreement. Cross-host reading
  (VS Code reads `~/.claude/rules`) is documented as a duplicate risk.
- **Setup:** explicit consent to the exact file and diff (agent prompt, manual
  steps or a read-only preview helper). Nothing in the repository writes user
  or repository instruction files. The helper
  `tools/response-style/inspect-instructions.mjs` reads named files and prints
  states and diffs only; it imports no process or network module.
- **Rejected:** Claude Code `force-for-plugin` output style (activates on plugin
  enable, overrides the user's output style, drops built-in coding
  instructions unless configured, Claude-only, contradicts opt-in); plugin
  `CLAUDE.md`/`rules/` (not loaded or undocumented); Codex
  `model_instructions_file` (replaces built-in instructions) and
  `developer_instructions` (TOML config edit, no owned block); hooks, MCP,
  installers and background services (out of scope, ADR-0005/0007).
- **Tooling:** developer-only gate G-16 (`tools/validate/check-response-style.mjs`,
  R-01–R-08), fixture tests G-16T, 14 negative controls via a new
  `response-style` validator type in `run-validator-tests.mjs`, and a narrow
  D-04 exemption in `check-docs.mjs` for the policy identifier. No dependency.
- **Evidence:** static and disposable fixtures only. Host loading, behavior,
  fresh-session lifecycle, plugin uninstall and token measurement are NOT_RUN
  (R-60). Details: [RESPONSE_STYLE_DESIGN.md](RESPONSE_STYLE_DESIGN.md).

### D-057 — Step 40 multilingual evaluation design, rubric and fixtures

- **Status:** PROPOSED. The owner's Step 40 instruction fixes the dataset
  composition (≥120: 40 Thai, 40 English, 20 mixed, 20 policy/conflict/no-match)
  and the routing and policy targets (explicit 100%, implicit ≥85%, wrong
  selection ≤5%, policy adherence ≥95%); these are recorded as given. The
  language bar (≥4/5 on naturalness, clarity and tone for ≥90% of samples per
  language) and zero critical failures remain ADR-0011's PROPOSED thresholds.
  ADR-0011's status is unchanged. No score is recorded until the owner approves
  the rubric ([HUMANIZER_EVALUATION_RUBRIC.md](HUMANIZER_EVALUATION_RUBRIC.md)).
- **Dataset:** a held-out set written after the skills and not used to tune
  them; the 154 Step 37–38 specifications remain the development set.
  Synthetic inputs only. Because the same agent wrote both, an independent
  reviewer should replace or add at least 20% before scoring (R-63).
- **Arms:** A no plugin, B plugin only, C plugin plus the canonical policy at
  the host's documented user-level location in an isolated config home. Arm C
  counts only after a loading canary confirms the host read that location; B is
  never reported as persistent-policy behavior.
- **Scoring:** automated checks guard fidelity (protected spans, numbers,
  structure, exact formats, actions, language, skill selection); naturalness,
  clarity and tone come only from two independent blind fluent reviewers per
  language with adjudication. Discovery runs pool only within one provider
  version and one skill-metadata fingerprint.
- **Tooling:** `tools/evals/score-step40.mjs` (offline, never writes) with 56
  synthetic controls as gate G-17; `tests/evaluation/step40/run-arms.mjs` (billed
  runs need `--allow-provider-calls`; `--plan` offline); `run-provider-probes.mjs`
  gains `--spec` (confined to `tests/evaluation/`) and records the spec and a
  metadata fingerprint. No dependency, package or skill change.
- **Evidence:** static and simulated only. Every provider, host-lifecycle and
  human result is NOT_RUN (R-61). Results: [HUMANIZER_EVALUATION_REPORT.md](HUMANIZER_EVALUATION_REPORT.md).
- **Step 41 note:** the owner committed Step 40 as `e921df1` and issued
  Step 41. That is recorded as acceptance by proceeding of the Step 40 fixtures
  and tooling (inferred, same precedent as D-053–D-055). It is **not** taken as
  approval of the language threshold or the rubric: ADR-0011 item 3 requires an
  explicit owner approval before any score is recorded, so both stay PROPOSED.

### D-058 — Step 41 release-candidate version proposal

- **Status:** PROPOSED; **not applied**. The Step 41 instruction says to make
  only approved version changes, and no version was approved.
  **2026-10-18:** D-060 fixes the values to `0.1.0-rc.1` for the candidate
  and then `0.1.0`. They are still not applied, and the tag format is still
  open.
- **Context:** all four version fields (both manifests, the Copilot
  marketplace entry and its `metadata.version`) say `0.1.0-dev`, unchanged
  since the 6-skill build while the package grew to 15 skills. Claude Code pins
  installs to `version`, so stale installs persist (R-54). The Claude Code and
  Codex marketplace files carry no version.
- **Proposal:** `0.1.0-rc.1` for an approved pilot or release candidate
  (SemVer orders it after `0.1.0-dev` and before `0.1.0`), then `0.1.0` for the
  first release after the release gates pass. Apply identically in the four
  fields, update SECURITY.md's supported-versions table, and re-run V-04,
  IC-05/IC-06 and D-05.
- **Alternatives:** keep `0.1.0-dev` (stale installs continue); jump to
  `0.2.0` (implies a prior `0.1.0` release that never happened).
- **Details:** [docs/distribution/RELEASE_METADATA.md](../distribution/RELEASE_METADATA.md#step-41-version-proposal-d-058-proposed-not-applied).

### D-059 — Plugin identifier renamed to `chayen`

- **Status:** ACCEPTED (explicit owner instruction, 2026-10-17: "เปลี่ยนชื่อ Plugin ได้เลย แต่ห้ามแก้ชื่อ Repo"). Amends D-014.
- **Context:** Claude Code namespaces plugin skills by the manifest `name`, so every
  skill appeared as `/codejadee-chayen-framework:<skill>`. The documented way to
  shorten the prefix is the manifest `name`; `displayName` does not affect
  namespacing, and no alias mechanism is documented (Claude Code docs, read 2026-10-17).
- **Decision:** plugin `name` is `chayen` in both manifests and all three marketplace
  entries, so Claude Code shows `/chayen:<skill>`; install identifier `chayen@codejadee`.
  Unchanged: the repository name `codejadee-chayen-framework`, `homepage` and
  `repository` URLs, the marketplace name `codejadee`, the directory
  `plugins/codejadee-chayen-framework/`, the 15 skill names (their `chayen-` prefix
  still prevents silent same-name collisions in Copilot) and the version `0.1.0-dev`
  (D-058 still PROPOSED). Codex (`$chayen-<skill>`) and Copilot (`/chayen-<skill>`)
  invocation is unaffected.
- **Migration:** no `renames` map was added (its support in the installed Claude Code
  2.1.220 and in V-01a is unverified); users uninstall the old identifier and install
  `chayen@codejadee`, as the install guides describe. Pre-release, private repository.
- **Tooling:** `check-identity.mjs` and `run-provider-probes.mjs` read the name from the
  manifest; the evaluation suite's provider-syntax scan covers both prefixes; three
  validator mutations use the new name; `check-docs.mjs` allows the old identifier only
  as migration text. Historical step records keep the old name.
- **Not verified:** install, invocation and migration under the new name on any host.

### D-060 — Chayen v0.1.0 release scope and owner release decisions

- **Status:** ACCEPTED (explicit Product Owner decisions, Production Readiness
  Plan v4 Phase 1 instruction, 2026-10-18) for the items under **Decision**.
  The security and support item is **not decided**. The tag format is open.
  Nothing is applied to the manifests, `LICENSE` or repository settings by
  this record.
- **Decision:**
  - Release: "Chayen v0.1.0 — Public Production Release for verified CLI providers".
  - Distribution: public.
  - Licence: MIT.
  - Publisher identity: CodeJaDee.
  - Production-supported hosts: Claude Code CLI, OpenAI Codex CLI and GitHub
    Copilot CLI.
  - Automatic Skill routing: ≥ 85%, measured independently on each
    supported CLI.
  - Versions: target stable version `0.1.0`; release candidate
    `0.1.0-rc.1`.
  - Out of scope: Nitro and Elysia.
  - Accepted risks AR-01..AR-04:
    - AR-01: Response Style Policy host testing;
    - AR-02: VS Code extension and Copilot Chat testing;
    - AR-03: branch protection and required reviews;
    - AR-04: unrelated ADR closure and repository hygiene.
- **Not decided:**
  - **Security and support.** The owner answered "later". This approves no
    channel: not GitHub Issues, not private vulnerability reporting, not
    email, not any other method. No address or URL may be added until the
    owner decides.
  - **Tag format.** ADR-0008 `vX.Y.Z` is recommended over `claude plugin
    tag` names.
- **Effect on earlier records:**
  - The version values in D-058 are fixed (still not applied).
  - ISSUES Q-05 (licence) is resolved as MIT.
  - P1-005 (distribution and publisher) is decided.
  - Publication acts still each need explicit approval (BC-30, BC-31).
- **Details:**
  - [RELEASE_SCOPE_DECISION.md](../production/RELEASE_SCOPE_DECISION.md):
    scope, KEEP items, routing contract and licence rights check;
  - [RELEASE_GATE_MATRIX.md](../production/RELEASE_GATE_MATRIX.md): release
    gates G-01..G-17 (not the skill-quality gates with the same labels);
  - [ACCEPTED_RISKS.md](../production/ACCEPTED_RISKS.md).

### D-061 — Release `1.0.0` now

- **Status:** ACCEPTED (explicit owner instruction, 2026-10-18: release Chayen as
  stable `1.0.0`, make the repository public, and do not wait for provider
  verification). Amends D-060's version values and its routing condition for this
  release; supersedes D-058.
- **Decision:**
  - `version` is `1.0.0` in both manifests, the Copilot marketplace entry and its
    `metadata.version`; Git tag `v1.0.0` (ADR-0008 form). No GitHub Release, as
    the owner removed GitHub Releases from the process (`4bda4db`).
  - Licence MIT is applied: root `LICENSE`, `plugins/codejadee-chayen-framework/LICENSE.md`
    (the V-25 package gate admits only Markdown and the two manifests) and
    `"license": "MIT"` in both manifests. Copyright holder: CodeJaDee.
  - The repository was made public on 2026-10-18, after a pattern scan of the full
    Git history for credentials found none.
- **Accepted by the owner at release:** the Phase 6
  [final readiness](../production/FINAL_RELEASE_READINESS.md) NO-GO items stay
  open, including no automatic routing measurement on any CLI, blocked Copilot CLI
  lifecycle and Claude disabled-loading. Compatibility claims stay as recorded;
  nothing is promoted to verified by this decision.
- **Unchanged from D-060:** Security and Support remain LATER; no contact or
  channel is added.

### D-062 — Project knowledge initialization Skill (`chayen-init`)

- **Status:** ACCEPTED (explicit owner instruction, 2026-10-19: "อยากทำ skill
  init อะ หากมีข้อจำกัดเรื่องจำนวนสกิลก็ขยายไปได้เลย" — build an init Skill and
  raise the Skill ceiling if needed), after an architecture review of a larger
  `/init` proposal in the same session. Full record:
  [ADR-0012](ADRS/ADR-0012-project-knowledge-initialization.md).
- **Decision:**
  - New Entry Skill `chayen-init`: on explicit request, writes `.chayen/`
    `profile.md`, `conventions.md`, team-owned `rules.md` and per-unit files
    after a preview and approval, and offers an opt-in marked pointer block in
    the repository's agent instruction files (ADR-0010 mechanism B).
  - New registration category `catalog/project-skills.json` (allow-list
    `chayen-init`), validated like the editorial registry. The 206-capability
    Engineering Catalog is unchanged.
  - Entry Skill ceiling 15 → 16 and L0 budget 6,500 → 7,000 characters in
    `tools/catalog/skill-registration.mjs`. Actual L0 6,563.
  - V-10 allows the `.chayen` path in shipped content; other self-references
    stay rejected (PT-08 amended for the path only).
- **Not decided:** the version number. The build stays `1.0.0`; a release that
  contains `chayen-init` needs its own owner decision (D-058 pattern).
- **Evidence:** static gates only; routing, behaviour and host loading of the
  pointer block are NOT_RUN. RC qualification pins in
  `tests/provider-compatibility/qualify-rc.test.mjs` were updated to the new
  package (16 Skills, 263 files); recorded 1.0.0 RC evidence stays historical.

### D-063 — Version `1.1.0`

- **Status:** ACCEPTED (explicit owner instruction, 2026-10-19: "ทำการเปลี่ยน
  version เลย", after being told that version-pinned `1.0.0` installs do not
  receive `chayen-init` without a version change).
- **Decision:** `version` is `1.1.0` in both manifests, the Copilot marketplace
  entry and its `metadata.version`. Minor bump: one added Skill, no removed or
  renamed Skill, no breaking change. `CHANGELOG.md` moves the D-062 entries to
  `[1.1.0] - 2026-10-19`. `SECURITY.md` supports `1.1.x`.
- **Not done:** commit, Git tag `v1.1.0`, push. Host installation and update
  from `1.0.0` are NOT_RUN.

### D-064 — Release `1.1.1`

- **Status:** ACCEPTED (explicit maintainer instruction, 2026-10-20: release the
  acceptance-evidence and ambiguous-request guidance as `1.1.1`).
- **Decision:**
  - `version` is `1.1.1` in both manifests, the Copilot marketplace entry and its
    `metadata.version`. Patch bump on top of `1.1.0` (D-063): guidance text
    only, no added, removed or renamed Skill. Git tags remain optional; no GitHub
    Release.
  - Content: guidance text in `chayen-implementation` (SKILL.md, task contract
    template, change summary), `chayen-backend`, `chayen-frontend`,
    `chayen-data` and `chayen-testing`. Skill names, descriptions and L0
    metadata are unchanged; no package file is added or removed.
- **Evidence at release:** `validate-all.mjs` passed every gate offline
  (Node.js 26.8.1). Agent behaviour with the new guidance, native install and
  update of `1.1.1`, and routing remain NOT_RUN. The open items accepted under
  D-061 and the NOT_RUN items of D-062 stay open.

### D-065 — Release `1.1.2`

- **Status:** ACCEPTED (explicit maintainer instruction, 2026-10-20: apply the
  recommended project-map, real-schema and failure-to-fix follow-ups as
  `1.1.2`).
- **Decision:**
  - `version` is `1.1.2` in both manifests, the Copilot marketplace entry and its
    `metadata.version`. Patch bump: guidance text only, no added, removed or
    renamed Skill. Git tags remain optional; no GitHub Release.
  - The implementation, backend, frontend, data and testing Skills list
    `.chayen/profile.md` and `.chayen/rules.md` under Discover, as a map
    confirmed against the source. This amends ADR-0012 decision 5, which
    relied on the opt-in pointer block alone; it adds no always-on content.
  - `chayen-data` adds a "Use the real schema" principle: names come from
    migrations, the data model or the catalog, never a guess, and existing
    scripts are preferred over new one-off scripts.
  - `docs/CONTRIBUTING.md` describes how an observed agent failure becomes a
    case in `tests/skills/` and the smallest guidance fix.
  - Five recipe cases (445 → 450) cover the `1.1.1` and `1.1.2` guidance.
- **Evidence at release:** offline validators only. The new recipe cases,
  agent behaviour, routing, and native install and update of `1.1.2` are
  NOT_RUN.

### D-066 — Extensible Skill governance replaces repository numeric caps

- **Status:** ACCEPTED (explicit owner instruction, 2026-10-22, evolution
  program STEP 02: "Formally change Chayen's architecture policy so future
  capability and Skill growth is not blocked by arbitrary repository-level
  numeric limits"). Full record:
  [ADR-0013](ADRS/ADR-0013-extensible-skill-governance.md).
- **Decision:**
  - Remove, as failure conditions, the repository's own caps: the Entry
    Skill maximum (16), the fixed `SKILL.md` and reference line maximums
    (300, plus the 200-line target), the 2-hop link-depth limit, the
    7,000-character L0 failure threshold, and the fixed registration
    allow-lists (`PROJECT_NAMES`, exactly two editorial records).
  - Replace them with measurement and reporting: counts by category, L0
    characters and estimated tokens, per-Skill and per-reference size, link
    depth, and a growth-evidence rule for changes that add Skills or raise L0.
  - Keep every provider constraint. Hard ones stay errors: name ≤64
    characters and equal to the directory, description ≤1,024 characters,
    portable frontmatter and packaging. Provider recommendations and capacity
    behaviours are reported against their documented figure: `SKILL.md`
    under 500 lines or about 5,000 tokens; references one level deep through
    RF-02; Claude Code listing budget 1% of context; Codex 2% or 8,000
    characters. A release above a documented listing figure, or one that adds
    Skills, needs routing evidence on that provider.
  - Keep every security, identity, schema-integrity and supply-chain rule,
    the package profile (ADR-0005), discoverability and progressive
    disclosure, distinctness and trigger coverage, and the 206-capability
    inventory.
  - Registration becomes extensible: records are admitted by closed schema,
    name and description rules, cross-registry uniqueness and file parity.
    The two Humanizer language contracts stay. A new category needs its own
    decision; no count is involved.
- **Step 04 amendment (owner instruction, 2026-10-22):** references may be
  discovered transitively instead of each being linked directly from
  `SKILL.md`. Orphans still fail. Transitive-only references and link cycles
  are reported as warnings, because providers recommend one level deep (S24)
  and a reachable file is not guaranteed to be read. This replaces the "one
  level deep through RF-02" item above.
- **Removing a cap does not mean unlimited provider capacity.** Listing
  budgets still drop, shorten or omit descriptions on overflow (S7, S12).
- **Supersedes:** ADR-0004 decision 4; the count and L0 components of D-051,
  D-052, D-053 and D-062 item 7; ADR-0012 decision 6's allow-list. The other
  parts of those records are unchanged, and their text is not edited.
- **Implementation:** evolution Steps 03 (count, registration), 04 (lines,
  depth), 05 (metadata) and 06 (regression tests), per
  [MIGRATION_MATRIX.md](evolution/MIGRATION_MATRIX.md). Step 03 IMPLEMENTED
  (2026-10-22): no count cap, no name allow-lists, validated registration.
  Step 04 IMPLEMENTED (2026-10-22): no size or depth cap; size report and
  advisory warnings; iterative, cycle-safe reference graph. Step 05
  IMPLEMENTED (2026-10-22): no L0 cap; discovery metrics
  (`tools/catalog/discovery-metrics.mjs`) with estimated tokens, per-skill
  contributions, expensive descriptions, collision risk and documented
  provider figures (UNKNOWN or NOT_MEASURED where not reliable); release
  rule P-L in the release checklist.
- **Not changed:** validators, tests, Skills, manifests, version.
- **Evidence:** documentation only; `validate-all.mjs` re-run after the
  documentation changes (see evolution STEP_LOG, Step 02).

### D-067 — Lightweight change-impact map in project knowledge

- **Status:** ACCEPTED (explicit owner instruction, 2026-10-22, evolution
  program STEP 10: "Make existing repository knowledge more useful for future
  coding tasks without adding a mandatory Knowledge Graph database or MCP
  service").
- **Decision:**
  - Extend `.chayen/` (ADR-0012), not a new memory system. Unit files gain
    map sections: boundary and dependencies, entry points, API ownership and
    consumers, data and migrations, tests, generated code, dynamic references.
    A single-unit repository keeps them in `profile.md`.
  - Every entry cites `path:line` or is `unknown`. A consumer without
    evidence is `unknown`, never "none"; "none found" for dynamic references
    names the terms searched.
  - Evidence adds folder tree ids (`git rev-parse HEAD:<folder>`). Schema
    stays `project-knowledge/1`; the sections are additive and are added by
    the next approved refresh.
  - Readers start from the owning unit file only, run a read-only staleness
    check (`git diff --name-only <generated_commit> HEAD -- <paths>`,
    `git status --porcelain`, tree ids), use the map as leads for targeted
    searches, confirm facts in the source (the source wins), and never treat
    a missing entry as proof of absence. Refresh happens only on request,
    through the existing preview and approval.
  - Unit-file budget 120 → 150 lines, equal to `profile.md`. `rules.md`,
    conventions and instruction files keep their existing protections.
- **Not changed:** skill descriptions and routing metadata, the `chayen-init`
  lifecycle and modes, the schema identifier, the 206-capability catalog.
- **Evidence:** static validators, recipe cases (specifications), and
  executable git mechanics on a disposable monorepo
  (`tests/skills/project-map.test.mjs`). Agent behaviour is NOT_RUN. Shipped
  guidance changed without a version bump.

### D-068 — Opt-in failure reproduction records

- **Status:** ACCEPTED (explicit owner instruction, 2026-10-22, evolution
  program STEP 11: "Extend the existing Chayen contribution workflow so
  observed Agent failures can become reproducible regression cases").
- **Decision:**
  - Failure records (`chayen-failure-case/1`) in `tests/failures/`.
    Developer-only, never shipped. The format is specified in
    [FAILURE_REPRODUCTION.md](FAILURE_REPRODUCTION.md).
  - The existing CONTRIBUTING process stays: the recipe or trigger case in
    `tests/skills/` is the behavioural regression specification. The record
    references it and adds a fixture with checkable facts, a failing and a
    control transcript, and a detector.
  - `tools/evals/failure-cases.mjs` validates the records, replays recorded
    transcripts offline through the Phase 5 parser, redacts transcripts
    (new file only) and scores a supplied transcript. It calls no provider,
    makes no network connection, starts no process and executes nothing from
    a record or transcript.
  - Records are synthetic, or observed with explicit opt-in consent and
    reviewed redaction. Secret patterns (shared with V-25.2 through
    `tools/validate/secret-patterns.mjs`), credential URLs, local paths and
    non-example emails are rejected. Scripts are not accepted as artifacts.
  - Replay outcomes: REPRODUCED, NOT_REPRODUCED, FIXED_AND_VERIFIED, NOT_RUN,
    INCONCLUSIVE. The verification status is derived from authorized live
    replays only, and changed guidance text never changes it.
- **Not changed:** the plugin package, Skill guidance, routing metadata, the
  recipe and trigger cases, the Phase 5 harness and its live-run gates.
- **Evidence:** three synthetic cases (invented column, missed API consumer,
  untested criterion marked DONE) validate and discriminate offline. G-20 and
  G-20T are in `validate-all.mjs`. Model behaviour is NOT_RUN.

### D-069 — Governed mentor-to-fast-agent knowledge distillation

- **Status:** ACCEPTED (explicit owner instruction, 2026-10-22, evolution
  program STEP 12: "Build a governed workflow where a capable Mentor Agent
  analyzes verified failures and produces small, reusable guidance
  improvements for faster coding Agents").
- **Decision:**
  - Distillation happens at the prompt and process level, through a
    developer-only workflow with six stages: collect, diagnose, distill,
    review, validate, promote
    ([KNOWLEDGE_DISTILLATION.md](KNOWLEDGE_DISTILLATION.md)). The Mentor is a
    maintainer's opt-in session following
    [MENTOR_BRIEF.md](MENTOR_BRIEF.md). No Mentor ships in the plugin and no
    service runs.
  - Proposals (`chayen-distillation-proposal/1`) in
    `tests/distillation/proposals/` reference one Step 11 failure case. Each
    root cause limits the actions allowed, and every root cause allows a
    non-Skill action. Proposals change existing files only, so a new Entry
    Skill is impossible.
  - `tools/evals/distill.mjs` derives the decision:
    - routing impact is computed from the diff;
    - the diff is applied only to a disposable copy;
    - the fixed offline validators run there, after a check that they are
      byte-identical to the reviewed scripts;
    - a person other than the Mentor must review;
    - guidance changes are promoted only when authorized live runs show the
      baseline reproducing the failure and no candidate run reproducing it
      (≥ 3 runs per arm, one provider and model);
    - promotion keeps the previous version recoverable and the failure
      evidence in place.
- **Not changed:** the plugin package, Skill guidance, routing metadata,
  recipe and trigger cases. Proposals are not applied.
- **Evidence:** four proposals from the three synthetic failures (one
  minimal Recipe change, one regression case, one limitation held for
  evidence, one returned demonstration). G-21 and G-21T are in
  `validate-all.mjs`. Mentor diagnosis quality and live improvement are
  NOT_RUN.

### D-070 — Independent acceptance evidence audit

- **Status:** ACCEPTED (explicit owner instruction, 2026-10-22, evolution
  program STEP 13: "Strengthen Chayen's existing Evidence Audit so completion
  claims can be independently verified").
- **Decision:**
  - Extend the evidence audit (CAP-18-003) in
    `chayen-implementation/references/change-summary.md`; add no competing
    process. The implementing agent and an independent reviewer are separate
    roles. The implementer's conclusions are claims, never evidence, and
    the reviewer is a person or a session that did not make the change. A
    same-session audit records that as a limitation.
  - The audit rules:
    - a test file is not a test run;
    - a claimed PASS needs a recorded run;
    - evidence older than the last relevant change is stale;
    - interactive UI needs a behavioural check where feasible;
    - access control needs its denied paths;
    - a contradicted quoted result is unsupported and possibly fabricated;
    - a cited but unrecorded run is no evidence;
    - quoted output is redacted;
    - an audit is no security guarantee.
  - One review per criterion, with eight fields: criterion, claim, evidence
    source, independent method, observed outcome, confidence limitation,
    verdict (accept, verify_more, revise) and next action. The claim-level
    verdicts (supported, unsupported, not re-runnable) stay as they were.
  - Templates gain an optional `Independent review` line; no field is
    removed. `chayen-testing` adds "or from the existence of a test file" to
    its PASSED rule.
  - GI-10 (`independent-evidence-audit`) guards the anchors. GI-03 gains a
    predicate-only rule for "a criterion with no test may be accepted" (the
    Step 12 finding).
  - Developer-only contract for automated graders:
    [INDEPENDENT_AUDIT_CONTRACT.md](INDEPENDENT_AUDIT_CONTRACT.md),
    `tools/evals/audit-evidence.mjs`, `tests/audit/`.
- **Not changed:** Skill descriptions and routing metadata, the
  206-capability inventory, the verdict and status vocabularies, and the
  existing template fields.
- **Evidence:** 8 synthetic cases give the expected verdicts; G-22 and
  G-22T; G-18T 29/29. Agent behaviour NOT_RUN. Shipped guidance changed
  without a version bump.

### D-071 — Explicit evaluation candidates

- **Status:** ACCEPTED (explicit owner instruction, 2026-10-22, evolution
  program STEP 14: "Allow Chayen evaluation tools to work with explicitly
  selected current or future builds instead of relying on an old hardcoded
  release candidate").
- **Decision:**
  - The Phase 5 runner has no default candidate. Live runs and preflight
    need `--candidate <file>`, and so does scoring of results that carry a
    candidate ID. The historical 0.1.0-rc.1 file
    `results/2026-10-18-phase5/candidate.json` is read unchanged as one
    selectable candidate.
  - `tests/evaluation/phase5/candidate.mjs prepare` writes a deterministic
    `chayen-eval-candidate/1` manifest. It reads files and runs read-only
    `git rev-parse`, `git status` and `git diff`; it never commits, tags,
    releases or pushes, and never starts a provider CLI. The manifest
    records:
    - the source commit, the working-tree state and the uncommitted paths;
    - the manifest versions and the marketplace descriptors;
    - the package fingerprints, both raw bytes and LF-normalised;
    - the Skill metadata fingerprint and the Entry Skill inventory;
    - the specification and fixture fingerprints;
    - the provider configurations.
  - A dirty tree gives an `UNCOMMITTED_SNAPSHOT`, which is not a
    release-qualified commit. It is written outside the repository, live
    runs need `--allow-uncommitted-candidate`, and the label is in every
    record.
  - Preflight refuses:
    - a candidate that does not describe the checkout;
    - a plugin home without exactly one matching package (fingerprint,
      version and metadata);
    - a baseline home with any package.
  - Scoring rejects results from another candidate, specification,
    metadata or package. The candidate ID joins the pooling key.
  - Provider calls stay behind `--allow-provider-calls`, `--authorization`
    and `--max-calls`, and are unchanged.
- **Not changed:** historical candidate and result files, the specifications
  and fixture, the plugin package, parsers and classifiers.
- **Evidence:** `candidate.test.mjs` (G-23) 12/12, nine control mutations
  caught, and the historical fingerprints recomputed from git history. No
  candidate is committed yet: the current tree is uncommitted.

### D-072 — Reproducible real-coding evaluation fixtures

- **Status:** ACCEPTED (explicit owner instruction, 2026-10-22, evolution
  program STEP 15: "Build deterministic, realistic software engineering
  tasks for comparing coding agents with and without Chayen").
- **Decision:**
  - Six developer-only tasks live in `tests/evaluation/coding/tasks/`:
    - A: backend bug fix;
    - B: cross-layer CSV export;
    - C: Angular interaction;
    - D: SQL Server schema correctness;
    - E: ambiguous scope;
    - F: evidence completion.
  - Each task has a `task.json` (`chayen-coding-task/1`): prompt, stack and
    versions, the repository's commands, scope globs, acceptance criteria
    with their oracles, grading checks, negative checks, expected outcomes
    and reset instructions.
  - Each task also has:
    - `repo/`, the only part given to an agent;
    - evaluator-only `grader/`, a `reference/` solution;
    - at least two `negatives/` (known-bad outputs the grader must reject).
  - `run-coding-fixtures.mjs` grades a copy of a workspace and never the
    workspace itself. `--verify` proves that each initial state and every
    negative fails and each reference passes.
  - .NET restores use only the local NuGet cache. Task D runs on LocalDB
    only and drops its `ChayenCoding_<guid>` databases.
  - A missing toolchain is NOT_RUN with the exact dependency; nothing is
    installed and no network source is used.
  - Static frontend checks are labelled weak. NOT_RUN never counts as a
    pass.
- **Stacks:** .NET 10, ASP.NET Core 10 and SQL Server (LocalDB) run here.
  Angular 19.2 sources are present, but their component specs are NOT_RUN
  without `node_modules`. PostgreSQL has no fixture, because there is no
  local server.
- **Not changed:** the plugin, Skill guidance, the existing
  `tests/evaluation/fixture` and the Phase 5 specifications.
- **Evidence:** `--verify` 28/28 runs as expected
  (`tests/evaluation/coding/results/2026-10-22-verify.json`); G-24 and
  G-24T.

### D-073 — Isolated real-coding agent runner

- **Status:** ACCEPTED (explicit owner instruction, 2026-10-22, evolution
  program STEP 16: "Extend Chayen's developer-only evaluation tooling to
  measure actual code editing and verification, not just read-only Skill
  routing").
- **Decision:**
  - A separate developer-only runner,
    `tests/evaluation/coding/run-coding.mjs`, with its library
    `coding-runner-lib.mjs`. `run-phase5.mjs` stays read-only and unchanged.
  - **Isolation:** write-capable runs happen only inside a container that
    passes a boundary probe:
    - the image is pinned by digest and never pulled;
    - non-root user, read-only root, no capabilities, `no-new-privileges`;
    - only the disposable workspace, the isolated provider home and the
      declared read-only mounts are mounted;
    - no engine socket and no credential-like environment variables;
    - egress to a declared destination fails.
  - **When the boundary is not verified:** the runner exits 3 with BLOCKED.
    There is no fallback to the developer workspace, and a provider
    permission flag never counts as a sandbox.
  - **Provider permissions:** native mechanisms only (Claude Code
    `dontAsk` with tool allowlists, Codex `workspace-write` without network,
    Copilot `--allow-tool` and `--deny-tool` lists). Bypass and widening
    flags are refused in code.
  - **Selections:** each run selects provider, exact model (aliases
    refused), candidate (Step 14 manifest), task (Step 15 fixture) and arm
    (`baseline` without Chayen, `chayen` with exactly the candidate's
    package).
  - **Gates before anything is sent:** `--allow-provider-calls`,
    `--allow-coding-writes`, `--authorization`, `--max-calls`, USD caps for
    Claude, a fresh `--out` outside the repository, and an isolated
    signed-in home. Authentication files are never copied.
  - **Workspaces:** each run gets a fresh git copy of `repo/` with a fixed
    commit id and no remote, plus a canary that detects writes outside it.
  - **Records:** a closed `chayen-coding-record/1` format with Skill
    activation evidence, tool and command traces, diff, verification
    re-run inside the boundary, duration, usage, cost, and security and
    completion classes. Output is redacted.
  - **Scoring:** deterministic, so a re-score must reproduce `summary.json`.
    Arms compare only under identical configurations.
  - **Tests:** a fake provider and a fake engine exist for tests only, and
    are refused for real providers.
- **Not changed:** the plugin, Skill guidance, the Phase 5 runner and
  specifications, and the Step 15 tasks and grader.
- **Status of live runs:** NOT_RUN. On this host no Linux container engine
  is reachable, so `--inspect-host` reports BLOCKED. Live runs need the
  owner's authorization, budget caps, a prepared image and network, and
  signed-in isolated homes.
- **Evidence:** G-25T (`tests/evaluation/coding/coding-runner.test.mjs`);
  STEP_LOG Step 16.

### D-074 — Independent coding grading and rework metrics

- **Status:** ACCEPTED (explicit owner instruction, 2026-10-22, evolution
  program STEP 17: "Quantify whether Chayen reduces Agent execution cost,
  human review effort, and rework").
- **Decision:**
  - A developer-only grader, `tests/evaluation/coding/grade-coding.mjs`,
    with `grading-lib.mjs` (pure derivation, statistics and report) and
    `rubric.json` (`chayen-coding-rubric/1`).
  - **Deterministic graders first.** These are the task's own Step 15
    checks (hidden tests, boundary, regression detection, answer checks),
    executed on a staged copy of each preserved workspace, together with
    the Step 16 diff, verification and security records. Real provider runs
    are graded only inside a container whose boundary verifies; otherwise
    the grader exits 3 with BLOCKED. Fake-provider runs on the runner
    fixture may be graded on the host.
  - **Reuse of the Step 13 contract:** each run becomes a
    `chayen-audit-case/1` and is reviewed by `auditCase`. The agent's answer
    is only a claim. The contract gains a `process` kind for deterministic
    contract checks (adequate level `deterministic-check`); the existing
    kinds and cases are unchanged.
  - **Metrics:**
    - correctness: criteria passed, build and test, functional, scope,
      unverified claims, first pass;
    - rework: failed attempts, revisions, verification and revision
      cycles, evidence gaps;
    - efficiency: time, tokens, tools, search and read, cost;
    - human involvement: only from a named reviewer's
      `chayen-human-review/1` log. Review time comes from its start and end
      times and never from agent traces.
  - **LLM grades** (`chayen-llm-grade/1`) are accepted only for rubric items
    marked `llmAllowed`. They are listed separately and change no verdict.
  - **Comparison:** A (a fast agent without Chayen), B (the same agent
    configuration with Chayen; checked identical but for the arm) and C (a
    mentor-class agent with Chayen; the same task, snapshot and
    environment). Results are never pooled across provider or model
    configurations.
  - **Statistics:** Wilson intervals for rates and Newcombe intervals for
    differences. Statuses: `NOT_MEASURED` (synthetic or fake data),
    `INSUFFICIENT_SAMPLE` (below 5 runs), `INCONCLUSIVE` and
    `DIFFERENCE_OBSERVED` (an association, not proof of cause).
  - **Report:** deterministic `report.json` and `report.md`, with the
    baseline, Chayen-enabled results, differences, uncertainty, failure
    categories, trade-offs and next experiments.
  - **Supporting changes to earlier steps (additive):**
    - Step 15 grader: `--grade --json`, and failed Node test names;
    - Step 16 runner: the metrics `verificationRevisionCycles` and
      `searchReadOperations`, a second fake model, per-run fake scenarios
      including `special-case`;
    - runner fixture: graded criteria and a hidden oracle.
- **Not changed:** the plugin, Skill guidance, the Step 15 task specifications
  and the read-only Phase 5 runner.
- **Status of live claims:** NOT_MEASURED. No real comparison run exists.
- **Evidence:** G-26 (self-test), G-26T; the synthetic example
  `tests/evaluation/coding/results/2026-10-22-step17-synthetic/`; STEP_LOG
  Step 17.

### D-075 — Routing, collision and context benchmark beyond 16 Skills

- **Status:** ACCEPTED (explicit owner instruction, 2026-10-23, evolution
  program STEP 18: "Ensure the removal of artificial Entry Skill and
  metadata limits does not silently degrade automatic Skill discovery").
- **Decision:**
  - A developer-only benchmark in `tests/evaluation/routing-context/`.
    - 21 synthetic Skills (`chayen-syn-*`) in four groups: distinct,
      adjacent, overlap and conflict.
    - Six scenarios of 16 to 34 Skills, each with an expected static
      outcome.
    - 74 routing cases with fixed expected outcomes: positive, regression,
      adjacent, overlap, conflict, no-match, unsupported, negative boundary,
      explicit and ambiguous; keyword and paraphrase prompts.
  - **Synthetic Skills never enter the production package.** Each scenario
    is built in a disposable copy outside the repository, and the real
    package, catalog and security validators run on it. `--build` writes an
    installable copy only outside the repository and installs nothing.
  - **Activation comes only from native provider events**, through the
    Phase 5 parsers. Answer text and repository files are never
    activation. The Phase 5 Skill-path patterns now accept digits, which
    the Skill name rule allows.
  - **No pooled accuracy.** Summaries are per provider, CLI version, model,
    metadata, specification, candidate, scenario and evidence level. The
    plugin and no-plugin arms may differ only by the installed package.
    `run-evaluation-suite.mjs` reports provider summaries per
    configuration instead of one pooled row.
  - **Context tax.** Static discovery metadata (characters and estimated
    tokens, per scenario and per Skill, with the documented provider
    figures). Per run: provider-reported tokens when available, an actual
    discovery overhead from the two arms, references, search and read
    calls, and duration.
  - The 85% automatic-routing objective (OWN-05) is unchanged, per
    supported CLI.
  - The BM25 lexical proxy moves unchanged to
    `tools/evals/lexical-proxy.mjs`. It stays SIMULATED and is never used
    for tuning.
- **Not changed:** the plugin, Skill guidance and descriptions, catalogs,
  Phase 5 probe sets and candidate format, and validator thresholds.
- **Status of live claims:** provider routing, no-match behaviour and
  provider token counts are NOT_RUN on every CLI. Live runs of synthetic
  scenarios need owner authorization for billed calls, isolated signed-in
  homes and an approved install of each synthetic test package.
- **Evidence:** G-27 (scorer self-test), G-27T; the static report in
  `tests/evaluation/routing-context/results/2026-10-23-static/`;
  [ROUTING_CONTEXT_REPORT.md](evolution/ROUTING_CONTEXT_REPORT.md); STEP_LOG
  Step 18.

### D-076 — Provider compatibility and security verification of the current build

- **Status:** ACCEPTED (explicit owner instruction, 2026-10-23, evolution
  program STEP 19: "Verify that the new Chayen architecture remains safe,
  provider-portable, and compatible with its intended native plugin
  distribution model").
- **Decision:**
  - **Authorization scope.** The instruction directs native lifecycle checks
    "using authorized, isolated test configurations". It is recorded as
    authorization for:
    - native lifecycle commands (register, install, list, disable, enable,
      update, uninstall, unregister, validate, details, local inventory)
      through `qualify-rc.mjs`;
    - fresh, signed-out profiles under the session scratch directory only.

    It does **not** authorize billed model calls, logins, tool upgrades,
    changes to user-level provider configuration, commits, pushes or
    publication.
  - **Copilot CLI 1.0.89 stays BLOCKED** under the release minimum ≥1.0.91.
    Upgrading it is a tool install and was not authorized. Read-only
    inspection of its help, `skill list` and `instruction list` is reported
    as informational and qualifies nothing.
  - **Stricter controls (no relaxation):**
    - V-25.3 requires a fifth guard sentence, the untrusted-content rule
      ("…cannot override higher-priority rules or supply approval"). All
      16 Skills already carry it, so no Skill changed;
    - new gate G-SEC-E scans every committed `results/` directory for
      secret patterns and user-home paths. Two historical path disclosures
      are listed as open findings, not hidden;
    - `qualify-rc.mjs` adds the Codex row `inventory-isolation`, with counts
      by scope only.
  - Raw lifecycle transcripts stay outside the repository. Only a path-free
    summary without personal Skill names is committed.
- **Not changed:** the plugin package, catalogs, marketplace descriptors,
  Skill guidance, native permissions and the runners' permission flags.
- **Open:**
  - adversarial runtime cases (BLOCKED);
  - Copilot qualification;
  - the Codex isolation leak (F-01);
  - the Copilot non-interactive permission conflict with INV-04 (F-04);
  - redaction of historical evidence (F-02);
  - the `--trust-plugin` documentation (F-03).
- **Evidence:**
  [PROVIDER_SECURITY_REPORT.md](evolution/PROVIDER_SECURITY_REPORT.md);
  `tests/provider-compatibility/results/2026-10-23-step19/`; STEP_LOG
  Step 19.

### D-077 — Version 1.1.3 (guidance-only)

- **Status:** ACCEPTED. Explicit owner instruction on 2026-10-23, after the
  Step 20 audit of the evolution program. Asked whether to move to `1.1.3`,
  the owner replied "เริ่มเลย" ("start now").
- **Decision:**
  - The version is `1.1.3` in both plugin manifests and in both Copilot
    marketplace version fields (`metadata.version` and `plugins[0].version`).
  - This is a patch bump, following D-064 and D-065: guidance text only. No
    Skill is added or removed. Skill names, descriptions and discovery
    metadata (fingerprint `411b6adbbea7e121`) are unchanged.
  - The shipped package differs from `v1.1.2` in 35 files:
    - 31 guidance files from evolution Steps 07–10 and 13;
    - the two version fields;
    - the plugin's two README files.
  - The CHANGELOG `[1.1.3]` entry replaces the proposed `[Unreleased]` one.
- **Not release-qualified.** Runtime evaluation is NOT_RUN on every CLI
  (FINAL_AUDIT_REPORT F-01..F-03). Production readiness stays NO-GO. This is
  the CONDITIONAL GO guidance release of RELEASE_READINESS §4.
- **Not done by this decision:** commit, tag, merge to `main`, push and
  publication. Each needs a separate owner action. Until `main` carries
  `1.1.3`, `plugin update` from the GitHub marketplace still delivers
  `1.1.2`.
- **Evidence:** `validate-all.mjs` and `run-evaluation-suite.mjs` on the
  bumped tree (STEP_LOG, post-program entry).

### D-078 — Direct project knowledge generation with a persisted run report

- **Status:** ACCEPTED (explicit owner instruction, 2026-10-25: improve
  `chayen-init` and write initialize and refresh output without a preview
  gate). Amends [ADR-0012](ADRS/ADR-0012-project-knowledge-initialization.md),
  superseding decision 3 and the preview wording in D-062 and D-067.
- **Decision:**
  - Write generated `.chayen/` content directly on initialize and refresh.
    Create missing `rules.md` with at most five open questions instead of
    stopping for facts the code cannot answer. Existing team rules still
    need approval of the exact diff.
  - Generate `.chayen/init-report.md` on every initialize and on every
    refresh that changes knowledge, with `schema: project-knowledge/1` and
    at most 120 lines. A refresh with no changes writes nothing, so the
    report adds no git churn.
    Record mode, date, commit, detected units and stacks, written or changed
    files, inspected and skipped paths with reasons, unknowns, evidence gaps,
    proposed improvements and follow-up. The pointer never requires reading
    it on every task. Proposals stay out of profile and conventions.
  - Keep approval for removal, unknown or newer schemas, hand-written text
    in generated files, unit selection above eight units, and no recognizable
    manifest. Ask once at the end for all pointer-block changes.
  - Add real excerpts (at most 20 lines, with `path:line`) and ordered,
    cited folder, naming and wiring steps for every evidenced change kind.
    Put recipes in conventions or the owning unit file. Keep the 150-line
    profile and unit budgets and the 200-line conventions budget; shorten
    excerpts and repeated prose to fit them. Ban filler and present-area
    stubs. Group evidenced single-unit areas under Backend, Frontend, Data
    and Testing.
  - Scan folders to depth 6 first. Read 3–10 complete files per category,
    within totals of 100 source, 20 test and 5 migration files per run.
    Put remaining work in the report; do not expand the scan.
  - Ask nothing before writing. Run inspected build and test commands only
    when the request asks for them (owner choice, 2026-10-25); record actual
    outcomes as `VERIFIED`, otherwise keep them `DISCOVERED`. Never deploy,
    migrate, publish or delete.
- **Rationale:** the owner asked for direct generation. Writes stay confined
  to `.chayen/` and approved pointer blocks, where git can review and revert
  them. The persisted report makes coverage and gaps reviewable after writing.
- **Verification:** update generated Claude cases and behavioral graders for
  initialize, refresh and monorepo pointers, plus a direct-write regression.
  Offline validators check package and case integrity; live agent behavior
  remains NOT_RUN until those evals run through a provider.
- **Unchanged:** Skill names, descriptions, frontmatter keys, routing
  metadata, engineering catalog and version `1.1.3`. No shipped hooks,
  scripts, commands or runtime. No commit, push, tag or release.

### D-079 — Version 1.1.4 (guidance-only)

- **Status:** ACCEPTED. Explicit owner instruction on 2026-10-25:
  "อัพเดทเวอร์ชั่นเป็น 1.1.4" ("update the version to 1.1.4").
- **Decision:**
  - The version is `1.1.4` in both plugin manifests and in both Copilot
    marketplace version fields (`metadata.version` and `plugins[0].version`).
  - This is a patch bump, following D-064, D-065 and D-077: guidance text
    only. No Skill is added or removed. Skill names, descriptions and
    discovery metadata are unchanged.
  - The shipped package differs from `1.1.3` in 11 files:
    - 7 `chayen-init` files from D-078, one of them new
      (`references/init-report-template.md`);
    - the two version fields;
    - the plugin's two README files.
  - The CHANGELOG `[1.1.4]` entry replaces the `[Unreleased]` one.
- **Not release-qualified.** Runtime evaluation is NOT_RUN on every CLI.
- **Not done by this decision:** commit, tag, merge to `main`, push and
  publication. Each needs a separate owner action. Until `main` carries
  `1.1.4`, `plugin update` from the GitHub marketplace still delivers the
  version on `main`.
- **Evidence:** `validate-all.mjs` on the bumped tree.

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
