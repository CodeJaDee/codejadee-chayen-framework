# Automatic skill discovery

Chayen relies entirely on each provider's **native** skill selection. It has
no router, hook, or background process of its own.

## How a skill is selected

1. **At session start**, the provider lists each installed skill's `name`
   and `description` in the model's context. This metadata is small: about
   5,500 characters for all 13 skills.
2. **When your request matches** a description, the model loads that skill's
   `SKILL.md`. The match is decided by the model, not by keywords.
3. **The skill then loads only what applies.** Its routing tables point to a
   technology reference for the stack it detects, and to one recipe for the
   task. Other references stay unloaded.

Descriptions state what each skill covers *and* what it does not, for
example "Not for UI components". This helps the model choose between
neighbouring skills.

| Provider | Selection (documented by the provider) |
|---|---|
| Claude Code | Loads a skill "when relevant" from its description. Plugin skills are namespaced `codejadee-chayen-framework:<skill>`. |
| Codex | "Codex can select a skill when your task matches its description." Implicit invocation is on by default. |
| Copilot CLI | "Copilot will decide when to use your skills based on your prompt and the skill's description." |
| VS Code Copilot Chat | Matches name and description, then loads the body. It "does not guarantee that it invokes a skill for every relevant prompt." Microsoft does not state whether this applies to plugin-bundled skills. |

## What happens when no skill applies

**Nothing changes.** If no description matches, no Chayen skill is loaded
and the agent behaves as it would without the plugin. This also happens
when:

- the request is general conversation or a quick question;
- the technology is out of scope, for example Rust, SwiftUI, Unity, COBOL,
  or Java/Spring Boot;
- you explicitly ask the agent not to use skills.

In testing (Claude Code, 2026-10-15), prompts of these kinds loaded no
Chayen skill in **12 of 12** runs.

A loaded skill also has its own boundary. Each skill says what it does not
cover and hands off by name: for example, "the chayen-data skill" for
schema work. If it finds the target is outside its scope, it stops applying
its guidance.

## How technologies are detected

Detection happens **inside a loaded skill**, from your repository's own
files. It is not a separate scan, and nothing is sent anywhere by Chayen.

| Evidence the skill looks for | Example |
|---|---|
| Project and package manifests | `*.csproj` / `global.json`, `package.json` and lock files, `pyproject.toml`, `angular.json`, `next.config.*`, `nuxt.config.*`, `vite.config.*` |
| Resolved framework and SDK versions | `<TargetFramework>net8.0`, `"@angular/core": "18.2.0"`, `"next": "14.2.15"` |
| Database provider and driver | `UseSqlServer` / `Microsoft.Data.SqlClient`, or `UseNpgsql` / `Npgsql` / `psycopg` |
| Existing conventions and commands | Test runners, lint and format configuration, CI scripts, repository instruction files (`AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`) |

**Rules the skills follow:**

- **Per owner.** In a monorepo, each app or service is detected separately.
  A sibling project's dependencies are not evidence for your target.
- **No implied stacks.** React does not imply Next.js, Vue does not imply
  Nuxt, and neither implies Vite. SQL Server and PostgreSQL are never
  treated as interchangeable.
- **Keep what exists.** Current frameworks, data-access libraries, and
  migration tools are kept. Replacing one needs an explicit request.
- **Unknown stays unknown.** If versions or providers cannot be determined,
  the skill reports that instead of guessing.

See [SUPPORTED_TECHNOLOGIES.md](SUPPORTED_TECHNOLOGIES.md).

## Explicit invocation

When you want a specific skill, name it:

| Provider and surface | Syntax | Verified |
|---|---|---|
| Claude Code CLI | `/codejadee-chayen-framework:chayen-<name> <request>` | Yes (2026-10-15, current build, through `--plugin-dir`) |
| Claude Code VS Code | Same, from the `/` menu | Not tested |
| Codex CLI | `$chayen-<name> <request>` | Earlier 6-skill build only |
| Copilot CLI | `/chayen-<name> <request>` | Earlier 6-skill build only |
| VS Code Copilot Chat | `/` menu (expected) | Not tested |

## Measured behaviour

Real Claude Code runs (2.1.270, 13 probes, 3–5 runs each, 43 runs in total, 2026-10-15) gave
these results:

| Measure | Result |
|---|---|
| Relevant skill loaded automatically for a matching task | 12 of 22 runs (55%) |
| Named skill loaded on explicit invocation | 6 of 6 runs |
| Wrong skill loaded | 0 of 18 loads |
| Skill loaded when none should | 0 of 8 runs |
| Skill-specific reference read | 10 of 22 runs |

Known weak spots:

- A Next.js route-handler bug loaded no skill in 5 of 5 runs. The agent
  still fixed it correctly.
- A pytest task loaded the testing skill in only 3 of 5 runs.
- Clear ASP.NET, Angular and SQL Server tasks loaded their skill in 2 of 3
  runs each. When the agent started by delegating exploration to a
  sub-agent, it often never loaded a skill.

Other providers have only results for an earlier build. Full data:
[docs/chayen/EVALUATION_REPORT.md](chayen/EVALUATION_REPORT.md).

## When a skill does not load

- **Work in the project folder.** In an empty folder, models often explore
  or answer directly instead of loading a skill.
- **Describe the task concretely**, with the technology and the action. For
  example, "Add EF Core paging to the orders endpoint" instead of "make it
  better".
- **Check for competing skills.** Personal or project skills with similar
  descriptions can be chosen instead (seen with Copilot). Built-in skills
  can win too, such as Claude Code's own security review. Disable
  overlapping skills in your provider, or invoke the Chayen skill
  explicitly.
- **Confirm the plugin is enabled:** `claude plugin list`,
  `codex plugin list`, or `copilot plugin list`.

## Context cost

| Load | Approximate size (characters ÷ 4) |
|---|---|
| Always present: names and descriptions of all 13 skills | ~1,400 tokens |
| When a skill loads: its `SKILL.md` | ~2,300–4,200 tokens |
| Plus the largest reference it might load | Up to ~7,300 tokens in total |

These are estimates, not provider token counts.
