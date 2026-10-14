---
kind: recipe
capabilities: [CAP-10-011]
---
# Test data builders and factories

Replace repeated, noisy test setup with reusable builders, factories, or
fixtures that have valid minimal defaults, so each test states only the
data that matters to it, stays independent, and remains deterministic.

## Inputs

- The tests with repeated setup, and the entities they build.
- Existing helpers: builders, object mothers, factories, `conftest.py`
  fixtures, seed scripts.
- The libraries already referenced (Bogus, AutoFixture, factory_boy,
  fishery, `@faker-js/faker`), if any.

## Procedure

1. **Measure the repetition:** list the setup blocks repeated across tests,
   with the lines per test, and the entities involved.
2. **Follow the existing pattern** if one exists. Otherwise choose with the
   codebase's style:
   - a **builder** with fluent `With...` methods and valid defaults (.NET,
     TypeScript);
   - a **factory** (factory_boy, fishery) with sequences and sub-factories;
   - **fixtures** for shared, read-only setup.

   Add a library only with approval. Hand-written builders are fine.
3. **Make defaults valid and minimal:** every required field set, and
   relationships created only when needed. A test overrides only the fields
   it asserts on.
4. **Keep data deterministic:** fixed seeds for any fake-data generator,
   sequences for unique values (emails, SKUs) so unique constraints hold,
   and no random values in assertions.
5. **Persist through one helper** for integration tests, so cleanup and
   isolation work the same way everywhere.
6. **Use synthetic data only.** No production data, real names, or real
   contact details. Masking production data is a privacy task, not this
   recipe.
7. **Refactor tests in small steps,** running the suite after each step.
   The test count and results must stay the same.
8. **Report** setup lines per test before and after, and the test results.

## Outputs

- Builders, factories, or fixtures following the existing helper
  conventions.
- Refactored tests that use them, with the same test count and results.
- A before and after count of setup lines per test.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | Hand-written builders or an object mother. Bogus with `Randomizer.Seed` fixed, or AutoFixture with customizations, if referenced. Keep builders in the test project's shared folder. |
| JavaScript and TypeScript | Factory functions with partial overrides (`build({ ...defaults, ...overrides })`), fishery, or `@faker-js/faker` with `faker.seed(...)`, if present. |
| Python | factory_boy factories (`Sequence`, `SubFactory`, `LazyAttribute`), pytest fixtures in `conftest.py`, and `faker` seeded through factory_boy. Django factories with `DjangoModelFactory`. |
| Databases | Insert through the same helper the tests use for cleanup. Respect constraints so tests fail when the schema does. |

## Verification

- The test count and the results per status are unchanged after the
  refactor, with the command shown.
- Setup lines per test go down, with before and after numbers.
- No production or real personal data appears in builders or fixtures, and
  fake-data generators are seeded.
