# System Design Depths

A single-page study site for core system design concepts. Every concept is explained at three depths:

| Level | Name | What you get |
| --- | --- | --- |
| L1 | Whiteboard | Intuition and an analogy, no jargon |
| L2 | Design review | Mechanics, common patterns, trade-offs |
| L3 | Production | Failure modes, the math, and what real systems do |

Each concept also lists trade-offs, an interview prompt, and related concepts.

## Concepts

- **Fundamentals:** Scalability, Latency vs Throughput, Load Balancing
- **Storage:** Caching, Database Indexing, Replication, Sharding
- **Distributed:** CAP Theorem, Consistency Models, Consensus, Consistent Hashing
- **Async:** Message Queues, Event Streaming, Idempotency
- **Edge:** CDN, Rate Limiting, API Gateway

## Architectures

Reference designs that combine the concepts, each with back-of-the-envelope numbers, a request path, three depths, key decisions, and a follow-up question:

URL Shortener, Search Typeahead, YouTube, LinkedIn, WhatsApp, Uber, Dropbox, Ticketmaster, Payment System.

These are interview-style designs drawn from public engineering writing. Real internals differ.

## Run it

No build step. Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

Keyboard: `/` search, `j` / `k` next and previous concept, `1` `2` `3` switch depth. Concepts deep-link by id, for example `#cap`.

## Add a concept

Concepts live in `data/*.js`, one file per category. Push an object with `id`, `cat`, `name`, `tag`, `depths` (three strings, L1 to L3), `tradeoffs`, `ask`, and optional `numbers` and `related`.
