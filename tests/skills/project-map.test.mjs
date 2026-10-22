// Developer-only project-map regressions (evolution Step 10). Builds a disposable git monorepo (.NET solution with
// several projects and SQL Server, an Angular app, a Python service) with a .chayen/ map written in the shipped
// unit-template shape, then exercises the documented read-only mechanics: the staleness check readers run
// (git diff / git status / tree ids), and citation checks that make an invented dependency detectable.
// It verifies the template contract and the git mechanics; agent behaviour is NOT_RUN. Offline; never shipped.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { inside } from "../../tools/validate/safe-paths.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const SKILLS = "plugins/codejadee-chayen-framework/skills";
const hasGit = spawnSync("git", ["--version"], { encoding: "utf8" }).status === 0;

function git(root, ...args) {
  const r = spawnSync("git", ["-c", "core.autocrlf=false", "-c", "user.email=map@example.invalid", "-c", "user.name=map", ...args], { cwd: root, encoding: "utf8" });
  // Trim only the end: `git status --porcelain` lines start with a significant space (" M path").
  return { code: r.status, out: (r.stdout ?? "").replace(/\s+$/, ""), err: r.stderr ?? "" };
}
const write = (root, rel, text) => { const f = path.join(root, ...rel.split("/")); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };
const read = (root, rel) => fs.readFileSync(path.join(root, ...rel.split("/")), "utf8");
const lineOf = (root, rel, token) => { const i = read(root, rel).split("\n").findIndex((l) => l.includes(token)); assert.ok(i >= 0, `${rel} lacks ${token}`); return `${rel}:${i + 1}`; };

// The unit template shipped in chayen-init: its "##" headings and header keys.
function unitTemplate() {
  const t = fs.readFileSync(inside(repo, `${SKILLS}/chayen-init/references/profile-template.md`), "utf8").replace(/\r\n/g, "\n");
  const block = /## Unit file template\n\n```markdown\n([\s\S]*?)\n```/.exec(t)?.[1] ?? "";
  return { headings: [...block.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim()), header: block.split("---")[1] ?? "" };
}

const SOURCES = {
  "dotnet/Shop.sln": "Project(\"Shop.Api\") = \"dotnet/Shop.Api/Shop.Api.csproj\"\nProject(\"Shop.Core\") = \"dotnet/Shop.Core/Shop.Core.csproj\"\nProject(\"Shop.Data\") = \"dotnet/Shop.Data/Shop.Data.csproj\"\nProject(\"Shop.Tests\") = \"dotnet/Shop.Tests/Shop.Tests.csproj\"\n",
  "dotnet/Shop.Api/Shop.Api.csproj": "<Project Sdk=\"Microsoft.NET.Sdk.Web\">\n  <PropertyGroup><TargetFramework>net8.0</TargetFramework></PropertyGroup>\n  <ItemGroup>\n    <ProjectReference Include=\"..\\Shop.Core\\Shop.Core.csproj\" />\n    <ProjectReference Include=\"..\\Shop.Data\\Shop.Data.csproj\" />\n  </ItemGroup>\n</Project>\n",
  "dotnet/Shop.Api/Program.cs": "var app = WebApplication.CreateBuilder(args).Build();\napp.MapGet(\"/api/orders\", (IOrderRepository repo) => repo.GetOrders());\nvar exporter = Activator.CreateInstance(Type.GetType(\"Shop.Api.InvoiceExporter\")!);\napp.Run();\n",
  "dotnet/Shop.Core/Shop.Core.csproj": "<Project Sdk=\"Microsoft.NET.Sdk\">\n  <PropertyGroup><TargetFramework>net8.0</TargetFramework></PropertyGroup>\n</Project>\n",
  "dotnet/Shop.Core/IOrderRepository.cs": "public interface IOrderRepository { IEnumerable<Order> GetOrders(); }\n",
  "dotnet/Shop.Data/Shop.Data.csproj": "<Project Sdk=\"Microsoft.NET.Sdk\">\n  <ItemGroup>\n    <PackageReference Include=\"Microsoft.EntityFrameworkCore.SqlServer\" Version=\"8.0.8\" />\n  </ItemGroup>\n</Project>\n",
  "dotnet/Shop.Data/OrdersDb.cs": "options.UseSqlServer(configuration.GetConnectionString(\"Orders\"));\n",
  "dotnet/Shop.Data/Migrations/20260101_Init.cs": "migrationBuilder.Sql(\"CREATE PROCEDURE dbo.usp_GetOrders AS SELECT * FROM dbo.Orders\");\n",
  "dotnet/Shop.Tests/Shop.Tests.csproj": "<Project Sdk=\"Microsoft.NET.Sdk\">\n  <ItemGroup>\n    <ProjectReference Include=\"..\\Shop.Api\\Shop.Api.csproj\" />\n  </ItemGroup>\n</Project>\n",
  "web/admin/package.json": "{\n  \"name\": \"admin\",\n  \"dependencies\": {\n    \"@angular/core\": \"19.2.0\"\n  },\n  \"scripts\": { \"test\": \"ng test --watch=false\" }\n}\n",
  "web/admin/angular.json": "{ \"projects\": { \"admin\": { \"root\": \"\" } } }\n",
  "web/admin/src/app/orders.service.ts": "@Injectable({ providedIn: 'root' })\nexport class OrdersService {\n  list() { return this.http.get<Order[]>('/api/orders'); }\n}\n",
  "web/admin/src/app/app.routes.ts": "export const routes = [{ path: 'reports', loadChildren: () => import('./reports/routes') }];\n",
  "services/reporting/pyproject.toml": "[project]\nname = \"reporting\"\ndependencies = [\"sqlalchemy==2.0.30\"]\n",
  "services/reporting/report.py": "def monthly_total(rows):\n    return sum(r.total for r in rows)\n",
};

