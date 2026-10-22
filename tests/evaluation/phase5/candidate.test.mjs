// Developer-only candidate identity regressions (evolution Step 14, D-071). Builds disposable git
// repositories with the package, marketplaces, Phase 5 specifications and fixture, prepares and checks
// candidates, and exercises the runner's offline paths. No provider CLI is started and nothing is sent.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { prepareCandidate, loadCandidate, verifyAgainstCheckout, checkInstalled, checkRunCompatibility, lfFingerprint, LEGACY_CANDIDATE, CANDIDATES_DIR, SPEC_FILES } from "./candidate.mjs";
import { summarizeRouting, metadataFingerprint } from "./phase5-lib.mjs";
import { PACKAGE, DESCRIPTORS } from "../../provider-compatibility/qualify-rc.mjs";

const here = import.meta.dirname, repo = path.resolve(here, "../../..");
const RUNNER = path.join(here, "run-phase5.mjs"), TOOL = path.join(here, "candidate.mjs");
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
const git = (cwd, ...a) => spawnSync("git", ["-c", "core.autocrlf=false", "-c", "user.email=c@example.invalid", "-c", "user.name=c", ...a], { cwd, encoding: "utf8" });
const hasGit = git(repo, "--version").status === 0;
const tmp = (t, name) => { const d = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), `chayen-${name}-`)); t.after(() => fs.rmSync(d, { recursive: true, force: true })); return d; };
const write = (root, rel, text) => { const f = path.join(root, ...rel.split("/")); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };
const edit = (root, rel, from, to) => { const f = path.join(root, ...rel.split("/")), t = fs.readFileSync(f, "utf8"); assert.ok(t.includes(from), `${rel} lacks ${from}`); fs.writeFileSync(f, t.replace(from, to)); };
const SKILL = `${PACKAGE}/skills/chayen-data/SKILL.md`;
const runner = (args, env = {}) => spawnSync(process.execPath, [RUNNER, ...args], { cwd: repo, encoding: "utf8", timeout: 120_000, env: { ...process.env, ...env } });

// A committed disposable repository with only what candidate preparation reads.
function fixtureRepo(t) {
  const root = tmp(t, "candidate-repo"), skip = new Set(["bin", "obj", "node_modules", ".git"]);
  for (const rel of [PACKAGE, ...DESCRIPTORS, ...Object.values(SPEC_FILES).map((f) => `tests/evaluation/phase5/${f}`), "tests/evaluation/fixture"])
    fs.cpSync(path.join(repo, rel), path.join(root, rel), { recursive: true, filter: (s) => !skip.has(path.basename(s)) });
  assert.equal(git(root, "init", "-q").status, 0);
  git(root, "add", "-A");
  assert.equal(git(root, "commit", "-qm", "candidate fixture").status, 0);
  return root;
}
// An isolated provider home holding one copy of a package, in a nested cache layout.
function homeWith(t, pkgDir) {
  const home = tmp(t, "home");
  if (pkgDir) fs.cpSync(pkgDir, path.join(home, "plugins", "cache", "codejadee", "chayen", "1"), { recursive: true });
  return home;
}
// A PATH holding only git's directory, when that directory has no provider CLI: preflight may run
// read-only git, and a provider CLI could not be started even by mistake.
function gitOnlyPath(t) {
  const names = process.platform === "win32" ? ["git.exe"] : ["git"];
  const dir = (process.env.PATH ?? "").split(path.delimiter).find((d) => d && names.some((n) => fs.existsSync(path.join(d, n))));
  if (!dir) return null;
  const providers = ["claude", "codex", "copilot"].flatMap((p) => [p, `${p}.exe`, `${p}.cmd`]);
  if (providers.some((p) => fs.existsSync(path.join(dir, p)))) return null;
  return dir;
}
function saved(t, cand) { const f = path.join(tmp(t, "cand"), "candidate.json"); fs.writeFileSync(f, JSON.stringify(cand, null, 2)); return f; }

