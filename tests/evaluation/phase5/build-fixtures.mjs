#!/usr/bin/env node
// Developer-only Phase 5 fixture builder. Composes the frozen Phase 5 routing probe set, the
// Humanizer TH/EN subset and the engineering capability sample from already-reviewed source cases,
// copying prompts and expectations verbatim so the selection is auditable and cannot drift.
//
//   node tests/evaluation/phase5/build-fixtures.mjs --check   # offline: generated == committed
//   node tests/evaluation/phase5/build-fixtures.mjs --write   # regenerate (review the diff)
//
// Selection only; it sends nothing to any provider. Never shipped. Zero dependencies.

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const repo = path.resolve(import.meta.dirname, "../../..");
const here = import.meta.dirname;
const read = (rel) => JSON.parse(fs.readFileSync(path.join(repo, rel), "utf8"));
const SRC = {
  trigger: "tests/skills/trigger-cases.json",
  step32: "tests/evaluation/provider-probes.json",
  step40: "tests/evaluation/step40/discovery-probes.json",
  quality: "tests/evaluation/step40/quality-cases.json",
  recipe: "tests/skills/recipe-cases.json",
  technology: "tests/skills/technology-cases.json",
  workflow: "tests/skills/workflow-cases.json",
};

// ---- Routing selection (reviewed against RELEASE_SCOPE_DECISION §4.3) ----
// Core balanced positives: two per Entry Skill, primary stacks preferred.
const CORE = {
  "chayen-ai-engineering": ["pos-ai-rag-design", "pos-ai-agent-permissions"],
  "chayen-architecture": ["pos-architecture-options", "pos-architecture-migration"],
  "chayen-backend": ["pos-backend-efcore-paging", "pos-backend-webhooks"],
  "chayen-data": ["pos-data-sqlserver-deadlock", "pos-data-postgres-rls"],
  "chayen-devops": ["pos-devops-github-actions", "pos-devops-tracing"],
  "chayen-documentation": ["pos-documentation-pr-description", "pos-documentation-release-notes"],
  "chayen-frontend": ["pos-frontend-angular-form", "pos-frontend-angular-signals"],
  "chayen-humanizer-en": ["pos-humanizer-en-readme-prose", "pos-humanizer-en-locale-strings"],
  "chayen-humanizer-th": ["pos-humanizer-th-audit", "pos-humanizer-th-locale-strings"],
  "chayen-implementation": ["pos-implementation-csv-export", "pos-impl-csharp-nullability"],
  "chayen-performance": ["pos-performance-memory-leak", "pos-performance-k6"],
  "chayen-repository": ["pos-repository-overview", "pos-repository-impact"],
  "chayen-requirements": ["pos-requirements-acceptance", "pos-requirements-nfr"],
  "chayen-security": ["pos-security-sql-injection", "pos-security-cors-auth"],
  "chayen-testing": ["pos-testing-webapplicationfactory", "pos-testing-angular-karma"],
};
// Writing/engineering overlap probes required by §4.3 (Step 40: 6 documentation + 8 engineering).
const OVERLAP = ["s40-dp-doc-01", "s40-dp-doc-02", "s40-dp-doc-03", "s40-dp-doc-04", "s40-dp-doc-05", "s40-dp-doc-06",
  "s40-dp-eng-01", "s40-dp-eng-02", "s40-dp-eng-03", "s40-dp-eng-04", "s40-dp-eng-05", "s40-dp-eng-06", "s40-dp-eng-07", "s40-dp-eng-08"];
// Negative: adjacent but excluded scope (Nitro, Elysia, unsupported platforms, misuse requests).
const NEGATIVE = ["uns-backend-nitro", "uns-backend-elysia-route", "uns-unity", "uns-swiftui", "uns-flutter", "uns-rust-axum-handler",
  "uns-spring-boot", "uns-react-native", "uns-mongodb", "uns-pentest-production", "uns-detector-evasion-english", "uns-thai-ai-detector-evasion"];
// No-match: no Chayen-relevant task (EN and TH).
const NO_MATCH = ["neg-weather", "neg-poem", "neg-math", "neg-hamlet", "neg-git-concept", "neg-explain-csharp-record",
  "neg-explain-postgres-mvcc", "neg-thai-question-kubernetes", "neg-thai-linguistics-question", "neg-explicit-decline"];
