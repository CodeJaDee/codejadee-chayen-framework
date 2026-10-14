# Codex IDE extension (VS Code)

**Status as of 2026-10-14: UNSUPPORTED (documented).** Not tested
empirically.

OpenAI's documentation (https://learn.chatgpt.com/docs/plugins, checked
2026-10-14) states:

- "The IDE extension doesn't support plugins."
- "To browse and install plugins for Codex, use the ChatGPT desktop app or
  Codex CLI."

The same documentation says the IDE extension **does** load standalone
skills from `.agents/skills` (https://learn.chatgpt.com/docs/build-skills).
That is not a native plugin install. Whether to document manual skill copying
for this surface is an open user decision (ISSUES Q-02). No installer script
will be provided (EX-02).

## Re-check procedure (on each Codex extension release)

1. Read the extension release notes and the plugins page for plugin support.
2. If plugin support appears, run the same ten checks as in
   `claude-code-vscode.md`, using the extension's plugin UI. Record the
   results and update this file.
