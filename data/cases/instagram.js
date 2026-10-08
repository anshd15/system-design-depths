window.SD = window.SD || [];
window.SD.push({
  id: "instagram", cat: "Architectures", name: "Instagram",
  tag: "Photo uploads, a ranked feed, and stories for billions of users.",
  scale: [
    ["Monthly users", "2B+"],
    ["Posts / day (estimate)", "~100M"],
    ["Uploads", "~1.2k / s avg"],
    ["Feed loads (estimate)", "~58k / s avg"],
    ["Story lifetime", "24 h"]
  ],
  flow: ["App", "API", "Media upload", "Object storage + CDN", "Sharded Postgres", "Fan-out workers", "Feed cache", "Ranker"],
  depths: [
    "When you post a photo, it is stored once and copied into a few sizes for different screens. Your followers' feeds get a pointer to the new post. When they open the app, it gathers those pointers, ranks the posts, and loads the images from a server nearby.",
    "Media and metadata are split. Photos go to object storage and are served through a CDN in several resolutions. Metadata such as posts, likes, comments and follows lived for years in sharded PostgreSQL, with Cassandra for high-write data like feeds and inboxes. Feeds use fan-out on write into per-user lists, switching to fan-out on read for celebrities. A ranking model orders candidates by predicted interest. Stories are a separate system with a 24-hour TTL.",
    "Instagram's ID scheme packs a millisecond timestamp, a logical shard ID and a per-shard sequence into 64 bits, generated inside PostgreSQL, so IDs sort by time and name their shard with no central ID service. Thousands of logical shards map onto fewer physical databases, so rebalancing moves whole logical shards. Like counts on viral posts are a write hotspot: keep them in a counter cache with periodic flushes and store denormalized counts rather than running COUNT(*). Instagram kept Django and invested in Python performance (Cinder) instead of a rewrite. Uploads feel instant because the app starts uploading the photo while you are still writing the caption."
  ],
  decisions: ["IDs encode time and shard, generated in the database", "Many logical shards on few physical hosts", "Upload media before the user taps Share"],
  concepts: ["sharding", "cdn", "caching", "event-streaming", "replication"],
  ask: "A post gets 5M likes in an hour. How do you keep the like count fast and roughly right?"
});
