#!/usr/bin/env node
// Developer-only: runs every repository validator in sequence and reports a
// one-line result per gate. It is a convenience for maintainers working in
// this repository. It is not a Chayen CLI: it is never shipped, has no
// package.json or bin entry, and plugin users never run it.
// Zero dependencies (Node.js >= 20.11, for import.meta.dirname).
//
// Usage: node tools/validate/validate-all.mjs

import path from "node:path";
import { spawnSync } from "node:child_process";

const repo = path.resolve(import.meta.dirname, "..", "..");
const steps = [
  ["G-SEC offline security profile (V-25)", "tools/validate/check-security.mjs", []],
  ["G-SEC-T offline security boundary regressions", "tests/security/boundaries.test.mjs", []],
  ["G-01 G-02 G-04..G-10 package, skills, references, catalog alignment", "tools/validate/validate-package.mjs", []],
  ["G-03 catalog integrity (V-11)", "tools/catalog/check-catalog.mjs", []],
  ["G-03b technology catalog (V-23)", "tools/catalog/check-technology.mjs", []],
  ["G-03c composite workflows and templates (V-24)", "tools/catalog/check-workflows.mjs", []],
  ["G-11 trigger eval cases in sync", "tools/evals/generate-claude-evals.mjs", ["--check"]],
  ["G-13 validator self-tests", "tools/validate/run-validator-tests.mjs", []],
];
let failed = 0;
for (const [label, script, args] of steps) {
  const nodeArgs = script.endsWith(".test.mjs") ? ["--test", path.join(repo, script)] : [path.join(repo, script), ...args];
  const r = spawnSync(process.execPath, nodeArgs, { encoding: "utf8", cwd: repo, timeout: 300_000 });
  const out = `${r.stdout}${r.stderr}`.trim().split("\n");
  const ok = r.status === 0;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${out.at(-1)}`);
  if (!ok) for (const l of out.filter((x) => /^(ERROR|FAIL)/.test(x)).slice(0, 10)) console.log(`        ${l}`);
  if (!ok && script.endsWith("check-security.mjs")) {
    console.log("Security preflight failed; remaining gates NOT_RUN. Review source before continuing.");
    break;
  }
}
console.log(failed ? `\n${failed} gate group(s) failed` : "\nAll automated gates passed");
process.exit(failed ? 1 : 0);
