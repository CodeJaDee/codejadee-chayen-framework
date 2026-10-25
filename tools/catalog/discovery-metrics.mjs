#!/usr/bin/env node
// Developer-only discovery metadata metrics (D-066, ADR-0013 §3-§4; evolution Step 05). Never shipped.
// Measures what a provider lists before any Skill loads (name + description of every Entry Skill) with no
// repository cap. Token figures are estimates (characters / 4), not a provider tokenizer. Provider capacity
// figures come from provider documentation (PROVIDER_SPEC_RESEARCH §6); nothing here is measured on a host.
// Deterministic: inputs are sorted by name and the report carries no timestamps or absolute paths.
//
// Usage: node tools/catalog/discovery-metrics.mjs [--root <repoRoot>] [--json]
import fs from "node:fs";
import path from "node:path";
import { inside } from "../validate/safe-paths.mjs";
import { loadEditorialRegistration, loadProjectRegistration } from "./skill-registration.mjs";

export const TOKEN_ESTIMATE = "characters / 4 (estimate, not a provider tokenizer)";
export const estimateTokens = (chars) => Math.round(chars / 4);
export const DESCRIPTION_MAX = 1024; // provider constraint P-02 (S24, S17)
export const OVERLAP_WARN = 0.25, OVERLAP_ERROR = 0.35; // distinctness quality thresholds (V-07b, DS-06)
// Documented listing behaviour per provider (PROVIDER_SPEC_RESEARCH §6). `characters` is set only where the
// documentation states a character figure; everything else is UNKNOWN until measured on a host.
export const PROVIDER_LISTING = [
  { provider: "Claude Code", source: "S7", characters: null, entryCap: 1536,
    documented: "listing budget is 1% of the context window; on overflow the descriptions of the least-used skills are dropped; each entry is capped at 1,536 characters" },
  { provider: "Codex", source: "S12", characters: 8000, entryCap: null,
    documented: "initial list is at most 2% of the context window, or 8,000 characters when the window is unknown; descriptions are shortened first and skills may be omitted" },
  { provider: "GitHub Copilot CLI and VS Code", source: "S17, S19 (U-06)", characters: null, entryCap: null,
    documented: "listing budget not stated" },
];

