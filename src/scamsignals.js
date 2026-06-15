/* ============================================================
   SCAM SMELL TEST — RED-FLAG RULE ENGINE
   Deterministic, FTC-aligned detection that runs entirely in the
   browser. No API needed, so it is fast and always works. Each
   category carries patterns, a severity, and a plain explanation
   of why it is a warning sign.

   The number-one rule, per the FTC: a real job pays YOU. If you
   are asked to pay to start, that is the loudest signal there is.

   Voice rule (handoff): plain, honest, no hype, no em dashes.
   ============================================================ */

export const SMELL_VERDICT = {
  high:    { label: "Walk away", c: "#B91C1C", bg: "#FBE3E3", line: "#F0AEAE", blurb: "Strong scam signals. Do not pay or share details." },
  caution: { label: "Be careful", c: "#B07A12", bg: "#FBF1DC", line: "#F0CF86", blurb: "Some warning signs. Verify before you commit." },
  clean:   { label: "No major red flags", c: "#1F9D6B", bg: "#E2F5EC", line: "#9FE1C6", blurb: "Nothing obvious tripped, but stay alert." },
};

/* severity weights drive the verdict */
const SEV = { high: 3, med: 2, low: 1 };

export const SIGNALS = [
  {
    id: "upfront",
    label: "Asks you to pay upfront",
    severity: "high",
    why: "The #1 FTC red flag. A legitimate job pays you. Fees for a 'starter kit', training, software, or a 'spot' almost always mean a scam.",
    patterns: [
      "starter kit", "start-up fee", "startup fee", "registration fee", "activation fee",
      "small investment", "one-time fee", "onboarding fee", "pay to (join|start|begin)",
      "buy the kit", "training fee", "deposit to (start|begin|secure)", "refundable deposit",
      "cost to get started", "enrollment fee",
    ],
  },
  {
    id: "recruit",
    label: "Earn by recruiting others",
    severity: "high",
    why: "Income that comes from signing up other people (a downline) instead of selling a real product is the core of an MLM or pyramid scheme.",
    patterns: [
      "recruit", "downline", "your team grows", "build your team", "sign up others",
      "bring (people|others) in", "commission(s)? (on|from) (your|each) (recruits|sign ?ups|referrals)",
      "get (3|three|5|five) friends", "duplicate (the )?system", "residual income from your team",
    ],
  },
  {
    id: "incomehype",
    label: "Unrealistic income claims",
    severity: "high",
    why: "Specific big numbers with little work ('$5k a week from your phone') are bait. Honest opportunities give ranges and admit it takes time.",
    patterns: [
      "\\$\\s?\\d{3,}(k| ?,?\\d{3})?\\s*(\\/|per|a)\\s*(day|week)",
      "make \\$?\\d+ ?k", "financial freedom", "fire your boss", "quit your (job|9 ?to ?5|9-5)",
      "be your own boss", "passive income", "easy money", "guaranteed income",
      "earn while you sleep", "six figures? (fast|quickly|in months)", "unlimited (income|earning)",
    ],
  },
  {
    id: "overpay",
    label: "Overpayment or odd payment method",
    severity: "high",
    why: "Being sent a check to deposit then asked to send part back is classic fraud. So is being paid or asked to pay in gift cards, wire, or crypto.",
    patterns: [
      "send (back|us) the (difference|remainder|extra)", "deposit (the |this )?check",
      "cashier'?s check", "gift card", "wire( the| us)? (money|funds)", "western union",
      "money ?gram", "zelle", "cash ?app", "bitcoin", "crypto", "usdt", "venmo",
      "overpay", "we will reimburse",
    ],
  },
  {
    id: "vague",
    label: "Vague 'system' with no real product",
    severity: "med",
    why: "If they cannot plainly say what you would do or sell, and lean on a 'proven system', 'secret method', or 'blueprint', there is usually nothing real underneath.",
    patterns: [
      "proven system", "secret (method|formula|sauce)", "blueprint", "plug ?and ?play",
      "done ?for ?you", "automated income", "the system does the work", "copy ?paste (this )?(system|method)",
      "no skills? (needed|required|necessary)", "anyone can do (this|it)",
    ],
  },
  {
    id: "urgency",
    label: "Pressure and false urgency",
    severity: "med",
    why: "Real employers do not rush you. 'Only a few spots', 'today only', and 'message me ASAP' are designed to stop you from thinking it through.",
    patterns: [
      "limited spots", "only \\d+ spots", "act now", "today only", "spots? (are )?filling",
      "don'?t miss (out|this)", "first come first serve", "asap", "right away", "before it'?s gone",
      "closing soon", "last chance",
    ],
  },
  {
    id: "offplatform",
    label: "Pushes you off-platform fast",
    severity: "med",
    why: "Being moved immediately to WhatsApp, Telegram, or a personal DM, or hired with no interview, is how scammers avoid oversight.",
    patterns: [
      "whats ?app", "telegram", "dm me", "message me on", "text me at", "hit me up",
      "no interview", "hired on the spot", "start immediately, just",
    ],
  },
  {
    id: "info",
    label: "Wants sensitive info early",
    severity: "high",
    why: "Bank login, full SSN, or a photo of your ID before any real hiring step is an identity-theft setup. Real onboarding asks for this after an offer, through secure systems.",
    patterns: [
      "bank (login|details|account number)", "routing number", "social security number",
      "ssn", "photo of your id", "copy of your (id|license|passport)", "credit card to verify",
      "verify (your )?identity by (paying|sending)",
    ],
  },
  {
    id: "reship",
    label: "Reshipping or 'package handling'",
    severity: "high",
    why: "Receiving packages and reshipping them, or processing payments through your own account, makes you a money or goods mule. It is a crime even if you did not know.",
    patterns: [
      "reship", "re-ship", "package (handling|forwarding|processing|inspector)",
      "receive packages", "forward (the )?packages", "process payments through your",
      "quality control inspector", "mystery shopper", "secret shopper",
    ],
  },
];

