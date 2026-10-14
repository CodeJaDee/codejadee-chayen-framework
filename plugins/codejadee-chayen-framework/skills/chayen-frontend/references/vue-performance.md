---
kind: technology
---
# Vue rendering performance

## Check the repository first

Read `vue-nuxt.md`. Inspect Vue/compiler version, existing profiler/build
tools, store subscriptions, list identity, SSR mode, and measured interaction.

## Measured rendering changes (vue-performance)

**Applies when:** Vue rendering or interaction cost has a reproducible measured bottleneck needing a scoped change.

**Not when:** Only tuning build chunking in an evidenced Vite project; use Vite build optimization guidance instead.

**Version notes:** v-memo, shallow APIs, computed stability, and compiler optimizations differ by Vue version. Check installed support and Nuxt rendering before selecting a performance mechanism.

**Steps:**

1. Reproduce the slow interaction and capture render/update, computation, memory, or network evidence with the project's tooling. Separate server fetch latency and bundle cost from reactive component work before changing code.
2. Locate broad watchers, unstable props, expensive derivation, large deep-reactive data, or excessive list rendering. Preserve current store and component architecture; prefer the smallest ownership or computed correction.
3. Use supported shallow state, stable props/keys, selective rendering, or the existing virtualizer only when it addresses the measured cost. Respect immutable update/trigger requirements and avoid adding a new state or virtualization dependency speculatively.
4. Repeat the same profile and interaction tests, comparing conditions and results. Check focus, keyboard use, row identity, stale state, hydration where present, and error/pending behavior; do not retain an optimization that changes required semantics.

**Verify:** Report MEASURED, PASS, FAIL, or NOT_RUN with before/after conditions and commands; merely adding v-memo or shallowRef is not evidence of improved performance.

### Recipe example

Profile an editable list before reducing update scope. Keep stable item keys,
reuse the installed list primitive, and verify editing/focus after reorder.
If data becomes shallow, updates must replace/trigger the root as the chosen
API requires; test a nested change instead of assuming it remains reactive.

## Verification commands

Use the existing browser profiler, affected tests, and production build. No
benchmark numbers are reported for unexecuted browser measurements.

## Pitfalls

- Comparing different data sizes or dev versus production timings.
- Shallow state with in-place nested mutations that no longer notify.
- Optimizing away accessible interaction or correct list identity.
