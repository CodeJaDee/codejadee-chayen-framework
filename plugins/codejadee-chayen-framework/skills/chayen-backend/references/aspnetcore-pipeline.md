---
kind: technology
---
# ASP.NET Core pipeline, dependency injection, and errors

Stack detail for middleware, service registration, configuration, and
error responses. Read `aspnetcore-webapi.md` first for
the version and the conventions.

## Check the repository first

| Area | What to look for |
|---|---|
| Hosting model | `WebApplication.CreateBuilder` (minimal hosting, .NET 6+) or `Startup` with `ConfigureServices` and `Configure` |
| Middleware | The `app.Use...` calls in `Program.cs` or `Startup.Configure`, custom middleware classes (`InvokeAsync`), `IMiddleware` implementations, and filters (MVC filters, endpoint filters) |
| Registration | Where services are registered: `Program.cs`, `Add<Module>()` extension methods per project or feature, assembly scanning (Scrutor), or a third-party container (Autofac) |
| Configuration | `appsettings*.json`, options classes (`IOptions<T>`), validation of options, user secrets, environment variables, a secret store provider |
| Errors | `AddProblemDetails`, `IExceptionHandler`, `UseExceptionHandler`, `UseStatusCodePages`, custom error middleware, MVC exception filters, or result types mapped to HTTP |

## Request pipeline (aspnet-request-pipeline)

**Applies when:** adding, removing, or reordering middleware, writing custom
middleware or filters, or fixing behaviour that depends on order (CORS,
authentication, HTTPS redirection, forwarded headers, caching, rate
limiting).

**Not when:** the change is inside one endpoint's logic (the endpoints topic
file), or it is reverse proxy or ingress configuration outside the app (the
devops skill).

**Version notes:** minimal hosting adds routing and endpoint middleware
implicitly and, on recent versions, authentication and authorization when
their services are registered; call them explicitly where the order matters
and the project does so. Rate limiting and output caching need .NET 7;
request timeouts need .NET 8.

**Steps:**

1. Read the current order before changing it. Order is behaviour: a
   middleware only sees requests that reach it and only handles responses
   that flow back through it.
2. Keep the commonly documented order unless the project has a recorded
   reason to differ:

   | Order | Middleware |
   |---|---|
   | 1 | `UseForwardedHeaders` (behind a proxy, with known proxies or networks configured) |
   | 2 | `UseExceptionHandler`, `UseHsts` (non-Development) |
   | 3 | `UseHttpsRedirection`, static files |
   | 4 | `UseRouting` (implicit in minimal hosting unless called) |
   | 5 | `UseCors` |
   | 6 | `UseAuthentication`, `UseAuthorization` |
   | 7 | `UseRateLimiter`, `UseOutputCache`, request timeouts, custom middleware |
   | 8 | Endpoints (`MapControllers`, `Map...`) |

3. Choose the narrowest tool: an endpoint filter or MVC filter for
   endpoint-specific behaviour, middleware for cross-cutting behaviour on
   every request. Follow what the project already uses.
4. Write custom middleware as the project does: a class with
   `InvokeAsync(HttpContext)` and `await next(context)`, or `IMiddleware`.
   Do not write to the response after calling `next` if the response has
   started (`context.Response.HasStarted`).
5. Keep middleware free of scoped state in constructors: conventional
   middleware is a singleton; take scoped services as `InvokeAsync`
   parameters.
6. Test the effect through the HTTP pipeline (`WebApplicationFactory`), not
   by unit-testing the middleware class alone, when order matters.

**Verify:** an HTTP test shows the behaviour that depends on order (for
example a CORS preflight, a 401 before the handler runs, or a problem
details body for an empty 404); report PASS, FAIL, or NOT_RUN.

## Dependency injection and options (aspnet-dependency-injection)

**Applies when:** registering services, choosing lifetimes, fixing
"cannot consume scoped service" or disposal errors, binding configuration
to options, or replacing an implementation.

**Not when:** the question is which architectural layer a service belongs
in (the architecture skill), or which secret store to use (the devops
skill).

