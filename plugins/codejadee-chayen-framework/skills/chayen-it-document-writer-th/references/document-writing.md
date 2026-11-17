---
kind: checklist
---
# Mode: write a new Thai document

Create a new Thai IT document from supplied evidence. The result is a
structured draft ready for technical review, not a finished claim about the
system.

## Procedure

1. **Fix the frame.** Confirm the document type, purpose, audience, scope and
   that the deliverable is Thai. If the project has a template, numbering,
   glossary or Thai convention (terms, digits, era), use it. Otherwise use the
   matching document type checklist as the outline, keep only applicable
   sections, and write Thai headings.
2. **Inventory the evidence.** Use the evidence and traceability checklist:
   list each source, its authority, freshness and whether it was inspected.
   Read repository evidence yourself when it is available; ask the user for
   evidence that cannot be read. Evidence may be in English; quote it in its
   original language when a claim depends on exact wording.
3. **Map evidence to sections.** For each section note the sources that
   support it and the facts it needs that no source provides.
4. **Settle terminology** with the terminology reference: glossary first, then
   one form per term, introduced once with its explanation.
5. **Draft section by section** in natural, formal Thai (see the Thai
   technical writing checklist). State only what a source supports. Cite the
   source. Keep current-state facts, assumptions and proposals in separate,
   labelled places. Describe the structure the evidence shows, not a
   preferred architecture. Give each procedure numbered steps.
6. **Add diagrams and tables where they carry information.** Use text-based
   diagrams (such as Mermaid) when the host can render them, with Thai
   captions and labels that match the text; keep identifiers in their original
   spelling. Draw only components and flows that evidence supports; mark
   anything else as proposed.
7. **Mark gaps in place.** Where evidence is missing, write the section
   heading, one Thai sentence on what is needed, and the status ไม่มีข้อมูล
   (Missing Information) or ต้องการข้อมูลเพิ่มเติม (Requires Clarification).
   Do not write a plausible value.
8. **Close the document.** Add the assumptions, open questions with owners
   where known, references, and a revision table when the project uses one.
   Leave author and approver fields for the user.
9. **Review your own draft** with the review checklist: unsupported claims,
   names that differ between sections and diagrams, an unclear actor in a
   sentence where the evidence names one, and wording that reads as a verified
   fact but is only inferred.
10. **Hand off** analysis that belongs to another skill (architecture
    decisions, infrastructure engineering, security analysis) by naming the
    skill and the question, and mark the section Not Verified until answered.

## Rules

- Never complete a section merely to make the document look finished.
- Do not write a proposal as if it were deployed.
- Write for the stated reader: expand acronyms at first use, and keep one
  term per concept.
- Keep requirement keywords exactly as the requirements state them, in the
  Thai form given by the writing checklist.
- Write the file only where the user named, and do not overwrite an existing
  document without user approval.
- Do not claim a DOCX or PDF was produced. Produce Markdown and say a
  conversion is possible when the host supports one.

## Verification

- Every technical statement has a source or a status label (PASS or FAIL per
  section).
- Names, numbers and flows agree between text, tables and diagrams.
- Protected spans match the evidence (identifiers, numbers, units, versions).
- Open questions list every Missing Information and Requires Clarification
  item.
- Sources named in the evidence list were actually inspected; anything else
  is reported as not inspected.
