---
kind: recipe
capabilities: [CAP-06-009, CAP-19-005]
---
# External service integration

Integrate with internal or third-party HTTP services through a typed client
that follows the project's existing pattern:
- explicit timeouts;
- retries only for safe operations;
- credentials from configuration;
- errors mapped to the project's model;
- tests that never call the real provider.

Webhooks are the same integration in the other direction: verify the
signature, reject replays, acknowledge fast, and process idempotently.

## Inputs

- The provider's API documentation (cite the URL), the operations needed,
  the authentication method, and the rate limits.
- The project's existing HTTP client pattern and resilience setup.
- The expected volumes, and the business tolerance for the provider being
  slow or down.

## Procedure

1. **Detect the client pattern:**
   - a typed client registered in dependency injection;
   - a shared fetch wrapper;
   - a generated client;
   - the provider's official SDK.

   Use the same one. Do not add a second HTTP library or an SDK without
   approval.
2. **Check the contract.** List the endpoints, request and response shapes,
   error codes, pagination, rate limits, and idempotency support, from the
   provider documentation. Facts not found in the documentation are labelled
   `inferred`.
3. **Implement the client.**
   - The base URL and credentials come from configuration and the secret
     source.
   - Use an explicit timeout per call.
   - Map provider responses to internal models. Provider DTOs do not leak
     into the domain.
4. **Make it resilient.**
   - Retry only idempotent requests, or ones with the provider's
     idempotency key.
   - Use backoff with jitter, and honour `Retry-After` on 429 and 503.
   - Add a circuit breaker if the provider's failure could exhaust
     resources.
   - Align with the project's existing resilience setup.
5. **Map the errors.** Provider 4xx responses become domain errors (invalid
   request, not found). 5xx responses and timeouts become transient
   failures. Log the provider's correlation or request ID, never the
   credentials or full personal-data payloads.
6. **Secure the outbound call.** If any part of the URL comes from user
   input, apply an allow-list (an SSRF concern). Hand the review to the
   security skill.
7. **Test with fakes:** a stub HTTP handler or mock server, plus recorded
   responses. Cover success, a 4xx mapping, a timeout, and a retry with
   `Retry-After`. Tests never hit the real provider or production
   credentials.

### Webhooks (CAP-19-005)

1. **Receiving: verify before parsing.** Check the provider's signature
   (HMAC over the raw body with the shared secret, or the provider's SDK
   verifier) with a constant-time comparison, using the raw request body,
   not re-serialized JSON.
2. **Reject replays:** check the signed timestamp against a tolerance window
   and record event IDs; a seen event ID is acknowledged without being
   processed again.
3. **Acknowledge quickly:** persist the event (an inbox table) and return
   2xx, then process asynchronously with the project's job or queue
   mechanism; processing failures are retried from the inbox, not by
   failing the delivery.
4. **Sending:** sign payloads with a per-subscriber secret and a timestamp,
   include an event ID, retry with backoff on failure, and give
   subscribers a way to rotate secrets. Validate subscriber URLs against the
   SSRF guidance in the security skill.
5. **Test:** valid, tampered, replayed (old timestamp), and duplicate
   deliveries.

## Outputs

- A typed client in the project's pattern, with configuration-bound base URL
  and credentials (values redacted in all outputs), per-call timeouts, and
  retry rules.
- Error mapping and logging that carries the provider request IDs.
- Tests with fakes for the success, client-error, timeout, and retry paths.
- For webhooks: a handler with signature and timestamp checks, idempotency,
  and async processing, and tests for valid, tampered, replayed, and
  duplicate deliveries.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | `IHttpClientFactory` typed clients (`AddHttpClient<TClient>`), Refit if already used, `Microsoft.Extensions.Http.Resilience` (`AddStandardResilienceHandler`). Fakes with a custom `HttpMessageHandler` or WireMock.Net. |
| Nitro / Nuxt server | `$fetch` or `ofetch` with `timeout`, `retry`, and `retryStatusCodes`. Keys come from `runtimeConfig`. Fakes with msw or `nock`. |
| Next.js / Node | `fetch` with `AbortSignal.timeout(ms)`. Next.js caching semantics on `fetch` (set `cache` explicitly). Use axios only if the project already does. Fakes with msw. |
| Elysia / Bun | `fetch` with `AbortSignal.timeout`. Mock with `bun test` mocks, or msw. |
| Python | `httpx` (`AsyncClient` with explicit `Timeout`), or `requests` with an explicit `timeout=` (there is no default). Retries with `tenacity`. Fakes with `respx` or `responses`. |
| SQL Server / PostgreSQL | Never call external services inside a database transaction. Persist the intent, then call, or use an outbox. |

## Verification

- Every outbound call has an explicit timeout, and retries apply only to
  idempotent or key-protected operations. This is visible in code or tests.
- Credentials come from configuration and secrets, and no value appears in
  the code, logs, or summaries.
- Tests use fakes, cover the success, 4xx, timeout, and retry paths, and
  pass with the project's command.
- No new HTTP library or SDK was added without approval.
- The fixture webhook handler rejects a tampered payload and processes a
  duplicate event only once, shown by tests.
