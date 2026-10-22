#!/usr/bin/env node
// Developer-only real-coding evaluation fixtures (evolution Step 15, D-072). Each task under tasks/ has the
// repository an agent receives (repo/), evaluator-only checks (grader/), a reference solution
// (reference/) and known-bad agent outputs (negatives/). This runner grades a workspace against the
// task's declared checks, and verifies each fixture: the initial state and every negative must fail,
// the reference must pass. Grading always works on a disposable copy; the graded workspace is never
// changed. .NET restores use only the local NuGet cache (no network); SQL Server checks use LocalDB
// only; tools that are not installed give NOT_RUN, never PASS. No model or provider is called.
//
// Usage:
//   node tests/evaluation/coding/run-coding-fixtures.mjs --check                  structure and safety (fast)
//   node tests/evaluation/coding/run-coding-fixtures.mjs --verify [--task <id>] [--out <file>]
//   node tests/evaluation/coding/run-coding-fixtures.mjs --grade --task <id> --workspace <dir> [--answer <file>]

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { privacyFindings } from "../../../tools/evals/failure-cases.mjs";

export const SCHEMA = "chayen-coding-task/1";
const here = import.meta.dirname, repoRoot = path.resolve(here, "../../..");
export const TASKS = path.join(here, "tasks");
const IGNORED = new Set([".git", "bin", "obj", "node_modules", "TestResults", ".grader", ".angular", "dist"]);
const ANSWER = "_answer.md";
const CHECKS = ["boundary", "no-changes", "dotnet-test", "regression-test-detects", "node-test", "static", "answer", "angular-test"];
const KEYS = ["$schema", "id", "title", "category", "prompt", "stack", "commands", "scope", "acceptanceCriteria", "grading", "negativeChecks", "expected", "reset"];
const ALLOWED_EXT = new Set([".md", ".json", ".cs", ".csproj", ".ts", ".html", ".css", ".sql", ".gitignore", ""]);
const lf = (t) => t.replace(/\r\n/g, "\n");

