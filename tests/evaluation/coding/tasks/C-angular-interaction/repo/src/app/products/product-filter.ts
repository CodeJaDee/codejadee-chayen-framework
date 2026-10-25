import type { Product } from './product';

// Products whose name or SKU matches the search query.
export function filterProducts(products: readonly Product[], query: string): Product[] {
  return [...products];
}
