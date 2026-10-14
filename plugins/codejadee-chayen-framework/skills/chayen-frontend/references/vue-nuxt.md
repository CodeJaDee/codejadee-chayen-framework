# Vue and Nuxt (including Vite Vue apps)

**Applies to:** Vue 3 applications and Nuxt.

- Read the `vue` and `nuxt` major versions first.
- Vue 2 projects use different APIs. Follow the existing code, and do not
  migrate unasked.

## Check the repository first

| Area | What to look for |
|---|---|
| Component style | `<script setup lang="ts">` (Composition API) or Options API (`export default { data(), methods }`). Match the file or feature you edit. |
| State | Pinia stores (`defineStore`), composables (`useX`), or Vuex in older apps |
| Routing | Vue Router (`router/`), or Nuxt file-based `pages/` with `definePageMeta` |
| Forms | Native `v-model`, VeeValidate, FormKit, zod / valibot schemas |
| Nuxt layout | Source in `app/` or at the root. Server routes in `server/`. Auto-imports are on by default. |
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
- **Do not destructure reactive objects or props** in ways that lose
  reactivity. Use `toRefs`, or access the property, as the codebase does.
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
  `$fetch` alone in `setup` runs twice: on the server and again on the
  client.
- **Handle `pending`, `error`, and empty states** explicitly.
- **Runtime config:**
  - public values live under `runtimeConfig.public`;
  - secrets stay in private `runtimeConfig`, read only on the server.
- **Browser-only code** goes in `onMounted`, `<ClientOnly>`, or `.client`
  plugins, to avoid hydration errors.

### Vite specifics

- **`import.meta.env.VITE_*` values are public in the bundle.** Never put
  secrets in them.

### Security

- **No `v-html` with untrusted content.** Sanitize with the project's
  sanitizer if it is unavoidable.

## Verification commands

```bash
npm run build
npx vue-tsc --noEmit     # Vue + TypeScript, if no typecheck script
npx nuxi typecheck       # Nuxt, if configured
npm run lint
npx vitest run
```

## Pitfalls

- Mixing Options API and `<script setup>` within one component.
- Mutating props directly instead of emitting events.
- Watchers that duplicate what `computed` would express.
- Fetching in `onMounted` in Nuxt pages that should render data on the
  server.
