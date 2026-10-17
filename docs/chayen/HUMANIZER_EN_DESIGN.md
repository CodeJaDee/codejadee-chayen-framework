# English Humanizer Skill design — Step 38

- **Date:** 2026-10-17 (Asia/Bangkok)
- **Skill:** `chayen-humanizer-en`
- **Status:** implemented; static checks PASS; behavior, native routing and human quality NOT_RUN
- **Decision:** [D-055](DECISIONS.md#d-055--step-38-english-editorial-skill-design) (PROPOSED, pending owner review)
- **Requirements:** [HUMANIZER_REQUIREMENTS.md](HUMANIZER_REQUIREMENTS.md) MHR-001–MHR-006, MHR-011, MHR-012
- **Sibling:** [HUMANIZER_TH_DESIGN.md](HUMANIZER_TH_DESIGN.md)

## Preconditions

Steps 35–37, the registration model ([SKILL_REGISTRATION.md](SKILL_REGISTRATION.md)),
the authoring standard and the implemented Thai skill were read; the working
tree was clean at `f65a432` (Step 37 committed). D-052 (L0 6,500) and D-053
(registry, maximum 15) are accepted. D-054 was still PROPOSED when Step 38 was
issued; the owner committed Step 37 and instructed Step 38, which is recorded
as acceptance by proceeding, with the same precedent as D-053. That inference
is flagged for the owner in D-055 rather than treated as silent approval.
ADR-0010 (persistent policy) and ADR-0011 (quality thresholds) govern Steps
39–40 and do not block this step.

## Upstream research and attribution

Read in full on 2026-10-17 from <https://github.com/blader/humanizer>:
`SKILL.md` (version 3.1.0, 397 lines, 26 patterns), `README.md`,
`CHANGELOG.md` and `LICENSE` (MIT, Copyright (c) 2025 Siqi Chen). The upstream
files were downloaded to a scratch directory and treated as data. Upstream
bases its list on Wikipedia's "Signs of AI writing"
(<https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing>).

**What is adapted.** The pattern taxonomy (the 26 patterns and their grouping
into staging, rhythm, inflation, formatting, leftovers and wrong reader),
signal phrases in each watch list, the strength ranking with a "weak alone"
tier, a false-positive guard per pattern, the mark, draft, check, final flow,
the no-invented-facts rule, prose-only file edits, source text as data and
the "not a detector tool" statement.

**What is not copied.** The upstream `SKILL.md` is not reproduced. Every
example is original and written for documentation, product copy, UI and
developer replies instead of encyclopedia prose; each "After" uses only facts
already in its "Before". Signal lists are rewritten and reduced. The router
structure, safety boundaries, protected-content rules, output formats and test
design follow this repository's standard, not upstream's file layout.

**Licence handling.** Adapting the taxonomy and watch lists is treated
conservatively as using a substantial portion, so the MIT copyright and
permission notice ship inside the skill at
`references/upstream-notice.md`, together with the attribution and a mapping
from the 26 upstream patterns. The notice text was checked byte for byte
against upstream's `LICENSE` (identical). The notice is reachable from
`SKILL.md` and loaded only when the user asks about origin or licence. No
repository-root notices file was added because the repository's own licence is
still undecided (Q-05); the owner may want one when a licence is chosen.

## Where this skill departs from upstream

| Topic | Upstream | Here | Reason |
|---|---|---|---|
| Dashes | The final text must contain no em or en dashes unless the writer's sample uses them | EN-08 is *weak alone* and follows the document's own dash style; code, flags, URLs and ranges are never touched | Major style guides use dashes (Microsoft closes up em dashes); `--flag` syntax must survive |
| Hyphenated pairs | Drop the hyphen after the noun | Merged into EN-21 as a style-guide-dependent convention | British style often hyphenates both positions |
| Already natural text | Not a separate concern | Explicit principle, "no changes recommended" output and six unchanged-text cases | Brief requires not over-editing |
| Fiction | Exempt from the no-new-facts rule | Excluded from scope | Invented detail is the task there |
| Overused words | One long list | Shorter prose list plus marketing buzzwords, with technical-use exceptions | Product and landing copy are in scope |
| Spelling | Not covered | US/UK handling, never converting identifiers or established variety | Brief requires established spelling conventions |
| Claims | Borrowed authority only | EN-17 unsupported claims: flag for the owner, never repair with invented evidence | Parity with the Thai skill; legal risk |
| Register | Voice guidance only | EN-26 register mismatch pattern | Parity with the Thai skill |
| Wrong reader | Pattern 26 | EN-25 with developer-reply examples; applies only when the thread is visible | Developer communication is in scope |

## Pattern coverage

All 26 upstream patterns are covered; three pairs are merged and three
patterns are new. Each pattern has Signals, Why, Not a tell when, Before,
After and Preserve, enforced by `check-editorial-cases.mjs` (E-01).

| ID | Pattern | Strength | Upstream | File |
|---|---|---|---|---|
| EN-01 | Not X but Y | strong | 1 | `patterns-staging-and-rhythm.md` |
| EN-02 | One-line closers and dramatic fragments | strong | 2 | same |
| EN-03 | Sayings that sound deep | strong | 3 | same |
| EN-04 | Staged run-ups and announcements | strong | 4 | same |
| EN-05 | Arguing with no one | strong | 5 | same |
| EN-06 | Forced triads | strong in clusters | 6 | same |
| EN-07 | Repeated sentence openings | weak alone | 7 | same |
| EN-08 | Dashes as the universal connector | weak alone | 8 | same |
| EN-09 | Stacked qualifiers | weak alone | 9 | same |
| EN-10 | Passive voice and missing subjects | weak alone | 11 | same |
| EN-11 | Copula avoidance | strong in clusters | 18 | same |
| EN-12 | Overused AI words and marketing buzzwords | strong in groups | 12 (+ original list) | `patterns-inflation-and-claims.md` |
| EN-13 | Inflated significance | strong | 13 | same |
| EN-14 | Shallow -ing riders | strong in clusters | 15 | same |
| EN-15 | Sales language and promotional adjectives | strong in docs | 16 | same |
| EN-16 | Vague attribution and borrowed authority | strong when unsupported | 14 + 17 | same |
| EN-17 | Unsupported or exaggerated claims | strong; flag only | original | same |
| EN-18 | Filler and redundancy | strong for padding | original | same |
| EN-19 | Bold as decoration | weak alone | 19 | `patterns-format-and-reader.md` |
| EN-20 | Decorative headings, emoji and rules | weak alone | 20 | same |
| EN-21 | Typography that breaks or distracts | weak alone | 10 + 21 | same |
| EN-22 | Chatbot residue | strong | 22 | same |
| EN-23 | Knowledge-limit disclaimers and guesses | strong | 23 | same |
| EN-24 | Writing about the document | strong for repeats | 24 + 25 | same |
| EN-25 | Re-explaining what the reader knows | strong with visible thread | 26 | same |
| EN-26 | Register or tone that does not fit the reader | strong on audience conflict | original | same |

## Consistency with the Thai skill

The two skills share behavior, not content, and neither names or loads the
other (E-04 in `check-editorial-cases.mjs`). The English router's "When not to
use" table sends non-English output to "Answer directly" rather than to the
Thai skill, so each skill remains valid when the other is absent.

| Behavior | Thai | English |
|---|---|---|
| Modes | audit, rewrite, create, website edit | same |
| Principles | meaning first, signals not bans, honest about limits, precedence | same, plus leave natural text alone |
| Protected spans and untrusted content | `protected-content.md` | same structure, English specifics and placeholder examples |
| Preview and apply | `website-content.md` | same |
| Language selection | Thai output only | English output only |
| Rules versus preferences | Royal Institute rules vs editorial preferences | Established grammar vs style-guide preferences |
| Output formats | audit, rewrite, file preview, new content | same, plus "already natural" |
| Counts | 14 patterns, 7 references | 26 patterns, 9 references |

Pattern counts differ because the languages differ: English has more
stock-phrase and structural tells to catalogue; Thai concentrates on
translation, nominalization, connectors, terminology and register.

## Conventions: rules versus preferences

`english-conventions.md` separates established grammar rules (apostrophes,
agreement, homophones, brand capitalization, consistency) from style-guide
preferences. Preferences are attributed to the guides that state them, read
2026-10-17: Google's developer style guide (sentence-case headings, serial
comma, US spelling, second person, active voice), Microsoft's style guide
(contractions, sentence-style capitalization, serial comma, closed em dashes,
brevity) and published hyphenation guidance (hyphenate before a noun, leave
open after, with British variation). The file states that a project's own
guide wins; no rule is invented.

