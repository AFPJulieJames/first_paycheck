import React, { useState, useEffect } from "react";
import { C, FONT } from "./brand.js";

/* ============================================================
   WORTH-IT TRACKER
   The anti-scam wedge. Enter hours worked and money earned, get
   your real hourly rate, green when it is worth your time and red
   when it is not. The scam and hype world never makes anyone run
   this math, because the numbers would not survive it.

   Logs entries to localStorage so a user can track week to week
   and see a running average. No backend needed.
   ============================================================ */

const KEY = "fp-worthit-log";
const card = {
  background: "#fff", border: `1px solid ${C.creamDim}`, borderRadius: 16,
  padding: "20px 22px", boxShadow: "0 8px 30px rgba(11,31,28,0.06)",
};

function rateVerdict(rate) {
  if (rate >= 20) return { c: "#1F9D6B", bg: "#E2F5EC", label: "Worth it", note: "Solid pay for your time. This is real income, keep going." };
  if (rate >= 12) return { c: "#B07A12", bg: "#FBF1DC", label: "Borderline", note: "Okay for now, but aim higher. Specializing or repeat clients will lift this fast." };
  return { c: "#B91C1C", bg: "#FBE3E3", label: "Not worth it yet", note: "That is below minimum wage in most states. Charge more, work faster, or rethink this gig before it eats your time." };
}

const money = (n) => "$" + (Math.round(n * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function WorthItTracker() {
  const [hours, setHours] = useState("");
  const [earned, setEarned] = useState("");
  const [label, setLabel] = useState("");
  const [log, setLog] = useState([]);

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setLog(JSON.parse(raw)); } catch (e) {}
  }, []);
  const persist = (next) => { setLog(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) {} };

  const h = parseFloat(hours), e = parseFloat(earned);
  const valid = h > 0 && e >= 0;
  const rate = valid ? e / h : null;
  const v = rate !== null ? rateVerdict(rate) : null;

  const save = () => {
    if (!valid) return;
    const entry = { id: Date.now(), label: label.trim() || "This week", hours: h, earned: e, rate, date: new Date().toLocaleDateString() };
    persist([entry, ...log].slice(0, 30));
    setHours(""); setEarned(""); setLabel("");
  };
  const remove = (id) => persist(log.filter((x) => x.id !== id));

  const avg = log.length ? log.reduce((s, x) => s + x.rate, 0) / log.length : null;

  const input = { width: "100%", boxSizing: "border-box", padding: "12px 13px", borderRadius: 10, border: `1px solid ${C.creamDim}`, background: C.cream, color: C.onLight, fontSize: 15, fontFamily: FONT.body };

  return (
    <div style={card}>
      <h3 style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 24, margin: 0, color: C.onLight }}>
        Is it worth it this week?
      </h3>
      <p style={{ fontSize: 14, color: C.onLightDim, margin: "6px 0 16px", lineHeight: 1.55 }}>
        Enter your hours and what you actually earned. This is the math the hype world never wants you to do.
      </p>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <label style={{ fontSize: 12.5, color: C.onLightDim }}>Hours worked</label>
          <input type="number" min="0" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="e.g. 10" style={input} />
        </div>
        <div>
          <label style={{ fontSize: 12.5, color: C.onLightDim }}>Money earned</label>
          <input type="number" min="0" step="1" value={earned} onChange={(e) => setEarned(e.target.value)} placeholder="e.g. 220" style={input} />
        </div>
      </div>
      <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label (optional), e.g. VA work, week of the 9th" style={{ ...input, marginTop: 10 }} />

      {v && (
        <div style={{ marginTop: 14, background: v.bg, borderRadius: 12, padding: "16px 18px", border: `1px solid ${v.c}33` }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontSize: 12.5, color: v.c, fontWeight: 600, fontFamily: FONT.mono, letterSpacing: 0.5 }}>YOUR REAL HOURLY RATE</div>
              <div style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 40, color: v.c, lineHeight: 1.1 }}>{money(rate)}<span style={{ fontSize: 18 }}>/hr</span></div>
            </div>
            <span style={{ background: v.c, color: "#fff", fontWeight: 600, fontSize: 13.5, padding: "7px 14px", borderRadius: 999 }}>{v.label}</span>
          </div>
          <p style={{ fontSize: 14, color: C.onLight, margin: "10px 0 0", lineHeight: 1.55 }}>{v.note}</p>
          <button onClick={save} style={{ marginTop: 14, cursor: "pointer", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 14, fontWeight: 600, color: "#fff", fontFamily: FONT.body, background: C.ink }}>
            Save to my log
          </button>
        </div>
      )}

      {log.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <span style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1, color: C.onLightDim, textTransform: "uppercase" }}>Your log</span>
            {avg !== null && <span style={{ fontSize: 13, color: C.onLightDim }}>Average: <b style={{ color: rateVerdict(avg).c }}>{money(avg)}/hr</b></span>}
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {log.map((x) => {
              const lv = rateVerdict(x.rate);
              return (
                <div key={x.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 12px", background: C.cream, borderRadius: 10, border: `1px solid ${C.creamDim}` }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.onLight, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{x.label}</div>
                    <div style={{ fontSize: 12, color: C.onLightDim }}>{x.hours} hrs · {money(x.earned)} · {x.date}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 700, color: lv.c, fontSize: 15 }}>{money(x.rate)}/hr</span>
                    <button onClick={() => remove(x.id)} aria-label="Remove" style={{ cursor: "pointer", background: "none", border: `1px solid ${C.creamDim}`, borderRadius: 6, padding: "3px 9px", fontSize: 12, color: C.onLightDim }}>×</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
