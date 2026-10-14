---
kind: recipe
capabilities: [CAP-05-001, CAP-05-004]
---
# Feature delivery and safe edits

Deliver a feature across layers by following the closest existing feature,
keeping the build green, and proving the result with the project's own
toolchain. The same discipline applies to a precise small edit: the smallest
correct diff, with nothing unrelated touched.

## Inputs

- The goal and acceptance criteria, or the precise edit and its scope.
- The repository:
  - stack and versions;
  - package manager (from the lock file);
  - build, test, lint, and typecheck commands, from CI files or scripts;
  - formatter configuration.
- The closest analogous feature, and any accepted ADRs that constrain the
  change.

## Procedure

1. **Find the analogous feature.**
   - Search for one with the same shape: a list with paging, a command with
     validation, a file export, a form posting to an API.
   - Trace its files through every layer. That path is the template.
2. **Baseline.** Build and run the affected tests before editing, when
   permitted. Record the results and any pre-existing failures.
3. **Contract and plan.**
   - For three or more files, or any risky action, write the task contract.
   - List the files per layer, in edit order: data model and migration,
     then domain or service, then API, then UI, then tests.
4. **Implement layer by layer.** After each layer, build or typecheck.
   - Mirror the analogous feature's DTOs, validation, error shape, logging,
     and dependency-injection registration.
   - Reuse existing helpers instead of writing new ones.
5. **Safe-edit rules** (they apply to every change):
   - change only the lines the task needs;
   - no renames, reordering, or reformatting of untouched code;
   - keep the file's existing style, even where the formatter would differ,
     unless the project formats on commit;
   - no new dependency without approval.
6. **Tests.** Add tests at the levels the analogous feature has (unit,
   integration, component, end to end). Cover each acceptance criterion.
7. **Verify** with the project's commands. Compare with the baseline. Check
   the scope with `git diff --stat`: every touched file must be justified by
   the plan.
8. **Report** with the change summary. List the unrelated issues you noticed
   as follow-ups.

## Outputs

- Code changes, layer by layer, that mirror the analogous feature, with new
  or extended tests mapped to the acceptance criteria.
- The verification table (build, tests, lint and typecheck as configured),
  compared with the baseline.
- A change summary listing every touched file with its reason, and any
  follow-ups noticed but not done.

## Technology considerations

| Stack | Toolchain to detect and use |
|---|---|
| .NET | `dotnet build` and `dotnet test` on the solution or project that CI uses. `dotnet format --verify-no-changes` only if CI runs it. Respect `Directory.Build.props` analyzers and `TreatWarningsAsErrors`. |
| Angular | `ng build`, `ng test --watch=false`, and `ng lint`, or the `package.json` scripts that wrap them. Respect the strict mode set in `tsconfig`. |
| React / Next.js / Vue / Nuxt / Vite | Run the `package.json` scripts with the package manager the lock file shows (`npm`, `pnpm`, `yarn`, `bun`). Typecheck with `tsc --noEmit`, `vue-tsc --noEmit`, or `nuxi typecheck` where configured. |
| Nitro / Elysia | The project scripts. `bun test` for Bun projects. |
| Python | `pytest` with the project's configuration, plus `ruff`, `mypy`, or `pyright` only where configured. Use the project's environment manager (`uv run`, `poetry run`). |
| SQL Server / PostgreSQL | Generate migrations with the project's tool (EF Core, Alembic, Prisma, Flyway). Applying one to a shared database needs approval. |

## Verification

- Every acceptance criterion maps to a test or a stated manual check.
- Build, tests, and the configured lint and typecheck pass, or are reported
  FAIL or NOT_RUN with the exact command. The results are compared with the
  baseline.
- `git diff --stat` shows only the files in the plan, with no
  whitespace-only or unrelated hunks.
- No dependency was added, removed, or replaced without approval.
