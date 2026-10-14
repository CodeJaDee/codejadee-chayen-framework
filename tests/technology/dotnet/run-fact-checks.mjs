#!/usr/bin/env node
// Developer-only fact checks for the .NET technology pack (Step 20).
//
// The shipped .NET guidance makes claims about framework and SDK behaviour
// (for example "a non-nullable property is implicitly required in
// [ApiController] models", or "EF Core scaffolds a rename plus type change as
// drop and add"). This runner executes those claims against real SDKs in a
// temporary copy of ./fixture and reports PASS, FAIL, or NOT_RUN per fact.
//
// It checks framework facts, not agent behaviour: a PASS here does not make
// any capability VERIFIED (that needs behaviour and trigger evals, G-11/G-12).
// Requires the .NET 10 SDK (and the .NET 8 SDK for TF-22 and TF-24), the
// dotnet-ef tool for TF-15..TF-19, and NuGet access for restore. Never shipped.
//
// Usage: node tests/technology/dotnet/run-fact-checks.mjs [--keep] [--json <file>]

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const here = import.meta.dirname;
const argv = process.argv.slice(2);
const keep = argv.includes("--keep");
const jsonOut = argv.includes("--json") ? argv[argv.indexOf("--json") + 1] : null;

const FACTS = {
  "TF-01": ["aspnet-integration-testing", "WebApplicationFactory<Program> reaches a top-level-statement Program on .NET 10 without a hand-written partial class"],
  "TF-02": ["aspnet-api-endpoints", "A TypedResults union (Results<Ok<T>, NotFound>) returns 404 for a missing resource"],
  "TF-03": ["aspnet-validation", ".NET 10 minimal API validation (AddValidation) returns 400 problem details for DataAnnotations failures"],
  "TF-04": ["csharp-nullability", "With nullable enabled, [ApiController] treats a non-nullable reference property as required (400 without [Required])"],
  "TF-05": ["aspnet-exception-handling", "IExceptionHandler maps a domain exception to 404; unhandled exceptions become 500 problem details without the message outside Development"],
  "TF-06": ["aspnet-openapi", "Microsoft.AspNetCore.OpenApi serves /openapi/v1.json with mapped operations and operation IDs"],
  "TF-07": ["aspnet-authorization", "A policy endpoint returns 401 unauthenticated, 403 without the claim, 200 with it (test authentication scheme)"],
  "TF-08": ["aspnet-data-access", "EF Core parameterizes captured values; ToQueryString() shows DECLARE lines and a parameterized SELECT"],
  "TF-09": ["csharp-linq-optimization", "EF Core throws for a predicate it cannot translate instead of evaluating it on the client"],
  "TF-10": ["aspnet-dependency-injection", "Development validates the service graph on build (singleton depending on scoped fails); Production does not by default"],
  "TF-11": ["aspnet-background-services", "An unhandled exception in a BackgroundService stops the host by default"],
  "TF-12": ["csharp-serialization", "System.Text.Json defaults are case-sensitive; JsonSerializerOptions.Web is not"],
  "TF-13": ["csharp-serialization", "System.Text.Json ignores nullable annotations unless RespectNullableAnnotations is set"],
  "TF-14": ["csharp-type-design", "Record equality is member-wise, but a collection member compares by reference"],
  "TF-15": ["aspnet-efcore-migrations", "dotnet ef migrations add scaffolds a migration without contacting a database"],
  "TF-16": ["aspnet-efcore-migrations", "dotnet ef migrations has-pending-model-changes exits 0 in sync and non-zero after a model change"],
  "TF-17": ["aspnet-efcore-migrations", "A simple property rename is scaffolded as RenameColumn"],
  "TF-18": ["aspnet-efcore-migrations", "A rename plus type change is scaffolded as DropColumn + AddColumn with a data-loss warning"],
  "TF-19": ["aspnet-efcore-migrations", "dotnet ef migrations script --idempotent guards each migration with IF NOT EXISTS checks"],
  "TF-20": ["csharp-code-analysis", "dotnet format whitespace --verify-no-changes exits 0 when clean and non-zero on a violation"],
  "TF-21": ["csharp-code-analysis", "TreatWarningsAsErrors turns nullable warning CS8618 into a build error"],
  "TF-22": ["csharp-project-maintenance", "global.json pins the SDK: dotnet --version reports the pinned version"],
  "TF-23": ["csharp-project-maintenance", "SDK 10: dotnet new sln creates a .slnx file, and the noun-first dotnet package list command exists"],
  "TF-24": ["aspnet-integration-testing", ".NET 8: WebApplicationFactory<Program> fails with CS0122 until public partial class Program is declared"],
  "TF-25": ["csharp-project-maintenance", "dotnet list package --vulnerable --include-transitive runs and reports"],
  "TF-26": ["aspnet-hosting-deployment", "dotnet publish -c Release produces the application assembly"],
  "TF-27": ["aspnet-request-pipeline", "UseStatusCodePages with AddProblemDetails gives an empty-body 404 a problem details body"],
  "TF-28": ["aspnet-authentication", "A protected endpoint with no default authentication scheme fails with a server error, not a 401"],
  "TF-29": ["csharp-async-concurrency", "Analyzer CA2016 reports a CancellationToken that is not forwarded (AnalysisMode All)"],
  "TF-30": ["csharp-memory-disposal", "Analyzer CA2000 reports an undisposed StreamReader (AnalysisMode All); it is a heuristic and misses some cases"],
  "TF-31": ["aspnet-performance", "Output caching (AddOutputCache, UseOutputCache, CacheOutput) serves a repeat GET from the cache"],
};

