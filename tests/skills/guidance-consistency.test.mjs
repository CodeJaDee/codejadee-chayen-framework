// Developer-only regressions for the guidance consistency checker (gate G-18T, evolution Step 09). Each test
// copies the shipped plugin into a disposable OS-temp directory, applies one controlled mutation, and runs
// tools/validate/check-guidance.mjs against it. Contradictions must be reported by the expected invariant;
// a wording change that keeps the meaning must not fail. Offline; never shipped.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { inside, assertTreeNoLinks } from "../../tools/validate/safe-paths.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const S = "plugins/codejadee-chayen-framework/skills";
const IMPL = `${S}/chayen-implementation`;

function fixture(t) {
  const parent = fs.realpathSync(os.tmpdir()), root = fs.mkdtempSync(path.join(parent, "chayen-guidance-"));
  t.after(() => { assert.equal(path.dirname(root), parent); fs.rmSync(root, { recursive: true, force: true }); });
  const source = inside(repo, "plugins"); assertTreeNoLinks(source);
  fs.cpSync(source, inside(root, "plugins"), { recursive: true });
  return root;
}
function check(root) {
  const r = spawnSync(process.execPath, [inside(repo, "tools/validate/check-guidance.mjs"), "--root", root], { cwd: repo, encoding: "utf8", timeout: 60_000 });
  return { code: r.status, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}
const read = (root, rel) => fs.readFileSync(inside(root, rel), "utf8").replace(/\r\n/g, "\n");
// Replace exactly one occurrence; a pattern may span line breaks.
function edit(root, rel, from, to) {
  const text = read(root, rel), re = from instanceof RegExp ? new RegExp(from.source, from.flags.replace("g", "")) : null;
  const count = re ? (text.match(new RegExp(re.source, `${re.flags}g`)) ?? []).length : text.split(from).length - 1;
  assert.equal(count, 1, `${rel}: mutation anchor must occur exactly once (${count})`);
  fs.writeFileSync(inside(root, rel), re ? text.replace(re, to) : text.replace(from, () => to));
}
const append = (root, rel, s) => fs.writeFileSync(inside(root, rel), `${read(root, rel)}\n${s}\n`);
const errorsOf = (out) => out.split("\n").filter((l) => l.startsWith("ERROR"));
function detected(r, id, pattern) {
  assert.equal(r.code, 1, r.out);
  assert.ok(errorsOf(r.out).some((l) => l.includes(` ${id} `) && pattern.test(l)), `expected ${id} matching ${pattern}:\n${r.out}`);
}

test("the shipped guidance satisfies every invariant with no review items", (t) => {
  const r = check(fixture(t));
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /\n0 error\(s\), 0 review item\(s\); 10 invariants/);
  for (let i = 1; i <= 10; i++) assert.match(r.out, new RegExp(`PASS {3}GI-${String(i).padStart(2, "0")} `));
});

test("the report is deterministic", (t) => {
  const root = fixture(t);
  assert.equal(check(root).out, check(root).out);
});

// ---------- required detections ----------
test("detects an ambiguous request that skips clarification (entry skill)", (t) => {
  const root = fixture(t);
  edit(root, `${IMPL}/SKILL.md`, /clarify in one message before\s+any edit, however small/, "proceed with the most reasonable interpretation\n     and note it in the summary");
  const r = check(root);
  detected(r, "GI-01", /no longer requires clarification before any edit/);
  detected(r, "GI-01", /proceed on a guessed interpretation/);
});

test("detects an ambiguous request that skips clarification (recipe)", (t) => {
  const root = fixture(t);
  edit(root, `${IMPL}/references/task-contract.md`, /If not, \*\*clarify before any\s+edit\*\*, however small the change looks\./, "If not, note the assumption and continue.");
  detected(check(root), "GI-01", /Procedure no longer requires clarifying an unclear request before any edit/);
});

test("detects a template that marks missing evidence as accepted (definition)", (t) => {
  const root = fixture(t);
  edit(root, `${IMPL}/references/task-contract-template.md`, /accept\nwhen fresh, adequate observed evidence shows it is met/, "accept\nwhen the evidence is missing or partial");
  detected(check(root), "GI-03", /defines accept with missing or unexecuted evidence/);
});

test("detects a template that marks missing evidence as accepted (statement)", (t) => {
  const root = fixture(t);
  append(root, `${IMPL}/references/change-passport-template.md`, "Missing evidence is marked accept when the build passes.");
  detected(check(root), "GI-03", /marks missing evidence as accepted/);
});

test("detects a workflow that treats a skipped test as PASS (verification)", (t) => {
  const root = fixture(t);
  edit(root, `${S}/chayen-testing/references/workflow-testing-regression.md`, "Unavailable runtime checks are NOT_RUN.", "Unavailable runtime checks are NOT_RUN. Skipped tests count as PASS.");
  detected(check(root), "GI-05", /treats an unexecuted or skipped check as passing/);
});