const AMBIGUOUS = [["step32", "pr-monorepo-ambiguous"]];
// Explicit invocation: one realistic prompt per Entry Skill, reused from reviewed cases.
const EXPLICIT = {
  "chayen-ai-engineering": ["trigger", "pos-ai-prompt-eval"],
  "chayen-architecture": ["trigger", "pos-architecture-adr"],
  "chayen-backend": ["trigger", "pos-backend-aspnet-bug"],
  "chayen-data": ["step32", "pr-explicit-reference"],
  "chayen-devops": ["trigger", "pos-devops-incident"],
  "chayen-documentation": ["trigger", "pos-documentation-readme"],
  "chayen-frontend": ["trigger", "pos-frontend-react-rerender"],
  "chayen-humanizer-en": ["step40", "s40-dp-xen-01"],
  "chayen-humanizer-th": ["step40", "s40-dp-xth-01"],
  "chayen-implementation": ["trigger", "pos-implementation-refactor"],
  "chayen-performance": ["trigger", "pos-performance-bottleneck"],
  "chayen-repository": ["trigger", "pos-repository-conventions"],
  "chayen-requirements": ["trigger", "pos-requirements-edge-cases"],
  "chayen-security": ["step32", "pr-explicit-security"],
  "chayen-testing": ["trigger", "pos-testing-unit"],
};

// ---- Humanizer TH/EN subset (risk-based; Step 40 quality cases, arms A=no plugin, B=plugin) ----
const HUMANIZER = {
  th: ["s40-th-01", "s40-th-04", "s40-th-11", "s40-th-14", "s40-th-18", "s40-th-20", "s40-th-21", "s40-th-25", "s40-th-27", "s40-th-31", "s40-th-35", "s40-th-36"],
  en: ["s40-en-01", "s40-en-05", "s40-en-11", "s40-en-14", "s40-en-15", "s40-en-20", "s40-en-21", "s40-en-23", "s40-en-25", "s40-en-27", "s40-en-34", "s40-en-40"],
  "mixed-adversarial": ["s40-mx-08", "s40-mx-12", "s40-th-37", "s40-en-37", "s40-th-38", "s40-en-38"],
};

// ---- Engineering capability sample (24 scenarios + 4 composite workflows) ----
const CAPABILITY = {
  "dotnet-aspnetcore": [["technology", "tc-aspnet-validation-01"], ["technology", "tc-aspnet-authorization-01"], ["technology", "tc-aspnet-exception-handling-01"], ["technology", "tc-aspnet-dependency-injection-01"], ["technology", "tc-csharp-async-concurrency-01"]],
  "angular-typescript": [["technology", "tc-angular-forms-01"], ["technology", "tc-angular-signals-01"], ["technology", "tc-angular-http-client-01"], ["technology", "tc-typescript-type-safety-01"]],
  sqlserver: [["technology", "tc-sqlserver-stored-procedures-01"], ["technology", "tc-sqlserver-locking-deadlocks-01"], ["technology", "tc-sqlserver-transactions-xact-abort"], ["technology", "tc-aspnet-efcore-migrations-01"]],
  postgresql: [["technology", "tc-postgres-mvcc-locking-01"], ["technology", "tc-postgres-schema-migrations-01"], ["technology", "tc-postgres-row-level-security-pooling"]],
  "cross-stack": [["technology", "tc-crossstack-authentication-01"], ["technology", "tc-crossstack-date-time-01"], ["technology", "tc-crossstack-cors-csrf-01"]],
  "security-sensitive": [["recipe", "rc-11-002-pos"], ["recipe", "rc-11-011-pos"]],
  "testing-devops": [["technology", "tc-aspnet-integration-testing-02"], ["recipe", "rc-13-002-pos"], ["technology", "tc-aspnet-hosting-deployment-01"]],
};
const WORKFLOWS = ["wf-new-feature-positive", "wf-schema-migration-boundary", "wf-security-review-positive", "wf-incident-investigation-positive"];

function pick(srcKey, id) {
  const data = read(SRC[srcKey]);
  const list = data.cases ?? data.probes;
  const c = list.find((x) => x.id === id);
  if (!c) throw new Error(`${id} not found in ${SRC[srcKey]}`);
  return c;
}
const ref = (srcKey, id) => `${SRC[srcKey]}#${id}`;

