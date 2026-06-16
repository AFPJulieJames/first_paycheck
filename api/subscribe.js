/* Public email capture. Appends a subscriber to Supabase table app_kv
   under key 'fp-emails' (one JSON array). Service-role key stays server-side.
   No auth (it is a public newsletter signup), but validates + dedupes and
   stores where the signup came from (homepage, reality-check, etc.).

   Needs SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY env vars (reuse the demo
   Supabase project; this key never mixes with the pipeline). */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const KEY = "fp-emails";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Optional: also push the subscriber to MailerLite so the welcome
   automation (which delivers the scam-checklist) and newsletters can run.
   Stays completely inert until MAILERLITE_API_KEY is set in Vercel.
   Best-effort: a MailerLite hiccup never blocks the Supabase capture. */
const ML_KEY = process.env.MAILERLITE_API_KEY;
const ML_GROUP = process.env.MAILERLITE_GROUP_ID; // optional, triggers the welcome automation

async function forwardToMailerLite(email, source) {
  if (!ML_KEY) return;
  try {
    const body = { email, fields: { source: (source || "site").slice(0, 40) } };
    if (ML_GROUP) body.groups = [ML_GROUP];
    await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: { Authorization: `Bearer ${ML_KEY}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) { /* best effort */ }
}

function headers() {
  return { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" };
}

async function readList() {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/app_kv?key=eq.${KEY}&select=value`, { headers: headers() });
  if (!r.ok) throw new Error("read failed");
  const rows = await r.json();
  return rows.length && rows[0].value ? JSON.parse(rows[0].value) : [];
}

async function writeList(list) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/app_kv?on_conflict=key`, {
    method: "POST",
    headers: { ...headers(), Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ key: KEY, value: JSON.stringify(list), updated_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error("write failed");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });
  if (!SUPABASE_URL || !SERVICE_KEY) return res.status(500).json({ error: "email storage not configured" });

  const { email, source } = req.body || {};
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ error: "Please enter a valid email." });
  }
  const clean = email.trim().toLowerCase();

  try {
    const list = await readList();
    if (!list.some((x) => x.email === clean)) {
      list.push({ email: clean, source: (source || "site").slice(0, 40), at: new Date().toISOString() });
      await writeList(list.slice(0, 100000));
    }
    await forwardToMailerLite(clean, source);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: "Could not save right now. Please try again." });
  }
}
