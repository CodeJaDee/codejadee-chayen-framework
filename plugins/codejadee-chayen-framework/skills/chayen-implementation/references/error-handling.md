---
kind: recipe
capabilities: [CAP-05-007]
---
# Error handling

Make error handling consistent with the project's existing conventions:
- clear exception boundaries;
- one error shape for callers;
- user-facing messages without internals;
- logging once, at the boundary;
- no swallowed failures.

## Inputs

- The code paths in scope, and their current error behaviour (empty
  catches, inconsistent responses, leaked stack traces).
- The project's existing error conventions: the error response shape,
  exception types, result types, the logging library, and global handlers.
- Whether the change alters a public contract (error status codes or shape).
  If it does, it is a compatibility change.

## Procedure

1. **Find the convention.** Look at how the best-structured existing code
   handles errors:
   - a global exception handler or middleware;
   - a ProblemDetails or custom error body;
   - Result or Either types;
   - error boundaries in the UI.

   Use it. Do not introduce a new pattern unless the user asks.
2. **Inventory the problems** in scope:
   - empty `catch` blocks;
   - catch-and-rethrow that loses the stack;
   - errors logged several times;
   - internals returned to callers;
   - generic 500s for expected failures (validation, not found, conflict);
   - missing cancellation handling.
3. **Separate expected from unexpected failures.**
   - Expected domain failures map to the project's error shape, with a
     specific status or code.
   - Unexpected exceptions reach the global handler, which logs once with a
     correlation ID and returns a generic message.
4. **Fix in scope only.**
   - Replace swallowed exceptions with handling or propagation.
   - Preserve the stack when rethrowing.
   - Remove duplicate logging.
   - Never expose stack traces, SQL, or secrets to callers outside
     development.
5. **Respect cancellation and timeouts.** A cancelled request is not an
   error to log as a failure.
6. **Add tests for the main error paths:** an expected failure and its
   status or shape, and an unexpected failure producing a generic response.
7. **Note contract effects.** If status codes or error bodies change for
   existing callers, treat it as a compatibility change and get approval.

## Outputs

- Error-handling changes that follow the repository's existing pattern,
  listed per path changed.
- Tests for at least one expected and one unexpected error path.
- A note on any caller-visible contract change, with its approval status.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | `IExceptionHandler` or `UseExceptionHandler` with `ProblemDetails` (`AddProblemDetails`). `TypedResults.Problem` and `ValidationProblem`. `OperationCanceledException` from `RequestAborted` is not a server error. Use `throw;`, not `throw ex;`. |
| Node (Nitro, Elysia, Next.js, Nuxt server) | Nitro and Nuxt `createError` with `statusCode`; Elysia `onError` and `error()`; Next.js route handlers returning `NextResponse.json` with a status. Always handle rejected promises. |
| Python (FastAPI, Django, Flask) | FastAPI `HTTPException` and exception handlers; DRF exception handler; Flask `errorhandler`. Use `raise ... from e` to keep the cause. |
| Angular / React / Vue | Global HTTP interceptors, error boundaries, and `app.config.errorHandler`. These are UI concerns, and the frontend skill owns them. |
| SQL Server / PostgreSQL | Map unique and foreign key violations to conflict or validation errors, by error number (SQL Server 2627 and 2601) or SQLSTATE (PostgreSQL 23505 and 23503). |

## Verification

- No empty catch blocks remain in scope, and each rethrow preserves the
  original exception.
- Expected failures return the project's error shape with the right
  status. Unexpected ones return a generic message, and are logged once with
  correlation.
- Error-path tests pass with the project's test command.
- Caller-visible changes are listed, and were approved before merging.
