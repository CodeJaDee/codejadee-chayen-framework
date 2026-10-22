// Evaluator-only Angular spec for task B (Karma/Jasmine, Angular 19.2). Copy to
// web/src/app/orders/orders-page.export.spec.ts and run `npx ng test --watch=false` in web/.
// Not runnable in the Step 15 environment: web/node_modules is not installed (no network authorization).
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OrdersPageComponent } from './orders-page.component';

describe('OrdersPageComponent export', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrdersPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('requests the CSV for the selected status when Export CSV is clicked', () => {
    const fixture = TestBed.createComponent(OrdersPageComponent);
    fixture.detectChanges();
    http.expectOne((r) => r.url === '/api/orders').flush([]);

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = 'Open';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    http.expectOne((r) => r.url === '/api/orders' && r.params.get('status') === 'Open').flush([]);

    const button = [...fixture.nativeElement.querySelectorAll('button')].find((b: HTMLButtonElement) => b.textContent?.trim() === 'Export CSV') as HTMLButtonElement;
    expect(button).withContext('an "Export CSV" button').toBeTruthy();
    button.click();

    const req = http.expectOne((r) => r.url === '/api/orders/export');
    expect(req.request.params.get('status')).toBe('Open');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob(['Id,Customer,Status,Total,PlacedOn\r\n'], { type: 'text/csv' }));
  });
});
