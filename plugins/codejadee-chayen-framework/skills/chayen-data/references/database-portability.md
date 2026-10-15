---
kind: technology
---
# Database portability review

Stack detail for reviewing code, schemas, or plans that claim to work on
more than one relational engine, or that move between SQL Server and
PostgreSQL. Read both engine references (`sql-server.md` and
`postgresql.md`) when both engines are involved. Portability is a claim to
test, never an assumption: the same ORM model can behave differently on
each engine.

## Check the repository first

| Area | What to look for |
|---|---|
| Engines in play | Providers per environment (production, staging, tests, local), multi-database support in the product, a planned migration |
| Abstraction | ORM-only access, raw SQL, stored procedures, views, triggers, provider-specific mappings and conventions |
| Engine-specific features | `jsonb`, arrays, RLS, `ON CONFLICT`, `MERGE`, temporal tables, collations, sequences, computed columns |
| Tests | Which engines the test suite actually runs on; SQLite or in-memory substitutes |
| Data semantics | Collation and case rules, `NULL` handling in unique keys and sorting, date/time types, numeric precision, identifier case |

## Cross-engine review (database-portability-review)

**Applies when:** code, a schema, or a migration plan must run on both SQL
Server and PostgreSQL, tests use a different engine than production, or a
team asks whether moving between the engines is safe.

**Not when:** only one engine is used and no move is planned (use that
engine's references), or the work is the migration programme itself
(architecture migration planning, then this review for the data layer).

**Version notes:** behaviour depends on engine versions and settings:
SQL Server collation and `READ_COMMITTED_SNAPSHOT`, PostgreSQL locale,
`NULLS NOT DISTINCT` (15), `MERGE` (15 in PostgreSQL), provider versions
(EF Core providers translate the same LINQ differently; Npgsql 6 changed
date/time mapping).

**Steps:**

1. List the engines per environment and the access paths (ORM, raw SQL,
   procedures). Mark every raw SQL statement and engine-specific mapping;
   these are where portability breaks first.
2. Compare semantics, not only syntax: case and trailing-space comparison,
   `NULL` ordering and uniqueness, identifier case, default isolation and
   reader blocking, date/time types and offsets, numeric precision and
   rounding, string length units, and generated keys.
3. Compare generated SQL: run the same ORM queries through each provider
   (`ToQueryString()`, SQLAlchemy dialect compilation) and review
   differences in paging, string matching, and parameter types.
4. Decide per difference: make behaviour explicit (collations, `ORDER BY ...
   NULLS LAST`, explicit constraints, UTC instants), isolate engine-specific
   code behind the existing abstraction, or document that a feature is
   engine-specific. Do not add a new abstraction layer unasked.
5. Test on every target engine with the same data and assertions; results
   from SQLite or one engine do not prove another.
6. Report remaining risks and the data migration needs (types, collation,
   sequences) for any planned move, with approval gates for data changes.

**Verify:** report PASS, FAIL, or NOT_RUN per engine for the same test
suite and for each documented semantic difference; an untested engine is
NOT_RUN, never assumed compatible.

## Commands

```bash
dotnet test -e TEST_DB_PROVIDER=SqlServer && dotnet test -e TEST_DB_PROVIDER=Npgsql   # when the suite supports both
pytest --db-url "$PG_TEST_URL" && pytest --db-url "$MSSQL_TEST_URL"                   # project-specific options
```

## Pitfalls

- "It is just SQL": `LIMIT`, `TOP`, `ON CONFLICT`, and `OUTPUT` copied
  across engines.
- Case-insensitive lookups that pass on SQL Server and miss rows on
  PostgreSQL, or unique keys that accept duplicates on one engine only.
- One engine in CI, another in production.
- Moving `datetime2` or `timestamp` values without deciding their zone.
