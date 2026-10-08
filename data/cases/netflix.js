window.SD = window.SD || [];
window.SD.push({
  id: "netflix", cat: "Architectures", name: "Netflix",
  tag: "Stream a known catalog to hundreds of millions of TVs with almost no buffering.",
  scale: [
    ["Members", "~300M"],
    ["Files per title", "hundreds"],
    ["Microservices", "1,000+"],
    ["Cache location", "inside ISPs"]
  ],
  flow: ["TV app", "Control plane (AWS)", "Playback service", "Steering service", "Open Connect appliance", "Player (ABR)"],
  depths: [
    "Netflix knows ahead of time what people will watch, so overnight it copies shows into boxes that sit inside your internet provider's building. When you press play, the app asks Netflix which nearby box to use, then streams the video straight from that box.",
    "There are two planes. The control plane runs on AWS: sign-in, browsing, recommendations, playback authorization, and choosing which cache serves you. The data plane is Open Connect, Netflix's own CDN of appliances placed inside ISPs and internet exchanges. Each title is encoded into a ladder of bitrates and codecs, and the player picks segments with adaptive bitrate. Popular titles are copied to appliances during off-peak fill windows, so peak traffic rarely reaches origin.",
    "Because the catalog is known and demand is predictable, Netflix pushes instead of pulling: a nightly fill places files by predicted regional demand, and the steering service gives each client a ranked list of appliances based on health, load and network distance. Encoding is tuned per title and per shot, cutting bitrate at the same perceived quality as measured by VMAF. The control plane runs active-active across AWS regions and can evacuate a region by shifting traffic. Resilience is tested in production with chaos engineering, and service calls use timeouts, bulkheads and fallbacks, such as a generic popular row when personalization is down."
  ],
  decisions: ["Push content to ISP caches before demand arrives", "Cloud control plane, self-run data plane", "Fall back to a degraded page instead of failing"],
  concepts: ["cdn", "caching", "replication", "load-balancing", "latency"],
  ask: "A new season drops worldwide at midnight. How do you avoid a cold-cache spike?"
});
