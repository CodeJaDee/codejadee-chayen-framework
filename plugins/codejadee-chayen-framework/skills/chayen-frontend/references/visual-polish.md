---
kind: checklist
---
# Visual polish checklist

Find the marks of a screen assembled from generic generated defaults, and
fix them with the project's existing stack and design system so the screen
reads as designed for this product. Features, content, and section order
are preserved; the work is making each colour, size, word, and effect
intentional.

Two ideas drive every decision below:

- **Quiet frame, one focal point.** Navigation, surfaces, borders, and
  controls stay calm and neutral. Colour, material, and detail are spent on
  one or two pieces of content that matter, such as the main chart, the
  record being edited, or a preview of what the product produces.
- **Specific to this product.** A cleaned screen that would fit any product
  is still a template. The words, the focal content, and one recurring
  detail should come from what this product does.

## Scope and proportion

Use this checklist when the user asks to polish, tidy, or redesign a screen
because it looks generated, generic, or visually inconsistent, or when a
frontend review notices the signals below. Brand identity, logos, image
generation, and visual design with no code are outside it.

Size the change from the findings, not from taste:

| Findings | Mode | What changes |
|---|---|---|
| Signals in most layers below | Rework | Every layer, in the fix order, after the brief is approved |
| A few isolated signals on a screen that already has a working system | Touch-up | Only the findings. Palette, type, layout, and imagery stay. Larger ideas go in the report as suggestions. |
| Nothing that matters | Leave | Report that the screen is sound. Offer up to three refinements with exact values, and wait for the user's go-ahead before applying any. |

A sound screen is never restyled for the sake of novelty.

## Gather evidence first

1. **See what users see.** If the project can render the screen (its dev
   server, Storybook, or an existing Playwright or Cypress setup), look at
   it. Otherwise review the code and label every visual claim "not verified
   in browser".
2. **Read the system before the screen.** List the design tokens, theme
   files, component library, icon set, and fonts already installed. They
   are the material for every fix (the `layout-and-design-system.md`
   recipe covers the token and theme mechanics).
3. **Record each finding** as `path:line`, the signal, and the intended fix.
   Group findings by the layers below.

Search hints for common signals (Tailwind class names first, plain CSS after):

| Signal | Search for |
|---|---|
| Two-hue gradients | `bg-gradient-to-`, `from-purple`, `via-`, `linear-gradient(` or `radial-gradient(` with two different hues |
| Gradient text | `bg-clip-text`, `text-transparent`, `-webkit-background-clip: text` |
| Coloured glows | arbitrary `shadow-[` values and `box-shadow` or `filter` shadows with zero offset and a saturated colour |
| Background blobs | `blur-3xl`, `blur-[`, `filter: blur(` on absolutely positioned decoration |
| Decorative looping motion | `animate-pulse`, `animate-ping`, `animate-bounce`, `animation:` with `infinite` |
| Catch-all transitions | `transition-all`, `transition: all`, `hover:scale-` |
| Shouting labels | `uppercase` with `tracking-wide` or wider, `text-transform: uppercase` with `letter-spacing` |
| Heavy headings | `font-extrabold`, `font-black`, `font-weight: 800` or `900` |
| Hand-tuned spacing | arbitrary values such as `mt-[13px]`, `py-[11px]`, `gap-[7px]` |
| Emoji in the interface | emoji characters in templates, string files, and translation files, using an editor or search tool that matches Unicode emoji ranges |

## Signals and fixes by layer

### Surface and colour

| Signal | Fix |
|---|---|
| Purple-to-blue, or any two-hue, gradient fills on page backgrounds, cards, buttons, or selected navigation | A flat neutral surface. A gradient is acceptable only between two close shades of the same neutral. |
| Gradient text in headings, figures, or the wordmark | Solid primary text colour |
| Coloured glows, coloured shadows, neon borders | No glow. Borders become thin lines at roughly 6 to 10 % of the text colour. |
| Blurred colour washes or blobs behind content | A plain background |
| Many near-identical tints used for text | Primary, secondary, and muted text, all drawn from one neutral scale |
| The accent colour applied everywhere | Accent reserved for the main call to action, the current selection, and at most one headline figure |
| A tinted app background that reads as a colour | Near-neutral surfaces in apps and dashboards. The product's character shows in the accent and the focal content. Landing pages may tint further. |

Keep text contrast at 4.5 to 1 or more and control and graphic contrast at
3 to 1 or more (WCAG 1.4.3 and 1.4.11), in every theme. On dark themes,
express depth through lighter surface tones and thin borders rather than
shadows. Semantic colours (success, warning, error) carry meaning only,
toned to sit in the palette.

### Typography