test("exact candidate accepted: a clean commit, the checkout and an installed copy all match", { skip: !hasGit }, (t) => {
  const root = fixtureRepo(t), cand = prepareCandidate(root);
  assert.equal(cand.source.workingTree, "clean");
  assert.equal(cand.source.qualification, "COMMITTED_SOURCE");
  assert.equal(cand.source.commit, git(root, "rev-parse", "HEAD").stdout.trim());
  assert.equal(cand.skills.count, cand.skills.inventory.length);
  assert.equal(cand.skills.metadataFingerprint, metadataFingerprint(path.join(repo, PACKAGE)));
  for (const s of Object.keys(SPEC_FILES)) assert.match(cand.specs[s].sha256, /^[0-9a-f]{64}$/);
  assert.deepEqual(cand.providers.map((p) => p.provider), ["claude", "codex", "copilot"]);
  const loaded = loadCandidate(saved(t, cand));
  assert.deepEqual(verifyAgainstCheckout(loaded, root), []);
  assert.deepEqual(checkInstalled(loaded, homeWith(t, path.join(root, PACKAGE)), "plugin").errors, []);
});

test("wrong version rejected, in the installed package and in the checkout", { skip: !hasGit }, (t) => {
  const root = fixtureRepo(t), cand = loadCandidate(saved(t, prepareCandidate(root)));
  const copy = path.join(tmp(t, "pkg"), "chayen");
  fs.cpSync(path.join(root, PACKAGE), copy, { recursive: true });
  edit(copy, "plugin.json", `"version": "${cand.version}"`, '"version": "9.9.9"');
  assert.ok(checkInstalled(cand, homeWith(t, copy), "plugin").errors.some((e) => /^wrong version: installed 9\.9\.9/.test(e)));
  edit(root, `${PACKAGE}/plugin.json`, `"version": "${cand.version}"`, '"version": "9.9.9"');
  assert.ok(verifyAgainstCheckout(cand, root).some((e) => /^wrong version: checkout 9\.9\.9/.test(e)));
});

test("wrong package fingerprint rejected when only content differs", { skip: !hasGit }, (t) => {
  const root = fixtureRepo(t), cand = loadCandidate(saved(t, prepareCandidate(root)));
  const copy = path.join(tmp(t, "pkg"), "chayen");
  fs.cpSync(path.join(root, PACKAGE), copy, { recursive: true });
  fs.appendFileSync(path.join(copy, "skills", "chayen-data", "references", "database-safety.md"), "\nChanged after the candidate.\n");
  const errors = checkInstalled(cand, homeWith(t, copy), "plugin").errors;
  assert.equal(errors.length, 1);
  assert.match(errors[0], /^wrong package fingerprint/);
});

test("changed metadata detected in the checkout and in an installed package", { skip: !hasGit }, (t) => {
  const root = fixtureRepo(t), cand = loadCandidate(saved(t, prepareCandidate(root)));
  const copy = path.join(tmp(t, "pkg"), "chayen");
  fs.cpSync(path.join(root, PACKAGE), copy, { recursive: true });
  edit(copy, "skills/chayen-data/SKILL.md", "description: ", "description: Changed. ");
  assert.ok(checkInstalled(cand, homeWith(t, copy), "plugin").errors.some((e) => /^changed metadata/.test(e)));
  edit(root, SKILL, "description: ", "description: Changed. ");
  const drift = verifyAgainstCheckout(cand, root);
  assert.ok(drift.some((e) => /^changed metadata/.test(e)) && drift.some((e) => /package content differs/.test(e)));
  assert.notEqual(prepareCandidate(root).candidateId, cand.id);
  fs.appendFileSync(path.join(root, "tests", "evaluation", "phase5", SPEC_FILES.routing), "\n");
  fs.appendFileSync(path.join(root, "tests", "evaluation", "fixture", "README.md"), "\nchanged\n");
  const later = verifyAgainstCheckout(cand, root);
  assert.ok(later.some((e) => /test specification routing differs/.test(e)) && later.some((e) => /evaluation fixture differs/.test(e)));
});

test("a different provider configuration or candidate is never silently pooled", () => {
  const spec = { probes: Array.from({ length: 3 }, (_, i) => ({ id: `q${i}`, type: "positive", primary: "chayen-data", expect: { any_of: ["chayen-data"] } })) };
  const rec = (id, extra = {}) => ({ provider: "claude", cliVersion: "1", model: "m", modelConfig: "pinned", packageFingerprint: "f", metadataFingerprint: "m", specHash: "s", candidateId: "c1", arm: "plugin", promptId: id, run: 1, attempt: 1, pass: true, wrongSkill: false, classification: "CORRECT", ...extra });
  const same = spec.probes.map((p) => rec(p.id));
  assert.doesNotThrow(() => summarizeRouting(same, spec));
  for (const extra of [{ candidateId: "c2" }, { model: "other-model" }, { cliVersion: "2" }, { packageFingerprint: "g" }, { specHash: "t" }])
    assert.throws(() => summarizeRouting([...same.slice(1), rec("q0", extra)], spec), /pool configurations/, JSON.stringify(extra));
  assert.throws(() => summarizeRouting([...same.slice(1), rec("q0", { provider: "codex" })], spec), /pool providers/);
});

