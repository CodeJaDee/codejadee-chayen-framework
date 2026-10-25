# Phase 4: Release candidate and native CLI lifecycle

Date: 2026-10-18. **Overall: BLOCKED; three-provider release gate remains open.**
No Phase 5 evaluation, VS Code testing, model prompts, production credentials,
commit, push, tag, publication or repository setting change was performed.
Security/Support remains LATER and is unrelated to this lifecycle implementation.

> **Superseded for the current build.** This report records `0.1.0-rc.1`.
> The native lifecycle of the 16-Skill `1.1.2` working-tree snapshot passed on
> 2026-10-23 (Claude Code 2.1.220 and Codex 0.163.0; Copilot 1.0.89 BLOCKED
> below 1.0.91). That is lifecycle evidence, not release qualification: no
> committed frozen candidate was used. See the
> [Step 19 report](../chayen/evolution/PROVIDER_SECURITY_REPORT.md).

## Candidate identification

The repository was clean on entry at
`9ef22cc9b6abf348d145f0df8ead160207526540` (`main`). Phase 1 OWN-07 explicitly
approved `0.1.0-rc.1`; therefore the Phase 4 conditional authorizes applying it.
All four version fields now agree, and CHANGELOG/SECURITY/current build docs
are aligned. No further version approval is needed for these edits.

**This is an identifiable working-tree candidate, not a committed M1 freeze.**
HEAD still names the pre-edit revision. Testing used independent scratch
marketplace copies of the exact package below; it did not test the old package
stored at HEAD. A separately authorized commit and candidate requalification
are needed before claiming evidence on a frozen commit. Existing project MIT
licence/rights work and remote CI remain separate release prerequisites; they
did not prevent isolated lifecycle testing.

| Field | Tested value |
|---|---|
| Base source commit | `9ef22cc9b6abf348d145f0df8ead160207526540` |
| Plugin / publisher | `chayen` / `CodeJaDee` |
| Package / Claude manifest versions | `0.1.0-rc.1` / `0.1.0-rc.1` |
| All marketplace names | `codejadee` |
| Copilot metadata / entry versions | `0.1.0-rc.1` / `0.1.0-rc.1` |
| Claude / Codex marketplace versions | Not declared; shared package provides version |
| Package SHA-256 | `9e5705fe32b19799d24ca9b671793fc54159943b0a6c12758b45f73d2c2833eb` |
| Skill metadata fingerprint | `339b3125d1347648` |
| Package inventory | 256 files: 254 Markdown, 2 JSON; 15 Skills; 237 references |
| Scratch update version | `0.1.0-rc.2` (never applied to repository) |
| Scratch update SHA-256 | `b05fa7bcf854aca8f1183918e45f521c4b84bf611ee0ab85850a74b9399f4353` |

Full file/descriptor digests and metadata are in
[candidate.json](../../tests/provider-compatibility/results/2026-10-18-rc1/candidate.json).
Package hashing sorts relative paths with `/`, hashes each file's **raw bytes**,
then SHA-256 hashes concatenated `path + NUL + fileSHA256 + LF` entries. This
fingerprint is sensitive to line endings and every packaged file. Metadata
uses the existing evaluation algorithm: sorted `name + NUL + description + NUL`,
SHA-256 truncated to 16 hex characters. No Skill metadata changed in Phase 4.

## Preparation and implementation

Reviewed approved scope, Phase 2 hardening, CI/CD design, current release
checklist, compatibility matrix, both manifests, all three marketplaces and
the native lifecycle runbook/runner. Phase 2 scope, upstream notice and identity
checks passed before candidate changes. Required fixes remain present:
Nitro/Elysia exclusions, Thai locale-copy boundary, intact upstream MIT notice,
Thai-number/calendar scorer controls and lifecycle isolation/removal guards.

`qualify-rc.mjs` reuses Phase 2 authorization, environment, scratch update and
configuration guards. It adds complete package fingerprints, native inventory,
reinstall/new-process checks and former-identifier migration. Windows accepts
explicit native `.exe` paths without shell execution. Synthetic update advances
RC.1 to RC.2 rather than downgrading to the former lifecycle prerelease suffix.
Offline negative controls are included in the routine validation aggregate.

