#!/usr/bin/env node
// Developer-only checker for the technology capability catalog (V-23, D-039).
// Zero dependencies (Node.js >= 18). Never shipped.
//
// Checks catalog/technology-capabilities.yaml against the user's Step 20
// inventory, the shipped technology reference sections, the evaluation cases
// in tests/skills/technology-cases.json, the engineering catalog, and the
// .NET fact-check list. Optionally regenerates the tables in
// docs/chayen/TECHNOLOGY_COVERAGE.md.
//
// Usage:
//   node tools/catalog/check-technology.mjs [--root <repo>] [--write-doc]

import fs from "node:fs";
import path from "node:path";
import { parseYamlSubset } from "./catalog-lib.mjs";

const argv = process.argv.slice(2);
const root = argv.includes("--root") ? path.resolve(argv[argv.indexOf("--root") + 1]) : path.resolve(import.meta.dirname, "..", "..");
const writeDoc = argv.includes("--write-doc");

// The user's Step 20 inventory (2026-10-15), verbatim and in order.
const INVENTORY = {
  "dotnet-aspnetcore": {
    csharp: ["csharp-nullability", "csharp-async-concurrency", "csharp-memory-disposal", "csharp-linq-optimization",
      "csharp-type-design", "csharp-serialization", "csharp-code-analysis", "csharp-project-maintenance"],
    aspnetcore: ["aspnet-api-endpoints", "aspnet-request-pipeline", "aspnet-dependency-injection", "aspnet-validation",
      "aspnet-authentication", "aspnet-authorization", "aspnet-openapi", "aspnet-exception-handling", "aspnet-background-services",
      "aspnet-data-access", "aspnet-efcore-migrations", "aspnet-integration-testing", "aspnet-performance", "aspnet-hosting-deployment"],
  },
};
const FACT_FILES = { "dotnet-aspnetcore": "tests/technology/dotnet/run-fact-checks.mjs" };
const DOC = "docs/chayen/TECHNOLOGY_COVERAGE.md";
const BEGIN = "<!-- BEGIN GENERATED: check-technology -->", END = "<!-- END GENERATED: check-technology -->";

