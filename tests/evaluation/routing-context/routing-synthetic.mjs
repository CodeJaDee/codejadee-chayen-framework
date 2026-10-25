// Developer-only synthetic transcripts for the Step 18 routing scorer (D-075). Each transcript uses the
// native event shapes the Phase 5 parsers read (Claude stream-json, Codex exec --json, Copilot -p json), so
// the self-test exercises the same activation rules a real run would. Synthetic transcripts are controls,
// never routing evidence: every record built from them is labelled SIMULATED.

import { loadCases, routingRecord, summarizeConfiguration } from "./routing-context-lib.mjs";

const INSTALLED = { claude: "/home/eval/.claude/plugins/cache/codejadee/chayen/1.1.2", codex: "/home/eval/.codex/plugins/cache/chayen", copilot: "/home/eval/.copilot/installed-plugins/chayen" };
export const FIXTURE_ROOT = "/work/fixture";
const line = (e) => JSON.stringify(e);

// behaviour: { skills, refs: [[skill, file]], reads, grepFirst, answer, usage, model, crash, fixtureSkillRead }
export function fakeTranscript(provider, b = {}) {
  const { skills = [], refs = [], reads = 0, grepFirst = false, answer = "Done.", usage = null, model = `fake-${provider}-model`, crash = false, fixtureSkillRead = null } = b;
  const ref = ([s, f]) => `${INSTALLED[provider]}/skills/${s}/references/${f}`;
  const out = [];
  if (provider === "claude") {
    const tool = (name, input) => out.push(line({ type: "assistant", message: { content: [{ type: "tool_use", name, input }] } }));
    out.push(line({ type: "system", subtype: "init", model, skills: skills.map((s) => `chayen:${s}`) }));
    if (grepFirst) tool("Grep", { pattern: "total" });
    for (const s of skills) tool("Skill", { skill: `chayen:${s}` });
    for (const r of refs) tool("Read", { file_path: ref(r) });
    for (let i = 0; i < reads; i++) tool(i % 2 ? "Glob" : "Grep", { pattern: `src/**/file${i}` });
    if (!crash) out.push(line({ type: "result", subtype: "success", result: answer, total_cost_usd: 0, ...(usage ? { usage } : {}) }));
  } else if (provider === "codex") {
    const cmd = (command) => out.push(line({ type: "item.started", item: { type: "command_execution", command } }));
    out.push(line({ type: "thread.started", model }));
    if (grepFirst) cmd("rg -n total src");
    if (fixtureSkillRead) cmd(`cat ${FIXTURE_ROOT}/skills/${fixtureSkillRead}/SKILL.md`);
    for (const s of skills) cmd(`cat ${INSTALLED.codex}/skills/${s}/SKILL.md`);
    for (const r of refs) cmd(`cat ${ref(r)}`);
    for (let i = 0; i < reads; i++) cmd(`rg -n file${i} src`);
    out.push(line({ type: "item.completed", item: { type: "agent_message", text: answer } }));
    if (!crash) out.push(line({ type: "turn.completed", ...(usage ? { usage } : {}) }));
  } else if (provider === "copilot") {
    const tool = (toolName, args) => out.push(line({ type: "tool.execution_start", data: { toolName, arguments: args } }));
    if (grepFirst) tool("grep", { pattern: "total" });
    for (const s of skills) tool("skill", { skill: s });
    for (const r of refs) tool("view", { path: ref(r) });
    for (let i = 0; i < reads; i++) tool("view", { path: `src/file${i}.ts` });
    out.push(line({ type: "assistant.message", data: { content: answer, model } }));
    if (!crash) out.push(line({ type: "result" }));
  } else throw new Error(`Unknown provider ${provider}`);
  return out.join("\n");
}

const META = { cliVersion: "fake-1.0", packageFingerprint: "fake-package", metadataFingerprint: "fake-metadata", specHash: "fake-spec", candidateId: "fake-candidate" };
export function fakeRecord(c, provider, behaviour, { arm = "plugin", scenario = "SC3-overlap", run = 1, attempt = 1, seconds = 30, meta = {} } = {}) {
  const m = { ...META, ...meta, ...(arm === "baseline" ? { packageFingerprint: null } : {}) };
  return routingRecord({ c, provider, arm, scenario, run, attempt, seconds, stdout: fakeTranscript(provider, behaviour), meta: m, simulated: true, fixtureRoot: FIXTURE_ROOT });
}

