import React from "react";
import { C, FONT, BRAND } from "./brand.js";
import { AFFILIATE_DISCLOSURE } from "./paths.js";

/* Shared footer, shown on every page. Gives navigation, trust, and the
   required disclosures. In-app links use onNav; Blog is a real URL. */
export default function Footer({ onNav }) {
  const linkBtn = { cursor: "pointer", background: "none", border: "none", padding: 0, textAlign: "left", fontFamily: FONT.body, fontSize: 14, color: C.onLightDim };
  const Group = ({ title, children }) => (
    <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.2, color: C.onLightDim, textTransform: "uppercase" }}>{title}</div>
      {children}
    </div>
  );

  return (
    <footer style={{ borderTop: `1px solid ${C.creamDim}`, background: C.cream, marginTop: 8 }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 24px 28px" }}>
        <div style={{ display: "grid", gap: 28, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          <div style={{ display: "grid", gap: 8, alignContent: "start", maxWidth: 280 }}>
            <button onClick={() => onNav("home")} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", background: "none", border: "none", padding: 0 }}>
              <span aria-hidden="true" style={{ width: 24, height: 24, borderRadius: 7, background: `linear-gradient(135deg, ${C.coral}, ${C.apricot})` }} />
              <span style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 18, color: C.onLight }}>First Paycheck</span>
            </button>
            <p style={{ fontSize: 13.5, lineHeight: 1.55, color: C.onLightDim, margin: 0 }}>{BRAND.tagline}</p>
          </div>

          <Group title="The tools">
            <button onClick={() => onNav("reality")} style={linkBtn}>Reality Check</button>
            <button onClick={() => onNav("scam")} style={linkBtn}>Scam Smell Test</button>
            <button onClick={() => onNav("paths")} style={linkBtn}>Real Paths</button>
            <button onClick={() => onNav("quiz")} style={linkBtn}>Find your path quiz</button>
          </Group>

          <Group title="Learn">
            <a href="/blog" style={{ ...linkBtn, textDecoration: "none" }}>Blog</a>
            <a href="/blog/is-work-from-home-a-scam" style={{ ...linkBtn, textDecoration: "none" }}>Is it a scam?</a>
            <a href="/blog/how-much-can-you-make-working-from-home" style={{ ...linkBtn, textDecoration: "none" }}>How much can you make?</a>
          </Group>

          <Group title="Company">
            <a href="/about" style={{ ...linkBtn, textDecoration: "none" }}>About</a>
            <a href="/contact" style={{ ...linkBtn, textDecoration: "none" }}>Contact</a>
            <a href="/privacy" style={{ ...linkBtn, textDecoration: "none" }}>Privacy</a>
            <a href="/terms" style={{ ...linkBtn, textDecoration: "none" }}>Terms</a>
          </Group>

          <Group title="Get updates">
            <button onClick={() => onNav("home")} style={linkBtn}>Join the newsletter</button>
            <span style={{ fontSize: 13, color: C.onLightDim }}>firstpaycheck.co</span>
          </Group>
        </div>

        <div style={{ borderTop: `1px solid ${C.creamDim}`, marginTop: 28, paddingTop: 18, fontSize: 11.5, lineHeight: 1.55, color: C.onLightDim }}>
          <p style={{ margin: "0 0 6px" }}>{AFFILIATE_DISCLOSURE}</p>
          <p style={{ margin: 0 }}>First Paycheck shares honest information, not financial advice. © {new Date().getFullYear()} First Paycheck.</p>
        </div>
      </div>
    </footer>
  );
}
