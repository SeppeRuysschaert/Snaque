import Link from "next/link";

export default function Soepen() {
  return (
    <main className="isolate mx-auto max-w-6xl px-4 py-6 md:py-10 text-slate-100">
      <section className="relative overflow-hidden rounded-3xl bg-[#111418] border border-white/10 ring-1 ring-black/20 shadow-xl">
        <div className="p-5 md:p-8">
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Soepen</h1>
            <p className="mt-1 text-sm text-slate-400">
              Onder voorbehoud — assortiment en prijzen volgen binnenkort.
            </p>
            <div className="mt-4 h-1 w-full rounded-full bg-gradient-to-r from-sky-400/40 to-emerald-400/40" />
          </header>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">🍲</span>
              <div>
                <p className="font-medium">Binnenkort beschikbaar</p>
                <p className="text-sm text-slate-400">We werken het aanbod af. Kom snel terug!</p>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <Link
                href="/broodjes"
                className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/10 hover:bg-white/10"
              >
                Naar Broodjes
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/10 hover:bg-white/10"
              >
                Home
              </Link>
            </div>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            * Onder voorbehoud: dagprijzen en beschikbaarheid kunnen wijzigen.
          </p>
        </div>
      </section>
    </main>
  );
}
