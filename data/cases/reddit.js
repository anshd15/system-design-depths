window.SD = window.SD || [];
window.SD.push({
  id: "reddit", cat: "Architectures", name: "Reddit",
  tag: "Votes, ranked front pages, and deeply nested comment threads.",
  scale: [
    ["Daily active users", "~100M"],
    ["Hot score: 10× the votes equals", "12.5 h newer"],
    ["Comment depth", "unbounded"],
    ["Vote write path", "async queue"]
  ],
  flow: ["Client", "CDN (logged-out pages)", "API", "Vote queue", "Vote processors", "Postgres + Cassandra", "Listing cache", "Comment tree cache"],
  depths: [
    "People vote posts up or down. The front page sorts posts by a score that mixes votes with age, so a new post with a few votes can beat an old post with many. Comments form a tree of replies that loads a piece at a time.",
    "Votes go into a queue and are processed asynchronously, so a voting surge never blocks page loads; the score updates a moment later. Listings, such as 'hot' for a subreddit, are precomputed sorted lists of post IDs kept in cache and updated as votes arrive. The classic hot formula is log10 of the net score plus the post time divided by 45,000 seconds, so ten times the votes is worth 12.5 hours of recency. Logged-out traffic is served largely from CDN cache.",
    "Vote processing is idempotent per user and post: store each user's current vote and apply only the change, so retries and changed votes stay correct. Hot posts concentrate writes, so votes are partitioned by post in the queue and batched before counters update. Comment trees are expensive to assemble, so the tree structure is precomputed and cached per post, and deep branches load lazily ('load more comments'). Displayed counts are fuzzed slightly to frustrate vote bots. Reddit has been moving from its Python monolith toward Go services behind GraphQL, with Cassandra for high-write data."
  ],
  decisions: ["Votes go through a queue, not inline writes", "Precomputed listings per sort order", "Lazy-load deep comment branches"],
  concepts: ["message-queues", "idempotency", "caching", "cdn", "sharding"],
  ask: "How do you keep 'hot' listings current within seconds without re-sorting a subreddit on every vote?"
});
