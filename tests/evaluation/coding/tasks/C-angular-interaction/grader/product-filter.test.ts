// Evaluator-only oracle for task C, run with Node's built-in test runner and type stripping
// (copied to <workspace>/.grader/). It checks the filtering rules; the interaction itself is checked by
// products-page.component.spec.ts, which needs an installed Angular toolchain.
import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProducts } from '../src/app/products/product-filter.ts';
import { PRODUCTS } from '../src/app/products/products.data.ts';

const skus = (q: string) => filterProducts(PRODUCTS, q).map((p) => p.sku);

test('matches the name ignoring case', () => assert.deepEqual(skus('keyboard'), ['KB-100', 'KB-300']));
test('matches inside the name', () => assert.deepEqual(skus('inch'), ['MN-270']));
test('matches the SKU ignoring case', () => assert.deepEqual(skus('ms-210'), ['MS-210']));
test('ignores surrounding spaces', () => assert.deepEqual(skus('  hub  '), ['HD-050']));
test('an empty or blank query shows every product in order', () => {
  assert.deepEqual(skus(''), PRODUCTS.map((p) => p.sku));
  assert.deepEqual(skus('   '), PRODUCTS.map((p) => p.sku));
});
test('no match gives an empty list', () => assert.deepEqual(skus('tablet'), []));
test('does not modify the catalog', () => {
  const before = JSON.stringify(PRODUCTS);
  filterProducts(PRODUCTS, 'mouse');
  assert.equal(JSON.stringify(PRODUCTS), before);
});
