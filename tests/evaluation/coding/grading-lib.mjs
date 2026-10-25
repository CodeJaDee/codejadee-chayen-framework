// Developer-only library for independent coding grading and rework metrics (evolution Step 17, D-074).
// Pure functions: it turns a Step 16 run record, the grader checks executed on its preserved workspace
// (oracle results), the rubric, and optional human and LLM logs into one grade per run; summarizes grades
// per configuration; compares configurations A (fast agent, no Chayen), B (the same agent with Chayen) and
// C (mentor-class agent with Chayen); and renders the report. Per-criterion verdicts come from the Step 13
// reference audit (`auditCase`): the agent's final answer is only a claim to check, never evidence. No
// process is started and no provider is called here. Never shipped with the plugin.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { auditCase, mask, ADEQUATE, VERDICTS } from "../../../tools/evals/audit-evidence.mjs";
import { CATEGORIES, privacyFindings } from "../../../tools/evals/failure-cases.mjs";
import { wilson, rate } from "../phase5/phase5-lib.mjs";
import { parseAnswer } from "./run-coding-fixtures.mjs";
import { pairKey, validateRecord } from "./coding-runner-lib.mjs";

export const RUBRIC_SCHEMA = "chayen-coding-rubric/1";
export const ORACLE_SCHEMA = "chayen-coding-oracle/1";
export const GRADE_SCHEMA = "chayen-coding-grade/1";
export const HUMAN_SCHEMA = "chayen-human-review/1";
export const LLM_SCHEMA = "chayen-llm-grade/1";
export const SPEC_SCHEMA = "chayen-coding-comparison/1";
export const REPORT_SCHEMA = "chayen-coding-comparison-report/1";
export const MIN_RUNS = 5;
export const ROLES = { A: { label: "Fast agent without Chayen", arm: "baseline" }, B: { label: "The same fast agent with Chayen", arm: "chayen" }, C: { label: "Mentor-class agent with Chayen", arm: "chayen" } };
// Failure categories: the failure-reproduction taxonomy (Step 11) where it fits, plus runner outcomes.
export const RUNNER_CATEGORIES = { "functional-failure": "Hidden or functional checks failed", "build-or-test-failure": "The repository's own build or tests failed", "oracle-not-run": "Functional checks could not be executed", "provider-error": "Provider error, no result", timeout: "Timed out", "limit-reached": "Budget or turn limit reached" };
export const CATEGORY_LABELS = { ...CATEGORIES, ...RUNNER_CATEGORIES };
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");

// ---------- rubric ----------
export function loadRubric(file) {
  const text = fs.readFileSync(file, "utf8"), r = JSON.parse(text);
  const errors = validateRubric(r);
  if (errors.length) throw new Error(`rubric rejected:\n  ${errors.join("\n  ")}`);
  return { ...r, sha256: sha(text.replace(/\r\n/g, "\n")) };
}
export function validateRubric(r) {
  const errors = [];
  if (r.$schema !== RUBRIC_SCHEMA) errors.push(`$schema must be ${RUBRIC_SCHEMA}`);
  for (const [id, t] of Object.entries(r.tasks ?? {})) {
    if (!["compare", "never-done"].includes(t.completionClaim)) errors.push(`${id}: completionClaim must be compare or never-done`);
    if (!Array.isArray(t.functional) || !t.functional.length) errors.push(`${id}: functional checks required`);
    for (const [ac, c] of Object.entries(t.criteria ?? {})) {
      if (!/^AC-\d+$/.test(ac) || !ADEQUATE[c.kind]) errors.push(`${id} ${ac}: kind must be one of ${Object.keys(ADEQUATE).join(", ")}`);
      if (!Array.isArray(c.evidence) || !c.evidence.length) errors.push(`${id} ${ac}: evidence required`);
      if (c.kind === "api-authorization" && !c.deniedPaths?.length) errors.push(`${id} ${ac}: deniedPaths required`);
      for (const e of c.evidence ?? []) {
        if (typeof e.check !== "string" || typeof e.level !== "string") errors.push(`${id} ${ac}: evidence needs check and level`);
        if (e.failOn !== undefined) try { new RegExp(e.failOn); } catch { errors.push(`${id} ${ac}: failOn is not a pattern`); }
      }
    }
  }
  return errors;
}
// Every criterion of the task is in the rubric (and only those), and every evidence item names a check the
// task's grader actually runs.
export function checkRubricAgainstTask(entry, task) {
  const errors = [], names = new Set((task.grading ?? []).map((g) => g.name ?? g.check));
  const acs = (task.acceptanceCriteria ?? []).map((a) => a.id);
  if (!entry) return [`${task.id}: no rubric entry`];
  if (JSON.stringify(Object.keys(entry.criteria).sort()) !== JSON.stringify([...acs].sort())) errors.push(`${task.id}: rubric criteria ${Object.keys(entry.criteria)} differ from the task's ${acs}`);
  for (const [ac, c] of Object.entries(entry.criteria)) for (const e of c.evidence) if (!names.has(e.check)) errors.push(`${task.id} ${ac}: no grading check named "${e.check}"`);
  for (const f of entry.functional) if (!names.has(f)) errors.push(`${task.id}: functional check "${f}" is not a grading check`);
  return errors;
}

