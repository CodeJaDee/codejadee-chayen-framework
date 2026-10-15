// Developer-only typed-client fact (XF-02): generate TypeScript types from the committed OpenAPI
// contract with openapi-typescript, type-check a small client with the TypeScript compiler, then
// regenerate from a drifted document and show the same client no longer compiles.
//
// Usage: node typed-client.mjs <node_modules dir with openapi-typescript and typescript> <committed.json> <drifted.json>
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const [modules, committed, drifted] = process.argv.slice(2);
const out = (status, note) => { console.log(JSON.stringify({ id: "XF-02", status, note })); process.exit(0); };
if (!modules || !fs.existsSync(path.join(modules, "openapi-typescript")) || !fs.existsSync(path.join(modules, "typescript")))
  out("NOT_RUN", "openapi-typescript and typescript are not available (pass --node-tools <node_modules>)");
if (!drifted || !fs.existsSync(drifted)) out("NOT_RUN", "no drifted document (the CrossStackFacts run did not produce one)");

const req = createRequire(path.join(modules, "noop.js"));
const ts = req("typescript");
const oaPkg = path.join(modules, "openapi-typescript");
const { default: openapiTS, astToString } = await import(pathToFileURL(path.join(oaPkg, JSON.parse(fs.readFileSync(path.join(oaPkg, "package.json"), "utf8")).exports["."].import ?? "dist/index.js")).href);

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "chayen-typed-client-"));
const client = `import type { components } from "./api";
type OrderDto = components["schemas"]["OrderDto"];
export async function placedAt(fetcher: (url: string) => Promise<OrderDto>): Promise<string> {
  const order = await fetcher("/api/orders/1");
  return order.placedAt;
}
export const idType: number | string = ({} as OrderDto).bigId;
`;
async function compile(doc) {
  const types = astToString(await openapiTS(new URL(pathToFileURL(path.resolve(doc)).href)));
  fs.writeFileSync(path.join(dir, "api.ts"), types);
  fs.writeFileSync(path.join(dir, "client.ts"), client);
  const program = ts.createProgram([path.join(dir, "client.ts")], { strict: true, noEmit: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler });
  const diags = ts.getPreEmitDiagnostics(program).map((d) => ts.flattenDiagnosticMessageText(d.messageText, " "));
  return { types, diags };
}
try {
  const good = await compile(committed);
  const bad = await compile(drifted);
  const bigId = /bigId:\s*([^;]+);/.exec(good.types)?.[1]?.trim();
  const ok = good.diags.length === 0 && bad.diags.some((d) => /placedAt/.test(d));
  out(ok ? "PASS" : "FAIL", `openapi-typescript ${req("openapi-typescript/package.json").version}, TypeScript ${ts.version}: committed contract compiles (bigId: ${bigId}); drifted contract fails with "${bad.diags[0] ?? "no error"}"`);
} finally { fs.rmSync(dir, { recursive: true, force: true }); }
