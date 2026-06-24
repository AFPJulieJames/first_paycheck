/* ============================================================
   LAYER 5 DATA: WORK-FROM-HOME PATHS
   The "now do it" layer. Honest starter paths, each a cartridge.

   Research-backed fields competitors leave out:
   - legit:    an honest verdict, so even a custom path is gauged.
   - fitIf / skipIf: anti-hype self-selection (beginners chase the
                "perfect" hustle instead of committing to one).
   - firstWeek: a realistic rhythm. Everyone says "treat it like a
                part-time job," nobody hands you the schedule. We do.

   Voice rule (handoff): plain warm language, honest pay ranges,
   never income hype, no em dashes.

   platform tags: "easy" | "steady" | "volume"
   ============================================================ */

export const PLATFORM_TAGS = {
  easy:   { label: "Easy start", c: "#1F9D6B", bg: "#E2F5EC" },
  steady: { label: "Steady work", c: "#185FA5", bg: "#E6F1FB" },
  volume: { label: "High volume", c: "#B07A12", bg: "#FBF1DC" },
};

export const PATH_LEGIT = {
  legit:   { label: "Legit path", c: "#1F9D6B", bg: "#E2F5EC", line: "#9FE1C6" },
  caution: { label: "Real but be careful", c: "#B07A12", bg: "#FBF1DC", line: "#F0CF86" },
  scam:    { label: "Mostly a trap", c: "#B91C1C", bg: "#FBE3E3", line: "#F0AEAE" },
};

/* Where platform links point. These are the normal sites for now; swap each
   value for your affiliate/referral link as you get accepted into programs.
   Only legit platforms ever go here. Unknown/generated platforms fall back
   to a search. */
export const PLATFORM_URLS = {
  "The Mom Project": "https://themomproject.com",
  "HireMyMom": "https://www.hiremymom.com",
  "Time Etc": "https://www.timeetc.com",
  "Belay": "https://belaysolutions.com",
  "Boldly": "https://boldly.com",
  "Upwork": "https://www.upwork.com",
  "Superpath community": "https://www.superpath.co",
  "ProBlogger Job Board": "https://problogger.com/jobs",
  "Contently": "https://contently.com",
  "QuickBooks Live": "https://quickbooks.intuit.com/live",
  "We Work Remotely": "https://weworkremotely.com",
  "Indeed": "https://www.indeed.com",
  "ModSquad": "https://join.modsquad.com",
  "Working Solutions": "https://www.workingsolutions.com",
  "Rev": "https://www.rev.com/freelancers",
  "GoTranscript": "https://gotranscript.com/transcription-jobs",
  "TranscribeMe": "https://www.transcribeme.com/careers",
  "DataAnnotation": "https://www.dataannotation.tech",
  "LXT": "https://www.lxt.ai/careers",
  "RWS TrainAI": "https://www.rws.com/artificial-intelligence/train-ai-data-services/",
  "LinkedIn": "https://www.linkedin.com/jobs",
  "Fiverr": "https://www.fiverr.com",
  "Etsy": "https://www.etsy.com/sell",
  "Teachers Pay Teachers": "https://www.teacherspayteachers.com/Sell-on-TpT",
  "Gumroad": "https://gumroad.com",
};

/* One transparent line, shown wherever we link out. Keeps us honest. */
export const AFFILIATE_DISCLOSURE =
  "Some links may be partner links. If you sign up, we may earn a small commission at no cost to you. We only ever point to legitimate platforms, never pay-to-join schemes.";

