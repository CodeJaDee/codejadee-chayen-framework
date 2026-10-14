---
kind: technology
---
# Evidenced Vite configuration, builds, and env safety

## Check the repository first

Confirm actual Vite usage from resolved dependency, scripts, selected builder,
plugins, and vite.config or framework-owned configuration. A Vue app can use
webpack/Vue CLI; Nuxt can select a different builder; Vite need not use Vue.
Inspect Vite/plugin/runtime versions, manager/lockfile/CI, root/base/modes,
aliases, envPrefix/define, build options, and configured tests.

## Configuration ownership (vite-configuration)

**Applies when:** An evidenced Vite app/build needs configuration, plugin, alias, root, base, or dev-server changes.

**Not when:** The project uses webpack/Vue CLI or another selected builder; follow that existing toolchain instead.

**Version notes:** Vite major and plugin versions affect runtime minimums, config loading, and build API. In Nuxt use its owning nuxt.config vite options/hooks when that is the selected builder; do not assume a standalone vite.config is consumed.

**Steps:**

1. Establish whether Vite actually owns the affected build and find its configured root, plugins, mode, base, and existing commands. Match framework-owned configuration instead of adding a second file that the framework ignores.
2. Change the smallest supported option or installed plugin setting. Preserve alias and filesystem resolution across compiler, runtime, and tests; do not introduce plugins, switch builders, or widen dev-server filesystem/host access speculatively.
3. Resolve config-time versus app env reads deliberately, using supported loadEnv when required and only explicit public settings. Keep backend credentials out of define replacements and browser graphs; dev proxies are not authorization or production routing automatically.
4. Run configured dev/build/test or typecheck paths and exercise the actual alias, asset base, proxy, or plugin behavior. Test missing paths and unintended exposure; record version/config evidence and do not infer production success from a dev-server check alone.

**Verify:** Report PASS, FAIL, or NOT_RUN with configured commands and resolution/asset checks; finding a config file alone does not prove it owns the selected build.

## Measured build changes (vite-build-optimization)

**Applies when:** An evidenced Vite production build has measured bundle, chunk, build-time, or loading cost requiring a scoped change.

**Not when:** Only fixing Vue reactive render work; use Vue performance guidance instead.

**Version notes:** Vite majors use different bundler/configuration APIs, including Rollup versus newer Rolldown settings. Inspect installed support and framework integration before adding chunk or minifier options; do not copy old recipes blindly.

**Steps:**

1. Capture the configured production build's timing, emitted chunks, sizes, target/base, and representative loading waterfall. Keep comparison inputs stable and distinguish dependency prebundling in dev from production optimization.
2. Identify actual cost from eager imports, duplicate dependencies, unsupported target transformations, or chunk/loading strategy. Prefer a proven dynamic import or dependency correction consistent with current routes and module ownership.
3. Apply only supported build options and existing analysis tools. Manual chunking, minification, preload, or asset changes must preserve module side effects, loading order, cache behavior, and runtime support; avoid adding an analyzer dependency merely to produce a chart.
4. Repeat the same build and production loading checks, recording before/after artifacts and timing. Test route loading, errors, source maps, SSR output where present, and affected browser targets; reject smaller bundles that break execution or required diagnostics.

**Verify:** Report MEASURED, PASS, FAIL, or NOT_RUN with comparable build/runtime evidence; faster dev startup is not a production bundle improvement.

## Build-time environment exposure (vite-environment-safety)

**Applies when:** Vite env prefixes, modes, define replacements, or client/server env usage need privacy or correctness changes.

**Not when:** Nuxt private runtime overrides are the actual issue; use Nuxt runtime-config guidance instead.

**Version notes:** Inspect installed Vite envPrefix/loadEnv behavior and any plugin/framework transformations. Client import.meta.env values are build-time public replacements; .env files and custom prefixes do not make exposed values secret.

**Steps:**

1. Inventory env sources and consumers by key name/location without printing values. Check modes, envPrefix, define, plugins, server imports, and generated output; distinguish public build settings from privileged runtime credentials.
2. Expose only intended public values through existing prefix or explicit definitions. Never broaden envPrefix to all values or spread process.env/loadEnv output into define/client code; keep privileged operations in the existing server boundary.
3. Preserve current mode precedence and compile-time types, remembering values commonly arrive as strings. Parse public flags deliberately and do not treat import.meta.env.PROD or .env.production as an authentication control or runtime secret channel.
4. Build with synthetic private/public sentinels and inspect client chunks, source maps, HTML, and framework payloads. Test expected public replacement and private absence plus supported mode behavior; report actual production runtime-env checks separately where the application has a server.

**Verify:** Report PASS, FAIL, or NOT_RUN with configured mode/build/artifact commands; a hand-written env filter test does not establish Vite or plugin bundle secrecy.

```ts
// Only public client configuration, with explicit string interpretation:
const showHelp = import.meta.env.VITE_SHOW_HELP === 'true'
```

## Commands and verification

Use the evidenced builder, manager, scripts, and installed Vite/plugins.
Run separate configured typecheck/lint where needed; Vite transpilation is not
a TypeScript semantic check. Missing toolchain/artifact means NOT_RUN.

## Pitfalls

- Adding Vite to every Vue or Nuxt project by assumption.
- Applying a standalone config outside the owning framework's configuration.
- Browser env exposure through define even when a key lacks VITE_ prefix.