// ---------- per-run grade ----------
// One rubric evidence item against the executed check. A check that failed for a reason tied to other
// tests or other criteria does not fail this item; a failure that cannot be attributed fails it.
export function itemStatus(item, result) {
  if (!result) return { status: "NOT_RUN", detail: `check "${item.check}" was not executed` };
  if (result.status === "NOT_RUN") return { status: "NOT_RUN", detail: result.detail };
  if (result.status === "PASS") return { status: "PASSED", detail: result.detail };
  if (item.failOn) return new RegExp(item.failOn, "i").test(result.detail) ? { status: "FAILED", detail: result.detail } : { status: "PASSED", detail: `the check failed for another criterion: ${result.detail}` };
  if (item.tests) {
    const failed = result.failedTests ?? [];
    if (result.build === "FAILED" || !failed.length) return { status: "FAILED", detail: result.detail };
    const hit = failed.filter((n) => item.tests.some((t) => n.includes(t)));
    return hit.length ? { status: "FAILED", detail: `failed: ${hit.join(", ")}` } : { status: "PASSED", detail: `named tests passed; other tests failed: ${failed.join(", ")}` };
  }
  return { status: "FAILED", detail: result.detail };
}
// A Step 13 audit case: criteria from the task and rubric; one recorded run per grader check (all at the
// final revision, executed by the grader, not the agent); the agent's answer only as the report.
export function buildAuditCase(task, entry, oracle, answer) {
  const results = new Map((oracle?.checks ?? []).map((c) => [c.name, c]));
  const checks = [...new Set(Object.values(entry.criteria).flatMap((c) => c.evidence.map((e) => e.check)))];
  const claimed = parseAnswer(answer ?? "").outcome;
  return {
    $schema: "chayen-audit-case/1", id: "AU-9999", title: task.title ?? task.id, synthetic: true, revisions: ["source", "final"],
    criteria: task.acceptanceCriteria.map((ac) => { const c = entry.criteria[ac.id]; return { id: ac.id, text: ac.text, kind: c.kind, required: c.required !== false, dependsOn: [], ...(c.deniedPaths ? { deniedPaths: c.deniedPaths } : {}) }; }),
    changedFiles: [],
    runs: checks.map((name, i) => {
      const res = results.get(name);
      return {
        id: `R${i + 1}`, command: `grader check: ${name}`, revision: "final", exitCode: !res || res.status === "NOT_RUN" ? -1 : res.status === "PASS" ? 0 : 1, excerpt: mask(res?.detail ?? "not executed"),
        tests: Object.entries(entry.criteria).flatMap(([ac, c]) => c.evidence.filter((e) => e.check === name).map((e) => ({ name: e.tests ? `${name}: ${e.tests.join(", ")}` : name, status: itemStatus(e, res).status, covers: [ac], level: e.level, ...(e.path ? { path: e.path } : {}) }))),
      };
    }),
    report: { outcome: claimed ?? "PARTIAL", claims: [] },
    reviewer: { independent: true },
  };
}

