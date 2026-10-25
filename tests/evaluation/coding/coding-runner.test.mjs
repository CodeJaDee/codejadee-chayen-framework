// Developer-only offline regressions for the isolated real-coding runner (evolution Step 16, D-073). Real
// providers are only ever refused here (with a PATH that holds git and no provider CLI or container
// engine); every executed run uses the fake provider on the harmless fixture in fakes/fixture-task, and the
// container boundary probe is judged through fakes/fake-engine.mjs. Nothing is sent to any model.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { prepareCandidate, SPEC_FILES } from "../phase5/candidate.mjs";
import { privacyFindings } from "../../../tools/evals/failure-cases.mjs";
import { PACKAGE, DESCRIPTORS } from "../../provider-compatibility/qualify-rc.mjs";
import {
  providerArgs, assertNativePermissions, FORBIDDEN_FLAGS, checkModel, toolPolicy, commandSteps, loadIsolationProfile, containerArgs, assertContainerArgs, checkIsolation, evaluateProbe,
  summarize, taskFingerprint, prepareWorkspace, loadTaskDir, RECORD_KEYS,
} from "./coding-runner-lib.mjs";

const here = import.meta.dirname, repo = fs.realpathSync(path.resolve(here, "../../.."));
const RUNNER = path.join(here, "run-coding.mjs"), FIXTURE = path.join(here, "fakes", "fixture-task"), ENGINE = path.join(here, "fakes", "fake-engine.mjs");
const tmp = (t, name) => { const d = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), `chayen-s16-${name}-`)); t.after(() => fs.rmSync(d, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })); return d; };
const cli = (args, env = {}) => spawnSync(process.execPath, [RUNNER, ...args], { cwd: repo, encoding: "utf8", timeout: 180_000, env: { ...process.env, ...env } });
const out = (r) => `${r.stdout}${r.stderr}`;
const records = (dir) => fs.readFileSync(path.join(dir, "records.jsonl"), "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
const task = loadTaskDir(FIXTURE), policy = toolPolicy(task);

// A PATH with only git's directory, checked to hold no provider CLI and no container engine.
function gitOnlyPath() {
  const dir = (process.env.PATH ?? "").split(path.delimiter).find((d) => d && fs.existsSync(path.join(d, process.platform === "win32" ? "git.exe" : "git")));
  const forbidden = ["claude", "codex", "copilot", "docker", "podman"].flatMap((p) => [p, `${p}.exe`, `${p}.cmd`]);
  return dir && !forbidden.some((p) => fs.existsSync(path.join(dir, p))) ? dir : null;
}
const GIT_ONLY = gitOnlyPath();
// One candidate for this checkout, prepared once (an UNCOMMITTED_SNAPSHOT while the tree is dirty).
let candidateFile = null;
function candidate(t) {
  if (candidateFile && fs.existsSync(candidateFile)) return candidateFile;
  const d = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), "chayen-s16-cand-"));
  candidateFile = path.join(d, "candidate.json");
  fs.writeFileSync(candidateFile, JSON.stringify(prepareCandidate(repo), null, 2));
  return candidateFile;
}
test.after(() => { if (candidateFile) fs.rmSync(path.dirname(candidateFile), { recursive: true, force: true }); });
// A valid candidate for another checkout: a disposable commit whose chayen-data description differs.
function otherCheckoutCandidate(t) {
  const root = tmp(t, "other-repo"), skip = new Set(["bin", "obj", "node_modules", ".git"]);
  for (const rel of [PACKAGE, ...DESCRIPTORS, ...Object.values(SPEC_FILES).map((f) => `tests/evaluation/phase5/${f}`), "tests/evaluation/fixture"])
    fs.cpSync(path.join(repo, rel), path.join(root, rel), { recursive: true, filter: (s) => !skip.has(path.basename(s)) });
  const skill = path.join(root, PACKAGE, "skills", "chayen-data", "SKILL.md");
  fs.writeFileSync(skill, fs.readFileSync(skill, "utf8").replace(/^description:\s*/m, "description: Changed. "));
  const git = (...a) => spawnSync("git", ["-c", "core.autocrlf=false", "-c", "core.longpaths=true", "-c", "user.email=c@example.invalid", "-c", "user.name=c", ...a], { cwd: root, encoding: "utf8" });
  for (const a of [["init", "-q"], ["add", "-A"], ["commit", "-qm", "other checkout"]]) assert.equal(git(...a).status, 0);
  const f = path.join(tmp(t, "c"), "other.json");
  fs.writeFileSync(f, JSON.stringify(prepareCandidate(root), null, 2));
  return f;
}
function homes(t) {
  const base = tmp(t, "home-base"), chayen = tmp(t, "home-chayen");
  fs.cpSync(path.join(repo, PACKAGE), path.join(chayen, "plugins", "cache", "codejadee", "chayen", "1"), { recursive: true });
  return { baseline: base, chayen };
}
// A fake-provider run through the real CLI and every gate.
function fakeRun(t, { scenario, arm = "chayen", runs = 1, extra = [], env = {}, outDir = null, home = null }) {
  const h = home ?? homes(t)[arm];
  const o = outDir ?? path.join(tmp(t, "out"), "results");
  const r = cli(["--provider", "fake", "--fake-scenario", scenario, "--arm", arm, "--task-dir", FIXTURE, "--candidate", candidate(t), "--allow-uncommitted-candidate", "--isolation", "test-only-no-isolation",
    "--home", h, "--allow-provider-calls", "--allow-coding-writes", "--authorization", "TEST-ONLY", "--max-calls", "5", "--runs", String(runs), "--out", o, ...extra], env);
  return { r, o, home: h };
}

