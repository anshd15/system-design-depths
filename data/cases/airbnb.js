window.SD = window.SD || [];
window.SD.push({
  id: "airbnb", cat: "Architectures", name: "Airbnb",
  tag: "Search millions of homes by place and dates, then book without double bookings.",
  scale: [
    ["Active listings", "~8M"],
    ["Availability rows (8M × 365)", "~2.9B"],
    ["Search filters", "place · dates · guests"],
    ["Double bookings allowed", "0"]
  ],
  flow: ["Guest app", "Search service", "Geo + availability index", "Ranker", "Listing service", "Booking service", "Payments"],
  depths: [
    "Searching means finding homes in an area that are free on your dates, then sorting them by how likely you are to book. When you book, the system locks those nights for that home so nobody else can take them, then charges you.",
    "Search queries a geo-aware index filtered by availability, price and amenities, then a ranking model orders the results. Availability is the hard filter: every listing has a calendar, stored as per-day rows or a bitset per listing that the index can filter quickly. Booking is a transaction: check that every requested night is free and mark them reserved in one write, keyed by listing so contention stays per listing. Payments are separate and idempotent.",
    "The search index lags the source of truth, so a listing can look available and then fail at booking; validate against the calendar database at checkout and design the UI for that rare case. Hosts sync calendars from other sites through polled iCal feeds, which are eventually consistent, so cross-platform double bookings stay possible and are handled by policy. Airbnb has written about moving search ranking from gradient-boosted trees to deep neural networks trained on booking outcomes. Pricing suggestions model demand by date and place. The move from a Rails monolith to services came with an internal data platform; Airflow started there."
  ],
  decisions: ["Search from an index, confirm against the source of truth", "Lock all nights per listing in one transaction", "Treat external calendar sync as eventually consistent"],
  concepts: ["indexing", "consistency", "idempotency", "caching", "sharding"],
  ask: "Two guests book overlapping dates on the same home at the same moment. Walk through the write."
});
