import React, { useState, useMemo } from "react";
import { C, FONT } from "./brand.js";
import { SIGNALS, SMELL_VERDICT, scanMessage, SAMPLES } from "./scamsignals.js";
import EmailCapture from "./EmailCapture.jsx";
import ShareButton from "./ShareButton.jsx";
import { logStat } from "./track.js";

/* ============================================================
   SCAM SMELL TEST
   Paste a pitch or recruiter message. A local rule engine flags
   the MLM and funnel red flags instantly (works with no API),
   highlights the exact phrases, and explains each one in plain
   language. Optional AI second opinion for a human-style read.
   ============================================================ */

const card = {
  background: "#fff", border: `1px solid ${C.creamDim}`, borderRadius: 16,
  padding: "20px 22px", boxShadow: "0 8px 30px rgba(11,31,28,0.06)",
};
const labelStyle = { fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.2, color: C.onLightDim, textTransform: "uppercase" };
const SEV_COLOR = { high: C.coral, med: "#B07A12", low: C.onLightDim };

/* Wrap matched phrases in the original text with a highlight. */
function highlight(text, phrases) {
  if (!phrases.length) return text;
  const lower = text.toLowerCase();
  const ranges = [];
  for (const p of phrases) {
    const needle = p.toLowerCase();
    let from = 0, idx;
    while ((idx = lower.indexOf(needle, from)) !== -1) {
      ranges.push([idx, idx + needle.length]);
      from = idx + needle.length;
    }
  }
  if (!ranges.length) return text;
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [ranges[0]];
  for (let i = 1; i < ranges.length; i++) {
    const last = merged[merged.length - 1];
    if (ranges[i][0] <= last[1]) last[1] = Math.max(last[1], ranges[i][1]);
    else merged.push(ranges[i]);
  }
  const out = [];
  let cursor = 0;
  merged.forEach(([s, e], i) => {
    if (cursor < s) out.push(text.slice(cursor, s));
    out.push(
      <mark key={i} style={{ background: "#FBD9C9", color: "#7A2E12", borderRadius: 3, padding: "0 2px" }}>
        {text.slice(s, e)}
      </mark>
    );
    cursor = e;
  });
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}

/* Plain-text version of the result, for the optional "email me my result". */
function buildResultText(result, v) {
  const flags = result.triggered.length;
  const lines = [
    `Verdict: ${v.label} (${flags} red flag${flags === 1 ? "" : "s"})`,
    "",
    v.blurb,
    "",
  ];
  if (flags > 0) {
    lines.push("Red flags we spotted:");
    result.triggered.forEach((s) => {
      const sev = s.severity === "high" ? "high risk" : s.severity === "med" ? "caution" : "minor";
      lines.push(`- ${s.label} (${sev}): ${s.why}`);
    });
    lines.push("");
  }
  lines.push("The one rule that beats most scams: A real job pays you. If you are asked to pay a fee, buy a kit, deposit a check and send money back, or earn mainly by recruiting others, stop and walk away.");
  lines.push("");
  lines.push("The message you checked:");
  lines.push(result.input);
  return lines.join("\n");
}

