// Step 39 disposable-fixture tests for the opt-in response style setup rules.
// Every fixture lives in a fresh temporary directory that is removed afterwards. No real user or
// repository instruction file is read or written, and no provider, model or network call is made.
// Usage: node --test tests/response-style/setup-fixtures.test.mjs

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { loadPolicy, inspect, planAdd, planRemove, diff, copilotTemplate, COPILOT_FRONTMATTER } from "../../tools/response-style/policy-lib.mjs";

const repo = path.resolve(import.meta.dirname, "..", "..");
const cli = path.join(repo, "tools/response-style/inspect-instructions.mjs");
const policy = loadPolicy(repo);
const v0 = policy.text.replace(/v1 -->/g, "v0 -->").replace("Advisory guidance", "Older guidance");
const existing = "# Team rules\n\nUse pnpm, not npm.\nReply in English in pull request text.\n";

function scratch(t) {
  const dir = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), "chayen-rs-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}
function snapshot(dir) {
  return fs.readdirSync(dir).sort().map((f) => {
    const s = fs.statSync(path.join(dir, f));
    return `${f} ${s.size} ${s.mtimeMs} ${crypto.createHash("sha256").update(fs.readFileSync(path.join(dir, f))).digest("hex")}`;
  });
}
const run = (...args) => spawnSync(process.execPath, [cli, ...args], { encoding: "utf8", timeout: 30_000 });

test("canonical policy is one marked block and the Copilot template embeds it unchanged", () => {
  assert.equal(policy.version, 1);
  assert.ok(policy.text.startsWith("<!-- BEGIN chayen-response-style v1 -->\n"));
  assert.equal(fs.readFileSync(path.join(repo, "response-style/chayen-response-style.instructions.md"), "utf8").replace(/\r\n/g, "\n"), copilotTemplate(policy));
});

test("missing file: setup creates exactly the canonical content", () => {
  const p = planAdd(null, policy);
  assert.equal(p.action, "create");
  assert.equal(p.next, policy.text);
  assert.equal(inspect(p.next, policy).state, "current");
});

test("existing instructions are preserved byte for byte and setup is idempotent", () => {
  const p = planAdd(existing, policy);
  assert.equal(p.action, "append");
  assert.ok(p.next.startsWith(existing));
  assert.equal(inspect(p.next, policy).state, "current");
  const again = planAdd(p.next, policy);
  assert.equal(again.action, "none");
  assert.equal(again.next, p.next);
});

test("CRLF files keep CRLF line endings and round-trip through removal", () => {
  const crlf = existing.replace(/\n/g, "\r\n");
  const added = planAdd(crlf, policy).next;
  assert.ok(added.startsWith(crlf));
  assert.equal(added.replace(/\r\n/g, "").includes("\n"), false, "no bare LF introduced");
  const removed = planRemove(added, policy);
  assert.equal(removed.action, "remove");
  assert.equal(removed.next, crlf);
});

test("removal restores the original bytes and leaves unrelated content", () => {
  const added = planAdd(existing, policy).next + "\nLater rule added by the user.\n";
  const removed = planRemove(added, policy).next;
  assert.equal(removed, existing + "\nLater rule added by the user.\n");
  assert.equal(planRemove(planAdd(existing, policy).next, policy).next, existing);
});

test("a file without a trailing newline gains only that newline after add and remove", () => {
  const text = "Use pnpm.";
  const added = planAdd(text, policy).next;
  assert.ok(added.startsWith("Use pnpm.\n\n<!-- BEGIN"));
  assert.equal(planRemove(added, policy).next, "Use pnpm.\n");
});

test("a policy-only file is deleted on removal, not left empty", () => {
  const r = planRemove(policy.text, policy);
  assert.equal(r.action, "delete-file");
});

test("an outdated block is replaced in place without touching surrounding text", () => {
  const before = "Intro line.\n\n", after = "\n## Other section\nKeep me.\n";
  const p = planAdd(before + v0 + after, policy);
  assert.equal(p.action, "update");
  assert.equal(p.next, before + policy.text + after);
});

for (const [name, text, expectRemove] of [
  ["modified", policy.text.replace("Stop when the question is answered.", "Stop early."), "delete-file"],
  ["duplicate", policy.text + "\n" + policy.text, "refuse"],
  ["malformed", policy.text.replace("<!-- END chayen-response-style v1 -->", ""), "refuse"],
  ["malformed", policy.text.replace("<!-- END chayen-response-style v1 -->", "<!-- END chayen-response-style v2 -->"), "refuse"],
  ["newer", policy.text.replace(/v1 -->/g, "v2 -->"), "delete-file"],
]) {
  test(`${name} block: setup refuses and explains instead of guessing`, () => {
    assert.equal(inspect(text, policy).state, name);
    const p = planAdd(text, policy);
    assert.equal(p.action, "refuse");
    assert.ok(p.reason.length > 10);
    assert.equal(planRemove(text, policy).action, expectRemove);
  });
}

