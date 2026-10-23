// Phase 4 developer tooling. No prompts, model turns, credentials or global env changes.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { authorize, isolatedEnvironment, freshWork, configFingerprint, configEntries, changeUpdateContent, meetsMinimum } from "./lifecycle.mjs";
import { assertTreeNoLinks } from "../../tools/validate/safe-paths.mjs";

export const PACKAGE = "plugins/codejadee-chayen-framework";
export const DESCRIPTORS = [".claude-plugin/marketplace.json", ".agents/plugins/marketplace.json", ".github/plugin/marketplace.json"];
export const STEPS = ["register", "install", "list", "discover", "disable", "disabled-behavior", "enable", "enabled-behavior", "update", "updated-content", "uninstall", "absent", "reinstall", "restart", "migration", "unregister"];
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
const json = file => JSON.parse(fs.readFileSync(file, "utf8"));
export function fingerprint(dir) {
  assertTreeNoLinks(dir);
  const files = fs.readdirSync(dir, { recursive: true }).filter(f => fs.statSync(path.join(dir, f)).isFile()).map(f => f.replaceAll("\\", "/")).sort();
  const inventory = files.map(file => [file, sha(fs.readFileSync(path.join(dir, file)))]);
  return { sha256: sha(inventory.map(([file, hash]) => `${file}\0${hash}\n`).join("")), files: inventory };
}
export function candidate(repo) {
  const plugin = path.join(repo, PACKAGE), manifest = json(path.join(plugin, "plugin.json"));
  const skills = fs.readdirSync(path.join(plugin, "skills")).filter(n => fs.existsSync(path.join(plugin, "skills", n, "SKILL.md"))).sort();
  const metadata = crypto.createHash("sha256");
  for (const name of skills) {
    const description = /^description:\s*(.*)$/m.exec(fs.readFileSync(path.join(plugin, "skills", name, "SKILL.md"), "utf8"))?.[1].trim();
    if (!description) throw new Error(`Missing metadata: ${name}`);
    metadata.update(`${name}\0${description}\0`);
  }
  const git = args => { const r = spawnSync("git", args, { cwd: repo, encoding: "utf8" }); if (r.status !== 0) throw new Error("Git inspection failed"); return r.stdout.trim(); };
  return { baseCommit: git(["rev-parse", "HEAD"]), sourceState: git(["status", "--porcelain"]) ? "working-tree snapshot; not a committed freeze" : "clean commit", plugin: manifest.name, version: manifest.version,
    claudeVersion: json(path.join(plugin, ".claude-plugin/plugin.json")).version, skills, skillMetadataFingerprint: metadata.digest("hex").slice(0, 16), package: fingerprint(plugin),
    marketplaces: DESCRIPTORS.map(file => { const data = json(path.join(repo, file)); return { file, name: data.name, metadataVersion: data.metadata?.version ?? null, pluginVersion: data.plugins[0].version ?? null, sha256: sha(fs.readFileSync(path.join(repo, file))) }; }) };
}
export function copyMarketplace(repo, target) {
  fs.mkdirSync(target);
  for (const rel of [PACKAGE, ...DESCRIPTORS]) { const src = path.join(repo, rel); assertTreeNoLinks(src); fs.cpSync(src, path.join(target, rel), { recursive: true }); }
}
// Verify the entire installed tree at the path reported by the provider, not an old cache hit.
export function verifyInstalled(installPath, profile, expected) {
  assertTreeNoLinks(profile);
  const realProfile = fs.realpathSync(profile), realInstall = fs.realpathSync(installPath);
  if (!realInstall.startsWith(realProfile + path.sep)) throw new Error("Installed path escapes isolated profile");
  const actual = fingerprint(realInstall);
  if (actual.sha256 !== expected.sha256) throw new Error("Installed package fingerprint differs from candidate");
  return actual.sha256;
}
export function codexInventory(result, expected, wantEnabled, cwd) {
  if (!Array.isArray(result?.data) || result.data.length !== 1) throw new Error("Unknown native skills/list response; cannot prove activation or absence");
  const entry = result.data[0];
  if (typeof entry?.cwd !== "string" || !entry.cwd || path.resolve(entry.cwd) !== path.resolve(cwd) || !Array.isArray(entry.skills) || !Array.isArray(entry.errors)) throw new Error("Unknown native skills/list inventory shape or working directory");
  if (entry.errors.length) throw new Error("Native skills/list returned scan errors");
  const relevant = entry.skills.filter(s => s.pluginId === "chayen@codejadee");
  if (relevant.some(s => typeof s.enabled !== "boolean" || typeof s.name !== "string")) throw new Error("Unknown native Skill state");
  const names = relevant.filter(s => s.enabled).map(s => s.name.replace(/^chayen:/, "")).sort();
  if (JSON.stringify(names) !== JSON.stringify(wantEnabled ? expected : [])) throw new Error(`Native skills/list unexpected enabled inventory: ${JSON.stringify(names)}`);
  return names;
}
// Skills in a native inventory that come from outside the isolated profile (evolution Step 19). Codex 0.163.0 on
// Windows was observed reading the real user's ~/.agents/skills despite HOME/USERPROFILE/CODEX_HOME overrides.
// Counts by scope only: names and paths of personal Skills never enter evidence.
export function externalSkills(result, profile) {
  const realProfile = fs.realpathSync(profile), scopes = {};
  for (const s of result?.data?.[0]?.skills ?? []) {
    if (s.pluginId === "chayen@codejadee" || typeof s.path !== "string") continue;
    const p = path.resolve(s.path);
    if (p === realProfile || p.startsWith(realProfile + path.sep)) continue;
    scopes[s.scope ?? "unknown"] = (scopes[s.scope ?? "unknown"] ?? 0) + 1;
  }
  return { count: Object.values(scopes).reduce((a, b) => a + b, 0), scopes };
}
export function qualify(target, executables = {}, inherited = process.env) {
  authorize(inherited);
  const repo = fs.realpathSync(path.resolve(import.meta.dirname, "../.."));
  const homes = [os.homedir(), ...[".claude", ".codex", ".copilot", ".agents"].map(n => path.join(os.homedir(), n))];
  homes.push(...[inherited.CLAUDE_CONFIG_DIR, inherited.CODEX_HOME, inherited.COPILOT_HOME].filter(Boolean).map(p => path.resolve(p)));
  // Hash root-level provider state too, while allowing OS temp beneath the user home.
  const protectionOptions = { ignoreRuntimeCaches: true }, beforeEntries = configEntries(homes, protectionOptions);
  const before = configFingerprint(homes, protectionOptions), work = freshWork(target, repo, homes.filter(p => p !== os.homedir()));
  const report = { date: new Date().toISOString(), candidate: candidate(repo), providers: [], protections: {} };
  fs.writeFileSync(path.join(work, "candidate.json"), JSON.stringify(report.candidate, null, 2) + "\n");
  try {
    for (const provider of ["claude", "codex", "copilot"]) {
      const root = path.join(work, provider); fs.mkdirSync(root);
      const profile = path.join(root, "profile"); fs.mkdirSync(profile);
      const env = isolatedEnvironment(profile, inherited), marketplace = path.join(root, "marketplace"); copyMarketplace(repo, marketplace);
      const fixture = path.join(root, "fixture"); fs.mkdirSync(fixture); fs.writeFileSync(path.join(fixture, "app.txt"), "Disposable lifecycle application\n");
      const fixtureBefore = fingerprint(fixture).sha256, transcript = [], rows = [];
      let lastExternal = null;
      const executable = executables[provider] ?? provider;
      if (/\.(?:cmd|bat|ps1)$/i.test(executable)) throw new Error("Use a native executable, never a shell wrapper");
      const exec = args => {
        const r = spawnSync(executable, args, { cwd: fixture, env, encoding: "utf8", timeout: 30_000, maxBuffer: 8 * 1024 * 1024 });
        transcript.push({ args, exit: r.status, signal: r.signal, error: r.error?.code, stdout: r.stdout ?? "", stderr: r.stderr ?? "" });
        fs.writeFileSync(path.join(root, "transcript.json"), JSON.stringify(transcript, null, 2) + "\n");
        return r;
      };
      const invoke = args => { const r = exec(args); if (r.status !== 0 || r.error || r.signal) throw new Error(`Native command ${args.join(" ")} failed (exit ${r.status}, ${r.error?.code ?? r.stderr?.trim()})`); return r.stdout; };
      const version = exec(["--version"]);
      const entry = { provider, executable, version: version.status === 0 ? version.stdout.trim() : "unavailable", rows }; report.providers.push(entry);
      if (version.status !== 0 || !meetsMinimum(provider, version.stdout ?? "")) {
        for (const step of STEPS) rows.push({ step, result: "BLOCKED", reason: "Native executable unavailable or below release minimum; no installation or login attempted" });
      } else {
        const help = invoke(["plugin", "--help"]), marketHelp = invoke(["plugin", "marketplace", "--help"]);
        const has = token => new RegExp(`^\\s+${token}(?:\\||\\s|$)`, "m").test(help);
        let expected = fingerprint(path.join(marketplace, PACKAGE));
        const list = () => JSON.parse(invoke(["plugin", "list", "--json"]));
        const action = (step, fn) => { try { const detail = fn(); rows.push({ step, result: "PASS", ...detail }); return true; } catch (e) { rows.push({ step, result: e.blocked ? "BLOCKED" : "FAIL", reason: e.message }); return false; } };
        const blocked = step => rows.push({ step, result: "BLOCKED", reason: "An earlier prerequisite failed" });
        const registered = action("register", () => { invoke(["plugin", "marketplace", "add", marketplace]); return { output: invoke(["plugin", "marketplace", "list"]) }; });
        const installed = registered && action("install", () => ({ output: invoke(["plugin", provider === "codex" ? "add" : "install", "chayen@codejadee"]) }));
        if (!registered) blocked("install");
        if (installed) action("list", () => ({ output: list() })); else blocked("list");
        const records = () => { const value = list(); const items = Array.isArray(value) ? value : value.installed; if (!Array.isArray(items)) throw new Error("Unknown native list shape"); return items; };
        const record = (name = "chayen") => records().find(p => [p.id, p.pluginId, p.name].includes(name) || [p.id, p.pluginId].includes(`${name}@codejadee`));
        const assertAbsent = name => { if (record(name)) throw new Error(`${name} is still installed (disabled is not absent)`); };
        const activeBuild = () => {
          const r = record(); if (!r || r.enabled !== true) throw new Error("Native list does not confirm enabled installation");
          const version = json(path.join(marketplace, PACKAGE, "plugin.json")).version;
          if (r.version !== version) throw new Error(`Active version ${r.version} differs from expected ${version}`);
          const installPath = r.installPath ?? path.join(env.CODEX_HOME, "plugins/cache/codejadee/chayen", version);
          return { version, installPath, packageFingerprint: verifyInstalled(installPath, profile, expected) };
        };
        const inventory = wantEnabled => {
          if (provider === "claude") {
            const r = exec(["plugin", "details", "chayen@codejadee"]);
            if (!wantEnabled) throw Object.assign(new Error("plugin details enumerates disabled plugin contents too; this is not an activation test. Native list confirms disabled; model-session behavior requires separate authorized test access"), { blocked: true });
            if (r.status !== 0) throw new Error(`Native details failed: ${r.stderr}`);
            for (const name of report.candidate.skills) if (!r.stdout.includes(name)) throw new Error(`Native inventory omits ${name}`);
            return { loadedSkills: report.candidate.skills.length, output: r.stdout };
          }
          if (provider === "codex") {
            const r = spawnSync(process.execPath, [path.join(repo, "tests/provider-compatibility/codex-skills.mjs"), executable, fixture], { cwd: fixture, env: { ...env, CHAYEN_ALLOW_PROVIDER_LIFECYCLE: "1", CHAYEN_DISPOSABLE_ENVIRONMENT: "1" }, encoding: "utf8", timeout: 25_000 });
            transcript.push({ args: ["app-server", "initialize + skills/list (no thread/turn)"], exit: r.status, stdout: r.stdout, stderr: r.stderr });
            fs.writeFileSync(path.join(root, "transcript.json"), JSON.stringify(transcript, null, 2) + "\n");
            if (r.status !== 0) throw new Error(`Native skills/list unavailable: ${r.stderr}`);
            const result = JSON.parse(r.stdout), names = codexInventory(result, report.candidate.skills, wantEnabled, fixture);
            lastExternal = externalSkills(result, profile);
            return { loadedSkills: names.length, externalSkills: lastExternal, output: result };
          }
          throw new Error("Copilot inventory adapter requires installed-binary help review; follow runbook");
        };
        if (installed) {
          action("discover", () => ({ ...activeBuild(), ...inventory(true) }));
          // An inventory polluted from outside the profile breaks isolation; routing measured there is contaminated.
          if (provider === "codex") action("inventory-isolation", () => {
            if (!lastExternal) throw Object.assign(new Error("No native inventory to inspect"), { blocked: true });
            if (lastExternal.count) throw new Error(`${lastExternal.count} Skill(s) loaded from outside the isolated profile (by scope: ${JSON.stringify(lastExternal.scopes)}); names withheld`);
            return { externalSkills: lastExternal };
          });
          for (const [step, enabled] of [["disable", false], ["enable", true]]) {
            if (has(step)) action(step, () => { invoke(["plugin", step, provider === "copilot" ? "chayen" : "chayen@codejadee"]); if (record()?.enabled !== enabled) throw new Error("Native list toggle mismatch"); return { enabled }; });
            else {
              rows.push({ step, result: "UNSUPPORTED", reason: `No plugin ${step} subcommand; native alternative is the plugin enabled setting in disposable CODEX_HOME/config.toml` });
              if (provider === "codex") action(`${step}-native-config`, () => {
                const config = path.join(env.CODEX_HOME, "config.toml"), source = fs.readFileSync(config, "utf8");
                const section = /\[plugins\."chayen@codejadee"\]\s*\r?\nenabled = (true|false)/;
                if (!section.test(source)) throw new Error("Unknown native config shape; refusing rewrite");
                fs.writeFileSync(config, source.replace(section, `[plugins."chayen@codejadee"]\nenabled = ${enabled}`));
                if (record()?.enabled !== enabled) throw new Error("Native list did not read the configured state"); return { enabled };
              });
            }
            action(enabled ? "enabled-behavior" : "disabled-behavior", () => inventory(enabled));
          }
          const updated = action(has("update") ? "update" : "update-native-reinstall", () => {
            changeUpdateContent(marketplace); expected = fingerprint(path.join(marketplace, PACKAGE));
            if (has("update")) { invoke(["plugin", "marketplace", "update", "codejadee"]); invoke(["plugin", "update", provider === "copilot" ? "chayen" : "chayen@codejadee"]); }
            else if (provider === "codex") { invoke(["plugin", "remove", "chayen@codejadee"]); assertAbsent("chayen"); invoke(["plugin", "add", "chayen@codejadee"]); }
            else throw new Error("No reviewed native update alternative");
            return activeBuild();
          });
          if (!has("update")) rows.push({ step: "update", result: "UNSUPPORTED", reason: "No dedicated plugin update subcommand; remove/add is tested separately, marketplace upgrade refreshes Git catalog snapshots" });
          if (updated) action("updated-content", () => ({ ...activeBuild(), ...inventory(true) })); else blocked("updated-content");
          action("uninstall", () => ({ output: invoke(["plugin", provider === "codex" ? "remove" : "uninstall", provider === "copilot" ? "chayen" : "chayen@codejadee"]) }));
          action("absent", () => { assertAbsent("chayen"); return { output: list() }; });
          const reinstalled = action("reinstall", () => { invoke(["plugin", provider === "codex" ? "add" : "install", "chayen@codejadee"]); return activeBuild(); });
          if (reinstalled) action("restart", () => ({ ...activeBuild(), ...inventory(true), restart: "new native process; no reused model session" })); else blocked("restart");
          action("migration", () => {
            // Replay former identifier on the current Skill body; not a historical binary claim.
            invoke(["plugin", provider === "codex" ? "remove" : "uninstall", provider === "copilot" ? "chayen" : "chayen@codejadee"]); assertAbsent("chayen");
            for (const rel of [`${PACKAGE}/plugin.json`, `${PACKAGE}/.claude-plugin/plugin.json`, ...DESCRIPTORS]) {
              const file = path.join(marketplace, rel), data = json(file); if (data.plugins) data.plugins[0].name = "codejadee-chayen-framework"; else data.name = "codejadee-chayen-framework"; fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
            }
            if (provider === "claude") invoke(["plugin", "marketplace", "update", "codejadee"]);
            invoke(["plugin", provider === "codex" ? "add" : "install", "codejadee-chayen-framework@codejadee"]);
            if (!record("codejadee-chayen-framework")) throw new Error("Legacy fixture installation not visible");
            invoke(["plugin", provider === "codex" ? "remove" : "uninstall", provider === "copilot" ? "codejadee-chayen-framework" : "codejadee-chayen-framework@codejadee"]); assertAbsent("codejadee-chayen-framework");
            // Restore the exact candidate bytes, not the synthetic update build.
            for (const rel of [`${PACKAGE}/plugin.json`, `${PACKAGE}/.claude-plugin/plugin.json`, `${PACKAGE}/skills/chayen-backend/SKILL.md`, ...DESCRIPTORS]) fs.copyFileSync(path.join(repo, rel), path.join(marketplace, rel));
            expected = fingerprint(path.join(marketplace, PACKAGE));
            if (provider === "claude") invoke(["plugin", "marketplace", "update", "codejadee"]);
            invoke(["plugin", provider === "codex" ? "add" : "install", "chayen@codejadee"]);
            return { legacyAbsent: true, ...activeBuild(), ...inventory(true), fixture: "former identifier replay on current Skill body" };
          });
          action("cleanup-uninstall", () => { invoke(["plugin", provider === "codex" ? "remove" : "uninstall", provider === "copilot" ? "chayen" : "chayen@codejadee"]); assertAbsent("chayen"); });
        } else for (const step of STEPS.slice(3, -1)) blocked(step);
        if (registered) action("unregister", () => { invoke(["plugin", "marketplace", "remove", "codejadee"]); const output = invoke(["plugin", "marketplace", "list"]); if (/\bcodejadee\b/.test(output)) throw new Error("Marketplace still registered"); return { output }; }); else blocked("unregister");
        entry.commands = { disable: has("disable"), enable: has("enable"), update: has("update"), marketplaceUpgrade: /\bupgrade\b/.test(marketHelp) };
      }
      rows.push({ step: "fixture-unchanged", result: fingerprint(fixture).sha256 === fixtureBefore ? "PASS" : "FAIL" });
      assertTreeNoLinks(profile);
    }
  } finally {
    report.protections.realConfigsUnchanged = configFingerprint(homes, protectionOptions) === before;
    report.protections.noModelCalls = true;
    report.protections.realConfigFingerprintBefore = before;
    report.protections.realConfigFingerprintAfter = configFingerprint(homes, protectionOptions);
    report.protections.changedConfigurationPaths = configEntries(homes, protectionOptions).filter(([file, hash]) => beforeEntries.find(([name]) => name === file)?.[1] !== hash).map(([file]) => file);
    report.protections.excludedRuntimeCache = "models_cache.json only; no configuration, credential or registry exclusions";
    report.protections.sourcePackageUnchanged = fingerprint(path.join(repo, PACKAGE)).sha256 === report.candidate.package.sha256;
    fs.writeFileSync(path.join(work, "results.json"), JSON.stringify(report, null, 2) + "\n");
  }
  console.log(JSON.stringify({ work, providers: report.providers.map(p => ({ provider: p.provider, version: p.version, rows: p.rows.map(({ step, result, reason, version, loadedSkills }) => ({ step, result, reason, version, loadedSkills })) })), protections: report.protections }, null, 2));
  return report.providers.some(p => p.rows.some(r => r.result === "FAIL")) || !report.protections.realConfigsUnchanged || !report.protections.sourcePackageUnchanged ? 1 : report.providers.some(p => p.rows.some(r => r.result === "BLOCKED")) ? 2 : 0;
}
if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  try {
    const exe = Object.fromEntries(["claude", "codex", "copilot"].flatMap(p => { const i = process.argv.indexOf(`--${p}-exe`); return i < 0 ? [] : [[p, process.argv[i + 1]]]; }));
    process.exitCode = qualify(process.argv[2], exe);
  } catch (e) { console.error(e.message); process.exitCode = 2; }
}
