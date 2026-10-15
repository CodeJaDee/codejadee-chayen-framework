#!/usr/bin/env node
// Developer-only static workflow/template coverage checks (V-24). Never shipped.
// Does not execute workflows, agents, approvals, provider calls or application tests.
// Usage: node tools/catalog/check-workflows.mjs [--root <repo>] [--write-doc]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseYamlSubset } from "./catalog-lib.mjs";

const args = process.argv.slice(2);
const root = args.includes("--root") ? path.resolve(args[args.indexOf("--root") + 1]) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = rel => fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n/g, "\n");
const exists = rel => fs.existsSync(path.join(root, rel));
const errors = [];
const error = (check, message) => errors.push(`ERROR ${check}: ${message}`);
const finish = () => { for (const e of errors) console.log(e); console.log(`\n${errors.length} error(s); workflow checks are static, agent/provider behavior NOT_RUN`); process.exit(errors.length ? 1 : 0); };
let catalog, engineering, technology, cases;
try {
  catalog = JSON.parse(read("catalog/composite-workflows.json"));
  engineering = parseYamlSubset(read("catalog/engineering-capabilities.yaml"));
  technology = parseYamlSubset(read("catalog/technology-capabilities.yaml"));
  cases = JSON.parse(read("tests/skills/workflow-cases.json")).cases;
} catch (e) { error("V-24.1 inventory", e.message); finish(); }
const TITLES = ["New feature development", "Bug diagnosis and repair", "Refactoring", "API development and integration", "Database schema migration", "Software testing and regression", "Security review and remediation", "Performance investigation", "Dependency/framework upgrade", "Production incident investigation", "Pull request preparation and review", "Release readiness assessment"];
const TEMPLATE_IDS = ["task-contract", "implementation-plan", "risk-assessment", "verification-report", "change-passport", "context-capsule", "architecture-decision-record"];
const workflows = catalog.workflows ?? [], templates = catalog.templates ?? [];
const caps = new Map(engineering.capabilities.map(c => [c.id, c]));
const skills = new Set(engineering.entry_skills.filter(s => s.mapping === "existing").map(s => s.name));
const packs = new Set(technology.packs.map(p => p.id));
const plugin = catalog.plugin_root;
if (plugin !== engineering.catalog.plugin_root || plugin !== technology.catalog.plugin_root) {
  error("V-24.1 inventory", "plugin root must agree with both capability catalogs"); finish();
}
const sections = text => Object.fromEntries([...text.matchAll(/^## (.+)\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)].map(m => [m[1], m[2]]));
const words = text => text.trim().split(/\s+/).length;
const bodies = new Map();
const counts = new Map(workflows.map(w => [w.id, { positive: 0, negative: 0 }]));
const unique = (items, label, check) => { if (new Set(items).size !== items.length) error(check, `duplicate ${label}`); };
unique(workflows.map(w => w.id), "workflow IDs", "V-24.1 inventory");
unique([...workflows, ...templates].map(w => w.reference), "reference paths", "V-24.1 inventory");
if (workflows.length !== TITLES.length || workflows.some((w, i) => w.title !== TITLES[i] || w.id !== `WF-${String(i + 1).padStart(2, "0")}`))
  error("V-24.1 inventory", "exactly the 12 STEP 29 workflow IDs/titles in order are required");
if (JSON.stringify(templates.map(t => t.id)) !== JSON.stringify(TEMPLATE_IDS))
  error("V-24.1 inventory", "exactly the seven reusable templates in inventory order are required");

function reference(item, kind, check) {
  if (!skills.has(item.owner) || !item.reference?.startsWith(`skills/${item.owner}/references/`) || !item.reference.endsWith(".md") || item.reference.includes("..") || item.reference.includes("\\")) {
    error(check, `${item.id}: invalid owner or packaged reference path`); return "";
  }
  const rel = `${plugin}/${item.reference}`;
  if (!exists(rel)) { error(check, `${item.id}: missing ${rel}`); return ""; }
  const text = read(rel);
  if (!text.startsWith(`---\nkind: ${kind}\n---\n`)) error(check, `${item.id}: expected kind ${kind}`);
  const local = item.reference.replace(`skills/${item.owner}/`, "");
  const entry = `${plugin}/skills/${item.owner}/SKILL.md`;
  if (!exists(entry) || !read(entry).split("\n").some(line => line.startsWith("|") && line.includes(`](${local})`))) error(check, `${item.id}: not in owner References table`);
  return text;
}

const REQUIRED = ["When it applies", "Inputs", "Recipe reuse", "Technology selection", "Stages", "Outputs", "Verification", "Approvals", "Proportionality", "Blockers and handoff"];
for (const w of workflows) {
  const text = reference(w, "checklist", "V-24.2 mapping"); bodies.set(w.id, text);
  if (w.status !== "IMPLEMENTED") error("V-24.1 inventory", `${w.id}: content must be IMPLEMENTED; static checks cannot set VERIFIED`);
  if (!w.capabilities?.length) error("V-24.2 mapping", `${w.id}: existing capability recipes required`);
  for (const id of w.capabilities ?? []) {
    const c = caps.get(id);
    if (!c || !["IMPLEMENTED", "VERIFIED"].includes(c.status) || c.recipe.mapping !== "existing") { error("V-24.2 mapping", `${w.id}: ${id} is not an implemented recipe`); continue; }
    if (!exists(`${plugin}/${c.recipe.path}`) || !read(`${plugin}/${c.recipe.path}`).startsWith("---\nkind: recipe\n")) error("V-24.2 mapping", `${w.id}: ${id} recipe does not resolve`);
    if (!text.includes(path.posix.basename(c.recipe.path)) || !text.includes(c.entry_skill.name)) error("V-24.2 mapping", `${w.id}: ${id} recipe and owner absent from packaged instructions`);
  }
  if (!w.technology_packs?.length || w.technology_packs.some(p => !packs.has(p))) error("V-24.2 mapping", `${w.id}: unknown or missing conditional technology pack`);
  if (!w.templates?.length || w.templates.some(t => !TEMPLATE_IDS.includes(t))) error("V-24.2 mapping", `${w.id}: unknown or missing template`);
  for (const id of w.templates ?? []) {
    const t = templates.find(t => t.id === id);
    if (t && !text.includes(t.title)) error("V-24.2 mapping", `${w.id}: template ${id} absent from Outputs`);
  }
  const parts = sections(text);
  const positions = REQUIRED.map(s => text.indexOf(`\n## ${s}\n`));
  if (positions.some((pos, i) => pos < 0 || (i > 0 && pos <= positions[i - 1]))) error("V-24.3 anatomy", `${w.id}: required workflow sections missing or out of order`);
  for (const s of REQUIRED) if (words(parts[s] ?? "") < 8) error("V-24.3 anatomy", `${w.id}: ${s} must contain substantive instructions`);
  const stages = (parts.Stages ?? "").split("\n").filter(l => l.startsWith("|") && !/^\|[- ]+\|/.test(l)).slice(1);
  if (stages.length < 3 || stages.some(l => l.split("|").slice(1, -1).length !== 4 || l.split("|").slice(1, -1).some(c => !c.trim()))) error("V-24.3 anatomy", `${w.id}: stages require inputs, action and exit check`);
  const normalized = text.replace(/\s+/g, " ");
  for (const phrase of ["No matching workflow => continue normal native behavior", "Approval state starts NOT_PROVIDED", "Never claim that an approval was obtained unless it was actually provided through an authorized process", "PASS, FAIL, NOT_RUN or N/A", "PARTIAL or BLOCKED", "low-risk", "load only"]) {
    if (!normalized.includes(phrase)) error("V-24.3 anatomy", `${w.id}: missing control: ${phrase}`);
  }
}

for (const t of templates) {
  const text = reference(t, "template", "V-24.4 templates");
  const cap = caps.get(t.capability);
  if (!cap || cap.entry_skill.name !== t.owner || !exists(`${plugin}/${cap.recipe.path}`) || !read(`${plugin}/${cap.recipe.path}`).includes(path.posix.basename(t.reference))) error("V-24.4 templates", `${t.id}: owning existing artifact recipe must point to the format by name`);
  const format = /\n## Template\n[\s\S]*?```text\n([\s\S]+?)\n```/.exec(text)?.[1] ?? "";
  if (words(format) < 20) error("V-24.4 templates", `${t.id}: substantive reusable fenced output format required`);
  if (!/approval state: NOT_PROVIDED/i.test(format) || !/approval evidence:/i.test(format)) error("V-24.4 templates", `${t.id}: output must default approval to NOT_PROVIDED and request actual evidence`);
  if (t.id === "verification-report" && !format.includes("NOT_RUN")) error("V-24.4 templates", "verification format must retain unexecuted checks");
  if (/\[[^\]]+\]\([^)]+\)/.test(text)) error("V-24.4 templates", `${t.id}: templates must remain leaves without outbound links`);
  for (const field of ["NOT_PROVIDED", "evidence", "PARTIAL", "NOT_RUN", "authorized process"]) if (!text.includes(field)) error("V-24.4 templates", `${t.id}: missing evidence/approval control ${field}`);
  if (t.id === "architecture-decision-record" && !text.includes("Status: PROPOSED")) error("V-24.4 templates", "ADR cannot default to accepted");
}

const ids = new Set(), templateCases = new Set(); let noMatch = 0;
for (const c of cases ?? []) {
  const check = "V-24.5 cases", e = c.expect ?? {};
  if (!c.id || ids.has(c.id)) error(check, "missing or duplicate evaluation ID"); ids.add(c.id);
  if (typeof c.prompt !== "string" || c.prompt.length < 10 || /chayen/i.test(c.prompt)) error(check, `${c.id}: prompt missing or names the plugin`);
  if (typeof c.context !== "string" || words(c.context) < 5 || !Array.isArray(c.checks) || c.checks.length < 2) error(check, `${c.id}: repository context and observable checks required`);
  if (c.template) {
    const t = templates.find(t => t.id === c.template);
    if (!t || e.skill !== t.owner || e.loads !== t.reference.replace(`skills/${t.owner}/`, "")) error(check, `${c.id}: template mapping mismatch`);
    templateCases.add(c.template); continue;
  }
  if (c.workflow === null) { if (e.workflow !== "none" || c.polarity !== "negative") error(check, `${c.id}: no-match case must expect no workflow`); noMatch++; continue; }
  const w = workflows.find(w => w.id === c.workflow);
  if (!w) { error(check, `${c.id}: unknown workflow`); continue; }
  const local = w.reference.replace(`skills/${w.owner}/`, "");
  if (c.polarity === "positive") {
    if (e.skill !== w.owner || e.loads !== local || e.applies !== w.id) error(check, `${c.id}: positive mapping mismatch`);
    counts.get(w.id).positive++;
  } else if (c.polarity === "negative") {
    if (e.not_applies !== w.id || e.not_loads !== local) error(check, `${c.id}: negative mapping mismatch`);
    counts.get(w.id).negative++;
  } else error(check, `${c.id}: invalid polarity`);
}
for (const w of workflows) if (!counts.get(w.id).positive || !counts.get(w.id).negative) error("V-24.5 cases", `${w.id}: positive and negative cases required`);
for (const t of templates) if (!templateCases.has(t.id)) error("V-24.5 cases", `${t.id}: template evidence/approval case required`);
if (noMatch < 2) error("V-24.5 cases", "at least two normal-native/no-match cases required");

const doc = "docs/chayen/WORKFLOW_COVERAGE.md";
const begin = "<!-- BEGIN GENERATED: check-workflows -->", end = "<!-- END GENERATED: check-workflows -->";
const lines = ["| Workflow | Owner | Packaged reference | Reused capabilities | Cases +/− | Status |", "|---|---|---|---|---|---|"];
for (const w of workflows) lines.push(`| ${w.id} ${w.title} | ${w.owner} | [${path.posix.basename(w.reference)}](../../${plugin}/${w.reference}) | ${(w.capabilities ?? []).join(", ")} | ${counts.get(w.id).positive}/${counts.get(w.id).negative} | ${w.status} |`);
lines.push("", "| Template | Owner | Packaged format | Existing artifact capability |", "|---|---|---|---|");
for (const t of templates) lines.push(`| ${t.title} | ${t.owner} | [${path.posix.basename(t.reference)}](../../${plugin}/${t.reference}) | ${t.capability} |`);
lines.push("", `Totals: ${workflows.length} IMPLEMENTED workflows; ${templates.length} templates; ${cases?.length ?? 0} evaluation specifications; 0 VERIFIED workflows. Agent/provider evaluations NOT_RUN.`);
const block = `${begin}\n${lines.join("\n")}\n${end}`;
if (!exists(doc)) error("V-24.6 coverage", `${doc} missing`);
else {
  const text = read(doc), i = text.indexOf(begin), j = text.indexOf(end);
  if (i < 0 || j < i) error("V-24.6 coverage", "generated markers missing");
  else {
    const next = text.slice(0, i) + block + text.slice(j + end.length);
    if (next !== text) {
      if (args.includes("--write-doc")) fs.writeFileSync(path.join(root, doc), next);
      else error("V-24.6 coverage", "coverage out of sync; run with --write-doc");
    }
  }
}
for (const [id, message] of [["V-24.1 inventory", "12 workflows and seven template identities"], ["V-24.2 mapping", "existing recipes, conditional technology packs and owner-local packaged references"], ["V-24.3 anatomy", "stages, exit checks, approvals, proportionality, no-match and partial completion"], ["V-24.4 templates", "seven reusable leaf formats with evidence and approval defaults"], ["V-24.5 cases", `${cases?.length ?? 0} specifications including positive, negative, no-match and template cases`], ["V-24.6 coverage", "workflow coverage table synchronized"]]) {
  if (!errors.some(e => e.startsWith(`ERROR ${id}:`))) console.log(`PASS  ${id}: ${message}`);
}
finish();
