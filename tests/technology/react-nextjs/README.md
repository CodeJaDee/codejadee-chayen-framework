# React/Next.js fact and boundary checks

```text
node tests/technology/react-nextjs/run-fact-checks.mjs --report tests/technology/react-nextjs/results/step22-fact-checks.md
```

Optional `--deps <existing-project/node_modules>` reuses installed React and
ReactDOM for static-markup checks and records installed Next version evidence.
It downloads nothing and does not substitute for the target project's runner.

RF-01..08 and NF-01..08 map all sixteen capabilities. Only available checks
execute; unavailable runner, framework, profiling, cache, production artifact,
or browser fixtures report NOT_RUN. An exit of zero means no executed check
failed, not that every fact ran.

NF-03/04/06 run concrete synthetic entrypoint tests without dependencies:
direct callable mutation, Web Request/Response handler, and loopback HTTP
401/403/400/200/method behavior, wrong tenant, forged owner/role, and revoked
session with no writes on denial. Fixed fixture sessions are intentionally
synthetic; this is not a production session scheme or a compiled Next server.
These tests support the boundary-testing recipe and cannot establish Next
Server Function compilation, real auth-provider integration, or cache behavior.

The report keeps that distinction explicit. Browser interactions, metadata,
hydration, secret-sentinel bundle/RSC checks, and deployment behavior require
a real configured Next app. Static React markup cannot establish focus or
screen-reader behavior. Guidance never claims those checks passed here.

V-23 checks the catalog and positive/negative evaluation specifications.
Behavior and trigger evaluations G-12/G-11 must run before any capability is
VERIFIED. This runner neither runs those evaluations nor installs packages.
