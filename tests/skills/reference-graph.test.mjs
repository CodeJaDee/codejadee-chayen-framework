// Developer-only size and reference-graph fixtures (D-066, ADR-0013, evolution Step 04). Each test copies the
// package inputs into a disposable OS-temp directory, changes one Skill there, and runs the real package
// validator. Long files and deep reference chains must pass (sizes reported, advisory warnings only); cycles
// must be reported and terminate; missing targets, traversal, cross-skill links, symlinks, broken anchors and
// orphans must still fail. Offline; nothing is written to the repository. Never shipped.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { inside, assertTreeNoLinks } from "../../tools/validate/safe-paths.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const COPY = ["plugins", ".claude-plugin", ".github/plugin", ".agents/plugins", "catalog", "tests/skills"];
const SKILL = "plugins/codejadee-chayen-framework/skills/chayen-init";
const REF = `${SKILL}/references/detection-and-refresh.md`;
// Diagnostics of the removed caps (300 lines, 2 hops). None may reappear.
const CAP_FAILURE = /lines > 300|exceeds 2 hops|V-06 line-budgets/;

function fixture(t) {
  const parent = fs.realpathSync(os.tmpdir()), root = fs.mkdtempSync(path.join(parent, "chayen-refgraph-"));
  t.after(() => { assert.equal(path.dirname(root), parent); fs.rmSync(root, { recursive: true, force: true }); });
  for (const rel of COPY) {
    const source = inside(repo, rel);
    assertTreeNoLinks(source);
    fs.cpSync(source, inside(root, rel), { recursive: true });
  }
  return root;
}
function validate(root) {
  const r = spawnSync(process.execPath, [inside(repo, "tools/validate/validate-package.mjs"), root], { cwd: repo, encoding: "utf8", timeout: 120_000 });
  return { code: r.status, signal: r.signal, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}
const edit = (root, rel, change) => { const f = inside(root, rel); fs.writeFileSync(f, change(fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n"))); };
const write = (root, rel, text) => fs.writeFileSync(inside(root, rel), text);
const lines = (n, what) => Array.from({ length: n }, (_, i) => `- ${what} ${i + 1}: confirm the recorded value against its source file before relying on it.`).join("\n");
// A checklist reference that conditionally points to the next file in a chain.
const hop = (n, next) => `---\nkind: checklist\n---\n# Detail ${n}\n\n## Purpose\n\nRead this file only when the previous step names it for the current task.\n\n## Next\n\n${next ? `Continue with [detail ${next}](hop-${next}.md) only if the task needs that detail.` : "No further detail is linked from here."}\n`;
const linkFromRef = (root, target) => edit(root, REF, (t) => `${t}\n## Further detail\n\nOnly when a unit needs more detail, read [the next file](${target}).\n`);

function passes(r) {
  assert.equal(r.signal, null, "validator was killed (timeout or recursion)");
  assert.equal(r.code, 0, r.out.split("\n").filter((l) => l.startsWith("ERROR")).join("\n"));
  assert.doesNotMatch(r.out, CAP_FAILURE);
}
function fails(r, expected) {
  assert.equal(r.signal, null, "validator was killed (timeout or recursion)");
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, expected);
  assert.doesNotMatch(r.out, CAP_FAILURE);
}

test("the unchanged package passes with sizes reported and no size or depth error", (t) => {
  const r = validate(fixture(t));
  passes(r);
  assert.match(r.out, /PASS {2}V-06 size-report: no size cap \(D-066\); largest SKILL\.md .* lines \(~\d+ tokens\)/);
  assert.match(r.out, /PASS {2}V-08 links: \d+ Markdown files: .*no depth cap.*; max depth 1; 0 reference\(s\) reachable only transitively; 0 cycle\(s\)/);
});

test("a valid SKILL.md with more than 300 lines passes without a warning below the provider recommendation", (t) => {
  const root = fixture(t);
  // Short lines keep the estimate under ~5,000 tokens, so only the line count passes 300.
  const short = Array.from({ length: 150 }, (_, i) => `- Check ${i + 1}.`).join("\n");
  edit(root, `${SKILL}/SKILL.md`, (s) => s.replace("\n## Outputs\n", `\n${short}\n\n## Outputs\n`));
  const r = validate(root);
  passes(r);
  const n = Number(/largest SKILL\.md chayen-init\/SKILL\.md (\d+) lines/.exec(r.out)?.[1]);
  assert.ok(n > 300 && n < 500, `expected a SKILL.md between 300 and 500 lines, got ${n}`);
  assert.doesNotMatch(r.out, /WARN {2}V-06/);
});

test("a SKILL.md above the provider recommendation passes with an advisory size warning", (t) => {
  const root = fixture(t);
  edit(root, `${SKILL}/SKILL.md`, (s) => s.replace("\n## Outputs\n", `\n${lines(400, "Detail")}\n\n## Outputs\n`));
  const r = validate(root);
  passes(r);
  const m = /WARN {2}V-06 size-report: chayen-init\/SKILL\.md: (\d+) lines, ~\d+ tokens, loaded on every activation .* Advisory/.exec(r.out);
  assert.ok(m && Number(m[1]) > 500, r.out);
});

test("a valid reference document with more than 300 lines passes", (t) => {
  const root = fixture(t);
  edit(root, REF, (s) => `${s}\n## Extended notes\n\n${lines(320, "Note")}\n`);
  const r = validate(root);
  passes(r);
  const n = Number(/largest reference skills\/chayen-init\/references\/detection-and-refresh\.md (\d+) lines/.exec(r.out)?.[1]);
  assert.ok(n > 300, `expected the extended reference to be the largest, above 300 lines; got ${n}`);
});

test("a valid reference chain 26 links deep passes, with transitive references reported", (t) => {
  const root = fixture(t);
  for (let n = 1; n <= 25; n++) write(root, `${SKILL}/references/hop-${n}.md`, hop(n, n < 25 ? n + 1 : null));
  linkFromRef(root, "hop-1.md");
  const r = validate(root);
  passes(r);
  assert.match(r.out, /WARN {2}V-08 links: chayen-init: 25 reference\(s\) reachable only through other references \(.*references\/hop-25\.md at depth 26\)/);
  assert.match(r.out, /max depth 26; 25 reference\(s\) reachable only transitively; 0 cycle\(s\)/);
});

test("a reference cycle is reported and validation terminates", (t) => {
  const root = fixture(t);
  write(root, `${SKILL}/references/hop-1.md`, hop(1, 2));
  write(root, `${SKILL}/references/hop-2.md`, hop(2, 3));
  write(root, `${SKILL}/references/hop-3.md`, hop(3, 1));
  linkFromRef(root, "hop-1.md");
  const r = validate(root);
  passes(r);
  assert.match(r.out, /WARN {2}V-08 links: chayen-init: reference cycle references\/hop-1\.md → references\/hop-2\.md → references\/hop-3\.md → references\/hop-1\.md/);
  assert.match(r.out, /1 cycle\(s\)/);
});

test("a 500-file cycle terminates without recursion overflow", (t) => {
  const root = fixture(t);
  for (let n = 1; n <= 500; n++) write(root, `${SKILL}/references/hop-${n}.md`, hop(n, n < 500 ? n + 1 : 1));
  linkFromRef(root, "hop-1.md");
  const r = validate(root);
  passes(r);
  assert.match(r.out, /max depth 501; 500 reference\(s\) reachable only transitively; 1 cycle\(s\)/);
});

const FAULTS = [
  ["a missing target", /ERROR V-08 links: .*chayen-init\/SKILL\.md: broken link "references\/missing\.md" \(target does not exist\)/,
    (root) => edit(root, `${SKILL}/SKILL.md`, (s) => s.replace("(references/detection-and-refresh.md)", "(references/missing.md)"))],
  ["a path traversal outside the skill", /ERROR V-08 links: .*detection-and-refresh\.md: link "\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/outside\.md" leaves the skill directory/,
    (root) => linkFromRef(root, "../../../../../../outside.md")],
  ["a percent-encoded traversal into another skill", /ERROR V-08 links: .*points into another skill \(chayen-testing\)/,
    (root) => linkFromRef(root, "%2E%2E/%2E%2E/chayen-testing/SKILL.md")],
  ["a cross-skill reference", /ERROR V-08 links: .*link "\.\.\/\.\.\/chayen-testing\/references\/test-strategy\.md" points into another skill \(chayen-testing\); hand off by name instead/,
    (root) => linkFromRef(root, "../../chayen-testing/references/test-strategy.md")],
  ["a broken heading anchor", /ERROR V-08 links: .*chayen-init\/SKILL\.md: link "references\/detection-and-refresh\.md#no-such-heading" points to a missing heading anchor/,
    (root) => edit(root, `${SKILL}/SKILL.md`, (s) => s.replace("(references/detection-and-refresh.md)", "(references/detection-and-refresh.md#no-such-heading)"))],
  ["a link to a directory", /ERROR V-08 links: .*link "\.\.\/references" does not point to a file/,
    (root) => linkFromRef(root, "../references")],
  ["an orphaned reference", /ERROR V-08 links: chayen-init\/references\/orphan\.md is not reachable from SKILL\.md through any chain of links \(orphaned reference, RF-02\)/,
    (root) => write(root, `${SKILL}/references/orphan.md`, hop("orphan", null))],
  ["orphans that only link to each other", /ERROR V-08 links: chayen-init\/references\/hop-1\.md is not reachable[\s\S]*ERROR V-08 links: chayen-init\/references\/hop-2\.md is not reachable/,
    (root) => { write(root, `${SKILL}/references/hop-1.md`, hop(1, 2)); write(root, `${SKILL}/references/hop-2.md`, hop(2, 1)); }],
];
for (const [label, expected, mutate] of FAULTS) {
  test(`fails on ${label}`, (t) => {
    const root = fixture(t);
    mutate(root);
    fails(validate(root), expected);
  });
}

test("fails on a symlink or junction inside a skill", (t) => {
  const root = fixture(t);
  const target = inside(root, "plugins/codejadee-chayen-framework/skills/chayen-testing/references");
  const link = path.join(inside(root, `${SKILL}/references`), "linked");
  try { fs.symlinkSync(target, link, process.platform === "win32" ? "junction" : "dir"); }
  catch (e) { t.skip(`cannot create a directory link on this host: ${e.code}`); return; }
  fails(validate(root), /ERROR V-09 plugin-content: refusing symlink or junction/);
});
