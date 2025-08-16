"use client";
import { tagClass, iconFor } from "@/functions";
import { useRouter } from "next/navigation";

export default function Broodje({ item }: { item: any }) {
  const router = useRouter();

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("nl-BE", {
      style: "currency",
      currency: "EUR",
    }).format(n);

  function addBroodje(id: number) {
    // Navigate to the add page for this broodje
    router.push(`/broodjes/add/${id}`);
  }

  return (
    <li
      className="
        group relative rounded-2xl
        border border-white/10
        bg-neutral-900/60 md:bg-white/10
        p-4 shadow-sm transition
        hover:border-white/20
        hover:bg-neutral-900/70 md:hover:bg-white/15
        flex flex-col h-full
      "
    >
      {/* subtiele koele accentlijn */}
      <div className="absolute left-4 right-4 top-3 h-1 rounded-full bg-gradient-to-r from-sky-300/30 to-emerald-300/30" />

      <div className="flex items-start justify-between gap-3 mt-3">
        <h3 className="text-lg font-medium leading-tight text-slate-100">
          {item.name}
        </h3>
        <div className="rounded-lg bg-neutral-900/60 md:bg-white/10 px-2 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/10">
          {formatPrice(item.price)}
        </div>
      </div>

      {item.desc && <p className="mt-2 text-sm text-slate-300">{item.desc}</p>}

      {/* spacer zodat de actiebalk onderaan blijft */}
      <div className="mt-3 sm:mt-4"></div>

      {/* ACTIEBALK: tags links, knop rechts */}
      <div className="mt-auto flex items-center gap-2">
        <div className="flex flex-wrap gap-2 flex-1 min-w-0">
          {item.tags?.length
            ? item.tags.map((t: string) => (
                <span key={t} className={tagClass(t)}>
                  {iconFor(t)} {t}
                </span>
              ))
            : null}
        </div>

        <button
          type="button"
          onClick={() => addBroodje(item.id)}
          className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-semibold bg-amber-500 text-black ring-1 ring-amber-400/60 hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <PlusIcon /> Toevoegen
        </button>
      </div>
    </li>
  );
}

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
