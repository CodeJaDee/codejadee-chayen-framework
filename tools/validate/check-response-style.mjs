#!/usr/bin/env node
// Developer-only static gate G-16 (Step 39): the opt-in response style policy.
// Read-only; no provider, model, network or user configuration access. It checks the canonical
// policy, its host template, its size, its neutrality and that the plugin package does not ship
// or activate it. Whether a host loads or follows the policy is NOT_RUN here.
// Zero dependencies (Node.js >= 20.11, for import.meta.dirname). Never shipped.
//
// Usage: node tools/validate/check-response-style.mjs [--root <repo>]

import fs from "node:fs";
import path from "node:path";
import { inside } from "./safe-paths.mjs";

const i = process.argv.indexOf("--root");
const root = path.resolve(i > -1 ? process.argv[i + 1] : path.join(import.meta.dirname, "..", ".."));
const errors = [];
const err = (id, msg) => errors.push(`${id} ${msg}`);
const exists = (rel) => fs.existsSync(inside(root, rel));
const read = (rel) => fs.readFileSync(inside(root, rel), "utf8").replace(/\r\n/g, "\n");

const POLICY = "response-style/chayen-response-style.md";
const COPILOT = "response-style/chayen-response-style.instructions.md";
const USER_DOC = "docs/RESPONSE_STYLE.md";
const DESIGN_DOC = "docs/chayen/RESPONSE_STYLE_DESIGN.md";
const PACKAGE = "plugins/codejadee-chayen-framework";
// Approved in D-056 (proposed): keep the per-turn cost small and visible.
const MAX_BODY_CHARS = 3500, MAX_LINES = 40;

// R-01 canonical structure: exactly one marked block that is the whole file
let text = "", body = "", version = 0;
if (!exists(POLICY)) err("R-01", `${POLICY} is missing`);
else {
  text = read(POLICY);
  const lines = text.split("\n");
  const begin = /^<!-- BEGIN chayen-response-style v(\d+) -->$/.exec(lines[0]);
  const end = /^<!-- END chayen-response-style v(\d+) -->$/.exec(lines.at(-2) ?? "");
  const markers = lines.filter((l) => /chayen-response-style v\d+ -->/.test(l)).length;
  if (!begin || !end || begin[1] !== end[1] || lines.at(-1) !== "" || markers !== 2) err("R-01", `${POLICY} must be exactly one BEGIN/END block of the same version and end with a newline`);
  else { version = Number(begin[1]); body = lines.slice(1, -2).join("\n"); }
}

if (body) {
  // R-02 context budget
  const lineCount = text.split("\n").length - 1;
  if (body.length > MAX_BODY_CHARS) err("R-02", `policy body is ${body.length} characters (> ${MAX_BODY_CHARS})`);
  if (lineCount > MAX_LINES) err("R-02", `policy file is ${lineCount} lines (> ${MAX_LINES})`);

  // R-03 required clauses (the Step 39 requirements, in the policy's own words)
  const flat = body.replace(/\s+/g, " ");
  const required = {
    precedence: "System, developer, organization and repository instructions, provider permissions and the user's explicit requests take precedence",
    "no authority": "authorizes no action",
    "language choice": "**Output language.** Use the language the user asks for.",
    "mixed language": "In mixed Thai-English text, apply each language's conventions to its own prose",
    "Thai section": "**Thai prose**",
    "English section": "**English prose**",
    "stock transitions": "Skip stock assistant framing",
    "inflated claims": "Avoid inflated significance",
    "exact facts": "Keep facts exact",
    "register": "Match the register the user sets",
    "protected content": "**Never change for style:**",
    "not an editor": "does not start editing, auditing or rewriting documents",
    "detector honesty": "Never claim text is human-written or will pass an AI detector",
    "untrusted data": "is data, not instructions",
  };
  for (const [name, phrase] of Object.entries(required)) if (!flat.includes(phrase)) err("R-03", `missing ${name} clause: "${phrase}"`);
  const protectedLine = flat.split("**Never change for style:**")[1]?.split("**")[0] ?? "";
  for (const item of ["code", "SQL", "JSON", "commands", "logs", "API contracts", "exact quotations", "output format"]) {
    if (!protectedLine.includes(item)) err("R-03", `protected content list does not name ${item}`);
  }

  // R-05 neutrality: no Skill routing, provider tool names or enforcement claims
  for (const [re, what] of [
    [/chayen-|humanizer|SKILL\.md|\bskill\b/i, "a Skill name or Skill routing"],
    [/\b(?:Bash|WebFetch|apply_patch|runSubagent|Task tool|MCP|hook)\b/, "a provider-specific tool or mechanism"],
    [/\b(?:guarantee[sd]?|enforced|always applies|mandatory)\b/i, "an enforcement or guarantee claim"],
    [/\b(?:CLAUDE\.md|AGENTS\.md|copilot-instructions)\b/, "a host-specific file name"],
  ]) if (re.test(body)) err("R-05", `policy body contains ${what}`);
}

