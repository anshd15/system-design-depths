window.SD = window.SD || [];
window.SD.push({
  id: "typeahead", cat: "Architectures", name: "Search Typeahead",
  tag: "Suggest completions on every keystroke in under 100 ms.",
  scale: [
    ["Searches / day (example)", "1B"],
    ["Keystrokes per search", "~6"],
    ["Suggest requests", "~70k / s avg"],
    ["Latency budget", "< 100 ms"]
  ],
  flow: ["Search box", "Browser / CDN cache", "Suggest service", "Trie shards in memory", "Offline aggregation", "Query logs"],
  depths: [
    "As you type, the box guesses what you mean from what other people searched most. It keeps a tree of letters where each path spells a query, and each spot in the tree already knows its most popular endings, so answering is a quick walk down the tree.",
    "Keep a trie in memory where every node stores its top-k completions, so a lookup costs only the length of the prefix. Build it offline: aggregate query logs every hour, count frequencies with time decay, and publish new trie snapshots to the suggest servers. Debounce on the client (wait 50–100 ms between keystrokes) and cache responses in the browser and CDN, since short prefixes are shared by everyone.",
    "Shard the trie by prefix range, but split by observed traffic rather than alphabet, because 's' is far hotter than 'x'. Replicate shards heavily; the data is read-only between rebuilds, so replicas are cheap and consistency is a non-issue. Trending queries need a fast path: a streaming job counts recent queries over a short window and merges them with the batch top-k at request time. Personalization (history, location, language) is blended in per request instead of baked into the global trie. Filter unsafe suggestions at build time with a blocklist and again at serve time."
  ],
  decisions: ["Precompute top-k at each trie node", "Rebuild offline and swap snapshots atomically", "Shard by traffic, not by alphabet"],
  concepts: ["caching", "sharding", "replication", "latency", "cdn"],
  ask: "How would you get a breaking-news query into suggestions within five minutes?"
});
