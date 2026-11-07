// Developer-only, offline. SkillSpector baseline fingerprints hash matched content, line endings included.
// The committed baseline must stay reviewable (one entry per finding, a reviewed reason, a real package file,
// no rule-wide suppression) and the package must check out LF on every platform so the hashes match.
// SkillSpector itself is not run here; the maintainer check is in SECURITY.md, "Scanner results".
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repo = path.resolve(import.meta.dirname, "../..");
const pkg = "plugins/codejadee-chayen-framework";
const baselineText = fs.readFileSync(path.join(repo, "security/skillspector-baseline.yaml"), "utf8");

function parseBaseline(text) {
  assert.match(text, /^version: 2$/m);
  assert.match(text, /^rules: \[\]$/m, "rule-wide suppressions would hide future true positives");
  const entries = [];
  const re = /^ {2}- hash: "sha256:([0-9a-f]{64})"\n {4}rule_id: "([A-Z]+\d+)"\n {4}file: "([^"]+)"\n {4}reason: "([^"]+)"$/gm;
  for (const m of text.replace(/\r\n/g, "\n").matchAll(re)) entries.push({ hash: m[1], rule: m[2], file: m[3], reason: m[4] });
  return entries;
}

test("every baseline entry is a reviewed, unique finding in a real package file", () => {
  const entries = parseBaseline(baselineText);
  const declared = (baselineText.match(/^ {2}- hash:/gm) ?? []).length;
  assert.ok(entries.length > 0);
  assert.equal(entries.length, declared, "every fingerprint carries rule_id, file and reason");
  assert.equal(new Set(entries.map((e) => e.hash)).size, entries.length, "duplicate fingerprint");
  for (const e of entries) {
    assert.match(e.reason, /^Reviewed guidance text, not behaviour: /, `${e.rule} ${e.file}: unreviewed reason`);
    assert.doesNotMatch(e.file, /\.\.|^\/|\\/, `${e.file}: path must stay inside the package`);
    assert.ok(fs.statSync(path.join(repo, pkg, e.file)).isFile(), `${e.file} is not a package file`);
  }
});

// Single-skill scans fingerprint paths relative to the skill folder, so each skill carries its own baseline.
// Each must hold exactly the package baseline's reviewed entries for that skill, with the same reasons.
test("per-skill baselines mirror the reviewed package baseline", () => {
  const dir = path.join(repo, "security/skillspector-baselines");
  const expected = new Map();
  for (const e of parseBaseline(baselineText)) {
    const m = /^skills\/([^/]+)\/(.+)$/.exec(e.file);
    if (!m) continue;
    const list = expected.get(m[1]) ?? expected.set(m[1], []).get(m[1]);
    list.push(`${e.rule}|${m[2]}|${e.reason}`);
  }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort();
  assert.deepEqual(files.map((f) => f.slice(0, -5)), [...expected.keys()].sort(), "one baseline per skill with reviewed findings");
  for (const f of files) {
    const skill = f.slice(0, -5);
    const text = fs.readFileSync(path.join(dir, f), "utf8");
    const entries = parseBaseline(text);
    assert.equal(entries.length, (text.match(/^ {2}- hash:/gm) ?? []).length, `${f}: every fingerprint carries rule_id, file and reason`);
    assert.equal(new Set(entries.map((e) => e.hash)).size, entries.length, `${f}: duplicate fingerprint`);
    for (const e of entries) {
      assert.doesNotMatch(e.file, /\.\.|^\/|\\/, `${f} ${e.file}: path must stay inside the skill`);
      assert.ok(fs.statSync(path.join(repo, pkg, "skills", skill, e.file)).isFile(), `${f}: ${e.file} is not a skill file`);
    }
    assert.deepEqual(entries.map((e) => `${e.rule}|${e.file}|${e.reason}`).sort(), expected.get(skill).sort(), `${f}: out of sync with the package baseline`);
  }
});

test("the plugin package checks out with LF line endings on every platform", (t) => {
  const files = spawnSync("git", ["ls-files", "-z", "--", pkg], { cwd: repo, encoding: "utf8" });
  if (files.status !== 0) return t.skip("not a git checkout");
  const list = files.stdout.split("\0").filter(Boolean);
  assert.ok(list.length > 0);
  const attr = spawnSync("git", ["check-attr", "-z", "--stdin", "eol"], { cwd: repo, encoding: "utf8", input: list.join("\0") + "\0" });
  assert.equal(attr.status, 0, attr.stderr);
  const parts = attr.stdout.split("\0");
  const notLf = [];
  for (let i = 0; i + 2 < parts.length; i += 3) if (parts[i + 2] !== "lf") notLf.push(parts[i]);
  assert.deepEqual(notLf, [], "package files without eol=lf; baseline hashes would differ on CRLF checkouts");
});
