// app/cart/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  readCart,
  setCart,
  clearCart,
  countItems,
  CART_KEY,
  type CartItem,
} from "@/lib/cart";

const SLOT_VALUES = ["11:30", "12:00", "12:30", "13:00"] as const;
const SIZE_VALUES = ["small", "medium", "large"] as const;
const CHEESE_VALUES = ["met", "zonder"] as const;

function isPasta(it: CartItem) {
  const cat = (it as any)?.category;
  if (typeof cat !== "string") return false;
  const low = cat.toLowerCase();
  return low === "pasta" || low === "pasta_special"; // uitgebreid
}

function isSpecialPasta(it: CartItem) {
  const cat = (it as any)?.category;
  return typeof cat === "string" && cat.toLowerCase() === "pasta_special";
}

function requiresSauces(it: CartItem) {
  // Alleen 'gewone' pasta vereist 1–2 sauzen; special niet
  return isPasta(it) && !isSpecialPasta(it);
}

function hasValidTimeslot(it: CartItem) {
  const s = (it as any)?.timeslot;
  return !!s && (SLOT_VALUES as readonly string[]).includes(s);
}

function hasValidSize(it: CartItem) {
  const sz = String((it as any)?.size || "").toLowerCase();
  return (SIZE_VALUES as readonly string[]).includes(sz);
}

function saucesArray(it: CartItem): string[] {
  const arr = (it as any)?.sauces;
  return Array.isArray(arr) ? arr.filter(Boolean) : [];
}

function hasValidSauces(it: CartItem) {
  // Specials hoeven geen saus te kiezen
  if (!requiresSauces(it)) return true;
  const arr = saucesArray(it);
  return arr.length >= 1 && arr.length <= 2;
}

function hasValidCheese(it: CartItem) {
  const ch = String((it as any)?.cheese || "").toLowerCase();
  return (CHEESE_VALUES as readonly string[]).includes(ch as any);
}

function cheeseLabel(it: CartItem) {
  const ch = String((it as any)?.cheese || "").toLowerCase();
  return ch === "met" ? "met" : ch === "zonder" ? "zonder" : "";
}

