import type { Product } from './product';

// Products whose name or SKU contains the query, ignoring case and surrounding spaces.
// A blank query returns every product.
export function filterProducts(products: readonly Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...products];
  return products.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
}
