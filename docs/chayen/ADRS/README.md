# Architecture Decision Records

ADRs record architecture decisions in context. The status vocabulary matches
[DECISIONS.md](../DECISIONS.md):

- `ACCEPTED`: required by the user, or approved by the user
- `PROPOSED`: awaiting user review
- `SUPERSEDED`: replaced by a later ADR
- `REJECTED`: considered and not adopted

An ADR that depends on unverified provider behaviour names the specific
verification it needs. It cannot move to ACCEPTED on documentation alone
when that verification is still pending.

| ADR | Title | Status | Related decisions |
|---|---|---|---|
| [ADR-0001](ADR-0001-native-plugin-first.md) | Native plugin-first | ACCEPTED (user-mandated) | D-002, MA-01 |
| [ADR-0002](ADR-0002-native-skill-discovery.md) | Native skill discovery | ACCEPTED (user-mandated). Per-surface behaviour pending verification. | MA-02, MA-06, REQ-02, REQ-03 |
| [ADR-0003](ADR-0003-no-match-fallback.md) | No-match fallback | PROPOSED | D-007, REQ-04, REQ-07 |
| [ADR-0004](ADR-0004-skill-catalog-vs-entry-skills.md) | Skill catalog versus entry skills | PROPOSED | D-006, REQ-05, REQ-06 |
| [ADR-0005](ADR-0005-no-standalone-runtime.md) | No standalone runtime | ACCEPTED (user-mandated) | D-002, D-004, MA-07, MA-08, EX-01..EX-07 |
| [ADR-0006](ADR-0006-provider-portability-strategy.md) | Provider portability strategy | ACCEPTED (Step 04: the user referred to "the approved packaging ADRs") | D-005, D-009, MA-04, MA-05 |
| [ADR-0007](ADR-0007-security-boundaries.md) | Security boundaries | PROPOSED | D-003, REQ-09 |
| [ADR-0008](ADR-0008-packaging-and-marketplace-strategy.md) | Packaging and marketplace strategy | ACCEPTED, as amended by D-013 (Step 04) | D-009, D-013, K-01..K-04 |
| [ADR-0009](ADR-0009-multilingual-editorial-skills.md) | Multilingual Editorial Skills | PROPOSED (Step 35; product scope approved separately) | D-047, D-048, MHR-001–MHR-006, MHR-011 |
| [ADR-0010](ADR-0010-persistent-multilingual-response-style-policy.md) | Persistent Multilingual Response Style Policy | PROPOSED (Step 35) | D-047, D-049, MHR-007–MHR-009 |
| [ADR-0011](ADR-0011-multilingual-quality-and-safety.md) | Multilingual Quality and Safety | PROPOSED (Step 35) | D-047, D-050, MHR-010–MHR-012 |

Step 35 checked that 0009–0011 were unused before allocation. These proposals
identify affected ADRs explicitly; they do not change any existing ADR's
status. Product scope approval does not accept their architectural exceptions.

Owner follow-up D-051 (2026-10-17) explicitly accepts and implements only an
Entry Skill ceiling of 25, amending ADR-0004 and ADR-0009's count component.
The rest of ADR-0009, including the L0/registry proposals, remains PROPOSED.

Source IDs (S1–S24) refer to
[PROVIDER_SPEC_RESEARCH.md §0](../PROVIDER_SPEC_RESEARCH.md#0-sources).
