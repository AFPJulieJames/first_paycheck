import React, { useState } from "react";
import { C, FONT } from "./brand.js";

/* Share a result via the native share sheet (mobile) or copy to clipboard.
   Always appends the site link so shares drive traffic back. */
export default function ShareButton({ text, url = "https://firstpaycheck.co", label = "Share this" }) {
  const [done, setDone] = useState(false);
  const payload = `${text}\n\nChecked free at ${url}`;

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "First Paycheck", text, url });
        return;
      }
    } catch (e) { /* user cancelled or unsupported, fall through to copy */ }
    try {
      await navigator.clipboard.writeText(payload);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch (e) {}
  };

  return (
    <button onClick={onShare} style={{
      cursor: "pointer", border: `1px solid ${C.creamDim}`, background: "#fff", borderRadius: 999,
      padding: "9px 16px", fontSize: 13.5, fontWeight: 600, color: C.onLight, fontFamily: FONT.body,
      display: "inline-flex", alignItems: "center", gap: 7,
    }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13" stroke={C.coral} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {done ? "Copied!" : label}
    </button>
  );
}
