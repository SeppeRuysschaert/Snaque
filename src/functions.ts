export function tagClass(tag: string) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ring-1 border border-white/5";
  switch (tag) {
    case "Vega":
      return `${base} bg-emerald-400/10 ring-emerald-400/20 text-emerald-200`;
    case "Vis":
      return `${base} bg-sky-400/10 ring-sky-400/20 text-sky-200`;
    case "Pikant":
      return `${base} bg-rose-400/10 ring-rose-400/20 text-rose-200`;
    default:
      return `${base} bg-white/5 ring-white/10 text-slate-200`;
  }
}

export function iconFor(tag: string) {
  switch (tag) {
    case "Vega":
      return "🌱";
    case "Vis":
      return "🐟";
    case "Pikant":
      return "🌶️";
    default:
      return "";
  }
}