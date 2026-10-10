window.SD = window.SD || [];
window.SD.push({
  id: "stock-exchange", cat: "Architectures", name: "Stock Exchange",
  tag: "Match buy and sell orders fairly, in strict order, in microseconds.",
  scale: [
    ["Matching latency", "microseconds"],
    ["Order messages / s (example)", "millions"],
    ["Priority rule", "price, then time"],
    ["Lost orders allowed", "0"]
  ],
  flow: ["Broker", "Gateway (risk checks)", "Sequencer", "Matching engine", "Market data feed", "Clearing"],
  depths: [
    "For each stock, an exchange keeps a list of people who want to buy and a list who want to sell, sorted by price. When a buy price meets a sell price, a trade happens. At the same price, whoever arrived first goes first, so the system must keep a strict order.",
    "Gateways authenticate brokers and run pre-trade risk checks. A sequencer stamps every order with a sequence number, creating one total order. The matching engine holds an in-memory order book per symbol (price levels, each a first-in-first-out queue) and matches by price-time priority. Results go out as execution reports to the parties and as a public market data feed. Every input is journaled before matching so state can be rebuilt.",
    "Determinism is the core design. The matching engine is single-threaded per symbol and reads the sequenced log, so replaying the log rebuilds exactly the same order book. Replicas consume the same log in lockstep (state machine replication) for instant failover. Everything is tuned for microseconds: kernel-bypass networking, pinned CPU cores, preallocated memory, no garbage-collection pauses, and lock-free ring buffers like the LMAX Disruptor. Market data goes out over UDP multicast with sequence numbers, so receivers detect gaps and recover from a retransmission service. Fairness extends to the network: colocated participants get equal cable lengths."
  ],
  decisions: ["One sequenced log is the source of truth", "Single-threaded, deterministic matching per symbol", "Replicas replay the same log for failover"],
  concepts: ["consensus", "replication", "latency", "event-streaming", "idempotency"],
  ask: "The primary matching engine dies mid-session. How does the backup take over without losing or duplicating fills?"
});
