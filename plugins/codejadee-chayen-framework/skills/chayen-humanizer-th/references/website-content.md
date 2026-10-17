---
kind: checklist
---
# Website and product copy in Thai

Edit visible Thai copy in a website or app repository without changing how
the site behaves. Load `protected-content.md` alongside this checklist.

## Before editing

- **Right repository.** Edit only the repository and files the user pointed
  to. Reading a live public site does not authorize editing its repository,
  its CMS or any other site.
- **Locate the copy.** Find where the visible text lives: components,
  templates, localization files, CMS exports or Markdown content. Prefer the
  localization file when the project has one; do not move strings between
  files.
- **Mode.** Audit-only requests produce findings and leave files unchanged.
  Edit requests produce a preview first when approval is needed.
- **Constraints.** Note length limits from the design (buttons, cards, meta
  descriptions), the brand voice, glossary and the particles policy.

## Copy types

| Type | What good Thai copy does | Watch for |
|---|---|---|
| Hero and value proposition | States who it is for and the concrete benefit in one or two short lines | TH-08 openings, TH-09 praise, TH-12 slogans |
| Call to action | A short verb phrase for the action: "เริ่มใช้งานฟรี", "ดูราคา", "ติดต่อฝ่ายขาย" | Vague labels ("คลิกที่นี่"), length that breaks the layout |
| Product description | Facts first: what it is, size, material, compatibility, then the benefit | TH-10 claims, invented specifications |
| Buttons and labels | Consistent verbs across the product; the same action has the same word everywhere | Mixed synonyms for one action (บันทึก, เซฟ, จัดเก็บ) |
| Error messages | What happened and what to do next, without blame | "คุณกรอกผิด", technical codes shown with no explanation, TH-07 register |
| Empty states and confirmations | What the user can do now; for destructive actions, what will be lost | Cheerful tone on a destructive confirmation |
| SEO title and meta description | The page's actual topic in natural Thai, close to the existing length | Keyword stuffing, claims the page does not support |

Thai has no spaces between words, so browsers choose line breaks with a
dictionary. Very long labels and unbroken phrases can wrap badly; keep
replacements close to the original length and flag strings that may overflow.

## Preview and apply

1. Collect the copy changes as a reviewable diff of the strings only.
2. Show the preview when the change is user-facing in a shared repository,
   touches many files, or the user asked to review first. Wait for approval.
3. Apply only the approved strings. Leave formatting, quotes and escaping in
   the file's existing style.
4. Run the project's existing checks that cover the edited files, such as
   lint, type check, localization validation or a build. Report each as PASS,
   FAIL or NOT_RUN with the command. Do not add new tools or dependencies.
5. Report changed files and any strings left unchanged with the reason.

Never commit, push, deploy, publish to a CMS or clear caches unless the user
asked for that specific action.

## What stays out of scope

Component logic, props, styling, class names, routes, redirects, data
fetching, analytics identifiers, feature flags, form validation rules and
accessibility behavior beyond the wording of labels belong to frontend
engineering. When copy changes need one of these (for example a longer label
that needs a layout change), report the need and leave the code unchanged.
