---
kind: technology
---
# React components, state, and effects

## Check the repository first

Read `react-nextjs.md` first. Inspect resolved react/react-dom versions,
component conventions, hooks linting, StrictMode, installed stores, and
existing tests. Keep the feature or refactoring procedure in its own recipe.

## Component contracts (react-component-patterns)

**Applies when:** Building, composing, or splitting React components with concrete props and user interactions.

**Not when:** Only defining TypeScript wire models; use shared type and API-model guidance instead.

**Version notes:** Hooks require React 16.8+. Preserve class components where appropriate; do not automatically convert them. Ref-as-prop behavior in React 19 differs from older forwardRef conventions.

**Steps:**

1. Find the nearest component and record prop, ref, composition, styling, and file conventions. In a framework app identify execution boundaries before moving a hook or importing a child.
2. Define the smallest props and event contract that satisfies the feature. Reuse existing design-system primitives and actual shared patterns; avoid a configurable component framework for one caller.
3. Keep render pure and ownership explicit. Derive display values from props, preserve immutable inputs, and use stable data keys for reorderable children; keep privileged data access in its existing server owner.
4. Test parent bindings, event payloads, empty/error/pending variants, ref consumers when changed, and reorder behavior. Build with the configured toolchain and check accessibility through the public interface instead of asserting private component implementation details.

**Verify:** Report PASS, FAIL, or NOT_RUN with component/build commands; distinguish rendered interactions from element-construction or static markup checks.

```tsx
type CardProps = { title: string; onOpen: () => void };
function Card({ title, onOpen }: CardProps) {
  return <button type="button" onClick={onOpen}>{title}</button>;
}
```

## Owned state and synchronization (react-state-effects)

**Applies when:** React local/shared state or effects have stale values, redundant derivation, cleanup, or update-order defects.

**Not when:** Fetching server data through an existing query library; use server-state guidance instead.

**Version notes:** Check React and hook/library versions, StrictMode, and Compiler configuration. Development effect setup/cleanup probes are not proof of production duplicate requests; newer hook APIs are not assumed available.

**Steps:**

1. Trace who owns each value: component, context, Redux Toolkit, Zustand, Jotai, or another installed store. Extend that owner without introducing or swapping state libraries for an isolated change.
2. Derive values during render or existing selectors rather than copying them through effects. Use functional updates for changes based on previous state; do not mutate state objects or rely on a stale render snapshot.
3. Use effects to synchronize with external systems. Include dependencies, unsubscribe or abort owned work, and handle rapid changes and unmount. Move user-triggered writes to their event handler instead of an effect that can replay.
4. Test dependency changes, multiple queued updates, unmount cleanup, and late completions. Preserve existing StrictMode and hooks linting rather than disabling them to hide defects; confirm the fix does not expand state scope or break store subscriptions.

**Verify:** Report PASS, FAIL, or NOT_RUN for state/effect and configured lint tests, with commands; tests must exercise cleanup and stale-response exclusion where relevant.

```tsx
const total = items.reduce((sum, item) => sum + item.price, 0);
// Derived during render; no effect plus setTotal is needed.
const increment = () => setCount(previous => previous + 1);
```

## Verification commands

Use configured component tests, hooks linting, typecheck, and build. Preserve
existing component and store structure instead of installing a new state tool.

## Pitfalls

- Index keys in editable reorderable lists.
- A fetch response winning after its component or query context changed.
- Removing dependency lint rules or StrictMode as a repair.
