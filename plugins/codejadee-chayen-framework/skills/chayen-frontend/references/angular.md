# Angular

**Applies to:** Angular applications.

- Read the `@angular/core` major version first.
- Many features below appeared in specific majors. If the project is older,
  use the patterns it already has.

## Check the repository first

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
| Tests | The `test` builder in `angular.json`: Karma/Jasmine, Jest, or Vitest |

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

## Verification commands

Prefer the package.json scripts:

```bash
ng build
ng test --watch=false        # Karma: add --browsers=ChromeHeadless if needed
ng lint                      # only if a lint target exists
```

- **Component tests** use `TestBed`.
- **HTTP** is tested with `provideHttpClientTesting()` / `HttpTestingController`.
- Follow the existing spec style (Jasmine, Jest, or Vitest matchers).

## Pitfalls

- Mixing NgModule and standalone patterns inside one feature.
- `effect()` used to derive state that should be `computed()`.
- Forgetting `track` in `@for`, or tracking by object identity on refreshed
  data.
- Calling functions in templates that do expensive work on every change
  detection.
