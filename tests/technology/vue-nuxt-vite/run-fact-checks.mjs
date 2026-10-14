#!/usr/bin/env node
// Developer-only optional installed Vue/Vite APIs and dependency-free
// JavaScript exposure counterexamples. No installs or framework simulation.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const FACTS = {
  "VF-01": ["vue-composition-api", "A Vue setup SSR render preserves prop text and explicit Composition bindings"],
  "VF-02": ["vue-reactivity", "Ordinary reactive destructuring snapshots a primitive while toRef/computed follows updates"],
  "VF-03": ["vue-composables", "Vue effect scopes run disposal and stop owned watchers"],
  "VF-04": ["vue-router", "Navigation/history and host fallback require the installed router and configured fixture"],
  "VF-05": ["vue-state-management", "SSR store isolation and subscription behavior require the installed Pinia/Vuex or existing state layer"],
  "VF-06": ["vue-component-testing", "Component emits/model/async behavior require configured Vue Test Utils/runner and DOM setup"],
  "VF-07": ["vue-performance", "Rendering improvement needs comparable profiler evidence and user interaction"],
  "UF-01": ["nuxt-routing", "Nuxt generated routes, layouts, middleware and SSR navigation require a compiled matching fixture"],
  "UF-02": ["nuxt-data-fetching", "SSR/hydration payload reuse, keys and cancellation require a matching Nuxt app and browser"],
  "UF-03": ["nuxt-server-api", "Installed Nuxt/Nitro or legacy server endpoint behavior requires its configured server fixture"],
  "UF-04": ["nuxt-runtime-config", "JavaScript JSON serialization of a config leaks its private sentinel; explicit public DTO excludes it (not Nuxt serialization/overrides)"],
  "UF-05": ["nuxt-auto-imports", "Generated imports/types and composable context require Nuxt prepare/build/runtime fixture"],
  "UF-06": ["nuxt-modules", "Module/layer/hook compatibility and server/client integration require installed module and Nuxt fixture"],
  "UF-07": ["nuxt-rendering-deployment", "Preset/output/runtime overrides and real hydration require a built Nuxt artifact and browser"],
  "BF-01": ["vite-configuration", "Vite resolveConfig preserves explicit root/base/alias without installing plugins"],
  "BF-02": ["vite-build-optimization", "Optimization requires the actual production build and comparable bundle/loading measurements"],
  "BF-03": ["vite-environment-safety", "JavaScript false env string is truthy and an unrestricted env spread exposes a private sentinel (not Vite bundle verification)"],
  "BF-04": ["vite-test-integration", "Runner config inheritance and transforms require the project's configured runner/environment"],
};
const args = process.argv.slice(2);
const option = name => args.includes(name) ? args[args.indexOf(name) + 1] : null;
const results = [];
const record = (id, status, note) => results.push({ id, capability: FACTS[id][0], status, note });
const check = async (id, action) => { try { await action(); record(id, "PASS", FACTS[id][1]); } catch (error) { record(id, "FAIL", error.message); } };
const versions = { node: process.version, vue: "unavailable", nuxt: "unavailable", vite: "unavailable" };
let vue = null, ssr = null, vite = null;
if (option("--deps")) {
  const req = createRequire(path.join(path.resolve(option("--deps")), "../package.json"));
  try { vue = req("vue"); versions.vue = vue.version; } catch (error) { console.error(`Vue unavailable: ${error.message}`); }
  try { ssr = req("vue/server-renderer"); } catch { /* SSR separately unavailable */ }
  try { versions.nuxt = req("nuxt/package.json").version; } catch { /* detecting a version does not run Nuxt */ }
  try { vite = await import(pathToFileURL(req.resolve("vite")).href); versions.vite = vite.version; } catch (error) { console.error(`Vite unavailable: ${error.message}`); }
}
for (const id of ["VF-01", "VF-02", "VF-03"]) {
  if (!vue || Number(versions.vue.split(".")[0]) < 3 || (id === "VF-01" && !ssr)) { record(id, "NOT_RUN", "No matching existing Vue 3 API/SSR dependency fixture supplied."); continue; }
  await check(id, async () => {
    if (id === "VF-01") {
      const component = vue.defineComponent({ props: { title: String }, setup(props) { const prefix = vue.ref("Order: "); return () => vue.h("button", { type: "button" }, prefix.value + props.title); } });
      const html = await ssr.renderToString(vue.createSSRApp(component, { title: "<private>" }));
      assert.match(html, /Order: &lt;private&gt;/); assert.ok(!html.includes("<private>"));
    } else if (id === "VF-02") {
      const state = vue.reactive({ count: 0 }); const { count: snapshot } = state;
      const count = vue.toRef(state, "count"), doubled = vue.computed(() => count.value * 2);
      state.count = 2; assert.equal(snapshot, 0); assert.equal(count.value, 2); assert.equal(doubled.value, 4);
    } else {
      const scope = vue.effectScope(); const count = vue.ref(0); let disposed = false, notifications = 0;
      scope.run(() => { vue.watch(count, () => { notifications++; }, { flush: "sync" }); vue.onScopeDispose(() => { disposed = true; }); });
      count.value++; assert.equal(notifications, 1); scope.stop(); assert.equal(disposed, true);
      count.value++; assert.equal(notifications, 1);
    }
  });
}
await check("UF-04", () => {
  const sentinel = "STEP23_SYNTHETIC_PRIVATE_CONFIG";
  const config = { apiSecret: sentinel, public: { apiBase: "/api" } };
  assert.ok(JSON.stringify(config).includes(sentinel));
  assert.ok(!JSON.stringify({ apiBase: config.public.apiBase }).includes(sentinel));
  assert.equal(config.apiSecret, sentinel); // private source still exists on server
});
await check("BF-03", () => {
  const values = { VITE_SHOW_HELP: "false", SERVER_TOKEN: "STEP23_SYNTHETIC_PRIVATE_ENV" };
  assert.equal(Boolean(values.VITE_SHOW_HELP), true); assert.equal(values.VITE_SHOW_HELP === "true", false);
  assert.ok(JSON.stringify({ ...values }).includes(values.SERVER_TOKEN));
  assert.ok(!JSON.stringify({ showHelp: values.VITE_SHOW_HELP === "true" }).includes(values.SERVER_TOKEN));
});
if (!vite) record("BF-01", "NOT_RUN", "No existing Vite dependency supplied; selected framework builder/config remains untested.");
else await check("BF-01", async () => {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "chayen-vite-config-fact-"));
  try {
    const config = await vite.resolveConfig({ configFile: false, root: scratch, base: "/nested/", resolve: { alias: { "@": path.join(scratch, "src") } } }, "build", "production");
    assert.equal(config.root, scratch.replace(/\\/g, "/")); assert.equal(config.base, "/nested/");
    assert.ok(config.resolve.alias.some(alias => alias.find === "@" && alias.replacement === path.join(scratch, "src")));
  } finally {
    assert.equal(path.dirname(scratch), path.resolve(os.tmpdir())); assert.ok(path.basename(scratch).startsWith("chayen-vite-config-fact-"));
    fs.rmSync(scratch, { recursive: true, force: true });
  }
});
for (const id of ["VF-04", "VF-05", "VF-06", "VF-07", "UF-01", "UF-02", "UF-03", "UF-05", "UF-06", "UF-07", "BF-02", "BF-04"]) record(id, "NOT_RUN", FACTS[id][1]);
results.sort((a, b) => a.id.localeCompare(b.id));
const counts = Object.fromEntries(["PASS", "FAIL", "NOT_RUN"].map(status => [status, results.filter(r => r.status === status).length]));
for (const result of results) console.log(`${result.status} ${result.id} ${result.capability}: ${result.note}`);
console.log(JSON.stringify({ versions, counts }));
const reportPath = option("--report");
if (reportPath) {
  const command = ["node tests/technology/vue-nuxt-vite/run-fact-checks.mjs", ...args.map(arg => /\s/.test(arg) ? JSON.stringify(arg) : arg)].join(" ");
  const text = `# Step 23 fact and exposure checks\n\nDate: 2026-10-15. Command: \`${command}\`.\n\nVersions: ${JSON.stringify(versions)}.\n\n${counts.PASS} PASS, ${counts.FAIL} FAIL, ${counts.NOT_RUN} NOT_RUN.\n\nUF-04/BF-03 are JavaScript serialization/string-exposure counterexamples using synthetic sentinels. They do not exercise Nuxt private/public projection or runtime overrides, Vite env transformation/build output, plugins, or framework secrecy. Optional Vue/Vite APIs run only when existing compatible dependencies are explicitly supplied. No packages installed; no agent behavior or trigger evaluation ran.\n\n| Fact | Capability | Result | Evidence / limit |\n|---|---|---|---|\n${results.map(r => `| ${r.id} | ${r.capability} | ${r.status} | ${r.note.replace(/\|/g, "/").replace(/\n/g, " ")} |`).join("\n")}\n`;
  fs.mkdirSync(path.dirname(path.resolve(reportPath)), { recursive: true }); fs.writeFileSync(reportPath, text);
}
process.exitCode = counts.FAIL ? 1 : 0;
