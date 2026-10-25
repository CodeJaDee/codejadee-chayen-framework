// Developer-only failure-case regressions (evolution Step 11, D-068). Exercises the record format, the
// privacy rules, offline replay and the verification-status rules of tools/evals/failure-cases.mjs, in
// memory or on disposable OS-temp copies. No provider, network or shell; model behaviour stays NOT_RUN.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { validateAll, validateCase, replayTranscript, deriveStatus, privacyFindings, redact, CATEGORIES, OUTCOMES } from "../../tools/evals/failure-cases.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const TOOL = path.join(repo, "tools/evals/failure-cases.mjs");
const CASES = "tests/failures/cases";
const caseFile = (id) => fs.readdirSync(path.join(repo, CASES)).find((n) => n.startsWith(`${id}-`));
const load = (id, root = repo) => JSON.parse(fs.readFileSync(path.join(root, CASES, caseFile(id)), "utf8"));
const ids = (name) => new Set(JSON.parse(fs.readFileSync(path.join(repo, "tests/skills", name), "utf8")).cases.map((c) => c.id));
const check = (c, root = repo) => validateCase(root, c, `${CASES}/${c.id}-x.json`, ids);
const has = (r, text) => r.errors.some((e) => e.includes(text));
const sha = (t) => crypto.createHash("sha256").update(t).digest("hex");
const transcript = (name) => fs.readFileSync(path.join(repo, "tests/failures/transcripts", name), "utf8");
const withoutMarker = (t) => t.split("\n").slice(1).join("\n");

function copyRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "chayen-failures-"));
  const skip = new Set(["bin", "obj", "node_modules"]);
  for (const rel of ["tests/failures", "tests/skills", "tests/evaluation/fixture", "plugins/codejadee-chayen-framework/skills"])
    fs.cpSync(path.join(repo, rel), path.join(root, rel), { recursive: true, filter: (src) => !skip.has(path.basename(src)) });
  return root;
}
const writeCase = (root, c) => fs.writeFileSync(path.join(root, CASES, caseFile(c.id)), JSON.stringify(c, null, 2));
function withCopy(fn) { const root = copyRepo(); try { fn(root); } finally { fs.rmSync(root, { recursive: true, force: true }); } }
function liveRun(root, name, text, extra = {}) {
  fs.writeFileSync(path.join(root, "tests/failures/transcripts", name), text);
  return { kind: "live-replay", transcript: `tests/failures/transcripts/${name}`, provider: "claude", model: "test-model", revision: "c0ffee1", authorization: "OD-10 test reference", date: "2026-10-22", sha256: sha(text), ...extra };
}

test("the three shipped synthetic cases validate; recorded transcripts discriminate; model behaviour is NOT_RUN", () => {
  const { errors, cases } = validateAll(repo);
  assert.deepEqual(errors, []);
  assert.deepEqual(cases.map((c) => [c.id, c.category]), [["FC-0001", "invented-schema-or-command"], ["FC-0002", "missed-affected-file"], ["FC-0003", "false-done-claim"]]);
  for (const c of cases) {
    assert.equal(c.modelBehaviour, "NOT_RUN");
    assert.deepEqual(c.replays.map((r) => [r.role, r.outcome]), [["failing", "REPRODUCED"], ["control", "NOT_REPRODUCED"]]);
  }
});

test("every record field is required and the format is closed", () => {
  const base = load("FC-0001");
  for (const key of Object.keys(base)) {
    const c = structuredClone(base); delete c[key];
    assert.ok(has(check(c), `missing field ${key}`), key);
  }
  assert.ok(has(check({ ...base, rawConversation: "user said ..." }), "unknown field"));
});

test("the ten failure categories are accepted and any other is rejected", () => {
  assert.equal(Object.keys(CATEGORIES).length, 10);
  for (const category of Object.keys(CATEGORIES)) assert.ok(!has(check({ ...load("FC-0001"), category }), "category"), category);
  assert.ok(has(check({ ...load("FC-0001"), category: "bad-vibes" }), "category must be one of"));
});

