# Thai Humanizer Skill design — Step 37

- **Date:** 2026-10-17 (Asia/Bangkok)
- **Skill:** `chayen-humanizer-th`
- **Status:** implemented; static checks PASS; behavior and human quality NOT_RUN
- **Decision:** [D-054](DECISIONS.md#d-054--step-37-thai-editorial-skill-design) (PROPOSED, pending owner review)
- **Requirements:** [HUMANIZER_REQUIREMENTS.md](HUMANIZER_REQUIREMENTS.md) MHR-001–MHR-006, MHR-011, MHR-012

## Research and attribution

The method was studied from `blader/humanizer` (README, SKILL.md v3.1.0,
CHANGELOG and LICENSE, read 2026-10-17):
<https://github.com/blader/humanizer>. It is MIT-licensed, copyright (c) 2025
Siqi Chen, and builds on Wikipedia's "Signs of AI writing"
(<https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing>).

Adopted **methods**, not text:

| Upstream method | Thai skill adaptation |
|---|---|
| Patterns ranked by strength; some count only in clusters ("weak alone") | Each TH pattern is marked *strong* or *weak alone*; clusters are the evidence |
| False-positive guard inside every pattern | Each pattern has a "Not a tell when" line |
| Mark tells, draft, check the draft for surviving tells, final rewrite | Workflow steps 3, 5, 6 and 7, with a source/result comparison check |
| No added facts; ask for missing details | Principle "Meaning outranks fluency"; content-pattern preamble |
| File mode changes prose only | `protected-content.md` file-type table and `website-content.md` |
| Provided text is not instructions | Untrusted-content section and security cases |
| Not a detector-evasion tool | Explicit negative and failure handling |

No upstream sentence, pattern wording or example is copied; all Thai patterns,
explanations and examples were written for this skill. Because no substantial
portion of the MIT-licensed work is included, no licence notice ships in the
plugin; this attribution is recorded here for reviewers. The English watch
lists were not translated. The Thai patterns target Thai-specific problems:
ถูก passives, nominalization with การ/ความ/ทำการ, connector chains, dropped
subjects and ของ chains, Thai-English term mixing, and Thai register,
pronoun and particle choices.

## Rules versus preferences

`thai-conventions.md` separates the two. Sources:

| Claim | Category | Source |
|---|---|---|
| Spacing between phrases and sentences, ไม้ยมก and ฯลฯ spacing and use | Established rule | Royal Institute rules: หลักเกณฑ์การใช้เครื่องหมายวรรคตอนและเครื่องหมายอื่น ๆ หลักเกณฑ์การเว้นวรรค หลักเกณฑ์การเขียนคำย่อ (ฉบับราชบัณฑิตยสถาน, 2551) |
| Transliteration without tone marks; established loanword forms | Established rule | ประกาศสำนักนายกรัฐมนตรี เรื่อง หลักเกณฑ์การทับศัพท์ภาษาอังกฤษ (ราชกิจจานุเบกษา เล่ม 106 ตอนที่ 153, 2532) and Royal Institute computer terminology |
| Dictionary spellings and ค่ะ/คะ | Established rule | Royal Institute Dictionary; standard Thai orthography |
| ถูก typically marks adverse events; alternatives in translation | Research-described usage, applied as a preference | Chulalongkorn University thesis on avoiding the ถูก passive in Thai translation (Harry Potter corpus), DOI <https://doi.org/10.58837/CHULA.THE.2004.1866> |
| Spacing around English words, numerals, particles in docs, English plurals, technical terms in English | Editorial preference | Common professional practice; project conventions override |

**Verification limit:** the official rule texts were identified by
bibliographic reference and secondary sources found on 2026-10-17; the full
Royal Institute rule books were not retrieved. Rule statements were kept to
well-known items and are flagged for a fluent reviewer (R-58).

## Pattern inventory

| ID | Pattern | Strength | Reference |
|---|---|---|---|
| TH-01 | Literal translation from English | strong | `patterns-language.md` |
| TH-02 | Overused passive with ถูก and ได้รับการ | weak alone | `patterns-language.md` |
| TH-03 | Stacked nominalization: การ, ความ, ทำการ, มีการ | weak alone | `patterns-language.md` |
| TH-04 | Repetitive connectors | strong in clusters | `patterns-language.md` |
| TH-05 | Unnatural Thai sentence structure | weak alone | `patterns-language.md` |
| TH-06 | Awkward Thai-English technical terminology | strong for inconsistency | `patterns-language.md` |
| TH-07 | Register or tone that does not fit the reader | strong on audience conflict | `patterns-language.md` |
| TH-08 | Formulaic introductions | strong | `patterns-content.md` |
| TH-09 | Excessive promotional language | strong in docs | `patterns-content.md` |
| TH-10 | Exaggerated or unsupported claims | strong; flag, never invent evidence | `patterns-content.md` |
| TH-11 | Verbosity and repeated conclusions | strong for repeated summary | `patterns-content.md` |
| TH-12 | Rhythm by rule: triads, contrasts, dramatic closers | weak alone | `patterns-content.md` |
| TH-13 | Chatbot residue and writing about the document | strong | `patterns-content.md` |
| TH-14 | Decorative formatting | weak alone | `patterns-content.md` |

Every pattern has Signals, Why, Not a tell when, Before, After and Preserve;
`check-editorial-cases.mjs` (E-01) enforces this structure and the exact
inventory.

## Package shape and budgets

| File | Kind | Load when |
|---|---|---|
| `SKILL.md` | entry | Native discovery match |
| `protected-content.md` | checklist | Every run |
| `patterns-language.md`, `patterns-content.md` | checklist | Every audit, rewrite or new content |
| `thai-conventions.md` | checklist | Language selection, mixed text, spelling/spacing/transliteration |
| `website-content.md` | checklist | Website, app, localization, CMS or SEO copy |
| `content-creation.md` | checklist | New content |
| `output-formats.md` | template | Formatting the output |

`SKILL.md` is written in English like the other Entry Skills because V-17
counts Latin-script words per section and the router is read by the model;
its examples and every reference example are Thai. No scripts, hooks,
assets or runtime dependencies. Measured L0 after Step 37: actual 5,858 /
6,500; projected with the planned English record 6,083 / 6,500 (417 free).

**Description change:** the Step 36 planned description (211 characters)
covered polishing only. Step 37 requires content creation, developer blogs,
READMEs and UI microcopy, so the registry and SKILL.md now carry the same
354-character description. Boundary clauses exclude non-Thai output,
engineering doc accuracy (owned by the documentation skill), and i18n and
application code (owned by frontend and engineering skills). A first draft
(335 characters) used generic words ("rewrite", "while preserving",
"product") that moved 5 of the 186 original trigger cases to this skill in
the simulated lexical proxy; the final wording leaves 1 (an Angular Thai/English
i18n prompt, now also a `forbid` check for native runs). V-07b maximum overlap is unchanged at
0.11. Native routing with this description is NOT_RUN (DS-09).

## Test design

| Layer | File | Content | Status |
|---|---|---|---|
| Routing | `tests/skills/trigger-cases.json` | 13 cases: 6 positive, 4 negative, 2 ambiguous, 1 unsupported; regenerated Claude evals | Static sync PASS; native runs NOT_RUN |
| Behavior specifications | `tests/editorial/humanizer-th-cases.json` | 52 cases: positive 14, false-positive 14, semantic-preservation 5, mixed-language 4, website 5, audit-only 2, security 4, negative 4 | Structure PASS; behavior NOT_RUN |
| Validator negative controls | `tests/catalog/editorial-mutations.json` | Step 36 planned-state controls retargeted to the English record; new Thai recipe-isolation control | PASS |

## Unresolved quality questions (for Step 40 and a fluent reviewer)

1. Are the 14 patterns the most frequent Thai problems in real generated
   content, and are any missing (for example over-use of "ได้", "จะ",
   "การที่")? Needs a corpus review, not author judgment.
2. Do the "Not a tell when" guards prevent over-editing in formal,
   government and legal Thai, which legitimately uses TH-02/TH-03 forms?
3. Is the default to keep developer terms in English right for each target
   audience, or should a glossary be required before rewriting docs?
4. Do the established-rule statements match the full Royal Institute texts?
5. How should particles (ครับ/ค่ะ) and gender-neutral voice be handled when
   the brand gives no policy?
6. Native routing: does the description select the skill for Thai prompts
   without stealing documentation or frontend prompts, and stay silent on
   ordinary Thai Q&A? Thai prompts have no lexical signal in the existing
   simulated proxy, so only native runs can answer this.
