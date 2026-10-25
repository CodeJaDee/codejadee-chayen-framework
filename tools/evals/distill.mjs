#!/usr/bin/env node
// Developer-only mentor-to-fast-agent knowledge distillation (evolution Step 12, D-069). Checks the
// distillation proposals in tests/distillation/proposals/ through six stages: collect (a valid Step 11
// failure case), diagnose, distill (the smallest action allowed for the root cause), review (computed
// routing impact, size and tests; human review recorded), validate (the repository's fixed offline
// validators on a disposable copy with the proposed diff applied) and promote (only after human
// approval and a live baseline-versus-candidate comparison). The decision is derived, never asserted.
// It never calls a model and never runs a command taken from a proposal, diff or transcript: diffs may
// touch only existing .md/.json files, are applied in memory, and only the repository's own validators
// are started, after checking they are byte-identical to the reviewed copies. Never shipped.
//
// Usage:
//   node tools/evals/distill.mjs [--json] [--root <repo>]   check every proposal, validate offline
//   node tools/evals/distill.mjs --proposal DP-0001         check one proposal and print its stages

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { inside } from "../validate/safe-paths.mjs";
import { validateAll as validateFailures, replayTranscript, readTranscript } from "./failure-cases.mjs";
import { metadataFingerprint } from "../../tests/evaluation/phase5/phase5-lib.mjs";

export const SCHEMA = "chayen-distillation-proposal/1";
export const DIR = "tests/distillation/proposals";
const SKILLS = "plugins/codejadee-chayen-framework/skills";
export const ROOT_CAUSES = ["skill-routing", "missing-project-knowledge", "incomplete-recipe", "conflicting-instructions", "poor-task-specification", "insufficient-verification", "tool-or-model-limitation", "external-environment-failure"];
const ref = (s) => new RegExp(`^${SKILLS}/chayen-[a-z0-9-]+/${s}$`);
export const ACTIONS = {
  "modify-existing-recipe": { behavioural: true, target: (p) => ref("references/[\\w.-]+\\.md").test(p) },
  "clarify-entry-skill": { behavioural: true, target: (p) => ref("SKILL\\.md").test(p) },
  "update-project-knowledge-template": { behavioural: true, target: (p) => p.startsWith(`${SKILLS}/chayen-init/references/`) && p.endsWith(".md") },
  "document-verified-command": { behavioural: true, target: (p) => ref("(?:SKILL|references/[\\w.-]+)\\.md").test(p) },
  "add-regression-fixture": { behavioural: false, target: (p) => /^tests\/(?:skills|failures)\/[\w./-]+\.(?:json|jsonl|md)$/.test(p) },
  "record-unresolved-limitation": { behavioural: false, target: (p) => p === "docs/chayen/KNOWN_LIMITATIONS.md" },
};
// The smallest actions that can address each root cause. A new Entry Skill is never an action.
export const ALLOWED = {
  "skill-routing": ["clarify-entry-skill", "add-regression-fixture", "record-unresolved-limitation"],
  "missing-project-knowledge": ["update-project-knowledge-template", "add-regression-fixture", "record-unresolved-limitation"],
  "incomplete-recipe": ["modify-existing-recipe", "document-verified-command", "add-regression-fixture"],
  "conflicting-instructions": ["modify-existing-recipe", "clarify-entry-skill", "add-regression-fixture"],
  "poor-task-specification": ["add-regression-fixture", "record-unresolved-limitation"],
  "insufficient-verification": ["modify-existing-recipe", "document-verified-command", "add-regression-fixture"],
  "tool-or-model-limitation": ["add-regression-fixture", "record-unresolved-limitation"],
  "external-environment-failure": ["add-regression-fixture", "record-unresolved-limitation"],
};
export const DECISIONS = ["PENDING_REVIEW", "RETURNED_FOR_REVISION", "REJECTED", "AWAITING_EVIDENCE", "READY_TO_PROMOTE", "PROMOTED"];
export const MIN_RUNS = 3;
export const MAX_CHANGED_LINES = 20;
// Fixed offline validators run on the candidate copy. Nothing from a proposal is ever added here.
export const OFFLINE = [
  ["package, skills and references (V-01..V-26)", "tools/validate/validate-package.mjs", []],
  ["guidance invariants (GI-01..GI-10)", "tools/validate/check-guidance.mjs", []],
  ["offline security profile (V-25)", "tools/validate/check-security.mjs", []],
  ["catalog integrity (V-11)", "tools/catalog/check-catalog.mjs", []],
  ["trigger eval cases in sync (G-11)", "tools/evals/generate-claude-evals.mjs", ["--check"]],
  ["documentation links and identifiers (G-14)", "tools/validate/check-docs.mjs", []],
  ["failure cases and offline replay (G-20)", "tools/evals/failure-cases.mjs", []],
];
const KEYS = ["$schema", "id", "title", "demonstration", "failureCase", "mentor", "baseRevision", "diagnosis", "action", "review", "validation", "decision", "promotion"];

