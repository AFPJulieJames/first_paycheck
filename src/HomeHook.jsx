import React, { useState } from "react";
import { C, FONT } from "./brand.js";
import { OPPORTUNITIES, VERDICT, FEATURED, matchOpportunity } from "./opportunities.js";

/* Interactive hook for the homepage. Instant, local, no API: tap a trending
   fad and get a real verdict in place, then a nudge into the full Reality
   Check. The goal is to get a visitor doing something in the first seconds. */
export default function HomeHook({ onOpenReality }) {
  const [q, setQ] = useState("");
  const [pick, setPick] = useState(null);

  const choose = (name) => {
    const seed = matchOpportunity(name);
    setPick(seed || null);
  };
  const v = pick ? VERDICT[pick.verdict] : null;

  return (
    <div style={{
      background: "#fff", border: `1px solid ${C.creamDim}`, borderRadius: 18,
      padding: "26px 24px", boxShadow: "0 12px 40px rgba(11,31,28,0.08)",
    }}>
      <div style={{ textAlign: "center" }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.5, color: C.coral }}>TRY IT NOW</span>
        <h3 style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: "clamp(22px, 4vw, 30px)", margin: "8px 0 4px", color: C.onLight, letterSpacing: "-0.01em" }}>
          Is it legit? Find out in seconds.
        </h3>
        <p style={{ fontSize: 14.5, color: C.onLightDim, margin: "0 auto", maxWidth: 440 }}>
          Tap a trending hustle and get an honest read, or type your own.
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 18 }}>
        {FEATURED.slice(0, 6).map((id) => {
          const o = OPPORTUNITIES.find((x) => x.id === id);
          if (!o) return null;
          const active = pick && pick.id === o.id;
          return (
            <button key={id} onClick={() => choose(o.name)} style={{
              cursor: "pointer", borderRadius: 999, padding: "9px 15px", fontSize: 13.5, fontWeight: 600, fontFamily: FONT.body,
              border: `1.5px solid ${active ? C.cta : C.creamDim}`,
              background: active ? `linear-gradient(135deg, ${C.cta}, ${C.coral})` : C.cream,
              color: active ? "#fff" : C.onLight,
            }}>{o.name}</button>
          );
        })}
      </div>

      {pick && (
        <div style={{ marginTop: 18, background: v.bg, border: `1px solid ${v.line}`, borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 22, color: C.onLight }}>{pick.name}</div>
            <span style={{ background: v.c, color: "#fff", fontWeight: 600, fontSize: 13, padding: "6px 13px", borderRadius: 999 }}>{v.label}</span>
          </div>
          <div style={{ fontSize: 13.5, color: v.c, fontWeight: 600, marginTop: 4 }}>{v.blurb}</div>
          <div style={{ fontSize: 14, color: C.onLight, marginTop: 8 }}><b>Real pay:</b> {pick.pay}</div>
          <button onClick={() => onOpenReality(pick.name)} style={{
            marginTop: 14, cursor: "pointer", border: "none", borderRadius: 10, padding: "11px 18px", fontSize: 14.5, fontWeight: 600,
            color: "#fff", fontFamily: FONT.body, background: C.ink,
          }}>See the full breakdown →</button>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); if (q.trim()) onOpenReality(q.trim()); }}
        style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="or type any job or fad..."
          style={{ flex: 1, minWidth: 180, boxSizing: "border-box", padding: "13px 15px", borderRadius: 12, border: `1px solid ${C.creamDim}`, background: C.cream, color: C.onLight, fontSize: 15, fontFamily: FONT.body }} />
        <button type="submit" style={{
          cursor: "pointer", border: "none", borderRadius: 12, padding: "13px 22px", fontSize: 15, fontWeight: 600, color: "#fff",
          fontFamily: FONT.body, background: `linear-gradient(135deg, ${C.cta}, ${C.coral})`,
        }}>Check it</button>
      </form>
    </div>
  );
}
