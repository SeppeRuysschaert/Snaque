export default function Info() {
  return (
    <section className="grid md:grid-cols-2 gap-8 px-8 py-12 bg-gray-50">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800">Waarom Snaque?</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Persoonlijke menu samenstelling</li>
          <li>Verse producten van lokale handelaars</li>
          <li>Levering op school, geen wachtrijen</li>
          <li>Snel en makkelijk online bestellen</li>
        </ul>
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800">
          Handig en snel!
        </h3>
        <p className="text-gray-700">
          Door verbouwingswerken is de kantine op de campus van de
          Arteveldehogeschool tijdelijk gesloten. Hierdoor hebben docenten en
          studenten op maandag geen toegang tot eten tijdens de middagpauze
          (broodjes, soep, warme maaltijden, desserts).
        </p>
        <p className="text-gray-700">📍 Stropkaai</p>
      </div>
    </section>
  );
}
