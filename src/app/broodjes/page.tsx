import Broodje from "@/components/broodjes/Broodje";
import { broodjes } from "@/data/Broodjes";

export default function Broodjes() {
  return (
    <main className="isolate mx-auto max-w-6xl px-4 py-6 md:py-10">
      <section
        className="
          relative overflow-hidden rounded-3xl
          border border-white/10 ring-1 ring-black/20 shadow-xl
          bg-white/5                 /* neutrale panel i.p.v. blauwe tint */
          backdrop-blur
        "
      >
        {/* subtiele top-accent, minder blauw */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#f4f5d3]/40 via-transparent to-transparent" />

        <div className="p-5 md:p-8">
          <Header />

          <SectionHeader
            title="Belegde broodjes"
            subtitle="Koude belegde broodjes"
            accent="from-[#f4f5d3]/50 to-transparent"  /* beige → transparant */
          />

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {broodjes.map((it) => (
              <Broodje key={it.id} item={it} />
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
      <h1
        className="text-3xl md:text-4xl font-semibold tracking-tight"
        style={{ color: "#f4f5d3" }} /* Snaque beige */
      >
        Broodjes
      </h1>
      <p className="mt-1 text-sm text-slate-300">Prijzen in EUR, incl. btw.</p>
    </header>
  );
}

function SectionHeader({
  title,
  subtitle,
  accent = "from-[#f4f5d3]/40 to-transparent",
}: {
  title: string;
  subtitle?: string;
  accent?: string;
}) {
  return (
    <div className="mb-4 md:mb-5">
      <div className={`h-1 w-full rounded-full bg-gradient-to-r ${accent} mb-3`} />
      <div className="flex items-baseline justify-between">
        <h2
          className="text-xl md:text-2xl font-semibold"
          style={{ color: "#f4f5d3" }} /* beige */
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs md:text-sm text-slate-300">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
