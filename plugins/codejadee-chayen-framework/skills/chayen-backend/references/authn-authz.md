---
kind: recipe
capabilities: [CAP-06-005]
---
# Authentication and authorization implementation

Implement authentication and authorization in application code with the
project's existing identity setup and framework features:
- token or session validation;
- policies or roles;
- resource-based checks;
- deny-by-default.

Every change here is a risky action that needs the user's approval before it
is applied.

## Inputs

- The identity provider and token or session type (OIDC or JWT bearer,
  cookies, API keys), and how the project currently authenticates.
- The roles, scopes, policies, and resource ownership rules to enforce.
- The protected endpoints, and their current authorization state.
- The configuration sources for authority, audience, and secrets, which
  never come from code.

## Procedure

1. **Detect the existing setup:**
   - the authentication handlers registered;
   - the middleware order;
   - the policy definitions;
   - the user and claims model;
   - any global "require authenticated" fallback.

   Extend it. Never add a second, parallel mechanism.
2. **Get approval.** State the planned change, the endpoints affected, and
   the client impact (for example, new 401s for previously open routes).
   Ask before applying.
3. **Authentication.**
   - Validate the issuer, audience, lifetime, and signing keys, with keys
     from the provider's metadata.
   - Configure the clock skew deliberately.
   - Never disable validation flags to "make it work".
   - Use framework handlers. Never write custom crypto or token parsing.
4. **Authorization.**
   - Use deny-by-default: a fallback policy that requires authentication,
     with explicit anonymous exceptions.
   - Use named policies for roles and scopes.
   - Use resource-based checks for ownership ("only the order's owner or an
     admin") in the handler or service. Route attributes cannot see the
     resource.
   - Return 404 instead of 403 where revealing existence is a risk, if the
     house style does that.
5. **Cross-cutting concerns:**
   - Tenant context is validated against the identity.
   - Anti-forgery or CSRF protection applies to cookie-authenticated state
     changes.
   - CORS stays as narrow as the clients need.
6. **Test each protected path:**
   - unauthenticated (401);
   - authenticated but not allowed (403 or 404);
   - allowed (200);
   - another user's resource (denied).

   Use the framework's test authentication helpers, not real tokens.

## Outputs

- Authentication and authorization code that extends the existing setup,
  with deny-by-default and named policies, plus resource checks where
  ownership matters.
- A summary of the configuration keys, with the values never shown (a
  reference to the secret store instead).
- Tests for the 401, 403 or 404, and 200 paths, and cross-user access, plus
  a note on client impact and its approval.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | `AddAuthentication().AddJwtBearer` or Microsoft Identity Web. `AddAuthorization` with `FallbackPolicy` and named policies. `IAuthorizationService.AuthorizeAsync(user, resource, requirement)` for resource checks. `UseAuthentication` must come before `UseAuthorization`. Test with a test auth handler in `WebApplicationFactory`. |
| Nuxt server | Session or JWT verification in server middleware or a `defineEventHandler` wrapper (for example `nuxt-auth-utils` or `jose`). Authorization checks in each handler. Client route guards are not security. |
| Next.js | Auth.js or the provider's SDK. Check the session in route handlers and server actions. Middleware alone is not sufficient authorization. |
| FastAPI / Django / Flask | FastAPI `Depends` with security schemes, and `Security` scopes. DRF authentication and permission classes, with object-level `has_object_permission`. Flask-Login or the provider's library, as used by the project. |
| SQL Server / PostgreSQL | Row-level security can back up application checks. It does not replace them. |

## Verification

- Approval for the authentication or authorization change is recorded
  before the change was applied.
- Tests show 401 without credentials, denial for other users' resources,
  and success for the allowed user. They pass with the project's test
  command.
- No token validation flag was disabled, no secret is in code or
  configuration files, and no second authentication mechanism was added.
- Client-visible changes (newly protected routes) are listed.
