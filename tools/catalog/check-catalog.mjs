#!/usr/bin/env node
// Developer-only checker for the Chayen Engineering Capability Catalog
// (catalog/engineering-capabilities.yaml). Implements validator V-11 from
// ARCHITECTURE C-03/C-12. Zero dependencies (Node.js >= 20.11, for import.meta.dirname). Never shipped.
//
// Usage:
//   node tools/catalog/check-catalog.mjs               # check; exit 1 on any error
//   node tools/catalog/check-catalog.mjs --write-doc   # regenerate the generated block in
//                                                      # docs/chayen/CAPABILITY_COVERAGE.md
//   node tools/catalog/check-catalog.mjs --dump-json   # print the parsed catalog as JSON
//   Options: --root <repoRoot>  --file <catalogPath>  (used for negative-control runs)
//
// The YAML is a restricted subset (D-021) parsed by the small parser below, so
// no YAML library is needed. The expected inventory is embedded verbatim from
// the user's Step 07 prompt and is the reference for the count, uniqueness, and
// "no rename / no omission" checks.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { parseYamlSubset } from "./catalog-lib.mjs";
import { loadEditorialRegistration, MAX_ENTRY_SKILLS } from "./skill-registration.mjs";

const argv = process.argv.slice(2);
const opt = (name) => { const i = argv.indexOf(name); return i > -1 ? argv[i + 1] : undefined; };
const root = path.resolve(opt("--root") ?? path.join(import.meta.dirname, "..", ".."));
const catalogFile = path.resolve(root, opt("--file") ?? "catalog/engineering-capabilities.yaml");
const docFile = path.join(root, "docs", "chayen", "CAPABILITY_COVERAGE.md");
const writeDoc = argv.includes("--write-doc");
const dumpJson = argv.includes("--dump-json");

