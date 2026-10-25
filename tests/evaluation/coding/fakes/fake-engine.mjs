#!/usr/bin/env node
// Developer-only fake container engine for the Step 16 isolation tests (D-073). It answers the three calls
// checkIsolation makes (version, image inspect, run of the boundary probe) with canned results for one
// mode, so the probe judgement can be tested without a container engine. It runs nothing it is given and
// isolates nothing; the runner accepts it only through the library, never for a real provider.
//   node fake-engine.mjs --mode <ok|no-daemon|windows|no-image|root|rootfs|egress|socket|extra-mount|canary|cred-env|no-report|wrong-mount> --log <file> <engine args...>
import fs from "node:fs";
import path from "node:path";

const [, , flag, mode, logFlag, log, ...args] = process.argv;
if (flag !== "--mode" || logFlag !== "--log") { process.stderr.write("usage: --mode <m> --log <file> <args>\n"); process.exit(2); }
fs.appendFileSync(log, JSON.stringify(args) + "\n");

if (args[0] === "version") {
  if (mode === "no-daemon") { process.stderr.write("Cannot connect to the container engine daemon\n"); process.exit(1); }
  process.stdout.write(JSON.stringify({ Client: { Version: "fake-0" }, Server: { Os: mode === "windows" ? "windows" : "linux", Version: "fake-0" } }) + "\n");
} else if (args[0] === "image") {
  if (mode === "no-image") { process.stderr.write("No such image\n"); process.exit(1); }
  process.stdout.write(JSON.stringify([args.at(-1)]) + "\n");
} else if (args[0] === "run") {
  const mounts = args.flatMap((a, i) => (args[i - 1] === "--mount" ? [Object.fromEntries(a.split(",").map((kv) => kv.split("=")))] : []));
  const ws = mounts.find((m) => m.target === "/workspace")?.source;
  const at = args.indexOf("-e") > -1 && args[args.indexOf("node") + 1] === "-e" ? args.indexOf("node") : -1;
  const [nonce, , , roJson, home] = args.slice(at + 3);
  if (mode !== "wrong-mount" && ws) fs.writeFileSync(path.join(ws, `.chayen-probe-${nonce}`), nonce);
  const report = {
    node: "v22.0.0", uid: mode === "root" ? 0 : 1000, gid: 1000, workspaceWritable: true, rootWritable: mode === "rootfs", homeWritable: true,
    readOnlyWritable: JSON.parse(roJson ?? "[]").map(() => false), engineSocket: mode === "socket", canaryVisible: mode === "canary",
    mounts: [{ target: "/", type: "overlay", ro: true }, { target: "/proc", type: "proc" }, { target: "/tmp", type: "tmpfs" }, ...mounts.map((m) => ({ target: m.target, type: "ext4", ro: "readonly" in m })),
      { target: "/etc/hosts", type: "ext4" }, ...(mode === "extra-mount" ? [{ target: "/host-home", type: "ext4" }] : [])],
    credentialEnv: mode === "cred-env" ? ["GITHUB_TOKEN"] : [], egressDenied: mode !== "egress",
  };
  if (!home) process.exit(2);
  if (mode !== "no-report") process.stdout.write(`CHAYEN-PROBE ${JSON.stringify(report)}\n`);
} else process.exit(2);
