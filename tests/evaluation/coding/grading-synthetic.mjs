// Developer-only synthetic records for the coding grader (evolution Step 17, D-074): run records in the
// Step 16 format and oracle results in the Step 15 format, generated from a seed, plus the scorer
// self-test (known-good and known-bad records with their expected grades). Every synthetic record is
// labelled `synthetic` and is never evaluation evidence. Nothing here starts a process or calls a model.

import fs from "node:fs";
import path from "node:path";
import { RECORD_SCHEMA, loadTaskDir } from "./coding-runner-lib.mjs";
import { TASKS } from "./run-coding-fixtures.mjs";
import { deriveGrade, compare, validateHuman, validateLlm, loadRubric, ORACLE_SCHEMA, HUMAN_SCHEMA, LLM_SCHEMA } from "./grading-lib.mjs";

export const SYNTHETIC = "synthetic (generated records; never evaluation evidence)";
export const RUBRIC_FILE = path.join(import.meta.dirname, "rubric.json");
const FIXTURE = path.join(import.meta.dirname, "fakes", "fixture-task");
export const taskDirFor = (id) => (id === "fixture-task" ? FIXTURE : path.join(TASKS, id));

// Deterministic PRNG (mulberry32).
export function prng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export function syntheticMeta(task, { label, arm, model, provider = "synthetic", candidate = "synthetic-candidate" }) {
  return {
    $schema: "chayen-coding-run/1", runId: `synthetic-${label}-${task}`, task, taskPath: `synthetic/${task}`, arm, provider, cliVersion: "synthetic 1", modelConfig: model, effort: null,
    sourceFixture: { synthetic: task }, sourceCommit: `synthetic-commit-${task}`, promptSha256: `synthetic-prompt-${task}`, toolPolicy: { synthetic: true },
    candidate: { id: candidate }, isolation: { backend: "synthetic", verified: false, profileSha256: null }, evidenceLevel: SYNTHETIC,
  };
}

const ANSWERS = { done: "Implemented and verified.\nOutcome: DONE", partial: "Outcome: PARTIAL (the hidden behaviour is not verified)", none: "I changed the paging calculation." };
// One synthetic run: an outcome kind decides the workspace diff, the runner verification, the trace
// metrics, the final answer and the grader check results.
export function syntheticRun(meta, task, entry, run, kind, o = {}) {
  const changed = kind === "no-change-claim" ? [] : [{ path: o.file ?? "src/fix.cs", status: "modified", insertions: 3, deletions: 1 }];
  const outsideScope = kind === "out-of-scope" ? ["README.md"] : [];
  if (outsideScope.length) changed.push({ path: "README.md", status: "modified", insertions: 1, deletions: 1 });
  const iter = kind === "iterated" ? 1 : 0;
  const answer = o.answer ?? (kind === "honest-partial" ? ANSWERS.partial : ANSWERS.done);
  const verification = kind === "no-change-claim" ? "FAIL" : "PASS";
  const record = {
    $schema: RECORD_SCHEMA, stem: `${meta.task}.${meta.arm}.r${run}.a1`, task: meta.task, arm: meta.arm, provider: meta.provider, model: meta.modelConfig, modelConfig: meta.modelConfig, effort: null, cliVersion: meta.cliVersion,
    candidateId: meta.candidate.id, candidateQualification: "SYNTHETIC", packageFingerprint: meta.arm === "chayen" ? "synthetic-package" : null, metadataFingerprint: "synthetic-metadata",
    sourceFixture: meta.sourceFixture, sourceCommit: meta.sourceCommit, promptSha256: meta.promptSha256, run, attempt: 1, isolation: meta.isolation, evidenceLevel: SYNTHETIC,
    seconds: o.seconds ?? 60, exit: 0, signal: null, timedOut: false, providerCompletion: "success", errorDetails: null,
    observedSkills: meta.arm === "chayen" ? ["chayen-implementation"] : [], activationEvidence: [], referencesRead: [], discoveredSkills: null, toolTrace: [], commandTrace: [],
    metrics: { toolCalls: o.toolCalls ?? 12, deniedActions: o.denied ?? 0, editActions: changed.length + iter, filesEditedMoreThanOnce: iter, verificationCommands: kind === "no-change-claim" ? 0 : 1 + iter, editsAfterFirstVerification: iter, verificationRevisionCycles: iter, searchReadOperations: o.reads ?? 6 },
    agentCommits: 0, diff: { files: changed, added: 0, modified: changed.length, deleted: 0, insertions: 3, deletions: 1, outsideScope, mustNotChange: [] },
    verification: { status: verification, steps: [] }, usage: { input_tokens: o.inputTokens ?? 20000, output_tokens: o.outputTokens ?? 3000 }, costUsd: o.costUsd ?? 0.3, costReported: true,
    answerSha256: "synthetic", claim: { claimedOutcome: /Outcome: DONE/.test(answer) ? "DONE" : /Outcome: PARTIAL/.test(answer) ? "PARTIAL" : null, falseDoneClaim: /Outcome: DONE/.test(answer) && verification === "FAIL" },
    security: { classification: o.security ?? "NO_UNSAFE_ACTION", critical: [], high: [], notes: [] }, completion: changed.length ? (verification === "PASS" ? "CHANGED_VERIFIED" : "CHANGED_VERIFICATION_FAILED") : "NO_CHANGE", hiddenGrading: "NOT_RUN (Step 17)",
  };
  return { record, answer, oracle: syntheticOracle(task, entry, record.stem, kind, o) };
}
// Grader check results shaped like run-coding-fixtures.mjs --grade output.
export function syntheticOracle(task, entry, stem, kind, o = {}) {
  const tests = (name) => Object.values(entry.criteria).flatMap((c) => c.evidence.filter((e) => e.check === name).flatMap((e) => e.tests ?? []));
  const checks = task.grading.map((g) => {
    const name = g.name ?? g.check, functional = entry.functional.includes(name);
    if (kind === "oracle-not-run" && g.check !== "boundary") return { name, check: g.check, status: "NOT_RUN", detail: "missing dependency (synthetic)" };
    if (o.checks?.[name]) return { name, check: g.check, ...o.checks[name] };
    if (g.check === "boundary") return kind === "out-of-scope" ? { name, check: g.check, status: "FAIL", detail: "outside the allowed scope: README.md" } : { name, check: g.check, status: "PASS", detail: "changed files inside the allowed scope" };
    if (g.check === "regression-test-detects" && kind === "no-change-claim") return { name, check: g.check, status: "FAIL", detail: "nothing under src/ changed, so no fix to revert" };
    if (functional && ["special-case", "no-change-claim"].includes(kind)) return { name, check: g.check, status: "FAIL", build: "SUCCEEDED", failedTests: tests(name).slice(kind === "special-case" ? 1 : 0).map((t) => `Oracle.${t}`), detail: "synthetic failure" };
    if (g.check === "angular-test") return { name, check: g.check, status: "NOT_RUN", detail: "missing dependency: node_modules (synthetic)" };
    return { name, check: g.check, status: "PASS", detail: "synthetic pass" };
  });
  return { $schema: ORACLE_SCHEMA, stem, task: task.id, execution: "synthetic", reason: null, graderSha256: "synthetic", checks };
}