const COMPLETION_LANGUAGE = /\b(?:fixed|done|completed?|implemented|resolved|all (?:tests|checks) pass(?:ed)?)\b/i;
const tokenTotal = (u) => {
  if (!u || typeof u !== "object") return null;
  const n = (k) => (typeof u[k] === "number" ? u[k] : 0);
  // Claude reports cache tokens beside input tokens; Codex's cached_input_tokens are part of input_tokens.
  const total = n("input_tokens") + n("output_tokens") + n("cache_creation_input_tokens") + n("cache_read_input_tokens");
  return total || null;
};
// One grade per run record. Only executed checks are evidence; NOT_RUN stays NOT_RUN.
export function deriveGrade(record, { task, entry, oracle = null, answer = "", human = null, llm = [] }) {
  validateRecord(record);
  const c = buildAuditCase(task, entry, oracle, answer);
  const review = auditCase(c);
  const claimedOutcome = parseAnswer(answer).outcome;
  const reportOutcome = entry.completionClaim === "never-done" ? "not-applicable" : claimedOutcome ? review.reportOutcome : "not-stated";
  const unverifiedCompletionClaim = (claimedOutcome === "DONE" && (entry.completionClaim === "never-done" || review.outcome !== "DONE")) || record.claim.falseDoneClaim === true;
  const results = new Map((oracle?.checks ?? []).map((x) => [x.name, x]));
  const fn = entry.functional.map((n) => results.get(n)?.status ?? "NOT_RUN");
  const functional = fn.includes("FAIL") ? "FAIL" : fn.every((s) => s === "PASS") ? "PASS" : "NOT_RUN";
  const buildTest = { PASS: "PASS", FAIL: "FAIL" }[record.verification.status] ?? "NOT_RUN";
  const noChange = (oracle?.checks ?? []).some((x) => x.check === "no-changes" && x.status === "FAIL");
  const scopeViolations = [...new Set([...record.diff.outsideScope, ...record.diff.mustNotChange, ...(noChange ? record.diff.files.map((f) => f.path) : [])])].sort();
  const accepted = review.reviews.filter((r) => r.verdict === "accept");
  const required = task.acceptanceCriteria.filter((a) => entry.criteria[a.id].required !== false).map((a) => a.id);
  const m = record.metrics;
  const cycles = typeof m.verificationRevisionCycles === "number" ? m.verificationRevisionCycles : null;
  const gapFlags = review.flags.filter((f) => f !== "same-session-review");
  const evidenceGaps = review.reviews.filter((r) => r.verdict === "verify_more").length + gapFlags.length;
  const security = record.security.classification;
  const categories = [];
  if (unverifiedCompletionClaim) categories.push("false-done-claim");
  if (scopeViolations.length) categories.push("scope-expansion");
  if (evidenceGaps || (record.diff.files.length && m.verificationCommands === 0)) categories.push("missing-verification");
  if (security !== "NO_UNSAFE_ACTION") categories.push("permission-or-policy-violation");
  if ((oracle?.checks ?? []).some((x) => /INVENTED_SCHEMA/.test(x.detail ?? ""))) categories.push("invented-schema-or-command");
  if (functional === "FAIL") categories.push("functional-failure");
  if (functional === "NOT_RUN") categories.push("oracle-not-run");
  if (buildTest === "FAIL") categories.push("build-or-test-failure");
  if (record.completion === "ERROR_NO_RESULT") categories.push("provider-error");
  if (record.completion === "TIMEOUT") categories.push("timeout");
  if (["BUDGET_LIMIT", "TURN_LIMIT"].includes(record.completion)) categories.push("limit-reached");
  return {
    $schema: GRADE_SCHEMA, stem: record.stem, task: record.task, arm: record.arm, provider: record.provider, modelConfig: record.modelConfig, effort: record.effort, cliVersion: record.cliVersion,
    candidateId: record.candidateId, run: record.run, attempt: record.attempt, evidenceLevel: record.evidenceLevel,
    oracle: { execution: oracle?.execution ?? "not-run", reason: oracle?.reason ?? (oracle ? null : "no oracle results for this run (not graded, or grading BLOCKED)"), graderSha256: oracle?.graderSha256 ?? null },
    review: { ...review, case: record.stem, reportOutcome },
    correctness: {
      acAccepted: accepted.length, acTotal: review.reviews.length, requiredAccepted: required.filter((id) => accepted.some((r) => r.criterion === id)).length, requiredTotal: required.length,
      outcome: review.outcome, buildTest, functional, scopeViolations, claimedOutcome, unverifiedCompletionClaim,
      completionLanguageHeuristic: claimedOutcome ? null : COMPLETION_LANGUAGE.test(answer),
      firstPassCompletion: review.outcome === "DONE" && record.attempt === 1 && m.editsAfterFirstVerification === 0 && !unverifiedCompletionClaim,
    },
    rework: { failedImplementationAttempts: cycles === null ? null : cycles + (review.outcome === "DONE" ? 0 : 1), revisions: m.editsAfterFirstVerification, verificationRevisionCycles: cycles, evidenceGaps },
    efficiency: { seconds: record.seconds, outputTokens: record.usage?.output_tokens ?? null, totalTokens: tokenTotal(record.usage), toolCalls: m.toolCalls, searchReadOperations: typeof m.searchReadOperations === "number" ? m.searchReadOperations : null, costUsd: record.costReported ? record.costUsd : null },
    human: human ? humanSummary(human) : { status: "NOT_RECORDED", reviewer: null, rounds: null, interventions: null, approvals: null, durationSeconds: null, verdicts: null },
    approvalRequestsDenied: m.deniedActions,
    llm: llm.length ? { status: "LLM_JUDGEMENT", note: "separately labelled; never changes an automatic verdict and never replaces execution evidence", grades: llm.map((g) => ({ criterion: g.criterion, model: g.grader.model, verdict: g.verdict })) } : { status: "NOT_USED" },
    security, completion: record.completion, failureCategories: categories,
  };
}

