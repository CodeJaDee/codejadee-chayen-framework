---
kind: technology
---
# Vue and Nuxt (including Vite Vue apps)

**Applies to:** Vue applications, including retained Vue 2 features, and Nuxt.

- Read resolved Vue/compiler, Nuxt/Nitro, router/store, and selected builder
  versions first. Manifest ranges alone are not installed API evidence.
- Vue 2 projects use different APIs. Follow the existing code, and do not
  migrate unasked.

## Check the repository first

Distinguish plain Vue from Nuxt using manifests, nuxt.config, scripts, source
roots, and generated framework context. Confirm Vite from the selected
builder/scripts/dependencies; Vue CLI/webpack and Nuxt with another builder
retain their own configuration. Vite can also build non-Vue applications.
Compare packageManager, lockfile, workspace, and CI for npm/pnpm/Yarn/Bun;
preserve configured typecheck, build, and test runners and resolve conflicts.

Load this base plus one relevant topic: `vue-composition.md`,
`vue-routing-state.md`, `vue-performance.md`, `nuxt-app.md`, or
`nuxt-modules.md`. Keep general procedures in the existing workflow recipe.

| Compatibility signal | Decision |
|---|---|
| Vue 2/2.7/3, compiler/macros | Preserve Options/setup style; check Composition support, defineModel 3.4+, and props-destructure behavior 3.5+ |
| Nuxt 2 versus 3/4 | Retain asyncData/fetch and legacy config where used; newer context, Nitro, layout and data APIs require installed support |
| Nuxt 4 source layout | Inspect actual app/root/srcDir and compatibility settings, not a forced folder migration |
| Nuxt auto-import settings/layers | Inspect discovery and context; plain Vue has explicit imports |
| Vite evidence absent | Keep the existing builder; do not add Vite or Vitest automatically |

| Area | What to look for |
|---|---|
| Component style | `<script setup lang="ts">` (Composition API) or Options API (`export default { data(), methods }`). Match the file or feature you edit. |
| State | Pinia stores (`defineStore`), composables (`useX`), or Vuex in older apps |
| Routing | Vue Router (`router/`), or Nuxt file-based `pages/` with `definePageMeta` |
| Forms | Native `v-model`, VeeValidate, FormKit, zod / valibot schemas |
| Nuxt layout | Actual `app/`, root, or configured srcDir; server ownership; auto-import settings and layers |
| Data fetching (Nuxt) | `useFetch` / `useAsyncData` / `$fetch`. Follow the existing usage. |
| Tests | Vitest with `@vue/test-utils` or Testing Library, `@nuxt/test-utils`, and Playwright or Cypress |

## Guidance

### Components

- **Props and emits.**
  - Typed with `defineProps<...>()` and `defineEmits<...>()`.
  - Two-way bindings use `defineModel()` where the Vue version supports it
    and the codebase uses it. Otherwise use a `modelValue` prop plus an
    `update:modelValue` emit.
- **Choose state primitives deliberately:**
  - `ref` for primitives and replaced values;
  - `reactive` only for stable objects;
  - `computed` for derived values.
- Avoid destructuring that loses reactivity. Ordinary reactive objects differ
  from the Vue 3.5+ defineProps compiler transform in script setup; inspect
  compiler/version and use supported toRef/toRefs or property access.
- **`v-for` needs a stable `:key`.** Do not combine `v-if` and `v-for` on
  the same element.

### Forms and accessibility

- **Labels are associated** with `for`/`id` or by wrapping the input.
- **Validation messages** are linked with `aria-describedby`, and
  `aria-invalid` is set on errors.
- **Dialogs:**
  - move focus into the dialog on open;
  - trap focus while it is open;
  - close on `Esc`;
  - restore focus on close.
- **Use `<Teleport>`** for overlays if the project already does.

### Nuxt specifics

- **Use `useFetch`/`useAsyncData`** for SSR-safe data with a stable key.
  Bare `$fetch` in universal setup can repeat during hydration; event-triggered
  `$fetch` is appropriate when the contract does not need SSR payload reuse.
- **Handle `pending`, `error`, and empty states** explicitly.
- **Runtime config:**
  - public values live under `runtimeConfig.public`;
  - secrets stay in private `runtimeConfig`, read only on the server.
  - Nuxt 2 has distinct privateRuntimeConfig/publicRuntimeConfig conventions;
    preserve the actual version's scheme and runtime override support.
  - private values must also stay out of API/data payloads, state, app.config,
    client imports, public module settings, HTML, and source maps. Private
    config placement alone cannot prevent application code from serializing it.
- **Browser-only code** goes in `onMounted`, `<ClientOnly>`, or `.client`
  plugins, to avoid hydration errors.

### Vite specifics

- **`import.meta.env.VITE_*` values are public in the bundle.** Never put
  secrets in them.
- Custom envPrefix/define/plugins may expose other values. Apply Vite advice
  only when its build is evidenced, and use framework-owned config when needed.

### Security

- **No `v-html` with untrusted content.** Sanitize with the project's
  sanitizer if it is unavoidable.

## Verification commands

Use the detected manager and configured scripts first. Examples below require
existing local tools and matching targets; do not download vue-tsc, Nuxt CLI,
or Vitest or replace the project's runner merely to run them.

```bash
npm run build
vue-tsc --noEmit         # installed local compiler and configured Vue target
nuxi typecheck           # installed compatible Nuxt CLI and configured target
npm run lint
vitest run              # only an existing configured Vitest runner
```

## Pitfalls

- Mixing Options API and `<script setup>` within one component.
- Mutating props directly instead of emitting events.
- Watchers that duplicate what `computed` would express.
- Fetching in `onMounted` in Nuxt pages that should render data on the
  server.
