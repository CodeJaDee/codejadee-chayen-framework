#!/usr/bin/env node
// Developer-only documentation check (STEP 33). Offline and read-only; never shipped.
// Checks the user and release documentation:
//   D-01 every relative Markdown link resolves to an existing file inside the repository
//   D-02 every #anchor (same file or other Markdown file) matches a GitHub-style heading slug
//   D-03 every <plugin>@<marketplace> identifier equals the manifest name and marketplace names
//   D-04 every chayen-* skill name is a real skill directory
//   D-05 version strings X.Y.Z-dev / X.Y.Z near "version" match the manifests' version or a
//        documented proposal (docs/distribution/*, CHANGELOG.md)
// External http(s) links are listed, not fetched.
// Zero dependencies (Node.js >= 20.11, for import.meta.dirname).
//
// Usage: node tools/validate/check-docs.mjs [--root <repo>] [--list-external]

import fs from "node:fs";
import path from "node:path";

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

const pluginDir = path.join(root, "plugins/codejadee-chayen-framework");
const manifest = JSON.parse(fs.readFileSync(path.join(pluginDir, "plugin.json"), "utf8"));
const marketplaces = [".claude-plugin/marketplace.json", ".agents/plugins/marketplace.json", ".github/plugin/marketplace.json"]
  .map((p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8")).name);
const skills = new Set(fs.readdirSync(path.join(pluginDir, "skills")).filter((d) => fs.existsSync(path.join(pluginDir, "skills", d, "SKILL.md"))));

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
    if (m[1].startsWith("codejadee") || m[2].startsWith("codejadee")) {
      if (m[1] !== manifest.name || !marketplaces.includes(m[2])) err("D-03", file, `identifier ${m[0]} does not match ${manifest.name}@${marketplaces[0]}`);
    }
  }
  for (const m of text.matchAll(/\bchayen-[a-z]+(?:-[a-z]+)*\b/g)) {
    if (m[0].endsWith("-framework") || m[0] === "chayen-framework") continue;
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
