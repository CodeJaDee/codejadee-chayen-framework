---
kind: checklist
---
# Creating new Thai content

Write new Thai text from facts the user or the source material provides.
Compose in Thai for a Thai reader; do not draft in English and translate.

## Inputs to collect

- **Facts:** the product, feature, data, examples, commands and links the
  text may state. Anything not supplied is either asked for or left out.
- **Reader and goal:** who reads it (beginner developers, buyers, existing
  customers) and what they should know or do afterwards.
- **Form:** article, developer blog, README or documentation section,
  product description, landing page section or UI strings; target length.
- **Voice:** brand voice or a writing sample, particles policy, pronoun for
  the reader (คุณ, ผู้ใช้, none), glossary.

Ask once for missing items that change the result. Otherwise state the
assumption you used.

## Compose in Thai

- Lead with the point the reader came for; save background for later.
- One idea per paragraph. Vary sentence length; let short sentences carry
  the key facts.
- Use the reader's terminology: developer audiences keep English technical
  terms and identifiers; general audiences get plain Thai explanations.
- Show, from the source: a real command, a real example, a real number.
  Never create statistics, quotes, testimonials, customer names or citations.
- Headings describe their section's content; skip headings for short pieces.

## Content types

| Type | Shape |
|---|---|
| Article or blog | A specific opening, the body in the order the reader needs it, a close that adds a next step instead of a summary |
| Developer tutorial | Prerequisites, steps with exact commands from the source, expected results, common problems |
| README or documentation prose | What it is, how to start, where to go next; commands and versions come from the repository or the user, never from memory |
| Product description | Facts and specifications first, then the benefit in the customer's terms |
| Landing section | Headline, one supporting line, a call to action; see `website-content.md` for UI constraints |

For README and documentation content, the accuracy of commands, setup steps
and API behavior is verified against the repository by the engineering
documentation owner. This guidance covers the Thai writing; mark any command
or behavior you could not confirm as unverified.

## Self-check before returning

1. Read the draft against `patterns-language.md` and `patterns-content.md`;
   fix any clustered patterns.
2. Every fact traces to the inputs; label anything assumed.
3. The voice matches the requested reader and is consistent throughout.
4. The output contains no residue such as "หวังว่าจะเป็นประโยชน์" or
   unfilled placeholders.
