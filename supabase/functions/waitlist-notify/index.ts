import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFY_EMAIL = "taylor@recontitle.com";

serve(async (req) => {
  try {
    const payload = await req.json();
    const { record } = payload;
    const email = record?.email;

    if (!email) {
      return new Response(JSON.stringify({ error: "No email in payload" }), {
        status: 400,
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: NOTIFY_EMAIL,
        subject: "New Sovrnty waitlist signup",
        html: `<p>New signup: <strong>${email}</strong></p><p>Signed up at ${record.created_at}</p>`,
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
});
