// Developer-only regressions for the Step 18 routing, collision and context benchmark (D-075). Synthetic
// scenarios are built only in disposable OS-temp copies; the production package must be unchanged.
// Synthetic transcripts are controls, never routing evidence. No provider is invoked.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { lfFingerprint } from "../phase5/candidate.mjs";
import { loadSynthetic, loadCases, productionEntries, validateSpec, scenarioMetrics, summarizeAll, summarizeConfiguration, phase5Impact, digestValidator, routingContextSummary, plan, applies, NONE_TYPES } from "./routing-context-lib.mjs";
import { fakeRecord, selfTest } from "./routing-synthetic.mjs";
import { scenarioOutcome } from "./run-routing-context.mjs";

const here = import.meta.dirname, repo = path.resolve(here, "../../..");
const PLUGIN = path.join(repo, "plugins/codejadee-chayen-framework");
const RUNNER = path.join(here, "run-routing-context.mjs");
const COMMITTED = path.join(here, "results/2026-10-23-static");
const synthetic = loadSynthetic(), cases = loadCases(), production = productionEntries(repo);
const probes = JSON.parse(fs.readFileSync(path.join(repo, "tests/evaluation/phase5/routing-probes.json"), "utf8")).probes;
const byId = Object.fromEntries(cases.cases.map((c) => [c.id, c]));
const clone = (v) => JSON.parse(JSON.stringify(v));
const node = (args, opts = {}) => spawnSync(process.execPath, [RUNNER, ...args], { cwd: repo, encoding: "utf8", timeout: 300_000, ...opts });
function tmp(t, prefix) {
  const parent = fs.realpathSync(os.tmpdir()), dir = fs.mkdtempSync(path.join(parent, prefix));
  t.after(() => { assert.equal(path.dirname(dir), parent); fs.rmSync(dir, { recursive: true, force: true }); });
  return dir;
}

test("specification: valid, every measured behaviour covered, more than 16 valid synthetic Skills", () => {
  assert.deepEqual(validateSpec(synthetic, cases, production, { phase5Probes: probes }), []);
  const valid = new Set(synthetic.scenarios.filter((s) => s.expect.valid).flatMap((s) => s.add.flatMap((a) => (a.startsWith("group:") ? synthetic.skills.filter((x) => x.group === a.slice(6)).map((x) => x.name) : [a]))));
  assert.ok(valid.size > 16, `${valid.size} valid synthetic Skills`);
  for (const g of ["distinct", "adjacent", "overlap", "conflict"]) assert.ok(synthetic.skills.some((s) => s.group === g), g);
  assert.ok(synthetic.skills.some((s) => /\d/.test(s.name)), "a valid name with digits is exercised");
  assert.ok(cases.cases.some((c) => c.lexical === "paraphrase") && cases.cases.some((c) => c.lexical === "keyword"));
  assert.ok(cases.runsRequired >= 3);
  assert.equal(cases.objective.automaticRoutingAccuracyPerCli, 0.85);
});

test("specification controls: faulty cases and too few synthetic Skills are rejected", () => {
  const errs = (mutate) => { const s = clone(synthetic), c = clone(cases); mutate(s, c); return validateSpec(s, c, production, { phase5Probes: probes }).join("\n"); };
  assert.match(errs((s, c) => { c.cases.find((x) => x.lexical === "paraphrase").prompt = "Package and check the Minecraft datapack layout and mod loader manifest schema."; }), /paraphrase shares/);
  assert.match(errs((s, c) => { c.cases[0].prompt += " Use chayen-syn-game-mods."; }), /names a Skill/);
  assert.match(errs((s, c) => { c.cases[0].expect.any_of = ["chayen-unknown"]; }), /unknown Skill chayen-unknown/);
  assert.match(errs((s, c) => { c.cases.find((x) => x.type === "regression").prompt += " Now."; }), /not a verbatim copy/);
  assert.match(errs((s, c) => { c.cases = c.cases.filter((x) => x.type !== "no-match"); }), /no no-match case/);
  assert.match(errs((s, c) => { c.cases.find((x) => x.type === "conflict").expect.any_of.pop(); }), /accept both colliding Skills/);
  assert.match(errs((s) => { s.scenarios = s.scenarios.filter((x) => !["SC2-adjacent", "SC3-overlap"].includes(x.id)); }), /more than 16 are required/);
  assert.match(errs((s) => { s.skills[0].name = "chayen-data"; }), /chayen-syn- prefix|collides with a shipped Skill/);
});