export function buildRouting() {
  const probes = [];
  for (const [skill, ids] of Object.entries(CORE)) for (const id of ids) {
    const c = pick("trigger", id);
    if (!c.expect.any_of?.includes(skill)) throw new Error(`${id} does not expect ${skill}`);
    probes.push({ id: `p5-pos-${id.replace(/^pos-/, "")}`, type: "positive", group: "core", primary: skill, source: ref("trigger", id), prompt: c.prompt, expect: c.expect, ...(c.forbid ? { forbid: c.forbid } : {}) });
  }
  for (const id of OVERLAP) {
    const c = pick("step40", id);
    probes.push({ id: `p5-ovl-${id.replace(/^s40-dp-/, "")}`, type: "positive", group: id.includes("-doc-") ? "overlap-documentation" : "overlap-engineering", primary: c.expect.any_of[0], source: ref("step40", id), prompt: c.prompt, expect: c.expect });
  }
  for (const id of NEGATIVE) { const c = pick("trigger", id); probes.push({ id: `p5-neg-${id.replace(/^uns-/, "")}`, type: "negative", group: "negative", source: ref("trigger", id), prompt: c.prompt, expect: c.expect, ...(c.forbid ? { forbid: c.forbid } : {}) }); }
  for (const id of NO_MATCH) { const c = pick("trigger", id); probes.push({ id: `p5-nm-${id.replace(/^neg-/, "")}`, type: "no-match", group: "no-match", source: ref("trigger", id), prompt: c.prompt, expect: c.expect }); }
  for (const [src, id] of AMBIGUOUS) { const c = pick(src, id); probes.push({ id: `p5-amb-${id.replace(/^pr-/, "")}`, type: "ambiguous", group: "ambiguous", source: ref(src, id), prompt: c.prompt, expect: c.expect }); }
  for (const [skill, [src, id]] of Object.entries(EXPLICIT)) {
    const c = pick(src, id);
    probes.push({ id: `p5-exp-${skill.replace(/^chayen-/, "")}`, type: "explicit", group: "explicit", skill, source: ref(src, id), prompt: c.prompt, expect: { any_of: [skill] }, ...(c.refs?.skill === skill ? { refs: c.refs } : {}), ...(c.marker ? { marker: c.marker } : {}) });
  }
  return {
    $comment: "Phase 5 frozen routing probe set (developer-only). Prompts and expectations are copied verbatim from the cited reviewed sources by build-fixtures.mjs. Explicit prompts are prefixed at run time with the host's native syntax. Expected sets need owner review (OD-05) before the first scored run; the probe-file SHA-256 is recorded with every result.",
    version: 1, fixture: "tests/evaluation/fixture", runsRequired: 3, thresholds: { automaticRoutingAccuracyPerCli: 0.85, proposed: ["PT-01", "PT-02", "PT-03", "PT-04", "PT-05", "PT-06"] },
    probes,
  };
}

export function buildHumanizer() {
  const cases = [];
  for (const [slice, ids] of Object.entries(HUMANIZER)) for (const id of ids) {
    const c = pick("quality", id);
    cases.push({ id, slice, group: c.group, category: c.category, mode: c.mode, source: ref("quality", id), request: c.request, ...(c.input ? { input: c.input } : {}), ...(c.files ? { files: c.files } : {}), ...(c.context ? { context: c.context } : {}), expect: c.expect, rubric: c.rubric });
  }
  return {
    $comment: "Phase 5 Humanizer TH/EN risk-based subset (developer-only), copied verbatim from Step 40 quality cases. Arms: baseline (no plugin, Step 40 arm A) and plugin (natively installed candidate, arm B). Outputs are emitted in the Step 40 arm-outputs format for tools/evals/score-step40.mjs. proposedSupplement cases are NOT frozen and NOT run until reviewed.",
    version: 1, runsRequired: 3,
    coverage: {
      semanticFidelity: ["s40-th-25", "s40-th-27", "s40-en-25", "s40-en-27"],
      naturalness: ["s40-th-01", "s40-th-04", "s40-en-01", "s40-en-05"],
      technicalTerminology: ["s40-th-01", "s40-th-35", "s40-en-23", "s40-mx-12"],
      numbersAndDates: ["s40-th-04", "s40-th-18", "s40-th-36", "s40-en-05", "s40-en-15", "s40-en-27"],
      buddhistEraDates: ["s40-th-25"],
      thaiNumerals: [],
      protectedPlaceholders: ["s40-th-20", "s40-th-21", "s40-en-20", "s40-en-21", "s40-mx-12"],
      jsonSqlMarkdownCode: ["s40-th-20", "s40-th-35", "s40-en-23", "s40-en-40", "s40-mx-08"],
      falsePositiveRewriting: ["s40-th-11", "s40-th-14", "s40-th-31", "s40-en-11", "s40-en-14", "s40-en-34"],
      promptInjectionInEditableText: ["s40-th-37", "s40-en-37", "s40-th-38", "s40-en-38"],
    },
    gaps: ["No Step 40 quality case contains Thai digits (๐-๙); Thai-numeral preservation is covered only by offline scorer controls. See proposedSupplement.", "Only one Step 40 case (s40-th-25) carries a Buddhist Era year; none requests a BE/CE conversion."],
    cases,
    proposedSupplement: [
      { id: "p5-hz-th-digits", status: "PROPOSED", group: "th", category: "rewrite", mode: "rewrite", request: "เกลาประกาศนี้ให้อ่านลื่นขึ้น ห้ามเปลี่ยนตัวเลขไทย", input: "ทางร้านจะทำการปิดปรับปรุงระบบในวันที่ ๑๒ ธันวาคม เวลา ๒๒.๐๐ น. ถึง ๐๒.๐๐ น. ซึ่งในช่วงเวลาดังกล่าวจะไม่สามารถทำการสั่งซื้อสินค้าได้ ขออภัยในความไม่สะดวกเป็นอย่างสูง", expect: { skill: { any_of: ["chayen-humanizer-th"] }, outputLanguage: "th", preserve: ["๑๒ ธันวาคม", "๒๒.๐๐", "๐๒.๐๐"], keepNumbers: true, checks: ["Thai digits stay Thai digits; no conversion to Arabic digits", "Times and date unchanged"] }, rubric: ["naturalness", "semantic", "unsupportedAdditions"] },
      { id: "p5-hz-th-be-keep", status: "PROPOSED", group: "th", category: "semantic", mode: "rewrite", request: "ปรับข้อความนี้ให้กระชับ", input: "สัญญาฉบับนี้จะมีผลบังคับใช้ตั้งแต่วันที่ 1 มกราคม พ.ศ. 2570 เป็นต้นไป และจะสิ้นสุดลงในวันที่ 31 ธันวาคม พ.ศ. 2572", expect: { skill: { any_of: ["chayen-humanizer-th"] }, outputLanguage: "th", preserve: ["พ.ศ. 2570", "พ.ศ. 2572"], keepNumbers: true, checks: ["Buddhist Era years and labels unchanged; no CE conversion"] }, rubric: ["semantic", "naturalness"] },
      { id: "p5-hz-th-be-convert", status: "PROPOSED", group: "th", category: "semantic", mode: "rewrite", request: "เกลาประโยคนี้ และเปลี่ยนปี พ.ศ. ให้เป็น ค.ศ. ตามที่ลูกค้าต่างชาติขอ", input: "ระบบเวอร์ชันใหม่จะเปิดให้ใช้งานในเดือนมีนาคม พ.ศ. 2570", expect: { skill: { any_of: ["chayen-humanizer-th"] }, outputLanguage: "th", keepNumbers: true, numberConversions: [{ from: "พ.ศ. 2570", to: "ค.ศ. 2027" }], checks: ["Converts only the requested year (2570 BE = 2027 CE)", "Month unchanged"] }, rubric: ["semantic", "naturalness"] },
    ],
  };
}

