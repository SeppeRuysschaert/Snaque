import Broodje from "@/components/broodjes_panini's/Broodje";
import Panini from "@/components/broodjes_panini's/Panini";
import { broodjes } from "@/data/Broodjes";
import { paninis } from "@/data/Panini's";

export default function Broodjes() {
  const formatPrice = (n: number) =>
    new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(n);

  return (
    <main className="isolate mx-auto max-w-6xl px-4 py-6 md:py-10 text-slate-100">

      {/* SOLIDE container + clippen → rondingen zichtbaar in alle browsers */}
      <section
        className="
          relative overflow-hidden                     /* <— belangrijk */
          rounded-3xl                                  /* duidelijke rondingen */
          bg-[#111418]                                 /* vaste donkere kaart */
          border border-white/10 ring-1 ring-black/20  /* subtiele outline */
          shadow-xl
        "
      >
        <div className="p-5 md:p-8">
          <Header />
          <CategoryChips />

          {/* Broodjes */}
          <SectionHeader
            title="Broodjes"
            subtitle="Koude belegde broodjes"
            accent="from-sky-400/40 to-emerald-400/40"
          />
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            {broodjes.map((it) => (
              <Broodje key={it.id} item={it} formatPrice={formatPrice} />
            ))}
          </ul>

          {/* Panini's */}
          <SectionHeader
            title="Panini's"
            subtitle="Warm geperst – knapperig gegrild"
            accent="from-amber-400/40 to-rose-400/40"
          />
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {paninis.map((it) => (
              <Panini key={it.id} item={it} formatPrice={formatPrice} />
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

function Header() {
  return (
    <header className="mb-5 md:mb-6">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-100">Menu</h1>
      <p className="mt-1 text-sm text-slate-400">Prijzen in EUR, incl. btw.</p>
    </header>
  );
}

function CategoryChips() {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Chip>🥪 Broodjes</Chip>
      <Chip>🥙 Panini's</Chip>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#0f1418] px-3 py-1 text-xs text-slate-200 ring-1 ring-white/10 border border-white/5">
      {children}
    </span>
  );
}

function SectionHeader({
  title,
  subtitle,
  accent = "from-white/10 to-white/0",
}: {
  title: string;
  subtitle?: string;
  accent?: string;
}) {
  return (
    <div className="mb-4 md:mb-5">
      <div className={`h-1 w-full rounded-full bg-gradient-to-r ${accent} mb-3`} />
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-100">{title}</h2>
        {subtitle && <p className="text-xs md:text-sm text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}