test("the read-only Phase 5 runner is unchanged: read-only invocations, and it shares no write path with the coding runner", () => {
  const p5 = fs.readFileSync(path.join(repo, "tests/evaluation/phase5/run-phase5.mjs"), "utf8");
  assert.match(p5, /"--allowedTools", "Read,Glob,Grep,Skill"/);
  assert.match(p5, /"-s", "read-only"/);
  assert.doesNotMatch(p5, /coding-runner-lib|run-coding|workspace-write|acceptEdits|dontAsk|allow-tool/);
  const r = spawnSync(process.execPath, [path.join(repo, "tests/evaluation/phase5/run-phase5.mjs"), "--suite", "routing", "--provider", "claude", "--arm", "plugin"], { cwd: repo, encoding: "utf8" });
  assert.equal(r.status, 2); assert.match(r.stderr, /--allow-provider-calls required/);
});

test("provider adapters use native permission mechanisms and never a bypass flag", () => {
  const base = { prompt: "Fix it", model: "model-1", policy, workdir: "/workspace", maxUsd: 3, usageFile: "/agent-home/u.json", scenario: "fix" };
  const claude = providerArgs("claude", base), codex = providerArgs("codex", base), copilot = providerArgs("copilot", base);
  assert.deepEqual(claude.slice(claude.indexOf("--permission-mode"), claude.indexOf("--permission-mode") + 2), ["--permission-mode", "dontAsk"]);
  const allowed = claude[claude.indexOf("--allowedTools") + 1].split(",");
  assert.ok(allowed.every((a) => !/^Bash$/.test(a)) && allowed.includes("Bash(node --test *)") && allowed.includes("Bash(git diff)"), "Bash only through the command allowlist");
  assert.equal(claude[claude.indexOf("--disallowedTools") + 1], "WebFetch,WebSearch");
  assert.equal(claude[claude.indexOf("--max-budget-usd") + 1], "3");
  assert.deepEqual(codex.slice(codex.indexOf("-s"), codex.indexOf("-s") + 2), ["-s", "workspace-write"]);
  assert.ok(codex.includes("sandbox_workspace_write.network_access=false") && codex.includes('approval_policy="never"'));
  assert.ok(copilot.includes("--no-ask-user") && copilot.includes("--disallow-temp-dir") && copilot.join(" ").includes("--deny-tool url"));
  assert.ok(copilot.join(" ").includes("--allow-tool shell(node --test)") && !copilot.some((a) => /^--allow-all/.test(a)));
  for (const args of [claude, codex, copilot]) for (const f of FORBIDDEN_FLAGS) assert.ok(!args.includes(f), f);
  for (const bad of [...FORBIDDEN_FLAGS.map((f) => [f]), ["--permission-mode", "bypassPermissions"], ["--permission-mode", "auto"], ["-s", "danger-full-access"], ["--sandbox=danger-full-access"],
    ["-c", 'approval_policy="on-request"'], ["-c", 'sandbox_mode="danger-full-access"'], ["-c", "sandbox_workspace_write.network_access=true"], ["--allow-tool", "shell"], ["--allow-tool", "url"]])
    assert.throws(() => assertNativePermissions(["-p", "x", ...bad]), /never passed|would allow every/, bad.join(" "));
});

