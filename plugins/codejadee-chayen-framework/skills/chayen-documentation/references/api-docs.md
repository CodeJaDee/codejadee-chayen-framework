---
kind: recipe
capabilities: [CAP-16-002]
---
# API documentation

Produce API reference and usage documentation from the real contract:
descriptions, examples, error codes, authentication, and versioning notes
that match the implementation. The source of truth is the generated or
maintained OpenAPI document and the code, never memory.

## Inputs

- The API contract: a generated OpenAPI document, the OpenAPI generation
  setup, or route definitions and DTOs.
- Authentication and authorization setup, the error response format, and
  the versioning scheme.
- The audience (internal developers, partners, public) and where docs are
  published.

## Procedure

1. **Get the contract from the code:** generate the OpenAPI document with
   the project's tooling, or read routes and DTOs. Note any endpoint the
   document misses.
2. **Add descriptions where they belong:** in code annotations or XML
   comments that feed the generator, so docs stay in sync, rather than in a
   separate hand-written file.
3. **Document each operation:** purpose, parameters with constraints,
   request and response examples that validate against the schema, status
   codes including errors, and required permissions.
4. **Write the cross-cutting sections:** authentication (how to get and send
   a token), the error format with examples, pagination, rate limits if
   any, and versioning and deprecation policy.
5. **Check consistency:** every documented endpoint, parameter, and status
   code exists in the generated document; examples match the schemas; and
   behaviour claims trace to code or tests.
6. **Mark unverified** examples or behaviour, and list them.

## Outputs

- API documentation or an annotated OpenAPI document with examples
  consistent with the implementation.
- A list of discrepancies between the docs and the code, and of unverified
  items.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | `Microsoft.AspNetCore.OpenApi` or Swashbuckle, XML documentation comments (`GenerateDocumentationFile`), `[ProducesResponseType]` for status codes, and the document generated at build or runtime. |
| Node servers (Nitro, Nuxt, Next.js, Elysia) | Elysia's OpenAPI plugin from schemas, Nitro OpenAPI support where enabled, zod-to-OpenAPI generators, or a maintained spec file. |
| Python (FastAPI, Django, Flask) | FastAPI's generated `/openapi.json` with `response_model` and `responses`, drf-spectacular for Django REST Framework, apispec for Flask. |
| Docs publishing | Swagger UI, Redoc, or Scalar from the same document; partner docs generated from it. |

## Verification

- Documented endpoints, parameters, and status codes match the fixture's
  generated OpenAPI document.
- Examples validate against the schemas, or the mismatch is listed.
- The generation command ran in this session, or is NOT_RUN with the
  reason.
