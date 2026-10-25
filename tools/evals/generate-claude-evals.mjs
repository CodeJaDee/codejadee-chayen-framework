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
const regexLiteral = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function grader({ inputMatch, min, max, arm }) {
  const lines = ["---", "type: tool_used", "tool: Skill", `input_match: ${inputMatch}`, `min: ${min}`];
  if (max !== undefined) lines.push(`max: ${max}`);
  if (arm) lines.push(`arm: ${arm}`);
  lines.push("---", "");
  return lines.join("\n");
}

// D-078 behavioral cases use isolated, recognizable repositories. These fixtures
// and scaffolds are developer-only; --stage puts them in a scratch eval copy.
const initModes = {
  "pos-init-project-knowledge": "initialize",
  "pos-init-refresh": "refresh",
  "pos-init-monorepo-pointer": "monorepo",
  "pos-init-direct-write-report": "initialize",
};
const agentInstructions = "Use the repository's existing naming and test runner.\n";
const generatedHeader = (file) => `---\nschema: project-knowledge/1\nfile: ${file}\ngenerated_commit: none\ngenerated_date: 2026-10-01\nevidence:\n  - path: Api.csproj\n    blob: none\n---\n<!-- Generated. Refresh it instead of editing it by hand. Team rules go in rules.md. -->\n`;
const teamRules = "---\nschema: project-knowledge/1\nfile: rules\n---\n# Team rules\n\n## Constraints\nKeep release approval with the team. (Approved by fixture owner, 2026-10-01)\n\n## Open questions\n";

function initFixture(mode) {
  const api = {
    "Api.csproj": '<Project Sdk="Microsoft.NET.Sdk.Web">\n  <PropertyGroup><TargetFramework>net9.0</TargetFramework></PropertyGroup>\n</Project>\n',
    "Program.cs": 'var builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\napp.MapGet("/health", () => Results.Ok("ready"));\napp.MapGet("/version", () => Results.Ok("1"));\napp.Run();\n',
    "tests/Api.Tests/Api.Tests.csproj": '<Project Sdk="Microsoft.NET.Sdk">\n  <PropertyGroup><TargetFramework>net9.0</TargetFramework><IsTestProject>true</IsTestProject></PropertyGroup>\n  <ItemGroup>\n    <PackageReference Include="xunit" Version="2.9.3" />\n    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.14.1" />\n  </ItemGroup>\n</Project>\n',
    "tests/Api.Tests/HealthTests.cs": 'using Xunit;\npublic class HealthTests\n{\n    [Fact]\n    public void Ready_is_not_empty() => Assert.NotEmpty("ready");\n    [Fact]\n    public void Version_is_not_empty() => Assert.NotEmpty("1");\n}\n',
  };
  const files = {
    "AGENTS.md": agentInstructions,
    "README.md": "# Health API\nA minimal HTTP health service.\nBuild: `dotnet build Api.csproj`.\nTest: `dotnet test tests/Api.Tests/Api.Tests.csproj`.\n",
    ...api,
  };
  if (mode === "refresh") Object.assign(files, {
    ".chayen/profile.md": generatedHeader("profile") + "# Project profile\n\n## Stack\nfound: .NET 8 (Api.csproj:2).\n\n## Tests\nfound: tests/Old.Tests (README.md:4).\n",
    ".chayen/conventions.md": generatedHeader("conventions") + "# Conventions\n\n## Explicit\nunknown: no formatter configuration found.\n\n## Observed\nfound: HTTP routes use MapGet (Program.cs:3, Program.cs:4).\n",
    ".chayen/rules.md": teamRules,
  });
  if (mode === "monorepo") {
    for (const p of Object.keys(api)) { delete files[p]; files[`api/${p}`] = api[p]; }
    Object.assign(files, {
      "README.md": "# Health workspace\nThe api serves health endpoints. The web app displays their status.\n",
      "package.json": '{"private":true,"workspaces":["web"]}\n',
      "web/package.json": '{"name":"web","private":true,"type":"module","scripts":{"test":"node --test"}}\n',
      "web/index.html": '<!doctype html>\n<title>Health</title>\n<div id="app"></div>\n<script type="module" src="./src/main.js"></script>\n',
      "web/src/main.js": 'import { statusLabel } from "./status.js";\ndocument.querySelector("#app").textContent = statusLabel("ready");\n',
      "web/src/status.js": 'export function statusLabel(value) { return `Status: ${value}`; }\n',
      "web/src/status.test.js": 'import test from "node:test";\nimport assert from "node:assert/strict";\nimport { statusLabel } from "./status.js";\ntest("labels ready", () => assert.equal(statusLabel("ready"), "Status: ready"));\ntest("labels down", () => assert.equal(statusLabel("down"), "Status: down"));\n',
    });
  }
  return files;
}

