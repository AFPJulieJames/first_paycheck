import React, { useState, useRef, useEffect } from "react";
import { C, FONT } from "./brand.js";
import { trackEvent } from "./track.js";

/* Reusable email capture. Posts to /api/subscribe with a source tag so we
   know where signups come from. Two looks: "panel" (standalone block) and
   "inline" (compact, for the end of a tool result).

   twoStep: when true, renders a single button first (the "cta" label). The
   form only appears after the user clicks it. That extra click is a micro-
   commitment that signals intent, and it keeps the result reveal uncluttered.
   Placed at the moment a tool shows its result, this is the highest-converting
   position for an opt-in. */
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
  twoStep = false,          // render a click-to-reveal button before the form
  trigger = "",             // optional button label for twoStep (defaults to cta)
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [msg, setMsg] = useState("");
  const [emailed, setEmailed] = useState(false);
  const [open, setOpen] = useState(!twoStep); // twoStep starts collapsed
  const inputRef = useRef(null);

  // Fire GA4 form_start once, when the user shows intent (opens or focuses).
  const startedRef = useRef(false);
  const fireStart = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("form_start", { source });
  };

  // When the two-step form opens, drop the cursor straight into the field.
  useEffect(() => {
    if (open && twoStep && inputRef.current) inputRef.current.focus();
  }, [open, twoStep]);

  const reveal = () => { fireStart(); setOpen(true); };

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
      trackEvent(isResult ? "email_result_signup" : "newsletter_signup", { source }); // GA4 conversion
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

  // Two-step, collapsed: show only the trigger button until the user clicks it.
  if (twoStep && !open) {
    return (
      <button onClick={reveal} style={{
        width: "100%", cursor: "pointer", border: "none", borderRadius: 12, padding: "14px 20px",
        fontSize: 15.5, fontWeight: 600, color: "#fff", fontFamily: FONT.body,
        background: `linear-gradient(135deg, ${C.cta}, ${C.coral})`, boxShadow: `0 10px 26px ${C.cta}3d`,
      }}>
        {trigger || cta}
      </button>
    );
  }

  return (
    <div style={wrap}>
      {title && <div style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: variant === "inline" ? 17 : 21, color: textMain }}>{title}</div>}
      {blurb && <div style={{ fontSize: 13.5, color: textDim, margin: "6px 0 12px", lineHeight: 1.5 }}>{blurb}</div>}
      <form onSubmit={submit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input ref={inputRef} type="email" required value={email} onFocus={fireStart} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" style={inputStyle} />
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
