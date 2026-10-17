---
kind: checklist
---
# English patterns: inflation, authority and claims (EN-12 to EN-18)

Ordinary facts dressed as pivotal, expert-backed or exceptional. The fact
underneath is usually sound: keep it and remove the dressing. Claims that
cannot be supported are flagged for the owner, never repaired by inventing
evidence. Apply the strength and add-nothing rules from
`patterns-staging-and-rhythm.md`.

## EN-12 Overused AI words and marketing buzzwords (strong in groups)

- **Signals:** prose words such as delve, tapestry, testament, pivotal, crucial, vibrant, intricate, showcase, underscore, foster, garner, enhance, "key" as an adjective, "landscape" as an abstract noun, "deep dive"; and marketing buzzwords such as leverage (for "use"), utilize, seamless, unlock, empower, supercharge, game-changer, cutting-edge, state-of-the-art, holistic, best-in-class, turnkey.
- **Why:** These words appear far more often in generated text than in human writing, especially in groups. Word habits change with every model release, so the groups matter more than any single word.
- **Not a tell when:** the word has its technical sense ("robust standard errors", "a CI gate", "leverage" in finance or physics), it is a product or feature name ("Unlock Pro"), or it is a single formal word with no company.
- **Before:** "Our robust, cutting-edge platform leverages machine learning to seamlessly surface trends in your sales data."
- **After:** "The platform uses machine learning to surface trends in your sales data."
- **Preserve:** product and feature names, technical meanings, and the concrete capability (machine learning, sales data).

## EN-13 Inflated significance (strong)

- **Signals:** "marks a pivotal moment", "stands as a testament to", "plays a crucial role in shaping", "setting the stage for", "paving the way", "the future looks bright", "exciting times ahead", "a step in the right direction"; a stock "Challenges and future outlook" section; a send-off paragraph.
- **Why:** An ordinary detail is said to mark a change, prove a legacy or promise a future, at the scale of a phrase, a section or a closing paragraph.
- **Not a tell when:** the significance is stated with specifics the source supports, such as an end-of-support date or a migration deadline, or the text is a retrospective written from evidence.
- **Before:** "Version 4.0, released in March 2025, marks a pivotal moment in the evolution of the library, setting the stage for a bright future."
- **After:** "Version 4.0 was released in March 2025."
- **Preserve:** dates, version numbers and concrete consequences. End on the last concrete fact; use real plans only if the source states them.

## EN-14 Shallow -ing riders (strong in clusters)

- **Signals:** a clause tacked onto the end of a fact with ", highlighting...", ", ensuring...", ", reflecting...", ", underscoring...", ", fostering...", ", showcasing...", "contributing to...".
- **Why:** The rider makes a simple fact sound deeper without adding anything checkable. Attaching it to a named source does not make it true.
- **Not a tell when:** the -ing phrase carries a real, checkable result or mechanism ("returning a 404 when the file is missing").
- **Before:** "The tool caches build outputs, ensuring faster builds and highlighting our commitment to developer productivity."
- **After:** "The tool caches build outputs, so repeat builds are faster."
- **Preserve:** results the source supports and the mechanism (caching build outputs). Drop the rider only when it asserts something the source does not.

## EN-15 Sales language and promotional adjectives (strong in documentation, weak alone in marketing)

- **Signals:** "stunning", "breathtaking", "world-class", "unparalleled", "effortless", "blazing-fast", "must-have", "game-changing", "renowned", "nestled in the heart of", attached to facts that could be stated plainly.
- **Why:** The text reads like an advertisement where the reader wanted a description.
- **Not a tell when:** the page is marketing copy in a deliberately promotional brand voice (reduce stacking, keep the energy and one concrete benefit), the phrase is an approved tagline, or it appears in a quoted testimonial.
- **Before:** "Our stunning, blazing-fast editor delivers an effortless writing experience with autosave every 30 seconds."
- **After:** "The editor autosaves every 30 seconds."
- **Preserve:** product names, specifications and the strongest concrete benefit.

## EN-16 Vague attribution and borrowed authority (strong when unsupported)

- **Signals:** "experts agree", "studies show", "industry reports suggest", "some critics argue", "trusted by leading companies", "as seen in" followed by a list of prestigious outlets, and "associated with", "connected to" or "linked to" where the relationship is never named.
- **Why:** An unnamed authority props up a claim, or a vague link hides what the relationship actually is.
- **Not a tell when:** the source names the authority and what it said, a customer logo or press mention is something the owner can show, or a missing citation is simply how most writing works.
- **Before:** "Industry experts believe the 2024 benchmark published by Acme Labs shows the library is the fastest option."
- **After:** "Acme Labs' 2024 benchmark ranks the library as the fastest option."
- **Preserve:** every named source and citation. When the authority is unnamed and nothing in the source identifies it, flag the claim for the owner; do not invent a source and do not guess a role for a vague link.

## EN-17 Unsupported or exaggerated claims (strong; flag, never invent evidence)

- **Signals:** absolutes ("100% reliable", "zero downtime", "never fails", "guaranteed"), unbacked superlatives ("fastest", "#1", "best-in-class"), round multipliers ("10x faster") with no stated measurement, "military-grade".
- **Why:** Inflated claims cost trust, and some carry legal or advertising risk for the owner. Generated text tends to inflate.
- **Not a tell when:** the text states the evidence (conditions, dataset, date, a named certification), or the user confirms the claim is verified and wants it kept.
- **Before:** "Our plugin is 100% reliable and makes builds 10x faster."
- **After (audit finding, no rewrite):** "Neither claim can be checked from the text. Say what was measured, on what and against what; the owner must confirm before any change."
- **Preserve:** every figure exactly. Do not delete, soften or round a claim without the owner's agreement, and never add a benchmark, certification or source.

## EN-18 Filler and redundancy (strong for padded phrases)

- **Signals:** "in order to", "due to the fact that", "it is worth noting that", "at this point in time", "a number of", "is able to", "the vast majority of", "basically", doubled pairs ("each and every", "plan ahead"), a closing paragraph that restates the introduction.
- **Why:** Words that carry nothing slow the reader. Shorter is easier to scan, provided nothing the reader needs is lost.
- **Not a tell when:** the longer form is deliberate emphasis, "it is worth noting" introduces a real exception (keep the exception), or a long report requires a summary section.
- **Before:** "In order to install the package, it is worth noting that you need to have Node 20 or higher installed."
- **After:** "To install the package, you need Node 20 or higher."
- **Preserve:** version constraints, obligations (need, must) and every exception.
