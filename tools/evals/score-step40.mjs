#!/usr/bin/env node
// Developer-only STEP 40 scorer for the multilingual quality, persistent-policy and editorial
// discovery evaluation. Offline and read-only: it never calls a provider or model, never writes a
// file, and reports NOT_RUN for every metric that has no recorded outputs or human reviews.
// Zero dependencies (Node.js >= 20.11, for import.meta.dirname). Never shipped with the plugin.
//
// Usage:
//   node tools/evals/score-step40.mjs --check                 # validate the dataset and probe set
//   node tools/evals/score-step40.mjs --self-test             # run the scorer's synthetic controls
//   node tools/evals/score-step40.mjs [--outputs <arm-outputs.json> ...]
//        [--probes <run-provider-probes summary.json> ...] [--reviews <review.json> ...] [--json]
// Inputs come from tests/evaluation/step40/run-arms.mjs, run-provider-probes.mjs --spec
// tests/evaluation/step40/discovery-probes.json and human reviewers (format in the rubric doc).

import fs from "node:fs";
import path from "node:path";
import { inside } from "../validate/safe-paths.mjs";

const root = path.resolve(import.meta.dirname, "..", "..");
const readJson = (rel) => JSON.parse(fs.readFileSync(inside(root, rel), "utf8"));
const argList = (name) => process.argv.flatMap((a, i) => (process.argv[i - 1] === name ? [a] : []));
const CASES = "tests/evaluation/step40/quality-cases.json";
const PROBES = "tests/evaluation/step40/discovery-probes.json";
const CONTROLS = "tests/evaluation/step40/scorer-controls.json";
const PLUGIN_SKILLS = "plugins/codejadee-chayen-framework/skills";

// Targets from the Step 40 instruction; the language-quality bar is ADR-0011's PROPOSED threshold.
export const TARGETS = { explicit: 1, implicit: 0.85, wrongSkillMax: 0.05, policyAdherence: 0.95, languageBar: 0.9, languageBarScore: 4 };
const GROUP_SIZES = { th: 40, en: 40, mixed: 20, policy: 20 };
const MODES = new Set(["rewrite", "audit", "create", "website", "answer"]);
const LANGS = new Set(["th", "en", "bilingual", "ja", "vi", "any"]);
const STRUCTURE = new Set(["tags", "placeholders", "codeFences", "inlineCode", "links", "jsonKeys", "table"]);
const RUBRIC = new Set(["naturalness", "clarity", "tone", "technicalAccuracy", "semantic", "falsePositive", "unsupportedAdditions", "structure"]);
const SUBJECTIVE = ["naturalness", "clarity", "tone"];
const NO_ACTION = new Set(["write", "push", "commit", "publish", "config-edit"]);
const PROBE_GROUPS = { "explicit-th": 5, "explicit-en": 5, "implicit-th": 10, "implicit-en": 10, "overlap-doc": 6, "engineering": 8, "no-match": 8 };
const STOCK = ["Great question", "Certainly!", "Absolutely!", "I hope this helps", "Let's dive in", "Let me know if you", "As an AI", "แน่นอนครับ!", "แน่นอนค่ะ!", "หวังว่าจะเป็นประโยชน์", "คำถามที่ดีมาก"];
const INSTRUCTION_FILE = /(?:^|[\\/])(?:CLAUDE(?:\.local)?\.md|AGENTS(?:\.override)?\.md|copilot-instructions\.md|[^\\/]+\.instructions\.md)$|[\\/](?:\.claude|\.codex|\.copilot)[\\/]/i;

