---
kind: technology
---
# Cross-stack API contracts and error responses

Stack detail for keeping a backend API and its front-end or service
consumers in agreement: the OpenAPI document, its generated clients, and
the error format. Use it with the API design and implementation recipes.
The backend's actual responses are the truth; a document that differs from
them is a defect to fix, not a contract to trust.

## Check the repository first

| Area | What to look for |
|---|---|
| Contract source | Code-first generation (`Microsoft.AspNetCore.OpenApi`, Swashbuckle, NSwag, FastAPI, NestJS Swagger) or a design-first file (`openapi.yaml`) that the server implements |
| Committed artifacts | A checked-in contract file, generated client folders, and the generator command and version |
| Consumers | Angular, React, Vue, or Nuxt clients; mobile apps; other services; who regenerates their clients and when |
| CI | Contract diff or breaking-change checks (`oasdiff`, `openapi-diff`), client regeneration and type-check steps |
| Error format | Problem details (`application/problem+json`, RFC 9457), a custom envelope, validation error shape, and how the front end reads it |

## OpenAPI contract synchronization (openapi-contract-sync)

**Applies when:** an API change must stay in sync with its OpenAPI document
and consumers, the served document drifts from the committed one, or a CI
check for contract changes is needed.

**Not when:** generating or updating client code from a contract
(typed client generation guidance in the implementation skill), or the API
is GraphQL or gRPC (their own schema tooling).

**Version notes:** ASP.NET Core 9 introduced built-in
`Microsoft.AspNetCore.OpenApi` documents; .NET 10 emits OpenAPI 3.1, where
numbers can be typed as `["integer","string"]` because the web JSON defaults
accept numbers from strings. Swashbuckle and NSwag differ in nullability,
enum, and `required` output. Check the generator version before comparing
documents.

**Steps:**

1. Find the contract source and the committed artifact. If the server
   generates the document, the served document from the built application
   is what consumers see; if the contract is design-first, the server must
   be tested against it.
2. Make the change in the owning place (DTOs and endpoint metadata, or the
   design-first file), keeping names, types, nullability, `required`,
   formats (`date-time`, `int64`, `decimal`), and status codes deliberate.
3. Regenerate the document from the built application (build-time
   generation or a test that fetches `/openapi/v1.json`) and diff it
   semantically against the committed contract; serializer settings such as
   naming policies change the contract without any DTO change.
4. Classify differences: additive (new optional field, new endpoint) versus
   breaking (removed or renamed field, new required input, type or format
   change, status code change). Breaking changes need versioning or a
   coordinated consumer release; ask before shipping one.
5. Commit the updated contract with the code, and regenerate or type-check
   every consumer in the same change or a linked one.
6. Add or keep a CI check that fails when the served document and the
   committed contract differ.

**Verify:** report PASS, FAIL, or NOT_RUN for the served-versus-committed
contract comparison, the breaking-change classification, and each
consumer's regeneration and type-check.

## Error contract (crossstack-error-contract)

**Applies when:** defining, changing, or consuming API error responses
across backend and front end: validation errors, not found, conflicts,
authentication and authorization failures, and unhandled errors.

**Not when:** only server-side exception handling internals change with no
response change (backend exception handling guidance), or the error is a
UI rendering concern only (frontend error handling).

**Version notes:** ASP.NET Core 7+ `AddProblemDetails`; .NET 8+
`IExceptionHandler`; .NET 10 minimal API validation (`AddValidation`)
returns problem details. RFC 9457 obsoletes RFC 7807 with the same media
type. FastAPI, NestJS, and Spring use different default shapes.

**Steps:**

1. Inventory the current error shapes per status code, including framework
   defaults (validation, 404 with empty bodies, 401/403 challenges, 500).
2. Choose one documented shape, typically problem details with `type`,
   `title`, `status`, `detail`, `instance`, a correlation `traceId`, and an
   `errors` map for validation, and document it in the contract.
3. Make every path return it: validation, not found (status code pages or
   explicit results), conflicts, authorization failures from APIs, and
   unhandled exceptions. Never include exception messages, stack traces,
   SQL, or internal identifiers outside Development.
4. Keep the media type in mind: `application/problem+json` is not
   `application/json`, so front-end clients and interceptors must accept
   both when parsing errors.
5. Map field names consistently: validation keys follow the serializer's
   naming (PascalCase from some validators, camelCase from others); make the
   front end use the same keys to place messages on fields.
6. Test each status code end to end: body shape, media type, no internal
   detail, and the front end showing the right message.

**Verify:** report PASS, FAIL, or NOT_RUN for each error path's status,
media type, shape, and absence of internal detail, plus the consumer test.

```json
{ "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1", "title": "One or more validation errors occurred.", "status": 400, "errors": { "Number": ["The Number field is required."] }, "traceId": "00-..." }
```

## Commands

```bash
curl -s http://localhost:5000/openapi/v1.json -o served.json   # from a locally running build, never production by default
npx oasdiff breaking contract/openapi.v1.json served.json       # only when the project already uses oasdiff
```

## Pitfalls

- Hand-edited generated clients that hide contract drift.
- A serializer setting change (naming, enum strings, number handling) that
  silently changes the contract.
- Error parsing that only accepts `application/json`.
- Exception messages or SQL in production error bodies.
