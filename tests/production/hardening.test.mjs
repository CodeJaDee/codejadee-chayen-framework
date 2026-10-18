// Negative mutations against a disposable copy of the actual build, never providers.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { checkHardening } from "../../tools/validate/check-hardening.mjs";

const repo = path.resolve(import.meta.dirname, "../.."), pkg = "plugins/codejadee-chayen-framework";
const notice = `${pkg}/skills/chayen-humanizer-en/references/upstream-notice.md`;
const th = `${pkg}/skills/chayen-humanizer-th/SKILL.md`, en = `${pkg}/skills/chayen-humanizer-en/SKILL.md`;
const parent = fs.realpathSync(os.tmpdir()), dir = fs.mkdtempSync(path.join(parent, "chayen-hardening-test-"));
test.after(() => { assert.equal(path.dirname(fs.realpathSync(dir)), parent); fs.rmSync(dir, { recursive: true }); });
for (const rel of ["plugins", "catalog", "tests/skills", "tests/provider-compatibility"]) fs.cpSync(path.join(repo, rel), path.join(dir, rel), { recursive: true });
test("unchanged actual build passes hardening validation", () => assert.deepEqual(checkHardening(dir), []));
function mutation(name, file, change, expected) {
  test(name, () => {
    const p = path.join(dir, file), original = fs.readFileSync(p);
    try {
      if (change === null) fs.unlinkSync(p);
      else { const changed = change(original.toString("utf8")); assert.notEqual(changed, original.toString("utf8")); fs.writeFileSync(p, changed); }
      assert.ok(checkHardening(dir).some(e => e.startsWith(expected)), JSON.stringify(checkHardening(dir)));
    } finally { fs.writeFileSync(p, original); }
  });
}
mutation("removed upstream notice", notice, null, "H-LICENSE");
mutation("removed permission grant", notice, s => s.replace("Permission is hereby granted", "Permission removed"), "H-LICENSE");
mutation("altered warranty disclaimer", notice, s => s.replace('THE SOFTWARE IS PROVIDED "AS IS"', 'THE SOFTWARE IS PROVIDED WITH WARRANTY'), "H-LICENSE");
mutation("altered copyright holder", notice, s => s.replace("2025 Siqi Chen", "2026 Somebody Else"), "H-LICENSE");
mutation("removed attribution source", notice, s => s.replace("https://github.com/blader/humanizer", "https://example.com"), "H-LICENSE");
mutation("altered adaptation attribution", notice, s => s.replace("version 3.1.0", "version 9.0.0"), "H-LICENSE");
mutation("English Skill no longer links to notice", en, s => s.replaceAll("](references/upstream-notice.md)", "](references/protected-content.md)"), "H-LICENSE-LINK");
test("adding a project MIT licence does not excuse missing upstream notice", () => {
  const p = path.join(dir, notice), original = fs.readFileSync(p), license = path.join(dir, "LICENSE");
  try { fs.writeFileSync(license, "MIT License\nCopyright CodeJaDee\n"); fs.unlinkSync(p); assert.ok(checkHardening(dir).some(e => e.startsWith("H-LICENSE"))); }
  finally { fs.writeFileSync(p, original); fs.unlinkSync(license); }
});
mutation("unsupported positive backend metadata", `${pkg}/skills/chayen-backend/SKILL.md`, s => s.replace("Node servers (Next.js", "Node servers (Elysia, Next.js"), "H-SCOPE");
mutation("unsupported recipe guidance", `${pkg}/skills/chayen-backend/references/api-endpoints.md`, s => s + "\n| Elysia | Use framework hooks. |\n", "H-SCOPE");
mutation("unsupported catalog stack", "catalog/engineering-capabilities.yaml", s => s.replace("stack_packs: [", "stack_packs: [nitro, "), "H-SCOPE");
mutation("unsupported stack group", "catalog/engineering-capabilities.yaml", s => s.replace("server-stacks: [", "server-stacks: [elysia, "), "H-SCOPE");
mutation("unsupported framework routed positively", "tests/skills/trigger-cases.json", s => s.replace('"Build a standalone Nitro API route with framework-specific validation.", "expect": { "none": true }', '"Build a standalone Nitro API route with framework-specific validation.", "expect": { "any_of": ["chayen-backend"] }'), "H-ROUTING");
mutation("unsupported framework in recipe fixture", "tests/skills/recipe-cases.json", s => s.replace("our Next.js API", "our Nitro API"), "H-ROUTING");
mutation("Thai description excludes locale copy", th, s => s.replace("and Thai copy in localization files", "and application copy"), "H-TH-SCOPE");
mutation("Thai registration drift", "catalog/editorial-skills.json", s => s.replace("i18n configuration, routing, key wiring", "all localization"), "H-TH-SCOPE");
mutation("runbook reverts to stale count", "tests/provider-compatibility/README.md", s => s.replace("Current Entry Skills: **15**", "Current Entry Skills: **13**"), "H-RUNBOOK");
mutation("authorization guard removed", "tests/provider-compatibility/lifecycle.mjs", s => s.replaceAll("CHAYEN_ALLOW_PROVIDER_LIFECYCLE", "IGNORED_GUARD"), "H-LIFECYCLE");
mutation("uninstall absence check removed", "tests/provider-compatibility/lifecycle.mjs", s => s.replace("state(false)", "state(true)"), "H-LIFECYCLE");
mutation("update content verification removed", "tests/provider-compatibility/lifecycle.mjs", s => s.replace("if (!installedBuild(profile, expected))", "if (false)"), "H-LIFECYCLE");
mutation("Copilot auto-update guard removed", "tests/provider-compatibility/lifecycle.mjs", s => s.replace('COPILOT_AUTO_UPDATE: "false"', 'COPILOT_AUTO_UPDATE: "true"'), "H-LIFECYCLE");
