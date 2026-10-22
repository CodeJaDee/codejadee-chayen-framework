#!/usr/bin/env node
// Developer-only independent evidence audit: the reference grader for the verification contract in
// docs/chayen/INDEPENDENT_AUDIT_CONTRACT.md (evolution Step 13, D-070). It reads synthetic audit cases
// (tests/audit/cases/) holding the original acceptance criteria, the changed files, the recorded runs and
// the implementer's report, and re-derives one review per criterion without trusting the report. It
// never runs a command, opens a connection or calls a model; the runs it grades are recorded data.
// It is a deterministic reference over structured evidence, not a security review. Never shipped.
//
// Usage:
//   node tools/evals/audit-evidence.mjs [--json]                grade every case against its expected verdicts
//   node tools/evals/audit-evidence.mjs --score <reviews.json>  check another grader's reviews against the cases

import fs from "node:fs";
import path from "node:path";
import { inside } from "../validate/safe-paths.mjs";
import { SECRET_PATTERNS } from "../validate/secret-patterns.mjs";
import { privacyFindings } from "./failure-cases.mjs";

export const CASE_SCHEMA = "chayen-audit-case/1";
export const REVIEW_SCHEMA = "chayen-audit-review/1";
export const DIR = "tests/audit/cases";
export const VERDICTS = ["accept", "verify_more", "revise"];
export const REVIEW_FIELDS = ["criterion", "claim", "evidenceSource", "independentMethod", "observedOutcome", "confidenceLimitation", "verdict", "nextAction"];
export const FLAGS = ["claimed-pass-without-recorded-run", "cited-run-not-recorded", "quoted-result-contradicted", "claimed-pass-contradicted", "stale-evidence", "inadequate-method", "denied-path-missing", "claimed-verdict-unsupported", "same-session-review"];
// Adequate evidence per criterion kind (the adequacy table of the change-summary recipe).
export const ADEQUATE = {
  logic: ["unit", "integration", "request", "component", "browser", "device"],
  "ui-interaction": ["component", "browser", "device", "manual-recorded"],
  "api-authorization": ["request", "browser"],
};
const STATUSES = ["PASSED", "FAILED", "SKIPPED", "BLOCKED", "NOT_RUN", "UNKNOWN"];
const CASE_KEYS = ["$schema", "id", "title", "synthetic", "revisions", "criteria", "changedFiles", "runs", "report", "reviewer", "expected"];

// Quoted output is masked before it reaches a review.
export function mask(text) {
  let t = String(text ?? "");
  for (const [rule, re] of SECRET_PATTERNS) t = t.replace(new RegExp(re.source, "g"), `<redacted:${rule}>`);
  t = t.replace(/\b[a-z][a-z0-9+.-]*:\/\/[^\s/@"']+:[^\s/@"']+@/gi, "<redacted:credential-url>");
  t = t.replace(/\b((?:password|passwd|pwd|secret|token|api[_-]?key|connectionstring)\s*[=:]\s*)\S+/gi, "$1<redacted>");
  t = t.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}\b/g, (m) => (/@(?:[\w-]+\.)*(?:example\.(?:com|org|net)|[\w-]+\.(?:invalid|test))$/i.test(m) ? m : "<redacted:email>"));
  return t;
}

