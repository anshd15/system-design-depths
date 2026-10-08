window.SD = window.SD || [];
window.SD.push({
  id: "spotify", cat: "Architectures", name: "Spotify",
  tag: "Start any of 100M tracks instantly and pick the next one well.",
  scale: [
    ["Tracks in catalog", "100M+"],
    ["Monthly users", "600M+"],
    ["Stream bitrate", "24–320 kbps"],
    ["3-min song at 160 kbps", "~3.6 MB"]
  ],
  flow: ["App", "Access point", "Playback service", "CDN (audio files)", "Device cache", "Event delivery", "Recommendation pipelines"],
  depths: [
    "Songs are stored as small compressed files on servers around the world. When you press play, the app grabs the first few seconds right away and the rest while you listen, and it keeps songs you play often on your phone. Everything you play is recorded to help pick what to suggest next.",
    "Audio is encoded at several bitrates and served from CDNs. The client prefetches the next track before the current one ends, which is why skipping feels instant, and keeps a large local cache. Metadata, search and playlists are separate services. Every play, skip and save becomes an event sent through an event delivery pipeline (Spotify moved it from Kafka to Google Cloud Pub/Sub) into the warehouse that feeds recommendations.",
    "Recommendations combine collaborative filtering over huge user × track matrices, content signals from audio analysis, and language models over playlist titles and web text. Discover Weekly is a weekly batch job; home-screen ranking runs online. The early desktop client used peer-to-peer delivery to save bandwidth, then dropped it as CDNs got cheaper. Stream events drive royalty payouts, so they are deduplicated and reconciled before reporting, which makes idempotent event handling a business requirement. Thousands of services are owned by autonomous teams and catalogued in Backstage, which Spotify built and open-sourced."
  ],
  decisions: ["Prefetch the next track before the current one ends", "Every play is an event; recommendations are built from the log", "Dedupe stream events because they drive payouts"],
  concepts: ["cdn", "caching", "event-streaming", "idempotency", "message-queues"],
  ask: "How would you count a stream accurately for royalties when clients go offline and retry?"
});
