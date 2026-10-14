---
kind: recipe
capabilities: [CAP-05-003, CAP-15-002]
---
# Behaviour-preserving refactoring

Restructure code without changing what it does. Protect the behaviour with
tests first, change in small verified steps, and keep the public surface
stable unless a change to it is agreed. A refactor never carries a feature or
a bug fix. A large refactor is planned first as a sequence of small,
independently releasable steps, each with its own safety net, checkpoint, and
rollback.

## Inputs

- The target code, and the structural goal (remove duplication, extract a
  class, split a module, or simplify a conditional).
- The existing tests for that code, and the baseline result.
- The public surface that must stay stable: public methods, routes, events,
  serialized shapes, and database mappings.
- For a large refactor: the target structure, release cadence and freeze
  windows, and who reviews each step.

## Procedure

### Single refactor (CAP-05-003)

1. **State the invariant:** "observable behaviour X stays identical". List
   the public surface that must not change.
2. **Check the safety net.**
   - If tests do not cover the behaviour being moved, add characterization
     tests first. They capture the current outputs, including odd ones.
   - Commit or separate this step conceptually, so it is clear that tests
     came before the change.
3. **Choose small, mechanical steps:** extract method, move, rename (through
   compiler-checked or IDE refactoring where possible), inline, or replace a
   conditional with polymorphism. Order them so that each step compiles and
   passes the tests.
4. **Run after each step:** the build or typecheck, and the affected tests.
   If a test breaks, undo the step instead of patching around it.
5. **Do not mix in behaviour changes.**
   - A bug found during the refactor is reported, and fixed separately.
   - An observable change needed by the new structure is raised for
     approval.
6. **Verify the equivalence.**
   - The same test results as the baseline.
   - Public signatures, routes, and serialized shapes unchanged.
   - Dependency-injection registrations still resolve.
7. **Report** the structural goal achieved, the steps taken, the tests
   added, and the before and after results.

### Large refactor plan (CAP-15-002)

1. **Describe the current and target structure,** and list the public
   surfaces each part of the move touches.
2. **Map the safety net per area:** existing tests and their coverage of
   the code that moves, and the characterization tests to add first
   (approval or golden-master tests for legacy output, contract tests for
   APIs). Where tests are not feasible, say so and make those steps smaller.
3. **Slice into steps** that are each behaviour-preserving and releasable on
   their own: parallel change (expand, migrate callers, contract), branch
   by abstraction, or a flag that switches between old and new
   implementations.
4. **For each step,** give the goal, the files or modules, the tests to add
   before it, the checkpoint (build and tests green, key metrics
   unchanged), the rollback (revert the step), and a size class (S, M, L).
5. **Order the steps** to reduce risk: safety net first, mechanical moves
   next, behaviour-sensitive moves last. Avoid long-lived branches: each
   step merges on its own.
6. **Ask for approval of the plan,** then execute one step at a time with
   the single refactor procedure above.

## Outputs

- Refactored code, with any characterization tests added before the change.
- Before and after test results showing no behaviour change, plus
  confirmation that the public surface is unchanged.
- The bugs or smells noticed, listed as follow-ups.
- For a large refactor: a step plan with the safety net (tests to add
  first), checkpoint, and rollback per step.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | Rely on the compiler and analyzers. Reflection, dependency-injection scanning, `nameof`, and serializer attributes can break silently, so search for string usages. Keep `[JsonPropertyName]` and EF Core mappings stable. |
| TypeScript (Angular, React, Vue, Next.js, Nuxt, Node) | `tsc --noEmit` catches most moves. Template references (Angular HTML, Vue SFC templates), barrel exports, and path aliases need a search. Nuxt auto-imports hide usages. |
| Python | Dynamic typing gives weak compiler support. Rely on tests, plus `mypy` or `pyright` if configured. Search for string-based imports, Django settings, and `getattr` usage. |
| SQL Server / PostgreSQL | Renaming database objects is a schema migration, not a refactor. It needs the expand and contract approach and approval. |

## Verification

- Tests covering the moved behaviour existed or were added before the change.
- The test results equal the baseline, with the same counts and no new
  skips.
- Public signatures, routes, and serialized shapes are unchanged (checked by
  build, contract or OpenAPI diff, or tests).
- The diff contains no behaviour change. Any found bugs are listed as
  follow-ups.
- In a large refactor plan, each step leaves the fixture build green when
  executed, and characterization tests come before risky moves.
