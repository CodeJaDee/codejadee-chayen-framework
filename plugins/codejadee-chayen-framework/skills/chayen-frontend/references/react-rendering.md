---
kind: technology
---
# React rendering cost

## Check the repository first

Read `react-nextjs.md`. Inspect resolved React versions, Compiler configuration,
store subscriptions, profiler evidence, bundle tooling, and nearest tests.

## Measured render changes (react-render-optimization)

**Applies when:** A React view has measured unnecessary render work or interaction latency tied to component updates.

**Not when:** Diagnosing backend latency without render evidence; use performance investigation instead.

**Version notes:** Inspect React and React Compiler configuration before manual memoization; compiler-managed optimization changes the cost/benefit. Development StrictMode render counts differ from production behavior.

**Steps:**

1. Reproduce the interaction and capture profiler timings, commits, expensive calculations, and subscription updates with the project's tooling. Compare equivalent inputs and distinguish development probes from production cost before changing code.
2. Locate the actual cause: state lifted too high, broad store selectors, context identity churn, expensive derivation, or large lists. Prefer the smallest ownership or selector correction consistent with current architecture.
3. Apply memo, useMemo, useCallback, deferred rendering, or the existing virtualizer only when supported and useful to the measured bottleneck. Keep dependencies correct and component behavior independent of memo caches; do not install a new state library or blanket memoize every child.
4. Repeat the same profile and interaction tests, recording before/after evidence. Check stale closures, row identity, input responsiveness, accessibility, and bundle effects; retain the change only when it meets the requested performance and correctness criteria.

**Verify:** Report MEASURED, PASS, FAIL, or NOT_RUN with profiler conditions and configured tests; static presence of memoization is not evidence of improvement.

### Recipe example

When a chart recomputes on unrelated input edits, first profile that render.
If an expensive pure transformation is responsible, memoize that calculation
with complete dependencies using the existing style, then rerun the same input
sequence. A trivial reduce does not justify memoization without measured cost.

## Verification commands

Use the configured profiler, production build, and affected interaction tests.
Report unavailable browser measurements instead of inventing benchmark numbers.

## Pitfalls

- Optimizing development render counts instead of user latency.
- Custom equality callbacks that ignore changing event-handler closures.
- Memoization treated as a semantic guarantee rather than an optimization.
