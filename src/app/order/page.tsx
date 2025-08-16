"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { readCart, clearCart, countItems } from "@/lib/cart";
import type { CartItem } from "@/lib/cart";

export default function Order() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setItems(readCart()), []);

  const fmt = (n: number) =>
    new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(n);

  const total = useMemo(
    () => items.reduce((s, it) => s + (it.price * (it.qty ?? 1)), 0),
    [items]
  );

  const valid =
    name.trim().length >= 2 &&
    /^[0-9 +().-]{8,}$/.test(phone.trim()) &&
    items.length > 0;

  async function submit() {
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/order/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: name.trim(), phone: phone.trim(), note: note.trim() || undefined },
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
        <section className="rounded-3xl bg-[#111418] border border-white/10 ring-1 ring-black/20 shadow-xl">
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-semibold">Bedankt!</h1>
            <p className="mt-2 text-slate-300">
              Je bestelling is verstuurd. We nemen contact op via jouw telefoonnummer.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/10 hover:bg-white/10"
                onClick={() => router.push("/broodjes")}
              >
                Verder bestellen
              </button>
              <button
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/10 hover:bg-white/10"
                onClick={() => router.push("/")}
              >
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
      <section className="rounded-3xl bg-[#111418] border border-white/10 ring-1 ring-black/20 shadow-xl">
        <div className="p-6 md:p-8">
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-semibold">Bestellen</h1>
            <p className="mt-1 text-sm text-slate-400">
              Vul je gegevens in en bevestig je bestelling.
            </p>
            <div className="mt-4 h-1 w-full rounded-full bg-gradient-to-r from-amber-400/40 to-rose-400/40" />
          </header>

          {/* Bestellingsoverzicht */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
            <h2 className="text-lg font-semibold">Jouw bestelling</h2>
            {items.length === 0 ? (
              <p className="mt-2 text-slate-400">Je winkelmandje is leeg.</p>
            ) : (
              <ul className="mt-3 divide-y divide-white/10">
                {items.map((it) => (
                  <li key={it.addedAt} className="py-2 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium">{it.name} {it.qty && it.qty > 1 ? `× ${it.qty}` : ""}</p>
                      <p className="text-sm text-slate-400">
                        {it.removed?.length ? `Weglaten: ${it.removed.join(", ")}` : null}
                        {it.note ? `${it.removed?.length ? " — " : ""}Opmerking: ${it.note}` : null}
                      </p>
                    </div>
                    <div className="rounded-lg bg-[#0f1418] px-2 py-1 text-xs font-semibold ring-1 ring-white/10">
                      {fmt(it.price * (it.qty ?? 1))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-slate-400">Totaal</span>
              <span className="text-slate-100 font-semibold">{fmt(total)}</span>
            </div>
          </div>

          {/* Gegevens */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Naam</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-[#0f1418] border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="Voor- en achternaam"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Telefoonnummer</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                className="w-full rounded-lg bg-[#0f1418] border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="bv. 0470 12 34 56"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-slate-300 mb-1">Opmerking (optioneel)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full rounded-lg bg-[#0f1418] border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="Bv. afhalen om 12u15"
              />
            </div>
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
              className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold
                ${valid ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-amber-500/40 text-black/60"}
                ring-1 ring-amber-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}
            >
              {sending ? "Versturen…" : `Bestellen (${countItems(items)} item${countItems(items)===1?"":"s"})`}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
