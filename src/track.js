/* Tiny client helpers for usage counters. Fire-and-forget, never block UI. */

export function logStat(event) {
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
