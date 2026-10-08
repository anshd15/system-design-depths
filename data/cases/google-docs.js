window.SD = window.SD || [];
window.SD.push({
  id: "google-docs", cat: "Architectures", name: "Google Docs",
  tag: "Many people typing in one document at once without overwriting each other.",
  scale: [
    ["Live editors per doc", "up to 100"],
    ["Edit reaches peers", "~100s of ms"],
    ["Operations per keystroke", "1"],
    ["Version history", "every change"]
  ],
  flow: ["Editor (browser)", "WebSocket", "Doc owner server", "Operation log", "Snapshot store", "Other editors"],
  depths: [
    "Each keystroke becomes a small instruction like 'insert \"a\" at position 42'. Your instruction goes to a server that puts everyone's instructions in one order and passes them to the others. When two people type at the same time, the instructions are adjusted so everyone ends up with the same text.",
    "Every document has one collaboration server that owns it, routed by document ID. Clients apply their own edits immediately, then send each operation with the revision it was based on. The server transforms incoming operations against any it has already accepted (Operational Transformation), assigns a revision number, and broadcasts. Operations are appended to a log with periodic snapshots, so opening a document is a snapshot plus recent operations, and version history comes for free.",
    "OT needs one ordering point, which is why a single server owns each document. That makes the doc server stateful, so failover uses lease-based ownership and replays the operation log on the new owner. Transform functions must converge in every case, and rich text (styles, tables, comments anchored to ranges) multiplies the cases. CRDTs such as Yjs and Automerge avoid the central sequencer by giving every character a unique, ordered ID, at the cost of metadata and tombstones. Presence (cursors and selections) is ephemeral and never stored. Offline editing queues operations and transforms them on reconnect."
  ],
  decisions: ["One owner server per document orders all edits", "Apply locally first, reconcile with the server", "Operation log plus snapshots gives history and fast loads"],
  concepts: ["consistency", "consistent-hashing", "replication", "latency"],
  ask: "A user edited offline for an hour. How do they rejoin without losing work?"
});
