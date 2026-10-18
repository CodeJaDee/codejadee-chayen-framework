# Automatic skill discovery

Chayen relies on native provider selection; it has no router or hook.
The current build has 15 Skills; L0 metadata uses 6,217 / 6,500 characters.

## How a skill is selected

The host exposes names/descriptions; its model chooses whether to load a
matching `SKILL.md`, then relevant local recipes/references. Selection and
compliance are not guaranteed.

The release requires **automatic routing >=85% independently on Claude Code
CLI, Codex CLI and GitHub Copilot CLI**. Phase 5 measures actual native
selection on the frozen build. Explicit invocations, lexical SIM scores and
answer-content guesses are excluded from the automatic denominator.
See [the release contract](production/RELEASE_SCOPE_DECISION.md).

## What happens when no skill applies

Intended behavior is native handling without Chayen Skill selection.
General conversation, requests not to use Skills, and excluded frameworks
such as standalone Nitro/Elysia should follow this path. No-match correctness
still needs measurement on this build.

## Writing skills and their neighbours

| Request | Owner |
|---|---|
| Thai prose or Thai copy inside locale files | `chayen-humanizer-th` |
| English prose | `chayen-humanizer-en` |
| Verify README commands/engineering facts | `chayen-documentation` |
| Configure i18n, locale routing or key wiring | Owning engineering Skill, usually `chayen-frontend` |
| Change application logic | Owning engineering Skill |

Copy edits preserve numeric meanings, Thai numerals, Gregorian/BE dates,
identifiers and markup; conversions require an explicit request.
See [Writing and editing](WRITING_AND_EDITING.md).

## How technologies are detected

A loaded Skill inspects its owning project's manifests, lock files,
versions, configuration and commands. Sibling dependencies do not determine
the target's stack. React does not imply Next.js; Vue does not imply Nuxt;
SQL Server and PostgreSQL are distinct. Unknowns remain unknown.
See [Supported technologies](SUPPORTED_TECHNOLOGIES.md).

## Explicit invocation

| CLI | Intended syntax | Current verification |
|---|---|---|
| Claude Code | `/chayen:chayen-security <request>` | NOT_RUN under current namespace/build |
| Codex | `$chayen-security <request>` | NOT_RUN for current build |
| Copilot | `/chayen-security <request>` | NOT_RUN for current build |

VS Code is unverified/deferred. Historical Claude explicit results used the
old namespace and do not prove `/chayen:` works on this build.

## Measured behaviour

There are **no current runtime routing results**. Phase 2 description
changes reset historical evidence. [Compatibility](COMPATIBILITY_MATRIX.md)
lists old measurements; they are not pooled across builds or CLIs.
The evaluation suite's SIM proxy is diagnostic, not a release result.

## When a skill does not load

Check native installed/enabled state, identity and cache contents. Start a
new session. Compare the request with the Skill scope and use explicit
invocation when appropriate. Record native selection events rather than
inferring activation from the answer. Prepare a redacted reproduction;
Support remains LATER and no channel is selected.
