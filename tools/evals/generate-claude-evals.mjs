#!/usr/bin/env node
// Developer-only generator: turns the provider-neutral trigger cases in
// tests/skills/trigger-cases.json into Claude Code `claude plugin eval` cases
// under tests/evals/claude/<case-id>/ (prompt.md + graders/*.md).
// Zero dependencies (Node.js >= 20.11, for import.meta.dirname). Never shipped with the plugin.
//
// Usage:
//   node tools/evals/generate-claude-evals.mjs                # (re)write the committed cases
//   node tools/evals/generate-claude-evals.mjs --check        # exit 1 if committed output is stale
//   node tools/evals/generate-claude-evals.mjs --stage <dir>  # copy the plugin to <dir>/<plugin>/ and
//                                                             # place the cases in its evals/ directory
//
// Why staging: `claude plugin eval` only loads plugins inside its containment
// root (the plugin enclosing the eval cases). Cases kept outside the plugin
// cannot load it (verified in Step 06, resolves U-12), and shipping evals/
// inside the distributable plugin is forbidden (V-09). Staging builds a
// throwaway plugin copy for test runs only.
//
// Case format reference: https://code.claude.com/docs/en/plugin-evals (prompt.md
// frontmatter; tool_used grader with tool/input_match/min/max; arm: both).

import fs from "node:fs";
import path from "node:path";
import { inside, safeId, assertTreeNoLinks } from "../validate/safe-paths.mjs";

const root = path.resolve(import.meta.dirname, "..", "..");
const casesFile = inside(root, "tests/skills/trigger-cases.json");
const outDir = inside(root, "tests/evals/claude");
const check = process.argv.includes("--check");
const stageIdx = process.argv.indexOf("--stage");
const stageDir = stageIdx > -1 ? path.resolve(process.argv[stageIdx + 1] ?? "") : null;

const spec = JSON.parse(fs.readFileSync(casesFile, "utf8"));
safeId(spec.plugin);
for (const name of spec.skills) safeId(name);
const declaredSkills = new Set(spec.skills);
const caseIds = new Set();
for (const c of spec.cases) {
  safeId(c.id);
  if (!["positive", "negative", "ambiguous", "unsupported"].includes(c.category)) throw new Error("unsafe eval category");
  for (const name of [...(c.expect.any_of ?? []), ...(c.expect.none_or ?? []), ...(c.forbid ?? [])]) {
    safeId(name);
    if (!declaredSkills.has(name)) throw new Error("undeclared eval skill");
  }
  if (caseIds.has(c.id)) throw new Error("duplicate eval case identifier");
  caseIds.add(c.id);
}

const skillAlt = (names) => `(?:${names.join("|")})`;
const skillRegex = (names) => `'"skill"\\s*:\\s*"(?:[\\w-]+:)?${skillAlt(names)}"'`;
const anyChayenRegex = `'"skill"\\s*:\\s*"(?:[\\w-]+:)?chayen-'`;
const yamlStr = (s) => JSON.stringify(String(s));

function grader({ inputMatch, min, max, arm }) {
  const lines = ["---", "type: tool_used", "tool: Skill", `input_match: ${inputMatch}`, `min: ${min}`];
  if (max !== undefined) lines.push(`max: ${max}`);
  if (arm) lines.push(`arm: ${arm}`);
  lines.push("---", "");
  return lines.join("\n");
}

function render(c) {
  const files = {};
  const skillTag = c.expect.any_of?.length === 1 ? [c.expect.any_of[0]] : [];
  const fm = [
    "---",
    `name: ${c.id}`,
    `description: ${yamlStr(`[${c.category}] generated from tests/skills/trigger-cases.json — do not edit by hand`)}`,
    `tags: [${[c.category, ...skillTag].join(", ")}]`,
    "runs: 3",
    "max_turns: 8",
    "timeout_seconds: 180",
    "allowed_tools: [Read, Glob, Grep, Skill]",
    `expected_outcome: ${yamlStr(describeExpectation(c))}`,
    "---",
    "",
    c.prompt,
    "",
  ];
  files["prompt.md"] = fm.join("\n");

  let forbid = [...(c.forbid ?? [])];
  if (c.expect.any_of) {
    files["graders/expected-skill.md"] = grader({ inputMatch: skillRegex(c.expect.any_of), min: 1 });
  } else if (c.expect.none) {
    files["graders/no-chayen-skill.md"] = grader({ inputMatch: anyChayenRegex, min: 0, max: 0, arm: "both" });
    forbid = [];
  } else if (c.expect.none_or) {
    forbid = [...new Set([...forbid, ...spec.skills.filter((s) => !c.expect.none_or.includes(s))])];
  }
  if (forbid.length) files["graders/forbidden-skills.md"] = grader({ inputMatch: skillRegex(forbid.sort()), min: 0, max: 0, arm: "both" });
  return files;
}

