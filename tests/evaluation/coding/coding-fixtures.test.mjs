// Developer-only fast regressions for the coding-fixture runner (evolution Step 15, D-072). They need only
// Node: workspace diffing, scope globs, the answer parser, the structural check and the Node-graded
// task C. The .NET and SQL Server oracles are exercised by `run-coding-fixtures.mjs --verify`.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { changes, matches, parseAnswer, checkTask, loadTasks, grade, TASKS } from "./run-coding-fixtures.mjs";

const tmp = (t) => { const d = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), "chayen-coding-test-")); t.after(() => fs.rmSync(d, { recursive: true, force: true })); return d; };
const copyTask = (t, id) => { const d = path.join(tmp(t), id); fs.cpSync(path.join(TASKS, id), d, { recursive: true }); return d; };
const task = (id) => loadTasks(id)[0];

test("six tasks cover the required categories and every task passes the structural check", () => {
  const all = loadTasks();
  assert.deepEqual(all.map((x) => x.task.category), ["backend-bug-fix", "cross-layer-feature", "frontend-behaviour", "database-correctness", "scope-and-requirements", "evidence-completion"]);
  assert.deepEqual(all.flatMap(checkTask), []);
  for (const { task: t } of all) {
    assert.ok(t.expected.negatives.length >= 2, `${t.id} has at least two known-bad outputs`);
    assert.ok(t.acceptanceCriteria.length >= 3 && t.negativeChecks.length >= 2, `${t.id} criteria and negative checks`);
  }
});

test("workspace changes are found by content, ignoring build output and line endings", (t) => {
  const a = tmp(t), b = tmp(t);
  fs.writeFileSync(path.join(a, "x.cs"), "a\nb\n"); fs.writeFileSync(path.join(b, "x.cs"), "a\r\nb\r\n");
  fs.writeFileSync(path.join(a, "y.cs"), "1"); fs.writeFileSync(path.join(b, "y.cs"), "2");
  fs.writeFileSync(path.join(b, "new.cs"), "n");
  for (const d of ["bin", "obj", ".grader", ".git", "node_modules"]) { fs.mkdirSync(path.join(b, d)); fs.writeFileSync(path.join(b, d, "f"), "x"); }
  fs.writeFileSync(path.join(a, "gone.cs"), "g");
  assert.deepEqual(changes(b, a), { added: ["new.cs"], modified: ["y.cs"], deleted: ["gone.cs"], all: ["gone.cs", "new.cs", "y.cs"] });
});

test("scope globs", () => {
  assert.ok(matches("src/Orders.Api/Paging/Pager.cs", ["src/Orders.Api/**"]));
  assert.ok(matches("src/Orders.Api/Orders.Api.csproj", ["**/*.csproj"]));
  assert.ok(!matches("global.json", ["**/*.csproj"]));
  assert.ok(matches("db/migrations/V3.sql", ["db/**"]));
  assert.ok(matches("anything/at/all.cs", ["**"]));
  assert.ok(!matches("tests/x.cs", ["src/**"]));
});

test("the answer parser reads the outcome and one verdict per criterion", () => {
  const a = parseAnswer("Outcome: PARTIAL (next: run X)\n| AC-1 | ... | PASSED | accept | none |\n| AC-3 | skipped | SKIPPED | verify_more | env |\nAC-2 was accepted earlier");
  assert.equal(a.outcome, "PARTIAL");
  assert.deepEqual(a.verdicts, { "AC-1": "accept", "AC-3": "verify_more" });
  assert.equal(parseAnswer("All good, it works.").outcome, null);
});

