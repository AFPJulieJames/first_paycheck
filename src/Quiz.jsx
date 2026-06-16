import React, { useState } from "react";
import { C, FONT } from "./brand.js";
import { PATHS } from "./paths.js";
import EmailCapture from "./EmailCapture.jsx";

/* ============================================================
   FIND YOUR PATH QUIZ
   A 60-second, no-pressure quiz that recommends one of the three
   starter paths. Pure local logic (no API). Ends with the pick,
   a button into that path, and an email capture.
   ============================================================ */

const QUESTIONS = [
  {
    q: "How much time can you give it each week?",
    options: [
      { label: "A few hours", score: { va: 2, writing: 1, bookkeeping: 0 } },
      { label: "Around 10 hours", score: { va: 1, writing: 1, bookkeeping: 1 } },
      { label: "20+ hours", score: { va: 1, writing: 1, bookkeeping: 2 } },
    ],
  },
  {
    q: "What are you hoping it turns into?",
    options: [
      { label: "A little extra cash", score: { va: 2, writing: 1, bookkeeping: 0 } },
      { label: "Steady part-time income", score: { va: 1, writing: 1, bookkeeping: 2 } },
      { label: "Eventually a full-time income", score: { va: 0, writing: 2, bookkeeping: 2 } },
    ],
  },
  {
    q: "Which sounds most like you?",
    options: [
      { label: "Organized, on top of details", score: { va: 3, writing: 0, bookkeeping: 1 } },
      { label: "I like writing and explaining", score: { va: 0, writing: 3, bookkeeping: 0 } },
      { label: "I like numbers and order", score: { va: 1, writing: 0, bookkeeping: 3 } },
      { label: "Honestly, not sure yet", score: { va: 2, writing: 1, bookkeeping: 1 } },
    ],
  },
  {
    q: "Can you spend a little to get started?",
    options: [
      { label: "I'd rather start free", score: { va: 2, writing: 2, bookkeeping: 0 } },
      { label: "A little is fine", score: { va: 1, writing: 1, bookkeeping: 2 } },
    ],
  },
];

export default function Quiz({ onBack, onPick }) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState({ va: 0, writing: 0, bookkeeping: 0 });
  const done = step >= QUESTIONS.length;

  const answer = (opt) => {
    const next = { ...score };
    for (const k in opt.score) next[k] += opt.score[k];
    setScore(next);
    setStep(step + 1);
  };
  const restart = () => { setStep(0); setScore({ va: 0, writing: 0, bookkeeping: 0 }); };

  const winnerId = Object.entries(score).sort((a, b) => b[1] - a[1])[0][0];
  const path = PATHS.find((p) => p.id === winnerId) || PATHS[0];
  const pct = Math.round(((step) / QUESTIONS.length) * 100);

  return (
    <div style={{ background: C.cream, color: C.onLight, fontFamily: FONT.body }}>
      <div style={{ maxWidth: 640, margin: "0 auto", width: "100%", boxSizing: "border-box", padding: "24px 24px 64px" }}>
        <div style={{ textAlign: "center", margin: "14px 0 22px" }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 11.5, letterSpacing: 2, color: C.coral }}>FIND YOUR PATH</span>
          <h1 style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: "clamp(28px, 6vw, 44px)", lineHeight: 1.05, letterSpacing: "-0.02em", margin: "10px 0 6px" }}>
            {done ? "Here's where to start." : "60 seconds to your starting point."}
          </h1>
          {!done && <p style={{ fontSize: 15.5, color: C.onLightDim, margin: 0 }}>No email needed to get your answer. Just honest matching.</p>}
        </div>

        {!done && (
          <div style={{ height: 6, background: C.creamDim, borderRadius: 999, overflow: "hidden", marginBottom: 22 }}>
            <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.cta}, ${C.coral})`, transition: "width .3s ease" }} />
          </div>
        )}

        {!done ? (
          <div style={{ background: "#fff", border: `1px solid ${C.creamDim}`, borderRadius: 18, padding: "26px 24px", boxShadow: "0 8px 30px rgba(11,31,28,0.06)" }}>
            <div style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 22, color: C.onLight, marginBottom: 16 }}>
              {QUESTIONS[step].q}
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {QUESTIONS[step].options.map((opt, i) => (
                <button key={i} onClick={() => answer(opt)} style={{
                  cursor: "pointer", textAlign: "left", border: `1px solid ${C.creamDim}`, background: C.cream,
                  borderRadius: 12, padding: "14px 16px", fontSize: 15, color: C.onLight, fontFamily: FONT.body,
                }}>{opt.label}</button>
              ))}
            </div>
            <div style={{ fontSize: 12.5, color: C.onLightDim, marginTop: 14 }}>Question {step + 1} of {QUESTIONS.length}</div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ background: "#fff", border: `1px solid ${C.creamDim}`, borderRadius: 18, padding: "26px 24px", boxShadow: "0 8px 30px rgba(11,31,28,0.06)", textAlign: "center" }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.5, color: C.evergreen }}>YOUR BEST FIT</div>
              <div style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 34, color: C.onLight, margin: "8px 0 4px", letterSpacing: "-0.01em" }}>{path.name}</div>
              <div style={{ fontSize: 15, color: C.coral, fontWeight: 600 }}>{path.tagline}</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: C.onLightDim, margin: "12px auto 0", maxWidth: 460 }}>{path.fitIf}</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 18 }}>
                <button onClick={() => onPick(path.id)} style={{
                  cursor: "pointer", border: "none", borderRadius: 999, padding: "13px 24px", fontSize: 15.5, fontWeight: 600, color: "#fff",
                  fontFamily: FONT.body, background: `linear-gradient(135deg, ${C.cta}, ${C.coral})`, boxShadow: `0 10px 26px ${C.cta}3d`,
                }}>Open my {path.name} plan →</button>
                <button onClick={restart} style={{
                  cursor: "pointer", border: `1px solid ${C.creamDim}`, background: "#fff", borderRadius: 999, padding: "13px 20px", fontSize: 14.5, color: C.onLight, fontFamily: FONT.body,
                }}>Retake</button>
              </div>
            </div>
            <EmailCapture
              source="quiz"
              title="Want honest WFH tips and new paths?"
              blurb="Join the no-hype newsletter for honest tips, real openings, and scam alerts. Free, unsubscribe anytime."
              cta="Join the newsletter"
              variant="inline"
            />
          </div>
        )}
      </div>
    </div>
  );
}
