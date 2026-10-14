---
kind: checklist
---
# UI states checklist

Every view that loads data, submits data, or depends on an authorization or
device permission has more states than the happy path. Decide each state
below, implement the ones that apply, and test them. Reuse the project's
existing skeleton, empty-state, error, and banner components.

## State matrix

| State | Trigger | Required behaviour | Accessibility |
|---|---|---|---|
| Loading (first) | Request in flight, no data yet | A skeleton or spinner in the region that is loading, not the whole page. Delay the spinner (about 300 ms) or keep a minimum duration only if the project already does, to avoid flashing. | `aria-busy="true"` on the region. Do not move focus. |
| Loading (refresh) | Request in flight, data already shown | Keep the old data visible with a subtle indicator. Do not blank the view. | A polite status message only if the refresh was user-initiated |
| Empty | Success with zero items | A distinct message, never a blank area. First use ("No orders yet") differs from a filtered result ("No orders match these filters"), and the second offers "Clear filters". | The message is in the normal reading order |
| Error | Network failure, 5xx, timeout, or unparseable response | A plain-language message, a Retry action, and no server internals (stack traces, SQL, exception text). Keep any previously loaded data. | `role="alert"` for errors caused by a user action. Otherwise a visible message that is reachable in reading order. |
| Retry | The user presses Retry, or an automatic retry runs | Manual retry re-runs the same request and shows the loading state. Automatic retry only for safe, idempotent reads, with bounded backoff. Never auto-retry a non-idempotent submit unless the server accepts an idempotency key. | Retry is a real button, reachable by keyboard |
| Permission denied (authorization) | HTTP 403, or the user lacks a role | Say the user cannot access this, and who can grant access if the product defines it. This is not an error with a Retry button. Hide or disable actions the user cannot perform, but rely on the server to enforce. | The disabled reason is available as text, not only colour or a tooltip |
| Unauthenticated | HTTP 401, or an expired session | Follow the app's re-authentication flow, and return to the intended route afterwards. Preserve unsaved input where the app can. | Focus moves to the sign-in form |
| Permission denied (device) | Camera, location, notifications, or files denied | Explain what does not work and offer a fallback (manual entry, pick a file). If the permission is blocked permanently, explain how to enable it in settings. Never re-prompt in a loop. | The explanation and the fallback are keyboard reachable |
| Not found | HTTP 404, or an unknown deep-link target | A not-found view with a way back. Do not crash the route. | The page title says "Not found" |
| Offline | A request fails without a response, or the platform reports no network | A banner stating that the app is offline, which features still work, and how many changes are pending, where writes are queued | `role="status"` for the banner |
| Submitting | A form or action in flight | Disable the submit control, show progress, and prevent double submission | The button keeps its label. Add `aria-busy` or a status message. |
| Success | A submit or action completed | Confirm visibly, and move focus or navigate as the existing flows do | A polite status message, or a focus move to the result |
| Partial or stale | Some sections failed, or data is cached | Show what loaded, mark the failed part with its own retry, and label cached data with its age where it matters | Each failed section is announced once |

## Decisions to record

- **Which states apply** to this view, and which do not (for example, no
  empty state for a single-record page).
- **Where each state renders:** the whole page, a section, or inline in a
  form.
- **Retry policy:** manual only, or automatic for reads, with the number of
  attempts and the backoff.
- **What is preserved** across errors and re-authentication: previous data,
  form input, scroll position.

## Tests per state

Drive each state with the project's network mocking (MSW,
`HttpTestingController`, a mocked fetch, Playwright route interception):

| Mocked response | Expected assertion |
|---|---|
| 200 with items | The items render, and no loading indicator remains |
| 200 with an empty list | The empty message renders, and differs from the error message |
| 500, or a network error | The error message and Retry render, with no server text. Retry issues the request again. |
| 403 | The permission-denied view renders, with no Retry button |
| 401 | The re-authentication flow starts |
| A delayed response | The loading state renders, then the data |
| Submit pending | The submit control is disabled, and a second click sends no second request |

States that were only reviewed in code and not executed in a test or a
browser are reported as "not verified in browser".
