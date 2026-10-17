#!/usr/bin/env node
// Developer-only STEP 32 actual-provider routing probes. Loads the plugin from its directory
// (--plugin-dir; no marketplace install, no provider config change), runs each probe in
// tests/evaluation/provider-probes.json against a fresh copy of tests/evaluation/fixture, and
// records which chayen-* skills and references were loaded.
//
// Usage:
//   node tests/evaluation/run-provider-probes.mjs --allow-provider-calls --provider claude|copilot
//        --out <fresh results dir outside the repo> [--only id1,id2] [--runs N] [--spec <file>]
//   node tests/evaluation/run-provider-probes.mjs --rescore <existing results dir>
//        (offline: re-parses recorded transcripts with the current rules; no provider call)
// --spec selects another probe file under tests/evaluation/ (default provider-probes.json), for
// example the Step 40 editorial set tests/evaluation/step40/discovery-probes.json.
//
// Every live probe is a billed model call that sends the prompt and fixture contents to the
// provider. Copilot additionally requires an explicitly isolated COPILOT_HOME. Codex is not
// supported: its plugins load only after `codex plugin add` into CODEX_HOME (see
// tests/provider-compatibility/). Raw transcripts stay in the results dir; summaries keep no
// local paths. Never shipped. Zero dependencies.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { inside, safeId, assertTreeNoLinks } from "../../tools/validate/safe-paths.mjs";

const arg = (name, def) => { const i = process.argv.indexOf(name); return i > -1 ? process.argv[i + 1] : def; };
const repo = fs.realpathSync(path.join(import.meta.dirname, "../.."));
const rescoreArg = arg("--rescore");
const prior = rescoreArg ? JSON.parse(fs.readFileSync(path.join(path.resolve(rescoreArg), "summary.json"), "utf8")) : null;
const specRel = prior?.spec ?? arg("--spec", "tests/evaluation/provider-probes.json");
if (!/^tests\/evaluation\/[a-z0-9][a-z0-9/-]*\.json$/.test(specRel)) { console.error("--spec must be a repository-relative JSON file under tests/evaluation/"); process.exit(2); }
const spec = JSON.parse(fs.readFileSync(inside(repo, specRel), "utf8"));
const provider = prior?.provider ?? arg("--provider");
const runs = prior?.runs ?? Number(arg("--runs", "1"));
const only = arg("--only")?.split(",");
if (!["claude", "copilot"].includes(provider)) { console.error("--provider claude|copilot required (codex needs an installed plugin; see tests/provider-compatibility/README.md)"); process.exit(2); }
if (!prior && !process.argv.includes("--allow-provider-calls")) { console.error("Provider calls send prompts and fixture contents externally; explicit authorization and --allow-provider-calls required"); process.exit(2); }
if (!Number.isInteger(runs) || runs < 1 || runs > 5) { console.error("--runs must be 1..5"); process.exit(2); }
const recorded = prior ? new Set(prior.results.map((x) => x.id)) : null;
const probes = spec.probes.filter((p) => (!only || only.includes(p.id)) && (!recorded || recorded.has(p.id)));
if (!probes.length) { console.error("No matching probes"); process.exit(2); }
for (const p of probes) { safeId(p.id); if (p.skill) safeId(p.skill); }