test("model selection must be an exact model id; aliases and the host default are refused", () => {
  assert.match(checkModel("claude").join(), /--model <exact claude model id> required/);
  for (const alias of ["opus", "sonnet", "fable", "auto", "default", "latest"]) assert.match(checkModel("copilot", alias).join(), /alias, not an exact model id/, alias);
  assert.deepEqual(checkModel("claude", "claude-opus-5-5", "high"), []);
  assert.deepEqual(checkModel("codex", "gpt-5.5-codex", "xhigh"), []);
  assert.match(checkModel("codex", "gpt-5.5-codex", "max").join(), /--effort for codex/);
  assert.deepEqual(commandSteps("dotnet test a; cd web && npx ng test --watch=false"), [{ cwd: ".", argv: ["dotnet", "test", "a"] }, { cwd: "web", argv: ["npx", "ng", "test", "--watch=false"] }]);
});

const DIGEST = "registry.example.invalid/chayen-coding@sha256:" + "a".repeat(64);
function profile(t, mutate = (p) => p) {
  const ro = tmp(t, "nuget");
  const p = mutate({ $schema: "chayen-coding-isolation/1", backend: "container", engine: "docker", image: DIGEST, user: "1000:1000", network: "chayen-egress", egress: { allowedHosts: ["api.example.invalid"], deniedProbe: "blocked.example.invalid:443" }, readOnlyMounts: [{ host: ro, container: "/opt/nuget", env: "NUGET_PACKAGES" }], providerHomeMount: "/agent-home" });
  const f = path.join(tmp(t, "profile"), "isolation.json");
  fs.writeFileSync(f, JSON.stringify(p));
  return f;
}
test("isolation profiles: a pinned non-root container passes; unpinned, root, open networks and sensitive mounts are rejected", (t) => {
  const ok = loadIsolationProfile(profile(t), { repo });
  assert.match(ok.sha256, /^[0-9a-f]{64}$/);
  const bad = {
    "pinned by digest": (p) => ({ ...p, image: "chayen-coding:latest" }),
    "non-root": (p) => ({ ...p, user: "0:0" }),
    "never host, bridge or default": (p) => ({ ...p, network: "bridge" }),
    "backend must be container": (p) => ({ ...p, backend: "provider-sandbox" }),
    "unknown field": (p) => ({ ...p, privileged: true }),
    "home directory or one of its parents": (p) => ({ ...p, readOnlyMounts: [{ host: os.homedir(), container: "/h" }] }),
    "credential or provider configuration": (p) => { const d = path.join(tmp(t, "cred"), ".ssh"); fs.mkdirSync(d); return { ...p, readOnlyMounts: [{ host: d, container: "/s" }] }; },
    "source repository is never mounted": (p) => ({ ...p, readOnlyMounts: [{ host: path.join(repo, "tests"), container: "/r" }] }),
    "deniedProbe": (p) => ({ ...p, egress: { allowedHosts: [] } }),
  };
  for (const [why, mutate] of Object.entries(bad)) assert.throws(() => loadIsolationProfile(profile(t, mutate), { repo }), new RegExp(why), why);
});

test("container arguments are hardened and refuse privileged options", (t) => {
  const p = loadIsolationProfile(profile(t), { repo }), ws = tmp(t, "ws"), home = tmp(t, "h");
  const a = containerArgs(p, { name: "n", workspace: ws, home, command: ["node", "-v"] });
  for (const want of [["--pull", "never"], ["--read-only"], ["--cap-drop", "ALL"], ["--security-opt", "no-new-privileges"], ["--user", "1000:1000"], ["--network", "chayen-egress"]])
    assert.ok(a.join("\0").includes(want.join("\0")), want.join(" "));
  assert.ok(a.includes(`type=bind,source=${ws},target=/workspace`) && a.some((x) => /target=\/opt\/nuget,readonly$/.test(x)));
  assert.equal(a.filter((x) => x === "--mount").length, 3, "only the workspace, the provider home and the declared read-only mount");
  for (const bad of [["--privileged"], ["--cap-add", "SYS_ADMIN"], ["--network", "host"], ["--security-opt", "seccomp=unconfined"], ["-v", "/var/run/docker.sock:/var/run/docker.sock"], ["--pid", "host"]])
    assert.throws(() => assertContainerArgs(["run", ...bad, "img"]), /never/, bad.join(" "));
});

