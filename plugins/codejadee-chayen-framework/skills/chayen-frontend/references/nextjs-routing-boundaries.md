---
kind: technology
---
# Next.js App Router and execution boundaries

## Check the repository first

Read `react-nextjs.md`. Inspect resolved Next/React versions, app or src/app,
pages or src/pages, route ownership, next.config, runtime settings, and imports.

## App Router segments (nextjs-app-router)

**Applies when:** An existing Next.js App Router feature needs pages, layouts, loading/error boundaries, or navigation changes.

**Not when:** Editing a Pages Router feature; retain its existing page and API conventions instead.

**Version notes:** App Router is stable from Next.js 13.4. Request APIs and params/searchParams become asynchronous in newer releases; inspect exact installed types and use the existing compatible signature.

**Steps:**

1. Locate the affected segment, parent layouts, route groups, loading/error files, and client islands. In mixed-router apps keep the feature in its current owner; do not perform an unrequested Pages-to-App migration.
2. Add the smallest page or layout and reuse next/link and the existing navigation helpers. Keep browser hooks in compatible Client Components and server data access in server owners; error boundary components need the framework's client convention.
3. Define parameter handling, not-found/error outcomes, and pending UI. Check async params/searchParams against the installed version; do not assume a current-doc signature is valid for an older project.
4. Build and test direct entry, nested navigation, parameter changes, loading failure, not-found, and back/forward in the configured tools. For mixed routers also test crossing the boundary; distinguish production server behavior from dev-only navigation.

**Verify:** Report PASS, FAIL, or NOT_RUN for build, route, and browser checks with exact commands; preserve route architecture and identify untested deployment fallback behavior.

## Server and client imports (nextjs-server-client-boundary)

**Applies when:** Next.js App Router imports, props, hooks, or sensitive data cross Server/Client Component boundaries.

**Not when:** A Vite React SPA needs a local state fix; use React state guidance instead.

**Version notes:** These boundaries are App Router-specific. A Client Component can still be prerendered on the server; use client does not guarantee browser-only execution during render. Check installed serialization and server-only support.

**Steps:**

1. Trace the import graph from use client entrypoints and classify each module by actual execution and dependencies. Identify server credentials, database clients, request APIs, browser libraries, and serializable public props.
2. Keep the client island small and move privileged work into existing server modules. Use the project's server-only guard where supported; do not mark a layout use client merely to satisfy one nested event handler.
3. Pass only deliberately selected DTO fields across the boundary. Never expose secrets in props, action results, hydration/RSC payloads, HTML, source maps, env prefixes, or client-imported modules. Browser-only APIs need a supported lifecycle or loading boundary even inside Client Components.
4. Build the actual feature and add a negative import/bundle test with a synthetic secret sentinel. Inspect generated client artifacts and response payloads without printing real credentials; test hydration and server rendering separately, and preserve any supported server-component composition pattern.

**Verify:** Report PASS, FAIL, or NOT_RUN for boundary compilation, artifact inspection, and rendering with commands; finding no NEXT_PUBLIC secret is insufficient to prove no leak.

### Recipe example

The server reads a product and passes only id, name, and display price to an
existing client purchase button. The button calls the authorized server mutation.
The server's credential module is never a client import; test that such an import
fails the installed production build rather than trusting naming alone.

## Verification commands

Use the configured production build and browser/server route tests. Preserve
Pages Router features and check mixed-router navigation when it is affected.

## Pitfalls

- Treating use client as proof window exists during prerender.
- Passing entire ORM entities into browser props.
- Moving sensitive modules into the client graph to resolve a hook error.
