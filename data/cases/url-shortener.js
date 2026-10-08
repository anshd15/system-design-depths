window.SD = window.SD || [];
window.SD.push({
  id: "url-shortener", cat: "Architectures", name: "URL Shortener",
  tag: "Turn long links into 7-character codes and redirect every click fast.",
  scale: [
    ["New links / day", "10M"],
    ["Writes", "~115 / s"],
    ["Redirects at 100:1", "~11.5k / s avg"],
    ["5-year storage", "~9 TB"],
    ["Codes in base62⁷", "3.5 trillion"]
  ],
  flow: ["Browser", "CDN / edge", "Load balancer", "Redirect service", "Redis cache", "Key-value store"],
  depths: [
    "You give it a long link and it hands back a short code like sho.rt/aZ3k9Qx. When someone opens the short link, the service looks up the code, finds the long link, and sends the browser there. It is a giant lookup table that is read far more often than it is written.",
    "Write path: generate a unique 7-character base62 code, store code → long URL in a key-value store such as DynamoDB or Cassandra, and return it. Read path: look up the code and answer with HTTP 301 (the browser remembers it) or 302 (every click comes back, so you can count it). Reads outnumber writes 100 to 1, so put Redis in front; a small set of hot links gets most clicks. Shard the store by code.",
    "Code generation is the real decision. Hashing the URL and keeping 43 bits gives dedupe for free but needs collision checks. A global counter encoded in base62 never collides, but it is guessable and a bottleneck, so hand each app server a range of 1,000 IDs from ZooKeeper or a database sequence and keep coordination off the hot path. A third option pre-generates random codes into a key pool and pops them. Keep analytics off the redirect path by emitting click events to Kafka and aggregating later. Defend the write path with per-key rate limits and malware URL scanning."
  ],
  decisions: ["301 is cheaper; 302 keeps click analytics", "ID ranges avoid collisions without per-write coordination", "Async click events keep redirects fast"],
  concepts: ["caching", "sharding", "cdn", "rate-limiting", "event-streaming"],
  ask: "How do you support custom aliases and link expiry without slowing redirects?"
});
