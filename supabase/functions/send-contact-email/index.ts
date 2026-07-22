// supabase/functions/send-contact-email/index.ts
//
// Receives a contact-form submission and emails it to CONTACT_RECIPIENT_EMAIL
// via Resend, with reply_to set to the visitor's own email so replying goes
// straight to them.
//
// Required secrets (set via Edge Functions -> Secrets in the dashboard):
//   RESEND_API_KEY          - from resend.com dashboard -> API Keys
//   CONTACT_RECIPIENT_EMAIL - the single address Resend is allowed to deliver
//                             to without a verified domain (must be the same
//                             address you verified on the Resend account).
//                             Swap this later by updating the secret,
//                             no code change or redeploy needed.

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const CONTACT_RECIPIENT_EMAIL = Deno.env.get("CONTACT_RECIPIENT_EMAIL");

// Public contact form, no auth required to submit, so allow any origin.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  if (!RESEND_API_KEY || !CONTACT_RECIPIENT_EMAIL) {
    console.error("Missing RESEND_API_KEY or CONTACT_RECIPIENT_EMAIL secret.");
    return jsonResponse({ error: "Contact form is not configured. Please email us directly." }, 500);
  }

  let body: { name?: string; email?: string; subject?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid request body." }, 400);
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const subject = (body.subject ?? "").trim() || "Contact from Website";
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    return jsonResponse({ error: "Name, email, and message are required." }, 400);
  }
  if (name.length > 200 || subject.length > 200) {
    return jsonResponse({ error: "Name/subject is too long." }, 400);
  }
  if (message.length > 5000) {
    return jsonResponse({ error: "Message is too long (5000 character limit)." }, 400);
  }
  if (!isValidEmail(email)) {
    return jsonResponse({ error: "Please provide a valid email address." }, 400);
  }

  const emailText = `New message from the CoE-BIRD website contact form.

Name: ${name}
Email: ${email}

Message:
${message}`;

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "CoE-BIRD Website <onboarding@resend.dev>",
      to: [CONTACT_RECIPIENT_EMAIL],
      reply_to: email,
      subject: `[Website Contact] ${subject}`,
      text: emailText,
    }),
  });

  if (!resendRes.ok) {
    const errText = await resendRes.text();
    console.error("Resend API error:", resendRes.status, errText);
    return jsonResponse({ error: "Failed to send message. Please try again later." }, 502);
  }

  return jsonResponse({ success: true }, 200);
});