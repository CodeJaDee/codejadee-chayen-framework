#!/usr/bin/env node
// Developer-only fact checks for the PostgreSQL and cross-stack technology packs (Step 27).
//
// PF-01..PF-24 execute PostgreSQL engine, EF Core Npgsql, Npgsql, and SQLAlchemy behaviour on a
// THROWAWAY local cluster: initdb into a temporary directory, listen on 127.0.0.1 only, run, stop,
// delete. Fixtures refuse any non-loopback host. XF-01..XF-14 execute cross-stack behaviour: the
// OpenAPI contract, typed client generation, cookie authentication, problem details, date and number
// serialization, CORS and antiforgery, a real-browser end-to-end flow, and SQL Server versus
// PostgreSQL portability (LocalDB, when present, through tempdb temporary tables only).
// DR-01..DR-04 check that the ORM/driver references in postgres-data-access.md resolve.
//
// Facts, not agent behaviour: a PASS never makes a capability VERIFIED (G-11/G-12). Missing tools
// give NOT_RUN, never PASS. Nothing here is shipped, and nothing is installed by this runner.
//
// Usage: node tests/technology/postgres-crossstack/run-fact-checks.mjs [--report <md>] [--json <file>] [--keep]
//          [--pg-bin <PostgreSQL bin dir>] [--python <python with requirements.txt>]
//          [--node-tools <node_modules with playwright-core, openapi-typescript, typescript>] [--browser <exe>]

import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const here = import.meta.dirname;
const repo = path.resolve(here, "..", "..", "..");
const argv = process.argv.slice(2);
const opt = (n, env) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : process.env[env] ?? null);
const keep = argv.includes("--keep");
const RECIPE = "plugins/codejadee-chayen-framework/skills/chayen-data/references/postgres-data-access.md";

