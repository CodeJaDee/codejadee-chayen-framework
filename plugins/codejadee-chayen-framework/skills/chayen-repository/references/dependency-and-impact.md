---
kind: recipe
capabilities: [CAP-01-003, CAP-01-004]
---
# Dependencies and change impact

Map internal module dependencies and external package dependencies from
evidence. Then use that map to identify what a proposed change would affect,
and how widely. Every edge and every affected item cites its source. Nothing
is assumed to depend on something without evidence.

## Inputs

- **For dependency mapping:** the module, project, or package of interest,
  and the project references, manifests, and lock files.
- **For impact analysis:** the proposed change, such as a symbol, file,
  endpoint, event, configuration key, table, or column, and what will change
  about it (rename, type, behaviour, removal).
- The `.chayen/` project map, when present: `profile.md` and the owning
  unit file.
- Read access to the repository. Database access only if the user grants it
  for read-only catalog queries.

## Procedure

1. **Start from the project map, when present.**
   - Read `.chayen/profile.md` to find the unit that owns the changed item,
     then read only that unit file in `.chayen/units/`, and the files of
     units it lists as consumers. Do not read every unit file.
   - Check freshness read-only: `git diff --name-only <generated_commit>
     HEAD -- <evidence paths>` and `git status --porcelain -- <evidence
     paths>`. Any output, `generated_commit: none`, or a commit missing
     from local history means the facts may be stale or are unconfirmed.
   - Use the map's dependencies, consumers, dynamic references, and tests as
     leads for the targeted searches below. Confirm every fact you rely on in
     the source; when the two disagree, the source wins, and report that the
     map is stale.
   - Without a map, continue with the targeted searches below. A missing map
     entry never proves that a dependency or consumer is absent.
2. **Declared internal edges.** Read the dependency declarations:
   - .NET: `ProjectReference` in `*.csproj`, or `dotnet list <project>
     reference`;
   - JavaScript and TypeScript: `workspace:` and `file:` dependencies, and
     `tsconfig` path aliases;
   - Python: local packages in `pyproject.toml`.

   Each edge is `found`, with its file.
3. **Code-level edges.**
   - Search the imports, `using`, and `from ... import` statements of the
     target module.
   - If an installed tool exists (dependency-cruiser, madge, pydeps, or the
     .NET build graph), run it read-only and cite its output.
   - Otherwise label the search-based edges `inferred` and say they may be
     incomplete.
4. **External packages.**
   - Direct packages come from the manifests.
   - Transitive packages come from the lock file or a read-only command:
     `dotnet list package --include-transitive`, `npm ls --all`,
     `pnpm why <pkg>`, or `pipdeptree` if installed.
5. **Cycles and layering.**
   - Report cycles in the declared graph.
   - Report references that break the layering stated in instruction files
     or ADRs, or that the folder conventions imply (label those `inferred`).
6. **Impact: find usages of the changed item.** Search for:
   - exact symbol references;
   - string occurrences (reflection, serialization names, `nameof`, route
     templates, configuration keys, SQL text, log queries);
   - generated code;
   - the frontend calls that hit a changed endpoint;
   - the tests that cover it.

   Say which dynamic mechanisms could hide usages, such as reflection,
   dependency-injection scanning, string-built SQL, or message routing.
7. **Impact: walk the graph outward.**
   - Affected callers lead to the projects and packages that reference them,
     then to deployables, then to external consumers.
   - External consumers are `unknown` unless the repository documents them,
     for example in OpenAPI clients, contract tests, or published package
     metadata.
8. **Data impact.**
   - For schema items, find migrations, ORM mappings, views, stored
     procedures, triggers, and reports that mention them.
   - With granted read-only database access, query the catalog:
     `sys.sql_expression_dependencies` (SQL Server), or `pg_depend` and
     `information_schema` (PostgreSQL).
9. **Rate the blast radius:**
   - **Low:** one module, internal only.
   - **Medium:** several modules, or a deployable boundary.
   - **High:** a public contract, persisted data, or unknown external
     consumers.

   Give the reasons and the tests that should run.

## Outputs

- **Dependency map:** a table or Mermaid graph for the requested scope. Each
  edge carries its source and its label (`found` or `inferred`). Cycles and
  layering violations are listed with evidence.
- **Impact table:**

  ```text
  Change: <what changes>
  | Layer | Item | Evidence | Label |
  | Data / API / UI / tests / external | <path or name> | <path:line or command> | found / inferred / unknown |
  Blast radius: <low/medium/high> — <reasons>
  Tests to run: <commands or test names>
  Possible hidden usages: <reflection / strings / config / external>
  Project map: <unit file used; fresh / stale / unconfirmed / absent; facts confirmed in the source>
  ```

- No code is edited. Changes are handed to the implementation skill.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | Check `InternalsVisibleTo`, dependency-injection registration by assembly scanning, and EF Core model configuration (`HasColumnName`, `ToTable`), because these hide usages from symbol search. Central package management lives in `Directory.Packages.props`. |
| Angular | Lazy-loaded routes, injection tokens, and template bindings refer to symbols as strings. Search the templates (`*.html`) as well as the TypeScript. |
| React / Next.js / Vue / Nuxt | File-system routing makes paths into dependencies. Auto-imports (Nuxt) hide import statements. Search by component and composable names. |
| JavaScript / TypeScript | Barrel files (`index.ts`) and path aliases can mask real edges. Resolve them before reporting. |
| Python | Dynamic imports, Django settings (`INSTALLED_APPS`, URL configuration), and entry points in `pyproject.toml` are dependencies that import search misses. |
| SQL Server / PostgreSQL | Dynamic SQL and ORM raw queries are text. Catalog dependency views do not see them. |

## Verification

- Every edge and every impacted item has a source and a label. A sample of
  `found` items can be re-checked by opening the cited line.
- The number of usages from symbol search and from text search is reported,
  with the search terms used.
- Blast radius reasons reference specific evidence rows.
- External consumers are never claimed to be absent. They are `unknown`
  unless documented.
- When a project map was used, every fact taken from it was confirmed in the
  source, its freshness is reported, and the search did not stop at the map.
- No file was modified.
