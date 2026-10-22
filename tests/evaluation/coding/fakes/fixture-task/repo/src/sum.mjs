export function sum(values) {
  return values.filter((v) => v > 0).reduce((a, b) => a + b, 0);
}
