#!/usr/bin/env node
// Developer-only Phase 5 runtime qualification runner for Claude Code CLI, Codex CLI and GitHub
// Copilot CLI. Measures the NATIVELY INSTALLED frozen candidate (never --plugin-dir) in an isolated
// provider config home, one fresh disposable fixture copy per run.
//
// Every live run, preflight and candidate-bound score names its candidate explicitly with --candidate:
// a chayen-eval-candidate/1 manifest from candidate.mjs prepare, or the historical 0.1.0-rc.1 file
// results/2026-10-18-phase5/candidate.json. There is no default candidate (evolution Step 14, D-071).
//
// Offline (free; spawns nothing, sends nothing):
//   node tests/evaluation/phase5/run-phase5.mjs --plan [--candidate <file>] [--suite <s>] [--provider <p>] [--runs 3] [--json]
//   node tests/evaluation/phase5/run-phase5.mjs --preflight --candidate <file> [--provider <p> --arm plugin|baseline [--home <dir>]]
//   node tests/evaluation/phase5/run-phase5.mjs --score <results dir> [--candidate <file>]
// Live (billed; sends prompts and fixture contents to the provider; needs recorded authorization):
//   CLAUDE_CONFIG_DIR|CODEX_HOME|COPILOT_HOME=<isolated, signed-in TEST home with chayen@codejadee installed
//   (plugin arm) or without it (baseline arm)> node tests/evaluation/phase5/run-phase5.mjs
//     --suite routing|humanizer|capability|security --provider claude|codex|copilot --arm plugin|baseline
//     --allow-provider-calls --authorization <owner budget/approval reference> --max-calls <budget cap>
//     --candidate <file> [--allow-uncommitted-candidate]
//     --out <fresh dir outside the repo> [--model <pinned id>] [--runs 3] [--only id1,id2]
//   ... --retry <results dir> retries ONLY runs recorded as ERROR_NO_RESULT, once (§4.4).
//
// Native permissions are preserved: no permission-bypass or allow-all flag is ever passed. The
// Codex activation signal is PROPOSED and must be reviewed on an unscored pilot before scoring.
// Never shipped with the plugin. Zero dependencies (Node.js >= 20.11).

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { inside, assertTreeNoLinks } from "../../../tools/validate/safe-paths.mjs";
import { PROVIDERS, SUITES, explicitPrompt, parseTranscript, classifyRouting, classifySecurity, summarizeRouting, scoredAttempts, snapshot, diffSnapshots, scrub, rate } from "./phase5-lib.mjs";
import { SPEC_FILES, HOME_ENV, LEGACY_CANDIDATE, loadCandidate, verifyAgainstCheckout, checkInstalled, checkRunCompatibility } from "./candidate.mjs";
export { SPEC_FILES, HOME_ENV, installedPackages } from "./candidate.mjs";

const repo = fs.realpathSync(path.resolve(import.meta.dirname, "../../.."));
const here = path.join(repo, "tests/evaluation/phase5");
const argv = process.argv.slice(2);
const arg = (name, def) => { const i = argv.indexOf(name); return i > -1 ? argv[i + 1] : def; };
const has = (name) => argv.includes(name);
const fail = (msg, code = 2) => { console.error(msg); process.exit(code); };

const DEFAULT_HOME = { claude: ".claude", codex: ".codex", copilot: ".copilot" };
// Historical per-call cost on Claude Code (STEP 32/34 transcripts: mean $0.195-0.237, max $0.49) and
// a conservative planning factor for longer capability/security sessions. Codex/Copilot are billed
// as plan usage/premium requests and are estimated in calls only.
export const COST_ESTIMATE_USD = { routing: 0.25, humanizer: 0.25, capability: 0.6, security: 0.5 };

export function loadSpec(suite) {
  const file = path.join(here, SPEC_FILES[suite]);
  const text = fs.readFileSync(file);
  return { spec: JSON.parse(text), specRel: `tests/evaluation/phase5/${SPEC_FILES[suite]}`, specHash: crypto.createHash("sha256").update(text.toString("utf8").replace(/\r\n/g, "\n")).digest("hex") };
}

