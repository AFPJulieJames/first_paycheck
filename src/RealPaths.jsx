import React, { useState, useEffect } from "react";
import { C, FONT } from "./brand.js";
import { PATHS, PLATFORM_TAGS } from "./paths.js";
import WorthItTracker from "./WorthItTracker.jsx";

/* ============================================================
   REAL PATHS
   The "now do it" layer. Pick a path, see what it is, real pay,
   checkable first steps (saved locally), where to find legit work,
   the anti-scam watch-out, and the offer bank. The Worth-It Tracker
   lives at the bottom so the plan and the proof sit together.
   ============================================================ */

const card = {
  background: "#fff", border: `1px solid ${C.creamDim}`, borderRadius: 16,
  padding: "20px 22px", boxShadow: "0 8px 30px rgba(11,31,28,0.06)",
};
const labelStyle = { fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.2, color: C.onLightDim, textTransform: "uppercase" };

function Steps({ path }) {
  const KEY = "fp-steps-" + path.id;
  const [done, setDone] = useState({});
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); setDone(raw ? JSON.parse(raw) : {}); } catch (e) { setDone({}); }
  }, [path.id]);
  const toggle = (i) => {
    const next = { ...done, [i]: !done[i] };
    setDone(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) {}
  };
  const count = path.steps.filter((_, i) => done[i]).length;
  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
        <div style={labelStyle}>First steps to a paycheck</div>
        <span style={{ fontSize: 12.5, color: count === path.steps.length ? C.evergreen : C.onLightDim }}>
          {count} of {path.steps.length} done
        </span>
      </div>
      <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
        {path.steps.map((s, i) => (
          <button key={i} onClick={() => toggle(i)} style={{
            display: "flex", gap: 11, alignItems: "flex-start", textAlign: "left", cursor: "pointer",
            background: done[i] ? "#E2F5EC" : C.cream, border: `1px solid ${done[i] ? "#9FE1C6" : C.creamDim}`,
            borderRadius: 12, padding: "12px 14px", fontFamily: FONT.body,
          }}>
            <span style={{
              flexShrink: 0, width: 22, height: 22, borderRadius: 7, marginTop: 1,
              border: `2px solid ${done[i] ? C.evergreen : C.creamDim}`, background: done[i] ? C.evergreen : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {done[i] && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.2 4.2L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              )}
            </span>
            <span style={{ fontSize: 14.5, lineHeight: 1.5, color: C.onLight, textDecoration: done[i] ? "line-through" : "none", opacity: done[i] ? 0.7 : 1 }}>{s}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PathDetail({ path }) {
  const p = path.pay;
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={card}>
        <h2 style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 28, margin: 0, color: C.onLight, letterSpacing: "-0.01em" }}>{path.name}</h2>
        <div style={{ fontSize: 14.5, color: C.coral, fontWeight: 600, marginTop: 2 }}>{path.tagline}</div>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: C.onLight, margin: "14px 0 0" }}>{path.whatItIs}</p>
      </div>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        {[["Starting pay", p.start], ["Part-time month", p.month], ["Time to first client", p.first]].map(([k, val]) => (
          <div key={k} style={{ background: "#13302B", borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 10.5, letterSpacing: 1, color: C.aqua, textTransform: "uppercase" }}>{k}</div>
            <div style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 19, color: C.onDark, marginTop: 6, lineHeight: 1.2 }}>{val}</div>
          </div>
        ))}
      </div>

      <Steps path={path} />

      <div style={card}>
        <div style={labelStyle}>Where to find real work</div>
        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {path.platforms.map((pl) => {
            const t = PLATFORM_TAGS[pl.tag];
            return (
              <div key={pl.name} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", padding: "10px 12px", background: C.cream, borderRadius: 10, border: `1px solid ${C.creamDim}` }}>
                <span style={{ fontWeight: 600, fontSize: 14.5, color: C.onLight }}>{pl.name}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: t.c, background: t.bg, borderRadius: 999, padding: "3px 10px" }}>{t.label}</span>
                <span style={{ fontSize: 13, color: C.onLightDim, flex: 1, minWidth: 140 }}>{pl.note}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ ...card, background: "#FBE7DC", borderColor: "#F3BE9C" }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1, color: "#C2410C", textTransform: "uppercase" }}>Watch out for</div>
        <p style={{ fontSize: 14.5, lineHeight: 1.55, color: C.onLight, margin: "8px 0 0" }}>{path.watchOut}</p>
      </div>

      <div style={card}>
        <div style={labelStyle}>What you could offer a client</div>
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {path.offers.map((o) => (
            <div key={o.label} style={{ background: C.cream, borderRadius: 12, padding: "14px 16px", border: `1px solid ${C.creamDim}` }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: C.onLight }}>{o.label}</div>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: C.onLightDim, margin: "5px 0 0" }}>{o.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RealPaths({ onBack }) {
  const [activeId, setActiveId] = useState(PATHS[0].id);
  const path = PATHS.find((p) => p.id === activeId) || PATHS[0];

  return (
    <div style={{ minHeight: "100vh", background: C.cream, color: C.onLight, fontFamily: FONT.body }}>
      <header style={{ maxWidth: 720, margin: "0 auto", width: "100%", boxSizing: "border-box", padding: "20px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ cursor: "pointer", border: `1px solid ${C.creamDim}`, background: "#fff", borderRadius: 999, padding: "8px 14px", fontSize: 13.5, color: C.onLight, fontFamily: FONT.body }}>
          ← Home
        </button>
        <span style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 18 }}>First Paycheck</span>
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", width: "100%", boxSizing: "border-box", padding: "8px 24px 64px" }}>
        <div style={{ textAlign: "center", margin: "14px 0 24px" }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 11.5, letterSpacing: 2, color: C.aqua }}>REAL PATHS</span>
          <h1 style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: "clamp(30px, 6vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.02em", margin: "10px 0 12px" }}>
            Pick a path and take the first step.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: C.onLightDim, maxWidth: 520, margin: "0 auto" }}>
            Three honest, legitimate ways to start. Real pay, real steps, and the places that actually hire.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 22 }}>
          {PATHS.map((p) => (
            <button key={p.id} onClick={() => setActiveId(p.id)} style={{
              cursor: "pointer", borderRadius: 999, padding: "10px 18px", fontSize: 14.5, fontWeight: 600, fontFamily: FONT.body,
              border: `1.5px solid ${activeId === p.id ? C.cta : C.creamDim}`,
              background: activeId === p.id ? `linear-gradient(135deg, ${C.cta}, ${C.coral})` : "#fff",
              color: activeId === p.id ? "#fff" : C.onLight,
            }}>
              {p.name}
            </button>
          ))}
        </div>

        <PathDetail path={path} />

        <div style={{ marginTop: 28 }}>
          <WorthItTracker />
        </div>
      </div>
    </div>
  );
}
