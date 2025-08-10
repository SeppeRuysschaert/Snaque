"use client";
import { useEffect, useState } from "react";

export default function Hero() {
  const slogans = [
    "Snaque je honger, snel en lekker! 🍴",
    "Snaque tijd, niet in de rij. ⏳",
    "Snaque je lunch, vers op je bankje. 🥗",
    "Snaque: je favoriete hap in een klik. 📲",
  ];

  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade-out
      setTimeout(() => {
        setCurrentSloganIndex((prev) => (prev + 1) % slogans.length);
        setFade(true); // start fade-in
      }, 500); // wacht op fade-out voordat je wisselt
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[url('/food-bg.jpg')] bg-cover bg-center flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
      <h2 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
        Snel & Lekker op de Campus
      </h2>
      <p className="text-lg sm:text-xl text-white mt-4 max-w-2xl drop-shadow-md">
        Levering op campus tussen <strong>11.30u - 13.30u</strong> — verse
        producten, geen wachtrijen!
      </p>
      <p
        className={`mt-6 text-2xl sm:text-3xl font-semibold text-yellow-300 drop-shadow-lg transition-opacity duration-500 ease-in-out ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {slogans[currentSloganIndex]}
      </p>
    </header>
  );
}
