/* ---------------- Client component ---------------- */
"use client";
import { addToCart } from "@/lib/cart";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function BroodjeCustomizerClient({
  id,
  name,
  price,
  ingredients,
}: {
  id: number;
  name: string;
  price: number;
  ingredients: string[];
}) {
  const [removed, setRemoved] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const router = useRouter();

  const toggle = (ing: string) =>
    setRemoved((prev) =>
      prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing]
    );

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("nl-BE", {
      style: "currency",
      currency: "EUR",
    }).format(n);

  const summary = useMemo(
    () =>
      removed.length
        ? `We laten weg: ${removed.join(", ")}`
        : "Niets weggelaten",
    [removed]
  );

  return (
    <div className="space-y-6">
      {/* Toggle chips */}
      <div>
        <h2 className="text-base font-semibold text-slate-200 mb-2">
          Ingrediënten
        </h2>
        <div className="flex flex-wrap gap-2">
          {(ingredients.length
            ? ingredients
            : ["Sla", "Tomaat", "Komkommer", "Wortel", "Ei"]
          ).map((ing) => {
            const active = removed.includes(ing);
            return (
              <button
                key={ing}
                type="button"
                onClick={() => toggle(ing)}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 transition",
                  active
                    ? "bg-rose-400/10 text-rose-200 ring-rose-400/30 line-through"
                    : "bg-white/5 text-slate-200 ring-white/10 hover:bg-white/10",
                ].join(" ")}
                aria-pressed={active}
              >
                {active ? "−" : "✓"} {ing}
              </button>
            );
          })}
        </div>
      </div>

      {/* Opmerking */}
      <div>
        <label className="block text-sm text-slate-300 mb-1" htmlFor="note">
          Opmerking (optioneel)
        </label>
        <textarea
          id="note"
          className="w-full min-h-[90px] rounded-lg bg-[#0f1418] border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300"
          placeholder="Bv. geen saus, extra servetje, …"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* Samenvatting + acties */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <p className="text-sm text-slate-400">{summary}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => history.back()}
            className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-slate-200 ring-1 ring-white/10 hover:bg-white/10"
          >
            Annuleren
          </button>
          <button
            type="button"
            onClick={() =>
            {
              addToCart({
                id,
                name,
                price,
                removed, // array met weggelaten ingrediënten
                note, // vrije tekst
                qty: 1,
              });
              router.push("/cart"); // ga naar winkelmandje
            }
            }
            className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold bg-amber-500 text-black ring-1 ring-amber-400/60 hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            + Toevoegen — {formatPrice(price)}
          </button>
        </div>
      </div>
    </div>
  );
}
