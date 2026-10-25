// Offline checks of the D-078 fixtures and deterministic grader controls.
// These checks execute no provider and do not establish agent behavior.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const casesRoot = path.join(import.meta.dirname, "claude");
const ids = ["pos-init-project-knowledge", "pos-init-refresh", "pos-init-monorepo-pointer", "pos-init-direct-write-report"];
function pattern(id, name) {
  const text = fs.readFileSync(path.join(casesRoot, id, "graders", `${name}.md`), "utf8");
  const value = JSON.parse(/^pattern: (.+)$/m.exec(text)[1]);
  const flags = /^flags: (.+)$/m.exec(text)?.[1].trim() ?? "";
  return new RegExp(value, flags);
}

for (const id of ids) test(`${id}: scaffold creates only the isolated fixture`, (t) => {
  const parent = path.resolve(os.tmpdir());
  const scratch = fs.mkdtempSync(path.join(parent, "init-eval-"));
  t.after(() => {
    assert.ok(path.resolve(scratch).startsWith(parent + path.sep));
    fs.rmSync(scratch, { recursive: true, force: true });
  });
  const scaffold = fs.readFileSync(path.join(casesRoot, id, "scaffold.sh"), "utf8");
  const script = /<<'INIT_FIXTURE'\r?\n([\s\S]*?)\r?\nINIT_FIXTURE/.exec(scaffold)?.[1];
  assert.ok(script, "scaffold must contain the Node fixture body");
  const run = spawnSync(process.execPath, ["--input-type=module", "-e", script], { cwd: scratch, encoding: "utf8" });
  assert.equal(run.status, 0, run.stderr);
  const read = (p) => fs.readFileSync(path.join(scratch, p), "utf8");
  const instructions = read("AGENTS.md");
  assert.ok(pattern(id, "instructions-preserved").test(instructions));
  assert.ok(!pattern(id, "instructions-preserved").test(instructions + "<!-- BEGIN .chayen project knowledge v1 -->\n"));
  assert.ok(!fs.existsSync(path.join(scratch, ".chayen/init-report.md")), "the agent must create the report");
  if (id === "pos-init-refresh") {
    const rules = read(".chayen/rules.md");
    assert.ok(pattern(id, "rules-preserved").test(rules));
    assert.ok(!pattern(id, "rules-preserved").test(rules + "New rule\n"));
    const updated = pattern(id, "refreshed-profile");
    assert.ok(!updated.test(read(".chayen/profile.md")), "stale profile must fail");
    assert.ok(updated.test(".NET 9\ntests/Api.Tests\n"));
    assert.ok(!updated.test(".NET 8\ntests/Api.Tests\n"));
    assert.ok(!updated.test(".NET 9\ntests/Api.Tests\ntests/Old.Tests\n"));
  } else {
    assert.ok(!fs.existsSync(path.join(scratch, ".chayen")), "initialize must start without knowledge");
  }
  if (id === "pos-init-monorepo-pointer") {
    assert.match(read("api/Api.csproj"), /net9\.0/);
    assert.equal(JSON.parse(read("web/package.json")).name, "web");
  } else assert.match(read("Api.csproj"), /net9\.0/);
});

test("report budget rejects 121 lines; schema graders reject missing and newer schemas", () => {
  for (const id of ids) {
    const budget = pattern(id, "report-budget");
    assert.ok(budget.test("line\n".repeat(120)));
    assert.ok(!budget.test("line\n".repeat(121)));
    for (const file of ["profile", "conventions", "init-report"]) {
      const schema = pattern(id, `schema-${file}`);
      assert.ok(schema.test("---\nschema: project-knowledge/1\nfile: profile\n---\n"));
      assert.ok(schema.test("---\nfile: profile\nschema: project-knowledge/1\n---\n"));
      assert.ok(!schema.test("---\nschema: project-knowledge/2\n---\n"));
      assert.ok(!schema.test("---\nfile: profile\n---\nschema: project-knowledge/1\n"));
    }
  }
});
