window.SD = window.SD || [];
window.SD.push({
  id: "twitter", cat: "Architectures", name: "Twitter / X",
  tag: "Deliver each post to every follower's timeline within seconds.",
  scale: [
    ["Posts / day (2013 figures)", "~500M"],
    ["Posts / s avg", "~6k"],
    ["Timeline reads", "~300k / s"],
    ["Largest accounts", "100M+ followers"]
  ],
  flow: ["Client", "Write API", "Fan-out service", "Timeline cache (Redis)", "Home timeline service", "Ranker", "Client"],
  depths: [
    "When you post, the system copies a pointer to your post into the home timeline of everyone who follows you. Opening the app then just reads your already-built timeline. For accounts with millions of followers, their posts are mixed in when you open the app instead of being copied ahead of time.",
    "Fan-out on write: the post is stored once, then a fan-out service looks up the author's followers and pushes the post ID into each follower's timeline list in Redis, capped at the latest ~800 entries. A read is one cache lookup plus filling in post bodies and user details from caches. Celebrity posts skip fan-out and are merged at read time. Search runs on a separate real-time index fed by the same stream of posts.",
    "Fan-out cost is followers × posts: one account with 100M followers would mean 100M cache writes per post, which is why the hybrid cutoff exists. Timelines are kept only for active users; anyone else's is rebuilt on demand from the social graph. Lost cache nodes are rebuilt rather than restored. IDs come from Snowflake (41 bits of timestamp, 10 bits of worker ID, 12 bits of sequence), so they sort by time without coordination. Ranking turned the chronological list into a candidate pool: in-network posts from timelines, out-of-network posts from embeddings and graph signals, then a heavy ranking model."
  ],
  decisions: ["Precompute timelines for active users only", "Hybrid fan-out with a follower-count cutoff", "Snowflake IDs: time-sortable, no coordination"],
  concepts: ["caching", "event-streaming", "replication", "sharding"],
  ask: "Where would you set the follower cutoff between push and pull, and how would you tune it?"
});
