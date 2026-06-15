# First Paycheck

Legitimate, flexible work-from-home jobs. No experience needed.

First Paycheck is a reality-check and planner for anyone exploring work-from-home income — built to be the honest opposite of MLM and course-funnel hype. It is **not** a course and **not** a job board. It helps someone see whether a path is real, how much they can actually make, and the honest steps to a first paycheck.

Live at [firstpaycheck.co](https://firstpaycheck.co). Traffic/keyword domain: legitfromhome.com.

## What's built

- **Homepage hero** — an animated fluid mesh-gradient landing page with a kinetic headline, trust signals, and a below-the-fold preview of the three core tools. Loads fast (~51 KB gzipped) and runs smoothly on mobile.

## Coming next

- **Reality Check** — type any path or trending fad, get an honest scorecard (legit, real pay range, true cost to start, time to first dollar, scam-risk flags).
- **Scam Smell Test** — paste a pitch or recruiter message, flag MLM/funnel red flags (pay-to-join, recruit-to-earn, upfront fees). FTC-aligned.
- **Real Paths + Worth-It Tracker** — Virtual Assistant, Freelance Writing, Bookkeeping, each with real pay, first steps, where to find legit work, and a tracker that computes your true hourly rate.

## Tech stack

Vite + React, deployed on Vercel with serverless functions. Storage via Supabase. The Claude API key stays server-side.

```
first-paycheck/
  index.html              SEO title + keyword metadata
  package.json, vite.config.js
  src/
    main.jsx
    brand.js              brand kit: palette, fonts, copy
    App.jsx               shared-password login gate
    Hero.jsx              animated fluid hero
    FirstPaycheck.jsx     app shell (hero + below-the-fold)
  api/
    _lib.js               auth: shared-password cookie helpers (fp_auth)
    login.js              POST password -> sets HttpOnly cookie
    session.js            GET -> {authed}
    strategy.js           proxies the Anthropic API (key server-side)
    pipeline.js           synced storage via Supabase (key: fp-pipeline)
```

## Environment variables

Set these in Vercel (Project Settings → Environment Variables). A redeploy is required for changes to take effect. See `.env.example`.

| Variable | Purpose |
|---|---|
| `APP_PASSWORD` | The single password to enter the app |
| `ANTHROPIC_API_KEY` | Claude API key (console.anthropic.com) |
| `ANTHROPIC_MODEL` | Set to `claude-haiku-4-5-20251001` for fast, cheap runtime |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key (server-side only) |

**Supabase note:** First Paycheck uses its own storage key (`fp-pipeline`) in the shared `app_kv` table, so it can safely reuse the existing demo Supabase project without colliding with the demo's data — no separate Supabase project needed. The homepage hero works with no Supabase config at all; the database only matters once data-saving surfaces are live.

One-time table setup (Supabase SQL editor), if not already present:

```sql
create table if not exists app_kv (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);
```

## Local development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
```

## Deploy (Vercel + GitHub)

1. Push this folder to its own GitHub repo. Do **not** commit `node_modules` or `dist` (both are gitignored).
2. Import the repo as a **new** Vercel project. If files land in a subfolder, set the Vercel Root Directory to it — the preset then flips to Vite.
3. Grant Vercel access to the repo (Configure GitHub App → repository access → Save → refresh Vercel).
4. Add the environment variables above, then redeploy.

The hero deploys and renders with no env vars set; add the keys when wiring up the API and pipeline.
