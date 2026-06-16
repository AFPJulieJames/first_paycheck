import React, { useState, useEffect } from "react";
import { C, FONT } from "./brand.js";
import { PATHS, PLATFORM_TAGS, PATH_LEGIT, PLATFORM_URLS, AFFILIATE_DISCLOSURE, pathPrompt } from "./paths.js";
import WorthItTracker from "./WorthItTracker.jsx";
import EmailCapture from "./EmailCapture.jsx";

const platformUrl = (pl) =>
  pl.url || PLATFORM_URLS[pl.name] || `https://www.google.com/search?q=${encodeURIComponent(pl.name + " work from home")}`;

/* ============================================================
   REAL PATHS
   Pick a built-in path OR type any job and get the same honest
   plan, generated to match: what it is, an honest legit verdict,
   real pay, who it fits, a realistic first-week rhythm, checkable
   steps, where to find work, the watch-out, and the offer bank.
   The Worth-It Tracker sits at the bottom so plan and proof meet.
   ============================================================ */

const card = {
  background: "#fff", border: `1px solid ${C.creamDim}`, borderRadius: 16,
  padding: "20px 22px", boxShadow: "0 8px 30px rgba(11,31,28,0.06)",
};
const labelStyle = { fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.2, color: C.onLightDim, textTransform: "uppercase" };

