#!/usr/bin/env node
// Developer-only evaluation candidate manifests (evolution Step 14, D-071). Prepares a deterministic
// `chayen-eval-candidate/1` manifest for the checked-out revision, verifies a manifest against the
// checkout, an isolated provider home and recorded results, and reads the historical Phase 5 candidate
// (0.1.0-rc.1) unchanged. It reads files and runs read-only `git rev-parse` and `git status`; it never
// starts a provider CLI, calls a model, commits, tags or pushes. Never shipped with the plugin.
//
// Usage:
//   node tests/evaluation/phase5/candidate.mjs prepare --out <new file> [--providers claude,codex,copilot]
//   node tests/evaluation/phase5/candidate.mjs verify --candidate <file>
// Runner use: run-phase5.mjs --preflight | --plan | live runs | --score, each with --candidate <file>.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fingerprint, PACKAGE, DESCRIPTORS } from "../../provider-compatibility/qualify-rc.mjs";
import { metadataFingerprint, PROVIDERS, SUITES } from "./phase5-lib.mjs";

export const SCHEMA = "chayen-eval-candidate/1";
export const LEGACY_CANDIDATE = "tests/evaluation/phase5/results/2026-10-18-phase5/candidate.json";
export const FIXTURE = "tests/evaluation/fixture";
// Committed candidate manifests live here; they describe the tree and never make it dirty or stale.
export const CANDIDATES_DIR = "tests/evaluation/phase5/candidates";
export const SPEC_FILES = { routing: "routing-probes.json", humanizer: "humanizer-subset.json", capability: "capability-sample.json", security: "security-cases.json" };
export const HOME_ENV = { claude: "CLAUDE_CONFIG_DIR", codex: "CODEX_HOME", copilot: "COPILOT_HOME" };
// The invocation the runner uses per provider (run-phase5.mjs argsFor); native permissions only.
export const INVOCATION = {
  claude: "claude -p --setting-sources user --allowedTools Read,Glob,Grep,Skill --output-format stream-json --max-turns 12",
  codex: "codex exec --json --ephemeral -s read-only",
  copilot: "copilot -p --output-format json (default tool approval)",
};
const QUALIFICATION = { clean: "COMMITTED_SOURCE", dirty: "UNCOMMITTED_SNAPSHOT" };

const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
const lf = (buf) => Buffer.from(buf.toString("utf8").replace(/\r\n/g, "\n"), "utf8");
const readJson = (f) => JSON.parse(fs.readFileSync(f, "utf8"));

// Package and tree fingerprints with line endings normalised, so a CRLF working tree and an LF
// checkout of the same content agree. The raw-bytes form is fingerprint() from qualify-rc.mjs.
export function lfFingerprint(dir, skip = new Set()) {
  const files = [];
  (function walk(d, rel) {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (e.isSymbolicLink()) throw new Error(`linked path in fingerprinted tree: ${rel}${e.name}`);
      if (skip.has(e.name)) continue;
      if (e.isDirectory()) walk(path.join(d, e.name), `${rel}${e.name}/`);
      else files.push([`${rel}${e.name}`, sha(lf(fs.readFileSync(path.join(d, e.name))))]);
    }
  })(dir, "");
  files.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return { sha256: sha(files.map(([f, h]) => `${f}\0${h}\n`).join("")), files: files.length };
}

