window.SD = window.SD || [];
window.SD.push({
  id: "tiktok", cat: "Architectures", name: "TikTok",
  tag: "A feed driven by recommendations that learns from every swipe.",
  scale: [
    ["Monthly users", "1B+"],
    ["Avg video length (assumed)", "~30 s"],
    ["Videos per user-hour", "~120"],
    ["Model update lag", "minutes"]
  ],
  flow: ["App", "Feed API", "Candidate retrieval", "Ranking model", "Re-ranking", "CDN (video)", "Event stream", "Online training"],
  depths: [
    "TikTok mostly does not show you posts from people you follow. It watches how you react to each video (how long you watch, whether you replay or swipe away) and uses that to pick the next ones. Every swipe teaches it a little more about you.",
    "The feed is a recommendation pipeline. Retrieval pulls thousands of candidates from several sources: embedding similarity, trending videos, creators you like, and fresh uploads that need an audience. A ranking model predicts engagement such as completion, likes and shares, and a re-ranking step adds variety and applies policy rules. Videos are prefetched so the next one starts instantly. Interaction events stream back to update features and models.",
    "Model freshness is the edge. ByteDance's Monolith paper describes online training, where models learn from the event stream and push parameter updates to serving within minutes, and collision-free embedding tables for huge, changing ID spaces like users and videos. New videos get staged exposure: a small audience first, then larger pools if engagement holds, which solves cold start for creators. One feature store serves both training and inference so the two never drift apart. The client prefetches several videos and their first segments, trading bandwidth for zero wait on each swipe."
  ],
  decisions: ["Recommendations first; the follow graph is optional", "Train online so models adapt within minutes", "Staged exposure for new videos"],
  concepts: ["event-streaming", "cdn", "caching", "latency"],
  ask: "A brand-new creator uploads a great video. How does it reach millions without any followers?"
});
