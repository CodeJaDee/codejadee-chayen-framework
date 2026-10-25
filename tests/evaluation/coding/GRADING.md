# Independent coding grading and rework metrics (developer-only)

Evolution Step 17, [D-074](../../../docs/chayen/DECISIONS.md#d-074--independent-coding-grading-and-rework-metrics).
This grades the runs that `run-coding.mjs` records (Step 16) and compares
three configurations:

| Label | Configuration | Arm |
|---|---|---|
| A | A fast agent without Chayen | `baseline` |
| B | **The same** fast agent with Chayen | `chayen` |
| C | A mentor-class agent with Chayen | `chayen` |

**No live comparison exists.** Every improvement claim is `NOT_MEASURED` until
real provider runs are recorded under the Step 16 prerequisites. The grader,
the self-test and the report are exercised with synthetic records and fake
runs only.

## Pipeline

```text
run-coding.mjs (Step 16)        grade-coding.mjs --grade            grade-coding.mjs --report
records.jsonl, workspaces  -->  oracle.jsonl (executed checks)  -->  report.json + report.md
answers, verification           + rubric.json                       (derived offline, deterministic)
                                + human-review.jsonl, llm-grades.jsonl (optional, separate)
```

1. **`--grade <results dir>`** runs each task's deterministic grader checks.
   These are the Step 15 `run-coding-fixtures.mjs --grade` checks: hidden
   tests, boundary, regression detection and answer checks. They run on a
   staged copy of each preserved workspace, and their observations are
   written to `oracle.jsonl` (`chayen-coding-oracle/1`). It is written once
   and never overwritten.
   - The checks execute agent-written code. For a real provider run they
     run **only inside a container whose boundary verifies**
     (`--oracle-isolation <profile>`, the Step 16 probe, `--network none`).
     Otherwise the grader exits 3 with `BLOCKED` and writes nothing.
   - Host execution is allowed only for fake-provider runs on the harmless
     runner fixture.
2. **`--report <comparison.json> --out <fresh dir>`** derives every grade
   from recorded files and writes the comparison. It executes nothing. The
   same inputs give byte-identical output.

## Rubric (`rubric.json`, `chayen-coding-rubric/1`)

For each task, every acceptance criterion gets a `kind` from the Step 13
audit contract, plus a list of evidence items that name the grading checks
in `task.json`:

| Kind | Adequate evidence levels |
|---|---|
| `logic` | unit, integration, request, component, browser, device |
| `ui-interaction` | component, browser, device, manual-recorded |
| `api-authorization` | request, browser, and the allowed path plus every denied path |
| `process` (added in Step 17) | deterministic-check: scope, no change, the final answer, regression detection |

An evidence item can be narrowed in two ways:
- **`tests`:** only failed hidden tests with those names fail the item.
- **`failOn`:** a failed check fails the item only if its detail matches.

A failure that cannot be attributed (a build failure, or too few tests) fails
every item of that check. `static` evidence is weak and never adequate on its
own. `llmAllowed` marks the only items an LLM grade may comment on.

The task also declares:
- `functional`: the checks that measure functional correctness.
- `completionClaim`:
  - `compare`: the agent's `Outcome:` is checked against the independent
    outcome;
  - `never-done`: tasks E and F, where any DONE is a false claim.

## How a run is graded

Each run becomes a `chayen-audit-case/1`, and the Step 13 reference audit
(`tools/evals/audit-evidence.mjs`, `auditCase`) gives one review per
criterion:
- **Runs:** the grader checks executed by the grader, all at the final
  revision.
- **Report:** the agent's final answer, used only as claims.

| Situation | Verdict |
|---|---|
| An adequate check passed and none covering the criterion failed | `accept` |
| A check covering the criterion failed (including a denied path) | `revise` |
| The covering check was NOT_RUN, or only inadequate evidence passed | `verify_more` |

**The outcome** is `DONE` only when every required criterion is `accept`.
**The agent's claim is never evidence:** an answer that gives every
criterion `accept` changes nothing when the checks did not run (self-test
case 3).

## Metrics (per run; summarized per configuration and task)

| Group | Metric | Definition | Source |
|---|---|---|---|
| Correctness | AC passed / total | Criteria with verdict `accept` / all criteria | Independent review |
| | Build and test pass | The repository's own build and test steps passed when the runner re-ran them inside the boundary (`PARTIAL_NOT_RUN` and `NOT_RUN` are excluded from the rate and counted) | Step 16 verification |
| | Functional correctness | Every `functional` check PASS → PASS; any FAIL → FAIL; otherwise NOT_RUN (excluded, counted) | Oracle |
| | Unauthorized scope changes | Changed files outside `scope.allowed`, in `scope.mustNotChange`, or any change where the task allows none | Step 16 diff, oracle |
| | Unverified completion claim | `Outcome: DONE` while the independent outcome is not DONE (or the task never allows DONE), or DONE while the runner's verification failed. An unstructured "fixed it" is flagged only as `completionLanguageHeuristic` and never counted | Answer, review |
| | First-pass completion | Independent outcome DONE, on the first attempt, with no edit after the first verification command, and no unverified claim | Review, trace |
| Rework | Failed implementation attempts | Verification commands followed by more edits, plus 1 if the final outcome is not DONE | Trace, review |
| | Revisions | Edit actions after the first verification command | Trace |
| | Verification/revision cycles | Verification commands followed by at least one edit before the next one | Trace |
| | Evidence gaps | `verify_more` criteria plus audit flags (stale, inadequate method, denied path missing, …) | Review |
| Efficiency | Elapsed time, output and total tokens, tool calls, search/read operations, reported cost | As recorded; total tokens adds Claude's cache tokens; cost only when the provider reports USD | Run record |
| Human | Interventions, review rounds, measured review time, approval events | **Only** from `human-review.jsonl`. Review time is `endedAt − startedAt`, recorded by a named person; it is **never** derived from agent traces, and a duration field is rejected | Human log |
| | Approval requests denied | Provider permission denials in the agent trace (non-interactive runs deny rather than ask) | Trace |

**Failure categories** reuse the Step 11 failure taxonomy where it fits:
`false-done-claim`, `scope-expansion`, `missing-verification`,
`permission-or-policy-violation` and `invented-schema-or-command`. The runner
adds its own: `functional-failure`, `build-or-test-failure`,
`oracle-not-run`, `provider-error`, `timeout` and `limit-reached`.

## Human and LLM inputs (kept separate)

- **`human-review.jsonl` (`chayen-human-review/1`).** One entry per run with:
  - a named reviewer (an agent or model name is rejected) and
    `independentOfAgent: true`;
  - `rounds`, `interventions` (comment, question, change-request,
    fix-by-human, rejection) and `approvals`;
  - optional `startedAt` and `endedAt`, and optional `verdicts`.

  Human verdicts are listed separately and never change or join automatic
  grades.
- **`llm-grades.jsonl` (`chayen-llm-grade/1`).** Accepted only for
  `llmAllowed` items (task E AC-2 and task F AC-2: the quality of a
  question or an explanation). Each grade is labelled with its model,
  listed separately, and changes no verdict. An LLM grade on a criterion
  decided by execution evidence is rejected.

## Statistics and reporting rules

- **Separation:** results are kept per configuration. A configuration never
  mixes providers, CLI versions, models, effort, candidates, isolation
  profiles or evidence levels.
- **A and B** must be identical in everything but the arm: provider, CLI,
  model, effort, candidate, task, snapshot, prompt, isolation and tool
  policy.
- **C** must share the task, snapshot, prompt, candidate, isolation and tool
  policy, and may differ in provider or model. C versus B is labelled "not
  controlled for Chayen".
- **Rates:**
  - pass rates use Wilson 95% intervals;
  - B − A and C − B use Newcombe's hybrid score interval;
  - criteria counts within a run are not independent and carry no interval.
- **Time, tokens and cost:** median, minimum, maximum, standard deviation and
  `n`; differences are medians, labelled `DESCRIPTIVE_ONLY`.
- **Statuses:**

  | Status | Meaning |
  |---|---|
  | `NOT_MEASURED` | Synthetic or fake data |
  | `INSUFFICIENT_SAMPLE` | Fewer than `minRuns` (default 5) scored runs on a side |
  | `INCONCLUSIVE` | The interval includes 0 |
  | `DIFFERENCE_OBSERVED` | The interval excludes 0 |

  `DIFFERENCE_OBSERVED` is still reported as an association under the
  recorded conditions. It is not proof of a cause beyond those tasks and
  conditions.
- **Retries:** every attempt is graded, and the last attempt of each run is
  scored.

## Comparison spec (`chayen-coding-comparison/1`)

```json
{
  "$schema": "chayen-coding-comparison/1",
  "title": "Chayen 1.1.2, Claude Code, task A",
  "minRuns": 5,
  "configurations": {
    "A": { "dirs": ["results/a-baseline-taskA"] },
    "B": { "dirs": ["results/b-chayen-taskA"] },
    "C": { "dirs": ["results/c-mentor-taskA"] }
  }
}
```

Each directory is one Step 16 results directory: one task, one
configuration, several runs. `dirs` resolve relative to the spec file.

## Commands

```bash
node tests/evaluation/coding/grade-coding.mjs --self-test                       # G-26: synthetic known-good and known-bad records
node tests/evaluation/coding/grade-coding.mjs --grade <results dir> [--oracle-isolation <profile>]
node tests/evaluation/coding/grade-coding.mjs --report <comparison.json> --out <fresh dir>
node tests/evaluation/coding/grade-coding.mjs --synthetic-report --out <fresh dir> [--runs 10] [--seed 17]
node --test tests/evaluation/coding/grading.test.mjs                            # G-26T
```

A synthetic example report is in
[`results/2026-10-22-step17-synthetic/report.md`](results/2026-10-22-step17-synthetic/report.md).
Its numbers are generated to test the method. They say nothing about
Chayen.

## Limitations

- **Hidden checks:** the Angular component specs (tasks B and C) and the
  SQL Server oracle inside a Linux container (task D) stay NOT_RUN until
  their toolchains are available inside the boundary. Criteria that depend
  on them are `verify_more`, never `accept`.
- **Staged grading:** the staged grader is exercised end to end only on the
  Node runner fixture. Its .NET checks are exercised by Step 15 `--verify`,
  not yet through staging in a container.
- **Answer parsing:** the parser reads the change-summary format. Free-form
  answers give no structured claim, so their completion claims are only
  heuristic flags.
- **Transcript properties:** whether the agent asked before editing (task E)
  is a transcript property. It is graded only through the final workspace
  and answer.
