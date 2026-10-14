---
kind: technology
---
# Next.js server engineering

## Check the repository first

1. Inspect resolved next, react/react-dom, Node/Bun, TypeScript, auth, data,
   and validation package versions. Match packageManager, lockfile, workspace,
   and CI evidence to npm, pnpm, Yarn, or Bun; resolve conflicts before edits.
2. Identify App Router app/src/app or Pages Router pages/src/pages and the
   owning feature. Preserve route architecture, installed auth/session and
   data-access libraries, and supported Node/Edge/deployment runtimes.
3. Read next.config, cacheComponents if present, middleware/proxy, request
   APIs, server modules, and the nearest handler/action/data function. Check
   exact version support for async params, cookies/headers, and cache APIs.
4. Locate every remotely reachable read/write boundary: Server Function,
   route handler, Pages API route, and protected data access. Each must perform
   its applicable authentication, resource/tenant authorization, and input
   validation even if a parent layout, UI, middleware, or proxy already checks.
5. Keep server credentials and sensitive objects out of browser imports,
   NEXT_PUBLIC variables, next.config env, serialized props, RSC/HTML payloads,
   action responses, transfer state, source maps, and logs. Use minimal DTOs;
   mark existing privileged modules server-only where supported. Guidance is
   advisory; server checks and build/runtime controls supply actual enforcement.

Load this base plus the one needed topic: `nextjs-mutations.md` or
`nextjs-data-auth.md`. Keep API, auth, integration, or error-handling workflow
in the existing recipe. Server Components call the established data layer
directly where appropriate; do not add a self-HTTP round trip solely for reuse.

## Compatibility decisions

| Evidence | Decision |
|---|---|
| Pages Router feature | Retain pages/api, page data functions, existing auth flow; no App Router conversion |
| App Router feature | Use supported route handlers/Server Functions and current request signatures |
| Existing query/auth/schema library | Extend it; no speculative store/auth/validation library |
| Next 14 versus 15+ | Check changed fetch/GET caching defaults and request APIs before choosing options |
| Next 16 Cache Components configured | Follow that cache model; do not assume old segment flags or revalidation semantics apply |
| Older middleware versus newer proxy conventions | Preserve the installed version's file/runtime behavior; neither replaces server authorization |

## Commands and verification

Use configured scripts, manager, typecheck, lint, unit/integration tests, and
production build/server. Do not assume next lint exists in newer releases or
that a build runs lint. Test direct unauthorized and forbidden requests,
malformed input, allowed ownership, identity-sensitive caching, and secret
sentinels. Missing framework/runtime fixtures mean NOT_RUN with the reason.

## Pitfalls

- Hiding a link or redirecting in a layout mistaken for authorization.
- Accepting a submitted owner/user/role field as trusted identity.
- Server-only code imported through a shared barrel into the client graph.
