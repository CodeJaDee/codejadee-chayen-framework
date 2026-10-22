#!/usr/bin/env node
// Developer-only failure reproduction records (evolution Step 11, D-068). Validates the failure cases in
// tests/failures/cases/ and replays their recorded transcripts offline through the Phase 5 transcript
// parser. It never calls a provider, opens a connection, starts a process or executes text taken from a
// case or a transcript: reproduction steps are prose for a human, and detectors are string checks.
// The only write is --redact, to a new file the developer names. Never shipped with the plugin.
//
// Usage:
//   node tools/evals/failure-cases.mjs [--json] [--root <repo>]        validate every case, replay offline
//   node tools/evals/failure-cases.mjs --case FC-0001 --score <transcript> --provider claude
//                                                                       score one redacted transcript
//   node tools/evals/failure-cases.mjs --redact <transcript> --fixture-root <dir> --out <new file>

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { inside, assertTreeNoLinks } from "../validate/safe-paths.mjs";
import { SECRET_PATTERNS } from "../validate/secret-patterns.mjs";
import { parseTranscript, scrub, PROVIDERS } from "../../tests/evaluation/phase5/phase5-lib.mjs";

export const SCHEMA = "chayen-failure-case/1";
export const FAILURES_DIR = "tests/failures";
const SKILLS = "plugins/codejadee-chayen-framework/skills";
export const CATEGORIES = {
  "wrong-skill-selected": "Wrong Skill selected",
  "relevant-skill-not-selected": "Relevant Skill not selected",
  "incorrect-requirement-interpretation": "Incorrect requirement interpretation",
  "missed-affected-file": "Missed affected file",
  "invented-schema-or-command": "Invented schema or command",
  "scope-expansion": "Scope expansion",
  "missing-verification": "Missing verification",
  "false-done-claim": "False DONE claim",
  "permission-or-policy-violation": "Permission or policy violation",
  "excessive-tool-repetition": "Excessive tool/search repetition",
};
export const OUTCOMES = ["REPRODUCED", "NOT_REPRODUCED", "FIXED_AND_VERIFIED", "NOT_RUN", "INCONCLUSIVE"];
const ROOT_CAUSE = ["not-investigated", "suspected", "confirmed"];
const ACTION_STATUS = ["proposed", "applied", "rejected"];
const KEYS = ["$schema", "id", "title", "origin", "dataClassification", "consent", "category", "request", "skill", "observedWith", "source", "expected", "observed", "reproduction", "evidence", "detector", "rootCause", "correctiveAction", "regressionTests", "verification"];
const ALLOWED_EXT = new Set([".json", ".jsonl", ".md", ".cs", ".ts", ".html", ".sql"]);
const MAX_TRANSCRIPT_BYTES = 64 * 1024;
const REGRESSION_FILES = new Set(["recipe-cases.json", "trigger-cases.json", "technology-cases.json", "workflow-cases.json"]);