Installed binary help was inspected before lifecycle commands. Reference sources
reviewed 2026-10-18: [Claude CLI reference](https://code.claude.com/docs/en/plugins/cli-reference),
[OpenAI plugin packaging/configuration](https://developers.openai.com/plugins/build/plugins),
[Copilot CLI reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference).
Observed installed-binary behavior takes precedence over assumed command parity.
OpenAI's official marketplace sample confirms `AVAILABLE`, `ON_INSTALL` and
`Productivity`; native Codex installation resolved the root manifest without
an authentication prompt. P1-026/P1-027 static/native resolution parts are addressed.

## Exact native outcomes

Windows, Node.js `v24.22.0`; measured run started `2026-10-18T06:05:04.104Z`.
Native qualification returned **2 (BLOCKED)**, with no FAIL operation in the
reviewed run. PowerShell's pipeline wrapper reports exit 1 for a nonzero Node
process; `QUALIFICATION_EXIT=2` records the actual runner result.

| Operation | Claude Code 2.1.302 | Codex CLI 0.163.0 | Copilot CLI |
|---|---|---|---|
| Register local marketplace | PASS | PASS | BLOCKED: executable absent |
| Install current identity | PASS | PASS | BLOCKED |
| List installed / RC.1 version | PASS | PASS | BLOCKED |
| Native discovery and complete installed package | PASS: details, 15 Skills | PASS: skills/list, 15 Skills | BLOCKED |
| Disable command | PASS; enabled=false | UNSUPPORTED subcommand; native config alternative PASS | BLOCKED |
| Verify disabled loading | BLOCKED; details still enumerates contents | PASS: fresh skills/list loads 0 Chayen Skills | BLOCKED |
| Enable command | PASS; enabled=true | UNSUPPORTED subcommand; native config alternative PASS | BLOCKED |
| Verify enabled inventory | PASS: 15 Skills, list enabled | PASS: fresh skills/list loads 15 | BLOCKED |
| Changed-version update | PASS: marketplace update + plugin update | UNSUPPORTED in-place subcommand; native remove/add PASS | BLOCKED |
| Verify RC.2 version and full content hash | PASS | PASS via replacement | BLOCKED |
| Uninstall | PASS | PASS | BLOCKED |
| Verify actually absent | PASS: fresh list empty | PASS: installed array empty | BLOCKED |
| Reinstall changed build | PASS: RC.2 | PASS: RC.2 | BLOCKED |
| Restart/reload inventory | PASS: new CLI process, 15 Skills | PASS: new app-server process, 15 Skills | BLOCKED |
| Migrate former identifier to exact RC.1 | PASS | PASS | BLOCKED |
| Final uninstall and unregister | PASS | PASS | BLOCKED |
| Project application fixture unchanged | PASS | PASS | PASS: no provider execution |

### Claude Code

Native commands: `plugin marketplace add/list/update/remove`,
`plugin install/list --json/details/disable/enable/update/uninstall`.
Every actual command exit is retained in
[Claude transcript](../../tests/provider-compatibility/results/2026-10-18-rc1/claude-transcript.json).
The registry's installPath, version, enabled state and full installed file hash
were checked. A disabled plugin remains installed, as required.

`plugin details` prints all 15 Skills even while disabled. An initial harness
assumption incorrectly treated this inventory tool as an activation probe;
that assertion was replaced with BLOCKED, not a fabricated behavior PASS.
Native disable/enable persistence is verified. To close disabled loading,
use an explicitly authorized disposable session/test account, restart after
disable, inspect available Skills and prove Chayen cannot be selected; enable
and restart and prove restoration. No production sign-in or model request was
used here. The enabled inventory result does not establish automatic routing.

### OpenAI Codex CLI

Native commands: `plugin marketplace add/list/upgrade/remove`, `plugin add`,
`plugin list --json`, `plugin remove`. Dedicated disable, enable and per-plugin
update subcommands are UNSUPPORTED in 0.163.0.

Tested alternatives edit **only** the disposable CODEX_HOME config section
`[plugins."chayen@codejadee"]`, setting `enabled=false/true`. Native list and
new CLI app-server processes confirm state and 0/15 enabled Chayen Skills.
The local stdio protocol invokes `initialize`, `initialized`, `skills/list`
with `forceReload=true`. It never creates a thread or sends a model turn.
Names are namespaced (`chayen:chayen-backend`) and attributed by pluginId,
not matched to unrelated system Skills.

For update, remove/add installs the scratch RC.2 and the complete installed
tree matches its changed hash. This proves a native **replacement** path,
not in-place update. `marketplace upgrade` refreshes Git snapshots and is not
required for this local directory. Root manifest resolution was demonstrated
without a `.codex-plugin` fallback or credentials. See
[Codex transcript](../../tests/provider-compatibility/results/2026-10-18-rc1/codex-transcript.json).
An independent [root-manifest probe](../../tests/provider-compatibility/results/2026-10-18-rc1/codex-root-manifest-probe.json)
also removed the Claude manifest **only in a fresh fixture**, leaving 255 files
and no Codex fallback. Native add/list still reported RC.1, complete installed
bytes matched that fixture, and skills/list loaded all 15 Skills. Removal,
real-configuration and source-package checks passed. This proves root resolution;
the reduced fixture is not the candidate package or a new release version.
Supported operations pass on this snapshot; G-07 remains BLOCKED on committed
M1 candidate qualification rather than claiming a frozen-revision PASS.

### GitHub Copilot CLI: exact pending procedure

`spawn copilot --version` returned ENOENT. No CLI install, account sign-in or
personal configuration change was attempted. All native steps are BLOCKED;
command support is **not** labelled UNSUPPORTED without an installed binary.
Use a separately provisioned native CLI >=1.0.91 in an authorized disposable
profile, with COPILOT_HOME/HOME/AppData under scratch and auto-update disabled.
Inspect the actual help before using the current documented forms below:

```text
copilot --version
copilot plugin --help
copilot plugin marketplace --help
copilot plugin marketplace add <scratch-marketplace>
copilot plugin marketplace list
copilot plugin install chayen@codejadee
copilot plugin list --json
copilot skill --help
copilot skill list
copilot plugin disable chayen
copilot plugin list --json
# restart native CLI; verify all Chayen Skills unavailable
copilot plugin enable chayen
# restart; verify all 15 Skills available
# change only scratch four version fields to RC.2 and backend content marker
copilot plugin marketplace update codejadee
copilot plugin update chayen
# verify native version and complete effective install-tree fingerprint
copilot plugin uninstall chayen
copilot plugin list --json
# assert no Chayen installation; disabled is insufficient
copilot plugin install chayen@codejadee
# restart and verify RC.2, changed hash and all 15 Skills
# replay former-identifier migration, then restore exact RC.1 bytes
copilot plugin uninstall chayen
copilot plugin marketplace remove codejadee
copilot plugin marketplace list
```

The [official Copilot reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)
says local path marketplace plugins read live content;
update may be a new-session refresh rather than a cached replacement. Record
this separately and hash the effective live directory. Review installed-binary
output before completing the deliberately closed Copilot inventory adapter.
If authentication is required, stop with BLOCKED and obtain dedicated test
access; never copy production credentials. Migration must install the old
fixture, uninstall it and prove absence, install current identity, then verify
version/full content/15 Skills after a fresh process. Do not auto-edit global
configuration to work around provider failures.

## Migration, restart and safety boundaries

Migration replays `codejadee-chayen-framework` as a scratch plugin identity
with the **current 15-Skill body**. Both available CLIs installed it, confirmed
the legacy record, removed it and proved absence, restored the exact candidate
bytes, installed `chayen` and verified RC.1/full fingerprint/15 native Skills.
It does not claim every historical package revision was tested. New-process
restart verifies persisted installation and native inventory, not conversation
resumption, automatic routing or model-output quality.

Child environment homes are isolated; production tokens/startup variables are
not inherited. Each provider uses a different marketplace copy, profile and
application fixture. User-level scope in a native message refers to this
disposable profile, not the developer's actual home. Config overrides do not
constitute an OS sandbox; no claim is made that the whole Windows account is
disposable.

The reviewed run's real configuration hash is identical before/after:
`ff1534a6b12d0a4cd18591d86859562c965e38ae9e8b11272a8aa2e91c0e8159`.
Changed configuration paths: **none**. Root `.claude.json`, auth/settings,
plugin registries and custom provider homes are included. The application
fixtures and repository package also stayed byte-identical during execution.

An earlier audit run rejected the broad profile hash. The model cache's timestamp
changed within that run while observed settings/auth timestamps predated it,
consistent with the active parent Codex refreshing `models_cache.json`. That
run retained aggregate rather than per-file before hashes, so exact original
drift attribution is not independently proved. This volatile model catalogue
is now the sole named exclusion; settings, auth and registries remain mandatory.
The earlier audit failure is not counted as PASS; see
[audit history](../../tests/provider-compatibility/results/2026-10-18-rc1/audit-history.json).
Raw earlier logs remain in temporary evidence; no real file was restored or edited to resolve it. An offline
negative control proves that this exclusion cannot hide a config.toml change.

## Evidence, local checks and open work

Changed-file groups:

- Version fields: both plugin manifests and `.github/plugin/marketplace.json`.
- Qualification tooling: `qualify-rc.mjs`, `codex-skills.mjs`, nine offline
  controls in `qualify-rc.test.mjs`; shared lifecycle version/config helpers
  and provider runbook. All remain outside the plugin package.
- Validation: aggregate includes RC controls; documentation validator includes
  this report; version-specific existing mutation fixtures follow the approved RC.
- Current docs: root/package READMEs, CHANGELOG, SECURITY version table,
  all three CLI install guides, contributor version example, release metadata,
  checklist, compatibility/release matrices and manual sign-off. CI/CD design
  retains historical results with a Phase 4 addendum.
- Evidence: candidate inventory, per-provider results/transcripts, independent
  root-manifest/strict checks and rejected-audit history under
  `tests/provider-compatibility/results/2026-10-18-rc1/`.

[Machine-readable results](../../tests/provider-compatibility/results/2026-10-18-rc1/results.json)
retain all per-step values; transcripts retain raw command output and exit
codes with local user/scratch paths replaced by placeholders. Scratch originals
remain under the OS temporary directory, named in the local execution output.
Candidate JSON contains exact file-level digests. Routine CI never invokes
these native scripts.

[Local check records](../../tests/provider-compatibility/results/2026-10-18-rc1/local-checks.json)
retain both runtime aggregate/static-suite logs and independent check summaries.
All six recorded Codex inventories also pass replay through the final stricter
parser; missing/empty cwd, unknown response shapes and scan errors cannot prove
disabled absence. The final repository package fingerprint still matches the
native-tested snapshot.

| Local check | Node 20.11.0 | Node 24.22.0 |
|---|---|---|
| `validate-all.mjs --fail-fast` | PASS, 19/19 groups | PASS, 19/19 groups |
| Existing validator controls | PASS, 179/179 | PASS, 179/179 |
| RC fingerprint/isolation/inventory controls | PASS, 9/9 | PASS, 9/9 |
| Scorer self-tests | PASS, 56/56 | PASS, 56/56 |
| Static evaluation suite `--fail-fast` | PASS, 4 static + 5 coverage/handoff checks | PASS, 4 static + 5 coverage/handoff checks |
| Provider identity | PASS, 15/15 (suite) | PASS, 15/15 (suite and independent) |

Independent Node 24 checks: CI failure fixtures PASS 4/4 (invalid manifest,
invalid reference and missing upstream MIT notice each detected with exit 1
and expected diagnostic); current-doc regressions PASS 15/15; actionlint 1.7.12
PASS with verified archive checksum; native Claude strict plugin/marketplace
validation PASS 2/2. `git diff --check` passes. Five existing package soft-limit
warnings remain; mandatory limits and all error checks pass.

Node 20 used an isolated official portable executable, verified against the
release SHASUMS256 file: SHA-256
`5da5e201155bb3ea99134b404180adebcfa696b0dbc09571d01a09ca5489f53e`.
No dependency or provider CLI installation was performed. Actual GitHub Actions
on this uncommitted RC: **NOT_RUN**. Static checks do not close native blockers.

Open Phase 4 acceptance items: Claude disabled loading proof; Copilot CLI and
all native operations; authorized committed candidate freeze/requalification.
The overall gate cannot PASS until all three declared CLIs are qualified.
Remote public installation and publication remain later authorized acts.
Security/Support, VS Code, response policy host tests and branch protection
are not introduced as Phase 4 blockers. Stop after Phase 4; Phase 5 is NOT_RUN.
