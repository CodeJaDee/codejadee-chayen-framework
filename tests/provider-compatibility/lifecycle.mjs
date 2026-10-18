// Developer-only implementation of run-lifecycle.sh. Never shipped; no model calls.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { inside, assertTreeNoLinks } from "../../tools/validate/safe-paths.mjs";

export const ID = "chayen@codejadee", EXPECTED_SKILLS = 15;
export const OPERATIONS = ["register", "install", "discover", "disable", "enable", "update", "uninstall", "unregister"];
const packagePath = "plugins/codejadee-chayen-framework";
const digest = text => crypto.createHash("sha256").update(text).digest("hex");
const read = file => fs.readFileSync(file, "utf8");
const within = (parent, child) => child === parent || child.startsWith(parent + path.sep);
function pluginRecords(value, records = []) {
  if (!value || typeof value !== "object") return records;
  if (/^(chayen|chayen@codejadee)$/.test(value.name ?? value.id ?? value.plugin ?? "")) records.push(value);
  for (const v of Object.values(value)) if (typeof v === "object") pluginRecords(v, records);
  return records;
}
const pluginBlocks = text => text.split(/\r?\n(?=\S)/).filter(s => /\bchayen(?:@codejadee)?\b/.test(s)).join("\n");
export function listedVersion(output, expected) {
  try { return pluginRecords(JSON.parse(output)).some(v => v.version === expected); }
  catch { return pluginBlocks(output).includes(expected); }
}
export function listedEnabled(output, expected) {
  try { const records = pluginRecords(JSON.parse(output)); return records.length === 1 && records[0].enabled === expected; }
  catch { return new RegExp(`\\b${expected ? "enabled" : "disabled"}\\b`, "i").test(pluginBlocks(output)); }
}

