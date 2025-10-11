// app/pasta/special/[id]/page.tsx
import { notFound } from "next/navigation";
import PastaCustomizerClient from "@/components/pasta/PastaCustomizerClient";
import { SPECIAL_PASTA_LIST } from "@/data/pasta";

export default async function SpecialPastaPage({ params }: { params: any }) {
  const {id} = await params;
  console.log(id)
  const item = SPECIAL_PASTA_LIST.find((x) => x.id === Number(id));
  if (!item) return notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <h1 className="text-xl font-semibold text-slate-100">{item.name}</h1>
      <PastaCustomizerClient
        id={item.id}
        baseName={item.name}
        category="pasta_special"
        priceBySize={item.priceBySize}
        saucesEnabled={false}   // << geen sauskeuze
      />
    </main>
  );
}