// Writes .chayen/units/<unit>.md in the template shape, with evidence blobs and tree ids computed by git.
function writeUnit(root, unit, { evidence, folders = [], sections }) {
  const commit = git(root, "rev-parse", "HEAD").out;
  const ev = [...evidence.map((p) => `  - path: ${p}\n    blob: ${git(root, "hash-object", p).out}`), ...folders.map((p) => `  - path: ${p}\n    tree: ${git(root, "rev-parse", `HEAD:${p}`).out}`)].join("\n");
  const body = unitTemplate().headings.map((h) => `## ${h}\n${sections[h] ?? "unknown"}\n`).join("\n");
  write(root, `.chayen/units/${unit}.md`, `---\nschema: project-knowledge/1\nfile: unit\nunit: ${unit}\ngenerated_commit: ${commit}\ngenerated_date: 2026-10-22\nevidence:\n${ev}\n---\n<!-- Generated. Refresh it instead of editing it by hand. Team rules go in rules.md. -->\n\n# Unit: ${unit}\n\n${body}`);
}
function fixture(t) {
  const parent = fs.realpathSync(os.tmpdir()), root = fs.mkdtempSync(path.join(parent, "chayen-map-"));
  t.after(() => { assert.equal(path.dirname(root), parent); fs.rmSync(root, { recursive: true, force: true }); });
  for (const [rel, text] of Object.entries(SOURCES)) write(root, rel, text);
  assert.equal(git(root, "init", "-q").code, 0);
  git(root, "add", "-A"); assert.equal(git(root, "commit", "-qm", "fixture").code, 0);
  const at = (rel, token) => lineOf(root, rel, token);
  writeUnit(root, "api", {
    evidence: ["dotnet/Shop.Api/Shop.Api.csproj", "dotnet/Shop.Api/Program.cs", "dotnet/Shop.Data/Shop.Data.csproj", "dotnet/Shop.Tests/Shop.Tests.csproj"],
    folders: ["dotnet/Shop.Data/Migrations"],
    sections: {
      "Stack": `.NET net8.0 (${at("dotnet/Shop.Api/Shop.Api.csproj", "net8.0")}); Microsoft.EntityFrameworkCore.SqlServer 8.0.8 (${at("dotnet/Shop.Data/Shop.Data.csproj", "SqlServer")})`,
      "Boundary and dependencies": `| Depends on | Kind | Evidence |\n|---|---|---|\n| Shop.Core | project reference | ${at("dotnet/Shop.Api/Shop.Api.csproj", "Shop.Core")} |\n| Shop.Data | project reference | ${at("dotnet/Shop.Api/Shop.Api.csproj", "Shop.Data")} |`,
      "Entry points": `| Entry point | Kind | Evidence |\n|---|---|---|\n| MapGet | host startup and route | ${at("dotnet/Shop.Api/Program.cs", "MapGet")} |`,
      "API ownership and consumers": `| API or contract | Owned in | Consumers | Evidence |\n|---|---|---|---|\n| /api/orders | dotnet/Shop.Api/Program.cs | web/admin OrdersService | ${at("web/admin/src/app/orders.service.ts", "/api/orders")} |\n| /api/orders | dotnet/Shop.Api/Program.cs | external callers unknown | unknown |`,
      "Data": `SQL Server through UseSqlServer (${at("dotnet/Shop.Data/OrdersDb.cs", "UseSqlServer")}); migrations in dotnet/Shop.Data/Migrations; stored procedure usp_GetOrders (${at("dotnet/Shop.Data/Migrations/20260101_Init.cs", "usp_GetOrders")})`,
      "Tests": "| Test project or folder | Covers | Command | Status |\n|---|---|---|---|\n| dotnet/Shop.Tests | Shop.Api | `dotnet test dotnet/Shop.sln` | inferred |",
      "Generated code": "none found; searched: Designer.cs, autogenerated, openapi",
      "Dynamic references": `| Mechanism | Where | Evidence |\n|---|---|---|\n| Activator.CreateInstance | dotnet/Shop.Api/Program.cs | ${at("dotnet/Shop.Api/Program.cs", "Activator.CreateInstance")} |`,
    },
  });
  writeUnit(root, "admin", {
    evidence: ["web/admin/package.json", "web/admin/src/app/orders.service.ts", "web/admin/src/app/app.routes.ts"],
    sections: {
      "Stack": `Angular 19.2.0 (${at("web/admin/package.json", "@angular/core")})`,
      "Dynamic references": `| Mechanism | Where | Evidence |\n|---|---|---|\n| loadChildren | web/admin/src/app/app.routes.ts | ${at("web/admin/src/app/app.routes.ts", "loadChildren")} |`,
    },
  });
  writeUnit(root, "reporting", { evidence: ["services/reporting/pyproject.toml"], sections: { "Stack": `Python with sqlalchemy 2.0.30 (${at("services/reporting/pyproject.toml", "sqlalchemy")})` } });
  git(root, "add", "-A"); git(root, "commit", "-qm", "project map");
  return root;
}

