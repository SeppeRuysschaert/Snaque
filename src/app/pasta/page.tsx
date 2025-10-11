// app/pasta/page.tsx
import Pasta from "@/components/pasta/Pasta";
import SpecialPasta from "@/components/pasta/SpecialPasta";
import { PASTA_LIST, SPECIAL_PASTA_LIST } from "@/data/pasta";
import Link from "next/link";

export default function PastaPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 space-y-10">
      <section>
        <h1 className="text-2xl font-semibold text-slate-100">Sauzen</h1>
        <ul className="mt-4 grid sm:grid-cols-2 gap-4">
          {PASTA_LIST.map((p) => <Pasta key={p.id} item={p} />)}
        </ul>
        <div className="pt-4 flex justify-end">
          <Link
            href="/pasta/add"
            className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold bg-amber-500 text-black ring-1 ring-amber-400/60 hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            Pasta bestellen
          </Link>
        </div>
      </section>

      {SPECIAL_PASTA_LIST.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-slate-100">Specials</h2>
          <ul className="mt-4 grid sm:grid-cols-2 gap-4">
            {SPECIAL_PASTA_LIST.map((p) => <SpecialPasta key={p.id} item={p} />)}
          </ul>
        </section>
      )}
    </main>
  );
}
