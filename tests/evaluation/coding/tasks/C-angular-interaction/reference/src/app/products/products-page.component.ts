import { CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { filterProducts } from './product-filter';
import { PRODUCTS } from './products.data';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './products-page.component.html',
})
export class ProductsPageComponent {
  readonly query = signal('');
  readonly visible = computed(() => filterProducts(PRODUCTS, this.query()));

  search(value: string): void {
    this.query.set(value);
  }

  clear(): void {
    this.query.set('');
  }
}
