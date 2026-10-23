// Offline negative controls for qualification evidence; never invokes a provider.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { candidate, copyMarketplace, fingerprint, verifyInstalled, qualify, codexInventory, externalSkills, PACKAGE } from "./qualify-rc.mjs";
import { changeUpdateContent, configFingerprint } from "./lifecycle.mjs";
const repo = path.resolve(import.meta.dirname, "../..");
function fixture(t) {
  const parent = fs.realpathSync(os.tmpdir()), dir = fs.mkdtempSync(path.join(parent, "chayen-rc-tests-"));
  t.after(() => { assert.equal(path.dirname(fs.realpathSync(dir)), parent); assert.ok(path.basename(dir).startsWith("chayen-rc-tests-")); fs.rmSync(dir, { recursive: true }); });
  const market = path.join(dir, "marketplace"); copyMarketplace(repo, market);
  const profile = path.join(dir, "profile"); fs.mkdirSync(profile);
  const installed = path.join(profile, "cache"); fs.cpSync(path.join(market, PACKAGE), installed, { recursive: true });
  return { dir, market, profile, installed };
}
test("candidate records exact source and all marketplace version declarations", () => {
  const c = candidate(repo); assert.match(c.baseCommit, /^[a-f0-9]{40}$/); assert.equal(c.plugin, "chayen");
  assert.equal(c.version, c.claudeVersion); assert.equal(c.skills.length, 16); assert.equal(c.skillMetadataFingerprint, "411b6adbbea7e121");
  assert.equal(c.package.files.length, 263); assert.equal(c.marketplaces.length, 3);
  assert.equal(c.marketplaces[2].pluginVersion, c.version); assert.equal(c.marketplaces[2].metadataVersion, c.version);
  assert.equal(c.marketplaces[0].pluginVersion, null); assert.equal(c.marketplaces[1].pluginVersion, null);
});
test("full package fingerprint catches changes outside the backend sentinel", t => {
  const f = fixture(t), expected = fingerprint(path.join(f.market, PACKAGE)); assert.equal(verifyInstalled(f.installed, f.profile, expected), expected.sha256);
  fs.appendFileSync(path.join(f.installed, "skills/chayen-testing/SKILL.md"), "\nInjected stale content\n");
  assert.throws(() => verifyInstalled(f.installed, f.profile, expected), /fingerprint differs/);
});
test("correct content outside isolated profile cannot prove installation", t => {
  const f = fixture(t); assert.throws(() => verifyInstalled(path.join(f.market, PACKAGE), f.profile, fingerprint(path.join(f.market, PACKAGE))), /escapes/);
});
test("synthetic update is a newer RC and changes full package bytes only in scratch", t => {
  const f = fixture(t), before = candidate(repo), version = changeUpdateContent(f.market).version;
  assert.equal(version, "1.1.4-rc.1"); assert.notEqual(fingerprint(path.join(f.market, PACKAGE)).sha256, before.package.sha256);
  assert.deepEqual(candidate(repo), before);
});
test("qualification refuses missing opt-in before starting any executable", t => {
  const f = fixture(t), target = path.join(f.dir, "never-created"); assert.throws(() => qualify(target, {}, {}), /authorization/); assert.equal(fs.existsSync(target), false);
});
test("fingerprint refuses linked installed content", t => {
  const f = fixture(t), link = path.join(f.profile, "linked"); fs.symlinkSync(f.installed, link, process.platform === "win32" ? "junction" : "dir");
  assert.throws(() => fingerprint(link), /symlink|junction/);
});
test("volatile model catalogue cannot mask configuration drift", t => {
  const f = fixture(t), opts = { ignoreRuntimeCaches: true }, before = configFingerprint([f.profile], opts);
  fs.writeFileSync(path.join(f.profile, "models_cache.json"), "synthetic cache refresh");
  assert.equal(configFingerprint([f.profile], opts), before);
  fs.writeFileSync(path.join(f.profile, "config.toml"), "changed = true");
  assert.notEqual(configFingerprint([f.profile], opts), before);
  assert.notEqual(configFingerprint([f.profile]), before);
});
test("unknown, wrong-directory or errored inventory cannot prove disabled absence", () => {
  const cwd = repo;
  for (const result of [{}, { data: [] }, { data: [{ skills: [], errors: [] }] }, { data: [{ cwd: "", skills: [], errors: [] }] }, { data: [{ cwd, skills: [] }] }, { data: [{ cwd: path.dirname(repo), skills: [], errors: [] }] }, { data: [{ cwd, skills: [], errors: [{ message: "scan failed" }] }] }]) assert.throws(() => codexInventory(result, [], false, cwd), /Unknown|scan errors/);
});
test("Skills from outside the isolated profile are counted by scope, without names", t => {
  const f = fixture(t), inProfile = path.join(f.profile, ".codex", "skills", ".system", "x", "SKILL.md"), outside = path.join(f.dir, "real-home", ".agents", "skills", "personal", "SKILL.md");
  const result = { data: [{ cwd: repo, errors: [], skills: [
    { name: "chayen:chayen-data", pluginId: "chayen@codejadee", path: path.join(f.installed, "skills/chayen-data/SKILL.md"), scope: "user" },
    { name: "system-skill", path: inProfile, scope: "system" },
    { name: "personal-a", path: outside, scope: "user" }, { name: "personal-b", path: outside, scope: "user" }, { name: "repo-skill", path: path.join(f.dir, "repo", "SKILL.md"), scope: "repo" },
  ] }] };
  const e = externalSkills(result, f.profile);
  assert.deepEqual(e, { count: 3, scopes: { user: 2, repo: 1 } });
  assert.doesNotMatch(JSON.stringify(e), /personal|repo-skill|real-home/);
  assert.deepEqual(externalSkills({ data: [{ skills: [result.data[0].skills[0], result.data[0].skills[1]] }] }, f.profile), { count: 0, scopes: {} });
});
test("native namespaced inventory is attributed to the exact plugin", () => {
  const expected = candidate(repo).skills, skills = expected.map(n => ({ name: `chayen:${n}`, pluginId: "chayen@codejadee", enabled: true }));
  assert.deepEqual(codexInventory({ data: [{ cwd: repo, skills, errors: [] }] }, expected, true, repo), expected);
  assert.throws(() => codexInventory({ data: [{ cwd: repo, skills: skills.map(s => ({ ...s, pluginId: "other@other" })), errors: [] }] }, expected, true, repo), /unexpected enabled inventory/);
  assert.deepEqual(codexInventory({ data: [{ cwd: repo, skills: [], errors: [] }] }, expected, false, repo), []);
});
