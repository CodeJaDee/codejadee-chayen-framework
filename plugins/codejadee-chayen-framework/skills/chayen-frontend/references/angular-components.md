---
kind: technology
---
# Angular components, templates, and injection

## Check the repository first

Read `angular.md` first. Inspect the resolved Angular version, bootstrap,
nearest component, owning module, template syntax, providers, and public
inputs/outputs. Load the matching workflow recipe separately.

## Component boundaries (angular-component-design)

**Applies when:** Building or splitting Angular components with a concrete user interaction and public contract.

**Not when:** Only changing a shared TypeScript model; use language guidance instead.

**Version notes:** Standalone is stable from Angular 15; defaults change across majors. Explicitly match the existing component metadata and bootstrap. Signal inputs and outputs need their own installed-version check.

**Steps:**

1. Find the closest component and record its owner, selector, naming, imports, and input/output convention. Keep NgModule declarations or standalone imports as observed; do not migrate the feature while adding it.
2. Define the smallest input/output contract. Keep server access in the existing service and domain decisions in their current owner. Reuse existing design-system controls rather than adding a parallel component family.
3. Split only at an actual responsibility or reuse boundary. Pass data down and user intent up; do not let a display child fetch unrelated data or mutate its parent's objects.
4. Include pending, empty, error, retry, and disabled states. Test parent binding, output emission, and destruction through the configured component runner; build the owning application to catch missing imports or declarations.

**Verify:** Report PASS, FAIL, or NOT_RUN with the build and component-test commands; check public bindings and rendered states, not private method names.

### Example: decorator contract, compatible with older conventions

```ts
@Input() title = '';
@Output() selected = new EventEmitter<string>();
```

Keep these decorators in a decorator-based feature. Use `input()`/`output()`
only when installed and already appropriate to the requested change.

## Template branches and lists (angular-template-control-flow)

**Applies when:** Angular templates need conditional, repeated, or mutually exclusive views with stable identity.

**Not when:** The issue is asynchronous request ordering; use RxJS interop guidance instead.

**Version notes:** Built-in control flow is available from Angular 17. Older features retain structural directives and their CommonModule dependencies; availability alone is not permission to migrate syntax.

**Steps:**

1. Inspect the Angular major and the nearest template. Select existing `*ngIf`/`*ngFor`/`ngSwitch` syntax or compatible built-in blocks without converting unrelated branches.
2. Enumerate loading, empty, success, and error branches so they cannot accidentally render at the same time. Avoid repeated subscriptions by binding the existing async view model once.
3. Track repeated items by a stable unique key using the project's `trackBy` function or a built-in `track` expression. Check duplicate keys, reorder, insert, and refreshed object instances rather than assuming index identity is safe.
4. Keep expensive transformations outside the template in the existing selector, computed value, or pipe. Build the template and exercise branch transitions plus item reorder; retain focus and local input state for unchanged keys.

**Verify:** Report PASS, FAIL, or NOT_RUN for template compilation and list-reorder tests; include focus retention and duplicate-key behavior in the evidence.

### Example: choose one version-appropriate form

```html
<!-- Angular 17+, only in a feature using built-in blocks -->
@for (item of items; track item.id) { <span>{{ item.name }}</span> }
<!-- Existing structural-directive feature -->
<span *ngFor="let item of items; trackBy: trackId">{{ item.name }}</span>
```

## Injector ownership (angular-dependency-injection)

**Applies when:** Angular services, tokens, providers, or injector boundaries produce incorrect lifetime or resolution behavior.

**Not when:** The request only designs backend dependency injection; use backend guidance instead.

**Version notes:** Constructor injection remains valid. Check installed support and injection context before using `inject()` or environment-provider APIs; asynchronous callbacks do not inherit a synchronous injection context.

**Steps:**

1. Trace the service or token from its consumer through element, route, module, and root providers. Identify whether the feature needs one application instance or separate instances for each component or route.
2. Preserve constructor injection or the existing `inject()` style. Use an InjectionToken for non-class configuration; pass only public frontend configuration, never database credentials or server signing secrets.
3. Place the provider at the smallest existing ownership boundary that satisfies lifetime requirements. Avoid accidentally shadowing a root store with a component provider or leaking user state across server requests.
4. Test resolution, optional dependencies, provider overrides, and instance sharing or isolation. If an asynchronous task needs a service, obtain it in an allowed context first and pass it explicitly; verify cleanup at the owning boundary.

**Verify:** Report PASS, FAIL, or NOT_RUN for injector tests, build, and ownership checks; demonstrate expected instance identity and isolation rather than merely finding a provider declaration.

## Verification commands

Use configured build and component tests from the detected package manager.
Do not invent `ng lint` if no lint target exists.

## Pitfalls

- Declaring a standalone component in an NgModule's declarations.
- Treating `inject()` as callable from any callback.
- Using list indexes for reorderable editable rows.