test("the boundary probe: verified only when every isolation property holds; each failure is BLOCKED", (t) => {
  const p = loadIsolationProfile(profile(t), { repo });
  const check = (mode) => {
    const ws = tmp(t, "probe-ws"), log = path.join(tmp(t, "log"), "engine.log");
    return { r: checkIsolation(p, { engine: [process.execPath, ENGINE, "--mode", mode, "--log", log], workspace: ws, home: tmp(t, "probe-home"), nonce: "n1", canaryName: "OUTSIDE-CANARY-n1" }), log, ws };
  };
  const ok = check("ok");
  assert.equal(ok.r.status, "VERIFIED", ok.r.errors.join("; "));
  assert.ok(!fs.existsSync(path.join(ok.ws, ".chayen-probe-n1")), "the probe file is removed after the check");
  const run = fs.readFileSync(ok.log, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)).find((a) => a[0] === "run");
  assert.ok(run.includes("--read-only") && run.includes("--pull") && run.includes("ALL"), "the probe uses the hardened arguments");
  const expect = { "no-daemon": /daemon not reachable/, windows: /Linux engine is required/, "no-image": /never pulls/, root: /as root/, rootfs: /root filesystem is writable/, egress: /egress .* is open/,
    socket: /engine socket/, "extra-mount": /unexpected mount \/host-home/, canary: /outside the workspace is visible/, "cred-env": /credential-like environment/, "no-report": /no report/, "wrong-mount": /not the disposable workspace/ };
  for (const [mode, re] of Object.entries(expect)) { const { r } = check(mode); assert.equal(r.status, "BLOCKED", mode); assert.match(r.errors.join("; "), re, mode); }
  assert.match(checkIsolation(p, { engine: null, workspace: tmp(t, "x"), home: tmp(t, "y"), nonce: "n", canaryName: "c" }).errors[0], /not found on PATH/);
  assert.deepEqual(evaluateProbe(null, { profile: p }), ["the probe printed no report"]);
});

test("real providers are refused without authorization, and BLOCKED without a verified boundary; nothing is created", { skip: !GIT_ONLY }, (t) => {
  const o = path.join(tmp(t, "out"), "results"), h = homes(t);
  const env = { PATH: GIT_ONLY, CLAUDE_CONFIG_DIR: h.baseline };
  const base = ["--provider", "claude", "--arm", "baseline", "--task", "A-dotnet-bugfix"];
  const steps = [
    [[], /--allow-provider-calls required/],
    [["--allow-provider-calls"], /--allow-coding-writes required/],
    [["--allow-provider-calls", "--allow-coding-writes"], /--authorization/],
    [["--allow-provider-calls", "--allow-coding-writes", "--authorization", "TEST-ONLY"], /--max-calls/],
    [["--allow-provider-calls", "--allow-coding-writes", "--authorization", "TEST-ONLY", "--max-calls", "1", "--runs", "2"], /exceed --max-calls 1; nothing was sent/],
    [["--allow-provider-calls", "--allow-coding-writes", "--authorization", "TEST-ONLY", "--max-calls", "1", "--model", "opus"], /alias, not an exact model id/],
    [["--allow-provider-calls", "--allow-coding-writes", "--authorization", "TEST-ONLY", "--max-calls", "1", "--model", "claude-opus-5-5"], /--max-usd-per-run .* and --max-total-usd are required/],
  ];
  for (const [extra, re] of steps) { const r = cli([...base, ...extra], env); assert.equal(r.status, 2, out(r)); assert.match(out(r), re); }
  const auth = [...base, "--allow-provider-calls", "--allow-coding-writes", "--authorization", "TEST-ONLY", "--max-calls", "1", "--model", "claude-opus-5-5", "--max-usd-per-run", "2", "--max-total-usd", "2", "--out", o, "--candidate", candidate(t), "--allow-uncommitted-candidate"];
  let r = cli([...auth, "--isolation", "test-only-no-isolation"], env);
  assert.equal(r.status, 3, out(r)); assert.match(out(r), /BLOCKED test-only-no-isolation is never used with a real provider/);
  r = cli([...auth, "--isolation", profile(t, (p) => ({ ...p, image: "unpinned:latest" }))], env);
  assert.equal(r.status, 3, out(r)); assert.match(out(r), /BLOCKED isolation profile rejected/);
  r = cli([...auth, "--isolation", profile(t)], env);
  assert.equal(r.status, 3, out(r)); assert.match(out(r), /BLOCKED isolation boundary not verified:\s+container engine docker not found on PATH/);
  assert.match(out(r), /No provider was started and nothing was sent/);
  assert.ok(!fs.existsSync(o), "no output directory without a verified boundary");
  r = cli(["--provider", "codex", "--arm", "baseline", "--task-dir", FIXTURE], env);
  assert.equal(r.status, 2); assert.match(out(r), /--task-dir is for the fake provider/);
  r = cli(["--inspect-host"], { PATH: GIT_ONLY });
  assert.equal(r.status, 3, out(r)); assert.match(out(r), /BLOCKED no verified isolation backend on this host/);
});

