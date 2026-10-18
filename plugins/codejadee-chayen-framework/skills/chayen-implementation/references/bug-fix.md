---
kind: recipe
capabilities: [CAP-05-002]
---
# Bug fix

Fix a defect by reproducing it, finding the root cause, making the smallest
correct fix at the cause, and adding a regression test that fails before the
fix and passes after it. A bug fix changes behaviour only where the defect
is. It does not refactor or add features.

## Inputs

- The symptom: the error message, stack trace, failing request, screenshot,
  or log excerpt, plus the expected behaviour.
- Reproduction steps or data conditions, if known.
- The repository, with its test setup and the real test command.

## Procedure

1. **Reproduce.**
   - Write a failing test at the lowest level that shows the defect, or
     reproduce it with a local run when permitted.
   - If it cannot be reproduced, stop and report what was tried. Ask for
     the payload, logs, or data conditions.
2. **Localize.**
   - Follow the stack trace or the data flow to the first point where the
     state is wrong.
   - When the repository allows it, use read-only history
     (`git log -S'<term>'`) to see when the behaviour changed.
3. **State the root cause** in one or two sentences, with `path:line`.
   - Separate the trigger (the input that exposed it) from the cause (the
     code that is wrong).
   - A null check that hides a contract violation is a symptom fix, not a
     root-cause fix. Say so if it is the only safe option now.
4. **Fix at the cause** with the smallest change. No renames, restructuring,
   or opportunistic cleanup. If the right fix needs a refactor, propose it
   as a separate step.
5. **Prove it.**
   - The regression test fails before the fix. Observe this, or state that
     it was only reasoned.
   - The test passes after the fix.
   - The full relevant suite still passes.
6. **Check for siblings.**
   - Search for the same faulty pattern elsewhere.
   - Report the other occurrences as follow-ups. Do not fix them unasked.
7. **Report:**
   - the root cause;
   - the fix;
   - the regression test name;
   - before and after results;
   - the siblings found;
   - the risk of the change.

## Outputs

- A root-cause statement with evidence (`path:line`), separating trigger
  from cause.
- A minimal fix, and a regression test named after the defect.
- Before and after test results (with the before result observed or marked
  reasoned), plus a list of sibling occurrences as follow-ups.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | Async exceptions surface at the `await`. `AggregateException` hides the inner exception. Nullable warnings often point at the cause. EF Core tracking and lazy-loading defects need integration tests (WebApplicationFactory, Testcontainers). |
| Angular | Change detection (`OnPush`), unsubscribed observables, and zone-less timers. Reproduce with TestBed or component harness tests. |
| React / Next.js | Stale closures, effect dependency arrays, and server versus client rendering mismatches (hydration). Reproduce with Testing Library. |
| Vue / Nuxt | Reactivity loss from destructuring props or stores, and SSR-only defects. Reproduce with Vue Test Utils or `@nuxt/test-utils`. |
| Node.js | Unhandled rejections and request-scoped state stored in module globals. |
| Python | Mutable default arguments, naive versus timezone-aware datetimes, and ORM lazy loading in async code. |
| SQL Server / PostgreSQL | Collation and case sensitivity, `NULL` comparison semantics, implicit conversions, and isolation-level effects. |

## Verification

- A regression test exists, and fails without the fix (observed, or
  explicitly marked reasoned) and passes with it.
- The diff touches only the cause and the test. No unrelated changes or
  refactoring.
- The relevant suite passes with the project's test command, compared with
  the baseline.
- The root cause cites `path:line`, and sibling occurrences are reported,
  not silently fixed.
