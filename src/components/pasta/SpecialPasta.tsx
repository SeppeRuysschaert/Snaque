// components/SpecialPasta.tsx
"use client";

import { useRouter } from "next/navigation";

type PriceBySize = { small: number; medium: number; large: number };

export default function SpecialPasta({
  item,
}: {
  item: { id: number; name: string; desc?: string; tags?: string[]; price?: number; priceBySize?: PriceBySize };
}) {
  const router = useRouter();

  const fmt = (n: number) => new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(n);
  const priceLabel = (() => {
    if (item.priceBySize) {
      const v = Object.values(item.priceBySize);
      const min = Math.min(...v), max = Math.max(...v);
      return min === max ? fmt(min) : `${fmt(min)}–${fmt(max)}`;
    }
    return fmt(item.price ?? 0);
  })();

  return (
    <li className="group relative rounded-2xl border border-white/10 bg-neutral-900/60 md:bg-white/10 p-4 shadow-sm transition hover:border-white/20 hover:bg-neutral-900/70 md:hover:bg-white/15 flex flex-col h-full">
      <div className="absolute left-4 right-4 top-3 h-1 rounded-full bg-gradient-to-r from-fuchsia-300/30 to-amber-300/30" />
      <div className="flex items-start justify-between gap-3 mt-3">
        <h3 className="text-lg font-medium leading-tight text-slate-100">{item.name}</h3>
        <div className="rounded-lg bg-neutral-900/60 md:bg-white/10 px-2 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/10">
          {priceLabel}
        </div>
      </div>
      {item.desc && <p className="mt-2 text-sm text-slate-300">{item.desc}</p>}

      {item.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <span key={t} className="inline-flex items-center rounded-md bg-white/5 text-slate-200 ring-1 ring-white/10 px-2 py-1 text-[11px]">{t}</span>
          ))}
        </div>
      ) : null}

      <div className="mt-auto flex items-center justify-end">
        <button
          type="button"
          onClick={() => router.push(`/pasta/special/${item.id}`)}
          className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-semibold bg-amber-500 text-black ring-1 ring-amber-400/60 hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          Special bestellen
        </button>
      </div>
    </li>
  );
}
