import React, { useEffect, useState } from "react";
import { C, FONT } from "./brand.js";

/* Sticky top navigation. Gives orientation + a persistent CTA, which aids
   retention. Real buttons (keyboard accessible), condenses on mobile. */
export default function Nav({ onNav, onCheck }) {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["Reality Check", () => onNav("reality")],
    ["Scam Check", () => onNav("scam")],
    ["Paths", () => onNav("paths")],
    ["Calculator", () => onNav("rate")],
    ["Quiz", () => onNav("quiz")],
    ["Free Checklist", () => onNav("newsletter")],
  ];
  const linkStyle = { cursor: "pointer", background: "none", border: "none", fontFamily: FONT.body, fontSize: 14, fontWeight: 500, color: C.onLight, padding: "6px 4px" };

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: solid ? "rgba(251,246,239,0.92)" : "transparent",
      backdropFilter: solid ? "blur(10px)" : "none",
      borderBottom: `1px solid ${solid ? C.creamDim : "transparent"}`,
      transition: "background .25s ease, border-color .25s ease",
    }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
        <button onClick={() => onNav("home")} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", background: "none", border: "none" }}>
          <span aria-hidden="true" style={{ width: 24, height: 24, borderRadius: 7, background: `linear-gradient(135deg, ${C.coral}, ${C.apricot})` }} />
          <span style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 18, color: C.onLight }}>First Paycheck</span>
        </button>

        <nav style={{ display: "flex", alignItems: "center", gap: 4, overflowX: "auto" }} aria-label="Main">
          {links.map(([label, fn]) => (
            <button key={label} onClick={fn} style={linkStyle} className="fp-navlink">{label}</button>
          ))}
          <a href="/blog" style={{ ...linkStyle, textDecoration: "none", whiteSpace: "nowrap" }}>Blog</a>
          <button onClick={onCheck} style={{
            marginLeft: 6, cursor: "pointer", border: "none", borderRadius: 999, padding: "9px 16px",
            fontSize: 14, fontWeight: 600, color: "#fff", fontFamily: FONT.body, whiteSpace: "nowrap",
            background: `linear-gradient(135deg, ${C.cta}, ${C.coral})`,
          }}>Check a job</button>
        </nav>
      </div>
    </header>
  );
}
