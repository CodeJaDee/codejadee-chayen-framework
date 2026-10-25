// Developer-only independent evidence audit regressions (evolution Step 13, D-070). Exercises the reference
// grader of tools/evals/audit-evidence.mjs on the synthetic cases in tests/audit/cases/, in memory. No
// command, model or provider runs; agent behaviour is NOT_RUN.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { gradeAll, auditCase, scoreReview, validateCase, loadCases, REVIEW_FIELDS, mask } from "../../tools/evals/audit-evidence.mjs";
import { privacyFindings } from "../../tools/evals/failure-cases.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const TOOL = path.join(repo, "tools/evals/audit-evidence.mjs");
const cases = Object.fromEntries(loadCases(repo).map(({ data }) => [data.id, data]));
const clone = (id) => structuredClone(cases[id]);
const verdicts = (c) => Object.fromEntries(auditCase(c).reviews.map((r) => [r.criterion, r.verdict]));
const flat = (s) => s.replace(/\r\n/g, "\n").replace(/[*`]/g, "").replace(/\s+/g, " ");

test("the six required scenarios, and two fabrication variants, give the appropriate verdicts", () => {
  const { errors, results } = gradeAll(repo);
  assert.deepEqual(errors, []);
  const got = Object.fromEntries(results.map((r) => [r.id, [Object.values(verdicts(cases[r.id])).join("+"), r.review.outcome, r.review.reportOutcome]]));
  assert.deepEqual(got, {
    "AU-0001": ["accept", "DONE", "supported"],             // 1. genuine passing test
    "AU-0002": ["verify_more", "PARTIAL", "unsupported"],   // 2. claimed PASS without recorded execution
    "AU-0003": ["verify_more", "PARTIAL", "unsupported"],   // 3. UI change with no interaction test
    "AU-0004": ["revise", "PARTIAL", "unsupported"],        // 4. incomplete API authorization
    "AU-0005": ["accept+verify_more", "PARTIAL", "supported"], // 5. valid partial implementation
    "AU-0006": ["verify_more", "PARTIAL", "unsupported"],   // 6. stale test result
    "AU-0007": ["revise", "PARTIAL", "unsupported"],        // fabricated quoted result
    "AU-0008": ["verify_more", "PARTIAL", "unsupported"],   // cited run never recorded
  });
});

test("every criterion review records the eight required fields", () => {
  for (const c of Object.values(cases)) for (const r of auditCase(c).reviews) for (const f of REVIEW_FIELDS) assert.ok(typeof r[f] === "string" && r[f].trim(), `${c.id} ${r.criterion} ${f}`);
});

test("the implementer's report never changes a verdict: only recorded evidence does", () => {
  for (const c of Object.values(cases)) {
    const before = verdicts(c);
    const confident = { ...structuredClone(c), report: { outcome: "DONE", claims: c.criteria.map((a) => ({ criterion: a.id, text: "Verified, all tests pass", status: "PASSED", run: null, quoted: null, verdict: "accept" })) } };
    const silent = { ...structuredClone(c), report: { outcome: "DONE", claims: [] } };
    assert.deepEqual(verdicts(confident), before, `${c.id}: a confident report`);
    assert.deepEqual(verdicts(silent), before, `${c.id}: no report`);
  }
});

test("a test file is not a test run; a recorded passing run of it is", () => {
  const c = clone("AU-0002");
  c.changedFiles.push({ path: "tests/Orders/MoreExportTests.cs", role: "test", revision: "r2" });
  assert.equal(verdicts(c)["AC-1"], "verify_more");
  c.runs.push({ id: "R2", command: "dotnet test --filter OrderExportTests", revision: "r2", exitCode: 0, excerpt: "Passed: 3", tests: [{ name: "Export_writes_header_and_one_row_per_order", status: "PASSED", covers: ["AC-1"], level: "integration" }] });
  assert.equal(verdicts(c)["AC-1"], "accept");
});

test("stale evidence becomes acceptable only when re-run on the current revision", () => {
  const c = clone("AU-0006");
  assert.equal(verdicts(c)["AC-1"], "verify_more");
  c.runs[0].revision = "r2";
  assert.equal(verdicts(c)["AC-1"], "accept");
});

test("a UI interaction needs a behavioural check; a component test of the interaction is adequate", () => {
  const c = clone("AU-0003");
  c.runs.push({ id: "R3", command: "npx ng test --watch=false --include=**/customer-form.component.spec.ts", revision: "r2", exitCode: 0, excerpt: "TOTAL: 1 SUCCESS",
    tests: [{ name: "Save with empty name shows the required message and keeps the dialog open", status: "PASSED", covers: ["AC-1"], level: "component" }] });
  assert.equal(verdicts(c)["AC-1"], "accept");
});

test("authorization needs the allowed and every denied path; a failing denied path is revise", () => {
  const c = clone("AU-0004");
  assert.equal(verdicts(c)["AC-1"], "revise");
  c.runs[0].tests.find((t) => t.path === "forbidden").status = "PASSED";
  assert.equal(verdicts(c)["AC-1"], "accept");
  c.runs[0].tests = c.runs[0].tests.filter((t) => t.path !== "unauthenticated");
  const r = auditCase(c);
  assert.equal(r.reviews[0].verdict, "verify_more");
  assert.ok(r.flags.includes("denied-path-missing"));
  assert.match(r.reviews[0].nextAction, /unauthenticated path/);
});

test("a same-session review keeps its verdict but records the limitation", () => {
  const c = clone("AU-0001");
  c.reviewer.independent = false;
  const r = auditCase(c);
  assert.equal(r.reviews[0].verdict, "accept");
  assert.match(r.reviews[0].confidenceLimitation, /session that made the change/);
  assert.ok(r.flags.includes("same-session-review"));
});

test("secrets in recorded output are redacted in the review", () => {
  const c = clone("AU-0004");
  const token = "ghp_" + "C".repeat(36); // Synthetic sentinel, never a credential.
  c.runs[0].excerpt += ` Authorization: token ${token} password=Hunter22 contact ops@shop.co.th`;
  const out = JSON.stringify(auditCase(c));
  assert.ok(!out.includes(token) && !out.includes("Hunter22") && !out.includes("ops@shop.co.th"));
  assert.deepEqual(privacyFindings(out), []);
  assert.match(mask("postgres://app:pa55@db/x"), /<redacted:credential-url>/);
});

test("the grader contract: a grader that trusts the implementer fails; a complete, correct review passes", () => {
  let trusting = 0, reference = 0;
  for (const c of Object.values(cases)) {
    const copy = { $schema: "chayen-audit-review/1", case: c.id, outcome: c.report.outcome, reportOutcome: "supported",
      reviews: c.criteria.map((a) => ({ criterion: a.id, claim: "as reported", evidenceSource: "implementer's report", independentMethod: "read the report", observedOutcome: "the report says it passes", confidenceLimitation: "none", verdict: c.report.claims.find((x) => x.criterion === a.id)?.verdict ?? "accept", nextAction: "none" })) };
    if (!scoreReview(c, copy).length) trusting++;
    if (!scoreReview(c, auditCase(c)).length) reference++;
  }
  assert.equal(reference, 8);
  assert.equal(trusting, 2, "only the genuine pass and the honest partial agree with the report");
  const c = cases["AU-0001"], good = auditCase(c);
  assert.ok(scoreReview(c, { ...good, reviews: [{ ...good.reviews[0], confidenceLimitation: "" }] }).some((e) => /missing confidenceLimitation/.test(e)));
  assert.ok(scoreReview(c, { ...good, reviews: [{ ...good.reviews[0], verdict: "supported" }] }).some((e) => /accept, verify_more or revise/.test(e)));
  assert.ok(scoreReview(c, { ...good, reviews: [{ ...good.reviews[0], observedOutcome: "token ghp_" + "D".repeat(36) }] }).some((e) => /secret pattern/.test(e)));
});

test("case validation: closed format, synthetic only, expected verdicts required, no secrets", () => {
  const c = clone("AU-0001"), file = "tests/audit/cases/AU-0001-x.json";
  assert.deepEqual(validateCase(c, file), []);
  assert.ok(validateCase({ ...c, transcript: "raw" }, file).some((e) => /closed/.test(e)));
  assert.ok(validateCase({ ...c, synthetic: false }, file).some((e) => /synthetic/.test(e)));
  assert.ok(validateCase({ ...c, expected: { ...c.expected, verdicts: {} } }, file).some((e) => /expected verdict for AC-1/.test(e)));
  assert.ok(validateCase({ ...c, title: "see C:\\Users\\dev\\report.txt" }, file).some((e) => /local path/.test(e)));
});

test("each grader rule is anchored in the shipped guidance, so the two cannot drift apart", () => {
  const summary = flat(fs.readFileSync(path.join(repo, "plugins/codejadee-chayen-framework/skills/chayen-implementation/references/change-summary.md"), "utf8"));
  const testing = flat(fs.readFileSync(path.join(repo, "plugins/codejadee-chayen-framework/skills/chayen-testing/SKILL.md"), "utf8"));
  for (const anchor of [
    "Its conclusions are claims to check, never evidence.",
    "A test file in the diff shows that a test exists, not that it ran.",
    "A claimed PASS needs a recorded run",
    "Evidence from before that change is stale.",
    "An interactive UI requirement needs a behavioural check",
    "An access-control requirement needs its negative paths checked",
    "A quoted result that the recorded run contradicts is unsupported and possibly fabricated",
    "A run that is cited but was never recorded is no evidence.",
    "| Unit test PASS | The unit's logic | API authorization, the HTTP contract, cross-layer behaviour |",
    "A report that claims PARTIAL, with accurate verdicts and a next safe action, is supported.",
    "it is neither a security review nor a security guarantee",
  ]) assert.ok(summary.includes(anchor), anchor);
  assert.ok(testing.includes("Never infer PASSED from missing output or from the existence of a test file."));
});

test("the grader runs nothing and reaches no network; audit artifacts stay outside the plugin", () => {
  const src = fs.readFileSync(TOOL, "utf8");
  for (const banned of [/node:child_process/, /node:(?:net|http|https|dgram|tls)/, /\bfetch\s*\(/, /\beval\s*\(/, /new Function/, /\bimport\s*\(/, /writeFileSync/]) assert.doesNotMatch(src, banned, String(banned));
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  assert.ok(!walk(path.join(repo, "plugins/codejadee-chayen-framework")).some((f) => /AU-\d{4}|audit-evidence/i.test(f)));
});

test("CLI: grading and the --score contract for other graders", (t) => {
  const node = (...args) => spawnSync(process.execPath, [TOOL, ...args], { cwd: repo, encoding: "utf8" });
  const all = node();
  assert.equal(all.status, 0, all.stdout);
  assert.match(all.stdout, /PASS independent audit cases: 8\/8/);
  const dir = fs.mkdtempSync(path.join(fs.realpathSync(process.env.TEMP ?? process.env.TMPDIR ?? "/tmp"), "audit-score-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const good = path.join(dir, "good.json"), bad = path.join(dir, "bad.json");
  fs.writeFileSync(good, JSON.stringify(Object.values(cases).map(auditCase)));
  fs.writeFileSync(bad, JSON.stringify(Object.values(cases).map((c) => ({ ...auditCase(c), outcome: "DONE" }))));
  assert.equal(node("--score", good).status, 0);
  const r = node("--score", bad);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /AU-0002 MISMATCH: outcome DONE, expected PARTIAL/);
});
