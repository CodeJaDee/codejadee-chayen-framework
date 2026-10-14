---
kind: technology
---
# Next.js rendering and metadata

## Check the repository first

Read `react-nextjs.md`. Inspect router, Next/React versions, cacheComponents,
rendering settings, metadata conventions, image configuration, and production tests.

## Rendering and search metadata (nextjs-rendering-seo)

**Applies when:** A Next.js page needs compatible rendering behavior, metadata, crawlable content, or SEO-related correction.

**Not when:** Only writing marketing copy without application code; use content guidance instead.

**Version notes:** App Router metadata/generateMetadata differs from Pages Router next/head. Rendering, streaming metadata, async request APIs, and Cache Components depend on version and configuration; do not apply one major's flags blindly.

**Steps:**

1. Identify the router, data freshness, request-specific fields, crawlable content, canonical URL policy, and existing metadata owner. Preserve server-rendered versus client-only requirements and avoid changing global rendering mode for one metadata defect.
2. Use existing compatible metadata APIs for titles, descriptions, canonicals, language alternatives, and social previews. Validate dynamic identifiers and encode data safely; metadata and structured data must not serialize private user or server information.
3. Keep initial markup deterministic and avoid browser globals, random ids, or time-dependent discrepancies during render. Use installed image/font tools and current configuration; do not introduce rendering flags that conflict with the project's cache model.
4. Run the production build/server and inspect direct page responses, metadata, redirects, not-found status, and browser hydration. Test private pages and duplicate/canonical cases; record crawl/preview or browser checks as NOT_RUN when no actual observation exists.

**Verify:** Report PASS, FAIL, or NOT_RUN with production response and browser checks; a client snapshot does not prove metadata, response status, or hydration correctness.

```ts
// App Router only; keep the existing Pages Router next/head approach elsewhere.
export const metadata = {
  title: 'Orders',
  description: 'View your order history.',
};
```

## Verification commands

Use configured builds and production-server checks. Inspect HTTP status and
head/body content, then browser hydration; do not infer one from the other.

## Pitfalls

- Defining server metadata exports inside a use client component.
- Static prerendering of personalized data without isolation.
- Hydration fixes that erase meaningful server-rendered content.
