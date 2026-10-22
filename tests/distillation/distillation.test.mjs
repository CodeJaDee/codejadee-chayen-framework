// Developer-only distillation workflow regressions (evolution Step 12, D-069). Exercises the six stages of
// tools/evals/distill.mjs in memory or on disposable OS-temp copies of the repository. Live comparisons
// use test-only copies of the Step 11 synthetic transcripts with the synthetic marker removed, written
// only inside the temporary copy; no provider is called and no committed record claims a live run.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { checkProposal, checkAll, parseDiff, applyDiff, routingImpact, sha256, ROOT_CAUSES, ACTIONS, ALLOWED, OFFLINE, DIR } from "../../tools/evals/distill.mjs";
import { validateAll as validateFailures } from "../../tools/evals/failure-cases.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const TOOL = path.join(repo, "tools/evals/distill.mjs");
const name = (id, root = repo) => fs.readdirSync(path.join(root, DIR)).find((n) => n.startsWith(`${id}-`) && n.endsWith(".json"));
const load = (id, root = repo) => JSON.parse(fs.readFileSync(path.join(root, DIR, name(id, root)), "utf8"));
const failures = validateFailures(repo);
const check = (p, root = repo, f = failures) => checkProposal(root, p, `${DIR}/${p.id}-x.json`, f, { offline: false });
const has = (r, text) => [...r.errors, ...r.returns].some((e) => e.includes(text));
const transcript = (n) => fs.readFileSync(path.join(repo, "tests/failures/transcripts", n), "utf8").split("\n").slice(1).join("\n");
const approved = (p, status = "approved") => ({ ...p, review: { ...p.review, humanReview: { status, reviewer: "Maintainer A", date: "2026-10-22", notes: "reviewed" } } });

function withCopy(fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "chayen-distill-test-"));
  const skip = new Set([".git", "node_modules", "bin", "obj"]);
  try { fs.cpSync(repo, root, { recursive: true, filter: (s) => !skip.has(path.basename(s)) }); return fn(root); }
  finally { fs.rmSync(root, { recursive: true, force: true }); }
}
let seq = 0;
function run(root, source, revision, extra = {}) {
  const text = transcript(source), file = `tests/failures/transcripts/test-live-${++seq}.jsonl`;
  fs.writeFileSync(path.join(root, file), text);
  return { transcript: file, provider: "claude", model: "test-model", revision, authorization: "test-only authorization", date: "2026-10-22", sha256: crypto.createHash("sha256").update(text).digest("hex"), ...extra };
}
const arms = (root, base, cand) => ({ comparison: {
  baseline: base.map((s) => run(root, s, "3f8ee6b")),
  candidate: cand.map((s) => run(root, s, "abc1234")),
} });
const decide = (root, p) => { const r = checkProposal(root, p, `${DIR}/${p.id}-x.json`, validateFailures(root), { offline: false }); return { ...r, decision: r.decision ?? `INVALID: ${r.errors.join("; ")}` }; };
const F = "FC-0002.failing.jsonl", C = "FC-0002.control.jsonl";

test("shipped proposals: three pending review, the demonstration returned; nothing is applied to the plugin", () => {
  const { errors, proposals } = checkAll(repo, { offline: false });
  assert.deepEqual(errors, []);
  assert.deepEqual(proposals.map((p) => [p.id, p.failureCase, p.decision]), [["DP-0001", "FC-0002", "PENDING_REVIEW"], ["DP-0002", "FC-0001", "PENDING_REVIEW"], ["DP-0003", "FC-0003", "PENDING_REVIEW"], ["DP-0004", "FC-0003", "RETURNED_FOR_REVISION"]]);
  for (const p of proposals) for (const t of load(p.id).action.targets) assert.equal(sha256(fs.readFileSync(path.join(repo, t.path), "utf8")), t.baseSha256, `${t.path} unchanged`);
  assert.deepEqual(proposals.map((p) => p.stages.collect.modelBehaviour), ["NOT_RUN", "NOT_RUN", "NOT_RUN", "NOT_RUN"]);
});

test("collect: the failure case must exist, be valid and keep its evidence", () => withCopy((root) => {
  assert.ok(has(check({ ...load("DP-0001"), failureCase: "FC-9999" }), "does not exist"));
  fs.rmSync(path.join(root, "tests/failures/transcripts/FC-0002.failing.jsonl"));
  assert.match(decide(root, load("DP-0001", root)).decision, /INVALID: collect: failure case FC-0002 is not valid/);
}));

