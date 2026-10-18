---
kind: technology
---
# Nuxt rendering and deployment validation

## Check the repository first

Inspect Nuxt/Vue and server dependencies and runtime versions, builder/preset, package manager,
CI scripts, nuxt.config ssr/routeRules, source roots, output target, and existing
browser/server tests. Do not infer Vite or Node hosting from Nuxt alone.

## Render modes and production artifacts (nuxt-rendering-deployment)

**Applies when:** Nuxt rendering mode, SSR/client boundaries, route rules, or production artifacts need validation or repair.

**Not when:** A plain Vue component or isolated Nuxt page edit is sufficient; use frontend guidance and its ordinary checks instead.

**Version notes:** Nuxt 2 versus Nuxt 3/4 output, deployment presets, routeRules, runtime config, and static generation differ. Node/serverless/Edge support depends on installed runtime and adapter; generation cannot supply an absent privileged server endpoint.

**Steps:**

1. Record the current SSR/SPA/static/hybrid mode, per-route rules, data requirements, preset, and configured build/start/test commands. Preserve the current builder and package manager; do not globally disable SSR to hide a browser-library defect.
2. Keep initial server/client markup deterministic and protect browser-only integrations through supported mounted/client/plugin boundaries. Confirm private configuration and personalized state cannot enter static public output or shared route caches.
3. Build the actual artifact and start/serve it using its configured lifecycle. Test direct routes, assets, error/status behavior, server APIs, public config and private sentinels, and hydration in the real browser; verify required server capabilities exist in the chosen output.
4. Exercise runtime overrides and request/user isolation, along with current rollback/hosting checks when applicable. Document unavailable platform/browser tests and output assumptions; preparing a local artifact never authorizes deployment, publication, provider changes, or production-secret edits.

**Verify:** Report PASS, FAIL, or NOT_RUN with production build/start/HTTP/browser commands; dev hot reload or a static HTML fixture does not prove deployed SSR/hydration behavior.

### Recipe example

For an existing Nuxt Node output, retain the current build/preset, start its
generated server locally, and request a nested page plus protected API. For
static generation, verify dynamic endpoints are already hosted elsewhere and
that output contains no private settings; do not silently drop server features.

## Commands and verification

Use configured Nuxt scripts, serving commands, and adapter tests. ClientOnly
or client plugins address specific browser integrations; keep meaningful SSR
content and confirm hydration instead of replacing the whole application mode.

## Pitfalls

- SSR disabled globally for one window-access error.
- A static output expected to enforce dynamic server authorization.
- Edge deployment assumed compatible with a Node-only module.
