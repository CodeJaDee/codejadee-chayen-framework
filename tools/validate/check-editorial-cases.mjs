#!/usr/bin/env node
// Developer-only static check (Steps 37-38): editorial pattern inventories and behavior case
// specifications for the Thai and English Humanizer skills. Read-only; no provider, model or
// network use. It validates structure and fixture integrity only. Behavior results stay
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

const PARTS = ["- **Signals:**", "- **Why:**", "- **Not a tell when:**", "- **Before", "- **After", "- **Preserve:**"];
const MODES = new Set(["audit", "rewrite", "create", "website", "none"]);
const base = (skill) => `plugins/codejadee-chayen-framework/skills/${skill}`;
const SKILLS = [
  {
    skill: "chayen-humanizer-th", prefix: "TH", count: 14, other: "chayen-humanizer-en",
    refs: ["patterns-language.md", "patterns-content.md"],
    cases: "tests/editorial/humanizer-th-cases.json", idRe: /^th-[a-z0-9-]+$/,
    min: { "positive": 14, "false-positive": 14, "semantic-preservation": 4, "mixed-language": 3, "website": 4, "audit-only": 2, "security": 3, "negative": 3 },
  },
  {
    skill: "chayen-humanizer-en", prefix: "EN", count: 26, other: "chayen-humanizer-th",
    refs: ["patterns-staging-and-rhythm.md", "patterns-inflation-and-claims.md", "patterns-format-and-reader.md"],
    cases: "tests/editorial/humanizer-en-cases.json", idRe: /^en-[a-z0-9-]+$/,
    min: { "positive": 26, "false-positive": 26, "natural-unchanged": 6, "semantic-preservation": 6, "technical-terms": 5, "us-uk": 4, "website": 6, "audit-only": 3, "creation": 3, "security": 4, "negative": 5 },
    textTypes: ["marketing", "technical-docs", "readme", "developer-blog", "dev-communication", "landing-page", "ui-microcopy", "article"], textTypeMin: 2,
  },
];

