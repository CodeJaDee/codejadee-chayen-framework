#!/usr/bin/env node
// Developer-only: runs every repository validator in sequence and reports a
// one-line result per gate. It is a convenience for maintainers working in
// this repository. It is not a Chayen CLI: it is never shipped, has no
// package.json or bin entry, and plugin users never run it.
// Zero dependencies (Node.js >= 20.11, for import.meta.dirname).
//
// Usage: node tools/validate/validate-all.mjs [--fail-fast]

import path from "node:path";
import { spawnSync } from "node:child_process";

const repo = path.resolve(import.meta.dirname, "..", "..");
const failFast = process.argv.includes("--fail-fast");
const steps = [
  ["G-SEC offline security profile (V-25)", "tools/validate/check-security.mjs", []],
  ["G-SEC-T offline security boundary regressions", "tests/security/boundaries.test.mjs", []],
  ["Phase 2 scope, upstream notice and lifecycle invariants", "tools/validate/check-hardening.mjs", []],
  ["Phase 2 hardening validator regressions", "tests/production/hardening.test.mjs", []],
  ["Phase 2 Thai numerals and calendar scorer regressions", "tests/editorial/numeric-preservation.test.mjs", []],
  ["Phase 2 isolated lifecycle regressions (offline fakes)", "tests/provider-compatibility/lifecycle.test.mjs", []],
  ["RC fingerprint and isolation negative controls (offline)", "tests/provider-compatibility/qualify-rc.test.mjs", []],
  ["Phase 5 evaluation fixtures, classifiers and no-send guards (offline; no provider calls)", "tests/evaluation/phase5/phase5.test.mjs", []],
  ["G-01 G-02 G-04..G-10 package, skills, references, catalog alignment", "tools/validate/validate-package.mjs", []],
  ["G-03 catalog integrity (V-11)", "tools/catalog/check-catalog.mjs", []],
  ["G-03b technology catalog (V-23)", "tools/catalog/check-technology.mjs", []],
  ["G-03c composite workflows and templates (V-24)", "tools/catalog/check-workflows.mjs", []],
  ["G-11 trigger eval cases in sync", "tools/evals/generate-claude-evals.mjs", ["--check"]],
  ["G-13 validator self-tests", "tools/validate/run-validator-tests.mjs", []],
  ["G-13R extensible registration fixtures: additional Skills accepted, identity and ownership faults rejected (D-066; offline, disposable copies)", "tests/catalog/registration.test.mjs", []],
  ["G-13M discovery metadata fixtures: metadata above the former 7,000 cap accepted, provider limits and description quality enforced, report deterministic (D-066; offline, disposable copies)", "tests/catalog/discovery-metrics.test.mjs", []],
  ["G-13G size and reference-graph fixtures: long files and deep chains accepted, cycles reported, integrity faults rejected (D-066; offline, disposable copies)", "tests/skills/reference-graph.test.mjs", []],
  ["G-13L limit-migration regressions: no former numeric cap enforced, all former limits exceeded at once still valid, provider, security and integrity faults rejected, rule documents agree (D-066; offline, disposable copies)", "tests/ci/limits.test.mjs", []],
  ["G-14 user and release documentation links and identifiers", "tools/validate/check-docs.mjs", []],
  ["G-14N isolated CI negative controls (offline, disposable copies)", "tests/ci/negative-controls.test.mjs", []],
  ["Phase 3 current documentation build-fact regressions", "tests/ci/documentation.test.mjs", []],
  ["G-15E editorial pattern inventory and case specifications (static)", "tools/validate/check-editorial-cases.mjs", []],
  ["G-16 opt-in response style policy, template, budget and package isolation (static)", "tools/validate/check-response-style.mjs", []],
  ["G-16T response style setup rules on disposable fixtures", "tests/response-style/setup-fixtures.test.mjs", []],
  ["G-18 guidance consistency invariants GI-01..GI-09 (static; REVIEW items do not fail)", "tools/validate/check-guidance.mjs", []],
  ["G-18T guidance consistency regressions on disposable copies", "tests/skills/guidance-consistency.test.mjs", []],
  ["G-19 project-map template, staleness and evidence mechanics on a disposable git monorepo (agent behaviour NOT_RUN)", "tests/skills/project-map.test.mjs", []],
  ["G-20 failure-case records, privacy rules and offline replay of recorded transcripts (D-068; no provider calls; model behaviour NOT_RUN)", "tools/evals/failure-cases.mjs", []],
  ["G-20T failure-case format, privacy, replay and verification-status regressions (offline, disposable copies)", "tests/failures/failure-cases.test.mjs", []],
  ["G-17 Step 40 evaluation dataset, discovery probes and scorer self-test (offline; no outputs scored)", "tools/evals/score-step40.mjs", ["--self-test"]],
];
let failed = 0;
for (const [label, script, args] of steps) {
  const nodeArgs = script.endsWith(".test.mjs") ? ["--test", path.join(repo, script)] : [path.join(repo, script), ...args];
  const r = spawnSync(process.execPath, nodeArgs, { encoding: "utf8", cwd: repo, timeout: 300_000 });
  const out = `${r.stdout ?? ""}${r.stderr ?? ""}`.trim().split("\n");
  const ok = r.status === 0;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${out.at(-1)}`);
  if (!ok) {
    if (r.error || r.signal) console.log(`ERROR ${script}: ${r.error?.message ?? r.signal}`);
    for (const l of out.slice(-60)) console.log(`        ${l}`);
  }
  if (!ok && (failFast || script.endsWith("check-security.mjs"))) {
    console.log("Validation stopped after failure; remaining gates NOT_RUN.");
    break;
  }
}
console.log(failed ? `\n${failed} gate group(s) failed` : "\nAll automated gates passed");
process.exit(failed ? 1 : 0);
