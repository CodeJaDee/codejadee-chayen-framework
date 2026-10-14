#!/usr/bin/env node
// Developer-only: optional existing React/Next packages, plus executable
// synthetic Web-standard server-boundary fixtures. No installs or downloads.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { once } from "node:events";
import { createBoundaries } from "./fixture/server-boundaries.mjs";

const FACTS = {
  "RF-01": ["react-component-patterns", "React server markup preserves a component's explicit props and escapes untrusted text"],
  "RF-02": ["react-state-effects", "Effect dependency changes, queued state, and unmount cleanup require the configured DOM/browser runner"],
  "RF-03": ["react-server-state", "Query invalidation, cancellation, and account isolation require the installed query layer and configured runner"],
  "RF-04": ["react-form-handling", "React server markup preserves controlled form value, label, and error association"],
  "RF-05": ["react-routing", "Deep-link/history behavior requires the installed router and host/browser fixture"],
  "RF-06": ["react-render-optimization", "Render improvement requires a reproducible profiler baseline and measured interaction"],
  "RF-07": ["react-component-testing", "User interactions and async assertions require the project's configured runner and DOM/browser setup"],
  "RF-08": ["react-accessibility", "React static markup preserves button semantics; keyboard and focus checks remain separate"],
  "NF-01": ["nextjs-app-router", "Segment navigation and async request props require a version-matched compiled Next fixture"],
  "NF-02": ["nextjs-server-client-boundary", "Forbidden imports and secret-sentinel bundle/RSC checks require a production Next build"],
  "NF-03": ["nextjs-server-functions", "Synthetic callable entrypoint rejects unauthorized or malformed calls before writing; not a compiled Server Action"],
  "NF-04": ["nextjs-route-handlers", "Synthetic Web Request/Response handler validates JSON and response/method contracts; not a Next route build"],
  "NF-05": ["nextjs-data-caching", "Next cache reuse, invalidation, and cross-user isolation require a production version/config-matched fixture"],
  "NF-06": ["nextjs-authentication", "Synthetic direct loopback HTTP boundary rejects anonymous, expired, revoked, forbidden and wrong-tenant access before writing"],
  "NF-07": ["nextjs-rendering-seo", "Production metadata, status, prerendering, and hydration require a compiled Next/browser fixture"],
  "NF-08": ["nextjs-deployment-testing", "Built-artifact start/output/adapter behavior requires the configured production artifact and runtime"],
};
const args = process.argv.slice(2);
const option = name => args.includes(name) ? args[args.indexOf(name) + 1] : null;
const results = [];
const record = (id, status, note) => results.push({ id, capability: FACTS[id][0], status, note });
const check = async (id, action) => { try { await action(); record(id, "PASS", FACTS[id][1]); } catch (error) { record(id, "FAIL", error.message); } };
const versions = { node: process.version, react: "unavailable", next: "unavailable" };
let react = null, serverRender = null;
if (option("--deps")) {
  const req = createRequire(path.join(path.resolve(option("--deps")), "../package.json"));
  try { react = req("react"); serverRender = req("react-dom/server"); versions.react = react.version; }
  catch (error) { console.error(`React packages unavailable: ${error.message}`); }
  try { versions.next = req("next/package.json").version; } catch { /* optional installed-version evidence only */ }
}
for (const id of ["RF-01", "RF-04", "RF-08"]) {
  if (!react || !serverRender) { record(id, "NOT_RUN", "No existing compatible React/ReactDOM dependency fixture supplied."); continue; }
  await check(id, () => {
    const element = react.createElement;
    if (id === "RF-01") {
      const Card = ({ title }) => element("button", { type: "button" }, title);
      const html = serverRender.renderToStaticMarkup(element(Card, { title: "<script>untrusted</script>" }));
      assert.match(html, /&lt;script&gt;/); assert.ok(!html.includes("<script>")); assert.match(html, /type="button"/);
    } else if (id === "RF-04") {
      const html = serverRender.renderToStaticMarkup(element("form", null,
        element("label", { htmlFor: "name" }, "Name"),
        element("input", { id: "name", name: "name", value: "Ada", onChange() {}, "aria-describedby": "name-error" }),
        element("p", { id: "name-error" }, "Required")));
      assert.match(html, /value="Ada"/); assert.match(html, /for="name"/); assert.match(html, /aria-describedby="name-error"/);
    } else {
      const html = serverRender.renderToStaticMarkup(element("button", { type: "button", "aria-expanded": false, "aria-controls": "details" }, "Details"));
      assert.match(html, /<button/); assert.match(html, /aria-expanded="false"/); assert.match(html, />Details<\/button>/);
    }
  });
}
for (const id of ["RF-02", "RF-03", "RF-05", "RF-06", "RF-07", "NF-01", "NF-02", "NF-05", "NF-07", "NF-08"]) record(id, "NOT_RUN", FACTS[id][1]);

