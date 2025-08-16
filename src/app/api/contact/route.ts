// app/api/contact/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT = "587",
  SMTP_SECURE = "false",
  SMTP_USER,
  SMTP_PASS,
  CONTACT_EMAIL_TO,
  ORDER_EMAIL_TO,
  CONTACT_EMAIL_FROM,
  ORDER_EMAIL_FROM,
} = process.env;

export async function POST(req: Request) {
  try {
    const { email, message, website } = await req.json();

    // eenvoudige validatie
    if (website) {
      // honeypot gevuld -> waarschijnlijk bot
      return NextResponse.json({ ok: true }, { status: 200 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: "Ongeldig e-mailadres" }, { status: 400 });
    }
    if (!message || String(message).trim().length < 5) {
      return NextResponse.json({ error: "Bericht is te kort" }, { status: 400 });
    }

    const to = CONTACT_EMAIL_TO || ORDER_EMAIL_TO;
    const from = CONTACT_EMAIL_FROM || ORDER_EMAIL_FROM || SMTP_USER;

    if (!to || !from) {
      return NextResponse.json({ error: "Mailconfig ontbreekt (FROM/TO)" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_SECURE === "true", // true = 465, false = 587/STARTTLS
      auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });

    // Optional: tijdens debuggen kan je verify aanzetten
    // await transporter.verify();

    const plain = `Nieuw bericht via contactformulier

Van: ${email}
==============================

${message}
`;

    const html = `
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
        <h2>Nieuw bericht via contactformulier</h2>
        <p><strong>Van:</strong> ${escapeHtml(email)}</p>
        <pre style="white-space:pre-wrap;">${escapeHtml(message)}</pre>
      </div>
    `;

    await transporter.sendMail({
      from: from,          // MOET geverifieerde afzender zijn (Brevo: Sender of geauthenticeerd domein)
      to: to,
      subject: `Contactformulier — ${email}`,
      text: plain,
      html,
      replyTo: email,      // zodat je direct kan antwoorden
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Contact email error:", e);
    return NextResponse.json({ error: "Serverfout bij verzenden" }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m]!));
}
