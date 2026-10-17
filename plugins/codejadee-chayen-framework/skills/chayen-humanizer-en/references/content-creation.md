---
kind: checklist
---
# Creating and editing English content

Write new English text from facts the user or the source material provides,
and edit developer communication, README prose and announcements for
wording. Compose directly in English for the stated reader.

## Inputs to collect

- **Facts:** the product, feature, data, examples, commands and links the
  text may state. Anything not supplied is either asked for or left out.
- **Reader and goal:** who reads it (beginner developers, buyers, maintainers,
  existing customers) and what they should know or do afterwards.
- **Form:** article, developer blog, README or documentation prose,
  developer reply, announcement, product description, landing section or UI
  strings; target length.
- **Voice:** brand voice or a writing sample, spelling variety, contractions
  and person ("you" or "we"), glossary and protected terms.

Ask once for missing items that change the result. Otherwise state the
assumption you used.

## Compose

- Lead with the point the reader came for; save background for later.
- One idea per paragraph. Vary sentence length, and let short sentences carry
  the key facts.
- Use the reader's terminology: developer audiences keep identifiers and
  widely used terms; general audiences get plain explanations.
- Show, from the source: a real command, a real example, a real number. Never
  create statistics, quotes, testimonials, customer names or citations.
- Headings describe what their section holds. Skip headings in short pieces.
- Match a writing sample or the existing voice. Without one, the text type
  sets the voice: blogs and personal posts keep opinion, uncertainty and
  asides; reference, technical and legal text stays neutral and plain.

## Text types

| Type | Shape |
|---|---|
| Article or blog post | A specific opening, the body in the order the reader needs it, a close that adds a next step instead of a summary |
| Developer tutorial | Prerequisites, steps with exact commands from the source, expected results, common problems |
| README and documentation prose | What it is, how to start, where to go next; the prose is edited here, while commands and versions come from the repository or the user |
| Developer communication | Replies, issue and review comments, announcements: lead with the decision or answer, keep the one fact the reader lacks, add links they need; keep required formats such as commit prefixes and PR templates |
| Product description | Facts and specifications first, then the benefit in the customer's terms |
| Landing section | Headline, one supporting line, a call to action; see `website-content.md` for layout and string constraints |
| UI microcopy | The shortest clear text for the action, state or error; same word for the same action |

For README and documentation content, the accuracy of commands, setup steps
and API behavior is checked against the repository by the engineering
documentation owner. This guidance covers the wording; mark any command or
behavior you could not confirm as unverified.

## Self-check before returning

1. Read the draft against the three pattern files and fix clustered patterns.
2. Every fact traces to the inputs; label anything assumed.
3. The voice is consistent and matches the reader and the spelling variety.
4. The output contains no residue such as "I hope this helps" or unfilled
   placeholders.
5. If a reply or announcement is meant for a reader who already has the
   context, it leads with the decision.