const STOP = new Set("a an and or the of for to in on with by from as is are be use when not such this that it its into than via code covers including".split(" "));
export const descriptionWords = (t) => new Set(t.toLowerCase().replace(/[^a-z0-9#+.\s-]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)));
export function descriptionOverlap(a, b) {
  const x = descriptionWords(a), y = descriptionWords(b);
  const inter = [...x].filter((w) => y.has(w)).length;
  return inter / (x.size + y.size - inter || 1);
}

// Linear-interpolation quantile over a sorted array (deterministic).
function quantile(sorted, q) {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q, lo = Math.floor(pos), hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}
const round = (n, d = 2) => Number(n.toFixed(d));

// entries: [{ name, description, category: engineering|editorial|project|..., state: shipped|planned }]
export function discoveryMetrics(entries) {
  const all = [...entries].sort((a, b) => a.name.localeCompare(b.name));
  const shipped = all.filter((e) => e.state === "shipped");
  const sum = (list) => list.reduce((n, e) => n + e.name.length + e.description.length, 0);
  const actualChars = sum(shipped), projectedChars = sum(all);
  const perSkill = all.map((e) => {
    const chars = e.name.length + e.description.length;
    return { name: e.name, category: e.category, state: e.state, nameChars: e.name.length, descriptionChars: e.description.length, chars, estTokens: estimateTokens(chars),
      shareOfActual: e.state === "shipped" && actualChars ? round(chars / actualChars, 4) : null };
  });
  // "Unusually expensive": above the Tukey upper fence (Q3 + 1.5 IQR) of this package's description lengths.
  // Relative to the package, advisory only, never a gate.
  const lengths = all.map((e) => e.description.length).sort((a, b) => a - b);
  const q1 = quantile(lengths, 0.25), q3 = quantile(lengths, 0.75), fence = q3 + 1.5 * (q3 - q1);
  const expensive = perSkill.filter((s) => s.descriptionChars > fence).map((s) => ({ name: s.name, descriptionChars: s.descriptionChars }));
  const pairs = [];
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) pairs.push({ a: all[i].name, b: all[j].name, overlap: round(descriptionOverlap(all[i].description, all[j].description), 3) });
  pairs.sort((x, y) => y.overlap - x.overlap || x.a.localeCompare(y.a) || x.b.localeCompare(y.b));
  const byCategory = {};
  for (const s of perSkill) { const c = (byCategory[s.category] ??= { shipped: 0, planned: 0, chars: 0 }); c[s.state] += 1; c.chars += s.chars; }
  const providers = PROVIDER_LISTING.map((p) => {
    const maxEntry = Math.max(0, ...shipped.map((e) => e.description.length));
    const entry = p.entryCap ? (maxEntry <= p.entryCap ? `largest description ${maxEntry} <= ${p.entryCap}-character entry cap` : `largest description ${maxEntry} > ${p.entryCap}-character entry cap: truncated`) : null;
    if (p.characters == null) return { ...p, status: "UNKNOWN", measurement: "NOT_MEASURED", entry,
      note: p.provider === "Claude Code" ? "budget depends on the host context window, which is not known here" : "no documented figure" };
    return { ...p, status: actualChars > p.characters ? "EXCEEDS_DOCUMENTED_FIGURE" : "WITHIN_DOCUMENTED_FIGURE", measurement: "NOT_MEASURED", entry,
      headroom: p.characters - actualChars,
      note: "documented fallback figure shared with every other installed skill; Chayen's share only" };
  });
  return {
    tokenEstimate: TOKEN_ESTIMATE,
    actual: { skills: shipped.length, chars: actualChars, estTokens: estimateTokens(actualChars) },
    projected: { skills: all.length, chars: projectedChars, estTokens: estimateTokens(projectedChars) },
    byCategory,
    perSkill,
    expensive: { rule: "description length above Q3 + 1.5 x IQR of this package (advisory)", q1: round(q1), q3: round(q3), fence: round(fence), descriptions: expensive },
    largestContributors: [...perSkill].filter((s) => s.state === "shipped").sort((a, b) => b.chars - a.chars || a.name.localeCompare(b.name)).slice(0, 3).map((s) => ({ name: s.name, chars: s.chars })),
    collisions: { warnAbove: OVERLAP_WARN, errorAbove: OVERLAP_ERROR, pairsAboveWarn: pairs.filter((p) => p.overlap > OVERLAP_WARN).length, pairsAboveError: pairs.filter((p) => p.overlap > OVERLAP_ERROR).length, closest: pairs.slice(0, 5) },
    providerLimitViolations: perSkill.filter((s) => s.descriptionChars > DESCRIPTION_MAX).map((s) => s.name),
    providers,
    evidenceLevel: "static measurement of package metadata; provider capacity and routing are NOT_MEASURED (evolution Step 18)",
  };
}

// Reads shipped Skills and planned registry records from a repository checkout.
export function readDiscoveryEntries(root) {
  const skillsDir = inside(root, "plugins/codejadee-chayen-framework/skills");
  const editorial = loadEditorialRegistration(root), project = loadProjectRegistration(root);
  const category = (name) => (editorial.skills.has(name) ? "editorial" : project.skills.has(name) ? "project" : "engineering");
  const entries = [];
  for (const name of fs.readdirSync(skillsDir).sort()) {
    const file = path.join(skillsDir, name, "SKILL.md");
    if (!fs.existsSync(file)) continue;
    const description = (/^description:\s*(.*)$/m.exec(fs.readFileSync(file, "utf8"))?.[1] ?? "").trim().replace(/^(["'])(.*)\1$/, "$2");
    entries.push({ name, description, category: category(name), state: "shipped" });
  }
  for (const [label, reg] of [["editorial", editorial], ["project", project]]) for (const r of reg.skills.values()) {
    if (r.mapping === "planned" && typeof r.description === "string") entries.push({ name: r.name, description: r.description, category: label, state: "planned" });
  }
  return entries;
}

export function formatReport(m) {
  const out = [
    `Discovery metadata (name + description, listed by providers before any Skill loads). No repository cap (D-066).`,
    `Actual: ${m.actual.skills} shipped skills, ${m.actual.chars} characters, ~${m.actual.estTokens} tokens (${m.tokenEstimate}).`,
    `Projected with planned registrations: ${m.projected.skills} skills, ${m.projected.chars} characters, ~${m.projected.estTokens} tokens.`,
    `By category: ${Object.entries(m.byCategory).sort().map(([k, v]) => `${k} ${v.shipped} shipped${v.planned ? ` + ${v.planned} planned` : ""} (${v.chars} chars)`).join("; ")}.`,
    "", "Per skill (characters = name + description; share of actual):",
    ...m.perSkill.map((s) => `  ${s.name.padEnd(28)} ${String(s.chars).padStart(5)}  ${`~${s.estTokens}`.padStart(5)} tok  ${s.shareOfActual == null ? "planned" : `${(s.shareOfActual * 100).toFixed(1)}%`}  ${s.category}`),
    "", `Unusually expensive descriptions (${m.expensive.rule}; fence ${m.expensive.fence}): ${m.expensive.descriptions.length ? m.expensive.descriptions.map((d) => `${d.name} ${d.descriptionChars}`).join(", ") : "none"}.`,
    `Routing collision risk (description word overlap; warn > ${m.collisions.warnAbove}, error > ${m.collisions.errorAbove}): ${m.collisions.pairsAboveWarn} pair(s) above warn, ${m.collisions.pairsAboveError} above error; closest ${m.collisions.closest.map((p) => `${p.a}/${p.b} ${p.overlap}`).join(", ")}.`,
    `Provider description limit (${DESCRIPTION_MAX} characters) violations: ${m.providerLimitViolations.length ? m.providerLimitViolations.join(", ") : "none"}.`,
    "", "Provider capacity diagnostics (from documentation; not measured on a host):",
    ...m.providers.map((p) => `  ${p.provider} (${p.source}): ${p.status}${p.characters ? ` (${m.actual.chars} of ${p.characters} characters, headroom ${p.headroom})` : ""}; ${p.note}${p.entry ? `; ${p.entry}` : ""}. Measurement: ${p.measurement}.`),
    "", `Context tax: every listed character is sent on every turn on hosts that list all installed skills (~${m.actual.estTokens} tokens per turn, estimate).`,
    `Evidence level: ${m.evidenceLevel}. A larger Skill inventory needs routing and context evaluation before production compatibility is claimed.`,
  ];
  return out.join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  const i = process.argv.indexOf("--root");
  const root = path.resolve(i > -1 ? process.argv[i + 1] : path.join(import.meta.dirname, "..", ".."));
  const m = discoveryMetrics(readDiscoveryEntries(root));
  console.log(process.argv.includes("--json") ? JSON.stringify(m, null, 2) : formatReport(m));
}
