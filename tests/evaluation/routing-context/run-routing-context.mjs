#!/usr/bin/env node
// Developer-only routing, collision and context benchmark (evolution Step 18, D-075). Never shipped.
//
// Offline (free; no provider is started and nothing is sent):
//   node tests/evaluation/routing-context/run-routing-context.mjs --static [--out <new dir>] [--json]
//       builds every synthetic scenario in a disposable copy under the OS temp directory, runs the real
//       package, catalog and security validators on it, measures discovery metadata, checks each scenario
//       against its expected outcome, and adds the SIMULATED lexical proxy. --out writes report.json and
//       report.md (deterministic, path-free).
//   ... --plan [--json]              billed calls a full provider run would need, per provider, scenario and arm
//   ... --score <records.jsonl> [...] per-configuration routing and context summaries of recorded runs
//   ... --self-test                  synthetic known-good and known-bad transcripts get their expected classes
//   ... --build <scenario> --out <new dir outside the repository>
//       writes one scenario's marketplace copy (plugin plus descriptors) for a separately authorized
//       install into an isolated provider home. It installs nothing.
// Live provider runs are not implemented here: --live exits 3 (BLOCKED) and names the prerequisites.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { metadataFingerprint } from "../phase5/phase5-lib.mjs";
import { loadSynthetic, loadCases, productionEntries, validateSpec, buildScenario, digestValidator, scenarioMetrics, scenarioSkills, simulatedRouting, summarizeAll, plan, applies, CASE_TYPES, REPORT_SCHEMA, PROVIDERS, HERE } from "./routing-context-lib.mjs";
import { selfTest } from "./routing-synthetic.mjs";

const repo = fs.realpathSync(path.resolve(HERE, "../../.."));
const argv = process.argv.slice(2);
const arg = (name) => { const i = argv.indexOf(name); return i > -1 ? argv[i + 1] : undefined; };
const has = (name) => argv.includes(name);
const fail = (msg, code = 2) => { console.error(msg); process.exit(code); };
const lfSha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n")).digest("hex");
const VALIDATORS = [["package", "tools/validate/validate-package.mjs", (r) => [r]], ["catalog", "tools/catalog/check-catalog.mjs", (r) => ["--root", r]], ["security", "tools/validate/check-security.mjs", (r) => ["--root", r]]];
const sameJson = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function outsideRepo(target) {
  const parent = fs.realpathSync(path.dirname(path.resolve(target)));
  if (parent === repo || parent.startsWith(repo + path.sep)) return null;
  return path.join(parent, path.basename(target));
}

// Expected outcome of one scenario: validity, the exact distinctness errors, and the conflicts the lexical
// check is expected to miss. Returns the differences; none means AS_EXPECTED.
export function scenarioOutcome(scenario, validators, metrics) {
  const diffs = [];
  const pkg = validators.find((v) => v.validator === "package");
  if (scenario.expect.valid) {
    for (const v of validators) if (v.result !== "PASS") diffs.push(`${v.validator} validator ${v.result} (${v.errorChecks.join(", ")})`);
    if (pkg?.shippedSkills !== metrics.skills) diffs.push(`package validator counted ${pkg?.shippedSkills} Skills, scenario has ${metrics.skills}`);
  } else {
    if (pkg?.result !== "FAIL") diffs.push("package validator accepted an invalid scenario");
    if (!sameJson(pkg?.errorChecks, ["V-07b description-distinctness"])) diffs.push(`package errors other than distinctness: ${pkg?.errorChecks.join(", ")}`);
    const want = scenario.expect.distinctnessErrors.map((p) => [...p].sort()).sort((a, b) => a.join("/").localeCompare(b.join("/")));
    if (!sameJson(pkg?.distinctnessErrors, want)) diffs.push(`distinctness errors ${JSON.stringify(pkg?.distinctnessErrors)}, expected ${JSON.stringify(want)}`);
  }
  for (const [a, b] of scenario.expect.undetectedConflicts ?? []) {
    const n = metrics.distinctness.neighbours.find((x) => (x.skill === a && x.neighbour === b) || (x.skill === b && x.neighbour === a));
    if (!n || n.lexicalVerdict !== "PASS") diffs.push(`${a} / ${b}: expected the lexical check to miss this conflict, got ${n?.lexicalVerdict ?? "no pair"}`);
  }
  return diffs;
}

