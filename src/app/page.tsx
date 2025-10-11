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

      {/* Contact */}
      <footer
        className="mt-auto text-center px-8 py-8 border-t"
        style={{
          background:
            "linear-gradient(to bottom, rgba(24,0,173,0.28), rgba(24,0,173,0.18))",
          color: "#f4f5d3",
          borderColor: "rgba(255,255,255,.12)",
        }}
      >
        <h4 className="text-lg font-semibold tracking-wide opacity-90">Contact</h4>
        <p className="opacity-85">Email: snaque.catering@gmail.com</p>
        <p className="opacity-85">Tel: +32 489 33 71 51</p>
        <p className="mt-4 text-sm opacity-75">
          © {new Date().getFullYear()} Snaque. Alle rechten voorbehouden.
        </p>
      </footer>
    </div>
  );
}
