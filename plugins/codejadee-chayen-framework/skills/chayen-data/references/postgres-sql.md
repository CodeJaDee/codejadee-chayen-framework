---
kind: technology
---
# PostgreSQL SQL dialect and JSONB

Stack detail for writing and reviewing SQL and document columns on
PostgreSQL. Read [postgresql.md](postgresql.md) first: it detects the
engine, version, extensions, and settings, and lists the SQL Server forms
that must never appear in PostgreSQL code.

## Check the repository first

| Area | What to look for |
|---|---|
| Where SQL lives | Migration files (EF Core, Alembic, Flyway, Prisma, Drizzle, `node-pg-migrate`), raw SQL in Npgsql, Dapper, psycopg, `pg`, or SQLAlchemy `text()` |
| Naming | Unquoted snake_case or quoted mixed case (EF Core's default quotes PascalCase names); one convention per schema |
| Version and extensions | `server_version_num` decides syntax such as `MERGE` (15), `NULLS NOT DISTINCT` (15), and `JSON_TABLE` (17); extensions such as `citext`, `pg_trgm`, `pgcrypto` |
| Collation and case | Database collation and ICU or `C` locale; PostgreSQL text comparison is case-sensitive unless `citext`, `ILIKE`, `lower()`, or a nondeterministic collation is used |
| JSON usage | `jsonb` or `json` columns, GIN indexes and their operator classes, generated columns that extract JSON fields |

## PostgreSQL SQL dialect (postgres-sql-dialect)

**Applies when:** writing, porting, or reviewing queries, views, functions,
or raw SQL inside an ORM that run on PostgreSQL or a PostgreSQL-compatible
managed service.

**Not when:** the engine is SQL Server or another engine (use that engine's
reference), the work is a plan investigation (query tuning reference), or a
schema change (schema changes reference).

**Version notes:** `INSERT ... ON CONFLICT` needs 9.5; identity columns 10;
`MERGE` and `UNIQUE NULLS NOT DISTINCT` 15; `JSON_TABLE` and `MERGE ...
RETURNING` 17; `uuidv7()` and `OLD`/`NEW` in `RETURNING` 18. Managed
services and compatible engines (Aurora, Cockroach-style or Redshift-style
dialects) differ: confirm the actual engine before using a feature.

**Steps:**

1. Confirm PostgreSQL and its major version, extensions, and collation with
   read-only queries (`postgresql.md`). Write only syntax this version and
   extension set supports, and never copy SQL Server syntax: `TOP`,
   `[brackets]`, `+` for text, `GETDATE()`, `ISNULL`, and `OUTPUT` all fail.
2. Use PostgreSQL forms: `LIMIT`/`OFFSET` (with a deterministic `ORDER BY`),
   `RETURNING`, `INSERT ... ON CONFLICT (key) DO UPDATE` for atomic upserts
   backed by a unique index, `||` for text, `COALESCE`, `now()` or
   `clock_timestamp()`, `ILIKE` or `lower()` for case-insensitive matching.
3. Respect identifier folding: unquoted names fold to lower case, and a
   quoted `"Orders"` is a different name from `orders`. Follow the existing
   convention exactly; mixing them causes "relation does not exist" errors.
4. Choose types deliberately: `timestamptz` for instants, `date` for
   calendar dates, `numeric(p,s)` for money, `bigint` identity keys, `text`
   with `CHECK` constraints, `uuid`. Remember unique constraints allow many
   `NULL`s unless `NULLS NOT DISTINCT` (15) is used.
5. Keep values parameterized in every client (`$1`, `@name`, `:name`); for
   dynamic identifiers in PL/pgSQL use `format('%I', ...)` with an allow-list
   and `EXECUTE ... USING` for values, never string concatenation.
6. Run the statements on a disposable PostgreSQL database of the same major
   version and collation, and compare results with expected output,
   including the concurrent case for upserts.

**Verify:** each changed statement runs on a disposable database with the
target's major version, extensions, and collation, and its results match a
test; report PASS, FAIL, or NOT_RUN with the `psql` or test command.

```sql
INSERT INTO inventory (sku, warehouse_id, qty)
VALUES ($1, $2, $3)
ON CONFLICT (sku, warehouse_id) DO UPDATE SET qty = inventory.qty + EXCLUDED.qty
RETURNING qty;
```

## JSONB documents in relational tables (postgres-jsonb)

**Applies when:** storing, querying, indexing, validating, or migrating
`jsonb` (or `json`) columns on PostgreSQL, or deciding whether an attribute
belongs in a column or a document.

**Not when:** the store is a document database such as MongoDB (not
covered), or the JSON is only an API payload that is never persisted (API
contract guidance).

**Version notes:** `jsonb` and GIN indexing exist since 9.4; SQL/JSON path
(`@?`, `@@`, `jsonb_path_query`) since 12; `IS JSON` and `JSON_OBJECT`
constructors 16; `JSON_TABLE`, `JSON_QUERY`, and `JSON_VALUE` 17. ORM
mapping of JSON columns depends on the provider version (EF Core owned or
complex types, Npgsql dynamic JSON, SQLAlchemy `JSONB`).

**Steps:**

1. Keep queried, joined, constrained, or frequently updated attributes in
   real columns. Use `jsonb` for genuinely variable attributes, and `json`
   only when the exact input text (key order, duplicates) must be kept:
   `jsonb` sorts keys and keeps only the last duplicate.
2. Query with operators that match the index: containment `@>` and
   jsonpath can use a GIN index (`jsonb_path_ops` is smaller but supports
   fewer operators); `->>` equality on one field needs an expression index
   on that expression or a generated column.
3. Remember `->>` returns `text`. Cast deliberately (`::numeric`,
   `::timestamptz`) and validate shape with `CHECK` constraints
   (`jsonb_typeof`, required keys) when the application relies on it.
4. Keep precision end to end: `jsonb` numbers are `numeric` and keep every
   digit, but JavaScript clients lose integers above 2^53 and decimal
   precision; send such values as strings in the API contract.
5. Change documents in batches with `jsonb_set` or `||` inside short
   transactions; a large `UPDATE` rewrites every touched row and creates
   dead tuples for vacuum.
6. Test queries, indexes (with `EXPLAIN`), constraints, and precision on a
   disposable database with representative documents.

**Verify:** report PASS, FAIL, or NOT_RUN for query results, the plan using
the intended index, constraint rejections, and a precision round trip; size
or speed claims need MEASURED before and after numbers.

## Commands

```bash
psql "$TEST_DATABASE_URL" -v ON_ERROR_STOP=1 -f change.sql
psql "$TEST_DATABASE_URL" -c "SHOW server_version_num;" -c "SELECT extname, extversion FROM pg_extension;"
```

## Pitfalls

- SQL Server syntax or `"quoted"`/unquoted name mismatches in ported SQL.
- `jsonb` used for core relational fields, then queried with `->>` scans.
- `IN (...)` lists built by string concatenation instead of `= ANY($1)`
  with one array parameter.
- Assuming case-insensitive comparison (SQL Server's default) on PostgreSQL.
