# Release metadata

Reviewed 2026-10-18, Phase 4. Approved target: **Chayen v0.1.0, PUBLIC,
MIT, publisher CodeJaDee**. These decisions do not mean the release has
been published or the project licence applied.

## Current build

| Field | Actual value |
|---|---|
| Plugin name | `chayen` |
| Marketplace name | `codejadee` |
| Version | `0.1.0-rc.1` in both manifests and both Copilot version fields; applied in Phase 4 under OWN-07 |
| Publisher | `CodeJaDee`, confirmed by the Phase 1 owner decision |
| Source directory | `plugins/codejadee-chayen-framework/`, shared by all three marketplaces |
| Entry Skills | 15: 13 engineering, 2 writing |
| Project licence | MIT chosen; root LICENSE and manifest licence not applied yet |
| Upstream licence | Existing Humanizer MIT notice/attribution retained and guarded |
| Public source | Target is `CodeJaDee/codejadee-chayen-framework`; public availability unverified here |
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
commit/push/tag/publication. Remote CI is NOT_RUN until actual run logs are
observed. Security/Support stays pending; no channel is invented here.
