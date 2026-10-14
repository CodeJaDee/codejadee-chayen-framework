# ADR-0006: Provider portability strategy

- **Status:** ACCEPTED (Step 04: the user's prompt referred to "the approved
  packaging ADRs"). Verification items U-11 and U-13 are still open.
  - U-01 is partly resolved: Claude Code installs a package with both
    manifests (local test, Step 04).
- **Date:** 2026-10-14
- **Related:** D-005, D-009, MA-04, MA-05, REQ-10, C-01, C-02, PLUGIN_FORMAT_DECISION.md

## Context

The formats overlap substantially but are not identical:

- Codex, the Copilot CLI, and VS Code Copilot read the Agent Plugins 1.0 root
  `plugin.json` (S10, S15, S18).
- Claude Code documents `.claude-plugin/plugin.json` (S3), which Copilot and
  VS Code also read (S15, S18).
- Every provider implements the Agent Skills `SKILL.md` format (S7, S12, S17,
  S19, S24).

The provider-specific skill frontmatter extensions differ:

- Claude's `when_to_use`, `paths`, and similar (S7);
- Codex `agents/openai.yaml` (S12);
- VS Code `user-invocable` (S19).

## Decision

1. **One canonical plugin root** (`plugins/codejadee-chayen/`) holds one copy
   of every skill and knowledge file. There are no per-provider skill copies.
2. **The compatibility layer is limited to metadata files (C-02):**
   - the Agent Plugins root `plugin.json`;
   - `.claude-plugin/plugin.json`;
   - `.claude-plugin/marketplace.json`;
   - conditionally, `.agents/plugins/marketplace.json` (K-03).
3. **Content is written to the portable subset:**
   - Agent Skills standard frontmatter only (F-01);
   - provider-neutral wording (P-01): no provider tool names, and no
     provider-only variables such as `${CLAUDE_PLUGIN_ROOT}`;
   - plain relative Markdown links.
4. **Provider differences are handled by measurement, not branching.** If a
   provider behaves differently, the first response is to adjust the shared
   content so it works everywhere. Provider-specific divergence is a last
   resort, and needs a new ADR.
5. **Developer-side generation is allowed only under PLUGIN_PACKAGE_DESIGN
   §6.2:**
   - it must be deterministic;
   - its output is committed;
   - users need no runtime.

## Alternatives considered

| Alternative | Why not chosen |
|---|---|
| Separate plugin package per provider | Content drift, and triple maintenance (D-005). |
| Generate all provider packages from a source tree on every build | Adds a mandatory build step and generated duplicates when the formats already overlap. Kept only as the conditional fallback (§6.2). |
| Use provider-specific frontmatter for better triggering | Unknown-field behaviour is UNVERIFIED for Codex and Copilot (U-10). It breaks the single-source rule. |

## Consequences

- Some provider-only features are given up: Claude `paths` scoping, VS Code
  `user-invocable`, and Codex dependency declarations.
- The compatibility matrix (PROVIDER_COMPATIBILITY_MATRIX.md) becomes a living
  document that is re-validated on each release.

## Verification

- V-02..V-05 and V-10.
- Install and trigger suites per provider (Steps 06–08, 10).
- U-01, U-11, and U-13 resolved by install tests.
