#!/usr/bin/env node
// Developer-only guidance consistency checker (gate G-18, evolution Step 09). Never shipped.
// Enforces a small set of explicit policy invariants (tools/validate/guidance-invariants.json) over the
// shipped Markdown, so that the task-contract, approval, verdict, completion, status, precedence, advisory,
// hand-off and workflow rules cannot silently contradict each other after an edit.
//
// It does not try to prove natural-language consistency. Each check is either
//   - a structural anchor: a named section, table or numbered step must still carry a short key phrase, or
//   - a narrow contradiction pattern: a definitional or claiming sentence that states the opposite rule,
//     skipped when the sentence negates it.
// Heuristic signals are reported as REVIEW (exit 0); only ERROR fails. See docs/chayen/GUIDANCE_INVARIANTS.md.
// Offline, deterministic, zero dependencies (Node.js >= 20.11).
//
// Usage: node tools/validate/check-guidance.mjs [--root <repoRoot>]
// Exit code: 0 = no errors (REVIEW items allowed), 1 = errors found.

import fs from "node:fs";
import path from "node:path";
import { inside, assertTreeNoLinks } from "./safe-paths.mjs";

const args = process.argv.slice(2);
const root = path.resolve(args.includes("--root") ? args[args.indexOf("--root") + 1] : path.join(import.meta.dirname, "..", ".."));
const SKILLS = "plugins/codejadee-chayen-framework/skills";
const spec = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "guidance-invariants.json"), "utf8"));
const NAME = Object.fromEntries(spec.invariants.map((i) => [i.id, i.name]));

const findings = [];
const error = (id, file, msg) => findings.push({ level: "ERROR", id, file, msg });
const review = (id, file, msg) => findings.push({ level: "REVIEW", id, file, msg });

// ---------- loading ----------
const skillsDir = inside(root, SKILLS);
assertTreeNoLinks(skillsDir);
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".md")) files.push({ rel: path.relative(skillsDir, p).split(path.sep).join("/"), text: fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n") });
  }
})(skillsDir);
const shipped = new Set(files.filter((f) => /^[^/]+\/SKILL\.md$/.test(f.rel)).map((f) => f.rel.split("/")[0]));
const byRel = new Map(files.map((f) => [f.rel, f]));
const get = (rel) => byRel.get(rel)?.text ?? null;