## Package shape and budgets

| File | Lines | Load when |
|---|---|---|
| `SKILL.md` | 164 | Native discovery match |
| `protected-content.md` | 83 | Every run |
| `patterns-staging-and-rhythm.md` | 125 | Every audit, rewrite or new content |
| `patterns-inflation-and-claims.md` | 73 | same |
| `patterns-format-and-reader.md` | 82 | same |
| `english-conventions.md` | 99 | Language, spelling, punctuation or style-guide questions |
| `website-content.md` | 61 | Website, app, localization, CMS or SEO copy |
| `content-creation.md` | 64 | New content, developer communication, README prose |
| `output-formats.md` | 68 | Formatting the output |
| `upstream-notice.md` | 90 | Only when asked about origin or licence |

Eight checklists and one template; no recipes, capabilities, scripts, hooks,
assets or runtime dependencies. All files are Markdown.

**Metadata budget (measured).** Names are 19 characters each; descriptions are
354 (Thai) and 344 (English). Actual L0 is **6,221 / 6,500**, leaving **279**
(95.7 percent used). The Step 36 planned English record was 206 characters,
so the projection of 5,940 rose by 138 when the real description replaced it.
No budget increase was needed or made. The Entry Skill ceiling of 15 is now
reached: 13 engineering plus 2 editorial. V-07b maximum overlap is 0.24
(English versus Thai, under the 0.25 target; engineering pairs are at most 0.11).