// ---------------------------------------------------------------------------
// Expected inventory (verbatim from the Step 07 prompt; source of truth)
// ---------------------------------------------------------------------------
const INVENTORY_TEXT = `
01 REPOSITORY (9)
repo-onboarding
repository-map
dependency-mapping
change-impact-analysis
git-history-analysis
code-ownership-analysis
convention-discovery
technical-debt-inventory
unknowns-and-assumptions

02 REQUIREMENTS (10)
requirement-elicitation
user-story-refinement
acceptance-criteria
use-case-modeling
business-rule-extraction
requirement-traceability
scope-and-dependency
edge-case-discovery
nonfunctional-requirements
backlog-decomposition

03 ARCHITECTURE (10)
architecture-review
architecture-option-analysis
architecture-decision-record
system-boundary-design
domain-modeling
component-design
sequence-and-dataflow
architecture-fitness
multitenancy-design
resilience-design

04 PLANNING (8)
task-contract
implementation-planning
risk-classification
estimation-and-sizing
migration-planning
rollout-planning
handoff-summary
decision-register

05 IMPLEMENTATION (12)
feature-implementation
bug-fix
code-refactoring
safe-code-edit
algorithm-design
concurrency-safety
error-handling
dependency-upgrade
configuration-change
feature-flagging
code-generation-from-contract
compatibility-preserving-change

06 BACKEND (10)
api-design
api-implementation
api-contract-validation
api-versioning
authentication-authorization-implementation
event-driven-integration
message-queue-design
background-job-design
external-service-integration
idempotency-and-retries

07 FRONTEND (10)
ui-feature-implementation
component-architecture
state-management
form-and-validation
responsive-layout
accessibility-audit
frontend-performance
design-system-integration
internationalization
frontend-error-handling

08 MOBILE-DESKTOP (8)
mobile-feature
navigation-and-deep-link
offline-first
device-permission-and-sensors
push-notification
app-lifecycle
mobile-performance
desktop-packaging-and-update

09 DATABASE-DATA (12)
data-modeling
schema-migration
query-optimization
index-review
transaction-consistency
data-integrity-validation
data-migration
backfill-planning
etl-pipeline
data-quality
data-retention
backup-restore-drill

10 TESTING-QA (14)
test-strategy
unit-test-generation
integration-test-design
e2e-test-automation
contract-testing
api-test-automation
regression-testing
property-based-testing
mutation-testing
fuzz-testing
test-data-factory
flaky-test-diagnosis
test-coverage-gap
test-failure-triage

11 SECURITY-PRIVACY (14)
threat-modeling
secure-code-review
sast-triage
dependency-vulnerability-triage
secret-detection-and-rotation-plan
authorization-review
input-output-validation
ssrf-and-egress-review
crypto-usage-review
privacy-impact-assessment
secure-logging
sbom-and-license-review
container-iac-security-review
vulnerability-remediation

12 PERFORMANCE (10)
performance-baselining
profiling
load-test-design
load-test-analysis
bottleneck-analysis
memory-leak-analysis
latency-budget
capacity-planning
cache-strategy
cost-performance-optimization

13 DEVOPS (12)
build-system-setup
ci-pipeline-design
cd-pipeline-design
dockerfile-review
container-hardening
infrastructure-as-code
environment-parity
secrets-management
release-packaging
deployment-validation
rollback-verification
artifact-provenance

14 OPERATIONS-SRE (10)
observability-design
structured-logging
metrics-and-slo
distributed-tracing
alert-tuning
production-incident-triage
root-cause-analysis
postmortem
disaster-recovery-planning
runbook-generation

15 MODERNIZATION (10)
legacy-system-assessment
safe-refactor-plan
strangler-migration
framework-version-upgrade
breaking-change-analysis
dead-code-analysis
deprecation-plan
monolith-modularization
hotfix-preparation
technical-debt-prioritization

16 DOCUMENTATION (10)
readme-maintenance
api-documentation
architecture-documentation
developer-onboarding-guide
pull-request-preparation
code-review-assistant
review-comment-resolution
knowledge-transfer
release-notes
git-workflow-assistant

17 AI-ML-LLM (10)
dataset-readiness
ml-experiment-design
model-evaluation
model-serving
ml-data-drift
rag-pipeline-design
retrieval-evaluation
prompt-and-tool-evaluation
llm-safety-redteam
llm-observability

18 GOVERNANCE (10)
standards-compliance-check
change-passport
task-evidence-audit
policy-as-code-validation
access-control-review
data-governance-check
license-obligation-review
release-go-no-go
exception-and-waiver-management
agent-action-risk-review

19 SPECIALIZED (9)
graphql-schema-evolution
realtime-system-design
search-and-indexing
file-processing-pipeline
webhook-safety
payments-and-ledger-consistency
geospatial-systems
multi-region-resilience
browser-extension-development

20 AGENT-ENGINEERING (8)
skill-authoring
skill-review
skill-testing
skill-version-migration
provider-compatibility
policy-conflict-detection
agent-session-handoff
agent-task-benchmarking

TOTAL EXPECTED = 206
`;

function parseInventory(text) {
  const domains = [];
  let total = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    let m;
    if ((m = /^(\d{2}) ([A-Z][A-Z-]*) \((\d+)\)$/.exec(line))) {
      domains.push({ num: m[1], title: m[2], declared: Number(m[3]), names: [] });
    } else if ((m = /^TOTAL EXPECTED = (\d+)$/.exec(line))) {
      total = Number(m[1]);
    } else if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(line) && domains.length) {
      domains.at(-1).names.push(line);
    } else {
      throw new Error(`inventory: unrecognised line "${line}"`);
    }
  }
  return { domains, total };
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------
const errors = [];
const warnings = [];
const err = (check, msg) => errors.push(`${check}: ${msg}`);
const warn = (check, msg) => warnings.push(`${check}: ${msg}`);
const isStr = (v) => typeof v === "string";
const isArr = Array.isArray;
const isObj = (v) => v !== null && typeof v === "object" && !isArr(v);

const inv = parseInventory(INVENTORY_TEXT);
let cat;
try {
  cat = parseYamlSubset(fs.readFileSync(catalogFile, "utf8"));
} catch (e) {
  console.error(`ERROR V-11.1 parse: ${path.relative(root, catalogFile)}: ${e.message}`);
  process.exit(1);
}
if (dumpJson) { process.stdout.write(JSON.stringify(cat, null, 2) + "\n"); process.exit(0); }

