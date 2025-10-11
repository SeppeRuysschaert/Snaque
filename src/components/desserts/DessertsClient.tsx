/* ---------------- Client UI ---------------- */
"use client";
import { useState } from "react";
import { addToCart } from "@/lib/cart";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Dessert = {
  id: number;
  name: string;
  price: number;
  image: string;
  desc?: string;
};

export default function DessertsClient({ items }: { items: Dessert[] }) {
  const [qty, setQty] = useState<Record<number, number>>({});
  const router = useRouter();

  const fmt = (n: number) =>
    new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(n);

  const setQ = (id: number, v: number) =>
    setQty((s) => ({ ...s, [id]: Math.max(1, Math.min(24, v || 1)) }));

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
      {items.map((it) => {
        const q = qty[it.id] ?? 1;
        return (
          <li
            key={it.id}
            className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
          >
            <div className="aspect-[4/3] relative">
              <Image
                src={it.image}
                alt={it.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            <div className="p-4 md:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold leading-tight">{it.name}</h3>
                  {it.desc && (
                    <p className="mt-1 text-sm text-slate-300 line-clamp-2">
                      {it.desc}
                    </p>
                  )}
                </div>
                {/* neutrale prijsbadge */}
                <div className="inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/12 bg-white/8">
                  {fmt(it.price)}
                </div>
              </div>

              {/* Actiebalk */}
              <div className="mt-4 flex items-center justify-between">
                <Qty
                  value={q}
                  onDec={() => setQ(it.id, q - 1)}
                  onInc={() => setQ(it.id, q + 1)}
                />

                <button
                  type="button"
                  onClick={() => {
                    addToCart({
                      id: it.id,
                      name: it.name,
                      price: it.price,
                      qty: q,
                      note: "",
                    });
                    router.push("/cart");
                  }}
                  className="btn-snaque inline-flex items-center justify-center gap-2"
                >
                  + Toevoegen
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Qty({
  value,
  onDec,
  onInc,
}: {
  value: number;
  onDec: () => void;
  onInc: () => void;
}) {
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
      <span className="min-w-[2.5rem] text-center text-sm font-medium text-slate-100">
        {value}
      </span>
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
