# Angular and shared TypeScript/JavaScript framework facts

Run `node tests/technology/angular-typescript/run-fact-checks.mjs` for the
dependency-free Node facts. Optional arguments reuse existing tools only:

```text
--deps <existing-project/node_modules>
--typescript <existing-typescript/lib/typescript.js>
--npm-cli <existing-npm/bin/npm-cli.js>
--report tests/technology/angular-typescript/results/step21-fact-checks.md
```

Optional Angular pure-API facts target Angular 17+ with matching installed
compiler, core, forms, router, and RxJS packages; they are not a compatibility
matrix for older majors. No Angular production build is claimed.

The runner installs no Angular or TypeScript dependency. An explicit npm CLI
runs offline installs only in a temporary fixture containing local packages,
with lifecycle scripts disabled. No private registry or live API is called.
Temporary fixture deletion checks its exact parent and task-specific prefix.

Facts AF-01..14 map the Angular capabilities; JF-01..08 map shared language
capabilities. Missing tools and browser/SSR/runner/migration fixtures produce
NOT_RUN. Optional Angular facts require compatible installed packages; failures
are reported, never silently treated as skips. Template parsing is not a
production Angular build, and pure signals do not prove DOM notification.

The optional compiler is an isolated fact-test tool, not a substitute for a
target project's pinned compiler. The report states its version. Real projects
must use their configured builds, tests, manager, and Angular-compatible TS range.

The technology cases in `tests/skills/technology-cases.json` are behavior
evaluation specifications, not executed agent tests. V-23 validates all 22
Step 21 mappings, section anatomy, and positive/negative case integrity. Neither
these static checks nor framework facts make a capability VERIFIED; G-11/G-12
remain required.
