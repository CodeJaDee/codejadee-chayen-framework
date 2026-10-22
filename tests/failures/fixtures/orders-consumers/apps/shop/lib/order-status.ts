// Synthetic fixture for failure case FC-0002. Never built or run.
// A second consumer that shares no type with the API, so a symbol search misses it.
export async function orderStatus(id: number): Promise<string> {
  const res = await fetch('/api/orders/' + id);
  const body = await res.json();
  return body.status;
}
