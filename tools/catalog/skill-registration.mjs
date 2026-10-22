// Developer-only shared registration rules (Step 36 / D-053; project category D-062;
// extensible registration without count caps or name allow-lists D-066 / ADR-0013 §7). Never shipped.
import fs from "node:fs";
import { inside } from "../validate/safe-paths.mjs";
import { parseYamlSubset } from "./catalog-lib.mjs";

export const EDITORIAL_REGISTRY = "catalog/editorial-skills.json";
export const PROJECT_REGISTRY = "catalog/project-skills.json";
// Provider name rule (S24, S19: 1-64 characters, a-z0-9 and single hyphens) plus the
// repository prefix. Validated before a name is ever used to build a path.
export const SKILL_NAME = /^chayen-[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MAX_NAME_LENGTH = 64;
export const validSkillName = (name) => typeof name === "string" && name.length <= MAX_NAME_LENGTH && SKILL_NAME.test(name);
// Pinned Humanizer language contracts (D-053..D-055). Other editorial records declare their own language.
export const PINNED_LANGUAGES = new Map([["chayen-humanizer-th", "th"], ["chayen-humanizer-en", "en"]]);
const LANGUAGE_CODE = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;
// The Humanizer name family belongs to the editorial category only.
const EDITORIAL_PREFIX = "chayen-humanizer-";
const object = v => v !== null && typeof v === "object" && !Array.isArray(v);
const exactKeys = (v, keys) => object(v) && Object.keys(v).length === keys.length && keys.every(k => Object.hasOwn(v, k));

// Shared record rules for non-engineering categories: provider-valid description, mapping/file parity.
function checkRecord(root, label, record, errors) {
  const { name, mapping, description } = record;
  if (!["planned", "existing"].includes(mapping)) errors.push(`${name}: mapping must be planned or existing`);
  if (typeof description !== "string" || !description.trim() || description.length > 1024 || /[\r\n]/.test(description)) {
    errors.push(`${name}: invalid ${label} description metadata`);
  }
  try {
    const plugin = inside(root, "plugins/codejadee-chayen-framework");
    const dir = inside(plugin, `skills/${name}`), file = inside(plugin, `skills/${name}/SKILL.md`);
    if (mapping === "planned" && fs.existsSync(dir)) errors.push(`${name}: planned registration must not have a shipped directory`);
    if (mapping === "existing" && (!fs.existsSync(file) || !fs.statSync(file).isFile())) errors.push(`${name}: existing registration requires SKILL.md`);
  } catch { errors.push(`${name}: linked or unsafe ${label} path`); }
}

function engineeringNames(engineeringCatalog) {
  const names = new Set();
  for (const record of Array.isArray(engineeringCatalog?.entry_skills) ? engineeringCatalog.entry_skills : []) {
    if (typeof record?.name === "string") names.add(record.name);
  }
  return names;
}

function isolationErrors(engineeringCatalog, names, label) {
  for (const capability of Array.isArray(engineeringCatalog?.capabilities) ? engineeringCatalog.capabilities : []) {
    if ([capability?.entry_skill?.name, ...(Array.isArray(capability?.secondary_skills) ? capability.secondary_skills : [])].some(n => names.has(n))) {
      return [`Engineering Catalog isolation: ${label} Skills cannot own or substitute engineering capability mappings`];
    }
  }
  return [];
}

// Project knowledge Skills (D-062, D-066): no engineering capability, no editorial language.
// Any number of records; each is admitted by schema, name, uniqueness and file parity.
export function loadProjectRegistration(root, engineeringCatalog = null) {
  const errors = [], skills = new Map();
  let registry;
  try {
    engineeringCatalog ??= parseYamlSubset(fs.readFileSync(inside(root, "catalog/engineering-capabilities.yaml"), "utf8"));
    registry = JSON.parse(fs.readFileSync(inside(root, PROJECT_REGISTRY), "utf8"));
  } catch {
    return { errors: ["project registration inputs missing, malformed or linked; inspect engineering catalog and project registry"], skills };
  }
  const engineering = engineeringNames(engineeringCatalog);
  if (!exactKeys(registry, ["version", "skills"]) || registry.version !== 1 || !Array.isArray(registry.skills)) {
    return { errors: ["project registry must contain only version 1 and skills"], skills };
  }
  for (const record of registry.skills) {
    if (!exactKeys(record, ["name", "mapping", "description"])) {
      errors.push("project record has missing or unsupported fields; no executable/configuration metadata is allowed");
      continue;
    }
    const { name } = record;
    if (!validSkillName(name)) { errors.push("invalid project Skill name: lowercase chayen-<words>, single hyphens, at most 64 characters"); continue; }
    if (name.startsWith(EDITORIAL_PREFIX)) { errors.push(`${name}: the ${EDITORIAL_PREFIX}* names belong to the editorial category`); continue; }
    if (skills.has(name) || engineering.has(name) || PINNED_LANGUAGES.has(name)) errors.push(`${name}: duplicate skill name across registration records`);
    checkRecord(root, "project", record, errors);
    skills.set(name, record);
  }
  errors.push(...isolationErrors(engineeringCatalog, new Set(skills.keys()), "project"));
  return { errors, skills };
}

// Editorial Skills (D-053, D-066): the two Humanizer records keep their pinned language
// contracts and must stay registered; further records declare a language code.
export function loadEditorialRegistration(root, engineeringCatalog = null) {
  const errors = [], skills = new Map(), engineering = new Set();
  let registry;
  try {
    engineeringCatalog ??= parseYamlSubset(fs.readFileSync(inside(root, "catalog/engineering-capabilities.yaml"), "utf8"));
    registry = JSON.parse(fs.readFileSync(inside(root, EDITORIAL_REGISTRY), "utf8"));
  } catch {
    return { errors: ["registration inputs missing, malformed or linked; inspect engineering catalog and editorial registry"], skills, engineering };
  }
  if (!object(engineeringCatalog)) return { errors: ["invalid Engineering Catalog registration object"], skills, engineering };
  for (const record of Array.isArray(engineeringCatalog.entry_skills) ? engineeringCatalog.entry_skills : []) {
    if (typeof record?.name !== "string") continue; // Existing engineering schema checks diagnose this.
    if (engineering.has(record.name)) errors.push("duplicate engineering skill registration");
    engineering.add(record.name);
    if (record.name.startsWith(EDITORIAL_PREFIX)) errors.push("Engineering Catalog isolation: editorial names cannot be engineering Entry Skills");
  }
  if (!exactKeys(registry, ["version", "skills"]) || registry.version !== 1 || !Array.isArray(registry.skills)) {
    return { errors: [...errors, "editorial registry must contain only version 1 and skills"], skills, engineering };
  }
  for (const record of registry.skills) {
    if (!exactKeys(record, ["name", "language", "mapping", "description"])) {
      errors.push("editorial record has missing or unsupported fields; no executable/configuration metadata is allowed");
      continue;
    }
    const { name, language } = record;
    if (!validSkillName(name)) { errors.push("invalid editorial Skill name: lowercase chayen-<words>, single hyphens, at most 64 characters"); continue; }
    if (skills.has(name) || engineering.has(name)) errors.push(`${name}: duplicate skill name across registration records`);
    if (PINNED_LANGUAGES.has(name) ? language !== PINNED_LANGUAGES.get(name) : typeof language !== "string" || !LANGUAGE_CODE.test(language)) {
      errors.push(`${name}: invalid Humanizer language metadata`);
    }
    checkRecord(root, "Humanizer", record, errors);
    skills.set(name, record);
  }
  for (const name of PINNED_LANGUAGES.keys()) if (!skills.has(name)) errors.push(`${name}: unregistered Editorial Skill`);
  // Names must be unique across every registration category (D-066).
  for (const name of loadProjectRegistration(root, engineeringCatalog).skills.keys()) {
    if (skills.has(name)) errors.push(`${name}: duplicate skill name across registration records`);
  }
  errors.push(...isolationErrors(engineeringCatalog, new Set(skills.keys()), "editorial"));
  return { errors, skills, engineering };
}

// Shipped or planned Skills per registration category, for reports (no cap applies, D-066).
export function registrationCounts(engineeringCatalog, editorial, project) {
  return { engineering: engineeringNames(engineeringCatalog).size, editorial: editorial.skills.size, project: project.skills.size };
}
