# Phase 2 — Chayen Product Hardening

วันที่ 2026-10-18 · working tree บน `main` ต่อจาก
`9f3e331300fb8a4f192cafd8b50198e7f50368ee` · ทำเฉพาะ Phase 2

## ผลงานและขอบเขต

แก้ product และ tooling สำหรับ P1-007, P1-012, P1-013, P1-014,
P1-018 และ P1-019 แล้ว คง Native Agent Plugin, canonical shared Skills
และแพ็กเกจ Markdown/JSON ไว้ จำนวนยังเป็น 15 Entry Skills,
206 engineering capabilities, 108 technology capabilities ใน 11 packs,
12 workflows และ 7 templates L0 metadata เท่ากับ 6,217/6,500 characters
และ metadata fingerprint แบบเดียวกับ probe runner คือ `339b3125d1347648`
ทุก `SKILL.md` อยู่ภายในเพดาน 300 บรรทัด

| Finding | การแก้และหลักฐาน regression |
|---|---|
| P1-007 | เอา standalone Nitro/Elysia ออกจาก positive descriptions, supported stacks, technology detection และ recipes ของทุก Skill ที่เกี่ยวข้อง แทน positive case เดิมด้วย Next.js และเก็บ prompt Elysia เดิมเป็น unsupported negative พร้อมเพิ่ม Nitro no-match case ปรับ catalog, examples และเอกสารให้ตรงกัน ไม่มี pack ใหม่ |
| P1-012 | description, body, registration และ catalog ของ Humanizer TH รองรับ Thai copy ใน localization files ชัดเจน ยกเว้น framework configuration, locale routing และ key wiring เพิ่ม boundary cases โดยคง engineering ownership |
| P1-014 | scorer ตรวจ Thai digits ๐–๙, Gregorian/BE years และ era labels, leading zeros, signs และ numeric identifiers มี negative controls สำหรับการลบ/เปลี่ยนเลขและเปลี่ยนศักราช และ positive controls สำหรับการแปลงที่ร้องขอไว้โดยเฉพาะ |
| P1-013 | เก็บ upstream notice เดิมทุกส่วน ใช้ SHA-256 ของเอกสารเต็มแบบ LF พร้อมตรวจ attribution, MIT grant/disclaimer และ Skill link มี mutation tests ทั้งการลบ แก้ข้อความ แก้ชื่อผู้ให้สิทธิ์ แก้ source และกรณีโครงการเพิ่ม MIT ของตัวเอง |
| P1-018 | lifecycle ตรวจ native exit status โดยตรง ใช้ fresh isolated profiles, whitelist environment, ปิด Copilot auto-update, ตรวจ CLI command support ก่อนเรียก ตรวจ update จาก version และ content hash ใน cache พร้อม active version ใน native list และตรวจ uninstall ว่าไม่มี installation เหลือ สถานะ disabled ยังถือว่าติดตั้งอยู่ |
| P1-019 | runbook ใช้ 15 Skills และ `chayen@codejadee` พร้อม dynamic count, guard ตรวจการย้อนกลับเป็น 13 และคำแนะนำเก็บหลักฐานแต่ละ operation |

Nuxt ยังคงอยู่ในขอบเขต คำแนะนำทั่วไปของ Node.js ยังอยู่ แต่ไม่มีการโฆษณา
รองรับ standalone Nitro/Elysia เอกสาร audit/results เก่าคงไว้เป็นหลักฐาน
ทางประวัติศาสตร์ โดยระบุ scope correction สำหรับรายงานเก่าที่เคยอ้างรองรับ
baseline ใน `PRODUCTION_GAP_ANALYSIS.md`, `PRODUCTION_READINESS_MATRIX.md`
และ `PHASE_01_EVIDENCE.md` ไม่ถูกเขียนทับ

## การทดสอบ

ใช้ Windows/PowerShell และ Node.js `v24.22.0` ตรวจสคริปต์ก่อนรัน
ทดสอบ offline เท่านั้น ไม่มี native provider executable หรือ model call
ถูกเรียกโดย regression tests