const results = {};
const set = (id, status, note) => { results[id] = { status, note }; };
const run = (cwd, args, extra = {}) => {
  const r = spawnSync("dotnet", args, { cwd, encoding: "utf8", timeout: 600000, env: { ...process.env, DOTNET_CLI_TELEMETRY_OPTOUT: "1", DOTNET_NOLOGO: "1" }, ...extra });
  return { code: r.status, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
};
const edit = (file, from, to) => {
  const t = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  if (!t.includes(from)) throw new Error(`edit anchor not found in ${path.basename(file)}: ${from.slice(0, 40)}`);
  fs.writeFileSync(file, t.replace(from, to));
};

const work = fs.mkdtempSync(path.join(os.tmpdir(), "chayen-dotnet-facts-"));
fs.cpSync(path.join(here, "fixture"), work, { recursive: true });
const sdks = run(work, ["--list-sdks"]).out.split(/\r?\n/).map((l) => l.split(" ")[0]).filter(Boolean);
const has = (major) => sdks.some((v) => v.startsWith(`${major}.`));
const sdk8 = sdks.filter((v) => v.startsWith("8.")).at(-1);
console.log(`SDKs: ${sdks.join(", ") || "none"}\nWork dir: ${work}\n`);

if (!has(10)) {
  for (const id of Object.keys(FACTS)) set(id, "NOT_RUN", "the .NET 10 SDK is not installed");
} else {
  // TF-01..TF-14, TF-27, TF-28, TF-31: xUnit tests in the fixture, one test per fact.
  const trxDir = path.join(work, "trx");
  const t = run(work, ["test", "tests/FactApi.Tests", "--logger", "trx;LogFileName=facts.trx", "--results-directory", trxDir]);
  const trx = fs.existsSync(path.join(trxDir, "facts.trx")) ? fs.readFileSync(path.join(trxDir, "facts.trx"), "utf8") : "";
  for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 27, 28, 31]) {
    const id = `TF-${String(n).padStart(2, "0")}`, prefix = `TF${String(n).padStart(2, "0")}_`;
    const m = new RegExp(`testName="[^"]*${prefix}[^"]*"[^>]*outcome="(\\w+)"`).exec(trx);
    if (!trx) set(id, "NOT_RUN", `dotnet test produced no results (exit ${t.code})`);
    else if (!m) set(id, "FAIL", "test not found in results");
    else set(id, m[1] === "Passed" ? "PASS" : "FAIL", `xUnit ${m[1]}`);
  }

  // TF-15..TF-19: EF Core migrations CLI.
  const api = path.join(work, "src", "FactApi"), program = path.join(api, "Program.cs");
  if (run(api, ["ef", "--version"]).code !== 0) {
    for (const id of ["TF-15", "TF-16", "TF-17", "TF-18", "TF-19"]) set(id, "NOT_RUN", "dotnet-ef is not installed (dotnet tool install --global dotnet-ef)");
  } else {
    const add = run(api, ["ef", "migrations", "add", "Initial"]);
    const migDir = path.join(api, "Migrations");
    const files = () => (fs.existsSync(migDir) ? fs.readdirSync(migDir) : []);
    set("TF-15", add.code === 0 && files().some((f) => f.endsWith("_Initial.cs")) ? "PASS" : "FAIL", `exit ${add.code}`);
    const inSync = run(api, ["ef", "migrations", "has-pending-model-changes"]);
    edit(program, 'public string Sku { get; set; } = "";', 'public string Code { get; set; } = "";');
    edit(program, "o.Sku == sku", "o.Code == sku");
    edit(program, "IsSpecial(o.Sku)", "IsSpecial(o.Code)");
    const pending = run(api, ["ef", "migrations", "has-pending-model-changes"]);
    set("TF-16", inSync.code === 0 && pending.code !== 0 ? "PASS" : "FAIL", `in sync exit ${inSync.code}, after change exit ${pending.code}`);
    run(api, ["ef", "migrations", "add", "RenameSku"]);
    const ren = files().find((f) => f.endsWith("_RenameSku.cs"));
    const renText = ren ? fs.readFileSync(path.join(migDir, ren), "utf8") : "";
    set("TF-17", /RenameColumn/.test(renText) && !/DropColumn/.test(renText) ? "PASS" : "FAIL", ren ? "RenameColumn scaffolded" : "migration not created");
    edit(program, "public int Quantity { get; set; }\n    }\n\n    public class AppDb", "public long Qty { get; set; }\n    }\n\n    public class AppDb");
    const retype = run(api, ["ef", "migrations", "add", "RenameAndRetype"]);
    const rt = files().find((f) => f.endsWith("_RenameAndRetype.cs"));
    const rtText = rt ? fs.readFileSync(path.join(migDir, rt), "utf8") : "";
    set("TF-18", /DropColumn/.test(rtText) && /AddColumn/.test(rtText) && /loss of data/.test(retype.out) ? "PASS" : "FAIL", "DropColumn + AddColumn, data-loss warning printed");
    const script = run(api, ["ef", "migrations", "script", "--idempotent"]);
    const guards = (script.out.match(/IF NOT EXISTS/g) ?? []).length;
    set("TF-19", script.code === 0 && guards >= 3 ? "PASS" : "FAIL", `${guards} IF NOT EXISTS guards for 3 migrations`);
  }

  // TF-20: dotnet format.
  {
    const dir = path.join(work, "fmt");
    fs.cpSync(path.join(here, "fixture", "src", "FactApi"), dir, { recursive: true });
    const clean = run(dir, ["format", "whitespace", "FactApi.csproj", "--verify-no-changes"]);
    fs.writeFileSync(path.join(dir, "Bad.cs"), "namespace FactApi;\npublic class Bad {\n        public int  X {get;set;}\n}\n");
    const dirty = run(dir, ["format", "whitespace", "FactApi.csproj", "--verify-no-changes"]);
    set("TF-20", clean.code === 0 && dirty.code !== 0 ? "PASS" : "FAIL", `clean exit ${clean.code}, violation exit ${dirty.code}`);
    // TF-21: warnings as errors (NuGet audit disabled here so only the compiler warning is measured).
    fs.writeFileSync(path.join(dir, "Bad.cs"), "namespace FactApi;\npublic class Warn\n{\n    public string Name { get; set; }\n}\n");
    const warnBuild = run(dir, ["build", "-p:NuGetAudit=false"]);
    const errBuild = run(dir, ["build", "-p:NuGetAudit=false", "-p:TreatWarningsAsErrors=true"]);
    // TF-29, TF-30: analyzers that the async and disposal guidance relies on.
    fs.writeFileSync(path.join(dir, "Bad.cs"), [
      "namespace FactApi;",
      "public static class Lints",
      "{",
      "    public static async Task Wait(CancellationToken ct) => await Task.Delay(100);",
      "    public static string? FirstLine(string p)",
      "    {",
      "        var reader = new StreamReader(p);",
      "        return reader.ReadLine();",
      "    }",
      "}",
      "",
    ].join("\n"));
    const lint = run(dir, ["build", "-p:NuGetAudit=false", "-p:AnalysisMode=All", "--no-incremental"]);
    const reported = (rule) => new RegExp(`warning ${rule}`).test(lint.out);
    set("TF-29", reported("CA2016") ? "PASS" : "FAIL", `CA2016 ${reported("CA2016") ? "reported" : "not reported"}`);
    set("TF-30", reported("CA2000") ? "PASS" : "FAIL", `CA2000 ${reported("CA2000") ? "reported" : "not reported"}`);
    set("TF-21", warnBuild.code === 0 && /warning CS8618/.test(warnBuild.out) && errBuild.code !== 0 && /error CS8618/.test(errBuild.out) ? "PASS" : "FAIL", `default exit ${warnBuild.code} (warning), warnings-as-errors exit ${errBuild.code}`);
  }

  // TF-22: global.json SDK pinning.
  if (!sdk8) set("TF-22", "NOT_RUN", "no .NET 8 SDK installed to pin");
  else {
    const dir = path.join(work, "pin");
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, "global.json"), JSON.stringify({ sdk: { version: sdk8 } }));
    const v = run(dir, ["--version"]).out.trim();
    set("TF-22", v === sdk8 ? "PASS" : "FAIL", `pinned ${sdk8}, reported ${v}`);
  }

  // TF-23: SDK 10 solution format and noun-first commands.
  {
    const dir = path.join(work, "sln");
    fs.mkdirSync(dir);
    const s = run(dir, ["new", "sln", "-n", "Facts"]);
    const noun = run(dir, ["package", "list", "--help"]);
    const slnx = fs.existsSync(path.join(dir, "Facts.slnx"));
    set("TF-23", s.code === 0 && slnx && noun.code === 0 ? "PASS" : "FAIL", `slnx created: ${slnx}; dotnet package list --help exit ${noun.code}`);
  }

  // TF-25: vulnerability listing.
  {
    const r = run(path.join(work, "src", "FactApi"), ["list", "package", "--vulnerable", "--include-transitive"]);
    set("TF-25", r.code === 0 && /vulnerable/i.test(r.out) ? "PASS" : "FAIL", `exit ${r.code}`);
  }

  // TF-26: publish.
  {
    const out = path.join(work, "publish");
    const r = run(path.join(work, "src", "FactApi"), ["publish", "-c", "Release", "-o", out, "-p:NuGetAudit=false"]);
    set("TF-26", r.code === 0 && fs.existsSync(path.join(out, "FactApi.dll")) ? "PASS" : "FAIL", `exit ${r.code}`);
  }
}

