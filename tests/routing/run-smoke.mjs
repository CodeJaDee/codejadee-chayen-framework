#!/usr/bin/env node
// Developer-only routing smoke runner for providers that have no eval tool
// (GitHub Copilot CLI, OpenAI Codex CLI). Sends each smoke prompt in a fresh,
// non-interactive session, extracts which chayen-* skills were loaded from the
// provider's JSON event stream, and compares against expectations.
//
// Usage:
//   node tests/routing/run-smoke.mjs --provider copilot|codex --workdir <empty dir> --out <results dir>
//        [--phase enabled|disabled] [--only id1,id2] [-- <extra provider args...>]
//
// Isolation, authentication and plugin install state are the caller's
// responsibility (COPILOT_HOME / CODEX_HOME etc.) - see tests/provider-compatibility/.
// Every run is a billed model call. Never shipped with the plugin. Zero dependencies.

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const arg = (name, def) => { const i = process.argv.indexOf(name); return i > -1 ? process.argv[i + 1] : def; };
const provider = arg("--provider");
const workdir = path.resolve(arg("--workdir", "."));
const outDir = path.resolve(arg("--out", "routing-results"));
const phase = arg("--phase", "enabled");
const only = arg("--only")?.split(",");
const extra = process.argv.includes("--") ? process.argv.slice(process.argv.indexOf("--") + 1) : [];
if (!["copilot", "codex"].includes(provider)) { console.error("--provider copilot|codex required"); process.exit(2); }

const here = import.meta.dirname;
const triggers = JSON.parse(fs.readFileSync(path.join(here, "..", "skills", "trigger-cases.json"), "utf8"));
const smoke = JSON.parse(fs.readFileSync(path.join(here, "smoke-cases.json"), "utf8"));
const byId = Object.fromEntries(triggers.cases.map((c) => [c.id, c]));

const cases = smoke.cases
  .map((s) => {
    const base = byId[s.from ?? s.id] ?? {};
    return {
      id: s.id,
      category: s.category ?? base.category,
      prompt: s.promptByProvider?.[provider] ?? base.prompt,
      expect: s.expect ?? base.expect,
      forbid: s.forbid ?? base.forbid ?? [],
      requiresDisabled: !!s.requiresDisabled,
    };
  })
  .filter((c) => (phase === "disabled") === c.requiresDisabled)
  .filter((c) => !only || only.includes(c.id));

// Extract loaded skill names from a provider event stream.
function skillsFromEvents(stdout) {
  const found = new Set();
  for (const line of stdout.split(/\r?\n/)) {
    if (!line.trim().startsWith("{")) continue;
    let e; try { e = JSON.parse(line); } catch { continue; }
    if (provider === "copilot") {
      // tool.execution_start {toolName:"skill", arguments:{skill:"<name>"}}
      if (e.type === "tool.execution_start" && e.data?.toolName === "skill" && e.data.arguments?.skill) found.add(e.data.arguments.skill.replace(/^[\w-]+:/, ""));
    } else {
      // Codex: skills are read from disk (implicit) or injected (explicit); scan any event text for a chayen SKILL.md path or skill injection
      const s = JSON.stringify(e);
      for (const m of s.matchAll(/skills[\\/]+(chayen-[a-z-]+)[\\/]+SKILL\.md/gi)) found.add(m[1].toLowerCase());
    }
  }
  return [...found];
}

function judge(c, loaded) {
  const chayen = loaded.filter((s) => s.startsWith("chayen-"));
  const e = c.expect ?? {};
  if (e.none) return { pass: chayen.length === 0, why: chayen.length ? `unexpected ${chayen.join(",")}` : "no chayen skill" };
  if (e.none_or) { const bad = chayen.filter((s) => !e.none_or.includes(s)); return { pass: bad.length === 0, why: bad.length ? `unexpected ${bad.join(",")}` : "ok" }; }
  const hit = chayen.some((s) => e.any_of.includes(s));
  const forbidden = chayen.filter((s) => c.forbid.includes(s));
  return { pass: hit && forbidden.length === 0, why: !hit ? `expected one of ${e.any_of.join(",")}` : forbidden.length ? `forbidden ${forbidden.join(",")}` : "ok" };
}

// Resolve the CLI without a shell so prompts with quotes and `$` are passed verbatim.
// On Windows, npm installs `<name>.cmd` shims; run the shim's JavaScript entry with node instead.
function resolveCommand(name) {
  if (process.platform !== "win32") return { cmd: name, pre: [] };
  for (const dir of (process.env.PATH ?? "").split(path.delimiter)) {
    const shim = path.join(dir, `${name}.cmd`);
    if (!fs.existsSync(shim)) continue;
    const m = fs.readFileSync(shim, "utf8").match(/"%dp0%\\([^"]+\.js)"/);
    if (m) return { cmd: process.execPath, pre: [path.join(dir, m[1])] };
  }
  return { cmd: `${name}.exe`, pre: [] };
}
const { cmd, pre } = resolveCommand(provider);

fs.mkdirSync(outDir, { recursive: true });
const results = [];
for (const c of cases) {
  const args = provider === "copilot"
    ? ["-p", c.prompt, "--output-format", "json", "--no-ask-user", ...extra]
    : ["exec", "--json", "--skip-git-repo-check", "--ephemeral", "-s", "read-only", "-C", workdir, ...extra, c.prompt];
  const started = Date.now();
  const r = spawnSync(cmd, [...pre, ...args], { cwd: workdir, encoding: "utf8", timeout: 600_000, input: "", maxBuffer: 64 * 1024 * 1024 });
  const stdout = r.stdout ?? "";
  fs.writeFileSync(path.join(outDir, `${c.id}.${phase}.jsonl`), stdout);
  if (r.stderr) fs.writeFileSync(path.join(outDir, `${c.id}.${phase}.stderr.txt`), r.stderr);
  const loaded = skillsFromEvents(stdout);
  const verdict = r.status === 0 ? judge(c, loaded) : { pass: false, why: `exit ${r.status ?? r.signal}` };
  results.push({ id: c.id, category: c.category, phase, exit: r.status, seconds: Math.round((Date.now() - started) / 1000), loadedSkills: loaded, ...verdict });
  console.log(`${verdict.pass ? "PASS" : "FAIL"} ${c.id} [${phase}] skills=${loaded.join(",") || "none"} (${verdict.why})`);
}
fs.writeFileSync(path.join(outDir, `summary.${phase}.json`), JSON.stringify({ provider, phase, ranAt: new Date().toISOString(), results }, null, 2));
const passed = results.filter((r) => r.pass).length;
console.log(`\n${provider} ${phase}: ${passed}/${results.length} passed`);
process.exit(passed === results.length ? 0 : 1);