<!-- PHASE2_RESULTS -->
| Command | ผลรอบสุดท้าย | FAIL |
|---|---|---|
| `node tools/validate/validate-all.mjs` | PASS 17/17 gate groups รวม validator self-tests เดิม 179/179 | 0 |
| `node tests/provider-compatibility/check-identity.mjs` | PASS 15/15; 15 Skills, 237 references, 256 package files | 0 |
| `node tools/evals/score-step40.mjs --self-test` | PASS 56/56 synthetic controls; dataset 120 cases และ 55 discovery probes ถูกต้อง | 0 |
| `node tools/evals/run-evaluation-suite.mjs` | PASS 4 static checks และ 5 traceability/handoff checks; coverage 206/206, 108/108, 12/12 และ routing-example mapping 11/11 | 0 |
| `node --test tests/production/hardening.test.mjs` | PASS 22/22 baseline/negative-mutation controls | 0 |
| `node --test tests/editorial/numeric-preservation.test.mjs` | PASS 22/22 numeric/calendar regressions | 0 |
| `node --test tests/provider-compatibility/lifecycle.test.mjs` | PASS 40/40 offline lifecycle regressions | 0 |
| `node tools/validate/check-hardening.mjs` | PASS; ไม่มี invariant error | 0 |
| `node tools/evals/generate-claude-evals.mjs --check` | PASS; 218 cases, 526 generated files ตรงกับ source | 0 |
| `python -X utf8 <skill-creator>/scripts/quick_validate.py <skill-directory>` | PASS 2/2: `chayen-backend` และ `chayen-humanizer-th` | 0 |
| `git diff --check` | PASS; ไม่มี whitespace error | 0 |

tests ใหม่รวม 84/84 cases ผ่าน ไม่มี skip และไม่ได้แทนที่หรือผ่อน assertion
ของ regression เดิม validator มี warning เดิม 5 รายการสำหรับ Skills ที่เกิน
soft target 200 บรรทัด แต่ทุกไฟล์ยังไม่เกิน hard limit 300 บรรทัด
Skill validator เพิ่มเติมใช้ PyYAML 6.0.2 แบบ pure Python ใน temporary
directory แล้วลบทิ้งหลังตรวจ ไม่ติดตั้ง dependency ลง repository หรือ user
site-packages ผล import/build prerequisite ที่ติดขัดก่อนหน้านั้นแก้แล้ว

SIM lexical proxy ของ evaluation suite ไม่ใช่ automatic routing evidence
และไม่ใช้ตัดสินเกณฑ์ >=85% ไม่มี provider output หรือ human quality run
เกิดขึ้นใน Phase 2
<!-- /PHASE2_RESULTS -->

SHA-256 ของ upstream notice แบบ canonical LF:
`6da281a5b5e638bafd04da024183feb06785497adff2d6f4d32eb501a6cc5956`
ไฟล์ notice ไม่ถูกแก้ไข การ normalize line endings ใน validator รองรับ
Windows checkout โดยไม่อนุญาตให้เปลี่ยนข้อความ license หรือ attribution

scorer ใช้ `expect.numberConversions` เฉพาะ mapping ของ source/target span
ที่ผู้เขียน fixture ตรวจแล้วว่าผู้ใช้ร้องขอจริง ไม่อนุมานสิทธิ์จาก submitted
copy หรือ model output และไม่ยกเว้นตัวเลขอื่น การตรวจ token/identifier
เป็น automated guard ที่เสริม human semantic review ไม่สามารถพิสูจน์ว่า
ตัวเลขยังสัมพันธ์กับข้อเท็จจริงเดิมใน prose ทุกแบบได้

## Release Gates และสิ่งที่ยังไม่เสร็จ

| Gate | ผลจาก Phase 2 |
|---|---|
| G-01 | static architecture ยัง PASS; ใช้ผลตรวจ build ปัจจุบันแทนการอ้าง package เก่า |
| G-02 | PASS สำหรับ product scope/inventory/metadata และการแยก locale copy กับ framework wiring |
| G-03 | guards ของ findings ใน Phase 2 ผ่าน แต่ gate รวมยัง FAIL เพราะ broader documentation consistency P1-020 อยู่นอกขอบเขตรอบนี้ |
| G-06/G-07/G-08 | tooling แก้แล้ว แต่ native lifecycle ยัง NOT_RUN; ไม่อ้าง provider verification และไม่ถือว่า KL-33 ถูกแก้ในตัว provider |
| G-09/G-10 | descriptions เปลี่ยน หลักฐาน routing เดิมใช้กับ build นี้ไม่ได้ ต้องวัดใหม่ใน Phase 5 โดย automatic routing >=85% แยกต่อ CLI |
| G-11 | content/scorer defects แก้แล้ว; quality evaluation ยัง BLOCKED รอ rubric, reviewers, candidate และ authorized runs |
| G-15 | upstream MIT guard ผ่าน; project LICENSE, manifest license, rights, public source และ publication ยังเป็นงานในระยะถัดไป |

