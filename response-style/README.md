# response-style

The opt-in multilingual response style policy (Step 39). It is not part of the
plugin package and is never activated by installing the plugin.

| File | Purpose |
|---|---|
| `chayen-response-style.md` | Canonical policy: one marked block, provider-neutral. Copy as is for dedicated files (Claude Code rules) or append to a shared instruction file. |
| `chayen-response-style.instructions.md` | Copilot template: `applyTo: "**"` frontmatter followed by the canonical file, byte for byte. |

Edit only the canonical file, then regenerate the template from it and bump the
marker version (`v1` → `v2`) for any wording change, so existing copies are
detected as outdated. Gate G-16 (`tools/validate/check-response-style.mjs`)
fails if the template drifts, the body exceeds 3,500 characters, a required
clause is missing, or the plugin package ships the policy.

Setup, verification, removal and conflict rules for users:
[docs/RESPONSE_STYLE.md](../docs/RESPONSE_STYLE.md). Evidence and host research:
[docs/chayen/RESPONSE_STYLE_DESIGN.md](../docs/chayen/RESPONSE_STYLE_DESIGN.md).