function staticReport() {
  const synthetic = loadSynthetic(), cases = loadCases(), production = productionEntries(repo);
  const probes = JSON.parse(fs.readFileSync(path.join(repo, "tests/evaluation/phase5/routing-probes.json"), "utf8")).probes;
  const specErrors = validateSpec(synthetic, cases, production, { phase5Probes: probes });
  const tmpParent = fs.realpathSync(os.tmpdir());
  const scenarios = synthetic.scenarios.map((sc) => {
    const dir = fs.mkdtempSync(path.join(tmpParent, "chayen-routing-"));
    try {
      buildScenario(repo, sc, synthetic, dir);
      const validators = VALIDATORS.map(([name, script, args]) => {
        const r = spawnSync(process.execPath, [path.join(repo, script), ...args(dir)], { cwd: repo, encoding: "utf8", timeout: 120_000 });
        return digestValidator(name, r.status, `${r.stdout ?? ""}${r.stderr ?? ""}`);
      });
      const metrics = scenarioMetrics(sc, synthetic, production);
      const diffs = scenarioOutcome(sc, validators, metrics);
      const names = [...production.map((e) => e.name), ...scenarioSkills(sc, synthetic).map((s) => s.name)];
      const applicable = cases.cases.filter((c) => applies(c, names));
      return { id: sc.id, description: sc.description, expectation: sc.expect, skills: metrics.skills, syntheticSkills: metrics.syntheticSkills, validators, outcome: diffs.length ? "UNEXPECTED" : "AS_EXPECTED", differences: diffs,
        metadata: metrics.metadata, providers: metrics.providers, expensiveDescriptions: metrics.expensiveDescriptions, distinctness: metrics.distinctness, perSkill: metrics.perSkill,
        cases: { applicable: applicable.length, byType: Object.fromEntries(CASE_TYPES.map((t) => [t, applicable.filter((c) => c.type === t).length])) },
        simulated: simulatedRouting(sc, synthetic, production, cases) };
    } finally {
      if (path.dirname(dir) === tmpParent && path.basename(dir).startsWith("chayen-routing-")) fs.rmSync(dir, { recursive: true, force: true });
    }
  });
  const rows = plan(synthetic, cases, production);
  const valid = new Set(synthetic.scenarios.filter((s) => s.expect.valid).flatMap((s) => scenarioSkills(s, synthetic).map((x) => x.name)));
  return {
    $schema: REPORT_SCHEMA, step: 18,
    evidenceLevels: { static: "validators and metadata measured on disposable scenario copies", simulated: "lexical proxy (BM25); never routing evidence", provider: "NOT_RUN" },
    inputs: { syntheticSkillsSha256: lfSha(path.join(HERE, "synthetic-skills.json")), routingCasesSha256: lfSha(path.join(HERE, "routing-cases.json")), productionSkills: production.length, productionMetadataFingerprint: metadataFingerprint(path.join(repo, "plugins/codejadee-chayen-framework")) },
    specification: { errors: specErrors, syntheticSkills: synthetic.skills.length, validSyntheticSkills: valid.size, cases: cases.cases.length, byType: Object.fromEntries(CASE_TYPES.map((t) => [t, cases.cases.filter((c) => c.type === t).length])), byLexical: cases.cases.reduce((a, c) => ({ ...a, [c.lexical]: (a[c.lexical] ?? 0) + 1 }), {}), runsRequired: cases.runsRequired, objective: cases.objective },
    scenarios,
    providerRouting: PROVIDERS.map((provider) => ({ provider, status: "NOT_RUN", routingAccuracy: "NOT_MEASURED", noMatch: "NOT_MEASURED", contextTokens: "NOT_MEASURED", reason: "no recorded provider run; billed calls, an isolated signed-in home per arm and the install of synthetic test packages need owner authorization" })),
    plan: { rows, totalCalls: rows.reduce((a, r) => a + r.calls, 0), note: "Billed calls a complete run would need; nothing was sent" },
    result: specErrors.length || scenarios.some((s) => s.outcome !== "AS_EXPECTED") ? "FAIL" : "PASS",
  };
}

