# Independent Audit Verification Contract (developer-only)

| Field | Value |
|---|---|
| Decision | [D-070](DECISIONS.md#d-070--independent-acceptance-evidence-audit) (evolution Step 13) |
| Shipped guidance | `chayen-implementation/references/change-summary.md`, Evidence audit (CAP-18-003); guarded by GI-10 |
| Reference grader | [`tools/evals/audit-evidence.mjs`](../../tools/evals/audit-evidence.mjs) |
| Cases | [`tests/audit/`](../../tests/audit/README.md) |

This contract is for **future automated graders**, whether rules, scripts or
language models, that review an implementing agent's completion claims. It
is not part of the plugin and needs no runtime. Agents follow the shipped
Evidence audit guidance. This contract makes the same rules checkable
against fixed cases.

## Roles

| Role | Does | Never |
|---|---|---|
| Implementing agent | Understands the task, changes the code, runs the checks, collects evidence, submits the report | Approves its own evidence by declaring success |
| Independent reviewer or grader | Reads the original criteria, the changed files and the recorded runs; re-checks; gives one review per criterion | Treats the report's conclusions, a test file, or a quoted result as evidence |

A grader running in the same session as the implementer records
`same-session-review` and says so in each confidence limitation.

## Input: `chayen-audit-case/1`

| Field | Meaning |
|---|---|
| `revisions` | Revisions, oldest first; the last one is the current revision |
| `criteria[]` | `id`, `text`, `kind` (`logic`, `ui-interaction`, `api-authorization`), `required`, `dependsOn` (source files), optional `testFiles`, and `deniedPaths` for authorization |
| `changedFiles[]` | `path`, `role` (`source`, `test`, `generated`), and the revision of the last change |
| `runs[]` | **Recorded** executions only: `id`, `command`, `revision`, `exitCode`, `excerpt`, and `tests[]` with `name`, `status` (the testing contract's six statuses), `covers`, `level` and, for authorization tests, `path` (`allowed`, `unauthenticated`, `forbidden`) |
| `report` | The implementer's outcome and `claims[]` (criterion, text, status, cited run, quoted result, claimed verdict). These are claims to check, never evidence |
| `reviewer.independent` | Whether the reviewer is someone other than the implementer |
| `expected` | Verdict per criterion, outcome, `supported` or `unsupported` for the report's outcome, and flags |

Cases are synthetic. Real reports, transcripts and logs stay out of the
repository, as do the privacy rules of
[FAILURE_REPRODUCTION.md](FAILURE_REPRODUCTION.md).

## Output: `chayen-audit-review/1`

```json
{
  "$schema": "chayen-audit-review/1",
  "case": "AU-0001",
  "reviews": [{
    "criterion": "AC-1",
    "claim": "Export tests pass",
    "evidenceSource": "recorded run R1 at r2",
    "independentMethod": "read the recorded runner output and compared its revision with the last change",
    "observedOutcome": "Export_writes_header_and_one_row_per_order PASSED (integration) in R1 at r2",
    "confidenceLimitation": "recorded output was not re-run by the reviewer",
    "verdict": "accept",
    "nextAction": "none"
  }],
  "outcome": "DONE",
  "reportOutcome": "supported",
  "flags": []
}
```

All eight review fields are required and non-empty. `verdict` is `accept`,
`verify_more` or `revise`. Review text must pass the privacy rules: no
secret patterns, unredacted local paths, personal emails or credential URLs.

## Grading rules

Each rule restates the shipped guidance. G-22T checks that every anchor
sentence is still present in the guidance.

| Rule | Verdict |
|---|---|
| A fresh recorded run of an adequate level passes every test covering the criterion | `accept` |
| A fresh recorded test covering the criterion failed (including a denied path that succeeded) | `revise` |
| A test file exists but no recorded run executed it; a PASS claimed with no run | `verify_more` (the test is NOT_RUN for the audit) |
| A run is cited but was never recorded | `verify_more`, with the claim flagged `cited-run-not-recorded` |
| A quoted result is not in the recorded output | Flagged `quoted-result-contradicted`; the recorded result decides the verdict |
| The only passing run predates the last change to `dependsOn` | `verify_more` (`stale-evidence`) |
| Interactive UI with only unit or build evidence | `verify_more` (`inadequate-method`); adequate levels are component, browser, device, or a recorded manual interaction |
| Authorization without the allowed path and every denied path passing | `verify_more` (`denied-path-missing`) |
| The outcome | `DONE` only when every required criterion is `accept`; otherwise `PARTIAL` |
| The report's outcome | `supported` when it equals the derived outcome. An honest PARTIAL is supported |

Proportionality: the required level depends on what the criterion claims
(`kind`), not on how confident the report sounds. A logic criterion does not
require a browser test. An authorization criterion always requires its
denied paths.

## Commands

```bash
node tools/evals/audit-evidence.mjs                      # reference grader on every case (G-22)
node tools/evals/audit-evidence.mjs --score <reviews>     # check another grader's reviews against the cases
node --test tests/audit/audit-evidence.test.mjs          # regressions (G-22T)
```

`--score` reads a JSON array of reviews and checks each one against the
case's expected verdicts, outcome, report verdict, required fields and
privacy rules.

## Limitations

- The reference grader reads **structured, recorded** evidence. It re-runs
  nothing, and it does not read raw transcripts or logs. Turning a real
  session into this structure is a separate step: by hand, or by a future
  runner (Steps 15–17).
- A language-model grader can be checked against these cases. Agreement on
  eight synthetic cases does not show that it is reliable on real work.
- No grader, and no audit, is a security review or a security guarantee.
- Whether real agents follow the shipped audit guidance is NOT_RUN. The
  `rc-18-003-*` recipe cases are specifications for that.
