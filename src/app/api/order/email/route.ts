// app/api/order/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT = "587",
  SMTP_SECURE = "false",
  SMTP_USER,
  SMTP_PASS,
  ORDER_EMAIL_TO,
  ORDER_EMAIL_FROM,
} = process.env;

const PASTA_SLOTS = new Set(["11:30", "12:00", "12:30", "13:00"]);
const SIZE_SET = new Set(["small", "medium", "large"]);
const CHEESE_SET = new Set(["met", "zonder"]);

export async function POST(req: Request) {
  try {
    const { customer, items, total, placedAt } = await req.json();

    // Basisvalidatie (bedrijf blijft optioneel)
    if (
      !customer?.name ||
      !customer?.phone ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json({ error: "Ongeldige payload" }, { status: 400 });
    }

    // Validatie voor pasta-items
    for (const it of items) {
      const cat = String(it.category || "").toLowerCase();

      if (cat === "pasta" || cat === "pasta_special") {
        if (!it.timeslot || !PASTA_SLOTS.has(it.timeslot)) {
          return NextResponse.json(
            { error: "Pasta vereist een geldig tijdslot" },
            { status: 400 }
          );
        }
        if (!it.size || !SIZE_SET.has(String(it.size).toLowerCase())) {
          return NextResponse.json(
            { error: "Pasta vereist een maat: small, medium of large" },
            { status: 400 }
          );
        }
        // ✅ Kaas verplicht (met/zonder) voor pasta & pasta_special
        const ch = String(it.cheese || "").toLowerCase();
        if (!CHEESE_SET.has(ch)) {
          return NextResponse.json(
            { error: "Pasta vereist een keuze voor kaas: met of zonder" },
            { status: 400 }
          );
        }
      }

      // Sauzen enkel voor gewone pasta (niet specials)
      if (cat === "pasta") {
        const sauces = Array.isArray(it.sauces) ? it.sauces.filter(Boolean) : [];
        if (sauces.length < 1 || sauces.length > 2) {
          return NextResponse.json(
            { error: "Kies 1 of 2 sauzen voor pasta" },
            { status: 400 }
          );
        }
      }
    }

    // Tekstregels per item
    const lines = items.map((it: any) => {
      const qty = it.qty ?? 1;
      const removed = it.removed?.length ? ` | Weglaten: ${it.removed.join(", ")}` : "";
      const note = it.note ? ` | Opmerking: ${it.note}` : "";
      const cat = String(it.category || "").toLowerCase();
      const isPasta = cat === "pasta"; // sauzen enkel voor gewone pasta

      const slot = it.timeslot ? ` | Timeslot: ${it.timeslot}` : "";
      const size = it.size
        ? ` | Maat: ${String(it.size).toLowerCase().replace(/^./, (c: string) => c.toUpperCase())}`
        : "";
      const sauces =
        isPasta && Array.isArray(it.sauces) && it.sauces.length
          ? ` | Sauzen: ${it.sauces.join(" + ")}`
          : "";
      const bread = it.bread
        ? ` | Brood: ${String(it.bread).toLowerCase() === "bruin" ? "Bruin" : "Wit"}`
        : "";
      const cheese =
        it.cheese && CHEESE_SET.has(String(it.cheese).toLowerCase())
          ? ` | Kaas: ${String(it.cheese).toLowerCase() === "met" ? "met" : "zonder"}`
          : "";

      return `• ${it.name} × ${qty} — € ${(it.price * qty).toFixed(2)}${slot}${size}${sauces}${cheese}${bread}${removed}${note}`;
    });

    // 👇 Nieuw: bedrijfsinfo in plain text
    const isCompany = !!customer.isCompany;
    const companyLine = customer.companyName ? `Bedrijf: ${customer.companyName}\n` : "";
    const companyFlag = `Zakelijk: ${isCompany ? "ja" : "nee"}\n`;

    const text = `Nieuwe bestelling via Snaque

Klant: ${customer.name}
Tel.: ${customer.phone}
${companyFlag}${companyLine}${customer.note ? `Notitie: ${customer.note}\n` : ""}Datum/tijd: ${
      placedAt ?? new Date().toISOString()
    }

Items:
${lines.join("\n")}

Totaal: € ${Number(total).toFixed(2)}
`;

    // 👇 Nieuw: bedrijfsinfo in HTML
    const html = `
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
        <h2>Nieuwe bestelling via Snaque</h2>
        <p>
          <strong>Klant:</strong> ${escapeHtml(customer.name)}<br/>
          <strong>Tel.:</strong> ${escapeHtml(customer.phone)}<br/>
          <strong>Zakelijk:</strong> ${isCompany ? "ja" : "nee"}<br/>
          ${customer.companyName ? `<strong>Bedrijf:</strong> ${escapeHtml(customer.companyName)}<br/>` : ""}
          ${customer.note ? `<strong>Notitie:</strong> ${escapeHtml(customer.note)}<br/>` : ""}
          <strong>Datum/tijd:</strong> ${placedAt ?? new Date().toISOString()}
        </p>
        <h3>Items</h3>
        <ul>
          ${items
            .map((it: any) => {
              const qty = it.qty ?? 1;
              const removed = it.removed?.length ? ` | Weglaten: ${it.removed.join(", ")}` : "";
              const note = it.note ? ` | Opmerking: ${escapeHtml(it.note)}` : "";
              const cat = String(it.category || "").toLowerCase();
              const isPasta = cat === "pasta"; // sauzen enkel voor gewone pasta

              const slot = it.timeslot ? ` | Timeslot: ${it.timeslot}` : "";
              const size = it.size
                ? ` | Maat: ${String(it.size).toLowerCase().replace(/^./, (c) => c.toUpperCase())}`
                : "";
              const sauces =
                isPasta && Array.isArray(it.sauces) && it.sauces.length
                  ? ` | Sauzen: ${it.sauces.join(" + ")}`
                  : "";
              const bread = it.bread
                ? ` | Brood: ${String(it.bread).toLowerCase() === "bruin" ? "Bruin" : "Wit"}`
                : "";
              const cheese =
                it.cheese && CHEESE_SET.has(String(it.cheese).toLowerCase())
                  ? ` | Kaas: ${String(it.cheese).toLowerCase() === "met" ? "met" : "zonder"}`
                  : "";

              const safeName = escapeHtml(it.name);
              const safeRemoved = escapeHtml(removed);
              const safeSlot = escapeHtml(slot);
              const safeSize = escapeHtml(size);
              const safeSauces = escapeHtml(sauces);
              const safeCheese = escapeHtml(cheese);
              const safeBread = escapeHtml(bread);

              return `<li>${safeName} × ${qty} — € ${(it.price * qty).toFixed(2)}${safeSlot}${safeSize}${safeSauces}${safeCheese}${safeBread}${safeRemoved}${note}</li>`;
            })
            .join("")}
        </ul>
        <p><strong>Totaal:</strong> € ${Number(total).toFixed(2)}</p>
      </div>
    `;

    // E-mail transport
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_SECURE === "true",
      auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });

    await transporter.sendMail({
      from: ORDER_EMAIL_FROM || SMTP_USER,
      to: ORDER_EMAIL_TO,
      // 👇 Nieuw: toon bedrijfsnaam in subject indien beschikbaar
      subject: `Nieuwe bestelling — ${customer.name}${
        customer.companyName ? ` (${customer.companyName})` : ""
      }`,
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
  return String(s).replace(
    /[&<>\"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]!)
  );
}
