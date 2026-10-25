#!/usr/bin/env node
// Developer-only independent grader and comparison report for coding runs (evolution Step 17, D-074).
//
// --grade runs the task's deterministic grader checks (run-coding-fixtures.mjs --grade: hidden tests,
// boundary, regression detection, answer checks) on a copy of each preserved Step 16 workspace and stores
// what they observed in oracle.jsonl. Those checks execute agent-written code, so for a real provider run
// they execute only inside a container whose boundary verifies (--oracle-isolation <profile>); without
// one the grader exits 3 with BLOCKED. Host execution is allowed only for fake-provider runs on the
// harmless runner fixture. --report derives every grade offline from recorded files: run records, oracle
// results, the rubric, and optional human-review and LLM-grade logs. It is deterministic.
//
//   node tests/evaluation/coding/grade-coding.mjs --grade <results dir> [--oracle-isolation <profile.json>]
//   node tests/evaluation/coding/grade-coding.mjs --report <comparison.json> --out <fresh dir>
//   node tests/evaluation/coding/grade-coding.mjs --synthetic-report --out <fresh dir> [--runs 10] [--seed 17]
//   node tests/evaluation/coding/grade-coding.mjs --self-test
//
// No provider is called. Never shipped with the plugin. Zero dependencies.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { lfFingerprint } from "../phase5/candidate.mjs";
import {
  RUN_SCHEMA, IGNORED, loadTaskDir, taskFingerprint, loadIsolationProfile, checkIsolation, resolveEngine, hostTestBackend, containerBackend,
} from "./coding-runner-lib.mjs";
import { ORACLE_SCHEMA, SPEC_SCHEMA, MIN_RUNS, loadRubric, checkRubricAgainstTask, deriveGrade, validateHuman, validateLlm, compare, renderMarkdown } from "./grading-lib.mjs";
import { RUBRIC_FILE, selfTest, syntheticReport } from "./grading-synthetic.mjs";

