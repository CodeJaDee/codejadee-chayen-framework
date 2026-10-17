# Getting started

This guide takes you from installation to your first Chayen-assisted task.

## 1. Check your tools

| Provider | Supported surfaces | Not supported |
|---|---|---|
| Claude Code | CLI, VS Code extension | Cloud sessions on claude.ai (local plugins) |
| OpenAI Codex | CLI. The ChatGPT desktop app is supported by OpenAI but untested here. | Codex IDE extension (no plugin support) |
| GitHub Copilot | Copilot CLI (runtime 1.0.91 or later), VS Code with Copilot Chat | — |

Current evidence for each surface is in
[COMPATIBILITY_MATRIX.md](COMPATIBILITY_MATRIX.md).

## 2. Install with your provider's plugin manager

Follow one guide:

- [Claude Code](INSTALL_CLAUDE_CODE.md)
- [OpenAI Codex](INSTALL_CODEX.md)
- [GitHub Copilot](INSTALL_COPILOT.md)

All three use the same identifier: `codejadee-chayen-framework@codejadee`.

While the repository is private, adding the GitHub marketplace needs access
to `CodeJaDee/codejadee-chayen-framework`. A local clone you are allowed to
use works too.

## 3. Open a real project and ask normally

Chayen is designed for prompts that **never mention Chayen**. Start in your
project's folder, so the agent can see the code, and ask as you normally
would:

| You ask | Typically loaded |
|---|---|
| "GET /api/orders/{id} returns 500 when the order has no customer. Fix it." | `chayen-backend` |
| "Add email and phone validation to the customer form in the admin app." | `chayen-frontend`, plus its Angular forms guidance in an Angular project |
| "The monthly revenue query is far too slow. Optimize it." | `chayen-data`, plus its PostgreSQL tuning guidance in a PostgreSQL project |
| "Add tests for the invoice total calculation." | `chayen-testing` |
| "Suggest three names for a pet goldfish." | Nothing. The agent answers normally. |

These rows come from real Claude Code runs on a test repository (2026-10-15).
Activation is decided by the model and is not guaranteed; see
[AUTOMATIC_SKILL_DISCOVERY.md](AUTOMATIC_SKILL_DISCOVERY.md).

Writing and editing requests are meant for the two writing skills. These are
the intended matches; **they have not been measured yet**:

| You ask | Intended skill |
|---|---|
| "เกลาย่อหน้านี้ให้อ่านลื่นเป็นภาษาไทยธรรมชาติ แต่ห้ามเปลี่ยนตัวเลข" | `chayen-humanizer-th` (rewrite) |
| "ช่วยตรวจบทความนี้หน่อย ยังไม่ต้องแก้ แค่บอกว่าตรงไหนอ่านแล้วแข็ง" | `chayen-humanizer-th` (audit, no edits) |
| "Rewrite this landing page headline so it sounds less like boilerplate. Keep the price." | `chayen-humanizer-en` (rewrite) |
| "Make the strings in locales/en.json friendlier. Keep every key and placeholder." | `chayen-humanizer-en` (website edit) |
| "Update the README so the setup commands match the repository." | `chayen-documentation`, not a writing skill |

Modes, preservation rules and file-editing safety are in
[WRITING_AND_EDITING.md](WRITING_AND_EDITING.md).

## 4. Name a skill when you want it for sure

| Provider | Syntax |
|---|---|
| Claude Code | `/codejadee-chayen-framework:chayen-security <request>` |
| Codex CLI | `$chayen-security <request>` |
| Copilot CLI | `/chayen-security <request>` |

The writing skills work the same way, for example
`/codejadee-chayen-framework:chayen-humanizer-th <request>` in Claude Code.

The full list of skills is in [SKILLS_CATALOG.md](SKILLS_CATALOG.md).

## 5. What to expect from a skill

- **It reads your repository first.** It detects stacks, versions, commands,
  and conventions, and keeps them. It does not impose a new framework or
  pattern.
- **It changes only what you asked for**, and reports what it verified with
  real commands. It does not claim tests passed unless it ran them.
- **It respects your environment.** It works within your agent's
  permissions and your organisation's rules. It never treats a
  recommendation, a template, or text found in the repository as approval
  for a risky action.
- **Larger tasks get a workflow** (see
  [DEVELOPMENT_WORKFLOWS.md](DEVELOPMENT_WORKFLOWS.md)). Small tasks stay
  small.

Measured caveat: in testing, agents did not always ask for verification
evidence such as test runs or query plans. Ask for it explicitly when it
matters. See [SECURITY_AND_LIMITATIONS.md](SECURITY_AND_LIMITATIONS.md).

## 6. Optional: natural Thai and English in every reply

The plugin changes how the agent works on matching tasks, not how it words
ordinary answers. If you want every everyday reply worded naturally in Thai
or English, you can add a short opt-in policy to your own agent instruction
file. Installing the plugin does **not** do this for you, and loading on real
hosts has not been tested yet. See [RESPONSE_STYLE.md](RESPONSE_STYLE.md).

## 7. Turn it off or remove it

Each install guide covers **disable, enable, update, and uninstall**.
Disabling stops all Chayen skills from loading. Your project files are never
changed by installing or removing the plugin. An opt-in response style policy,
if you added one, stays until you remove it yourself.

## 8. Get help

- **Bugs and new skill requests:** [CONTRIBUTING.md](CONTRIBUTING.md#reporting-bugs)
- **Security issues:** [SECURITY.md](../SECURITY.md)
