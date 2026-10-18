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

The add/list forms were observed on historical CLIs; confirm availability
with installed help. Missing installation controls mean NOT_RUN; do not
replace the native plugin with copied Skills. Verify identity, version,
enabled state and all 15 Skills, then start a new session.

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
Migration is NOT_RUN. Intended explicit syntax remains
`$chayen-security <request>`, pending current-build verification.

## Disable, enable, update, uninstall

Use native plugin controls to toggle enabled state. Do not assume CLI
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

Current lifecycle, migration, routing and explicit invocation are NOT_RUN;
see [Compatibility](COMPATIBILITY_MATRIX.md). Security/Support remains LATER;
no channel is selected. The [official OpenAI plugin guide](https://developers.openai.com/plugins/build/plugins)
was reviewed on 2026-10-18 for marketplace setup/refresh/removal. It does not
establish every historical CLI installation command on every version;
installed help and native release qualification are still needed.
