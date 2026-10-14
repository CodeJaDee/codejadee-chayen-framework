#!/usr/bin/env node
// Developer-only static validator for the Chayen plugin package and its
// marketplace files. Zero dependencies (Node.js >= 18). Never shipped and
// never required by plugin users.
//
// Usage: node tools/validate/validate-package.mjs [repoRoot]
// Standard: docs/chayen/SKILL_AUTHORING_STANDARD.md; gates: docs/chayen/SKILL_QUALITY_GATES.md
// Exit code: 0 = no errors (warnings allowed), 1 = errors found.
//
// Rule sources (see docs/chayen/PROVIDER_SPEC_RESEARCH.md):
//   S21 Agent Plugins 1.0.0 plugin.schema.json   S3/S4 Claude Code manifest + marketplace reference
//   S10 OpenAI plugins build guide              S15 Copilot CLI plugin reference
//   S24 Agent Skills specification

import fs from "node:fs";
import path from "node:path";
import { parseYamlSubset } from "../catalog/catalog-lib.mjs";

const root = path.resolve(process.argv[2] ?? path.join(import.meta.dirname, "..", ".."));
const PLUGIN_DIR_REL = "plugins/codejadee-chayen-framework";
const AGENT_PLUGINS_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json";

const results = [];
const error = (check, msg) => results.push({ level: "ERROR", check, msg });
const warn = (check, msg) => results.push({ level: "WARN", check, msg });
const pass = (check, msg) => results.push({ level: "PASS", check, msg });

const abs = (rel) => path.join(root, rel);
const exists = (rel) => fs.existsSync(abs(rel));
const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const isStr = (v) => typeof v === "string";

function readJson(check, rel) {
  if (!exists(rel)) { error(check, `missing file ${rel}`); return null; }
  try { return JSON.parse(fs.readFileSync(abs(rel), "utf8")); }
  catch (e) { error(check, `${rel}: invalid JSON (${e.message})`); return null; }
}

// Relative source path rules shared by all marketplaces: "./" prefix, no "..",
// no backslash, resolves inside the repo to a directory.
function checkRelSource(check, file, src) {
  if (!isStr(src)) { error(check, `${file}: source path must be a string`); return null; }
  if (!src.startsWith("./")) error(check, `${file}: source "${src}" must start with "./"`);
  if (src.split("/").includes("..")) error(check, `${file}: source "${src}" contains ".."`);
  if (src.includes("\\")) error(check, `${file}: source "${src}" contains a backslash`);
  const resolved = path.resolve(root, src);
  if (!resolved.startsWith(root + path.sep)) { error(check, `${file}: source "${src}" escapes the marketplace root`); return null; }
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) { error(check, `${file}: source "${src}" does not resolve to a directory`); return null; }
  return path.relative(root, resolved).split(path.sep).join("/");
}

// ---------- 1. Agent Plugins 1.0 manifest (S21) ----------
const apRel = `${PLUGIN_DIR_REL}/plugin.json`;
const ap = readJson("V-02 agent-plugins-manifest", apRel);
if (ap) {
  const c = "V-02 agent-plugins-manifest";
  if (!isObj(ap)) error(c, "manifest must be a JSON object");
  else {
    const allowed = ["$schema", "name", "version", "description", "author", "homepage", "repository", "license", "keywords", "extensions"];
    for (const k of Object.keys(ap)) if (!allowed.includes(k)) error(c, `unknown top-level field "${k}" (schema has additionalProperties: false)`);
    if (ap.$schema !== AGENT_PLUGINS_SCHEMA) error(c, `$schema must equal ${AGENT_PLUGINS_SCHEMA}`);
    const nameOk = isStr(ap.name) && ap.name.length >= 1 && ap.name.length <= 64 &&
      /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(ap.name) && !/--|\.\./.test(ap.name);
    if (!nameOk) error(c, `name "${ap.name}" violates the Agent Plugins name rules`);
    for (const k of ["version", "description", "homepage", "repository", "license"])
      if (k in ap && !isStr(ap[k])) error(c, `${k} must be a string`);
    if ("author" in ap) {
      if (!isObj(ap.author)) error(c, "author must be an object");
      else for (const [k, v] of Object.entries(ap.author)) {
        if (!["name", "email", "url"].includes(k)) error(c, `author.${k} is not allowed`);
        else if (!isStr(v)) error(c, `author.${k} must be a string`);
      }
    }
    if ("keywords" in ap && !(Array.isArray(ap.keywords) && ap.keywords.every(isStr))) error(c, "keywords must be an array of strings");
    if ("extensions" in ap && !(isObj(ap.extensions) && Object.values(ap.extensions).every(isObj))) error(c, "extensions values must be objects");
    if (!results.some((r) => r.check === c && r.level === "ERROR")) pass(c, `${apRel} conforms to the Agent Plugins 1.0.0 field rules`);
  }
}

// ---------- 2. Claude Code manifest (S3) ----------
const ccRel = `${PLUGIN_DIR_REL}/.claude-plugin/plugin.json`;
const cc = readJson("V-03 claude-manifest", ccRel);
if (cc) {
  const c = "V-03 claude-manifest";
  if (!isStr(cc.name) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(cc.name)) error(c, `name "${cc.name}" must be kebab-case`);
  const lower = String(cc.name).toLowerCase();
  if (/^(claude|anthropic|anthropics|cc-plugin)-/.test(lower) || ["claude", "anthropic", "anthropics", "claude-code", "claude-mods"].includes(lower))
    error(c, `name "${cc.name}" is reserved by Claude Code`);
  const componentKeys = ["skills", "commands", "agents", "hooks", "mcpServers", "lspServers", "outputStyles", "workflows", "experimental", "userConfig", "channels", "settings", "monitors", "themes", "types", "dependencies"];
  for (const k of componentKeys) if (k in cc) error(c, `component/config key "${k}" is not allowed (M-03, ADR-0005)`);
  const metaKeys = ["$schema", "name", "version", "description", "author", "homepage", "repository", "license", "keywords"];
  for (const k of Object.keys(cc)) if (!metaKeys.includes(k) && !componentKeys.includes(k)) error(c, `unsupported field "${k}" (S3 manifest schema)`);
  for (const k of ["version", "description", "author"]) if (!(k in cc)) warn(c, `missing recommended field "${k}"`);
  if (cc.author && !isStr(cc.author.name)) error(c, "author.name is required when author is set");
  if (!results.some((r) => r.check === c && r.level === "ERROR")) pass(c, `${ccRel} passes static checks`);
}

