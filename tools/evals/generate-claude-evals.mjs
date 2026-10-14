#!/usr/bin/env node
// Developer-only generator: turns the provider-neutral trigger cases in
// tests/skills/trigger-cases.json into Claude Code `claude plugin eval` cases
// under tests/evals/claude/<case-id>/ (prompt.md + graders/*.md).
// Zero dependencies (Node.js >= 18). Never shipped with the plugin.
//
// Usage:
//   node tools/evals/generate-claude-evals.mjs          # (re)write the cases
//   node tools/evals/generate-claude-evals.mjs --check  # exit 1 if committed output is stale
//
// Case format reference: https://code.claude.com/docs/en/plugin-evals (prompt.md
// frontmatter; tool_used grader with tool/input_match/min/max; arm: both).

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..", "..");
const casesFile = path.join(root, "tests", "skills", "trigger-cases.json");
const outDir = path.join(root, "tests", "evals", "claude");
const check = process.argv.includes("--check");

const spec = JSON.parse(fs.readFileSync(casesFile, "utf8"));
const pluginRel = `../../../../plugins/${spec.plugin}`; // from tests/evals/claude/<id>/

const skillAlt = (names) => `(?:${names.join("|")})`;
const skillRegex = (names) => `'"skill"\\s*:\\s*"(?:[\\w-]+:)?${skillAlt(names)}"'`;
const anyChayenRegex = `'"skill"\\s*:\\s*"(?:[\\w-]+:)?chayen-'`;
const yamlStr = (s) => `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

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
    `plugins: ["${pluginRel}"]`,
    "runs: 3",
    "max_turns: 4",
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

if (check) {
  const problems = [];
  for (const [rel, body] of expected) {
    const p = path.join(outDir, rel);
    if (!fs.existsSync(p)) problems.push(`missing ${rel}`);
    else if (fs.readFileSync(p, "utf8") !== body) problems.push(`stale ${rel}`);
  }
  for (const rel of listExisting(outDir)) if (!expected.has(rel)) problems.push(`orphan ${rel}`);
  if (problems.length) { console.error(problems.join("\n")); console.error(`\n${problems.length} problem(s). Run: node tools/evals/generate-claude-evals.mjs`); process.exit(1); }
  console.log(`Claude eval cases up to date: ${spec.cases.length} cases, ${expected.size} files.`);
} else {
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
