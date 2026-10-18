// Current documentation contract regressions, exclusively in a disposable copy.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { inside, assertTreeNoLinks } from "../../tools/validate/safe-paths.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const parent = fs.realpathSync(os.tmpdir()), dir = fs.mkdtempSync(path.join(parent, "chayen-doc-tests-"));
for (const rel of ["README.md", "SECURITY.md", "CHANGELOG.md", "plugins", "catalog", "docs", "response-style", ".claude-plugin", ".agents", ".github", "tools", "tests/provider-compatibility", "tests/evaluation/README.md", "tests/evaluation/step40/README.md", "tests/ci"]) {
  const source = inside(repo, rel); assertTreeNoLinks(source); fs.cpSync(source, inside(dir, rel), { recursive: true });
}
test.after(() => { assert.equal(path.dirname(fs.realpathSync(dir)), parent); assert.ok(path.basename(dir).startsWith("chayen-doc-tests-")); fs.rmSync(dir, { recursive: true, force: true }); });
const run = () => {
  const r = spawnSync(process.execPath, [inside(repo, "tools/validate/check-docs.mjs"), "--root", dir], { cwd: repo, encoding: "utf8", timeout: 30_000 });
  assert.equal(r.error, undefined); assert.equal(r.signal, null);
  return { code: r.status, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
};
test("current user/release docs match canonical build and resolve links", () => { const r = run(); assert.equal(r.code, 0, r.out); });
for (const [name, from, to] of [
  ["Skill count", "| Entry Skills | 15 |", "| Entry Skills | 13 |"],
  ["package file count", "| Package files | 256 |", "| Package files | 255 |"],
  ["reference count", "| Skill references | 237 |", "| Skill references | 221 |"],
  ["metadata usage", "6,217 / 6,500 characters", "6,221 / 6,500 characters"],
  ["metadata budget", "6,217 / 6,500 characters", "6,217 / 5,500 characters"],
  ["plugin name", "| Plugin name | `chayen` |", "| Plugin name | `other` |"],
  ["marketplace", "| Marketplace name | `codejadee` |", "| Marketplace name | `other` |"],
  ["current version", "| Current version | `0.1.0-dev` |", "| Current version | `0.2.0-dev` |"],
]) test(`reject stale ${name}`, () => {
  const file = inside(dir, "README.md"), source = fs.readFileSync(file, "utf8"); assert.ok(source.includes(from));
  try { fs.writeFileSync(file, source.replace(from, to)); const r = run(); assert.equal(r.code, 1); assert.match(r.out, /ERROR D-06/); }
  finally { fs.writeFileSync(file, source); }
});
for (const [name, addition, expected] of [
  ["broken doc link", "\n[Missing](missing.md)\n", "D-01"],
  ["current prose stale count", "\nThis build has 13 Skills.\n", "D-06"],
  ["former install identity outside migration", "\nInstall codejadee-chayen-framework@codejadee.\n", "D-03"],
  ["wrong marketplace in an install command", "\nInstall chayen@other.\n", "D-03"],
  ["unbalanced historical markers", "\n<!-- historical:start -->\n13 Skills\n", "D-06"],
]) test(`reject ${name}`, () => {
  const file = inside(dir, "README.md"), source = fs.readFileSync(file, "utf8");
  try { fs.writeFileSync(file, source + addition); const r = run(); assert.equal(r.code, 1); assert.ok(r.out.includes(`ERROR ${expected}`), r.out); }
  finally { fs.writeFileSync(file, source); }
});
test("explicit historical Skill counts remain valid evidence", () => {
  const file = inside(dir, "docs/COMPATIBILITY_MATRIX.md"), source = fs.readFileSync(file, "utf8");
  try { fs.writeFileSync(file, source + "\n<!-- historical:start -->\nAn old build had 13 Skills.\n<!-- historical:end -->\n"); const r = run(); assert.equal(r.code, 0, r.out); }
  finally { fs.writeFileSync(file, source); }
});