export function validateCase(c, file) {
  const errors = [], err = (m) => errors.push(m);
  if (!c || typeof c !== "object") return ["case is not a JSON object"];
  for (const k of Object.keys(c)) if (!CASE_KEYS.includes(k)) err(`unknown field ${k}; the case format is closed`);
  for (const k of CASE_KEYS) if (!(k in c)) err(`missing field ${k}`);
  if (c.$schema !== CASE_SCHEMA) err(`$schema must be ${CASE_SCHEMA}`);
  if (!/^AU-\d{4}$/.test(c.id ?? "") || !path.basename(file).startsWith(`${c.id}-`)) err("id must be AU-NNNN and the file name must start with it");
  if (c.synthetic !== true) err("audit cases are synthetic; real reports stay out of the repository");
  const revs = Array.isArray(c.revisions) ? c.revisions : [];
  if (!revs.length) err("revisions must list the revisions, oldest first");
  const acs = new Set((c.criteria ?? []).map((a) => a.id));
  for (const a of c.criteria ?? []) {
    if (!/^AC-\d+$/.test(a.id) || typeof a.text !== "string" || !ADEQUATE[a.kind] || typeof a.required !== "boolean" || !Array.isArray(a.dependsOn)) err(`criterion ${a.id} needs id, text, kind (${Object.keys(ADEQUATE).join(", ")}), required and dependsOn`);
    if (a.kind === "api-authorization" && !(Array.isArray(a.deniedPaths) && a.deniedPaths.length)) err(`criterion ${a.id} needs deniedPaths`);
  }
  for (const f of c.changedFiles ?? []) if (!["source", "test", "generated"].includes(f.role) || !revs.includes(f.revision)) err(`changed file ${f.path} needs role and a listed revision`);
  for (const r of c.runs ?? []) {
    if (!/^R\d+$/.test(r.id) || typeof r.command !== "string" || !revs.includes(r.revision) || !Number.isInteger(r.exitCode)) err(`run ${r.id} needs id, command, a listed revision and exitCode`);
    for (const t of r.tests ?? []) if (!STATUSES.includes(t.status) || !(t.covers ?? []).every((x) => acs.has(x))) err(`run ${r.id} test ${t.name} needs a status and existing criteria`);
  }
  if (!["DONE", "PARTIAL", "BLOCKED"].includes(c.report?.outcome) || !Array.isArray(c.report?.claims)) err("report needs outcome and claims");
  for (const cl of c.report?.claims ?? []) if (!acs.has(cl.criterion)) err(`claim for unknown criterion ${cl.criterion}`);
  if (typeof c.reviewer?.independent !== "boolean") err("reviewer.independent must be true or false");
  const ex = c.expected ?? {};
  for (const id of acs) if (!VERDICTS.includes(ex.verdicts?.[id])) err(`expected verdict for ${id} is missing`);
  if (!["DONE", "PARTIAL", "BLOCKED"].includes(ex.outcome) || !["supported", "unsupported"].includes(ex.reportOutcome) || !(ex.flags ?? []).every((f) => FLAGS.includes(f))) err("expected needs outcome, reportOutcome and known flags");
  for (const f of privacyFindings(JSON.stringify(c))) err(`case: ${f}`);
  return errors;
}