const FACTS = {
  "PF-01": ["postgres-sql-dialect", "Unquoted identifiers fold to lower case; quoted mixed-case names are different names (42P01)"],
  "PF-02": ["postgres-sql-dialect", "SQL Server forms (TOP, [ ], + on text, GETDATE, ISNULL, OUTPUT) are rejected; LIMIT/OFFSET, RETURNING, ILIKE, ||, COALESCE run"],
  "PF-03": ["postgres-sql-dialect", "EF Core Npgsql emits LIMIT @p/OFFSET @p, double-quoted names, and ILIKE; never TOP, FETCH NEXT, or [brackets]"],
  "PF-04": ["postgres-sql-dialect", "INSERT ... ON CONFLICT DO UPDATE stays atomic under 20 concurrent upserts (1 row, quantity 20)"],
  "PF-05": ["postgres-explain-analyze", "EXPLAIN ANALYZE executes the statement (an INSERT inserts); plain EXPLAIN does not; BEGIN ... ROLLBACK discards it"],
  "PF-06": ["postgres-explain-analyze", "EXPLAIN (ANALYZE, BUFFERS) reports actual time, rows, loops, shared buffers, and execution time"],
  "PF-07": ["postgres-index-strategy", "Expression, partial, and plain B-tree indexes serve only matching predicates (not ILIKE or a leading wildcard); buffers MEASURED before and after"],
  "PF-08": ["postgres-index-strategy", "CREATE INDEX CONCURRENTLY fails inside a transaction block (25001) and succeeds outside, leaving a valid index"],
  "PF-09": ["postgres-mvcc-locking", "REPEATABLE READ raises a serialization failure (40001) on a concurrent update; no lost update"],
  "PF-10": ["postgres-mvcc-locking", "An open transaction blocks ALTER TABLE; lock_timeout makes the migration fail fast (55P03)"],
  "PF-11": ["postgres-mvcc-locking", "FOR UPDATE SKIP LOCKED gives two concurrent workers different rows"],
  "PF-12": ["postgres-jsonb", "jsonb sorts keys and keeps the last duplicate (json keeps text); a jsonb_path_ops GIN index serves @> but not ->> equality"],
  "PF-13": ["postgres-jsonb", "jsonb numbers keep full numeric precision and trailing zeros"],
  "PF-14": ["postgres-row-level-security", "RLS: no policy denies; tenant policy filters; '' versus NULL setting pitfall (22P02) and the NULLIF form; owner bypasses until FORCE; superuser always bypasses"],
  "PF-15": ["postgres-row-level-security", "An RLS WITH CHECK policy blocks inserting another tenant's row (42501)"],
  "PF-16": ["postgres-partitioning", "Range partitions are pruned by key predicates; unique constraints must include the key (0A000); rows outside every range fail (23514)"],
  "PF-17": ["postgres-schema-migrations", "ADD COLUMN with a constant default keeps the file (no rewrite); a volatile default and a type change rewrite it (relfilenode)"],
  "PF-18": ["postgres-schema-migrations", "NOT VALID constraints check new rows; VALIDATE fails until orphans are cleaned; DDL rolls back with its transaction"],
  "PF-19": ["postgres-vacuum-maintenance", "An open snapshot keeps 1,000 dead rows from being removed by VACUUM; they are removed after it ends; VACUUM cannot run in a transaction (25001)"],
  "PF-20": ["postgres-vacuum-maintenance", "A never-analyzed table has no pg_stats rows and reltuples -1; ANALYZE creates them"],
  "PF-21": ["postgres-backup-recovery", "pg_dump -Fc, pg_restore into a NEW database, matching row count and checksum, and pg_amcheck prove the dump"],
  "PF-22": ["postgres-backup-recovery", "pg_dump keeps grants to a role but not the role; pg_dumpall --globals-only has CREATE ROLE"],
  "PF-23": ["postgres-sql-dialect", "SQLAlchemy compiles one Core query differently for PostgreSQL and SQL Server; on_conflict_do_update upserts; bound parameters keep input as data"],
  "PF-24": ["postgres-explain-analyze", "SQLAlchemy lazy loading issues N+1 statements (6 for 5 customers); selectinload issues 2"],
  "XF-01": ["openapi-contract-sync", "The served OpenAPI document matches the committed contract; a serializer naming change alters it and is detected"],
  "XF-02": ["typed-api-client-generation", "Types generated by openapi-typescript compile a client; regenerating from the drifted contract makes tsc reject it"],
  "XF-03": ["crossstack-authentication", "Cookie challenges: .NET 10 JSON API endpoints get 401, HTML endpoints redirect (302); 401/403 after login are distinct"],
  "XF-04": ["crossstack-error-contract", "Validation (400), unhandled (500), and not found (404) all return application/problem+json; no exception text leaks"],
  "XF-05": ["crossstack-date-time", "PostgreSQL timestamptz stores an instant shown in the session zone; timestamp silently drops the offset"],
  "XF-06": ["crossstack-date-time", "Npgsql rejects DateTime Kind=Unspecified for timestamptz and Kind=Utc for timestamp; timestamptz reads back as Utc"],
  "XF-07": ["crossstack-date-time", "JavaScript reads a zone-less date-time in the browser's zone and a date-only string as UTC midnight"],
  "XF-08": ["crossstack-date-time", "System.Text.Json writes DateTimeOffset with its offset, Utc with Z, Unspecified with no zone; the contract still says date-time and integer|string"],
  "XF-09": ["typed-api-client-generation", "JSON numbers above 2^53 lose digits in JavaScript (9007199254740993 -> ...992); decimal arithmetic is binary floating point"],
  "XF-10": ["crossstack-cors-csrf", "CORS answers an allowed preflight with credentials; a disallowed origin gets no CORS headers but the request still executes; wildcard plus credentials is rejected"],
  "XF-11": ["crossstack-cors-csrf", "A form POST without an antiforgery token is rejected (400); with the token it succeeds"],
  "XF-12": ["crossstack-e2e", "A real browser logs in with a cookie, calls the API from an allowed origin, reads contract fields; a disallowed origin is blocked in the browser while the server still executes"],
  "XF-13": ["database-portability-review", "SQL Server and PostgreSQL differ on case and trailing-space comparison, NULL ordering, and NULLs in unique constraints"],
  "XF-14": ["database-portability-review", "The same EF Core LINQ query translates to different SQL on the SQL Server and Npgsql providers"],
};
const DRIVER = {
  "DR-01": "Every package in the recipe's Driver references table is referenced by the fixture project or requirements.txt",
  "DR-02": "Every API the table names is used in DriverReferences.cs or sqlalchemy_references.py",
  "DR-03": "DriverReferences.cs compiles against the .NET packages",
  "DR-04": "sqlalchemy_references.py imports against the pinned Python packages",
};

