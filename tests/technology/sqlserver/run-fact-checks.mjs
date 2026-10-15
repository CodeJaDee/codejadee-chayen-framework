#!/usr/bin/env node
// Developer-only fact checks for the SQL Server technology pack (Step 26).
//
// SF-01..SF-27 execute the engine, ORM, and driver behaviour the SQL Server
// guidance relies on, as xUnit tests in ./fixture, against ONE disposable
// database on a LOCAL server: by default the dedicated LocalDB instance
// "ChayenFacts" (created and started here when missing), or the loopback server
// in CHAYEN_SQLSERVER_FACTS_SERVER. The fixture refuses any other server, and
// it drops its database at the end. Results describe that engine version and
// edition only: they do not show that another environment behaves the same.
//
// DR-01..DR-03 check that the ORM/driver references named by
// skills/chayen-data/references/sqlserver-data-access.md resolve: each package
// is referenced by the fixture project, each API name is used in
// DriverReferences.cs, and that file compiles against those packages.
//
// Facts, not agent behaviour: a PASS here never makes a capability VERIFIED
// (that needs behaviour and trigger evals, G-11/G-12). Never shipped.
//
// Usage: node tests/technology/sqlserver/run-fact-checks.mjs [--report <md>] [--json <file>] [--keep]

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const here = import.meta.dirname;
const repo = path.resolve(here, "..", "..", "..");
const argv = process.argv.slice(2);
const opt = (n) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
const keep = argv.includes("--keep");
const INSTANCE = "ChayenFacts";
const RECIPE = "plugins/codejadee-chayen-framework/skills/chayen-data/references/sqlserver-data-access.md";

