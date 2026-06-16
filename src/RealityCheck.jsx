import React, { useState } from "react";
import { C, FONT } from "./brand.js";
import { OPPORTUNITIES, VERDICT, matchOpportunity, FEATURED } from "./opportunities.js";
import EmailCapture from "./EmailCapture.jsx";

/* ============================================================
   REALITY CHECK
   Type any work-from-home path or trending fad, get an honest
   scorecard. Seed opportunities render instantly; anything else
   is graded by the AI proxy, grounded in the same honest rubric.
   Answers the two questions the search data says people ask most:
   "is it real" and "how much can I actually make."
   ============================================================ */

const card = {
  background: "#fff", border: `1px solid ${C.creamDim}`, borderRadius: 16,
  padding: "20px 22px", boxShadow: "0 8px 30px rgba(11,31,28,0.06)",
};
const labelStyle = { fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.2, color: C.onLightDim, textTransform: "uppercase" };

function Meter({ n, max = 5, danger }) {
  return (
    <span style={{ display: "inline-flex", gap: 4 }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{
          width: 9, height: 9, borderRadius: 99,
          background: i < n ? (danger ? C.coral : C.evergreen) : C.creamDim,
        }} />
      ))}
    </span>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "baseline", padding: "11px 0", borderTop: `1px solid ${C.creamDim}` }}>
      <span style={labelStyle}>{label}</span>
      <span style={{ fontSize: 14.5, color: C.onLight, textAlign: "right", fontWeight: 500 }}>{children}</span>
    </div>
  );
}

