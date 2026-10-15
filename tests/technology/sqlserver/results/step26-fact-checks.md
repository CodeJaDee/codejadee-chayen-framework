# Step 26 SQL Server fact checks

Date: 2026-10-15. Command: `node tests/technology/sqlserver/run-fact-checks.mjs --report tests/technology/sqlserver/results/step26-fact-checks.md`.

Server: `(localdb)\ChayenFacts` (local, disposable database per run). Environment: version=17.0.4025.3; edition=Express Edition (64-bit); engine_edition=4; compatibility_level=170; collation=SQL_Latin1_General_CP1_CI_AS; rcsi=False; snapshot=OFF; recovery=SIMPLE.

30 PASS, 0 FAIL, 0 NOT_RUN of 30 checks (3 driver-reference, 27 engine/ORM facts).

These results describe this engine version, edition, and default database settings only. Production can differ in version, edition (online operations), compatibility level, collation, READ_COMMITTED_SNAPSHOT, recovery model, and Query Store settings: detect them there with read-only queries. Facts do not show that an agent follows the guidance; behaviour and trigger evaluations remain NOT_RUN.

| Check | Capability | Result | Fact | Observed |
|---|---|---|---|---|
| DR-01 | data-access recipes | PASS | Every package in the recipe's Driver references table is referenced by the fixture project | 3 packages: Microsoft.EntityFrameworkCore.SqlServer, Dapper, Microsoft.Data.SqlClient |
| DR-02 | data-access recipes | PASS | Every API the table names is used in fixture/SqlServerFacts/DriverReferences.cs | 39 API names used |
| DR-03 | data-access recipes | PASS | DriverReferences.cs compiles against those packages (the names resolve) | dotnet build exit 0 (EF Core SQL Server, Dapper, Microsoft.Data.SqlClient) |
| SF-01 | sqlserver-tsql | PASS | SQL Server rejects PostgreSQL forms (LIMIT, ON CONFLICT, RETURNING, ::, ILIKE); TOP, OFFSET/FETCH, OUTPUT, TRY_CAST run | PostgreSQL forms rejected with errors 102, 156, 102, 102, 4145 (LIMIT, ON CONFLICT, RETURNING, ::, ILIKE) |
| SF-02 | sqlserver-tsql | PASS | Collation decides case sensitivity: a _CI_ unique constraint rejects 'ALPHA' after 'Alpha'; a _CS_ column accepts both | xUnit Passed |
| SF-03 | sqlserver-tsql | PASS | The EF Core SQL Server provider emits TOP(@p), OFFSET @p/FETCH NEXT @p, [brackets], and LIKE; never LIMIT, ILIKE, or double-quoted names | xUnit Passed |
| SF-04 | sqlserver-tsql | PASS | EF Core translates a collection Contains with parameters, never PostgreSQL = ANY; at compatibility level 120 it emits IN (...) without OPENJSON | default options: DECLARE @ids1 int = 1; DECLARE @ids2 int = 2; DECLARE @ids3 int = 3;  SELECT [o].[Id], [o].[CustomerId], [o].[Number], [o].[Total] FROM [Orders] AS [o] WHERE [o].[Id] IN (@ids1, @ids2, @ids3) \| compatibility level 120: DECLARE @ids1 int = 1; DECLARE @ids2 int = 2; DECLARE @ids3 int = 3;  SELECT [o].[Id], [o].[CustomerId], [o].[Number], [o].[Total] FROM [Orders] AS [o] WHERE [o].[Id] IN (@ids1, @ids2, @ids3) |
| SF-05 | sqlserver-stored-procedures | PASS | A parameterized call does not protect a procedure that concatenates into EXEC(); sp_executesql with parameters keeps the payload as data | xUnit Passed |
| SF-06 | sqlserver-stored-procedures | PASS | A procedure's cached plan is compiled for the first parameter value and reused for the next (ParameterCompiledValue) | xUnit Passed |
| SF-07 | sqlserver-query-plans | PASS | SET SHOWPLAN_XML returns the estimated plan without executing the statement | xUnit Passed |
| SF-08 | sqlserver-query-plans | PASS | AddWithValue and Dapper strings are nvarchar: against a varchar column the plan has CONVERT_IMPLICIT; SqlDbType.VarChar and DbString IsAnsi seek without it | xUnit Passed |
| SF-09 | sqlserver-query-plans | PASS | EF Core per-row queries issue N+1 commands; a projection issues 1 and a split Include issues 2 | 10 customers: per-row loop 11 commands, projection 1, split Include 2 |
| SF-10 | sqlserver-query-store | PASS | Query Store is READ_WRITE for a new database on this version and records executions with runtime statistics after a flush | new database query store: READ_WRITE/AUTO |
| SF-11 | sqlserver-index-tuning | PASS | A trivial plan records no missing-index request; a fully optimized query does; the index cuts logical reads for the same query and data (MEASURED) | missing-index rows after a trivial plan 0, after a fully optimized query 1; logical reads for the same query and data: before 574, after 2 |
| SF-12 | sqlserver-locking-deadlocks | PASS | Opposite lock order deadlocks: one transaction gets error 1205 and is rolled back, the other completes | xUnit Passed |
| SF-13 | sqlserver-locking-deadlocks | PASS | Updating 9,000 rows in one statement escalates to an X table lock; a 1,000-row batch keeps an IX table lock | xUnit Passed |
| SF-14 | sqlserver-transactions | PASS | With READ_COMMITTED_SNAPSHOT off, a reader waits for a writer (1222 under LOCK_TIMEOUT); with it on, the reader gets the last committed value | xUnit Passed |
| SF-15 | sqlserver-transactions | PASS | Without XACT_ABORT a failed statement leaves the transaction committable (partial commit); with XACT_ABORT ON it is rolled back | xUnit Passed |
| SF-16 | sqlserver-transactions | PASS | EF Core SaveChanges is atomic, and changes to AsNoTracking entities are not saved | xUnit Passed |
| SF-17 | sqlserver-transactions | PASS | EnableRetryOnFailure rejects a user-initiated transaction unless it runs inside CreateExecutionStrategy().Execute | xUnit Passed |
| SF-18 | sqlserver-schema-evolution | PASS | WITH NOCHECK leaves a foreign key untrusted; WITH CHECK CHECK CONSTRAINT fails (547) until orphan rows are cleaned | xUnit Passed |
| SF-19 | sqlserver-schema-evolution | PASS | ONLINE = ON index operations depend on the edition (Express rejects them with error 1712) | engine edition 4: ONLINE = ON rejected with error 1712 |
| SF-20 | sqlserver-security | PASS | A db_datareader member can read but gets 229 on INSERT and 262 on CREATE TABLE | xUnit Passed |
| SF-21 | sqlserver-security | PASS | EXECUTE on a procedure covers its static SQL by ownership chaining, but dynamic SQL inside it is checked against the caller (229) | xUnit Passed |
| SF-22 | sqlserver-security | PASS | Concatenated input is injectable; ADO.NET, Dapper, and EF Core SqlQuery parameters keep the same input as data | xUnit Passed |
| SF-23 | sqlserver-auditing-temporal | PASS | A system-versioned table keeps prior rows in UTC periods, answers FOR SYSTEM_TIME AS OF, blocks DROP (13552), and records no actor by itself | xUnit Passed |
| SF-24 | sqlserver-backup-recovery | PASS | BACKUP WITH CHECKSUM and RESTORE VERIFYONLY succeed; a restore to a new name plus DBCC CHECKDB and a row count proves the backup | xUnit Passed |
| SF-25 | sqlserver-backup-recovery | PASS | BACKUP LOG fails in SIMPLE recovery (4208) and in FULL before a base full backup (4214) | new database recovery model: SIMPLE |
| SF-26 | sqlserver-maintenance | PASS | Statistics modification_counter counts changes since the last update and UPDATE STATISTICS resets it | xUnit Passed |
| SF-27 | sqlserver-maintenance | PASS | Random GUID keys fragment a clustered index; REBUILD is measured before and after, with DBCC CHECKDB clean | clustered index fragmentation: before rebuild 99.1%, after 0.0% (same table, same rows) |
