#!/usr/bin/env node
// Developer-only framework facts. No downloads, installs, or project edits.
// Optional --deps <existing node_modules> and --typescript <typescript.js>.
// Framework facts are distinct from agent behavior/trigger evaluations.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const FACTS = {
  "AF-01": ["angular-component-design", "An explicit standalone JIT component retains its decorator input/output contract"],
  "AF-02": ["angular-signals", "computed reflects immutable signal updates and caches derivation until a dependency changes"],
  "AF-03": ["angular-rxjs-interop", "toSignal requires synchronous emission with requireSync and stops updating after owner destruction"],
  "AF-04": ["angular-state-management", "An owned signal store derives state and separates independent owners"],
  "AF-05": ["angular-routing", "Router URL serialization preserves encoded path, query and fragment values"],
  "AF-06": ["angular-http-client", "HTTP success/error/cancellation and provider-order facts need an installed configured Angular test harness"],
  "AF-07": ["angular-forms", "nonNullable controls reset to their initial value; disabled values differ between value and getRawValue"],
  "AF-08": ["angular-template-control-flow", "Angular template parser accepts tracked built-in for and rejects missing track"],
  "AF-09": ["angular-dependency-injection", "Environment injector instances share parent providers and isolate child overrides; inject outside context fails"],
  "AF-10": ["angular-change-detection", "Automatic async render notifications need a real browser fixture with the configured zone mode"],
  "AF-11": ["angular-ssr-hydration", "DOM reuse and hydration mismatch checks need a configured SSR and real browser fixture"],
  "AF-12": ["angular-testing", "Runner-specific async and TestBed behavior needs the configured runner fixture"],
  "AF-13": ["angular-accessibility", "Keyboard focus and assistive-technology behavior need a rendered browser fixture and manual checks"],
  "AF-14": ["angular-upgrade-migration", "Upgrade migrations require an explicit source/target fixture; detecting a version alone proves no migration"],
  "JF-01": ["typescript-type-safety", "Strict compile rejects an unsafe unknown assignment; a guard compiles and rejects malformed runtime input"],
  "JF-02": ["typescript-api-modeling", "Discriminated result models reject impossible variants; ISO JSON timestamps stay strings"],
  "JF-03": ["javascript-async-control", "Awaited work stays ordered and bounded; cancellation rejects owned pending I/O"],
  "JF-04": ["javascript-runtime-compatibility", "Node lacks browser window even when a compiler provides DOM type declarations"],
  "JF-05": ["esm-cjs-interop", "Node loads an explicit CommonJS export from ESM; require of an .mjs file with top-level await fails"],
  "JF-06": ["package-manager-integrity", "npm ci accepts a coherent local lock and rejects a manifest/local dependency version mismatch offline"],
  "JF-07": ["typescript-monorepo", "TypeScript paths resolve source types but do not rewrite emitted module specifiers"],
  "JF-08": ["typescript-config-review", "Inherited strictNullChecks affects diagnostics; config parsing exposes the effective options"],
};
const args = process.argv.slice(2);
const option = name => args.includes(name) ? args[args.indexOf(name) + 1] : null;
const results = [];
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "chayen-angular-js-facts-"));
const put = (name, content) => { const file = path.join(scratch, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); return file; };
const record = (id, status, note) => results.push({ id, capability: FACTS[id][0], status, note });
const check = async (id, action) => {
  try { await action(); record(id, "PASS", FACTS[id][1]); }
  catch (error) { record(id, "FAIL", error.message); }
};
let ts = null, core = null, compiler = null, rx = null, interop = null;
const versions = { node: process.version, typescript: "unavailable", angular: "unavailable" };
const tsPath = option("--typescript");
if (tsPath) {
  try { ts = createRequire(import.meta.url)(path.resolve(tsPath)); versions.typescript = ts.version; }
  catch (error) { console.error(`TypeScript unavailable: ${error.message}`); }
}
const deps = option("--deps");
const loadAngular = async name => {
  const req = createRequire(path.join(path.resolve(deps), "../package.json"));
  return import(pathToFileURL(req.resolve(name)).href);
};
if (deps) {
  try {
    compiler = await loadAngular("@angular/compiler");
    core = await loadAngular("@angular/core");
    rx = await loadAngular("rxjs");
    interop = await loadAngular("@angular/core/rxjs-interop");
    versions.angular = core.VERSION.full;
  } catch (error) { console.error(`Angular dependencies unavailable: ${error.message}`); core = null; }
}
const compile = (text, options = {}) => {
  const file = put("input.ts", text);
  const program = ts.createProgram([file], { strict: true, noEmit: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, ...options });
  return ts.getPreEmitDiagnostics(program);
};

