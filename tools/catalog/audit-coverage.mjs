#!/usr/bin/env node
// Developer-only engineering coverage audit (Step 19). Not shipped with the plugin.
// For every catalog capability it checks ten criteria against the files on disk:
//   C1 exists in the catalog with the exact inventory name   C6 positive recipe case, consistent with the mapping
//   C2 valid implementation mapping                           C7 negative recipe case, consistent with the mapping
//   C3 substantive procedure covering the capability          C8 input and output guidance
//   C4 applicable entry skill that routes to the recipe       C9 safety and verification rules
//   C5 working reference paths                                C10 not a placeholder
// It also reports duplicate names, broken mappings, orphan recipes, and description-level routing risks.
//
// Usage: node tools/catalog/audit-coverage.mjs [--json] [--markdown]   (exit 1 if any capability fails a criterion)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseYamlSubset } from "./catalog-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const PLUGIN = path.join(root, "plugins/codejadee-chayen-framework");
const read = (p) => fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");

// ---------- inputs ----------
const cat = parseYamlSubset(read(path.join(root, "catalog/engineering-capabilities.yaml")));
const caps = cat.capabilities;
const invText = /const INVENTORY_TEXT = `([\s\S]*?)`;/.exec(read(path.join(root, "tools/catalog/check-catalog.mjs")))[1];
const inventory = []; // [{domain, name}]
let dom = null;
for (const raw of invText.split("\n")) {
  const line = raw.trim();
  let m;
  if (!line || /^TOTAL EXPECTED/.test(line)) continue;
  if ((m = /^(\d{2}) [A-Z-]+ \(\d+\)$/.exec(line))) { dom = `D${m[1]}`; continue; }
  inventory.push({ domain: dom, name: line });
}
const recipeCases = JSON.parse(read(path.join(root, "tests/skills/recipe-cases.json"))).cases;
const triggerCases = JSON.parse(read(path.join(root, "tests/skills/trigger-cases.json"))).cases;

