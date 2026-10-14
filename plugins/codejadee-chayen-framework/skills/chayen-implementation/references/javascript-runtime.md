---
kind: technology
---
# JavaScript asynchronous work and runtime boundaries

## Check the repository first

Read `typescript-javascript.md`. Inspect supported browsers and server
runtimes, package module type/exports, bundler, concurrency helpers,
cancellation conventions, and actual runtime tests.

## Async ordering and cancellation (javascript-async-control)

**Applies when:** JavaScript or TypeScript asynchronous work loses ordering, errors, cancellation, or bounded resource usage.

**Not when:** Angular Observable composition alone is affected; use its RxJS guidance instead.

**Version notes:** Check actual runtime support for AbortController, fetch, and Promise helpers; TS lib declarations alone do not provide these APIs. Preserve the existing runtime and concurrency helper.

**Steps:**

1. Trace ownership, error propagation, resource lifetime, and required ordering. Reproduce late-result overwrite, uncaught rejection, or concurrency saturation using deterministic deferred operations rather than timing-dependent sleeps.
2. Await sequential dependencies explicitly and use bounded parallelism for independent work. Do not use async forEach or launch unbounded Promise.all over user-sized inputs; reuse the project's existing limiter where present.
3. Forward an AbortSignal through supported I/O and distinguish cancellation from failure. If work cannot cancel, discard obsolete results at the owner; preserve finally cleanup and avoid detached work unless the existing design owns and observes it.
4. Test success, rejection, cancellation before and during work, older results arriving late, and concurrency limits. Ensure no unhandled rejections or leaked listeners remain and that a retry does not repeat non-idempotent writes without permission.

**Verify:** Report PASS, FAIL, or NOT_RUN with deterministic async tests and runtime commands; verify bounded active work and cleaned resources rather than matching Promise syntax.

```js
// Ordered side effects; independent work uses the existing bounded limiter.
for (const item of items) await save(item, { signal });
```

## Runtime support (javascript-runtime-compatibility)

**Applies when:** Shared JavaScript or TypeScript code must run on specified browsers, Node, Bun, workers, or SSR runtimes.

**Not when:** Only fixing compiler diagnostics without runtime requirements; use type-safety guidance instead.

**Version notes:** Record engines, CI/container versions, browser targets, and Bun/Node differences. target downlevels syntax while lib provides types; neither guarantees runtime APIs or polyfills exist.

**Steps:**

1. List the actual consumers and supported versions from engines, CI, browser configuration, deployment targets, and package exports. Resolve conflicts before choosing a runtime-specific API or changing build output.
2. Check syntax, standard APIs, globals, and platform modules independently. Keep Node-only fs and process usage out of browser entry graphs; guard browser APIs in SSR using the established platform boundary.
3. Use existing adapters or configured polyfills only when required for the supported targets. Do not add broad polyfill bundles, change engines, or select Bun-specific behavior in a Node-supported package without a request.
4. Run the built artifact in each available supported runtime, plus SSR without window and a browser production build where applicable. Test a missing-API or forbidden-platform-import case; clearly label unavailable runtime/browser checks instead of inferring them from typechecking.

**Verify:** Report PASS, FAIL, or NOT_RUN per runtime and artifact with exact commands; a Node-only test cannot establish browser or Bun compatibility.

## Module boundaries (esm-cjs-interop)

**Applies when:** ESM/CommonJS consumers fail to import a JavaScript or TypeScript package or its generated output.

**Not when:** A missing package version or lockfile conflict is the cause; use package integrity guidance instead.

**Version notes:** Match Node/Bun versions, package type, .mjs/.cjs or .mts/.cts files, and compiler moduleResolution. Newer Node require-of-ESM behavior differs; do not promise dual compatibility from esModuleInterop alone.

**Steps:**

1. Reproduce the failure with the actual consumer and emitted artifact, not only the source test runner. Read package type, main, exports conditions, extensions, tsconfig, and bundler assumptions for both sides.
2. Preserve the package's promised module formats. Align emit and resolution for its runtime or bundler; do not add a second output format or flip type to module as an incidental import fix.
3. Check default versus named imports, relative extension requirements, conditional exports, and dependency entrypoints. esModuleInterop affects TypeScript's handling of imports; it does not make every ESM dependency synchronously require-able.
4. Run import and require consumers only for formats actually promised, including the packed or emitted entrypoints. Add a failing unsupported-path or wrong-format negative control; ensure declaration resolution agrees with runtime exports and cannot expose internal server modules.

**Verify:** Report PASS, FAIL, or NOT_RUN with built-artifact import/require and consumer typecheck commands; source-level bundler success alone does not establish package interop.

```js
// Explicit CommonJS fixture: values.cjs
module.exports = { count: 2 };
// ESM consumer: values.mjs
import values from './values.cjs';
console.log(values.count);
```

## Verification commands

Use configured runtime tests and built-artifact consumers. Test only approved
targets and public entrypoints; do not change the project manager or runners.

## Pitfalls

- Type libraries mistaken for runtime polyfills.
- Promise.all over an unbounded import queue.
- A test runner resolving imports that the emitted Node artifact cannot.
