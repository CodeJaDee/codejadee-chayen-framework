---
kind: checklist
---
# Mode: write a new document

Create a new IT document from supplied evidence. The result is a structured
draft ready for technical review, not a finished claim about the system.

## Procedure

1. **Fix the frame.** Confirm the document type, purpose, audience and scope.
   If the project has a template, numbering, glossary or English convention,
   use it. Otherwise use the matching document type checklist as the outline,
   keep only applicable sections, and use US English.
2. **Inventory the evidence.** Use the evidence and traceability checklist:
   list each source, its authority, freshness and whether it was inspected.
   Read repository evidence yourself when it is available; ask the user for
   evidence that cannot be read.
3. **Map evidence to sections.** For each section note the sources that
   support it and the facts it needs that no source provides.
4. **Draft section by section.** State only what a source supports. Cite the
   source. Keep current-state facts, assumptions and proposals in separate,
   labelled places. Describe the structure the evidence shows, not a
   preferred architecture.
5. **Add diagrams and tables where they carry information.** Use text-based
   diagrams (such as Mermaid) when the host can render them, and keep every
   name identical to the text. Draw only components and flows that evidence
   supports; mark anything else as proposed.
6. **Mark gaps in place.** Where evidence is missing, write the section
   heading, one sentence on what is needed, and the status Missing
   Information or Requires Clarification. Do not write a plausible value.
7. **Close the document.** Add the assumptions and limitations, open
   questions with owners where known, references, and a revision table when
   the project uses one.
8. **Review your own draft** with the review checklist: unsupported claims,
   names that differ between sections and diagrams, and wording that reads as
   a verified fact but is only inferred.
9. **Hand off** analysis that belongs to another skill (architecture
   decisions, infrastructure engineering, security analysis) by naming the
   skill and the question, and mark the section Not Verified until answered.

## Rules

- Never complete a section merely to make the document look finished.
- Do not write a proposal in the present tense.
- Write for the stated reader: define terms, expand acronyms at first use,
  and keep one term per concept.
- Write the file only where the user named, and do not overwrite an existing
  document without user approval.
- Do not claim a DOCX or PDF was produced. Produce Markdown and say a
  conversion is possible when the host supports one.

## Verification

- Every technical statement has a source or a status label (PASS or FAIL per
  section).
- Names, numbers and flows agree between text, tables and diagrams.
- Open questions list every Missing Information and Requires Clarification
  item.
- Sources named in the evidence list were actually inspected; anything else
  is reported as not inspected.
