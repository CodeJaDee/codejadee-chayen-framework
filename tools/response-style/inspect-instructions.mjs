#!/usr/bin/env node
// Read-only helper for the opt-in response style policy (Step 39). It never writes, creates,
// renames or deletes a file, and makes no network, process or provider call. It reports what is
// in instruction files you name and prints the exact change a setup or removal would make, so a
// person (or their agent, after asking them) can review the diff and apply it by hand.
// Zero dependencies (Node.js >= 20.11, for import.meta.dirname). Not part of the plugin package.
//
// Usage:
//   node tools/response-style/inspect-instructions.mjs status <file> [<file>...]
//   node tools/response-style/inspect-instructions.mjs plan-add <file> [--format block|copilot-instructions]
//   node tools/response-style/inspect-instructions.mjs plan-remove <file> [--format block|copilot-instructions]
//   node tools/response-style/inspect-instructions.mjs print [block|copilot-instructions]
// Exit codes: 0 done (including "no change"), 2 needs human review, 1 usage error.

import fs from "node:fs";
import path from "node:path";
import { loadPolicy, inspect, planAdd, planRemove, diff, copilotTemplate } from "./policy-lib.mjs";

const root = path.resolve(import.meta.dirname, "..", "..");
const [command, ...rest] = process.argv.slice(2);
const fi = rest.indexOf("--format");
const format = fi > -1 ? rest[fi + 1] : "block";
const files = fi > -1 ? rest.filter((_, i) => i !== fi && i !== fi + 1) : rest;
const usage = () => { console.error("usage: status <file>... | plan-add <file> [--format block|copilot-instructions] | plan-remove <file> [--format ...] | print [block|copilot-instructions]"); process.exit(1); };
if (!["block", "copilot-instructions"].includes(format)) usage();

const policy = loadPolicy(root);
function readTarget(file) {
  const abs = path.resolve(file);
  let stat;
  try { stat = fs.lstatSync(abs); } catch (e) { if (e.code === "ENOENT") return { abs, text: null, note: "" }; throw e; }
  const note = stat.isSymbolicLink() ? ` (symbolic link to ${fs.realpathSync(abs)}; an edit changes the link target)` : "";
  if (!fs.statSync(abs).isFile()) { console.error(`${abs}: not a regular file`); process.exit(1); }
  return { abs, text: fs.readFileSync(abs, "utf8"), note };
}

if (command === "print") {
  const what = files[0] ?? "block";
  if (!["block", "copilot-instructions"].includes(what)) usage();
  process.stdout.write(what === "block" ? policy.text : copilotTemplate(policy));
  process.exit(0);
}

if (command === "status") {
  if (!files.length) usage();
  let review = 0, loaded = 0;
  for (const file of files) {
    const { abs, text, note } = readTarget(file);
    const r = inspect(text, policy);
    if (r.blocks.length) loaded++;
    const version = r.blocks.length === 1 ? ` v${r.blocks[0].version}` : "";
    console.log(`${r.state.toUpperCase()}${version}  ${abs}${note}`);
    for (const p of r.problems ?? []) console.log(`    marker problem: ${p}`);
    if (r.unmarkedCopy) console.log("    an unmarked copy of the policy text appears outside any block");
    for (const o of r.overlap) console.log(`    review for overlap, line ${o.line}: ${o.text}`);
    if (["modified", "newer", "duplicate", "malformed"].includes(r.state) || r.unmarkedCopy) review++;
  }
  if (loaded > 1) { console.log(`NOTE  the policy appears in ${loaded} of the named files; a host that reads more than one of them loads it more than once`); review++; }
  console.log(`canonical policy v${policy.version}, ${policy.body.length} characters`);
  process.exit(review ? 2 : 0);
}

if (command === "plan-add" || command === "plan-remove") {
  if (files.length !== 1) usage();
  const { abs, text, note } = readTarget(files[0]);
  const plan = (command === "plan-add" ? planAdd : planRemove)(text, policy, { format });
  console.log(`state: ${plan.inspection.state}${note}`);
  for (const o of plan.inspection.overlap) console.log(`review for overlap, line ${o.line}: ${o.text}`);
  if (plan.action === "refuse") { console.log(`no plan: ${plan.reason}`); process.exit(2); }
  if (plan.action === "none") { console.log("no change needed"); process.exit(0); }
  console.log(`action: ${plan.action} ${abs}`);
  console.log("This tool did not change anything. Review the diff, back up the file, then apply it yourself.");
  console.log(diff(text, plan.next, abs));
  process.exit(0);
}

usage();
