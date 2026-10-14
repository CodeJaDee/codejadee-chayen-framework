---
kind: technology
---
# Vue component testing

## Check the repository first

Inspect Vue/compiler and test-library versions, package manager, scripts,
runner/DOM environment, installed Vue Test Utils or Testing Library, router/
store wrappers, Nuxt test environment when present, and nearest specs.

## Public component behavior (vue-component-testing)

**Applies when:** Vue component tests need bindings, emits, models, slots, async behavior, or lifecycle regression coverage.

**Not when:** Implementing a UI feature as the main request; use the frontend workflow and its ordinary tests instead.

**Version notes:** Vue Test Utils v1 targets Vue 2 and v2 targets Vue 3; match installed runner and library APIs. Nuxt context/auto-imports need its supported test utilities or integration environment, not an assumed plain Vue mount.

**Steps:**

1. Record the configured runner, framework/library version, environment, and nearest mount/wrapper conventions. Retain Jest, Vitest, or existing tools; Vue does not imply Vitest, Vite, or a new DOM dependency.
2. Render the meaningful component with current router/store/plugin wrappers and mock I/O at the established boundary. Exercise public props, emitted payloads, labels, events, slots, and model contract rather than changing private component internals.
3. Await Vue rendering and pending promises through supported utilities, keeping fake-timer semantics deliberate. Cover rejected requests, stale updates, loading/error/empty states, and unmount/scope cleanup; reset shared stores between tests.
4. Add success plus invalid/failure or lifecycle-negative tests and run the configured commands. Use suitable Nuxt/browser/SSR levels for framework context and hydration; a mocked composable or plain mount cannot prove server authorization, request isolation, or actual hydration behavior.

**Verify:** Report PASS, FAIL, or NOT_RUN with test/build commands and pass/fail/skip counts; no runner swap, broad snapshot update, or arbitrary sleep may hide a failure.

```ts
// Existing Vue Test Utils v2 setup, with current component/import contracts:
const wrapper = mount(OrderCard, { props: { title: 'Order' } })
await wrapper.get('button').trigger('click')
expect(wrapper.emitted('open')).toHaveLength(1)
wrapper.unmount()
```

Add a changed-prop or rejected-load case through the same public interface.

## Verification commands

Run the installed component runner and configured SFC typecheck/build.
Browser focus, SSR, and Nuxt-context checks remain separate observed results.

## Pitfalls

- Vue 3 testing APIs imported into Vue 2 specs.
- Nuxt composables mocked away when their context failure is the bug.
- Shared Pinia/Vuex instances contaminating later cases.
