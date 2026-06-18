import React, { useState } from "react";
import { C, FONT } from "./brand.js";

/* Reusable email capture. Posts to /api/subscribe with a source tag so we
   know where signups come from. Two looks: "panel" (standalone block) and
   "inline" (compact, for the end of a tool result). */
export default function EmailCapture({
  source = "site",
  title = "Get the honest work-from-home newsletter",
  blurb = "Real openings, fresh scam alerts, and what is actually working. No hype, no spam, unsubscribe anytime.",
  cta = "Send it to me",
  variant = "panel",
  dark = false,
  mode = "newsletter",     // "newsletter" | "result"
  resultSubject = "",       // used when mode === "result"
  resultText = "",          // the actual result body to email
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [msg, setMsg] = useState("");
  const [emailed, setEmailed] = useState(false);

  const submit = async (e) => {
    e?.preventDefault?.();
    if (state === "loading") return;
    setState("loading"); setMsg("");
    try {
      const isResult = mode === "result";
      const endpoint = isResult ? "/api/email-result" : "/api/subscribe";
      const payload = isResult
        ? { email, source, subject: resultSubject, body: resultText }
        : { email, source };
      const r = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || "Something went wrong.");
      setEmailed(Boolean(data.emailed));
      setState("done");
    } catch (err) {
      setState("error"); setMsg(err.message || "Please try again.");
    }
  };

  const onLight = !dark;
  const textMain = onLight ? C.onLight : C.onDark;
  const textDim = onLight ? C.onLightDim : C.onDarkDim;

  if (state === "done") {
    const headline = mode === "result" && emailed ? "Sent. Check your inbox." : "You are on the list.";
    const sub = mode === "result"
      ? (emailed
          ? "Your result is on its way, and you are on the no-hype newsletter too. Unsubscribe anytime."
          : "You are on the newsletter. Your result is on screen above to save or screenshot.")
      : "Thanks for trusting us with your email. We will only send things worth your time.";
    return (
      <div style={{
        borderRadius: 14, padding: variant === "inline" ? "14px 16px" : "20px 22px",
        background: "#E2F5EC", border: "1px solid #9FE1C6", color: "#14241F",
      }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{headline}</div>
        <div style={{ fontSize: 13.5, color: C.onLightDim, marginTop: 4 }}>{sub}</div>
      </div>
    );
  }

  const inputStyle = {
    flex: 1, minWidth: 180, boxSizing: "border-box", padding: "12px 14px", borderRadius: 10,
    border: `1px solid ${onLight ? C.creamDim : C.line}`, background: onLight ? "#fff" : "#0a1a17",
    color: textMain, fontSize: 15, fontFamily: FONT.body,
  };
  const wrap = variant === "inline"
    ? { borderRadius: 14, padding: "16px 18px", background: onLight ? C.cream : "#13302B", border: `1px solid ${onLight ? C.creamDim : C.line}` }
    : { borderRadius: 16, padding: "22px 24px", background: dark ? "#13302B" : "#fff", border: `1px solid ${onLight ? C.creamDim : C.line}` };

  return (
    <div style={wrap}>
      {title && <div style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: variant === "inline" ? 17 : 21, color: textMain }}>{title}</div>}
      {blurb && <div style={{ fontSize: 13.5, color: textDim, margin: "6px 0 12px", lineHeight: 1.5 }}>{blurb}</div>}
      <form onSubmit={submit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" style={inputStyle} />
        <button type="submit" disabled={state === "loading"} style={{
          cursor: state === "loading" ? "default" : "pointer", border: "none", borderRadius: 10, padding: "12px 20px",
          fontSize: 15, fontWeight: 600, color: "#fff", fontFamily: FONT.body,
          background: `linear-gradient(135deg, ${C.cta}, ${C.coral})`, opacity: state === "loading" ? 0.6 : 1,
        }}>{state === "loading" ? "Sending..." : cta}</button>
      </form>
      {state === "error" && <div style={{ color: C.coral, fontSize: 13, marginTop: 8 }}>{msg}</div>}
    </div>
  );
}