// V-11.0 inventory self-consistency (guards the embedded copy)
{
  const sum = inv.domains.reduce((n, d) => n + d.names.length, 0);
  if (inv.domains.length !== 20) err("V-11.0 inventory", `embedded inventory has ${inv.domains.length} domains, expected 20`);
  for (const d of inv.domains) if (d.names.length !== d.declared) err("V-11.0 inventory", `domain ${d.num} lists ${d.names.length} names but declares ${d.declared}`);
  if (sum !== inv.total) err("V-11.0 inventory", `embedded inventory sums to ${sum}, TOTAL EXPECTED is ${inv.total}`);
}

const STATUS = ["PLANNED", "IN_PROGRESS", "IMPLEMENTED", "VERIFIED", "BLOCKED", "DEFERRED"];
const MAPPING = ["existing", "planned"];
// Unfinished-text markers. "TODO" alone is allowed because debt inventories
// legitimately talk about TODO comments; "TODO:" or a leading TODO is not.
const PLACEHOLDER = /\b(TBD|FIXME)\b|lorem ipsum|\.\.\.|^\s*TODO\b|\bTODO:|<fill|\bXXX\b/i;

// V-11.2 header
const meta = cat.catalog;
const pluginRoot = isObj(meta) && isStr(meta.plugin_root) ? meta.plugin_root : null;
if (!isObj(meta)) err("V-11.2 header", "missing catalog header");
else {
  if (meta.expected_domains !== 20) err("V-11.2 header", `expected_domains is ${meta.expected_domains}, must be 20`);
  if (meta.expected_capabilities !== inv.total) err("V-11.2 header", `expected_capabilities is ${meta.expected_capabilities}, must be ${inv.total}`);
  if (!pluginRoot || !fs.existsSync(path.join(root, pluginRoot))) err("V-11.2 header", `plugin_root "${meta.plugin_root}" does not exist`);
}
if (JSON.stringify(cat.status_vocabulary) !== JSON.stringify(STATUS)) err("V-11.2 header", "status_vocabulary must equal BUILD_CONTRACT §5.1");
if (JSON.stringify(cat.mapping_vocabulary) !== JSON.stringify(MAPPING)) err("V-11.2 header", "mapping_vocabulary must be [existing, planned]");
const pluginPath = (rel) => path.join(root, pluginRoot ?? "", rel);

// Stacks
const packs = new Set(isArr(cat.stack_packs) ? cat.stack_packs : []);
const stackGroups = isObj(cat.stack_groups) ? cat.stack_groups : {};
for (const [g, members] of Object.entries(stackGroups)) {
  if (!isArr(members)) { err("V-11.2 header", `stack group ${g} must be a list`); continue; }
  for (const m of members) if (!packs.has(m)) err("V-11.2 header", `stack group ${g} names unknown pack ${m}`);
}
const stackTokens = new Set(["any", ...packs, ...Object.keys(stackGroups)]);

// V-11.3 entry skills
const skills = new Map();
const editorialRegistration = loadEditorialRegistration(root, cat);
for (const message of editorialRegistration.errors) err("V-11.3 entry-skills", message);
if (!isArr(cat.entry_skills)) err("V-11.3 entry-skills", "entry_skills must be a list");
else {
  if (cat.entry_skills.length > MAX_ENTRY_SKILLS) err("V-11.3 entry-skills", `${cat.entry_skills.length} entry skills exceed the cap of ${MAX_ENTRY_SKILLS} (D-053)`);
  for (const s of cat.entry_skills) {
    if (!isObj(s) || !isStr(s.name) || !/^chayen-[a-z0-9-]+$/.test(s.name)) { err("V-11.3 entry-skills", `bad entry skill record ${JSON.stringify(s)}`); continue; }
    if (skills.has(s.name)) err("V-11.3 entry-skills", `duplicate entry skill ${s.name}`);
    const present = fs.existsSync(pluginPath(`skills/${s.name}/SKILL.md`));
    if (!MAPPING.includes(s.mapping)) err("V-11.3 entry-skills", `${s.name}: mapping must be existing or planned`);
    else if ((s.mapping === "existing") !== present) err("V-11.3 entry-skills", `${s.name}: mapping is ${s.mapping} but SKILL.md ${present ? "exists" : "does not exist"}`);
    if (!isStr(s.scope) || s.scope.length < 40) err("V-11.3 entry-skills", `${s.name}: scope missing or too short`);
    skills.set(s.name, s);
  }
  // Every shipped skill directory must appear in the catalog's entry-skill list.
  const skillsDir = pluginPath("skills");
  if (fs.existsSync(skillsDir)) {
    for (const d of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (d.isDirectory() && !skills.has(d.name) && !editorialRegistration.skills.has(d.name)) err("V-11.3 entry-skills", `shipped skill ${d.name} is not registered in either skill category`);
    }
  }
}