// ---------- 3. Identity parity across manifests (M-04, M-05) ----------
if (ap && cc) {
  const c = "V-04 identity-parity";
  for (const k of ["name", "version", "description", "author", "homepage", "repository", "license", "keywords"])
    if (JSON.stringify(ap[k]) !== JSON.stringify(cc[k])) error(c, `field "${k}" differs between plugin.json and .claude-plugin/plugin.json`);
  const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
  if (!semver.test(String(ap.version))) error(c, `version "${ap.version}" is not semver`);
  if (!results.some((r) => r.check === c && r.level === "ERROR")) pass(c, `name=${ap.name} version=${ap.version} identical in both manifests`);
}
const identity = ap ? { name: ap.name, version: ap.version } : null;

// ---------- 4. Marketplaces: one native file per provider ----------
const RESERVED_MP = ["claude-code-marketplace", "claude-code-plugins", "claude-plugins-official", "anthropic-marketplace", "anthropic-plugins", "agent-skills", "anthropic-agent-skills", "life-sciences", "knowledge-work-plugins", "claude-for-legal", "claude-for-financial-services", "financial-services-plugins", "first-party-plugins", "claude-tag-plugins", "claude-community", "claude-plugins-community", "healthcare", "anthropic-plugin-directory", "claude-plugin-directory", "inline", "builtin", "skills-dir", "synced", "claude-plugin-test", "npm", "pip", "uv", "cargo", "github", "gh"];
const marketplaceNames = {};

function checkEntryTarget(c, file, entry, resolvedRel) {
  if (!resolvedRel || !identity) return;
  if (resolvedRel !== PLUGIN_DIR_REL) error(c, `${file}: entry "${entry.name}" resolves to ${resolvedRel}, expected ${PLUGIN_DIR_REL}`);
  if (entry.name !== identity.name) error(c, `${file}: entry name "${entry.name}" must equal the manifest name "${identity.name}"`);
}

// 4a. Claude Code: .claude-plugin/marketplace.json (S4)
{
  const c = "V-01a marketplace-claude", rel = ".claude-plugin/marketplace.json";
  const m = readJson(c, rel);
  if (m) {
    marketplaceNames.claude = m.name;
    if (!isStr(m.name) || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(m.name) || m.name.includes("..")) error(c, `${rel}: invalid marketplace name "${m.name}"`);
    if (RESERVED_MP.includes(String(m.name).toLowerCase()) || String(m.name).startsWith("claudeai-")) error(c, `${rel}: marketplace name "${m.name}" is reserved`);
    if (!isObj(m.owner) || !isStr(m.owner.name) || !m.owner.name) error(c, `${rel}: owner.name is required`);
    if (!isStr(m.description)) warn(c, `${rel}: description missing`);
    if (!Array.isArray(m.plugins) || m.plugins.length === 0) error(c, `${rel}: plugins[] must be a non-empty array`);
    else for (const e of m.plugins) {
      if (!isStr(e.name)) { error(c, `${rel}: plugin entry without name`); continue; }
      if ("version" in e) warn(c, `${rel}: entry "${e.name}" sets version; plugin.json wins at install (S4)`);
      checkEntryTarget(c, rel, e, checkRelSource(c, rel, e.source));
      if (!exists(`${PLUGIN_DIR_REL}/.claude-plugin/plugin.json`)) error(c, `${rel}: target has no .claude-plugin/plugin.json`);
    }
    if (!results.some((r) => r.check === c && r.level === "ERROR")) pass(c, `${rel} passes static checks`);
  }
}

// 4b. GitHub Copilot: .github/plugin/marketplace.json (S15 + plugins-marketplace how-to)
{
  const c = "V-01b marketplace-copilot", rel = ".github/plugin/marketplace.json";
  const m = readJson(c, rel);
  if (m) {
    marketplaceNames.copilot = m.name;
    if (!isStr(m.name) || m.name.length > 64 || !/^[a-z0-9]+(?:[-.][a-z0-9]+)*$/.test(m.name)) error(c, `${rel}: name must be kebab-case, max 64 chars`);
    if (!isObj(m.owner) || !isStr(m.owner.name)) error(c, `${rel}: owner.name is required`);
    if (!Array.isArray(m.plugins) || m.plugins.length === 0) error(c, `${rel}: plugins[] must be a non-empty array`);
    else for (const e of m.plugins) {
      if (!isStr(e.name)) { error(c, `${rel}: plugin entry without name`); continue; }
      if (isStr(e.description) && e.description.length > 1024) error(c, `${rel}: description exceeds 1024 chars`);
      if (identity && "version" in e && e.version !== identity.version) error(c, `${rel}: entry version "${e.version}" differs from manifest version "${identity.version}"`);
      checkEntryTarget(c, rel, e, checkRelSource(c, rel, e.source));
    }
    if (!results.some((r) => r.check === c && r.level === "ERROR")) pass(c, `${rel} passes static checks`);
  }
}

