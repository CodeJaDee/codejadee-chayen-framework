// Developer-only shared registration rules (Step 36 / D-053; project category D-062). Never shipped.
import fs from "node:fs";
import { inside } from "../validate/safe-paths.mjs";
import { parseYamlSubset } from "./catalog-lib.mjs";

export const MAX_ENTRY_SKILLS = 16;
export const L0_BUDGET = 7000;
export const EDITORIAL_REGISTRY = "catalog/editorial-skills.json";
export const PROJECT_REGISTRY = "catalog/project-skills.json";
const LANGUAGES = new Map([["chayen-humanizer-th", "th"], ["chayen-humanizer-en", "en"]]);
const PROJECT_NAMES = new Set(["chayen-init"]);
const object = v => v !== null && typeof v === "object" && !Array.isArray(v);
const exactKeys = (v, keys) => object(v) && Object.keys(v).length === keys.length && keys.every(k => Object.hasOwn(v, k));

// Project knowledge Skills (D-062): no engineering capability, no editorial language.
export function loadProjectRegistration(root, engineeringCatalog = null) {
  const errors = [], skills = new Map(), engineering = new Set();
  let registry;
  try {
    engineeringCatalog ??= parseYamlSubset(fs.readFileSync(inside(root, "catalog/engineering-capabilities.yaml"), "utf8"));
    registry = JSON.parse(fs.readFileSync(inside(root, PROJECT_REGISTRY), "utf8"));
  } catch {
    return { errors: ["project registration inputs missing, malformed or linked; inspect engineering catalog and project registry"], skills };
  }
  for (const record of Array.isArray(engineeringCatalog?.entry_skills) ? engineeringCatalog.entry_skills : []) {
    if (typeof record?.name === "string") engineering.add(record.name);
  }
  if (!exactKeys(registry, ["version", "skills"]) || registry.version !== 1 || !Array.isArray(registry.skills)) {
    return { errors: ["project registry must contain only version 1 and skills"], skills };
  }
  if (registry.skills.length !== PROJECT_NAMES.size) errors.push("project registry requires exactly the approved project knowledge records");
  for (const record of registry.skills) {
    if (!exactKeys(record, ["name", "mapping", "description"])) {
      errors.push("project record has missing or unsupported fields; no executable/configuration metadata is allowed");
      continue;
    }
    const { name, mapping, description } = record;
    if (!PROJECT_NAMES.has(name)) { errors.push("project name is outside the approved allow-list"); continue; }
    if (skills.has(name) || engineering.has(name) || LANGUAGES.has(name)) errors.push(`${name}: duplicate skill name across registration records`);
    if (!["planned", "existing"].includes(mapping)) errors.push(`${name}: mapping must be planned or existing`);
    if (typeof description !== "string" || !description.trim() || description.length > 1024 || /[\r\n]/.test(description)) {
      errors.push(`${name}: invalid project Skill description metadata`);
    }
    try {
      const plugin = inside(root, "plugins/codejadee-chayen-framework");
      const dir = inside(plugin, `skills/${name}`), file = inside(plugin, `skills/${name}/SKILL.md`);
      if (mapping === "planned" && fs.existsSync(dir)) errors.push(`${name}: planned registration must not have a shipped directory`);
      if (mapping === "existing" && (!fs.existsSync(file) || !fs.statSync(file).isFile())) errors.push(`${name}: existing registration requires SKILL.md`);
    } catch { errors.push(`${name}: linked or unsafe project path`); }
    skills.set(name, record);
  }
  for (const name of PROJECT_NAMES) if (!skills.has(name)) errors.push(`${name}: unregistered project Skill`);
  for (const capability of Array.isArray(engineeringCatalog?.capabilities) ? engineeringCatalog.capabilities : []) {
    if ([capability?.entry_skill?.name, ...(Array.isArray(capability?.secondary_skills) ? capability.secondary_skills : [])].some(n => PROJECT_NAMES.has(n))) {
      errors.push("Engineering Catalog isolation: project Skills cannot own or substitute engineering capability mappings");
    }
  }
  return { errors, skills };
}

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
    if (record.name.startsWith("chayen-humanizer-")) errors.push("Engineering Catalog isolation: editorial names cannot be engineering Entry Skills");
  }
  if (!exactKeys(registry, ["version", "skills"]) || registry.version !== 1 || !Array.isArray(registry.skills)) {
    return { errors: [...errors, "editorial registry must contain only version 1 and skills"], skills, engineering };
  }
  if (registry.skills.length !== 2) errors.push("editorial registry requires exactly the two approved Humanizer records");
  for (const record of registry.skills) {
    if (!exactKeys(record, ["name", "language", "mapping", "description"])) {
      errors.push("editorial record has missing or unsupported fields; no executable/configuration metadata is allowed");
      continue;
    }
    const { name, language, mapping, description } = record;
    if (!LANGUAGES.has(name)) { errors.push("editorial name is outside the approved two-name allow-list"); continue; }
    if (skills.has(name) || engineering.has(name)) errors.push(`${name}: duplicate skill name across registration records`);
    if (language !== LANGUAGES.get(name)) errors.push(`${name}: invalid Humanizer language metadata`);
    if (!["planned", "existing"].includes(mapping)) errors.push(`${name}: mapping must be planned or existing`);
    if (typeof description !== "string" || !description.trim() || description.length > 1024 || /[\r\n]/.test(description)) {
      errors.push(`${name}: invalid Humanizer description metadata`);
    }
    try {
      const plugin = inside(root, "plugins/codejadee-chayen-framework");
      const dir = inside(plugin, `skills/${name}`), file = inside(plugin, `skills/${name}/SKILL.md`);
      if (mapping === "planned" && fs.existsSync(dir)) errors.push(`${name}: planned registration must not have a shipped directory`);
      if (mapping === "existing" && (!fs.existsSync(file) || !fs.statSync(file).isFile())) errors.push(`${name}: existing registration requires SKILL.md`);
    } catch { errors.push(`${name}: linked or unsafe editorial path`); }
    skills.set(name, record);
  }
  for (const name of LANGUAGES.keys()) if (!skills.has(name)) errors.push(`${name}: unregistered Editorial Skill`);
  const projectCount = loadProjectRegistration(root, engineeringCatalog).skills.size;
  if (engineering.size + skills.size + projectCount > MAX_ENTRY_SKILLS) errors.push(`registered Entry Skill count exceeds ${MAX_ENTRY_SKILLS}`);
  for (const capability of Array.isArray(engineeringCatalog.capabilities) ? engineeringCatalog.capabilities : []) {
    if ([capability?.entry_skill?.name, ...(Array.isArray(capability?.secondary_skills) ? capability.secondary_skills : [])].some(n => LANGUAGES.has(n))) {
      errors.push("Engineering Catalog isolation: editorial Skills cannot own or substitute engineering capability mappings");
    }
  }
  return { errors, skills, engineering };
}
