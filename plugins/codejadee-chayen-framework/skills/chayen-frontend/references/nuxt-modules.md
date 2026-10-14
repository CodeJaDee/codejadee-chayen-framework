---
kind: technology
---
# Nuxt module integration

## Check the repository first

Read `vue-nuxt.md`. Inspect resolved Nuxt/module/kit versions, modules list,
layers, compatibility settings, builder, config ownership, and module fixtures.

## Existing module contracts (nuxt-modules)

**Applies when:** A Nuxt app needs a configured installed module or an explicitly requested module integration/implementation.

**Not when:** One local component/helper solves the task; avoid introducing a module abstraction or dependency instead.

**Version notes:** Nuxt 2 modules differ from Nuxt 3/4 Nuxt Kit APIs, hooks, compatibility ranges, and builder integration. Match the installed module's supported Nuxt/runtime versions; do not assume newest documentation matches its API.

**Steps:**

1. Identify the installed module, current options, layers, dependency pins, and affected app behavior. Confirm compatibility and concrete need; reuse existing integration rather than adding a module for a one-off feature.
2. Change only the owning nuxt.config/module options or established hook. For requested module code, use supported Kit/hook APIs and current naming/types; do not mutate generated output or create a competing standalone Vite config.
3. Separate build-time setup, server runtime, and client plugins/imports. Keep secrets in private runtime configuration, not public module options, app.config, generated templates, or injected client values; guard browser-only adapters consistently.
4. Prepare/typecheck/build and exercise the integration's actual server/client paths with the existing module fixture or app tests. Check duplicate registration, layer overrides, disabled options, and incompatible versions; dependency changes need authorization under the owning workflow.

**Verify:** Report PASS, FAIL, or NOT_RUN with module/app commands and observed behavior; install or generated-type success alone does not verify runtime integration.

### Recipe example

When an installed module already supplies an analytics client, update its
documented public setting in the owning configuration and retain the existing
client plugin boundary. Privileged server tokens remain private. Test disabled
mode and SSR without browser globals before claiming the integration works.

## Verification commands

Use current prepare, typecheck, build, and integration scripts. Do not install
or upgrade modules merely to obtain a newer example API.

## Pitfalls

- Public module options containing private credentials.
- Hooks selected from a different Nuxt/Kit major.
- Browser plugins executed during server module initialization.
