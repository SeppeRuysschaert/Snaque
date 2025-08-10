import { tagClass, iconFor } from "@/functions";
export default function Panini({
  item,
  formatPrice,
}: {
  item: any;
  formatPrice: (n: number) => string;
}) {
  return (
    <li
      className="group relative rounded-2xl border border-amber-200/10 bg-amber-50/[0.04] p-4 shadow-sm transition hover:border-amber-200/20 hover:bg-amber-50/[0.08]"
      style={{
        // grill-streepjes heel subtiel
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 6px, rgba(255,255,255,0) 6px 12px)",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* warme accentlijn */}
      <div className="absolute left-4 right-4 top-3 h-1 rounded-full bg-gradient-to-r from-amber-300/40 via-orange-300/30 to-rose-300/30" />

      <div className="flex items-start justify-between gap-3 mt-3">
        <h3 className="text-lg font-medium leading-tight text-slate-100">
          {item.name}
        </h3>
        <div className="rounded-xl bg-amber-400/15 px-2 py-1 text-sm font-semibold text-amber-100 ring-1 ring-amber-300/20">
          {formatPrice(item.price)}
        </div>
      </div>

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