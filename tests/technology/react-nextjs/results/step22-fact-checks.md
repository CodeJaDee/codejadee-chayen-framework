# Step 22 fact and boundary checks

Date: 2026-10-15. Command: `node tests/technology/react-nextjs/run-fact-checks.mjs --report tests/technology/react-nextjs/results/step22-fact-checks.md`.

Versions: {"node":"v26.8.1","react":"unavailable","next":"unavailable"}.

3 PASS, 0 FAIL, 13 NOT_RUN.

NF-03/04/06 are synthetic JavaScript/Web-standard boundary checks, not Next framework, compiled Server Action, provider-session, or deployment verification. React static markup facts, when available, do not establish browser behavior. Missing framework/browser/production fixtures remain NOT_RUN. No agent behavior or trigger evaluation ran.

| Fact | Capability | Result | Evidence / limit |
|---|---|---|---|
| NF-01 | nextjs-app-router | NOT_RUN | Segment navigation and async request props require a version-matched compiled Next fixture |
| NF-02 | nextjs-server-client-boundary | NOT_RUN | Forbidden imports and secret-sentinel bundle/RSC checks require a production Next build |
| NF-03 | nextjs-server-functions | PASS | Synthetic callable entrypoint rejects unauthorized or malformed calls before writing; not a compiled Server Action |
| NF-04 | nextjs-route-handlers | PASS | Synthetic Web Request/Response handler validates JSON and response/method contracts; not a Next route build |
| NF-05 | nextjs-data-caching | NOT_RUN | Next cache reuse, invalidation, and cross-user isolation require a production version/config-matched fixture |
| NF-06 | nextjs-authentication | PASS | Synthetic direct loopback HTTP boundary rejects anonymous, expired, revoked, forbidden and wrong-tenant access before writing |
| NF-07 | nextjs-rendering-seo | NOT_RUN | Production metadata, status, prerendering, and hydration require a compiled Next/browser fixture |
| NF-08 | nextjs-deployment-testing | NOT_RUN | Built-artifact start/output/adapter behavior requires the configured production artifact and runtime |
| RF-01 | react-component-patterns | NOT_RUN | No existing compatible React/ReactDOM dependency fixture supplied. |
| RF-02 | react-state-effects | NOT_RUN | Effect dependency changes, queued state, and unmount cleanup require the configured DOM/browser runner |
| RF-03 | react-server-state | NOT_RUN | Query invalidation, cancellation, and account isolation require the installed query layer and configured runner |
| RF-04 | react-form-handling | NOT_RUN | No existing compatible React/ReactDOM dependency fixture supplied. |
| RF-05 | react-routing | NOT_RUN | Deep-link/history behavior requires the installed router and host/browser fixture |
| RF-06 | react-render-optimization | NOT_RUN | Render improvement requires a reproducible profiler baseline and measured interaction |
| RF-07 | react-component-testing | NOT_RUN | User interactions and async assertions require the project's configured runner and DOM/browser setup |
| RF-08 | react-accessibility | NOT_RUN | No existing compatible React/ReactDOM dependency fixture supplied. |
