// Maintainer tooling only. Downloads one pinned, checksummed workflow linter;
// never installs dependencies in the repository or calls a provider/model.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { inside, assertTreeNoLinks } from "../validate/safe-paths.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const toolchain = JSON.parse(fs.readFileSync(inside(root, "tools/ci/toolchain.json"), "utf8"));
const spec = toolchain.actionlint[`${process.platform}-${process.arch}`];
if (!spec) throw new Error("Workflow linter supports Linux x64 and Windows x64; use one of those platforms");
const parent = fs.realpathSync(os.tmpdir());
const scratch = fs.mkdtempSync(path.join(parent, "chayen-actionlint-"));
try {
  const url = `https://github.com/rhysd/actionlint/releases/download/v${toolchain.actionlint.version}/${spec.archive}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error(`actionlint download failed: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > 50 * 1024 * 1024 || crypto.createHash("sha256").update(bytes).digest("hex") !== spec.sha256) throw new Error("actionlint archive checksum/size verification failed");
  const archive = inside(scratch, spec.archive); fs.writeFileSync(archive, bytes);
  const extracted = spawnSync("tar", ["-xf", archive, "-C", scratch], { encoding: "utf8", timeout: 30_000 });
  if (extracted.status !== 0) throw new Error(`actionlint extraction failed: ${extracted.error?.message ?? extracted.stderr}`);
  assertTreeNoLinks(scratch);
  const executable = inside(scratch, process.platform === "win32" ? "actionlint.exe" : "actionlint");
  const workflowDir = inside(root, ".github/workflows"); assertTreeNoLinks(workflowDir);
  const files = fs.readdirSync(workflowDir).filter(f => /\.ya?ml$/.test(f)).map(f => inside(workflowDir, f));
  if (!files.length) throw new Error("No workflows found");
  const result = spawnSync(executable, ["-oneline", "-shellcheck=", "-pyflakes=", ...files], { cwd: root, encoding: "utf8", timeout: 30_000 });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0 || result.error || result.signal) throw new Error(`Workflow validation failed (exit ${result.status}): ${result.error?.message ?? result.signal ?? "see diagnostics"}`);
  console.log(`PASS workflow syntax: ${files.length} workflow(s), actionlint ${toolchain.actionlint.version}, archive SHA-256 verified`);
} finally {
  if (path.dirname(fs.realpathSync(scratch)) !== parent || !path.basename(scratch).startsWith("chayen-actionlint-")) throw new Error("Unexpected cleanup target");
  fs.rmSync(scratch, { recursive: true, force: true });
}
