---
kind: recipe
capabilities: [CAP-10-001]
---
# Test strategy

Decide what to test at which level, what to automate first, and how tests
run in CI, by tying every test level to a named risk and reusing the
frameworks the project already has.

## Inputs

- The system or feature, its architecture (services, UI, data stores,
  integrations), and its business-critical flows.
- The existing tests: count per level, frameworks, run time, flaky tests,
  and coverage if available.
- CI constraints: time budget per pull request, available services
  (containers, browsers), and environments.
- Known risks: incidents, bug history, complex or regulated logic.

## Procedure

1. **Inventory the current suite:** tests per level (unit, integration,
   contract, end to end), run commands, CI jobs, run times, known flaky
   tests, and gaps. Run the suites if allowed, and record the result
   statuses.
2. **List the risks** that matter: money calculations, authorization, data
   loss or corruption, integrations, concurrency, complex rules, UI flows
   that earn revenue, and recent incidents.
3. **Map each risk to the cheapest level that catches it:**

   | Risk example | Level |
   |---|---|
   | Calculation or rule errors | Unit, plus property-based for wide input spaces |
   | Wrong SQL, missing migration, broken wiring | Integration against a real database engine |
   | Services disagreeing on an API or message | Contract tests |
   | Authorization mistakes on endpoints | API tests for 401, 403, and allowed cases |
   | A broken critical user journey | A few end-to-end tests |
   | Usability or exploratory concerns | Manual, outside this automation strategy |

4. **Shape the portfolio:** many fast unit tests, focused integration
   tests on boundaries, contract tests between independently deployed
   parts, and few end-to-end tests. State the rationale where the shape
   differs (for example a thin CRUD service may need more integration than
   unit tests).
5. **Prioritise the first tests:** highest risk and lowest cost first. For
   legacy code with few tests, start with characterization tests around the
   code that changes most.
6. **Plan CI:** which suites run on every pull request, which nightly, the
   time budget, parallelism, test data and environment needs, and a
   quarantine rule for flaky tests (owner, ticket, expiry; never silent).
7. **Define done for tests per change:** for example, a regression test per
   bug fix, an authorization test per endpoint, and a contract update per
   API change.
8. **Reuse what exists.** Propose new tools (a contract-testing library,
   Testcontainers) only where a named risk needs them, for approval.

## Outputs

- A test pyramid or portfolio, with the rationale per level tied to named
  risks.
- A prioritised list of the first tests to write, with their level.
- CI integration notes: suites per trigger, time budget, environments, and
  the flaky-test policy.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | xUnit, NUnit, or MSTest for unit tests; `WebApplicationFactory` and Testcontainers for integration; PactNet for contracts; Playwright for .NET or the JavaScript Playwright suite for end to end. |
| JavaScript and TypeScript | Vitest or Jest for unit and component tests, MSW for HTTP, Playwright or Cypress for end to end, Pact JS for contracts. |
| Python | pytest with fixtures, Testcontainers for Python or pytest-django's database, Hypothesis for properties, Pact Python or schema checks for contracts. |
| CI | Use the existing CI system's caching, test reporting (JUnit XML), and parallel jobs. Keep the pull request suite inside the agreed time budget. |

## Verification

- Every test level in the strategy names the risk it addresses in this
  system.
- The strategy reuses the existing frameworks, and any new tool is marked
  as a proposal needing approval.
- Current suite results cited in the strategy carry a status (PASSED,
  FAILED, SKIPPED, BLOCKED, NOT_RUN, UNKNOWN) and the command.