function Scorecard({ data }) {
  const v = VERDICT[data.verdict] || VERDICT.real;
  return (
    <div style={{ display: "grid", gap: 14 }}>
      {/* verdict banner */}
      <div style={{ ...card, borderLeft: `5px solid ${v.c}`, background: v.bg, borderColor: v.line }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 27, color: C.onLight, letterSpacing: "-0.01em" }}>
              {data.name}
            </div>
            <div style={{ fontSize: 13, color: v.c, fontWeight: 600, marginTop: 2 }}>{v.blurb}</div>
          </div>
          <span style={{
            background: v.c, color: "#fff", fontWeight: 600, fontSize: 13.5,
            padding: "7px 14px", borderRadius: 999, whiteSpace: "nowrap",
          }}>
            {v.label}
          </span>
        </div>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: C.onLight, margin: "14px 0 0" }}>{data.summary}</p>
      </div>

      {/* the two headline questions + the facts */}
      <div style={card}>
        <Row label="How much you can really make">{data.pay}</Row>
        <Row label="True cost to start">{data.startCost}</Row>
        <Row label="Time to your first dollar">{data.timeToFirstDollar}</Row>
        <Row label="Competition">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Meter n={data.saturation} danger={data.saturation >= 4} />
          </span>
        </Row>
      </div>

      {/* the top scam flag, only when relevant */}
      {data.asksUpfront && (
        <div style={{ ...card, background: VERDICT.scam.bg, borderColor: VERDICT.scam.line, borderLeft: `5px solid ${VERDICT.scam.c}` }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18 }} aria-hidden="true">⚠</span>
            <div>
              <div style={{ fontWeight: 700, color: VERDICT.scam.c, fontSize: 14.5 }}>Top scam flag: it asks you to pay upfront</div>
              <div style={{ fontSize: 13.5, color: C.onLight, marginTop: 3, lineHeight: 1.55 }}>
                The number-one warning sign is being asked for money to start. A real job pays you, not the other way around. If there is a fee, a "kit," or a paid "program," be very careful.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* scam-risk flags */}
      {data.flags?.length > 0 && (
        <div style={card}>
          <div style={labelStyle}>Watch out for</div>
          <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
            {data.flags.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 9, fontSize: 14, color: C.onLight, lineHeight: 1.5 }}>
                <span style={{ color: C.coral, fontWeight: 700 }}>•</span>{f}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* what's good */}
      {data.greens?.length > 0 && (
        <div style={card}>
          <div style={labelStyle}>What's actually good about it</div>
          <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
            {data.greens.map((g, i) => (
              <div key={i} style={{ display: "flex", gap: 9, fontSize: 14, color: C.onLight, lineHeight: 1.5 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ marginTop: 3, flexShrink: 0 }} aria-hidden="true">
                  <path d="M5 12.5l4.2 4.2L19 7" stroke={C.evergreen} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {g}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.onLightDim, textAlign: "center", lineHeight: 1.6 }}>
        Honest estimates for the US in 2026. Real pay varies with skill, hours, and luck.
      </div>
    </div>
  );
}

export default function RealityCheck({ onBack }) {
  const [q, setQ] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const check = async (term) => {
    const query = (term ?? q).trim();
    if (!query) return;
    setQ(query);
    setErr("");
    setData(null);

    // 1) instant seed match
    const seed = matchOpportunity(query);
    if (seed) { setData(seed); return; }

    // 2) grade anything else with the AI, grounded in the honest rubric
    setLoading(true);
    const examples = OPPORTUNITIES.slice(0, 4)
      .map((o) => `${o.name} => verdict:${o.verdict}, pay:"${o.pay}", asksUpfront:${o.asksUpfront}`)
      .join(" | ");
    const prompt = `You are an honest, anti-scam work-from-home advisor for First Paycheck. A user wants a reality check on: "${query}".
Grade it the way a careful friend would, for the United States in 2026. Never hype income. Be realistic, even pessimistic about saturated fads. The single biggest scam signal is being asked to pay money upfront.
Calibration examples: ${examples}

Respond with ONLY valid JSON, no markdown fences, no preamble, exactly this shape:
{"name":"clean display name","verdict":"legit|real|hype|scam","pay":"realistic earnings range in plain words","startCost":"honest cost to begin","asksUpfront":true or false,"timeToFirstDollar":"realistic time","saturation":1-5 integer where 5 is brutally crowded,"flags":["scam or risk warning", "..."],"greens":["honest positive", "..."],"summary":"2 to 3 plain sentences, honest verdict, no hype, no em dashes"}
verdict meaning: legit = real sustainable work; real = real money but hard/slow; hype = a few win, most earn little; scam = built to take money or time. Keep strings concise. 1 to 4 items per array (greens can be empty for scams).`;
    try {
      const r = await fetch("/api/strategy", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!r.ok) throw new Error("request failed");
      const raw = await r.json();
      const text = (raw.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n");
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setData(parsed);
    } catch (e) {
      setErr("Could not check that one right now. Try one of the examples below, or rephrase it in a few words.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.cream, color: C.onLight, fontFamily: FONT.body }}>
      {/* top bar */}
      <header style={{
        maxWidth: 720, margin: "0 auto", width: "100%", boxSizing: "border-box",
        padding: "20px 24px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <button onClick={onBack} style={{
          cursor: "pointer", border: `1px solid ${C.creamDim}`, background: "#fff",
          borderRadius: 999, padding: "8px 14px", fontSize: 13.5, color: C.onLight, fontFamily: FONT.body,
        }}>
          ← Home
        </button>
        <span style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 18 }}>First Paycheck</span>
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", width: "100%", boxSizing: "border-box", padding: "8px 24px 64px" }}>
        {/* intro */}
        <div style={{ textAlign: "center", margin: "14px 0 26px" }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 11.5, letterSpacing: 2, color: C.coral }}>REALITY CHECK</span>
          <h1 style={{
            fontFamily: FONT.display, fontWeight: 600, fontSize: "clamp(30px, 6vw, 48px)",
            lineHeight: 1.05, letterSpacing: "-0.02em", margin: "10px 0 12px",
          }}>
            Is it real, and what does it really pay?
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: C.onLightDim, maxWidth: 520, margin: "0 auto" }}>
            Type any work-from-home job or trending side hustle. Get an honest scorecard before you spend a minute or a dollar.
          </p>
        </div>

        {/* search */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") check(); }}
            placeholder="e.g. UGC creator, Amazon FBA, virtual assistant..."
            style={{
              flex: 1, minWidth: 220, boxSizing: "border-box", padding: "14px 16px", borderRadius: 12,
              border: `1px solid ${C.creamDim}`, background: "#fff", color: C.onLight, fontSize: 15.5, fontFamily: FONT.body,
            }}
          />
          <button onClick={() => check()} disabled={loading} style={{
            cursor: loading ? "default" : "pointer", border: "none", borderRadius: 12, padding: "14px 24px",
            fontSize: 15.5, fontWeight: 600, color: "#fff", fontFamily: FONT.body,
            background: `linear-gradient(135deg, ${C.cta}, ${C.coral})`, opacity: loading ? 0.6 : 1,
            boxShadow: `0 10px 26px ${C.cta}3d`,
          }}>
            {loading ? "Checking..." : "Check it"}
          </button>
        </div>

        {/* quick picks */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          {FEATURED.map((id) => {
            const o = OPPORTUNITIES.find((x) => x.id === id);
            if (!o) return null;
            return (
              <button key={id} onClick={() => check(o.name)} style={{
                cursor: "pointer", border: `1px solid ${C.creamDim}`, background: "#fff",
                borderRadius: 999, padding: "8px 14px", fontSize: 13, color: C.onLight, fontFamily: FONT.body,
              }}>
                {o.name}
              </button>
            );
          })}
        </div>

        {err && <div style={{ ...card, marginTop: 20, color: VERDICT.scam.c, background: VERDICT.scam.bg, borderColor: VERDICT.scam.line }}>{err}</div>}

        {loading && (
          <div style={{ ...card, marginTop: 20, textAlign: "center", color: C.onLightDim }}>
            Grading it honestly...
          </div>
        )}

        {data && !loading && (
          <div style={{ marginTop: 22, display: "grid", gap: 16 }}>
            <Scorecard data={data} />
            <EmailCapture
              source="reality-check"
              title="Get the free scam-spotting checklist"
              blurb="We will email you the 7-flag checklist plus honest pay updates and new scam alerts. No hype, unsubscribe anytime."
              cta="Email me the checklist"
              variant="inline"
            />
          </div>
        )}
      </div>
    </div>
  );
}
