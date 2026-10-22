# Guidance Invariants

| Field | Value |
|---|---|
| Introduced | Evolution Step 09, 2026-10-22 |
| Checker | `tools/validate/check-guidance.mjs` (gate G-18) |
| Canonical definitions | `tools/validate/guidance-invariants.json` |
| Regression tests | `tests/skills/guidance-consistency.test.mjs` (gate G-18T) |
| Scope | Every Markdown file under `plugins/codejadee-chayen-framework/skills/` |

The checker keeps a small set of policy rules consistent when Entry Skills,
recipes, templates or workflows are edited. It does **not** prove that the
guidance is consistent in meaning. It enforces explicit invariants in two
ways:

- **Structural anchors.** The authoritative section, table or numbered step
  must still carry a short key phrase. For example, the task-contract
  recipe's Procedure must still say "clarify … before any edit", before its
  decision table.
- **Narrow contradiction patterns.** Only definitional or claiming sentences
  are matched, for example "accept when …", "… counts as PASS" or "approval
  of the contract covers …". A sentence is skipped when a negation appears
  inside the match or just before it.

Emphasis markers and line breaks are ignored, so rewrapping or bolding text
never changes a result.

```bash
node tools/validate/check-guidance.mjs                # whole package
node tools/validate/check-guidance.mjs --root <copy>  # a disposable copy
node --test tests/skills/guidance-consistency.test.mjs
```

| Level | Meaning | Exit code |
|---|---|---|
| `ERROR` | An anchor is missing or a contradiction pattern matched. Fix the content, or change the invariant through its decision record. | 1 |
| `REVIEW` | A heuristic signal a person should look at (G-15 review). It never fails the build. | 0 |
| `PASS` | No `ERROR` for that invariant. | 0 |

## Invariants

| ID | Name | Authoritative source |
|---|---|---|
| GI-01 | task-contract-decision | `chayen-implementation/references/task-contract.md` |
| GI-02 | action-specific-approval | `chayen-implementation/references/task-contract.md` |
| GI-03 | acceptance-verdicts | `chayen-implementation/references/change-summary.md` |
| GI-04 | completion-outcome | `chayen-implementation/references/change-summary.md` |
| GI-05 | check-status-honesty | `chayen-testing/SKILL.md` status table; change-summary step 3 |
| GI-06 | source-of-truth-precedence | Every `SKILL.md` Principles section; D-065 |
| GI-07 | advisory-not-enforcement | D-003; SKILL_AUTHORING_STANDARD §4.3 |
| GI-08 | skill-ownership-and-handoff | D-016, DR-04, ADR-0006 |
| GI-09 | workflow-exit-and-verification | SKILL_AUTHORING_STANDARD §5.4; change-summary recipe |

The full statements, and the split between machine checks and human
review, are in `guidance-invariants.json`. Each invariant has a single
authoritative source; other files may summarize it but must not contradict
it.

### GI-01 task-contract-decision

An unclear request is clarified in one message before any edit, however
small. Then: any risky action gets a full contract, several files or layers
get a proportional contract, and a fully specified low-risk change gets no
contract and no questions.

| Diagnostic | Meaning and fix |
|---|---|
| `Procedure no longer requires clarifying an unclear request before any edit` | The recipe lost the clarification rule. Restore "clarify … before any edit". |
| `the clarification rule no longer applies "however small"` | Small ambiguous requests could bypass clarification. Restore the qualifier. |
| `clarification must be decided before the contract table` | The decision order changed, so an unclear small change could take the no-contract path. Keep clarification first. |
| `decision table has no "<path>" path` | A contract path disappeared from the table. |
| `no workflow step delegates … to the task contract recipe` / `workflow step N no longer …` | The entry skill's summary drifted from the recipe. |
| `the recipe's load condition no longer covers unclear requests` | The recipe might not load when clarification is needed. |
| `restates a file-count contract rule outside the task-contract recipe` | A second eligibility rule appeared. Refer to the recipe instead. |
| `lets an unclear request proceed on a guessed interpretation` | Contradicts clarification-first. |

