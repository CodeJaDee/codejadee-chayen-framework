---
kind: recipe
capabilities: [CAP-08-001, CAP-08-002, CAP-08-006]
---
# Hybrid mobile features, navigation, and lifecycle

Build features in a web-technology mobile app (Capacitor or Ionic with
Angular, React, or Vue, or a PWA) with the app's existing plugins, route
deep and universal links (including cold and warm starts), and handle the
app lifecycle so that state, timers, and connections survive backgrounding.
Read [app-shells.md](app-shells.md) for the shell's detection signals and
commands.

## Inputs

- The feature, the target platforms (Android, iOS, installed PWA, browser),
  and their minimum OS versions.
- The shell setup: Capacitor configuration, installed `@capacitor/*` and
  community plugins, Ionic packages, or the PWA manifest and service worker.
- For links: the link formats to support, the router in use, the domains,
  and the platform association files.
- For lifecycle: the problem (lost input, stale data, a timer or socket
  running in the background) and the plugins in use.

## Procedure

### Feature in a mobile shell (CAP-08-001)

1. **Find an existing native-backed feature** (camera, share, geolocation)
   and mirror its service, hook, or composable wrapper. Components call the
   wrapper, never plugins directly.
2. **Check the plugin.** Use an installed plugin if it covers the need. A
   new plugin must match the installed Capacitor major and the target
   platforms. Ask before adding it.
3. **Give every native call a fallback** for web and unsupported platforms
   (`Capacitor.isNativePlatform()`, `Capacitor.isPluginAvailable()`):
   manual entry instead of scanning, a file input instead of the camera.
4. **Respect platform conventions:** safe-area insets, the Android back
   button, keyboard overlap (the Keyboard plugin's resize mode), and
   Ionic's platform mode.
5. **For a PWA install prompt,** listen for `beforeinstallprompt`
   (Chromium only), show the app's own button after a meaningful action,
   and show "Add to Home Screen" instructions on iOS and iPadOS. Hide the
   prompt when `display-mode: standalone` matches.
6. **Sync and build:** `npm run build`, then `npx cap sync`. List the native
   files changed (Gradle, `AndroidManifest.xml`, `Info.plist`,
   entitlements), and run `npx cap run android` or `ios` where the SDK is
   available. Otherwise mark it NOT_RUN with the reason.

### Navigation and deep links (CAP-08-002)

1. **Write the link table** first: each external URL pattern, its in-app
   route, required parameters, whether sign-in is needed, and the fallback.
2. **Prefer HTTPS links** (Android App Links, iOS Universal Links) over
   custom URL schemes, which any app can claim. Keep a custom scheme only
   if the app already uses one.
3. **Association files** (ask before publishing, because they change
   production web behaviour):
   - Android: an intent filter with `android:autoVerify="true"` for the
     host and paths, and `/.well-known/assetlinks.json` with the package
     name and the SHA-256 fingerprints of every signing certificate,
     including Play App Signing.
   - iOS: the Associated Domains entitlement `applinks:<host>`, and
     `/.well-known/apple-app-site-association` served over HTTPS as JSON,
     without redirects.
4. **Handle both start types:** a warm start through the App plugin's
   `appUrlOpen` listener, and a cold start, where the listener may register
   after the event, by also checking `App.getLaunchUrl()` once at startup.
   Parse the URL, validate the parameters, then navigate with the app's
   router (inside `NgZone.run` in zone-based Angular).
5. **Gate and fall back.** Store the target route when sign-in is needed
   and continue to it after sign-in. Unknown or malformed links go to a
   safe screen (home or not found), never a crash or a blank view.
6. **Back button:** on Android, back navigates the in-app history, closes
   overlays first, and exits only from the root. Use Ionic's handling or
   `App.addListener('backButton', ...)` as the app does.
7. **Test** the table: unit-test the URL-to-route parser for every format
   and an unknown link, then run device commands where available:
   `adb shell am start -W -a android.intent.action.VIEW -d "<url>" <package>`
   and `xcrun simctl openurl booted "<url>"`.

### App lifecycle (CAP-08-006)

1. **List the transitions** that matter: start, pause (background), resume
   (foreground), the OS ending the process while in the background, and,
   for a PWA, `visibilitychange`, `pagehide`, and `pageshow` (the
   back-forward cache).
2. **Subscribe in one place,** such as an app-level service or a root
   provider: `App.addListener('appStateChange' | 'pause' | 'resume')` in
   Capacitor, `document.visibilitychange` on the web. Do not rely on
   `beforeunload` or `unload` on mobile.
3. **Persist in-progress input** as it changes (debounced) or at the latest
   on pause, to the storage the app uses (IndexedDB, Capacitor Preferences
   for small values), and restore it on start. Android may end the process
   while it is in the background. Capacitor's `appRestoredResult` event
   returns plugin results (for example a photo) after such a restart.
4. **Pause work on background:** stop polling and timers, close or pause
   sockets, end location watches, and pause media. Resume them on
   foreground.
5. **Refresh on resume,** throttled (for example, only if the data is older
   than a set age), keeping the old data visible while it refreshes.
6. **App-shell updates:** for a service worker, show "update available" and
   reload only when the user accepts. For live-update services, follow the
   existing channel setup. Native code changes need a store release.
7. **Test** with a simulated pause and resume (dispatch the listener in a
   unit test, or toggle `visibilityState` in an end-to-end test): the draft
   is restored, polling stops and restarts.

## Outputs

- Feature code using the existing plugins, wrappers, and UI components,
  with web or unsupported-platform fallbacks.
- Platform-specific notes and build or sync commands per platform, with the
  native files changed.
- The link table, link-handling code, association files, and a test matrix
  for cold start, warm start, signed-out, and unknown links.
- Lifecycle handlers that persist and restore state and pause work, with a
  test or manual check list for each transition.

## Technology considerations

| Stack | Consideration |
|---|---|
| Capacitor with Angular | Wrap plugins in injectable services. Plugin listeners run outside the zone in zone-based apps: use `NgZone.run` or signals. Ionic pages stay cached, so put per-visit work in `ionViewWillEnter`. |
| Capacitor with React | Wrap plugins in hooks, and remove listeners in the effect's cleanup (`handle.remove()`). With `IonReactRouter`, use `useIonViewWillEnter` for per-visit work. |
| Capacitor with Vue | Wrap plugins in composables, and remove listeners in `onUnmounted`. Ionic Vue uses `onIonViewWillEnter`. |
| PWA (any framework) | No native plugins. Use web APIs with feature detection, the manifest's `scope` and `start_url` for navigation, and the service worker's update flow. iOS has no install prompt and no `beforeinstallprompt` event. |
| Cordova (legacy) | `deviceready`, `pause`, and `resume` document events, and `cordova-plugin-*` equivalents. Do not mix Cordova and Capacitor plugins for the same feature. |

## Verification

- The web build and `npx cap sync` succeed, or each platform build is
  NOT_RUN with the reason (for example, no Xcode on this machine).
- The URL parser's tests cover every documented link format, and an
  unknown link falls back safely. Device link tests are run, or listed as
  "not verified on device".
- A simulated pause and resume restores in-progress form data and stops
  and restarts background work, shown by a test.
- Every native call has a tested or cited fallback, and no plugin was
  added without approval.