const results = [];
const error = (c, m) => results.push(["ERROR", c, m]);
const pass = (c, m) => results.push(["PASS", c, m]);
const has = (c) => results.some(([l, k]) => l === "ERROR" && k === c);
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n/g, "\n");
const exists = (rel) => fs.existsSync(path.join(root, rel));
const words = (t) => t.replace(/```[\s\S]*?```/g, "").replace(/[|#>*`_-]/g, " ").split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;

let cat = null, eng = null;
try { cat = parseYamlSubset(read("catalog/technology-capabilities.yaml")); }
catch (e) { error("V-23.0 parse", `catalog/technology-capabilities.yaml: ${e.message}`); }
try { eng = parseYamlSubset(read("catalog/engineering-capabilities.yaml")); }
catch (e) { error("V-23.0 parse", `catalog/engineering-capabilities.yaml: ${e.message}`); }
if (!cat || !eng) finish();

const pluginRoot = cat.catalog?.plugin_root ?? "plugins/codejadee-chayen-framework";
const caps = cat.capabilities ?? [];
const packs = new Map((cat.packs ?? []).map((p) => [p.id, p]));
const STATUS = new Set(cat.status_vocabulary ?? []);

{ // V-23.1 inventory: exact names, order, technology, uniqueness, counts
  const c = "V-23.1 inventory";
  for (const [packId, techs] of Object.entries(INVENTORY)) {
    const pack = packs.get(packId);
    if (!pack) { error(c, `pack ${packId} is missing`); continue; }
    const expected = Object.entries(techs).flatMap(([t, names]) => names.map((n) => [t, n]));
    const actual = caps.filter((x) => x.pack === packId);
    if (pack.expected_capabilities !== expected.length) error(c, `${packId}: expected_capabilities ${pack.expected_capabilities} != inventory ${expected.length}`);
    if (actual.length !== expected.length) error(c, `${packId}: ${actual.length} records, inventory has ${expected.length}`);
    expected.forEach(([t, n], i) => {
      const rec = actual[i];
      if (!rec) return;
      if (rec.name !== n) error(c, `${packId} position ${i + 1}: "${rec.name}" but the inventory has "${n}"`);
      else if (rec.technology !== t) error(c, `${n}: technology ${rec.technology}, inventory ${t}`);
    });
    for (const [, n] of expected) if (!actual.some((x) => x.name === n)) error(c, `${packId}: inventory capability ${n} has no record`);
    if (!(eng.stack_packs ?? []).includes(packId)) error(c, `${packId} is not a stack pack in the engineering catalog`);
  }
  const ids = new Set(), names = new Set();
  for (const x of caps) {
    if (ids.has(x.id)) error(c, `duplicate id ${x.id}`); ids.add(x.id);
    if (names.has(x.name)) error(c, `duplicate name ${x.name}`); names.add(x.name);
    if (!packs.has(x.pack)) error(c, `${x.id}: unknown pack ${x.pack}`);
  }
  if (!has(c)) pass(c, `${caps.length} records match the Step 20 inventory exactly (names, order, technology); ids and names unique`);
}

{ // V-23.2 record fields and status
  const c = "V-23.2 records";
  const engIds = new Set((eng.capabilities ?? []).map((x) => x.id));
  for (const x of caps) {
    if (!/^TECH-[A-Z]+-\d{3}$/.test(x.id ?? "")) error(c, `${x.id}: id must match TECH-<TECH>-NNN`);
    for (const f of ["purpose", "applies_when", "not_when", "entry_skill", "reference", "section", "verification", "status"])
      if (typeof x[f] !== "string" || !x[f].trim()) error(c, `${x.id}: ${f} is missing`);
    for (const f of ["inputs", "outputs", "engineering_capabilities", "fact_checks"])
      if (!Array.isArray(x[f]) || !x[f].length) error(c, `${x.id}: ${f} must be a non-empty list`);
    if (words(x.purpose ?? "") < 12) error(c, `${x.id}: purpose is not substantive (< 12 words)`);
    if (!STATUS.has(x.status)) error(c, `${x.id}: status ${x.status} not in the vocabulary`);
    if (["IMPLEMENTED", "VERIFIED"].includes(x.status) && !(typeof x.verification_evidence === "string" && x.verification_evidence.trim())) error(c, `${x.id}: ${x.status} needs verification_evidence`);
    if (x.status === "VERIFIED" && /NOT_RUN/.test(x.verification_evidence ?? "")) error(c, `${x.id}: VERIFIED while its evidence says NOT_RUN`);
    const tech = packs.get(x.pack)?.technologies ?? [];
    if (!tech.includes(x.technology)) error(c, `${x.id}: technology ${x.technology} not in pack ${x.pack}`);
    for (const id of x.engineering_capabilities ?? []) if (!engIds.has(id)) error(c, `${x.id}: engineering capability ${id} does not exist`);
  }
  if (!has(c)) pass(c, `all records carry purpose, applicability, inputs, outputs, mapping, related engineering capabilities, facts, verification, and a valid status`);
}

const sectionOf = (text, heading) => {
  const lines = text.split("\n");
  const i = lines.findIndex((l) => l === `## ${heading}`);
  if (i < 0) return null;
  const j = lines.findIndex((l, k) => k > i && /^## /.test(l));
  return lines.slice(i + 1, j < 0 ? undefined : j).join("\n");
};
const sections = {};

{ // V-23.3 mapping: entry skill, technology reference, References table row
  const c = "V-23.3 mapping";
  for (const x of caps) {
    const skillMd = `${pluginRoot}/skills/${x.entry_skill}/SKILL.md`;
    if (!exists(skillMd)) { error(c, `${x.id}: entry skill ${x.entry_skill} does not exist`); continue; }
    const refRel = `${pluginRoot}/${x.reference}`;
    if (!x.reference?.startsWith(`skills/${x.entry_skill}/references/`)) error(c, `${x.id}: reference ${x.reference} is not inside ${x.entry_skill}/references (D-016)`);
    if (!exists(refRel)) { error(c, `${x.id}: reference ${x.reference} does not exist`); continue; }
    const text = read(refRel);
    if (!/^---\nkind: technology\n---\n/.test(text)) error(c, `${x.id}: ${x.reference} must be a kind: technology reference`);
    const local = x.reference.replace(/^skills\/[^/]+\//, "");
    const row = read(skillMd).split("\n").find((l) => l.startsWith("|") && l.includes(`](${local})`));
    if (!row) error(c, `${x.id}: ${local} is not listed in the ${x.entry_skill} References table`);
    else if (words(row.split("|")[2] ?? "") < 4) error(c, `${x.id}: the References row for ${local} has no specific load condition`);
    sections[x.id] = sectionOf(text, x.section);
  }
  if (!has(c)) pass(c, `every record maps to an existing entry skill and a kind: technology reference listed with a load condition`);
}

{ // V-23.4 section identity: heading present once, suffix matches, no orphan sections
  const c = "V-23.4 sections";
  const names = new Set(caps.map((x) => x.name));
  const seen = {};
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith(".md") ? [path.join(d, e.name)] : []));
  for (const f of walk(path.join(root, pluginRoot, "skills"))) {
    const rel = path.relative(path.join(root, pluginRoot), f).split(path.sep).join("/");
    for (const m of fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n").matchAll(/^## .*\(((?:csharp|aspnet)-[a-z0-9-]+)\)\s*$/gm)) {
      (seen[m[1]] ??= []).push(rel);
      if (!names.has(m[1])) error(c, `${rel}: section for "${m[1]}" has no catalog record (orphan)`);
    }
  }
  for (const x of caps) {
    if (!x.section?.endsWith(`(${x.name})`)) error(c, `${x.id}: section heading must end with "(${x.name})"`);
    if (sections[x.id] === null) error(c, `${x.id}: "## ${x.section}" not found in ${x.reference}`);
    const where = seen[x.name] ?? [];
    if (where.length !== 1) error(c, `${x.id}: ${x.name} has ${where.length} sections (${where.join(", ") || "none"}); exactly one is required`);
    else if (where[0] !== x.reference) error(c, `${x.id}: section is in ${where[0]}, catalog says ${x.reference}`);
  }
  if (!has(c)) pass(c, `each of the ${caps.length} capabilities has exactly one section, in its mapped reference; no orphan sections`);
}

{ // V-23.5 section anatomy and V-23.6 placeholders
  const c = "V-23.5 anatomy", c6 = "V-23.6 placeholders";
  const part = (s, label) => {
    const m = new RegExp(`\\*\\*${label}:\\*\\*([\\s\\S]*?)(?=\\n\\*\\*[A-Z][a-z ]+:\\*\\*|$)`).exec(s);
    return m ? m[1] : null;
  };
  for (const x of caps) {
    const s = sections[x.id];
    if (typeof s !== "string") continue;
    for (const [label, min] of [["Applies when", 8], ["Not when", 6], ["Version notes", 8], ["Verify", 12]]) {
      const p = part(s, label);
      if (p === null) error(c, `${x.id}: missing "**${label}:**"`);
      else if (words(p) < min) error(c, `${x.id}: "**${label}:**" has fewer than ${min} words`);
    }
    const steps = part(s, "Steps");
    if (steps === null) error(c, `${x.id}: missing "**Steps:**"`);
    else {
      const n = (steps.match(/^\d+\.\s+\S/gm) ?? []).length;
      if (n < 4) error(c, `${x.id}: ${n} numbered steps; at least 4 are required`);
      if (words(steps) < 80) error(c, `${x.id}: steps have ${words(steps)} words; at least 80 are required`);
    }
    const verify = part(s, "Verify") ?? "";
    if (!/PASS|FAIL|NOT_RUN|MEASURED/.test(verify)) error(c, `${x.id}: "**Verify:**" must say how results are reported (PASS, FAIL, NOT_RUN, or MEASURED)`);
    const prose = s.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
    if (/\b(?:TODO|TBD|FIXME)\b|lorem ipsum/i.test(prose)) error(c6, `${x.id}: placeholder text in its section`);
  }
  if (!has(c)) pass(c, `every section has Applies when, Not when, Version notes, >=4 steps (>=80 words), and a Verify rule with a reporting status`);
  if (!has(c6)) pass(c6, "no placeholder text in technology capability sections");
}

const caseCount = {};
{ // V-23.7 evaluation cases
  const c = "V-23.7 cases";
  const rel = "tests/skills/technology-cases.json";
  let spec = null;
  try { spec = JSON.parse(read(rel)); } catch (e) { error(c, `${rel}: ${e.message}`); }
  const byName = new Map(caps.map((x) => [x.name, x]));
  const skills = new Set((eng.entry_skills ?? []).filter((s) => s.mapping === "existing").map((s) => s.name));
  const ids = new Set();
  for (const k of spec?.cases ?? []) {
    if (ids.has(k.id)) error(c, `duplicate case id ${k.id}`); ids.add(k.id);
    const x = byName.get(k.capability);
    if (!x) { error(c, `${k.id}: unknown capability ${k.capability}`); continue; }
    if (!k.id?.startsWith(`tc-${x.name}-`)) error(c, `${k.id}: id must start with tc-${x.name}-`);
    if (typeof k.prompt !== "string" || k.prompt.length < 10) error(c, `${k.id}: prompt missing`);
    else if (/chayen/i.test(k.prompt)) error(c, `${k.id}: prompt mentions Chayen (REQ-03)`);
    if (typeof k.context !== "string" || words(k.context) < 4) error(c, `${k.id}: context (the assumed repository) is missing`);
    if (!Array.isArray(k.checks) || !k.checks.length) error(c, `${k.id}: at least one check is required`);
    const e = k.expect ?? {}, local = x.reference.replace(/^skills\/[^/]+\//, "");
    if (k.polarity === "positive") {
      if (e.skill !== x.entry_skill) error(c, `${k.id}: positive case must expect skill ${x.entry_skill}`);
      if (e.loads !== local) error(c, `${k.id}: positive case must expect loads "${local}"`);
      if (e.applies !== x.name) error(c, `${k.id}: positive case must expect applies "${x.name}"`);
    } else if (k.polarity === "negative") {
      if (e.not_applies !== x.name) error(c, `${k.id}: negative case must expect not_applies "${x.name}"`);
      if (e.skill !== undefined && e.skill !== "none" && !skills.has(e.skill)) error(c, `${k.id}: unknown skill ${e.skill}`);
      if (e.not_loads !== undefined && e.not_loads !== local) error(c, `${k.id}: not_loads must be "${local}" when present`);
    } else error(c, `${k.id}: polarity must be positive or negative`);
    const t = (caseCount[x.name] ??= { positive: 0, negative: 0 });
    if (k.polarity in t) t[k.polarity] += 1;
  }
  for (const x of caps) {
    const t = caseCount[x.name] ?? { positive: 0, negative: 0 };
    if (t.positive < 1 || t.negative < 1) error(c, `${x.id} ${x.name}: needs >=1 positive and >=1 negative case, has ${t.positive}/${t.negative}`);
  }
  if (!has(c)) pass(c, `${spec?.cases?.length ?? 0} cases; every technology capability has >=1 positive and >=1 negative case consistent with its mapping`);
}

{ // V-23.8 fact checks: listed IDs exist, and every fact's primary capability lists it
  const c = "V-23.8 facts";
  for (const [packId, rel] of Object.entries(FACT_FILES)) {
    if (!exists(rel)) { error(c, `${packId}: ${rel} is missing`); continue; }
    const facts = new Map([...read(rel).matchAll(/"(TF-\d{2})": \["([a-z0-9-]+)"/g)].map((m) => [m[1], m[2]]));
    const packCaps = caps.filter((x) => x.pack === packId);
    for (const x of packCaps) for (const f of x.fact_checks ?? []) if (!facts.has(f)) error(c, `${x.id}: fact ${f} is not defined in ${rel}`);
    for (const [f, name] of facts) {
      const x = packCaps.find((y) => y.name === name);
      if (!x) error(c, `${rel}: ${f} names unknown capability ${name}`);
      else if (!(x.fact_checks ?? []).includes(f)) error(c, `${x.id}: does not list its fact ${f}`);
    }
    if (!has(c)) pass(c, `${packId}: ${facts.size} framework facts defined; every record's facts exist and every fact is listed by its capability`);
  }
}

// Generated coverage tables
const table = () => {
  const lines = ["| ID | Name | Technology | Entry skill | Reference section | Cases +/− | Facts | Status |", "|---|---|---|---|---|---|---|---|"];
  for (const x of caps) {
    const t = caseCount[x.name] ?? { positive: 0, negative: 0 };
    const local = x.reference.replace(/^skills\/[^/]+\/references\//, "");
    lines.push(`| ${x.id} | \`${x.name}\` | ${x.technology} | ${x.entry_skill} | \`${local}\` § ${x.section.replace(/ \([^)]*\)$/, "")} | ${t.positive}/${t.negative} | ${(x.fact_checks ?? []).join(", ")} | ${x.status} |`);
  }
  const by = (s) => caps.filter((x) => x.status === s).length;
  lines.push("", `Totals: ${caps.length} records; IMPLEMENTED ${by("IMPLEMENTED")}, VERIFIED ${by("VERIFIED")}, IN_PROGRESS ${by("IN_PROGRESS")}, PLANNED ${by("PLANNED")}.`);
  return lines.join("\n");
};
{ // V-23.9 coverage doc in sync
  const c = "V-23.9 coverage-doc";
  const block = `${BEGIN}\n${table()}\n${END}`;
  if (!exists(DOC)) error(c, `${DOC} is missing`);
  else {
    const raw = fs.readFileSync(path.join(root, DOC), "utf8"), crlf = raw.includes("\r\n");
    const text = raw.replace(/\r\n/g, "\n");
    const i = text.indexOf(BEGIN), j = text.indexOf(END);
    if (i < 0 || j < 0) error(c, `${DOC} lacks the generated block markers`);
    else {
      const next = text.slice(0, i) + block + text.slice(j + END.length);
      if (next !== text) {
        if (writeDoc) { fs.writeFileSync(path.join(root, DOC), crlf ? next.replace(/\n/g, "\r\n") : next); pass(c, `${DOC} regenerated`); }
        else error(c, `${DOC} is out of date; run node tools/catalog/check-technology.mjs --write-doc`);
      } else pass(c, `${DOC} tables are in sync`);
    }
  }
}

finish();
function finish() {
  for (const [l, c, m] of results.sort((a, b) => (a[0] === b[0] ? 0 : a[0] === "ERROR" ? -1 : 1))) console.log(`${l.padEnd(5)} ${c}: ${m}`);
  const errors = results.filter((r) => r[0] === "ERROR").length;
  console.log(`\n${errors} error(s); ${cat?.capabilities?.length ?? 0} technology capabilities, root=${root}`);
  process.exit(errors ? 1 : 0);
}
