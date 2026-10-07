window.SD = window.SD || [];
window.SD.push(
  {
    id: "message-queues", cat: "Async", name: "Message Queues",
    tag: "A buffer that lets producers and consumers work at their own pace.",
    depths: [
      "A queue is a to-do tray between two workers. The first drops tasks in; the second picks them up when ready. Neither has to wait for the other.",
      "Queues decouple producers from consumers, absorb traffic spikes, and make retries easy. Delivery is at-most-once, at-least-once (the common default, so consumers must be idempotent), or exactly-once within one system's boundary. Dead-letter queues hold messages that keep failing.",
      "Backpressure is the real design question: an unbounded queue only delays the outage and adds latency. Alert on the age of the oldest message, not just depth. A visibility timeout shorter than processing time gets messages processed twice. Ordering holds per partition or group only; global order kills parallelism. Use the transactional outbox pattern to publish events atomically with a database write instead of dual writes."
    ],
    tradeoffs: ["Absorbs spikes, adds end-to-end latency", "At-least-once is easy, so duplicates are your job", "Strict ordering limits parallel consumers"],
    ask: "Order confirmation emails sometimes go out twice. Where can duplicates come from?",
    related: ["idempotency", "event-streaming", "latency"]
  },
  {
    id: "event-streaming", cat: "Async", name: "Event Streaming",
    tag: "A durable, replayable log that many consumers read independently.",
    depths: [
      "Pub/sub is a radio station: the producer broadcasts and anyone tuned in hears it. A stream also keeps the recording, so a new listener can replay from the start.",
      "Kafka-style logs are append-only, partitioned, and kept for days. Each consumer group tracks its own offset, so many teams read the same events independently. Order is guaranteed within a partition, so key by entity ID to keep one entity's events in order.",
      "Throughput comes from sequential disk I/O, batching, zero-copy sends and partition parallelism; a consumer group can never use more consumers than there are partitions. Kafka's exactly-once is idempotent producers plus transactions plus read_committed consumers, and holds only from Kafka to Kafka. Rebalances pause consumption, which cooperative rebalancing reduces. Log compaction keeps the latest value per key, turning a topic into a replayable table that event sourcing and change data capture build on."
    ],
    tradeoffs: ["Replay and fan-out, at the cost of running a log cluster", "More partitions, more parallelism and more overhead", "Per-key order only, never global"],
    ask: "How many partitions should a new topic have, and how would you decide?",
    related: ["message-queues", "idempotency", "sharding"]
  },
  {
    id: "idempotency", cat: "Async", name: "Idempotency",
    tag: "Making a repeated request safe to run again.",
    depths: [
      "Pressing an elevator button five times still calls the elevator once. An idempotent operation gives the same result whether it runs once or many times.",
      "Networks retry, so servers will see duplicates. Make writes idempotent: the client sends an Idempotency-Key header, the server stores key → result, and repeats get the stored result. PUT and DELETE are idempotent by definition; POST usually is not.",
      "Store the key and the side effect in the same transaction, or a crash between them breaks the guarantee. Handle concurrent duplicates with a unique constraint or an in-progress state, and scope keys per client with a TTL (Stripe keeps them 24 hours). Consumers can dedupe on message ID or use conditional writes such as version checks and upserts. Pair all of this with retries using exponential backoff and jitter so clients do not retry in lockstep."
    ],
    tradeoffs: ["Safe retries, extra storage for keys", "Dedupe window is finite, so very late duplicates slip through", "Atomic key + effect needs a transaction"],
    ask: "Design a payment endpoint so a client timeout never charges a card twice.",
    related: ["message-queues", "event-streaming", "rate-limiting"]
  }
);
