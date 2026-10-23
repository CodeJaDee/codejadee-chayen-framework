# Compatibility matrix

**Current build:** `1.1.2` (D-065): 16 Skills (13 engineering, 2 writing, 1 project knowledge). `1.1.1` and `1.1.2` change guidance text in five Skills since `1.1.0` and keep the Skill metadata. A working-tree snapshot of `1.1.2` was installed natively in isolated test profiles on 2026-10-23 (evolution Step 19); `1.0.0`, `1.1.0` and `1.1.1` were never installed on a host.
**Reviewed:** 2026-10-23, evolution Step 19. Production target: Claude Code CLI,
Codex CLI and GitHub Copilot CLI >=1.0.91, subject to release qualification.

## Current build (`1.1.2` working-tree snapshot, 2026-10-23)

Local-path marketplace, one isolated profile per CLI, no login and no model
turn. Real provider configurations were unchanged. Details, commands and
findings are in the
[Step 19 report](chayen/evolution/PROVIDER_SECURITY_REPORT.md).

| Check | Claude Code CLI | Codex CLI | Copilot CLI |
|---|---|---|---|
| Native version tested | 2.1.220 | 0.163.0 | 1.0.89, below the 1.0.91 minimum: BLOCKED |
| Native manifest validation (`plugin validate --strict`) | PASS | No such command | BLOCKED |
| Local marketplace register/install/list; identity `chayen@codejadee` 1.1.2 | PASS | PASS | BLOCKED |
| Native discovery; complete package hash | PASS; 16 Skills | PASS; 16 Skills, descriptions unshortened | BLOCKED |
| Disable/enable | PASS command; disabled loading BLOCKED | UNSUPPORTED subcommands; native config alternative PASS (0/16 disabled) | BLOCKED |
| Update version and content | PASS | UNSUPPORTED dedicated update; native remove/add PASS | BLOCKED |
| Uninstall, reinstall, new process, former-identifier migration | PASS | PASS | BLOCKED |
| Test-profile isolation | Configs unchanged; personal-Skill visibility not observable without a model session | FAIL: personal Skills from outside the profile are visible | BLOCKED |
| Qualification on a committed frozen candidate | BLOCKED; freeze pending | BLOCKED; freeze pending | BLOCKED |
| Automatic routing >=85%, explicit invocation, no-match | NOT_RUN | NOT_RUN | NOT_RUN |
| Adversarial security cases | BLOCKED | BLOCKED | BLOCKED |

## Previous candidate (`0.1.0-rc.1`, Phase 4)

Rows record the `0.1.0-rc.1` candidate, before `chayen-init` was added.

<!-- historical:start -->

| Check | Claude Code CLI | Codex CLI | Copilot CLI |
|---|---|---|---|
| Shared package/marketplace identity | PASS, static | PASS, static | PASS, static |
| Native version tested | 2.1.302 | 0.163.0 | Unavailable (ENOENT) |
| Local marketplace register/install/list | PASS | PASS | BLOCKED |
| Native discovery; complete package hash | PASS; 15 Skills | PASS; 15 Skills | BLOCKED |
| Disable/enable command | PASS | UNSUPPORTED subcommands; native config alternative PASS | BLOCKED |
| Disabled loading behavior | BLOCKED; details includes disabled contents | PASS; fresh inventory 0/15 after disable/enable | BLOCKED |
| Update version and content | PASS; RC.1 to scratch RC.2 | UNSUPPORTED dedicated update; native remove/add replacement PASS | BLOCKED |
| Uninstall and verified absence | PASS | PASS | BLOCKED |
| Reinstall/new-process inventory | PASS; 15 Skills | PASS; 15 Skills | BLOCKED |
| Former-identifier migration fixture | PASS; exact RC.1 restored | PASS; exact RC.1 restored | BLOCKED |
| Qualification on committed frozen candidate | BLOCKED; freeze pending | BLOCKED; freeze pending | BLOCKED |
| Automatic routing >=85% independently per CLI | NOT_RUN | NOT_RUN | NOT_RUN |
| Explicit invocation with current identity; no-match | NOT_RUN | NOT_RUN | NOT_RUN |
| Thai/English output quality | NOT_RUN | NOT_RUN | NOT_RUN |
| Response Style Policy loaded/followed | Deferred; unverified | Deferred; unverified | Deferred; unverified |

<!-- historical:end -->

These native results identify a working-tree snapshot based on
`9ef22cc9b6abf348d145f0df8ead160207526540`, package SHA-256
`9e5705fe32b19799d24ca9b671793fc54159943b0a6c12758b45f73d2c2833eb`.
They do not claim an already frozen commit. Exact operations, transcripts,
provider alternatives, migration scope and blockers are in the
[native lifecycle report](production/NATIVE_LIFECYCLE_REPORT.md).
Restart is a new native process, not conversation resumption. All profiles
were isolated; configuration/fixture checks passed. The three-provider gate
remains open. Security/Support is LATER and is unrelated to this lifecycle work.

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
