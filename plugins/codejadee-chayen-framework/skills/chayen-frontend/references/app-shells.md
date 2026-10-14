---
kind: technology
---
# Web-technology app shells

**Applies to:** the project's web UI packaged as a PWA, a Capacitor or
Ionic mobile app (Cordova in older apps), or an Electron or Tauri desktop
app.

- Read the shell's major version first (`@capacitor/core`, `@ionic/*`,
  `electron`, `@tauri-apps/api` and `tauri` in `Cargo.toml`). Plugin APIs,
  configuration files, and defaults change between majors.
- Platform behaviour summarised here is what the platforms document for
  recent versions. Confirm it against the installed plugin's documentation
  and the target OS versions before relying on it, and say when you have
  not.

## Check the repository first

| Area | What to look for |
|---|---|
| Capacitor | `capacitor.config.ts` or `.json` (`appId`, `webDir`, `server`), the `android/` and `ios/` native projects (committed and edited by hand, not regenerated), and `@capacitor/*` plugins in `package.json` |
| Ionic | `ionic.config.json`, `@ionic/angular`, `@ionic/react`, or `@ionic/vue`, `ion-router-outlet` or `IonReactRouter` |
| Cordova (legacy) | `config.xml` and `cordova-plugin-*`. Follow it, and do not migrate to Capacitor unasked. |
| PWA | `manifest.webmanifest` or `manifest.json`, and the service worker: `@angular/service-worker` (`ngsw-config.json`), `vite-plugin-pwa`, `@vite-pwa/nuxt`, Workbox, or Serwist or `next-pwa` in Next.js |
| Electron | `electron` in `devDependencies`, the `main` entry, the preload script, `BrowserWindow` options, and the packager: `electron-builder` (`electron-builder.yml` or a `build` key) or Electron Forge (`forge.config.*`) |
| Tauri | `src-tauri/tauri.conf.json`, `Cargo.toml`. Version 2 has `src-tauri/capabilities/*.json` and `@tauri-apps/plugin-*`. Version 1 has an `allowlist` in `tauri.conf.json`. |
| Platform targets | `minSdkVersion` and `targetSdkVersion` (`android/variables.gradle`), the iOS deployment target, `browserslist`, and the desktop OS list in the packager configuration |
| Build scripts | `package.json` scripts and CI jobs that run sync, build, sign, or publish |

## Guidance

### Capacitor and Ionic

- **The web build feeds the native projects.** After a web build or a
  plugin change, run `npx cap sync` so the `webDir` output and plugins are
  copied in. Edits to `android/` and `ios/` are source changes: review
  them like code.
- **Platform checks:** `Capacitor.isNativePlatform()`,
  `Capacitor.getPlatform()`, and `Capacitor.isPluginAvailable('Name')`.
  Every native call has a web or unsupported-platform path.
- **Plugin events** fire outside Angular's zone in zone-based Angular apps.
  Wrap state updates in `NgZone.run`, or use signals, as the codebase does.
- **Ionic pages are cached in the navigation stack.** `ngOnInit`,
  `useEffect` with no dependencies, and `onMounted` run once per page
  instance. Use `ionViewWillEnter` and `ionViewDidEnter` (or
  `useIonViewWillEnter`, `onIonViewWillEnter`) for work on every visit.
- **Safe areas:** `viewport-fit=cover` with `env(safe-area-inset-*)`, or
  Ionic's built-in handling. Check notched devices and the Android gesture
  bar.
- **Building iOS needs macOS with Xcode.** Android needs the Android SDK.
  On other machines, do the web and configuration work, and mark the
  platform build NOT_RUN.

### PWA

- **Installability** needs HTTPS, a manifest with name, icons, `start_url`,
  and `display`, and a registered service worker. `beforeinstallprompt`
  exists only in Chromium browsers. iOS and iPadOS have no install prompt:
  show "Add to Home Screen" instructions instead.
- **The service worker is a cache with a lifecycle.** A new version waits
  until old tabs close, unless the app prompts and calls `skipWaiting`.
  Never reload automatically in the middle of user input.
- **Platform gaps:** Background Sync and Periodic Background Sync are
  Chromium-only. Web Push on iOS and iPadOS works only for web apps added to
  the Home Screen (16.4 and later). Design fallbacks for both.

### Electron

- **Process model:** the main process (Node), preload scripts (a bridge),
  and renderers (web content).
- **Secure defaults:** `contextIsolation: true`, `nodeIntegration: false`,
  and `sandbox: true`. Expose a minimal API through
  `contextBridge.exposeInMainWorld`, validate IPC arguments and the sender
  in the main process, and set a Content Security Policy.
- **Navigation:** block unexpected navigation (`will-navigate`) and new
  windows (`setWindowOpenHandler`). Open external links with
  `shell.openExternal` after allowlisting the URL scheme and host.

### Tauri

- **The Rust core owns privileged work.** The web view calls commands
  (`#[tauri::command]`, `invoke`) and plugins.
- **Least privilege:** version 2 grants plugin and command permissions per
  window through capability files. Version 1 uses the `allowlist`. Add only
  the permissions a feature needs, scoped to paths or URLs.
- **The web view differs per OS:** WebView2 on Windows, WKWebView on macOS,
  and WebKitGTK on Linux. Check CSS and API support for each target.

## Commands

Prefer the `package.json` scripts. Typical commands:

```bash
# Capacitor
npm run build && npx cap sync
npx cap run android            # needs the Android SDK and a device or emulator
npx cap run ios                # needs macOS and Xcode
npx cap open android           # opens Android Studio for signing and profiling

# PWA: serve the production build; service workers do not run in most dev servers
npm run build && npx http-server dist/<app> -p 8080   # or the project's preview script

# Electron
npx electron-builder --win --mac --linux --publish never   # electron-builder
npx electron-forge make                                     # Electron Forge

# Tauri
npx tauri build                # or: cargo tauri build
```

## Pitfalls

- Running `npx cap add` or regenerating `android/` or `ios/` and losing
  hand-made native changes.
- Adding a plugin from a different Capacitor major than `@capacitor/core`.
- Testing a service worker in the dev server, where it is usually disabled,
  and reporting the result as production behaviour.
- `localStorage` or Capacitor Preferences used for large, structured, or
  sensitive data.
- Turning off Electron context isolation, or adding broad Tauri
  permissions, to make an API call work.
- Claiming a behaviour on iOS after testing only on Android, or in a
  desktop browser after testing only in one web view.