function Steps({ keyId, items }) {
  const KEY = "fp-steps-" + keyId;
  const [done, setDone] = useState({});
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); setDone(raw ? JSON.parse(raw) : {}); } catch (e) { setDone({}); }
  }, [KEY]);
  const toggle = (i) => {
    const next = { ...done, [i]: !done[i] };
    setDone(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) {}
  };
  const count = items.filter((_, i) => done[i]).length;
  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
        <div style={labelStyle}>First steps to a paycheck</div>
        <span style={{ fontSize: 12.5, color: count === items.length ? C.evergreen : C.onLightDim }}>{count} of {items.length} done</span>
      </div>
      <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
        {items.map((s, i) => (
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
              {done[i] && <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.2 4.2L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </span>
            <span style={{ fontSize: 14.5, lineHeight: 1.5, color: C.onLight, textDecoration: done[i] ? "line-through" : "none", opacity: done[i] ? 0.7 : 1 }}>{s}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PathDetail({ path, keyId }) {
  const p = path.pay || {};
  const lv = PATH_LEGIT[path.legit] || PATH_LEGIT.legit;
  const tagOf = (t) => PLATFORM_TAGS[t] || PLATFORM_TAGS.steady;
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 28, margin: 0, color: C.onLight, letterSpacing: "-0.01em" }}>{path.name}</h2>
            {path.tagline && <div style={{ fontSize: 14.5, color: C.coral, fontWeight: 600, marginTop: 2 }}>{path.tagline}</div>}
          </div>
          <span style={{ background: lv.c, color: "#fff", fontWeight: 600, fontSize: 12.5, padding: "6px 13px", borderRadius: 999, whiteSpace: "nowrap" }}>{lv.label}</span>
        </div>
        {path.whatItIs && <p style={{ fontSize: 15, lineHeight: 1.6, color: C.onLight, margin: "14px 0 0" }}>{path.whatItIs}</p>}
      </div>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        {[["Starting pay", p.start], ["Part-time month", p.month], ["Time to first client", p.first]].map(([k, val]) => (
          <div key={k} style={{ background: "#13302B", borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 10.5, letterSpacing: 1, color: C.aqua, textTransform: "uppercase" }}>{k}</div>
            <div style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 18, color: C.onDark, marginTop: 6, lineHeight: 1.2 }}>{val || "Varies"}</div>
          </div>
        ))}
      </div>

      {(path.fitIf || path.skipIf) && (
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {path.fitIf && (
            <div style={{ ...card, background: "#E2F5EC", borderColor: "#9FE1C6" }}>
              <div style={{ ...labelStyle, color: C.evergreen }}>Good fit if</div>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: C.onLight, margin: "7px 0 0" }}>{path.fitIf}</p>
            </div>
          )}
          {path.skipIf && (
            <div style={{ ...card, background: "#FBF1DC", borderColor: "#F0CF86" }}>
              <div style={{ ...labelStyle, color: "#B07A12" }}>Think twice if</div>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: C.onLight, margin: "7px 0 0" }}>{path.skipIf}</p>
            </div>
          )}
        </div>
      )}

      {path.firstWeek?.length > 0 && (
        <div style={{ ...card, borderLeft: `4px solid ${C.aqua}` }}>
          <div style={labelStyle}>Your first week, a realistic rhythm</div>
          <div style={{ fontSize: 12.5, color: C.onLightDim, marginTop: 3 }}>The schedule nobody hands you. Small steps that fit around real life.</div>
          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {path.firstWeek.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: C.onLight, lineHeight: 1.5 }}>
                <span style={{ color: C.aqua, fontWeight: 700, fontFamily: FONT.mono, fontSize: 12, paddingTop: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Steps keyId={keyId} items={path.steps || []} />

      {path.platforms?.length > 0 && (
        <div style={card}>
          <div style={labelStyle}>Where to find real work</div>
          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {path.platforms.map((pl, i) => {
              const t = tagOf(pl.tag);
              return (
                <a key={i} href={platformUrl(pl)} target="_blank" rel="sponsored noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", padding: "10px 12px", background: C.cream, borderRadius: 10, border: `1px solid ${C.creamDim}`, textDecoration: "none" }}>
                  <span style={{ fontWeight: 600, fontSize: 14.5, color: "#B5481F" }}>{pl.name} ↗</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: t.c, background: t.bg, borderRadius: 999, padding: "3px 10px" }}>{t.label}</span>
                  <span style={{ fontSize: 13, color: C.onLightDim, flex: 1, minWidth: 140 }}>{pl.note}</span>
                </a>
              );
            })}
          </div>
          <div style={{ fontSize: 11.5, color: C.onLightDim, marginTop: 10, lineHeight: 1.5 }}>{AFFILIATE_DISCLOSURE}</div>
        </div>
      )}

      {path.watchOut && (
        <div style={{ ...card, background: "#FBE7DC", borderColor: "#F3BE9C" }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1, color: "#C2410C", textTransform: "uppercase" }}>Watch out for</div>
          <p style={{ fontSize: 14.5, lineHeight: 1.55, color: C.onLight, margin: "8px 0 0" }}>{path.watchOut}</p>
        </div>
      )}

      {path.offers?.length > 0 && (
        <div style={card}>
          <div style={labelStyle}>What you could offer a client</div>
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            {path.offers.map((o, i) => (
              <div key={i} style={{ background: C.cream, borderRadius: 12, padding: "14px 16px", border: `1px solid ${C.creamDim}` }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: C.onLight }}>{o.label}</div>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: C.onLightDim, margin: "5px 0 0" }}>{o.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RealPaths({ onBack }) {
  const [activeId, setActiveId] = useState(PATHS[0].id);
  const [q, setQ] = useState("");
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const pickBuiltIn = (id) => { setActiveId(id); setGenerated(null); setErr(""); };

  const build = async () => {
    const query = q.trim();
    if (!query) return;
    setErr(""); setLoading(true); setGenerated(null);
    try {
      const r = await fetch("/api/strategy", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: pathPrompt(query) }),
      });
      if (!r.ok) throw new Error("failed");
      const raw = await r.json();
      const text = (raw.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n");
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setGenerated(parsed);
      setActiveId("custom");
    } catch (e) {
      setErr("Could not build that one right now. Try a built-in path above, or rephrase the job in a few words. (Typed plans need the AI key set in Vercel.)");
    } finally { setLoading(false); }
  };

  const builtIn = PATHS.find((p) => p.id === activeId);
  const showing = activeId === "custom" && generated ? generated : builtIn;
  const keyId = activeId === "custom" ? "custom-" + (generated?.name || "x") : activeId;

  const input = { flex: 1, minWidth: 200, boxSizing: "border-box", padding: "14px 16px", borderRadius: 12, border: `1px solid ${C.creamDim}`, background: "#fff", color: C.onLight, fontSize: 15.5, fontFamily: FONT.body };

  return (
    <div style={{ minHeight: "100vh", background: C.cream, color: C.onLight, fontFamily: FONT.body }}>
      <header style={{ maxWidth: 720, margin: "0 auto", width: "100%", boxSizing: "border-box", padding: "20px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ cursor: "pointer", border: `1px solid ${C.creamDim}`, background: "#fff", borderRadius: 999, padding: "8px 14px", fontSize: 13.5, color: C.onLight, fontFamily: FONT.body }}>← Home</button>
        <span style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 18 }}>First Paycheck</span>
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", width: "100%", boxSizing: "border-box", padding: "8px 24px 64px" }}>
        <div style={{ textAlign: "center", margin: "14px 0 24px" }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 11.5, letterSpacing: 2, color: C.aqua }}>REAL PATHS</span>
          <h1 style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: "clamp(30px, 6vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.02em", margin: "10px 0 12px" }}>
            Pick a path, or build one for any job.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: C.onLightDim, maxWidth: 540, margin: "0 auto" }}>
            Start with one of our three, or type any job and get the same honest plan: real pay, a realistic first week, the steps, and where to find work.
          </p>
        </div>

        {/* build any job */}
        <div style={{ ...card, marginBottom: 18 }}>
          <div style={labelStyle}>Build a plan for any job</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") build(); }}
              placeholder="e.g. pet sitting, proofreading, social media manager, Etsy shop..." style={input} />
            <button onClick={build} disabled={loading} style={{
              cursor: loading ? "default" : "pointer", border: "none", borderRadius: 12, padding: "14px 22px", fontSize: 15.5, fontWeight: 600,
              color: "#fff", fontFamily: FONT.body, background: `linear-gradient(135deg, ${C.cta}, ${C.coral})`, opacity: loading ? 0.6 : 1, boxShadow: `0 10px 26px ${C.cta}3d`,
            }}>{loading ? "Building..." : "Build my path"}</button>
          </div>
          {err && <div style={{ marginTop: 10, fontSize: 13.5, color: PATH_LEGIT.scam.c }}>{err}</div>}
        </div>

        {/* built-in chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 22 }}>
          {PATHS.map((p) => (
            <button key={p.id} onClick={() => pickBuiltIn(p.id)} style={{
              cursor: "pointer", borderRadius: 999, padding: "10px 18px", fontSize: 14.5, fontWeight: 600, fontFamily: FONT.body,
              border: `1.5px solid ${activeId === p.id ? C.cta : C.creamDim}`,
              background: activeId === p.id ? `linear-gradient(135deg, ${C.cta}, ${C.coral})` : "#fff",
              color: activeId === p.id ? "#fff" : C.onLight,
            }}>{p.name}</button>
          ))}
          {generated && (
            <button onClick={() => setActiveId("custom")} style={{
              cursor: "pointer", borderRadius: 999, padding: "10px 18px", fontSize: 14.5, fontWeight: 600, fontFamily: FONT.body,
              border: `1.5px solid ${activeId === "custom" ? C.cta : C.creamDim}`,
              background: activeId === "custom" ? `linear-gradient(135deg, ${C.cta}, ${C.coral})` : "#fff",
              color: activeId === "custom" ? "#fff" : C.onLight,
            }}>★ {generated.name}</button>
          )}
        </div>

        {loading ? (
          <div style={{ ...card, textAlign: "center", color: C.onLightDim }}>Building an honest plan...</div>
        ) : showing ? (
          <PathDetail path={showing} keyId={keyId} />
        ) : null}

        <div style={{ marginTop: 28 }}>
          <WorthItTracker />
        </div>

        <div style={{ marginTop: 18 }}>
          <EmailCapture
            source="real-paths"
            title="Want this plan in your inbox?"
            blurb="We will send your path plan plus honest tips, real openings, and scam alerts. No hype, unsubscribe anytime."
            cta="Email me my plan"
            variant="inline"
          />
        </div>
      </div>
    </div>
  );
}
