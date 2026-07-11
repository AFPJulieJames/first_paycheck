import React, { useEffect, useRef, useState } from "react";
import { C, FONT } from "./brand.js";
import HomeHook from "./HomeHook.jsx";

/* ============================================================
   HERO (retention redesign)
   Light, high-contrast: crisp ink text on warm cream so nothing
   gets lost. Value + CTAs + a LIVE tool sit above the fold. The
   premium animated gradient is CONTAINED inside the right panel
   as ambiance, never behind text. Two columns on desktop, stacked
   on mobile (text first, tool below).
   ============================================================ */

function FluidCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const RES = 160; let w = RES, h = RES;
    const blobs = [
      { col: C.coral, r: 0.62, ax: 0.26, ay: 0.20, sx: 0.11, sy: 0.08, px: 0.0, py: 1.2, cx: 0.32, cy: 0.36 },
      { col: C.apricot, r: 0.58, ax: 0.24, ay: 0.22, sx: 0.09, sy: 0.13, px: 2.1, py: 0.4, cx: 0.70, cy: 0.30 },
      { col: C.rose, r: 0.50, ax: 0.22, ay: 0.18, sx: 0.13, sy: 0.10, px: 4.0, py: 2.7, cx: 0.50, cy: 0.66 },
      { col: C.aqua, r: 0.46, ax: 0.20, ay: 0.20, sx: 0.07, sy: 0.12, px: 1.0, py: 3.3, cx: 0.78, cy: 0.72 },
      { col: C.evergreen, r: 0.52, ax: 0.24, ay: 0.16, sx: 0.10, sy: 0.07, px: 3.2, py: 5.0, cx: 0.18, cy: 0.74 },
    ];
    const resize = () => { const ratio = canvas.clientWidth / Math.max(1, canvas.clientHeight); w = RES; h = Math.round(RES / Math.max(0.5, Math.min(2.2, ratio))); canvas.width = w; canvas.height = h; };
    resize(); window.addEventListener("resize", resize);
    let raf, t = 0, paused = false;
    const onVis = () => { paused = document.hidden; if (!paused) loop(); };
    document.addEventListener("visibilitychange", onVis);
    const frame = (time) => {
      ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = C.ink; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const b of blobs) {
        const cx = (b.cx + Math.sin(time * b.sx + b.px) * b.ax) * w;
        const cy = (b.cy + Math.cos(time * b.sy + b.py) * b.ay) * h;
        const rad = b.r * Math.min(w, h) * (0.92 + 0.08 * Math.sin(time * 0.6 + b.px));
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, b.col); g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };
    const loop = () => { if (paused) return; t += 0.0042; frame(t); raf = requestAnimationFrame(loop); };
    if (reduce) frame(0.8); else loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", onVis); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "blur(40px) saturate(120%)", transform: "scale(1.15)" }} />;
}

function Kinetic({ text, delay = 0, color }) {
  const words = text.split(" ");
  return (
    <span style={{ color }}>
      {words.map((wd, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", marginRight: "0.26em" }}>
          <span style={{ display: "inline-block", animation: "fpRise 0.8s cubic-bezier(.18,.7,.2,1) both", animationDelay: `${delay + i * 0.07}s` }}>{wd}</span>
        </span>
      ))}
    </span>
  );
}

const TRUST = ["No fees to join, ever", "Real pay ranges, no hype", "FTC-aligned scam checks"];