// ---------- files ----------
function walk(dir, rel = "") {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED.has(e.name) || e.isSymbolicLink()) continue;
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...walk(path.join(dir, e.name), r)); else out.push(r);
  }
  return out.sort();
}
const read = (f) => lf(fs.readFileSync(f, "utf8"));
// Changes of a workspace against the task's initial repository, by content (line endings ignored).
export function changes(ws, initial) {
  const a = new Set(walk(initial)), b = new Set(walk(ws));
  const added = [...b].filter((f) => !a.has(f)), deleted = [...a].filter((f) => !b.has(f));
  const modified = [...b].filter((f) => a.has(f) && read(path.join(ws, f)) !== read(path.join(initial, f)));
  return { added, modified, deleted, all: [...added, ...modified, ...deleted].sort() };
}
const globRe = (g) => new RegExp("^" + g.split("/").map((seg, i, all) => seg === "**" ? (i === all.length - 1 ? ".*" : "(?:.*/)?") : seg.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*") + (i < all.length - 1 ? "/" : "")).join("").replace(/\/\(\?:\.\*\/\)\?/g, "/(?:.*/)?") + "$");
export const matches = (file, globs) => globs.some((g) => globRe(g).test(file));
function copyTree(src, dst, skip = IGNORED) { fs.cpSync(src, dst, { recursive: true, filter: (s) => !skip.has(path.basename(s)) || s === src }); }
function tmpDir(tag) { return fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), `chayen-coding-${tag}-`)); }
const rm = (d) => fs.rmSync(d, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
// Machine paths in tool output become placeholders (the temp and home directories, both slash forms).
function scrubPaths(text) {
  let t = text;
  for (const [p, label] of [[fs.realpathSync(os.tmpdir()), "<tmp>"], [os.tmpdir(), "<tmp>"], [os.homedir(), "<home>"], [repoRoot, "<repo>"]])
    for (const v of new Set([p, p.replace(/\\/g, "/")])) t = t.split(v).join(label);
  return t;
}

// ---------- tools ----------
const DOTNET_ENV = { DOTNET_CLI_TELEMETRY_OPTOUT: "1", DOTNET_NOLOGO: "1", DOTNET_SKIP_FIRST_TIME_EXPERIENCE: "1", MSBUILDDISABLENODEREUSE: "1", DOTNET_CLI_UI_LANGUAGE: "en" };
const run = (cmd, args, cwd, env = {}) => spawnSync(cmd, args, { cwd, encoding: "utf8", timeout: 600_000, maxBuffer: 64 * 1024 * 1024, env: { ...process.env, ...env }, shell: false });
let toolCache = null;
export function tools() {
  if (toolCache) return toolCache;
  const sdks = run("dotnet", ["--list-sdks"], repoRoot);
  const nuget = process.env.NUGET_PACKAGES ?? path.join(os.homedir(), ".nuget", "packages");
  const localdb = process.env.CHAYEN_CODING_SQLSERVER ?? "(localdb)\\ChayenFacts";
  const instance = /^\(localdb\)\\(.+)$/i.exec(localdb)?.[1];
  const info = instance ? run("sqllocaldb", ["info", instance], repoRoot) : null;
  toolCache = {
    dotnet: sdks.status === 0 && /^10\./m.test(sdks.stdout) ? sdks.stdout.split("\n").find((l) => /^10\./.test(l)).split(" ")[0] : null,
    nuget: fs.existsSync(nuget) ? nuget : null,
    sqlserver: instance ? (info?.status === 0 ? localdb : null) : (/^(?:localhost|127\.0\.0\.1|\(local\))/i.test(localdb) ? localdb : null),
    sqlserverWanted: localdb,
    node: process.versions.node,
  };
  return toolCache;
}

function dotnetTest(ws, project, { minPassed = 1, minSkipped = 0, env = {}, expectFailures = false } = {}) {
  const t = tools();
  if (!t.dotnet) return { status: "NOT_RUN", detail: "missing dependency: .NET SDK 10.x (`dotnet --list-sdks`)" };
  if (!t.nuget) return { status: "NOT_RUN", detail: "missing dependency: local NuGet package cache (offline restore only; network not authorized)" };
  const restore = run("dotnet", ["restore", project, "--source", t.nuget, "-p:NuGetAudit=false"], ws, DOTNET_ENV);
  if (restore.status !== 0) return { status: "NOT_RUN", detail: `offline restore from the local NuGet cache failed: ${(restore.stdout + restore.stderr).split("\n").filter((l) => /error/i.test(l)).slice(0, 2).map((l) => l.trim().replace(/^.*?error /, "error ")).join(" | ")}` };
  const r = run("dotnet", ["test", project, "--no-restore", "-p:UseSharedCompilation=false"], ws, { ...DOTNET_ENV, ...env });
  const out = r.stdout + r.stderr;
  const sums = [...out.matchAll(/(?:Passed|Failed|Skipped)!\s+-\s+Failed:\s+(\d+),\s+Passed:\s+(\d+),\s+Skipped:\s+(\d+),\s+Total:\s+(\d+)/g)];
  const counts = sums.reduce((a, m) => ({ failed: a.failed + +m[1], passed: a.passed + +m[2], skipped: a.skipped + +m[3] }), { failed: 0, passed: 0, skipped: 0 });
  const failedNames = [...new Set([...out.matchAll(/^\s+Failed (.+?) \[[^\]]*\]\s*$/gm)].map((m) => m[1].replace(/^[\w.]+\.(?=[^.]+\.[^.(]+(?:\(|$))/, "")))];
  if (!sums.length) {
    const errors = [...new Set(out.split("\n").filter((l) => /error [A-Z]+\d+/.test(l)).map((l) => l.replace(/^.*?(error [A-Z]+\d+:[^[]*).*$/, "$1").trim()))].slice(0, 3);
    return { status: "FAIL", build: "FAILED", counts, detail: `build failed: ${errors.join(" | ") || out.trim().split("\n").at(-1)}` };
  }
  const pass = r.status === 0 && counts.failed === 0 && counts.passed >= minPassed && counts.skipped >= minSkipped;
  // Oracle markers such as INVENTED_SCHEMA name the cause of a failure.
  const marker = /\b(INVENTED_SCHEMA: [^\r\n]{0,160})/.exec(out)?.[1];
  return { status: expectFailures ? (counts.failed > 0 ? "PASS" : "FAIL") : pass ? "PASS" : "FAIL", build: "SUCCEEDED", counts, failedTests: failedNames, detail: `passed ${counts.passed}, failed ${counts.failed}, skipped ${counts.skipped}${marker ? `; ${marker}` : ""}${failedNames.length ? `; failed: ${failedNames.slice(0, 6).join(", ")}` : ""}${!expectFailures && counts.passed < minPassed ? `; fewer than ${minPassed} tests passed` : ""}${counts.skipped < minSkipped ? `; expected at least ${minSkipped} skipped (the environment cannot run them)` : ""}` };
}

// Parses an agent's final answer (the change-summary format): outcome and one verdict per criterion.
export function parseAnswer(text) {
  const outcome = /\bOutcome:\s*\**\s*(DONE|PARTIAL|BLOCKED)\b/i.exec(text)?.[1]?.toUpperCase() ?? null;
  const verdicts = {};
  for (const line of lf(text).split("\n")) {
    const ac = /\b(AC-\d+)\b/.exec(line)?.[1];
    if (!ac || verdicts[ac]) continue;
    const v = [...line.matchAll(/\b(accept|verify_more|revise)\b/g)].map((m) => m[1]);
    if (v.length === 1) verdicts[ac] = v[0];
  }
  return { outcome, verdicts };
}

// ---------- grading ----------
export function grade(task, taskDir, workspace, { answer = null } = {}) {
  const initial = path.join(taskDir, "repo");
  const ws = tmpDir(task.id);
  try {
    copyTree(workspace, ws);
    const ch = changes(ws, initial);
    const results = [];
    for (const c of task.grading) {
      const name = c.name ?? c.check;
      let r;
      if (c.check === "boundary") {
        const outside = ch.all.filter((f) => !matches(f, task.scope.allowed));
        const forbidden = ch.all.filter((f) => matches(f, task.scope.mustNotChange ?? []));
        r = outside.length || forbidden.length ? { status: "FAIL", detail: [outside.length ? `outside the allowed scope: ${outside.join(", ")}` : "", forbidden.length ? `must not change: ${forbidden.join(", ")}` : ""].filter(Boolean).join("; ") } : { status: "PASS", detail: `${ch.all.length} changed file(s) inside the allowed scope` };
      } else if (c.check === "no-changes") {
        r = ch.all.length ? { status: "FAIL", detail: `unapproved modification: ${ch.all.join(", ")}` } : { status: "PASS", detail: "no file changed" };
      } else if (c.check === "dotnet-test") {
        if (c.grader) copyTree(path.join(taskDir, c.grader), path.join(ws, c.project));
        if (c.requires === "sqlserver" && !tools().sqlserver) r = { status: "NOT_RUN", detail: `missing dependency: SQL Server LocalDB instance ${tools().sqlserverWanted} (create it with \`sqllocaldb create ${/\\(.+)$/.exec(tools().sqlserverWanted)?.[1] ?? "<name>"}\`, or set CHAYEN_CODING_SQLSERVER to a loopback server)` };
        else r = dotnetTest(ws, c.project, { minPassed: c.minPassed ?? 1, minSkipped: c.minSkipped ?? 0, env: c.requires === "sqlserver" ? { CHAYEN_CODING_SQLSERVER: tools().sqlserver } : {} });
      } else if (c.check === "regression-test-detects") {
        const reverted = tmpDir(`${task.id}-revert`);
        try {
          copyTree(ws, reverted);
          const touched = ch.all.filter((f) => c.revert.some((p) => f.startsWith(p)));
          for (const f of touched) {
            const src = path.join(initial, f), dst = path.join(reverted, f);
            if (fs.existsSync(src)) { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); } else rm(dst);
          }
          if (!touched.length) r = { status: "FAIL", detail: `nothing under ${c.revert.join(", ")} changed, so no fix to revert` };
          else {
            const t = dotnetTest(reverted, c.project, { expectFailures: true });
            r = t.status === "NOT_RUN" ? t : t.build === "FAILED" ? { status: "PASS", detail: `the agent's tests do not compile against the original ${c.revert.join(", ")} (counted as detecting)` }
              : t.status === "PASS" ? { status: "PASS", detail: `against the original ${c.revert.join(", ")}: ${t.detail}` } : { status: "FAIL", detail: `no test fails against the original ${c.revert.join(", ")} (${t.detail}); the change has no regression test that detects the bug` };
          }
        } finally { rm(reverted); }
      } else if (c.check === "node-test") {
        const dst = path.join(ws, c.target);
        fs.mkdirSync(path.dirname(dst), { recursive: true });
        fs.copyFileSync(path.join(taskDir, c.grader), dst);
        // A nested `node --test` inherits NODE_TEST_CONTEXT from a parent test run and would report to it
        // instead of printing its own summary; the oracle always runs as a top-level test run.
        const env = { ...process.env };
        delete env.NODE_TEST_CONTEXT;
        const t = spawnSync(process.execPath, ["--test", "--no-warnings", c.target], { cwd: ws, encoding: "utf8", timeout: 120_000, env, shell: false });
        const pass = +(/ℹ pass (\d+)/.exec(t.stdout)?.[1] ?? 0), fail = +(/ℹ fail (\d+)/.exec(t.stdout)?.[1] ?? 0);
        const names = [...t.stdout.matchAll(/^✖ (.+?) \(/gm)].map((m) => m[1]).filter((n) => n !== "failing tests:");
        r = { status: t.status === 0 && pass >= (c.minPassed ?? 1) ? "PASS" : "FAIL", counts: { passed: pass, failed: fail }, detail: `Node ${tools().node} --test: passed ${pass}, failed ${fail}${names.length ? `; failed: ${[...new Set(names)].slice(0, 5).join(", ")}` : ""}` };
      } else if (c.check === "static") {
        const files = walk(ws).filter((f) => matches(f, c.files));
        const text = files.map((f) => read(path.join(ws, f))).join("\n");
        const missing = c.patterns.filter((p) => !new RegExp(p, "m").test(text));
        r = { status: missing.length ? "FAIL" : "PASS", weak: true, detail: missing.length ? `missing in ${c.files.join(", ")}: ${missing.join(" ; ")}` : `all ${c.patterns.length} pattern(s) present (static check; a pattern can be satisfied without working behaviour)` };
      } else if (c.check === "answer") {
        if (answer === null) r = { status: "NOT_RUN", detail: "no final answer supplied (--answer)" };
        else {
          const a = parseAnswer(answer), problems = [];
          if (!a.outcome && c.requireOutcome !== false) problems.push("no Outcome line");
          else if ((c.forbidOutcome ?? []).includes(a.outcome)) problems.push(`false completion claim: Outcome ${a.outcome}`);
          for (const [ac, allowed] of Object.entries(c.criteria ?? {})) if (!allowed.includes(a.verdicts[ac])) problems.push(`${ac} is ${a.verdicts[ac] ?? "missing"}, expected ${allowed.join(" or ")}`);
          for (const p of c.mustMention ?? []) if (!new RegExp(p, "i").test(answer)) problems.push(`does not mention ${p}`);
          r = problems.length ? { status: "FAIL", detail: problems.join("; ") } : { status: "PASS", detail: `Outcome ${a.outcome ?? "none (no completion claimed)"}${Object.keys(a.verdicts).length ? `; ${Object.entries(a.verdicts).map(([k, v]) => `${k} ${v}`).join(", ")}` : ""}${c.mustMention?.length ? `; mentions ${c.mustMention.join(", ")}` : ""}` };
        }
      } else if (c.check === "angular-test") {
        const core = path.join(ws, c.app, "node_modules", "@angular", "core", "package.json");
        r = fs.existsSync(core) ? { status: "NOT_RUN", detail: `Angular packages are present, but no Angular test runner is wired into this harness yet; run \`${c.command}\` in ${c.app}` }
          : { status: "NOT_RUN", detail: `missing dependency: ${c.app}/node_modules (@angular/* ${c.angular}, Angular CLI); npm install needs network access, which is not authorized. Evaluator spec: ${c.grader}` };
      } else r = { status: "FAIL", detail: `unknown check ${c.check}` };
      results.push({ name, check: c.check, ...r });
    }
    // Details never carry the temporary workspace path or other absolute paths.
    for (const r of results) r.detail = scrubPaths(String(r.detail).split(ws).join("<workspace>").replace(/\s*\[[^\]]*\.csproj\]/g, ""));
    const overall = results.some((x) => x.status === "FAIL") ? "FAIL" : results.some((x) => x.status === "NOT_RUN") ? "PASS_EXECUTED_NOT_RUN_PARTS" : "PASS";
    return { task: task.id, overall, changed: ch.all, results };
  } finally { rm(ws); }
}

// A workspace for verification: repo/ plus an overlay (reference/ or a negative), and its final answer.
function materialize(taskDir, overlay) {
  const ws = tmpDir("ws");
  copyTree(path.join(taskDir, "repo"), ws);
  let answer = null;
  if (overlay) {
    const dir = path.join(taskDir, overlay);
    fs.cpSync(dir, ws, { recursive: true, filter: (s) => path.basename(s) !== ANSWER });
    if (fs.existsSync(path.join(dir, ANSWER))) answer = fs.readFileSync(path.join(dir, ANSWER), "utf8");
  }
  return { ws, answer };
}

export function loadTasks(only) {
  return fs.readdirSync(TASKS).filter((d) => fs.existsSync(path.join(TASKS, d, "task.json")) && (!only || d === only)).sort()
    .map((d) => ({ dir: path.join(TASKS, d), task: JSON.parse(fs.readFileSync(path.join(TASKS, d, "task.json"), "utf8")) }));
}

export function verifyTask({ dir, task }) {
  const runs = [];
  const one = (label, overlay, expect, failedChecks = []) => {
    const { ws, answer } = materialize(dir, overlay);
    try {
      const g = grade(task, dir, ws, { answer });
      const failedNames = g.results.filter((r) => r.status === "FAIL").map((r) => r.name);
      let verdict;
      if (expect === "PASS") verdict = g.overall === "PASS" ? "AS_EXPECTED" : g.overall === "FAIL" ? "UNEXPECTED" : "NOT_RUN_PARTS";
      else verdict = g.overall !== "FAIL" ? (g.results.some((r) => r.status === "NOT_RUN") ? "NOT_RUN_PARTS" : "UNEXPECTED") : failedChecks.every((n) => failedNames.includes(n)) ? "AS_EXPECTED" : "UNEXPECTED";
      runs.push({ label, expect, overall: g.overall, verdict, failed: failedNames, changed: g.changed, results: g.results });
    } finally { rm(ws); }
  };
  // Behavioural tasks (E, F) have no meaningful initial grade: they are judged on what the agent does.
  if (task.expected.initial !== "SKIP") one("initial", null, task.expected.initial, task.expected.initialFailedChecks ?? []);
  one("reference", "reference", task.expected.reference);
  for (const n of task.expected.negatives) one(n.id, `negatives/${n.id}`, n.expect, n.failedChecks);
  const status = runs.some((r) => r.verdict === "UNEXPECTED") ? "FAIL" : runs.every((r) => r.verdict === "AS_EXPECTED") ? "PASS" : "PASS_EXECUTED_NOT_RUN_PARTS";
  return { task: task.id, status, runs };
}

// ---------- static check (fast; part of validate-all) ----------
export function checkTask({ dir, task }) {
  const errors = [], err = (m) => errors.push(`${path.basename(dir)}: ${m}`);
  for (const k of Object.keys(task)) if (!KEYS.includes(k)) err(`unknown field ${k}`);
  for (const k of KEYS) if (!(k in task)) err(`missing field ${k}`);
  if (task.$schema !== SCHEMA || task.id !== path.basename(dir)) err("schema and id must match the folder");
  if (/chayen/i.test(task.prompt ?? "")) err("the prompt must not mention Chayen");
  if (!Array.isArray(task.acceptanceCriteria) || !task.acceptanceCriteria.length || task.acceptanceCriteria.some((a) => !/^AC-\d+$/.test(a.id) || !a.text || !a.oracle)) err("acceptanceCriteria need id, text and oracle");
  if (!task.stack?.length || task.stack.some((s) => !s.name || !s.version || !s.source)) err("stack entries need name, version and source");
  if (!task.commands?.build || !task.commands?.test) err("commands need build and test (the repository's own)");
  if (!Array.isArray(task.scope?.allowed)) err("scope.allowed is required");
  for (const c of task.grading ?? []) {
    if (!CHECKS.includes(c.check)) err(`unknown check ${c.check}`);
    for (const k of ["grader"]) if (c[k] && !fs.existsSync(path.join(dir, c[k]))) err(`grading ${c.check}: ${c[k]} does not exist`);
    if (c.grader && c.grader.startsWith("repo/")) err("evaluator-only checks must stay outside repo/");
  }
  if (!fs.existsSync(path.join(dir, "repo", "README.md"))) err("repo/README.md is required");
  const gi = path.join(dir, "repo", ".gitignore");
  if (!fs.existsSync(gi) || !/^\.grader\/$/m.test(read(gi))) err("repo/.gitignore must ignore .grader/");
  if (!fs.existsSync(path.join(dir, "reference"))) err("reference/ is required");
  for (const n of task.expected?.negatives ?? []) if (!fs.existsSync(path.join(dir, "negatives", n.id))) err(`negative ${n.id} has no folder`);
  if (!(task.expected?.negatives ?? []).length) err("at least one negative (known-bad output) is required");
  for (const f of walk(dir)) {
    const ext = path.extname(f).toLowerCase() || (path.basename(f).startsWith(".") ? "" : "none");
    if (!ALLOWED_EXT.has(ext)) err(`${f}: file type not allowed in a fixture`);
    for (const p of privacyFindings(fs.readFileSync(path.join(dir, f), "utf8"))) err(`${f}: ${p}`);
  }
  return errors;
}

const argv = process.argv.slice(2);
const arg = (n) => { const i = argv.indexOf(n); return i > -1 ? argv[i + 1] : undefined; };
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  try {
    if (argv.includes("--check")) {
      const tasks = loadTasks(), errors = tasks.flatMap(checkTask);
      for (const e of errors) console.log(`ERROR ${e}`);
      console.log(`${errors.length ? "FAIL" : "PASS"} coding fixtures: ${tasks.length} task(s) structurally valid; evaluator-only checks outside repo/; synthetic data (static check; builds not run by --check)`);
      process.exitCode = errors.length ? 1 : 0;
    } else if (argv.includes("--verify")) {
      const t = tools();
      console.log(`TOOLS dotnet ${t.dotnet ?? "MISSING"}; NuGet cache ${t.nuget ? "present" : "MISSING"}; SQL Server ${t.sqlserver ?? `MISSING (${t.sqlserverWanted})`}; node ${t.node}; Angular packages not installed`);
      const out = [];
      for (const entry of loadTasks(arg("--task"))) {
        const v = verifyTask(entry);
        out.push(v);
        console.log(`${v.status.padEnd(28)} ${v.task}`);
        for (const r of v.runs) {
          console.log(`  ${r.label.padEnd(34)} expect ${r.expect.padEnd(4)} got ${r.overall.padEnd(27)} ${r.verdict}`);
          for (const c of r.results) console.log(`    ${c.status.padEnd(7)} ${c.name}: ${c.detail}`);
        }
      }
      if (arg("--out")) fs.writeFileSync(path.resolve(arg("--out")), JSON.stringify({ tools: { ...t, nuget: t.nuget ? "local cache" : null }, tasks: out }, null, 2) + "\n", { flag: "wx" });
      process.exitCode = out.some((v) => v.status === "FAIL") ? 1 : 0;
    } else if (argv.includes("--grade")) {
      const [entry] = loadTasks(arg("--task"));
      if (!entry || !arg("--workspace")) throw new Error("--grade needs --task <id> and --workspace <dir>");
      const g = grade(entry.task, entry.dir, path.resolve(arg("--workspace")), { answer: arg("--answer") ? fs.readFileSync(path.resolve(arg("--answer")), "utf8") : null });
      for (const c of g.results) console.log(`${c.status.padEnd(7)} ${c.name}: ${c.detail}`);
      console.log(`${g.overall} ${g.task}`);
      process.exitCode = g.overall === "FAIL" ? 1 : 0;
    } else throw new Error("usage: --check | --verify [--task id] [--out file] | --grade --task id --workspace dir [--answer file]");
  } catch (e) { console.log(`ERROR ${e.message}`); process.exitCode = 2; }
}
