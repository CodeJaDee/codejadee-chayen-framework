import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-customer-form', standalone: true, imports: [ReactiveFormsModule],
  template: `<form [formGroup]="form" (ngSubmit)="save()">
    <label>Name <input formControlName="name"></label>
    <label>Email <input formControlName="email"></label>
    <label>Phone <input formControlName="phone"></label>
    <button type="submit">Save</button></form>`
})
export class CustomerFormComponent {
  private fb = inject(FormBuilder);
  form = this.fb.group({ name: [''], email: [''], phone: [''] });
  save() { console.log(this.form.value); }
}
