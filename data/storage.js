window.SD = window.SD || [];
window.SD.push(
  {
    id: "caching", cat: "Storage", name: "Caching",
    tag: "Keeping hot data somewhere faster than where it lives.",
    depths: [
      "A cache keeps a copy of something you used recently somewhere faster, like keeping your keys by the door instead of in the basement. The trick is knowing when the copy is out of date.",
      "Patterns: cache-aside (read cache, fall back to the database, then fill the cache), write-through (write cache and database together), write-back (write the cache, flush later). Eviction uses LRU, LFU or TTLs. Hit rate is the number that matters; invalidation is the hard part.",
      "Design for the failure modes. A hot key expiring sends thousands of requests to the database at once (a stampede); fix it with single-flight request coalescing, probabilistic early expiry, or stale-while-revalidate. A cold cache after a flush can take the database down, so warm it gradually. Cache-aside has a race where a slow reader writes a stale value back after a writer's delete; use short TTLs, versioned keys, or a delayed second delete. Size by working set: a Zipfian workload often gets 90% of hits from 10–20% of keys."
    ],
    tradeoffs: ["Faster reads in exchange for possibly stale data", "Write-back is fastest and can lose data on crash", "More memory spent, fewer database round trips"],
    ask: "A celebrity posts and your database melts even though posts are cached. What happened?",
    related: ["latency", "consistency", "cdn"]
  },
  {
    id: "indexing", cat: "Storage", name: "Database Indexing",
    tag: "Finding rows without reading the whole table.",
    depths: [
      "An index works like the index at the back of a book. Instead of reading every page to find one topic, you look it up and jump straight to the right page.",
      "Most databases use B-trees: sorted, balanced, O(log n) lookups and fast range scans. Indexes speed up reads but slow down writes and take space. Column order in a composite index matters: an index on (country, city) helps WHERE country = ? but not WHERE city = ? alone.",
      "B+trees with 4–16 KB pages have a fanout in the hundreds, so a billion rows sit about 3–4 levels deep, mostly cached. LSM-trees (RocksDB, Cassandra) buffer writes in a memtable and flush sorted runs, trading read amplification and compaction work for high write throughput; Bloom filters skip files that cannot hold a key. Covering indexes answer a query without touching the table. Low-selectivity columns such as booleans rarely help, and the planner will scan instead."
    ],
    tradeoffs: ["Faster reads, slower writes", "B-tree: steady reads; LSM: cheap writes, compaction cost", "Every index is more storage and more write amplification"],
    ask: "Queries filter on (user_id, created_at) and are slow despite an index on created_at. Why?",
    related: ["sharding", "replication"]
  },
  {
    id: "replication", cat: "Storage", name: "Replication",
    tag: "Copies of the same data on several machines.",
    depths: [
      "Replication keeps copies of your data on several machines. If one dies, another still has everything, and readers can spread out across the copies.",
      "Leader-follower: one node takes writes and followers replay its log to serve reads. Synchronous replication waits for followers (safer, slower); asynchronous does not (faster, can lose recent writes on failover). Replica lag causes read-your-own-writes bugs.",
      "Multi-leader and leaderless (Dynamo-style) systems accept writes on many nodes and must resolve conflicts: last-writer-wins silently drops data, while version vectors and CRDTs keep it. Quorums: with N replicas, write to W and read from R; if R + W > N, every read overlaps the latest write, though sloppy quorums weaken that. Failover is the dangerous moment: split-brain needs fencing tokens, and promoting an async follower can drop writes you already acknowledged."
    ],
    tradeoffs: ["Sync: no data loss, higher write latency", "Async: fast writes, lag and possible loss", "More replicas, more read capacity and more lag to manage"],
    ask: "A user updates their profile, refreshes, and sees the old one. Explain and fix.",
    related: ["consistency", "cap", "consensus"]
  },
  {
    id: "sharding", cat: "Storage", name: "Sharding",
    tag: "Splitting one dataset across many machines so each holds a slice.",
    depths: [
      "When one filing cabinet is full, you split the files across several: A to M in one, N to Z in another. Each cabinet now handles less, and you can keep adding cabinets.",
      "Range partitioning keeps keys sorted, which is good for scans but risks hot ranges such as today's date. Hash partitioning spreads load evenly but loses range queries. Pick a shard key that matches the main access pattern and spreads writes. Cross-shard joins and transactions get expensive.",
      "Hot partitions are the usual failure: one celebrity account or a time-ordered key. Mitigate by salting keys, splitting hot ranges dynamically (Spanner, CockroachDB, DynamoDB adaptive capacity), or caching. Resharding means moving data while serving traffic, so create far more logical partitions than nodes (for example 4096) and move whole partitions, not rows. Secondary indexes are either local, needing scatter-gather reads, or global, updated asynchronously and eventually consistent."
    ],
    tradeoffs: ["Linear write scaling, harder cross-shard queries", "Hash keys: even load, no range scans", "Range keys: fast scans, hot spots"],
    ask: "Design the shard key for a chat app's messages table.",
    related: ["consistent-hashing", "indexing", "scalability"]
  }
);
