/* Tiny client helpers for usage counters + GA4 events. Fire-and-forget, never block UI. */

/* Send a GA4 event if gtag is loaded on the page (no-op otherwise). */
export function trackEvent(name, params = {}) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  } catch (e) {}
}

export function logStat(event) {
  trackEvent("tool_run", { tool: event }); // GA4: a tool was actually used (check | scam | path)
  try {
    fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event }),
      keepalive: true,
    }).catch(() => {});
  } catch (e) {}
}

export async function getStats() {
  try {
    const r = await fetch("/api/stats");
    if (!r.ok) return null;
    return await r.json();
  } catch (e) {
    return null;
  }
}