test("historical 0.1.0-rc.1 evidence is unchanged and reproducible from its commit", (t) => {
  // LF-normalised fingerprints of the historical folders as committed before evolution Step 14.
  assert.deepEqual(lfFingerprint(path.join(repo, "tests/evaluation/phase5/results/2026-10-18-phase5")), { sha256: "a4fa2aebb7f181b7a18101ac1893ac2e5ad3be0d26532cbecdb90b20a9c85316", files: 9 });
  assert.deepEqual(lfFingerprint(path.join(repo, "tests/provider-compatibility/results/2026-10-18-rc1")), { sha256: "48479fed09f06eaed92ed14eb5d861fe31d2522fe849fbbde9874ce020c3c8b9", files: 9 });
  const legacy = loadCandidate(path.join(repo, LEGACY_CANDIDATE));
  assert.equal(legacy.kind, "historical");
  assert.equal(legacy.version, "0.1.0-rc.1");
  assert.equal(legacy.metadataFingerprint, "339b3125d1347648");
  assert.ok(legacy.accepted.has("efc4c6e6567a4ce3bb0b2733d4bbe6194677b9cf0d77c47b26f6959b55fcd85d"));
  assert.ok(verifyAgainstCheckout(legacy, repo).some((e) => /reproduce it from commit 38570b3/.test(e)), "the historical candidate never passes for the current checkout");
  const commit = legacy.commit;
  if (!hasGit || git(repo, "cat-file", "-e", `${commit}^{commit}`).status !== 0) return t.skip("historical commit not available (shallow clone)");
  // Recompute the committed-blob package and metadata fingerprints at the candidate commit, and the
  // spec hashes at the commit that recorded the historical plan (the harness was committed after the package).
  const blobsAt = (rev, paths) => {
    const out = spawnSync("git", ["cat-file", "--batch"], { cwd: repo, input: paths.map((p) => `${rev}:${p}`).join("\n") + "\n", maxBuffer: 64 * 1024 * 1024 }).stdout, map = new Map();
    let pos = 0;
    for (const p of paths) {
      const nl = out.indexOf(10, pos), header = out.subarray(pos, nl).toString();
      assert.ok(!header.endsWith("missing"), `${p} is missing at ${rev}`);
      const size = Number(header.split(" ")[2]);
      map.set(p, out.subarray(nl + 1, nl + 1 + size)); pos = nl + 1 + size + 1;
    }
    return map;
  };
  const list = git(repo, "ls-tree", "-r", "--name-only", commit, `${PACKAGE}/`).stdout.split("\n").filter(Boolean);
  const blobs = blobsAt(commit, list);
  const planCommit = git(repo, "log", "--diff-filter=A", "--format=%H", "--", "tests/evaluation/phase5/results/2026-10-18-phase5/plan.json").stdout.trim().split("\n").pop();
  const specBlobs = blobsAt(planCommit, Object.values(SPEC_FILES).map((f) => `tests/evaluation/phase5/${f}`));
  const files = list.map((p) => [p.slice(PACKAGE.length + 1), sha(blobs.get(p))]).sort((a, b) => (a[0] < b[0] ? -1 : 1));
  assert.equal(files.length, 256);
  // The committed blobs reproduce the candidate's recorded LF-normalised content fingerprint. (Its
  // "git archive" byte fingerprint efc4c6e… depends on archive conversion and is not recomputed here.)
  assert.equal(sha(files.map(([f, h]) => `${f}\0${h}\n`).join("")), legacy.data.contentFingerprintLfNormalized.committed);
  assert.equal(legacy.data.contentFingerprintLfNormalized.committed, "d5e9a80e505b2411e7e4e732ab98102bb45563608d6a915da7b25c8655603626");
  const meta = crypto.createHash("sha256");
  for (const name of legacy.skills) meta.update(`${name}\0${/^description:\s*(.*)$/m.exec(blobs.get(`${PACKAGE}/skills/${name}/SKILL.md`).toString())[1].trim()}\0`);
  assert.equal(meta.digest("hex").slice(0, 16), "339b3125d1347648");
  const plan = JSON.parse(fs.readFileSync(path.join(repo, "tests/evaluation/phase5/results/2026-10-18-phase5/plan.json"), "utf8"));
  for (const [suite, file] of Object.entries(SPEC_FILES)) assert.equal(sha(specBlobs.get(`tests/evaluation/phase5/${file}`).toString().replace(/\r\n/g, "\n")).slice(0, 16), plan.find((r) => r.suite === suite).specHash, suite);
});

