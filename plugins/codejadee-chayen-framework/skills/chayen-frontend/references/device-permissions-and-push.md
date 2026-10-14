---
kind: recipe
capabilities: [CAP-08-004, CAP-08-005]
---
# Device permissions, sensors, and push notifications

Request device permissions just in time with a clear rationale, handle
every answer including permanent denial, declare platform usage
descriptions, and implement push notifications end to end: registration,
token storage and cleanup, server sending through the existing provider,
privacy-safe payloads, and tap handling. Read
[app-shells.md](app-shells.md) for the shell's commands.

## Inputs

- The capabilities needed (camera, photos, location, notifications, files,
  microphone, motion), the target platforms and minimum OS versions, and
  the plugins or web APIs in use.
- For push: the platforms, the push provider (Firebase Cloud Messaging,
  APNs, Web Push with VAPID, or a vendor service), the server stack, the
  notification events, and the user's notification preferences.

## Procedure

### Permissions and sensors (CAP-08-004)

1. **Ask only on user action.** Never request permissions at app start.
   Request when the user starts the feature that needs it ("Find nearby
   stores"), and request the narrowest permission (location while in use,
   not always; a photo picker instead of full library access where the
   platform offers one).
2. **Check before requesting:** `checkPermissions()` in Capacitor plugins,
   or `navigator.permissions.query()` on the web where supported. Handle
   each state:

   | State | Behaviour |
   |---|---|
   | Granted | Proceed |
   | Prompt | Show the app's short rationale (what and why), then the system request |
   | Prompt with rationale (Android) | The user denied once: explain again before asking |
   | Denied or blocked permanently | Do not prompt again. Explain, offer the fallback, and offer to open the app's settings through the plugin the project uses |
   | Limited (iOS photos) | Work with the selected items, and offer to change the selection |
   | Unsupported | Use the fallback |

3. **Always provide a fallback:** manual address entry, typing a code
   instead of scanning, choosing a file instead of taking a photo. The
   denied path is a normal UI state ([ui-states.md](ui-states.md)), not an
   error.
4. **Declare platform entries,** after approval, because they appear in
   store review:
   - Android: `<uses-permission>` in `AndroidManifest.xml`, only for what
     is used. Notifications need the `POST_NOTIFICATIONS` runtime
     permission on Android 13 and later.
   - iOS: the `NS…UsageDescription` keys in `Info.plist` (for example
     `NSCameraUsageDescription`, `NSLocationWhenInUseUsageDescription`)
     with specific, honest text. Accessing a protected API without its key
     terminates the app.
   - Web: a secure context (HTTPS) is required, and browsers may block
     prompts that are not triggered by a user gesture.
5. **Use sensors sparingly:** stop location watches and sensor listeners
   when the screen is left or the app goes to the background, and choose
   the lowest accuracy and frequency that meets the need.
6. **Test** the flow with mocked plugin results: granted, denied, and
   permanently denied, asserting the request happens only after the user
   action and the denied state shows the fallback.

### Push notifications (CAP-08-005)

1. **Confirm the provider and server.** Use the existing provider SDK on
   the server (Firebase Admin, a Web Push library, an APNs client, or the
   vendor's SDK). Ask before adding one. Credentials (the FCM service
   account, APNs key, VAPID private key) live in the server's secret store,
   never in client code or the repository.
2. **Ask for notification permission in context,** after the user opts in
   to something worth notifying about, using the permission flow above.
3. **Register and store tokens.** After permission, register
   (`PushNotifications.register()` in Capacitor, or
   `pushManager.subscribe()` with the VAPID public key on the web). Send
   the token or subscription to the server with the user, platform, and app
   version. Store it with a unique constraint, allowing several devices per
   user, and update it when the token changes.
4. **Keep tokens fresh:** re-register on app start and update the stored
   token when it differs, delete the token on sign-out, and delete it on
   the provider's "not registered" responses (FCM `UNREGISTERED`, Web Push
   404 or 410, APNs 410).
5. **Design payloads for privacy.** Notifications appear on lock screens,
   so carry no sensitive data. Send a short generic text and an identifier,
   and load the details after the app opens and the user is authenticated.
   Include the deep-link route for tap handling.
6. **Send from the server** on the business event, through the existing
   job or messaging mechanism, with retries for transient failures and
   token cleanup for permanent ones. Respect user preferences and quiet
   hours if the product defines them.
7. **Handle receipt and taps:** the foreground behaviour (an in-app banner,
   or presentation options), Android notification channels (Android 8 and
   later), and tap handling that routes through the deep-link table
   (`pushNotificationActionPerformed` in Capacitor, `notificationclick` in
   the service worker).
8. **Test:** server tests with a fake provider that assert token storage,
   cleanup on an invalid-token response, and a payload without sensitive
   fields. Client tests for registration and tap routing with mocked plugin
   events. Real delivery is "not verified on device" unless a device test
   was run.

## Outputs

- A permission flow with rationale text, denied and permanently-denied
  handling, a fallback, and the manifest and `Info.plist` entries with
  usage descriptions.
- Push client registration and handling code, server send code with the
  token lifecycle (store, refresh, remove), and tap routing.
- Privacy notes on notification content, and where provider credentials
  are stored (by location, value `<redacted>`).

## Technology considerations

| Stack | Consideration |
|---|---|
| Capacitor (Angular, React, Vue) | `@capacitor/push-notifications` returns an APNs token on iOS unless the project integrates Firebase for FCM tokens, so the server must send through the matching service. iOS needs the Push Notifications capability and an APNs key. Android needs `google-services.json`, which is configuration rather than a secret, but follows the project's handling. Permission plugins: `@capacitor/camera`, `@capacitor/geolocation`, `@capacitor/local-notifications`. |
| PWA | Web Push needs a service worker, VAPID keys, and HTTPS. On iOS and iPadOS 16.4 and later it works only for Home Screen web apps, and the permission request must come from a user gesture. `navigator.permissions` support varies by browser and permission name. |
| ASP.NET Core server | Use the provider SDK the project has (FirebaseAdmin, a WebPush package, an APNs client) behind an injected interface, with tokens in the existing data store. |
| Node servers (Nitro, Nuxt, Next.js, Elysia) | `firebase-admin` or `web-push`. Send from a worker or queue, not inside a request with a short serverless timeout. |
| Python servers (FastAPI, Django, Flask) | `firebase-admin` or `pywebpush`, called from the project's task queue (Celery, RQ). |
| Electron and Tauri | Desktop notifications are local (`Notification` in the renderer, or the Tauri notification plugin). Remote push to desktop needs a vendor service or an open connection, which is an architecture decision. |

## Verification

- The permission is requested only on user action, and the denied and
  permanently-denied states have a tested UI path with a fallback.
- Every new platform permission has a usage description, and none is
  declared without use, checked against the manifest diff.
- Server tests show tokens stored and refreshed, removed on an
  invalid-token response, and payloads without sensitive data, reported
  PASS, FAIL, or NOT_RUN with the command.
- Delivery and tap behaviour on real devices is reported as verified with
  the device and OS, or "not verified on device".