let outDir, workdir, before, gitSetup, treeHash;
if (prior) outDir = path.resolve(rescoreArg);
else {
  const outArg = arg("--out");
  if (!outArg) { console.error("--out <fresh directory> required"); process.exit(2); }
  const outParent = fs.realpathSync(path.dirname(path.resolve(outArg)));
  if (outParent === repo || outParent.startsWith(repo + path.sep)) { console.error("Use an output directory outside the source repository"); process.exit(2); }
  outDir = inside(outParent, path.basename(outArg));
  if (fs.existsSync(outDir)) { console.error("Refusing an existing --out directory"); process.exit(2); }
  if (provider === "copilot" && (!process.env.COPILOT_HOME || !fs.existsSync(process.env.COPILOT_HOME))) { console.error("An explicitly isolated COPILOT_HOME is required"); process.exit(2); }
  const fixtureSrc = inside(repo, spec.fixture);
  assertTreeNoLinks(fixtureSrc);
  assertTreeNoLinks(inside(repo, "plugins/codejadee-chayen-framework"));
  fs.mkdirSync(outDir, { mode: 0o700 });
  workdir = path.join(outDir, "fixture");
  // IDE tooling may restore the fixture project in place; never copy generated output.
  fs.cpSync(fixtureSrc, workdir, { recursive: true, filter: (src) => !/[\\/](bin|obj|node_modules|\.git)$/.test(src) });
  const git = (...a) => spawnSync("git", ["-c", "core.longpaths=true", ...a], { cwd: workdir, encoding: "utf8" });
  gitSetup = [git("init", "-q"), git("-c", "core.autocrlf=false", "add", "-A"), git("-c", "user.email=probe@example.invalid", "-c", "user.name=probe", "commit", "-qm", "fixture")].every((r) => r.status === 0);
  if (!gitSetup) console.error("warning: fixture git setup failed; tree-hash comparison still applies");
  treeHash = () => { const h = crypto.createHash("sha256"); const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) { if (e.name === ".git") continue; const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else h.update(path.relative(workdir, p) + "\0" + fs.readFileSync(p).toString("base64") + "\0"); } }; walk(workdir); return h.digest("hex").slice(0, 16); };
  before = treeHash();
}
const pluginDir = inside(repo, "plugins/codejadee-chayen-framework");
// Routing runs may be pooled only when every skill description is identical (see tests/evaluation/README.md).
const metadataFingerprint = prior ? prior.metadataFingerprint : (() => { const h = crypto.createHash("sha256"), d = path.join(pluginDir, "skills"); for (const n of fs.readdirSync(d).sort()) { const f = path.join(d, n, "SKILL.md"); if (fs.existsSync(f)) h.update(`${n}\0${/^description:\s*(.*)$/m.exec(fs.readFileSync(f, "utf8"))?.[1] ?? ""}\0`); } return h.digest("hex").slice(0, 16); })();

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
const { cmd, pre } = resolveCommand(provider);

function argsFor(p) {
  if (provider === "claude") {
    const prompt = p.mode === "explicit" ? `/codejadee-chayen-framework:${p.skill} ${p.prompt}` : p.prompt;
    return ["-p", prompt, "--plugin-dir", pluginDir, "--setting-sources", "project", "--allowedTools", "Read,Glob,Grep,Skill",
      "--output-format", "stream-json", "--verbose", "--no-session-persistence", "--max-turns", "10"];
  }
  const prompt = p.mode === "explicit" ? `/${p.skill} ${p.prompt}` : p.prompt;
  return ["-p", prompt, "--plugin-dir", pluginDir, "--output-format", "json", "--deny-tool", "shell", "--deny-tool", "write"];
}

