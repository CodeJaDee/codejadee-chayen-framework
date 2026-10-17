# Licence proposal

**Status: PROPOSAL. Requires project-owner confirmation.** This is not
legal advice, and no `LICENSE` file has been created.

- **Current state:** the repository has no licence, and the manifests have
  no `license` field. Until a licence is published, the default is that no
  rights are granted beyond what the repository owner allows.
- **Why it blocks release:** a public marketplace listing or a public
  repository needs a licence decision first (ISSUES Q-05).

## What needs a licence

| Content | Nature |
|---|---|
| `plugins/codejadee-chayen-framework/` | Instructional Markdown (skills, references) and JSON manifests. This is the distributed product. |
| `tools/`, `tests/` | Developer JavaScript, shell scripts, and fixtures (.NET, Python, TypeScript). Not shipped to users. |
| `docs/`, `catalog/` | Documentation and catalogs |

## Options

| Option | Effect | Fits when |
|---|---|---|
| **A. MIT for everything** | Permissive and short. Anyone may reuse the skills, including commercially, with attribution. | The goal is the widest adoption and contributions |
| **B. Apache-2.0 for everything** | Permissive, with an explicit patent grant and a NOTICE mechanism | The organisation prefers explicit patent terms |
| **C. Apache-2.0 or MIT for code, CC BY 4.0 for skill and documentation content** | A content licence fits prose guidance; a code licence fits tools | Content reuse should require attribution in a content-appropriate form |
| **D. Proprietary / internal only** | No public reuse rights. Distribute only to authorized users. | The plugin stays internal to CodeJaDee |

**Recommendation for discussion:** choose **A or B** if a public release is
planned, or **D** if distribution stays internal. A single licence (A or B)
keeps the plugin package simple, because skills mix prose with code
snippets.

## Things to confirm alongside the licence

1. **The legal owner and copyright holder name**, as it should appear in
   `LICENSE` and in the manifests' `author`. The manifests currently say
   `CodeJaDee`; this has not been confirmed as a legal entity.
2. **The policy for AI-assisted content.** Much of the content was drafted
   with an AI assistant under the owner's direction. Confirm that the
   owner's organisation permits licensing such content, and whether any
   notice is wanted.
3. **Third-party material.** Skills reference public standards and
   documentation (OWASP and vendor docs) by name and URL. One skill adapts
   third-party material: `chayen-humanizer-en` adapts the pattern taxonomy
   and method of [humanizer](https://github.com/blader/humanizer) by Siqi
   Chen (MIT, Copyright (c) 2025 Siqi Chen). Its licence notice ships in
   `chayen-humanizer-en/references/upstream-notice.md`; on 2026-10-17 its
   licence block was compared byte for byte with upstream's `LICENSE` and
   matched. MIT permits reuse under any of options A–D **provided the notice
   stays with the adapted material**. The Thai skill uses the general method
   only. Decide whether a root third-party notices file is also wanted.
4. **Contribution terms**, whether inbound equals outbound or a CLA.

## After the decision (release step, not done now)

- Add `LICENSE` at the repository root.
- Add `"license": "<SPDX id>"` to **both** manifests. It must be identical
  in both (V-04 parity).
- Update the README credits, `docs/CONTRIBUTING.md`, and the marketplace
  listings.