// ---------- human review and LLM grade logs ----------
const NOT_A_HUMAN = /\b(?:claude|codex|copilot|gpt|gemini|llm|agent|bot|assistant|model|ai)\b/i;
const INTERVENTIONS = ["comment", "question", "change-request", "fix-by-human", "rejection"];
// Human review time is measured only from the reviewer's own recorded start and end; it is never derived
// from agent traces, and a duration field is not accepted.
export function validateHuman(e, stems) {
  const errors = [], at = (s) => (typeof s === "string" && !Number.isNaN(Date.parse(s)) ? Date.parse(s) : null);
  const KEYS = ["$schema", "stem", "reviewer", "independentOfAgent", "rounds", "interventions", "approvals", "startedAt", "endedAt", "verdicts", "notes"];
  for (const k of Object.keys(e ?? {})) if (!KEYS.includes(k)) errors.push(`unknown field ${k}${/duration/i.test(k) ? " (review time comes only from startedAt and endedAt)" : ""}`);
  if (e?.$schema !== HUMAN_SCHEMA) errors.push(`$schema must be ${HUMAN_SCHEMA}`);
  if (!stems.has(e?.stem)) errors.push(`stem ${e?.stem} is not a recorded run`);
  if (typeof e?.reviewer?.name !== "string" || !e.reviewer.name.trim() || NOT_A_HUMAN.test(e.reviewer.name)) errors.push("reviewer.name must name a person; an agent or model is not a human reviewer");
  if (e?.independentOfAgent !== true) errors.push("independentOfAgent must be true");
  if (!Number.isInteger(e?.rounds) || e.rounds < 1) errors.push("rounds must be an integer of at least 1");
  for (const i of e?.interventions ?? []) if (!INTERVENTIONS.includes(i.kind) || !Number.isInteger(i.round)) errors.push(`intervention needs round and kind (${INTERVENTIONS.join(", ")})`);
  for (const a of e?.approvals ?? []) if (typeof a.event !== "string" || typeof a.approved !== "boolean") errors.push("approval needs event and approved");
  if (!Array.isArray(e?.interventions) || !Array.isArray(e?.approvals)) errors.push("interventions and approvals must be lists (empty when none)");
  const s = at(e?.startedAt), f = at(e?.endedAt);
  if ((e?.startedAt === undefined) !== (e?.endedAt === undefined)) errors.push("give both startedAt and endedAt, or neither");
  else if (e?.startedAt !== undefined && (s === null || f === null || f <= s || f - s > 86_400_000)) errors.push("startedAt and endedAt must be ISO times, end after start, within 24 hours");
  for (const v of Object.values(e?.verdicts ?? {})) if (!VERDICTS.includes(v)) errors.push(`human verdicts must be ${VERDICTS.join(", ")}`);
  for (const p of privacyFindings(JSON.stringify(e ?? {}))) errors.push(`privacy: ${p}`);
  return errors;
}
function humanSummary(e) {
  const d = e.startedAt ? Math.round((Date.parse(e.endedAt) - Date.parse(e.startedAt)) / 1000) : null;
  return { status: "RECORDED", reviewer: e.reviewer.name, rounds: e.rounds, interventions: e.interventions.length, approvals: e.approvals.length, durationSeconds: d, durationSource: d === null ? "not recorded" : "reviewer's recorded start and end", verdicts: e.verdicts ?? null };
}
// An LLM grade may comment only on a rubric item marked llmAllowed; it never replaces execution evidence.
export function validateLlm(g, stems, entryFor) {
  const errors = [];
  if (g?.$schema !== LLM_SCHEMA) errors.push(`$schema must be ${LLM_SCHEMA}`);
  if (!stems.has(g?.stem)) errors.push(`stem ${g?.stem} is not a recorded run`);
  if (typeof g?.grader?.model !== "string" || !g.grader.model) errors.push("grader.model is required (LLM grades are labelled with their model)");
  if (!VERDICTS.includes(g?.verdict)) errors.push(`verdict must be ${VERDICTS.join(", ")}`);
  const c = entryFor(g?.stem)?.criteria?.[g?.criterion];
  if (!c) errors.push(`criterion ${g?.criterion} is not in the rubric`);
  else if (!c.llmAllowed) errors.push(`criterion ${g.criterion} is decided by execution evidence; an LLM grade cannot stand in for it`);
  return errors;
}