### GI-02 action-specific-approval

Each risky action needs approval of that exact action and target. Confirming
a description or contract is never approval.

| Diagnostic | Meaning and fix |
|---|---|
| `no longer requires approval of the exact action and target` | The recipe's gate became generic. |
| `no longer says that confirming the description or contract is never approval` | Restore the statement (in the gate step or the Rules). |
| `Safety boundaries no longer say that contract approval is not approval of each risky action` | Implementation entry skill. |
| `weakens action-specific approval: "…"` | A sentence says contract approval or confirmation covers, implies, counts as or authorizes approval. |

### GI-03 acceptance-verdicts

accept means fresh, adequate observed evidence shows the criterion is met.
verify_more means the evidence is missing, partial, stale, not reproducible
or inadequate. revise means the evidence contradicts the criterion.

| Diagnostic | Meaning and fix |
|---|---|
| `defines accept with missing or unexecuted evidence` | A definitional clause ("accept when …", "accept: …") names missing, partial, stale, skipped or unexecuted evidence. A clause ends at the next semicolon or the next verdict word, so comma-joined definitions ("accept when …, verify_more when …") are read clause by clause. |
| `defines verify_more without missing, partial or stale evidence` / `defines revise without contradicting evidence` | A verdict was redefined. |
| `marks missing evidence as accepted` | For example "missing evidence is marked accept". |
| `the authoritative recipe no longer defines the <verdict> verdict` | The change-summary recipe lost a definition. |

### GI-04 completion-outcome

DONE requires completed scope, required verification and every required
criterion at accept; otherwise PARTIAL or BLOCKED.

| Diagnostic | Meaning and fix |
|---|---|
| `defines when DONE applies without requiring accepted criteria` | A sentence that defines DONE ("Use DONE only …", "DONE requires …", "DONE only if …") has no companion DONE sentence in the same paragraph, list or table row that requires accept. Step 09 found and fixed one such case in `workflow-new-feature.md`. |
| `makes DONE follow from code or a build alone` | For example "written code counts as DONE". |
| `the authoritative recipe no longer defines when <outcome> applies` | DONE, PARTIAL or BLOCKED is missing from the change-summary recipe. |

### GI-05 check-status-honesty

A skipped, not-run, blocked or unknown check is never reported as PASS. Check
statuses are distinct from verdicts.

| Diagnostic | Meaning and fix |
|---|---|
| `the status table no longer defines <STATUS>` / `the SKIPPED status no longer says that a skip is not a pass` | The testing contract changed. |
| `the verification step no longer lists <STATUS>` / `… never reported as passing` | The change-summary recipe changed. |
| `treats an unexecuted or skipped check as passing` | For example "skipped tests count as PASS". |

### GI-06 source-of-truth-precedence

System and developer instructions and provider permissions take priority;
the user's scope, repository instructions and conventions follow, before
generic practice. `.chayen/` files are a map, and the source wins.

| Diagnostic | Meaning and fix |
|---|---|
| `Principles has no "Precedence." principle` / `the Precedence principle no longer gives …` | Restore the Precedence principle in that skill. |
| `reads .chayen/ project knowledge without saying the source wins` | A file outside chayen-init that reads `profile.md` or a unit file lost the "trust the source" rule (D-065; extended to unit files in evolution Step 10). |
| `lets .chayen/ files override the source` | Contradicts D-065. |
| REVIEW `Precedence names generic practice before repository instructions` | Check the order by hand. |

### GI-07 advisory-not-enforcement

Guidance never claims to enforce, guarantee, block or prevent anything.

| Diagnostic | Meaning and fix |
|---|---|
| `claims the guidance itself enforces something` | "This skill / guidance / recipe / checklist / workflow / template / these instructions enforce …". A negated form ("cannot enforce") is fine. Domain statements such as "every endpoint enforces authorization" are not matched. |
| `absolute safety claim` | "fully secure", "100% safe", "guaranteed compliant". |
| `the advisory statement was removed` | security, data, devops, architecture or ai-engineering lost its advisory wording. |

