"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Hero() {
  const slogans = [
    "Snaque je honger, snel en lekker! 🍴",
    "Snaque tijd, niet in de rij. ⏳",
    "Snaque je lunch, vers op je bankje. 🥗",
    "Snaque: je favoriete hap in een klik. 📲",
  ];

  const partners = [
    { src: "/images/mertens.jpeg", alt: "Partner 1", href: "#" },
    { src: "/images/basic.png",   alt: "Partner 2", href: "#" },
  ];

  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSloganIndex((prev) => (prev + 1) % slogans.length);
        setFade(true);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative bg-gradient-to-b from-[#1800ad]/40 to-[#0b1217] bg-cover bg-center flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
      {/* zachte overlay voor leesbaarheid */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.35)]" aria-hidden="true" />

      <div className="relative z-10 max-w-3xl">
        <h2 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
          Snel & Lekker op de Campus
        </h2>
        <p className="text-lg sm:text-xl text-white mt-4 drop-shadow-md">
          Levering op campus tussen <strong>11.30u - 13.30u</strong> — verse
          producten, geen wachtrijen!
        </p>
        <p
          className={`mt-6 text-2xl sm:text-3xl font-semibold text-[#f4f5d3] drop-shadow-lg transition-opacity duration-500 ease-in-out ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {slogans[currentSloganIndex]}
        </p>

        {/* Partners */}
        <div className="mt-10">
          <p className="text-sm tracking-wide text-white/80">In samenwerking met</p>
          <div className="mt-4 inline-flex items-center gap-6 rounded-2xl bg-white/10 backdrop-blur ring-1 ring-white/15 px-6 py-4">
            {partners.map((p) => {
              const img = (
                <Image
                  key={p.src}
                  src={p.src}
                  alt={p.alt}
                  width={240}      // ruimere intrinsic width (voor kwaliteit)
                  height={80}
                  className="h-14 sm:h-16 md:h-20 w-auto object-contain opacity-95 hover:opacity-100 transition"
                  priority
                />
              );
              return p.href ? (
                <a
                  key={p.src}
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center"
                  aria-label={p.alt}
                >
                  {img}
                </a>
              ) : (
                img
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
