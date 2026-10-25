// Developer-only limit-migration regressions (D-066, ADR-0013, evolution Step 06). Offline; never shipped.
// 1. No former repository cap is enforced anywhere in tools/ (static scan).
// 2. The authoritative rule rows (authoring standard, quality gates, validator README) do not state a removed cap.
// 3. One disposable package that exceeds every former limit at once (18 Skills, SKILL.md and reference over 300
//    lines, a nested reference 4 links deep, discovery metadata over 7,000 characters) passes the package,
//    catalog and security validators.
// 4. Malicious, malformed, conflicting and structurally invalid changes to that package still fail.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { inside, assertTreeNoLinks } from "../../tools/validate/safe-paths.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const COPY = ["plugins", ".claude-plugin", ".github/plugin", ".agents/plugins", "catalog", "tests/skills", "tools", "docs/chayen/CAPABILITY_COVERAGE.md"];
const SKILLS = "plugins/codejadee-chayen-framework/skills";
// Diagnostics of every removed cap (count, lines, depth, L0, allow-lists). None may appear.
const FORMER_CAP = /entry skills >|entry skills exceed|count exceeds|lines > 300|exceeds 2 hops|line-budgets|L0 metadata \d+ chars >|metadata-budget|outside the approved|allow-list/i;

// ---------- 1. static scan of enforcement code ----------
test("no former numeric cap or name allow-list is enforced in tools/", () => {
  const files = fs.readdirSync(inside(repo, "tools"), { recursive: true }).filter((f) => f.endsWith(".mjs"));
  const banned = /\bMAX_ENTRY_SKILLS\b|\bL0_BUDGET\b|\bPROJECT_NAMES\b|lines > 300|exceeds 2 hops|entry skills >|count exceeds|outside the approved/;
  const hits = files.filter((f) => banned.test(fs.readFileSync(path.join(repo, "tools", f), "utf8")));
  assert.deepEqual(hits, []);
});

// ---------- 2. rule documents agree with the implementation ----------
test("authoritative rule rows state no removed cap", () => {
  const rows = [
    ["docs/chayen/SKILL_AUTHORING_STANDARD.md", ["| L0 |", "| L1 |", "| L2 |", "| PT-06 |", "| SB-01 |", "| DS-05 |", "| RF-02 |", "| RF-03 |", "| RF-04 |", "| CA-01 |"]],
    ["docs/chayen/SKILL_QUALITY_GATES.md", ["| G-06 |", "| G-07 |", "| G-08 |"]],
    ["tools/validate/README.md", ["| V-06 |", "| V-07 / V-07b |", "| V-08 |"]],
  ];
  // A stated former value is allowed only when it is marked as former ("formerly ...", "before D-066").
  const removedCap = /≤ ?300|≤ ?2 hops|2 hops from|≤ ?7,000|maximum 1[56]\b|fit maximum|≤ ?1[56] (?:registered|Skills|entry)/i;
  for (const [file, prefixes] of rows) {
    const lines = fs.readFileSync(inside(repo, file), "utf8").split(/\r?\n/);
    for (const prefix of prefixes) {
      const row = lines.find((l) => l.startsWith(prefix));
      assert.ok(row, `${file}: row ${prefix} not found`);
      const current = row.replace(/\(?(?:formerly|before D-066)[^)|]*\)?/gi, "");
      assert.doesNotMatch(current, removedCap, `${file}: ${prefix} states a removed cap`);
    }
  }
});