export default function Hero({ onStart, onPaths, onOpenReality, stats }) {
  const [m, setM] = useState(false);
  /* Most of our traffic is mobile Facebook. On a phone the two-column grid
     collapses and the live tool used to land ~730px down, well below the fold,
     so visitors saw nothing they could tap and bounced. On mobile we now put
     the tool directly under the headline and push the supporting copy, the
     buttons, and the trust row beneath it. Desktop is unchanged. */
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.matchMedia("(max-width: 760px)").matches : false
  );
  useEffect(() => { setM(true); }, []);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const total = stats ? (stats.checks || 0) + (stats.scams || 0) + (stats.paths || 0) : 0;
  const MIN_PUBLIC_COUNT = 500; // hide the social-proof count until it's a number that helps, not hurts

  const badge = (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1px solid ${C.creamDim}`, borderRadius: 999, padding: "6px 14px", fontSize: 12.5, color: C.onLightDim, background: "#fff", opacity: m ? 1 : 0, transition: "opacity .8s ease" }}>
      <span style={{ width: 7, height: 7, borderRadius: 99, background: C.evergreen }} />
      Legitimate, flexible work-from-home jobs
    </div>
  );

  const headline = (
    <h1 style={{ fontFamily: FONT.display, fontWeight: 600, margin: "18px 0 0", fontSize: "clamp(38px, 6.5vw, 66px)", lineHeight: 1.04, letterSpacing: "-0.02em", color: C.onLight }}>
      <Kinetic text="Know what's real" delay={0.1} />
      <span style={{ display: "block" }}><Kinetic text="before you spend a dime." delay={0.34} color="#C2410C" /></span>
    </h1>
  );

  const copy = (
    <p style={{ maxWidth: 480, fontSize: "clamp(15px, 2.2vw, 18px)", lineHeight: 1.55, color: C.onLightDim, margin: "20px 0 0", opacity: m ? 1 : 0, transform: m ? "none" : "translateY(8px)", transition: "opacity .8s ease .5s, transform .8s ease .5s" }}>
      The honest work-from-home guide. See if a path is legit, how much you can really make, and the exact steps to your first paycheck, with no experience needed.
    </p>
  );

  const ctas = (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
      <button onClick={onStart} style={{ cursor: "pointer", border: "none", borderRadius: 999, padding: "15px 26px", fontSize: 16, fontWeight: 600, color: "#fff", fontFamily: FONT.body, background: `linear-gradient(135deg, ${C.cta}, ${C.coral})`, boxShadow: `0 12px 32px ${C.cta}40` }}>
        Check if it's legit  →
      </button>
      <button onClick={onPaths} style={{ cursor: "pointer", borderRadius: 999, padding: "15px 24px", fontSize: 16, fontWeight: 600, color: C.onLight, background: "#fff", border: `1px solid ${C.creamDim}`, fontFamily: FONT.body }}>
        See real paths
      </button>
    </div>
  );

  const trust = (
    <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 24 }}>
      {TRUST.map((t) => (
        <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, color: C.onLightDim }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" stroke={C.evergreen} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>{t}
        </span>
      ))}
    </div>
  );

  const counter = total >= MIN_PUBLIC_COUNT ? (
    <div style={{ marginTop: 18, fontSize: 13, color: C.onLightDim }}>
      <b style={{ color: C.onLight }}>{total.toLocaleString()}</b> checks run so far. Free, and no email required to use the tools.
    </div>
  ) : null;

  const toolPanel = (
    <div style={{ position: "relative", borderRadius: 22, overflow: "hidden", padding: 16, background: C.ink, minHeight: isMobile ? 0 : 320 }}>
      <FluidCanvas />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 100% at 50% 0%, rgba(11,31,28,0) 50%, rgba(11,31,28,0.5) 100%)", pointerEvents: "none" }} />
      <div style={{ position: "relative" }}>
        <HomeHook onOpenReality={onOpenReality} />
      </div>
    </div>
  );

  return (
    <section style={{ background: C.cream, color: C.onLight, fontFamily: FONT.body, padding: isMobile ? "24px 20px 44px" : "40px 24px 56px" }}>
      {isMobile ? (
        /* MOBILE: headline -> live tool (above the fold) -> supporting copy */
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 20 }}>
          <div>
            {badge}
            {headline}
          </div>
          {toolPanel}
          <div>
            {copy}
            {ctas}
            {trust}
            {counter}
          </div>
        </div>
      ) : (
        /* DESKTOP: unchanged two-column layout */
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 36, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", alignItems: "center" }}>
          <div>
            {badge}
            {headline}
            {copy}
            {ctas}
            {trust}
            {counter}
          </div>
          {toolPanel}
        </div>
      )}

      <style>{`
        @keyframes fpRise { from { transform: translateY(110%); } to { transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { [style*="fpRise"] { animation: none !important; } }
      `}</style>
    </section>
  );
}
