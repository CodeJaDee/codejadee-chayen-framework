// Developer-only regressions for the independent coding grader and comparison report (evolution Step 17,
// D-074). Executed runs use only the Step 16 fake provider on the harmless runner fixture; real-provider
// grading is only ever refused (BLOCKED). Synthetic records exercise the statistics. No model is called.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { prepareCandidate } from "../phase5/candidate.mjs";
import { PACKAGE } from "../../provider-compatibility/qualify-rc.mjs";
import { privacyFindings } from "../../../tools/evals/failure-cases.mjs";
import { loadTaskDir } from "./coding-runner-lib.mjs";
import { loadTasks } from "./run-coding-fixtures.mjs";
import { loadRubric, checkRubricAgainstTask, newcombe, describe, compare, HUMAN_SCHEMA, LLM_SCHEMA } from "./grading-lib.mjs";
import { RUBRIC_FILE, selfTest, syntheticConfigs, taskDirFor } from "./grading-synthetic.mjs";

const here = import.meta.dirname, repo = fs.realpathSync(path.resolve(here, "../../.."));
const GRADER = path.join(here, "grade-coding.mjs"), RUNNER = path.join(here, "run-coding.mjs"), FIXTURE = path.join(here, "fakes", "fixture-task");
const node = (script, args, env = {}) => spawnSync(process.execPath, [script, ...args], { cwd: repo, encoding: "utf8", timeout: 300_000, env: { ...process.env, ...env } });
const out = (r) => `${r.stdout}${r.stderr}`;
const jsonl = (f) => fs.readFileSync(f, "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
const mk = (name) => fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), `chayen-s17-${name}-`));
const tmp = (t, name) => { const d = mk(name); t.after(() => fs.rmSync(d, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })); return d; };
const tree = (d) => { const o = {}; const w = (x, rel) => { for (const e of fs.readdirSync(x, { withFileTypes: true })) { const p = path.join(x, e.name); if (e.isDirectory()) w(p, `${rel}${e.name}/`); else o[`${rel}${e.name}`] = fs.readFileSync(p, "utf8"); } }; w(d, ""); return o; };

// Fake-provider results for A (baseline), B (Chayen, same model) and C (Chayen, mentor model), made once.
let shared = null;
function fakeResults() {
  if (shared) return shared;
  const root = mk("shared"), cand = path.join(root, "cand.json"), base = path.join(root, "home-base"), chayen = path.join(root, "home-chayen");
  fs.mkdirSync(base); fs.cpSync(path.join(repo, PACKAGE), path.join(chayen, "plugins", "cache", "codejadee", "chayen", "1"), { recursive: true });
  fs.writeFileSync(cand, JSON.stringify(prepareCandidate(repo), null, 2));
  const run = (label, model, scenarios, arm, home) => {
    const r = node(RUNNER, ["--provider", "fake", "--model", model, "--fake-scenario", scenarios, "--arm", arm, "--task-dir", FIXTURE, "--candidate", cand, "--allow-uncommitted-candidate", "--isolation", "test-only-no-isolation",
      "--home", home, "--allow-provider-calls", "--allow-coding-writes", "--authorization", "TEST-ONLY", "--max-calls", "5", "--runs", "5", "--out", path.join(root, label)]);
    assert.equal(r.status, 0, out(r));
    return path.join(root, label);
  };
  shared = { root, A: run("A", "fake-model-1", "special-case,fix,false-done,iterate,out-of-scope", "baseline", base), B: run("B", "fake-model-1", "fix,iterate,special-case,fix,fix", "chayen", chayen), C: run("C", "fake-mentor-1", "fix,fix,fix,iterate,fix", "chayen", chayen) };
  return shared;
}
test.after(() => { if (shared) fs.rmSync(shared.root, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); });
const copyResults = (t, src) => { const d = path.join(tmp(t, "copy"), path.basename(src)); fs.cpSync(src, d, { recursive: true }); return d; };
const spec = (t, dirs, extra = {}) => { const f = path.join(tmp(t, "spec"), "comparison.json"); fs.writeFileSync(f, JSON.stringify({ $schema: "chayen-coding-comparison/1", title: "test", configurations: Object.fromEntries(Object.entries(dirs).map(([k, v]) => [k, { dirs: [v] }])), ...extra })); return f; };

