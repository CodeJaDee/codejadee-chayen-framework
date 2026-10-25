import type { Product } from './product';

// Products whose name or SKU contains the query.
export function filterProducts(products: readonly Product[], query: string): Product[] {
  if (!query) return [...products];
  return products.filter((p) => p.name.includes(query) || p.sku.includes(query));
}