// The reference review: re-derive each criterion from the recorded runs, never from the report.
export function auditCase(c) {
  const order = (rev) => c.revisions.indexOf(rev);
  const flags = new Set();
  if (!c.reviewer.independent) flags.add("same-session-review");
  const reviews = c.criteria.map((ac) => {
    const claims = c.report.claims.filter((x) => x.criterion === ac.id);
    const claimText = claims.map((x) => x.text).join(" ") || "no claim";
    const lastChange = Math.max(-1, ...c.changedFiles.filter((f) => f.role !== "test" && ac.dependsOn.includes(f.path)).map((f) => order(f.revision)));
    const covering = c.runs.flatMap((r) => (r.tests ?? []).filter((t) => (t.covers ?? []).includes(ac.id)).map((t) => ({ run: r, test: t })));
    const fresh = covering.filter((x) => order(x.run.revision) >= lastChange);
    const stale = covering.filter((x) => order(x.run.revision) < lastChange);
    const notes = [], limits = [];
    let next = "none";

    for (const cl of claims) {
      const run = cl.run ? c.runs.find((r) => r.id === cl.run) : null;
      if (cl.run && !run) { flags.add("cited-run-not-recorded"); notes.push(`claim cites run ${cl.run}, which was never recorded`); }
      if (run && cl.quoted && !String(run.excerpt ?? "").includes(cl.quoted)) { flags.add("quoted-result-contradicted"); notes.push(`quoted "${mask(cl.quoted)}" is not in the recorded output of ${run.id}`); }
      if (cl.status === "PASSED" && !cl.run && !covering.length) flags.add("claimed-pass-without-recorded-run");
      if (cl.status === "PASSED" && covering.some((x) => x.test.status === "FAILED" && order(x.run.revision) >= lastChange)) flags.add("claimed-pass-contradicted");
    }
    const testFiles = c.changedFiles.filter((f) => f.role === "test" && (ac.testFiles ?? []).includes(f.path));

    let verdict, source, method, observed;
    const failed = fresh.filter((x) => x.test.status === "FAILED");
    const adequate = fresh.filter((x) => x.test.status === "PASSED" && ADEQUATE[ac.kind].includes(x.test.level));
    if (failed.length) {
      verdict = "revise";
      observed = failed.map((x) => `${x.test.name} FAILED in ${x.run.id} at ${x.run.revision}${x.test.path ? ` (${x.test.path} path)` : ""}: ${mask(x.run.excerpt ?? "")}`).join("; ");
      next = `fix the behaviour so ${failed.map((x) => x.test.name).join(", ")} passes, then re-run`;
    } else if (ac.kind === "api-authorization") {
      const paths = new Set(adequate.map((x) => x.test.path));
      const missing = ["allowed", ...ac.deniedPaths].filter((p) => !paths.has(p));
      if (missing.length) {
        verdict = "verify_more"; flags.add("denied-path-missing");
        observed = `request-level evidence for ${[...paths].join(", ") || "no path"}; none for ${missing.join(", ")}`;
        next = `add and run request tests for the ${missing.join(" and ")} path${missing.length > 1 ? "s" : ""}`;
      } else { verdict = "accept"; observed = `all paths passed: ${[...paths].join(", ")}`; }
    } else if (adequate.length) {
      verdict = "accept"; observed = adequate.map((x) => `${x.test.name} PASSED (${x.test.level}) in ${x.run.id} at ${x.run.revision}`).join("; ");
    } else {
      verdict = "verify_more";
      const freshPassed = fresh.filter((x) => x.test.status === "PASSED");
      if (freshPassed.length) { flags.add("inadequate-method"); observed = `only ${[...new Set(freshPassed.map((x) => x.test.level))].join(", ")} evidence; ${ac.kind} needs ${ADEQUATE[ac.kind].join(", ")}`; next = ac.kind === "ui-interaction" ? "run a component or browser test of the interaction, or record a manual interaction" : "run an adequate test"; }
      else if (stale.length) { flags.add("stale-evidence"); observed = `last passing run ${stale.map((x) => `${x.run.id} at ${x.run.revision}`).join(", ")} predates the change at ${c.revisions[lastChange]}`; next = "re-run the covering tests on the current revision"; }
      else if (covering.some((x) => x.test.status !== "PASSED")) { observed = covering.map((x) => `${x.test.name} ${x.test.status}`).join("; "); next = "run the covering tests to completion"; }
      else { observed = testFiles.length ? `test file ${testFiles.map((f) => f.path).join(", ")} exists, but no recorded run executed it (NOT_RUN)` : "no recorded run covers this criterion"; next = testFiles.length ? "run the test and record the command, output and revision" : "add a test that exercises the criterion and run it"; }
    }
    if (claims.some((x) => x.verdict === "accept") && verdict !== "accept") flags.add("claimed-verdict-unsupported");
    source = covering.length ? `recorded run${new Set(covering.map((x) => x.run.id)).size > 1 ? "s" : ""} ${[...new Set(covering.map((x) => `${x.run.id} at ${x.run.revision}`))].join(", ")}` : "implementer's statement only";
    method = covering.length ? `read the recorded runner output and compared its revision with the last change to ${ac.dependsOn.join(", ")}` : "looked for a recorded run covering the criterion; found none";
    if (notes.length) observed = `${observed}; ${notes.join("; ")}`;
    limits.push("recorded output was not re-run by the reviewer");
    if (!c.reviewer.independent) limits.push("the reviewer is the session that made the change");
    if (ac.kind === "ui-interaction" && verdict !== "accept") limits.push("no interaction was observed");
    return { criterion: ac.id, claim: claimText, evidenceSource: source, independentMethod: method, observedOutcome: observed, confidenceLimitation: limits.join("; "), verdict, nextAction: next };
  });
  const required = c.criteria.filter((a) => a.required).map((a) => reviews.find((r) => r.criterion === a.id));
  const outcome = required.every((r) => r.verdict === "accept") ? "DONE" : "PARTIAL";
  const reportOutcome = c.report.outcome === outcome ? "supported" : "unsupported";
  return { $schema: REVIEW_SCHEMA, case: c.id, reviews, outcome, reportOutcome, flags: [...flags].sort() };
}

