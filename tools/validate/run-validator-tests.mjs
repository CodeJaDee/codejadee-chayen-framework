#!/usr/bin/env node
// Developer-only self-test for the validators (quality gate G-13).
// Copies the relevant parts of the repository into a temporary directory,
// applies one declarative mutation per case, runs the validator named by
// the case, and asserts that it fails with the expected check ID. The
// unmutated copy must pass every validator first (baseline).
// Zero dependencies (Node.js >= 20.11, for import.meta.dirname). Never shipped.
//
// Usage: node tools/validate/run-validator-tests.mjs [--only <case-id>] [--keep]
// Case files: tests/catalog/catalog-mutations.json, tests/skills/validator-mutations.json,
// tests/catalog/technology-mutations.json, tests/catalog/workflow-mutations.json,
// tests/catalog/editorial-mutations.json, tests/catalog/project-mutations.json,
// tests/response-style/response-style-mutations.json

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { inside, safeId, assertTreeNoLinks } from "./safe-paths.mjs";

const repo = path.resolve(import.meta.dirname, "..", "..");
const argv = process.argv.slice(2);
const only = argv.includes("--only") ? argv[argv.indexOf("--only") + 1] : null;
const keep = argv.includes("--keep");
const COPY = ["plugins", ".claude-plugin", ".github/plugin", ".agents/plugins", "catalog", "tests/skills", "tests/editorial", "docs/chayen/CAPABILITY_COVERAGE.md", "docs/chayen/TECHNOLOGY_COVERAGE.md", "docs/chayen/WORKFLOW_COVERAGE.md", "tests/technology/dotnet/run-fact-checks.mjs", "tests/technology/angular-typescript/run-fact-checks.mjs", "tests/technology/react-nextjs/run-fact-checks.mjs", "tests/technology/vue-nuxt-vite/run-fact-checks.mjs", "tests/technology/sqlserver/run-fact-checks.mjs", "tests/technology/sqlserver/fixture", "tests/technology/postgres-crossstack/run-fact-checks.mjs", "tests/technology/postgres-crossstack/fixture", "response-style", "docs/RESPONSE_STYLE.md", "docs/chayen/RESPONSE_STYLE_DESIGN.md", "tools/response-style"];
const SUITES = ["tests/catalog/catalog-mutations.json", "tests/skills/validator-mutations.json", "tests/catalog/technology-mutations.json", "tests/catalog/workflow-mutations.json", "tests/catalog/editorial-mutations.json", "tests/catalog/project-mutations.json", "tests/response-style/response-style-mutations.json"];
const VALIDATORS = {
  package: (dir) => [path.join(repo, "tools/validate/validate-package.mjs"), dir],
  catalog: (dir) => [path.join(repo, "tools/catalog/check-catalog.mjs"), "--root", dir],
  technology: (dir) => [path.join(repo, "tools/catalog/check-technology.mjs"), "--root", dir],
  workflows: (dir) => [path.join(repo, "tools/catalog/check-workflows.mjs"), "--root", dir],
  editorial: (dir) => [path.join(repo, "tools/validate/check-editorial-cases.mjs"), "--root", dir],
  "response-style": (dir) => [path.join(repo, "tools/validate/check-response-style.mjs"), "--root", dir],
};

const tmpRoot = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), "chayen-vt-"));
function freshCopy(name) {
  const dir = inside(tmpRoot, safeId(name));
  fs.mkdirSync(dir);
  for (const rel of COPY) {
    const src = inside(repo, rel);
    if (fs.existsSync(src)) fs.cpSync(src, inside(dir, rel), {
      recursive: true,
      filter: source => {
        if (fs.lstatSync(source).isSymbolicLink()) throw new Error("refusing a linked fixture source");
        return !["bin", "obj", "node_modules", ".git"].includes(path.basename(source));
      },
    });
  }
  return dir;
}
function run(validator, dir) {
  const r = spawnSync(process.execPath, VALIDATORS[validator](dir), { encoding: "utf8", timeout: 30_000 });
  return { status: r.status, out: `${r.stdout}${r.stderr}` };
}
function apply(dir, e) {
  const file = e.file ? inside(dir, e.file) : null;
  const read = () => fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  switch (e.op) {
    case "replace": {
      const t = read(), n = t.split(e.find).length - 1;
      if (n !== 1) throw new Error(`replace: "${e.find.slice(0, 50)}" occurs ${n} times in ${e.file}`);
      fs.writeFileSync(file, t.replace(e.find, () => e.with));
      break;
    }
    case "regex": {
      const t = read(), u = t.replace(new RegExp(e.pattern, e.flags ?? ""), e.with);
      if (u === t) throw new Error(`regex: /${e.pattern}/ did not match in ${e.file}`);
      fs.writeFileSync(file, u);
      break;
    }
    case "write": fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, e.content); break;
    case "append": fs.appendFileSync(file, e.content.repeat(e.repeat ?? 1)); break;
    case "delete": fs.rmSync(file, { recursive: true }); break;
    case "copydir": {
      const source = inside(dir, e.from), target = inside(dir, e.to);
      assertTreeNoLinks(source);
      fs.cpSync(source, target, { recursive: true });
      break;
    }
    default: throw new Error(`unknown op ${e.op}`);
  }
}

const rows = [];
let failed = 0;
// Baseline: the unmutated copy must pass every validator.
{
  const dir = freshCopy("baseline");
  for (const v of Object.keys(VALIDATORS)) {
    const r = run(v, dir);
    const ok = r.status === 0;
    if (!ok) failed++;
    rows.push(`${ok ? "PASS" : "FAIL"}  baseline/${v}: exit ${r.status}${ok ? "" : `\n${r.out.split("\n").filter((l) => l.startsWith("ERROR")).slice(0, 5).join("\n")}`}`);
  }
}
for (const suite of SUITES) {
  const spec = JSON.parse(fs.readFileSync(path.join(repo, suite), "utf8"));
  for (const c of spec.cases) {
    if (only && c.id !== only) continue;
    const dir = freshCopy(c.id);
    try { for (const e of c.edits) apply(dir, e); }
    catch (err) { failed++; rows.push(`FAIL  ${c.id}: mutation not applied (${err.message})`); continue; }
    const r = run(c.expect.validator, dir);
    const hit = r.out.split("\n").find((l) => l.startsWith(`ERROR ${c.expect.error}`) && (!c.expect.message || l.includes(c.expect.message)));
    const ok = r.status === 1 && Boolean(hit);
    if (!ok) failed++;
    rows.push(`${ok ? "PASS" : "FAIL"}  ${c.id}: expect ${c.expect.validator} ${c.expect.error} → exit ${r.status}${hit ? `; ${hit.slice(0, 140)}` : "; expected error not reported"}`);
  }
}
if (!keep) {
  if (path.dirname(tmpRoot) !== fs.realpathSync(os.tmpdir()) || !path.basename(tmpRoot).startsWith("chayen-vt-")) throw new Error("unexpected temporary cleanup target");
  fs.rmSync(tmpRoot, { recursive: true, force: true });
}
console.log(rows.join("\n"));
const total = rows.length;
console.log(`\n${total - failed}/${total} passed${keep ? ` (kept ${tmpRoot})` : ""}`);
process.exit(failed ? 1 : 0);
