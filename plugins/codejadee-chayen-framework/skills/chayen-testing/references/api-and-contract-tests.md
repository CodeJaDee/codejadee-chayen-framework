---
kind: recipe
capabilities: [CAP-10-005, CAP-10-006]
---
# API tests and contract tests

Test HTTP APIs systematically (success, validation, authentication,
authorization, and error cases) with the project's tooling, and verify that
providers and consumers agree on API and message contracts in CI, so a
breaking change fails a build before it reaches a consumer.

## Inputs

- The API contract (OpenAPI document, route definitions, or DTOs), the
  authentication setup, and the environments tests may use.
- The consumers and providers, the contract format (Pact files, OpenAPI,
  JSON Schema, message schemas), and whether a Pact Broker or schema
  registry exists.
- The existing API test tooling and CI pipeline.

## Procedure

### API tests (CAP-10-006)

1. **Build the case matrix per endpoint:**

   | Case | Expected |
   |---|---|
   | Valid request | 2xx with a body matching the contract |
   | Invalid input | 400 or 422 with the project's error shape and field names |
   | No credentials | 401 |
   | Wrong role or another tenant's resource | 403, or 404 if the API hides existence |
   | Missing resource | 404 |
   | Conflict or duplicate | 409, where applicable |

2. **Choose the execution mode the project uses:** in-process (fast, no
   network) or against a running test environment (configured by
   environment variables, never production for writes).
3. **Set up data per test,** through fixtures, builders, or the API itself,
   and clean up. Credentials for test users come from configuration or
   secrets, never hard-coded real accounts.
4. **Assert the contract,** not just the status: required fields, types,
   and the error shape, validating against the OpenAPI schema if the
   project has a validator.
5. **Run locally and in CI,** and report counts per status.

### Contract tests (CAP-10-005)

1. **Choose the approach** with the user:
   - **consumer-driven (Pact):** consumers record the interactions they
     rely on; providers verify them;
   - **schema-based:** the provider's OpenAPI or message schema is checked
     for breaking changes, and responses are validated against it.
2. **Consumer side (Pact):** write consumer tests against the Pact mock
   server for the interactions the consumer uses, with matchers for types
   rather than exact values. The run produces the pact file.
3. **Provider side:** verify the pacts against the running provider, with
   provider states that set up data for each interaction.
4. **Schema-based:** run a breaking-change diff of the OpenAPI document
   against the main branch in CI, and validate response bodies against the
   schema in API tests. For messages, use the schema registry's
   compatibility check, or Pact message tests.
5. **Wire into CI:** consumer tests publish contracts (to the broker if one
   exists, otherwise as artifacts); provider builds verify them; a
   `can-i-deploy` style check gates deployment where a broker exists.
6. **Show a failure example:** rename or remove a field the consumer uses
   in a local branch, and record that provider verification FAILED.
   Revert the change afterwards.

## Outputs

- An API test suite using the existing tooling, with the case matrix per
  endpoint and data setup notes, plus run results.
- Consumer tests producing contracts, provider verification tests, CI
  wiring, and a recorded failure example.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | In-process API tests with `WebApplicationFactory` and a test authentication handler. PactNet for consumer and provider tests. OpenAPI from Swashbuckle or `Microsoft.AspNetCore.OpenApi` for schema checks. |
| Node servers (Nuxt, Next.js) | supertest or Playwright `request`, following the configured test harness. Pact JS (`@pact-foundation/pact`). |
| Python (FastAPI, Django, Flask) | `TestClient` or httpx, Django `APIClient`, Flask `test_client`. Pact Python, or schema validation with `schemathesis` if the project uses it. |
| Frontend consumers (Angular, React, Vue) | Consumer Pact tests at the API client layer, not through the UI. |
| Schema diffs | An OpenAPI diff tool in CI (for example `oasdiff` breaking-change mode) if approved. Keep the published document generated from code. |

## Verification

- Each endpoint in scope has a success, an unauthorised, and an
  invalid-input test, and they run PASSED, or the suite is BLOCKED or
  NOT_RUN with the reason.
- A seeded breaking field rename in the provider makes provider
  verification or the schema check FAILED, and the change was reverted.
- No test writes to a production environment, and no real credentials are
  stored in test code.