// V-11.4 domains
const domainById = new Map();
if (!isArr(cat.domains) || cat.domains.length !== 20) err("V-11.4 domains", `expected 20 domains, found ${isArr(cat.domains) ? cat.domains.length : 0}`);
(cat.domains ?? []).forEach((d, idx) => {
  const exp = inv.domains[idx];
  const id = `D${String(idx + 1).padStart(2, "0")}`;
  if (!isObj(d)) { err("V-11.4 domains", `domain #${idx + 1} is not a record`); return; }
  if (d.id !== id) err("V-11.4 domains", `domain #${idx + 1} id ${d.id}, expected ${id}`);
  if (exp && d.title !== exp.title) err("V-11.4 domains", `${d.id} title "${d.title}" does not match inventory "${exp.title}"`);
  if (exp && d.expected_count !== exp.declared) err("V-11.4 domains", `${d.id} expected_count ${d.expected_count}, inventory says ${exp.declared}`);
  if (!isStr(d.key) || d.key !== String(d.title).toLowerCase()) err("V-11.4 domains", `${d.id} key must be the lower-case title`);
  if (domainById.has(d.id)) err("V-11.4 domains", `duplicate domain id ${d.id}`);
  domainById.set(d.id, { ...d, exp, caps: [] });
});

// V-11.5 capabilities: count, uniqueness, inventory identity
const caps = isArr(cat.capabilities) ? cat.capabilities : [];
const capById = new Map();
const capByName = new Map();
if (caps.length !== inv.total) err("V-11.5 count", `found ${caps.length} capabilities, expected exactly ${inv.total}`);
for (const c of caps) {
  if (!isObj(c)) { err("V-11.5 count", "capability entry is not a record"); continue; }
  if (capById.has(c.id)) err("V-11.5 unique-id", `duplicate id ${c.id}`);
  else capById.set(c.id, c);
  if (capByName.has(c.name)) err("V-11.5 unique-name", `duplicate name ${c.name} (${capByName.get(c.name).id}, ${c.id})`);
  else capByName.set(c.name, c);
  const m = /^CAP-(\d{2})-(\d{3})$/.exec(c.id ?? "");
  if (!m) { err("V-11.5 id-format", `bad id ${c.id}`); continue; }
  const dom = domainById.get(c.domain);
  if (!dom) { err("V-11.5 domain", `${c.id}: unknown domain ${c.domain}`); continue; }
  if (`D${m[1]}` !== c.domain) err("V-11.5 id-format", `${c.id}: id domain does not match domain ${c.domain}`);
  dom.caps.push(c);
  const expName = dom.exp?.names[Number(m[2]) - 1];
  if (expName === undefined) err("V-11.5 inventory", `${c.id}: no inventory entry at position ${Number(m[2])} of ${c.domain}`);
  else if (c.name !== expName) err("V-11.5 inventory", `${c.id}: name "${c.name}" does not match inventory "${expName}" (no renames)`);
}
for (const dom of domainById.values()) {
  if (!dom.exp) continue;
  if (dom.caps.length !== dom.exp.declared) err("V-11.5 domain-count", `${dom.id} ${dom.title}: ${dom.caps.length} capabilities, expected ${dom.exp.declared}`);
  const present = new Set(dom.caps.map((c) => c.name));
  for (const n of dom.exp.names) if (!present.has(n)) err("V-11.5 inventory", `${dom.id}: inventory capability "${n}" is missing (no omissions)`);
  dom.caps.forEach((c, k) => {
    const want = `CAP-${dom.id.slice(1)}-${String(k + 1).padStart(3, "0")}`;
    if (c.id !== want) err("V-11.5 order", `${c.id}: expected ${want} at this position (inventory order)`);
  });
}

