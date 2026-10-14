---
kind: recipe
capabilities: [CAP-08-003, CAP-08-007]
---
# Offline-first and mobile performance

Make an app usable without a connection (local storage, caching, a sync
queue with an agreed conflict policy, and a clear offline status), and make
web-technology mobile apps start, scroll, and run fast on the target
devices. Both are governed by storage, network, and startup budgets, and
both are judged by measurements on the device class that matters. Read
[app-shells.md](app-shells.md) for the shell's commands.

## Inputs

- For offline: the data that must be readable offline, the actions that
  must work offline, the sync rules, the conflict policy, the data
  sensitivity, and how long the app may stay offline.
- For performance: the device class (for example, a three-year-old
  mid-range Android phone), the symptom (cold start, list scrolling,
  memory, battery), existing measurements, and the app build.
- The existing service worker, storage library (IndexedDB wrapper, SQLite
  plugin), and server endpoints for sync.

## Procedure

### Offline-first (CAP-08-003)

1. **Agree the offline scope** with the user: which screens and data are
   read offline, which actions queue, and which are disabled offline. Write
   it as a table before coding.
2. **Choose storage that fits the data:** IndexedDB through the project's
   wrapper (Dexie, idb, localForage) for structured data in a PWA or web
   view, a SQLite plugin for large relational data in Capacitor if already
   used, and the Cache Storage API for HTTP responses. Not `localStorage` or
   Capacitor Preferences for large or structured data. Sensitive data is
   stored only if the user agrees, encrypted where the platform allows,
   and cleared on sign-out.
3. **Cache the app shell and reads:** precache the built assets, use
   network-first with a cache fallback for data that must be fresh, and
   stale-while-revalidate for data that may be briefly stale. Never let a
   shared cache serve one user's authenticated data to another. Clear
   caches on sign-out.
4. **Queue writes in an outbox.** Each queued change gets a
   client-generated ID (a UUID) sent as an idempotency key, so a retried
   sync never creates duplicates. The server must accept the key; that is
   a server change to plan with the backend.
5. **Sync on clear triggers:** the `online` event, app resume, a manual
   "Sync now", and Background Sync where supported (Chromium only).
   `navigator.onLine === true` does not prove connectivity, so treat a
   failed request as the offline signal. Sync in order, with bounded
   backoff, and stop on authentication failure.
6. **Apply the conflict policy** chosen with the user and record it:
   last write wins, with a version or ETag check so the loss is visible;
   server wins, with the local change shown as rejected; or a field-level
   merge or manual resolution for important records. Never discard a
   user's change silently.
7. **Show the status:** an offline banner, a pending-change count,
   per-item states (pending, synced, failed with retry), and the time of
   the last successful sync.
8. **Handle storage limits:** check `navigator.storage.estimate()`, request
   `navigator.storage.persist()` where appropriate, and handle quota
   errors. Browsers can evict web storage (Safari more readily for sites not
   added to the Home Screen), so unsynced data should not wait longer than
   necessary.
9. **Test:** with the network disabled (Playwright `context.setOffline(true)`
   or a mocked network), a change is saved locally and shown as pending;
   after reconnecting, it syncs once, and a replayed sync creates no
   duplicate.

### Mobile performance (CAP-08-007)

1. **Measure on a representative device,** not a desktop browser: cold
   start to first useful screen (a stopwatch, an Android Studio or Xcode
   startup trace, or timestamps logged from native start to first render),
   scrolling frame rate, and memory. Inspect the web view with Chrome
   DevTools (`chrome://inspect`) for Android and Safari Web Inspector for
   iOS. Record the device, OS, and build type (release, not debug).
2. **Find the dominant cost:**
   - **Startup:** the JavaScript parsed before first render (initial
     bundle size), synchronous storage reads or plugin calls at boot,
     waiting for the network before rendering cached data, and the splash
     screen hidden late or on a fixed timer.
   - **Lists:** rendering every item, heavy item components, large
     unscaled images, layout reads during scroll.
   - **Memory and battery:** unbounded caches, polling, location watches,
     timers left running in the background, and large images decoded at
     full size.
3. **Rank improvements** by measured cost, citing the measurement for
   each: lazy-loaded routes and deferred modules, rendering cached data
   first and refreshing after, hiding the splash screen on first render
   (`SplashScreen.hide()` with `launchAutoHide` off), virtual scrolling with
   the framework's library, fixed-size item templates, resized thumbnails,
   and pausing work in the background (the lifecycle part of the hybrid
   mobile recipe).
4. **Ask before** adding a library, changing the rendering strategy, or
   removing features from startup.
5. **Re-measure** each applied change on the same device and build type,
   and report before and after numbers.

## Outputs

- An offline scope table, storage and caching design, the outbox and sync
  triggers, and the conflict policy, implemented with the existing service
  worker or plugin.
- Offline status UI, and tests for offline save and reconnect sync without
  duplicates.
- A ranked performance improvement list, each with its measurement method,
  and before and after measurements, or NOT_RUN with the reason.

## Technology considerations

| Stack | Consideration |
|---|---|
| Angular | `@angular/service-worker` with `ngsw-config.json` `dataGroups` (`freshness` or `performance` strategies), and `SwUpdate` for versions. CDK virtual scroll (`cdk-virtual-scroll-viewport`) for long lists, with `track` in `@for`. |
| React | `vite-plugin-pwa` (Workbox) or Serwist in Next.js. TanStack Query offline persistence and paused mutations if already used. List virtualization with the library in the project (for example TanStack Virtual or react-window). |
| Vue and Nuxt | `vite-plugin-pwa` or `@vite-pwa/nuxt`. Pinia state persisted to IndexedDB through a plugin if present. `vue-virtual-scroller` or the UI library's virtual list. |
| Capacitor and Ionic | `@capacitor/network` for status changes, a SQLite plugin for large offline data, and `@capacitor/splash-screen`. Ionic versions 6 and later removed `ion-virtual-scroll`, so use the framework's virtual scroll. Measure release builds on Android and iOS separately. |
| Server stacks | Sync endpoints accept idempotency keys and return versions or ETags for conflict detection. This is backend work to plan with the server owners. |

## Verification

- With the network disabled in a test, a change is saved locally and shown
  as pending; after reconnecting it syncs exactly once, with no duplicate
  on a replayed sync.
- The conflict policy is written down and covered by a test of a
  conflicting update.
- Performance recommendations cite a measurement (bundle size, a startup
  trace, a frame-rate recording), not generic tips. Before and after
  numbers name the device, OS, and build type, or are NOT_RUN with the
  reason.
- Behaviour not exercised on a device is labelled "not verified on
  device".
