"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { readCart, clearCart, countItems } from "@/lib/cart";
import type { CartItem } from "@/lib/cart";

const SLOT_VALUES = ["11:30", "12:00", "12:30", "13:00"] as const;
const SIZE_VALUES = ["small", "medium", "large"] as const;

function isPasta(it: CartItem) {
  const cat = (it as any)?.category;
  return typeof cat === "string" && cat.toLowerCase() === "pasta";
}
function hasTimeslot(it: CartItem) {
  const s = (it as any)?.timeslot;
  return !!s && (SLOT_VALUES as readonly string[]).includes(s);
}
function hasSize(it: CartItem) {
  const sz = String((it as any)?.size || "").toLowerCase();
  return (SIZE_VALUES as readonly string[]).includes(sz);
}
function saucesArray(it: CartItem): string[] {
  const arr = (it as any)?.sauces;
  return Array.isArray(arr) ? arr.filter(Boolean) : [];
}
function cap(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
function cheeseLabel(it: CartItem) {
  const ch = String((it as any)?.cheese || "").toLowerCase();
  return ch === "met" ? "met" : ch === "zonder" ? "zonder" : "";
}

export default function Order() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // ▶️ NIEUW: bedrijfsbestelling + (optionele) bedrijfsnaam
  const [isCompany, setIsCompany] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setItems(readCart()), []);

  const fmt = (n: number) =>
    new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(n);

  const total = useMemo(
    () => items.reduce((s, it) => s + it.price * (it.qty ?? 1), 0),
    [items]
  );

  // Validatie blijft ongewijzigd: bedrijfsnaam is optioneel, ook bij bedrijfsbestelling
  const valid =
    name.trim().length >= 2 &&
    /^[0-9 +().-]{8,}$/.test(phone.trim()) &&
    items.length > 0;

  async function submit() {
    setError(null);
    setSending(true);
    try {
      const baseCustomer = {
        name: name.trim(),
        phone: phone.trim(),
        ...(isCompany ? { isCompany: true } : {}),
        ...(companyName.trim() ? { companyName: companyName.trim() } : {}),
      };

      const res = await fetch("/api/order/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: baseCustomer, // opmerking weggelaten
          items,
          total,
          placedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Kon bestelling niet versturen");
      clearCart();
      setDone(true);
    } catch (e: any) {
      setError(e.message ?? "Er ging iets mis");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <main className="isolate mx-auto max-w-3xl px-4 py-6 md:py-10 text-slate-100">
        <section className="rounded-3xl border border-white/10 ring-1 ring-black/20 shadow-xl bg-white/5 backdrop-blur">
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-semibold" style={{ color: "#f4f5d3" }}>
              Bedankt!
            </h1>
            <p className="mt-2 text-slate-300">
              Je bestelling is verstuurd. We nemen contact op via jouw telefoonnummer.
            </p>
            <div className="mt-5 flex gap-2">
              <button className="btn-ghost" onClick={() => router.push("/broodjes")}>
                Verder bestellen
              </button>
              <button className="btn-ghost" onClick={() => router.push("/")}>
                Terug naar home
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="isolate mx-auto max-w-4xl px-4 py-6 md:py-10 text-slate-100">
      <section className="rounded-3xl border border-white/10 ring-1 ring-black/20 shadow-xl bg-white/5 backdrop-blur">
        <div className="p-6 md:p-8">
          <header className="mb-6">
            <h1
              className="text-3xl md:text-4xl font-semibold tracking-tight"
              style={{ color: "#f4f5d3" }}
            >
              Bestellen
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Vul je gegevens in en bevestig je bestelling.
            </p>
            <div className="mt-4 h-1 w-full rounded-full bg-gradient-to-r from-[#f4f5d3]/40 via-transparent to-transparent" />
          </header>

          {/* Bestellingsoverzicht */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
            <h2 className="text-lg font-semibold">Jouw bestelling</h2>
            {items.length === 0 ? (
              <p className="mt-2 text-slate-400">Je winkelmandje is leeg.</p>
            ) : (
              <ul className="mt-3 divide-y divide-white/10">
                {items.map((it) => {
                  const pasta = isPasta(it);
                  const sauces = saucesArray(it);
                  const cheese = cheeseLabel(it);
                  return (
                    <li key={it.addedAt} className="py-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium">
                          {it.name} {it.qty && it.qty > 1 ? `× ${it.qty}` : ""}
                        </p>

                        {/* badges/extra info */}
                        <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                          {(it as any).bread && (
                            <span className="inline-flex items-center rounded-md bg-white/5 text-slate-200 ring-1 ring-white/10 px-2 py-0.5 font-medium">
                              Brood: {String((it as any).bread).toLowerCase() === "bruin" ? "Bruin" : "Wit"}
                            </span>
                          )}

                          {pasta && hasTimeslot(it) && (
                            <span className="inline-flex items-center rounded-md bg-white/5 text-slate-200 ring-1 ring-white/10 px-2 py-0.5 font-medium">
                              Timeslot: {(it as any).timeslot}
                            </span>
                          )}
                          {pasta && hasSize(it) && (
                            <span className="inline-flex items-center rounded-md bg-white/5 text-slate-200 ring-1 ring-white/10 px-2 py-0.5 font-medium">
                              Maat: {cap(String((it as any).size))}
                            </span>
                          )}
                          {pasta && sauces.length > 0 && (
                            <span className="inline-flex items-center rounded-md bg-white/5 text-slate-200 ring-1 ring-white/10 px-2 py-0.5 font-medium">
                              Sauzen: {sauces.join(" + ")}
                            </span>
                          )}
                          {pasta && cheese && (
                            <span className="inline-flex items-center rounded-md bg-white/5 text-slate-200 ring-1 ring-white/10 px-2 py-0.5 font-medium">
                              Emmental: {cheese}
                            </span>
                          )}
                        </div>

                        {(it as any).removed?.length > 0 ? (
                          <p className="mt-1 text-sm text-slate-400">
                            Weglaten: {(it as any).removed.join(", ")}
                          </p>
                        ) : null}
                      </div>

                      <div className="inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/12 bg-white/8">
                        {fmt(it.price * (it.qty ?? 1))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-slate-400">Totaal</span>
              <span className="text-slate-100 font-semibold">{fmt(total)}</span>
            </div>
          </div>

          {/* Gegevens + bedrijfsoptie */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Naam</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#f4f5d3] focus:border-white/20"
                placeholder="Voor- en achternaam"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Telefoonnummer</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#f4f5d3] focus:border-white/20"
                placeholder="bv. 0470 12 34 56"
              />
            </div>

            {/* ▶️ NIEUW: schakelaar 'Bestellen als bedrijf' */}
            <div className="sm:col-span-2 flex items-center gap-3 mt-1">
              <input
                id="isCompany"
                type="checkbox"
                checked={isCompany}
                onChange={(e) => setIsCompany(e.target.checked)}
                className="h-4 w-4 rounded border-white/10 bg-white/5 text-[#f4f5d3] focus:ring-2 focus:ring-[#f4f5d3]"
              />
              <label htmlFor="isCompany" className="text-sm text-slate-300 select-none">
                Bestellen als bedrijf
              </label>
            </div>

            {/* ▶️ NIEUW: optioneel veld Bedrijfsnaam (alleen zichtbaar als bedrijf) */}
            {isCompany && (
              <div className="sm:col-span-2">
                <label className="block text-sm text-slate-300 mb-1">
                  Bedrijfsnaam <span className="text-slate-500">(optioneel)</span>
                </label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#f4f5d3] focus:border-white/20"
                />
              </div>
            )}
          </div>

          {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}

          {/* Acties */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <p className="text-xs text-slate-500">
              Door te bestellen ga je akkoord met verwerking van je gegevens om je bestelling uit te voeren.
            </p>
            <button
              type="button"
              disabled={!valid || sending}
              onClick={submit}
              className={`btn-snaque px-4 py-2 ${!valid || sending ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {sending ? "Versturen…" : `Bestellen (${countItems(items)} item${countItems(items) === 1 ? "" : "s"})`}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
