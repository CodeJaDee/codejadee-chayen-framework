---
kind: recipe
capabilities: [CAP-07-001, CAP-07-003, CAP-07-004]
---
# UI features, client state, and forms

Build or fix a page or feature in the detected web framework, put each piece
of state where it belongs, and build forms with validation, accessible
errors, submission states, and server error mapping, all following the
app's existing patterns and versions.

## Inputs

- The feature description, designs if any, and the API contract (endpoint,
  request and response shapes, error format).
- The detected framework and version, and the closest existing page, store,
  and form to mirror.
- For state: the current state handling and the library already in use.
- For forms: the fields, rules (client and server), the submission
  endpoint, and the existing form approach.

## Procedure

### Feature (CAP-07-001)

1. **Pick the template.** Find the closest existing page with the same
   shape (list, detail, edit, wizard). Mirror its routing entry, file
   layout, data-loading call, and test file.
2. **Confirm the contract.** Read the API client, generated types, or
   OpenAPI document. If a field the UI needs is missing, stop and ask. Do
   not invent fields or mock them silently in production code.
3. **Load data through the existing layer:** an Angular service, a React
   Query or SWR hook, a Nuxt `useFetch` call, a Next.js Server Component,
   or a Pinia action, as the codebase does.
4. **Apply the UI states checklist**
   ([ui-states.md](ui-states.md)): decide loading, empty, error, retry,
   permission denied, and not-found behaviour before writing markup.
5. **Build the components** with typed inputs and outputs, from the design
   system. Keep data loading in the page or container, and rendering in
   presentational children.
6. **Wire routing and guards** as the app does. Guards are user experience
   only: the API must authorize.
7. **Test** the page with the states from the checklist, using the
   project's network mocking.

### State (CAP-07-003)

1. **Classify each piece of state** before choosing where it lives:

   | Kind | Example | Where it belongs |
   |---|---|---|
   | Server cache | Product list, current user | The existing server-state layer (TanStack Query, SWR, RTK Query, `useFetch`, a service with signals). Not copied into a global store. |
   | URL state | Filters, sort, page, selected tab | Route query parameters, so reload and sharing work |
   | Form state | Field values, touched, errors | The form library |
   | Local UI state | Open dropdown, hover | The component |
   | Shared client state | Cart, wizard progress, theme | The existing store (signals service, NgRx, Redux Toolkit, Zustand, Pinia) |
   | Derived state | Totals, filtered lists | Computed during render, `computed()`, or a selector. Never stored separately. |

2. **Use the library already present.** Never add a state library when one
   exists, and ask before adding the first one.
3. **For re-render or change-detection problems, measure first.** Use the
   React DevTools Profiler, Angular DevTools, or Vue DevTools, or count
   renders in a test. Find what changes identity (inline objects or
   functions, a context value rebuilt every render, a store selector
   returning a new array, a mutated signal) and fix that before adding
   memoization.
4. **Show the effect** with a test or a profiler note: the render count or
   the number of change-detection cycles, before and after.

### Forms (CAP-07-004)

1. **Use the existing form approach:** Angular reactive or template-driven
   forms, React Hook Form or Formik, VeeValidate or FormKit, and the
   project's schema library (zod, yup, valibot). Share the schema with the
   server when the project already does.
2. **Every input has a visible `<label>`.** Group related inputs with
   `fieldset` and `legend`. Mark required fields in text, not only with
   colour or an asterisk.
3. **Validate on blur or submit, not on every keystroke.** Show errors
   after the field is touched or after a submit attempt.
4. **Make errors accessible.** Each message is linked to its input with
   `aria-describedby`, the input gets `aria-invalid="true"`, and a failed
   submit moves focus to the first invalid field or to an error summary
   that links to the fields.
5. **Handle submission:** disable the submit control while pending and
   prevent double submits, keep the user's input on failure, and confirm
   success the way existing forms do.
6. **Map server errors.** Field errors from a 400 or 422 response (for
   example a ProblemDetails `errors` object, or a DRF field dictionary) are
   set on the matching controls. Errors without a field go to a form-level
   message. 409 conflicts explain what changed. 5xx and network failures
   use the error state, never a field.
7. **Test** valid, invalid, and server-error submissions, including the
   seeded 400 response mapped to the right field.

## Outputs

- UI code following the existing component, routing, data-loading, and
  form patterns, with the states from the checklist handled.
- For state work: where each piece of state lives and why, using the
  existing library, plus a test or measurable render-count check.
- For forms: validation with accessible messages, submission states, and
  server error mapping, plus tests for valid, invalid, and server-error
  submissions.
- Build, lint, typecheck, and test results.

## Technology considerations

| Stack | Consideration |
|---|---|
| Angular | Services own HTTP. Signals (`signal`, `computed`, `toSignal`) or RxJS with `async` pipe and `takeUntilDestroyed`. Typed reactive forms with `nonNullable`, `markAllAsTouched()` on a failed submit, and `setErrors` for server errors. Signal stores, NgRx, or NGXS only if present. |
| React (Vite) | Server state through TanStack Query, SWR, or RTK Query when present. Avoid `fetch` in `useEffect` without cancellation. React Hook Form `setError(field, ...)` for server errors. Keys from ids, never indexes, for reorderable lists. |
| Next.js | App Router: fetch in Server Components, keep `"use client"` boundaries small, and use Server Actions with `useActionState` only where the version and codebase use them. Stale data after a mutation usually means a missing `revalidatePath` or `revalidateTag`. Pages Router: follow the existing data functions. |
| Vue | `<script setup>` or Options API as the file uses. Pinia for shared state, composables for reuse. VeeValidate `setErrors` or FormKit for server errors. Do not destructure reactive props without `toRefs`. |
| Nuxt | `useFetch` or `useAsyncData` with a stable key for SSR-safe data, and explicit `pending`, `error`, and empty handling. `useState` for SSR-shared state, Pinia if installed. Browser-only code in `onMounted` or `<ClientOnly>`. |

## Verification

- The build, typecheck, and lint pass with the project's commands, and
  each check is reported PASS, FAIL, or NOT_RUN with the command.
- Tests cover the data, empty, error, and permission-denied states, or
  each missing one is listed as "not verified in browser".
- State work introduces no new state library when one exists, and the
  re-render fix is backed by a test or profiler measurement.
- The form blocks invalid submission, links each error to its field, and
  maps a seeded 400 or 422 response to the right fields in a test.
