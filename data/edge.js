window.SD = window.SD || [];
window.SD.push(
  {
    id: "cdn", cat: "Edge", name: "CDN",
    tag: "Serving content from a location near the user.",
    depths: [
      "A CDN keeps copies of your files in buildings all over the world, so users download from one nearby instead of from your single server far away.",
      "CDNs cache static assets, and sometimes API responses, at edge locations called PoPs. You control them with Cache-Control headers, TTLs and cache keys. Put a content hash in asset URLs (app.3f9a.js) so they can be cached forever and never need purging. CDNs also absorb DDoS traffic and terminate TLS close to users.",
      "Hit ratio depends on cache-key cardinality: query strings, cookies and Vary headers can split one object into thousands. Tiered caching with an origin shield collapses misses from hundreds of PoPs into one origin request. stale-while-revalidate and stale-if-error keep serving while the origin struggles. Routing uses anycast or GeoDNS, and edge compute moves auth checks, A/B logic and personalization into the PoP."
    ],
    tradeoffs: ["Lower latency and origin load, harder invalidation", "Long TTLs are cheap, and stale until purged", "Edge logic is fast but harder to debug"],
    ask: "You deployed, but half your users still get the old JavaScript. Why?",
    related: ["caching", "latency", "api-gateway"]
  },
  {
    id: "rate-limiting", cat: "Edge", name: "Rate Limiting",
    tag: "Capping how fast any one client can use the system.",
    depths: [
      "A bouncer lets only a set number of people in per minute, so the club never gets dangerously full and one rowdy group cannot take every spot.",
      "Algorithms: fixed window (simple, bursty at the edges), sliding window log (exact, memory heavy), sliding window counter (a good approximation), token bucket (allows bursts up to the bucket size, refills at a steady rate), leaky bucket (smooths output). Reject with HTTP 429 and a Retry-After header.",
      "Distributed limits need shared state. Redis with an atomic Lua script adds a round trip per request; local limiters that sync periodically trade precision for latency. Limit on several keys (user, IP, API key, endpoint) and at several layers (edge, gateway, service). Load shedding is the server-side sibling: drop low-priority work based on CPU or queue latency before everything fails."
    ],
    tradeoffs: ["Protects capacity, rejects some real users", "Central counters are exact and add latency", "Local counters are fast and approximate"],
    ask: "Design a rate limiter for 1M API keys across 20 gateway nodes.",
    related: ["api-gateway", "idempotency", "load-balancing"]
  },
  {
    id: "api-gateway", cat: "Edge", name: "API Gateway",
    tag: "One front door that handles the concerns every request shares.",
    depths: [
      "An API gateway is a building's front desk. Every visitor checks in there, gets a badge, and is pointed to the right office.",
      "A single entry point that handles cross-cutting work: authentication, rate limiting, routing, TLS, request shaping and response aggregation. Backend services stay simpler and can change without breaking clients. A backend-for-frontend (BFF) is a gateway tailored to one client, such as the mobile app.",
      "The gateway sits in every request's path, so keep it stateless, horizontally scaled and fast, with a budget of a few milliseconds. Keep business logic out or it becomes a distributed monolith. Propagate deadlines, trace context (W3C traceparent) and auth claims downstream. A service mesh of Envoy sidecars takes over service-to-service concerns like mTLS, retries and circuit breaking, leaving the gateway to handle traffic entering the system."
    ],
    tradeoffs: ["One place for policy, one more hop", "Simpler clients, risk of a bloated gateway", "Central control, central failure point"],
    ask: "What belongs in the gateway and what belongs in the service behind it?",
    related: ["rate-limiting", "load-balancing", "cdn"]
  }
);
