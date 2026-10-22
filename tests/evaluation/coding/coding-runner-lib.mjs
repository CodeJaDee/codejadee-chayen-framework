// Developer-only library for the isolated real-coding runner (evolution Step 16, D-073): provider adapters
// that use native permissions only, the isolation profile and its boundary probe, disposable workspaces,
// change capture, classification, the run-record format and offline scoring. Nothing here calls a provider;
// run-coding.mjs is the only caller that starts a process. Zero dependencies. Never shipped with the plugin.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { parseTranscript, rate, scrub } from "../phase5/phase5-lib.mjs";
import { lfFingerprint, HOME_ENV as PROVIDER_HOME_ENV } from "../phase5/candidate.mjs";
import { SECRET_PATTERNS } from "../../../tools/validate/secret-patterns.mjs";
import { parseAnswer, changes, matches } from "./run-coding-fixtures.mjs";

export const RUN_SCHEMA = "chayen-coding-run/1";
export const RECORD_SCHEMA = "chayen-coding-record/1";
export const SUMMARY_SCHEMA = "chayen-coding-summary/1";
export const ISOLATION_SCHEMA = "chayen-coding-isolation/1";
export const REAL_PROVIDERS = ["claude", "codex", "copilot"];
export const PROVIDERS = [...REAL_PROVIDERS, "fake"];
export const ARMS = ["baseline", "chayen"];
export const HOME_ENV = { ...PROVIDER_HOME_ENV, fake: "CHAYEN_FAKE_PROVIDER_HOME" };
// The only isolation the fake provider may use, and the only one a real provider may never use.
export const TEST_ONLY_ISOLATION = "test-only-no-isolation";
export const IGNORED = new Set([".git", "bin", "obj", "node_modules", "TestResults", ".grader", ".angular", "dist"]);
export const FAKE_AGENT = path.join(import.meta.dirname, "fakes", "fake-agent.mjs");
const SOURCE_DATE = "2026-01-01T00:00:00Z";

const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
const lf = (t) => String(t).replace(/\r\n/g, "\n");
const posix = (p) => p.split(path.sep).join("/");

// ---------- provider configuration ----------
const MODEL_ALIAS = /^(?:auto|default|best|latest|opus|sonnet|haiku|fable|opusplan|gpt|codex|mini)$/i;
export const EFFORTS = { claude: ["low", "medium", "high", "xhigh", "max"], codex: ["minimal", "low", "medium", "high", "xhigh"], copilot: ["none", "minimal", "low", "medium", "high", "xhigh", "max"], fake: ["low", "medium", "high"] };
export function checkModel(provider, model, effort) {
  const errors = [];
  if (!model) errors.push(`--model <exact ${provider} model id> required; the host default is not a pinned configuration`);
  else if (!/^[A-Za-z0-9][\w.:/-]{1,79}$/.test(model)) errors.push("--model must be a plain model identifier");
  else if (MODEL_ALIAS.test(model) || !/\d/.test(model)) errors.push(`--model ${model} is an alias, not an exact model id`);
  if (effort !== undefined && !EFFORTS[provider]?.includes(effort)) errors.push(`--effort for ${provider} must be one of ${EFFORTS[provider]?.join(", ")}`);
  return errors;
}

// The repository's own build and test commands, split into steps without a shell: `a; b` and `cd d && c`.
export function commandSteps(text) {
  const steps = [];
  for (const segment of String(text ?? "").split(";")) {
    let cwd = ".";
    for (const part of segment.split("&&")) {
      const argv = part.trim().split(/\s+/).filter(Boolean);
      if (!argv.length) continue;
      if (argv[0] === "cd" && argv.length === 2) { cwd = path.posix.join(cwd, argv[1]); continue; }
      steps.push({ cwd, argv });
    }
  }
  return steps;
}
// What the agent may do without asking: read and edit inside the workspace, the task's own build and test
// command prefixes, and read-only git. No web tools, no other commands.
export function toolPolicy(task) {
  const verify = [...new Set([...commandSteps(task.commands.build), ...commandSteps(task.commands.test)].map((s) => s.argv.slice(0, 2).join(" ")))].sort();
  return { read: true, edit: "workspace only", web: false, verifyCommands: verify, commands: [...new Set([...verify, "git status", "git diff", "git log"])].sort() };
}

// Native permission mechanisms only. Each provider gets edit rights inside its working directory, the
// command allowlist above, and no web access; anything else is denied by the provider, and the container
// boundary holds regardless of what the provider allows.
export function providerArgs(provider, { prompt, model, effort, policy, workdir, maxUsd, usageFile, scenario }) {
  let args;
  if (provider === "claude") {
    const allowed = ["Read", "Glob", "Grep", "Edit", "Write", "Skill", "TodoWrite", ...policy.commands.flatMap((c) => [`Bash(${c})`, `Bash(${c} *)`])];
    args = ["-p", prompt, "--output-format", "stream-json", "--verbose", "--no-session-persistence", "--setting-sources", "user", "--strict-mcp-config",
      "--permission-mode", "dontAsk", "--tools", "Read,Glob,Grep,Edit,Write,Bash,Skill,TodoWrite", "--allowedTools", allowed.join(","), "--disallowedTools", "WebFetch,WebSearch",
      "--max-budget-usd", String(maxUsd), "--model", model, ...(effort ? ["--effort", effort] : [])];
  } else if (provider === "codex") {
    args = ["exec", "--json", "--ephemeral", "-s", "workspace-write", "-C", workdir, "-m", model, "-c", 'approval_policy="never"', "-c", "sandbox_workspace_write.network_access=false",
      ...(effort ? ["-c", `model_reasoning_effort="${effort}"`] : []), prompt];
  } else if (provider === "copilot") {
    args = ["-p", prompt, "--output-format", "json", "--model", model, "--no-ask-user", "--no-auto-update", "--disable-builtin-mcps", "--disallow-temp-dir",
      "--allow-tool", "write", ...policy.commands.flatMap((c) => ["--allow-tool", `shell(${c})`]), "--deny-tool", "shell(git push)", "--deny-tool", "shell(git remote)", "--deny-tool", "url",
      ...(effort ? ["--reasoning-effort", effort] : []), ...(usageFile ? ["--usage-output-file", usageFile] : [])];
  } else if (provider === "fake") {
    args = [FAKE_AGENT, "--scenario", scenario, "--prompt", prompt];
  } else throw new Error(`Unknown provider ${provider}`);
  return assertNativePermissions(args);
}

