#!/usr/bin/env node
// Developer-only isolated real-coding runner (evolution Step 16, D-073). Runs one coding task from
// tests/evaluation/coding/tasks/ with one provider, one exact model and one arm (baseline without Chayen, or
// Chayen installed natively in the isolated provider home), in a fresh disposable git workspace per run,
// and records the transcript, tool and command trace, diff, verification output, duration, usage and cost.
//
// It is separate from run-phase5.mjs, which stays read-only. Write-capable runs happen only inside a
// container whose boundary is probed and verified first (chayen-coding-isolation/1 profile); a provider
// permission flag is never treated as a sandbox. When the boundary cannot be verified the runner exits 3
// with BLOCKED and starts no provider. It never falls back to the developer workspace.
//
// Offline (no provider is started; nothing is sent):
//   node tests/evaluation/coding/run-coding.mjs --inspect-host [--isolation <profile.json>]
//   node tests/evaluation/coding/run-coding.mjs --plan [--task <id>] [--runs 3]
//   node tests/evaluation/coding/run-coding.mjs --preflight --candidate <file> --provider <p> --arm baseline|chayen --task <id> --isolation <profile.json>
//   node tests/evaluation/coding/run-coding.mjs --score <results dir> [--candidate <file>]
//   node tests/evaluation/coding/run-coding.mjs --compare <baseline results dir> <chayen results dir>
// Live (billed; sends the task prompt and fixture contents to the provider; needs recorded authorization):
//   CLAUDE_CONFIG_DIR|CODEX_HOME|COPILOT_HOME=<isolated signed-in TEST home, chayen installed (chayen arm) or not (baseline arm)>
//   node tests/evaluation/coding/run-coding.mjs --provider claude|codex|copilot --model <exact id> [--effort <level>] --arm baseline|chayen
//     --task <id> --candidate <file> [--allow-uncommitted-candidate] --isolation <profile.json>
//     --allow-provider-calls --allow-coding-writes --authorization <owner approval reference> --max-calls <n>
//     [--max-usd-per-run <usd> --max-total-usd <usd>  (required for claude)] [--runs 1..5] [--timeout-sec 1800]
//     --out <fresh directory outside the repository>
//   ... --retry <results dir> re-runs ONLY runs recorded as ERROR_NO_RESULT, once.
// Runner tests use --provider fake --fake-scenario <s> --isolation test-only-no-isolation [--task-dir <dir>];
// that combination is refused for every real provider. Never shipped with the plugin. Zero dependencies.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { loadCandidate, verifyAgainstCheckout, checkInstalled, LEGACY_CANDIDATE } from "../phase5/candidate.mjs";
import { redact } from "../../../tools/evals/failure-cases.mjs";
import { TASKS } from "./run-coding-fixtures.mjs";
import {
  RUN_SCHEMA, RECORD_SCHEMA, REAL_PROVIDERS, PROVIDERS, ARMS, HOME_ENV, TEST_ONLY_ISOLATION, checkModel, toolPolicy, providerArgs, loadIsolationProfile, checkIsolation,
  engineStatus, resolveEngine, onPath, hostTestBackend, containerBackend, loadTaskDir, taskFingerprint, prepareWorkspace, gitRemotes, agentCommits, captureDiff, verify, actionMetrics, classifySecurity,
  classifyCompletion, claimCheck, redactText, validateRecord, summarize, pairKey, parseRun, posix,
} from "./coding-runner-lib.mjs";

