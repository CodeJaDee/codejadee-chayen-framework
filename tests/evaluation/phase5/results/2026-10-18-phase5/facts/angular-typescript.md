# Step 21 framework facts

Date: 2026-10-15. Command: `node tests/technology/angular-typescript/run-fact-checks.mjs --report <ABS-PATH>`.

Versions: {"node":"v24.22.0","typescript":"unavailable","angular":"unavailable"}.

3 PASS, 0 FAIL, 19 NOT_RUN. A successful runner exit means no executed fact failed; skipped facts remain NOT_RUN. No agent behavior or trigger eval ran.

| Fact | Capability | Result | Evidence / limit |
|---|---|---|---|
| AF-01 | angular-component-design | NOT_RUN | No existing Angular dependency fixture supplied; no packages installed. |
| AF-02 | angular-signals | NOT_RUN | No existing Angular dependency fixture supplied; no packages installed. |
| AF-03 | angular-rxjs-interop | NOT_RUN | No existing Angular dependency fixture supplied; no packages installed. |
| AF-04 | angular-state-management | NOT_RUN | No existing Angular dependency fixture supplied; no packages installed. |
| AF-05 | angular-routing | NOT_RUN | No existing Angular dependency fixture supplied; no packages installed. |
| AF-06 | angular-http-client | NOT_RUN | No existing Angular dependency fixture supplied; no packages installed. |
| AF-07 | angular-forms | NOT_RUN | No existing Angular dependency fixture supplied; no packages installed. |
| AF-08 | angular-template-control-flow | NOT_RUN | No existing Angular dependency fixture supplied; no packages installed. |
| AF-09 | angular-dependency-injection | NOT_RUN | No existing Angular dependency fixture supplied; no packages installed. |
| AF-10 | angular-change-detection | NOT_RUN | No existing Angular dependency fixture supplied; no packages installed. |
| AF-11 | angular-ssr-hydration | NOT_RUN | No existing Angular dependency fixture supplied; no packages installed. |
| AF-12 | angular-testing | NOT_RUN | No existing Angular dependency fixture supplied; no packages installed. |
| AF-13 | angular-accessibility | NOT_RUN | No existing Angular dependency fixture supplied; no packages installed. |
| AF-14 | angular-upgrade-migration | NOT_RUN | No existing Angular dependency fixture supplied; no packages installed. |
| JF-01 | typescript-type-safety | NOT_RUN | No existing TypeScript compiler supplied; no compiler downloaded. |
| JF-02 | typescript-api-modeling | NOT_RUN | No existing TypeScript compiler supplied; no compiler downloaded. |
| JF-03 | javascript-async-control | PASS | Awaited work stays ordered and bounded; cancellation rejects owned pending I/O |
| JF-04 | javascript-runtime-compatibility | PASS | Node lacks browser window even when a compiler provides DOM type declarations |
| JF-05 | esm-cjs-interop | PASS | Node loads an explicit CommonJS export from ESM; require of an .mjs file with top-level await fails |
| JF-06 | package-manager-integrity | NOT_RUN | No existing npm CLI supplied; no install command run. |
| JF-07 | typescript-monorepo | NOT_RUN | No existing TypeScript compiler supplied; no compiler downloaded. |
| JF-08 | typescript-config-review | NOT_RUN | No existing TypeScript compiler supplied; no compiler downloaded. |
