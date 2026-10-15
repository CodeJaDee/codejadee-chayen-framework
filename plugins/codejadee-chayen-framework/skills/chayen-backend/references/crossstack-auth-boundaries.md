---
kind: technology
---
# Cross-stack authentication, CORS, and CSRF

Stack detail for authentication and browser security boundaries between a
front end and an API: sessions or tokens, challenges, cross-origin access,
and cross-site request forgery. Use it with the authentication and
authorization recipe. Respect the application's existing authentication and
authorization design; this guidance never replaces it or weakens a check.

## Check the repository first

| Area | What to look for |
|---|---|
| Scheme | Cookie sessions, a BFF (backend for frontend), OIDC with an identity provider, bearer tokens in the browser, API keys; where tokens are stored |
| Topology | Same origin, same site with different ports or subdomains, or cross-site front end and API; reverse proxy paths |
| Challenge behaviour | Login redirects versus 401/403 for API calls; the framework version's defaults |
| CORS | Allowed origins, credentials, methods, headers, exposed headers, preflight caching; per environment |
| CSRF | Antiforgery tokens, `SameSite` cookie settings, custom-header requirements, double-submit patterns, framework middleware |

## Authentication across front end and API (crossstack-authentication)

**Applies when:** a front end and an API must agree on login, session or
token handling, sign-out, expiry and refresh, 401 versus 403 behaviour, or
authorization of API calls made from a browser or mobile client.

**Not when:** server-only authentication configuration with no client
impact (backend authentication guidance), or identity provider
administration (out of scope).

**Version notes:** ASP.NET Core 10 cookie authentication returns 401/403
for known API endpoints instead of redirecting; earlier versions redirect
unless the events are overridden, and non-API endpoints still redirect.
Browsers increasingly restrict third-party cookies, which affects
cross-site cookie sessions. Check framework and client library versions.

**Steps:**

1. Map the flow end to end: how the user signs in, what the browser holds
   (an `HttpOnly` cookie, or a token in memory), what each API call sends,
   how expiry and refresh work, and how sign-out clears both sides.
2. Keep authorization on the server: every API endpoint enforces its own
   policy and resource ownership. Hidden buttons and client route guards
   are UX, not security.
3. Make challenges machine-readable for API calls: 401 for missing or
   expired credentials and 403 for authenticated but forbidden, never an
   HTML login redirect that `fetch` follows silently.
4. Prefer `HttpOnly`, `Secure`, `SameSite` cookies or a BFF for browser
   apps; do not move tokens into `localStorage` or log them. Never weaken an
   existing control to make a client work.
5. Handle 401 in the client once (refresh or redirect to sign-in) and 403
   as an authorization message; do not retry 403.
6. Test anonymous, expired, signed-in, and forbidden users through the real
   HTTP pipeline (and a browser for cookie flows).

**Verify:** report PASS, FAIL, or NOT_RUN for anonymous (401), signed-in
(200), forbidden (403), expiry or refresh, and sign-out, through the real
pipeline.

## CORS and CSRF boundaries (crossstack-cors-csrf)

**Applies when:** configuring or reviewing CORS for a browser front end,
protecting cookie-authenticated endpoints from cross-site request forgery,
or diagnosing "blocked by CORS policy" errors.

**Not when:** server-to-server calls with no browser (CORS does not apply),
or a general web security review (security skill).

**Version notes:** the ASP.NET Core documentation calls any origin plus
credentials insecure, and its policy builder throws for that combination;
.NET 8+ minimal APIs validate antiforgery
for form-bound endpoints when `UseAntiforgery` is in the pipeline.
`SameSite=Lax` is the default in Chromium-based browsers when unspecified;
"same site" ignores ports.

**Steps:**

1. Treat CORS as a read permission for browsers, not as access control:
   the server still receives and executes simple cross-origin requests
   (form-style `POST`s) from any origin. Authorization and CSRF defences
   must stand on their own.
2. Configure CORS per environment with explicit origins (scheme, host, and
   port), only the needed methods and headers, and credentials only when
   cookies are required; never reflect arbitrary origins or combine a
   wildcard with credentials.
3. Protect cookie-authenticated state changes from CSRF: antiforgery
   tokens (framework middleware), `SameSite=Lax` or `Strict` where the flow
   allows, and a required custom header or JSON content type that forces a
   preflight. Bearer tokens in headers are not sent automatically, but
   cookies are.
4. Keep `GET` and `HEAD` free of side effects so link and image requests
   cannot change state.
5. Diagnose CORS errors from the preflight and response headers (origin,
   credentials, methods), not by allowing everything.
6. Test from an allowed origin and a disallowed origin in a real browser
   (or an HTTP test that sends `Origin`), and test state-changing requests
   without a CSRF token.

**Verify:** report PASS, FAIL, or NOT_RUN for allowed and disallowed
origins (including that the server did or did not execute the request),
preflight responses, and CSRF rejection without a token.

## Commands

```bash
curl -i -X OPTIONS http://localhost:5000/api/orders -H "Origin: http://localhost:5173" -H "Access-Control-Request-Method: POST"
curl -i -X POST http://localhost:5000/api/counter -H "Origin: http://evil.localhost"   # local test server only
```

## Pitfalls

- `AllowAnyOrigin` or origin reflection with credentials.
- Believing CORS stops the request: it only stops the browser reading the
  response.
- Cookie sessions with no CSRF defence on state-changing endpoints.
- API calls that receive a 302 to an HTML login page.
