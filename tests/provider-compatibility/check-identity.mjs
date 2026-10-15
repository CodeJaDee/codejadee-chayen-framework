// Developer-only STEP 31 static check: plugin identity, manifest/marketplace precedence and
// skill discovery across Claude Code, Codex and Copilot. Read-only; no provider, model, install
// or network use. Never shipped with the plugin. Zero dependencies.
// Usage: node tests/provider-compatibility/check-identity.mjs [--root <repo>]
import fs from "node:fs";
import path from "node:path";
const i = process.argv.indexOf("--root");
const repo = path.resolve(i > -1 ? process.argv[i + 1] : path.join(import.meta.dirname, "../.."));
const j = (p) => JSON.parse(fs.readFileSync(path.join(repo, p), "utf8"));
const exists = (p) => fs.existsSync(path.join(repo, p));
const out = { checks: [] };
const check = (id, ok, detail) => out.checks.push({ id, result: ok ? "PASS" : "FAIL", detail });

const mps = { claude: ".claude-plugin/marketplace.json", codex: ".agents/plugins/marketplace.json", copilot: ".github/plugin/marketplace.json" };
const pluginDirs = new Set(), entryNames = [];
for (const [prov, f] of Object.entries(mps)) {
  const m = j(f);
  const entries = m.plugins.filter((p) => p.name === "codejadee-chayen-framework");
  check(`IC-01 ${prov} marketplace has exactly one entry`, entries.length === 1 && m.plugins.length === 1, `${f}: name=${m.name}, entries=${m.plugins.length}`);
  const src = typeof entries[0].source === "string" ? entries[0].source : entries[0].source.path;
  pluginDirs.add(path.resolve(repo, src));
  entryNames.push(m.name);
}
check("IC-02 all marketplaces point to one plugin directory", pluginDirs.size === 1, [...pluginDirs].map((d) => path.relative(repo, d)).join(", "));
check("IC-03 marketplace name identical", new Set(entryNames).size === 1, entryNames.join(", "));

const pd = path.relative(repo, [...pluginDirs][0]);
const ap = j(`${pd}/plugin.json`), cc = j(`${pd}/.claude-plugin/plugin.json`);
check("IC-04 root manifest declares Agent Plugins 1.0.0 $schema", ap.$schema === "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json", ap.$schema);
const shared = ["name", "version", "description", "author", "homepage", "repository", "license", "keywords"];
const diffs = shared.filter((k) => JSON.stringify(ap[k]) !== JSON.stringify(cc[k]));
check("IC-05 shared fields identical across both manifests", diffs.length === 0, diffs.length ? `differ: ${diffs}` : `name=${ap.name} version=${ap.version}`);
const gh = j(mps.copilot).plugins[0];
check("IC-06 Copilot marketplace entry version matches manifests", gh.version === ap.version, `${gh.version} vs ${ap.version}`);
const alt = [".codex-plugin/plugin.json", ".plugin/plugin.json", ".github/plugin/plugin.json", ".cursor-plugin/plugin.json"].filter((p) => exists(`${pd}/${p}`));
check("IC-07 no third manifest that could shadow or conflict", alt.length === 0, alt.length ? alt.join(", ") : "none of .codex-plugin/.plugin/.github/plugin/.cursor-plugin present");
const rootAlt = ["marketplace.json", ".plugin/marketplace.json", ".cursor-plugin/marketplace.json", ".agents/plugins/api_marketplace.json"].filter(exists);
check("IC-08 no higher-precedence stray marketplace file", rootAlt.length === 0, rootAlt.length ? rootAlt.join(", ") : "none present");

// Component discovery: immediate children of skills/ with SKILL.md
const sd = path.join(repo, pd, "skills");
const dirs = fs.readdirSync(sd, { withFileTypes: true }).filter((d) => d.isDirectory());
const skills = [];
for (const d of dirs) {
  const f = path.join(sd, d.name, "SKILL.md");
  if (!fs.existsSync(f)) continue;
  const fm = fs.readFileSync(f, "utf8").split(/\r?\n---/)[0];
  const name = /^name:\s*(.+)$/m.exec(fm)?.[1].trim().replace(/^["']|["']$/g, "");
  const desc = /^description:\s*(.+)$/m.exec(fm)?.[1].trim().replace(/^["']|["']$/g, "") ?? "";
  const refs = fs.existsSync(path.join(sd, d.name, "references")) ? fs.readdirSync(path.join(sd, d.name, "references"), { recursive: true }).filter((x) => x.endsWith(".md")).length : 0;
  skills.push({ dir: d.name, name, descChars: desc.length, refs });
}
check("IC-09 every skill directory has SKILL.md", skills.length === dirs.length, `${skills.length}/${dirs.length}`);
check("IC-10 name equals directory (VS Code/Agent Skills rule)", skills.every((s) => s.name === s.dir), skills.filter((s) => s.name !== s.dir).map((s) => s.dir).join(",") || "all match");
check("IC-11 skill names unique and collision-prefixed", new Set(skills.map((s) => s.name)).size === skills.length && skills.every((s) => /^chayen-[a-z0-9-]+$/.test(s.name) && s.name.length <= 64), `${skills.length} unique chayen-* names`);
check("IC-12 description <= 1024 chars (Copilot/VS Code/Agent Skills)", skills.every((s) => s.descChars > 0 && s.descChars <= 1024), `max ${Math.max(...skills.map((s) => s.descChars))}`);
const top = fs.readdirSync(path.join(repo, pd)).sort();
check("IC-13 plugin top level carries only manifests, README and skills", top.every((x) => ["plugin.json", ".claude-plugin", "README.md", "skills"].includes(x)), top.join(", "));
out.skills = skills;
out.totals = { skills: skills.length, references: skills.reduce((a, s) => a + s.refs, 0), files: fs.readdirSync(path.join(repo, pd), { recursive: true }).filter((x) => fs.statSync(path.join(repo, pd, x)).isFile()).length };
console.log(JSON.stringify(out, null, 2));
process.exit(out.checks.some((c) => c.result === "FAIL") ? 1 : 0);