| Signal | Fix |
|---|---|
| Extra-bold or black headings | Regular or medium weight, with semibold kept for rare emphasis. Size and colour create the hierarchy. |
| Uppercase labels with wide tracking | Sentence case at normal tracking |
| Too many font sizes and weights | Two weights and a short list of sizes from the type scale |
| Tight tracking on small text | Default or slightly looser tracking. Tight tracking suits large display sizes only. |
| Figures in mixed formats, for example `48,210` beside `124,860.40` | One format through the app's locale formatter, with `font-variant-numeric: tabular-nums` |
| Italic for emphasis | Colour or weight instead |
| A default font nobody chose, on a product whose tone wants another | Keep a real brand font. Propose a change only with approval, because it is a new dependency or a global style change. |

Thai text has no case, so case rules do not apply to it. Give Thai body
text a line height of about 1.5 or more so stacked vowels and tone marks do
not collide, never add letter spacing to Thai, and use a font that includes
Thai glyphs instead of relying on a fallback that mixes two designs.

### Icons

| Signal | Fix |
|---|---|
| Emoji as navigation icons, status, or label decoration | Line icons from the set the project already has. Adding a set needs approval. |
| An icon on every card title and section label | Keep icons only where they add meaning. Categories that need colour get a small status dot. |
| Icons in several sizes, strokes, and colours | One size (16 or 20 px) and one stroke, coloured by the text role beside them |
| Sparkle icons marking AI features | None, unless a plain icon clarifies what the action does |

Give every icon the same box width and the same gap to its label, so labels
start on one line.

### Spacing and alignment

| Signal | Fix |
|---|---|
| Hand-tuned values outside any scale | Steps from the project's spacing scale, or a 4 px base scale when none exists |
| List rows of uneven height or spacing | Every row in a list shares one height and one gap |
| Ambiguous grouping, where an item sits as near the next group as its own | Tighter spacing within a group, looser spacing between groups |
| Sibling cards with different padding | One padding per card type |
| Elements nudged off a column with stray offsets | Icons, labels, and numbers each align to one column, numbers right-aligned |

Navigation is the densest region and the one most often broken. Check its
row heights, its gaps, and the space above and below each section label
after every change.

### Words

| Signal | Fix |
|---|---|
| Greeting headlines such as "Welcome back, Alex!" | A title naming what is on screen, such as the page or the date range |
| Exclamation marks in interface text | Plain statements |
| A change with no baseline, such as "+12%" | The comparison named, such as "+12% vs last month" |
| Wordy placeholders, such as "Search anything..." | "Search" |
| Hype words such as supercharge, seamless, unlock, magic | What the feature does |
| Trailing periods on labels, buttons, and headings | None. Multi-sentence paragraphs keep theirs. |
| Placeholder data such as `123,456` or `[X]` | Plausible sample data, marked as sample where it could be mistaken for real figures |
| Decorative badges such as "New", "PRO", "Beta" with emoji | No badge, or a single plain-text label where the product truly needs one |
| Claims that cannot be checked, such as "Trusted by 10,000+ teams" | Ask the user. Keep it quiet and specific if confirmed, otherwise leave it out, and list it in the report. |

Use only facts already on the page. For longer marketing or article prose,
hand off to the chayen-humanizer-en or chayen-humanizer-th skill.

### Components and data display

| Signal | Fix |
|---|---|
| Everything a pill | Radius scaled to the element's size, and nested corners computed as inner radius = outer radius - padding, with 4 px as the floor |
| Glowing pills for counts, plans, or shortcuts | Muted text for counts, small keycaps for shortcuts |
| Rainbow bars within one series, glowing or pill-shaped bars | A muted grid and muted labels. The one series or period that matters gets the accent, the rest are neutral shades. |
| Several equal charts side by side | One main chart, clearly the largest, and smaller blocks of a different kind (a ranked list, a short table) |
| Sparklines or tiny charts squeezed into every KPI card | A KPI card holds a label, a figure, and its comparison |
| A row of identical equal-width cards | A varied grid, such as compact stats above one wide chart |
| Selected items shown with a gradient and glow | A slightly raised background tone and a thin border |
| Missing hover or focus states | States inside the palette, and a clearly visible keyboard focus indicator |

Match the chart to the question it answers. Change over time is a line
chart. Ranking or comparing categories uses bars. Parts of a whole fit in a
single stacked bar or a ranked list with inline bars. Progress toward one
target is a progress bar.

### Layout

- Sections keep their positions and sequence. Within one section, realign
  or resize parts when the result reads more clearly.
- Apps keep application proportions: a fixed-width sidebar, fluid content
  capped at a readable maximum width, and a page as long as its content.
- A landing hero offers a single main action plus an optional secondary
  one. Further actions belong lower on the page.
- With a visual, prefer an asymmetric split or text above a large product
  view to a fully centred stack. Long headlines align left.
- Treat the first viewport as one composition, without a large blank
  strip.
