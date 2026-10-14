---
kind: recipe
capabilities: [CAP-07-007]
---
# Frontend performance

Improve web performance from measurements: bundle size, code splitting,
rendering and hydration cost, images and fonts, and Core Web Vitals (LCP,
INP, CLS). Every recommendation names the measurement that shows its
effect, and nothing is reported as faster without a before and after
number.

## Inputs

- The symptom and the page or route: slow first load, slow interaction,
  layout jumps, or a large bundle.
- Existing data: build output with chunk sizes, bundle analysis,
  Lighthouse reports, field data (web-vitals reporting, CrUX, or a RUM
  tool), and performance budgets in the configuration.
- The framework, version, rendering mode (client, SSR, static), and the
  hosting or CDN setup if it matters.

## Procedure

1. **Measure the baseline.** Use what the project has, in this order:
   - the production build output and its chunk sizes (never the dev
     server);
   - a bundle analysis of that build;
   - a Lighthouse run on the production build, with the device profile
     stated (mobile throttling by default);
   - field data, if collected, which outranks lab data.

   Record each number with the command and the conditions.
2. **Find the dominant cost** for the reported metric:
   - **Large bundle:** heavy dependencies in the initial chunk (date,
     chart, editor, or icon libraries imported whole), duplicated packages,
     polyfills not needed by the browser targets.
   - **LCP:** a late-discovered hero image, render-blocking CSS or fonts,
     slow server response, or client-only rendering of above-the-fold
     content.
   - **INP:** long tasks in event handlers, large synchronous re-renders,
     unvirtualized long lists, or heavy third-party scripts.
   - **CLS:** images and embeds without dimensions, late-loading fonts, or
     content injected above existing content.
3. **Rank the improvements** by expected effect and effort, citing the
   measurement each one targets. Typical levers:
   - route-level code splitting and lazy components;
   - importing only the used parts of a library (named or subpath imports),
     or a lighter alternative after approval;
   - the framework's image component with explicit dimensions, modern
     formats, and `fetchpriority="high"` on the LCP image, which is never
     lazy-loaded;
   - `font-display: swap` or `optional`, with the font preloaded;
   - deferring non-critical third-party scripts;
   - moving rendering to the server or to static output where the framework
     supports it, and keeping client boundaries small;
   - virtualizing long lists, and breaking long tasks up.
4. **Ask before** replacing a library, changing rendering modes, or
   changing caching and CDN settings.
5. **Apply one change at a time,** re-measure under the same conditions,
   and keep the changes that move the target metric.
6. **Protect the gain:** add or tighten a performance budget the project
   supports (Angular `budgets`, a bundle-size check in CI, Lighthouse CI) if
   the user agrees.

## Outputs

- A ranked list of improvements, each with its expected effect, the
  metric it targets, and the measurement to confirm it.
- Before and after numbers with commands and conditions for the changes
  applied, or NOT_RUN for each measurement not taken.
- Budget or CI changes, if approved.

## Technology considerations

| Stack | Consideration |
|---|---|
| Angular | `ng build` prints initial and lazy chunk sizes, and `--stats-json` feeds an analyzer (esbuild metafile or `webpack-bundle-analyzer`, depending on the builder). `loadComponent` and `loadChildren` for routes, `@defer` blocks in versions that support them, `NgOptimizedImage`, `OnPush`, and `track` in `@for`. `budgets` in `angular.json`. |
| React (Vite) | `rollup-plugin-visualizer` or `vite-bundle-visualizer` if present. `React.lazy` with `Suspense` for routes. Check the React Profiler for slow commits. Virtualize long lists with the library already used. |
| Next.js | The build output lists route sizes. `@next/bundle-analyzer` if installed. `next/image` with `priority` (or `preload`, depending on the version) for the LCP image, `next/font`, `next/dynamic`, and Server Components to keep client JavaScript small. |
| Vue and Nuxt | `defineAsyncComponent`, lazy routes, `nuxi analyze`, `@nuxt/image`, `Lazy` component prefixes, and server components or islands where the Nuxt version supports them. Avoid large reactive objects for static data (`shallowRef`, `markRaw`). |
| Mobile shells | Device performance is covered by the offline and mobile performance recipe. Web Vitals targets apply to PWAs in browsers, not to a Capacitor web view's cold start. |

## Verification

- Bundle sizes before and after come from the production build output of
  the same command, for example a seeded large import removed from the
  initial chunk.
- Web Vitals changes cite Lighthouse or field data under stated
  conditions. Lab numbers are not presented as field results.
- Build and tests still pass, reported PASS, FAIL, or NOT_RUN with the
  command.
- Any improvement not re-measured is labelled "expected, not measured".
