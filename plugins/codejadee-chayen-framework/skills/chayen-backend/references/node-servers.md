---
kind: technology
---
# Node servers: Nuxt server routes and Next.js route handlers

**Applies to:** server-side TypeScript and JavaScript in Next.js and Nuxt.
Standalone Nitro and Elysia are out of scope; no technology pack is provided.

- Check the installed major versions in `package.json` and the lock file.
- APIs change between majors (Nuxt and Next.js). Follow the
  documentation for the installed version.

## Check the repository first

| Area | What to look for |
|---|---|
| Framework | `nuxt` (`server/` directory), `next` (`app/**/route.ts` or `pages/api/`) |
| Validation | zod, valibot, TypeBox, Standard Schema adapters. Use the one already present. |
| Error shape | `createError` (h3), `NextResponse.json({ ... }, { status })` |
| Data access | Prisma, Drizzle, Kysely, `pg`, `postgres`, `mssql`. See data-access.md. |
| Runtime | Node (version in `.nvmrc` / `engines`) or Bun (`bun.lock`) |

## Nuxt server routes

Use [nuxt-server.md](nuxt-server.md) for Nuxt-specific work. Preserve the
installed Nuxt version, source roots, handler and config conventions. Keep
private config out of returned DTOs, SSR payloads, client imports and state.
Do not migrate server dependencies as part of an endpoint change.

## Next.js route handlers and server code

- **App Router:** `app/**/route.ts` exporting `GET`, `POST`, and so on, and
  returning `Response` or `NextResponse`.
- **Pages Router:** `pages/api/*.ts` handlers. Do not mix the two styles in
  one feature.
- **Dynamic `params`.** In recent Next.js versions they are asynchronous
  (`await params`). Check the installed version and the existing handlers.
- **Server Actions** need the same validation and authorization as route
  handlers. Treat them as public endpoints.
- **Secrets:** `NEXT_PUBLIC_*` values are public; client imports, next.config
  env, serialized props/results, HTML/RSC payloads, and source maps can also
  expose data. Keep privileged values out of every client path.
- For Next.js, load `nextjs-server.md` plus the relevant mutations or
  data/auth topic. Preserve App/Pages Router architecture and check the
  resolved version, cache model, request APIs, and current runtime.

## General rules

- **Validate every external input:** params, query, body, and headers.
  Validate at the boundary with a schema.
- **Return explicit status codes and a consistent error body.** Do not leak
  stack traces.
- **Authorization runs on the server** for every route and action. The UI
  hiding a button is not authorization.
- **Avoid blocking the event loop.** No synchronous file or CPU-heavy work
  in handlers.

## Verification commands

Use the project's scripts:

```bash
npm run build
npm run lint
npm test           # or: npx vitest run / bun test
npx tsc --noEmit   # if there is no typecheck script
```

For Nuxt, use `npx nuxi typecheck` if configured.

## Pitfalls

- Using APIs from a different major version than the one installed.
- Reading `process.env` secrets in code that is bundled for the client.
- Returning ORM objects directly, which exposes internal fields.
