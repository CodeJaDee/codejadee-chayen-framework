# Install in OpenAI Codex

Production target: **Codex CLI**. VS Code runtime qualification is
unverified/deferred; desktop/cloud surfaces are outside this release target.

| Item | Value |
|---|---|
| Marketplace name | `codejadee` |
| Plugin name | `chayen` |
| Install identifier | `chayen@codejadee` |
| Marketplace file | `.agents/plugins/marketplace.json` |
| Plugin manifest | `plugins/codejadee-chayen-framework/plugin.json` |

## Install (CLI)

Review/pin a trusted source; until public availability is confirmed, Git
access is required. Inspect `codex plugin --help` and
`codex plugin marketplace --help` before version-specific commands.

```bash
codex plugin marketplace add CodeJaDee/codejadee-chayen-framework
codex plugin marketplace list
```

Alternatively add an authorized clone using
`codex plugin marketplace add /path/to/codejadee-chayen-framework`.
Official marketplace setup documents `--ref` for reviewed Git refs.
Start Codex and use `/plugins` to inspect native installation controls.
CLI versions exposing `plugin add` can use:

```bash
codex plugin add chayen@codejadee
codex plugin list --marketplace codejadee
```

The add/list forms were verified on Codex CLI 0.163.0 in Phase 4; confirm availability
with installed help on other versions. Missing installation controls mean BLOCKED; do not
replace the native plugin with copied Skills. Verify identity, version,
enabled state and all 16 Skills, then start a new session.

## Renamed from codejadee-chayen-framework

Repository, marketplace and package directory names are unchanged. Where
these commands exist, remove the former identity and refresh:

<!-- migration:start -->
```bash
codex plugin remove codejadee-chayen-framework@codejadee
codex plugin marketplace upgrade codejadee
codex plugin add chayen@codejadee
codex plugin list --marketplace codejadee
```
<!-- migration:end -->

Otherwise use native `/plugins` controls. Confirm absence of the old entry.
Phase 4 verified a former-identifier migration fixture on the current 15-Skill
body, restoring exact RC.1 bytes; historical package revisions were not replayed.
Intended explicit syntax remains
`$chayen-security <request>`, pending current-build verification.

## Disable, enable, update, uninstall

Use native plugin controls to toggle enabled state. Codex 0.163.0 also reads
`[plugins."chayen@codejadee"]` with `enabled = false/true` from its config.toml.
Phase 4 tested this only in disposable CODEX_HOME; review any personal settings
change explicitly. Fresh native inventory showed 0/15 enabled Skills.
Do not assume CLI
`disable`, `enable` or per-plugin `update` subcommands exist. Refresh Git
marketplaces with `codex plugin marketplace upgrade codejadee`.
If installed content does not change, use reviewed native remove/add
controls and verify installed content and active version afterwards.

Where `plugin remove` is exposed:

```bash
codex plugin remove chayen@codejadee
codex plugin list --marketplace codejadee
codex plugin marketplace remove codejadee
```

A catalog can still show an available plugin; it must no longer be
**installed**. Disabled is still installed. Cached bytes alone prove neither
installation nor removal. Do not delete your entire Codex home.

## Optional: response style policy

[Response Style Policy](RESPONSE_STYLE.md) is opt-in, independent from
plugin installation/removal, and unverified on hosts.

## Verification status

<!-- historical:start -->
Phase 4 verified supported native lifecycle and migration on Codex CLI 0.163.0
with temporary profiles: install/list/15 Skills, config toggle, changed-version
and full-content remove/add replacement, absence, reinstall and fresh process.
Dedicated disable/enable/update subcommands are UNSUPPORTED.
<!-- historical:end -->
That run predates `chayen-init` (D-062). Committed candidate
qualification is pending. Routing and explicit invocation remain NOT_RUN;
see [Compatibility](COMPATIBILITY_MATRIX.md). Security/Support remains LATER;
no channel is selected. The [official OpenAI plugin guide](https://developers.openai.com/plugins/build/plugins)
was reviewed on 2026-10-18 for marketplace setup/refresh/removal. It does not
establish every historical CLI installation command on every version;
installed help and native release qualification are still needed.