// V-11.6 record fields, V-11.7 mappings, V-11.10 status
const strField = (c, f, min) => { if (!isStr(c[f]) || c[f].length < min) err("V-11.6 fields", `${c.id}: ${f} must be a string of at least ${min} characters`); };
const listField = (c, f, min) => {
  if (!isArr(c[f]) || c[f].length < min) { err("V-11.6 fields", `${c.id}: ${f} needs at least ${min} entries`); return; }
  c[f].forEach((v) => { if (!isStr(v) || v.length < 8) err("V-11.6 fields", `${c.id}: ${f} entries must be strings of at least 8 characters`); });
  if (new Set(c[f]).size !== c[f].length) err("V-11.6 fields", `${c.id}: duplicate entries in ${f}`);
};
const ALLOWED = new Set(["id", "name", "domain", "purpose", "positive_triggers", "negative_triggers", "inputs", "outputs", "stacks",
  "entry_skill", "secondary_skills", "recipe", "consolidation", "overlaps", "existing_coverage", "verification", "verification_evidence", "status", "notes"]);
const REQUIRED = ["id", "name", "domain", "purpose", "positive_triggers", "negative_triggers", "inputs", "outputs", "stacks", "entry_skill", "recipe", "verification", "status"];
const groups = new Map((isArr(cat.consolidation_groups) ? cat.consolidation_groups : []).map((g) => [g.id, { ...g, seen: [] }]));
const purposes = new Map();