const repo = fs.realpathSync(path.resolve(import.meta.dirname, "../../.."));
const here = path.join(repo, "tests/evaluation/coding");
const FAKE_AGENT_DIR = path.join(here, "fakes");
const argv = process.argv.slice(2);
const arg = (name, def) => { const i = argv.indexOf(name); return i > -1 ? argv[i + 1] : def; };
const has = (name) => argv.includes(name);
const fail = (msg, code = 2) => { console.error(msg); process.exit(code); };
const blocked = (msg) => fail(`BLOCKED ${msg}\nNo provider was started and nothing was sent.`, 3);
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
const nonce = () => crypto.randomBytes(6).toString("hex");
const tmp = (tag) => fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), `chayen-coding-${tag}-`));
const rm = (d) => fs.rmSync(d, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
const DEFAULT_HOME = { claude: ".claude", codex: ".codex", copilot: ".copilot" };
const FAKE_SCENARIOS = ["fix", "iterate", "false-done", "out-of-scope", "escape", "remote", "env", "leftover", "hang", "error", "expensive"];
// Planning assumption for one Claude Code coding session (not a measurement); Codex and Copilot are
// billed as plan usage or premium requests and are planned in calls only.
export const CODING_COST_PLANNING_USD = 2.0;

function resolveTask(provider) {
  const dirArg = arg("--task-dir"), id = arg("--task");
  if (dirArg && provider !== "fake") fail("--task-dir is for the fake provider's runner fixtures only; real providers take --task <id> from tests/evaluation/coding/tasks/");
  const dir = dirArg ? fs.realpathSync(path.resolve(dirArg)) : id && /^[A-Za-z0-9-]+$/.test(id) ? path.join(TASKS, id) : null;
  if (!dir || !fs.existsSync(path.join(dir, "task.json"))) fail("--task <id> required (a folder under tests/evaluation/coding/tasks/)");
  if (!dir.startsWith(repo + path.sep)) fail("tasks are read from this repository only");
  return { dir, task: loadTaskDir(dir), rel: posix(path.relative(repo, dir)) };
}
function selectCandidate(required) {
  const file = arg("--candidate");
  if (!file) { if (required) fail(`--candidate <manifest> required; there is no default candidate. Prepare one with tests/evaluation/phase5/candidate.mjs prepare --out <file> (the historical ${LEGACY_CANDIDATE} never describes this checkout)`); return null; }
  try { return { ...loadCandidate(path.resolve(file)), fileSha256: sha(fs.readFileSync(path.resolve(file))) }; }
  catch (e) { fail(`Candidate ${file} rejected: ${e.message}`); }
}
// An explicitly isolated provider home: not a link, not the user home or a parent of it, not a default
// provider home or inside one, not the repository. Its credentials are the owner's test sign-in; the
// runner never copies authentication files from anywhere.
function isolatedHome(provider, home) {
  const v = HOME_ENV[provider];
  if (!home || !fs.existsSync(home)) fail(`An explicitly isolated ${v} test home is required (signed in for this evaluation only; personal authentication files are never copied)`);
  if (fs.lstatSync(home).isSymbolicLink()) fail(`${v} must not be a link`);
  const real = fs.realpathSync(home), user = fs.realpathSync(os.homedir());
  const defaults = Object.values(DEFAULT_HOME).map((d) => path.join(user, d));
  const within = (p, base) => p === base || p.startsWith(base + path.sep);
  if (within(user, real) || defaults.some((d) => within(real, d)) || within(real, repo) || within(repo, real)) fail(`${v} must be an isolated test home: not the user home, a default provider home or the repository`);
  return real;
}
function outDirFor(outArg) {
  if (!outArg) fail("--out <fresh directory outside the repository> required");
  const parent = path.dirname(path.resolve(outArg));
  if (!fs.existsSync(parent)) fail("the parent of --out must exist");
  const real = fs.realpathSync(parent);
  if (real === repo || real.startsWith(repo + path.sep)) fail("Use an output directory outside the source repository");
  const out = path.join(real, path.basename(outArg));
  if (fs.existsSync(out)) fail("Refusing an existing --out directory (duplicate output); nothing was overwritten");
  return out;
}

// Every check that must pass before anything is created or started. `live` adds the authorization gates.
function gate({ live }) {
  const provider = arg("--provider"), armName = arg("--arm");
  if (!PROVIDERS.includes(provider) || !ARMS.includes(armName)) fail("--provider claude|codex|copilot and --arm baseline|chayen are required (or use --plan, --inspect-host, --score)");
  const real = REAL_PROVIDERS.includes(provider);
  const { dir: taskDir, task, rel: taskRel } = resolveTask(provider);
  const retryDir = arg("--retry");
  const runs = Number(arg("--runs", "1"));
  const ctx = { provider, arm: armName, real, taskDir, task, taskRel, retryDir, runs };
  if (live) {
    if (!has("--allow-provider-calls")) fail(`${real ? "Live runs are billed and send the task prompt and fixture contents to the provider" : "Fake runs go through the same gates"}: --allow-provider-calls required (or use --plan or --preflight)`);
    if (!has("--allow-coding-writes")) fail("Coding runs let the agent edit files and run commands: --allow-coding-writes required (write-capable runs happen only inside a verified isolation boundary)");
    ctx.authorization = arg("--authorization");
    if (!/^[A-Za-z0-9][A-Za-z0-9._:#/-]{2,119}$/.test(ctx.authorization ?? "")) fail("--authorization <reference to the recorded owner budget and access approval> required");
    if (!Number.isInteger(runs) || runs < 1 || runs > 5) fail("--runs must be 1..5");
    ctx.maxCalls = Number(arg("--max-calls"));
    if (!Number.isInteger(ctx.maxCalls) || ctx.maxCalls < 1) fail("--max-calls <approved budget cap in provider invocations> required");
    if (!retryDir && runs > ctx.maxCalls) fail(`Planned ${runs} provider invocation(s) exceed --max-calls ${ctx.maxCalls}; nothing was sent`);
    ctx.timeoutSec = Number(arg("--timeout-sec", "1800"));
    if (!Number.isInteger(ctx.timeoutSec) || ctx.timeoutSec < (real ? 60 : 1) || ctx.timeoutSec > 3600) fail(`--timeout-sec must be ${real ? 60 : 1}..3600`);
  }
  if (real) {
    const errors = checkModel(provider, arg("--model"), arg("--effort"));
    if (errors.length) fail(errors.join("\n"));
    if (has("--fake-scenario")) fail("--fake-scenario is for the fake provider only");
  } else {
    if (arg("--model") && arg("--model") !== "fake-model-1") fail("the fake provider has one model, fake-model-1");
    if (!FAKE_SCENARIOS.includes(arg("--fake-scenario"))) fail(`--fake-scenario <${FAKE_SCENARIOS.join("|")}> required for the fake provider`);
  }
  ctx.model = real ? arg("--model") : "fake-model-1";
  ctx.effort = arg("--effort");
  if (live) {
    const usd = (n) => (arg(n) === undefined ? null : Number(arg(n)));
    ctx.maxUsdPerRun = usd("--max-usd-per-run"); ctx.maxTotalUsd = usd("--max-total-usd");
    for (const [n, v] of [["--max-usd-per-run", ctx.maxUsdPerRun], ["--max-total-usd", ctx.maxTotalUsd]]) if (v !== null && !(v > 0 && v <= 500)) fail(`${n} must be a positive amount up to 500`);
    if (provider === "claude" && (ctx.maxUsdPerRun === null || ctx.maxTotalUsd === null)) fail("Claude Code reports USD cost: --max-usd-per-run (passed as --max-budget-usd) and --max-total-usd are required");
    ctx.outDir = retryDir ? fs.realpathSync(path.resolve(retryDir)) : outDirFor(arg("--out"));
  }
  // Isolation: real providers need a container profile; the fake provider runs only without isolation.
  const iso = arg("--isolation");
  if (!iso) fail(`--isolation <chayen-coding-isolation/1 profile> required${real ? "" : ` (the fake provider takes ${TEST_ONLY_ISOLATION})`}`);
  if (iso === TEST_ONLY_ISOLATION) { if (real) blocked(`${TEST_ONLY_ISOLATION} is never used with a real provider: write-capable runs need a verified container boundary`); }
  else if (!real) fail(`the fake provider runs only with --isolation ${TEST_ONLY_ISOLATION}`);
  else { try { ctx.profile = loadIsolationProfile(path.resolve(iso), { repo }); } catch (e) { blocked(e.message); } }
  // Candidate and homes.
  ctx.candidate = selectCandidate(true);
  if (ctx.candidate.qualification === "UNCOMMITTED_SNAPSHOT" && !has("--allow-uncommitted-candidate")) fail(`Candidate ${ctx.candidate.id} is an UNCOMMITTED_SNAPSHOT, not a release-qualified commit; pass --allow-uncommitted-candidate to run it anyway (results stay labelled). Nothing was sent`);
  if (real && !ctx.candidate.providers.includes(provider)) fail(`Candidate ${ctx.candidate.id} does not list provider ${provider}; nothing was sent`);
  const drift = verifyAgainstCheckout(ctx.candidate, repo);
  if (drift.length) fail(`Candidate ${ctx.candidate.id} does not describe this checkout; nothing was sent:\n  ${drift.join("\n  ")}`);
  ctx.home = isolatedHome(provider, arg("--home") && !real ? arg("--home") : process.env[HOME_ENV[provider]]);
  const installed = checkInstalled(ctx.candidate, ctx.home, armName === "chayen" ? "plugin" : "baseline");
  if (installed.errors.length) fail(`The ${armName} arm home does not match candidate ${ctx.candidate.id}; nothing was sent:\n  ${installed.errors.join("\n  ")}`);
  ctx.packageFingerprint = armName === "chayen" ? installed.installs[0].sha256 : null;
  return ctx;
}

// The boundary is verified on a scratch workspace with the run's exact mounts; a file next to that
// workspace (never mounted) must stay invisible inside the container.
function verifyBoundary(ctx) {
  if (!ctx.real) return { backend: hostTestBackend(), isolation: { backend: TEST_ONLY_ISOLATION, verified: false, profileSha256: null, engineVersion: null, imageDigest: null, network: null, note: "no isolation: fake provider and harmless fixtures only" } };
  const engine = resolveEngine(ctx.profile.engine);
  const scratch = tmp("probe"), ws = path.join(scratch, "workspace"), n = nonce(), canary = `OUTSIDE-CANARY-${n}`;
  fs.mkdirSync(ws); fs.writeFileSync(path.join(scratch, canary), n);
  let r;
  try { r = checkIsolation(ctx.profile, { engine, workspace: ws, home: ctx.home, nonce: n, canaryName: canary }); } finally { rm(scratch); }
  if (r.status !== "VERIFIED") blocked(`isolation boundary not verified:\n  ${r.errors.join("\n  ")}`);
  return { backend: containerBackend(ctx.profile, engine), probe: r, isolation: { backend: "container", verified: true, profileSha256: ctx.profile.sha256, engineVersion: r.engineVersion, imageDigest: r.imageDigest, network: ctx.profile.network, note: `probe: uid ${r.probe.uid}, mounts ${r.probe.mounts.join(", ")}, egress to ${ctx.profile.egress.deniedProbe} denied` } };
}

function snapshotOutside(runDir) {
  const out = new Map();
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name), rel = posix(path.relative(runDir, p)); if (rel === "workspace") continue; if (e.isDirectory() && !e.isSymbolicLink()) walk(p); else out.set(rel, e.isSymbolicLink() ? "link" : sha(fs.readFileSync(p))); } };
  walk(runDir);
  return out;
}
// Workspace paths in a host transcript become /workspace, as in the container, so traces compare across backends.
function localize(text, ws) {
  let t = String(text ?? "");
  for (const v of [...new Set([ws.replace(/\\/g, "\\\\"), ws, ws.replace(/\\/g, "/")])].sort((a, b) => b.length - a.length)) t = t.split(v).join("/workspace");
  return t;
}