// ---------- text helpers ----------
// Emphasis and code-span markers are dropped and whitespace collapsed, so rewrapping or bolding never changes a result.
const norm = (s) => s.replace(/[*`]/g, "").replace(/\s+/g, " ").trim();
function section(text, title) {
  const m = new RegExp(`^## ${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "m").exec(text);
  if (!m) return null;
  const rest = text.slice(m.index + m[0].length);
  const next = rest.search(/^## /m);
  return next < 0 ? rest : rest.slice(0, next);
}
// Units: each table row on its own; otherwise blank-line separated blocks (list items stay together).
function units(text) {
  const out = [];
  for (const block of text.split(/\n\s*\n/)) {
    const lines = block.split("\n");
    if (lines.every((l) => l.trim().startsWith("|") || !l.trim())) out.push(...lines.filter((l) => l.trim() && !/^\|[\s:|-]+\|$/.test(l.trim())).map(norm));
    else out.push(norm(block));
  }
  return out.filter(Boolean);
}
const sentences = (unit) => unit.split(/(?<=[.!?;])\s+/);
// Top-level numbered items of a section: "1. ...", "2. ..." up to the next top-level number.
function numberedItems(sectionText) {
  const items = [];
  let cur = null;
  for (const line of sectionText.split("\n")) {
    const m = /^(\d+)\.\s+(.*)$/.exec(line);
    if (m) { cur = { n: Number(m[1]), lines: [m[2]] }; items.push(cur); }
    else if (cur) cur.lines.push(line);
  }
  return items.map((i) => ({ n: i.n, text: norm(i.lines.join("\n")) }));
}
function tableRows(sectionText) {
  return sectionText.split("\n").filter((l) => l.trim().startsWith("|") && !/^\|[\s:|-]+\|$/.test(l.trim()))
    .map((l) => l.trim().slice(1, -1).split("|").map((c) => norm(c)));
}
const NEGATION = /\b(never|not|no|nor|cannot|can't|don't|doesn't|does not|do not|without|isn't|aren't)\b/i;
// A contradiction pattern matches only if no negation appears inside the match or just before it.
function contradictions(regex, scope) {
  const hits = [];
  for (const f of scope) for (const u of units(f.text)) for (const s of sentences(u)) {
    for (const m of s.matchAll(new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : `${regex.flags}g`))) {
      const window = s.slice(Math.max(0, m.index - 30), m.index + m[0].length);
      if (!NEGATION.test(window)) hits.push({ file: f.rel, text: m[0] });
    }
  }
  return hits;
}
const IMPL = "chayen-implementation";
const RECIPE = `${IMPL}/references/task-contract.md`, SUMMARY = `${IMPL}/references/change-summary.md`, IMPL_SKILL = `${IMPL}/SKILL.md`;
function needFile(id, rel) { const t = get(rel); if (t === null) error(id, rel, "authoritative source file is missing"); return t; }

// ---------- GI-01 task-contract decision ----------
{
  const id = "GI-01", recipe = needFile(id, RECIPE), skill = needFile(id, IMPL_SKILL);
  if (recipe) {
    const proc = section(recipe, "Procedure");
    if (!proc) error(id, RECIPE, 'missing "## Procedure"');
    else {
      const flat = proc.replace(/[*`]/g, "");
      const clarify = /clarify(?:\s+\S+){0,8}?\s+before\s+(?:any|the\s+first)\s+(?:file\s+)?edit/i.exec(flat);
      if (!clarify) error(id, RECIPE, "Procedure no longer requires clarifying an unclear request before any edit");
      else if (!/however\s+small/i.test(flat.slice(Math.max(0, clarify.index - 200), clarify.index + 300))) error(id, RECIPE, 'the clarification rule no longer applies "however small" the change looks');
      const tableAt = flat.search(/^[ \t]*\|[^\n]*Situation[^\n]*\|[^\n]*Path[^\n]*\|/im);
      if (tableAt < 0) error(id, RECIPE, 'missing the "| Situation | Path |" decision table');
      else {
        if (clarify && clarify.index > tableAt) error(id, RECIPE, "clarification must be decided before the contract table, so an unclear small request cannot take the no-contract path");
        const paths = tableRows(flat.slice(tableAt)).slice(1).map((r) => (r[1] ?? "").toLowerCase());
        for (const [label, re] of [["full contract", /full contract/], ["proportional contract", /proportional contract/], ["no contract", /no contract/]]) if (!paths.some((p) => re.test(p))) error(id, RECIPE, `decision table has no "${label}" path`);
      }
    }
  }
  if (skill) {
    const items = numberedItems(section(skill, "Workflow") ?? "");
    const step = items.find((i) => /task contract recipe/i.test(i.text));
    if (!step) error(id, IMPL_SKILL, "no workflow step delegates the clarification and contract decision to the task contract recipe");
    else {
      if (!/clarif\w*[^.;]{0,80}before (?:any|the first) (?:file )?edit/i.test(step.text)) error(id, IMPL_SKILL, `workflow step ${step.n} no longer requires clarification before any edit for an unclear request`);
      for (const [label, re] of [["full contract", /full contract/i], ["proportional contract", /proportional contract/i], ["no questions and no contract", /no questions|no contract/i]]) if (!re.test(step.text)) error(id, IMPL_SKILL, `workflow step ${step.n} no longer names the "${label}" path`);
    }
    const ref = tableRows(section(skill, "References") ?? "").find((r) => /references\/task-contract\.md/.test(r[0] ?? ""));
    if (!ref) error(id, IMPL_SKILL, "References table does not list references/task-contract.md");
    else if (!/unclear|ambigu|clarif/i.test(ref[1] ?? "")) error(id, IMPL_SKILL, "the recipe's load condition no longer covers unclear requests, so it may not load when clarification is needed");
  }
  for (const h of contradictions(/\b(?:two|three|four|five|[2-5])\s+or\s+more\s+files\b[^.;]{0,80}\bcontract\b|\bcontract\b[^.;]{0,80}\b(?:two|three|four|five|[2-5])\s+or\s+more\s+files\b/i, files.filter((f) => f.rel !== RECIPE))) error(id, h.file, `restates a file-count contract rule outside the task-contract recipe: "${h.text}"`);
  for (const h of contradictions(/\b(?:proceed|start editing|begin editing|edit)\b[^.;]{0,60}\b(?:on|with|using)\s+(?:a\s+|the\s+)?(?:most\s+)?(?:reasonable|best|likely)\s+(?:guess|interpretation|assumption)/i, files)) error(id, h.file, `lets an unclear request proceed on a guessed interpretation: "${h.text}"`);
}

// ---------- GI-02 action-specific approval ----------
{
  const id = "GI-02", recipe = get(RECIPE), skill = get(IMPL_SKILL);
  if (recipe) {
    const t = norm(recipe);
    if (!/approv\w*\s+(?:of\s+)?(?:that|the|each)\s+(?:exact\s+)?action\s+and\s+target/i.test(t)) error(id, RECIPE, "no longer requires approval of the exact action and target before a risky action");
    if (!/confirm\w*[^.]{0,120}\bnever\b[^.]{0,40}\bapprov/i.test(t)) error(id, RECIPE, "no longer says that confirming the description or contract is never approval");
  }
  if (skill && !/contract[^.]{0,40}\b(?:is not|isn't|never)\b[^.]{0,30}approv\w* of (?:each|every|any) risky action/i.test(norm(section(skill, "Safety boundaries") ?? ""))) error(id, IMPL_SKILL, "Safety boundaries no longer say that contract approval is not approval of each risky action");
  const weaken = [
    /\bapprov\w*\s+of\s+the\s+(?:task\s+)?(?:contract|plan)\s+(?:covers|includes|implies|counts as|is enough for|authori[sz]es|approves|extends to)\b/i,
    /\bconfirm\w*\b[^.;]{0,60}\b(?:is|counts as|serves as|implies|equals|grants)\s+(?:an?\s+)?(?:approval|authori[sz]ation|permission)\b/i,
    /\bconfirm\w*\b[^.;]{0,60}\b(?:approves|authori[sz]es)\b/i,
  ];
  for (const re of weaken) for (const h of contradictions(re, files)) error(id, h.file, `weakens action-specific approval: "${h.text}"`);
}

// ---------- GI-03 acceptance verdicts ----------
{
  const id = "GI-03";
  const definitions = { accept: 0, verify_more: 0, revise: 0 };
  for (const f of files) for (const u of units(f.text)) for (const part of u.split(/;\s*|(?<=\.)\s+/)) {
    for (const m of part.matchAll(/\b(accept|verify_more|revise)\b\s*(?::|\bwhen\b|\bif\b|\bmeans\b)\s+([^;]+)/gi)) {
      // A definition ends at the next verdict word, so "accept when ..., verify_more when ..." is read clause by clause.
      const verdict = m[1].toLowerCase(), body = m[2].split(/\b(?:accept|verify_more|revise)\b/i)[0];
      if (f.rel === SUMMARY) definitions[verdict] += 1;
      if (verdict === "accept" && /\b(missing|partial|stale|not (?:re-?runnable|reproducible|run|executed)|not_run|skipped|blocked|unknown|no evidence|without evidence|absent|unverified|uncovered)\b/i.test(body)) error(id, f.rel, `defines accept with missing or unexecuted evidence: "${m[0].slice(0, 120)}"`);
      if (verdict === "verify_more" && !/\b(missing|partial|stale|not (?:re-?runnable|reproducible))\b/i.test(body)) error(id, f.rel, `defines verify_more without missing, partial or stale evidence: "${m[0].slice(0, 120)}"`);
      if (verdict === "revise" && !/contradict/i.test(body)) error(id, f.rel, `defines revise without contradicting evidence: "${m[0].slice(0, 120)}"`);
    }
  }
  if (get(SUMMARY)) for (const [v, n] of Object.entries(definitions)) if (!n) error(id, SUMMARY, `the authoritative recipe no longer defines the ${v} verdict`);
  for (const re of [
    /\b(?:missing|absent|partial|stale|no|unverified)\s+evidence\b[^.;]{0,40}\b(?:is|are|counts as|marked(?: as)?|treated as|becomes?)\s+(?:an?\s+)?accept(?:ed)?\b/i,
    /\b(?:uncovered|untested)\b[^.;]{0,40}\b(?:is|are|counts as|marked(?: as)?|treated as)\s+accept(?:ed)?\b/i,
  ]) for (const h of contradictions(re, files)) error(id, h.file, `marks missing evidence as accepted: "${h.text}"`);
}

// ---------- GI-04 completion outcome ----------
{
  const id = "GI-04";
  const defining = /\buse DONE only\b|\bDONE\s+(?:only\s+)?(?:requires|needs|applies)\b|\bDONE\s+only\s+(?:when|if|for)\b|\bis DONE only\b|\bDONE\s+(?:when|if)\b/;
  // Within a paragraph, list or table row, at least one sentence that defines DONE must itself require accept;
  // another sentence merely mentioning the verdicts does not satisfy the rule.
  for (const f of files) for (const u of units(f.text)) {
    const defs = sentences(u).filter((s) => defining.test(s));
    if (defs.length && !defs.some((s) => /\baccept\b/.test(s))) error(id, f.rel, `defines when DONE applies without requiring accepted criteria: "${defs[0].slice(0, 140)}"`);
  }
  for (const h of contradictions(/\b(?:written code|the code is written|code written|it compiles|compilation|a green build|the build (?:passes|is green))\b[^.;]{0,30}\b(?:means|is|counts as|makes (?:it|the task))\s+DONE\b/i, files)) error(id, h.file, `makes DONE follow from code or a build alone: "${h.text}"`);
  for (const h of contradictions(/\bDONE\b[^.;]{0,40}\b(?:once|as soon as|because)\b[^.;]{0,40}\b(?:code (?:is|was|has been) written|it compiles|the build (?:passes|is green))/i, files)) error(id, h.file, `makes DONE follow from code or a build alone: "${h.text}"`);
  const s = get(SUMMARY);
  if (s) { const p = norm(section(s, "Procedure") ?? ""); for (const o of ["DONE", "PARTIAL", "BLOCKED"]) if (!new RegExp(`\\b${o}\\b\\s+(?:only\\s+)?when`).test(p)) error(id, SUMMARY, `the authoritative recipe no longer defines when ${o} applies`); }
}

// ---------- GI-05 check-status honesty ----------
{
  const id = "GI-05", TESTING = "chayen-testing/SKILL.md", t = get(TESTING);
  if (t) {
    const rows = tableRows(section(t, "Verification") ?? "");
    const statuses = new Set(rows.map((r) => r[0]));
    for (const st of ["PASSED", "FAILED", "SKIPPED", "BLOCKED", "NOT_RUN", "UNKNOWN"]) if (!statuses.has(st)) error(id, TESTING, `the status table no longer defines ${st}`);
    const skipped = rows.find((r) => r[0] === "SKIPPED");
    if (skipped && !/\b(?:not|never)\b[^.]{0,20}\bpass/i.test(skipped[1] ?? "")) error(id, TESTING, "the SKIPPED status no longer says that a skip is not a pass");
  } else error(id, TESTING, "authoritative source file is missing");
  const s = get(SUMMARY);
  if (s) {
    const p = norm(section(s, "Procedure") ?? "");
    for (const st of ["PASS", "FAIL", "SKIPPED", "BLOCKED", "NOT_RUN", "UNKNOWN"]) if (!new RegExp(`\\b${st}\\b`).test(p)) error(id, SUMMARY, `the verification step no longer lists ${st}`);
    if (!/never\s+(?:reported|counted|treated)\s+as\s+(?:a\s+)?pass/i.test(p)) error(id, SUMMARY, "the verification step no longer says an unexecuted check is never reported as passing");
  }
  for (const h of contradictions(/\b(?:skip(?:ped|s)?|not[ _]run|unexecuted|not executed|blocked|unknown|missing output)\b[^.;|]{0,40}?\b(?:counts? as|counted as|treat(?:ed)? as|reported as|report(?:ed)? as|marked as|recorded as|is|are|as)\s+(?:an?\s+)?(?:pass(?:ed|es|ing)?|success(?:ful)?|green)\b/i, files)) error(id, h.file, `treats an unexecuted or skipped check as passing: "${h.text}"`);
}

// ---------- GI-06 source-of-truth precedence ----------
{
  const id = "GI-06";
  for (const skill of [...shipped].sort()) {
    const rel = `${skill}/SKILL.md`, principles = section(get(rel), "Principles") ?? "";
    const bullet = units(principles).join(" ").match(/Precedence\.\s[^]*?(?=\s- [A-Z][^.]{0,40}\.\s|$)/);
    if (!bullet) { error(id, rel, 'Principles has no "Precedence." principle'); continue; }
    const b = bullet[0];
    if (!/system and developer instructions and provider permissions\s+take priority/i.test(b)) error(id, rel, "the Precedence principle no longer gives system and developer instructions and provider permissions priority");
    const repo = b.search(/repository/i), generic = b.search(/generic practice/i);
    if (generic >= 0 && repo >= 0 && generic < repo) review(id, rel, "Precedence names generic practice before repository instructions; check the order");
  }
  for (const f of files.filter((x) => /^[^/]+\/SKILL\.md$/.test(x.rel) && !x.rel.startsWith("chayen-init/"))) {
    for (const u of units(f.text)) if (/\.chayen\/profile\.md/.test(u) && !/(?:trust|confirm\w*)[^.]{0,60}\bsource\b|source wins|source\b[^.]{0,40}\bwins?\b/i.test(u)) error(id, f.rel, "reads .chayen/profile.md without saying the source wins when they disagree");
  }
  for (const h of contradictions(/\.chayen\/\S*[^.;]{0,80}\b(?:overrides?|outranks?|takes? precedence over|wins? over)\b[^.;]{0,30}\b(?:source|code)\b/i, files)) error(id, h.file, `lets .chayen/ files override the source: "${h.text}"`);
}

// ---------- GI-07 advisory, not enforcement ----------
{
  const id = "GI-07";
  for (const h of contradictions(/\b(?:this|these)\s+(?:skills?|guidance|recipes?|checklists?|workflows?|templates?|instructions)\s+(?:will\s+|always\s+)?(?:guarantee|enforce|ensure|prevent|block|stop)s?\b/i, files)) error(id, h.file, `claims the guidance itself enforces something: "${h.text}"`);
  for (const h of contradictions(/\b(?:fully|completely|100%|guaranteed)\s+(?:secure|safe|compliant)\b/i, files)) error(id, h.file, `absolute safety claim: "${h.text}"`);
  for (const skill of ["chayen-security", "chayen-data", "chayen-devops", "chayen-architecture", "chayen-ai-engineering"]) {
    const t = get(`${skill}/SKILL.md`);
    if (t && !/\badvisory\b/i.test(t)) error(id, `${skill}/SKILL.md`, "the advisory statement was removed");
  }
}

// ---------- GI-08 ownership and hand-off ----------
{
  const id = "GI-08";
  for (const f of files) {
    for (const m of f.text.matchAll(/(?<![.\w/-])chayen-[a-z0-9]+(?:-[a-z0-9]+)*/g)) if (!shipped.has(m[0])) error(id, f.rel, `names "${m[0]}", which is not a shipped skill`);
    const syntax = /\/(?:codejadee-chayen-framework|chayen):|\$chayen-|\bSkill tool\b/.exec(f.text);
    if (syntax) error(id, f.rel, `uses provider-specific invocation syntax: "${syntax[0]}"`);
  }
  const NON_SKILL = /answer directly|^[—–-]$|not covered|decline|no [\w-]+(?: [\w-]+)? guidance|native|outside/i;
  for (const skill of [...shipped].sort()) {
    const rel = `${skill}/SKILL.md`, rows = tableRows(section(get(rel), "When not to use") ?? "");
    for (const r of rows.slice(1)) {
      const cell = r.at(-1) ?? "", named = [...cell.matchAll(/chayen-[a-z0-9]+(?:-[a-z0-9]+)*/g)].map((m) => m[0]);
      if (named.includes(skill)) error(id, rel, `hands off to itself: "${cell}"`);
      if (!named.length && !NON_SKILL.test(cell)) review(id, rel, `Better fit "${cell}" names no skill and no recognised outcome`);
    }
  }
}

// ---------- GI-09 workflow exit checks and verification ----------
{
  const id = "GI-09";
  for (const f of files.filter((x) => /\/references\/workflow-[^/]+\.md$/.test(x.rel))) {
    const v = norm(section(f.text, "Verification") ?? "");
    if (!/PASS, FAIL, NOT_RUN or N\/A/.test(v)) error(id, f.rel, 'Verification no longer keeps the status vocabulary "PASS, FAIL, NOT_RUN or N/A"');
    if (!/verdict\s*\(?accept, verify_more,? or revise\)?/i.test(v)) error(id, f.rel, "Verification no longer gives each acceptance criterion one verdict (accept, verify_more or revise)");
    for (const r of tableRows(section(f.text, "Stages") ?? "").slice(1)) {
      const exit = r.at(-1) ?? "";
      if (/\b(?:done|complete[sd]?|completion|finished|verified|closed|resolved)\b/i.test(exit) && !/evidence|observed|recorded|executed|explicit|visible|distinct|not_run|accept|only (?:if|with|when)|without execution|separate|remains? open|stays? open/i.test(exit)) review(id, f.rel, `exit check declares completion without an evidence term: "${exit}"`);
    }
  }
}

// ---------- report ----------
findings.sort((a, b) => (a.level === b.level ? 0 : a.level === "ERROR" ? -1 : 1) || a.id.localeCompare(b.id) || a.file.localeCompare(b.file) || a.msg.localeCompare(b.msg));
for (const x of findings) console.log(`${x.level.padEnd(6)} ${x.id} ${NAME[x.id]}: ${x.file}: ${x.msg}`);
for (const inv of spec.invariants) if (!findings.some((x) => x.id === inv.id && x.level === "ERROR")) console.log(`PASS   ${inv.id} ${inv.name}`);
const errors = findings.filter((x) => x.level === "ERROR").length, reviews = findings.length - errors;
console.log(`\n${errors} error(s), ${reviews} review item(s); ${spec.invariants.length} invariants over ${files.length} Markdown files in ${shipped.size} skills; static checks only, agent behaviour NOT_RUN`);
process.exit(errors ? 1 : 0);
