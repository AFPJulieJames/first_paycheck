import React, { useEffect, useRef } from "react";
import { C, FONT, BRAND } from "./brand.js";
import Hero from "./Hero.jsx";

/* The three core surfaces, in the order the search data says people want them
   (handoff 5b): gauge it -> pick a real path -> prove it pays. These are
   preview cards for now; each becomes a full surface next session. */
const SURFACES = [
  {
    tag: "01 · GAUGE IT",
    title: "Reality Check",
    body: "Type any work-from-home path or trending fad — UGC, AI agency, print-on-demand, a course someone's pitching. Get an honest scorecard: is it legit, real pay range, true cost to start, time to first dollar, and scam-risk flags.",
    chip: "Answers “is it real” + “how much”",
    accent: C.coral,
  },
  {
    tag: "02 · STAY SAFE",
    title: "Scam Smell Test",
    body: "Paste the pitch or recruiter message you got. It flags the MLM and funnel red flags — pay-to-join, recruit-to-earn, check overpayment, vague “system,” upfront fees — and tells you plainly whether to walk away.",
    chip: "FTC-aligned, the #1 anxiety question",
    accent: C.rose,
  },
  {
    tag: "03 · NOW DO IT",
    title: "Real Paths + Worth-It Tracker",
    body: "Start with Virtual Assistant, Freelance Writing, or Bookkeeping. Each shows real pay, first steps to a paycheck, and where to find legit work. Then the worth-it tracker does the math the scam world never makes you do: your true hourly rate.",
    chip: "Virtual Assistant · Writing · Bookkeeping",
    accent: C.aqua,
  },
];

function SurfaceCard({ s, i }) {
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
  return (
    <div
      ref={ref}
      style={{
        background: "#fff", borderRadius: 18, padding: "26px 24px",
        border: `1px solid ${C.creamDim}`, boxShadow: "0 8px 30px rgba(11,31,28,0.06)",
        opacity: 0, transform: "translateY(22px)",
        transition: `opacity .7s ease ${i * 0.1}s, transform .7s ease ${i * 0.1}s`,
        display: "flex", flexDirection: "column", gap: 10,
      }}
    >
      <span style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.5, color: s.accent, fontWeight: 500 }}>
        {s.tag}
      </span>
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
    </div>
  );
}

export default function FirstPaycheck() {
  const toolsRef = useRef(null);
  const scrollToTools = () => toolsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div style={{ background: C.cream, fontFamily: FONT.body, color: C.onLight }}>
      <Hero onStart={scrollToTools} onPaths={scrollToTools} />

      {/* BELOW THE FOLD — warm, calm, scroll payoff */}
      <section ref={toolsRef} style={{ padding: "84px 24px 40px", maxWidth: 1100, margin: "0 auto" }}>
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
            First Paycheck isn't a course or a job board. It's a reality-check and planner:
            see what's real, see the real numbers, and get the honest steps — so you never
            pay to chase someone else's hype.
          </p>
        </div>

        <div style={{
          display: "grid", gap: 18,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}>
          {SURFACES.map((s, i) => <SurfaceCard key={s.title} s={s} i={i} />)}
        </div>

        <div style={{
          marginTop: 26, textAlign: "center", fontFamily: FONT.mono, fontSize: 11.5,
          letterSpacing: 0.5, color: C.onLightDim,
        }}>
          These three surfaces come online next. The homepage is live now.
        </div>
      </section>

      {/* footer */}
      <footer style={{
        borderTop: `1px solid ${C.creamDim}`, padding: "26px 24px",
        maxWidth: 1100, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
      }}>
        <span style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 16, color: C.onLight }}>
          First Paycheck
        </span>
        <span style={{ fontSize: 12.5, color: C.onLightDim }}>
          {BRAND.tagline} · firstpaycheck.co
        </span>
      </footer>
    </div>
  );
}