test("provider and model are recorded only when observed; observed cases need explicit opt-in consent", () => {
  const synthetic = load("FC-0002");
  assert.ok(has(check({ ...synthetic, observedWith: { provider: "claude", model: "some-model" } }), "nothing was observed"));
  const observed = { ...synthetic, origin: "observed", dataClassification: "redacted", observedWith: { provider: "claude", model: null } };
  assert.ok(has(check(observed), "optIn: true"));
  const consented = { ...observed, consent: { optIn: true, reference: "maintainer opt-in 2026-10-22", redactionReviewed: true } };
  assert.ok(!has(check(consented), "optIn"));
  assert.ok(has(check(consented), "synthetic must match the case origin"), "synthetic transcripts cannot back an observed case");
  assert.ok(has(check({ ...consented, observedWith: { provider: "gemini", model: null } }), "observedWith.provider"));
});

test("skill, recipe, regression references, corrective targets and source must exist", () => {
  const c = load("FC-0003");
  assert.ok(has(check({ ...c, skill: { name: "chayen-nope", recipe: "references/change-summary.md" } }), "skill.name"));
  assert.ok(has(check({ ...c, skill: { ...c.skill, recipe: "references/nope.md" } }), "skill.recipe"));
  assert.ok(has(check({ ...c, regressionTests: ["tests/skills/recipe-cases.json#rc-does-not-exist"] }), "names no existing case"));
  assert.ok(has(check({ ...c, regressionTests: ["tools/validate/check-docs.mjs"] }), "must be tests/skills"));
  assert.ok(has(check({ ...c, correctiveAction: { ...c.correctiveAction, targets: ["plugins/nope.md"] } }), "does not exist"));
  assert.ok(has(check({ ...c, source: { revision: "HEAD", packageFingerprint: null } }), "source needs"));
});

test("fixture facts are checked against the fixture, so a nonexistent column is proven absent", () => {
  const c = load("FC-0001");
  assert.ok(!has(check(c), "fact does not hold"));
  const wrong = structuredClone(c); wrong.reproduction.facts.push({ file: "src/Api/Data/AppDb.cs", absent: "Name" });
  assert.ok(has(check(wrong), "fact does not hold: src/Api/Data/AppDb.cs lacks \"Name\""));
  const escape = structuredClone(c); escape.reproduction.facts = [{ file: "../../../package.json", exists: true }];
  assert.ok(has(check(escape), "is unsafe"));
  assert.ok(has(check({ ...c, reproduction: { ...c.reproduction, fixture: "plugins/codejadee-chayen-framework" } }), "under tests/"));
});

test("a detector that does not separate the failing and control transcripts is rejected", () => {
  const c = load("FC-0001");
  assert.ok(has(check({ ...c, detector: { allOf: [{ signal: "answer-includes-any", values: ["Customers"] }] } }), "detector does not discriminate"));
  assert.ok(has(check({ ...c, detector: { allOf: [{ signal: "run-this-shell", values: ["x"] }] } }), "unknown detector signal"));
  assert.ok(has(check({ ...c, detector: { allOf: [{ signal: "answer-includes-any", values: [] }] } }), "non-empty values"));
  assert.ok(has(check({ ...c, detector: { allOf: [{ signal: "repeated-action-at-least", count: 1 }] } }), "count >= 2"));
});