const summary = [];
for (const cfg of SKILLS) {
  const where = (code) => `${code} [${cfg.prefix}]`;
  const PATTERNS = Array.from({ length: cfg.count }, (_, n) => `${cfg.prefix}-${String(n + 1).padStart(2, "0")}`);
  const header = new RegExp(`^(${cfg.prefix}-\\d{2}) `);

  // E-01 pattern inventory: exactly PREFIX-01..N, in order, each with all required parts
  const found = [];
  for (const file of cfg.refs) {
    const rel = `${base(cfg.skill)}/references/${file}`;
    if (!fs.existsSync(inside(root, rel))) { err(`${where("E-01")}: missing reference ${file}`); continue; }
    for (const s of read(rel).split(/^## /m).slice(1)) {
      const id = header.exec(s)?.[1];
      if (!id) continue;
      found.push(id);
      for (const part of PARTS) if (!s.includes(part)) err(`${where("E-01")} ${id}: missing "${part}" in ${file}`);
    }
  }
  if (JSON.stringify(found) !== JSON.stringify(PATTERNS)) err(`${where("E-01")} pattern inventory ${JSON.stringify(found)} is not exactly ${PATTERNS[0]}..${PATTERNS.at(-1)} in order`);

  // E-02 case schema and fixture integrity
  let spec;
  try { spec = JSON.parse(read(cfg.cases)); }
  catch { err(`${where("E-02")} ${cfg.cases} is missing or not valid JSON`); }
  const counts = {}, flagged = new Set(), cleared = new Set(), ids = new Set(), types = {};
  if (spec) {
    if (spec.skill !== cfg.skill) err(`${where("E-02")} skill must be ${cfg.skill}`);
    for (const c of spec.cases ?? []) {
      const at = `${where("E-02")} ${c.id ?? "(no id)"}`;
      if (typeof c.id !== "string" || !cfg.idRe.test(c.id)) err(`${at}: id must match ${cfg.idRe}`);
      if (ids.has(c.id)) err(`${at}: duplicate id`); ids.add(c.id);
      if (!(c.category in cfg.min)) err(`${at}: unknown category ${c.category}`);
      counts[c.category] = (counts[c.category] ?? 0) + 1;
      if (!MODES.has(c.mode)) err(`${at}: unknown mode ${c.mode}`);
      if (c.textType !== undefined) {
        if (!cfg.textTypes?.includes(c.textType)) err(`${at}: unknown textType ${c.textType}`);
        else if (c.category === "positive") types[c.textType] = (types[c.textType] ?? 0) + 1;
      }
      for (const k of ["request", "input"]) {
        if (typeof c[k] !== "string" || !c[k].trim()) err(`${at}: ${k} must be a non-empty string`);
        else if (/chayen/i.test(c[k])) err(`${at}: ${k} mentions the plugin (REQ-03)`);
      }
      const e = c.expect ?? {};
      if (typeof e.applies !== "boolean") err(`${at}: expect.applies must be true or false`);
      if (!Array.isArray(e.checks) || !e.checks.length || e.checks.some((x) => typeof x !== "string" || !x.trim())) err(`${at}: expect.checks needs at least one observable assertion`);
      for (const id of [...(e.flag ?? []), ...(e.not_flag ?? [])]) if (!PATTERNS.includes(id)) err(`${at}: unknown pattern ${id}`);
      if (c.category === "positive") for (const id of e.flag ?? []) flagged.add(id);
      if (c.category === "false-positive") for (const id of e.not_flag ?? []) cleared.add(id);
      for (const s of e.preserve ?? []) if (typeof c.input === "string" && !c.input.includes(s)) err(`${at}: preserved span ${JSON.stringify(s)} does not occur in the input`);
      if (c.category === "positive" && !(e.flag ?? []).length) err(`${at}: positive cases name the patterns they expect`);
      if (c.category === "false-positive" && !(e.not_flag ?? []).length) err(`${at}: false-positive cases name the patterns that must not fire`);
      if (c.category === "audit-only" && e.no_edit !== true) err(`${at}: audit-only cases expect no_edit`);
      if (c.category === "negative" && e.applies !== false) err(`${at}: negative cases expect applies false`);
      if (c.category === "security" && !(e.no_action ?? []).length) err(`${at}: security cases name the actions that must not happen`);
      if (c.category === "natural-unchanged" && e.unchanged !== true) err(`${at}: natural-unchanged cases expect unchanged`);
    }
    for (const [cat, min] of Object.entries(cfg.min)) if ((counts[cat] ?? 0) < min) err(`${where("E-03")} ${cat}: ${counts[cat] ?? 0} case(s) < ${min}`);
    for (const id of PATTERNS) {
      if (!flagged.has(id)) err(`${where("E-03")} ${id}: no positive case expects it`);
      if (!cleared.has(id)) err(`${where("E-03")} ${id}: no false-positive case guards it`);
    }
    for (const t of cfg.textTypes ?? []) if ((types[t] ?? 0) < cfg.textTypeMin) err(`${where("E-03")} text type ${t}: ${types[t] ?? 0} positive case(s) < ${cfg.textTypeMin}`);
  }

  // E-04 independence: neither editorial skill names the other, so neither depends on loading it
  const dir = inside(root, base(cfg.skill));
  if (fs.existsSync(dir)) {
    const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
    for (const file of walk(dir).filter((f) => f.endsWith(".md"))) {
      if (fs.readFileSync(file, "utf8").includes(cfg.other)) err(`${where("E-04")}: ${path.relative(root, file).split(path.sep).join("/")} names ${cfg.other}; editorial skills must stay independent`);
    }
  }

  const mix = Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(", ");
  summary.push({ skill: cfg.skill, patterns: found.length, cases: spec?.cases?.length ?? 0 });
  console.log(`${errors.some((x) => x.includes(`[${cfg.prefix}]`)) ? "FAIL" : "PASS"} ${cfg.skill}: ${found.length} patterns with all required parts; ${spec?.cases?.length ?? 0} case specifications (${mix}); independent of the other editorial skill`);
}

for (const e of errors) console.log(`ERROR ${e}`);
const totalCases = summary.reduce((n, s) => n + s.cases, 0), totalPatterns = summary.reduce((n, s) => n + s.patterns, 0);
console.log(`${errors.length ? "FAIL" : "PASS"} editorial cases: ${summary.length} skills, ${totalPatterns} patterns, ${totalCases} case specifications; behavior NOT_RUN`);
process.exit(errors.length ? 1 : 0);
