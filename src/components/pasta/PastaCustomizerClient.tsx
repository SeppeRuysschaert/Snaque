// components/PastaCustomizerClient.tsx
"use client";

import { useMemo, useState, useCallback } from "react";
import type { KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { PASTA_TIMESLOTS, type PastaTimeslot } from "@/data/pasta";
import { addToCart, type CartItem } from "@/lib/cart";

type Size = "small" | "medium" | "large";
const DEFAULT_PRICE_BY_SIZE: Record<Size, number> = {
  small: 6.5,
  medium: 8.5,
  large: 10.5,
};

export default function PastaCustomizerClient({
  baseName = "Pasta",
  id, // voor specials geef je een echt id door
  category = "pasta", // "pasta" of "pasta_special"
  priceBySize, // optioneel, default naar vaste prijzen
  sauces: saucesProp, // enkel gebruikt als saucesEnabled = true
  saucesEnabled = true, // << specials: false
}: {
  baseName?: string;
  id?: number;
  category?: "pasta" | "pasta_special" | string;
  priceBySize?: { small: number; medium: number; large: number };
  sauces?: string[];
  saucesEnabled?: boolean;
}) {
  const router = useRouter();

  // State
  const [size, setSize] = useState<Size | "">("");
  const [sauces, setSauces] = useState<string[]>([]);
  const [timeslot, setTimeslot] = useState<PastaTimeslot | "">("");
  const [cheese, setCheese] = useState<"with" | "without" | "">("");

  // Data
  const PRICES = priceBySize ?? DEFAULT_PRICE_BY_SIZE;
  const SAUCES = (
    saucesProp?.length
      ? saucesProp
      : [
          "Bolognese",
          "Carbonara",
          "Pesto",
          "Arrabbiata",
          "Vier kazen",
          "Diabolique",
          "Pomodoro",
          "Spinazie",
        ]
  ) as string[];

  // Helpers
  const fmt = (n: number) =>
    new Intl.NumberFormat("nl-BE", {
      style: "currency",
      currency: "EUR",
    }).format(n);

  const currentPrice = useMemo(
    () => (size ? PRICES[size as Size] : PRICES.medium),
    [PRICES, size]
  );

  const timeslotValid = useMemo(
    () => PASTA_TIMESLOTS.includes(timeslot as PastaTimeslot),
    [timeslot]
  );
  const sizeValid = size === "small" || size === "medium" || size === "large";
  const saucesValid = saucesEnabled
    ? sauces.length >= 1 && sauces.length <= 2
    : true;
  const cheeseValid = cheese === "with" || cheese === "without";
  const formValid = timeslotValid && sizeValid && saucesValid && cheeseValid;

  const focusedIdx = useMemo(
    () =>
      Math.max(
        0,
        PASTA_TIMESLOTS.indexOf(
          (timeslot as PastaTimeslot) || PASTA_TIMESLOTS[0]
        )
      ),
    [timeslot]
  );

  const onTimeslotKey = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const idx = PASTA_TIMESLOTS.indexOf(
        (timeslot as PastaTimeslot) || PASTA_TIMESLOTS[0]
      );
      const next =
        ((idx < 0 ? 0 : idx) + dir + PASTA_TIMESLOTS.length) %
        PASTA_TIMESLOTS.length;
      setTimeslot(PASTA_TIMESLOTS[next]);
    },
    [timeslot]
  );

  const toggleSauce = (s: string) => {
    setSauces((prev) => {
      const has = prev.includes(s);
      if (has) return prev.filter((x) => x !== s);
      if (prev.length >= 2) return prev;
      return [...prev, s];
    });
  };

  return (
    <div className="space-y-8">
      {/* Maat */}
      <section>
        <h2 className="text-base font-semibold text-slate-200 mb-2">
          Kies je maat
        </h2>
        <div
          role="radiogroup"
          aria-label="Kies je maat"
          className="grid grid-cols-3 gap-2"
        >
          {(["small", "medium", "large"] as Size[]).map((sz) => {
            const active = size === sz;
            const label = sz[0].toUpperCase() + sz.slice(1);
            return (
              <button
                key={sz}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSize(sz)}
                className={[
                  "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm ring-1 transition outline-none",
                  active
                    ? "bg-amber-400 text-black ring-amber-300 shadow-md scale-[1.02]"
                    : "bg-white/5 text-slate-200 ring-white/10 hover:bg-white/10 focus:ring-amber-300",
                ].join(" ")}
              >
                {label}{" "}
                <span className="text-xs opacity-80">({fmt(PRICES[sz])})</span>
              </button>
            );
          })}
        </div>
        {!sizeValid && (
          <p className="text-xs text-rose-300 mt-2">Kies een maat.</p>
        )}
      </section>

      {/* Sauzen (optioneel zichtbaar) */}
      {saucesEnabled && (
        <section>
          <h2 className="text-base font-semibold text-slate-200 mb-2">
            Kies je saus (max 2)
          </h2>
          <div className="flex flex-wrap gap-2">
            {SAUCES.map((s) => {
              const active = sauces.includes(s);
              const atLimit = sauces.length >= 2 && !active;
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={active}
                  aria-disabled={atLimit}
                  onClick={() => !atLimit && toggleSauce(s)}
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 transition",
                    active
                      ? "bg-amber-400/20 text-amber-200 ring-amber-400/30"
                      : atLimit
                      ? "bg-white/5 text-slate-400 ring-white/10 cursor-not-allowed opacity-60"
                      : "bg-white/5 text-slate-200 ring-white/10 hover:bg-white/10",
                  ].join(" ")}
                >
                  {active ? "✓" : "+"} {s}
                </button>
              );
            })}
          </div>
          {!saucesValid && (
            <p className="text-xs text-rose-300 mt-2">Kies 1 of 2 sauzen.</p>
          )}
        </section>
      )}

      {/* Timeslot */}
      <section>
        <h2 className="text-base font-semibold text-slate-200 mb-2">
          Kies je afhaaltijd
        </h2>
        <div
          role="radiogroup"
          aria-label="Kies je afhaaltijd"
          onKeyDown={onTimeslotKey}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        >
          {PASTA_TIMESLOTS.map((slot, i) => {
            const active = timeslot === slot;
            return (
              <button
                key={slot}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={i === focusedIdx ? 0 : -1}
                onClick={() => setTimeslot(slot)}
                className={[
                  "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm ring-1 transition outline-none",
                  active
                    ? "bg-amber-400 text-black ring-amber-300 shadow-md scale-[1.02]"
                    : "bg-white/5 text-slate-200 ring-white/10 hover:bg-white/10 focus:ring-amber-300",
                ].join(" ")}
              >
                <span className="font-medium">{slot}</span>
              </button>
            );
          })}
        </div>
        {!timeslotValid && (
          <p className="text-xs text-rose-300 mt-2">Kies een tijdslot.</p>
        )}
      </section>

      {/* Kaas (vervangt Opmerking) + CTA */}
      <section className="flex flex-col gap-3">
        <div className="flex-1">
          <h2 className="text-base font-semibold text-slate-200 mb-2">Emmental kaas</h2>

          <div
            role="radiogroup"
            aria-label="Kaas"
            className="grid grid-cols-2 gap-2"
          >
            {[
              { key: "with", label: "Met Emmental" },
              { key: "without", label: "Zonder Emmental" },
            ].map(({ key, label }) => {
              const active = cheese === (key as "with" | "without");
              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setCheese(key as "with" | "without")}
                  className={[
                    "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm ring-1 transition outline-none",
                    active
                      ? "bg-amber-400 text-black ring-amber-300 shadow-md scale-[1.02]"
                      : "bg-white/5 text-slate-200 ring-white/10 hover:bg-white/10 focus:ring-amber-300",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Altijd ruimte reserveren voor feedback, geen layout shift */}
          <p
            className={[
              "text-xs mt-2 h-5", // vaste hoogte voor 1 regel
              cheeseValid ? "text-transparent" : "text-rose-300",
            ].join(" ")}
            aria-live="polite"
          >
            {cheeseValid ? "placeholder" : "Kies met of zonder Emmental."}
          </p>

          {/* Knop ONDER de kaas-keuze */}
          <button
            type="button"
            disabled={!formValid}
            onClick={() => {
              const item: CartItem = {
                id: id ?? 999001,
                name: baseName,
                price: currentPrice,
                qty: 1,
                category,
                timeslot: timeslot as PastaTimeslot,
                size: size as Size,
                cheese: cheese === "with" ? "met" : "zonder",
                ...(saucesEnabled ? { sauces } : {}),
              };
              addToCart(item);
              router.push("/cart");
            }}
            className="mt-2 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold bg-amber-500 text-black ring-1 ring-amber-400/60 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            + Toevoegen — {fmt(currentPrice)}
          </button>
        </div>
      </section>
    </div>
  );
}
