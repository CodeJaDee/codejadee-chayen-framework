---
kind: checklist
---
# Website and product copy in English

Edit visible English copy in a website or app repository without changing how
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
  descriptions), the brand voice, the glossary, the spelling variety and any
  legal copy that is owner-approved.

## Copy types

| Type | What good copy does | Watch for |
|---|---|---|
| Hero and value proposition | Says who it is for and the concrete benefit in one or two short lines | EN-04 run-ups, EN-12 buzzwords, EN-15 praise, EN-01 contrasts |
| Call to action | A short verb phrase for the action: "Start free trial", "See pricing", "Contact sales" | Vague labels ("Click here"), length that breaks the layout |
| Product description | Facts first (what it is, size, material, compatibility), then the benefit | EN-17 claims, invented specifications, EN-06 triads |
| Buttons and labels | The same action carries the same word everywhere | Mixed synonyms for one action (Save, Store, Keep) |
| Error messages | What happened and what to do next, without blame | "You entered an invalid...", exclamation marks, raw codes with no explanation (EN-26) |
| Empty states and confirmations | What the user can do now; for destructive actions, what will be lost | A cheerful tone on a destructive confirmation |
| SEO title and meta description | The page's actual topic in natural English, close to the existing length | Keyword stuffing, claims the page does not support |
| Alt text | What the image shows or does for the reader | "Image of...", decorative filler |

Strings may be truncated by the layout. Keep replacements close to the
original length and flag any string that may overflow.

## Preview and apply

1. Collect the copy changes as a reviewable diff of the strings only.
2. Show the preview when the change is user-facing in a shared repository,
   touches many files, or the user asked to review first. Wait for approval.
3. Apply only the approved strings. Leave formatting, quotes and escaping in
   the file's existing style.
4. Run the project's existing checks that cover the edited files, such as
   lint, type check, localization validation or a build. Report each as PASS,
   FAIL or NOT_RUN with the command. Do not add new tools or dependencies.
5. Report changed files and any strings left unchanged, with the reason.

Never commit, push, deploy, publish to a CMS or clear caches unless the user
asked for that specific action.

## What stays out of scope

Component logic, props, styling, class names, routes, redirects, data
fetching, analytics identifiers, feature flags, form validation rules and
accessibility behavior beyond the wording of labels belong to frontend
engineering. When copy changes need one of these (for example a longer label
that needs a layout change), report the need and leave the code unchanged.