test("static benchmark: every scenario meets its expected outcome; the production package is untouched", (t) => {
  const before = lfFingerprint(PLUGIN).sha256;
  const out = path.join(tmp(t, "chayen-rc-static-"), "report");
  const r = node(["--static", "--out", out]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(lfFingerprint(PLUGIN).sha256, before, "production package changed");
  const rep = JSON.parse(fs.readFileSync(path.join(out, "report.json"), "utf8"));
  const sc = Object.fromEntries(rep.scenarios.map((s) => [s.id, s]));
  for (const s of rep.scenarios) assert.equal(s.outcome, "AS_EXPECTED", `${s.id}: ${s.differences.join("; ")}`);
  assert.deepEqual(Object.fromEntries(rep.scenarios.map((s) => [s.id, s.skills])), { "SC0-production": 16, "SC1-distinct": 24, "SC2-adjacent": 30, "SC3-overlap": 34, "SC4-semantic-conflict": 25, "SC5-lexical-conflict": 27 });
  for (const id of ["SC1-distinct", "SC2-adjacent", "SC3-overlap", "SC4-semantic-conflict"]) for (const v of sc[id].validators) assert.equal(v.result, "PASS", `${id} ${v.validator}`);
  assert.equal(sc["SC3-overlap"].validators[0].shippedSkills, 34);
  assert.deepEqual(sc["SC5-lexical-conflict"].validators[0].errorChecks, ["V-07b description-distinctness"]);
  assert.deepEqual(sc["SC5-lexical-conflict"].validators[0].distinctnessErrors, [["chayen-data", "chayen-syn-sql-tuning"], ["chayen-syn-graphql", "chayen-syn-graphql-schema"]]);
  assert.equal(sc["SC4-semantic-conflict"].distinctness.neighbours.find((n) => n.skill === "chayen-syn-test-authoring").lexicalVerdict, "PASS", "the paraphrased duplicate is invisible to the lexical check");
  for (const p of rep.providerRouting) assert.equal(p.status, "NOT_RUN");
  assert.equal(rep.evidenceLevels.provider, "NOT_RUN");
  assert.doesNotMatch(fs.readFileSync(path.join(out, "report.json"), "utf8") + fs.readFileSync(path.join(out, "report.md"), "utf8"), /[A-Za-z]:\\|\/Users\/|\/home\/|\/tmp\//);
  for (const f of ["report.json", "report.md"]) assert.equal(fs.readFileSync(path.join(out, f), "utf8"), fs.readFileSync(path.join(COMMITTED, f), "utf8").replace(/\r\n/g, "\n"), `${f} differs from the committed report`);
});

test("expected outcomes are enforced: a missed, extra or undetected distinctness error is UNEXPECTED", () => {
  const sc5 = synthetic.scenarios.find((s) => s.id === "SC5-lexical-conflict"), sc4 = synthetic.scenarios.find((s) => s.id === "SC4-semantic-conflict");
  const v = (exit, out) => [digestValidator("package", exit, out), digestValidator("catalog", 0, ""), digestValidator("security", 0, "")];
  const both = "ERROR V-07b description-distinctness: chayen-data vs chayen-syn-sql-tuning: description word overlap 0.92 > 0.35\nERROR V-07b description-distinctness: chayen-syn-graphql vs chayen-syn-graphql-schema: description word overlap 0.96 > 0.35\n";
  const m5 = scenarioMetrics(sc5, synthetic, production), m4 = scenarioMetrics(sc4, synthetic, production);
  assert.deepEqual(scenarioOutcome(sc5, v(1, both), m5), []);
  assert.match(scenarioOutcome(sc5, v(1, both.split("\n")[0]), m5).join(), /distinctness errors/);
  assert.match(scenarioOutcome(sc5, v(0, ""), m5).join(), /accepted an invalid scenario/);
  assert.match(scenarioOutcome(sc5, v(1, `${both}ERROR V-20 description-breadth: x\n`), m5).join(), /other than distinctness/);
  const pass = `PASS  V-07 discovery-metadata: ${m4.skills} shipped skills (x)\n`;
  assert.deepEqual(scenarioOutcome(sc4, v(0, pass), m4), []);
  assert.match(scenarioOutcome(sc4, v(1, `${pass}ERROR V-20 description-breadth: y\n`), m4).join(), /package validator FAIL/);
  const caught = clone(m4); caught.distinctness.neighbours[0].lexicalVerdict = "ERROR";
  assert.match(scenarioOutcome(sc4, v(0, pass), caught).join(), /expected the lexical check to miss/);
});

test("metadata: totals equal an independent recount; per-Skill shares sum to 1; the Codex figure is crossed", () => {
  for (const sc of synthetic.scenarios) {
    const m = scenarioMetrics(sc, synthetic, production);
    const names = new Set(m.perSkill.map((s) => s.name));
    const recount = [...production, ...synthetic.skills.filter((s) => names.has(s.name))].reduce((n, e) => n + e.name.length + e.description.length, 0);
    assert.equal(m.metadata.chars, recount, sc.id);
    assert.equal(m.metadata.estTokens, Math.round(recount / 4));
    assert.ok(Math.abs(m.perSkill.reduce((a, s) => a + s.shareOfTotal, 0) - 1) < 0.001, sc.id);
  }
  const codex = (id) => scenarioMetrics(synthetic.scenarios.find((s) => s.id === id), synthetic, production).providers.find((p) => p.provider === "Codex").status;
  assert.equal(codex("SC0-production"), "WITHIN_DOCUMENTED_FIGURE");
  assert.equal(codex("SC1-distinct"), "EXCEEDS_DOCUMENTED_FIGURE");
});

test("scorer self-test: native activation evidence only; answer text and repository files are never activation", () => {
  const results = selfTest();
  for (const r of results) assert.ok(r.pass, `${r.label}: ${r.diffs.join("; ")}`);
  assert.ok(results.length >= 20);
  const r = node(["--self-test"]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /PASS {2}routing scorer self-test \d+\/\d+ \(SIMULATED transcripts; no provider\)/);
});

test("summaries: one per provider configuration, every measured category, context tax, errors kept", () => {
  const c = (id) => byId[id];
  const recs = [];
  for (const provider of ["claude", "codex"]) for (let run = 1; run <= 3; run++) {
    const usage = provider === "claude" ? { input_tokens: 100, cache_creation_input_tokens: 2000 + run, cache_read_input_tokens: 0, output_tokens: 50 } : { input_tokens: 2100 + run, cached_input_tokens: 0, output_tokens: 40 };
    recs.push(fakeRecord(c("rc-pos-vba-k"), provider, { skills: ["chayen-syn-vba"], refs: [["chayen-syn-vba", "notes.md"]], reads: 2, usage }, { run }));
    recs.push(fakeRecord(c("rc-pos-latex-p"), provider, run === 1 ? {} : { skills: ["chayen-syn-latex"], usage }, { run }));
    recs.push(fakeRecord(c("rc-pos-gis-k"), provider, { skills: ["chayen-data", "chayen-devops"], usage }, { run }));
    recs.push(fakeRecord(c("rc-nm-weather"), provider, { usage }, { run }));
    recs.push(fakeRecord(c("rc-nm-weather"), provider, { usage: { ...usage, input_tokens: 90 } }, { run, arm: "baseline" }));
    recs.push(fakeRecord(c("rc-uns-nitro"), provider, { skills: ["chayen-backend"], usage }, { run }));
    recs.push(fakeRecord(c("rc-exp-k6"), provider, { skills: ["chayen-syn-k6-scripts"], usage }, { run }));
    recs.push(fakeRecord(c("rc-amb-order-totals"), provider, { grepFirst: true, usage }, { run }));
    recs.push(fakeRecord(c("rc-pos-ros-k"), provider, run === 3 ? { crash: true } : { skills: ["chayen-syn-ros"], usage }, { run }));
  }
  const all = summarizeAll(recs, cases);
  assert.deepEqual(all.map((s) => s.provider), ["claude", "codex"], "no pooled row");
  const s = all[0];
  assert.equal(s.evidenceLevel, "SIMULATED");
  assert.equal(s.automaticRoutingAccuracy.meetsObjective, null);
  assert.deepEqual([s.selection.correct.k, s.selection.correct.n, s.selection.missed.k, s.selection.wrong.k, s.selection.multipleUnexpected.k], [7, 12, 1, 3, 3]);
  assert.deepEqual([s.explicit.k, s.noMatch.k, s.unsupported.k, s.ambiguous.k], [3, 3, 0, 3]);
  assert.equal(s.errors, 1, "an infrastructure error is kept and reported, not dropped");
  assert.deepEqual(s.unstableCases, ["rc-pos-latex-p", "rc-pos-ros-k"]);
  assert.equal(s.contextTax.tokenSource, "provider-reported for some runs only");
  assert.equal(s.contextTax.referencesPerTask.max, 1);
  assert.ok(s.contextTax.searchReadCalls.max >= 3);
  assert.equal(s.contextTax.seconds.median, 30);
  assert.ok(s.contextTax.discoveryOverheadTokens.value > 0, JSON.stringify(s.contextTax.discoveryOverheadTokens));
  const copilot = summarizeConfiguration([fakeRecord(c("rc-nm-weather"), "copilot", {})], cases);
  assert.match(copilot.contextTax.tokenSource, /^NOT_MEASURED/);
  assert.equal(copilot.contextTax.discoveryOverheadTokens.status, "NOT_MEASURED");
  assert.throws(() => summarizeConfiguration(recs, cases), /Refusing to pool/);
  assert.throws(() => summarizeConfiguration([fakeRecord(c("rc-nm-weather"), "claude", {}), fakeRecord(c("rc-nm-weather"), "claude", {}, { run: 2, meta: { packageFingerprint: "other" } })], cases), /installed packages/);
});

test("Phase 5 routing records get the same breakdown and context tax", () => {
  const spec = { probes: probes.filter((p) => ["p5-pos-backend-efcore-paging", "p5-nm-weather", "p5-neg-backend-nitro"].includes(p.id)) };
  const base = { provider: "claude", cliVersion: "1", model: "m", modelConfig: "pinned", packageFingerprint: "f", metadataFingerprint: "m", specHash: "s", candidateId: "c", arm: "plugin", attempt: 1, completion: "success", actions: [{ tool: "Grep" }, { tool: "Read" }], referencesRead: [], seconds: 12, usage: { input_tokens: 10, output_tokens: 5 } };
  const recs = [
    { ...base, promptId: "p5-pos-backend-efcore-paging", run: 1, observedSkills: ["chayen-backend", "chayen-data", "chayen-security"] },
    { ...base, promptId: "p5-nm-weather", run: 1, observedSkills: [] },
    { ...base, promptId: "p5-neg-backend-nitro", run: 1, observedSkills: ["chayen-backend"] },
  ];
  const s = phase5Impact(recs, spec);
  assert.equal(s.selection.multipleUnexpected.k, 1);
  assert.equal(s.selection.correctPlusUnexpected.k, 1);
  assert.equal(s.unsupported.k, 0);
  assert.equal(s.noMatch.k, 1);
  assert.equal(s.contextTax.searchReadCalls.median, 2);
});

test("runner guards: live runs BLOCKED; builds never inside the repository; invalid scenarios never built", (t) => {
  let r = node(["--live"]);
  assert.equal(r.status, 3); assert.match(r.stderr, /^BLOCKED: .*Nothing was sent\./);
  r = node(["--build", "SC3-overlap", "--out", path.join(repo, "tmp-routing-build")]);
  assert.equal(r.status, 2); assert.match(r.stderr, /outside the repository/);
  assert.ok(!fs.existsSync(path.join(repo, "tmp-routing-build")));
  r = node(["--build", "SC5-lexical-conflict", "--out", path.join(tmp(t, "chayen-rc-build-"), "x")]);
  assert.equal(r.status, 2); assert.match(r.stderr, /invalid by design/);
  const out = path.join(tmp(t, "chayen-rc-build-"), "sc1");
  r = node(["--build", "SC1-distinct", "--out", out]);
  assert.equal(r.status, 0, r.stderr);
  assert.ok(fs.existsSync(path.join(out, "plugins/codejadee-chayen-framework/skills/chayen-syn-game-mods/SKILL.md")));
  assert.ok(fs.existsSync(path.join(out, ".claude-plugin/marketplace.json")));
  r = node(["--plan"]); assert.equal(r.status, 0); assert.match(r.stdout, /total \d+ billed call\(s\); nothing was created or sent/);
  const rows = plan(synthetic, cases, production);
  assert.ok(rows.every((x) => x.scenario !== "SC5-lexical-conflict"), "an invalid scenario is never planned for installation");
  const baselineCases = cases.cases.filter((c) => NONE_TYPES.includes(c.type) && applies(c, production.map((e) => e.name))).length;
  assert.ok(baselineCases > 0);
  assert.ok(rows.filter((x) => x.arm === "baseline").every((x) => x.cases === baselineCases), "the no-plugin arm runs only no-match, unsupported and negative cases");
});

test("evaluation-suite summary is static and marks provider routing and no-match NOT_RUN", () => {
  const s = routingContextSummary(repo);
  assert.deepEqual(s.cases.errors, []);
  assert.deepEqual(s.providerRouting.map((p) => p.status), ["NOT_RUN", "NOT_RUN", "NOT_RUN"]);
  assert.match(s.noMatch, /^NOT_RUN/);
  assert.equal(s.scenarios.find((x) => x.id === "SC0-production").metadata.chars, production.reduce((n, e) => n + e.name.length + e.description.length, 0));
});
