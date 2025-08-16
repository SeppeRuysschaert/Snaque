"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  readCart,
  setCart,
  clearCart,
  countItems,
  CART_KEY,
} from "@/lib/cart";
import type { CartItem } from "@/lib/cart";

export default function Cart() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);

  // Init + live updates (ook cross-tab)
  useEffect(() => {
    setItems(readCart());
    const onUpdate = () => setItems(readCart());
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) setItems(readCart());
    };
    window.addEventListener("cart:updated", onUpdate as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("cart:updated", onUpdate as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Helpers
  const fmt = (n: number) =>
    new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(n);

  const qty = (it: CartItem) => it.qty ?? 1;

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * qty(it), 0),
    [items]
  );

  const setQty = (addedAt: number | undefined, newQty: number) => {
    if (!addedAt) return;
    const next = readCart().map((it) =>
      it.addedAt === addedAt ? { ...it, qty: Math.max(1, Math.min(99, newQty)) } : it
    );
    setCart(next);
    setItems(next);
  };

  const remove = (addedAt: number | undefined) => {
    if (!addedAt) return;
    const next = readCart().filter((it) => it.addedAt !== addedAt);
    setCart(next);
    setItems(next);
  };

  const empty = () => {
    clearCart();
    setItems([]);
  };

  // UI
  return (
    <main className="isolate mx-auto max-w-5xl px-4 py-6 md:py-10 text-slate-100">
      <section className="relative overflow-hidden rounded-3xl bg-[#111418] border border-white/10 ring-1 ring-black/20 shadow-xl">
        <div className="p-5 md:p-8">
          <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Winkelmandje
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                {countItems(items)} item{countItems(items) === 1 ? "" : "s"} in je mandje
              </p>
            </div>
            {items.length > 0 && (
              <button
                type="button"
                onClick={empty}
                className="self-start inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-slate-200 ring-1 ring-white/10 hover:bg-white/10"
              >
                <TrashIcon /> Mandje legen
              </button>
            )}
          </header>

          {items.length === 0 ? (
            <EmptyState onBack={() => router.push("/broodjes")} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
              {/* Items lijst */}
              <ul className="space-y-4">
                {items.map((it) => (
                  <li
                    key={it.addedAt}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-medium leading-tight">
                          {it.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                          {fmt(it.price)} per stuk
                        </p>

                        {/* Weggelaten + opmerking */}
                        {(it.removed && it.removed.length > 0) || it.note ? (
                          <div className="mt-3 space-y-1.5 text-sm">
                            {it.removed && it.removed.length > 0 && (
                              <p className="text-slate-300">
                                <span className="text-slate-400">Weglaten:</span>{" "}
                                {it.removed.join(", ")}
                              </p>
                            )}
                            {it.note && (
                              <p className="text-slate-300">
                                <span className="text-slate-400">Opmerking:</span>{" "}
                                {it.note}
                              </p>
                            )}
                          </div>
                        ) : null}
                      </div>

                      {/* Prijsbadge */}
                      <div className="rounded-lg bg-[#0f1418] px-2 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/10">
                        {fmt(it.price * qty(it))}
                      </div>
                    </div>

                    {/* Actiebalk: qty en verwijderen */}
                    <div className="mt-4 flex flex-wrap items-center gap-3 justify-between">
                      <Qty
                        value={qty(it)}
                        onDec={() => setQty(it.addedAt, qty(it) - 1)}
                        onInc={() => setQty(it.addedAt, qty(it) + 1)}
                      />
                      <button
                        type="button"
                        onClick={() => remove(it.addedAt)}
                        className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-slate-200 ring-1 ring-white/10 hover:bg-white/10"
                      >
                        <TrashIcon /> Verwijderen
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Samenvatting */}
              <aside className="rounded-2xl border border-white/10 bg-white/5 p-4 lg:p-5 h-fit">
                <h2 className="text-lg font-semibold">Overzicht</h2>
                <div className="mt-3 space-y-2 text-sm">
                  <Row label="Subtotaal" value={fmt(subtotal)} />
                  <Row label="Totaal" value={fmt(subtotal)} bold />
                  <p className="text-xs text-slate-500">Prijzen incl. btw.</p>
                </div>

                <div className="mt-5 space-y-2">
                  <button
                    type="button"
                    onClick={() => router.push("/broodjes")}
                    className="w-full inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/10 hover:bg-white/10"
                  >
                    Verder winkelen
                  </button>
                  <button
                    type="button"
                    // 👉 hier koppel jij je checkout-logica
                    onClick={() => router.push("/order")}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold bg-amber-500 text-black ring-1 ring-amber-400/60 hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    Bestellen
                  </button>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* ---------- Kleine UI helpers ---------- */

function Row({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className={bold ? "font-semibold text-slate-100" : "text-slate-200"}>{value}</span>
    </div>
  );
}

function EmptyState({ onBack }: { onBack: () => void }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
      <p className="text-slate-300">Je winkelmandje is leeg.</p>
      <button
        type="button"
        onClick={onBack}
        className="mt-4 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/10 hover:bg-white/10"
      >
        Naar Broodjes
      </button>
    </div>
  );
}

function Qty({ value, onDec, onInc }: { value: number; onDec: () => void; onInc: () => void }) {
  return (
    <div className="inline-flex items-center rounded-md ring-1 ring-white/10 overflow-hidden">
      <button
        type="button"
        onClick={onDec}
        className="px-2 py-1.5 text-sm text-slate-200 hover:bg-white/10"
        aria-label="Aantal verlagen"
      >
        −
      </button>
      <span className="min-w-[2.5rem] text-center text-sm font-medium text-slate-100">{value}</span>
      <button
        type="button"
        onClick={onInc}
        className="px-2 py-1.5 text-sm text-slate-200 hover:bg-white/10"
        aria-label="Aantal verhogen"
      >
        +
      </button>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m1 0-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
