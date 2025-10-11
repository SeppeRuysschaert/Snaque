// app/broodjes/[id]/page.tsx
import { broodjes } from "@/data/Broodjes";
import BroodjeCustomizerClient from "@/components/broodjes/BroodjesCustomizerClient"; // ✅ pad gefixt

// Server Component
export default async function AddBroodjePage({
  params,
}: {
  params: any;
}) {
  const { id } = await params;
  const broodje = broodjes.find((b) => b.id === Number(id));

  // Ingrediënten afleiden uit desc (comma/“en” gescheiden)
  const ingredients: string[] =
    (broodje?.desc ?? "")
      .replace(/—|–/g, ",")
      .replace(/\s+en\s+/gi, ",")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i) || [];

  return (
    <main className="isolate mx-auto max-w-3xl px-4 py-6 md:py-10 text-slate-100">
      <section
        className="
          relative overflow-hidden rounded-3xl
          border border-white/10 ring-1 ring-black/20 shadow-xl
          bg-white/5 backdrop-blur           /* ✅ neutrale panel i.p.v. zwart */
        "
      >
        <div className="p-5 md:p-8">
          <header className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight" style={{ color: "#f4f5d3" }}>
                  {broodje?.name ?? "Onbekend broodje"}
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Kies wat we <span className="font-medium text-slate-300">weglaten</span>.
                </p>
              </div>
              {typeof broodje?.price === "number" && (
                <div className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-semibold text-slate-100 ring-1 ring-white/12 bg-white/8">
                  {new Intl.NumberFormat("nl-BE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(broodje.price)}
                </div>
              )}
            </div>

            {/* subtiele beige accentlijn */}
            <div className="mt-4 h-1 w-full rounded-full bg-gradient-to-r from-[#f4f5d3]/40 via-transparent to-transparent" />
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
