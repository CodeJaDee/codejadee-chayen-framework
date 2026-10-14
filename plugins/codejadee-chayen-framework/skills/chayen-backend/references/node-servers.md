---
kind: technology
---
# Node and Bun servers: Nitro, Nuxt server routes, Next.js route handlers, Elysia

**Applies to:** server-side TypeScript and JavaScript in these frameworks.

- Check the installed major versions in `package.json` and the lock file.
- APIs change between majors (h3/Nitro, Next.js, Elysia). Follow the
  documentation for the installed version.

## Check the repository first

| Area | What to look for |
|---|---|
| Framework | `nitro`/`nitropack`, `nuxt` (`server/` directory), `next` (`app/**/route.ts` or `pages/api/`), `elysia` |
| Validation | zod, valibot, TypeBox (`t` in Elysia), Standard Schema adapters. Use the one already present. |
| Error shape | `createError` (h3), `NextResponse.json({ ... }, { status })`, Elysia `error()` / `status()` / `.onError` |
| Data access | Prisma, Drizzle, Kysely, `pg`, `postgres`, `mssql`. See data-access.md. |
| Runtime | Node (version in `.nvmrc` / `engines`) or Bun (`bun.lock`) |

## Nitro and Nuxt server routes

- **Handlers live in `server/api/` or `server/routes/`.** File names define
  routes and methods (for example `orders/[id].get.ts`).
- **Use the h3 utilities the project already uses:**
  - `defineEventHandler`;
  - `getQuery` / `getRouterParam`;
  - `readBody`, or the validated variants (`readValidatedBody`,
    `getValidatedQuery`) with the project's schema library;
  - `createError({ statusCode, statusMessage })`.
- **Runtime config** comes from `useRuntimeConfig()`. Private keys stay out
  of the `public` section.
- Nuxt version and installed Nitro/h3 determine context and handlers; legacy
  Nuxt 2 serverMiddleware and private/public config retain their conventions.
  Use `nuxt-server.md` for Nuxt-specific work. Private values must also stay
  out of returned DTOs, SSR data payloads, client imports, and public state.

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

## Elysia (Bun)

- **Routes:** `new Elysia().get('/users/:id', handler, { params: t.Object({ id: t.Numeric() }) })`.
  Schemas validate the input and type the handler.
- **Grouping:** `group` / prefixing and plugins, following the project's
  structure.
- **Errors:** centralize them through `.onError`, or the project's error
  plugin. Return consistent status codes.

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
