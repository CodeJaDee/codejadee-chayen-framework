---
kind: technology
---
# React navigation and accessible interaction

## Check the repository first

Read `react-nextjs.md`. Inspect router package/version, framework routing,
route loaders, link primitives, focus helpers, and accessibility test setup.

## Existing routing architecture (react-routing)

**Applies when:** A React application using an installed client router needs route, navigation, loader, or URL-state changes.

**Not when:** Editing a Next.js App Router segment; use App Router guidance instead.

**Version notes:** React has no built-in client router. Detect React Router or the installed alternative and its version/mode; React Router declarative, data, and framework APIs are not interchangeable.

**Steps:**

1. Find the current route definitions, nested outlets, base path, loader strategy, and link helper. Preserve the installed routing architecture; do not install React Router into a Next.js app or migrate existing router modes incidentally.
2. Define URL parameters and query state according to the feature contract. Reuse current navigation primitives, encode user-controlled segments, and retain deep-link, back/forward, redirect, and not-found behavior.
3. Integrate loading and error handling with existing route boundaries. Keep client route guards as user experience checks only; server APIs must independently authorize every protected read or write.
4. Test direct entry, nested navigation, parameter changes, rejected loading, redirects, and history. Use the project's router test wrapper or browser tooling; distinguish local router behavior from deployed SPA fallback configuration that was not exercised.

**Verify:** Report PASS, FAIL, or NOT_RUN for configured route and browser checks with commands; do not claim host deep links work from an in-memory router test.

## Accessible React controls (react-accessibility)

**Applies when:** React controls, forms, dialogs, or dynamic navigation need accessible names, keyboard behavior, or focus management.

**Not when:** Creating design-only images or mockups without code; use design guidance instead.

**Version notes:** Native HTML semantics are broadly compatible. useId requires React 18+; match installed design-system focus and accessibility APIs rather than automatically adding a newer library.

**Steps:**

1. Identify the affected control's role, accessible name, label, keyboard behavior, focus transitions, and status messages. Reuse the project's accessible primitives and semantic buttons, links, and inputs before custom interaction code.
2. Associate labels and error descriptions with stable unique ids. Avoid duplicate ids in repeated components and do not use useId as a list identity key; when older React lacks it, retain the project's existing id strategy.
3. Manage focus on route transitions, dialog open/close, and invalid form submission through existing helpers. Announce meaningful asynchronous status changes without flooding live regions; preserve keyboard operation and focus visibility.
4. Run role/label-based tests, keyboard-only interaction, focus restoration, and configured accessibility checks. Record manual assistive-technology review separately; static React server markup cannot prove browser focus or screen-reader behavior.

**Verify:** Report PASS, FAIL, or NOT_RUN separately for semantic markup, rendered keyboard behavior, and manual assistive-technology checks, with command or procedure evidence.

```tsx
<button type="button" aria-expanded={open} aria-controls="details"
        onClick={() => setOpen(previous => !previous)}>Details</button>
<section id="details" hidden={!open}>Order details</section>
```

In repeated instances the controlled region needs an instance-unique id.

## Verification commands

Use installed router/component runners and configured browser accessibility
checks. Test semantics and focus, not only CSS or component snapshots.

## Pitfalls

- Adding a second router inside a framework router.
- Clickable noninteractive elements without keyboard support.
- Assuming a passing static accessibility check establishes usable focus.
