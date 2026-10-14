---
kind: recipe
capabilities: [CAP-05-009, CAP-05-010]
---
# Configuration changes and feature flags

Add or change application settings through the project's existing
configuration pattern, with safe defaults, per-environment values, and
startup validation. Put new or risky behaviour behind a feature flag that
uses the existing flag mechanism, tests both states, and has an owner and a
removal plan.

## Inputs

- The setting or behaviour to control, its type, its default, and the
  environments affected.
- The existing configuration pattern: options classes, configuration
  modules, environment variables, and settings files per environment.
- The existing flag mechanism, if any: a flag library or service,
  configuration-based flags, or none.

## Procedure

1. **Find the pattern.** Locate how the analogous setting or flag is defined,
   bound, validated, and read. Use the same approach, file, and naming.
2. **Configuration change.**
   1. Add the key with a safe default, or fail fast at startup when no
      default is safe.
   2. Bind it through the project's mechanism, and validate it at startup.
   3. Document the per-environment values, or the instructions for
      setting them.
   4. Secrets never go in settings files. Reference the project's secret
      source instead.
3. **Feature flag.**
   1. Define the flag with the existing mechanism. Name it for the
      behaviour, give it an owner, and default it to off for new behaviour.
   2. Guard at one decision point where possible, not scattered checks.
   3. Keep both code paths working and tested.
   4. Note how the flag is turned on per environment or cohort, and how it
      will be removed once fully released.
4. **No new mechanism unasked.** If the project has no flag system, propose
   the smallest option (a configuration-based boolean), or a library choice
   for approval.
5. **Tests.**
   - Configuration: binding and validation tests, and the startup failure
     for an invalid value.
   - Flags: one test with the flag on and one with it off.
6. **Production configuration** changes are risky actions. Describe them,
   and do not apply them.

## Outputs

- A configuration key bound through the existing pattern, with a default or
  a fail-fast validation, and the per-environment values documented without
  secrets.
- A flag defined with the existing mechanism, with an owner, a default, the
  guarded code, and a removal note.
- Tests for binding or validation, and for both flag states.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | `IOptions<T>` with `ValidateDataAnnotations()` and `ValidateOnStart()`. `appsettings.{Environment}.json` and environment variables (`Section__Key`). User secrets for local development. Flags through `Microsoft.FeatureManagement` if used, or OpenFeature. |
| Angular | `environment*.ts` and file replacements are fixed at build time. For runtime configuration, use a JSON file loaded with `APP_INITIALIZER` (or `provideAppInitializer`). Never put secrets in client builds. |
| React / Vite / Next.js / Vue / Nuxt | `VITE_` and `NEXT_PUBLIC_` variables are public and baked in at build time. Nuxt `runtimeConfig` versus `public` matters. Flags come through the project's SDK (OpenFeature or a vendor SDK). |
| Nitro / Elysia / Node | Nitro `runtimeConfig` with `NITRO_` environment overrides. Validate the environment at startup (Zod, TypeBox). |
| Python | pydantic `BaseSettings` or Django settings modules split per environment. Validate at import or startup. |

## Verification

- The new setting has a default, or fails startup with a clear message. A
  test covers its binding or validation.
- Both flag states are tested and pass. The default for new behaviour is
  off.
- No secret value appears in any committed file, client bundle variable, or
  summary.
- No new configuration or flag mechanism was introduced without approval.
