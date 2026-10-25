# Phase 5 runtime and security qualification harness (developer-only)

Nothing here is shipped in the plugin. Reports:
[ROUTING_EVALUATION](../../../docs/production/ROUTING_EVALUATION.md),
[HUMANIZER_QUALITY_REPORT](../../../docs/production/HUMANIZER_QUALITY_REPORT.md),
[CAPABILITY_SAMPLE_RESULTS](../../../docs/production/CAPABILITY_SAMPLE_RESULTS.md),
[SECURITY_TEST_REPORT](../../../docs/production/SECURITY_TEST_REPORT.md).

**As of 2026-10-18 no provider run has been made with this harness.** Billed
runs need the owner's recorded budget and access authorization (OD-10).

## Files

| File | Purpose |
|---|---|
| `routing-probes.json` | Frozen routing set: 46 positive (2 per Entry Skill + 14 Step 40 overlap), 12 negative, 10 no-match, 1 inspect-first, 16 explicit (chayen-init added under D-062). Generated |
| `humanizer-subset.json` | 12 TH, 12 EN, 6 mixed/adversarial Step 40 quality cases; coverage map; dataset gaps; three PROPOSED (unfrozen) supplementary cases. Generated |
| `capability-sample.json` | 24 engineering/technology scenarios and 4 composite workflows. Generated |
| `security-cases.json` | 16 adversarial cases in 8 categories, inline disposable fixture, harmless sentinel payloads. Authored |
| `build-fixtures.mjs` | Builds the three generated files verbatim from reviewed sources; `--check` detects drift |
| `phase5-lib.mjs` | Transcript parsers (Claude, Codex, Copilot), classification, Wilson intervals, pooling and retry rules |
| `run-phase5.mjs` | `--plan`, `--preflight` and `--score` (offline); live runs (billed, guarded). Every live run, preflight and candidate-bound score names its candidate with `--candidate`; there is no default |
| `candidate.mjs` | `prepare` a deterministic `chayen-eval-candidate/1` manifest for the checked-out revision; `verify` one against the checkout (evolution Step 14, D-071) |
| `candidate.test.mjs` | 12 offline regressions on disposable git repositories (part of `validate-all.mjs`) |
| `phase5.test.mjs` | 13 offline controls (part of `validate-all.mjs`) |
| `candidates/` | Committed candidate manifests, prepared from clean commits only (none yet) |
| `results/2026-10-18-phase5/` | **Historical** 0.1.0-rc.1 candidate, call plan, local checks and technology fact-check evidence. Never rewritten |

## Offline commands (free)

```bash
node tests/evaluation/phase5/build-fixtures.mjs --check
node --test tests/evaluation/phase5/phase5.test.mjs
node tests/evaluation/phase5/run-phase5.mjs --plan            # 2,295 billed calls for the full matrix
node tests/evaluation/phase5/run-phase5.mjs --score <results dir> [--candidate <file>]

# Candidate for the checked-out build: reads files and runs read-only git only
node tests/evaluation/phase5/candidate.mjs prepare --out <new file> [--providers claude,codex,copilot]
node tests/evaluation/phase5/candidate.mjs verify --candidate <file>
node tests/evaluation/phase5/run-phase5.mjs --plan --candidate <file>
node tests/evaluation/phase5/run-phase5.mjs --preflight --candidate <file> [--provider claude --arm plugin|baseline --home <isolated home>]
```

## Candidates

A candidate manifest records:

- the source commit, whether the working tree is clean or dirty, and the
  uncommitted paths;
- the plugin manifest version and the marketplace descriptors;
- the complete package fingerprint, both the working-tree bytes and the
  LF-normalised content;
- the Skill metadata fingerprint and the Entry Skill inventory;
- the fingerprints of the four test specifications and the fixture;
- the applicable provider configurations.

`candidateId` is a hash of those fields, so the same tree always gives the
same ID. Editing a manifest makes it unloadable.

- **`COMMITTED_SOURCE`**: prepared from a clean checkout. Commit the
  manifest under `candidates/`. Committing it does not make the candidate
  stale, because only changes outside `candidates/` count.
- **`UNCOMMITTED_SNAPSHOT`**: prepared from a dirty tree. It is not a
  release-qualified commit:
  - it is written outside the repository;
  - live runs need `--allow-uncommitted-candidate`;
  - every record carries `candidateQualification`.

No commit, tag, release or push is made by any of these commands.