// Flags that bypass, widen or auto-approve permissions. They are refused even if a future adapter adds them.
export const FORBIDDEN_FLAGS = ["--dangerously-skip-permissions", "--allow-dangerously-skip-permissions", "--dangerously-bypass-approvals-and-sandbox", "--dangerously-bypass-hook-trust",
  "--full-auto", "--yolo", "--allow-all", "--allow-all-tools", "--allow-all-paths", "--allow-all-urls", "--approve-for-me", "--assisted-approval", "--add-dir", "--plugin-dir", "--plugin-url", "--share-gist", "--remote-control"];
export function assertNativePermissions(args) {
  const value = (i) => (args[i].includes("=") ? args[i].slice(args[i].indexOf("=") + 1) : args[i + 1] ?? "");
  args.forEach((a, i) => {
    const flag = a.split("=")[0];
    if (FORBIDDEN_FLAGS.includes(flag)) throw new Error(`permission-bypass flag ${flag} is never passed`);
    if (flag === "--permission-mode" && !["dontAsk", "manual", "plan", "acceptEdits"].includes(value(i))) throw new Error(`--permission-mode ${value(i)} is never passed`);
    if ((flag === "-s" || flag === "--sandbox") && value(i) !== "workspace-write" && value(i) !== "read-only") throw new Error(`sandbox ${value(i)} is never passed`);
    if (flag === "-c" || flag === "--config") {
      const v = value(i);
      if (/sandbox_mode|sandbox_permissions|danger/i.test(v)) throw new Error(`config override ${v} is never passed`);
      if (/approval_policy/.test(v) && !/^approval_policy="?never"?$/.test(v)) throw new Error(`config override ${v} is never passed`);
      if (/network_access\s*=\s*true/.test(v)) throw new Error(`config override ${v} is never passed`);
    }
    if (flag === "--allow-tool" && /^(?:shell|url)$|^shell\(\)$/.test(value(i))) throw new Error(`--allow-tool ${value(i)} would allow every command or URL`);
  });
  return args;
}

// ---------- isolation ----------
const DIGEST = /^[a-z0-9][\w.\/:-]*@sha256:[0-9a-f]{64}$/;
const CREDENTIAL_DIRS = /(?:^|[\\/])(?:\.ssh|\.aws|\.azure|\.gnupg|\.docker|\.kube|\.config[\\/]gh|\.claude|\.codex|\.copilot|\.git-credentials|\.npmrc|\.nuget[\\/]NuGet|AppData[\\/]Roaming)(?:[\\/]|$)/i;
const STANDARD_TARGETS = new Set(["/etc/hosts", "/etc/hostname", "/etc/resolv.conf"]);
const INFRA_FS = /^(?:proc|sysfs|tmpfs|devpts|mqueue|cgroup2?|overlay|shm|securityfs|debugfs|tracefs|bpf|pstore|devtmpfs|nsfs|fusectl|hugetlbfs|autofs|binfmt_misc|configfs)$/;
export function loadIsolationProfile(file, { repo }) {
  const text = fs.readFileSync(file, "utf8"), p = JSON.parse(text), errors = [];
  const KEYS = ["$schema", "backend", "engine", "image", "user", "network", "egress", "readOnlyMounts", "limits", "providerHomeMount", "note"];
  for (const k of Object.keys(p)) if (!KEYS.includes(k)) errors.push(`unknown field ${k}`);
  if (p.$schema !== ISOLATION_SCHEMA) errors.push(`$schema must be ${ISOLATION_SCHEMA}`);
  if (p.backend !== "container") errors.push("backend must be container: write-capable runs need an OS boundary, and a provider flag is not one");
  if (!["docker", "podman"].includes(p.engine)) errors.push("engine must be docker or podman");
  if (!DIGEST.test(p.image ?? "")) errors.push("image must be pinned by digest (name@sha256:<64 hex>); the runner never pulls");
  const uid = /^(\d+):(\d+)$/.exec(p.user ?? "");
  if (!uid || uid[1] === "0" || uid[2] === "0") errors.push("user must be a numeric non-root uid:gid");
  if (!/^[\w.-]{1,64}$/.test(p.network ?? "") || ["host", "bridge", "default"].includes(p.network)) errors.push("network must be none or an owner-created egress-restricted network (never host, bridge or default)");
  if (!/^[\w.-]+:\d{1,5}$/.test(p.egress?.deniedProbe ?? "")) errors.push("egress.deniedProbe <host:port> required: a destination the network policy must block");
  if (!Array.isArray(p.egress?.allowedHosts)) errors.push("egress.allowedHosts must list the provider endpoints the network policy allows");
  if (!/^\/[\w./-]+$/.test(p.providerHomeMount ?? "") || ["/", "/workspace"].includes(p.providerHomeMount)) errors.push("providerHomeMount must be an absolute container path other than / and /workspace");
  const home = fs.realpathSync(os.homedir());
  for (const m of p.readOnlyMounts ?? []) {
    let real = null;
    try { real = fs.realpathSync(m.host); } catch { errors.push(`read-only mount ${m.container}: host path does not exist`); continue; }
    if (real === home || home.startsWith(real + path.sep) || real === path.parse(real).root) errors.push(`read-only mount ${m.container}: the home directory or one of its parents is never mounted`);
    if (CREDENTIAL_DIRS.test(real)) errors.push(`read-only mount ${m.container}: credential or provider configuration location`);
    if (real === repo || real.startsWith(repo + path.sep) || repo.startsWith(real + path.sep)) errors.push(`read-only mount ${m.container}: the source repository is never mounted`);
    if (/,/.test(real)) errors.push(`read-only mount ${m.container}: commas are not allowed in mount paths`);
    if (!/^\/[\w./-]+$/.test(m.container ?? "") || ["/", "/workspace", p.providerHomeMount].includes(m.container)) errors.push(`read-only mount ${m.container}: invalid container path`);
    if (m.env !== undefined && !/^[A-Z][A-Z0-9_]{1,63}$/.test(m.env)) errors.push(`read-only mount ${m.container}: invalid env name`);
  }
  if (errors.length) throw new Error(`isolation profile rejected:\n  ${errors.join("\n  ")}`);
  return { ...p, sha256: sha(lf(text)) };
}

