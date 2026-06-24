import React, { useState } from "react";
import { C, FONT } from "./brand.js";
import { PATHS } from "./paths.js";
import EmailCapture from "./EmailCapture.jsx";

/* ============================================================
   FIND YOUR PATH QUIZ
   A 60-second, no-pressure quiz that recommends one of the
   starter paths. Pure local logic (no API). Ends with the pick,
   a button into that path, and an email capture.
   ============================================================ */

/* Each option scores across all ten starter paths. The "Which sounds most
   like you?" question (interest) is the strongest signal and also breaks ties,
   so the result follows what the person actually told us about themselves.
   Every path appears in the interest question, so each one is reachable. */
const QUESTIONS = [
  {
    q: "How much time can you give it each week?",
    options: [
      { label: "A few hours, here and there", score: { va: 1, transcription: 2, annotation: 2, "digital-products": 1 } },
      { label: "Around 10 hours, fairly steady", score: { va: 1, writing: 1, bookkeeping: 1, support: 2, smm: 1, "pinterest-manager": 1 } },
      { label: "20+ hours, I'm going for it", score: { writing: 2, bookkeeping: 2, support: 1, smm: 1, "video-editing": 1 } },
    ],
  },
  {
    q: "What are you hoping it turns into?",
    options: [
      { label: "A little extra cash, soon", score: { va: 1, support: 1, transcription: 2, annotation: 2 } },
      { label: "A steady part-time paycheck", score: { va: 1, bookkeeping: 2, support: 2, smm: 1, "pinterest-manager": 1 } },
      { label: "Eventually a full-time income", score: { va: 1, writing: 2, bookkeeping: 2, smm: 1, "video-editing": 1, "digital-products": 1 } },
    ],
  },
  {
    q: "Which sounds most like you?",
    interest: true,
    options: [
      { label: "Organized, on top of details", score: { va: 3 } },
      { label: "I love words and explaining things", score: { writing: 3 } },
      { label: "I like numbers and order", score: { bookkeeping: 3 } },
      { label: "I like helping and talking to people", score: { support: 3 } },
      { label: "Fast typer, happy to work heads-down", score: { transcription: 3 } },
      { label: "Detail-focused and a bit techy", score: { annotation: 3 } },
      { label: "Creative, and I enjoy social media", score: { smm: 3 } },
      { label: "I like hands-on creative work like video", score: { "video-editing": 3 } },
      { label: "I like design, keywords, and behind-the-scenes work", score: { "pinterest-manager": 3 } },
      { label: "I'd rather build my own products than have clients", score: { "digital-products": 3 } },
    ],
  },
  {
    q: "What kind of work appeals most?",
    options: [
      { label: "A bit of everything, lots of variety", score: { va: 2, support: 1, smm: 1 } },
      { label: "Creative work with words", score: { writing: 2, "pinterest-manager": 1 } },
      { label: "Structured work with records and numbers", score: { bookkeeping: 2, annotation: 1 } },
      { label: "Helping customers and solving problems", score: { support: 2 } },
      { label: "Repetitive tasks I can do on autopilot", score: { transcription: 2, annotation: 1 } },
      { label: "Following clear steps to train tech", score: { annotation: 2, transcription: 1 } },
      { label: "Creative, visual work (design, video, social)", score: { "video-editing": 2, smm: 1, "pinterest-manager": 1 } },
      { label: "Making my own products to sell", score: { "digital-products": 2 } },
    ],
  },
  {
    q: "Your own clients, or a steady paycheck?",
    options: [
      { label: "I'd rather find my own clients or sell my own thing", score: { va: 2, writing: 2, bookkeeping: 2, smm: 2, "video-editing": 2, "pinterest-manager": 2, "digital-products": 2 } },
      { label: "I'd prefer a company that pays me, free to start", score: { support: 2, transcription: 2, annotation: 2 } },
    ],
  },
];

const EMPTY_SCORE = { va: 0, writing: 0, bookkeeping: 0, support: 0, transcription: 0, annotation: 0, smm: 0, "video-editing": 0, "pinterest-manager": 0, "digital-products": 0 };

export default function Quiz({ onBack, onPick }) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState({ ...EMPTY_SCORE });
  const [interestId, setInterestId] = useState(null);
  const done = step >= QUESTIONS.length;

  const answer = (opt) => {
    const q = QUESTIONS[step];
    const next = { ...score };
    for (const k in opt.score) next[k] += opt.score[k];
    setScore(next);
    if (q.interest) setInterestId(Object.keys(opt.score)[0]);
    setStep(step + 1);
  };
  const restart = () => { setStep(0); setScore({ ...EMPTY_SCORE }); setInterestId(null); };

  // Highest score wins. Ties resolve toward the path the person said they're
  // most like, so the result reflects their stated interest, not list order.
  const max = Math.max(...Object.values(score));
  const topped = Object.keys(score).filter((k) => score[k] === max);
  const winnerId = topped.length === 1
    ? topped[0]
    : (interestId && topped.includes(interestId) ? interestId : topped[0]);
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