const isText = (v) => typeof v === "string" && v.trim().length > 0;
const hex = (v, min, max) => typeof v === "string" && new RegExp(`^[0-9a-f]{${min},${max}}$`).test(v);
const lf = (t) => String(t).replace(/\r\n/g, "\n");
export const sha256 = (t) => crypto.createHash("sha256").update(lf(t)).digest("hex");
const readRel = (root, rel) => lf(fs.readFileSync(inside(root, rel), "utf8"));

// Minimal unified diff: "--- a/<path>", "+++ b/<path>", "@@ -l,n +l,n @@" hunks. No new or deleted files.
export function parseDiff(text) {
  const files = [], lines = lf(text).split("\n");
  let file = null, hunk = null;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.startsWith("--- ")) {
      const next = lines[++i] ?? "";
      const a = /^--- (?:a\/)?(\S+)/.exec(l)?.[1], b = /^\+\+\+ (?:b\/)?(\S+)/.exec(next)?.[1];
      if (!a || !b || a === "/dev/null" || b === "/dev/null" || a !== b) throw new Error("diff must modify existing files only, with matching --- and +++ paths");
      file = { path: b, hunks: [] }; files.push(file); hunk = null; continue;
    }
    const h = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/.exec(l);
    if (h) { if (!file) throw new Error("hunk before file header"); hunk = { oldStart: +h[1], oldLines: h[2] === undefined ? 1 : +h[2], newStart: +h[3], newLines: h[4] === undefined ? 1 : +h[4], lines: [] }; file.hunks.push(hunk); continue; }
    if (hunk && /^[ +-]/.test(l)) hunk.lines.push({ op: l[0], text: l.slice(1) });
    else if (hunk && l.startsWith("\\")) continue;
    else if (l.trim() && !/^(?:diff |index |similarity |rename )/.test(l)) throw new Error("unexpected line in diff");
  }
  for (const f of files) for (const k of f.hunks) {
    const o = k.lines.filter((x) => x.op !== "+").length, n = k.lines.filter((x) => x.op !== "-").length;
    if (o !== k.oldLines || n !== k.newLines) throw new Error(`hunk line counts do not match in ${f.path}`);
  }
  if (!files.length) throw new Error("diff has no files");
  return files;
}
// Exact application at the stated positions; reverse=true undoes a diff (used to recover the
// previous version of promoted guidance).
export function applyDiff(content, file, reverse = false) {
  const src = lf(content).split("\n"), out = [];
  const drop = reverse ? "+" : "-", add = reverse ? "-" : "+";
  let pos = 0;
  for (const h of file.hunks) {
    const want = h.lines.filter((x) => x.op !== add).map((x) => x.text);
    const start = reverse ? h.newStart : h.oldStart;
    const at = want.length ? start - 1 : start; // a pure insertion hunk names the line it follows
    if (at < pos || src.slice(at, at + want.length).join("\n") !== want.join("\n")) throw new Error(`diff does not apply to ${file.path}`);
    out.push(...src.slice(pos, at), ...h.lines.filter((x) => x.op !== drop).map((x) => x.text));
    pos = at + want.length;
  }
  return [...out, ...src.slice(pos)].join("\n");
}

