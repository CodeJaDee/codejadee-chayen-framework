---
kind: technology
---
# TypeScript types and API models

## Check the repository first

Read `typescript-javascript.md`. Inspect the effective strict settings,
compiler version, exported types, generated models, runtime decoder, and
nearest tests before changing a type boundary.

## Safe narrowing (typescript-type-safety)

**Applies when:** TypeScript code has unsafe narrowing, null handling, broad any values, or incorrect type contracts.

**Not when:** A plain JavaScript file needs a runtime bug fix only; use its existing JavaScript conventions instead.

**Version notes:** Check the installed compiler and effective strict flags. satisfies needs TypeScript 4.9; newer inference or syntax must compile on the project's supported version rather than the global compiler.

**Steps:**

1. Reproduce the diagnostic or unsafe input path with the configured compiler and existing tests. Trace the value from external input to its consumer; inspect strictNullChecks, unchecked indexing, and optional-property behavior.
2. Narrow unknown input with guards or the project's runtime validator. Preserve explicit null and undefined semantics rather than adding blanket non-null assertions, any, or casts that merely silence the compiler.
3. Model distinct states with an existing discriminated union or precise type when it simplifies an actual requirement. Keep exported compatibility in view; do not globally enable strict flags and absorb unrelated errors without a request.
4. Add valid and invalid input tests plus a compiler-negative assertion where useful. Confirm guards reject malformed nested data and type errors remain errors; record baseline and final diagnostics without suppressing them with broad ignores.

**Verify:** Report PASS, FAIL, or NOT_RUN for configured typecheck and runtime boundary tests, with commands; a clean compile does not prove an external payload is valid.

```ts
function isNamed(value: unknown): value is { name: string } {
  return typeof value === 'object' && value !== null &&
    'name' in value && typeof value.name === 'string';
}
```

Check syntax compatibility; older compilers may need the project's existing
guard idiom. Never use `as Dto` as the malformed-input negative test's fix.

## API representation (typescript-api-modeling)

**Applies when:** TypeScript request/response models, generated client contracts, or domain mappings need implementation or correction.

**Not when:** Designing the server protocol without code changes; use API or architecture planning instead.

**Version notes:** Match the compiler, generator, schema version, and exactOptionalPropertyTypes setting. Date, bigint, optional, and nullable serialization behavior depends on the transport and runtime, not type names alone.

**Steps:**

1. Read the authoritative OpenAPI, GraphQL, JSON schema, or existing server contract and the generated-client command. Identify which types are generated and which mapping code the project owns; do not hand-edit generated artifacts.
2. Preserve absent versus null, string timestamps versus Date instances, numeric precision, and discriminator semantics. Separate wire DTOs from domain values only at an existing or concretely required mapping boundary.
3. Validate untrusted payloads with the existing decoder and map errors through the established error model. Model actual success and failure variants; avoid broad Partial types that allow invalid requests or impossible success states.
4. Test valid, missing, null, malformed, unknown-variant, and serialization round-trip cases. Regenerate through the configured command when needed and compile consumers; ask before breaking exported contracts or introducing a new generator or validator.

**Verify:** Report PASS, FAIL, or NOT_RUN for contract generation, consumer typechecks, and runtime decoding tests with commands; include compatibility effects and precision cases where relevant.

```ts
type SaveResult =
  | { kind: 'saved'; id: string }
  | { kind: 'invalid'; fields: Record<string, string> };
// Decode unknown JSON before treating it as SaveResult.
```

## Verification commands

Use the owning package's typecheck, contract generator, and boundary tests.
Report generated artifacts and public type effects separately from code edits.

## Pitfalls

- Silencing null diagnostics with `!` everywhere.
- Assuming JSON parses ISO strings into Date objects.
- Narrowing only an outer discriminator while trusting nested fields.
