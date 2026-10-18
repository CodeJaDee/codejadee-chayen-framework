---
kind: recipe
capabilities: [CAP-06-006, CAP-06-007]
---
# Messaging and event-driven integration

Integrate services through messages with the project's existing broker and
messaging library. This recipe covers event and command contracts, publishing
atomically with the state change, consumers that tolerate duplicates and
reordering, and a queue topology with retries, dead-lettering, and
poison-message handling.

## Inputs

- The business events or commands, their producers and consumers, and the
  delivery and ordering needs.
- The broker and library already in use, with their configuration.
- The volumes, the message size, and the latency expectations.

## Procedure

1. **Detect the messaging stack:**
   - the broker client and abstraction library;
   - the existing message contracts;
   - the naming conventions;
   - whether an outbox exists.

   Reuse them. Never introduce a broker or library without approval.
   Choosing one is an architecture decision.
2. **Design the contract.**
   - Name events in the past tense (`OrderPlaced`) and commands in the
     imperative.
   - Include a message ID, the correlation ID, the occurred-at time, the
     schema version, and the minimum business data. Avoid entity dumps.
   - Additive evolution only. Consumers ignore unknown fields.
3. **Publish atomically.**
   - Write the message to an outbox in the same database transaction as the
     state change.
   - A relay publishes from the outbox.
   - Publishing directly after commit risks lost events. Publishing before
     commit risks phantom events. Neither is acceptable for business-critical
     events.
4. **Make consumers safe.**
   - Make the handler idempotent: deduplicate by message ID (an inbox table
     or a unique constraint), or make the effects naturally idempotent.
   - Handle out-of-order arrival with versions or timestamps.
   - Keep handlers short. Never call back synchronously into the producer
     within the transaction.
5. **Design the topology:**
   - queues, topics, and subscriptions;
   - partitioning or session keys where ordering per entity matters;
   - the retry policy (bounded, with backoff);
   - the dead-letter destination;
   - poison-message detection;
   - the maximum delivery count.

   State the delivery guarantee: at least once, and how duplicates are
   absorbed.
6. **Make it observable:**
   - correlation IDs propagated through the message headers;
   - metrics for lag, failures, and the dead-letter count;
   - a runbook note for replaying dead letters.
7. **Test:**
   - publish in the same transaction (an outbox row exists after commit);
   - a duplicate delivery processed once;
   - a failure ending in the dead letter after the maximum retries.

   Use the library's test harness or containers, never a production broker.

## Outputs

- Message contracts with versioning rules, and producer and consumer code
  following the existing library's patterns.
- Outbox or equivalent atomic publishing, and idempotent consumers.
- A topology description: queues, topics, keys, retry, dead-letter, and the
  maximum delivery count, with the delivery guarantee stated.
- Tests for atomic publish, duplicate handling, and dead-lettering.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | MassTransit (with its transactional outbox, retry, and redelivery), NServiceBus, Wolverine, `Azure.Messaging.ServiceBus` (sessions for ordering, a built-in dead-letter queue), `RabbitMQ.Client`, `Confluent.Kafka`. Use whatever the project already uses. MassTransit's test harness for tests. |
| Node (Next.js, Nuxt server) | BullMQ (Redis), `amqplib`, `kafkajs`, the Azure Service Bus SDK. Serverless route handlers are poor long-running consumers, so run consumers as workers. |
| Python | Celery (task acknowledgement after completion, visibility timeout), `aio-pika`, `confluent-kafka`, `azure-servicebus`. Django: a `transaction.on_commit` hook as a minimal outbox alternative, noting its loss risk on crash. |
| SQL Server / PostgreSQL | An outbox table in the same database. Use a unique constraint on the message ID for inbox deduplication. PostgreSQL `LISTEN`/`NOTIFY` is not a durable queue. |

## Verification

- The event is persisted to the outbox, or the equivalent, in the same
  transaction as the state change. A test or code citation shows it.
- A duplicate delivery produces a single effect, shown by a test.
- Retry, dead-letter, and the maximum delivery count are configured and
  documented. The delivery guarantee is stated.
- No new broker or library was introduced without approval. Tests use a
  harness or containers.
