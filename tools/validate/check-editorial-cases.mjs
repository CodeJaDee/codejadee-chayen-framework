#!/usr/bin/env node
// Developer-only static check (Step 37): Thai editorial pattern inventory and
// behavior case specifications. Read-only; no provider, model or network use.
// It validates structure and fixture integrity only. Behavior results stay
// NOT_RUN until an authorized evaluation grades real transcripts.
// Zero dependencies (Node.js >= 20.11, for import.meta.dirname). Never shipped.
//
// Usage: node tools/validate/check-editorial-cases.mjs [--root <repo>]

import fs from "node:fs";
import path from "node:path";
import { inside } from "./safe-paths.mjs";

const i = process.argv.indexOf("--root");
const root = path.resolve(i > -1 ? process.argv[i + 1] : path.join(import.meta.dirname, "..", ".."));
const read = (rel) => fs.readFileSync(inside(root, rel), "utf8").replace(/\r\n/g, "\n");
const errors = [];
const err = (msg) => errors.push(msg);

const SKILL = "chayen-humanizer-th";
const REFS = ["patterns-language.md", "patterns-content.md"].map((f) => `plugins/codejadee-chayen-framework/skills/${SKILL}/references/${f}`);
const PATTERNS = Array.from({ length: 14 }, (_, n) => `TH-${String(n + 1).padStart(2, "0")}`);
const PARTS = ["- **Signals:**", "- **Why:**", "- **Not a tell when:**", "- **Before", "- **After", "- **Preserve:**"];
const MIN = { "positive": 14, "false-positive": 14, "semantic-preservation": 4, "mixed-language": 3, "website": 4, "audit-only": 2, "security": 3, "negative": 3 };
const MODES = new Set(["audit", "rewrite", "create", "website", "none"]);

// E-01 pattern inventory: exactly TH-01..TH-14, in order, each with all required parts
const found = [];
for (const rel of REFS) {
  const sections = read(rel).split(/^## /m).slice(1);
  for (const s of sections) {
    const id = /^(TH-\d{2}) /.exec(s)?.[1];
    if (!id) continue;
    found.push(id);
    for (const part of PARTS) if (!s.includes(part)) err(`E-01 ${id}: missing "${part}" in ${path.basename(rel)}`);
  }
}
if (JSON.stringify(found) !== JSON.stringify(PATTERNS)) err(`E-01 pattern inventory ${JSON.stringify(found)} is not exactly TH-01..TH-14 in order`);

// E-02 case schema and fixture integrity
let spec;
try { spec = JSON.parse(read("tests/editorial/humanizer-th-cases.json")); }
catch { err("E-02 tests/editorial/humanizer-th-cases.json is missing or not valid JSON"); }
const counts = {}, flagged = new Set(), cleared = new Set(), ids = new Set();
if (spec) {
  if (spec.skill !== SKILL) err(`E-02 skill must be ${SKILL}`);
  for (const c of spec.cases ?? []) {
    const where = `E-02 ${c.id ?? "(no id)"}`;
    if (typeof c.id !== "string" || !/^th-[a-z0-9-]+$/.test(c.id)) err(`${where}: id must match th-<kebab-case>`);
    if (ids.has(c.id)) err(`${where}: duplicate id`); ids.add(c.id);
    if (!(c.category in MIN)) err(`${where}: unknown category ${c.category}`);
    counts[c.category] = (counts[c.category] ?? 0) + 1;
    if (!MODES.has(c.mode)) err(`${where}: unknown mode ${c.mode}`);
    for (const k of ["request", "input"]) {
      if (typeof c[k] !== "string" || !c[k].trim()) err(`${where}: ${k} must be a non-empty string`);
      else if (/chayen/i.test(c[k])) err(`${where}: ${k} mentions the plugin (REQ-03)`);
    }
    const e = c.expect ?? {};
    if (typeof e.applies !== "boolean") err(`${where}: expect.applies must be true or false`);
    if (!Array.isArray(e.checks) || !e.checks.length || e.checks.some((x) => typeof x !== "string" || !x.trim())) err(`${where}: expect.checks needs at least one observable assertion`);
    for (const id of [...(e.flag ?? []), ...(e.not_flag ?? [])]) if (!PATTERNS.includes(id)) err(`${where}: unknown pattern ${id}`);
    for (const id of e.flag ?? []) if (c.category === "positive") flagged.add(id);
    for (const id of e.not_flag ?? []) if (c.category === "false-positive") cleared.add(id);
    for (const s of e.preserve ?? []) if (typeof c.input === "string" && !c.input.includes(s)) err(`${where}: preserved span ${JSON.stringify(s)} does not occur in the input`);
    if (c.category === "positive" && !(e.flag ?? []).length) err(`${where}: positive cases name the patterns they expect`);
    if (c.category === "false-positive" && !(e.not_flag ?? []).length) err(`${where}: false-positive cases name the patterns that must not fire`);
    if (c.category === "audit-only" && e.no_edit !== true) err(`${where}: audit-only cases expect no_edit`);
    if (c.category === "negative" && e.applies !== false) err(`${where}: negative cases expect applies false`);
    if (c.category === "security" && !(e.no_action ?? []).length) err(`${where}: security cases name the actions that must not happen`);
  }
  for (const [cat, min] of Object.entries(MIN)) if ((counts[cat] ?? 0) < min) err(`E-03 ${cat}: ${counts[cat] ?? 0} case(s) < ${min}`);
  for (const id of PATTERNS) {
    if (!flagged.has(id)) err(`E-03 ${id}: no positive case expects it`);
    if (!cleared.has(id)) err(`E-03 ${id}: no false-positive case guards it`);
  }
}

for (const e of errors) console.log(`ERROR ${e}`);
const total = spec?.cases?.length ?? 0;
console.log(`${errors.length ? "FAIL" : "PASS"} editorial cases: ${found.length} patterns with all required parts; ${total} case specifications (${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(", ")}); behavior NOT_RUN`);
process.exit(errors.length ? 1 : 0);
