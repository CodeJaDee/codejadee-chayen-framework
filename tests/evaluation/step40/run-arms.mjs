#!/usr/bin/env node
// Developer-only STEP 40 arm runner: sends the quality and persistent-policy cases in
// tests/evaluation/step40/quality-cases.json to a provider CLI in fresh sessions and records full
// outputs for tools/evals/score-step40.mjs.
//   Arm A: agent without the plugin.  Arm B: plugin loaded with --plugin-dir (no install).
//   Arm C: plugin plus the canonical opt-in policy (response-style/chayen-response-style.md)
//          placed at the host's documented user-level location inside an ISOLATED config home.
// Before arm C, a loading canary checks that the host actually reads that location; arms A and B
// run the same canary to confirm the isolated home carries no other instructions.
//
// Usage (plan: offline, prints what would run, creates nothing):
//   node tests/evaluation/step40/run-arms.mjs --plan --provider claude|copilot [--arms A,B,C]
//        [--groups th,en,mixed,policy] [--only id1,id2] [--runs N]
// Live (billed; sends prompts and case files to the provider):
//   CLAUDE_CONFIG_DIR=<isolated, signed-in test home> node tests/evaluation/step40/run-arms.mjs
//        --allow-provider-calls --provider claude --out <fresh dir outside the repo> [options above]
//   COPILOT_HOME=<isolated, signed-in test home> ... --provider copilot ...
// The isolated home must not be the default ~/.claude or ~/.copilot and must not already contain
// user instruction files. The runner writes there only the policy file for arm C (removed again
// afterwards) and never touches real user configuration. Codex is not supported: its plugins load
// only after `codex plugin add` (see the Step 40 README for the manual procedure). Never shipped.
// Zero dependencies.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { inside, safeId, assertTreeNoLinks } from "../../../tools/validate/safe-paths.mjs";

const arg = (name, def) => { const i = process.argv.indexOf(name); return i > -1 ? process.argv[i + 1] : def; };
const repo = fs.realpathSync(path.join(import.meta.dirname, "../../.."));
const plan = process.argv.includes("--plan");
const provider = arg("--provider");
const arms = (arg("--arms", "A,B,C")).split(",");
const groups = (arg("--groups", "th,en,mixed,policy")).split(",");
const only = arg("--only")?.split(",");
const runs = Number(arg("--runs", "3"));
const fail = (msg) => { console.error(msg); process.exit(2); };
if (!["claude", "copilot"].includes(provider)) fail("--provider claude|copilot required (Codex: manual procedure in tests/evaluation/step40/README.md)");
if (arms.some((a) => !["A", "B", "C"].includes(a))) fail("--arms takes A, B and/or C");
if (!Number.isInteger(runs) || runs < 1 || runs > 5) fail("--runs must be 1..5");
if (!plan && !process.argv.includes("--allow-provider-calls")) fail("Provider calls send prompts and case files externally; explicit authorization and --allow-provider-calls required (or use --plan)");

const spec = JSON.parse(fs.readFileSync(inside(repo, "tests/evaluation/step40/quality-cases.json"), "utf8"));
const cases = spec.cases.filter((c) => groups.includes(c.group) && (!only || only.includes(c.id)));
for (const c of cases) { safeId(c.id); for (const f of Object.keys(c.files ?? {})) inside(repo, f); }
if (!cases.length) fail("No matching cases");
const pluginDir = inside(repo, "plugins/codejadee-chayen-framework");
const policyText = fs.readFileSync(inside(repo, "response-style/chayen-response-style.md"), "utf8").replace(/\r\n/g, "\n");
const policyVersion = Number(/v(\d+) -->/.exec(policyText)?.[1]);
const sha = (t) => crypto.createHash("sha256").update(t).digest("hex").slice(0, 16);
const metadataFingerprint = (() => { const h = crypto.createHash("sha256"), d = path.join(pluginDir, "skills"); for (const n of fs.readdirSync(d).sort()) { const f = path.join(d, n, "SKILL.md"); if (fs.existsSync(f)) h.update(`${n}\0${/^description:\s*(.*)$/m.exec(fs.readFileSync(f, "utf8"))?.[1] ?? ""}\0`); } return h.digest("hex").slice(0, 16); })();