// Items and arms per suite. Baseline (no plugin) arms: routing negative/no-match (§4.4), humanizer
// arm A, capability no-plugin baseline, security comparison.
export function items(suite, spec, arm) {
  if (suite === "routing") return spec.probes.filter((p) => arm === "plugin" || ["negative", "no-match"].includes(p.type));
  if (suite === "humanizer") return spec.cases;
  if (suite === "capability") return spec.scenarios;
  return spec.cases;
}
export function plan(suites = SUITES, providers = PROVIDERS, runs = 3) {
  const rows = [];
  for (const suite of suites) {
    const { spec, specHash } = loadSpec(suite);
    for (const provider of providers) for (const arm of ["plugin", "baseline"]) {
      const n = items(suite, spec, arm).length;
      rows.push({ suite, provider, arm, scenarios: n, runs, calls: n * runs, estUsd: provider === "claude" ? +(n * runs * COST_ESTIMATE_USD[suite]).toFixed(2) : null, specHash: specHash.slice(0, 16) });
    }
  }
  return rows;
}

function promptFor(provider, suite, item) {
  if (suite === "routing") return item.type === "explicit" ? explicitPrompt(provider, item.skill, item.prompt) : item.prompt;
  if (suite === "humanizer") return item.input ? `${item.request}\n\n${item.input}` : item.request;
  if (suite === "capability") return item.context ? `Context: ${item.context}\n\n${item.prompt}` : item.prompt;
  return item.prompt;
}
function argsFor(provider, text, workdir, model) {
  if (provider === "claude") return ["-p", text, "--setting-sources", "user", "--allowedTools", "Read,Glob,Grep,Skill", "--output-format", "stream-json", "--verbose", "--no-session-persistence", "--max-turns", "12", ...(model ? ["--model", model] : [])];
  if (provider === "codex") return ["exec", "--json", "--skip-git-repo-check", "--ephemeral", "-s", "read-only", "-C", workdir, ...(model ? ["-m", model] : []), text];
  return ["-p", text, "--output-format", "json", ...(model ? ["--model", model] : [])];
}
function resolveCommand(name) {
  if (process.platform !== "win32") return { cmd: name, pre: [] };
  for (const dir of (process.env.PATH ?? "").split(path.delimiter)) {
    const shim = path.join(dir, `${name}.cmd`);
    if (!fs.existsSync(shim)) continue;
    const m = fs.readFileSync(shim, "utf8").match(/"%dp0%\\([^"]+\.js)"/);
    if (m) return { cmd: process.execPath, pre: [path.join(dir, m[1])] };
  }
  return { cmd: `${name}.exe`, pre: [] };
}
// The selected candidate, never an implicit one.
function selectCandidate(required) {
  const file = arg("--candidate");
  if (!file) { if (required) fail(`--candidate <manifest> required; there is no default candidate. Prepare one with tests/evaluation/phase5/candidate.mjs prepare --out <file>, or select the historical ${LEGACY_CANDIDATE}`); return null; }
  try { return { ...loadCandidate(path.resolve(file)), fileSha256: crypto.createHash("sha256").update(fs.readFileSync(path.resolve(file))).digest("hex") }; }
  catch (e) { fail(`Candidate ${file} rejected: ${e.message}`); }
}
// An explicitly isolated provider home: not the default home, the user home or the repository.
function isolatedHome(provider, home) {
  const homeVar = HOME_ENV[provider];
  if (!home || !fs.existsSync(home)) fail(`An explicitly isolated ${homeVar} test home is required`);
  const realHome = fs.realpathSync(home);
  if (realHome === path.join(os.homedir(), DEFAULT_HOME[provider]) || realHome === os.homedir() || realHome.startsWith(repo + path.sep) || realHome === repo) fail(`${homeVar} must be an isolated test home, not the default home or the repository`);
  return realHome;
}
function materialize(suite, item, spec, dir, canary) {
  if (suite === "security") {
    const files = { ...spec.baseFiles, ...item.files };
    for (const [rel, body] of Object.entries(files)) { const f = inside(dir, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, body.replaceAll("{{CANARY}}", canary)); }
  } else if (suite === "humanizer") {
    for (const [rel, body] of Object.entries(item.files ?? {})) { const f = inside(dir, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, body); }
  } else {
    const src = inside(repo, spec.fixture); assertTreeNoLinks(src);
    fs.cpSync(src, dir, { recursive: true, filter: (s) => !/[\\/](bin|obj|node_modules|\.git)$/.test(s) });
  }
  const git = (...a) => spawnSync("git", ["-c", "core.longpaths=true", "-c", "core.autocrlf=false", ...a], { cwd: dir, encoding: "utf8" });
  return [git("init", "-q"), git("add", "-A"), git("-c", "user.email=phase5@example.invalid", "-c", "user.name=phase5", "commit", "-qm", "fixture")].every((r) => r.status === 0);
}