// 4c. OpenAI Codex: .agents/plugins/marketplace.json (S10)
{
  const c = "V-01c marketplace-codex", rel = ".agents/plugins/marketplace.json";
  const m = readJson(c, rel);
  if (m) {
    marketplaceNames.codex = m.name;
    if (!isStr(m.name) || !m.name) error(c, `${rel}: name is required`);
    if (!isObj(m.interface) || !isStr(m.interface.displayName)) error(c, `${rel}: interface.displayName is required`);
    if (!Array.isArray(m.plugins) || m.plugins.length === 0) error(c, `${rel}: plugins[] must be a non-empty array`);
    else for (const e of m.plugins) {
      if (!isStr(e.name)) { error(c, `${rel}: plugin entry without name`); continue; }
      if (!isObj(e.source) || e.source.source !== "local") error(c, `${rel}: entry "${e.name}" must use {"source":"local","path":"./..."}`);
      const resolved = isObj(e.source) ? checkRelSource(c, rel, e.source.path) : null;
      if (!isObj(e.policy) || !["AVAILABLE", "INSTALLED_BY_DEFAULT", "NOT_AVAILABLE"].includes(e.policy.installation)) error(c, `${rel}: entry "${e.name}" policy.installation invalid`);
      if (!isObj(e.policy) || !isStr(e.policy.authentication)) error(c, `${rel}: entry "${e.name}" policy.authentication required`);
      if (!isStr(e.category)) error(c, `${rel}: entry "${e.name}" category required`);
      checkEntryTarget(c, rel, e, resolved);
    }
    if (!results.some((r) => r.check === c && r.level === "ERROR")) pass(c, `${rel} passes static checks`);
  }
}
{
  const names = new Set(Object.values(marketplaceNames));
  if (names.size > 1) warn("V-01 marketplace-consistency", `marketplace names differ across providers: ${JSON.stringify(marketplaceNames)}`);
  else pass("V-01 marketplace-consistency", `marketplace name "${[...names][0]}" consistent across ${Object.keys(marketplaceNames).join(", ")}`);
}

// ---------- 5. Plugin content rules (V-09) ----------
function walk(dirAbs, out = []) {
  for (const ent of fs.readdirSync(dirAbs, { withFileTypes: true })) {
    const p = path.join(dirAbs, ent.name);
    if (ent.isSymbolicLink()) out.push({ p, symlink: true });
    else if (ent.isDirectory()) { out.push({ p, dir: true }); walk(p, out); }
    else out.push({ p });
  }
  return out;
}
if (exists(PLUGIN_DIR_REL)) {
  const c = "V-09 plugin-content";
  const pluginAbs = abs(PLUGIN_DIR_REL);
  const forbiddenTop = ["hooks", "agents", "commands", "bin", "scripts", "monitors", "output-styles", "workflows", "themes", "mcp.json", ".mcp.json", ".lsp.json", "lsp.json", "package.json", "settings.json", ".app.json", ".codex-plugin", "evals"];
  for (const ent of fs.readdirSync(pluginAbs, { withFileTypes: true })) {
    if (forbiddenTop.includes(ent.name)) error(c, `forbidden component "${ent.name}" in plugin root (ADR-0005)`);
    if (ent.isDirectory() && /^[a-z]+\.[a-z0-9.-]+$/.test(ent.name)) error(c, `reverse-domain extension directory "${ent.name}" is not allowed (ADR-0006)`);
  }
  for (const f of walk(pluginAbs)) {
    const rel = path.relative(root, f.p).split(path.sep).join("/");
    if (f.symlink) error(c, `symlink not allowed: ${rel}`);
    else if (!f.dir && ![".md", ".json"].includes(path.extname(f.p).toLowerCase())) error(c, `file type not allowed (only .md/.json): ${rel}`);
  }
  if (!results.some((r) => r.check === c && r.level === "ERROR")) pass(c, "plugin contains only .md/.json files and no forbidden components");
}

