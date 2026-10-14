---
kind: recipe
capabilities: [CAP-06-001, CAP-06-004]
---
# API design and versioning

Design an HTTP API contract before implementing it, consistent with the
project's existing APIs. Cover resources, routes, methods, status codes, the
error model, pagination, filtering, and idempotency. When a change cannot be
made compatibly, introduce or evolve an API version under a stated policy.

## Inputs

- The use cases, resources, and consumers (web app, mobile, partners).
- The existing API conventions, taken from the code or the published
  OpenAPI: route style, casing, error body, paging style, authentication,
  versioning scheme.
- For versioning: the change that requires it, the current consumers, and
  the support or deprecation policy, if one exists.

## Procedure

1. **Extract the house style** from two or three existing endpoints:
   - route naming (plural nouns, nesting depth);
   - JSON casing;
   - error shape (ProblemDetails or custom);
   - pagination (offset or cursor, parameter names, response envelope);
   - filtering and sorting parameters;
   - date and money formats.

   The new design follows it. Note any deviation, with its reason.
2. **Model the resources and operations.**
   - Map the use cases to resources and methods: GET reads, POST creates,
     PUT and PATCH update, DELETE removes. Use action sub-resources only
     where the house style does.
   - Mark which operations must be idempotent, or need an idempotency key
     (POST for payments or orders).
3. **Define each operation:**
   - route;
   - request model;
   - response model;
   - status codes (success, 400 validation, 401, 403, 404, 409 conflict,
     422 if the house style uses it);
   - error cases;
   - authorization requirement;
   - paging limits.
4. **Write the contract sketch** as an endpoint table plus an OpenAPI
   fragment, or in the project's contract format.
5. **Versioning, when a change is breaking.**
   1. Detect the existing scheme: URL segment (`/v1/`), header,
      media-type, or query parameter. Use it.
   2. If there is none, propose one for approval.
   3. The new version gets its own routes and contract.
   4. The old version keeps working unchanged.
   5. Announce deprecation with `Deprecation` and `Sunset` headers and the
      documentation, with an end date agreed by the owner.
6. **Label the design proposed,** and confirm it before implementing (API
   endpoints recipe). A changed public contract needs approval.

## Outputs

- An endpoint table (method, route, request, response, status codes,
  authorization, idempotency) and an OpenAPI sketch, in the house style.
- Design notes on pagination, filtering, error cases, and idempotency, with
  any deviations from the house style justified.
- For versioning: the scheme (existing or proposed), routing per version,
  the deprecation timeline and headers, and the consumer communication
  notes.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | `Asp.Versioning.Http` or `Asp.Versioning.Mvc` (`ApiVersion`, `MapToApiVersion`, `ReportApiVersions`). OpenAPI via `Microsoft.AspNetCore.OpenApi` or Swashbuckle, with one document per version. Minimal APIs use `MapGroup("/v{version:apiVersion}")`. |
| Node (Nitro, Elysia, Next.js, Nuxt server) | The file-based routing of Nitro, Nuxt, and Next.js puts versions in the folder structure (`server/api/v1/`). Elysia uses `group('/v1')` and generates OpenAPI from schemas through its swagger plugin. |
| Python (FastAPI, Django, Flask) | FastAPI `APIRouter(prefix="/v1")` with an OpenAPI per app or mount. DRF `URLPathVersioning` or `NamespaceVersioning`. Flask blueprints per version. |
| GraphQL (any stack) | Schema evolution is additive with `@deprecated`, not URL versioning. That is a separate capability. |
| SQL Server / PostgreSQL | API shapes must not mirror tables. Versioned APIs may need a mapping layer over one schema. |

## Verification

- The design reuses the house error shape, casing, and paging. Deviations
  are listed with their reasons.
- Every operation has its status codes, error cases, and an authorization
  requirement. Idempotency is marked where retries are possible.
- For versioning: the old-version tests still pass, both versions appear in
  the OpenAPI output, and the deprecation dates have an owner.
- The design is labelled proposed until confirmed. No breaking change is
  implemented without approval.
