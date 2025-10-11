"use client";
import { iconFor } from "@/functions";
import { useRouter } from "next/navigation";

export default function Broodje({ item }: { item: any }) {
  const router = useRouter();

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(n);

  function addBroodje(id: number) {
    router.push(`/broodjes/add/${id}`);
  }

  return (
    <li
      className="
        panel p-4 shadow-sm transition
        hover:border-white/15 hover:bg-white/[0.06]
        flex flex-col h-full relative
      "
    >
      {/* subtiele beige accentlijn i.p.v. blauw */}
      <div className="absolute left-4 right-4 top-3 h-1 rounded-full bg-gradient-to-r from-[#f4f5d3]/35 via-transparent to-transparent" />

      <div className="flex items-start justify-between gap-3 mt-3">
        <h3 className="text-lg font-medium leading-tight" style={{ color: "#f4f5d3" }}>
          {item.name}
        </h3>

        {/* neutrale prijsbadge (geen blauwtint) */}
        <div className="inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/12 bg-white/8">
          {formatPrice(item.price)}
        </div>
      </div>

      {item.desc && <p className="mt-2 text-sm text-slate-300">{item.desc}</p>}

      {/* spacer zodat de actiebalk onderaan blijft */}
      <div className="mt-3 sm:mt-4" />

      {/* ACTIEBALK: tags links, knop rechts */}
      <div className="mt-auto flex items-center gap-2">
        <div className="flex flex-wrap gap-2 flex-1 min-w-0">
          {item.tags?.length
            ? item.tags.map((t: string) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium text-slate-200 ring-1 ring-white/12 bg-white/5"
                >
                  {iconFor(t)} {t}
                </span>
              ))
            : null}
        </div>

        {/* CTA blijft merkstijl */}
        <button
          type="button"
          onClick={() => addBroodje(item.id)}
          className="btn-snaque shrink-0 inline-flex items-center justify-center gap-1.5 text-[13px]"
        >
          <PlusIcon /> Toevoegen
        </button>
      </div>
    </li>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