// Routing impact from the change itself: a changed description alters discovery metadata; a change
// inside "When to use" or "When not to use" alters the trigger sections. Anything else is "none".
export function routingImpact(before, after, file) {
  if (!file.endsWith("/SKILL.md")) return "none";
  const desc = (t) => /^description:\s*(.*)$/m.exec(t)?.[1] ?? "";
  if (desc(before) !== desc(after)) return "metadata";
  const sections = (t) => { const m = /\n## When to use\n[\s\S]*?(?=\n## (?!When not to use)[^\n]+\n)/.exec(t); return m?.[0] ?? ""; };
  return sections(before) === sections(after) ? "none" : "trigger-sections";
}

function lineRef(root, r) {
  const m = /^([\w./@-]+?)(?::(\d+)(?:-(\d+))?)?$/.exec(r ?? "");
  if (!m) return false;
  try {
    const text = readRel(root, m[1]);
    const n = text.split("\n").length;
    return !m[2] || (+m[2] >= 1 && +(m[3] ?? m[2]) <= n && +m[2] <= +(m[3] ?? m[2]));
  } catch { return false; }
}

// Applies the candidate on a disposable copy and runs the fixed validators there.
export function offlineValidation(root, candidate) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "chayen-distill-"));
  try {
    const skip = new Set([".git", "node_modules", "bin", "obj"]);
    fs.cpSync(root, tmp, { recursive: true, filter: (s) => !skip.has(path.basename(s)) });
    for (const [rel, text] of Object.entries(candidate)) fs.writeFileSync(inside(tmp, rel), text);
    const results = [];
    for (const [label, script, args] of OFFLINE) {
      if (sha256(fs.readFileSync(inside(tmp, script), "utf8")) !== sha256(fs.readFileSync(inside(root, script), "utf8"))) { results.push({ label, pass: false, detail: "validator copy differs from the reviewed script" }); continue; }
      const r = spawnSync(process.execPath, [inside(tmp, script), ...args], { cwd: tmp, encoding: "utf8", timeout: 300_000, shell: false });
      const last = `${r.stdout ?? ""}${r.stderr ?? ""}`.trim().split("\n").filter((l) => !/^\s*$/.test(l));
      results.push({ label, pass: r.status === 0, detail: (r.status === 0 ? last.at(-1) : last.filter((l) => /ERROR|FAIL|error/.test(l)).slice(0, 3).join(" | ") || last.at(-1) || "no output").slice(0, 300) });
    }
    return { results, routingFingerprint: { before: metadataFingerprint(inside(root, "plugins/codejadee-chayen-framework")), after: metadataFingerprint(inside(tmp, "plugins/codejadee-chayen-framework")) } };
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}

