---
kind: recipe
capabilities: [CAP-06-001, CAP-06-004, CAP-19-001]
---
# API design and versioning

Design an HTTP API contract before implementing it, consistent with the
project's existing APIs. Cover resources, routes, methods, status codes, the
error model, pagination, filtering, and idempotency. When a change cannot be
made compatibly, introduce or evolve an API version under a stated policy.
GraphQL schemas evolve additively instead, with deprecations and schema
checks against the operations clients actually send.

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

### GraphQL schema evolution (CAP-19-001)

1. **Inspect the GraphQL stack:** the server library and version, whether
   the schema is code-first or schema-first, federation, and whether client
   operations are known (persisted queries, a registry, or client
   repositories). Do not assume a schema registry exists.
2. **Prefer additive changes:** new fields and types, nullable additions,
   and new arguments with defaults.
3. **Rename or remove in steps:** add the new field, mark the old one
   `@deprecated(reason: "Use newField")`, migrate clients, measure field
   usage where possible, and remove only after the agreed criteria and
   approval.
4. **Respect nullability rules:** making an output field nullable or an
   input field non-nullable breaks clients; flag these as breaking.
5. **Check the schema against known operations** with the stack's schema
   diff or check tool, and report breaking changes; consider the federation
   impact on the gateway and other subgraphs.

## Outputs

- An endpoint table (method, route, request, response, status codes,
  authorization, idempotency) and an OpenAPI sketch, in the house style.
- Design notes on pagination, filtering, error cases, and idempotency, with
  any deviations from the house style justified.
- For versioning: the scheme (existing or proposed), routing per version,
  the deprecation timeline and headers, and the consumer communication
  notes.
- For GraphQL: an additive change plan with `@deprecated` usage and removal
  criteria, and breaking-change check results against known operations.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | `Asp.Versioning.Http` or `Asp.Versioning.Mvc` (`ApiVersion`, `MapToApiVersion`, `ReportApiVersions`). OpenAPI via `Microsoft.AspNetCore.OpenApi` or Swashbuckle, with one document per version. Minimal APIs use `MapGroup("/v{version:apiVersion}")`. |
| Node (Next.js, Nuxt server) | Preserve Nuxt or Next.js file-based routing and the existing versioned route layout and OpenAPI source. |
| Python (FastAPI, Django, Flask) | FastAPI `APIRouter(prefix="/v1")` with an OpenAPI per app or mount. DRF `URLPathVersioning` or `NamespaceVersioning`. Flask blueprints per version. |
| GraphQL (any stack) | Schema evolution is additive with `@deprecated`, not URL versioning. Hot Chocolate (.NET), Apollo Server or GraphQL Yoga (Node), Strawberry or Graphene (Python); schema diff with GraphQL Inspector or the registry's checks if used. |
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
- A field rename in the fixture GraphQL schema is done as add, deprecate,
  migrate, and the schema check reports no breaking change for existing
  operations.
