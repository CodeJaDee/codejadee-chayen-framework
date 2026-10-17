---
kind: checklist
---
# English patterns: staging and rhythm (EN-01 to EN-11)

Structural habits that make English text sound generated: sentences that
signal importance instead of adding a fact, and rhythm applied by rule.
These habits persist across tools and years, so they matter more than any
word list. Each pattern is a signal to examine, never a banned phrase.

## How to use these patterns

- **Strength.** A *strong* pattern justifies an edit on one clear sighting.
  A *weak alone* pattern needs other signals in the same passage before you
  change anything. Several patterns together are the evidence.
- **Add nothing.** Every "After" below uses only facts already present in its
  "Before". If the natural version needs a fact the source lacks, ask for it
  or write a plainer sentence.
- **Fix the sentence, not the phrase.** State the point the way the writer
  would say it to this reader. Swapping one stock phrase for another is not
  an edit.
- **Check the larger shape.** A contrast split across two sentences, three
  parallel examples, or the same closer after every section is the same
  pattern at paragraph scale.
- **Leave natural text alone.** A matching phrase in otherwise natural,
  deliberate writing is not a finding.

## EN-01 Not X but Y (strong)

- **Signals:** "not just X, but Y", "it's not about X, it's about Y", "X isn't merely Y, it's Z", "rather than X, Y"; the same contrast split across two sentences ("This doesn't mean X. It means Y."); a clipped negative tail ("no fluff", "no guesswork").
- **Why:** The negative half names something nobody claimed, so the positive half sounds bigger. It adds weight without adding information.
- **Not a tell when:** the negative half corrects a belief the reader actually holds ("Despite the name, the cache is not persistent"), both halves carry information, or the negation is a real limitation ("not supported on Windows").
- **Before:** "Our dashboard isn't just a reporting tool; it's a command center that shows every team's open tasks and deadlines in one place."
- **After:** "The dashboard shows every team's open tasks and deadlines in one place."
- **Preserve:** the factual claim in the positive half, and every real negation or limitation. Do not turn "not supported" into a positive claim.

## EN-02 One-line closers and dramatic fragments (strong)

- **Signals:** a one-sentence paragraph restating the one before ("And that's what makes it fast."); "Let that sink in."; the same closer after every section; a row of fragments ("No lag. No clutter. No compromise."); a sentence after an example that names what it showed ("This shows why testing matters.").
- **Why:** The line asks the reader to pause on a claim instead of adding to one.
- **Not a tell when:** the short sentence adds a new fact or consequence ("The migration cannot be undone."), or short punchy lines are the writer's deliberate, sparing voice.
- **Before:** "Pagination keeps responses small. And that's what makes it fast. Indexes keep lookups cheap. And that's what makes it fast."
- **After:** "Pagination keeps responses small. Indexes keep lookups cheap."
- **Preserve:** any closer that states a fact, limit, deadline or consequence. Merge a fragment row into one sentence only if every claim in it survives.

## EN-03 Sayings that sound deep (strong)

- **Signals:** "at its core", "the real question is", "what really matters", "the heart of the matter", "X is the language of Y", "X is a journey, not a destination", "a mirror of".
- **Why:** An ordinary point is dressed as a hidden truth, and the dressing adds no detail.
- **Not a tell when:** the phrase sits in a quotation, a title or a proper name, or a personal essay uses a genuine aphorism the writer owns.
- **Before:** "At its core, observability is the language of trust: dashboards, traces and logs that show what each service is doing."
- **After:** "Observability means dashboards, traces and logs that show what each service is doing."
- **Preserve:** the specific claim that follows the saying.

## EN-04 Staged run-ups and announcements (strong)

- **Signals:** "Let's dive in", "Here's what you need to know", "Without further ado", "Buckle up", "Let's break this down", "Here's the thing", "Quick note before we start", and "Honestly?" as a standalone opener before a routine claim.
- **Why:** The writer announces the point or stages a moment of candor instead of making the point. Remove the run-up, not just its tone.
- **Not a tell when:** "honestly" or "let's" sits inside a normal sentence, or a conversational tutorial says "Let's start with..." and the next words are the first real step.
- **Before:** "Let's dive into how connection pooling works. Here's what you need to know: a pool keeps 10 connections open by default and reuses them between requests."
- **After:** "A connection pool keeps 10 connections open by default and reuses them between requests."
- **Preserve:** defaults, numbers and the steps of a tutorial.

## EN-05 Arguing with no one (strong)

