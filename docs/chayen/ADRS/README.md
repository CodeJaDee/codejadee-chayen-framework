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

Source IDs (S1–S24) refer to
[PROVIDER_SPEC_RESEARCH.md §0](../PROVIDER_SPEC_RESEARCH.md#0-sources).
