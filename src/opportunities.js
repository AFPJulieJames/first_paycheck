/* ============================================================
   LAYER 5 DATA: OPPORTUNITIES & FADS
   The honest scorecard library behind Reality Check.

   Quick-pick chips render these instantly (the demo works with
   no API needed), and they double as grounding examples for the
   AI when someone types a path that isn't on this list.

   Voice rule (handoff): honest pay ranges, never income hype,
   no em dashes. Every number is a figure a careful person would
   defend, not a best case.

   verdict tiers (drive the color + headline):
     "legit"  - real, sustainable income for normal effort
     "real"   - real money exists but it is hard, slow, or saturated
     "hype"   - a few win big, most earn little; sold harder than it pays
     "scam"   - structurally designed to take your money or time
   ============================================================ */

export const VERDICT = {
  legit: { label: "Legit", c: "#1F9D6B", bg: "#E2F5EC", line: "#9FE1C6", blurb: "Real, sustainable work." },
  real:  { label: "Real but hard", c: "#B07A12", bg: "#FBF1DC", line: "#F0CF86", blurb: "Money is real, the climb is steep." },
  hype:  { label: "Mostly hype", c: "#C2410C", bg: "#FBE7DC", line: "#F3BE9C", blurb: "A few win big. Most earn little." },
  scam:  { label: "Likely a scam", c: "#B91C1C", bg: "#FBE3E3", line: "#F0AEAE", blurb: "Built to take your money or time." },
};

