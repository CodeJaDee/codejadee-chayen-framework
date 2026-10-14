---
kind: technology
---
# Shared TypeScript and JavaScript engineering

## Check the repository first

Use this base plus one relevant topic: `typescript-types.md`,
`javascript-runtime.md`, or `typescript-workspace.md`. Keep the task's workflow
in its existing feature, bug, upgrade, concurrency, or compatibility recipe.

1. Read package.json scripts, engines, packageManager, module type, exports,
   workspace configuration, CI, and the resolved TypeScript/tool versions.
   A manifest range is not proof of the installed version.
2. Detect the package manager in the owning workspace. Match packageManager,
   CI, and lockfile evidence: package-lock.json/npm-shrinkwrap.json for npm,
   pnpm-lock.yaml for pnpm, yarn.lock plus Yarn config for Yarn, bun.lock or
   older bun.lockb for Bun. Report conflicts; do not pick one silently.
3. Read the effective tsconfig inheritance and project references, target,
   lib, module/moduleResolution, strict flags, JSX, declaration and emit
   settings. JavaScript-only projects retain their existing JSDoc/checkJs
   approach; do not convert them to TypeScript incidentally.
4. Identify browser, Node, Bun, SSR, worker, or shared-library consumers.
   Check their actual runtimes and bundlers. Server secrets never belong in
   browser imports, public env variables, generated HTML, transfer state,
   client source maps, or bundled code. Check names and paths without printing
   secret values. Keep privileged operations on the server.
5. Find the closest code and tests. Use their error, async, validation,
   state, and package boundaries. Do not introduce a validation framework,
   bundler, store, workspace orchestrator, or new architectural layer.

## Commands and runner selection

| Evidence | Use |
|---|---|
| npm and matching lock | Existing npm run scripts; npm ci for the configured CI install |
| pnpm and matching lock | Existing pnpm scripts; configured frozen-lockfile install |
| Yarn Classic | Existing yarn scripts; configured frozen-lockfile install |
| Yarn modern with .yarnrc.yml or pinned release | Existing yarn scripts; configured immutable install |
| Bun and matching lock | Existing bun run scripts or bun test only where configured; frozen-lockfile install |

Run the project's commands, including Nx/Turbo or custom runners when present.
Do not use a global tsc or download a newer compiler as a substitute for the
project toolchain. A bundler build that strips types may still require a
separate configured typecheck. Installation is not permission to replace a
lockfile or manager. Report PASS, FAIL, or NOT_RUN with exact commands.

## Pitfalls

- Assuming `target` or `lib` supplies runtime polyfills.
- Treating a type assertion as input validation.
- Applying one tsconfig to browser, server, and test consumers indiscriminately.
- Shipping server credentials because an environment variable is available at build time.
