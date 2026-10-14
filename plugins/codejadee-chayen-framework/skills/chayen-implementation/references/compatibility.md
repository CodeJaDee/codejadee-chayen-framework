---
kind: recipe
capabilities: [CAP-05-012]
---
# Compatibility-preserving changes

Change something that others depend on (a public API, an event, a database
schema, a shared library, configuration keys) without breaking its existing
consumers. Use additive changes, tolerant readers, adapters, and deprecation
windows, and prove compatibility with the consumers' existing tests or
contract checks.

## Inputs

- The change, and the artifact it touches: an endpoint, DTO, event or
  message, table or column, a library's public API, or configuration keys.
- The known consumers (from code, contract tests, client generation,
  published package metadata), and the compatibility guarantees (semver,
  API versioning policy, support windows).
- The unknown consumers. They are a risk, never assumed absent.

## Procedure

1. **List the consumers.**
   - Search for usages in the repository.
   - Check the contract tests, generated clients, and package dependents.
   - Mark external consumers `unknown` unless documented.
2. **Classify the change.**
   - **Additive:** a new optional field, a new endpoint, a new event type.
     Usually safe.
   - **Behavioural:** a changed default, ordering, or validation. Safe only
     if the consumers tolerate it.
   - **Breaking:** a removed or renamed member, a type change, a required
     new field, a semantic change.
3. **Prefer the additive path.**
   - Add the new member alongside the old one.
   - Make new inputs optional with a default.
   - Keep accepting the old shape (tolerant reader).
   - Map old to new in one adapter.
4. **For an unavoidable break:**
   - Version it, following the project's API versioning or package semver.
   - Or run a deprecation window: mark the old member `[Obsolete]` or
     `@deprecated`, add a `Deprecation` or `Sunset` header for HTTP, and
     record the removal date and owner.

   Breaking a public contract is a risky action: get approval.
5. **Data and events.**
   - Schema changes follow expand, migrate, then contract.
   - Event contracts are versioned or extended additively. Consumers ignore
     unknown fields.
   - Never repurpose a field's meaning.
6. **Prove it.**
   - The existing consumer tests and contract tests pass unchanged.
   - Add a test that the old request or message shape still works.
   - For libraries, check the public API before and after where tooling
     exists.

## Outputs

- A compatibility analysis: the consumers (known and unknown) and the change
  classification.
- The backward-compatible implementation (additive, tolerant, or adapter),
  or a versioned or deprecated break with its approval.
- Proof: the unchanged consumer tests passing, plus a new old-shape test.
  Deprecation notes with removal criteria where relevant.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | `[Obsolete("...", DiagnosticId=...)]`. `Microsoft.DotNet.ApiCompat` or package validation (`EnablePackageValidation`) for libraries. `System.Text.Json` ignores unknown members by default, but required members (`required`, `[JsonRequired]`) break old payloads. |
| TypeScript / JavaScript | `@deprecated` JSDoc. Optional properties for additions. Exported type changes break consumers at compile time, and `api-extractor` can report them. Semver-major for breaking package changes. |
| Angular / React / Vue / Next.js / Nuxt | Component input and prop renames break templates. Keep the old prop as an alias with a deprecation warning. |
| Python | `warnings.warn(..., DeprecationWarning)`. Keyword-only parameters with defaults for additions. Pydantic models: `extra="ignore"` for tolerant readers. |
| SQL Server / PostgreSQL | Expand, migrate, then contract. Views or synonyms can keep old names working during a transition. Never drop a column in the release that stops writing it. |

## Verification

- The existing consumer and contract tests pass without modification.
- A test proves the old shape or call still works.
- Every breaking element is versioned or deprecated, with approval and a
  removal plan. Unknown consumers are listed as a risk.
- No consumer-visible change ships unlisted in the change summary.
