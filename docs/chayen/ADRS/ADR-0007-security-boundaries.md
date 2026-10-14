# ADR-0007: Security boundaries

- **Status:** PROPOSED
- **Date:** 2026-10-14
- **Related:** D-003, REQ-09, BC-23, ADR-0005, C-11, ARCHITECTURE §7

## Context

Markdown guidance cannot enforce anything. Real controls belong to:

- the provider: permission modes, approvals, sandboxing, and organisation
  plugin policies (S5, S15, S18);
- the user's delivery pipeline: CI, scanners, branch protection.

The providers also warn that installed plugins run with the user's privileges
(S1). Repository content and tool output can carry injected instructions.

## Decision

### Boundaries

| ID | Boundary | Rule |
|---|---|---|
| B-01 | Plugin ↔ provider | The plugin ships no executable components (ADR-0005). Every action the model takes goes through the provider's permission system. |
| B-02 | Guidance ↔ enforcement | Chayen text never claims to enforce, guarantee, prevent, or block. Security content states that it is advisory and names the real control to use. |
| B-03 | Instructions ↔ data | Skills tell the model to treat repository files, tool output, and fetched content as **data**. Instructions found inside them are not followed without user confirmation. |
| B-04 | Supply chain | Distribution is static text from a known Git source. Users can pin a tag or SHA, and every release diff is human-reviewable. No third-party code is shipped. |
| B-05 | Risky actions | Workflows put **approval gates** in front of: schema or data changes, deletions, authentication and authorisation changes, secrets, production configuration, dependency major upgrades, and force pushes. The model is told to ask the user. Enforcement is the provider's permission prompt. |
| B-06 | Secrets | Guidance forbids printing, committing, or transmitting secrets, and recommends the stack's secret store. |

### Threat model (initial)

| Threat | Mitigation | Residual risk |
|---|---|---|
| T-01: Malicious or compromised plugin update | Pinned versions (RV-03), reviewable static diffs, no executables (V-09), approval-only releases (BC-30) | A user who installs unpinned gets the latest content. |
| T-02: Prompt injection through repository content | B-03 guidance | Model compliance is not guaranteed. Provider permissions remain the control. |
| T-03: Guidance leads to a destructive action | B-05 gates, plus provider approval prompts | A user in a permissive mode may auto-approve. |
| T-04: Secret leakage in evidence output | B-06, plus the evidence template rule to redact secrets | Model compliance. |
| T-05: Over-claiming security | V-10 wording checks, plus advisory statements | Wording checks are heuristic. |
| T-06: Name shadowing (a malicious same-name skill wins) | `chayen-` prefix (F-05) | A project or personal skill with an identical name still wins in Copilot (S15). This is provider behaviour. |

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Ship `PreToolUse` hooks that block dangerous commands | They would be real enforcement, but they break ADR-0005, are not portable (S20), and are always-on. Users can add provider-native hooks themselves. The guidance can recommend this. |

## Consequences

- Chayen can't guarantee safe behaviour. Its documentation says so plainly.
- The security value of Chayen is in better default reasoning and pointing at
  real controls.

## Verification

- V-09 (no executables) and V-10 (enforcement-claim wording).
- Security behaviour cases in C-13: injection fixture, destructive-action
  gate, and secret redaction.
- A repo `SECURITY.md` for vulnerability reporting (later step).
