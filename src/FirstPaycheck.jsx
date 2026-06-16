import React, { useEffect, useRef, useState } from "react";
import { C, FONT, BRAND } from "./brand.js";
import Hero from "./Hero.jsx";
import RealityCheck from "./RealityCheck.jsx";
import ScamSmellTest from "./ScamSmellTest.jsx";
import RealPaths from "./RealPaths.jsx";
import EmailCapture from "./EmailCapture.jsx";
import HomeHook from "./HomeHook.jsx";
import Quiz from "./Quiz.jsx";
import { AFFILIATE_DISCLOSURE } from "./paths.js";
import { getStats } from "./track.js";

/* The three core surfaces, in the order the search data says people want them
   (handoff 5b): gauge it -> pick a real path -> prove it pays. Reality Check
   is live; the other two come online next session. */
const SURFACES = [
  {
    id: "reality",
    tag: "01 · GAUGE IT",
    title: "Reality Check",
    body: "Type any work-from-home path or trending fad, from UGC to AI agencies to a course someone is pitching. Get an honest scorecard: is it legit, real pay range, true cost to start, time to first dollar, and scam-risk flags.",
    chip: "Answers “is it real” + “how much”",
    accent: C.coral,
    live: true,
  },
  {
    id: "scam",
    tag: "02 · STAY SAFE",
    title: "Scam Smell Test",
    body: "Paste the pitch or recruiter message you got. It flags the MLM and funnel red flags, from pay-to-join to recruit-to-earn to vague “systems” and upfront fees, then tells you plainly whether to walk away.",
    chip: "FTC-aligned, the #1 anxiety question",
    accent: C.rose,
    live: true,
  },
  {
    id: "paths",
    tag: "03 · NOW DO IT",
    title: "Real Paths + Worth-It Tracker",
    body: "Start with Virtual Assistant, Freelance Writing, or Bookkeeping. Each shows real pay, first steps to a paycheck, and where to find legit work. Then the worth-it tracker does the math the scam world never makes you do: your true hourly rate.",
    chip: "Virtual Assistant · Writing · Bookkeeping",
    accent: C.aqua,
    live: true,
  },
];

function SurfaceCard({ s, i, onOpen }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.style.opacity = 1; el.style.transform = "none"; io.disconnect(); } },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const clickable = s.live;
  return (
    <div
      ref={ref}
      onClick={clickable ? onOpen : undefined}
      style={{
        background: "#fff", borderRadius: 18, padding: "26px 24px",
        border: `1px solid ${clickable ? s.accent + "66" : C.creamDim}`,
        boxShadow: "0 8px 30px rgba(11,31,28,0.06)",
        opacity: 0, transform: "translateY(22px)",
        transition: `opacity .7s ease ${i * 0.1}s, transform .7s ease ${i * 0.1}s`,
        display: "flex", flexDirection: "column", gap: 10,
        cursor: clickable ? "pointer" : "default",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.5, color: s.accent, fontWeight: 500 }}>{s.tag}</span>
        <span style={{
          fontFamily: FONT.mono, fontSize: 10, letterSpacing: 1, padding: "3px 8px", borderRadius: 999,
          color: s.live ? C.evergreen : C.onLightDim,
          background: s.live ? "#E2F5EC" : "#F1EDE5",
        }}>
          {s.live ? "LIVE" : "SOON"}
        </span>
      </div>
      <h3 style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 26, margin: 0, color: C.onLight, letterSpacing: "-0.01em" }}>
        {s.title}
      </h3>
      <p style={{ fontSize: 14.5, lineHeight: 1.6, color: C.onLightDim, margin: 0 }}>{s.body}</p>
      <span style={{
        marginTop: 4, alignSelf: "flex-start", fontSize: 12.5, color: C.onLight,
        background: `${s.accent}1f`, borderRadius: 999, padding: "6px 12px", fontWeight: 500,
      }}>
        {s.chip}
      </span>
      {clickable && (
        <span style={{ marginTop: 2, fontSize: 13.5, fontWeight: 600, color: s.accent }}>Open {s.title} →</span>
      )}
    </div>
  );
}

