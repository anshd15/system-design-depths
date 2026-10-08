window.SD = window.SD || [];
window.SD.push({
  id: "uber", cat: "Architectures", name: "Uber",
  tag: "Match riders to nearby drivers in seconds while every driver keeps moving.",
  scale: [
    ["Location update", "every ~4 s"],
    ["Online drivers (estimate)", "~5M"],
    ["Location writes", "~1.25M / s"],
    ["Offer timeout", "~15 s"]
  ],
  flow: ["Driver app", "Location ingest", "Geo index (H3 cells)", "Dispatch", "Pricing", "Trip service", "Rider app"],
  depths: [
    "Every driver's phone reports where it is every few seconds. The map is cut into small hexagons. When you request a ride, the system looks at the hexagons around you, finds free drivers nearby, picks the one who can reach you fastest, and offers them the trip.",
    "Location updates go to an in-memory geospatial index keyed by cell (Uber's open-source H3 hexagon grid; geohashes or quadtrees also work). Only the latest point per driver matters for matching, so keep that in memory and stream the history to Kafka. Matching searches rings of cells around the rider, filters available drivers, and ranks them by ETA on the road network rather than straight-line distance. A trip is a durable state machine: requested, accepted, arrived, in progress, completed. Surge pricing compares demand with supply per cell.",
    "Shard the geo index by cell, but cities are hot: Manhattan at 6 p.m. overwhelms a naive shard, so split dense regions into finer cells. Uber's Ringpop routed cell ownership across nodes with consistent hashing and gossip membership. Matching works better in batches: collect requests for a second or two and solve the assignment for the whole batch, which beats greedy nearest-driver on total wait time. Offers must be exclusive, so a driver holds one offer at a time with a timeout, enforced by compare-and-set in the trip service. ETA quality depends on live traffic models and feeds matching, pricing and rider patience."
  ],
  decisions: ["Keep only the latest location in memory", "Batched matching beats greedy nearest-driver", "Hexagons give uniform neighbor distances"],
  concepts: ["sharding", "consistent-hashing", "event-streaming", "consistency"],
  ask: "Two riders are matched to the same driver at the same moment. What prevents a double booking?"
});