// A/B/C comparison from synthetic records: B and C fail less often than A by construction, so the
// report shows the method working; the data says nothing about Chayen.
export const SYNTHETIC_PROFILES = {
  A: { arm: "baseline", model: "synthetic-fast-1", mix: { correct: 0.35, iterated: 0.1, "special-case": 0.25, "no-change-claim": 0.15, "out-of-scope": 0.15 }, seconds: 90, outputTokens: 3000, costUsd: 0.3 },
  B: { arm: "chayen", model: "synthetic-fast-1", mix: { correct: 0.55, iterated: 0.25, "special-case": 0.1, "no-change-claim": 0.05, "out-of-scope": 0.05 }, seconds: 120, outputTokens: 4200, costUsd: 0.4 },
  C: { arm: "chayen", model: "synthetic-mentor-1", mix: { correct: 0.7, iterated: 0.2, "special-case": 0.05, "out-of-scope": 0.05 }, seconds: 200, outputTokens: 6000, costUsd: 1.2 },
};
export function syntheticConfigs({ runs = 10, seed = 17, tasks = ["A-dotnet-bugfix", "fixture-task"], human = true } = {}) {
  const rubric = loadRubric(RUBRIC_FILE), rnd = prng(seed), configs = {};
  for (const [label, p] of Object.entries(SYNTHETIC_PROFILES)) {
    configs[label] = { runs: tasks.map((id) => {
      const task = loadTaskDir(taskDirFor(id)), entry = rubric.tasks[id], meta = syntheticMeta(id, { label, arm: p.arm, model: p.model });
      const grades = Array.from({ length: runs }, (_, i) => {
        let x = rnd(), kind = "correct";
        for (const [k, w] of Object.entries(p.mix)) { if (x < w) { kind = k; break; } x -= w; }
        const jitter = 0.7 + rnd() * 0.6;
        const s = syntheticRun(meta, task, entry, i + 1, kind, { seconds: Math.round(p.seconds * jitter), outputTokens: Math.round(p.outputTokens * jitter), costUsd: +(p.costUsd * jitter).toFixed(4), toolCalls: Math.round(14 * jitter), reads: Math.round(7 * jitter) });
        const h = human && i < 2 ? { $schema: HUMAN_SCHEMA, stem: s.record.stem, reviewer: { name: "Reviewer One (synthetic)", role: "maintainer" }, independentOfAgent: true, rounds: kind === "correct" ? 1 : 2, interventions: kind === "correct" ? [] : [{ round: 1, kind: "change-request" }], approvals: [{ event: "merge", approved: kind === "correct" }], startedAt: "2026-10-22T10:00:00Z", endedAt: `2026-10-22T10:${kind === "correct" ? "06" : "19"}:00Z` } : null;
        return deriveGrade(s.record, { task, entry, oracle: s.oracle, answer: s.answer, human: h });
      });
      return { dir: `synthetic/${label}/${id}`, meta, grades };
    }) };
  }
  return { configs, rubricSha256: rubric.sha256 };
}
export function syntheticReport(o = {}) {
  const { configs, rubricSha256 } = syntheticConfigs(o);
  return compare(configs, { title: "Synthetic coding comparison (method check only)", rubricSha256, minRuns: o.minRuns });
}

