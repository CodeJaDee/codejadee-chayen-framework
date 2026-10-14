---
kind: technology
---
# ASP.NET Core Web API

**Applies to:** ASP.NET Core on .NET 6 and later.

- Check `<TargetFramework>` before using any version-specific API.
- If the project targets an older framework, use only APIs available there.

## Check the repository first

| Area | What to look for |
|---|---|
| API style | Controllers (`[ApiController]` + `ControllerBase`) or minimal APIs (`MapGet` / `MapGroup`, `TypedResults`). Follow the style in use. |
| Mediators and patterns | MediatR, CQRS, vertical slices, or plain services. Use them only if they are already present. |
| Validation | DataAnnotations, FluentValidation, or endpoint filters |
| Errors | Problem Details (`AddProblemDetails`, `IExceptionHandler`, `UseExceptionHandler`) or a custom middleware / error envelope |
| Mapping | Manual mapping, AutoMapper, or Mapster |
| Authentication | `[Authorize]` and policies, the minimal API `RequireAuthorization()`, any fallback policy |
| OpenAPI | `Microsoft.AspNetCore.OpenApi` (`AddOpenApi`/`MapOpenApi`), Swashbuckle, or NSwag |

## Guidance

### Endpoints

- **Request and response DTOs.** Never bind or return EF entities. Entities
  invite over-posting and leak internal fields.
- **Controllers:** `ActionResult<T>`.
- **Minimal APIs:** `TypedResults` with `Results<Ok<T>, NotFound, ...>`,
  which keeps OpenAPI metadata accurate.
- **Status codes:**

  | Situation | Status |
  |---|---|
  | Read success | 200 |
  | Creation | 201 with a location |
  | Success with no body | 204 |
  | Validation failure | 400 |
  | Unauthenticated | 401 |
  | Forbidden | 403 |
  | Missing resource | 404 |
  | Conflict or concurrency | 409 |
  | Unexpected | 500, never with exception details in production |

- **Pass `CancellationToken`** from the action or handler through to every
  async I/O call.
- **Lists:** paginate (`page`/`pageSize`, or a cursor) with a maximum page
  size enforced on the server.

### Validation

- **`[ApiController]`** returns a 400 `ValidationProblemDetails`
  automatically for DataAnnotations failures. Do not duplicate it manually.
- **FluentValidation:** if the project uses it, add a validator next to the
  existing ones, and follow how they are registered and invoked.
- **Minimal APIs:** validate with the project's existing mechanism (endpoint
  filter or library). Recent .NET versions offer built-in minimal API
  validation. Use it only if the project's target framework and setup
  already support it.

### Errors and logging

- Map known domain failures to specific status codes in one place,
  following the project's handler or middleware.
- **Use `ILogger<T>` with message templates**, for example
  `logger.LogWarning("Order {OrderId} not found", id)`, not string
  interpolation.
  - Never log secrets, tokens, or full request bodies that carry personal
    data.

### Dependency injection and configuration

- **Lifetimes.** `DbContext` is scoped. Never inject scoped services into
  singletons.
- **Typed settings** use the options pattern (`IOptions<T>`).
- **Secrets** come from user-secrets locally and from a secret store in
  deployed environments, never from committed `appsettings*.json`.

### Async

- Use `async`/`await` end to end.
- No `.Result` or `.Wait()`.
- No `async void` except event handlers.

## Verification commands

```bash
dotnet build
dotnet test                                  # or: dotnet test --filter "FullyQualifiedName~Orders"
dotnet format --verify-no-changes            # only if the repository uses dotnet format
```

For HTTP-level tests, see whether the project uses
`WebApplicationFactory<Program>` (`Microsoft.AspNetCore.Mvc.Testing`).
Reuse its fixture.

## Pitfalls

- **Returning `IQueryable` or lazy-loaded entities from endpoints.** This
  causes serialization cycles and N+1 queries.
- **Catching `Exception` and returning 200 with an error message.**
- **Changing route templates or DTO property names** on a published API
  without versioning or approval.
- **`DateTime` with an unknown kind.** Prefer `DateTimeOffset` or UTC,
  following the project's convention.
- **Missing authorization on new endpoints** when the project relies on
  per-endpoint attributes rather than a fallback policy.
