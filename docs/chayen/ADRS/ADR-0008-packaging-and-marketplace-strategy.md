# ADR-0008: Packaging and marketplace strategy

- **Status:** ACCEPTED, as amended by D-013 (Step 04). Verification items U-04,
  U-11, and U-13 are still open.
- **Date:** 2026-10-14
- **Related:** D-009, K-01..K-04, RV-01..RV-05, C-14, PLUGIN_PACKAGE_DESIGN.md §1, §3, §6, §8, §9

## Context

There is a shared marketplace file that several providers read:

- Claude Code reads `.claude-plugin/marketplace.json` (S4).
- The Copilot CLI reads it as one of four locations (S15).
- Codex reads it as "legacy-compatible" (S10).

Agent Plugins defines no marketplace (S20). Relative-path sources let a
single Git repository act as both marketplace and plugin host (S4, S15).

## Decision

1. **The repository is the marketplace.** It holds
   `.claude-plugin/marketplace.json`, with one entry, `codejadee-chayen`,
   whose source is `./plugins/codejadee-chayen`.
2. **No build step by default.** The committed plugin directory is the
   artifact (PLUGIN_PACKAGE_DESIGN §6.1).
3. **Conditional artifacts only when verification forces them**
   (PLUGIN_PACKAGE_DESIGN §6.2). Each needs its own decision:
   - a native Codex marketplace file (if U-02 fails);
   - vendored knowledge (if U-11 or U-13 fails);
   - dropping the root manifest (if U-01 fails).
4. **Releases:**
   - semver in both manifests;
   - `CHANGELOG.md`;
   - a `vX.Y.Z` tag;
   - users can pin `owner/repo#vX.Y.Z` (RV-01..RV-03).
5. **Channel:** a single stable channel on the default branch, plus tags.
   Additional channels (for example `next`) need a new decision.
6. **External listings** need explicit user approval for each act (K-04,
   BC-31). These are the Anthropic directory, `awesome-copilot` or
   `copilot-plugins`, and OpenAI submission.
7. **Repository hygiene** (RH-01..RH-04) prevents providers from treating the
   repo root itself as a plugin.

## Alternatives considered

| Alternative | Why not chosen |
|---|---|
| Separate marketplace repository | An extra repo to keep in sync. Can be adopted later without changing the plugin. |
| npm or archive distribution | Supported by Claude Code (S4), but not uniformly across providers (S15 lists relative-path and GitHub sources). It also adds a publishing pipeline. |
| Per-provider marketplace files from the start | Speculative. Added only when a verification shows it is needed. |

## Consequences

- Users on providers whose third-party auto-update is off (Claude Code, S5)
  must update manually. Release notes include the update commands.
- Generated artifacts, if they are ever triggered, are committed. This keeps
  installs build-free, at the cost of duplicate files in Git (checked by
  V-15).

## Amendment (Step 04, D-013)

Decision item 3's "native Codex marketplace file" is no longer conditional.
The repository now ships one native marketplace file per provider, all
pointing at the same plugin directory:

- `.claude-plugin/marketplace.json` (Claude Code)
- `.github/plugin/marketplace.json` (Copilot, which reads it before
  `.claude-plugin/`, observed in Step 04)
- `.agents/plugins/marketplace.json` (Codex, which prefers it when present,
  observed in Step 04)

The plugin identifier is `codejadee-chayen-framework` (D-014).
**Amended by D-059 (2026-10-17):** the plugin identifier is now `chayen`; the repository name and the directory `plugins/codejadee-chayen-framework/` are unchanged.

## Verification

- V-01, V-04, V-13, V-14, and X-01 (`claude plugin validate`).
- Install from the marketplace on each surface (Steps 06–08).
- Pinned-version install test (`#vX.Y.Z`) once the first tag exists, with
  approval.