test("structural check rejects evaluator files in repo/, secrets, local paths, scripts, a missing negative and a Chayen prompt", (t) => {
  const dir = copyTask(t, "C-angular-interaction");
  const j = path.join(dir, "task.json"), base = JSON.parse(fs.readFileSync(j, "utf8"));
  const check = (mutate) => { const v = structuredClone(base); mutate(v); fs.writeFileSync(j, JSON.stringify(v)); return checkTask({ dir, task: v }); };
  assert.deepEqual(check(() => {}), []);
  assert.ok(check((v) => { v.grading[1].grader = "repo/src/x.ts"; }).some((e) => /outside repo\//.test(e) || /does not exist/.test(e)));
  assert.ok(check((v) => { v.prompt += " Use Chayen."; }).some((e) => /must not mention Chayen/.test(e)));
  assert.ok(check((v) => { v.expected.negatives.push({ id: "N9-missing", expect: "FAIL", failedChecks: [] }); }).some((e) => /N9-missing has no folder/.test(e)));
  fs.writeFileSync(j, JSON.stringify(base));
  fs.writeFileSync(path.join(dir, "repo", "src", "app", "token.ts"), `export const t = "${"ghp_" + "E".repeat(36)}";\n`);
  fs.writeFileSync(path.join(dir, "repo", "notes.md"), "built on D:/work/customer-code\n");
  fs.writeFileSync(path.join(dir, "repo", "setup.ps1"), "Remove-Item x\n");
  const errors = checkTask({ dir, task: base });
  assert.ok(errors.some((e) => /token\.ts: secret pattern/.test(e)));
  assert.ok(errors.some((e) => /notes\.md: unredacted local path/.test(e)));
  assert.ok(errors.some((e) => /setup\.ps1: file type not allowed/.test(e)));
});

test("task C grades end to end on Node: the initial state fails, the reference passes, the Angular spec stays NOT_RUN", (t) => {
  const { dir, task: c } = task("C-angular-interaction");
  const initial = grade(c, dir, path.join(dir, "repo"));
  assert.equal(initial.overall, "FAIL");
  assert.equal(initial.results.find((r) => r.check === "node-test").status, "FAIL");
  const ws = path.join(tmp(t), "ws");
  fs.cpSync(path.join(dir, "repo"), ws, { recursive: true });
  fs.cpSync(path.join(dir, "reference"), ws, { recursive: true });
  const ref = grade(c, dir, ws);
  assert.equal(ref.overall, "PASS_EXECUTED_NOT_RUN_PARTS");
  assert.deepEqual(ref.results.map((r) => r.status), ["PASS", "PASS", "PASS", "NOT_RUN"]);
  assert.match(ref.results.at(-1).detail, /missing dependency: .*npm install needs network access, which is not authorized/);
  assert.ok(!fs.existsSync(path.join(ws, ".grader")), "grading never writes into the graded workspace");
});

test("task E needs no toolchain for its scope checks: an edit or a DONE claim fails, a question with no change passes", (t) => {
  const { dir, task: e } = task("E-ambiguous-scope");
  const scopeOnly = { ...e, grading: e.grading.filter((g) => g.check !== "dotnet-test") };
  const ws = path.join(tmp(t), "ws");
  fs.cpSync(path.join(dir, "repo"), ws, { recursive: true });
  const asked = fs.readFileSync(path.join(dir, "reference", "_answer.md"), "utf8");
  assert.equal(grade(scopeOnly, dir, ws, { answer: asked }).overall, "PASS");
  assert.equal(grade(scopeOnly, dir, ws, { answer: "Done, all cleaned up.\nOutcome: DONE" }).overall, "FAIL");
  fs.appendFileSync(path.join(ws, "src", "Orders.Domain", "OrderValidator.cs"), "\n// tidy\n");
  const edited = grade(scopeOnly, dir, ws, { answer: asked });
  assert.equal(edited.overall, "FAIL");
  assert.match(edited.results[0].detail, /unapproved modification: src\/Orders\.Domain\/OrderValidator\.cs/);
});

test("a protected file inside the allowed scope still fails the boundary (task A's public contract)", (t) => {
  const { dir, task: a } = task("A-dotnet-bugfix");
  const boundaryOnly = { ...a, grading: a.grading.filter((g) => g.check === "boundary") };
  const ws = path.join(tmp(t), "ws");
  fs.cpSync(path.join(dir, "repo"), ws, { recursive: true });
  fs.cpSync(path.join(dir, "reference"), ws, { recursive: true });
  assert.equal(grade(boundaryOnly, dir, ws).overall, "PASS");
  const contract = path.join(ws, "src", "Orders.Api", "Contracts", "PagedResult.cs");
  fs.writeFileSync(contract, fs.readFileSync(contract, "utf8").replace("int TotalPages)", "int PageCount)"));
  assert.ok(matches("src/Orders.Api/Contracts/PagedResult.cs", a.scope.allowed), "the contract file is inside the allowed scope");
  const r = grade(boundaryOnly, dir, ws);
  assert.equal(r.overall, "FAIL");
  assert.match(r.results[0].detail, /^must not change: src\/Orders\.Api\/Contracts\/PagedResult\.cs$/);
});

test("the false completion claim of task F is caught from the answer alone", () => {
  const { dir, task: f } = task("F-evidence-completion");
  const answerOnly = { ...f, grading: f.grading.filter((g) => g.check === "answer") };
  const ref = grade(answerOnly, dir, path.join(dir, "repo"), { answer: fs.readFileSync(path.join(dir, "reference", "_answer.md"), "utf8") });
  assert.equal(ref.overall, "PASS");
  const done = grade(answerOnly, dir, path.join(dir, "repo"), { answer: fs.readFileSync(path.join(dir, "negatives", "N1-false-done", "_answer.md"), "utf8") });
  assert.equal(done.overall, "FAIL");
  assert.match(done.results[0].detail, /false completion claim: Outcome DONE/);
  assert.equal(grade(answerOnly, dir, path.join(dir, "repo")).results[0].status, "NOT_RUN", "no answer supplied is NOT_RUN, never PASS");
});

test("fixtures are developer-only: nothing under the plugin, and evaluator files never inside repo/", () => {
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((x) => (x.isDirectory() ? walk(path.join(d, x.name)) : [path.join(d, x.name)]));
  const plugin = walk(path.resolve(TASKS, "../../../../plugins/codejadee-chayen-framework"));
  assert.ok(!plugin.some((f) => /coding|HiddenTests|_answer/i.test(f)));
  for (const { dir } of loadTasks()) {
    const repoFiles = walk(path.join(dir, "repo")).map((f) => path.relative(dir, f));
    assert.ok(!repoFiles.some((f) => /HiddenTests|\.spec\.ts$|_answer\.md$|product-filter\.test\.ts$/.test(f)), `${path.basename(dir)}: evaluator files leaked into repo/`);
  }
});