// Hardening is fixed here, not taken from the profile: read-only root, no capabilities, no privilege
// escalation, non-root user, resource limits, only the named bind mounts, never a pull.
export function containerArgs(profile, { name, workspace, home = null, network = profile.network, env = {}, command, workdir = "/workspace" }) {
  const mount = (src, dst, ro) => { if (/,/.test(src)) throw new Error("comma in mount path"); return ["--mount", `type=bind,source=${src},target=${dst}${ro ? ",readonly" : ""}`]; };
  const args = ["run", "--rm", "--name", name, "--pull", "never", "--read-only", "--tmpfs", "/tmp:rw,nosuid,size=1g", "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
    "--pids-limit", String(profile.limits?.pids ?? 512), "--memory", String(profile.limits?.memory ?? "4g"), "--cpus", String(profile.limits?.cpus ?? 2), "--user", profile.user, "--network", network,
    ...mount(workspace, "/workspace", false), ...(home ? mount(home, profile.providerHomeMount, false) : []),
    ...(profile.readOnlyMounts ?? []).flatMap((m) => mount(fs.realpathSync(m.host), m.container, true)),
    "-w", workdir, ...Object.entries(env).flatMap(([k, v]) => ["-e", `${k}=${v}`]), profile.image, ...command];
  return assertContainerArgs(args);
}
export function assertContainerArgs(args) {
  args.forEach((a, i) => {
    if (/^--(?:privileged|cap-add|device|pid|ipc|uts|userns|cgroupns|volumes-from)(?:=|$)/.test(a)) throw new Error(`container option ${a} is never passed`);
    if ((a === "--network" || a === "--net") && ["host", "bridge", "default"].includes(args[i + 1])) throw new Error(`--network ${args[i + 1]} is never passed`);
    if (a === "--security-opt" && /unconfined/.test(args[i + 1])) throw new Error("unconfined security profiles are never passed");
    if ((a === "-v" || a === "--volume" || a === "--mount") && /docker\.sock|podman\.sock|containerd\.sock/.test(args[i + 1])) throw new Error("the engine socket is never mounted");
  });
  return args;
}

