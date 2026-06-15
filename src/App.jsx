import React, { useState, useEffect } from "react";
import { C, FONT, BRAND } from "./brand.js";
import FirstPaycheck from "./FirstPaycheck.jsx";

/* Single shared-password gate. Session is a server-set HttpOnly cookie. */
export default function App() {
  const [authed, setAuthed] = useState(null); // null = still checking
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/session", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((d) => setAuthed(!!d.authed))
      .catch(() => setAuthed(false));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (r.ok) setAuthed(true);
      else setErr("That password didn't work. Try again.");
    } catch {
      setErr("Couldn't reach the server. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  };

  if (authed === null) {
    return (
      <div style={wrap}>
        <div style={{ color: C.onDarkDim, fontFamily: FONT.body }}>Loading…</div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div style={wrap}>
        <form onSubmit={submit} style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span aria-hidden="true" style={{
              width: 26, height: 26, borderRadius: 8,
              background: `linear-gradient(135deg, ${C.coral}, ${C.apricot})`,
              boxShadow: `0 0 22px ${C.coral}66`,
            }} />
            <span style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 20, color: C.onDark }}>
              First Paycheck
            </span>
          </div>
          <div style={{ color: C.onDarkDim, fontSize: 13.5, marginBottom: 16, fontFamily: FONT.body }}>
            {BRAND.tagline}
          </div>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Enter password"
            autoFocus
            style={{
              width: "100%", boxSizing: "border-box", padding: "12px 13px", borderRadius: 10,
              border: `1px solid ${C.line}`, background: "#0a1a17", color: C.onDark, fontSize: 14,
              fontFamily: FONT.body,
            }}
          />
          {err && <div style={{ color: C.coral, fontSize: 13, marginTop: 8 }}>{err}</div>}
          <button
            type="submit"
            disabled={busy || !pw}
            style={{
              marginTop: 12, width: "100%", padding: "12px", borderRadius: 10, border: "none",
              background: `linear-gradient(135deg, ${C.cta}, ${C.coral})`, color: "#fff",
              fontWeight: 600, fontSize: 15, fontFamily: FONT.body,
              cursor: busy || !pw ? "default" : "pointer", opacity: busy || !pw ? 0.55 : 1,
            }}
          >
            {busy ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    );
  }

  return <FirstPaycheck />;
}

const wrap = {
  minHeight: "100vh", background: C.ink, display: "flex", alignItems: "center",
  justifyContent: "center", padding: 16, fontFamily: FONT.body,
};
const card = {
  width: 340, maxWidth: "100%", background: C.inkSoft, border: `1px solid ${C.line}`,
  borderRadius: 16, padding: 26, boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
};
