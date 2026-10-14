---
kind: checklist
---
# Stack-specific hardening notes

Read only the section for the stack under review.

- Confirm framework versions first. Defaults change between versions.
- These notes describe common controls. They are not complete
  configurations.

## ASP.NET Core

- **Authorization.**
  - `[Authorize]` with named policies, or `RequireAuthorization()` on
    minimal API groups.
  - Consider a fallback policy so that endpoints require authentication by
    default.
  - Use `[AllowAnonymous]` deliberately and sparingly.
- **Resource ownership.** Check it in handlers or with resource-based
  authorization (`IAuthorizationService.AuthorizeAsync(user, resource, policy)`).
- **Anti-forgery.** Cookie-authenticated, state-changing requests need
  anti-forgery validation. Token-in-header APIs (bearer JWT) do not use
  cookies for authentication.
- **CORS.** Use named policies with explicit origins.
  `AllowAnyOrigin()` cannot be combined with `AllowCredentials()`. Do not
  reflect arbitrary origins.
- **HTTPS and headers.**
  - `UseHttpsRedirection`, plus `UseHsts` outside development.
  - Remove detailed errors outside development (exception handler or
    Problem Details without exception details).
- **Secrets.**
  - Local development: user-secrets.
  - Deployed environments: environment variables or a key vault.
  - Never committed `appsettings*.json`.
- **Data Protection.** Persist keys appropriately when multiple instances
  share cookies or tokens.
- **Data access.** EF Core `FromSql`/`FromSqlInterpolated` parameterize
  values. `FromSqlRaw` with concatenation does not. Dapper takes parameter
  objects.

## Angular

- **Output encoding.** Template interpolation and property binding are
  sanitized. Never pass user content to `bypassSecurityTrust*`, `innerHTML`
  via `ElementRef`, or `document.write`.
- **XSRF.**
  - Angular's `HttpClient` can send the XSRF token header for same-origin
    requests when the server sets the cookie (`withXsrfConfiguration` or the
    default `XSRF-TOKEN` cookie name).
  - The server must validate it.
- **Route guards are not security.** The API must enforce authorization.
- **Tokens.** Prefer HttpOnly cookies, or in-memory storage with short
  lifetimes, over `localStorage` for long-lived tokens. Follow the
  established architecture, and explain the trade-off.

## React and Next.js

- **Raw HTML.** No `dangerouslySetInnerHTML` with untrusted HTML. Sanitize
  if it is unavoidable.
- **Next.js server code.**
  - Route handlers and Server Actions are public endpoints. Validate input
    and authorize every one of them.
  - Only `NEXT_PUBLIC_*` variables reach the browser. Never put secrets in
    them.
- **Links.** Validate URLs used in `href`/`src` from user data. Block
  `javascript:` URLs.

## Vue and Nuxt

- **Raw HTML.** No `v-html` with untrusted content.
- **Nuxt runtime config.** Secrets stay in private `runtimeConfig`, never in
  `runtimeConfig.public`.
- **Server routes** validate input and check authorization, just like any
  API.

## Vite (any framework)

- `import.meta.env.VITE_*` values are embedded in the client bundle. Treat
  them as public.

## Node servers (Nitro, Elysia, Express-style)

- Validate params, query, body, and headers with a schema at the boundary.
- Use `child_process.execFile`/`spawn` with argument arrays, never
  `exec` with interpolated input.
- Set body size limits. Rate-limit authentication endpoints. Do not leak
  stack traces in error responses.

## Python (FastAPI, Django, Flask)

- **Django:**
  - keep `CsrfViewMiddleware` enabled;
  - `DEBUG = False` in production;
  - set `ALLOWED_HOSTS`;
  - use the ORM, or parameterized `cursor.execute(sql, params)`.
- **FastAPI:** response models prevent leaking internal fields. Use
  dependency-based authentication on every protected router.
- **Dangerous APIs:**
  - use `yaml.safe_load`, not `yaml.load`;
  - no `pickle` on untrusted data;
  - `subprocess` without `shell=True` for input-derived commands;
  - no `eval`/`exec` on input.
- **Secrets** come from environment variables or a secret manager.
  `.env` files are not committed.

## SQL Server and PostgreSQL

- The application account uses least privilege: no `sysadmin`/`db_owner`
  or superuser.
- Dynamic SQL in stored procedures uses `sp_executesql` with parameters
  (SQL Server) or `format()` with `%I`/`%L` (PostgreSQL).
- Database connections are encrypted where the platform supports it.
  Certificates are validated in production.

## Dependency audit commands

```bash
dotnet list package --vulnerable --include-transitive
npm audit --omit=dev        # pnpm audit / yarn npm audit for other managers
pip-audit                   # if installed
```

Recommend enforcing controls where they are missing:

- dependency scanning in CI;
- secret scanning with push protection;
- code scanning (SAST);
- branch protection with required reviews.
