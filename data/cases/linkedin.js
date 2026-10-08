window.SD = window.SD || [];
window.SD.push({
  id: "linkedin", cat: "Architectures", name: "LinkedIn",
  tag: "A professional graph and a ranked feed built on top of it.",
  scale: [
    ["Members", "1B+"],
    ["Daily active (estimate)", "~100M"],
    ["Feed loads at 10 / user / day", "~12k / s avg"],
    ["Degrees shown", "1st · 2nd · 3rd"]
  ],
  flow: ["App", "API gateway", "Feed service", "Candidate sources", "Ranker", "Feed cache", "Graph service"],
  depths: [
    "LinkedIn is two things: a map of who knows whom, and a feed of posts from that map. When you open the app, it gathers recent posts from your connections and the people you follow, scores them by how likely you are to care, and shows the best ones first.",
    "The connection graph lives in a dedicated graph service, partitioned by member and held in memory so 'how are we connected' answers fast. The feed uses fan-out on write for most accounts: a new post's ID is pushed into each follower's feed cache. For accounts with millions of followers it switches to fan-out on read and merges their posts at request time. A ranking model scores candidates on relationship strength, early engagement and content type. Activity flows through Kafka, which LinkedIn built for exactly this.",
    "Second- and third-degree queries explode: 500 connections who each have 500 connections is 250,000 second-degree members. Instead of walking the graph live, cache each member's second-degree network in a partitioned store and compute intersections. The feed is a multi-stage pipeline: several candidate sources (network, follows, groups, ads) return thousands of items, a light model prunes them to hundreds, and a heavier model ranks the final page, all inside a budget of a few hundred milliseconds. Hybrid fan-out bounds the write amplification from influencers. Impressions are logged to Kafka both to train the next model and to avoid showing you the same post twice."
  ],
  decisions: ["Hybrid fan-out: push for most, pull for influencers", "Precompute second-degree networks instead of live traversal", "Multi-stage ranking to fit the latency budget"],
  concepts: ["event-streaming", "caching", "sharding", "latency"],
  ask: "How would you show 'You and Priya share 12 connections' on every profile view cheaply?"
});
