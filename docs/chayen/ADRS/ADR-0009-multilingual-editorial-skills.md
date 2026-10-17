# ADR-0009: Multilingual Editorial Skills

- **Status:** PROPOSED for remaining editorial behavior decisions; registration/CA-01/V-19 and limits ACCEPTED (D-051–D-053). Implementation/quality evidence is separate from approval.
- **Date:** 2026-10-17
- **Related:** D-047, D-048, MHR-001–MHR-006, MHR-011; ADR-0002, ADR-0004–ADR-0008.
- **Number allocation:** 0009–0011 were unused in files/index and repository
  search before Step 35 creation.

**Owner follow-up (D-051, 2026-10-17):** the Entry Skill ceiling is now
**25, ACCEPTED and implemented**, superseding this record's original proposed
≤15 ceiling and ADR-0004's old ≤14 limit. The product target remains 15;
the separate registry and other architecture choices below remain PROPOSED.
The subsequent owner follow-up **D-052 accepts and implements L0 ≤6,500**
in V-07 and evaluation reporting. Count and L0 components are now approved;
this does not accept the editorial registry or other architecture proposals.

## Context

**Step 36 approval (D-053):** the owner instructed proceeding after the
registration approval gap was identified. Separate editorial registration and
CA-01/V-19 amendments are now accepted and implemented as described in
[SKILL_REGISTRATION.md](../SKILL_REGISTRATION.md). The latest Step 36 count
requirement is maximum 15, replacing D-051's 25. L0 stays 6,500. Both Humanizers
remain planned records without Skill directories; host policy and human-quality
architecture are not accepted by this registration approval.

The Product Owner approved Thai and English writing/editing Entry Skills in
the existing repository, and a target increase from 13 to 15. The original
Step 35 scope did not approve changing the then-current ≤14 ceiling;
D-051 subsequently approves ≤25 and D-052 approves L0 ≤6,500. The
engineering-only registry model remains unchanged. Current L0 is 5,485; V-11.3 and V-19 require
every Skill to appear in the Engineering Catalog and own a capability.
Adding editorial skills without revisiting these rules would fail validation
or distort the preserved 206-capability inventory.

## Proposed decision

1. Add `chayen-humanizer-th` and `chayen-humanizer-en` later as bounded,
   provider-neutral, native-discovered editorial Skills. No Skill is created
   in Step 35 and no separate repository is introduced.
2. Use the latest owner-required ≤15 Entry Skill ceiling (D-053; replacing D-051's 25), with a current
   product target of 15: 13 engineering and two editorial Skills. Retain the 206 Engineering Capabilities and all technology
   and workflow coverage, with no placeholder CAP records or reassignment.
3. Use the D-053-approved separate developer-side editorial registry. Validate the union
   of both registries for identity, uniqueness, approved total and existing
   versus planned mappings. Keep engineering ownership/coverage checks intact;
   replace CA-01's engineering-only assumption under that approval. This is
   not an exemption from anatomy, link, safety, trigger or size gates.
4. Use the owner-authorized L0 ≤6,500 characters (D-052), measured with the existing name + description
   method. With unchanged engineering descriptions and two 19-character names
   plus ≤420-character descriptions, the corrected upper estimate is ≤6,363.
   Step 36's actual planned metadata projects 5,940. This is a
   planning estimate, not measured host/token capacity. Host instruction
   content has a separate overhead ledger (ADR-0010).
5. Audit and rewrite only requested content; select by intended output
   language (MHR-002). Preserve protected terminology, factual meaning,
   audience/brand voice, web structure and permissions. Content changes to
   technical docs may need the documentation owner; UI behavior stays with
   engineering owners. Handoff uses native discovery by name, not cross-skill
   links, runtime orchestration or assumed automatic invocation.

## Alternatives considered

| Alternative | Trade-off |
|---|---|
| Extend documentation Skill only | Reuses metadata but fails the approved two-Skill scope and blurs editorial/technical ownership. |
| Separate Humanizer plugin/repository | Rejected by approved product scope; duplicates distribution and review. |
| Keep 5,500 and compress existing descriptions | Possible after routing evidence; risks existing engineering recall. No compression is done here. |
| Put editorial records inside the 206 Engineering Capabilities | Changes inventory or ownership solely to satisfy tooling; rejected. |
| Unrestricted registry/budget exemption | Hides new discovery cost and weakens regression protection; rejected. |

## Consequences and trade-offs

Native discovery and zero runtime remain. Two language-specific entry points
improve scope clarity but can compete with each other and documentation/UI
skills. L0 grows and may crowd users' other skills; Thai tokenization requires
measurement rather than English token estimates. Additional registry/tooling
work must precede Skill implementation. Approval of a 15-Skill product target
is not evidence of successful routing, metadata fit or completed quality work.

## Compatibility impact and affected ADRs

ADR-0004's count ceiling has been amended to ≤25 by D-051 and L0 to ≤6,500
by D-052. CA-01/V-11.3/V-19 engineering ownership assumptions would be amended
only upon their separate acceptance. ADR-0002's native discovery,
ADR-0005's static package, ADR-0006's shared Skill source, ADR-0007's advisory
boundaries and ADR-0008's single package are preserved for editorial Skills.
Persistent host guidance is solely the separate ADR-0010 proposal. Existing
ADRs retain their current statuses except for the explicitly accepted count
and L0 amendments in ADR-0004; no broader supersession is implied.

## Verification strategy and acceptance boundary

Later authorized work must update count/registry checks with negative controls,
measure actual 15-Skill L0 and host overhead, validate portable anatomy/links,
and run positive/negative/bilingual/ambiguous triggers plus engineering
regressions. DS-09 requires repeat runs and no-plugin comparisons for changed
descriptions. MH-V01–MH-V06/MH-V11 and ADR-0011 cover behavior/fidelity.
Native per-surface compatibility remains UNVERIFIED for this extension until
recorded tests; no paid evaluation is authorized by this ADR.

Step 35 checks governance structure only; product verification is NOT_RUN.
The count ceiling is approved by D-051 and the 6,500-character L0 cap by
D-052. D-053 subsequently accepts and implements the separate registry and
registration validation while replacing the count with maximum 15. No editorial
Skill body is created in Step 36; remaining behavior/host-policy work stays in
later steps. Earlier pending-approval statements describe the original Step 35
context and are superseded only for this registration scope.
