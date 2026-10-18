---
kind: recipe
capabilities: [CAP-06-002, CAP-06-003]
---
# API endpoints and contract validation

Implement or fix server endpoints in the detected stack by mirroring an
existing endpoint. Validate requests at the boundary with the project's
validation library. Check that responses conform to the declared contract.

## Inputs

- The endpoint behaviour and contract (from the API design, an OpenAPI
  file, or the request).
- The detected stack, its technology reference, and the closest existing
  endpoint of the same shape.
- The validation library and error shape in use, and the test setup
  (unit or integration through the HTTP pipeline).

## Procedure

1. **Pick the template.** Find an existing endpoint of the same shape, such
   as a paged list, a create command, an update with concurrency, or a file
   download. Trace its route, handler or service, data access, DTOs,
   validation, and tests.
2. **Define the models.** Explicit request and response DTOs. Never bind or
   return persistence entities, because that invites over-posting and leaks
   internal fields.
3. **Implement along the template's layers.**
   - Pass the cancellation token or abort signal through to I/O.
   - Enforce a maximum page size for lists.
   - Use parameterized queries only.
4. **Validate at the boundary** with the project's library. Declare the rules
   once. Invalid input returns the project's validation error shape (usually
   400, with field errors).
5. **Map the failures:** not found to 404, conflicts and concurrency to 409,
   forbidden to 403. Unexpected exceptions go to the global handler.
6. **Check response conformance.**
   - When an OpenAPI or schema contract exists, generate the server's
     OpenAPI and compare it with the contract.
   - Or assert the response shape in integration tests.
   - Report the differences.
7. **Test:**
   - the happy path;
   - invalid input (one case per rule group);
   - not found;
   - the authorization allowed and denied paths;
   - any concurrency conflict;
   - at the level the template's tests use.
8. **Verify** with the project's build and test commands.

## Outputs

- The endpoint code, mirroring the template's structure, DTOs, validation,
  error mapping, and registration.
- Validation rules at the boundary, and response conformance results (an
  OpenAPI diff or assertions).
- Tests for the success, validation, not-found, and authorization paths,
  with build and test results.

## Technology considerations

| Stack | Validation and conformance |
|---|---|
| ASP.NET Core | FluentValidation, or DataAnnotations with `[ApiController]` automatic 400s. `TypedResults` with `Results<...>` keeps the OpenAPI accurate. Integration tests use `WebApplicationFactory`. Build-time OpenAPI generation can be diffed. |
| Nuxt server | `readValidatedBody` and `getValidatedQuery` with Zod or Valibot. Return the errors with `createError({ statusCode: 400, data })`. |
| Next.js route handlers | Zod `safeParse` on `await req.json()`, then `NextResponse.json(..., { status })`. Server Actions validate too, because they are public endpoints. |
| FastAPI | Pydantic models validate requests and responses (`response_model`), so conformance is partly built in. Shape the 422 errors only if the house style differs. |
| Django REST framework / Flask | DRF serializers with `is_valid(raise_exception=True)`. Flask uses marshmallow or pydantic, as already used by the project. |
| SQL Server / PostgreSQL | Data access follows the data access reference: EF Core, Dapper, SQLAlchemy, Prisma, or Drizzle, as the project uses. |

## Verification

- The endpoint mirrors a cited template endpoint. No persistence entity
  crosses the API boundary.
- Invalid payloads return the house validation shape. Valid ones pass. The
  tests cover each rule group.
- Response conformance was checked by an OpenAPI diff or by assertions, or
  is reported NOT_RUN.
- Build and tests pass with the project's commands, including the
  authorization allowed and denied cases.
