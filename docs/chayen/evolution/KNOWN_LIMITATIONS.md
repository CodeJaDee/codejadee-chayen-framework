# Chayen Evolution — Known Limitations (Step 20)

- **Date:** 2026-10-23
- **Scope:** limitations of the evolution program's results at `26bfbd0`.
- **Not covered:** the product's user-facing limitations, which are in
  [docs/SECURITY_AND_LIMITATIONS.md](../../SECURITY_AND_LIMITATIONS.md).

Finding IDs refer to [FINAL_AUDIT_REPORT.md](FINAL_AUDIT_REPORT.md) §5.

## 1. Unverified behaviour (NOT_RUN or BLOCKED)

Nothing below has a passing result. None of it may be described as working.

| Behaviour | Status | Why | What unblocks it |
|---|---|---|---|
| Agents follow any shipped Skill guidance: task contract, evidence contract, audit, project map | NOT_RUN | No agent run on the current guidance | Authorized provider runs with graded transcripts |
| Automatic routing ≥85% per CLI | NOT_RUN | No billed-call authorization; no signed-in isolated homes | `run-phase5.mjs --suite routing` per CLI (Step 14 candidate) |
| Explicit invocation per CLI | NOT_RUN | As above. Codex lists plugin Skills as `chayen:<skill>`, so the documented `$chayen-<skill>` is unconfirmed | As above |
| No-match and unsupported-request behaviour | NOT_RUN | As above | Phase 5 negative and no-match probes, both arms |
| Routing with more than 16 Skills | NOT_RUN | Also needs approved installs of synthetic test packages | Step 18 `--plan`: 2,385 calls |
| Adversarial security cases (16 cases, 8 categories) | BLOCKED | No authenticated isolated home; no billed-call authorization | 96 calls per CLI |
| Copilot CLI lifecycle and behaviour | BLOCKED | 1.0.89 installed, 1.0.91 required; upgrade not authorized | Install ≥1.0.91; rerun `qualify-rc.mjs` |
| Claude disabled-plugin loading | BLOCKED | `plugin details` lists disabled plugins; needs a model session | Authorized session test |
| Real coding comparison (A/B/C), rework and efficiency values | BLOCKED / NOT_MEASURED | No reachable Linux container engine | Digest-pinned image, egress-restricted engine, authorization |
| Angular component specs (tasks B, C) | NOT_RUN | No `node_modules`; installs not authorized | `npm ci` authorization |
| Live failure replay and live distillation comparison | NOT_RUN | No runner authorization | Authorized replays |
| Lifecycle on a committed frozen candidate | NOT_RUN | Step 19 ran on a working-tree snapshot; `7bbb39b` was committed afterwards | `candidate.mjs prepare` on a clean commit, then rerun the lifecycle |
| Remote or public marketplace installation | NOT_RUN | Only local-path marketplaces were used | A published marketplace |
| VS Code surfaces | NOT_RUN | UI not automatable here | Manual runbooks |

## 2. Security and compatibility risks

| Risk | Finding | Notes |
|---|---|---|
| Codex reads personal Skills from the real user profile despite HOME, USERPROFILE and `CODEX_HOME` overrides (Windows, 0.163.0) | F-03 | Contaminates Codex routing and security results on such hosts; detected by `inventory-isolation` |
| Copilot non-interactive mode may require `--allow-all-tools`, which INV-04 forbids | F-02 | Copilot evaluation design is undecided |
| Copilot Skill precedence is first-found-wins; a same-named personal or project Skill shadows Chayen's | Step 19 F-05 | Documented provider behaviour |
| The guidance validator guards phrasings, not meaning | F-06 | Weakened guidance can pass G-18 |
| The reference audit grader ignores run exit codes and cannot derive BLOCKED | F-05 | Affects the grader contract (G-22), not the shipped guidance |
| Committed evidence privacy scanning is heuristic | F-12 | Personal Skill names are not detected; one historical file names one |
| Two historical evidence files contain local user paths | Step 19 F-02 | Redaction rewrites recorded evidence and needs owner approval |
| Config-home overrides are not an OS sandbox | Step 19 | Lifecycle isolation relies on hashing real configs before and after |
| Static guards show that guidance exists, not that agents obey it | — | Applies to every injection, forged-approval and secrets rule |

## 3. Process and tooling limitations

- **Version.** The shipped guidance differs from `v1.1.2` in 31 files under
  the same version string (F-04).
- **Snapshot pins.** Adding a real 17th Skill makes four pinned tests fail
  until they are updated (F-07).
- **Stale-limit detection** covers only L0 used/budget pairs and the listed
  rule rows. `docs/chayen` prose is not scanned (F-08).
- **Verifiability of Step 19 evidence.** `evidence.json` is a summary. Its
  generator and the raw transcripts were kept outside the repository by
  design, so the native figures cannot be re-derived from the repository
  (F-13).
- **Single host.** Every native observation comes from one Windows host:
  Node 26.8.1, Claude Code 2.1.220, Codex 0.163.0, Copilot 1.0.89. The
  Claude Code version is older than Phase 4's 2.1.302.
- **Small samples.** Per-type routing cases (2–16) and coding tasks (6) give
  wide intervals even after live runs.
- **Same-session authorship.** Steps 18–20 were written and first audited in
  one agent session. Step 20 mitigated this with independent reviewers,
  which is still not a human review.