function cap(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

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

  // Pasta-validatie (blokkeer checkout als een pasta ontbreekt)
  const invalidPasta = useMemo(
    () =>
      items.filter((it) => {
        if (!isPasta(it)) return false;
        return !(
          hasValidTimeslot(it) &&
          hasValidSize(it) &&
          hasValidSauces(it) &&
          hasValidCheese(it)
        );
      }),
    [items]
  );

  const canCheckout = items.length > 0 && invalidPasta.length === 0;

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
      <section
        className="
          relative overflow-hidden rounded-3xl
          border border-white/10 ring-1 ring-black/20 shadow-xl
          bg-white/5 backdrop-blur
        "
      >
        <div className="p-5 md:p-8">
          <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Winkelmandje</h1>
              <p className="mt-1 text-sm text-slate-400">
                {countItems(items)} item{countItems(items) === 1 ? "" : "s"} in je mandje
              </p>
            </div>
            {items.length > 0 && (
              <button
                type="button"
                onClick={empty}
                className="btn-ghost self-start inline-flex items-center gap-2"
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
                {items.map((it) => {
                  const pasta = isPasta(it);
                  const special = isSpecialPasta(it);
                  const slotOk = hasValidTimeslot(it);
                  const sizeOk = hasValidSize(it);
                  const saucesOk = hasValidSauces(it);
                  const cheeseOk = hasValidCheese(it);
                  const sauces = saucesArray(it);
                  const cheeseTxt = cheeseLabel(it);

                  return (
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

                          {/* Pasta: details + waarschuwingen */}
                          {pasta && (
                            <div className="mt-3 space-y-1.5 text-sm">
                              {/* Timeslot */}
                              {slotOk ? (
                                <span className="inline-flex items-center rounded-md bg-white/5 text-slate-200 ring-1 ring-white/10 px-2 py-1 text-xs font-medium">
                                  Timeslot: {(it as any).timeslot}
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-md bg-rose-500/10 text-rose-200 ring-1 ring-rose-400/30 px-2 py-1 text-xs">
                                  Kies een tijdslot
                                </span>
                              )}

                              {/* Maat */}
                              {sizeOk ? (
                                <span className="inline-flex items-center rounded-md bg-white/5 text-slate-200 ring-1 ring-white/10 px-2 py-1 text-xs font-medium">
                                  Maat: {cap(String((it as any).size))}
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-md bg-rose-500/10 text-rose-200 ring-1 ring-rose-400/30 px-2 py-1 text-xs">
                                  Kies een maat (Small/Medium/Large)
                                </span>
                              )}

                              {/* Sauzen */}
                              {special ? (
                                <span className="inline-flex items-center rounded-md bg-white/5 text-slate-200 ring-1 ring-white/10 px-2 py-1 text-xs font-medium">
                                  Sauzen: niet nodig
                                </span>
                              ) : saucesOk ? (
                                <span className="inline-flex items-center rounded-md bg-white/5 text-slate-200 ring-1 ring-white/10 px-2 py-1 text-xs font-medium">
                                  Sauzen: {sauces.join(" + ")}
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-md bg-rose-500/10 text-rose-200 ring-1 ring-rose-400/30 px-2 py-1 text-xs">
                                  Kies 1 of 2 sauzen
                                </span>
                              )}

                              {/* Kaas */}
                              {cheeseOk ? (
                                <span className="inline-flex items-center rounded-md bg-white/5 text-slate-200 ring-1 ring-white/10 px-2 py-1 text-xs font-medium">
                                  Emmental: {cheeseTxt}
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-md bg-rose-500/10 text-rose-200 ring-1 ring-rose-400/30 px-2 py-1 text-xs">
                                  Kies met of zonder kaas
                                </span>
                              )}

                              {(!slotOk || !sizeOk || !saucesOk || !cheeseOk) && (
                                <div className="pt-1">
                                  <button
                                    type="button"
                                    onClick={() => router.push(`/pasta/add/${it.id}`)}
                                    className="underline underline-offset-2 text-[#f4f5d3]/90 hover:text-[#f4f5d3]"
                                  >
                                    Bewerken bij pasta
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Broodje/dessert extra info */}
                          {(it as any).removed?.length > 0 || (it as any).note ? (
                            <div className="mt-3 space-y-1.5 text-sm">
                              {(it as any).removed?.length > 0 && (
                                <p className="text-slate-300">
                                  <span className="text-slate-400">Weglaten:</span>{" "}
                                  {(it as any).removed.join(", ")}
                                </p>
                              )}
                              {(it as any).note && (
                                <p className="text-slate-300">
                                  <span className="text-slate-400">Opmerking:</span>{" "}
                                  {(it as any).note}
                                </p>
                              )}
                            </div>
                          ) : null}
                        </div>

                        {/* Prijsbadge (neutraal) */}
                        <div className="inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/12 bg-white/8">
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
                          className="btn-ghost inline-flex items-center gap-2"
                        >
                          <TrashIcon /> Verwijderen
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Samenvatting */}
              <aside className="rounded-2xl border border-white/10 bg-white/5 p-4 lg:p-5 h-fit">
                <h2 className="text-lg font-semibold">Overzicht</h2>
                <div className="mt-3 space-y-2 text-sm">
                  <Row label="Subtotaal" value={fmt(subtotal)} />
                  <Row label="Totaal" value={fmt(subtotal)} bold />
                  <p className="text-xs text-slate-500">Prijzen incl. btw.</p>
                </div>

                {/* Waarschuwingen */}
                {invalidPasta.length > 0 && (
                  <div className="mt-4 rounded-lg bg-rose-500/10 ring-1 ring-rose-400/30 p-3 text-sm text-rose-200 space-y-1">
                    <p className="font-medium">Aanvullen vereist voor pasta:</p>
                    <ul className="list-disc pl-5 space-y-0.5">
                      {invalidPasta.map((it) => {
                        const parts: string[] = [];
                        if (!hasValidTimeslot(it)) parts.push("tijdslot");
                        if (!hasValidSize(it)) parts.push("maat");
                        if (requiresSauces(it) && !hasValidSauces(it)) parts.push("sauzen (1–2)");
                        if (!hasValidCheese(it)) parts.push("kaas");
                        return (
                          <li key={(it as any).addedAt}>
                            {it.name}: ontbreekt {parts.join(", ")}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                <div className="mt-5 space-y-2">
                  <button
                    type="button"
                    onClick={() => router.push("/broodjes")}
                    className="w-full btn-ghost"
                  >
                    Verder winkelen
                  </button>
                  <button
                    type="button"
                    onClick={() => canCheckout && router.push("/order")}
                    disabled={!canCheckout}
                    aria-disabled={!canCheckout}
                    className="w-full btn-snaque disabled:opacity-60 disabled:cursor-not-allowed"
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
        className="mt-4 btn-ghost"
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
      <path
        d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a 2 2 0 0 1 2 2v2m1 0-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
