import React, { useState, useMemo, useRef } from "react";
import { C, FONT } from "./brand.js";
import { trackEvent } from "./track.js";

/* ============================================================
   PAYCHECK & TAX CALCULATOR
   The honest take-home + tax tool. Three modes:
   1) "Employee (W-2)"  — real 2026 federal brackets, standard
      deduction, Social Security + Medicare.
   2) "Freelance (1099)" — self-employment tax (the important one
      for our audience) + the tax SET-ASIDE with a quarterly number.
   3) "What to charge"   — work backward from a monthly take-home
      goal to the hourly rate you need to bill.

   Accurate 2026 figures (IRS Rev. Proc. 2025-32; SSA wage base).
   These change every tax year — update BR / STD / SS_WAGE each fall.

   MONETIZATION: the detailed breakdown + tax set-aside are gated
   behind a light unlock. On the WEBSITE the unlock is an email
   capture (grows the MailerLite newsletter list). In the APP,
   openAd() connects to the AdMob/AppLovin rewarded-video SDK and
   calls unlock() on completion — same flow, higher-paying.

   Not tax advice. State tax is a flat estimate, on purpose.
   ============================================================ */

/* ---- 2026 tax data (IRS Rev. Proc. 2025-32) ---- */
const BR = {
  single: [[0, .10], [12400, .12], [50400, .22], [105700, .24], [201775, .32], [256225, .35], [640600, .37]],
  mfj:    [[0, .10], [24800, .12], [100800, .22], [211400, .24], [403550, .32], [512450, .35], [768700, .37]],
  hoh:    [[0, .10], [17700, .12], [67450, .22], [105700, .24], [201775, .32], [256200, .35], [640600, .37]],
  mfs:    [[0, .10], [12400, .12], [50400, .22], [105700, .24], [201775, .32], [256225, .35], [384350, .37]],
};
const STD = { single: 16100, mfj: 32200, hoh: 24150, mfs: 16100 };
const SS_WAGE = 184500;
const ADDL_MED = { single: 200000, hoh: 200000, mfs: 125000, mfj: 250000 };
const WEEKS_PER_MONTH = 4.333;

function fedTax(taxable, status) {
  const b = BR[status]; let t = 0;
  for (let i = 0; i < b.length; i++) {
    const lo = b[i][0], hi = i + 1 < b.length ? b[i + 1][0] : Infinity, rate = b[i][1];
    if (taxable > lo) t += (Math.min(taxable, hi) - lo) * rate;
  }
  return t;
}
const usd = (n) => isFinite(n)
  ? n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
  : "$0";

/* ---- small styled inputs (brand system) ---- */
function Field({ label, help, children }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.onLight, marginBottom: 6 }}>{label}</span>
      {children}
      {help && <span style={{ display: "block", fontSize: 11.5, color: C.onLightDim, marginTop: 5 }}>{help}</span>}
    </label>
  );
}
const boxStyle = { display: "flex", alignItems: "center", background: "#fff", border: `1px solid ${C.creamDim}`, borderRadius: 10, padding: "0 12px" };
function NumberField({ label, help, value, onChange, prefix, suffix, min = 0, step = 1 }) {
  return (
    <Field label={label} help={help}>
      <span style={boxStyle}>
        {prefix && <span style={{ color: C.onLightDim, fontSize: 15 }}>{prefix}</span>}
        <input type="number" inputMode="decimal" min={min} step={step} value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", padding: "12px 8px", fontSize: 16, fontFamily: FONT.body, color: C.onLight, width: "100%" }} />
        {suffix && <span style={{ color: C.onLightDim, fontSize: 14 }}>{suffix}</span>}
      </span>
    </Field>
  );
}
function SelectField({ label, help, value, onChange, options }) {
  return (
    <Field label={label} help={help}>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "12px 12px", border: `1px solid ${C.creamDim}`, borderRadius: 10, background: "#fff", fontSize: 15, fontFamily: FONT.body, color: C.onLight }}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </Field>
  );
}
function ResultRow({ label, value, strong, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", borderBottom: `1px solid ${C.creamDim}` }}>
      <span style={{ fontSize: strong ? 15 : 14, color: strong ? C.onLight : C.onLightDim, fontWeight: strong ? 600 : 400 }}>{label}</span>
      <span style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: strong ? 22 : 17, color: accent || C.onLight }}>{value}</span>
    </div>
  );
}

