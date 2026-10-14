---
kind: recipe
capabilities: [CAP-07-005, CAP-07-008]
---
# Responsive layout and design-system integration

Make layouts work across viewport sizes and zoom levels with the project's
own breakpoints and CSS approach, and build UI from the team's design
system (components, tokens, themes) instead of ad-hoc styles.

## Inputs

- The screens affected and the target viewports. Default to 360, 768, and
  1280 CSS pixels wide, plus 200 % browser zoom.
- The CSS approach: Tailwind, SCSS, CSS Modules, CSS-in-JS, or plain CSS,
  and where breakpoints are defined.
- The design system or component library in use (an internal package,
  Angular Material, PrimeNG, MUI, Chakra, shadcn/ui, Vuetify, Quasar,
  Element Plus, Ionic), and its tokens and theme files.
- The browser targets (`browserslist`), which decide whether container
  queries and other newer CSS can be used.

## Procedure

### Responsive layout (CAP-07-005)

1. **Find the breakpoints and layout primitives** already defined: the
   Tailwind `screens` setting, SCSS breakpoint mixins, CSS custom
   properties, the component library's grid or `useMediaQuery`. Use them.
   Never add a new breakpoint set.
2. **Reproduce the problem** at the narrowest target width. Note the
   overflowing element, fixed widths, absolute positioning, or long
   unbroken content causing it.
3. **Fix with flexible layout:** mobile-first rules, `flex-wrap` or grid
   with `minmax()`, `max-width: 100%` on media, `min-width: 0` on flex
   children that hold long text, and `overflow-wrap: anywhere` for long
   strings. Avoid fixed pixel widths and device detection by user agent.
4. **Tables on narrow screens:** choose with the user between a scroll
   container (`overflow-x: auto`, keyboard focusable, with a visible label)
   that keeps the table semantics, and a stacked card layout for each row.
   Keep the header association either way.
5. **Respect reflow and zoom:** content must work at 320 CSS pixels wide
   and at 200 % zoom without two-dimensional scrolling, except for content
   that needs it, such as data tables and maps (WCAG 1.4.10). Do not
   disable zoom in the viewport meta tag.
6. **Touch targets:** at least 24 by 24 CSS pixels (WCAG 2.5.8), or the
   larger size the design system specifies.
7. **Check each viewport** with the project's end-to-end tool when one
   exists, asserting no horizontal overflow
   (`document.documentElement.scrollWidth <= window.innerWidth`). Otherwise
   list the viewports as "not verified in browser".

### Design-system integration (CAP-07-008)

1. **Inventory the design system:** its components, tokens (colour,
   spacing, typography, radius, elevation), themes, and documentation or
   Storybook. Note the installed version.
2. **Map each hand-rolled element** on the screens to a design-system
   component or token. Replace them through the component's public API:
   props, inputs, slots, or variants. Never copy its markup or reach into
   its internal classes.
3. **Use tokens instead of literal values.** No new hard-coded colours,
   spacing, or font sizes when an equivalent token exists. Add a
   component-level custom property only if the design system lacks one, and
   record it as a gap.
4. **Theming and dark mode:** use the design system's theme mechanism
   (CSS custom properties, a theme provider, a `data-theme` attribute, or
   `prefers-color-scheme`). Check text and control contrast in each theme.
5. **Record gaps.** If no component fits, propose either composing existing
   components or adding to the design system, and ask before creating a
   local variant. List each gap with the screen that needs it.
6. **Keep the change local.** Global theme or token changes affect every
   screen: ask first, and list the screens affected.

## Outputs

- Layout changes that use the existing breakpoints and utilities, with the
  checked viewport list and each result.
- Changes that use design-system components and tokens, with no new
  hard-coded values where tokens exist.
- A list of gaps where the design system lacks a needed component or
  token, with a proposal for each.

## Technology considerations

| Stack | Consideration |
|---|---|
| Angular | Angular Material or CDK `BreakpointObserver` for logic, CSS for layout. Material theming through Sass mixins or system tokens, depending on the major version. PrimeNG and other libraries have their own theme presets. Component styles are encapsulated, so tokens should be CSS custom properties that cross the boundary. |
| React and Next.js | Tailwind `theme` and `screens` in the configuration (or `@theme` in Tailwind version 4), CSS Modules, or CSS-in-JS theme objects (MUI `ThemeProvider`, Chakra). shadcn/ui components live in the repository: edit them as source. Avoid `window.matchMedia` during server render. |
| Vue and Nuxt | Vuetify display helpers and SASS variables, Quasar breakpoints, Element Plus CSS variables, or Tailwind via `@nuxtjs/tailwindcss`. Use `useDisplay`-style helpers only where CSS cannot do the job. |
| PWA and mobile shells | Use `env(safe-area-inset-*)` for notches and gesture bars, and test in landscape. Ionic components carry platform modes (`ios` and `md`), so do not override them per element. |

## Verification

- At 360, 768, and 1280 pixels, the changed pages show no horizontal
  overflow, from a Playwright or Cypress viewport check, or each viewport is
  marked NOT_RUN with the command to run.
- No new literal colour, spacing, or font-size values appear in the diff
  where a token exists, checked by searching the diff.
- Build, lint, and style lint (if configured) pass, reported PASS, FAIL, or
  NOT_RUN with the command.
- The gaps list is present, or the report says no gaps were found.
