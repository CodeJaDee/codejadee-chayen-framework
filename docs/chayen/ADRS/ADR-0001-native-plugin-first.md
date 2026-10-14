# ADR-0001: Native plugin-first

- **Status:** ACCEPTED (user-mandated: Step 01 vision, Step 03 MA-01)
- **Date:** 2026-10-14
- **Related:** D-002, REQ-01, EX-02, ADR-0005, ADR-0008

## Context

Chayen must reach Claude Code, OpenAI Codex, and GitHub Copilot. Each
provider now documents a native plugin mechanism with install, enable,
disable, update, and uninstall support:

- Claude Code (S1, S5)
- Codex CLI and the ChatGPT desktop app (S10, S13)
- Copilot CLI, VS Code, and the cloud agent (S14, S15, S18)

The alternatives were custom installers that copy files into provider
directories, a CLI, or an IDE extension. All of these add software that users
must trust and maintain, and the charter excludes them (EX-01..EX-05).

## Decision

1. Chayen is delivered **only** as a native plugin package, installed through
   each provider's own plugin and marketplace commands or UI.
2. On surfaces with no native plugin mechanism, Chayen doesn't invent one.
   - The Codex IDE extension is one such surface: "The IDE extension doesn't
     support plugins" (S13).
   - The fallback for these surfaces is a user decision (ISSUES Q-02). It may
     be documentation only, never an installer.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Installer script that copies skills into `~/.claude/skills`, `.agents/skills`, and similar | EX-02. It bypasses the providers' update, disable, and trust mechanisms. |
| VS Code extension that bundles the skills | EX-04. Wouldn't cover the CLIs. |
| Per-repository copy (`.github/skills/` and similar) | Not a plugin lifecycle. It's duplicated in every repo, and updates are manual. |

## Consequences

- **Positive:**
  - Users get the provider's own lifecycle, trust prompts, scopes, and
    organisation policy controls (S5, S15, S18).
  - There is no Chayen software to secure.
- **Negative:**
  - Surfaces without plugin support aren't covered (the Codex IDE extension).
  - Users depend on the providers' release cadence and format changes (R-01).

## Verification

Native install, update, disable, and uninstall on each supported surface,
with recorded commands and output. This is done in Steps 06–08 and tracked in
the ACCEPTANCE_MATRIX REQ-01 and PRV-* rows.
