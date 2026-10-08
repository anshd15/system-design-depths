window.SD = window.SD || [];
window.SD.push({
  id: "zoom", cat: "Architectures", name: "Zoom",
  tag: "Live video for many people at once, where 300 ms of delay is already too much.",
  scale: [
    ["One-way latency budget", "< 150 ms"],
    ["Participants per meeting", "up to 1,000"],
    ["720p video stream", "~1.2 Mbps"],
    ["Simulcast layers sent", "~3"]
  ],
  flow: ["Client", "Signaling server", "Nearest media router (SFU)", "Other media routers", "Recipients", "Cloud recording"],
  depths: [
    "Each person's camera and microphone stream goes to a nearby server, which forwards it to everyone else in the meeting. Your app sends a few versions of your video, from small to sharp, and the server forwards whichever version each person's connection can handle.",
    "Signaling (joining, muting, who is in the meeting) uses ordinary HTTPS and WebSockets. Media uses UDP, because resending a late packet is useless for live audio. Zoom forwards streams through selective forwarding units (SFUs) that never decode the video, which scales far better than mixing every stream on a server. Clients send simulcast or scalable layers so the SFU can pick a resolution per receiver. Audio gets priority over video when bandwidth is tight.",
    "The latency budget drives everything: capture, encode, network, jitter buffer, decode and render must fit in about 150 ms one way. Forward error correction covers loss, with retransmission only when the round trip allows it. Bandwidth estimation reacts to delay and loss and adjusts send rates continuously. Large meetings cascade SFUs across regions: each participant connects to the nearest media router, and routers exchange only the streams someone needs, often just the active speakers. Clients in big meetings receive a handful of video streams, not hundreds. Usage spikes by time zone and hour, so Zoom runs its own datacenters and bursts into public cloud."
  ],
  decisions: ["Forward streams (SFU) instead of mixing them", "UDP with loss tolerance, not TCP retransmits", "Send layered video so the server can downscale per viewer"],
  concepts: ["latency", "load-balancing", "scalability", "cdn"],
  ask: "A 500-person all-hands starts. How many video streams does each client actually receive, and why?"
});