test("diagnose: root cause, alternatives, evidence and confidence are checked", () => {
  const p = load("DP-0001");
  assert.equal(ROOT_CAUSES.length, 8);
  assert.ok(has(check({ ...p, diagnosis: { ...p.diagnosis, rootCause: "bad-luck" } }), "rootCause must be one of"));
  assert.ok(has(check({ ...p, diagnosis: { ...p.diagnosis, confidence: "confirmed" } }), "needs a live replay that reproduced"));
  assert.ok(has(check({ ...p, diagnosis: { ...p.diagnosis, rejectedCauses: [] } }), "at least one alternative cause"));
  assert.ok(has(check({ ...p, diagnosis: { ...p.diagnosis, evidence: ["tests/failures/fixtures/orders-consumers/apps/shop/lib/order-status.ts:900"] } }), "does not resolve"));
});

test("distill: every root cause allows a non-Skill action, actions must fit the cause and the target, and no new file is possible", () => {
  for (const cause of ROOT_CAUSES) assert.ok(ALLOWED[cause].some((a) => !ACTIONS[a].behavioural), cause);
  for (const cause of ["poor-task-specification", "tool-or-model-limitation", "external-environment-failure"]) assert.ok(ALLOWED[cause].every((a) => !ACTIONS[a].behavioural), `${cause} never changes guidance`);
  for (const spec of Object.values(ACTIONS)) for (const bad of ["tools/evals/distill.mjs", "plugins/codejadee-chayen-framework/skills/chayen-new/SKILL.md".replace("chayen-new", "chayen-new/../x"), ".github/workflows/ci.yml"]) assert.ok(!spec.target(bad), bad);
  const p = load("DP-0001");
  assert.ok(has(check({ ...p, diagnosis: { ...p.diagnosis, rootCause: "tool-or-model-limitation", rejectedCauses: [{ cause: "incomplete-recipe", why: "x" }] } }), "does not address root cause"));
  assert.ok(has(check({ ...p, action: { ...p.action, kind: "clarify-entry-skill" } }), "is not a valid target for clarify-entry-skill"));
  assert.throws(() => parseDiff("--- /dev/null\n+++ b/plugins/codejadee-chayen-framework/skills/chayen-new/SKILL.md\n@@ -0,0 +1 @@\n+---\n"), /existing files only/);
});

test("diffs apply exactly in memory and reverse to the previous version", () => {
  for (const id of ["DP-0001", "DP-0002", "DP-0003", "DP-0004"]) {
    const p = load(id), [f] = parseDiff(fs.readFileSync(path.join(repo, p.action.diff), "utf8"));
    const before = fs.readFileSync(path.join(repo, f.path), "utf8").replace(/\r\n/g, "\n");
    const after = applyDiff(before, f);
    assert.notEqual(after, before);
    assert.equal(applyDiff(after, f, true), before, id);
    assert.throws(() => applyDiff(after, f), /does not apply/, `${id} cannot apply twice`);
  }
});

test("review: routing impact is computed from the change, not taken from the mentor", () => {
  const skill = fs.readFileSync(path.join(repo, "plugins/codejadee-chayen-framework/skills/chayen-data/SKILL.md"), "utf8").replace(/\r\n/g, "\n");
  const rel = "plugins/codejadee-chayen-framework/skills/chayen-data/SKILL.md";
  assert.equal(routingImpact(skill, skill.replace(/^description: (.*)$/m, "description: $1 Extra."), rel), "metadata");
  assert.equal(routingImpact(skill, skill.replace("## When not to use\n", "## When not to use\n\n- Extra exclusion.\n"), rel), "trigger-sections");
  assert.equal(routingImpact(skill, skill.replace("## Principles\n", "## Principles\n\n- Extra principle.\n"), rel), "none");
  const r = check(load("DP-0004"));
  assert.equal(r.decision, "RETURNED_FOR_REVISION");
  assert.ok(has(r, "routing impact is metadata, declared none") && has(r, "needs trigger cases"));
});

test("review: tests, regression references and an independent human reviewer are required", () => {
  const p = load("DP-0001");
  assert.ok(has(check({ ...p, review: { ...p.review, testsNeeded: ["tests/skills/recipe-cases.json#rc-01-004-pos-api-consumers"] } }), "must include the failure case replay"));
  assert.ok(has(check({ ...p, review: { ...p.review, testsNeeded: ["FC-0002"] } }), "regression reference"));
  assert.ok(has(check({ ...p, review: { ...p.review, humanReview: { status: "approved", reviewer: p.mentor.identity, date: "2026-10-22", notes: null } } }), "cannot review its own proposal"));
  assert.ok(has(check({ ...p, review: { ...p.review, humanReview: { status: "approved", reviewer: null, date: null, notes: null } } }), "needs reviewer and date"));
});

