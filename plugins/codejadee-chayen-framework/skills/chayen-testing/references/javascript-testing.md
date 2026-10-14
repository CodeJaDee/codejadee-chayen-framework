# JavaScript and TypeScript testing: Jest, Vitest, Jasmine/Karma, Testing Library, Playwright, Cypress

**Applies to:** Angular, React, Next.js, Vue, Nuxt, Vite, and Node or Bun
projects.

- Identify the runner from the config files: `vitest.config.*`,
  `jest.config.*`, `karma.conf.js`, the `test` builder in `angular.json`,
  `playwright.config.*`, `cypress.config.*`.
- Check `package.json` scripts as well.

## Check the repository first

| Area | What to look for |
|---|---|
| Unit runner | Vitest, Jest, Jasmine/Karma (Angular), `bun test` |
| Component testing | Angular `TestBed`, `@testing-library/*`, `@vue/test-utils`, `@nuxt/test-utils` |
| HTTP mocking | Angular `HttpTestingController`, MSW, `vi.mock`/`jest.mock` of the client module |
| End to end | Playwright (`tests/` or `e2e/`), Cypress (`cypress/e2e/`), page objects or fixtures |
| Conventions | `*.spec.ts` or `*.test.ts`, co-located or in `__tests__/`, `describe`/`it` naming |

## Unit and component tests

- **Test through the rendered output and user interactions**, not internal
  state.
  - **Testing Library:** query by role and label (`getByRole`,
    `getByLabelText`). Use `user-event` for interactions.
  - **Angular `TestBed`:**
    - configure with the component's real `imports` (standalone) or its
      module;
    - provide test doubles for services;
    - use `provideHttpClientTesting()` for HTTP.
- **Async code:**
  - `await` user events and `findBy*` queries;
  - fake timers (`vi.useFakeTimers()`, `jest.useFakeTimers()`,
    `fakeAsync`/`tick` in Angular) instead of real waits.
- **Mocks** are reset between tests (`vi.restoreAllMocks()`, or the
  runner's config).

## End-to-end tests

### Playwright

- **Locators:** `page.getByRole`, `getByLabel`, `getByTestId` (if the
  project uses test ids).
- **Assertions are web-first and auto-retrying:**
  `await expect(locator).toBeVisible()`.
- **Never use fixed timeouts.**
- **Isolate state.** Each test has its own data, or uses the project's
  fixtures. Use `storageState` for authentication if the project does.

### Cypress

- Use the chaining and retrying commands.
- Use `cy.intercept` for network control where the project does.
- Avoid arbitrary `cy.wait(ms)`.

### Scope

Cover critical user flows. Leave exhaustive validation permutations to unit
tests.

## Commands

Use the project's scripts. Use run mode, not watch:

```bash
npx vitest run
npx jest
ng test --watch=false            # Angular; Karma may need --browsers=ChromeHeadless
npx playwright test              # add --repeat-each=20 to probe flakiness
npx cypress run
bun test
```

## Flaky test checklist

| Cause | Fix |
|---|---|
| Missing `await` / unawaited promise | Await it, and assert with async queries |
| Real timers, or animation delays | Fake timers, or wait on the condition |
| Shared module state or mocks leaking between tests | Reset in `beforeEach`, and isolate modules |
| Order dependence | Run the single test alone. Run the file shuffled if supported. |
| Time zone, locale, or `Date.now()` | Fix the time zone in config, and control the clock |
| Network | Mock with MSW or `HttpTestingController`. No real backend in unit tests. |

## Pitfalls

- Snapshot tests for dynamic content, used as the only assertion.
- Testing implementation details: private methods, internal state, CSS
  class names.
- Adding a second runner (for example Jest beside Vitest) unasked.
