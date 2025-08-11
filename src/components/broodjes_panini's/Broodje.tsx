import { tagClass, iconFor } from "@/functions";

export default function Broodje({
  item,
  formatPrice,
}: {
  item: any;
  formatPrice: (n: number) => string;
}) {
  return (
    <li
      className="
        group relative rounded-2xl
        border border-white/10
        bg-neutral-900/60 md:bg-white/10
        p-4 shadow-sm transition
        hover:border-white/20
        hover:bg-neutral-900/70 md:hover:bg-white/15
      "
    >
      {/* subtiele koele accentlijn */}
      <div className="absolute left-4 right-4 top-3 h-1 rounded-full bg-gradient-to-r from-sky-300/30 to-emerald-300/30" />

      <div className="flex items-start justify-between gap-3 mt-3">
        <h3 className="text-lg font-medium leading-tight text-slate-100">
          {item.name}
        </h3>
        <div className="rounded-xl bg-neutral-900/60 md:bg-white/10 px-2 py-1 text-sm font-semibold text-slate-100 ring-1 ring-white/10">
          {formatPrice(item.price)}
        </div>
      </div>

      {item.desc && <p className="mt-2 text-sm text-slate-300">{item.desc}</p>}

      {item.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.tags.map((t: string) => (
            <span key={t} className={tagClass(t)}>
              {iconFor(t)} {t}
            </span>
          ))}
        </div>
      ) : null}
    </li>
  );
}