function initBehavior(c) {
  const mode = initModes[c.id];
  if (!mode) return {};
  const fixtures = initFixture(mode);
  for (const p of Object.keys(fixtures)) inside(root, p);
  const encoded = Buffer.from(JSON.stringify(fixtures)).toString("base64");
  const files = {
    "case.yaml": `schema_version: "1.1"\nname: ${c.id}\ncontext:\n  scaffold_script: scaffold.sh\n`,
    "scaffold.sh": `#!/usr/bin/env bash\nset -eu\n# Generated developer-only fixture. Run only in the eval's empty workspace.\nnode --input-type=module <<'INIT_FIXTURE'\nimport fs from 'node:fs';\nimport path from 'node:path';\nconst files = JSON.parse(Buffer.from('${encoded}', 'base64').toString('utf8'));\nfor (const [file, body] of Object.entries(files)) {\n  fs.mkdirSync(path.dirname(file), { recursive: true });\n  fs.writeFileSync(file, body, { flag: 'wx' });\n}\nINIT_FIXTURE\n`,
    "graders/direct-writes.md": `---\ntype: llm\nfocus: trace\n---\nPASS only when the transcript shows actual writes to generated project knowledge before any request to approve file content. A plan, preview, or claim of writing alone fails. The prompt does not ask for builds or tests: do not ask about command permission or run them. The only user question may be one combined pointer-block approval question at the end, after generating the knowledge and run report. Do not ask about production versions, deployment, branch rules or approvals; record unknowns in the new rules file, or the report when rules already exist. Do not change instruction files without pointer approval. FAIL if a content-approval gate stops generation or if the evidence of writing is missing.\n`,
    "graders/pointer-approval.md": `---\ntype: llm\nfocus: last_message\n---\nPASS only when the response reports completed generation, identifies the persisted init-report.md, and asks once to approve a concrete proposed pointer block in AGENTS.md. It must show the proposed block or diff for review, and must not ask for approval of generated file content. A mere offer to generate files later fails.\n`,
    "graders/instructions-preserved.md": `---\ntype: regex\ntarget: { source: file, path: AGENTS.md }\npattern: ${yamlStr(`^${regexLiteral(agentInstructions)}$`)}\n---\n`,
    "graders/report.md": `---\ntype: llm\nfocus: { source: file, path: .chayen/init-report.md }\n---\nPASS only when the generated report has schema project-knowledge/1, mode, date, generated_commit, detected units and stacks, actual files written or changed, inspected folders and files, notable uninspected paths with reasons, unknowns and evidence gaps, proposed improvements (or an explicit none), and recommended follow-up. Commands must remain DISCOVERED because the request did not ask to run them. A missing report or a preview presented as completed work fails.\n`,
    "graders/report-budget.md": `---\ntype: regex\ntarget: { source: file, path: .chayen/init-report.md }\npattern: ${yamlStr("^(?:[^\\n]*\\n){0,119}[^\\n]*\\n?$")}\n---\n`,
  };
  for (const file of ["profile.md", "conventions.md", "init-report.md"]) {
    files[`graders/schema-${file}`] = `---\ntype: regex\ntarget: { source: file, path: .chayen/${file} }\npattern: ${yamlStr("^---\\r?\\n(?:(?!---(?:\\r?\\n|$))[^\\n]*\\n)*schema: project-knowledge/1\\r?\\n(?:(?!---(?:\\r?\\n|$))[^\\n]*\\n)*---(?:\\r?\\n|$)")}\n---\n`;
  }
  if (mode === "refresh") {
    files["graders/rules-preserved.md"] = `---\ntype: regex\ntarget: { source: file, path: .chayen/rules.md }\npattern: ${yamlStr(`^${regexLiteral(teamRules)}$`)}\n---\n`;
    files["graders/refreshed-profile.md"] = `---\ntype: regex\ntarget: { source: file, path: .chayen/profile.md }\npattern: ${yamlStr("^(?![\\s\\S]*(?:\\.NET 8|tests/Old\\.Tests))(?=[\\s\\S]*(?:net9\\.0|\\.NET 9))(?=[\\s\\S]*tests/Api\\.Tests)")}\n---\n`;
  } else {
    for (const p of ["profile.md", "conventions.md", "rules.md", "init-report.md", ...(mode === "monorepo" ? ["units/api.md", "units/web.md"] : [])]) {
      files[`graders/created-${p.replaceAll("/", "-")}`] = `---\ntype: file_exists\npath: .chayen/${p}\n---\n`;
    }
  }
  return files;
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
    `max_turns: ${initModes[c.id] ? 30 : 8}`,
    `timeout_seconds: ${initModes[c.id] ? 300 : 180}`,
    `allowed_tools: ${initModes[c.id] ? "[Read, Glob, Grep, Skill, AskUserQuestion, Write, Edit, Bash]" : "[Read, Glob, Grep, Skill]"}`,
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
  return { ...files, ...initBehavior(c) };
}

function describeExpectation(c) {
  if (c.expect.any_of) return `invokes ${c.expect.any_of.join(" or ")}${c.forbid?.length ? `; never ${c.forbid.join(", ")}` : ""}${initModes[c.id] ? "; writes generated knowledge directly and persists init-report.md before asking once about pointer approval" : ""}`;
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
  for (const [rel, body] of expected) {
    const p = path.join(outDir, rel);
    // Preserve unchanged fixtures and the checkout's line endings.
    const previous = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
    if (previous.replace(/\r\n/g, "\n") === body) continue;
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, previous.includes("\r\n") ? body.replace(/\n/g, "\r\n") : body);
  }
  // remove now-empty case directories
  if (fs.existsSync(outDir)) for (const d of fs.readdirSync(outDir, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const gd = path.join(outDir, d.name, "graders");
    if (fs.existsSync(gd) && fs.readdirSync(gd).length === 0) fs.rmdirSync(gd);
    if (fs.readdirSync(path.join(outDir, d.name)).length === 0) fs.rmdirSync(path.join(outDir, d.name));
  }
  console.log(`Wrote ${spec.cases.length} Claude eval cases (${expected.size} files) to ${path.relative(root, outDir)}`);
}
