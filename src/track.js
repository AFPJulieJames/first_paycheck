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

/* Scroll-depth milestones. GA4's built-in "scroll" event only fires at 90%,
   which tells us who read to the bottom but not where everyone else dropped.
   These fill in the gap at 25/50/75 so we can see the real drop-off curve.
   Safe to call more than once; it only ever attaches a single listener. */
let scrollDepthInit = false;
export function initScrollDepth() {
  if (scrollDepthInit || typeof window === "undefined") return;
  scrollDepthInit = true;

  const marks = [25, 50, 75];
  const hit = new Set();
  let ticking = false;

  const measure = () => {
    ticking = false;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const pct = ((window.scrollY || doc.scrollTop) / scrollable) * 100;
    for (const m of marks) {
      if (pct >= m && !hit.has(m)) {
        hit.add(m);
        trackEvent("scroll_depth", { percent: m });
      }
    }
    if (hit.size === marks.length) {
      window.removeEventListener("scroll", onScroll);
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(measure);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
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