test("routing, permission and repetition signals work on parsed transcripts", () => {
  const t = [
    { type: "assistant", message: { content: [{ type: "tool_use", name: "Skill", input: { skill: "chayen:chayen-frontend" } }] } },
    ...Array.from({ length: 4 }, () => ({ type: "assistant", message: { content: [{ type: "tool_use", name: "Grep", input: { pattern: "status" } }] } })),
    { type: "result", subtype: "success", result: "done", permission_denials: [{ tool_name: "Bash", tool_input: { command: "rm -rf build" } }] },
  ].map((x) => JSON.stringify(x)).join("\n");
  const run = (allOf) => replayTranscript({ allOf }, "claude", t).outcome;
  assert.equal(run([{ signal: "skill-loaded-any", values: ["chayen-frontend"] }, { signal: "skill-loaded-none", values: ["chayen-backend"] }]), "REPRODUCED");
  assert.equal(run([{ signal: "denied-action" }]), "REPRODUCED");
  assert.equal(run([{ signal: "repeated-action-at-least", count: 4 }]), "REPRODUCED");
  assert.equal(run([{ signal: "repeated-action-at-least", count: 5 }]), "NOT_REPRODUCED");
  assert.equal(run([{ signal: "action-includes-any", values: ["rm -rf"] }]), "REPRODUCED");
});

test("a cut-off or failed run is INCONCLUSIVE, never a pass or a reproduction", () => {
  const det = load("FC-0003").detector;
  const failing = transcript("FC-0003.failing.jsonl");
  const cutOff = failing.split("\n").filter((l) => !l.includes('"type":"result"')).join("\n");
  assert.equal(replayTranscript(det, "claude", cutOff).outcome, "INCONCLUSIVE");
  assert.equal(replayTranscript({ allOf: [{ signal: "action-includes-none", values: ["pytest"] }] }, "claude", cutOff).outcome, "INCONCLUSIVE", "action-only detectors too");
  assert.equal(replayTranscript(det, "claude", JSON.stringify({ type: "result", subtype: "error_max_turns", is_error: true, result: "max turns" })).outcome, "INCONCLUSIVE");
  assert.equal(replayTranscript(det, "claude", "").outcome, "INCONCLUSIVE");
});

test("a guidance change alone never verifies a fix: the status stays NOT_RUN and a FIXED claim is rejected", () => withCopy((root) => {
  const c = load("FC-0003", root);
  const target = path.join(root, c.correctiveAction.targets[0]);
  fs.appendFileSync(target, "\nWhen no test exists for a criterion, its verdict is verify_more.\n");
  assert.equal(validateAll(root).cases.find((x) => x.id === "FC-0003").modelBehaviour, "NOT_RUN");
  for (const status of ["FIXED_AND_VERIFIED", "NOT_REPRODUCED"]) assert.ok(has(check({ ...c, correctiveAction: { ...c.correctiveAction, status: "applied" }, verification: { status, runs: [] } }, root), "not supported by the evidence"), status);
  assert.ok(has(check({ ...c, verification: { status: "NOT_RUN", runs: [{ kind: "guidance-changed", note: "edited change-summary.md" }] } }, root), "does not count"));
}));