for (const c of capById.values()) {
  for (const k of Object.keys(c)) if (!ALLOWED.has(k)) err("V-11.6 fields", `${c.id}: unknown field ${k}`);
  for (const k of REQUIRED) if (!(k in c)) err("V-11.6 fields", `${c.id}: missing required field ${k}`);
  strField(c, "purpose", 40);
  strField(c, "verification", 40);
  listField(c, "positive_triggers", 2);
  listField(c, "negative_triggers", 2);
  listField(c, "inputs", 1);
  listField(c, "outputs", 1);
  if (isStr(c.purpose)) {
    if (purposes.has(c.purpose)) err("V-11.6 fields", `${c.id}: purpose duplicates ${purposes.get(c.purpose)}`);
    purposes.set(c.purpose, c.id);
  }
  const texts = [c.purpose, c.verification, c.notes, ...(c.positive_triggers ?? []), ...(c.negative_triggers ?? []), ...(c.inputs ?? []), ...(c.outputs ?? [])].filter(isStr);
  for (const t of texts) if (PLACEHOLDER.test(t)) err("V-11.6 placeholder", `${c.id}: placeholder-like text "${t.slice(0, 60)}"`);
  for (const t of c.positive_triggers ?? []) {
    if (/chayen/i.test(t)) err("V-11.6 triggers", `${c.id}: positive trigger mentions Chayen (REQ-03)`);
    if ((c.negative_triggers ?? []).includes(t)) err("V-11.6 triggers", `${c.id}: a trigger is both positive and negative`);
  }
  for (const t of c.negative_triggers ?? []) {
    const ref = /→ (CAP-\d{2}-\d{3}) ([a-z0-9-]+)$/.exec(t);
    if (ref) {
      const target = capById.get(ref[1]);
      if (!target) err("V-11.6 triggers", `${c.id}: negative trigger points to unknown ${ref[1]}`);
      else if (target.name !== ref[2]) err("V-11.6 triggers", `${c.id}: negative trigger names ${ref[1]} "${ref[2]}", catalog has "${target.name}"`);
      else if (ref[1] === c.id) err("V-11.6 triggers", `${c.id}: negative trigger points to itself`);
    } else if (!/→ /.test(t)) err("V-11.6 triggers", `${c.id}: negative trigger must say where the request goes ("→ CAP-.. name" or "→ native answer ...")`);
  }
  if (!isArr(c.stacks) || !c.stacks.length) err("V-11.6 fields", `${c.id}: stacks must be a non-empty list`);
  else {
    for (const s of c.stacks) if (!stackTokens.has(s)) err("V-11.6 fields", `${c.id}: unknown stack token ${s}`);
    if (c.stacks.includes("any") && c.stacks.length > 1) err("V-11.6 fields", `${c.id}: "any" must be the only stack token`);
  }

  // entry skill
  const es = c.entry_skill;
  const skill = isObj(es) ? skills.get(es.name) : undefined;
  if (!skill) err("V-11.7 entry-skill", `${c.id}: entry_skill ${JSON.stringify(es)} is not a listed entry skill`);
  else if (es.mapping !== skill.mapping) err("V-11.7 entry-skill", `${c.id}: entry_skill mapping ${es.mapping} disagrees with ${skill.name} (${skill.mapping})`);
  for (const s of c.secondary_skills ?? []) {
    if (!skills.has(s)) err("V-11.7 entry-skill", `${c.id}: secondary skill ${s} is not listed`);
    if (s === es?.name) err("V-11.7 entry-skill", `${c.id}: secondary skill repeats the entry skill`);
  }

  // recipe
  const r = c.recipe;
  if (!isObj(r) || !isStr(r.path) || !MAPPING.includes(r.mapping)) err("V-11.7 recipe", `${c.id}: recipe needs path and mapping`);
  else {
    if (es && !r.path.startsWith(`skills/${es.name}/`)) err("V-11.7 recipe", `${c.id}: recipe ${r.path} is outside its entry skill (D-016 skill-local)`);
    if (!/^skills\/[a-z0-9-]+\/references\/[a-z0-9-]+\.md$/.test(r.path)) err("V-11.7 recipe", `${c.id}: recipe ${r.path} must be skills/<skill>/references/<name>.md; SKILL.md is never a recipe (D-026)`);
    const present = fs.existsSync(pluginPath(r.path));
    if ((r.mapping === "existing") !== present) err("V-11.7 recipe", `${c.id}: recipe mapping is ${r.mapping} but ${r.path} ${present ? "exists" : "does not exist"}`);
  }

  // consolidation
  if (c.consolidation !== undefined) {
    const g = groups.get(c.consolidation);
    if (!g) err("V-11.8 consolidation", `${c.id}: unknown group ${c.consolidation}`);
    else {
      g.seen.push(c.id);
      if (isObj(r) && r.path !== g.recipe) err("V-11.8 consolidation", `${c.id}: recipe ${r?.path} differs from ${g.id} recipe ${g.recipe}`);
    }
  }

  // overlaps
  for (const o of c.overlaps ?? []) {
    const other = capById.get(o) ?? caps.find((x) => x.id === o);
    if (!other) err("V-11.9 overlaps", `${c.id}: overlap ${o} does not exist`);
    else if (o === c.id) err("V-11.9 overlaps", `${c.id}: overlaps itself`);
    else if (!(other.overlaps ?? []).includes(c.id)) err("V-11.9 overlaps", `${c.id} → ${o} is not symmetric`);
    else if (c.consolidation && c.consolidation === other.consolidation) err("V-11.9 overlaps", `${c.id} and ${o} share ${c.consolidation}; an overlap must cross recipes`);
  }

  // status
  if (c.status === "COMPLETED") err("V-11.10 status", `${c.id}: COMPLETED is not a status (BUILD_CONTRACT §5.1)`);
  else if (!STATUS.includes(c.status)) err("V-11.10 status", `${c.id}: unknown status ${c.status}`);
  const cov = c.existing_coverage;
  if (cov !== undefined) {
    if (!isArr(cov) || !cov.length) err("V-11.10 status", `${c.id}: existing_coverage must be a non-empty list`);
    else for (const p of cov) {
      if (es && !String(p).startsWith(`skills/${es.name}/`)) err("V-11.10 status", `${c.id}: coverage ${p} is outside the entry skill`);
      if (!fs.existsSync(pluginPath(String(p)))) err("V-11.10 status", `${c.id}: coverage path ${p} does not exist`);
    }
  }
  if (c.status === "PLANNED" && cov !== undefined) err("V-11.10 status", `${c.id}: PLANNED capabilities must not list existing_coverage (use notes for related content elsewhere)`);
  if (c.status === "IN_PROGRESS" && cov === undefined) err("V-11.10 status", `${c.id}: IN_PROGRESS requires existing_coverage evidence`);
  if (["IMPLEMENTED", "VERIFIED"].includes(c.status)) {
    if (r?.mapping !== "existing") err("V-11.10 status", `${c.id}: ${c.status} requires an existing recipe`);
    if (!isStr(c.verification_evidence) || c.verification_evidence.length < 20) err("V-11.10 status", `${c.id}: ${c.status} requires verification_evidence`);
  }
  if (c.status === "BLOCKED" && !/\b(Q|R)-\d+/.test(c.notes ?? "")) err("V-11.10 status", `${c.id}: BLOCKED requires a linked issue in notes`);
}

