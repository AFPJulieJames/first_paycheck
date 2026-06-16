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
const OUT_DIR = join(ROOT, "public", "blog");
const PUBLIC_DIR = join(ROOT, "public");

const SITE = "https://firstpaycheck.co";
const BRAND = "First Paycheck";
const TAGLINE = "Legitimate, flexible work-from-home jobs. No experience needed.";

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
header.site .wrap{display:flex;align-items:center;justify-content:space-between;padding:18px 24px}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--onLight)}
.logo .mark{width:24px;height:24px;border-radius:7px;background:linear-gradient(135deg,#FF7A59,#FFB155)}
.logo b{font-family:Fraunces,serif;font-weight:600;font-size:18px}
.kicker{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:2px;color:var(--coral);text-transform:uppercase}
h1{font-family:Fraunces,serif;font-weight:600;font-size:clamp(30px,5vw,46px);line-height:1.08;letter-spacing:-.02em;margin:14px 0 10px}
h2{font-family:Fraunces,serif;font-weight:600;font-size:26px;letter-spacing:-.01em;margin:34px 0 10px}
h3{font-family:Fraunces,serif;font-weight:600;font-size:20px;margin:26px 0 8px}
article p,article li{font-size:17px}
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

const header = `<header class="site"><div class="wrap"><a class="logo" href="/"><span class="mark"></span><b>${BRAND}</b></a><a href="/blog" style="font-size:14px;text-decoration:none;color:var(--dim)">Blog</a></div></header>`;
const footer = `<footer class="site"><div class="wrap"><b>${BRAND}</b><span>${TAGLINE} &middot; firstpaycheck.co</span></div></footer>`;

const ctaBlock = `<div class="cta"><h3>Not sure if an opportunity is real?</h3><p>Run it through the free Reality Check and Scam Smell Test. Honest pay ranges, real scam flags, no hype.</p><a class="btn" href="/">Try the free tools &rarr;</a></div>`;

/* ---------- render one post ---------- */
function renderPost(meta, bodyHtml) {
  const url = `${SITE}/blog/${meta.slug}`;
  const ld = {
    "@context": "https://schema.org", "@type": "Article",
    headline: meta.title, description: meta.description,
    datePublished: meta.date, dateModified: meta.date,
    author: { "@type": "Organization", name: BRAND, url: SITE },
    publisher: { "@type": "Organization", name: BRAND },
    mainEntityOfPage: url,
  };
  return `<!doctype html><html lang="en"><head>
${GA}
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(meta.title)} | ${BRAND}</title>
<meta name="description" content="${esc(meta.description)}">
${meta.keywords ? `<meta name="keywords" content="${esc(meta.keywords)}">` : ""}
<link rel="canonical" href="${url}">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}"><meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
${FONTS}${STYLE}</head><body>
${header}
<main class="wrap"><article>
<div style="margin-top:36px" class="kicker">First Paycheck Guide</div>
<h1>${esc(meta.title)}</h1>
<div class="meta">Updated ${esc(meta.date)} &middot; ${BRAND}</div>
<div style="margin-top:22px">${bodyHtml}</div>
${ctaBlock}
</article></main>
${footer}</body></html>`;
}

/* ---------- render the index ---------- */
function renderIndex(posts) {
  const cards = posts.map((p) => `<a class="card" href="/blog/${p.slug}"><span class="k">Guide</span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p></a>`).join("");
  return `<!doctype html><html lang="en"><head>
${GA}
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>The Honest Work-From-Home Blog | ${BRAND}</title>
<meta name="description" content="Honest, no-hype guides to legitimate work-from-home jobs: what is real, how much you can actually make, and how to spot scams.">
<link rel="canonical" href="${SITE}/blog">
<meta property="og:title" content="The Honest Work-From-Home Blog | ${BRAND}">
<meta property="og:description" content="Honest guides to legitimate work-from-home income. No hype, real numbers, real scam flags.">
<meta property="og:url" content="${SITE}/blog">
${FONTS}${STYLE}</head><body>
${header}
<main class="wrap">
<div style="margin-top:40px" class="kicker">The Honest Blog</div>
<h1>Real answers about working from home</h1>
<p style="font-size:18px;color:var(--dim);max-width:560px">No hype, no funnels. Honest guides on what work-from-home paths are legit, how much they actually pay, and how to spot a scam before it costs you.</p>
<div class="cards">${cards}</div>
${ctaBlock}
</main>
${footer}</body></html>`;
}

/* ---------- build ---------- */
if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
const posts = [];
for (const f of files) {
  const raw = readFileSync(join(POSTS_DIR, f), "utf8");
  const { meta, body } = parse(raw);
  if (!meta.slug || !meta.title) { console.warn(`skip ${f}: missing slug/title`); continue; }
  const html = renderPost(meta, mdToHtml(body));
  const dir = join(OUT_DIR, meta.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
  posts.push(meta);
}
posts.sort((a, b) => (a.date < b.date ? 1 : -1));
writeFileSync(join(OUT_DIR, "index.html"), renderIndex(posts));

/* sitemap + robots */
const urls = [`${SITE}/`, `${SITE}/blog`, ...posts.map((p) => `${SITE}/blog/${p.slug}`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>\n`;
writeFileSync(join(PUBLIC_DIR, "sitemap.xml"), sitemap);
writeFileSync(join(PUBLIC_DIR, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`Blog built: ${posts.length} posts, index, sitemap (${urls.length} urls), robots.txt`);