const stripCode = (t) => t.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
const frontmatter = (t) => { const m = /^---\n([\s\S]*?)\n---\n/.exec(t); return m ? m[1] : ""; };
const h2 = (t) => { const out = {}; let cur = null; for (const l of t.split("\n")) { const m = /^## (.+?)\s*$/.exec(l); if (m) { cur = m[1]; out[cur] = []; } else if (cur) out[cur].push(l); } for (const k in out) out[k] = out[k].join("\n"); return out; };
const words = (t) => stripCode(t).split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
const STOP = new Set("about after again against their there these those which while where with within without would could should other under above below between into from that this have will been being each every than then them they your what when only also such some more most must less very same both into upon over just made make using used uses the and for are not but any all per its via can".split(" "));
const keyTerms = (texts) => [...new Set(texts.join(" ").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w.length >= 5 && !STOP.has(w)))];

const skills = {};
for (const d of fs.readdirSync(path.join(PLUGIN, "skills"), { withFileTypes: true })) {
  const f = path.join(PLUGIN, "skills", d.name, "SKILL.md");
  if (!d.isDirectory() || !fs.existsSync(f)) continue;
  const text = read(f);
  const desc = /^description: (.*)$/m.exec(frontmatter(text))?.[1] ?? "";
  skills[d.name] = { text, desc, sections: h2(text) };
}

// ---------- per-capability checks ----------
const results = [];
const brokenMappings = [];
const recipeUse = new Map();
const idCount = new Map(), nameCount = new Map();
for (const c of caps) { idCount.set(c.id, (idCount.get(c.id) ?? 0) + 1); nameCount.set(c.name, (nameCount.get(c.name) ?? 0) + 1); }

caps.forEach((c, i) => {
  const r = { id: c.id, name: c.name, domain: c.domain, skill: c.entry_skill?.name, recipe: c.recipe?.path?.replace(/^skills\/[^/]+\/references\//, ""), status: c.status, checks: {}, notes: [] };
  const fail = (k, note) => { r.checks[k] = false; r.notes.push(`${k}: ${note}`); };
  const pass = (k) => { if (r.checks[k] !== false) r.checks[k] = true; };

  // C1 exists, exact inventory name, unique
  const inv = inventory[i];
  if (!inv || inv.name !== c.name || inv.domain !== c.domain) fail("C1", `inventory position ${i + 1} expects ${inv?.domain} ${inv?.name}`);
  if (idCount.get(c.id) > 1 || nameCount.get(c.name) > 1) fail("C1", "duplicate id or name");
  pass("C1");

  // C2 mapping
  const recipeRel = c.recipe?.path ?? "";
  const recipeAbs = path.join(PLUGIN, recipeRel);
  const skillName = c.entry_skill?.name;
  const recipeText = fs.existsSync(recipeAbs) ? read(recipeAbs) : "";
  if (c.entry_skill?.mapping !== "existing" || !skills[skillName]) fail("C2", `entry skill ${skillName} (${c.entry_skill?.mapping}) not shipped`);
  if (c.recipe?.mapping !== "existing" || !recipeText) fail("C2", `recipe ${recipeRel} (${c.recipe?.mapping}) missing`);
  if (!recipeRel.startsWith(`skills/${skillName}/references/`)) fail("C2", "recipe outside entry skill");
  const fmCaps = /capabilities: \[([^\]]*)\]/.exec(frontmatter(recipeText))?.[1].split(",").map((s) => s.trim()) ?? [];
  if (!fmCaps.includes(c.id)) fail("C2", "recipe frontmatter does not list the capability");
  if (!["IMPLEMENTED", "VERIFIED"].includes(c.status) || !c.verification_evidence) fail("C2", `status ${c.status} without evidence`);
  pass("C2");
  if (r.checks.C2 === false) brokenMappings.push(`${c.id}: ${r.notes.filter((n) => n.startsWith("C2")).join("; ")}`);
  recipeUse.set(recipeRel, [...(recipeUse.get(recipeRel) ?? []), c.id]);

  const sec = h2(recipeText.replace(/^---\n[\s\S]*?\n---\n/, ""));
  const body = recipeText.replace(/^---\n[\s\S]*?\n---\n/, "");

  // C3 substantive procedure covering this capability
  const proc = sec["Procedure"] ?? "";
  const steps = (proc.match(/^\s*\d+\.\s+\S/gm) ?? []).length;
  if (steps < 3 || words(proc) < 80) fail("C3", `procedure too thin (${steps} steps, ${words(proc)} words)`);
  const sectioned = body.includes(`(${c.id})`) || body.includes(c.id);
  const terms = keyTerms([...(c.outputs ?? []), c.purpose ?? ""]);
  const lower = stripCode(body).toLowerCase() + " " + body.toLowerCase();
  const hit = terms.filter((t) => lower.includes(t.slice(0, Math.max(5, t.length - 2))));
  const coverage = terms.length ? hit.length / terms.length : 1;
  r.coverage = Math.round(coverage * 100);
  r.missingTerms = terms.filter((t) => !hit.includes(t));
  r.sectioned = fmCaps.length === 1 ? "single" : sectioned ? "section" : "shared";
  if (coverage < 0.5) fail("C3", `only ${r.coverage}% of the record's purpose and output terms appear in the recipe`);
  pass("C3");

  // C4 entry skill routes to the recipe
  const sk = skills[skillName];
  const refsTable = sk?.sections["References"] ?? "";
  const base = path.basename(recipeRel);
  const refRow = refsTable.split("\n").find((l) => l.includes(`(references/${base})`));
  if (!refRow) fail("C4", "recipe not listed in the skill's References table");
  else if (words(refRow.split("|").slice(2).join(" ")) < 3) fail("C4", "References row has no load condition");
  if (!sk?.desc || !/\bNot (for|a)\b/.test(sk.desc)) fail("C4", "skill description lacks a boundary clause");
  pass("C4");

  // C5 working reference paths
  for (const p of c.existing_coverage ?? []) if (!fs.existsSync(path.join(PLUGIN, p))) fail("C5", `existing_coverage path missing: ${p}`);
  for (const m of stripCode(body).matchAll(/\]\(([^)#\s]+)(#[^)]*)?\)/g)) {
    if (/^https?:/.test(m[1])) continue;
    if (!fs.existsSync(path.join(path.dirname(recipeAbs), m[1]))) fail("C5", `broken link ${m[1]}`);
  }
  pass("C5");

  // C6 / C7 recipe cases consistent with the mapping
  const mine = recipeCases.filter((k) => k.capability === c.id);
  const pos = mine.filter((k) => k.polarity === "positive"), neg = mine.filter((k) => k.polarity === "negative");
  r.pos = pos.length; r.neg = neg.length;
  if (!pos.length) fail("C6", "no positive recipe case");
  for (const k of pos) {
    if (k.expect.skill !== skillName || k.expect.loads !== `references/${base}`) { fail("C6", `${k.id} expects ${k.expect.skill} ${k.expect.loads}`); brokenMappings.push(`${k.id}: positive case expects ${k.expect.skill} ${k.expect.loads}, catalog maps ${skillName} references/${base}`); }
    if (!k.checks?.length) fail("C6", `${k.id} has no checks`);
  }
  pass("C6");
  if (!neg.length) fail("C7", "no negative recipe case");
  for (const k of neg) {
    if (k.expect.not_loads !== `references/${base}`) { fail("C7", `${k.id} not_loads ${k.expect.not_loads}`); brokenMappings.push(`${k.id}: negative case not_loads ${k.expect.not_loads}, catalog maps references/${base}`); }
    if (!k.expect.skill) fail("C7", `${k.id} has no better-fit skill`);
  }
  pass("C7");

  // C8 input and output guidance
  if (!(c.inputs?.length) || !(c.outputs?.length)) fail("C8", "record lacks inputs or outputs");
  if (words(sec["Inputs"] ?? "") < 15) fail("C8", "recipe Inputs too thin");
  if (words(sec["Outputs"] ?? "") < 12) fail("C8", "recipe Outputs too thin");
  pass("C8");

  // C9 safety and verification rules
  const ver = sec["Verification"] ?? "";
  const bullets = (ver.match(/^- /gm) ?? []).length;
  if (bullets < 2 || words(ver) < 25) fail("C9", `Verification too thin (${bullets} bullets, ${words(ver)} words)`);
  if (!/NOT_RUN|PASS|FAIL|BLOCKED|UNKNOWN|approv|test|shown|flagged|reported|cites?|labelled|measured|recorded/i.test(ver)) fail("C9", "Verification states no observable check");
  if (words(sk?.sections["Safety boundaries"] ?? "") < 40) fail("C9", "entry skill safety boundaries too thin");
  if (!c.verification) fail("C9", "record has no verification approach");
  pass("C9");

  // C10 not a placeholder
  if (/\b(TODO|TBD|FIXME|lorem ipsum|placeholder text)\b/i.test(stripCode(body))) fail("C10", "placeholder marker in recipe prose");
  const nonEmpty = body.split("\n").filter((l) => l.trim()).length;
  if (nonEmpty < 35) fail("C10", `recipe has only ${nonEmpty} non-empty lines`);
  for (const s of ["Inputs", "Procedure", "Outputs", "Technology considerations", "Verification"]) if (words(sec[s] ?? "") < 12) fail("C10", `section ${s} under 12 words`);
  pass("C10");

  r.ok = Object.values(r.checks).every(Boolean);
  results.push(r);
});

// ---------- global checks ----------
const names = caps.map((c) => c.name);
const dupNames = [...nameCount].filter(([, n]) => n > 1).map(([k]) => k);
const dupIds = [...idCount].filter(([, n]) => n > 1).map(([k]) => k);
const invNames = inventory.map((x) => x.name);
const missingFromCatalog = invNames.filter((n) => !names.includes(n));
const extraInCatalog = names.filter((n) => !invNames.includes(n));
// Orphan recipe files: recipes on disk that no capability maps to
const recipeFiles = [];
for (const s of Object.keys(skills)) {
  const dir = path.join(PLUGIN, "skills", s, "references");
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    const t = read(path.join(dir, f));
    if (/^kind: recipe$/m.test(frontmatter(t))) recipeFiles.push(`skills/${s}/references/${f}`);
  }
}
const orphanRecipes = recipeFiles.filter((p) => !recipeUse.has(p));
// Description-level routing risk: shared salient terms across skill descriptions
const SALIENT = ["review", "performance", "migration", "migrations", "tests", "testing", "dockerfile", "permissions", "push", "observability", "pipelines", "security", "api", "endpoints", "data", "evaluation", "release", "documentation", "docs", "git", "infrastructure", "kubernetes", "terraform", "caching", "offline", "dependency", "upgrades", "refactor", "refactors", "architecture", "schema", "query", "retention", "skills", "agent", "llm"];
const termSkills = {};
for (const [s, k] of Object.entries(skills)) {
  const d = k.desc.toLowerCase();
  for (const t of SALIENT) if (new RegExp(`\\b${t}\\b`).test(d)) (termSkills[t] ??= []).push(s);
}
const sharedTerms = Object.entries(termSkills).filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length);
const triggerSummary = triggerCases.reduce((m, k) => ((m[k.category] = (m[k.category] ?? 0) + 1), m), {});

const failed = results.filter((r) => !r.ok);
const summary = {
  expected: inventory.length,
  catalogRecords: caps.length,
  uniqueIds: idCount.size,
  uniqueNames: nameCount.size,
  namesMatchInventory: missingFromCatalog.length === 0 && extraInCatalog.length === 0 && results.every((r) => r.checks.C1),
  implemented: caps.filter((c) => ["IMPLEMENTED", "VERIFIED"].includes(c.status)).length,
  verified: caps.filter((c) => c.status === "VERIFIED").length,
  passingAllCriteria: results.length - failed.length,
  failing: failed.map((r) => ({ id: r.id, notes: r.notes })),
  perCriterionFailures: Object.fromEntries(["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10"].map((k) => [k, results.filter((r) => r.checks[k] === false).length])),
  dupNames, dupIds, missingFromCatalog, extraInCatalog, orphanRecipes,
  brokenMappings,
  sharedRecipeUnsectioned: results.filter((r) => r.sectioned === "shared").map((r) => `${r.id} (${r.recipe}, ${r.coverage}%)`),
  lowestCoverage: [...results].sort((a, b) => a.coverage - b.coverage).slice(0, 10).map((r) => `${r.id} ${r.coverage}% (missing: ${r.missingTerms.join(" ")})`),
  recipeFiles: recipeFiles.length,
  recipeCases: recipeCases.length,
  triggerCases: triggerSummary,
  sharedDescriptionTerms: sharedTerms.map(([t, v]) => `${t}: ${v.join(", ")}`),
};

if (args.includes("--json")) console.log(JSON.stringify({ summary, results }, null, 2));
else if (args.includes("--markdown")) {
  const domains = [...new Set(results.map((r) => r.domain))];
  console.log("| Domain | Capabilities | Implemented | Verified | All 10 criteria pass |\n|---|---|---|---|---|");
  for (const d of domains) {
    const rs = results.filter((r) => r.domain === d);
    console.log(`| ${d} | ${rs.length} | ${rs.filter((r) => ["IMPLEMENTED", "VERIFIED"].includes(r.status)).length} | ${rs.filter((r) => r.status === "VERIFIED").length} | ${rs.filter((r) => r.ok).length} |`);
  }
  console.log("\n| ID | Name | Entry skill | Recipe | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | C9 | C10 | Cases +/− | Term coverage | Result |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|");
  const mark = (v) => (v ? "✓" : "✗");
  for (const r of results) console.log(`| ${r.id} | ${r.name} | ${r.skill} | ${r.recipe} | ${["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10"].map((k) => mark(r.checks[k])).join(" | ")} | ${r.pos}/${r.neg} | ${r.coverage}% | ${r.ok ? "PASS" : "FAIL"} |`);
} else {
  console.log(`Expected ${summary.expected}; catalog records ${summary.catalogRecords}; unique ids ${summary.uniqueIds}; unique names ${summary.uniqueNames}; names match inventory: ${summary.namesMatchInventory}`);
  console.log(`Implemented ${summary.implemented}; verified ${summary.verified}; passing all 10 criteria ${summary.passingAllCriteria}/${summary.catalogRecords}`);
  console.log(`Per-criterion failures: ${JSON.stringify(summary.perCriterionFailures)}`);
  console.log(`Duplicate names: ${dupNames.length}; duplicate ids: ${dupIds.length}; missing: ${missingFromCatalog.length}; extra: ${extraInCatalog.length}; orphan recipes: ${orphanRecipes.length}; broken mappings: ${brokenMappings.length}`);
  for (const f of failed) console.log(`FAIL ${f.id}: ${f.notes.join(" | ")}`);
  for (const b of brokenMappings) console.log(`BROKEN ${b}`);
  for (const o of orphanRecipes) console.log(`ORPHAN ${o}`);
  console.log(`Shared-recipe capabilities without an ID-labelled section: ${summary.sharedRecipeUnsectioned.length}`);
  console.log(`Lowest term coverage: ${summary.lowestCoverage.join(", ")}`);
  console.log(`Shared description terms: ${summary.sharedDescriptionTerms.join("; ")}`);
}
process.exit(failed.length || brokenMappings.length || dupNames.length || dupIds.length || missingFromCatalog.length ? 1 : 0);
