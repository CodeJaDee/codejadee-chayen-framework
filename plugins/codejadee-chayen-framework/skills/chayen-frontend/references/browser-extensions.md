---
kind: recipe
capabilities: [CAP-19-009]
---
# Browser extensions

Build browser extensions with Manifest V3: a service worker for background
logic, content scripts for page interaction, typed messaging between them,
the minimum permissions and host permissions the code needs, a strict
content security policy, and store packaging with permission
justifications. Browser support differs, so target browsers are stated and
checked.

## Inputs

- The extension's purpose, the sites it runs on, and the target browsers
  (Chrome and Edge, Firefox, Safari).
- The existing setup: build tool (Vite with an extension plugin, WXT,
  Plasmo, plain webpack), UI framework for popups and options pages, and
  any existing manifest.
- Data the extension handles and where it sends it.

## Procedure

1. **Inspect the project:** manifest version, build tooling, and framework.
   Do not assume a framework or extension toolkit; follow what exists, and
   propose one only with approval.
2. **Map features to contexts:** service worker (events, network,
   storage), content scripts (DOM of matched pages, isolated world), popup
   and options pages (UI), and offscreen documents where the browser
   supports them.
3. **Request the minimum permissions:** each permission and host pattern
   maps to code that uses it; prefer `activeTab` and optional permissions
   requested at the moment of need over broad host access.
4. **Design messaging:** typed messages between content scripts and the
   service worker, validating the sender and the payload; never trust data
   from web pages without validation.
5. **Respect Manifest V3 limits:** the service worker can stop at any time,
   so persist state in `storage`; no remotely hosted code; use declarative
   network rules where request blocking is needed.
6. **Set a strict CSP** for extension pages, and never inject untrusted
   HTML.
7. **Build and load:** produce the unpacked build, load it in each target
   browser's developer mode, and record the result, or NOT_RUN.
8. **Package for stores:** version, icons, permission justifications, and a
   privacy statement of data handling; publishing needs approval.

## Outputs

- A manifest and code with minimal permissions and host permissions.
- Build and packaging steps, and a review of permission justifications.

## Technology considerations

| Stack | Consideration |
|---|---|
| Vite, React, Vue, Angular | Popup and options pages as small apps; content-script UI in a shadow root to avoid style clashes; extension toolkits (WXT, Plasmo, CRXJS) only if already used. |
| TypeScript | `@types/chrome` or `webextension-polyfill` for cross-browser APIs; typed message unions. |
| Firefox | Manifest V3 support with differences (background scripts versus service workers, `browser_specific_settings`); test separately. |
| Safari | Requires conversion and packaging with Xcode on macOS; mark NOT_RUN elsewhere. |
| Security | Content scripts run alongside untrusted pages; validate everything crossing that boundary. |

## Verification

- The fixture manifest requests no permission the code does not use, with
  each permission justified.
- The extension loads in the target browsers, or the load check is NOT_RUN
  with the reason.
- No remote code is loaded, and nothing is published without approval.
