---
kind: technology
---
# Next.js Server Functions and HTTP handlers

## Check the repository first

Read `nextjs-server.md`. Inspect the owning router, version, use server
convention, validation/auth/data helpers, request runtime, and closest tests.

## Callable server mutations (nextjs-server-functions)

**Applies when:** A supported Next.js App Router feature needs a Server Function or form action for a concrete read/write operation.

**Not when:** An existing Pages API or external HTTP client owns the operation; keep its handler contract instead.

**Version notes:** Server Actions became stable in Next.js 14. Match Next/React versions for action signatures and useActionState; use server marks a callable boundary, not an authorization guarantee.

**Steps:**

1. Locate the existing action/module style and its caller. Confirm compatible App Router support and distinguish a Server Function from an ordinary server-only helper; do not migrate a Pages feature merely to add a mutation.
2. Authenticate inside the callable operation with the existing session library, then validate input and authorize the specific resource/tenant using trusted identity. Never trust form-supplied owner ids, hidden fields, or permissions passed from the browser.
3. Execute through existing transaction/idempotency helpers as needed; return minimal serializable results and visible validation errors without internal records or credentials. Revalidate only after a successful mutation using the installed cache model; preserve redirect/error control flow.
4. Test direct invocation/request paths bypassing the UI, including missing/expired session, valid user without ownership, tampered identifiers, malformed data, and allowed owner. Assert denied requests cause no write or invalidation, and failures retain user input through the established client form flow.

**Verify:** Report PASS, FAIL, or NOT_RUN with server-boundary and production checks; a unit test of an auth helper alone does not prove every exported action calls it.

### Recipe example

For an existing change-order action: derive session identity on the server,
parse FormData with the installed validator, load the requested order through
the current data layer, and verify its owner/tenant before saving. Return only
the public success/error contract; test a forged order id without rendering a UI.

## HTTP entrypoints (nextjs-route-handlers)

**Applies when:** Next.js App Router route handlers need request validation, response contracts, or server integration behavior.

**Not when:** The feature uses Pages API routes; keep that existing handler shape and general API recipe instead.

**Version notes:** Route handlers use Web Request/Response or NextRequest/NextResponse. Check async dynamic params, runtime constraints, and version-dependent GET caching; Pages req/res APIs are different.

**Steps:**

1. Find the route's owner, exported methods, runtime, response shape, body limits, and existing server helpers. Extend its App Router pattern and avoid conflicting page/route files or an incidental router migration.
2. Authenticate and authorize protected operations at the handler/data boundary. Validate path/query/body and content type with existing tools; reject malformed or oversized input consistently and do not trust caller-supplied roles or tenant claims.
3. Return explicit status, safe headers, and minimal response DTOs. Preserve current CSRF/origin safeguards for cookie-authenticated writes and compatible CORS handling; do not add permissive CORS, unbounded retries, or a cache policy that shares personalized responses.
4. Exercise actual HTTP/direct handler entrypoints for success, 401/403 or project-equivalent denial, invalid input, unsupported method, and missing resource. Check no writes on denial, correct serialized errors, caching headers, and configured runtime support; never call a live third-party service in tests.

**Verify:** Report PASS, FAIL, or NOT_RUN with HTTP/integration/build commands; distinguish a Web Response fixture from a compiled Next production route.

```ts
// Inside an existing authorized handler; NextResponse import required.
return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
```

## Verification commands

Use configured server tests and build, then safe local HTTP against the built
server where available. Call protected entrypoints without passing through a UI.

## Pitfalls

- An exported use server function lacking its own ownership check.
- Invalidating caches before a denied or failed save.
- Leaking a database entity or exception stack in a response.