export function buildCapability() {
  const scenarios = [];
  for (const [area, items] of Object.entries(CAPABILITY)) for (const [src, id] of items) {
    const c = pick(src, id);
    scenarios.push({ id: `p5-cap-${id}`, area, source: ref(src, id), capability: c.capability, ...(c.context ? { context: c.context } : {}), prompt: c.prompt, expect: c.expect, checks: c.checks ?? c.behavior ?? [] });
  }
  for (const id of WORKFLOWS) {
    const c = pick("workflow", id);
    scenarios.push({ id: `p5-wf-${id.replace(/^wf-/, "")}`, area: "composite-workflow", source: ref("workflow", id), workflow: c.workflow, ...(c.context ? { context: c.context } : {}), prompt: c.prompt, expect: c.expect, checks: c.checks ?? [] });
  }
  return {
    $comment: "Phase 5 engineering capability sample (developer-only): 24 representative engineering/technology scenarios and 4 composite workflows, copied verbatim from reviewed specification cases. Runs record transcripts for grading against `checks`; untested capabilities stay IMPLEMENTED. Owner approval of this sample is OD-08.",
    version: 1, fixture: "tests/evaluation/fixture", runsRequired: 3, arms: ["plugin", "baseline"], scenarios,
  };
}

const OUT = { "routing-probes.json": buildRouting, "humanizer-subset.json": buildHumanizer, "capability-sample.json": buildCapability };
if (import.meta.url === `file:///${process.argv[1]?.replaceAll("\\", "/").replace(/^\//, "")}`) {
  const mode = process.argv.includes("--write") ? "write" : process.argv.includes("--check") ? "check" : null;
  if (!mode) { console.error("Use --check or --write"); process.exit(2); }
  let bad = 0;
  for (const [file, build] of Object.entries(OUT)) {
    const text = JSON.stringify(build(), null, 2) + "\n";
    const target = path.join(here, file);
    if (mode === "write") { fs.writeFileSync(target, text); console.log(`WROTE ${file}`); continue; }
    const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n") : null;
    if (current !== text) { bad++; console.log(`FAIL  ${file} differs from its reviewed sources (run --write and review the diff)`); } else console.log(`PASS  ${file} matches its reviewed sources`);
  }
  process.exit(bad ? 1 : 0);
}
