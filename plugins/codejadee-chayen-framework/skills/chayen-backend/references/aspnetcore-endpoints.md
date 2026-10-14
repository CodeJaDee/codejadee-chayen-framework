---
kind: technology
---
# ASP.NET Core endpoints, validation, and OpenAPI

Stack detail for endpoint work in ASP.NET Core. Read
`aspnetcore-webapi.md` first for the version and the
conventions.

## Check the repository first

| Area | What to look for |
|---|---|
| Endpoint style | Controllers: `[ApiController]`, `[Route]`, `ActionResult<T>`. Minimal APIs: `MapGet`/`MapPost`, `MapGroup`, `TypedResults`, endpoint modules (`IEndpointRouteBuilder` extension methods, Carter, FastEndpoints). |
| Closest analogue | An existing endpoint with the same shape (list, get by id, create, command). Copy its route, DTO, mapping, and result conventions. |
| Validation | DataAnnotations, `IValidatableObject`, FluentValidation (validators and how they are invoked), endpoint filters, or `AddValidation()` (.NET 10). |
| Errors | `AddProblemDetails`, a custom error envelope, or a result type mapped to HTTP |
| OpenAPI | `Microsoft.AspNetCore.OpenApi` (`AddOpenApi`), Swashbuckle (`AddSwaggerGen`), or NSwag; a committed `openapi.json`; build-time generation (`Microsoft.Extensions.ApiDescription.Server`) |
| Versioning | `Asp.Versioning.*` packages, `/v1/` route segments, or headers |

## Endpoints (aspnet-api-endpoints)

**Applies when:** adding or changing an HTTP endpoint in an ASP.NET Core
project: route, request binding, response type, status codes, pagination,
or a defect inside one endpoint.

**Not when:** the API is not ASP.NET Core, or the work is the API contract
design itself (the API design recipe), or the change spans the database,
API, and UI together (the implementation skill).

**Version notes:** `TypedResults` and `Results<T1, T2>` need .NET 7 or
later; on .NET 6 minimal APIs use `Results.Ok(...)`. `[AsParameters]` and
`MapGroup` need .NET 7.

**Steps:**

1. Use the style of the area: a controller action next to its siblings, or
   a minimal API endpoint in the same group or module. Never convert styles.
2. Bind explicit request DTOs and return response DTOs. Never bind or
   return EF entities: entities invite over-posting and leak internal
   fields.
3. Declare the result type so the contract is visible:
   `ActionResult<OrderDto>` in controllers, or
   `Results<Ok<OrderDto>, NotFound>` with `TypedResults` in minimal APIs.
4. Return the status codes the project uses for each case:

   | Situation | Status |
   |---|---|
   | Read success | 200 |
   | Creation | 201 with a `Location` (`CreatedAtAction`, `TypedResults.Created`) |
   | Success with no body | 204 |
   | Validation failure | 400 (or 422 if the project already uses it) |
   | Unauthenticated / forbidden | 401 / 403 |
   | Missing resource | 404 |
   | Conflict or concurrency failure | 409 |

5. Take a `CancellationToken` and pass it to every async call.
6. Paginate unbounded lists (`page`/`pageSize` or a cursor) with a
   server-side maximum page size and a stable `OrderBy`.
7. Add the endpoint's authorization the way its neighbours do (see the auth
   topic file). A new endpoint without it may be anonymous.
8. Test it at the level the project uses: unit tests of handlers, or HTTP
   tests through `WebApplicationFactory`.

**Verify:** `dotnet build` and the endpoint's tests pass; a request for
each status code in the table returns that code (HTTP test or local call,
or NOT_RUN with the reason).

## Request validation (aspnet-validation)

**Applies when:** an ASP.NET Core endpoint must reject invalid input, a
validator is missing or wrong, or validation responses are inconsistent.

**Not when:** the rule is a business invariant that needs data (check it in
the handler or domain and return 409 or 422 as the project does), or the
question is injection safety (the security skill).

