---
kind: recipe
capabilities: [CAP-10-002, CAP-10-003, CAP-10-004, CAP-10-007]
---
# Writing unit, integration, end-to-end, and regression tests

Write tests at the lowest level that proves the behaviour, in the project's
framework and style, with isolated data and no timing guesses, and run
them. Regression tests reproduce the reported defect, are seen failing
before the fix, and stay in the suite.

## Inputs

- The code or flow under test, the expected behaviour, and for regressions
  the bug report or reproduction steps.
- The existing test project: framework, naming, helpers, builders,
  fixtures, and mocking approach.
- The infrastructure available: Docker for Testcontainers, a test database,
  browsers, and the test environment for end-to-end runs.

## Procedure

### Unit tests (CAP-10-002)

1. **Find the closest existing test file** and mirror its layout, naming,
   and helpers.
2. **List the cases:** happy path, boundaries (empty, one, many, limits),
   invalid input, error paths, and cancellation or time behaviour.
3. **Isolate the unit** with test doubles only at boundaries (repositories,
   HTTP clients, clocks). Do not mock the type under test.
4. **Use data-driven tests** for tables of inputs and expected outputs.
5. **Run them,** and report the command and the counts per status.

### Integration tests (CAP-10-003)

1. **Use the project's real-dependency setup:** `WebApplicationFactory`
   with a test database, Testcontainers, pytest-django's database, or a
   per-test schema. Do not substitute an in-memory fake that changes
   behaviour (for example the EF Core InMemory provider for relational
   queries).
2. **Isolate data:** a transaction rolled back per test, a database or
   schema per test class, a reset tool (Respawn, truncation), or unique
   keys per test. Tests must pass in any order and twice in a row.
3. **Cover the wiring:** serialization, middleware, authentication and
   authorization, database constraints, and error mapping.
4. **Run them twice in a row.** If Docker or the database is unavailable,
   report BLOCKED with the command, never PASSED.

### End-to-end tests (CAP-10-004)

1. **Choose the critical flows only** (sign-in, checkout, the main
   create-and-edit journey). Leave validation permutations to lower
   levels.
2. **Use stable selectors:** roles and labels, or `data-testid` if the
   project uses them. No CSS chains or text that changes with copy.
3. **Rely on auto-waiting assertions.** No fixed sleeps or arbitrary
   timeouts.
4. **Isolate state:** create test data through the API or fixtures, reuse a
   signed-in storage state if the project does, and clean up.
5. **Capture evidence on failure:** traces, screenshots, or videos, as the
   configuration allows.
6. **Run headless** against the configured environment, never against
   production.

### Regression tests (CAP-10-007)

1. **Reproduce the defect** at the lowest level that shows it, and name the
   test after the defect (issue number or behaviour).
2. **Observe the failure before the fix:** run the test on the unfixed code
   (before applying the fix, or with the fix stashed) and record the failing
   output. If that is impossible, label the before-state "reasoned, not
   observed".
3. **Apply or receive the fix,** then run the test again and record
   PASSED.
4. **Keep it in the suite,** with no skip markers, and run the related
   tests to check nothing else changed.

## Outputs

- Test files following the existing layout and naming, with a case list.
- Integration tests with setup and teardown that isolate data, or a BLOCKED
  result with the command when a dependency is unavailable.
- End-to-end specs with role or test-id selectors and auto-waiting, and
  traces or screenshots on failure.
- Regression tests named after the defect, with evidence of failure before
  the fix (observed or reasoned) and success after.
- The test command, with counts per status.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | `[Fact]`/`[Theory]`, `[Test]`/`[TestCase]`, or `[TestMethod]`/`[DataRow]` as the project uses. `WebApplicationFactory<Program>` with `ConfigureTestServices`, Testcontainers modules (`Testcontainers.MsSql`, `Testcontainers.PostgreSql`), Respawn for resets. `TimeProvider` for time. |
| JavaScript and TypeScript | Vitest or Jest with Testing Library, `HttpTestingController` or MSW for HTTP, fake timers. Playwright `getByRole`, web-first assertions, `trace: 'on-first-retry'`. Cypress `cy.intercept` and retrying commands. |
| Python | pytest fixtures and `parametrize`, `TestClient` or httpx for FastAPI, pytest-django `db` fixtures and `django_db_blocker`, Testcontainers for Python, `freezegun` or an injected clock if present. |
| Databases | SQL Server and PostgreSQL behave differently from SQLite. Test constraints, transactions, and SQL against the production engine. |

## Verification

- New unit tests run with the project's command, and their counts are
  reported per status.
- Integration tests pass twice in a row without leftover data, and an
  unavailable database is reported as BLOCKED.
- End-to-end specs contain no fixed sleeps, use accessible or test-id
  selectors, and pass against the fixture app, or are BLOCKED or NOT_RUN
  with the reason.
- A regression test is shown FAILED on the unfixed code (or labelled
  reasoned) and PASSED after the fix.
