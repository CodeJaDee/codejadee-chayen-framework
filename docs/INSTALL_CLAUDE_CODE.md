# Install in Claude Code

Production target: **Claude Code CLI**. VS Code is unverified/deferred.
The current 15-Skill development build is not lifecycle/routing-qualified.

| Item | Value |
|---|---|
| Marketplace name | `codejadee` |
| Plugin name | `chayen` |
| Install identifier | `chayen@codejadee` |
| Marketplace file | `.claude-plugin/marketplace.json` |
| Plugin manifest | `plugins/codejadee-chayen-framework/.claude-plugin/plugin.json` |

## Install (CLI)

Review and pin a trusted source. Git-backed installation requires access
until public availability is confirmed. Check `claude plugin --help` for
your installed version's commands.

```bash
claude plugin marketplace add CodeJaDee/codejadee-chayen-framework
claude plugin install chayen@codejadee
claude plugin list
claude plugin details chayen
```

Alternatively add an authorized local clone with
`claude plugin marketplace add /path/to/codejadee-chayen-framework`.
Choose one source. For pins, use a reviewed checkout or Git-ref syntax
exposed by that CLI. Verify identity/version, enabled state and all 15
Skills, then start a new session. These instructions are not runtime evidence.

## Renamed from codejadee-chayen-framework

The repository and directory keep the long name. Remove the former identity
at the scope where it was installed, refresh and install `chayen`:

<!-- migration:start -->
```bash
claude plugin uninstall codejadee-chayen-framework@codejadee
claude plugin marketplace update codejadee
claude plugin install chayen@codejadee
claude plugin list
```
<!-- migration:end -->

Confirm the old identity is absent. Migration and explicit invocation under
the renamed namespace remain unverified. Intended explicit syntax is
`/chayen:chayen-security <request>`; see [Discovery](AUTOMATIC_SKILL_DISCOVERY.md).

## Disable, enable, update, uninstall

```bash
claude plugin disable chayen@codejadee
claude plugin enable chayen@codejadee
claude plugin marketplace update codejadee
claude plugin update chayen@codejadee
claude plugin list
claude plugin uninstall chayen@codejadee
claude plugin list
claude plugin marketplace remove codejadee
```

Manage the matching user/project/local scope. Verify changed installed
content and active version after update; unchanged `0.1.0-dev` can retain
old cached content. Inspect/reinstall when needed. Verify uninstall by
absence: disabled is still installed. Restart after changes. Do not delete
the whole provider configuration directory to remove Chayen.

## Optional: response style policy

The [policy](RESPONSE_STYLE.md) is opt-in, separate, unverified on hosts,
and not installed or removed with the plugin.

## Verification status

Current lifecycle, migration, routing and explicit invocation are NOT_RUN;
[Compatibility](COMPATIBILITY_MATRIX.md) separates historical evidence.
Security/Support is LATER; no channel is selected. Syntax was reviewed on
2026-10-18 against the [official command reference](https://code.claude.com/docs/en/plugins/cli-reference).
Use local help when versions differ.
