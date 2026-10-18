// Local Codex CLI app-server inventory only. Never creates a thread or sends a model turn.
import { spawn } from "node:child_process";
import { authorize } from "./lifecycle.mjs";
authorize(process.env);
const [executable, cwd] = process.argv.slice(2);
const child = spawn(executable, ["app-server", "--listen", "stdio://"], { cwd, env: process.env, stdio: ["pipe", "pipe", "pipe"] });
const pending = new Map(); let seq = 0, buffer = "", stderr = "";
child.stderr.on("data", data => { stderr += data; });
child.stdout.on("data", data => {
  buffer += data;
  let i;
  while ((i = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, i); buffer = buffer.slice(i + 1);
    let message; try { message = JSON.parse(line); } catch { continue; }
    const waiter = pending.get(message.id);
    if (waiter) { pending.delete(message.id); message.error ? waiter.reject(new Error(JSON.stringify(message.error))) : waiter.resolve(message.result); }
  }
});
child.on("error", error => { for (const p of pending.values()) p.reject(error); });
child.on("exit", code => { for (const p of pending.values()) p.reject(new Error(`App-server exited ${code}: ${stderr}`)); });
const request = (method, params) => new Promise((resolve, reject) => {
  const id = ++seq; pending.set(id, { resolve, reject });
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
});
const timer = setTimeout(() => { for (const p of pending.values()) p.reject(new Error("App-server inventory timed out")); child.kill(); process.exitCode = 2; }, 20000);
try {
  await request("initialize", { clientInfo: { name: "chayen_lifecycle", version: "0.1.0" }, capabilities: { experimentalApi: true } });
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "initialized" }) + "\n");
  const inventory = await request("skills/list", { cwds: [cwd], forceReload: true });
  console.log(JSON.stringify(inventory));
} catch (e) { console.error(e.message); process.exitCode = 2; }
finally { clearTimeout(timer); child.stdin.end(); child.kill(); }