const repo = fs.realpathSync(path.resolve(import.meta.dirname, "../../.."));
const argv = process.argv.slice(2);
const arg = (name, def) => { const i = argv.indexOf(name); return i > -1 ? argv[i + 1] : def; };
const has = (name) => argv.includes(name);
const fail = (msg, code = 2) => { console.error(msg); process.exit(code); };
const blocked = (msg) => fail(`BLOCKED ${msg}\nNothing was executed and no oracle results were written.`, 3);
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
const tmp = (tag) => fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), `chayen-grade-${tag}-`));
const rm = (d) => fs.rmSync(d, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
const jsonl = (f) => (fs.existsSync(f) ? fs.readFileSync(f, "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l)) : []);
// The grader and everything it imports, staged next to the workspace copy.
export const GRADER_CLOSURE = ["tests/evaluation/coding/run-coding-fixtures.mjs", "tools/evals/failure-cases.mjs", "tools/validate/safe-paths.mjs", "tools/validate/secret-patterns.mjs", "tests/evaluation/phase5/phase5-lib.mjs"];

function loadResults(dir, rubric) {
  const f = path.join(dir, "run.json");
  if (!fs.existsSync(f)) fail(`${dir} has no run.json`);
  const meta = JSON.parse(fs.readFileSync(f, "utf8"));
  if (meta.$schema !== RUN_SCHEMA) fail(`${dir}/run.json is not ${RUN_SCHEMA}`);
  const taskDir = path.join(repo, ...meta.taskPath.split("/"));
  if (!fs.existsSync(path.join(taskDir, "task.json"))) fail(`the task ${meta.taskPath} no longer exists`);
  if (JSON.stringify(taskFingerprint(taskDir)) !== JSON.stringify(meta.sourceFixture)) fail(`Stale results: the task fixture ${meta.taskPath} changed since the run; not graded`);
  const task = loadTaskDir(taskDir), entry = rubric.tasks[meta.task];
  const errors = checkRubricAgainstTask(entry, task);
  if (errors.length) fail(`rubric does not fit the task:\n  ${errors.join("\n  ")}`);
  const records = jsonl(path.join(dir, "records.jsonl"));
  if (!records.length) fail(`${dir} has no records`);
  const answer = (r) => {
    const a = path.join(dir, "runs", r.stem, "answer.md");
    if (!fs.existsSync(a)) return "";
    const text = fs.readFileSync(a, "utf8");
    if (sha(text) !== r.answerSha256) fail(`${r.stem}: answer.md does not match the recorded answer hash; not graded`);
    return text;
  };
  return { meta, taskDir, task, entry, records, answer };
}

// ---------- --grade ----------
function gradeDir(dir) {
  const rubric = loadRubric(RUBRIC_FILE);
  const { meta, taskDir, task, entry, records, answer } = loadResults(dir, rubric);
  const out = path.join(dir, "oracle.jsonl");
  if (fs.existsSync(out)) fail("oracle.jsonl already exists: oracle results are evidence and are never overwritten");
  const simulated = /^simulated/.test(String(meta.evidenceLevel));
  if (simulated && !String(meta.taskPath).startsWith("tests/evaluation/coding/fakes/")) fail("fake-provider results are graded on the host only for the runner fixture");
  let backend, execution;
  if (simulated) { backend = hostTestBackend(); execution = "host (fake-provider run on the harmless runner fixture)"; }
  else {
    const iso = arg("--oracle-isolation");
    if (!iso) blocked("hidden oracles execute agent-written code: a real provider run is graded only inside a verified container (--oracle-isolation <profile>)");
    let profile;
    try { profile = loadIsolationProfile(path.resolve(iso), { repo }); } catch (e) { blocked(e.message); }
    const engine = resolveEngine(profile.engine), scratch = tmp("probe"), ws = path.join(scratch, "workspace"), home = path.join(scratch, "home"), n = crypto.randomBytes(6).toString("hex");
    fs.mkdirSync(ws); fs.mkdirSync(home); fs.writeFileSync(path.join(scratch, `OUTSIDE-CANARY-${n}`), n);
    let r;
    try { r = checkIsolation(profile, { engine, workspace: ws, home, nonce: n, canaryName: `OUTSIDE-CANARY-${n}` }); } finally { rm(scratch); }
    if (r.status !== "VERIFIED") blocked(`grading boundary not verified:\n  ${r.errors.join("\n  ")}`);
    backend = containerBackend(profile, engine); execution = `container (${r.engineVersion}, image ${r.imageDigest.slice(0, 19)}…, network none)`;
  }
  const graderSha256 = sha(GRADER_CLOSURE.map((f) => sha(fs.readFileSync(path.join(repo, f), "utf8").replace(/\r\n/g, "\n"))).join("") + lfFingerprint(taskDir, IGNORED).sha256);
  const lines = [];
  for (const r of records) {
    const ws = path.join(dir, "runs", r.stem, "workspace");
    let line;
    if (!fs.existsSync(ws)) line = { $schema: ORACLE_SCHEMA, stem: r.stem, task: r.task, execution: "not-run", reason: "the run's workspace is missing", graderSha256, checks: [] };
    else {
      const stage = tmp("stage");
      try {
        for (const rel of GRADER_CLOSURE) { const d = path.join(stage, "g", ...rel.split("/")); fs.mkdirSync(path.dirname(d), { recursive: true }); fs.copyFileSync(path.join(repo, rel), d); }
        fs.cpSync(taskDir, path.join(stage, "g", "tests", "evaluation", "coding", "tasks", task.id), { recursive: true, filter: (s) => s === taskDir || !IGNORED.has(path.basename(s)) });
        fs.cpSync(ws, path.join(stage, "ws"), { recursive: true, filter: (s) => s === ws || !IGNORED.has(path.basename(s)) });
        fs.writeFileSync(path.join(stage, "answer.md"), answer(r));
        const res = backend.exec({ argv: ["node", "g/tests/evaluation/coding/run-coding-fixtures.mjs", "--grade", "--json", "--task", task.id, "--workspace", "ws", "--answer", "answer.md"], root: stage, network: "none", timeoutMs: 1_800_000, name: `chayen-grade-${crypto.randomBytes(6).toString("hex")}` });
        const json = String(res.stdout ?? "").split(/\r?\n/).filter((l) => l.startsWith("{")).at(-1);
        let g = null; try { g = JSON.parse(json); } catch { /* no result */ }
        line = g ? { $schema: ORACLE_SCHEMA, stem: r.stem, task: r.task, execution, reason: null, graderSha256, overall: g.overall, checks: g.results }
          : { $schema: ORACLE_SCHEMA, stem: r.stem, task: r.task, execution: "not-run", reason: `the grader produced no result (exit ${res.status}${res.error ? `, ${res.error.code}` : ""})`, graderSha256, checks: [] };
      } finally { rm(stage); }
    }
    lines.push(line);
    console.log(`${r.stem}: ${line.execution === "not-run" ? `NOT_RUN (${line.reason})` : `${line.overall}; ${line.checks.map((c) => `${c.name} ${c.status}`).join(", ")}`}`);
  }
  fs.writeFileSync(out, lines.map((l) => JSON.stringify(l)).join("\n") + "\n", { flag: "wx" });
  for (const r of records) {
    const g = deriveGrade(r, { task, entry, oracle: lines.find((l) => l.stem === r.stem), answer: answer(r) });
    console.log(`GRADE ${r.stem}: outcome ${g.correctness.outcome}; AC ${g.correctness.acAccepted}/${g.correctness.acTotal}; functional ${g.correctness.functional}; unverified claim ${g.correctness.unverifiedCompletionClaim}; categories ${g.failureCategories.join(", ") || "none"}`);
  }
}

// ---------- --report ----------
function gradesFor(dir, rubric) {
  const { meta, task, entry, records, answer } = loadResults(dir, rubric);
  const stems = new Set(records.map((r) => r.stem)), oracle = jsonl(path.join(dir, "oracle.jsonl"));
  const human = jsonl(path.join(dir, "human-review.jsonl")), llm = jsonl(path.join(dir, "llm-grades.jsonl"));
  const errors = [...human.flatMap((h) => validateHuman(h, stems).map((e) => `human-review ${h.stem}: ${e}`)), ...llm.flatMap((g) => validateLlm(g, stems, () => entry).map((e) => `llm-grades ${g.stem} ${g.criterion}: ${e}`))];
  for (const s of stems) if (human.filter((h) => h.stem === s).length > 1) errors.push(`human-review ${s}: one entry per run`);
  if (oracle.length && new Set(oracle.map((o) => o.stem)).size !== oracle.length) errors.push("oracle.jsonl has duplicate runs");
  if (errors.length) fail(`${dir}: not reported:\n  ${errors.join("\n  ")}`);
  const grades = records.map((r) => deriveGrade(r, { task, entry, oracle: oracle.find((o) => o.stem === r.stem) ?? null, answer: answer(r), human: human.find((h) => h.stem === r.stem) ?? null, llm: llm.filter((g) => g.stem === r.stem) }));
  return { dir: path.basename(dir), meta, grades };
}
function writeReport(report, outArg) {
  if (!outArg) fail("--out <fresh directory> required");
  const out = path.resolve(outArg);
  if (fs.existsSync(out)) fail("Refusing an existing --out directory; reports are never overwritten");
  if (out.startsWith(path.join(repo, "plugins") + path.sep)) fail("reports never go into the plugin");
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2) + "\n", { flag: "wx" });
  fs.writeFileSync(path.join(out, "report.md"), renderMarkdown(report), { flag: "wx" });
  console.log(`Report written: report.json, report.md (${report.dataStatus}; live improvement claims ${report.liveImprovementClaims})`);
}
function report() {
  const specFile = path.resolve(arg("--report"));
  const spec = JSON.parse(fs.readFileSync(specFile, "utf8"));
  if (spec.$schema !== SPEC_SCHEMA) fail(`${specFile} is not ${SPEC_SCHEMA}`);
  const minRuns = spec.minRuns ?? MIN_RUNS;
  if (!Number.isInteger(minRuns) || minRuns < 3) fail("minRuns must be an integer of at least 3");
  const rubric = loadRubric(RUBRIC_FILE);
  const configs = Object.fromEntries(Object.entries(spec.configurations ?? {}).map(([label, c]) => [label, { runs: (c.dirs ?? []).map((d) => gradesFor(path.resolve(path.dirname(specFile), d), rubric)) }]));
  let r;
  try { r = compare(configs, { title: spec.title ?? "Coding comparison", minRuns, rubricSha256: rubric.sha256 }); } catch (e) { fail(e.message); }
  writeReport(r, arg("--out"));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  if (has("--self-test")) {
    const results = selfTest();
    for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.ok ? "" : `: ${r.detail}`}`);
    const bad = results.filter((r) => !r.ok).length;
    console.log(`${bad ? "FAIL" : "PASS"} coding grader self-test: ${results.length - bad}/${results.length} synthetic known-good and known-bad records graded as expected (synthetic; no provider called)`);
    process.exitCode = bad ? 1 : 0;
  } else if (arg("--grade")) gradeDir(path.resolve(arg("--grade")));
  else if (arg("--report")) report();
  else if (has("--synthetic-report")) writeReport(syntheticReport({ runs: Number(arg("--runs", "10")), seed: Number(arg("--seed", "17")) }), arg("--out"));
  else fail("usage: --grade <results dir> [--oracle-isolation <profile>] | --report <comparison.json> --out <dir> | --synthetic-report --out <dir> | --self-test");
}