function live() {
  const ctx = gate({ live: true });
  const { provider, arm, real, task, taskDir, outDir } = ctx;
  const policy = toolPolicy(task);
  let meta = null, queue;
  if (ctx.retryDir) {
    meta = JSON.parse(fs.readFileSync(path.join(outDir, "run.json"), "utf8"));
    for (const [k, v] of [["provider", provider], ["arm", arm], ["task", task.id], ["modelConfig", ctx.model], ["effort", ctx.effort ?? null]]) if (meta[k] !== v) fail(`--retry: ${k} ${v} differs from the recorded run (${meta[k]}); nothing was sent`);
    if (meta.candidate.id !== ctx.candidate.id) fail("--retry: a different candidate; nothing was sent");
    const prior = readRecords(outDir);
    queue = prior.filter((r) => r.completion === "ERROR_NO_RESULT" && r.attempt === 1 && !prior.some((q) => q.run === r.run && q.attempt === 2)).map((r) => ({ run: r.run, attempt: 2 }));
    if (!queue.length) fail("--retry: no run is recorded as ERROR_NO_RESULT without a retry; nothing was sent");
    if (queue.length > ctx.maxCalls) fail(`Planned ${queue.length} retry invocation(s) exceed --max-calls ${ctx.maxCalls}; nothing was sent`);
    if (fs.existsSync(path.join(outDir, "summary.pre-retry.json"))) fail("--retry: this results directory was already retried once; nothing was sent");
  } else queue = Array.from({ length: ctx.runs }, (_, i) => ({ run: i + 1, attempt: 1 }));

  const { backend, isolation } = verifyBoundary(ctx);
  // The source snapshot both arms start from: a deterministic commit of repo/.
  const sourceFixture = taskFingerprint(taskDir);
  const probe = tmp("snapshot");
  let sourceCommit;
  try { sourceCommit = prepareWorkspace(taskDir, path.join(probe, "ws")); } finally { rm(probe); }
  let cliVersion = "fake-agent 1";
  if (real) {
    const vdir = tmp("version");
    try {
      const v = backend.exec({ argv: [provider, "--version"], root: vdir, network: "none", timeoutMs: 120_000, name: `chayen-version-${nonce()}` });
      cliVersion = String(v.stdout ?? "").split(/\r?\n/)[0].trim();
    } finally { rm(vdir); }
    if (!cliVersion) blocked(`${provider} --version failed inside the container; the image must contain the provider CLI`);
  }
  if (meta) {
    for (const [k, v] of [["sourceCommit", sourceCommit], ["cliVersion", cliVersion]]) if (meta[k] !== v) fail(`--retry: ${k} changed since the recorded run; nothing was sent`);
    if (JSON.stringify(meta.sourceFixture) !== JSON.stringify(sourceFixture)) fail("--retry: the task fixture changed since the recorded run; nothing was sent");
  } else {
    fs.mkdirSync(outDir, { mode: 0o700 });
    meta = {
      $schema: RUN_SCHEMA, runId: nonce(), runner: { file: "tests/evaluation/coding/run-coding.mjs", sha256: sha(fs.readFileSync(import.meta.filename)), libSha256: sha(fs.readFileSync(path.join(here, "coding-runner-lib.mjs"))) },
      task: task.id, taskPath: ctx.taskRel, sourceFixture, sourceCommit, promptSha256: sha(task.prompt), arm, provider, cliVersion, modelConfig: ctx.model, effort: ctx.effort ?? null, toolPolicy: policy,
      invocation: providerArgs(provider, { prompt: "<PROMPT>", model: ctx.model, effort: ctx.effort, policy, workdir: "/workspace", maxUsd: ctx.maxUsdPerRun ?? 0, usageFile: provider === "copilot" ? "<usage file>" : null, scenario: arg("--fake-scenario") }).map((a) => redactText(a, [[FAKE_AGENT_DIR, "<fakes>"]])),
      permissions: real ? "native provider permissions (dontAsk / workspace-write / allow-tool lists) inside a verified container; no permission-bypass flag" : "fake provider in the test-only backend: no isolation",
      candidate: { id: ctx.candidate.id, fileSha256: ctx.candidate.fileSha256, qualification: ctx.candidate.qualification, commit: ctx.candidate.commit, version: ctx.candidate.version, metadataFingerprint: ctx.candidate.metadataFingerprint },
      packageFingerprint: ctx.packageFingerprint, isolation, evidenceLevel: real ? "provider-invocation" : "simulated-fake-provider (runner test; never evaluation evidence)",
      authorization: ctx.authorization, caps: { maxCalls: ctx.maxCalls, maxUsdPerRun: ctx.maxUsdPerRun, maxTotalUsd: ctx.maxTotalUsd, timeoutSec: ctx.timeoutSec, runs: ctx.runs },
      host: { platform: process.platform, node: process.version }, startedAt: new Date().toISOString(),
    };
    fs.writeFileSync(path.join(outDir, "run.json"), JSON.stringify(meta, null, 2) + "\n", { flag: "wx" });
  }
  const ledger = (e) => fs.appendFileSync(path.join(outDir, "ledger.jsonl"), JSON.stringify({ at: new Date().toISOString(), ...e }) + "\n");
  ledger({ event: ctx.retryDir ? "retry-started" : "started", planned: queue.length });

  let spent = readRecords(outDir, true).reduce((a, r) => a + (r.costUsd ?? 0), 0), calls = 0;
  for (const { run, attempt } of queue) {
    if (ctx.maxTotalUsd !== null && spent >= ctx.maxTotalUsd) { ledger({ event: "stopped", reason: `reported cost ${spent.toFixed(4)} reached --max-total-usd ${ctx.maxTotalUsd}`, notRun: queue.length - calls }); console.log(`STOP  budget reached (${spent.toFixed(4)} >= ${ctx.maxTotalUsd}); ${queue.length - calls} run(s) NOT_RUN`); break; }
    const stem = `${task.id}.${arm}.r${run}.a${attempt}`;
    const runDir = path.join(outDir, "runs", stem);
    if (fs.existsSync(runDir)) fail(`duplicate output ${stem}; nothing was overwritten`);
    fs.mkdirSync(runDir, { recursive: true });
    const ws = path.join(runDir, "workspace");
    const commit = prepareWorkspace(taskDir, ws);
    if (commit !== sourceCommit) fail(`run ${stem}: workspace commit ${commit} differs from the source snapshot ${sourceCommit}`);
    const n = nonce();
    fs.mkdirSync(path.join(runDir, "outside")); fs.writeFileSync(path.join(runDir, "outside", `OUTSIDE-CANARY-${n}.txt`), n);
    const before = snapshotOutside(runDir);
    const usageName = `.chayen-usage-${n}.json`;
    const args = providerArgs(provider, { prompt: task.prompt, model: ctx.model, effort: ctx.effort, policy, workdir: backend.workdir(ws), maxUsd: ctx.maxUsdPerRun, usageFile: provider === "copilot" ? path.posix.join(backend.homePath(ctx.home), usageName) : null, scenario: arg("--fake-scenario") });
    const started = Date.now();
    calls++;
    const res = backend.exec({ argv: [real ? provider : "node", ...args], root: ws, home: ctx.home, env: backend.agentEnv(provider, ctx.home), timeoutMs: ctx.timeoutSec * 1000, name: `chayen-coding-${n}` });
    const seconds = Math.round((Date.now() - started) / 1000), timedOut = res.error?.code === "ETIMEDOUT";
    const after = snapshotOutside(runDir);
    const outsideWrites = [...new Set([...before.keys(), ...after.keys()])].filter((k) => before.get(k) !== after.get(k)).sort();
    const stdout = real ? res.stdout ?? "" : localize(res.stdout, ws);
    const parsed = parseRun(provider, stdout, "/workspace");
    for (const a of parsed.actions) a.target = String(a.target).replace(/\\/g, "/");
    let usage = parsed.usage;
    const usageFile = path.join(ctx.home, usageName);
    if (fs.existsSync(usageFile)) { try { usage = JSON.parse(fs.readFileSync(usageFile, "utf8")); } catch { /* not JSON */ } rm(usageFile); }
    const scratch = tmp("capture");
    let diff, verification;
    try {
      diff = captureDiff(taskDir, task, ws, scratch);
      verification = verify(task, ws, scratch, backend, { timeoutMs: Math.max(ctx.timeoutSec, 600) * 1000, name: `chayen-coding-${n}` });
    } finally { rm(scratch); }
    const roots = [[ws, "<workspace>"], [ctx.home, "<provider-home>"], [outDir, "<out>"], [repo, "<repo>"], [fs.realpathSync(os.tmpdir()), "<tmp>"], [os.homedir(), "<home>"]];
    const remotes = gitRemotes(ws);
    const security = classifySecurity({ outsideWrites, remotes, actions: parsed.actions });
    const completion = classifyCompletion({ parsed, timedOut, changed: diff.summary.files.length, verification });
    const answer = redactText(parsed.answer, roots);
    fs.writeFileSync(path.join(runDir, "transcript.jsonl"), redactText(redact(stdout, [ws]).text, roots), { flag: "wx" });
    fs.writeFileSync(path.join(runDir, "stderr.txt"), redactText(res.stderr ?? "", roots), { flag: "wx" });
    fs.writeFileSync(path.join(runDir, "diff.patch"), redactText(diff.patch, roots), { flag: "wx" });
    fs.writeFileSync(path.join(runDir, "answer.md"), answer, { flag: "wx" });
    const steps = verification.steps.map(({ output, ...s }) => ({ ...s, outputTail: output === undefined ? null : redactText(output, roots).split(/\r?\n/).filter(Boolean).slice(-25).join("\n") }));
    fs.writeFileSync(path.join(runDir, "verification.json"), JSON.stringify({ status: verification.status, steps }, null, 2) + "\n", { flag: "wx" });
    const record = validateRecord({
      $schema: RECORD_SCHEMA, stem, task: task.id, arm, provider, model: parsed.model, modelConfig: ctx.model, effort: ctx.effort ?? null, cliVersion,
      candidateId: ctx.candidate.id, candidateQualification: ctx.candidate.qualification, packageFingerprint: ctx.packageFingerprint, metadataFingerprint: ctx.candidate.metadataFingerprint,
      sourceFixture, sourceCommit, promptSha256: meta.promptSha256, run, attempt, isolation: { backend: meta.isolation.backend, verified: meta.isolation.verified, profileSha256: meta.isolation.profileSha256 },
      evidenceLevel: meta.evidenceLevel, seconds, exit: res.status, signal: res.signal ?? null, timedOut, providerCompletion: parsed.completion, errorDetails: parsed.error ?? (res.error ? redactText(res.error.message, roots) : null),
      observedSkills: parsed.skills, activationEvidence: parsed.evidence, referencesRead: parsed.refs, discoveredSkills: parsed.discovered,
      toolTrace: parsed.actions.map((a) => ({ tool: a.tool, target: redactText(a.target, roots), ...(a.denied ? { denied: true } : {}) })),
      commandTrace: parsed.actions.filter((a) => a.command).map((a) => ({ tool: a.tool, command: redactText(a.command, roots).slice(0, 400), ...(a.denied ? { denied: true } : {}) })),
      metrics: actionMetrics(parsed.actions, policy), agentCommits: agentCommits(ws, sourceCommit), diff: diff.summary,
      verification: { status: verification.status, steps: steps.map(({ outputTail, ...s }) => s) },
      usage: usage ?? null, costUsd: parsed.costUsd, costReported: typeof parsed.costUsd === "number",
      answerSha256: sha(answer), claim: claimCheck(answer, verification), security, completion, hiddenGrading: "NOT_RUN (Step 17)",
    });
    fs.appendFileSync(path.join(outDir, "records.jsonl"), JSON.stringify(record) + "\n");
    spent += parsed.costUsd ?? 0;
    console.log(`${calls}/${queue.length} ${stem}: ${completion}; security ${security.classification}; verification ${verification.status}; skills=${parsed.skills.join(",") || "none"}; ${seconds}s${parsed.costUsd != null ? `; $${parsed.costUsd}` : ""}`);
  }
  ledger({ event: "finished", calls, reportedCostUsd: +spent.toFixed(4) });
  // A retry adds records, so the earlier summary is kept beside the new one rather than replaced.
  if (ctx.retryDir && fs.existsSync(path.join(outDir, "summary.json"))) fs.renameSync(path.join(outDir, "summary.json"), path.join(outDir, "summary.pre-retry.json"));
  const s = score(outDir);
  console.log(JSON.stringify(s, null, 2));
}

