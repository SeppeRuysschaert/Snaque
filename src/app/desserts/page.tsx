// app/desserts/page.tsx
import DessertsClient from "@/components/desserts/DessertsClient";
import Image from "next/image";

// 👉 Pas prijzen/teksten gerust aan naar de echte waarden
const desserts = [
  {
    id: 901,
    name: "Confituretaartje",
    price: 2.4, // EUR
    image: "/images/confiture.png",
    desc: "Zanddeeg met abrikozenconfituur en raster.",
  },
  {
    id: 902,
    name: "Rijsttaartje",
    price: 2.6, // EUR
    image: "/images/rijsttaart.png",
    desc: "Romige rijstvulling, goudbruin gebakken.",
  },
];

export default function DessertsPage() {
  return (
    <main className="isolate mx-auto max-w-6xl px-4 py-6 md:py-10 text-slate-100">
      <section className="relative overflow-hidden rounded-3xl bg-[#111418] border border-white/10 ring-1 ring-black/20 shadow-xl">
        <div className="p-5 md:p-8">
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Desserts</h1>
            <p className="mt-1 text-sm text-slate-400">Zoet afsluiten? Bestel je favoriet.</p>
            <div className="mt-4 h-1 w-full rounded-full bg-gradient-to-r from-rose-400/40 to-amber-400/40" />
          </header>

          <DessertsClient items={desserts} />
        </div>
      </section>
    </main>
  );
}


