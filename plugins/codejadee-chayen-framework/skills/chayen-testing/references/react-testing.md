---
kind: technology
---
# React component testing

## Check the repository first

Inspect resolved react/react-dom and test-library versions; package manager,
scripts, Jest/Vitest or other configured runner, DOM setup, browser tests,
router/query wrappers, and nearest specs. Never assume a default runner.

## Observable component behavior (react-component-testing)

**Applies when:** React component tests need user interactions, async behavior, state boundaries, or failure regression coverage.

**Not when:** Implementing production UI as the main task; use the frontend feature workflow with its normal verification instead.

**Version notes:** Match installed React, Testing Library/user-event, runner, act integration, and fake-timer support. Server-rendered async components and framework behavior may need Next/browser integration rather than a DOM-only unit runner.

**Steps:**

1. Record the actual runner, DOM/browser environment, scripts, and nearest test conventions. Reuse existing router, store, and query wrappers; do not add Jest, replace Vitest, or install a DOM library merely because an example uses it.
2. Render the real component and mock external I/O at the project's established boundary. Query by role, accessible name, or label; exercise real user input rather than setting private state or replacing the meaningful template.
3. Use supported async assertions and cleanup for pending, failure, cancellation, unmount, and retry. Reset shared query/store state between tests; avoid arbitrary sleeps, unexplained act warnings, or fake timers that change the behavior being tested.
4. Add a positive interaction and a negative/error or stale-result regression, asserting visible output and callback payloads. Keep keyboard/focus and server-boundary checks at suitable levels; a client test cannot prove action authorization, production hydration, or server-component execution.

**Verify:** Report PASS, FAIL, or NOT_RUN with configured commands and passed/failed/skipped counts; retain real failures instead of weakening assertions or bulk-updating snapshots.

```tsx
// In a project already using Testing Library and user-event:
const user = userEvent.setup();
render(<SaveForm onSave={save} />);
await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada');
await user.click(screen.getByRole('button', { name: 'Save' }));
await waitFor(() => expect(save).toHaveBeenCalledWith({ name: 'Ada' }));
```

Use installed imports and the current SaveForm contract. Add a rejected-save
case that retains input and announces failure; do not call a real API.

## Verification commands

Run configured non-watch component tests, typecheck, and build. For async
Server Components follow the current framework's supported test level; mark
missing browser/framework fixtures NOT_RUN.

## Pitfalls

- Snapshot-only tests that miss behavior and accessible names.
- Shared query clients contaminating later tests.
- Inferring server authorization from a disabled submit button.