// V-11.8 consolidation group integrity
for (const g of groups.values()) {
  if (!/^CG-\d{2}$/.test(g.id)) err("V-11.8 consolidation", `bad group id ${g.id}`);
  if (!isArr(g.members) || g.members.length < 2) err("V-11.8 consolidation", `${g.id}: a group needs at least 2 members`);
  if (!isStr(g.rationale) || g.rationale.length < 30) err("V-11.8 consolidation", `${g.id}: rationale missing`);
  if (!/^skills\/[a-z0-9-]+\/references\/[a-z0-9-]+\.md$/.test(g.recipe ?? "")) err("V-11.8 consolidation", `${g.id}: recipe ${g.recipe} must be a references/*.md file (D-026)`);
  const present = fs.existsSync(pluginPath(g.recipe ?? ""));
  if ((g.mapping === "existing") !== present) err("V-11.8 consolidation", `${g.id}: mapping ${g.mapping} but ${g.recipe} ${present ? "exists" : "does not exist"}`);
  const a = [...(g.members ?? [])].sort().join(","), b = [...g.seen].sort().join(",");
  if (a !== b) err("V-11.8 consolidation", `${g.id}: members [${a}] differ from capabilities that reference it [${b}]`);
}

// Every entry skill must own at least one capability.
const bySkill = new Map([...skills.keys()].map((k) => [k, []]));
for (const c of capById.values()) bySkill.get(c.entry_skill?.name)?.push(c);
for (const [s, list] of bySkill) if (!list.length) err("V-11.3 entry-skills", `${s} owns no capability`);

// ---------------------------------------------------------------------------
// Generated coverage tables (V-11.11 doc sync)
// ---------------------------------------------------------------------------
const BEGIN = "<!-- BEGIN GENERATED: node tools/catalog/check-catalog.mjs --write-doc -->";
const END = "<!-- END GENERATED -->";
const countBy = (list, f) => list.reduce((m, c) => (m[f(c)] = (m[f(c)] ?? 0) + 1, m), {});
const statusCols = ["PLANNED", "IN_PROGRESS", "IMPLEMENTED", "VERIFIED"];

