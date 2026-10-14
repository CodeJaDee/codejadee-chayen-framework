---
kind: technology
---
# EF Core migrations

Stack detail for schema migrations in .NET projects that manage their schema
with EF Core migrations. Use it with the migration recipe
([schema-and-data-migration.md](schema-and-data-migration.md)) and the
engine reference. Many .NET projects do not use EF Core migrations: confirm
before using any command here.

## Check the repository first

| Area | What to look for |
|---|---|
| Is EF Core the migration tool? | A `Migrations/` folder with `*ModelSnapshot.cs`, `Microsoft.EntityFrameworkCore.Design` in a project, `dotnet-ef` in `.config/dotnet-tools.json`. Without these, EF Core is not managing the schema. |
| Other tools | DbUp, FluentMigrator, Grate, SSDT (`.sqlproj`, `sqlpackage`), Flyway, Liquibase, or hand-written SQL scripts. If one is used, use it, and do not add EF Core migrations. |
| Database-first | A scaffolded model (`dotnet ef dbcontext scaffold`, EF Core Power Tools): the schema changes in the database tool, then the model is re-scaffolded. |
| Projects | Which project holds the `DbContext` and migrations, which is the startup project, and whether there are several contexts |
| Versions | The EF Core package version and the `dotnet-ef` tool version; keep the tool on the same major version |
| Deployment | How migrations reach shared databases: SQL scripts in the pipeline, a migration bundle, `Database.Migrate()` at startup, or a DBA |

## EF Core migrations (aspnet-efcore-migrations)

**Applies when:** a .NET project manages its schema with EF Core
migrations and a model change needs a migration, or an existing migration
must be reviewed, scripted, fixed, or removed.

**Not when:** the project uses Dapper, ADO.NET, DbUp, FluentMigrator, SSDT,
Flyway, or another tool for schema changes, or the model is scaffolded from
the database; use that tool through the migration recipe. Query tuning and
data modeling have their own recipes.

**Version notes:** `dotnet ef migrations has-pending-model-changes` needs EF
Core 8. EF Core 9 and later fail `Migrate()` when the model has changes
with no migration, and take a lock against concurrent `Migrate()` calls;
earlier versions do neither. Migration bundles need EF Core 6. SQL in
`migrationBuilder.Sql` is specific to the database provider.

**Steps:**

1. Confirm EF Core migrations manage this schema (table above). If not,
   stop and use the project's tool.
2. Restore the tools (`dotnet tool restore` when a local manifest exists)
   and check `dotnet ef --version` against the EF Core package version; an
   older tool prints a warning.
3. Add the migration from the right projects, following the project's
   naming:
   `dotnet ef migrations add <Name> --project <DataProject> --startup-project <ApiProject> --context <Context>`.
   This builds the projects and does not contact the database.
4. Review the generated `Up`, `Down`, and snapshot diff line by line:
   - A plain property rename is usually scaffolded as `RenameColumn`, but a
     rename combined with a type change becomes `DropColumn` plus
     `AddColumn`, which loses data. EF Core prints "An operation was
     scaffolded that may result in the loss of data" for these; rewrite
     them as a rename plus `AlterColumn`, or as an expand-and-contract
     sequence.
   - A new non-nullable column on a table with rows needs a default or a
     backfill step.
   - Enabling nullable reference types can turn `string` columns into
     `NOT NULL` in the next migration.
   - Index creation on large tables may need engine-specific online options
     through `migrationBuilder.Sql`.
5. Put data steps in the migration only when they are small and safe;
   larger backfills follow the recipe's batched backfill procedure.
6. Check that the model and migrations agree:
   `dotnet ef migrations has-pending-model-changes` (EF Core 8+) exits
   non-zero when a migration is missing.
7. Produce reviewable SQL for every environment except local:
   `dotnet ef migrations script <FromMigration> <ToMigration> --idempotent -o migrate.sql`,
   or a bundle (`dotnet ef migrations bundle`) if the project deploys that
   way.
8. Apply only to a local or disposable database
   (`dotnet ef database update`), then test rolling back to the previous
   migration and re-applying. Applying to any shared database needs explicit
   approval and the database safety checklist.
9. Never edit or delete a migration that has been applied to a shared
   environment; add a new one. Remove only the latest unapplied migration
   with `dotnet ef migrations remove`. After a merge conflict in the
   snapshot, remove and re-add the latest local migration.

**Verify:** the migration was created by the tool, its `Up` and `Down` were
reviewed (data-loss operations named or none), `has-pending-model-changes`
exits 0, the idempotent script was generated, and apply, rollback, and
re-apply passed on a local database; report each as PASS, FAIL, or NOT_RUN
with the command.

## Commands

```bash
dotnet tool restore                                        # when .config/dotnet-tools.json exists
dotnet ef migrations list --project <DataProject> --startup-project <ApiProject>
dotnet ef migrations add <Name> --project <DataProject> --startup-project <ApiProject>
dotnet ef migrations has-pending-model-changes             # EF Core 8+
dotnet ef migrations script <From> <To> --idempotent -o migrate.sql
dotnet ef database update <Migration>                      # local or disposable databases only
dotnet ef migrations remove                                # latest migration, only if never applied to a shared database
```

## Pitfalls

- **Adding EF Core migrations to a project that uses another tool,** or to
  a database-first model.
- **Trusting the scaffold:** renames turned into drop and add, missing data
  steps, or defaults that fail on existing rows.
- **`Database.Migrate()` at startup** across several instances, or with an
  application identity that should not have schema rights, unless the
  project already does it deliberately.
- **Editing applied migrations,** which makes environments diverge.
- **A `dotnet-ef` tool older than the runtime,** which can miss newer
  migration features.