test("detects a workflow that treats a skipped test as PASS (exit check)", (t) => {
  const root = fixture(t);
  edit(root, `${S}/chayen-testing/references/workflow-testing-regression.md`, "| PASS, FAIL, NOT_RUN and N/A remain distinct; no coverage percentage substitutes for behavior. |", "| Skipped checks are reported as PASS when the build is green. |");
  detected(check(root), "GI-05", /treats an unexecuted or skipped check as passing/);
});

test("detects a weakened approval requirement (entry skill)", (t) => {
  const root = fixture(t);
  edit(root, `${IMPL}/SKILL.md`, "Approval of the task contract is not approval of each risky action, and", "Approval of the task contract covers each risky action, and");
  const r = check(root);
  detected(r, "GI-02", /Safety boundaries no longer say that contract approval is not approval/);
  detected(r, "GI-02", /weakens action-specific approval/);
});

test("detects a weakened approval requirement (recipe)", (t) => {
  const root = fixture(t);
  edit(root, `${IMPL}/references/task-contract.md`, /Confirming the task description\s+or the contract is never approval of/, "Confirming the task description\n     or the contract is approval of");
  // The Rules section still states the rule, so the required anchor holds; the contradiction is what is caught.
  detected(check(root), "GI-02", /weakens action-specific approval: "Confirming the task description or the contract is approval"/);
});

// ---------- no unjustified failure ----------
test("a wording change that keeps the meaning does not fail", (t) => {
  const root = fixture(t);
  // Paraphrase the clarification bullet, and move the no-contract bullet first.
  edit(root, `${IMPL}/SKILL.md`, /clarify in one message before\s+any edit, however small/, "clarify in a single grouped message before any edit, however small");
  edit(root, `${IMPL}/SKILL.md`, "   - fully specified and low risk: no questions and no contract.\n", "");
  edit(root, `${IMPL}/SKILL.md`, "4. **Decide clarification and contract** with the task contract recipe:\n", "4. **Decide clarification and contract** with the task contract recipe:\n   - fully specified and low risk: neither questions nor a contract (no contract);\n");
  // Rephrase a verdict definition and the skip rule; rewrap a workflow paragraph; add emphasis.
  // Comma-joined verdict definitions (the 1.1.2 phrasing) are read clause by clause.
  edit(root, `${IMPL}/references/task-contract-template.md`, /accept\nwhen fresh, adequate observed evidence shows it is met; verify_more when the\nevidence is missing, partial, stale, not reproducible or from an inadequate\nmethod; revise/, "accept\nwhen observed evidence that is fresh and adequate shows the criterion is met, verify_more when the\nevidence is missing, partial, stale, not reproducible or from an inadequate\nmethod, and revise");
  edit(root, `${S}/chayen-testing/SKILL.md`, "A skip is not a pass.", "Skipping is never passing.");
  edit(root, `${S}/chayen-testing/references/workflow-testing-regression.md`, "DONE requires\nthe requested scope", "DONE requires the requested scope");
  edit(root, `${S}/chayen-data/SKILL.md`, /provider permissions\s+take priority/, "provider permissions **take priority**");
  // A negated enforcement statement is advisory wording, not a claim.
  append(root, `${S}/chayen-security/SKILL.md`, "This guidance cannot enforce least privilege; the platform's permissions do.");
  const r = check(root);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /\n0 error\(s\), 0 review item\(s\)/);
});

test("heuristic signals are REVIEW items and do not fail", (t) => {
  const root = fixture(t);
  edit(root, `${S}/chayen-testing/references/workflow-testing-regression.md`, "| Baseline failures are not hidden by skipped or weakened assertions. |", "| Baseline is complete. |");
  edit(root, `${IMPL}/SKILL.md`, "| Only writing or fixing tests | The chayen-testing skill |", "| Only writing or fixing tests | Someone else |");
  const r = check(root);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /REVIEW GI-09 .*exit check declares completion without an evidence term: "Baseline is complete\."/);
  assert.match(r.out, /REVIEW GI-08 .*Better fit "Someone else" names no skill and no recognised outcome/);
  assert.match(r.out, /\n0 error\(s\), 2 review item\(s\)/);
});

test("every canonical invariant is documented", () => {
  const spec = JSON.parse(fs.readFileSync(inside(repo, "tools/validate/guidance-invariants.json"), "utf8"));
  const doc = fs.readFileSync(inside(repo, "docs/chayen/GUIDANCE_INVARIANTS.md"), "utf8");
  assert.equal(spec.invariants.length, 10);
  for (const inv of spec.invariants) assert.match(doc, new RegExp(`\\b${inv.id}\\b[^\\n]*${inv.name}`), `${inv.id} ${inv.name} is not documented`);
});

// ---------- the remaining invariants ----------
test("detects DONE defined without accepted criteria", (t) => {
  const root = fixture(t);
  edit(root, `${IMPL}/references/verification-report-template.md`, /Use DONE only for completed scope, required verification\nand every required criterion at accept;/, "Use DONE only for completed scope and required verification;");
  detected(check(root), "GI-04", /defines when DONE applies without requiring accepted criteria/);
});

test("detects the real Step 08 gap if the workflow exit check regresses", (t) => {
  const root = fixture(t);
  edit(root, `${IMPL}/references/workflow-new-feature.md`, " and every required criterion is at accept.", ".");
  detected(check(root), "GI-04", /workflow-new-feature\.md: defines when DONE applies/);
});

