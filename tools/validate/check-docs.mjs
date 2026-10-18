#!/usr/bin/env node
// Developer-only documentation check (STEP 33). Offline and read-only; never shipped.
// Checks the user and release documentation:
//   D-01 every relative Markdown link resolves to an existing file inside the repository
//   D-02 every #anchor (same file or other Markdown file) matches a GitHub-style heading slug
//   D-03 every <plugin>@<marketplace> identifier equals the manifest name and marketplace names
//   D-04 every chayen-* skill name is a real skill directory
//   D-05 version strings X.Y.Z-dev / X.Y.Z near "version" match the manifests' version or a
//        documented proposal (docs/distribution/*, CHANGELOG.md)
//   D-06 current build facts match canonical package counts, identity and L0;
//        historical evidence is explicitly delimited rather than rewritten.
// External http(s) links are listed, not fetched.
// Zero dependencies (Node.js >= 20.11, for import.meta.dirname).
//
// Usage: node tools/validate/check-docs.mjs [--root <repo>] [--list-external]

import fs from "node:fs";
import path from "node:path";
import { L0_BUDGET } from "../catalog/skill-registration.mjs";
import { assertTreeNoLinks } from "./safe-paths.mjs";

const i = process.argv.indexOf("--root");
const root = path.resolve(i > -1 ? process.argv[i + 1] : path.join(import.meta.dirname, "..", ".."));
const rel = (p) => path.relative(root, p).replace(/\\/g, "/");
const errors = [], external = new Set();
const err = (id, file, msg) => errors.push(`ERROR ${id} ${rel(file)}: ${msg}`);

const docs = ["README.md", "SECURITY.md", "CHANGELOG.md"].map((f) => path.join(root, f)).filter((f) => fs.existsSync(f));
for (const dir of ["docs", "docs/distribution"]) {
  const d = path.join(root, dir);
  if (fs.existsSync(d)) for (const f of fs.readdirSync(d)) if (f.endsWith(".md")) docs.push(path.join(d, f));
}
for (const file of ["plugins/codejadee-chayen-framework/README.md", "docs/production/CI_CD_DESIGN.md", "docs/production/MANUAL_RELEASE_SIGNOFF.md", "docs/production/RELEASE_GATE_MATRIX.md", "docs/production/NATIVE_LIFECYCLE_REPORT.md"]) {
  if (fs.existsSync(path.join(root, file))) docs.push(path.join(root, file));
}