// ---------- statistics ----------
export function describe(values) {
  const v = values.filter((x) => typeof x === "number" && Number.isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return { n: 0, mean: null, median: null, min: null, max: null, sd: null };
  const mean = v.reduce((a, b) => a + b, 0) / v.length, mid = Math.floor(v.length / 2);
  const median = v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
  const sd = v.length > 1 ? Math.sqrt(v.reduce((a, b) => a + (b - mean) ** 2, 0) / (v.length - 1)) : null;
  const r = (x) => (x === null ? null : +x.toFixed(4));
  return { n: v.length, mean: r(mean), median: r(median), min: r(v[0]), max: r(v.at(-1)), sd: r(sd) };
}
// Newcombe's hybrid score interval (method 10) for p2 - p1, built from the two Wilson intervals.
export function newcombe(k1, n1, k2, n2) {
  if (!n1 || !n2) return { estimate: null, low: null, high: null };
  const p1 = k1 / n1, p2 = k2 / n2, w1 = wilson(k1, n1), w2 = wilson(k2, n2), d = p2 - p1;
  return { estimate: +d.toFixed(4), low: +Math.max(-1, d - Math.sqrt((p2 - w2.low) ** 2 + (w1.high - p1) ** 2)).toFixed(4), high: +Math.min(1, d + Math.sqrt((w2.high - p2) ** 2 + (p1 - w1.low) ** 2)).toFixed(4) };
}

// The scored grade of each run is its last attempt.
export const scoredGrades = (grades) => [...grades.reduce((m, g) => m.set(`${g.task}|${g.run}`, !m.get(`${g.task}|${g.run}`) || m.get(`${g.task}|${g.run}`).attempt < g.attempt ? g : m.get(`${g.task}|${g.run}`)), new Map()).values()].sort((a, b) => a.task.localeCompare(b.task) || a.run - b.run);
const RATES = {
  completedDone: ["Runs whose independent review outcome is DONE", (g) => g.correctness.outcome === "DONE"],
  buildTestPass: ["Repository build and tests pass (runner verification inside the boundary)", (g) => (g.correctness.buildTest === "NOT_RUN" ? null : g.correctness.buildTest === "PASS")],
  functionalPass: ["Functional (hidden) checks pass", (g) => (g.correctness.functional === "NOT_RUN" ? null : g.correctness.functional === "PASS")],
  firstPassCompletion: ["First-pass completion (DONE, first attempt, no edit after the first verification, no unverified claim)", (g) => g.correctness.firstPassCompletion],
  unverifiedCompletionClaim: ["Runs with an unverified completion claim", (g) => g.correctness.unverifiedCompletionClaim],
  scopeViolation: ["Runs with an unauthorized scope change", (g) => g.correctness.scopeViolations.length > 0],
};
const LOWER_IS_BETTER = new Set(["unverifiedCompletionClaim", "scopeViolation"]);
const MEASURES = {
  failedImplementationAttempts: (g) => g.rework.failedImplementationAttempts, revisions: (g) => g.rework.revisions, verificationRevisionCycles: (g) => g.rework.verificationRevisionCycles, evidenceGaps: (g) => g.rework.evidenceGaps,
  seconds: (g) => g.efficiency.seconds, outputTokens: (g) => g.efficiency.outputTokens, totalTokens: (g) => g.efficiency.totalTokens, toolCalls: (g) => g.efficiency.toolCalls,
  searchReadOperations: (g) => g.efficiency.searchReadOperations, costUsd: (g) => g.efficiency.costUsd, approvalRequestsDenied: (g) => g.approvalRequestsDenied,
  humanInterventions: (g) => g.human.interventions, humanReviewRounds: (g) => g.human.rounds, humanReviewSeconds: (g) => g.human.durationSeconds, humanApprovalEvents: (g) => g.human.approvals,
};
export function summarizeGrades(grades) {
  const s = scoredGrades(grades);
  const rates = Object.fromEntries(Object.entries(RATES).map(([k, [, f]]) => { const v = s.map(f).filter((x) => x !== null); return [k, { ...rate(v.filter(Boolean).length, v.length), notRun: s.length - v.length }]; }));
  const categories = {};
  for (const g of s) for (const c of g.failureCategories) categories[c] = (categories[c] ?? 0) + 1;
  return {
    runs: s.length, attemptsGraded: grades.length,
    acceptanceCriteria: { accepted: s.reduce((a, g) => a + g.correctness.acAccepted, 0), total: s.reduce((a, g) => a + g.correctness.acTotal, 0), note: "criteria within a run are not independent; no interval is given" },
    rates, measures: Object.fromEntries(Object.entries(MEASURES).map(([k, f]) => [k, describe(s.map(f))])),
    failureCategories: Object.fromEntries(Object.entries(categories).sort()),
    oracleExecution: [...new Set(s.map((g) => g.oracle.execution))].sort(),
    humanReview: { recordedRuns: s.filter((g) => g.human.status === "RECORDED").length, timedRuns: s.filter((g) => g.human.durationSeconds !== null).length, humanVerdicts: s.filter((g) => g.human.verdicts).map((g) => ({ stem: g.stem, verdicts: g.human.verdicts })) },
    llmGrades: s.flatMap((g) => (g.llm.status === "LLM_JUDGEMENT" ? g.llm.grades.map((x) => ({ stem: g.stem, ...x })) : [])),
    perRun: s.map((g) => ({ stem: g.stem, outcome: g.correctness.outcome, ac: `${g.correctness.acAccepted}/${g.correctness.acTotal}`, functional: g.correctness.functional, unverifiedClaim: g.correctness.unverifiedCompletionClaim, seconds: g.efficiency.seconds, outputTokens: g.efficiency.outputTokens, costUsd: g.efficiency.costUsd, categories: g.failureCategories })),
  };
}

// ---------- comparison ----------
const DATA_STATUS = (levels) => (levels.some((l) => /^synthetic/.test(l)) ? "SYNTHETIC" : levels.some((l) => /^simulated/.test(l)) ? "SIMULATED" : "PROVIDER_RUNS");
function rateDiff(a, b, minRuns, dataStatus, key) {
  const ra = a.rates[key], rb = b.rates[key], ci = newcombe(ra.k, ra.n, rb.k, rb.n);
  const status = dataStatus !== "PROVIDER_RUNS" ? "NOT_MEASURED" : ra.n < minRuns || rb.n < minRuns ? "INSUFFICIENT_SAMPLE" : ci.low <= 0 && ci.high >= 0 ? "INCONCLUSIVE" : "DIFFERENCE_OBSERVED";
  return { metric: key, from: { k: ra.k, n: ra.n, value: ra.value }, to: { k: rb.k, n: rb.n, value: rb.value }, difference: ci.estimate, ci95: [ci.low, ci.high], method: "Newcombe hybrid score (Wilson)", lowerIsBetter: LOWER_IS_BETTER.has(key), status };
}
function measureDiff(a, b, minRuns, dataStatus, key) {
  const ma = a.measures[key], mb = b.measures[key];
  const status = dataStatus !== "PROVIDER_RUNS" ? "NOT_MEASURED" : ma.n < minRuns || mb.n < minRuns ? "INSUFFICIENT_SAMPLE" : "DESCRIPTIVE_ONLY";
  return { metric: key, from: { n: ma.n, median: ma.median, min: ma.min, max: ma.max }, to: { n: mb.n, median: mb.median, min: mb.min, max: mb.max }, medianDifference: ma.median === null || mb.median === null ? null : +(mb.median - ma.median).toFixed(4), status };
}
const CONFIG_KEY = (m) => JSON.stringify([m.provider, m.cliVersion, m.modelConfig, m.effort ?? null, m.candidate?.id, m.isolation?.profileSha256 ?? null, m.evidenceLevel]);
// The A/B pair must be the same agent configuration in every respect but the arm; C must share the task,
// snapshot, prompt, environment and permissions (it may use another model). Nothing is pooled across
// provider or model configurations.
export function checkComparison(configs) {
  const errors = [];
  for (const [label, c] of Object.entries(configs)) {
    if (!ROLES[label]) { errors.push(`unknown configuration ${label}; use A, B and C`); continue; }
    if (!c.runs.length) errors.push(`${label}: no results`);
    for (const r of c.runs) if (r.meta.arm !== ROLES[label].arm) errors.push(`${label} (${ROLES[label].label}) needs the ${ROLES[label].arm} arm; ${r.dir} is ${r.meta.arm}`);
    if (new Set(c.runs.map((r) => CONFIG_KEY(r.meta))).size > 1) errors.push(`${label}: results from different provider, CLI, model, effort, candidate, isolation or evidence level are never pooled`);
    const tasks = c.runs.map((r) => r.meta.task);
    if (new Set(tasks).size !== tasks.length) errors.push(`${label}: one results directory per task (merge repeated runs with --runs, not by pooling directories)`);
  }
  if (!configs.A || !configs.B) errors.push("configurations A and B are both required");
  const env = (m) => JSON.stringify([m.task, m.sourceFixture, m.sourceCommit, m.promptSha256, m.candidate?.id, m.isolation?.profileSha256 ?? null, m.toolPolicy]);
  for (const [x, y, strict] of [["A", "B", true], ["B", "C", false]]) {
    if (!configs[x] || !configs[y]) continue;
    for (const ry of configs[y].runs) {
      const rx = configs[x].runs.find((r) => r.meta.task === ry.meta.task);
      if (!rx) { errors.push(`${y} has task ${ry.meta.task}, ${x} does not`); continue; }
      if (strict && pairKey(rx.meta) !== pairKey(ry.meta)) errors.push(`A and B differ on task ${ry.meta.task} in more than the arm (provider, CLI, model, effort, candidate, snapshot, prompt, isolation or tool policy)`);
      if (!strict && env(rx.meta) !== env(ry.meta)) errors.push(`C differs from B on task ${ry.meta.task} in task, snapshot, prompt, candidate, environment or permissions`);
    }
  }
  if (configs.A && configs.B) for (const ra of configs.A.runs) if (!configs.B.runs.some((r) => r.meta.task === ra.meta.task)) errors.push(`A has task ${ra.meta.task}, B does not`);
  return errors;
}

export function compare(configs, { title = "Coding comparison", minRuns = MIN_RUNS, rubricSha256 = null } = {}) {
  const errors = checkComparison(configs);
  if (errors.length) throw new Error(`Not comparable:\n  ${errors.join("\n  ")}`);
  const levels = Object.values(configs).flatMap((c) => c.runs.map((r) => r.meta.evidenceLevel));
  const dataStatus = DATA_STATUS(levels);
  const tasks = [...new Set(Object.values(configs).flatMap((c) => c.runs.map((r) => r.meta.task)))].sort();
  const out = { $schema: REPORT_SCHEMA, title, dataStatus, liveImprovementClaims: dataStatus === "PROVIDER_RUNS" ? "MEASURED (see each difference's status)" : "NOT_MEASURED", minRuns, rubricSha256, configurations: {}, comparisons: [] };
  const summaries = {};
  for (const [label, c] of Object.entries(configs).sort()) {
    const m = c.runs[0].meta;
    summaries[label] = { pooled: summarizeGrades(c.runs.flatMap((r) => r.grades)), tasks: Object.fromEntries(c.runs.map((r) => [r.meta.task, summarizeGrades(r.grades)]).sort()) };
    out.configurations[label] = { role: ROLES[label].label, arm: m.arm, provider: m.provider, cliVersion: m.cliVersion, modelConfig: m.modelConfig, effort: m.effort ?? null, candidateId: m.candidate?.id, evidenceLevel: m.evidenceLevel, isolation: m.isolation?.backend, ...summaries[label] };
  }
  for (const [x, y, note] of [["A", "B", "Controlled for Chayen: the same agent configuration, task, snapshot, prompt, environment and permissions; only the arm differs."], ["B", "C", "Not controlled for Chayen: both arms use Chayen, and the agent (model or provider) differs."]]) {
    if (!summaries[x] || !summaries[y]) continue;
    const pair = (sx, sy) => ({ rates: Object.keys(RATES).map((k) => rateDiff(sx, sy, minRuns, dataStatus, k)), measures: Object.keys(MEASURES).map((k) => measureDiff(sx, sy, minRuns, dataStatus, k)) });
    out.comparisons.push({ name: `${y} vs ${x}`, from: x, to: y, controlledForChayen: x === "A" && y === "B", note, pooled: pair(summaries[x].pooled, summaries[y].pooled), tasks: Object.fromEntries(tasks.filter((t) => summaries[x].tasks[t] && summaries[y].tasks[t]).map((t) => [t, pair(summaries[x].tasks[t], summaries[y].tasks[t])])) });
  }
  out.recommendations = recommend(out, configs);
  out.limitations = [
    "Differences are associations under the recorded conditions. A versus B is a controlled comparison of one agent configuration; it is still subject to provider-side nondeterminism and model updates, and generalises only to the tasks and fixtures measured.",
    "Rates use Wilson 95% intervals; differences of rates use Newcombe's hybrid score interval. Time, token and cost differences are descriptive medians with ranges, without an interval.",
    `A difference with fewer than ${minRuns} scored runs on either side is INSUFFICIENT_SAMPLE; one whose interval includes 0 is INCONCLUSIVE.`,
    "Acceptance criteria within a run are not independent, so criteria counts carry no interval.",
    "Human review time is reported only from the reviewer's recorded start and end times; it is never estimated from agent traces.",
    "LLM grades, when present, are listed separately and change no automatic verdict.",
    "Pooled rows combine tasks without weighting by difficulty; read the per-task rows first.",
  ];
  return out;
}

function recommend(report, configs) {
  const recs = [];
  if (report.dataStatus !== "PROVIDER_RUNS") recs.push(`Run the comparison with real providers once the owner authorizes it and an isolation profile verifies (Step 16). This report is ${report.dataStatus}: live improvement claims are NOT_MEASURED.`);
  const small = Object.entries(report.configurations).flatMap(([l, c]) => Object.entries(c.tasks).filter(([, s]) => s.runs < report.minRuns).map(([t, s]) => `${l}/${t} n=${s.runs}`));
  if (small.length) recs.push(`Add runs until each configuration has at least ${report.minRuns} scored runs per task (now ${small.join(", ")}).`);
  const notRun = [...new Set(Object.values(configs).flatMap((c) => c.runs.flatMap((r) => r.grades.filter((g) => g.correctness.functional === "NOT_RUN").map((g) => g.oracle.reason ?? `functional checks NOT_RUN on ${g.task}`))))];
  if (notRun.length) recs.push(`Execute the functional checks that stayed NOT_RUN: ${notRun.slice(0, 4).join("; ")}.`);
  const inconclusive = report.comparisons.flatMap((c) => c.pooled.rates.filter((r) => r.status === "INCONCLUSIVE").map((r) => `${c.name} ${r.metric}`));
  if (inconclusive.length) recs.push(`Increase runs for inconclusive differences (${inconclusive.join(", ")}); an interval that includes 0 supports no claim either way.`);
  if (Object.values(report.configurations).every((c) => c.pooled.humanReview.recordedRuns === 0)) recs.push("Record human review per run with chayen-human-review/1 (a named reviewer, rounds, interventions, approvals, start and end times) to measure review effort.");
  const claims = Object.entries(report.configurations).filter(([, c]) => c.pooled.rates.unverifiedCompletionClaim.k > 0).map(([l]) => l);
  if (claims.length) recs.push(`Inspect unverified completion claims in ${claims.join(", ")} first: they are the cases where an agent's DONE would cost reviewer time.`);
  return recs;
}

// ---------- report rendering ----------
const pct = (r) => (r.value === null ? "n/a" : `${(r.value * 100).toFixed(0)}% (${r.k}/${r.n}; 95% CI ${(r.wilson95.low * 100).toFixed(0)}–${(r.wilson95.high * 100).toFixed(0)}%)`);
const num = (x) => (x === null || x === undefined ? "n/a" : String(x));
const dist = (d) => (d.n ? `${num(d.median)} [${num(d.min)}–${num(d.max)}], n=${d.n}${d.sd !== null ? `, sd ${d.sd}` : ""}` : "not available");
export function renderMarkdown(r) {
  const L = [], cfgs = Object.entries(r.configurations);
  const row = (cells) => L.push(`| ${cells.join(" | ")} |`);
  L.push(`# ${r.title}`, "");
  L.push(`**Data:** ${r.dataStatus}. **Live improvement claims:** ${r.liveImprovementClaims}.`, "");
  if (r.dataStatus !== "PROVIDER_RUNS") L.push(`> This report is built from ${r.dataStatus === "SYNTHETIC" ? "synthetic records" : "fake-provider runs"}. Its numbers test the method only. They say nothing about Chayen's effect.`, "");
  L.push("## Configurations", "");
  row(["Label", "Role", "Arm", "Provider", "Model", "Effort", "CLI", "Evidence level", "Runs"]); row(Array(9).fill("---"));
  for (const [l, c] of cfgs) row([l, c.role, c.arm, c.provider, c.modelConfig, num(c.effort), c.cliVersion, c.evidenceLevel, String(c.pooled.runs)]);
  const section = (title, labels) => {
    L.push("", `## ${title}`, "");
    for (const [l, c] of cfgs.filter(([l]) => labels.includes(l))) {
      L.push(`### ${l}: ${c.role}`, "");
      row(["Task", "Runs", "DONE (independent review)", "AC accepted", "Build and tests", "Functional checks", "First pass", "Unverified claims", "Scope violations"]); row(Array(9).fill("---"));
      for (const [t, s] of [...Object.entries(c.tasks), ["pooled (all tasks)", c.pooled]]) row([t, String(s.runs), pct(s.rates.completedDone), `${s.acceptanceCriteria.accepted}/${s.acceptanceCriteria.total}`, `${pct(s.rates.buildTestPass)}${s.rates.buildTestPass.notRun ? `, ${s.rates.buildTestPass.notRun} NOT_RUN` : ""}`, `${pct(s.rates.functionalPass)}${s.rates.functionalPass.notRun ? `, ${s.rates.functionalPass.notRun} NOT_RUN` : ""}`, pct(s.rates.firstPassCompletion), pct(s.rates.unverifiedCompletionClaim), pct(s.rates.scopeViolation)]);
      L.push("");
    }
  };
  section("Baseline", ["A"]);
  section("Chayen-enabled", ["B", "C"]);
  L.push("", "## Differences", "");
  for (const c of r.comparisons) {
    L.push(`### ${c.name}`, "", c.note, "");
    row(["Metric", c.from, c.to, "Difference", "95% CI", "Status"]); row(Array(6).fill("---"));
    for (const d of c.pooled.rates) row([`${d.metric}${d.lowerIsBetter ? " (lower is better)" : ""}`, `${d.from.k}/${d.from.n}`, `${d.to.k}/${d.to.n}`, num(d.difference), `${num(d.ci95[0])} to ${num(d.ci95[1])}`, d.status]);
    L.push("");
  }
  L.push("## Confidence and uncertainty", "");
  L.push(`Minimum scored runs per configuration and task for any claim: ${r.minRuns}. Statuses: NOT_MEASURED (synthetic or fake data), INSUFFICIENT_SAMPLE, INCONCLUSIVE (the interval includes 0), DIFFERENCE_OBSERVED, DESCRIPTIVE_ONLY (no interval).`, "");
  row(["Config", "Task", "Runs", "Attempts graded", "Elapsed s (median [min–max])", "Output tokens", "Tool calls"]); row(Array(7).fill("---"));
  for (const [l, c] of cfgs) for (const [t, s] of Object.entries(c.tasks)) row([l, t, String(s.runs), String(s.attemptsGraded), dist(s.measures.seconds), dist(s.measures.outputTokens), dist(s.measures.toolCalls)]);
  L.push("", "## Rework", "");
  row(["Config", "Failed implementation attempts", "Revisions", "Verification/revision cycles", "Evidence gaps (independent review)"]); row(Array(5).fill("---"));
  for (const [l, c] of cfgs) row([l, dist(c.pooled.measures.failedImplementationAttempts), dist(c.pooled.measures.revisions), dist(c.pooled.measures.verificationRevisionCycles), dist(c.pooled.measures.evidenceGaps)]);
  L.push("", "## Failure categories", "");
  const cats = [...new Set(cfgs.flatMap(([, c]) => Object.keys(c.pooled.failureCategories)))].sort();
  row(["Category", ...cfgs.map(([l]) => l)]); row(Array(cfgs.length + 1).fill("---"));
  for (const k of cats) row([`${CATEGORY_LABELS[k] ?? k} (\`${k}\`)`, ...cfgs.map(([, c]) => String(c.pooled.failureCategories[k] ?? 0))]);
  if (!cats.length) L.push("No failure category was recorded.");
  L.push("", "## Token, time and cost trade-offs", "");
  row(["Config", "Elapsed s", "Output tokens", "Total tokens", "Tool calls", "Search/read operations", "Reported cost USD"]); row(Array(7).fill("---"));
  for (const [l, c] of cfgs) { const m = c.pooled.measures; row([l, dist(m.seconds), dist(m.outputTokens), dist(m.totalTokens), dist(m.toolCalls), dist(m.searchReadOperations), dist(m.costUsd)]); }
  for (const c of r.comparisons) {
    L.push("", `${c.name}, median differences (${c.to} minus ${c.from}):`, "");
    row(["Metric", "Median difference", "Status"]); row(["---", "---", "---"]);
    for (const d of c.pooled.measures.filter((x) => ["seconds", "outputTokens", "totalTokens", "toolCalls", "searchReadOperations", "costUsd"].includes(x.metric))) row([d.metric, num(d.medianDifference), d.status]);
  }
  L.push("", "## Human involvement", "");
  row(["Config", "Runs with recorded human review", "Timed reviews", "Interventions", "Review rounds", "Measured review seconds", "Approval events", "Approval requests denied (agent trace)"]); row(Array(8).fill("---"));
  for (const [l, c] of cfgs) { const m = c.pooled.measures, h = c.pooled.humanReview; row([l, `${h.recordedRuns}/${c.pooled.runs}`, String(h.timedRuns), dist(m.humanInterventions), dist(m.humanReviewRounds), dist(m.humanReviewSeconds), dist(m.humanApprovalEvents), dist(m.approvalRequestsDenied)]); }
  L.push("", "Human verdicts are listed separately and never pooled with automatic grades:", "");
  const hv = cfgs.flatMap(([l, c]) => c.pooled.humanReview.humanVerdicts.map((v) => `- ${l} ${v.stem}: ${Object.entries(v.verdicts).map(([k, x]) => `${k} ${x}`).join(", ")}`));
  L.push(...(hv.length ? hv : ["- none recorded"]));
  L.push("", "## LLM-labelled grades", "");
  const lg = cfgs.flatMap(([l, c]) => c.pooled.llmGrades.map((g) => `- ${l} ${g.stem} ${g.criterion}: ${g.verdict} (model ${g.model}; label only, no automatic verdict changed)`));
  L.push(...(lg.length ? lg : ["- none"]));
  L.push("", "## Recommended next experiments", "", ...r.recommendations.map((x) => `- ${x}`));
  L.push("", "## Method and limitations", "", ...r.limitations.map((x) => `- ${x}`), "");
  return L.join("\n");
}