**Version notes:** keyed services (`AddKeyedScoped`, `[FromKeyedServices]`)
need .NET 8. `ValidateOnStart()` for options needs .NET 6. The host
validates scopes and the service graph on build in the Development
environment only, by default.

**Steps:**

1. Register in the place the project uses (a module's `Add...()`
   extension, `Program.cs`, or the third-party container's module).
2. Choose the lifetime from the dependency's state: singleton for
   stateless or thread-safe shared state, scoped for per-request state
   (`DbContext` is scoped), transient for lightweight stateless helpers.
3. Never inject a scoped or transient service with request state into a
   singleton. In singletons and background services, create a scope with
   `IServiceScopeFactory.CreateAsyncScope()` per unit of work.
4. Use `IHttpClientFactory` (`AddHttpClient<TClient>()` or named clients)
   for outgoing HTTP. Do not capture a typed client in a singleton.
5. Bind settings with the options pattern:
   `AddOptions<T>().Bind(section).ValidateDataAnnotations().ValidateOnStart()`.
   `IOptions<T>` reads once, `IOptionsSnapshot<T>` per request (scoped),
   `IOptionsMonitor<T>` with change notifications.
6. Do not call `BuildServiceProvider()` while registering services; it
   creates a second container with its own singletons.
7. Keep secrets out of committed `appsettings*.json`: user secrets locally,
   the project's secret store elsewhere.

**Verify:** the app starts in the Development environment (scope
validation runs there), and an integration test resolves the changed
services through a request; report PASS, FAIL, or NOT_RUN with the command.

## Exception handling and error responses (aspnet-exception-handling)

**Applies when:** unhandled exceptions leak details or return the wrong
status, error responses are inconsistent, domain failures must map to HTTP
status codes, or logging of failures is noisy or missing.

**Not when:** the work is error handling across layers of a whole system
(the implementation skill's error handling recipe), or the response leaks
sensitive data as a security finding (the security skill).

**Version notes:** `IExceptionHandler` needs .NET 8; earlier versions use
`UseExceptionHandler` with a handler path or lambda, custom middleware, or
MVC exception filters. `AddProblemDetails` needs .NET 7. The developer
exception page is enabled automatically in the Development environment.

**Steps:**

1. Find the existing mechanism and keep one: problem details, a custom
   envelope, or result types mapped to HTTP.
2. Map known failures in one place: `IExceptionHandler` implementations
   (invoked in registration order; return `true` when handled), the
   project's middleware, or its result-to-HTTP mapping.
3. Return problem details for errors with `AddProblemDetails()`,
   `UseExceptionHandler()`, and `UseStatusCodePages()` for empty-body
   status codes, or the project's envelope.
4. Never return exception messages or stack traces outside Development.
   Add a trace identifier so support can correlate logs.
5. Treat a cancelled request (`OperationCanceledException` with the request
   token cancelled) as a client abort, not a server error.
6. Log each failure once, at the boundary, with structured fields. Avoid
   log-and-rethrow at every layer.
7. Do not use exceptions for expected outcomes if the project uses result
   types; do not introduce result types if it uses exceptions.

**Verify:** HTTP tests in a non-Development environment show the mapped
status codes, the problem details content type, and no exception message in
the body; report PASS, FAIL, or NOT_RUN with the command.

## Verification commands

```bash
dotnet build
dotnet test --filter "FullyQualifiedName~Pipeline"     # or the project's HTTP test filter
ASPNETCORE_ENVIRONMENT=Development dotnet run          # startup validates scopes; only when running the app is permitted
```

## Pitfalls

- **`UseCors` after `UseAuthorization`,** or authentication after the
  endpoints that need it: requests fail in ways that look like auth bugs.
- **Forwarded headers trusted from any source,** which lets clients spoof
  their IP address or scheme.
- **Captive dependencies:** a singleton holding a `DbContext` or another
  scoped service.
- **Exception details in production responses,** or a developer exception
  page enabled outside Development.
- **Swallowing exceptions** in middleware and returning 200.