// TF-24: .NET 8 contrast.
if (!has(8)) set("TF-24", "NOT_RUN", "the .NET 8 SDK is not installed");
else {
  const dir = path.join(work, "net8");
  const before = run(dir, ["test", "Api8.Tests"]);
  fs.appendFileSync(path.join(dir, "Api8", "Program.cs"), "public partial class Program { }\n");
  const after = run(dir, ["test", "Api8.Tests"]);
  set("TF-24", /error CS0122/.test(before.out) && after.code === 0 ? "PASS" : "FAIL", `without partial: ${/error CS0122/.test(before.out) ? "CS0122" : `exit ${before.code}`}; with partial: exit ${after.code}`);
}

const rows = Object.entries(FACTS).map(([id, [cap, text]]) => ({ id, capability: cap, fact: text, ...(results[id] ?? { status: "NOT_RUN", note: "not reached" }) }));
for (const r of rows) console.log(`${r.status.padEnd(7)} ${r.id} ${r.capability}: ${r.fact} (${r.note})`);
const count = (s) => rows.filter((r) => r.status === s).length;
console.log(`\n${count("PASS")} PASS, ${count("FAIL")} FAIL, ${count("NOT_RUN")} NOT_RUN of ${rows.length} facts`);
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify({ sdks, rows }, null, 2));
if (!keep) fs.rmSync(work, { recursive: true, force: true });
process.exit(count("FAIL") ? 1 : 0);
