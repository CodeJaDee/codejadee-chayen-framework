---
kind: checklist
---
# Thai conventions: established rules and editorial preferences

Keep these two categories separate. An established rule may be cited as a
correction. An editorial preference is a suggestion that the project's own
convention, glossary or style guide overrides. Label which one you apply.

## Language selection

Decide the output language before editing:

1. The user's explicit target language wins ("เขียนเป็นภาษาอังกฤษ" means English
   output even though the request is in Thai).
2. Otherwise, the established locale of the artifact (`th.json`, a Thai page,
   a Thai README section).
3. Otherwise, the language of the conversation.

Apply this guidance only when the output is Thai. For mixed Thai-English
text, decide per section, and keep intentional English spans (product names,
technical terms, code, quotations) in English. Ask only when the ambiguity
changes the result materially. Translation into another language is not this
guidance; continue normally.

## Established rules

Apply these as corrections in formal and general text, and cite the rule when
asked. If the brand or project deliberately does otherwise, follow it and
report the difference once.

| Topic | Rule | Basis |
|---|---|---|
| Sentence and phrase breaks | Thai writes words without spaces and uses a space to separate phrases and sentences, not a full stop. | Royal Institute rules on spacing and punctuation |
| ไม้ยมก (ๆ) | Repeats only the same word or phrase in the same function, and is written with a space before and after: "เด็ก ๆ", "ต่าง ๆ". When the repeated words have different functions, write the word twice. | Royal Institute punctuation rules |
| ฯลฯ | Means "and so on"; write it with a space before and after. Do not combine it with "เป็นต้น". | Royal Institute punctuation rules |
| Particles | "ค่ะ" ends a statement; "คะ" ends a question or a softened request ("นะคะ", "ไหมคะ"). | Standard Thai orthography |
| Common spelling | อนุญาต, สังเกต, ผลลัพธ์, ลายเซ็น, เปอร์เซ็นต์, กะทันหัน are the dictionary forms. | Royal Institute Dictionary |
| Transliteration | Transliterated English words normally carry no tone marks; established forms include อีเมล, ซอฟต์แวร์, อินเทอร์เน็ต, เว็บไซต์, แอปพลิเคชัน, อัปเดต, ฟังก์ชัน, ดาวน์โหลด. | Royal Institute English transcription rules (1989) and its computer terminology |

Do not invent rules from this table. When you are unsure whether a form is
standard, say so instead of presenting a preference as a rule.

## Editorial preferences

These are common professional choices, not rules. Check what the project
already does, and keep one convention consistently within a document.

| Topic | Common preference | Project override to look for |
|---|---|---|
| Spacing around English words and numbers | A space on each side of Latin-script words and numerals: "ใช้ React 19 กับ Vite" | Existing pages written without spaces |
| Technical terms | Keep identifiers, commands and widely used developer terms in English; use Thai where the audience uses Thai | A glossary or terminology list |
| Numerals | Arabic numerals in technical and commercial text; Thai numerals in some official documents | Government or ceremonial style guides |
| Passive with ถูก | Prefer active voice or ได้รับ for neutral events | Reference docs that consistently use the passive |
| Particles in written copy | Documentation usually omits ครับ and ค่ะ; blogs and social posts may use them consistently | The brand's chosen voice and gender-neutral policy |
| Punctuation in technical docs | Commas and full stops borrowed from English are common in developer documentation | The repository's existing Thai docs |
| English plurals | Singular English nouns inside Thai sentences ("component หลายตัว") | Product names that include a plural |

## Applying conventions without over-correcting

- Correct an established-rule error once per pattern and mention the rule;
  do not rewrite a whole document to fix a spacing habit the project uses.
- Never change spelling inside proper nouns, brand names, quotations, code,
  URLs or UI labels that must match the product.
- When the same word appears in several approved spellings across a site,
  report the inconsistency and ask which form to standardize on.
- Regional, informal and dialect forms in dialogue or a personal voice are
  intentional; leave them unless the user asks for standard Thai.
