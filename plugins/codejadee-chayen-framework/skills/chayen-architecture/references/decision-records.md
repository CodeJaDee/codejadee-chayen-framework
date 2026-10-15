---
kind: recipe
capabilities: [CAP-03-002, CAP-03-003, CAP-04-008, CAP-18-009]
---
# Option analysis, ADRs, and the decision register

Compare candidate options against explicit criteria. Record the outcome as an
architecture decision record (ADR), and keep a register so that decisions can
be found and revisited. Proposed decisions and accepted decisions are never
confused. Exceptions to a standard or policy are recorded the same way,
as waivers with scope, risk, compensating controls, approver, and expiry.

## Inputs

- The decision to make, the candidate options (or a request to generate
  them), and the constraints.
- The quality goals or criteria, with weights if the owner has given them.
- Existing ADRs and decision logs: their location, template, numbering, and
  statuses.
- The approver (a person or role), if known.

## Procedure

1. **Frame the decision.** State it as one question, its scope, and the
   constraints. Then list the accepted decisions that constrain it, citing
   ADR IDs.
2. **Generate the options.**
   - Include **option 0: keep the current approach**, plus 2–3 realistic
     alternatives.
   - Drop options that violate a hard constraint, and say why.
3. **Define the criteria** from the quality goals, for example operability,
   latency, cost, team familiarity, and migration effort. Use the owner's
   weights. Without them, show the comparison unweighted, and say which
   weighting would flip the result.
4. **Compare the options** in a table. Each cell holds evidence or reasoning,
   not just a score. Mark the facts that come from the repository or vendor
   documentation as `found`, and judgement as `inferred`.
5. **Recommend** one option. Give the trade-offs, the risks, the
   consequences, and what would change the answer. Label it **Proposed**.
6. **Write the ADR**, when the user wants one:
   - Use the repository's template and numbering, if they exist.
   - Otherwise use the default below.
   - Status starts as `Proposed`. Only the user or a named approver changes
     it to `Accepted`. Record who and when.
7. **Superseding.**
   - If the new decision replaces an accepted ADR, the new ADR says
     `Supersedes ADR-<n>`.
   - The old ADR changes status to `Superseded by ADR-<m>` only when the new
     one is accepted.
   - Never delete or rewrite an accepted ADR's decision text.
8. **Keep the decision register.**
   - Create or update an index: ID, title, status, date, owner, supersedes
     or superseded-by, and link.
   - Flag conflicts: two accepted decisions that contradict each other, a
     superseded ADR still referenced as current, or a proposed ADR that has
     sat for a long time without a decision.

### Exceptions and waivers (CAP-18-009)

1. **Describe the deviation:** the standard or policy it breaks (cited),
   the scope (system, component, resource), and why it is needed.
2. **Assess the risk** and list compensating controls that reduce it.
3. **Write the waiver record** in the repository's decision format: ID,
   standard, scope, risk, compensating controls, requester, approver,
   approval date, and expiry date. The approver and approval date stay
   empty until a named person approves; the agent never fills them in.
4. **Add it to the waiver register,** and flag waivers that are expired,
   expiring soon, missing an approver, or missing an expiry.
5. **On expiry,** propose renewal with fresh justification, or the work to
   remove the deviation.

## Outputs

Use the repository's ADR format first, otherwise the reusable
`architecture-decision-record-template.md` listed by the entry skill. A new ADR
starts PROPOSED; record acceptance only with the authorized decision evidence,
and keep decision approval separate from approval to execute risky actions.

- An option comparison table, and a recommendation labelled proposed.
- An ADR in the repository's format, or this default:

```text
# ADR-<n>: <title>
Status: Proposed | Accepted (by <name/role>, <date>) | Superseded by ADR-<m> | Rejected | Deprecated
Context: <forces, constraints, accepted decisions that apply>
Decision: <what we will do>
Options considered: <option 0 keep current; option 1; option 2 — with trade-offs>
Consequences: <positive, negative, follow-ups>
```

- A decision register:

```text
| ID | Title | Status | Date | Owner | Supersedes / Superseded by | Link |
Conflicts: <items>
```

- For exceptions: a waiver record with expiry and compensating controls,
  and a register of waivers with expired ones flagged.

## Technology considerations

Stack-neutral. Follow the repository's ADR conventions where they exist:

- **Common locations:** `docs/adr/`, `docs/decisions/`, `docs/architecture/decisions/`.
- **Common tooling:** adr-tools, Log4brains, and MADR templates.
- **Facts about technology options** (version support, licence, hosting
  limits) cite the vendor documentation, with an access date. Otherwise they
  are labelled `inferred`.

## Verification

- Option 0 (keep the current approach) appears in every comparison.
- Every option has at least one stated disadvantage.
- The recommendation follows from the stated criteria. The weighting that
  would flip it is named.
- No ADR is marked `Accepted` without a named approver.
- No accepted ADR is edited except for its status line when it is
  superseded.
- The register lists every ADR found, with its status. The seeded
  superseded or conflicting decisions are flagged.
- Every fixture waiver record has an approver and an expiry, or is flagged
  as incomplete, and the seeded expired waiver is flagged.