/* Scan text, return triggered signals with the exact phrases matched. */
export function scanMessage(text) {
  const lower = (text || "").toLowerCase();
  const triggered = [];
  const matchedPhrases = [];

  for (const sig of SIGNALS) {
    let hit = false;
    for (const p of sig.patterns) {
      const re = new RegExp(p, "gi");
      let m;
      while ((m = re.exec(lower)) !== null) {
        hit = true;
        if (m[0] && m[0].trim().length > 1) matchedPhrases.push(m[0]);
        if (m.index === re.lastIndex) re.lastIndex++;
      }
    }
    if (hit) triggered.push(sig);
  }

  const hasHigh = triggered.some((s) => s.severity === "high");
  const score = triggered.reduce((sum, s) => sum + SEV[s.severity], 0);

  let verdict = "clean";
  if (hasHigh || score >= 4) verdict = "high";
  else if (triggered.length >= 1) verdict = "caution";

  return { verdict, triggered, matchedPhrases, score };
}

/* Paste-in examples so the demo lands in one click. */
export const SAMPLES = [
  {
    label: "MLM recruiter DM",
    text: "Hey girl! I saw your profile and you'd be PERFECT for my team! I work from home and make $5k a week just from my phone. Be your own boss and fire your 9-5! There's a small startup fee to get your kit, but you make it back fast by signing up others. Only a few spots left on my team - DM me on WhatsApp ASAP!",
  },
  {
    label: "Check overpayment 'job'",
    text: "Congratulations, you are hired as a remote administrative assistant, no interview needed! We will mail you a cashier's check for your first week plus equipment funds. Deposit the check, keep your pay, and wire the remaining balance back to our vendor to order your laptop. Start immediately.",
  },
  {
    label: "Legit-looking VA offer",
    text: "Hi, thanks for applying to the virtual assistant role. We'd love to schedule a 30-minute interview this week. The role is 15 hours/week at $22/hour, handling inbox and scheduling for our small marketing team. We use Belay for contracts and payment. Let me know what times work for you.",
  },
];
