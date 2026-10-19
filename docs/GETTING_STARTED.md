# Getting started

Chayen targets a public MIT v0.1.0 release under CodeJaDee. The current
development build has 16 Skills and identifier `chayen@codejadee`. The newest,
`chayen-init`, is not in a released version yet (D-062), so an existing
`1.0.0` installation does not receive it until the version changes.

## 1. Choose a CLI

| Release host | Guide | Current native lifecycle/routing |
|---|---|---|
| Claude Code CLI | [Install](INSTALL_CLAUDE_CODE.md) | NOT_RUN |
| Codex CLI | [Install](INSTALL_CODEX.md) | NOT_RUN |
| GitHub Copilot CLI >=1.0.91 | [Install](INSTALL_COPILOT.md) | NOT_RUN |

VS Code runtime surfaces are unverified and deferred. Other desktop/cloud
surfaces have no Chayen production claim. See [Compatibility](COMPATIBILITY_MATRIX.md).

## 2. Install and verify

Review and pin a trusted source, then use the chosen native marketplace
manager. Until publication is confirmed you need repository access or an
authorized local clone. Verify `chayen` from `codejadee`, enabled state,
version and all 16 Skills. Start a new session. An old six-Skill cache or
the former long plugin identity is not this build; each install guide
includes migration and removal instructions.

## 3. Ask normally

| Intended task | Intended Skill |
|---|---|
| Fix an ASP.NET Core endpoint | `chayen-backend` |
| Add an Angular form | `chayen-frontend` |
| Tune a PostgreSQL query | `chayen-data` |
| Write invoice tests | `chayen-testing` |
| Polish Thai locale values without changing keys | `chayen-humanizer-th` |
| Tighten English copy without changing facts | `chayen-humanizer-en` |

These are scope examples, not current runtime results. The >=85% per-CLI
automatic-routing gate awaits Phase 5. Standalone Nitro/Elysia tasks are
out of scope. Native no-match behavior must also be verified on this build.

## 4. Explicit invocation

| CLI | Intended example |
|---|---|
| Claude Code | `/chayen:chayen-security Review this controller.` |
| Codex | `$chayen-security Review this controller.` |
| Copilot | `/chayen-security Review this controller.` |

Explicit invocation under the current identity remains unverified.
[Automatic Skill Discovery](AUTOMATIC_SKILL_DISCOVERY.md) explains evidence.

## 5. Editing and verification

Keep native permissions enabled. Inspect proposed changes and verification
evidence. Humanizer edits copy and preserves facts, Thai numerals/calendar
eras, identifiers, markup and placeholders. i18n framework configuration,
locale routing and key wiring remain engineering tasks.
[Writing and editing](WRITING_AND_EDITING.md) describes its modes.

The [Response Style Policy](RESPONSE_STYLE.md) is opt-in and separate.
Host loading/behavior is unverified. Plugin removal leaves it in place;
remove only your own marked policy block if you no longer want it.

## 6. Turn it off or remove it

Use native disable/uninstall and check the resulting installed list.
Disabled means still installed. Verify absence, including any old plugin
identity, before recording successful removal. Actual provider lifecycle
behavior is still a release qualification task.

## 7. Get help

Security/Support remains LATER; no channel has been selected. Prepare a
redacted reproduction using [Contributing](CONTRIBUTING.md#reporting-bugs).
Do not send vulnerabilities publicly; see [SECURITY.md](../SECURITY.md).
