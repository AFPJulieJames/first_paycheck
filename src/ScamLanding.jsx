import React, { useEffect } from "react";
import { C, FONT } from "./brand.js";
import ScamSmellTest from "./ScamSmellTest.jsx";
import EmailCapture from "./EmailCapture.jsx";
import { initScrollDepth } from "./track.js";

/* ============================================================
   SCAM CHECK LANDING PAGE  (/is-it-a-scam)
   A dedicated, message-matched destination for the Facebook posts,
   which are about scam warnings and "is this legit?".

   Why this exists: sending social traffic to the generic homepage is
   the classic message-match failure. The post promises "is this a
   scam?" and the homepage answered "the honest work-from-home guide".
   This page answers the exact question the post asked, with the tool
   itself as the first thing on screen.

   Deliberately has NO site nav. A landing page has one job; every extra
   link is an exit. The only links are the logo and the legal footer,
   which a scam-focused brand needs for credibility.
   ============================================================ */

const TRUST = [
  "Free, and no signup to use it",
  "We never ask for money",
  "Checked against FTC red flags",
];

export default function ScamLanding() {
  useEffect(() => { initScrollDepth(); }, []);

  return (
    <div style={{ background: C.cream, color: C.onLight, fontFamily: FONT.body, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header: logo only. No nav = no exits. */}
      <header style={{ borderBottom: `1px solid ${C.creamDim}`, background: C.cream }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: C.onLight }}>
            <span style={{ width: 24, height: 24, borderRadius: 7, background: "linear-gradient(135deg,#FF7A59,#FFB155)" }} />
            <b style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 18 }}>First Paycheck</b>
          </a>
          <span style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.2, color: C.onLightDim, textTransform: "uppercase" }}>
            Free scam check
          </span>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        {/* The tool is the page. It already opens with "Paste the message.
            We'll spot the traps." and a paste box, so the first thing a
            visitor from Facebook sees is the thing they came to do. */}
        <ScamSmellTest />

        <section style={{ maxWidth: 720, margin: "0 auto", width: "100%", boxSizing: "border-box", padding: "0 24px 56px" }}>
          {/* Trust strip. This audience is, by definition, on guard. */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 26 }}>
            {TRUST.map((t) => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, color: C.onLightDim }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12.5l4.2 4.2L19 7" stroke={C.evergreen} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t}
              </span>
            ))}
          </div>

          {/* The checklist is a concrete, immediate payoff — it converts far
              better than a vague "join our newsletter". */}
          <EmailCapture
            source="lp-scam-check"
            title="Get the free scam red-flag checklist"
            blurb="One page, the exact warning signs to look for before you reply to any work-from-home offer. We'll email it right away, plus a heads-up whenever a new scam is going around. Free, unsubscribe anytime."
            cta="Email me the checklist"
          />

          <p style={{ fontSize: 13, lineHeight: 1.6, color: C.onLightDim, textAlign: "center", margin: "26px auto 0", maxWidth: 520 }}>
            A real job pays you. If you are asked to pay a fee, buy a kit, deposit a check and send money back,
            or earn mainly by recruiting others, walk away.
          </p>
        </section>
      </main>

      <footer style={{ borderTop: `1px solid ${C.creamDim}`, background: C.cream }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 24px", display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", fontSize: 13 }}>
          <a href="/about" style={{ color: C.onLightDim, textDecoration: "none" }}>About</a>
          <a href="/contact" style={{ color: C.onLightDim, textDecoration: "none" }}>Contact</a>
          <a href="/privacy" style={{ color: C.onLightDim, textDecoration: "none" }}>Privacy</a>
          <a href="/terms" style={{ color: C.onLightDim, textDecoration: "none" }}>Terms</a>
          <span style={{ color: C.onLightDim }}>© {new Date().getFullYear()} First Paycheck</span>
        </div>
      </footer>
    </div>
  );
}
