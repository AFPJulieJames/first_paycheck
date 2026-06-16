/* Public usage counters for honest social proof. Stored as one JSON row in
   Supabase app_kv under key 'fp-stats': { checks, scams, paths }.
   GET returns the counts. POST { event } increments one (check|scam|path),
   guarded to same-origin to limit tampering. Degrades to zeros if Supabase
   is not configured. */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const KEY = "fp-stats";
const ZERO = { checks: 0, scams: 0, paths: 0 };
const ALLOWED = ["firstpaycheck.co", "legitfromhome.com", "first-paycheck.vercel.app", "localhost"];

function sameOrigin(req) {
  const ref = req.headers.origin || req.headers.referer || "";
  if (!ref) return false;
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    return ALLOWED.some((d) => host === d || host.endsWith("." + d) || host.endsWith(".vercel.app"));
  } catch (e) { return false; }
}
function headers() {
  return { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" };
}
async function read() {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/app_kv?key=eq.${KEY}&select=value`, { headers: headers() });
  if (!r.ok) throw new Error("read failed");
  const rows = await r.json();
  return rows.length && rows[0].value ? { ...ZERO, ...JSON.parse(rows[0].value) } : { ...ZERO };
}
async function write(val) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/app_kv?on_conflict=key`, {
    method: "POST",
    headers: { ...headers(), Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ key: KEY, value: JSON.stringify(val), updated_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error("write failed");
}

export default async function handler(req, res) {
  if (!SUPABASE_URL || !SERVICE_KEY) return res.status(200).json({ ...ZERO });

  if (req.method === "GET") {
    try { return res.status(200).json(await read()); }
    catch (e) { return res.status(200).json({ ...ZERO }); }
  }
  if (req.method === "POST") {
    if (!sameOrigin(req)) return res.status(403).json({ error: "forbidden" });
    const map = { check: "checks", scam: "scams", path: "paths" };
    const field = map[(req.body || {}).event];
    if (!field) return res.status(400).json({ error: "bad event" });
    try {
      const cur = await read();
      cur[field] = (cur[field] || 0) + 1;
      await write(cur);
      return res.status(200).json(cur);
    } catch (e) { return res.status(200).json({ ...ZERO }); }
  }
  return res.status(405).json({ error: "method not allowed" });
}
