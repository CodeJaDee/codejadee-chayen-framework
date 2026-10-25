import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from './order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  list(status: string | null): Observable<Order[]> {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return this.http.get<Order[]>('/api/orders', { params });
  }

  exportCsv(status: string | null): Observable<Blob> {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return this.http.get('/api/orders/export', { params, responseType: 'blob' });
  }
}