const results = {}, observed = {};
const set = (id, status, note) => { results[id] = { status, note }; };
const sh = (cmd, args, extra = {}) => {
  const r = spawnSync(cmd, args, { encoding: "utf8", timeout: 900000, ...extra });
  return { code: r.status, out: `${r.stdout ?? ""}${r.stderr ?? ""}`, missing: r.error?.code === "ENOENT" };
};
const dotnetEnv = { ...process.env, DOTNET_CLI_TELEMETRY_OPTOUT: "1", DOTNET_NOLOGO: "1" };
const freePort = () => new Promise((resolve) => { const s = net.createServer().listen(0, "127.0.0.1", () => { const p = s.address().port; s.close(() => resolve(p)); }); });
const fixture = path.join(here, "fixture");

// DR-01, DR-02: static resolution of the recipe's driver references.
const table = (() => {
  const file = path.join(repo, RECIPE);
  const text = fs.existsSync(file) ? fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n") : "";
  const sec = text.split(/^## /m).find((s) => s.startsWith("Driver references\n")) ?? "";
  return sec.split("\n").filter((l) => /^\|/.test(l) && !/^\|\s*-/.test(l)).slice(1).map((l) => {
    const c = l.split("|").slice(1, -1).map((x) => x.trim());
    return { library: c[0], pkgs: c[1].split(",").map((x) => x.replace(/`/g, "").trim()), apis: c[2].split(",").map((x) => x.replace(/`/g, "").trim()).filter(Boolean) };
  });
})();
{
  const csproj = fs.readFileSync(path.join(fixture, "PostgresFacts", "PostgresFacts.csproj"), "utf8");
  const reqs = fs.readFileSync(path.join(fixture, "python", "requirements.txt"), "utf8");
  const sources = fs.readFileSync(path.join(fixture, "PostgresFacts", "DriverReferences.cs"), "utf8") + fs.readFileSync(path.join(fixture, "python", "sqlalchemy_references.py"), "utf8");
  if (!table.length) { set("DR-01", "FAIL", `no Driver references table in ${RECIPE}`); set("DR-02", "FAIL", "no table"); }
  else {
    const has = (p) => new RegExp(`Include="${p.replace(/\./g, "\\.")}" Version="[^"]+"`).test(csproj) || new RegExp(`^${p.replace(/\./g, "\\.")}(\\[[^\\]]*\\])?==`, "mi").test(reqs);
    const pkgs = table.flatMap((r) => r.pkgs), missingPkg = pkgs.filter((p) => !has(p));
    set("DR-01", missingPkg.length ? "FAIL" : "PASS", missingPkg.length ? `not referenced: ${missingPkg.join(", ")}` : `${pkgs.length} packages: ${pkgs.join(", ")}`);
    const apis = table.flatMap((r) => r.apis), missingApi = apis.filter((a) => !new RegExp(`\\b${a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(sources));
    set("DR-02", missingApi.length ? "FAIL" : "PASS", missingApi.length ? `not used: ${missingApi.join(", ")}` : `${apis.length} API names used`);
  }
}

const work = fs.mkdtempSync(path.join(os.tmpdir(), "chayen-pgx-facts-"));
const observedFile = path.join(work, "observed.tsv"), contractOut = path.join(work, "contract");
fs.mkdirSync(contractOut);
fs.cpSync(fixture, path.join(work, "fixture"), { recursive: true });
const readObserved = () => {
  if (!fs.existsSync(observedFile)) return;
  for (const line of fs.readFileSync(observedFile, "utf8").split(/\r?\n/).filter(Boolean)) { const [k, ...v] = line.split("\t"); observed[k.replace(/^([A-Z]{2})(\d\d)$/, "$1-$2")] = v.join("\t"); }
};
const trxResults = (trxFile, ids, why) => {
  const trx = fs.existsSync(trxFile) ? fs.readFileSync(trxFile, "utf8") : "";
  for (const id of ids) {
    const m = new RegExp(`testName="[^"]*\\.${id.replace("-", "")}_[^"]*"[^>]*outcome="(\\w+)"`).exec(trx);
    if (!trx) set(id, "NOT_RUN", why);
    else if (!m) set(id, "FAIL", "test not found in results");
    else set(id, m[1] === "Passed" ? "PASS" : "FAIL", `xUnit ${m[1]}`);
  }
};
const pgIds = Object.keys(FACTS).filter((id) => /^PF-(0\d|1\d|2[0-2])$/.test(id)).concat(["XF-05", "XF-06", "XF-13", "XF-14"]);
const apiIds = ["XF-01", "XF-03", "XF-04", "XF-08", "XF-10", "XF-11"];

// Environment: .NET 10 SDK, PostgreSQL binaries, local SQL Server for portability, Python, Node tools, browser.
const has10 = /^10\./m.test(sh("dotnet", ["--list-sdks"], { env: dotnetEnv }).out);
const pgBin = opt("--pg-bin", "CHAYEN_POSTGRES_BIN");
const python = opt("--python", "CHAYEN_PYTHON");
const nodeTools = opt("--node-tools", "CHAYEN_NODE_TOOLS");
const browser = opt("--browser", "CHAYEN_BROWSER") ?? (() => {
  const pw = path.join(process.env.LOCALAPPDATA ?? "", "ms-playwright");
  const chromium = fs.existsSync(pw) ? fs.readdirSync(pw).filter((d) => /^chromium-\d+$/.test(d)).sort().at(-1) : null;
  return [chromium && path.join(pw, chromium, "chrome-win64", "chrome.exe"), "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Google/Chrome/Application/chrome.exe"].find((p) => p && fs.existsSync(p)) ?? null;
})();
let sqlServer = process.env.CHAYEN_SQLSERVER_FACTS_SERVER ?? null;
if (!sqlServer && sh("sqllocaldb", ["start", "ChayenFacts"]).code === 0) sqlServer = "(localdb)\\ChayenFacts";

let pg = null, pgNote = "no PostgreSQL binaries (pass --pg-bin <dir with initdb, pg_ctl, pg_dump>)";
if (pgBin && fs.existsSync(path.join(pgBin, process.platform === "win32" ? "initdb.exe" : "initdb"))) {
  const port = await freePort(), data = path.join(work, "pgdata");
  const init = sh(path.join(pgBin, "initdb"), ["-D", data, "-U", "postgres", "-A", "trust", "-E", "UTF8", "--locale=C"]);
  // stdio "ignore": the server process would otherwise inherit the pipes and keep spawnSync waiting.
  const start = init.code === 0 ? sh(path.join(pgBin, "pg_ctl"), ["-D", data, "-o", `-p ${port} -c listen_addresses=127.0.0.1`, "-l", path.join(work, "pg.log"), "-w", "start"], { stdio: "ignore" }) : init;
  if (start.code === 0) {
    const version = sh(path.join(pgBin, "postgres"), ["--version"]).out.trim();
    pg = { port, data, version, url: `Host=127.0.0.1;Port=${port};Username=postgres;Database=postgres` };
  } else pgNote = `could not start a temporary cluster: ${start.out.trim().split("\n").at(-1)}`;
}
console.log(`Work dir: ${work}\nPostgreSQL: ${pg ? `${pg.version} on 127.0.0.1:${pg.port} (temporary cluster)` : `none (${pgNote})`}\nSQL Server: ${sqlServer ?? "none"}\nPython: ${python ?? "none"}\nNode tools: ${nodeTools ?? "none"}\nBrowser: ${browser ?? "none"}\n`);

try {
  if (!has10) {
    set("DR-03", "NOT_RUN", "the .NET 10 SDK is not installed");
    for (const id of [...pgIds, ...apiIds, "XF-12"]) set(id, "NOT_RUN", "the .NET 10 SDK is not installed");
  } else {
    const pgProj = path.join(work, "fixture", "PostgresFacts"), apiTests = path.join(work, "fixture", "CrossStackFacts");
    const b1 = sh("dotnet", ["build", "-p:NuGetAudit=false"], { cwd: pgProj, env: dotnetEnv });
    const b2 = sh("dotnet", ["build", "-p:NuGetAudit=false"], { cwd: apiTests, env: dotnetEnv });
    set("DR-03", b1.code === 0 ? "PASS" : "FAIL", b1.code === 0 ? "dotnet build exit 0 (Npgsql.EntityFrameworkCore.PostgreSQL, Npgsql, Dapper)" : (b1.out.match(/error \w+:[^\n]*/) ?? ["build failed"])[0]);
    if (b1.code !== 0) for (const id of pgIds) set(id, "NOT_RUN", "the PostgreSQL fixture did not build");
    else if (!pg) for (const id of pgIds) set(id, "NOT_RUN", pgNote);
    else {
      sh("dotnet", ["test", "--no-build", "--logger", "trx;LogFileName=pg.trx", "--results-directory", path.join(work, "trx")], {
        cwd: pgProj,
        env: { ...dotnetEnv, CHAYEN_POSTGRES_FACTS_URL: pg.url, CHAYEN_POSTGRES_FACTS_BIN: pgBin, CHAYEN_FACTS_OBSERVED: observedFile, ...(sqlServer ? { CHAYEN_SQLSERVER_FACTS_SERVER: sqlServer } : {}) },
      });
      trxResults(path.join(work, "trx", "pg.trx"), pgIds, "dotnet test produced no results");
    }
    if (b2.code !== 0) for (const id of [...apiIds, "XF-12"]) set(id, "NOT_RUN", "the cross-stack fixture did not build");
    else {
      sh("dotnet", ["test", "--no-build", "--logger", "trx;LogFileName=api.trx", "--results-directory", path.join(work, "trx")], {
        cwd: apiTests, env: { ...dotnetEnv, CHAYEN_CONTRACT_OUT: contractOut, CHAYEN_FACTS_OBSERVED: observedFile },
      });
      trxResults(path.join(work, "trx", "api.trx"), apiIds, "dotnet test produced no results");
      const apiOut = path.join(work, "api-bin");
      const pub = sh("dotnet", ["build", "-p:NuGetAudit=false", "-o", apiOut], { cwd: path.join(work, "fixture", "CrossStackApi"), env: dotnetEnv });
      const e2e = sh(process.execPath, [path.join(here, "node", "e2e.mjs"), nodeTools ?? "", pub.code === 0 ? path.join(apiOut, "CrossStackApi.dll") : "", browser ?? ""]);
      const line = e2e.out.split("\n").find((l) => l.startsWith("{"));
      if (line) { const r = JSON.parse(line); set(r.id, r.status, r.note); } else set("XF-12", "FAIL", e2e.out.trim().slice(0, 300));
    }
  }
  readObserved();
  if (observed["XF-13"]?.startsWith("NOT_RUN") && results["XF-13"]?.status === "PASS") set("XF-13", "NOT_RUN", observed["XF-13"].replace(/^NOT_RUN: /, ""));

  // Node facts: dates and numbers in a JavaScript client; typed client generation.
  for (const l of sh(process.execPath, [path.join(here, "node", "client-facts.mjs")]).out.split("\n").filter((x) => x.startsWith("{"))) { const r = JSON.parse(l); set(r.id, r.status, r.note); }
  const typed = sh(process.execPath, [path.join(here, "node", "typed-client.mjs"), nodeTools ?? "", path.join(fixture, "CrossStackApi", "contract", "openapi.v1.json"), path.join(contractOut, "drifted.v1.json")]);
  const tl = typed.out.split("\n").find((l) => l.startsWith("{"));
  if (tl) { const r = JSON.parse(tl); set(r.id, r.status, r.note); } else set("XF-02", "FAIL", typed.out.trim().slice(0, 300));

  // Python: SQLAlchemy driver references and facts.
  if (!python) { for (const id of ["DR-04", "PF-23", "PF-24"]) set(id, "NOT_RUN", "no Python with the pinned requirements (pass --python <exe>)"); }
  else {
    const imp = sh(python, ["-I", path.join(fixture, "python", "sqlalchemy_references.py")]);
    set("DR-04", imp.code === 0 ? "PASS" : imp.missing ? "NOT_RUN" : "FAIL", imp.code === 0 ? sh(python, ["-I", "-c", "import sqlalchemy, psycopg; print(f'SQLAlchemy {sqlalchemy.__version__}, psycopg {psycopg.__version__}')"]).out.trim() : imp.out.trim().split("\n").at(-1));
    if (!pg) for (const id of ["PF-23", "PF-24"]) set(id, "NOT_RUN", pgNote);
    else {
      const py = sh(python, ["-I", path.join(fixture, "python", "sqlalchemy_facts.py"), `postgresql+psycopg://postgres@127.0.0.1:${pg.port}/postgres`]);
      for (const l of py.out.split("\n").filter((x) => x.startsWith("{"))) { const r = JSON.parse(l); set(r.id, r.status, r.note); }
      for (const id of ["PF-23", "PF-24"]) if (!results[id]) set(id, "FAIL", py.out.trim().split("\n").at(-1));
    }
  }
} finally {
  if (pg) sh(path.join(pgBin, "pg_ctl"), ["-D", pg.data, "-m", "fast", "-w", "stop"]);
}

const rows = [
  ...Object.entries(DRIVER).map(([id, fact]) => ({ id, capability: "data-access recipes", fact, ...(results[id] ?? { status: "NOT_RUN", note: "not reached" }) })),
  ...Object.entries(FACTS).map(([id, [capability, fact]]) => ({ id, capability, fact, ...(results[id] ?? { status: "NOT_RUN", note: "not reached" }), observed: observed[id] })),
];
for (const r of rows) console.log(`${r.status.padEnd(7)} ${r.id} ${r.capability}: ${r.fact} (${r.note}${r.observed ? `; ${r.observed}` : ""})`);
const count = (s) => rows.filter((r) => r.status === s).length;
const summary = `${count("PASS")} PASS, ${count("FAIL")} FAIL, ${count("NOT_RUN")} NOT_RUN of ${rows.length} checks (${Object.keys(DRIVER).length} driver-reference, ${Object.keys(FACTS).filter((k) => k.startsWith("PF")).length} PostgreSQL, ${Object.keys(FACTS).filter((k) => k.startsWith("XF")).length} cross-stack)`;
console.log(`\n${observed.ENV ? `PostgreSQL environment: ${observed.ENV}\n` : ""}${summary}`);

const reportPath = opt("--report", "__none__");
if (reportPath) {
  const md = [
    "# Step 27 PostgreSQL and cross-stack fact checks",
    "",
    `Date: ${new Date().toISOString().slice(0, 10)}. Command: \`node tests/technology/postgres-crossstack/run-fact-checks.mjs --report ${reportPath.split(path.sep).join("/")} --pg-bin <PostgreSQL bin> --python <python> --node-tools <node_modules>\`.`,
    "",
    `PostgreSQL: ${pg ? `${pg.version}, temporary cluster on 127.0.0.1 (initdb --locale=C, trust auth on loopback only), deleted after the run` : `none (${pgNote})`}. Environment: ${observed.ENV ?? "not reached"}.`,
    `SQL Server for portability: ${sqlServer ?? "none"} (tempdb temporary tables only). Browser: ${browser ? path.basename(browser) : "none"}.`,
    "",
    summary + ".",
    "",
    "These results describe one PostgreSQL version with the C locale, one .NET 10 runtime, one Node runtime and time zone, and one browser. Production can differ in version, locale and collation, extensions, managed-service restrictions, isolation settings, and client time zones. Facts do not show that an agent follows the guidance; behaviour and trigger evaluations remain NOT_RUN.",
    "",
    "| Check | Capability | Result | Fact | Observed |",
    "|---|---|---|---|---|",
    ...rows.map((r) => `| ${r.id} | ${r.capability} | ${r.status} | ${r.fact} | ${(r.observed ?? r.note ?? "").replace(/\|/g, "\\|")} |`),
    "",
  ];
  fs.mkdirSync(path.dirname(path.resolve(reportPath)), { recursive: true });
  fs.writeFileSync(reportPath, md.join("\n"));
}
if (opt("--json", "__none__")) fs.writeFileSync(opt("--json", "__none__"), JSON.stringify({ pg: pg?.version ?? null, sqlServer, rows }, null, 2));
if (!keep) fs.rmSync(work, { recursive: true, force: true });
process.exit(count("FAIL") ? 1 : 0);
