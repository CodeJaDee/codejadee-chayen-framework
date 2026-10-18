#!/usr/bin/env node
// Developer-only STEP 32 evaluation suite. Offline and read-only by default: it runs the existing
// static gates as child processes, checks evaluation traceability for all 15 categories, the 206
// engineering, 108 technology and 12 workflow records, measures context overhead, computes a
// clearly labelled SIMULATED lexical routing proxy, and summarizes recorded provider results.
// It never calls a provider or model. Zero dependencies. Never shipped with the plugin.
//
// Usage:
//   node tools/evals/run-evaluation-suite.mjs [--write]
//        [--probes <summary.json> ...] [--facts <dir with run-fact-checks JSON>]
// --write stores tests/evaluation/results/step32-evaluation.json (path-free).

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { parseYamlSubset } from "../catalog/catalog-lib.mjs";
import { inside } from "../validate/safe-paths.mjs";
import { L0_BUDGET, loadEditorialRegistration } from "../catalog/skill-registration.mjs";

const root = path.resolve(import.meta.dirname, "..", "..");
const rel = (p) => inside(root, p);
const readJson = (p) => JSON.parse(fs.readFileSync(rel(p), "utf8"));
const argList = (name) => process.argv.flatMap((a, i) => (process.argv[i - 1] === name ? [a] : []));
const plugin = "plugins/codejadee-chayen-framework";
const report = { step: 32, kind: "evaluation-suite", levels: {}, categories: [], metrics: {}, failures: [] };
const fail = (where, msg) => report.failures.push(`${where}: ${msg}`);

