/**
 * Cloudflare Worker — contact form → Resend email
 *
 * Deploy from dashboard (paste contact.js) or: npx wrangler deploy (from /workers)
 *
 * Variables (wrangler.jsonc / dashboard Variables):
 *   TO_EMAIL        — where leads go
 *   FROM_EMAIL      — optional; default beth.t@example.com
 *
 * Secrets (dashboard Secrets / `wrangler secret put RESEND_API_KEY`):
 *   RESEND_API_KEY  — never put in wrangler.jsonc or git
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed" }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "Invalid JSON" }, 400);
    }

    // Honeypot — bots fill hidden fields; real users leave empty
    if (body.company) {
      return json({ ok: true });
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return json({ ok: false, error: "All fields are required" }, 400);
    }

    if (!isValidEmail(email)) {
      return json({ ok: false, error: "Invalid email" }, 400);
    }

    if (name.length > 200 || email.length > 200 || message.length > 5000) {
      return json({ ok: false, error: "Field too long" }, 400);
    }

    const apiKey = env.RESEND_API_KEY;
    const toEmail = env.TO_EMAIL;

    if (!apiKey || !toEmail) {
      return json({ ok: false, error: "Server not configured" }, 500);
    }

    const fromEmail = env.FROM_EMAIL || "beth.t@example.com";

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Aximatrix <${fromEmail}>`,
        to: [toEmail],
        reply_to: email,
        subject: `New lead from ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          "",
          "Message:",
          message,
        ].join("\n"),
      }),
    });

    if (!resendResponse.ok) {
      const detail = await resendResponse.text();
      console.error("Resend error:", detail);
      return json({ ok: false, error: "Failed to send email" }, 502);
    }

    return json({ ok: true });
  },
};
