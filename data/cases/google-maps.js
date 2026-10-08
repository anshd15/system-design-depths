window.SD = window.SD || [];
window.SD.push({
  id: "google-maps", cat: "Architectures", name: "Google Maps",
  tag: "Draw the world as tiles and find the fastest route in milliseconds.",
  scale: [
    ["Monthly users", "1B+"],
    ["Tiles at zoom 20", "4²⁰ ≈ 1.1 trillion"],
    ["Route query budget", "~100 ms"],
    ["Traffic freshness", "minutes"]
  ],
  flow: ["Map app", "CDN (tiles)", "Tile service", "Routing service", "Preprocessed road graph", "Live traffic pipeline", "Location pings"],
  depths: [
    "The map is cut into square tiles at many zoom levels, and the app downloads only the tiles you are looking at. For directions, the roads form a giant graph of intersections and streets; the service finds the quickest path through it using live traffic from phones on the road.",
    "Vector tiles (shapes and labels) are generated per zoom level, cached on CDNs and styled on the device, which keeps them small and lets the map rotate and tilt. Geocoding turns addresses into coordinates using a search index. Routing runs on a road graph whose edge weights are travel times; plain Dijkstra on a continent-sized graph is too slow, so the graph is preprocessed. Live traffic comes from anonymized location pings aggregated into speeds per road segment.",
    "Preprocessing is the trick. Contraction hierarchies add shortcut edges by ranking nodes by importance, so a query climbs up from both ends and meets in the middle, touching thousands of nodes instead of millions. Live traffic changes edge weights and would invalidate static shortcuts, so production systems use customizable route planning, which splits slow, traffic-independent preprocessing from a fast per-metric update. ETAs blend live speeds, historical patterns by time of day, and ML models; Google and DeepMind have described graph neural networks for ETA. Tiles are keyed by quadkey, which keeps neighboring tiles together for caching."
  ],
  decisions: ["Vector tiles cached at the edge, styled on the device", "Preprocess the road graph so queries take milliseconds", "Separate graph structure from changing traffic weights"],
  concepts: ["cdn", "caching", "sharding", "event-streaming", "latency"],
  ask: "A road closes after an accident. How quickly can routing avoid it, and what has to recompute?"
});