/* saturation: 1 = wide open, 5 = brutally crowded */
export const OPPORTUNITIES = [
  {
    id: "va",
    name: "Virtual Assistant",
    aka: ["VA", "virtual assistant", "online assistant"],
    verdict: "legit",
    pay: "$18 to $35/hr starting; $40k to $60k full-time",
    startCost: "$0 to $50",
    asksUpfront: false,
    timeToFirstDollar: "2 to 6 weeks",
    saturation: 3,
    flags: [],
    greens: [
      "Real demand, especially AI-augmented VAs",
      "No degree or certification required to start",
      "Legit platforms: Belay, Boldly, Time Etc, The Mom Project",
    ],
    summary:
      "The strongest on-ramp in 2026. Businesses pay steadily for inbox, scheduling, and admin help. Start on a real platform, skip anyone charging you to join.",
  },
  {
    id: "writing",
    name: "Freelance Writing",
    aka: ["freelance writing", "writer", "copywriting", "content writing"],
    verdict: "legit",
    pay: "$25 to $75/hr; $0.05 to $0.30/word as you build",
    startCost: "$0",
    asksUpfront: false,
    timeToFirstDollar: "3 to 8 weeks",
    saturation: 4,
    flags: ["Content mills pay pennies; avoid as anything but a sample-builder"],
    greens: ["Portfolio beats credentials", "Repeat clients create stable income"],
    summary:
      "Real and durable once you have samples and a niche. The first few clients are the hard part. Avoid the per-word mills except to build a portfolio.",
  },
  {
    id: "bookkeeping",
    name: "Bookkeeping",
    aka: ["bookkeeping", "bookkeeper", "virtual bookkeeper"],
    verdict: "legit",
    pay: "$25 to $50/hr; $40k to $65k full-time",
    startCost: "$0 to $400 (optional training)",
    asksUpfront: false,
    timeToFirstDollar: "1 to 3 months",
    saturation: 2,
    flags: ["Paid certifications help but are not required to start"],
    greens: ["Recurring monthly clients = predictable income", "Low competition vs. writing"],
    summary:
      "Quietly one of the best. Small businesses always need it, clients stay for years, and you do not need to be a CPA. Free QuickBooks/Xero training gets you going.",
  },
  {
    id: "tutoring",
    name: "Online Tutoring",
    aka: ["online tutoring", "tutor", "teaching online"],
    verdict: "legit",
    pay: "$15 to $40/hr",
    startCost: "$0",
    asksUpfront: false,
    timeToFirstDollar: "1 to 4 weeks",
    saturation: 3,
    flags: ["Some platforms require a degree or take a large cut"],
    greens: ["Fast to start if you know a subject", "Flexible around school hours"],
    summary:
      "A real, fast on-ramp if you can teach a subject or a language. Pay is modest but steady, and the hours fit around kids well.",
  },
  {
    id: "ugc",
    name: "UGC Creator",
    aka: ["ugc", "ugc creator", "user generated content"],
    verdict: "hype",
    pay: "$0 to $300 per video; very uneven",
    startCost: "$0 (your phone)",
    asksUpfront: false,
    timeToFirstDollar: "1 to 6 months, if at all",
    saturation: 5,
    flags: [
      "Anyone selling a paid 'UGC course' is usually the one making money",
      "Most creators land few or no paid brand deals",
    ],
    greens: ["Genuinely $0 to try", "A real income for a small minority"],
    summary:
      "Making short brand videos is a real thing brands pay for, but the market is flooded and most people earn little. Free to try; ignore the paid courses promising fast money.",
  },
  {
    id: "ai-agency",
    name: "AI Automation Agency",
    aka: ["ai automation agency", "ai agency", "automation agency"],
    verdict: "hype",
    pay: "Wide: $0 to $10k/mo for the few who can actually deliver",
    startCost: "Often pitched with a $500 to $5,000 'program'",
    asksUpfront: true,
    timeToFirstDollar: "Months; requires real skills + sales",
    saturation: 4,
    flags: [
      "Heavily promoted by people selling the course, not running the agency",
      "Requires real technical and sales skill the pitch downplays",
      "Upfront 'program' fee is the top scam signal",
    ],
    greens: ["The underlying skill (automation) is genuinely valuable"],
    summary:
      "Building automations for businesses is real work with real value, but the 'start an AI agency' pitch is mostly a course funnel. If someone wants money upfront to teach you, walk.",
  },
  {
    id: "pod",
    name: "Print-on-Demand",
    aka: ["print on demand", "pod", "print-on-demand", "tshirt business"],
    verdict: "hype",
    pay: "Usually under $200/mo; a tiny fraction scale",
    startCost: "$0 to $50",
    asksUpfront: false,
    timeToFirstDollar: "Often never; months for the few who hit",
    saturation: 5,
    flags: ["Extreme competition", "Design + marketing skill matters more than the pitch admits"],
    greens: ["Low cost to try", "No inventory risk"],
    summary:
      "Selling designs on shirts and mugs is legit and cheap to try, but the market is brutally saturated. Treat it as a long-shot side experiment, not income you can count on.",
  },
  {
    id: "faceless-yt",
    name: "Faceless YouTube",
    aka: ["faceless youtube", "youtube automation", "cash cow channel"],
    verdict: "hype",
    pay: "$0 for most; ad revenue needs scale + time",
    startCost: "$0, or a pitched 'automation course'",
    asksUpfront: true,
    timeToFirstDollar: "6 to 18 months, if monetized at all",
    saturation: 5,
    flags: [
      "'YouTube automation' courses are a common funnel",
      "Monetization requires 1,000 subs + 4,000 watch hours first",
    ],
    greens: ["Real creators do earn from it eventually"],
    summary:
      "Running faceless channels can earn ad money, but it takes many months to qualify for monetization and most channels never do. The paid 'automation' courses are the real business.",
  },
  {
    id: "fba",
    name: "Amazon FBA",
    aka: ["amazon fba", "fba", "amazon selling"],
    verdict: "real",
    pay: "Real but variable; many lose money in year one",
    startCost: "$2,000 to $10,000+ in inventory",
    asksUpfront: true,
    timeToFirstDollar: "3 to 9 months",
    saturation: 4,
    flags: [
      "Large real capital at risk, not a 'no money down' play",
      "FBA 'mentorship' programs costing thousands are often the scam",
    ],
    greens: ["A real business model with real winners"],
    summary:
      "Selling on Amazon is a legitimate business, but it needs real upfront capital and carries real risk. The danger is the expensive coaching programs, not Amazon itself.",
  },
  {
    id: "data-entry",
    name: '"No Experience" Data Entry',
    aka: ["data entry", "data entry from home", "typing jobs"],
    verdict: "scam",
    pay: "Real roles pay $12 to $18/hr; 'easy' ones pay nothing",
    startCost: "Legit: $0. Scam: a 'starter kit' or fee",
    asksUpfront: true,
    timeToFirstDollar: "Legit roles exist; ad-bait ones never pay",
    saturation: 4,
    flags: [
      "Any data-entry 'job' with a starter-kit fee is a scam",
      "Promises of high pay for no skill are bait",
    ],
    greens: ["Legitimate data-entry roles do exist on real job boards"],
    summary:
      "Real data-entry jobs exist and pay modestly. The flood of 'no experience, $30/hr typing' ads are scams, especially any that ask you to pay for a kit or training.",
  },
  {
    id: "reshipping",
    name: "Reshipping / Package Forwarding",
    aka: ["reshipping", "package forwarding", "quality control inspector"],
    verdict: "scam",
    pay: "None. You become a mule and are never paid",
    startCost: "$0, but you carry the legal risk",
    asksUpfront: false,
    timeToFirstDollar: "Never",
    saturation: 1,
    flags: [
      "You receive and reship packages bought with stolen cards",
      "Can make you part of a crime; paychecks bounce",
    ],
    greens: [],
    summary:
      "A flat-out scam. You reship goods bought with stolen cards and are never paid, while exposing yourself to fraud charges. Never accept a 'job' that mails you packages to forward.",
  },
  {
    id: "envelope",
    name: "Envelope Stuffing",
    aka: ["envelope stuffing", "stuff envelopes", "assembly work from home"],
    verdict: "scam",
    pay: "None. The only earner is whoever recruited you",
    startCost: "A 'registration' or 'materials' fee",
    asksUpfront: true,
    timeToFirstDollar: "Never",
    saturation: 1,
    flags: ["Pay-to-join", "You earn only by recruiting the next person", "Decades-old classic scam"],
    greens: [],
    summary:
      "One of the oldest scams there is. You pay a fee, then get told to recruit others to 'stuff envelopes' too. No real product, no real pay. Walk away.",
  },
];

/* Find a seed opportunity by fuzzy name/alias match. */
export function matchOpportunity(query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  for (const o of OPPORTUNITIES) {
    if (o.name.toLowerCase() === q) return o;
    if (o.aka.some((a) => a.toLowerCase() === q)) return o;
  }
  for (const o of OPPORTUNITIES) {
    const hay = (o.name + " " + o.aka.join(" ")).toLowerCase();
    if (hay.includes(q) || q.includes(o.id)) return o;
  }
  return null;
}

/* Chips shown on the Reality Check landing, in a deliberate order:
   a couple of safe wins, then the fads people are anxious about. */
export const FEATURED = ["va", "bookkeeping", "ugc", "ai-agency", "fba", "faceless-yt", "data-entry", "reshipping"];