test("a dirty snapshot is labelled, lists its paths and is never treated as a committed freeze", { skip: !hasGit }, (t) => {
  const root = fixtureRepo(t);
  write(root, "tests/evaluation/fixture/NOTES.md", "uncommitted\n");
  let c = prepareCandidate(root);
  assert.equal(c.source.workingTree, "dirty");
  assert.equal(c.source.qualification, "UNCOMMITTED_SNAPSHOT");
  assert.match(c.source.note, /not a release-qualified commit/);
  assert.deepEqual(c.source.dirtyPaths, ["tests/evaluation/fixture/NOTES.md"]);
  assert.equal(c.source.packageMatchesCommit, true);
  fs.appendFileSync(path.join(root, ...SKILL.split("/")), "\n");
  c = prepareCandidate(root);
  assert.equal(c.source.packageMatchesCommit, false);
  write(root, `${CANDIDATES_DIR}/kept.json`, "{}\n");
  assert.ok(!prepareCandidate(root).source.dirtyPaths.some((p) => p.startsWith(CANDIDATES_DIR)), "candidate manifests never make the tree dirty");
  // The runner refuses an uncommitted snapshot for live runs without the explicit flag; nothing is sent.
  const home = homeWith(t, null), r = runner(["--suite", "routing", "--provider", "claude", "--arm", "baseline", "--allow-provider-calls", "--authorization", "TEST-ONLY", "--max-calls", "1", "--only", "none", "--out", path.join(tmp(t, "out"), "run"), "--candidate", saved(t, c)], { CLAUDE_CONFIG_DIR: home, PATH: tmp(t, "emptybin") });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /UNCOMMITTED_SNAPSHOT, not a release-qualified commit/);
});

test("the baseline arm requires a home without any installed Chayen package", { skip: !hasGit }, (t) => {
  const root = fixtureRepo(t), cand = loadCandidate(saved(t, prepareCandidate(root)));
  assert.deepEqual(checkInstalled(cand, homeWith(t, null), "baseline").errors, []);
  assert.match(checkInstalled(cand, homeWith(t, path.join(root, PACKAGE)), "baseline").errors[0], /without any chayen installation; found 1/);
  const two = homeWith(t, path.join(root, PACKAGE));
  fs.cpSync(path.join(root, PACKAGE), path.join(two, "other", "chayen"), { recursive: true });
  assert.match(checkInstalled(cand, two, "plugin").errors[0], /exactly one installed chayen package; found 2/);
});

test("preparation is deterministic and an edited manifest is refused", { skip: !hasGit }, (t) => {
  const root = fixtureRepo(t);
  const a = prepareCandidate(root, { preparedAt: "x" }), b = prepareCandidate(root, { preparedAt: "x" });
  assert.deepEqual(a, b);
  const file = saved(t, { ...a, plugin: { ...a.plugin, version: "9.9.9" } });
  assert.throws(() => loadCandidate(file), /candidateId does not match/);
  assert.throws(() => loadCandidate(saved(t, { ...a, extra: true })), /format is closed/);
  assert.deepEqual(prepareCandidate(root, { providers: ["claude"] }).providers.map((p) => p.provider), ["claude"]);
});

