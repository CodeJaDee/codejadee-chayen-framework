---
kind: technology
---
# Angular

**Applies to:** Angular applications.

- Read the resolved `@angular/core` version first, alongside CLI, builders,
  TypeScript, RxJS, and state-library versions. A package.json range alone
  does not prove which APIs are installed.
- Many features below appeared in specific majors. If the project is older,
  use the patterns it already has.

## Check the repository first

Compare packageManager, lockfile, workspace config, and CI to detect npm,
pnpm, Yarn, or Bun. Check Yarn Classic versus modern Yarn and text bun.lock
versus older bun.lockb. Resolve conflicting evidence before dependency edits.
Inspect package scripts and angular.json, project.json, or custom build
targets for actual build/test runners. Do not assume an Angular app uses
Karma, Vitest, Nx, or a default CLI builder.

Load this base plus one topic only: `angular-components.md`,
`angular-reactivity.md`, `angular-navigation-http.md`,
`angular-forms-accessibility.md`, or `angular-ssr-upgrades.md`.
Keep general procedures in the existing task recipe.

### Compatibility gates

| Feature | Gate |
|---|---|
| Typed reactive forms | Angular 14+; preserve template-driven forms when used |
| Stable standalone | Angular 15+; preserve owning NgModule conventions |
| Signals and RxJS interop | Angular 16+ introductions; check each API's installed availability and stability |
| Built-in control flow | Angular 17+; existing structural directives stay unless a compatible migration is requested |
| Signal inputs/outputs and newer forms | Check individual API/version and local conventions; core signals alone are insufficient evidence |
| Zoneless | Inspect actual provider/default and dependencies; OnPush alone is insufficient evidence |

Never force Signals, zoneless, standalone, or new control flow because a
version supports them. Respect existing RxJS operators and state management.
Check the official compatibility table and update guide for the exact major;
do not independently upgrade TypeScript beyond Angular's supported range.

| Area | What to look for |
|---|---|
| Bootstrapping | `bootstrapApplication` (standalone) or `bootstrapModule` (NgModule). Follow it. |
| Components | `standalone` usage, `ChangeDetectionStrategy.OnPush`, file naming (`*.component.ts` or the newer suffix-less style) |
| Reactivity | Signals (`signal`, `computed`, `effect`, `input()`, `output()`, `model()`), RxJS, or both |
| Template syntax | Built-in control flow (`@if`, `@for`, `@switch`) or structural directives (`*ngIf`, `*ngFor`) |
| Forms | Reactive forms (`FormBuilder`, typed `FormGroup`), template-driven (`ngModel`), or newer signal-based forms. Use whichever is already present. |
| HTTP | `provideHttpClient(...)` with functional interceptors (`withInterceptors`), or `HttpClientModule` with class interceptors |
| State | Component signals, services with signals or `BehaviorSubject`, NgRx / NGXS / signal stores |
| Change detection | Zone-based, or zoneless (`provideZonelessChangeDetection` in the app config) |
| Tests | The test builder and scripts: Karma/Jasmine, Jest, Vitest, or the configured custom runner |

## Guidance

### Components

- **Standalone projects:** declare dependencies in the component's
  `imports`.
- **NgModule projects:** declare in the owning module.
- **Prefer `OnPush`** when the codebase uses it.
- **Inputs and outputs.** Use signal inputs (`input()`, `input.required()`)
  and `output()` when the version supports them and the codebase uses them.
  Otherwise use `@Input()`/`@Output()`.
- **Built-in `@for`** requires `track`. Track by a stable id.

### Reactive forms (the most common case)

```ts
form = this.fb.nonNullable.group({
  email: ['', [Validators.required, Validators.email]],
  name: ['', [Validators.required, Validators.maxLength(100)]],
});
```

- **Show errors only after interaction** (`touched` or `dirty`, or after
  submit).
- **Link each error message to its input** with `aria-describedby`, and
  every input to a `<label>`.
- **On submit:** check `form.invalid`, call `markAllAsTouched()`, then
  submit through the existing service, and disable the button while it is
  pending.
- **Cross-field rules** use a group validator.
- **Async validation** uses `AsyncValidatorFn` with debounce.
- **Server errors** are mapped back onto controls where they are
  field-specific.

### Data and subscriptions

- **Keep HTTP calls in services.** Components call the services.
- **Avoid manual `subscribe` without teardown.** Use the `async` pipe,
  `toSignal`, or `takeUntilDestroyed()`.
- **Do not mutate signal values in place.** Use `set`/`update` with new
  objects or arrays.

### Routing

- **Lazy-load features** with `loadComponent`/`loadChildren`, matching the
  existing route files.
- **Guards and resolvers** are functional (`CanActivateFn`) when the
  codebase uses them. Guards are UX, not security. The API must authorize.

### Security

- Angular sanitizes template bindings by default.
- Do not use `bypassSecurityTrust*` on user-controlled content.
- Do not build HTML strings.
- Never expose server secrets through browser imports, environment
  replacements, public configuration, source maps, HTML, or transfer state.
  Keep privileged credentials and operations on the server; inspect secret
  locations and names without printing values.

## Verification commands

Use the detected manager and the configured package.json or workspace
scripts first. The following CLI commands are examples only when the project
defines compatible targets; do not fetch a global or newer CLI to run them:

```bash
ng build
ng test --watch=false        # Karma: add --browsers=ChromeHeadless if needed
ng lint                      # only if a lint target exists
```

- **Component tests** use `TestBed`.
- **HTTP** uses the project's testing module or provider setup; functional
  providers put `provideHttpClient()` before `provideHttpClientTesting()`.
- Follow the existing spec style (Jasmine, Jest, or Vitest matchers).

## Pitfalls

- Mixing NgModule and standalone patterns inside one feature.
- `effect()` used to derive state that should be `computed()`.
- Forgetting `track` in `@for`, or tracking by object identity on refreshed
  data.
- Calling functions in templates that do expensive work on every change
  detection.
