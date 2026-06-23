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

/* Wrap the plain-text result in a simple, branded, email-safe HTML template.
   Inline styles only (email clients strip <style>). Plain text stays the
   fallback for clients that block HTML. */
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function resultHtml(text) {
  /* Pull the known sections out of the plain-text body (markers authored in
     the client's buildResultText) so we can present them like the welcome
     email: result in the card, the one rule in a green callout, the checked
     message in a muted block. Falls back gracefully if a marker is absent. */
  const RULE = "The one rule that beats most scams: ";
  const MSG = "The message you checked:";
  let main = text;
  let rule = "";
  let message = "";
  const mi = main.indexOf(MSG);
  if (mi !== -1) { message = main.slice(mi + MSG.length).trim(); main = main.slice(0, mi).trim(); }
  const ri = main.indexOf(RULE);
  if (ri !== -1) { rule = main.slice(ri + RULE.length).trim(); main = main.slice(0, ri).trim(); }

  const para = (s) => esc(s).split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px;line-height:1.6;font-size:15px;color:#14241F;">${p.replace(/\n/g, "<br>")}</p>`)
    .join("");

  const ruleBox = rule
    ? `<div style="background:#E2F5EC;border:1px solid #9FE1C6;border-radius:12px;padding:16px 18px;margin:6px 0 20px;line-height:1.6;font-size:14.5px;">
        <strong style="color:#14241F;">The one rule that beats most scams:</strong> <span style="color:#14241F;">${esc(rule)}</span>
      </div>` : "";
  const msgBox = message
    ? `<div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#5E7068;margin:24px 0 8px;">The message you checked</div>
       <div style="background:#FBF6EF;border:1px solid #EFE7DA;border-radius:12px;padding:14px 16px;font-size:13.5px;line-height:1.6;color:#5E7068;white-space:pre-wrap;">${esc(message)}</div>` : "";

  return `<!doctype html><html><body style="margin:0;background:#FBF6EF;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <div style="background:#13302B;padding:20px 28px;border-radius:14px 14px 0 0;">
      <span style="font-size:19px;font-weight:bold;color:#FBF6EF;">First Paycheck</span>
    </div>
    <div style="background:#ffffff;border:1px solid #EFE7DA;border-top:none;border-radius:0 0 14px 14px;padding:26px 28px;">
      <div style="font-size:21px;font-weight:bold;color:#0B1F1C;margin:0 0 16px;">Here is your result.</div>
      ${para(main)}
      ${ruleBox}
      <div style="text-align:center;margin:6px 0 4px;">
        <a href="https://firstpaycheck.co" style="display:inline-block;background:#FF6A3D;color:#ffffff;font-weight:bold;font-size:15px;text-decoration:none;padding:13px 28px;border-radius:999px;">Check another message</a>
      </div>
      ${msgBox}
    </div>
    <div style="background:#13302B;border-radius:14px;padding:16px 20px;margin-top:16px;">
      <div style="font-size:15px;font-weight:bold;color:#F4EFE7;">A real job pays you. You never pay it.</div>
      <div style="font-size:13px;color:#9DB3A9;margin-top:6px;">Free, honest work-from-home reality checks at <a href="https://firstpaycheck.co" style="color:#43C9B0;text-decoration:none;">firstpaycheck.co</a></div>
    </div>
    <p style="font-size:12px;color:#5E7068;margin:16px 4px 0;line-height:1.5;">You're getting this because you asked First Paycheck to email your result. We never sell your info.</p>
  </div></body></html>`;
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
        html: resultHtml(text),
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
