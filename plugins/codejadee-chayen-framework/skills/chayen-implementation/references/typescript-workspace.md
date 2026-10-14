---
kind: technology
---
# Package integrity, workspaces, and compiler configuration

## Check the repository first

Read `typescript-javascript.md`. Inspect the owning workspace's manager,
version pin, CI install command, lockfile, tsconfig graph, project scripts,
exports, and configured build/test orchestrator.

## Reproducible dependency operations (package-manager-integrity)

**Applies when:** JavaScript/TypeScript installs, lockfiles, package-manager selection, or dependency edits need a reproducible change.

**Not when:** Performing a vulnerability audit only; use dependency security review instead.

**Version notes:** Yarn Classic frozen-lockfile differs from modern Yarn immutable. Bun can use text bun.lock or older binary bun.lockb. Use the repository's pinned manager and version, not whichever global binary is newest.

**Steps:**

1. Compare packageManager, the owning lockfile, workspace config, documented commands, and CI. Identify npm, pnpm, Yarn, or Bun from consistent evidence; multiple unexplained lockfiles require clarification rather than automatic deletion or selection.
2. Use the configured manager for the smallest authorized dependency operation. Preserve workspace ownership and pins; never regenerate another manager's lockfile, bypass integrity checks, or force incompatible peer ranges.
3. Review manifest and lock diffs for expected versions, resolved sources, unexpected transitive churn, and lifecycle scripts. Avoid printing registry credentials or auth config; follow repository policies for scripts and private registry access.
4. Run the configured frozen or immutable CI install in an isolated permitted environment, then build and test the affected packages. Check a stale manifest/lock mismatch fails as expected and record missing registry access without weakening lock consistency.

**Verify:** Report PASS, FAIL, or NOT_RUN with manager/version and exact install/build/test commands; distinguish unavailable install checks from static lockfile evidence.

## Package boundaries (typescript-monorepo)

**Applies when:** TypeScript workspace packages need dependency, build-order, export, or shared-code changes.

**Not when:** A single-package app needs a local component edit; use its ordinary feature recipe instead.

**Version notes:** Check workspace-manager and Nx/Turbo or other orchestrator versions, TypeScript project-reference support, and existing composite/declaration settings. Do not assume every monorepo uses project references.

**Steps:**

1. Map the affected package, dependents, workspace declarations, public exports, and current build graph. Use the existing manager and orchestrator; avoid a new root tsconfig or workspace tool for one shared function.
2. Put shared code in an existing appropriate owner or justify a genuinely needed package. Declare dependencies explicitly; respect package exports and established browser/server boundaries instead of importing another package's source internals.
3. Align references and declaration output only where the repository already uses them. Remember tsconfig paths do not rewrite emitted runtime imports; ensure the actual bundler/runtime resolves the promised package entrypoint.
4. Build and typecheck affected packages plus their consumers through the configured graph, checking clean and incremental behavior where relevant. Test an invalid internal import or missing declared dependency; report untested dependents and avoid claiming the whole workspace passes from one package test.

**Verify:** Report PASS, FAIL, or NOT_RUN with affected-graph commands and consumer results; name which package boundaries and artifacts were exercised.

## Effective compiler settings (typescript-config-review)

**Applies when:** TypeScript configuration needs review or correction for a specific compiler, runtime, or template-checking problem.

**Not when:** Converting a JavaScript repository to TypeScript without a request; preserve its current toolchain instead.

**Version notes:** Inspect installed compiler support for each option and use its showConfig output. Angular compilerOptions and angularCompilerOptions have separate responsibilities; match Angular's supported TypeScript range.

**Steps:**

1. Trace extends, include/exclude/files, project references, and each consumer config. Capture effective settings through the project's compiler or configured inspection command; distinguish browser, server, library, and test requirements.
2. Evaluate strict flags, target/lib, module/moduleResolution, noEmit, declarations, JSX, and path aliases against the actual problem. For Angular inspect strictTemplates separately and preserve builder-supported emit settings.
3. Change only the smallest setting justified by evidence. Do not silence template diagnostics with skipLibCheck or weaken strictness broadly; option changes can alter exported declarations and must be reviewed for consumer compatibility.
4. Run configured typecheck, build, tests, and relevant consumer compilation. Use a failing fixture that demonstrates the original diagnostic and a clean valid case; confirm runtime resolution as well when module settings change, since compiler success alone is insufficient.

**Verify:** Report PASS, FAIL, or NOT_RUN with effective-setting evidence and compiler/build commands; distinguish intentional diagnostics from unexpected failures and list public declaration effects.

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": { "noEmit": true },
  "include": ["src/**/*.ts"]
}
```

This is an illustration for an existing typecheck-only package, not a root
config replacement. Keep the project's own paths and inherited settings.

## Verification commands

Use the pinned manager, existing workspace graph, and compiler. Run immutable
installs only when permitted and needed; do not install a new toolchain to
obtain a green check.

## Pitfalls

- Deleting lockfiles to resolve conflicting manager evidence.
- Mistaking tsconfig paths for runtime package aliases.
- Weakening strictTemplates to hide a component binding error.
