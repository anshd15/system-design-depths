window.SD = window.SD || [];
window.SD.push({
  id: "key-value-store", cat: "Architectures", name: "Key-Value Store",
  tag: "A Dynamo-style store that stays writable when machines fail.",
  scale: [
    ["Replicas per key", "N = 3"],
    ["Quorum example", "W = 2, R = 2"],
    ["Replica failures tolerated", "1 of 3"],
    ["Gossip round", "~1 s"]
  ],
  flow: ["Client", "Coordinator node", "Consistent-hash ring", "Replica nodes (N = 3)", "Commit log + memtable", "SSTables"],
  depths: [
    "A key-value store is a giant dictionary spread over many machines. Each key lives on a few machines, so if one breaks the others still answer. Any machine can take a request and forward it to the machines that own the key.",
    "Keys are placed on a consistent-hash ring with virtual nodes, and each key is copied to the next N nodes. Clients write to W replicas and read from R; with N = 3, W = 2, R = 2, every read overlaps the latest write. Each node appends to a commit log and an in-memory table, then flushes sorted files to disk (an LSM-tree). Nodes learn about each other through gossip.",
    "The availability tricks come from the Dynamo paper. Sloppy quorums let a write land on a healthy stand-in node, which keeps it as a hint and hands it off when the owner returns. Concurrent writes are tracked with vector clocks (Dynamo) or settled by timestamps (Cassandra's last-write-wins). Anti-entropy repair compares Merkle trees between replicas to find differing ranges without shipping all the data. Failure detection uses gossip with phi-accrual suspicion levels instead of fixed timeouts. Per-request consistency levels let one table serve both fast eventual reads and quorum reads."
  ],
  decisions: ["Consistent hashing with virtual nodes for placement", "Tunable N, R and W per request", "Merkle-tree repair in the background"],
  concepts: ["consistent-hashing", "replication", "cap", "indexing", "consistency"],
  ask: "With N = 3, W = 1, R = 1, what can a user observe, and when is that acceptable?"
});