export default function FirstPaycheck() {
  const [view, setView] = useState("home"); // home | reality | scam | paths | quiz
  const [realityQuery, setRealityQuery] = useState("");
  const [pathId, setPathId] = useState(null);
  const [stats, setStats] = useState(null);
  const toolsRef = useRef(null);
  const scrollToTools = () => toolsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const go = (v) => { setView(v); window.scrollTo(0, 0); };
  const home = () => go("home");
  const openSurface = (id) => go(id);
  const openReality = (query) => { setRealityQuery(query || ""); go("reality"); };
  const openPath = (id) => { setPathId(id); go("paths"); };

  useEffect(() => { getStats().then((s) => s && setStats(s)); }, []);

  if (view === "reality") return <RealityCheck onBack={home} initialQuery={realityQuery} />;
  if (view === "scam") return <ScamSmellTest onBack={home} />;
  if (view === "paths") return <RealPaths onBack={home} initialPathId={pathId} />;
  if (view === "quiz") return <Quiz onBack={home} onPick={openPath} />;

  const totalActivity = stats ? (stats.checks || 0) + (stats.scams || 0) + (stats.paths || 0) : 0;

  return (
    <div style={{ background: C.cream, fontFamily: FONT.body, color: C.onLight }}>
      <Hero onStart={() => go("reality")} onPaths={() => go("paths")} />

      {/* BELOW THE FOLD */}
      <section ref={toolsRef} style={{ padding: "64px 24px 40px", maxWidth: 1100, margin: "0 auto" }}>
        {/* interactive hook */}
        <div style={{ maxWidth: 640, margin: "0 auto 28px" }}>
          <HomeHook onOpenReality={openReality} />
        </div>

        {/* live counters (only when there is real activity) */}
        {totalActivity > 0 && (
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }}>
            {[["checks run", stats.checks], ["scams flagged", stats.scams], ["plans built", stats.paths]].filter(([, n]) => n > 0).map(([label, n]) => (
              <div key={label} style={{ background: "#fff", border: `1px solid ${C.creamDim}`, borderRadius: 12, padding: "12px 18px", textAlign: "center", minWidth: 110 }}>
                <div style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 24, color: C.onLight }}>{n.toLocaleString()}</div>
                <div style={{ fontFamily: FONT.mono, fontSize: 10.5, letterSpacing: 1, color: C.onLightDim, textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* quiz CTA */}
        <div style={{ maxWidth: 640, margin: "0 auto 44px", textAlign: "center", background: "#13302B", borderRadius: 18, padding: "26px 24px" }}>
          <div style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 24, color: C.onDark }}>Not sure where to start?</div>
          <p style={{ fontSize: 14.5, color: C.onDarkDim, margin: "6px 0 16px" }}>Take the free 60-second quiz and we'll point you to the right path. No email required for your answer.</p>
          <button onClick={() => go("quiz")} style={{
            cursor: "pointer", border: "none", borderRadius: 999, padding: "13px 26px", fontSize: 15.5, fontWeight: 600, color: "#fff",
            fontFamily: FONT.body, background: `linear-gradient(135deg, ${C.cta}, ${C.coral})`,
          }}>Find my path →</button>
        </div>

        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 44px" }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 11.5, letterSpacing: 2, color: C.evergreen }}>
            WHAT YOU'LL DO HERE
          </span>
          <h2 style={{
            fontFamily: FONT.display, fontWeight: 600, fontSize: "clamp(28px, 5vw, 44px)",
            lineHeight: 1.1, letterSpacing: "-0.02em", margin: "12px 0 14px", color: C.onLight,
          }}>
            Sell clarity, not a dream.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: C.onLightDim, margin: 0 }}>
            First Paycheck isn't a course or a job board. It's a reality-check and planner.
            See what's real, see the real numbers, and get the honest steps, so you never
            pay to chase someone else's hype.
          </p>
        </div>

        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {SURFACES.map((s, i) => <SurfaceCard key={s.id} s={s} i={i} onOpen={() => openSurface(s.id)} />)}
        </div>

        <div style={{ marginTop: 26, textAlign: "center" }}>
          <button onClick={() => go("reality")} style={{
            cursor: "pointer", border: "none", borderRadius: 999, padding: "14px 28px",
            fontSize: 16, fontWeight: 600, color: "#fff", fontFamily: FONT.body,
            background: `linear-gradient(135deg, ${C.cta}, ${C.coral})`,
            boxShadow: `0 12px 32px ${C.cta}40`,
          }}>
            Try a Reality Check →
          </button>
        </div>

        <div style={{ marginTop: 48, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
          <EmailCapture
            source="homepage"
            title="The honest work-from-home newsletter"
            blurb="Real openings, fresh scam alerts, and what is actually working. Free, no hype, unsubscribe anytime."
            cta="Send it to me"
          />
        </div>
      </section>

      <footer style={{
        borderTop: `1px solid ${C.creamDim}`, padding: "26px 24px", maxWidth: 1100, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
      }}>
        <span style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 16, color: C.onLight }}>First Paycheck</span>
        <span style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 12.5, color: C.onLightDim }}>
          <a href="/blog" style={{ color: C.onLight, fontWeight: 600, textDecoration: "none" }}>Blog</a>
          <span>{BRAND.tagline} · firstpaycheck.co</span>
        </span>
      </footer>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 28px", fontSize: 11.5, lineHeight: 1.5, color: C.onLightDim }}>
        {AFFILIATE_DISCLOSURE} First Paycheck shares honest information, not financial advice.
      </div>
    </div>
  );
}