// Documented user-level locations (docs/chayen/RESPONSE_STYLE_DESIGN.md §4), relative to the isolated home.
const HOST = {
  claude: { env: "CLAUDE_CONFIG_DIR", defaultHome: path.join(os.homedir(), ".claude"), policyFile: "rules/chayen-response-style.md", reserved: ["CLAUDE.md", "rules"], repoFiles: ["CLAUDE.md", "AGENTS.md"] },
  copilot: { env: "COPILOT_HOME", defaultHome: path.join(os.homedir(), ".copilot"), policyFile: "copilot-instructions.md", reserved: ["copilot-instructions.md", "instructions"], repoFiles: ["AGENTS.md", ".github/copilot-instructions.md"] },
}[provider];
const prompt = (c) => (c.input ? `${c.request}\n\n${c.input}` : c.request);
function argsFor(text, arm) {
  const plugin = arm === "A" ? [] : ["--plugin-dir", pluginDir];
  if (provider === "claude") return ["-p", text, ...plugin, "--allowedTools", "Read,Glob,Grep,Skill", "--output-format", "stream-json", "--verbose", "--no-session-persistence", "--max-turns", "8"];
  return ["-p", text, ...plugin, "--output-format", "json", "--deny-tool", "shell", "--deny-tool", "write"];
}
const nonce = crypto.randomBytes(6).toString("hex");
const CANARY_PROMPT = "Reply with the exact loading-check token from your instructions, or the single word NONE if you have no such token.";
const canaryBlock = `\n<!-- step40 loading canary (temporary) -->\nWhen asked for the loading-check token, reply with exactly: RS-CANARY-${nonce}\n`;
const selected = arms.flatMap((arm) => cases.filter((c) => c.arms.includes(arm)).map((c) => ({ arm, c })));
const calls = selected.length * runs + arms.length;

if (plan) {
  console.log(`PLAN  provider ${provider}; arms ${arms.join(",")}; groups ${groups.join(",")}; ${cases.length} case(s); ${selected.length} arm-case pair(s) x ${runs} run(s) + ${arms.length} loading canary call(s) = ${calls} billed call(s)`);
  for (const arm of arms) console.log(`PLAN  arm ${arm}: ${selected.filter((s) => s.arm === arm).length} case(s); plugin ${arm === "A" ? "not loaded" : "--plugin-dir (no install)"}; policy ${arm === "C" ? `v${policyVersion} (${sha(policyText)}) at $${HOST.env}/${HOST.policyFile} during the arm only` : "absent"}`);
  console.log(`PLAN  isolation: $${HOST.env} must be set to an isolated, signed-in test home (not ${HOST.defaultHome.replace(os.homedir(), "~")}) without ${HOST.reserved.join(" or ")}; each run uses a fresh empty work directory under --out`);
  console.log(`PLAN  example: ${provider} ${argsFor("<request + input>", "C").map((a) => (a === pluginDir ? "<plugin-dir>" : a.includes(" ") ? JSON.stringify(a) : a)).join(" ")}`);
  console.log(`PLAN  metadata fingerprint ${metadataFingerprint}; nothing was created or sent`);
  process.exit(0);
}