const STATUS_OPTS = [["single", "Single"], ["mfj", "Married, filing jointly"], ["hoh", "Head of household"], ["mfs", "Married, filing separately"]];
const FREQ_OPTS = [["1", "Per year"], ["12", "Per month"], ["26", "Every 2 weeks"], ["52", "Per week"], ["hour", "Per hour"]];
const PERIOD_WORD = { 1: "year", 12: "month", 26: "paycheck", 52: "week" };

export default function RateCalculator() {
  const [mode, setMode] = useState("w2");        // "w2" | "se" | "charge"
  const [income, setIncome] = useState("45000");
  const [freq, setFreq] = useState("1");
  const [hours, setHours] = useState("40");
  const [status, setStatus] = useState("single");
  const [stateRate, setStateRate] = useState("0");
  const [pretax, setPretax] = useState("0");
  const [expenses, setExpenses] = useState("0");
  const [goal, setGoal] = useState("2000");       // charge mode: monthly take-home goal
  const [chargeTax, setChargeTax] = useState(27); // charge mode: flat set-aside %

  const [shown, setShown] = useState(false);      // has the user pressed "show results"
  const [unlocked, setUnlocked] = useState(false);// gate opened (email or ad)
  const tracked = useRef(false);

  const track = () => { if (!tracked.current) { trackEvent("tool_run", { tool: "rate_calc" }); tracked.current = true; } };
  const restage = () => { setShown(false); setUnlocked(false); };
  const pickMode = (m) => { setMode(m); restage(); };

  const annualGross = () => {
    const v = parseFloat(income) || 0;
    if (freq === "hour") return v * (parseFloat(hours) || 0) * 52;
    return v * parseFloat(freq);
  };

  /* ---- W-2 / 1099 accurate calculation ---- */
  const calc = useMemo(() => {
    const sRate = (parseFloat(stateRate) || 0) / 100;
    let gross = annualGross();
    if (gross <= 0) return null;
    let fica, taxable, fed, state, setAside = 0;

    if (mode === "w2") {
      const pre = parseFloat(pretax) || 0;
      const ss = 0.062 * Math.min(gross, SS_WAGE);
      const med = 0.0145 * gross + 0.009 * Math.max(0, gross - ADDL_MED[status]);
      fica = ss + med;
      taxable = Math.max(0, gross - pre - STD[status]);
      fed = fedTax(taxable, status);
      state = sRate * Math.max(0, gross - pre);
    } else {
      const exp = parseFloat(expenses) || 0;
      const netSE = Math.max(0, gross - exp);
      const seBase = netSE * 0.9235;
      const seSS = 0.124 * Math.min(seBase, SS_WAGE);
      const seMed = 0.029 * seBase + 0.009 * Math.max(0, seBase - ADDL_MED[status]);
      fica = seSS + seMed;                 // self-employment tax
      const adj = netSE - fica / 2;        // half of SE tax is deductible
      taxable = Math.max(0, adj - STD[status]);
      fed = fedTax(taxable, status);
      state = sRate * netSE;
      gross = netSE;                       // show net-of-expenses as the income base
      setAside = fica + fed + state;
    }
    const totalTax = fica + fed + state;
    const net = gross - totalTax;
    const per = freq === "hour" ? 52 : parseFloat(freq);
    const word = freq === "hour" ? "week" : PERIOD_WORD[per] || "year";
    return {
      gross, fica, fed, state, totalTax, net, setAside,
      perAmount: net / per, word,
      effRate: gross > 0 ? (totalTax / gross) * 100 : 0,
      quarterly: setAside / 4,
      setAsidePct: gross > 0 ? (setAside / gross) * 100 : 0,
    };
  }, [mode, income, freq, hours, status, stateRate, pretax, expenses]);

  /* ---- "What to charge" reverse calc (flat estimate, honest) ---- */
  const charge = useMemo(() => {
    const g = parseFloat(goal) || 0;
    const h = parseFloat(hours) || 0;
    const keep = 1 - chargeTax / 100;
    const grossMonth = keep > 0 ? g / keep : 0;
    const grossWeek = grossMonth / WEEKS_PER_MONTH;
    return { rateNeeded: h > 0 ? grossWeek / h : 0, grossMonth, grossYear: grossMonth * 12 };
  }, [goal, hours, chargeTax]);

  const show = () => {
    if (mode !== "charge" && !calc) { return; }
    track(); setShown(true); setUnlocked(false);
  };

  /* Website unlock = email capture (grows the MailerLite list). */
  const [email, setEmail] = useState("");
  const [cap, setCap] = useState("idle"); // idle | loading | error
  const [capMsg, setCapMsg] = useState("");
  const submitEmail = async (e) => {
    e?.preventDefault?.();
    if (cap === "loading") return;
    setCap("loading"); setCapMsg("");
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "calculator" }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || "Something went wrong.");
      trackEvent("newsletter_signup", { source: "calculator" });
      setUnlocked(true);
    } catch (err) { setCap("error"); setCapMsg(err.message || "Please try again."); }
  };

  /* APP hook: replace this with the AdMob/AppLovin rewarded SDK.
     The SDK calls unlock() when the rewarded video completes. */
  // function openAd() { showRewardedVideo(() => setUnlocked(true)); }

  const tab = (id, label) => (
    <button onClick={() => pickMode(id)} style={{
      flex: 1, cursor: "pointer", border: "none", borderRadius: 10, padding: "11px 8px",
      fontFamily: FONT.body, fontSize: 13.5, fontWeight: 600,
      color: mode === id ? "#fff" : C.onLightDim,
      background: mode === id ? `linear-gradient(135deg, ${C.cta}, ${C.coral})` : "transparent",
    }}>{label}</button>
  );

  const isCharge = mode === "charge";

  return (
    <section style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 64px" }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 11.5, letterSpacing: 2, color: C.evergreen }}>FREE TOOL</span>
      </div>
      <h1 style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: "clamp(28px,5vw,40px)", lineHeight: 1.1, letterSpacing: "-0.02em", textAlign: "center", margin: "6px 0 10px", color: C.onLight }}>
        Paycheck &amp; Tax Calculator
      </h1>
      <p style={{ textAlign: "center", fontSize: 16, lineHeight: 1.6, color: C.onLightDim, maxWidth: 520, margin: "0 auto 26px" }}>
        See your real take-home pay — and exactly how much to set aside for taxes. Built for W-2 jobs <em>and</em> 1099 freelance income, with accurate 2026 rates.
      </p>

      <div style={{ display: "flex", gap: 4, background: "#fff", border: `1px solid ${C.creamDim}`, borderRadius: 12, padding: 4, marginBottom: 22 }}>
        {tab("w2", "Employee (W-2)")}
        {tab("se", "Freelance (1099)")}
        {tab("charge", "What to charge")}
      </div>

      {/* ---- inputs ---- */}
      <div style={{ background: C.cream, border: `1px solid ${C.creamDim}`, borderRadius: 16, padding: "22px 20px" }}>
        {isCharge ? (
          <>
            <NumberField label="Take-home you want" prefix="$" suffix="/month" value={goal} step={50} onChange={(v) => { setGoal(v); restage(); }} />
            <NumberField label="Hours per week you can work" value={hours} suffix="hrs" step={1} onChange={(v) => { setHours(v); restage(); }} />
            <Field label={`Tax set-aside — ${chargeTax}%`} help="25–30% is a safe default for self-employed beginners (covers self-employment + income tax).">
              <input type="range" min={15} max={35} step={1} value={chargeTax} onChange={(e) => { setChargeTax(+e.target.value); restage(); }} style={{ width: "100%", accentColor: C.cta }} />
            </Field>
          </>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <NumberField label="Income amount" prefix="$" value={income} step={1000} onChange={(v) => { setIncome(v); restage(); }} />
              <SelectField label="How often?" value={freq} onChange={(v) => { setFreq(v); restage(); }} options={FREQ_OPTS} />
            </div>
            {freq === "hour" &&
              <NumberField label="Hours per week" value={hours} suffix="hrs" step={1} onChange={(v) => { setHours(v); restage(); }} />}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <SelectField label="Filing status" value={status} onChange={(v) => { setStatus(v); restage(); }} options={STATUS_OPTS} />
              <NumberField label="State income tax rate" suffix="%" value={stateRate} step={0.1} onChange={(v) => { setStateRate(v); restage(); }}
                help="Enter 0 if your state has none (AK, FL, NV, SD, TX, WA, WY, TN, NH)." />
            </div>
            {mode === "w2"
              ? <NumberField label="Pre-tax deductions per year (401k, health) — optional" prefix="$" value={pretax} step={500} onChange={(v) => { setPretax(v); restage(); }} />
              : <NumberField label="Business expenses per year — optional" prefix="$" value={expenses} step={500} onChange={(v) => { setExpenses(v); restage(); }}
                  help="Home office, supplies, software, mileage — lowers the income you're taxed on." />}
          </>
        )}

        <button onClick={show} style={{
          width: "100%", marginTop: 8, cursor: "pointer", border: "none", borderRadius: 12, padding: "14px",
          fontFamily: FONT.body, fontSize: 16, fontWeight: 600, color: "#fff",
          background: `linear-gradient(135deg, ${C.cta}, ${C.coral})`,
        }}>Show my take-home pay</button>
      </div>

      {/* ---- results ---- */}
      {shown && (isCharge ? (
        <div style={{ background: C.inkSoft, borderRadius: 16, padding: "20px 22px", marginTop: 18 }}>
          <div style={{ color: C.onDarkDim, fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.5, marginBottom: 8 }}>WHAT YOU NEED TO BILL</div>
          <div style={{ background: "#fff", borderRadius: 12, padding: "6px 16px 14px" }}>
            <ResultRow label="Rate you need to charge" value={`${usd(charge.rateNeeded)}/hr`} strong accent={C.cta} />
            <ResultRow label="Gross to bill (monthly)" value={usd(charge.grossMonth)} />
            <ResultRow label={`To take home ${usd(parseFloat(goal) || 0)}/mo after ${chargeTax}% tax`} value={`${usd(charge.grossYear)}/yr gross`} />
          </div>
        </div>
      ) : calc ? (
        <div style={{ marginTop: 18 }}>
          {/* headline take-home (always visible — honest: we show the number we promised) */}
          <div style={{ background: `linear-gradient(135deg, ${C.inkSoft}, ${C.ink})`, borderRadius: 16, padding: "22px", textAlign: "center", color: C.onDark }}>
            <div style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 38, color: "#fff" }}>{usd(calc.perAmount)}</div>
            <div style={{ fontSize: 13, color: C.onDarkDim, marginTop: 2 }}>take-home per {calc.word} · {usd(calc.net)}/yr</div>
          </div>

          {/* gated detail: full breakdown + tax set-aside */}
          <div style={{ position: "relative", marginTop: 12 }}>
            <div style={{ filter: unlocked ? "none" : "blur(6px)", pointerEvents: unlocked ? "auto" : "none", userSelect: unlocked ? "auto" : "none" }} aria-hidden={!unlocked}>
              {mode === "se" && (
                <div style={{ background: "#FFF8EC", border: "1px solid #F2D9A8", borderRadius: 14, padding: 16, marginBottom: 12 }}>
                  <div style={{ color: C.apricot, fontSize: 15, fontWeight: 700, marginBottom: 2 }}>Set aside for taxes</div>
                  <div style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, color: "#B7791F" }}>{usd(calc.setAside)} ({calc.setAsidePct.toFixed(0)}% of income)</div>
                  <div style={{ fontSize: 13, color: "#8A6A2A", marginTop: 4 }}>Save about {usd(calc.quarterly)} every quarter — estimated taxes are due 4×/year. A safe rule of thumb is 25–30%.</div>
                </div>
              )}
              <div style={{ background: "#fff", border: `1px solid ${C.creamDim}`, borderRadius: 14, padding: "6px 16px 14px" }}>
                <ResultRow label="Gross income" value={usd(calc.gross)} />
                <ResultRow label={mode === "se" ? "Self-employment tax" : "Social Security + Medicare"} value={usd(calc.fica)} />
                <ResultRow label="Federal income tax" value={usd(calc.fed)} />
                <ResultRow label="State income tax (est.)" value={usd(calc.state)} />
                <ResultRow label="Take-home pay" value={usd(calc.net)} strong accent={C.evergreen} />
              </div>
              <div style={{ fontSize: 12.5, color: C.onLightDim, marginTop: 8 }}>
                Effective tax rate: {calc.effRate.toFixed(1)}% · Total tax: {usd(calc.totalTax)}
              </div>
            </div>

            {!unlocked && (
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", padding: 16 }}>
                <div style={{ background: "#fff", border: `1px solid ${C.creamDim}`, borderRadius: 16, padding: "22px 20px", maxWidth: 360, textAlign: "center", boxShadow: "0 12px 34px rgba(11,31,28,.18)" }}>
                  <div style={{ fontSize: 26 }}>🔒</div>
                  <div style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 19, color: C.onLight, margin: "6px 0 4px" }}>Your full breakdown is ready</div>
                  <div style={{ fontSize: 13.5, color: C.onLightDim, marginBottom: 14 }}>
                    Enter your email to unlock your complete tax breakdown{mode === "se" ? " and quarterly set-aside" : ""} — and get the honest, no-hype work-from-home newsletter. Unsubscribe anytime.
                  </div>
                  <form onSubmit={submitEmail} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
                      style={{ flex: 1, minWidth: 160, boxSizing: "border-box", padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.creamDim}`, background: "#fff", color: C.onLight, fontSize: 15, fontFamily: FONT.body }} />
                    <button type="submit" disabled={cap === "loading"} style={{
                      cursor: cap === "loading" ? "default" : "pointer", border: "none", borderRadius: 10, padding: "12px 18px",
                      fontSize: 15, fontWeight: 600, color: "#fff", fontFamily: FONT.body,
                      background: `linear-gradient(135deg, ${C.cta}, ${C.coral})`, opacity: cap === "loading" ? 0.6 : 1,
                    }}>{cap === "loading" ? "Unlocking..." : "Unlock my breakdown"}</button>
                  </form>
                  {cap === "error" && <div style={{ color: C.coral, fontSize: 13, marginTop: 8 }}>{capMsg}</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null)}

      <p style={{ fontSize: 12.5, lineHeight: 1.6, color: C.onLightDim, margin: "16px 4px 0" }}>
        Estimates only, for 2026, using federal brackets, the standard deduction, and self-employment tax. State tax is a flat estimate — real state rules vary. This is a planning tool, <strong>not tax advice</strong>; check with a tax professional before making decisions.
        Learn the basics in <a href="/blog/do-you-have-to-pay-taxes-on-work-from-home-income" style={{ color: "#B5481F" }}>our plain-English guide to work-from-home taxes</a>,
        and once you have a real offer, run it through the <a href="/#reality" style={{ color: "#B5481F" }}>Reality Check</a> and the Worth-It Tracker in <a href="/#paths" style={{ color: "#B5481F" }}>Real Paths</a>.
      </p>
    </section>
  );
}
