---
kind: technology
---
# Vue router and state ownership

## Check the repository first

Read `vue-nuxt.md`. Inspect plain Vue versus Nuxt, Vue Router version/mode,
route files, stores, SSR instance creation, and configured component/browser tests.

## Plain Vue navigation (vue-router)

**Applies when:** A plain Vue application using installed Vue Router needs routes, guards, URL state, or navigation changes.

**Not when:** Editing Nuxt file-based routes; use Nuxt routing guidance instead.

**Version notes:** Vue Router 3 commonly serves Vue 2; Router 4 targets Vue 3. Match router/history and guard signatures rather than importing current APIs into an older feature.

**Steps:**

1. Find the owning router, version, base/history mode, nested views, guards, and nearest route. Preserve existing router and lazy-loading conventions; do not add a second router or assume Nuxt generates these routes.
2. Define parameter/query behavior and stable route names using current helpers. Reuse navigation primitives, encode user input, and preserve redirects, missing-route outcomes, and component reuse on parameter changes.
3. Integrate loading/failure and focus handling with existing route boundaries. Keep client guards as user experience controls; authorize protected data operations on the server regardless of whether a route is hidden.
4. Test direct entry, nesting, changed params, rejected guards, back/forward, and unknown routes with configured tools. Distinguish memory-router tests from actual host history fallback, and create request-local router instances for SSR where the project uses it.

**Verify:** Report PASS, FAIL, or NOT_RUN with router/browser/build commands; do not infer deployed deep-link behavior from in-memory route assertions.

## Store and request scope (vue-state-management)

**Applies when:** Vue or Nuxt state needs ownership, transitions, store subscriptions, or safe server/client integration.

**Not when:** Choosing a new application architecture without edits; use architecture planning before introducing a store.

**Version notes:** Detect Pinia, Vuex, local/composable state, and their installed versions. Nuxt useState is a framework-specific SSR-aware choice; Pinia helpers and Vuex APIs are not interchangeable.

**Steps:**

1. Trace local, route, shared, and server-derived state to the current owner. Extend installed Pinia/Vuex/useState or existing composables without swapping libraries or installing Pinia for one local field.
2. Preserve store actions/getters and supported reactive access. Use storeToRefs for applicable Pinia state/getters where the project does, keeping actions bound; avoid duplicating remote query values into a second global store.
3. Model pending, success, empty, failure, reset, and identity-change transitions. Keep request-local SSR store instances and serialize only safe public state; never cache user-specific store objects globally or transfer private runtime config.
4. Test concurrent reads, rejected writes, reset/navigation, subscription disposal, and two separate SSR/users where relevant. Check older responses cannot overwrite current state and that client hydration sees the intended safe initial values.

**Verify:** Report PASS, FAIL, or NOT_RUN with store/component/SSR checks and commands; a single-instance unit test does not establish request isolation.

### Recipe example

Extend the existing orders action and getter, preserving its Pinia or Vuex
contract. Test loading, failed save, and account reset. If only a local disclosure
is needed, keep a local ref rather than adding an application store.

## Verification commands

Run the owning store/router tests and production build. Keep installed manager,
router, and state libraries; no implicit framework or store migration.

## Pitfalls

- Destructuring a store's values into nonreactive snapshots.
- Client guards mistaken for backend authorization.
- A server singleton store reused for unrelated users.
