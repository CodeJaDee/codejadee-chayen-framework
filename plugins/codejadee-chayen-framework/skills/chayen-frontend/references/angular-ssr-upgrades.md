---
kind: technology
---
# Angular server rendering and controlled upgrades

## Check the repository first

Read `angular.md`. Inspect browser/server entries, SSR packages, hydration
providers, build targets, runtime versions, lockfile, CI, and third-party
peer dependencies. Do not infer SSR from Angular alone.

## Server render and client reuse (angular-ssr-hydration)

**Applies when:** An Angular application already uses SSR or explicitly requests compatible SSR and hydration behavior.

**Not when:** A browser-only SPA needs a small UI fix; keep its current rendering model instead.

**Version notes:** Check Angular Universal versus @angular/ssr setup and installed hydration APIs. Event replay, incremental hydration, and zoneless integration vary by release; do not apply modern defaults to an older app.

**Steps:**

1. Trace server rendering, browser bootstrap, shared providers, and hydration configuration. Match the existing standalone or NgModule setup; identify request-scoped state and any browser-only libraries before changing providers.
2. Keep initial server and client markup deterministic. Avoid timestamps, random ids, invalid HTML, and direct DOM mutation before hydration; preserve Angular's required comments and whitespace through the serving path.
3. Keep window, localStorage, and browser widgets behind supported platform or render boundaries. Never serialize server secrets or personalized shared cache state into HTML, transfer state, environment files, client bundles, or logs.
4. Exercise server render without browser globals, then hydrate in a real browser. Check mismatch errors, node reuse, request isolation, duplicated data requests, early interaction where event replay is configured, and navigation. Use a narrowly justified hydration opt-out only with documented consequences.

**Verify:** Report PASS, FAIL, or NOT_RUN separately for server render, browser hydration, and request isolation with commands; an SSR string test alone cannot prove hydration.

## Requested upgrades (angular-upgrade-migration)

**Applies when:** The user requests an Angular upgrade or a specific compatible migration with defined scope.

**Not when:** Only planning migration options without edits; use architecture migration planning instead.

**Version notes:** Consult the official version compatibility table and update guide for the exact source/target releases. Check Node, TypeScript, RxJS, CLI, builder, and library peer ranges together; do not install the newest TypeScript independently.

**Steps:**

1. Record current resolved versions, target version, lockfile owner, CI/runtime versions, builders, and baseline failures. Resolve conflicting package-manager evidence before modifying dependencies or selecting migration commands.
2. Define the requested migration boundary and rollback files. Treat standalone, Signals, zoneless, and control-flow conversions as separate choices; do not bundle them into a version upgrade unless compatible and requested.
3. Follow the source-to-target update guide and supported migration order, using the project's manager and CLI. Review each schematic diff for public contracts and library incompatibilities; do not force peer conflicts, delete lockfiles, or suppress template errors.
4. Run the configured production build, test runners, template checks, SSR/hydration checks when present, and representative routes/forms. Record remaining deprecations and blocking peers; retain recoverable package/config history and stop at the approved target rather than advancing further.

**Verify:** Report PASS, FAIL, or NOT_RUN with exact baseline and upgraded commands; include resolved versions and unexecuted browser/platform checks without claiming migration success from install alone.

## Verification commands

Use the repository's server and browser targets. Run migration commands only
for the requested source and target pair; package changes require authorization
under the owning workflow's safety boundaries.

## Pitfalls

- Turning a major upgrade into an unrequested architectural rewrite.
- Suppressing hydration errors with a whole-app skip.
- Importing server credential modules from shared browser code.
