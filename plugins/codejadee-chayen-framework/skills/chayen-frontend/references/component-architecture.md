---
kind: recipe
capabilities: [CAP-07-002]
---
# Component architecture

Structure UI components so that each has one reason to change: split
oversized components, separate data access from rendering, decide shared
versus feature placement, and refactor in steps that keep the UI working.

## Inputs

- The current component tree, or the oversized component and its tests.
- The framework conventions in the repository: folder layout (feature
  folders, `shared/`, Nx or monorepo libraries, Next.js route folders, Nuxt
  `components/`), naming, and how existing features are composed.
- The design system or component library in use, if any.

## Procedure

1. **Map the current component.** List its responsibilities: data
   fetching, state, business rules, layout, repeated markup, and side
   effects. Note its public surface (inputs, outputs, selector or export,
   route) and what depends on it.
2. **Protect behaviour first.** If tests do not cover the visible
   behaviour, add characterization tests (rendered output, emitted events,
   key interactions) before moving code. If adding tests is not possible,
   say so and keep each step smaller.
3. **Propose the tree** before editing. For each component, give its
   responsibility, inputs, outputs, owned state, and file location:
   - **Container (smart):** loads data, owns feature state, handles
     events, and passes plain data down.
   - **Presentational (dumb):** renders inputs and emits events, with no
     data access. Easy to test and reuse.
   - **Extract by reason to change,** not by line count: a repeated row, a
     section with its own state, a dialog, a form.
   - **Data flow:** inputs down, events up. Two or three levels of
     pass-through is fine. Deeper sharing uses the existing mechanism:
     context, `provide` and `inject`, or an injectable service.
4. **Place each component** where the repository's convention says:
   - used by one feature: inside that feature's folder;
   - used by two or more features and free of feature knowledge: the
     shared or UI library;
   - generic visual building blocks that the design system already
     provides: use the design system, do not duplicate it.
5. **Refactor in reversible steps.** Extract one component at a time, keep
   the public selector or export stable, run the tests after each step, and
   do not change behaviour or styling in the same step.
6. **Respect rendering boundaries.** In Next.js App Router, keep Server
   Components as the default and push `"use client"` to the smallest leaf
   that needs state or browser APIs. In Nuxt, mark browser-only pieces with
   `.client` or `<ClientOnly>`.
7. **Report** the final tree, the moved files, and anything left for later
   (for example, a remaining large component with a reason).

## Outputs

- A proposed component tree with each component's responsibility, inputs,
  outputs, state, and location, and the data flow between them.
- Refactor steps that keep the UI working, applied or listed, with tests
  passing after each applied step.
- Notes on what moved to shared code, and why.

## Technology considerations

| Stack | Consideration |
|---|---|
| Angular | Standalone components declare their `imports`. NgModule apps declare in the owning module. `OnPush` for presentational components when the codebase uses it. Signal `input()` and `output()` or `@Input()` and `@Output()` as the version and codebase use. Feature folders or Nx libraries with enforced boundaries if configured. |
| React | Function components and hooks. Custom hooks hold reusable logic, components hold markup. Avoid prop drilling deeper than two or three levels with context or the existing store, and keep context values stable. |
| Next.js | `app/` route folders may hold private `_components`. Server Components by default. A client component cannot import a server-only module. |
| Vue | Typed `defineProps` and `defineEmits`, `defineModel` where used. Composables for logic. Slots for layout composition. Do not mutate props. |
| Nuxt | Auto-imported `components/` with path-based names (`components/order/Row.vue` becomes `OrderRow`). Moving a file renames the component, so update usages. |

## Verification

- Existing and characterization tests pass after each applied step,
  reported PASS, FAIL, or NOT_RUN with the command.
- The public surface (selector, export, route) is unchanged, or each change
  is listed with its callers updated.
- New files follow the repository's folder and naming conventions, with an
  example of the convention cited.
- Build and typecheck pass. Visual equivalence not checked in a browser is
  marked "not verified in browser".