// ---------- 3. one package beyond every former limit ----------
function fixture(t) {
  const parent = fs.realpathSync(os.tmpdir()), root = fs.mkdtempSync(path.join(parent, "chayen-limits-"));
  t.after(() => { assert.equal(path.dirname(root), parent); fs.rmSync(root, { recursive: true, force: true }); });
  for (const rel of COPY) { const source = inside(repo, rel); assertTreeNoLinks(source); fs.cpSync(source, inside(root, rel), { recursive: true }); }
  return root;
}
const run = (args) => { const r = spawnSync(process.execPath, args, { cwd: repo, encoding: "utf8", timeout: 120_000 }); return { code: r.status, signal: r.signal, out: `${r.stdout ?? ""}${r.stderr ?? ""}`, stdout: r.stdout ?? "" }; };
const VALIDATORS = {
  package: (root) => run([inside(repo, "tools/validate/validate-package.mjs"), root]),
  catalog: (root) => run([inside(repo, "tools/catalog/check-catalog.mjs"), "--root", root]),
  security: (root) => run([inside(repo, "tools/validate/check-security.mjs"), "--root", root]),
};
const edit = (root, rel, change) => { const f = inside(root, rel); fs.writeFileSync(f, change(fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n"))); };
const readJson = (root, rel) => JSON.parse(fs.readFileSync(inside(root, rel), "utf8"));
const writeJson = (root, rel, v) => fs.writeFileSync(inside(root, rel), JSON.stringify(v, null, 2) + "\n");
const EXTRA = [
  ["chayen-notes-alpha", "Draft a repository glossary of schema names, API resources and domain terms with source paths when explicitly asked, refreshing entries after migrations rename tables or endpoints. Not for API documentation, schema design, translation, or onboarding guides.",
    ["Draft a glossary of the schema and API terms in this repository.", "Refresh our domain glossary now that two tables were renamed.", "List the business terms in our models with the files that define them."]],
  ["chayen-notes-beta", "Collect build, test, lint and release command recipes from the repository into a reviewed command cheatsheet when explicitly asked, naming required environment variables without values. Not for running pipelines, fixing failing tests, or editing build configuration.",
    ["Write a cheatsheet of the build and lint commands this repository uses.", "Collect the release commands into one page for the team.", "Which environment variables do our test commands need? Put them in a cheatsheet."]],
];
const hop = (n, next) => `---\nkind: checklist\n---\n# Detail ${n}\n\n## Purpose\n\nRead this file only when the previous step names it for the current task.\n\n## Next\n\n${next ? `Continue with [the next detail](${next}) only if the task needs it.` : "No further detail is linked from here."}\n`;

function beyondEveryFormerLimit(t) {
  const root = fixture(t);
  const reg = readJson(root, "catalog/project-skills.json"), cases = readJson(root, "tests/skills/trigger-cases.json");
  for (const [name, description, prompts] of EXTRA) {
    fs.cpSync(inside(root, `${SKILLS}/chayen-init`), inside(root, `${SKILLS}/${name}`), { recursive: true });
    edit(root, `${SKILLS}/${name}/SKILL.md`, (s) => s.replace(/^name: chayen-init$/m, `name: ${name}`).replace(/^description: .*$/m, `description: ${description}`));
    reg.skills.push({ name, mapping: "existing", description });
    cases.skills.push(name);
    prompts.forEach((prompt, i) => cases.cases.push({ id: `pos-${name.replace(/^chayen-/, "")}-${i + 1}`, category: "positive", prompt, expect: { any_of: [name] } }));
  }
  writeJson(root, "catalog/project-skills.json", reg);
  writeJson(root, "tests/skills/trigger-cases.json", cases);
  const alpha = `${SKILLS}/chayen-notes-alpha`, beta = `${SKILLS}/chayen-notes-beta`;
  edit(root, `${alpha}/SKILL.md`, (s) => s.replace("\n## Outputs\n", `\n${Array.from({ length: 150 }, (_, i) => `- Check ${i + 1}.`).join("\n")}\n\n## Outputs\n`));
  edit(root, `${beta}/references/detection-and-refresh.md`, (s) => `${s}\n## Extended notes\n\n${Array.from({ length: 320 }, (_, i) => `- Note ${i + 1}: confirm the value against its source.`).join("\n")}\n`);
  edit(root, `${alpha}/references/detection-and-refresh.md`, (s) => `${s}\n## Further detail\n\nOnly when a unit needs more detail, read [the next file](deep-1.md).\n`);
  fs.writeFileSync(inside(root, `${alpha}/references/deep-1.md`), hop(1, "deep-2.md"));
  fs.mkdirSync(inside(root, `${alpha}/references/nested`));
  fs.writeFileSync(inside(root, `${alpha}/references/deep-2.md`), hop(2, "nested/deep-3.md"));
  fs.writeFileSync(inside(root, `${alpha}/references/nested/deep-3.md`), hop(3, null));
  return root;
}

test("a package beyond every former limit at once passes the package, catalog and security validators", (t) => {
  const root = beyondEveryFormerLimit(t);
  for (const v of ["package", "catalog", "security"]) {
    const r = VALIDATORS[v](root);
    assert.equal(r.signal, null);
    assert.equal(r.code, 0, `${v}: ${r.out.split("\n").filter((l) => /^ERROR|FAIL/.test(l)).join("\n")}`);
    assert.doesNotMatch(r.out, FORMER_CAP, v);
  }
  const pkg = VALIDATORS.package(root).out;
  assert.match(pkg, /18 shipped skills \(editorial 2, engineering 13, project 3; no count cap\)/);
  const size = /largest SKILL\.md chayen-notes-alpha\/SKILL\.md (\d+) lines/.exec(pkg), ref = /largest reference skills\/chayen-notes-beta\/references\/detection-and-refresh\.md (\d+) lines/.exec(pkg);
  assert.ok(size && Number(size[1]) > 300, "SKILL.md above 300 lines");
  assert.ok(ref && Number(ref[1]) > 300, "reference above 300 lines");
  assert.match(pkg, /max depth 4;/);
  const metrics = JSON.parse(run([inside(repo, "tools/catalog/discovery-metrics.mjs"), "--root", root, "--json"]).stdout);
  assert.ok(metrics.actual.chars > 7000, `discovery metadata above 7,000 characters, got ${metrics.actual.chars}`);
  assert.equal(metrics.actual.skills, 18);
});

// ---------- 4. faults on the package beyond every former limit ----------
const ALPHA = `${SKILLS}/chayen-notes-alpha`;
const token = () => "ghp_" + "A".repeat(36); // Synthetic sentinel built at runtime, never a credential.
const FAULTS = [
  ["a shipped Skill name longer than 64 characters (provider rule)", "package", /ERROR V-05 skills: .*invalid name "chayen-a{58}"/, (root) => {
    const long = `chayen-${"a".repeat(58)}`;
    fs.cpSync(inside(root, ALPHA), inside(root, `${SKILLS}/${long}`), { recursive: true });
    edit(root, `${SKILLS}/${long}/SKILL.md`, (s) => s.replace(/^name: .*$/m, `name: ${long}`));
  }],
  ["a description above 1,024 characters (provider rule)", "package", /ERROR V-05 skills: .*chayen-notes-alpha\/SKILL\.md: description required, max 1024/, (root) => {
    edit(root, `${ALPHA}/SKILL.md`, (s) => s.replace(/^(description: )/m, `$1${"Glossary terms and sources. ".repeat(40)}`));
  }],
  ["a Copilot marketplace description above 1,024 characters (provider rule)", "package", /ERROR V-01b marketplace-copilot: .*description exceeds 1024 chars/, (root) => {
    const m = readJson(root, ".github/plugin/marketplace.json"); m.plugins[0].description = "x".repeat(1025); writeJson(root, ".github/plugin/marketplace.json", m);
  }],
  ["a provider-specific frontmatter field", "package", /ERROR V-05 skills: .*unsupported frontmatter field "hooks"/, (root) => {
    edit(root, `${ALPHA}/SKILL.md`, (s) => s.replace("\n---\n", "\nhooks: setup\n---\n"));
  }],
  ["a runtime component key in the Claude Code manifest", "package", /ERROR V-03 claude-manifest: component\/config key "hooks" is not allowed/, (root) => {
    const f = "plugins/codejadee-chayen-framework/.claude-plugin/plugin.json", m = readJson(root, f); m.hooks = "hooks.json"; writeJson(root, f, m);
  }],
  ["an executable script inside a Skill", "package", /ERROR V-09 plugin-content: file type not allowed \(only \.md\/\.json\): .*chayen-notes-alpha\/run\.sh/, (root) => {
    fs.writeFileSync(inside(root, `${ALPHA}/run.sh`), "echo synthetic\n");
  }],
  ["a secret-shaped value in a reference", "security", /ERROR V-25\.2 secret-pattern: .*chayen-notes-alpha\/references\/deep-1\.md: github-token/, (root) => {
    edit(root, `${ALPHA}/references/deep-1.md`, (s) => `${s}\nExample value ${token()}\n`);
  }],
  ["a link that escapes the Skill", "package", /ERROR V-08 links: .*leaves the skill directory/, (root) => {
    edit(root, `${ALPHA}/references/nested/deep-3.md`, (s) => `${s}\nSee [outside](../../../../../../outside.md) when needed.\n`);
  }],
  ["a nested reference without a kind", "package", /ERROR V-18 reference-kinds: skills\/chayen-notes-alpha\/references\/nested\/deep-3\.md: missing YAML frontmatter/, (root) => {
    edit(root, `${ALPHA}/references/nested/deep-3.md`, (s) => s.replace(/^---\nkind: checklist\n---\n/, ""));
  }],
  ["an orphaned nested reference", "package", /ERROR V-08 links: chayen-notes-alpha\/references\/nested\/orphan\.md is not reachable from SKILL\.md/, (root) => {
    fs.writeFileSync(inside(root, `${ALPHA}/references/nested/orphan.md`), hop("orphan", null));
  }],
  ["a description that conflicts with another Skill", "package", /ERROR V-07b description-distinctness: chayen-notes-alpha vs chayen-notes-beta: description word overlap 1\.00 > 0\.35/, (root) => {
    const d = EXTRA[0][1];
    edit(root, `${SKILLS}/chayen-notes-beta/SKILL.md`, (s) => s.replace(/^description: .*$/m, `description: ${d}`));
    const reg = readJson(root, "catalog/project-skills.json"); reg.skills.find((x) => x.name === "chayen-notes-beta").description = d; writeJson(root, "catalog/project-skills.json", reg);
  }],
  ["an unregistered Skill", "catalog", /ERROR V-11\.3 entry-skills: shipped skill chayen-notes-beta is not registered in any skill category/, (root) => {
    const reg = readJson(root, "catalog/project-skills.json"); reg.skills = reg.skills.filter((x) => x.name !== "chayen-notes-beta"); writeJson(root, "catalog/project-skills.json", reg);
  }],
];
for (const [label, validator, expected, mutate] of FAULTS) {
  test(`beyond every former limit, still fails on ${label}`, (t) => {
    const root = beyondEveryFormerLimit(t);
    mutate(root);
    const r = VALIDATORS[validator](root);
    assert.equal(r.signal, null);
    assert.equal(r.code, 1, r.out);
    assert.match(r.out, expected);
    assert.doesNotMatch(r.out, FORMER_CAP);
    assert.doesNotMatch(r.out, /ghp_A{36}/, "a secret value must never be printed");
  });
}

test("beyond every former limit, still fails on a symlink or junction inside a Skill", (t) => {
  const root = beyondEveryFormerLimit(t);
  try { fs.symlinkSync(inside(root, `${SKILLS}/chayen-testing/references`), path.join(inside(root, `${ALPHA}/references`), "linked"), process.platform === "win32" ? "junction" : "dir"); }
  catch (e) { t.skip(`cannot create a directory link on this host: ${e.code}`); return; }
  const r = VALIDATORS.package(root);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /ERROR V-09 plugin-content: refusing symlink or junction/);
});
