---
kind: technology
---
# Angular reactivity and state ownership

## Check the repository first

Read `angular.md`. Inspect Angular and RxJS versions, subscriptions, stores,
Zone.js or zoneless providers, and existing state boundaries before editing.

## Signal state (angular-signals)

**Applies when:** An Angular feature already uses signals or explicitly requests a compatible signal implementation.

**Not when:** A legacy Observable feature needs a small fix; retain its RxJS approach instead.

**Version notes:** Signals appeared in Angular 16; check individual API stability in the installed release. Do not infer availability of input, model, linkedSignal, resource, or signal forms from `signal()` alone.

**Steps:**

1. Inspect the installed Angular release and the feature's state style. Confirm the request permits signals before converting existing fields or Observable stores; preserve public component contracts.
2. Use writable signals for owned state and computed values for derivation. Keep writes at the state owner; return new arrays or objects instead of mutating the value in place.
3. Reserve effects for actual external side effects such as integration with an existing widget. Do not copy derived values through effects or build cycles that write back to their own dependencies.
4. Test initial values, immutable updates, dependency changes, and cleanup of any external resource. Check that unrelated state changes do not trigger redundant side effects and that rendered state follows the public contract.

**Verify:** Report PASS, FAIL, or NOT_RUN for signal behavior and component tests, with commands; distinguish pure computed assertions from observed rendering.

```ts
readonly count = signal(0);
readonly doubled = computed(() => this.count() * 2);
increment() { this.count.update(value => value + 1); }
```

## Observable boundaries (angular-rxjs-interop)

**Applies when:** Angular views bridge existing Observable streams and signals or need reliable subscription teardown.

**Not when:** Only fixing a plain JavaScript Promise chain; use async-control guidance instead.

**Version notes:** Check `@angular/core/rxjs-interop` exports in the installed Angular release. Older projects retain async pipe or their existing destroy-subject pattern rather than receiving unavailable APIs.

**Steps:**

1. Identify whether the source is cold HTTP, hot store state, or an event stream. Record the installed RxJS version and the established operators, error handling, and teardown convention.
2. Keep cancellable asynchronous composition in RxJS when that is the project's approach. Use switchMap for obsolete reads, concatMap for ordered work, or exhaustMap for duplicate submit suppression only when those semantics match requirements.
3. Prefer the existing async pipe for template subscriptions. Where signals are already used, create toSignal once at an owning injection context; set an initial value or requireSync only when synchronous emission is guaranteed.
4. Keep errors visible through the established state model. For manual subscriptions use supported takeUntilDestroyed or the project's teardown pattern. Test destroy, rapid updates, late errors, and a slow older response arriving after a newer one.

**Verify:** Report PASS, FAIL, or NOT_RUN with stream and teardown test commands; assert actual cancellation or stale-result exclusion, not just operator presence.

```ts
// In a supported injection context; create once, never in a getter.
readonly rows = toSignal(this.rows$, { initialValue: [] });
```

## State ownership (angular-state-management)

**Applies when:** Angular feature state needs consistent ownership, transitions, or integration with an existing store.

**Not when:** Choosing a new system-wide architecture; use architecture planning before installing a store.

**Version notes:** Check Angular, RxJS, and NgRx/NGXS or other store versions and peer dependencies. Store-specific signal APIs are separate from Angular's core signal support.

**Steps:**

1. Trace local, route, shared application, and server-derived state. Find the current service, BehaviorSubject, NgRx effects/selectors, NGXS state, or signal store that owns each value.
2. Extend that owner using existing events, reducers, selectors, or methods. Do not introduce NgRx, replace a BehaviorSubject with signals, or make temporary form state global without an explicit requirement.
3. Model pending, success, empty, and failure transitions with clear retry semantics. Keep derived values in existing selectors or computed state and preserve immutable updates where the store expects them.
4. Test transitions under concurrent requests, navigation, reset, logout where relevant, and repeated mounting. Confirm request-local SSR state cannot survive into another user's render and that older responses cannot overwrite newer state.

**Verify:** Report PASS, FAIL, or NOT_RUN for store and view tests, with commands; include state isolation and stale-result cases when those boundaries exist.

## Rendering notifications (angular-change-detection)

**Applies when:** Angular views render stale values or excessive work and change-notification behavior is implicated.

**Not when:** Investigating server latency without browser evidence; use performance measurement instead.

**Version notes:** Inspect the actual zone provider and component strategy; modern defaults differ from older projects. OnPush does not itself mean zoneless. Do not remove Zone.js or opt into zoneless as an incidental fix.

**Steps:**

1. Reproduce the stale or excessive render and identify its update source. Read OnPush or default strategy, Zone.js configuration, async pipe, signal reads, and integration callbacks.
2. Fix the smallest missing notification or reference update using the project's supported mechanism. Prefer immutable inputs, existing async bindings, or a justified markForCheck at an external boundary.
3. Avoid blanket detectChanges calls, timers used to hide races, or a global strategy switch. If a zoneless migration is requested, treat it as a separate compatibility change with third-party and test-runner checks.
4. Exercise the real user event, asynchronous completion, parent input update, and component destruction. Ensure tests do not mask missing notifications by repeatedly forcing detectChanges after every action; measure rendering cost before claiming an improvement.

**Verify:** Report PASS, FAIL, NOT_RUN, or MEASURED with reproduction and configured tests; an explicitly forced render alone does not prove automatic notification works.

## Verification commands

Use the repository's store, stream, and component tests; build the owning
app. Report browser observations separately from pure state checks.

## Pitfalls

- Calling toSignal repeatedly creates repeated subscriptions.
- Effects that copy derived state can create feedback loops.
- Removing Zone.js without checking notification and library compatibility.
