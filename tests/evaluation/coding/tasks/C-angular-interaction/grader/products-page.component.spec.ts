// Evaluator-only Angular spec for task C (Karma/Jasmine, Angular 19.2). Copy to
// src/app/products/products-page.component.spec.ts and run `npx ng test --watch=false`.
// Not runnable in the Step 15 environment: node_modules is not installed (no network authorization).
import { TestBed } from '@angular/core/testing';
import { ProductsPageComponent } from './products-page.component';

describe('ProductsPageComponent interaction', () => {
  const rows = (el: HTMLElement) => [...el.querySelectorAll('ul.products li')].map((li) => li.textContent?.trim() ?? '');

  function setup() {
    TestBed.configureTestingModule({ imports: [ProductsPageComponent] });
    const fixture = TestBed.createComponent(ProductsPageComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const input = el.querySelector('input[type="search"]') as HTMLInputElement;
    const clear = [...el.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Clear') as HTMLButtonElement;
    return { fixture, el, input, clear };
  }

  it('filters the rendered list as the user types', () => {
    const { fixture, el, input } = setup();
    expect(rows(el).length).toBe(5);
    input.value = 'Keyboard';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(rows(el).length).toBe(2);
    expect(rows(el).every((r) => r.includes('Keyboard'))).toBeTrue();
  });

  it('Clear empties the box and shows every product again', () => {
    const { fixture, el, input, clear } = setup();
    input.value = 'mouse';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    clear.click();
    fixture.detectChanges();
    expect(input.value).toBe('');
    expect(rows(el).length).toBe(5);
  });

  it('shows "No products match" when nothing matches', () => {
    const { fixture, el, input } = setup();
    input.value = 'tablet';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(el.textContent).toContain('No products match');
  });
});