test("decisions follow the human review; approval alone never promotes behavioural guidance", () => {
  const p = load("DP-0001");
  assert.equal(check(p).decision, "PENDING_REVIEW");
  assert.equal(check({ ...approved(p, "changes-requested"), decision: "RETURNED_FOR_REVISION" }).decision, "RETURNED_FOR_REVISION");
  assert.equal(check({ ...approved(p, "rejected"), decision: "REJECTED" }).decision, "REJECTED");
  assert.equal(check({ ...approved(p), decision: "AWAITING_EVIDENCE" }).decision, "AWAITING_EVIDENCE");
  assert.ok(has(check({ ...approved(p), decision: "READY_TO_PROMOTE" }), "not supported by the evidence (derived AWAITING_EVIDENCE)"));
  assert.equal(check({ ...approved(load("DP-0002")), decision: "READY_TO_PROMOTE" }).decision, "READY_TO_PROMOTE", "a regression fixture needs no behaviour claim");
  assert.equal(check({ ...approved(load("DP-0003")), decision: "AWAITING_EVIDENCE" }).decision, "AWAITING_EVIDENCE", "a limitation needs a live reproduction first");
});

test("validate: a stale base, a diff that no longer applies or an oversized change is returned", () => withCopy((root) => {
  const p = load("DP-0001", root), target = path.join(root, p.action.targets[0].path);
  const original = fs.readFileSync(target, "utf8");
  fs.writeFileSync(target, original + "\nAppended by someone else.\n");
  assert.ok(has(decide(root, p), "changed since the proposal was written"));
  fs.writeFileSync(target, original.replace("   - the frontend calls that hit a changed endpoint;\n", "   - the frontend calls to a changed endpoint;\n"));
  const rebased = { ...p, action: { ...p.action, targets: [{ path: p.action.targets[0].path, baseSha256: sha256(fs.readFileSync(target, "utf8")) }] } };
  assert.ok(has(decide(root, rebased), "diff does not apply"));
  fs.writeFileSync(target, original);
  const big = ["--- a/" + p.action.targets[0].path, "+++ b/" + p.action.targets[0].path, "@@ -69,1 +69,22 @@", "-   - the frontend calls that hit a changed endpoint;", ...Array.from({ length: 22 }, (_, i) => `+   - line ${i}`)].join("\n") + "\n";
  fs.writeFileSync(path.join(root, p.action.diff), big);
  assert.ok(has(decide(root, p), "is not a minimal change"));
}));

test("validate: the fixed offline validators run on the candidate copy, and a change that breaks a guidance invariant is returned", () => withCopy((root) => {
  const rel = "plugins/codejadee-chayen-framework/skills/chayen-implementation/references/change-summary.md";
  const before = fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n/g, "\n");
  const lines = before.split("\n"), i = lines.findIndex((l) => l.includes("A criterion with no test is uncovered and"));
  assert.ok(i > 0);
  // The GI-03 statement mutation from G-18T, delivered as a mentor diff.
  const diff = [`--- a/${rel}`, `+++ b/${rel}`, `@@ -${i + 1},1 +${i + 1},1 @@`, `-${lines[i]}`, `+${lines[i].replace("A criterion with no test is uncovered and", "Missing evidence is marked accept when the build passes. A criterion with no test is uncovered and")}`].join("\n") + "\n";
  const p = { ...load("DP-0001", root), id: "DP-0099", title: "Test: weakens the no-test rule", failureCase: "FC-0003",
    diagnosis: { ...load("DP-0003", root).diagnosis, rootCause: "insufficient-verification", existingGuidance: [], rejectedCauses: [{ cause: "skill-routing", why: "x" }] },
    action: { kind: "modify-existing-recipe", targets: [{ path: rel, baseSha256: sha256(before) }], diff: `${DIR}/DP-0099.diff`, summary: "test" },
    review: { ...load("DP-0003", root).review, routingImpact: "none" }, decision: "RETURNED_FOR_REVISION" };
  fs.writeFileSync(path.join(root, DIR, "DP-0099.diff"), diff);
  const r = checkProposal(root, p, `${DIR}/DP-0099-x.json`, validateFailures(root), { offline: true });
  assert.equal(r.decision, "RETURNED_FOR_REVISION", r.errors.join("; "));
  assert.equal(r.stages.validate.offline.length, OFFLINE.length);
  assert.ok(r.stages.validate.offline.some((v) => !v.pass && v.label.startsWith("guidance invariants")));
  assert.ok(r.returns.some((x) => x.startsWith("validate: offline guidance invariants")));
  assert.equal(fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n/g, "\n"), before, "the candidate is applied only to a disposable copy");
}));

