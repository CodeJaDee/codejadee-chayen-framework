# Install in GitHub Copilot

Production target: **GitHub Copilot CLI >=1.0.91**. VS Code Copilot Chat is
unverified and runtime testing is deferred.

| Item | Value |
|---|---|
| Marketplace name | `codejadee` |
| Plugin name | `chayen` |
| Install identifier | `chayen@codejadee` |
| Marketplace file | `.github/plugin/marketplace.json` |
| Plugin manifest | `plugins/codejadee-chayen-framework/plugin.json` |

## Copilot CLI

Review/pin a trusted source. Git access is required until public availability
is confirmed. Inspect `copilot plugin --help`; commands vary by runtime.
For reproducible maintainer runs use `COPILOT_AUTO_UPDATE=false` in a
disposable environment and record the resulting version. Ordinary CI does
not install or run any provider CLI.

```bash
copilot plugin marketplace add CodeJaDee/codejadee-chayen-framework
copilot plugin install chayen@codejadee
copilot plugin list
copilot skill list
```

Alternatively add an authorized local clone path. Verify identity, version,
enabled state and all 15 Skills; start a new session. Intended explicit
syntax is `/chayen-security <request>`, pending current-build verification.
Same-name personal Skills can shadow plugin Skills; inspect native discovery.

## Renamed from codejadee-chayen-framework

Repository, marketplace and package directory names are unchanged.
Remove the former identity before installing `chayen`:

<!-- migration:start -->
```bash
copilot plugin uninstall codejadee-chayen-framework
copilot plugin install chayen@codejadee
copilot plugin list
```
<!-- migration:end -->

Migration is unverified. Confirm the old identity is absent; a disabled old
entry is still installed. Preserve unrelated personal/project Skills.

## Disable, update, uninstall

```bash
copilot plugin disable chayen@codejadee
copilot plugin enable chayen@codejadee
copilot plugin update chayen
copilot plugin list
copilot plugin uninstall chayen
copilot plugin list
copilot plugin marketplace remove codejadee
```

Use only commands exposed by installed help. Verify changed installed
content and active version after update. Directory-sourced plugins may
read live content; restart and inspect the actual source rather than assume
a cache copy. Historical local uninstall only disabled the plugin; that is
**not** successful removal. Verify absence from installed list and native
Skill discovery. Do not delete the whole Copilot configuration directory.

## VS Code (GitHub Copilot Chat)

Unverified and excluded from the v0.1.0 support claim. CLI results do not
qualify it. No VS Code runtime test is required in Phase 3.

## Optional: response style policy

The [policy](RESPONSE_STYLE.md) is separate, not automatically installed or
removed, and unverified on hosts. Security/Support is LATER; no channel is selected.

## Verification status

Current lifecycle, migration, routing and explicit invocation are NOT_RUN;
see [Compatibility](COMPATIBILITY_MATRIX.md). Syntax was reviewed against
the [official CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)
on 2026-10-18. Documentation review is not a native execution result.
