/* ============================================================
   FIRST PAYCHECK — BRAND KIT  (v1, research-grounded)
   ------------------------------------------------------------
   No brand kit existed, so this is derived from two things:

   1) What the 2026 research says keeps people past 30 seconds:
      - a bold STATEMENT headline (serif reads credible/editorial,
        the opposite of hype-y "boss babe" funnel sans-serifs)
      - a saturated gradient used as LIGHTING, not wallpaper,
        with slow fluid blob motion (never competing with text)
      - kinetic type (headline animates in)
      - visible trust signals, one clear primary CTA
      - fast load + flawless mobile

   2) The product's soul (per handoff): calm, honest, anti-scam,
      warm and premium — NOT pink, NOT pushy, NOT a course funnel.

   Palette logic:
      - Deep evergreen ink base = trust + money/growth + calm,
        and gives the warm gradient something premium to glow against.
      - Warm coral / apricot / soft-rose = the human warmth.
      - One cool aqua anchor stops it from reading "MLM pink".
      - Warm cream surfaces = approachable, premium, easy on the eye.
   ============================================================ */

export const BRAND = {
  name: "First Paycheck",
  domain: "firstpaycheck.co",
  tagline: "Legitimate, flexible work-from-home jobs. No experience needed.",
  // Honest income hook from the handoff (used for the Fliki video too).
  hook: "Your honest path to a $2,000-a-month work-from-home paycheck.",
};

export const C = {
  /* base */
  ink: "#0B1F1C",        // deep evergreen-near-black (page base)
  inkSoft: "#13302B",    // raised dark surface
  cream: "#FBF6EF",      // warm off-white (light content surfaces)
  creamDim: "#EFE7DA",   // muted cream / borders on light

  /* text */
  onDark: "#F4EFE7",     // primary text on dark
  onDarkDim: "#9DB3A9",  // secondary text on dark
  onLight: "#14241F",    // primary text on light
  onLightDim: "#5E7068", // secondary text on light

  /* warm gradient stops (the "lighting") */
  coral: "#FF7A59",
  apricot: "#FFB155",
  rose: "#F58AA0",
  /* cool anchor + trust */
  aqua: "#43C9B0",
  evergreen: "#1F9D6B",  // positive / "this is real" green

  /* primary action */
  cta: "#FF6A3D",
  ctaInk: "#3A1206",

  line: "#284A42",       // hairlines on dark
};

export const FONT = {
  display: "'Fraunces', Georgia, serif",
  body: "'Inter', system-ui, sans-serif",
  mono: "'IBM Plex Mono', monospace",
};

/* High-intent search terms to surface in the UI / metadata (handoff). */
export const KEYWORDS = [
  "legitimate work from home jobs",
  "remote jobs for stay-at-home moms",
  "work from home jobs no experience",
  "flexible remote jobs",
  "virtual assistant jobs",
  "freelance writing jobs",
];
