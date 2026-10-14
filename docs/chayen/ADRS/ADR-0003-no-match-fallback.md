# ADR-0003: No-match fallback

- **Status:** PROPOSED
- **Date:** 2026-10-14
- **Related:** REQ-04, REQ-07, D-007, ADR-0002, C-06

## Context

When no Chayen skill applies, the agent must behave exactly as it would
without the plugin (REQ-04). This can go wrong in three ways:

1. **Always-on footprint:** content that loads even when nothing matches.
2. **False-positive activation:** a skill is selected for an unrelated
   prompt.
3. **Over-application:** a skill matched, but parts of it don't fit, such as
   an unsupported stack or a conflicting repo convention.

## Decision

1. **Zero always-on content.** The plugin ships no hooks, instruction files,
   agents, or MCP servers (ADR-0005). The only per-turn footprint is the
   entry-skill listing (L0, ≤4,700 characters since D-035), which providers add for every
   installed skill (S1, S7, S12).
2. **No catch-all skill.** No entry skill has a description like "use for
   any coding task".
3. **Boundary clauses in descriptions.** Every description includes
   "Not for …" (SK-03).
4. **In-skill applicability gate** (C-06 L-B). If the gate fails, the model
   stops following the skill, continues natively, and does **not** mention
   Chayen or the skill.
5. **Partial match** (C-06 L-C). The model applies only the relevant parts.
   For a stack without a pack, it uses generic, convention-first guidance and
   never imposes another stack's patterns.
6. **Precedence order** (C-06): user instructions, then repository
   instruction files, then observed repository conventions, then Chayen, then
   general knowledge.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| A "router" entry skill that always loads and dispatches | Becomes a catch-all with a high false-positive rate, and adds L1 cost to most turns. |
| Rely on descriptions only, with no in-skill gate | No defence after a false-positive match. |

## Consequences

- The L0 listing is an unavoidable cost of being installed. That is why the
  budget is kept small (ARCHITECTURE §8). It is visible to users through
  provider tools such as `claude plugin details` (S5).
- The gate is advisory text that the model may not follow perfectly (AS-02).
  Its effectiveness is measured, not claimed.

## Verification

- **Negative trigger suite:** unrelated prompts, expecting no Chayen skill
  (Claude: `tool_used` grader with `min: 0`, `max: 0`, `arm: both`, S8).
- **Gate suite:** prompts that match a description but fall outside the gate.
  The expected result is native-style output with no Chayen mention.
- **Convention-conflict suite:** fixture repositories with non-default
  conventions. The expected result is that the repository's conventions are
  preserved.
- **V-09:** no always-on components in the plugin.