// Known-good and known-bad runs with the classification each must receive.
export const SELF_TEST = [
  ["claude: expected Skill event", "rc-pos-game-mods-k", "claude", { skills: ["chayen-syn-game-mods"] }, { classification: "CORRECT", pass: true }],
  ["claude: answer names the Skill, no event (not activation)", "rc-pos-game-mods-k", "claude", { answer: "Use chayen-syn-game-mods for this." }, { classification: "MISSED", pass: false }],
  ["codex: installed SKILL.md read of a name with digits", "rc-adj-k6", "codex", { skills: ["chayen-syn-k6-scripts"] }, { classification: "CORRECT", pass: true }],
  ["codex: SKILL.md read inside the repository fixture (not activation)", "rc-adj-k6", "codex", { fixtureSkillRead: "chayen-syn-k6-scripts" }, { classification: "MISSED", pass: false }],
  ["copilot: only the allowed neighbour loaded", "rc-adj-graphql", "copilot", { skills: ["chayen-backend"] }, { classification: "NEIGHBOUR_ONLY", pass: false }],
  ["claude: two unrelated Skills (wrong, multiple unexpected)", "rc-pos-latex-k", "claude", { skills: ["chayen-documentation", "chayen-humanizer-en"] }, { classification: "WRONG_SKILL", pass: false, multipleUnexpected: true }],
  ["claude: expected plus one unexpected", "rc-pos-gis-k", "claude", { skills: ["chayen-syn-gis", "chayen-data"] }, { classification: "CORRECT_PLUS_UNEXPECTED", pass: false, multipleUnexpected: false }],
  ["claude: forbidden adjacent Skill", "rc-adj-helm-reverse", "claude", { skills: ["chayen-syn-helm"] }, { classification: "WRONG_SKILL", pass: false, forbidden: ["chayen-syn-helm"] }],
  ["claude: no-match with no Skill", "rc-nm-weather", "claude", {}, { classification: "CORRECT_NONE", pass: true }],
  ["codex: unsupported framework activates a Skill", "rc-uns-nitro", "codex", { skills: ["chayen-backend"] }, { classification: "FALSE_ACTIVATION", pass: false }],
  ["claude: negative boundary with an allowed owner", "rc-neg-terraform", "claude", { skills: ["chayen-devops"] }, { classification: "ALLOWED_OPTIONAL", pass: true }],
  ["copilot: explicit invocation with a native event", "rc-exp-a11y", "copilot", { skills: ["chayen-syn-a11y-audit"] }, { classification: "EXPLICIT_LOADED", pass: true }],
  ["copilot: explicit invocation named only in the answer", "rc-exp-a11y", "copilot", { answer: "chayen-syn-a11y-audit audit done" }, { classification: "EXPLICIT_NOT_LOADED", pass: false }],
  ["claude: ambiguous request inspected first", "rc-amb-tiles", "claude", { grepFirst: true, skills: ["chayen-syn-gis"] }, { classification: "INSPECT_FIRST_OK", pass: true }],
  ["claude: ambiguous request, Skill chosen before inspection", "rc-amb-tiles", "claude", { skills: ["chayen-syn-gis"] }, { classification: "INSPECT_FIRST_FAIL", pass: false }],
  ["claude: no result event (infrastructure error, kept)", "rc-pos-ros-k", "claude", { skills: ["chayen-syn-ros"], crash: true }, { classification: "ERROR_NO_RESULT", pass: false }],
  ["codex: semantic conflict records the chosen Skill", "rc-cnf-semantic-unit", "codex", { skills: ["chayen-syn-test-authoring"] }, { classification: "CORRECT", pass: true, chosen: ["chayen-syn-test-authoring"] }],
];

export function selfTest(cases = loadCases()) {
  const byId = Object.fromEntries(cases.cases.map((c) => [c.id, c]));
  const results = SELF_TEST.map(([label, id, provider, behaviour, want]) => {
    const r = fakeRecord(byId[id], provider, behaviour, { scenario: id.startsWith("rc-cnf-semantic") ? "SC4-semantic-conflict" : "SC3-overlap" });
    const diffs = Object.entries(want).filter(([k, v]) => JSON.stringify(r[k]) !== JSON.stringify(v)).map(([k, v]) => `${k}: expected ${JSON.stringify(v)}, got ${JSON.stringify(r[k])}`);
    return { label, pass: !diffs.length, diffs, evidenceLevel: r.evidenceLevel };
  });
  // Summary rules: simulated data never yields a claim; providers and models are never pooled.
  const c = byId["rc-pos-vba-k"];
  const recs = [1, 2, 3].map((run) => fakeRecord(c, "claude", { skills: ["chayen-syn-vba"] }, { run }));
  const summary = summarizeConfiguration(recs, cases);
  const checks = [
    ["simulated summary makes no claim", summary.evidenceLevel === "SIMULATED" && /^NOT_MEASURED/.test(summary.claims) && summary.automaticRoutingAccuracy.meetsObjective === null],
    ["two providers are not pooled", throws(() => summarizeConfiguration([...recs, fakeRecord(c, "codex", { skills: ["chayen-syn-vba"] })], cases))],
    ["two models are not pooled", throws(() => summarizeConfiguration([...recs, fakeRecord(c, "claude", { skills: ["chayen-syn-vba"], model: "other-model" }, { run: 4 })], cases))],
    ["two scenarios are not pooled", throws(() => summarizeConfiguration([...recs, fakeRecord(c, "claude", { skills: ["chayen-syn-vba"] }, { run: 4, scenario: "SC1-distinct" })], cases))],
  ].map(([label, ok]) => ({ label, pass: ok, diffs: ok ? [] : ["rule not enforced"], evidenceLevel: "SIMULATED" }));
  return [...results, ...checks];
}
function throws(f) { try { f(); return false; } catch { return true; } }