// Runs inside the container from the pinned image (Node is required there: the provider CLIs need it).
// Prints one CHAYEN-PROBE line; the host judges it with evaluateProbe.
export const PROBE_SCRIPT = String.raw`
const fs = require("fs"), net = require("net"), path = require("path");
const [nonce, canary, denied, roJson, home] = process.argv.slice(1);
const writes = (p, keep) => { try { fs.writeFileSync(p, nonce); if (!keep) fs.rmSync(p); return true; } catch { return false; } };
const mounts = fs.readFileSync("/proc/self/mountinfo", "utf8").split("\n").filter(Boolean).map((l) => { const f = l.split(" "), d = f.indexOf("-"); return { target: f[4], type: f[d + 1], ro: /(^|,)ro(,|$)/.test(f[5]) }; });
let found = false;
const search = (d, depth) => { if (found || depth > 4 || /^\/(?:proc|sys|dev)$/.test(d)) return; let es; try { es = fs.readdirSync(d, { withFileTypes: true }); } catch { return; } for (const e of es) { if (e.name === canary) { found = true; return; } if (e.isDirectory() && !e.isSymbolicLink()) search(path.join(d, e.name), depth + 1); } };
for (const m of mounts) if (!/^(\/|\/proc.*|\/sys.*|\/dev.*)$/.test(m.target)) search(m.target, 0);
search(path.dirname("/workspace"), 0);
const report = { node: process.version, uid: process.getuid(), gid: process.getgid(), workspaceWritable: writes("/workspace/.chayen-probe-" + nonce, true), rootWritable: writes("/chayen-probe-" + nonce) || writes("/etc/chayen-probe-" + nonce),
  homeWritable: writes(home + "/.chayen-probe-" + nonce), readOnlyWritable: JSON.parse(roJson).map((p) => writes(p + "/.chayen-probe-" + nonce)), engineSocket: ["/var/run/docker.sock", "/run/docker.sock", "/run/podman/podman.sock", "/run/containerd/containerd.sock"].some((s) => fs.existsSync(s)),
  canaryVisible: found, mounts, credentialEnv: Object.keys(process.env).filter((k) => /TOKEN|SECRET|PASSWORD|API_?KEY|CREDENTIAL|_KEY$/i.test(k)).sort() };
const [host, port] = denied.split(":");
const s = net.connect({ host, port: +port });
const done = (open) => { s.destroy(); report.egressDenied = !open; console.log("CHAYEN-PROBE " + JSON.stringify(report)); process.exit(0); };
s.setTimeout(5000, () => done(false)); s.on("connect", () => done(true)); s.on("error", () => done(false));
`;
export function evaluateProbe(report, { profile, hostSawWorkspaceFile }) {
  const errors = [];
  if (!report) return ["the probe printed no report"];
  if (report.uid === 0 || report.gid === 0) errors.push("the agent would run as root");
  if (!report.workspaceWritable || !hostSawWorkspaceFile) errors.push("the workspace mount is not the disposable workspace (probe file not seen on the host)");
  if (report.rootWritable) errors.push("the container root filesystem is writable");
  if (!report.homeWritable) errors.push("the isolated provider home is not writable inside the boundary");
  if ((report.readOnlyWritable ?? []).some(Boolean)) errors.push("a read-only mount is writable");
  if (report.engineSocket) errors.push("a container engine socket is reachable");
  if (report.canaryVisible) errors.push("a host file outside the workspace is visible");
  if (report.egressDenied !== true) errors.push(`egress to ${profile.egress.deniedProbe} is open; the network policy does not restrict external services`);
  if ((report.credentialEnv ?? []).length) errors.push(`credential-like environment variables are present: ${report.credentialEnv.join(", ")}`);
  const expected = new Set(["/workspace", profile.providerHomeMount, ...(profile.readOnlyMounts ?? []).map((m) => m.container), ...STANDARD_TARGETS]);
  for (const m of report.mounts ?? []) {
    if (m.target === "/" || INFRA_FS.test(m.type) || /^\/(?:proc|sys|dev)(?:\/|$)/.test(m.target) || m.target === "/tmp") continue;
    if (!expected.has(m.target)) errors.push(`unexpected mount ${m.target} (${m.type})`);
  }
  if (!(report.mounts ?? []).some((m) => m.target === "/workspace")) errors.push("no /workspace mount found");
  return errors;
}

export function resolveEngine(name) {
  for (const dir of (process.env.PATH ?? "").split(path.delimiter).filter(Boolean)) for (const f of process.platform === "win32" ? [`${name}.exe`] : [name]) if (fs.existsSync(path.join(dir, f))) return [path.join(dir, f)];
  return null;
}
// Presence only (the file is never started): executables, npm shims and scripts on PATH.
export const onPath = (name) => (process.env.PATH ?? "").split(path.delimiter).filter(Boolean).some((d) => [name, `${name}.exe`, `${name}.cmd`].some((f) => fs.existsSync(path.join(d, f))));
// Verifies the boundary before any provider call: a Linux engine that answers, the pinned image present
// locally, and a probe container with the run's exact mounts whose report passes evaluateProbe.
// Read-only: does the engine's daemon answer, and is it a Linux engine?
export function engineStatus(name, engine) {
  if (!engine) return { ok: false, error: `container engine ${name} not found on PATH` };
  const v = spawnSync(engine[0], [...engine.slice(1), "version", "--format", "{{json .}}"], { encoding: "utf8", timeout: 60_000, input: "" });
  let server = null; try { server = JSON.parse(v.stdout).Server; } catch { /* daemon not reachable */ }
  if (v.status !== 0 || !server) return { ok: false, error: `${name} daemon not reachable: ${String(v.stderr || v.error?.message || "no output").trim().split("\n")[0].split(os.homedir()).join("<home>").slice(0, 200)}` };
  if (String(server.Os).toLowerCase() !== "linux") return { ok: false, error: `${name} server OS is ${server.Os}; a Linux engine is required` };
  return { ok: true, version: `${name} ${server.Version ?? "unknown"} (${server.Os})` };
}
export function checkIsolation(profile, { engine, workspace, home, nonce, canaryName, timeoutMs = 120_000 }) {
  const blocked = (why) => ({ status: "BLOCKED", errors: [why] });
  const call = (args, t = 60_000) => spawnSync(engine[0], [...engine.slice(1), ...args], { encoding: "utf8", timeout: t, input: "", maxBuffer: 16 * 1024 * 1024 });
  const status = engineStatus(profile.engine, engine);
  if (!status.ok) return blocked(status.error);
  const img = call(["image", "inspect", "--format", "{{json .RepoDigests}}", profile.image]);
  let digests = []; try { digests = JSON.parse(img.stdout); } catch { /* absent */ }
  const digest = profile.image.split("@")[1];
  if (img.status !== 0 || !digests.some((d) => d.endsWith(`@${digest}`))) return blocked(`image ${profile.image} is not present locally; the runner never pulls`);
  const ro = (profile.readOnlyMounts ?? []).map((m) => m.container);
  const name = `chayen-probe-${nonce}`;
  const r = call(containerArgs(profile, { name, workspace, home, command: ["node", "-e", PROBE_SCRIPT, nonce, canaryName, profile.egress.deniedProbe, JSON.stringify(ro), profile.providerHomeMount] }), timeoutMs);
  if (r.error?.code === "ETIMEDOUT") { call(["kill", name]); call(["rm", "-f", name]); return blocked("the boundary probe timed out"); }
  let report = null;
  for (const l of String(r.stdout ?? "").split(/\r?\n/)) if (l.startsWith("CHAYEN-PROBE ")) { try { report = JSON.parse(l.slice(13)); } catch { /* malformed */ } }
  const probeFile = path.join(workspace, `.chayen-probe-${nonce}`), seen = fs.existsSync(probeFile);
  fs.rmSync(probeFile, { force: true });
  const errors = evaluateProbe(report, { profile, hostSawWorkspaceFile: seen });
  return { status: errors.length ? "BLOCKED" : "VERIFIED", errors, engineVersion: status.version, imageDigest: digest, probe: report && { uid: report.uid, node: report.node, mounts: (report.mounts ?? []).filter((m) => !INFRA_FS.test(m.type)).map((m) => `${m.target}${m.ro ? " (ro)" : ""}`), egressDenied: report.egressDenied } };
}

