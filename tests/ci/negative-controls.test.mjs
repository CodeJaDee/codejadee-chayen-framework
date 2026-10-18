// CI failure demonstrations run only against scratch copies. No providers/network.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { inside, assertTreeNoLinks } from "../../tools/validate/safe-paths.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const parent = fs.realpathSync(os.tmpdir()), scratch = fs.mkdtempSync(path.join(parent, "chayen-ci-controls-"));
const copy = ["plugins", "catalog", "tests/skills", "tests/provider-compatibility", ".claude-plugin", ".agents/plugins", ".github/plugin"];
const manifest = "plugins/codejadee-chayen-framework/plugin.json";
const reference = "plugins/codejadee-chayen-framework/skills/chayen-frontend/SKILL.md";
const notice = "plugins/codejadee-chayen-framework/skills/chayen-humanizer-en/references/upstream-notice.md";
const hash = rel => crypto.createHash("sha256").update(fs.readFileSync(inside(repo, rel))).digest("hex");
const original = [manifest, reference, notice].map(hash);
test.after(() => {
  assert.deepEqual([manifest, reference, notice].map(hash), original, "real source files must remain byte-identical");
  assert.equal(path.dirname(fs.realpathSync(scratch)), parent);
  assert.ok(path.basename(scratch).startsWith("chayen-ci-controls-"));
  fs.rmSync(scratch, { recursive: true, force: true });
});
function fixture(name) {
  const dir = inside(scratch, name); fs.mkdirSync(dir);
  for (const rel of copy) { const src = inside(repo, rel); assertTreeNoLinks(src); fs.cpSync(src, inside(dir, rel), { recursive: true }); }
  return dir;
}
function run(script, root, positional = false) {
  const r = spawnSync(process.execPath, [inside(repo, script), ...(positional ? [root] : ["--root", root])], { cwd: repo, encoding: "utf8", timeout: 30_000 });
  assert.equal(r.error, undefined); assert.equal(r.signal, null);
  return { code: r.status, output: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}
test("clean scratch baseline passes package and MIT notice checks", () => {
  const dir = fixture("baseline");
  assert.equal(run("tools/validate/validate-package.mjs", dir, true).code, 0);
  assert.equal(run("tools/validate/check-hardening.mjs", dir).code, 0);
});
const mutations = JSON.parse(fs.readFileSync(inside(repo, "tests/skills/validator-mutations.json"), "utf8")).cases;
for (const id of ["sk-manifest-invalid-json", "sk-broken-reference-path"]) test(`CI rejects ${id} using the existing mutation specification`, () => {
  const spec = mutations.find(c => c.id === id); assert.ok(spec);
  const dir = fixture(id);
  for (const e of spec.edits) {
    const file = inside(dir, e.file);
    if (e.op === "write") fs.writeFileSync(file, e.content);
    else {
      assert.equal(e.op, "replace"); const body = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
      assert.equal(body.split(e.find).length - 1, 1); fs.writeFileSync(file, body.replace(e.find, e.with));
    }
  }
  const result = run("tools/validate/validate-package.mjs", dir, true);
  assert.equal(result.code, 1, result.output);
  assert.ok(result.output.includes(`ERROR ${spec.expect.error}`), result.output);
  console.log(`DETECTED ${id}: exit 1, ${spec.expect.error}`);
});
test("CI rejects a missing upstream MIT notice", () => {
  const dir = fixture("missing-notice"); fs.unlinkSync(inside(dir, notice));
  const result = run("tools/validate/check-hardening.mjs", dir);
  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /ERROR H-LICENSE upstream notice missing/);
  console.log("DETECTED missing-upstream-notice: exit 1, H-LICENSE");
});
