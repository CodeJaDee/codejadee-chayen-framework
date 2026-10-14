---
kind: recipe
capabilities: [CAP-07-010]
---
# Frontend error handling

Handle errors in the browser consistently: map HTTP and network failures
to user-facing states, contain rendering errors with boundaries, offer
retry where it is safe, and report client errors without leaking server
details or personal data.

## Inputs

- The failure modes to handle: API errors by status, network loss,
  timeouts, rendering exceptions, chunk-load failures after a deployment.
- The existing error UI: error pages, toasts, inline messages, empty-state
  components.
- The API's error format (for example ProblemDetails with a `traceId`, or
  a custom envelope), and any client error reporting tool already
  installed (Sentry, Application Insights, Datadog RUM).

## Procedure

1. **Inventory the current handling:** interceptors or fetch wrappers,
   error boundaries, global handlers, error routes, and the places that
   swallow errors (`catch` without action, empty `.catch(() => {})`). List
   them with `path:line`.
2. **Define one mapping** from failure to user experience, and apply it in
   one place (the interceptor or the API client), not in every component:

   | Failure | User experience |
   |---|---|
   | 400 or 422 with field errors | Field messages through the form (see the UI features recipe) |
   | 401 | The app's re-authentication flow, then return to the intended route |
   | 403 | A permission-denied state, not a generic error, and no retry |
   | 404 | A not-found state for the resource or the route |
   | 409 | A conflict message, with reload or merge options |
   | 429 | A "try again shortly" message, honouring `Retry-After` |
   | 5xx, network failure, timeout | The error state with Retry, keeping the data already shown |

3. **Retry only what is safe.** Automatic retries with bounded backoff are
   allowed for idempotent reads. Submits are retried only on user action,
   or automatically only when the server accepts an idempotency key.
4. **Contain rendering errors.** Wrap routes or independent sections in an
   error boundary so one broken widget does not blank the page. Show a
   fallback with a way to recover (retry, go back, reload).
5. **Handle chunk-load errors** after a deployment (a lazy route file no
   longer exists): offer a reload, at most once per session, and never in
   the middle of unsaved input.
6. **Write user-facing messages** in plain language, localized, with no
   stack traces, SQL, exception types, or raw server messages. Show a
   correlation or trace ID if the API returns one, so support can find the
   log entry.
7. **Report client errors** through the existing tool only. Scrub tokens,
   personal data, and form values from reports. Do not add a reporting tool
   or vendor without approval.
8. **Stop swallowing errors.** Every `catch` either handles the error
   visibly, rethrows it, or logs it with context.
9. **Test** each mapping with mocked responses: 500 renders the error state
   without server text, 403 renders permission denied, a thrown render
   error shows the boundary fallback, and Retry issues the request again.

## Outputs

- Error handling code (an interceptor or client wrapper, error boundaries,
  error pages, a global handler) following the existing patterns.
- The failure-to-experience mapping, as implemented.
- Tests for the failure states, and a list of swallowed errors fixed or
  reported.

## Technology considerations

| Stack | Consideration |
|---|---|
| Angular | Functional `HttpInterceptorFn` with `catchError` (or class interceptors in older apps), a custom `ErrorHandler` for uncaught errors, and router error handling for failed lazy loads. Do not show raw `HttpErrorResponse.message`. Test with `HttpTestingController`. |
| React (Vite) | Error boundaries need a class component, or `react-error-boundary` if installed. Boundaries do not catch errors in event handlers or async code: handle those in the data layer (TanStack Query `error`, `throwOnError`). |
| Next.js | App Router `error.tsx` (a client component with `reset`), `global-error.tsx`, `not-found.tsx` and `notFound()`. Server-side errors are masked in production with a `digest`, so log on the server. Pages Router uses `_error` and custom 404 and 500 pages. |
| Vue | `app.config.errorHandler` for uncaught errors, `onErrorCaptured` for boundaries, and a fetch or axios interceptor for HTTP mapping. |
| Nuxt | `error.vue` for full-page errors, `createError` and `showError`, `clearError({ redirect })`, and `<NuxtErrorBoundary>` for sections. `useFetch` returns `error` for inline handling. |
| Mobile and desktop shells | A Capacitor or Electron app has no browser reload button, so error states must offer their own recovery. Electron main-process errors are handled in the main process, not by renderer boundaries. |

## Verification

- A mocked 500 response renders the error state and does not display
  server internals, shown by a test.
- A mocked 403 renders the permission-denied state without Retry, and a
  thrown rendering error shows the boundary fallback.
- No new error reporting vendor was added without approval, and reports
  are scrubbed of tokens and personal data (code citation).
- Build and tests pass, reported PASS, FAIL, or NOT_RUN with the command.