export const PATHS = [
  {
    id: "va",
    name: "Virtual Assistant",
    tagline: "Help busy businesses with admin, on your schedule.",
    legit: "legit",
    whatItIs:
      "You take everyday tasks off a business owner's plate: inbox, scheduling, data entry, travel, follow-ups. No degree needed, and it is the fastest way most people land their first work-from-home paycheck. If you are organized and reliable, you can start now.",
    pay: { start: "$18 to $35/hr", month: "$800 to $2,500 part-time", first: "2 to 6 weeks" },
    fitIf: "You are organized, reliable, and like bringing order to other people's chaos.",
    skipIf: "You need money this week with zero back-and-forth. First clients take a few weeks.",
    firstWeek: [
      "Day 1 (about 1 hour): write your one-page list of services.",
      "Day 2 to 3 (30 min each): set up one platform profile and save 5 listings.",
      "Day 4 to 5 (1 hour): send all 5 applications or pitches. Done beats perfect.",
      "Weekend: rest. Check for replies once, then close the laptop.",
    ],
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
    legit: "legit",
    whatItIs:
      "Businesses and blogs constantly need words: articles, emails, web copy. If you can write clearly, you can build this into real income. The first few clients are the hard part, but once you have samples and a niche, repeat work follows.",
    pay: { start: "$25 to $75/hr", month: "$500 to $2,500 part-time", first: "3 to 8 weeks" },
    fitIf: "You can write clearly and enjoy explaining things. A niche you already know is a head start.",
    skipIf: "You dislike writing or need income immediately. Samples and first clients take time.",
    firstWeek: [
      "Day 1 (1 hour): pick one niche you actually know.",
      "Day 2 to 4 (1 hour each): write two short sample pieces.",
      "Day 5 (45 min): put samples in a Google Doc and apply to 5 gigs.",
      "Weekend: note which pitches felt right, refine one.",
    ],
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
    legit: "legit",
    whatItIs:
      "Every small business needs its books kept clean, and most owners hate doing it. You do not need to be a CPA. With free software training and good attention to detail, you can build a roster of monthly clients who stay for years. Quietly one of the most stable work-from-home paths.",
    pay: { start: "$25 to $50/hr", month: "$1,000 to $3,000 part-time", first: "1 to 3 months" },
    fitIf: "You are detail-oriented, like tidy numbers, and want steady recurring clients.",
    skipIf: "Numbers stress you out, or you need cash this week. The ramp is 1 to 3 months.",
    firstWeek: [
      "Day 1 to 2 (1 hour each): start free QuickBooks or Xero training.",
      "Day 3 to 4 (1 hour): practice categorizing a sample month of transactions.",
      "Day 5 (30 min): list 5 small businesses you could offer to help.",
      "Weekend: reach out to one of them, even casually.",
    ],
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
  {
    id: "support",
    name: "Customer Support",
    tagline: "Help customers by chat or email, on a real paycheck.",
    legit: "legit",
    whatItIs:
      "You answer customer questions for a company by live chat, email, or phone: tracking orders, fixing logins, sorting billing. It is one of the fastest ways to get hired with no experience, and unlike freelancing, a company pays you a steady hourly wage from day one.",
    pay: { start: "$15 to $20/hr", month: "$1,200 to $2,800 part-time", first: "1 to 3 weeks" },
    fitIf: "You are patient, write clearly, and would rather have a steady employer than chase your own clients.",
    skipIf: "You want to set your own hours and rates. These are scheduled shifts for a company.",
    firstWeek: [
      "Day 1 (1 hour): polish a simple resume that highlights communication and reliability.",
      "Day 2 to 3 (30 min each): set up profiles on 2 remote job boards and save 5 chat or email roles.",
      "Day 4 to 5 (1 hour): apply to all 5. Many of these roles hire quickly.",
      "Weekend: rest, then check for replies once.",
    ],
    steps: [
      "Write a short resume that highlights clear writing and dependability.",
      "Decide if you want non-phone work (chat and email) or are open to phone roles.",
      "Apply to 5 remote support roles on legit boards this week.",
      "Prepare for a quick typing test or a short interview.",
      "Start your first shift and keep your answers friendly and clear.",
    ],
    platforms: [
      { name: "We Work Remotely", tag: "steady", note: "Established remote roles, including support." },
      { name: "Indeed", tag: "volume", note: "Many chat and email support listings daily." },
      { name: "ModSquad", tag: "steady", note: "Flexible chat, email, and moderation projects." },
      { name: "Working Solutions", tag: "steady", note: "Contract customer support from home." },
    ],
    watchOut:
      "If a support job asks you to buy a starter kit or pay for training, it is a scam. Real employers pay you, never the other way around.",
    offers: [
      { label: "Live chat coverage", text: "Friendly, fast answers to your customers by live chat, so no question sits waiting." },
      { label: "Email & ticket support", text: "I clear your support inbox daily, sorting and answering tickets so customers feel looked after." },
    ],
  },
  {
    id: "transcription",
    name: "Transcription",
    tagline: "Turn audio into text, on your own schedule.",
    legit: "legit",
    whatItIs:
      "You listen to audio and type out what you hear: interviews, videos, meetings. No degree needed, just careful ears and steady typing. The work is flexible and you pick up files when you want, which makes it a popular first paycheck for fast typers.",
    pay: { start: "$0.40 to $0.75 per audio minute", month: "$300 to $1,500 part-time", first: "1 to 3 weeks" },
    fitIf: "You type quickly and accurately, have a good ear, and want to work whenever it suits you.",
    skipIf: "You type slowly or dislike repetitive focus work. Early pay per hour can be low while you build speed.",
    firstWeek: [
      "Day 1 (1 hour): test your typing speed and aim for 60+ words per minute.",
      "Day 2 to 3 (1 hour each): practice with a free audio clip.",
      "Day 4 (30 min): apply to 2 beginner-friendly transcription platforms.",
      "Day 5: take their short qualification test.",
    ],
    steps: [
      "Check and build your typing speed and accuracy.",
      "Practice transcribing a few short, clear audio clips.",
      "Apply to beginner platforms like Rev, GoTranscript, or TranscribeMe.",
      "Pass the qualification test (most let you retry).",
      "Start with shorter, clearer files and build speed before harder audio.",
    ],
    platforms: [
      { name: "Rev", tag: "easy", note: "Well-known starting point with steady files." },
      { name: "GoTranscript", tag: "easy", note: "Beginner friendly, with frequent work." },
      { name: "TranscribeMe", tag: "steady", note: "Clearer audio and decent per-minute rates." },
      { name: "Upwork", tag: "volume", note: "Direct clients once you have a sample or two." },
    ],
    watchOut:
      "Avoid any transcription site that charges a fee to take the test or to unlock work. The real ones are free to join.",
    offers: [
      { label: "Interview transcripts", text: "Clean, accurate transcripts of your interviews and calls, formatted and ready to use." },
      { label: "Video captions", text: "Accurate captions and transcripts for your videos, so they are searchable and accessible." },
    ],
  },
  {
    id: "annotation",
    name: "Data Annotation",
    tagline: "Help train AI, one small task at a time.",
    legit: "legit",
    whatItIs:
      "You label the data that teaches AI models: tagging images, rating answers, checking text. No coding or degree needed, just careful attention and the patience to follow detailed instructions. It is one of the newer, faster-growing first paychecks online.",
    pay: { start: "$15 to $20/hr", month: "$600 to $2,000 part-time", first: "1 to 4 weeks" },
    fitIf: "You are detail-oriented, comfortable working solo, and happy to follow clear instructions closely.",
    skipIf: "You want guaranteed steady hours. Projects come and go, so income can be uneven.",
    firstWeek: [
      "Day 1 (30 min): sign up at one or two reputable platforms.",
      "Day 2 to 3 (1 to 3 hours): complete the unpaid qualification assessment carefully.",
      "Day 4 to 5: accept your first small paid tasks and read every instruction twice.",
      "Weekend: note which task types pay best per hour.",
    ],
    steps: [
      "Sign up at a reputable platform (DataAnnotation, LXT, RWS TrainAI).",
      "Pass the unpaid assessment, which can take one to three hours.",
      "Start with small tasks and follow the guidelines exactly.",
      "Favor projects that pay a guaranteed hourly rate over per-task gigs.",
      "Build a track record so better-paying projects open up.",
    ],
    platforms: [
      { name: "DataAnnotation", tag: "easy", note: "Common starting point, often hourly pay." },
      { name: "LXT", tag: "steady", note: "Established AI data company with varied projects." },
      { name: "RWS TrainAI", tag: "steady", note: "Ongoing AI training and data work." },
      { name: "Upwork", tag: "volume", note: "Direct data and AI tasks once you have experience." },
    ],
    watchOut:
      "Skip any site that asks you to pay to start or promises big AI passive income. Per-task work can also dip below minimum wage, so prioritize hourly projects.",
    offers: [
      { label: "Image labeling", text: "Carefully tagged images and data, ready to train your model with consistent, accurate labels." },
      { label: "AI output review", text: "I check and rate your AI's responses for accuracy, so the model keeps improving." },
    ],
  },
  {
    id: "smm",
    name: "Social Media Management",
    tagline: "Run the social accounts busy businesses do not have time for.",
    legit: "legit",
    whatItIs:
      "You plan, write, and schedule posts for a business so their social media stays active without them lifting a finger. No degree needed. It is one of the fastest-growing remote roles, and most owners know they need it but cannot keep up themselves.",
    pay: { start: "$20 to $50/hr", month: "$1,000 to $3,000 part-time", first: "3 to 8 weeks" },
    fitIf: "You are organized, enjoy writing short posts, and like the mix of creative and steady client work.",
    skipIf: "You want a fixed paycheck with no client management, or you dislike being online much.",
    firstWeek: [
      "Day 1 (1 hour): pick one or two platforms you actually use and understand.",
      "Day 2 to 3 (1 hour each): make a simple sample, a week of posts for a pretend or real local business.",
      "Day 4 to 5 (1 hour): offer your services to 5 small businesses you know or follow.",
      "Weekend: rest, then check for replies once.",
    ],
    steps: [
      "Choose one or two platforms to specialize in at first.",
      "Build a sample: a week of posts for a business you admire.",
      "Write a simple one-page list of what you will handle (posts, scheduling, replies).",
      "Offer to manage social for one local business, even at a starter rate.",
      "Do great work for a month, then ask for a testimonial and a referral.",
    ],
    platforms: [
      { name: "Local businesses & referrals", tag: "easy", note: "Your first client is often someone you already know." },
      { name: "LinkedIn", tag: "steady", note: "Small businesses post social media roles here." },
      { name: "Upwork", tag: "volume", note: "Lots of listings; good for early samples and reviews." },
      { name: "We Work Remotely", tag: "steady", note: "Established remote marketing and social roles." },
    ],
    watchOut:
      "Skip any paid 'start a social media agency' course that promises fast five-figure months. The work is real; that pitch is the funnel. You can start free with one client.",
    offers: [
      { label: "Monthly social package", text: "A month of planned, written, and scheduled posts in your brand voice, so your accounts stay active without you." },
      { label: "Account growth & replies", text: "I post consistently and answer comments and DMs, so your audience grows and feels heard." },
    ],
  },
  {
    id: "video-editing",
    name: "Video Editing",
    tagline: "Turn raw clips into sharp videos creators pay for.",
    legit: "legit",
    whatItIs:
      "You take someone's raw footage and cut it into clean, watchable videos: YouTube uploads, short-form reels, course lessons. Demand from creators and small businesses keeps climbing. The skill takes practice, but you can learn it with free tools and no degree.",
    pay: { start: "$20 to $60/hr", month: "$800 to $3,000 part-time", first: "3 to 8 weeks" },
    fitIf: "You are patient, detail-oriented, and enjoy the satisfying craft of making something look polished.",
    skipIf: "You want income this week or dislike sitting and fiddling with details for stretches at a time.",
    firstWeek: [
      "Day 1 (1 hour): pick a free or low-cost editor (CapCut, DaVinci Resolve) and install it.",
      "Day 2 to 4 (1 to 2 hours each): edit two short practice videos to build a small reel.",
      "Day 5 (45 min): post your reel and message 5 creators offering to edit a video.",
      "Weekend: note which style of editing you enjoyed most and lean into it.",
    ],
    steps: [
      "Pick one free or affordable editing tool and learn the basics.",
      "Edit two or three short sample videos to show your style.",
      "Put your samples in a simple reel or shared folder.",
      "Reach out to 5 creators or businesses offering to edit one video.",
      "Deliver fast, reliable edits, then turn that client into repeat work.",
    ],
    platforms: [
      { name: "Local businesses & referrals", tag: "easy", note: "Creators you already follow may need an editor." },
      { name: "Upwork", tag: "volume", note: "Steady stream of editing gigs; great for first reviews." },
      { name: "Fiverr", tag: "volume", note: "Buyers search for editors; good for building a track record." },
      { name: "We Work Remotely", tag: "steady", note: "Ongoing video roles with companies and studios." },
    ],
    watchOut:
      "Basic, cheap edits face heavy global competition. Niche down (short-form reels, a specific industry) so you compete on skill, not on being the lowest price.",
    offers: [
      { label: "Short-form reels", text: "Scroll-stopping reels and shorts from your long videos, captioned and ready to post." },
      { label: "YouTube editing", text: "Your raw footage cut into a clean, paced YouTube video, so you just film and hand it off." },
    ],
  },
  {
    id: "pinterest-manager",
    name: "Pinterest Manager",
    tagline: "Help bloggers and shops get found on Pinterest.",
    legit: "legit",
    whatItIs:
      "You run Pinterest for bloggers and online shops: designing pins, writing keyword descriptions, and scheduling them so their content gets found. It is a quieter, lower-competition corner of social media work, with recurring monthly clients and flexible, batch-friendly hours.",
    pay: { start: "$25 to $50/hr", month: "$600 to $2,000 part-time", first: "1 to 3 months" },
    fitIf: "You like light design, keywords, and steady behind-the-scenes work more than being on camera.",
    skipIf: "You need clients this week. The pool is smaller, so the first few take a little longer to find.",
    firstWeek: [
      "Day 1 (1 hour): learn how Pinterest search and keywords work (it is a search engine, not a feed).",
      "Day 2 to 3 (1 hour each): design 5 sample pins in a free tool like Canva.",
      "Day 4 to 5 (1 hour): reach out to 5 bloggers or Etsy shops offering to manage their Pinterest.",
      "Weekend: save examples of pins you think work well, and why.",
    ],
    steps: [
      "Learn Pinterest basics: keyword search, fresh pins, and scheduling.",
      "Design 5 sample pins to show your eye and your keyword skill.",
      "Write a one-page offer: pins designed, descriptions written, and scheduled each month.",
      "Pitch 5 bloggers or online shops who clearly use Pinterest.",
      "Land one retainer, show growth in saves and clicks, then ask for a referral.",
    ],
    platforms: [
      { name: "Blogger & shop outreach", tag: "easy", note: "Bloggers and Etsy sellers are your core clients; reach out directly." },
      { name: "Local businesses & referrals", tag: "easy", note: "Word of mouth lands the first retainer fast." },
      { name: "Upwork", tag: "volume", note: "Search 'Pinterest' listings; good for early reviews." },
    ],
    watchOut:
      "Be wary of paid 'Pinterest manager' courses that promise quick full-time income. The work is real and learnable for free; the smaller client pool just means honest expectations.",
    offers: [
      { label: "Monthly pin design", text: "Fresh, keyword-optimized pins designed and scheduled every month, so your traffic grows while you focus on your business." },
      { label: "Pinterest setup & cleanup", text: "I set up or refresh your boards and keywords so your existing content finally gets found." },
    ],
  },
  {
    id: "digital-products",
    name: "Digital Products & Printables",
    tagline: "Make a useful download once, sell it again and again.",
    legit: "caution",
    whatItIs:
      "You create digital files people buy and download: printables, planners, templates, or teaching resources, then sell them on marketplaces like Etsy or Teachers Pay Teachers. It is real and cheap to start, but the marketplaces are crowded, so income usually builds slowly rather than overnight.",
    pay: { start: "Most under $200/mo at first", month: "$200 to $1,500 as your shop grows", first: "Often a few months" },
    fitIf: "You like making things, can be patient, and want something that keeps earning after the work is done.",
    skipIf: "You need money this month. This is a slow build, not a fast paycheck, and many shops earn little.",
    firstWeek: [
      "Day 1 (1 hour): pick one specific buyer and problem (busy teachers, new moms, small shops).",
      "Day 2 to 4 (1 to 2 hours each): make 3 to 5 simple products in a free tool like Canva.",
      "Day 5 (1 hour): open a free shop and list your first product with keyword-rich titles.",
      "Weekend: list one more and note which idea you are most excited to expand.",
    ],
    steps: [
      "Choose a specific niche and the person you are making for.",
      "Create 3 to 5 useful, well-designed digital products.",
      "Open a shop on Etsy or Teachers Pay Teachers (free to start).",
      "Write keyword-rich titles and descriptions so buyers can find you.",
      "Add new products regularly and lean into whatever starts selling.",
    ],
    platforms: [
      { name: "Etsy", tag: "volume", note: "Huge built-in audience for printables and templates." },
      { name: "Teachers Pay Teachers", tag: "steady", note: "The go-to marketplace for teaching resources." },
      { name: "Gumroad", tag: "steady", note: "Sell from your own page and keep more of each sale." },
    ],
    watchOut:
      "The danger here is not the work, it is the 'passive printables income' courses that oversell it. You can start free. Expect a slow build, and treat fast-money promises as the red flag.",
    offers: [
      { label: "Printable bundle", text: "A themed set of ready-to-print planners or worksheets your buyers can download instantly." },
      { label: "Custom templates", text: "Editable templates (social posts, planners, resumes) people can personalize and reuse." },
    ],
  },
];

/* Build the prompt that turns any typed job into a path in this exact shape. */
export function pathPrompt(query) {
  const example = PATHS[0];
  return `You are an honest, anti-scam work-from-home guide for First Paycheck. A user wants a real starter plan for: "${query}".
Build it the way a caring friend who has actually done this work would, for the United States in 2026. Never hype income. Use realistic ranges. If the thing is mostly a scam, an MLM, or a course funnel, say so plainly and set legit to "scam" or "caution".

Respond with ONLY valid JSON, no markdown fences, no preamble, exactly this shape:
{"name":"clean display name","tagline":"one short sentence","legit":"legit | caution | scam","whatItIs":"2 to 3 plain sentences on what the work actually is","pay":{"start":"starting hourly or per-job range","month":"realistic part-time monthly range","first":"realistic time to first dollar"},"fitIf":"who this genuinely fits, one sentence","skipIf":"who should skip it, one sentence","firstWeek":["3 to 4 realistic time-boxed steps that fit around a busy life"],"steps":["4 to 6 concrete first steps to a paycheck"],"platforms":[{"name":"real place to find work","tag":"easy | steady | volume","note":"short honest note"}],"watchOut":"the main scam or pitfall to avoid, one or two sentences","offers":[{"label":"2 to 4 word offer name","text":"one sentence a beginner could actually pitch a client"}]}

Rules: every string under 40 words. No em dashes. 3 to 5 platforms. 2 offers. Be concrete and honest. Match this tone and shape: ${JSON.stringify({ name: example.name, legit: example.legit, pay: example.pay, fitIf: example.fitIf })}`;
}