Release ยัง NOT READY ตาม [Release Gate Matrix](RELEASE_GATE_MATRIX.md)
CI, candidate version freeze, broader documentation fixes, runtime routing,
native lifecycle, technology fact checks และ human language review ไม่ได้ทำ
ใน Phase 2 นี้ Security/Support คง LATER และ G-16 ยัง BLOCKED
ไม่มี VS Code runtime tests, persistent Response Style Policy runtime tests,
Branch Protection หรือ unrelated ADR cleanup เพิ่มเข้ามา
ชุด static Response Style checks เดิมยังรันผ่าน aggregate validator ตามเดิม

native runner ต้องมี authorization guard ทั้งสองตัว และ disposable
machine/container/OS account ที่ไม่เข้าถึงข้อมูลส่วนตัวจริง environment
overrides และ config fingerprints เป็นมาตรการเสริม ไม่ใช่ OS sandbox
native command ที่ไม่มีใน CLI นั้นจะเป็น NOT_RUN และต้องเก็บหลักฐานผ่าน
reviewed native UI แยกต่างหาก การอัปเดตแบบไม่เปลี่ยน version และ remote
public install ยังไม่ถูกพิสูจน์ในรอบนี้

ไม่มีการติดตั้ง native ลงโปรไฟล์จริง ไม่มี commit, push, tag, publish
หรือแก้ GitHub settings และหยุดเมื่อจบ Phase 2 ไม่เริ่ม Phase 3

## รายชื่อไฟล์ที่เปลี่ยนทั้งหมด

