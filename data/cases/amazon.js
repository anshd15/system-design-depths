window.SD = window.SD || [];
window.SD.push({
  id: "amazon", cat: "Architectures", name: "Amazon",
  tag: "Browse a huge catalog, keep a cart that never refuses, and check out without overselling.",
  scale: [
    ["Products listed", "hundreds of millions"],
    ["Peak orders (example)", "~10k / s"],
    ["Cart writes", "always accepted"],
    ["+100 ms latency (often cited)", "−1% sales"]
  ],
  flow: ["Shopper", "CDN + edge", "Product page services", "Cart service", "Checkout", "Inventory", "Payments", "Fulfillment events"],
  depths: [
    "A product page is assembled from many small services: price, reviews, stock, recommendations. Your cart is saved so it always accepts items, even when part of the system is struggling. At checkout the system reserves stock, takes payment, and passes the order to a warehouse.",
    "One product page fans out to dozens or hundreds of services, so each has a strict latency budget and a fallback if it is slow. The catalog is read-heavy and cached aggressively. The shopping cart was the original use case for Dynamo, a key-value store that would rather accept an add-to-cart than reject it, and merges divergent versions later. Checkout is a workflow: validate the cart, reserve inventory, authorize payment, create the order, then emit an event that warehouses and email services consume.",
    "The Dynamo paper describes merging conflicting carts by union, which means a deleted item can reappear; Amazon accepted that because losing an add costs more. Inventory must not oversell hot items: reserve with a conditional decrement per product per warehouse, and use soft reservations that expire if checkout is abandoned. Checkout spans services, so it runs as a saga with compensating steps (release stock, void the authorization) instead of a distributed transaction. Payment is authorized at order time and captured at shipment. Teams expose data only through service APIs, which is what lets one page call hundreds of services independently."
  ],
  decisions: ["Always accept add-to-cart, merge conflicts later", "Checkout as a saga with compensations", "Every page widget has a latency budget and a fallback"],
  concepts: ["replication", "consistency", "idempotency", "caching", "message-queues"],
  ask: "A flash sale has 1,000 units and 100,000 buyers. How do you avoid overselling without a global lock?"
});