test("recorded live replays derive REPRODUCED, NOT_REPRODUCED and FIXED_AND_VERIFIED from the transcript, not the claim", () => withCopy((root) => {
  const c = load("FC-0003", root);
  const applied = { ...c, correctiveAction: { ...c.correctiveAction, status: "applied" } };
  const still = liveRun(root, "FC-0003.live-1.jsonl", withoutMarker(transcript("FC-0003.failing.jsonl")));
  const fixed = liveRun(root, "FC-0003.live-2.jsonl", withoutMarker(transcript("FC-0003.control.jsonl")));
  assert.equal(check({ ...applied, verification: { status: "REPRODUCED", runs: [still] } }, root).errors.length, 0);
  assert.ok(has(check({ ...applied, verification: { status: "FIXED_AND_VERIFIED", runs: [still] } }, root), "derived REPRODUCED"));
  assert.equal(check({ ...applied, verification: { status: "FIXED_AND_VERIFIED", runs: [still, fixed] } }, root).errors.length, 0);
  const sameRevision = { ...fixed, revision: c.source.revision };
  assert.ok(has(check({ ...applied, verification: { status: "FIXED_AND_VERIFIED", runs: [sameRevision] } }, root), "derived NOT_REPRODUCED"));
  assert.ok(has(check({ ...c, verification: { status: "FIXED_AND_VERIFIED", runs: [fixed] } }, root), "derived NOT_REPRODUCED"), "a proposed action is not a fix");
  assert.ok(has(check({ ...applied, verification: { status: "FIXED_AND_VERIFIED", runs: [{ ...fixed, authorization: "" }] } }, root), "authorization reference"));
  assert.ok(has(check({ ...applied, verification: { status: "FIXED_AND_VERIFIED", runs: [{ ...fixed, sha256: "0".repeat(64) }] } }, root), "sha256"));
  assert.ok(has(check({ ...applied, verification: { status: "NOT_RUN", runs: [liveRun(root, "FC-0003.live-3.jsonl", transcript("FC-0003.control.jsonl"))] } }, root), "marked synthetic"));
  assert.equal(deriveStatus(applied, []), "NOT_RUN");
  assert.deepEqual([...OUTCOMES].sort(), ["FIXED_AND_VERIFIED", "INCONCLUSIVE", "NOT_REPRODUCED", "NOT_RUN", "REPRODUCED"]);
}));

test("privacy rules flag secrets, local paths, personal emails and credential URLs; reserved examples pass", () => {
  const token = "ghp_" + "A".repeat(36); // Synthetic sentinel, never a credential.
  assert.deepEqual(privacyFindings(`{"a":"${token}"}`), ["secret pattern github-token"]);
  for (const p of ["C:\\\\Users\\\\dev\\\\shop", "D:/work/shop", " /home/dev/shop", "(/Users/dev/shop", " ~/shop"]) assert.deepEqual(privacyFindings(p), ["unredacted local path"], p);
  assert.deepEqual(privacyFindings("mail jane.doe@company.co.th"), ["email address outside reserved example domains"]);
  assert.ok(privacyFindings("https://user:pa55@db.internal/x").includes("credential-bearing URL"));
  assert.deepEqual(privacyFindings("dev@example.com ops@shop.invalid https://learn.microsoft.com/x <FIXTURE>/src AC-1: x"), []);
});

test("redaction relativises the fixture root, masks secrets and emails, strips tool output, and keeps the transcript scorable", () => {
  const root = process.platform === "win32" ? "C:\\Users\\dev\\AppData\\Local\\Temp\\fc-run" : "/home/dev/fc-run";
  const token = "ghp_" + "B".repeat(36);
  const raw = [
    "not json: banner text",
    JSON.stringify({ type: "assistant", message: { content: [{ type: "tool_use", name: "Read", input: { file_path: path.join(root, "src", "Api", "Data", "AppDb.cs") } }] } }),
    JSON.stringify({ type: "user", message: { content: [{ type: "tool_result", content: "public class Secret { } // source text" }] } }),
    JSON.stringify({ type: "result", subtype: "success", result: `SELECT c.Email ... token ${token} mail jane@company.co.th, see ${path.join(os.homedir(), "notes.txt")}` }),
  ].join("\n");
  const { text, dropped } = redact(raw, [root]);
  assert.equal(dropped, 1);
  assert.deepEqual(privacyFindings(text), []);
  assert.ok(text.includes("<FIXTURE>") && text.includes("<REDACTED:github-token>") && text.includes("<REDACTED:email>") && text.includes("<tool output removed>"));
  assert.ok(!text.includes("public class Secret"));
  const r = replayTranscript({ allOf: [{ signal: "answer-includes-any", values: ["c.Email"] }, { signal: "action-includes-any", values: ["src/Api/Data/AppDb.cs"] }] }, "claude", text);
  assert.equal(r.outcome, "REPRODUCED");
});

