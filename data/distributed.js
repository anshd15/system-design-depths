window.SD = window.SD || [];
window.SD.push(
  {
    id: "cap", cat: "Distributed", name: "CAP Theorem",
    tag: "What a system gives up when the network splits.",
    depths: [
      "When the network between two data centers breaks, each side must choose: keep answering, maybe with stale data, or refuse until the link is back. It cannot do both.",
      "During a network Partition, a system chooses Consistency (every read sees the latest write, or gets an error) or Availability (every request gets an answer). Partitions are not optional, so the real choice is CP or AP, and many systems make it per operation.",
      "CAP's consistency means linearizability and its availability means every non-failed node responds, both narrow definitions. PACELC is more useful day to day: if Partitioned, choose A or C; Else, choose Latency or Consistency. Spanner is PC/EC and pays a commit wait of a few milliseconds; Dynamo and Cassandra default to PA/EL. Decide per data type: balances and inventory need CP, while likes and view counts can be AP with mergeable counters."
    ],
    tradeoffs: ["CP: correct answers, errors during partitions", "AP: always answers, sometimes stale", "Strong consistency costs latency even without partitions"],
    ask: "Should a shopping cart be CP or AP? What about checkout?",
    related: ["consistency", "replication", "consensus"]
  },
  {
    id: "consistency", cat: "Distributed", name: "Consistency Models",
    tag: "The rules for what a reader may see after a write.",
    depths: [
      "Consistency is about what you see after someone changes something. Strong consistency means everyone sees the change at once. Eventual consistency means everyone sees it soon.",
      "From strongest to weakest: linearizable (behaves like one up-to-date copy), sequential, causal (a cause is always seen before its effect), read-your-writes, monotonic reads, eventual. Weaker models are cheaper and stay available. Many features need only per-session guarantees.",
      "Linearizability needs coordination on every operation: a quorum round trip or a leader lease. Causal consistency is the strongest model that stays available under partition, tracked with vector clocks or hybrid logical clocks. Transaction isolation is a separate axis: snapshot isolation allows write skew (two on-call doctors both sign off), which serializable isolation (SSI or 2PL) prevents. Name the anomaly your feature cannot tolerate, then pick the cheapest model that rules it out."
    ],
    tradeoffs: ["Stronger models are simpler to reason about", "Weaker models are faster and more available", "Isolation level and replica consistency are separate choices"],
    ask: "A reply appears before the post it answers. Which guarantee is missing?",
    related: ["cap", "replication", "caching"]
  },
  {
    id: "consensus", cat: "Distributed", name: "Consensus",
    tag: "Getting a group of servers to agree on one ordered history.",
    depths: [
      "Consensus is a group vote among servers so they all agree on the same decisions in the same order, even when some of them are down.",
      "Raft elects a leader. The leader appends commands to a log and commits each entry once a majority has stored it, so 5 nodes survive 2 failures. etcd, Consul, CockroachDB and Kafka's KRaft use it. You rarely implement consensus; you use systems built on it for locks, configuration and metadata.",
      "Safety comes from majority overlap: any two majorities share a node, so a newly elected leader must already hold every committed entry (Raft's election restriction). Liveness needs timeouts, because the FLP result shows no deterministic asynchronous protocol can guarantee termination. Every write costs a majority round trip, so cross-region groups add 50–150 ms. Common optimizations: leader leases for local reads (they rely on bounded clock drift), batching and pipelining, and Multi-Raft with one group per shard."
    ],
    tradeoffs: ["Strong agreement, at least one round trip per write", "Odd cluster sizes tolerate the same failures for less cost", "Leader is a throughput bottleneck without sharding"],
    ask: "Why do consensus clusters run 3 or 5 nodes and not 4?",
    related: ["replication", "cap"]
  },
  {
    id: "consistent-hashing", cat: "Distributed", name: "Consistent Hashing",
    tag: "Assigning keys to nodes so membership changes move little data.",
    depths: [
      "Put the servers on a clock face. Each key goes to the next server clockwise. Adding a server only takes keys from its neighbor instead of reshuffling everything.",
      "With hash(key) mod N, changing N remaps almost every key, which empties a cache cluster at once. Consistent hashing moves only about 1/N of keys. Virtual nodes, many points per server on the ring, smooth out uneven arcs.",
      "With V virtual nodes per server, load imbalance shrinks roughly as 1/√V; 100–200 is typical. Alternatives: rendezvous (highest random weight) hashing scores every node per key and needs no ring; jump consistent hash runs in O(log N) with no memory but only adds or removes nodes at the end. Consistent hashing with bounded loads (Google, 2017) caps each node at (1 + ε) × average and spills over, which tames hot keys."
    ],
    tradeoffs: ["Minimal key movement, uneven load without vnodes", "More vnodes, smoother load, bigger routing table", "Hot keys still need replication or bounded loads"],
    ask: "Your cache cluster grows from 10 to 11 nodes and the database falls over. Why?",
    related: ["sharding", "load-balancing", "caching"]
  }
);