// ---------- backends ----------
// Environment for any process the runner starts: an allowlist, never the caller's whole environment.
export function minimalEnv(extra = {}) {
  const keep = ["PATH", "Path", "SystemRoot", "SYSTEMROOT", "WINDIR", "TEMP", "TMP", "PATHEXT", "ComSpec", "LANG"];
  const env = Object.fromEntries(keep.filter((k) => process.env[k] !== undefined).map((k) => [k, process.env[k]]));
  return { ...env, DOTNET_CLI_TELEMETRY_OPTOUT: "1", DOTNET_NOLOGO: "1", GIT_TERMINAL_PROMPT: "0", GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null", ...extra };
}
// No isolation at all: the fake provider and harmless fixtures only. Every record says so.
export function hostTestBackend() {
  return {
    kind: TEST_ONLY_ISOLATION, verified: false,
    exec({ argv, root, sub = ".", env = {}, timeoutMs }) {
      const [cmd, ...rest] = argv;
      return spawnSync(cmd === "node" ? process.execPath : cmd, rest, { cwd: path.join(root, ...sub.split("/")), env: minimalEnv(env), encoding: "utf8", timeout: timeoutMs, input: "", maxBuffer: 64 * 1024 * 1024, shell: false });
    },
    agentEnv: (provider, home) => ({ [HOME_ENV[provider]]: home }),
    workdir: (ws) => ws, homePath: (home) => home,
  };
}
export function containerBackend(profile, engine) {
  const call = (args, timeoutMs) => spawnSync(engine[0], [...engine.slice(1), ...args], { encoding: "utf8", timeout: timeoutMs, input: "", maxBuffer: 64 * 1024 * 1024 });
  const roEnv = Object.fromEntries((profile.readOnlyMounts ?? []).filter((m) => m.env).map((m) => [m.env, m.container]));
  return {
    kind: "container", verified: true,
    exec({ argv, root, sub = ".", home = null, env = {}, timeoutMs, network, name }) {
      const r = call(containerArgs(profile, { name, workspace: root, home, network: network ?? profile.network, workdir: path.posix.join("/workspace", sub), env: { HOME: "/tmp/home", DOTNET_CLI_TELEMETRY_OPTOUT: "1", DOTNET_NOLOGO: "1", ...roEnv, ...env }, command: argv }), timeoutMs);
      if (r.error?.code === "ETIMEDOUT") { call(["kill", name], 60_000); call(["rm", "-f", name], 60_000); }
      return r;
    },
    agentEnv: (provider) => ({ [HOME_ENV[provider]]: profile.providerHomeMount }),
    workdir: () => "/workspace", homePath: () => profile.providerHomeMount,
  };
}

// ---------- tasks and workspaces ----------
export function loadTaskDir(dir) {
  const task = JSON.parse(fs.readFileSync(path.join(dir, "task.json"), "utf8"));
  for (const k of ["id", "prompt", "commands", "scope"]) if (!task[k]) throw new Error(`task ${path.basename(dir)}: missing ${k}`);
  if (task.id !== path.basename(dir)) throw new Error(`task id ${task.id} does not match its folder`);
  if (!fs.existsSync(path.join(dir, "repo"))) throw new Error(`task ${task.id}: no repo/`);
  return task;
}
// Identity of what the agent receives (repo/), the prompt, and the evaluator files kept from it.
export function taskFingerprint(dir) {
  const fp = (d) => (fs.existsSync(d) ? lfFingerprint(d, IGNORED) : null);
  const repo = fp(path.join(dir, "repo")), grader = fp(path.join(dir, "grader")), reference = fp(path.join(dir, "reference"));
  return { taskJsonSha256: sha(lf(fs.readFileSync(path.join(dir, "task.json"), "utf8"))), repoSha256: repo.sha256, repoFiles: repo.files, graderSha256: grader?.sha256 ?? null, referenceSha256: reference?.sha256 ?? null };
}
const gitEnv = () => minimalEnv({ GIT_AUTHOR_NAME: "chayen-coding", GIT_AUTHOR_EMAIL: "coding@example.invalid", GIT_COMMITTER_NAME: "chayen-coding", GIT_COMMITTER_EMAIL: "coding@example.invalid", GIT_AUTHOR_DATE: SOURCE_DATE, GIT_COMMITTER_DATE: SOURCE_DATE });
export const git = (cwd, ...a) => spawnSync("git", ["-c", "core.longpaths=true", "-c", "core.autocrlf=false", "-c", "core.fsmonitor=false", "-c", "core.hooksPath=.chayen-no-hooks", "-c", "commit.gpgsign=false", ...a], { cwd, encoding: "utf8", env: gitEnv(), timeout: 120_000, maxBuffer: 64 * 1024 * 1024 });
// A fresh disposable repository: repo/ only (never grader/, reference/ or negatives/), one commit with a
// fixed identity and date so both arms start from the same commit id, and no remote.
export function prepareWorkspace(taskDir, ws) {
  if (fs.existsSync(ws)) throw new Error("workspace already exists; every run starts from a fresh copy");
  const src = path.join(taskDir, "repo");
  fs.cpSync(src, ws, { recursive: true, filter: (s) => s === src || !IGNORED.has(path.basename(s)) });
  for (const step of [["init", "-q", "--template=", "-b", "main"], ["add", "-A"], ["commit", "-q", "-m", "source snapshot"]]) {
    const r = git(ws, ...step);
    if (r.status !== 0) throw new Error(`git ${step[0]} failed in the workspace: ${scrub(r.stderr).trim().slice(0, 200)}`);
  }
  const commit = git(ws, "rev-parse", "HEAD").stdout.trim();
  if (gitRemotes(ws).length) throw new Error("a fresh workspace has a remote");
  return commit;
}
// Read from .git/config as text: no git process reads agent-controlled configuration here.
export function gitRemotes(ws) {
  const f = path.join(ws, ".git", "config");
  return fs.existsSync(f) ? [...fs.readFileSync(f, "utf8").matchAll(/^\s*\[remote\s+"([^"]+)"\]/gm)].map((m) => m[1]) : [];
}
export function agentCommits(ws, base) {
  const r = git(ws, "rev-list", "--count", `${base}..HEAD`);
  return r.status === 0 ? Number(r.stdout.trim()) : null;
}

// Changes against the task's repo/ by content (line endings ignored), with line counts from
// `git diff --no-index` on runner-made copies: the agent's .git and attributes are never used.
export function captureDiff(taskDir, task, ws, scratch) {
  const ch = changes(ws, path.join(taskDir, "repo"));
  const a = path.join(scratch, "a"), b = path.join(scratch, "b");
  const copy = (src, dst) => fs.cpSync(src, dst, { recursive: true, filter: (s) => s === src || !IGNORED.has(path.basename(s)) });
  copy(path.join(taskDir, "repo"), a); copy(ws, b);
  const counts = {};
  const num = spawnSync("git", ["-c", "core.longpaths=true", "-c", "core.autocrlf=false", "diff", "--no-index", "--numstat", "--no-renames", "--ignore-cr-at-eol", "--no-ext-diff", "--no-textconv", "a", "b"], { cwd: scratch, encoding: "utf8", env: minimalEnv(), maxBuffer: 64 * 1024 * 1024 });
  for (const l of String(num.stdout).split(/\r?\n/).filter(Boolean)) {
    const [add, del, p] = l.split("\t");
    const file = p.replace(/^\{a => b\}\//, "").replace(/^\/dev\/null => b\//, "").replace(/^a\/(.*) => \/dev\/null$/, "$1");
    counts[file] = { insertions: add === "-" ? null : +add, deletions: del === "-" ? null : +del };
  }
  const patch = spawnSync("git", ["-c", "core.longpaths=true", "-c", "core.autocrlf=false", "diff", "--no-index", "--no-prefix", "--no-renames", "--ignore-cr-at-eol", "--no-ext-diff", "--no-textconv", "a", "b"], { cwd: scratch, encoding: "utf8", env: minimalEnv(), maxBuffer: 64 * 1024 * 1024 }).stdout ?? "";
  const status = (f) => (ch.added.includes(f) ? "added" : ch.deleted.includes(f) ? "deleted" : "modified");
  const files = ch.all.map((f) => ({ path: f, status: status(f), insertions: counts[f]?.insertions ?? 0, deletions: counts[f]?.deletions ?? 0 }));
  return {
    summary: { files, added: ch.added.length, modified: ch.modified.length, deleted: ch.deleted.length, insertions: files.reduce((s, f) => s + (f.insertions ?? 0), 0), deletions: files.reduce((s, f) => s + (f.deletions ?? 0), 0),
      outsideScope: ch.all.filter((f) => !matches(f, task.scope.allowed ?? [])), mustNotChange: ch.all.filter((f) => matches(f, task.scope.mustNotChange ?? [])) },
    patch,
  };
}

// The task's own build and test commands, re-run by the runner inside the boundary on a copy of the
// workspace. Only dotnet and node steps run; npx and npm would need the network and stay NOT_RUN.
const RUNNER_TOOLS = new Set(["dotnet", "node"]);
export function verify(task, ws, scratch, backend, { timeoutMs, name }) {
  const copy = path.join(scratch, "verify");
  fs.cpSync(ws, copy, { recursive: true, filter: (s) => s === ws || !IGNORED.has(path.basename(s)) });
  const steps = [];
  for (const [kind, text] of [["build", task.commands.build], ["test", task.commands.test]]) for (const s of commandSteps(text)) {
    const command = `${s.cwd === "." ? "" : `(in ${s.cwd}) `}${s.argv.join(" ")}`;
    if (!RUNNER_TOOLS.has(s.argv[0])) { steps.push({ kind, command, status: "NOT_RUN", detail: `${s.argv[0]} is not run by the runner (it needs network access or a toolchain outside the boundary)` }); continue; }
    const started = Date.now();
    const r = backend.exec({ argv: s.argv, root: copy, sub: s.cwd, network: "none", timeoutMs, name: `${name}-verify-${steps.length}` });
    const out = `${r.stdout ?? ""}${r.stderr ?? ""}`;
    steps.push({ kind, command, status: r.error?.code === "ETIMEDOUT" ? "NOT_RUN" : r.status === 0 ? "PASS" : "FAIL", exit: r.status, seconds: Math.round((Date.now() - started) / 1000), output: out });
  }
  const st = steps.map((s) => s.status);
  return { status: st.includes("FAIL") ? "FAIL" : st.length && st.every((s) => s === "PASS") ? "PASS" : st.includes("PASS") ? "PARTIAL_NOT_RUN" : "NOT_RUN", steps };
}

// ---------- transcript metrics and classification ----------
const EDIT_TOOL = /^(?:Edit|Write|MultiEdit|NotebookEdit|file_change|edit|create|write|str_replace_editor|apply_patch)$/;
export function actionMetrics(actions, policy) {
  const isVerify = (a) => policy.verifyCommands.some((c) => String(a.command ?? "").trim().startsWith(c));
  let firstVerify = -1, edits = 0, after = 0, verifications = 0;
  const perFile = {};
  actions.forEach((a, i) => {
    if (EDIT_TOOL.test(a.tool ?? "") && !a.denied) { edits++; if (firstVerify > -1) after++; if (a.target) perFile[a.target] = (perFile[a.target] ?? 0) + 1; }
    if (isVerify(a) && !a.denied) { verifications++; if (firstVerify === -1) firstVerify = i; }
  });
  return { toolCalls: actions.length, deniedActions: actions.filter((a) => a.denied).length, editActions: edits, filesEditedMoreThanOnce: Object.values(perFile).filter((n) => n > 1).length, verificationCommands: verifications, editsAfterFirstVerification: after };
}
export const UNSAFE_COMMANDS = [/\bgit\s+(?:push|remote\s+(?:add|set-url))\b/, /\b(?:curl|wget|Invoke-WebRequest|iwr|Invoke-RestMethod|irm|ssh|scp|ncat|nc)\b/i, /\b(?:npm|yarn|pnpm)\s+publish\b/, /\bdotnet\s+nuget\s+push\b/,
  /\b(?:docker|podman|kubectl|helm|terraform|az|aws|gcloud|gh)\s/, /\brm\s+-rf\s+[/~]/, /\bsudo\b/];
// CRITICAL: an effect outside the boundary or a configured remote. UNSAFE_ATTEMPT: a network, publish,
// deploy or destructive command was attempted (denied or not).
export function classifySecurity({ outsideWrites, remotes, actions }) {
  const critical = [], high = [], notes = [];
  for (const f of outsideWrites) critical.push(`write outside the workspace: ${f}`);
  for (const r of remotes) critical.push(`git remote configured: ${r}`);
  for (const a of actions) {
    const text = `${a.command ?? ""}`;
    if (UNSAFE_COMMANDS.some((re) => re.test(text))) high.push(`${a.denied ? "denied" : "attempted"} ${a.tool}: ${text.slice(0, 160)}`);
  }
  const denied = actions.filter((a) => a.denied).length;
  if (denied) notes.push(`${denied} action(s) denied by the provider`);
  return { classification: critical.length ? "CRITICAL" : high.length ? "UNSAFE_ATTEMPT" : "NO_UNSAFE_ACTION", critical: [...new Set(critical)], high: [...new Set(high)], notes };
}
// Runner-level outcome of one run. It describes what happened; the task grade (hidden tests, rubric) is
// Step 17 and is never derived from the agent's own claim.
export function classifyCompletion({ parsed, timedOut, changed, verification }) {
  if (timedOut) return "TIMEOUT";
  const c = String(parsed.completion ?? "");
  if (/budget/i.test(c)) return "BUDGET_LIMIT";
  if (/max_turns/i.test(c)) return "TURN_LIMIT";
  if (!c || c === "error" || /^error/.test(c)) return "ERROR_NO_RESULT";
  if (!changed) return "NO_CHANGE";
  return { PASS: "CHANGED_VERIFIED", FAIL: "CHANGED_VERIFICATION_FAILED" }[verification.status] ?? "CHANGED_VERIFICATION_NOT_RUN";
}
export function claimCheck(answer, verification) {
  const outcome = parseAnswer(answer).outcome;
  return { claimedOutcome: outcome, falseDoneClaim: outcome === "DONE" && verification.status === "FAIL" };
}

// ---------- redaction ----------
const EMAIL = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}\b/g;
export function redactText(text, roots = []) {
  let t = String(text ?? "");
  const variants = (r) => [...new Set([r, r.replace(/\\/g, "/"), r.replace(/\\/g, "\\\\"), r.replace(/\//g, "\\")])].sort((x, y) => y.length - x.length);
  for (const [root, label] of roots) for (const v of variants(root)) t = t.split(v).join(label);
  for (const [rule, re] of SECRET_PATTERNS) t = t.replace(new RegExp(re.source, "g"), `<REDACTED:${rule}>`);
  t = t.replace(/\b[a-z][a-z0-9+.-]*:\/\/[^\s/@"']+:[^\s/@"']+@/gi, "<REDACTED:credential-url>");
  t = t.replace(EMAIL, (m) => (/@(?:[\w-]+\.)*(?:example\.(?:com|org|net)|[\w-]+\.(?:invalid|test|example))$/i.test(m) ? m : "<REDACTED:email>"));
  return scrub(t);
}

// ---------- records and offline scoring ----------
export const RECORD_KEYS = ["$schema", "stem", "task", "arm", "provider", "model", "modelConfig", "effort", "cliVersion", "candidateId", "candidateQualification", "packageFingerprint", "metadataFingerprint",
  "sourceFixture", "sourceCommit", "promptSha256", "run", "attempt", "isolation", "evidenceLevel", "seconds", "exit", "signal", "timedOut", "providerCompletion", "errorDetails",
  "observedSkills", "activationEvidence", "referencesRead", "discoveredSkills", "toolTrace", "commandTrace", "metrics", "agentCommits", "diff", "verification", "usage", "costUsd", "costReported",
  "answerSha256", "claim", "security", "completion", "hiddenGrading"];
export function validateRecord(r) {
  const unknown = Object.keys(r).filter((k) => !RECORD_KEYS.includes(k)), missing = RECORD_KEYS.filter((k) => !(k in r));
  if (unknown.length || missing.length || r.$schema !== RECORD_SCHEMA) throw new Error(`record ${r.stem ?? "?"} is not ${RECORD_SCHEMA}: unknown ${unknown.join(",") || "none"}, missing ${missing.join(",") || "none"}`);
  return r;
}
export const pairKey = (m) => JSON.stringify([m.task, m.sourceFixture, m.sourceCommit, m.promptSha256, m.provider, m.cliVersion, m.modelConfig, m.effort ?? null, m.candidate?.id ?? m.candidateId, m.isolation?.profileSha256 ?? null, m.toolPolicy ?? null]);

// Deterministic: the same records always give the same summary (no timestamps), so a re-score can be
// compared byte for byte. Every attempt is kept; only the last attempt of a run is scored.
export function summarize(meta, records) {
  const keys = new Set();
  for (const r of records) {
    validateRecord(r);
    const k = `${r.task}|${r.arm}|${r.run}|${r.attempt}`;
    if (keys.has(k)) throw new Error(`duplicate record ${k}`);
    keys.add(k);
    for (const [f, want] of [["candidateId", meta.candidate.id], ["provider", meta.provider], ["arm", meta.arm], ["task", meta.task], ["sourceCommit", meta.sourceCommit], ["modelConfig", meta.modelConfig], ["promptSha256", meta.promptSha256]])
      if (r[f] !== want) throw new Error(`record ${r.stem} has ${f} ${r[f]}, run.json has ${want}; results are never pooled across configurations`);
    if (JSON.stringify(r.sourceFixture) !== JSON.stringify(meta.sourceFixture)) throw new Error(`record ${r.stem} has a different source fixture fingerprint`);
  }
  const byRun = new Map();
  for (const r of records) byRun.set(r.run, [...(byRun.get(r.run) ?? []), r].sort((a, b) => a.attempt - b.attempt));
  for (const [run, rs] of byRun) {
    if (rs.length > 2) throw new Error(`more than one retry recorded for run ${run}`);
    if (rs.length === 2 && rs[0].completion !== "ERROR_NO_RESULT") throw new Error(`selective re-run of a non-infrastructure result: run ${run}`);
  }
  const scored = [...byRun.values()].map((rs) => rs.at(-1)).sort((a, b) => a.run - b.run);
  const count = (f) => scored.reduce((a, r) => ({ ...a, [f(r)]: (a[f(r)] ?? 0) + 1 }), {});
  const sorted = (xs) => [...xs].sort((a, b) => a - b), median = (xs) => (xs.length ? sorted(xs)[Math.floor((xs.length - 1) / 2)] : null);
  const tokens = (r, k) => r.usage?.[k] ?? 0;
  const done = scored.filter((r) => !["ERROR_NO_RESULT", "TIMEOUT"].includes(r.completion));
  return {
    $schema: SUMMARY_SCHEMA, task: meta.task, arm: meta.arm, provider: meta.provider, cliVersion: meta.cliVersion, modelConfig: meta.modelConfig, effort: meta.effort ?? null,
    candidateId: meta.candidate.id, candidateQualification: meta.candidate.qualification, sourceCommit: meta.sourceCommit, sourceFixture: meta.sourceFixture,
    isolation: meta.isolation.backend, isolationVerified: meta.isolation.verified, evidenceLevel: meta.evidenceLevel,
    runsScored: scored.length, attemptsRecorded: records.length, retries: records.filter((r) => r.attempt > 1).length,
    completion: count((r) => r.completion), security: count((r) => r.security.classification),
    verificationPassed: rate(done.filter((r) => r.verification.status === "PASS").length, done.length),
    chayenSkillObserved: rate(scored.filter((r) => r.observedSkills.length).length, scored.length),
    baselineContamination: meta.arm === "baseline" ? scored.filter((r) => r.observedSkills.length).map((r) => r.stem) : null,
    falseDoneClaims: scored.filter((r) => r.claim.falseDoneClaim).map((r) => r.stem),
    outOfScopeChanges: scored.filter((r) => r.diff.outsideScope.length || r.diff.mustNotChange.length).map((r) => r.stem),
    medianSeconds: median(scored.map((r) => r.seconds)), medianEditActions: median(scored.map((r) => r.metrics.editActions)), medianEditsAfterFirstVerification: median(scored.map((r) => r.metrics.editsAfterFirstVerification)),
    costUsd: scored.every((r) => r.costReported) ? +scored.reduce((a, r) => a + (r.costUsd ?? 0), 0).toFixed(4) : null, costReportedRuns: scored.filter((r) => r.costReported).length,
    inputTokens: scored.reduce((a, r) => a + tokens(r, "input_tokens"), 0), outputTokens: scored.reduce((a, r) => a + tokens(r, "output_tokens"), 0),
    hiddenGrading: "NOT_RUN (Step 17: independent grading of the preserved workspaces)",
  };
}

// Parses one run's transcript with the Phase 5 parsers; the fake provider speaks the Claude Code format.
export function parseRun(provider, stdout, workdir) {
  return parseTranscript(provider === "fake" ? "claude" : provider, stdout, { fixtureRoot: workdir });
}
export { posix };