test("the rubric covers every criterion of the six tasks and the runner fixture, with checks the graders run", () => {
  const rubric = loadRubric(RUBRIC_FILE);
  const tasks = [...loadTasks().map((x) => x.task), loadTaskDir(FIXTURE)];
  assert.deepEqual(tasks.flatMap((t) => checkRubricAgainstTask(rubric.tasks[t.id], t)), []);
  assert.deepEqual(Object.keys(rubric.tasks).sort(), tasks.map((t) => t.id).sort());
  const broken = structuredClone(rubric.tasks["A-dotnet-bugfix"]);
  broken.criteria["AC-1"].evidence[0].check = "invented check";
  assert.match(checkRubricAgainstTask(broken, loadTaskDir(taskDirFor("A-dotnet-bugfix"))).join(), /no grading check named "invented check"/);
});

test("scorer self-test: known-good and known-bad records give their expected grades (G-26)", () => {
  const results = selfTest();
  assert.ok(results.length >= 15);
  for (const r of results) assert.ok(r.ok, `${r.name}: ${r.detail}`);
  const cli = node(GRADER, ["--self-test"]);
  assert.equal(cli.status, 0, out(cli)); assert.match(cli.stdout, /PASS coding grader self-test: \d+\/\d+/);
});

test("statistics: Newcombe's interval matches the published example; distributions; sample-size statuses", () => {
  // Newcombe (1998), example (a): 56/70 versus 48/80, difference 0.2, interval 0.0524 to 0.3339.
  assert.deepEqual(newcombe(48, 80, 56, 70), { estimate: 0.2, low: 0.0524, high: 0.3339 });
  assert.deepEqual(describe([3, 1, 2, null, 4]), { n: 4, mean: 2.5, median: 2.5, min: 1, max: 4, sd: 1.291 });
  const asProvider = (configs) => { for (const c of Object.values(configs)) for (const r of c.runs) r.meta = { ...r.meta, evidenceLevel: "provider-invocation" }; return configs; };
  const small = compare(asProvider(syntheticConfigs({ runs: 2 }).configs));
  assert.equal(small.dataStatus, "PROVIDER_RUNS");
  assert.ok(small.comparisons.every((c) => c.pooled.rates.every((d) => d.status === "INSUFFICIENT_SAMPLE")), "fewer than 5 runs per task is never a claim");
  const large = compare(asProvider(syntheticConfigs({ runs: 40, seed: 3 }).configs));
  const ba = large.comparisons.find((c) => c.name === "B vs A").pooled.rates;
  const st = Object.fromEntries(ba.map((d) => [d.metric, d.status]));
  assert.equal(st.unverifiedCompletionClaim, "DIFFERENCE_OBSERVED", JSON.stringify(ba.find((d) => d.metric === "unverifiedCompletionClaim")));
  const same = asProvider(syntheticConfigs({ runs: 40, seed: 3 }).configs);
  same.A.runs.forEach((r, i) => { r.grades = same.B.runs[i].grades; });
  assert.ok(compare(same).comparisons.find((c) => c.name === "B vs A").pooled.rates.every((d) => d.status === "INCONCLUSIVE" && d.difference === 0), "identical arms: every interval includes 0");
  const measures = Object.fromEntries(large.comparisons[0].pooled.measures.map((d) => [d.metric, d.status]));
  for (const k of ["seconds", "outputTokens", "totalTokens", "toolCalls", "costUsd"]) assert.equal(measures[k], "DESCRIPTIVE_ONLY", `${k}: time, token and cost differences carry no interval`);
  assert.equal(measures.humanReviewSeconds, "INSUFFICIENT_SAMPLE", "only 4 recorded human reviews per arm");
  assert.match(large.limitations[0], /associations under the recorded conditions/);
  assert.equal(large.comparisons.find((c) => c.name === "C vs B").controlledForChayen, false);
});

