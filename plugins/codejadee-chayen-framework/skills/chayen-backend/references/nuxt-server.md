---
kind: technology
---
# Nuxt server APIs and private configuration

## Check the repository first

Inspect resolved nuxt, Vue, server dependencies, runtime, auth, validation, and data
versions; packageManager/lockfile/CI; nuxt.config, srcDir, server handlers,
private/public runtimeConfig, and existing tests. Nuxt 2 serverMiddleware and
config conventions are distinct from Nuxt 3/4 server handlers. Do not upgrade
or infer a server dependency major from Nuxt alone. Use existing API/auth/error recipes.

## Protected server entrypoints (nuxt-server-api)

**Applies when:** A Nuxt server feature needs an HTTP endpoint, validation, authorization, or server integration change.

**Not when:** A standalone Nitro/Elysia server or frontend-only page owns the task; standalone servers are out of scope; use frontend guidance only for the frontend task.

**Version notes:** Match Nuxt 2 serverMiddleware versus Nuxt 3/4 server/api or server/routes and installed server helpers. Handler signatures, validation helpers, runtime capabilities, and generated auto-imports depend on actual versions.

**Steps:**

1. Find the closest server entrypoint and record method/file conventions, mounted path, runtime, body limits, error shape, and current data/auth helpers. Extend its existing style; do not migrate a legacy Nuxt server feature incidentally.
2. Validate route/query/body input using installed tools and authenticate/authorize protected operations at the server/data boundary. Client route middleware or hidden controls cannot grant access; reject forged resource/owner/tenant values before protected reads or writes.
3. Read privileged configuration only in server context and return minimal safe DTOs. Preserve CSRF/origin policy, response headers, and tenant-aware cache behavior; avoid forwarding arbitrary credentials or exposing exception stacks and ORM records.
4. Test direct endpoint success, unauthorized/forbidden identity, malformed input, missing resource, and method handling with synthetic identities. Assert denied operations cause no write/cache mutation; build and run a safe local production handler where available, never a live third-party integration.

**Verify:** Report PASS, FAIL, or NOT_RUN with configured server/HTTP/build commands; distinguish a synthetic Web handler from the installed Nuxt server runtime.

## Runtime privacy and overrides (nuxt-runtime-config)

**Applies when:** Nuxt configuration needs private/public classification, runtime overrides, or safe server/client access.

**Not when:** A standalone Vite app needs build-time env handling; use Vite environment safety instead.

**Version notes:** Nuxt 3/4 runtimeConfig private/public differs from Nuxt 2 privateRuntimeConfig/publicRuntimeConfig. Check declared keys and matching NUXT-prefixed runtime overrides; app.config is public build-time data, not a secret store.

**Steps:**

1. Trace each setting from its source to config, server readers, modules, and browser consumers. Inspect exact Nuxt version and deployed start/runtime behavior; classify by exposure rather than assuming an env prefix or file name makes it private.
2. Keep privileged keys outside public/app configuration and client-imported/generated modules. Use the existing server useRuntimeConfig(event) or compatible Nuxt 2 server context; pass only intentional public values to UI and API DTOs.
3. Declare supported configuration keys and match the actual runtime override scheme. Separate dotenv/build defaults from production runtime injection and static output; never spread the full runtime config into responses, state, useAsyncData payloads, logs, or public module options.
4. Build with synthetic public/private sentinels and inspect client artifacts, HTML/payload, source maps, and endpoint responses. Test runtime override and missing-secret behavior on the actual built server; fail safely without printing credential values, and mark unavailable deployment checks explicitly.

**Verify:** Report PASS, FAIL, or NOT_RUN with build/artifact/runtime checks; a hand-written public projection test cannot prove Nuxt's configuration serialization or override behavior.

```ts
// Nuxt 3/4 nuxt.config; inject the private value through supported runtime env.
runtimeConfig: {
  apiSecret: '',
  public: { apiBase: '/api' },
}
```

Never return useRuntimeConfig in its entirety from a handler. Public fields
remain public even when their source is an environment variable.

## Verification commands

Use the pinned manager's server tests, prepare/typecheck, production build,
and local HTTP checks. This advisory guide does not authorize production config
changes or secret rotation; actual access checks and build/runtime controls
provide enforcement.

## Pitfalls

- Nuxt 2 rewritten to a newer server runtime while implementing a small endpoint.
- A private key leaked through a correctly running SSR data handler.
- Unrelated env names assumed to override declared production config.
