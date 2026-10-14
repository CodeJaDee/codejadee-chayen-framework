---
kind: recipe
capabilities: [CAP-08-008]
---
# Desktop packaging, signing, and updates

Package and update a web-technology desktop app (Electron or Tauri) for
its target operating systems with the packager already in use: build
targets, code signing and notarization, auto-update channels with a
configurable feed, and secure runtime defaults. Read
[app-shells.md](app-shells.md) for detection signals and commands.

## Inputs

- The target operating systems and architectures (Windows x64 and arm64,
  macOS Apple silicon and Intel, Linux distributions).
- The packaging tool in use: electron-builder, Electron Forge, or the Tauri
  bundler, with its version and configuration.
- The signing setup: the Windows code-signing certificate or cloud signing
  service, the Apple Developer ID and notarization credentials, and where
  CI stores them.
- The update needs: the feed host (GitHub Releases, S3, a static server,
  a vendor service), channels (stable, beta), and the rollout policy.

## Procedure

1. **Read the current configuration** and the CI release job. Follow the
   existing packager. Never switch between electron-builder and Forge, or
   add a packager, without approval.
2. **Check runtime security before packaging,** because a signed build
   distributes whatever it contains:
   - Electron: `contextIsolation: true`, `nodeIntegration: false`, and
     `sandbox: true` for every `BrowserWindow`. A preload exposing a
     minimal `contextBridge` API, IPC handlers that validate arguments and
     the sender, a Content Security Policy, blocked unexpected navigation
     and window creation, and an allowlist for `shell.openExternal`. If
     `@electron/fuses` is used, keep `RunAsNode` and the Node options
     fuses off.
   - Tauri: capability files (version 2) or the `allowlist` (version 1)
     grant only the commands, plugins, paths, and URLs in use, and a CSP is
     set in `tauri.conf.json`.

   Report any weakened default as a finding. Do not change it without
   approval.
3. **Define the build targets** per OS in the packager's configuration:
   for example NSIS or MSI for Windows, DMG and ZIP for macOS (the ZIP is
   used by the macOS updater in electron-builder), and AppImage, deb, or rpm
   for Linux. Build each OS on its own CI runner. macOS signing and
   notarization need macOS.
4. **Configure signing without secrets in the repository:**
   - Windows: Authenticode signing through the certificate or cloud
     signing service the team has, configured through CI secrets.
   - macOS: a Developer ID Application certificate, the hardened runtime
     with only the entitlements the app needs, and notarization
     (`notarytool`) followed by stapling. Unsigned macOS apps cannot
     auto-update.
   - Tauri updates are also signed with the updater key pair. The public
     key is in the configuration, and the private key and its password are
     CI secrets.

   Ask before creating, rotating, or uploading any certificate or key, and
   refer to them only by secret name, never by value.
5. **Configure updates:**
   - Electron with electron-builder: `electron-updater` and a `publish`
     provider. Electron Forge: its publishers, and `update-electron-app`
     or `autoUpdater` with a feed.
   - Tauri: the updater plugin (version 2) or the built-in updater
     (version 1), with endpoints that return the signed update manifest.
   - **Make the feed URL configurable** (per environment or channel), not
     hard-coded to a personal or test location.
   - Channels: stable and beta as separate feeds or channel files. Decide
     how users opt in.
   - Update experience: download in the background, ask before
     restarting, and never restart while there is unsaved work.
   - Rollback means publishing a higher fixed version. Updaters do not
     downgrade on their own.
6. **Version and release:** bump the version in the place the project uses
   (`package.json`, `tauri.conf.json`, `Cargo.toml`), generate the release
   notes, and keep publishing behind a manual approval in CI. Never publish
   or upload a release without the user's approval.
7. **Build locally** with publishing disabled
   (`electron-builder --publish never`, `electron-forge make`,
   `tauri build`) for the current OS, and list the artifacts produced.
   Mark the other OS builds and signing NOT_RUN unless CI ran them.

## Outputs

- Packaging and update configuration per target OS, with signing steps
  that reference CI secrets by name.
- The security settings checked (context isolation on, Node integration
  off in renderers, sandbox, CSP, Tauri permissions), with any finding.
- Release steps: version bump, build per OS, sign, notarize, publish to the
  feed after approval, and how to roll forward.

## Technology considerations

| Stack | Consideration |
|---|---|
| Electron with electron-builder | `electron-builder.yml` or the `build` key: `win.target`, `mac.target`, `linux.target`, `mac.hardenedRuntime`, `mac.notarize` (version-dependent), and `publish`. `electron-updater` reads `latest.yml`, `latest-mac.yml`, and `latest-linux.yml`. Channels come from the version suffix (`1.2.0-beta.1`). |
| Electron with Electron Forge | `forge.config.*` makers (Squirrel.Windows, DMG, ZIP, deb, rpm), `osxSign` and `osxNotarize` in the packager configuration, publishers, and the Fuses plugin. `update-electron-app` works with the public update service for public GitHub repositories only. |
| Tauri version 2 | `bundle.targets`, `bundle.createUpdaterArtifacts`, the updater plugin with `pubkey` and `endpoints`, capabilities in `src-tauri/capabilities/`, and the signing environment variables named in the Tauri documentation for the installed version. |
| Tauri version 1 | `tauri.bundle`, `tauri.updater` (`active`, `endpoints`, `pubkey`), and the `allowlist`. Moving to version 2 is a migration: ask first. |
| Angular, React, or Vue renderer | The renderer build is static files loaded by the shell. Use relative or custom-protocol base paths (Angular `baseHref`, Vite `base`), and hash-based routing if the shell serves `file://` URLs and the app already does. |

## Verification

- The Electron fixture keeps context isolation on and Node integration off
  in every window, and the update feed URL comes from configuration,
  checked by citing the code or a test.
- A local package build for the current OS succeeds with publishing
  disabled, and the artifacts are listed. Other OS builds, signing, and
  notarization are PASS only with CI or tool output, otherwise NOT_RUN.
- No certificate, key, password, or token value appears in the diff or the
  output.
- Update behaviour (download, prompt, restart) on an installed build is
  reported as verified with the OS, or "not verified on device".
