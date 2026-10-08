window.SD = window.SD || [];
window.SD.push({
  id: "ticketmaster", cat: "Architectures", name: "Ticketmaster",
  tag: "Sell 50,000 seats to millions of fans without selling any seat twice.",
  scale: [
    ["Seats in a stadium", "~50k"],
    ["Fans at on-sale", "millions"],
    ["Seat hold", "~10 min"],
    ["Double sales allowed", "0"]
  ],
  flow: ["Fan", "CDN + waiting room", "Booking service", "Seat inventory", "Payment", "Order store"],
  depths: [
    "Huge numbers of fans want a few seats at the same moment. The site lets people in a few at a time through a virtual waiting room. When you pick a seat it is held for you for a few minutes. Pay in time and it is yours; if not, it goes back for someone else.",
    "The seat map is mostly reads, so serve it from cache with short TTLs and accept slight staleness. Reserving is a write that must be exact: a seat moves from available to held (with an expiry) to sold. Implement holds with a conditional update (UPDATE seats SET status = 'held' WHERE id = ? AND status = 'available') or a Redis key with a TTL. Payment runs against the hold, and on success the seat is marked sold in the same transaction as the order. A virtual queue in front admits users at the rate the booking tier can absorb.",
    "Contention sits on a few thousand rows, so adding app servers does nothing; the inventory store is the bottleneck. Partition inventory by event and section so no lock spans shards. The waiting room is the real scaling device: it issues signed, time-ordered tokens at the edge, admits N users per second, and turns an unbounded spike into a steady flow. Expired holds must be released by the server, through TTL keys or a sweeper, never by trusting the client. Payment and inventory are separate services, so call payment idempotently with the order ID and reconcile: a payment that succeeds after its hold expired needs a refund or a re-hold rule. Bots are the other half of the problem, handled with rate limits, device fingerprinting and verified-fan presales."
  ],
  decisions: ["A waiting room instead of scaling the hot path", "Conditional updates or TTL holds, never read-then-write", "Idempotent payment keyed by order ID"],
  concepts: ["rate-limiting", "consistency", "idempotency", "caching", "cdn"],
  ask: "A hold expires one second before the payment succeeds. What should happen?"
});