<!-- PHASE2_FILES -->
```text
M catalog/editorial-skills.json
M catalog/engineering-capabilities.yaml
M catalog/technology-capabilities.yaml
M docs/SKILLS_CATALOG.md
M docs/SUPPORTED_TECHNOLOGIES.md
M docs/chayen/ACCEPTANCE_MATRIX.md
M docs/chayen/ARCHITECTURE.md
M docs/chayen/FINAL_AUDIT_REPORT.md
M docs/chayen/KNOWN_LIMITATIONS.md
M docs/chayen/PROGRESS.md
M docs/chayen/PROJECT_CHARTER.md
M docs/chayen/TECHNOLOGY_COVERAGE_AUDIT.md
A docs/production/PRODUCT_HARDENING_REPORT.md
M docs/production/RELEASE_GATE_MATRIX.md
M plugins/codejadee-chayen-framework/README.md
M plugins/codejadee-chayen-framework/skills/chayen-architecture/references/boundaries-and-domain.md
M plugins/codejadee-chayen-framework/skills/chayen-architecture/references/multitenancy.md
M plugins/codejadee-chayen-framework/skills/chayen-architecture/references/realtime-systems.md
M plugins/codejadee-chayen-framework/skills/chayen-architecture/references/resilience.md
M plugins/codejadee-chayen-framework/skills/chayen-architecture/references/rollout-planning.md
M plugins/codejadee-chayen-framework/skills/chayen-architecture/references/sequence-and-dataflow.md
M plugins/codejadee-chayen-framework/skills/chayen-backend/SKILL.md
M plugins/codejadee-chayen-framework/skills/chayen-backend/references/api-design.md
M plugins/codejadee-chayen-framework/skills/chayen-backend/references/api-endpoints.md
M plugins/codejadee-chayen-framework/skills/chayen-backend/references/authn-authz.md
M plugins/codejadee-chayen-framework/skills/chayen-backend/references/background-jobs.md
M plugins/codejadee-chayen-framework/skills/chayen-backend/references/external-integrations.md
M plugins/codejadee-chayen-framework/skills/chayen-backend/references/file-processing.md
M plugins/codejadee-chayen-framework/skills/chayen-backend/references/idempotency-and-consistency.md
M plugins/codejadee-chayen-framework/skills/chayen-backend/references/messaging.md
M plugins/codejadee-chayen-framework/skills/chayen-backend/references/node-servers.md
M plugins/codejadee-chayen-framework/skills/chayen-backend/references/nuxt-server.md
M plugins/codejadee-chayen-framework/skills/chayen-backend/references/workflow-api-integration.md
M plugins/codejadee-chayen-framework/skills/chayen-data/references/retention-and-governance.md
M plugins/codejadee-chayen-framework/skills/chayen-devops/references/nuxt-deployment.md
M plugins/codejadee-chayen-framework/skills/chayen-documentation/references/api-docs.md
M plugins/codejadee-chayen-framework/skills/chayen-frontend/references/device-permissions-and-push.md
M plugins/codejadee-chayen-framework/skills/chayen-frontend/references/nuxt-app.md
M plugins/codejadee-chayen-framework/skills/chayen-frontend/references/vue-nuxt.md
M plugins/codejadee-chayen-framework/skills/chayen-humanizer-th/SKILL.md
M plugins/codejadee-chayen-framework/skills/chayen-humanizer-th/references/protected-content.md
M plugins/codejadee-chayen-framework/skills/chayen-humanizer-th/references/thai-conventions.md
M plugins/codejadee-chayen-framework/skills/chayen-implementation/references/bug-fix.md
M plugins/codejadee-chayen-framework/skills/chayen-implementation/references/concurrency-safety.md
M plugins/codejadee-chayen-framework/skills/chayen-implementation/references/configuration-and-flags.md
M plugins/codejadee-chayen-framework/skills/chayen-implementation/references/contract-codegen.md
M plugins/codejadee-chayen-framework/skills/chayen-implementation/references/error-handling.md
M plugins/codejadee-chayen-framework/skills/chayen-implementation/references/feature-delivery.md
M plugins/codejadee-chayen-framework/skills/chayen-implementation/references/upgrades.md
M plugins/codejadee-chayen-framework/skills/chayen-performance/references/caching.md
M plugins/codejadee-chayen-framework/skills/chayen-repository/references/stack-detection.md
M plugins/codejadee-chayen-framework/skills/chayen-repository/references/unknowns-and-assumptions.md
M plugins/codejadee-chayen-framework/skills/chayen-requirements/references/elicitation-and-modeling.md
M plugins/codejadee-chayen-framework/skills/chayen-requirements/references/nonfunctional-requirements.md
M plugins/codejadee-chayen-framework/skills/chayen-security/references/stack-hardening.md
M plugins/codejadee-chayen-framework/skills/chayen-security/references/threat-modeling.md
M plugins/codejadee-chayen-framework/skills/chayen-security/references/vulnerability-remediation.md
M plugins/codejadee-chayen-framework/skills/chayen-testing/references/api-and-contract-tests.md
M tests/editorial/humanizer-th-cases.json
A tests/editorial/numeric-preservation.test.mjs
D tests/evals/claude/pos-backend-elysia-route/graders/expected-skill.md
D tests/evals/claude/pos-backend-elysia-route/graders/forbidden-skills.md
D tests/evals/claude/pos-backend-elysia-route/prompt.md
A tests/evals/claude/pos-backend-next-schema/graders/expected-skill.md
A tests/evals/claude/pos-backend-next-schema/graders/forbidden-skills.md
A tests/evals/claude/pos-backend-next-schema/prompt.md
A tests/evals/claude/pos-frontend-i18n-key-wiring/graders/expected-skill.md
A tests/evals/claude/pos-frontend-i18n-key-wiring/graders/forbidden-skills.md
A tests/evals/claude/pos-frontend-i18n-key-wiring/prompt.md
A tests/evals/claude/pos-frontend-i18n-routing/graders/expected-skill.md
A tests/evals/claude/pos-frontend-i18n-routing/graders/forbidden-skills.md
A tests/evals/claude/pos-frontend-i18n-routing/prompt.md
A tests/evals/claude/uns-backend-elysia-route/graders/no-chayen-skill.md
A tests/evals/claude/uns-backend-elysia-route/prompt.md
A tests/evals/claude/uns-backend-nitro/graders/no-chayen-skill.md
A tests/evals/claude/uns-backend-nitro/prompt.md
M tests/evaluation/step40/README.md
M tests/evaluation/step40/discovery-probes.json
A tests/production/hardening.test.mjs
M tests/provider-compatibility/README.md
A tests/provider-compatibility/lifecycle.mjs
A tests/provider-compatibility/lifecycle.test.mjs
M tests/provider-compatibility/run-lifecycle.sh
M tests/skills/recipe-cases.json
M tests/skills/technology-cases.json
M tests/skills/trigger-cases.json
M tools/evals/score-step40.mjs
M tools/validate/README.md
A tools/validate/check-hardening.mjs
M tools/validate/validate-all.mjs
```

90 files; M = modified, A = added, D = removed.
<!-- /PHASE2_FILES -->