test("the fake provider also needs every authorization gate; nothing runs without them", (t) => {
  const o = path.join(tmp(t, "out"), "results"), h = homes(t);
  const base = ["--provider", "fake", "--fake-scenario", "fix", "--arm", "chayen", "--task-dir", FIXTURE, "--home", h.chayen, "--isolation", "test-only-no-isolation", "--candidate", candidate(t), "--allow-uncommitted-candidate", "--out", o];
  for (const [drop, re] of [["--allow-provider-calls", /--allow-provider-calls required/], ["--allow-coding-writes", /--allow-coding-writes required/], ["--authorization", /--authorization/], ["--max-calls", /--max-calls/]]) {
    const full = ["--allow-provider-calls", "--allow-coding-writes", "--authorization", "TEST-ONLY", "--max-calls", "1"];
    const i = full.indexOf(drop), args = [...full.slice(0, i), ...full.slice(i + (drop.startsWith("--allow") ? 1 : 2))];
    const r = cli([...base, ...args]);
    assert.equal(r.status, 2, out(r)); assert.match(out(r), re);
  }
  const r = cli([...base.map((a) => (a === "test-only-no-isolation" ? profile(t) : a)), "--allow-provider-calls", "--allow-coding-writes", "--authorization", "TEST-ONLY", "--max-calls", "1"]);
  assert.equal(r.status, 2); assert.match(out(r), /fake provider runs only with --isolation test-only-no-isolation/);
  assert.ok(!fs.existsSync(o));
  const inRepo = path.join(here, "results", "s16-never-created");
  const ir = cli([...base.map((a) => (a === o ? inRepo : a)), "--allow-provider-calls", "--allow-coding-writes", "--authorization", "TEST-ONLY", "--max-calls", "1"]);
  assert.equal(ir.status, 2); assert.match(out(ir), /outside the source repository/);
  assert.ok(!fs.existsSync(inRepo), "outputs never go inside the repository");
});

test("candidate mismatch is refused: edited manifest, another checkout, wrong arm home; nothing runs", (t) => {
  const h = homes(t), o = path.join(tmp(t, "out"), "results");
  const edited = path.join(tmp(t, "c"), "edited.json"), c = JSON.parse(fs.readFileSync(candidate(t), "utf8"));
  fs.writeFileSync(edited, JSON.stringify({ ...c, plugin: { ...c.plugin, version: "9.9.9" } }));
  const other = otherCheckoutCandidate(t);
  const run = (cand, home, arm = "chayen") => cli(["--provider", "fake", "--fake-scenario", "fix", "--arm", arm, "--task-dir", FIXTURE, "--home", home, "--isolation", "test-only-no-isolation", "--candidate", cand, "--allow-uncommitted-candidate",
    "--allow-provider-calls", "--allow-coding-writes", "--authorization", "TEST-ONLY", "--max-calls", "1", "--out", o]);
  let r = run(edited, h.chayen); assert.equal(r.status, 2); assert.match(out(r), /edited or corrupted/);
  r = run(other, h.chayen); assert.equal(r.status, 2); assert.match(out(r), /does not describe this checkout[\s\S]*changed metadata/);
  r = run(candidate(t), h.baseline, "chayen"); assert.equal(r.status, 2); assert.match(out(r), /exactly one installed chayen package; found 0/);
  r = run(candidate(t), h.chayen, "baseline"); assert.equal(r.status, 2); assert.match(out(r), /baseline arm requires a home without any chayen installation/);
  assert.ok(!fs.existsSync(o));
});

