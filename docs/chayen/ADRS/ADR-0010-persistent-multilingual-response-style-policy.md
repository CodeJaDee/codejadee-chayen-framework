# ADR-0010: Persistent Multilingual Response Style Policy

- **Status:** PROPOSED — preferred initial architecture, not an accepted exception.
- **Date:** 2026-10-17
- **Related:** D-047, D-049, MHR-002, MHR-007–MHR-009, MHR-011–MHR-012;
  REQ-04, D-007, ADR-0002, ADR-0003, ADR-0005–ADR-0007.

## Context

The approved scope asks for ordinary response style guidance without explicit
Humanizer invocation. Native Skill discovery cannot establish persistent
application across no-match responses. ADR-0002 excludes always-on instruction
files; ADR-0003/D-007 require zero always-on content beyond L0 and native
no-match output. ADR-0006 confines provider differences to metadata. Optional
host instructions therefore need explicit exceptions, even when held outside
the package. No cross-host persistence guarantee has been verified here.

## Proposed decision

Adopt **Native Plugin + Opt-in Host Persistent Instructions** as the preferred
initial architecture, subject to owner approval and host verification:

| Mechanism | Contract |
|---|---|
| A — Native discovery | Relevant editorial requests may select a Humanizer Skill. No router or explicit branded invocation is required. Discovery remains probabilistic. |
| B — Opt-in persistent guidance | A user separately chooses a reviewed, static policy through a host-native instruction mechanism verified for that surface and scope. It guides ordinary prose without loading an editorial Skill body solely for style. |
| C — Strict install-only guaranteed always-on | **UNVERIFIED; not supported by available evidence.** Installing the native plugin alone is not claimed to provide this behavior. |

1. Preserve plugin-only behavior by default. B is a separately disclosed,
   explicit opt-in with its own context cost and lifecycle; it cannot be
   silently enabled by install or update.
2. Propose narrow amendments to ADR-0002/0003 and D-007: user-enabled B may
   affect language/tone of no-match prose, while task behavior, engineering
   routing, native permissions and higher-priority instructions remain native.
   REQ-04 retains its current meaning for plugin-only/disabled mode. The
   opt-in exception requires acceptance, not an assertion of unchanged output.
3. Maintain one provider-neutral policy source. Propose a narrow ADR-0006
   exception permitting provider-specific host integration documentation
   outside shared Skill content. Research location/scope/precedence/limits
   with official dated sources and actual loading tests before implementation.
4. Language selection follows MHR-002; exact-output constraints and protected
   code/terminology remain intact. B is not a catch-all rewriting Skill,
   cannot add facts, alter repository conventions or grant editing authority.
5. Opt-in must identify exact content and scope, preserve existing content,
   show a reviewable diff and record owned additions. Provide decline,
   disable, removal and rollback independently of plugin lifecycle. Do not
   assume plugin uninstall removes host instructions. A new session/reload
   requirement must be tested and documented per surface.
6. No hooks, MCP servers, executable installers, runtime dependencies or
   automatic user-level configuration changes. This ADR specifies no working
   host integration and Step 35 installs/configures nothing.

## Alternatives considered

| Alternative | Trade-off |
|---|---|
| Skill-only A | Preserves existing constraints but cannot meet persistent ordinary-response intent; useful default without B. |
| Always-relevant Humanizer Skill/router | Breaks bounded discovery/no-match and loads editorial work unnecessarily; rejected. |
| Session hooks, MCP router or installer | Breaks current zero-runtime/portability boundaries; outside authorized scope. |
| Require users to repeat style prompts | User-controlled but does not satisfy persistence intent. |
| Claim C from install alone | No verified evidence; rejected as a current support claim. |

## Consequences and trade-offs

B can express style independently from task selection while retaining a
static plugin. It adds setup, per-turn context cost, instruction conflict and
configuration drift. It may persist after plugin disable/uninstall; rollback
must address that explicitly. Model compliance is advisory and host behavior
can vary by surface/version. Policy overhead must be measured separately,
including Thai tokens; it is not hidden in the L0 budget.

## Compatibility impact and affected ADRs

ADR-0002 (no always-on files), ADR-0003/D-007/REQ-04 (no-match and zero
always-on) and ADR-0006 (metadata-only provider differences) require the
explicit scoped amendments above. ADR-0005's zero-runtime architecture and
ADR-0007's native authority/advisory boundaries remain. Existing ADR text and
status are unchanged while this record is PROPOSED. Compatibility with each
Claude Code, Codex and Copilot target surface is a requirement, **UNVERIFIED
for B**; no host file path or precedence is asserted as currently supported.

## Verification strategy and acceptance boundary

Later work records official URLs/access dates, host versions, actual source
loading and instruction scope/precedence/limits. Test a matrix of plugin
enabled/disabled, policy enabled/disabled, relevant/no-match/engineering
prompts, explicit user language/style overrides, exact output and conflicting
instructions. Use isolated fixtures to verify decline, existing-content
preservation, fresh-session loading, update, uninstall, independent policy
removal and rollback (MH-V07–MH-V09/MH-V11–MH-V12).

Do not infer C from successful B tests. If a surface cannot meet B under
these constraints, document the gap and return to owner review; no runtime
fallback is authorized. All policy behavior/lifecycle tests are NOT_RUN in
Step 35. Acceptance of this ADR and a separate step instruction are required
before dependent implementation.
