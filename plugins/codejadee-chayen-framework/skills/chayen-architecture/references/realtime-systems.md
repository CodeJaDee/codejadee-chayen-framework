---
kind: recipe
capabilities: [CAP-19-002]
---
# Realtime system design

Design realtime features (WebSockets, SignalR, Server-Sent Events, or
long polling) that keep working across several instances: transport choice,
scale-out (backplane or sticky sessions), fan-out and back-pressure,
authorization per connection and per message, ordering, and client
reconnection with recovery of missed messages. The design is a proposal
until its owner approves it.

## Inputs

- The use case: who receives what, how fast, how many concurrent
  connections, message rates, and whether messages may be lost.
- The existing stack: realtime libraries already in the repository, hosting
  (containers, App Service, serverless), load balancer, and any broker or
  cache that could act as a backplane.
- Authentication and tenant model.

## Procedure

1. **Inspect what exists:** realtime packages (SignalR, Socket.IO, `ws`,
   Django Channels, Starlette WebSockets), hosting limits on WebSockets,
   proxies and their idle timeouts, and any broker or Redis. Do not assume a
   managed service or backplane exists; list what is missing as an option
   for approval.
2. **Choose the transport:** Server-Sent Events for one-way server
   updates over HTTP, WebSockets or SignalR for bidirectional or
   high-frequency traffic, and polling where infrastructure blocks
   long-lived connections. State the trade-offs.
3. **Design scale-out:** a backplane (Redis, a managed realtime service, a
   broker) so any instance can reach any client, or sticky sessions with
   their failure behaviour. State the fan-out cost at peak.
4. **Authorize every connection and message:** authenticate on connect,
   check group or channel membership on join, re-check permissions for
   sensitive messages, and expire connections when tokens expire.
5. **Handle back-pressure and limits:** per-connection send buffers, message
   size limits, rate limits, and what happens to slow consumers (drop,
   coalesce, disconnect).
6. **Define ordering and delivery:** per-entity sequence numbers where
   order matters, and at-most-once versus recoverable delivery.
7. **Design reconnection:** client backoff with jitter, resubscription, and
   recovery of missed messages (a sequence number or last-event ID with a
   replay buffer, or a resync from the source of truth).
8. **Plan observability and tests:** connection counts, message rates,
   send-queue depth, and a test with two instances proving a message
   published on one reaches a client on the other.

## Outputs

- A transport choice and scale-out design (backplane or sticky sessions)
  with failure handling.
- A client reconnection and missed-message strategy, labelled proposed.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | SignalR with a Redis backplane or Azure SignalR Service, hub authorization with `[Authorize]` and group checks, `MaximumReceiveMessageSize`, stateful reconnect in recent versions. |
| Node and TypeScript | `ws` or Socket.IO with its Redis adapter, Server-Sent Events from Nuxt or Next.js route handlers (serverless platforms may cap connection duration). |
| Python | Django Channels with a Redis channel layer, or Starlette and FastAPI WebSockets behind a broker for fan-out. |
| Angular, React, Vue | The SignalR or Socket.IO client with automatic reconnect, or `EventSource` with `Last-Event-ID`; UI states for reconnecting and stale data. |
| Infrastructure | Load balancer and proxy idle timeouts, WebSocket support in the hosting plan, and connection limits per instance. |

## Verification

- The design covers scale-out across instances and recovery of messages
  missed during reconnection.
- Every connection and sensitive message has an authorization check.
- Technology the design relies on was found in the repository, or is listed
  as an option needing approval.
- The design is labelled proposed.
