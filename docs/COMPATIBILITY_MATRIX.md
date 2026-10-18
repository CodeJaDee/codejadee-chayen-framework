# Compatibility matrix

**Current build:** `0.1.0-dev`, 15 Skills (13 engineering, 2 writing).
**Reviewed:** 2026-10-18, Phase 3. Production target: Claude Code CLI,
Codex CLI and GitHub Copilot CLI >=1.0.91, subject to release qualification.

## Current build

| Check | Claude Code CLI | Codex CLI | Copilot CLI |
|---|---|---|---|
| Shared package/marketplace identity | PASS, static | PASS, static | PASS, static |
| Native install/discover/toggle/update/uninstall | NOT_RUN | NOT_RUN | NOT_RUN |
| Automatic routing >=85% independently per CLI | NOT_RUN | NOT_RUN | NOT_RUN |
| Explicit invocation with current identity; no-match | NOT_RUN | NOT_RUN | NOT_RUN |
| Thai/English output quality | NOT_RUN | NOT_RUN | NOT_RUN |
| Response Style Policy loaded/followed | Deferred; unverified | Deferred; unverified | Deferred; unverified |

Offline results do not qualify runtime behavior. No routing PASS exists for
current metadata fingerprint `339b3125d1347648`. Phase 2 description changes
invalidated historical routing evidence. Phase 5 must record native selection
events, revision, provider version and fingerprint. Lexical SIM is not evidence.

## VS Code and other surfaces

Claude Code's VS Code extension and VS Code Copilot Chat are **unverified**
and outside the v0.1.0 support claim; their runtime tests are deferred.
Codex IDE plugin support was recorded as unavailable in the historical
inspection and has not been re-qualified for Chayen. No current IDE support
is claimed. Desktop/cloud surfaces are outside the release target.
A CLI result never establishes an IDE or cloud result.

## Historical evidence (not current qualification)

<!-- historical:start -->
| Date/build | Observed result | Limits |
|---|---|---|
| 2026-10-14, 6-skill package, old identity | Local-marketplace lifecycle and smoke runs recorded for the three CLIs | Update content was not proved; Copilot local uninstall only disabled the plugin, which fails current removal criteria |
| 2026-10-15, 13-skill package, Claude Code CLI 2.1.270 | 12/22 automatic relevant runs (55%), 6/6 explicit, 12/12 no-match, 10/22 reference loads | Loaded through `--plugin-dir`, not current native installation; explicit results used the former namespace |
<!-- historical:end -->

History: [provider results](../tests/provider-compatibility/results/2026-10-14-step06.md)
and [evaluation report](chayen/EVALUATION_REPORT.md). The
[Step 40 dataset](../tests/evaluation/step40/README.md) has 120 quality cases
and 55 discovery probes; case specifications do not imply executed results.

## Lifecycle evidence requirements

Use the [isolated runbook](../tests/provider-compatibility/README.md).
Inspect installed CLI help; absent commands are NOT_RUN, never guessed.
Verify changed update content and active version, and uninstall by absence.
Local-source success does not prove public remote installation.
No native lifecycle was executed in Phase 3.