// ---------- text helpers ----------
const strip = (t) => String(t).replace(/```[\s\S]*?```/g, " ").replace(/`[^`\n]*`/g, " ").replace(/https?:\/\/\S+/g, " ").replace(/<[^>]+>/g, " ").replace(/\{[A-Za-z_][\w.]*\}/g, " ");
// The deliverable is the text before the skills' trailing note labels (output templates), so notes
// that quote removed phrases do not count against the edited text.
const NOTE_LABEL = /^\*\*(?:Changes|Kept on purpose|Needs the owner|Based on|Assumptions|Unverified|Optional|Checks to run after applying):\*\*/m;
export const deliverable = (t) => { const s = String(t), m = NOTE_LABEL.exec(s); return m && m.index > 0 ? s.slice(0, m.index) : s; };
export function detectLanguage(text) {
  let s = strip(text);
  // Output that is only a fenced file (locale JSON, MDX): judge the string content, not the keys.
  if ((s.match(/[฀-๿A-Za-z]/g) ?? []).length < 10) s = strip(String(text).replace(/^```.*$/gm, " ").replace(/"[\w.-]+"\s*:/g, " "));
  const thai = (s.match(/[฀-๿]/g) ?? []).length;
  const latin = (s.match(/[A-Za-z]/g) ?? []).length;
  const kana = (s.match(/[぀-ヿ一-鿿]/g) ?? []).length;
  const viet = (s.match(/[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/gi) ?? []).length;
  if (kana >= 4 && kana >= thai) return "ja";
  if (viet >= 4 && thai < viet) return "vi";
  const letters = thai + latin;
  if (!letters) return "none";
  const ratio = thai / letters;
  if (ratio >= 0.15 && ratio <= 0.85 && thai >= 20 && latin >= 20 && /(?:^|\n)#+ /.test(text)) return "bilingual";
  return ratio >= 0.45 ? "th" : ratio <= 0.25 ? "en" : "mixed";
}
const numberTokens = (t) => [...String(t).replace(/\b(?:TH|EN)-\d{2}\b/g, " ").replace(/^\s*\d+[.)]\s/gm, " ").replace(/\|\s*\d+\s*\|/g, "| |").matchAll(/\d+(?:[.,:]\d+)*/g)].map((m) => m[0].replace(/,(?=\d{3}\b)/g, ""));
// JSX attribute values may contain ">" (arrow functions), so braces and quotes are matched whole.
const tags = (t) => [...String(t).matchAll(/<(?:\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|"[^"]*"|'[^']*'|[^>{"'\n])+>/g)].map((m) => m[0]);
const placeholders = (t) => [...String(t).matchAll(/\{\{\s*[A-Za-z_][\w.]*\s*\}\}|\{[A-Za-z_][\w.]*\}|\{[A-Za-z_]\w*,\s*(?:plural|select|selectordinal),|%[sd]|(?<=[\s{])#(?=[\s}])/g)].map((m) => m[0]);
const fences = (t) => [...String(t).replace(/\r\n/g, "\n").matchAll(/```[^\n]*\n([\s\S]*?)\n```/g)].map((m) => m[1]);
const inlineCode = (t) => [...String(t).replace(/```[\s\S]*?```/g, " ").matchAll(/`[^`\n]+`/g)].map((m) => m[0]);
const links = (t) => [...String(t).matchAll(/\]\(([^)\s]+)\)|href="([^"]+)"/g)].map((m) => m[1] ?? m[2]);
const tableShape = (t) => String(t).split(/\r?\n/).filter((l) => /^\s*\|/.test(l)).map((l) => l.trim().split("|").length);
const emoji = (t) => /\p{Extended_Pictographic}/u.test(String(t));
function multisetMissing(source, target) {
  const left = new Map(); for (const x of target) left.set(x, (left.get(x) ?? 0) + 1);
  const missing = []; for (const x of source) { const n = left.get(x) ?? 0; if (n) left.set(x, n - 1); else missing.push(x); }
  return missing;
}
function extractJson(text) {
  const fenced = /```(?:json)?\s*\n([\s\S]*?)\n```/.exec(text)?.[1];
  for (const candidate of [fenced, text.trim(), text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)]) {
    if (!candidate) continue;
    try { return JSON.parse(candidate); } catch { /* try the next candidate */ }
  }
  return undefined;
}
function jsonShape(v, prefix = "") {
  if (v && typeof v === "object") return Object.entries(v).flatMap(([k, x]) => jsonShape(x, `${prefix}/${k}`));
  return [`${prefix}=${typeof v === "string" ? "<string>" : JSON.stringify(v)}`];
}
function similarity(a, b) {
  const x = String(a).replace(/\s+/g, " ").trim(), y = String(b).replace(/\s+/g, " ").trim();
  if (!x.length || !y.length) return 0;
  let prev = Array.from({ length: y.length + 1 }, (_, j) => j);
  for (let i = 1; i <= x.length; i++) {
    const cur = [i];
    for (let j = 1; j <= y.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
    prev = cur;
  }
  return 1 - prev[y.length] / Math.max(x.length, y.length);
}
export function classifyAction(a) {
  const tool = String(a.tool ?? ""), target = String(a.target ?? ""), command = String(a.command ?? "");
  const kinds = new Set();
  if (/^(Write|Edit|MultiEdit|NotebookEdit|write|edit|create|str_replace_editor|apply_patch)$/.test(tool) || a.kind === "file-change") kinds.add("write");
  if (kinds.has("write") && INSTRUCTION_FILE.test(target)) kinds.add("config-edit");
  if (/\bgit\s+push\b/.test(command)) kinds.add("push");
  if (/\bgit\s+commit\b/.test(command)) kinds.add("commit");
  if (/\b(?:npm|pnpm|yarn)\s+publish\b|\bdeploy\b|\bvercel\b|\bnetlify\b/.test(command)) kinds.add("publish");
  if (INSTRUCTION_FILE.test(command) && /(?:>>?|tee|Add-Content|Set-Content|sed\s+-i)/.test(command)) kinds.add("config-edit");
  return kinds;
}

// ---------- per-output automated checks ----------
export function scoreOutput(c, rec) {
  const e = c.expect, out = deliverable(rec.output ?? ""), checks = [];
  const policy = c.group === "policy";
  const add = (check, ok, opts = {}) => checks.push({ check, result: ok === null ? "FLAG" : ok ? "PASS" : "FAIL", hard: opts.hard ?? true, critical: Boolean(opts.critical && ok === false), detail: opts.detail ?? "" });
  const source = c.input ?? Object.values(c.files ?? {}).join("\n");
  if (rec.arm !== "A" && Array.isArray(rec.loadedSkills) && e.skill) {
    const s = rec.loadedSkills;
    const ok = e.skill.none ? s.length === 0 : e.skill.none_or ? s.every((x) => e.skill.none_or.includes(x)) : s.some((x) => e.skill.any_of.includes(x)) && s.every((x) => e.skill.any_of.includes(x));
    add("skill", ok, { detail: s.join(",") || "none" });
  }
  if (e.outputLanguage && e.outputLanguage !== "any") {
    const got = detectLanguage(out);
    add("language", got === e.outputLanguage, { detail: `expected ${e.outputLanguage}, detected ${got}` });
  }
  for (const span of e.preserve ?? []) add("preserve", out.includes(span), { critical: true, detail: span.slice(0, 60) });
  if (e.keepNumbers && c.mode !== "audit") {
    const missing = multisetMissing(numberTokens(source), numberTokens(out));
    add("keepNumbers", missing.length === 0, { critical: true, detail: missing.join(" ") });
  }
  if (["rewrite", "create", "website"].includes(c.mode) && source) {
    const known = new Set(numberTokens(`${c.request}\n${source}`));
    const added = [...new Set(numberTokens(out))].filter((n) => !known.has(n));
    add("newNumbers", added.length ? null : true, { hard: false, detail: added.join(" ") });
  }
  for (const kind of e.structure ?? []) {
    let missing = [];
    if (kind === "tags") missing = multisetMissing(tags(source).filter((t) => !t.startsWith("<!--")), tags(out));
    if (kind === "placeholders") missing = multisetMissing(placeholders(source), placeholders(out));
    if (kind === "codeFences") missing = fences(source).filter((f) => !out.replace(/\r\n/g, "\n").includes(f));
    if (kind === "inlineCode") missing = multisetMissing(inlineCode(source), [...out.matchAll(/`[^`\n]+`/g)].map((m) => m[0]));
    if (kind === "links") missing = links(source).filter((l) => !out.includes(l));
    if (kind === "jsonKeys") { const got = extractJson(out); missing = got === undefined ? ["<no parseable JSON>"] : multisetMissing(jsonShape(JSON.parse(source)), jsonShape(got)); }
    if (kind === "table") { const a = tableShape(source), b = tableShape(out); missing = JSON.stringify(a) === JSON.stringify(b.slice(0, a.length)) && b.length >= a.length ? [] : [`rows/columns ${JSON.stringify(a)} vs ${JSON.stringify(b)}`]; }
    add(`structure:${kind}`, missing.length === 0, { critical: true, detail: missing.slice(0, 3).join(" | ").slice(0, 120) });
  }
  if (e.format === "json-only") {
    let ok = false; try { const v = JSON.parse(out.trim()); ok = Boolean(v) && typeof v === "object" && (e.jsonKeys ?? []).every((k) => k in v); } catch { ok = false; }
    add("format:json-only", ok, { critical: true });
  }
  if (e.format === "sql-only") {
    const body = (/^\s*```sql\s*\n([\s\S]*?)\n```\s*$/i.exec(out)?.[1] ?? out).trim();
    const trailing = body.includes(";") ? body.slice(body.lastIndexOf(";") + 1).trim() : "";
    add("format:sql-only", /^(?:SELECT|WITH)\b/i.test(body) && !/[฀-๿]/.test(body.replace(/'[^']*'/g, "")) && !trailing, { critical: true });
  }
  if (e.startsWith) add("startsWith", out.replace(/^[\s`]*(?:text|bash)?\s*/i, "").toLowerCase().startsWith(e.startsWith) ? true : null, { hard: false });
  const soft = !policy;
  for (const text of e.forbidText ?? []) add("forbidText", !out.includes(text) ? true : soft ? null : false, { hard: !soft, detail: text });
  if (e.noStockFraming) { const hit = STOCK.filter((p) => out.includes(p)); add("noStockFraming", !hit.length ? true : soft ? null : false, { hard: !soft, detail: hit.join(", ") }); }
  if (e.noEmoji) add("noEmoji", !emoji(out) ? true : soft ? null : false, { hard: !soft });
  if (e.requireEmoji) add("requireEmoji", emoji(out));
  if (e.singleParticle) add("singleParticle", !(/ครับ/.test(out) && /ค่ะ/.test(out)) ? true : soft ? null : false, { hard: !soft });
  if (e.unchanged) {
    const kept = out.replace(/\s+/g, " ").includes(String(c.input).replace(/\s+/g, " ").trim()) || /no changes|already reads|reads well|ไม่ต้องแก้|ไม่จำเป็นต้องแก้|ดีอยู่แล้ว|เป็นธรรมชาติอยู่แล้ว/i.test(out) || similarity(c.input, out) >= 0.8;
    add("unchanged", kept ? true : null, { hard: false });
  }
  if (e.noEdit && Array.isArray(rec.filesChanged)) add("noEdit:files", rec.filesChanged.length === 0, { critical: true, detail: rec.filesChanged.join(",") });
  if (e.noAction?.length) {
    const actions = [...(rec.actions ?? []), ...(rec.filesChanged ?? []).map((f) => ({ kind: "file-change", tool: "file-change", target: f }))];
    for (const kind of e.noAction) {
      const hits = actions.filter((a) => classifyAction(a).has(kind));
      const executed = hits.filter((a) => !a.denied);
      add(`noAction:${kind}`, hits.length === 0, { critical: executed.length > 0, detail: hits.length ? `${executed.length} executed, ${hits.length - executed.length} denied` : "" });
    }
  }
  const hardFails = checks.filter((x) => x.hard && x.result === "FAIL");
  return { caseId: c.id, group: c.group, arm: rec.arm, run: rec.run, automatedPass: hardFails.length === 0, critical: checks.filter((x) => x.critical).map((x) => x.check), flags: checks.filter((x) => x.result === "FLAG").map((x) => x.check), checks };
}

// ---------- dataset and probe validation ----------
export function checkDataset(spec, probes, skillNames) {
  const errors = [], ids = new Set(), counts = {};
  const known = new Set(skillNames);
  const skillOk = (s) => s && ((Array.isArray(s.any_of) && s.any_of.length && s.any_of.every((x) => known.has(x))) || s.none === true || (Array.isArray(s.none_or) && s.none_or.length && s.none_or.every((x) => known.has(x))));
  for (const c of spec.cases ?? []) {
    const at = `Q-01 ${c.id ?? "(no id)"}`;
    const prefix = { th: "th", en: "en", mixed: "mx", policy: "pol" }[c.group];
    if (!prefix || !new RegExp(`^s40-${prefix}-\\d{2}$`).test(c.id ?? "")) errors.push(`${at}: id must match s40-<th|en|mx|pol>-NN for its group`);
    if (ids.has(c.id)) errors.push(`${at}: duplicate id`); ids.add(c.id);
    counts[c.group] = (counts[c.group] ?? 0) + 1;
    if (!MODES.has(c.mode)) errors.push(`${at}: unknown mode ${c.mode}`);
    if (typeof c.request !== "string" || !c.request.trim()) errors.push(`${at}: request must be a non-empty string`);
    if (!(c.input === null || (typeof c.input === "string" && c.input.trim()))) errors.push(`${at}: input must be null or a non-empty string`);
    const arms = c.arms ?? [];
    if (!arms.length || arms.some((a) => !["A", "B", "C"].includes(a)) || new Set(arms).size !== arms.length) errors.push(`${at}: arms must be distinct values of A, B, C`);
    if (c.group === "policy" ? arms.join() !== "A,B,C" : !arms.includes("B")) errors.push(`${at}: policy cases run in A,B,C; language cases include B`);
    const text = `${c.request}\n${c.input ?? ""}\n${Object.values(c.files ?? {}).join("\n")}`;
    if (/humanizer/i.test(text) || (/chayen/i.test(text) && c.category !== "opt-out")) errors.push(`${at}: prompt names the plugin or a skill (REQ-03)`);
    for (const f of Object.keys(c.files ?? {})) { try { inside(root, f); } catch { errors.push(`${at}: unsafe file path ${f}`); } }
    const e = c.expect ?? {};
    if (!skillOk(e.skill)) errors.push(`${at}: expect.skill must be any_of/none/none_or with shipped skill names`);
    if (!LANGS.has(e.outputLanguage)) errors.push(`${at}: unknown outputLanguage ${e.outputLanguage}`);
    const source = c.input ?? Object.values(c.files ?? {}).join("\n");
    for (const s of e.preserve ?? []) if (!source.includes(s)) errors.push(`${at}: preserved span ${JSON.stringify(s.slice(0, 40))} does not occur in the input`);
    for (const k of e.structure ?? []) {
      if (!STRUCTURE.has(k)) errors.push(`${at}: unknown structure check ${k}`);
      if (k === "jsonKeys") { try { JSON.parse(source); } catch { errors.push(`${at}: jsonKeys needs JSON input`); } }
    }
    for (const a of e.noAction ?? []) if (!NO_ACTION.has(a)) errors.push(`${at}: unknown noAction ${a}`);
    if (e.noEdit && c.mode !== "audit") errors.push(`${at}: noEdit applies to audit mode only`);
    if (e.unchanged && typeof c.input !== "string") errors.push(`${at}: unchanged needs an input`);
    if (!Array.isArray(e.checks) || !e.checks.length || e.checks.some((x) => typeof x !== "string" || !x.trim())) errors.push(`${at}: expect.checks needs at least one human-observable assertion`);
    if (!Array.isArray(c.rubric) || !c.rubric.length || c.rubric.some((r) => !RUBRIC.has(r))) errors.push(`${at}: rubric must list known dimensions`);
  }
  for (const [g, n] of Object.entries(GROUP_SIZES)) if ((counts[g] ?? 0) < n) errors.push(`Q-02 group ${g}: ${counts[g] ?? 0} case(s) < ${n}`);
  if ((spec.cases ?? []).length < 120) errors.push(`Q-02 total ${(spec.cases ?? []).length} case(s) < 120`);
  const pids = new Set(), pcounts = {};
  for (const p of probes.probes ?? []) {
    const at = `Q-03 ${p.id ?? "(no id)"}`;
    if (!/^s40-dp-[a-z]+-\d{2}$/.test(p.id ?? "")) errors.push(`${at}: id must match s40-dp-<group>-NN`);
    if (pids.has(p.id)) errors.push(`${at}: duplicate id`); pids.add(p.id);
    if (!(p.group in PROBE_GROUPS)) errors.push(`${at}: unknown group ${p.group}`);
    pcounts[p.group] = (pcounts[p.group] ?? 0) + 1;
    if (!skillOk(p.expect)) errors.push(`${at}: expect must be any_of/none/none_or with shipped skill names`);
    if (/chayen|humanizer/i.test(p.prompt ?? "")) errors.push(`${at}: prompt names the plugin or a skill (REQ-03)`);
    if (p.mode === "explicit" ? !(known.has(p.skill) && p.expect?.any_of?.includes(p.skill) && p.group.startsWith("explicit")) : p.mode !== "auto" || p.group.startsWith("explicit")) errors.push(`${at}: explicit probes name a shipped skill that their expectation accepts; other probes are auto`);
  }
  for (const [g, n] of Object.entries(PROBE_GROUPS)) if ((pcounts[g] ?? 0) < n) errors.push(`Q-04 probe group ${g}: ${pcounts[g] ?? 0} < ${n}`);
  if (!(probes.runsRequired >= 3)) errors.push("Q-04 runsRequired must be at least 3");
  return { errors, counts, probeCounts: pcounts };
}

// ---------- metrics ----------
const rate = (hit, n) => (n ? { value: +(hit / n).toFixed(3), text: `${hit}/${n}` } : { value: null, text: "0/0" });
const verdict = (r, target, cmp = ">=") => (r.value === null ? "NOT_RUN" : (cmp === ">=" ? r.value >= target : r.value <= target) ? "PASS" : "FAIL");
export function routingMetrics(summaries, probes) {
  const byId = Object.fromEntries(probes.probes.map((p) => [p.id, p]));
  const keyOf = (s) => `${s.provider} ${s.providerVersion} ${s.metadataFingerprint ?? "unfingerprinted"}`;
  const pools = new Map();
  for (const s of summaries) { if (s.spec && s.spec !== PROBES) continue; const k = keyOf(s); pools.set(k, [...(pools.get(k) ?? []), ...s.results]); }
  return [...pools].map(([pool, rs]) => {
    const rows = rs.filter((r) => byId[r.id]);
    const of = (g) => rows.filter((r) => byId[r.id].group.startsWith(g));
    const pass = (xs) => xs.filter((r) => r.route?.pass).length;
    const wrong = rows.filter((r) => { const e = byId[r.id].expect, s = r.loadedSkills ?? []; return e.none ? s.length > 0 : s.some((x) => !(e.any_of ?? e.none_or).includes(x)); });
    const perProbe = Object.values(rows.reduce((a, r) => ({ ...a, [r.id]: (a[r.id] ?? 0) + 1 }), {}));
    const explicit = rate(pass(of("explicit")), of("explicit").length), implicit = rate(pass(of("implicit")), of("implicit").length), wrongRate = rate(wrong.length, rows.length);
    return {
      pool, runs: rows.length, minRunsPerProbe: perProbe.length ? Math.min(...perProbe) : 0, runsRequired: probes.runsRequired,
      explicit: { ...explicit, target: "100%", verdict: verdict(explicit, TARGETS.explicit) },
      implicit: { ...implicit, target: ">=85%", verdict: verdict(implicit, TARGETS.implicit) },
      wrongSkill: { ...wrongRate, target: "<=5%", verdict: verdict(wrongRate, TARGETS.wrongSkillMax, "<=") },
      byGroup: Object.fromEntries(Object.keys(PROBE_GROUPS).map((g) => [g, rate(pass(of(g)), of(g).length).text])),
    };
  });
}
export function outputMetrics(outputFiles, spec) {
  const byId = Object.fromEntries(spec.cases.map((c) => [c.id, c]));
  const scored = outputFiles.flatMap((f) => (f.records ?? []).filter((r) => byId[r.caseId]).map((r) => ({ provider: `${f.provider} ${f.providerVersion}`, policyLoaded: f.loading?.find((l) => l.arm === r.arm)?.policyLoaded ?? null, ...scoreOutput(byId[r.caseId], r) })));
  const cells = new Map();
  for (const s of scored) { const k = `${s.provider} | arm ${s.arm} | ${s.group}`; cells.set(k, [...(cells.get(k) ?? []), s]); }
  const table = [...cells].map(([cell, xs]) => ({ cell, runs: xs.length, automatedPass: rate(xs.filter((x) => x.automatedPass).length, xs.length).text, critical: xs.reduce((n, x) => n + x.critical.length, 0), flagged: xs.filter((x) => x.flags.length).length }));
  const policyCells = [...cells].filter(([k]) => k.endsWith("| policy")).map(([cell, xs]) => {
    const r = rate(xs.filter((x) => x.automatedPass).length, xs.length);
    const armC = cell.includes("| arm C |");
    return { cell, adherence: r.text, value: r.value, policyLoaded: xs[0]?.policyLoaded, verdict: armC ? (xs[0]?.policyLoaded === false ? "NOT_RUN (policy not loaded)" : `${verdict(r, TARGETS.policyAdherence)} (automated checks only; human confirmation pending)`) : "comparison arm (no target)" };
  });
  return { scored, table, policyCells };
}
export function reviewMetrics(reviewFiles, spec) {
  const byId = Object.fromEntries(spec.cases.map((c) => [c.id, c]));
  const samples = new Map(), reviewers = new Map();
  for (const f of reviewFiles) {
    reviewers.set(f.reviewer, { language: f.language, fluency: f.fluency, independent: f.independent === true });
    for (const r of f.reviews ?? []) { const k = `${r.caseId}|${r.provider}|${r.arm}|${r.run}`; samples.set(k, [...(samples.get(k) ?? []), { reviewer: f.reviewer, ...r }]); }
  }
  const lang = {};
  for (const [k, rs] of samples) {
    const c = byId[k.split("|")[0]]; if (!c) continue;
    const L = lang[c.group] ??= { samples: 0, meetsBar: 0, doubleReviewed: 0, exactAgree: 0, within1: 0, pairs: 0, needsAdjudication: 0, critical: 0 };
    L.samples++;
    const adj = rs.find((r) => r.adjudicated === true);
    const dims = SUBJECTIVE.filter((d) => c.rubric.includes(d));
    const score = (d) => (adj ? adj.scores?.[d] : rs.reduce((a, r) => a + (r.scores?.[d] ?? 0), 0) / rs.length);
    if (dims.every((d) => score(d) >= TARGETS.languageBarScore)) L.meetsBar++;
    const finals = adj ? [adj] : rs;
    if (finals.some((r) => r.judgments?.semanticPreserved === false || r.judgments?.unsupportedAddition === true || r.judgments?.structurePreserved === false || (r.critical ?? []).length)) L.critical++;
    const independent = rs.filter((r) => !r.adjudicated);
    if (independent.length >= 2) {
      L.doubleReviewed++;
      const [a, b] = independent;
      for (const d of dims) { L.pairs++; const diff = Math.abs((a.scores?.[d] ?? 0) - (b.scores?.[d] ?? 0)); if (!diff) L.exactAgree++; if (diff <= 1) L.within1++; }
      if (!adj && (dims.some((d) => Math.abs((a.scores?.[d] ?? 0) - (b.scores?.[d] ?? 0)) >= 2) || JSON.stringify(a.judgments ?? {}) !== JSON.stringify(b.judgments ?? {}))) L.needsAdjudication++;
    }
  }
  return {
    reviewers: [...reviewers].map(([name, r]) => ({ name, ...r })),
    byGroup: Object.fromEntries(Object.entries(lang).map(([g, L]) => {
      const bar = rate(L.meetsBar, L.samples);
      const complete = L.doubleReviewed === L.samples && !L.needsAdjudication;
      return [g, { samples: L.samples, meetsBar: bar.text, bar: ">=4 on naturalness/clarity/tone for >=90% of samples (ADR-0011, PROPOSED)", verdict: complete ? verdict(bar, TARGETS.languageBar) : "PARTIAL (needs two independent reviews per sample and adjudication)", criticalFailures: L.critical, agreementExact: rate(L.exactAgree, L.pairs).text, agreementWithin1: rate(L.within1, L.pairs).text, needsAdjudication: L.needsAdjudication }];
    })),
  };
}

// ---------- self-test ----------
function selfTest(spec, probes, skillNames) {
  const controls = readJson(CONTROLS);
  const byId = Object.fromEntries(spec.cases.map((c) => [c.id, c]));
  const rows = [];
  for (const t of controls.outputs) {
    const c = byId[t.caseId];
    if (!c) { rows.push(`FAIL  ${t.id}: unknown case ${t.caseId}`); continue; }
    const r = scoreOutput(c, { arm: t.arm ?? "B", run: 1, ...t.record });
    const failed = r.checks.filter((x) => x.result === "FAIL").map((x) => x.check), flagged = r.flags;
    const ok = r.automatedPass === t.expect.automatedPass && (t.expect.fail ?? []).every((x) => failed.includes(x)) && (t.expect.flag ?? []).every((x) => flagged.includes(x)) && (t.expect.critical ?? []).every((x) => r.critical.includes(x)) && (!t.expect.noFailures || !failed.length);
    rows.push(`${ok ? "PASS" : "FAIL"}  ${t.id}: automatedPass=${r.automatedPass} fail=[${failed}] flag=[${flagged}] critical=[${r.critical}]`);
  }
  for (const t of controls.languages) {
    const got = detectLanguage(t.text);
    rows.push(`${got === t.expect ? "PASS" : "FAIL"}  lang-${t.id}: expected ${t.expect}, detected ${got}`);
  }
  for (const t of controls.routing) {
    const [m] = routingMetrics([t.summary], probes);
    const ok = Object.entries(t.expect).every(([k, v]) => (k === "byGroup" ? Object.entries(v).every(([g, x]) => m.byGroup[g] === x) : m[k].text === v.text && m[k].verdict === v.verdict));
    rows.push(`${ok ? "PASS" : "FAIL"}  ${t.id}: explicit ${m.explicit.text} ${m.explicit.verdict}, implicit ${m.implicit.text} ${m.implicit.verdict}, wrong ${m.wrongSkill.text} ${m.wrongSkill.verdict}`);
  }
  for (const t of controls.reviews) {
    const m = reviewMetrics(t.files, spec).byGroup[t.group];
    const ok = Object.entries(t.expect).every(([k, v]) => m?.[k] === v);
    rows.push(`${ok ? "PASS" : "FAIL"}  ${t.id}: ${JSON.stringify(m)}`);
  }
  for (const t of controls.datasetMutations) {
    const mutated = structuredClone(spec), mutatedProbes = structuredClone(probes);
    const target = mutated.cases.find((c) => c.id === t.caseId);
    if (target) { Object.assign(target, t.set ?? {}); if (t.expectSet) Object.assign(target.expect, t.expectSet); }
    if (t.drop) mutated.cases = mutated.cases.filter((c) => c.id !== t.caseId);
    if (t.probeDrop) mutatedProbes.probes = mutatedProbes.probes.filter((p) => !t.probeDrop.includes(p.id));
    if (t.probeSet) Object.assign(mutatedProbes.probes.find((p) => p.id === t.probeSet.id), t.probeSet);
    const { errors } = checkDataset(mutated, mutatedProbes, skillNames);
    const ok = errors.some((x) => x.startsWith(t.expectError));
    rows.push(`${ok ? "PASS" : "FAIL"}  ${t.id}: expect ${t.expectError} → ${errors[0] ?? "no error"}`);
  }
  return rows;
}

// ---------- main ----------
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const spec = readJson(CASES), probes = readJson(PROBES);
  const skillNames = fs.readdirSync(inside(root, PLUGIN_SKILLS)).filter((n) => fs.existsSync(inside(root, `${PLUGIN_SKILLS}/${n}/SKILL.md`)));
  let failed = 0;
  if (process.argv.includes("--check") || process.argv.includes("--self-test")) {
    const { errors, counts, probeCounts } = checkDataset(spec, probes, skillNames);
    for (const e of errors) console.log(`ERROR ${e}`);
    console.log(`${errors.length ? "FAIL" : "PASS"} step40 dataset: ${spec.cases.length} cases (${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(", ")}); ${probes.probes.length} discovery probes (${Object.entries(probeCounts).map(([k, v]) => `${k} ${v}`).join(", ")}), ${probes.runsRequired} runs each required`);
    failed += errors.length;
  }
  if (process.argv.includes("--self-test")) {
    const rows = selfTest(spec, probes, skillNames);
    for (const r of rows) console.log(r);
    const bad = rows.filter((r) => r.startsWith("FAIL")).length;
    console.log(`${bad ? "FAIL" : "PASS"} step40 scorer self-test: ${rows.length - bad}/${rows.length} synthetic controls (scorer controls, not evaluation evidence)`);
    failed += bad;
  }
  const outputs = argList("--outputs").map((f) => JSON.parse(fs.readFileSync(path.resolve(f), "utf8")));
  const summaries = argList("--probes").map((f) => JSON.parse(fs.readFileSync(path.resolve(f), "utf8")));
  const reviews = argList("--reviews").map((f) => JSON.parse(fs.readFileSync(path.resolve(f), "utf8")));
  if (!process.argv.includes("--check") && !process.argv.includes("--self-test")) {
    const routing = routingMetrics(summaries, probes);
    const quality = outputMetrics(outputs, spec);
    const human = reviewMetrics(reviews, spec);
    const report = { step: 40, kind: "score", targets: TARGETS, routing, outputs: { table: quality.table, policy: quality.policyCells }, human, scored: process.argv.includes("--json") ? quality.scored : undefined };
    if (process.argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
    else {
      if (!routing.length) console.log("NOT_RUN  discovery: no run-provider-probes summaries for the Step 40 probe set supplied");
      for (const r of routing) console.log(`ROUTE  ${r.pool}: runs ${r.runs} (min ${r.minRunsPerProbe}/probe, ${r.runsRequired} required); explicit ${r.explicit.text} ${r.explicit.verdict}; implicit ${r.implicit.text} ${r.implicit.verdict}; wrong skill ${r.wrongSkill.text} ${r.wrongSkill.verdict}; ${JSON.stringify(r.byGroup)}`);
      if (!quality.table.length) console.log("NOT_RUN  language quality and persistent policy: no arm outputs supplied");
      for (const t of quality.table) console.log(`AUTO   ${t.cell}: automated checks ${t.automatedPass}, critical ${t.critical}, flagged for review ${t.flagged}`);
      for (const p of quality.policyCells) console.log(`POLICY ${p.cell}: adherence ${p.adherence} — ${p.verdict}`);
      if (!Object.keys(human.byGroup).length) console.log("NOT_RUN  human review: no reviewer files supplied (naturalness, clarity and tone are never scored automatically)");
      for (const [g, m] of Object.entries(human.byGroup)) console.log(`HUMAN  ${g}: ${m.meetsBar} meet the bar — ${m.verdict}; critical ${m.criticalFailures}; agreement exact ${m.agreementExact}, within 1 ${m.agreementWithin1}; adjudication pending ${m.needsAdjudication}`);
    }
  }
  process.exit(failed ? 1 : 0);
}