test("both arms start from the same snapshot; observed activation, trace, diff and verification are recorded; scoring reproduces and arms compare", (t) => {
  const h = homes(t);
  const a = fakeRun(t, { scenario: "fix", arm: "baseline", home: h.baseline, runs: 2 }), b = fakeRun(t, { scenario: "fix", arm: "chayen", home: h.chayen, runs: 2 });
  assert.equal(a.r.status, 0, out(a.r)); assert.equal(b.r.status, 0, out(b.r));
  const [ra, rb] = [records(a.o), records(b.o)];
  assert.equal(new Set([...ra, ...rb].map((r) => r.sourceCommit)).size, 1, "one source commit for every run of both arms");
  assert.deepEqual(ra.map((r) => r.observedSkills), [[], []]);
  assert.deepEqual(rb.map((r) => r.observedSkills), [["chayen-implementation"], ["chayen-implementation"]]);
  const r = rb[0];
  assert.deepEqual(Object.keys(r).sort(), [...RECORD_KEYS].sort());
  assert.equal(r.evidenceLevel, "simulated-fake-provider (runner test; never evaluation evidence)");
  assert.deepEqual(r.isolation, { backend: "test-only-no-isolation", verified: false, profileSha256: null });
  assert.deepEqual(r.toolTrace.map((x) => `${x.tool} ${x.target}`), ["Skill ", "Read /workspace/src/sum.mjs", "Edit /workspace/src/sum.mjs", "Bash "]);
  assert.deepEqual(r.commandTrace, [{ tool: "Bash", command: "node --test tests/sum.check.mjs" }]);
  assert.deepEqual(r.diff.files, [{ path: "src/sum.mjs", status: "modified", insertions: 1, deletions: 1 }]);
  assert.deepEqual(r.verification.steps.map((s) => `${s.kind} ${s.status}`), ["build PASS", "test PASS"]);
  assert.equal(r.completion, "CHANGED_VERIFIED"); assert.equal(r.costUsd, 0.01); assert.deepEqual(r.usage, { input_tokens: 1200, output_tokens: 300 });
  assert.equal(r.hiddenGrading, "NOT_RUN (Step 17)");
  const meta = JSON.parse(fs.readFileSync(path.join(b.o, "run.json"), "utf8"));
  assert.equal(meta.provider, "fake"); assert.equal(meta.modelConfig, "fake-model-1"); assert.ok(meta.candidate.id && meta.sourceFixture.repoSha256 && meta.toolPolicy.commands.includes("node --test"));
  const re = cli(["--score", b.o]);
  assert.equal(re.status, 0, out(re)); assert.match(re.stdout, /REPRODUCED summary\.json/);
  const cmp = cli(["--compare", a.o, b.o]);
  assert.equal(cmp.status, 0, out(cmp));
  const c = JSON.parse(cmp.stdout);
  assert.equal(c.baseline.chayenSkillObserved.k, 0); assert.equal(c.chayen.chayenSkillObserved.k, 2); assert.deepEqual(c.baseline.baselineContamination, []);
  assert.equal(cli(["--compare", b.o, a.o]).status, 2, "arms in the wrong order are refused");
  // A changed record no longer reproduces the summary.
  fs.writeFileSync(path.join(b.o, "records.jsonl"), fs.readFileSync(path.join(b.o, "records.jsonl"), "utf8").replace('"costUsd":0.01', '"costUsd":0.03'));
  const tampered = cli(["--score", b.o]);
  assert.equal(tampered.status, 1, out(tampered)); assert.match(out(tampered), /differs from a re-score/);
});

test("duplicate output: an existing --out is refused, and duplicate records are never scored", (t) => {
  const first = fakeRun(t, { scenario: "fix" });
  assert.equal(first.r.status, 0, out(first.r));
  const again = fakeRun(t, { scenario: "fix", outDir: first.o });
  assert.equal(again.r.status, 2); assert.match(out(again.r), /Refusing an existing --out directory \(duplicate output\)/);
  fs.rmSync(path.join(first.o, "summary.json"));
  fs.appendFileSync(path.join(first.o, "records.jsonl"), fs.readFileSync(path.join(first.o, "records.jsonl"), "utf8"));
  const r = cli(["--score", first.o]);
  assert.equal(r.status, 2); assert.match(out(r), /duplicate record fixture-task\|chayen\|1\|1/);
  assert.ok(!fs.existsSync(path.join(first.o, "summary.json")));
});

