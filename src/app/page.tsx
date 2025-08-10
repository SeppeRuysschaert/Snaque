import Navbar from "@/components/Navbar";
import Hero from "@/components/homepage/Hero";
import Info from "@/components/homepage/Info";
import WeekPasta from "@/components/homepage/WeekPasta";

export default function Home() {

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Hero section */}
      <Hero />

      {/* Info blokken */}
      <Info />

      {/* Pasta van de week */}
      <WeekPasta />

      {/* Contact */}
      <footer className="bg-gray-900 text-white px-8 py-6 text-center">
        <h4 className="text-lg font-semibold">Contact</h4>
        <p>Email: info@snaque.be</p>
        <p>Tel: +32 123 45 67 89</p>
        <p className="mt-4 text-sm text-gray-400">
          © {new Date().getFullYear()} Snaque. Alle rechten voorbehouden.
        </p>
      </footer>
    </div>
  );
}
