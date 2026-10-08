window.SD = window.SD || [];
window.SD.push({
  id: "dropbox", cat: "Architectures", name: "Dropbox",
  tag: "Keep files in sync across devices without re-uploading what has not changed.",
  scale: [
    ["Registered users", "700M+"],
    ["Block size", "4 MB"],
    ["A 1 GB file", "256 blocks"],
    ["Edit one byte, upload", "1 block"]
  ],
  flow: ["Desktop client", "Block server", "Object storage", "Metadata service", "Notification service", "Other devices"],
  depths: [
    "The app splits each file into small blocks and gives every block a fingerprint. When you edit a file, only the blocks that changed get uploaded. A separate service keeps the list of which blocks make up which file, and tells your other devices something changed so they can fetch the new blocks.",
    "Split metadata from data. Blocks are content-addressed: 4 MB chunks keyed by their SHA-256 hash in object storage, so identical blocks are stored once. The metadata service is a strongly consistent database of folders, files, versions and block lists. The client watches the filesystem, hashes changed blocks, asks which hashes the server lacks, uploads only those, then commits a new file version. Other devices hold a long-poll connection to a notification service and pull the new block list.",
    "The metadata journal is the source of truth: each namespace has an ordered log of changes, and clients sync by cursor ('everything after version 1042'), which makes resuming and offline catch-up simple. Conflicts come from two devices editing offline; detect them by comparing base versions at commit and keep both files as a 'conflicted copy' rather than merging silently. Order the writes: upload blocks first, then commit metadata, so a crash never leaves a file pointing at missing blocks, and garbage-collect orphaned blocks later. Dropbox moved off S3 to its own storage system, Magic Pocket, once storage and egress costs dominated."
  ],
  decisions: ["Content-addressed blocks give dedupe and delta sync", "Upload blocks before committing metadata", "Keep both copies on conflict"],
  concepts: ["consistency", "replication", "idempotency", "caching"],
  ask: "How would you add 30 days of version history without doubling storage?"
});
