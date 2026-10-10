window.SD = window.SD || [];
window.SD.push({
  id: "ad-click-aggregator", cat: "Architectures", name: "Ad Click Aggregator",
  tag: "Count billions of ad clicks per minute, exactly, because they are billed.",
  scale: [
    ["Clicks / day (example)", "10B"],
    ["Avg rate", "~116k / s"],
    ["Aggregation window", "1 min"],
    ["Billing accuracy", "exact"]
  ],
  flow: ["Ad click", "Click redirect service", "Kafka", "Stream processor (Flink)", "OLAP store", "Dashboards + billing", "Batch reconciliation"],
  depths: [
    "Every time someone clicks an ad, the click is logged. A counting system adds up clicks per ad every minute, so advertisers see results almost live and are billed correctly. A slower nightly job recounts everything to catch mistakes.",
    "The click service logs an event (click ID, ad ID, timestamp) to Kafka and redirects the user. A stream processor such as Flink groups events by ad ID into one-minute tumbling windows and writes the counts to an analytics store (Druid, Pinot or ClickHouse) for dashboards. Raw events also land in object storage so a batch job can recompute and correct the totals.",
    "Billing needs exactly-once results: Flink checkpoints its state and Kafka offsets together and writes to the sink transactionally or idempotently, so a restart neither drops nor double-counts clicks. Window by event time, not arrival time, and use watermarks to decide when a window is complete; late clicks update the window or go to the batch correction. Dedupe click IDs to filter double-clicks and retries, and filter fraud before counts reach billing. Popular ads skew partitions, so pre-aggregate within each partition before the global merge. The batch path reconciles against the streaming results every day."
  ],
  decisions: ["Event-time windows with watermarks", "Checkpointed, exactly-once stream processing", "A batch recount reconciles the fast path"],
  concepts: ["event-streaming", "idempotency", "message-queues", "sharding"],
  ask: "A stream worker crashes mid-window. How do you guarantee each click is counted exactly once?"
});