const FACTS = {
  "SF-01": ["sqlserver-tsql", "SQL Server rejects PostgreSQL forms (LIMIT, ON CONFLICT, RETURNING, ::, ILIKE); TOP, OFFSET/FETCH, OUTPUT, TRY_CAST run"],
  "SF-02": ["sqlserver-tsql", "Collation decides case sensitivity: a _CI_ unique constraint rejects 'ALPHA' after 'Alpha'; a _CS_ column accepts both"],
  "SF-03": ["sqlserver-tsql", "The EF Core SQL Server provider emits TOP(@p), OFFSET @p/FETCH NEXT @p, [brackets], and LIKE; never LIMIT, ILIKE, or double-quoted names"],
  "SF-04": ["sqlserver-tsql", "EF Core translates a collection Contains with parameters, never PostgreSQL = ANY; at compatibility level 120 it emits IN (...) without OPENJSON"],
  "SF-05": ["sqlserver-stored-procedures", "A parameterized call does not protect a procedure that concatenates into EXEC(); sp_executesql with parameters keeps the payload as data"],
  "SF-06": ["sqlserver-stored-procedures", "A procedure's cached plan is compiled for the first parameter value and reused for the next (ParameterCompiledValue)"],
  "SF-07": ["sqlserver-query-plans", "SET SHOWPLAN_XML returns the estimated plan without executing the statement"],
  "SF-08": ["sqlserver-query-plans", "AddWithValue and Dapper strings are nvarchar: against a varchar column the plan has CONVERT_IMPLICIT; SqlDbType.VarChar and DbString IsAnsi seek without it"],
  "SF-09": ["sqlserver-query-plans", "EF Core per-row queries issue N+1 commands; a projection issues 1 and a split Include issues 2"],
  "SF-10": ["sqlserver-query-store", "Query Store is READ_WRITE for a new database on this version and records executions with runtime statistics after a flush"],
  "SF-11": ["sqlserver-index-tuning", "A trivial plan records no missing-index request; a fully optimized query does; the index cuts logical reads for the same query and data (MEASURED)"],
  "SF-12": ["sqlserver-locking-deadlocks", "Opposite lock order deadlocks: one transaction gets error 1205 and is rolled back, the other completes"],
  "SF-13": ["sqlserver-locking-deadlocks", "Updating 9,000 rows in one statement escalates to an X table lock; a 1,000-row batch keeps an IX table lock"],
  "SF-14": ["sqlserver-transactions", "With READ_COMMITTED_SNAPSHOT off, a reader waits for a writer (1222 under LOCK_TIMEOUT); with it on, the reader gets the last committed value"],
  "SF-15": ["sqlserver-transactions", "Without XACT_ABORT a failed statement leaves the transaction committable (partial commit); with XACT_ABORT ON it is rolled back"],
  "SF-16": ["sqlserver-transactions", "EF Core SaveChanges is atomic, and changes to AsNoTracking entities are not saved"],
  "SF-17": ["sqlserver-transactions", "EnableRetryOnFailure rejects a user-initiated transaction unless it runs inside CreateExecutionStrategy().Execute"],
  "SF-18": ["sqlserver-schema-evolution", "WITH NOCHECK leaves a foreign key untrusted; WITH CHECK CHECK CONSTRAINT fails (547) until orphan rows are cleaned"],
  "SF-19": ["sqlserver-schema-evolution", "ONLINE = ON index operations depend on the edition (Express rejects them with error 1712)"],
  "SF-20": ["sqlserver-security", "A db_datareader member can read but gets 229 on INSERT and 262 on CREATE TABLE"],
  "SF-21": ["sqlserver-security", "EXECUTE on a procedure covers its static SQL by ownership chaining, but dynamic SQL inside it is checked against the caller (229)"],
  "SF-22": ["sqlserver-security", "Concatenated input is injectable; ADO.NET, Dapper, and EF Core SqlQuery parameters keep the same input as data"],
  "SF-23": ["sqlserver-auditing-temporal", "A system-versioned table keeps prior rows in UTC periods, answers FOR SYSTEM_TIME AS OF, blocks DROP (13552), and records no actor by itself"],
  "SF-24": ["sqlserver-backup-recovery", "BACKUP WITH CHECKSUM and RESTORE VERIFYONLY succeed; a restore to a new name plus DBCC CHECKDB and a row count proves the backup"],
  "SF-25": ["sqlserver-backup-recovery", "BACKUP LOG fails in SIMPLE recovery (4208) and in FULL before a base full backup (4214)"],
  "SF-26": ["sqlserver-maintenance", "Statistics modification_counter counts changes since the last update and UPDATE STATISTICS resets it"],
  "SF-27": ["sqlserver-maintenance", "Random GUID keys fragment a clustered index; REBUILD is measured before and after, with DBCC CHECKDB clean"],
};
const DRIVER = {
  "DR-01": "Every package in the recipe's Driver references table is referenced by the fixture project",
  "DR-02": "Every API the table names is used in fixture/SqlServerFacts/DriverReferences.cs",
  "DR-03": "DriverReferences.cs compiles against those packages (the names resolve)",
};

const results = {};
const set = (id, status, note) => { results[id] = { status, note }; };
const sh = (cmd, args, extra = {}) => {
  const r = spawnSync(cmd, args, { encoding: "utf8", timeout: 900000, shell: false, ...extra });
  return { code: r.status, out: `${r.stdout ?? ""}${r.stderr ?? ""}`, missing: r.error?.code === "ENOENT" };
};
const dotnetEnv = { ...process.env, DOTNET_CLI_TELEMETRY_OPTOUT: "1", DOTNET_NOLOGO: "1" };