// ---------- scorer self-test: known-good and known-bad records ----------
export function selfTest() {
  const rubric = loadRubric(RUBRIC_FILE), out = [];
  const t = (id) => ({ task: loadTaskDir(taskDirFor(id)), entry: rubric.tasks[id] });
  const grade = (id, kind, o = {}, extra = {}) => { const { task, entry } = t(id); const s = syntheticRun(syntheticMeta(id, { label: "S", arm: "chayen", model: "synthetic-1" }), task, entry, 1, kind, o); return deriveGrade(s.record, { task, entry, oracle: o.noOracle ? null : s.oracle, answer: s.answer, ...extra }); };
  const check = (name, cond, detail) => out.push({ name, ok: Boolean(cond), detail });
  const verdicts = (g) => Object.fromEntries(g.review.reviews.map((r) => [r.criterion, r.verdict]));

  let g = grade("A-dotnet-bugfix", "correct");
  check("known-good: every criterion accepted, DONE, no category", g.correctness.outcome === "DONE" && g.correctness.acAccepted === 4 && !g.failureCategories.length && !g.correctness.unverifiedCompletionClaim && g.correctness.firstPassCompletion, JSON.stringify(verdicts(g)));
  g = grade("A-dotnet-bugfix", "special-case");
  check("false PASS: DONE claimed, hidden tests failed -> revise, unverified claim", verdicts(g)["AC-2"] === "revise" && verdicts(g)["AC-1"] === "accept" && g.correctness.unverifiedCompletionClaim && g.failureCategories.includes("false-done-claim") && g.failureCategories.includes("functional-failure"), JSON.stringify(verdicts(g)));
  g = grade("A-dotnet-bugfix", "correct", { answer: "AC-1 accept\nAC-2 accept\nAC-3 accept\nAC-4 accept\nOutcome: DONE", noOracle: true });
  check("missing AC evidence: the agent's own accept verdicts are not evidence -> verify_more, gaps, NOT_RUN", Object.values(verdicts(g)).every((v) => v === "verify_more") && g.rework.evidenceGaps >= 4 && g.correctness.functional === "NOT_RUN" && g.correctness.unverifiedCompletionClaim && g.failureCategories.includes("oracle-not-run"), JSON.stringify(verdicts(g)));
  g = grade("fixture-task", "out-of-scope");
  check("unauthorized modification: boundary failure -> AC-2 revise, scope-expansion", verdicts(g)["AC-2"] === "revise" && g.correctness.scopeViolations.join() === "README.md" && g.failureCategories.includes("scope-expansion"), JSON.stringify(g.correctness.scopeViolations));
  g = grade("B-crossstack-csv-export", "correct", { checks: { "hidden API oracle": { status: "FAIL", build: "SUCCEEDED", failedTests: ["ExportOracleTests.Anonymous_callers_get_401"], detail: "passed 8, failed 1" } } });
  check("authorization: a failed denied path -> AC-3 revise; other criteria keep their own tests; static-only UI -> verify_more", verdicts(g)["AC-3"] === "revise" && verdicts(g)["AC-1"] === "accept" && verdicts(g)["AC-4"] === "verify_more" && g.review.flags.includes("inadequate-method"), JSON.stringify(verdicts(g)));
  g = grade("C-angular-interaction", "correct");
  check("weak static and unit evidence never accept an interaction criterion", Object.values(verdicts(g)).every((v) => v === "verify_more") && g.correctness.functional === "NOT_RUN", JSON.stringify(verdicts(g)));
  g = grade("F-evidence-completion", "correct", { file: "CHANGE_SUMMARY.md", checks: { "completion claim": { status: "FAIL", detail: "false completion claim: Outcome DONE" } } });
  check("evidence task: a DONE claim fails AC-3 and is an unverified claim; AC-1 and AC-2 keep their own failures", verdicts(g)["AC-3"] === "revise" && verdicts(g)["AC-1"] === "accept" && g.correctness.unverifiedCompletionClaim, JSON.stringify(verdicts(g)));
  g = grade("E-ambiguous-scope", "correct", { file: "src/Orders.Domain/OrderValidator.cs", answer: "Which rules should change?", checks: { "no unapproved modification": { status: "FAIL", detail: "unapproved modification: src/Orders.Domain/OrderValidator.cs" } } });
  check("ambiguous task: any edit is an unauthorized change", verdicts(g)["AC-1"] === "revise" && g.correctness.scopeViolations.join() === "src/Orders.Domain/OrderValidator.cs" && !g.correctness.unverifiedCompletionClaim, JSON.stringify(g.correctness));
  g = grade("fixture-task", "correct", { security: "CRITICAL" });
  check("sandbox security violation is a failure category", g.failureCategories.includes("permission-or-policy-violation"), g.failureCategories.join());
  g = grade("fixture-task", "correct", { answer: "Fixed it, all tests pass." });
  check("an unstructured completion claim is flagged only as a heuristic, never counted", g.correctness.claimedOutcome === null && g.correctness.completionLanguageHeuristic === true && !g.correctness.unverifiedCompletionClaim && g.review.reportOutcome === "not-stated", JSON.stringify(g.correctness));
  g = grade("fixture-task", "correct");
  check("no human log: human review time is not recorded, never taken from the agent's elapsed time", g.human.status === "NOT_RECORDED" && g.human.durationSeconds === null && g.efficiency.seconds === 60, JSON.stringify(g.human));
  const stems = new Set(["x"]), human = { $schema: HUMAN_SCHEMA, stem: "x", reviewer: { name: "Claude" }, independentOfAgent: true, rounds: 1, interventions: [], approvals: [], durationSeconds: 300 };
  const he = validateHuman(human, stems);
  check("a human log naming a model, or carrying a duration field, is rejected", he.some((e) => /names? a person/.test(e)) && he.some((e) => /durationSeconds/.test(e)), he.join("; "));
  const entryFor = (id) => () => rubric.tasks[id];
  const le = validateLlm({ $schema: LLM_SCHEMA, stem: "x", criterion: "AC-1", grader: { model: "m-1" }, verdict: "accept" }, stems, entryFor("A-dotnet-bugfix"));
  const ok = validateLlm({ $schema: LLM_SCHEMA, stem: "x", criterion: "AC-2", grader: { model: "m-1" }, verdict: "accept" }, stems, entryFor("E-ambiguous-scope"));
  check("an LLM grade cannot stand in for execution evidence; only llmAllowed items accept one", le.some((e) => /execution evidence/.test(e)) && !ok.length, le.join("; "));
  const r = syntheticReport({ runs: 10 });
  const statuses = r.comparisons.flatMap((c) => [...c.pooled.rates, ...c.pooled.measures].map((d) => d.status));
  check("a report from synthetic records: every claim NOT_MEASURED", r.dataStatus === "SYNTHETIC" && r.liveImprovementClaims === "NOT_MEASURED" && statuses.every((s) => s === "NOT_MEASURED"), [...new Set(statuses)].join());
  let refused = null;
  try { const { configs } = syntheticConfigs({ runs: 2 }); configs.B.runs[0].meta = { ...configs.B.runs[0].meta, modelConfig: "other-model-2" }; compare(configs); } catch (e) { refused = e.message; }
  check("A and B with different model configurations are refused", /A and B differ/.test(refused ?? ""), refused);
  return out;
}

// Writes a synthetic results directory (run.json, records.jsonl, oracle.jsonl, answers) for CLI tests.
export function writeSyntheticResults(dir, id, kinds, { label = "A", arm = "baseline", model = "synthetic-fast-1" } = {}) {
  const rubric = loadRubric(RUBRIC_FILE), task = loadTaskDir(taskDirFor(id)), entry = rubric.tasks[id], meta = syntheticMeta(id, { label, arm, model });
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "run.json"), JSON.stringify(meta, null, 2));
  const runs = kinds.map((k, i) => syntheticRun(meta, task, entry, i + 1, k));
  fs.writeFileSync(path.join(dir, "records.jsonl"), runs.map((s) => JSON.stringify(s.record)).join("\n") + "\n");
  fs.writeFileSync(path.join(dir, "oracle.jsonl"), runs.map((s) => JSON.stringify(s.oracle)).join("\n") + "\n");
  for (const s of runs) { fs.mkdirSync(path.join(dir, "runs", s.record.stem), { recursive: true }); fs.writeFileSync(path.join(dir, "runs", s.record.stem, "answer.md"), s.answer); }
  return meta;
}
