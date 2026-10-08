window.SD = window.SD || [];
window.SD.push({
  id: "payments", cat: "Architectures", name: "Payment System",
  tag: "Move money exactly once, even when every network call can fail.",
  scale: [
    ["Payments / s (example)", "~1k"],
    ["Duplicate charges allowed", "0"],
    ["Ledger entries per payment", "≥ 2"],
    ["Reconciliation", "daily"]
  ],
  flow: ["Checkout", "Payment API", "Idempotency store", "Payment service", "Double-entry ledger", "Card network", "Webhooks"],
  depths: [
    "When you pay, the shop asks a payment service to charge your card. The service talks to the card network, writes down exactly what happened in a ledger, and tells the shop. Networks fail, so every step is built so that retrying it never charges you twice.",
    "The client creates a payment with an idempotency key. The payment service records the intent as pending, calls the payment provider or card network, and records the outcome. Money movement goes into a double-entry ledger: every payment writes balanced debit and credit entries, append-only and never updated. Merchants learn the outcome through webhooks, which are retried with backoff and must be handled idempotently on their side.",
    "The dangerous case is the unknown outcome: the call to the card network times out and you cannot tell whether the charge happened. Never retry blindly; query the provider with your reference ID, or retry with the same provider-side idempotency key. Model each payment as a state machine persisted before every external call, so a crashed worker can resume where it stopped. Reconcile daily against settlement files from banks and providers, and send mismatches to a queue for people to review. Keep the ledger in a relational database with serializable transactions, store money as integer minor units (never floats), and stream ledger entries to a warehouse for analytics instead of querying production."
  ],
  decisions: ["Persist state before every external call", "Append-only double-entry ledger", "Reconcile against bank files and trust nothing"],
  concepts: ["idempotency", "consistency", "message-queues", "replication"],
  ask: "The bank times out on a $500 charge. Walk through exactly what your system does next."
});