test("transcripts: synthetic marker, JSON lines, size cap and privacy are enforced", () => withCopy((root) => {
  const t = path.join(root, "tests/failures/transcripts/FC-0001.control.jsonl");
  const original = fs.readFileSync(t, "utf8");
  fs.writeFileSync(t, withoutMarker(original));
  assert.ok(validateAll(root).errors.some((e) => e.includes("must start with a {\"type\":\"synthetic\"} marker")));
  fs.writeFileSync(t, original + "plain text line\n");
  assert.ok(validateAll(root).errors.some((e) => e.includes("non-JSON lines")));
  fs.writeFileSync(t, original + JSON.stringify({ type: "padding", text: "x".repeat(70_000) }) + "\n");
  assert.ok(validateAll(root).errors.some((e) => e.includes("exceeds")));
  fs.writeFileSync(t, original.replace("<FIXTURE>/src/Api/Data/AppDb.cs", "D:/work/shop/src/Api/Data/AppDb.cs"));
  assert.ok(validateAll(root).errors.some((e) => e.includes("unredacted local path")));
}));

test("scripts and binaries are never kept as failure artifacts", () => withCopy((root) => {
  for (const name of ["repro.sh", "repro.ps1", "repro.mjs", "repro.py", "repro.bat"]) {
    const f = path.join(root, "tests/failures/fixtures", name);
    fs.writeFileSync(f, "echo hi\n");
    assert.ok(validateAll(root).errors.some((e) => e.includes(`${name}: file type not allowed`)), name);
    fs.rmSync(f);
  }
  assert.deepEqual(validateAll(root).errors, []);
}));

test("the tool has no process, network, telemetry or dynamic-code path, and failure artifacts stay outside the plugin", () => {
  const src = fs.readFileSync(TOOL, "utf8");
  for (const banned of [/node:child_process/, /node:(?:net|http|https|dgram|tls)/, /\bfetch\s*\(/, /\beval\s*\(/, /new Function/, /\bimport\s*\(/, /\b(?:spawn|spawnSync|execSync|execFile|execFileSync|fork)\s*\(/]) assert.doesNotMatch(src, banned, String(banned));
  assert.equal([...src.matchAll(/writeFileSync\(/g)].length, 1, "the only write is --redact");
  assert.match(src, /flag: "wx"/);
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  const plugin = walk(path.join(repo, "plugins/codejadee-chayen-framework"));
  assert.ok(plugin.every((f) => [".md", ".json"].includes(path.extname(f))));
  assert.ok(!plugin.some((f) => /FC-\d{4}|failure-case/i.test(f)));
});

test("CLI: offline scoring, refusal of unredacted input, and no overwrite on redaction", () => withCopy((root) => {
  const node = (...args) => spawnSync(process.execPath, [TOOL, ...args], { encoding: "utf8", cwd: repo });
  const failing = path.join(repo, "tests/failures/transcripts/FC-0002.failing.jsonl");
  const ok = node("--case", "FC-0002", "--provider", "claude", "--score", failing);
  assert.equal(ok.status, 0); assert.match(ok.stdout, /FC-0002 REPRODUCED/); assert.match(ok.stdout, /verifies nothing by itself/);
  const dirty = path.join(root, "dirty.jsonl");
  fs.writeFileSync(dirty, JSON.stringify({ type: "result", subtype: "success", result: "see C:\\\\Users\\\\dev\\\\x" }) + "\n");
  const refused = node("--case", "FC-0002", "--provider", "claude", "--score", dirty);
  assert.equal(refused.status, 1); assert.match(refused.stdout, /REFUSED: unredacted local path/);
  const out = path.join(root, "clean.jsonl");
  assert.equal(node("--redact", dirty, "--fixture-root", root, "--out", out).status, 0);
  assert.deepEqual(privacyFindings(fs.readFileSync(out, "utf8")), []);
  const again = node("--redact", dirty, "--fixture-root", root, "--out", out);
  assert.equal(again.status, 2); assert.match(again.stdout, /already exists/);
  assert.equal(node().status, 0);
}));