// Checks any grader's review against a case: shape of every review, verdicts, outcome and redaction.
export function scoreReview(c, review) {
  const errors = [];
  if (review?.$schema !== REVIEW_SCHEMA || review.case !== c.id) errors.push(`review must be ${REVIEW_SCHEMA} for ${c.id}`);
  for (const ac of c.criteria) {
    const r = (review?.reviews ?? []).find((x) => x.criterion === ac.id);
    if (!r) { errors.push(`${ac.id}: no review`); continue; }
    for (const f of REVIEW_FIELDS) if (typeof r[f] !== "string" || !r[f].trim()) errors.push(`${ac.id}: missing ${f}`);
    if (!VERDICTS.includes(r.verdict)) errors.push(`${ac.id}: verdict must be accept, verify_more or revise`);
    else if (r.verdict !== c.expected.verdicts[ac.id]) errors.push(`${ac.id}: verdict ${r.verdict}, expected ${c.expected.verdicts[ac.id]}`);
    for (const f of privacyFindings(JSON.stringify(r))) errors.push(`${ac.id}: ${f} in the review`);
  }
  if (review?.outcome !== c.expected.outcome) errors.push(`outcome ${review?.outcome}, expected ${c.expected.outcome}`);
  if (review?.reportOutcome !== c.expected.reportOutcome) errors.push(`report outcome ${review?.reportOutcome}, expected ${c.expected.reportOutcome}`);
  return errors;
}

export function loadCases(root) {
  const dir = inside(root, DIR);
  return fs.readdirSync(dir).filter((n) => n.endsWith(".json")).sort().map((n) => ({ file: `${DIR}/${n}`, data: JSON.parse(fs.readFileSync(path.join(dir, n), "utf8")) }));
}

export function gradeAll(root) {
  const errors = [], results = [];
  for (const { file, data } of loadCases(root)) {
    const invalid = validateCase(data, file);
    if (invalid.length) { errors.push(...invalid.map((e) => `${file}: ${e}`)); continue; }
    const review = auditCase(data);
    const mismatch = scoreReview(data, review);
    const missingFlags = data.expected.flags.filter((f) => !review.flags.includes(f));
    const extraFlags = review.flags.filter((f) => !data.expected.flags.includes(f));
    if (missingFlags.length || extraFlags.length) mismatch.push(`flags ${review.flags.join(",") || "none"}, expected ${data.expected.flags.join(",") || "none"}`);
    errors.push(...mismatch.map((e) => `${file}: ${e}`));
    results.push({ id: data.id, title: data.title, review, ok: !mismatch.length });
  }
  if (!results.length && !errors.length) errors.push(`${DIR}: no cases`);
  return { errors, results };
}

const argv = process.argv.slice(2);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  try {
    const root = fs.realpathSync(path.resolve(import.meta.dirname, "../.."));
    if (argv.includes("--score")) {
      const reviews = JSON.parse(fs.readFileSync(path.resolve(argv[argv.indexOf("--score") + 1]), "utf8"));
      const cases = loadCases(root);
      let bad = 0;
      for (const { data } of cases) {
        const r = (Array.isArray(reviews) ? reviews : [reviews]).find((x) => x?.case === data.id);
        const errs = r ? scoreReview(data, r) : ["no review submitted"];
        if (errs.length) bad++;
        console.log(`${data.id} ${errs.length ? "MISMATCH" : "MATCH"}${errs.length ? `: ${errs.join("; ")}` : ""}`);
      }
      console.log(`${bad ? "FAIL" : "PASS"} grader agreement: ${cases.length - bad}/${cases.length} cases`);
      process.exitCode = bad ? 1 : 0;
    } else {
      const { errors, results } = gradeAll(root);
      if (argv.includes("--json")) console.log(JSON.stringify({ errors, results }, null, 2));
      else {
        for (const r of results) {
          console.log(`${r.id} ${r.ok ? "OK" : "MISMATCH"} ${r.title}`);
          for (const v of r.review.reviews) console.log(`  ${v.criterion} ${v.verdict.padEnd(11)} ${v.observedOutcome.slice(0, 150)}`);
          console.log(`  outcome ${r.review.outcome}; report ${r.review.reportOutcome}; flags ${r.review.flags.join(", ") || "none"}`);
        }
        for (const e of errors) console.log(`ERROR ${e}`);
        console.log(`${errors.length ? "FAIL" : "PASS"} independent audit cases: ${results.filter((r) => r.ok).length}/${results.length} give the expected verdicts, outcome and report verdict (reference grader over recorded synthetic evidence; agent behaviour NOT_RUN)`);
      }
      process.exitCode = errors.length ? 1 : 0;
    }
  } catch (e) { console.log(`ERROR ${e.message}`); process.exitCode = 2; }
}
