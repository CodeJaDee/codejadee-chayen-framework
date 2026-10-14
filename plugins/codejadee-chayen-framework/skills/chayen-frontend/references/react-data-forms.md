---
kind: technology
---
# React server state and forms

## Check the repository first

Read `react-nextjs.md`. Inspect query and form library versions, cache keys,
existing providers, server contracts, validation libraries, and configured tests.

## Remote state ownership (react-server-state)

**Applies when:** React views load or mutate remote data and need consistent caching, pending, error, or refresh behavior.

**Not when:** Configuring Next.js persistent server caches; use Next.js server caching guidance instead.

**Version notes:** TanStack Query major versions, SWR, and RTK Query have distinct invalidation and status APIs. Check installed versions; do not copy one library's options into another or assume React provides a server-state cache.

**Steps:**

1. Find the established query hook, provider, key convention, fetcher, and error mapping. Reuse installed TanStack Query, SWR, RTK Query, or the project's own layer; do not add a query library without a concrete requirement.
2. Include all request-defining values in cache identity, respecting account and tenant boundaries. Keep transient form state separate from remote data; clear or isolate caches when identity changes through the established session flow.
3. Implement pending, empty, failure, retry, cancellation, and mutation invalidation using the library's supported APIs. Bound retries and optimistic updates to safe operations, with rollback and visible failure; do not copy query results into redundant global state.
4. Test changed keys, a slower old response, mutation success/failure, refetch, unmount, and account changes. For server rendering use request-local client instances and safe dehydration DTOs; never share personalized state across users or serialize server secrets.

**Verify:** Report PASS, FAIL, or NOT_RUN with query and UI tests; include cache invalidation and identity isolation, not only a successful mocked request.

### Recipe example

For an existing query library, extend its orders key with the active filter,
use its current query hook, and invalidate that key after a confirmed save.
Keep the existing provider; test a failed save and a filter switch during load.

## User input and submission (react-form-handling)

**Applies when:** React forms need validation, field behavior, submission status, or integration with existing controls.

**Not when:** Only implementing a server mutation entrypoint; use server-functions or handler guidance instead.

**Version notes:** Check React and React Hook Form/Formik/schema versions. React 19 useActionState and form actions are version-specific choices, not automatic replacements for existing form libraries or controlled inputs.

**Steps:**

1. Inspect the nearest form's library, validation timing, defaults, custom controls, and submit contract. Retain the project's strategy and schema tooling; avoid mixing new action-state APIs into a working older form unintentionally.
2. Model field defaults and controlled/uncontrolled ownership explicitly. Validate cross-field and asynchronous rules using existing helpers; preserve absent, empty, and null values according to the server contract rather than silently changing payloads.
3. Connect labels, error descriptions, pending/disabled state, and focus after failure. Prevent duplicate submissions appropriately and display field/server errors; the server must independently authenticate, authorize, and validate submitted data.
4. Test invalid and valid submission, pending, server rejection, reset, duplicate clicks, and custom controls through user interactions. Keep user input after failure and reset only after the intended successful operation; avoid testing exclusively through internal state updates.

**Verify:** Report PASS, FAIL, or NOT_RUN with configured form tests and build; confirm payloads, visible error associations, and server failure behavior.

```tsx
<label htmlFor="email">Email</label>
<input id="email" name="email" value={email}
       onChange={event => setEmail(event.target.value)}
       aria-invalid={Boolean(error)} aria-describedby="email-error" />
<p id="email-error">{error}</p>
```

This fragment belongs inside the existing form and submission flow. Existing
library controls keep their current registration and validation conventions.

## Verification commands

Use configured query/form tests, typecheck, and build with the detected manager.
No dependency or state/form-library replacement is implied by this guidance.

## Pitfalls

- Identity-insensitive query keys leaking another account's data.
- Resetting user input before a failed save is resolved.
- Treating client field validation as server authorization.