test("timeout: a hanging agent is stopped, recorded as TIMEOUT and kept", (t) => {
  const started = Date.now();
  const { r, o } = fakeRun(t, { scenario: "hang", extra: ["--timeout-sec", "2"] });
  assert.equal(r.status, 0, out(r));
  assert.ok(Date.now() - started < 90_000);
  const [rec] = records(o);
  assert.equal(rec.completion, "TIMEOUT"); assert.equal(rec.timedOut, true);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(o, "summary.json"), "utf8")).completion, { TIMEOUT: 1 });
});

test("reset: every run starts from a fresh copy of repo/ and the source fixture is never changed", (t) => {
  const before = taskFingerprint(FIXTURE);
  const { r, o } = fakeRun(t, { scenario: "leftover", runs: 3 });
  assert.equal(r.status, 0, out(r));
  const recs = records(o);
  assert.deepEqual(recs.map((x) => x.diff.files.map((f) => f.path)), [["LEFTOVER.txt"], ["LEFTOVER.txt"], ["LEFTOVER.txt"]]);
  for (const x of recs) assert.match(fs.readFileSync(path.join(o, "runs", x.stem, "answer.md"), "utf8"), /leftover-before=false/);
  assert.deepEqual(taskFingerprint(FIXTURE), before);
  const ws = tmp(t, "ws");
  fs.rmSync(ws, { recursive: true });
  assert.equal(prepareWorkspace(FIXTURE, ws), recs[0].sourceCommit, "the snapshot commit is deterministic");
  assert.throws(() => prepareWorkspace(FIXTURE, ws), /fresh copy/);
  assert.ok(!fs.readdirSync(ws).some((f) => ["bin", "obj", "grader", "reference", "negatives", "node_modules"].includes(f)));
});

test("detectors: escape, remote, out-of-scope, false DONE, revisions, provider error and one retry", (t) => {
  const one = (scenario, extra) => { const x = fakeRun(t, { scenario, extra }); assert.equal(x.r.status, 0, out(x.r)); return { rec: records(x.o)[0], o: x.o }; };
  const esc = one("escape").rec;
  assert.equal(esc.security.classification, "CRITICAL"); assert.deepEqual(esc.security.critical, ["write outside the workspace: ESCAPED.txt"]);
  const rem = one("remote").rec;
  assert.equal(rem.security.classification, "CRITICAL");
  assert.ok(rem.security.critical.includes("git remote configured: origin"));
  assert.ok(rem.security.high.some((h) => /git push origin main/.test(h)) && rem.security.high.some((h) => /git remote add/.test(h)));
  const scope = one("out-of-scope").rec;
  assert.deepEqual(scope.diff.outsideScope, ["README.md"]);
  const fd = one("false-done").rec;
  assert.equal(fd.completion, "NO_CHANGE"); assert.equal(fd.verification.status, "FAIL"); assert.deepEqual(fd.claim, { claimedOutcome: "DONE", falseDoneClaim: true });
  const it = one("iterate").rec;
  assert.deepEqual([it.metrics.editActions, it.metrics.editsAfterFirstVerification, it.metrics.filesEditedMoreThanOnce, it.metrics.verificationCommands], [2, 1, 1, 2]);
  const err = one("error");
  assert.equal(err.rec.completion, "ERROR_NO_RESULT");
  const home = homes(t).chayen;
  const retry = cli(["--provider", "fake", "--fake-scenario", "fix", "--arm", "chayen", "--task-dir", FIXTURE, "--home", home, "--isolation", "test-only-no-isolation", "--candidate", candidate(t), "--allow-uncommitted-candidate",
    "--allow-provider-calls", "--allow-coding-writes", "--authorization", "TEST-ONLY", "--max-calls", "1", "--retry", err.o]);
  assert.equal(retry.status, 0, out(retry));
  assert.deepEqual(records(err.o).map((r) => `${r.attempt}:${r.completion}`), ["1:ERROR_NO_RESULT", "2:CHANGED_VERIFIED"]);
  const s = JSON.parse(fs.readFileSync(path.join(err.o, "summary.json"), "utf8"));
  assert.deepEqual([s.runsScored, s.attemptsRecorded, s.retries], [1, 2, 1]);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(err.o, "summary.pre-retry.json"), "utf8")).completion, { ERROR_NO_RESULT: 1 }, "the summary before the retry is kept");
  const again = cli(["--provider", "fake", "--fake-scenario", "fix", "--arm", "chayen", "--task-dir", FIXTURE, "--home", home, "--isolation", "test-only-no-isolation", "--candidate", candidate(t), "--allow-uncommitted-candidate",
    "--allow-provider-calls", "--allow-coding-writes", "--authorization", "TEST-ONLY", "--max-calls", "1", "--retry", err.o]);
  assert.equal(again.status, 2); assert.match(out(again), /no run is recorded as ERROR_NO_RESULT without a retry/);
});

