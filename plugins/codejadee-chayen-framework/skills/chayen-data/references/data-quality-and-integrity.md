---
kind: recipe
capabilities: [CAP-09-006, CAP-09-010]
---
# Data integrity and data quality

Express data rules once and check them twice: enforce integrity with
constraints at write time, after detecting and cleaning existing
violations, and measure quality dimensions with rules, thresholds, and
reports at load or audit time.

## Inputs

- The integrity rules or quality expectations, and the business owner who
  decides how bad rows are handled.
- The schema, current data volumes, and the environment where queries may
  run (local copy, replica, or production read-only with approval).
- The quality tooling already in use (dbt tests, Great Expectations, Soda,
  SQL checks in a pipeline, pytest), if any.

## Procedure

### Integrity (CAP-09-006)

1. **List each rule and its current enforcement:** a constraint, the
   application only, or nothing.
2. **Write detection queries** and run them read-only. Report counts and
   sample keys, not personal data:
   - orphans: `LEFT JOIN parent ... WHERE parent.id IS NULL`;
   - duplicates: `GROUP BY key HAVING COUNT(*) > 1`;
   - range or domain violations: `WHERE NOT (rule)`;
   - untrusted or not-validated constraints (SQL Server
     `is_not_trusted = 1`, PostgreSQL `convalidated = false`).
3. **Propose cleanup options** per violation type: correct, merge, archive,
   or delete. Which option applies is a business decision. Ask, and follow
   the destructive operation gate for any change to data.
4. **Add the constraint after the cleanup,** as a migration:
   - PostgreSQL: `ADD CONSTRAINT ... NOT VALID`, then `VALIDATE
     CONSTRAINT`;
   - SQL Server: add it `WITH CHECK` so it is trusted;
   - unique indexes only after deduplication.
5. **Stop recurrence:** find the write path that created the bad rows and
   report it (or fix it, if in scope).
6. **Test:** an insert violating each rule fails on a disposable database.

### Quality (CAP-09-010)

1. **Define rules per dimension,** each with a threshold and severity:

   | Dimension | Example rule | Threshold |
   |---|---|---|
   | Completeness | `email` is not null | at least 99.5 % of rows |
   | Validity | `country_code` is in the ISO list | 100 % |
   | Uniqueness | one row per `customer_id` | 0 duplicates |
   | Timeliness | newest `loaded_at` is recent | under 2 hours old |
   | Consistency | order totals equal the sum of their lines | 0 mismatches |

   Thresholds come from the data owner. Mark any assumed value as an
   assumption.
2. **Profile first** (read-only, or on a sample): row count, null rate,
   distinct count, minimum and maximum, top values, and pattern
   conformance for each column in scope.
3. **Implement the checks in the existing tooling.** Do not add a quality
   framework without approval. Plain SQL checks or tests in the project's
   runner are acceptable defaults.
4. **Decide the failure behaviour** with the user: block the load, quarantine
   failing rows, or warn.
5. **Report:** each rule with its result, the failing count, sample keys,
   and the trend if history exists.

## Outputs

- Detection queries with counts of existing violations, and a constraint
  migration plus a cleanup plan for existing bad rows, pending approval.
- Quality rules with thresholds and the queries or tests that check them.
- A profile report listing failing rules.

## Technology considerations

| Stack | Consideration |
|---|---|
| SQL Server | `WITH CHECK` constraints are trusted and used by the optimizer. Check `sys.check_constraints` and `sys.foreign_keys` for `is_not_trusted`. Filtered unique indexes for conditional uniqueness. |
| PostgreSQL | `NOT VALID` plus `VALIDATE CONSTRAINT`, `pg_constraint.convalidated`, exclusion constraints, and partial unique indexes. |
| dbt | `unique`, `not_null`, `accepted_values`, and `relationships` tests, or `dbt-expectations` if installed. Run with `dbt test`. |
| Python | Great Expectations or Soda if present. Otherwise pandas or SQL checks in pytest. |
| EF Core, Django, SQLAlchemy | Declare the constraints in the model so the next generated migration does not drop them. |

## Verification

- The detection query finds the seeded orphan rows in the fixture, with
  the count reported.
- The constraint is added only after an approved cleanup step, and an
  insert violating it fails in a test.
- The generated quality checks detect seeded nulls and duplicates in a
  fixture table, reported PASS, FAIL, or NOT_RUN with the command.
- No data was changed without approval, and reports show keys rather than
  personal data.