test("an unmarked pasted copy blocks setup to avoid loading the policy twice", () => {
  const pasted = existing + "\n" + policy.body + "\n";
  const r = inspect(pasted, policy);
  assert.equal(r.unmarkedCopy, true);
  assert.equal(planAdd(pasted, policy).action, "refuse");
});

test("overlapping language and tone instructions are reported for review, never changed", () => {
  const text = "Use pnpm.\nReply in English in pull request text.\nตอบเป็นภาษาไทยเสมอ\nKeep the tone formal.\n";
  const r = inspect(text, policy);
  assert.deepEqual(r.overlap.map((o) => o.line), [2, 3, 4]);
  assert.ok(planAdd(text, policy).next.startsWith(text));
  assert.deepEqual(inspect(policy.text, policy).overlap, [], "the block's own lines are not reported");
});

test("Copilot dedicated file: create, no-op, refuse foreign content, delete on removal", () => {
  const t = copilotTemplate(policy);
  assert.equal(planAdd(null, policy, { format: "copilot-instructions" }).next, t);
  assert.equal(planAdd(t, policy, { format: "copilot-instructions" }).action, "none");
  assert.equal(planAdd("---\napplyTo: '**/*.ts'\n---\nTeam rule.\n", policy, { format: "copilot-instructions" }).action, "refuse");
  assert.equal(planAdd(COPILOT_FRONTMATTER + v0, policy, { format: "copilot-instructions" }).action, "update");
  assert.equal(planRemove(t, policy, { format: "copilot-instructions" }).action, "delete-file");
  assert.equal(planRemove(t + "Team rule.\n", policy, { format: "copilot-instructions" }).action, "refuse");
});

test("diff preview shows only the added block for an append", () => {
  const d = diff(existing, planAdd(existing, policy).next, "AGENTS.md");
  const body = d.split("\n").slice(3);
  assert.ok(body.every((l) => l.startsWith("+")));
  assert.match(d.split("\n")[2], /^@@ -4,0 \+5,\d+ @@$/);
});

test("the CLI never changes the fixture directory and signals review with exit 2", (t) => {
  const dir = scratch(t);
  fs.writeFileSync(path.join(dir, "AGENTS.md"), existing);
  fs.writeFileSync(path.join(dir, "CLAUDE.md"), policy.text);
  fs.writeFileSync(path.join(dir, "edited.md"), policy.text.replace("Stop when the question is answered.", "Stop early."));
  const before = snapshot(dir);
  const results = [
    run("status", path.join(dir, "AGENTS.md")),
    run("plan-add", path.join(dir, "AGENTS.md")),
    run("plan-add", path.join(dir, "missing.instructions.md"), "--format", "copilot-instructions"),
    run("plan-remove", path.join(dir, "CLAUDE.md")),
    run("plan-add", path.join(dir, "edited.md")),
    run("status", path.join(dir, "CLAUDE.md"), path.join(dir, "edited.md")),
    run("print", "copilot-instructions"),
  ];
  assert.deepEqual(snapshot(dir), before, "no file created, changed or removed");
  assert.deepEqual(results.map((r) => r.status), [0, 0, 0, 0, 2, 2, 0]);
  assert.match(results[1].stdout, /did not change anything/);
  assert.match(results[5].stdout, /appears in 2 of the named files/);
  assert.equal(results[6].stdout, copilotTemplate(policy));
});

test("the setup helper source imports no process or network module and uses only read-only fs calls", () => {
  for (const f of ["tools/response-style/policy-lib.mjs", "tools/response-style/inspect-instructions.mjs"]) {
    const src = fs.readFileSync(path.join(repo, f), "utf8");
    const imports = [...src.matchAll(/^import .* from "([^"]+)";$/gm)].map((m) => m[1]);
    assert.deepEqual(imports.filter((m) => !["node:fs", "node:path", "./policy-lib.mjs"].includes(m)), [], f);
    assert.doesNotMatch(src, /\b(?:require|import)\s*\(|\bfetch\s*\(|\bprocess\.binding\b/, f);
    const fsCalls = new Set([...src.matchAll(/\bfs\.(\w+)/g)].map((m) => m[1]));
    assert.deepEqual([...fsCalls].filter((c) => !["readFileSync", "lstatSync", "statSync", "realpathSync"].includes(c)), [], f);
  }
});
