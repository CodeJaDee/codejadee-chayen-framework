// Developer-only discovery metadata fixtures (D-066, ADR-0013 §3-§4, evolution Step 05). Each test copies the
// package inputs into a disposable OS-temp directory, changes Skill metadata there, and runs the real package
// validator and the discovery report. Metadata above the former 7,000-character cap must pass; provider-invalid
// descriptions, duplicate identities, invalid frontmatter and poorly scoped or conflicting descriptions must
// still fail; the report must match an independent count and be deterministic. Offline; never shipped.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { inside, assertTreeNoLinks } from "../../tools/validate/safe-paths.mjs";

const repo = path.resolve(import.meta.dirname, "../..");
const COPY = ["plugins", ".claude-plugin", ".github/plugin", ".agents/plugins", "catalog", "tests/skills"];
const SKILLS = "plugins/codejadee-chayen-framework/skills";
// Diagnostic of the removed L0 cap. It may never reappear.
const L0_CAP_FAILURE = /L0 metadata \d+ chars > \d+|metadata-budget/;
// Distinct, valid scope sentences used to lengthen engineering descriptions in a copy.
const EXTRA = {
  "chayen-backend": "Also reviews webhook signature rotation, partner sandbox provisioning, tenant quota throttling, invoice reconciliation jobs, ledger snapshot exports, settlement retry queues and dispute evidence uploads for payment gateways.",
  "chayen-frontend": "Also reviews kiosk display layouts, signage carousel timing, barcode scanner focus handling, offline receipt printing, cashier shortcut keymaps, loyalty badge animations and shelf label previews for retail storefronts.",
  "chayen-data": "Also reviews warehouse slotting tables, pallet movement histories, cold chain sensor readings, carrier manifest staging, customs declaration archives, returns grading records and supplier lead time snapshots for logistics teams.",
  "chayen-devops": "Also reviews satellite uplink deployment windows, edge cabinet firmware rollouts, tower site maintenance calendars, spectrum license renewals, field technician dispatch runbooks and backhaul failover drills for telecom operators.",
};
const PLANNED = { name: "chayen-planned-sample", mapping: "planned", description: "Summarize release train commands from the repository on request. Not for deployment pipelines, test authoring, or database schema changes." };

