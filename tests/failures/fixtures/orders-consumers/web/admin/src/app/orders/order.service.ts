// Synthetic fixture for failure case FC-0002. Never built or run.
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
export interface Order { id: number; status: string; total: number; }
@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  get(id: number) { return this.http.get<Order>(`/api/orders/${id}`); }
}