// ---------- Level 1: static validation (child processes of existing offline tools) ----------
const staticChecks = [
  { id: "S-ALL", cmd: ["tools/validate/validate-all.mjs"], cats: [1, 2, 3, 4, 11, 12], match: /All automated gates passed/ },
  { id: "S-IDENTITY", cmd: ["tests/provider-compatibility/check-identity.mjs"], cats: [1, 10, 15], json: true },
  { id: "S-AUDIT206", cmd: ["tools/catalog/audit-coverage.mjs"], cats: [3], match: /206\/206|PASS/ },
  { id: "S-EVALSYNC", cmd: ["tools/evals/generate-claude-evals.mjs", "--check"], cats: [5, 6, 7], match: /up to date/ },
];
if (process.argv.includes("--fail-fast")) staticChecks[0].cmd.push("--fail-fast");
report.levels.static = [];
for (const c of staticChecks) {
  const r = spawnSync(process.execPath, c.cmd.map((x, i) => (i === 0 ? rel(x) : x)), { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const out = `${r.stdout ?? ""}${r.stderr ?? ""}`;
  let pass = r.status === 0 && (!c.match || c.match.test(out)), detail;
  if (c.json) { try { const j = JSON.parse(r.stdout); detail = `${j.checks.filter((x) => x.result === "PASS").length}/${j.checks.length} PASS`; } catch { pass = false; detail = "unparseable"; } }
  else detail = out.trim().split(/\r?\n/).filter(Boolean).slice(-1)[0]?.slice(0, 200);
  report.levels.static.push({ id: c.id, command: `node ${c.cmd.join(" ")}`, categories: c.cats, exit: r.status, result: pass ? "PASS" : "FAIL", detail });
  if (!pass) {
    fail(c.id, detail);
    console.error(out.trim());
    if (process.argv.includes("--fail-fast")) {
      console.error(`FAIL ${c.id}: stopping static evaluation; remaining checks NOT_RUN`);
      process.exit(1);
    }
  }
}

// ---------- Traceability ----------
const catalog = parseYamlSubset(fs.readFileSync(rel("catalog/engineering-capabilities.yaml"), "utf8"));
const tech = parseYamlSubset(fs.readFileSync(rel("catalog/technology-capabilities.yaml"), "utf8"));
const workflows = readJson("catalog/composite-workflows.json");
const recipeCases = readJson("tests/skills/recipe-cases.json").cases;
const techCases = readJson("tests/skills/technology-cases.json").cases;
const wfCases = readJson("tests/skills/workflow-cases.json").cases;
const trigger = readJson("tests/skills/trigger-cases.json");
const probes = readJson("tests/evaluation/provider-probes.json").probes;

function polarity(cases, key, ids) {
  const by = Object.fromEntries(ids.map((id) => [id, { positive: [], negative: [] }]));
  for (const c of cases) for (const id of [].concat(c[key] ?? [])) if (by[id] && by[id][c.polarity]) by[id][c.polarity].push(c.id);
  const missing = ids.filter((id) => !by[id].positive.length || !by[id].negative.length);
  return { by, missing };
}
const caps = catalog.capabilities;
const capT = polarity(recipeCases, "capability", caps.map((c) => c.id));
const capTriggers = caps.filter((c) => !(c.positive_triggers?.length && c.negative_triggers?.length)).map((c) => c.id);
const techIds = tech.capabilities.map((c) => c.name); // technology cases reference the capability name
const techT = polarity(techCases, "capability", techIds);
const wfIds = (workflows.workflows ?? []).map((w) => w.id);
const wfT = polarity(wfCases, "workflow", wfIds);
if (caps.length !== 206) fail("T-206", `catalog has ${caps.length} capabilities`);
if (capT.missing.length) fail("T-206", `missing positive or negative recipe case: ${capT.missing.join(", ")}`);
if (capTriggers.length) fail("T-206", `missing catalog positive/negative triggers: ${capTriggers.join(", ")}`);
if (techT.missing.length) fail("T-TECH", `missing positive or negative technology case: ${techT.missing.join(", ")}`);
if (wfT.missing.length) fail("T-WF", `missing positive or negative workflow case: ${wfT.missing.join(", ")}`);
report.traceability = {
  engineering: { records: caps.length, withPositiveAndNegativeCases: caps.length - capT.missing.length, withCatalogTriggers: caps.length - capTriggers.length, recipeCases: recipeCases.length, matrix: Object.fromEntries(caps.map((c) => [c.id, { skill: c.entry_skill?.name ?? c.entry_skill, ...capT.by[c.id] }])) },
  technology: { records: techIds.length, withPositiveAndNegativeCases: techIds.length - techT.missing.length, cases: techCases.length },
  workflows: { records: wfIds.length, withPositiveAndNegativeCases: wfIds.length - wfT.missing.length, cases: wfCases.length },
  triggers: { cases: trigger.cases.length, byCategory: trigger.cases.reduce((a, c) => ({ ...a, [c.category]: (a[c.category] ?? 0) + 1 }), {}) },
};

// Requested routing examples -> trigger case and actual-provider probe
const routingExamples = [
  ["ASP.NET Core bug", "pos-backend-aspnet-bug", "pr-aspnet-bug"], ["Angular form", "pos-frontend-angular-form", "pr-angular-form"],
  ["PostgreSQL optimization", "pos-data-postgres-explain", "pr-postgres-optimization"], ["SQL Server query", "pos-data-query-plan", "pr-sqlserver-query"],
  ["Next.js server route", "pos-backend-next-authorization", "pr-nextjs-route"], ["Python pytest task", "pos-testing-pytest", "pr-pytest"],
  ["Unsupported Rust-specific task", "uns-rust-axum-handler", "pr-rust-unsupported"], ["General conversation", "neg-weather", "pr-general-conversation"],
  ["Explicit decline", "neg-explicit-decline", "pr-explicit-decline"], ["Ambiguous monorepo task", "amb-monorepo-order-total", "pr-monorepo-ambiguous"],
  ["Destructive operation", "amb-destructive-production-drop", "pr-destructive"],
];
report.routingExamples = routingExamples.map(([example, t, p]) => {
  const ok = { trigger: trigger.cases.some((c) => c.id === t), probe: probes.some((x) => x.id === p) };
  if (!ok.trigger || !ok.probe) fail("T-ROUTING", `${example}: trigger ${t} ${ok.trigger} / probe ${p} ${ok.probe}`);
  return { example, triggerCase: t, providerProbe: p, ...ok };
});

// ---------- Category 14: portable cross-skill handoff (static) ----------
const skillDirs = fs.readdirSync(rel(`${plugin}/skills`)).filter((d) => fs.existsSync(rel(`${plugin}/skills/${d}/SKILL.md`)));
const mdFiles = []; (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (p.endsWith(".md")) mdFiles.push(p); } })(rel(`${plugin}/skills`));
const dangling = new Set(), providerSyntax = [];
for (const f of mdFiles) {
  const t = fs.readFileSync(f, "utf8");
  for (const m of t.matchAll(/\bchayen-[a-z-]*[a-z]\b/g)) if (!skillDirs.includes(m[0])) dangling.add(`${path.relative(root, f).replace(/\\/g, "/")}: ${m[0]}`);
  if (/\/(?:codejadee-chayen-framework|chayen):|\$chayen-|\bSkill tool\b/.test(t)) providerSyntax.push(path.relative(root, f).replace(/\\/g, "/"));
}
report.handoff = { markdownFiles: mdFiles.length, danglingSkillNames: [...dangling], providerSpecificInvocationSyntax: providerSyntax, result: !dangling.size && !providerSyntax.length ? "PASS" : "FAIL" };
if (report.handoff.result === "FAIL") fail("S-HANDOFF", `${dangling.size} dangling names, ${providerSyntax.length} files with provider-specific invocation syntax`);

