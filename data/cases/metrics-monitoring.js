window.SD = window.SD || [];
window.SD.push({
  id: "metrics-monitoring", cat: "Architectures", name: "Metrics Monitoring",
  tag: "Collect millions of time series and alert before users notice.",
  scale: [
    ["Active series (example)", "10M"],
    ["Scrape interval", "15 s"],
    ["Samples / s", "~670k"],
    ["Bytes per sample (Gorilla)", "~1.37"]
  ],
  flow: ["Services (exporters)", "Scrapers / collectors", "Ingest queue", "Time-series database", "Query engine", "Dashboards", "Alert manager"],
  depths: [
    "Every service reports numbers about itself every few seconds: requests, errors, memory, latency. A monitoring system stores those numbers over time, draws charts, and raises an alert when something crosses a line, such as errors going above 1%.",
    "The data is time series: a metric name plus labels (service, region, status) with timestamped values. Collectors pull them (Prometheus-style scraping) or receive pushes, then write into a time-series database built for appends and time-range scans. Queries aggregate across series, such as p99 latency by region over 5 minutes. An alerting engine evaluates rules on a schedule and routes alerts with dedupe, grouping and silences.",
    "Compression makes it affordable: Facebook's Gorilla encodes timestamps as delta-of-delta and values with XOR, reaching about 1.37 bytes per sample. Cardinality is the real limit: one label holding user IDs creates millions of series and can take the system down, so enforce label limits at ingest. Downsample old data (raw for days, 1-minute for months, 1-hour for years). Shard ingestion by series hash and keep recent data in memory for fast dashboards. The monitoring system must survive the outages it reports, so run it independently of production and alert on missing data, not only on bad values."
  ],
  decisions: ["Delta-of-delta and XOR compression", "Hard limits on label cardinality", "Downsample by age"],
  concepts: ["sharding", "indexing", "event-streaming", "replication"],
  ask: "A team adds user_id as a label and the metrics cluster falls over. Why, and how do you prevent it?"
});
