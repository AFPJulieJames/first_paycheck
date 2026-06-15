import React, { useEffect, useRef, useState } from "react";
import { BRAND, C, FONT } from "./brand.js";

/* ============================================================
   FLUID MESH-GRADIENT CANVAS
   A handful of warm radial "blobs" drift on slow sine paths over
   the deep evergreen base, composited additively so they read as
   light, not paint. Rendered on a low-res offscreen buffer and
   scaled up — that's what makes the blur cheap and the motion
   buttery, even on a phone (research: hero must load fast + run
   perfectly on mobile). Respects prefers-reduced-motion and
   pauses when the tab is hidden.
   ============================================================ */
function FluidCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Low internal resolution = soft + fast. CSS scales it to full size.
    const RES = 220;
    let w = RES, h = RES;

    const blobs = [
      { col: C.coral,   r: 0.62, ax: 0.26, ay: 0.20, sx: 0.11, sy: 0.08, px: 0.0, py: 1.2, cx: 0.32, cy: 0.36 },
      { col: C.apricot, r: 0.58, ax: 0.24, ay: 0.22, sx: 0.09, sy: 0.13, px: 2.1, py: 0.4, cx: 0.70, cy: 0.30 },
      { col: C.rose,    r: 0.50, ax: 0.22, ay: 0.18, sx: 0.13, sy: 0.10, px: 4.0, py: 2.7, cx: 0.50, cy: 0.66 },
      { col: C.aqua,    r: 0.46, ax: 0.20, ay: 0.20, sx: 0.07, sy: 0.12, px: 1.0, py: 3.3, cx: 0.78, cy: 0.72 },
      { col: C.evergreen, r: 0.52, ax: 0.24, ay: 0.16, sx: 0.10, sy: 0.07, px: 3.2, py: 5.0, cx: 0.18, cy: 0.74 },
    ];

    function resize() {
      const ratio = canvas.clientWidth / Math.max(1, canvas.clientHeight);
      w = RES;
      h = Math.round(RES / Math.max(0.5, Math.min(2.2, ratio)));
      canvas.width = w;
      canvas.height = h;
    }
    resize();
    window.addEventListener("resize", resize);

    let raf, t = 0, paused = false;
    const onVis = () => { paused = document.hidden; if (!paused) loop(); };
    document.addEventListener("visibilitychange", onVis);

    function frame(time) {
      // base wash
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = C.ink;
      ctx.fillRect(0, 0, w, h);

      // additive warm light
      ctx.globalCompositeOperation = "lighter";
      for (const b of blobs) {
        const cx = (b.cx + Math.sin(time * b.sx + b.px) * b.ax) * w;
        const cy = (b.cy + Math.cos(time * b.sy + b.py) * b.ay) * h;
        const rad = b.r * Math.min(w, h) * (0.92 + 0.08 * Math.sin(time * 0.6 + b.px));
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, b.col);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    function loop() {
      if (paused) return;
      t += 0.0042;
      frame(t);
      raf = requestAnimationFrame(loop);
    }

    if (reduce) {
      frame(0.8); // one static, well-composed frame
    } else {
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        // The blur is what fuses the blobs into one fluid mesh.
        filter: "blur(46px) saturate(122%)",
        transform: "scale(1.12)", // hide blurred edges
        transformOrigin: "center",
      }}
    />
  );
}

