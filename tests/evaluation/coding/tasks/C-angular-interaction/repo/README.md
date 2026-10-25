# Catalog admin

Angular 19.2 standalone app (signals, built-in control flow). All product data
is synthetic.

```bash
npm ci
npx ng build
npx ng test --watch=false
```

The Products page (`src/app/products`) lists products with a search box and a
Clear button. Filtering logic lives in `product-filter.ts`, kept free of
Angular imports so it can be unit-tested on its own.