const pluginDir = path.join(root, "plugins/codejadee-chayen-framework");
const manifest = JSON.parse(fs.readFileSync(path.join(pluginDir, "plugin.json"), "utf8"));
const marketplaces = [".claude-plugin/marketplace.json", ".agents/plugins/marketplace.json", ".github/plugin/marketplace.json"]
  .map((p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8")).name);
const skills = new Set(fs.readdirSync(path.join(pluginDir, "skills")).filter((d) => fs.existsSync(path.join(pluginDir, "skills", d, "SKILL.md"))));
assertTreeNoLinks(pluginDir);
const packageFiles = fs.readdirSync(pluginDir, { recursive: true }).filter(f => fs.statSync(path.join(pluginDir, f)).isFile()).length;
const references = fs.readdirSync(path.join(pluginDir, "skills"), { recursive: true }).filter(f => /(?:^|[\\/])references[\\/].*\.md$/.test(f)).length;
const l0 = [...skills].reduce((n, skill) => n + skill.length + (/^description:\s*(.+)$/m.exec(fs.readFileSync(path.join(pluginDir, "skills", skill, "SKILL.md"), "utf8"))?.[1].trim().length ?? 0), 0);
const facts = { "Plugin name": `\`${manifest.name}\``, "Marketplace name": `\`${marketplaces[0]}\``, "Current version": `\`${manifest.version}\``, "Entry Skills": String(skills.size), "Package files": String(packageFiles), "Skill references": String(references), "L0 metadata": `${l0.toLocaleString("en-US")} / ${L0_BUDGET.toLocaleString("en-US")} characters` };
const readme = path.join(root, "README.md");
if (fs.existsSync(readme)) {
  const body = fs.readFileSync(readme, "utf8");
  for (const [label, value] of Object.entries(facts)) if (!body.includes(`| ${label} | ${value} |`)) err("D-06", readme, `current build fact must be ${label} = ${value}`);
}

// GitHub heading slugs: lowercase, drop punctuation except - and _, spaces -> -, de-duplicate with -n.
const slugCache = new Map();
function slugs(file) {
  if (slugCache.has(file)) return slugCache.get(file);
  const seen = new Map(), out = new Set();
  let fence = false;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (/^\s*```/.test(line)) { fence = !fence; continue; }
    const m = !fence && /^#{1,6}\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const base = m[1].replace(/`/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").toLowerCase().trim()
      .replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/\s/g, "-");
    const n = seen.get(base) ?? 0; seen.set(base, n + 1);
    out.add(n ? `${base}-${n}` : base);
  }
  slugCache.set(file, out);
  return out;
}

const proposalFiles = new Set(["CHANGELOG.md", "docs/distribution/RELEASE_METADATA.md", "docs/distribution/RELEASE_CHECKLIST.md", "docs/distribution/MARKETPLACE_LISTINGS.md"]);
for (const file of docs) {
  const text = fs.readFileSync(file, "utf8");
  // Historical evidence is explicitly delimited; current claims remain checked.
  const historyStarts = (text.match(/<!-- historical:start -->/g) ?? []).length;
  const historyEnds = (text.match(/<!-- historical:end -->/g) ?? []).length;
  if (historyStarts !== historyEnds) err("D-06", file, "unbalanced historical evidence markers");
  const current = text.replace(/<!-- historical:start -->[\s\S]*?<!-- historical:end -->/g, "");
  const currentUserDoc = !rel(file).startsWith("docs/production/") && rel(file) !== "CHANGELOG.md";
  if (currentUserDoc) {
    for (const m of current.matchAll(/\b(\d+) (?:entry )?skills\b|Skills \((\d+)\)|Installed (\d+) skills/gi)) if (Number(m[1] ?? m[2] ?? m[3]) !== skills.size) err("D-06", file, `current skill count differs from ${skills.size}: ${m[0]}`);
    for (const m of current.matchAll(/\b(\d+) (?:package )?files\b/gi)) if (Number(m[1]) > 100 && Number(m[1]) !== packageFiles) err("D-06", file, `package file count differs from ${packageFiles}`);
    for (const m of current.matchAll(/\b(\d+) (?:skill )?references\b/gi)) if (Number(m[1]) > 100 && Number(m[1]) !== references) err("D-06", file, `reference count differs from ${references}`);
    for (const line of current.split(/\r?\n/)) if (/L0|metadata.*(?:usage|footprint)/i.test(line)) {
      const pair = /([\d,]+)\s*\/\s*([\d,]+)\s*(?:characters|chars)/.exec(line);
      if (pair && (Number(pair[1].replaceAll(",", "")) !== l0 || Number(pair[2].replaceAll(",", "")) !== L0_BUDGET)) err("D-06", file, "metadata usage or budget differs from canonical Skills");
    }
  }
  const prose = text.replace(/```[\s\S]*?```/g, (b) => b.replace(/\]\(/g, "] ("));
  for (const m of prose.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const target = m[1];
    if (/^https?:\/\//.test(target)) { external.add(target); continue; }
    if (/^(mailto|tel):/.test(target)) continue;
    const [p, anchor] = target.split("#");
    const dest = p ? path.resolve(path.dirname(file), decodeURI(p)) : file;
    if (!dest.startsWith(root + path.sep) && dest !== root) { err("D-01", file, `link leaves the repository: ${target}`); continue; }
    if (!fs.existsSync(dest)) { err("D-01", file, `broken link: ${target}`); continue; }
    if (anchor && dest.endsWith(".md") && !slugs(dest).has(anchor.toLowerCase())) err("D-02", file, `missing anchor #${anchor} in ${rel(dest)}`);
  }
  for (const m of text.matchAll(/\b([a-z0-9][a-z0-9-]*)@([a-z0-9][a-z0-9-]*)\b/g)) {
    if (/\.(com|org|net|io)$/.test(m[2]) || m[0].includes("example")) continue;
    if (m[0] === "codejadee-chayen-framework@codejadee") {
      const outsideMigration = text.replace(/<!-- migration:start -->[\s\S]*?<!-- migration:end -->/g, "");
      if (outsideMigration.includes(m[0])) err("D-03", file, "former plugin identity is allowed only in marked migration instructions");
      continue;
    }
    if (m[1] === manifest.name || m[1].startsWith("codejadee") || m[2].startsWith("codejadee")) {
      if (m[1] !== manifest.name || !marketplaces.includes(m[2])) err("D-03", file, `identifier ${m[0]} does not match ${manifest.name}@${marketplaces[0]}`);
    }
  }
  for (const m of text.matchAll(/\bchayen-[a-z]+(?:-[a-z]+)*\b/g)) {
    if (m[0].endsWith("-framework") || m[0] === "chayen-framework") continue;
    if (m[0] === "chayen-response-style") continue; // opt-in policy identifier (Step 39), not a Skill
    if (!skills.has(m[0]) && !/^chayen-(name|x)$/.test(m[0])) err("D-04", file, `unknown skill name ${m[0]}`);
  }
  if (!proposalFiles.has(rel(file))) for (const m of text.matchAll(/\b(\d+\.\d+\.\d+-dev)\b/g)) {
    if (m[1] !== manifest.version) err("D-05", file, `version ${m[1]} differs from manifest ${manifest.version}`);
  }
}

if (process.argv.includes("--list-external")) for (const u of [...external].sort()) console.log(`EXTERNAL ${u}`);
for (const e of errors) console.log(e);
console.log(`${errors.length ? "FAIL" : "PASS"} documentation: ${docs.length} files, ${errors.length} error(s), ${external.size} external link(s) listed not fetched`);
process.exit(errors.length ? 1 : 0);