// The documented reader check (detection-and-refresh "Staleness check for readers"), read-only.
function staleness(root, unit) {
  const file = path.join(root, ".chayen", "units", `${unit}.md`);
  if (!fs.existsSync(file)) return { status: "absent", changed: [] };
  const header = fs.readFileSync(file, "utf8").split("---")[1];
  const commit = /generated_commit: (\S+)/.exec(header)[1];
  const files = [...header.matchAll(/- path: (\S+)\n\s+blob: \S+/g)].map((m) => m[1]);
  const folders = [...header.matchAll(/- path: (\S+)\n\s+tree: (\S+)/g)].map((m) => ({ path: m[1], tree: m[2] }));
  if (commit === "none" || git(root, "cat-file", "-e", `${commit}^{commit}`).code !== 0) return { status: "unconfirmed", changed: [] };
  const paths = [...files, ...folders.map((f) => f.path)];
  const changed = new Set([...git(root, "diff", "--name-only", commit, "HEAD", "--", ...paths).out.split("\n"), ...git(root, "status", "--porcelain", "--", ...paths).out.split("\n").map((l) => l.slice(3))].filter(Boolean));
  for (const f of folders) if (git(root, "rev-parse", `HEAD:${f.path}`).out !== f.tree) changed.add(`${f.path}/`);
  return { status: changed.size ? "stale" : "fresh", changed: [...changed].sort() };
}
// Every table row citing path:line must cite a line that contains the row's first cell (what the row claims).
function inventedRows(root, unit) {
  const bad = [];
  for (const row of fs.readFileSync(path.join(root, ".chayen", "units", `${unit}.md`), "utf8").split("\n").filter((l) => /^\| [^-|]/.test(l))) {
    const cells = row.slice(1, -1).split("|").map((c) => c.trim()), cite = /([\w./-]+\.\w+):(\d+)/.exec(cells.at(-1));
    if (!cite) continue;
    const lines = fs.existsSync(path.join(root, cite[1])) ? read(root, cite[1]).split("\n") : [];
    const line = lines[Number(cite[2]) - 1] ?? "", claim = cells[0].split(" ")[0];
    if (!line.includes(claim) && !line.includes(cells[2]?.split(" ")[0] ?? "\0")) bad.push(row);
  }
  return bad;
}

test("the unit template carries every impact-map section and folder fingerprints", () => {
  const { headings, header } = unitTemplate();
  for (const h of ["Stack", "Boundary and dependencies", "Entry points", "API ownership and consumers", "Data", "Tests", "Commands", "Generated code", "Dynamic references", "Unknowns"]) assert.ok(headings.includes(h), `unit template lacks "## ${h}"`);
  assert.match(header, /schema: project-knowledge\/1/);
  assert.match(header, /blob: /);
  assert.match(header, /tree: /);
});

test("readers start from the map, confirm it, and never treat a missing entry as absence", () => {
  const recipe = fs.readFileSync(inside(repo, `${SKILLS}/chayen-repository/references/dependency-and-impact.md`), "utf8").replace(/\s+/g, " ");
  assert.match(recipe, /read only that unit file in `\.chayen\/units\/`/);
  assert.match(recipe, /the source wins, and report that the map is stale/);
  assert.match(recipe, /A missing map entry never proves that a dependency or consumer is absent/);
  const detection = fs.readFileSync(inside(repo, `${SKILLS}/chayen-init/references/detection-and-refresh.md`), "utf8").replace(/\s+/g, " ");
  assert.match(detection, /never refresh without an explicit request/);
});