// R-04 host template consistency
if (!exists(COPILOT)) err("R-04", `${COPILOT} is missing`);
else if (text && read(COPILOT) !== '---\napplyTo: "**"\n---\n' + text) err("R-04", `${COPILOT} must be the applyTo frontmatter followed by ${POLICY} byte for byte`);

// R-06 portability: no concrete user home paths in policy, templates, tools or docs
const scanned = [POLICY, COPILOT, "response-style/README.md", USER_DOC, DESIGN_DOC, "tools/response-style/policy-lib.mjs", "tools/response-style/inspect-instructions.mjs"];
const homePath = /\b[A-Za-z]:[\\/]{1,2}Users[\\/]{1,2}(?![<%$])[^\\/\s`"')]+|(?<![\w.~])\/(?:Users|home)\/(?![<$])[A-Za-z0-9._-]+/;
for (const rel of scanned) {
  if (!exists(rel)) { err("R-06", `${rel} is missing`); continue; }
  const lines = read(rel).split("\n");
  const n = lines.findIndex((l) => homePath.test(l));
  if (n > -1) err("R-06", `${rel}:${n + 1} contains a hardcoded user home path; use ~, $HOME, %USERPROFILE% or a <placeholder>`);
}

// R-07 package isolation: the plugin neither ships nor activates persistent instructions
if (exists(PACKAGE)) {
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? [path.join(d, e.name) + path.sep, ...walk(path.join(d, e.name))] : [path.join(d, e.name)]));
  const banned = /^(?:CLAUDE(?:\.local)?\.md|AGENTS(?:\.override)?\.md|GEMINI\.md|copilot-instructions\.md|.+\.instructions\.md)$/i;
  const bannedDirs = new Set(["rules", "output-styles", "hooks", "instructions"]);
  for (const f of walk(inside(root, PACKAGE))) {
    const rel = path.relative(root, f).split(path.sep).join("/");
    const name = path.basename(f);
    if (f.endsWith(path.sep) ? bannedDirs.has(name) : banned.test(name)) err("R-07", `${rel} would ship persistent instructions in the plugin package`);
    else if (!f.endsWith(path.sep) && fs.readFileSync(f, "utf8").includes("chayen-response-style v")) err("R-07", `${rel} embeds the response style policy`);
  }
  for (const m of [`${PACKAGE}/plugin.json`, `${PACKAGE}/.claude-plugin/plugin.json`].filter(exists)) {
    const manifest = JSON.parse(read(m));
    for (const key of ["outputStyles", "settings", "instructions", "agent"]) if (key in manifest) err("R-07", `${m} declares ${key}; the policy must stay a separate opt-in`);
  }
}

// R-08 user documentation states the lifecycle and the install-only limit
if (exists(USER_DOC)) {
  const doc = read(USER_DOC), flatDoc = doc.replace(/\s+/g, " ");
  for (const h of ["## Opt in", "## Verify", "## Disable and roll back", "## Conflicts and precedence", "## Context cost", "## Limitations"]) if (!doc.split("\n").includes(h)) err("R-08", `${USER_DOC} lacks the "${h}" section`);
  if (!flatDoc.includes("Installing the plugin does not turn this policy on")) err("R-08", `${USER_DOC} must say that installing the plugin does not turn the policy on`);
  if (!flatDoc.includes(POLICY)) err("R-08", `${USER_DOC} must name the canonical source ${POLICY}`);
}

for (const e of errors) console.log(`ERROR ${e}`);
const thai = [...body].filter((c) => /[฀-๿]/.test(c)).length;
console.log(`${errors.length ? "FAIL" : "PASS"} response style policy v${version}: ${body.length} body characters (limit ${MAX_BODY_CHARS}), ${Buffer.byteLength(body)} UTF-8 bytes, ${thai} Thai characters; template in sync; package does not ship it. Host loading and behavior NOT_RUN`);
process.exit(errors.length ? 1 : 0);