function git(repo, args) {
  const r = spawnSync("git", ["-c", "core.quotepath=false", ...args], { cwd: repo, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`git ${args[0]} failed: ${(r.stderr ?? "").trim().slice(0, 200)}`);
  return r.stdout;
}

// Installed chayen packages under an isolated home (identity: root manifest name).
export function installedPackages(home) {
  const found = [];
  const walk = (d, depth) => {
    if (depth > 9) return;
    let entries; try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    if (entries.some((e) => e.name === "plugin.json" && e.isFile()) && entries.some((e) => e.name === "skills" && e.isDirectory())) {
      try { if (JSON.parse(fs.readFileSync(path.join(d, "plugin.json"), "utf8")).name === "chayen") { found.push(d); return; } } catch { /* not a manifest */ }
    }
    for (const e of entries) if (e.isDirectory() && !e.isSymbolicLink() && e.name !== "node_modules" && e.name !== ".git") walk(path.join(d, e.name), depth + 1);
  };
  walk(home, 0);
  return found;
}

// Deterministic for a given tree: everything except preparedAt is a function of the files and the
// git state, and candidateId covers only line-ending-independent fields.
export function prepareCandidate(repo, { providers = PROVIDERS, preparedAt = new Date().toISOString() } = {}) {
  if (!providers.length || providers.some((p) => !PROVIDERS.includes(p))) throw new Error(`providers must be a subset of ${PROVIDERS.join(", ")}`);
  const plugin = path.join(repo, PACKAGE);
  const manifest = readJson(path.join(plugin, "plugin.json"));
  const claudeManifest = readJson(path.join(plugin, ".claude-plugin", "plugin.json"));
  const inventory = fs.readdirSync(path.join(plugin, "skills")).filter((n) => fs.existsSync(path.join(plugin, "skills", n, "SKILL.md"))).sort();
  const commit = git(repo, ["rev-parse", "HEAD"]).trim();
  const dirtyPaths = git(repo, ["status", "--porcelain=v1", "--untracked-files=all"]).split("\n").filter(Boolean)
    .map((l) => l.slice(3).replace(/^"|"$/g, "").split(" -> ").pop()).filter((p) => !p.startsWith(`${CANDIDATES_DIR}/`)).sort();
  const state = dirtyPaths.length ? "dirty" : "clean";
  const packageDirty = dirtyPaths.some((p) => p === PACKAGE || p.startsWith(`${PACKAGE}/`) || DESCRIPTORS.includes(p));
  const raw = fingerprint(plugin), norm = lfFingerprint(plugin);
  const specs = Object.fromEntries(SUITES.map((s) => { const rel = `tests/evaluation/phase5/${SPEC_FILES[s]}`; return [s, { file: rel, sha256: sha(lf(fs.readFileSync(path.join(repo, rel)))) }]; }));
  const fixture = { path: FIXTURE, ...lfFingerprint(path.join(repo, FIXTURE), new Set(["bin", "obj", "node_modules", ".git"])) };
  const marketplaces = DESCRIPTORS.map((file) => { const m = readJson(path.join(repo, file)); return { file, name: m.name, pluginVersion: m.plugins?.[0]?.version ?? null, sha256: sha(lf(fs.readFileSync(path.join(repo, file)))) }; });
  const body = {
    source: {
      commit, workingTree: state, dirtyPaths, packageMatchesCommit: !packageDirty,
      qualification: QUALIFICATION[state],
      note: state === "clean" ? "Prepared from a clean checkout of the commit above." : "UNCOMMITTED SNAPSHOT of the working tree on top of the commit above. It is not a release-qualified commit; results against it never qualify a release.",
    },
    plugin: { name: manifest.name, version: manifest.version, claudeManifestVersion: claudeManifest.version, marketplaces },
    package: {
      path: PACKAGE, files: norm.files, contentLfSha256: norm.sha256,
      acceptedFingerprints: [...new Map([[raw.sha256, "working-tree bytes as checked out here"], [norm.sha256, "LF-normalised bytes (committed blobs; non-autocrlf clones and remote installs)"]]).entries()].map(([sha256, bytes]) => ({ sha256, bytes })),
    },
    skills: { count: inventory.length, inventory, metadataFingerprint: metadataFingerprint(plugin) },
    specs, fixture,
    providers: providers.map((p) => ({ provider: p, homeEnv: HOME_ENV[p], invocation: INVOCATION[p], arms: { plugin: "exactly one installed chayen package, with an accepted fingerprint, this version and this metadata fingerprint", baseline: "no chayen package installed" }, model: "recorded per run: --model when pinned, otherwise host default (unpinned)", cliVersion: "recorded per run" })),
  };
  const idBasis = { ...body, package: { ...body.package, acceptedFingerprints: undefined } };
  return { $schema: SCHEMA, candidateId: sha(JSON.stringify(idBasis)).slice(0, 16), preparedAt, ...body };
}

const KEYS = ["$schema", "candidateId", "preparedAt", "source", "plugin", "package", "skills", "specs", "fixture", "providers"];
// A normalised view of either a current manifest or the historical 0.1.0-rc.1 candidate.
export function loadCandidate(file) {
  const data = readJson(file);
  if (data.$schema === SCHEMA) {
    const unknown = Object.keys(data).filter((k) => !KEYS.includes(k)), missing = KEYS.filter((k) => !(k in data));
    if (unknown.length || missing.length) throw new Error(`candidate format is closed: unknown ${unknown.join(",") || "none"}, missing ${missing.join(",") || "none"}`);
    const { $schema, candidateId, preparedAt, ...body } = data;
    if (sha(JSON.stringify({ ...body, package: { ...body.package, acceptedFingerprints: undefined } })).slice(0, 16) !== candidateId) throw new Error("candidateId does not match the manifest content (edited or corrupted)");
    return { kind: "current", id: candidateId, version: data.plugin.version, skills: data.skills.inventory, metadataFingerprint: data.skills.metadataFingerprint, accepted: new Set(data.package.acceptedFingerprints.map((x) => x.sha256)), specs: data.specs, qualification: data.source.qualification, commit: data.source.commit, providers: data.providers.map((p) => p.provider), data };
  }
  if (data.phase === 5 && Array.isArray(data.acceptedPackageFingerprints) && data.skillMetadataFingerprint) {
    return { kind: "historical", id: `historical-${data.version}-${String(data.commit).slice(0, 7)}`, version: data.version, skills: data.skills, metadataFingerprint: data.skillMetadataFingerprint, accepted: new Set(data.acceptedPackageFingerprints.map((x) => x.sha256)), specs: null, qualification: `HISTORICAL (${data.sourceState})`, commit: data.commit, providers: PROVIDERS, data };
  }
  throw new Error("not an evaluation candidate (neither chayen-eval-candidate/1 nor the historical Phase 5 format)");
}

// Offline: does this candidate describe the checkout the runner reads specs and fixtures from?
export function verifyAgainstCheckout(cand, repo) {
  const errors = [];
  if (cand.kind === "historical") {
    const meta = metadataFingerprint(path.join(repo, PACKAGE)), pkg = fingerprint(path.join(repo, PACKAGE)).sha256, version = readJson(path.join(repo, PACKAGE, "plugin.json")).version;
    if (version !== cand.version) errors.push(`historical candidate ${cand.version} does not describe this checkout (version ${version}); reproduce it from commit ${String(cand.commit).slice(0, 7)}`);
    if (meta !== cand.metadataFingerprint) errors.push(`skill metadata fingerprint ${meta} differs from the historical candidate ${cand.metadataFingerprint}`);
    if (!cand.accepted.has(pkg)) errors.push("package fingerprint is not one of the historical candidate's accepted fingerprints");
    return errors;
  }
  const now = prepareCandidate(repo, { providers: cand.providers });
  const was = cand.data;
  if (now.source.commit !== was.source.commit) {
    // Committing the manifest itself moves HEAD; only changes outside the candidates folder make it stale.
    let changed = null;
    try { changed = git(repo, ["diff", "--name-only", was.source.commit, "HEAD"]).split("\n").filter(Boolean); } catch { /* commit not available */ }
    if (!changed || changed.some((p) => !p.startsWith(`${CANDIDATES_DIR}/`))) errors.push(`stale candidate: prepared at commit ${was.source.commit.slice(0, 7)}, checkout is ${now.source.commit.slice(0, 7)}${changed ? ` with ${changed.length} changed path(s)` : " (commit not available)"}`);
  }
  if (now.source.workingTree !== was.source.workingTree) errors.push(`working tree is ${now.source.workingTree}, candidate was prepared ${was.source.workingTree}`);
  if (now.plugin.version !== was.plugin.version) errors.push(`wrong version: checkout ${now.plugin.version}, candidate ${was.plugin.version}`);
  if (now.package.contentLfSha256 !== was.package.contentLfSha256) errors.push("package content differs from the candidate (package fingerprint)");
  if (now.skills.metadataFingerprint !== was.skills.metadataFingerprint) errors.push(`changed metadata: skill metadata fingerprint ${now.skills.metadataFingerprint}, candidate ${was.skills.metadataFingerprint}`);
  if (JSON.stringify(now.skills.inventory) !== JSON.stringify(was.skills.inventory)) errors.push("Entry Skill inventory differs from the candidate");
  for (const s of SUITES) if (now.specs[s].sha256 !== was.specs[s]?.sha256) errors.push(`test specification ${s} differs from the candidate`);
  if (now.fixture.sha256 !== was.fixture.sha256) errors.push("evaluation fixture differs from the candidate");
  return errors;
}

// Offline: the installed package in an isolated home, for the plugin or the no-plugin baseline arm.
export function checkInstalled(cand, home, arm) {
  const installs = installedPackages(home);
  if (arm === "baseline") return { errors: installs.length ? [`baseline arm requires a home without any chayen installation; found ${installs.length}`] : [], installs: [] };
  if (installs.length !== 1) return { errors: [`plugin arm needs exactly one installed chayen package; found ${installs.length}`], installs };
  const dir = installs[0], errors = [];
  const version = readJson(path.join(dir, "plugin.json")).version, pkg = fingerprint(dir).sha256, meta = metadataFingerprint(dir);
  if (version !== cand.version) errors.push(`wrong version: installed ${version}, candidate ${cand.version}`);
  if (!cand.accepted.has(pkg)) errors.push(`wrong package fingerprint: installed ${pkg.slice(0, 16)} is not accepted by candidate ${cand.id}`);
  if (meta !== cand.metadataFingerprint) errors.push(`changed metadata: installed skill metadata fingerprint ${meta}, candidate ${cand.metadataFingerprint}`);
  return { errors, installs: [{ dir, sha256: pkg, version, metadataFingerprint: meta }] };
}

// Scoring: results must come from this candidate, its specs and an accepted package.
export function checkRunCompatibility(run, cand) {
  const errors = [];
  if (run.candidateId !== undefined || cand.kind === "current") {
    if (run.candidateId !== cand.id) errors.push(`results were recorded against candidate ${run.candidateId ?? "none (historical runner)"}, not ${cand.id}`);
  }
  if (run.metadataFingerprint !== cand.metadataFingerprint) errors.push(`results carry metadata fingerprint ${run.metadataFingerprint}, candidate ${cand.metadataFingerprint}`);
  if (run.arm === "plugin" && !cand.accepted.has(run.packageFingerprint)) errors.push("results were recorded against a package the candidate does not accept");
  if (run.arm === "baseline" && run.packageFingerprint) errors.push("baseline results carry an installed package");
  if (cand.specs && run.specHash !== cand.specs[run.suite]?.sha256) errors.push(`results used a ${run.suite} specification the candidate does not record`);
  return errors;
}

const argv = process.argv.slice(2);
const arg = (name) => { const i = argv.indexOf(name); return i > -1 ? argv[i + 1] : undefined; };
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const repo = fs.realpathSync(path.resolve(import.meta.dirname, "../../.."));
  try {
    if (argv[0] === "prepare") {
      const out = arg("--out");
      if (!out) throw new Error("prepare needs --out <new file>");
      const providers = arg("--providers")?.split(",") ?? PROVIDERS;
      const c = prepareCandidate(repo, { providers });
      const target = path.resolve(out);
      const inRepo = target.startsWith(repo + path.sep);
      if (inRepo && c.source.workingTree === "dirty") throw new Error("an uncommitted snapshot candidate is written outside the repository; commit first, or choose an --out outside it");
      if (inRepo && path.relative(repo, target).split(path.sep).join("/").startsWith("tests/evaluation/phase5/results/")) throw new Error("historical result folders are never written; use tests/evaluation/phase5/candidates/ or a path outside the repository");
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, JSON.stringify(c, null, 2) + "\n", { flag: "wx" });
      console.log(`Prepared candidate ${c.candidateId} (${c.source.qualification}) for ${c.plugin.name} ${c.plugin.version} at ${c.source.commit.slice(0, 7)}${c.source.workingTree === "dirty" ? ` + ${c.source.dirtyPaths.length} uncommitted path(s)${c.source.packageMatchesCommit ? "" : ", package changed"}` : ""}`);
      console.log(`  package ${c.package.files} files, LF ${c.package.contentLfSha256.slice(0, 16)}; metadata ${c.skills.metadataFingerprint}; ${c.skills.count} Entry Skills; providers ${c.providers.map((p) => p.provider).join(", ")}`);
      console.log("No provider CLI was started and no model was called.");
    } else if (argv[0] === "verify") {
      const cand = loadCandidate(path.resolve(arg("--candidate") ?? ""));
      const errors = verifyAgainstCheckout(cand, repo);
      for (const e of errors) console.log(`FAIL ${e}`);
      console.log(`${errors.length ? "FAIL" : "PASS"} candidate ${cand.id} (${cand.qualification}) ${errors.length ? "does not describe" : "describes"} this checkout`);
      process.exitCode = errors.length ? 1 : 0;
    } else throw new Error("usage: candidate.mjs prepare --out <file> [--providers a,b] | verify --candidate <file>");
  } catch (e) { console.log(`ERROR ${e.message}`); process.exitCode = 2; }
}
