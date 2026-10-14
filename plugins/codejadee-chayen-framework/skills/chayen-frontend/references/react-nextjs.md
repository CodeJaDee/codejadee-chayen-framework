---
kind: technology
---
# React and Next.js (including Vite React apps)

**Applies to:** React applications built with Vite, Next.js, or another
bundler.

- Read the `react` and `next` major versions first.
- Hooks such as `useActionState` or `use`, Server Components, and caching
  defaults all depend on the version.

## Check the repository first

| Area | What to look for |
|---|---|
| Framework | Vite (`vite.config.*`), Next.js App Router (`app/`) or Pages Router (`pages/`) |
| Components | Function components and hooks. Look for TypeScript prop types, naming, and co-located styles. |
| State | Local state, Context, Redux Toolkit, Zustand, Jotai. Server state: TanStack Query, SWR, RTK Query. |
| Forms | Controlled inputs, React Hook Form, Formik, framework form actions. Validation: zod, yup. |
| Styling | CSS Modules, Tailwind, styled-components / Emotion, a component library |
| Tests | Vitest or Jest, with React Testing Library. Playwright or Cypress for end to end. |

## Guidance

### Components and state

- **Keep components pure.** Derive values during render, not with
  `useEffect` plus `setState`.
- **Use `useEffect` only to synchronize with external systems**, such as
  subscriptions or browser APIs.
  - Include all dependencies.
  - Clean up subscriptions.
- **Lists:** use stable `key`s from the data (an id), never the array index
  for lists that reorder.
- **Re-render problems:**
  1. Find what changes identity: inline objects or functions passed to
     memoized children, or a context value recreated every render.
  2. Fix that first.
  3. Then apply `memo`/`useMemo`/`useCallback` where measurement shows
     benefit.
- **Server data** goes through the project's data layer (TanStack Query,
  SWR, and so on). Do not add ad-hoc `fetch` in effects when one exists.

### Forms

- **Follow the existing form library.** Validate with the project's schema
  library, and share schemas with the server when the project does.
- **Every input has a label.**
- **Errors** are announced (`aria-invalid`, `aria-describedby`) and shown
  after interaction or submit.
- **Disable the submit button while pending.** Handle server errors visibly.

### Next.js specifics

- **App Router.**
  - Components are Server Components by default.
  - Add `"use client"` only to components that need state, effects, or
    browser APIs.
  - Keep the client boundary small.
- **Data fetching and caching semantics differ across Next.js majors.**
  - Check the version and the existing pages before relying on `fetch`
    caching, `revalidatePath`/`revalidateTag`, or `dynamic` settings.
  - Stale data after a mutation usually means a missing revalidation.
- **Dynamic `params`/`searchParams`** are asynchronous in recent versions.
  Follow the existing pages.
- **Only `NEXT_PUBLIC_*` variables are exposed to the browser.** Never put
  secrets in them.

### Vite specifics

- **Client environment variables** must be prefixed with `VITE_`, and are
  public in the bundle. Never put secrets in them.
- **Path aliases** are defined in `vite.config.*` and `tsconfig.json`. Keep
  the two in sync.

### Security

- No `dangerouslySetInnerHTML` with untrusted content. Sanitize with the
  project's sanitizer if it is unavoidable.
- No `javascript:` URLs from user data.

## Verification commands

```bash
npm run build
npm run lint
npx tsc --noEmit       # if no typecheck script
npm test               # Vitest or Jest; use run mode, not watch
```

## Pitfalls

- Fetching in `useEffect` without handling race conditions or unmounts.
- Large Client Components in Next.js that pull server-only modules into the
  bundle.
- Hydration mismatches from `Date.now()`, random ids, or `window` access
  during render.