**Description derivation.** Candidates were scored against all existing trigger
cases with the simulated lexical proxy before any content was written:

| Candidate | Change | Original cases whose pick changed |
|---|---|---|
| C1 | names "Thai text" and "code" in the boundary clause | 3 (two wrong-language) |
| C2 | "Not for Thai text, checking docs against the repository, or software changes" | 3 (two wrong-language) |
| C4/C6 | "non-English output" in place of "Thai text", mirroring the Thai skill | 2 |
| **Final** | C6 with "blogs" and "fiction" excluded | 2 |

Naming Thai in the English boundary clause pulled Thai prompts toward the
English skill because the proxy cannot read negation; "non-English output" is
the symmetric counterpart of the Thai skill's "non-Thai output".

## Routing conflicts (simulated, not native)

The proxy is a lexical BM25 replica of the evaluation suite's Level 2. It
cannot read Thai script or negation and is not routing evidence.

| Measure | Result |
|---|---|
| Original 199 cases, pick changed when the English skill joins | 2: `amb-cache-catalogue` (performance to English, via the word "product"; an ambiguous case) and `pos-humanizer-th-rewrite-blog` (Thai to none; a threshold shift) |
| English positives routed to the Thai skill | 0 of 8 |
| Thai-script prompts routed to the English skill | 1 of 11: `pos-humanizer-th-rewrite-blog`, a 0.02 near-tie (1.93 vs 1.91) on the single token "developer" |
| New cases the proxy misses | 4: `pos-humanizer-en-audit-blog` (no pick), `pos-humanizer-en-dev-blog` (documentation), `amb-app-store-copy` and `uns-detector-evasion-english` (AI engineering, via the token "AI") |
| Suite proxy, HEAD to now | top-1 0.529 to 0.535, top-3 0.757 to 0.771, precision 0.503 to 0.51, no-match 0.462 to 0.488, ambiguous 15/24 to 17/27 |

Structural conflicts that only native runs can resolve:

- **Documentation skill.** It names READMEs, PR descriptions, review comments
  and release notes. The English skill covers the wording of the same
  artifacts. Cases `pos-humanizer-en-readme-prose`,
  `amb-readme-commands-and-wording` and `amb-review-reply-leads-with-decision`
  record the overlap; the first is a positive that native runs may reject.
- **Frontend skill.** UI copy in `.tsx` files; `amb-button-copy-and-loading-state`
  accepts the frontend, implementation or English skill.
- **Wrong language.** Handled by the descriptions' symmetric boundary clauses
  and by `forbid` entries: the eight Thai cases forbid the English skill and
  every English positive forbids the Thai skill.
- **Scope change to older cases.** `neg-app-store-copy` and
  `neg-thai-request-english-email` expected no skill. Marketing copy now has an
  editorial owner, so both became ambiguous cases (`amb-app-store-copy`,
  `amb-thai-request-english-email`) that allow the English skill but no
  engineering skill and not the Thai skill. V-16 reserves the negative category
  for pure "none" expectations, hence the rename.

## Test design

| Layer | File | Content | Status |
|---|---|---|---|
| Routing | `tests/skills/trigger-cases.json` | 15 new cases (8 positive, 3 negative, 3 ambiguous, 1 unsupported) plus 10 edited; regenerated Claude evals | Static sync PASS; native runs NOT_RUN |
| Behavior specifications | `tests/editorial/humanizer-en-cases.json` | 102 cases: positive 27, false-positive 26, natural-unchanged 6, semantic-preservation 7, technical-terms 6, us-uk 5, website 7, audit-only 3, creation 3, security 5, negative 7 | Structure PASS; behavior NOT_RUN |
| Static gate | `tools/validate/check-editorial-cases.mjs` (G-15) | Both skills: inventory, schema, coverage, text types, independence | PASS |
| Validator negative controls | `tests/catalog/editorial-mutations.json` | 13 Step 36/37 controls retargeted, 3 new registration controls, 7 new G-15 controls | PASS |

The behavior specifications cover the requested types: AI-generated marketing
prose, technical documentation, developer blog posts, natural writing that
must stay unchanged, meaning preservation, technical terms, US and UK English,
wrong-language routing and website edits that must not break code.

## Unresolved quality questions (for Step 40 and a fluent reviewer)

1. Do the 26 patterns, adapted from a Wikipedia-oriented list, match what
   generated developer and marketing English actually does today? Word
   habits change with every model release.
2. Do the false-positive guards prevent over-editing of natural, formal and
   brand-voice English? The unchanged-text cases specify the expectation but
   are NOT_RUN.
3. Is the hyphenation and dash handling right for the projects that will use
   it, or should a style guide be required before edits?
4. Does native routing choose this skill for prose-quality requests without
   taking README fact-checking from the documentation skill, and stay silent
   on grammar questions, translation and fiction?
5. Is shipping the MIT notice as a reference file the licensing outcome the
   owner wants, and should a repository-level notices file follow the licence
   decision?
