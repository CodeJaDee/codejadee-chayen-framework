---
kind: checklist
---
# Mode: translate English technical documents into Thai

Use this mode only when the user supplies English technical documentation
and asks for a Thai version. Treat translation as a controlled technical
transformation: it carries the source's meaning into Thai and does not
redesign the system, resolve its ambiguities or add facts.

## Procedure

1. **Fix the source.** Name the exact English document, its version and the
   sections in scope. Translate that text, not a memory of the system. If the
   source and the implementation disagree, translate the source and report the
   disagreement; do not correct it silently.
2. **Mark protected spans.** Use the protected spans in the Thai technical
   writing checklist: identifiers, endpoints, table and column names,
   configuration keys, paths, commands, error codes, product and protocol
   names, versions, numbers, units and requirement identifiers stay exactly as
   written.
3. **Lock the terminology.** Apply the project glossary first, then the
   terminology reference. Build a term list for new terms before translating
   the body, and use it for every occurrence.
4. **Map obligation keywords.** Record each MUST, SHALL, SHOULD, MAY, MUST NOT
   and SHOULD NOT with its location, and translate it to the matching Thai
   form from the writing checklist. Do not add a keyword where the source has
   plain wording.
5. **Translate by meaning, statement by statement,** not word by word.
   Restructure a sentence when literal order gives unnatural Thai, but keep
   every condition, exception, negation, quantifier and scope. Keep one
   Thai sentence per source statement unless splitting does not change logic.
6. **Keep the structure.** Preserve headings, numbering, table layout,
   cross-references, captions and diagram labels. Translate heading text; keep
   the section numbers. Diagram text inside an image cannot be translated;
   report it and give the Thai caption.
7. **Keep status as written.** A proposal, plan or recommendation stays a
   proposal in Thai ("เสนอให้", "มีแผนจะ"); never change it into an implemented
   fact. Preserve approved design decisions and their status.
8. **Flag ambiguity, do not resolve it.** When the English can be read two
   ways, or has no clear actor, schedule or scope, translate so that both
   readings remain possible when Thai allows it, and list the passage under
   Requires Clarification with the source location.
9. **Check equivalence.** For every section compare the Thai against the
   source: numbers, identifiers, keywords, conditions, negation, scope,
   status of each statement. Record any difference and fix it, or flag it.
10. **Report** with the translation output format: the Thai document, the
    term list, the flagged ambiguities and the equivalence summary.

## Rules

- Never add information, examples or explanation that the source does not
  contain, even to make the Thai read better. A short Thai gloss for a term at
  first use is the only addition, and it is listed in the term list.
- Never drop a sentence, a table row or a footnote. A passage that cannot be
  translated is reported, not omitted.
- Do not translate quoted system messages, log lines or code comments unless
  the user asks; if asked, keep the original beside the Thai.
- Do not convert units, numerals, date formats or calendar eras. A bare year
  stays as in the source.
- Keep the source language label of a mixed document: sections the user
  asked to remain English stay English.
- Write the Thai document to a new file or in the conversation; do not
  overwrite the English source or an existing Thai document without user
  approval for that file.
- Back-translation checks are done silently on the model's own reading; do
  not claim an independent human or tool review happened.

## Verification

- Every number, identifier, version and unit in the source appears unchanged
  in the Thai (PASS or FAIL per section).
- Every obligation keyword maps to the same strength (PASS or FAIL per
  keyword).
- Every proposal in the source is still a proposal in the Thai.
- No section, table row or statement is missing; the count of headings and
  tables matches the source.
- The term list covers each new or glossary term used, and each flagged
  ambiguity names its source location.
- A translation is not evidence that the described system behaves that way;
  report technical claims as Not Verified unless implementation evidence was
  inspected.