export function checkProposal(root, p, file, failures, { offline = true } = {}) {
  const errors = [], returns = [], err = (m) => errors.push(m), ret = (m) => returns.push(m);
  const stages = {};
  if (!p || typeof p !== "object" || Array.isArray(p)) return { errors: ["proposal is not a JSON object"], returns, stages, decision: null };
  for (const k of Object.keys(p)) if (!KEYS.includes(k)) err(`unknown field ${JSON.stringify(k)}; the proposal format is closed`);
  for (const k of KEYS) if (!(k in p)) err(`missing field ${k}`);
  if (p.$schema !== SCHEMA) err(`$schema must be ${SCHEMA}`);
  if (!/^DP-\d{4}$/.test(p.id ?? "") || !path.basename(file).startsWith(`${p.id}-`)) err("id must be DP-NNNN and the file name must start with it");
  if (!isText(p.title) || typeof p.demonstration !== "boolean") err("title and demonstration (boolean) are required");
  if (!(p.mentor?.kind === "agent" || p.mentor?.kind === "human") || !isText(p.mentor?.identity)) err("mentor needs kind (agent or human) and identity");
  if (!hex(p.baseRevision, 7, 40)) err("baseRevision must be the git revision the proposal was written against");

  // 1. Collect: a valid Step 11 failure case whose recorded reproduction replays as expected.
  const fc = failures.cases.find((c) => c.id === p.failureCase);
  const fcErrors = failures.errors.filter((e) => fc && e.startsWith(`${fc.file}:`));
  if (!fc) err(`collect: failure case ${JSON.stringify(p.failureCase)} does not exist`);
  else if (!fc.valid || fcErrors.length) err(`collect: failure case ${fc.id} is not valid; fix the record first`);
  const record = fc ? JSON.parse(fs.readFileSync(inside(root, fc.file), "utf8")) : null;
  const liveReproduced = (fc?.runs ?? []).some((r) => r.outcome === "REPRODUCED");
  if (fc) stages.collect = { failureCase: fc.id, category: fc.category, origin: fc.origin, reproduction: fc.replays.every((r) => r.outcome === r.expected) ? "VERIFIED_OFFLINE" : "NOT_VERIFIED", modelBehaviour: fc.modelBehaviour };

  // 2. Diagnose.
  const d = p.diagnosis ?? {};
  if (!ROOT_CAUSES.includes(d.rootCause)) err(`diagnosis.rootCause must be one of ${ROOT_CAUSES.join(", ")}`);
  if (!["suspected", "confirmed"].includes(d.confidence)) err("diagnosis.confidence must be suspected or confirmed");
  if (d.confidence === "confirmed" && !liveReproduced) err("diagnosis.confidence confirmed needs a live replay that reproduced the failure; offline replay of a recorded transcript is not enough");
  if (!Array.isArray(d.evidence) || !d.evidence.length) err("diagnosis.evidence must cite at least one file or path:line");
  for (const r of d.evidence ?? []) if (!lineRef(root, r)) err(`diagnosis evidence ${JSON.stringify(r)} does not resolve`);
  if (!Array.isArray(d.existingGuidance)) err("diagnosis.existingGuidance must list what the current guidance already says (may be empty)");
  for (const g of d.existingGuidance ?? []) {
    if (!lineRef(root, g.ref) || !["fully", "partly", "no"].includes(g.covers) || !isText(g.note)) err(`existingGuidance entry ${JSON.stringify(g.ref)} needs a resolving ref, covers (fully, partly, no) and a note`);
  }
  if (!Array.isArray(d.rejectedCauses) || !d.rejectedCauses.length) err("diagnosis.rejectedCauses must record at least one alternative cause and why it was rejected");
  for (const c of d.rejectedCauses ?? []) if (!ROOT_CAUSES.includes(c.cause) || c.cause === d.rootCause || !isText(c.why)) err("each rejected cause needs a different root cause and a reason");
  if (!isText(d.rationale)) err("diagnosis.rationale is required");
  stages.diagnose = { rootCause: d.rootCause, confidence: d.confidence };

  // 3. Distill: the action must be one that addresses the root cause, on existing allowed targets.
  const a = p.action ?? {}, spec = ACTIONS[a.kind];
  if (!spec) err(`action.kind must be one of ${Object.keys(ACTIONS).join(", ")}`);
  else if (ROOT_CAUSES.includes(d.rootCause) && !ALLOWED[d.rootCause].includes(a.kind)) ret(`distill: ${a.kind} does not address root cause ${d.rootCause}; allowed: ${ALLOWED[d.rootCause].join(", ")}`);
  if (!isText(a.summary)) err("action.summary is required");
  const targets = Array.isArray(a.targets) ? a.targets : [];
  if (!targets.length) err("action.targets must list the files the diff changes");
  for (const t of targets) {
    if (!spec || typeof t?.path !== "string" || !hex(t.baseSha256, 64, 64)) { err("each target needs path and baseSha256"); continue; }
    if (!spec.target(t.path)) ret(`distill: ${t.path} is not a valid target for ${a.kind}`);
    try { if (!fs.statSync(inside(root, t.path)).isFile()) throw new Error(); } catch { err(`target ${t.path} does not exist; proposals change existing files only (no new Entry Skill or file)`); }
  }
  const diffRel = `${DIR}/${p.id}.diff`;
  let files = [];
  if (a.diff !== diffRel) err(`action.diff must be ${diffRel}`);
  else {
    try { files = parseDiff(readRel(root, diffRel)); } catch (e) { err(`action.diff: ${e.message}`); }
    const declared = targets.map((t) => t.path).sort().join("|"), changed = files.map((f) => f.path).sort().join("|");
    if (files.length && declared !== changed) err(`the diff changes ${changed || "nothing"} but the targets are ${declared}`);
  }
  const changedLines = files.reduce((n, f) => n + f.hunks.reduce((m, h) => m + h.lines.filter((x) => x.op !== " ").length, 0), 0);
  stages.distill = { action: a.kind, behavioural: spec?.behavioural ?? null, targets: targets.map((t) => t.path), changedLines };

  // 4. Review: computed routing impact, size and tests; recorded human review.
  const r = p.review ?? {}, hr = r.humanReview ?? {};
  if (!isText(r.before) || !isText(r.after)) err("review needs before and after behaviour");
  if (!Array.isArray(r.risks) || !r.risks.length || !r.risks.every(isText)) err("review.risks must list at least one risk, including routing collisions");
  if (!["none", "trigger-sections", "metadata"].includes(r.routingImpact)) err("review.routingImpact must be none, trigger-sections or metadata");
  const tests = Array.isArray(r.testsNeeded) ? r.testsNeeded : [];
  if (!tests.includes(p.failureCase)) err("review.testsNeeded must include the failure case replay");
  for (const t of tests) {
    if (/^FC-\d{4}$/.test(t)) { if (!failures.cases.some((c) => c.id === t)) err(`test ${t} does not exist`); continue; }
    const m = /^tests\/skills\/([a-z-]+\.json)#(.+)$/.exec(t);
    let ok = false;
    try { ok = !!m && JSON.parse(readRel(root, `tests/skills/${m[1]}`)).cases.some((c) => c.id === m[2]); } catch { ok = false; }
    if (!ok) err(`test ${JSON.stringify(t)} must be FC-NNNN or tests/skills/<cases file>#<existing id>`);
  }
  for (const regression of record?.regressionTests ?? []) if (!tests.includes(regression)) err(`review.testsNeeded must include the failure case's regression reference ${regression}`);
  if (!["pending", "approved", "changes-requested", "rejected"].includes(hr.status)) err("review.humanReview.status must be pending, approved, changes-requested or rejected");
  if (hr.status !== "pending" && hr.status && !(isText(hr.reviewer) && /^\d{4}-\d{2}-\d{2}$/.test(hr.date ?? ""))) err("a completed human review needs reviewer and date");
  if (hr.status !== "pending" && hr.reviewer && hr.reviewer === p.mentor?.identity) err("the mentor cannot review its own proposal");
  if (hr.status === "pending" && (hr.reviewer || hr.date)) err("a pending review has no reviewer or date yet");

  // 5. Validate: stale base, in-memory application, routing, size, existing guidance, offline gates.
  const candidate = {}, promoted = p.promotion !== null && p.promotion !== undefined;
  if (!errors.length) {
    for (const t of targets) {
      const current = readRel(root, t.path), f = files.find((x) => x.path === t.path);
      if (promoted) {
        let previous = null;
        try { previous = applyDiff(current, f, true); } catch { err(`promotion: the promoted change is not present in ${t.path}`); continue; }
        if (sha256(previous) !== t.baseSha256 || sha256(previous) !== p.promotion.previousSha256?.[t.path]) err(`promotion: the previous version of ${t.path} is not recoverable from the diff`);
        if (sha256(current) !== p.promotion.promotedSha256?.[t.path]) err(`promotion: ${t.path} does not match the promoted version`);
        continue;
      }
      if (sha256(current) !== t.baseSha256) { ret(`validate: ${t.path} changed since the proposal was written; rebase the diff`); continue; }
      try { candidate[t.path] = applyDiff(current, f); } catch (e) { ret(`validate: ${e.message}`); }
    }
    const impacts = Object.entries(candidate).map(([rel, text]) => routingImpact(readRel(root, rel), text, rel));
    const computed = impacts.includes("metadata") ? "metadata" : impacts.includes("trigger-sections") ? "trigger-sections" : "none";
    if (!promoted && Object.keys(candidate).length === targets.length && computed !== r.routingImpact) ret(`review: the diff's routing impact is ${computed}, declared ${r.routingImpact}`);
    if (computed !== "none" && !tests.some((t) => t.startsWith("tests/skills/trigger-cases.json#"))) ret("review: a routing change needs trigger cases in testsNeeded");
    if (spec?.behavioural && changedLines > MAX_CHANGED_LINES && !isText(r.sizeJustification)) ret(`distill: ${changedLines} changed lines is not a minimal change; reduce it or justify it in review.sizeJustification`);
    if (spec?.behavioural && (d.existingGuidance ?? []).some((g) => g.covers === "fully") && !liveReproduced) ret("diagnose: existing guidance already covers this failure fully; a behavioural change needs a live replay showing the guidance is not followed");
    stages.review = { routingImpact: { declared: r.routingImpact, computed: promoted ? r.routingImpact : computed }, humanReview: hr.status };
    if (!promoted && offline && !returns.length && Object.keys(candidate).length === targets.length) {
      const v = offlineValidation(root, candidate);
      stages.validate = { offline: v.results, metadataFingerprint: v.routingFingerprint };
      for (const x of v.results) if (!x.pass) ret(`validate: offline ${x.label} failed: ${x.detail}`);
      if ((v.routingFingerprint.before !== v.routingFingerprint.after) !== (computed === "metadata")) ret("validate: the discovery metadata fingerprint change does not match the routing impact");
    }
  }

  // 5b. Live comparison (authorized provider runs only), scored with the failure case detector.
  const cmp = p.validation?.comparison ?? {};
  const arm = (name, rows) => (Array.isArray(rows) ? rows : []).map((run) => {
    const text = readTranscript(root, run.transcript, false, run.provider, (m) => err(`validation.${name}: ${m}`));
    if (!isText(run.authorization) || !/^\d{4}-\d{2}-\d{2}$/.test(run.date ?? "") || !hex(run.revision, 7, 40) || !isText(run.model)) err(`validation.${name}: each run needs authorization, date, revision and model`);
    if (text !== null && run.sha256 !== crypto.createHash("sha256").update(text).digest("hex")) err(`validation.${name}: ${run.transcript} does not match its sha256`);
    return { ...run, outcome: text === null || !record ? "INCONCLUSIVE" : replayTranscript(record.detector, run.provider, text).outcome };
  });
  if (!Array.isArray(cmp.baseline) || !Array.isArray(cmp.candidate)) err("validation.comparison needs baseline and candidate lists (empty until authorized runs exist)");
  const base = arm("baseline", cmp.baseline), cand = arm("candidate", cmp.candidate);
  if (base.some((x) => x.revision !== p.baseRevision)) err("validation.baseline runs must use baseRevision");
  if (cand.some((x) => x.revision === p.baseRevision)) err("validation.candidate runs must use a revision with the change");
  if (new Set([...base, ...cand].map((x) => `${x.provider}|${x.model}`)).size > 1) err("validation: baseline and candidate must use one provider and model; results are never pooled across configurations");
  const count = (rows, o) => rows.filter((x) => x.outcome === o).length;
  stages.compare = { baseline: { runs: base.length, reproduced: count(base, "REPRODUCED") }, candidate: { runs: cand.length, reproduced: count(cand, "REPRODUCED") } };

  // 6. Decide and promote.
  let decision = null;
  if (!errors.length) {
    if (hr.status === "rejected") decision = "REJECTED";
    else if (returns.length || hr.status === "changes-requested") decision = "RETURNED_FOR_REVISION";
    else if (hr.status === "pending") decision = "PENDING_REVIEW";
    else if (!spec.behavioural) decision = a.kind === "record-unresolved-limitation" && !liveReproduced ? "AWAITING_EVIDENCE" : "READY_TO_PROMOTE";
    else if (!base.length && !cand.length) decision = "AWAITING_EVIDENCE";
    else if ([...base, ...cand].some((x) => x.outcome === "INCONCLUSIVE")) { decision = "RETURNED_FOR_REVISION"; ret("compare: an inconclusive run; re-run it or revise the change"); }
    else if (!count(base, "REPRODUCED")) { decision = "RETURNED_FOR_REVISION"; ret("compare: the failure did not reproduce on the baseline, so no improvement can be shown"); }
    else if (cand.length && count(cand, "REPRODUCED") === cand.length) { decision = "REJECTED"; ret("compare: the failure still reproduces with the change; no improvement"); }
    else if (count(cand, "REPRODUCED")) { decision = "RETURNED_FOR_REVISION"; ret("compare: the failure still reproduces in some candidate runs"); }
    else if (base.length < MIN_RUNS || cand.length < MIN_RUNS) decision = "AWAITING_EVIDENCE";
    else decision = "READY_TO_PROMOTE";
    if (promoted) {
      if (decision !== "READY_TO_PROMOTE") err(`promotion recorded but the evidence gives ${decision}; only demonstrated improvements are promoted`);
      else if (!hex(p.promotion.revision, 7, 40) || p.promotion.revision === p.baseRevision) err("promotion.revision must be the revision that contains the change");
      else decision = "PROMOTED";
    }
    if (decision && p.decision !== decision) err(`decision ${p.decision} is not supported by the evidence (derived ${decision})`);
  }
  if (errors.length) decision = null; // a record with errors has no decision
  stages.decide = { decision, reasons: returns };
  return { errors, returns, stages, decision };
}

