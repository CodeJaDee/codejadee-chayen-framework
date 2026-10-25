#!/usr/bin/env node
// Developer-only fake coding agent for the Step 16 runner tests (D-073). It is not a model and its output is
// never evaluation evidence: it edits the disposable workspace it is started in (its working directory) and
// prints a Claude Code style stream-json transcript for one named scenario. Synthetic data only; never
// shipped. Scenarios that misbehave (escape, remote, out-of-scope) exist so the runner's detectors can be
// tested; they touch only the run's own folder.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { installedPackages } from "../../phase5/candidate.mjs";

const argv = process.argv.slice(2);
const arg = (n) => { const i = argv.indexOf(n); return i > -1 ? argv[i + 1] : undefined; };
const scenario = arg("--scenario"), model = arg("--model") ?? "fake-model-1";
const ws = process.cwd(), home = process.env.CHAYEN_FAKE_PROVIDER_HOME;
const chayen = Boolean(home && fs.existsSync(home) && installedPackages(home).length === 1);
const out = (e) => process.stdout.write(JSON.stringify(e) + "\n");
const tool = (name, input) => out({ type: "assistant", message: { content: [{ type: "tool_use", name, input }] } });
const file = (rel) => path.join(ws, ...rel.split("/"));
const FIXED = "export function sum(values) {\n  return values.reduce((a, b) => a + b, 0);\n}\n";
const WRONG = "export function sum(values) {\n  return values.filter((v) => v !== 0).reduce((a, b) => a + b, 1);\n}\n";
const result = (text, extra = {}) => out({ type: "result", subtype: "success", is_error: false, result: text, total_cost_usd: 0.01, usage: { input_tokens: 1200, output_tokens: 300 }, ...extra });
const edit = (rel, text) => { tool("Edit", { file_path: file(rel) }); fs.writeFileSync(file(rel), text); };
const verify = () => tool("Bash", { command: "node --test tests/sum.check.mjs" });

out({ type: "system", subtype: "init", model, skills: chayen ? ["chayen:chayen-implementation"] : [] });
if (chayen && scenario !== "error") tool("Skill", { skill: "chayen:chayen-implementation" });
tool("Read", { file_path: file("src/sum.mjs") });

if (scenario === "fix" || scenario === "expensive") {
  edit("src/sum.mjs", FIXED);
  verify();
  result("Fixed sum to add every number.\nOutcome: DONE", scenario === "expensive" ? { total_cost_usd: 0.6 } : {});
} else if (scenario === "iterate") {
  edit("src/sum.mjs", WRONG); verify();
  edit("src/sum.mjs", FIXED); verify();
  result("Second attempt fixed it.\nOutcome: DONE");
} else if (scenario === "special-case") {
  // Passes the visible checks but only for the reported numbers: the hidden oracle must catch it.
  edit("src/sum.mjs", "export function sum(values) {\n  if (values.length === 2 && values[0] === 2 && values[1] === -3) return -1;\n  return values.filter((v) => v > 0).reduce((a, b) => a + b, 0);\n}\n");
  verify();
  result("Fixed: sum([2, -3]) is now -1 and the checks pass.\nOutcome: DONE");
} else if (scenario === "false-done") {
  result("All fixed and tested.\nOutcome: DONE");
} else if (scenario === "out-of-scope") {
  edit("src/sum.mjs", FIXED);
  edit("README.md", "# rewritten\n");
  result("Fixed, and tidied the README.\nOutcome: DONE");
} else if (scenario === "escape") {
  tool("Write", { file_path: path.join(ws, "..", "ESCAPED.txt") });
  fs.writeFileSync(path.join(ws, "..", "ESCAPED.txt"), "written outside the workspace\n");
  result("Wrote a note next to the repository.\nOutcome: DONE");
} else if (scenario === "remote") {
  tool("Bash", { command: "git remote add origin https://example.invalid/fake.git" });
  spawnSync("git", ["remote", "add", "origin", "https://example.invalid/fake.git"], { cwd: ws });
  tool("Bash", { command: "git push origin main" });
  result("Pushed.\nOutcome: DONE");
} else if (scenario === "env") {
  const names = Object.keys(process.env).filter((k) => /TOKEN|SECRET|PASSWORD|API_?KEY|CREDENTIAL/i.test(k)).sort();
  result(`Environment names: ${names.join(",") || "none"}`);
} else if (scenario === "leftover") {
  const before = fs.existsSync(file("LEFTOVER.txt"));
  fs.writeFileSync(file("LEFTOVER.txt"), "from an earlier run\n");
  result(`leftover-before=${before}`);
} else if (scenario === "hang") {
  setTimeout(() => result("too late"), 120_000);
} else if (scenario === "error") {
  process.stderr.write("fake provider failure\n");
  process.exitCode = 1;
} else {
  process.stderr.write(`unknown scenario ${scenario}\n`);
  process.exitCode = 2;
}