// Privacy checks on any record or transcript text. Values are never echoed.
const LOCAL_PATH = [/(?<![A-Za-z0-9])[A-Za-z]:(?:\\\\|\\|\/)(?!\/)/, /(?:^|[\s"'`(=])\/(?:Users|home|tmp|var|private|root)\//, /(?:^|[\s"'`(=])~[\\/]/];
const EMAIL = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}\b/g;
const RESERVED_EMAIL = /@(?:[A-Za-z0-9-]+\.)*(?:example\.(?:com|org|net)|[A-Za-z0-9-]+\.(?:invalid|test|example))$/i;
const CREDENTIAL_URL = /\b[a-z][a-z0-9+.-]*:\/\/[^\s/@"']+:[^\s/@"']+@/i;
export function privacyFindings(text) {
  const t = String(text), found = [];
  for (const [rule, re] of SECRET_PATTERNS) if (re.test(t)) found.push(`secret pattern ${rule}`);
  if (LOCAL_PATH.some((re) => re.test(t))) found.push("unredacted local path");
  if ([...t.matchAll(EMAIL)].some((m) => !RESERVED_EMAIL.test(m[0]))) found.push("email address outside reserved example domains");
  if (CREDENTIAL_URL.test(t)) found.push("credential-bearing URL");
  return found;
}

// Best-effort redaction of a transcript before it is kept: fixture roots become <FIXTURE>, other absolute
// paths, secret patterns, credential URLs and non-example emails are masked, tool output bodies are
// removed and non-JSON lines dropped. Inspect the result before committing it.
export function redact(text, roots = []) {
  const variants = (r) => { const fwd = r.replace(/\\/g, "/"), win = r.replace(/\//g, "\\"); return [...new Set([win.replace(/\\/g, "\\\\"), win, fwd].flatMap((v) => [v, v[0].toLowerCase() + v.slice(1), v[0].toUpperCase() + v.slice(1)]))].sort((a, b) => b.length - a.length); };
  const strip = (v) => {
    if (Array.isArray(v)) return v.map(strip);
    if (!v || typeof v !== "object") return v;
    const o = {};
    for (const [k, x] of Object.entries(v)) {
      if (v.type === "tool_result" && k === "content") o[k] = "<tool output removed>";
      else if (k === "aggregated_output") o[k] = /denied|not permitted|sandbox/i.test(String(x)) ? "<tool output removed: denied>" : "<tool output removed>";
      else if (v.type === "tool.execution_complete" && k === "data") o[k] = { toolName: x?.toolName, success: x?.success };
      else o[k] = strip(x);
    }
    return o;
  };
  let dropped = 0;
  const lines = String(text).split(/\r?\n/).filter((l) => l.trim()).flatMap((l) => {
    try { return [JSON.stringify(strip(JSON.parse(l)))]; } catch { dropped++; return []; }
  });
  let t = lines.join("\n");
  for (const r of roots) for (const v of variants(path.resolve(r))) t = t.split(v).join("<FIXTURE>");
  t = scrub(t);
  for (const [rule, re] of SECRET_PATTERNS) t = t.replace(new RegExp(re.source, "g"), `<REDACTED:${rule}>`);
  t = t.replace(new RegExp(CREDENTIAL_URL.source, "gi"), "<REDACTED:credential-url>");
  t = t.replace(EMAIL, (m) => (RESERVED_EMAIL.test(m) ? m : "<REDACTED:email>"));
  return { text: t + "\n", dropped };
}

// Declarative detector signals over the parsed transcript. Matching is literal and case-sensitive;
// path separators are normalised to "/".
const norm = (s) => String(s ?? "").replace(/\\+/g, "/");
const anyIn = (hay, values) => values.some((v) => norm(hay).includes(norm(v)));
const actionText = (a) => `${a.tool ?? ""} ${a.target ?? ""} ${a.command ?? ""}`;
export const SIGNALS = {
  "answer-includes-any": (p, s) => anyIn(p.answer, s.values),
  "answer-includes-none": (p, s) => !anyIn(p.answer, s.values),
  "action-includes-any": (p, s) => p.actions.some((a) => anyIn(actionText(a), s.values)),
  "action-includes-none": (p, s) => !p.actions.some((a) => anyIn(actionText(a), s.values)),
  "skill-loaded-any": (p, s) => p.skills.some((x) => s.values.includes(x)),
  "skill-loaded-none": (p, s) => !p.skills.some((x) => s.values.includes(x)),
  "denied-action": (p) => p.actions.some((a) => a.denied),
  "repeated-action-at-least": (p, s) => Math.max(0, ...Object.values(p.actions.reduce((m, a) => ({ ...m, [actionText(a)]: (m[actionText(a)] ?? 0) + 1 }), {}))) >= s.count,
};
function signalErrors(s) {
  if (!s || !SIGNALS[s.signal]) return [`unknown detector signal ${JSON.stringify(s?.signal)}`];
  if (s.signal === "denied-action") return Object.keys(s).length === 1 ? [] : ["denied-action takes no parameters"];
  if (s.signal === "repeated-action-at-least") return Number.isInteger(s.count) && s.count >= 2 && Object.keys(s).length === 2 ? [] : ["repeated-action-at-least needs only an integer count >= 2"];
  return Array.isArray(s.values) && s.values.length && s.values.every((v) => typeof v === "string" && v.length) && Object.keys(s).length === 2 ? [] : [`${s.signal} needs only a non-empty values list of strings`];
}

// Replay one transcript against a case detector. A run that did not finish is INCONCLUSIVE, never a pass.
export function replayTranscript(detector, provider, text) {
  let parsed;
  try { parsed = parseTranscript(provider, text); } catch { return { outcome: "INCONCLUSIVE", why: "transcript could not be parsed" }; }
  if (!parsed.completion) return { outcome: "INCONCLUSIVE", why: "no result event (cut off or incomplete run)" };
  if (parsed.error || /^error/.test(parsed.completion)) return { outcome: "INCONCLUSIVE", why: "the run ended with an error or a turn limit" };
  if (!parsed.answer.trim() && detector.allOf.some((s) => s.signal.startsWith("answer-"))) return { outcome: "INCONCLUSIVE", why: "no final answer to check" };
  const signals = detector.allOf.map((s) => ({ signal: s.signal, holds: SIGNALS[s.signal](parsed, s) }));
  const reproduced = signals.every((s) => s.holds);
  return { outcome: reproduced ? "REPRODUCED" : "NOT_REPRODUCED", why: reproduced ? "every detector signal holds" : `not holding: ${signals.filter((s) => !s.holds).map((s) => s.signal).join(", ")}`, signals, skills: parsed.skills };
}

// Model-behaviour status from recorded live replays only. Offline detector replay and changed guidance
// text never count: FIXED_AND_VERIFIED needs an authorized live run on a later revision that does not
// reproduce the failure, an applied corrective action and a regression reference.
export function deriveStatus(c, runOutcomes) {
  if (!runOutcomes.length) return "NOT_RUN";
  const last = runOutcomes.at(-1);
  if (last.outcome !== "NOT_REPRODUCED") return last.outcome;
  const laterRevision = last.run.revision && last.run.revision !== c.source?.revision;
  const laterPackage = last.run.packageFingerprint && last.run.packageFingerprint !== c.source?.packageFingerprint;
  return c.correctiveAction?.status === "applied" && (laterRevision || laterPackage) && c.regressionTests?.length ? "FIXED_AND_VERIFIED" : "NOT_REPRODUCED";
}

const isText = (v) => typeof v === "string" && v.trim().length > 0;
const hex = (v, min, max) => typeof v === "string" && new RegExp(`^[0-9a-f]{${min},${max}}$`).test(v);
const sha256 = (t) => crypto.createHash("sha256").update(t).digest("hex");

function readTranscript(root, rel, synthetic, provider, err) {
  if (typeof rel !== "string" || !rel.startsWith(`${FAILURES_DIR}/transcripts/`) || !rel.endsWith(".jsonl")) { err(`transcript ${JSON.stringify(rel)} must be a .jsonl file under ${FAILURES_DIR}/transcripts/`); return null; }
  let text;
  try { text = fs.readFileSync(inside(root, rel), "utf8"); } catch { err(`transcript ${rel} is missing or unsafe`); return null; }
  if (Buffer.byteLength(text) > MAX_TRANSCRIPT_BYTES) err(`transcript ${rel} exceeds ${MAX_TRANSCRIPT_BYTES} bytes; keep only the failing turn`);
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const parsed = lines.map((l) => { try { return JSON.parse(l); } catch { return undefined; } });
  if (parsed.some((x) => x === undefined)) err(`transcript ${rel} has non-JSON lines`);
  if (!PROVIDERS.includes(provider)) err(`transcript ${rel} provider must be one of ${PROVIDERS}`);
  const marked = parsed[0]?.type === "synthetic";
  if (synthetic && !marked) err(`synthetic transcript ${rel} must start with a {"type":"synthetic"} marker line`);
  if (!synthetic && marked) err(`transcript ${rel} is marked synthetic but recorded as a provider run`);
  for (const f of privacyFindings(text)) err(`transcript ${rel}: ${f}; redact it (--redact) before keeping it`);
  return text;
}

export function validateCase(root, c, file, regressionIds) {
  const errors = [], err = (m) => errors.push(m);
  const replays = [], runOutcomes = [];
  if (!c || typeof c !== "object" || Array.isArray(c)) return { errors: ["record is not a JSON object"], replays, status: null };
  for (const k of Object.keys(c)) if (!KEYS.includes(k)) err(`unknown field ${JSON.stringify(k)}; the record format is closed`);
  for (const k of KEYS) if (!(k in c)) err(`missing field ${k}`);
  if (c.$schema !== SCHEMA) err(`$schema must be ${SCHEMA}`);
  if (!/^FC-\d{4}$/.test(c.id ?? "") || !path.basename(file).startsWith(`${c.id}-`)) err("id must be FC-NNNN and the file name must start with it");
  if (!isText(c.title)) err("title is required");
  const synthetic = c.origin === "synthetic";
  if (!["synthetic", "observed"].includes(c.origin)) err("origin must be synthetic or observed");
  if (c.dataClassification !== (synthetic ? "synthetic" : "redacted")) err(`dataClassification must be ${synthetic ? "synthetic" : "redacted"} for origin ${c.origin}`);
  if (synthetic && c.consent !== null) err("a synthetic case has consent null");
  if (c.origin === "observed" && !(c.consent?.optIn === true && isText(c.consent?.reference) && c.consent?.redactionReviewed === true)) err("an observed case needs consent { optIn: true, reference, redactionReviewed: true }");
  if (!CATEGORIES[c.category]) err(`category must be one of ${Object.keys(CATEGORIES).join(", ")}`);
  if (!(c.request?.redacted === true && isText(c.request?.text))) err("request needs text and redacted: true");
  const skillDir = `${SKILLS}/${c.skill?.name}`;
  if (!/^[a-z0-9-]+$/.test(c.skill?.name ?? "") || !fs.existsSync(inside(root, `${skillDir}/SKILL.md`))) err("skill.name must be an Entry Skill in the plugin");
  else if (typeof c.skill?.recipe !== "string" || !c.skill.recipe.startsWith("references/") || !fs.existsSync(inside(root, `${skillDir}/${c.skill.recipe}`))) err("skill.recipe must be an existing references/ file of that Skill");
  const ow = c.observedWith ?? {};
  if (synthetic && (ow.provider !== null || ow.model !== null)) err("a synthetic case records provider and model as null: nothing was observed");
  if (c.origin === "observed" && !PROVIDERS.includes(ow.provider)) err(`observedWith.provider must be one of ${PROVIDERS}`);
  if (c.origin === "observed" && ow.model !== null && !isText(ow.model)) err("observedWith.model is the observed model id or null when the host did not report it");
  if (!hex(c.source?.revision, 7, 40) && !hex(c.source?.packageFingerprint, 16, 64)) err("source needs a git revision or a package fingerprint");
  for (const k of ["expected", "observed"]) if (!isText(c[k])) err(`${k} behaviour is required`);
  const rep = c.reproduction ?? {};
  if (!Array.isArray(rep.steps) || !rep.steps.length || !rep.steps.every(isText)) err("reproduction.steps must be non-empty prose steps");
  if (typeof rep.fixture !== "string" || !rep.fixture.startsWith("tests/")) err("reproduction.fixture must be a repository fixture under tests/");
  else {
    let fixtureRoot = null;
    try { fixtureRoot = inside(root, rep.fixture); if (!fs.statSync(fixtureRoot).isDirectory()) throw new Error(); } catch { err(`reproduction.fixture ${rep.fixture} is missing or unsafe`); fixtureRoot = null; }
    if (!Array.isArray(rep.facts) || !rep.facts.length) err("reproduction.facts must state at least one checkable fixture fact");
    else if (fixtureRoot) for (const f of rep.facts) {
      let target; try { target = inside(fixtureRoot, f.file); } catch { err(`fact file ${JSON.stringify(f.file)} is unsafe`); continue; }
      const exists = fs.existsSync(target), text = exists ? fs.readFileSync(target, "utf8") : "";
      if ("exists" in f && f.exists !== exists) err(`fact does not hold: ${f.file} ${f.exists ? "exists" : "is absent"}`);
      if ("contains" in f && !(exists && text.includes(f.contains))) err(`fact does not hold: ${f.file} contains ${JSON.stringify(f.contains)}`);
      if ("absent" in f && (!exists || text.includes(f.absent))) err(`fact does not hold: ${f.file} lacks ${JSON.stringify(f.absent)}`);
      if (!["exists", "contains", "absent"].some((k) => k in f)) err(`fact for ${f.file} states nothing`);
    }
  }
  const det = c.detector;
  const detOk = det && Array.isArray(det.allOf) && det.allOf.length && Object.keys(det).length === 1;
  if (!detOk) err("detector must be { allOf: [signals] }");
  else for (const s of det.allOf) for (const m of signalErrors(s)) err(`detector: ${m}`);
  const transcripts = c.evidence?.transcripts;
  if (!Array.isArray(transcripts) || !transcripts.some((t) => t.role === "failing") || !transcripts.some((t) => t.role === "control")) err("evidence.transcripts needs at least one failing and one control transcript");
  for (const t of transcripts ?? []) {
    if (!["failing", "control"].includes(t.role)) err(`transcript role must be failing or control`);
    if (t.expected !== (t.role === "failing" ? "REPRODUCED" : "NOT_REPRODUCED")) err(`a ${t.role} transcript expects ${t.role === "failing" ? "REPRODUCED" : "NOT_REPRODUCED"}`);
    if (t.synthetic !== synthetic) err(`transcript ${t.file}: synthetic must match the case origin`);
    const text = readTranscript(root, t.file, t.synthetic === true, t.provider, err);
    if (text === null || !detOk || errors.some((e) => e.startsWith("detector:"))) continue;
    const r = replayTranscript(det, t.provider, text);
    replays.push({ file: t.file, provider: t.provider, role: t.role, expected: t.expected, ...r });
    if (r.outcome !== t.expected) err(`detector does not discriminate: ${t.file} replays as ${r.outcome}, expected ${t.expected} (${r.why})`);
  }
  if (!ROOT_CAUSE.includes(c.rootCause?.status) || !isText(c.rootCause?.summary)) err(`rootCause needs status (${ROOT_CAUSE.join(", ")}) and summary`);
  const ca = c.correctiveAction ?? {};
  if (!ACTION_STATUS.includes(ca.status) || !isText(ca.summary) || !Array.isArray(ca.targets) || !ca.targets.length) err(`correctiveAction needs status (${ACTION_STATUS.join(", ")}), summary and targets`);
  else for (const t of ca.targets) { try { if (!fs.existsSync(inside(root, t))) throw new Error(); } catch { err(`correctiveAction target ${JSON.stringify(t)} does not exist`); } }
  if (!Array.isArray(c.regressionTests) || !c.regressionTests.length) err("regressionTests must reference at least one case");
  for (const ref of c.regressionTests ?? []) {
    const m = /^tests\/skills\/([a-z-]+\.json)#(.+)$/.exec(ref ?? "");
    if (!m || !REGRESSION_FILES.has(m[1])) err(`regression reference ${JSON.stringify(ref)} must be tests/skills/<cases file>#<case id>`);
    else if (!regressionIds(m[1]).has(m[2])) err(`regression reference ${ref} names no existing case`);
  }
  const v = c.verification ?? {};
  if (!OUTCOMES.includes(v.status)) err(`verification.status must be one of ${OUTCOMES.join(", ")}`);
  if (!Array.isArray(v.runs)) err("verification.runs must be a list (empty until an authorized live replay)");
  for (const run of v.runs ?? []) {
    if (run.kind !== "live-replay") { err(`verification run kind ${JSON.stringify(run.kind)} does not count: only an authorized live replay verifies behaviour, never a guidance change or a validator pass`); continue; }
    if (!isText(run.authorization)) err("a live replay needs the authorization reference under which it was run");
    if (!isText(run.date) || !/^\d{4}-\d{2}-\d{2}$/.test(run.date)) err("a live replay needs a date (YYYY-MM-DD)");
    if (!hex(run.revision, 7, 40) && !hex(run.packageFingerprint, 16, 64)) err("a live replay needs the tested revision or package fingerprint");
    const text = readTranscript(root, run.transcript, false, run.provider, err);
    if (text === null) continue;
    if (run.sha256 !== sha256(text)) err(`live replay transcript ${run.transcript} does not match its recorded sha256`);
    if (detOk) runOutcomes.push({ run, ...replayTranscript(det, run.provider, text) });
  }
  const status = deriveStatus(c, runOutcomes);
  if (OUTCOMES.includes(v.status) && v.status !== status) err(`verification.status ${v.status} is not supported by the evidence (derived ${status}); a guidance change alone never verifies a fix`);
  for (const f of privacyFindings(JSON.stringify(c))) err(`record: ${f}`);
  return { errors, replays, status, runs: runOutcomes.map((r) => ({ transcript: r.run.transcript, outcome: r.outcome })) };
}

export function validateAll(root) {
  const errors = [], cases = [];
  assertTreeNoLinks(inside(root, FAILURES_DIR));
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  const artifacts = ["cases", "transcripts", "fixtures"].map((d) => inside(root, `${FAILURES_DIR}/${d}`)).filter((d) => fs.existsSync(d));
  for (const f of artifacts.flatMap(walk)) {
    const rel = path.relative(root, f).split(path.sep).join("/");
    if (!ALLOWED_EXT.has(path.extname(f).toLowerCase())) errors.push(`${rel}: file type not allowed here; scripts and binaries are never kept as failure artifacts`);
    else for (const finding of privacyFindings(fs.readFileSync(f, "utf8"))) errors.push(`${rel}: ${finding}`);
  }
  const cache = new Map();
  const regressionIds = (name) => {
    if (!cache.has(name)) { let ids = new Set(); try { ids = new Set(JSON.parse(fs.readFileSync(inside(root, `tests/skills/${name}`), "utf8")).cases.map((x) => x.id)); } catch { /* reported as a missing case */ } cache.set(name, ids); }
    return cache.get(name);
  };
  const dir = inside(root, `${FAILURES_DIR}/cases`), seen = new Set();
  for (const name of fs.readdirSync(dir).filter((n) => n.endsWith(".json")).sort()) {
    const file = `${FAILURES_DIR}/cases/${name}`;
    let c;
    try { c = JSON.parse(fs.readFileSync(inside(root, file), "utf8")); } catch { errors.push(`${file}: not valid JSON`); continue; }
    if (seen.has(c.id)) errors.push(`${file}: duplicate id ${c.id}`);
    seen.add(c.id);
    const r = validateCase(root, c, file, regressionIds);
    errors.push(...r.errors.map((e) => `${file}: ${e}`));
    cases.push({ id: c.id, file, category: c.category, origin: c.origin, valid: !r.errors.length, replays: r.replays, runs: r.runs, modelBehaviour: r.status });
  }
  if (!cases.length) errors.push(`${FAILURES_DIR}/cases: no failure cases`);
  return { errors, cases };
}

const argv = process.argv.slice(2);
const arg = (name) => { const i = argv.indexOf(name); return i > -1 ? argv[i + 1] : undefined; };
function main() {
  const root = fs.realpathSync(arg("--root") ?? path.resolve(import.meta.dirname, "../.."));
  if (arg("--redact")) {
    const out = arg("--out"), fixtureRoot = arg("--fixture-root");
    if (!out || !fixtureRoot) throw new Error("--redact needs --fixture-root <dir> and --out <new file>");
    const target = path.resolve(out);
    if (fs.existsSync(target)) throw new Error("--out already exists; choose a new file");
    if (target.startsWith(path.join(root, ...SKILLS.split("/").slice(0, 2)) + path.sep)) throw new Error("--out must stay outside the distributed plugin");
    const { text, dropped } = redact(fs.readFileSync(path.resolve(arg("--redact")), "utf8"), [fixtureRoot]);
    fs.writeFileSync(target, text, { flag: "wx" });
    const left = privacyFindings(text);
    console.log(`Wrote redacted transcript (${dropped} non-JSON line(s) dropped). ${left.length ? `Still flagged: ${left.join("; ")}.` : "No privacy pattern left."} Read it in full before keeping it; redaction is heuristic.`);
    return 0;
  }
  if (arg("--score")) {
    const id = arg("--case"), provider = arg("--provider");
    const file = fs.readdirSync(inside(root, `${FAILURES_DIR}/cases`)).find((n) => id && n.startsWith(`${id}-`));
    if (!file || !PROVIDERS.includes(provider)) throw new Error(`--score needs --case <FC-NNNN> and --provider ${PROVIDERS.join("|")}`);
    const c = JSON.parse(fs.readFileSync(inside(root, `${FAILURES_DIR}/cases/${file}`), "utf8"));
    const text = fs.readFileSync(path.resolve(arg("--score")), "utf8");
    const findings = privacyFindings(text);
    if (findings.length) { console.log(`REFUSED: ${findings.join("; ")}. Redact the transcript with --redact first.`); return 1; }
    const r = replayTranscript(c.detector, provider, text);
    console.log(`${c.id} ${r.outcome}: ${r.why}`);
    console.log("Offline score of a transcript you supplied. It verifies nothing by itself: record it under verification.runs only with the authorization reference of the run that produced it.");
    return 0;
  }
  const { errors, cases } = validateAll(root);
  if (argv.includes("--json")) console.log(JSON.stringify({ errors, cases }, null, 2));
  else {
    for (const c of cases) {
      console.log(`${c.id} ${c.category} (${c.origin}): record ${c.valid ? "VALID" : "INVALID"}`);
      for (const r of c.replays) console.log(`  offline replay ${path.basename(r.file)} [${r.role}, ${r.provider}]: ${r.outcome} (expected ${r.expected})`);
      console.log(`  model behaviour: ${c.modelBehaviour}${c.modelBehaviour === "NOT_RUN" ? " (no authorized live replay recorded)" : ""}`);
    }
    for (const e of errors) console.log(`ERROR ${e}`);
    const replays = cases.flatMap((c) => c.replays);
    const status = OUTCOMES.map((o) => `${o} ${cases.filter((c) => c.modelBehaviour === o).length}`).join(", ");
    console.log(`${errors.length ? "FAIL" : "PASS"} failure cases: ${cases.filter((c) => c.valid).length}/${cases.length} records valid; ${replays.filter((r) => r.outcome === r.expected).length}/${replays.length} recorded transcripts replay as expected; model behaviour: ${status}`);
  }
  return errors.length ? 1 : 0;
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  try { process.exitCode = main(); } catch (e) { console.log(`ERROR ${e.message}`); process.exitCode = 2; }
}