function readRecords(dir, optional = false) {
  const f = path.join(dir, "records.jsonl");
  if (!fs.existsSync(f)) { if (optional) return []; fail(`${dir} has no records.jsonl`); }
  return fs.readFileSync(f, "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
}
function loadRun(dir) {
  const f = path.join(dir, "run.json");
  if (!fs.existsSync(f)) fail(`${dir} has no run.json`);
  const meta = JSON.parse(fs.readFileSync(f, "utf8"));
  if (meta.$schema !== RUN_SCHEMA) fail(`${dir}/run.json is not ${RUN_SCHEMA}`);
  return meta;
}
// Offline scoring: reads recorded files only and executes nothing. The summary is deterministic, so a
// second score of the same records must reproduce summary.json byte for byte.
function score(dir) {
  const meta = loadRun(dir), records = readRecords(dir);
  const taskDir = path.join(repo, ...meta.taskPath.split("/"));
  if (!fs.existsSync(path.join(taskDir, "task.json"))) fail(`the task ${meta.taskPath} no longer exists; not scored`);
  if (JSON.stringify(taskFingerprint(taskDir)) !== JSON.stringify(meta.sourceFixture)) fail(`Stale results: the task fixture ${meta.taskPath} changed since the run; not scored`);
  const candidate = arg("--candidate") ? selectCandidate(true) : null;
  if (candidate && candidate.id !== meta.candidate.id) fail(`Results were recorded against candidate ${meta.candidate.id}, not ${candidate.id}; not scored`);
  let summary;
  try { summary = summarize(meta, records); } catch (e) { fail(`Not scored: ${e.message}`); }
  const text = JSON.stringify(summary, null, 2) + "\n", file = path.join(dir, "summary.json");
  if (fs.existsSync(file)) {
    if (fs.readFileSync(file, "utf8") !== text) fail("summary.json differs from a re-score of the same records: the records or the summary were changed", 1);
    console.log("REPRODUCED summary.json from the recorded files");
  } else fs.writeFileSync(file, text, { flag: "wx" });
  return summary;
}
// Two arms compare only when everything but the arm is identical: fixture, snapshot, prompt, provider,
// CLI, model, effort, candidate, isolation profile and tool policy. Descriptive deltas only.
function compare(a, b) {
  const [ma, mb] = [loadRun(a), loadRun(b)];
  if (ma.arm !== "baseline" || mb.arm !== "chayen") fail("--compare <baseline results dir> <chayen results dir>");
  if (pairKey(ma) !== pairKey(mb)) {
    const fields = ["task", "sourceFixture", "sourceCommit", "promptSha256", "provider", "cliVersion", "modelConfig", "effort", "candidate", "isolation", "toolPolicy"].filter((k) => JSON.stringify(k === "candidate" ? ma[k]?.id : k === "isolation" ? ma[k]?.profileSha256 : ma[k]) !== JSON.stringify(k === "candidate" ? mb[k]?.id : k === "isolation" ? mb[k]?.profileSha256 : mb[k]));
    fail(`Not comparable: the arms differ in ${fields.join(", ")}`);
  }
  let sa, sb;
  try { sa = summarize(ma, readRecords(a)); sb = summarize(mb, readRecords(b)); } catch (e) { fail(`Not compared: ${e.message}`); }
  const d = (f) => (f(sa) === null || f(sb) === null ? null : +(f(sb) - f(sa)).toFixed(4));
  console.log(JSON.stringify({ baseline: sa, chayen: sb, deltaChayenMinusBaseline: { verificationPassed: d((s) => s.verificationPassed.value), medianSeconds: d((s) => s.medianSeconds), costUsd: d((s) => s.costUsd), medianEditActions: d((s) => s.medianEditActions) }, note: "Descriptive only: no significance claim. Task grades come from Step 17." }, null, 2));
}

function inspectHost() {
  const line = (status, text) => console.log(`${status.padEnd(9)}${text}`);
  line("INFO", `host ${process.platform} ${os.release()}, Node.js ${process.version}`);
  for (const p of REAL_PROVIDERS) line("INFO", `${p} CLI ${onPath(p) ? "on PATH (not started; a run uses the CLI inside the container image)" : "not on PATH"}`);
  for (const t of ["bwrap", "sandbox-exec", "wsl"]) line("INFO", `${t} ${onPath(t) ? "present" : "absent"} (not used: the runner accepts only a probed container boundary)`);
  let reachable = false;
  for (const e of ["docker", "podman"]) {
    const engine = resolveEngine(e);
    if (!engine) { line("INFO", `${e} not on PATH`); continue; }
    const s = engineStatus(e, engine);
    reachable ||= s.ok;
    line(s.ok ? "INFO" : "BLOCKED", s.ok ? `${s.version} reachable` : s.error);
  }
  const iso = arg("--isolation");
  if (iso) {
    let profile;
    try { profile = loadIsolationProfile(path.resolve(iso), { repo }); } catch (e) { blocked(e.message); }
    const scratch = tmp("inspect"), ws = path.join(scratch, "workspace"), home = path.join(scratch, "home"), n = nonce(), canary = `OUTSIDE-CANARY-${n}`;
    fs.mkdirSync(ws); fs.mkdirSync(home); fs.writeFileSync(path.join(scratch, canary), n);
    let r;
    try { r = checkIsolation(profile, { engine: resolveEngine(profile.engine), workspace: ws, home, nonce: n, canaryName: canary }); } finally { rm(scratch); }
    if (r.status !== "VERIFIED") blocked(`isolation profile ${profile.sha256.slice(0, 16)}:\n  ${r.errors.join("\n  ")}`);
    line("VERIFIED", `isolation profile ${profile.sha256.slice(0, 16)}: ${r.engineVersion}, image ${r.imageDigest.slice(0, 19)}…, uid ${r.probe.uid}, mounts ${r.probe.mounts.join(", ")}, egress to ${profile.egress.deniedProbe} denied`);
    console.log("Write-capable coding runs may use this profile once the owner authorizes them. No provider was started.");
    return;
  }
  blocked(reachable ? "a container engine is reachable, but no isolation profile was verified: write-capable coding runs stay BLOCKED until --inspect-host --isolation <profile> reports VERIFIED" : "no verified isolation backend on this host: no reachable Linux container engine, so write-capable coding runs stay BLOCKED");
}

function preflight() {
  const ctx = gate({ live: false });
  const { isolation } = verifyBoundary(ctx);
  console.log(`PASS  candidate ${ctx.candidate.id} (${ctx.candidate.qualification}) describes this checkout`);
  console.log(`PASS  ${ctx.provider} ${ctx.arm} home: ${ctx.arm === "chayen" ? `one installed chayen package ${ctx.packageFingerprint.slice(0, 16)}` : "no chayen package installed"}`);
  console.log(`PASS  task ${ctx.task.id}: source fixture ${taskFingerprint(ctx.taskDir).repoSha256.slice(0, 16)}`);
  console.log(`${isolation.verified ? "PASS" : "LABEL"}  isolation ${isolation.backend}${isolation.verified ? `: ${isolation.note}` : ": no isolation (fake provider only)"}`);
  console.log("PASS  preflight; no provider CLI was started and nothing was sent");
}

function plan() {
  const ids = arg("--task") ? [arg("--task")] : fs.readdirSync(TASKS).filter((d) => fs.existsSync(path.join(TASKS, d, "task.json"))).sort();
  const runs = Number(arg("--runs", "3"));
  if (!Number.isInteger(runs) || runs < 1 || runs > 5) fail("--runs must be 1..5");
  let total = 0, usd = 0;
  for (const id of ids) {
    const dir = path.join(TASKS, id);
    if (!fs.existsSync(path.join(dir, "task.json"))) fail(`unknown task ${id}`);
    const t = loadTaskDir(dir), fp = taskFingerprint(dir);
    for (const p of REAL_PROVIDERS) for (const a of ARMS) {
      total += runs; if (p === "claude") usd += runs * CODING_COST_PLANNING_USD;
      console.log(`PLAN  ${t.id.padEnd(26)} ${p.padEnd(7)} ${a.padEnd(8)} ${runs} run(s)${p === "claude" ? `  ~$${(runs * CODING_COST_PLANNING_USD).toFixed(2)} (planning assumption)` : ""}  fixture ${fp.repoSha256.slice(0, 12)}  NOT_RUN`);
    }
  }
  console.log(`PLAN  total ${total} provider invocation(s), Claude ~$${usd.toFixed(2)} at the planning assumption; every real run is NOT_RUN until the owner authorizes it and an isolation profile verifies; nothing was created or sent`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  if (has("--inspect-host")) inspectHost();
  else if (has("--plan")) plan();
  else if (has("--preflight")) preflight();
  else if (arg("--score")) console.log(JSON.stringify(score(path.resolve(arg("--score"))), null, 2));
  else if (has("--compare")) { const i = argv.indexOf("--compare"); compare(path.resolve(argv[i + 1] ?? ""), path.resolve(argv[i + 2] ?? "")); }
  else live();
}