**Version notes:** `[ApiController]` returns an automatic 400
`ValidationProblemDetails` for model-binding and DataAnnotations failures.
Minimal APIs had no built-in validation before .NET 10; on .NET 10,
`builder.Services.AddValidation()` validates DataAnnotations on minimal API
parameters and returns 400 problem details.

**Steps:**

1. Find the mechanism in use and keep to it: DataAnnotations on DTOs,
   FluentValidation validators, endpoint filters, or `AddValidation()`.
   Do not add a second validation library.
2. Controllers: rely on the automatic 400. Do not add
   `if (!ModelState.IsValid)` blocks where `[ApiController]` already does it.
3. FluentValidation: add a validator next to the existing ones, registered
   the same way (assembly scanning or explicit), and invoked the same way
   (filter, behaviour, or explicit call).
4. Minimal APIs before .NET 10: use the project's endpoint filter or the
   explicit validator call. On .NET 10, prefer `AddValidation()` only if the
   project already uses it or the user agrees.
5. Validate at the boundary: required fields, lengths, ranges, formats,
   collection sizes, and enum values. Keep business rules out of DTO
   attributes.
6. Keep one error shape: the project's `ValidationProblemDetails` or its
   envelope, with field names as the client sees them.
7. Remember nullable reference types: with nullable enabled, non-nullable
   properties are implicitly required in controller models.

**Verify:** tests for one valid payload and each invalid class (missing,
too long, out of range, malformed) assert the status and the error fields;
report PASS, FAIL, or NOT_RUN with the `dotnet test` command.

## OpenAPI documents (aspnet-openapi)

**Applies when:** an ASP.NET Core API must describe its endpoints in an
OpenAPI document, the document is wrong or incomplete, or a client is
generated from it.

**Not when:** writing human API documentation (the documentation skill), or
generating client code from a finished document (the implementation
skill's contract codegen recipe).

**Version notes:** .NET 9 added `Microsoft.AspNetCore.OpenApi` document
generation (`AddOpenApi()`, `MapOpenApi()` at `/openapi/v1.json`), and the
.NET 9 templates stopped including Swashbuckle. Older projects use
Swashbuckle or NSwag, which keep working. Do not switch generators without
approval.

**Steps:**

1. Identify the generator and where the document is served or written.
2. Describe every response the endpoint returns: `TypedResults` unions
   supply this automatically; otherwise add `[ProducesResponseType]`, or
   `.Produces<T>()`, `.ProducesProblem()`, `.ProducesValidationProblem()`.
3. Name and group operations consistently (`.WithName()`, `.WithTags()`,
   `.WithSummary()`, or controller and action names); operation IDs feed
   generated clients.
4. Keep security schemes and versions aligned with the real auth and
   versioning setup.
5. Expose interactive UI (Swagger UI, Scalar) only where the project does,
   usually Development.
6. If a document is committed or published, regenerate it and review the
   diff for breaking changes (removed paths, new required fields, changed
   types).

**Verify:** the app serves or writes the document (fetch the path, or run
the build-time generator), the changed operations appear with their
status codes, and the diff is reviewed; report PASS, FAIL, or NOT_RUN.

## Verification commands

```bash
dotnet build
dotnet test --filter "FullyQualifiedName~Orders"
curl -s http://localhost:<port>/openapi/v1.json   # only while the app runs locally, with permission
```

## Pitfalls

- **Returning `IQueryable` or lazy-loaded entities.** This causes
  serialization cycles, N+1 queries, and leaked fields.
- **Catching `Exception` and returning 200 with an error message.**
- **Duplicate validation:** manual `ModelState` checks plus the automatic
  400, or two libraries validating the same DTO.
- **Missing response metadata,** so the OpenAPI document shows only 200 and
  generated clients cannot handle errors.
- **Exposing Swagger UI in production** where the project does not.
