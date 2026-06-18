/* Emails a tool result to the user AND captures their email.

   Two jobs, in this order:
   1) Capture: store the email in Supabase ('fp-emails') and forward to
      MailerLite (so the welcome automation + newsletter run), exactly like
      /api/subscribe. The capture never fails just because email sending does.
   2) Send: deliver the user's actual result via Resend (transactional email).

   Stays HONEST and inert until RESEND_API_KEY is set: if it is missing, the
   email is still captured and we return emailed:false so the UI can tell the
   truth instead of claiming a result was sent. The frontend only shows the
   "email me my result" option when VITE_EMAIL_RESULTS is on, so users are
   never promised an email the backend cannot send.

   Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (capture, same as subscribe),
        MAILERLITE_API_KEY, MAILERLITE_GROUP_ID (optional, newsletter),
        RESEND_API_KEY (sending), RESULT_FROM (optional from address). */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const KEY = "fp-emails";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ML_KEY = process.env.MAILERLITE_API_KEY;
const ML_GROUP = process.env.MAILERLITE_GROUP_ID;
const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESULT_FROM || "First Paycheck <hello@firstpaycheck.co>";

function sbHeaders() {
  return { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" };
}

async function readList() {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/app_kv?key=eq.${KEY}&select=value`, { headers: sbHeaders() });
  if (!r.ok) throw new Error("read failed");
  const rows = await r.json();
  return rows.length && rows[0].value ? JSON.parse(rows[0].value) : [];
}

async function writeList(list) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/app_kv?on_conflict=key`, {
    method: "POST",
    headers: { ...sbHeaders(), Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ key: KEY, value: JSON.stringify(list), updated_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error("write failed");
}

async function forwardToMailerLite(email, source) {
  if (!ML_KEY) return;
  try {
    const body = { email, fields: { source: (source || "result").slice(0, 40) } };
    if (ML_GROUP) body.groups = [ML_GROUP];
    await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: { Authorization: `Bearer ${ML_KEY}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) { /* best effort */ }
}

/* Send the result via Resend. Returns true only if it actually went out. */
async function sendResult(email, subject, text) {
  if (!RESEND_KEY) return false;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [email],
        subject: (subject || "Your First Paycheck result").slice(0, 180),
        text: text,
      }),
    });
    return r.ok;
  } catch (e) {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });
  if (!SUPABASE_URL || !SERVICE_KEY) return res.status(500).json({ error: "email storage not configured" });

  const { email, source, subject, body } = req.body || {};
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ error: "Please enter a valid email." });
  }
  if (typeof body !== "string" || body.trim().length < 10) {
    return res.status(400).json({ error: "Nothing to send yet." });
  }
  const clean = email.trim().toLowerCase();
  const text = body.slice(0, 20000);

  try {
    // 1) Capture first, so the email is never lost.
    const list = await readList();
    if (!list.some((x) => x.email === clean)) {
      list.push({ email: clean, source: (source || "result").slice(0, 40), at: new Date().toISOString() });
      await writeList(list.slice(0, 100000));
    }
    await forwardToMailerLite(clean, source);

    // 2) Then try to send the result. Capture stands even if this is off/fails.
    const emailed = await sendResult(clean, subject, text);

    return res.status(200).json({ ok: true, subscribed: true, emailed });
  } catch (e) {
    return res.status(502).json({ error: "Could not save right now. Please try again." });
  }
}
