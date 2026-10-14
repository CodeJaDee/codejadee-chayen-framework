---
kind: recipe
capabilities: [CAP-07-006]
---
# Accessibility audit and fixes

Audit UI against WCAG 2.2 level AA, report each finding with its success
criterion, location, impact, and fix, then apply the approved fixes. An
automated scan finds only part of the problems, so the audit combines tool
output with a manual review.

## Inputs

- The pages or components to audit, and the framework.
- Any automated tool output the user already has (axe, Lighthouse, Pa11y,
  WAVE).
- The design system in use, because many fixes belong in shared
  components.
- Whether the user wants a report only, or fixes as well.

## Procedure

1. **Run the automated checks available in the repository:** axe through
   `@axe-core/playwright`, `cypress-axe`, `jest-axe`, or `vitest-axe`, and
   the framework's lint rules (`eslint-plugin-jsx-a11y`, the
   `@angular-eslint` template accessibility rules,
   `eslint-plugin-vuejs-accessibility`). If none exists, mark the automated
   scan NOT_RUN and suggest one. Do not add tooling unasked.
2. **Review the code and markup manually** for what tools miss:
   - **Semantics:** native `button`, `a`, `input`, and headings instead of
     clickable `div`s. One `h1`, and a logical heading order. Landmarks
     (`main`, `nav`, `header`).
   - **Names and labels:** every control has an accessible name; icon-only
     buttons have `aria-label`; images have meaningful or empty `alt`.
   - **Keyboard:** every action works with Tab, Enter, Space, Escape, and
     arrow keys where the pattern expects it. The focus order follows the
     visual order, and no `tabindex` is greater than 0.
   - **Focus:** a visible focus indicator that is not hidden behind sticky
     headers (2.4.11). Dialogs move focus in, trap it, close on Escape, and
     restore it on close. Route changes move focus to the new content or
     heading.
   - **ARIA:** the first rule is no ARIA when a native element works.
     Roles and states match behaviour (`aria-expanded`, `aria-controls`,
     `aria-selected`). No `aria-hidden` on focusable content.
   - **Announcements:** form errors linked by `aria-describedby`, status
     messages in a `role="status"` or `aria-live` region (4.1.3).
   - **Contrast:** 4.5:1 for normal text, 3:1 for large text, and 3:1 for
     control boundaries and focus indicators (1.4.3, 1.4.11). Information is
     not conveyed by colour alone.
   - **WCAG 2.2 additions:** target size at least 24 by 24 CSS pixels
     (2.5.8), an alternative to dragging (2.5.7), no redundant re-entry of
     information (3.3.7), and authentication without cognitive tests
     (3.3.8).
   - **Motion and zoom:** honour `prefers-reduced-motion`, and keep the page
     usable at 200 % zoom and 320 CSS pixels wide.
3. **Record each finding** with its WCAG criterion, `path:line` or the
   component, the user impact (who is blocked and how), the severity
   (blocker, serious, moderate, minor), and the fix.
4. **Fix at the right level.** A defect inside a shared or design-system
   component is fixed there, after asking, because it affects every usage.
   Page-level defects are fixed in place.
5. **Add regression checks** with the project's tools: an axe assertion in
   a component or end-to-end test, and keyboard interaction tests for
   dialogs and menus.
6. **State the limits.** List what needs a manual screen reader pass (NVDA
   or JAWS on Windows, VoiceOver on macOS and iOS, TalkBack on Android) and
   mark it "not verified with a screen reader".

## Outputs

- A findings table: WCAG criterion, location, impact, severity, and fix,
  each marked fixed, proposed, or out of scope.
- Automated check results (axe or lint) with the command, or NOT_RUN.
- The fixes applied, with regression tests where the project has a test
  setup.
- A manual verification list for screen readers and zoom.

## Technology considerations

| Stack | Consideration |
|---|---|
| Angular | CDK `a11y` utilities (`FocusTrap`, `LiveAnnouncer`, `FocusMonitor`) if the CDK is installed. Angular Material components are accessible when given labels. Move focus after router navigation with the router's events. |
| React and Next.js | `eslint-plugin-jsx-a11y`. Use the dialog primitives of the component library (Radix, Headless UI, MUI) instead of hand-written focus traps. Next.js announces route changes, but custom focus handling may still be needed. |
| Vue and Nuxt | `eslint-plugin-vuejs-accessibility`. `<Teleport>` for overlays does not move focus by itself. Set `useHead({ htmlAttrs: { lang } })` in Nuxt. |
| Mobile shells | Ionic components carry roles, but custom gestures need button alternatives. Test with TalkBack and VoiceOver on a device, or mark it "not verified on device". |

## Verification

- Each seeded or found issue (an unlabelled input, a missing focus trap,
  low contrast) is reported with its WCAG criterion and location.
- The automated scan passes for the changed scope after the fixes, or is
  NOT_RUN with the command to run.
- Keyboard tests for changed dialogs, menus, and forms pass, reported
  PASS, FAIL, or NOT_RUN with the command.
- The report never claims full WCAG conformance from automated results
  alone, and screen-reader behaviour not tested is labelled as such.