test("stale or incompatible results are rejected", { skip: !hasGit }, (t) => {
  const root = fixtureRepo(t), file = saved(t, prepareCandidate(root)), cand = loadCandidate(file);
  const run = { suite: "routing", arm: "plugin", candidateId: cand.id, metadataFingerprint: cand.metadataFingerprint, packageFingerprint: [...cand.accepted][0], specHash: cand.specs.routing.sha256 };
  assert.deepEqual(checkRunCompatibility(run, cand), []);
  assert.match(checkRunCompatibility({ ...run, candidateId: "0000000000000000" }, cand)[0], /recorded against candidate 0000000000000000/);
  assert.match(checkRunCompatibility({ ...run, specHash: "0".repeat(64) }, cand)[0], /specification the candidate does not record/);
  assert.match(checkRunCompatibility({ ...run, metadataFingerprint: "339b3125d1347648" }, cand)[0], /metadata fingerprint/);
  assert.match(checkRunCompatibility({ ...run, packageFingerprint: "0".repeat(64) }, cand)[0], /package the candidate does not accept/);
  assert.match(checkRunCompatibility({ ...run, arm: "baseline" }, cand)[0], /baseline results carry an installed package/);
  // The runner refuses to score results recorded against another candidate.
  const dir = tmp(t, "results"), specHash = sha(fs.readFileSync(path.join(here, SPEC_FILES.routing), "utf8").replace(/\r\n/g, "\n"));
  fs.writeFileSync(path.join(dir, "run.json"), JSON.stringify({ phase: 5, suite: "routing", provider: "claude", arm: "baseline", specHash, candidateId: "0000000000000000", metadataFingerprint: cand.metadataFingerprint, packageFingerprint: null }));
  fs.writeFileSync(path.join(dir, "records.jsonl"), JSON.stringify({ promptId: "x", run: 1, attempt: 1, candidateId: "0000000000000000" }) + "\n");
  let r = runner(["--score", dir]);
  assert.equal(r.status, 2); assert.match(r.stderr, /--candidate <manifest> required/);
  r = runner(["--score", dir, "--candidate", file]);
  assert.equal(r.status, 2); assert.match(r.stderr, /Stale or incompatible results/);
  assert.ok(!fs.existsSync(path.join(dir, "summary.json")));
});

test("runner preflight is offline and checks the selected candidate, the checkout and the home", { skip: !hasGit }, (t) => {
  const file = saved(t, prepareCandidate(repo));
  const empty = gitOnlyPath(t);
  if (!empty) return t.skip("git shares a directory with a provider CLI; PATH cannot exclude providers");
  let r = runner(["--preflight", "--candidate", file, "--provider", "claude", "--arm", "baseline", "--home", homeWith(t, null)], { PATH: empty });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /PASS {2}checkout matches the candidate/);
  assert.match(r.stdout, /no provider CLI was started and nothing was sent/);
  const copy = path.join(tmp(t, "pkg"), "chayen");
  fs.cpSync(path.join(repo, PACKAGE), copy, { recursive: true });
  edit(copy, "plugin.json", '"version": "', '"version": "0.0.0-');
  r = runner(["--preflight", "--candidate", file, "--provider", "claude", "--arm", "plugin", "--home", homeWith(t, copy)], { PATH: empty });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /FAIL {2}claude plugin home: wrong version/);
  r = runner(["--preflight", "--candidate", path.join(repo, LEGACY_CANDIDATE)], { PATH: empty });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /HISTORICAL/);
  r = runner(["--plan", "--candidate", file, "--suite", "routing"]);
  assert.equal(r.status, 0); assert.match(r.stdout, /PLAN {2}candidate [0-9a-f]{16}/);
  r = runner(["--suite", "routing", "--provider", "claude", "--arm", "baseline", "--allow-provider-calls", "--authorization", "TEST-ONLY", "--max-calls", "1", "--only", "none", "--out", path.join(tmp(t, "out"), "run")], { CLAUDE_CONFIG_DIR: homeWith(t, null), PATH: empty });
  assert.equal(r.status, 2); assert.match(r.stderr, /there is no default candidate/);
});

test("candidate preparation runs only read-only git and writes only a new file outside history", (t) => {
  const src = fs.readFileSync(TOOL, "utf8");
  for (const banned of [/node:(?:net|http|https|dgram|tls)/, /\bfetch\s*\(/, /\beval\s*\(/, /\bexecSync|\bexecFile/]) assert.doesNotMatch(src, banned, String(banned));
  assert.deepEqual([...src.matchAll(/spawnSync\("([^"]+)"/g)].map((m) => m[1]), ["git"]);
  assert.deepEqual([...new Set([...src.matchAll(/git\(repo, \["([a-z-]+)"/g)].map((m) => m[1]))].sort(), ["diff", "rev-parse", "status"]);
  assert.equal([...src.matchAll(/writeFileSync\(/g)].length, 1);
  assert.match(src, /flag: "wx"/);
  const before = fs.readFileSync(path.join(repo, LEGACY_CANDIDATE));
  const r = spawnSync(process.execPath, [TOOL, "prepare", "--out", path.join(repo, LEGACY_CANDIDATE)], { cwd: repo, encoding: "utf8" });
  assert.equal(r.status, 2);
  assert.deepEqual(fs.readFileSync(path.join(repo, LEGACY_CANDIDATE)), before);
});
