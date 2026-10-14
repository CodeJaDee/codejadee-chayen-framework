---
kind: technology
---
# Angular testing

## Check the repository first

Inspect resolved @angular/core, CLI/build packages, package-manager evidence,
angular.json or workspace project targets, test scripts, runner configs,
and nearest specs. TestBed is Angular infrastructure, not a test runner.

## Angular behavior tests (angular-testing)

**Applies when:** Writing, repairing, or selecting tests for Angular components, services, routes, forms, or HTTP behavior.

**Not when:** Implementing production UI without a test-only request; use the frontend workflow with its existing tests instead.

**Version notes:** Existing projects may use Karma/Jasmine, Jest, Vitest, or custom builders. Check runner and Angular support before selecting async utilities; fakeAsync requires Zone.js and is not a universal choice for zoneless or Vitest setups.

**Steps:**

1. Record the actual Angular version, test builder, runner, browser environment, and package script. Follow the nearest spec's matchers and async style; do not replace Karma/Jasmine with Vitest or Jest as part of adding coverage.
2. Configure TestBed imports for standalone components or declarations and owning modules for NgModule components. Override only external boundaries; keep real template bindings, forms, and change notifications involved in the behavior under test.
3. Use the supported HTTP testing module or providers, placing provideHttpClient before provideHttpClientTesting when that style exists. Assert request shape, success, failure, cancellation where relevant, and no outstanding requests; never call a live API.
4. Exercise user interactions and observable output with the runner's supported async tools. Include destroy/teardown, delayed updates, route transitions, validation errors, and a failing negative control. Avoid redundant forced detection that conceals notification bugs; report browser or hydration checks separately.

**Verify:** Report PASS, FAIL, or NOT_RUN with the configured test/build commands and passed/failed/skipped counts; no runner change or blanket snapshot update may hide failures.

### Recipe example: HTTP failure without a live server

```ts
const http = TestBed.inject(HttpTestingController);
let failed = false;
service.load().subscribe({ error: () => { failed = true; } });
http.expectOne('/api/orders').flush('unavailable', {
  status: 503, statusText: 'Service Unavailable',
});
expect(failed).toBe(true);
http.verify();
```

Use the project's supported testing setup and existing service contract.
For a standalone component use TestBed imports; for a declared component use
its owning module or declarations consistent with the installed Angular major.

## Verification commands

Resolve the manager from packageManager, lockfiles, and CI. Run the configured
test script with that manager; add non-watch flags only when supported by its
runner. Build the owning app or library to compile templates. Missing browser,
dependencies, or server fixture means NOT_RUN with the reason.

## Pitfalls

- Putting standalone components into declarations.
- Assuming every Angular spec supports fakeAsync.
- Mocking the entire template so a binding defect never runs.
