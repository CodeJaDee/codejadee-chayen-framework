---
kind: recipe
capabilities: [CAP-13-007]
---
# Environment parity

Find the differences between local, test, staging, and production that
cause "works on my machine" failures (runtime versions, configuration,
data, dependencies, infrastructure), rate their impact, and close the
important gaps with pinned versions, containers, and representative data.

## Inputs

- The failure or the parity goal, and which environments disagree.
- Environment definitions: version files, Dockerfiles, Compose and dev
  container files, CI images, IaC per environment.
- Configuration per environment (settings files, variables, feature flags)
  and how data is seeded.

## Procedure

1. **Build the comparison table** from files, not memory: one row per
   dimension, one column per environment.

   | Dimension | Where to look |
   |---|---|
   | Runtime and SDK versions | `global.json`, `.nvmrc`, `engines`, `.python-version`, base images, CI setup steps, App Service or cluster runtime settings |
   | Dependencies | Lock files honoured or not, OS packages in images |
   | Configuration | Settings files per environment, environment variables, feature flags, connection targets |
   | Backing services | Database engine and version, cache, queue, emulators versus real services |
   | Data | Seed data, volumes, collation, time zone, locale |
   | Infrastructure | CPU architecture, memory limits, network rules, TLS, proxies |
   | Identity | Local developer identity versus managed identity permissions |

2. **Reproduce the failure** where possible: run the failing environment's
   container or configuration locally, or compare logs from both.
3. **Rate each difference** by impact (caused the failure, likely to,
   cosmetic), and mark the cause of the reported failure with evidence.
4. **Close important gaps:** pin versions in one place used by every
   environment, use the same container image locally and in CI, use the
   same database engine (containers or Testcontainers) instead of a
   substitute, and seed representative data.
5. **Keep intended differences explicit** (scale, secrets, external
   endpoints) in configuration, and document them.
6. **Verify:** the previously failing scenario passes in the aligned
   environment, or the remaining difference is named.

## Outputs

- A difference table with an impact rating per row and the cause of the
  reported failure.
- Changes that close the important gaps (containers, version pinning,
  seeded data), and a list of intended differences.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | `global.json` SDK roll-forward, `ASPNETCORE_ENVIRONMENT` selecting settings files, culture and time-zone differences between Windows and Linux (ICU), case-sensitive file paths on Linux. |
| Node and frontends | Node version per `.nvmrc` or `engines`, `npm ci` versus `npm install`, build-time environment variables baked into Angular, React, or Vue bundles. |
| Python | Interpreter version, OS-level libraries for wheels, `uv` or Poetry lock usage, and environment variable loading order. |
| Databases (SQL Server, PostgreSQL) | Engine version, collation and case sensitivity, and SQLite or in-memory substitutes that hide real behaviour. |
| Dev containers and Compose | One definition shared by developers and CI, with the same images as production where practical. |

## Verification

- The seeded runtime version mismatch between the fixture's local and CI
  definitions is found and shown in the table.
- The reported failure is reproduced or its cause is stated with evidence,
  and the scenario passes after alignment, or is NOT_RUN with the reason.
- Changes touch definitions and configuration files only; no environment
  was modified directly.
