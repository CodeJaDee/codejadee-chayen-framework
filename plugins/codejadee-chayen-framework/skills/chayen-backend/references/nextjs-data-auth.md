---
kind: technology
---
# Next.js caching, identity, and protected data

## Check the repository first

Read `nextjs-server.md`. Inspect Next version, cacheComponents, existing data
cache APIs, request memoization, session/DAL helpers, and identity isolation tests.

## Cache scope and invalidation (nextjs-data-caching)

**Applies when:** Next.js server data freshness, persistent caching, invalidation, or identity isolation needs a concrete change.

**Not when:** React client query-cache behavior alone is affected; use React server-state guidance instead.

**Version notes:** Next 15 changed fetch/GET caching defaults relative to older releases. Next 16 Cache Components introduces a separate model when configured; check exact revalidateTag/updateTag/cacheLife availability and semantics rather than relying on one universal cache rule.

**Steps:**

1. Identify the stale or repeated read and its actual layer: request memoization, persistent data cache, prerender/full-route output, client router cache, or external CDN. Record version/configuration and baseline requests before changing options.
2. Define the freshness contract and cache identity from the resource plus required account/tenant scope. Never put request-specific credentials or personalized data into a globally reusable result; keep auth/request reads outside incompatible cached scopes.
3. Use explicit supported cache and invalidation choices matching the current model. Distinguish stale-while-revalidate from immediate read-after-write expectations; invalidate only after a successful authorized mutation and only the relevant key/tag/path.
4. Test initial read, repeated read, underlying update, successful/failed mutation, and cross-user/tenant requests on a production fixture. Count upstream reads and inspect responses instead of assuming dev behavior matches production; verify router refresh separately from data-cache invalidation.

**Verify:** Report PASS, FAIL, NOT_RUN, or MEASURED with production commands, request counts, and identity tests; a synthetic map cache or dev refresh does not prove Next caching semantics.

### Recipe example

For a public catalog already using explicit cached fetch, preserve its key and
freshness contract and invalidate after an authorized catalog update. For private
orders, use the existing identity-aware uncached/request-scoped data access until
a separately justified safe cache design exists. Test owner A and owner B directly.

## Server authentication and resource access (nextjs-authentication)

**Applies when:** Next.js protected reads, handlers, or Server Functions need authentication and resource/tenant authorization guidance or implementation.

**Not when:** Auditing identity-system architecture without code changes; use security review or architecture planning instead.

**Version notes:** Detect installed Auth.js/NextAuth, provider SDK, or custom session library and its actual version. Middleware/proxy and request-cookie APIs change across Next versions; do not replace the provider or trust client session state as authorization.

**Steps:**

1. Trace session establishment, cookie/token validation, expiry, and the data-access policy used by every affected entrypoint. Preserve installed provider conventions and distinguish authentication from allowed access to a specific resource.
2. Validate trusted identity at each actual server boundary and enforce owner/tenant/role policy near protected data. A layout redirect, client guard, or middleware/proxy check is insufficient for separately callable routes and Server Functions.
3. Preserve existing cookie security, CSRF/origin policy, session revocation, and redirect allowlists. Return safe denial results and minimal user DTOs; never return raw session tokens or trust browser-provided role/owner fields.
4. Test anonymous, expired/revoked session, authenticated-but-forbidden, wrong tenant, forged identifiers, and authorized access through direct endpoints/actions. Confirm denied calls cannot read/write protected records or prime shared caches, and that logs/responses expose no secrets; include regression coverage for every newly reachable operation.

**Verify:** Report PASS, FAIL, or NOT_RUN with direct server-boundary tests, commands, and denial outcomes; testing only hidden UI or one shared auth helper cannot establish authorization coverage.

## Verification commands

Use the configured production server and auth/cache integration tests with
synthetic identities. Approval for guidance does not authorize a live provider
configuration change, token rotation, or production deployment.

## Pitfalls

- Treating a globally cached user object as request-local session state.
- A valid login granting access to another user's order.
- Claiming stale data is fixed from dev-server behavior alone.
