# ADR-0004: Skill catalog versus entry skills

- **Status:** PROPOSED
- **Date:** 2026-10-14
- **Related:** D-006, REQ-05, REQ-06, C-03, C-04, C-05, C-07, R-03, R-11

## Context

Chayen must cover 206 capabilities in 20 domains (REQ-05). Every
discoverable skill costs metadata on every turn, and the providers' listing
budgets are small:

- **Claude Code:** 1% of the context window. On overflow, descriptions are
  dropped (S7).
- **Codex:** 2% of the context window, or 8,000 characters. Descriptions are
  shortened, and skills may be omitted (S12).

206 skills at about 300 characters each would need roughly 60,000
characters, which overflows every documented budget by far. Description loss
also degrades matching for the user's other skills.

## Decision

1. **Separate the catalog from the discovery surface.**
   - The **Engineering Capability Catalog** (C-03) is a developer-side JSON
     source of truth that lists all 206 capabilities. It is not shipped.
   - **Entry skills** (C-04) are the only discoverable objects. There are at
     most **14**, and they are organised by **task intent** (feature
     delivery, bug fix, review, database, …), not by capability and not by
     technology.
2. **Capability detail lives in knowledge files.** Each capability maps to
   exactly one entry skill plus one or more topic files in the technology
   packs or workflows (C-05, C-08). It is reached by progressive loading (C-07).
3. **Two-hop loading.** `SKILL.md` links to a pack `INDEX.md` or a workflow,
   which links to topic files.
   - This deliberately exceeds the Agent Skills "one level deep"
     recommendation (S24).
   - It keeps `SKILL.md` small while indexing 206 capabilities.
4. **The budget is enforced by a validator:**
   - L0 ≤4,000 characters (raised to 4,400 by D-034 in Step 14 to 4,700 by D-035 in Step 15, to 5,200 by D-036 in Step 16, and to 5,500 by D-037 in Step 17, with user approval);
   - ≤14 skills;
   - `SKILL.md` ≤300 lines;
   - ≤2 hops (V-06, V-07, V-08).

## Alternatives considered

| Alternative | Why not chosen |
|---|---|
| One skill per capability (206) | Overflows all listing budgets (S7, S12), with heavy per-turn cost and poor routing. |
| One skill per technology (~15) | Fits the budget, but most real prompts are task-shaped and span technologies (for example "add an endpoint and a page"). Kept as the **revisit option**. |
| One skill per domain (20) | 20 descriptions at ≥200 characters are about 4,000+ characters for names and descriptions alone, which is at the budget ceiling with no headroom. Domains are a catalog organisation concept, not a user-intent concept. |
| A single mega-skill | A catch-all that violates ADR-0003, with a huge L1. |

## Consequences

- The model must detect the stack itself, guided by the pack `INDEX.md`
  detection signals. This adds a step, but it is also what REQ-07 needs.
- Traceability from capability to content runs through the catalog, so
  validator V-11 is essential.

## Revisit trigger

If the Step 10 baseline shows that task-intent descriptions under-trigger for
stack-specific prompts (AS-01), switch the affected skills to stack-scoped
entry skills within the same ≤14 budget, through a new ADR. The same applies
if two hops prove unreliable (AS-04): flatten the primary stacks' topic links
into `SKILL.md`.

## Verification

- V-07, V-08, and V-11.
- Trigger and behaviour suites (C-13): positive recall per capability sample,
  and a reference-load check (the expected topic files were read).
