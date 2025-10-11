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
  framed = true,
}: {
  id: number;
  name: string;
  price: number;
  ingredients: string[];
  framed?: boolean;
}) {
  const [removed, setRemoved] = useState<string[]>([]);
  const [bread, setBread] = useState<"wit" | "bruin">("wit"); // 👈 nieuw
  const router = useRouter();

  const toggle = (ing: string) =>
    setRemoved((prev) =>
      prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing]
    );

  const fmt = (n: number) =>
    new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(n);

  const summary = useMemo(() => {
    const parts: string[] = [`Brood: ${bread === "wit" ? "Wit" : "Bruin"}`];
    if (removed.length) parts.push(`Weglaten: ${removed.join(", ")}`);
    return parts.join(" — ");
  }, [bread, removed]);

  const Inner = (
    <div className="space-y-6">
      {/* Broodtype */}
      <div>
        <h2 className="text-base font-semibold text-slate-200 mb-2">Broodtype</h2>
        <div className="inline-flex rounded-md ring-1 ring-white/10 overflow-hidden">
          <button
            type="button"
            onClick={() => setBread("wit")}
            aria-pressed={bread === "wit"}
            className={[
              "px-3 py-1.5 text-sm transition",
              bread === "wit"
                ? "bg-white/[0.12] text-slate-100"
                : "bg-white/5 text-slate-200 hover:bg-white/[0.08]",
            ].join(" ")}
          >
            Wit
          </button>
          <button
            type="button"
            onClick={() => setBread("bruin")}
            aria-pressed={bread === "bruin"}
            className={[
              "px-3 py-1.5 text-sm transition border-l border-white/10",
              bread === "bruin"
                ? "bg-white/[0.12] text-slate-100"
                : "bg-white/5 text-slate-200 hover:bg-white/[0.08]",
            ].join(" ")}
          >
            Bruin
          </button>
        </div>
      </div>

      {/* Toggle chips (weglaten) */}
      <div>
        <h2 className="text-base font-semibold text-slate-200 mb-2">Ingrediënten weglaten</h2>
        <div className="flex flex-wrap gap-2">
          {(ingredients.length ? ingredients : ["Sla", "Tomaat", "Komkommer", "Wortel", "Ei"]).map(
            (ing) => {
              const active = removed.includes(ing);
              return (
                <button
                  key={ing}
                  type="button"
                  onClick={() => toggle(ing)}
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 transition",
                    active
                      ? "bg-white/[0.10] text-slate-300 ring-white/15 line-through"
                      : "bg-white/5 text-slate-200 ring-white/10 hover:bg-white/[0.08]",
                  ].join(" ")}
                  aria-pressed={active}
                >
                  {active ? "−" : "✓"} {ing}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Samenvatting + acties */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <p className="text-sm text-slate-400">{summary}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => history.back()}
            className="btn-ghost"
          >
            Annuleren
          </button>
          <button
            type="button"
            onClick={() => {
              addToCart({
                id,
                name,
                price,
                removed,
                qty: 1,
                // 👇 voeg broodtype toe
                bread,
              } as any);
              router.push("/cart");
            }}
            className="btn-snaque inline-flex items-center justify-center gap-2"
          >
            + Toevoegen — {fmt(price)}
          </button>
        </div>
      </div>
    </div>
  );

  return framed ? <section className="panel p-5 md:p-8">{Inner}</section> : Inner;
}