for (const [name, fn] of [
  ["a fresh map is detected as fresh for every unit", (root) => {
    for (const unit of ["api", "admin", "reporting"]) assert.deepEqual(staleness(root, unit), { status: "fresh", changed: [] }, unit);
  }],
  ["a committed dependency change marks only the owning unit stale", (root) => {
    write(root, "dotnet/Shop.Api/Shop.Api.csproj", read(root, "dotnet/Shop.Api/Shop.Api.csproj").replace("</ItemGroup>", "  <PackageReference Include=\"Polly\" Version=\"8.4.1\" />\n  </ItemGroup>"));
    git(root, "commit", "-qam", "add Polly");
    assert.deepEqual(staleness(root, "api"), { status: "stale", changed: ["dotnet/Shop.Api/Shop.Api.csproj"] });
    assert.equal(staleness(root, "admin").status, "fresh");
    assert.equal(staleness(root, "reporting").status, "fresh");
  }],
  ["a new migration changes the migrations tree id", (root) => {
    write(root, "dotnet/Shop.Data/Migrations/20261022_AddStatus.cs", "migrationBuilder.AddColumn<string>(\"Status\", \"Orders\");\n");
    git(root, "add", "-A"); git(root, "commit", "-qm", "migration");
    const s = staleness(root, "api");
    assert.equal(s.status, "stale");
    assert.ok(s.changed.includes("dotnet/Shop.Data/Migrations/"), JSON.stringify(s));
  }],
  ["an uncommitted change to an API consumer is detected", (root) => {
    write(root, "web/admin/src/app/orders.service.ts", read(root, "web/admin/src/app/orders.service.ts").replace("'/api/orders'", "'/api/v2/orders'"));
    assert.deepEqual(staleness(root, "admin"), { status: "stale", changed: ["web/admin/src/app/orders.service.ts"] });
  }],
  ["an unknown generated_commit makes the map unconfirmed", (root) => {
    const f = ".chayen/units/api.md";
    write(root, f, read(root, f).replace(/generated_commit: \S+/, `generated_commit: ${"0".repeat(40)}`));
    assert.equal(staleness(root, "api").status, "unconfirmed");
    write(root, f, read(root, f).replace(/generated_commit: \S+/, "generated_commit: none"));
    assert.equal(staleness(root, "api").status, "unconfirmed");
  }],
  ["a missing map is reported as absent", (root) => {
    fs.rmSync(path.join(root, ".chayen"), { recursive: true });
    assert.deepEqual(staleness(root, "api"), { status: "absent", changed: [] });
  }],
  ["every cited dependency, consumer and dynamic reference holds; an invented one is detected", (root) => {
    for (const unit of ["api", "admin", "reporting"]) assert.deepEqual(inventedRows(root, unit), [], unit);
    const f = ".chayen/units/api.md";
    write(root, f, read(root, f).replace("| Shop.Data | project reference |", `| Shop.Payments | project reference | ${lineOf(root, "dotnet/Shop.Api/Shop.Api.csproj", "Shop.Core")} |\n| Shop.Data | project reference |`));
    assert.equal(inventedRows(root, "api").length, 1);
  }],
  ["reflection and API consumers are recorded with evidence, and no consumer is invented", (root) => {
    const api = read(root, ".chayen/units/api.md"), reporting = read(root, ".chayen/units/reporting.md");
    assert.match(api, /\| Activator\.CreateInstance \| dotnet\/Shop\.Api\/Program\.cs \| dotnet\/Shop\.Api\/Program\.cs:3 \|/);
    assert.match(api, /\| \/api\/orders \| dotnet\/Shop\.Api\/Program\.cs \| web\/admin OrdersService \| web\/admin\/src\/app\/orders\.service\.ts:3 \|/);
    assert.match(api, /external callers unknown \| unknown \|/);
    assert.doesNotMatch(read(root, "services/reporting/report.py"), /\/api\/orders/);
    assert.doesNotMatch(api, /services\/reporting/, "the Python service does not call the API, so it is not listed as a consumer");
    assert.doesNotMatch(reporting, /\/api\/orders/);
    assert.match(read(root, ".chayen/units/admin.md"), /\| loadChildren \|/);
  }],
  ["the reader check writes nothing", (root) => {
    const before = git(root, "status", "--porcelain").out;
    for (const unit of ["api", "admin", "reporting"]) staleness(root, unit);
    assert.equal(git(root, "status", "--porcelain").out, before);
  }],
]) test(name, { skip: hasGit ? false : "git is not available on this host" }, (t) => fn(fixture(t)));
