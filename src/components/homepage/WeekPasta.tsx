import Image from "next/image";

export default function WeekPasta() {
  return (
    <section className="bg-white px-8 py-12 text-center">
      <h3 className="text-3xl font-bold text-gray-800 mb-4">
        Pasta van de Week
      </h3>
      <p className="text-gray-600 mb-6">
        Elke week een nieuwe, heerlijke pasta speciaal voor jou samengesteld.
      </p>
      <Image
        src="/images/pasta.webp" // placeholder
        alt="Pasta van de week"
        width={400}
        height={300}
        className="rounded-lg shadow-lg mx-auto"
      />
    </section>
  );
}
