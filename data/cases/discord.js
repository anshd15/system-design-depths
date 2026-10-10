window.SD = window.SD || [];
window.SD.push({
  id: "discord", cat: "Architectures", name: "Discord",
  tag: "Trillions of stored messages, giant servers, and live voice.",
  scale: [
    ["Messages stored", "trillions"],
    ["Database nodes after migration", "177 → 72"],
    ["Largest servers", "millions of members"],
    ["Message partition", "channel + time bucket"]
  ],
  flow: ["Client", "Gateway (WebSocket)", "Guild process (Elixir)", "API", "Data services (Rust)", "ScyllaDB", "Voice servers"],
  depths: [
    "Each Discord server (a 'guild') has a process that knows who is online and relays messages to them. Messages are stored in a large database grouped by channel and time, so loading the latest chat is quick. Voice chat runs on separate servers built for live audio.",
    "Clients connect to a gateway over WebSocket. Each guild is an Elixir process that fans out events to connected members. Messages live in a wide-column database partitioned by channel ID and time bucket, so a channel's recent history is a single partition read, and message IDs are Snowflakes that sort by time. Voice uses dedicated media servers over UDP that forward streams without mixing them.",
    "Discord moved from MongoDB to Cassandra in 2017 and from Cassandra to ScyllaDB in 2022, shrinking 177 nodes to 72 and cutting tail latency. Hot partitions were the main pain: a big announcement channel is read by everyone at once. The fix was a Rust data-services layer that coalesces concurrent reads of the same channel into one database query, with consistent-hash routing so a channel always reaches the same data-service instance. Huge guilds strain one fan-out process, so Discord split member fan-out across relay processes and sends presence lazily in large servers. The migration copied trillions of messages with a custom Rust tool in about nine days."
  ],
  decisions: ["Partition messages by channel and time bucket", "Coalesce hot reads in a service layer", "One process per guild for fan-out"],
  concepts: ["sharding", "consistent-hashing", "caching", "replication", "latency"],
  ask: "A server with 1M members posts an announcement. What happens to the gateways and the database?"
});
