---
kind: checklist
---
# English conventions: established rules and style-guide preferences

Keep the categories separate. An established rule may be cited as a
correction. A style-guide preference is a suggestion that the project's own
style guide, glossary or existing text overrides. Say which one you apply.

## Language selection

Decide the output language before editing:

1. The user's explicit target language wins ("write this in English" means
   English output even from a prompt in another language).
2. Otherwise, the established locale of the artifact (`en.json`, an English
   page, an English README section).
3. Otherwise, the language of the conversation.

Apply this guidance only when the output is English. For mixed-language text,
decide per section and keep intentional non-English spans (quotations, names,
terms) as written. Output in another language, and translation between
languages, is not this guidance; continue normally. Ask only when the
ambiguity changes the result materially.

## Spelling variety (US, UK and others)

Find the variety already in use from the text itself, locale tags (`en-US`,
`en-GB`, `en-AU`), existing documentation, the project style guide and the
user's request. Keep it. Never convert an established variety to another one
unless the user asks.

| Topic | US | UK |
|---|---|---|
| -or / -our | color, behavior | colour, behaviour |
| -ize / -ise | organize, optimize | organise, optimise (Oxford spelling keeps -ize) |
| -er / -re | center, meter | centre, metre |
| licence / license | license (noun and verb) | licence (noun), license (verb) |
| defense / defence | defense | defence |
| program / programme | program | programme for non-software meanings, program for software |
| Dates | month first (10/17/2026) | day first (17/10/2026) |

These are common differences, not a complete list; check a dictionary or the
style guide for anything else. Write dates unambiguously (for example
"17 October 2026") when the audience is mixed.

**Never convert:** code identifiers and API names (`color` in CSS, a
`behavior` property), configuration keys, product names, quotations, URLs,
and UI labels that must match the product. If one document mixes varieties,
report the inconsistency and ask which one to standardize on.

## Established rules

Apply these as corrections in any register, and cite the rule when asked. If
the project deliberately does otherwise, follow it and report the difference
once.

| Topic | Rule |
|---|---|
| Apostrophes | "its" is possessive; "it's" is "it is" or "it has". Possessive apostrophes follow the owner ("the team's roadmap"). |
| Agreement | Subject and verb agree in number ("the list of changes is long"). |
| Homophones and word pairs | affect (verb) and effect (noun); then and than; fewer for counts and less for amounts, where the style guide keeps the distinction. |
| Brand and product names | Use the owner's spelling and capitalization: GitHub, JavaScript, iOS, macOS, npm. |
| Consistency | One spelling variety, one term for one thing, and one convention for lists and numbers within a document. |

Do not invent rules from this table. When you are unsure whether something is
a rule or a preference, say so.

## Style-guide preferences

Widely used guides disagree on these points. Check which guide the project
follows, and keep one convention consistently within a document.

| Topic | What major guides say | Project override to look for |
|---|---|---|
| Heading capitalization | Google and Microsoft prefer sentence case ("Getting started with the CLI") | A headline-style (title case) convention |
| Serial comma | Google and Microsoft use it ("Android, iOS, and Windows"); some newspaper styles omit it | The project's existing lists |
| Contractions | Microsoft encourages them ("you're", "it's"); formal registers avoid them | The brand voice or a formal register |
| Voice | Google prefers "you" over "we" and active voice that names the actor | Reference text where the passive is conventional |
| Dashes | Microsoft closes up em dashes (no spaces); British style often uses a spaced en dash | The document's existing dash style |
| Compound modifiers | Hyphenate before a noun ("a well-documented API"), leave open after it ("the API is well documented"); -ly adverbs take no hyphen; British style sometimes hyphenates both | The style guide, and fixed dictionary compounds such as "third-party" |
| Length and tone | Microsoft favors short, conversational text that leads with the point | A formal or legal register |

Sources, read 2026-10-17:
<https://developers.google.com/style/highlights>,
<https://developers.google.com/style/hyphens>,
<https://learn.microsoft.com/en-us/style-guide/top-10-tips-style-voice>.
These are two vendors' guides, not universal law. A project's own guide wins.

## Applying conventions without over-correcting

- Correct an established-rule error once per pattern and mention the rule.
  Do not rewrite a document to impose a preference the project does not use.
- Never change spelling inside proper nouns, brand names, quotations, code,
  URLs or UI labels that must match the product.
- When approved spellings differ across a site, report the inconsistency and
  ask which form to standardize on.
- Regional, informal and dialect forms in dialogue or a personal voice are
  intentional; leave them unless the user asks for standard English.