export function checkAll(root, opts = {}) {
  const failures = validateFailures(root), errors = [], proposals = [];
  const dir = inside(root, DIR);
  for (const name of fs.readdirSync(dir).filter((n) => n.endsWith(".json")).sort()) {
    const file = `${DIR}/${name}`;
    let p;
    try { p = JSON.parse(readRel(root, file)); } catch { errors.push(`${file}: not valid JSON`); continue; }
    if (opts.only && p.id !== opts.only) continue;
    const r = checkProposal(root, p, file, failures, opts);
    errors.push(...r.errors.map((e) => `${file}: ${e}`));
    proposals.push({ id: p.id, file, failureCase: p.failureCase, demonstration: p.demonstration, decision: r.decision, reasons: r.returns, stages: r.stages });
  }
  for (const name of fs.readdirSync(dir).filter((n) => n.endsWith(".diff"))) if (!proposals.some((p) => `${p.id}.diff` === name) && !opts.only) errors.push(`${DIR}/${name}: diff without a proposal`);
  if (!proposals.length) errors.push(`${DIR}: no proposals`);
  return { errors, proposals };
}

const argv = process.argv.slice(2);
const arg = (name) => { const i = argv.indexOf(name); return i > -1 ? argv[i + 1] : undefined; };
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  try {
    const root = fs.realpathSync(arg("--root") ?? path.resolve(import.meta.dirname, "../.."));
    const { errors, proposals } = checkAll(root, { only: arg("--proposal") });
    if (argv.includes("--json")) console.log(JSON.stringify({ errors, proposals }, null, 2));
    else {
      for (const p of proposals) {
        const s = p.stages;
        console.log(`${p.id} ${p.failureCase}${p.demonstration ? " (demonstration)" : ""}: ${p.decision ?? "INVALID"}`);
        if (s.collect) console.log(`  collect   ${s.collect.failureCase} ${s.collect.category}, ${s.collect.origin}; reproduction ${s.collect.reproduction}; model behaviour ${s.collect.modelBehaviour}`);
        console.log(`  diagnose  ${s.diagnose?.rootCause} (${s.diagnose?.confidence})`);
        console.log(`  distill   ${s.distill?.action} on ${s.distill?.targets?.join(", ")}; ${s.distill?.changedLines} changed line(s)`);
        if (s.review) console.log(`  review    routing impact declared ${s.review.routingImpact.declared}, computed ${s.review.routingImpact.computed}; human review ${s.review.humanReview}`);
        for (const v of s.validate?.offline ?? []) console.log(`  validate  ${v.pass ? "PASS" : "FAIL"} ${v.label}`);
        if (s.validate) console.log(`  validate  metadata fingerprint ${s.validate.metadataFingerprint.before} -> ${s.validate.metadataFingerprint.after}`);
        console.log(`  compare   baseline ${s.compare?.baseline.reproduced}/${s.compare?.baseline.runs} reproduced, candidate ${s.compare?.candidate.reproduced}/${s.compare?.candidate.runs}${s.compare?.baseline.runs || s.compare?.candidate.runs ? "" : " (live comparison NOT_RUN)"}`);
        for (const reason of p.reasons) console.log(`  reason    ${reason}`);
      }
      for (const e of errors) console.log(`ERROR ${e}`);
      const by = DECISIONS.map((d) => `${d} ${proposals.filter((p) => p.decision === d).length}`).join(", ");
      console.log(`${errors.length ? "FAIL" : "PASS"} distillation proposals: ${proposals.filter((p) => p.decision).length}/${proposals.length} valid; ${by}`);
    }
    process.exitCode = errors.length ? 1 : 0;
  } catch (e) { console.log(`ERROR ${e.message}`); process.exitCode = 2; }
}
