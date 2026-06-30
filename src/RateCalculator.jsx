import React, { useState, useMemo } from "react";
import { C, FONT } from "./brand.js";
import { trackEvent } from "./track.js";

/* ============================================================
   REAL PAY CALCULATOR
   The honest companion to the Worth-It Tracker. Two modes:
   1) "Take-home"  — enter your rate + hours, see what you keep
      after a realistic self-employment tax set-aside.
   2) "What to charge" — enter a monthly take-home GOAL + hours,
      see the hourly rate you actually need to bill.
   Self-employed income owes ~15.3% self-employment tax on top of
   income tax once you net $400+/yr, so most people should set
   aside ~25-30%. We default to 27% and let the user adjust.
   This is an estimate, not tax advice (linked to the taxes post).
   ============================================================ */

const WEEKS_PER_MONTH = 4.333;
const usd = (n) =>
  isFinite(n) ? n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) : "$0";

function NumberField({ label, value, onChange, prefix, suffix, min = 0, step = 1 }) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: C.onLight, marginBottom: 6 }}>{label}</span>
      <span style={{ display: "flex", alignItems: "center", background: "#fff", border: `1px solid ${C.creamDim}`, borderRadius: 10, padding: "0 12px" }}>
        {prefix && <span style={{ color: C.onLightDim, fontSize: 15 }}>{prefix}</span>}
        <input
          type="number" inputMode="decimal" min={min} step={step} value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", padding: "12px 8px", fontSize: 16, fontFamily: FONT.body, color: C.onLight, width: "100%" }}
        />
        {suffix && <span style={{ color: C.onLightDim, fontSize: 14 }}>{suffix}</span>}
      </span>
    </label>
  );
}

function ResultRow({ label, value, strong, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", borderBottom: `1px solid ${C.creamDim}` }}>
      <span style={{ fontSize: strong ? 15 : 14, color: strong ? C.onLight : C.onLightDim, fontWeight: strong ? 600 : 400 }}>{label}</span>
      <span style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: strong ? 24 : 17, color: accent || C.onLight }}>{value}</span>
    </div>
  );
}

