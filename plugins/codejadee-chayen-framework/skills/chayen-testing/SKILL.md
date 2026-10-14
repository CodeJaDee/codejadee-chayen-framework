---
name: chayen-testing
description: Write, fix, or plan automated tests (unit, integration, and end-to-end) with xUnit, NUnit, MSTest, Jasmine, Jest, Vitest, Playwright, Cypress, or pytest, following the project's existing test framework and style. Use for adding coverage, regression tests, or diagnosing failing or flaky tests. Not for manual QA plans, load testing, or production monitoring.
---

# Automated testing

Add or repair automated tests that are deterministic, meaningful, and consistent with the project's existing test suite.

## When to use

Requests that fit:
- "Write unit tests for the OrderService class."
- "Add integration tests for the /api/orders endpoints using WebApplicationFactory."
- "This Vitest test is flaky in CI. Find out why and fix it."
- "Add Playwright end-to-end tests for the checkout flow."
- "Write pytest tests for the parse_invoice function, including edge cases."

## When not to use

| Request | Better fit |
|---|---|
| Implementing the feature itself | The chayen-backend, chayen-frontend, or chayen-implementation skill |
| Manual test plans, UAT scripts, or exploratory testing guides | — |
| Load, stress, or performance benchmarking (k6, JMeter, BenchmarkDotNet) | — |
| Security testing, penetration testing, or fuzzing campaigns | — |
| Test frameworks for stacks outside .NET, TypeScript/JavaScript, and Python | Not covered here |

If the request does not fit, stop following this skill and continue normally without mentioning it.

## Principles

- **Precedence.** The user's explicit instructions come first, then
  repository instruction files (which you read but never modify), then
  observed conventions, then generic practice.
- **Use the existing framework, assertion library, mocking library, file
  layout, and naming.**
  - Never introduce a second test framework.
  - Never introduce a new assertion or mocking library unasked.
- **Test behavior through public surfaces**, not private implementation
  details.
- **One reason to fail per test.** Arrange, act, assert. Descriptive names
  in the project's naming style.
- **Deterministic.**
  - No real time, randomness, network, or order dependence without control.
  - No `sleep` waits. Use the framework's waiting or fake timers instead.
- **Integrity.** Never delete, skip, or loosen assertions to make a failing
  test pass unless the user agrees that the test itself is wrong.
  - Report genuine product bugs that the tests reveal.

## Inputs

- **Required:**
  - the code or behavior under test;
  - for failing or flaky tests, the failure output or the CI log.
- **Discover:**
  - test framework and version;
  - runner command;
  - fixtures and helpers;
  - mocking approach;
  - test data builders;
  - environment needs (database, containers, browsers).
- **Ask when missing and it matters:**
  - the expected behavior for edge cases;
  - whether the tests may use external services or containers.

## Workflow

1. **Detect the framework and conventions.** Then read exactly one matching
   reference below.
2. **Choose the level:**
   - unit, for logic;
   - integration, for wiring, database, or HTTP pipeline;
   - end to end, for critical user flows only.

   Prefer the lowest level that proves the behavior.
3. **List the cases before writing:**
   - happy path;
   - boundaries;
   - invalid input;
   - error paths;
   - authorization (for endpoints).

   For regression tests, reproduce the reported bug.
4. **Write the tests,** reusing existing builders, fixtures, and helpers.
   Keep data minimal and explicit.
5. **Run them.**
   - A new test for existing correct behavior should pass.
   - A regression test should fail before the fix and pass after.
   - If a new test fails unexpectedly, decide: test bug or product bug.
6. **Flaky tests.**
   1. Reproduce by running repeatedly, or in isolation and in random order.
   2. Classify the cause: timing or async, shared state, order dependence,
      time zone or clock, randomness, external dependency, or resource
      limits.
   3. Fix the cause. Retries alone are not a fix.
7. **Verify the full relevant suite**, not only the new tests.

## Outputs

- Test files following the project's layout and naming.
- A case list showing what each test proves.
- For failures: the diagnosis (test defect or product defect), with
  evidence.
- A verification table: the command, with passed, failed, and skipped
  counts.

## Verification

- **Show the exact test command and the result counts.** NOT_RUN with a
  reason if tests could not execute (for example a missing database or
  browser).
- **Regression tests:** state whether failure before the fix was observed,
  or only reasoned.
- **Flaky fixes:** report repeated runs, for example "50 consecutive passes
  with `--repeat`/loop", or state that only a single run was possible.
- **No skipped or disabled tests were added** without the user's
  agreement.

## Failure handling

| Situation | What to do |
|---|---|
| A new test exposes a product bug | Keep the test. Report the bug with the evidence, and ask whether to fix it now (a production code change) or mark it as a known failure. |
| A test environment dependency is unavailable | Use the project's existing fakes or containers. Otherwise write the test, mark the run NOT_RUN, and give the command to run it. |
| No test project or framework exists | Propose the conventional setup for the stack and ask before adding it. |
| Existing tests are already failing | Report the baseline failures separately. Do not fix unrelated tests unless asked. |
| Code is hard to test (static calls, hidden I/O) | Suggest the smallest seam. Do not refactor production code beyond what the user approves. |

## References (load only the one that matches)

| Detected | Load |
|---|---|
| .NET test projects (xUnit, NUnit, MSTest) | [references/dotnet-testing.md](references/dotnet-testing.md) |
| Jest, Vitest, Jasmine/Karma, Testing Library, Playwright, Cypress | [references/javascript-testing.md](references/javascript-testing.md) |
| pytest, unittest, Django tests | [references/python-testing.md](references/python-testing.md) |