const request = (session, body, method = "POST") => new Request("http://127.0.0.1/fixture/orders", {
  method, headers: { ...(session ? { cookie: `fixture-session=${session}` } : {}), "Content-Type": "application/json" },
  ...(method === "POST" ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}),
});
const valid = { id: "order-1", name: "Changed" };
await check("NF-03", async () => {
  const fixture = createBoundaries(); const form = new FormData(); form.set("id", "order-1"); form.set("name", "Changed"); form.set("owner", "bob");
  for (const [session, status] of [[null, 401], ["missing-session", 401], ["fixture-expired", 401], ["fixture-bob", 403], ["fixture-other-tenant", 403]]) {
    assert.equal((await fixture.action(request(session, valid), form)).status, status); assert.equal(fixture.writeCount(), 0);
  }
  form.set("name", ""); assert.equal((await fixture.action(request("fixture-alice", valid), form)).status, 400); assert.equal(fixture.writeCount(), 0);
  form.set("name", "Changed"); const result = await fixture.action(request("fixture-alice", valid), form);
  assert.equal(result.status, 200); assert.equal(fixture.writeCount(), 1); assert.deepEqual(Object.keys(result.body).sort(), ["id", "name"]);
});
await check("NF-04", async () => {
  const fixture = createBoundaries();
  const malformed = await fixture.handler(request("fixture-alice", "{")); assert.equal(malformed.status, 400);
  const wrongMethod = await fixture.handler(request("fixture-alice", null, "GET")); assert.equal(wrongMethod.status, 405); assert.equal(wrongMethod.headers.get("allow"), "POST");
  const invalid = await fixture.handler(request("fixture-alice", { ...valid, name: "" })); assert.equal(invalid.status, 400); assert.equal(fixture.writeCount(), 0);
  const response = await fixture.handler(request("fixture-alice", valid)); assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { id: "order-1", name: "Changed" }); assert.equal(response.headers.get("cache-control"), "private, no-store");
});
await check("NF-06", async () => {
  const fixture = createBoundaries();
  const server = createServer(async (incoming, outgoing) => {
    try {
      const chunks = []; for await (const chunk of incoming) chunks.push(chunk);
      const body = Buffer.concat(chunks).toString();
      const req = new Request(`http://127.0.0.1${incoming.url}`, { method: incoming.method, headers: incoming.headers, ...(body ? { body } : {}) });
      const response = await fixture.handler(req);
      outgoing.writeHead(response.status, Object.fromEntries(response.headers)); outgoing.end(await response.text());
    } catch { outgoing.writeHead(500); outgoing.end("fixture_error"); }
  });
  server.listen(0, "127.0.0.1"); await once(server, "listening");
  try {
    const url = `http://127.0.0.1:${server.address().port}/fixture/orders`;
    for (const [session, status] of [[null, 401], ["missing-session", 401], ["fixture-expired", 401], ["fixture-bob", 403], ["fixture-other-tenant", 403]]) {
      const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", ...(session ? { cookie: `fixture-session=${session}` } : {}) }, body: JSON.stringify({ ...valid, owner: "alice", role: "admin" }), signal: AbortSignal.timeout(5000) });
      assert.equal(response.status, status); await response.text(); assert.equal(fixture.writeCount(), 0);
    }
    const allowed = await fetch(url, { method: "POST", headers: { cookie: "fixture-session=fixture-alice", "Content-Type": "application/json" }, body: JSON.stringify(valid), signal: AbortSignal.timeout(5000) });
    assert.equal(allowed.status, 200); await allowed.text(); assert.equal(fixture.writeCount(), 1);
    fixture.revoke("fixture-alice"); const revoked = await fetch(url, { method: "POST", headers: { cookie: "fixture-session=fixture-alice", "Content-Type": "application/json" }, body: JSON.stringify(valid), signal: AbortSignal.timeout(5000) });
    assert.equal(revoked.status, 401); await revoked.text(); assert.equal(fixture.writeCount(), 1);
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});

results.sort((a, b) => a.id.localeCompare(b.id));
const counts = Object.fromEntries(["PASS", "FAIL", "NOT_RUN"].map(status => [status, results.filter(r => r.status === status).length]));
for (const result of results) console.log(`${result.status} ${result.id} ${result.capability}: ${result.note}`);
console.log(JSON.stringify({ versions, counts }));
const reportPath = option("--report");
if (reportPath) {
  const command = ["node tests/technology/react-nextjs/run-fact-checks.mjs", ...args.map(arg => /\s/.test(arg) ? JSON.stringify(arg) : arg)].join(" ");
  const text = `# Step 22 fact and boundary checks\n\nDate: 2026-10-15. Command: \`${command}\`.\n\nVersions: ${JSON.stringify(versions)}.\n\n${counts.PASS} PASS, ${counts.FAIL} FAIL, ${counts.NOT_RUN} NOT_RUN.\n\nNF-03/04/06 are synthetic JavaScript/Web-standard boundary checks, not Next framework, compiled Server Action, provider-session, or deployment verification. React static markup facts, when available, do not establish browser behavior. Missing framework/browser/production fixtures remain NOT_RUN. No agent behavior or trigger evaluation ran.\n\n| Fact | Capability | Result | Evidence / limit |\n|---|---|---|---|\n${results.map(r => `| ${r.id} | ${r.capability} | ${r.status} | ${r.note.replace(/\|/g, "/").replace(/\n/g, " ")} |`).join("\n")}\n`;
  fs.mkdirSync(path.dirname(path.resolve(reportPath)), { recursive: true }); fs.writeFileSync(reportPath, text);
}
process.exitCode = counts.FAIL ? 1 : 0;
