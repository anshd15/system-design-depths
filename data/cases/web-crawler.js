window.SD = window.SD || [];
window.SD.push({
  id: "web-crawler", cat: "Architectures", name: "Web Crawler",
  tag: "Fetch billions of pages politely and keep them fresh.",
  scale: [
    ["Pages / month (example)", "1B"],
    ["Fetch rate", "~400 / s"],
    ["Avg HTML size (assumed)", "~50 KB"],
    ["Raw storage / month", "~50 TB"]
  ],
  flow: ["Seed URLs", "URL frontier", "DNS cache", "Fetchers", "Parser", "Dedupe", "Content store", "Link extractor"],
  depths: [
    "A crawler starts with a list of web addresses, downloads each page, finds the links on it, and adds the new links to its list. It repeats this forever, taking care not to hit any one website too often and skipping pages it has already seen.",
    "The URL frontier decides what to fetch next by priority and politeness: one queue per host, a delay between requests to the same host, and respect for robots.txt. Fetchers download pages in parallel through a cached DNS resolver. Parsed pages go to storage; links are normalized and checked against a seen-URL set (a Bloom filter or a large key-value store), and new URLs go back into the frontier. Content fingerprints catch the same page under different URLs.",
    "Shard the frontier by a hash of the host, so each host's politeness is enforced in one place and fetchers never coordinate. Near-duplicate detection uses SimHash or MinHash, because exact hashes miss pages that differ only by an ad or a timestamp. Recrawl scheduling estimates each page's change rate and revisits fast-changing pages more often, which matters more than raw coverage. Crawler traps such as infinite calendars and session IDs in URLs are bounded with URL length and depth limits and per-host page budgets. Rendering JavaScript-heavy pages needs a headless browser fleet that costs far more per page, so render only where it changes what you extract."
  ],
  decisions: ["One queue per host for politeness", "Shard the frontier by host hash", "Recrawl by estimated change rate, not uniformly"],
  concepts: ["sharding", "consistent-hashing", "message-queues", "rate-limiting", "caching"],
  ask: "How do you stop the crawler from spending a week inside one site's infinite calendar?"
});