try {
  for (const id of Object.keys(FACTS).filter(id => id.startsWith("AF-"))) {
    if (!core) record(id, "NOT_RUN", "No existing Angular dependency fixture supplied; no packages installed.");
    else if (["AF-06", "AF-10", "AF-11", "AF-12", "AF-13", "AF-14"].includes(id)) record(id, "NOT_RUN", FACTS[id][1]);
    else await check(id, async () => {
      if (id === "AF-01") {
        class Card { title = ""; selected = new core.EventEmitter(); }
        core.Component({ selector: "fact-card", standalone: true, template: "{{title}}", inputs: ["title"], outputs: ["selected"] })(Card);
        assert.equal(Card.ɵcmp.standalone, true);
        assert.ok(Card.ɵcmp.inputs.title);
        assert.ok(Card.ɵcmp.outputs.selected);
        let emitted; const instance = new Card();
        const sub = instance.selected.subscribe(v => { emitted = v; }); instance.selected.emit("id");
        assert.equal(emitted, "id"); sub.unsubscribe();
      } else if (id === "AF-02") {
        const count = core.signal(1); let runs = 0;
        const doubled = core.computed(() => { runs++; return count() * 2; });
        assert.equal(doubled(), 2); assert.equal(doubled(), 2); assert.equal(runs, 1);
        count.update(v => v + 1); assert.equal(doubled(), 4); assert.equal(runs, 2);
      } else if (id === "AF-03") {
        const injector = core.createEnvironmentInjector([]);
        const source = new rx.BehaviorSubject(1);
        const value = core.runInInjectionContext(injector, () => interop.toSignal(source, { requireSync: true }));
        assert.equal(value(), 1); source.next(2); assert.equal(value(), 2);
        injector.destroy(); source.next(3); assert.equal(value(), 2);
        const bad = core.createEnvironmentInjector([]);
        try { assert.throws(() => core.runInInjectionContext(bad, () => interop.toSignal(rx.NEVER, { requireSync: true }))); }
        finally { bad.destroy(); source.complete(); }
      } else if (id === "AF-04") {
        const owner = () => { const state = core.signal({ pending: false }); return { state, pending: core.computed(() => state().pending) }; };
        const a = owner(), b = owner(); a.state.set({ pending: true });
        assert.equal(a.pending(), true); assert.equal(b.pending(), false);
      } else if (id === "AF-05") {
        const { DefaultUrlSerializer } = await loadAngular("@angular/router");
        const serializer = new DefaultUrlSerializer();
        const tree = serializer.parse("/orders/a%20b?q=hello%20world#details");
        assert.equal(tree.root.children.primary.segments[1].path, "a b");
        assert.equal(tree.queryParams.q, "hello world"); assert.equal(tree.fragment, "details");
        assert.equal(serializer.parse(serializer.serialize(tree)).queryParams.q, "hello world");
      } else if (id === "AF-07") {
        const { FormBuilder } = await loadAngular("@angular/forms");
        const form = new FormBuilder().nonNullable.group({ email: ["initial"], name: ["name"] });
        form.controls.email.setValue("changed"); form.reset(); assert.equal(form.controls.email.value, "initial");
        form.controls.name.disable(); assert.equal(form.value.name, undefined); assert.equal(form.getRawValue().name, "name");
      } else if (id === "AF-08") {
        assert.equal(compiler.parseTemplate("@for (item of items; track item.id) { {{item.name}} }", "valid.html").errors, null);
        assert.ok(compiler.parseTemplate("@for (item of items) { {{item.name}} }", "invalid.html").errors?.length);
      } else if (id === "AF-09") {
        const token = new core.InjectionToken("state");
        const shared = {}; const parent = core.createEnvironmentInjector([{ provide: token, useValue: shared }]);
        const a = core.createEnvironmentInjector([], parent), b = core.createEnvironmentInjector([{ provide: token, useValue: {} }], parent);
        try { assert.equal(a.get(token), shared); assert.notEqual(b.get(token), shared); assert.throws(() => core.inject(token)); }
        finally { a.destroy(); b.destroy(); parent.destroy(); }
      }
    });
  }

  for (const id of ["JF-01", "JF-02", "JF-07", "JF-08"]) {
    if (!ts) { record(id, "NOT_RUN", "No existing TypeScript compiler supplied; no compiler downloaded."); continue; }
    await check(id, () => {
      if (id === "JF-01") {
        assert.ok(compile("const value: unknown = 'x'; const name: string = value;").some(d => d.code === 2322));
        assert.equal(compile("const value: unknown = 'x'; if (typeof value === 'string') { const name: string = value; }").length, 0);
        const isNamed = v => typeof v === "object" && v !== null && "name" in v && typeof v.name === "string";
        assert.equal(isNamed({ name: "ok" }), true); assert.equal(isNamed({ name: 3 }), false); assert.equal(isNamed(null), false);
      } else if (id === "JF-02") {
        const model = "type Result = {kind: 'saved'; id: string} | {kind: 'invalid'; fields: Record<string, string>};";
        assert.equal(compile(model + "const result: Result = {kind: 'saved', id: 'a'};").length, 0);
        assert.ok(compile(model + "const result: Result = {kind: 'saved', fields: {}};").length);
        assert.equal(typeof JSON.parse('{"at":"2026-10-15T00:00:00Z"}').at, "string");
      } else if (id === "JF-07") {
        put("shared/index.ts", "export const value = 1;");
        const file = put("consumer.ts", "import { value } from '@shared'; console.log(value);");
        const program = ts.createProgram([file], { strict: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, paths: { "@shared": [path.join(scratch, "shared/index.ts")] } });
        assert.equal(ts.getPreEmitDiagnostics(program).length, 0);
        let output = ""; program.emit(undefined, (file, text) => { if (file.endsWith("consumer.js")) output = text; });
        assert.ok(output.includes("from '@shared'"));
      } else if (id === "JF-08") {
        put("base.json", JSON.stringify({ compilerOptions: { strictNullChecks: true } }));
        const file = put("tsconfig.json", JSON.stringify({ extends: "./base.json", files: ["input.ts"] }));
        const cfg = ts.readConfigFile(file, ts.sys.readFile);
        const parsed = ts.parseJsonConfigFileContent(cfg.config, ts.sys, scratch);
        assert.equal(parsed.options.strictNullChecks, true);
        assert.ok(compile("const value: string = null;", parsed.options).some(d => d.code === 2322));
        assert.equal(compile("const value: string = null;", { strictNullChecks: false }).length, 0);
      }
    });
  }
  await check("JF-03", async () => {
    let active = 0, max = 0; const seen = [];
    for (const item of [1, 2, 3]) { active++; max = Math.max(max, active); await Promise.resolve(); seen.push(item); active--; }
    assert.deepEqual(seen, [1, 2, 3]); assert.equal(max, 1);
    const { setTimeout } = await import("node:timers/promises");
    const controller = new AbortController(); const waiting = setTimeout(10000, null, { signal: controller.signal });
    controller.abort(); await assert.rejects(waiting, { name: "AbortError" });
    await assert.rejects(Promise.resolve().then(() => { throw new Error("observed"); }), /observed/);
  });
  await check("JF-04", () => {
    if (ts) assert.equal(compile("console.log(window.location.href);").length, 0);
    const file = put("no-browser.mjs", "console.log(window.location.href);");
    const run = spawnSync(process.execPath, [file], { encoding: "utf8" });
    assert.notEqual(run.status, 0); assert.match(run.stderr, /window is not defined/);
  });
  await check("JF-05", async () => {
    const cjs = put("values.cjs", "module.exports = { count: 2 };");
    assert.equal((await import(pathToFileURL(cjs).href)).default.count, 2);
    put("async.mjs", "await Promise.resolve(); export const value = 1;");
    const file = put("consumer.cjs", "require('./async.mjs');");
    const run = spawnSync(process.execPath, [file], { encoding: "utf8" });
    assert.notEqual(run.status, 0); assert.match(run.stderr, /ERR_REQUIRE_ASYNC_MODULE|ERR_REQUIRE_ESM/);
  });
  const npmCli = option("--npm-cli");
  if (!npmCli) record("JF-06", "NOT_RUN", "No existing npm CLI supplied; no install command run.");
  else await check("JF-06", () => {
    const dir = path.join(scratch, "install");
    put("install/package.json", JSON.stringify({ name: "fact-install", version: "1.0.0", private: true, dependencies: { local: "file:./local" } }));
    put("install/local/package.json", JSON.stringify({ name: "local", version: "1.0.0" }));
    const run = command => spawnSync(process.execPath, [path.resolve(npmCli), ...command, "--offline", "--ignore-scripts", "--no-audit", "--no-fund"], { cwd: dir, encoding: "utf8", timeout: 30000 });
    const lock = run(["install", "--package-lock-only"]); assert.equal(lock.status, 0, lock.stderr);
    const valid = run(["ci"]); assert.equal(valid.status, 0, valid.stderr);
    put("install/other/package.json", JSON.stringify({ name: "local", version: "2.0.0" }));
    put("install/package.json", JSON.stringify({ name: "fact-install", version: "1.0.0", private: true, dependencies: { local: "file:./other" } }));
    const invalid = run(["ci"]); assert.notEqual(invalid.status, 0); assert.match(invalid.stderr, /in sync|Invalid:|Missing:/);
  });
  const counts = Object.fromEntries(["PASS", "FAIL", "NOT_RUN"].map(s => [s, results.filter(r => r.status === s).length]));
  for (const r of results.sort((a, b) => a.id.localeCompare(b.id))) console.log(`${r.status} ${r.id} ${r.capability}: ${r.note}`);
  console.log(JSON.stringify({ versions, counts }));
  const out = option("--report");
  if (out) {
    const command = ["node tests/technology/angular-typescript/run-fact-checks.mjs", ...args.map(arg => /\s/.test(arg) ? JSON.stringify(arg) : arg)].join(" ");
    const report = `# Step 21 framework facts\n\nDate: 2026-10-15. Command: \`${command}\`.\n\nVersions: ${JSON.stringify(versions)}.\n\n${counts.PASS} PASS, ${counts.FAIL} FAIL, ${counts.NOT_RUN} NOT_RUN. A successful runner exit means no executed fact failed; skipped facts remain NOT_RUN. No agent behavior or trigger eval ran.\n\n| Fact | Capability | Result | Evidence / limit |\n|---|---|---|---|\n${results.map(r => `| ${r.id} | ${r.capability} | ${r.status} | ${r.note.replace(/\|/g, "/").replace(/\n/g, " ")} |`).join("\n")}\n`;
    fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true }); fs.writeFileSync(out, report);
  }
  process.exitCode = counts.FAIL ? 1 : 0;
} finally {
  // Scratch contains only files made by this runner; check its exact parent
  // and prefix before removing anything recursively on Windows.
  assert.equal(path.dirname(scratch), path.resolve(os.tmpdir()));
  assert.ok(path.basename(scratch).startsWith("chayen-angular-js-facts-"));
  fs.rmSync(scratch, { recursive: true, force: true });
}
