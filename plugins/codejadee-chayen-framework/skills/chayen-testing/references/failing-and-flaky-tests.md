---
kind: recipe
capabilities: [CAP-10-012, CAP-10-014]
---
# Failing-test triage and flaky-test diagnosis

Separate failures the change caused from failures that already existed,
decide for each whether the test or the product is wrong, and route it with
evidence. Diagnose flaky tests by reproducing them, classifying the cause,
and fixing that cause, never by hiding the flakiness.

## Inputs

- The failing test output or CI log, in full.
- The recent changes (diff, merged pull requests) and a baseline: the same
  tests on the base commit, or the last green CI run.
- For flaky tests: the test name, CI history, and the test command.

## Procedure

### Failure triage (CAP-10-014)

1. **Collect the complete failure list** from the runner's report, not from
   truncated logs. If the report is incomplete, mark the affected tests
   UNKNOWN.
2. **Establish the baseline:** run the same tests on the base commit (a
   separate worktree, or the stashed change), or use the last CI run of the
   base branch. Record each result with its status.
3. **Classify each failure:**

   | Category | Evidence |
   |---|---|
   | New | Fails with the change, passes on the baseline |
   | Pre-existing | Also fails on the baseline |
   | Flaky | Passes and fails without any code change |
   | Environment | Fails from a missing service, configuration, or resource (report BLOCKED where it never executed) |

4. **Decide test defect or product defect** for new failures, against the
   requirement or documented behaviour, not against the current output:
   - the expectation matches the requirement: **product defect**. Keep the
     test failing, and report it;
   - the test asserts an implementation detail or an expectation the user
     confirms is outdated: **test defect**. Fix the test, and state the
     confirmation.

   Never change an expected value only because the output changed.
5. **Fill the failure table,** and route each row: fix test defects, report
   product defects with the reproduction, hand environment issues to their
   owner, and send flaky ones to the procedure below.
6. **Ask before production changes.** Fixing a product defect is a separate,
   approved task.

### Flaky-test diagnosis (CAP-10-012)

1. **Reproduce:** run the test repeatedly (for example 50 times), alone and
   with its neighbours, in random order, and with parallelism on and off.
   Record the pass and fail counts with the command.
2. **Classify the cause:**

   | Cause | Typical sign |
   |---|---|
   | Async or timing | Fails under load, missing `await`, fixed sleeps |
   | Shared state | Fails only after a specific other test |
   | Order dependence | Fails in random order or when run alone |
   | Time, time zone, or locale | Fails near midnight, month-end, or on CI agents in another zone |
   | Randomness | Unseeded generators or unordered collections |
   | External dependency | Real network, shared database, rate limits |
   | Resource limits | Fails on smaller CI machines or with parallel workers |

3. **Fix the cause:** await properly, use auto-waiting assertions, isolate
   or reset state, control the clock and seeds, fake the dependency, or
   size the resources.
4. **Do not paper over it.** Retries, longer timeouts, or quarantine are
   temporary measures only with the user's agreement, an owner, and a
   ticket.
5. **Prove the fix** with the same repeated-run command, and report the
   pass counts before and after (for example 41/50 before, 50/50 after). If
   only one run was possible, say so.

## Outputs

- A failure table: test, category (new, pre-existing, flaky, environment),
  status, cause, and owner or next action.
- Fixes for test defects, and reports for product defects.
- For flaky tests: the cause classification with evidence from repeated
  runs, the fix, and the repeated-run result after the fix, or the
  limitation.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | `dotnet test --filter` in a shell loop for repeats. xUnit runs test classes in parallel, so look for shared static state. Use `TimeProvider` fakes. `--logger trx` gives a complete report. |
| JavaScript and TypeScript | `npx vitest run --sequence.shuffle`, `npx playwright test --repeat-each=50`, Jest `--runInBand` to rule out parallelism. Playwright traces for timing issues. JUnit reporters for complete lists. |
| Python | With pytest-randomly installed, order is shuffled by default: `--randomly-seed=<n>` reproduces an order and `-p no:randomly` disables it. `pytest --count=50` with pytest-repeat, `-x --lf` to rerun last failures, and `--junitxml` for complete reports. |
| CI | Compare with the base branch's latest run. Note agent differences (time zone, CPU count, locale) when classifying environment failures. |

## Verification

- In a fixture with one pre-existing and one newly broken test, each is
  classified correctly against the baseline run, with both runs shown.
- No expected value, snapshot, or assertion was changed without the user's
  confirmation that the expectation was wrong.
- A flaky fix shows repeated-run counts before and after with the same
  command.
- Every test in the report has exactly one status: PASSED, FAILED, SKIPPED,
  BLOCKED, NOT_RUN, or UNKNOWN.
