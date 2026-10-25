# ADR-0004: Skill catalog versus entry skills

- **Status:** PROPOSED
- **Date:** 2026-10-14
- **Related:** D-006, REQ-05, REQ-06, C-03, C-04, C-05, C-07, R-03, R-11

**Superseded components (2026-10-22, D-066,
[ADR-0013](ADR-0013-extensible-skill-governance.md)):** decision 4 below (L0
cap, Skill count cap, `SKILL.md` ≤300 lines, ≤2 hops) is superseded by
measurement, reporting and provider-derived warnings. Decisions 1 and 2
remain in force. Decision 3's pack `INDEX.md` model was already replaced in
practice by skill-local references (D-016). The values written below are
historical. Evolution Steps 03–05 implemented ADR-0013: the validators
enforce no count, line, depth or L0 cap.

**Accepted count amendment (2026-10-17, D-051):** the Product Owner explicitly
authorized increasing the Entry Skill ceiling to **25**. This amendment is
ACCEPTED and implemented in V-07 and V-11.3. The rest of this ADR retains its
existing status. The subsequent D-052 follow-up accepts L0 ≤6,500 characters
(formerly 5,500 under D-037), implemented in V-07 and evaluation reporting. The current
product target is still 15 (13 engineering plus two planned editorial Skills),
not an instruction to create 25. No registry or persistent-policy proposal is
accepted by the count amendment.

## Context

**Step 36 amendment (D-053):** the latest user requirement sets maximum
**15** rather than 25. Count validation now covers the engineering/editorial
registration union. L0 remains 6,500; Engineering Catalog ownership stays
isolated and all 206 capabilities remain unchanged. This supersedes only the
earlier count and engineering-only registration assumptions.

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
     most **15** (D-053; previously 25 D-051, originally 14), and they are organised by **task intent** (feature
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
   - L0 ≤6,500 characters (D-052, user-authorized follow-up; previously 4,000, then 4,400 D-034, 4,700 D-035, 5,200 D-036, 5,500 D-037);
   - ≤15 skills (D-053; previously 25 D-051, originally 14);
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
entry skills within the ≤15 count ceiling (D-053), through a new ADR. The same applies
if two hops prove unreliable (AS-04): flatten the primary stacks' topic links
into `SKILL.md`.

## Verification

- V-07, V-08, and V-11.
- Trigger and behaviour suites (C-13): positive recall per capability sample,
  and a reference-load check (the expected topic files were read).
