# Step 27 PostgreSQL and cross-stack fact checks

Date: 2026-10-18. Command: `node tests/technology/postgres-crossstack/run-fact-checks.mjs --report <ABS-PATH> --pg-bin <PostgreSQL bin> --python <python> --node-tools <node_modules>`.

PostgreSQL: none (no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>)). Environment: not reached.
SQL Server for portability: (localdb)\ChayenFacts (tempdb temporary tables only). Browser: msedge.exe.

11 PASS, 0 FAIL, 31 NOT_RUN of 42 checks (4 driver-reference, 24 PostgreSQL, 14 cross-stack).

These results describe one PostgreSQL version with the C locale, one .NET 10 runtime, one Node runtime and time zone, and one browser. Production can differ in version, locale and collation, extensions, managed-service restrictions, isolation settings, and client time zones. Facts do not show that an agent follows the guidance; behaviour and trigger evaluations remain NOT_RUN.

| Check | Capability | Result | Fact | Observed |
|---|---|---|---|---|
| DR-01 | data-access recipes | PASS | Every package in the recipe's Driver references table is referenced by the fixture project or requirements.txt | 5 packages: Npgsql.EntityFrameworkCore.PostgreSQL, Npgsql, SQLAlchemy, psycopg, Dapper |
| DR-02 | data-access recipes | PASS | Every API the table names is used in DriverReferences.cs or sqlalchemy_references.py | 42 API names used |
| DR-03 | data-access recipes | PASS | DriverReferences.cs compiles against the .NET packages | dotnet build exit 0 (Npgsql.EntityFrameworkCore.PostgreSQL, Npgsql, Dapper) |
| DR-04 | data-access recipes | NOT_RUN | sqlalchemy_references.py imports against the pinned Python packages | no Python with the pinned requirements (pass --python <exe>) |
| PF-01 | postgres-sql-dialect | NOT_RUN | Unquoted identifiers fold to lower case; quoted mixed-case names are different names (42P01) | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-02 | postgres-sql-dialect | NOT_RUN | SQL Server forms (TOP, [ ], + on text, GETDATE, ISNULL, OUTPUT) are rejected; LIMIT/OFFSET, RETURNING, ILIKE, ||, COALESCE run | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-03 | postgres-sql-dialect | NOT_RUN | EF Core Npgsql emits LIMIT @p/OFFSET @p, double-quoted names, and ILIKE; never TOP, FETCH NEXT, or [brackets] | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-04 | postgres-sql-dialect | NOT_RUN | INSERT ... ON CONFLICT DO UPDATE stays atomic under 20 concurrent upserts (1 row, quantity 20) | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-05 | postgres-explain-analyze | NOT_RUN | EXPLAIN ANALYZE executes the statement (an INSERT inserts); plain EXPLAIN does not; BEGIN ... ROLLBACK discards it | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-06 | postgres-explain-analyze | NOT_RUN | EXPLAIN (ANALYZE, BUFFERS) reports actual time, rows, loops, shared buffers, and execution time | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-07 | postgres-index-strategy | NOT_RUN | Expression, partial, and plain B-tree indexes serve only matching predicates (not ILIKE or a leading wildcard); buffers MEASURED before and after | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-08 | postgres-index-strategy | NOT_RUN | CREATE INDEX CONCURRENTLY fails inside a transaction block (25001) and succeeds outside, leaving a valid index | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-09 | postgres-mvcc-locking | NOT_RUN | REPEATABLE READ raises a serialization failure (40001) on a concurrent update; no lost update | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-10 | postgres-mvcc-locking | NOT_RUN | An open transaction blocks ALTER TABLE; lock_timeout makes the migration fail fast (55P03) | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-11 | postgres-mvcc-locking | NOT_RUN | FOR UPDATE SKIP LOCKED gives two concurrent workers different rows | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-12 | postgres-jsonb | NOT_RUN | jsonb sorts keys and keeps the last duplicate (json keeps text); a jsonb_path_ops GIN index serves @> but not ->> equality | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-13 | postgres-jsonb | NOT_RUN | jsonb numbers keep full numeric precision and trailing zeros | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-14 | postgres-row-level-security | NOT_RUN | RLS: no policy denies; tenant policy filters; '' versus NULL setting pitfall (22P02) and the NULLIF form; owner bypasses until FORCE; superuser always bypasses | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-15 | postgres-row-level-security | NOT_RUN | An RLS WITH CHECK policy blocks inserting another tenant's row (42501) | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-16 | postgres-partitioning | NOT_RUN | Range partitions are pruned by key predicates; unique constraints must include the key (0A000); rows outside every range fail (23514) | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-17 | postgres-schema-migrations | NOT_RUN | ADD COLUMN with a constant default keeps the file (no rewrite); a volatile default and a type change rewrite it (relfilenode) | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-18 | postgres-schema-migrations | NOT_RUN | NOT VALID constraints check new rows; VALIDATE fails until orphans are cleaned; DDL rolls back with its transaction | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-19 | postgres-vacuum-maintenance | NOT_RUN | An open snapshot keeps 1,000 dead rows from being removed by VACUUM; they are removed after it ends; VACUUM cannot run in a transaction (25001) | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-20 | postgres-vacuum-maintenance | NOT_RUN | A never-analyzed table has no pg_stats rows and reltuples -1; ANALYZE creates them | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-21 | postgres-backup-recovery | NOT_RUN | pg_dump -Fc, pg_restore into a NEW database, matching row count and checksum, and pg_amcheck prove the dump | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-22 | postgres-backup-recovery | NOT_RUN | pg_dump keeps grants to a role but not the role; pg_dumpall --globals-only has CREATE ROLE | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| PF-23 | postgres-sql-dialect | NOT_RUN | SQLAlchemy compiles one Core query differently for PostgreSQL and SQL Server; on_conflict_do_update upserts; bound parameters keep input as data | no Python with the pinned requirements (pass --python <exe>) |
| PF-24 | postgres-explain-analyze | NOT_RUN | SQLAlchemy lazy loading issues N+1 statements (6 for 5 customers); selectinload issues 2 | no Python with the pinned requirements (pass --python <exe>) |
| XF-01 | openapi-contract-sync | PASS | The served OpenAPI document matches the committed contract; a serializer naming change alters it and is detected | xUnit Passed |
| XF-02 | typed-api-client-generation | NOT_RUN | Types generated by openapi-typescript compile a client; regenerating from the drifted contract makes tsc reject it | openapi-typescript and typescript are not available (pass --node-tools <node_modules>) |
| XF-03 | crossstack-authentication | PASS | Cookie challenges: .NET 10 JSON API endpoints get 401, HTML endpoints redirect (302); 401/403 after login are distinct | .NET 10.0.12: cookie default challenge for a JSON API endpoint 401, for an HTML endpoint 302 -> htt<ABS-PATH> |
| XF-04 | crossstack-error-contract | PASS | Validation (400), unhandled (500), and not found (404) all return application/problem+json; no exception text leaks | validation error keys: Number, Total |
| XF-05 | crossstack-date-time | NOT_RUN | PostgreSQL timestamptz stores an instant shown in the session zone; timestamp silently drops the offset | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| XF-06 | crossstack-date-time | NOT_RUN | Npgsql rejects DateTime Kind=Unspecified for timestamptz and Kind=Utc for timestamp; timestamptz reads back as Utc | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| XF-07 | crossstack-date-time | PASS | JavaScript reads a zone-less date-time in the browser's zone and a date-only string as UTC midnight | runtime zone Asia/Bangkok: a zone-less date-time shifts by -7 h from UTC; a date-only value is UTC midnight, so formatting it locally can show the previous or next day |
| XF-08 | crossstack-date-time | PASS | System.Text.Json writes DateTimeOffset with its offset, Utc with Z, Unspecified with no zone; the contract still says date-time and integer|string | {"id":1,"number":"SO-1","total":19.99,"placedAt":"2026-01-01T10:00:00+07:00","createdUtc":"2026-01-01T03:00:00Z","localUnspecified":"2026-01-01T10:00:00","bigId":9007199254740993} |
| XF-09 | typed-api-client-generation | PASS | JSON numbers above 2^53 lose digits in JavaScript (9007199254740993 -> ...992); decimal arithmetic is binary floating point | 9007199254740993 parses as 9007199254740992; 19.99*100 = 1998.9999999999998; string-encoded ids keep their digits |
| XF-10 | crossstack-cors-csrf | PASS | CORS answers an allowed preflight with credentials; a disallowed origin gets no CORS headers but the request still executes; wildcard plus credentials is rejected | wildcard origin with credentials: The CORS protocol does not allow specifying a wildcard (any) origin and credentials at the same time. Configure the CORS policy by listing individual origins if credentials needs to be supported. |
| XF-11 | crossstack-cors-csrf | PASS | A form POST without an antiforgery token is rejected (400); with the token it succeeds | xUnit Passed |
| XF-12 | crossstack-e2e | NOT_RUN | A real browser logs in with a cookie, calls the API from an allowed origin, reads contract fields; a disallowed origin is blocked in the browser while the server still executes | playwright-core is not available (pass --node-tools <node_modules>) |
| XF-13 | database-portability-review | NOT_RUN | SQL Server and PostgreSQL differ on case and trailing-space comparison, NULL ordering, and NULLs in unique constraints | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
| XF-14 | database-portability-review | NOT_RUN | The same EF Core LINQ query translates to different SQL on the SQL Server and Npgsql providers | no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>) |
