---
kind: checklist
---
# Modes: review and audit an existing Thai document

Both modes are read-only by default. Report findings in Thai; do not edit the
document unless the user explicitly asks for corrections.

## Review

A review judges how well one document reads and whether it is accurate
against the available evidence.

### Review procedure

1. Read the whole document once for structure, then section by section.
2. Apply the document type checklist and the Thai technical writing
   checklist.
3. Compare technical statements against the evidence supplied. When no
   evidence was supplied, review language, structure and internal
   consistency only, and say that accuracy was not checked.
4. Record each finding with the evidence model fields: location, finding,
   source, status, recommended action and owner.
5. For a language finding, show the original text (ข้อความเดิม), the
   recommended text (ข้อความที่แนะนำ) and the reason (เหตุผล), and mark any
   correction that touches meaning for the owner.

### Review lenses

- Thai grammar, sentence clarity and professional style.
- Terminology consistency, term introduction and acronym use.
- Technical ambiguity such as an unclear actor, scope, schedule or referent.
- Literal-translation phrasing that reads as English in Thai dress.
- Missing explanations a reader needs.
- Contradictory statements inside the document.
- Completeness against the document type checklist.
- Diagram-to-text consistency.
- References and cross-references that resolve.

## Audit

An audit checks quality, completeness and support structurally and produces
a register that someone can act on.

### Audit procedure

1. Define the audit scope: document, version, evidence set and checklist.
2. Check mandatory and applicable sections for presence and substance.
3. Test technical claims for support, and list each unsupported claim.
4. Check requirement coverage, both directions, using a traceability matrix
   when requirements are available.
5. Check workflows for missing exception paths, undocumented dependencies
   and unverified security or operational assumptions.
6. Record evidence gaps and unresolved questions.
7. Classify and rank each finding, then summarize completeness.

### Audit lenses

- Missing mandatory sections.
- Unsupported technical claims.
- Requirement coverage gaps.
- Inconsistent specifications.
- Incomplete workflows and missing exception handling.
- Undocumented dependencies.
- Unverified security or operational assumptions.
- Missing evidence and unresolved questions.

## Severity

Assign severity from evidence and impact, not mechanically from the finding
type, and never from formatting or a generic checklist omission alone. State
the reason in one sentence for every Critical and Major finding.

| Severity | Thai label | Use when |
|---|---|---|
| Critical | วิกฤต | A documented error or omission that creates a credible, material security, operational or implementation risk; for example a stated control that the evidence contradicts, or a missing recovery procedure for a production component |
| Major | สำคัญ | A substantial accuracy, completeness or consistency problem that affects understanding or implementation, but with no evident material risk |
| Minor | เล็กน้อย | A localized language, formatting or low-impact documentation issue |

If the impact depends on a fact you cannot see, lower the confidence rather
than raising the severity, and record the question that would settle it.

## Rules

- Do not modify the document. Do not return a rewritten version unless asked.
- Do not turn a missing value into a recommended value. Ask for the value.
- Do not report something as wrong when it is only unverified; use the
  status Not Verified.
- Keep findings specific: a location, the evidence and the next action.
- A purely stylistic Thai preference is Minor and is labelled as a
  preference when the project has no style rule.

## Verification

- Every finding names a location and a recommended action (PASS or FAIL).
- Every Critical and Major finding states its evidence and impact.
- No finding states a technical fact that no inspected source supports.
- The document and its sources are unchanged after the run.
- Sources that were not available are listed as not inspected.
