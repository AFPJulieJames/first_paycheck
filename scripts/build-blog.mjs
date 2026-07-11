/* ============================================================
   FIRST PAYCHECK — STATIC BLOG GENERATOR  (zero dependencies)
   Reads posts/*.md (frontmatter + markdown), renders each to a
   static, SEO-optimized HTML page at public/blog/<slug>/index.html
   so Vercel serves them as real, crawlable URLs OUTSIDE the app's
   password gate. Also builds the blog index, sitemap.xml, robots.txt.

   Run automatically before `vite build` (see package.json).
   ============================================================ */

import { readFileSync, readdirSync, mkdirSync, writeFileSync, rmSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const POSTS_DIR = join(ROOT, "posts");
const PAGES_DIR = join(ROOT, "pages");
const OUT_DIR = join(ROOT, "public", "blog");
const PUBLIC_DIR = join(ROOT, "public");

const SITE = "https://firstpaycheck.co";
const BRAND = "First Paycheck";
const TAGLINE = "Legitimate, flexible work-from-home jobs. No experience needed.";
const OG_IMAGE = `${SITE}/og-image.jpg`;

/* E-E-A-T: a real named author + organization publisher with a logo.
   Helps both classic SEO (author/publisher signals) and GEO (AI engines
   prefer clearly-attributed, sourceable content). */
const AUTHOR = { "@type": "Person", name: "Julie James", url: `${SITE}/about` };
const PUBLISHER = {
  "@type": "Organization",
  name: BRAND,
  url: SITE,
  logo: { "@type": "ImageObject", url: OG_IMAGE, width: 1200, height: 630 },
};

/* ---------- tiny helpers ---------- */
const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* inline markdown: links, bold, italic (run on already-escaped text) */
function inline(s) {
  return s
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `<a href="${u}">${t}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
}

/* minimal block markdown -> HTML for the subset used in posts */
function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  const flushPara = (buf) => { if (buf.length) { out.push(`<p>${inline(esc(buf.join(" ")))}</p>`); buf.length = 0; } };
  let para = [];

  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*$/.test(line)) { flushPara(para); i++; continue; }
    let m;
    if ((m = line.match(/^(#{2,3})\s+(.*)$/))) {
      flushPara(para);
      const lvl = m[1].length;
      out.push(`<h${lvl}>${inline(esc(m[2].trim()))}</h${lvl}>`);
      i++; continue;
    }
    if (/^\s*>\s?/.test(line)) {
      flushPara(para);
      const buf = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^\s*>\s?/, "")); i++; }
      out.push(`<blockquote>${inline(esc(buf.join(" ")))}</blockquote>`);
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      flushPara(para);
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*]\s+/, "")); i++; }
      out.push(`<ul>${items.map((it) => `<li>${inline(esc(it))}</li>`).join("")}</ul>`);
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      flushPara(para);
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+\.\s+/, "")); i++; }
      out.push(`<ol>${items.map((it) => `<li>${inline(esc(it))}</li>`).join("")}</ol>`);
      continue;
    }
    para.push(line.trim());
    i++;
  }
  flushPara(para);
  return out.join("\n");
}

/* parse simple "key: value" frontmatter between leading --- fences */
function parse(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: m[2] };
}

/* strip markdown inline syntax down to plain text (for JSON-LD answers) */
function plain(s = "") {
  return s
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1") // links -> text
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1$2") // italic
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/* Extract a FAQ section ("## Frequently asked questions" / "## FAQ") into
   {q,a} pairs so we can emit FAQPage JSON-LD. Each ### is a question; the
   text until the next ### or ## is its answer. Powers rich results + GEO. */
function extractFaq(body) {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  while (i < lines.length && !/^##\s+(frequently asked questions|faqs?)\b/i.test(lines[i])) i++;
  if (i >= lines.length) return [];
  i++; // move past the FAQ heading
  const faqs = [];
  let q = null, ans = [];
  const push = () => { if (q && ans.length) faqs.push({ q, a: plain(ans.join(" ")) }); };
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (/^##\s/.test(line)) break; // next top-level section ends the FAQ
    const m = line.match(/^###\s+(.*)$/);
    if (m) { push(); q = plain(m[1].trim()); ans = []; continue; }
    if (q && line.trim()) ans.push(line.trim());
  }
  push();
  return faqs;
}

/* ---------- shared page chrome ---------- */
const GA = `<!-- Google tag (gtag.js) --><script async src="https://www.googletagmanager.com/gtag/js?id=G-49PQ9QX7Z0"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-49PQ9QX7Z0');</script>`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">`;

const STYLE = `<style>
:root{--ink:#0B1F1C;--cream:#FBF6EF;--creamDim:#EFE7DA;--onLight:#14241F;--dim:#5E7068;--coral:#FF6A3D;--ever:#1F9D6B}
*{box-sizing:border-box}
body{margin:0;background:var(--cream);color:var(--onLight);font-family:Inter,system-ui,sans-serif;line-height:1.7}
a{color:#B5481F}
.wrap{max-width:720px;margin:0 auto;padding:0 24px}
header.site{border-bottom:1px solid var(--creamDim)}
header.site .wrap{max-width:1080px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 24px;flex-wrap:wrap}
header.site nav.sitenav{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
header.site nav.sitenav a{font-size:14px;font-weight:500;text-decoration:none;color:var(--onLight);white-space:nowrap}
header.site nav.sitenav a.navcta{color:#fff;background:linear-gradient(135deg,#FF6A3D,#FF7A59);padding:9px 16px;border-radius:999px}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--onLight)}
.logo .mark{width:24px;height:24px;border-radius:7px;background:linear-gradient(135deg,#FF7A59,#FFB155)}
.logo b{font-family:Fraunces,serif;font-weight:600;font-size:18px}
.kicker{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:2px;color:var(--coral);text-transform:uppercase}
h1{font-family:Fraunces,serif;font-weight:600;font-size:clamp(30px,5vw,46px);line-height:1.08;letter-spacing:-.02em;margin:14px 0 10px}
h2{font-family:Fraunces,serif;font-weight:600;font-size:26px;letter-spacing:-.01em;margin:34px 0 10px}
h3{font-family:Fraunces,serif;font-weight:600;font-size:20px;margin:26px 0 8px}
article p,article li{font-size:17px}
.answer{margin:20px 0 8px;padding:18px 20px;background:#fff;border:1px solid var(--creamDim);border-left:4px solid var(--ever);border-radius:0 12px 12px 0}
.answer .k{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:1.5px;color:var(--ever);text-transform:uppercase;display:block;margin-bottom:6px}
.answer p{margin:0;font-size:17.5px;color:var(--onLight)}
blockquote{margin:18px 0;padding:12px 18px;border-left:4px solid var(--ever);background:#fff;border-radius:0 10px 10px 0;color:var(--onLight)}
.meta{color:var(--dim);font-size:13.5px;font-family:'IBM Plex Mono',monospace}
.cta{margin:36px 0;padding:24px;background:var(--ink);border-radius:16px;color:#F4EFE7}
.cta h3{color:#fff;margin:0 0 8px}
.cta p{color:#9DB3A9;margin:0 0 16px;font-size:15px}
.btn{display:inline-block;background:linear-gradient(135deg,#FF6A3D,#FF7A59);color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px}
.cards{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));margin:24px 0}
.card{display:block;text-decoration:none;color:var(--onLight);background:#fff;border:1px solid var(--creamDim);border-radius:14px;padding:20px}
.card .k{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:1px;color:var(--coral);text-transform:uppercase}
.card h3{margin:8px 0 6px;font-size:19px}
.card p{margin:0;color:var(--dim);font-size:14px}
footer.site{border-top:1px solid var(--creamDim);margin-top:48px}
footer.site .wrap{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;padding:24px;color:var(--dim);font-size:13px}
footer.site b{font-family:Fraunces,serif;color:var(--onLight)}
</style>`;

const header = `<header class="site"><div class="wrap"><a class="logo" href="/"><span class="mark"></span><b>${BRAND}</b></a><nav class="sitenav"><a href="/#reality">Reality Check</a><a href="/#scam">Scam Check</a><a href="/#paths">Paths</a><a href="/#rate">Calculator</a><a href="/#quiz">Quiz</a><a href="/#newsletter">Free Checklist</a><a href="/blog">Blog</a><a class="navcta" href="/#reality">Check a Job</a></nav></div></header>`;
const footerLinks = ["/", "Home", "/blog", "Blog", "/about", "About", "/contact", "Contact", "/privacy", "Privacy", "/terms", "Terms"];
let footerLinksHtml = "";
for (let i = 0; i < footerLinks.length; i += 2) footerLinksHtml += `<a href="${footerLinks[i]}" style="color:var(--dim);text-decoration:none">${footerLinks[i + 1]}</a>`;
const footer = `<footer class="site"><div class="wrap" style="flex-direction:column;align-items:flex-start;gap:10px"><div style="display:flex;gap:18px;flex-wrap:wrap">${footerLinksHtml}</div><span><b>${BRAND}</b> &middot; ${TAGLINE} &middot; firstpaycheck.co</span></div></footer>`;

const ctaBlock = `<div class="cta"><h3>Not sure if an opportunity is real?</h3><p>Run it through the free Reality Check and Scam Smell Test. Honest pay ranges, real scam flags, no hype.</p><a class="btn" href="/">Try the free tools &rarr;</a></div>`;

/* Free Facebook community CTA: converts blog readers into group members. */
const GROUP_URL = "https://www.facebook.com/groups/firstpaycheck";
const communityBlock = `<div style="margin:28px 0;padding:22px 24px;background:#fff;border:1px solid var(--creamDim);border-left:4px solid var(--coral);border-radius:0 14px 14px 0"><div class="kicker">Free community</div><h3 style="margin:6px 0 8px">Join our free Facebook group</h3><p style="margin:0 0 14px;color:var(--dim);font-size:15px">Legit Remote &amp; Work From Home Jobs. Honest job leads, scam alerts, and straight answers. No hype, no MLMs, no fees.</p><a class="btn" href="${GROUP_URL}" target="_blank" rel="noopener">Join the group, free &rarr;</a></div>`;

/* Visible author bio (E-E-A-T): a real, named, photographed author with a
   link to the about page strengthens trust for readers, search ranking, and
   AI-answer citations. */
const authorBox = `<div style="display:flex;gap:16px;align-items:center;margin:36px 0 8px;padding:18px 20px;background:#fff;border:1px solid var(--creamDim);border-radius:14px">
<img src="/julie.jpg" alt="Julie James, founder of ${BRAND}" width="64" height="64" style="width:64px;height:64px;border-radius:50%;object-fit:cover;flex:0 0 auto" loading="lazy">
<div style="font-size:14.5px;color:var(--onLight)"><b style="font-family:Fraunces,serif">Written by Julie James</b><div style="color:var(--dim);margin-top:3px">Founder of ${BRAND}. I research work-from-home jobs and scams so you can tell what's real before you spend a minute or a dollar. <a href="/about">More about me &rarr;</a></div></div>
</div>`;

/* ---------- render one post ---------- */
function renderPost(meta, bodyHtml, related = [], faqs = []) {
  const url = `${SITE}/blog/${meta.slug}`;
  /* A post with `type: review` + `rating:` (+ optional `reviewOf:`) emits
     Review schema with a star rating instead of plain Article schema, so
     "Is X legit?" pages are eligible for rich-result stars. Otherwise it's
     a normal Article. */
  const isReview = (meta.type || "").toLowerCase() === "review" && meta.rating;
  const ld = isReview ? {
    "@context": "https://schema.org", "@type": "Review",
    headline: meta.title, description: meta.description,
    image: OG_IMAGE,
    datePublished: meta.date, dateModified: meta.date,
    author: AUTHOR, publisher: PUBLISHER, mainEntityOfPage: url,
    itemReviewed: { "@type": "Organization", name: meta.reviewOf || meta.title },
    reviewRating: { "@type": "Rating", ratingValue: String(meta.rating), bestRating: "5", worstRating: "1" },
  } : {
    "@context": "https://schema.org", "@type": "Article",
    headline: meta.title, description: meta.description,
    image: OG_IMAGE,
    datePublished: meta.date, dateModified: meta.date,
    author: AUTHOR,
    publisher: PUBLISHER,
    mainEntityOfPage: url,
  };
  const faqLd = faqs.length ? {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question", name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;
  /* AEO: a concise `answer:` up top gives ChatGPT/Perplexity/Google AI a
     clean, extractable direct answer. speakable marks it (plus the H1) for
     voice/answer surfaces. Purely additive — omitted when no answer set. */
  if (meta.answer) {
    ld.speakable = { "@type": "SpeakableSpecification", cssSelector: [".answer", "h1"] };
  }
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
      { "@type": "ListItem", position: 3, name: meta.title, item: url },
    ],
  };
  const relatedHtml = related.length
    ? `<div style="margin:36px 0 8px"><div class="kicker">Keep reading</div><div class="cards">${related.map((r) => `<a class="card" href="/blog/${r.slug}"><span class="k">Guide</span><h3>${esc(r.title)}</h3><p>${esc(r.description)}</p></a>`).join("")}</div></div>`
    : "";
  return `<!doctype html><html lang="en"><head>
${GA}
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(meta.title)} | ${BRAND}</title>
<meta name="description" content="${esc(meta.description)}">
${meta.keywords ? `<meta name="keywords" content="${esc(meta.keywords)}">` : ""}
<link rel="canonical" href="${url}">
<meta property="og:type" content="article"><meta property="og:site_name" content="${BRAND}"><meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}"><meta property="og:url" content="${url}">
<meta property="og:image" content="${OG_IMAGE}"><meta property="article:published_time" content="${esc(meta.date)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(meta.title)}"><meta name="twitter:description" content="${esc(meta.description)}"><meta name="twitter:image" content="${OG_IMAGE}">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
${faqLd ? `<script type="application/ld+json">${JSON.stringify(faqLd)}</script>` : ""}
${FONTS}${STYLE}</head><body>
${header}
<main class="wrap"><article>
<nav style="margin-top:24px;font-size:13px" class="meta"><a href="/" style="color:var(--dim)">Home</a> &rsaquo; <a href="/blog" style="color:var(--dim)">Blog</a></nav>
<h1>${esc(meta.title)}</h1>
<div class="meta">Updated ${esc(meta.date)} &middot; ${BRAND}</div>
${meta.answer ? `<div class="answer"><span class="k">Quick answer</span><p>${inline(esc(meta.answer))}</p></div>` : ""}
<div style="margin-top:22px">${bodyHtml}</div>
${ctaBlock}
${authorBox}
${communityBlock}
${relatedHtml}
</article></main>
${footer}</body></html>`;
}

/* ---------- render the index ---------- */
function renderIndex(posts) {
  const cards = posts.map((p) => `<a class="card" href="/blog/${p.slug}"><span class="k">Guide</span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p></a>`).join("");
  const collectionLd = {
    "@context": "https://schema.org", "@type": "CollectionPage",
    name: `The Honest Work-From-Home Blog | ${BRAND}`,
    description: "Honest, no-hype guides to legitimate work-from-home jobs: what is real, how much you can actually make, and how to spot scams.",
    url: `${SITE}/blog`, isPartOf: { "@type": "WebSite", name: BRAND, url: SITE },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((p, i) => ({
        "@type": "ListItem", position: i + 1,
        url: `${SITE}/blog/${p.slug}`, name: p.title,
      })),
    },
  };
  return `<!doctype html><html lang="en"><head>
${GA}
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>The Honest Work-From-Home Blog | ${BRAND}</title>
<meta name="description" content="Honest, no-hype guides to legitimate work-from-home jobs: what is real, how much you can actually make, and how to spot scams.">
<link rel="canonical" href="${SITE}/blog">
<meta property="og:type" content="website"><meta property="og:site_name" content="${BRAND}">
<meta property="og:title" content="The Honest Work-From-Home Blog | ${BRAND}">
<meta property="og:description" content="Honest guides to legitimate work-from-home income. No hype, real numbers, real scam flags.">
<meta property="og:url" content="${SITE}/blog"><meta property="og:image" content="${OG_IMAGE}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${OG_IMAGE}">
<script type="application/ld+json">${JSON.stringify(collectionLd)}</script>
${FONTS}${STYLE}</head><body>
${header}
<main class="wrap">
<div style="margin-top:40px" class="kicker">The Honest Blog</div>
<h1>Real answers about working from home</h1>
<p style="font-size:18px;color:var(--dim);max-width:560px">No hype, no funnels. Honest guides on what work-from-home paths are legit, how much they actually pay, and how to spot a scam before it costs you.</p>
<div class="cards">${cards}</div>
${ctaBlock}
${communityBlock}
</main>
${footer}</body></html>`;
}

