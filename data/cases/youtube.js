window.SD = window.SD || [];
window.SD.push({
  id: "youtube", cat: "Architectures", name: "YouTube",
  tag: "Upload, transcode and stream video to billions of screens.",
  scale: [
    ["Video uploaded", "~500 hours / min"],
    ["Watched daily", "~1B hours"],
    ["Renditions per video", "~6–10"],
    ["Views per upload", "~1000:1"]
  ],
  flow: ["Uploader", "Upload service", "Raw object storage", "Transcode queue", "Encoder workers", "Segment storage", "CDN", "Player"],
  depths: [
    "Uploading puts your raw video in storage. A fleet of machines converts it into several sizes, from 144p to 4K, cut into short pieces. When you press play, those pieces come from a server near you, and the player switches to smaller or bigger pieces as your connection changes.",
    "Uploads are resumable and chunked, going straight to object storage through pre-signed URLs. A queue triggers a transcoding pipeline: split the video into segments, encode each one in parallel at several bitrates and codecs (H.264, VP9, AV1), generate thumbnails, and run content checks. The output is HLS or DASH segments plus a manifest, played with adaptive bitrate streaming from a CDN. Metadata such as titles, channels and comments lives in a sharded database behind caches, and view counts are aggregated asynchronously.",
    "Bandwidth is the cost center, so caching is the architecture. Popularity is extremely skewed: push the head of the catalog into caches inside ISPs (Google Global Cache, Netflix Open Connect) and serve the long tail from regional origins. Encode cost should follow views: encode everything in H.264 first for a fast publish, then re-encode popular videos in AV1, where better compression saves more bandwidth than it costs in compute. Segment-parallel encoding turns a two-hour transcode into minutes. View counts need dedupe and fraud filtering before display, which is why they lag. Recommendations are a separate pipeline (candidate generation, then ranking) and drive most watch time."
  ],
  decisions: ["Segment-level parallel encoding for fast publish", "Expensive codecs only for popular videos", "Cache inside ISPs, not just in your CDN"],
  concepts: ["cdn", "message-queues", "caching", "sharding", "event-streaming"],
  ask: "A creator with 50M subscribers goes live. What changes compared with on-demand video?"
});