// ---------- Context overhead (static measurement; tokens estimated as chars/4) ----------
const skills = skillDirs.map((d) => {
  const text = fs.readFileSync(rel(`${plugin}/skills/${d}/SKILL.md`), "utf8");
  const fm = text.split(/\r?\n---\r?\n/)[0];
  const desc = (/^description:\s*(.*)$/m.exec(fm)?.[1] ?? "").replace(/^["']|["']$/g, "");
  const refDir = rel(`${plugin}/skills/${d}`);
  const refs = mdFiles.filter((f) => f.startsWith(path.join(refDir, "references") + path.sep)).map((f) => fs.statSync(f).size);
  return { skill: d, description: desc, l0Chars: d.length + desc.length, bodyLines: text.split(/\r?\n/).length, bodyChars: text.length, references: refs.length, refAvgChars: Math.round(refs.reduce((a, b) => a + b, 0) / (refs.length || 1)), refMaxChars: Math.max(0, ...refs) };
});
const est = (chars) => Math.round(chars / 4);
report.metrics.contextOverhead = {
  estimator: "tokens ~= characters / 4 (estimate, not a provider tokenizer)",
  alwaysOnL0: { chars: skills.reduce((a, s) => a + s.l0Chars, 0), estTokens: est(skills.reduce((a, s) => a + s.l0Chars, 0)), cap: L0_BUDGET },
  perActivation: skills.map((s) => ({ skill: s.skill, bodyLines: s.bodyLines, bodyEstTokens: est(s.bodyChars), references: s.references, worstCaseBodyPlusLargestRefEstTokens: est(s.bodyChars + s.refMaxChars) })),
};

// ---------- Level 2: SIMULATED lexical routing proxy (not a model) ----------
const editorialRegistration = loadEditorialRegistration(root, catalog);
report.metrics.contextOverhead.projectedRegisteredL0 = {
  chars: report.metrics.contextOverhead.alwaysOnL0.chars + [...editorialRegistration.skills.values()].filter(s => s.mapping === "planned").reduce((n, s) => n + s.name.length + s.description.length, 0),
  cap: L0_BUDGET,
  note: "Includes planned editorial metadata only; no editorial bodies shipped or provider behavior measured.",
};
if (editorialRegistration.errors.length) fail("S-REGISTRATION", "editorial registration invalid");
const STOP = new Set("a an and are as at be by can do does for from has have how i in into is it its me my of on or our should so that the their them then this to use we what when where which why will with without you your not only all any".split(" "));
const tok = (s) => s.toLowerCase().replace(/[^a-z0-9.#+]+/g, " ").split(" ").filter((w) => w.length > 1 && !STOP.has(w));
const docs = skills.map((s) => ({ skill: s.skill, terms: tok(`${s.skill.replace("chayen-", "")} ${s.description}`) }));
const df = {}; for (const d of docs) for (const t of new Set(d.terms)) df[t] = (df[t] ?? 0) + 1;
const avgLen = docs.reduce((a, d) => a + d.terms.length, 0) / docs.length;
const bm25 = (q, d) => { let s = 0; const tf = {}; for (const t of d.terms) tf[t] = (tf[t] ?? 0) + 1; for (const t of new Set(tok(q))) { if (!tf[t]) continue; const idf = Math.log(1 + (docs.length - df[t] + 0.5) / (df[t] + 0.5)); s += idf * (tf[t] * 2.2) / (tf[t] + 1.2 * (0.25 + 0.75 * d.terms.length / avgLen)); } return s; };
const rank = (q) => docs.map((d) => ({ skill: d.skill, score: bm25(q, d) })).sort((a, b) => b.score - a.score);
const pos = trigger.cases.filter((c) => c.category === "positive");
const posTop = pos.map((c) => rank(c.prompt)[0].score).sort((a, b) => a - b);
const tau = 0.5 * posTop[Math.floor(posTop.length / 2)]; // fixed rule, not tuned for F1
let tp = 0, fp = 0, fnPos = 0, top3 = 0, noMatchOk = 0, noMatchN = 0, ambOk = 0, ambN = 0; const misses = [];
for (const c of trigger.cases) {
  const r = rank(c.prompt), pick = r[0].score >= tau ? r[0].skill : null;
  if (c.category === "positive") {
    if (r.slice(0, 3).some((x) => x.skill === c.expect.any_of[0])) top3++;
    if (pick === c.expect.any_of[0]) tp++; else { fnPos++; if (pick) fp++; misses.push({ id: c.id, expected: c.expect.any_of[0], proxyPick: pick ?? "none" }); }
  } else if (c.expect.none) { noMatchN++; if (!pick) noMatchOk++; else fp++; }
  else if (c.expect.none_or) { noMatchN++; if (!pick || c.expect.none_or.includes(pick)) noMatchOk++; else fp++; }
  else { ambN++; if (pick && c.expect.any_of.includes(pick)) ambOk++; }
}
report.levels.simulated = {
  label: "SIMULATED lexical proxy: BM25 of each prompt against skill name + description (the metadata providers see before activation). It is not a model, not a provider, and can never support VERIFIED.",
  threshold: { rule: "0.5 x median top score of positive prompts", value: Number(tau.toFixed(3)) },
  positives: pos.length, top1Recall: +(tp / pos.length).toFixed(3), top3Recall: +(top3 / pos.length).toFixed(3),
  precision: +(tp / (tp + fp || 1)).toFixed(3), noMatchCorrectness: +(noMatchOk / (noMatchN || 1)).toFixed(3), noMatchCases: noMatchN,
  falsePositiveRateOnNoMatch: +((noMatchN - noMatchOk) / (noMatchN || 1)).toFixed(3), ambiguousAcceptable: `${ambOk}/${ambN}`,
  lowestSeparabilityPositives: misses.slice(0, 40),
};

// ---------- Level 3: actual provider invocation (recorded results only) ----------
function probeMetrics(summary) {
  const rs = summary.results, byId = Object.fromEntries(probes.map((p) => [p.id, p]));
  const posR = rs.filter((r) => byId[r.id]?.expect.any_of), noR = rs.filter((r) => byId[r.id]?.expect.none || byId[r.id]?.expect.none_or);
  const invoked = posR.flatMap((r) => r.loadedSkills);
  const correctInv = posR.flatMap((r) => r.loadedSkills.filter((s) => byId[r.id].expect.any_of.includes(s)));
  const refR = rs.filter((r) => r.reference);
  return {
    provider: summary.provider, version: summary.providerVersion, runs: rs.length, fixtureUnchanged: summary.fixtureUnchanged,
    routingPass: `${rs.filter((r) => r.route.pass).length}/${rs.length}`,
    relevantSkillRecall: `${posR.filter((r) => r.loadedSkills.some((s) => byId[r.id].expect.any_of.includes(s))).length}/${posR.length}`,
    selectionPrecision: invoked.length ? `${correctInv.length}/${invoked.length}` : "n/a (no skill invoked)",
    falsePositiveInvocation: `${noR.filter((r) => !r.route.pass).length}/${noR.length}`,
    referenceLoad: `${refR.filter((r) => r.reference.pass).length}/${refR.length}`,
    discoveredSkills: [...new Set(rs.map((r) => r.discoveredSkills).filter((x) => x != null))],
    costUsd: +rs.reduce((a, r) => a + (r.costUsd ?? 0), 0).toFixed(4),
    perProbe: rs.map((r) => ({ id: r.id, run: r.run, loaded: r.loadedSkills, refs: r.referencesRead, route: r.route, reference: r.reference, denied: r.deniedTools })),
  };
}
const probeSummaries = argList("--probes").map((f) => JSON.parse(fs.readFileSync(path.resolve(f), "utf8")));
report.levels.provider = probeSummaries.map(probeMetrics);
// Pooled per-probe rates across every supplied summary (descriptions must be identical across them).
if (probeSummaries.length) {
  const all = probeSummaries.flatMap((s) => s.results.map((r) => ({ ...r, provider: s.provider })));
  const ids = [...new Set(all.map((r) => r.id))];
  const pooled = ids.map((id) => { const rs = all.filter((r) => r.id === id); const refs = rs.filter((r) => r.reference); return { id, runs: rs.length, routingPass: rs.filter((r) => r.route.pass).length, referencePass: refs.length ? refs.filter((r) => r.reference.pass).length : null, referenceRuns: refs.length, skillsSeen: [...new Set(rs.flatMap((r) => r.loadedSkills))] }; });
  const byId = Object.fromEntries(probes.map((p) => [p.id, p]));
  const sum = (f) => pooled.filter(f).reduce((a, p) => [a[0] + p.routingPass, a[1] + p.runs], [0, 0]);
  const [posHit, posN] = sum((p) => byId[p.id]?.expect.any_of);
  const [noHit, noN] = sum((p) => byId[p.id]?.expect.none || byId[p.id]?.expect.none_or);
  const refRuns = pooled.reduce((a, p) => [a[0] + (p.referencePass ?? 0), a[1] + p.referenceRuns], [0, 0]);
  report.levels.providerPooled = { summaries: probeSummaries.length, runs: all.length, positiveRoutingPassRate: `${posHit}/${posN}`, noMatchCorrectness: `${noHit}/${noN}`, referenceLoadRate: `${refRuns[0]}/${refRuns[1]}`, perProbe: pooled };
}
const hist = readJson("tests/routing/results/2026-10-14-claude-code-eval.json");
const run1 = hist.rows.filter((r) => r.run.startsWith("run1"));
report.levels.historicalProvider = {
  label: "Step 06 actual provider results for the superseded 6-skill package (2026-10-14); historical, not evidence for the current package.",
  claudeEvalRun1: `${run1.filter((r) => r.pass).length}/${run1.length} cases passed`,
  codexSmoke: "7/7 (tests/routing/results/2026-10-14-codex-cli-smoke.json)", copilotSmoke: "5/7 (Unity, SwiftUI over-activation)",
};

// ---------- Level 1b: framework facts (recorded run-fact-checks JSON) ----------
const factsDir = argList("--facts")[0];
if (factsDir) {
  // Runners with --json write {rows:[{status}]}; the JavaScript runners print {"counts":...} as the last log line.
  const suites = new Map();
  for (const f of fs.readdirSync(factsDir)) {
    const suite = f.replace(/\.(json|log)$/, "");
    if (f.endsWith(".json")) { const j = JSON.parse(fs.readFileSync(path.join(factsDir, f), "utf8")); suites.set(suite, j.counts ?? (j.rows ?? []).reduce((a, r) => ({ ...a, [r.status]: (a[r.status] ?? 0) + 1 }), {})); }
    else if (f.endsWith(".log") && !suites.has(suite)) { const last = fs.readFileSync(path.join(factsDir, f), "utf8").trim().split(/\r?\n/).pop(); try { const j = JSON.parse(last); if (j.counts) suites.set(suite, j.counts); } catch { /* summary line absent: counted only from JSON */ } }
  }
  report.levels.facts = [...suites].map(([suite, counts]) => ({ suite, counts }));
  const tot = report.levels.facts.reduce((a, s) => { for (const [k, v] of Object.entries(s.counts)) a[k] = (a[k] ?? 0) + v; return a; }, {});
  console.log(`FACT  ${report.levels.facts.length} suites: ${Object.entries(tot).map(([k, v]) => `${k} ${v}`).join(", ")}`);
}

// ---------- Category registry ----------
const cats = [
  [1, "Plugin schema and packaging", "S-ALL (V-01..V-04, V-09), S-IDENTITY, claude plugin validate --strict", "-", "lifecycle runbook R-3/R-5/R-7", "VS Code R-4/R-8"],
  [2, "Skill structure and reference integrity", "S-ALL (V-05..V-08, V-12, V-17..V-22)", "-", "pr-explicit-reference, ref checks on 5 probes", "-"],
  [3, "206 engineering capability coverage", "S-ALL (V-11), S-AUDIT206, traceability T-206", "-", "recipe-cases.json (445) need a recipe runner (G-12)", "-"],
  [4, "Technology pack coverage", "S-ALL (V-23), traceability T-TECH, framework fact runners", "-", "pr-angular-form, pr-postgres-optimization, pr-sqlserver-query, pr-nextjs-route, pr-pytest", "-"],
  [5, "Automatic skill discovery", "S-EVALSYNC (186 trigger cases)", "lexical proxy top-1/top-3", "positive probes", "-"],
  [6, "Negative/no-match behavior", "S-EVALSYNC", "lexical proxy no-match", "pr-rust-unsupported, pr-general-conversation, pr-explicit-decline", "-"],
  [7, "Ambiguous skill selection", "S-EVALSYNC (23 ambiguous)", "lexical proxy ambiguous", "pr-monorepo-ambiguous", "-"],
  [8, "Multi-stack repository behavior", "fixture monorepo, workflow-cases contexts", "-", "all probes run in the 6-stack fixture", "-"],
  [9, "Version compatibility", "S-ALL (V-23 version contexts), framework facts", "-", "pr-postgres-optimization (version from repo)", "-"],
  [10, "Provider-specific behavior", "S-IDENTITY, FINAL_PROVIDER_COMPATIBILITY", "-", "explicit probes per provider", "VS Code procedures"],
  [11, "Security and prompt injection resistance", "S-ALL (V-25, 32 boundary tests)", "-", "pr-destructive, pr-nextjs-route", "transcript review"],
  [12, "Workflow composition", "S-ALL (V-24), traceability T-WF", "-", "workflow-cases.json (47) need an agent runner", "-"],
  [13, "Verification and evidence correctness", "S-ALL (V-17 Verification sections; V-10 wording)", "-", "behavior checks in probes", "manual transcript grading"],
  [14, "Cross-provider handoff", "S-HANDOFF (plain-name handoff, no provider syntax)", "-", "same probes on two providers", "-"],
  [15, "Plugin distribution and installation", "S-IDENTITY, claude plugin validate", "-", "run-lifecycle.sh (opt-in)", "VS Code install"],
];
report.categories = cats.map(([n, name, st, sim, prov, man]) => ({ n, name, static: st, simulated: sim, provider: prov, manual: man }));
report.result = report.failures.length ? "FAIL" : "PASS";

for (const s of report.levels.static) console.log(`${s.result}  ${s.id}  ${s.detail ?? ""}`);
console.log(`${capT.missing.length || capTriggers.length ? "FAIL" : "PASS"}  T-206 engineering: ${report.traceability.engineering.withPositiveAndNegativeCases}/206 with positive+negative recipe cases; ${report.traceability.engineering.withCatalogTriggers}/206 with catalog triggers`);
console.log(`${techT.missing.length ? "FAIL" : "PASS"}  T-TECH technology: ${report.traceability.technology.withPositiveAndNegativeCases}/${techIds.length}`);
console.log(`${wfT.missing.length ? "FAIL" : "PASS"}  T-WF workflows: ${report.traceability.workflows.withPositiveAndNegativeCases}/${wfIds.length}`);
console.log(`${report.routingExamples.every((r) => r.trigger && r.probe) ? "PASS" : "FAIL"}  T-ROUTING ${report.routingExamples.filter((r) => r.trigger && r.probe).length}/11 requested examples have a trigger case and a provider probe`);
console.log(`${report.handoff.result}  S-HANDOFF ${mdFiles.length} files; dangling ${dangling.size}; provider syntax ${providerSyntax.length}`);
const sim = report.levels.simulated;
console.log(`SIM   lexical proxy: top1 ${sim.top1Recall}, top3 ${sim.top3Recall}, precision ${sim.precision}, no-match ${sim.noMatchCorrectness}, ambiguous ${sim.ambiguousAcceptable}`);
console.log(`INFO  L0 metadata ${report.metrics.contextOverhead.alwaysOnL0.chars}/${report.metrics.contextOverhead.alwaysOnL0.cap} chars (~${report.metrics.contextOverhead.alwaysOnL0.estTokens} tokens)`);
console.log(`INFO  Projected registered L0 ${report.metrics.contextOverhead.projectedRegisteredL0.chars}/${report.metrics.contextOverhead.projectedRegisteredL0.cap} chars (includes planned editorial metadata)`);
for (const p of report.levels.provider) console.log(`PROV  ${p.provider} ${p.version}: routing ${p.routingPass}, recall ${p.relevantSkillRecall}, precision ${p.selectionPrecision}, false-positive ${p.falsePositiveInvocation}, references ${p.referenceLoad}, $${p.costUsd}`);
const pp = report.levels.providerPooled;
if (pp) console.log(`POOL  ${pp.runs} runs from ${pp.summaries} summaries: positive routing ${pp.positiveRoutingPassRate}, no-match ${pp.noMatchCorrectness}, references ${pp.referenceLoadRate}`);
if (process.argv.includes("--write")) {
  const dir = rel("tests/evaluation/results");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "step32-evaluation.json"), JSON.stringify(report, null, 2) + "\n");
  console.log("Wrote tests/evaluation/results/step32-evaluation.json");
}
console.log(report.failures.length ? `\n${report.failures.length} failure(s):\n${report.failures.join("\n")}` : "\nEvaluation suite static/traceability levels PASS");
process.exit(report.failures.length ? 1 : 0);