/* ---------- render a static page (about, contact, privacy, terms) ---------- */
function renderPage(meta, bodyHtml) {
  const url = `${SITE}/${meta.slug}`;
  const ld = { "@context": "https://schema.org", "@type": "WebPage", name: meta.title, description: meta.description, url };
  const cta = (meta.slug === "privacy" || meta.slug === "terms") ? "" : ctaBlock + communityBlock;
  return `<!doctype html><html lang="en"><head>
${GA}
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(meta.title)} | ${BRAND}</title>
<meta name="description" content="${esc(meta.description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}"><meta property="og:url" content="${url}">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
${FONTS}${STYLE}</head><body>
${header}
<main class="wrap"><article>
<div style="margin-top:36px" class="kicker">First Paycheck</div>
<h1>${esc(meta.title)}</h1>
<div style="margin-top:22px">${bodyHtml}</div>
${cta}
</article></main>
${footer}</body></html>`;
}

/* ---------- build ---------- */
/* Wipe + rebuild the blog dir. Some sandboxed/mounted filesystems disallow
   unlink; if so, fall back to overwriting in place so the rest of the build
   still runs (the live Vercel build can delete normally). */
if (existsSync(OUT_DIR)) {
  try { rmSync(OUT_DIR, { recursive: true, force: true }); }
  catch (e) { console.warn(`Could not clear ${OUT_DIR} (${e.code}); overwriting in place.`); }
}
mkdirSync(OUT_DIR, { recursive: true });