// Summaries are committed: replace local absolute paths in free text with placeholders.
const scrub = (text) => String(text)
  .replace(/[A-Za-z]:(?:\\\\|\\|\/)[^\s"'`)]*/g, "<ABS-PATH>") // Windows absolute paths in any slash form
  .replace(/(?:^|(?<=[\s"'`(]))\/(?:Users|home|tmp|var)\/[^\s"'`)]*/g, "<ABS-PATH>"); // POSIX home/temp paths
const refRe = /skills[\\/]+(chayen-[a-z-]+)[\\/]+references[\\/]+([\w./\\-]+\.md)/i;
const EXPLORE = new Set(["Read", "Glob", "Grep", "Bash", "Agent", "view", "glob", "grep", "rg", "list_directory"]);
function parse(stdout) {
  const r = { skills: [], refs: [], tools: [], denied: [], costUsd: null, model: null, discovered: null, answer: "", completion: null };
  for (const line of stdout.split(/\r?\n/)) {
    if (!line.trim().startsWith("{")) continue;
    let e; try { e = JSON.parse(line); } catch { continue; }
    if (provider === "claude") {
      if (e.type === "system" && e.subtype === "init") { r.model = e.model; r.discovered = (e.skills ?? []).filter((s) => /chayen-/.test(s)).length; }
      if (e.type === "assistant") for (const c of e.message?.content ?? []) {
        if (c.type !== "tool_use") continue;
        r.tools.push(c.name);
        if (c.name === "Skill") r.skills.push(String(c.input?.skill ?? "").replace(/^[\w-]+:/, ""));
        const m = refRe.exec(String(c.input?.file_path ?? c.input?.path ?? "")); if (m) r.refs.push(`${m[1]}/${m[2].replace(/\\/g, "/")}`);
      }
      if (e.type === "result") { r.costUsd = e.total_cost_usd; r.denied = (e.permission_denials ?? []).map((d) => d.tool_name); r.answer = String(e.result ?? ""); r.completion = e.subtype ?? (e.is_error ? "error" : "success"); }
    } else {
      if (e.type === "tool.execution_start") {
        const name = e.data?.toolName; r.tools.push(name);
        if (name === "skill" && e.data.arguments?.skill) r.skills.push(String(e.data.arguments.skill).replace(/^[\w-]+:/, ""));
        const m = refRe.exec(JSON.stringify(e.data?.arguments ?? {}).replace(/\\\\/g, "/")); if (m) r.refs.push(`${m[1]}/${m[2].replace(/\\/g, "/")}`);
      }
      if (e.type === "assistant.message" && e.data?.content) r.answer += String(e.data.content);
      if (e.type === "result" || e.type === "session.end") r.completion = "success";
    }
  }
  r.skills = [...new Set(r.skills.filter((s) => s.startsWith("chayen-")))];
  r.refs = [...new Set(r.refs)];
  return r;
}

// Claude Code 2.1.270 expands an explicit /plugin:skill invocation without a Skill tool event.
// Count the explicitly named skill as loaded only on observable evidence: a read of one of its
// own references, or the probe's declared output marker in the answer.
function explicitEvidence(p, r) {
  if (p.mode !== "explicit" || r.skills.includes(p.skill)) return null;
  if (r.refs.some((x) => x.startsWith(`${p.skill}/`))) return "skill-local reference read";
  if (p.marker && r.answer.includes(p.marker)) return `answer marker "${p.marker}"`;
  return null;
}

function judge(p, r) {
  const e = p.expect, s = r.skills;
  let route;
  if (e.none) route = { pass: s.length === 0, why: s.length ? `unexpected ${s}` : "no chayen skill" };
  else if (e.none_or) { const bad = s.filter((x) => !e.none_or.includes(x)); route = { pass: !bad.length, why: bad.length ? `unexpected ${bad}` : s.length ? `allowed ${s}` : "no chayen skill" }; }
  else if (e.inspect_first) { const firstSkill = r.tools.findIndex((t) => t === "Skill" || t === "skill"); const firstExplore = r.tools.findIndex((t) => EXPLORE.has(t)); const ok = firstExplore > -1 && (firstSkill === -1 || firstExplore < firstSkill); route = { pass: ok, why: ok ? `inspected before choosing${s.length ? `; then ${s}` : "; no skill loaded"}` : firstExplore === -1 ? "no repository inspection" : "skill chosen before inspection" }; }
  else { const hit = s.some((x) => e.any_of.includes(x)); const bad = s.filter((x) => !e.any_of.includes(x)); route = { pass: hit && !bad.length, why: !hit ? `expected one of ${e.any_of}` : bad.length ? `also ${bad}` : "ok" }; }
  let ref = null;
  if (p.refs) { const re = new RegExp(p.refs.pattern, "i"); const hit = r.refs.some((x) => x.startsWith(p.refs.skill + "/") && re.test(x)); ref = { pass: hit, why: hit ? "reference read" : "no matching reference read" }; }
  return { route, ref };
}

const results = [];
for (let run = 1; run <= runs; run++) for (const p of probes) {
  const file = path.join(outDir, `${p.id}.run${run}.jsonl`);
  let stdout, exit, seconds = null;
  if (prior) {
    if (!fs.existsSync(file)) { console.error(`missing transcript ${p.id} run${run}`); continue; }
    stdout = fs.readFileSync(file, "utf8");
    const old = prior.results.find((x) => x.id === p.id && x.run === run);
    exit = old?.exit ?? null; seconds = old?.seconds ?? null;
  } else {
    const started = Date.now();
    const res = spawnSync(cmd, [...pre, ...argsFor(p)], { cwd: workdir, encoding: "utf8", timeout: 600_000, input: "", maxBuffer: 64 * 1024 * 1024 });
    stdout = res.stdout ?? ""; exit = res.status; seconds = Math.round((Date.now() - started) / 1000);
    fs.writeFileSync(file, stdout);
    if (res.stderr) fs.writeFileSync(path.join(outDir, `${p.id}.run${run}.stderr.txt`), res.stderr);
  }
  const r = parse(stdout);
  const evidence = explicitEvidence(p, r);
  if (evidence) r.skills.push(p.skill);
  // Routing is judged from the transcript whenever the session produced a result; a non-zero exit
  // (for example the max-turns limit) is reported as completion, not as a routing failure.
  const v = r.completion ? judge(p, r) : { route: { pass: false, why: `no result event (exit ${exit})` }, ref: p.refs ? { pass: false, why: "not evaluated" } : null };
  results.push({ id: p.id, run, mode: p.mode, expect: p.expect, exit, completion: r.completion, seconds, model: r.model, discoveredSkills: r.discovered, loadedSkills: r.skills, explicitEvidence: evidence, referencesRead: r.refs, toolSequence: r.tools, deniedTools: r.denied, costUsd: r.costUsd, route: v.route, reference: v.ref, answerExcerpt: scrub(r.answer).slice(0, 1200) });
  console.log(`${v.route.pass ? "PASS" : "FAIL"} ${p.id} run${run} skills=${r.skills.join(",") || "none"} (${v.route.why})${v.ref ? ` ref=${v.ref.pass ? "PASS" : "FAIL"}` : ""}${r.completion && r.completion !== "success" ? ` completion=${r.completion}` : ""}`);
}
const version = prior?.providerVersion ?? spawnSync(cmd, [...pre, "--version"], { encoding: "utf8", input: "" }).stdout?.split(/\r?\n/)[0]?.trim();
const unchanged = prior ? prior.fixtureUnchanged : before === treeHash();
const summary = {
  provider, providerVersion: version, spec: specRel, metadataFingerprint, ranAt: prior?.ranAt ?? new Date().toISOString(), rescoredAt: prior ? new Date().toISOString() : undefined, runs,
  pluginLoad: "--plugin-dir (no install)",
  permissions: provider === "claude" ? "-p mode; Read/Glob/Grep/Skill pre-approved; other tools left to native permission handling" : "--deny-tool shell, --deny-tool write",
  fixtureGit: prior ? prior.fixtureGit : gitSetup, fixtureUnchanged: unchanged, results,
};
fs.writeFileSync(path.join(outDir, prior ? "summary.rescored.json" : "summary.json"), JSON.stringify(summary, null, 2));
const passed = results.filter((r) => r.route.pass).length;
console.log(`\n${provider} ${version}: routing ${passed}/${results.length} passed; fixture unchanged: ${unchanged}${prior ? " (rescored offline)" : ""}`);
process.exit(passed === results.length && unchanged ? 0 : 1);
