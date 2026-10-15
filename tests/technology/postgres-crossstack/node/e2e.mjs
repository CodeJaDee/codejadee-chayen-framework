// Developer-only browser end-to-end fact (XF-12). Starts the fixture API on a loopback port, serves a
// small front end from a second (allowed) origin and a third (not allowed) origin, and drives a real
// Chromium-based browser through playwright-core: cookie login, an authorized call, contract fields,
// and a cross-origin call that the browser blocks although the server executed it.
//
// Usage: node e2e.mjs <node_modules with playwright-core> <CrossStackApi.dll> <browser executable>
import fs from "node:fs";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const [modules, apiDll, browserExe] = process.argv.slice(2);
const out = (status, note) => { console.log(JSON.stringify({ id: "XF-12", status, note })); };
if (!modules || !fs.existsSync(path.join(modules, "playwright-core"))) { out("NOT_RUN", "playwright-core is not available (pass --node-tools <node_modules>)"); process.exit(0); }
if (!apiDll || !fs.existsSync(apiDll)) { out("NOT_RUN", "the fixture API was not built"); process.exit(0); }
if (!browserExe || !fs.existsSync(browserExe)) { out("NOT_RUN", "no Chromium-based browser executable found (pass --browser <exe>)"); process.exit(0); }

const { chromium } = createRequire(path.join(modules, "noop.js"))("playwright-core");
const freePort = () => new Promise((resolve) => { const s = net.createServer().listen(0, "127.0.0.1", () => { const p = s.address().port; s.close(() => resolve(p)); }); });
const [apiPort, appPort, otherPort] = [await freePort(), await freePort(), await freePort()];
const api = `http://127.0.0.1:${apiPort}`;

const page = (script) => `<!doctype html><meta charset="utf-8"><title>e2e</title><pre id="result"></pre><script>${script}</script>`;
const appScript = `
const api = ${JSON.stringify(api)};
(async () => {
  const out = {};
  out.anonymous = (await fetch(api + "/api/me", { credentials: "include" })).status;
  out.login = (await fetch(api + "/login?role=user", { method: "POST", credentials: "include" })).status;
  const me = await fetch(api + "/api/me", { credentials: "include" });
  out.me = (await me.json()).name;
  const order = await (await fetch(api + "/api/orders/1", { credentials: "include" })).json();
  out.placedAtUtc = new Date(order.placedAt).toISOString();
  out.total = order.total;
  document.getElementById("result").textContent = JSON.stringify(out);
})().catch((e) => { document.getElementById("result").textContent = "error: " + e.message; });`;
const otherScript = `
fetch(${JSON.stringify(api)} + "/api/counter", { method: "POST" })
  .then(() => "readable", () => "blocked")
  .then((r) => { document.getElementById("result").textContent = r; });`;
const serve = (port, html) => new Promise((resolve) => {
  const s = http.createServer((_, res) => { res.writeHead(200, { "content-type": "text/html" }); res.end(html); }).listen(port, "127.0.0.1", () => resolve(s));
});

const apiProc = spawn("dotnet", [apiDll, "--urls", api], {
  env: { ...process.env, ASPNETCORE_ENVIRONMENT: "Production", Cors__Origin: `http://127.0.0.1:${appPort}`, Auth__ApiStatusCodes: "true", DOTNET_NOLOGO: "1" },
  stdio: "ignore",
});
const servers = [await serve(appPort, page(appScript)), await serve(otherPort, page(otherScript))];
let browser;
try {
  for (let i = 0; ; i++) {
    try { if ((await fetch(`${api}/api/counter`)).ok) break; } catch { /* not up yet */ }
    if (i > 100) throw new Error("API did not start");
    await new Promise((r) => setTimeout(r, 200));
  }
  browser = await chromium.launch({ executablePath: browserExe, headless: true });
  const ctx = await browser.newContext();
  const tab = await ctx.newPage();
  await tab.goto(`http://127.0.0.1:${appPort}/`);
  await tab.waitForFunction(() => document.getElementById("result").textContent !== "", null, { timeout: 15000 });
  const result = await tab.textContent("#result");
  const before = Number(await (await fetch(`${api}/api/counter`)).text());
  const other = await ctx.newPage();
  await other.goto(`http://127.0.0.1:${otherPort}/`);
  await other.waitForFunction(() => document.getElementById("result").textContent !== "", null, { timeout: 15000 });
  const blocked = await other.textContent("#result");
  const after = Number(await (await fetch(`${api}/api/counter`)).text());
  const r = result.startsWith("{") ? JSON.parse(result) : {};
  const ok = r.anonymous === 401 && r.login === 204 && r.me === "user" && r.placedAtUtc === "2026-01-01T03:00:00.000Z" && r.total === 19.99 && blocked === "blocked" && after === before + 1;
  out(ok ? "PASS" : "FAIL", `${browser.browserType().name()} ${browser.version()}: allowed origin ${result}; disallowed origin fetch ${blocked}, server counter ${before} -> ${after}`);
} catch (e) {
  out("FAIL", e.message);
} finally {
  await browser?.close();
  apiProc.kill();
  for (const s of servers) s.close();
}
