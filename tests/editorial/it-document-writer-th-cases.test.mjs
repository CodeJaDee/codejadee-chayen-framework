// Offline structural checks for the Thai IT document skill behavior cases and routing cases
// (static; behavior NOT_RUN). Validates the case file, its coupling to the shipped skill text and
// the language-routing trigger cases. It scores no model output.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repo = path.resolve(import.meta.dirname, "../..");
const skillsDir = path.join(repo, "plugins/codejadee-chayen-framework/skills");
const TH = "chayen-it-document-writer-th", EN = "chayen-it-document-writer";
const skillDir = path.join(skillsDir, TH);
const spec = JSON.parse(fs.readFileSync(path.join(repo, "tests/editorial/it-document-writer-th-cases.json"), "utf8"));
const trigger = JSON.parse(fs.readFileSync(path.join(repo, "tests/skills/trigger-cases.json"), "utf8"));
const skillText = [path.join(skillDir, "SKILL.md"), ...fs.readdirSync(path.join(skillDir, "references")).map((f) => path.join(skillDir, "references", f))]
  .map((f) => fs.readFileSync(f, "utf8")).join("\n");
const MODES = ["write", "review", "update", "audit", "consistency", "translation"];
const DOC_TYPES = ["technical-document", "application-design", "infrastructure-design"];
const REQUIRED_BEHAVIORS = [
  "preserve-identifiers", "preserve-numbers", "preserve-requirement-keywords", "flag-missing-values", "audit-read-only",
  "proposed-vs-verified", "contradictory-sources", "preserve-structure", "approval-boundaries", "no-application-code-changes",
  "translation-equivalence", "no-added-detail", "terminology", "boundary",
];

test("case file names the shipped Thai skill and has unique, well-formed cases", () => {
  assert.equal(spec.skill, TH);
  const ids = new Set();
  for (const c of spec.cases) {
    assert.match(c.id, /^itdth-[a-z0-9-]+$/);
    assert.ok(!ids.has(c.id), `duplicate ${c.id}`);
    ids.add(c.id);
    for (const key of ["behavior", "mode", "docType", "request", "input"]) assert.equal(typeof c[key], "string", `${c.id}.${key}`);
    assert.ok(Array.isArray(c.expect.checks) && c.expect.checks.length > 0, `${c.id} needs checks`);
  }
});
test("every required behavior is covered", () => {
  const found = new Set(spec.cases.map((c) => c.behavior));
  for (const b of REQUIRED_BEHAVIORS) assert.ok(found.has(b), `missing behavior case ${b}`);
});
test("every operating mode and document type is exercised", () => {
  const modes = new Set(spec.cases.map((c) => c.mode)), types = new Set(spec.cases.map((c) => c.docType));
  for (const m of MODES) assert.ok(modes.has(m), `no case for mode ${m}`);
  for (const t of DOC_TYPES) assert.ok(types.has(t), `no case for document type ${t}`);
});
test("preserved spans occur in the fixture input", () => {
  for (const c of spec.cases) for (const span of c.expect.preserve ?? []) assert.ok(c.input.includes(span), `${c.id}: "${span}" is not in the input`);
});
test("obligation keyword mappings are English keywords in the input and Thai forms the skill defines", () => {
  const withMap = spec.cases.filter((c) => c.expect.keywordMap);
  assert.ok(withMap.length > 0);
  for (const c of withMap) for (const [en, th] of Object.entries(c.expect.keywordMap)) {
    assert.ok(c.input.includes(en), `${c.id}: ${en} not in the input`);
    assert.ok(skillText.includes(th), `skill text lacks the Thai form ${th}`);
  }
});
test("audit and consistency cases are read-only", () => {
  for (const c of spec.cases.filter((x) => ["audit", "consistency"].includes(x.mode))) assert.equal(c.expect.readOnly, true, c.id);
});
test("fixtures are synthetic: no address, credential or email shapes", () => {
  const text = JSON.stringify(spec.cases);
  assert.doesNotMatch(text, /\b\d{1,3}(?:\.\d{1,3}){3}\b/, "IPv4-like value");
  assert.doesNotMatch(text, /(?:password|secret|token)\s*[:=]\s*\S+/i, "credential-like value");
  assert.doesNotMatch(text, /[\w.+-]+@[\w-]+\.[\w.]+/, "email-like value");
});
test("boundary cases name a shipped skill", () => {
  const shipped = new Set(fs.readdirSync(skillsDir));
  for (const c of spec.cases.filter((x) => x.expect.better)) assert.ok(shipped.has(c.expect.better), c.id);
});
test("the skill text defines the Thai and English vocabulary the cases rely on", () => {
  for (const term of ["Verified", "Inferred", "Not Verified", "Conflicting Evidence", "Requires Clarification", "Missing Information",
    "ยืนยันแล้ว", "อนุมานจากหลักฐาน", "ยังไม่ได้รับการยืนยัน", "หลักฐานขัดแย้งกัน", "ต้องการข้อมูลเพิ่มเติม", "วิกฤต", "สำคัญ", "เล็กน้อย",
    "MUST NOT", "ต้องไม่", "ควร", "NOT_RUN"]) assert.ok(skillText.includes(term), `skill text lacks "${term}"`);
  for (const mode of ["write", "review", "update", "audit", "consistency", "translat"]) assert.match(skillText, new RegExp(mode, "i"));
});
test("language routing trigger cases cover the required scenarios", () => {
  const byId = new Map(trigger.cases.map((c) => [c.id, c]));
  const expectOne = (id, owner, forbidden) => {
    const c = byId.get(id);
    assert.ok(c, `missing trigger case ${id}`);
    assert.deepEqual(c.expect.any_of, [owner], id);
    for (const f of forbidden) assert.ok((c.forbid ?? []).includes(f), `${id} must forbid ${f}`);
  };
  expectOne("pos-itdoc-th-write-technical", TH, [EN]);
  expectOne("pos-itdoc-th-review-add", TH, [EN]);
  expectOne("pos-itdoc-th-audit-idd", TH, [EN]);
  expectOne("pos-itdoc-en-thai-prompt-english-output", EN, [TH]);
  expectOne("pos-itdoc-th-english-prompt-thai-output", TH, [EN]);
  expectOne("pos-humanizer-th-blog-not-itdoc", "chayen-humanizer-th", [TH, EN]);
  assert.ok(trigger.skills.includes(TH) && trigger.skills.includes(EN));
});
test("the English skill's own routing cases are unchanged by the Thai skill", () => {
  const en = trigger.cases.filter((c) => c.id.startsWith("pos-itdoc-") && !c.id.startsWith("pos-itdoc-th-") && !c.id.startsWith("pos-itdoc-en-thai"));
  assert.ok(en.length >= 6);
  for (const c of en) assert.ok(c.expect.any_of?.includes(EN), c.id);
});
