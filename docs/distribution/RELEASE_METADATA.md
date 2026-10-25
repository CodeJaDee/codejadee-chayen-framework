# Release metadata

> **Owner update (2026-10-18):** GitHub Actions and GitHub Releases are not used. Stable status is declared only for the approved `0.1.0` manifest/source after manual checks. Git tags remain optional. Historical text below about remote CI or required tags is superseded.


> **Owner decision D-061 (2026-10-18):** released as **`1.0.0`** instead of
> the `0.1.0` target, from the public repository, MIT, publisher CodeJaDee,
> Git tag `v1.0.0`. No GitHub Release is created. The table below is current;
> the strategy text after it is the earlier `0.1.0` plan.

> **Decision D-064 (2026-10-20):** version `1.1.1`, a guidance-only update to
> the same 16 Skills, after `1.1.0` (D-063). Git tags remain optional.

> **Decision D-065 (2026-10-20):** version `1.1.2`, a second guidance-only
> update to the same 16 Skills.

> **Decision D-077 (2026-10-23):** version `1.1.3`, a guidance-only update to
> the same 16 Skills (evolution program, Steps 07–13); Skill metadata unchanged.
> Not release-qualified: runtime evaluation remains NOT_RUN.

> **Decision D-079 (2026-10-25):** version `1.1.4`, a guidance-only update to
> the same 16 Skills (`chayen-init` direct generation, D-078); Skill metadata
> unchanged. Not release-qualified: runtime evaluation remains NOT_RUN.

## Current build

| Field | Actual value |
|---|---|
| Plugin name | `chayen` |
| Marketplace name | `codejadee` |
| Version | `1.1.4` in both manifests and both Copilot version fields (D-079; `1.1.3` under D-077, `1.1.2` under D-065, `1.1.1` under D-064, `1.1.0` under D-063, `1.0.0` under D-061) |
| Publisher | `CodeJaDee`, confirmed by the Phase 1 owner decision |
| Source directory | `plugins/codejadee-chayen-framework/`, shared by all three marketplaces |
| Entry Skills | 16: 13 engineering, 2 writing, 1 project knowledge |
| Project licence | MIT; root `LICENSE`, plugin `LICENSE.md` and both manifests' `license` |
| Upstream licence | Existing Humanizer MIT notice/attribution retained and guarded |
| Public source | `https://github.com/CodeJaDee/codejadee-chayen-framework`, public since 2026-10-18 |
| Production host target | Claude Code CLI, Codex CLI, GitHub Copilot CLI |
| Security/Support | LATER; no contact or channel selected |

## Version and tag strategy

Use `0.1.0-dev` -> `0.1.0-rc.1` -> `0.1.0`; further candidates increment
the RC suffix. Apply each authorized version identically in exactly four
fields: root plugin manifest, Claude manifest, Copilot marketplace entry,
and Copilot marketplace `metadata.version`. Claude/Codex marketplaces do not
have independent plugin-version fields.

Keep the accepted [ADR-0008](../chayen/ADRS/ADR-0008-packaging-and-marketplace-strategy.md)
Git tag form **`vX.Y.Z`**: `v0.1.0-rc.1`, then `v0.1.0`. Phase 3 removes the
contradictory checklist suggestion of provider-generated tags. No tag
is created by this work. Phase 4 applies the already approved candidate
version; it does not authorize a commit or publication. Exact snapshot and
native evidence: [lifecycle report](../production/NATIVE_LIFECYCLE_REPORT.md).

At candidate freeze, add the project MIT licence using the confirmed rights
holder, add `license: MIT` in both manifests, and align CHANGELOG and
SECURITY supported versions. Do not replace the upstream Humanizer notice.
Optional description/keyword expansions require a reviewed candidate change;
this phase does not apply them.

## Verification and authorization

Run package validation, identity parity, documentation consistency and all
offline gates. Runtime and routing evidence must name the frozen revision;
old measurements cannot qualify the candidate. Public installation needs
separate real-provider evidence after authorized publication.

Unprotected `main` is an accepted process risk. Use
[manual release sign-off](../production/MANUAL_RELEASE_SIGNOFF.md) before
commit/push/tag/publication. GitHub Actions have been discontinued. Record local offline checks on the
exact stable source revision instead. Security/Support stays pending; no channel is invented here.
