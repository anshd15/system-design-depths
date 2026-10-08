window.SD = window.SD || [];
window.SD.push({
  id: "slack", cat: "Architectures", name: "Slack",
  tag: "Channels, messages and presence for teams, delivered in real time.",
  scale: [
    ["Open WebSockets (example)", "10M"],
    ["Messages / s (example)", "~50k"],
    ["Delivery target", "< 500 ms"],
    ["History on reconnect", "since last seen"]
  ],
  flow: ["Client", "Edge / gateway", "Web app", "Vitess (MySQL)", "Job queue", "Channel servers", "WebSocket gateways", "Clients"],
  depths: [
    "When you send a message, it is saved first, then pushed to everyone in the channel who is online. Each open Slack app keeps a live connection, so new messages appear instantly. If you were offline, the app catches up on what you missed when it reconnects.",
    "Sending is a normal API call: the web tier writes the message to MySQL, sharded with Vitess, then publishes it to channel servers that track who is subscribed to which channel. Gateway servers hold the WebSocket connections and forward events to clients. On reconnect, clients fetch history since their last-seen timestamp. Search indexing, notifications, link previews and integrations run asynchronously from a job queue.",
    "Slack first sharded by workspace, which broke for huge enterprise workspaces and for channels shared between companies; moving to Vitess let it shard by channel and other keys. Channel servers are placed with consistent hashing, and gateways are regional so the long-lived connection stays close to the user. Reconnect storms after an incident are dangerous because a fresh client boot loads a lot of state, so Slack slimmed the boot payload and lazy-loads users and channels through an edge cache (Flannel). Presence is expensive at scale: send it only for users on screen, batch it, and tolerate staleness."
  ],
  decisions: ["Persist first, then fan out over WebSockets", "Shard by channel, not by workspace", "Lazy-load client state to survive reconnect storms"],
  concepts: ["sharding", "consistent-hashing", "message-queues", "caching", "load-balancing"],
  ask: "Ten thousand clients reconnect in the same second after an outage. What breaks first?"
});
