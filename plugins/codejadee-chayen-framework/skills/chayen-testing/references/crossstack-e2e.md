---
kind: technology
---
# Cross-stack end-to-end tests

Stack detail for tests that run a real front end, a real API, and a test
database together in a browser. Use it with the test authoring and test
strategy recipes, and with the configured end-to-end runner (Playwright,
Cypress, Selenium, or a framework's own runner). End-to-end tests are the
few tests that prove the layers agree; keep them few and stable.

## Check the repository first

| Area | What to look for |
|---|---|
| Runner | Playwright, Cypress, Selenium, WebdriverIO, or framework tooling; config files, browsers, CI jobs |
| Topology | How tests start the API and front end (`webServer` config, Docker Compose, test hosts), origins and ports, proxies |
| Data | Test database setup (container, local cluster, LocalDB), migrations applied, seed data, cleanup or isolation per test |
| Auth | Test users, login helpers, stored authentication state, how tokens or cookies are created for tests |
| Existing suites | Naming, page objects or fixtures, tags, retries, flaky test handling, artifacts (traces, screenshots) |

## Browser to API to database flows (crossstack-e2e)

**Applies when:** writing, fixing, or reviewing end-to-end tests that drive
a browser through a front end, its API, and a database, including login,
cross-origin calls, and contract fields shown in the UI.

**Not when:** a single layer can be tested in isolation (unit, component,
API integration tests are cheaper), or the request is load testing
(performance skill).

**Version notes:** use the runner and browser versions the project pins;
Playwright and Cypress APIs and default timeouts change between majors.
Third-party cookie restrictions in browsers affect cross-site test setups;
same-site origins with different ports are not cross-site.

**Steps:**

1. Choose the few journeys that prove cross-layer agreement: sign in, a
   core read, a core write with validation errors, and an authorization
   denial. Leave detailed branches to lower-level tests.
2. Start real components with test configuration: the API with a test or
   disposable database (never a shared or production database), migrations
   applied, deterministic seed data, and the front end pointing at the test
   API with the real origins and CORS settings.
3. Authenticate the way users do for at least one test (a real login), then
   reuse stored state for speed; never put real credentials in the repo.
4. Assert user-visible outcomes plus the cross-layer facts: data shown
   matches the API contract, dates appear in the expected zone, errors show
   the right message, and forbidden actions are refused by the server.
5. Make tests deterministic: wait on conditions (responses, elements), not
   fixed sleeps; isolate data per test; record traces and screenshots on
   failure.
6. Run in CI with the same topology and capture artifacts; quarantine
   flaky tests through the project's process instead of adding retries.

**Verify:** report PASS, FAIL, or NOT_RUN per journey with the runner
command, browser and version, and the database used (test or disposable);
a journey not executed in a real browser is NOT_RUN.

```ts
test("signed-in user sees their order total", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(testUser.email);
  await page.getByLabel("Password").fill(testUser.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.goto("/orders/1");
  await expect(page.getByTestId("order-total")).toHaveText("19.99");
});
```

## Commands

```bash
npx playwright test --project=chromium --trace=retain-on-failure   # Playwright projects
npx cypress run --browser chrome                                   # Cypress projects
```

## Pitfalls

- End-to-end tests against a shared or production database.
- Fixed sleeps instead of waiting for conditions.
- Testing every validation branch end to end.
- Mocked APIs presented as end-to-end evidence.
