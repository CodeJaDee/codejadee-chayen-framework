# Automatic skill discovery

Chayen relies on native provider selection; it has no router or hook.
The current build has 16 Skills; L0 metadata uses 6,563 characters (about
1,641 tokens, estimated as characters / 4).

## How a skill is selected

The host exposes names/descriptions; its model chooses whether to load a
matching `SKILL.md`, then relevant local recipes/references. Selection and
compliance are not guaranteed.

The release requires **automatic routing >=85% independently on Claude Code
CLI, Codex CLI and GitHub Copilot CLI**. Phase 5 measures actual native
selection on the frozen build. Explicit invocations, lexical SIM scores and
answer-content guesses are excluded from the automatic denominator.
See [the release contract](production/RELEASE_SCOPE_DECISION.md).

## Discovery metadata and provider limits

Every host lists each installed Skill's name and description before any
Skill loads, on every turn. That listing is the discovery metadata (L0).

**Policy (D-066, [ADR-0013](chayen/ADRS/ADR-0013-extensible-skill-governance.md)).**
Chayen has no repository-level cap on Skill count or on total metadata.
Repository figures are advisory. Native provider limits still apply and are
not removable:

| Constraint | Source | Effect | Treatment |
|---|---|---|---|
| Description 1–1,024 characters; name ≤64, matching its folder | Agent Skills spec, Copilot, VS Code | An invalid Skill is rejected or silently not loaded | Validation error |
| Claude Code listing budget: 1% of the context window; each entry capped at 1,536 characters | Claude Code docs | Descriptions of the least-used Skills are dropped on overflow | Reported as UNKNOWN: it depends on the host's context window |
| Codex listing: 2% of the context window, or 8,000 characters when unknown | Codex docs | Descriptions are shortened first; Skills may be omitted | Warning when the metadata exceeds 8,000 characters |
| Copilot CLI and VS Code listing budget | Not documented | Unknown | Reported as UNKNOWN |

Provider budgets are shared with every other Skill installed on the host, so
Chayen's share is only part of the picture. None of these figures has been
measured on a host for this build (NOT_MEASURED).

Run `node tools/catalog/discovery-metrics.mjs` (add `--json` for a
machine-readable copy) to see the current totals, each Skill's
contribution, unusually long descriptions, the closest description pairs
(routing collision risk), and the provider diagnostics. These are static
diagnostics, kept separate from measured provider behaviour.

**Adding Skills.** More Skills mean more metadata on every turn and more
candidates for the model to choose between. An increase in the Skill
inventory needs routing and context evaluation on each provider before
production compatibility is claimed. Removing a cap does not mean every
provider can reliably discover an unlimited number of Skills. A
developer-only benchmark measures this with synthetic Skills in disposable
copies, never in the package. See the
[routing and context report](chayen/evolution/ROUTING_CONTEXT_REPORT.md).
Its static results are recorded; its provider routing results are NOT_RUN.

## What happens when no skill applies

Intended behavior is native handling without Chayen Skill selection.
General conversation, requests not to use Skills, and excluded frameworks
such as standalone Nitro/Elysia should follow this path. No-match correctness
still needs measurement on this build: the cases and a no-plugin comparison
arm are defined, and provider runs are NOT_RUN.

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
