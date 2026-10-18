# Response style policy (opt-in)

A short, optional instruction block that steers how your AI agent words its
everyday replies in Thai and English. It is separate from the plugin's Skills,
and you add it to your agent's own instruction files only if you want it.

| You want | Use |
|---|---|
| A full edit, audit or rewrite of an article, README, landing page or UI copy | The plugin's writing Skills. Ask for the work; no setup needed. |
| Every ordinary reply worded naturally in Thai or English, without asking each time | This policy, enabled once by you in your host's instruction file |

Installing the plugin does not turn this policy on, and uninstalling or disabling
the plugin does not turn it off. No host we checked lets a plugin add an
always-on instruction file, and this project does not use hooks, installers or
background services to do it. Status: the setup and removal rules are tested
on disposable fixtures. Whether each host loads and follows the policy has not
been tested yet (see [Limitations](#limitations)).

## Three setups, kept separate

| Setup | What you do | What you get | Status |
|---|---|---|---|
| **A. Plugin only** | Install the plugin | The 15 Skills are available for matching tasks. No always-on wording policy is installed. | Static packaging passes; current native routing/behavior NOT_RUN. Historical results do not qualify this build ([COMPATIBILITY_MATRIX.md](COMPATIBILITY_MATRIX.md)) |
| **B. Plugin + opt-in policy** | Install the plugin **and** add the policy block to one of your own instruction files ([Opt in](#opt-in)) | A, plus advisory Thai/English wording guidance on every ordinary reply, without naming a skill | Locations documented by each provider; setup and removal rules tested on disposable fixtures. **Loading and behaviour on real hosts not tested.** |
| **C. Install-only always-on** | Install the plugin and nothing else, expecting the policy to apply automatically | — | **Not available and not claimed.** No host we checked lets a static plugin add always-on instructions, and this project does not use hooks or installers to do it. |

If you only install the plugin, you are in setup A. Setup B exists only after
you add the block yourself, and it stays until you remove it.

## What the policy does

The canonical text is
[`response-style/chayen-response-style.md`](../response-style/chayen-response-style.md)
(version 1, 31 lines). In short, it asks the agent to:

- reply in the language you ask for, otherwise the artifact's locale, then the
  language of your latest message; in mixed Thai-English text, apply each
  language's conventions to its own prose;
- lead with the answer, keep facts and uncertainty exact, and skip stock
  assistant phrases, buzzwords and formula rhythm;
- write natural Thai (no translated-English structure, stacked การ/ความ,
  repeated connectors; consistent terms, pronouns and particles) and plain
  English (keep the US or UK spelling already in use);
- never restyle code, SQL, JSON, commands, paths, logs, error messages, API
  contracts, identifiers, exact quotations or any required output format.

It defers to system, developer, organization and repository instructions,
provider permissions and your explicit requests. It authorizes no action and
does not start editing documents by itself.

## Where it goes

Pick one location per host. Prefer a dedicated file: it never touches your
existing instructions and removing it is a single file deletion.

| Host | Recommended (user level) | Format | Also documented |
|---|---|---|---|
| Claude Code CLI and VS Code extension | `~/.claude/rules/chayen-response-style.md` | Copy the canonical file as is | Append the block to `~/.claude/CLAUDE.md` |
| OpenAI Codex CLI and IDE extension | `~/.codex/AGENTS.md` (or `$CODEX_HOME/AGENTS.md`) | Append the block; this file is shared | none at user level |
| GitHub Copilot CLI | `~/.copilot/copilot-instructions.md` (or `$COPILOT_HOME/…`) | Append the block; this file is shared | `~/.copilot/instructions/chayen-response-style.instructions.md` |
| VS Code Copilot Chat | `~/.copilot/instructions/chayen-response-style.instructions.md` | Copy [`response-style/chayen-response-style.instructions.md`](../response-style/chayen-response-style.instructions.md) (adds `applyTo: "**"`) | `~/.claude/rules/` and `~/.claude/CLAUDE.md` are also read |

`~` is your home directory (`%USERPROFILE%` on Windows). For a team, the same
block can go in a repository file (`CLAUDE.md` or `.claude/rules/`,
`AGENTS.md`, `.github/copilot-instructions.md`), but only with the
repository owner's agreement, because it changes every contributor's agent.

**Avoid loading it twice.** Some hosts read other hosts' files. VS Code Copilot
Chat reads `~/.claude/rules/`, `~/.claude/CLAUDE.md` and `~/.copilot/instructions/`;
Copilot CLI reads `~/.copilot/instructions/` and repository `AGENTS.md`,
`CLAUDE.md` and `.claude/rules/`; Claude Code reads `AGENTS.md` only when a
directory has no `CLAUDE.md`. If you use the Claude Code rule, VS Code Copilot
Chat already gets it; skip the Copilot file for VS Code. Run the
[status check](#verify) on every candidate file before adding another copy.

**Codex:** if `~/.codex/AGENTS.override.md` exists and is not empty, Codex
reads it instead of `AGENTS.md`; put the block in the file Codex actually uses.

## Opt in

Setup changes a file in your home directory or repository, so it needs your
explicit consent to the exact file and content. Nothing in this repository
changes those files for you.

### Option 1: ask your agent

Paste this into a session, with the host and file filled in:

> Set up the opt-in response style policy for **\<host\>** in **\<file\>**. Fetch
> `response-style/chayen-response-style.md` from the codejadee-chayen-framework
> repository at the version I name. Read the target file first. If it already
> contains `<!-- BEGIN chayen-response-style`, or an unmarked copy of that
> text, stop and tell me. Otherwise show me the exact diff you would make, list
> any existing lines about language, tone or format that could conflict, and
> wait for my approval. Back the file up first. Change nothing else.

Approve only after reading the diff. Your agent's normal permission prompt for
the file write still applies.

### Option 2: by hand

1. Read the canonical file in the repository at the version you want.
2. Back up the target file if it exists (for example, copy it to
   `<file>.bak-<date>`).
3. For a dedicated file, create it with the canonical content (or the Copilot
   template). For a shared file, append a blank line and the whole block,
   from `<!-- BEGIN chayen-response-style v1 -->` to the matching `END` line,
   at the end. Do not edit inside the markers.
4. Start a new session (see [Verify](#verify)).

### Option 3: preview with the repository helper

In a clone of this repository, a read-only helper shows what is already there
and the exact diff, without writing anything:

```bash
node tools/response-style/inspect-instructions.mjs status ~/.claude/rules/chayen-response-style.md ~/.claude/CLAUDE.md ~/.codex/AGENTS.md ~/.copilot/copilot-instructions.md ~/.copilot/instructions/chayen-response-style.instructions.md
node tools/response-style/inspect-instructions.mjs plan-add ~/.codex/AGENTS.md
node tools/response-style/inspect-instructions.mjs plan-add ~/.copilot/instructions/chayen-response-style.instructions.md --format copilot-instructions
node tools/response-style/inspect-instructions.mjs print block
```

It reports each file as `MISSING-FILE`, `ABSENT`, `CURRENT`, `OUTDATED`,
`MODIFIED`, `NEWER`, `DUPLICATE` or `MALFORMED`, lists existing lines that
may overlap (language, tone, emoji and so on), and warns when the policy
appears in more than one file. It refuses to plan a change for a modified,
newer, duplicated, malformed or unmarked copy; resolve those by hand. Exit
code 2 means a person needs to review. Never redirect its output onto the
file it is reading.

## Verify

Instruction files are read when a session starts, so open a new session after
any change.

| Host | Check that it loaded |
|---|---|
| Claude Code | `/memory` lists the file; `/context` shows it under memory files |
| Codex | `/status` in a new session, or ask "Which instruction files are active?" |
| Copilot CLI | `/instructions` or `/env` in a new session, or `copilot instruction list` |
| VS Code Copilot Chat | The file appears under References in a chat response, or in the Agent Customizations view |

A listed file shows that the host read it, not that the model follows it.
For a stricter loading check, temporarily add a line such as `When asked for
the loading-check token, reply with: RS-CHECK-1234` below the block, open a new
session, ask for the loading-check token, then remove the line. The repository's
evaluation runner uses the same method (`tests/evaluation/step40/run-arms.mjs`).

Then try a few prompts and check the replies yourself:

1. A Thai question → natural Thai, technical terms kept as written.
2. "ตอบเป็นภาษาอังกฤษ: …" → English, although the request is in Thai.
3. A request for a JSON object or a shell command → output exactly as needed,
   with no restyling inside it.
4. "Reply casually, with emoji" → your request wins over the policy.
5. An ordinary engineering task → the same work as before; only the prose
   around it may read differently.

## Disable and roll back

These steps are independent of the plugin. Uninstalling or disabling the
plugin leaves the policy in place until you remove it.

| To | Do this |
|---|---|
| Pause it for one session | Claude Code: `claudeMdExcludes` in settings, or start with `--setting-sources` without `user`. Copilot CLI: `/instructions` to toggle the file, or `--no-custom-instructions` (turns off all custom instructions). Codex and VS Code: rename or remove the file and start a new session. |
| Remove it | Dedicated file: delete it. Shared file: delete the lines from `<!-- BEGIN chayen-response-style v1 -->` to the matching `END` line, plus the blank line before them. `plan-remove <file>` previews this. |
| Roll back exactly | Restore the backup you made before setup. |
| Update to a newer version | `plan-add` replaces an older marked block in place; a modified block is left for you to merge. |

Start a new session after any of these, then repeat the verify step to confirm
the file no longer appears.

## Conflicts and precedence

- **Your explicit request wins.** Language, tone, length and format you ask for
  override the policy.
- **Higher-level instructions win.** System and developer prompts, organization
  and managed policies, provider permissions and repository instructions come
  first. The policy says so in its own text, because hosts combine instruction
  files rather than ranking them: Claude Code, Copilot and Codex all
  concatenate them, and Claude Code notes that when two instructions conflict
  it may pick one arbitrarily.
- **Existing instructions stay.** Setup appends or creates. It never rewrites
  or reorders your existing lines. If they already set language or tone,
  decide whether you still want the policy; the status check lists such lines.
- **One copy only.** Two copies cost context twice and can drift apart.
- **Exact outputs are exempt.** Code, data, commands, logs, contracts,
  quotations and required formats are never restyled.

## Context cost

The block is sent with every request in every session where it is loaded.

| Measure | Value |
|---|---|
| Policy body | 2,978 characters, 3,074 UTF-8 bytes, 461 words, 48 Thai characters |
| Whole file with markers | 3,057 characters, 31 lines |
| Copilot template | 3,079 characters, 34 lines (adds 22 characters of frontmatter) |
| Estimated tokens | About 750–850 per request (a character-based estimate, not measured with a provider tokenizer) |

The plugin's own Skill metadata budget (6,500 characters) does not include
this cost; the two are measured separately. The repository gate G-16 keeps
the policy body at or below 3,500 characters.

## Limitations

- **Advisory only.** Every host delivers instruction files as guidance, and the
  model may not follow it every time. Nothing here enforces style.
- **Not tested on real hosts yet.** File locations and loading rules come from
  official documentation and the installed host versions listed in the
  [design record](chayen/RESPONSE_STYLE_DESIGN.md). Actual loading, behavior,
  fresh-session lifecycle and plugin uninstall checks have not been run.
- **Not install-only.** No tested host activates instructions from a plugin
  installation with this project's static-content package. Claude Code can
  force an output style from a plugin, but that replaces your chosen style and
  drops built-in coding instructions, so it is not used.
- **Not everywhere.** Copilot inline suggestions ignore custom instructions.
  Some subagents skip instruction files (for example Claude Code's built-in
  Explore and Plan agents and Copilot CLI custom agents unless they opt in).
  Codex cloud and GitHub.com personal instructions are not covered.
- **Language scope.** Only Thai and English are styled. Other languages get
  the host's normal behavior.