Preflight is offline. It refuses a candidate that does not describe the
checkout, giving the version, package, metadata, inventory, specification or
fixture that differs. It also checks a provider home:

- **plugin arm:** exactly one installed `chayen` package, with an accepted
  fingerprint, the candidate's version and its metadata fingerprint;
- **baseline arm:** no `chayen` package at all.

Scoring rejects results recorded against another candidate, specification,
metadata fingerprint or package. Pooling separates provider, CLI version,
model, package, metadata, specification and candidate.

**Historical 0.1.0-rc.1 data** stays as recorded in
`results/2026-10-18-phase5/`:

- `candidate.mjs` reads that candidate unchanged.
- The package and metadata fingerprints are reproducible from commit
  `38570b3`.
- The plan's specification hashes are reproducible from commit `f06d3e0`.

`candidate.test.mjs` checks all three. The historical candidate never
passes for the current checkout. To re-run it, use a separate worktree at
those revisions.

## Live procedure (billed; only after authorization)

Preconditions, all recorded before the first scored run:

1. OD-10 budget and access authorization, with a reference passed as `--authorization` and a call cap as `--max-calls`.
2. OD-05 review of the expected sets in `routing-probes.json` and of PT-01..PT-06. The probe-file SHA-256 is written into every record.
3. Dedicated test identities. Never copy production credentials into an isolated home.
4. GitHub Copilot CLI >= 1.0.91 installed (`COPILOT_AUTO_UPDATE=false`).
5. An **unscored pilot** of 2-3 probes per CLI. Use it to confirm the event shapes the parsers rely on, and to review the PROPOSED Codex activation signal: a native read of an installed `skills/chayen-*/SKILL.md` outside the fixture, or a host skill event. Pilot output is kept but never scored.

Prepare a candidate from a clean commit, then build the marketplace from that
commit's bytes (for 0.1.0-rc.1 the commit was `38570b3`):

```bash
node tests/evaluation/phase5/candidate.mjs prepare --out tests/evaluation/phase5/candidates/<date>-<commit>.json
git archive <candidate commit> plugins/codejadee-chayen-framework \
  .claude-plugin .agents .github/plugin | tar -x -C <scratch>/marketplace
```

For each CLI, create two isolated homes, `plugin` and `baseline`, and sign each in
with the test identity. Install the plugin only in the `plugin` home:

```bash
CLAUDE_CONFIG_DIR=<home> claude plugin marketplace add <scratch>/marketplace
CLAUDE_CONFIG_DIR=<home> claude plugin install chayen@codejadee
CODEX_HOME=<home> codex plugin marketplace add <scratch>/marketplace
CODEX_HOME=<home> codex plugin add chayen@codejadee
COPILOT_HOME=<home> copilot plugin marketplace add <scratch>/marketplace   # inspect --help first
COPILOT_HOME=<home> copilot plugin install chayen@codejadee
```

Run `--preflight` for each home first. The live runner repeats every
preflight check and refuses:

- a `plugin` home unless it contains exactly one installed `chayen` package
  with an accepted fingerprint, the candidate's version and its metadata;
- a `baseline` home that contains any installation.

Then run each suite, provider and arm, for example:

```bash
CLAUDE_CONFIG_DIR=<plugin home> node tests/evaluation/phase5/run-phase5.mjs --suite routing \
  --provider claude --arm plugin --candidate <candidate file> --allow-provider-calls \
  --authorization <OD-10 ref> --max-calls 246 --model <pinned model> --out <fresh dir outside the repo>
```

Retry only infrastructure failures, once: `--retry <results dir>` with the same arguments.
Humanizer runs also write `arm-outputs.json` (arm A = baseline, arm B = plugin), which
`node tools/evals/score-step40.mjs --outputs <file> --reviews <reviewer files>` scores.

## Safety rules

- Native permissions are preserved. Claude `-p` pre-approves only Read, Glob, Grep and
  Skill. Codex runs `exec -s read-only`. Copilot runs `-p` with default tool approval.
  No permission-bypass or allow-all flag is ever passed.
- Every run gets a fresh fixture copy with a local git repository and no remote. The
  runner records file changes and sentinel files after the run.
- Security payloads are harmless: `.invalid` hosts, a closed loopback port, a private
  package, and sentinel files written only inside the disposable copy. A permissive
  arm (shell allowed) is not provided. Run one only inside a disposable VM or container.
- Results are summarized per CLI and never pooled across providers or configurations.
