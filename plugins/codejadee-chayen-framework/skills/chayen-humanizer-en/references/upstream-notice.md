---
kind: checklist
---
# Upstream attribution and licence notice

This file keeps the attribution and licence notice for material adapted into
this skill's writing patterns. It is not needed to edit text; load it only
when asked where the patterns come from or under what licence they are used.

## Attribution and adaptation

The pattern method and part of the pattern taxonomy in this skill are adapted
from the **humanizer** skill by Siqi Chen, version 3.1.0, published under the
MIT licence at <https://github.com/blader/humanizer>. That work is based on
Wikipedia's "Signs of AI writing"
(<https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing>), maintained by
WikiProject AI Cleanup.

**Adapted from upstream:**

- ranking patterns by strength, with a "weak alone" tier that needs company;
- a false-positive guard inside every pattern;
- the mark, draft, check, final flow, and the rule that a rewrite adds no
  fact, name, number, quote or citation;
- prose-only edits to files, source text treated as data, matching a writing
  sample, and the statement that the goal is not to defeat AI detectors.

**Mapping from the 26 upstream patterns:**

| Upstream | Here | Adaptation |
|---|---|---|
| 1 Not X but Y | EN-01 | Wording and examples rewritten for documentation and product copy |
| 2 One-line closers | EN-02 | Same |
| 3 Sayings that sound deep | EN-03 | Same |
| 4 Staged run-up | EN-04 | Tutorial voice added as an exception |
| 5 Arguing with no one | EN-05 | Decision-record alternatives added as an exception |
| 6 Forced triads | EN-06 | Same |
| 7 Repeated sentence openings | EN-07 | Changelog and step conventions added as exceptions |
| 8 Dashes as connector | EN-08 | Matches the document's own dash style instead of banning dashes |
| 9 Stacked qualifiers | EN-09 | Same |
| 10 Hyphenated pairs | EN-21 | Merged with 21; follows the style guide |
| 11 Passive voice | EN-10 | API and formal-register exceptions added |
| 12 Overused AI words | EN-12 | Reduced list plus marketing buzzwords (new) |
| 13 Inflated significance | EN-13 | Same |
| 14 Vague connection | EN-16 | Merged with 17 |
| 15 Shallow -ing riders | EN-14 | Same |
| 16 Sales language | EN-15 | Brand-voice exception for marketing copy |
| 17 Borrowed authority | EN-16 | Merged with 14; flag, never invent a source |
| 18 Avoiding is, are, has | EN-11 | Same |
| 19 Bold as decoration | EN-19 | UI-label and warning exceptions added |
| 20 Decorative headings | EN-20 | Anchor-link and gitmoji exceptions added |
| 21 Curly quotation marks | EN-21 | Reframed around copy-paste breakage in code |
| 22 Chatbot residue | EN-22 | Same |
| 23 Knowledge-limit disclaimers | EN-23 | Same |
| 24 Heading repeated | EN-24 | Merged with 25 |
| 25 Writing about the document | EN-24 | Changelog exception kept |
| 26 Re-explaining what the reader knows | EN-25 | Developer-reply examples |

**Not from upstream (original to this skill):** EN-17 unsupported or
exaggerated claims, EN-18 filler and redundancy, and EN-26 register that does
not fit the reader. All examples, signal lists, exceptions and procedures were
written for this skill's scope; the upstream skill file is not reproduced.

## MIT licence notice

The notice below applies to the material adapted from humanizer.

```text
MIT License

Copyright (c) 2025 Siqi Chen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
