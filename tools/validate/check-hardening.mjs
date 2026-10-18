// Phase 2 offline product invariants. Never shipped, no native provider calls.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { inside, assertTreeNoLinks } from "./safe-paths.mjs";
import { parseYamlSubset } from "../catalog/catalog-lib.mjs";

const plugin = "plugins/codejadee-chayen-framework";
const upstream = `${plugin}/skills/chayen-humanizer-en/references/upstream-notice.md`;
// Full original notice including attribution and adaptation, canonical LF UTF-8.
const NOTICE_SHA256 = "6da281a5b5e638bafd04da024183feb06785497adff2d6f4d32eb501a6cc5956";
export function checkHardening(root) {
  const errors = [];
  const error = (id, msg) => errors.push(`${id} ${msg}`);
  const read = rel => fs.readFileSync(inside(root, rel), "utf8").replace(/\r\n/g, "\n");
  try {
    const text = read(upstream);
    if (crypto.createHash("sha256").update(text).digest("hex") !== NOTICE_SHA256) error("H-LICENSE", "upstream MIT notice or attribution altered");
    if (!text.includes("Copyright (c) 2025 Siqi Chen") || !text.includes("https://github.com/blader/humanizer") || !text.includes("Permission is hereby granted") || !text.includes('THE SOFTWARE IS PROVIDED "AS IS"')) error("H-LICENSE", "required attribution or MIT terms missing");
  } catch { error("H-LICENSE", "upstream notice missing or unsafe"); }
  try { if (!read(`${plugin}/skills/chayen-humanizer-en/SKILL.md`).includes("](references/upstream-notice.md)")) error("H-LICENSE-LINK", "English Skill must reference upstream notice"); }
  catch { error("H-LICENSE-LINK", "English Skill unavailable"); }
  try {
    const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
    const dir = inside(root, `${plugin}/skills`); assertTreeNoLinks(dir);
    for (const file of walk(dir).filter(f => f.endsWith(".md"))) {
      for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
        if (/^(description:|\*\*Scope:\*\*)/.test(line) && /nitro|elysia/i.test(line.split(/Not for|Backends in other stacks/)[0])) error("H-SCOPE", `unsupported framework in positive Skill scope: ${path.relative(root, file)}`);
        if (/nitro|elysia/i.test(line) && !/out of scope|Not for|other stacks|\*\*Not when:\*\*/i.test(line)) error("H-SCOPE", `unsupported framework guidance in ${path.relative(root, file)}`);
      }
    }
    const catalog = parseYamlSubset(read("catalog/engineering-capabilities.yaml"));
    if ([...(catalog.stack_packs ?? []), ...Object.values(catalog.stack_groups ?? {}).flat()].some(x => /nitro|elysia/i.test(x))) error("H-SCOPE", "unsupported catalog stack");
    for (const cap of catalog.capabilities) if ((cap.positive_triggers ?? []).some(x => /nitro|elysia/i.test(x))) error("H-SCOPE", "unsupported catalog trigger");
    for (const line of read("catalog/technology-capabilities.yaml").split("\n")) if (/nitro|elysia/i.test(line) && !/not_when:.*out of scope/i.test(line)) error("H-SCOPE", "unsupported technology guidance");
    const cases = JSON.parse(read("tests/skills/trigger-cases.json")).cases;
    for (const c of cases) if (/nitro|elysia/i.test(c.prompt) && (!c.expect.none || c.category !== "unsupported")) error("H-ROUTING", `unsupported framework routed: ${c.id}`);
    for (const name of ["Nitro", "Elysia"]) if (!cases.some(c => c.expect.none && c.category === "unsupported" && new RegExp(name, "i").test(c.prompt))) error("H-ROUTING", `missing ${name} no-match regression`);
    for (const f of ["recipe-cases", "technology-cases"]) for (const c of JSON.parse(read(`tests/skills/${f}.json`)).cases) if (/nitro|elysia/i.test(JSON.stringify(c))) error("H-ROUTING", `unsupported framework recipe: ${c.id}`);
    const th = read(`${plugin}/skills/chayen-humanizer-th/SKILL.md`), desc = /^description: (.+)$/m.exec(th)?.[1] ?? "";
    if (!/Thai copy in localization files/.test(desc) || !/Not for .*i18n configuration, routing, key wiring/.test(desc) || /or i18n and application code/.test(desc)) error("H-TH-SCOPE", "Thai description must admit locale copy and exclude framework wiring");
    const registered = JSON.parse(read("catalog/editorial-skills.json")).skills.find(s => s.name === "chayen-humanizer-th");
    if (registered?.description !== desc) error("H-TH-SCOPE", "Thai registration differs from frontmatter");
    if (!cases.some(c => c.expect.any_of?.includes("chayen-humanizer-th") && /locales\/th.json/.test(c.prompt)) || !cases.some(c => /locale routing/.test(c.prompt) && c.forbid?.includes("chayen-humanizer-th")) || !cases.some(c => /translation keys/.test(c.prompt) && c.forbid?.includes("chayen-humanizer-th"))) error("H-TH-SCOPE", "missing copy/routing/key-wiring boundary cases");
    const runbook = read("tests/provider-compatibility/README.md");
    const count = fs.readdirSync(dir).filter(n => fs.existsSync(path.join(dir, n, "SKILL.md"))).length;
    const expected = /Current Entry Skills:\s*\*\*(\d+)\*\*/.exec(runbook)?.[1];
    if (Number(expected) !== count || /Skills \(13\)|Installed 13 skills|Expected skill count: `13`/.test(runbook)) error("H-RUNBOOK", "runbook count differs from build");
    if (!runbook.includes("chayen@codejadee")) error("H-RUNBOOK", "current plugin identity missing");
    const lifecycle = read("tests/provider-compatibility/lifecycle.mjs");
    for (const token of ["CHAYEN_ALLOW_PROVIDER_LIFECYCLE", "CHAYEN_DISPOSABLE_ENVIRONMENT", "COPILOT_AUTO_UPDATE: \"false\"", "configFingerprint(homes)", "state(false)", "if (!installedBuild(profile, expected))", '"disable", "enable", "update", "uninstall"', '"--help"']) if (!lifecycle.includes(token)) error("H-LIFECYCLE", `missing lifecycle guard: ${token}`);
    if (!read("tests/provider-compatibility/run-lifecycle.sh").includes("lifecycle.mjs")) error("H-LIFECYCLE", "shell entry point does not run guarded implementation");
  } catch (e) { error("H-INPUT", `hardening inputs missing or unsafe: ${e.message}`); }
  return errors;
}
if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  const index = process.argv.indexOf("--root");
  const root = path.resolve(index < 0 ? path.join(import.meta.dirname, "../..") : process.argv[index + 1]);
  const errors = checkHardening(root);
  for (const e of errors) console.log(`ERROR ${e}`);
  console.log(`${errors.length ? "FAIL" : "PASS"} Phase 2 hardening invariants: ${errors.length} error(s)`);
  process.exitCode = errors.length ? 1 : 0;
}