- **Signals:** "To be clear,", "I'm not saying...", "This isn't about...", "Don't get me wrong", "You might think... but", "A tempting approach would be... but", where the objection or option appears nowhere else in the text.
- **Why:** The text answers an objection or rejects an option that nobody raised, usually a leftover from an earlier draft.
- **Not a tell when:** the objection is attributed to a named person or answered in full, an FAQ answers a real question, or a design record lists a rejected alternative with its reasons.
- **Before:** "This isn't about writing more tests, and I'm not saying coverage doesn't matter. The goal is to catch regressions before release."
- **After:** "The goal is to catch regressions before release."
- **Preserve:** alternatives and rationale in decision records, and any objection the reader would actually weigh.

## EN-06 Forced triads (strong in clusters)

- **Signals:** lists of three where the items overlap ("fast, efficient, and reliable"), three parallel examples, three short facts followed by a lesson, "innovation, inspiration and insights".
- **Why:** Ideas arrive in threes to sound complete, whether the meaning has three parts or not.
- **Not a tell when:** the meaning has three distinct items (API, CLI and SDK), or the triad is a fixed name such as "development, staging and production".
- **Before:** "Our platform is fast, efficient, and reliable: median page load is 180 ms."
- **After:** "Median page load is 180 ms."
- **Preserve:** every real item and every figure. Keep three items when the meaning needs three.

## EN-07 Repeated sentence openings (weak alone)

- **Signals:** three or more consecutive sentences that start with the same word ("We", "This", "It", "You"), chosen by habit rather than for effect.
- **Why:** Repetition is handled by rule instead of by ear, so the rhythm is flat.
- **Not a tell when:** the repetition is parallel rhythm on purpose, release-note bullets that all begin with a verb such as "Fixed", or numbered steps that begin with an imperative.
- **Before:** "This release fixes the startup crash. This release updates the default theme. This release drops support for Node 16."
- **After:** "This release fixes the startup crash, updates the default theme and drops support for Node 16."
- **Preserve:** changelog bullet conventions and the exact list of changes. Do not ban a repeated word; one remaining sentence may still start with it.

## EN-08 Dashes as the universal connector (weak alone)

- **Signals:** an em dash or a spaced en dash in nearly every paragraph where a comma, colon, period or parentheses would do; a double hyphen used as a dash.
- **Why:** A dash lets the writer skip choosing how two clauses relate. Many editors and some style guides use dashes freely, so one dash is not a finding; a text full of them is.
- **Not a tell when:** the project's existing text uses dashes at a similar rate, the style guide specifies them, the dash marks a numeric range (2019–2021), or the character sits in code, a command flag (`--verbose`), a URL, a file name or a negative number.
- **Before:** "The new API—released last week—replaces the old one—which will be removed in v3."
- **After:** "The new API, released last week, replaces the old one, which will be removed in v3."
- **Preserve:** everything inside code spans and commands, and the writer's dash rate when a sample or the surrounding text shows one. Match the document, not a personal rule.

## EN-09 Stacked qualifiers (weak alone)

- **Signals:** "could potentially", "might possibly", "may in some cases", "it is also worth noting that this could arguably", a hedge added to every claim.
- **Why:** Repeated editing adds one qualifier after another, usually to repair an earlier overstatement rather than to report real doubt.
- **Not a tell when:** the qualifier is supported by the source and the meaning needs it, such as a real scope limit ("on ARM only"), a legal or safety caveat, or genuine uncertainty ("in our tests on one device").
- **Before:** "This change could potentially help improve performance."
- **After:** "This change may improve performance."
- **Preserve:** genuine uncertainty, named scope ("in some browsers", "in beta") and any hedge the source states. Never turn a hedge into a certainty.

## EN-10 Passive voice and missing subjects (weak alone)

- **Signals:** sentences that hide an actor the reader needs, such as a privacy or security statement that never says who stores or shares the data; instructions with no subject.
- **Why:** The reader cannot tell who or what acts.
- **Not a tell when:** the actor is unknown or irrelevant, the register is formal or scientific, an API description reads naturally in the passive ("Returns null if not found"), or the style guide allows it.
- **Before:** "The invoice is generated by the billing service and is sent to the customer by email."
- **After:** "The billing service generates the invoice and emails it to the customer."
- **Preserve:** the actor stated in the source. Do not invent one such as "the system" or "we" when the source does not say.

## EN-11 Copula avoidance (strong in clusters)

- **Signals:** "serves as", "stands as", "functions as", "boasts", "features" or "offers" where "is" or "has" would do, "represents", "marks".
- **Why:** A simple verb is replaced with a longer phrase that sounds more formal and says the same thing.
- **Not a tell when:** the verb is accurate, such as "acts as a write-through layer" describing a role beside the thing's main purpose, or "offers free shipping" in commerce copy.
- **Before:** "The settings page serves as a central hub and boasts three tabs."
- **After:** "The settings page is a central hub with three tabs."
- **Preserve:** nuance of role (acts as versus is) and any figure.
