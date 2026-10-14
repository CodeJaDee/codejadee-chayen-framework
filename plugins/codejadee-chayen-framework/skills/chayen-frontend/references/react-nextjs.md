---
kind: technology
---
# React and Next.js (including Vite React apps)

**Applies to:** React applications built with Vite, Next.js, or another
bundler.

- Read resolved `react`, `react-dom`, and `next` versions first, along with
  the installed router, state, form, validation, and testing libraries.
  Manifest ranges alone do not prove installed API support.
- Hooks such as `useActionState` or `use`, Server Components, and caching
  defaults all depend on the version.

## Check the repository first

Compare packageManager, lockfile, workspace, and CI evidence for npm, pnpm,
Yarn, or Bun; resolve conflicting evidence before dependency edits. Use the
configured build, typecheck, lint, and test scripts, not assumed npm commands.
Inspect next.config, React Compiler, StrictMode, cacheComponents, and target
runtime when present. React alone does not imply Next.js or a client router.

Load this base plus the relevant topic only: `react-components-state.md`,
`react-data-forms.md`, `react-navigation-accessibility.md`, `react-rendering.md`,
`nextjs-routing-boundaries.md`, or `nextjs-rendering-seo.md`. Keep workflow in
the matching feature, component, form, accessibility, or performance recipe.

| Version/convention signal | Preserve or check |
|---|---|
| Existing classes, hooks, refs | Retain local conventions; hooks need React 16.8+, ref-as-prop differs in React 19 |
| Existing state/query/forms | Extend installed tools; no new store, query, or form library without need and authorization |
| Next Pages Router | Keep pages/api, page data functions, and next/head; no incidental App Router migration |
| Next App Router | Keep server/client ownership, compatible request APIs, and current route structure |
| Newer Next/React APIs | Check exact versions before useActionState, async request props, cache APIs, or Compiler assumptions |

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
- `NEXT_PUBLIC_*` values are public, and `next.config` env, client imports,
  props, action results, source maps, HTML and RSC payloads can also expose
  data. Keep server credentials and privileged modules out of all these paths;
  inspect names and locations without printing values. A server-only module
  guard helps catch imports but does not prevent unsafe serialized props.
- A Client Component may be prerendered on the server. Keep browser globals
  behind the supported lifecycle/loading boundary rather than reading them
  during initial render.
- Protected operations authenticate, validate, and authorize on the actual
  server action/handler/data boundary. Client guards, hidden buttons, and
  layout or middleware/proxy redirects are not substitutes.

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

Use the detected manager and configured scripts first. These npm commands
are examples only for projects that configure them; never download a global
compiler or invent a lint target. Test-only React requests use the testing
workflow. Next server-only work uses the backend workflow, and deployment
validation uses the devops workflow.

```bash
npm run build
npm run lint
tsc --noEmit           # only with the existing local compiler/configuration
npm test               # Vitest or Jest; use run mode, not watch
```

## Pitfalls

- Fetching in `useEffect` without handling race conditions or unmounts.
- Large Client Components in Next.js that pull server-only modules into the
  bundle.
- Hydration mismatches from `Date.now()`, random ids, or `window` access
  during render.