/* Headline that animates in word-by-word (kinetic type). */
function Kinetic({ text, delay = 0, style }) {
  const words = text.split(" ");
  return (
    <span style={style}>
      {words.map((wd, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
          <span
            style={{
              display: "inline-block",
              animation: "fpRise 0.85s cubic-bezier(.18,.7,.2,1) both",
              animationDelay: `${delay + i * 0.08}s`,
            }}
          >
            {wd}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

const TRUST = [
  "No fees to join, ever",
  "Real pay ranges, no hype",
  "FTC-aligned scam checks",
];

export default function Hero({ onStart, onPaths }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        background: C.ink,
        color: C.onDark,
        fontFamily: FONT.body,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <FluidCanvas />

      {/* fine grain + vignette so the gradient reads premium, not flat */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background:
          "radial-gradient(120% 90% at 50% 0%, rgba(11,31,28,0) 40%, rgba(11,31,28,0.55) 100%)",
        pointerEvents: "none",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, opacity: 0.06, pointerEvents: "none", mixBlendMode: "overlay",
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      }} />

      {/* top bar */}
      <header style={{
        position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", width: "100%",
        boxSizing: "border-box", padding: "22px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span aria-hidden="true" style={{
            width: 26, height: 26, borderRadius: 8,
            background: `linear-gradient(135deg, ${C.coral}, ${C.apricot})`,
            boxShadow: `0 0 22px ${C.coral}66`,
          }} />
          <span style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 19, letterSpacing: 0.2 }}>
            First Paycheck
          </span>
        </div>
        <span style={{
          fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1, color: C.onDarkDim,
        }}>
          firstpaycheck.co
        </span>
      </header>

      {/* center content */}
      <div style={{
        position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center", textAlign: "center",
        maxWidth: 880, margin: "0 auto", width: "100%", boxSizing: "border-box",
        padding: "12px 24px 40px",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          border: `1px solid ${C.line}`, borderRadius: 999, padding: "6px 14px",
          fontSize: 12.5, color: C.onDarkDim, marginBottom: 26,
          background: "rgba(11,31,28,0.35)", backdropFilter: "blur(6px)",
          opacity: mounted ? 1 : 0, transition: "opacity .9s ease .1s",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: C.evergreen, boxShadow: `0 0 10px ${C.evergreen}` }} />
          Legitimate, flexible work-from-home jobs
        </div>

        <h1 style={{
          fontFamily: FONT.display, fontWeight: 600, margin: 0,
          fontSize: "clamp(40px, 8vw, 84px)", lineHeight: 1.02, letterSpacing: "-0.02em",
        }}>
          <Kinetic text="Know what's real" delay={0.15} style={{ display: "block" }} />
          <span style={{
            display: "block",
            background: `linear-gradient(100deg, ${C.apricot}, ${C.coral} 45%, ${C.rose})`,
            WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
          }}>
            <Kinetic text="before you spend a dime." delay={0.42} style={{ display: "block" }} />
          </span>
        </h1>

        <p style={{
          maxWidth: 580, fontSize: "clamp(15px, 2.4vw, 19px)", lineHeight: 1.55,
          color: C.onDarkDim, margin: "24px 0 0",
          opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(10px)",
          transition: "opacity .9s ease 1s, transform .9s ease 1s",
        }}>
          The honest work-from-home guide. See if a path is legit, how much you can
          really make, and the exact steps to your first paycheck, with no experience needed.
        </p>

        <div style={{
          display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 34,
          opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(10px)",
          transition: "opacity .9s ease 1.15s, transform .9s ease 1.15s",
        }}>
          <button onClick={onStart} style={{
            cursor: "pointer", border: "none", borderRadius: 999, padding: "15px 28px",
            fontSize: 16, fontWeight: 600, fontFamily: FONT.body, color: "#fff",
            background: `linear-gradient(135deg, ${C.cta}, ${C.coral})`,
            boxShadow: `0 14px 40px ${C.cta}59, inset 0 1px 0 rgba(255,255,255,0.3)`,
          }}>
            Check if it's legit  →
          </button>
          <button onClick={onPaths} style={{
            cursor: "pointer", borderRadius: 999, padding: "15px 26px",
            fontSize: 16, fontWeight: 600, fontFamily: FONT.body,
            color: C.onDark, background: "rgba(244,239,231,0.06)",
            border: `1px solid ${C.line}`, backdropFilter: "blur(6px)",
          }}>
            See real paths
          </button>
        </div>

        {/* trust signals */}
        <div style={{
          display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center", marginTop: 40,
          opacity: mounted ? 1 : 0, transition: "opacity 1s ease 1.4s",
        }}>
          {TRUST.map((t) => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, color: C.onDarkDim }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12.5l4.2 4.2L19 7" stroke={C.aqua} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* scroll cue */}
      <div aria-hidden="true" style={{
        position: "relative", zIndex: 2, textAlign: "center", paddingBottom: 22,
        fontFamily: FONT.mono, fontSize: 10.5, letterSpacing: 2, color: C.onDarkDim,
        opacity: mounted ? 0.8 : 0, transition: "opacity 1s ease 1.7s",
      }}>
        <div style={{ animation: "fpFloat 2.4s ease-in-out infinite" }}>SCROLL ↓</div>
      </div>

      <style>{`
        @keyframes fpRise { from { transform: translateY(112%); } to { transform: translateY(0); } }
        @keyframes fpFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
        @media (prefers-reduced-motion: reduce) {
          [style*="fpRise"], [style*="fpFloat"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