const pct = (r) => (r.value === null ? "n/a" : `${r.k}/${r.n} (${(r.value * 100).toFixed(1)}%)`);
export function formatStatic(rep) {
  const L = [];
  L.push("# Routing and context benchmark: static results", "", `Report \`${rep.$schema}\`, evolution Step 18. Generated by \`run-routing-context.mjs --static\`; deterministic and path-free.`, "");
  L.push(`Evidence levels: static (${rep.evidenceLevels.static}); simulated (${rep.evidenceLevels.simulated}); provider ${rep.evidenceLevels.provider}.`, "");
  L.push(`Inputs: ${rep.inputs.productionSkills} production Skills (metadata fingerprint \`${rep.inputs.productionMetadataFingerprint}\`); synthetic Skills \`${rep.inputs.syntheticSkillsSha256.slice(0, 16)}\`; routing cases \`${rep.inputs.routingCasesSha256.slice(0, 16)}\`.`, "");
  L.push(`Specification: ${rep.specification.syntheticSkills} synthetic Skills, ${rep.specification.validSyntheticSkills} of them in valid scenarios; ${rep.specification.cases} routing cases (${Object.entries(rep.specification.byType).map(([k, v]) => `${k} ${v}`).join(", ")}); errors: ${rep.specification.errors.length ? rep.specification.errors.join("; ") : "none"}.`, "");
  L.push("## Scenarios", "", "| Scenario | Skills | Package | Catalog | Security | Distinctness errors | Outcome |", "|---|---|---|---|---|---|---|");
  for (const s of rep.scenarios) {
    const v = Object.fromEntries(s.validators.map((x) => [x.validator, x]));
    L.push(`| ${s.id} | ${s.skills} (${s.syntheticSkills} synthetic) | ${v.package.result} | ${v.catalog.result} | ${v.security.result} | ${v.package.distinctnessErrors.map((p) => p.join(" / ")).join("; ") || "none"} | ${s.outcome}${s.differences.length ? `: ${s.differences.join("; ")}` : ""} |`);
  }
  L.push("", "## Discovery metadata (context tax per turn, estimated)", "", "| Scenario | Characters | Est. tokens | Change from production | Codex 8,000-character figure | Claude Code | Copilot |", "|---|---|---|---|---|---|---|");
  for (const s of rep.scenarios) {
    const p = (name) => s.providers.find((x) => x.provider.startsWith(name));
    const codex = p("Codex");
    L.push(`| ${s.id} | ${s.metadata.chars.toLocaleString("en-US")} | ${s.metadata.estTokens.toLocaleString("en-US")} | +${s.metadata.deltaChars.toLocaleString("en-US")} chars (+${s.metadata.deltaEstTokens.toLocaleString("en-US")} tokens) | ${codex.status} (headroom ${codex.headroom.toLocaleString("en-US")}) | ${p("Claude").status} | ${p("GitHub").status} |`);
  }
  L.push("", `Token figures are ${rep.scenarios[0].metadata.tokenEstimate}. Provider figures are documented, not measured on a host.`, "");
  L.push("## Description overlap of synthetic Skills with their neighbours", "", "| Scenario | Skill | Group | Neighbour | Overlap | Lexical check |", "|---|---|---|---|---|---|");
  for (const s of rep.scenarios) for (const n of s.distinctness.neighbours) L.push(`| ${s.id} | ${n.skill} | ${n.group} | ${n.neighbour}${n.present ? "" : " (absent)"} | ${n.overlap ?? "n/a"} | ${n.lexicalVerdict} |`);
  L.push("", "## Simulated lexical proxy (diagnostic only, never routing evidence)", "", "| Scenario | Keyword prompts | Paraphrase prompts | Regression prompts | No-match | Unsupported |", "|---|---|---|---|---|---|");
  const sr = (s, k) => (s.simulated?.rates[k] ? pct(s.simulated.rates[k]) : "n/a");
  for (const s of rep.scenarios) L.push(`| ${s.id} | ${sr(s, "lexical:keyword")} | ${sr(s, "lexical:paraphrase")} | ${sr(s, "type:regression")} | ${sr(s, "type:no-match")} | ${sr(s, "type:unsupported")} |`);
  L.push("", "## Provider routing", "", "| Provider | Status | Routing accuracy | No-match | Context tokens |", "|---|---|---|---|---|");
  for (const p of rep.providerRouting) L.push(`| ${p.provider} | ${p.status} | ${p.routingAccuracy} | ${p.noMatch} | ${p.contextTokens} |`);
  L.push("", `Reason: ${rep.providerRouting[0].reason}.`, "", `Plan: ${rep.plan.totalCalls.toLocaleString("en-US")} billed calls for ${rep.specification.runsRequired} runs of every applicable case on every provider (${rep.plan.note.toLowerCase()}).`, "", `Result: ${rep.result}.`, "");
  return L.join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  if (has("--live")) {
    fail("BLOCKED: live routing runs of synthetic scenarios are not implemented in this runner. They need the owner's authorization for billed calls, a budget cap, signed-in isolated homes per provider and arm, and an approved install of each synthetic test package into those homes (never into the production package). Production routing uses run-phase5.mjs --suite routing. Nothing was sent.", 3);
  } else if (has("--self-test")) {
    const results = selfTest();
    for (const r of results) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.label}${r.diffs.length ? `: ${r.diffs.join("; ")}` : ""}`);
    const failed = results.filter((r) => !r.pass).length;
    console.log(`${failed ? "FAIL" : "PASS"}  routing scorer self-test ${results.length - failed}/${results.length} (SIMULATED transcripts; no provider)`);
    process.exitCode = failed ? 1 : 0;
  } else if (has("--plan")) {
    const rows = plan(loadSynthetic(), loadCases(), productionEntries(repo));
    if (has("--json")) console.log(JSON.stringify(rows, null, 2));
    else { for (const r of rows) console.log(`PLAN  ${r.provider.padEnd(7)} ${r.scenario.padEnd(26)} ${r.arm.padEnd(8)} ${String(r.cases).padStart(3)} x ${r.runs} = ${String(r.calls).padStart(4)} call(s)`); console.log(`PLAN  total ${rows.reduce((a, r) => a + r.calls, 0)} billed call(s); nothing was created or sent`); }
  } else if (has("--score")) {
    const files = argv.flatMap((a, i) => (argv[i - 1] === "--score" ? [a] : []));
    const records = files.flatMap((f) => fs.readFileSync(path.resolve(f), "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l)));
    console.log(JSON.stringify(summarizeAll(records, loadCases()), null, 2));
  } else if (arg("--build")) {
    const synthetic = loadSynthetic(), sc = synthetic.scenarios.find((s) => s.id === arg("--build"));
    if (!sc) fail(`Unknown scenario ${arg("--build")}`);
    if (!sc.expect.valid) fail(`${sc.id} is invalid by design and is never installed`);
    const out = arg("--out") && outsideRepo(arg("--out"));
    if (!out) fail("--out <new directory outside the repository> required");
    if (fs.existsSync(out)) fail("Refusing an existing --out directory");
    const added = buildScenario(repo, sc, synthetic, out);
    console.log(`Built ${sc.id}: production Skills plus ${added.length} synthetic Skill(s). Nothing was installed or sent.`);
  } else if (has("--static")) {
    const outArg = arg("--out");
    const out = outArg ? path.resolve(outArg) : null;
    if (out && fs.existsSync(out)) fail("Refusing an existing --out directory");
    const rep = staticReport();
    if (out) {
      fs.mkdirSync(out, { recursive: true });
      fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(rep, null, 2) + "\n");
      fs.writeFileSync(path.join(out, "report.md"), formatStatic(rep));
    }
    if (has("--json")) console.log(JSON.stringify(rep, null, 2));
    else {
      for (const s of rep.scenarios) console.log(`${s.outcome === "AS_EXPECTED" ? "PASS" : "FAIL"}  ${s.id}: ${s.skills} Skills (${s.syntheticSkills} synthetic); validators ${s.validators.map((v) => `${v.validator} ${v.result}`).join(", ")}; metadata ${s.metadata.chars} chars (~${s.metadata.estTokens} tokens, estimate); ${s.outcome}${s.differences.length ? `: ${s.differences.join("; ")}` : ""}`);
      console.log(`INFO  specification: ${rep.specification.validSyntheticSkills} valid synthetic Skills, ${rep.specification.cases} cases; errors ${rep.specification.errors.length}`);
      console.log(`INFO  provider routing: ${rep.providerRouting.map((p) => `${p.provider} ${p.status}`).join(", ")}; plan ${rep.plan.totalCalls} billed calls`);
      console.log(`${rep.result}  routing and context static benchmark`);
    }
    process.exitCode = rep.result === "PASS" ? 0 : 1;
  } else fail("usage: run-routing-context.mjs --static [--out <dir>] [--json] | --plan [--json] | --score <records.jsonl> ... | --self-test | --build <scenario> --out <dir> | --live");
}
