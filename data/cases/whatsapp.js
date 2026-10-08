window.SD = window.SD || [];
window.SD.push({
  id: "whatsapp", cat: "Architectures", name: "WhatsApp",
  tag: "Deliver messages in order, once, to phones that are often offline.",
  scale: [
    ["Users", "2B+"],
    ["Messages / day", "~100B"],
    ["Messages / s avg", "~1.2M"],
    ["Max group size", "1,024"]
  ],
  flow: ["Phone", "Edge / TLS", "Chat server", "Session registry", "Pending inbox", "Recipient's chat server", "Push notification"],
  depths: [
    "Each phone keeps a connection open to a chat server. When you send a message, your server finds the server your friend is connected to and passes it along. If your friend is offline, the message waits until their phone reconnects. The ticks show each step: sent, delivered, read.",
    "Clients hold a long-lived connection to a chat server, and a session registry maps each user to their server. Sending: the sender's server writes the message to the recipient's pending inbox and acks the sender (one tick), then routes it to the recipient's server, which pushes it. The recipient acks (two ticks) and the server deletes it from the inbox. Offline recipients get a push notification and pull on reconnect. Media goes to blob storage and the message carries only an encrypted link.",
    "End-to-end encryption (the Signal protocol) means servers route ciphertext they cannot read, so search, spam signals and backups happen on the device. Groups use sender keys so the sender encrypts once instead of once per member. Ordering is per conversation: clients attach sequence numbers and the receiver reorders; delivery is at-least-once with dedupe on message ID. WhatsApp famously ran on Erlang, holding millions of connections per server with lightweight processes, which kept the team small. The big risk is a reconnect storm after an outage, handled with jittered backoff."
  ],
  decisions: ["Servers keep messages only until delivered", "Ordering per conversation, never global", "Encrypt once per group with sender keys"],
  concepts: ["message-queues", "idempotency", "load-balancing", "consistency"],
  ask: "How do you show 'last seen' for 2B users without hammering a database?"
});
