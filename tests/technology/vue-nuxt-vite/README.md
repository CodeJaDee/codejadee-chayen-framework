# Vue/Nuxt/Vite fact and exposure checks

```text
node tests/technology/vue-nuxt-vite/run-fact-checks.mjs --report tests/technology/vue-nuxt-vite/results/step23-fact-checks.md
```

Optional `--deps <existing-project/node_modules>` reuses compatible installed
Vue 3/core/SSR and Vite API packages. It downloads nothing and changes no
project configuration; it is not a substitute for configured app/test runners.

VF-01..07, UF-01..07, BF-01..04 map all eighteen capabilities. Missing framework,
Nuxt context, module/store/router/runner, production build, profiler, or browser
fixtures yield NOT_RUN. Exit zero means no executed check failed, not that
all facts or framework checks executed.

UF-04/BF-03 run real JavaScript counterexamples: serializing a private config
object exposes a synthetic marker, explicit DTO selection excludes it, env
strings such as false remain truthy, and unrestricted env spreads expose data.
These explain the guidance's application-level privacy boundaries. They are
not Nuxt payload/config serialization, production overrides, Vite env/build/
plugin secrecy, or an application security audit. All such checks require a
real version/config-matched built fixture and remain separately reported.

Optional Vue tests check setup SSR output, ordinary reactive destructuring,
and effect-scope disposal; they do not verify Vue 2, props compiler transforms,
browser interaction, or Nuxt context. Optional Vite resolveConfig checks use
a temporary directory with exact parent/prefix validation before deletion.

V-23 validates mapping/anatomy and positive/negative evaluation specifications.
Agent behavior and trigger evaluations G-12/G-11 must execute before any
capability becomes VERIFIED; this runner does not run them.
