// app/broodjes/[id]/page.tsx  (of jouw routepad)
import { broodjes } from "@/data/Broodjes";
import BroodjeCustomizerClient from "@/components/broodjes/BroodjesCustomizerClient";

// Server Component
export default function AddBroodjePage({
  params,
}: {
  params: { id: string };
}) {
  const {id} = params
  const broodje = broodjes.find((b) => b.id === Number(id));

  // Ingrediënten afleiden uit desc (comma/“en” gescheiden)
  const ingredients: string[] =
    (broodje?.desc ?? "")
      .replace(/—|–/g, ",")
      .replace(/\s+en\s+/gi, ",")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      // dubbele of generieke spaties/namen weg
      .filter((v, i, a) => a.indexOf(v) === i) || [];

  return (
    <main className="isolate mx-auto max-w-3xl px-4 py-6 md:py-10 text-slate-100">
      <section className="relative overflow-hidden rounded-3xl bg-[#111418] border border-white/10 ring-1 ring-black/20 shadow-xl">
        <div className="p-5 md:p-8">
          <header className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  {broodje?.name ?? "Onbekend broodje"}
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Kies wat we <span className="font-medium text-slate-300">weglaten</span>.
                </p>
              </div>
              {typeof broodje?.price === "number" && (
                <div className="rounded-lg bg-[#0f1418] px-3 py-1.5 text-sm font-semibold text-slate-100 ring-1 ring-white/10">
                  {new Intl.NumberFormat("nl-BE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(broodje.price)}
                </div>
              )}
            </div>
            <div className="mt-4 h-1 w-full rounded-full bg-gradient-to-r from-sky-400/40 to-emerald-400/40" />
          </header>

          {/* Client UI met toggles voor weglaten */}
          <BroodjeCustomizerClient
            id={Number(id)}
            name={broodje?.name ?? "Broodje"}
            price={broodje?.price ?? 0}
            ingredients={ingredients}
          />
        </div>
      </section>
    </main>
  );
}