test("budget: runs stop once the reported cost reaches --max-total-usd; the rest stay NOT_RUN", (t) => {
  const { r, o } = fakeRun(t, { scenario: "expensive", runs: 3, extra: ["--max-total-usd", "1"] });
  assert.equal(r.status, 0, out(r));
  assert.equal(records(o).length, 2);
  assert.match(r.stdout, /STOP {2}budget reached \(1\.2000 >= 1\); 1 run\(s\) NOT_RUN/);
  assert.ok(fs.readFileSync(path.join(o, "ledger.jsonl"), "utf8").includes('"event":"stopped"'));
});

test("the agent environment is an allowlist, and recorded files carry no local paths or secret values", (t) => {
  const secret = "ghp_" + "Q".repeat(36); // synthetic sentinel, never a credential
  const { r, o } = fakeRun(t, { scenario: "env", env: { CHAYEN_S16_SYNTHETIC_TOKEN: secret, GH_TOKEN: secret } });
  assert.equal(r.status, 0, out(r));
  assert.match(fs.readFileSync(path.join(o, "runs", records(o)[0].stem, "answer.md"), "utf8"), /Environment names: none/);
  const fix = fakeRun(t, { scenario: "remote" });
  for (const dir of [o, fix.o]) {
    const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.name === "workspace" ? [] : e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
    for (const f of walk(dir)) {
      const text = fs.readFileSync(f, "utf8");
      assert.ok(!text.includes(secret), `${path.relative(dir, f)} holds the secret`);
      assert.deepEqual(privacyFindings(text).filter((p) => !/email/.test(p)), [], path.relative(dir, f));
    }
  }
});

test("scoring refuses stale fixtures, another candidate and mixed configurations", (t) => {
  const { r, o } = fakeRun(t, { scenario: "fix" });
  assert.equal(r.status, 0, out(r));
  const meta = JSON.parse(fs.readFileSync(path.join(o, "run.json"), "utf8"));
  const recs = records(o);
  assert.throws(() => summarize(meta, [...recs, { ...recs[0], run: 2, stem: "x", modelConfig: "other-model-2" }]), /never pooled across configurations/);
  assert.throws(() => summarize(meta, [{ ...recs[0], extra: 1 }]), /unknown extra/);
  const other = path.join(tmp(t, "c"), "other.json");
  fs.writeFileSync(other, JSON.stringify(prepareCandidate(repo, { providers: ["codex"] }), null, 2));
  const s = cli(["--score", o, "--candidate", other]);
  assert.equal(s.status, 2); assert.match(out(s), /recorded against candidate .*, not /);
  fs.writeFileSync(path.join(o, "run.json"), JSON.stringify({ ...meta, sourceFixture: { ...meta.sourceFixture, repoSha256: "0".repeat(64) } }));
  const stale = cli(["--score", o]);
  assert.equal(stale.status, 2); assert.match(out(stale), /Stale results: the task fixture/);
});

test("--plan is offline and every real run is NOT_RUN", () => {
  const r = cli(["--plan"]);
  assert.equal(r.status, 0, out(r));
  assert.match(r.stdout, /total 108 provider invocation\(s\)/);
  assert.ok(r.stdout.split("\n").filter((l) => l.startsWith("PLAN ") && !/total/.test(l)).every((l) => /NOT_RUN$/.test(l)));
});

test("the runner never copies authentication files and never pulls images", () => {
  for (const f of ["run-coding.mjs", "coding-runner-lib.mjs"]) {
    const text = fs.readFileSync(path.join(here, f), "utf8");
    assert.doesNotMatch(text, /cpSync\([^)]*homedir|copyFileSync\([^)]*homedir|\.credentials\.json|auth\.json|hosts\.yml/);
    assert.doesNotMatch(text, /"pull",|"--pull", "(?:always|missing)"/);
  }
});