- On narrow screens, stack in reading order, simplify dense previews
  instead of shrinking them, and keep text at 11 px or more.

### Motion

| Signal | Fix |
|---|---|
| Pulsing, pinging, or breathing effects on elements that show no live data | No animation |
| `transition-all`, bouncy springs, hover scaling on cards | Named properties (colour, background, border, opacity, transform), a quick colour or surface change on hover, a slight scale-down on press |
| Everything entering from different directions on load | At most a brief fade-in, with a few pixels of upward movement, on the primary content |
| Animated width, height, top, left, or large blurs | Transform and opacity only |

Pick a single easing function and two or three durations: about 100 to
200 ms for feedback and 200 to 300 ms for content that enters. Honour
`prefers-reduced-motion`.

### Imagery

| Signal | Fix |
|---|---|
| Glossy blobs, orbs, nebulas, glowing grids, robots, or brains as decoration | No decorative imagery |
| Words or controls drawn into an image | Live HTML text and controls |
| An illustration in each section | Imagery only in the section it explains, usually the hero |
| A hero with no visual, or a stock-style picture | A product preview built from the project's own components with sample data, demonstrating a capability the page already describes |

Dashboards and app screens rarely need imagery: their focal points are the
product's data and content. Do not generate or download images as part of
this checklist. When a scene or photograph would help, leave a correctly
sized slot and describe the image for the user to supply.

## Brief before rework

In Rework mode, write a short brief and get the user's agreement before
editing. A changed direction later means redoing every layer, and global
style or theme changes need approval anyway.

| Line | Content |
|---|---|
| Product and audience | One plain sentence taken from the page's own content |
| Tone and material | Two or three words a user would recognise, plus what the product handles (ledgers, routes, lab samples). Words that fit any product, such as modern, clean, sleek, or premium, do not count. |
| Focal content | The one or two places that carry colour and detail, and what they show |
| Recurring detail | One small element unique to this product, repeated wherever it applies, such as the ticket-number format a help desk already uses |
| Kept as is | Brand assets, tokens, fonts, and components that stay unchanged |

A real brand colour, logo, or typeface is kept and becomes the basis of the
brief. A two-hue gradient, sparkle, or glow in a logo is not counted as
brand identity unless the user confirms it. Never rename the product.

## Fix order

Complete one step across the entire screen before starting the next. If
the screen is being rewritten almost line by line, it is acceptable to plan
all eight steps first and produce the new code in a single edit, provided
none is skipped.

1. **System.** Map the screen to existing tokens and components: spacing
   scale, neutral colours, accent, radius, type scale. Record gaps instead
   of adding literal values.
2. **Words.** Copy before type and layout, because headline length decides
   size and placement.
3. **Spacing and alignment.**
4. **Colour and emphasis,** including the focal content from the brief.
5. **Typography and icons.**
6. **Components and data display.**
7. **Layout.**
8. **Imagery and motion,** last: the screen should hold up without them
   before they are added.

## Guardrails

- Keep features, content, section order, the product name, and a real logo.
  Only meaningless placeholder content may change.
- Do not invent features, figures, testimonials, or customer counts.
- Taking an effect away is the fix. Do not fill the gap with a different
  effect or move to another fashionable treatment, such as frosted panels
  or noise textures.
- Ask before adding an icon set, a font, or any other dependency, and before
  changing global tokens or themes. List the screens a global change
  affects.
- Two different products should not end up with the same palette,
  typefaces, and layout. Let the brief make those choices.

## Final checks

- [ ] The mode (Rework, Touch-up, or Leave) matches the findings
- [ ] In Rework mode, the brief was agreed and every step follows it
- [ ] Spacing values sit on the scale, and matching elements share one size
- [ ] Neutral surfaces and text, a single accent, and contrast of at least 4.5 to 1 for text and 3 to 1 for controls in every theme
- [ ] No two-hue gradients, gradient text, coloured glows, or colour blobs remain
- [ ] No emoji remain in the interface, and all icons share a single set, size, and stroke width
- [ ] Weights stay at regular to semibold, labels are not tracked uppercase, and figures share one tabular format
- [ ] No exclamation marks, greeting titles, trailing periods on short strings, or unconfirmed claims
- [ ] Nested radii add up, and hover and focus states exist
- [ ] Motion is purposeful, uses transform and opacity, and honours reduced motion
- [ ] Rerunning the search hints on the changed files finds no remaining signal, or each remaining one is explained
- [ ] Template test: with another product's name swapped in, the screen would no longer fit. If it still fits, push the words, the focal content, and the recurring detail further.

Report the mode, the brief, the findings before and after, a few lines per
step about what changed, any claims awaiting the user's confirmation, and
each check as PASS, FAIL, or NOT_RUN with its command. Screens not observed
after the last edit are marked "not verified in browser".
