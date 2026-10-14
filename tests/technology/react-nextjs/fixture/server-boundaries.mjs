// Synthetic server-entry fixtures; no Next compiler or production auth scheme.
// Fixed session identifiers stand in for a project's trusted session provider.
export function createBoundaries() {
  const sessions = new Map([
    ["fixture-alice", { id: "alice", tenant: "one", expiresAt: Infinity }],
    ["fixture-bob", { id: "bob", tenant: "one", expiresAt: Infinity }],
    ["fixture-other-tenant", { id: "alice", tenant: "two", expiresAt: Infinity }],
    ["fixture-expired", { id: "alice", tenant: "one", expiresAt: 0 }],
  ]);
  const order = { id: "order-1", owner: "alice", tenant: "one", name: "Initial" };
  let writes = 0;
  const mutate = (request, input) => {
    const cookie = request.headers.get("cookie") ?? "";
    const sessionId = /(?:^|;\s*)fixture-session=([^;]+)/.exec(cookie)?.[1];
    const user = sessions.get(sessionId);
    if (!user || user.expiresAt <= Date.now()) return { status: 401, body: { error: "unauthenticated" } };
    if (typeof input !== "object" || input === null || typeof input.id !== "string" || typeof input.name !== "string" || !input.name.trim()) return { status: 400, body: { error: "invalid_input" } };
    if (input.id !== order.id) return { status: 404, body: { error: "not_found" } };
    if (user.id !== order.owner || user.tenant !== order.tenant) return { status: 403, body: { error: "forbidden" } };
    // Browser-supplied owner/role fields are ignored, not trusted.
    order.name = input.name; writes++;
    return { status: 200, body: { id: order.id, name: order.name } };
  };
  const action = async (request, form) => mutate(request, { id: form.get("id"), name: form.get("name"), owner: form.get("owner") });
  const handler = async request => {
    if (request.method !== "POST") return Response.json({ error: "method_not_allowed" }, { status: 405, headers: { Allow: "POST" } });
    let input;
    try { input = await request.json(); }
    catch { return Response.json({ error: "invalid_json" }, { status: 400 }); }
    const result = mutate(request, input);
    return Response.json(result.body, { status: result.status, headers: { "Cache-Control": "private, no-store" } });
  };
  return { action, handler, writeCount: () => writes, revoke: id => sessions.delete(id) };
}
