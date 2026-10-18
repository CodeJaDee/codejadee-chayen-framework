// Synthetic native-command responses only. No real provider executable is run.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { authorize, freshWork, isolatedEnvironment, installationState, listedEnabled, listedVersion, installedBuild, expectedBuild, changeUpdateContent, configFingerprint, meetsMinimum, main, runProvider, OPERATIONS } from "./lifecycle.mjs";
const repo = path.resolve(import.meta.dirname, "../..");
const pkg = "plugins/codejadee-chayen-framework";
function fixture(t) {
  const parent = fs.realpathSync(os.tmpdir()), dir = fs.mkdtempSync(path.join(parent, "chayen-lifecycle-test-"));
  t.after(() => { assert.equal(path.dirname(fs.realpathSync(dir)), parent); fs.rmSync(dir, { recursive: true }); });
  const marketplace = path.join(dir, "marketplace"), profile = path.join(dir, "profile");
  fs.mkdirSync(marketplace); fs.mkdirSync(profile);
  for (const rel of [pkg, ".github/plugin/marketplace.json"]) fs.cpSync(path.join(repo, rel), path.join(marketplace, rel), { recursive: true });
  return { dir, marketplace, profile };
}
function fake(ctx, opts = {}) {
  let installed = false, enabled = true, registered = false, activeVersion = expectedBuild(ctx.marketplace).version;
  const calls = [], cache = path.join(ctx.profile, "plugins/cache/chayen");
  const copy = () => fs.cpSync(path.join(ctx.marketplace, pkg), cache, { recursive: true });
  const execute = args => {
    calls.push(args);
    const key = args.join(" ");
    if (args.at(-1) === "--help") return { status: 0, stdout: "marketplace add install list disable enable update uninstall remove".split(" ").filter(s => s !== opts.missing).join("\n") };
    if (key === opts.failure) return { status: 7, stdout: "Installed 15 skills successfully" };
    if (key.startsWith("plugin marketplace add ")) registered = true;
    else if (key === "plugin marketplace remove codejadee") registered = false;
    else if (key === "plugin marketplace list") return { status: 0, stdout: registered ? "codejadee" : "No marketplaces registered" };
    else if (/^plugin (?:install|add) chayen@codejadee$/.test(key)) { installed = true; copy(); }
    else if (key === "plugin disable chayen@codejadee") enabled = false;
    else if (key === "plugin enable chayen@codejadee") enabled = true;
    else if (key === "plugin update chayen@codejadee") {
      if (!opts.staleUpdate) copy();
      else if (opts.versionOnly) {
        const file = path.join(cache, "plugin.json"), j = JSON.parse(fs.readFileSync(file)); j.version = expectedBuild(ctx.marketplace).version; fs.writeFileSync(file, JSON.stringify(j));
      }
      if (!opts.oldActiveVersion) activeVersion = expectedBuild(ctx.marketplace).version;
    } else if (/^plugin (?:uninstall|remove) chayen(?:@codejadee)?$/.test(key)) {
      if (opts.disableOnly) enabled = false; else installed = false;
    } else if (key === "plugin list") return { status: opts.listFailure ? 1 : 0, stdout: installed ? `chayen@codejadee\n  version ${activeVersion}, installed, ${enabled ? "enabled" : "disabled"}` : opts.ambiguousRemoval ? "Unexpected response" : "No plugins installed" };
    return { status: 0, stdout: "ok" };
  };
  return { execute, calls };
}
for (const env of [{}, { CHAYEN_ALLOW_PROVIDER_LIFECYCLE: "1" }, { CHAYEN_DISPOSABLE_ENVIRONMENT: "1" }]) test(`authorization refuses ${JSON.stringify(env)}`, () => assert.throws(() => authorize(env), /authorization/));
test("authorization requires both guards", () => assert.doesNotThrow(() => authorize({ CHAYEN_ALLOW_PROVIDER_LIFECYCLE: "1", CHAYEN_DISPOSABLE_ENVIRONMENT: "1" })));
test("fresh scratch rejects existing targets and repository/real profile descendants", t => {
  const ctx = fixture(t);
  assert.throws(() => freshWork(ctx.profile, repo, []), /existing/);
  assert.throws(() => freshWork(path.join(repo, "never-create"), repo, []), /outside/);
  assert.throws(() => freshWork(path.join(ctx.profile, "never-create"), repo, [ctx.profile]), /outside/);
});
test("child environment isolates all configuration homes and strips credentials", t => {
  const ctx = fixture(t), env = isolatedEnvironment(ctx.profile, { PATH: "safe", CODEX_HOME: "real", HOME: "real", OPENAI_API_KEY: "synthetic", NODE_OPTIONS: "bad", BASH_ENV: "bad" });
  for (const k of ["HOME", "USERPROFILE", "XDG_CONFIG_HOME", "APPDATA", "LOCALAPPDATA", "CLAUDE_CONFIG_DIR", "CODEX_HOME", "COPILOT_HOME", "TMP"]) assert.ok(env[k] === ctx.profile || env[k].startsWith(ctx.profile + path.sep));
  for (const k of ["OPENAI_API_KEY", "NODE_OPTIONS", "BASH_ENV"]) assert.equal(env[k], undefined);
  assert.equal(env.COPILOT_AUTO_UPDATE, "false"); assert.equal(env.DISABLE_AUTOUPDATER, "1");
  assert.throws(() => isolatedEnvironment(ctx.profile), /fresh/);
});
for (const [text, state] of [
  ["chayen@codejadee\n  disabled", true], ["chayen available", false], ["chayen not installed", false], ["chayen ???", null], ["", null],
  ['[{"name":"chayen","enabled":false}]', true], ['[{"name":"chayen","installed":false}]', false], ["No plugins installed", false],
]) test(`installation state: ${text || "empty"}`, () => assert.equal(installationState(text), state));
for (const provider of ["claude", "codex", "copilot"]) test(`${provider}: full lifecycle checks actual cache and removal`, t => {
  const ctx = fixture(t), mock = fake(ctx), rows = runProvider(provider, ctx, mock.execute);
  assert.deepEqual(rows.map(r => r.step), OPERATIONS); assert.ok(rows.every(r => r.result === "PASS"), JSON.stringify(rows));
});
for (const [name, opts, step] of [
  ["nonzero install with misleading success text", { failure: "plugin install chayen@codejadee" }, "install"],
  ["uninstall merely disables", { disableOnly: true }, "uninstall"],
  ["list command fails", { listFailure: true }, "install"],
  ["update leaves old cache", { staleUpdate: true }, "update"],
  ["update changes version only", { staleUpdate: true, versionOnly: true }, "update"],
  ["new cache exists but active version remains old", { oldActiveVersion: true }, "update"],
  ["ambiguous list cannot prove uninstall", { ambiguousRemoval: true }, "uninstall"],
  ["nonzero update", { failure: "plugin update chayen@codejadee" }, "update"],
  ["nonzero uninstall", { failure: "plugin uninstall chayen@codejadee" }, "uninstall"],
]) test(name, t => {
  const ctx = fixture(t), mock = fake(ctx, opts), rows = runProvider("claude", ctx, mock.execute);
  assert.equal(rows.find(r => r.step === step).result, "FAIL", JSON.stringify(rows));
});
for (const missing of ["disable", "enable", "update", "install", "list"]) test(`missing command ${missing} is NOT_RUN, never invoked`, t => {
  const ctx = fixture(t), mock = fake(ctx, { missing }), rows = runProvider("claude", ctx, mock.execute);
  const step = { list: "discover", install: "install" }[missing] ?? missing;
  assert.equal(rows.find(r => r.step === step).result, "NOT_RUN");
  assert.ok(!mock.calls.some(args => args[0] === "plugin" && args[1] === missing && args.at(-1) !== "--help"));
});
test("update only mutates scratch, all four fields and content change", t => {
  const ctx = fixture(t), original = expectedBuild(repo), before = expectedBuild(ctx.marketplace), after = changeUpdateContent(ctx.marketplace);
  assert.notEqual(after.contentHash, before.contentHash); assert.notEqual(after.version, before.version); assert.deepEqual(expectedBuild(repo), original);
  const gh = JSON.parse(fs.readFileSync(path.join(ctx.marketplace, ".github/plugin/marketplace.json")));
  assert.equal(gh.metadata.version, after.version); assert.equal(gh.plugins[0].version, after.version);
  assert.equal(JSON.parse(fs.readFileSync(path.join(ctx.marketplace, pkg, ".claude-plugin/plugin.json"))).version, after.version);
});
test("wrong inventory fails cache verification", t => {
  const ctx = fixture(t); fs.cpSync(path.join(ctx.marketplace, pkg), path.join(ctx.profile, "cache"), { recursive: true });
  const skill = path.join(ctx.profile, "cache/skills/chayen-humanizer-th/SKILL.md"); fs.unlinkSync(skill);
  assert.equal(installedBuild(ctx.profile, expectedBuild(ctx.marketplace)), false);
});
test("configuration fingerprint detects content changes and creation", t => {
  const ctx = fixture(t), a = configFingerprint([ctx.profile]);
  fs.writeFileSync(path.join(ctx.profile, "config.toml"), "synthetic = 1"); const b = configFingerprint([ctx.profile]);
  assert.notEqual(a, b); fs.writeFileSync(path.join(ctx.profile, "config.toml"), "synthetic = 2"); assert.notEqual(b, configFingerprint([ctx.profile]));
});
test("toggle evidence must belong to chayen", () => {
  const text = JSON.stringify([{ name: "chayen", enabled: true }, { name: "other", enabled: false }], null, 2);
  assert.equal(listedEnabled(text, false), false); assert.equal(listedEnabled(text, true), true);
});
test("version evidence must belong to chayen", () => {
  assert.equal(listedVersion(JSON.stringify([{ name: "chayen", version: "old" }, { name: "other", version: "new" }]), "new"), false);
});
test("unknown JSON cannot prove absence", () => assert.equal(installationState('{"message":"unexpected response"}'), null));
test("entry point rejects missing authorization before creating scratch", t => {
  const ctx = fixture(t), target = path.join(ctx.dir, "never-created");
  assert.throws(() => main(target, {}), /authorization/); assert.equal(fs.existsSync(target), false);
});
test("linked provider profile is refused", t => {
  const ctx = fixture(t), link = path.join(ctx.dir, "linked-profile");
  fs.symlinkSync(ctx.profile, link, process.platform === "win32" ? "junction" : "dir");
  assert.throws(() => isolatedEnvironment(link), /symlink|junction/);
});
test("Copilot minimum uses bundled version; unparseable version fails", () => {
  for (const v of ["1.0.91", "Copilot CLI 1.1.0", "2.0.0"]) assert.equal(meetsMinimum("copilot", v), true);
  for (const v of ["1.0.68", "0.99.999", "unknown"]) assert.equal(meetsMinimum("copilot", v), false);
});
