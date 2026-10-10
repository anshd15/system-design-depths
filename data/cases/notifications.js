window.SD = window.SD || [];
window.SD.push({
  id: "notifications", cat: "Architectures", name: "Notification System",
  tag: "Send push, SMS and email reliably without spamming anyone.",
  scale: [
    ["Notifications / day (example)", "1B"],
    ["Avg rate", "~11.6k / s"],
    ["Channels", "push · SMS · email · in-app"],
    ["Duplicate sends allowed", "0"]
  ],
  flow: ["Producer services", "Notification API", "Preferences + templates", "Priority queues", "Channel workers", "APNs / FCM / SMS / email", "Delivery tracking"],
  depths: [
    "Other parts of the app ask the notification service to tell a user something. The service checks the user's preferences, fills in the message, and hands it to the right delivery service: Apple or Google for phone pushes, a text provider for SMS, an email provider for email.",
    "One API accepts requests with a user ID, a notification type and data. It checks preferences and opt-outs, rate-limits per user, renders a template, and enqueues one job per channel. Separate queues and worker pools per channel and priority keep a slow email provider from delaying login codes. Workers call APNs, FCM, SMS and email providers, retry with backoff, and record delivery status.",
    "Producers retry, so dedupe on a notification ID and never send the same alert twice. Priority lanes keep one-time passwords and fraud alerts ahead of marketing blasts, which are throttled and spread over time. Providers have their own rate limits and outages, so use circuit breakers and fail over between SMS or email vendors. Device tokens go stale; delete them when APNs or FCM report them invalid. Respect quiet hours per time zone and collapse bursts into one message ('5 new comments' instead of five pushes). Opens and clicks flow back through the event stream to tune frequency."
  ],
  decisions: ["Separate queues per channel and priority", "Dedupe on notification ID", "Batch and collapse low-priority messages"],
  concepts: ["message-queues", "idempotency", "rate-limiting", "event-streaming"],
  ask: "A marketing blast to 50M users is scheduled. How do you keep it from delaying login codes?"
});
