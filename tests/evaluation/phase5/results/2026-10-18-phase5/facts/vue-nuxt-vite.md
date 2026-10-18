# Step 23 fact and exposure checks

Date: 2026-10-15. Command: `node tests/technology/vue-nuxt-vite/run-fact-checks.mjs --report <ABS-PATH>`.

Versions: {"node":"v24.22.0","vue":"unavailable","nuxt":"unavailable","vite":"unavailable"}.

2 PASS, 0 FAIL, 16 NOT_RUN.

UF-04/BF-03 are JavaScript serialization/string-exposure counterexamples using synthetic sentinels. They do not exercise Nuxt private/public projection or runtime overrides, Vite env transformation/build output, plugins, or framework secrecy. Optional Vue/Vite APIs run only when existing compatible dependencies are explicitly supplied. No packages installed; no agent behavior or trigger evaluation ran.

| Fact | Capability | Result | Evidence / limit |
|---|---|---|---|
| BF-01 | vite-configuration | NOT_RUN | No existing Vite dependency supplied; selected framework builder/config remains untested. |
| BF-02 | vite-build-optimization | NOT_RUN | Optimization requires the actual production build and comparable bundle/loading measurements |
| BF-03 | vite-environment-safety | PASS | JavaScript false env string is truthy and an unrestricted env spread exposes a private sentinel (not Vite bundle verification) |
| BF-04 | vite-test-integration | NOT_RUN | Runner config inheritance and transforms require the project's configured runner/environment |
| UF-01 | nuxt-routing | NOT_RUN | Nuxt generated routes, layouts, middleware and SSR navigation require a compiled matching fixture |
| UF-02 | nuxt-data-fetching | NOT_RUN | SSR/hydration payload reuse, keys and cancellation require a matching Nuxt app and browser |
| UF-03 | nuxt-server-api | NOT_RUN | Installed Nuxt/Nitro or legacy server endpoint behavior requires its configured server fixture |
| UF-04 | nuxt-runtime-config | PASS | JavaScript JSON serialization of a config leaks its private sentinel; explicit public DTO excludes it (not Nuxt serialization/overrides) |
| UF-05 | nuxt-auto-imports | NOT_RUN | Generated imports/types and composable context require Nuxt prepare/build/runtime fixture |
| UF-06 | nuxt-modules | NOT_RUN | Module/layer/hook compatibility and server/client integration require installed module and Nuxt fixture |
| UF-07 | nuxt-rendering-deployment | NOT_RUN | Preset/output/runtime overrides and real hydration require a built Nuxt artifact and browser |
| VF-01 | vue-composition-api | NOT_RUN | No matching existing Vue 3 API/SSR dependency fixture supplied. |
| VF-02 | vue-reactivity | NOT_RUN | No matching existing Vue 3 API/SSR dependency fixture supplied. |
| VF-03 | vue-composables | NOT_RUN | No matching existing Vue 3 API/SSR dependency fixture supplied. |
| VF-04 | vue-router | NOT_RUN | Navigation/history and host fallback require the installed router and configured fixture |
| VF-05 | vue-state-management | NOT_RUN | SSR store isolation and subscription behavior require the installed Pinia/Vuex or existing state layer |
| VF-06 | vue-component-testing | NOT_RUN | Component emits/model/async behavior require configured Vue Test Utils/runner and DOM setup |
| VF-07 | vue-performance | NOT_RUN | Rendering improvement needs comparable profiler evidence and user interaction |