// DR-01, DR-02: static resolution of the recipe's driver references.
const fixtureDir = path.join(here, "fixture", "SqlServerFacts");
const table = (() => {
  const text = fs.existsSync(path.join(repo, RECIPE)) ? fs.readFileSync(path.join(repo, RECIPE), "utf8").replace(/\r\n/g, "\n") : "";
  const sec = text.split(/^## /m).find((s) => s.startsWith("Driver references\n")) ?? "";
  return sec.split("\n").filter((l) => /^\|/.test(l) && !/^\|\s*-/.test(l)).slice(1).map((l) => {
    const cells = l.split("|").slice(1, -1).map((x) => x.trim());
    return { library: cells[0], pkg: cells[1]?.replace(/`/g, ""), apis: (cells[2] ?? "").split(",").map((x) => x.replace(/`/g, "").trim()).filter(Boolean) };
  });
})();
{
  const csproj = fs.readFileSync(path.join(fixtureDir, "SqlServerFacts.csproj"), "utf8");
  const refs = fs.readFileSync(path.join(fixtureDir, "DriverReferences.cs"), "utf8");
  if (!table.length) { set("DR-01", "FAIL", `no Driver references table in ${RECIPE}`); set("DR-02", "FAIL", "no table"); }
  else {
    const missingPkg = table.filter((r) => !new RegExp(`Include="${r.pkg.replace(/\./g, "\\.")}" Version="[^"]+"`).test(csproj)).map((r) => r.pkg);
    set("DR-01", missingPkg.length ? "FAIL" : "PASS", missingPkg.length ? `not referenced: ${missingPkg.join(", ")}` : `${table.length} packages: ${table.map((r) => r.pkg).join(", ")}`);
    const apis = table.flatMap((r) => r.apis);
    const missingApi = apis.filter((a) => !new RegExp(`\\b${a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(refs));
    set("DR-02", missingApi.length ? "FAIL" : "PASS", missingApi.length ? `not used in DriverReferences.cs: ${missingApi.join(", ")}` : `${apis.length} API names used`);
  }
}

// Environment: .NET 10 SDK and a local SQL Server.
const sdks = sh("dotnet", ["--list-sdks"], { env: dotnetEnv });
const has10 = !sdks.missing && /^10\./m.test(sdks.out);
let server = process.env.CHAYEN_SQLSERVER_FACTS_SERVER ?? null, serverNote = "";
if (!server) {
  const info = sh("sqllocaldb", ["info", INSTANCE]);
  if (info.missing) serverNote = "SqlLocalDB is not installed and CHAYEN_SQLSERVER_FACTS_SERVER is not set";
  else {
    if (info.code !== 0 || /not created|doesn't exist|does not exist/i.test(info.out)) sh("sqllocaldb", ["create", INSTANCE]);
    const start = sh("sqllocaldb", ["start", INSTANCE]);
    if (start.code === 0) server = `(localdb)\\${INSTANCE}`;
    else serverNote = `sqllocaldb start ${INSTANCE} failed: ${start.out.trim().split("\n").at(-1)}`;
  }
}

const work = fs.mkdtempSync(path.join(os.tmpdir(), "chayen-sqlserver-facts-"));
const observedFile = path.join(work, "observed.tsv");
const observed = {};
console.log(`Work dir: ${work}\nServer: ${server ?? `none (${serverNote})`}\n`);

if (!has10) {
  set("DR-03", "NOT_RUN", "the .NET 10 SDK is not installed");
  for (const id of Object.keys(FACTS)) set(id, "NOT_RUN", "the .NET 10 SDK is not installed");
} else {
  fs.cpSync(path.join(here, "fixture"), work, { recursive: true });
  const proj = path.join(work, "SqlServerFacts");
  const build = sh("dotnet", ["build", "-p:NuGetAudit=false"], { cwd: proj, env: dotnetEnv });
  set("DR-03", build.code === 0 ? "PASS" : "FAIL", build.code === 0 ? "dotnet build exit 0 (EF Core SQL Server, Dapper, Microsoft.Data.SqlClient)" : `dotnet build exit ${build.code}: ${(build.out.match(/error \w+:[^\n]*/) ?? ["unknown error"])[0]}`);
  if (build.code !== 0) for (const id of Object.keys(FACTS)) set(id, "NOT_RUN", "the fixture did not build");
  else if (!server) for (const id of Object.keys(FACTS)) set(id, "NOT_RUN", serverNote);
  else {
    const trxDir = path.join(work, "trx");
    const t = sh("dotnet", ["test", "--no-build", "--logger", "trx;LogFileName=facts.trx", "--results-directory", trxDir], {
      cwd: proj,
      env: { ...dotnetEnv, CHAYEN_SQLSERVER_FACTS_SERVER: server, CHAYEN_SQLSERVER_FACTS_OBSERVED: observedFile },
    });
    const trx = fs.existsSync(path.join(trxDir, "facts.trx")) ? fs.readFileSync(path.join(trxDir, "facts.trx"), "utf8") : "";
    for (const id of Object.keys(FACTS)) {
      const prefix = id.replace("-", "");
      const m = new RegExp(`testName="[^"]*\\.${prefix}_[^"]*"[^>]*outcome="(\\w+)"`).exec(trx);
      if (!trx) set(id, "NOT_RUN", `dotnet test produced no results (exit ${t.code})`);
      else if (!m) set(id, "FAIL", "test not found in results");
      else set(id, m[1] === "Passed" ? "PASS" : "FAIL", `xUnit ${m[1]}`);
    }
    if (fs.existsSync(observedFile))
      for (const line of fs.readFileSync(observedFile, "utf8").split(/\r?\n/).filter(Boolean)) {
        const [k, ...v] = line.split("\t");
        observed[k] = v.join("\t");
      }
  }
}

const rows = [
  ...Object.entries(DRIVER).map(([id, fact]) => ({ id, capability: "data-access recipes", fact, ...results[id] })),
  ...Object.entries(FACTS).map(([id, [capability, fact]]) => ({ id, capability, fact, ...(results[id] ?? { status: "NOT_RUN", note: "not reached" }), observed: observed[id.replace("-", "")] })),
];
for (const r of rows) console.log(`${r.status.padEnd(7)} ${r.id} ${r.capability}: ${r.fact} (${r.note}${r.observed ? `; ${r.observed}` : ""})`);
const count = (s) => rows.filter((r) => r.status === s).length;
const summary = `${count("PASS")} PASS, ${count("FAIL")} FAIL, ${count("NOT_RUN")} NOT_RUN of ${rows.length} checks (${Object.keys(DRIVER).length} driver-reference, ${Object.keys(FACTS).length} engine/ORM facts)`;
console.log(`\n${observed.ENV ? `Environment: ${observed.ENV}\n` : ""}${summary}`);
console.log(`The LocalDB instance is kept for re-runs; remove it with: sqllocaldb stop ${INSTANCE} && sqllocaldb delete ${INSTANCE}`);

const reportPath = opt("--report");
if (reportPath) {
  const lines = [
    "# Step 26 SQL Server fact checks",
    "",
    `Date: ${new Date().toISOString().slice(0, 10)}. Command: \`node tests/technology/sqlserver/run-fact-checks.mjs --report ${reportPath.split(path.sep).join("/")}\`.`,
    "",
    `Server: ${server ? `\`${server}\` (local, disposable database per run)` : `none (${serverNote})`}. Environment: ${observed.ENV ?? "not reached"}.`,
    "",
    summary + ".",
    "",
    "These results describe this engine version, edition, and default database settings only. Production can differ in version, edition (online operations), compatibility level, collation, READ_COMMITTED_SNAPSHOT, recovery model, and Query Store settings: detect them there with read-only queries. Facts do not show that an agent follows the guidance; behaviour and trigger evaluations remain NOT_RUN.",
    "",
    "| Check | Capability | Result | Fact | Observed |",
    "|---|---|---|---|---|",
    ...rows.map((r) => `| ${r.id} | ${r.capability} | ${r.status} | ${r.fact} | ${(r.observed ?? r.note ?? "").replace(/\|/g, "\\|")} |`),
    "",
  ];
  fs.mkdirSync(path.dirname(path.resolve(reportPath)), { recursive: true });
  fs.writeFileSync(reportPath, lines.join("\n"));
}
if (opt("--json")) fs.writeFileSync(opt("--json"), JSON.stringify({ server, environment: observed.ENV ?? null, rows }, null, 2));
if (!keep) fs.rmSync(work, { recursive: true, force: true });
process.exit(count("FAIL") ? 1 : 0);