export default function ScamSmellTest({ onBack }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [ai, setAi] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErr, setAiErr] = useState("");

  const run = (sample) => {
    const input = sample ?? text;
    if (sample) setText(sample);
    if (!input.trim()) return;
    setAi(""); setAiErr("");
    setResult({ ...scanMessage(input), input });
    logStat("scam");
  };

  const secondOpinion = async () => {
    if (!result) return;
    setAiLoading(true); setAiErr("");
    const prompt = `You are an honest anti-scam advisor for work-from-home seekers. Someone received this message:
"""${result.input}"""
In 2 to 3 plain sentences, no hype and no em dashes, say whether this looks like a scam or a legitimate opportunity, and give the single most important reason. If it asks for money upfront or to recruit others, say so plainly.`;
    try {
      const r = await fetch("/api/strategy", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!r.ok) throw new Error("failed");
      const raw = await r.json();
      const out = (raw.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();
      setAi(out || "No response.");
    } catch (e) {
      setAiErr("The AI read is unavailable right now, but the red-flag scan above stands on its own.");
    } finally { setAiLoading(false); }
  };

  const v = result ? SMELL_VERDICT[result.verdict] : null;
  const highlighted = useMemo(
    () => (result ? highlight(result.input, result.matchedPhrases) : null),
    [result]
  );

  return (
    <div style={{ background: C.cream, color: C.onLight, fontFamily: FONT.body }}>
      <div style={{ maxWidth: 720, margin: "0 auto", width: "100%", boxSizing: "border-box", padding: "8px 24px 64px" }}>
        <div style={{ textAlign: "center", margin: "14px 0 26px" }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 11.5, letterSpacing: 2, color: C.rose }}>SCAM SMELL TEST</span>
          <h1 style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: "clamp(30px, 6vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.02em", margin: "10px 0 12px" }}>
            Paste the message. We'll spot the traps.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: C.onLightDim, maxWidth: 540, margin: "0 auto" }}>
            Got a pitch, a recruiter DM, or a "job offer" that feels off? Paste it below. We check it against the classic MLM and funnel red flags, the FTC way.
          </p>
        </div>

        <div style={card}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="Paste the message or pitch you received here..."
            style={{ width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 12, border: `1px solid ${C.creamDim}`, background: C.cream, color: C.onLight, fontSize: 15, fontFamily: FONT.body, resize: "vertical", lineHeight: 1.55 }}
          />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginTop: 12 }}>
            <button onClick={() => run()} style={{ cursor: "pointer", border: "none", borderRadius: 12, padding: "13px 24px", fontSize: 15.5, fontWeight: 600, color: "#fff", fontFamily: FONT.body, background: `linear-gradient(135deg, ${C.cta}, ${C.coral})`, boxShadow: `0 10px 26px ${C.cta}3d` }}>
              Run the smell test
            </button>
            <span style={{ fontSize: 12.5, color: C.onLightDim }}>or try an example:</span>
            {SAMPLES.map((s) => (
              <button key={s.label} onClick={() => run(s.text)} style={{ cursor: "pointer", border: `1px solid ${C.creamDim}`, background: "#fff", borderRadius: 999, padding: "7px 13px", fontSize: 12.5, color: C.onLight, fontFamily: FONT.body }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div style={{ display: "grid", gap: 14, marginTop: 20 }}>
            <div style={{ ...card, borderLeft: `5px solid ${v.c}`, background: v.bg, borderColor: v.line }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 26, color: C.onLight }}>{v.label}</div>
                <span style={{ background: v.c, color: "#fff", fontWeight: 600, fontSize: 13, padding: "6px 13px", borderRadius: 999 }}>
                  {result.triggered.length} flag{result.triggered.length === 1 ? "" : "s"}
                </span>
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: C.onLight, margin: "10px 0 0" }}>{v.blurb}</p>
            </div>

            {/* Primary ask, right at the reveal — the highest-converting spot.
                Two-step: a single button that opens the form on click. */}
            <EmailCapture
              source="scam-smell-test-top"
              mode="result"
              resultSubject={`Your Scam Smell Test result: ${v.label}`}
              resultText={buildResultText(result, v)}
              twoStep
              trigger="Email me this result + free scam alerts"
              title="Where should we send it?"
              blurb="We'll email this breakdown now and send a heads-up whenever a new scam is going around. Free, about twice a month, unsubscribe anytime."
              cta="Email me my result"
              variant="inline"
            />

            <div style={card}>
              <div style={labelStyle}>The message, with red flags highlighted</div>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: C.onLight, marginTop: 10, whiteSpace: "pre-wrap" }}>
                {highlighted}
              </div>
            </div>

            {result.triggered.length > 0 ? (
              <div style={{ display: "grid", gap: 10 }}>
                {result.triggered.map((s) => (
                  <div key={s.id} style={card}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ width: 9, height: 9, borderRadius: 99, background: SEV_COLOR[s.severity] }} />
                      <span style={{ fontWeight: 700, fontSize: 15, color: C.onLight }}>{s.label}</span>
                      <span style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: SEV_COLOR[s.severity], border: `1px solid ${SEV_COLOR[s.severity]}55`, borderRadius: 999, padding: "2px 8px" }}>
                        {s.severity === "high" ? "high risk" : s.severity === "med" ? "caution" : "minor"}
                      </span>
                    </div>
                    <p style={{ fontSize: 13.5, lineHeight: 1.55, color: C.onLightDim, margin: "8px 0 0" }}>{s.why}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={card}>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: C.onLight, margin: 0 }}>
                  No common scam phrases tripped. That is a good sign, but it is not a guarantee. Still verify the company, never pay to start, and never deposit a check and send money back.
                </p>
              </div>
            )}

            <div style={{ ...card, background: "#13302B", borderColor: "#13302B" }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.2, color: C.aqua, textTransform: "uppercase" }}>The one rule that beats most scams</div>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: C.onDark, margin: "8px 0 0", fontWeight: 500 }}>
                A real job pays you. If you are asked to pay a fee, buy a kit, deposit a check and send money back, or earn mainly by recruiting others, stop and walk away.
              </p>
            </div>

            <div>
              {!ai && !aiLoading && (
                <button onClick={secondOpinion} style={{ cursor: "pointer", border: `1px solid ${C.creamDim}`, background: "#fff", borderRadius: 12, padding: "12px 20px", fontSize: 14.5, fontWeight: 600, color: C.onLight, fontFamily: FONT.body }}>
                  Get an AI second opinion
                </button>
              )}
              {aiLoading && <div style={{ ...card, color: C.onLightDim }}>Reading it over...</div>}
              {ai && (
                <div style={{ ...card, borderLeft: `4px solid ${C.aqua}` }}>
                  <div style={labelStyle}>AI second opinion</div>
                  <p style={{ fontSize: 14.5, lineHeight: 1.6, color: C.onLight, margin: "8px 0 0" }}>{ai}</p>
                </div>
              )}
              {aiErr && <div style={{ ...card, color: C.onLightDim, fontSize: 13.5 }}>{aiErr}</div>}
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <ShareButton
                label="Share this result"
                text={`I ran a message through First Paycheck's free Scam Smell Test. Verdict: ${v.label} (${result.triggered.length} red flag${result.triggered.length === 1 ? "" : "s"}).`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
