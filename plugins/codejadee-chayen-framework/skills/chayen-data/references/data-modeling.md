---
kind: recipe
capabilities: [CAP-09-001]
---
# Relational data modeling

Design tables, keys, relationships, constraints, types, and indexes that
enforce the business rules in the database, serve the known queries, and
follow the existing schema conventions of the engine in use.

## Inputs

- The entities, their attributes, and the business rules (uniqueness,
  required values, ranges, relationships, lifecycle).
- The access patterns: the main queries with their filters, sorts, and
  expected frequency, and the expected row counts.
- The engine and version, the data-access tool, and the existing schema
  conventions.

## Procedure

1. **Read the existing conventions** from two or three current tables:
   naming (case, plural or singular, prefixes), key type (`bigint`
   identity, `uuid`), audit columns, soft-delete flags, tenancy columns,
   concurrency tokens, and how lookup values are stored. Cite the tables.
2. **List entities and relationships** with cardinality (one-to-one,
   one-to-many, many-to-many) and ownership (which rows are deleted with
   their parent).
3. **Map every business rule to an enforcement mechanism,** preferring the
   database:

   | Rule kind | Mechanism |
   |---|---|
   | Identity | Primary key |
   | Natural uniqueness (email, SKU per tenant) | `UNIQUE` constraint or unique index, including the tenant column where relevant |
   | Required value | `NOT NULL` |
   | Range or allowed values | `CHECK` constraint, or a lookup table with a foreign key |
   | Relationship | Foreign key with a deliberate `ON DELETE` action |
   | Cross-row rule (no overlapping bookings) | Exclusion constraint (PostgreSQL), a unique index on a derived key, or a transaction with locking |
   | Rule that only the application can check | State it explicitly as application-enforced |

4. **Choose types deliberately:** exact numerics for money, timestamps with
   a stated time-zone convention, Unicode text with explicit lengths where
   the schema uses them, and booleans or lookups instead of magic strings.
5. **Normalize to third normal form by default.** Denormalize only for a
   named access pattern, and state how the copy is kept in sync (a trigger,
   the write path, or a scheduled job). Avoid entity-attribute-value
   designs. Use a JSON column only for genuinely variable attributes, and
   state the query and indexing trade-off.
6. **Index for the known queries:** an index on each foreign key used in
   joins or cascades, composite indexes ordered with equality columns
   before range columns, and covering columns only for hot queries. Do not
   add speculative indexes.
7. **Apply cross-cutting conventions** the schema already has: tenant
   column in keys and indexes, a filtered unique index when soft-deleted
   rows must not block reuse, audit columns, and the concurrency token.
8. **Write the proposal** as DDL or as the ORM model in the project's
   style. Do not generate or apply a migration in this recipe (the
   migration recipe does that).
9. **Validate on a disposable database** when one is available: create the
   schema and insert one row violating each rule. Each insert must fail.

## Outputs

- A schema proposal (DDL or ORM model) with keys, constraints, and indexes
  for the known queries.
- A rule-to-constraint table, including rules left to the application.
- Design notes on normalization and denormalization trade-offs, and open
  questions for the user.

## Technology considerations

| Stack | Consideration |
|---|---|
| SQL Server | `nvarchar(n)`, `datetime2` or `datetimeoffset`, `decimal(19,4)` for money, filtered unique indexes (`WHERE IsDeleted = 0`), `rowversion` for concurrency. The clustered key choice matters: avoid random GUID clustering. |
| PostgreSQL | `text` or `varchar(n)`, `timestamptz`, `numeric`, identity columns, partial unique indexes, exclusion constraints with `btree_gist` for non-overlapping ranges, `xmin` or a version column for concurrency. |
| EF Core | Fluent configuration (`IEntityTypeConfiguration`) or attributes as the project does. `HasIndex(...).IsUnique().HasFilter(...)`, `HasCheckConstraint`, value conversions for enums. |
| Prisma or Drizzle | `@@unique`, `@@index`, and relation `onDelete` in the schema file. Check constraints may need raw SQL in a migration. |
| SQLAlchemy or Django | `UniqueConstraint`, `CheckConstraint`, `Index` in `__table_args__` or `Meta.constraints`. Django `on_delete` is required on foreign keys. |

## Verification

- Each stated rule is enforced by a named constraint or listed as
  application-enforced, and a failing insert per rule was observed on a
  disposable database, or the check is NOT_RUN with the command.
- New names follow the convention cited from existing tables.
- Every proposed index names the query it serves.
- No migration was applied, and no shared database was touched.
