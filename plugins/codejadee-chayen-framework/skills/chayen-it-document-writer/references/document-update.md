---
kind: checklist
---
# Mode: update an existing document

Bring existing documentation in line with a newer implementation or approved
design, such as documentation from an original system reused for a heavily
customized one. Change only what the evidence shows changed.

## Procedure

1. **Identify the baseline.** Name the original document, its version and the
   system and release it describes. Keep a copy of the baseline text for the
   comparison; do not edit it in place before the comparison is done.
2. **Inspect the current evidence.** Use the evidence and traceability
   checklist. Source code, configuration, schemas, contracts, approved
   changes and deployment manifests for the current system outrank the
   baseline text.
3. **Compare and classify.** For requirements, workflows, components,
   interfaces, database structures and configurations, mark each baseline
   item as one of:

   | Class | Meaning |
   |---|---|
   | Unchanged | Current evidence confirms the baseline statement |
   | Modified | Current evidence shows a different behavior, structure or value |
   | Removed | The item no longer exists in the current system |
   | New | The item exists in the current system but not in the baseline |
   | Not Verified | No current evidence confirms or contradicts the baseline statement |

4. **Update only affected content.** Edit modified and new items, mark
   removed items as removed (or delete them when the project's convention is
   to delete), and leave unchanged and valid content, structure, numbering
   and wording as they are.
5. **Never carry over configuration by assumption.** A technical value from
   the original system, such as a host, port, schema detail, integration or
   security setting, applies to the customized system only when current
   evidence confirms it. Otherwise record it as Not Verified for the owner.
6. **Apply the English lens** only to the text you change, unless the user
   asked for a full language pass. Do not reword unchanged content.
7. **Write the change summary.** List each modified, removed and new section
   with the evidence behind the change, and list unresolved differences and
   sections that need owner verification.
8. **Maintain revision history** only when the user asks or the document has
   one: add an entry with the date, author field left for the user, and a
   short description. Do not invent an author, approver or version number.

## Rules

- Do not rewrite sections that evidence did not change.
- Do not resolve a conflict between the baseline and current evidence by
  choosing silently. State the conflict and the source of each side.
- Keep the document's template, headings, numbering, table layout and
  cross-reference style.
- Edit a copy or named file; ask before overwriting the user's original.

## Verification

- Every changed statement cites current evidence, or is marked Not Verified
  (PASS or FAIL per change).
- No baseline value was kept as current until current evidence confirms it.
- Unchanged sections are byte-for-byte as in the baseline, except for
  cross-reference or numbering fixes that were listed.
- The change log matches the actual differences between baseline and result.
