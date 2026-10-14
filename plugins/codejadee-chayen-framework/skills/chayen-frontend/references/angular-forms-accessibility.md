---
kind: technology
---
# Angular forms and accessible interaction

## Check the repository first

Read `angular.md`. Inspect Angular/forms versions, control wrappers, form
strategy, validation rules, design-system widgets, accessibility helpers,
and component/browser test commands.

## Form contracts (angular-forms)

**Applies when:** Angular forms need controls, validation, submission handling, or integration with existing field components.

**Not when:** Only changing backend validation rules; use backend validation guidance instead.

**Version notes:** Typed reactive forms arrived in Angular 14. Preserve reactive, template-driven, or existing signal-form conventions; check installed signal-form APIs and stability rather than assuming they follow core signal availability.

**Steps:**

1. Find the nearest form and its field rules, validation timing, custom controls, and submit service. Keep its existing form strategy and import placement in standalone components or owning NgModules.
2. Choose nullable or non-nullable controls deliberately: reset behavior and disabled values affect the submitted contract. Use group validators for cross-field rules and cancellable Observable async validation where supported; do not lose disabled data unintentionally.
3. Show errors after interaction or attempted submission. On invalid submit mark fields touched; link labels and error descriptions. Preserve field-specific server errors and pending state while preventing duplicate submissions.
4. Test invalid, valid, pending, reset, disabled, cross-field, and server-error paths. For custom controls verify ControlValueAccessor value, touched, and disabled propagation. Do not hide a failed save behind a success notification or clear the user's data before success.

**Verify:** Report PASS, FAIL, or NOT_RUN with form and component-test commands; assert submitted payloads and visible errors, including reset and disabled-control semantics.

```ts
// Angular 14+ reactive feature; FormBuilder and Validators imports required.
readonly form = this.fb.nonNullable.group({
  email: ['', [Validators.required, Validators.email]],
  name: ['', [Validators.required, Validators.maxLength(100)]],
});
```

## Accessible Angular views (angular-accessibility)

**Applies when:** Angular controls, validation, navigation, or dynamic content need accessible semantics and user interaction.

**Not when:** Only producing a visual mockup without code; use design guidance instead.

**Version notes:** Semantic HTML works across supported Angular versions. Match installed CDK or component-library accessibility APIs; do not add or upgrade an accessibility library simply because a newer release exists.

**Steps:**

1. Identify roles, accessible names, labels, keyboard order, focus targets, and status messages in the affected view. Reuse the project's accessible component library before building custom keyboard interactions.
2. Prefer native buttons, links, and inputs. Connect each input's id with its label and error descriptions; bind ARIA attributes appropriately, for example attr.aria-invalid, and avoid duplicate ids in repeated rows.
3. Manage focus after route changes, dialog closure, and invalid submission according to existing helpers. Announce meaningful asynchronous failures or completion through an appropriate live region without flooding it with every state change.
4. Test keyboard-only operation, focus restoration, label-based queries, error association, and disabled controls in the configured browser runner. Run existing automated accessibility checks and record a manual assistive-technology check separately; static markup cannot prove screen-reader behavior.

**Verify:** Report PASS, FAIL, or NOT_RUN for automated, keyboard, and assistive-technology checks separately, with commands or manual procedure; report rendered behavior only when observed.

```html
<label for="email">Email</label>
<input id="email" formControlName="email" aria-describedby="email-error"
       [attr.aria-invalid]="form.controls.email.invalid && form.controls.email.touched">
<p id="email-error">{{ emailError }}</p>
```

## Verification commands

Use configured form/component tests and browser accessibility checks. The
form example requires a containing formGroup and ReactiveFormsModule.

## Pitfalls

- Replacing reactive forms with signal forms without a request.
- Reading form.value when the contract requires disabled controls too.
- Using clickable divs without native keyboard semantics.
