window.SD = window.SD || [];
window.SD.push({
  id: "llm-chat", cat: "Architectures", name: "LLM Chat Service",
  tag: "Stream answers token by token from expensive GPU models to millions of users.",
  scale: [
    ["Time to first token target", "< 1 s"],
    ["Streaming speed (typical)", "~30–100 tokens / s"],
    ["KV cache, 70B model with GQA", "~320 KB / token"],
    ["One 4k-token context", "~1.3 GB of KV cache"]
  ],
  flow: ["Chat client", "API gateway", "Conversation service", "Router / scheduler", "GPU inference servers", "Token stream (SSE)", "Safety + logging"],
  depths: [
    "When you send a message, the server feeds the whole conversation into a large model running on GPUs. The model writes the reply one word-piece at a time, and each piece is sent to your screen as soon as it is ready, which is why the answer appears to type itself.",
    "The gateway authenticates, applies per-user rate limits and token quotas, and loads conversation history. A router picks a GPU replica with spare capacity and the right model. Inference has two phases: prefill processes the prompt in parallel, then decode generates tokens one at a time. Tokens stream back over server-sent events or WebSockets. Conversations are stored separately, and safety classifiers check inputs and outputs.",
    "GPU memory usually limits concurrency more than compute, because every active request holds a KV cache that grows with context length. Continuous batching adds and removes requests from the running batch at every decode step instead of waiting for a whole batch to finish, and paged attention (vLLM) stores the KV cache in fixed blocks to avoid fragmentation. Prefix caching reuses the KV cache for shared prefixes such as system prompts. Some deployments run prefill and decode on separate GPU pools because they stress hardware differently. Latency is tracked as time to first token and time between tokens, and admission control queues or sheds load rather than slowing every request."
  ],
  decisions: ["Stream tokens instead of waiting for the full answer", "Continuous batching keeps GPUs busy", "Rate-limit by tokens, not just requests"],
  concepts: ["rate-limiting", "load-balancing", "caching", "latency", "api-gateway"],
  ask: "Users paste 100-page documents into chat. What happens to GPU memory and everyone else's latency?"
});