### GI-08 skill-ownership-and-handoff

Hand-offs name an existing skill in prose, never a link or provider syntax,
and never the skill itself.

| Diagnostic | Meaning and fix |
|---|---|
| `names "<chayen-x>", which is not a shipped skill` | A dangling or misspelt hand-off. |
| `uses provider-specific invocation syntax` | `/chayen:…`, `$chayen-…` or "Skill tool" in shipped content. |
| `hands off to itself` | A "When not to use" row names its own skill. |
| REVIEW `Better fit "…" names no skill and no recognised outcome` | Recognised outcomes: answer directly, an em dash, not covered, decline, "no … guidance", native, outside. |

### GI-09 workflow-exit-and-verification

Workflow exit checks never accept less evidence than the workflow's
Verification rules.

| Diagnostic | Meaning and fix |
|---|---|
| `Verification no longer keeps the status vocabulary` | "PASS, FAIL, NOT_RUN or N/A" is also required by V-24. |
| `Verification no longer gives each acceptance criterion one verdict` | The Step 08 verdict sentence was removed. |
| REVIEW `exit check declares completion without an evidence term` | An exit check says done, complete, verified or closed without evidence, observed, recorded, explicit, visible, accept or "only if/with". Check it by hand. |

Exit checks are also scanned by GI-04 and GI-05.

## What is machine-verified and what still needs review

| Property | Machine-verified | Human review (G-15) |
|---|---|---|
| Task-contract decision | Anchors in the recipe, entry skill and References row; a single eligibility rule; no guessed-interpretation wording | Whether summaries are faithful in meaning |
| Approval | Exact-action anchor; negation of contract-as-approval; weakening patterns | Approval wording in other forms |
| Verdicts | Every definitional clause; "missing evidence is accept" patterns; the three definitions in the recipe | Verdict wording in non-definitional prose |
| Completion | Every DONE-defining sentence group requires accept; code-or-build-is-DONE patterns; the three outcomes in the recipe | Other outcome vocabularies |
| Check statuses | The status table and its SKIPPED rule; the recipe list; skipped-as-pass patterns | Status reporting in other phrasings |
| Precedence | A Precedence principle in all 16 skills; ".chayen source wins" wherever profile or unit files are read | The internal order (REVIEW only) |
| Advisory | Self-enforcement and absolute claims; advisory statements in five skills | Claims with another subject ("the agent will block …") |
| Hand-off | Every `chayen-*` name resolves; no provider syntax; no self hand-off | Whether the named skill really owns the request; unrecognised outcomes (REVIEW) |
| Workflows | Status vocabulary and verdict rule in Verification | Whether each exit check suffices (REVIEW signal only) |

## Limitations

- **Anchors are short phrases, not meaning.** A rewrite that keeps an anchor
  but changes the meaning around it passes. A rewrite that drops an anchor
  while keeping the meaning fails. Then update the anchor in the checker, add
  a test for the new wording, and keep the invariant.
- **Negation guard.** A contradiction is skipped when a negation word
  appears in the match or in the 30 characters before it. A sentence with an
  unrelated negation nearby can therefore hide a contradiction.
- **Recognised forms only.** Contradiction patterns cover the forms listed
  above. Other phrasings are not detected, which is why each invariant lists
  its human-review part.
- **Fenced blocks are included.** Template formats are checked like prose.
  Their placeholders (`accept / verify_more / revise`) do not match the
  definitional patterns.
- **Behaviour is NOT_RUN.** The checker reads text. Whether an agent follows
  the guidance needs the runner and grader of evolution Steps 15–17.

## Changing an invariant

An invariant changes only through a decision record that names it. Update,
in one change: `guidance-invariants.json`, the check in `check-guidance.mjs`,
a test in `guidance-consistency.test.mjs`, and this document. Never add an
exception to silence a diagnostic; fix the content or the invariant.