/* static pages */
const pageMetas = [];
if (existsSync(PAGES_DIR)) {
  for (const f of readdirSync(PAGES_DIR).filter((f) => f.endsWith(".md"))) {
    const { meta, body } = parse(readFileSync(join(PAGES_DIR, f), "utf8"));
    if (!meta.slug || !meta.title) { console.warn(`skip page ${f}: missing slug/title`); continue; }
    const dir = join(PUBLIC_DIR, meta.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), renderPage(meta, mdToHtml(body)));
    pageMetas.push(meta);
  }
}

const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
/* pass 1: parse all so we can build internal "related" links */
const parsedPosts = [];
for (const f of files) {
  const { meta, body } = parse(readFileSync(join(POSTS_DIR, f), "utf8"));
  if (!meta.slug || !meta.title) { console.warn(`skip ${f}: missing slug/title`); continue; }
  parsedPosts.push({ meta, bodyHtml: mdToHtml(body), faqs: extractFaq(body) });
}
/* pass 2: render each with 3 rotating related guides for internal linking */
const posts = parsedPosts.map((x) => x.meta);
parsedPosts.forEach((p, i) => {
  const related = [parsedPosts[(i + 1) % parsedPosts.length], parsedPosts[(i + 2) % parsedPosts.length], parsedPosts[(i + 3) % parsedPosts.length]]
    .filter((r) => r && r.meta.slug !== p.meta.slug)
    .map((r) => r.meta);
  const dir = join(OUT_DIR, p.meta.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), renderPost(p.meta, p.bodyHtml, related, p.faqs));
});
posts.sort((a, b) => (a.date < b.date ? 1 : -1));
writeFileSync(join(OUT_DIR, "index.html"), renderIndex(posts));