function fixture(t) {
  const parent = fs.realpathSync(os.tmpdir()), root = fs.mkdtempSync(path.join(parent, "chayen-discovery-"));
  t.after(() => { assert.equal(path.dirname(root), parent); fs.rmSync(root, { recursive: true, force: true }); });
  for (const rel of COPY) { const source = inside(repo, rel); assertTreeNoLinks(source); fs.cpSync(source, inside(root, rel), { recursive: true }); }
  return root;
}
const node = (args) => { const r = spawnSync(process.execPath, args, { cwd: repo, encoding: "utf8", timeout: 120_000 }); return { code: r.status, out: `${r.stdout ?? ""}${r.stderr ?? ""}`, stdout: r.stdout ?? "" }; };
const validate = (root) => node([inside(repo, "tools/validate/validate-package.mjs"), root]);
const report = (root) => node([inside(repo, "tools/catalog/discovery-metrics.mjs"), "--root", root, "--json"]);
const metrics = (root) => { const r = report(root); assert.equal(r.code, 0, r.out); return JSON.parse(r.stdout); };
const edit = (root, rel, change) => { const f = inside(root, rel); fs.writeFileSync(f, change(fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n"))); };
const readJson = (root, rel) => JSON.parse(fs.readFileSync(inside(root, rel), "utf8"));
const writeJson = (root, rel, v) => fs.writeFileSync(inside(root, rel), JSON.stringify(v, null, 2) + "\n");
// Insert a sentence before the description's boundary clause, `times` times.
const lengthen = (root, skill, times = 1) => edit(root, `${SKILLS}/${skill}/SKILL.md`, (t) => t.replace(/^(description: .*?)( Not (?:for|a) )/m, (_, a, b) => `${a}${` ${EXTRA[skill]}`.repeat(times)}${b}`));
const setDescription = (root, skill, d) => edit(root, `${SKILLS}/${skill}/SKILL.md`, (t) => t.replace(/^description: .*$/m, `description: ${d}`));
const addPlanned = (root, ...records) => { const reg = readJson(root, "catalog/project-skills.json"); reg.skills.push(...records); writeJson(root, "catalog/project-skills.json", reg); };

// Independent recount: name + description of every shipped SKILL.md.
function recount(root) {
  const dir = inside(root, SKILLS);
  return fs.readdirSync(dir).filter((d) => fs.existsSync(path.join(dir, d, "SKILL.md")))
    .reduce((n, d) => n + d.length + /^description: (.*)$/m.exec(fs.readFileSync(path.join(dir, d, "SKILL.md"), "utf8"))[1].trim().length, 0);
}
function passes(r) {
  assert.equal(r.code, 0, r.out.split("\n").filter((l) => l.startsWith("ERROR")).join("\n"));
  assert.doesNotMatch(r.out, L0_CAP_FAILURE);
}
function fails(r, expected) {
  assert.equal(r.code, 1, r.out);
  for (const e of [].concat(expected)) assert.match(r.out, e);
  assert.doesNotMatch(r.out, L0_CAP_FAILURE);
}

test("existing metadata passes and the report matches an independent recount", (t) => {
  const root = fixture(t), m = metrics(root), r = validate(root), expected = recount(root);
  passes(r);
  assert.equal(m.actual.chars, expected);
  assert.equal(m.actual.estTokens, Math.round(expected / 4));
  assert.equal(m.perSkill.filter((s) => s.state === "shipped").reduce((n, s) => n + s.chars, 0), expected);
  assert.ok(Math.abs(m.perSkill.reduce((n, s) => n + (s.shareOfActual ?? 0), 0) - 1) < 0.001);
  assert.match(r.out, new RegExp(`PASS {2}V-07 discovery-metadata: ${m.actual.skills} shipped skills .*discovery metadata ${expected} chars \\(~${m.actual.estTokens} tokens, estimate\\).*no repository cap \\(D-066\\)`));
  assert.match(m.tokenEstimate, /estimate/);
});

test("metadata above the former 7,000-character cap passes", (t) => {
  const root = fixture(t);
  lengthen(root, "chayen-backend");
  lengthen(root, "chayen-frontend");
  const m = metrics(root), r = validate(root);
  assert.ok(m.actual.chars > 7000 && m.actual.chars <= 8000, `fixture should sit between 7,000 and 8,000 characters, got ${m.actual.chars}`);
  passes(r);
  assert.doesNotMatch(r.out, /WARN {2}V-07 discovery-metadata: discovery metadata/);
});

test("metadata above the documented Codex figure passes with an advisory provider warning", (t) => {
  const root = fixture(t);
  for (const s of Object.keys(EXTRA)) lengthen(root, s, 2);
  const m = metrics(root), r = validate(root);
  assert.ok(m.actual.chars > 8000, `fixture should exceed 8,000 characters, got ${m.actual.chars}`);
  passes(r);
  assert.match(r.out, /WARN {2}V-07 discovery-metadata: discovery metadata \d+ chars exceeds the 8000-character figure documented for Codex \(S12\).*routing evidence/);
  const codex = m.providers.find((p) => p.provider === "Codex");
  assert.equal(codex.status, "EXCEEDS_DOCUMENTED_FIGURE");
});

test("provider diagnostics are labelled as documented and never as measured", (t) => {
  const m = metrics(fixture(t));
  for (const p of m.providers) assert.equal(p.measurement, "NOT_MEASURED");
  assert.equal(m.providers.find((p) => p.provider === "Claude Code").status, "UNKNOWN");
  assert.equal(m.providers.find((p) => p.provider.startsWith("GitHub Copilot")).status, "UNKNOWN");
  assert.equal(m.providers.find((p) => p.provider === "Codex").status, "WITHIN_DOCUMENTED_FIGURE");
  assert.match(m.evidenceLevel, /NOT_MEASURED/);
});

test("metadata calculations are deterministic and independent of registry order", (t) => {
  const root = fixture(t);
  const second = { ...PLANNED, name: "chayen-planned-second", description: "Compile onboarding command notes from the repository on request. Not for code changes, test authoring, or release pipelines." };
  addPlanned(root, PLANNED, second);
  const first = report(root).stdout, again = report(root).stdout;
  assert.equal(first, again);
  const reg = readJson(root, "catalog/project-skills.json"); reg.skills.reverse(); writeJson(root, "catalog/project-skills.json", reg);
  assert.equal(report(root).stdout, first);
  const m = JSON.parse(first);
  assert.equal(m.projected.chars, m.actual.chars + [PLANNED, second].reduce((n, r) => n + r.name.length + r.description.length, 0));
  assert.equal(m.actual.chars, recount(root));
});

test("an unusually expensive description is identified", (t) => {
  const root = fixture(t);
  lengthen(root, "chayen-backend", 2);
  const m = metrics(root);
  assert.deepEqual(m.expensive.descriptions.map((d) => d.name), ["chayen-backend"]);
  assert.equal(m.largestContributors[0].name, "chayen-backend");
});

const FAULTS = [
  ["a shipped description above the provider limit of 1,024 characters", [/ERROR V-05 skills: .*chayen-backend\/SKILL\.md: description required, max 1024/, /ERROR V-07 discovery-metadata: chayen-backend: description \d{4} chars > 1024 \(provider limit P-02\)/],
    (root) => lengthen(root, "chayen-backend", 3)],
  ["a planned registry description above the provider limit", /ERROR V-19 catalog-mapping: chayen-planned-sample: invalid project description metadata/,
    (root) => addPlanned(root, { ...PLANNED, description: `${PLANNED.description} ${"Extra scope words. ".repeat(50)}` })],
  ["a duplicate identity across registration categories", /ERROR V-19 catalog-mapping: chayen-backend: duplicate skill name across registration records/,
    (root) => addPlanned(root, { ...PLANNED, name: "chayen-backend" })],
  ["invalid frontmatter (YAML-unsafe description)", /ERROR V-05 skills: .*chayen-frontend\/SKILL\.md: frontmatter line \d+: value of "description" is not a YAML-safe plain scalar/,
    (root) => edit(root, `${SKILLS}/chayen-frontend/SKILL.md`, (t) => t.replace(/^(description: )/m, "$1Scope: "))],
  ["a catch-all description", /ERROR V-20 description-breadth: chayen-devops: catch-all wording "any task"/,
    (root) => edit(root, `${SKILLS}/chayen-devops/SKILL.md`, (t) => t.replace(/^(description: )/m, "$1Handles any task. "))],
  ["a description without a negative scope boundary", /ERROR V-07 discovery-metadata: chayen-data: description lacks a "Not for \.\.\." boundary clause/,
    (root) => edit(root, `${SKILLS}/chayen-data/SKILL.md`, (t) => t.replace(/^(description: .*?) Not (?:for|a) .*$/m, "$1"))],
  ["a description that conflicts with another Skill", /ERROR V-07b description-distinctness: chayen-frontend vs chayen-planned-sample: description word overlap 1\.00 > 0\.35/,
    (root) => { const d = /^description: (.*)$/m.exec(fs.readFileSync(inside(root, `${SKILLS}/chayen-frontend/SKILL.md`), "utf8"))[1]; addPlanned(root, { ...PLANNED, description: d }); }],
];
for (const [label, expected, mutate] of FAULTS) {
  test(`fails with metadata above 7,000 characters on ${label}`, (t) => {
    const root = fixture(t);
    lengthen(root, "chayen-backend");
    lengthen(root, "chayen-frontend");
    mutate(root);
    fails(validate(root), expected);
  });
}