function generated() {
  const all = [...capById.values()];
  const out = [BEGIN, ""];
  out.push("### Totals by domain", "", "| Domain | Title | Capabilities | PLANNED | IN_PROGRESS | IMPLEMENTED | VERIFIED | Entry skills used |", "|---|---|---|---|---|---|---|---|");
  for (const d of domainById.values()) {
    const st = countBy(d.caps, (c) => c.status);
    const sk = Object.entries(countBy(d.caps, (c) => c.entry_skill?.name)).map(([k, v]) => `${k} (${v})`).join(", ");
    out.push(`| ${d.id} | ${d.title} | ${d.caps.length} | ${statusCols.map((s) => st[s] ?? 0).join(" | ")} | ${sk} |`);
  }
  const tot = countBy(all, (c) => c.status);
  out.push(`| **All** | | **${all.length}** | ${statusCols.map((s) => `**${tot[s] ?? 0}**`).join(" | ")} | |`, "");
  out.push("### Totals by entry skill", "", "| Entry skill | Skill file | Capabilities | IN_PROGRESS | Domains | Recipe files (existing / planned) |", "|---|---|---|---|---|---|");
  for (const [s, list] of bySkill) {
    const recipes = new Map(list.map((c) => [c.recipe.path, c.recipe.mapping]));
    const ex = [...recipes.values()].filter((m) => m === "existing").length;
    const doms = [...new Set(list.map((c) => c.domain))].join(", ");
    out.push(`| ${s} | ${skills.get(s).mapping} | ${list.length} | ${list.filter((c) => c.status === "IN_PROGRESS").length} | ${doms} | ${ex} / ${recipes.size - ex} |`);
  }
  out.push("");
  out.push("### Consolidation groups (shared recipe, separate identities)", "", "| Group | Recipe (plugin-relative) | Mapping | Members |", "|---|---|---|---|");
  for (const g of groups.values()) out.push(`| ${g.id} | \`${g.recipe}\` | ${g.mapping} | ${g.members.map((id) => `${id} ${capById.get(id)?.name}`).join("<br>")} |`);
  out.push("");
  out.push("### Capability index", "");
  for (const d of domainById.values()) {
    out.push(`#### ${d.id} ${d.title} (${d.caps.length})`, "", "| ID | Capability | Entry skill | Recipe | Group | Status |", "|---|---|---|---|---|---|");
    for (const c of d.caps) {
      const skillCell = `${c.entry_skill.name}${c.entry_skill.mapping === "planned" ? " (planned)" : ""}`;
      const recipeCell = `${path.posix.basename(c.recipe.path)}${c.recipe.mapping === "planned" ? " (planned)" : ""}`;
      out.push(`| ${c.id} | ${c.name} | ${skillCell} | ${recipeCell} | ${c.consolidation ?? "—"} | ${c.status} |`);
    }
    out.push("");
  }
  out.push(END);
  return out.join("\n");
}

if (!errors.length) {
  const block = generated();
  if (!fs.existsSync(docFile)) err("V-11.11 doc-sync", `${path.relative(root, docFile)} does not exist`);
  else {
    const doc = fs.readFileSync(docFile, "utf8").replace(/\r\n/g, "\n");
    const a = doc.indexOf(BEGIN), b = doc.indexOf(END);
    if (a < 0 || b < a) err("V-11.11 doc-sync", "generated-block markers not found in CAPABILITY_COVERAGE.md");
    else {
      const current = doc.slice(a, b + END.length);
      if (current !== block) {
        if (writeDoc) { fs.writeFileSync(docFile, doc.slice(0, a) + block + doc.slice(b + END.length)); console.log("Wrote generated block to CAPABILITY_COVERAGE.md"); }
        else err("V-11.11 doc-sync", "CAPABILITY_COVERAGE.md generated block is stale; run with --write-doc");
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const all = [...capById.values()];
const fingerprint = (rows) => crypto.createHash("sha256").update(rows.join("\n")).digest("hex");
const invRows = inv.domains.flatMap((d) => d.names.map((n, k) => `CAP-${d.num}-${String(k + 1).padStart(3, "0")} ${n}`));
const catRows = caps.map((c) => `${c.id} ${c.name}`);
console.log(`Catalog: ${path.relative(root, catalogFile).split(path.sep).join("/")}`);
console.log(`Domains: ${domainById.size} (expected 20)`);
console.log(`Capabilities: ${caps.length} (expected ${inv.total}); unique ids ${capById.size}; unique names ${capByName.size}`);
console.log(`Per domain: ${[...domainById.values()].map((d) => `${d.id}=${d.caps.length}`).join(" ")}`);
console.log(`Status: ${Object.entries(countBy(all, (c) => c.status)).map(([k, v]) => `${k}=${v}`).join(" ")}`);
console.log(`Entry skills: ${skills.size} (${[...skills.values()].filter((s) => s.mapping === "existing").length} existing, ${[...skills.values()].filter((s) => s.mapping === "planned").length} planned); consolidation groups: ${groups.size}`);
console.log(`Inventory fingerprint (sha256 of "id name" rows): expected ${fingerprint(invRows).slice(0, 16)}, catalog ${fingerprint(catRows).slice(0, 16)}`);
for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(errors.length ? `FAIL: ${errors.length} error(s), ${warnings.length} warning(s)` : `PASS: 0 errors, ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
