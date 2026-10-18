---
kind: technology
---
# Nuxt routing, data, and imports

## Check the repository first

Read `vue-nuxt.md`. Inspect resolved Nuxt/Vue and server dependencies versions, actual srcDir,
app/root layout, pages configuration, imports/layers, data wrappers, and tests.

## Framework routes (nuxt-routing)

**Applies when:** Nuxt file-based pages, layouts, navigation, or route middleware need implementation or repair.

**Not when:** Editing an explicit plain Vue Router configuration; use Vue router guidance instead.

**Version notes:** Nuxt 2/3/4 differ in page conventions, source layout, middleware, and metadata. Nuxt 4 commonly uses app/; inspect configured srcDir and compatibility settings rather than moving older folders automatically.

**Steps:**

1. Find the actual page root, generated route conventions, layouts, route middleware, and existing navigation. Preserve current Nuxt major and directory structure; do not create a standalone Vue router for a file-based feature.
2. Add the smallest compatible page/parameter file and reuse existing Nuxt links and navigation helpers. Keep query/parameter rules, error/not-found outcomes, and any configured route extensions or layers.
3. Keep middleware in its existing application role, with browser/server-safe context access. A route redirect is not server authorization; every protected server endpoint must enforce identity and resource policy independently.
4. Test direct SSR entry, client navigation, changed params, layouts, middleware denial, unknown pages, and history with the configured Nuxt/browser tools. Check both rendered status/content and client transitions without claiming deployment behavior from a dev-only test.

**Verify:** Report PASS, FAIL, or NOT_RUN with Nuxt build/route/browser commands; label generated-route and deployed fallback checks separately.

## SSR-aware remote data (nuxt-data-fetching)

**Applies when:** Nuxt page/composable data loading needs hydration reuse, request identity, refresh, or error-state changes.

**Not when:** An event-triggered standalone request or plain Vue fetch helper suffices; preserve that existing request layer instead.

**Version notes:** Nuxt 3/4 useFetch/useAsyncData options and reactive/default/deep behavior vary by release. Nuxt 2 uses its established asyncData/fetch patterns. Bare $fetch in universal setup can refetch during hydration; this is not a universal rule for event handlers.

**Steps:**

1. Trace the current data wrapper, Nuxt version, key, source parameters, server/client execution, and intended freshness. Retain supported asyncData/useFetch/useAsyncData conventions rather than importing newer APIs into Nuxt 2.
2. Define stable keys incorporating request-defining resource and safe identity scope, with consistent shared-key options. Preserve request-local data, cancellation/deduplication behavior, and visible pending/error/empty states; avoid duplicate state containers.
3. Keep returned payloads minimal and safe because SSR data can reach the browser. Do not forward arbitrary incoming cookies/headers to third-party origins or expose private runtime config; use existing authorized server endpoints for privileged work.
4. Test SSR fetch, hydration reuse, changed parameters, slow old responses, failed requests, refresh after mutation, and separate users. Count network calls in the actual Nuxt fixture; event-only $fetch is valid where the current contract needs no SSR payload reuse.

**Verify:** Report PASS, FAIL, or NOT_RUN with request-count, production SSR/browser, and configured test evidence; a mocked promise alone does not prove Nuxt hydration deduplication.

```ts
// Nuxt 3/4 feature already using this compatible wrapper:
const { data, status, error } = await useFetch('/api/orders', { key: 'orders' })
```

For filtered or personalized data, use the existing identity/parameter-aware
key policy instead of copying this simple unfiltered example unchanged.

## Context and generated imports (nuxt-auto-imports)

**Applies when:** Nuxt auto-import discovery, collisions, generated types, or composable context causes a concrete defect.

**Not when:** Plain Vue needs an ordinary explicit import; use its existing module conventions instead.

**Version notes:** Nuxt major, srcDir, layers, imports.scan/autoImport, and module configuration determine discovery. Nuxt composables often require valid synchronous framework context; plain helpers and arbitrary async callbacks do not automatically have it.

**Steps:**

1. Find the owning symbol, actual source directory, import settings, module/layer contributions, and nearest conventions. Distinguish compiler macros, framework auto-imports, and ordinary JavaScript imports before fixing a missing name.
2. Inspect generated import/type evidence through the existing prepare/typecheck process without editing generated .nuxt files. Resolve collisions with current naming or explicit imports; preserve deliberate auto-import disabling and module boundaries.
3. Acquire Nuxt context-dependent services in a supported call location and pass necessary values explicitly into ordinary helpers. Do not assume an asynchronous callback or module top level can call useNuxtApp/useRuntimeConfig safely.
4. Test preparation, typecheck, server/client compilation, and the affected context path. Check symbols resolve from the intended owner and that a plain Vue consumer does not acquire hidden Nuxt dependencies; keep private server modules out of client auto-import graphs.

**Verify:** Report PASS, FAIL, or NOT_RUN with configured prepare/typecheck/build and context tests; editor completion alone is not proof of runtime context validity.

## Verification commands

Use the Nuxt project's configured scripts and runner. Preserve source layout
and do not repair generated files by hand or assume Vite is the selected builder.

## Pitfalls

- A single key shared by different resources or inconsistent options.
- Copying private server values into async-data payloads.
- Auto-imports assumed available in ordinary Vue or server-independent helpers.
