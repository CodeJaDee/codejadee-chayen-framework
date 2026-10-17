# Release checklist: `0.1.0`

**Step 41 update (2026-10-17):** the release candidate now has 15 skills
(13 engineering, 2 writing). A release-candidate version `0.1.0-rc.1` is
proposed in [RELEASE_METADATA.md](RELEASE_METADATA.md) and not applied. The
current readiness assessment is
[docs/chayen/RELEASE_READINESS.md](../chayen/RELEASE_READINESS.md).

**Status: NOT READY.** Blocking items are marked ⛔. Each item says who acts.

Release actions are taken only by the project owner, with explicit
approval for each one (BC-30, BC-31):

- version bump;
- tag;
- push;
- publication;
- marketplace submission.

## A. Owner decisions (blocking)

- [ ] ⛔ **Licence chosen** ([LICENSE_PROPOSAL.md](LICENSE_PROPOSAL.md)),
  `LICENSE` added, and `license` set in both manifests. *Owner.*
- [ ] ⛔ **Publisher identity confirmed.** Is `CodeJaDee` the legal name for
  `author` and the marketplace owners? *Owner.*
- [ ] ⛔ **Distribution model decided:**
  - internal: private repository, access-controlled installs; or
  - public: repository made public, or a public mirror.

  *Owner.*
- [ ] ⛔ **Security contact published** in `SECURITY.md`, for example by
  enabling GitHub private vulnerability reporting. *Owner.*
- [ ] **Support channel stated:** issues URL or email. *Owner.*
- [ ] **Codex IDE extension position decided** (ISSUES Q-02): document it
  as unsupported (the current docs do this), or something else. *Owner.*
- [ ] **Java scope for v1 confirmed out of scope** (Q-08). *Owner.*
- [ ] **Multilingual decisions confirmed** (D-055 English skill, D-056 and
  ADR-0010 response style policy, D-057 evaluation rubric and ADR-0011
  language threshold, D-058 version). *Owner.*
- [ ] **Third-party notice kept:** `chayen-humanizer-en/references/upstream-notice.md`
  still carries the humanizer MIT licence text and attribution, whichever
  licence is chosen; decide whether a root notices file is also wanted. *Owner.*

## B. Version and metadata

- [ ] ⛔ Set `version` to `0.1.0` in `plugins/codejadee-chayen-framework/plugin.json`,
  `plugins/codejadee-chayen-framework/.claude-plugin/plugin.json`, and
  `.github/plugin/marketplace.json` (the entry and `metadata.version`).
  Without this, Claude Code installs do not update (R-54). *Maintainer,
  after approval.*
- [ ] Decide on the optional description and keyword updates in
  [RELEASE_METADATA.md](RELEASE_METADATA.md).
- [ ] Move `CHANGELOG.md` `[Unreleased]` to `[0.1.0] - <date>`.
- [ ] Re-run the checks below and record the results.

## C. Automated checks (offline; must PASS)

```bash
node tools/validate/validate-all.mjs                   # all gates, including documentation links
node tests/provider-compatibility/check-identity.mjs   # 15/15
node tools/evals/run-evaluation-suite.mjs              # traceability and static levels
claude plugin validate --strict plugins/codejadee-chayen-framework
claude plugin validate --strict .
git status --short                                     # only intended changes
```

## D. Provider verification of the release build (blocking, R-53)

These follow `tests/provider-compatibility/README.md` (runbook R-1..R-10).
They need an authorized environment and test identities.

- [ ] ⛔ **Claude Code CLI**, from the release commit:
  - marketplace add, install, `plugin details` shows Skills (15);
  - disable, enable;
  - update from the previous version to `0.1.0`;
  - uninstall.
- [ ] ⛔ **Codex CLI:** add, list, a new session sees the skills; disable
  via `config.toml`; remove. Record the update path.
- [ ] ⛔ **Copilot CLI** (runtime 1.0.91 or later): install ("Installed 15
  skills"), `skill list`, disable, enable, update, uninstall.
- [ ] **Claude Code VS Code extension:** manual procedure
  (`tests/provider-compatibility/claude-code-vscode.md`).
- [ ] **VS Code Copilot Chat:** manual procedure
  (`tests/provider-compatibility/copilot-vscode.md`).
- [ ] **Remote install** from the GitHub marketplace on each CLI, after the
  push.
- [ ] **Routing probes** on Claude Code, plus Copilot if an isolated test
  sign-in is available:
  `tests/evaluation/run-provider-probes.mjs`, ≥2 runs. Compare against the
  2026-10-15 baseline (automatic 12/22, explicit 6/6, no-match 12/12;
  43 pooled runs).

- [ ] ⛔ **Multilingual evaluation** (`tests/evaluation/step40/`, R-61): the
  52 routing probes ×3 runs, quality and policy runs with and without the
  plugin and the policy, scored with the approved rubric, plus two fluent
  reviewers per language. Include the engineering probes to check that the
  writing skills do not take engineering prompts (R-62).
- [ ] **Response style policy loading** on each host where it is offered
  (`docs/RESPONSE_STYLE.md` verify step), in a disposable profile.

## E. Documentation

- [ ] `node tools/validate/check-docs.mjs` PASS: links, anchors, identifiers,
  skill names.
- [ ] The Verified, Not tested, and Unsupported labels in
  `docs/COMPATIBILITY_MATRIX.md` and the install guides are updated from
  the section D results only.
- [ ] README status banner updated: version, licence, repository visibility.

## F. Release (owner only, after explicit approval)

- [ ] Commit, then tag (`claude plugin tag` can create a
  `{name}--v{version}` tag that checks manifest and marketplace agreement).
- [ ] Push.
- [ ] Create a GitHub release with the changelog section.
- [ ] Marketplace or directory submissions, if any
  ([MARKETPLACE_LISTINGS.md](MARKETPLACE_LISTINGS.md)): one approval per
  directory.

## G. After release

- [ ] Install the published version on each surface and confirm Skills (15).
- [ ] Watch issues for routing and install reports, and update
  `docs/COMPATIBILITY_MATRIX.md`.
