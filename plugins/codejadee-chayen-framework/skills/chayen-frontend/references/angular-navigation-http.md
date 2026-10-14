---
kind: technology
---
# Angular routes and HTTP boundaries

## Check the repository first

Read `angular.md`. Find route configuration, bootstrap, HTTP providers,
interceptor style, API services, authentication boundary, and runner versions.

## Navigation contracts (angular-routing)

**Applies when:** Angular route configuration, lazy loading, guards, resolvers, or navigation behavior needs implementation or repair.

**Not when:** Implementing server authorization alone; use backend security guidance instead.

**Version notes:** Check support before using loadComponent, functional guards, or router input binding. Keep existing RouterModule and class-guard patterns where they are the project convention.

**Steps:**

1. Map the affected route's parent, outlet, ordering, parameters, query state, guard, and resolver. Preserve standalone or lazy NgModule loading conventions and avoid unrelated route-file restructuring.
2. Place specific paths before a catch-all and scope redirects correctly. Reuse existing navigation helpers; encode route parameters and preserve expected back-button and deep-link behavior.
3. Implement loading and failure handling for lazy routes and resolvers. Treat guards as user experience controls; the server must enforce authorization regardless of whether navigation is blocked.
4. Test direct entry, in-app navigation, parameter changes without recreation, redirects, missing resources, rejected access, and back/forward. Use the existing router harness or browser runner and confirm the deployed host handles deep links.

**Verify:** Report PASS, FAIL, or NOT_RUN with router and browser test commands; label host fallback behavior NOT_RUN when no deployment fixture was exercised.

```ts
// Compatible standalone route in a feature already using this style.
{ path: 'orders/:id', loadComponent: () => import('./order-page').then(m => m.OrderPage) }
```

## Client requests (angular-http-client)

**Applies when:** Angular HttpClient services, interceptors, request cancellation, or response handling needs a concrete change.

**Not when:** Defining a server-only API endpoint; use backend API guidance instead.

**Version notes:** Match provideHttpClient and functional interceptors or HttpClientModule and class interceptors. Check testing-provider availability; with functional providers register provideHttpClient before provideHttpClientTesting.

**Steps:**

1. Find the configured HTTP client, interceptors, error mapping, and nearest API service. Preserve provider order and interceptor style; never add a second client configuration that bypasses the existing chain.
2. Use typed response contracts for compilation while recognizing that HttpClient generic types do not validate JSON at runtime. Decode untrusted responses with existing validators or narrow from unknown at a justified boundary.
3. Compose cancellation and retries through the established Observable flow. Retry only appropriate transient failures with bounded attempts; do not blindly replay payments or other writes. Map errors to visible UI state without swallowing them.
4. Add success, malformed response, network/server error, cancellation, and interceptor tests through HttpTestingController or the project's mock. Keep server credentials out of client config, bundles, URLs, source maps, and transfer state; send privileged work to the server.

**Verify:** Report PASS, FAIL, or NOT_RUN for configured HTTP tests and build; inspect generated client artifacts using names or synthetic sentinels, never printing real secret values.

```ts
// Functional-provider projects with matching installed APIs:
providers: [provideHttpClient(), provideHttpClientTesting()]
// HttpClientModule projects retain HttpClientTestingModule instead.
```

## Verification commands

Run configured route and HTTP tests and the owning build. Check both error
and success behavior; a successful request mock alone misses provider issues.

## Pitfalls

- Treating client guards as authorization.
- Assuming `get<Dto>()` validates a response.
- Shipping a server API key through environment replacements.
