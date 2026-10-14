# ADR-0002: Native skill discovery

- **Status:** ACCEPTED (user-mandated: MA-02, MA-06). Behaviour on individual
  surfaces still needs verification (U-05, U-06).
- **Date:** 2026-10-14
- **Related:** REQ-02, REQ-03, ADR-0003, ADR-0004, C-04, C-06

## Context

Users must get Chayen guidance from ordinary prompts, without saying
"Chayen" (REQ-02, REQ-03). Every target provider already selects skills on
its own from each skill's `name` and `description`:

- Claude Code (S7)
- Codex: "Implicit … invocation" (S12)
- Copilot CLI: "Copilot will decide when to use your skills based on your
  prompt and the skill's description" (S17)
- VS Code (S19)

Selection is probabilistic. VS Code "does not guarantee that it invokes a
skill for every relevant prompt" (S19).

## Decision

1. Chayen relies **only** on native description-based discovery. There is no
   router hook, no always-on instruction file, no MCP "router" tool, and no
   slash command required for activation.
2. Entry-skill descriptions are written for matching:
   - the key intent comes first;
   - they name the stack and artefact terms users actually type;
   - they carry an explicit "Not for …" boundary;
   - they stay within the C-04 budget.
3. Implicit invocation stays at the provider default:
   - no `disable-model-invocation`;
   - no Codex `allow_implicit_invocation: false`.
4. Trigger quality is **measured**, not assumed. C-13 runs positive,
   negative, and no-invocation suites per provider, and the results are
   recorded as hit and false-positive rates.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Session-start hook that injects routing instructions | Always-on context breaks REQ-04 and adds hooks, which MA-08 and ADR-0005 exclude. Not portable either: Agent Plugins v1 has no hooks (S20). |
| Explicit `/chayen` command | Contradicts REQ-03. |
| MCP router tool | Unnecessary service (MA-08, EX-07). |

## Consequences

- Activation reliability depends on description quality and the provider's
  model. It can drift when a provider changes models (R-02), so the regression
  suite re-runs on each release.
- There may be false negatives on some prompts. That is acceptable: the user
  still gets native behaviour, never a broken experience.

## Verification

- The C-13 positive, negative, and no-invocation suites (Step 10).
- Auto-invocation of plugin-bundled skills on Copilot CLI and VS Code (U-05,
  Steps 08 and 10).
