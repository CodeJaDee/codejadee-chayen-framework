---
kind: checklist
---
# Technical English for IT documents

Review and write technical English so a reader understands the system
accurately. The lens covers grammar, register and clarity. It never changes
a specification. For natural writing of general prose, such as articles and
marketing copy, the chayen-humanizer-en skill applies; this checklist keeps
only the principles that matter for technical documents.

## Protected spans

Mark these before editing and compare them after. Change one only when the
user asks for that exact change.

- Identifiers: system, component, service, interface, table, column, class,
  function, queue, topic, environment and configuration key names, in their
  original spelling and capitalization.
- Numbers, units, ranges, versions, dates, limits and thresholds.
- Hostnames, addresses, ports, paths, URLs and commands.
- Requirement keywords and their strength (see below).
- Conditions, exceptions, sequence and scope words: "only", "unless", "at
  least", "all", "per request", "before", "after".
- Quoted text, approved wording and cross-references.

## Requirement language

Keep the obligation level exactly as written. Do not strengthen or weaken.

| Keyword | Meaning to preserve | Common editing trap |
|---|---|---|
| MUST, SHALL | Absolute requirement | Changing to "should" or "will" for tone |
| MUST NOT, SHALL NOT | Absolute prohibition | Rewriting as "should avoid" |
| SHOULD | Recommended, with justified exceptions | Hardening it to "must" |
| MAY | Optional | Turning it into a statement of fact |

Descriptive "will" and "can" are not requirement keywords. If a document
mixes keyword and non-keyword wording and the intent is unclear, keep the
text and raise a question; do not normalize it silently.

## Editorial checks

| Area | What to check |
|---|---|
| Grammar and spelling | Agreement, tense, articles, plural nouns, typos |
| Register | Neutral, precise, third person; no marketing language or inflated claims |
| Sentence construction | One idea per sentence; the subject and the action are clear |
| Voice | Active voice when the actor is known and supported; passive is acceptable when the actor is unknown or irrelevant |
| Ambiguity | Pronouns with unclear referents, "it", "this", "they"; unclear scope of "all" or "any"; unclear schedule or frequency |
| Terminology | One term per concept across the document; a defined glossary term is used as defined |
| Acronyms | Expanded at first use, then used consistently; defined in the glossary if the document has one |
| Capitalization | Product, component and environment names capitalized consistently; headings in one style |
| Procedures | Numbered steps; one action per step; the expected result stated; preconditions first |
| Redundancy | Repeated phrasing and filler removed without removing a fact |
| Spelling variety | The project's convention; US English when none is stated, applied consistently |

## Editing without changing the design

An English correction must not become a technical decision. Supply no actor,
frequency, mechanism or condition the source does not state.

| Original | Safe action |
|---|---|
| "The data will be send to another system every day." | Fix the grammar and keep the claim: "The data is sent to another system every day." The actor and the schedule stay as stated |
| Same sentence, with evidence that the application sends it on a schedule | "The application sends the data to the external system daily." Cite the evidence for the actor and the schedule |
| "The system should validate input." with a rule elsewhere saying MUST | Report the inconsistency; do not pick one |
| "The service retries failed calls." | Do not add a retry count or interval; ask for the configured values |

When the source does not name the actor, use a passive or neutral
construction and raise the missing actor as a question. When a correction
would change meaning, show the original, the suggested wording and the
reason, and mark it for the owner.

## Patterns to remove, carefully

Remove filler and stock phrasing only when no fact goes with it.

- Intensifiers and vague claims: "robust", "seamless", "state of the art",
  "best in class", "highly scalable" with no supporting figure. Flag the
  claim as unsupported rather than deleting a statement that might carry a
  requirement.
- Repeated openers and summaries that restate the previous sentence.
- Stacked qualifiers and nominalizations ("perform the validation of" for
  "validate"), when the shorter form is exact.

## Verification

- Compare protected spans between the original and the edited text, item by
  item (PASS or FAIL).
- Confirm no requirement keyword changed strength.
- Confirm that no actor, schedule, mechanism or value was added.
- Confirm the glossary and acronym usage stayed consistent after the edit.
- Report any change you were unsure about as a question, not a correction.
