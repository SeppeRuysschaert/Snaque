// app/pasta/add/page.tsx
import PastaCustomizerClient from "@/components/pasta/PastaCustomizerClient";
import { PASTA_LIST } from "@/data/pasta";

const PRICE_BY_SIZE = { small: 6.5, medium: 8.5, large: 10.5 };


export default function PastaAddStandalone() {
  const sauces = ["Bolognese", "Carbonara", "Pesto", "Arrabbiata", "Vier kazen", "Roomsaus"];
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <h1 className="text-xl font-semibold text-slate-100">Pasta bestellen</h1>
      <PastaCustomizerClient baseName="Pasta" priceBySize={PRICE_BY_SIZE} sauces={sauces} />
    </main>
  );
}
