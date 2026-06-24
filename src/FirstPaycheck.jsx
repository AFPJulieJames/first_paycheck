import React, { useEffect, useRef, useState } from "react";
import { C, FONT, BRAND } from "./brand.js";
import Hero from "./Hero.jsx";
import Nav from "./Nav.jsx";
import Footer from "./Footer.jsx";
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

// Views that are deep-linkable via the URL hash, so the static blog/marketing
// pages (and shared links) can open a specific tool, e.g. /#scam.
const HASH_VIEWS = ["reality", "scam", "paths", "quiz"];
const viewFromHash = () => {
  const h = (typeof window !== "undefined" ? window.location.hash : "").replace(/^#/, "");
  return HASH_VIEWS.includes(h) ? h : "home";
};

export default function FirstPaycheck() {
  const [view, setView] = useState(viewFromHash); // home | reality | scam | paths | quiz
  const [realityQuery, setRealityQuery] = useState("");
  const [pathId, setPathId] = useState(null);
  const [stats, setStats] = useState(null);
  const [pendingNewsletter, setPendingNewsletter] = useState(
    typeof window !== "undefined" && window.location.hash === "#newsletter"
  );
  const toolsRef = useRef(null);
  const newsletterRef = useRef(null);
  const scrollToTools = () => toolsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  // Keep the URL hash in sync so tools are deep-linkable and shareable.
  const go = (v) => {
    setView(v);
    if (typeof window !== "undefined") {
      if (v === "home") history.replaceState(null, "", window.location.pathname + window.location.search);
      else if (window.location.hash !== `#${v}`) window.location.hash = v;
    }
    window.scrollTo(0, 0);
  };
  const home = () => go("home");
  const openSurface = (id) => go(id);
  const openReality = (query) => { setRealityQuery(query || ""); go("reality"); };
  const openPath = (id) => { setPathId(id); go("paths"); };
  // Bring the newsletter form into view AND focus its input, so the action
  // always gives feedback, even when the form is already on screen (e.g.
  // clicking "Join the newsletter" from the footer right above it).
  const focusNewsletter = () => {
    const el = newsletterRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.querySelector("input")?.focus({ preventScroll: true });
  };
  // Newsletter signup lives at the bottom of the home view. From home, focus
  // it directly; from another view, switch to home first, then the effect
  // below runs once the form has rendered.
  const goNewsletter = () => {
    if (view === "home") {
      focusNewsletter();
    } else {
      setPendingNewsletter(true);
      setView("home");
    }
  };

  useEffect(() => { getStats().then((s) => s && setStats(s)); }, []);
  useEffect(() => {
    if (view === "home" && pendingNewsletter) {
      focusNewsletter();
      setPendingNewsletter(false);
    }
  }, [view, pendingNewsletter]);
  // Handle back/forward and #newsletter links arriving via hash changes.
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace(/^#/, "");
      if (h === "newsletter") { setView("home"); setPendingNewsletter(true); }
      else setView(HASH_VIEWS.includes(h) ? h : "home");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const onNav = (v) => {
    if (v === "home") return home();
    if (v === "newsletter") return goNewsletter();
    return go(v);
  };
  const totalActivity = stats ? (stats.checks || 0) + (stats.scams || 0) + (stats.paths || 0) : 0;
  const MIN_PUBLIC_COUNT = 500; // hide the counters until usage is credible (low numbers read as "nobody uses this")

  return (
    <div style={{ background: C.cream, fontFamily: FONT.body, color: C.onLight, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Nav onNav={onNav} onCheck={() => go("reality")} />
      <main style={{ flex: 1 }}>
        {view === "reality" && <RealityCheck initialQuery={realityQuery} />}
        {view === "scam" && <ScamSmellTest />}
        {view === "paths" && <RealPaths initialPathId={pathId} />}
        {view === "quiz" && <Quiz onPick={openPath} />}
        {view === "home" && (
      <>
      <Hero onStart={() => go("reality")} onPaths={() => go("paths")} onOpenReality={openReality} stats={stats} />

      {/* BELOW THE FOLD */}
      <section ref={toolsRef} style={{ padding: "56px 24px 40px", maxWidth: 1100, margin: "0 auto" }}>
        {/* live counters (only when there is real activity) */}
        {totalActivity >= MIN_PUBLIC_COUNT && (
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 44 }}>
            {[["checks run", stats.checks], ["scams flagged", stats.scams], ["plans built", stats.paths]].filter(([, n]) => n >= 25).map(([label, n]) => (
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

        <div id="newsletter" ref={newsletterRef} style={{ marginTop: 48, maxWidth: 620, marginLeft: "auto", marginRight: "auto", scrollMarginTop: 80 }}>
          <EmailCapture
            source="homepage"
            title="Get the free scam red-flag checklist"
            blurb="Join the no-hype newsletter and we'll email you the scam red-flag checklist right away. Real openings, fresh scam alerts, unsubscribe anytime."
            cta="Email me the checklist"
          />
        </div>
      </section>
      </>
        )}
      </main>
      <Footer onNav={onNav} />
    </div>
  );
}