const home = process.env[HOST.env];
if (!home || !fs.existsSync(home)) fail(`An explicitly isolated ${HOST.env} is required`);
const realHome = fs.realpathSync(home);
if (realHome === path.resolve(HOST.defaultHome) || realHome === repo || realHome.startsWith(repo + path.sep)) fail(`${HOST.env} must be an isolated test home, not the default home or the repository`);
const clash = HOST.reserved.filter((f) => fs.existsSync(path.join(realHome, f)));
if (clash.length) fail(`Isolated home already contains ${clash.join(", ")}; use a clean test home`);
const outArg = arg("--out");
if (!outArg) fail("--out <fresh directory outside the repository> required");
const outParent = fs.realpathSync(path.dirname(path.resolve(outArg)));
if (outParent === repo || outParent.startsWith(repo + path.sep)) fail("Use an output directory outside the source repository");
const outDir = inside(outParent, path.basename(outArg));
if (fs.existsSync(outDir)) fail("Refusing an existing --out directory");
assertTreeNoLinks(pluginDir);
fs.mkdirSync(outDir, { mode: 0o700 });

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
const scrub = (text) => String(text).replace(/[A-Za-z]:(?:\\\\|\\|\/)[^\s"'`)]*/g, "<ABS-PATH>").replace(/(?:^|(?<=[\s"'`(]))\/(?:Users|home|tmp|var)\/[^\s"'`)]*/g, "<ABS-PATH>");
const refRe = /skills[\\/]+(chayen-[a-z-]+)[\\/]+references[\\/]+([\w./\\-]+\.md)/i;
function parse(stdout) {
  const r = { skills: [], refs: [], actions: [], answer: "", model: null, costUsd: null, completion: null };
  for (const line of stdout.split(/\r?\n/)) {
    if (!line.trim().startsWith("{")) continue;
    let e; try { e = JSON.parse(line); } catch { continue; }
    if (provider === "claude") {
      if (e.type === "system" && e.subtype === "init") r.model = e.model;
      if (e.type === "assistant") for (const c of e.message?.content ?? []) {
        if (c.type !== "tool_use") continue;
        const input = c.input ?? {};
        if (c.name === "Skill") r.skills.push(String(input.skill ?? "").replace(/^[\w-]+:/, ""));
        r.actions.push({ tool: c.name, target: scrub(input.file_path ?? input.path ?? input.notebook_path ?? ""), command: scrub(input.command ?? "") });
        const m = refRe.exec(String(input.file_path ?? input.path ?? "")); if (m) r.refs.push(`${m[1]}/${m[2].replace(/\\/g, "/")}`);
      }
      if (e.type === "result") {
        r.costUsd = e.total_cost_usd; r.answer = String(e.result ?? ""); r.completion = e.subtype ?? (e.is_error ? "error" : "success");
        for (const d of e.permission_denials ?? []) r.actions.push({ tool: d.tool_name, target: scrub(d.tool_input?.file_path ?? ""), command: scrub(d.tool_input?.command ?? ""), denied: true });
      }
    } else {
      if (e.type === "tool.execution_start") {
        const name = e.data?.toolName, a = e.data?.arguments ?? {};
        if (name === "skill" && a.skill) r.skills.push(String(a.skill).replace(/^[\w-]+:/, ""));
        r.actions.push({ tool: name, target: scrub(a.path ?? a.file_path ?? ""), command: scrub(a.command ?? "") });
        const m = refRe.exec(JSON.stringify(a).replace(/\\\\/g, "/")); if (m) r.refs.push(`${m[1]}/${m[2].replace(/\\/g, "/")}`);
      }
      if (e.type === "assistant.message" && e.data?.content) r.answer += String(e.data.content);
      if (e.type === "result" || e.type === "session.end") r.completion = "success";
    }
  }
  r.skills = [...new Set(r.skills.filter((s) => s.startsWith("chayen-")))];
  r.refs = [...new Set(r.refs)];
  return r;
}
const snapshot = (dir) => { const out = new Map(); const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else out.set(path.relative(dir, p).split(path.sep).join("/"), sha(fs.readFileSync(p))); } }; walk(dir); return out; };
function session(text, arm, workdir) {
  const started = Date.now();
  const res = spawnSync(cmd, [...pre, ...argsFor(text, arm)], { cwd: workdir, encoding: "utf8", timeout: 600_000, input: "", maxBuffer: 64 * 1024 * 1024, env: { ...process.env, [HOST.env]: realHome } });
  return { stdout: res.stdout ?? "", stderr: res.stderr ?? "", exit: res.status, seconds: Math.round((Date.now() - started) / 1000) };
}
const policyPath = path.join(realHome, ...HOST.policyFile.split("/"));
const setPolicy = (text) => { fs.mkdirSync(path.dirname(policyPath), { recursive: true }); fs.writeFileSync(policyPath, text); };
const clearPolicy = () => { fs.rmSync(policyPath, { force: true }); const dir = path.dirname(policyPath); if (dir !== realHome && fs.existsSync(dir) && !fs.readdirSync(dir).length) fs.rmdirSync(dir); };

const records = [], loading = [];
let n = 0;
try {
  for (const arm of arms) {
    const work = path.join(outDir, "work", arm); fs.mkdirSync(work, { recursive: true });
    if (arm === "C") setPolicy(policyText + canaryBlock);
    const canaryDir = path.join(work, "canary"); fs.mkdirSync(canaryDir);
    const canary = parse(session(CANARY_PROMPT, arm, canaryDir).stdout);
    const found = canary.answer.includes(`RS-CANARY-${nonce}`);
    loading.push({ arm, policyLoaded: arm === "C" ? found : null, canaryFound: found, isolationClean: arm === "C" ? null : !found });
    console.log(`CANARY arm ${arm}: token ${found ? "found" : "not found"}${arm === "C" && !found ? " — policy location not loaded; arm C cases NOT_RUN" : ""}`);
    if (arm === "C") { if (!found) { clearPolicy(); continue; } setPolicy(policyText); }
    for (const { c } of selected.filter((s) => s.arm === arm)) for (let run = 1; run <= runs; run++) {
      const dir = path.join(work, `${c.id}-r${run}`); fs.mkdirSync(dir);
      for (const [rel, body] of Object.entries(c.files ?? {})) { const f = inside(dir, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, body); }
      if (c.context?.repoInstruction) for (const rel of HOST.repoFiles) { const f = inside(dir, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, c.context.repoInstruction); }
      const before = snapshot(dir);
      const s = session(prompt(c), arm, dir);
      fs.writeFileSync(path.join(outDir, `${c.id}.${arm}.run${run}.jsonl`), s.stdout);
      if (s.stderr) fs.writeFileSync(path.join(outDir, `${c.id}.${arm}.run${run}.stderr.txt`), s.stderr);
      const after = snapshot(dir);
      const filesChanged = [...new Set([...before.keys(), ...after.keys()])].filter((k) => before.get(k) !== after.get(k));
      const r = parse(s.stdout);
      records.push({ caseId: c.id, group: c.group, arm, run, exit: s.exit, completion: r.completion, seconds: s.seconds, model: r.model, costUsd: r.costUsd, loadedSkills: r.skills, referencesRead: r.refs, actions: r.actions, filesChanged, output: scrub(r.answer) });
      console.log(`RUN   ${++n}/${calls - arms.length} ${c.id} arm ${arm} run ${run}: skills=${r.skills.join(",") || "none"} files changed=${filesChanged.length} ${r.completion ?? `no result (exit ${s.exit})`}`);
    }
    if (arm === "C") clearPolicy();
  }
} finally {
  clearPolicy();
}
const version = spawnSync(cmd, [...pre, "--version"], { encoding: "utf8", input: "" }).stdout?.split(/\r?\n/)[0]?.trim();
const summary = { step: 40, kind: "arm-outputs", provider, providerVersion: version, ranAt: new Date().toISOString(), runs, metadataFingerprint, policy: { version: policyVersion, sha256: sha(policyText), location: `$${HOST.env}/${HOST.policyFile}` }, loading, records };
fs.writeFileSync(path.join(outDir, "arm-outputs.json"), JSON.stringify(summary, null, 2));
console.log(`\n${provider} ${version}: ${records.length} record(s) in ${path.join(outDir, "arm-outputs.json")}; score with node tools/evals/score-step40.mjs --outputs <that file>`);
