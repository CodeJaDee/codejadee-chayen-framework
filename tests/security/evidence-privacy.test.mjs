// Developer-only evidence privacy gate (evolution Step 19). V-25 deliberately skips `results/` directories:
// they hold recorded evidence that is never rewritten. This gate scans every committed `results/` directory
// for the V-25.2 secret patterns and for user-home paths. The one historical path disclosure is listed with its
// reason instead of being hidden, so any new leak fails. Matched values are never printed. Offline; never shipped.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { SECRET_PATTERNS } from "../../tools/validate/secret-patterns.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const HOME_PATH = /[A-Za-z]:[\\/]+Users[\\/]+[A-Za-z0-9._-]+|\/Users\/[a-z][\w.-]*|\/home\/[a-z][\w.-]*/;
// Known, open finding (Step 19 report). Redaction needs owner approval because recorded evidence is never rewritten.
export const KNOWN_HOME_PATHS = new Map([
  ["tests/technology/angular-typescript/results/step21-fact-checks.md", "Step 21 command line records a local Windows user path"],
  ["tests/security/results/step30-gates.txt", "Step 30 validator output records its root=<local Windows user path>"],
]);

export function scanEvidence(root) {
  const dirs = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if ([".git", "node_modules"].includes(e.name) || e.isSymbolicLink()) continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (e.name === "results") dirs.push(p); walk(p); }
    }
  })(root);
  const out = { dirs: dirs.length, files: 0, secrets: [], homePaths: [] };
  for (const d of dirs) for (const f of fs.readdirSync(d, { recursive: true })) {
    const p = path.join(d, f);
    if (!fs.lstatSync(p).isFile()) continue;
    out.files++;
    const rel = path.relative(root, p).split(path.sep).join("/"), text = fs.readFileSync(p, "utf8");
    for (const [rule, re] of SECRET_PATTERNS) if (re.test(text)) out.secrets.push({ file: rel, rule });
    if (HOME_PATH.test(text)) out.homePaths.push(rel);
  }
  return out;
}

// Raw scanner output (for example SkillSpector JSON) records absolute paths. It belongs in the ignored
// .scan-reports/ folder; a tracked copy outside results/ was the gap the results-only walk above missed.
const SCANNER_REPORT = /(^|\/)(chayen-security-[^/]*|[^/]*skillspector[^/]*)\.(json|md|log|txt|sarif)$/i;
const gitFiles = (root) => {
  const r = spawnSync("git", ["-c", "core.quotepath=off", "ls-files", "-z"], { cwd: root, encoding: "utf8" });
  return r.status === 0 ? r.stdout.split("\0").filter(Boolean) : null;
};

export function scanTrackedScannerReports(root) {
  const files = gitFiles(root);
  if (files === null) return null;
  const out = { reports: [], secrets: [], homePaths: [] };
  for (const rel of files) {
    if (!SCANNER_REPORT.test(rel) || rel.split("/").includes("results")) continue;
    const p = path.join(root, rel);
    if (!fs.existsSync(p) || !fs.lstatSync(p).isFile()) continue;
    out.reports.push(rel);
    const text = fs.readFileSync(p, "utf8");
    for (const [rule, re] of SECRET_PATTERNS) if (re.test(text)) out.secrets.push({ file: rel, rule });
    if (HOME_PATH.test(text)) out.homePaths.push(rel);
  }
  return out;
}

test("tracked scanner reports outside results/ hold no secret-shaped value or user-home path", (t) => {
  const r = scanTrackedScannerReports(repo);
  if (r === null) return t.skip("not a git checkout");
  assert.deepEqual(r.secrets, []);
  assert.deepEqual(r.homePaths, [], "tracked scanner report records a user-home path; keep raw reports in .scan-reports/");
});

test("the scanner-report check flags a tracked root report with a home path, and ignores untracked ones", (t) => {
  const root = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), "chayen-scanrep-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = (...a) => spawnSync("git", ["-c", "core.autocrlf=false", ...a], { cwd: root, encoding: "utf8" });
  if (git("init", "-q").status !== 0) return t.skip("git unavailable");
  const leaked = JSON.stringify({ skills: [{ source: "C:\\Users\\someone\\repo\\plugins\\x" }] });
  fs.writeFileSync(path.join(root, "chayen-security-report.json"), leaked);
  fs.writeFileSync(path.join(root, "untracked-skillspector.json"), leaked);
  fs.writeFileSync(path.join(root, "notes.json"), leaked); // not a scanner report name
  assert.equal(git("add", "chayen-security-report.json", "notes.json").status, 0);
  const r = scanTrackedScannerReports(root);
  assert.deepEqual(r.reports, ["chayen-security-report.json"]);
  assert.deepEqual(r.homePaths, ["chayen-security-report.json"]);
  assert.doesNotMatch(JSON.stringify(r), /someone/);
});

test("committed evidence holds no secret-shaped value and no new user-home path", () => {
  const r = scanEvidence(repo);
  assert.ok(r.dirs >= 10 && r.files >= 40, `scanned ${r.dirs} results directories, ${r.files} files`);
  assert.deepEqual(r.secrets, []);
  assert.deepEqual(r.homePaths.filter((f) => !KNOWN_HOME_PATHS.has(f)), [], "new user-home path in committed evidence");
});

test("the scan finds a token and a home path in any nested results directory, without printing values", (t) => {
  const root = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), "chayen-evidence-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const token = "ghp_" + "B".repeat(36); // Synthetic sentinel, never a credential.
  fs.mkdirSync(path.join(root, "a/b/results/run"), { recursive: true });
  fs.writeFileSync(path.join(root, "a/b/results/run/summary.json"), JSON.stringify({ log: `token ${token}` }));
  fs.writeFileSync(path.join(root, "a/b/results/paths.md"), "ran C:\\Users\\someone\\scratch\\x");
  fs.mkdirSync(path.join(root, "a/notes"), { recursive: true });
  fs.writeFileSync(path.join(root, "a/notes/outside.md"), token); // outside any results directory: not evidence
  const r = scanEvidence(root);
  assert.deepEqual(r.secrets, [{ file: "a/b/results/run/summary.json", rule: "github-token" }]);
  assert.deepEqual(r.homePaths, ["a/b/results/paths.md"]);
  assert.doesNotMatch(JSON.stringify(r), new RegExp(token));
});