test("compare: only a demonstrated improvement is ready to promote; failed and inconclusive comparisons are rejected or returned", () => withCopy((root) => {
  const p = approved(load("DP-0001", root));
  const outcome = (base, cand) => decide(root, { ...p, validation: arms(root, base, cand), decision: "x" }).errors.find((e) => e.startsWith("decision"))?.match(/derived (\w+)/)?.[1];
  assert.equal(outcome([F, F, F], [C, C, C]), "READY_TO_PROMOTE");
  assert.equal(outcome([F, F, F], [F, F, F]), "REJECTED", "no improvement");
  assert.equal(outcome([F, F, F], [C, C, F]), "RETURNED_FOR_REVISION", "partial improvement");
  assert.equal(outcome([C, C, C], [C, C, C]), "RETURNED_FOR_REVISION", "baseline never reproduced");
  assert.equal(outcome([F], [C]), "AWAITING_EVIDENCE", "fewer than three runs per arm");
  const cut = run(root, F, "abc1234");
  fs.writeFileSync(path.join(root, cut.transcript), transcript(F).split("\n").filter((l) => !l.includes('"type":"result"')).join("\n"));
  cut.sha256 = crypto.createHash("sha256").update(fs.readFileSync(path.join(root, cut.transcript), "utf8")).digest("hex");
  const inconclusive = { comparison: { baseline: [F, F, F].map((s) => run(root, s, "3f8ee6b")), candidate: [run(root, C, "abc1234"), run(root, C, "abc1234"), cut] } };
  const r = decide(root, { ...p, validation: inconclusive, decision: "RETURNED_FOR_REVISION" });
  assert.equal(r.decision, "RETURNED_FOR_REVISION");
  assert.ok(r.returns.some((x) => x.includes("inconclusive")));
  const wrongBase = { comparison: { baseline: [run(root, F, "abc1234")], candidate: [run(root, C, "abc1234")] } };
  assert.match(decide(root, { ...p, validation: wrongBase }).decision, /baseline runs must use baseRevision/);
  const mixed = { comparison: { baseline: [run(root, F, "3f8ee6b")], candidate: [run(root, C, "abc1234", { model: "other-model" })] } };
  assert.match(decide(root, { ...p, validation: mixed }).decision, /never pooled/);
  const synthetic = { comparison: { baseline: [{ ...run(root, F, "3f8ee6b"), transcript: "tests/failures/transcripts/FC-0002.failing.jsonl" }], candidate: [] } };
  assert.match(decide(root, { ...p, validation: synthetic }).decision, /marked synthetic/);
}));

test("promote: the change is in the tree, the previous version is recoverable and the failure evidence is kept; promotion without evidence is refused", () => withCopy((root) => {
  const p = approved(load("DP-0001", root)), rel = p.action.targets[0].path, target = path.join(root, rel);
  const previous = fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n");
  const [f] = parseDiff(fs.readFileSync(path.join(root, p.action.diff), "utf8"));
  const promotedText = applyDiff(previous, f);
  fs.writeFileSync(target, promotedText);
  const promotion = { revision: "abc1234", previousSha256: { [rel]: sha256(previous) }, promotedSha256: { [rel]: sha256(promotedText) } };
  const evidence = arms(root, [F, F, F], [C, C, C]);
  assert.equal(decide(root, { ...p, validation: evidence, promotion, decision: "PROMOTED" }).decision, "PROMOTED");
  assert.match(decide(root, { ...p, validation: { comparison: { baseline: [], candidate: [] } }, promotion, decision: "PROMOTED" }).decision, /only demonstrated improvements are promoted/);
  assert.match(decide(root, { ...p, validation: evidence, promotion: { ...promotion, previousSha256: { [rel]: "0".repeat(64) } }, decision: "PROMOTED" }).decision, /previous version .* is not recoverable/);
  fs.writeFileSync(target, previous);
  assert.match(decide(root, { ...p, validation: evidence, promotion, decision: "PROMOTED" }).decision, /promoted change is not present/);
}));

test("the tool starts only the fixed repository validators, makes no network call and keeps distillation artifacts outside the plugin", () => {
  const src = fs.readFileSync(TOOL, "utf8");
  assert.equal([...src.matchAll(/spawnSync\(/g)].length, 1);
  assert.match(src, /spawnSync\(process\.execPath, \[inside\(tmp, script\), \.\.\.args\], \{[^}]*shell: false/);
  for (const banned of [/node:(?:net|http|https|dgram|tls)/, /\bfetch\s*\(/, /\beval\s*\(/, /new Function/, /\bimport\s*\(/, /\bexecSync|\bexecFile/]) assert.doesNotMatch(src, banned, String(banned));
  assert.ok(OFFLINE.every(([, script]) => /^tools\/(?:validate|catalog|evals)\/[\w-]+\.mjs$/.test(script) && fs.existsSync(path.join(repo, script))));
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  assert.ok(!walk(path.join(repo, "plugins/codejadee-chayen-framework")).some((f) => /DP-\d{4}|distill|mentor/i.test(f)));
});