/* Emit a tiny data module the React app imports to show a "From the blog"
   section on the homepage (the app is client-rendered and otherwise has no
   knowledge of the static blog). Regenerated every build; safe to commit. */
const recent = posts.slice(0, 6).map((p) => ({ slug: p.slug, title: p.title, description: p.description }));
writeFileSync(
  join(ROOT, "src", "blogData.js"),
  `/* AUTO-GENERATED by scripts/build-blog.mjs. Do not edit by hand. */\nexport const RECENT_POSTS = ${JSON.stringify(recent, null, 2)};\n`
);

/* sitemap + robots */
const today = new Date().toISOString().slice(0, 10);
/* {loc, lastmod, priority} per URL; posts use their own date as lastmod */
const urlEntries = [
  { loc: `${SITE}/`, lastmod: today, priority: "1.0" },
  { loc: `${SITE}/blog`, lastmod: today, priority: "0.9" },
  // Dedicated scam-check landing page (Facebook traffic + "is this a scam" search intent).
  { loc: `${SITE}/is-it-a-scam`, lastmod: today, priority: "0.9" },
  { loc: `${SITE}/partners`, lastmod: today, priority: "0.5" },
  ...pageMetas.map((p) => ({ loc: `${SITE}/${p.slug}`, lastmod: today, priority: "0.4" })),
  ...posts.map((p) => ({ loc: `${SITE}/blog/${p.slug}`, lastmod: p.date || today, priority: "0.7" })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`).join("\n")}\n</urlset>\n`;
writeFileSync(join(PUBLIC_DIR, "sitemap.xml"), sitemap);
writeFileSync(join(PUBLIC_DIR, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`Blog built: ${posts.length} posts, index, sitemap (${urlEntries.length} urls), robots.txt`);
