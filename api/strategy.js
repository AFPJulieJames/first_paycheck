/* Server-side proxy to the Anthropic API. The key never reaches the browser.
   Public (the tools are free), but guarded so it only answers requests coming
   from our own site, and caps prompt length, to limit abuse of the API key. */

const ALLOWED = [
  "firstpaycheck.co",
  "legitfromhome.com",
  "first-paycheck.vercel.app",
  "localhost",
];

function sameOrigin(req) {
  const ref = req.headers.origin || req.headers.referer || "";
  if (!ref) return false;
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    return ALLOWED.some((d) => host === d || host.endsWith("." + d) || host.endsWith(".vercel.app"));
  } catch (e) {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });
  if (!sameOrigin(req)) return res.status(403).json({ error: "forbidden" });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== "string") return res.status(400).json({ error: "missing prompt" });
  if (prompt.length > 6000) return res.status(400).json({ error: "prompt too long" });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: "model error", detail: data });
    return res.status(200).json(data);
  } catch (e) {
    return res.status(502).json({ error: "model unreachable" });
  }
}
