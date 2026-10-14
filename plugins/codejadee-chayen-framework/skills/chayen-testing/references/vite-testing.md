---
kind: technology
---
# Vite-aware test integration

## Check the repository first

Inspect actual Vite/builder evidence, resolved Vite/Vitest or other runner,
manager/scripts, test config, framework plugins, aliases, env/modes, workspaces,
and current DOM/Nuxt/browser setup. Vite does not imply Vitest or Vue.

## Configured runner integration (vite-test-integration)

**Applies when:** An evidenced Vite project needs its existing test runner/configuration aligned with transforms, aliases, env, or framework behavior.

**Not when:** A webpack or non-Vite project needs ordinary tests; retain its own runner and config instead.

**Version notes:** Check installed Vite/runner compatibility and config APIs. A separate Vitest config can override rather than inherit Vite options; workspace/project and mergeConfig patterns vary by version. Jest remains valid when configured.

**Steps:**

1. Trace which build and test configs actually run, including framework-owned targets, scripts, versions, and workspace projects. Preserve the configured runner rather than adding Vitest simply because Vite is present.
2. Align only needed transforms, installed plugins, aliases, setup files, and environment settings through supported shared/merged configuration. Keep test-only DOM, globals, mocks, and coverage settings out of production build ownership.
3. Handle modes/env through the existing scheme, with synthetic values and explicit server/browser boundaries. Do not load private credentials into test snapshots or browser projects; use Nuxt's supported context setup for Nuxt tests rather than silently flattening them into plain Vue tests.
4. Run a representative positive test and an expected missing-alias/unsupported-import or environment-negative case through the actual runner, then build separately. Verify workspace isolation and async cleanup where affected; test success does not imply a production artifact resolves the same paths or passes typecheck.

**Verify:** Report PASS, FAIL, or NOT_RUN with runner/build/typecheck commands; state which config/environment was exercised and do not infer Vitest or Vite behavior from static files alone.

### Recipe example

If an existing Vitest project cannot resolve the app's alias, trace its actual
config ownership and supported merge pattern, then share only required alias/
plugin settings. Keep browser/DOM setup test-specific and verify the emitted
app separately. A Jest project keeps its existing transform mapping instead.

## Verification commands

Use current scripts and pinned tools. Do not install a runner/compiler or
rewrite workspace configuration just to match an example command.

## Pitfalls

- Separate test config assumed to inherit every app setting automatically.
- Browser-only tests run in Node without their configured environment.
- Private env values copied into fixtures or snapshots.
