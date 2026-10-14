---
kind: technology
---
# Vue composition, reactivity, and composables

## Check the repository first

Read `vue-nuxt.md`. Inspect resolved Vue/compiler versions, Options/setup/
script-setup conventions, props/emits, lifecycle ownership, and tests. Plain
Vue does not supply Nuxt context, runtime config, or auto-imported composables.

## Composition conventions (vue-composition-api)

**Applies when:** A Vue feature uses Composition API or explicitly requests a compatible setup implementation.

**Not when:** A small Options API edit is sufficient; preserve that component's existing style instead.

**Version notes:** Vue 3 and Vue 2.7 include Composition API; older Vue 2 needs existing plugin evidence. Vue 2.7 retains getter/setter reactivity caveats, not Vue 3 proxy semantics. script setup/compiler macros need installed support; defineModel requires Vue 3.4+.

**Steps:**

1. Find the nearest component and record its actual Vue/compiler version, Options/setup style, naming, props, emits, slots, and model contract. Do not convert an Options API feature merely to add one field.
2. Keep the smallest state and event contract consistent with callers. Use installed supported macros only in their valid compilation context; preserve modelValue/update:modelValue or the existing version-specific model convention.
3. Keep setup instance-owned and render derivation pure. Use current lifecycle and injection helpers, avoid mutating props, and place browser work behind mounted/client boundaries when server rendering exists.
4. Compile the owning SFC and test prop changes, emitted payloads, slots, model updates, pending/error states, and destruction. Confirm public bindings remain compatible and no global state or unnecessary composable abstraction was introduced.

**Verify:** Report PASS, FAIL, or NOT_RUN with configured SFC typecheck/build and component commands; a macro example is not evidence that the project's compiler accepts it.

```vue
<script setup lang="ts">
const props = defineProps<{ title: string }>()
const emit = defineEmits<{ (event: 'open'): void }>()
</script>
<template><button type="button" @click="emit('open')">{{ props.title }}</button></template>
```

## Reactive ownership and derivation (vue-reactivity)

**Applies when:** Vue refs, reactive objects, computed state, or watchers have stale values or incorrect update behavior.

**Not when:** Only fixing Nuxt remote request hydration; use Nuxt data-fetching guidance instead.

**Version notes:** Vue 3.5 reactive props destructuring is a compiler transform specific to defineProps in script setup; ordinary reactive-object destructuring still differs. Check watcher cleanup and ref utility availability before using newer APIs.

**Steps:**

1. Trace the stale value to its owner and identify ref, reactive, computed, prop, or store semantics. Check compiler/runtime versions before deciding whether destructuring preserved a dependency.
2. Use ref for replaced values and computed for pure derivation; preserve reactive object identity where callers depend on it. Access properties or use supported toRef/toRefs patterns rather than accidentally snapshotting primitives.
3. Use watchers for external synchronization, with deliberate source, flush timing, and cleanup. Cancel or exclude stale asynchronous work; do not replace a computed result with a watcher that writes duplicated state or suppress warnings to mask ownership errors.
4. Test prop/source changes, object replacement, nested updates, queued rendering via the configured scheduler, and watcher disposal. Cover a slow previous request completing late and confirm that unchanged data does not trigger unnecessary side effects.

**Verify:** Report PASS, FAIL, or NOT_RUN with reactive and component-test commands; differentiate pure computed assertions from DOM updates and version-specific compiler behavior.

```ts
const state = reactive({ count: 0 })
const count = toRef(state, 'count')
const doubled = computed(() => count.value * 2)
```

## Reusable instance behavior (vue-composables)

**Applies when:** Existing Vue behavior needs a composable with defined input, state, lifecycle, or reuse boundaries.

**Not when:** A pure helper function has no reactive/lifecycle behavior; keep it an ordinary utility instead.

**Version notes:** Match Vue version and current scope/lifecycle utilities. Nuxt context-dependent composables require a valid Nuxt call context and are not portable plain Vue functions automatically.

**Steps:**

1. Identify real callers, input/ref conventions, owner lifetime, and SSR consumers. Keep a single-use calculation local unless a concrete reusable reactive behavior justifies extraction; retain current composable naming and placement.
2. Return explicit refs/computed values or the project's established reactive contract. Avoid losing reactivity when consumers destructure, and state whether values are instance-local or intentionally shared.
3. Register subscriptions, timers, or browser listeners in the appropriate owner scope and clean them up with supported hooks. Keep browser globals out of module import and server setup; never put user-specific refs at server module scope.
4. Test two independent consumers, changing inputs, unmount/scope disposal, server import without window, and late completion. For Nuxt callers preserve framework context and payload rules; do not call useRuntimeConfig or useFetch in arbitrary plain Vue helpers.

**Verify:** Report PASS, FAIL, or NOT_RUN for scope/consumer/server tests with commands; prove cleanup and instance/request isolation where applicable.

## Verification commands

Use the configured compiler, SFC/component runner, and build. Never install
Composition plugins or convert an API style solely to make an example fit.

## Pitfalls

- Assuming Vue 3.5 prop destructuring applies to every reactive object.
- Browser listener registration during a server module import.
- Shared module refs leaking personalized SSR state between requests.