export function authorize(env) {
  if (env.CHAYEN_ALLOW_PROVIDER_LIFECYCLE !== "1" || env.CHAYEN_DISPOSABLE_ENVIRONMENT !== "1")
    throw new Error("Explicit authorization and disposable environment required; both opt-in guards must be 1");
}
export function freshWork(target, repo, realHomes) {
  if (!target) throw new Error("Fresh scratch directory required");
  const resolved = path.join(fs.realpathSync(path.dirname(path.resolve(target))), path.basename(target));
  if ([repo, ...realHomes].some(p => within(p, resolved))) throw new Error("Scratch must be outside repository and real provider profiles");
  if (fs.existsSync(resolved)) throw new Error("Refusing an existing work directory");
  fs.mkdirSync(resolved);
  return resolved;
}
export function isolatedEnvironment(profile, inherited = process.env) {
  assertTreeNoLinks(profile);
  if (fs.readdirSync(profile).length) throw new Error("Provider profile must be fresh and empty");
  // Do not inherit provider paths, credentials, NODE_OPTIONS or shell startup files.
  const env = Object.fromEntries(Object.entries(inherited).filter(([k]) => /^(PATH|PATHEXT|SYSTEMROOT|WINDIR|COMSPEC|LANG|LC_ALL)$/i.test(k)));
  const dirs = { HOME: profile, USERPROFILE: profile, XDG_CONFIG_HOME: path.join(profile, "config"),
    XDG_CACHE_HOME: path.join(profile, "cache"), XDG_DATA_HOME: path.join(profile, "data"), XDG_STATE_HOME: path.join(profile, "state"),
    APPDATA: path.join(profile, "roaming"), LOCALAPPDATA: path.join(profile, "local"),
    TMPDIR: path.join(profile, "tmp"), TMP: path.join(profile, "tmp"), TEMP: path.join(profile, "tmp"),
    CLAUDE_CONFIG_DIR: path.join(profile, ".claude"), CODEX_HOME: path.join(profile, ".codex"), COPILOT_HOME: path.join(profile, ".copilot") };
  for (const dir of new Set(Object.values(dirs))) fs.mkdirSync(dir, { recursive: true });
  return { ...env, ...dirs, COPILOT_AUTO_UPDATE: "false", DISABLE_AUTOUPDATER: "1", CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1", GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: path.join(profile, "gitconfig") };
}
// A disabled plugin is still installed. Unknown output never proves absence.
export function installationState(output) {
  let obj;
  try { obj = JSON.parse(output); } catch { /* native text */ }
  if (obj !== undefined) {
    const states = [];
    function walk(v) {
      if (!v || typeof v !== "object") return;
      if (/^(chayen|chayen@codejadee)$/.test(v.name ?? v.id ?? v.plugin ?? "")) {
        if (typeof v.installed === "boolean") states.push(v.installed);
        else if (/available|not installed/.test(v.status ?? "")) states.push(false);
        else if (typeof v.enabled === "boolean" || /installed|enabled|disabled/.test(v.status ?? "")) states.push(true);
        else states.push(null);
      }
      for (const value of Object.values(v)) if (typeof value === "object") walk(value);
    }
    walk(obj);
    const isList = Array.isArray(obj) || Array.isArray(obj?.plugins);
    return states.includes(true) ? true : states.includes(null) ? null : states.length || isList ? false : null;
  }
  const blocks = output.split(/\r?\n(?=\S)/).filter(s => /\bchayen(?:@codejadee)?\b/.test(s));
  if (!blocks.length) return /\bno (?:installed )?plugins\b|\b0 plugins\b/i.test(output) ? false : null;
  if (blocks.some(s => /\b(?:installed|enabled|disabled)\b/i.test(s.replace(/not installed/gi, "available")))) return true;
  return blocks.every(s => /\bavailable\b|not installed/i.test(s)) ? false : null;
}
export function expectedBuild(marketplace) {
  const dir = path.join(marketplace, packagePath);
  return { version: JSON.parse(read(path.join(dir, "plugin.json"))).version,
    contentHash: digest(read(path.join(dir, "skills/chayen-backend/SKILL.md"))),
    skills: fs.readdirSync(path.join(dir, "skills")).filter(n => fs.existsSync(path.join(dir, "skills", n, "SKILL.md"))).sort() };
}
export function installedBuild(profile, expected) {
  assertTreeNoLinks(profile);
  let found = false;
  function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, e.name);
      if (e.isDirectory()) walk(file);
      else if (e.name === "plugin.json" && fs.existsSync(path.join(dir, "skills"))) {
        const manifest = JSON.parse(read(file));
        if (manifest.name !== "chayen" || manifest.version !== expected.version) continue;
        const skills = fs.readdirSync(path.join(dir, "skills")).filter(n => fs.existsSync(path.join(dir, "skills", n, "SKILL.md")));
        if (skills.length === EXPECTED_SKILLS && JSON.stringify(skills.sort()) === JSON.stringify(expected.skills) && digest(read(path.join(dir, "skills/chayen-backend/SKILL.md"))) === expected.contentHash) found = true;
      }
    }
  }
  walk(profile);
  return found;
}
export function changeUpdateContent(marketplace) {
  const before = expectedBuild(marketplace), version = "0.1.0-lifecycle.1";
  for (const f of [`${packagePath}/plugin.json`, `${packagePath}/.claude-plugin/plugin.json`, ".github/plugin/marketplace.json"]) {
    const file = path.join(marketplace, f), value = JSON.parse(read(file));
    if (value.plugins) { value.metadata.version = version; value.plugins[0].version = version; }
    else value.version = version;
    fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
  }
  fs.appendFileSync(path.join(marketplace, packagePath, "skills/chayen-backend/SKILL.md"), "\nLifecycle scratch content revision 1.\n");
  const after = expectedBuild(marketplace);
  if (before.contentHash === after.contentHash || before.version === after.version) throw new Error("Update must change version and content");
  return after;
}
// Inspect the actual binary's help; absent commands become NOT_RUN, never guesses.
export function runProvider(provider, { marketplace, profile }, execute) {
  const rows = [];
  const invoke = args => {
    const r = execute(args);
    if (r.status !== 0 || r.error || r.signal) throw new Error(`Native command failed: ${provider} ${args.join(" ")} (exit ${r.status})`);
    return r.stdout ?? "";
  };
  const supported = tokens => {
    for (let n = 1; n < tokens.length; n++) {
      const r = execute([...tokens.slice(0, n), "--help"]);
      if (r.status !== 0 || r.error || r.signal || !new RegExp(`(?:^|\\s)${tokens[n]}(?:\\s|[<\\[]|$)`, "m").test(r.stdout ?? "")) return false;
    }
    const r = execute([...tokens, "--help"]);
    return r.status === 0 && !r.error && !r.signal;
  };
  const commands = {
    register: ["plugin", "marketplace", "add"], install: ["plugin", provider === "codex" ? "add" : "install"],
    discover: ["plugin", "list"], disable: ["plugin", "disable"], enable: ["plugin", "enable"], update: ["plugin", "update"],
    uninstall: ["plugin", provider === "codex" ? "remove" : "uninstall"], unregister: ["plugin", "marketplace", "remove"],
  };
  const available = Object.fromEntries(Object.entries(commands).map(([k, v]) => [k, supported(v)]));
  const list = () => invoke(commands.discover);
  const state = want => { if (installationState(list()) !== want) throw new Error(`Expected installed=${want}; disabled is installed; unknown output fails`); };
  let proceed = true;
  for (const step of OPERATIONS) {
    const needsList = ["install", "discover", "disable", "enable", "update", "uninstall"].includes(step);
    if (!available[step] || (needsList && !available.discover) || (!proceed && !["uninstall", "unregister"].includes(step))) {
      rows.push({ step, result: "NOT_RUN", reason: available[step] ? "earlier prerequisite failed" : "native command unavailable; reviewed native UI verification required" });
      if (["register", "install", "discover"].includes(step)) proceed = false;
      continue;
    }
    try {
      if (step === "register") invoke([...commands[step], marketplace]);
      if (step === "install") { invoke([...commands[step], ID]); state(true); }
      if (step === "discover") { state(true); if (!installedBuild(profile, expectedBuild(marketplace))) throw new Error("Installed content or 15-skill inventory differs from source"); }
      if (["disable", "enable"].includes(step)) {
        invoke([...commands[step], ID]); state(true);
        if (!listedEnabled(list(), step === "enable")) throw new Error("Native list does not confirm toggle state");
      }
      if (step === "update") {
        if (!supported(["plugin", "marketplace", "update"])) { rows.push({ step, result: "NOT_RUN", reason: "native marketplace refresh unavailable" }); continue; }
        const expected = changeUpdateContent(marketplace);
        invoke(["plugin", "marketplace", "update", "codejadee"]); invoke([...commands[step], ID]); state(true);
        if (!listedVersion(list(), expected.version)) throw new Error("Native list still selects the old version or omits version evidence");
        if (!installedBuild(profile, expected)) throw new Error("Update did not deliver changed content and version");
      }
      if (step === "uninstall") { invoke([...commands[step], provider === "copilot" ? "chayen" : ID]); state(false); }
      if (step === "unregister") {
        if (!supported(["plugin", "marketplace", "list"])) { rows.push({ step, result: "NOT_RUN", reason: "cannot verify marketplace removal" }); continue; }
        invoke([...commands[step], "codejadee"]);
        if (/\bcodejadee\b/.test(invoke(["plugin", "marketplace", "list"]))) throw new Error("Marketplace remains registered");
      }
      rows.push({ step, result: "PASS" });
    } catch (error) { rows.push({ step, result: "FAIL", reason: error.message }); proceed = false; }
  }
  return rows;
}
export function configFingerprint(homes) {
  const state = [];
  for (const home of new Set(homes)) {
    const names = new Set(["settings.json", "settings.local.json", "config.toml", "config.json", "auth.json", "plugins/installed_plugins.json", "plugins/known_marketplaces.json", "plugins/config.json"]);
    if (fs.existsSync(home)) for (const e of fs.readdirSync(home, { withFileTypes: true })) if (e.isFile() && /\.(?:json|toml|ya?ml)$/.test(e.name)) names.add(e.name);
    for (const name of [...names].sort()) {
    const file = path.join(home, name);
    state.push([file, fs.existsSync(file) ? digest(fs.readFileSync(file)) : "absent"]);
    }
  }
  return digest(JSON.stringify(state)); // never emit real configuration content
}
export function meetsMinimum(provider, version) {
  if (provider !== "copilot") return Boolean(version.trim());
  const m = /(\d+)\.(\d+)\.(\d+)/.exec(version);
  if (!m) return false;
  const [major, minor, patch] = m.slice(1).map(Number);
  return major > 1 || (major === 1 && (minor > 0 || patch >= 91));
}
export function main(target, env = process.env) {
  authorize(env);
  const repo = fs.realpathSync(path.resolve(import.meta.dirname, "../.."));
  const homes = [path.join(os.homedir(), ".claude"), path.join(os.homedir(), ".codex"), path.join(os.homedir(), ".copilot"), env.CLAUDE_CONFIG_DIR, env.CODEX_HOME, env.COPILOT_HOME].filter(Boolean).map(p => path.resolve(p));
  const before = configFingerprint(homes), work = freshWork(target, repo, homes), report = [];
  try {
    for (const provider of ["claude", "codex", "copilot"]) {
      const dir = inside(work, provider); fs.mkdirSync(dir);
      const profile = path.join(dir, "profile"); fs.mkdirSync(profile);
      const childEnv = isolatedEnvironment(profile, env), marketplace = path.join(dir, "marketplace"); fs.mkdirSync(marketplace);
      for (const rel of ["plugins", ".claude-plugin", ".agents", ".github/plugin"]) {
        const src = inside(repo, rel); assertTreeNoLinks(src); fs.cpSync(src, inside(marketplace, rel), { recursive: true });
      }
      const fixture = path.join(dir, "fixture"); fs.mkdirSync(fixture);
      const app = path.join(fixture, "app.txt"); fs.writeFileSync(app, "Disposable application fixture\n"); const appBefore = digest(read(app));
      const execute = args => spawnSync(provider, args, { cwd: fixture, env: childEnv, encoding: "utf8", timeout: 60_000, maxBuffer: 8 * 1024 * 1024 });
      const version = execute(["--version"]);
      const usable = version.status === 0 && meetsMinimum(provider, version.stdout ?? "");
      const rows = usable ? runProvider(provider, { marketplace, profile }, execute) : OPERATIONS.map(step => ({ step, result: "NOT_RUN", reason: "native executable unavailable or version below release minimum" }));
      rows.push({ step: "fixture-unchanged", result: fs.readdirSync(fixture).join() === "app.txt" && digest(read(app)) === appBefore ? "PASS" : "FAIL" });
      assertTreeNoLinks(profile);
      report.push({ provider, version: version.status === 0 ? version.stdout.trim() : "unavailable", identity: ID, skillCount: EXPECTED_SKILLS, build: expectedBuild(repo), rows });
    }
  } finally {
    report.push({ step: "real-configs-unchanged", result: configFingerprint(homes) === before ? "PASS" : "FAIL" });
    fs.writeFileSync(path.join(work, "results.json"), JSON.stringify(report, null, 2) + "\n");
  }
  console.log(JSON.stringify(report, null, 2));
  const rows = report.flatMap(r => r.rows ?? [r]);
  return rows.some(r => r.result === "FAIL") ? 1 : rows.some(r => r.result === "NOT_RUN") ? 2 : 0;
}
if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  try { process.exitCode = main(process.argv[2]); } catch (e) { console.error(e.message); process.exitCode = 2; }
}
