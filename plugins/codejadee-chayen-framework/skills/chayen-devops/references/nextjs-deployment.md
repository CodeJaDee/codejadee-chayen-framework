---
kind: technology
---
# Next.js build and deployment validation

## Check the repository first

Inspect resolved next/react/react-dom, runtime/engines, packageManager and
lockfile, CI scripts, next.config, output mode, hosting adapter, auth/cache
requirements, and configured test/build tools. Do not assume Vercel hosting.

## Production artifact checks (nextjs-deployment-testing)

**Applies when:** A Next.js production artifact, hosting mode, or deployment test plan needs a concrete validation or repair.

**Not when:** Implementing a page/component alone; use frontend guidance and its build checks instead.

**Version notes:** Runtime minimums, build defaults, adapters, standalone output, static export limits, and test/lint integration vary by Next release. Next 16 no longer supplies next lint; inspect configured scripts and cacheComponents/Edge compatibility before selecting commands.

**Steps:**

1. Record the installed versions and existing CI/install/build/start flow, deployment target, and output mode. Preserve the project's manager and runners; distinguish static export, standalone Node server, platform adapter, and Edge requirements.
2. Build the actual artifact with configured scripts and run typecheck/lint/tests separately when configured. Check whether the target supports needed Server Functions, handlers, SSR, image handling, and cache persistence; do not convert a dynamic app to static export to avoid a failing server check.
3. Run a safe local or isolated preview of the built artifact. Exercise direct routes, static assets, health checks, errors, protected endpoints, server/client boundaries, metadata, and hydration with existing tooling. Inspect public artifacts and serialized responses using synthetic secret sentinels without printing real credentials.
4. Test runtime env versus build-inlined public configuration, multi-instance cache consistency where applicable, and the existing rollback procedure. Record unavailable platform/browser tests explicitly; preparing a build or preview is not permission to deploy, publish, or change production secrets/configuration.

**Verify:** Report PASS, FAIL, or NOT_RUN with exact build/start/HTTP/browser commands and artifact evidence; successful dev-server requests do not establish deployment behavior.

### Recipe example

For an existing standalone server output, keep its configured build, assemble
the required public and static assets per the current pipeline, then start the
packaged server on loopback and request a nested route and protected handler.
For static export, verify that required dynamic server features are absent or
already served elsewhere rather than silently dropping them.

## Commands and verification

Run the pinned manager's existing scripts. Use next build/next start only when
they are the configured artifact lifecycle; adapters or static exports use
their current serving commands. No deployment is performed without authorization.

## Pitfalls

- Build-time public variables mistaken for runtime secret configuration.
- Assuming dev hot reload and production cache behavior are identical.
- Publishing a preview or changing a hosting provider while only asked to test.
