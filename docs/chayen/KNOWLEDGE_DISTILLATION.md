# Mentor-to-Fast-Agent Knowledge Distillation (developer-only)

| Field | Value |
|---|---|
| Decision | [D-069](DECISIONS.md#d-069--governed-mentor-to-fast-agent-knowledge-distillation) (evolution Step 12) |
| Builds on | [Failure reproduction](FAILURE_REPRODUCTION.md) (D-068), [CONTRIBUTING](../CONTRIBUTING.md#developer-checks) |
| Mentor brief | [MENTOR_BRIEF.md](MENTOR_BRIEF.md) |
| Proposals | [`tests/distillation/`](../../tests/distillation/README.md) |
| Tool | [`tools/evals/distill.mjs`](../../tools/evals/distill.mjs) |

A capable **Mentor** (a strong model run by a maintainer, or a maintainer)
analyses one verified failure and proposes the smallest reusable guidance
change for the faster coding agents that use Chayen Skills. This is
distillation at the prompt and process level: knowledge moves into existing
Recipes, Entry Skills, project-knowledge templates, regression cases and
known limitations. No model is fine-tuned.

The workflow is developer-only:

- No Mentor ships in the plugin, and no service runs in the background.
- A Mentor run is a maintainer's opt-in session.
- The Mentor's output is an untrusted proposal until a human reviews it and
  the evidence supports it.
- No command from a failure trace, proposal or diff is ever executed.

## Stages

| Stage | What happens | Enforced by `distill.mjs` |
|---|---|---|
| 1. Collect | Load one failure case from `tests/failures/` with redacted evidence and a repeatable reproduction | The case exists and is valid, and its failing and control transcripts replay as expected (`VERIFIED_OFFLINE`). Its model behaviour (`NOT_RUN`, `REPRODUCED`, ...) is carried forward |
| 2. Diagnose | Choose one root cause, record the alternatives considered, and check what the current guidance already says | Root cause is one of the eight below. Evidence references resolve to files and lines. `existingGuidance` records coverage as `fully`, `partly` or `no`. At least one rejected cause with a reason. `confirmed` needs a live replay that reproduced the failure |
| 3. Distill | Pick the smallest action that addresses that root cause | The action must be allowed for the root cause (table below). Targets must be existing files of the right kind; no file is created, so a new Entry Skill is impossible. Behavioural changes over 20 changed lines need a written justification |
| 4. Review | Evidence, root cause, before and after behaviour, proposed diff, risks and routing collisions, tests needed; then a human review | Routing impact is **computed** from the diff (`metadata` for a description change, `trigger-sections` for a change to When to use or When not to use) and must match the declared value. Routing changes need trigger cases. Tests must include the failure case and its regression references. The reviewer must be a person other than the Mentor |
| 5. Validate | Run the existing offline tests and the relevant replay cases; when authorized, compare live runs | The diff is applied in memory to a disposable copy of the repository. The fixed validators run there: package, guidance invariants, security, catalog, trigger-eval sync, documentation, and failure cases with offline replay. The discovery metadata fingerprint is compared. Live baseline and candidate runs are scored with the failure case's detector |
| 6. Promote | Only demonstrated improvements | The decision is derived (below). A promotion record keeps the previous version's hash, recoverable by reversing the diff. The failure case and its transcripts must remain |

### Root causes and allowed actions

| Root cause | Allowed actions |
|---|---|
| Skill routing | Clarify an Entry Skill; add a regression fixture; record a limitation |
| Missing project knowledge | Update a project-knowledge template; add a regression fixture; record a limitation |
| Incomplete Recipe | Modify an existing Recipe; document a verified command; add a regression fixture |
| Conflicting instructions | Modify an existing Recipe; clarify an Entry Skill; add a regression fixture |
| Poor task specification | Add a regression fixture; record a limitation |
| Insufficient verification | Modify an existing Recipe; document a verified command; add a regression fixture |
| Tool or model limitation | Add a regression fixture; record a limitation |
| External environment failure | Add a regression fixture; record a limitation |

Every root cause allows an action that is not a Skill change. Three root
causes allow no guidance change at all.

Some guidance-changing actions get extra scrutiny. If the diagnosis says the
existing guidance already covers the failure `fully`, the proposal is
returned until a live replay shows that the guidance is not followed.

### Decisions

| Decision | When |
|---|---|
| `PENDING_REVIEW` | The proposal is consistent and passes offline validation; no human review yet |
| `RETURNED_FOR_REVISION` | Any of the following: <br>• action not allowed for the root cause, or wrong target <br>• stale base, or the diff does not apply <br>• undeclared routing impact <br>• oversized change without justification <br>• fully covered guidance changed without live evidence <br>• an offline validator fails <br>• reviewer requested changes <br>• a live run was inconclusive <br>• the baseline did not reproduce the failure <br>• some candidate runs still reproduce it |
| `REJECTED` | The reviewer rejected it, or every candidate run still reproduces the failure (no improvement) |
| `AWAITING_EVIDENCE` | Approved, but a guidance change has no live comparison, or fewer than 3 runs per arm. A limitation entry whose failure no live replay has reproduced also waits here |
| `READY_TO_PROMOTE` | Approved, and either: <br>• a guidance change where the baseline reproduces the failure and no candidate run reproduces it, with ≥ 3 runs per arm, one provider and model, all runs authorized; or <br>• a regression fixture or a limitation entry that meets the evidence rules above |
| `PROMOTED` | Ready to promote, the change is in the tree, and a promotion record names the revision, the previous hash and the promoted hash |

The recorded `decision` must equal the derived one. A proposal cannot
declare itself approved, improved or promoted.

## What is tested offline, and what needs a real model run

| Part | Tested offline | Needs a real model run |
|---|---|---|
| Failure collection, record validity, detector discrimination | Yes (G-20, G-21) | No |
| Root-cause rules, allowed actions, target and size rules | Yes (G-21T) | No |
| Diff application, previous-version recovery, stale-base detection | Yes (G-21T) | No |
| Routing impact of a diff, metadata fingerprint | Yes (computed) | Whether a description change shifts Skill selection: routing evaluation (trigger cases) |
| Guidance consistency, package, security, documentation, catalog after the change | Yes (fixed validators on the candidate copy) | No |
| Decision logic for every outcome, including rejected and inconclusive comparisons | Yes (G-21T, using test-only transcripts in temporary copies) | No |
| **The Mentor's diagnosis quality** | No: the format is checked, not the judgement | A human review, and over time a sample of Mentor proposals checked against live outcomes |
| **Whether the failure happens with a real agent** | No | A live replay of the failure case (Step 11) |
| **Whether the proposed change fixes it** | No: offline replay uses fixed recorded transcripts, so it cannot change with the guidance | Live baseline-versus-candidate comparison, ≥ 3 runs per arm |
| Regressions in other behaviour | Static checks only | Routing and capability evaluation (Steps 14–18) |

## Commands

```bash
node tools/evals/distill.mjs                        # every proposal: six stages, offline validation (G-21)
node tools/evals/distill.mjs --proposal DP-0001     # one proposal
node --test tests/distillation/distillation.test.mjs   # workflow regressions (G-21T)
```

## Running a Mentor

1. Pick one failure case. Its offline reproduction must be `VERIFIED_OFFLINE`.
2. Opt in to a Mentor session. Give the Mentor the brief, the redacted
   failure record and read access to the repository. Never give it raw
   conversations, secrets or production code.
3. Ask for a proposal JSON (from `tests/distillation/templates/`) and a
   unified diff. Save them as `DP-NNNN-<slug>.json` and `DP-NNNN.diff`.
4. Run `distill.mjs`. Fix or discard anything it returns.
5. A maintainer who is not the Mentor reviews it and records the review.
6. For a guidance change, run authorized live replays on the base revision
   and on a revision with the change (Phase 5 isolation rules). Record them
   under `validation.comparison`.
7. Promote only when the tool derives `READY_TO_PROMOTE`. Record the
   promotion and keep the failure case.

## Current proposals (Step 12)

| ID | Failure | Mentor diagnosis | Action | Decision |
|---|---|---|---|---|
| DP-0001 | FC-0002 missed consumer | Incomplete Recipe: step 6 of the impact recipe names the frontend calls to find but not how to find them | Modify the existing Recipe: search for the route path as text (5 changed lines) | PENDING_REVIEW; offline validation passed 7/7 |
| DP-0002 | FC-0001 invented column | Tool or model limitation (suspected): `chayen-data/SKILL.md:45-47` already forbids guessing a name | Add a regression fixture: a recipe case with a UI-field decoy. No guidance change | PENDING_REVIEW |
| DP-0003 | FC-0003 false DONE | Tool or model limitation (suspected): the loaded Skill and the recipe both forbid the claim | Record a limitation, held until a live replay reproduces it | PENDING_REVIEW (after approval: AWAITING_EVIDENCE) |
| DP-0004 | FC-0003 (demonstration) | A deliberately weak Mentor output: forces a description change | Clarify an Entry Skill | RETURNED_FOR_REVISION: routing impact `metadata`, declared `none`; no trigger cases; the guidance already covers the failure fully |

No proposal has been reviewed or promoted, and none is applied to the
plugin. All of them were written by an agent from synthetic failures.