export default function RateCalculator() {
  const [mode, setMode] = useState("takehome"); // "takehome" | "charge"
  const [rate, setRate] = useState("25");
  const [hours, setHours] = useState("20");
  const [goal, setGoal] = useState("2000"); // monthly take-home goal
  const [taxPct, setTaxPct] = useState(27);
  const tracked = React.useRef(false);

  const onAnyChange = () => {
    if (!tracked.current) { trackEvent("tool_run", { tool: "rate_calc" }); tracked.current = true; }
  };

  const r = parseFloat(rate) || 0;
  const h = parseFloat(hours) || 0;
  const g = parseFloat(goal) || 0;
  const keepRate = 1 - taxPct / 100;

  const takehome = useMemo(() => {
    const grossWeek = r * h;
    const grossMonth = grossWeek * WEEKS_PER_MONTH;
    const grossYear = grossWeek * 52;
    return {
      grossMonth, grossYear,
      setAsideMonth: grossMonth * (taxPct / 100),
      netMonth: grossMonth * keepRate,
      netYear: grossYear * keepRate,
    };
  }, [r, h, taxPct]);

  const charge = useMemo(() => {
    const grossMonthNeeded = keepRate > 0 ? g / keepRate : 0;
    const grossWeekNeeded = grossMonthNeeded / WEEKS_PER_MONTH;
    const rateNeeded = h > 0 ? grossWeekNeeded / h : 0;
    return { grossMonthNeeded, rateNeeded, grossYearNeeded: grossMonthNeeded * 12 };
  }, [g, h, taxPct]);

  const tab = (id, label) => (
    <button
      onClick={() => { setMode(id); onAnyChange(); }}
      style={{
        flex: 1, cursor: "pointer", border: "none", borderRadius: 10, padding: "11px 10px",
        fontFamily: FONT.body, fontSize: 14.5, fontWeight: 600,
        color: mode === id ? "#fff" : C.onLightDim,
        background: mode === id ? `linear-gradient(135deg, ${C.cta}, ${C.coral})` : "transparent",
      }}
    >{label}</button>
  );

  return (
    <section style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 64px" }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 11.5, letterSpacing: 2, color: C.evergreen }}>FREE TOOL</span>
      </div>
      <h1 style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: "clamp(28px,5vw,40px)", lineHeight: 1.1, letterSpacing: "-0.02em", textAlign: "center", margin: "6px 0 10px", color: C.onLight }}>
        Real Pay Calculator
      </h1>
      <p style={{ textAlign: "center", fontSize: 16, lineHeight: 1.6, color: C.onLightDim, maxWidth: 520, margin: "0 auto 26px" }}>
        See what a work-from-home rate actually leaves you after taxes, or work backward from the take-home you want. Self-employed income owes about 15.3% self-employment tax plus income tax, so the headline rate is never what you keep.
      </p>

      <div style={{ display: "flex", gap: 4, background: "#fff", border: `1px solid ${C.creamDim}`, borderRadius: 12, padding: 4, marginBottom: 22 }}>
        {tab("takehome", "What I'll take home")}
        {tab("charge", "What to charge")}
      </div>

      <div style={{ background: C.cream, border: `1px solid ${C.creamDim}`, borderRadius: 16, padding: "22px 20px" }}>
        {mode === "takehome" ? (
          <>
            <NumberField label="Your rate" prefix="$" suffix="/hour" value={rate} step={1} onChange={(v) => { setRate(v); onAnyChange(); }} />
            <NumberField label="Hours per week" value={hours} suffix="hrs" step={1} onChange={(v) => { setHours(v); onAnyChange(); }} />
          </>
        ) : (
          <>
            <NumberField label="Take-home you want" prefix="$" suffix="/month" value={goal} step={50} onChange={(v) => { setGoal(v); onAnyChange(); }} />
            <NumberField label="Hours per week you can work" value={hours} suffix="hrs" step={1} onChange={(v) => { setHours(v); onAnyChange(); }} />
          </>
        )}

        <label style={{ display: "block", marginTop: 4 }}>
          <span style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, fontWeight: 600, color: C.onLight, marginBottom: 8 }}>
            <span>Tax set-aside</span><span style={{ color: C.coral }}>{taxPct}%</span>
          </span>
          <input type="range" min={15} max={35} step={1} value={taxPct} onChange={(e) => { setTaxPct(+e.target.value); onAnyChange(); }} style={{ width: "100%", accentColor: C.cta }} />
          <span style={{ display: "block", fontSize: 12, color: C.onLightDim, marginTop: 4 }}>
            25–30% is a safe default for most self-employed beginners (covers self-employment tax + income tax).
          </span>
        </label>
      </div>

      <div style={{ background: C.inkSoft, borderRadius: 16, padding: "20px 22px", marginTop: 18 }}>
        {mode === "takehome" ? (
          <>
            <div style={{ color: C.onDarkDim, fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.5, marginBottom: 8 }}>WHAT YOU ACTUALLY KEEP</div>
            <div style={{ background: "#fff", borderRadius: 12, padding: "6px 16px 14px" }}>
              <ResultRow label="Gross (monthly)" value={usd(takehome.grossMonth)} />
              <ResultRow label={`Set aside for taxes (${taxPct}%)`} value={usd(takehome.setAsideMonth)} accent={C.coral} />
              <ResultRow label="Estimated take-home (monthly)" value={usd(takehome.netMonth)} strong accent={C.evergreen} />
              <div style={{ paddingTop: 10 }}>
                <ResultRow label="Take-home (yearly)" value={usd(takehome.netYear)} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ color: C.onDarkDim, fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.5, marginBottom: 8 }}>WHAT YOU NEED TO BILL</div>
            <div style={{ background: "#fff", borderRadius: 12, padding: "6px 16px 14px" }}>
              <ResultRow label="Rate you need to charge" value={`${usd(charge.rateNeeded)}/hr`} strong accent={C.cta} />
              <ResultRow label="Gross to bill (monthly)" value={usd(charge.grossMonthNeeded)} />
              <ResultRow label={`To take home ${usd(g)}/mo after ${taxPct}% tax`} value={usd(charge.grossYearNeeded) + "/yr gross"} />
            </div>
          </>
        )}
      </div>

      <p style={{ fontSize: 12.5, lineHeight: 1.6, color: C.onLightDim, margin: "16px 4px 0" }}>
        This is a planning estimate, not tax advice. Your real tax depends on your income, deductions, and state.
        Learn the basics in <a href="/blog/do-you-have-to-pay-taxes-on-work-from-home-income" style={{ color: "#B5481F" }}>our plain-English guide to work-from-home taxes</a>,
        and once you have a real offer, run it through the <a href="/#reality" style={{ color: "#B5481F" }}>Reality Check</a> and the Worth-It Tracker in <a href="/#paths" style={{ color: "#B5481F" }}>Real Paths</a>.
      </p>
    </section>
  );
}