test("end to end on fake runs: hidden oracle catches a false PASS, scope and missing verification are found, the workspace is untouched", (t) => {
  const { A } = fakeResults();
  const a = copyResults(t, A);
  const before = tree(path.join(a, "runs"));
  const g = node(GRADER, ["--grade", a]);
  assert.equal(g.status, 0, out(g));
  assert.deepEqual(tree(path.join(a, "runs")), before, "grading works on copies only");
  const oracle = jsonl(path.join(a, "oracle.jsonl"));
  assert.ok(oracle.every((o) => /^host \(fake-provider run/.test(o.execution)));
  const rec = jsonl(path.join(a, "records.jsonl"));
  assert.equal(rec[0].verification.status, "PASS", "the special-cased fix passes the visible checks");
  assert.equal(oracle[0].checks.find((c) => c.name === "sum oracle").status, "FAIL", "the hidden oracle does not");
  assert.match(g.stdout, /GRADE fixture-task\.baseline\.r1\.a1: outcome PARTIAL; AC 1\/2; functional FAIL; unverified claim true; categories false-done-claim, functional-failure/);
  assert.match(g.stdout, /r2\.a1: outcome DONE; AC 2\/2; functional PASS; unverified claim false; categories none/);
  assert.match(g.stdout, /r3\.a1: outcome PARTIAL.*unverified claim true.*build-or-test-failure/);
  assert.match(g.stdout, /r5\.a1: outcome PARTIAL.*scope-expansion, missing-verification/);
  const again = node(GRADER, ["--grade", a]);
  assert.equal(again.status, 2); assert.match(out(again), /never overwritten/);
});

test("the report from fake runs: A, B, C, differences, uncertainty, categories, trade-offs, next experiments; reproducible and NOT_MEASURED", (t) => {
  const { A, B, C } = fakeResults();
  const dirs = Object.fromEntries(Object.entries({ A, B, C }).map(([k, d]) => [k, copyResults(t, d)]));
  for (const d of Object.values(dirs)) assert.equal(node(GRADER, ["--grade", d]).status, 0);
  const s = spec(t, dirs), o1 = path.join(tmp(t, "r"), "one"), o2 = path.join(tmp(t, "r"), "two");
  let r = node(GRADER, ["--report", s, "--out", o1]);
  assert.equal(r.status, 0, out(r)); assert.match(r.stdout, /SIMULATED; live improvement claims NOT_MEASURED/);
  assert.equal(node(GRADER, ["--report", s, "--out", o2]).status, 0);
  assert.deepEqual(tree(o1), tree(o2), "the same records give byte-identical reports");
  r = node(GRADER, ["--report", s, "--out", o1]);
  assert.equal(r.status, 2); assert.match(out(r), /existing --out/);
  const rep = JSON.parse(fs.readFileSync(path.join(o1, "report.json"), "utf8")), md = fs.readFileSync(path.join(o1, "report.md"), "utf8");
  for (const h of ["## Baseline", "## Chayen-enabled", "## Differences", "## Confidence and uncertainty", "## Rework", "## Failure categories", "## Token, time and cost trade-offs", "## Human involvement", "## LLM-labelled grades", "## Recommended next experiments", "## Method and limitations"]) assert.ok(md.includes(h), h);
  assert.deepEqual(Object.keys(rep.configurations), ["A", "B", "C"]);
  assert.deepEqual(rep.comparisons.map((c) => c.name), ["B vs A", "C vs B"]);
  assert.ok(rep.comparisons.every((c) => [...c.pooled.rates, ...c.pooled.measures].every((d) => d.status === "NOT_MEASURED")));
  assert.deepEqual(rep.configurations.A.pooled.rates.unverifiedCompletionClaim.k, 3);
  assert.equal(rep.configurations.A.pooled.failureCategories["scope-expansion"], 1);
  assert.equal(rep.configurations.B.pooled.measures.humanReviewSeconds.n, 0, "no human log: no review time");
  assert.ok(rep.recommendations.some((x) => /real providers/.test(x)) && rep.recommendations.some((x) => /chayen-human-review\/1/.test(x)));
  assert.deepEqual(privacyFindings(md + JSON.stringify(rep)).filter((p) => !/email/.test(p)), []);
});

test("A and B must be the same agent configuration; C must share the task and environment", (t) => {
  const { A, B, C } = fakeResults();
  let r = node(GRADER, ["--report", spec(t, { A: copyResults(t, A), B: copyResults(t, C) }), "--out", path.join(tmp(t, "r"), "x")]);
  assert.equal(r.status, 2); assert.match(out(r), /A and B differ on task fixture-task in more than the arm/);
  r = node(GRADER, ["--report", spec(t, { A: copyResults(t, B), B: copyResults(t, B) }), "--out", path.join(tmp(t, "r"), "x")]);
  assert.equal(r.status, 2); assert.match(out(r), /A \(Fast agent without Chayen\) needs the baseline arm/);
  const c = copyResults(t, C), meta = JSON.parse(fs.readFileSync(path.join(c, "run.json"), "utf8"));
  fs.writeFileSync(path.join(c, "run.json"), JSON.stringify({ ...meta, toolPolicy: { ...meta.toolPolicy, commands: ["anything"] } }));
  r = node(GRADER, ["--report", spec(t, { A: copyResults(t, A), B: copyResults(t, B), C: c }), "--out", path.join(tmp(t, "r"), "x")]);
  assert.equal(r.status, 2); assert.match(out(r), /C differs from B on task fixture-task in task, snapshot, prompt, candidate, environment or permissions/);
});

test("real-provider grading is BLOCKED without a verified container; nothing is executed or written", (t) => {
  const { A } = fakeResults();
  const a = copyResults(t, A), meta = JSON.parse(fs.readFileSync(path.join(a, "run.json"), "utf8"));
  fs.writeFileSync(path.join(a, "run.json"), JSON.stringify({ ...meta, evidenceLevel: "provider-invocation" }));
  let r = node(GRADER, ["--grade", a]);
  assert.equal(r.status, 3, out(r)); assert.match(out(r), /BLOCKED hidden oracles execute agent-written code/);
  const gitDir = (process.env.PATH ?? "").split(path.delimiter).find((d) => d && fs.existsSync(path.join(d, process.platform === "win32" ? "git.exe" : "git")) && !["docker", "docker.exe", "podman", "podman.exe"].some((e) => fs.existsSync(path.join(d, e))));
  const ro = tmp(t, "ro"), prof = path.join(tmp(t, "p"), "iso.json");
  fs.writeFileSync(prof, JSON.stringify({ $schema: "chayen-coding-isolation/1", backend: "container", engine: "docker", image: "registry.example.invalid/grader@sha256:" + "c".repeat(64), user: "1000:1000", network: "none", egress: { allowedHosts: [], deniedProbe: "blocked.example.invalid:443" }, readOnlyMounts: [{ host: ro, container: "/opt/nuget", env: "NUGET_PACKAGES" }], providerHomeMount: "/agent-home" }));
  if (gitDir) {
    r = node(GRADER, ["--grade", a, "--oracle-isolation", prof], { PATH: gitDir });
    assert.equal(r.status, 3, out(r)); assert.match(out(r), /BLOCKED grading boundary not verified:\s+container engine docker not found on PATH/);
  }
  assert.ok(!fs.existsSync(path.join(a, "oracle.jsonl")));
  const b = copyResults(t, A);
  fs.writeFileSync(path.join(b, "run.json"), JSON.stringify({ ...JSON.parse(fs.readFileSync(path.join(b, "run.json"), "utf8")), taskPath: "tests/evaluation/coding/tasks/A-dotnet-bugfix" }));
  r = node(GRADER, ["--grade", b]);
  assert.equal(r.status, 2); assert.match(out(r), /Stale results|fake-provider results are graded on the host only/);
});

test("human review and LLM grades: named humans only, measured time only, labelled and never pooled; LLM never replaces execution evidence", (t) => {
  const { A, B } = fakeResults();
  const a = copyResults(t, A), b = copyResults(t, B);
  for (const d of [a, b]) assert.equal(node(GRADER, ["--grade", d]).status, 0);
  const stem = jsonl(path.join(b, "records.jsonl"))[0].stem;
  const entry = { $schema: HUMAN_SCHEMA, stem, reviewer: { name: "Reviewer One", role: "maintainer" }, independentOfAgent: true, rounds: 2, interventions: [{ round: 1, kind: "change-request" }], approvals: [{ event: "merge", approved: true }], startedAt: "2026-10-22T09:00:00Z", endedAt: "2026-10-22T09:05:00Z", verdicts: { "AC-1": "accept" } };
  fs.writeFileSync(path.join(b, "human-review.jsonl"), JSON.stringify(entry) + "\n");
  const o = path.join(tmp(t, "r"), "h");
  let r = node(GRADER, ["--report", spec(t, { A: a, B: b }), "--out", o]);
  assert.equal(r.status, 0, out(r));
  const rep = JSON.parse(fs.readFileSync(path.join(o, "report.json"), "utf8"));
  assert.deepEqual(rep.configurations.B.pooled.measures.humanReviewSeconds, { n: 1, mean: 300, median: 300, min: 300, max: 300, sd: null });
  assert.deepEqual(rep.configurations.B.pooled.humanReview.humanVerdicts, [{ stem, verdicts: { "AC-1": "accept" } }]);
  assert.equal(rep.configurations.B.pooled.rates.completedDone.k, 4, "a human verdict changes no automatic grade");
  const bad = (h, re) => { fs.writeFileSync(path.join(b, "human-review.jsonl"), JSON.stringify(h) + "\n"); const x = node(GRADER, ["--report", spec(t, { A: a, B: b }), "--out", path.join(tmp(t, "r"), "x")]); assert.equal(x.status, 2, out(x)); assert.match(out(x), re); };
  bad({ ...entry, reviewer: { name: "Claude agent" } }, /must name a person/);
  bad({ ...entry, durationSeconds: 120 }, /review time comes only from startedAt and endedAt/);
  bad({ ...entry, endedAt: undefined }, /both startedAt and endedAt/);
  fs.rmSync(path.join(b, "human-review.jsonl"));
  fs.writeFileSync(path.join(b, "llm-grades.jsonl"), JSON.stringify({ $schema: LLM_SCHEMA, stem, criterion: "AC-1", grader: { model: "judge-1" }, verdict: "accept", rationale: "looks right" }) + "\n");
  r = node(GRADER, ["--report", spec(t, { A: a, B: b }), "--out", path.join(tmp(t, "r"), "l")]);
  assert.equal(r.status, 2); assert.match(out(r), /decided by execution evidence; an LLM grade cannot stand in for it/);
});

test("recorded evidence is checked: a changed answer or a changed fixture is refused", (t) => {
  const { A, B } = fakeResults();
  const a = copyResults(t, A), b = copyResults(t, B);
  const stem = jsonl(path.join(a, "records.jsonl"))[0].stem;
  fs.appendFileSync(path.join(a, "runs", stem, "answer.md"), "\nAC-1 accept");
  let r = node(GRADER, ["--grade", a]);
  assert.equal(r.status, 2); assert.match(out(r), /does not match the recorded answer hash/);
  const meta = JSON.parse(fs.readFileSync(path.join(b, "run.json"), "utf8"));
  fs.writeFileSync(path.join(b, "run.json"), JSON.stringify({ ...meta, sourceFixture: { ...meta.sourceFixture, repoSha256: "0".repeat(64) } }));
  r = node(GRADER, ["--grade", b]);
  assert.equal(r.status, 2); assert.match(out(r), /Stale results/);
});

test("a report can be generated entirely from synthetic records, without any provider, and is reproducible", (t) => {
  const o1 = path.join(tmp(t, "s"), "one"), o2 = path.join(tmp(t, "s"), "two");
  const r = node(GRADER, ["--synthetic-report", "--out", o1], { PATH: "" });
  assert.equal(r.status, 0, out(r)); assert.match(r.stdout, /SYNTHETIC; live improvement claims NOT_MEASURED/);
  assert.equal(node(GRADER, ["--synthetic-report", "--out", o2], { PATH: "" }).status, 0);
  assert.deepEqual(tree(o1), tree(o2));
  assert.match(fs.readFileSync(path.join(o1, "report.md"), "utf8"), /built from synthetic records\. Its numbers test the method only/);
  const lf = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v.replace(/\r\n/g, "\n")]));
  assert.deepEqual(lf(tree(path.join(here, "results", "2026-10-22-step17-synthetic"))), lf(tree(o1)), "the committed example report reproduces exactly");
});

test("the grader never calls a provider; the derivation library starts no process", () => {
  const lib = fs.readFileSync(path.join(here, "grading-lib.mjs"), "utf8"), syn = fs.readFileSync(path.join(here, "grading-synthetic.mjs"), "utf8"), cli = fs.readFileSync(GRADER, "utf8");
  for (const src of [lib, syn]) assert.doesNotMatch(src, /node:child_process|spawnSync|\bfetch\s*\(/);
  assert.doesNotMatch(cli, /\b(?:claude|codex|copilot)\b["']?\s*,\s*\[|"--allow-provider-calls"/);
  assert.match(cli, /"--grade", "--json"/, "the only command it builds is the Step 15 grader");
});
