window.SD = window.SD || [];
window.SD.push(
  {
    id: "scalability", cat: "Fundamentals", name: "Scalability",
    tag: "Growing capacity without rewriting the system each time traffic doubles.",
    depths: [
      "When more people use your app, it needs more power. You can buy a bigger machine (scale up) or add more machines (scale out). A bigger machine eventually hits a ceiling. More machines can keep growing, but they have to cooperate.",
      "Vertical scaling adds CPU and RAM to one box: simple, no code changes, but capped and a single point of failure. Horizontal scaling adds nodes behind a load balancer. It needs stateless app servers (sessions in Redis or signed tokens) and pushes the hard problems down into the data layer.",
      "Scaling is about the bottleneck, not the box. Amdahl's law: if 5% of each request is serialized (a global lock, a single-writer database), the maximum speedup is 20x no matter how many nodes you add. The Universal Scalability Law adds a coherency term, because coordination grows roughly with N², so throughput can fall as you add nodes. In practice: load test, find the saturated resource (CPU, connections, IOPS, lock contention), partition it, and repeat."
    ],
    tradeoffs: ["Scale up: simple, but capped and one failure domain", "Scale out: close to unbounded, but needs statelessness", "Every added node adds coordination cost"],
    ask: "Your API serves 2k requests per second on one server. Walk through getting to 50k.",
    related: ["load-balancing", "sharding", "caching"]
  },
  {
    id: "latency", cat: "Fundamentals", name: "Latency vs Throughput",
    tag: "How long one request takes versus how many requests finish per second.",
    depths: [
      "Latency is how long one trip takes. Throughput is how many trips finish per second. A wide highway moves lots of cars (high throughput) even if each car spends an hour on it (high latency).",
      "Measure latency as percentiles. p50 is the typical user; p99 is the unlucky one, and at scale that is someone every second. Throughput is bounded by the slowest stage. Little's Law ties them together: requests in flight = arrival rate × latency.",
      "Tail latency compounds with fan-out. If a backend is slow on 1% of calls and a page calls 100 of them, about 63% of pages hit at least one slow call (1 − 0.99¹⁰⁰). Mitigations: hedged requests after the p95, deadlines propagated down the call graph, and admission control so queues stay bounded. Near full utilization queueing delay explodes (M/M/1 wait grows as ρ / (1 − ρ)), so run latency-critical tiers at 60–70%."
    ],
    tradeoffs: ["Batching raises throughput and adds latency", "Higher utilization saves money and grows queues", "Averages hide the tail your users feel"],
    numbers: [
      ["L1 cache reference", "1 ns"],
      ["Main memory reference", "100 ns"],
      ["Read 1 MB sequentially from memory", "3 µs"],
      ["SSD random read", "16 µs"],
      ["Round trip within a datacenter", "500 µs"],
      ["Disk seek", "2 ms"],
      ["Packet California → Netherlands → California", "150 ms"]
    ],
    ask: "Why might adding a cache make your p99 latency worse?",
    related: ["caching", "message-queues", "load-balancing"]
  },
  {
    id: "load-balancing", cat: "Fundamentals", name: "Load Balancing",
    tag: "Spreading requests across servers so none of them drowns.",
    depths: [
      "A load balancer is the host at a restaurant door. It sends each new guest to a table with a free waiter, so no single waiter gets swamped, and it stops seating people at a table whose waiter went home.",
      "L4 balancers route by IP and port: fast and protocol-agnostic. L7 balancers read HTTP and can route by path, header or cookie. Common algorithms are round robin, least connections, weighted, and hashing for stickiness. Health checks pull dead nodes out of rotation.",
      "Round robin ignores request cost, and least-connections can stampede a freshly restarted node. The power of two choices (pick two random backends, send to the less loaded) gets near-optimal balance with O(1) state. Long-lived HTTP/2 and gRPC connections pin traffic to one backend, so balance per request, not per connection. Give new nodes slow-start, and run the balancer itself active-active (anycast, DNS, or ECMP across L4 nodes as in Google's Maglev) so it is not a single point of failure."
    ],
    tradeoffs: ["L4: fast and cheap, blind to request content", "L7: smart routing, pays for TLS and parsing", "Sticky sessions simplify state and skew load"],
    ask: "Your gRPC service has 10 pods but one sits at 90% CPU. Why?",
    related: ["scalability", "consistent-hashing", "api-gateway"]
  }
);