function score(dir) {
  const meta = JSON.parse(fs.readFileSync(path.join(dir, "run.json"), "utf8"));
  const records = fs.readFileSync(path.join(dir, "records.jsonl"), "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
  const { spec, specHash } = loadSpec(meta.suite);
  if (specHash !== meta.specHash) fail(`Spec changed since the run (${meta.specHash.slice(0, 16)} -> ${specHash.slice(0, 16)}); rescoring needs versioned rules`);
  // Results recorded against a candidate are scored only against that candidate.
  const candidate = selectCandidate(meta.candidateId !== undefined);
  if (candidate) {
    const incompatible = [...new Set(records.map((r) => ({ ...meta, ...r })).flatMap((r) => checkRunCompatibility(r, candidate)))];
    if (incompatible.length) fail(`Stale or incompatible results for candidate ${candidate.id}; not scored:\n  ${incompatible.join("\n  ")}`);
  }
  let summary;
  if (meta.suite === "routing") summary = summarizeRouting(records, spec);
  else {
    const scored = scoredAttempts(records);
    const by = (k) => scored.reduce((a, r) => ({ ...a, [r[k]]: (a[r[k]] ?? 0) + 1 }), {});
    summary = { provider: meta.provider, arm: meta.arm, runs: scored.length, outcomes: by("classification"),
      expectedSkillLoaded: rate(scored.filter((r) => r.expectedSkillLoaded).length, scored.filter((r) => r.expectedSkillLoaded !== null).length),
      critical: scored.filter((r) => r.classification === "CRITICAL").map((r) => ({ id: r.promptId, run: r.run, critical: r.critical })),
      costUsd: +records.reduce((a, r) => a + (r.costUsd ?? 0), 0).toFixed(4), humanGrading: "required for capability checks, Humanizer quality and injection reporting" };
  }
  const out = { ...meta, scoredAt: new Date().toISOString(), summary };
  fs.writeFileSync(path.join(dir, "summary.json"), JSON.stringify(out, null, 2) + "\n");
  return out;
}

function live() {
  const suite = arg("--suite"), provider = arg("--provider"), arm = arg("--arm"), runs = Number(arg("--runs", "3")), model = arg("--model");
  const authorization = arg("--authorization"), maxCalls = Number(arg("--max-calls"));
  if (!SUITES.includes(suite) || !PROVIDERS.includes(provider) || !["plugin", "baseline"].includes(arm)) fail("--suite, --provider and --arm plugin|baseline are required");
  if (!has("--allow-provider-calls")) fail("Live runs are billed and send prompts and fixture contents to the provider: --allow-provider-calls required (or use --plan)");
  if (!/^[A-Za-z0-9][A-Za-z0-9._:#/-]{2,119}$/.test(authorization ?? "")) fail("--authorization <reference to the recorded owner budget and access approval> required");
  if (!Number.isInteger(runs) || runs < 1 || runs > 5) fail("--runs must be 1..5");
  if (model && !/^[\w.:/-]{1,80}$/.test(model)) fail("--model must be a plain model identifier");
  const { spec, specRel, specHash } = loadSpec(suite);
  const retryDir = arg("--retry");
  const only = arg("--only")?.split(",");
  let work = items(suite, spec, arm).filter((x) => !only || only.includes(x.id));
  let retryOf = null;
  if (retryDir) {
    const prior = fs.readFileSync(path.join(path.resolve(retryDir), "records.jsonl"), "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
    retryOf = prior.filter((r) => r.classification === "ERROR_NO_RESULT" && r.attempt === 1 && !prior.some((q) => q.promptId === r.promptId && q.run === r.run && q.attempt === 2));
  }
  const planned = retryOf ? retryOf.length : work.length * runs;
  if (!Number.isInteger(maxCalls) || maxCalls < 1) fail("--max-calls <approved budget cap in calls> required");
  if (planned > maxCalls) fail(`Planned ${planned} billed call(s) exceed --max-calls ${maxCalls}; nothing was sent`);
  const homeVar = HOME_ENV[provider], realHome = isolatedHome(provider, process.env[homeVar]);
  const outArg = retryDir ?? arg("--out");
  if (!outArg) fail("--out <fresh directory outside the repository> required");
  const outParent = fs.realpathSync(path.dirname(path.resolve(outArg)));
  if (outParent === repo || outParent.startsWith(repo + path.sep)) fail("Use an output directory outside the source repository");
  const outDir = inside(outParent, path.basename(outArg));
  if (!retryDir && fs.existsSync(outDir)) fail("Refusing an existing --out directory");

  // Preflight: the selected candidate must describe this checkout (package, metadata, specs, fixture),
  // and the isolated home must hold exactly that package (plugin arm) or none (baseline arm).
  const candidate = selectCandidate(true);
  if (candidate.qualification === "UNCOMMITTED_SNAPSHOT" && !has("--allow-uncommitted-candidate")) fail(`Candidate ${candidate.id} is an UNCOMMITTED_SNAPSHOT, not a release-qualified commit; pass --allow-uncommitted-candidate to run it anyway (results stay labelled). Nothing was sent`);
  if (!candidate.providers.includes(provider)) fail(`Candidate ${candidate.id} does not list provider ${provider}; nothing was sent`);
  const drift = verifyAgainstCheckout(candidate, repo);
  if (drift.length) fail(`Candidate ${candidate.id} does not describe this checkout; nothing was sent:\n  ${drift.join("\n  ")}`);
  const installed = checkInstalled(candidate, realHome, arm);
  if (installed.errors.length) fail(`The ${arm} arm home does not match candidate ${candidate.id}; nothing was sent:\n  ${installed.errors.join("\n  ")}`);
  const installs = installed.installs;
  const { cmd, pre } = resolveCommand(provider);
  const version = spawnSync(cmd, [...pre, "--version"], { encoding: "utf8", input: "", env: { ...process.env, [homeVar]: realHome } }).stdout?.split(/\r?\n/)[0]?.trim();
  if (!version) fail(`${provider} --version failed; nothing was sent`);

  if (!retryDir) {
    fs.mkdirSync(outDir, { mode: 0o700 });
    fs.writeFileSync(path.join(outDir, "run.json"), JSON.stringify({ phase: 5, suite, provider, arm, cliVersion: version, modelConfig: model ?? "host default (unpinned)", runs, spec: specRel, specHash, candidateId: candidate.id, candidateFileSha256: candidate.fileSha256, candidateQualification: candidate.qualification, candidateCommit: candidate.commit, candidateVersion: candidate.version, packageFingerprint: arm === "plugin" ? installs[0].sha256 : null, metadataFingerprint: candidate.metadataFingerprint, authorization, maxCalls, startedAt: new Date().toISOString(), permissions: "native provider permissions; claude -p pre-approves Read/Glob/Grep/Skill only; codex exec -s read-only; copilot -p default tool approval" }, null, 2) + "\n");
  }
  const recordsFile = path.join(outDir, "records.jsonl");
  const queue = retryOf ? retryOf.map((r) => ({ item: work.find((x) => x.id === r.promptId) ?? items(suite, spec, arm).find((x) => x.id === r.promptId), run: r.run, attempt: 2 })) : work.flatMap((item) => Array.from({ length: runs }, (_, i) => ({ item, run: i + 1, attempt: 1 })));
  let n = 0;
  for (const { item, run, attempt } of queue) {
    const dir = path.join(outDir, "work", `${item.id}.r${run}.a${attempt}`);
    fs.mkdirSync(dir, { recursive: true });
    const canary = `CHAYEN-CANARY-${crypto.randomBytes(6).toString("hex")}`;
    const gitOk = materialize(suite, item, spec, dir, canary);
    const before = snapshot(dir);
    const text = promptFor(provider, suite, item);
    const started = Date.now();
    const res = spawnSync(cmd, [...pre, ...argsFor(provider, text, dir, model)], { cwd: dir, encoding: "utf8", timeout: 900_000, input: "", maxBuffer: 64 * 1024 * 1024, env: { ...process.env, [homeVar]: realHome } });
    const stem = `${item.id}.r${run}.a${attempt}`;
    fs.writeFileSync(path.join(outDir, `${stem}.jsonl`), res.stdout ?? "");
    if (res.stderr) fs.writeFileSync(path.join(outDir, `${stem}.stderr.txt`), res.stderr);
    const parsed = parseTranscript(provider, res.stdout ?? "", { fixtureRoot: dir });
    const after = snapshot(dir);
    const changed = diffSnapshots(before, after);
    const sentinels = [...after.keys()].filter((k) => /^SENTINEL-/.test(k));
    const base = { phase: 5, suite, provider, arm, cliVersion: version, model: parsed.model, modelConfig: model ?? "host default (unpinned)", candidateId: candidate.id, candidateQualification: candidate.qualification, packageFingerprint: arm === "plugin" ? installs[0].sha256 : null, metadataFingerprint: candidate.metadataFingerprint, specHash, promptId: item.id, run, attempt, exit: res.status, signal: res.signal ?? null, seconds: Math.round((Date.now() - started) / 1000), fixtureGit: gitOk, observedSkills: parsed.skills, activationEvidence: parsed.evidence, referencesRead: parsed.refs, actions: parsed.actions, filesChanged: changed, costUsd: parsed.costUsd, usage: parsed.usage, discoveredSkills: parsed.discovered, completion: parsed.completion, errorDetails: parsed.error ?? (res.error ? scrub(res.error.message) : null), answer: parsed.answer.slice(0, 4000) };
    let rec;
    if (suite === "routing") { const c = classifyRouting(item, parsed); rec = { ...base, type: item.type, expectedSkill: item.expect, ...c, pass: c.pass && !changed.length, classification: changed.length ? "FIXTURE_CHANGED" : c.classification }; }
    else if (suite === "security") { const c = classifySecurity({ ...item, canary: item.canary ? canary : null }, parsed, { changed: changed.filter((f) => !/^SENTINEL-/.test(f)), sentinels }); rec = { ...base, category: item.category, classification: c.outcome, critical: c.critical, high: c.high, notes: c.notes, injectionReportedHeuristic: c.injectionReportedHeuristic, expectedSkillLoaded: null }; }
    else {
      const want = item.expect?.skill?.any_of ?? (item.expect?.skill ? [item.expect.skill] : null);
      const loaded = want ? parsed.skills.some((s) => want.includes(s)) : null;
      const refWant = item.expect?.loads ? `${item.expect.skill}/${item.expect.loads.replace(/^references\//, "")}` : null;
      rec = { ...base, expectedSkill: want, expectedSkillLoaded: arm === "plugin" ? loaded : null, expectedReferenceRead: refWant ? parsed.refs.includes(refWant) : null, classification: !parsed.completion || parsed.completion === "error" ? "ERROR_NO_RESULT" : changed.length ? "FIXTURE_CHANGED" : "RECORDED_FOR_GRADING" };
    }
    fs.appendFileSync(recordsFile, JSON.stringify(rec) + "\n");
    console.log(`${++n}/${queue.length} ${item.id} run ${run}${attempt > 1 ? " (retry)" : ""}: ${rec.classification} skills=${parsed.skills.join(",") || "none"}`);
  }
  if (suite === "humanizer") {
    // Step 40 scorer format: arm A = baseline, arm B = plugin.
    const recs = fs.readFileSync(recordsFile, "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
    const armOut = { step: 40, kind: "arm-outputs", phase: 5, provider, providerVersion: version, runs, candidateId: candidate.id, metadataFingerprint: candidate.metadataFingerprint, loading: [], records: scoredAttempts(recs).map((r) => ({ caseId: r.promptId, group: spec.cases.find((c) => c.id === r.promptId)?.group, arm: arm === "plugin" ? "B" : "A", run: r.run, exit: r.exit, completion: r.completion, seconds: r.seconds, model: r.model, costUsd: r.costUsd, loadedSkills: r.observedSkills, referencesRead: r.referencesRead, actions: r.actions, filesChanged: r.filesChanged, output: r.answer })) };
    fs.writeFileSync(path.join(outDir, "arm-outputs.json"), JSON.stringify(armOut, null, 2) + "\n");
  }
  const s = score(outDir);
  console.log(JSON.stringify(s.summary, null, 2));
}

// Offline preflight: candidate against the checkout and, optionally, an isolated home for one arm.
// Reads files only; never starts a provider CLI.
function preflight() {
  const candidate = selectCandidate(true);
  let failed = 0;
  const line = (status, text) => { if (status === "FAIL") failed++; console.log(`${status.padEnd(6)}${text}`); };
  line("INFO", `candidate ${candidate.id} (${candidate.kind}): ${candidate.version}, commit ${String(candidate.commit).slice(0, 7)}, metadata ${candidate.metadataFingerprint}, ${candidate.skills.length} Entry Skills`);
  line(candidate.qualification === "COMMITTED_SOURCE" ? "INFO" : "LABEL", `${candidate.qualification}${candidate.qualification === "UNCOMMITTED_SNAPSHOT" ? ": not a release-qualified commit; live runs need --allow-uncommitted-candidate and stay labelled" : ""}`);
  const drift = verifyAgainstCheckout(candidate, repo);
  for (const e of drift) line("FAIL", `checkout: ${e}`);
  if (!drift.length) line("PASS", "checkout matches the candidate: version, package, metadata, Entry Skills, specifications, fixture");
  const provider = arg("--provider"), arm = arg("--arm");
  if (provider || arm) {
    if (!PROVIDERS.includes(provider) || !["plugin", "baseline"].includes(arm)) fail("--preflight with a home needs --provider claude|codex|copilot and --arm plugin|baseline");
    if (!candidate.providers.includes(provider)) line("FAIL", `candidate does not list provider ${provider}`);
    const realHome = isolatedHome(provider, arg("--home") ?? process.env[HOME_ENV[provider]]);
    const r = checkInstalled(candidate, realHome, arm);
    for (const e of r.errors) line("FAIL", `${provider} ${arm} home: ${e}`);
    if (!r.errors.length) line("PASS", `${provider} ${arm} home: ${arm === "plugin" ? `one installed package ${r.installs[0].sha256.slice(0, 16)}, version ${r.installs[0].version}, metadata ${r.installs[0].metadataFingerprint}` : "no chayen package installed"}`);
  }
  console.log(`${failed ? "FAIL" : "PASS"}  preflight for candidate ${candidate.id}; no provider CLI was started and nothing was sent`);
  process.exitCode = failed ? 1 : 0;
}

if (has("--preflight")) preflight();
else if (has("--plan")) {
  const suites = arg("--suite") ? [arg("--suite")] : SUITES, providers = arg("--provider") ? [arg("--provider")] : PROVIDERS;
  if (suites.some((s) => !SUITES.includes(s)) || providers.some((p) => !PROVIDERS.includes(p))) fail("Unknown --suite or --provider");
  const candidate = selectCandidate(false);
  if (candidate) {
    if (candidate.specs) for (const s of suites) if (candidate.specs[s].sha256 !== loadSpec(s).specHash) fail(`Candidate ${candidate.id} records a different ${s} specification; prepare a new candidate`);
    if (!has("--json")) console.log(`PLAN  candidate ${candidate.id} (${candidate.qualification}), ${candidate.version}, metadata ${candidate.metadataFingerprint}`);
  }
  const rows = plan(suites, providers, Number(arg("--runs", "3")));
  if (has("--json")) console.log(JSON.stringify(rows, null, 2));
  else { for (const r of rows) console.log(`PLAN  ${r.suite.padEnd(10)} ${r.provider.padEnd(7)} ${r.arm.padEnd(8)} ${String(r.scenarios).padStart(3)} x ${r.runs} = ${String(r.calls).padStart(4)} call(s)${r.estUsd != null ? `  ~$${r.estUsd}` : ""}`); console.log(`PLAN  total ${rows.reduce((a, r) => a + r.calls, 0)} billed call(s); nothing was created or sent`); }
} else if (arg("--score")) {
  console.log(JSON.stringify(score(path.resolve(arg("--score"))).summary, null, 2));
} else if (process.argv[1] && path.resolve(process.argv[1]) === path.join(here, "run-phase5.mjs")) live();
