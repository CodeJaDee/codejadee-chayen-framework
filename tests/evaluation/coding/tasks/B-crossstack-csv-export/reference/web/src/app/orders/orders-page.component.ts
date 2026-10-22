import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { OrderService } from './order.service';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './orders-page.component.html',
})
export class OrdersPageComponent {
  private readonly orders = inject(OrderService);

  readonly statuses = ['Open', 'Shipped', 'Cancelled'] as const;
  readonly status = signal<string | null>(null);
  readonly rows = toSignal(toObservable(this.status).pipe(switchMap((s) => this.orders.list(s))), { initialValue: [] });

  selectStatus(value: string): void {
    this.status.set(value === '' ? null : value);
  }

  exportCsv(): void {
    this.orders.exportCsv(this.status()).subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'orders.csv';
      link.click();
      URL.revokeObjectURL(url);
    });
  }
}
