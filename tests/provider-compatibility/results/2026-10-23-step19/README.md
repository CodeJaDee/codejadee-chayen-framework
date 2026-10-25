# Step 19 native lifecycle and inspection evidence (2026-10-23)

Report: [PROVIDER_SECURITY_REPORT](../../../../docs/chayen/evolution/PROVIDER_SECURITY_REPORT.md).

`evidence.json` (`chayen-provider-security-evidence/1`) summarizes:

- the native lifecycle run of `qualify-rc.mjs` on the current working-tree
  snapshot (`chayen` 1.1.2, 16 Skills, metadata `411b6adbbea7e121`), one fresh
  isolated profile per CLI, local-path marketplace, no login, no model turn;
- Claude Code `plugin details` (component inventory and projected token cost)
  and `plugin validate --strict` on the marketplace and the plugin;
- the Codex native `skills/list` inventory (namespaced names, descriptions
  compared with source, Skills from outside the profile counted by scope);
- a read-only Copilot CLI inspection (`skill list`, `--plugin-dir … skill
  list`, `instruction list`). Copilot 1.0.89 is below the release minimum
  1.0.91, so this is informational and qualifies nothing;
- the subcommands each installed CLI's `--help` lists.

Raw transcripts, `results.json` and help output stay in the session scratch
directory outside the repository (execution rules §5). They contain local paths
and the names of the developer's personal Skills, which never enter this file.
The summary was written only after a check that it contains no absolute path,
no local directory name and none of the 44 personal Skill names.
