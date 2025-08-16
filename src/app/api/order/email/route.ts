import { NextResponse } from "next/server";
import nodemailer from "nodemailer";


// Tip: zet deze ENV-variabelen in .env(.local)
const {
  SMTP_HOST,
  SMTP_PORT = "587",
  SMTP_SECURE = "false",
  SMTP_USER,
  SMTP_PASS,
  ORDER_EMAIL_TO,   // ontvanger (jouw mailbox)
  ORDER_EMAIL_FROM, // afzender (mag gelijk zijn aan SMTP_USER)
} = process.env;

export async function POST(req: Request) {
  try {
    const { customer, items, total, placedAt } = await req.json();

    // -- Basic server-side sanity checks --
    if (!customer?.name || !customer?.phone || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Ongeldige payload" }, { status: 400 });
    }

    // TODO (aanrader): herbereken het totaal server-side op basis van je eigen prijslijst

    // E-mail inhoud
    const lines = items.map((it: any) => {
      const qty = it.qty ?? 1;
      const removed = it.removed?.length ? ` | Weglaten: ${it.removed.join(", ")}` : "";
      const note = it.note ? ` | Opmerking: ${it.note}` : "";
      return `• ${it.name} × ${qty} — € ${(it.price * qty).toFixed(2)}${removed}${note}`;
    });

    const text =
`Nieuwe bestelling via Snaque

Klant: ${customer.name}
Tel.: ${customer.phone}
${customer.note ? `Notitie: ${customer.note}\n` : ""}Datum/tijd: ${placedAt ?? new Date().toISOString()}

Items:
${lines.join("\n")}

Totaal: € ${Number(total).toFixed(2)}
`;

    const html = `
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
        <h2>Nieuwe bestelling via Snaque</h2>
        <p><strong>Klant:</strong> ${escapeHtml(customer.name)}<br/>
           <strong>Tel.:</strong> ${escapeHtml(customer.phone)}<br/>
           ${customer.note ? `<strong>Notitie:</strong> ${escapeHtml(customer.note)}<br/>` : ""}
           <strong>Datum/tijd:</strong> ${placedAt ?? new Date().toISOString()}
        </p>
        <h3>Items</h3>
        <ul>
          ${items.map((it: any) => {
            const qty = it.qty ?? 1;
            const removed = it.removed?.length ? ` | Weglaten: ${it.removed.join(", ")}` : "";
            const note = it.note ? ` | Opmerking: ${escapeHtml(it.note)}` : "";
            return `<li>${escapeHtml(it.name)} × ${qty} — € ${(it.price * qty).toFixed(2)}${removed}${note}</li>`;
          }).join("")}
        </ul>
        <p><strong>Totaal:</strong> € ${Number(total).toFixed(2)}</p>
      </div>
    `;

    // Transport
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_SECURE === "true",
      auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });

    await transporter.sendMail({
      from: ORDER_EMAIL_FROM || SMTP_USER,
      to: ORDER_EMAIL_TO,
      subject: `Nieuwe bestelling — ${customer.name}`,
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Order email error", e);
    return NextResponse.json({ error: "Serverfout bij verzenden" }, { status: 500 });
  }
}

// kleine helper
function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m]!));
}