test("detects DONE that follows from written code alone", (t) => {
  const root = fixture(t);
  append(root, `${IMPL}/references/change-summary.md`, "Written code counts as DONE.");
  detected(check(root), "GI-04", /makes DONE follow from code or a build alone/);
});

test("detects a removed source-of-truth precedence rule", (t) => {
  const root = fixture(t);
  edit(root, `${S}/chayen-data/SKILL.md`, /provider permissions\s+take priority/, "provider permissions are considered");
  detected(check(root), "GI-06", /chayen-data\/SKILL\.md: the Precedence principle no longer gives/);
});

test("detects a project-map reader that drops 'the source wins'", (t) => {
  const root = fixture(t);
  edit(root, `${S}/chayen-repository/references/dependency-and-impact.md`, /the source; when the two disagree, the source wins, and report that the\s+map is stale\./, "the map; use it as the dependency list.");
  detected(check(root), "GI-06", /dependency-and-impact\.md: reads \.chayen\/ project knowledge without saying the source wins/);
});

test("detects project knowledge that overrides the source", (t) => {
  const root = fixture(t);
  append(root, `${S}/chayen-backend/SKILL.md`, "When .chayen/profile.md disagrees, .chayen/rules.md overrides the source code.");
  detected(check(root), "GI-06", /lets \.chayen\/ files override the source/);
});

test("detects an enforcement claim", (t) => {
  const root = fixture(t);
  append(root, `${S}/chayen-security/SKILL.md`, "This guidance enforces least privilege on every repository.");
  detected(check(root), "GI-07", /claims the guidance itself enforces something/);
});

test("detects a hand-off to a skill that does not exist", (t) => {
  const root = fixture(t);
  edit(root, `${IMPL}/SKILL.md`, "| Only writing or fixing tests | The chayen-testing skill |", "| Only writing or fixing tests | The chayen-qa skill |");
  detected(check(root), "GI-08", /names "chayen-qa", which is not a shipped skill/);
});

test("detects a workflow whose verification drops the verdict rule", (t) => {
  const root = fixture(t);
  edit(root, `${S}/chayen-testing/references/workflow-testing-regression.md`, /Give each acceptance criterion one verdict \(accept, verify_more or revise\)\nfrom fresh, adequate evidence; a check status is never the verdict, and DONE\nneeds every required criterion at accept\.\n/, "");
  detected(check(root), "GI-09", /no longer gives each acceptance criterion one verdict/);
});

// ---------- evolution Step 13: independent evidence audit (GI-10) and the GI-03 no-test gap ----------
const SUMMARY_MD = `${IMPL}/references/change-summary.md`;

test("detects a criterion with no test being accepted (the Step 12 finding)", (t) => {
  const root = fixture(t);
  edit(root, SUMMARY_MD, /A criterion with no test is uncovered and\s+verify_more;/, "A criterion with no test may be accepted when the code looks right;");
  detected(check(root), "GI-03", /accepts a criterion with no test, run or evidence/);
});

test("detects a test file taken as a test run", (t) => {
  const root = fixture(t);
  append(root, `${IMPL}/references/verification-report-template.md`, "A test file in the diff shows the test passed.");
  detected(check(root), "GI-10", /infers a test run from a test file/);
});

test("detects an audit that no longer separates a test file from a test run", (t) => {
  const root = fixture(t);
  edit(root, SUMMARY_MD, /A test file in the diff shows that a test exists, not that it ran\./, "A test file in the diff is reviewed.");
  detected(check(root), "GI-10", /no longer says a test file is not a test run/);
});

test("detects an audit that drops the UI behavioural check", (t) => {
  const root = fixture(t);
  edit(root, SUMMARY_MD, "An interactive UI requirement needs a behavioural check", "An interactive UI requirement needs a build");
  detected(check(root), "GI-10", /behavioural check for interactive UI requirements/);
});

test("detects a criterion review without a confidence limitation", (t) => {
  const root = fixture(t);
  edit(root, SUMMARY_MD, /\n {3}\| Confidence limitation \|[^\n]*/, "");
  detected(check(root), "GI-10", /no longer records "Confidence limitation"/);
});

test("detects the implementer auditing its own evidence", (t) => {
  const root = fixture(t);
  append(root, `${IMPL}/references/change-passport-template.md`, "The implementing agent may approve its own evidence when the build passes.");
  detected(check(root), "GI-10", /lets the implementer audit its own evidence/);
});

test("a reworded audit and negated statements do not fail", (t) => {
  const root = fixture(t);
  edit(root, SUMMARY_MD, "Evidence from before that change is stale.", "Evidence older than that change is stale.");
  edit(root, SUMMARY_MD, "- **Independent reviewer:** a person, or an agent session", "- **Independent reviewer** — a person, or an agent session");
  append(root, `${IMPL}/references/verification-report-template.md`, "A criterion with no test is never accepted. A test file never shows that the test passed.");
  const r = check(root);
  assert.equal(r.code, 0, r.out);
});