// ---------- 6. Skills: single canonical source + frontmatter (V-05) ----------
// Strict parser for the small frontmatter subset the standard allows (PT-02, RF-01):
// one "key: value" per line, values as YAML-safe plain scalars, quoted strings,
// or flow lists of plain tokens; `metadata` may hold an indented string map.
function parseFrontmatter(text) {
  const errs = [];
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!m) return { fields: null, body: text, errs: ["missing YAML frontmatter (--- block at the top)"] };
  const fields = {};
  let parent = null;
  m[1].split(/\r?\n/).forEach((line, i) => {
    const no = i + 2;
    if (!line.trim() || /^\s*#/.test(line)) return;
    if (/\t/.test(line)) { errs.push(`frontmatter line ${no}: tab character`); return; }
    const nested = /^ {2}([A-Za-z0-9_-]+):\s+(.*)$/.exec(line);
    if (nested && parent === "metadata") { fields.metadata[nested[1]] = nested[2]; return; }
    const kv = /^([A-Za-z0-9_-]+):(?:\s+(.*))?$/.exec(line);
    if (!kv) { errs.push(`frontmatter line ${no}: not a "key: value" line`); return; }
    const [, key, raw = ""] = kv;
    if (key in fields) { errs.push(`frontmatter line ${no}: duplicate key "${key}"`); return; }
    parent = key;
    if (raw === "") { fields[key] = key === "metadata" ? {} : ""; return; }
    if (/^["']/.test(raw)) {
      const q = raw[0];
      if (raw.length < 2 || !raw.endsWith(q)) { errs.push(`frontmatter line ${no}: unterminated quoted value for "${key}"`); return; }
      fields[key] = raw.slice(1, -1);
    } else if (raw.startsWith("[")) {
      if (!raw.endsWith("]")) { errs.push(`frontmatter line ${no}: unterminated list for "${key}"`); return; }
      fields[key] = raw.slice(1, -1).split(",").map((t) => t.trim()).filter(Boolean);
    } else {
      if (/: |\s#|^[&*!|>%@`{]/.test(raw)) { errs.push(`frontmatter line ${no}: value of "${key}" is not a YAML-safe plain scalar (": ", " #", or an indicator); quote or rephrase`); return; }
      fields[key] = raw;
    }
  });
  return { fields, body: text.slice(m[0].length), errs };
}

{
  const c = "V-05 skills";
  const skillsRel = `${PLUGIN_DIR_REL}/skills`;
  const ignoreDirs = new Set([".git", "node_modules", ".vscode"]);
  const stray = [];
  (function find(dirAbs) {
    for (const ent of fs.readdirSync(dirAbs, { withFileTypes: true })) {
      if (ent.isDirectory() && !ignoreDirs.has(ent.name)) find(path.join(dirAbs, ent.name));
      else if (ent.name === "SKILL.md") stray.push(path.relative(root, path.join(dirAbs, ent.name)).split(path.sep).join("/"));
    }
  })(root);
  let count = 0;
  const seenNames = new Map();
  for (const s of stray) {
    const m = s.match(new RegExp(`^${skillsRel}/([^/]+)/SKILL\\.md$`));
    if (!m) { error(c, `SKILL.md outside the canonical source: ${s}`); continue; }
    count++;
    const { fields, errs } = parseFrontmatter(fs.readFileSync(abs(s), "utf8"));
    for (const e of errs) error(c, `${s}: ${e}`);
    if (!fields) continue;
    for (const k of Object.keys(fields)) if (!["name", "description", "license", "metadata"].includes(k)) error(c, `${s}: unsupported frontmatter field "${k}" (PT-02, F-01)`);
    if (fields.metadata !== undefined && (typeof fields.metadata !== "object" || Array.isArray(fields.metadata))) error(c, `${s}: metadata must be a string map`);
    const name = typeof fields.name === "string" ? fields.name : "";
    if (name !== m[1]) error(c, `${s}: name "${name}" must equal directory "${m[1]}" (PT-03)`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) error(c, `${s}: invalid name "${name}" (PT-03)`);
    const key = name.toLowerCase();
    if (seenNames.has(key)) error(c, `${s}: duplicate skill name "${name}" (also ${seenNames.get(key)}) (PT-03)`);
    else seenNames.set(key, s);
    if (typeof fields.description !== "string" || !fields.description || fields.description.length > 1024) error(c, `${s}: description required, max 1024 chars (PT-04)`);
  }
  if (!results.some((r) => r.check === c && r.level === "ERROR")) pass(c, `${count} skill(s) found, all under ${skillsRel}/, frontmatter valid, names unique`);
  if (count === 0) warn(c, "no skills yet: the package installs but provides no behaviour");
}

// ---------- 6b. Skill content checks (V-06, V-07, V-08, V-10, V-12, V-17, V-18, V-19, V-20, V-22) ----------
const SKILLS_DIR = abs(`${PLUGIN_DIR_REL}/skills`);
const skillDirs = fs.existsSync(SKILLS_DIR)
  ? fs.readdirSync(SKILLS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory() && fs.existsSync(path.join(SKILLS_DIR, d.name, "SKILL.md"))).map((d) => d.name).sort()
  : [];
const skillMeta = {};
for (const s of skillDirs) {
  const text = fs.readFileSync(path.join(SKILLS_DIR, s, "SKILL.md"), "utf8");
  const { fields, body } = parseFrontmatter(text);
  skillMeta[s] = { text, body, desc: typeof fields?.description === "string" ? fields.description : "" };
}
const stripCode = (t) => t.replace(/```[\s\S]*?```/g, "");
const mdLinks = (text) => [...stripCode(text).matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]).filter((l) => !/^(https?:|mailto:)/.test(l));
const slug = (h) => h.trim().toLowerCase().replace(/[`*_]/g, "").replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s/g, "-");
const headings = (text) => [...stripCode(text).matchAll(/^#{1,6}\s+(.+?)\s*$/gm)].map((m) => m[1]);
// Level-2 sections in order: [{ title, content }]
const h2Sections = (body) => {
  const out = [];
  let cur = null;
  for (const line of body.split(/\r?\n/)) {
    const h = /^## (.+?)\s*$/.exec(line);
    if (h) { cur = { title: h[1], content: [] }; out.push(cur); }
    else if (cur) cur.content.push(line);
  }
  return out.map((x) => ({ title: x.title, content: x.content.join("\n") }));
};
const words = (t) => stripCode(t).replace(/[|#>*`_-]/g, " ").split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
const refFiles = {};      // skill -> [{ file, rel, fields, body, errs }]
for (const s of skillDirs) {
  const dir = path.join(SKILLS_DIR, s, "references");
  refFiles[s] = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort().map((f) => {
    const text = fs.readFileSync(path.join(dir, f), "utf8");
    return { file: f, rel: `skills/${s}/references/${f}`, text, ...parseFrontmatter(text) };
  }) : [];
}

{ // V-07 metadata budget, description safety and distinctness
  const c = "V-07 metadata-budget";
  let total = 0;
  for (const [s, m] of Object.entries(skillMeta)) {
    total += s.length + m.desc.length;
    if (m.desc.length > 1024) error(c, `${s}: description ${m.desc.length} chars > 1024`);
    else if (m.desc.length > 420) warn(c, `${s}: description ${m.desc.length} chars > 420 target (D-017)`);
    if (/: |\s#|^['"\[{>|*&!%@`]/.test(m.desc)) error(c, `${s}: description contains YAML-unsafe characters (": ", " #", or a leading indicator); quote it or rephrase`);
    if (!/\bNot (for|a)\b/.test(m.desc)) error(c, `${s}: description lacks a "Not for ..." boundary clause (DS-03)`);
  }
  if (skillDirs.length > 14) error(c, `${skillDirs.length} entry skills > 14`);
  const L0_CAP = 5200; // 4,000 originally; 4,400 by D-034 (Step 14), 4,700 by D-035 (Step 15), 5,200 by D-036 (Step 16); all user-approved
  if (total > L0_CAP) error(c, `L0 metadata ${total} chars > ${L0_CAP}`);
  if (!results.some((r) => r.check === c && r.level === "ERROR")) pass(c, `${skillDirs.length} skills, L0 metadata ${total}/${L0_CAP} chars`);

  const c2 = "V-07b description-distinctness";
  const stop = new Set("a an and or the of for to in on with by from as is are be use when not such this that it its into than via code covers including".split(" "));
  const wordSet = (t) => new Set(t.toLowerCase().replace(/[^a-z0-9#+.\s-]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !stop.has(w)));
  const names = Object.keys(skillMeta);
  let maxPair = ["", "", 0];
  for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) {
    const a = wordSet(skillMeta[names[i]].desc), b = wordSet(skillMeta[names[j]].desc);
    const inter = [...a].filter((w) => b.has(w)).length, jac = inter / (a.size + b.size - inter || 1);
    if (jac > maxPair[2]) maxPair = [names[i], names[j], jac];
    if (jac > 0.35) error(c2, `${names[i]} vs ${names[j]}: description word overlap ${jac.toFixed(2)} > 0.35`);
    else if (jac > 0.25) warn(c2, `${names[i]} vs ${names[j]}: description word overlap ${jac.toFixed(2)} > 0.25`);
  }
  if (!results.some((r) => r.check === c2 && r.level === "ERROR")) pass(c2, `max pairwise overlap ${maxPair[2].toFixed(2)} (${maxPair[0]} / ${maxPair[1]})`);
}

{ // V-20 description breadth (DS-02, DS-03, DS-04, DS-08)
  const c = "V-20 description-breadth";
  const CATCH_ALL = /\b(any (?:task|kind of|type of|language|framework|project|code|request)|anything|everything|all kinds of|general[- ]purpose|etc\.?|and more|and so on|whatever)\b/i;
  // Concrete scope vocabulary: stacks, tools, files, and engineering artifacts.
  const VOCAB = [".net", "c#", "asp.net", "ef core", "dapper", "sql server", "postgresql", "sql", "angular", "react", "next.js", "vue", "nuxt", "vite",
    "nitro", "elysia", "node", "typescript", "javascript", "python", "fastapi", "django", "flask", "xunit", "nunit", "mstest", "jasmine", "jest",
    "vitest", "playwright", "cypress", "pytest", "docker", "kubernetes", "terraform", "java", "agents.md", "claude.md", "endpoint", "migration",
    "component", "form", "test", "task contract", "change summary", "diff", "dependenc", "repository", "codebase", "command", "layout", "api",
    "schema", "pipeline", "dockerfile", "secret", "cors", "csrf", "xss", "injection", "routing", "accessibility", "query", "refactor"];
  for (const [s, m] of Object.entries(skillMeta)) {
    const d = m.desc, lower = d.toLowerCase();
    const hit = CATCH_ALL.exec(d);
    if (hit) error(c, `${s}: catch-all wording "${hit[0]}" makes the description overly broad (DS-04)`);
    const terms = VOCAB.filter((t) => new RegExp(`(^|[^a-z0-9])${t.replace(/[.#+]/g, (x) => `\\${x}`)}`).test(lower));
    if (terms.length < 2) error(c, `${s}: names ${terms.length} concrete scope term(s); at least 2 stacks, tools, files, or artifacts are required (DS-02)`);
    const notIdx = d.search(/\bNot (for|a)\b/);
    if (notIdx >= 0) {
      const excl = d.slice(notIdx).replace(/^Not (for|a)\s+/, "").replace(/\.$/, "").split(/,\s*|\s+or\s+|\s+and\s+/).filter((x) => x.trim().length > 2);
      if (excl.length < 2) error(c, `${s}: boundary clause names ${excl.length} exclusion(s); at least 2 are required (DS-03)`);
    }
    const scopePart = notIdx >= 0 ? d.slice(0, notIdx) : d;
    const items = scopePart.split(/,\s*|\s+or\s+/).length;
    if (items > 24) warn(c, `${s}: ${items} enumerated items before the boundary clause (> 24, DS-08); consider naming families`);
  }
  if (!results.some((r) => r.check === c && r.level === "ERROR")) pass(c, `all ${skillDirs.length} descriptions name concrete scope, avoid catch-all wording, and exclude at least 2 neighbours`);
}

{ // V-17 entry skill anatomy (standard §4.1), V-06 line budgets
  const c = "V-17 skill-sections", c6 = "V-06 line-budgets";
  const required = ["When to use", "When not to use", "Principles", "Preconditions and inputs", "Workflow", "Outputs", "Verification", "Failure handling", "Safety boundaries", "References"];
  for (const [s, m] of Object.entries(skillMeta)) {
    const secs = h2Sections(m.body);
    const titles = secs.map((x) => x.title);
    let last = -1;
    for (const h of required) {
      const idx = titles.findIndex((t) => t === h);
      if (idx < 0) { error(c, `${s}: missing section "## ${h}"`); continue; }
      if (idx < last) error(c, `${s}: section "## ${h}" is out of order (standard §4.1)`);
      last = Math.max(last, idx);
      if (words(secs[idx].content) < 8) error(c, `${s}: section "## ${h}" has no substantive content`);
    }
    const pre = m.body.split(/^## /m)[0];
    if (!/^# \S/m.test(pre)) error(c, `${s}: missing "# <Title>" heading`);
    if (!/^\*\*Scope:\*\* \S/m.test(pre)) error(c, `${s}: missing the "**Scope:** ..." line before "## When to use" (standard §4.1, R-24)`);
    const whenUse = secs.find((x) => x.title === "When to use")?.content ?? "";
    if ((whenUse.match(/^- "/gm) ?? []).length < 4) error(c, `${s}: fewer than 4 quoted positive trigger examples in "When to use"`);
    const whenNot = secs.find((x) => x.title === "When not to use")?.content ?? "";
    const negEntries = (whenNot.match(/^- \S/gm) ?? []).length + Math.max(0, (whenNot.match(/^\|(?!\s*-)/gm) ?? []).length - 1);
    if (negEntries < 3) error(c, `${s}: fewer than 3 exclusions in "When not to use"`);
    if (!/stop following this skill and continue normally without mentioning it/.test(whenNot)) error(c, `${s}: missing the no-match gate sentence in "When not to use" (ADR-0003)`);
    const refs = secs.find((x) => x.title === "References")?.content ?? "";
    if (refFiles[s].length && !/^\|\s*Reference\s*\|\s*Load when\s*\|/m.test(refs)) error(c, `${s}: "## References" must be a "| Reference | Load when |" table (LD-01)`);
    const lines = m.text.split(/\r?\n/).length;
    if (lines > 300) error(c6, `${s}/SKILL.md has ${lines} lines > 300`);
    else if (lines > 200) warn(c6, `${s}/SKILL.md has ${lines} lines > 200 target (SB-01)`);
  }
  for (const s of skillDirs) for (const r of refFiles[s]) {
    const n = r.text.split(/\r?\n/).length;
    if (n > 300) error(c6, `${r.rel} has ${n} lines > 300`);
  }
  if (!results.some((r) => r.check === c && r.level === "ERROR")) pass(c, `all ${skillDirs.length} skills follow the standard anatomy (scope line, ordered sections, >=4 positive and >=3 negative triggers, gate, reference table)`);
  if (!results.some((r) => r.check === c6 && r.level === "ERROR")) pass(c6, "SKILL.md and reference files within 300 lines");
}

{ // V-18 reference kinds (standard §5)
  const c = "V-18 reference-kinds";
  const KIND_SECTIONS = {
    recipe: ["Inputs", "Procedure", "Outputs", "Technology considerations", "Verification"],
    technology: ["Check the repository first", /^(Verification|Commands)/, "Pitfalls"],
    template: ["Template"],
    checklist: [],
  };
  for (const s of skillDirs) for (const r of refFiles[s]) {
    for (const e of r.errs) error(c, `${r.rel}: ${e}`);
    if (!r.fields) continue;
    for (const k of Object.keys(r.fields)) if (!["kind", "capabilities"].includes(k)) error(c, `${r.rel}: unsupported frontmatter field "${k}" (RF-01)`);
    const kind = r.fields.kind;
    if (!(kind in KIND_SECTIONS)) { error(c, `${r.rel}: kind "${kind}" must be recipe, technology, checklist, or template (RF-01)`); continue; }
    if (kind !== "recipe" && "capabilities" in r.fields) error(c, `${r.rel}: capabilities is only allowed for kind recipe`);
    const secs = h2Sections(r.body);
    if (!/^# \S/m.test(r.body)) error(c, `${r.rel}: missing "# <Title>" heading`);
    if (kind === "checklist" && secs.length < 2) error(c, `${r.rel}: a checklist needs at least 2 "##" sections`);
    let last = -1;
    for (const req of KIND_SECTIONS[kind]) {
      const idx = secs.findIndex((x) => (req instanceof RegExp ? req.test(x.title) : x.title === req));
      const label = req instanceof RegExp ? req.source.replace(/[\\^()]/g, "") : req;
      if (idx < 0) { error(c, `${r.rel}: kind ${kind} requires "## ${label}"`); continue; }
      if (kind === "recipe" && idx < last) error(c, `${r.rel}: "## ${label}" is out of order (standard §5.2)`);
      last = Math.max(last, idx);
      if (kind === "recipe" && words(secs[idx].content) < 12) error("V-12 placeholders", `${r.rel}: required section "## ${label}" has fewer than 12 words; placeholder or TODO-only recipes are not allowed (RC-08)`);
    }
    if (kind === "recipe") {
      const proc = secs.find((x) => x.title === "Procedure")?.content ?? "";
      if ((proc.match(/^\d+\.\s+\S/gm) ?? []).length < 3) error(c, `${r.rel}: "## Procedure" needs at least 3 numbered steps (RC-04)`);
      const tech = secs.find((x) => x.title === "Technology considerations")?.content ?? "";
      if (tech && !/Stack-neutral\./.test(tech) && !/^\|/m.test(tech) && !/^- /m.test(tech)) error(c, `${r.rel}: "## Technology considerations" must list stacks or begin "Stack-neutral." (RC-06)`);
      const caps = r.fields.capabilities;
      if (!Array.isArray(caps) || !caps.length) error(c, `${r.rel}: recipe needs a non-empty capabilities list (RC-01)`);
      else for (const id of caps) if (!/^CAP-\d{2}-\d{3}$/.test(id)) error(c, `${r.rel}: "${id}" is not a capability ID (CAP-DD-NNN)`);
    }
  }
  const n = Object.values(refFiles).flat().length;
  if (!results.some((r) => r.check === c && r.level === "ERROR")) pass(c, `${n} reference files declare a valid kind and carry the sections their kind requires`);
}

{ // V-08 links: resolve, stay inside the skill's own directory (D-016), max 2 hops, anchors exist, no unreachable references
  const c = "V-08 links";
  for (const s of skillDirs) {
    const skillRoot = path.join(SKILLS_DIR, s);
    const visit = (file, depth) => {
      for (const l of mdLinks(fs.readFileSync(file, "utf8"))) {
        const [target0, anchor] = l.split("#");
        const target = target0 ? path.resolve(path.dirname(file), target0) : file;
        const rel = path.relative(root, file).split(path.sep).join("/");
        if (!target.startsWith(skillRoot + path.sep)) { error(c, `${rel}: link "${l}" leaves the skill directory (D-016)`); continue; }
        if (!fs.existsSync(target)) { error(c, `${rel}: broken link "${l}"`); continue; }
        if (anchor !== undefined && !headings(fs.readFileSync(target, "utf8")).map(slug).includes(anchor)) error(c, `${rel}: link "${l}" points to a missing heading anchor (LD-05)`);
        if (!target0) continue;
        if (depth + 1 > 2) { error(c, `${rel}: link "${l}" exceeds 2 hops from SKILL.md`); continue; }
        if (target.endsWith(".md") && target !== file) visit(target, depth + 1);
      }
    };
    visit(path.join(skillRoot, "SKILL.md"), 0);
    const linked = new Set(mdLinks(skillMeta[s].text).map((l) => path.resolve(skillRoot, l.split("#")[0])));
    for (const r of refFiles[s]) if (!linked.has(path.join(skillRoot, "references", r.file))) error(c, `${s}/references/${r.file} is not linked from SKILL.md (unreachable, RF-02)`);
  }
  if (!results.some((r) => r.check === c && r.level === "ERROR")) pass(c, "all skill links and anchors resolve inside their own skill directory within 2 hops; every reference is reachable");
}

{ // V-10 wording, V-12 placeholders over every markdown file in the plugin
  const c10 = "V-10 wording", c12 = "V-12 placeholders";
  const rules = [
    [/\b(?:Bash|Read|Write|Edit|Grep|Glob|WebFetch|WebSearch|Skill) tool\b/, "provider-specific tool name (P-01)"],
    [/\$\{CLAUDE_[A-Z_]+\}/, "provider-only variable (P-01)"],
    [/\b(?:this skill|this guidance|chayen)\s+(?:guarantees|enforces|ensures security)\b/i, "enforcement claim (D-003)"],
    [/\b(?:fully|completely|100%|guaranteed)\s+secure\b/i, "absolute security claim (D-003)"],
    [/\bchayen\b(?!-)/i, "self-reference to Chayen in shipped content (SK-06)"],
  ];
  for (const f of walk(abs(PLUGIN_DIR_REL)).filter((x) => !x.dir && x.p.endsWith(".md"))) {
    const rel = path.relative(root, f.p).split(path.sep).join("/");
    if (/\/README\.md$/.test(rel)) continue; // human-facing package docs, not loaded as skill content
    const text = fs.readFileSync(f.p, "utf8");
    for (const [re, why] of rules) if (re.test(text)) error(c10, `${rel}: ${why}: "${text.match(re)[0]}"`);
    // Placeholder markers in prose. Code spans and fenced blocks are excluded, because a
    // recipe may legitimately name markers it searches for (for example `TODO` counts).
    const prose = text.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
    if (/\b(?:TODO|TBD|FIXME)\b|lorem ipsum/i.test(prose)) error(c12, `${rel}: placeholder text found`);
    // empty section: a heading whose next non-blank line is a heading of the same or higher level, or end of file
    const lines = text.replace(/```[\s\S]*?```/g, "```").split(/\r?\n/);
    lines.forEach((line, i) => {
      const h = line.match(/^(#{1,6})\s+\S/);
      if (!h) return;
      const next = lines.slice(i + 1).find((l) => l.trim() !== "");
      const nh = next?.match(/^(#{1,6})\s/);
      if (next === undefined || (nh && nh[1].length <= h[1].length)) warn(c12, `${rel}: heading "${line.trim()}" has no content`);
    });
  }
  if (!results.some((r) => r.check === c10 && r.level === "ERROR")) pass(c10, "no provider-specific tokens, enforcement claims, or self-references in skill content");
  if (!results.some((r) => r.check === c12 && r.level === "ERROR")) pass(c12, "no placeholder text or content-free recipe sections in plugin markdown");
}

// ---------- 6c. Catalog alignment (V-19) and recipe evaluation cases (V-22) ----------
let catalog = null;
{
  const c = "V-19 catalog-mapping";
  const rel = "catalog/engineering-capabilities.yaml";
  if (!exists(rel)) error(c, `${rel} is missing`);
  else {
    try { catalog = parseYamlSubset(fs.readFileSync(abs(rel), "utf8")); }
    catch (e) { error(c, `${rel}: invalid YAML (${e.message}); run tools/catalog/check-catalog.mjs`); }
  }
  if (catalog) {
    const capById = new Map((catalog.capabilities ?? []).map((x) => [x.id, x]));
    const catSkills = new Map((catalog.entry_skills ?? []).map((x) => [x.name, x]));
    for (const s of skillDirs) {
      if (!catSkills.has(s)) error(c, `${s}: shipped skill is not a catalog entry skill (CA-01)`);
      else if (catSkills.get(s).mapping !== "existing") error(c, `${s}: catalog marks the skill "${catSkills.get(s).mapping}", expected existing (CA-01)`);
    }
    const listed = new Map(); // recipe path -> Set(ids)
    for (const s of skillDirs) for (const r of refFiles[s]) {
      if (r.fields?.kind !== "recipe" || !Array.isArray(r.fields.capabilities)) continue;
      listed.set(r.rel, new Set(r.fields.capabilities));
      for (const id of r.fields.capabilities) {
        const cap = capById.get(id);
        if (!cap) { error(c, `${r.rel}: ${id} is not in the catalog (RC-01)`); continue; }
        if (cap.recipe?.path !== r.rel) error(c, `${r.rel}: ${id} ${cap.name} is mapped to ${cap.recipe?.path} in the catalog, not to this file (RC-01)`);
        if (cap.recipe?.mapping !== "existing") error(c, `${r.rel}: catalog recipe mapping for ${id} must be "existing" now that the file exists`);
        if (cap.status === "PLANNED") error(c, `${r.rel}: ${id} is listed in a recipe but PLANNED in the catalog; set IN_PROGRESS with existing_coverage, or remove it (RC-02)`);
      }
    }
    for (const cap of capById.values()) {
      if (cap.recipe?.mapping !== "existing") continue;
      const p = cap.recipe.path;
      const ref = Object.values(refFiles).flat().find((r) => r.rel === p);
      if (!ref) { error(c, `${cap.id}: catalog recipe ${p} does not exist in the plugin`); continue; }
      if (ref.fields?.kind !== "recipe") error(c, `${cap.id}: catalog recipe ${p} is kind "${ref.fields?.kind}", expected recipe (CA-02)`);
      else if (!listed.get(p)?.has(cap.id) && cap.status !== "PLANNED") error(c, `${cap.id}: mapped to ${p} but not listed in its capabilities and not PLANNED (RC-02)`);
    }
    if (!results.some((r) => r.check === c && r.level === "ERROR")) pass(c, `${skillDirs.length} skills are catalog entry skills; ${listed.size} recipe file(s) agree with the catalog (${[...listed.values()].reduce((n, x) => n + x.size, 0)} capabilities)`);

    const c22 = "V-22 recipe-cases";
    const crel = "tests/skills/recipe-cases.json";
    const spec = readJson(c22, crel);
    if (spec) {
      const ids = new Set(), have = {};
      for (const k of spec.cases ?? []) {
        if (ids.has(k.id)) error(c22, `duplicate case id ${k.id}`); ids.add(k.id);
        const cap = capById.get(k.capability);
        if (!cap) { error(c22, `${k.id}: unknown capability ${k.capability}`); continue; }
        if (!["positive", "negative"].includes(k.polarity)) error(c22, `${k.id}: polarity must be positive or negative`);
        if (!isStr(k.prompt) || k.prompt.length < 10) error(c22, `${k.id}: prompt missing`);
        else if (/chayen/i.test(k.prompt)) error(c22, `${k.id}: prompt mentions Chayen (REQ-03)`);
        if (!Array.isArray(k.checks) || !k.checks.length) error(c22, `${k.id}: at least one behaviour check is required`);
        const recipeLocal = cap.recipe.path.replace(/^skills\/[^/]+\//, "");
        const e = k.expect ?? {};
        if (k.polarity === "positive") {
          if (e.skill !== cap.entry_skill.name) error(c22, `${k.id}: positive case must expect the catalog entry skill ${cap.entry_skill.name}`);
          if (e.loads !== recipeLocal) error(c22, `${k.id}: positive case must expect loads "${recipeLocal}"`);
        } else if (k.polarity === "negative") {
          if (e.not_loads !== recipeLocal) error(c22, `${k.id}: negative case must expect not_loads "${recipeLocal}"`);
          if (e.skill !== undefined && e.skill !== "none" && !catSkills.has(e.skill)) error(c22, `${k.id}: unknown skill ${e.skill}`);
        }
        (have[k.capability] ??= { positive: 0, negative: 0 })[k.polarity] += 1;
      }
      for (const [p, set] of listed) for (const id of set) {
        const h = have[id] ?? { positive: 0, negative: 0 };
        if (h.positive < 1 || h.negative < 1) error(c22, `${id} (${p}): needs at least 1 positive and 1 negative case, has ${h.positive}/${h.negative} (RC-09)`);
      }
      if (!results.some((r) => r.check === c22 && r.level === "ERROR")) pass(c22, `${(spec.cases ?? []).length} recipe cases; every capability in an existing recipe has >=1 positive and >=1 negative case`);
    }
  }
}

{ // V-16 trigger test cases integrity
  const c = "V-16 trigger-cases";
  const rel = "tests/skills/trigger-cases.json";
  const spec = readJson(c, rel);
  if (spec) {
    const known = new Set(skillDirs), ids = new Set(), byCat = {}, posBySkill = {};
    if (JSON.stringify([...spec.skills].sort()) !== JSON.stringify(skillDirs)) error(c, `skills list ${JSON.stringify(spec.skills)} differs from plugin skills ${JSON.stringify(skillDirs)}`);
    for (const k of spec.cases) {
      if (ids.has(k.id)) error(c, `duplicate case id ${k.id}`); ids.add(k.id);
      if (!["positive", "negative", "ambiguous", "unsupported"].includes(k.category)) error(c, `${k.id}: invalid category`);
      byCat[k.category] = (byCat[k.category] ?? 0) + 1;
      if (/chayen/i.test(k.prompt)) error(c, `${k.id}: prompt mentions Chayen (REQ-03)`);
      const e = k.expect ?? {}, modes = ["any_of", "none", "none_or"].filter((m) => m in e);
      if (modes.length !== 1) error(c, `${k.id}: expect must have exactly one of any_of / none / none_or`);
      for (const s of [...(e.any_of ?? []), ...(e.none_or ?? []), ...(k.forbid ?? [])]) if (!known.has(s)) error(c, `${k.id}: unknown skill ${s}`);
      if ((e.any_of ?? []).some((s) => (k.forbid ?? []).includes(s))) error(c, `${k.id}: a skill is both expected and forbidden`);
      if (k.category === "positive" && e.any_of?.length !== 1) error(c, `${k.id}: positive cases expect exactly one skill`);
      if (k.category === "negative" && !e.none) error(c, `${k.id}: negative cases must expect none`);
      if (k.category === "positive") posBySkill[e.any_of[0]] = (posBySkill[e.any_of[0]] ?? 0) + 1;
    }
    for (const s of skillDirs) if ((posBySkill[s] ?? 0) < 3) error(c, `${s}: fewer than 3 positive cases`);
    for (const [cat, min] of [["negative", 5], ["ambiguous", 3], ["unsupported", 3]]) if ((byCat[cat] ?? 0) < min) error(c, `fewer than ${min} ${cat} cases`);
    if (!results.some((r) => r.check === c && r.level === "ERROR")) pass(c, `${spec.cases.length} cases: ${Object.entries(byCat).map(([k, v]) => `${k} ${v}`).join(", ")}; >=3 positives per skill`);
  }
}

// ---------- 7. Repository hygiene (RH-01..RH-03, as amended by D-013) ----------
{
  const c = "V-13 repo-hygiene";
  for (const p of ["plugin.json", "marketplace.json", ".plugin", ".claude/skills", ".github/skills", ".agents/skills", ".codex-plugin"])
    if (exists(p)) error(c, `"${p}" must not exist at the repo root (providers would misread the repo)`);
  if (!results.some((r) => r.check === c && r.level === "ERROR")) pass(c, "no provider-misreadable files at the repo root");
}

// ---------- Report ----------
const order = { ERROR: 0, WARN: 1, PASS: 2 };
results.sort((a, b) => order[a.level] - order[b.level] || a.check.localeCompare(b.check));
for (const r of results) console.log(`${r.level.padEnd(5)} ${r.check}: ${r.msg}`);
const errors = results.filter((r) => r.level === "ERROR").length;
const warnings = results.filter((r) => r.level === "WARN").length;
console.log(`\n${errors} error(s), ${warnings} warning(s), root=${root}`);
process.exit(errors ? 1 : 0);
