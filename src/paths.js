/* ============================================================
   LAYER 5 DATA: WORK-FROM-HOME PATHS
   The "now do it" layer. Three honest starter paths, each a
   cartridge with: what it is, real pay, checkable first steps,
   where to find legit work, an anti-scam watch-out, and an offer
   bank reframed as "what you'd offer a client."

   Voice rule (handoff): plain warm language, honest pay ranges,
   never income hype, no em dashes.

   platform tags: "easy" (easiest to start) | "steady" (ongoing,
   higher bar) | "volume" (lots of listings, more competition)
   ============================================================ */

export const PLATFORM_TAGS = {
  easy:   { label: "Easy start", c: "#1F9D6B", bg: "#E2F5EC" },
  steady: { label: "Steady work", c: "#185FA5", bg: "#E6F1FB" },
  volume: { label: "High volume", c: "#B07A12", bg: "#FBF1DC" },
};

export const PATHS = [
  {
    id: "va",
    name: "Virtual Assistant",
    tagline: "Help busy businesses with admin, on your schedule.",
    whatItIs:
      "You take everyday tasks off a business owner's plate: inbox, scheduling, data entry, travel, follow-ups. No degree needed, and it is the fastest way most people land their first work-from-home paycheck. If you are organized and reliable, you can start now.",
    pay: { start: "$18 to $35/hr", month: "$800 to $2,500 part-time", first: "2 to 6 weeks" },
    steps: [
      "List the admin tasks you are already good at (inbox, scheduling, data entry).",
      "Write a simple one-page list of the services you will offer.",
      "Make a free profile on a legit platform (The Mom Project, HireMyMom, Belay).",
      "Apply to or pitch 5 businesses this week.",
      "Land one client, do great work, and ask for a short testimonial.",
    ],
    platforms: [
      { name: "The Mom Project", tag: "easy", note: "Flexible, family-friendly roles." },
      { name: "HireMyMom", tag: "easy", note: "Built for moms returning to work." },
      { name: "Time Etc", tag: "easy", note: "Structured way to get your first clients." },
      { name: "Belay", tag: "steady", note: "Higher-paying ongoing roles, a bit more vetting." },
      { name: "Boldly", tag: "steady", note: "Premium long-term placements." },
      { name: "Upwork", tag: "volume", note: "Tons of listings, more competition. Good for samples." },
    ],
    watchOut:
      "Any 'VA agency' that charges you a fee to join or get matched is not legit. Real platforms pay you, never the other way around.",
    offers: [
      { label: "Inbox & calendar", text: "Keep your inbox at zero and your calendar booked. I handle email triage, scheduling, and reminders so you focus on the work only you can do." },
      { label: "Admin & launch support", text: "Day-to-day admin for a busy founder: data entry, travel booking, file organization, and follow-ups, all handled." },
    ],
  },
  {
    id: "writing",
    name: "Freelance Writing",
    tagline: "Get paid to write, from home, around your life.",
    whatItIs:
      "Businesses and blogs constantly need words: articles, emails, web copy. If you can write clearly, you can build this into real income. The first few clients are the hard part, but once you have samples and a niche, repeat work follows.",
    pay: { start: "$25 to $75/hr", month: "$500 to $2,500 part-time", first: "3 to 8 weeks" },
    steps: [
      "Pick a niche you know well (parenting, finance, health, small business).",
      "Write 2 or 3 sample pieces that show your style.",
      "Put your samples somewhere shareable (a Google Doc or simple site).",
      "Pitch or apply to 5 writing gigs this week.",
      "Deliver great work, then ask for a referral or repeat work.",
    ],
    platforms: [
      { name: "Superpath community", tag: "easy", note: "Content marketing community with a job board." },
      { name: "ProBlogger Job Board", tag: "steady", note: "Quality ongoing writing gigs." },
      { name: "Contently", tag: "steady", note: "Connects writers with brand clients." },
      { name: "Upwork", tag: "volume", note: "High volume of listings, great for early samples." },
    ],
    watchOut:
      "Content mills that pay a few cents per word will burn you out for almost nothing. Use them only to build a sample or two, never as your real income.",
    offers: [
      { label: "Monthly blog package", text: "Four well-researched, SEO-friendly blog posts a month in your brand voice, ready to publish." },
      { label: "Email newsletter", text: "A weekly newsletter your audience actually opens, written and scheduled for you." },
    ],
  },
  {
    id: "bookkeeping",
    name: "Bookkeeping",
    tagline: "Steady, recurring income helping small businesses.",
    whatItIs:
      "Every small business needs its books kept clean, and most owners hate doing it. You do not need to be a CPA. With free software training and good attention to detail, you can build a roster of monthly clients who stay for years. Quietly one of the most stable work-from-home paths.",
    pay: { start: "$25 to $50/hr", month: "$1,000 to $3,000 part-time", first: "1 to 3 months" },
    steps: [
      "Learn the basics with free QuickBooks or Xero training.",
      "Practice categorizing transactions on a sample set of books.",
      "Offer to do the books for one business you know, even at a starter rate.",
      "Get comfortable with the monthly close and a simple profit-and-loss report.",
      "Ask that first client for a testimonial and a referral.",
    ],
    platforms: [
      { name: "Local businesses & referrals", tag: "easy", note: "Your first client is often someone you already know." },
      { name: "QuickBooks Live", tag: "steady", note: "Remote bookkeeping roles with training." },
      { name: "Belay", tag: "steady", note: "Places bookkeepers with vetted clients." },
      { name: "Upwork", tag: "volume", note: "Many listings; good for building a track record." },
    ],
    watchOut:
      "Skip the expensive 'bookkeeping certification' courses that promise guaranteed clients. You can start with free software training and one real client.",
    offers: [
      { label: "Monthly bookkeeping", text: "Clean, categorized books every month plus a simple profit-and-loss report, so you always know where you stand." },
      { label: "Catch-up bookkeeping", text: "Behind on your books? I will get months of backlog cleaned up and bring everything current." },
    ],
  },
];