function describeExpectation(c) {
  if (c.expect.any_of) return `invokes ${c.expect.any_of.join(" or ")}${c.forbid?.length ? `; never ${c.forbid.join(", ")}` : ""}`;
  if (c.expect.none) return "invokes no chayen-* skill (native behavior)";
  return `invokes no chayen-* skill or only ${c.expect.none_or.join(", ")}`;
}

// Build the full expected file map.
const expected = new Map();
for (const c of spec.cases) for (const [rel, body] of Object.entries(render(c))) expected.set(path.join(c.id, rel), body);

function listExisting(dir, base = dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "results") listExisting(p, base, out); }
    else if (e.name !== "README.md") out.push(path.relative(base, p));
  }
  return out;
}

if (stageDir) {
  if (!process.argv[stageIdx + 1]) { console.error("--stage requires a directory"); process.exit(2); }
  if (!fs.existsSync(stageDir)) { console.error("--stage requires an existing scratch parent"); process.exit(2); }
  const src = inside(root, `plugins/${spec.plugin}`);
  const dest = inside(stageDir, spec.plugin);
  const packageRoot = fs.realpathSync(path.join(root, "plugins"));
  if (dest === packageRoot || dest.startsWith(packageRoot + path.sep)) { console.error("refusing to stage inside the shipped plugins/ directory"); process.exit(2); }
  if (fs.existsSync(dest)) { console.error("refusing to overwrite an existing staging destination; use a fresh scratch parent"); process.exit(2); }
  assertTreeNoLinks(src);
  fs.mkdirSync(dest);
  fs.cpSync(src, dest, { recursive: true });
  for (const [rel, body] of expected) { const p = path.join(dest, "evals", rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, body); }
  console.log(`Staged plugin + ${spec.cases.length} eval cases at ${dest}`);
  console.log("Staging is local only. Review the copy before separately authorizing any billed provider evaluation; prompts may leave the machine.");
} else if (check) {
  if (fs.existsSync(outDir)) assertTreeNoLinks(outDir);
  const problems = [];
  for (const [rel, body] of expected) {
    const p = path.join(outDir, rel);
    if (!fs.existsSync(p)) problems.push(`missing ${rel}`);
    else if (fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n") !== body) problems.push(`stale ${rel}`); // CRLF checkouts are not stale (DF-01)
  }
  for (const rel of listExisting(outDir)) if (!expected.has(rel)) problems.push(`orphan ${rel}`);
  if (problems.length) { console.error(problems.join("\n")); console.error(`\n${problems.length} problem(s). Run: node tools/evals/generate-claude-evals.mjs`); process.exit(1); }
  console.log(`Claude eval cases up to date: ${spec.cases.length} cases, ${expected.size} files.`);
} else {
  if (fs.existsSync(outDir)) assertTreeNoLinks(outDir);
  for (const rel of listExisting(outDir)) if (!expected.has(rel)) fs.rmSync(path.join(outDir, rel));
  for (const [rel, body] of expected) { const p = path.join(outDir, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, body); }
  // remove now-empty case directories
  if (fs.existsSync(outDir)) for (const d of fs.readdirSync(outDir, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const gd = path.join(outDir, d.name, "graders");
    if (fs.existsSync(gd) && fs.readdirSync(gd).length === 0) fs.rmdirSync(gd);
    if (fs.readdirSync(path.join(outDir, d.name)).length === 0) fs.rmdirSync(path.join(outDir, d.name));
  }
  console.log(`Wrote ${spec.cases.length} Claude eval cases (${expected.size} files) to ${path.relative(root, outDir)}`);
}
