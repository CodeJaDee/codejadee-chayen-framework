---
kind: recipe
capabilities: [CAP-15-006, CAP-15-007]
---
# Dead code and deprecation

Find code that is never executed or referenced, with evidence and a
confidence level that accounts for reflection and dynamic use, and remove
only what is proven safe, behind green builds and tests. Retire public APIs,
features, or libraries through a deprecation plan: announce, mark, measure
remaining usage, provide a migration path, and remove on a set date.

## Inputs

- The scope (project, module, front end, API surface) and what counts as
  public (published packages, external API consumers).
- Usage data if available: telemetry, logs, endpoint metrics, feature-flag
  evaluation counts.
- For deprecation: the item to retire, its consumers, the replacement, and
  the desired timeline.

## Procedure

### Dead code (CAP-15-006)

1. **Find candidates** with the stack's tools and searches: unused classes
   and members, unreferenced exports and files, endpoints with no callers,
   feature flags fully rolled out or never enabled, unused CSS selectors and
   assets.
2. **Check dynamic use** before believing a candidate: reflection,
   dependency-injection scanning, serializers, route attributes, string-based
   imports, templates, configuration files, and public package consumers.
3. **Assign confidence:**
   - **static only:** no reference found, but dynamic use is possible;
   - **telemetry confirmed:** no calls in usage data over an agreed period;
   - **dynamic use found:** not dead, remove from the list.
4. **Remove high-confidence items** in small commits, each followed by the
   build and the tests. Keep removals separate from other changes.
5. **Report** the remaining candidates with their evidence and what would
   confirm them (telemetry, a log line, a deprecation period).

### Deprecation (CAP-15-007)

1. **Define the replacement and the migration path,** with an example of
   moving a caller from the old to the new.
2. **Mark the item** with the language-native marker and a pointer to the
   replacement, and for HTTP APIs with `Deprecation` and `Sunset` headers
   and documentation notes.
3. **Measure remaining usage** with logs, metrics, or package download
   data, and set removal criteria (for example no calls for 30 days, or a
   date announced in advance).
4. **Communicate** in release notes and to known consumers, with the
   timeline.
5. **Remove on the set date** once the criteria are met, as a breaking
   change with the version bump the project's versioning requires, and
   with approval.

## Outputs

- A dead-code candidate list with evidence and confidence (static only,
  telemetry confirmed), and removal changes for high-confidence items with
  build and test results.
- A deprecation timeline, markers (`[Obsolete]`, `@deprecated`, Sunset
  headers), communication, usage tracking, and removal criteria.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | IDE and analyzer unused-member diagnostics (for example IDE0051, IDE0052), `[Obsolete("Use X instead")]` with a diagnostic ID, reflection and DI scanning, `InternalsVisibleTo`. Public NuGet APIs need a major version for removal. |
| TypeScript (Angular, React, Vue, Node) | `knip` or `ts-prune` if installed, `noUnusedLocals`, JSDoc `@deprecated` (shown as strikethrough in editors), Angular lazy routes and templates, Nuxt auto-imports. |
| Python | `vulture` if installed (with a whitelist for dynamic use), `warnings.warn(..., DeprecationWarning, stacklevel=2)`, `typing_extensions.deprecated` where available, Django URL and template references. |
| HTTP APIs | `Deprecation` and `Sunset` response headers, OpenAPI `deprecated: true`, and per-endpoint usage metrics. |
| CSS and assets | Coverage tools in the browser, but dynamically built class names make static removal risky. |

## Verification

- A seeded unused class in the fixture is found, and a class used only
  through reflection is not proposed for deletion.
- Removals are followed by a passing build and tests, reported with the
  command, or NOT_RUN with the reason.
- Deprecated members in the fixture carry the language-native marker with a
  replacement pointer.
- No public API was removed without approval and a version decision.
