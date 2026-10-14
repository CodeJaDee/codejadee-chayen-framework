---
kind: technology
---
# ASP.NET Core authentication and authorization

Stack detail for the authn and authz recipe in ASP.NET Core. Read
`aspnetcore-webapi.md` first for the version and the
conventions. Any change to authentication or authorization needs the user's
approval before it is applied.

## Check the repository first

| Area | What to look for |
|---|---|
| Schemes | `AddAuthentication(...)` with `AddJwtBearer`, `AddCookie`, `AddOpenIdConnect`, `AddMicrosoftIdentityWebApi` (Microsoft.Identity.Web), ASP.NET Core Identity, `MapIdentityApi`, or a custom `AuthenticationHandler` (API keys) |
| Defaults | `DefaultScheme`, `DefaultAuthenticateScheme`, `DefaultChallengeScheme`; one registered scheme or several |
| Token settings | `Authority`, `Audience`, `TokenValidationParameters`, `RequireHttpsMetadata`, claim mapping (`MapInboundClaims`), all from configuration |
| Authorization | Policies (`AddAuthorization`, `AddAuthorizationBuilder`), requirements and handlers, `[Authorize]` and `[AllowAnonymous]`, `RequireAuthorization()` on groups, a `FallbackPolicy` |
| Ownership | How handlers check that the caller owns or may see a resource: tenant filters, user ID filters, resource-based handlers |
| Tests | A test authentication handler registered in `ConfigureTestServices`, test tokens, or `dotnet user-jwts` |

## Authentication (aspnet-authentication)

**Applies when:** configuring or fixing how an ASP.NET Core API identifies
callers: bearer tokens, cookies, OpenID Connect, Identity, or API keys, and
token validation, claim mapping, or 401 responses.

**Not when:** choosing an identity provider or designing the identity
architecture (the architecture skill), or reviewing the setup for
vulnerabilities (the security skill).

**Version notes:** `MapIdentityApi` needs .NET 8, and `dotnet user-jwts`
needs .NET 7. On recent versions a single registered scheme becomes the
default; with several schemes, or with `AddAuthentication()` and no scheme,
set the defaults explicitly. A protected endpoint with no default scheme
fails with a server error, not a 401.

**Steps:**

1. Identify the existing scheme and identity provider. Do not add a second
   scheme or replace a library without approval.
2. Read all settings from configuration (`Authority`, `Audience`, issuer,
   metadata address). Never hard-code signing keys or client secrets.
3. Keep token validation on: issuer, audience, lifetime, and signing key
   validation stay enabled; `RequireHttpsMetadata` stays true outside
   Development.
4. Check claim types: inbound claim mapping can rename `sub` or `role`.
   Read claims the way the existing code does.
5. Cookie-authenticated endpoints that change state need antiforgery
   protection and `Secure`, `HttpOnly`, and `SameSite` cookies; bearer-token
   APIs do not use antiforgery.
6. Make sure `UseAuthentication` runs before `UseAuthorization` and the
   endpoints (see the pipeline topic file).
7. In tests, replace the real scheme with a test authentication handler in
   `ConfigureTestServices`; never call the real identity provider.

**Verify:** HTTP tests show 401 for a missing or invalid credential and
success for a valid one, and startup reads settings from configuration;
report PASS, FAIL, or NOT_RUN with the command.

## Authorization (aspnet-authorization)

**Applies when:** protecting ASP.NET Core endpoints with roles, claims,
scopes, policies, or ownership checks, or fixing a 403 or an endpoint that
is unexpectedly open.

**Not when:** designing the permission model across systems (the
architecture skill), or auditing access for vulnerabilities such as broken
object-level authorization across the API (the security skill).

**Version notes:** `AddAuthorizationBuilder()` needs .NET 7; earlier
versions use `AddAuthorization(options => ...)`. `RequireAuthorization()` on
route groups needs .NET 7 (`MapGroup`).

**Steps:**

1. Find how the project protects endpoints: a `FallbackPolicy` that requires
   authenticated users, attributes per controller or action, or
   `RequireAuthorization()` on groups. New endpoints follow the same rule.
2. Express rules as named policies (`RequireClaim`, `RequireRole`,
   `RequireAssertion`, or a requirement with an `AuthorizationHandler`) and
   reuse existing policies before adding new ones.
3. For "may this user act on this record", use resource-based checks
   (`IAuthorizationService.AuthorizeAsync(User, resource, policy)`) or
   query filters by owner or tenant. A role check alone does not stop one
   user reading another user's record.
4. Return 401 for unauthenticated and 403 for authenticated but not
   allowed; return 404 instead of 403 where the project hides existence.
5. Mark anonymous endpoints explicitly with `[AllowAnonymous]` or
   `AllowAnonymous()`, and only when the user asked for it.
6. Test three paths for every protected endpoint: anonymous (401), signed
   in without permission (403), and allowed (2xx); add another user's
   record for ownership checks.

**Verify:** the three-path HTTP tests pass, and a search for the new
endpoints shows the policy applied; report PASS, FAIL, or NOT_RUN with the
command.

## Verification commands

```bash
dotnet test --filter "FullyQualifiedName~Authorization"
dotnet user-jwts create --role admin       # local test token, .NET 7+, only if the project uses user-jwts
```

## Pitfalls

- **Missing authorization on new endpoints** when the project relies on
  per-endpoint attributes rather than a fallback policy.
- **Disabling token validation** (`ValidateAudience = false`,
  `ValidateLifetime = false`) to make a test or a local call pass.
- **Role checks without ownership checks,** which leaves object-level access
  open.
- **Testing only the allowed path.**
- **Logging tokens or full claims principals.**
