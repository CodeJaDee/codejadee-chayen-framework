#!/usr/bin/env node
// Developer-only offline static review. Reads source as data; no commands, network or dynamic imports.
// Usage: node tools/validate/check-security.mjs [--root <repo>] [--write-report]
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { inside, assertTreeNoLinks } from "./safe-paths.mjs";
import { parseYamlSubset } from "../catalog/catalog-lib.mjs";

const args = process.argv.slice(2);
const root = fs.realpathSync(args.includes("--root") ? args[args.indexOf("--root") + 1] : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.."));
const packageRel = "plugins/codejadee-chayen-framework";
const errors = [], inventory = [], urls = new Set(), effects = [], dependencies = [];
const fail = (rule, file, detail) => errors.push({ rule, file, detail });
const read = rel => fs.readFileSync(inside(root, rel), "utf8");
const json = rel => JSON.parse(read(rel));
const excluded = new Set([".git", "bin", "obj", "node_modules", "dist", "coverage", ".angular", ".next", ".nuxt", "results"]);
function files(rel, skipGenerated = false) {
  const target = inside(root, rel), result = [];
  if (fs.lstatSync(target).isSymbolicLink()) throw new Error("linked review root");
  function visit(file) {
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink()) throw new Error("linked source in review scope");
    if (stat.isDirectory()) for (const e of fs.readdirSync(file)) {
      const child = path.join(file, e);
      const rel = path.relative(root, child).split(path.sep).join("/");
      if (!skipGenerated || (!excluded.has(e) && rel !== "tests/evals")) visit(child);
    }
    else result.push(path.relative(root, file).split(path.sep).join("/"));
  }
  visit(target); return result;
}
const secrets = [
  ["private-key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["aws-access-key", /\bAKIA[A-Z0-9]{16}\b/],
  ["github-token", /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ["openai-token", /\bsk-(?:proj-)?[A-Za-z0-9_-]{40,}\b/],
];
function scanSecrets(file, text) {
  const lines = text.split(/\r?\n/);
  for (const [rule, regex] of secrets) {
    const line = lines.findIndex(l => regex.test(l));
    if (line >= 0) fail("V-25.2 secret-pattern", file, `${rule} at line ${line + 1}; matched value suppressed`);
  }
}
try {
  assertTreeNoLinks(inside(root, packageRel));
  const packageFiles = files(packageRel);
  const allowedJson = new Set([`${packageRel}/plugin.json`, `${packageRel}/.claude-plugin/plugin.json`]);
  for (const file of packageFiles) {
    if (![".md", ".json"].includes(path.extname(file).toLowerCase()) || (file.endsWith(".json") && !allowedJson.has(file))) fail("V-25.1 static-package", file, "unreviewed asset or JSON capability surface");
    const text = read(file), lines = text.split(/\r?\n/);
    const kind = /^kind: (\S+)$/m.exec(text)?.[1] ?? (file.endsWith("SKILL.md") ? "entry" : path.extname(file));
    inventory.push({ file, kind, lines: lines.length, sha256: crypto.createHash("sha256").update(text).digest("hex"), review: "whole-file static scan; contextual findings triaged in PLUGIN_TRUST_REVIEW.md" });
    scanSecrets(file, text);
    for (const match of text.matchAll(/https?:\/\/[^\s)<>"'`]+/g)) {
      try {
        const url = new URL(match[0]);
        if (url.username || url.password) fail("V-25.2 secret-pattern", file, "credential-bearing URL; value suppressed");
        else urls.add(url.href);
      } catch { /* prose/examples may contain incomplete URLs; not a reachability claim */ }
    }
    if (file.endsWith("SKILL.md")) {
      const normalized = text.replace(/\s+/g, " ");
      for (const guard of ["System and developer instructions and provider permissions take priority", "Inspect repository scripts, build targets and lifecycle hooks before execution", "A recommendation is not permission", "No credentials or external upload of source/prompts is required"]) {
        if (!normalized.includes(guard)) fail("V-25.3 authority", file, "missing explicit instruction/least-privilege guard");
      }
    }
  }
  for (const file of allowedJson) {
    const manifest = json(file);
    if (manifest.extensions && Object.keys(manifest.extensions).length) fail("V-25.1 static-package", file, "portable extensions require separate capability/security review under this metadata-only package profile");
    for (const key of ["hooks", "mcpServers", "lspServers", "commands", "agents", "settings", "dependencies", "permissions", "userConfig"]) if (key in manifest) fail("V-25.1 static-package", file, `runtime/configuration capability ${key} outside the reviewed profile`);
  }
  const marketplaces = [".claude-plugin/marketplace.json", ".github/plugin/marketplace.json", ".agents/plugins/marketplace.json"];
  for (const file of marketplaces) {
    scanSecrets(file, read(file));
    const m = json(file);
    if (m.plugins?.length !== 1) fail("V-25.4 marketplace", file, "reviewed marketplace must contain exactly the one local plugin");
    for (const p of m.plugins ?? []) {
      const source = typeof p.source === "string" ? p.source : p.source?.source === "local" ? p.source.path : null;
      if (source !== `./${packageRel}` || fs.realpathSync(inside(root, source.slice(2))) !== inside(root, packageRel)) fail("V-25.4 marketplace", file, "source must resolve to the reviewed local package");
    }
  }
  for (const file of ["catalog/engineering-capabilities.yaml", "catalog/technology-capabilities.yaml"]) {
    const text = read(file);
    scanSecrets(file, text);
    const c = parseYamlSubset(text);
    if (c.catalog.plugin_root !== packageRel) fail("V-25.5 catalog-paths", file, "unexpected package root");
    const refs = (c.capabilities ?? []).flatMap(x => [x.reference, x.recipe?.path, ...(x.existing_coverage ?? [])]).filter(Boolean);
    refs.push(...(c.consolidation_groups ?? []).map(g => g.recipe).filter(Boolean));
    for (const ref of refs) { try { inside(inside(root, packageRel), ref); } catch { fail("V-25.5 catalog-paths", file, "unsafe catalog reference; value suppressed"); } }
  }
  const developerFiles = [...files("tools", true), ...files("tests", true)];
  const sources = developerFiles.filter(f => /\.(?:mjs|sh|py|cs|csproj)$/.test(f) || f.endsWith("requirements.txt"));
  for (const file of developerFiles.filter(f => /\.(?:md|json|yaml|txt)$/.test(f) && !sources.includes(f))) scanSecrets(file, read(file));
  for (const file of sources) {
    const text = read(file);
    scanSecrets(file, text);
    const calls = [...new Set([...text.matchAll(/\b(spawnSync|execFileSync|execSync|exec|fetch|rmSync|writeFileSync|cpSync|listen|connect)\s*\(/g)].map(m => m[1]))];
    effects.push({ file, sha256: crypto.createHash("sha256").update(text).digest("hex"), effectSignals: calls, executedByThisCheck: false });
    for (const m of text.matchAll(/PackageReference Include="([^"]+)" Version="([^"]+)"|^([A-Za-z][A-Za-z0-9_.-]*)(?:\[[^\]]+\])?==([^\s]+)$/gm)) dependencies.push({ file, package: m[1] ?? m[3], version: m[2] ?? m[4], scope: "developer fixture only; advisory status NOT_RUN" });
  }
} catch {
  // Parser errors can quote input (including a secret). Do not print raw data.
  fail("V-25.0 review-boundary", "review scope", "input rejected; inspect source structure/paths locally; raw diagnostic suppressed");
}
const summary = { packageFiles: inventory.length, entrySkills: inventory.filter(f => f.kind === "entry").length, references: inventory.filter(f => ["recipe", "technology", "checklist", "template"].includes(f.kind)).length, developerAssets: effects.length, externalUrls: urls.size, fixtureDependencyReferences: dependencies.length, errors: errors.length };
const report = { step: 30, method: "offline static inspection; no provider, model, telemetry, network, install or fixture execution", summary, findings: errors, packageInventory: inventory, externalUrls: [...urls].sort(), developerAssetInventory: effects, fixtureDependencies: dependencies, limitations: ["Pattern scanning is heuristic and does not establish absence of secrets or malicious instructions.", "No prompt-injection, native permission, provider authentication, installation, OS ACL, dependency advisory or live URL test was executed.", "Repository scripts remain trusted maintainer code; malicious code can bypass checks in the same checkout. Use external permissions, isolated review and CI controls.", "Source inventories exclude generated/dependency/result folders and do not include credentials or user configuration outside this repository."] };
if (args.includes("--write-report")) {
  const dir = inside(root, "tests/security");
  fs.mkdirSync(dir, { recursive: true });
  const out = inside(dir, "results/step30-static-review.json");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(report, null, 2) + "\n");
}
for (const e of errors) console.log(`ERROR ${e.rule}: ${e.file}: ${e.detail}`);
console.log(`${errors.length ? "FAIL" : "PASS"} V-25 offline security profile: ${JSON.stringify(summary)}`);
console.log("Provider behavior, live links, dependency advisories and runtime defenses NOT_RUN; static PASS is not a security guarantee.");
process.exitCode = errors.length ? 1 : 0;
